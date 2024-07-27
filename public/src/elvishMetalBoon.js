"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//@ts-check
var math = require("./math.js");
var kRadius = 16.0;
var kTickerInterval = 2.0;

var ElvishMetalBoon = function () {
    function ElvishMetalBoon(player, isRunningOnClient, def, params) {
        _classCallCheck(this, ElvishMetalBoon);

        this.id = 0;
        this.isRunningOnClient = isRunningOnClient;
        this.player = player;
        this.active = false;
        this.radius = kRadius;
        this.activationTicker = 0.0;
        this.def = def;
        this.params = params;
        this.layer = this.player.layer;
        this.auraorbDir = 1.0;
        this.hasSprite = false;
        this.sprite = null;
        this.container = null;
        this.imgScale = 1.0;
        this.auraRad = 2.0;
        this.serializable = true;
        this.initialized = false;
        this.spine = null;
        this.spineDef = this.def.spine;
    }

    _createClass(ElvishMetalBoon, [{
        key: "start",
        value: function start() {
            if (this.isRunningOnClient && !this.initialized) {
                this.player.WeaponManager.addAttackVisuals(this, this.def, this.layer);
                this.auraContainer = this.sprite;

                if (this.spine) {
                    this.player.container.addChildAt(this.spine, 0);
                    this.spine.scale.set(this.spineDef.scale);
                    this.container.pivot.set(0);
                    this.player.SpineObjManager.playAnimation(this.spine, this.def.spine.idle, null, true);
                } else if (this.hasSprite) {
                    this.container.pivot.set(0, 0.0);
                    this.container.visible = true;
                    this.sprite.anchor.set(0.5, 0.5);
                    this.auraContainer.scale.set(0.1, 0.1);
                    var auraRad = 2 * this.def.worldImg.auraScale;
                    this.auraMaxRad = auraRad;
                }
                this.initialized = true;
                return;
            }
        }
    }, {
        key: "update",
        value: function update(dt) {
            if (this.isRunningOnClient) {
                if (!this.initialized) {
                    this.start();
                }
                if (this.active && !this.spine && this.auraContainer) {
                    this.updateClientPlayerVisuals(dt);
                }
                return;
            }

            if (this.activationTicker > 0.0) {
                this.activationTicker -= dt;
            }

            if (this.activationTicker <= 0.0) {
                this.active = false;
            }

            if (this.active) {
                return;
            }

            var nearbyEnemies = this.player.WeaponManager.findNearbyTargets(this.radius, this.radius, false);

            if (nearbyEnemies.length > 0) {
                this.active = true;
            }

            if (this.active) {
                this.activationTicker = kTickerInterval;
            }
        }
    }, {
        key: "updateData",
        value: function updateData(data) {
            this.auraPulseTicker = !this.active && data.active ? 0.0 : this.auraPulseTicker;
            this.active = data.active;
        }
    }, {
        key: "updateClientPlayerVisuals",
        value: function updateClientPlayerVisuals(dt) {
            var pulseSpeed = 1;
            var pulseScaleDelta = 5;

            var tempRad = this.auraContainer.scale.x + 0.1;

            this.auraPulseTicker = math.clamp(this.auraPulseTicker + dt * this.auraorbDir * pulseSpeed, 0.0, 1.0);

            if (tempRad < this.auraMaxRad) {
                this.auraContainer.scale.set(this.auraPulseTicker);
            }

            var pulseAlpha = math.easeOutExpo(this.auraPulseTicker) * pulseScaleDelta + (1.0 - pulseScaleDelta);
            if (this.auraPulseTicker >= 1.0 || this.auraPulseTicker <= 0.0) {
                this.auraorbDir *= -1.0;
            }

            this.auraContainer.alpha = pulseAlpha;
        }
    }, {
        key: "stop",
        value: function stop() {
            if (this.isRunningOnClient) {
                if (this.spine) {
                    this.player.container.removeChildAt(this.spine, 0);
                    this.freeSpine();
                }
                return;
            }
        }
    }, {
        key: "freeSpine",
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.player.SpineObjManager.freeSpine(this.spine, this.def.spine.spineType);
            this.spine = null;
        }

        /**
        * Render the attack client side
        * @param {*} camera 
        * @param {*} debug 
        */

    }, {
        key: "render",
        value: function render(camera, debug, debugLines) {
            if (!this.initialized) {
                return;
            }

            var container = this.spine || this.container;
            container.visible = this.active;

            if (debug && debug.debugLines) {
                debugLines.addCircle(this.player.pos, this.radius, 0xff8c8c, 0.0);
            }

            if (!this.spine) {
                var screenPos = camera.pointToScreen(this.player.pos);
                var screenScale = camera.pixels(this.imgScale);
                container.position.set(screenPos.x, screenPos.y);
                container.scale.set(screenScale, screenScale);
            }
        }
    }]);

    return ElvishMetalBoon;
}();

module.exports = ElvishMetalBoon;
