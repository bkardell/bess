bess
====

Bess is a stylesheet language for describing behavioral rules with familiar, CSS-like constructs and syntax.
Specifically, it is a simplified language which is compatible with CSS's forward compatible grammar.

Including Bess Rules
====================

Bess rules are placed in a style or link tag with the type="text/bess" 

```html
  <style type="text/bess"></style>
```

All bess rules are defined with the following grammar:

	[selector]:[state]{
		[module]-[property]:  [value or typefn];
	}


in which:
 * selector is any valid selector, 
 *  state is any named event
 * module is any registered module (see below)
 * value is a single quoted string or a number ~or~ typefn is any registered resolver function(see below)
	
Modules
=======
Modules are anonymous requirejs modules functions defined as follows:

alert.js

	define([], [{
	
		 // the name of the module being defined
		name: 'alert',  	
		
		// one of either 'module' or 'type'
		type: 'module',
		
		// a list of the properties supported by this module, order defines shorthand order
		properties:['text'],
		
		// the default for each property value if not specified, can use built-ins:
		//   - Bess.resolvers._find()  
		//   - Bess.resolvers._str('slow')
		//   - Bess.resolvers._obj()
		defaults:{
			'text': Bess.resolvers._str('') 
		},
		
		// define how it is applied, 
		// - dat is a data object containing (all of) the resolved
		//   properties defined for this module at the moment it becomes relevant
		// - el is the element upon which the rule became relevant
		apply: function(dat,el){
			alert(dat.text);
		}
	}]);


modules/types and packages of modules and types can be imported into your Bess with 
an @import rule at the top of your sheet.  The above example might be imported as:

	<style type="text/bess">
		@import package('alert.js');
		
		h1:html-inserted {
			effect-name: 'fadeOut';
			effect-duration: 1000;
		}

		h1:post-fadeOut {
			html-source: '<div>Goodbye!</div>';
			effect-name: 'fadeIn';
		}
		
		h1:click{
			alert: 'oh my goodness';
		}
		
		#myShowButton:click{
			class-op:   'remove', 'add';
			class-name: 'off', 'off';
			class-target: find('.someMagicContent, #myHideButton'), find('#myShowButton');
		}

		#myHideButton:click{
			class-op:   'remove', 'add';
			class-name: 'off', 'off';
			class-target: find('#myShowButton'), find('.someMagicContent, #myHideButton');
		}

	</style>
