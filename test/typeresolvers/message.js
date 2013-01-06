module("behavior engine - functional types - message", {
	setup: function(){ /* nada */ }
});


asyncTest("message functional type - basic no arg (whole message)",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			resolvers.message(null,null,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.itis,"amessage","watch.setVal should be called with the same object");
 				}
			},"foo",{"itis": "amessage"});
		});
	}
);


asyncTest("message functional type - with arg (pulls the value from a message)",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			resolvers.message(null,'itis',{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,"amessage","watch.setVal should be called with the value of the property 'itis");
 				}
			},"foo",{"itis": "amessage"});
		});
	}
);