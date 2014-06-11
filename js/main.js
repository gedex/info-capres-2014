define("run", function(require){
	var $ = require("jquery");
	var _ = require("underscore");
	var bootstrap = require("libs/bootstrap/dist/js/bootstrap.min");
	var Backbone = require("backbone");
	var Router = require("router");
	var App = require("app");

	var router = new Router();

	Backbone.history.start();
});

require(["config"], function(){
	require(["run"]);
});
