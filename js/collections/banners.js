define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var BannersCollection = Backbone.Collection.extend({
		url: function() {
			return util.urlAddParam(
				app.api.endpoints.banners,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.data.results.stamps)) {
				return resp.data.results.stamps;
			}

			return this.models;
		}
	});

	module.exports = BannersCollection;
});
