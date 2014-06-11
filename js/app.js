define(function(require, exports, module) {
	"use strict";

	var App = {
		root: "/",
		api: {
			key: "fea6f7d9ec0b31e256a673114792cb17",
			endpoints: {
				candidates: "http://api.pemiluapi.org/calonpresiden/api/caleg",
				events: "http://api.pemiluapi.org/calonpresiden/api/events",
				promises: "http://api.pemiluapi.org/calonpresiden/api/promises",
				videos: "http://api.pemiluapi.org/calonpresiden/api/videos",
				banners: "http://api.pemiluapi.org/stamps/api/stamps",
				faq: "http://api.pemiluapi.org/faq-presiden/api/questions",
				news: "http://api.pemiluapi.org/berita?json=get_recent_posts"
			},
			year: 2014,
			shim: {
				// 200x200.
				pictures: {
					ps: {
						url: "img/candidates/ps.jpg",
						source: "Aktual.co/Tino Oktaviano"
					},
					hr: {
						url: "img/candidates/hr.jpg",
						source: "sinarharapan.co/SH"
					},
					jw: {
						url: "img/candidates/jw.jpg",
						source: "liputan6.com"
					},
					jk: {
						url: "img/candidates/jk.jpg",
						source: "jusufkalla.info"
					},
					unavailable: {
						url: "http://placehold.it/200x200&text=Unavailable"
					}
				}
			}
		}
	};

	module.exports = App;
});
