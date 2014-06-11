define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var VideosCollection = Backbone.Collection.extend({
		byCandidate: function(id) {
			this.reset(
				this.filter(function(video) {
					return _.contains(video.get("id_calon"), id);
				})
			);
		},

		byTag: function(tag) {
			this.reset(
				this.filter(function(video) {
					return _.contains(video.get("tags"), tag);
				})
			);
		},

		url: function() {
			return util.urlAddParam(
				app.api.endpoints.videos,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.data.results.videos)) {
				var urlParser = document.createElement("a");

				_.each(resp.data.results.videos, function(video, idx){

					// Inject Youtube video ID.
					urlParser.href = video.url_video;
					if (_.contains(["www.youtube.com", "youtube.com", "youtu.be"], urlParser.hostname)) {
						var params = urlParser.search.substr(1).split("&");
						var vId = _.filter(params, function(param){
							return (param.substr(0, 2) == "v=");
						});

						if (vId.length > 0) {
							resp.data.results.videos[idx].youtube_id = vId[0].substr(2);
						}
					}

					// Judul excerpt.
					resp.data.results.videos[idx].judul_excerpt = video.judul.substr(0, 64) + " ...";
				});

				return resp.data.results.videos;
			}

			return this.models;
		},

		_getYTId: function(url) {

		}
	});

	module.exports = VideosCollection;
});
