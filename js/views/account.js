define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var util = require("util");

	var accountTemplate = require("text!templates/account.html");

	var AccountView = Backbone.View.extend({
		tpl: _.template(accountTemplate),

		events: {
			"click #update-profile": "updateProfile"
		},

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
		},

		updateProfile: function(e) {
			e.stopPropagation();
			e.preventDefault();

			var data = {
				name:   $("[name=displayName]").val(),
				gender: $("[name=gender]").val(),
				about:  $("[name=about]").val()
			};

			var userRef = this.auth.users.child(this.user.id);
			var onComplete = function(error) {
				if (error) console.log(error);
				alert("Updated");
			};

			userRef.update(data, onComplete);
		}
	});

	module.exports = AccountView;

});
