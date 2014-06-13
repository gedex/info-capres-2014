define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var app = require("app");
	var util = require("util");

	var CandidatesCollection = Backbone.Collection.extend({
		url: function() {
			return util.urlAddParam(
				app.api.endpoints.candidates,
				"apiKey",
				app.api.key
			);
		},

		parse: function(resp) {
			if (!_.isUndefined(resp.data.results.caleg)) {
				var excerpt_len = 150;
				var lookupLeadPosition = this.lookupLeadPosition;

				_.each(resp.data.results.caleg, function(caleg, i){
					var bio = resp.data.results.caleg[i].biografi;

					bio = bio.replace(/\\n/g, "<br>");

					if (!_.isEmpty(bio) && bio.length > excerpt_len) {
						resp.data.results.caleg[i].biografi_excerpt = bio.substr(0, excerpt_len);
					}

					var pos = lookupLeadPosition(".", 200, 100, bio);
					if (bio[pos-1] !== ".") {
						pos = lookupLeadPosition(" ", pos, 50, bio);
						resp.data.results.caleg[i].biografi_lead = bio.substr(0, pos) + "...";
					} else {
						resp.data.results.caleg[i].biografi_lead = bio.substr(0, pos);
					}
					resp.data.results.caleg[i].biografi_secondary = bio.substr(pos);

					var id = resp.data.results.caleg[i].id;
					if (!_.isUndefined(app.api.shim.pictures[id])) {
						resp.data.results.caleg[i].img = app.api.shim.pictures[id];
					} else {
						resp.data.results.caleg[i].img = app.api.shim.pictures.unavailable;
					}

					var tempat_tinggal = [];
					_.each(['kelurahan_tinggal', 'kecamatan_tinggal', 'kab_kota_tinggal', 'provinsi_tinggal'], function(key){
						if (!_.isEmpty(resp.data.results.caleg[i][key])) {
							tempat_tinggal.push(resp.data.results.caleg[i][key]);
						}
					});

					resp.data.results.caleg[i].tempat_tinggal = tempat_tinggal.join(", ");
				});

				return resp.data.results.caleg;
			}

			return this.models;
		},

		lookupLeadPosition: function(endChar, cursor, maxIterate, text) {
			var it = 0;
			while (text[cursor] !== endChar && it < maxIterate) {
				cursor += 1;
				it += 1;
			}
			return cursor + 1;
		}
	});

	module.exports = CandidatesCollection;
});
