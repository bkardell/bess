define(
	[
		'src/extendedjquery',
		'lib/pagebus',
		'src/modules',
		'src/dommod',
		'src/typeresolvers',
		'src/typeresolverengine',
		'src/bessvalueparser',
		'src/logging'
	], function ($, pb, Modules, DomMod, TypeResolvers, resolverEngine, parser, Logger) {

	// Set the DOM Modifier for the Modules
	Modules.setModifier(DomMod);

	// Tracks html-inserted rules separately because they need to be triggered.
	var domInsertRules = [],

	// Scans for new rules and attaches them as necessary..
	scan = function (ctx, isLocal) {
		parser.loadAndParse(function (rules) {
			//The only way we get here with rules is if they are post original
			$.each(rules, function (r) {
				domInsertRules.push(r.selector.select);
			});
			window.bessRules = window.bessRules.concat(rules);
			attachRules(ctx, window.bessRules, !isLocal);
		});
	},

	type_resolvers = TypeResolvers,

	// * calculate/sort the specificity and sort rules...
	sortBySpecificity = function (s) {
		return s.sort(function (a, b) {
			return a.selector.score > b.selector.score ? 1 : (a.selector.score < b.selector.score) ? -1 : 0;
		});
	},

	// * A simple aspect wrapper which allows pre- and post- of any state
	// queueing, dequeueing and triggering as applicable. __state__ is the
	// name of the state that is being triggered, __fn__ is the actual thing
	// we intend to execute (an applier) and __j__ is the jquery result that
	// the rule is based on.
	wrapAspects = function (state, fn, j) {
		j.queue('pseudo', [ function () {
			j.trigger('pre-' + state).dequeue('pseudo');
		}, function () {
			fn();
			j.dequeue('pseudo');
		}, function () {
			j.trigger('post-' + state).dequeue('pseudo');
		} ]);
		j.dequeue('pseudo');
	};

	//JQueryPlugins.init();

	// If localStorage isn't there (even shimmed), just fake it.
	if (!window.localStorage) {
		window.localStorage = {};
	}

	// Global subscription to scan requests from outside the engine
	pb.subscribe('document.scan', null, function (topic, msg) {
		scan(msg.context, msg.isLocal);
	});

	// Global subscription to children being inserted
	pb.subscribe('document.inserted.children', null, function (topic, msg) {
		// * * Trigger inserted on any children that meet the domInsertRules criteria
		var i, event, items, target = msg.context;
		items = target.find('*').filter(domInsertRules.join(','));
		for (i = 0; i < items.length; i++) {
			event = new $.Event('html-inserted');
			event.preventDefault();
			Logger.debug('Triggering html-inserted.');
			$(items[i]).trigger(event);
		}

		// * * Trigger modified on the target itself
		Logger.debug('Triggering html-modified.');
		target.trigger('html-modified');
	});

	// Used by findEvt to map Bess' states to underlying DOM events
	var map = {
		clicked : 'click',
		changed : 'change',
		blurred : 'focusout',
		'validated' : 'submit'
	};

	var findEvt = function (name) {
		var n = (map[name]) ? map[name] : name;
		// * Tricky... Some of the CSS states are still in flux and so we have to kind of shim them
		// to their browser specific version.  It would probably behoove us to develop a better pattern
		// than just a simple map and this function.
		if (name == 'transitioned') {
			if ($.browser.webkit) {
				n = 'webkitTransitionEnd';
			}
			else if ($.browser.opera)
				n = 'oTransitionEnd';
			else if ($.browser.mozilla)
				n = 'transitionend';
			else
				n = 'transitionend';
		}
		return n;
	};

	// The core 'handler' in Bess. The general idea is that you use 'live()' to bind
	// one document level handler for each event type that is mentioned by a rule,
	// this collects the data as it bubbles and then the doc level handler has all it needs.
	var bessHandler = function (e, msg) {
		e.preventDefault();

		// * If there isn't an to add actionable properties to, add one.
		if (!e.actionable) {
			e.actionable = [];
			e.actionableIds = [];
			e.target = e.currentTarget || e.target;
		}
		if ($.inArray(e.data.module + ':' + e.data.selector.ruleId, e.actionableIds) === -1) {
			e.message = msg;
			// * Populate the data so that the end of the chain gets it all
			e.actionable.push(e.data);
			e.actionableIds.push(e.data.module + ':' + e.data.selector.ruleId);
		}
	};

	// A collection of document level handlers
	var docLevelHandlers = {};

	// A collection of topics to be mapped against for subscription handling
	var topicMap = {};

	// We want to collect the unique properties mentioned in any 'layer' (see multiplictyToArray).
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

	// A module's properties can each wind up with multiple values
	// that have to be resolved in a simple 'columnar' way as if each
	// were an independent 'layer' - these have (typically) numeric.
	// key names that indicate their 'layer'.  This method resolves things at
	// runtime in a way appropriate for CSS-like application of properties.
	var multiplicityToArray = function (def) {
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
	};

	// Attaching a rule means attaching live() to the selector a query against the selector
	// and adding meta-data to it in keeping with CSS processing rules.
	// as well as binding an evaluator and state trigger which then
	// evaluate that meta data at runtime and call the module's .apply()
	var attachRule = function (rule /*, ctx */) {
		var pseudo = rule.selector.pseudo;
		var selector = rule.selector;

		// This checks for topics vs. DOM-like states
		if (pseudo.split(/\./).length > 1) {
			if (!topicMap[pseudo]) {
				topicMap[pseudo] = [ selector.select ];
				pb.subscribe(pseudo, null, function (topic, message) {
					var rst = $(topicMap[pseudo].join(',')).toArray(), real = [], i = 0;
					Logger.debug('triggering ' + pseudo + ' from subscription...');
					for (; i < rst.length; i++) {
						if ($(rst[i]).has(rst.slice(i + 1)).length === 0) {
							real.push(rst[i]);
						}
					}
					$(real).trigger(pseudo, message);
				});
			}
			else {
				if (!topicMap[pseudo][selector.select])
					topicMap[pseudo].push(selector.select);
			}
		}

		var state = findEvt(pseudo);

		$(rule.selector.select).live(state, rule, bessHandler);

		if (!docLevelHandlers[state]) {
			$(document).bind(state, function (e) {
				// * * * here we just merge/apply until done... They should be in sorted order
				var merged = {}, actionable, known = {};
				if (e.actionable) {

					if (e.type === 'html-inserted') {
						if (e.target.bess_dom_inserted) {
							return false;
						}
						else {
							e.target.bess_dom_inserted = true;
						}
					}
					// * * * * html mutation events don't bubble or capture - they just are...
					if (e.type === 'html-modified' && (e.currentTarget !== e.target)) {
						Logger.debug('bailing... html-modified current target:' + e.currentTarget.tagName + ' - target:' + e.target.tagName);
						return;
					}
					else if (e.type === 'html-inserted' && (e.currentTarget !== e.target)) {
						Logger.debug('switching... html-inserted current target:' + e.currentTarget + ' - target:' + e.target);
						e.currentTarget = e.target;
						// edge case for IE where IE has FORM in current instead of target in a submit event type
					}
					else if (e.type === 'submit' && e.target.tagName && e.target.tagName === 'BUTTON') {
						e.target = e.currentTarget;
					}

					for (var i = 0; i < e.actionable.length; i++) {
						actionable = e.actionable[i];
						Logger.debug('handling ' + actionable.selector.select + ' ' + selector.pseudo);

						// * * * * * Collect it if isn't a repeat (because nested matches will cause a problem with property resolution)
						// THIS APPROACH CREATES A PROBLEM BECAUSE IT IS LEGIT TO REPEAT A SELECTOR
						// IN ORDER TO OVERRIDE PROPERTIES LATER ON IN THE RULES...
						// if(!known[actionable.selector.select]){
						merged[actionable.module] = merged[actionable.module] || {};

						// * * * * * Collect it if it matches the selector / pseudo
						if (actionable.selector.pseudo == pseudo && ($(e.target).is(actionable.selector.select) || $(e.currentTarget).is(actionable.selector.select))) {
							$.extend(merged[actionable.module], actionable.declaration);
						}
						known[actionable.selector.select] = true;
						//}
					}
					Logger.debug('merged:' + JSON.stringify(merged, null, 4));

					var j = $(e.currentTarget);
					wrapAspects(pseudo, function () {
						for (var mod in merged) {
							var m = new Modules(mod);
							if (m) {
								Logger.debug('resolving module...' + mod);
								var mult = multiplicityToArray(merged[mod]);
								for (i = 0; i < mult.length; i++) {
									var def = $.extend({}, m.defaults, mult[i]);
									/*jshint loopfunc:true */
									resolverEngine.properties(def, j, m.apply, e.message, function (a, b) {
										Logger.error('Problem resolving: ' + b[0] + '\n\n- ' + b[1].message + '\n\n- in ' + JSON.stringify(def));
										if (a.topic) {
											j.trigger('error');
										}
										else if (a.target) {
											a.target.trigger('error');
										}
									});
									/*jshint loopfunc:false */
								}
							}
							else {
								Logger.error('Ignoring unknown module "' + mod + '" in "' + selector.select + ':' + selector.pseudo + '"');
							}
						}
					}, j);
				}
			});
			docLevelHandlers[state] = true;
		}
	};

	// sorts the rules according to CSS specificity weight
	// and then calls attachRule on each one....
	var attachRules = function (ctx, rules, isGlobal) {
		if (! ctx)
			ctx = $(document);
		sortBySpecificity(rules); // this had window.bessRules as param - bug?
		$.each(rules, // this had window.bessRules as param - bug?
		function (i, rule) {
			attachRule(rule, ctx);
			if (isGlobal && /html-inserted$/.test(rule.selector.pseudo)) {
				domInsertRules.push(rule.selector.select);
			}
		});

		if (isGlobal) {
			Logger.debug('triggering html-inserted globally...');
			var go = function () {
				setTimeout(function () {
					$(domInsertRules.join(',')).trigger('html-inserted');
				}, 1);
			};
			if (!$.isReady)
				$.ready(go);
			else
				go();
		}
	};

	return {
		'::' : type_resolvers,
		':' : Modules.cache,
		process : attachRules,
		init : scan
	};
});
