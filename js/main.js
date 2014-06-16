define("run", function(require){
	var app = require("app");
	var Router = require("router");
	app.router = new Router();

	var $ = require("jquery");
	var _ = require("underscore");
	var Backbone = require("backbone");

	require("bootstrap");

	Backbone.history.start();
});

require(["config"], function(){
	require(["run"]);
});
