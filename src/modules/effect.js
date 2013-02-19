Bess.Modules.register('effect', {

  properties: ['name','target','duration','easing','relative'],

  defaults: {
    target: Bess.Utility.Resolvers.find(),
    duration: Bess.Utility.Resolvers.string('slow'),
    easing: Bess.Utility.Resolvers.string('swing'),
    relative:Bess.Utility.Resolvers.find()
  },

  apply: function(dat,el){
    var n,
      open=dat.target.length,
      names = dat.name.split(','),
      proc = function(o,e,d,n){
        return function(){
          if(o && --o === 0){
            d.target.trigger('post-' + n);
          }
        };
      };
    if(open===0){ el.dequeue('pseudo'); }
    el.queue('pseudo').unshift($.noop); /* wait... */
    for(var i = 0; i<names.length; i++){
      n = $.trim(names[i]);
      dat.target[n](dat.duration,dat.easing,proc(open,el,dat,n), dat.relative);
    }
  }
});