module("behavior engine - functional types - template", {
	setup: function(){}
});


asyncTest("template functional type",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery","lib/mustache"],function(resolvers,$,Mustache){
			var input = ['hello'];
			window.bess_templates = {"hello": "Hello {World}!"};
			resolvers.template(null,input,{
				setVal: function(prop,val){
                    QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,'Hello {World}!',"watch.setVal should be called with the template, when applied that should yield 'Hello World!'");				
				}
			},"foo");
		});
	}
);


