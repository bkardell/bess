Bess.Modules.register('class', {

  properties: ['op','name','target'],

  defaults: {
    op: 'toggle',
    target: Bess.Utility.Resolvers.find()
  },

  apply: function(dat,el){
    dat.name = ($.isArray(dat.name)) ? dat.name.join(' ') : dat.name;
    if(dat.name){
      dat.target[dat.op + "Class"](dat.name);
    }
  }
});