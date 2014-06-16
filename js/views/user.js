define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var util = require("util");

	var userTemplate = require("text!templates/user.html");

	var UserView = Backbone.View.extend({
		tpl: _.template(userTemplate),

		initialize: function(options) {
			this.user = options.user || null;
			this.auth = options.auth || null;
		},

		render: function() {
			this.$el.html(this.tpl({
				user: this.user,
				ucfirst: util.ucfirst
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

	module.exports = UserView;

});
