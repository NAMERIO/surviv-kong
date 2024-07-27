"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * normalAttackRange.js
 * Control the attacks that shoot bullets without any previous special behaviour
 * The number of projectiles or time shooting is parameterizable
 */

var v2 = require("./v2.js");
var SkillsEnum = require("./skillsEnum.js");
var AnimationData = require("./animationData.js");
var DeployTrap = require("./deployTrap.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var NormalAttackRange = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function NormalAttackRange(player, weaponManager, attackDef) {
        var _this = this;

        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

        _classCallCheck(this, NormalAttackRange);

        //Obligatory attack attributes
        this.id = SkillsEnum.NormalAttackRange;
        this.isActive = true;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;

        this.bulletCallback = null;

        if (callback) {
            var bulletCallback = function bulletCallback(position) {
                //Second attack
                //Deploy trap on the final bullet position
                var attackDef = Object.assign({}, _this.attackDef);
                attackDef.animationObj = null; //Deploy trap doesn't have player animation
                _this.WeaponManager.currentAttack = new DeployTrap(_this.player, _this.WeaponManager, attackDef, false, position);
            };

            this.bulletCallback = bulletCallback;
        }

        this.WeaponManager = weaponManager;
        this.timeActive = 0;
        this.timeActiveOld = 0;
        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        //Range attack attributes
        this.projectilesLeft = attackDef.numBullets ? attackDef.numBullets : 0;
        this.attackTimeLeft = attackDef.duration ? attackDef.duration : 0;
        this.projectilesCount = 0;
        this.timeUntilNextShot = this.attackDef.firstShootDelay ? this.attackDef.shootDelay : 0;
        this.doNotUpdate = false;
        this.cancelable = this.attackDef.cancelable;

        //Special behaviour attributes


        this.start();
    }

    /**
     * Start attack
     */


    _createClass(NormalAttackRange, [{
        key: 'start',
        value: function start() {}
        //


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

            if (this.attackTimeLeft > 0) this.attackTimeLeft -= dt;
            if (!this.doNotUpdate && (this.projectilesLeft > 0 || this.attackTimeLeft > 0)) {
                if (this.timeUntilNextShot <= 0) {

                    if (this.projectilesLeft != 'Infinite' && this.projectilesLeft > 0) this.projectilesLeft -= 1;

                    if (this.projectilesLeft > 0 || this.attackTimeLeft > 0) {
                        this.timeUntilNextShot = this.attackDef.shootDelay;
                        this.projectilesCount += 1;
                        if (this.timeUntilNextShot <= 0) this.continueShootingBullets(toMouseLen);
                    }
                } else {
                    this.timeUntilNextShot -= dt;
                }
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
            this.isActive = false;
        }
    }]);

    return NormalAttackRange;
}();

module.exports = NormalAttackRange;
