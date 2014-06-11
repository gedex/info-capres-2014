define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var eventsTemplate = require("text!templates/events.html");

	var EventsView = Backbone.View.extend({
		tpl: _.template(eventsTemplate),

		initialize: function(options) {
			this.candidate = options.candidate || null;
			this.tag = options.tag || null;
		},

		render: function() {
			this.$el.html(this.tpl({
				events: this.collection.toJSON(),
				tag: this.tag,
				candidate: this.candidate
			}));
			return this;
		},

	});

	module.exports = EventsView;

});
