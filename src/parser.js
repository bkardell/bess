/*global $:true*/

/**
 * Parser for Bess that manages the rule collecting, import downloading,
 * Module & Type registration and tagging original HTML elements
 * as parsed.
 *
 * @type {Object}
 */
Bess.Parser = {

  /**
   * The main parsing entry point.
   * Parses Bess source for rules and adds them to the global container.
   * @param  {String} source  original stylesheet source (pre-parse)
   * @param  {HTMLElement} element original element that provided the source
   */
  parse: function(source, element){
    var importsScan = new Bess.Scanner(source),
      rulesScan = new Bess.Scanner(source);
    this.parseAtRules(importsScan, element).then(function(){
      var rules = Bess.Parser.parseRules(rulesScan, element);
      Bess.rules = Bess.rules.concat(rules);
      $(element).attr(Bess.parsedAttr,'true');
      Bess.Engine.process();
    });
  },

  /**
   * Parses out all of the @rules, specifically the @import rules
   * which we care about since they will be used for including
   * other Bess Modules and Types.
   *
   * Example:
   *   @import package('best/evar.js');
   *   @import module('my/module.js');
   *   @import type('my/type.js');
   *
   * @param  {Bess.Scanner} scanner original source scanner
   * @param  {HTMLElement} element original element that provided the source
   */
  parseAtRules: function(scanner, element){
    var deferred = $.Deferred(),
      importType,
      importUrl,
      importPromise,
      imports = [],
      expressions = Bess.Utility.expressions(),
      makeImport = Bess.Utility.makeImportPromise;

    // helper to capture parts of the source till a regExp
    var captureUntil = function(s, regExp){
      var ret = s.capture(s.index, s.readUntil(regExp).index);
      s.advance();
      return ret;
    };

    //TODO: This could be cleaned up to make it a consolidated call
    //TODO: Should probably want to strip out all this pre-parse.
    scanner.skipWhitespace();
    scanner.skipMultiLineComment();

    if(scanner.isDone() || scanner.current !== '@'){
      deferred.resolve();
    } else {
      while(scanner.current === '@'){
        scanner.advance();
        // only take care of the import @rules (we care about these)
        if(scanner.sniff('import')){
          scanner.skipWhitespace();
          importType = captureUntil(scanner, expressions.isOpenParen);
          //TODO: Make a better capturing process that doesn't require advancement
          scanner.advance();
          importUrl = captureUntil(scanner, expressions.isQuote);
          importPromise = makeImport(importType, importUrl);
          imports.push(importPromise);
          scanner.readUntil(expressions.isAtSymbol);
        } else {
          scanner.readUntil(expressions.isAtSymbol);
        }
      }
      $.when.apply($, imports).then(function(){
        deferred.resolve();
      });
    }

    return deferred.promise();
  },

  parseRules: function(scanner, element){
    var rules = [],
      result,
      expressions = Bess.Utility.expressions();

    var skipAtRules = function(ctx){
      ctx.skipWhitespace();
      while(ctx.current === '@'){
        ctx.readUntil(expressions.isSemi).advance();
        ctx.skipWhitespace();
      }
      return ctx;
    };

    var addSelector=function(rule, str){
      //TODO: What is this check against closed paren for?
      if(str.match(/\)/g) && !str.match(/\(/g)){
        rule.selectors[rule.selectors.length-1] += ", " + str;
      }else{
        rule.selectors.push($.trim(str));
      }
    };

    var nextSelector = function(ctx, _rule){
      var begin,
        rule = _rule || { selectors :[], sourceIndex : ctx.index };
      ctx.skipWhitespace();
      ctx.skipMultiLineComment();
      begin = ctx.skipWhitespace().index;
      ctx.readUntil([expressions.isComma, expressions.isOpenBrace]);
      if(ctx.current === ',') {
        addSelector(rule, ctx.capture(begin, ctx.index));
        ctx.advance();
        return nextSelector(ctx,rule);
      } else if(ctx.current === '{') {
        addSelector(rule, ctx.capture(begin,ctx.index));
        ctx.advance();
        rule.declarations = nextDeclaration(ctx);
        return rule;
      } else {
        // return nothing in this event because we don't recognize it
        // as a selector and hence not a rule.
        return;
      }
    };

    var nextDeclaration = function(ctx, decl){
      var name,
        begin = ctx.skipWhitespace().index,
        declaration = decl || {};
      ctx.skipMultiLineComment();
      if(ctx.current !== "}"){
        ctx.readUntil(expressions.isColon);
        name = ctx.capture(begin, ctx.index);
        begin = ctx.advance().skipWhitespace().index;
        ctx.readUntil(expressions.isSemi);
        declaration[name] = ctx.capture(begin, ctx.index);
        ctx.advance();
        return nextDeclaration(ctx, declaration);
      }else{
        ctx.advance();
      }
      return declaration;
    };

    scanner = skipAtRules(scanner);
    scanner.skipWhitespace();
    scanner.skipMultiLineComment();

    // shortcircuit done with empty set
    if(scanner.isDone()){
      return rules;
    }

    result = this.parseRule(nextSelector(scanner), element);

    if(result.length > 0){
      rules = rules.concat(result);
    }

    return rules;
  },

  parseRule: function(rule, element){
    if(!rule) return;
    var relevantModules = {},
      selectorParts,
      parsedSelector,
      result = [],
      expressions = Bess.Utility.expressions(),
      specificity = Bess.Utility.Specificity.calculate,
      modules = Bess.Modules;

    // * At this point the rule is broken into declaration lines -
    // for each one determine all used modules for indexing later
    $.each(rule.declarations, function(property) {
      // *  * we collect the names of unique modules involved
      var test = property.match(expressions.behavior);
      if(test){
        var module = (test[2]) ? test[2] : test[1];
        if(module){
          relevantModules[module] = true;
        }
      }
    });

    // * Walk through each selector parsing it into final object
    // form that the Bess behavior engine uses...
    $.each(rule.selectors, function(i){
      var selector = rule.selectors[i];

      if (!$.isEmptyObject(relevantModules)) {
        selectorParts = selector.split(expressions.pseudo);

        parsedSelector = {
          pseudo: selectorParts.pop(),
          select: selectorParts.join(':'),
          boundFrom: element
        };

        parsedSelector.score = specificity(parsedSelector.select);

        $.each(relevantModules, function(name) {
          var module = modules.find(name);
          if(module){
            parsedRule = Bess.Parser.parseDeclaration(rule.declarations, name, module.properties);
            //TODO: I'd prefer this rule building be located outside the parser - maybe in Utility?
            result.push({ ruleId: rule.sourceIndex, selector: parsedSelector, declaration: parsedRule, module: name });
          } else {
            throw 'Rule not parsed. Failed to find a module: ' + name + ' even though it\'s marked as relevant.';
          }
        });

      }
    });

    return result;
  },

  parseDeclaration: function(declarations, module, properties) {
    // * Start with a clean slate... This is what we're building..
    var declaration = {},
      // * A separate view for shorthands which we will default to be the same
      // just so we always have an o.
      o = declarations,
      // * Look for a 'raw' property value (no dash properties)
      shorthand = declarations[module];
    // * If it is a shorthand, we want to parse it into long form.
    if(shorthand){
      // * * Note that we are creating a _new_ o here, so we can use o below here the
      // same way regardless of where it came from... 'declarations - you are dead to me'...
      o = $.extend({}, this.parseShorthand(shorthand, module, properties), declarations);
    }

    // parseOne is responsible for making sure that our declaration object
    // has a fully bess-ready/compiled version of each property/value represented
    // attached to it and ready to be sent back
    var parseOne = function(prop) {
      // * The name of the property we are looking for
      var name = module + '-' + prop,
        // * Look for it...
        inst = o[name];
      // * If we didn't find it - just keep truckin'...
      // Some properties are optional and the way CSS is applied it is possible
      // to split them across multiple rules anyway.
      if(inst){
        // * * ok so... Shorthands have been expanded at this point, so some declarations
        // will already be inflated/parsed (plain objects) that we can just attach to the
        // final thing we're building - and others will still be strings that still need parsing...
        declaration[prop] = ($.isPlainObject(inst)) ? inst : Bess.Parser.parseValues(new Bess.Scanner(inst))[0];
      }
    };

    // * walk the module's property definitions and call parseOne for each
    $.each(properties, function(i,n) { parseOne(n); });

    // * Done.
    return declaration;
  },

  parseShorthand: function(str, module, properties){
    var a = this.parseValues(new Bess.Scanner(str),true),
      resetCounter = 0,
      propIndex = 0,
      temp = {};

    for(var i=0;i<a.length;i++){
        if(i<properties.length){
          temp[module + "-" + properties[propIndex]] = {};
        }
        if(a[i].x){
          propIndex = 0;
          resetCounter++;
        }
        temp[module + "-" + properties[propIndex]][resetCounter+""] = a[i];
        propIndex++;
    }
    return temp;
  },

  parseValues: function(s,sh){
    // * The current value we've parsed
    var val,
      // * The thing we're building up
      values = [],
      // * A counter used for multiplicity indexing and iteration
      i=0,
      // * Used for multiplicity indexed properties for non-shorthand
      temp={};

    // * Keep doing this until next value returns a falsey value
    for(i;;i++){
      // * * Grab the next one...
      val= this.nextValue(s);
      if(val){
        // * * * Set the multiplicity index
        temp[i] = val;
        // * * * If it is shorthand, we want to collect the raw values as shorthand
        // multiplicity is handled higher up, otherwise we want to collect the
        // multiplicty indexed object
        values.push((sh) ? val : temp);
      }else{
        // * * * Done.
        return values;
      }
    }
  },

  nextValue: function(s){
    var v,
      expressions = Bess.Utility.expressions();
    // * As long as there isn't nothing but whitespace until the end of the file...
    // (that would be an error btw since in order to be valid we would need a semi to
    // end this property value and a close brace to close the declarations for the rule).
    // It's here to prevent dumb things like an infinite loop from happening when you have
    // some malformed rules or something.
    if(!s.skipWhitespace().isDone()){
      if(s.current==="'"){
        // * * * If we hit a comma, we try to parse out the next string
        return { resolver: 'string', arg: this.nextExpression(s.advance(), expressions.isQuote) };
      }else if(expressions.isNumeric.test(s.current)){
        // * * * If we hit a numeric, we're going to parse that out as a string too for now
        return { resolver: 'number', arg: this.nextExpression(s, [expressions.whiteSpace, expressions.isSemi]) };
      }else if(expressions.isComma.test(s.current)){
        // * * * If we hit a comma, we're going to parse that out as part of a shorthand (see next else)
        v = this.nextValue(s.advance());
        v.x = true;
        return v;
      }else{
        // * * * The above are the only valid primitive identifiers for this space,
        // anything else we will parse out as a function.. We start by priming
        // the resolver and calling nextExpression
        var temp = { resolver: this.nextExpression(s, expressions.isOpenParen), arg: [] };
        // * * * It is possible that for some function, no arguments could be valid,
        // if that's the case, we are done...
        if(expressions.isCloseParen.test(s.current)){
            s.advance();
            return temp;
        }
        // * * * Otherwise, we have to keep reading values as arguments to this function...
        v = this.nextValue(s,true);
        while(v){
          temp.arg.push(v);
          // * * * * For simplicity, we advance past whitespace and then one more character
          s.skipWhitespace().advance();

          // * * * * If the last character is not a comma, we are done...
          // Otherwise, keep collecting...
          if(!expressions.isComma.test(s.peek(-1))){
              break;
          }
          v = this.nextValue(s,true);
        }
        // * * * Done...
        return temp;
      }
    }
  },

  nextExpression: function(s, expression){
    var ret = s.capture(s.index, s.readUntil(expression).index);
    s.advance();
    return ret;
  }

};