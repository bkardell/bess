module("behavior engine - functional types - combine", {
	setup: function(){}
});



asyncTest("combine functional type - two objects",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = [{a: true},{b: false}];
			resolvers.combine(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.a,true,"watch.setVal should be called with the union {a:true,b:false}");
					equal(val.b,false,"watch.setVal should be called with the union {a:true,b:false}");
				}
			},"foo");
		});
	}
);


asyncTest("combine functional type - N objects",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = [{a: true},{b: false},{c: true},{d:false}];
			resolvers.combine(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.a,true,"watch.setVal should be called with the union {a:true,b:false,c:true,d:false}");
					equal(val.b,false,"watch.setVal should be called with the union {a:true,b:false,c:true,d:false}");
					equal(val.c,true,"watch.setVal should be called with the union {a:true,b:false,c:true,d:false}");
					equal(val.d,false,"watch.setVal should be called with the union {a:true,b:false,c:true,d:false}");
				}
			},"foo");
		});
	}
);