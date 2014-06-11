define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var videosTemplate = require("text!templates/videos.html");

	var VideosView = Backbone.View.extend({
		tpl: _.template(videosTemplate),

		initialize: function(options) {
			this.candidate = options.candidate || null;
			this.tag = options.tag || null;
		},

		render: function() {
			this.$el.html(this.tpl({
				videos: this.collection.toJSON(),
				tag: this.tag,
				candidate: this.candidate
			}));
			return this;
		},

	});

	module.exports = VideosView;

});
