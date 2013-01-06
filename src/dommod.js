define(
	[
		'src/extendedjquery',
		'lib/pagebus',
		'src/logging'
	],
	function($, pagebus, Logger){
	// The key piece in charge of DOM subtree modification - a single
    // point of entry - it handles the act itself, as well triggering of 
    // related modification events.  The behavior engine provides it to 
    // modules so that they can modify the tree...
    mod = function(op, markup, target, callback){
        var removing, unreg, unregs, x;

		// * All of these are destructive operations with one set of consequences..
        if(op=='replaceContent' || op==='remove' || op==='empty'){

            // * * This is going to be hard because we are going to
            // maybe have either do before remove and only when the
            // handlers are done actually remove - or deal with the
            // fact that the things we're triggering are already removed...
            // Similar discussion going on around that API in W3C...
            /*  $('*',target).detach().trigger('removed');  */
            removing = $('*',target);

            // * * We need to remove any bess rules associated with those...
            unregs = removing.filter('[bess_parsed="true"]');
            for(i=0;i<unregs.length;i++){
                unreg = unregs[i];
                for(x=bessRules.length-1;x>=0;x--){
                    if(bessRules[x].selector.boundFrom===unreg){
                        bessRules.splice(x,1);
                    }
                }
            }
            if(op==='replaceContent'){

                // * * Clear out the old stuff, then carry on as an append...
                target.empty();
                op='append';

            }else if(op==='remove' || op==='empty'){

                // * * Just do it
                target[op]();

                // * * Trigger modified on the target itself and then bail, we're done...
                Logger.debug('Triggering html-modified...');
                target.trigger('html-modified');
                return;

            }
        }

        // * Perform any additive operations and then call scan to add new rules if there are any
        // * Note: the craziness here is to account for some web shims that allow our templates
        // * to contain HTML5 stuff... IE in it's great wisdom decided that they know better...
		if($.browser.msie){
            id = $.now();
			d = document.createElement('div');
			d.id="temp" + id;
			d.style.display='none';
			document.body.appendChild(d);

			d = document.getElementById('temp' + id);
			d.innerHTML = markup;
			target[op]($(d.childNodes));
			document.body.removeChild(d);
        }else{
			target[op](markup);
        }

		// Fire a message to the Behavior Engine to scan with new target
		pagebus.publish('document.scan', {context: target, isLocal: true});
		// Fire a message to the Behavior Engine to trigger inserted on 
		// target's childrend
		pagebus.publish('document.inserted.children', { context: target });
    };

	return mod;

});