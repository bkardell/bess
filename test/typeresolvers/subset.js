module("behavior engine - functional types - subset", {
	setup: function(){ /* nada */ }
});

asyncTest("subset functional type - simple (just a delegate to jpath)",
	function(){
		expect(5);
		require(["src/typeresolvers"],function(resolvers){
			/* Find requires nodes in the page.... */
			var ref, input;
			input = ['[a]',{myobj:[{a:1},{b:2},{a:3},{b:4}]}];
			resolvers.subset(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					ok(val,'should have an _each property')
					equal(val.length,2,'should have found two objects');
					equal(val[0].a,1,'the first should be 1');
					equal(val[1].a,3,'the second should be 3');
				}
			},"foo");
		});
	}
);