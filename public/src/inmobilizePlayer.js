"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * inmobilizePlayer.js
 * Status effect that inmobilizes a player
 */

var v2 = require("./v2.js");
var math = require("./math.js");
var GameObject = require("./gameObject.js");
var AnimationData = require("./animationData.js");
var StatusEffects = require("./statusEffects.js");
var EnumNpcAnimations = require("./enumNpcAnimations.js").EnumNpcAnimations;

var _require = require("./cb7a977d.js"),
    StatusEffectAttackType = _require.StatusEffectAttackType;

var Anim = AnimationData.EnumPlayerAnimType;

var InmobilizePlayer = function () {
    /**
     * Constructor
     * @param {boolean} runningOnClient Indicates if the effect will run on the client or the server 
     */
    function InmobilizePlayer(runningOnClient, params) {
        _classCallCheck(this, InmobilizePlayer);

        this.id = 5;
        this.name = "m_inmobilizePlayer";
        this.runningOnClient = runningOnClient;
        this.emitter = null;
        this.ticker = 0;
        this.percentage = 0;
        this.dirty = false;
        this.hadParams = false;
        this.player = null;
        this.type = StatusEffectAttackType.Root;

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


    _createClass(InmobilizePlayer, [{
        key: 'start',
        value: function start(player, particleBarn) {
            if (this.runningOnClient) {
                //
            } else {
                this.player = player;
                if (player.__type === GameObject.Type.Player) {
                    player.playAnim(Anim.StatusEffect, this.effectData.time, this.effectData.speed, this.effectData, this.effectData.id);
                    if (player.WeaponManager.currentAttack && player.WeaponManager.currentAttack.finishAttack) player.WeaponManager.currentAttack.finishAttack();
                } else if (player.__type === GameObject.Type.Npc) {
                    player.playClientAnimation(EnumNpcAnimations.Trap, this.effectData.id);
                }
                player.isRooted = true;
            }
            this.ticker = this.effectData.time;
        }

        /**
         * Resets the effect timer
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.ticker = this.effectData.time;
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
            if (!this.runningOnClient) {
                this.player.isRooted = true;
                this.setEffectPercentage(this.ticker * 100.0 / this.effectData.time);
            }
        }

        /**
         * Stops the effect
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (!this.runningOnClient) {
                this.player.isRooted = false;
                this.setEffectPercentage(0.0);
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

    return InmobilizePlayer;
}();

module.exports = {
    InmobilizePlayer: InmobilizePlayer
};
