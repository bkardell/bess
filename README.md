Bess
====

Bess is a stylesheet language for describing behavioral rules with familiar, CSS-like constructs and syntax.
Specifically, it is a simplified language which is compatible with CSS's forward compatible grammar.

Bess rules are placed in a style or link tag with the type="text/bess"

```html
  <style type="text/bess">
  	.alerts:html-inserted {
  		class: 'remove' 'collapsed';
  	}
  </style>
```

All bess rules are defined with the following grammar:

	[selector]:[state]{
		[module]-[property]:  [value or typefn];
	}

in which:
 * selector is any valid selector,
 * state is any named event
 * module is any registered module
 * value is a single quoted string or a number ~or~ typefn is any registered resolver function(see below)