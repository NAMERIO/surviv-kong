"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * powerStatEffect.js
 * Boost the player power for a certain time
 */

var GameConfig = require("./gameConfig.js");
var v2 = require("./v2.js");
var StatusEffects = require("./statusEffects.js");
var math = require("./math.js");

var PowerStatEffect = function () {
    /**
     * Constructor
     * @param {boolean} runningOnClient Indicates if the effect will run on the client or the server 
     */
    function PowerStatEffect(runningOnClient, params) {
        _classCallCheck(this, PowerStatEffect);

        this.id = 3;
        this.name = "m_powerStatEffect";
        this.runningOnClient = runningOnClient;
        this.emitter = null;
        this.ticker = 0;
        this.percentage = 0;
        this.dirty = false;
        this.hadParams = false;

        //This effect atributtes
        if (!runningOnClient) {
            this.durationTime = params.durationTime;
            this.powerMultiplier = params.powerMultiplier;
        }

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


    _createClass(PowerStatEffect, [{
        key: 'start',
        value: function start(player, particleBarn) {
            if (this.runningOnClient) {
                // Added the particle emitter
                this.emitter = particleBarn.addEmitter(this.effectData.particle, {
                    pos: player.pos,
                    layer: player.layer
                });
            }
            this.ticker = this.durationTime;
        }

        /**
         * Resets the effect timer
         */

    }, {
        key: 'reset',
        value: function reset() {
            this.ticker = this.durationTime;
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
                player.statscontroller.increasePotionsPower(this.powerMultiplier);
                if (this.ticker <= 0) {
                    player.statscontroller.increasePotionsPower(0);
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

    return PowerStatEffect;
}();

module.exports = {
    PowerStatEffect: PowerStatEffect
};
