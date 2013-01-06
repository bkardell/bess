module("behavior engine - functional types - string", {
	setup: function(){ /* nada */ }
});


asyncTest("string functional type",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = ['OK'];
			resolvers.string(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,input[0],"watch.setVal should be called with the value: " + input[0]);
 				}
			},"foo");
		});
	}
);
