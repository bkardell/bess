module("behavior engine - functional types - number", {
	setup: function(){ /* nada */ }
});


asyncTest("number functional type - read/called as numeric",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = [2];
			resolvers.number(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					ok(val===2,"watch.setVal should be called with the value: " + input[0]);
 				}
			},"foo");
		});
	}
);

asyncTest("number functional type - read/called as numeric after cast",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = ['2'];
			resolvers.number(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					ok(val===2,"watch.setVal should be called with the value: " + input[0]);
 				}
			},"foo");
		});
	}
);


/**
TODO: Decide if this is a valid test, currently it isn't, but should number support decimal precision?
asyncTest("number functional type - read/called as numeric with decimal",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = [2.256];
			resolvers.number(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					ok(val===2.256,"watch.setVal should be called with the value: " + input[0]);
 				}
			},"foo");
		});
	}
);
*/

