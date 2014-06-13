define(function(require, exports, module) {
	"use strict";

	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");

	var Firebase = require("firebase");
	var FirebaseSimpleLogin = require("login");

	var app = require("app");

	var authNavTemplate = require("text!templates/auth-nav.html");

	function Auth() {
		this.initialize.apply(this, arguments);
	}

	_.extend(Auth.prototype, Backbone.Events, {

		initialize: function() {
			this.$modalLogin = $("#modal-login");
			this.$navLogin = $("#nav-login");
			this.navTemplate = _.template(authNavTemplate);

			this.user = null;
			this.firebase = new Firebase(app.firebase.url);
			this.users = this.firebase.child("users");
			this.supporters = this.firebase.child("supporters");

			var self = this;
			this.auth = new FirebaseSimpleLogin(this.firebase, function(err, user){
				self.onStateChange(err, user);
			});
		},

		setRouter: function(router) {
			this.router = router;

			this.router.on("route:view:candidate:rendered", this.onCandidatePageRender, this);
		},

		onCandidatePageRender: function(candidateId, view) {
			var $counter = view.$el.find("#candidate-supporters-counter");
			var ref = this.supporters.child(candidateId);

			ref.on("value", function(snapshot) {
				var val = snapshot.val();
				var count = _.size(val);
				var text = "This candidate has " + count + " supporter";

				if (count > 1) text += "s";

				if ($counter.length && count) {
					$counter.text(text);
				}
			});
		},

		login: function(provider) {
			this.auth.login(provider);
		},

		logout: function(e) {
			e.preventDefault();
			e.stopPropagation();

			this.auth.logout();
		},

		getFirebase: function() {
			return this.firebase;
		},

		onStateChange: function(err, user) {
			this.trigger("auth:change_start", err, user);

			if (err) {
				// An error occurred whilte attempting login.
				this.trigger("auth:error", err, user);
			} else if (user) {
				// User authenticated with Firebase.
				this.trigger("auth:login", user);
			} else {
				// User is logged out.
				this.trigger("auth:logout");
			}

			this.trigger("auth:change_end", err, user);
		},

		bindStateChange: function() {
			this.on("auth:change_end", this.updateNav, this);
			this.on("auth:login", this.initUser, this);
			this.on("auth:login", this.closeModalLogin, this);
			this.on("auth:logout", this.unsetUser, this);
		},

		updateNav: function(err, user) {
			this.$navLogin.html(this.navTemplate({user: this.user}));
		},

		initUser: function(user) {
			this.user = user;

			// Set avatar.
			switch (user.provider) {
				case "facebook":
					this.user.avatar = "http://graph.facebook.com/" + this.user.id + "/picture?type=square";
					break;
				case "twitter":
					this.user.avatar = this.user.thirdPartyUserData.profile_image_url;
					break;
				case "google":
					this.user.avatar = this.user.thirdPartyUserData.picture;
					break;
			}

			var currentUser = this.users.child(user.uid);
			currentUser.once("value", function(snapshot){
				var val = snapshot.val();
				if (!val) {
					// First time login sets it to /users/users.id.
					currentUser.set(user);
				}
			});

			currentUser.on("value", function(snapshot) {
				var val = snapshot.val();
				var view = this.router.currentView;

				// Alter class of support-candidate button. If current user supported
				// currently viewed candidate then adds class "supported".
				if (view && view.model) {
					var candidateId = view.model.get("id");
					var $btn = view.$el.find(".support-candidate");

					if ($btn && val.supportRef && val.supportRef[candidateId]) {
						this.setButtonSupportAsSupported($btn);
					} else {
						this.resetButtonSupport($btn);
					}
				}

			}, this);
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

		resetButtonSupport: function($btn) {
			$btn.removeClass("supported");
			$btn.addClass("unsupported");
			$btn.find(".text").text("Give support");

			$btn.attr("title", "Give support to this candidate.");
			$btn.tooltip();
		},

		closeModalLogin: function() {
			this.$modalLogin.modal('hide');
		},

		unsetUser: function() {
			this.user = null;

			this.resetButtonSupport($(".support-candidate"));
		},

		bindDOMEvents: function(e) {
			$(document).on("click", ".require-login", $.proxy(this.loginPrompt, this));
			$(document).on("click", ".btn-social", $.proxy(this.initiateLogin, this));
			$(document).on("click", ".logout", $.proxy(this.logout, this));

			$(document).on("click", ".support-candidate.unsupported", $.proxy(this.userSupportCandidate, this));
			$(document).on("click", ".support-candidate.supported", $.proxy(this.userUnsupportCandidate, this));
		},

		loginPrompt: function(e) {
			e.preventDefault();
			e.stopPropagation();

			if (_.isNull(this.user)) {
				this.$modalLogin.modal();
			}
		},

		initiateLogin: function(e) {
			if (!_.isNull(this.user)) return false;

			var $btn = $(e.target);
			var provider = $btn.data("provider") || "";

			if (!_.isEmpty(provider)) this.login(provider);
		},

		userSupportCandidate: function(e) {
			// Unathenticated user.
			if (_.isNull(this.user)) return false;

			var $btn = $(e.target);
			if ($btn.is("span")) {
				$btn = $btn.parent();
			}
			var candidateId = $btn.data("candidate");

			// First checks if user has already supported candidate.
			var supportRef = this.users.child(this.user.uid).child("supportRef").child(candidateId);
			var callback = function(snapshot) {
				var exists = (snapshot.val() !== null);

				if (!exists) {
					this.pushSupporter(candidateId);
					this.setButtonSupportAsSupported($btn);
				}
			};

			supportRef.once("value", callback, this);
		},

		pushSupporter: function(candidateId) {
			var data = {
				uid: this.user.uid,
				displayName: this.user.displayName
			};

			var newSupportRef = this.supporters.child(candidateId).push(data);
			this.users.child(this.user.uid).child("supportRef").child(candidateId).set(newSupportRef.name());
		},

		userUnsupportCandidate: function(e) {
			// Unathenticated user.
			if (_.isNull(this.user)) return false;

			var $btn = $(e.target);
			if ($btn.is("span")) {
				$btn = $btn.parent();
			}
			var candidateId = $btn.data("candidate");

			// First checks if user has already supported candidate.
			var supportRef = this.users.child(this.user.uid).child("supportRef").child(candidateId);
			var callback = function(snapshot) {
				var val = snapshot.val();

				if (!_.isNull(val)) {
					this.popSupporter(candidateId, val);
					this.resetButtonSupport($btn);
				}
			};

			supportRef.once("value", callback, this);
		},

		popSupporter: function(candidateId, refName) {
			var supportRef = this.supporters.child(candidateId).child(refName);

			// First remove supportRef from user namespace.
			this.users.child(this.user.uid).child("supportRef").child(candidateId).remove(function(error){
				if (!error) {
					// Then removes supportRef from supporters list.
					supportRef.remove();
				}
			});
		}
	});

	module.exports = new Auth();
});
