/*global $:true*/

/**
 * Behavior Stylesheet
 *
 * @type {Object}
 */
var Bess = {

  /**
   * Current version of Bess
   * @type {String}
   */
  version: '2.0.alpha1',

  /**
   * Key for the attribute used on HTML Elements that are loaded
   * but not yet parsed by Bess.
   * @type {String}
   */
  loadedAttr: 'data-bess-loaded',

  /**
   * Key for the attribute used on HTML Elements that are loaded
   * and parsed by Bess.
   * @type {String}
   */
  parsedAttr: 'data-bess-parsed',

  /**
   * Type used by HTML Elements to declare themselves as Bess rules
   * sources.
   * @type {String}
   */
  type: 'text/bess',

  /**
   * This is the main collection of rules parsed and loaded for Bess.
   * @type {Array}
   */
  rules: [],

  /**
   * Collection of document level handlers for Bess behaviors.
   * @type {Array}
   */
  handlers: [],

  /**
   * Main initialization of the Bess engine. Inspects for Bess type link/style
   * and then parses for Bess rules.
   */
  init: function(){
    var linkSelector = 'link[type="' + Bess.type + '"]',
      styleSelector = 'style[type="' + Bess.type + '"]',
      linkTags,
      styleTags,
      parse = Bess.Parser.parse;

    // query the DOM for links and styles to inspect for Bess types.
    linkTags = $(linkSelector);
    styleTags = $(styleSelector);

    // short-circuit if no bess
    if(!linkTags.length && !styleTags.length){
      return;
    }

    // Borrowed code to detect whether a medium applies in the same manner you would CSS
    // See: http://www.w3.org/TR/cssom-view/#the-media-interface
    var mediumApplies = (window.media && window.media.query) || function(str) {
      if (!str) return true; // if no descriptor, everything applies
      if (str in media) return media[str];
      var style = $('<style media="' + str + '">body {position: relative; z-index: 1;}</style>').appendTo('head');
      // * the [x,y][0] is a silly hack to evaluate two expressions and return the first
      return media[str] = [$('body').css('z-index') == 1, style.remove()][0];
    };

    // iterate through links and download each for parsing
    if(linkTags.length){
      linkTags.each(function(){
        var link = $(this),
          enabled = !this.disabled,
          nonHTTP = !(/^\w+:/.test(link.attr('href'))),
          goodMedium = mediumApplies(this.media),
          notBessLoaded = !link.attr(Bess.loadedAttr);
        if(enabled && nonHTTP && goodMedium && notBessLoaded){
          $.get(this.href, function(source){
            // send the actual link and not the jQuery object
            parse.call(Bess.Parser, source, link.context);
            link.attr(Bess.loadedAttr,'true');
          }, 'text');
        }
      });
    }

    // iterate through styles and parse each
    if(styleTags.length){
      styleTags.each(function(){
        var style = $(this),
          enabled = !this.disabled,
          notBessLoaded = !style.attr(Bess.loadedAttr);
        if(enabled && notBessLoaded){
          parse.call(Bess.Parser, this.innerHTML, this);
          style.attr(Bess.loadedAttr,'true');
        }
      });
    }
  }

};

/**
 * The pattern for initializing Bess is to determine document readiness
 * and initialize afterwards. This is important to assure resources
 * and DOM are ready for our manipulation to the link/style etc.
 */
if(!$.isReady){
  $(document).ready(Bess.init);
}else{
  Bess.init();
}
