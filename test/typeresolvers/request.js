module("behavior engine - functional types - request", {
	setup: function(){
        addToFixture('<form id="x" action="http://thisisaurl.com"> <input type="text" name="foo" value="bar"> </input><button>Go</button> </form>');
	}
});

asyncTest("request functional type - with a string / url",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			/* Find requires nodes in the page.... */
			var ref, input, origRequester = $.ajax;
			try{
				input = 'http://thisisaurl.com';
				$.ajax = function(c){ c.success("OK!"); }
				resolvers.request(null,input,{
					setVal: function(prop,val){
						QUnit.start();
						equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
						equal(val,"OK!","should have passed the value 'OK'");
					}
				},"foo");
			}catch(e){
				$.ajax = origRequester;
			}
		});
	}
);


asyncTest("request functional type - with array of url passed (depending on how you nest them)",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){
			var ref, input, origRequester = $.ajax;
			try{
				input = ['http://thisisaurl.com'];
				$.ajax = function(c){ c.success("OK!"); }
				resolvers.request(null,input,{
					setVal: function(prop,val){
						QUnit.start();
						equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
						equal(val,"OK!","should have passed the value 'OK'");
					}
				},"foo");
			}catch(e){
				$.ajax = origRequester;
			}
		});
	}
);

  /*   This test does not work because a a !@#% rhino bug!
asyncTest("request functional type - with a form",
	function(){
		expect(2);
		require(["src/typeresolvers","src/extendedjquery"],function(resolvers,$){

			var ref, input, origRequester = $.ajax;
			try{
				QUnit.start();
				input = $('#x');
				$.ajax = function(c){ c.success("OK!"); }
				resolvers.request(null,input,{
					setVal: function(prop,val){
						QUnit.start();
						equal(prop,"foo","watch.setVal should be called with the property 'foo'.");
						equal(val,"OK!","should have passed the value 'OK'");
					}
				},"foo");
			}catch(e){
				$.ajax = origRequester;
			}
		});
	}
);               */