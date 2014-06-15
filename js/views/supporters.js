define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var supportersTemplate = require("text!templates/supporters.html");

	var SupportersView = Backbone.View.extend({
		tpl: _.template(supportersTemplate),

		initialize: function(options) {
			this.supporters = options.supporters;
		},

		render: function() {

			this.$el.html(this.tpl({
				candidate: this.model.toJSON(),
				supporters: this.supporters,
				supporters_num: _.size(this.supporters)
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

	module.exports = SupportersView;

});
