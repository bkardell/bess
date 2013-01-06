/* Not json path - simple filter walker :)  */
define(
	['src/extendedjquery'],
	function($){

	var next = function(obj, tests, ret, limit) {
        var key, i=0, found, result = true, prop;
        if(obj && (ret.length < limit)){
			if($.isArray(obj)){
				//Logger.debug("found array, interate and recurse");
				// do each obj in the array
				for(;i<obj.length;i++){
					next(obj[i], tests, ret, limit);
				}
			}else{
				for(i=0;result && i<tests.length;i++){
					prop = obj[tests[i].prop];
					if(typeof prop !== "undefined"){
						if(tests[i].re){
							result = tests[i].re.test(prop);
						}
					}else{
						result = false;
					}
				}

				if(result){
					//Logger.debug(key + " is a match, collect this obj");
					ret.push(obj);
				}
				for(key in obj){
					if(typeof obj[key] === 'object'){
						//Logger.debug(key + " is an object, recurse");
						// We need an efficient way to somehow keep track
						// of the index/sibling and ancestry.. How?  One thought
						// is to build up a foo>bar>bat string as we go and regex
						// against that to find out if it is a descendant
						next(obj[key], tests, ret, limit );
					}
				}
			}
        }
	},

	start = function(obj, expr, limit){
		var i=0, c, parts = expr.split(/(\[|\])/), temp, part, test, tests = [], ret=[];
		for(;i<parts.length;i++){
			temp = $.trim(parts[i]);
			if(!(/\[|\]/.test(temp)) && temp!==''){
				temp = parts[i].split(/\W?=/);
                c = expr.match(/(\W?=)/);
				test = { prop: $.trim(temp[0]) };
				if(temp.length>1 && c && c.length>0){
					c=c[0].charAt(0);
					temp[1] = temp[1].replace(/\'/g,"");
					if(c==='^'){ temp[1] = "^" + temp[1]; }
					else if(c === '$'){ temp[1] = temp[1] + "$"; }
					else if(c !== '*'){
						temp[1] = "^" + temp[1] + "$";
					}
					test.re = new RegExp(temp[1]);
				}
				tests.push(test);
			}
		}

		next(obj, tests, ret, limit || Number.MAX_VALUE);
		return ret;
	};

	return start;
});