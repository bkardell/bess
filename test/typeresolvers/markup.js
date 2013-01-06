module("behavior engine - functional types - markup", {
	setup: function(){ /* nada */ }
});

asyncTest("markup functional type - basic",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var contents = '<div><div class="success">Success!</div></div>',
				input = [$(contents)];
			resolvers.markup(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,'<div class="success">Success!</div>',"watch.setVal should be called with the value: " + contents);
				}
			},"foo");
		});
    }
);

asyncTest("markup functional type - throws on no input element",
	function(){
		expect(1);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var contents = '<div><div class="success">Success!</div></div>';
			try{
				resolvers.markup(null,null,{
					setVal: function(prop,val){
						QUnit.start();
						ok(false,"markup() should have thrown an error when provided no element");
					}
				},"foo");
			}catch(e){
				QUnit.start();
				ok(true,"markup() should have thrown an error when provided no element");
			}
		});

    }
);
