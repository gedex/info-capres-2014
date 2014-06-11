define(function(require, exports, module){
	"use strict";

	var $ = require("jquery");

	var CandidatesCollection = require("collections/candidates");
	var NewsCollection = require("collections/news");
	var FAQCollection = require("collections/faq");
	var BannersCollection = require("collections/banners");

	var CandidatesView = require("views/candidates");
	var CandidateView = require("views/candidate");
	var NewsView = require("views/news");
	var FAQView = require("views/faq");
	var BannersView = require("views/banners");

	var homeTemplate = require("text!templates/home.html");

	var Router = Backbone.Router.extend({
		routes: {
			"candidates":    "candidates",
			"candidate/:id": "candidate",
			"faq":           "faq",
			"news":          "news",
			"banners":       "banners",
			"*path":         "home"
		},

		currentView: null,

		initialize: function() {
			this.$main = $("#main");
			this.$mainParent = this.$main.parent();

			this.candidates = new CandidatesCollection();
			this.news = new NewsCollection();
			this.faq = new FAQCollection();
			this.banners = new BannersCollection();
		},

		home: function() {
			this.reset();

			this.$mainParent.attr("class", "content-head");
			this.$main.html(homeTemplate);
		},

		candidates: function() {
			this.reset();
			this.candidates.fetch();

			this.currentView = new CandidatesView({
				collection: this.candidates
			});
			var main = this.$main;

			this.candidates.once("sync", function(){
				main.html(this.currentView.render().el);
			}, this);
		},

		candidate: function(id) {
			this.reset();
			this.candidates.fetch();

			var main = this.$main;

			this.candidates.once("sync", function() {
				var model = this.candidates.get(id);
				var mate = this.candidates.get(model.get("id_running_mate"));

				this.currentView = new CandidateView({
					model: model,
					mate: mate
				});
				main.html(this.currentView.render().el);
			}, this);
		},

		faq: function() {
			this.reset();
			this.faq.fetch();

			this.currentView = new FAQView({
				collection: this.faq
			});
			var main = this.$main;

			this.faq.once("sync", function(){
				main.html(this.currentView.render().el);
			}, this);
		},

		news: function() {
			this.reset();
			this.news.fetch();

			var newsView = new NewsView({
				collection: this.news
			});
			var main = this.$main;

			newsView.listenTo(this.news, "sync", function(){
				main.html(newsView.render().el);
			});
		},

		banners: function() {
			this.reset();
			this.banners.fetch();

			this.currentView = new BannersView({
				collection: this.banners
			});
			var main = this.$main;

			this.banners.once("sync", function(){
				main.html(this.currentView.render().el);
			}, this);
		},

		reset: function() {
			this.showLoader();

			if (this.candidates.length) {
				this.candidates.reset();
			}

			if (this.news.length) {
				this.news.reset();
			}

			if (this.faq.length) {
				this.faq.reset();
			}

			this.$mainParent.attr("class", "content");

			if (!_.isNull(this.currentView)) {
				this.currentView.remove();
			}
		},

		// Show loading.
		showLoader: function() {
			if (!this.$main.find(".loader").length) {
				this.$main.html('<div class="loader">Loading...</div>');
			}
		}

	});

	module.exports = Router;
});
