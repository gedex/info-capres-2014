define(function(require, exports, module) {
	"use strict";

	var $ = require("jquery");

	// For idle/away status.
	// Based on idle.js by Alexios Chouchoulas.
	var _idleTimeout = 5000;
	var _awayTimeout = 10000;
	var _idleNow = false;
	var _idleTimestamp = null;
	var _idleTimer = null;
	var _awayNow = false;
	var _awayTimestamp = null;
	var _awayTimer = null;

	var Util = {
		setAwayTimeout: function(ms) {
			_awayTimeout = ms;
			_awayTimestamp = new Date().getTime() + ms;
			if (_awayTimer !== null) {
				clearTimeout(_awayTimer);
			}
			_awayTimer = setTimeout(_makeAway, ms + 50);
		},

		setIdleTimeout: function(ms) {
			_idleTimeout = ms;
			_idleTimestamp = new Date().getTime() + ms;
			if (_idleTimer !== null) {
				clearTimeout (_idleTimer);
			}
			_idleTimer = setTimeout(_makeIdle, ms + 50);
		},

		_makeAway: function() {
			var t = new Date().getTime();

			if (t < _awayTimestamp) {
				_awayTimer = setTimeout(_makeAway, _awayTimestamp - t + 50);
				return;
			}
			_awayNow = true;

			try {
				if (document.onAway) document.onAway();
			} catch (err) {
			}
		},

		_makeIdle: function() {
			var t = new Date().getTime();
			if (t < _idleTimestamp) {
				_idleTimer = setTimeout(_makeIdle, _idleTimestamp - t + 50);
				return;
			}

			_idleNow = true;

			try {
				if (document.onIdle) document.onIdle();
			} catch (err) {
			}
		},

		_active: function() {
			var t = new Date().getTime();
			_idleTimestamp = t + _idleTimeout;
			_awayTimestamp = t + _awayTimeout;

			if (_idleNow) {
				setIdleTimeout(_idleTimeout);
			}

			if (_awayNow) {
				setAwayTimeout(_awayTimeout);
			}

			try {
				if ((_idleNow || _awayNow) && document.onBack) document.onBack(_idleNow, _awayNow);
			} catch (err) {
			}

			_idleNow = false;
			_awayNow = false;
		},

		// Based on http://stackoverflow.com/questions/486896/adding-a-parameter-to-the-url-with-javascript
		urlAddParam: function(url, key, value) {
			key = encodeURI(key);
			value = encodeURI(value);

			var node = document.createElement("a");
			node.href = url;

			var kvp = node.search.substr(1).split('&');
			var i = kvp.length;

			var x;

			while(i--) {
				x = kvp[i].split('=');

				if (x[0] == key) {
					x[1] = value;
					kvp[i] = x.join('=');
					break;
				}
			}

			if (i < 0) {
				kvp[kvp.length] = [key,value].join('=');
			}

			return node.protocol + "//" + node.host + node.pathname + "?" + kvp.join("&");
		}
	};

	$(document).ready(function(){
		var doc = $(this);
		doc.mousemove(Util._active);

		try {
			doc.mouseenter(Util._active);
		} catch (err) { }

		try {
			doc.scroll(Util._active);
		} catch (err) { }

		try {
			doc.keydown(Util._active);
		} catch (err) { }

		try {
			doc.click(Util._active);
		} catch (err) { }

		try {
			doc.dblclick(Util._active);
		} catch (err) { }
	});

	module.exports = Util;
});
