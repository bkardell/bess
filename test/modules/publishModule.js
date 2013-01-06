module("behavior engine - modules - publish", {
	setup: function(){}
});

asyncTest("property verification",
	function(){
		expect(4);
		require(["src/behavior"],function(behavior){
			var publishModule = behavior[":"].publish;
			QUnit.start();
			expect(5);
			ok(publishModule.properties.length === 4, "has 4 properties");
			ok(publishModule.properties[0] === "topic", "first property is 'topic'");
			ok(publishModule.properties[1] === "data", "second property is 'data'");
			ok(publishModule.properties[2] === "timer", "first property is 'timer'");
			ok(publishModule.properties[3] === "repeat", "second property is 'repeat'");		});
	}
);


asyncTest("publish.apply({topic,repeat:1}))",
	function(){
		var messageCounter = 0;
		expect(2);
		require(["lib/pagebus"],function(PageBus){
			require(["src/behavior","src/extendedjquery"],function(behavior,$){
				var source, rst, publishModule = behavior[":"].publish;
				PageBus.subscribe('person.activated',null,function(topic,msg){
					QUnit.start();
					messageCounter++;
					equal(messageCounter,1,"1 message received...");
					equal($.isEmptyObject(msg),true,"default message should be an empty object, not null or anything.");
				});
				publishModule.apply({
					topic: 'person.activated',
					timer:  0,
					repeat: 1
				});
			});
		});
	}
);


asyncTest("publish.apply({topic,repeat:2}))",
	function(){
		var messageCounter = 0, captured;
		expect(2);
		require(["lib/pagebus"],function(PageBus){
			require(["src/behavior","src/extendedjquery"],function(behavior,$){
				var source, rst, publishModule = behavior[":"].publish;
				PageBus.subscribe('person.activated.again',null,function(topic,msg){
					messageCounter++;
					captured = msg;
				});
				publishModule.apply({
					topic: 'person.activated.again',
					data: {some: 'data'},
					timer:  0,
					repeat: 2
				});
				setTimeout(function(){
					QUnit.start();
					equal(messageCounter,2,"2 messages should be received...");
                    equal(captured.some,"data", "subscriber should have received published the message data");
				},200);
			});
		});
	}
);