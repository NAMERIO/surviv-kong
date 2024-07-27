"use strict";


var PIXI = require("./pixi.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");

//
// Helpers
//
function Range(min, max) {
    this.min = min;
    this.max = max;
}

Range.prototype = {
    getRandom: function getRandom() {
        return util.random(this.min, this.max);
    }
};

function getRangeValue(val) {
    if (val instanceof Range) {
        return val.getRandom();
    } else {
        return val;
    }
}

function getColorValue(val) {
    return val instanceof Function ? val() : val;
}

//
// Particle defs
//
var Defs = {
    'archwayBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.2, 0.35), end: new Range(0.08, 0.12), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.06, 0.84, util.random(0.46, 0.48)));
        }
    },
    'bloodSplat': {
        image: ['part-splat-01.img', 'part-splat-02.img', 'part-splat-03.img'],
        life: 0.5,
        drag: 1.0,
        rotVel: 0.0,
        scale: { start: 0.04, end: new Range(0.15, 0.2), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0xff0000, 1.0, util.random(0.45, 0.8)));
        }
    },

    'bite': {
        image: ['blood-particle-1.img', 'blood-particle-2.img', 'blood-particle-3.img', 'blood-particle-4.img', 'blood-particle-5.img', 'blood-particle-6.img'],
        life: 1.0,
        drag: 1.0,
        rotVel: 0.0,
        scale: { start: new Range(0.4, 0.5), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xffffff
    },

    'skitterBlood': {
        image: ['blood-skitter-particle-1.img', 'blood-skitter-particle-2.img', 'blood-skitter-particle-3.img', 'blood-skitter-particle-4.img', 'blood-skitter-particle-5.img', 'blood-skitter-particle-6.img'],
        life: new Range(0.5, 1.0),
        drag: 1.0,
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.4, 0.5), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'barrelPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(3.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.08, 0.18), end: new Range(0.07, 0.17), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.09, 0.8, util.random(0.66, 0.68)));
        }
    },
    'barrelChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.01, 0.02, util.random(0.38, 0.41)));
        }
    },
    'barrelBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.01, 0.02, util.random(0.38, 0.41)));
        }
    },
    'blackChip': {
        image: ['part-woodchip-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.08, util.random(0.16, 0.18)));
        }
    },
    'blueChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.64, 1.0, util.random(0.83, 0.85)));
        }
    },
    'book': {
        image: ['part-book-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(3.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.09, 0.19), end: new Range(0.07, 0.17), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 0.42, util.random(0.72, 0.74)));
        }
    },
    'bottleBrownChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 5.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.02, 0.04), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0x783808
    },
    'bottleBrownBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.4, 0.8),
        drag: new Range(1.0, 4.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.03, 0.06), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.8, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0x783808
    },
    'bottleBlueChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 5.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.02, 0.04), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0x004c58
    },
    'bottleWhiteBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.4, 0.8),
        drag: new Range(1.0, 4.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.03, 0.06), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.75, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xFFFFFF
    },
    'bottleWhiteChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 5.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.02, 0.04), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.75, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xFFFFFF
    },
    'bottleBlueBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.4, 0.8),
        drag: new Range(1.0, 4.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.03, 0.06), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.8, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0x004c58
    },
    'brickChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.71, util.random(0.32, 0.34)));
        }
    },
    'clothBreak': {
        image: ['part-cloth-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.95, 1.0)));
        }
    },
    'clothHit': {
        image: ['part-cloth-01.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.95, 1.0)));
        }
    },
    'depositBoxGreyBreak': {
        image: ['part-plate-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(7.0, 8.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.15, 0.25), end: new Range(0.12, 0.2), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.36, 0.38)));
        }
    },
    'depositBoxGoldBreak': {
        image: ['part-plate-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(6.0, 8.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.2, 0.35), end: new Range(0.18, 0.25), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.11, 0.84, util.random(0.64, 0.66)));
        }
    },
    'glassChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 5.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0x80d9ff
    },
    'glassPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x80d9ff
    },
    'goldChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.11, 0.84, util.random(0.88, 0.90)));
        }
    },
    'greenChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.4, 0.18, util.random(0.5, 0.62)));
        }
    },
    'pinkChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xDB5E6B
    },
    'pinkPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.08, 0.16), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x9C475C
    },
    'greenPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.08, 0.16), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x3b452f
    },
    'greenhouseBreak': {
        image: ['part-spark-02.img', 'part-plate-01.img', 'part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.8, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0x80d9ff
    },
    'hutBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.1, 0.81, util.random(0.78, 0.82)));
        }
    },
    'leaf': {
        image: ['part-leaf-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.5, 0.75)));
        }
    },
    'leafPrickly': {
        image: ['part-leaf-01sv.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.8, 0.85)));
        }
    },
    'leafRiver': {
        image: ['part-leaf-02.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.5, 0.75)));
        }
    },
    'lockerBreak': {
        image: ['part-plate-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(7.0, 8.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.15, 0.20), end: new Range(0.12, 0.15), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.1, 0.23, util.random(0.51, 0.53)));
        }
    },
    'ltgreenChip': {
        image: ['part-woodchip-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.2, 0.42, util.random(0.38, 0.42)));
        }
    },
    'outhouseChip': {
        image: ['part-woodchip-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 0.57, util.random(0.4, 0.46)));
        }
    },
    'outhouseBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 0.79, util.random(0.52, 0.54)));
        }
    },
    'outhousePlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 0.57, util.random(0.4, 0.46)));
        }
    },
    'potChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.06, 0.84, util.random(0.73, 0.77)));
        }
    },
    'potBreak': {
        image: ['part-pot-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.06, 0.84, util.random(0.73, 0.77)));
        }
    },
    'potatoChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.075, 0.43, util.random(0.48, 0.5)));
        }
    },

    'pinataChip': {
        image: ['part-breaking-pinata-01.img', 'part-breaking-pinata-02.img', 'part-breaking-pinata-03.img', 'part-breaking-pinata-04.img', 'part-breaking-pinata-05.img', 'part-breaking-pinata-06.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.4, 0.3), end: new Range(0.08, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xffffff
    },
    'potatoBreak': {
        image: ['part-pumpkin-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.075, 0.43, util.random(0.48, 0.5)));
        }
    },
    'pumpkinChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.07, 1.0, util.random(0.98, 1.0)));
        }
    },
    'pumpkinBreak': {
        image: ['part-pumpkin-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 1.0, util.random(0.95, 0.97)));
        }
    },
    'squashChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.31, 0.86, util.random(0.35, 0.36)));
        }
    },
    'squashBreak': {
        image: ['part-pumpkin-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.31, 0.86, util.random(0.35, 0.36)));
        }
    },
    'redChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.98, 1.0, util.random(0.52, 0.54)));
        }
    },
    'redBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.98, 1.0, util.random(0.52, 0.54)));
        }
    },
    'redPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.02, 1.0, util.random(0.26, 0.28)));
        }
    },
    'strongRedPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xCB0101
    },
    'rockChip': {
        image: ['map-stone-01.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.5, 0.75)));
        }
    },
    'rockBreak': {
        image: ['map-stone-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.5, 0.75)));
        }
    },
    'rockEyeChip': {
        image: ['map-stone-01.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.03, 0.06), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0x292421
    },
    'rockEyeBreak': {
        image: ['map-stone-01.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(4.0, 12.0),
        rotVel: 0.0,
        scale: { start: new Range(0.05, 0.1), end: new Range(0.03, 0.06), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x292421
    },
    'shackBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.1, 0.24, util.random(0.38, 0.41)));
        }
    },
    'shackGreenBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x577066
    },
    'tanChip': {
        image: ['part-woodchip-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.1, 0.35, util.random(0.48, 0.52)));
        }
    },
    'bitheroesTreeParticles01': {
        image: ['part-tree-bha-01.img', 'part-tree-bha-02.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.6, 1.0), end: new Range(0.3, 0.4), lerp: new Range(0.6, 1.2) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'bitheroesExplodeTreeParticles01': {
        image: ['part-tree-res-bha-01.img', 'part-tree-res-bha-02.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.3, 1.4), end: new Range(1.2, 1.3), lerp: new Range(1.2, 2.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'bitheroesBushParticles01': {
        image: ['part-bush-bha-01.img', 'part-bush-bha-02.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'teahouseBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.6, 0.31, util.random(0.42, 0.45)));
        }
    },
    'teapavilionBreak': {
        image: ['part-panel-01.img'],
        life: new Range(0.5, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.55), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.80, util.random(0.60, 0.62)));
        }
    },
    'toiletBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.97, 0.0, util.random(0.95, 0.97)));
        }
    },
    'toiletMetalBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.8, 1.0),
        drag: new Range(4.0, 5.0),
        rotVel: 0.0,
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.01, 0.02, util.random(0.38, 0.41)));
        }
    },
    'turkeyFeathersHit': {
        image: ['part-feather-01.img', 'part-feather-02.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.12), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'turkeyFeathersDeath': {
        image: ['part-feather-01.img', 'part-feather-02.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.15, 0.25), end: new Range(0.12, 0.2), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'cupidHit': {
        image: ['part-cupid-01.img', 'part-cupid-02.img', 'part-cupid-03.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.12), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'cupidDeath': {
        image: ['part-cupid-01.img', 'part-cupid-02.img', 'part-cupid-03.img'],
        life: new Range(1.0, 1.5),

        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.15, 0.25), end: new Range(0.12, 0.2), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'magicSparkDeath': {
        image: ['part-magic-spark-01.img', 'part-magic-spark-02.img', 'part-magic-spark-03.img', 'part-magic-spark-04.img'],
        life: new Range(1.0, 1.5),

        drag: new Range(5.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.15, 0.25), end: new Range(0.12, 0.2), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'billionaireDeath': {
        image: ['billionaire-death-1.img', 'billionaire-death-2.img', 'billionaire-death-3.img', 'billionaire-death-1.img'],
        life: new Range(1.0, 1.5),

        drag: new Range(4.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.15, 0.25), end: new Range(0.1, 0.175), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'sparklyDeath': {
        image: ['sparkly-death-1.img', 'sparkly-death-2.img'],
        life: new Range(0.75, 1.75),

        drag: new Range(5.0, 9.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.12, 0.2), end: new Range(0.15, 0.25), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'confettiDeath': {
        image: ['confetti-death-01.img', 'confetti-death-02.img', 'confetti-death-03.img', 'confetti-death-04.img', 'confetti-death-05.img', 'confetti-death-06.img', 'confetti-death-07.img', 'confetti-death-08.img', 'confetti-death-09.img', 'confetti-death-10.img', 'confetti-death-11.img', 'confetti-death-12.img', 'confetti-death-13.img', 'confetti-death-14.img', 'confetti-death-15.img', 'confetti-death-16.img', 'confetti-death-17.img', 'confetti-death-18.img', 'confetti-death-19.img', 'confetti-death-20.img', 'confetti-death-21.img', 'confetti-death-22.img', 'confetti-death-23.img', 'confetti-death-24.img', 'confetti-death-25.img', 'confetti-death-26.img', 'confetti-death-27.img', 'confetti-death-28.img', 'confetti-death-29.img', 'confetti-death-30.img'],
        life: new Range(1.5, 2),

        drag: new Range(3, 3),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.3, 0.3), end: new Range(0.2, 0.2), lerp: new Range(0.0, 0.7) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(1.45, 1.95) },
        color: function color() {
            return 0xffffff;
        }
    },
    'potatoBlastDeath': {
        image: ['potato-blast-death.img'],
        life: new Range(0.75, 1.5),

        drag: new Range(5.0, 15.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.07, 0.15), end: new Range(0.07, 0.15), lerp: new Range(0.0, 0.7) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'whiteChip': {
        image: ['part-spark-02.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.97, 0.0, util.random(0.95, 0.97)));
        }
    },
    'pyreParticle': {
        image: ['part-pyre-01.img', 'part-pyre-02.img', 'part-pyre-03.img', 'part-pyre-04.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'eggParticle': {
        image: ['egg-particle-1.img', 'egg-particle-2.img', 'egg-particle-3.img', 'egg-particle-4.img'],
        life: 0.5,
        drag: new Range(1.0, 10.0),
        rotVel: 0.0,
        scale: { start: new Range(0.3, 0.4), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.97, 0.0, util.random(0.95, 0.97)));
        }
    },
    'candyChip': {
        image: ['part-candy-01.img', 'part-candy-02.img', 'part-candy-03.img', 'part-candy-04.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.25, 0.35), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return 0xffffff;
        }
    },
    'whitePlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.97, 0.0, util.random(0.95, 0.97)));
        }
    },
    'windowBreak': {
        image: ['part-spark-02.img'],
        life: new Range(0.4, 0.8),
        drag: new Range(1.0, 4.0),
        rotVel: new Range(1.0 * Math.PI, 6.0 * Math.PI),
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.8, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0x80d9ff
    },
    'woodChip': {
        image: ['part-woodchip-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.04, 0.08), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.05, 1.0, util.random(0.35, 0.45)));
        }
    },

    'none': {
        image: ['part-woodchip-01.img'],
        life: 0.0,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: new Range(0.0, 0.0), end: new Range(0.0, 0.0), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.05, 1.0, util.random(0.35, 0.45)));
        }
    },
    'spaceChip': {
        image: ['part-space-crate-break-01.img', 'part-space-crate-break-02.img', 'part-space-crate-break-03.img', 'part-space-crate-break-04.img', 'part-space-crate-break-05.img', 'part-space-crate-break-06.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.3, 0.4), end: new Range(0.01, 0.02), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'woodLog': {
        image: ['part-log-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.1, 0.2), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.05, 1.0, util.random(0.35, 0.45)));
        }
    },
    'woodPlank': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.2, 0.3), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.05, 1.0, util.random(0.25, 0.35)));
        }
    },

    'woodPlankBlue': {
        image: ['part-plank-01.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.2, 0.3), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x4BB7D8
    },

    'spacePlank': {
        image: ['part-space-crate-break-01.img', 'part-space-crate-break-02.img', 'part-space-crate-break-03.img', 'part-space-crate-break-04.img', 'part-space-crate-break-05.img', 'part-space-crate-break-06.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.6, 0.7), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'eggDestroy': {
        image: ['part-breaking-egg-01.img', 'part-breaking-egg-02.img', 'part-breaking-egg-03.img', 'part-breaking-egg-04.img', 'part-breaking-egg-05.img', 'part-breaking-egg-06.img', 'part-breaking-egg-07.img', 'part-breaking-egg-08.img', 'part-breaking-egg-09.img', 'part-breaking-egg-10.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(7.0, 8.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.7, 0.6), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'pinataDestroy': {
        image: ['part-breaking-pinata-01.img', 'part-breaking-pinata-02.img', 'part-breaking-pinata-03.img', 'part-breaking-pinata-04.img', 'part-breaking-pinata-05.img', 'part-breaking-pinata-06.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(7.0, 8.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.7, 0.6), end: new Range(0.08, 0.18), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'woodShard': {
        image: ['part-spark-02.img'],
        life: new Range(1.0, 1.5),
        drag: new Range(3.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(0.06, 0.15), end: new Range(0.02, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.05, 1.0, util.random(0.25, 0.35)));
        }
    },

    'tableBHA01': {
        image: ['table_01_particle_01.img', 'table_01_particle_02.img', 'table_01_particle_03.img', 'table_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x00FFFFFF
    },

    'tableBHA01ExplodePart': {
        image: ['table_01_particle_01.img', 'table_01_particle_02.img', 'table_01_particle_03.img', 'table_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x00FFFFFF
    },

    'tableBHA02ExplodePart': {
        image: ['table_02_particle_01.img', 'table_02_particle_02.img', 'table_02_particle_03.img', 'table_02_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x00FFFFFF
    },

    'stoolBHA01ExplodePart': {
        image: ['stool_01_particle_01.img', 'stool_01_particle_02.img', 'stool_01_particle_03.img', 'stool_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x00FFFFFF
    },

    // Weapon particles

    '9mm': {
        image: ['part-shell-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.0625, end: 0.0325, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    '9mm_cursed': {
        image: ['part-shell-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.0625, end: 0.0325, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    '762mm': {
        image: ['part-shell-02.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(1.5, 2.5),
        rotVel: new Range(2.5 * Math.PI, 2.5 * Math.PI),
        scale: { start: 0.075, end: 0.045, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.925, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },

    'water_shot': {
        image: ['map-beach-wet-particle-01.img', 'map-beach-wet-particle-02.img', 'map-beach-wet-particle-03.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(1.5, 2.5),
        rotVel: new Range(2.5 * Math.PI, 2.5 * Math.PI),
        scale: { start: new Range(0.23, 0.33), end: 0.045, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.925, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },

    'nitroLace_shot': {
        image: ['nitroLace-particle.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(1.5, 2.5),
        rotVel: new Range(2.5 * Math.PI, 2.5 * Math.PI),
        scale: { start: new Range(0.23, 0.33), end: 0.045, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.925, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },

    '556mm': {
        image: ['part-shell-04.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(1.5, 2.5),
        rotVel: new Range(2.5 * Math.PI, 2.5 * Math.PI),
        scale: { start: 0.075, end: 0.045, lerp: new Range(0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.925, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    '12gauge': {
        image: ['part-shell-03.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(1.0, 2.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.1, end: 0.05, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    '50AE': {
        image: ['part-shell-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.0625, end: 0.0325, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    '308sub': {
        image: ['part-shell-05.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.0625, end: 0.0325, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    'flare': {
        image: ['part-shell-03.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(1.0, 2.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.1, end: 0.05, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    '45acp': {
        image: ['part-shell-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.07, end: 0.04, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    'potato_ammo': {
        image: ['part-wedge-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.07, end: 0.04, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xFFFFFF
    },
    'heart_ammo': {
        image: ['part-heart-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.2, end: 0.09, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xFFFFFF
    },

    'rainbow_ammo': {
        image: ['part-rainbow-1.img', 'part-rainbow-2.img', 'part-rainbow-3.img', 'part-rainbow-4.img', 'part-rainbow-5.img', 'part-rainbow-6.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.45, end: 0.1, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xFFFFFF
    },

    '40mm': {
        image: ['part-40mm-01.img'],
        life: new Range(0.5, 0.75),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: 0.2, end: 0.09, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.95, 1.0) },
        color: 0xFFFFFF
    },
    'bugle_ammo': {
        image: ['part-note-02.img'],
        life: new Range(1.25, 1.3),
        drag: new Range(3.0, 4.0),
        rotVel: new Range(1.0 * Math.PI, 1.0 * Math.PI),
        scale: { start: 0.1, end: 0.14, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.5, 1.0) },
        color: 0xFFDA00
    },
    'fragPin': {
        image: ['part-frag-pin-01.img'],
        life: new Range(0.5, 0.5),
        drag: new Range(0.9, 1.0),
        rotVel: 0.0,
        scale: { start: 0.18, end: 0.14, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.5, 1.0) },
        color: 0xffffff
    },
    'fragLever': {
        image: ['part-frag-lever-01.img'],
        life: new Range(0.5, 0.5),
        drag: new Range(0.9, 1.0),
        rotVel: 9.0 * Math.PI,
        scale: { start: 0.18, end: 0.14, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.5, 1.0) },
        color: 0xffffff
    },
    'explosionBurst': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.065, 1.0, util.random(0.98, 0.99)));
        }
    },
    'explosionHeartBurst': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.9340, 0.9860, 0.8431));
        }
    },
    'explosionMIRV': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.82, 0.84)));
        }
    },
    'explosionSmoke': {
        image: ['part-smoke-01.img'],
        life: new Range(2.0, 3.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    'explosionUSAS': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 1.0, util.random(0.98, 0.99)));
        }
    },
    'explosionRounds': {
        image: ['part-frag-burst-03.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.08, 0.7, util.random(0.75, 0.8)));
        }
    },
    'explosionBomb': {
        image: ['part-frag-burst-02.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xFFFFFF
    },

    'explosionMotherShip': {
        image: ['part-lightning-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0x9BFF99
    },

    'explosionThunder': {
        image: ['part-lightning-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xFFFFFF
    },
    'explosionPotato': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xad661a
    },
    'explosionPotatoSMG': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xc4a80a
    },
    'explosionHeart': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xfd6ba5
    },
    'explosionSkitternade': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0x9BFF99
    },
    'explosionAntiFire': {
        image: ['part-frag-burst-01.img'],
        life: 0.5,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 1.0, end: 4.0, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.75, 1.0) },
        color: 0xffffff
    },
    'airdropSmoke': {
        image: ['part-smoke-02.img', 'part-smoke-03.img'],
        zOrd: 499,
        life: new Range(1.0, 1.5),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.67, 0.72), end: new Range(0.55, 0.61), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
    },
    'airdropCrate01': {
        image: ['part-airdrop-01.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate01h': {
        image: ['part-airdrop-01h.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate01x': {
        image: ['part-airdrop-01x.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate02': {
        image: ['part-airdrop-02.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate02h': {
        image: ['part-airdrop-02h.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate02x': {
        image: ['part-airdrop-02x.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate03': {
        image: ['part-airdrop-03.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'airdropCrate04': {
        image: ['part-airdrop-04.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'classShell01a': {
        image: ['part-class-shell-01a.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'classShell01b': {
        image: ['part-class-shell-01b.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'classShell02a': {
        image: ['part-class-shell-02a.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'classShell02b': {
        image: ['part-class-shell-02b.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'classShell03a': {
        image: ['part-class-shell-03a.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(2.0, 2.25),
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'classShell03b': {
        image: ['part-class-shell-03b.img'],
        life: new Range(0.85, 1.15),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.0, 2.0 * Math.PI),
        scale: { start: 0.5, end: 0.4, lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },
    'cabinSmoke': {
        image: ['part-smoke-02.img', 'part-smoke-03.img'],
        life: new Range(3.0, 3.25),
        drag: new Range(0.2, 0.22),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.2, 0.25), end: new Range(0.6, 0.65), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.7, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 0.7, lerp: new Range(0.0, 0.1) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.69, 0.695)));
        }
    },
    'bathhouseSteam': {
        image: ['part-smoke-02.img', 'part-smoke-03.img'],
        life: new Range(10.0, 12.0),
        drag: new Range(0.04, 0.06),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.2, 0.25), end: new Range(0.9, 0.95), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.5, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 0.5, lerp: new Range(0.0, 0.1) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.99, 0.995)));
        }
    },
    'bunkerBubbles': {
        image: ['player-ripple-01.img'],
        zOrd: 10,
        life: new Range(2.25, 2.5),
        drag: new Range(1.85, 2.15),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.2, 0.25), end: new Range(0.65, 0.7), lerp: new Range(0.0, 1.0) },
        alpha: { start: 0.25, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.95, 1.0)));
        }
    },
    'waterRipple': {
        image: ['player-ripple-01.img'],
        zOrd: 10,
        life: 1.75,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 0.15, exp: 0.5 },
        alpha: { start: 1.0, exp: -1.0 },
        color: 0xb3f0ff
    },
    'playerHeat': {
        image: ['player-ripple-01.img'],
        zOrd: 10,
        life: 1.75,
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: 0.1, exp: 0.4 },
        alpha: { start: 1.0, exp: -1.0 },
        color: 0xff0000
    },
    'leafAutumn': {
        image: ['part-leaf-03.img', 'part-leaf-04.img', 'part-leaf-05.img', 'part-leaf-06.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.15), end: new Range(0.08, 0.11), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    'leafHalloween': {
        image: ['part-leaf-03.img', 'part-leaf-04.img', 'part-leaf-05.img', 'part-leaf-06.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.15), end: new Range(0.08, 0.11), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.5, 0.55)));
        },
        ignoreValueAdjust: true
    },
    'leafSpring': {
        image: ['part-blossom-01.img', 'part-blossom-02.img', 'part-blossom-03.img', 'part-blossom-04.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.15), end: new Range(0.08, 0.11), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    'leafSummer': {
        image: ['part-leaf-06.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.15), end: new Range(0.08, 0.11), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.7, 0.95)));
        },
        ignoreValueAdjust: true
    },
    'leafPotato': {
        image: ['part-blossom-01.img', 'part-blossom-02.img', 'part-blossom-03.img', 'part-blossom-04.img', 'part-potato-02.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.15), end: new Range(0.08, 0.11), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    'potato': {
        image: ['part-potato-02.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.15), end: new Range(0.08, 0.11), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    'snow': {
        image: ['part-snow-01.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.07, 0.12), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },

    'rain': {
        image: ['part-rain-01.img', 'part-rain-02.img', 'part-rain-03.img', 'part-rain-04.img'],
        life: new Range(10.0, 15.0),
        drag: new Range(0.0, 0.0),
        rotVel: 0.0,
        scale: { start: new Range(0.1, 0.2), end: new Range(0.05, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff
    },

    'snowball_impact': {
        image: ['part-snow-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.23), end: new Range(0.07, 0.14), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    'water_balloon_impact': {
        image: ['map-beach-wet-particle-01.img', 'map-beach-wet-particle-02.img', 'map-beach-wet-particle-03.img'],
        life: new Range(0.5, 1.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.33, 0.43), end: new Range(0.07, 0.14), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0x3576C8
    },
    'potato_impact': {
        image: ['part-potato-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.23), end: new Range(0.07, 0.14), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0x000000, 0.0, util.random(0.9, 0.95)));
        }
    },
    'potato_smg_impact': {
        image: ['part-potato-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.23), end: new Range(0.07, 0.14), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffe585
    },

    'fire_impact': {
        image: ['part-potato-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.23), end: new Range(0.07, 0.14), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xFA4D03
    },

    'heart_impact': {
        image: ['part-potato-01.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(0.0, 0.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.13, 0.23), end: new Range(0.07, 0.14), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        }
    },
    'heal_basic': {
        image: ['part-heal-basic.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_heart': {
        image: ['part-heal-heart.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_moon': {
        image: ['part-heal-moon.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_tomoe': {
        image: ['part-heal-tomoe.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.5 * Math.PI, 1.0 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_hexa': {
        image: ['part-heal-hexa.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_patch': {
        image: ['part-heal-patch.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'heal_paramedicine': {
        image: ['part-heal-paramedicine.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_lotus': {
        image: ['part-heal-lotus.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'heal_syringe': {
        image: ['part-heal-syringe.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'heal_diamond': {
        image: ['part-heal-diamond.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'heal_peace': {
        image: ['part-heal-peace.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'freeze': {
        image: ['part-snowflake.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.2, 0.1), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'wet': {
        image: ['map-beach-wet-particle-01.img', 'map-beach-wet-particle-02.img', 'map-beach-wet-particle-03.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.5, 0.6), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'burning': {
        image: ['map-inferno-burning-particle-01.img', 'map-inferno-burning-particle-02.img', 'map-inferno-burning-particle-03.img', 'map-inferno-burning-particle-04.img', 'map-inferno-burning-particle-05.img', 'map-inferno-burning-particle-06.img', 'map-inferno-burning-particle-07.img', 'map-inferno-burning-particle-01.img', 'map-inferno-burning-particle-08.img', 'map-inferno-burning-particle-09.img', 'map-inferno-burning-particle-10.img', 'map-inferno-burning-particle-11.img', 'map-inferno-burning-particle-12.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(5.0, 10.0),
        rotVel: new Range(0.0, 3.0 * Math.PI),
        scale: { start: new Range(0.3, 0.4), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'wyverns_heart': {
        image: ['bha-part-wyverns-heart.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(5.0, 10.0),
        rotVel: new Range(0.0, 1.2 * Math.PI),
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'frost_core': {
        image: ['bha-part-frost-core.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(5.0, 10.0),
        rotVel: new Range(0.0, 1.2 * Math.PI),
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'unstable_electrode': {
        image: ['bha-part-unstable-electrode.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(5.0, 10.0),
        rotVel: new Range(0.0, 1.2 * Math.PI),
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'light_flare': {
        image: ['bha-part-light-flare.img'],
        life: new Range(0.75, 1.0),
        drag: new Range(5.0, 10.0),
        rotVel: new Range(0.0, 1.2 * Math.PI),
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'boost_basic': {
        image: ['part-boost-basic.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_star': {
        image: ['part-boost-star.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_naturalize': {
        image: ['part-boost-naturalize.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.35 * Math.PI, 0.7 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_shuriken': {
        image: ['part-boost-shuriken.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_energel': {
        image: ['part-boost-energel.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_sugar': {
        image: ['part-boost-sugar.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_gear': {
        image: ['part-boost-gear.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_atomic': {
        image: ['part-boost-atomic.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.3, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'boost_firestorm': {
        image: ['part-boost-firestorm.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0x8ED478,
        ignoreValueAdjust: true
    },
    'boost_drumstick': {
        image: ['part-boost-drumstick.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0x8ED478,
        ignoreValueAdjust: true
    },
    'boost_casing': {
        image: ['part-boost-casing.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xBFE4B3,
        ignoreValueAdjust: true
    },
    'boost_bubble': {
        image: ['part-boost-bubble.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xBFE4B3,
        ignoreValueAdjust: true
    },
    'boost_speed': {
        image: ['part-boost-speed.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xB36E68,
        ignoreValueAdjust: true
    },
    'boost_rudolph': {
        image: ['boost-rudolph.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xFFFFFF,
        ignoreValueAdjust: true
    },
    'boost_bloodbath': {
        image: ['boost-bloodbath.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0, 0),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xff0000,
        ignoreValueAdjust: true
    },
    'boost_santa_boots': {
        image: ['boost-santa-boots.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'heal_santa_hat': {
        image: ['heal-santa-hat.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'boost_holly_ivy': {
        image: ['boost-holly-ivy.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xFFFFFF,
        ignoreValueAdjust: true
    },
    'boost_ch_star': {
        image: ['boost-star.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(1.0 * Math.PI, 2.0 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xFFFFFF,
        ignoreValueAdjust: true
    },
    'frenemy': {
        image: ['part-heart-02.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.0, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'chocolateBox': {
        image: ['part-chocolateBox.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'lucky': {
        image: ['part-rainbow-1.img', 'part-rainbow-2.img', 'part-rainbow-3.img', 'part-rainbow-4.img', 'part-rainbow-5.img', 'part-rainbow-6.img'],
        life: new Range(1.5, 2.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.5, 0.6), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'clover': {
        image: ['part-clover-01.img', 'part-clover-02.img', 'part-clover-03.img', 'part-clover-04.img'],
        life: new Range(2.0, 2.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.40, 0.45), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'hail': {
        image: ['part-hail-01.img', 'part-hail-02.img', 'part-hail-03.img', 'part-hail-04.img'],
        life: new Range(2.0, 2.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.20, 0.25), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'teleport': {
        image: ['part-teleport-01.img', 'part-teleport-02.img', 'part-teleport-03.img', 'part-teleport-04.img'],
        life: new Range(2.0, 2.5),
        drag: new Range(1.0, 10.0),
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.60, 0.65), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'sugarRush': {
        image: ['map-sugar-rush-particle-01.img'],
        life: new Range(1.5, 2.0),
        drag: 0.25,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.5, 0.6), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'gunchiladaParticles': {
        image: ['map-party-time-particle-01.img', 'map-party-time-particle-02.img', 'map-party-time-particle-03.img', 'map-party-time-particle-04.img', 'map-party-time-particle-05.img', 'map-party-time-particle-06.img', 'map-party-time-particle-07.img', 'map-party-time-particle-08.img'],
        life: new Range(1.5, 2.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.4, 0.5), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'watermelonParticles': {
        image: ['map-beach-party-particle-01.img', 'map-beach-party-particle-02.img', 'map-beach-party-particle-03.img', 'map-beach-party-particle-04.img'],
        life: new Range(1.5, 2.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.6, 0.7), end: new Range(0.07, 0.1), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'slime': {
        image: ['slime.img'],
        life: new Range(1.5, 2.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.4, 0.5), end: new Range(0.4, 0.5), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'revive_basic': {
        image: ['part-heal-basic.img'],
        life: new Range(0.75, 1.0),
        drag: 0.25,
        rotVel: 0.0,
        scale: { start: new Range(0.10, 0.12), end: new Range(0.05, 0.07), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.83, 1.0, util.random(0.7, 1.0)));
        },
        ignoreValueAdjust: true
    },
    'leafStim': {
        image: ['part-blossom-01.img', 'part-blossom-02.img', 'part-blossom-03.img', 'part-blossom-04.img'],
        life: new Range(4.0, 5.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.37, 1.0, util.random(0.95, 1.0)));
        }
    },
    'takedownStim': {
        image: ['part-takedown-01.img'],
        life: new Range(4.0, 5.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xc80000
    },
    'inspireStim': {
        image: ['part-note-01.img'],
        life: new Range(4.0, 5.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            return util.rgbToInt(util.hsvToRgb(0.13, 1.0, util.random(0.98, 1.0)));
        }
    },
    'xp_common': {
        image: ['xp-common.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'xp_potion': {
        image: ['bha-part-xp-potion.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'hp_potion': {
        image: ['bha-part-hp-potion.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'brawn_potion': {
        image: ['bha-part-brawn-potion.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: 0.0,
        scale: { start: new Range(0.1, 1.0), end: new Range(0.4, 0.6), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'xp_rare': {
        image: ['part-boost-basic.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            var color = Math.random() > 0.5 ? util.rgbToInt(util.hsvToRgb(0.05, 0.94, util.random(0.85, 0.88))) : util.rgbToInt(util.hsvToRgb(0.06, 0.95, util.random(0.95, 1.0)));
            return color;
        },
        ignoreValueAdjust: true
    },
    'xp_mythic': {
        image: ['part-boost-basic.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.25 * Math.PI, 0.5 * Math.PI),
        scale: { start: new Range(0.12, 0.14), end: new Range(0.06, 0.08), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: function color() {
            var color = Math.random() > 0.5 ? util.rgbToInt(util.hsvToRgb(0.0, 0.96, util.random(0.91, 0.94))) : util.rgbToInt(util.hsvToRgb(0.03, 0.95, util.random(0.92, 0.95)));
            return color;
        },
        ignoreValueAdjust: true
    },
    'part_posion': {
        image: ['part_poison_fx.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.0, 0.0),
        scale: { start: new Range(0.98, 1.0), end: new Range(0.92, 0.94), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },
    'part_bleed': {
        image: ['bleed_particle_01.img'],
        life: new Range(0.75, 1.0),
        drag: 0.0,
        rotVel: new Range(0.0, 0.0),
        scale: { start: new Range(0.5, 0.5), end: new Range(0.5, 0.5), lerp: new Range(0.0, 1.0) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.7, 1.0) },
        alphaIn: { start: 0.0, end: 1.0, lerp: new Range(0.0, 0.05) },
        color: 0xffffff,
        ignoreValueAdjust: true
    },

    'chimney01': {
        image: ['chimney_01_particle_01.img', 'chimney_01_particle_02.img', 'chimney_01_particle_03.img', 'chimney_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'chimney02': {
        image: ['chimney_02_particle_01.img', 'chimney_02_particle_02.img', 'chimney_02_particle_03.img', 'chimney_02_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'strawPile': {
        image: ['straw_pile_01_particle_01.img', 'straw_pile_01_particle_02.img', 'straw_pile_01_particle_03.img', 'straw_pile_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'shelf01': {
        image: ['shelf_01_particle_01.img', 'shelf_01_particle_02.img', 'shelf_01_particle_03.img', 'shelf_01_particle_04.img', 'shelf_01_particle_05.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'counter01': {
        image: ['counter_01_particle_01.img', 'counter_01_particle_02.img', 'counter_01_particle_03.img', 'counter_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'latrine01': {
        image: ['latrine_particle_01.img', 'latrine_particle_02.img', 'latrine_particle_03.img', 'latrine_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'cauldron01': {
        image: ['cauldron_particle_01.img', 'cauldron_particle_02.img', 'cauldron_particle_03.img', 'cauldron_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'dungeonCrate01': {
        image: ['crate_d_particle_01.img', 'crate_d_particle_02.img', 'crate_d_particle_03.img', 'crate_d_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'crate01': {
        image: ['crate_b_particle_01.img', 'crate_b_particle_02.img', 'crate_b_particle_03.img', 'crate_b_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'crate02': {
        image: ['crate_c_particle_01.img', 'crate_c_particle_02.img', 'crate_c_particle_03.img', 'crate_c_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'beerBarrel': {
        image: ['beer_barrel_particle_01.img', 'beer_barrel_particle_02.img', 'beer_barrel_particle_03.img', 'beer_barrel_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'smallBarrel': {
        image: ['small_barrel_particle_01.img', 'small_barrel_particle_02.img', 'small_barrel_particle_03.img', 'small_barrel_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'bigBarrel': {
        image: ['big_barrel_particle_01.img', 'big_barrel_particle_02.img', 'big_barrel_particle_03.img', 'big_barrel_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'goldBarrel': {
        image: ['big_barrel_gold_particle_01.img', 'big_barrel_gold_particle_02.img', 'big_barrel_gold_particle_03.img', 'big_barrel_gold_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'bigUrn': {
        image: ['big_urn_particle_01.img', 'big_urn_particle_02.img', 'big_urn_particle_03.img', 'big_urn_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'smallUrn': {
        image: ['small_urn_particle_01.img', 'small_urn_particle_02.img', 'small_urn_particle_03.img', 'small_urn_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'chest01': {
        image: ['chest_a_particle_01.img', 'chest_a_particle_02.img', 'chest_a_particle_03.img', 'chest_a_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'rubble': {
        image: ['rubble_01_particle_01.img', 'rubble_01_particle_02.img', 'rubble_01_particle_03.img', 'rubble_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'sarcophage01': {
        image: ['sarcophage_01_particle_01.img', 'sarcophage_01_particle_02.img', 'sarcophage_01_particle_03.img', 'sarcophage_01_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'sarcophage02': {
        image: ['sarcophage_02_particle_01.img', 'sarcophage_02_particle_02.img', 'sarcophage_02_particle_03.img', 'sarcophage_02_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    },

    'wornDownStatue': {
        image: ['worn_statue_particle_01.img', 'worn_statue_particle_02.img', 'worn_statue_particle_03.img', 'worn_statue_particle_04.img'],
        life: new Range(0.5, 1.0),
        drag: new Range(1.0, 5.0),
        rotVel: new Range(3.0 * Math.PI, 3.0 * Math.PI),
        scale: { start: new Range(1.44, 1.48), end: new Range(1.41, 1.42), lerp: new Range(0.0, 1.4) },
        alpha: { start: 1.0, end: 0.0, lerp: new Range(0.9, 1.0) },
        color: 0xffffff
    }

};

//
// EmitterDefs
//
var EmitterDefs = {
    'smoke_barrel': {
        particle: 'explosionSmoke',
        rate: new Range(0.2, 0.3),
        radius: 0.0,
        speed: new Range(2.0, 3.0),
        angle: Math.PI * 0.1,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'cabin_smoke_parent': {
        particle: 'cabinSmoke',
        rate: new Range(0.72, 0.83),
        radius: 0.0,
        speed: new Range(2.0 * 32.0, 3.0 * 32.0),
        angle: Math.PI * 0.1,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'bathhouse_steam': {
        particle: 'bathhouseSteam',
        rate: new Range(2.0, 3.0),
        radius: 1.0,
        speed: new Range(1.5, 2.0),
        angle: Math.PI * 0.1,
        maxCount: Number.MAX_VALUE
    },
    'bunker_bubbles_01': {
        particle: 'bunkerBubbles',
        rate: new Range(0.3, 0.325),
        radius: 0.0,
        speed: new Range(1.6, 1.8),
        angle: Math.PI * -2.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'bunker_bubbles_02': {
        particle: 'bunkerBubbles',
        rate: new Range(0.4, 0.425),
        radius: 0.0,
        speed: new Range(1.6, 1.8),
        angle: Math.PI * -2.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'falling_leaf': {
        particle: 'leafAutumn',
        rate: new Range(0.08, 0.12),
        radius: 120.0,
        speed: new Range(2.0, 3.0),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'falling_leaf_halloween': {
        particle: 'leafHalloween',
        rate: new Range(0.08, 0.12),
        radius: 120.0,
        speed: new Range(2.0, 3.0),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'falling_leaf_spring': {
        particle: 'leafSpring',
        rate: new Range(0.1, 0.14),
        radius: 120.0,
        speed: new Range(2.0, 3.0),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'falling_leaf_summer': {
        particle: 'leafSummer',
        rate: new Range(0.18, 0.24),
        radius: 120.0,
        speed: new Range(1.4, 2.4),
        angle: Math.PI * 0.2,
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'falling_leaf_potato': {
        particle: 'leafPotato',
        rate: new Range(0.1, 0.14),
        radius: 120.0,
        speed: new Range(2.0, 3.0),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'falling_potato': {
        particle: 'potato',
        rate: new Range(0.2, 0.24),
        radius: 120.0,
        speed: new Range(2.0, 3.0),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'falling_snow_fast': {
        particle: 'snow',
        rate: new Range(0.12, 0.17),
        maxRate: new Range(0.05, 0.07),
        maxElapsed: 240.0,
        radius: 70.0,
        speed: new Range(1.0, 1.5),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },

    'falling_rain_fast': {
        particle: 'rain',
        rate: new Range(0.0009, 0.0010),
        maxElapsed: 240.0,
        radius: 70.0,
        speed: new Range(30.0, 32.5),
        rot: 0.25 * Math.PI,
        angle: 0.0,
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },

    'falling_rain_fast_02': {
        particle: 'rain',
        rate: new Range(0.0009, 0.0010),
        maxElapsed: 240.0,
        radius: 70.0,
        speed: new Range(30.0, 32.5),
        rot: 0.0,
        angle: 0.0,
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },

    'falling_rain_fast_03': {
        particle: 'rain',
        rate: new Range(0.0009, 0.0010),
        maxElapsed: 240.0,
        radius: 70.0,
        speed: new Range(30.0, 32.5),
        rot: -0.25 * Math.PI,
        angle: 0.0,
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },

    'falling_snow_slow': {
        particle: 'snow',
        rate: new Range(0.08, 0.12),
        radius: 70.0,
        speed: new Range(1.0, 1.5),
        angle: Math.PI * 0.2,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE,
        zOrd: 999
    },
    'heal_basic': {
        particle: 'heal_basic',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_heart': {
        particle: 'heal_heart',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_moon': {
        particle: 'heal_moon',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_tomoe': {
        particle: 'heal_tomoe',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_hexa': {
        particle: 'heal_hexa',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_patch': {
        particle: 'heal_patch',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_paramedicine': {
        particle: 'heal_paramedicine',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_lotus': {
        particle: 'heal_lotus',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_syringe': {
        particle: 'heal_syringe',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_diamond': {
        particle: 'heal_diamond',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_peace': {
        particle: 'heal_peace',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'freeze': {
        particle: 'freeze',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },

    'wet': {
        particle: 'wet',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'burning': {
        particle: 'burning',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'brick': {
        particle: 'brickChip',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'boost_basic': {
        particle: 'boost_basic',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_star': {
        particle: 'boost_star',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_naturalize': {
        particle: 'boost_naturalize',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_shuriken': {
        particle: 'boost_shuriken',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_energel': {
        particle: 'boost_energel',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_sugar': {
        particle: 'boost_sugar',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_gear': {
        particle: 'boost_gear',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_atomic': {
        particle: 'boost_atomic',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_firestorm': {
        particle: 'boost_firestorm',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_drumstick': {
        particle: 'boost_drumstick',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_casing': {
        particle: 'boost_casing',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_bubble': {
        particle: 'boost_bubble',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_bloodbath': {
        particle: 'boost_bloodbath',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 0),
        maxCount: Number.MAX_VALUE
    },
    'boost_santa_boots': {
        particle: 'boost_santa_boots',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'heal_santa_hat': {
        particle: 'heal_santa_hat',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'boost_speed': {
        particle: 'boost_speed',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_rudolph': {
        particle: 'boost_rudolph',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_holly_ivy': {
        particle: 'boost_holly_ivy',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'boost_ch_star': {
        particle: 'boost_ch_star',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'frenemy': {
        particle: 'frenemy',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'chocolateBox': {
        particle: 'chocolateBox',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'lucky': {
        particle: 'lucky',
        rate: new Range(0.1, 0.15),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'clover': {
        particle: 'clover',
        rate: new Range(0.05, 0.1),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'hail': {
        particle: 'hail',
        rate: new Range(0.05, 0.1),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'teleport': {
        particle: 'teleport',
        rate: new Range(0.01, 0.03),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'sugarRush': {
        particle: 'sugarRush',
        rate: new Range(0.1, 0.15),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: new Range(0.0, 2.0 * Math.PI),
        maxCount: Number.MAX_VALUE
    },
    'gunchiladaParticles': {
        particle: 'gunchiladaParticles',
        rate: new Range(0.1, 0.15),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'watermelonParticles': {
        particle: 'watermelonParticles',
        rate: new Range(0.3, 0.4),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'slime': {
        particle: 'slime',
        rate: new Range(0.3, 0.4),
        radius: 2.0,
        speed: new Range(0.75, 1.0),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },

    'revive_basic': {
        particle: 'revive_basic',
        rate: new Range(0.5, 0.55),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'windwalk': {
        particle: 'leafStim',
        rate: new Range(0.1, 0.12),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'takedown': {
        particle: 'takedownStim',
        rate: new Range(0.1, 0.12),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'inspire': {
        particle: 'inspireStim',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'xp_common': {
        particle: 'xp_common',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'xp_potion': {
        particle: 'xp_potion',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'hp_potion': {
        particle: 'hp_potion',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'brawn_potion': {
        particle: 'brawn_potion',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'wyverns_heart': {
        particle: 'wyverns_heart',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'frost_core': {
        particle: 'frost_core',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'unstable_electrode': {
        particle: 'unstable_electrode',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'light_flare': {
        particle: 'light_flare',
        rate: new Range(0.3, 0.4),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'xp_rare': {
        particle: 'xp_rare',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'xp_mythic': {
        particle: 'xp_mythic',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'part_posion': {
        particle: 'part_posion',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0.0,
        rot: 0.0,
        maxCount: Number.MAX_VALUE
    },
    'part_bleed': {
        particle: 'part_bleed',
        rate: new Range(0.3, 0.35),
        radius: 1.5,
        speed: new Range(1.0, 1.5),
        angle: 0,
        rot: 0,
        maxCount: Number.MAX_VALUE
    }
};

//
// Particle
//
function Particle() {
    this.active = false;
    this.ticker = 0.0;
    this.def = {};

    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1.0, 1.0);
    this.sprite.visible = false;

    this.hasParent = false;
}

Particle.prototype = {
    m_init: function m_init(renderer, type, layer, pos, vel, scale, rot, parent, zOrd, valueAdjust) {
        var def = Defs[type];

        this.active = true;
        this.ticker = 0.0;

        if (parent) {
            this.hasParent = true;
            parent.addChild(this.sprite);
        } else {
            this.hasParent = false;
            renderer.addPIXIObj(this.sprite, layer, zOrd);
        }

        this.pos = v2.copy(pos);
        this.vel = v2.copy(vel);
        this.rot = rot;
        this.def = def;

        this.delay = 0.0;
        this.life = getRangeValue(def.life);
        this.drag = getRangeValue(def.drag);
        this.rotVel = getRangeValue(def.rotVel) * (Math.random() < 0.5 ? -1.0 : 1.0);
        this.rotDrag = getRangeValue(def.drag) / 2.0;
        this.scaleUseExp = def.scale.exp !== undefined;
        this.scale = getRangeValue(def.scale.start) * scale;
        this.scaleEnd = !this.scaleUseExp ? getRangeValue(def.scale.end) * scale : 0.0;
        this.scaleExp = this.scaleUseExp ? def.scale.exp : 0.0;
        this.alphaUseExp = def.alpha.exp !== undefined;
        this.alpha = getRangeValue(def.alpha.start);
        this.alphaEnd = !this.alphaUseExp ? getRangeValue(def.alpha.end) : 0.0;
        this.alphaExp = this.alphaUseExp ? def.alpha.exp : 0.0;
        this.alphaIn = def.alphaIn !== undefined;
        this.alphaInStart = this.alphaIn ? getRangeValue(def.alphaIn.start) : 0.0;
        this.alphaInEnd = this.alphaIn ? getRangeValue(def.alphaIn.end) : 0.0;
        this.emitterIdx = -1;

        var tex = Array.isArray(def.image) ? def.image[Math.floor(Math.random() * def.image.length)] : def.image;
        this.sprite.texture = PIXI.Texture.fromImage(tex);
        this.sprite.visible = false;

        this.valueAdjust = def.ignoreValueAdjust ? 1.0 : valueAdjust;
        this.setColor(getColorValue(def.color));
    },

    m_free: function m_free() {
        this.active = false;
        this.sprite.visible = false;
    },

    setDelay: function setDelay(delay) {
        this.delay = delay;
    },

    setColor: function setColor(color) {
        if (this.valueAdjust < 1.0) {
            color = util.adjustValue(color, this.valueAdjust);
        }
        this.sprite.tint = color;
    }
};

//
// Emitter
//
function Emitter() {
    this.active = false;
}

Emitter.prototype = {
    m_init: function m_init(type) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var def = EmitterDefs[type];

        this.active = true;
        this.enabled = true;
        this.type = type;
        this.pos = options.pos ? v2.copy(options.pos) : v2.create(0.0, 0.0);
        this.dir = options.dir ? v2.copy(options.dir) : v2.create(0.0, 1.0);
        this.scale = options.scale !== undefined ? options.scale : 1.0;
        this.layer = options.layer || 0;
        this.duration = options.duration !== undefined ? options.duration : Number.MAX_VALUE;
        this.radius = options.radius !== undefined ? options.radius : def.radius;
        this.ticker = 0.0;
        this.nextSpawn = 0.0;
        this.spawnCount = 0;
        this.parent = options.parent || null;
        this.alpha = 1.0;
        this.rateMult = options.rateMult !== undefined ? options.rateMult : 1.0;

        var partDef = Defs[def.particle];
        this.zOrd = def.zOrd !== undefined ? def.zOrd : partDef.zOrd !== undefined ? partDef.zOrd : 20;
    },

    m_free: function m_free() {
        this.active = false;
    },

    stop: function stop() {
        this.duration = this.ticker;
    }
};

//
// ParticleBarn
//
function m_ParticleBarn(renderer) {
    this.renderer = renderer;

    this.particles = [];
    this.emitters = [];

    // Pre-allocate some particles
    for (var i = 0; i < 256; i++) {
        this.particles[i] = new Particle(this.display);
    }

    this.valueAdjust = 1.0;
}

m_ParticleBarn.prototype = {
    onMapLoad: function onMapLoad(map) {
        this.valueAdjust = map.getMapDef().biome.valueAdjust;
    },

    m_free: function m_free() {
        for (var i = 0; i < this.particles.length; i++) {
            var sprite = this.particles[i].sprite;
            if (sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
            sprite.destroy({ children: true });
        }
    },

    addParticle: function addParticle(type, layer, pos, vel, scale, rot, parent, zOrd) {
        var particle = null;
        for (var i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].active) {
                particle = this.particles[i];
                break;
            }
        }
        if (!particle) {
            particle = new Particle();
            this.particles.push(particle);
        }

        scale = scale !== undefined ? scale : 1.0;
        rot = rot !== undefined ? rot : Math.random() * Math.PI * 2.0;
        zOrd = zOrd !== undefined ? zOrd : Defs[type].zOrd || 20;

        particle.m_init(this.renderer, type, layer, pos, vel, scale, rot, parent, zOrd, this.valueAdjust);

        return particle;
    },

    addRippleParticle: function addRippleParticle(pos, layer, color) {
        var particle = this.addParticle('waterRipple', layer, pos, v2.create(0.0, 0.0), 1.0, 0.0, null);
        particle.setColor(color);
        return particle;
    },

    addHeatParticle: function addHeatParticle(pos, layer) {
        var particle = this.addParticle('playerHeat', layer, pos, v2.create(0.0, 0.0), 1.0, 0.0, null);
        return particle;
    },

    addEmitter: function addEmitter(type) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var emitter = null;
        for (var i = 0; i < this.emitters.length; i++) {
            if (!this.emitters[i].active) {
                emitter = this.emitters[i];
                break;
            }
        }
        if (!emitter) {
            emitter = new Emitter();
            this.emitters.push(emitter);
        }
        emitter.m_init(type, options);
        return emitter;
    },

    m_update: function m_update(dt, camera, debug) {
        // Update emitters
        for (var i = 0; i < this.emitters.length; i++) {
            var e = this.emitters[i];
            if (!e.active || !e.enabled) {
                continue;
            }

            var prevTicker = e.ticker;
            e.ticker += dt;
            e.nextSpawn -= dt;

            // Spawn particles
            var def = EmitterDefs[e.type];
            while (e.nextSpawn <= 0.0 && e.spawnCount < def.maxCount) {
                var rad = e.scale * e.radius;
                var pos = v2.add(e.pos, util.randomPointInCircle(rad));
                var dir = v2.rotate(e.dir, (Math.random() - 0.5) * def.angle);
                var vel = v2.mul(dir, getRangeValue(def.speed));
                var rot = getRangeValue(def.rot);

                var particle = this.addParticle(def.particle, e.layer, pos, vel, e.scale, rot, e.parent, e.zOrd);
                // @NOTE: Bugs waiting to happen here! Emitters that are
                // freed before their particles disappear will be re-used.
                // Any newly allocated emitter will inherit these orphaned
                // particles, potentially leading to an alpha pop.
                particle.emitterIdx = i;

                var rate = getRangeValue(def.rate);
                if (def.maxRate) {
                    var easedElapsed = math.easeInExpo(math.min(1.0, e.ticker / def.maxElapsed));
                    var maxRate = getRangeValue(def.maxRate);
                    rate = math.lerp(easedElapsed, rate, maxRate);
                }
                e.nextSpawn += rate * e.rateMult;
                e.spawnCount++;
            }

            if (e.ticker >= e.duration) {
                e.m_free();
            }
        }

        // Update particles
        for (var _i = 0; _i < this.particles.length; _i++) {
            var p = this.particles[_i];
            if (!p.active) {
                continue;
            }

            p.ticker += dt;
            if (p.ticker < p.delay) {
                continue;
            }

            var t = math.min((p.ticker - p.delay) / p.life, 1.0);

            // Update particle
            p.vel = v2.mul(p.vel, 1.0 / (1.0 + dt * p.drag));
            p.pos = v2.add(p.pos, v2.mul(p.vel, dt));
            p.rotVel *= 1.0 / (1.0 + dt * p.rotDrag);
            p.rot += p.rotVel * dt;

            // Update sprite
            if (p.scaleUseExp) {
                p.scale += dt * p.scaleExp;
            }
            if (p.alphaUseExp) {
                p.alpha = math.max(p.alpha + dt * p.alphaExp, 0.0);
            }

            var _pos = p.hasParent ? p.pos : camera.pointToScreen(p.pos);
            var scale = p.scaleUseExp ? p.scale : math.remap(t, p.def.scale.lerp.min, p.def.scale.lerp.max, p.scale, p.scaleEnd);
            var alpha = p.alphaUseExp ? p.alpha : math.remap(t, p.def.alpha.lerp.min, p.def.alpha.lerp.max, p.alpha, p.alphaEnd);
            // @HACK
            if (p.alphaIn && t < p.def.alphaIn.lerp.max) {
                alpha = math.remap(t, p.def.alphaIn.lerp.min, p.def.alphaIn.lerp.max, p.alphaInStart, p.alphaInEnd);
            }
            // @HACK
            if (p.emitterIdx >= 0) {
                alpha *= this.emitters[p.emitterIdx].alpha;
            }

            if (!p.hasParent) {
                scale = camera.pixels(scale);
            }

            p.sprite.position.set(_pos.x, _pos.y);
            p.sprite.scale.set(scale, scale);
            p.sprite.rotation = p.rot;
            p.sprite.alpha = alpha;
            p.sprite.visible = true;

            // Die if it's time
            if (t >= 1.0) {
                p.m_free();
            }
        }
    }
};

module.exports = {
    EmitterDefs: EmitterDefs,
    m_ParticleBarn: m_ParticleBarn
};
