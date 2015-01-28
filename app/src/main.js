/* globals define */
define(function(require, exports, module) {
  'use strict';
  // import dependencies
  var Engine = require('famous/core/Engine');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Surface = require('famous/core/Surface');
  var View = require('famous/core/View');
  var TransitionableTransform = require("famous/transitions/TransitionableTransform");
  var EventHandler = require('famous/core/EventHandler');

  var Lightbox = require('famous/views/Lightbox');

  var Levels = require('collections/Level');
  var levels = new Levels();

  var Card = require('views/Card');
  var Back = require('views/Back');
  var Info = require('views/Info');

  require('famous/inputs/FastClick');

  // create the main context
  var mainContext = Engine.createContext();

  // your app here
  mainContext.setPerspective(2000);
  var tween = {
    duration : 250,
    curve : 'easeOut'
  };
  var rootView = new View();
  var rootEventPubSub = new EventHandler();
  var lightbox = new Lightbox({
    inOpacity : 1,
    outOpacity : 1,
    inTransform : Transform.translate(0, window.innerHeight * 1.5, 0),
    outTransform : Transform.translate(0, window.innerWidth * 1.5, 0),
    inTransition : tween,
    outTransition : tween
  });
  var fullStackSurfaces = [],
    infoViews = [];


  var initialTime = Date.now();
  var rootTransform = new TransitionableTransform();
  var rootMod = new Modifier({
    align: [0.5, 0.5],
    origin: [0.5, 0.5],
    size: [undefined, undefined]
      //transform: function() {
      //  return Transform.rotateY(.002 * (Date.now() - initialTime));
      //}
  });

  var back = new Back({
    content: 'BACK',
    align: [0.1, 0.5],
    step: 1
  });

  var next = new Back({
    content: 'NEXT',
    align: [0.9, 0.5],
    step: -1
  });

  rootEventPubSub.on('showCard', function (options) {
   lightbox.show(infoViews[options.index]);
  });

  rootEventPubSub.on('goback', function () {
   lightbox.hide();
  });

  //Event IO from back button
  rootEventPubSub.subscribe(back);
  rootEventPubSub.pipe(back);
  rootEventPubSub.subscribe(next);
  rootEventPubSub.pipe(next);

  // rootView.add(back);
  // rootView.add(next);
  rootView.add(lightbox);

  var gotLevels = function() {
    levels.each(function(record, i) {

      var card = new Card({
        index: i,
        content: record.get('label'),
        size: [200, 200],
        translateXyz: [0, -50 * i, 0]
      });

      var info = new Info({
        index: i,
        html: record.get('description').replace(/\n/gi,'<br>')
      });

      infoViews.push(info);
      fullStackSurfaces.push(card);

      //Event IO from card
      rootEventPubSub.subscribe(card);
      rootEventPubSub.pipe(card);

      rootView.add(card);

    });
  };

  var gotLevelsFail = function (err) {
    console.log(err);
  };

  mainContext.add(rootMod).add(rootView);
  levels.fetch({success:gotLevels, error:gotLevelsFail});
  
});