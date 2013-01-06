module("behavior engine - modules - form", {
	setup: function(){}
});

asyncTest("property verification",
	function(){
		expect(3);
		require(["src/behavior"],function(behavior){
			var formModule = behavior[":"].form;
			QUnit.start();
			equal(formModule.properties.length,2,"has 2 properties");
			equal(formModule.properties[0],"target", "first property is 'target'");
			equal(formModule.properties[1],"data", "second property is 'data'");
		});
	}
);


asyncTest("form.apply() - simple value test",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, formModule = behavior[":"].form;
			QUnit.start();
			addToFixture('<form id="myForm"><input id="foo" name="foo" /></form>');

			formModule.apply({
				target: $('#foo'),
				data:  'testok'
			},null);

			rst = $('#foo');
			equal(rst.first().val(),"testok");
		});
	}
);

asyncTest("form.apply() - select box test",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, formModule = behavior[":"].form;
			QUnit.start();
			addToFixture('<form id="myForm"><select id="foo" name="foo"><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></form>');

			formModule.apply({
				target: $('#foo'),
				data:  'A'
			},null);

			rst = $('#foo');
			equal(rst.first().val(),"A");
		});
	}
);


asyncTest("form.apply() - (multi) select box test",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, formModule = behavior[":"].form;
			QUnit.start();
			addToFixture('<form id="myForm"><select id="foo" name="foo" multiple><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></form>');

			formModule.apply({
				target: $('#foo'),
				data:  ['A','B']
			},null);

			rst = $('#foo');
			equal(rst.first().val().length,2,"Two options should have been selected");
		});
	}
);


asyncTest("form.apply() - form with object as data test",
	function(){
		expect(2);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, formModule = behavior[":"].form;
			QUnit.start();
			addToFixture('<form id="myForm"><input id="boo" name="boo"><select id="foo" name="foo" multiple><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></form>');

			formModule.apply({
				target: $('#myForm'),
				data:  { boo: 'bar', foo: ['A','B']}
			},null);

			rst = $('#foo');
			equal(rst.first().val().length,2,"Two options should have been selected");

			rst = $('#boo');
			equal(rst.first().val(),'bar',"The element #boo should have had its value set to bar");

		});
	}
);


asyncTest("form.apply() - clear an input test",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, formModule = behavior[":"].form;
			QUnit.start();
			addToFixture('<form id="myForm"><input id="coo" name="boo" value="d" /></form>');

			formModule.apply({
				target: $('#coo'),
				data:  ""
			},null);

			rst = $('#coo');
			equal(rst.first().val(),'',"The element #coo should have had its value cleared");

		});
	}
);


asyncTest("form.apply() - clear a whole form test",
	function(){
		expect(2);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, formModule = behavior[":"].form;
			QUnit.start();
			addToFixture('<form id="myForm"><input id="coo" name="boo" value="d" /><select id="foo" name="foo" multiple><option value="A" selected>A</option><option value="B" selected>B</option><option value="C">C</option></select></form>');

			formModule.apply({
				target: $('#myForm'),
				data:  ""
			},null);

			rst = $('#foo');
			equal(rst.first().val(),null,"The element #foo should have had its values cleared");

			rst = $('#coo');
			equal(rst.first().val(),'',"The element #coo should have had its value cleared");

		});
	}
);