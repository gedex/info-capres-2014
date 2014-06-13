define(function(require, exports, module){
	"use strict";

	var $ = require("jquery");

	var auth = require("auth");

	var CandidatesCollection = require("collections/candidates");
	var PromisesCollection = require("collections/promises");
	var EventsCollection = require("collections/events");
	var VideosCollection = require("collections/videos");
	var NewsCollection = require("collections/news");
	var FAQCollection = require("collections/faq");
	var BannersCollection = require("collections/banners");

	var CandidatesView = require("views/candidates");
	var CandidateView = require("views/candidate");
	var PromisesView = require("views/promises");
	var EventsView = require("views/events");
	var VideosView = require("views/videos");
	var VideoView = require("views/video");
	var NewsView = require("views/news");
	var FAQView = require("views/faq");
	var BannersView = require("views/banners");

	var homeTemplate = require("text!templates/home.html");

	var Router = Backbone.Router.extend({
		routes: {
			"candidates":             "candidates",
			"candidate/:id":          "candidate",

			"promises":               "promises",
			"promises/candidate/:id": "promisesByCandidate",
			"promises/tag/:tag":      "promisesByTag",

			"events":                 "events",
			"events/candidate/:id":   "eventsByCandidate",
			"events/tag/:tag":        "eventsByTag",

			"videos":                 "videos",
			"video/:id":              "video",
			"videos/candidate/:id":   "videosByCandidate",
			"videos/tag/:tag":        "videosByTag",

			"faq":                    "faq",
			"news":                   "news",
			"banners":                "banners",
			"*path":                  "home"
		},

		currentView: null,

		initialize: function() {
			this.$main = $("#main");
			this.$mainParent = this.$main.parent();

			this.candidates = new CandidatesCollection();
			this.promises = new PromisesCollection();
			this.events = new EventsCollection();
			this.videos = new VideosCollection();
			this.news = new NewsCollection();
			this.faq = new FAQCollection();
			this.banners = new BannersCollection();

			auth.setRouter(this);
			auth.bindDOMEvents();
			auth.bindStateChange();
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

				this.trigger("route:view:candidate:constructed", id, this.currentView);

				main.html(this.currentView.render().el);

				this.trigger("route:view:candidate:rendered", id, this.currentView);

			}, this);
		},

		promises: function() {
			this.reset();
			this.promises.fetch();

			this.currentView = new PromisesView({
				collection: this.promises
			});

			this.promises.once("sync", function() {
				this.$main.html(this.currentView.render().el);
			}, this);
		},

		promisesByCandidate: function(id) {
			this.reset();
			this.candidates.fetch();

			this.candidates.once("sync", function(){
				this.promises.fetch();
				this.promises.once("sync", function() {
					this.promises.byCandidate(id);

					this.currentView = new PromisesView({
						collection: this.promises,
						candidate: this.candidates.get(id).toJSON()
					});
					this.$main.html(this.currentView.render().el);
				}, this);
			}, this);
		},

		promisesByTag: function(tag) {
			this.reset();
			this.promises.fetch();

			this.promises.once("sync", function() {
				this.promises.byTag(tag);

				this.currentView = new PromisesView({
					collection: this.promises,
					tag: tag
				});

				this.$main.html(this.currentView.render().el);
			}, this);
		},

		events: function() {
			this.reset();
			this.events.fetch();

			this.currentView = new EventsView({
				collection: this.events
			});

			this.events.once("sync", function() {
				this.$main.html(this.currentView.render().el);
			}, this);
		},

		eventsByCandidate: function(id) {
			this.reset();
			this.candidates.fetch();

			this.candidates.once("sync", function(){
				this.events.fetch();
				this.events.once("sync", function() {
					this.events.byCandidate(id);

					this.currentView = new EventsView({
						collection: this.events,
						candidate: this.candidates.get(id).toJSON()
					});
					this.$main.html(this.currentView.render().el);
				}, this);
			}, this);
		},

		eventsByTag: function(tag) {
			this.reset();
			this.events.fetch();

			this.events.once("sync", function() {
				this.events.byTag(tag);

				this.currentView = new EventsView({
					collection: this.events,
					tag: tag
				});

				this.$main.html(this.currentView.render().el);
			}, this);
		},

		videos: function() {
			this.reset();
			this.videos.fetch();

			this.currentView = new VideosView({
				collection: this.videos
			});

			this.videos.once("sync", function() {
				this.$main.html(this.currentView.render().el);
			}, this);
		},

		video: function(id) {
			this.reset();
			this.videos.fetch();

			this.videos.once("sync", function() {
				this.currentView = new VideoView({
					model: this.videos.get(id),
				});
				this.$main.html(this.currentView.render().el);

			}, this);
		},

		videosByCandidate: function(id) {
			this.reset();
			this.candidates.fetch();

			this.candidates.once("sync", function(){
				this.videos.fetch();
				this.videos.once("sync", function() {
					this.videos.byCandidate(id);

					this.currentView = new VideosView({
						collection: this.videos,
						candidate: this.candidates.get(id).toJSON()
					});
					this.$main.html(this.currentView.render().el);
				}, this);
			}, this);
		},

		videosByTag: function(tag) {
			this.reset();
			this.videos.fetch();

			this.videos.once("sync", function() {
				this.videos.byTag(tag);

				this.currentView = new VideosView({
					collection: this.videos,
					tag: tag
				});

				this.$main.html(this.currentView.render().el);
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

			if (this.promises.length) {
				this.promises.reset();
			}

			if (this.events.length) {
				this.events.reset();
			}

			if (this.videos.length) {
				this.videos.reset();
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
