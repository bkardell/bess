/**
 * String Scanner used to facilitate the Bess.Parser
 *
 * @param {String} source the original source to scan
 */
Bess.Scanner = function(source){
  this.source = source;
};

/**
 * Prototype of each Scanner instance
 *
 * @type {Object}
 */
Bess.Scanner.prototype = {

  toString: function(){
    return this.source;
  },

  // - The current character - BEGIN is guaranteed to never be a valid non-start state
  // in the wild as, by definition it is not a character.
  current:'BEGIN',

  // - The current regex test
  test: null,

  // - We track the current index and the tail index
  index: 0,

  tailIndex: function(){
    return this.source.length-1;
  },

  // - You can move the current index forward
  setIndex:   function(index){
    this.current = this.source[index]; this.index=index; return this;
  },

  // - Advance the current index until the specified test(s) are true.
  readUntil: function(regexs){
    var c,
      x = 0,
      regs = (regexs.length) ? regexs : [regexs];
    for(this.index; this.index <= this.tailIndex(); this.index++){
      c = this.source.charAt(this.index);
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

  //Match the provided string and advance the length before returning
  sniff: function(s) {
    var test = this.source.substr(this.index, s.length);
    if(test === s) {
      this.index += s.length;
      this.current = this.source.charAt(this.index);
      return true;
    }
    return false;
  },

  // - Substring method from the original string being scanned...
  capture: function(s,e){
    return this.source.substring(s,e);
  },

  // - Finds the next index of a literal character after current pointer...
  nextIndexOf: function(lit){
    return this.source.indexOf(lit,this.index);
  },

  // - Finds the last index of a literal character before the tail pointer...
  tailIndexOf: function(lit){
    return this.source.lastIndexOf(lit,this.tailIndex());
  },

  // - Look forward or backward some number of characters without changing current...
  peek: function(i){
    return this.source.charAt(this.index+(i||1));
  },

  // - Returns true when current pointer has moved the number of characters in limit
  // or reaches the tail...
  isDone: function(limit){
    return (this.index>=(limit || this.tailIndex()));
  },

  // - Move the current pointer forward or backwards n spaces.
  advance: function(n){
    this.index = this.index + (n||1);
    this.current = this.source.charAt(this.index);
    return this;
  },

  skipMultiLineComment: function(){
    if(this.current === '/' && this.peek() === '*'){
      this.setIndex(this.nextIndexOf('*/')).advance(2);
      this.skipWhitespace();
    }
  },

  // - Advance current to the next non-whitespace character
  skipWhitespace: function(){
    this.readUntil([/\S/]);
    return this;
  }
};