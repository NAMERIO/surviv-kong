"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * applyStatusEffect.js
 * Apply status effect to the current player, can do a dash before activating the status effect
 */

var v2 = require("./v2.js");
var util = require("./util.js");
var SkillsEnum = require("./skillsEnum.js");
var StatusEffect = require("./statusEffect.js");
var AnimationData = require("./animationData.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var ApplyStatusEffect = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function ApplyStatusEffect(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        _classCallCheck(this, ApplyStatusEffect);

        //Obligatory attack attributes
        this.id = SkillsEnum.ApplyStatusEffect;
        this.isActive = true;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;
        this.WeaponManager = weaponManager;
        this.weaponDef = this.isOffHand ? this.WeaponManager.offHandDef : this.WeaponManager.mainWeaponDef;

        this.timeActive = 0;
        this.timeActiveOld = 0;

        //Special behaviour attributes
        this.direction = v2.copy(this.player.dir);
        this.fxPos = v2.copy(this.player.pos);
        this.statusEffect = null;
        this.activeWithStatusEffect = this.attackDef.activeWithStatusEffect;
        this.cancelable = this.attackDef.cancelable;

        this.start();
    }

    /**
     * Start attack
     * Set the necessary variables for the player to execute a dash, and set callback to play attack anim if necessary
     */


    _createClass(ApplyStatusEffect, [{
        key: 'start',
        value: function start() {
            if (this.WeaponManager.isRunningOnClient && this.attackDef.behaviourParams.spine) {
                this.layer = this.player.layer;
                this.spineDef = this.attackDef.behaviourParams.spine;
                this.WeaponManager.addAttackVisuals(this, this.attackDef.behaviourParams);
                if (this.spine && this.spineDef) this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.idle, null, false);
            }
        }

        /**
         * Updates the current attack behaviour
         * @param {float} dt Delta time since the last call to update
         * @param {Object} toMouseLen Has the direction of the client cursor in a vector: {x: float, y: float}, normalized from -1 to 1
         */

    }, {
        key: 'update',
        value: function update(dt, toMouseLen) {
            this.timeActiveOld = this.timeActive;
            this.timeActive += dt;

            if (this.WeaponManager.isRunningOnClient && this.activeWithStatusEffect && !this.statusEffect) this.statusEffect = StatusEffect.getPlayerEffectByName(this.attackDef.behaviourParams.statusEffectName, this.player);

            if (this.activeWithStatusEffect && this.statusEffect) {
                if (this.statusEffect.ticker > 0.0) return true;else if (!this.playedEndAnim) {
                    this.playEndFxAnimation();
                }
            }
            return this.isActive;
        }

        /**
         * Play attack animation when is called 
         * Used when dash is complete, if current attack have a dash before the attack
         */

    }, {
        key: 'playAttackAnimation',
        value: function playAttackAnimation() {}
        //


        /**
         * Changes attack state to finished after player animation
         */

    }, {
        key: 'finishAttack',
        value: function finishAttack() {
            this.isActive = this.activeWithStatusEffect || false;

            //Do dash after attack finish
            if (!this.WeaponManager.isRunningOnClient && this.attackDef.dash && this.attackDef.dash.afterAttack) {
                var dashDef = this.attackDef.dash;

                this.player.dash.durationCooldown = dashDef.duration / (1 + this.player.statscontroller.getAgility());
                this.player.dash.durationTime = this.player.dash.durationCooldown;
                this.player.dash.distance = dashDef.distance;
                if (!dashDef.directionInverted) this.player.dash.directionVector = { x: this.direction.x, y: this.direction.y };else this.player.dash.directionVector = { x: -this.direction.x, y: -this.direction.y };
            }
        }

        /**
         * Will play end fx animation when effect ends
         * Client side
         */

    }, {
        key: 'playEndFxAnimation',
        value: function playEndFxAnimation() {
            var _this = this;

            if (this.playedEndAnim) return;

            if (this.WeaponManager.isRunningOnClient && this.spine) {
                if (this.attackDef.behaviourParams.playAnimationWhenFinished) {
                    this.playedEndAnim = true;
                    this.isActive = true;

                    this.lastFxPos = this.fxPos;
                    this.fxPos = v2.copy(this.player.pos);
                    do {
                        if (this.fxPos != this.lastFxPos) {
                            //Update spine obj position
                            if (util.sameLayer(this.layer, this.player.layer) && this.camera) {
                                var screenPos = this.camera.pointToScreen(this.fxPos);
                                var screenScale = this.camera.pixels(this.imgScale);

                                this.container.position.set(screenPos.x, screenPos.y);
                                this.container.scale.set(screenScale, screenScale);
                            }

                            this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.finish, function () {
                                _this.isActive = false;
                            }.bind(this), false);
                        }
                    } while (this.fxPos === this.lastFxPos);
                } else {
                    this.freeSpine();
                    this.isActive = false;
                }
                return;
            }

            this.isActive = false;
        }

        /**
        * Render the attack client side
        * @param {*} camera 
        * @param {*} debug 
        * @param {*} DebugLines 
        */

    }, {
        key: 'render',
        value: function render(camera, debug, DebugLines) {
            if (!this.isActive || !this.hasSprite) return;

            if (!this.camera) this.camera = camera;

            if (util.sameLayer(this.layer, this.player.layer)) {
                var screenPos = camera.pointToScreen(this.fxPos);
                var screenScale = camera.pixels(this.imgScale);

                this.container.position.set(screenPos.x, screenPos.y);
                this.container.scale.set(screenScale, screenScale);
            }
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.player.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
        }
    }]);

    return ApplyStatusEffect;
}();

module.exports = ApplyStatusEffect;
