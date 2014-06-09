define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var candidatesTemplate = require("text!templates/candidates.html");

	var CandidatesView = Backbone.View.extend({
		tpl: _.template(candidatesTemplate),

		render: function() {
			this.$el.html(this.tpl({pairs: this._pairCandidates()}));
			return this;
		},

		_pairCandidates: function() {
			// Each object in pairs is another object with two keys: "capres" and "cawapres".
			// The top keys will be caleg id.
			var pairs = {};

			_.each(this.collection.models, function(model) {
				var id = model.get("id");
				var id_mate = model.get("id_running_mate");
				var role = model.get("role");

				if (role === "capres" && _.isUndefined(pairs[id])) pairs[id] = {};
				if (role === "cawapres" && _.isUndefined(pairs[id_mate])) pairs[id_mate] = {};

				if (role === "capres") {
					pairs[id]["capres"] = model.toJSON();
				} else if (role === "cawapres") {
					pairs[id_mate]["cawapres"] = model.toJSON();
				}
			});

			return pairs;
		}
	});

	module.exports = CandidatesView;

});
