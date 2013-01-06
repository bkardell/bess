
module('extended jquery', {
	setup: function(){}
});

asyncTest('easing.bounce', function(){
	expect(2);
	require(["src/extendedjquery"],function(extendedJQuery){
		QUnit.start();
		ok(extendedJQuery.easing.bounce, 'bounce exists');
		ok(extendedJQuery.easing.bounce(10,10,10,10,10), 'bounce executed');
	});
});

asyncTest('notNth/notEq selector plugin', function(){
	expect(10);
	addToFixture('<div id="x"><div>A</div><div>B</div><<div>C</div><div>D</div></div>');
	require(["src/extendedjquery"],function($){
		var rst;
		ok($.expr[':']['notEq'], 'notEq exists');
		ok($.expr[':']['notNth'], 'notNth exists');
		equal($.expr[':']['notEq'],$.expr[':']['notNth'],"notEq is an alias for notNth")
		rst = $("#x :notEq(0)");
		QUnit.start();
		equal(rst.length,3,"There should be three matches")
		equal(rst[0].tagName,'DIV','The tag name should be div');
		equal(rst[1].tagName,'DIV','The tag name should be div');
		equal(rst[2].tagName,'DIV','The tag name should be div');
		equal(rst[0].innerHTML,'B','The element should contain "B"');
		equal(rst[1].innerHTML,'C','The element should contain "C"');
		equal(rst[2].innerHTML,'D','The element should contain "D"');
	});
});



/* Note that the difference between this test and the one below is the space
   after div in the selector "div .foo".  This test verifies that this match
   is performed independently, not 'inside of' the query 'so far'.  this means
   that the span _will_ match because it is inside of a div (#x or x's ancestors).
*/
asyncTest('matches selector plugin - matching selector is independent', function(){
	expect(8);
	addToFixture('<div id="x"><div>A</div><span>A</span><div class="foo">B</div><span>B</span><div>C</div><span class="foo">C</span><div class="foo">D</div><span>D</span></div>');
	require(["src/extendedjquery"],function($){
		var rst;
		ok($.expr[':']['matches'], 'matches exists');
		rst = $("#x :matches(div .foo)");
		QUnit.start();
		equal(rst.length,3,"There should be three matches")
		equal(rst[0].tagName,'DIV','The tag name should be div');
		equal(rst[1].tagName,'SPAN','The tag name should be span');
		equal(rst[2].tagName,'DIV','The tag name should be div');
		equal(rst[0].innerHTML,'B','The element should contain "B"');
		equal(rst[1].innerHTML,'C','The element should contain "C"');
		equal(rst[2].innerHTML,'D','The element should contain "D"');
	});
});

asyncTest('matches selector plugin', function(){
	expect(6);
	addToFixture('<div id="x"><div>A</div><span>A</span><div class="foo">B</div><span>B</span><div>C</div><span class="foo">C</span><div class="foo">D</div><span>D</span></div>');
	require(["src/extendedjquery"],function($){
		var rst;
		ok($.expr[':']['matches'], 'matches exists');
		rst = $("#x :matches(div.foo)");
		QUnit.start();
		equal(rst.length,2,"There should be two matches")
		equal(rst[0].tagName,'DIV','The tag name should be div');
		equal(rst[1].tagName,'DIV','The tag name should be div');
		equal(rst[0].innerHTML,'B','The element should contain "B"');
		equal(rst[1].innerHTML,'D','The element should contain "D"');
	});
});

asyncTest('nth-match selector plugin: 2n+1', function(){
	expect(6);
	addToFixture('<div id="x"><div>A</div><span>A</span><div>B</div><span>B</span><div>C</div><span>C</span><div>D</div><span>D</span></div>');
	require(["src/extendedjquery"],function($){
		var rst;
		ok($.expr[':']['nth-match'], 'nth-match exists');
		rst = $("#x :nth-match(div,2n-1)");
		QUnit.start();
		equal(rst.length,2,"There should be two matches")
		equal(rst[0].tagName,'DIV','The tag name should be div');
		equal(rst[1].tagName,'DIV','The tag name should be div');
		equal(rst[0].innerHTML,'A','The element should contain "A"');
		equal(rst[1].innerHTML,'C','The element should contain "C"');
	});
});

asyncTest('nth-match selector plugin: 2n', function(){
	expect(6);
	addToFixture('<div id="x"><div>A</div><span>A</span><div>B</div><span>B</span><div>C</div><span>C</span><div>D</div><span>D</span></div>');
	require(["src/extendedjquery"],function($){
		var rst;
		ok($.expr[':']['nth-match'], 'nth-match exists');
		rst = $("#x :nth-match(div,2n)");
		QUnit.start();
		equal(rst.length,2,"There should be two matches")
		equal(rst[0].tagName,'DIV','The tag name should be div');
		equal(rst[1].tagName,'DIV','The tag name should be div');
		equal(rst[0].innerHTML,'B','The element should contain "B"');
		equal(rst[1].innerHTML,'D','The element should contain "D"');
	});
});


