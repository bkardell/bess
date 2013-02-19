/**
 * Collection of Modules within this Bess instance.
 *
 * @type {Object}
 */
Bess.Modules = {

  cache: [],

  find: function(name){
    return this.cache[name];
  },

  /**
   * Adds a Module to the Bess engine for use in parsing and
   * execution of rules
   * @param  {String} name   name of the module
   * @param  {Function} module information to execute during runtime
   */
  register: function(name, module){
    this.cache[name] = module;
  }

};