define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var PromisesCollection = Backbone.Collection.extend({
		byCandidate: function(id) {
			this.reset(
				this.filter(function(promise) {
					return id == promise.get("id_calon");
				})
			);
		},

		byTag: function(tag) {
			this.reset(
				this.filter(function(promise) {
					return _.contains(promise.get("tags"), tag);
				})
			);
		},

		url: function() {
			return util.urlAddParam(
				app.api.endpoints.promises,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.data.results.promises)) {
				return resp.data.results.promises;
			}

			return this.models;
		}
	});

	module.exports = PromisesCollection;
});
