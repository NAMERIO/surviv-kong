"use strict";


var PIXI = require("./pixi.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");
var GameConfig = require("./gameConfig.js");

var MapObjectDefs = require("./mapObjectDefs.js");

//
// Obstacle
//
function Obstacle() {
    this.sprite = new PIXI.Sprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.visible = false;
}

Obstacle.prototype = {
    m_init: function m_init() {
        this.isNew = false;
        this.smokeEmitter = null;
        this.sprite.visible = false;
        this.img = '';
        this.burnMark = null;
        this.markLife = 0.0;
    },

    m_free: function m_free() {
        this.sprite.visible = false;
        if (this.sprite.parent) {
            this.sprite.parent.removeChild(this.sprite);
        }
        if (this.door && this.door.casingSprite) {
            this.door.casingSprite.destroy();
            this.door.casingSprite = null;
        }
        if (this.smokeEmitter) {
            this.smokeEmitter.stop();
            this.smokeEmitter = null;
        }
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        if (fullUpdate) {
            this.type = data.type;
            this.obstacleType = data.obstacleType;
            this.layer = data.layer;
            this.healthT = data.healthT;
            this.dead = data.dead;
            this.isSkin = data.isSkin;
            if (this.isSkin) {
                this.skinPlayerId = data.skinPlayerId;
            }
            this.teamId = data.teamId;
        }

        var def = MapObjectDefs[this.type];
        this.pos = v2.copy(data.pos);
        this.rot = math.oriToRad(data.ori);
        this.scale = data.scale;

        if (!def || !def.img) {
            console.log("Image error");
            console.log(def);
        }
        this.imgScale = def.img.scale;
        this.imgMirrorY = def.img.mirrorY;
        this.imgMirrorX = def.img.mirrorX;
        this.collider = collider.transform(def.collision, this.pos, this.rot, this.scale);

        if (isNew) {
            this.isNew = true;
            this.exploded = ctx.map.deadObstacleIds.indexOf(this.__id) != -1;
            this.explodeParticle = def.explodeParticle;
            this.collidable = def.collidable && !this.isSkin;
            this.attackCollidable = def.attackCollidable;
            this.destructible = def.destructible;
            this.height = def.height;
            this.isWall = !!def.isWall;
            this.isWindow = !!def.isWindow;
            this.isBush = !!def.isBush;

            this.isDoor = def.door !== undefined;
            if (this.isDoor) {
                this.door = {
                    openOneWay: def.door.openOneWay,
                    closedPos: v2.copy(data.pos),
                    autoOpen: def.door.autoOpen,
                    interactionRad: def.door.interactionRad,
                    interpSpeed: def.door.openSpeed,
                    interpPos: v2.copy(data.pos),
                    interpRot: math.oriToRad(data.ori),
                    seq: data.door.seq,
                    seqOld: data.door.seq,
                    open: data.door.open,
                    wasOpen: data.door.open,
                    locked: data.door.locked,
                    casingSprite: null
                };

                var casingImgDef = def.door.casingImg;
                if (casingImgDef !== undefined) {
                    var posOffset = casingImgDef.pos || v2.create(0.0, 0.0);
                    posOffset = v2.rotate(posOffset, this.rot + Math.PI * 0.5);

                    var sprite = new PIXI.Sprite();
                    sprite.texture = PIXI.Texture.fromImage(casingImgDef.sprite);
                    sprite.anchor.set(0.5, 0.5);
                    sprite.posOffset = posOffset;
                    sprite.imgScale = casingImgDef.scale;
                    sprite.tint = casingImgDef.tint;
                    sprite.alpha = casingImgDef.alpha;
                    sprite.visible = true;
                    this.door.casingSprite = sprite;
                }
            }

            this.isButton = def.button !== undefined;
            if (this.isButton) {
                this.button = {
                    interactionRad: def.button.interactionRad,
                    interactionText: def.button.interactionText || 'game-use',
                    seq: data.button.seq,
                    seqOld: data.button.seq
                };
            }

            this.isPuzzlePiece = data.isPuzzlePiece;
            this.parentBuildingId = this.isPuzzlePiece ? data.parentBuildingId : 0;
        }

        if (this.isDoor && fullUpdate) {
            this.door.canUse = data.door.canUse;
            this.door.open = data.door.open;
            this.door.seq = data.door.seq;

            // Store closed position for casingImg positioning
            var slideOffset = v2.rotate(v2.create(def.door.slideOffset, 0.0), this.rot + Math.PI * 0.5);
            this.door.closedPos = data.door.open ? v2.add(data.pos, slideOffset) : v2.copy(data.pos);
        }

        if (this.isButton && fullUpdate) {
            this.button.onOff = data.button.onOff;
            this.button.canUse = data.button.canUse;
            this.button.seq = data.button.seq;
        }

        // Setup smoke emitter
        if (def.explosion !== undefined && !this.smokeEmitter && data.healthT < 0.5 && !data.dead) {
            var dir = v2.normalize(v2.create(1.0, 1.0));
            this.smokeEmitter = ctx.particleBarn.addEmitter('smoke_barrel', {
                pos: this.pos,
                dir: dir,
                layer: this.layer
            });
        }

        // Setup sprite
        var imgTintSet = false;

        var img = this.dead ? def.img.residue : def.img.sprite;
        if (this.isButton && this.button.onOff && !this.dead && def.button.useImg) {
            img = def.button.useImg;
        } else if (this.isButton && !this.button.canUse && def.button.offImg) {
            img = def.button.offImg;
        }
        if (img != this.img) {
            var anchor = v2.create(0.5, 0.5);
            if (this.isDoor) {
                anchor = def.door.spriteAnchor;
            }

            var imgValid = img !== undefined;
            if (!imgValid && this.sprite.parent) {
                this.sprite.parent.removeChild(this.sprite);
            }
            if (imgValid) {
                this.sprite.texture = img == 'none' ? PIXI.Texture.EMPTY : PIXI.Texture.fromImage(img);
                this.sprite.anchor.set(anchor.x, anchor.y);
                if (this.teamId != 0) {
                    var teamIdx = this.teamId - 1;
                    var teamTint = GameConfig.teamColors[teamIdx];
                    this.sprite.tint = teamTint;
                } else {
                    this.sprite.tint = def.img.tint;
                }
                this.sprite.imgAlpha = def.img.alpha;
                this.sprite.zOrd = def.img.zIdx;
                this.sprite.zIdx = Math.floor(this.scale * 1000) * 65535 + this.__id;
                this.sprite.alpha = this.sprite.imgAlpha;

                imgTintSet = true;
            }
            this.sprite.visible = imgValid;

            this.img = img;
        }

        var valueAdjust = ctx.map.getMapDef().biome.valueAdjust;
        if (imgTintSet && valueAdjust < 1.0) {
            this.sprite.tint = util.adjustValue(this.sprite.tint, valueAdjust);
        }
    },

    getInteraction: function getInteraction() {
        if (this.isButton && this.button.canUse) {
            return {
                rad: this.button.interactionRad,
                action: this.button.interactionText,
                object: 'game-' + this.type
            };
        } else if (this.isDoor && this.door.canUse && !this.door.autoOpen) {
            return {
                rad: this.door.interactionRad,
                action: this.door.open ? 'game-close-door' : 'game-open-door',
                object: ''
            };
        }
        return null;
    },

    addBurnMark: function addBurnMark(playerPos) {
        if (!this.burnMark) {
            this.markLife = 0.5;
            var distX = -(this.pos.x - playerPos.x) * 10;
            var distY = (this.pos.y - playerPos.y) * 10;
            var xpos = this.sprite.width / 2 - 4;
            var ypos = this.sprite.height / 2 - 4;

            var rot = 0;
            if (distX < 0 && distY < 0 || distX > 0 && distY > 0) {
                rot = Math.random() * (3 - 2.1) + 2.1;
            } else if (distX < 0 && distY > 0 || distX > 0 && distY < 0) {
                rot = Math.random() * (7 - +6) + 6;
            }
            var sprites = ['laser-burnt-02.img', 'laser-burnt-01.img', 'laser-burnt-03.img'];
            var img = sprites[Math.floor(Math.random() * 3)];
            var sprite = new PIXI.Sprite();
            sprite.texture = PIXI.Texture.fromImage(img);
            sprite.anchor.set(0.5, 0.5);
            sprite.position.set(distX, distY);
            sprite.rotation = rot;
            this.burnMark = sprite;
            this.sprite.addChildAt(sprite, 0);
        }
    },

    m_update: function m_update(dt, map, playerBarn, particleBarn, audioManager, activePlayer, renderer) {
        if (this.burnMark != null && this.markLife > 0.0) {
            this.markLife -= dt;
            this.burnMark.alpha -= 0.05;
        } else if (this.burnMark != null && this.markLife < 0.0) {
            this.sprite.removeChild(this.burnMark);
            this.burnMark.destroy();
            this.burnMark = null;
        }

        if (this.type == 'cloud_01' || this.type == 'cloud_02' || this.type == 'cloud_03' || this.type == 'cloud_04') {
            if (activePlayer.m_netData.m_playerIndoors) {
                this.sprite.visible = false;
            } else {
                this.sprite.visible = true;
            }
        }

        // Button
        if (this.isButton) {
            var button = this.button;
            if (button.seq != button.seqOld) {
                var def = MapObjectDefs[this.type];
                if (def.button.useParticle) {
                    var aabb = collider.toAabb(this.collider);
                    var extent = v2.mul(v2.sub(aabb.max, aabb.min), 0.5);
                    var center = v2.add(aabb.min, extent);
                    var vel = v2.mul(v2.randomUnit(), util.random(5, 15));
                    particleBarn.addParticle(def.button.useParticle, this.layer, center, vel);
                }
                var sound = this.button.onOff ? def.button.sound.on : def.button.sound.off;
                if (sound) {
                    audioManager.playSound(sound, {
                        channel: 'sfx',
                        soundPos: this.pos,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                }
            }
            button.seqOld = button.seq;
        }

        // Door
        if (this.isDoor) {
            var door = this.door;

            // Interpolate position
            var moveSpd = door.interpSpeed;
            var posDiff = v2.sub(this.pos, door.interpPos);
            var diffLen = v2.length(posDiff);
            var posMove = moveSpd * dt;
            if (diffLen < posMove) {
                posMove = diffLen;
            }
            var moveDir = diffLen > 0.0001 ? v2.div(posDiff, diffLen) : v2.create(1.0, 0.0);
            door.interpPos = v2.add(door.interpPos, v2.mul(moveDir, posMove));

            // Interpolate rotation
            var rotSpd = Math.PI * door.interpSpeed;
            var angDiff = math.angleDiff(door.interpRot, this.rot);
            var angMove = math.sign(angDiff) * rotSpd * dt;
            if (Math.abs(angDiff) < Math.abs(angMove)) {
                angMove = angDiff;
            }
            door.interpRot += angMove;

            // Door begin state change sound
            if (door.seq != door.seqOld) {
                var _def = MapObjectDefs[this.type];
                var _sound = _def.door.sound.change || '';
                if (_sound != '') {
                    audioManager.playSound(_sound, {
                        channel: 'sfx',
                        soundPos: this.pos,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                }

                door.seqOld = door.seq;
            }

            // Open/close sounds
            if (door.open != door.wasOpen) {
                var _def2 = MapObjectDefs[this.type];
                var _sound2 = door.open ? _def2.door.sound.open : _def2.door.sound.close;
                audioManager.playSound(_sound2, {
                    channel: 'sfx',
                    soundPos: this.pos,
                    layer: this.layer,
                    filter: 'muffled'
                });

                door.wasOpen = door.open;
            }
        }

        if (this.dead && !this.exploded) {
            map.deadObstacleIds.push(this.__id);
            this.exploded = true;

            if (this.smokeEmitter) {
                this.smokeEmitter.stop();
                this.smokeEmitter = null;
            }

            if (!this.isNew) {
                var _def3 = MapObjectDefs[this.type];

                // Destroy effect
                var _aabb = collider.toAabb(this.collider);
                var _extent = v2.mul(v2.sub(_aabb.max, _aabb.min), 0.5);
                var _center = v2.add(_aabb.min, _extent);

                var numParticles = Math.floor(util.random(5, 11));
                for (var i = 0; i < numParticles; i++) {
                    var _vel = v2.mul(v2.randomUnit(), util.random(5, 15));
                    var particle = Array.isArray(this.explodeParticle) ? this.explodeParticle[Math.floor(Math.random() * this.explodeParticle.length)] : this.explodeParticle;
                    particleBarn.addParticle(particle, this.layer, _center, _vel);
                }
                audioManager.playSound(_def3.sound.explode, {
                    channel: 'sfx',
                    soundPos: _center,
                    layer: this.layer,
                    filter: 'muffled'
                });
            }
        }

        // Darken walls based on health
        /*
        if (this.isWall && this.destructible) {
            let v = math.lerp(this.healthT, 0.6, 1.0);
            this.sprite.tint = util.rgbToInt(
                util.hsvToRgb(0x000000, 0.0, v)
            );
        }
        */

        if (this.smokeEmitter) {
            var healthT = this.isSkin ? 0.3 : 0.5;

            this.smokeEmitter.pos = v2.copy(this.pos);
            this.smokeEmitter.enabled = !this.dead && this.healthT < healthT;
        }

        if (this.sprite.visible && this.img) {
            var zOrd = this.dead ? 5 : this.sprite.zOrd;
            var zIdx = this.sprite.zIdx;
            var layer = this.layer;
            // Render trees, bushes, etc above stair elements when
            // viewing only the ground level
            if (!this.dead && zOrd >= 50 && this.layer == 0 && activePlayer.layer == 0) {
                zOrd += 100;
                layer |= 0x2;
            }

            // Render above the skinned player
            /*if (!this.dead && this.isSkin) {
                let skinPlayer = playerBarn.m_getPlayerById(this.skinPlayerId);
                if (skinPlayer) {
                    zOrd = math.max(
                        math.max(zOrd, skinPlayer.renderZOrd), 21
                    );
                    if (skinPlayer.renderLayer != 0) {
                        layer = skinPlayer.renderLayer;
                        zOrd = skinPlayer.renderZOrd;
                    }
                    zIdx = skinPlayer.renderZIdx + 4 * 65536;
                }
            }*/

            renderer.addPIXIObj(this.sprite, layer, zOrd, zIdx);

            if (this.isDoor && this.door.casingSprite) {
                renderer.addPIXIObj(this.door.casingSprite, layer, zOrd + 1, zIdx);
            }
        }

        this.isNew = false;
    },

    render: function render(camera, debug, layer) {
        var pos = this.isDoor ? this.door.interpPos : this.pos;
        var rot = this.isDoor ? this.door.interpRot : this.rot;
        var scale = this.scale;

        var screenPos = camera.pointToScreen(pos);
        var screenScale = camera.pixels(scale * this.imgScale);

        this.sprite.position.set(screenPos.x, screenPos.y);
        this.sprite.scale.set(screenScale, screenScale);
        if (this.imgMirrorY) {
            this.sprite.scale.y *= -1.0;
        }
        if (this.imgMirrorX) {
            this.sprite.scale.x *= -1.0;
        }
        this.sprite.rotation = -rot;

        if (this.isDoor && this.door.casingSprite) {
            var casingPos = camera.pointToScreen(v2.add(this.door.closedPos, this.door.casingSprite.posOffset));
            var casingScale = camera.pixels(scale * this.door.casingSprite.imgScale);
            this.door.casingSprite.position.set(casingPos.x, casingPos.y);
            this.door.casingSprite.scale.set(casingScale, casingScale);
            this.door.casingSprite.rotation = -rot;
            this.door.casingSprite.visible = !this.dead;
        }
    }
};

module.exports = Obstacle;
