"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * variableDamageRange.js
 * Shoot a projectile with damage based on the attack hold time
 */

var v2 = require("./v2.js");
var math = require("./math.js");

var SkillsEnum = require("./skillsEnum.js");
var AnimationData = require("./animationData.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var VariableDamageRange = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     * @param {Float} attackHoldTime Hold attack time, to calculate the damageg of the projectile
     */
    function VariableDamageRange(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var attackHoldTime = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        _classCallCheck(this, VariableDamageRange);

        //Obligatory attack attributes
        this.id = SkillsEnum.VariableDamageRange;
        this.isActive = true;
        this.player = player;
        this.attackDef = Object.assign({}, attackDef); //Copy object so we don't modify the definition
        this.isOffHand = isOffHand;
        this.WeaponManager = weaponManager;
        this.timeActive = 0;
        this.timeActiveOld = 0;
        this.cancelable = this.attackDef.cancelable;
        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        //Range attack attributes
        this.projectilesLeft = attackDef.numBullets ? attackDef.numBullets : 1;
        this.timeUntilNextShot = 0;
        this.attackDirection = this.attackDef.freeDirectionWhileAttacking ? this.player.dir : v2.copy(this.player.dir);

        var minChargeTime = this.player.isTouch() ? this.attackDef.behaviourParams.minChargeTimeTouch : this.attackDef.behaviourParams.minChargeTime;
        var maxChargeTime = this.player.isTouch() ? this.attackDef.behaviourParams.maxChargeTimeTouch : this.attackDef.behaviourParams.maxChargeTime;

        //Special behaviour attributes
        this.doNoUpdate = true;
        var damage = attackDef.behaviourParams.maxDamage * (math.clamp(attackHoldTime, minChargeTime, maxChargeTime) / maxChargeTime);
        this.behaviourParams = {
            damage: math.clamp(damage, attackDef.behaviourParams.minDamage, attackDef.behaviourParams.maxDamage)
        };

        this.start();
    }

    /**
     * Start attack
     */


    _createClass(VariableDamageRange, [{
        key: 'start',
        value: function start() {
            //
        }
    }, {
        key: 'startUpdatingAttack',
        value: function startUpdatingAttack() {
            this.doNoUpdate = false;
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

            if (this.doNoUpdate) return this.isActive;

            if (this.projectilesLeft > 0) {
                if (this.timeUntilNextShot <= 0) {

                    this.timeUntilNextShot = this.attackDef.shootDelay;
                    this.projectilesLeft -= 1;
                } else {
                    this.timeUntilNextShot -= dt;
                }
            }

            return this.isActive;
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

    return VariableDamageRange;
}();

module.exports = VariableDamageRange;
