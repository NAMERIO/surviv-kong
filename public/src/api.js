"use strict";


var device = require("./device.js");

var kHost = 'bitheroesarena.com';

var api = {
    resolveUrl: function resolveUrl(url) {
        if (device.webview && device.version < '1.0.8') {
            var proto = window.location.protocol;
            var path = url[0] == '/' ? url.substring(1) : url;
            return proto + '//' + kHost + '/' + path;
        } else {
            return url;
        }
    },

    resolveRoomHost: function resolveRoomHost() {
        if (false) { var port, isHttps; }

        var host = window.location.hostname;
        if (device.webview && device.version < '1.0.8') {
            host = kHost;
        }

        return host;
    }
};

module.exports = api;
