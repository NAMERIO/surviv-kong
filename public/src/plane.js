"use strict";


var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");

var kPlaneElevateMult = 1.25;
var kPlaneAlpha = 0.75;
var kPlaneAlphaMult = 0.75;
var kPlaneElevateTime = 2.0;

//
// Plane
//
function Plane() {
    this.active = false;

    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;
}

Plane.prototype = {
    m_init: function m_init(data, map) {
        this.id = data.id;
        this.pos = v2.copy(data.pos);
        this.planeDir = v2.copy(data.planeDir);
        this.actionComplete = data.actionComplete;

        this.active = true;
        this.dirty = false;

        this.soundInstance = null;
        this.soundUpdateThrottle = 0.0;

        this.alpha = kPlaneAlpha;
        this.renderAlpha = 1.0;
        this.spriteUpdateTime = 0.0;

        this.type = data.action;
        this.config = this.type == GameConfig.Plane.Airdrop ? GameConfig.airdrop : GameConfig.airstrike;

        this.rad = this.config.planeRad;

        switch (this.type) {
            case GameConfig.Plane.Airdrop:
                {
                    this.sprite.texture = PIXI.Texture.fromImage(map.getMapDef().biome.airdrop.planeImg);
                    this.planeSound = map.getMapDef().biome.airdrop.planeSound;
                    break;
                }
            case GameConfig.Plane.Airstrike:
                {
                    this.sprite.texture = PIXI.Texture.fromImage('map-plane-02.img');
                    this.planeSound = 'fighter_01';
                    break;
                }
        }

        this.sprite.visible = true;
        this.sprite.rotation = Math.atan2(this.planeDir.x, this.planeDir.y);
    },

    m_free: function m_free(audioManager) {
        // Don't free this plane until it's fully elevated
        if (this.spriteUpdateTime < kPlaneElevateTime) {
            return;
        }
        if (this.soundInstance) {
            audioManager.stopSound(this.soundInstance);
            this.soundInstance = null;
        }
        this.sprite.visible = false;
        this.active = false;
    }
};

//
// AirstrikeZone
//
function AirstrikeZone(container) {
    this.active = false;
    this.pos = v2.create(0.0, 0.0);
    this.rad = 0.0;
    this.duration = 0.0;
    this.ticker = 0.0;

    this.gfx = new PIXI.Graphics();
    container.addChild(this.gfx);
}

AirstrikeZone.prototype = {
    m_init: function m_init(pos, rad, duration) {
        this.active = true;
        this.pos = v2.copy(pos);
        this.rad = rad;
        this.duration = duration;
        this.ticker = 0.0;

        this.renderPos = v2.create(0.0, 0.0);
        this.renderRad = 0.0;

        this.gfx.visible = true;
    },

    m_update: function m_update(dt, map, uiManager) {
        this.ticker += dt;

        this.gfx.visible = true;

        if (this.ticker >= this.duration) {
            this.gfx.visible = false;
            this.active = false;
        }
    },

    m_render: function m_render(uiManager, map, debug) {
        // uiManager.getMapPosFromWorldPos is only valid after
        // uiManager.update() is run, so this logic must be run
        // afterward; render() is a reasonable place to do it.
        var pos = uiManager.getMapPosFromWorldPos(this.pos, map);
        var edge = uiManager.getMapPosFromWorldPos(v2.add(this.pos, v2.create(this.rad, 0.0)), map);
        var rad = v2.length(v2.sub(edge, pos));

        var kEps = 0.0001;
        var posChanged = !v2.eq(this.renderPos, pos, kEps);
        var radChanged = !math.eqAbs(this.renderRad, rad, kEps);
        if (posChanged) {
            this.renderPos = v2.copy(pos);
        }
        if (radChanged) {
            this.renderRad = rad;
        }

        // Update circle?
        if (posChanged) {
            this.gfx.position.set(this.renderPos.x, this.renderPos.y);
        }
        if (radChanged) {
            this.gfx.clear();
            this.gfx.lineStyle(1.5, 0xeaff00);
            this.gfx.beginFill(0xeaff00, 0.2);
            this.gfx.drawCircle(0.0, 0.0, this.renderRad);
            this.gfx.endFill();
        }

        var kFade = 0.5;
        var alpha = math.smoothstep(this.ticker, 0.0, kFade) * (1.0 - math.smoothstep(this.ticker, this.duration - kFade, this.duration));
        this.gfx.alpha = alpha;
    }
};

//
// PlaneBarn
//
function m_PlaneBarn(audioManager) {
    this.m_planes = [];
    this.m_airstrikeZones = [];
    this.airstrikeZoneContainer = new PIXI.Container();

    this.audioManager = audioManager;
}

m_PlaneBarn.prototype = {
    m_free: function m_free() {
        for (var i = 0; i < this.m_planes.length; i++) {
            var p = this.m_planes[i];
            p.m_free(this.audioManager);
        }
    },

    m_updatePlanes: function m_updatePlanes(planeData, map) {
        // Mark existing planes as dirty
        for (var i = 0; i < this.m_planes.length; i++) {
            this.m_planes[i].dirty = true;
        }

        // Update planes and allocate new ones as needed
        for (var _i = 0; _i < planeData.length; _i++) {
            var data = planeData[_i];

            var plane = null;
            for (var j = 0; j < this.m_planes.length; j++) {
                var p = this.m_planes[j];
                if (p.active && p.id == data.id) {
                    plane = p;
                    break;
                }
            }
            if (!plane) {
                plane = this.m_addPlane(data, map);
            }

            plane.dirty = false;
            plane.actionComplete = data.actionComplete;
        }

        // Delete old planes
        for (var _i2 = 0; _i2 < this.m_planes.length; _i2++) {
            var _p = this.m_planes[_i2];
            if (_p.active && _p.dirty) {
                _p.m_free(this.audioManager);
            }
        }
    },

    m_addPlane: function m_addPlane(data, map) {
        var p = null;
        for (var i = 0; i < this.m_planes.length; i++) {
            if (!this.m_planes[i].active) {
                p = this.m_planes[i];
                break;
            }
        }
        if (!p) {
            p = new Plane();
            this.m_planes.push(p);
        }

        p.m_init(data, map);
        return p;
    },

    m_createAirstrikeZone: function m_createAirstrikeZone(data) {
        var zone = null;
        for (var i = 0; i < this.m_airstrikeZones.length; i++) {
            if (!this.m_airstrikeZones[i]) {
                zone = this.m_airstrikeZones[i];
                break;
            }
        }
        if (!zone) {
            zone = new AirstrikeZone(this.airstrikeZoneContainer);
            this.m_airstrikeZones.push(zone);
        }
        zone.m_init(data.pos, data.rad, data.duration);
        return zone;
    },

    m_update: function m_update(dt, camera, activePlayer, map, renderer) {
        // Update plane visuals
        for (var i = 0; i < this.m_planes.length; i++) {
            var p = this.m_planes[i];
            if (!p.active) {
                continue;
            }

            var layer = 0;
            if ((util.sameLayer(layer, activePlayer.layer) || activePlayer.layer & 0x2) && (!(activePlayer.layer & 0x2) || !map.insideStructureMask(collider.createCircle(p.pos, 1.0)))) {
                layer |= 0x2;
            }

            // Do we need to reconcile the client plane and the server plane pos?
            p.pos = v2.add(p.pos, v2.mul(p.planeDir, dt * p.config.planeVel));

            // If the drop is deployed, lerp towards the elevated sprite values
            if (p.actionComplete) {
                p.spriteUpdateTime = Math.min(p.spriteUpdateTime + dt, kPlaneElevateTime);
                var updateNormal = p.spriteUpdateTime / kPlaneElevateTime;
                p.rad = math.lerp(p.spriteUpdateTime, p.config.planeRad, p.config.planeRad * kPlaneElevateMult);
                p.alpha = math.lerp(p.spriteUpdateTime, kPlaneAlpha, kPlaneAlpha * kPlaneAlphaMult);
                p.soundRangeMult = math.max(0, math.lerp(p.spriteUpdateTime, p.config.soundRangeMult, p.config.soundRangeMult - p.config.soundRangeDelta));
            }

            if (!p.soundInstance) {
                var distToPlane = v2.length(v2.sub(activePlayer.pos, p.pos));
                var maxRange = p.config.soundRangeMax * p.config.soundRangeMult;

                var offset = 0.0;
                // Offset fighter sounds to compensate for distToPlane
                if (p.type == GameConfig.Plane.Airstrike) {
                    var maxDistToOffset = 800.0;
                    var minDist = 150.0;
                    var maxSoundOffset = 2.25;
                    var distToCompare = math.max(minDist, distToPlane);
                    offset = (1 - math.clamp(math.max(0, distToCompare) / maxDistToOffset, 0, 1)) * maxSoundOffset;
                }

                if (distToPlane < maxRange) {
                    p.soundInstance = this.audioManager.playSound(p.planeSound, {
                        channel: "sfx",
                        soundPos: p.pos,
                        layer: layer,
                        loop: true,
                        rangeMult: 2.5,
                        ignoreMinAllowable: true,
                        fallOff: p.config.fallOff,
                        offset: offset
                    });
                }
            } else if (p.soundUpdateThrottle < 0.0) {
                this.audioManager.updateSound(p.soundInstance, "sfx", p.pos, {
                    layer: layer,
                    rangeMult: p.config.soundRangeMult,
                    ignoreMinAllowable: true,
                    fallOff: p.config.fallOff
                });
                p.soundUpdateThrottle = 0.1;
            } else {
                p.soundUpdateThrottle -= dt;
            }

            renderer.addPIXIObj(p.sprite, layer, 1501, p.id);

            var screenPos = camera.pointToScreen(p.pos);
            var screenScale = camera.pixels(p.rad / camera.ppu);

            var activePlayerIndoors = map.insideBuildingCeiling(collider.createCircle(activePlayer.pos, 0.01), true);
            var alphaTarget = p.alpha;
            if (activePlayer.layer == 1) {
                alphaTarget = 0.0;
            } else if (activePlayerIndoors || activePlayer.layer & 0x1) {
                alphaTarget = 0.15;
            }
            p.renderAlpha = math.lerp(dt * 3.0, p.renderAlpha, alphaTarget);

            p.sprite.position.set(screenPos.x, screenPos.y);
            p.sprite.scale.set(screenScale, screenScale);
            p.sprite.tint = 0xffff00;
            p.sprite.alpha = p.renderAlpha;
            p.sprite.visible = true;
        }

        // Update airstrike zones
        for (var _i3 = 0; _i3 < this.m_airstrikeZones.length; _i3++) {
            var zone = this.m_airstrikeZones[_i3];
            if (!zone.active) {
                continue;
            }

            zone.m_update(dt);
        }
    },

    renderAirstrikeZones: function renderAirstrikeZones(uiManager, map, debug) {
        for (var i = 0; i < this.m_airstrikeZones.length; i++) {
            var zone = this.m_airstrikeZones[i];
            if (!zone.active) {
                continue;
            }
            zone.m_render(uiManager, map, debug);
        }
    }
};

module.exports = {
    m_PlaneBarn: m_PlaneBarn
};
