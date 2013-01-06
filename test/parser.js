module("behavior engine - parser", {
	setup: function(){
	}
});

asyncTest("property verification",
	function(){
		expect(4);
		require(["src/bessvalueparser"],function(parser){;
			QUnit.start();
			expect(2);
			ok(parser.parse, "returned parse");
			ok(parser.loadAndParse, "returned loadAndParse");
		});
	}
);

asyncTest("parser.parseRule - simple A",
	function(){
		expect(1);
		require(["src/bessvalueparser"],function(parser){;
			var rules = parser.parse(".foo:active {"
				+ "\n html-target:  find(':self .foo');"
				+ "\n html-source:  markup(find(':self+div'));"
				+ "\n html-op:  'prepend'));"
				+ "\n effect:   'hide' find(':self') 3000;"
				+ "\n }");

			QUnit.start();
			equal(rules.length,2,"should have parsed 2 (internal/compiled) rules");
		});
	}
);

asyncTest("parser.parseRule - simple B",
	function(){
		expect(1);
		require(["src/bessvalueparser"],function(parser){
			var rules = parser.parse(".foo:clicked {"
				+ "\n html-target:  find(':self .foo');"
				+ "\n html-source:  markup(find(':self+div'));"
				+ "\n html-op:  'prepend'));"
				+ "\n effect:   'hide' find(':self') 3000;"
				+ "\n } \n\n"
				+ ".bar:clicked {"
				+ "\n html-source:  'thank you';"
				+ "\n }");

			QUnit.start();
			equal(rules.length,3,"should have parsed 3 (internal/compiled) rules");
		});
	}
);

asyncTest("parser.parseRule - @import test",
	function(){
		expect(4);

		/* Mock a module... */
		define('testmodule',function(){
			return {
				name: 'testmodule',
				properties: ['source', 'target'],
				defaults: {},
				apply: function(data, element) {
					return "Test Passed!";
				}
			};
		});
		require(["src/modules", "src/bessvalueparser"],function(modules,parser){
			var importedModule,
				rst,
				rules = parser.parse("@import module('testmodule');");

			/* The import should have registered that module */
			setTimeout(function(){
	 			importedModule = modules('testmodule');
				
				QUnit.start();
				
				ok(importedModule, "imported module");
	
				equal(importedModule.name, "testmodule", "import worked and name was correct");
				equal(importedModule.properties.length, 2, "source and target were listed as properties");
				rst = importedModule.apply();
				equal(rst, "Test Passed!", "result of apply worked from import test.");
			},1000);
		});
	}
);

asyncTest("parser.parseRule - selector groups",
	function(){
		expect(1);
		require(["src/bessvalueparser"],function(parser){;
			var rules = parser.parse(".foo:active, .bar:clicked {"
				+ "\n html-target:  find(':self .foo');"
				+ "\n html-source:  markup(find(':self+div'));"
				+ "\n html-op:  'prepend'));"
				+ "\n }");

			QUnit.start();
			equal(rules.length,2,"should have parsed 2 (internal/compiled) rules");
		});
	}
);

asyncTest("parser.parseRule - unknown prop on known module",
	function(){
		expect(2);
		require(["src/bessvalueparser"],function(parser){;
			var rules = parser.parse(".foo:active {"
				+ "\n html-target:  find(':self .foo'), 'a';"
				+ "\n html-source:  html(find(':self+div')), 'b';"
				+ "\n html-badProp:  'what will this do?', 'c';"
				+ "\n }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			var ct=0;
			for(var c in rules[0].declaration){
				ct++;
			}
			equal(ct,2,"There should be 2 properties in the declaration, badProp shouldn't come through.");
		});
	}
);


asyncTest("parser.parseRule - single shorthand with multiplicity and defaults",
	function(){
		expect(14);
		require(["src/bessvalueparser"],function(parser){;
			var dec,parentResolver, rules = parser.parse(".foo:active { class:  'add' 'foo', 'remove' 'bar' find(':self'); }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			var ct=0;
			for(var c in rules[0].declaration){
				ct++;
			}
			equal(rules.length,1,"should have parsed 1 rule");
			equal(rules[0].module,'class',"module should be 'class'");
			dec = rules[0].declaration;

			equal(dec.op[0].arg,'add',"op arg should be 'add'");
			equal(dec.op[0].resolver,'string',"op resolver should be 'string'");
			equal(dec.name[0].arg,'foo',"name arg should be 'foo'");
			equal(dec.name[0].resolver,'string',"name resolver should be 'string'");

			equal(dec.op[1].arg,'remove',"op arg should be 'remove'");
			equal(dec.op[1].resolver,'string',"op resolver should be 'string'");
			equal(dec.name[1].arg,'bar',"name arg should be 'bar'");
			equal(dec.name[1].resolver,'string',"name resolver should be 'string'");
			equal(dec.target[1].resolver,'find',"target resolver should be 'find'");

			//selectors are now surrounded by strings, so there is a nested resolver
			parentResolver = dec.target[1];
			equal(parentResolver.arg[0].arg,':self',"find's inner arg should be ':self'");
			equal(parentResolver.arg[0].resolver,'string',"find's inner resolver should be 'string'");
		});
	}
);


asyncTest("parser.parseRule - class shorthand with multiplicity test",
	function(){
		expect(14);
		require(["src/bessvalueparser"],function(parser){;
			var dec,parentResolver, rules = parser.parse(".foo:active { class:  'add' 'foo'  find(':self .foo'), 'remove' 'bar' find(':self'); }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			equal(rules[0].module,'class',"module should be 'class'");
			dec = rules[0].declaration;

			equal(dec.op[0].arg,'add',"op arg should be 'add'");
			equal(dec.op[0].resolver,'string',"op resolver should be 'string'");
			equal(dec.name[0].arg,'foo',"name arg should be 'foo'");
			equal(dec.name[0].resolver,'string',"name resolver should be 'string'");
			equal(dec.target[0].resolver,'find',"target resolver should be 'find'");

			equal(dec.op[1].arg,'remove',"op arg should be 'remove'");
			equal(dec.op[1].resolver,'string',"op resolver should be 'string'");
			equal(dec.name[1].arg,'bar',"name arg should be 'bar'");
			equal(dec.name[1].resolver,'string',"name resolver should be 'string'");
			equal(dec.target[1].resolver,'find',"target resolver should be 'find'");

			//selectors are now surrounded by strings, so there is a nested resolver
			parentResolver = dec.target[0].arg[0];  // Coming from a functional value will be an array
			equal(parentResolver.arg,':self .foo',"target's inner arg should be ':self .foo'");
			equal(parentResolver.resolver,'string',"target's inner resolver should be 'string'");
		});
	}
);


asyncTest("parser.parseRule - complex, shorthand-based multiplicity test",
	function(){
		expect(14);
		require(["src/bessvalueparser"],function(parser){
			var dec,parentResolver, rules = parser.parse(".foo:active { class:  'add' 'foo'  find(':self .foo'), 'remove' 'bar' find(':self'); }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			equal(rules[0].module,'class',"module should be 'class'");
			dec = rules[0].declaration;

			equal(dec.op[0].arg,'add',"op arg should be 'add'");
			equal(dec.op[0].resolver,'string',"op resolver should be 'string'");
			equal(dec.name[0].arg,'foo',"name arg should be 'foo'");
			equal(dec.name[0].resolver,'string',"name resolver should be 'string'");
			equal(dec.target[0].resolver,'find',"target resolver should be 'find'");

			equal(dec.op[1].arg,'remove',"op arg should be 'remove'");
			equal(dec.op[1].resolver,'string',"op resolver should be 'string'");
			equal(dec.name[1].arg,'bar',"name arg should be 'bar'");
			equal(dec.name[1].resolver,'string',"name resolver should be 'string'");
			equal(dec.target[1].resolver,'find',"target resolver should be 'find'");

			//selectors are now surrounded by strings, so there is a nested resolver
			parentResolver = dec.target[0].arg[0];  // Coming from a functional value will be an array
			equal(parentResolver.arg,':self .foo',"target's inner arg should be ':self .foo'");
			equal(parentResolver.resolver,'string',"target's inner resolver should be 'string'");
		});
	}
);


asyncTest("parser.parseRule - complex rule shorthand with nested arg/no arg functional types",
	function(){
		expect(11);
		require(["src/bessvalueparser"],function(parser){;
			var dec,
				collect_attr_dec,
				collect_obj_dec,
				rules = parser.parse(".foo:clicked { class:  'add' 'foo'  collect('name',message()); }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			equal(rules[0].module,'class',"module should be 'class'");
			dec = rules[0].declaration;
			equal(dec.name[0].arg,'foo',"name arg should be 'foo'");
			equal(dec.name[0].resolver,'string',"name resolver should be 'string'");

			equal(dec.op[0].arg,'add',"name arg should be 'add'");
			equal(dec.op[0].resolver,'string',"name resolver should be 'string'");

			equal(dec.target[0].arg.length,2,"target arg should be have two args to pass to collect");

			collect_attr_dec = dec.target[0].arg[0];
			equal(collect_attr_dec.resolver,'string',"the collect_attr_dec resolver is 'string'");
			equal(collect_attr_dec.arg,'name',"the collect_attr_dec arg is 'name'");

			collect_obj_dec = dec.target[0].arg[1];
			equal(collect_obj_dec.resolver,'message',"the collect_obj_dec resolver is 'message'");
			equal(collect_obj_dec.arg.length,0,"the collect_obj_dec is 0 arg");
		});
	}
);


asyncTest("parser.parseRule - basic shorthand test for class module",
	function(){
		expect(7);
		require(["src/bessvalueparser"],function(parser){
			var dec, parentResolver, rules = parser.parse(".foo:active { class:  'add' 'foo'  find(':self .foo'), 'remove' 'bar' find(':self'); }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			equal(rules[0].module,'class',"module should be 'class'");
			dec = rules[0].declaration;
			equal(dec.name[0].arg,'foo',"effect name arg should be 'foo'");
			equal(dec.name[0].resolver,'string',"effect name resolver should be 'string'");
			equal(dec.target[0].resolver,'find',"effect target resolver should be 'find'");

			//selectors are now surrounded by strings, so there is a nested resolver
			parentResolver = dec.target[0].arg[0]; // Coming from a functional value will be an array
			equal(parentResolver.arg,':self .foo',"effect target's inner arg should be ':self .foo'");
			equal(parentResolver.resolver,'string',"effect target's inner resolver should be 'string'");

		});
	}
);



asyncTest("parser.parseRule - basic shorthand test for effects module",
	function(){
		expect(11);
		require(["src/bessvalueparser"],function(parser){
			var dec, parentResolver, rules = parser.parse(".foo:active { effect:  'x' find(':self .foo')  3000 'bounce'; }");

			QUnit.start();
			equal(rules.length,1,"should have parsed 1 rule");
			equal(rules[0].module,'effect',"rule module should be 'effect'");
			dec = rules[0].declaration;
			equal(dec.name[0].arg,'x',"effect name arg should be 'x'");
			equal(dec.name[0].resolver,'string',"effect name resolver should be 'string'");
			equal(dec.duration[0].arg,'3000',"effect duration arg should be '3000");
			equal(dec.duration[0].resolver,'number',"effect duration resolver should be 'number'");
			equal(dec.easing[0].arg,'bounce',"effect easing arg should be 'bounce");
			equal(dec.easing[0].resolver,'string',"effect easing resolver should be 'string'");
			equal(dec.target[0].resolver,'find',"effect target resolver should be 'find'");

			parentResolver = dec.target[0].arg[0]; // Coming from a functional value will be an array
			equal(parentResolver.arg,':self .foo',"effect target's inner arg should be ':self .foo'");
			equal(parentResolver.resolver,'string',"effect target's inner resolver should be 'string'");
		});
	}
);


