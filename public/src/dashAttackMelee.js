"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * dashAttackMelee.js
 * Do a melee attack with a dash
 */

var assert = require("./0e566746.js");
var v2 = require("./v2.js");
var math = require("./math.js");

var SkillsEnum = require("./skillsEnum.js");
var AnimationData = require("./animationData.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var DashAttackMelee = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {WeaponManager} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function DashAttackMelee(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        _classCallCheck(this, DashAttackMelee);

        //Obligatory attack attributes
        this.id = SkillsEnum.DashAttackMelee;
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
        this.maxHits = false;

        //Special behaviour attributes
        assert(this.attackDef.dash, "Need dash definition to use 'DashAttackMelee' behaviour");

        this.start(); //This start the attack with the special behavior of the dash
    }

    /**
     * Updates the current attack behaviour
     * @param {float} dt Delta time since the last call to update
     * @param {Object} toMouseLen Has the direction of the client cursor in a vector: {x: float, y: float}, normalized from -1 to 1
     */


    _createClass(DashAttackMelee, [{
        key: 'update',
        value: function update(dt, toMouseLen) {
            this.timeActiveOld = this.timeActive;
            this.timeActive += dt;
            return this.isActive;
        }

        /**
         * Start attack
         * Set the necessary variables for the player to execute a dash, and set callback to play attack anim if necessary
         */

    }, {
        key: 'start',
        value: function start() {}

        /**
         * Play attack animation when is called 
         * Used when dash is complete
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
            this.isActive = false;

            //Do dash after attack finish
            if (!this.WeaponManager.isRunningOnClient && this.attackDef.dash && this.attackDef.dash.afterAttack) {
                var dashDef = this.attackDef.dash;

                this.player.dash.durationCooldown = dashDef.duration / (1 + this.player.statscontroller.getAgility());
                this.player.dash.durationTime = this.player.dash.durationCooldown;
                this.player.dash.distance = dashDef.distance;
                if (!dashDef.directionInverted) this.player.dash.directionVector = { x: this.direction.x, y: this.direction.y };else this.player.dash.directionVector = { x: -this.direction.x, y: -this.direction.y };
            }
        }
    }]);

    return DashAttackMelee;
}();

module.exports = DashAttackMelee;
