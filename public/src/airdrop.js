"use strict";


var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");
var ObjectPool = require("./objectPool.js");

function Airdrop() {
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;
}

Airdrop.prototype = {
    m_init: function m_init() {
        this.playedLandFx = false;
        this.landed = false;
        this.fallInstance = null;
        this.chuteDeployed = false;
        this.soundUpdateThrottle = 0.0;
        this.pos = v2.create(0.0, 0.0);
        this.isNew = false;
        this.fallTicker = 0.0;
    },

    m_free: function m_free() {
        if (this.fallInstance) {
            this.fallInstance.stop();
        }
        this.fallInstance = null;
        this.sprite.visible = false;
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        if (isNew) {
            this.isNew = true;
            this.fallTicker = data.fallT * GameConfig.airdrop.fallTime;

            var img = ctx.map.getMapDef().biome.airdrop.airdropImg;
            this.sprite.texture = PIXI.Texture.fromImage(img);
        }

        if (fullUpdate) {
            this.pos = v2.copy(data.pos);
        }

        this.landed = data.landed;
    }
};

function m_AirdropBarn() {
    this.m_airdropPool = new ObjectPool.Pool(Airdrop);
}

m_AirdropBarn.prototype = {
    m_free: function m_free() {
        var airdrops = this.m_airdropPool.m_getPool();
        for (var i = 0; i < airdrops.length; i++) {
            var a = airdrops[i];
            a.m_free();
        }
    },

    m_update: function m_update(dt, activePlayer, camera, map, particleBarn, renderer, audioManager) {
        var airdrops = this.m_airdropPool.m_getPool();
        for (var i = 0; i < airdrops.length; i++) {
            var a = airdrops[i];
            if (!a.active) {
                continue;
            }

            a.fallTicker += dt;
            var fallT = math.clamp(a.fallTicker / GameConfig.airdrop.fallTime, 0.0, 1.0);

            var layer = 0;
            if ((util.sameLayer(layer, activePlayer.layer) || activePlayer.layer & 0x2) && (!(activePlayer.layer & 0x2) || !map.insideStructureMask(collider.createCircle(a.pos, 1.0)))) {
                layer |= 0x2;
            }

            if (a.landed && !a.playedLandFx) {
                a.playedLandFx = true;

                if (!a.isNew) {
                    // Make some crate particles?
                    for (var j = 0; j < 10; j++) {
                        var vel = v2.randomUnit();
                        particleBarn.addParticle('airdropSmoke', layer, a.pos, vel);
                    }

                    // Water landing effects
                    var surface = map.getGroundSurface(a.pos, layer);
                    if (surface.type == 'water' && !map.snowMode) {
                        for (var _i = 0; _i < 12; _i++) {
                            var ripplePos = v2.add(a.pos, v2.mul(v2.randomUnit(), util.random(4.5, 6.0)));
                            var part = particleBarn.addRippleParticle(ripplePos, layer, surface.data.rippleColor);
                            part.setDelay(_i * 0.075);
                        }
                    }

                    // Play the crate hitting ground sound
                    var crashSound = surface.type == 'water' && !map.snowMode ? 'airdrop_crash_02' : 'airdrop_crash_01';
                    audioManager.playSound(crashSound, {
                        channel: "sfx",
                        soundPos: a.pos,
                        layer: layer,
                        filter: 'muffled'
                    });
                    audioManager.stopSound(a.fallInstance);
                    a.fallInstance = null;
                }
            }

            // Play airdrop chute and falling sounds once
            if (!a.chuteDeployed && fallT <= 0.1) {
                audioManager.playSound('airdrop_chute_01', {
                    channel: "sfx",
                    soundPos: a.pos,
                    layer: layer,
                    rangeMult: 1.75
                });
                a.chuteDeployed = true;
            }

            if (!a.landed && !a.fallInstance) {
                a.fallInstance = audioManager.playSound('airdrop_fall_01', {
                    channel: "sfx",
                    soundPos: a.pos,
                    layer: layer,
                    rangeMult: 1.75,
                    ignoreMinAllowable: true,
                    offset: a.fallTicker
                });
            }

            if (a.fallInstance && a.soundUpdateThrottle < 0.0) {
                a.soundUpdateThrottle = 0.1;
                audioManager.updateSound(a.fallInstance, "sfx", a.pos, {
                    layer: layer,
                    rangeMult: 1.75,
                    ignoreMinAllowable: true
                });
            } else {
                a.soundUpdateThrottle -= dt;
            }

            a.rad = math.lerp(Math.pow(1.0 - fallT, 1.1), 5.0, 12.0);
            renderer.addPIXIObj(a.sprite, layer, 1500, a.__id);

            var screenPos = camera.pointToScreen(a.pos);
            var screenScale = camera.pixels(2.0 * a.rad / camera.ppu);
            a.sprite.position.set(screenPos.x, screenPos.y);
            a.sprite.scale.set(screenScale, screenScale);
            a.sprite.tint = 0xffff00;
            a.sprite.alpha = 1.0;
            a.sprite.visible = !a.landed;

            a.isNew = false;
        }
    }
};

module.exports = {
    m_AirdropBarn: m_AirdropBarn
};
