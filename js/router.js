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
	var SupportersView = require("views/supporters");
	var PromisesView = require("views/promises");
	var EventsView = require("views/events");
	var VideosView = require("views/videos");
	var VideoView = require("views/video");
	var NewsView = require("views/news");
	var FAQView = require("views/faq");
	var BannersView = require("views/banners");

	var AccountView = require("views/account");
	var UserView = require("views/user");

	var homeTemplate = require("text!templates/home.html");
	var authNavTemplate = require("text!templates/auth-nav.html");

	var Router = Backbone.Router.extend({
		routes: {
			"candidates":             "candidates",
			"candidate/:id":          "candidate",
			"supporters/:id":         "candidateSupporters",

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
			"account":                "myAcccount",
			"user/:id":               "viewUser",

			"*path":                  "home",
		},

		currentView: null,

		initialize: function() {
			this.$main = $("#main");
			this.$mainParent = this.$main.parent();

			this.$modalLogin = $("#modal-login").modal({show: false});
			this.$navLogin = $("#nav-login");

			this.navLoginTemplate = _.template(authNavTemplate);

			this.candidates = new CandidatesCollection();
			this.promises = new PromisesCollection();
			this.events = new EventsCollection();
			this.videos = new VideosCollection();
			this.news = new NewsCollection();
			this.faq = new FAQCollection();
			this.banners = new BannersCollection();
		},

		home: function(path) {
			this.reset();

			this.$mainParent.attr("class", "content-head");
			this.$main.html(homeTemplate);

			if (path === "loginPrompt") this.$modalLogin.modal('show');
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

				if (auth.currentState === "authenticated") {
					this.alterSupportButton();
				} else {
					auth.bind("enterState:authenticated", $.proxy(this.alterSupportButton, this));
				}

				this.liveUpdateSupportersCount(model);

			}, this);
		},

		candidateSupporters: function(candidateId) {
			this.reset();
			this.candidates.fetch();

			this.candidates.once("sync", function() {
				var supportersRef = auth.supporters.child(candidateId);
				supportersRef.once("value", function(snapshot){
					var model = this.candidates.get(candidateId);
					var supporters = snapshot.val();

					this.currentView = new SupportersView({
						model: model,
						supporters: supporters
					});

					this.$main.html(this.currentView.render().el);
				}, this);
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

		myAcccount: function() {
			this.reset();

			this.listenToOnce(auth, "enterState:authenticated", $.proxy(this.myAccountRender, this));
		},

		myAccountRender: function(user) {
			var loc = location.hash.substr(1);

			if (loc === "account") {
				this.currentView = new AccountView({
					user: user,
					auth: auth
				});
				this.$main.html(this.currentView.render().el);
			}
		},

		viewUser: function(id) {
			this.reset();

			auth.users.child(id).once("value", $.proxy(this.viewUserRender, this));
		},

		viewUserRender: function(snapshot) {
			var user = snapshot.val();

			this.currentView = new UserView({
				user: user,
				auth: auth
			});
			this.$main.html(this.currentView.render().el);
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

			this.authInit();
		},

		// Show loading.
		showLoader: function() {
			if (!this.$main.find(".loader").length) {
				this.$main.html('<div class="loader">Loading...</div>');
			}
		},

		authInit: function() {
			auth.bind("transition", $.proxy(this.transitionState, this));

			auth.toState("init");
			auth.trigger("initialized");

			this.bindDOMEvents();
		},

		updateNav: function() {
			this.$navLogin.html(this.navLoginTemplate({user: auth.user}));
		},

		// Actions to be performed when auth state changes.
		transitionState: function(leaveState, enterState) {

			if (leaveState === "anonymous" && _.contains(["fetch", "userReady"], enterState)) {
				this.$modalLogin.modal('hide');
				this.nextUpdateNav = true;
			}
			if (enterState === "authenticated" && this.nextUpdateNav) {
				this.updateNav();
				this.nextUpdateNav = false;
			}
			if (enterState === "anonymous") {
				this.updateNav();
				this.resetButtonSupport($(".support-candidate"));
			}
			if (leaveState === "authenticated" || (leaveState === "toFigureOut" && enterState === "anonymous")) {
				this.redirectOnPrivateView();
			}
		},

		redirectOnPrivateView: function() {
			if (this.isPrivateLocation()) {
				this.stopListening(auth, "enterState:authenticated");
				this.navigate("loginPrompt", {trigger: true});
			}
		},

		isPrivateLocation: function() {
			if (_.contains(["account"], location.hash.substr(1))) return true;
			return false;
		},

		bindDOMEvents: function() {
			$(document).on("click", ".require-login", $.proxy(this.loginClickHandler, this));
			$(document).on("click", ".logout",        $.proxy(this.logoutClickHandler, this));
			$(document).on("click", ".btn-social",    $.proxy(this.socialLoginClickHandler, this));

			$(document).on("click", ".support-candidate.unsupported", $.proxy(this.supportClickHandler, this));
			$(document).on("click", ".support-candidate.supported",   $.proxy(this.unsupportClickHandler, this));
		},

		loginClickHandler: function(e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (auth.currentState === "anonymous") {
				this.$modalLogin.modal('show');
			}
		},

		logoutClickHandler: function(e) {
			e.stopPropagation();
			e.preventDefault();

			auth.trigger("logout");
		},

		socialLoginClickHandler: function(e) {
			var $btn = $(e.target);
			var provider = $btn.data("provider") || "";

			if (!_.isEmpty(provider)) {
				auth.trigger("login", provider);
			}
		},

		// User supports a candidate by clicking "support" button.
		supportClickHandler: function(e) {
			if (auth.currentState !== "authenticated") return false;

			var $btn = $(e.target);
			if ($btn.is("span")) {
				$btn = $btn.parent();
			}
			var candidateId = $btn.data("candidate");

			// First, checks if user has already supported candidate.
			var supportRef = auth.users.child(auth.user.id).child("supportRef").child(candidateId);
			var callback = function(snapshot) {
				var exists = (snapshot.val() !== null);

				if (!exists) {
					this.pushSupporter(candidateId);
					this.setButtonSupportAsSupported($btn);
				}
			};

			supportRef.once("value", callback, this);
		},

		// Pushes to users.{user.id}.supportRef about candidate a user is supporting.
		// Also pushes basic user information to supporters.{candidateId} to easily
		// listing candidate's supporters.
		pushSupporter: function(candidateId) {
			var data = {
				id:               auth.user.id,
				email:            auth.user.email,
				displayName:      auth.user.displayName,
				avatar:           auth.user.avatar,
				avatar_thumbnail: auth.user.avatar_thumbnail
			};

			var newSupportRef = auth.supporters.child(candidateId).push(data);
			auth.users.child(auth.user.id).child("supportRef").child(candidateId).set(newSupportRef.name());
		},

		setButtonSupportAsSupported: function($btn) {
			$btn.addClass("supported");
			$btn.removeClass("unsupported");
			$btn.find(".text").text("Supported");

			if (_.isFunction($btn.tooltip)) {
				$btn.tooltip("destroy");
				$btn.attr("title", "You've supported this candidate. Click again to remove your support.");
				$btn.tooltip();
			}
		},

		// Binding when in "authenticated" state. The bind is initiated after candidate
		// view is rendered.
		alterSupportButton: function() {
			if (!auth.user) return false;

			var view = this.currentView;

			// Alter class of support-candidate button. If current user supported
			// currently viewed candidate then adds class "supported".
			auth.users.child(auth.user.id).child("supportRef").on("value", function(snapshot){
				var val = snapshot.val();

				if (view && view.model) {
					var candidateId = view.model.get("id");
					var $btn = view.$el.find(".support-candidate");

					if ($btn && val && val[candidateId]) {
						this.setButtonSupportAsSupported($btn);
					} else {
						this.resetButtonSupport($btn);
					}
				}
			}, this);
		},

		liveUpdateSupportersCount: function(model) {
			var $counter = this.$main.find("#candidate-supporters-counter");
			var candidateId = model.get("id");
			var ref = auth.supporters.child(candidateId);

			ref.on("value", function(snapshot) {
				var val = snapshot.val();
				var count = _.size(val);
				var text = "This candidate has " + count + " supporter";

				if (count > 1) text += "s";

				if ($counter.length && count) {
					$counter.text(text);
				} else {
					$counter.text("");
				}
			});
		},

		// User removes support from a candidate by clicking "support" button when
		// user has already supported the candidate.
		unsupportClickHandler: function(e) {
			if (auth.currentState !== "authenticated") return false;

			var $btn = $(e.target);
			if ($btn.is("span")) {
				$btn = $btn.parent();
			}
			var candidateId = $btn.data("candidate");

			// First, checks if user has already supported candidate.
			var supportRef = auth.users.child(auth.user.id).child("supportRef").child(candidateId);
			var callback = function(snapshot) {
				var val = snapshot.val();

				if (!_.isNull(val)) {
					this.popSupporter(candidateId, val);
					this.resetButtonSupport($btn);
				}
			};

			supportRef.once("value", callback, this);
		},

		// Pop user from supporters list.
		popSupporter: function(candidateId, refName) {
			var supportRef = auth.supporters.child(candidateId).child(refName);

			// First, removes supportRef of supported candidate from user.
			auth.users.child(auth.user.id).child("supportRef").child(candidateId).remove(function(error){
				if (!error) {
					// Then removes supportRef from supporters list.
					supportRef.remove();
				}
			});
		},

		resetButtonSupport: function($btn) {
			$btn.removeClass("supported");
			$btn.addClass("unsupported");
			$btn.find(".text").text("Give support");

			$btn.attr("title", "Give support to this candidate.");
			$btn.tooltip();
		},

	});

	module.exports = Router;
});
