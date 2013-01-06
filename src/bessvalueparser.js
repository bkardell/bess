define(
    [
		'src/extendedjquery',
        'src/stringscanner',
        'src/modules',
        'src/typeresolvers',
        'src/logging'
    ],
    function($, StringScanner, Modules, typeResolvers, Logger) {

		var moduleImports = 0; /* Module counter during parsing (semaphore) */
		
        return (function($) {
            // Numerous regular expressions that we will use in parsing...
            var re = {
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
            re.chop=[re.ids,re.cls,re.tag];

            if (!('map' in Array.prototype)) {
				Array.prototype.map= function(mapper, that /*opt*/) {
					var other= new Array(this.length);
					for (var i= 0, n= this.length; i<n; i++) {
						if (i in this) other[i] = mapper.call(that, this[i], i, this);
					}
					return other;
				};
			}


            // Used for calculating the specificity of a selector
            var specificity = {
                calc:function(s){
                    s=s.replace(re.pre,"");
                    return parseInt(
                        re.chop.map(
                            function(p){
                                var m=s.match(p);
                                return m ? m.length.toString(16) : 0;
                            }).join(''),16
                    );
                }
            };

            // Given a string of BESS rules and (optionally) a style element
            // from where it originates - parses the textual rules into
            // bess rule objects and (if the element is provided) marks the
            // tag as "bess_parsed" to ensure that it does not create duplicate
            // rules or re-parse unnecessarily.
            var parseBess = function(str, el) {
				var rules = [], dfd = $.Deferred();
				// - Parsing is a two-step process, both of which use string scanning.
				// The scan for @ rules and imports modules. Once completed rules can go.
				$.when(
					parseAtRules(StringScanner.create(str), el)
				).then(function(){
                    rules = parseRules(StringScanner.create(str), el);
                    // If provided, we mark the source element as parsed...
                    if(el){
                        (el).attr('bess_parsed','true');
                    }
					dfd.resolve(rules);
				}); 
				return dfd.promise();
            };

			var makeImportPromise = function(type,url) {
				var dfd = $.Deferred();
				//TODO: Add extension here but also consider min suffix as well
				require([url], function(x){
					if(x){
						if(type==='module'){
							Logger.debug('resolved module ' + x.name + " at " + new Date().getTime());
							Modules.cache[x.name] = x;
						}else if(type==='type'){
							//can't .name a function :(
							typeResolvers[x.typeName] = x;
						}
					}else{
						Logger.error('Unable to find ' + type + " at " + url);
					}
					dfd.resolve();
				});
				return dfd.promise();
			};

			// __Parse Phase I__ - Locate any @ rules and import them 
			var parseAtRules = function(ctx, el) {
				var dfd = $.Deferred(), imports = [], importType;
				ctx.skipWhitespace();
				if(ctx.isDone()) dfd.resolve();
				skipComments(ctx);
				if(ctx.current !== '@'){
					dfd.resolve();
				}else{
					while(ctx.current === '@'){
						ctx.advance();
						if(ctx.sniff('import')){
							ctx.skipWhitespace();
							importType = nextFunctional(ctx);
							imports.push(
								makeImportPromise(importType,nextString(ctx))
							);
							ctx.advance().readUntil(re.isAtSymbol);
						}
					}
					$.when.apply($, imports).then(function(){
						dfd.resolve();
					});
				}
				return dfd.promise();
			};

			var skipComments = function(ctx){
				if(ctx.current==='/' && ctx.peek()==='*'){
                    ctx.setIndex(ctx.nextIndexOf('*/')).advance(2);
                    ctx.skipWhitespace();
                    return true;
                }
			};

            // __Parse Phase I__  - Look for the beginning of the next rule - skip whitespaces
            // and comments, parse the rule from results of next selector. 
            var parseRules = function(ctx, el){
				var rules = [], rule = null, rs;
				// because there might be @ rules
				ctx = skipAtRules(ctx);
				ctx.skipWhitespace();
				// shortcircuit done with empty set
				if(ctx.isDone()) return rules;
				skipComments(ctx);
                rs = parseRule(nextSelector(ctx), el);
				while(rs){
					if(rs){
						rules = rules.concat(rs);
					} else {
						Logger.debug("No rule returned during parseRules loop.");
					}
                    rs = parseRule(nextSelector(ctx), el);
                }
				return rules;
            };

			// __Parse Phase I__  - Roll through context until @ rules are passed
			var skipAtRules = function(ctx){
				ctx.skipWhitespace();
				if(ctx.sniff('@')){
					ctx.readUntil(re.isSemi).advance();
					return skipAtRules(ctx);
				}
				return ctx;
			};

			// This was onRule callback
			var parseRule = function(rule, el){
				// if no rule was provided return nothing - shortcircuit
				// ---- this means nextSelector found nothing and returned
				if(!rule) return;
                    //  *  * These are the modules this rule mentions...
                var relevantModules = {},
                    //  *  * These are temporary, tokenized parts of a selector...
                    selectorParts,
                    //  *  * This is the final bess version of a selector object...
                    parsedSelector,
					//  *  * This is the result of the rule parsing
					result = [];

                // * At this point the rule is broken into declaration lines -
				// for each one determine all used modules for indexing later
                $.each(rule.declarations, function(prop, propIns) {
                    // *  * we collect the names of unique modules involved
                    var test = prop.match(re.behavior);
                    if (test) {
                        var p = (test[2]) ? test[2] : test[1];
                        if(p){
                            relevantModules[p] = true;
                        }
                    }
                });

                // * Walk through each selector parsing it into final object
                // form that the Bess behavior engine uses...
                $.each(rule.selectors, function(i){

                    var selector = rule.selectors[i];
                    if (!$.isEmptyObject(relevantModules)) {
                        selectorParts = selector.split(re.pseudo);
                        parsedSelector = {
                            pseudo: selectorParts.pop(),
                            select: selectorParts.join(':'),
                            boundFrom: el,
                            ruleId: rule.pid
                        };
                        parsedSelector.score = specificity.calc(parsedSelector.select);

                        // * * Now walk each unique module...
                        $.each(relevantModules, function(name) {
                            // * * * grab the appropriate module instance from the bess engine
                            var module = Modules(name);
                            // * * * _Begin Parse Phase II_ - parse the details of the declaration
                            parsedRule = parseDeclaration(rule.declarations, name, module.properties);
                            // * * * Collect the rule
                            result.push({
                                selector: parsedSelector,
                                declaration: parsedRule,
                                module: name
                            });
                        });
                    }
                });

				return result;
			};

			// __Parse Phase I__  - Fills out the rule by reading forward watching
			// for commas (collect a selector to add)
			// and opening braces (collect the declarations).
			var nextSelector = function(ctx, _rule){
				var begin,
					rule = _rule || { selectors :[], pid : ctx.index };
				ctx.skipWhitespace();
				skipComments(ctx);
				begin = ctx.skipWhitespace().index;
				ctx.readUntil([re.isComma,re.isOpenBrace]);
				if(ctx.current===',') {
					addSelector(rule,ctx.capture(begin,ctx.index));
					ctx.advance();
					return nextSelector(ctx,rule);
				} else if(ctx.current === '{') {
					addSelector(rule,ctx.capture(begin,ctx.index));
					ctx.advance();
					// * begin the declaration collecting, providing initial empty
					//TODO: move initial empty decl to the function itself
					rule.declarations = nextDeclaration(ctx,{});
					return rule;
				} else {
					// return nothing in this event because we don't recognize it 
					// as a selector and hence not a rule.
					return;
				}
			};

            // __Parse Phase I__ - Trim the selector string and add it to the rule's collection
            var addSelector=function(rule,str){
				//TODO: What is this check against closed paren for?
                if(str.match(/\)/g) && !str.match(/\(/g)){
                    rule.selectors[rule.selectors.length-1] += ", " + str;
                }else{
                    rule.selectors.push($.trim(str));
                }
            };

            // __Parse Phase I__ -  Fills out the declarations by reading forward,
            // skipping whitespace and comments and watching for the next
            // non-closing brace to signify the beginning of the next declaration
            // which it captures until the next semi and keeps calling itself
            // recursively until it reaches semi.
            var nextDeclaration=function(ctx,decl){
                var name, begin = ctx.skipWhitespace().index;
                if(skipComments(ctx)){
                    return nextDeclaration(ctx,decl);
                }
                if(ctx.current!=="}"){
                    ctx.readUntil(re.isColon);
                    name = ctx.capture(begin,ctx.index);
                    begin = ctx.advance().skipWhitespace().index;
                    ctx.readUntil(re.isSemi);
                    decl[name] = ctx.capture(begin,ctx.index);         //trimming?
                    ctx.advance();
                    nextDeclaration(ctx,decl);
                }else{
                    ctx.advance();
                }
                return decl;
            };

            // __Parse Phase II__ - Parses a group of declarations for a module into
            // the final object form used by the bess engine.
            var parseDeclaration = function(declarations, module, properties) {
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
                    o=$.extend({},parseShorthand(shorthand,module,properties),declarations);

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
                        declaration[prop] = ($.isPlainObject(inst)) ? inst : parseValues(StringScanner.create(inst))[0];

                    }
                };

                // * walk the module's property definitions and call parseOne for each
                $.each(properties, function(i,n) {
                    parseOne(n);
                });

                // * Done.
                return declaration;
            };

            // __Parse Phase II__ - parse shorthand iterates the module's properties
            // definition and builds out the long form/inflated object version of it, keeping in mind
            // multiplicity.  In Bess, multiplicity is much simpler than CSS - all multiples are treated
            // like you would think shorthand multiplicity would work - there is no attempt to 'balance'
            // the matrix of values - rather each 'column' is an independent definition and defaults apply
            // as they would in any other CSS...
            var parseShorthand = function(str,module,properties){
                var a=parseValues(StringScanner.create(str),true), resetCounter = 0, propIndex = 0, temp = {};
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
            };

            // __Parse Phase II__ - Parse values from scanner (s) and return an array of values...
            // Needs to know if it is shorthand (sh boolean) as those values have
            // been set in a slightly different state by this point
            var parseValues = function(s,sh){
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
                    val=nextValue(s);
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
            };

            // __Parse Phase II__ - This is where the majority of the 'magic' in parsing a rhs
            // value into the appropriate resolvers for Bess rules lives.
            var nextValue = function(s){
                var v;
                // * As long as there isn't nothing but whitespace until the end of the file...
                // (that would be an error btw since in order to be valid we would need a semi to
                // end this property value and a close brace to close the declarations for the rule).
                // It's here to prevent dumb things like an infinite loop from happening when you have
                // some malformed rules or something.
                if(!s.skipWhitespace().isDone()){

                    if(s.current==="'"){

                        // * * * If we hit a comma, we try to parse out the next string
                        return { resolver: 'string', arg: nextString(s) };

                    }else if(re.isNumeric.test(s.current)){

                        // * * * If we hit a numeric, we're going to parse that out as a string too for now
                        return { resolver: 'number', arg: nextNumber(s) };

                    }else if(re.isComma.test(s.current)){

                        // * * * If we hit a comma, we're going to parse that out as part of a shorthand (see next else)
                        v = nextValue(s.advance());
                        v.x = true;
                        return v;

                    }else{

                        // * * * The above are the only valid primitive identifiers for this space,
                        // anything else we will parse out as a function.. We start by priming
                        // the resolver and calling nextFunctional
                        var temp = { resolver: nextFunctional(s), arg: [] };

                        // * * * It is possible that for some function, no arguments could be valid,
                        // if that's the case, we are done...
                        if(re.isCloseParen.test(s.current)){
                            s.advance();
                            return temp;
                        }

                        // * * * Otherwise, we have to keep reading values as arguments to this function...
                        v=nextValue(s,true);
                        while(v){
                            temp.arg.push(v);
                            // * * * * For simplicity, we advance past whitespace and then one more character
                            s.skipWhitespace().advance();

                            // * * * * If the last character is not a comma, we are done...
                            // Otherwise, keep collecting...
                            if(!re.isComma.test(s.peek(-1))){
                                break;
                            }
                            v=nextValue(s,true);
                        }

                        // * * * Done...
                        return temp;
                    }
                }
            };

            // __Parse Phase II__ - Capture a string value from the current scanner position and advance...
            var nextString = function(s){
                var ret = s.capture(s.advance().index,s.readUntil(re.isQuote).index);
                s.advance();
                return ret;
            };

            // __Parse Phase II__ - Capture a numeric value from the current scanner position and advance...
            var nextNumber = function(s){
                var ret = s.capture(s.index,s.readUntil([re.whiteSpace,re.isSemi]).index);
                s.advance();
                return ret;
            };

            // __Parse Phase II__ - Capture a function name from the current scanner position and advance past the open paren...
            var nextFunctional = function(s){
                var ret = s.capture(s.index,s.readUntil([re.isOpenParen]).index);
                s.advance();
                return ret;
            };

            // A simple local object cache of supported media that we discover so we only do discovery once
            var media = {};

            // Gathers 0...n appropriate Bess sources and provides a semaphore pattern around
            // calls to parseBess and do callback at the end.  This allows us to load numerous
            // sources and treat them as a single ruleset in terms of scoring/application.
            // It accepts an array of urls for use outside of a page context which can be used
            // to pre-compile Bess rules into the "native" format used by the engine as part of
            // a build process.  If no urls are provided, it will attempt to scan the document for
            // style tags where type="text/bess" and load them where appropriate.  Also scans for
            // templates and loads them into local storage in a name mangled format understood by
            // the Bess behavior engine.
            var loadAndParseBess = function(callback, urls, applicableMedia) {
                    // * The 'compiled' rules we are collecting
                var rules = [],

                    // * A simple counter for the semaphor pattern
                    ct = 0,

                    // * Index we will use during iteration
                    i = 0,

                    // * Collection of link tags
                    linkTags,

                    // * Collection of style tags
                    styleTags,

                    // * Reusable variable within an iteration block for readability
                    current;


                if(!window.localStorage){window.localStorage={};}

                // Simple collector for rules from multiple sources
                var parseAndCollect = function(str,el) { 
					var dfd = $.Deferred();
					ct--;
					if(!el || !$(el).attr('bess_parsed')){
						parseBess(str,el).done(function(rools){
							rules = rules.concat(rools);
							dfd.resolve();
						});
					} else {
						dfd.resolve();
					}
					return dfd.promise();
				};

                // Calls parseAndCollect and once resolved calls
				// finishParse to finalize the callback chain
                var parseAndCheck = function(str,el) {
					parseAndCollect(str,el).done(finishParse);
                };
				
				// Called when all parsing is completed and fires
				// callback if semaphore count is 0
				var finishParse = function() {
					if (ct === 0 && callback) { callback(rules); }
				};

                media = applicableMedia || {};

                if(urls){
                    // * Grab the number of urls provided
                    ct+=urls.length;

                    // * For each one, load the url as text and call parseAndCheck with the source
                    // as each is loaded...
                    $.each(urls, function(i,url){
                        $.get(url, parseAndCheck, 'text');
                    });
                }else{

                    // * Find all of the bess link tags and add their number to the semaphore count
                    linkTags = $('link[type="text/bess"]');
                    ct+=linkTags.length;

                    // * Find all of the bess style tags and add their number to the semaphore count
                    styleTags = $('style[type="text/bess"]');
                    ct+=styleTags.length;
					
					Logger.debug("BESS found " + ct + " sheets to parse.");
					
                    // * Load the source specified by each link tag - make sure that it is not disabled
                    // and that, if we can tell, the medium applies and then call parse and check with it...
                    linkTags.each(function() {
                        // * * only get the stylesheet if it's not disabled, it won't trigger cross-site security (doesn't start with anything like http:) and it uses the appropriate media)
                        var self = this;
						Logger.debug("BESS parsing link tag.");
                        if (!this.disabled && !(/^\w+:/.test($(this).attr('href'))) && mediumApplies(this.media) && !$(this).attr('bess_loaded')
                        ){
                            $(this).attr('bess_loaded','true');
                            $.get(this.href, function(str){ parseAndCheck(str,self); }, 'text');
                        }else if($(this).attr('bess_loaded')){
							Logger.debug('Link tag found bess_loaded already.');
                            parseAndCheck('',self);
                        }
                    });

                    // * Call parseAndCheck with the text of each one, passing the tag itself for marking as parsed.
                    styleTags.each(function() {
						Logger.debug("BESS parsing style tag.");
                        parseAndCheck(this.innerHTML,this);
                    });

                }
                return this; // this seems unecessary
            };

            // Borrowed code to detect whether a medium applies in the same manner you would CSS
            // only based on some async load and parse as something "like css"
            // if anyone ever implements http://www.w3.org/TR/cssom-view/#the-media-interface, we're ready
            mediumApplies = (window.media && window.media.query) || function(str) {
                if (!str) return true; // if no descriptor, everything applies
                if (str in media) return media[str];
                var style = $('<style media="' + str + '">body {position: relative; z-index: 1;}</style>').appendTo('head');

                // * the [x,y][0] is a silly hack to evaluate two expressions and return the first
                return media[str] = [$('body').css('z-index') == 1, style.remove()][0];
            };


			// Because the API changed for parseBess (promise API) we need a wrapper
			// for the public 'parse' function
			var parse = function(str, el){
				var rules = [];
				parseBess(str, el).done(function(r){
					rules = r;
				});
				return rules;
			};
			
            return { 
				parse: parse, 
				loadAndParse: loadAndParseBess
			};

        })($);
    }
);
