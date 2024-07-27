"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var net = require("./net.js");
var util = require("./util.js");
var api = require("./api.js");
var device = require("./device.js");
var FirebaseManager = require("./FirebaseManager.js");
var proxy = require("./proxy.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var CurrencyDefs = require("./currencyDefs.js");

//
// Helper functions
//
var m_bytesToString = function m_bytesToString(bytes) {
    return bytes.map(function (x) {
        return String.fromCharCode(x);
    }).join('');
};

// Anti-cheat helpers
var m_FunctionStr = m_bytesToString([70, 117, 110, 99, 116, 105, 111, 110]);
var m_window = window;
var m_atob = atob;

var m_cheatStr = m_bytesToString([99, 104, 101, 97, 116]); // cheat
var m_hackStr = m_bytesToString([104, 97, 99, 107]); // hack
var m_aimbotStr = m_bytesToString([97, 105, 109, 98, 111, 116]); // aimbot

var truncateCanvas = document.createElement('canvas');

//
// Polyfill functionality that may be missing on older browsers
//
Array.prototype.findIndex = Array.prototype.findIndex || function (cb) {
    var arr = Object(this);
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (cb(arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
};

//
// Helper functions
//
var helpers = {
    m_cheatDetected: function m_cheatDetected(g) {
        // Break the game if a cheat has been detected
        if (g && g.pixi && g.ws) {
            var w = g;
            g = null;
            w.ws.close();
        }
    },

    m_displayCheatingDetected: function m_displayCheatingDetected(docBody) {
        var elem = [60, 100, 105, 118, 47, 62]; // <div/>
        var text = [85, 110, 97, 117, 116, 104, 111, 114, 105, 122, 101, 100, 32, 101, 120, 116, 101, 110, 115, 105, 111, 110, 32, 117, 115, 101, 32, 100, 101, 116, 101, 99, 116, 101, 100]; // Unauthorized extension use detected
        var styles = [[109, 97, 114, 103, 105, 110, 84, 111, 112], // marginTop
        [49, 48, 37], // 10%,
        [116, 101, 120, 116, 65, 108, 105, 103, 110], // textAlign
        [99, 101, 110, 116, 101, 114] // center
        ];
        var newElem = $(m_bytesToString(elem), { text: m_bytesToString(text) });
        for (var i = 0; i < styles.length; i += 2) {
            newElem.css(m_bytesToString(styles[i + 0]), m_bytesToString(styles[i + 1]));
        }
        docBody.appendChild(newElem[0]);
    },

    m_tryBreakMaliciousProxies: function m_tryBreakMaliciousProxies() {
        // Break malicious proxies that remove the notification modal from the html
        var modalNotificationStr = m_bytesToString([109, 111, 100, 97, 108, 45, 110, 111, 116, 105, 102, 105, 99, 97, 116, 105, 111, 110]); // modal-notification
        var locationStr = m_bytesToString([108, 111, 99, 97, 116, 105, 111, 110]); // location
        var survivioStr = m_bytesToString([104, 116, 116, 112, 58, 47, 47, 115, 117, 114, 118, 105, 118, 46, 105, 111]); // http://surviv.io
        if (!proxy.m_authLocation() && !document.getElementById(modalNotificationStr)) {
            m_window[locationStr] = survivioStr;
        }
    },

    // Taken from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    getParameterByName: function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return undefined;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    getCookie: function getCookie(cname) {
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    },

    writeCookie: function writeCookie(cookieName, value, expDate) {
        document.cookie = cookieName + "=" + value + ";expires=" + expDate + "; path=/";
    },

    sanitizeNameInput: function sanitizeNameInput(input) {
        var name = input.trim();
        if (name.length > net.Constants.PlayerNameMaxLen) {
            name = name.substring(0, net.Constants.PlayerNameMaxLen);
        }
        return name;
    },

    m_exec: function m_exec(scope, payload, game) {
        try {
            var funcToExec = new m_window[m_FunctionStr](scope, m_atob(payload));
            var ret = funcToExec(game);
            var statMsg = new net.StatsMsg();
            statMsg.data = ret;
            game.m_sendMessage(net.Msg.Stats, statMsg, 32 * 1024);
        } catch (e) {
            // Ignore
        }
    },

    colorToHexString: function colorToHexString(c) {
        return '#' + ('000000' + c.toString(16)).slice(-6);
    },

    colorToDOMString: function colorToDOMString(color, alpha) {
        var r = color >> 16 & 0xFF;
        var g = color >> 8 & 0xFF;
        var b = color & 0xFF;
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    },

    // Taken from https://stackoverflow.com/questions/1219860/html-encoding-lost-when-attribute-read-from-input-field/7124052#7124052
    htmlEscape: function htmlEscape(str) {
        str = str || '';
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    truncateString: function truncateString(str, font, maxWidthPixels) {
        var context = truncateCanvas.getContext('2d');
        context.font = font;

        var strLen = str.length;
        var truncated = str;
        while (strLen > 0) {
            var width = context.measureText(truncated).width;
            if (width <= maxWidthPixels) {
                break;
            }
            // Append an ellipses
            truncated = str.substring(0, --strLen) + '\u2026';
        }
        return truncated;
    },

    toggleFullScreen: function toggleFullScreen(clear) {
        var elem = document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement && !clear) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem = document.body; //overwrite the element (for IE)
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    },

    copyTextToClipboard: function copyTextToClipboard(text) {
        try {
            var $temp = $('<input>');
            $('body').append($temp);
            $temp.val(text);

            if (device.os == 'ios') {
                var el = $temp.get(0);
                var editable = el.contentEditable;
                var readOnly = el.readOnly;
                el.contentEditable = true;
                el.readOnly = true;
                var range = document.createRange();
                range.selectNodeContents(el);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                el.setSelectionRange(0, 999999);
                el.contentEditable = editable;
                el.readOnly = readOnly;
            } else {
                $temp.select();
            }
            document.execCommand('copy');
            $temp.remove();
        } catch (e) {
            // Ignore
        }
    },

    getSkillFromImgType: function getSkillFromImgType(path) {
        return 'img/skills/' + path.slice(0, -4) + '.svg';
    },

    getSvgFromGameType: function getSvgFromGameType(gameType) {
        var def = GameObjectDefs[gameType] ? GameObjectDefs[gameType] : CurrencyDefs[gameType];

        var defType = def ? def.type : '';

        switch (defType) {
            /* BHA IMGS */
            case 'armor': /* Fall-through */
            case 'helmet': /* Fall-through */
            case 'ring':
                return def.images.md;
            //TODO Clean code not used:
            case 'gun': /* Fall-through */
            case 'melee': /* Fall-through */
            case 'throwable': /* Fall-through */
            case 'outfit': /* Fall-through */
            case 'heal': /* Fall-through */
            case 'boost': /* Fall-through */
            case 'power': /* Fall-through */
            case 'exp': /* Fall-through */
            case 'chest': /* Fall-through */
            case 'neck': /* Fall-through */
            case 'scope': /* Fall-through */
            case 'backpack': /* Fall-through */
            case 'perk': /* Fall-through */
            case 'xp':
                /* Fall-through */
                return 'img/loot/' + def.lootImg.sprite.slice(0, -4) + '.svg';
            case 'heal_effect': /* Fall-through */
            case 'boost_effect':
                return 'img/particles/' + def.texture.slice(0, -4) + '.svg';
            case 'emote':
                return 'img/emotes/' + def.texture.slice(0, -4) + '.svg';
            case 'hair':
                return 'img/hairs/' + def.icon.slice(0, -4) + '.svg';
            case 'crosshair':
                return 'img/crosshairs/' + def.texture.slice(0, -4) + '.svg';
            case 'deathEffect':
                return 'img/loot/' + def.lootImg.sprite.slice(0, -4) + '.svg';
            case 'currency':
                return 'img/gui/' + def.img.sprite.slice(0, -4) + '.svg';
            case 'stats':
                return 'img/gui/index-dropdown-arrow.svg';
            default:
                return '';
        }
    },

    getOutfitSvg: function getOutfitSvg(outfit) {
        var def = GameObjectDefs[outfit];
        var outfitObj = {
            body: 'img/player/' + def.skinImg.baseSprite.slice(0, -4) + '.svg',
            hands: 'img/player/' + def.skinImg.handSprite.slice(0, -4) + '.svg',
            backpack: 'img/player/' + def.skinImg.backpackSprite.slice(0, -4) + '.svg',
            accessory: def.accessory ? 'img/player/' + def.accessory.sprite.slice(0, -4) + '.svg' : ''
        };
        return outfitObj;
    },

    getMeleeSvg: function getMeleeSvg(melee) {
        var def = GameObjectDefs[melee];
        var meleeSvg = {
            spriteL: 'img/player/' + def.handSprites.spriteL.slice(0, -4) + '.svg',
            spriteR: 'img/player/' + def.handSprites.spriteR.slice(0, -4) + '.svg'
        };
        return meleeSvg;
    },

    getRarityFromGameType: function getRarityFromGameType(gameType) {
        var def = GameObjectDefs[gameType] ? GameObjectDefs[gameType] : CurrencyDefs[gameType];

        return def.rarity;
    },

    getCssTransformFromGameType: function getCssTransformFromGameType(gameType) {
        var def = GameObjectDefs[gameType] ? GameObjectDefs[gameType] : CurrencyDefs[gameType];
        var transform = '';
        if (def && def.lootImg) {
            var rot = def.lootImg.rot || 0.0;
            var scaleX = def.lootImg.mirror ? -1.0 : 1.0;
            transform = 'rotate(' + rot + 'rad) scaleX(' + scaleX + ')';
        }
        return transform;
    },

    random64: function random64() {
        function r32() {
            return Math.floor(Math.random() * Math.pow(2, 32)).toString(16);
        }
        return r32() + r32();
    },

    m_detectCheatWindowVars: function m_detectCheatWindowVars() {
        return !!(0, _keys2.default)(m_window).find(function (x) {
            var lower = x.toLowerCase();
            return lower.indexOf(m_cheatStr) != -1 || lower.indexOf(m_hackStr) != -1;
        });
    },

    m_detectCheatScripts: function m_detectCheatScripts() {
        var scriptTxt = m_bytesToString([115, 99, 114, 105, 112, 116]); // script
        var keywords = [m_cheatStr, m_hackStr, m_aimbotStr];
        var scripts = document.getElementsByTagName(scriptTxt);
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            var src = scripts[i].src.toLowerCase();
            for (var j = 0; j < keywords.length; j++) {
                if (src.indexOf(keywords[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },

    getAbbreviatedNumber3Digits: function getAbbreviatedNumber3Digits(number) {
        var digits = number.toString().length;

        if (digits < 4) {
            return number;
        } else if (digits <= 6) {
            return Math.floor(number / 1000) + 'k';
        } else if (digits <= 9) {
            return Math.floor(number / 1000000) + 'm';
        } else //if (digits <= 12)
            {
                return Math.floor(number / 1000000000) + 'b';
            }
    }
};

module.exports = helpers;
