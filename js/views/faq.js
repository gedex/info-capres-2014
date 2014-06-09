define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var faqTemplate = require("text!templates/faq.html");

	var FAQView = Backbone.View.extend({
		tpl: _.template(faqTemplate),

		render: function() {
			this.$el.html(this.tpl({faq: this.collection.toJSON()}));
			return this;
		},

	});

	module.exports = FAQView;

});
