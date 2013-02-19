/*global $:true*/

/**
 * A set of utilities used throughout Bess.
 *
 * @type {Object}
 */
Bess.Utility = {

  /**
   * Collection of Regular Expressions used in parsing.
   * @return {Object} hash of regexes
   */
  expressions: function(){
    var regExs = {
      isQuote: /\'/,
      isNumeric: /\d/,
      isSemi: /\;/,
      isOpenParen: /\(/,
      isCloseParen: /\)/,
      isOpenBrace: /\{/,
      isComma: /\,/,
      isColon: /\:/,
      isAtSymbol: /\@/,
      whiteSpace: /\s/,
      behavior: /^\-be\-([^\-]*)|^([a-z]*[A-z]*)/,
      pseudo: /\:/,
      pre: /\([^\)]+\)/,
      ids: /#[\d\w\-_]+/g,
      cls: /[\.:\[][^\.:\[+>]+/g,
      tag: /(^|[\s\+>])\w+/g
    };
    regExs.chop = [regExs.ids, regExs.cls, regExs.tag];
    return regExs;
  },

  /**
   * Helper functions for Selector specificity
   * @type {Object}
   */
  Specificity: {

    /**
     * Calculates the specificity of a Selector
     * @return {Number} An hexadecimal value
     */
    calculate: function(selector){
      var expressions = Bess.Utility.expressions();
      var s = selector.replace(expressions.pre,"");
      return parseInt(expressions.chop.map(function(p){
        var m = s.match(p);
        return m ? m.length.toString(16) : 0;
      }).join(''), 16);
    },

    /**
     * Sorts a collection of rules based on Specificity score of selectors
     * @param  {Array} rules collection of rules
     * @return {Array}           sorted rules
     */
    sort: function (rules) {
      return rules.sort(function (a, b) {
        return a.selector.score > b.selector.score ? 1 : (a.selector.score < b.selector.score) ? -1 : 0;
      });
    }

  },

  /**
   * Creates a jQuery Deferred for downloading the @import
   * @param  {String} type name of the type we're importing (package|module|type)
   * @param  {String} url  URL path for downloading
   * @return {Function}      Deferred promise
   */
  makeImportPromise: function(type, url){
    var deferred = $.Deferred();
    //TODO: We need a reliable download methodology.
    // - I'd prefer not to have RequireJS as a dependency.
    $.get(url, function(source){
      //TODO: This is horseshit here .. inspect the type and then register
      eval(source);
      deferred.resolve();
    }, 'text');
    return deferred.promise();
  },

  /**
   * Collection of resolver helpers.
   * @type {Object}
   */
  Resolvers: {
    string: function(s){
      return { resolver: 'string', arg: s || '' };
    },
    find: function(selector){
      return { resolver: 'find', arg: [this.string(selector || ':self')] };
    },
    object: function(code){
      return { resolver: 'object', arg: code || '{}' };
    }
  },

  /**
   * Universal event handler for all Bess rules
   * @param  {Event} e   original event
   * @param  {String} msg event message
   */
  globalHandler: function(e, msg) {
    e.preventDefault();
    // * If there isn't an to add actionable properties to, add one.
    if (!e.actionable) {
      e.actionable = [];
      e.actionableIds = [];
      e.target = e.currentTarget || e.target;
    }
    if ($.inArray(e.data.module + ':' + e.data.ruleId, e.actionableIds) === -1) {
      e.message = msg;
      // * Populate the data so that the end of the chain gets it all
      e.actionable.push(e.data);
      e.actionableIds.push(e.data.module + ':' + e.data.ruleId);
    }
  },

  /**
   * Maps an event name to a proper state
   * @param  {String} name name of event
   * @return {String}      mapped state name
   */
  mapEventName: function (name) {
    var map = {
      clicked : 'click',
      changed : 'change',
      blurred : 'focusout',
      'validated' : 'submit'
    };
    var n = (map[name]) ? map[name] : name;
    // * Tricky... Some of the CSS states are still in flux and so we have to kind of shim them
    // to their browser specific version.  It would probably behoove us to develop a better pattern
    // than just a simple map and this function.
    if (name == 'transitioned') {
      if ($.browser.webkit) {
        n = 'webkitTransitionEnd';
      } else if ($.browser.opera) {
        n = 'oTransitionEnd';
      } else if ($.browser.mozilla) {
        n = 'transitionend';
      } else {
        n = 'transitionend';
      }
    }
    return n;
  },

  /**
   * Helper function to setup pre and post events for designated state
   * @param  {String}   state name of the state to wrap
   * @param  {Function} fn    handler for event
   * @param  {Object}   jQObj     jQuery object involved in events
   */
  wrapAspects: function (state, jQObj, fn) {
    jQObj.queue('pseudo', [ function () {
      jQObj.trigger('pre-' + state).dequeue('pseudo');
    }, function () {
      fn();
      jQObj.dequeue('pseudo');
    }, function () {
      jQObj.trigger('post-' + state).dequeue('pseudo');
    } ]);
    jQObj.dequeue('pseudo');
  },

  /**
   * Flattens module property values.
   * @param  {[type]} def [description]
   * @return {[type]}     [description]
   */
  multiplicityToArray: function (def){
    var unique = function (def) {
      var ret = {};
      var prop = null;
      var id = null;
      for (prop in def) {
        var o = def[prop];
        for (id in o) {
          ret[id] = true;
        }
      }
      return ret;
    };
    var ret = [];
    var cur;
    var list = unique(def);
    var item = null;
    for (item in list) {
      cur = {};
      for (var prop in def) {
        if (!def[prop][item]) {
          return ret;
        }
        cur[prop] = def[prop][item];
      }
      ret.push(cur);
    }
    return ret;
  },

  /**
   * Creates an object that tracks the setting of property values and
   * then once all set - apply them with the modules applier
   * @param  {Object} instance  object to hold values
   * @param  {Bess.Module} module    module to interact with
   * @param  {Object} jQueryObj the jQuery object to target with module applier
   * @param  {Function} setVal function to set the value and manage the semaphor/callback
   */
  watcher: function(instance, module, jQueryObj, setVal){
    return {
      count: 0,
      setVal: setVal || function(property, value){
        instance[property] = value;
        this.count--;
        if(this.count === 0){
          module.apply(instance, jQueryObj);
        }
      }
    };
  },

  /**
   * Sets a unique ID attribute on a jQuery object and returns
   * a selector for it.
   * @param  {Object} jQueryObj jQuery object to set
   * @param  {String} selector  selector string to return with new ID
   */
  uniqueId: function(jQueryObj, selector){
    if (!jQueryObj.attr('id')) {
      jQueryObj.attr('id', "bess_" + $.now());
    }
    return selector.replace(":self", "#" + jQueryObj.attr('id'));
  }
};