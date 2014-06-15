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
		},

		// Base64 encode / decode.
		//
		// http://www.webtoolkit.info/
		base64KeyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		base64: {
			encode: function(input) {
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;

				input = Util.base64._utf8_encode(input);

				while (i < input.length) {

					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}

					output = output +
					Util.base64KeyStr.charAt(enc1) + Util.base64KeyStr.charAt(enc2) +
					Util.base64KeyStr.charAt(enc3) + Util.base64KeyStr.charAt(enc4);
				}

				return output;
			},

			_utf8_encode: function(str) {
				str = str.replace(/\r\n/g,"\n");
				var utftext = "";

				for (var n = 0; n < str.length; n++) {
					var c = str.charCodeAt(n);

					if (c < 128) {
						utftext += String.fromCharCode(c);
					}
					else if ((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
				}

				return utftext;
			}
		}, // base64

		ucfirst: function(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
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
