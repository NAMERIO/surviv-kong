"use strict";


var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var collider = require("./collider.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var Bullet = require("./bullet.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");
var ObjectPool = require("./objectPool.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var MapObjectDefs = require("./mapObjectDefs.js");
var GameObject = require("./gameObject.js");

var kGroundSounds = {
    'grass': 'frag_grass',
    'sand': 'frag_sand',
    'water': 'frag_water'
};

function Projectile() {
    this.container = new PIXI.Container();
    this.container.visible = false;

    this.trail = PIXI.Sprite.fromImage('player-bullet-trail-02.img');
    this.trail.anchor.set(1.0, 0.5);
    this.trail.scale.set(1.0, 1.0);
    this.trail.visible = false;
    this.container.addChild(this.trail);

    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.container.addChild(this.sprite);

    this.strobeSprite = null;
    this.mineSprite = null;
    this.imageTrail = this.trail;
    this.animatedSprite = null;
    this.renderer = null;
    this.opacityTimer = 0;
    this.shootSound = false;
}

Projectile.prototype = {
    m_init: function m_init() {},

    m_free: function m_free() {
        this.container.visible = false;
        if (this.strobeSprite) {
            this.strobeSprite.visible = false;
        }

        if (this.mineSprite) {
            this.mineSprite.visible = false;
        }

        if (this.animatedSprite) {
            this.animatedSprite.gotoAndStop(0);
            this.animatedSprite.visible = false;
        }
    },

    createRay: function createRay(lineWidth, color) {
        var segments = 6;
        var customTexture = new PIXI.Graphics();
        customTexture.lineStyle(lineWidth, color);
        var rays = [{ posx: this.pos.x, posy: this.pos.y + 400 }, { posx: this.pos.x, posy: this.pos.y - 400 }, { posx: this.pos.x + 300, posy: this.pos.y + 400 }, { posx: this.pos.x + 300, posy: this.pos.y - 400 }];

        var rays2 = [{ posx: this.pos.x + 400, posy: this.pos.y }, { posx: this.pos.x - 400, posy: this.pos.y }, { posx: this.pos.x + 400, posy: this.pos.y + 250 }, { posx: this.pos.x - 400, posy: this.pos.y + 250 }];

        for (var j = 0; j < rays.length; j++) {
            var baseX = rays[j].posx;
            var baseY = rays[j].posy;
            for (var i = 0; i < segments; i++) {
                var newX = util.random(-60, 60);
                var newY = util.random(25, 45);
                customTexture.moveTo(baseX, baseY);
                //customTexture.lineTo(baseX + newX, baseY + newY);
                baseX = baseX + newX;
                baseY = baseY + newY;
            }
        }

        for (var k = 0; k < rays2.length; k++) {
            var _baseX = rays2[k].posx;
            var _baseY = rays2[k].posy;
            for (var l = 0; l < segments; l++) {
                var _newX = util.random(25, 45);
                var _newY = util.random(-60, 60);
                customTexture.moveTo(_baseX, _baseY);
                //customTexture.lineTo(baseX + newX, baseY + newY);
                _baseX = _baseX + _newX;
                _baseY = _baseY + _newY;
            }
        }

        return customTexture.generateTexture();
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        // Copy data
        if (fullUpdate) {
            var itemDef = GameObjectDefs[data.type];
            this.layer = data.layer;
            this.type = data.type;
            // Use a smaller visual radius for collision effects
            this.rad = itemDef.rad * 0.5;
        }
        this.posOld = isNew ? v2.copy(data.pos) : v2.copy(this.pos);
        this.posZOld = isNew ? data.posZ : this.posZ;
        this.pos = v2.copy(data.pos);
        this.posZ = data.posZ;
        this.dir = v2.copy(data.dir);
        this.bombArmed = data.bombArmed;

        if (data.type == 'lightning') {
            if (this.animatedSprite) {
                if (!this.animatedSprite.visible) {
                    this.animatedSprite.visible = true;
                }
                if (!this.animatedSprite.playing) {
                    this.animatedSprite.play();
                }
            }
        }

        if (isNew) {
            var _itemDef = GameObjectDefs[data.type];
            var imgDef = _itemDef.worldImg;
            var imgDef2 = _itemDef.worldImg.sprite;
            if (_itemDef.worldImg.sprites) {
                imgDef2 = _itemDef.worldImg.sprites[util.randomInt(0, _itemDef.worldImg.sprites.length - 1)];
            }

            this.imgScale = imgDef.scale;
            this.rot = 0.0;
            this.rotVel = _itemDef.throwPhysics.spinVel;
            if (_itemDef.throwPhysics.randomizeSpinDir && Math.random() < 0.5) {
                this.rotVel *= -1.0;
            }
            this.rotDrag = _itemDef.throwPhysics.spinDrag * util.random(1.0, 2.0);
            this.velZ = 0.0;
            this.grounded = false;
            this.inWater = false;
            this.lastSoundObjId = 0;
            this.playHitSfx = !_itemDef.explodeOnImpact;

            this.alwaysRenderOntop = false;
            var isVisible = true;

            // Airstrike-projectile related hacks
            var isAirstrikeProj = this.type == 'bomb_iron';
            if (isAirstrikeProj) {
                this.alwaysRenderOntop = true;

                var col = collider.createCircle(this.pos, 0.5);
                if (ctx.map.insideBuildingCeiling(col, true)) {
                    isVisible = false;
                }
            }

            // Setup sprite
            this.sprite.texture = PIXI.Texture.fromImage(imgDef2);
            this.sprite.tint = imgDef.tint;
            this.sprite.alpha = 1.0;

            this.container.visible = isVisible;

            // Strobe variables
            if (data.type == 'strobe') {
                if (!this.strobeSprite) {
                    this.strobeSprite = new PIXI.Sprite();
                    this.strobeSprite.texture = PIXI.Texture.fromImage('part-strobe-01.img');
                    this.strobeSprite.anchor.set(0.5, 0.5);
                    this.container.addChild(this.strobeSprite);
                }
                this.strobeSprite.scale.set(0.0, 0.0);
                this.strobeSprite.visible = true;
                this.strobeScale = 0.0;
                this.strobeScaleMax = 12.0;
                this.strobeTicker = 0.0;
                this.strobeDir = 1.0;
                this.strobeSpeed = 1.25;
            }

            if (data.type == 'lightning') {
                if (!this.animatedSprite) {
                    var alienImages = ["lightning-1-1.img", "lightning-1-2.img", "lightning-1-3.img", "lightning-1-4.img", "lightning-1-5.img", "lightning-1-6.img", "lightning-1-7.img", "lightning-1-8.img", "lightning-1-9.img", "lightning-1-10.img", "lightning-1-11.img", "lightning-1-12.img", "lightning-1-13.img", "lightning-1-14.img", "lightning-1-15.img", "lightning-1-16.img", "lightning-1-17.img", "lightning-1-18.img", "lightning-1-19.img", "lightning-1-20.img"];
                    var textureArray = [];
                    for (var i = 0; i < alienImages.length; i++) {
                        var texture = PIXI.Texture.fromImage(alienImages[i]);
                        textureArray.push(texture);
                    }
                    this.animatedSprite = new PIXI.extras.AnimatedSprite(textureArray);
                    this.animatedSprite.anchor.set(0.5, 0.5);
                    this.container.addChild(this.animatedSprite);
                    this.animatedSprite.animationSpeed = 0.072;
                    this.animatedSprite.scale.set(1.7, 1.7);
                    this.animatedSprite.visible = true;
                    this.animatedSprite.loop = false;
                    this.animatedSprite.play();
                }
            }

            // Mine variables
            if (data.type == 'mine') {
                if (!this.mineSprite) {
                    this.mineSprite = new PIXI.Sprite();
                    this.mineSprite.texture = PIXI.Texture.fromImage('part-strobe-01.img');
                    this.mineSprite.tint = 0xFF0000;
                    this.mineSprite.anchor.set(0.5, 0.5);
                    this.container.addChild(this.mineSprite);
                }
                this.mineSprite.scale.set(0.0, 0.0);
                this.mineSprite.visible = true;
                this.mineScale = 0.0;
                this.mineScaleMax = 1.5;
                this.mineTicker = 0.0;
                this.mineDir = 1.0;
                this.mineSpeed = 1.25;
            }

            if (_itemDef.trail) {
                if (_itemDef.trail.sprite) {
                    var newTrail = PIXI.Sprite.fromImage(_itemDef.trail.sprite);
                    newTrail.anchor.set(1.0, 0.5);
                    newTrail.scale.set(1.0, 1.0);
                    newTrail.visible = false;
                    this.container.removeChild(this.trail);
                    this.trail = newTrail;
                    this.container.addChild(this.trail);
                } else if (this.trail !== this.imageTrail) {
                    this.container.removeChild(this.trail);
                    this.trail = this.imageTrail;
                    this.container.addChild(this.trail);
                }
            }
        }
    }
};

function m_ProjectileBarn() {
    this.m_projectilePool = new ObjectPool.Pool(Projectile);
}

m_ProjectileBarn.prototype = {
    m_update: function m_update(dt, particleBarn, audioManager, activePlayer, map, renderer, camera) {
        var projectiles = this.m_projectilePool.m_getPool();
        for (var i = 0; i < projectiles.length; i++) {
            var p = projectiles[i];
            if (!p.active) {
                p.opacityTimer = 0.0;
                p.shootSound = false;
                continue;
            }

            var itemDef = GameObjectDefs[p.type];

            var rotDrag = p.rotDrag;
            if (p.inWater) {
                rotDrag *= 3.0;
            }
            p.rotVel *= 1.0 / (1.0 + dt * rotDrag);
            p.rot += p.rotVel * dt;

            // Detect overlapping obstacles for sound effects
            var wallCol = { obj: null, pen: 0.0 };
            var groundCol = { obj: null, pen: 0.0 };
            var projCollider = collider.createCircle(p.pos, p.rad);
            var obstacles = map.m_obstaclePool.m_getPool();
            for (var j = 0; j < obstacles.length; j++) {
                var o = obstacles[j];
                if (!o.active || o.dead || !util.sameLayer(o.layer, p.layer)) {
                    continue;
                }
                var res = collider.intersect(o.collider, projCollider);
                if (!res) {
                    continue;
                }

                var col = o.height > p.posZ ? wallCol : groundCol;
                if (res.pen > col.pen && (!col.obj || col.obj.height <= o.height)) {
                    col.obj = o;
                    col.pen = res.pen;
                }
            }

            var npcs = map.m_npcPool.m_getPool();
            for (var k = 0; k < npcs.length; k++) {
                var _o = npcs[k];
                if (!_o.active || _o.dead || !util.sameLayer(_o.layer, p.layer)) {
                    continue;
                }
                if (!_o.collider) {
                    continue;
                }

                var _res = collider.intersect(_o.collider, projCollider);
                if (!_res) {
                    continue;
                }

                var _col = _o.height > p.posZ ? wallCol : groundCol;
                if (_res.pen > _col.pen && (!_col.obj || _col.obj.height <= _o.height)) {
                    _col.obj = _o;
                    _col.pen = _res.pen;
                }
            }

            // Wall sound
            var vel = v2.div(v2.sub(p.pos, p.posOld), dt);
            var speed = v2.length(vel);
            if (wallCol.obj && wallCol.obj.__type != GameObject.Type.Npc && wallCol.obj.__id != p.lastSoundObjId && speed > 7.5) {
                p.lastSoundObjId = wallCol.obj.__id;

                if (p.playHitSfx) {
                    var dir = v2.mul(v2.normalizeSafe(vel, v2.create(1.0, 0.0)), -1.0);
                    var mapDef = MapObjectDefs[wallCol.obj.type];
                    Bullet.playHitFx(mapDef.hitParticle, mapDef.sound.bullet, p.pos, dir, p.layer, particleBarn, audioManager);
                }
            }

            var surface = map.getGroundSurface(p.pos, p.layer);
            // Play an effect on initial ground contact
            if (p.posZ <= 0.01) {
                if (!p.inWater && surface.type == 'water' && !map.snowMode) {
                    particleBarn.addRippleParticle(p.pos, p.layer, surface.data.rippleColor);
                }
                p.inWater = surface.type == 'water' && !map.snowMode;
            }

            var velZOld = p.velZ;
            p.velZ = (p.posZ - p.posZOld) / dt;

            if (p.type == "motherShip_cannon_shot" && !p.shootSound) {

                audioManager.playSound('mothership_shoot_01', {
                    channel: "sfx",
                    soundPos: p.pos,
                    layer: p.layer,
                    rangeMult: 1.75
                });

                p.shootSound = true;
            }

            // Ground sound
            if (!p.isNew && !p.grounded && p.velZ >= 0.0 && velZOld < 0.0) {
                // @HACK: there are two different functions for playing
                // sounds, and we have to know which one to call for
                // particular sound names. Same with the channel.
                var sound = {
                    fn: 'playGroup',
                    channel: 'hits',
                    name: ''
                };

                if (!groundCol.obj) {
                    p.grounded = true;
                    sound.name = kGroundSounds[surface.type];
                    if (p.type == 'lightning') {
                        sound.name = 'static_01';
                    }

                    // @HACK: Attept to use a footstep sound if we failed
                    // finding a surface
                    if (sound.name === undefined) {
                        sound.name = 'footstep_' + surface.type;
                        sound.fn = 'playGroup', sound.channel = 'sfx';
                    }
                } else if (p.lastSoundObjId != groundCol.obj.__id) {
                    p.lastSoundObjId = groundCol.obj.__id;

                    var def = MapObjectDefs[groundCol.obj.type];
                    sound.name = def.sound.bullet;
                }

                if (sound.name && p.playHitSfx) {
                    audioManager[sound.fn](sound.name, {
                        channel: sound.channel,
                        soundPos: p.pos,
                        layer: p.layer,
                        filter: 'muffled'
                    });
                }
            }

            // Strobe effects
            if (p.type == 'strobe' && p.strobeSprite) {
                p.strobeTicker = math.clamp(p.strobeTicker + dt * p.strobeDir * p.strobeSpeed, 0.0, 1.0);
                p.strobeScale = math.easeInExpo(p.strobeTicker) * p.strobeScaleMax;
                p.strobeSprite.scale.set(p.strobeScale, p.strobeScale);
                if (p.strobeScale >= p.strobeScaleMax || p.strobeTicker <= 0.0) {
                    p.strobeDir *= -1.0;
                }
            }

            // Mine effects
            if (p.type == 'mine' && p.mineSprite) {
                p.mineTicker = math.clamp(p.mineTicker + dt * p.mineDir * p.mineSpeed, 0.0, 1.0);
                p.mineScale;
                if (!p.bombArmed) {
                    p.mineScale = math.easeInExpo(p.mineTicker) * p.mineScaleMax;
                } else {
                    p.mineScale = p.mineScaleMax / 2;
                }
                p.mineSprite.scale.set(p.mineScale, p.mineScale);
                if (p.mineScale >= p.mineScaleMax || p.mineTicker <= 0.0) {
                    p.mineDir *= -1.0;
                }
            }

            p.sprite.rotation = p.rot;
            p.sprite.alpha = p.inWater ? 0.3 : 1.0;

            if (p.type == 'lightning') {
                p.sprite.alpha = 1.0;
            }

            // Trail
            if (itemDef.trail) {
                var _speed = v2.length(vel);
                var trailT = math.remap(_speed, itemDef.throwPhysics.speed * 0.25, itemDef.throwPhysics.speed * 1.0, 0.0, 1.0) * math.remap(p.posZ, 0.1, GameConfig.projectile.maxHeight * 0.5, 0.0, 1.0);
                p.trail.scale.set(itemDef.trail.maxLength * trailT, itemDef.trail.width);
                p.trail.rotation = -Math.atan2(p.dir.y, p.dir.x);
                p.trail.tint = itemDef.trail.tint;
                p.trail.alpha = itemDef.trail.alpha * trailT;
                p.trail.visible = true;
            } else {
                p.trail.visible = false;
            }

            var layer = p.layer;
            var zOrd = p.posZ < 0.25 ? 14 : 25;
            var stairCollider = collider.createCircle(p.pos, p.rad * 3.0);
            var onStairs = map.insideStructureStairs(stairCollider);
            var onMask = map.insideStructureMask(stairCollider);
            if (p.posZ >= 0.25 && onStairs && (p.layer & 0x1) == (activePlayer.layer & 0x1) && (!onMask || !(activePlayer.layer & 0x2))) {
                layer |= 0x2;
                zOrd += 100;
            }
            if (p.alwaysRenderOntop && activePlayer.layer == 0) {
                zOrd = 1000;
                layer |= 0x2;
            }
            renderer.addPIXIObj(p.container, layer, zOrd);

            var scale = p.imgScale * math.remap(p.posZ, 0.0, GameConfig.projectile.maxHeight, 1.0, 4.75);

            var screenPos = camera.pointToScreen(p.pos);
            var screenScale = camera.pixels(scale);

            p.container.position.set(screenPos.x, screenPos.y);
            p.container.scale.set(screenScale, screenScale);
        }
    }
};

module.exports = {
    m_ProjectileBarn: m_ProjectileBarn
};

