module("behavior engine - modules - html", {
	setup: function(){}
});

asyncTest("property verification",
	function(){
		expect(4);
		require(["src/behavior"],function(behavior){
			var htmlModule = behavior[":"].html;
			QUnit.start();
			ok(htmlModule.properties.length === 3, "has 3 properties");
			ok(htmlModule.properties[0] === "op", "second property is 'op'");
			ok(htmlModule.properties[1] === "source", "first property is 'source'");
			ok(htmlModule.properties[2] === "target", "second property is 'target'");
		});
	}
);

asyncTest("html.apply({source,single-target,'replaceContent'})",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var source, rst, htmlModule = behavior[":"].html;
			source = '<div id="foo" class="pop">x</div><div id="bar">y</div>';
			htmlModule.apply({
				source: source,
				target: $('#qunit-fixture'),
				op:     'replaceContent'
			},$('body'));
			setTimeout(function(){
				QUnit.start();
				rst = $('.pop');
				equal(rst.length,1);       // Should have applied to 1 element
			},250);
		});
	}
);


asyncTest("html.apply({source,multi-target,'replaceContent'})",
	function(){
		expect(1);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var source, rst, htmlModule = behavior[":"].html;
			addToFixture('<div class="xyz"></div><div class="xyz"></div>');
			source = '<div class="pop">x</div><div class="pop">y</div>';
			htmlModule.apply({
				source: source,
				target: $('.xyz'),
				op:     'replaceContent'
			},$('body'));
            setTimeout(function(){
				QUnit.start();
				rst = $('.pop');
				equal(rst.length,4);       // Should have applied to 2 elements, created 4
			},250);


		});
	}
);



asyncTest("html.apply({source,multi-target,'prepend'})",
	function(){
		expect(4);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var source, rst, htmlModule = behavior[":"].html;
			addToFixture('<div class="xyz"><span class="orig"></span></div><div class="xyz"><span class="orig"></span></div>');
			source = '<div class="pop">x</div>';
			htmlModule.apply({
				source: source,
				target: $('.xyz'),
				op:     'prepend'
			},$('body'));

            setTimeout(function(){
				QUnit.start();
				rst = $('.pop');
				equal(rst.length,2);                           // Should have applied to 2 elements

				rst = $('.xyz');
				equal(rst.length,2);                           // These should be intact, exactly 2..
				equal(rst.first().children().length, 2);       // There should be exactly 2 children...
				equal(
					$('#qunit-fixture')[0].innerHTML.trim(),
					'<div class="xyz"><div class="pop">x</div><span class="orig"></span></div>' +
					'<div class="xyz"><div class="pop">x</div><span class="orig"></span></div>'
				);
			},250);
		});
	}
);


asyncTest("html.apply({source,multi-target,'append'})",
	function(){
		expect(4);
		require(["src/behavior","src/extendedjquery"],function(behavior,$){
			var source, rst, htmlModule = behavior[":"].html;
			addToFixture('<div class="xyz"><span class="orig"></span></div><div class="xyz"><span class="orig"></span></div>');
			source = '<div class="pop">x</div>';
			htmlModule.apply({
				source: source,
				target: $('.xyz'),
				op:     'append'
			},$('body'));

			setTimeout(function(){
				QUnit.start();
				rst = $('.pop');
				equal(rst.length,2);                           // Should have applied to 2 elements

				rst = $('.xyz');
				equal(rst.length,2);                           // These should be intact, exactly 2..
				equal(rst.first().children().length, 2);       // There should be exactly 2 children...
				equal(
					$('#qunit-fixture')[0].innerHTML.trim(),
					'<div class="xyz"><span class="orig"></span><div class="pop">x</div></div>' +
					'<div class="xyz"><span class="orig"></span><div class="pop">x</div></div>'
				);
			},250);
		});
	}
);