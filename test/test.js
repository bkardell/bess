module("bess");

asyncTest("root api verification", function(){
	require(['src/stringscanner'],function(bess){
		QUnit.start();
		ok(true);
	});
});