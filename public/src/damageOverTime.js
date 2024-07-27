"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * damageOverTimeTrap.js
 * This trap will be deployed and if detects a collision with a player will apply damage 
 * while the player is inside the trap
 */

var assert = require("./0e566746.js");
var v2 = require("./v2.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");

var DamageOverTimeTrap = function () {
    function DamageOverTimeTrap(id, definition, trapManager, params, explosionBarn) {
        _classCallCheck(this, DamageOverTimeTrap);

        this.id = id;
        this.definition = definition;
        this.TrapManager = trapManager;
        this.explosionBarn = explosionBarn;

        this.active = true;
        this.doNotUpdate = false; //Used client side
        this.layer = params.layer;
        this.source = params.source;
        this.teamId = params.teamId;
        this.ownerId = params.ownerId;
        this.position = params.position;
        this.ownerType = params.ownerType;

        this.explosion = false;
        this.explosionType = this.definition.behaviourParams.explosionType;
        this.exploted = false;

        this.timeActive = 0;
        this.effectFrecuencyTicker = 0;

        this.hitbox = this.definition.hitbox;
        this.timeToDisappear = this.definition.timeToDisappear;
        this.frecuency = this.definition.behaviourParams.frecuency;

        this.serialized = false;

        if (this.hitbox.type == collider.Type.Aabb) {
            var colliderExtend = v2.create(this.hitbox.x, this.hitbox.y);
            this.collider = collider.createAabbExtents(this.position, colliderExtend);
        } else {
            this.collider = collider.createCircle(this.position, this.hitbox.rad);
        }

        this.deploy();
    }

    /**
     * Deploy the new trap
     */


    _createClass(DamageOverTimeTrap, [{
        key: 'deploy',
        value: function deploy() {
            var _this = this;

            if (this.TrapManager.isRunningOnClient) {
                this.spineDef = this.definition.spine;
                this.TrapManager.addTrapSprites(this, this.definition);

                if (this.hasSpine) {
                    var playIdleAnim = function playIdleAnim() {
                        _this.TrapManager.SpineObjManager.playAnimation(_this.spine, _this.spineDef.idleAnim, null, true);
                    };

                    this.TrapManager.SpineObjManager.playAnimation(this.spine, this.spineDef.startAnim, playIdleAnim, false);
                }
            }
        }

        /**
         * Update current trap with this class behaviour
         * @param {float} dt Delta time since last update
         */

    }, {
        key: 'update',
        value: function update(dt) {
            if (!this.active || this.doNotUpdate) return;

            var collisionDetected = void 0;
            if (this.TrapManager.isRunningOnClient) {
                collisionDetected = this.checkCollisionsWithTrapClient();
            }
        }

        /**
         * Clear the trap before is removed
         */

    }, {
        key: 'clear',
        value: function clear() {
            if (this.container) {
                this.container.visible = false;
                if (this.spine) this.freeSpine();
                this.active = false;
            }
        }
    }, {
        key: 'explote',
        value: function explote() {
            this.explosionBarn.createExplosion(this.ownerId, this.explosionType, this.source, GameConfig.DamageType.Player, this.position, this.layer);
            this.TrapManager.removeTrapById(this.id);
        }

        /**
         * Check if there are collisions with trap collider client
         * @returns {Boolean} If collision is detected
         */

    }, {
        key: 'checkCollisionsWithTrapClient',
        value: function checkCollisionsWithTrapClient() {
            return this.TrapManager.checkCollisionsWithTrapClient(this.collider, this);
        }
    }, {
        key: 'applyTrapEffect',
        value: function applyTrapEffect(target) {
            if (this.TrapManager.isRunningOnClient) {
                //Show activation animation
            }
        }

        /**
         * Will play end animation when trap is removed
         */

    }, {
        key: 'playEndAnimation',
        value: function playEndAnimation() {
            var _this2 = this;

            if (this.endAnimationPlayed || !this.TrapManager.isRunningOnClient) return true;

            this.doNotRemoveTrap = true;
            this.endAnimationPlayed = true;
            this.TrapManager.SpineObjManager.playAnimation(this.spine, this.spineDef.finishAnim, function () {
                _this2.doNotRemoveTrap = false;
            }, false);
            return false;
        }
    }, {
        key: 'playExplosionAnimation',
        value: function playExplosionAnimation() {
            var _this3 = this;

            if (this.explosionAnimationPlayed && !this.TrapManager.isRunningOnClient) {
                return true;
            }
            if (this.TrapManager.isRunningOnClient) {

                this.doNotRemoveTrap = true;
                this.explosionAnimationPlayed = true;
                this.explosion = true;
                var animation = this.spineDef.explosionAnim || this.spineDef.finishAnim;
                this.TrapManager.SpineObjManager.playAnimation(this.spine, animation, function () {
                    _this3.doNotRemoveTrap = false;
                }, false);
                return false;
            }
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.TrapManager.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
        }
    }]);

    return DamageOverTimeTrap;
}();

module.exports = DamageOverTimeTrap;
