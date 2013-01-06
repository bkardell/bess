module("behavior engine - functional types - mash", {
	setup: function(){ /* nada */ }
});


asyncTest("markup functional type - basic",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery",manifest.templating],function(resolvers,$,TemplateManager){
			var input, template;
			template = TemplateManager.create('Hello {world}');
			input = [template,{world: "Brian"}];
			resolvers.mash(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,'Hello Brian',"watch.setVal should be called with 'Hello Brian'");
 				}
			},"foo");
		});
	}
);


asyncTest("markup functional type with an anonymous array",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery",manifest.templating],function(resolvers,$,TemplateManager){
			var input, template;
			template = TemplateManager.create("Hello {#.}{.}{/.}");
			input = [template,['A','B','C']];
			resolvers.mash(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,'Hello ABC',"watch.setVal should be called with 'Hello Brian'");
 				}
			},"foo");
		});
	}
);


asyncTest("markup functional type with an anonymous array and optional 3rd 'balance' arg",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery",manifest.templating],function(resolvers,$,TemplateManager){
			var input, template = TemplateManager.create("Hello {#.}{.}{/.} ");
			input = [template,['A','B','C','D'],2];
			resolvers.mash(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,'Hello AB Hello CD ',"watch.setVal should be called with 'Hello AB Hello CD '");
 				}
			},"foo");
		});
	}
);
      /*  Broken because we need a way to test with partials since the JS API does not allow you to create named templates...
asyncTest("mash functional type with bess defined templates as partials",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var template, input;
			dust.cache["names"] = TemplateManager.create("names", "{#.} - {.}{/.}");

			input = ['Hello to: {>names}',["Clint", "Tyler","Shekhar","Brian"]];
			resolvers.mash(null,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val,'Hello to:  - Clint - Tyler - Shekhar - Brian',"watch.setVal should be called with 'Hello to: - Clint - Tyler - Shekhar - Brian'");
 				}
			},"foo");
		});
	}
);
        */
