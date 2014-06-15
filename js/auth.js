define(function(require, exports, module) {
	"use strict";

	var _ = require("underscore");
	var $ = require("jquery");
	var Backbone = require("backbone");
	var StateMachine = require("statemachine");

	var Firebase = require("firebase");
	var FirebaseSimpleLogin = require("login");

	var app = require("app");
	var util = require("util");

	function Auth() {
		this.initialize.apply(this, arguments);
	}

	_.extend(Auth.prototype, StateMachine, Backbone.Events, {

		states: {
			toFigureOut: {enter: ["checkState"]},
			fetch: {enter: ["login"]},
			userReady: {enter: ["setUser"]},
			userSynced: {enter: ["syncUserToFirebase"]},
			authenticated: {leave: ["logout"]},
		},

		transitions: {
			init: {
				initialized: "toFigureOut"
			},
			toFigureOut: {
				fetchUser: {
					enterState: "userReady"
				},
				logout: {
					enterState: "anonymous"
				}
			},
			anonymous: {
				login: {
					enterState: "fetch"
				},
				fetchUser: {
					enterState: "userReady"
				}
			},
			fetch: {
				fetchUser: {
					enterState: "userReady"
				}
			},
			userReady: {
				syncUser: {
					enterState: "userSynced"
				}
			},
			userSynced: {
				complete: {
					enterState: "authenticated"
				}
			},
			authenticated: {
				logout: {
					enterState: "anonymous"
				}
			}
		},

		initialize: function() {
			this.user = null;

			this.firebase = new Firebase(app.firebase.url);
			this.users = this.firebase.child("users");
			this.supporters = this.firebase.child("supporters");

			this.auth = new FirebaseSimpleLogin(this.firebase, $.proxy(this.onStateChange, this));
			this.startStateMachine();
		},

		checkState: function() {
			if (this.user && this.currentState !== "anonymous") {
				this.trigger("fetchUser", this.user);
			} else {
				this.trigger("logout");
			}
		},

		// Invoked when entering "fetch" state.
		login: function(provider) {
			var options = {};

			switch (provider) {
				case "facebook":
					options.scope = "public_profile,email";
					break;
			}

			this.auth.login(provider, options);
		},

		logout: function() {
			this.auth.logout();
			this.unsetUser();
		},

		// Invoked when entering "userReady" state.
		setUser: function(user) {

			user.socialAccounts = user.socialAccounts || {};
			user.socialAccounts[user.provider] = user.thirdPartyUserData;

			// Set socialAccounts and avatar. Avatar's thumbnail 28x28, ordinary
			// avatar 200x200.
			switch (user.provider) {
				case "facebook":
					user.email = user.thirdPartyUserData.email;
					user.avatar = "http://graph.facebook.com/" + user.thirdPartyUserData.id + "/picture?type=normal&width=200&height=200";
					user.avatar_thumbnail = "http://graph.facebook.com/" + user.thirdPartyUserData.id + "/picture?type=square";
					user.socialAccounts[user.provider].genericon = "facebook";
					user.gender = user.thirdPartyUserData.gender;
					break;
				case "twitter":
					user.avatar = user.thirdPartyUserData.profile_image_url;
					user.avatar_thumbnail = user.thirdPartyUserData.profile_image_url;
					user.socialAccounts[user.provider].genericon = "twitter";
					break;
				case "google":
					user.avatar = user.thirdPartyUserData.picture;
					user.avatar_thumbnail = user.thirdPartyUserData.picture;
					user.socialAccounts[user.provider].genericon = "googleplus";
					user.gender = user.thirdPartyUserData.gender;
					break;
			}

			user.id = util.base64.encode(user.email);

			this.user = user;

			this.trigger("syncUser", user);
		},

		// Invoked when entering "authenticated" state.
		syncUserToFirebase: function(user) {
			var currentUser = this.users.child(user.id);
			currentUser.once("value", function(snapshot){
				var val = snapshot.val();

				if (!val) {
					// First time login sets it to /users/user.id
					currentUser.set(user);
					this.user = user;
				} else {
					// New social account.
					if (val && val.socialAccounts && !(val.socialAccounts[user.provider])) {
						val.socialAccounts[user.provider] = user.socialAccounts[user.provider];
						currentUser.set(val);
						this.user = val;
					} else {
						this.user = val;
					}
				}

				this.trigger("complete", this.user);
			}, this);
		},

		// Callback for FirebaseSimpleLogin instance when user state changes.
		onStateChange: function(err, user) {
			if (err) {
				// An error occurred whilte attempting login.
				this.trigger("error", err, user);
			} else if (user) {
				// User authenticated with Firebase.
				this.trigger("fetchUser", user);
			} else {
				// User is logged out.
				this.trigger("logout", err, user);
			}
		},

		unsetUser: function() {
			this.user = null;
		},

	});

	module.exports = new Auth();
});
