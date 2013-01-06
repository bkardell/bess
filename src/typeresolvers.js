define([
	'src/extendedjquery',
	'lib/mustache',
	'src/jpath'
], function($, TemplateManager, jsonPath){

	// Find is a core fn that is used for finding which allows us to
	// "supplement" general finding with things like :self pseudo ids..
	// The majority of this is to support old "<" style queries which
	// we are now trying to specifically avoid.  In the end, this should
	// probably just return $(query) - wrapping it up allows us to add to it
	// if necessary in a single the future...
	var find = function(j,arg){
		var x, query, isLocal, isParent, lookingFor, ret;
		x = (arg[0] + " ").split('<');
		isLocal = (x[0]==='');
		query = (isLocal) ? "#" + j.attr('id') + x[1] : x[0];
		if(x.length>1 && !isLocal){
			isParent = (x[0] == "*");
			lookingFor = (isParent) ?  "*:not(#" + j.attr('id') + ")" : x[0];
			j=j.closest(lookingFor);
			if(x[1]!=" "){
				j=j.find(x[1]);
			}
			ret = j;
		}else{
			ret = $(query);
		}
		return ret;
	},
	balance = function(arr,cols){
		var r, i, x=0, colRows, per, rows=[], delta = arr.length % cols;
		per = Math.floor(arr.length / cols);
		for(i=0;i<cols;i++){
			colRows = [];
			per = (rows.length===0) ? per + delta : Math.round(arr.length / cols);
			for(r=0;r<per;r++){
				if(arr[x]){
					colRows.push(arr[x]);
					x++;
				}
			}
			rows.push(colRows);
		}
		return rows;
	};


	// Type resolvers are responsible for turning the underlying resolver types in
	// bess rules into real values - essentially these provide bess with functions, although
	// some of them (string and number) are implied rather than explicit.  It is an asynchronous
	// process as the rule is only completely resolved once all values are resolved - some are
	// and those are resolved 'inside out'.  All of this management
	// is accomplished via the resolve engine above and an extensible pattern in which the
	// goal is to call the setVal(propertyName,value) of the passed in __watch__ object.
	// All resolvers are passed 5 arguments (the last one is usually undefined).
	// __J__ is the current jquery object, __arg__ is an array of arguments to the type
	// resolver.  __Prop__ is the prop name you are generally expected to provide to setVal();
	var type_resolvers = {

		// * Access the message object if there is one (or {} if not)
		message: function(j,arg,watch,prop,msg){
			var m = msg || {};
			arg = ($.isArray(arg)) ? arg[0] : arg;
			watch.setVal(prop,(!arg || arg==='')? m : m[arg]);
		},

		// * capture the current values of the form element
		capture: function(j,arg,watch,prop){
			var ret = [], i;
			j = find(j,arg);
			for(i=0;i<j.length;i++){
				ret.push($(j[i]).val());
			}
			watch.setVal(prop,ret);
		},

		// * collect the values of properties in an object or attributes of an element
		collect: function(j,arg,watch,prop){
			// * * pass it an attribute name and optionally the result of a find() (defaults to :self)
			var items,att = arg[0],local = j, ret = [], item, defaultVal='';
			if(arg.length===2){
				if(typeof arg[1] === 'string'){
					defaultVal =  arg[1];
				}else{
					local = arg[1];
				}
			}else if(arg.length===3 && typeof arg[2] === 'string'){
				local = arg[1];
				defaultVal = arg[2];
			}
			if(local.jquery){
				local = $.makeArray(local);
			}
			local = ($.isArray(local)) ? local : [local];
			for(var i=0;i<local.length;i++){
				item = $(local[i]);
				if(item.attr(att)){
					ret.push(item.attr(att));
				}else if(defaultVal){
					ret.push(defaultVal);
				}
			}
			watch.setVal(prop,ret);
		},

		// * cut the markup of this whole element out so I can use it later
		cut: function(j,arg,watch,prop){
			var w = $('<div></div>');
			w.append(arg[0][0]);
			watch.setVal(prop,w.html());
		},

		// * get the HTML markup for the first element in a find() result
		markup: function(j,arg,watch,prop){
			watch.setVal(prop,$(arg[0][0]).html());
		},

		// * get the argument as a base 10 number
		number: function(j,arg,watch,prop){
			watch.setVal(prop,parseInt(arg[0],10));
		},

		// * get the argument as a string
		string: function(j,arg,watch,prop){
			watch.setVal(prop,arg[0].toString());
		},

		// * get the results of any valid Bess "find"...
		find: function(j,arg,watch,prop){
			watch.setVal(prop,find(j,arg));
		},

		// * get the result of some HTTP request as a string...
		request: function(j,arg,watch,prop){
			var a = arg[0], tmp, req = {
				success: function(d){
					watch.setVal(prop,d);
				},
				error: function(d){
					var m = prop + " (" + this.url + "):" + arguments[2];
					watch.setError(m,arguments[0]);
				},
				type:     'GET',
				dataType: 'text'
			};
			if(typeof a==='string'){
				req.url=a;
			}else if(typeof a[0] === 'string'){
				req.url=a[0];
			}else if(a[0].tagName && a[0].tagName.toLowerCase() === 'form'){
				req.url=a[0].getAttribute("action");
				req.data=a.serialize();
				req.type=a[0].getAttribute("method") || 'GET';
				req.contentType=a[0].getAttribute('enctype') || "application/x-www-form-urlencoded";
				if(a[0].getAttribute('accept')){ req.accepts=a[0].getAttribute('accept'); }
			}else{
				req.data=$.param(a);
			}
			if(arg.length>=2){
				req.type = arg[1];
			}
			if(arg.length===3){
				req.url = arg[2];
			}
			if(req.url.indexOf('#')===0){
				watch.setVal(prop,j);
			}else if(req.url===''){
				watch.setVal(prop,'');
			}else{
				$.ajax(req);
			}
		},

		// * get an object by parsing a json string or a query string...
		obj: function(j,arg,watch,prop,token){
			var pairs, o = {};
			if(arg[0].match(/\S/)[0]==='{'){
				watch.setVal(prop,JSON.parse(arg[0]));
			}else{
				pairs = arg[0].split('&');
				$.each(pairs, function(i, v){
					var temp, pair = v.split('=');
					if(o[pair[0]]){
						temp = o[pair[0]];
						if(!$.isArray(o[pair[0]])){
							o[pair[0]] = [o[pair[0]]];
						}
						o[pair[0]].push(pair[1]);
					}else{
						o[pair[0]] = pair[1];
					}
				});
				watch.setVal(prop,o);
			}
		},

		// * get an object representation of a cookie
		cookie: function(j,arg,watch,prop){
			type_resolvers.obj(j,document.cookie,watch,prop,",");
		},

		// * get a new object by merging N objects into 1 (rightmost wins).
		combine: function(j,arg,watch,prop){
			var val = {},i=0,len=arg.length;
			for(;i<len;i++){
				$.extend(val,arg[i]);
			}
			watch.setVal(prop,val);
		},

		// * get a new string by mashing a template with an object
		mash: function(j,arg,watch,prop){
			var data = arg[1], templ, buff, i, ct = 0, error, apply;
			templ = ($.isArray(arg[0])) ? arg[0][0] : arg[0];

			if(typeof arg[1] === 'string'){
				// this maybe a bad idea but was added in the event
				// a mash is used with just string data and not JSON
				try{
					data = JSON.parse(data); 
				} catch(e) {
					data = [data];
				}
			}
			apply =  function(templ,data,i,buff){
				templ.apply(data,function(err,str){
					ct++;
					if(err){
						error = true;
						watch.setError(templ,err);
					}else{
						buff[i] = str;
						if(ct>=data.length){
							watch.setVal(prop,buff.join(''));
						}
					}
				});
			};
			if($.isArray(data) && arg.length>2){
				data = balance(data,arg[2]);
				buff = new Array(data.length);
				for(i=0;i<data.length && !error;i++){
					// ugly, but we have to synchronize this outide a closure
					apply(templ, data[i], i, buff);
				}
			}else{
				templ.apply(data,function(err,str){
					if(err){
						watch.setError(templ,err);
					}else{
						watch.setVal(prop,str);
					}
				});
			}
		},

		// * get a script tag based template from memory by its name, download if necessary
		template: function(j,arg,watch,prop){
			var w = watch,
				bess_templates = (window.bess_templates) ? window.bess_templates : {}, 
				template = bess_templates[arg[0]];
			if(template){
				w.setVal(prop,template);
			}else{
				$.get(arg[0], function(template) {
					w.setVal(prop,template);
				}, 'html').error(function(){
					w.setError(prop,"unable to load " + arg[0]);
				});
			}
		},

		subset: function(j,arg,watch,prop){
			var obj = (typeof arg[1] === 'string')? JSON.parse(arg[1]) : arg[1];
			path = ($.isArray(arg[0])) ? arg[0][0] : arg[0];
			obj = jsonPath(obj, path, arg[2]);
			watch.setVal(prop,obj);
		},

		// * __beta/unpublished__ - get a value from the querystring by key
		fromQuery: function(j,arg,watch,prop){
			var ret='',i=0, pts = window.location.search.substring(1).split("&");
			for(i=0;i<pts.length;i++){
				if(pts[i].indexOf(arg[0])===0){
					ret=pts[i].split("=")[1];
				}
			}
			watch.setVal(prop,ret);
		},
		// * __beta/unpublished__ - get an array of numbers - ala python.
		range: function(j,arg,watch,prop){
			var i=0,from=arg[0] || '0',to=arg[1] || '0',step=arg[2] || '1',ret=[];
			for(i=parseInt(from,10);i<parseInt(to,10);i+=parseInt(step,10)){
				ret.push(i);
			}
			watch.setVal(prop,ret);
		}
	}; 

	// Find has several aliases to make the actual rules more readable. They all mean
	// exactly the same thing...
	type_resolvers.to = type_resolvers.find;
	type_resolvers.from = type_resolvers.find;
	type_resolvers.where = type_resolvers.find;

	return type_resolvers;
});