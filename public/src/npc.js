"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./pixi.js");
var v2 = require("./v2.js");
var util = require("./util.js");
var collider = require("./collider.js");
var DebugLines = require("./debugLines.js");
var GameConfig = require("./gameConfig.js");
var StatusEffect = require("./statusEffect.js");
var collisionHelpers = require("./collisionHelpers.js");

var NpcSkins = require("./npcSkins.js");
var NpcDefinitions = require("./npcDefinitions.js");

var AnimationController = require("./npc-animation-controller.js");
var EnumNpcAnimations = require("./enumNpcAnimations.js").EnumNpcAnimations;

// ----- Constants -----
//Health bar options
var kHealthBarColor = 0xd10000;
var kHealthBarBackgroundColor = 0x000000;
var kHealthBarSize = v2.create(45, 3);
var kHideHealthBarTime = 5;

//Hurt effect flash
var kRepeatHurtColors = 2;
var kFlashHurtDuration1 = 0.15;
var kFlashHurtDuration2 = 0.1;
var kFlashHurtColor1 = 0x5c5c5c;
var kFlashHurtColor2 = 0xffffff;

//
// Obstacle
//
function Npc() {
    this.soundChargeLoading = null;
    this.stepDistance = 0.0;
    this.posOld = v2.create(0.0, 0.0);
    this.pos = v2.create(0.0, 0.0);
}

Npc.prototype = {
    m_init: function m_init(params) {
        this.gfx = new PIXI.Graphics();
        this.container = new PIXI.Container();
        this.bodyContainer = new PIXI.Container();
        this.container.addChild(this.bodyContainer);

        this.spineData = params.spineData;
        this.SpineObjManager = params.spineObjManager;

        this.healthBarOffset = v2.create(0, 2);

        //Flags
        this.isNew = false;
        this.active = true;
        this.isMoving = false;
        this.wasMoving = false;
        this.isSpineSet = false;
        this.isAttacking = false;
        this.wasAttacking = false;
        this.deadSoundPlayed = false;
        this.spawnSoundPlayed = false;
        this.reproduceAnimation = false;

        this.state = null;
        this.surface = null;
        this.oldState = null;
        this.attackDefs = null;
        this.smokeEmitter = null;

        this.type = null;
        this.effects = [];
        this.attackId = 1;
        this.netEffects = [];
        this.playersHit = [];
        this.currentSkins = []; //Spine skins

        this.deathTime = 1;
        this.stepDistance = 0;
        this.framesStopped = 0;
        this.timeToHideHpBar = 0;
        this.npcStepInterval = 4;
        //Flash hurt
        this.flashHurtTime = 0;
        this.currentHurtColor = 0;
        this.repeatedHurtFlash = 0;

        this.animId = 0;
        this.animDefId = 0;
        this.animDirection = undefined;

        this.renderZIdx = 0;
        this.renderZOrd = 18;
        this.renderLayer = 0;

        this.AnimationController = new AnimationController(this);
    },

    m_free: function m_free() {
        StatusEffect.stopAllEffects(this);
        this.timeToHideHpBar = 0;
        this.gfx.clear();

        if (this.container) this.container.visible = false;
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        if (fullUpdate) {
            this.dead = data.dead;
            this.layer = data.layer;
            this.level = data.level;
            this.teamId = data.teamId;
        }
        if ((isNew || !this.type) && data.type) this.type = 'monster_' + data.type;

        this.healthNormalized = data.healthNormalized;

        this.netEffects = data.effects;

        this.pos = v2.copy(data.pos);
        this.scale = data.scale;

        if (!this.type) return;
        var def = NpcDefinitions[this.type];

        if (!this.isSpineSet && this.type) {
            if (def && def.tint) this.tint = def.tint;else this.tint = null;
            this.setSpine(this.type);
        }

        if (def) {
            this.healthBarOffset = def.healthBarOffset || this.healthBarOffset;
            //Colliders
            this.collider = collider.createAabbExtents(this.pos, def.damageCollider);
            this.posMovCollider = v2.add(this.pos, def.movementColliderOffSet);
            this.movementCollider = collider.createAabbExtents(this.posMovCollider, def.movementCollider);
            this.aggroArea = def.aggroArea.type === collider.Type.Aabb ? collider.createAabbExtents(this.pos, def.aggroArea) : collider.createCircle(this.pos, def.aggroArea.rad);
        }

        if (isNew && def) {
            this.isNew = true;
            this.attackDefs = def.attacks;
            this.exploded = ctx.map.deadObstacleIds.indexOf(this.__id) != -1;
            this.explodeParticle = def.explodeParticle;
            this.collidable = def.collidable;
            this.destructible = def.destructible;
            this.height = def.height;
            this.AnimationController.npcDef = def;
            this.healthNormalizedOld = this.healthNormalized;
            this.spawnTime = def.spawnAnimObj.animDuration;
            this.spawnSound = def.spawnAnimObj.sound.name;
            this.deathAnimObj = def.deathAnimObj;
            this.deathTime = def.deathAnimObj.animDuration;

            if (def.npcStepInterval) this.npcStepInterval = def.npcStepInterval;
        }

        if (this.healthNormalized <= 0 || this.dead) {
            StatusEffect.stopAllEffects(this);
            this.AnimationController.playActionAnimation(EnumNpcAnimations.Death, 0);
        }

        //Update if damaged to show health bar and flash
        var diferenceHealth = Math.abs(this.healthNormalizedOld - this.healthNormalized);
        if (diferenceHealth >= 0.01) {
            this.timeToHideHpBar = kHideHealthBarTime;

            if (this.healthNormalized < this.healthNormalizedOld && !this.dead) {
                this.AnimationController.playSpineFX('hit');
                this.flashHurtTime = kFlashHurtDuration1;
                this.currentHurtColor = 1;
            }

            this.healthNormalizedOld = this.healthNormalized;
        }

        //Update if it attacking
        this.isAttacking = data.isAttacking;

        //Update animations
        this.reproduceAnimation = data.reproduceAnimation;
        if (this.healthNormalized > 0 && !this.dead) {
            if (this.reproduceAnimation) {
                this.animId = data.animId;
                this.animDefId = data.animDefId;
                this.animDirection = data.animDirection;

                this.AnimationController.playActionAnimation(this.animId, this.animDefId);
            }
        }
        if (this.wasAttacking != this.isAttacking) this.wasAttacking = this.isAttacking;
        this.reproduceAnimation = false;
    },

    m_update: function m_update(dt, map, playerBarn, particleBarn, audioManager, activePlayer, renderer) {
        if (!this.isSpineSet && this.type && this.bodyContainer && this.container) this.setSpine(this.type);

        this.wasMoving = this.isMoving;

        if (this.timeToHideHpBar > 0) this.timeToHideHpBar -= dt;

        //Flash <color> when damaged
        if (this.spineObj) {
            if (this.currentHurtColor != 0) {
                this.flashHurtTime -= dt;
                if (this.flashHurtTime <= 0) {
                    if (this.currentHurtColor == 1) {
                        this.repeatedHurtFlash += 1;
                        if (this.repeatedHurtFlash < kRepeatHurtColors) {
                            this.currentHurtColor = 2;
                            this.flashHurtTime = kFlashHurtDuration2;
                        } else {
                            this.currentHurtColor = 0;
                            this.repeatedHurtFlash = 0;
                        }
                    } else {
                        if (this.repeatedHurtFlash <= kRepeatHurtColors) {
                            this.currentHurtColor = 1;
                            this.flashHurtTime = kFlashHurtDuration1;
                        }
                    }
                }

                if (this.currentHurtColor == 1) this.spineObj.tint = kFlashHurtColor1;else this.spineObj.tint = kFlashHurtColor2;
            } else if (this.spineObj.tint != 0xffffff) this.spineObj.tint = 0xffffff;
        }

        //Update if npc is moving
        var stepDistance = v2.length(v2.sub(this.posOld, this.pos));
        this.framesStopped = stepDistance === 0 ? this.framesStopped + 1 : 0;
        this.isMoving = !(this.framesStopped > GameConfig.npc.framesUntilStopMoving);

        if (!this.AnimationController.initialized) this.AnimationController.init(audioManager);

        if (this.spawnTime > 0) {
            this.spawnTime -= dt;
            if (!this.spawnSoundPlayed) {
                this.spawnSoundPlayed = true;
                this.AnimationController.playSound(this.spawnSound);
            }
        } else if (this.deathTime > 0) this.AnimationController.update(dt);

        if (this.dead) {
            if (!this.deadSoundPlayed) {
                this.deadSoundPlayed = true;
            }
            if (this.deathTime > 0) {
                this.deathTime -= dt;
            } else {
                if (this.bodyContainer) {
                    this.container.removeChild(this.bodyContainer);
                    this.bodyContainer.visible = false;
                }
                this.container.visible = false;
                map.deadObstacleIds.push(this.__id);
            }
            return;
        }

        // Check the effects received from the server
        var length = this.netEffects.length;
        var activeEffects = [];
        for (var i = 0; i < length; i++) {
            var effect = this.netEffects[i];
            activeEffects.push(effect.id);
            StatusEffect.checkEffect(effect.id, this, true, true, particleBarn, audioManager);
        }

        // Look for effects that didn't came from the server to stop them
        length = this.effects.length;
        for (var _i = 0; _i < length; _i++) {
            var npcEffect = this.effects[_i];
            if (npcEffect && activeEffects.indexOf(npcEffect.id) == -1) {
                StatusEffect.checkEffect(npcEffect.id, this, false, true, particleBarn, audioManager);
            }
        }

        if (this.isAttacking) {
            this.checkMeleeCollision(playerBarn);
        }

        //Walking sound
        if (!this.dead && this.posMovCollider && this.layer) {
            this.surface = map.getGroundSurface(this.posMovCollider, this.layer);
            if (this.surface) {
                var kNpcStepInterval = this.npcStepInterval || 4;
                var kNpcRippleInterval = 5;

                this.stepDistance += stepDistance;
                if (this.stepDistance > kNpcRippleInterval && this.surface.type === 'water') {
                    this.stepDistance = 0.0;
                    particleBarn.addRippleParticle(this.posMovCollider, this.layer, this.surface.data.rippleColor);

                    audioManager.playGroup("footstep_water", {
                        soundPos: this.posMovCollider,
                        fallOff: 3.0,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                } else if (this.stepDistance > kNpcStepInterval) {
                    this.stepDistance = 0.0;
                    audioManager.playGroup("footstep_" + this.surface.type, {
                        soundPos: this.posMovCollider,
                        fallOff: 3.0,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                }
            }
        }

        if (this.container != null && this.container.visible && this.isSpineSet) {
            this.updateRenderLayer(activePlayer, map);

            renderer.addPIXIObj(this.container, this.renderLayer, this.renderZOrd, this.renderZIdx);

            //Health bar
            renderer.addPIXIObj(this.gfx, this.renderLayer, this.renderZOrd, this.renderZIdx);
        }

        this.posOld = v2.copy(this.pos);
        this.isNew = false;
    },

    checkMeleeCollision: function checkMeleeCollision(playerBarn) {
        if (!this.attackDefs) return;
        // Players
        var players = playerBarn.m_playerPool.m_getPool();
        var meleeCollider = this.getNpcMeleeCollider();
        var attackDef = this.attackDefs[this.attackId];
        if (!meleeCollider || !attackDef) return;

        for (var j = 0; j < players.length; j++) {
            var player = players[j];

            if (!player.active || player.m_netData.m_dead || !util.sameLayer(player.m_netData.m_layer, this.layer) && !(player.m_netData.m_layer & 0x2)) {
                continue;
            }

            var attackTime = this.AnimationController.animationsTracks[0].time;
            var isInDamageTime = false;
            var damageTimeId = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(attackDef.damageTimes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var damageTime = _step.value;

                    if (attackTime > damageTime.start && attackTime < damageTime.finish) isInDamageTime = true;else damageTimeId += 1;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (isInDamageTime) {
                var playerWasHit = false;
                if (this.playersHit[damageTimeId]) playerWasHit = this.playersHit[damageTimeId][player.__id];
                if (playerWasHit) continue;

                var res = collider.intersect(meleeCollider, player.collider);

                if (res) {
                    if (!this.playersHit[damageTimeId]) this.playersHit[damageTimeId] = {};
                    this.playersHit[damageTimeId][player.__id] = true;
                    player.playSpineFX('hit');
                }
            }
        }
    },
    getNpcMeleeCollider: function getNpcMeleeCollider() {
        if (!this.attackDefs) return;

        var attackDef = this.attackDefs[this.attackId];
        if (!attackDef || attackDef.type != 'melee') return;

        var meleeDirection = v2.create(1, 1); //Right
        var offset = attackDef.offset;
        var attackHitbox = attackDef.hitbox;
        if (this.animDirection == 1) meleeDirection = v2.create(-1, 1); //Left
        else if (this.animDirection == 2) {
                meleeDirection = v2.create(1, -1); //Down
                offset = v2.create(attackDef.offset.y, attackDef.offset.x);
                attackHitbox = v2.create(attackHitbox.y, attackHitbox.x);
            } else if (this.animDirection == 3) {
                meleeDirection = v2.create(1, 1); //Up
                offset = v2.create(attackDef.offset.y, attackDef.offset.x);
                attackHitbox = v2.create(attackHitbox.y, attackHitbox.x);
            }

        var attackPosOffset = v2.add(this.pos, v2.mulElems(meleeDirection, offset));
        var attackCollider = collider.createAabbExtents(attackPosOffset, attackHitbox);
        return attackCollider;
    },
    resetAttackValues: function resetAttackValues() {
        this.playersHit = [];
    },


    render: function render(camera, debug, layer) {
        if (this.dead) return;
        var pos = this.isDoor ? this.door.interpPos : this.pos;
        var scale = this.scale;

        var screenPos = camera.pointToScreen(pos);
        var screenScale = camera.pixels(scale);

        this.container.position.set(screenPos.x, screenPos.y);
        this.container.scale.set(screenScale, screenScale);

        this.container.visible = true;

        // --- Render health bar ---
        this.gfx.clear();
        if (this.timeToHideHpBar > 0) {
            var healthBarPos = v2.add(pos, this.healthBarOffset);
            healthBarPos = camera.pointToScreen(healthBarPos);
            var healthBarSize = collider.createAabbExtents(healthBarPos, kHealthBarSize);
            //Background healthbar
            this.gfx.lineStyle(1, kHealthBarBackgroundColor, 1.0);
            this.gfx.beginFill(kHealthBarBackgroundColor, 1);
            this.gfx.drawRect(healthBarSize.min.x, healthBarSize.min.y, healthBarSize.max.x - healthBarSize.min.x, healthBarSize.max.y - healthBarSize.min.y);
            //Max health (border)
            this.gfx.lineStyle(1, kHealthBarColor, 1.0);
            this.gfx.beginFill(kHealthBarColor, 0);
            this.gfx.drawRect(healthBarSize.min.x, healthBarSize.min.y, healthBarSize.max.x - healthBarSize.min.x, healthBarSize.max.y - healthBarSize.min.y);
            //Current health (filled)
            var newX = kHealthBarSize.x * this.healthNormalized;
            var offsetX = kHealthBarSize.x - newX;
            v2.set(healthBarPos, v2.create(healthBarPos.x - offsetX, healthBarPos.y));
            var currentSize = v2.create(newX, kHealthBarSize.y);
            var currentHealthBar = collider.createAabbExtents(healthBarPos, currentSize);
            this.gfx.beginFill(kHealthBarColor, 1);
            this.gfx.drawRect(currentHealthBar.min.x, currentHealthBar.min.y, currentHealthBar.max.x - currentHealthBar.min.x, currentHealthBar.max.y - currentHealthBar.min.y);
            this.gfx.endFill();
        }
    },

    updateRenderLayer: function updateRenderLayer(activePlayer, map) {
        var visualCol = collider.createCircle(this.pos, GameConfig.player.maxVisualRadius);
        var onMask = false;
        var onStairs = false;
        var occluded = false;
        var structures = map.m_structurePool.m_getPool();
        for (var j = 0; j < structures.length; j++) {
            var structure = structures[j];
            if (!structure.active) {
                continue;
            }
            for (var k = 0; k < structure.stairs.length; k++) {
                var stairs = structure.stairs[k];
                var col = collider.intersect(stairs.collision, visualCol);
                if (col) {
                    onStairs = true;

                    var stairTop = v2.add(stairs.center, v2.mul(stairs.downDir, -2.5));
                    var dir = v2.sub(stairTop, this.pos);
                    var dist = v2.length(dir);
                    dir = dist > 0.0001 ? v2.div(dir, dist) : v2.create(1.0, 0.0);
                    var occ = collisionHelpers.intersectSegmentDist(map.m_obstaclePool.m_getPool(), this.pos, dir, dist, 0.5, this.layer, false);
                    occluded = occ < dist;
                }
            }
            for (var _k = 0; _k < structure.mask.length; _k++) {
                if (collider.intersect(structure.mask[_k], visualCol)) {
                    onMask = true;
                    break;
                }
            }
        }

        var renderLayer = this.layer;
        var renderZOrd = 18;
        if (onStairs && (renderLayer & 0x1 && (activePlayer.layer & 0x1 || !occluded) || activePlayer.layer & 0x2 && !onMask)) {
            renderLayer |= 0x2;
        }
        if (onStairs && (renderLayer & 0x1) == (activePlayer.layer & 0x1) && (!onMask || activePlayer.layer == 0)) {
            renderLayer |= 0x2;
            renderZOrd += 100;
        }

        this.renderLayer = renderLayer;
        this.renderZOrd = renderZOrd;
        this.renderZIdx = this.__id;
    },


    setSpine: function setSpine(npcType) {
        if (!npcType || !this.bodyContainer || !this.container) return;
        var def = NpcDefinitions[npcType];
        if (!def) {
            console.error('Npc def not found, npcType: ', npcType);
            return;
        }
        this.spineObj = new PIXI.spine.Spine(this.spineData[def.spineData]);
        this.spineFxObj = new PIXI.spine.Spine(this.spineData['hero_fx']);
        var pivot = def.spinePivot || { x: 0.5, y: 0.5 };
        this.setSpineTransform(this.spineObj, { x: 1.4, y: 1.4 }, { x: 0.5, y: 24 }, pivot);
        this.setSpineTransform(this.spineFxObj, { x: 1.4, y: 1.4 }, { x: 0.5, y: 10 }, { x: 0.5, y: 0.5 });
        this.bodyContainer.addChild(this.spineObj);
        this.container.addChild(this.spineFxObj);

        var skinsLength = NpcSkins[npcType].length - 1;
        this.currentSkins = skinsLength < this.level ? NpcSkins[npcType][skinsLength] : NpcSkins[npcType][this.level];
        if (!this.currentSkins) {
            return;
        }

        this.changeSkin(this.currentSkins);
        this.spineObj.state.setAnimation(0, 'spawn', false);
        this.isSpineSet = true;

        if (this.tint) this.spineObj.tint = this.tint;
    },

    setSpineTransform: function setSpineTransform(spine, scale, position, pivot) {
        spine.scale.set(scale.x, scale.y);
        spine.position.set(position.x, position.y);
        spine.pivot.set(pivot.x, pivot.y);
    },

    changeSkin: function changeSkin(skins, key) {
        this.currentSkins = skins;
        var skeleton = this.spineObj.skeleton;

        var newSkin = null;
        newSkin = new PIXI.spine.core.Skin(skins[0]);

        skins.forEach(function (skin) {
            if (skin) newSkin.addSkin(skeleton.data.findSkin(skin));
        });

        skeleton.setSkin(null);
        skeleton.setSkin(newSkin);
        skeleton.setSlotsToSetupPose();
        if (!key) {
            this.spineObj.state.apply(skeleton);
        }
    },

    changeSkinSlot: function changeSkinSlot(slot, skin) {
        this.currentSkins[slot] = skin;
        this.changeSkin(this.currentSkins);
    }
};

module.exports = Npc;
