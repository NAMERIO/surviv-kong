"use strict";


var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");
var ObjectPool = require("./objectPool.js");

function Smoke() {}

Smoke.prototype = {
    m_init: function m_init() {},

    m_free: function m_free() {
        this.particle.fadeOut();
        this.particle = null;
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        this.type = data.type;
        this.pos = v2.copy(data.pos);
        this.rad = data.rad;

        if (fullUpdate) {
            this.layer = data.layer;
            this.interior = data.interior;
        }

        if (isNew) {
            this.particle = ctx.smokeBarn.allocParticle(this.type);
            this.particle.m_init(this.pos, this.rad, this.layer, this.interior, this.type);
        }
        this.particle.posTarget = v2.copy(this.pos);
        this.particle.radTarget = this.rad;
    }
};

function SmokeParticle(type) {
    var particles = ['part-smoke-02.img', 'part-smoke-03.img'];

    if (type == "smoke_grenade_5") {
        particles = ['foam1.img', 'foam2.img', 'foam3.img', 'foam4.img', 'foam5.img', 'foam6.img', 'foam7.img', 'foam8.img', 'foam9.img', 'foam10.img', 'foam12.img', 'foam12.img'];
    }
    this.active = false;
    this.zIdx = 0;
    this.sprite = PIXI.Sprite.fromImage(particles[Math.floor(Math.random() * particles.length)]);
    this.sprite.anchor = new PIXI.Point(0.5, 0.5);
    this.sprite.visible = false;
}

SmokeParticle.prototype = {
    m_init: function m_init(pos, rad, layer, interior, type) {
        this.pos = v2.copy(pos);
        this.posTarget = v2.copy(this.pos);
        this.rad = rad;
        this.radTarget = this.rad;
        this.rot = util.random(0.0, Math.PI * 2.0);
        this.rotVel = Math.PI * util.random(0.25, 0.5) * (Math.random() < 0.5 ? -1.0 : 1.0);
        this.fade = false;
        this.fadeTicker = 0.0;
        this.fadeDuration = util.random(0.5, 0.75);
        this.type = type;
        if (this.type == 'smoke_grenade_3' || this.type == 'smoke_grenade_4') {
            this.tint = 0x9BFF99;
        } else if (this.type == 'smoke_grenade_5') {
            this.tint = 0x00FFFFFF;
        } else {
            this.tint = util.rgbToInt(util.hsvToRgb(0.0, 0.0, util.random(0.9, 0.95)));
        }
        this.layer = layer;
        this.interior = interior;
    },

    fadeOut: function fadeOut() {
        this.fade = true;
    }
};

function m_SmokeBarn() {
    this.m_smokePool = new ObjectPool.Pool(Smoke);
    this.particles = [];
    this.zIdx = 2147483647;
}

m_SmokeBarn.prototype = {
    allocParticle: function allocParticle(type) {
        var particle = null;
        for (var i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].active) {
                particle = this.particles[i];
                break;
            }
        }

        if (!particle) {
            particle = new SmokeParticle(type);
            this.particles.push(particle);
        }

        particle.active = true;
        particle.zIdx = this.zIdx--;

        return particle;
    },

    m_update: function m_update(dt, camera, activePlayer, map, renderer) {
        // Update authoritative smoke particles
        var smokes = this.m_smokePool.m_getPool();
        for (var i = 0; i < smokes.length; i++) {
            var smoke = smokes[i];
            if (!smoke.active) {
                continue;
            }
        }

        // Update visual particles
        for (var _i = 0; _i < this.particles.length; _i++) {
            var p = this.particles[_i];
            if (!p.active) {
                continue;
            }

            p.rad = math.lerp(dt * 3.0, p.rad, p.radTarget);
            p.pos = math.v2lerp(dt * 3.0, p.pos, p.posTarget);

            var kRotDrag = 0.1;
            p.rotVel *= 1.0 / (1.0 + dt * kRotDrag);
            p.rot += p.rotVel * dt;

            p.fadeTicker += p.fade ? dt : 0.0;
            p.active = p.fadeTicker < p.fadeDuration;

            var kDefaultAlpha = 0.9;
            var alpha = math.clamp(1.0 - p.fadeTicker / p.fadeDuration, 0.0, 1.0) * kDefaultAlpha;

            // Always add to the top layer if visible and not occluded by
            // the layer mask (fixes issue of smokes spawning on the ground
            // level but occluded by the cellar when on the stairs).
            var layer = p.layer;
            if ((util.sameLayer(p.layer, activePlayer.layer) || activePlayer.layer & 0x2) && (p.layer == 1 || !(activePlayer.layer & 0x2) || !map.insideStructureMask(collider.createCircle(p.pos, 1.0)))) {
                layer |= 0x2;
            }
            var zOrd = p.interior ? 500 : 1000;
            renderer.addPIXIObj(p.sprite, layer, zOrd, p.zIdx);

            var screenPos = camera.pointToScreen(p.pos);
            // @HACK: Fix this
            var screenScale = camera.pixels(2.0 * p.rad / camera.ppu);

            p.sprite.position.set(screenPos.x, screenPos.y);
            p.sprite.scale.set(screenScale, screenScale);
            p.sprite.rotation = p.rot;
            p.sprite.tint = p.tint;
            p.sprite.alpha = alpha;
            p.sprite.visible = p.active;
        }
    }
};

module.exports = {
    m_SmokeBarn: m_SmokeBarn
};
