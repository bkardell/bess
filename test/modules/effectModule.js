module("behavior engine - modules - effect", {
	setup: function(){}
});

asyncTest("property verification", function(){
	expect(6);
	require(["src/behavior","src/extendedjquery"],function(behavior,$){
		var effectModule = behavior[":"].effect;
		QUnit.start();
		ok(effectModule.properties.length === 5, "has 5 properties");
		ok(effectModule.properties[0] === "name", "first property is 'name'");
		ok(effectModule.properties[1] === "target", "second property is 'target'");
		ok(effectModule.properties[2] === "duration", "third property is 'duration'");
		ok(effectModule.properties[3] === "easing", "fourth property is 'easing'");
		ok(effectModule.properties[4] === "relative", "fourth property is 'relative'");
	});
});
