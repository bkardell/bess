module('dommod', {
	setup: function(){
	}
});


asyncTest('mod - replaceContent', function(){
	expect(1);
	addToFixture('<div id="modtest">Hello World</div>');
	require(["src/dommod","src/extendedjquery"],function(mod,$){
		mod('replaceContent', 'Goodbye World', $('#modtest'));
		setTimeout(function(){
			QUnit.start();
			equal($('#modtest').html(),'Goodbye World','modTest should contain "Goodbye World"');
		},200);
	});
});


asyncTest('mod - empty', function(){
	expect(1);
	addToFixture('<div id="modtest">Hello World</div>');
	require(["src/dommod","src/extendedjquery"],function(mod,$){
		mod('empty', '', $('#modtest'));
		setTimeout(function(){
			QUnit.start();
			equal($('#modtest').html(),'','modTest should be empty');
		},200);
	});
});

asyncTest('mod - remove', function(){
	expect(1);
	addToFixture('<div id="modtest">Hello World</div>');
	require(["src/dommod","src/extendedjquery"],function(mod,$){
		mod('remove', '', $('#modtest'));
		setTimeout(function(){
			QUnit.start();
			equal($('#modtest').length,0,'modTest should be removed');
		},200);
	});
});

asyncTest('mod - append', function(){
	expect(3);
	addToFixture('<div id="modtest"><span>A</span></div>');
	require(["src/dommod","src/extendedjquery"],function(mod,$){
		var rst;
		mod('append', '<span>B</span>', $('#modtest'));
		setTimeout(function(){
			QUnit.start();
			rst = $('#modtest span');
			equal(rst.length,2,'modTest should contain 2 spans');
			equal(rst[0].innerHTML,'A','first should be A');
			equal(rst[1].innerHTML,'B','first should be B');
		},200);
	});
});


asyncTest('mod - append (pretending to be IE)', function(){
	expect(3);
	addToFixture('<div id="modtest"><span>A</span></div>');
	require(["src/dommod","src/extendedjquery"],function(mod,$){
		var rst;
		$.browser.msie = true;
		mod('append', '<span>B</span>', $('#modtest'));
		setTimeout(function(){
			QUnit.start();
			rst = $('#modtest span');
			equal(rst.length,2,'modTest should contain 2 spans');
			equal(rst[0].innerHTML,'A','first should be A');
			equal(rst[1].innerHTML,'B','first should be B');
		},200);
	});
});


asyncTest('mod - replaceContent which contains bess rules', function(){
	var ref;

	expect(2);
	addToFixture('<div id="modtest"><style id="x" bess_parsed="true"></style>Hello World</div>');

	// We'll need this...
	ref = document.getElementById("x");

	// create some mock bess rules and attach them to the ref...
	bessRules = [
		{ id: 'a', selector: { boundFrom: ref } },
		{ id: 'b', selector: { boundFrom: document.getElementsByTagName('body') } },
		{ id: 'c', selector: { boundFrom: ref } }
	];

	require(["src/dommod","src/extendedjquery"],function(mod,$){
		mod('replaceContent', 'Goodbye World', $('#modtest'));
		setTimeout(function(){
			QUnit.start();
			equal($('#modtest').html(),'Goodbye World','modTest should contain "Goodbye World"');
			equal(bessRules.length, 1, 'rules a and c should be removed as the were pruned');
			//ok(false,JSON.stringify(bessRules));
		},200);
	});
});
