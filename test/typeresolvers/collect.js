module("behavior engine - functional types - collect", {
	setup: function(){ /* nada */ }
});

asyncTest("collect functional type (attr, collection)",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref, input;
			ref = document.getElementById('qunit-fixture').innerHTML = '<form><select id="a"><option value="x" selected="selected">x</option><option value="y">y</option><option value="z">z</option></select></form>';
			input = ['value', $('#a option')];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with all of the option values as an array");
					equal(val[0],'x',"watch.setVal should be called with [0]='x'");
					equal(val[1],'y',"watch.setVal should be called with [1]='y'");
					equal(val[2],'z',"watch.setVal should be called with [2]='z'");
               	}
			},"foo");
		});
	}
);

asyncTest("collect functional type known (attr, collection, default)",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML += '<form><select id="a"><option value="x" selected="selected">x</option><option value="y">y</option><option value="z">z</option></select></form>';
			var input = ['value',$('#a option'),'blah'];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with all of the option values as an array");
					equal(val[0],'x',"watch.setVal should be called with [0]='x'");
					equal(val[1],'y',"watch.setVal should be called with [1]='y'");
					equal(val[2],'z',"watch.setVal should be called with [2]='z'");
				}
			},"foo");
		});
	}
);

asyncTest("collect functional type unknown (attr, collection, default)",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '<form><select id="a"><option value="x" selected="selected">x</option><option value="y">y</option><option value="z">z</option></select></form>';
			var input = ['unknown',$('#a option'),'true'];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with default value for all matches as an array");
					equal(val[0],'true',"watch.setVal should be called with [0]='true'");
					equal(val[1],'true',"watch.setVal should be called with [1]='true'");
					equal(val[2],'true',"watch.setVal should be called with [2]='true'");
				}
			},"foo");
		});
	}
);


asyncTest("collect functional type - from array of objects",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['name',[{name: 'Brian'},{name: 'Clint'},{name: 'Tyler'}]];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'Brian',"watch.setVal should be called with [0]='Brian'");
					equal(val[1],'Clint',"watch.setVal should be called with [1]='Clint'");
					equal(val[2],'Tyler',"watch.setVal should be called with [2]='Tyler'");
				}
			},"foo");
		});
	}
);

asyncTest("collect functional type - from array of objects with known default",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['name',[{name: 'Brian'},{name: 'Clint'},{name: 'Tyler'}],'blah'];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'Brian',"watch.setVal should be called with [0]='Brian'");
					equal(val[1],'Clint',"watch.setVal should be called with [1]='Clint'");
					equal(val[2],'Tyler',"watch.setVal should be called with [2]='Tyler'");
				}
			},"foo");
		});
	}
);

asyncTest("collect functional type - from array of objects with unknown / default",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['name',[{name: 'Brian'},{name: 'Clint'},{phone: '123-456-7890'}],'UNKNOWN'];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'Brian',"watch.setVal should be called with [0]='Brian'");
					equal(val[1],'Clint',"watch.setVal should be called with [1]='Clint'");
					equal(val[2],'UNKNOWN',"watch.setVal should be called with [2]='UNKNOWN'");
				}
			},"foo");
		});
	}
);


asyncTest("collect functional type - from array of irregular objects",
	function(){
		expect(5);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['name',[{name: 'Brian'},{name: 'Clint'},{name: 'Tyler'},{color: 'blue'}]];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,3,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'Brian',"watch.setVal should be called with [0]='Brian'");
					equal(val[1],'Clint',"watch.setVal should be called with [1]='Clint'");
					equal(val[2],'Tyler',"watch.setVal should be called with [2]='Tyler'");
				}
			},"foo");
		});
	}
);


asyncTest("collect functional type - from object",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['name',{name: 'Brian'}];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'Brian',"watch.setVal should be called with [0]='Brian'");
				}
			},"foo");
		});
	}
);


asyncTest("collect functional type - from object with known default",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['name',{name: 'Brian'}, "UNKNOWN"];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'Brian',"watch.setVal should be called with [0]='Brian'");
				}
			},"foo");
		});
	}
);


asyncTest("collect functional type - from object with unknown / default",
	function(){
		expect(3);
		require(["src/extendedjquery", "src/typeresolvers"],function($, resolvers){
			/* Find requires nodes in the page.... */
			var ref = document.getElementById('qunit-fixture').innerHTML +=  '';
			var input = ['age',{name: 'Brian'}, "UNKNOWN"];
			resolvers.collect(ref,input,{
				setVal: function(prop,val){
					QUnit.start();
					equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
					equal(val.length,1,"watch.setVal should be called with the values as an array with 3 items");
					equal(val[0],'UNKNOWN',"watch.setVal should be called with [0]='UNKNOWN'");
				}
			},"foo");
		});
	}
);
