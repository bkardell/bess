var logged;

var setRules = function(bessRules){
	window.bessRules = bessRules;
}


module("behavior engine - modules and runtime", {
	setup: function(){
		window.bessRules=[];  // Make sure this is fresh
		logged=[];            // and this...
	}
});

asyncTest("process() resolves properties and calls the named module correctly", function(){
	expect(3);
	var captured=null,captured2=null,frag = '<div id="foo"><div>ABC</div></div>';
	addToFixture(frag + '<div id="bar">y</div>');
	setRules([
		{
			"module": "myTestModule",
			"selector": {
				"pseudo":   "html-inserted",
				"score" :   16,
				"select":   "#bar",
				"ruleId":   1
			},
			"declaration":{
				"x": {
					"0": {
						"resolver": "obj",
						"arg":      [{
							"resolver": "string",
							"arg": '{"abc": 123 }'
						}]
					}
				},
				"y": {
					"0": {
						"resolver": "find",
						"arg":      [{
							"resolver": "string",
							"arg": "<"
						}]
					}
				},
				"z": {
					"0": {
						"resolver": "find",
						"arg":      [{
							"resolver": "string",
							"arg": "#bat"
						}]
					}
				}
			}
		},{
			"module": "myTestModule",
			"selector": {
				"pseudo":   "html-inserted",
				"score" :   16,
				"select":   "#bar",
				"ruleId":   2
			},
			"declaration":{
				"z": {
					"0": {
						"resolver": "string",
						"arg":      "#bar"
					}
				}
			}
		}
	]);
	require(["src/extendedjquery"], function($){

		$.isReady = true;

		require(["src/behavior", "src/logging"],function(behavior, logger){
			var origDebug = logger.debug;
			logger.debug = function(m){
				logged.push(JSON.stringify(m));
				origDebug(m);
			}
			//add a dummy module... This will capture calls to make sure that
			//it was called through the process and applied correctly
			behavior[":"].myTestModule = {
				properties: ['x','y','z'],
				defaults: {
					x: {resolver: 'string', arg: '1'},
					y: {resolver: 'obj', arg: { resolver: 'string', arg: '{}' }}
				},
				apply:function(dat){
					// removed this assertion because it was firing in the middle of different modules
					//ok(true,'Called myTestModule.apply()');
					captured=dat;
				}
			};

			behavior.process(null,window.bessRules,true);
			setTimeout(function(){
				QUnit.start();
				if(captured){
					if(captured.x){
						equal(captured.x.abc,123,"the resulting object should have an 'abc' property with a value '123'");
					}else{
						ok(false,"dat should have an 'x' property....  Skipping related tests." )
					}
					if(captured.y){
						equal(captured.y[0].id,"bar","the resulting node list should contain matching #bar");
					}else{
						ok(false,"dat should have an 'y' property....  Skipping related tests." )
					}
					if(captured.z){
						equal(captured.z,"#bar","there resulting z should contain '#bar'" + JSON.stringify(captured.z));
					}else{
						ok(false,"dat should have an 'z' property....  Skipping related tests." )
					}
				}else{
					ok(false,"var 'captured' should have been captured....  Skipping related tests.");
				}
			},1000); // Give it a second to happen...
		});

	});

});