define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var NewsCollection = Backbone.Collection.extend({
		url: function() {
			return util.urlAddParam(
				app.api.endpoints.news,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.posts)) {
				return resp.posts;
			}

			return this.models;
		}
	});

	module.exports = NewsCollection;
});
