"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * chargeHeavyAttack.js
 * This class represents the burning status effect of the game
 */

var v2 = require("./v2.js");
var math = require("./math.js");
var StatusEffects = require("./statusEffects.js");

var ChargeHeavyAttack = function () {
    /**
     * Constructor
     * @param {boolean} runningOnClient Indicates if the effect will run on the client or the server 
     */
    function ChargeHeavyAttack(runningOnClient, params) {
        _classCallCheck(this, ChargeHeavyAttack);

        this.id = 4;
        this.name = "m_chargeHeavyAttack";
        this.runningOnClient = runningOnClient;
        this.emitter = null;
        this.ticker = 0;
        this.percentage = 0;
        this.dirty = false;
        this.hadParams = false;

        // Look in the effects json for the effect data
        var length = StatusEffects.length;
        for (var i = 0; i < length; i++) {
            if (StatusEffects[i].id == this.id) {
                if (params) {
                    this.effectData = Object.assign({}, StatusEffects[i]); //Copy def so we don't modified it if needed again
                    this.effectData = Object.assign(this.effectData, params); //Replace defaults with params if given
                    this.hadParams = true;
                } else {
                    this.effectData = Object.assign({}, StatusEffects[i]);
                }
                break;
            }
        }
    }

    /**
     * Starts the effect 
     * @param {player} player Reference to the player that has the effect 
     * @param {Object} particleBarn Reference to particle manager (Optional only required for the client) 
     */


    _createClass(ChargeHeavyAttack, [{
        key: 'start',
        value: function start(player, particleBarn) {
            if (this.runningOnClient && this.effectData.particle) {
                // Added the particle emitter
                this.emitter = particleBarn.addEmitter(this.effectData.particle, {
                    pos: player.pos,
                    layer: player.layer
                });
            } else {
                var attackDef = player.WeaponManager.mainWeaponDef.attacks.heavyAttack;

                var maxChargeTime = player.isTouch() ? attackDef.behaviourParams.maxChargeTimeTouch : attackDef.behaviourParams.maxChargeTime;

                player.WeaponManager.attackHoldTime = maxChargeTime;
                player.WeaponManager.resetHeavyHoldTime = false;
            }
            this.ticker = 5; //This effect doesn't have limit time
        }

        /**
         * Resets the effect timer
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.ticker = 5; //This effect doesn't have limit time
        }

        /**
         * Updates the effect status
         * @param {player} player Reference to the player that has the effect
         * @param {float} dt Delta time since the last call to update
         * @param {array} damageList List to the damage calls
         */

    }, {
        key: 'update',
        value: function update(player, dt, damageList) {
            if (this.emitter) {
                this.emitter.pos = v2.add(player.pos, v2.create(0.0, 0.1));
                this.emitter.layer = player.renderLayer;
                this.emitter.zOrd = player.renderZOrd + 1;
            }
            if (!this.runningOnClient) {
                this.setEffectPercentage(this.ticker * 100.0 / 5);
                if (player.WeaponManager.attackHoldTime <= 0) {
                    player.WeaponManager.resetHeavyHoldTime = true;
                    this.ticker = 0;
                } else this.ticker = 5; //This effect doesn't have limit time
            }
        }

        /**
         * Stops the effect
         */

    }, {
        key: 'stop',
        value: function stop(player) {
            if (this.runningOnClient && this.emitter) {
                this.emitter.stop();
                this.emitter = null;
            } else {
                if (!this.runningOnClient) {
                    player.WeaponManager.resetHeavyHoldTime = true;
                    this.ticker = 0;
                    this.setEffectPercentage(0.0);
                }
            }
        }

        /**
         * Updates the effect percentage 
         * @param {float} value new value of the effect 
         */

    }, {
        key: 'setEffectPercentage',
        value: function setEffectPercentage(value) {
            var prev = this.percentage;
            this.percentage = math.clamp(value, 0.0, 100.0);
            if (prev != this.percentage) {
                this.dirty = true;
            }
        }
    }]);

    return ChargeHeavyAttack;
}();

module.exports = {
    ChargeHeavyAttack: ChargeHeavyAttack
};
