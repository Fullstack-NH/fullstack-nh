define(function (require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Transform = require('famous/core/Transform');
  var TransitionableTransform  = require("famous/transitions/TransitionableTransform");
  var Modifier  = require("famous/core/Modifier");
  var StateModifier = require('famous/modifiers/StateModifier');

  var Fader = require('famous/modifiers/Fader');

  var Easing = require('famous/transitions/Easing');
  var TweenTransition = require('famous/transitions/TweenTransition');
  var Transitionable = require('famous/transitions/Transitionable');
  
  var SpringTransition = require('famous/transitions/SpringTransition');
  var WallTransition = require('famous/transitions/WallTransition');
  var SnapTransition = require('famous/transitions/SnapTransition');

  Transitionable.registerMethod('spring', SpringTransition);
  Transitionable.registerMethod('wall', WallTransition);
  Transitionable.registerMethod('snap', SnapTransition);

  // TweenTransition.registerCurve('inElastic', Easing.inElastic);
  // TweenTransition.registerCurve('inOutElastic', Easing.inOutElastic);
  // TweenTransition.registerCurve('inOutBounce', Easing.inOutBounce);
  // TweenTransition.registerCurve('inOutCubic', Easing.inOutCubic);
  TweenTransition.registerCurve('inOutCirc', Easing.inOutCirc);

  var curve = {
    duration : 250,
    curve : 'easeIn'
  };

  var spring = {
    duration : 500,
    curve : 'inOutCirc'
  };

  var scale = function (num, ratio) {
    return num + (num*ratio);
  };

  // var spring = {
  //   method: 'spring',
  //   period: 500,
  //   dampingRatio: 0.45
  // };

  /*
   * @name Card
   * @constructor
   * @description
   */

  function Card() {
    View.apply(this, arguments);


    this.align = new Transitionable([0.5,0.5]);
    this.mainTransform = new TransitionableTransform();
    this.topTransform = new TransitionableTransform();
    this.rightSideTransform = new TransitionableTransform();
    this.leftSideTransform = new TransitionableTransform();

    var mainMod = new Modifier({
      origin : [0.5, 0.5],
      align : this.align,
      transform : this.mainTransform
    });

    this.mainNode = this.add(mainMod);

    this._eventInput.on('showCard', function (options) {
      if(options.index !== this.options.index) {
        this.hide();
      }
    }.bind(this));

    this._eventInput.on('click', function () {
      this.focus();
    }.bind(this));

    this._eventInput.on('goback', function () {
      this.putBack();
    }.bind(this));

    _createCard.call(this);
    _createLeftPanel.call(this);
    _createRightPanel.call(this);

    this.putBack(spring);
  }

  Card.prototype = Object.create(View.prototype);
  Card.prototype.constructor = Card;

  Card.DEFAULT_OPTIONS = {
    index : 0,
    size : [200,200],
    content : '',
    properties : {},
    translateXyz : [0,0,0]
  };

  var _createCard = function () {

    var topMod = new Modifier({
      size : _.map(this.options.size, function (size) { return scale(size, 0.3); }),
      origin : [0.5, 0.5],
      transform : this.topTransform
    });

    var card = new ImageSurface({
      classes : ['card','back-face'],
      content : '/content/images/fullstacknh.png'
    });

    this.subscribe(card);

    this.mainNode.add(topMod).add(card);
  };

  var _createLeftPanel = function () {
    this.leftSideMod = new Modifier({
      transform : this.leftSideTransform,
      size : [scale(40,0.3), scale(200,0.3)],
      origin : [1,1]
    });

    this.leftSide = new Surface({
      classes : ['card-side-left','back-face']
    });

    this.leftSideTransform.setRotate([0,Math.PI * -0.50,0]);
    this.leftSideTransform.setTranslate([scale(-100,0.3), scale(100, 0.3), 0]);

    //this.subscribe(leftSide);

    this.leftSide.on('click',function(){
      this._eventOutput.emit('goback');
    }.bind(this));

    this.mainNode.add(this.leftSideMod).add(this.leftSide);
  };

  var _createRightPanel = function () {

    //RIGHT SIDE

    var rightSideMod = new Modifier({
      transform : this.rightSideTransform,
      size : [scale(200,0.3), scale(40,0.3)],
      origin : [0,0]
    });

    var rightSide = new Surface({
      classes : ['card-side-right', 'back-face'],
      content : this.options.content
    });

    this.rightSideTransform.setRotate([Math.PI * -0.50,0,0]);
    this.rightSideTransform.setTranslate([scale(-100,0.3), scale(100, 0.3), 0]);

    this.subscribe(rightSide);

    this.mainNode.add(rightSideMod).add(rightSide);
  };

  Card.prototype.hide = function (curve) {
    curve = curve || false;

    var translateXYZ = this.options.translateXyz.slice();
    translateXYZ[0] = window.innerWidth * (this.options.index % 2 === 0 ? 1 : -1);
    this.mainTransform.setTranslate(translateXYZ, spring);
  };

  Card.prototype.focus = function (curve) {
    curve = curve || false;

    var translateXYZ = [this.options.translateXyz[0], -25, this.options.translateXyz[2]];

    this.align.set([0.5,0.1], spring);
    this.mainTransform.setRotate([Math.PI * 0.5, 0, 0], spring);
    this.mainTransform.setTranslate(translateXYZ, spring);
    this.mainTransform.setScale([1,1,1], spring);
    this._eventOutput.emit('showCard',{
      index: this.options.index,
      translateXYZ : translateXYZ
    });

    this.leftSideTransform
      .setRotate([Math.PI * -0.50,0,Math.PI * -0.50],spring);

    //this.leftSideMod.setSize([scale(40,0.3), scale(40,0.3)],spring);

    this.leftSide.addClass('focus');

  };

  Card.prototype.putBack = function (curve) {
    curve = curve || false;

    this.align.set([0.5,0.5], spring);
    this.mainTransform.setRotate([Math.PI * 0.33, 0, Math.PI * -0.25], spring);
    this.mainTransform.setTranslate(this.options.translateXyz, spring);
    this.mainTransform.setScale([0.7,0.7,0.7], spring);

    this.leftSideTransform
      .setRotate([0,Math.PI * -0.50,0],spring);

    //this.leftSideMod.setSize([scale(40,0.3), scale(200,0.3)],spring);

    this.leftSide.removeClass('focus'); 
  };

  module.exports = Card;
});
