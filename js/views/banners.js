define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var bannersTemplate = require("text!templates/banners.html");

	var BannersView = Backbone.View.extend({
		tpl: _.template(bannersTemplate),

		render: function() {
			this.$el.html(this.tpl({banners: this.collection.toJSON()}));
			return this;
		},

	});

	module.exports = BannersView;

});
