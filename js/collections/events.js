define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var EventsCollection = Backbone.Collection.extend({
		byCandidate: function(id) {
			this.reset(
				this.filter(function(evt) {
					return _.contains(evt.get("id_calon"), id);
				})
			);
		},

		byTag: function(tag) {
			this.reset(
				this.filter(function(evt) {
					return _.contains(evt.get("tags"), tag);
				})
			);
		},

		url: function() {
			return util.urlAddParam(
				app.api.endpoints.events,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.data.results.events)) {
				return resp.data.results.events;
			}

			return this.models;
		}
	});

	module.exports = EventsCollection;
});
