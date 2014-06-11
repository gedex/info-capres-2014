require.config({
	paths: {
		"almond":     "libs/almond/almond",
		"backbone":   "libs/backbone/backbone",
		"jquery":     "libs/jquery/dist/jquery.min",
		"require":    "libs/requirejs/require",
		"text":       "libs/requirejs-text/text",
		"underscore": "libs/underscore/underscore",
		"bootstrap":  "libs/bootstrap/dist/js/bootstrap.min"
	},

	shim: {
		"backbone": {
			deps:    ["jquery", "underscore"],
			exports: "Backbone"
		},
		"bootstrap": {
			deps: ["jquery"]
		}
	}
});
