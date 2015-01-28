/*globals define*/
define(function (require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Fader = require('famous/modifiers/Fader');

  /*
   * @name Back
   * @constructor
   * @description
   */

  var tween = {
    duration : 250,
    curve : 'easeOutBounce'
  };

  function Back() {
    View.apply(this, arguments);

    _createBackSurface.call(this);
  }

  var _createBackSurface = function () {
    var rotateXTransform = Math.PI * 0.5;
    var rotateZTransform = Math.PI * 0.5;

    console.log(this.options);

    var surfaceModifier = new StateModifier({
      align : this.options.align,
      size : [50, 50],
      origin : [0.5, 0.5],
      transform : Transform.rotate(rotateXTransform, 0, rotateZTransform)
    });

    var backSurface = new Surface({
      content : this.options.content,
      classes : ['back-button'],
      properties : {
        backgroundColor : 'cornflowerblue'
      }
    });

    backSurface.on('click', function () {
      this._eventOutput.emit('goback',{step:this.options.step});
      surfaceModifier.setTransform(Transform.rotate(rotateXTransform, 0, rotateZTransform), tween);
    }.bind(this));


    this._eventInput.on('showCard', function () {
      surfaceModifier.setTransform(Transform.rotate(0, 0, 0), tween);
    }.bind(this));

    this.add(surfaceModifier).add(backSurface);
  };

  Back.prototype = Object.create(View.prototype);
  Back.prototype.constructor = Back;

  Back.DEFAULT_OPTIONS = {
    align : [0.5, 0.5],
    step : 0
  };

  module.exports = Back;
});
