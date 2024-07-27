"use strict";


var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");
var device = require("./device.js");
var ObjectPool = require("./objectPool.js");
var collider = require("./collider.js");

var GameObjectDefs = require("./gameObjectDefs.js");

function Loot() {
    this.ticker = 0.0;
    this.playDropSfx = false;

    this.container = new PIXI.Sprite();
    this.container.anchor.set(0.5, 0.5);
    //this.container.scale.set(1.0, 1.0);

    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    //this.sprite.scale.set(0.8, 0.8);
    this.container.addChild(this.sprite);

    this.emitter = null;
}

Loot.prototype = {
    m_init: function m_init() {
        this.updatedData = false;
    },

    m_free: function m_free() {
        this.container.visible = false;

        if (this.emitter) {
            this.emitter.stop();
            this.emitter = null;
        }
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        this.updatedData = true;
        this.pos = v2.copy(data.pos);

        if (fullUpdate) {
            this.layer = data.layer;
            this.type = data.type;
            this.count = data.count;
            this.isOld = data.isOld;
            this.isPreloadedGun = data.isPreloadedGun;
            this.ownerId = data.hasOwner ? data.ownerId : 0;
        }

        if (isNew) {
            var itemDef = GameObjectDefs[this.type];

            this.ticker = 0.0;

            // Don't play the pop-in effect if this is an old piece of loot
            if (this.isOld) {
                this.ticker = 10.0;
            }

            if (!this.isOld && itemDef.sound.drop && ctx.map.lootDropSfxIds.indexOf(this.__id) == -1) {
                this.playDropSfx = true;
            }

            this.rad = GameConfig.lootRadius[itemDef.type];
            this.imgScale = itemDef.lootImg.scale * 1.0 || 1.4;

            var innerScale = itemDef.lootImg.innerScale || 1.0;
            this.sprite.scale.set(innerScale, innerScale);
            this.sprite.texture = PIXI.Texture.fromImage(itemDef.lootImg.sprite);
            /* this.sprite.tint = itemDef.lootImg.tint;
              this.container.texture = itemDef.lootImg.border ?
                 PIXI.Texture.fromImage(itemDef.lootImg.border) :
                 PIXI.Texture.EMPTY;
             if (this.isPreloadedGun && itemDef.fireMode != 'blaster' ) {
                 this.container.texture = PIXI.Texture.fromImage(
                     'hexagon-frame-border.img'
                 );
             }
             
             if(!itemDef.lootImg.noTint){
                 if (itemDef.lootImg.borderTint) {
                     this.container.tint = itemDef.lootImg.borderTint;
                 } else {
                     this.container.tint = 0xffffff;
                 }
             }*/

            var ammo = GameObjectDefs[itemDef.ammo]; //TODO: Remove
            if (ammo) {
                if (!ammo.lootImg.noTint) {
                    //this.container.tint = ammo.lootImg.tintDark;
                    this.container.tint = 0xFFFFFF;
                } else {
                    //set as transparent for loot images circle with colors
                    this.container.tint = 0xFFFFFF;
                }
            }

            if (itemDef.type == 'xp' && itemDef.emitter) {
                this.emitter = ctx.particleBarn.addEmitter(itemDef.emitter, {
                    pos: this.pos,
                    layer: this.layer
                });
            }

            // Rotate if defined TODO: Remove
            //this.sprite.rotation = itemDef.lootImg.rot ? itemDef.lootImg.rot : 0.0; 

            // Mirror if defined
            //this.sprite.scale.x = itemDef.lootImg.mirror ? -innerScale : innerScale;

            this.container.visible = true;
        }

        if (isNew || fullUpdate) {
            // Loot can change layers during a fullUpdate.
            // Should probably just readd it every frame.
            ctx.renderer.addPIXIObj(this.container, this.layer, 13, this.__id);
        }
    }
};

function m_LootBarn() {
    this.m_lootPool = new ObjectPool.Pool(Loot);
    this.m_closestLoot = null;
}

m_LootBarn.prototype = {
    m_update: function m_update(dt, activePlayer, map, audioManager, camera, debug) {
        this.m_closestLoot = null;
        var closestDist = Number.MAX_VALUE;
        var loots = this.m_lootPool.m_getPool();
        for (var i = 0; i < loots.length; i++) {
            var loot = loots[i];
            if (!loot.active) {
                continue;
            }

            if (util.sameLayer(loot.layer, activePlayer.layer) && !activePlayer.m_netData.m_dead && (loot.ownerId == 0 || loot.ownerId == activePlayer.__id)) {
                var pos = loot.pos;
                var rad = loot.rad; /*device.touch ?
                                    (activePlayer.rad +
                                    loot.rad * GameConfig.player.touchLootRadMult) :
                                    loot.rad;*/
                /* let toPlayer = v2.sub(activePlayer.pos, pos);
                 let distSq = v2.lengthSqr(toPlayer);
                 if (distSq < rad * rad && distSq < closestDist) {
                     closestDist = distSq;
                     this.m_closestLoot = loot;
                 }*/

                var toPlayer = v2.sub(activePlayer.pos, pos);
                var distSq = v2.lengthSqr(toPlayer);
                var intersectLoot = collider.intersectCircle(activePlayer.collider, pos, rad);

                if (intersectLoot && distSq < closestDist) {
                    closestDist = distSq;
                    this.m_closestLoot = loot;
                }
            }

            loot.ticker += dt;

            // Drop sound
            if (loot.playDropSfx) {
                map.lootDropSfxIds.push(loot.__id);
                loot.playDropSfx = false;

                var itemDef = GameObjectDefs[loot.type];
                audioManager.playSound(itemDef.sound.drop, {
                    channel: 'sfx',
                    soundPos: loot.pos,
                    layer: loot.layer,
                    filter: 'muffled'
                });
            }

            // Passive particle effect
            if (loot.emitter) {
                loot.emitter.pos = v2.add(loot.pos, v2.create(0.0, 0.1));
                loot.emitter.layer = loot.layer;
                // loot.emitter.zOrd = loot.renderZOrd + 1;
            }

            /*let scaleIn = math.delerp(loot.ticker, 0.0, 1.0);
            let scale = math.easeOutElastic(scaleIn, 0.75); @TODO: Remove*/
            var screenPos = camera.pointToScreen(loot.pos);
            var screenScale = camera.pixels(loot.imgScale); // * scale);

            loot.container.position.set(screenPos.x, screenPos.y);
            loot.container.scale.set(screenScale, screenScale);
        }
    },

    m_getClosestLoot: function m_getClosestLoot() {
        return this.m_closestLoot;
    }
};

module.exports = {
    m_LootBarn: m_LootBarn
};
