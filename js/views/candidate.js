define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var candidateTemplate = require("text!templates/candidate.html");

	var CandidateView = Backbone.View.extend({
		tpl: _.template(candidateTemplate),

		initialize: function(options) {
			this.mate = options.mate;
		},

		render: function() {
			this.$el.html(this.tpl({
				candidate: this.model.toJSON(),
				mate: this.mate.toJSON()
			}));
			return this;
		},

	});

	module.exports = CandidateView;

});
