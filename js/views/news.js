define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var newsTemplate = require("text!templates/news.html");

	var NewsView = Backbone.View.extend({
		tpl: _.template(newsTemplate),

		render: function() {
			this.$el.html(this.tpl({news: this.collection.toJSON()}));
			return this;
		},

	});

	module.exports = NewsView;

});
