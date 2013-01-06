module("behavior engine - functional types - find", {
	setup: function(){}
});



asyncTest("find functional type - simple",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '<div><div id="a">A</div></div>';
			var input = ['#a'];
			resolvers.find(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with the node(s) from:" + input);
					equal(val[0].innerHTML,"A","watch.setVal should be called with the node(s) from:" + input);
				}
			},"foo");
		});
	}
);

asyncTest("find functional type - self",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<div><div id="a">A</div></div>');
			var input = ['<'];
			resolvers.find(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with ONLY the qunit-fixture node");
					equal(val[0].id,"qunit-fixture","watch.setVal should be called with the qunit-fixture node");
 				}
			},"foo");
		});
	}
);



asyncTest("find functional type - parent",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<div id="a"><div id="b">B</div></div>').find("#a");
			var input = ['*<'];
			resolvers.find(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with ONLY the qunit-fixture node");
					equal(val[0].id,"qunit-fixture","watch.setVal should be called with the qunit-fixture node");
				}
			},"foo");
		});
	}
);



asyncTest("find functional type - upward search to div",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<span id="a"><span id="b">B</span></span>').find("#b");
			var input = ['div<'];
			resolvers.find(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with ONLY the qunit-fixture node");
					equal(val[0].id,"qunit-fixture","watch.setVal should be called with the qunit-fixture node");
				}
			},"foo");
		});
	}
);


asyncTest("find functional type - upward search to div and then downward to h2",
	function(){
		expect(4);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<section><h2 id="a">A</h2><h2 id="b">B</h2></section>').find("#b");;
			var input = ['div<h2'];
			resolvers.find(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,2,"watch.setVal should be called with ONLY two h2's from the qunit-fixture node");
					equal(val[0].id,"a","the id of the first should be 'a'");
					equal(val[1].id,"b","the id of the second should be 'b'");
				}
			},"foo");
		});
	}
);


asyncTest("find functional type - :siblings",
	function(){
		expect(4);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<section><h2 id="a">A</h2><h2 id="b">B</h2><h2 id="c">B</h2></section>').find("#b");;
			var input = [':siblings(#b)'];
			resolvers.find(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,2,"watch.setVal should be called with ONLY two h2's from the qunit-fixture node");
					equal(val[0].id,"a","the id of the first should be 'a'");
					equal(val[1].id,"c","the id of the second should be 'c'");
				}
			},"foo");
		});
	}
);



asyncTest("find functional type - to() is alias of find()",
	function(){
		expect(4);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<section><h2 id="a">A</h2><h2 id="b">B</h2><h2 id="c">B</h2></section>').find("#b");
			var input = [':siblings(#b)'];
			resolvers.to(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,2,"watch.setVal should be called with ONLY two h2's from the qunit-fixture node");
					equal(val[0].id,"a","the id of the first should be 'a'");
					equal(val[1].id,"c","the id of the second should be 'c'");
				}
			},"foo");
		});
	}
);


asyncTest("find functional type - from() is alias of find()",
	function(){
		expect(4);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<section><h2 id="a">A</h2><h2 id="b">B</h2><h2 id="c">B</h2></section>').find("#b");
			var input = [':siblings(#b)'];
			resolvers.from(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,2,"watch.setVal should be called with ONLY two h2's from the qunit-fixture node");
					equal(val[0].id,"a","the id of the first should be 'a'");
					equal(val[1].id,"c","the id of the second should be 'c'");
				}
			},"foo");
		});
	}
);


asyncTest("find functional type - where() is alias of find()",
	function(){
		expect(4);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = $('#qunit-fixture').append('<section><h2 id="a">A</h2><h2 id="b">B</h2><h2 id="c">B</h2></section>').find("#b");
			var input = [':siblings(#b)'];
			resolvers.where(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,2,"watch.setVal should be called with ONLY two h2's from the qunit-fixture node");
					equal(val[0].id,"a","the id of the first should be 'a'");
					equal(val[1].id,"c","the id of the second should be 'c'");
				}
			},"foo");
		});
	}
);