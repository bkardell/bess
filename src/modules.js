define([
		'src/extendedjquery',
		'lib/mustache',
		'src/logging'
	], 
	function($, Mustache, Logger){

	// Convenience creator for string resolvers for use in module defaults
	// sending no string will cause it to return the null string ('').
	var _str = function(s){ 
		return {resolver: 'string',arg: s || '' }; 
	};

	// Convenience creator for find resolvers for use in module defaults
	// sending no selector will cause it to return :self
	var _find = function(selector){
		return {resolver: 'find',arg: [_str(selector || ':self')]};
	};

	// Convenience creator for object resolvers for use in module defaults
	// sending no code string will cause it to return the empty object.
	var _obj = function(code){
		return {resolver: 'obj',arg: code || '{}'};
	};
	
	// Bess modules are objects that follow a template/command pattern
	// which let the parser, behavior engine and resolver engine understand
	// enough about them to automatically be orchestrated into the larger
	// act. Each module must have a unique name and have three entries:
	// __properties__ is an array of strings that define the properties that
	// the module accepts and their  expected order in shorthand parsing.
	// __defaults__ are resolver objects that define default resolvers that
	// will be provided if none is given. It is not necessary to define a
	// default for every property, if none is given and no default is provided,
	// that value will simply be undefined. __apply__ is a function that receives
	// an argument which, when appropriate, will be called with the resolved values
	// as an object with the properties names specified.
	var modules = {

		// * The __effect module__ allows numerous effects to be applied and
		// time management accounting: The rule state is not complete until
		// all of the modules in it are applied - animation is will block
		// completion until the animation is done (you can use simple -pre/-post).
		// The completion of an animation will also trigger post-{effect} _on the
		// thing that was animated rather than on the thing that the rule is based on_.
		// Additionally, since the subject of this state is the thing that was animated,
		// it may be triggered before the entire rule is complete.
		effect: {
			properties: ['name','target','duration','easing','relative'],
			defaults: {target:_find(),duration: _str('slow'),easing: _str('swing'),relative:_find()},
			apply: function(dat,el){
				var n, 
					open=dat.target.length, 
					names = dat.name.split(','),
					proc = function(o,e,d,n){
						return function(){
							if(o && --o === 0){
								d.target.trigger('post-' + n);
							}
						};
					};
				if(open===0){ el.dequeue('pseudo'); }
				el.queue('pseudo').unshift($.noop); /* wait... */
				for(var i = 0; i<names.length; i++){
					n = $.trim(names[i]);
					dat.target[n](dat.duration,dat.easing,proc(open,el,dat,n), dat.relative);
				}
			}
		},

		// * The __class module__ allows the user to add, remove and toggle classes
		// (name is the class name) from any valid find target.  Multiple classes
		// can be space separated.
		"class": {
			properties: ['op','name','target'],
			defaults: {op: 'toggle',target:_find()},
			apply: function(dat,el){
				dat.name = ($.isArray(dat.name)) ? dat.name.join(' ') : dat.name;
				if(dat.name){ 
					dat.target[dat.op + "Class"](dat.name); 
				}
			}
		},

		// * The __redirect module__ allows you to use bess rules to redirect
		redirect: {
			properties: ['uri'],
			defaults:   {},
			apply: function(dat,el){
				window.location.href = dat.uri;
			}
		},

		// * The __form module__ allows the updating of form element values by way of
		// a data object (key/value pairs in which value is an array).
		form: {
			properties: ['target','data'],
			defaults:{},
			apply: function(dat,el){
				var i, isSimple, elem = dat.target[0],val;
				dat.data = dat.data || '';
				if(dat.target){
					dat.target = (elem.tagName.toLowerCase()==='form') ? dat.target.find(':file,:hidden,:input,:radio,:checkbox') : dat.target;
					isSimple = (typeof dat.data==='string' || $.isArray(dat.data));
					for(i=0;i<dat.target.length;i++){
						val = (isSimple) ? dat.data : dat.data[dat.target[i].name];
						$(dat.target[i]).val(val);
					}
				}else{
					/* Logger.error it... Should there be some automatic algorithm?  */
				}
			}
		},

		// * The __html module__ allows modification of the tree by way of
		// append, prepend, replaceWith, replaceContent, empty, remove
		html: {
			properties:['op','source','target'],
			defaults:{target:_find(),source:{resolver: 'html', arg: _find()},op:{resolver:'string',arg:'replaceContent'}},
			apply: function(dat,el){
				var additive, arg, markup, str;
				additive = ['append','replaceContent','prepend','replaceWith', 'wrapInner', 'wrap'];
				arg = dat.id || dat.source;
				markup = (-1<$.inArray(dat.op,additive)) ?  arg : null;
				if(!arg){
					modifier(dat.op,markup,dat.target);
				}else{
					el.queue('pseudo').unshift($.noop); /* wait... */
					//TODO: THE THIRD VALUE SHOULD BE collected partials!
					str = Mustache.to_html(markup, dat.data, {});
					modifier(dat.op,str,dat.target);
					el.dequeue('pseudo'); /* done... */
				}

			}
		}
	};
	
	// Default modifier provided in the event one is not supplied
	// Does nothing and will call callback if provided
	var modifier = function(op, markup, target, callback) {
		Logger.debug("Default Modifier called within Modules.");
		if(callback){
			callback();
		}
	};

	// module function to get a module from the cache
	var fn = function(name){
		return modules[name];
	};

	fn.resolvers = {
		str:	_str,
		find:	_find,
		obj:	_obj
	};
	
	fn.setModifier = function(mod) {
		modifier = mod;
	};
	
	fn.cache = modules;

	return fn;
});