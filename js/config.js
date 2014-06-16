require.config({
	paths: {
		"almond":       "libs/almond/almond",
		"backbone":     "libs/backbone/backbone",
		"statemachine": "libs/backbone.statemachine/backbone.statemachine",
		"jquery":       "libs/jquery/dist/jquery.min",
		"require":      "libs/requirejs/require",
		"text":         "libs/requirejs-text/text",
		"underscore":   "libs/underscore/underscore",
		"bootstrap":    "libs/bootstrap/dist/js/bootstrap.min",
		"firebase":     "libs/firebase/firebase",
		"login":        "libs/firebase-simple-login/firebase-simple-login"
	},

	shim: {
		"backbone": {
			deps:    ["jquery", "underscore"],
			exports: "Backbone"
		},
		"underscore": {
			exports: "_"
		},
		"statemachine": ["underscore","backbone"],
		"bootstrap": {
			deps: ["jquery"]
		},
		"firebase": {
			exports: "Firebase"
		},
		"login": {
			deps: ["firebase"],
			exports: "FirebaseSimpleLogin"
		}
	}
});
