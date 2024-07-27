"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * movePlayerEffect.js
 * Push the player in the direction received
 */

var v2 = require("./v2.js");
var math = require("./math.js");
var GameObject = require("./gameObject.js");
var StatusEffects = require("./statusEffects.js");

var kDirections = {
    right: 0,
    top: 1,
    left: 2,
    down: 3,
    topRight: 4,
    topLeft: 5,
    downLeft: 6,
    downRight: 7
};

var kInverseDirections = [2, //right -> left
3, //top -> down
0, //left -> right
1, //down -> top
6, //topRight -> downLeft
7, //topLeft -> downRight
4, //downLeft -> topRight
5];

var kMinDiffXY = 2;

var MovePlayerEffect = function () {
    /**
     * Constructor
     * @param {boolean} runningOnClient Indicates if the effect will run on the client or the server 
     * @param {Object} params Extra attributes needed for the effect or replacement for definition attributes
     */
    function MovePlayerEffect(runningOnClient, params) {
        _classCallCheck(this, MovePlayerEffect);

        this.id = 2;
        this.name = "m_movePlayerEffect";
        this.runningOnClient = runningOnClient;
        this.emitter = null;
        this.ticker = 0;
        this.percentage = 0;
        this.dirty = false;
        this.hadParams = false;

        //This effect atributtes
        if (!runningOnClient) {
            this.dir = 0;
            this.attackPlayerPos = params.attackPlayerPos;
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


    _createClass(MovePlayerEffect, [{
        key: 'start',
        value: function start(player, particleBarn) {
            if (this.runningOnClient) {
                // Added the particle emitter
                if (this.effectData.particle) {
                    this.emitter = particleBarn.addEmitter(this.effectData.particle, {
                        pos: player.pos,
                        layer: player.layer
                    });
                }
            } else {
                this.player = player;
                player.isRooted = true;
                this.calculateDirectionToMove(player);
            }
            this.ticker = this.effectData.duration;
        }

        /**
         * Resets the effect timer
         * @param {player} player Reference to the player that has the effect 
         * @param {Object} params Extra attributes needed for the effect or replacement for definition attributes
         */

    }, {
        key: 'reset',
        value: function reset(player, params) {
            if (this.hadParams) {
                // Look in the effects json for the effect data
                var _length = StatusEffects.length;
                for (var i = 0; i < _length; i++) {
                    if (StatusEffects[i].id == this.id) {
                        if (params) {
                            this.attackPlayerPos = params.attackPlayerPos;
                            this.effectData = Object.assign({}, StatusEffects[i]); //Copy def so we don't modified it if needed again
                            this.effectData = Object.assign(this.effectData, params); //Replace defaults with params if given
                            this.hadParams = true;
                        } else {
                            this.effectData = Object.assign({}, StatusEffects[i]);
                            this.hadParams = false;
                        }
                        break;
                    }
                }
            }

            this.player.isRooted = true;
            this.calculateDirectionToMove(player);
            this.ticker = this.effectData.duration;
        }

        /**
         * Caculates the direction to move based on the attacker position
         * @param {player} player Reference to the player that has the effect 
         */

    }, {
        key: 'calculateDirectionToMove',
        value: function calculateDirectionToMove(player) {
            //Calculate direction
            var distX = this.attackPlayerPos.x - player.pos.x;
            var distY = this.attackPlayerPos.y - player.pos.y;

            var distXABS = Math.abs(distX);
            var distYABS = Math.abs(distY);
            var diffXY = distXABS >= distYABS ? distXABS - distYABS : distYABS - distXABS;
            var effectDirection = null;
            // Divide the x, y plain in 8 sections
            if (distX >= 0.0 && distY >= 0.0) {
                if (diffXY <= kMinDiffXY) effectDirection = kDirections.downLeft;else if (distX > distY) effectDirection = kDirections.left;else effectDirection = kDirections.down;
            }

            if (distX <= 0.0 && distY >= 0.0) {
                var distXUnsigned = -distX + 1;
                if (diffXY <= kMinDiffXY) effectDirection = kDirections.downRight;else if (distXUnsigned > distY) effectDirection = kDirections.right;else effectDirection = kDirections.down;
            }

            if (distX <= 0.0 && distY <= 0.0) {
                var _distXUnsigned = -distX + 1;
                var distYUnsigned = -distY + 1;
                if (diffXY <= kMinDiffXY) effectDirection = kDirections.topRight;else if (_distXUnsigned > distYUnsigned) effectDirection = kDirections.right;else effectDirection = kDirections.top;
            }

            if (distX >= 0.0 && distY <= 0.0) {
                var _distYUnsigned = -distY + 1;
                if (diffXY <= kMinDiffXY) effectDirection = kDirections.topLeft;else if (distX > _distYUnsigned) effectDirection = kDirections.left;else effectDirection = kDirections.top;
            }

            if (this.effectData.inverseDirection) this.dir = kInverseDirections[effectDirection];else this.dir = effectDirection;
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
                var time = this.effectData.duration;
                this.setEffectPercentage(this.ticker * 100.0 / time);
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
                    this.player.isRooted = false;
                    if (this.player.__type === GameObject.Type.Npc) this.player.allowDespawn();
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

    return MovePlayerEffect;
}();

module.exports = {
    MovePlayerEffect: MovePlayerEffect
};
