"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * cycloneAttack.js
 * Do a melee attack that deals damage per second to all enemies in an area
 */

var assert = require("./0e566746.js");
var v2 = require("./v2.js");
var SkillsEnum = require("./skillsEnum.js");
var AnimationData = require("./animationData.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var CycloneAttack = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function CycloneAttack(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        _classCallCheck(this, CycloneAttack);

        //Obligatory attack attributes
        this.id = SkillsEnum.CycloneAttack;
        this.isActive = true;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;
        this.WeaponManager = weaponManager;
        this.timeActive = 0;
        this.timeActiveOld = 0;
        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        //Melee attack attributes
        this.direction = v2.copy(this.player.dir);
        this.damage = this.attackDef.damage;
        this.cancelable = this.attackDef.cancelable;

        //Special behaviour attributes
        assert(this.attackDef.cycloneParams && this.attackDef.cycloneParams.damageFrecuency, 'Cyclone params not found for Cyclone behaviour (Attack Skill)');
        this.nextDamageTicker = 0;
        this.damageFrecuency = this.attackDef.cycloneParams.damageFrecuency;

        this.start();
    }

    /**
     * Start attack
     */


    _createClass(CycloneAttack, [{
        key: 'start',
        value: function start() {}
        //


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
            if (this.isActive) {
                if (this.nextDamageTicker <= 0) {
                    if (this.WeaponManager.isRunningOnClient) this.checkCollisionClient();

                    this.nextDamageTicker = this.damageFrecuency;
                } else this.nextDamageTicker -= dt;
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
    }, {
        key: 'checkCollisionClient',
        value: function checkCollisionClient() {
            this.WeaponManager.checkMeleeCollisionClient();
        }
    }]);

    return CycloneAttack;
}();

module.exports = CycloneAttack;
