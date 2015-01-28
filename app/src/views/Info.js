/*globals define*/
define(function (require, exports, module) {
  var View = require('famous/core/View');
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var ScrollView = require('famous/views/ScrollView');
  var ScrollContainer = require('famous/views/ScrollContainer');
  var TextAreaSurface = require('famous/surfaces/TextAreaSurface');

  /*
   * @name Info
   * @constructor
   * @description
   */

  function Info() {
    View.apply(this, arguments);

    var rootMod = new StateModifier({
      align : [0.5, 0.5],
      origin : [0.5, 0.5]
    });

    rootMod._modifier.sizeFrom(function () {
        var _width = window.innerWidth;
        var _height = window.innerHeight * 0.75;

        _width = _width < 320 ? 320 : _width;
        _width = _width > 600 ? 600 : _width;

        return [_width, _height];
    });

    this.mainNode = this.add(rootMod);

    _createSurface.call(this);
  }

  Info.prototype = Object.create(View.prototype);
  Info.prototype.constructor = Info;

  Info.DEFAULT_OPTIONS = {
    html: ''
  };

  var _createSurface = function () {
    this.scrollView = new ScrollContainer({
      container : {
        classes : ['info-scroller']
      }
    });

    var _surface = new Surface({
      content : this.options.html,
      classes : ['info'],
      size : [undefined, true]
    });    

    this.scrollView.sequenceFrom([_surface]);

    _surface.pipe(this.scrollView);

    this.mainNode.add(this.scrollView);
  };

  module.exports = Info;
});
