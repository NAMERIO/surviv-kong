"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * applyEffectToNearbyEnemies.js
 * This apply an effect to all enemies nearby (area specified in skill definition)
 */

var math = require("./math.js");
var SkillsEnum = require("./skillsEnum.js");
var GameConfig = require("./gameConfig.js");
var GameObject = require("./gameObject.js");
var StatusEffect = require("./statusEffect.js");
var AnimationData = require("./animationData.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var ApplyEffectToNearbyEnemies = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {import('./../weaponManager')} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function ApplyEffectToNearbyEnemies(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        _classCallCheck(this, ApplyEffectToNearbyEnemies);

        //Obligatory attack attributes
        this.id = SkillsEnum.ApplyEffectToNearbyEnemies;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;
        this.WeaponManager = weaponManager;
        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        this.timeActive = 0;
        this.timeActiveOld = 0;

        //This skill attributes
        this.active = false;
        this.cancelable = this.attackDef.cancelable;
        this.auraorbDir = 1.0;
        this.currentPulseRad = 0.0;
        this.layer = this.player.layer;
        this.effectRad = this.attackDef.behaviourParams.rad;
        this.statusEffects = this.attackDef.behaviourParams.effects;
        this.skillEffectTicker = this.attackDef.behaviourParams.duration;
        this.damage = this.attackDef.behaviourParams.damage ? (this.weaponDef.baseDamage || 0) + this.attackDef.behaviourParams.damage : null;

        this.start();
    }

    _createClass(ApplyEffectToNearbyEnemies, [{
        key: 'start',
        value: function start() {
            if (this.WeaponManager.isRunningOnClient) {
                this.spineDef = this.attackDef.behaviourParams.spine;
                this.WeaponManager.addAttackVisuals(this, this.attackDef.behaviourParams);

                this.auraContainer = this.sprite;
                if (this.hasSprite) {
                    this.container.pivot.set(0, 0.0);
                    this.container.visible = true;

                    if (this.hasSpine && this.spineDef) {
                        //this.auraContainer = this.spine;
                        this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.idle, null, false);
                    } else {
                        this.sprite.anchor.set(0.5, 0.5);
                        this.auraContainer.scale.set(0.1, 0.1);

                        var auraRad = this.effectRad * this.attackDef.behaviourParams.worldImg.auraScale;
                        this.auraMaxRad = auraRad;
                    }
                }
            }
            this.active = true;
        }

        /**
         * Play attack animation when is called 
         * Used when dash is complete, if current attack have a dash before the attack
         */

    }, {
        key: 'playAttackAnimation',
        value: function playAttackAnimation() {}
        //


        /**
         * Updates the current attack behaviour
         * Get the players in the current radius and calculate the direction to push them
         * @param {float} dt Delta time since the last call to update
         * @param {Object} toMouseLen Has the direction of the client cursor in a vector: {x: float, y: float}, normalized from -1 to 1
         */

    }, {
        key: 'update',
        value: function update(dt, toMouseLen) {
            this.timeActiveOld = this.timeActive;
            this.timeActive += dt;
            if (this.skillEffectTicker > 0.0) {
                this.skillEffectTicker -= dt;
                if (this.currentPulseRad < this.effectRad) {
                    this.currentPulseRad = this.currentPulseRad + 0.1;
                }

                if (this.layer != this.player.layer) this.layer = this.player.layer;

                if (this.WeaponManager.isRunningOnClient) {
                    if (this.auraContainer && !this.hasSprite) {
                        var pulseSpeed = 10;
                        var pulseScaleDelta = 5;

                        var tempRad = this.auraContainer.scale.x + 0.1;
                        if (tempRad < this.auraMaxRad) {
                            this.auraContainer.scale.set(tempRad, tempRad);
                        }

                        this.auraPulseTicker = math.clamp(this.auraPulseTicker + dt * this.auraorbDir * pulseSpeed, 0.0, 1.0);
                        var pulseAlpha = math.easeOutExpo(this.auraPulseTicker) * pulseScaleDelta + (1.0 - pulseScaleDelta);
                        if (this.auraPulseTicker >= 1.0 || this.auraPulseTicker <= 0.0) {
                            this.auraorbDir *= -1.0;
                        }

                        this.auraContainer.alpha = pulseAlpha;
                    }
                }
            } else {
                this.currentPulseRad = 0.0;

                if (this.WeaponManager.isRunningOnClient) {
                    if (this.spine) this.freeSpine();
                    this.container.visible = false;
                }
                this.active = false;
            }

            return this.active;
        }

        /**
         * Apply all status effects in definition to target
         * @param {Class} target Player class of enemy to apply status effect
         */

    }, {
        key: 'applyStatusEffects',
        value: function applyStatusEffects(target) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.statusEffects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var effect = _step.value;

                    if (effect.needExtraParams) effect.params = Object.assign(effect.params, this.getEffectExtraParams(effect.name));
                    StatusEffect.tryApplyEffectWithChance(effect.name, target, effect.chance, effect.params);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Get extra parameter to apply status effect if needed
         * @param {String} effectName Name of the effect set on status-effects.json
         */

    }, {
        key: 'getEffectExtraParams',
        value: function getEffectExtraParams(effectName) {
            switch (effectName) {
                case 'm_movePlayerEffect':
                    return { attackPlayerPos: this.player.pos };
                default:
                    console.error('There is no extra parameters in melee attack, set for effect: ', effectName);
                    break;
            }
        }

        /**
         * Render the attack client side
         * @param {*} camera 
         * @param {*} debug 
         * @param {*} DebugLines 
         */

    }, {
        key: 'render',
        value: function render(camera, debug, DebugLines) {
            if (this.active && !this.hasSprite) return;

            var screenPos = camera.pointToScreen(this.player.pos);
            var screenScale = camera.pixels(this.imgScale);

            this.container.position.set(screenPos.x, screenPos.y);
            this.container.scale.set(screenScale, screenScale);
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.player.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
        }
    }]);

    return ApplyEffectToNearbyEnemies;
}();

module.exports = ApplyEffectToNearbyEnemies;
