/*global $:true*/

/**
 * Bess Property resolver
 * @type {Object}
 */
Bess.Resolver = {

  resolveModule: function(module, jQueryObj, eventMessage, errorHandler){
    var instance = {}, property;

    var watcher = Bess.Utility.watcher(instance, module, jQueryObj);

    for(property in module){
      if(module[property].resolver){
        if(module[property].arg === 'none'){
          delete module[property];
        }else{
          watcher.count++;
        }
      }
    }

    try{
      for(property in module){
        if(module[property].resolver){
          this.resolveProperty(property, module[property], jQueryObj, watcher, eventMessage, errorHandler);
        }
      }
    }catch(e){
      errorHandler(instance, e);
    }
  },

  resolveProperty: function(property, definition, jQueryObj, watcher, eventMessage, errorHandler){
    var rules = [definition],
      currentArg = definition.arg;

    var buildStack = function(definition, rules){
      if(definition.arg.resolver){
        rules.push(definition.arg);
        buildStack(definition.arg, rules);
      }
    };

    if(!$.isArray(definition.arg)){
      buildStack(definition, rules);
    }

    var setAndReturnSelector = function(value, defalt){
      var selector = value.replace(/th\(index\)/g,'th('+ jQueryObj.index() +')');
      return (typeof value === 'string' && Bess.Utility.uniqueId(jQueryObj, selector)) || defalt;
    };

    var setVal = function(count, data, callback){
      return function(p,v){
        count--;
        data[this.i] = setAndReturnSelector(v,v);
        if(count === 0){
          callback(data);
        }
      };
    };

    /* returns an array */
    var all = function(args, callback){
      var definition,
        data = [],
        i = 0,
        watcher;
      while(args.length > 0){
        definition = args.shift();
        watcher = {
          i: i++,
          setVal: setVal(args.length, data, callback)
        };
        this.resolveProperty(property, definition, jQueryObj, watcher, eventMessage);
      }
    };

    var next = function(array){
      if(!array || !array.pop){ return; }
      var definition = array.pop();
      if($.isArray(definition.arg)){
        all(definition.arg.slice(0),function(args){
          if(type_resolvers[definition.resolver]){
            try{
              type_resolvers[definition.resolver](jQueryObj, args, watcher, property, eventMessage);
            }catch(e){
              errorHandler(definition.resolver, e);
            }
          }else{
            Logger.error("unknown type resolver: '" + definition.resolver + "'");
          }
        });
      }else{
        currentArg = setAndReturnSelector(definition.arg,currentArg);
        w = (array.length === 0) ? watch : {
          setVal: function(p,v){
            currentArg = setAndReturnSelector(v,v);
            next();
        }};
        if(type_resolvers[definition.resolver]){
          try{
            type_resolvers[definition.resolver](jQueryObj,[currentArg],w,prop,msg);
          }catch(e){
            errorHandler(definition.resolver, e);
          }
        }else{
          Logger.error("unknown type resolver: '" + definition.resolver + "' should it be in an array?");
        }
      }
    };
    next(rules);
  }

};
