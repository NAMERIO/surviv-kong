"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proxyDefs = require("./proxyDefs.js");

var proxy = {
    getProxyDef: function getProxyDef() {
        if (false) {}

        var proxies = (0, _keys2.default)(proxyDefs);
        for (var i = 0; i < proxies.length; i++) {
            var _proxy = proxies[i];
            if (window.location.hostname.indexOf(_proxy) !== -1) {
                return { proxy: _proxy, def: proxyDefs[_proxy] };
            }
        }
        return null;
    },

    m_authLocation: function m_authLocation() {
        return !!proxy.getProxyDef();
    },

    loginSupported: function loginSupported(loginType) {
        var proxyDef = proxy.getProxyDef();
        return proxyDef ? !!(proxyDef.def[loginType] || proxyDef.def.all) : false;
    }
};

module.exports = proxy;
