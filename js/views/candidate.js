define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var candidateTemplate = require("text!templates/candidate.html");

	var CandidateView = Backbone.View.extend({
		tpl: _.template(candidateTemplate),

		initialize: function(options) {
			this.auth = options.auth;
			this.mate = options.mate;
		},

		render: function() {

			this.$el.html(this.tpl({
				candidate: this.model.toJSON(),
				mate: this.mate.toJSON()
			}));

			// Instantiate tooptip.
			//
			// @todo: Refactor common view into BaseView where during render it will
			// trigger 'view:render' event and tooltip can be moved out from each
			// view.
			this.$el.find('[data-toggle="tooltip"]').tooltip();

			return this;
		}
	});

	module.exports = CandidateView;

});
