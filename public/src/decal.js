"use strict";


var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var math = require("./math.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");
var device = require("./device.js");
var ObjectPool = require("./objectPool.js");
var util = require("./util.js");

var MapObjectDefs = require("./mapObjectDefs.js");

//
// Helpers
//
function lerpColor(t, a, b) {
    // util.lerpColor is relatively expensive; avoid if it possible
    return t == 0.0 ? a : t == 1.0 ? b : util.lerpColor(t, a, b);
}

//
// Decal
//
function Decal() {
    this.decalRender = null;
}

Decal.prototype = {
    m_init: function m_init() {
        this.isNew = false;
        this.goreT = 0.0;
    },

    m_free: function m_free() {
        if (this.decalRender) {
            this.decalRender.m_free();
            this.decalRender = null;
        }
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        if (fullUpdate) {
            var def = MapObjectDefs[data.type];

            // Copy data
            this.type = data.type;
            this.pos = v2.copy(data.pos);
            this.rot = math.oriToRad(data.ori);
            this.scale = data.scale;
            this.layer = data.layer;
            this.goreKills = data.goreKills;
            this.collider = collider.transform(def.collision, this.pos, this.rot, this.scale);
            this.surface = def.surface ? util.cloneDeep(def.surface) : null;
            this.hasGore = def.gore !== undefined;

            // Setup render
            // The separate DecalRender object lets decals fade out
            // over time after the underlying GameObject has been deleted.
            this.isNew = isNew;
            if (this.isNew) {
                this.decalRender = ctx.decalBarn.allocDecalRender();
                this.decalRender.m_init(this, ctx.map, ctx.renderer);
            }
        }
    },

    m_update: function m_update(dt, map) {
        if (this.hasGore) {
            var def = MapObjectDefs[this.type];

            var goreTarget = math.delerp(this.goreKills, def.gore.fade.start, def.gore.fade.end);
            goreTarget = Math.pow(goreTarget, def.gore.fade.pow);

            this.goreT = this.isNew ? goreTarget : math.lerp(dt * def.gore.fade.speed, this.goreT, goreTarget);

            // Adjust properties based on the gore level
            if (def.gore.tint !== undefined) {
                var tint = lerpColor(this.goreT, def.img.tint, def.gore.tint);
                this.decalRender.setTint(tint);
            }
            if (def.gore.alpha !== undefined) {
                this.decalRender.spriteAlpha = math.lerp(this.goreT, def.img.alpha, def.gore.alpha);
            }
            if (def.gore.waterColor !== undefined && this.surface) {
                this.surface.data.waterColor = lerpColor(this.goreT, def.surface.data.waterColor, def.gore.waterColor);
            }
            if (def.gore.rippleColor !== undefined && this.surface) {
                this.surface.data.rippleColor = lerpColor(this.goreT, def.surface.data.rippleColor, def.gore.rippleColor);
            }
        }

        this.isNew = false;
    }
};

//
// DecalRender
//
function DecalRender() {
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;
}

DecalRender.prototype = {
    m_init: function m_init(decal, map, renderer) {
        var def = MapObjectDefs[decal.type];

        this.pos = v2.copy(decal.pos);
        this.rot = decal.rot;
        this.scale = decal.scale;
        this.layer = decal.layer;
        this.zIdx = def.img.zIdx;
        this.zOrd = decal.__id;

        var imgDef = def.img;
        this.sprite.texture = PIXI.Texture.fromImage(imgDef.sprite);
        this.sprite.alpha = 1.0;
        this.sprite.visible = true;

        this.imgScale = def.img.scale;
        this.spriteAlpha = imgDef.alpha;
        this.valueAdjust = imgDef.ignoreAdjust ? 1.0 : map.getMapDef().biome.valueAdjust;
        this.setTint(imgDef.tint);

        this.inWater = false;
        if (def.height < 0.25) {
            var surface = map.getGroundSurface(decal.pos, decal.layer);
            this.inWater = surface.type == 'water' && !map.snowMode;
        }

        this.flicker = def.img.flicker;
        if (this.flicker) {
            this.flickerMin = def.img.flickerMin;
            this.flickerMax = def.img.flickerMax;
            this.flickerTarget = this.imgScale;
            this.flickerRate = def.img.flickerRate;
            this.flickerCooldown = 0.0;
        }

        this.active = true;
        this.deactivated = false;
        this.fadeout = def.lifetime !== undefined;
        this.fadeAlpha = 1.0;
    },

    m_free: function m_free() {
        this.deactivated = true;
    },

    setTint: function setTint(color) {
        if (this.valueAdjust < 1.0) {
            color = util.adjustValue(color, this.valueAdjust);
        }
        this.sprite.tint = color;
    },

    m_update: function m_update(dt, camera, renderer) {
        if (this.deactivated && this.fadeout) {
            this.fadeAlpha = math.lerp(3.0 * dt, this.fadeAlpha, 0.0);
            if (this.fadeAlpha < 0.01) {
                this.fadeAlpha = 0.0;
            }
        }
        if (this.deactivated && (!this.fadeout || math.eqAbs(this.fadeAlpha, 0.0))) {
            this.sprite.visible = false;
            this.active = false;
        }

        if (this.flicker) {
            if (this.flickerCooldown < 0.0) {
                this.flickerTarget = util.random(this.flickerMin, this.flickerMax);
                this.flickerCooldown = util.random(0.05, this.flickerRate);
            } else {
                // Lerp towards the last target flicker
                this.imgScale = math.lerp(this.flickerRate - this.flickerCooldown, this.imgScale, this.flickerTarget);
                this.flickerCooldown -= dt;
            }
        }

        var screenPos = camera.pointToScreen(this.pos);
        var screenScale = camera.pixels(this.scale * this.imgScale);
        this.sprite.position.set(screenPos.x, screenPos.y);
        this.sprite.scale.set(screenScale, screenScale);
        this.sprite.rotation = -this.rot;
        this.sprite.alpha = this.spriteAlpha * (this.inWater ? 0.3 : 1.0) * this.fadeAlpha;

        renderer.addPIXIObj(this.sprite, this.layer, this.zIdx, this.zOrd);
    }
};

//
// DecalBarn
//
function m_DecalBarn() {
    this.m_decalPool = new ObjectPool.Pool(Decal);
    this.decalRenders = [];
}

m_DecalBarn.prototype = {
    allocDecalRender: function allocDecalRender() {
        var decalRender = null;
        for (var i = 0; i < this.decalRenders.length; i++) {
            var d = this.decalRenders[i];
            if (!d.active) {
                decalRender = d;
                break;
            }
        }
        if (!decalRender) {
            decalRender = new DecalRender();
            this.decalRenders.push(decalRender);
        }
        return decalRender;
    },

    m_update: function m_update(dt, camera, renderer) {
        var decals = this.m_decalPool.m_getPool();
        for (var i = 0; i < decals.length; i++) {
            var decal = decals[i];
            if (!decal.active) {
                continue;
            }

            decal.m_update(dt);
        }

        for (var _i = 0; _i < this.decalRenders.length; _i++) {
            var decalRender = this.decalRenders[_i];
            if (!decalRender.active) {
                continue;
            }

            decalRender.m_update(dt, camera, renderer);
        }
    },

    render: function render(camera, debug, layer) {}
};

module.exports = {
    m_DecalBarn: m_DecalBarn
};
