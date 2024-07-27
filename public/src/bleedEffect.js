"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * bleedEffect.js
 * This class represents the bleed status effect of the game
 */

var v2 = require("./v2.js");
var math = require("./math.js");
var GameConfig = require("./gameConfig.js");
var StatusEffects = require("./statusEffects.js");

var _require = require("./cb7a977d.js"),
    StatusEffectAttackType = _require.StatusEffectAttackType;

var BleedEffect = function () {
    /**
     * Constructor
     * @param {boolean} runningOnClient Indicates if the effect will run on the client or the server 
     */
    function BleedEffect(runningOnClient, params) {
        _classCallCheck(this, BleedEffect);

        this.id = 12;
        this.name = "m_bleedEffect";
        this.runningOnClient = runningOnClient;
        this.emitter = null;
        this.ticker = 0;
        this.percentage = 0;
        this.dirty = false;
        this.hadParams = false;
        this.type = StatusEffectAttackType.Bleed;

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


    _createClass(BleedEffect, [{
        key: 'start',
        value: function start(player, particleBarn) {
            if (this.runningOnClient) {
                // Added the particle emitter
                this.emitter = particleBarn.addEmitter(this.effectData.particle, {
                    pos: player.pos,
                    layer: player.layer,
                    dir: v2.create(0.0, -1.0)
                });
            } else {
                //This effect attributes
                this.lastPlayerPosition = v2.copy(player.pos);
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
            if (this.emitter) {
                this.emitter.pos = v2.add(player.pos, v2.create(0.0, 0.1));
                this.emitter.layer = player.renderLayer;
                this.emitter.zOrd = player.renderZOrd + 1;
            }
            if (!this.runningOnClient) {
                var diferenceBetweenPos = v2.length(v2.sub(player.pos, this.lastPlayerPosition));
                if (diferenceBetweenPos) {
                    //Damage only while moving
                    damageList.addHit({
                        damageType: GameConfig.DamageType.Bleeding,
                        targetId: player.__id,
                        dir: player.dir ? v2.copy(player.dir) : 0,
                        damage: this.effectData.damage
                    });
                    this.lastPlayerPosition = v2.copy(player.pos);
                }
                this.setEffectPercentage(this.ticker * 100.0 / this.effectData.time);
            }
        }

        /**
         * Stops the effect
         */

    }, {
        key: 'stop',
        value: function stop() {
            if (this.runningOnClient && this.emitter) {
                this.emitter.stop();
                this.emitter = null;
            } else {
                if (!this.runningOnClient) {
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

    return BleedEffect;
}();

module.exports = BleedEffect;
