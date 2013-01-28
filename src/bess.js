// This is the thing I want to require and kick things off... It should expose
// its guts as necessary.

define(
	[
		'src/extendedjquery',
		'src/behavior',
		'src/bessvalueparser',
		'src/modules',
		'src/logging'
	],
	function($,behavior,parser,modules,Logger) {
		// We've always got to double check the scan, not the parsing...
		// Anything that has been parsed will be marked as such and we will skip
		var go = function(){
			parser.loadAndParse(function(rules){
				Logger.debug('BESS go parse found ' + rules.length + ' rules.');
				window.bessRules = bessRules.concat(rules);
				behavior.init();
			});
		};

		//start as early as possible...
        parser.loadAndParse(function(rules){
			Logger.debug('BESS early parse found ' + rules.length + ' rules.');
			window.bessRules = rules;
			if(!$.isReady){
				$(document).ready(go);
			}else{
				go();
			}
		});

		Bess = {
			parser: parser,
			engine: behavior,
			resolvers: modules.resolvers
		};
		
		return Bess;
	}
);