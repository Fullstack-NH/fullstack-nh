define(function (require, exports, module) {
	'use strict';

	var Backbone = require('backbone');
	var LevelModel = require('models/Level');

	var Level = Backbone.Collection.extend({
		model : LevelModel,
		url : '/content/stack.json'
	});

	module.exports = Level;
});