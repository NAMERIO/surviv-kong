"use strict";


var PIXI = require("./pixi.js");
var math = require("./math.js");
var device = require("./device.js");

//
// skillCooldown timer
//
function skillCooldown() {

    //
    // Constants
    //
    this.kLineWidth = 14.0;
    this.kRadius = 7.0;
    this.kFontWidth = 12.0;

    // Init PIXI; this is slow, takes ~250ms
    var domCanvas = document.getElementById('cooldown-cvs');
    var rendererRes = window.devicePixelRatio > 1.0 ? 2.0 : 1.0;
    if (device.os == 'ios') {
        PIXI.settings.PRECISION_FRAGMENT = 'highp';
    }
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    var createPixiApplication = function createPixiApplication(forceCanvas) {
        return new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            view: domCanvas,
            antialias: false,
            resolution: rendererRes,
            forceCanvas: forceCanvas,
            transparent: true
        });
    };
    var pixi = null;
    try {
        pixi = createPixiApplication(false);
    } catch (e) {
        pixi = createPixiApplication(true);
    }
    this.pixi = pixi;
    this.pixi.renderer.plugins.interaction.destroy();
    this.pixi.renderer.transparent = true;

    this.container = new PIXI.Container();
    this.container.visible = false;
    this.pixi.stage.addChild(this.container);
    this.gfx = new PIXI.Graphics();
    this.container.addChild(this.gfx);

    this.counterText = new PIXI.Text();
    this.counterText.anchor.set(0.5, 0.5);
    this.counterText.style = {
        fontFamily: 'Roboto Condensed, Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: this.kFontWidth,
        align: 'center',
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 3.0
    };
    this.container.addChild(this.counterText);

    this.screenScaleFactor = 1.0;
    this.mobileOffset = 0.0;

    this.active = false;
    this.elapsed = 0.0;
    this.duration = 0.0;
    this.posX = 0;
    this.posY = 0;
}

skillCooldown.prototype = {

    setRadius: function setRadius(kRadius) {
        this.kRadius = kRadius;
    },

    setLineWidth: function setLineWidth(kLineWidth) {
        this.kLineWidth = kLineWidth;
    },

    destroy: function destroy() {
        this.container.destroy({
            children: true,
            texture: true
        });
    },

    start: function start(container, elapsed, duration) {
        this.active = true;
        this.elapsed = elapsed;
        this.duration = duration;
        this.posX = container.offset().left + container.height() / 2;
        this.posY = container.offset().top + container.width() / 2;
    },

    stop: function stop() {
        this.active = false;
    },

    resize: function resize(touch, screenScaleFactor) {
        this.screenScaleFactor = screenScaleFactor;

        if (device.uiLayout == device.UiLayout.Sm) {
            if (!device.tablet) {
                this.container.scale.set(0.5, 0.5);
            }
            this.mobileOffset = device.isLandscape ? touch.mobileOffsetLandscape : touch.mobileOffsetPortrait;
        } else {
            this.container.scale.set(1.0, 1.0);
            this.mobileOffset = 0.0;
        }
    },

    update: function update(dt, camera) {
        if (!this.active) {
            this.container.visible = false;
            return;
        }

        this.elapsed = dt;
        var arcRads = this.elapsed / this.duration * Math.PI * 2.0 - Math.PI * 0.5;

        this.gfx.clear();
        this.gfx.lineStyle(this.kLineWidth, 0xFFFFFF, 0.5);
        this.gfx.arc(0.0, 0.0, this.kRadius, -arcRads, Math.PI * 0.5, true);
        this.counterText.text = this.elapsed.toFixed(1);

        this.container.position.set(this.posX, this.posY);
        this.container.visible = true;
    }
};

module.exports = {
    skillCooldown: skillCooldown
};
