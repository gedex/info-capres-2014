module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		clean: ["dist/"],

		jshint: ["js/collections/*.js", "js/views/*.js", "js/config.js", "js/app.js", "js/main.js", "js/router.js"],

		requirejs: {
			release: {
				options: {
					mainConfigFile: "js/config.js",
					generateSourceMaps: true,
					include: ["main"],
					out: "dist/source.min.js",
					optimize: "uglify2",
					findNestedDependencies: true,
					name: "almond",
					baseUrl: "js",
					wrap: true,
					preserveLicenseComments: false
				}
			}
		},

		cssmin: {
			release: {
				files: {
					"dist/css/style.min.css": ["css/genericons.css", "css/bootstrap.min.css", "css/font.css", "css/style.css"]
				}
			}
		},

		processhtml: {
			release: {
				files: {
					"dist/index.html": ["index.html"]
				}
			}
		},

		copy: {
			relase: {
				files: [
					{ src: ["css/font/*"], dest: "dist/" },
					{ src: ["img/**"], dest: "dist/" }
				]
			}
		},

		filerev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			img_candidates: {
				src: "dist/img/candidates/*.{jpg,jpeg,gif,png,webp}",
				dest: "dist/img/candidates"
			},
			css: {
				src: "dist/css/style.min.css",
				dest: "dist/css"
			},
			js_bundle: {
				src: "dist/source.min.js",
				dest: "dist"
			},
			js_bundle_map: {
				src: "dist/source.min.js.map",
				dest: "dist"
			}
		},

		usemin: {
			html: "dist/index.html",
			js_main: "dist/source.min*.js",
			css: "dist/css/style.min.css",
			options: {
				assetsDirs: ["dist"],
				patterns: {
					js_main: [
						[/(img\/candidates\/\w+\.(jpg|jpeg|gif|png|webp))/g, "Replacing reference to candidate images"],
						[/(source\.min\.js\.map)/g, "Replacing reference to source.min.js.map"]
					],
				}
			}
		},

		"gh-pages": {
			options: {
				base: "dist"
			},
			src: ["**"]
		}

	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-processhtml");
	grunt.loadNpmTasks("grunt-bbb-requirejs");
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-gh-pages');

	grunt.registerTask("default", [
		"clean",
		"jshint",
		"processhtml",
		"copy",
		"requirejs",
		"cssmin",
		"filerev",
		"usemin"
	]);
};
