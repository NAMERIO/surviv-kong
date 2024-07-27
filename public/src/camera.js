"use strict";


var math = require("./math.js");
var v2 = require("./v2.js");

function m_Camera() {
    this.m_mangle = 0;

    this.pos = v2.create(0.0, 0.0);
    this.ppu = 16.0;
    this.m_zoom = 1.5;
    this.m_targetZoom = 1.5;
    this.screenWidth = 1;
    this.screenHeight = 1;
    this.shakeEnabled = true;
    this.shakeInt = 0.0;
}

m_Camera.prototype = {
    z: function z() {
        return this.ppu * this.m_zoom;
    },

    pointToScreen: function pointToScreen(point) {
        return {
            x: this.screenWidth * 0.5 + (point.x - this.pos.x) * this.z(),
            y: this.screenHeight * 0.5 - (point.y - this.pos.y) * this.z()
        };
    },

    m_screenToPoint: function m_screenToPoint(screen) {
        return {
            x: this.pos.x + (screen.x - this.screenWidth * 0.5) / this.z(),
            y: this.pos.y + (this.screenHeight * 0.5 - screen.y) / this.z()
        };
    },

    pixels: function pixels(p) {
        return p * this.m_zoom;
    },

    scaleToScreen: function scaleToScreen(s) {
        return s * this.z();
    },

    setShakeEnabled: function setShakeEnabled(en) {
        this.shakeEnabled = en;
    },

    addShake: function addShake(pos, intensity) {
        var dist = v2.length(v2.sub(this.pos, pos));
        var newInt = math.delerp(dist, 40.0, 10.0) * intensity;
        this.shakeInt = Math.max(this.shakeInt, newInt);
    },

    applyShake: function applyShake() {
        if (this.shakeEnabled) {
            this.pos = v2.add(this.pos, v2.mul(v2.randomUnit(), this.shakeInt));
        }
        this.shakeInt = 0.0;
    }
};

module.exports = {
    m_Camera: m_Camera
};
