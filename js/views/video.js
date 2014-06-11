define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var videoTemplate = require("text!templates/video.html");

	var VideoView = Backbone.View.extend({
		tpl: _.template(videoTemplate),

		render: function() {
			this.$el.html(this.tpl({
				video: this.model.toJSON()
			}));
			return this;
		},

	});

	module.exports = VideoView;

});
