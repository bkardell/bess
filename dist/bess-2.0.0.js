/*global $:true*/

/**
 * Behavior Stylesheet
 *
 * @type {Object}
 */
var Bess = {

  /**
   * Current version of Bess
   * @type {String}
   */
  version: '2.0.alpha1',

  /**
   * Key for the attribute used on HTML Elements that are loaded
   * but not yet parsed by Bess.
   * @type {String}
   */
  loadedAttr: 'data-bess-loaded',

  /**
   * Key for the attribute used on HTML Elements that are loaded
   * and parsed by Bess.
   * @type {String}
   */
  parsedAttr: 'data-bess-parsed',

  /**
   * Type used by HTML Elements to declare themselves as Bess rules
   * sources.
   * @type {String}
   */
  type: 'text/bess',

  /**
   * This is the main collection of rules parsed and loaded for Bess.
   * @type {Array}
   */
  rules: [],

  /**
   * Collection of document level handlers for Bess behaviors.
   * @type {Array}
   */
  handlers: [],

  /**
   * Main initialization of the Bess engine. Inspects for Bess type link/style
   * and then parses for Bess rules.
   */
  init: function(){
    var linkSelector = 'link[type="' + Bess.type + '"]',
      styleSelector = 'style[type="' + Bess.type + '"]',
      linkTags,
      styleTags,
      parse = Bess.Parser.parse;

    // query the DOM for links and styles to inspect for Bess types.
    linkTags = $(linkSelector);
    styleTags = $(styleSelector);

    // short-circuit if no bess
    if(!linkTags.length && !styleTags.length){
      return;
    }

    // Borrowed code to detect whether a medium applies in the same manner you would CSS
    // See: http://www.w3.org/TR/cssom-view/#the-media-interface
    var mediumApplies = (window.media && window.media.query) || function(str) {
      if (!str) return true; // if no descriptor, everything applies
      if (str in media) return media[str];
      var style = $('<style media="' + str + '">body {position: relative; z-index: 1;}</style>').appendTo('head');
      // * the [x,y][0] is a silly hack to evaluate two expressions and return the first
      return media[str] = [$('body').css('z-index') == 1, style.remove()][0];
    };

    // iterate through links and download each for parsing
    if(linkTags.length){
      linkTags.each(function(){
        var link = $(this),
          enabled = !this.disabled,
          nonHTTP = !(/^\w+:/.test(link.attr('href'))),
          goodMedium = mediumApplies(this.media),
          notBessLoaded = !link.attr(Bess.loadedAttr);
        if(enabled && nonHTTP && goodMedium && notBessLoaded){
          $.get(this.href, function(source){
            // send the actual link and not the jQuery object
            parse.call(Bess.Parser, source, link.context);
            link.attr(Bess.loadedAttr,'true');
          }, 'text');
        }
      });
    }

    // iterate through styles and parse each
    if(styleTags.length){
      styleTags.each(function(){
        var style = $(this),
          enabled = !this.disabled,
          notBessLoaded = !style.attr(Bess.loadedAttr);
        if(enabled && notBessLoaded){
          parse.call(Bess.Parser, this.innerHTML, this);
          style.attr(Bess.loadedAttr,'true');
        }
      });
    }
  }

};

/**
 * The pattern for initializing Bess is to determine document readiness
 * and initialize afterwards. This is important to assure resources
 * and DOM are ready for our manipulation to the link/style etc.
 */
if(!$.isReady){
  $(document).ready(Bess.init);
}else{
  Bess.init();
}

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
/**
 * String Scanner used to facilitate the Bess.Parser
 *
 * @param {String} source the original source to scan
 */
Bess.Scanner = function(source){
  this.source = source;
};

/**
 * Prototype of each Scanner instance
 *
 * @type {Object}
 */
Bess.Scanner.prototype = {

  toString: function(){
    return this.source;
  },

  // - The current character - BEGIN is guaranteed to never be a valid non-start state
  // in the wild as, by definition it is not a character.
  current:'BEGIN',

  // - The current regex test
  test: null,

  // - We track the current index and the tail index
  index: 0,

  tailIndex: function(){
    return this.source.length-1;
  },

  // - You can move the current index forward
  setIndex:   function(index){
    this.current = this.source[index]; this.index=index; return this;
  },

  // - Advance the current index until the specified test(s) are true.
  readUntil: function(regexs){
    var c,
      x = 0,
      regs = (regexs.length) ? regexs : [regexs];
    for(this.index; this.index <= this.tailIndex(); this.index++){
      c = this.source.charAt(this.index);
      for(x=0; x < regs.length; x++){
        if(regs[x] && regs[x].test(c)){
          this.current = c;
          this.test = regs[x];
          return this;
        }
      }
    }
    return this;
  },

  //Match the provided string and advance the length before returning
  sniff: function(s) {
    var test = this.source.substr(this.index, s.length);
    if(test === s) {
      this.index += s.length;
      this.current = this.source.charAt(this.index);
      return true;
    }
    return false;
  },

  // - Substring method from the original string being scanned...
  capture: function(s,e){
    return this.source.substring(s,e);
  },

  // - Finds the next index of a literal character after current pointer...
  nextIndexOf: function(lit){
    return this.source.indexOf(lit,this.index);
  },

  // - Finds the last index of a literal character before the tail pointer...
  tailIndexOf: function(lit){
    return this.source.lastIndexOf(lit,this.tailIndex());
  },

  // - Look forward or backward some number of characters without changing current...
  peek: function(i){
    return this.source.charAt(this.index+(i||1));
  },

  // - Returns true when current pointer has moved the number of characters in limit
  // or reaches the tail...
  isDone: function(limit){
    return (this.index>=(limit || this.tailIndex()));
  },

  // - Move the current pointer forward or backwards n spaces.
  advance: function(n){
    this.index = this.index + (n||1);
    this.current = this.source.charAt(this.index);
    return this;
  },

  skipMultiLineComment: function(){
    if(this.current === '/' && this.peek() === '*'){
      this.setIndex(this.nextIndexOf('*/')).advance(2);
      this.skipWhitespace();
    }
  },

  // - Advance current to the next non-whitespace character
  skipWhitespace: function(){
    this.readUntil([/\S/]);
    return this;
  }
};
/*global $:true*/

/**
 * Bess Engine
 *
 * @type {Object}
 */
Bess.Engine = {

  /**
   * This is the main entry point for the Engine. It will inspect
   * the Bess.rules and attach proper behaviors according to their
   * declarations.
   */
  process: function(){
    if(Bess.rules.length === 0){
      return; // no rules - no joy!
    }
    var sortedRules = Bess.Utility.Specificity.sort(Bess.rules),
      attach = this.attach;
    $.each(sortedRules, function(index, rule){
      attach(rule);
      // TODO: Manage the problem of rules showing up for html-inserted DOM
    });
  },

  /**
   * Manages the binding of the behavior to the DOM elements matched
   * by the rule.
   * @param  {Object} rule rule information
   */
  attach: function(rule){
    var pseudo = rule.selector.pseudo,
      selector = rule.selector,
      state = Bess.Utility.mapEventName(pseudo);

    $(rule.selector.select).live(state, rule, Bess.Utility.globalHandler);

    if(!Bess.handlers[state]){
      $(document).bind(state, function(e) {
        var merged = {},
          actionable,
          currentTarget = $(e.currentTarget);

        if (e.actionable) {

          if (e.type === 'html-inserted') {
            if (e.target.bess_dom_inserted) {
              return false;
            } else {
              e.target.bess_dom_inserted = true;
            }
          }

          if (e.type === 'html-modified' && (e.currentTarget !== e.target)) {
            return;
          } else if(e.type.indexOf('post-') !== -1) {
            e.currentTarget = e.target; /* TODO: added bk during open-bess ... this plan needs work */
          } else if(e.type === 'html-inserted' && (e.currentTarget !== e.target)) {
            e.currentTarget = e.target;
            // edge case for IE where IE has FORM in current instead of target in a submit event type
          } else if (e.type === 'submit' && e.target.tagName && e.target.tagName === 'BUTTON') {
            e.target = e.currentTarget;
          }

          for (var i = 0; i < e.actionable.length; i++) {
            actionable = e.actionable[i];
            // * * * * * Collect it if isn't a repeat (because nested matches will cause a problem with property resolution)
            merged[actionable.module] = merged[actionable.module] || {};
            // * * * * * Collect it if it matches the selector / pseudo
            if (actionable.selector.pseudo == pseudo &&
              ($(e.target).is(actionable.selector.select) || $(e.currentTarget).is(actionable.selector.select))) {
              $.extend(merged[actionable.module], actionable.declaration);
            }
          }

          var errorHandler = function (a, b) {
            if (a.topic) {
              currentTarget.trigger('error');
            } else if (a.target) {
              a.target.trigger('error');
            }
          };

          var handler = function(){
            for(var modName in merged) {
              var module = Bess.Modules.find(modName);
              if(module){
                var properties = Bess.Utility.multiplicityToArray(merged[modName]);
                for (var p = 0; p < properties.length; p++) {
                  var moduleDefinition = $.extend({}, module.defaults, properties[p]);
                  moduleDefinition.apply = module.apply;
                  Bess.Resolver.resolveModule(moduleDefinition, currentTarget, e.message, errorHandler);
                }
              }
            }
          };

          Bess.Utility.wrapAspects(pseudo, currentTarget, handler);

        }
      });
      Bess.handlers[state] = true;
    }
  }
};
/*global $:true*/

/**
 * Bess Property resolver
 * @type {Object}
 */
Bess.Resolver = {

  resolveModule: function(module, jQueryObj, eventMessage, errorHandler){
    var instance = {}, property;

    var watcher = Bess.Utility.watcher(instance, module, jQueryObj);

    for(property in module){
      if(module[property].resolver){
        if(module[property].arg === 'none'){
          delete module[property];
        }else{
          watcher.count++;
        }
      }
    }

    try{
      for(property in module){
        if(module[property].resolver){
          this.resolveProperty(property, module[property], jQueryObj, watcher, eventMessage, errorHandler);
        }
      }
    }catch(e){
      errorHandler(instance, e);
    }
  },

  resolveProperty: function(property, definition, jQueryObj, watcher, eventMessage, errorHandler){
    var rules = [definition],
      currentArg = definition.arg;

    var buildStack = function(definition, rules){
      if(definition.arg.resolver){
        rules.push(definition.arg);
        buildStack(definition.arg, rules);
      }
    };

    if(!$.isArray(definition.arg)){
      buildStack(definition, rules);
    }

    var setAndReturnSelector = function(value, defalt){
      var selector = value.replace(/th\(index\)/g,'th('+ jQueryObj.index() +')');
      return (typeof value === 'string' && Bess.Utility.uniqueId(jQueryObj, selector)) || defalt;
    };

    var setVal = function(count, data, callback){
      return function(p,v){
        count--;
        data[this.i] = setAndReturnSelector(v,v);
        if(count === 0){
          callback(data);
        }
      };
    };

    /* returns an array */
    var all = function(args, callback){
      var definition,
        data = [],
        i = 0,
        watcher;
      while(args.length > 0){
        definition = args.shift();
        watcher = {
          i: i++,
          setVal: setVal(args.length, data, callback)
        };
        this.resolveProperty(property, definition, jQueryObj, watcher, eventMessage);
      }
    };

    var next = function(array){
      if(!array || !array.pop){ return; }
      var definition = array.pop();
      if($.isArray(definition.arg)){
        all(definition.arg.slice(0),function(args){
          if(type_resolvers[definition.resolver]){
            try{
              type_resolvers[definition.resolver](jQueryObj, args, watcher, property, eventMessage);
            }catch(e){
              errorHandler(definition.resolver, e);
            }
          }else{
            Logger.error("unknown type resolver: '" + definition.resolver + "'");
          }
        });
      }else{
        currentArg = setAndReturnSelector(definition.arg,currentArg);
        w = (array.length === 0) ? watch : {
          setVal: function(p,v){
            currentArg = setAndReturnSelector(v,v);
            next();
        }};
        if(type_resolvers[definition.resolver]){
          try{
            type_resolvers[definition.resolver](jQueryObj,[currentArg],w,prop,msg);
          }catch(e){
            errorHandler(definition.resolver, e);
          }
        }else{
          Logger.error("unknown type resolver: '" + definition.resolver + "' should it be in an array?");
        }
      }
    };
    next(rules);
  }

};

/**
 * Collection of Modules within this Bess instance.
 *
 * @type {Object}
 */
Bess.Modules = {

  cache: [],

  find: function(name){
    return this.cache[name];
  },

  /**
   * Adds a Module to the Bess engine for use in parsing and
   * execution of rules
   * @param  {String} name   name of the module
   * @param  {Function} module information to execute during runtime
   */
  register: function(name, module){
    this.cache[name] = module;
  }

};
/*global $:true*/

/**
 * A set of utilities used throughout Bess.
 *
 * @type {Object}
 */
Bess.Utility = {

  /**
   * Collection of Regular Expressions used in parsing.
   * @return {Object} hash of regexes
   */
  expressions: function(){
    var regExs = {
      isQuote: /\'/,
      isNumeric: /\d/,
      isSemi: /\;/,
      isOpenParen: /\(/,
      isCloseParen: /\)/,
      isOpenBrace: /\{/,
      isComma: /\,/,
      isColon: /\:/,
      isAtSymbol: /\@/,
      whiteSpace: /\s/,
      behavior: /^\-be\-([^\-]*)|^([a-z]*[A-z]*)/,
      pseudo: /\:/,
      pre: /\([^\)]+\)/,
      ids: /#[\d\w\-_]+/g,
      cls: /[\.:\[][^\.:\[+>]+/g,
      tag: /(^|[\s\+>])\w+/g
    };
    regExs.chop = [regExs.ids, regExs.cls, regExs.tag];
    return regExs;
  },

  /**
   * Helper functions for Selector specificity
   * @type {Object}
   */
  Specificity: {

    /**
     * Calculates the specificity of a Selector
     * @return {Number} An hexadecimal value
     */
    calculate: function(selector){
      var expressions = Bess.Utility.expressions();
      var s = selector.replace(expressions.pre,"");
      return parseInt(expressions.chop.map(function(p){
        var m = s.match(p);
        return m ? m.length.toString(16) : 0;
      }).join(''), 16);
    },

    /**
     * Sorts a collection of rules based on Specificity score of selectors
     * @param  {Array} rules collection of rules
     * @return {Array}           sorted rules
     */
    sort: function (rules) {
      return rules.sort(function (a, b) {
        return a.selector.score > b.selector.score ? 1 : (a.selector.score < b.selector.score) ? -1 : 0;
      });
    }

  },

  /**
   * Creates a jQuery Deferred for downloading the @import
   * @param  {String} type name of the type we're importing (package|module|type)
   * @param  {String} url  URL path for downloading
   * @return {Function}      Deferred promise
   */
  makeImportPromise: function(type, url){
    var deferred = $.Deferred();
    //TODO: We need a reliable download methodology.
    // - I'd prefer not to have RequireJS as a dependency.
    $.get(url, function(source){
      //TODO: This is horseshit here .. inspect the type and then register
      eval(source);
      deferred.resolve();
    }, 'text');
    return deferred.promise();
  },

  /**
   * Collection of resolver helpers.
   * @type {Object}
   */
  Resolvers: {
    string: function(s){
      return { resolver: 'string', arg: s || '' };
    },
    find: function(selector){
      return { resolver: 'find', arg: [this.string(selector || ':self')] };
    },
    object: function(code){
      return { resolver: 'object', arg: code || '{}' };
    }
  },

  /**
   * Universal event handler for all Bess rules
   * @param  {Event} e   original event
   * @param  {String} msg event message
   */
  globalHandler: function(e, msg) {
    e.preventDefault();
    // * If there isn't an to add actionable properties to, add one.
    if (!e.actionable) {
      e.actionable = [];
      e.actionableIds = [];
      e.target = e.currentTarget || e.target;
    }
    if ($.inArray(e.data.module + ':' + e.data.ruleId, e.actionableIds) === -1) {
      e.message = msg;
      // * Populate the data so that the end of the chain gets it all
      e.actionable.push(e.data);
      e.actionableIds.push(e.data.module + ':' + e.data.ruleId);
    }
  },

  /**
   * Maps an event name to a proper state
   * @param  {String} name name of event
   * @return {String}      mapped state name
   */
  mapEventName: function (name) {
    var map = {
      clicked : 'click',
      changed : 'change',
      blurred : 'focusout',
      'validated' : 'submit'
    };
    var n = (map[name]) ? map[name] : name;
    // * Tricky... Some of the CSS states are still in flux and so we have to kind of shim them
    // to their browser specific version.  It would probably behoove us to develop a better pattern
    // than just a simple map and this function.
    if (name == 'transitioned') {
      if ($.browser.webkit) {
        n = 'webkitTransitionEnd';
      } else if ($.browser.opera) {
        n = 'oTransitionEnd';
      } else if ($.browser.mozilla) {
        n = 'transitionend';
      } else {
        n = 'transitionend';
      }
    }
    return n;
  },

  /**
   * Helper function to setup pre and post events for designated state
   * @param  {String}   state name of the state to wrap
   * @param  {Function} fn    handler for event
   * @param  {Object}   jQObj     jQuery object involved in events
   */
  wrapAspects: function (state, jQObj, fn) {
    jQObj.queue('pseudo', [ function () {
      jQObj.trigger('pre-' + state).dequeue('pseudo');
    }, function () {
      fn();
      jQObj.dequeue('pseudo');
    }, function () {
      jQObj.trigger('post-' + state).dequeue('pseudo');
    } ]);
    jQObj.dequeue('pseudo');
  },

  /**
   * Flattens module property values.
   * @param  {[type]} def [description]
   * @return {[type]}     [description]
   */
  multiplicityToArray: function (def){
    var unique = function (def) {
      var ret = {};
      var prop = null;
      var id = null;
      for (prop in def) {
        var o = def[prop];
        for (id in o) {
          ret[id] = true;
        }
      }
      return ret;
    };
    var ret = [];
    var cur;
    var list = unique(def);
    var item = null;
    for (item in list) {
      cur = {};
      for (var prop in def) {
        if (!def[prop][item]) {
          return ret;
        }
        cur[prop] = def[prop][item];
      }
      ret.push(cur);
    }
    return ret;
  },

  /**
   * Creates an object that tracks the setting of property values and
   * then once all set - apply them with the modules applier
   * @param  {Object} instance  object to hold values
   * @param  {Bess.Module} module    module to interact with
   * @param  {Object} jQueryObj the jQuery object to target with module applier
   * @param  {Function} setVal function to set the value and manage the semaphor/callback
   */
  watcher: function(instance, module, jQueryObj, setVal){
    return {
      count: 0,
      setVal: setVal || function(property, value){
        instance[property] = value;
        this.count--;
        if(this.count === 0){
          module.apply(instance, jQueryObj);
        }
      }
    };
  },

  /**
   * Sets a unique ID attribute on a jQuery object and returns
   * a selector for it.
   * @param  {Object} jQueryObj jQuery object to set
   * @param  {String} selector  selector string to return with new ID
   */
  uniqueId: function(jQueryObj, selector){
    if (!jQueryObj.attr('id')) {
      jQueryObj.attr('id', "bess_" + $.now());
    }
    return selector.replace(":self", "#" + jQueryObj.attr('id'));
  }
};