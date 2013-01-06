module("behavior engine - modules - class", {
    setup: function(){
    }
});

asyncTest("property verification",
	function(){
		expect(4);
		require(["src/behavior"],function(behavior){
			var classModule = behavior[":"]["class"];
			QUnit.start();
			ok(classModule.properties.length === 3, "has 3 properties");
			ok(classModule.properties[0] === "op", "first property is 'op'");
			ok(classModule.properties[1] === "name", "first property is 'name'");
			ok(classModule.properties[2] === "target", "second property is 'target'");
		});
    }
);


asyncTest("class.apply() - add",
	function(){
		expect(3);
		require(["src/behavior",'src/extendedjquery'],function(behavior,$){
			var classModule = behavior[":"]["class"];
			QUnit.start();
			addToFixture('<div id="foo" class="p">x</div><div id="bar">y</div>');
			classModule.apply({
				op:     'add',
				target: $('#foo'),
				name:  'testok'
			},null);
			var rst = $('.testok');
			equal(rst.length,1);                   // Should have applied to 1 element
			equal(rst.attr('id'),"foo");           // The id of that should be foo
			equal(rst.attr('class'),"p testok");   // should not remove other classes
		});
    }
);



asyncTest("class.apply() - toggle",
	function(){
		expect(4);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var rst, classModule = behavior[":"]["class"];
			QUnit.start();
			addToFixture('<div id="foo" class="p">x</div><div id="bar">y</div>');
			classModule.apply({
				op:     'toggle',
				target: $('#foo'),
				name:  'testok'
			},null);

			rst = $('.testok');
			equal(rst.length,1);                   // Should have applied to 1 element
			equal(rst.attr('id'),"foo");           // The id of that should be foo
			equal(rst.attr('class'),"p testok");   // should not remove other classes

			classModule.apply({
				op:     'toggle',
				target: $('#foo'),
				name:  'testok'
			},null);
			rst = $('.testok');
			equal(rst.length,0);                  // Should have applied to 1 element
		});
    }
);


asyncTest("class.apply() - remove",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var classModule = behavior[":"]["class"];
			QUnit.start();
			addToFixture('<div id="foo" class="p testok">x</div><div id="bar">y</div>');
			classModule.apply({
				op:     'remove',
				target: $('#foo'),
				name:  'testok'
			},null);
			var rst = $('.testok');
			equal(rst.length,0);                   // Should have applied to 1 element
		});
    }
);