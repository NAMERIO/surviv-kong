"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require("./0e566746.js");
var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var math = require("./math.js");
var mapHelpers = require("./mapHelpers.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var collisionHelpers = require("./collisionHelpers.js");
var debugHelpers = require("./debugHelpers.js");
var DebugLines = require("./debugLines.js");

var MapObjectDefs = require("./mapObjectDefs.js");

//
// Helpers
//
function step(cur, target, rate) {
    var delta = target - cur;
    var step = delta * rate;
    return Math.abs(step) < 0.001 ? delta : step;
}

//
// Building
//
function Building() {
    this.sprites = [];
    this.particleEmitters = [];
    this.soundEmitters = [];
}

Building.prototype = {
    m_init: function m_init() {
        this.isNew = false;
        this.residue = null;
        this.ceilingDead = false;
        this.ceilingDamaged = false;
        this.playedCeilingDeadFx = false;
        this.playedSolvedPuzzleFx = false;
        this.hasPuzzle = false;
        this.puzzleErrSeqModified = false;
        this.puzzleErrSeq = 0;
        this.puzzleSolved = false;
        this.soundEmitterTicker = 0.0;
    },

    m_free: function m_free() {
        for (var i = 0; i < this.sprites.length; i++) {
            var s = this.sprites[i];
            s.active = false;
            s.sprite.visible = false;
            // Necessary because residue sprites attach themselves
            // as children of the building floor sprite
            if (s.sprite.parent) {
                s.sprite.parent.removeChild(s.sprite);
            }
            // Particles could attach themselves to our sprites and
            // be reused unintentionally by the next building
            s.sprite.removeChildren();
        }
        for (var _i = 0; _i < this.particleEmitters.length; _i++) {
            this.particleEmitters[_i].stop();
        }
        this.particleEmitters = [];
        for (var _i2 = 0; _i2 < this.soundEmitters.length; _i2++) {
            if (this.soundEmitters[_i2].instance) {
                this.soundEmitters[_i2].instance.stop();
            }
        }
        this.soundEmitters = [];
    },

    allocSprite: function allocSprite() {
        for (var i = 0; i < this.sprites.length; i++) {
            var s = this.sprites[i];
            if (!s.active) {
                s.active = true;
                return s.sprite;
            }
        }
        var sprite = new PIXI.Sprite();
        sprite.anchor.set(0.5, 0.5);
        this.sprites.push({
            active: true,
            sprite: sprite
        });
        return sprite;
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        var _this = this;

        if (fullUpdate) {
            this.type = data.type;
            this.pos = v2.copy(data.pos);
            this.ori = data.ori;
            this.rot = math.oriToRad(data.ori);
            this.scale = 1.0;
            this.layer = data.layer;
        }
        this.ceilingDead = data.ceilingDead;
        this.ceilingDamaged = data.ceilingDamaged;
        this.occupied = data.occupied;
        this.hasPuzzle = data.hasPuzzle;

        if (this.hasPuzzle) {
            this.puzzleErrSeqModified = data.puzzleErrSeq != this.puzzleErrSeq;
            this.puzzleSolved = data.puzzleSolved;
            this.puzzleErrSeq = data.puzzleErrSeq;
        }

        var def = MapObjectDefs[this.type];

        if (isNew) {
            this.isNew = true;

            this.playedCeilingDeadFx = def.ceiling.destroy !== undefined && ctx.map.deadCeilingIds.indexOf(this.__id) != -1;

            this.playedSolvedPuzzleFx = this.hasPuzzle && ctx.map.solvedPuzzleIds.indexOf(this.__id) != -1;

            var createSpriteFromDef = function createSpriteFromDef(imgDef) {
                var posOffset = imgDef.pos || v2.create(0.0, 0.0);
                var rotOffset = math.oriToRad(imgDef.rot || 0.0);
                var sprite = _this.allocSprite();
                sprite.texture = PIXI.Texture.fromImage(imgDef.sprite);
                sprite.tint = imgDef.tint;

                var valueAdjust = ctx.map.getMapDef().biome.valueAdjust;
                if (valueAdjust < 1.0) {
                    sprite.tint = util.adjustValue(sprite.tint, valueAdjust);
                }

                sprite.posOffset = v2.rotate(posOffset, _this.rot);
                sprite.rotOffset = rotOffset;
                sprite.imgAlpha = imgDef.alpha;
                sprite.alpha = sprite.imgAlpha;
                sprite.defScale = imgDef.scale;
                sprite.mirrorY = !!imgDef.mirrorY;
                sprite.mirrorX = !!imgDef.mirrorX;
                sprite.visible = true;
                return sprite;
            };

            this.bounds = collider.transform(mapHelpers.getBoundingCollider(this.type), this.pos, this.rot, this.scale);

            this.zIdx = def.zIdx || 0;

            // Create floor surfaces
            this.surfaces = [];
            for (var i = 0; i < def.floor.surfaces.length; i++) {
                var surfaceDef = def.floor.surfaces[i];
                var surface = {
                    type: surfaceDef.type,
                    data: surfaceDef.data || {},
                    colliders: []
                };
                for (var _i3 = 0; _i3 < surfaceDef.collision.length; _i3++) {
                    surface.colliders.push(collider.transform(surfaceDef.collision[_i3], this.pos, this.rot, this.scale));
                }
                this.surfaces.push(surface);
            }

            // Create ceiling
            var vision = (0, _assign2.default)({}, {
                dist: 5.5,
                width: 2.75,
                linger: 0.0,
                fadeRate: 12.0
            }, def.ceiling.vision);
            this.ceiling = {
                zoomRegions: [],
                vision: vision,
                visionTicker: 0.0,
                fadeAlpha: 1.0
            };

            this.ceilingTop = {
                colliders: [],
                vision: vision,
                visionTicker: 0.0,
                fadeAlpha: 1.0
            };
            for (var _i4 = 0; _i4 < def.ceiling.zoomRegions.length; _i4++) {
                var region = def.ceiling.zoomRegions[_i4];
                this.ceiling.zoomRegions.push({
                    zoomIn: region.zoomIn ? collider.transform(region.zoomIn, this.pos, this.rot, this.scale) : null,
                    zoomOut: region.zoomOut ? collider.transform(region.zoomOut, this.pos, this.rot, this.scale) : null
                });
            }

            if (def.ceilingTop) {

                for (var _i5 = 0; _i5 < def.ceilingTop.colliders.length; _i5++) {
                    var colliderTemp = collider.transform(def.ceilingTop.colliders[_i5], this.pos, this.rot, this.scale);
                    this.ceilingTop.colliders.push(colliderTemp);
                }

                /*  if(def.ceilingTop.collider) {
                     this.ceilingTop.collider = collider.transform(
                         def.ceilingTop.collider, this.pos, this.rot, this.scale
                     );
                 } else {
                     this.ceilingTop.collider = collider.transform(
                         def.mapObstacleBounds[0], this.pos, this.rot, this.scale
                     );
                 } */
            }

            // Create floor and ceiling images
            this.imgs = [];
            for (var _i6 = 0; _i6 < def.floor.imgs.length; _i6++) {
                this.imgs.push({
                    sprite: createSpriteFromDef(def.floor.imgs[_i6]),
                    isCeiling: false,
                    zOrd: this.zIdx,
                    zIdx: this.__id * 100 + _i6
                });
            }
            for (var _i7 = 0; _i7 < def.ceiling.imgs.length; _i7++) {
                var imgDef = def.ceiling.imgs[_i7];
                this.imgs.push({
                    sprite: createSpriteFromDef(imgDef),
                    isCeiling: true,
                    removeOnDamaged: !!imgDef.removeOnDamaged,
                    zOrd: 750 - this.zIdx,
                    zIdx: this.__id * 100 + _i7
                });
            }

            if (def.ceilingTop) {
                for (var _i8 = 0; _i8 < def.ceilingTop.imgs.length; _i8++) {
                    var _imgDef = def.ceilingTop.imgs[_i8];
                    this.imgs.push({
                        sprite: createSpriteFromDef(_imgDef),
                        isCeilingTop: true,
                        removeOnDamaged: !!_imgDef.removeOnDamaged,
                        zOrd: 750 - this.zIdx,
                        zIdx: this.__id * 100 + _i8
                    });
                }
            }

            // Create occupied particle emitters
            var defEmitters = def.occupiedEmitters || [];
            for (var _i9 = 0; _i9 < defEmitters.length; _i9++) {
                var defEmitter = defEmitters[_i9];
                var defRot = defEmitter.rot !== undefined ? defEmitter.rot : 0.0;
                var rot = this.rot + defRot;
                var pos = v2.add(this.pos, v2.rotate(defEmitter.pos, rot));
                var initDir = defEmitter.dir || v2.create(1.0, 0.0);
                var dir = v2.rotate(initDir, rot);
                var scale = defEmitter.scale;
                var parent = null;
                if (defEmitter.parentToCeiling) {
                    // Parent to the last ceiling
                    var lastIdx = -1;
                    for (var j = 0; j < this.imgs.length; j++) {
                        var img = this.imgs[j];
                        if (img.isCeiling || img.isCeilingTop) {
                            lastIdx = j;
                        }
                    }
                    if (lastIdx >= 0) {
                        var _img = this.imgs[lastIdx];
                        parent = _img.sprite;
                        // Parented sprites use a different coordinate system...
                        pos = v2.mul(defEmitter.pos, 32.0);
                        pos.y *= -1.0;
                        dir = v2.rotate(v2.create(1.0, 0.0), defEmitter.rot);
                        scale = 1.0 / _img.sprite.defScale;
                    }
                }
                var emitter = ctx.particleBarn.addEmitter(defEmitter.type, {
                    pos: pos,
                    dir: dir,
                    scale: scale,
                    layer: defEmitter.layer,
                    parent: parent
                });
                this.particleEmitters.push(emitter);
            }

            // Create sound emitters
            var defSoundEmitters = def.soundEmitters || [];
            for (var _i10 = 0; _i10 < defSoundEmitters.length; _i10++) {
                var defSound = defSoundEmitters[_i10];
                var _pos = v2.add(this.pos, v2.rotate(defSound.pos, this.rot));
                this.soundEmitters.push({
                    instance: null,
                    sound: defSound.sound,
                    channel: defSound.channel,
                    pos: _pos,
                    range: defSound.range,
                    falloff: defSound.falloff,
                    volume: defSound.volume
                });
            }
        }
    },

    m_update: function m_update(dt, map, particleBarn, audioManager, ambience, activePlayer, renderer, camera) {
        // Puzzle effects
        if (this.hasPuzzle) {
            var def = MapObjectDefs[this.type];
            // Play puzzle error effects
            if (this.puzzleErrSeqModified) {
                this.puzzleErrSeqModified = false;

                if (!this.isNew) {
                    // Find the nearest puzzle-piece obstacle and play the
                    // sound from that location. Fallback to the building location
                    // if none can be found.
                    var nearestObj = this;
                    var nearestDist = v2.length(v2.sub(activePlayer.pos, nearestObj.pos));
                    var obstacles = map.m_obstaclePool.m_getPool();
                    for (var i = 0; i < obstacles.length; i++) {
                        var o = obstacles[i];
                        if (o.active && o.isPuzzlePiece && o.parentBuildingId == this.__id) {
                            var dist = v2.length(v2.sub(activePlayer.pos, o.pos));
                            if (dist < nearestDist) {
                                nearestObj = o;
                                nearestDist = dist;
                            }
                        }
                    }
                    audioManager.playSound(def.puzzle.sound.fail, {
                        channel: "sfx",
                        soundPos: nearestObj.pos,
                        layer: nearestObj.layer,
                        filter: 'muffled'
                    });
                }
            }

            // Play puzzle solved effects
            if (this.puzzleSolved && !this.playedSolvedPuzzleFx) {
                map.solvedPuzzleIds.push(this.__id);
                this.playedSolvedPuzzleFx = true;

                if (!this.isNew && def.puzzle.sound.complete != 'none') {
                    audioManager.playSound(def.puzzle.sound.complete, {
                        channel: "sfx",
                        soundPos: this.pos,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                }
            }
        }

        // Destroy ceiling
        if (this.ceilingDead && !this.playedCeilingDeadFx) {
            map.deadCeilingIds.push(this.__id);
            this.playedCeilingDeadFx = true;

            if (!this.isNew) {
                this.destroyCeilingFx(particleBarn, audioManager);
            }
        }

        this.isNew = false;

        // Create residue if the ceiling has been destroyed
        // @TODO: Create a decal here instead?
        if (this.ceilingDead && !this.residue) {
            var _def = MapObjectDefs[this.type];
            if (_def.ceiling.destroy !== undefined) {
                var r = this.allocSprite();
                r.texture = PIXI.Texture.fromImage(_def.ceiling.destroy.residue);
                r.position.set(0.0, 0.0);
                r.scale.set(1.0, 1.0);
                r.rotation = 0.0;
                r.tint = 0xFFFFFF;
                r.visible = true;
                this.imgs[0].sprite.addChild(r);
                this.residue = r;
            }
        }

        // Determine ceiling visibility
        this.ceiling.visionTicker -= dt;
        this.ceilingTop.visionTicker -= dt;

        var vision = this.ceiling.vision;
        var visionHeight = 0.5;
        var visionRayCount = 5;
        var canSeeInside = false;
        var ceilingTopHide = false;
        for (var _i11 = 0; _i11 < this.ceiling.zoomRegions.length; _i11++) {
            var zoomIn = this.ceiling.zoomRegions[_i11].zoomIn;
            if (!zoomIn) {
                continue;
            }
            if (this.layer != activePlayer.layer && !(activePlayer.layer & 0x2)) {
                continue;
            }
            /*  let hit = collisionHelpers.scanCollider(
                 zoomIn,
                 map.m_obstaclePool.m_getPool(),
                 activePlayer.pos,
                 activePlayer.layer,
                 visionHeight,
                 vision.width * 2.0,
                 vision.dist,
                 visionRayCount
             ); */

            var hit = collider.intersectPlayer(zoomIn, activePlayer.movementCollider);

            if (hit) {
                canSeeInside = true;
                break;
            }
        }

        for (var _i12 = 0; _i12 < this.ceilingTop.colliders.length; _i12++) {
            var ceilingTopCollider = this.ceilingTop.colliders[_i12];

            if (collider && (this.layer == activePlayer.layer || activePlayer.layer & 0x2)) {

                var collision = collider.intersectPlayer(ceilingTopCollider, activePlayer.movementCollider);
                if (collision) {
                    ceilingTopHide = true;
                    break;
                }
            }
        }

        /* //Ceiling top collision
        let ceilingTopCollider = this.ceilingTop.collider;
        if (ceilingTopCollider &&
            (this.layer == activePlayer.layer ||
            (activePlayer.layer & 0x2))) {
                 let collision = collider.intersectPlayer(ceilingTopCollider, activePlayer.movementCollider);
                if (collision) {
                    ceilingTopHide = true;
                }
        } */

        if (this.ceilingDead) {
            canSeeInside = true;
            ceilingTopHide = true;
        }

        if (canSeeInside) {
            this.ceiling.visionTicker = vision.linger + 0.0001;
        }

        if (ceilingTopHide) {
            this.ceilingTop.visionTicker = vision.linger + 0.0001;
        }

        // @NOTE: This will not allow for revealing any ceilings while
        // underground near stairs
        if (activePlayer.noCeilingRevealTicker > 0.0 && !this.ceilingDead) {
            this.ceiling.visionTicker = 0.0;
            this.ceilingTop.visionTicker = 0.0;
        }

        var visible = this.ceiling.visionTicker > 0.0;
        var ceilingStep = step(this.ceiling.fadeAlpha, visible ? 0.0 : 1.0, dt * (visible ? 12.0 : vision.fadeRate));
        this.ceiling.fadeAlpha += ceilingStep;

        var ceilingTopvisible = this.ceilingTop.visionTicker > 0.0;
        var ceilingStepTop = step(this.ceilingTop.fadeAlpha, ceilingTopvisible ? 0.0 : 1.0, dt * (ceilingTopvisible ? 12.0 : vision.fadeRate));
        this.ceilingTop.fadeAlpha += ceilingStepTop;

        // Immediately reveal a ceiling if we're on stairs and
        // can see inside the other layer
        if (canSeeInside && activePlayer.noCeilingRevealTicker <= 0.0 && activePlayer.layer & 0x2 && !util.sameLayer(activePlayer.layer, this.layer)) {
            this.ceiling.fadeAlpha = 0.0;
        }

        if (ceilingTopHide && activePlayer.noCeilingRevealTicker <= 0.0 && activePlayer.layer & 0x2 && !util.sameLayer(activePlayer.layer, this.layer)) {
            this.ceilingTop.fadeAlpha = 0.0;
        }

        /* if (ceilingTopHide) {
             this.ceilingTop.fadeAlpha = 0.0;
         }*/

        // Update particle emitters based on occupied status
        for (var _i13 = 0; _i13 < this.particleEmitters.length; _i13++) {
            this.particleEmitters[_i13].enabled = this.occupied;
        }

        // Update sound emitters
        this.soundEmitterTicker += dt;
        if (this.soundEmitterTicker > 0.1) {
            this.soundEmitterTicker = 0.0;

            for (var _i14 = 0; _i14 < this.soundEmitters.length; _i14++) {
                var soundEmitter = this.soundEmitters[_i14];

                // Play sound if it's loaded
                if (!soundEmitter.instance && audioManager.isSoundLoaded(soundEmitter.sound, soundEmitter.channel)) {
                    soundEmitter.instance = audioManager.playSound(soundEmitter.sound, {
                        channel: soundEmitter.channel,
                        loop: true,
                        forceStart: true,
                        startSilent: true
                    });
                }

                if (!soundEmitter.instance) {
                    continue;
                }

                // Update volume
                var diff = v2.sub(camera.pos, soundEmitter.pos);
                var _dist = v2.length(diff);
                var distT = math.remap(_dist, soundEmitter.range.min, soundEmitter.range.max, 1.0, 0.0);
                var volumeFalloff = Math.pow(distT, soundEmitter.falloff);
                var visibilityMult = math.lerp(this.ceiling.fadeAlpha, 1.0, 0.25);
                var volume = audioManager.baseVolume * audioManager.getTypeVolume('sound') * soundEmitter.volume * volumeFalloff * visibilityMult;
                if (!util.sameAudioLayer(this.layer, activePlayer.layer)) {
                    volume = 0.0;
                }
                if (volume < 0.003) {
                    volume = 0.0;
                }
                soundEmitter.instance.volume = volume;
            }
        }

        // Position sprites for rendering
        for (var _i15 = 0; _i15 < this.imgs.length; _i15++) {
            var img = this.imgs[_i15];
            var alpha = 1.0;

            if (img.isCeiling) {
                alpha = this.ceiling.fadeAlpha;
            } else if (img.isCeilingTop) {
                alpha = this.ceilingTop.fadeAlpha;
            }
            this.positionSprite(img.sprite, alpha, camera);

            if (img.removeOnDamaged && this.ceilingDamaged) {
                img.sprite.visible = !this.ceilingDamaged;
            }

            // Determine zOrder of ceilings
            var layer = this.layer;
            // This hack will render ceilings ontop of players on stairs.
            // It fixes an issue when outside of the mansion with players
            // standing on the interior mansion stairs.
            if ((img.isCeiling || img.isCeilingTop) && (this.layer == activePlayer.layer || activePlayer.layer & 0x2 && this.layer == 1)) {
                layer |= 0x2;
            }
            renderer.addPIXIObj(img.sprite, layer, img.zOrd, img.zIdx);
        }
    },

    isInsideCeiling: function isInsideCeiling(collision) {
        for (var i = 0; i < this.ceiling.zoomRegions.length; i++) {
            var zoomIn = this.ceiling.zoomRegions[i].zoomIn;
            if (!zoomIn) {
                continue;
            }
            if (collider.intersect(zoomIn, collision)) {
                return true;
            }
        }
        return false;
    },

    getDistanceToBuilding: function getDistanceToBuilding(pos, maxDist) {
        var dist = maxDist;
        for (var i = 0; i < this.ceiling.zoomRegions.length; i++) {
            var zoomIn = this.ceiling.zoomRegions[i].zoomIn;
            if (!zoomIn) {
                continue;
            }
            var res = collider.intersectCircle(zoomIn, pos, maxDist);
            if (res) {
                dist = math.clamp(maxDist - res.pen, 0.0, dist);
            }
        }
        return dist;
    },

    destroyCeilingFx: function destroyCeilingFx(particleBarn, audioManager) {
        var def = MapObjectDefs[this.type].ceiling.destroy;

        // Spawn particles at random points inside the first surface collision
        var surface = this.surfaces[0];
        for (var i = 0; i < surface.colliders.length; i++) {
            var aabb = collider.toAabb(surface.colliders[i]);

            for (var j = 0; j < def.particleCount; j++) {
                var pos = v2.create(util.random(aabb.min.x, aabb.max.x), util.random(aabb.min.y, aabb.max.y));
                var vel = v2.mul(v2.randomUnit(), util.random(0.0, 15.0));
                particleBarn.addParticle(def.particle, this.layer, pos, vel);
            }

            // Only use the first collider for now;
            // the shack looks weird with the front step being used
            break;
        }
        audioManager.playSound(def.sound || 'ceiling_break_01', {
            channel: "sfx",
            soundPos: this.pos
        });
    },

    positionSprite: function positionSprite(sprite, alpha, camera) {
        var screenPos = camera.pointToScreen(v2.add(this.pos, sprite.posOffset));
        var screenScale = camera.pixels(this.scale * sprite.defScale);

        sprite.position.set(screenPos.x, screenPos.y);
        sprite.scale.set(screenScale, screenScale);
        if (sprite.mirrorY) {
            sprite.scale.y *= -1.0;
        }
        if (sprite.mirrorX) {
            sprite.scale.x *= -1.0;
        }
        sprite.rotation = -this.rot + sprite.rotOffset;
        sprite.alpha = sprite.imgAlpha * alpha;
    },

    render: function render(camera, debug, layer) {}
};

module.exports = Building;
