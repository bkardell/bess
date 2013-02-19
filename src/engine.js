/*global $:true*/

/**
 * Bess Engine
 *
 * @type {Object}
 */
Bess.Engine = {

  /**
   * This is the main entry point for the Engine. It will inspect
   * the Bess.rules and attach proper behaviors according to their
   * declarations.
   */
  process: function(){
    if(Bess.rules.length === 0){
      return; // no rules - no joy!
    }
    var sortedRules = Bess.Utility.Specificity.sort(Bess.rules),
      attach = this.attach;
    $.each(sortedRules, function(index, rule){
      attach(rule);
      // TODO: Manage the problem of rules showing up for html-inserted DOM
    });
  },

  /**
   * Manages the binding of the behavior to the DOM elements matched
   * by the rule.
   * @param  {Object} rule rule information
   */
  attach: function(rule){
    var pseudo = rule.selector.pseudo,
      selector = rule.selector,
      state = Bess.Utility.mapEventName(pseudo);

    $(rule.selector.select).live(state, rule, Bess.Utility.globalHandler);

    if(!Bess.handlers[state]){
      $(document).bind(state, function(e) {
        var merged = {},
          actionable,
          currentTarget = $(e.currentTarget);

        if (e.actionable) {

          if (e.type === 'html-inserted') {
            if (e.target.bess_dom_inserted) {
              return false;
            } else {
              e.target.bess_dom_inserted = true;
            }
          }

          if (e.type === 'html-modified' && (e.currentTarget !== e.target)) {
            return;
          } else if(e.type.indexOf('post-') !== -1) {
            e.currentTarget = e.target; /* TODO: added bk during open-bess ... this plan needs work */
          } else if(e.type === 'html-inserted' && (e.currentTarget !== e.target)) {
            e.currentTarget = e.target;
            // edge case for IE where IE has FORM in current instead of target in a submit event type
          } else if (e.type === 'submit' && e.target.tagName && e.target.tagName === 'BUTTON') {
            e.target = e.currentTarget;
          }

          for (var i = 0; i < e.actionable.length; i++) {
            actionable = e.actionable[i];
            // * * * * * Collect it if isn't a repeat (because nested matches will cause a problem with property resolution)
            merged[actionable.module] = merged[actionable.module] || {};
            // * * * * * Collect it if it matches the selector / pseudo
            if (actionable.selector.pseudo == pseudo &&
              ($(e.target).is(actionable.selector.select) || $(e.currentTarget).is(actionable.selector.select))) {
              $.extend(merged[actionable.module], actionable.declaration);
            }
          }

          var errorHandler = function (a, b) {
            if (a.topic) {
              currentTarget.trigger('error');
            } else if (a.target) {
              a.target.trigger('error');
            }
          };

          var handler = function(){
            for(var modName in merged) {
              var module = Bess.Modules.find(modName);
              if(module){
                var properties = Bess.Utility.multiplicityToArray(merged[modName]);
                for (var p = 0; p < properties.length; p++) {
                  var moduleDefinition = $.extend({}, module.defaults, properties[p]);
                  moduleDefinition.apply = module.apply;
                  Bess.Resolver.resolveModule(moduleDefinition, currentTarget, e.message, errorHandler);
                }
              }
            }
          };

          Bess.Utility.wrapAspects(pseudo, currentTarget, handler);

        }
      });
      Bess.handlers[state] = true;
    }
  }
};