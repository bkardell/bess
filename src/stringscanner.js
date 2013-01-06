define([], (function(){

	/**
		Creates a simple wrapper around a string that maintains head/tail indexes and provides a simple
		API for character based scanning and searching against literals and regex(s). These methods
		are <em>very highly optimized in modern browsers</em> - it has considerably lower memory
		usage as well as very few intermediate objects need to be created as you parse.  The
		difference between this approach and more traditional tokenizing is huge for large strings
		text.  Most methods return the scanner itself and allow chaining.
		@exports stringscanner
	*/
	var scanner = {

		// Creates a simple wrapper around a string that maintains head/tail indexes and provides a simple
		// API for character based scanning and searching against literals and regex(s). These methods
		// are <em>very highly optimized in modern browsers</em> - it has considerably lower memory
		// usage as well as very few intermediate objects need to be created as you parse.  The
		// difference between this approach and more traditional tokenizing is huge for large strings
		// text.  Most methods return the scanner itself and allow chaining.
		create: function(source){

			var str = source;
			return {
				toString: function(){return str; },
				// - The current character - BEGIN is guaranteed to never be a valid non-start state
				// in the wild as, by definition it is not a character.
				current:'BEGIN',

				// - The current regex test
				test: null,

				// - We track the current index and the tail index
				index: 0, tailIndex: str.length-1,

				// - You can move the current index forward
				setIndex:   function(index){
					this.current = str[index]; this.index=index; return this;
				},

				// - Advance the current index until the specified test(s) are true.
				readUntil: function(regexs){
					var c,
						x = 0, 
						regs = (regexs.length) ? regexs : [regexs];
					for(this.index; this.index <= this.tailIndex; this.index++){
						c = str.charAt(this.index);
						for(x=0; x < regs.length; x++){
							if(regs[x] && regs[x].test(c)){
								this.current = c;
								this.test = regs[x];
								return this;
							}
						}
					}
					return this;
				},
				
				// - Match provided string and advance the length before returning
				sniff: function(s) {
					var test = str.substr(this.index, s.length);
					if(test === s) {
						this.index += s.length;
						this.current = str.charAt(this.index);
						return true;
					}
					return false;
				},

				// - Substring method from the original string being scanned...
				capture: function(s,e){ return str.substring(s,e); },

				// - Finds the next index of a literal character after current pointer...
				nextIndexOf: function(lit){ return str.indexOf(lit,this.index); },

				// - Finds the last index of a literal character before the tail pointer...
				tailIndexOf: function(lit){ return str.lastIndexOf(lit,this.tailIndex); },

				// - Look forward or backward some number of characters without changing current...
				peek: function(i){ return str.charAt(this.index+(i||1)); },

				// - Returns true when current pointer has moved the number of characters in limit
				// or reaches the tail...
				isDone: function(limit){ return (this.index>=(limit || this.tailIndex));},

				// - Move the current pointer forward or backwards n spaces.
				advance: function(n){
					this.index = this.index + (n||1); this.current = str.charAt(this.index);return this;
				},

				// - Advance current to the next non-whitespace character
				skipWhitespace: function(){
					this.readUntil([/\S/]); return this;
				}
			};
		}
	};
	return scanner;
}()));

