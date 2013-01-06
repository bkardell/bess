module("behavior engine - functional types - obj", {
	setup: function(){ /* nada */ }
});


asyncTest("obj functional type - json",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = ['{"foo": "ok", "test": "bar"}'];
			resolvers.obj(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					deepEqual(val,{"foo": "ok", "test": "bar"},"watch.setVal should be called with the parsed object for:" + input);
 				}
			},"foo");
		});
	}
);


asyncTest("obj functional type - query param style",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = ['foo=ok&test=bar'];
			resolvers.obj(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					deepEqual(val,{"foo": "ok", "test": "bar"},"watch.setVal should be called with the parsed object for:" + input);
 				}
			},"foo");
		});
	}
);


asyncTest("obj functional type - query param style with array of values",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = ['foo=ok&test=bar&test=bat'];
			resolvers.obj(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					deepEqual(val,{"foo": "ok", "test": ["bar","bat"]},"watch.setVal should be called with the parsed object for:" + input);
				}
			},"foo");
		});
	}
);


asyncTest("obj functional type - bad value / unparsable json",
	function(){
		expect(1);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var input = '{whoops',output;
			try{
				resolvers.obj(null,input,{
					setVal: function(prop,val){
						QUnit.start();
						ok(false,"setVal should not be called");
					}
				},"foo");
			}catch(e){
				QUnit.start();
				ok(true,"reading a bad json string should throw an error, cancelling the module apply() call");
			}
		});
	}
);