"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//@ts-check
var StatusEffects = require("./statusEffects.js");
var math = require("./math.js");
var v2 = require("./v2.js");

var ShieldEffect = function () {
    /**
     * Constructor
     * @param {boolean} runningOnClient Indicates if the effect will run on the client or the server 
     */
    function ShieldEffect(runningOnClient, params) {
        var _this = this;

        _classCallCheck(this, ShieldEffect);

        this.id = 9;
        this.name = "m_shieldEffect";
        this.runningOnClient = runningOnClient;
        this.emitter = null;
        this.ticker = 0;
        this.percentage = 0;
        this.dirty = false;
        this.container = null;
        this.hasSpine = null;
        this.alpha = 0.0;
        this.imgScale = 1;
        this.spineDef = null;
        this.player = null;
        var statusEffect = StatusEffects.find(function (effect) {
            return effect.id === _this.id;
        });
        this.effectData = Object.assign({}, statusEffect, params || {});
    }

    _createClass(ShieldEffect, [{
        key: 'start',
        value: function start(player, particleBarn) {
            var _this2 = this;

            this.player = player;
            if (this.runningOnClient) {
                this.layer = this.player.layer;
                var spineDef = this.effectData.spine;
                this.spineDef = spineDef;
                var useSpine = spineDef && spineDef.enabled && player.SpineObjManager && player.SpineObjManager.canUseSpine();

                if (useSpine) {
                    player.WeaponManager.addAttackVisuals(this, this.effectData);
                    this.container.pivot.set(0.0, 0.0);

                    var playShield = function playShield() {
                        player.SpineObjManager.playAnimation(_this2.spine, spineDef.idle, null, true);
                    };

                    player.SpineObjManager.playAnimation(this.spine, spineDef.preAnimation, playShield, false);
                } else if (this.effectData.particle) {
                    this.emitter = particleBarn.addEmitter(this.effectData.particle, {
                        pos: player.pos,
                        layer: player.layer
                    });
                }
            }
            this.ticker = this.effectData.duration;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.ticker = this.effectData.duration;
        }
    }, {
        key: 'update',
        value: function update(player, dt) {
            if (this.emitter) {
                this.emitter.pos = v2.add(player.pos, v2.create(0.0, 0.1));
                this.emitter.layer = player.renderLayer;
                this.emitter.zOrd = player.renderZOrd + 1;
            }
            if (this.runningOnClient) {
                return;
            }

            player.shieldTicker = this.ticker;

            if (this.ticker <= 0) {
                player.shieldTicker = 0.0;
            }
            this.setEffectPercentage(this.ticker * 100.0 / this.effectData.duration);
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (!this.runningOnClient) {
                this.player.shieldTicker = 0.0;
                this.setEffectPercentage(0.0);
                return;
            }

            if (this.emitter) {
                this.emitter.stop();
                this.emitter = null;
            }

            if (this.hasSpine) {
                if (this.spineDef && this.spineDef.endAnimation) this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.endAnimation, this.freeSpine.bind(this), false);else this.freeSpine();
            }
        }
    }, {
        key: 'setEffectPercentage',
        value: function setEffectPercentage(value) {
            var prev = this.percentage;
            this.percentage = math.clamp(value, 0.0, 100.0);

            if (prev !== this.percentage) {
                this.dirty = true;
            }
        }
    }, {
        key: 'render',
        value: function render(camera, debug, DebugLines) {
            if (!this.container) return;

            var screenPos = camera.pointToScreen(this.player.pos);
            var screenScale = camera.pixels(this.imgScale);

            this.container.position.set(screenPos.x, screenPos.y);
            this.container.scale.set(screenScale, screenScale);

            //Update pixi obj on renderer to update layer
            this.player.WeaponManager.renderer.addPIXIObj(this.container, this.player.renderLayer, this.player.renderZIdx);
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            //this.container.removeChild(this.spine);
            this.player.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
        }
    }]);

    return ShieldEffect;
}();

module.exports = ShieldEffect;
