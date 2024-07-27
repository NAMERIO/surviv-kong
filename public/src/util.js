"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var crypto = require("./991178d3.js");
var math = require("./math.js");
var v2 = require("./v2.js");

var util = {
    //
    // Game objects can belong to the following layers:
    //   0: ground layer
    //   1: bunker layer
    //   2: ground and stairs (both)
    //   3: bunker and stairs (both)
    //
    // Objects on the same layer should interact with one another.
    sameLayer: function sameLayer(a, b) {
        // Which is faster?
        //return (a == b && a < 2) || (a >= 2 && b >= 2);
        return (a & 0x1) == (b & 0x1) || a & 0x2 && b & 0x2;
    },

    sameAudioLayer: function sameAudioLayer(a, b) {
        return a == b || a & 0x2 || b & 0x2;
    },

    toGroundLayer: function toGroundLayer(a) {
        //return a < 2 ? a : (a == 2 ? 0 : 1);
        return a & 0x1;
    },

    toStairsLayer: function toStairsLayer(a) {
        //return a >= 2 ? a : (a == 0 ? 2 : 3);
        //  return a | 0x2;
        return a & 0x1;
    },

    random: function random(min, max) {
        return math.lerp(Math.random(), min, max);
    },

    randomInt: function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Uniformly distributed random point within circle
    // Taken from https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
    randomPointInCircle: function randomPointInCircle(rad) {
        var a = Math.random();
        var b = Math.random();
        if (b < a) {
            var c = a;
            a = b;
            b = c;
        }
        var pos = v2.create(b * rad * Math.cos(2.0 * Math.PI * a / b), b * rad * Math.sin(2.0 * Math.PI * a / b));
        return pos;
    },

    randomPointInAabb: function randomPointInAabb(aabb) {
        return v2.create(util.random(aabb.min.x, aabb.max.x), util.random(aabb.min.y, aabb.max.y));
    },


    /**
     * Return random number between multiple ranges
     * @param rangeArray array 2d
    */
    //Taken from https://stackoverflow.com/questions/45691388/javascript-getting-random-number-from-multiple-ranges 
    randomNumberMultipleRanges: function randomNumberMultipleRanges(rangeArray) {
        var randomNumbers = [];
        for (var i = 0; i < rangeArray.length; i++) {
            var min = rangeArray[i][0];
            var max = rangeArray[i][1];
            randomNumbers.push(this.randomInt(min, max));
        }

        var randomNumber = randomNumbers[this.randomInt(0, randomNumbers.length)];
        return randomNumber;
    },

    seededRand: function seededRand(seed) {
        // Park-Miller PRNG
        var rng = seed;
        return function (min, max) {
            if (min === undefined) {
                min = 0.0;
            }
            if (max === undefined) {
                max = 1.0;
            }
            rng = rng * 16807 % 2147483647;
            var t = rng / 2147483647;
            return math.lerp(t, min, max);
        };
    },

    // Taken from: https://gist.github.com/mjackson/5311256
    rgbToHsv: function rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;

        var max = math.max(r, g, b),
            min = math.min(r, g, b);
        var h = void 0,
            s = void 0,
            v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);break;
                case g:
                    h = (b - r) / d + 2;break;
                case b:
                    h = (r - g) / d + 4;break;
            }

            h /= 6;
        }

        return { h: h, s: s, v: v };
    },

    // Taken from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    hsvToRgb: function hsvToRgb(h, s, v) {
        var r = void 0,
            g = void 0,
            b = void 0,
            i = void 0,
            f = void 0,
            p = void 0,
            q = void 0,
            t = void 0;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6.0);
        f = h * 6.0 - i;
        p = v * (1.0 - s);
        q = v * (1.0 - f * s);
        t = v * (1.0 - (1.0 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;break;
            case 1:
                r = q, g = v, b = p;break;
            case 2:
                r = p, g = v, b = t;break;
            case 3:
                r = p, g = q, b = v;break;
            case 4:
                r = t, g = p, b = v;break;
            case 5:
                r = v, g = p, b = q;break;
        }
        return {
            r: Math.round(r * 255.0),
            g: Math.round(g * 255.0),
            b: Math.round(b * 255.0)
        };
    },

    adjustValue: function adjustValue(tint, value) {
        var r = tint >> 16 & 0xFF;
        var g = tint >> 8 & 0xFF;
        var b = tint & 0xFF;
        r = Math.round(r * value);
        g = Math.round(g * value);
        b = Math.round(b * value);
        return (r << 16) + (g << 8) + b;
    },

    lerpColor: function lerpColor(t, start, end) {
        var toLinear = function toLinear(c) {
            return {
                r: Math.pow(c.r, 2.2),
                g: Math.pow(c.g, 2.2),
                b: Math.pow(c.b, 2.2)
            };
        };
        var toSRGB = function toSRGB(c) {
            return {
                r: Math.pow(c.r, 1.0 / 2.2),
                g: Math.pow(c.g, 1.0 / 2.2),
                b: Math.pow(c.b, 1.0 / 2.2)
            };
        };

        var s = toLinear(util.intToRgb(start));
        var e = toLinear(util.intToRgb(end));

        return util.rgbToInt(toSRGB({
            r: math.lerp(t, s.r, e.r),
            g: math.lerp(t, s.g, e.g),
            b: math.lerp(t, s.b, e.b)
        }));
    },

    rgbToInt: function rgbToInt(c) {
        return (c.r << 16) + (c.g << 8) + c.b;
    },

    intToRgb: function intToRgb(c) {
        return {
            r: c >> 16 & 0xFF,
            g: c >> 8 & 0xFF,
            b: c & 0xFF
        };
    },

    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    rgbToHex: function rgbToHex(c) {
        var rgb = util.rgbToInt(c);
        return '#' + (0x1000000 + rgb).toString(16).slice(-6);
    },

    // https://stackoverflow.com/questions/13348129/using-native-javascript-to-desaturate-a-colour
    hexToRgb: function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    intToHex: function intToHex(int) {
        return '#' + (0x1000000 + int).toString(16).slice(-6);
    },

    hexToInt: function hexToInt(hex) {
        return parseInt(hex.slice(-6), 16);
    },

    updateColor: function updateColor(sat, hex) {
        sat = sat / 100.0;
        var col = util.hexToRgb(hex);
        var gray = col.r * 0.3086 + col.g * 0.6094 + col.b * 0.0820;
        var black = 0.0;

        col.r = Math.round(col.r * sat + black * (1 - sat));
        col.g = Math.round(col.g * sat + black * (1 - sat));
        col.b = Math.round(col.b * sat + black * (1 - sat));

        var out = util.rgbToInt(col);

        return out;
    },

    // Taken from https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
    isObject: function isObject(item) {
        return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
    },

    mergeDeep: function mergeDeep(target) {
        for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            sources[_key - 1] = arguments[_key];
        }

        if (!sources.length) return target;
        var source = sources.shift();

        if (util.isObject(target) && util.isObject(source)) {
            for (var key in source) {
                if (util.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, _defineProperty({}, key, {}));
                    util.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, _defineProperty({}, key, source[key]));
                }
            }
        }

        return util.mergeDeep.apply(util, [target].concat(sources));
    },

    cloneDeep: function cloneDeep(source) {
        // @TODO: This does not properly handle arrays
        return util.mergeDeep({}, source);
    },

    shuffleArray: function shuffleArray(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            var idx = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[idx];
            arr[idx] = tmp;
        }
    },

    rpad: function rpad(s, c) {
        return (s + ' '.repeat(c)).slice(0, c);
    },

    lpad: function lpad(s, c) {
        return (' '.repeat(c) + s).slice(-c);
    },

    // Taken from https://github.com/sindresorhus/fnv1a/blob/master/index.js
    fnv1a: function fnv1a(values) {
        var hash = 2166136261;
        for (var i = 0; i < values.length; i++) {
            hash ^= values[i];
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return hash >>> 0;
    },

    // AES-128 encryption
    encrypt: function encrypt(data, key) {
        var bkey = Buffer.from(key, 'hex');
        var iv = crypto.randomBytes(16);
        var cipher = crypto.createCipheriv('aes-128-gcm', bkey, iv);
        var text = JSON.stringify(data);
        var encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        var tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, encrypted]).toString('base64');
    },

    decrypt: function decrypt(data, key) {
        var bkey = Buffer.from(key, 'hex');
        var bdata = Buffer.from(data, 'base64');
        // @NOTE: There's a crash in node during decipher.update if the iv or tag
        //        buffers are empty
        if (bdata.byteLength < 32) {
            return null;
        }
        var iv = bdata.slice(0, 16);
        var tag = bdata.slice(16, 32);
        var text = bdata.slice(32);

        var ret = null;
        try {
            var decipher = crypto.createDecipheriv('aes-128-gcm', bkey, iv);
            decipher.setAuthTag(tag);

            var decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');
            ret = JSON.parse(decrypted);
        } catch (e) {
            // Let caller handle a failed decipher by returning null
        }
        return ret;
    },

    isDateInThisWeek: function isDateInThisWeek(date) {
        var now = new Date();

        var weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
        var monthDay = now.getDate();
        var mondayThisWeek = monthDay - weekDay;

        var startOfThisWeek = new Date(+now);
        startOfThisWeek.setDate(mondayThisWeek);
        startOfThisWeek.setHours(0, 0, 0, 0);

        var startOfNextWeek = new Date(+startOfThisWeek);
        startOfNextWeek.setDate(mondayThisWeek + 7);

        return date >= startOfThisWeek && date < startOfNextWeek;
    },

    /**
     * This methos receives time in miliseconds and returns the time text on minutes or hours. 
     * @param {string} time 
     * @param {boolean} minutesFloor 
     */
    humanizeTime: function humanizeTime(time) {
        var minutesFloor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var hours = Math.floor(Math.ceil(time / 60) / 60);
        var minutes = minutesFloor ? Math.floor(time / 60) % 60 : Math.ceil(time / 60) % 60;
        var seconds = Math.floor(time) % 60;
        var timeText = '';
        if (hours > 0) {
            timeText += hours + 'h ';
        }
        timeText += minutes + 'm';
        return timeText;
    }
};

module.exports = util;
/* WEBPACK VAR INJECTION */}.call(this, require("./a5e2faae.js").Buffer))
