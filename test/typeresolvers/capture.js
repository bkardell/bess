module("behavior engine - functional types - collect", {
	setup: function(){ /* nada */ }
});

asyncTest("capture functional type - single <select>",
	function(){
		expect(3);
		require(["src/typeresolvers"],function(resolvers){
			/* Find requires nodes in the page.... */
			var ref, input;
			ref = document.getElementById('qunit-fixture').innerHTML += '<form><select id="a"><option value="x" selected="selected">x</option><option value="y">y</option><option value="z">z</option></select></form>';
			input = ['#a option:selected'];
			resolvers.capture(ref,input,{
				setVal: function(prop,val){
                   QUnit.start();
				   equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
				   equal(val.length,1,"watch.setVal should be called with ONLY the selected value");
				   equal(val,'x',"watch.setVal should be called with 'x'");
				}
			},"foo");
		});
    }
);


asyncTest("capture functional type - multi <select>",
	function(){
		expect(4);
		require(["src/typeresolvers"],function(resolvers){
			/* Find requires nodes in the page.... */
			var ref, input;
			ref = document.getElementById('qunit-fixture').innerHTML = '<form><select multiple id="a"><option value="x" selected>x</option><option selected value="y">y</option><option value="z">z</option></select></form>';
			input = ['#a option:selected'];
			resolvers.capture(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,2,"watch.setVal should be called with ONLY the selected values");
					equal(val[0],'x',"watch.setVal should be called with 'x'");
					equal(val[1],'y',"watch.setVal should be called with 'y'");
				}
			},"foo");
		});
    }
);

asyncTest("capture functional type - multi <select> with :not",
	function(){
		expect(3);
		/* Find requires nodes in the page.... */
		var ref = document.getElementById('qunit-fixture').innerHTML = '<form><select multiple id="a"><option value="x" selected>x</option><option selected value="y">y</option><option value="z">z</option></select></form>';
		var input = ['#a option:not(:selected)'];
		require(["src/typeresolvers"], function(resolvers){
			resolvers.capture(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with ONLY the selected values");
					equal(val[0],'z',"watch.setVal should be called with 'something:)'");
			}
			},"foo");
		});
	}
);

