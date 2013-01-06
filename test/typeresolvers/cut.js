module("behavior engine - functional types - cut", {
	setup: function(){ /* nada */ }
});

asyncTest("cut functional type - basic",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var contents = '<div><div class="success">Success!</div></div>',
				input = [$(contents)];
			resolvers.cut(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,contents,"watch.setVal should be called with the value: " + contents);
				}
			},"foo");
		});
    }
);

asyncTest("cut functional type - throws on no input element",
	function(){
		expect(1);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var contents = '<div><div class="success">Success!</div></div>';
			try{
				resolvers.cut(null,null,{
					setVal: function(prop,val){
						QUnit.start();
						ok(false,"cut() should have thrown an error when provided no element");
					}
				},"foo");
			}catch(e){
				QUnit.start();
				ok(true,"cut() should have thrown an error when provided no element");
			}
		});

    }
);
