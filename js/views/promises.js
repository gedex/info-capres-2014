define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var promisesTemplate = require("text!templates/promises.html");

	var PromisesView = Backbone.View.extend({
		tpl: _.template(promisesTemplate),

		initialize: function(options) {
			this.candidate = options.candidate || null;
			this.tag = options.tag || null;
		},

		render: function() {
			this.$el.html(this.tpl({
				promises: this.collection.toJSON(),
				tag: this.tag,
				candidate: this.candidate
			}));
			return this;
		},

	});

	module.exports = PromisesView;

});
