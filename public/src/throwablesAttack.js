"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * throwablesAttack.js
 * Control the attacks that shoot bullets without any previous special behaviour
 * The number of projectiles or time shooting is parameterizable
 */

var v2 = require("./v2.js");
var SkillsEnum = require("./skillsEnum.js");
var AnimationData = require("./animationData.js");
var collider = require("./collider.js");
var GameObjectDefs = require("./gameObjectDefs.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var ThrowablesAttack = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function ThrowablesAttack(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        _classCallCheck(this, ThrowablesAttack);

        //Obligatory attack attributes
        this.id = SkillsEnum.ThrowablesAttack;
        this.isActive = true;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;
        this.bulletCallback = callback;
        this.WeaponManager = weaponManager;
        this.timeActive = 0;
        this.timeActiveOld = 0;
        this.playerThrowables = [];
        this.cancelable = this.attackDef.cancelable;

        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        //Range attack attributes
        this.projectilesLeft = attackDef.numBullets ? attackDef.numBullets : 0;
        this.attackTimeLeft = attackDef.duration ? attackDef.duration : 0;
        this.throwableDurationDelay = attackDef.behaviourParams && attackDef.behaviourParams.throwableDurationDelay ? attackDef.behaviourParams.throwableDurationDelay : 0;
        this.throwableId = attackDef.behaviourParams && attackDef.behaviourParams.throwableId ? attackDef.behaviourParams.throwableId : 0;
        this.throwableLifeTime = attackDef.behaviourParams && attackDef.behaviourParams.lifeTime ? attackDef.behaviourParams.lifeTime : null;
        this.projectilesCount = 0;
        this.timeUntilNextShot = 0;
        this.doNotUpdate = false;

        //Special behaviour attributes


        this.start();
    }

    /**
     * Start attack
     */


    _createClass(ThrowablesAttack, [{
        key: 'start',
        value: function start() {
            if (!this.WeaponManager.isRunningOnClient) {
                var objCbOnTime = null;
                if (this.attackDef.attackStartTime && this.attackDef.attackStartTime > 0) {
                    objCbOnTime = { onTime: this.attackDef.attackStartTime, cb: this.startAttack.bind(this) };
                    this.doNotUpdate = true;
                }

                //Play animation
                /* this.player.playAnim(Anim.Attack, 
                     this.attackDef.animationObj.animDuration, 
                     this.attackDef.animationObj.animationSpeed || 1, 
                     this.attackDef,
                     AttackToNum[this.attackDef.id],
                     this.finishAttack.bind(this),
                     null,
                     objCbOnTime);*/
            }
        }

        /**
         * Start updating attack
         */

    }, {
        key: 'startAttack',
        value: function startAttack() {
            this.doNotUpdate = false;
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

            if (this.attackTimeLeft > 0) {
                this.attackTimeLeft -= dt;
                this.timeUntilNextShot -= dt;
            } else {
                this.finishAttack();
            }

            return this.isActive;
        }

        /**
         * Continues attacking
         */

    }, {
        key: 'continueShootingBullets',
        value: function continueShootingBullets(toMouseLen) {
            this.doNotUpdate = true;

            while (this.doNotUpdate) {

                if (this.projectilesLeft != 'Infinite' && this.projectilesLeft > 0) this.projectilesLeft -= 1;

                if (this.projectilesLeft > 0 || this.attackTimeLeft > 0) {
                    this.timeUntilNextShot = this.attackDef.shootDelay;
                    this.projectilesCount += 1;
                    if (this.timeUntilNextShot > 0) this.doNotUpdate = false;
                } else {
                    this.doNotUpdate = false;
                    this.active = false;
                }
            }
        }

        /**
         * Changes attack state to finished
         */

    }, {
        key: 'finishAttack',
        value: function finishAttack() {
            this.WeaponManager.activeThrowables = this.playerThrowables;

            if (this.isActive) {
                /* for (let i = 0; i < this.playerThrowables.length; i++) {
                    let throwable = this.playerThrowables[i];
                    throwable.removeProjectile = true;
                    
                } */
                this.isActive = false;
            }
        }
    }]);

    return ThrowablesAttack;
}();

module.exports = ThrowablesAttack;
