define(
	"/prettify.js", 
	[
		"jquery", 
		"engines/bess", 
		'/prettify/prettify.js'
	], 
	function($, bess, pp){
	 	return {
			name: 'prettify',
			properties: ['source', 'target'],
			defaults: { target: bess.resolvers.find() },
			apply: function(dat, el){
				$(dat.target).html(
					$(dat.source).html()
								.replace(/</g,"&lt;")
								.replace(/\>\ /g,'>\n')
								.replace(/>/g,"&gt;")
								.replace(/\n\ {4}/g,"\n")
								.replace(/^\ {4}/,"\n")
								.replace(/\t/g,"   ")
								.replace('bess_parsed="true"', '')
				);
				prettyPrint();
			}
		};
	
	}
);
