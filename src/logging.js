define([],function(){
    var logger = window.console, nada = function(){};
    if(!logger){
        logger = { trace: nada, debug: nada, info: nada, warn: nada, error: nada, fatal: nada };
    }
    if(!logger.debug){ logger.debug = logger.log; /* Stupid IE7! */ }
    return logger;
});
