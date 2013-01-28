define([
		'src/extendedjquery',
		'src/typeresolvers',
		'src/logging'
	],function($,r,Logger){
			var type_resolvers = r,

				// Create a closure for non-blocking calls to resolve - this will
				// prevent any one
				resolve = function(x,j,watch,prop,msg){
					setTimeout(function(){
							resolverEngine.property(x,j,watch,prop,msg);
						},
						1
					);
				},

				// Bess' runtime value resolving engine which can work through the rule's resolvers
				// and resolve them into values in the right order and call the appropriate module's
				// apply method when complete.
				resolverEngine = {

					// * Takes raw calculated module properties, evaluates them into resolved values
					// (processes functional value types) and calls the applier with real values.
					// Each property is queued separately and this returns immediately.  No module
					// will apply if it errors, but it wont hang anything else up either.
					// __raw__ - {object} Calculated module properties from the element,
					// __j__ - {object} jQuery wrapped element that originated the state,
					// __applier__ - {function} Module applier function to be called with resolved properties,
					// __message__ - {object} If this involved triggering via message (optional).
					properties: function(raw,j,applier,msg,onError){
						var inst={}, prop;
						var watch = {
							ct:0,
							setVal:function(p,v){
								inst[p]=v;
								this.ct--;
								Logger.debug('resolved ' + p + "..." + this.ct + " remaining");
								if(this.ct===0){
									applier(inst,j);
								}
							},
							setError:  function(){
								onError(inst,arguments);
							}
						};
						for(prop in raw){
							if(raw[prop].resolver){
								if(raw[prop].arg==='none'){
									delete raw[prop];
								}else{
									watch.ct++;
								}
							}
						}
						try{  // This should catch any non-async stuff
							for(prop in raw){
								if(raw[prop].resolver){
									resolve(raw[prop],j,watch,prop,msg);
								}
							}
						}catch(e){
							watch.setError(inst,e);
						}
					},
					property: function(rule,j,watch,prop,msg){
						var w=watch,rs = [rule],x=rule.arg;
						if(!$.isArray(x)){
							resolverEngine.buildStack(rule,rs);
						}
						var f = function(str,def){
							return (typeof str === 'string' && uid(j,str.replace(/th\(index\)/g,'th('+ j.index() +')'))) || def;
						};
						var setVal = function(ct,dat,cb){
							return function(p,v){
								ct--;
								dat[this.i] = f(v,v);
								if(ct===0){
									cb(dat);
								}
							};
						};
						/* returns an array */
						var all = function(arr,cb){
							var o,ct=arr.length,dat=[],i=0;
							while(arr.length > 0){
								o=arr.shift();
								resolverEngine.property(o,j,{
									i: i++,
									setVal: setVal(ct,dat,cb),
									setError: w.setError
								},prop,msg);
							}
						};
						var next = function(arr){
							if(!arr || !arr.pop){ return; }
							var o = arr.pop();
							if($.isArray(o.arg)){
								all(o.arg.slice(0),function(a){
									if(type_resolvers[o.resolver]){
										try{
											type_resolvers[o.resolver](j,a,w,prop,msg);
										}catch(e){
											w.setError(o.resolver, e);
										}
									}else{
										Logger.error("unknown type resolver: '" + o.resolver + "'");
									}
								});
							}else{
								x = f(o.arg,x);
								w = (arr.length===0) ? watch : {setVal:function(p,v){x = f(v,v);next();},setError: w.setError};
								if(type_resolvers[o.resolver]){
									try{
										type_resolvers[o.resolver](j,[x],w,prop,msg);
									}catch(e){
										w.setError(o.resolver, e);
									}
								}else{
									Logger.error("unknown type resolver: '" + o.resolver + "' should it be in an array?");
								}
							}
						};
						next(rs);
					},
					buildStack: function(o,a){
						if(o.arg.resolver){
							a.push(o.arg);
							resolverEngine.buildStack(o.arg,a);
						}
					}
				},

				// A simple property/primer used in creating bess unique ids for application of pseudo ids
				_uid = $.now(),

				// * Adds a name mangled uid to an element without one and replaces the :self
				// pseudo id in the passed query with #{id} and returns it.
				uid = function(j, str) {
					if (!j.attr('id')) {
						j.attr('id', "bess_" + (_uid++));
					}
					return str.replace(":self", "#" + j.attr('id'));
				};

		return resolverEngine;
});