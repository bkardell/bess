define([], [{
	name: 'alert',
	type: 'module',
	properties:['text'],
	defaults:{'text':''},
	apply: function(dat,el){
		alert(dat.text);
	}
}]);