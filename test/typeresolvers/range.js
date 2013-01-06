module("behavior engine - functional types (beta/unpublished) - range", {
	setup: function(){ /* nada */ }
});

asyncTest("range functional type - simple count",
	function(){
		expect(2);
		require(["src/typeresolvers"],function(resolvers){
			/* Find requires nodes in the page.... */
			var ref, input;
			input = [1,5];
			resolvers.range(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(JSON.stringify(val),"[1,2,3,4]", "should have created the array of numbers");
				}
			},"foo");
		});
	}
);

asyncTest("range functional type - increment count",
	function(){
		expect(2);
		require(["src/typeresolvers"],function(resolvers){
			/* Find requires nodes in the page.... */
			var ref, input;
			input = [1,10,2];
			resolvers.range(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(JSON.stringify(val),"[1,3,5,7,9]", "should have created the array of numbers");
				}
			},"foo");
		});
	}
);


