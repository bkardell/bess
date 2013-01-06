define([], function(){
	var slide, scale, $=jQuery;

	// A bounce easing function - too useful not to have...
	$.easing.bounce = function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
		}
	};

	// Implementation of the basic CSS selectors level 4 proposal should anyone find a use..
	$.expr[':'].matches = function(obj, index, meta, stack) {
		return $(obj).is(meta[3]);
	};

	// Implementation of our own "closest" which is like "only the deepest :has()"
	$.expr[':'].closest = function(obj, index, meta, stack) {
		var x = $(stack).has(meta[3]);
		return obj === x[x.length-1];
	};

	// Shorter, more intuitive negation syntax for jquery's :nth() and :eq()
	$.expr[':'].notNth = function(obj, index, meta, stack) {
		return meta[3] != $(obj).index();
	};
	$.expr[':'].notEq = $.expr[":"].notNth;

	// All of the siblings of the arg, but not itself.
	$.expr[':'].siblings = function(obj, index, meta, stack) {
		var it = $(meta[3]).get(0);
		return (it !== undefined && it !== obj && it.parentNode == obj.parentNode);
	};

	// Partial implementation of
	// http://dev.w3.org/csswg/selectors4/#nth-match
	// which currently requires you to read the www-style archives to
	// figure out... Essentially it allows you to algebraicly choose the
	// nth sibling which _matches_ against a selector at the same level.
	// This is generally what designers really want.  Note the
	// difference is that whereas nth-child looks at all elements at
	// the same level whether they match or not.  This implementation
	// Does not currently support even/odd
	$.expr[':']['nth-match'] = function(obj, index, meta, stack) {
		var parent, i=0, pts, items, equation, n = 1, mod = 0, matcher;
		// meta[3] is the arguments passed to our filter (selector, equation)
		pts = meta[3].split(',');

		// parent is used to cache since all matches happen on children
		parent = obj.parentNode;

		// 2n + 2 = {base}n {+ mod}
		equation = pts[1].split('n');
		base = (parseInt(equation[0],10));
		matcher = pts[0];
		mod = (equation.length>1 && equation[1] !== '') ? parseInt(equation[1], 10) : mod;

		// Create a cache property if it's not there already...
		if(!parent.xcache){
			parent.xcache =  {};
		}

		// Create a cache entry for any matchers so that every test need
		// not filter all over again... Would be best to do this based
		// on a stack property.  Current problem is that it is based on
		// the state of the tree initially....
		if(!parent.xcache[matcher]){
			parent.xcache[matcher] = $(obj).siblings().andSelf().filter(matcher);
		}

		// We have to check whether the index of this is a match so
		// unfortunately we have to walk the length using get and
		// applying the equation based on the index to test
		// each one...
		for(i=0;i<parent.xcache[matcher].length;i++){
			if(parent.xcache[matcher].get(base * i + mod - 1) === obj){
				return true;
			}
		}
		return false;
	};

	slide = function(j,sp,eas,ctx,cfg){
		$.each(j,function(i,o){
			$(o).animate(cfg,
				{ queue: false, duration: sp, easing: eas }
			);
		});
	};


	$.fn.attract = function(sp,eas,f,ctx) {
		slide(this,sp,eas,ctx,{
				top: - ctx.position().top,
				left: - ctx.position().left
		});
	};

	$.fn.repel = function(sp,eas,f,ctx) {
		slide(this,sp,eas,ctx,{
				top: ctx.position().top,
				left: ctx.position().left
		});
	};

	$.fn.attractY = function(sp,eas,f,ctx) {
		slide(this,sp,eas,ctx,{top: ctx.position().top});
	};

	$.fn.repelY = function(sp,eas,f,ctx) {
		slide(this,sp,eas,ctx,{top: - ctx.position().top});
	};

	$.fn.attractX = function(sp,eas,f,ctx) {
		slide(this,sp,eas,ctx,{left: ctx.position().left});
	};

	$.fn.repelX = function(sp,eas,f,ctx) {
		slide(this,sp,eas,ctx,{left: - ctx.position().left});
	};

	scale = function(j,sp,eas,ctx,cfg) {
		$.each(j,function(i,o){
			$(o).animate(cfg,{ queue: false, duration: sp, easing: eas });
		});
	};

	$.fn.scaleXY = function(sp,eas,f,ctx) {
		scale(this,sp,eas,ctx,{height: ctx.height(),width: ctx.width()});
	};

	$.fn.scaleX = function(sp,eas,f,ctx) {
		scale(this,sp,eas,ctx,{width: ctx.width()});
	};

	$.fn.scaleY = function(sp,eas,f,ctx) {
		scale(this,sp,eas,ctx,{height: ctx.height()});
	};

	// Horizontal equivalent of jquery's "slideUp" which slide hides (closes) to the left.
	$.fn.slideLeft = function(sp,eas) {
		$.each(this,function(i,o){
			o.origStyle = $(o).css('display');
			o.style.display = 'block';
			$(o).animate({width: 'hide'},{ queue: false, duration: sp, easing: eas });
		});
	};

	// Horizontal equivalent of jquery's "slideDown" which slide shows (opens) to the right.
	$.fn.slideRight = function(sp,eas) {
		$.each(this,function(i,o){
			$(o).animate({width: 'show'},{ queue: false, duration: sp, easing: eas });
		});
	};

    return $;
});