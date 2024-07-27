"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * deployTrap.js
 * Deploy a trap in the current position of the player
 */

var v2 = require("./v2.js");
var util = require("./util.js");
var SkillsEnum = require("./skillsEnum.js");
var GameObject = require("./gameObject.js");
var AnimationData = require("./animationData.js");
var GameObjectDefs = require("./gameObjectDefs.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var DeployTrap = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function DeployTrap(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var pos = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        _classCallCheck(this, DeployTrap);

        //Obligatory attack attributes
        this.id = SkillsEnum.DeployTrap;
        this.isActive = true;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;
        this.WeaponManager = weaponManager;
        this.timeActive = 0;
        this.timeActiveOld = 0;

        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        //Special behaviour attributes
        this.layer = this.player.layer;
        this.position = pos || this.player.pos;
        this.direction = this.player.dir;
        this.fxPos = v2.copy(this.player.pos);
        this.cancelable = this.attackDef.cancelable;

        this.start();
    }

    /**
     * Start attack
     * Set the necessary variables for the player to execute a dash, and set callback to play attack anim if necessary
     */


    _createClass(DeployTrap, [{
        key: 'start',
        value: function start() {
            if (this.WeaponManager.isRunningOnClient && this.attackDef.behaviourParams.spine) {
                this.layer = this.player.layer;
                this.spineDef = this.attackDef.behaviourParams.spine;
                this.WeaponManager.addAttackVisuals(this, this.attackDef.behaviourParams);
                if (this.spine && !this.spineDef.startTime) this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.startAnim, null, false);
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

            if (this.spineDef && this.spineDef.startTime != undefined && this.spineDef.startTime <= this.timeActive && this.spineDef.startTime >= this.timeActiveOld) {
                this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.startAnim, null, false);
            }

            if (this.WeaponManager.isRunningOnClient && !this.playedEndAnim && this.spineDef && this.spineDef.finishTime != undefined && this.spineDef.finishTime <= this.timeActive && this.spineDef.finishTime >= this.timeActiveOld) this.playEndFxAnimation();

            if (!this.WeaponManager.isRunningOnClient && this.attackDef.behaviourParams.deployTime != undefined && this.attackDef.behaviourParams.deployTime <= this.timeActive && this.attackDef.behaviourParams.deployTime >= this.timeActiveOld) this.deployTrap();

            return this.isActive;
        }

        /**
         * Play attack animation when is called
         */

    }, {
        key: 'playAttackAnimation',
        value: function playAttackAnimation() {}
        //


        /**
         * Changes attack state to finished
         */

    }, {
        key: 'finishAttack',
        value: function finishAttack() {
            var _this = this;

            if (!this.WeaponManager.isRunningOnClient) {

                if (this.attackDef.behaviourParams.deployOnFinishAttack) this.deployTrap();

                //Do dash after attack finish
                if (this.attackDef.dash && this.attackDef.dash.afterAttack) {
                    var dashDef = this.attackDef.dash;

                    this.player.dash.durationCooldown = dashDef.duration / (1 + this.player.statscontroller.getAgility());
                    this.player.dash.durationTime = this.player.dash.durationCooldown;
                    this.player.dash.distance = dashDef.distance;
                    this.player.dash.onComplete = function () {
                        _this.isActive = false;
                    }.bind(this);
                    if (!dashDef.directionInverted) this.player.dash.directionVector = { x: this.direction.x, y: this.direction.y };else this.player.dash.directionVector = { x: -this.direction.x, y: -this.direction.y };
                } else {
                    this.isActive = false;
                }
            }
        }

        /**
         * Will play end fx animation when effect ends
         * Client side
         */

    }, {
        key: 'playEndFxAnimation',
        value: function playEndFxAnimation() {
            var _this2 = this;

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

                            this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.finishAnim, function () {
                                _this2.isActive = false;console.log('FINISH FX ANIM');
                            }.bind(this), false);
                        }
                    } while (this.fxPos === this.lastFxPos);
                } else {
                    this.freeSpine();
                    this.isActive = false;
                }
            }
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.player.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
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
            if (!this.isActive || !this.hasSprite || !this.spine) return;

            if (!this.camera) this.camera = camera;

            if (util.sameLayer(this.layer, this.player.layer)) {
                var screenPos = camera.pointToScreen(this.fxPos);
                var screenScale = camera.pixels(this.imgScale);

                this.container.position.set(screenPos.x, screenPos.y);
                this.container.scale.set(screenScale, screenScale);
            }
        }

        /**
         * Deploy the trap based on the attack definition
         * Used only server side
         */

    }, {
        key: 'deployTrap',
        value: function deployTrap() {
            var behaviourParams = this.attackDef.behaviourParams;
            var params = {
                source: this.attackDef.id,
                teamId: this.player.teamId,
                ownerId: this.player.__id,
                ownerType: GameObject.Type.Player,
                position: v2.copy(this.position),
                layer: this.layer
            };

            this.WeaponManager.TrapManager.createTrap(behaviourParams.trapId, params, behaviourParams.trapParams);
        }
    }]);

    return DeployTrap;
}();

module.exports = DeployTrap;
