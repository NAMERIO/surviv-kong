"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * weaponManager.js
 * This file manages the equipped main weapon and off hand, will create attacks, control cooldowns and other things related with the equipped weapon
 * The weapon manager assumes that in the weapon definition will exist at least a lightAttack and heavyAttack
 */

//Imports
var v2 = require("./v2.js");
var assert = require("./0e566746.js");
var net = require("./net.js");
var math = require("./math.js");
var util = require("./util.js");
var collider = require("./collider.js");

var SkillsEnum = require("./skillsEnum.js");
var GameConfig = require("./gameConfig.js");
var GameObject = require("./gameObject.js");
var StatusEffect = require("./statusEffect.js");
var GameObjectDefs = require("./gameObjectDefs.js");

var Anim = require("./animationData.js").EnumPlayerAnimType;

//Attack behaviours
var DeployTrap = require("./deployTrap.js");
var CrusherAttack = require("./crusherAttack.js");
var CycloneAttack = require("./cycloneAttack.js");
var OrbitalAttack = require("./orbitalAttack.js");
var DashAttackMelee = require("./dashAttackMelee.js");
var HeavyAttackStaff = require("./heavyAttackStaff.js");
var HeavyAttackSword = require("./heavyAttackSword.js");
var RangeAttackSword = require("./rangeAttackSword.js");
var NormalAttackRange = require("./normalAttackRange.js");
var NormalAttackMelee = require("./normalAttackMelee.js");
var ApplyStatusEffect = require("./applyStatusEffect.js");
var BladeFlurryAttack = require("./bladeFlurryAttack.js");
var VariableDamageRange = require("./variableDamageRange.js");
var ApplyEffectToNearbyEnemies = require("./applyEffectToNearbyEnemies.js");
var DashAttackWithAnticipation = require("./dashAttackWithAnticipation.js");
var ThrowablesAttack = require("./throwablesAttack.js");

var WeaponManager = function () {
    /**
     * Constructor
     * @param {boolean} isRunningOnClient Indicates if the manager will run on the client or the server
     * @param {Player} player Class of the current player
     * @param {TrapManager} trapManager Class of the manager to create and control traps
     * @param {String} initialMainWeapon Id of the initial main weapon to be equipped only server side
     * @param {String} initialOffHand Id of the initial off hand to be equipped only server side
     */
    function WeaponManager(isRunningOnClient, player, trapManager) {
        var initialMainWeapon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var initialOffHand = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        _classCallCheck(this, WeaponManager);

        this.player = player;

        this.map = null;
        this.playerBarn = null;

        //Other atributes
        this.isRunningOnClient = isRunningOnClient;
        this.currentAttack = null;
        this.isAttacking = false;
        this.attackHoldTime = 0.0;

        //Damage extra added by status effect
        this.extraStatusDamage = 0.0;

        this.currentMainWeapon = null;
        this.mainWeaponDef = null;
        this.mainWeaponAvailableSkillsIds = [];

        this.currentOffHand = null;
        this.offHandDef = null;
        this.offHandAvailableSkillsIds = [];

        this.mainWeaponCooldowns = {};
        this.offHandCooldowns = {};

        this.skillParams = {};

        this.resetHoldAttackZoom = true;
        this.resetSkillZoom = true;
        this.resetHeavyHoldTime = true;

        this.initialized = false;

        //Client attributes
        this.activeMainWeaponCooldowns = {};
        this.activeOffHandCooldowns = {};
        this.selectedSkill = GameConfig.SelectedSkill.None;
        this.lastSkill = GameConfig.SelectedSkill.None;
        this.resetSkillCooldowns = false;
        this.isWeaponSet = true; //false;
        this.isOffHandSet = true; //false;
        this.isCurrentAttackSkill = false;

        this.activeThrowables = []; //Player current throwables displayed


        if (this.isRunningOnClient) {
            this.PIXI = null;
            this.renderer = null;
            this.particleBarn = null;
            this.audioManager = null;
        }
    }

    _createClass(WeaponManager, [{
        key: 'init',
        value: function init(player, map, renderer, playerBarn, particleBarn, audioManager) {
            this.initialized = true;
            this.map = map;
            this.renderer = renderer;
            this.playerBarn = playerBarn;
            this.particleBarn = particleBarn;
            this.audioManager = audioManager;

            if (!this.player) this.player = player;
        }

        /**
         * Swaps the current weapon with a new one
         * @param {String} newWeapon Id of the main weapon to be equipped
         */

    }, {
        key: 'changeWeapon',
        value: function changeWeapon(newWeapon) {
            var weaponDef = GameObjectDefs[newWeapon];
            assert(weaponDef, 'Main weapon not found on change with id: ' + newWeapon);

            this.currentMainWeapon = newWeapon;
            this.mainWeaponDef = weaponDef;
            this.mainWeaponAvailableSkillsIds = Object.keys(this.mainWeaponDef.attacks);

            //Reset zoom (for skills that modify it)
            this.resetChangedZoom(true);

            //Reset cooldowns
            if (this.isRunningOnClient) this.resetSkillCooldowns = true;
            if (this.isWeaponSet) {
                this.attackHoldTime = 0.0;
                this.mainWeaponCooldowns = {};

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.mainWeaponAvailableSkillsIds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var attackId = _step.value;

                        this.mainWeaponCooldowns[attackId] = 0.0;
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

            /*if (this.isRunningOnClient && this.mainWeaponDef) {
                if (this.player.spineObj) {
                    this.isWeaponSet = true;
                    this.player.changeSlotAttachmentRegion('hero_mainhand_weapon', this.mainWeaponDef.spineAsset);
                }
                else
                    this.isWeaponSet = false;
            }*/
        }

        /**
         * Swaps the current off hand with a new one 
         * @param {String} newOffHand Id of the off hand to be equipped
         */

    }, {
        key: 'changeOffHand',
        value: function changeOffHand(newOffHand) {
            if (newOffHand && newOffHand != 'none') {
                var offHandDef = GameObjectDefs[newOffHand];
                assert(offHandDef, 'Off hand not found on change with id: ' + newOffHand);

                this.currentOffHand = newOffHand;
                this.offHandDef = offHandDef;
                this.offHandAvailableSkillsIds = Object.keys(this.offHandDef.skills);

                if (this.isOffHandSet) {
                    this.offHandCooldowns = {};

                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = this.offHandAvailableSkillsIds[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var skillId = _step2.value;

                            this.offHandCooldowns[skillId] = 0.0;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } else if (newOffHand === 'none' && this.isRunningOnClient) {
                this.currentOffHand = null;
            }
        }

        /**
         * Remove offHand when player runs it or is not selected
         * @param {offHandExecuted} offHand has been executed 
         */

    }, {
        key: 'removeOffHand',
        value: function removeOffHand() {
            var offHandExecuted = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


            if (this.currentOffHand) {

                this.currentOffHand = null;
                this.offHandDef = null;
                this.offHandAvailableSkillsIds = [];

                if (this.isRunningOnClient) {

                    this.player.changeSkinSlot(GameConfig.SkinSlots.OffHand, '');
                } else {

                    if (this.isOffHandSet) {
                        this.offHandCooldowns = {};

                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = this.offHandAvailableSkillsIds[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var skillId = _step3.value;

                                this.offHandCooldowns[skillId] = 0.0;
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }
                    var itemSlotId = this.skillParams.slotId - 1;

                    if (offHandExecuted && itemSlotId >= 0) {
                        if (this.player.slotsInventory[itemSlotId].total > 0) {
                            this.player.slotsInventory[itemSlotId].total -= 1;
                            if (this.player.slotsInventory[itemSlotId].total == 0) {
                                this.player.slotsInventory[itemSlotId].item = '';
                            }
                            this.player.inventoryDirty = true;
                        }
                    }
                }
            } else if (this.isRunningOnClient) {
                this.player.changeSkinSlot(GameConfig.SkinSlots.OffHand, '');
            }
        }

        /**
         * @param {number} skill 
         * @param {Object} params Object with the necessary params for the skill, mainly used for throwables
         */

    }, {
        key: 'setSelectedSkill',
        value: function setSelectedSkill(skill) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (this.isSkill(skill) && !this.canSelectSkill(skill)) {
                return;
            }

            this.selectedSkill = skill;

            if (params) {
                this.skillParams = params;
                this.skillParams.slotItem = params.itemDef ? params.itemDef.id : '';
            }

            if (this.isHoldTimeHeavyAttack()) {
                this.attackHoldTime = 0;
            }
            this.checkSkillZoom();
        }

        /**Check if skill should change player zoom
         * 
         */

    }, {
        key: 'checkSkillZoom',
        value: function checkSkillZoom() {
            var delayTimeCheckZoom = 0;
            if (this.resetSkillZoom || this.resetHoldAttackZoom) delayTimeCheckZoom = 5; //Add small delay so it can update the current zoom properly

            setTimeout(this.setSkillZoom.bind(this, false), delayTimeCheckZoom);
        }
    }, {
        key: 'hasSelectedSkill',
        value: function hasSelectedSkill() {
            return this.selectedSkill !== GameConfig.SelectedSkill.None;
        }

        /**
         * Return speed penalty for current selected skill or heavy attack hold
         * @returns Speed penalty
         */

    }, {
        key: 'getSelectedSkillSpeedPenalty',
        value: function getSelectedSkillSpeedPenalty() {
            if (!this.hasSelectedSkill() && !this.isHoldTimeHeavyAttack()) return 0;

            var skillDef = this.isHoldTimeHeavyAttack() ? this.mainWeaponDef.attacks.heavyAttack : this.selectedSkillDef;
            if (skillDef && skillDef.holdSpeedPenalty) return skillDef.holdSpeedPenalty;

            return 0;
        }

        /**
         * Return speed penalty for current active skill
         * @returns Speed penalty
         */

    }, {
        key: 'getActiveSkillSpeedPenalty',
        value: function getActiveSkillSpeedPenalty() {
            if (!this.currentAttack || !this.currentAttack.attackDef.useSpeedPenalty) return 0;

            return this.currentAttack.attackDef.useSpeedPenalty;
        }
    }, {
        key: 'clearSelectedSkill',
        value: function clearSelectedSkill() {
            this.lastSkill = this.selectedSkill;
            this.selectedSkill = GameConfig.SelectedSkill.None;
            this.skillParams = {
                slotId: GameConfig.Slots.None
            };
        }
    }, {
        key: 'canSelectSkill',
        value: function canSelectSkill(skillId) {
            return this.getCooldown('skill_' + skillId, false) <= 0 && (!this.currentAttack || this.currentAttack && this.lastSkill != skillId);
        }
    }, {
        key: 'isSkill',
        value: function isSkill(skillType) {
            switch (skillType) {
                case GameConfig.SelectedSkill.Throwable:
                case GameConfig.SelectedSkill.Consumable:
                case GameConfig.SelectedSkill.OffHand:
                case GameConfig.SelectedSkill.None:
                    return false;
                default:
                    return true;
            }
        }
    }, {
        key: 'executeSelectedSkill',
        value: function executeSelectedSkill() {
            if (!this.player.isRooted) {
                //StatusEffect.cleanStatusOnAction(this.player);

                switch (this.selectedSkill) {
                    case GameConfig.SelectedSkill.Throwable:
                        this.throwThrowable();
                        break;
                    case GameConfig.SelectedSkill.Consumable:
                        if (this.player.canUseItem(this.skillParams.slotId - 1)) {
                            this.cancelCurrentAttack(null, false, true);
                            this.player.tryUseItem(this.skillParams.slotId - 1);
                            this.isAttacking = false;
                        }
                        break;
                    case GameConfig.SelectedSkill.OffHand:
                        this.tryExecuteAttack('skill_1', true);
                        break;
                    default:
                        this.tryExecuteAttack(this.selectedSkillId);
                        this.isCurrentAttackSkill = true;
                        break;
                }
            }
            this.clearSelectedSkill();
        }
    }, {
        key: 'cancelCurrentAttack',
        value: function cancelCurrentAttack(attackId, isOffhand, force) {
            var weaponDef = isOffhand ? this.offHandDef : this.mainWeaponDef;

            if (this.currentAttack && this.currentAttack.cancelable && this.isCurrentAttackSkill && weaponDef && (force || this.currentAttack.weaponDef.id === weaponDef.id && attackId !== this.currentAttack.attackDef.id || this.currentAttack.weaponDef.id !== weaponDef.id)) {

                if (this.isRunningOnClient && this.currentAttack.playEndFxAnimation) this.currentAttack.playEndFxAnimation();

                this.isAttacking = false;
            }
        }

        /**
         * Change the current attack to execute in update()
         * @param {String} attackId Id of the attack definition to execute
         */

    }, {
        key: 'tryExecuteAttack',
        value: function tryExecuteAttack(attackId, isOffHand) {

            this.cancelCurrentAttack(attackId, isOffHand);

            var cooldown = this.getCooldown(attackId, isOffHand);

            if (cooldown === undefined || cooldown > 0 || this.isAttacking || this.player.isRooted) {
                return;
            }

            var attackDef = isOffHand ? this.offHandDef.skills[attackId] : this.mainWeaponDef.attacks[attackId];

            assert(attackDef, 'No attack definition found with attack id: ' + attackId);
            assert(attackDef.behaviourId, 'No behaviour id found on attack definition of ' + attackId);
            this.isAttacking = true;
            switch (attackDef.behaviourId) {
                case SkillsEnum.NormalAttackRange:
                    this.currentAttack = new NormalAttackRange(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.NormalAttackMelee:
                    this.currentAttack = new NormalAttackMelee(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.HeavyAttackStaff:
                    this.currentAttack = new HeavyAttackStaff(this.player, this, attackDef, isOffHand, this.attackHoldTime);
                    break;
                case SkillsEnum.HeavyAttackSword:
                    this.currentAttack = new HeavyAttackSword(this.player, this, attackDef, isOffHand, this.attackHoldTime);
                    break;
                case SkillsEnum.DashAttackMelee:
                    this.currentAttack = new DashAttackMelee(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.ApplyEffectToNearbyEnemies:
                    this.currentAttack = new ApplyEffectToNearbyEnemies(this.player, this, attackDef, isOffHand);

                    if (attackDef.behaviourParams && attackDef.behaviourParams.exploteThrowables) {
                        this.exploteActiveThrowables();
                    }
                    break;
                case SkillsEnum.RangeAttackSword:
                    this.currentAttack = new RangeAttackSword(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.CrusherAttack:
                    this.currentAttack = new CrusherAttack(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.CycloneAttack:
                    this.currentAttack = new CycloneAttack(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.DashAttackWithAnticipation:
                    this.currentAttack = new DashAttackWithAnticipation(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.VariableDamageRange:
                    this.currentAttack = new VariableDamageRange(this.player, this, attackDef, isOffHand, this.attackHoldTime);
                    break;
                case SkillsEnum.ApplyStatusEffect:
                    this.currentAttack = new ApplyStatusEffect(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.DeployTrap:
                    this.currentAttack = new DeployTrap(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.OrbitalAttack:
                    this.currentAttack = new OrbitalAttack(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.BladeFlurryAttack:
                    this.currentAttack = new BladeFlurryAttack(this.player, this, attackDef, isOffHand);
                    break;
                case SkillsEnum.CombineAttack:
                    //Normal attack range and deploy trap
                    this.currentAttack = new NormalAttackRange(this.player, this, attackDef, isOffHand, true);
                    break;
                case SkillsEnum.ThrowablesAttack:
                    this.currentAttack = new ThrowablesAttack(this.player, this, attackDef, isOffHand);
                    break;
                default:
                    this.isAttacking = false;
                    this.isCurrentAttackSkill = false;
                    break;
            }
            this.attackHoldTime = 0;

            if (isOffHand) {
                this.removeOffHand(true);
            }
        }

        /**
         * Updates the atributes related with the weapon, like current attack and cooldowns
         * @param {float} dt Delta time since the last call to update
         * @param {Object} toMouseLen Has the direction of the client cursor in a vector: {x: float, y: float}, normalized from -1 to 1
         * @param {Object} params Extra params like inputMsg on server
         */

    }, {
        key: 'update',
        value: function update(dt, toMouseLen) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            //Update active main hand weapon cooldowns
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.mainWeaponAvailableSkillsIds[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var attackId = _step4.value;

                    if (this.mainWeaponCooldowns[attackId] > 0) this.mainWeaponCooldowns[attackId] -= dt;else if (this.isRunningOnClient && this.activeMainWeaponCooldowns[attackId]) this.activeMainWeaponCooldowns[attackId] = false;
                }

                //Update off hand cooldowns
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.offHandAvailableSkillsIds[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var skillId = _step5.value;

                    if (this.offHandCooldowns[skillId] > 0) this.offHandCooldowns[skillId] -= dt;else if (this.isRunningOnClient && this.activeOffHandCooldowns[skillId]) this.activeOffHandCooldowns[skillId] = false;
                }

                //Update current attack
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            if (this.currentAttack) {
                var stillActive = this.currentAttack.update(dt, toMouseLen, params);
                if (!stillActive) {
                    this.currentAttack = null;
                }
            }

            /* strip_from_prod_client: start */
            this.resetChangedZoom(); //Check if needed to reset player camera zoom

            if (!this.isRunningOnClient) {
                if (params.inputMsg.lightAttackHold && (!this.isAttacking || this.currentAttack && this.currentAttack.attackDef.allowChargeHeavyAttack) && !this.hasSelectedSkill() && this.mainWeaponCooldowns.heavyAttack <= 0) this.attackHoldTime += dt;else if (this.resetHeavyHoldTime) {
                    this.attackHoldTime = 0;
                    this.resetHoldAttackZoom = true;
                }

                if (this.isHoldTimeHeavyAttack() && this.mainWeaponDef.attacks.heavyAttack.behaviourParams.changeZoomWhileCharging) {
                    this.setHoldAttackZoom();
                }
            }
            /* strip_from_prod_client: end */
        }

        /**
         * Update only for client when receive data from server
         * @param {Object} m_curWeapState Data received from server about the weapons state
         */

    }, {
        key: 'm_update',
        value: function m_update(m_curWeapState) {
            if (this.currentMainWeapon !== m_curWeapState.currentMainWeapon || !this.isWeaponSet) this.changeWeapon(m_curWeapState.currentMainWeapon);

            if (this.currentOffHand !== m_curWeapState.currentOffHand || !this.isOffHandSet) this.changeOffHand(m_curWeapState.currentOffHand);

            //Update selected skill
            this.selectedSkill = m_curWeapState.selectedSkill;
            if (this.selectedSkill == GameConfig.SelectedSkill.Throwable || this.selectedSkill == GameConfig.SelectedSkill.Consumable || this.selectedSkill == GameConfig.SelectedSkill.OffHand) {
                this.skillParams.slotId = m_curWeapState.selectedSlot;
                this.skillParams.slotItem = m_curWeapState.selectedSlotItem;
            } else {
                this.skillParams = {
                    slotId: GameConfig.Slots.None
                };
            }

            //Check if there are new cooldonws
            var m_mainWeaponCooldowns = m_curWeapState.weapCooldowns;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = m_mainWeaponCooldowns[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var Id = _step6.value;

                    var attackId = GameConfig.AttackTypesToStr[Id];
                    if (!this.activeMainWeaponCooldowns[attackId]) {
                        this.activeMainWeaponCooldowns[attackId] = true;
                        this.setCooldown(this.mainWeaponDef.attacks[attackId].cooldownTime, attackId, false);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            var m_offHandCooldowns = m_curWeapState.offHandCooldowns;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = m_offHandCooldowns[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _Id = _step7.value;

                    var skillId = GameConfig.AttackTypesToStr[_Id];
                    if (!this.activeOffHandCooldowns[skillId]) {
                        this.activeOffHandCooldowns[skillId] = true;
                        this.setCooldown(this.offHandDef.skills[skillId].cooldownTime, skillId, true);
                    }
                }

                //Execute attack
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            if (m_curWeapState.currentAttack !== 'none') {
                this.tryExecuteAttack(m_curWeapState.currentAttack, m_curWeapState.currentAttackIsOffHand);
            }

            this.isAttacking = m_curWeapState.isAttacking;

            if (m_curWeapState.isChargingAttack) {
                this.isChargingAttack = true;
                this.player.AnimationController.playActionAnimation(Anim.Charge_Attack, 2, false);
            } else {
                this.isChargingAttack = false;
                this.player.AnimationController.stopAnimation(0, Anim.Charge_Attack);
            }
        }

        /**
         * Change the player camera zoom based on the hold time
         */

    }, {
        key: 'setHoldAttackZoom',
        value: function setHoldAttackZoom() {
            var heavyBehaviourParams = this.mainWeaponDef.attacks.heavyAttack.behaviourParams;
            var blindEffect = StatusEffect.getPlayerEffect(8, this.player);

            if (heavyBehaviourParams.maxZoomRadius > this.player.zoom && !blindEffect) {
                //Calculate zoom with current holdtime
                var newZoom = heavyBehaviourParams.maxZoomRadius * (math.clamp(this.attackHoldTime, heavyBehaviourParams.minChargeTime, heavyBehaviourParams.maxChargeTime) / heavyBehaviourParams.maxChargeTime);

                newZoom += this.player.zoom;

                if (newZoom > this.player.zoom) {
                    newZoom = math.clamp(newZoom, this.player.zoom, heavyBehaviourParams.maxZoomRadius);
                    if (this.resetHoldAttackZoom) {
                        this.resetHoldAttackZoom = false;
                    }

                    this.player.setZoom(newZoom, this.mainWeaponDef.attacks.heavyAttack.zoomInSpeed, this.mainWeaponDef.attacks.heavyAttack.zoomOutSpeed);
                }
            }
        }

        /**
         * Change the player camera zoom while the skill is selected
         */

    }, {
        key: 'setSkillZoom',
        value: function setSkillZoom() {
            var resetSkill = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.resetChangedZoom(true);
            var blindEffect = StatusEffect.getPlayerEffect(8, this.player);

            if (this.isSkill(this.selectedSkill) && !blindEffect) {
                var skillBehaviourParams = this.selectedSkillDef;

                if (skillBehaviourParams && skillBehaviourParams.zoomRadius && skillBehaviourParams.zoomRadius > this.player.zoom) {
                    if (this.resetSkillZoom) {
                        this.resetSkillZoom = false;
                    }
                    this.player.setZoom(skillBehaviourParams.zoomRadius);
                }
            }
        }
    }, {
        key: 'resetChangedZoom',
        value: function resetChangedZoom() {
            var forceReset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this.resetSkillZoom && (!this.selectedSkill || forceReset)) {
                this.resetSkillZoom = true;
            }

            if (!this.resetHoldAttackZoom && (!this.isHoldTimeHeavyAttack() || forceReset)) {
                this.resetHoldAttackZoom = true;
            }
        }

        /**
         * Set the attack or skill cooldown
         * @param {float} cooldownTime Time of cooldown to set
         * @param {String} attackId Attack id to apply cooldown
         * @param {Boolean} isOffHand If attack is from off hand, default is false
         */

    }, {
        key: 'setCooldown',
        value: function setCooldown(cooldownTime, attackId) {
            var isOffHand = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (!isOffHand) {
                if (this.mainWeaponCooldowns[attackId] != undefined) this.mainWeaponCooldowns[attackId] = cooldownTime;
            } else {
                if (this.offHandCooldowns[attackId] != undefined) this.offHandCooldowns[attackId] = cooldownTime;
            }
        }

        /**
         * Get the attack or skill cooldown
         * @param {String} attackId Attack id to get cooldown
         */

    }, {
        key: 'getCooldown',
        value: function getCooldown(attackId, isOffHand) {
            return isOffHand ? this.offHandCooldowns[attackId] : this.mainWeaponCooldowns[attackId];
        }

        /**
         * @returns {Boolean} Will return true if the hold time of the attack is inside the range of a light attack
         */

    }, {
        key: 'isHoldTimeLightAttack',
        value: function isHoldTimeLightAttack() {
            var minChargeTime = this.player.isTouch() ? this.mainWeaponDef.attacks.heavyAttack.behaviourParams.minChargeTimeTouch : this.mainWeaponDef.attacks.heavyAttack.behaviourParams.minChargeTime;

            if (this.attackHoldTime < minChargeTime) return true;
            return false;
        }

        /**
         * @returns {Boolean} Will return true if the hold time of the attack is inside the range of a heavy attack
         */

    }, {
        key: 'isHoldTimeHeavyAttack',
        value: function isHoldTimeHeavyAttack() {
            if (this.isRunningOnClient) return this.isChargingAttack;

            var minChargeTime = this.player.isTouch() ? this.mainWeaponDef.attacks.heavyAttack.behaviourParams.minChargeTimeTouch : this.mainWeaponDef.attacks.heavyAttack.behaviourParams.minChargeTime;

            if (this.attackHoldTime >= minChargeTime && this.mainWeaponCooldowns.heavyAttack <= 0) return true;
            return false;
        }

        /**
         * Get the poiting direction with the degrees
         * @param {Float} angle Degrees of the cursor direction 
         * @returns {Object} Object of booleans with the directions right, left, up, down
         */

    }, {
        key: 'getMeleeAttackNameDirections',
        value: function getMeleeAttackNameDirections(angle) {
            // return true if in range, otherwise false
            /*const inRange = (x, min, max) => ((x-min)*(x-max) <= 0);
             const withOffset = (a) => {dw
                const offset = 45 + 45/2;
                return Math.abs(a + offset);
            };*/
            return {
                right: angle < 67.5 && angle >= 0 || angle > 292.5 && angle <= 360,
                left: angle < 247.5 && angle > 112.5,
                up: angle < 157.5 && angle > 22.5,
                down: angle < 337.5 && angle > 202.5
            };
        }

        /**
         * Obtain all the nearby players, obstacles and npcs that are around the current player
         * @param {Float} width Width to create collider
         * @param {Float} height Height to create collider if not given will use same value as width
         * @returns {Array} Array of the players found in the given radius
         */

    }, {
        key: 'findNearbyTargets',
        value: function findNearbyTargets(width) {
            var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var includeObstacles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var includeAllies = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            if (!height) height = width;
            var nearbyTargets = [];
            var aabb = collider.createAabbExtents(this.player.pos, v2.create(width, height));
            var nearbyObjs = this.grid.intersectAabb(aabb);

            for (var i = 0; i < nearbyObjs.length; i++) {
                var o = nearbyObjs[i];
                if ((o.__type == GameObject.Type.Player || includeObstacles && o.__type == GameObject.Type.Obstacle || o.__type == GameObject.Type.Npc) && o.__id != this.player.__id && !o.dead && util.sameLayer(o.layer, this.player.layer) && !includeAllies && o.teamId != this.player.teamId) {

                    var dist = v2.sub(o.pos, this.player.pos);
                    dist = v2.create(Math.abs(dist.x), Math.abs(dist.y));
                    dist = v2.sub(dist, v2.create(GameConfig.player.colliderWidth, GameConfig.player.colliderHeight));

                    if (dist.x < width && dist.y < height) {
                        nearbyTargets.push(o);
                    }
                }
            }
            return nearbyTargets;
        }

        /**
         * Shoot a bullet from current weapon
         */

    }, {
        key: 'fireWeapon',
        value: function fireWeapon(offhand, toMouseLen, attackDef, itemDef, direction) {
            var behaviourParams = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
            var callback = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

            var currentAttackDef = attackDef;

            // Check firing location
            if (itemDef.outsideOnly && this.player.indoors) {
                var msg = new net.PickupMsg();
                msg.type = net.PickupMsgType.GunCannotFire;
                this.player.pickupMsgs.push(msg);
                return;
            }

            this.player.cancelAction(false);
            this.player.visibleToEnemies = true;

            this.player.weapsDirty = true;

            var collisionLayer = util.toGroundLayer(this.player.layer);
            var bulletLayer = this.player.aimLayer;
            var gunOff = itemDef.isDual ? itemDef.dualOffset * (offhand ? 1.0 : -1.0) : itemDef.barrelOffset;
            var gunPos = v2.add(this.player.pos, v2.mul(v2.perp(direction), gunOff));
            var gunLen = itemDef.barrelLength;

            // Compute gun pos clipping if there is an obstacle in the way
            // @NOTE: Add an extra 1.5 to account for shotgun shots being
            //        offset to spawn infront of the gun
            var clipLen = gunLen + 1.5;
            var clipPt = v2.add(gunPos, v2.mul(direction, clipLen));
            var clipNrm = v2.mul(direction, -1.0);
            var aabb = collider.createAabbExtents(this.player.pos, v2.create(this.player.rad + gunLen + 1.5));
            var nearbyObjs = this.grid.intersectAabb(aabb);
            for (var i = 0; i < nearbyObjs.length; i++) {
                var obj = nearbyObjs[i];
                if (obj.__type != GameObject.Type.Obstacle && obj.__type != GameObject.Type.Npc || obj.dead || !obj.collidable || !obj.attackCollidable && obj.isWall || !util.sameLayer(obj.layer, bulletLayer) || obj.height < GameConfig.bullet.height) {
                    continue;
                }
                // @NOTE: The player can sometimes be inside a collider.
                // This can happen when the bulletLayer is different from
                // the player's layer, ie when the player is firing down a
                // stairwell. In this case we'll just ignore that particular
                // collider.
                // Create fake circle for detecting collision between guns and map objects.
                if (!util.sameLayer(collisionLayer, bulletLayer) && collider.intersectCircle(obj.collider, gunPos, GameConfig.player.radius)) {
                    continue;
                }

                var res = collider.intersectSegment(obj.collider, gunPos, clipPt);
                if (res) {
                    var colPos = v2.add(res.point, v2.mul(res.normal, 0.01));
                    var newLen = v2.length(v2.sub(colPos, gunPos));
                    if (newLen < clipLen) {
                        clipLen = newLen;
                        clipPt = colPos;
                        clipNrm = res.normal;
                    }
                }
            }
            //TODO check if can be used for bitheroes if not delete splinter and explosive
            //In previously this 2 were perks
            var hasExplosive = false;
            var hasSplinter = false;

            // Movement spread
            var spread = itemDef.shotSpread || 0;
            var travel = v2.sub(this.player.pos, this.player.posOld);
            if (v2.length(travel) > 0.01) {
                spread += itemDef.moveSpread || 0;
            }

            // Recoil currently just cancels spread if you shoot slow enough.
            if (this.player.recoilTicker >= itemDef.recoilTime) {
                spread = 0.0;
            }
            this.player.recoilTicker = 0.0;

            var bulletCount = attackDef.bulletCount || itemDef.bulletCount;
            var jitter = itemDef.jitter || 0.25;

            for (var _i = 0; _i < bulletCount; _i++) {
                var deviation = util.random(-0.5, 0.5) * (spread || 0);
                var shotDir = v2.rotate(direction, math.deg2rad(deviation));

                // Compute shot start position
                var bltStart = v2.add(gunPos, v2.mul(direction, gunLen));
                if (_i > 0) {
                    // Add shotgun jitter
                    var offset = v2.mul(v2.create(util.random(-jitter, jitter), util.random(-jitter, jitter)), 1.11);
                    bltStart = v2.add(bltStart, offset);
                }

                var toBlt = v2.sub(bltStart, gunPos);
                var toBltLen = v2.length(toBlt);
                toBlt = toBltLen > 0.00001 ? v2.div(toBlt, toBltLen) : v2.create(1.0, 0.0);
                // Clip with nearly obstacle plane
                // @TODO: This doesn't handle interior corners properly;
                //        bullets may still escape if one spawns closer
                //        to a different clipping plane than the gun end.
                var dn = v2.dot(toBlt, clipNrm);
                if (dn < -0.00001) {
                    var t = v2.dot(v2.sub(clipPt, gunPos), clipNrm) / dn;
                    if (t < toBltLen) {
                        toBltLen = t - 0.1;
                    }
                }
                var shotPos = v2.add(gunPos, v2.mul(toBlt, toBltLen));
                var maxDistance = Number.MAX_VALUE;
                if (itemDef.toMouseHit) {
                    maxDistance = math.max(toMouseLen - gunLen, 0.0);
                }
                var damageMult = 1.0;

                var bulletType = currentAttackDef.bulletType;

                var params = {
                    playerId: this.player.__id,
                    bulletType: bulletType,
                    sourceType: itemDef.id,
                    damageType: GameConfig.DamageType.Player,
                    pos: shotPos,
                    dir: shotDir,
                    layer: bulletLayer,
                    maxDistance: maxDistance,
                    damageMult: damageMult,
                    shotFx: _i == 0,
                    shotOffhand: offhand,
                    trailSmall: false,
                    reflectCount: 0,
                    reflectObjId: this.player.linkedObstacleId,
                    onHitFx: hasExplosive ? 'explosion_rounds' : '',
                    behaviourParams: behaviourParams,
                    attackDef: attackDef,
                    callback: callback
                };
                this.bulletBarn.shootBullet(params);

                // Shoot a projectile if defined
                if (itemDef.projType) {
                    var projDef = GameObjectDefs[itemDef.projType];
                    assert(projDef && projDef.type == 'throwable');
                    var vel = v2.mul(shotDir, projDef.throwPhysics.speed);
                    this.projectileBarn.addProjectile(this.player.__id, itemDef.projType, shotPos, 0.5, bulletLayer, vel, projDef.fuseTime, GameConfig.DamageType.Player);
                }

                // Splinter creates additional bullets that deviate on either side of
                // the main bullet
                var splinterSpread = math.max(spread, 1.0);
                if (hasSplinter && !itemDef.noSplinter) {
                    for (var j = 0; j < 2; j++) {
                        var sParams = Object.assign({}, params);

                        var _deviation = util.random(0.2, 0.25) * splinterSpread * (j % 2 == 0 ? -1.0 : 1.0);
                        sParams.dir = v2.rotate(sParams.dir, math.deg2rad(_deviation));
                        sParams.lastShot = false;
                        sParams.shotFx = false;
                        sParams.trailSmall = true;
                        sParams.damageMult *= 0.45;

                        this.bulletBarn.shootBullet(sParams);
                    }
                }
            }
        }

        /**
         * Calculate the melee collider of the current attack
         */

    }, {
        key: 'getMeleeAttackCollider',
        value: function getMeleeAttackCollider() {
            if (!this.currentAttack) return null;
            var attackDef = this.currentAttack.attackDef;
            var dir = !attackDef.directionInverted ? this.currentAttack.direction : v2.mul(this.currentAttack.direction, -1);

            if (!dir) return null;

            if (!attackDef || !attackDef.offset || !attackDef.width || !attackDef.height) return null;

            var angle = math.rad2degFromDirection(dir.y, dir.x);

            var offset = attackDef.offset;
            var colliderAngle = 90; //up
            var meleeDirection = this.getAngleDirection(angle, true);
            if (!attackDef.freeDirection) {
                if (meleeDirection == "side") {
                    if (dir.x < 0) {
                        meleeDirection = "left";
                        colliderAngle = 180; //up
                        if (attackDef.offset_left) offset = attackDef.offset_left;
                    } else {
                        meleeDirection = "right";
                        colliderAngle = 0; //up
                        if (attackDef.offset_right) offset = attackDef.offset_right;
                    }
                } else if (meleeDirection == "down") {
                    colliderAngle = 270; //up
                    if (attackDef.offset_down) offset = attackDef.offset_down;
                }
            } else {
                colliderAngle = angle;
            }

            var meleeOff = v2.add(offset, v2.mul(v2.create(1.0, 0.0), this.player.scale - 1.0));

            var rot = colliderAngle * Math.PI / 180; //rad
            var meleePos = v2.add(this.player.pos, v2.rotate(meleeOff, rot));
            var meleeRad = attackDef.rad;

            //Melee collider

            var meleeWidth = attackDef.width || GameConfig.player.meleeWidthDefault;
            var meleeHeight = attackDef.height || GameConfig.player.meleeHeightDefault;

            if (!attackDef.freeDirection) {
                if (meleeDirection == "up" || meleeDirection == "down") {
                    var tempWidth = meleeWidth;
                    meleeWidth = meleeHeight;
                    meleeHeight = tempWidth;
                }
            }

            var meleeHitbox = collider.createAabbExtents(v2.create(0.0, 0.0), v2.create(meleeWidth, meleeHeight));

            var rotAngle = attackDef.freeDirection ? colliderAngle : 0;
            var meleeCollider = collider.transform(meleeHitbox, meleePos, rotAngle, 1, true);

            meleeCollider.pos = meleePos;
            meleeCollider.rad = meleeRad;
            meleeCollider.angle = colliderAngle;
            return meleeCollider;
        }

        /**
         * Calculate the damage of attack
         * @param {number} damage Base damage of bullet 
         * @param {Object} attackDef Definition of the attack
         * @param {Boolean} isObstacle Indicates if the target is an obstacle
         */

    }, {
        key: 'computeDamage',
        value: function computeDamage(damage) {
            var isObstacle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var attackDef = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            return damage * (isObstacle && attackDef ? attackDef.obstacleDamage : 1);
        }

        /**
         *  Will apply damage to a player or obstacle
         * @param {{ 
         * attackDef: any,
         * targetId: number,
         * target: any,
         * targetId: number,
         * playerId: number,
         * damageType: number,
         * sourceType: number,
         * direction: any,
         * damage: number,
         * isObstacle: boolean,
         * attackType: number
         * }} param0 
         */

    }, {
        key: 'dealDamage',
        value: function dealDamage(_ref) {
            var attackDef = _ref.attackDef,
                target = _ref.target,
                targetId = _ref.targetId,
                playerId = _ref.playerId,
                damageType = _ref.damageType,
                sourceType = _ref.sourceType,
                direction = _ref.direction,
                damage = _ref.damage,
                isObstacle = _ref.isObstacle,
                attackType = _ref.attackType;

            var computedDamage = this.computeDamage(damage, isObstacle, attackDef);

            this.damageList.addHit({
                targetId: targetId,
                killerId: playerId,
                damageType: damageType,
                sourceType: sourceType,
                dir: direction,
                damage: computedDamage,
                attackType: attackType
            });

            //Apply status effects
            if (target && !target.dead && attackDef.effects && (target.__type == GameObject.Type.Player || target.__type == GameObject.Type.Npc)) {
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = attackDef.effects[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var effect = _step8.value;

                        if (effect.needExtraParams) effect.params = Object.assign(effect.params, this.getEffectExtraParams(effect.name));
                        StatusEffect.tryApplyEffectWithChance(effect.name, target, effect.chance, effect.params);
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }
            }
        }

        /**
         * Deal melee damage based on currentAttack
         */

    }, {
        key: 'dealMeleeDamage',
        value: function dealMeleeDamage() {
            if (!this.currentAttack) return null;
            var attackDef = this.currentAttack.attackDef;
            var meleeCollider = this.getMeleeAttackCollider();
            if (!meleeCollider) return null;

            var nearbyObjs = this.grid.intersectAabb(meleeCollider);

            var weaponDef = this.currentAttack.isOffHand ? this.offHandDef : this.mainWeaponDef;

            var dir = !attackDef.directionInverted ? this.currentAttack.direction : v2.mul(this.currentAttack.direction, -1);

            var angle = math.rad2degFromDirection(dir.y, dir.x);

            var meleeDirection = this.getAngleDirection(angle, true);

            var offset = attackDef.offset;
            var colliderAngle = 90; //up
            if (!attackDef.freeDirection) {
                if (meleeDirection == "side") {
                    if (dir.x < 0) {
                        meleeDirection = "left";
                        colliderAngle = 180; //up
                        if (attackDef.offset_left) offset = attackDef.offset_left;
                    } else {
                        meleeDirection = "right";
                        colliderAngle = 0; //up
                        if (attackDef.offset_right) offset = attackDef.offset_right;
                    }
                } else if (meleeDirection == "down") {
                    colliderAngle = 270; //up
                    if (attackDef.offset_right) offset = attackDef.offset_right;
                }
            } else {
                colliderAngle = angle;
            }

            var meleeOff = v2.add(offset, v2.mul(v2.create(1.0, 0.0), this.player.scale - 1.0));

            var rot = colliderAngle * Math.PI / 180; //rad
            var meleePos = v2.add(this.player.pos, v2.rotate(meleeOff, rot));

            var nearbyTargets = [];
            for (var i = 0; i < nearbyObjs.length; i++) {
                var o = nearbyObjs[i];
                // -------- Player --------
                if (o.__type == GameObject.Type.Player && o.__id != this.player.__id && o.teamId != this.player.teamId && !o.dead && util.sameLayer(o.layer, this.player.layer)) {

                    var col = collider.intersectPlayer(meleeCollider, o.collider);

                    if (col && !this.collisionHelpers.intersectSegmentWithCollidableObstacles(this.player.pos, o.pos, GameConfig.player.meleeHeight, this.player.layer, nearbyObjs)) {
                        // Prioritize players above obstacles, unless the player
                        // is on our team.
                        nearbyTargets.push({
                            obj: o,
                            pen: col.pen,
                            prio: o.teamId == this.player.teamId ? 2 : 0
                        });
                    }
                }
                // -------- Obstacle or Npc --------
                else if ((o.__type == GameObject.Type.Obstacle || o.__type == GameObject.Type.Npc) && !o.dead && o.height >= GameConfig.player.meleeHeight && util.sameLayer(o.layer, this.player.layer) && o.__id != this.linkedObstacleId) {

                        var _col = collider.intersectAabb(o.collider, meleeCollider.min, meleeCollider.max);

                        // Certain melee weapons should perform a more expensive wall check
                        // to not hit obstacles behind walls.
                        if (weaponDef.cleave || weaponDef.wallCheck) {

                            var wallCheck = this.collisionHelpers.intersectSegmentWithCollidableObstacles(this.player.pos, o.pos, 1.0, this.player.layer, nearbyObjs);

                            if (wallCheck && wallCheck.attackCollidable && wallCheck.id !== o.__id && _col) {

                                var movementCollider = v2.create((this.player.movementCollider.min.x + this.player.movementCollider.max.x) / 2, (this.player.movementCollider.min.y + this.player.movementCollider.max.y) / 2);

                                var xWallDist = Math.pow(wallCheck.pos.x - movementCollider.x, 2);
                                var yWallDist = Math.pow(wallCheck.pos.y - movementCollider.y, 2);
                                var wallDist = Math.sqrt(xWallDist + yWallDist);

                                var objColliderPos = v2.create((o.collider.min.x + o.collider.max.x) / 2, (o.collider.min.y + o.collider.max.y) / 2);

                                if (o.collider.pts) {
                                    objColliderPos = v2.create((o.collider.min.x + o.collider.max.x) / 2, (o.collider.min.y + o.collider.max.y) / 2);
                                }

                                var xObjectDist = Math.pow(objColliderPos.x - movementCollider.x, 2);
                                var yObjectDist = Math.pow(objColliderPos.y - movementCollider.y, 2);
                                var objectDist = Math.sqrt(xObjectDist + yObjectDist);

                                if (wallDist < objectDist) {
                                    _col = null;
                                }
                            }
                        }
                        if (_col) {
                            nearbyTargets.push({
                                obj: o,
                                pen: _col.pen,
                                prio: 1
                            });
                        }
                    }
            }

            nearbyTargets.sort(function (a, b) {
                if (a.prio == b.prio) {
                    return b.pen - a.pen;
                } else {
                    return a.prio - b.prio;
                }
            });

            var targetCount = nearbyTargets.length;
            if (!weaponDef.cleave) {
                targetCount = math.min(targetCount, 1);
            }

            var damage = weaponDef.baseDamage + this.currentAttack.damage;

            for (var _i2 = 0; _i2 < targetCount; _i2++) {
                var target = nearbyTargets[_i2].obj;
                var toHit = v2.create(1.0, 0.0);
                if (target.__type == GameObject.Type.Player || target.__type == GameObject.Type.Npc) {
                    toHit = v2.normalizeSafe(v2.sub(target.pos, this.player.pos), v2.create(1.0, 0.0));
                } else if (target.__type == GameObject.Type.Obstacle) {
                    toHit = v2.normalizeSafe(v2.sub(meleePos, this.player.pos), v2.create(1.0, 0.0));
                    damage *= weaponDef.obstacleDamage;
                }

                damage = this.player.statscontroller.getDamage(damage);

                var returnAttack = target && target.__type == GameObject.Type.Player && target.WeaponManager.currentAttack && target.WeaponManager.currentAttack.attackDef.behaviourParams && target.WeaponManager.currentAttack.attackDef.behaviourParams.reflectAttacks ? target.WeaponManager.currentAttack.attackDef.behaviourParams.reflectedMeleeMult || 1 : false;

                this.damageList.addHit({
                    damageType: target.__type === GameObject.Type.Player ? GameConfig.DamageType.Player : GameConfig.DamageType.Npc,
                    sourceType: this.currentAttack.isOffHand ? this.offHandDef.id : this.mainWeaponDef.id,
                    //Apply damage to attacker if target has status effect that return damage
                    targetId: returnAttack ? this.player.__id : target.__id,
                    killerId: returnAttack ? target.__id : this.player.__id,
                    dir: toHit,
                    damage: returnAttack ? damage * returnAttack : damage,
                    attackType: this.currentAttack.isOffHand ? this.offHandDef.attackType : this.mainWeaponDef.attackType
                });

                //Apply status effects
                if (target && attackDef && attackDef.effects && !target.dead && (target.__type == GameObject.Type.Player || target.__type == GameObject.Type.Npc)) {
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = attackDef.effects[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var effect = _step9.value;

                            if (effect.needExtraParams) effect.params = Object.assign(effect.params, this.getEffectExtraParams(effect.name));

                            StatusEffect.tryApplyEffectWithChance(effect.name, target, effect.chance, effect.params);
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
                    }
                }
            }

            return targetCount > 0;
        }
    }, {
        key: 'checkMeleeCollisionClient',
        value: function checkMeleeCollisionClient() {
            if (this.currentAttack && this.currentAttack.weaponDef.type != 'melee' && this.currentAttack.attackDef.type != 'melee' || !this.playerBarn) return;

            // Players
            var players = this.playerBarn.m_playerPool.m_getPool();
            for (var j = 0; j < players.length; j++) {
                var player = players[j];

                if (!player.active || player.m_netData.m_dead || !util.sameLayer(player.m_netData.m_layer, this.player.layer) && !(player.m_netData.m_layer & 0x2)) {
                    continue;
                }
                if (player.__id == this.player.__id) {
                    continue;
                }

                if (this.currentAttack && this.currentAttack.isActive) {
                    var meleeCollider = this.player.getMeleeCollider();

                    if (!meleeCollider) return;

                    var res = collider.intersect(meleeCollider, player.collider);

                    if (res) {
                        player.playSpineFX('hit'); //Sonido
                    }
                }
            }
        }

        /**
         * Check if attack is in damage times
         */

    }, {
        key: 'areInDamageTime',
        value: function areInDamageTime() {
            if (!this.currentAttack) return false;

            var damageTimes = this.currentAttack.attackDef.damageTimes;
            if (!damageTimes) return false;

            for (var i = 0; i < damageTimes.length; i++) {
                var damageTime = damageTimes[i];

                if (!this.currentAttack) return false;

                if (typeof damageTime === 'number') {
                    if (damageTime >= this.currentAttack.timeActiveOld && damageTime < this.currentAttack.timeActive) {
                        return true;
                    }
                } else {
                    //const damageStart = damageTime.start / this.anim.data.definition.animDuration;
                    //const damageEnd = damageTime.end / this.anim.data.definition.animDuration;
                    if (this.currentAttack.timeActive >= damageTime.start && this.currentAttack.timeActive <= damageTime.end) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Add params neede to execute effect that can not be set in the definition
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
         * Get weapon defition baseDamage 
         */

    }, {
        key: 'getWeaponBaseDamage',
        value: function getWeaponBaseDamage() {
            return this.mainWeaponDef.baseDamage;
        }

        /**
         * Get the name of direction based on angle
         * @param {float} angle 
         * @param {Boolean} sideMode 
         */

    }, {
        key: 'getAngleDirection',
        value: function getAngleDirection(angle) {
            var sideMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (angle > 45 && angle < 135) {
                return 'up';
            }

            if (angle > 225 && angle < 315) {
                return 'down';
            }

            if (sideMode) {
                return 'side';
            }

            if (angle > 135 && angle < 225) {
                return 'left';
            }

            return 'right';
        }

        /**
         * Throw item like bomb or shuriken
         */

    }, {
        key: 'throwThrowable',
        value: function throwThrowable() {
            var _this = this;

            if (!this.skillParams) {
                return;
            }

            var throwStr = this.skillParams.throwStr;
            var throwableDef = this.skillParams.itemDef;
            var itemSlotId = this.skillParams.slotId - 1;

            assert(throwableDef && throwableDef.type == 'throwable');
            this.isAttacking = true;

            var executeThrow = function executeThrow() {
                _this.cancelCurrentAttack(null, false, true);
                if (throwableDef.bulletType) {
                    _this.player.shootMeleeBullet(_this.bulletBarn, throwableDef.id);
                }

                if (throwableDef.bulletType || throwableDef.explosionType) {
                    if (_this.player.slotsInventory[itemSlotId].total > 0) {
                        _this.player.slotsInventory[itemSlotId].total -= 1;
                        if (_this.player.slotsInventory[itemSlotId].total == 0) {
                            _this.player.slotsInventory[itemSlotId].item = '';
                        }
                        _this.player.inventoryDirty = true;
                    }
                }

                _this.isAttacking = false;

                if (!throwableDef.explosionType) return;

                var pos = v2.add(_this.player.pos, v2.rotate(v2.create(0.5, -1.0), Math.atan2(_this.player.dir.y, _this.player.dir.x)));

                var dir = _this.player.dir;
                // Aim toward a point some distance infront of the player
                if (throwableDef.aimDistance > 0.0) {
                    var aimTarget = v2.add(_this.player.pos, v2.mul(_this.player.dir, throwableDef.aimDistance));
                    dir = v2.normalizeSafe(v2.sub(aimTarget, pos), v2.create(1.0, 0.0));
                }

                var throwPhysicsSpeed = throwableDef.throwPhysics.speed;

                // Incorporate some of the player motion into projectile velocity
                var vel = v2.add(v2.mul(_this.player.moveVel, throwableDef.throwPhysics.playerVelMult), v2.mul(dir, throwPhysicsSpeed * throwStr));

                var fuseTime = math.max(0.0, throwableDef.fuseTime);
                projectileBarn.addProjectile(_this.player.__id, throwableDef.id, pos, 0.5, _this.player.layer, vel, fuseTime, GameConfig.DamageType.Player);
            };

            var projectileBarn = this.projectileBarn;
            var animationDuration = GameConfig.player.throwTime;
            this.player.playAnim(Anim.Throw, animationDuration, 1, null, null, executeThrow);
        }

        /**
        * Throw items like sparks in specific positions
        */

    }, {
        key: 'throwThrowableAttack',
        value: function throwThrowableAttack(throwableDef) {
            var throwablePos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            var throwStr = void 0;

            if (throwableDef) {
                var throwLen = 1;
                throwStr = throwLen * (throwableDef.fuseTime <= 0.0 ? 0.0 : 1.0);
            } else {
                // @TODO: Why this else here? It should be validated before calling throwThrowable
                return;
            }

            assert(throwableDef && throwableDef.type == 'throwable');

            var projectileBarn = this.projectileBarn;
            var animationDuration = GameConfig.player.throwTime;
            // this.player.playAnim(Anim.Throw, animationDuration);

            if (throwableDef.bulletType) {
                this.player.shootMeleeBullet(this.bulletBarn, throwableDef.id);
            }

            if (!throwableDef.explosionType) return;

            var pos = throwablePos || v2.add(this.player.pos, v2.rotate(v2.create(0.5, -1.0), Math.atan2(this.player.dir.y, this.player.dir.x)));

            var dir = this.player.dir;
            // Aim toward a point some distance infront of the player
            if (throwableDef.aimDistance > 0.0) {
                var aimTarget = v2.add(this.player.pos, v2.mul(this.player.dir, throwableDef.aimDistance));
                dir = v2.normalizeSafe(v2.sub(aimTarget, pos), v2.create(1.0, 0.0));
            }

            var throwPhysicsSpeed = throwableDef.throwPhysics.speed;

            // Incorporate some of the player motion into projectile velocity
            var vel = v2.add(v2.mul(this.player.moveVel, throwableDef.throwPhysics.playerVelMult), v2.mul(dir, throwPhysicsSpeed * throwStr));

            var fuseTime = math.max(0.0, throwableDef.fuseTime);
            var newThrowable = projectileBarn.addProjectile(this.player.__id, throwableDef.id, pos, 0.0, this.player.layer, 0, fuseTime, GameConfig.DamageType.Player, this.player.teamId);

            return newThrowable;
        }

        /**
         * Explote active throwables 
         */

    }, {
        key: 'exploteActiveThrowables',
        value: function exploteActiveThrowables() {
            for (var i = 0; i < this.activeThrowables.length; i++) {
                var throwable = this.activeThrowables[i];
                throwable.exploteProjectile = true;
            }

            this.activeThrowables = [];

            //Explosion on current traps
            if (!this.isRunningOnClient) {

                for (var _i3 = 0; _i3 < this.TrapManager.trapsPool.length; _i3++) {
                    var trap = this.TrapManager.trapsPool[_i3];
                    var trapDef = trap.definition.behaviourParams;
                    if (trap.active && trapDef && trapDef.explosionType) {
                        if (trapDef.explosionType) {
                            //Explote trap
                            trap.explosion = true;
                            this.TrapManager.removedTraps.push(trap);
                        }
                    }
                }
            }
        }

        /**
         * Add spine instace or sprite to the behaviour
         * @param {Class} behaviour 
         * @param {Object} behaviourDef 
         */

    }, {
        key: 'addAttackVisuals',
        value: function addAttackVisuals(behaviour, behaviourDef, layer, zIndex) {
            if (!this.player.SpineObjManager) console.error('Spine Obj Manager is null');
            var useSpine = behaviourDef.spine && behaviourDef.spine.enabled && this.player.SpineObjManager && this.player.SpineObjManager.canUseSpine();
            var useSprite = behaviourDef.worldImg;
            var containerCreated = false;

            if (useSpine && behaviourDef.spine.spineType) {
                behaviour.container = new this.PIXI.Container();
                behaviour.container.pivot.set(14.5, 0.0);
                behaviour.spine = this.player.SpineObjManager.setSpine(behaviour, behaviourDef.spine.spineType);
                if (!behaviour.spine) return;
                behaviour.container.addChild(behaviour.spine);
                behaviour.imgScale = behaviourDef.spine.scale != undefined ? behaviourDef.spine.scale : 1;

                if (behaviour.spine) {
                    containerCreated = true;
                    behaviour.hasSprite = true;
                    behaviour.hasSpine = true;
                }
            } else if (useSprite) {
                behaviour.container = new this.PIXI.Container();
                behaviour.container.pivot.set(14.5, 0.0);

                var imgDef = behaviourDef.worldImg;
                var imgDef2 = imgDef.sprite;
                if (imgDef.sprites) {
                    imgDef2 = imgDef.sprites[util.randomInt(0, imgDef.sprites.length - 1)];
                }

                // Setup sprite
                behaviour.sprite = new this.PIXI.Sprite();

                behaviour.sprite.anchor.set(0.5, 0.5);

                if (behaviourDef.textureAnchor) {
                    behaviour.sprite.anchor.set(behaviourDef.textureAnchor.x, behaviourDef.textureAnchor.y);
                }
                behaviour.sprite.texture = this.PIXI.Texture.fromImage(imgDef2);
                behaviour.sprite.tint = imgDef.tint;
                behaviour.sprite.alpha = 1;
                behaviour.imgScale = imgDef.scale != undefined ? imgDef.scale : 1;
                behaviour.container.addChild(behaviour.sprite);

                containerCreated = true;
                behaviour.hasSprite = true;
            }

            if (containerCreated) {
                do {
                    if (this.renderer) {
                        var _layer = layer || this.player.renderLayer;
                        var _zIndex = zIndex || this.player.renderZIdx || 20;
                        this.renderer.addPIXIObj(behaviour.container, _layer, _zIndex);
                    }
                } while (!this.renderer);
            }
        }
    }, {
        key: 'hasThrowableSelected',
        value: function hasThrowableSelected() {
            return this.selectedSkill === GameConfig.SelectedSkill.Throwable && !!this.skillParams.slotItem;
        }
    }, {
        key: 'hasOffHandSelected',
        value: function hasOffHandSelected() {
            return this.selectedSkill === GameConfig.SelectedSkill.OffHand && !!this.skillParams.slotItem;
        }
    }, {
        key: 'getSelectedItemDef',
        value: function getSelectedItemDef() {
            var def = GameObjectDefs[this.skillParams.slotItem];
            return def;
        }
    }, {
        key: 'ignoreIsAttacking',
        value: function ignoreIsAttacking() {
            return !!this.currentAttack && !!this.currentAttack.attackDef.ignoreIsAttacking;
        }
    }, {
        key: 'currentAttackWalkAnimation',
        value: function currentAttackWalkAnimation() {
            return this.currentAttack ? this.currentAttack.attackDef.walkAnimation : undefined;
        }
    }, {
        key: 'currentAttackIdleAnimation',
        value: function currentAttackIdleAnimation() {
            return this.currentAttack ? this.currentAttack.attackDef.idleAnimation : undefined;
        }
    }, {
        key: 'selectedSkillId',
        get: function get() {
            return 'skill_' + this.selectedSkill;
        }
    }, {
        key: 'selectedSkillDef',
        get: function get() {
            if (this.hasThrowableSelected()) {
                return this.getSelectedItemDef();
            } else if (this.hasOffHandSelected()) {
                return this.getSelectedItemDef().skills.skill_1;
            }

            if (this.mainWeaponDef) {
                return this.mainWeaponDef.attacks[this.selectedSkillId];
            }
            return null;
        }
    }, {
        key: 'selectedWeaponDef',
        get: function get() {
            if (this.hasThrowableSelected() || this.hasOffHandSelected()) {
                return this.getSelectedItemDef();
            }
            return this.mainWeaponDef;
        }
    }]);

    return WeaponManager;
}();

module.exports = WeaponManager;
