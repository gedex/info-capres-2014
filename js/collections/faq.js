define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var FAQCollection = Backbone.Collection.extend({
		url: function() {
			return util.urlAddParam(
				app.api.endpoints.faq,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.data.results.questions)) {
				return resp.data.results.questions;
			}

			return this.models;
		}
	});

	module.exports = FAQCollection;
});
