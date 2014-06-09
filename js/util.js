define(function(require, exports, module) {
	"use strict";

	var Util = {
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

	module.exports = Util;
});
