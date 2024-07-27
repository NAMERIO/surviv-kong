"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _SlotsInputBindings, _WeaponSlotToBind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var GameInput = GameConfig.Input;
var Action = GameConfig.Action;
var math = require("./math.js");
var net = require("./net.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var device = require("./device.js");
var helpers = require("./helpers.js");
var DamageType = GameConfig.DamageType;
var PickupMsgType = net.PickupMsgType;
var SkillCooldown = require("./skillCooldown.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var Levels = require("./levels.js");
var MapObjectDefs = require("./mapObjectDefs.js");

var _require = require("./gameConfig.js"),
    SlotsByIndex = _require.SlotsByIndex;

var StatusEffects = require("./statusEffects.js");
var StatusEffect = require("./statusEffect.js");

var _require2 = require("./35dbdceb.js"),
    getGearItems = _require2.getGearItems;

//
// Helpers
//


function domElemById(e) {
    return document.getElementById(e);
}

function isLmb(e) {
    return e.button == 0;
}

function isRmb(e) {
    return 'which' in e ? e.which == 3 : e.button == 2;
}

// These functions, copy and diff, only work if both
// arguments have the same internal structure
function copy(src, dst, path) {
    if (src instanceof Array) {
        for (var i = 0; i < src.length; i++) {
            copy(src[i], path !== undefined ? dst[path] : dst, i);
        }
    } else if (src instanceof Object) {
        var keys = (0, _keys2.default)(src);
        for (var _i = 0; _i < keys.length; _i++) {
            var key = keys[_i];
            copy(src[key], path !== undefined ? dst[path] : dst, key);
        }
    } else {
        dst[path] = src;
    }
}

// 'all' could be removed if clone() were used instead of copy();
// with clone, oldState would begin with no properties and would
// thus automatically diff properly.
function diff(a, b, all) {
    if (b instanceof Array) {
        var patch = [];
        for (var i = 0; i < b.length; i++) {
            patch[i] = diff(a[i], b[i], all);
        }
        return patch;
    } else if (b instanceof Object) {
        var _patch = {};
        var keys = (0, _keys2.default)(b);
        for (var _i2 = 0; _i2 < keys.length; _i2++) {
            var key = keys[_i2];
            _patch[key] = diff(a[key], b[key], all);
        }
        return _patch;
    } else {
        return a != b || all;
    }
}

//
// Types
//
var kMaxKillFeedLines = 6;
var kTouchHoldDuration = 0.75 * 1000;
var kPerkUiCount = 3;
var kStatsUiCount = 6;

var InteractionType = {
    None: 0,
    Cancel: 1,
    Loot: 2,
    Revive: 3,
    Object: 4
};

var Skills = {
    Skill_1: 1,
    Skill_2: 2,
    Skill_3: 3,
    Dash: 4,
    count: 4
};

var SkillButtonsActions = [GameConfig.SelectedSkill.Skill_1, GameConfig.SelectedSkill.Skill_2, GameConfig.SelectedSkill.Skill_3];

var SlotsInputBindings = (_SlotsInputBindings = {}, (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot1, GameInput.Bag01), (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot2, GameInput.Bag02), (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot3, GameInput.Bag03), (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot4, GameInput.Bag04), (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot5, GameInput.Bag05), (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot6, GameInput.Bag06), (0, _defineProperty3.default)(_SlotsInputBindings, GameConfig.Slots.slot7, GameInput.Bag07), _SlotsInputBindings);

var SlotButtonsActions = [GameConfig.Slots.slot1, GameConfig.Slots.slot2, GameConfig.Slots.slot3, GameConfig.Slots.slot4, GameConfig.Slots.slot5, GameConfig.Slots.slot6, GameConfig.Slots.slot7];

var Slots = {
    slot_1: 0,
    slot_2: 1,
    slot_3: 2,
    slot_4: 3,
    count: 4
};

var Damage = {
    equal: 0,
    worst: 1,
    better: 2
};

var activityType = {
    skill: 0,
    dash: 1,
    offHand: 2,
    heavyAttack: 3,
    lightAttack: 4,
    activeItem: 5,
    slots: 6,
    effect: 7
};

function getScopeTypes() {
    var keys = (0, _keys2.default)(GameObjectDefs);
    var types = [];
    for (var i = 0; i < keys.length; i++) {
        var type = keys[i];
        var objDef = GameObjectDefs[type];
        if (objDef.type == 'scope') {
            types.push(type);
        }
    }
    return types;
}

function getLootTypes() {
    var keys = (0, _keys2.default)(GameObjectDefs);
    var types = [];
    for (var i = 0; i < keys.length; i++) {
        var type = keys[i];
        var objDef = GameObjectDefs[type];
        if (objDef.hideUi) {
            continue;
        }
        if (objDef.type == 'heal' || objDef.type == 'boost' || objDef.type == 'ammo') {
            types.push(type);
        }
    }
    return types;
}

function getGearTypes() {
    return ['chest', 'helmet', 'neck', 'backpack'];
}

var WeaponSlotToBind = (_WeaponSlotToBind = {}, (0, _defineProperty3.default)(_WeaponSlotToBind, GameConfig.WeaponSlot.Primary, GameInput.EquipPrimary), (0, _defineProperty3.default)(_WeaponSlotToBind, GameConfig.WeaponSlot.OffHand, GameInput.EquipSecondary), _WeaponSlotToBind);

//
// UiState
//
function UiState() {
    this.mobile = false;
    this.touch = false;
    this.rareLootMessage = {
        lootType: '',
        ticker: 0.0,
        duration: 0.0,
        opacity: 0.0
    };
    this.pickupMessage = {
        message: '',
        ticker: 0.0,
        duration: 0.0,
        opacity: 0.0
    };
    this.pickupMessageMobile = {
        message: '',
        ticker: 0.0,
        duration: 0.0,
        opacity: 0.0
    };
    this.killMessage = {
        text: '',
        count: '',
        ticker: 0.0,
        duration: 0.0,
        opacity: 0.0
    };
    this.killFeed = [];
    for (var i = 0; i < kMaxKillFeedLines; i++) {
        this.killFeed.push({
            text: '',
            color: '#000000',
            offset: 0.0,
            opacity: 0.0,
            ticker: Number.MAX_VALUE
        });
    }
    this.weapons = [];
    for (var _i3 = 0; _i3 < GameConfig.WeaponSlot.Count; _i3++) {
        this.weapons[_i3] = {
            slot: _i3,
            type: '',
            ammo: 0,
            equipped: false,
            selectable: false,
            opacity: 0.0,
            width: 0.0,
            ticker: 0.0,
            bind: WeaponSlotToBind[_i3],
            bindStr: ''
        };
    }

    this.ammo = {
        current: 0,
        remaining: 0,
        displayCurrent: false,
        displayRemaining: false
    };
    this.interaction = {
        type: InteractionType.None,
        name: '',
        key: '',
        stats: '',
        effects: '',
        weaponType: '',
        usable: false,
        damageDiff: 0,
        weapon: '',
        rarityType: '',
        rarityClass: ''

    };
    this.scopes = [];
    this.statusEffects = [];
    var scopeTypes = getScopeTypes();
    for (var _i4 = 0; _i4 < scopeTypes.length; _i4++) {
        this.scopes.push({
            type: scopeTypes[_i4],
            visible: false,
            equipped: false,
            selectable: false
        });
    }
    this.loot = [];
    var lootTypes = getLootTypes();
    for (var _i5 = 0; _i5 < lootTypes.length; _i5++) {
        this.loot.push({
            type: lootTypes[_i5],
            count: 0,
            maximum: 0,
            selectable: false,
            width: 0.0,
            ticker: 0.0
        });
    }
    this.gear = [];
    var gearTypes = getGearTypes();
    for (var _i6 = 0; _i6 < gearTypes.length; _i6++) {
        this.gear.push({
            type: gearTypes[_i6],
            item: '',
            selectable: false,
            width: 0.0,
            ticker: 0.0,
            rot: 0.0
        });
    }
    this.perks = [];
    for (var _i7 = 0; _i7 < kPerkUiCount; _i7++) {
        this.perks.push({
            type: '',
            droppable: false,
            width: 0.0,
            ticker: 0.0,
            pulse: false
        });
    }

    this.playerButtonsStats = [];
    for (var _i8 = 0; _i8 < 3; _i8++) {
        this.playerButtonsStats.push({
            type: '',
            droppable: false,
            width: 0.0,
            ticker: 0.0,
            pulse: false
        });
    }

    this.skillButtons = [];
    for (var _i9 = 0; _i9 < SkillButtonsActions; _i9++) {
        this.skillButtons.push({
            type: '',
            droppable: false,
            width: 0.0,
            ticker: 0.0,
            pulse: false
        });
    }
    this.slotButtons = [];

    for (var _i10 = 0; _i10 < SlotButtonsActions; _i10++) {
        this.slotButtons.push({
            type: '',
            droppable: false,
            width: 0.0,
            ticker: 0.0,
            pulse: false
        });
    }

    this.health = 100.0;
    this.boost = 0.0;
    this.downed = false;
    this.chargingHeavyAttack = false;
    this.selectedSkill = GameConfig.SelectedSkill.None;
    this.dashCooldown = 0.0;
}

function m_Ui2Manager(localization, inputBinds) {
    var _this = this;

    this.localization = localization;
    this.inputBinds = inputBinds;

    // Ui state
    this.oldState = new UiState();
    this.newState = new UiState();
    this.frameCount = 0;
    this.playerButtonsStatsActions = Levels.stats;
    this.mobileSkillCooldown = new SkillCooldown.skillCooldown();
    this.mobileCooldownStart = false;
    this.resetLevel();

    // DOM
    this.dom = {
        debugButton: domElemById('ui-debug-button'),
        emoteButton: domElemById('ui-emote-button'),
        menu: {
            touchStyles: domElemById('btn-touch-styles'),
            aimLine: domElemById('btn-game-aim-line')
        },
        rareLootMessage: {
            icon: domElemById('ui-perk-message-image-icon'),
            imageWrapper: domElemById('ui-perk-message-image-wrapper'),
            wrapper: domElemById('ui-perk-message-wrapper'),
            name: domElemById('ui-perk-message-name'),
            desc: domElemById('ui-perk-message-acquired')
        },
        pickupMessage: domElemById('ui-pickup-message'),
        killMessage: {
            div: domElemById('ui-kills'),
            text: domElemById('ui-kill-text'),
            count: domElemById('ui-kill-count')
        },
        killFeed: {
            div: domElemById('ui-killfeed-contents'),
            lines: []
        },
        weapons: [],
        weaponSlots: [],
        ammo: {
            current: domElemById('ui-current-clip-span'),
            currentClip: domElemById('ui-current-clip'),
            remaining: domElemById('ui-remaining-ammo'),
            reloadButton: domElemById('ui-reload-button-container')
        },
        interaction: {
            div: domElemById('ui-interaction'),
            content: domElemById('ui-interaction-box'),
            key: device.mobile ? domElemById('ui-interaction-press-mobile') : domElemById('ui-interaction-press'),
            name: domElemById('ui-interaction-name'),
            description: domElemById('ui-interaction-description'),
            effects: domElemById('ui-interaction-effects'),
            stats: domElemById('ui-interaction-stats'),
            weaponType: domElemById('ui-interaction-weapon-type'),
            damageType: domElemById('ui-interaction-damage-type'),
            rarityType: domElemById('ui-interaction-rarity')
        },
        cancelInteraction: {
            div: domElemById('ui-interaction-cancel'),
            content: domElemById('ui-interaction-box-cancel'),
            key: device.mobile ? domElemById('ui-interaction-press-mobile') : domElemById('ui-interaction-press-cancel'),
            name: domElemById('ui-interaction-name-cancel')
        },
        pickupMessageMobile: {
            div: domElemById('ui-pickup-notification'),
            text: domElemById('ui-pickup-description')
        },
        health: {
            inner: domElemById('ui-health-actual'),
            preview: domElemById('ui-health-preview'),
            depleted: domElemById('ui-health-depleted')
        },
        boost: {
            div: domElemById('ui-boost-counter'),
            bars: [domElemById('ui-boost-counter-0').firstElementChild, domElemById('ui-boost-counter-1').firstElementChild, domElemById('ui-boost-counter-2').firstElementChild, domElemById('ui-boost-counter-3').firstElementChild]
        },
        luck: {
            bar: domElemById('luck-bar-img')
        },

        wet: {
            bar: domElemById('wet-bar-img')
        },
        contact: {
            bar: domElemById('contact-bar-img')
        },
        burning: {
            bar: domElemById('burning-bar-img')
        },
        nitroLace: {
            clip: domElemById('ui-current-clip'),
            clipContainer: domElemById('ui-current-clip-bg')
        },
        scopes: [],
        loot: [],
        gear: [],
        perks: [],
        playerButtonsStats: [],
        skillButtons: [],
        slotButtons: [],
        slotsInventoryContainer: domElemById('ui-slots-inventory-container'),
        effectsContainer: domElemById('ui-status-effects'),
        skillName: domElemById('ui-map-info-container-weapon-name')
    };
    // KillFeed
    for (var i = 0; i < kMaxKillFeedLines; i++) {
        // Search for an existing line; if we don't find one, create it
        var lineId = 'ui-killfeed-' + i;
        var line = domElemById(lineId);
        if (!line) {
            line = document.createElement('div');
            line.id = lineId;
            line.classList.add('killfeed-div');

            var child = document.createElement('div');
            child.classList.add('killfeed-text');
            line.appendChild(child);

            this.dom.killFeed.div.appendChild(line);
        }
        this.dom.killFeed.lines.push({
            line: line,
            text: line.firstElementChild
        });
    }

    // Weapon slot
    var weapon = domElemById('ui-weapon-slot-id-1');
    var weaponData = {
        div: weapon,
        image: weapon.getElementsByClassName('ui-icon')[0]
    };

    this.dom.weapons.push(weaponData);

    /*
    for (let i = 0; i < 2; i++) {
        let weapon = domElemById(`ui-weapon-slot-id-${i + 1}`);
        let weaponData = {
            div: weapon,
            image: weapon.getElementsByClassName('ui-icon')[0]
        };
        
        this.dom.weapons.push(weaponData);
    }*/

    //Skill Key binds
    this.updateSkillBinds();

    //Emote key
    // this.updateEmoteBind();

    // Scopes
    /** TODO: Remove */
    var scopeTypes = getScopeTypes();
    for (var _i11 = 0; _i11 < scopeTypes.length; _i11++) {
        var scopeType = scopeTypes[_i11];
        var x = {
            scopeType: scopeType,
            div: domElemById('ui-scope-' + scopeType)
        };
        this.dom.scopes.push(x);
    }
    // Loot
    var lootTypes = getLootTypes();
    for (var _i12 = 0; _i12 < lootTypes.length; _i12++) {
        var lootType = lootTypes[_i12];
        var div = domElemById('ui-loot-' + lootType);
        if (!div) {
            continue;
        }

        var _x = {
            lootType: lootType,
            div: div,
            count: div.getElementsByClassName('ui-loot-count')[0],
            image: div.getElementsByClassName('ui-loot-image')[0],
            overlay: div.getElementsByClassName('ui-loot-overlay')[0]
        };
        this.dom.loot.push(_x);
    }
    // Gear
    var gearTypes = getGearTypes();
    for (var _i13 = 0; _i13 < gearTypes.length; _i13++) {
        var gearType = gearTypes[_i13];
        var _div = domElemById('ui-armor-' + gearType);
        var _x2 = {
            gearType: gearType,
            div: _div,
            level: _div.getElementsByClassName('ui-armor-level')[0],
            image: _div.getElementsByClassName('ui-armor-image')[0]
        };
        this.dom.gear.push(_x2);
    }

    // Perks
    for (var _i14 = 0; _i14 < kPerkUiCount; _i14++) {
        var _div2 = domElemById('ui-perk-' + _i14);
        var _x3 = {
            perkType: '',
            div: _div2,
            divTitle: _div2.getElementsByClassName('tooltip-title')[0],
            divDesc: _div2.getElementsByClassName('tooltip-desc')[0],
            image: _div2.getElementsByClassName('ui-armor-image')[0]
        };
        this.dom.perks.push(_x3);
    }

    /** END */

    // Player Stats
    for (var _i15 = 0; _i15 < 3; _i15++) {
        var _div3 = domElemById('ui-button-stat-' + _i15);
        var _x4 = {
            div: _div3
        };
        this.dom.playerButtonsStats.push(_x4);
    }

    // Skills
    for (var _i16 = 0; _i16 < SkillButtonsActions.length; _i16++) {
        var skill = SkillButtonsActions[_i16];
        this.dom.skillButtons.push({
            skill: skill,
            div: !device.mobile ? domElemById('ui-skill-' + SkillButtonsActions[_i16]) : domElemById('ui-skill-mobile-' + SkillButtonsActions[_i16])
        });
    }

    //this.createSlotsItems();
    this.createEffectsContainer();

    for (var _i17 = 0; _i17 < SlotButtonsActions.length; _i17++) {
        var slot = SlotButtonsActions[_i17];
        /*const slotsHTML = this.getSlotItemHTML(slot);
        this.dom.slotsInventoryContainer.innerHTML += slotsHTML;*/

        this.dom.slotButtons.push({
            slot: slot,
            div: domElemById('ui-pickup-icon-container-' + SlotButtonsActions[_i17])
        });
    }

    this.updateSlotPickUpBinds();

    this.rareLootMessageQueue = [];

    // Input
    this.uiEvents = [];

    this.eventListeners = [];
    var setEventListener = function setEventListener(event, elem, fn) {
        _this.eventListeners.push({ event: event, elem: elem, fn: fn });
        elem.addEventListener(event, fn);
    };

    // Game-item handling. Game item UIs support two actions:
    // left-click to use, and right-click to drop.
    this.itemActions = [];
    var addItemAction = function addItemAction(action, type, data, div) {
        _this.itemActions.push({
            action: action,
            type: type,
            data: data,
            div: div,
            actionQueued: false,
            actionTime: 0
        });
    };
    /** 
     * TODO: REMOVE
     * START
    */
    for (var _i18 = 0; _i18 < this.dom.scopes.length; _i18++) {
        var scope = this.dom.scopes[_i18];
        addItemAction('use', 'scope', scope.scopeType, scope.div);
        if (scope.scopeType != '1xscope') {
            addItemAction('drop', 'loot', scope.scopeType, scope.div);
        }
    }
    for (var _i19 = 0; _i19 < this.dom.loot.length; _i19++) {
        var loot = this.dom.loot[_i19];
        var itemDef = GameObjectDefs[loot.lootType];
        if (itemDef.type == 'heal' || itemDef.type == 'boost') {
            addItemAction('use', 'loot', loot.lootType, loot.div);
        }
        addItemAction('drop', 'loot', loot.lootType, loot.div);
    }
    for (var _i20 = 0; _i20 < this.dom.gear.length; _i20++) {
        var gear = this.dom.gear[_i20];
        if (gear.gearType != 'backpack') {
            addItemAction('drop', 'loot', gear.gearType, gear.div);
        }
    }
    for (var _i21 = 0; _i21 < this.dom.perks.length; _i21++) {
        var perk = this.dom.perks[_i21];
        addItemAction('drop', 'perk', _i21, perk.div);
    }
    /**END */
    for (var _i22 = 0; _i22 < this.dom.playerButtonsStats.length; _i22++) {
        var playerButtonStat = this.dom.playerButtonsStats[_i22];
        addItemAction('use', 'playerStats', this.playerButtonsStatsActions[_i22], playerButtonStat.div);
    }

    for (var _i23 = 0; _i23 < this.dom.skillButtons.length; _i23++) {
        addItemAction('use', 'selectedSkill', SkillButtonsActions[_i23], this.dom.skillButtons[_i23].div);
    }

    for (var _i24 = 0; _i24 < this.dom.slotButtons.length; _i24++) {
        addItemAction('use', 'selectedSlot', SlotButtonsActions[_i24], this.dom.slotButtons[_i24].div);
    }

    // addItemAction('use', 'offHand', "OffHandSkill", domElemById('ui-weapon-offhand'));

    addItemAction('use', 'playerStats', "levelUp", domElemById("level-up-button"));

    /*Temp player Stats Events */

    var _loop = function _loop(_i25) {
        var item = _this.itemActions[_i25];
        setEventListener('mousedown', item.div, function (e) {
            if (item.action == 'use' && isLmb(e) || item.action == 'drop' && isRmb(e)) {
                e.stopPropagation();
                item.actionQueued = true;
            }
        });
        setEventListener('mouseup', item.div, function (e) {
            if (item.actionQueued && (item.action == 'use' && isLmb(e) || item.action == 'drop' && isRmb(e))) {
                e.preventDefault();
                _this.pushAction(item);
                item.actionQueued = false;
            }
        });
        setEventListener('touchstart', item.div, function (e) {
            if (e.changedTouches.length > 0) {
                e.stopPropagation();
                item.actionQueued = true;
                item.actionTime = new Date().getTime();
                item.touchOsId = e.changedTouches[0].identifier;
            }
        });
        setEventListener('touchend', item.div, function (e) {

            e.preventDefault();
            //e.stopPropagation();
            var changedTouch = e.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);

            if (elem && elem.id == "game-touch-area" && item.action == 'drop') {
                _this.pushAction(item);
            }

            var elapsed = new Date().getTime() - item.actionTime;
            if ( //elapsed < kTouchHoldDuration &&
            item.actionQueued && item.action == 'use') {
                //&& (item.type == 'loot' && (elem && elem.className.includes('ui-loot')) || item.type == 'weapon')) {
                _this.pushAction(item);
            }
            item.actionQueued = false;
        });
        setEventListener('touchcancel', item.div, function (e) {
            item.actionQueued = false;
        });
    };

    for (var _i25 = 0; _i25 < this.itemActions.length; _i25++) {
        _loop(_i25);
    }

    var canvas = document.getElementById('cvs');
    this.clearQueuedItemActions = function () {
        for (var _i26 = 0; _i26 < _this.itemActions.length; _i26++) {
            var itemAction = _this.itemActions[_i26];
            itemAction.actionQueued = false;
        }

        // @HACK: Get rid of :hover styling when using touch
        if (device.touch) {
            canvas.focus();
        }
    };
    window.addEventListener('mouseup', this.clearQueuedItemActions);
    window.addEventListener('focus', this.clearQueuedItemActions);

    this.onKeyUp = function (event) {
        // Add an input handler specifically to handle fullscreen on Firefox;
        // "requestFullscreen() must be called from inside a short running user-generated event handler."
        var keyCode = event.which || event.keyCode;
        var bind = _this.inputBinds.getBind(GameInput.Fullscreen);
        if (bind && keyCode == bind.code) {
            helpers.toggleFullScreen();
        }
    };
    window.addEventListener('keyup', this.onKeyUp);
}

m_Ui2Manager.prototype = {
    m_free: function m_free() {
        for (var i = 0; i < this.eventListeners.length; i++) {
            var e = this.eventListeners[i];
            e.elem.removeEventListener(e.event, e.fn);
        }

        for (var key in this.slotsInventory) {
            this.slotsInventory[key] = {
                item: "",
                total: 0
            };
        }
        this.updateSlotItems(this.slotsInventory);

        window.removeEventListener('focus', this.clearQueuedItemActions);
        window.removeEventListener('mouseup', this.clearQueuedItemActions);
        window.removeEventListener('keyup', this.onKeyUp);
    },

    pushAction: function pushAction(itemAction) {
        this.uiEvents.push({
            action: itemAction.action,
            type: itemAction.type,
            data: itemAction.data
        });
    },

    flushInput: function flushInput() {
        this.uiEvents = [];
    },

    m_update: function m_update(dt, player, spectating, playerBarn, lootBarn, map, inputBinds, touchManager, camera) {
        var state = this.newState;
        state.refreshBinds = inputBinds.refreshBinds;

        if (device.mobile) {
            this.touchManager = touchManager;
            this.camera = camera;
        }
        //
        // Device
        //
        state.mobile = device.mobile;
        state.touch = device.touch;

        //
        // Process touch-hold events
        //
        if (state.touch) {
            for (var i = 0; i < this.itemActions.length; i++) {
                var itemAction = this.itemActions[i];
                if (!itemAction.actionQueued || itemAction.action != 'drop') {
                    continue;
                }

                var time = new Date().getTime();
                var elapsed = time - itemAction.actionTime;
            }
        }

        //
        // Perk message
        //
        {
            if (state.rareLootMessage.ticker >= state.rareLootMessage.duration) {
                // Create a new message if we aren't displaying one
                if (this.rareLootMessageQueue.length > 0) {
                    var lootType = this.rareLootMessageQueue.shift();

                    state.rareLootMessage.lootType = lootType;
                    state.rareLootMessage.ticker = 0.0;
                    state.rareLootMessage.duration = this.rareLootMessageQueue.length > 0 ? 2.0 : 4.0;
                    state.rareLootMessage.opacity = 0.0;
                }
            }

            // Update displayed message message
            state.rareLootMessage.ticker += dt;
            var t = state.rareLootMessage.ticker;
            var d = state.rareLootMessage.duration;
            state.rareLootMessage.opacity = 1.0 - math.smoothstep(t, d - 0.2, d);
        }

        //
        // Pickup message
        //
        {
            state.pickupMessage.ticker += dt;
            var _t = state.pickupMessage.ticker;
            var _d = state.pickupMessage.duration;
            state.pickupMessage.opacity = math.smoothstep(_t, 0.0, 0.2) * (1.0 - math.smoothstep(_t, _d, _d + 0.2)) * (1.0 - state.rareLootMessage.opacity);
        }

        //
        // Pickup message
        //
        {
            state.pickupMessageMobile.ticker += dt;
            var _t2 = state.pickupMessageMobile.ticker;
            var _d2 = state.pickupMessageMobile.duration;
            state.pickupMessageMobile.opacity = math.smoothstep(_t2, 0.0, 0.2) * (1.0 - math.smoothstep(_t2, _d2, _d2 + 0.2));
        }

        //
        // Kill message
        //
        {
            state.killMessage.ticker += dt;
            var _t3 = state.killMessage.ticker;
            var _d3 = state.killMessage.duration;
            state.killMessage.opacity = (1.0 - math.smoothstep(_t3, _d3 - 0.2, _d3)) * (1.0 - state.rareLootMessage.opacity);
        }

        //
        // KillFeed
        //
        {
            var offset = 0.0;
            for (var _i27 = 0; _i27 < state.killFeed.length; _i27++) {
                var line = state.killFeed[_i27];
                line.ticker += dt;
                var _t4 = line.ticker;
                line.offset = offset;
                line.opacity = math.smoothstep(_t4, 0.0, 0.25) * (1.0 - math.smoothstep(_t4, 6.0, 6.5));
                offset += math.min(_t4 / 0.25, 1.0);
                // Shorter animation on mobile
                if (device.mobile) {
                    line.opacity = _t4 < 6.5 ? 1.0 : 0.0;
                }
            }
        }

        //
        // Player status
        //
        state.health = player.m_netData.m_dead ? 0.0 : math.max(player.m_localData.m_health, 1.0);
        state.maxHealth = player.m_netData.m_dead ? 0.0 : math.max(player.m_localData.m_maxHealth, 1.0);
        state.boost = player.m_localData.m_boost;
        state.downed = player.m_netData.m_downed;
        state.luck = player.m_localData.m_luck;
        state.wet = player.m_localData.m_wet;
        state.contact = player.m_localData.m_contact;
        state.burning = player.m_localData.m_burning;
        state.nitroLaceEffect = player.m_netData.m_nitroLaceEffect;
        state.nitroLace = player.m_localData.m_nitroLace;
        state.chargingHeavyAttack = player.WeaponManager.isHoldTimeHeavyAttack();
        state.selectedSkill = player.WeaponManager.selectedSkill;
        state.selectedSlot = player.WeaponManager.selectedSkill && (player.WeaponManager.selectedSkill == GameConfig.SelectedSkill.Throwable || player.WeaponManager.selectedSkill == GameConfig.SelectedSkill.Consumable) || player.WeaponManager.selectedSkill === GameConfig.SelectedSkill.None && player.WeaponManager.currentOffHand ? player.WeaponManager.skillParams.slotId : 0;

        state.powerStat = player.m_netData.m_powerStat;
        state.speedStat = player.m_netData.m_speedStat;
        state.vitalityStat = player.m_netData.m_vitalityStat;

        state.statsPoints = player.m_netData.m_statsPoints;
        state.playerXP = player.m_netData.m_playerXP;
        state.level = player.m_netData.m_level;

        //Attacks cooldowns
        var mainWeaponAvailableSkillsIds = player.WeaponManager.mainWeaponAvailableSkillsIds;
        if (player.WeaponManager.resetSkillCooldowns) {
            player.WeaponManager.resetSkillCooldowns = false;
            state['skill_1_Cooldown'] = 0;
            state['skill_2_Cooldown'] = 0;
            state['skill_3_Cooldown'] = 0;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(mainWeaponAvailableSkillsIds), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var attackId = _step.value;

                //if(player.WeaponManager.mainWeaponCooldowns[attackId] >= 0.01){
                state[attackId + '_Cooldown'] = player.WeaponManager.mainWeaponCooldowns[attackId];
                state[attackId + '_TotalCooldown'] = player.WeaponManager.mainWeaponDef.attacks[attackId] ? player.WeaponManager.mainWeaponDef.attacks[attackId].cooldownTime : 0;
                //}
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

        var offHandAvailableSkillsIds = player.WeaponManager.offHandAvailableSkillsIds;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(offHandAvailableSkillsIds), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var skillId = _step2.value;

                //if(player.WeaponManager.offHandCooldowns[skillId] >= 0.01){
                //If off hand has more than one skills change logic to update HUD
                state['offHand_Cooldown'] = player.WeaponManager.offHandCooldowns[skillId]; /*? 
                                                                                            state['offHand_Cooldown'] == null || state['offHand_Cooldown'] == 0.0 ?
                                                                                            state['offHand_Cooldown'];*/
                state['offHand_TotalCooldown'] = player.WeaponManager.offHandDef.skills[skillId] ? player.WeaponManager.offHandDef.skills[skillId].cooldownTime : 0;
                break;
                //}
            }

            //Dash
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

        state.dashCooldown = player.m_netData.m_dashCooldown != 0 ? state.dashCooldown == 0.0 ? state.dashCooldown = player.m_netData.m_dashCooldown : state.dashCooldown -= dt : state.dashCooldown = 0;

        //
        // Interaction
        //
        var interactionType = InteractionType.None;
        var interactionObject = null;
        var interactionUsable = true;
        if (player.canInteract(map)) {
            // Cancel
            if ((player.action.type == Action.UseItem || player.action.type == Action.Revive && (!player.m_netData.m_downed || canSelfRevive)) && !spectating) {
                interactionType = InteractionType.Cancel;
                interactionObject = null;
                interactionUsable = true;
            }
            // Usable obstacles
            var closestObj = null;
            var closestPen = 0.0;
            var obstacles = map.m_obstaclePool.m_getPool();
            for (var _i28 = 0; _i28 < obstacles.length; _i28++) {
                var o = obstacles[_i28];
                if (!o.active || o.dead || !util.sameLayer(o.layer, player.layer)) {
                    continue;
                }
                var interact = o.getInteraction();
                if (!interact) {
                    continue;
                }
                /*let res = collider.intersectCircle(
                    o.collider, player.m_netData.m_pos, interact.rad + player.rad
                );*/

                var playerCollider = JSON.parse((0, _stringify2.default)(player.collider));
                playerCollider.min = v2.sub(playerCollider.min, GameConfig.player.playerInteractionRad);
                playerCollider.max = v2.add(playerCollider.max, GameConfig.player.playerInteractionRad);

                var res = collider.intersectPlayer(playerCollider, o.collider);

                if (res && res.pen >= closestPen) {
                    closestObj = o;
                    closestPen = res.pen;
                }
            }
            if (closestObj) {
                interactionType = InteractionType.Object;
                interactionObject = closestObj;
                interactionUsable = true;
            }

            // Loot
            var loot = lootBarn.m_getClosestLoot();
            if (loot && !player.m_netData.m_downed) {
                // Ignore if it's a gun and we have full guns w/ fists out...
                // unless we're on a small screen
                var itemDef = GameObjectDefs[loot.type];
                var primary = false; //player.m_hasWeaponInSlot(
                //GameConfig.WeaponSlot.Primary
                //);
                var secondary = player.m_hasWeaponInSlot(GameConfig.WeaponSlot.OffHand);
                var hasFullWeapons = primary && secondary;

                var usable = itemDef.type != 'gun' || !hasFullWeapons || player.m_equippedWeaponType() == 'gun';

                // @HACK: Refactor this!
                var hackUsable = false;
                if (state.touch && itemDef.type == 'helmet' && player.m_getHelmetLevel() == itemDef.level && loot.type != player.m_netData.m_helmet || itemDef.type == 'chest' && player.m_getChestLevel() == itemDef.level && loot.type != player.m_netData.m_chest || itemDef.type == 'neck' && player.m_getNeckLevel() == itemDef.level && loot.type != player.m_netData.m_neck) {
                    hackUsable = true;
                }

                if (usable || device.uiLayout == device.UiLayout.Sm) {
                    interactionType = InteractionType.Loot;
                    interactionObject = loot;
                }
                interactionUsable = usable && (!state.touch || itemDef.type == 'gun' || itemDef.type == 'melee' || itemDef.type == 'outfit' || itemDef.type == 'perk' || hackUsable);
            }

            // Reviving
            var canSelfRevive = false; //TODO delete this var if not used
            if (player.action.type == Action.None && (!player.m_netData.m_downed || canSelfRevive)) {
                var ourTeamId = playerBarn.m_getPlayerInfo(player.__id).teamId;
                var players = playerBarn.m_playerPool.m_getPool();

                for (var _i29 = 0; _i29 < players.length; _i29++) {
                    var p = players[_i29];
                    if (!p.active) {
                        continue;
                    }

                    var theirTeamId = playerBarn.m_getPlayerInfo(p.__id).teamId;

                    if (p.__id == player.__id && !canSelfRevive || ourTeamId != theirTeamId) {
                        continue;
                    }

                    if (p.m_netData.m_downed && !p.m_netData.m_dead && p.action.type != Action.Revive) {

                        var dist = v2.length(v2.sub(p.m_netData.m_pos, player.m_netData.m_pos));
                        if (dist < GameConfig.player.reviveRange && util.sameLayer(p.layer, player.layer)) {
                            interactionType = InteractionType.Revive;
                            interactionObject = p;
                            interactionUsable = true;
                        }
                    }
                }
            }

            // Reviving
            if (player.action.type == Action.Revive && player.m_netData.m_downed && !canSelfRevive) {
                interactionType = InteractionType.None;
                interactionObject = null;
                interactionUsable = false;
            }
        }
        state.interaction.type = interactionType;
        state.interaction.text = this.getInteractionText(interactionType, interactionObject, player);

        var effectData = this.getInteractionEffect(interactionType, interactionObject);
        state.interaction.effectText = effectData.txt;
        state.interaction.effectTextColor = effectData.textColor;

        state.interaction.stats = this.getInteractionStat(interactionType, interactionObject);
        state.interaction.weaponType = this.getInteractionWeaponType(interactionType, interactionObject);
        state.interaction.damageType = this.getInteractionDamageType(interactionType, interactionObject);

        var rarityData = this.getInteractionRarity(interactionType, interactionObject);
        state.interaction.rarityType = rarityData.rarityText;
        state.interaction.rarityClass = rarityData.rarityClass;

        state.interaction.key = this.getInteractionKey(interactionType);

        /* state.interaction.isFullInventory = this.isFullInventory(
            interactionType, interactionObject
        ); */

        state.interaction.usable = interactionUsable && !spectating;
        var damage = this.getWeaponDefinitionBaseDamage(interactionType, interactionObject);
        if (damage) {
            var weapDamage = player.WeaponManager.getWeaponBaseDamage();
            state.interaction.damageDiff = damage == weapDamage ? Damage.equal : damage > weapDamage ? Damage.better : Damage.worst;
        } else {
            state.interaction.damageDiff = Damage.equal;
        }

        //  state.statusEffects = player.m_netData.effects; 

        var disableHUD = this.updateEffectsContainer(player);

        var currentAttack = player.WeaponManager.currentAttack;
        state.currentAttack = disableHUD || state.downed || player.WeaponManager.isAttacking && currentAttack && !currentAttack.cancelable;

        if (state.currentAttack) {
            for (var _i30 = 0; _i30 < this.dom.slotButtons.length; _i30++) {
                //const slot = SlotButtonsActions[i];
                var slotButton = this.dom.slotButtons[_i30];
                var slotContainer = domElemById('ui-pickup-' + slotButton.slot);

                if (this.slotsInventory && this.slotsInventory[_i30] && this.slotsInventory[_i30].item) {
                    slotContainer.classList.add('ui-item-overlay');
                } else {
                    slotContainer.classList.remove('ui-item-overlay');
                }
            }
            $('.ui-skill-icon').addClass('ui-item-overlay');
            $('#ui-light-attack-icon').addClass('ui-item-overlay');
        } else {
            $('.ui-pickup-item').removeClass('ui-item-overlay');
            $('.ui-skill-icon').removeClass('ui-item-overlay');
            $('#ui-light-attack-icon').removeClass('ui-item-overlay');
        }

        //
        // Weapons
        //
        state.currentWeapon = player.WeaponManager.currentMainWeapon;
        state.currentOffHand = player.WeaponManager.currentOffHand;
        state.loading = player.m_netData.m_loadingBlaster;
        for (var _i31 = 0; _i31 < player.m_localData.m_weapons.length; _i31++) {
            var weap = player.m_localData.m_weapons[_i31];
            var x = state.weapons[_i31];

            x.type = weap.type;
            x.ammo = weap.ammo;
            if (_i31 == GameConfig.WeaponSlot.Throwable) {
                x.ammo = player.m_localData.m_inventory[weap.type] || 0;
            }
            var wasEquipped = x.equipped;
            x.equipped = _i31 == player.m_localData.m_curWeapIdx;
            x.selectable = (weap.type != '' || _i31 == 0 || _i31 == 1) && !spectating;

            var opacityTarget = x.equipped ? 1.0 : 0.6;
            var opacityDiff = opacityTarget - x.opacity;
            var opacityStep = math.min(opacityDiff, math.sign(opacityDiff) * dt / 0.15);
            x.opacity = math.clamp(x.opacity + opacityStep, 0.0, 1.0);
            // No animation on mobile
            if (device.mobile) {
                x.opacity = opacityTarget;
            }

            // Grey out unloaded bugles
            if (x.type == 'bugle' && x.ammo == 0) {
                x.opacity = 0.25;
            }

            x.ticker += dt;
            if (!x.equipped || !wasEquipped) {
                x.ticker = 0.0;
            }
            if (this.frameCount < 2) {
                // Skip animation when starting the game
                x.ticker = 1.0;
            }
            var _t5 = math.min(x.ticker / 0.09, Math.PI);
            var width = Math.sin(_t5);
            x.width = width < 0.001 ? 0.0 : width;
            // No animation on mobile
            if (device.mobile) {
                x.width = 0.0;
            }

            var bind = inputBinds.getBind(x.bind);
            x.bindStr = bind ? bind.toString() : '';
        }

        //
        // Ammo
        //
        {
            var curWeap = state.weapons[player.m_localData.m_curWeapIdx];
            var weapDef = GameObjectDefs[curWeap.type];
            var ammoCur = curWeap.ammo;
            var ammoRem = weapDef.type == 'gun' ? weapDef.ammoInfinite || player.hasPerk('endless_ammo') && !weapDef.ignoreEndlessAmmo ? Number.MAX_VALUE : player.m_localData.m_inventory[weapDef.ammo] : 0;
            state.ammo.current = ammoCur;
            state.ammo.remaining = ammoRem;
            state.ammo.displayCurrent = weapDef.type != 'melee';
            state.ammo.displayRemaining = ammoRem > 0;
        }

        //
        // Scopes
        //
        for (var _i32 = 0; _i32 < state.scopes.length; _i32++) {
            var scope = state.scopes[_i32];
            scope.visible = player.m_localData.m_inventory[scope.type] > 0;
            scope.equipped = scope.visible && player.m_localData.m_scope == scope.type;
            scope.selectable = scope.visible && !spectating;
        }

        //
        // Loot - @TODO: Modify 
        //
        var bagLevel = player.m_getBagLevel();
        for (var _i33 = 0; _i33 < state.loot.length; _i33++) {
            var _loot = state.loot[_i33];
            var countOld = _loot.count;
            _loot.count = player.m_localData.m_inventory[_loot.type] || 0;
            _loot.maximum = GameConfig.bagSizes[_loot.type][bagLevel];
            _loot.selectable = _loot.count > 0 && !spectating;

            if (_loot.count > countOld) {
                _loot.ticker = 0.0;
            }
            if (this.frameCount < 2) {
                // Skip animation when starting the game
                _loot.ticker = 1.0;
            }
            _loot.ticker += dt;
            var _t6 = math.min(_loot.ticker / 0.05, Math.PI);
            var _width = Math.sin(_t6);
            _loot.width = _width < 0.001 ? 0.0 : _width;
            // No animation on mobile
            if (device.mobile) {
                _loot.width = 0.0;
            }
        }

        //Slot items
        if (player.m_localData.inventoryDirty) {
            this.slotsInventory = player.m_localData.m_slotsInventory;

            this.updateSlotItems(this.slotsInventory);
        }
        //
        // Gear
        //
        for (var _i34 = 0; _i34 < state.gear.length; _i34++) {
            var gear = state.gear[_i34];
            var _item = '';
            if (gear.type == 'chest') {
                _item = player.m_netData.m_chest;
            } else if (gear.type == 'helmet') {
                _item = player.m_netData.m_helmet;
            } else if (gear.type == 'backpack') {
                _item = player.m_netData.m_backpack;
                // Don't display the level 0 backpack
                if (_item == 'backpack00') {
                    _item = '';
                }
            }
            var gearOld = gear.item;
            gear.item = _item;
            gear.selectable = _item != '' && !spectating;

            if (gearOld != gear.item) {
                gear.ticker = 0.0;
            }
            if (this.frameCount < 2) {
                // Skip animation when starting the game
                gear.ticker = 1.0;
            }
            gear.ticker += dt;
            var _t7 = math.min(gear.ticker / 0.05, Math.PI);
            var _width2 = Math.sin(_t7);
            gear.width = _width2 < 0.001 ? 0.0 : _width2;
            // No animation on mobile
            if (device.mobile) {
                gear.width = 0.0;
            }
        }

        //
        // Perks
        //
        for (var _i35 = 0; _i35 < state.perks.length; _i35++) {
            var perk = state.perks[_i35];

            if (player.perks.length > _i35) {
                var playerPerk = player.perks[_i35];

                perk.type = playerPerk.type;
                perk.droppable = playerPerk.droppable;
                if (playerPerk.isNew) {
                    perk.ticker = 0.0;
                }
                if (this.frameCount < 2) {
                    // Skip animation when starting the game
                    perk.ticker = 1.0;
                }

                perk.ticker += dt;
                var _t8 = math.min(perk.ticker / 0.05, Math.PI);
                var _width3 = Math.sin(_t8);
                perk.width = _width3 < 0.001 ? 0.0 : _width3;
                // No animation on mobile
                if (device.mobile) {
                    perk.width = 0.0;
                }
                perk.pulse = !device.mobile && perk.ticker < 4.0;
            } else {
                perk.type = '';
            }
        }

        //
        // render state diff
        //

        var patch = diff(this.oldState, this.newState, this.frameCount++ == 0);
        patch.nitroLaceEffect = this.newState.nitroLaceEffect;
        this.render(patch, this.newState);
        copy(this.newState, this.oldState);
    },

    updateSkillButtonsStatus: function updateSkillButtonsStatus(state) {
        var _this2 = this;

        var buttonData = null;
        var oldButtonData = null;
        if (state.selectedSkill != GameConfig.SelectedSkill.Throwable && state.selectedSkill != GameConfig.SelectedSkill.Consumable && !(state.selectedSkill === GameConfig.SelectedSkill.None && state.currentOffHand)) {
            buttonData = this.dom.skillButtons.find(function (button) {
                return button.skill === state.selectedSkill;
            });
        } else {
            buttonData = this.dom.slotButtons.find(function (button) {
                return button.slot === state.selectedSlot;
            });
        }

        if (this.oldState.selectedSkill != GameConfig.SelectedSkill.Throwable && this.oldState.selectedSkill != GameConfig.SelectedSkill.Consumable && !(this.oldState.selectedSkill === GameConfig.SelectedSkill.None && this.oldState.currentOffHand)) {
            oldButtonData = this.dom.skillButtons.find(function (button) {
                return button.skill === _this2.oldState.selectedSkill;
            });
        } else {
            oldButtonData = this.dom.slotButtons.find(function (button) {
                return button.slot === _this2.oldState.selectedSlot;
            });
        }

        if (buttonData) {
            buttonData.div.classList.add('selected');
        }

        if (oldButtonData) {
            oldButtonData.div.classList.remove('selected');
        }
    },

    render: function render(patch, state) {
        var dom = this.dom;

        // Mobile

        if (patch.mobile) {
            // Do nothing
        }

        if (patch.refreshBinds) {
            //Skill Key binds TODO:Only when Keys Update
            this.updateSkillBinds();

            //Slot key binds
            this.updateSlotPickUpBinds();

            //Emote key
            // this.updateEmoteBind();
        }

        // Touch
        if (patch.touch) {
            // Interaction visual
            /*  dom.interaction.key.style.backgroundImage =
                 state.touch ? "url('img/gui/tap.svg')" : 'none'; */
            if (state.touch) {
                dom.interaction.key.innerHTML = '';
            }

            // Buttons
            dom.menu.touchStyles.style.display = state.touch ? 'flex' : 'none';
            dom.menu.aimLine.style.display = state.touch ? 'block' : 'none';
            dom.ammo.reloadButton.style.display = state.touch ? 'block' : 'none';
            dom.emoteButton.style.display = state.touch ? 'block' : 'none';
            if (dom.debugButton) {
                dom.debugButton.style.display = state.touch ? 'block' : 'none';
            }
        }

        // Rare loot message
        if (patch.rareLootMessage.lootType) {
            var lootType = state.rareLootMessage.lootType;
            var lootDef = GameObjectDefs[lootType];
            if (lootDef && lootDef.type == 'xp') {
                var lootDesc = this.localization.translate('game-xp-drop-desc');
                dom.rareLootMessage.desc.innerHTML = '+' + lootDef.xp + ' ' + lootDesc;
            } else {
                dom.rareLootMessage.desc.innerHTML = '';
            }
            var bgImg = lootDef && lootDef.lootImg && lootDef.lootImg.border ? 'url(img/loot/' + lootDef.lootImg.border.slice(0, -4) + '.svg)' : 'none';
            dom.rareLootMessage.imageWrapper.style.backgroundImage = bgImg;
            var lootImg = helpers.getSvgFromGameType(lootType);
            dom.rareLootMessage.icon.style.backgroundImage = lootImg ? 'url(\'' + lootImg + '\')' : 'none';
            var lootName = this.localization.translate('game-' + lootType);
            dom.rareLootMessage.name.innerHTML = lootName;
        }
        if (patch.rareLootMessage.opacity) {
            dom.rareLootMessage.wrapper.style.opacity = state.rareLootMessage.opacity;
        }

        // Pickup message
        if (patch.pickupMessage.message) {
            dom.pickupMessage.innerHTML = state.pickupMessage.message;
        }
        if (patch.pickupMessage.opacity) {
            dom.pickupMessage.style.opacity = state.pickupMessage.opacity;
        }

        // Pickup message mobile
        if (patch.pickupMessageMobile.message) {
            dom.pickupMessageMobile.text.innerHTML = state.pickupMessageMobile.message;
        }
        if (patch.pickupMessageMobile.opacity) {
            dom.pickupMessageMobile.div.style.opacity = state.pickupMessageMobile.opacity;
        }

        // Kill message
        if (patch.killMessage.text || patch.killMessage.count) {
            dom.killMessage.text.innerHTML = state.killMessage.text;
            dom.killMessage.count.innerHTML = state.killMessage.count;
        }
        if (patch.killMessage.opacity) {
            dom.killMessage.div.style.opacity = state.killMessage.opacity;
        }

        // KillFeed
        for (var i = 0; i < patch.killFeed.length; i++) {
            var patchK = patch.killFeed[i];
            var domK = dom.killFeed.lines[i];
            var x = state.killFeed[i];

            if (patchK.text) {
                domK.text.innerHTML = x.text;
            }
            if (patchK.offset) {
                var top = device.uiLayout == device.UiLayout.Sm && !device.tablet ? 15 : 20;
                domK.line.style.top = Math.floor(x.offset * top) + 'px';
            }
            /*if (patchK.color) {
                domK.text.style.color = x.color;
            }*/
            if (patchK.opacity) {
                domK.line.style.opacity = x.opacity;
            }
        }

        // Health
        if (patch.health || patch.downed || patch.maxHealth) {

            var displayHealthPorcentage = state.health * 100 / state.maxHealth;
            this.updateHealthValues(state.health, state.maxHealth);

            var steps = [{ health: 100.0, color: [255, 25, 87] }, { health: 100.0, color: [255, 255, 255] }, { health: 75.0, color: [255, 255, 255] }, { health: 50.0, color: [255, 158, 158] }, { health: 25.0, color: [255, 82, 82] }, { health: 25.0, color: [255, 0, 0] }, { health: 0.0, color: [255, 0, 0] }];
            var endIdx = 0;
            var health = Math.ceil(displayHealthPorcentage);
            while (steps[endIdx].health > health && endIdx < steps.length - 1) {
                endIdx++;
            }
            var stepA = steps[math.max(endIdx - 1, 0)];
            var stepB = steps[endIdx];
            var t = math.delerp(displayHealthPorcentage, stepA.health, stepB.health);
            var rgb = [Math.floor(math.lerp(t, stepA.color[0], stepB.color[0])), Math.floor(math.lerp(t, stepA.color[1], stepB.color[1])), Math.floor(math.lerp(t, stepA.color[2], stepB.color[2]))];
            if (state.downed) {
                rgb = [255, 0, 0];
            }

            if (state.health <= 0.0) {
                this.setPlayerXP(0);
            }

            /* dom.health.inner.style.backgroundColor =
                `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1.0)`; */
            dom.health.inner.style.background = 'linear-gradient(180deg, #D4002C 0%, #9F0020 73.96%, #6F0017 100%);';

            var newBarHealth = displayHealthPorcentage + '%';

            var currentHealth = parseFloat(newBarHealth);
            var currentWidth = parseFloat(dom.health.preview.style.width);

            if (currentWidth <= currentHealth) {
                dom.health.inner.classList.add('bar-width-transition');
                dom.health.preview.classList.remove('bar-width-transition');

                dom.health.preview.style.width = newBarHealth;
                setTimeout(function () {
                    dom.health.inner.style.width = newBarHealth;
                }, 300);
            } else {
                dom.health.preview.classList.remove('bar-width-transition');
                dom.health.inner.classList.remove('bar-width-transition');

                dom.health.preview.style.width = dom.health.inner.style.width;
                dom.health.preview.classList.add('bar-width-transition');
                dom.health.inner.style.width = newBarHealth;
                setTimeout(function () {
                    dom.health.preview.style.width = newBarHealth;
                }, 300);
            }

            /*  dom.health.depleted.style.width = displayHealthPorcentage + '%';
             dom.health.depleted.style.display = displayHealthPorcentage > 0.0 ?
                 'block' : 'none'; */
            dom.health.depleted.style.display = displayHealthPorcentage > 0.0 ? 'block' : 'none';
            if (displayHealthPorcentage > 25.0 && !state.downed) {
                dom.health.inner.classList.remove('health-bar-pulse');
            } else {
                dom.health.inner.classList.add('health-bar-pulse');
            }
        }

        // Boost @TODO: Refactor or Remove
        if (patch.boost) {
            /*const breakpoints = GameConfig.player.boostBreakpoints;
            let breakpointTotal = 0;
            for (let i = 0; i < breakpoints.length; i++) {
                breakpointTotal += breakpoints[i];
            }
            let boost = state.boost / 100.0;
            for (let i = 0; i < dom.boost.bars.length; i++) {
                let breakpoint = breakpoints[i] / breakpointTotal;
                let width = math.clamp(boost / breakpoint, 0.0, 1.0);
                boost = math.max(boost - breakpoint, 0.0);
                dom.boost.bars[i].style.width = (width * 100.0) + '%';
            }
            dom.boost.div.style.opacity = state.boost == 0.0 ? 0.0 : 1.0;
            dom.boost.div.style.display = state.boost == 0.0 ? "none" : "inline-flex";*/
        }

        if (patch.luck) {
            //@TODO: Refactor or Remove
            var percentajeLuck = state.luck / 100 * dom.luck.bar.width;
            dom.luck.bar.style.clip = "rect(0px " + percentajeLuck + "px 50px 0px)";
        }

        if (patch.wet) {
            //@TODO: Refactor or Remove
            var percentajeWet = state.wet / 100 * dom.wet.bar.width;
            dom.wet.bar.style.clip = "rect(0px " + percentajeWet + "px 50px 0px)";
        }

        if (patch.contact) {
            //@TODO: Refactor or Remove
            var percentajeContact = state.contact / 100 * dom.contact.bar.width;
            dom.contact.bar.style.clip = "rect(0px " + percentajeContact + "px 100px 0px)";
        }

        if (patch.nitroLaceEffect) {
            //@TODO: Refactor or Remove
            dom.nitroLace.clip.classList.add('nitro-lace');
        } else {
            dom.nitroLace.clip.classList.remove('nitro-lace');
        }

        if (patch.nitroLace) {
            //@TODO: Refactor or Remove
            var percentajeNitroLace = state.nitroLace;
            dom.nitroLace.clipContainer.style.width = percentajeNitroLace + "%";
        }

        if (patch.burning) {
            //@TODO: Refactor or Remove
            dom.burning.bar.style.width = state.burning + '%';
        }

        if (patch.powerStat) {
            this.setPowerStats(state.powerStat);
        }

        if (patch.vitalityStat) {
            this.setVitalityStats(state.vitalityStat);
        }

        if (patch.speedStat) {
            this.setAgilityStats(state.speedStat);
        }

        if (patch.statsPoints) {
            this.setStatsPoints(state.statsPoints);
        }

        if (patch.level) {
            this.setLevel(state.level, state.playerXP);
        }

        if (patch.playerXP && !patch.level) {
            this.setPlayerXP(state.playerXP);
        }

        //Attacks
        if (patch.skill_1_Cooldown) {
            this.setCooldown(activityType.skill, state.skill_1_TotalCooldown, state.skill_1_Cooldown, Skills.Skill_1);
        }

        if (patch.skill_2_Cooldown) {
            this.setCooldown(activityType.skill, state.skill_2_TotalCooldown, state.skill_2_Cooldown, Skills.Skill_2);
        }

        if (patch.skill_3_Cooldown) {
            this.setCooldown(activityType.skill, state.skill_3_TotalCooldown, state.skill_3_Cooldown, Skills.Skill_3);
        }

        if (patch.offHand_Cooldown) {
            //    this.setCooldown(activityType.offHand, state.offHand_TotalCooldown, state.offHand_Cooldown);
        }

        if (patch.heavyAttack_Cooldown) {
            this.setCooldown(activityType.heavyAttack, state.heavyAttack_TotalCooldown, state.heavyAttack_Cooldown);
        }
        if (patch.lightAttack_Cooldown) {
            this.setCooldown(activityType.lightAttack, state.lightAttack_TotalCooldown, state.lightAttack_Cooldown);
        }

        // Dash
        if (patch.dashCooldown) {
            this.setCooldown(activityType.dash, GameConfig.player.dashCooldownTime, state.dashCooldown);
        }

        /*  if (patch.interaction.isFullInventory) {
              if(state.interaction.isFullInventory) {
                 $("#ui-full-inventory").show();
             } else{
                 $("#ui-full-inventory").hide();
             }
         }  */

        // Interaction
        if (patch.interaction.type) {
            dom.interaction.div.style.display = state.interaction.type == InteractionType.None || state.interaction.type == InteractionType.Cancel ? 'none' : 'flex';
            dom.interaction.key.style.display = state.interaction.type == InteractionType.None || state.interaction.type == InteractionType.Cancel ? 'none' : 'block';
            dom.interaction.description.style.display = state.interaction.type == InteractionType.Loot ? 'block' : 'none';
            dom.cancelInteraction.div.style.display = state.interaction.type == InteractionType.Cancel ? 'flex' : 'none';
        }
        if (patch.interaction.text) {

            if (state.interaction.type !== InteractionType.Cancel) {
                dom.interaction.name.innerHTML = state.interaction.text;

                var fontSize = dom.interaction.name.offsetWidth * 0.05;
                dom.interaction.name.style.fontSize = fontSize + 'px';

                if (!state.interaction.rarityClass) {
                    var _dom$interaction$cont;

                    var rarityList = ["common", "rare", "epic", "legendary"];
                    (_dom$interaction$cont = dom.interaction.content.classList).remove.apply(_dom$interaction$cont, rarityList);
                    dom.interaction.rarityType.innerHTML = "";
                }
            } else {
                dom.cancelInteraction.name.innerHTML = state.interaction.text;
            }
        }

        if (patch.interaction.rarityType && state.interaction.rarityClass) {
            var _dom$interaction$cont2;

            var _rarityList = ["common", "rare", "epic", "legendary"];
            (_dom$interaction$cont2 = dom.interaction.content.classList).remove.apply(_dom$interaction$cont2, _rarityList);
            dom.interaction.rarityType.innerHTML = state.interaction.rarityType;
            dom.interaction.content.classList.add(state.interaction.rarityClass);
        }

        if (patch.interaction.stats) {
            dom.interaction.stats.innerHTML = state.interaction.stats;
            dom.interaction.stats.className = state.interaction.damageDiff == Damage.worst ? 'worst' : state.interaction.damageDiff == Damage.better ? 'better' : '';
        }

        if (patch.interaction.effectText) {
            dom.interaction.effects.innerHTML = state.interaction.effectText;
            dom.interaction.effects.style.color = state.interaction.effectTextColor;
        }

        if (patch.interaction.weaponType) {
            dom.interaction.weaponType.innerHTML = state.interaction.weaponType;
        }

        if (patch.interaction.damageType) {
            // dom.interaction.damageType.innerHTML = state.interaction.damageType;
        }

        if (patch.interaction.key) {
            if (state.interaction.type !== InteractionType.Cancel) {
                dom.interaction.key.innerHTML = state.touch ? '' : state.interaction.key;
            } else {
                dom.cancelInteraction.key.innerHTML = state.touch ? '' : state.interaction.key;
            }
            /* if(!device.touch){
                dom.interaction.key.className =
                    dom.interaction.key.innerHTML.length > 1 ?
                    'ui-interaction-small' : 'ui-interaction-large';
            } */
        }
        if (patch.interaction.usable && !device.touch) {
            dom.interaction.key.style.display = state.interaction.usable && !device.touch ? 'block' : 'none';
        }

        // Weapons 
        if (patch.currentWeapon || patch.chargingHeavyAttack || patch.selectedSkill || patch.selectedSlot || patch.currentOffHand) {
            var activity = activityType.lightAttack;
            var name = '';
            var transform = '';
            var icon = '';
            var heavyAttackIcon = '';
            var skill1Icon = '';
            var skill2Icon = '';
            var skill3Icon = '';
            var skill1Name = '';
            var skill2Name = '';
            var skill3Name = '';
            var itemDef = GameObjectDefs[state.currentWeapon];
            if (itemDef) {

                name = this.localization.translate('game-hud-' + state.currentWeapon) || this.localization.translate('game-' + state.currentWeapon);

                var weaponIcon = domElemById('ui-weapon-box');
                weaponIcon.style.backgroundImage = 'url(' + helpers.getSvgFromGameType(itemDef.id) + ')';

                icon = itemDef.icon;

                var skillDivName = domElemById('ui-map-info-container-weapon-name');
                skillDivName.innerHTML = name;

                var skillDivType = domElemById('ui-map-info-container-weapon-type');
                skillDivType.innerHTML = this.localization.translate('game-' + itemDef.id + '-damage-type');

                if (itemDef.attacks.heavyAttack) heavyAttackIcon = itemDef.heavyAttackIcon;

                if (itemDef.attacks.skill_1) {
                    skill1Icon = itemDef.attacks.skill_1.icon;
                    skill1Name = itemDef.attacks.skill_1.name;
                }
                if (itemDef.attacks.skill_2) {
                    skill2Icon = itemDef.attacks.skill_2.icon;
                    skill2Name = itemDef.attacks.skill_2.name;
                }
                if (itemDef.attacks.skill_3) {
                    skill3Icon = itemDef.attacks.skill_3.icon;
                    skill3Name = itemDef.attacks.skill_3.name;
                }
                //TODO: ADD Dash Skill -> touchpad function this.touchManagersetTouchPadDashSprite() .img extension -> dash-icon.img
                var skillIcons = [skill1Icon, skill2Icon, skill3Icon];

                this.setIcon(activityType.skill, skill1Icon, Skills.Skill_1, skill1Name);
                this.setIcon(activityType.skill, skill2Icon, Skills.Skill_2, skill2Name);
                this.setIcon(activityType.skill, skill3Icon, Skills.Skill_3, skill3Name);

                if (state.selectedSkill != GameConfig.SelectedSkill.Throwable && state.selectedSkill != GameConfig.SelectedSkill.Consumable) {
                    for (var _i36 = 0; _i36 < SkillButtonsActions.length; _i36++) {
                        if (state.selectedSkill === SkillButtonsActions[_i36]) {
                            icon = skillIcons[_i36];
                            break;
                        }
                    }
                } else {
                    for (var _i37 = 0; _i37 < SlotButtonsActions.length; _i37++) {
                        if (state.selectedSlot === SlotButtonsActions[_i37]) {
                            icon = !device.mobile ? this.slotsInventory[_i37]['item'] : GameObjectDefs[this.slotsInventory[_i37]['item']].lootImg.sprite.slice(0, -4) + '-mobile.img';
                            activity = activityType.activeItem;
                            break;
                        }
                    }
                }

                this.updateSkillButtonsStatus(state);
            }
            transform = helpers.getCssTransformFromGameType(state.currentWeapon);

            if (patch.currentOffHand && state.currentOffHand) {
                var _itemDef = GameObjectDefs[state.currentOffHand];
                var imagePath = "";
                if (_itemDef && _itemDef.icon) {
                    imagePath = _itemDef.icon;
                }
                this.setIcon(activityType.offHand, state.currentOffHand);
            } else if (!state.chargingHeavyAttack) {
                !device.mobile ? this.setIcon(activity, icon) : this.touchManager.setTouchPadSkillSprite(icon);
                activity = activityType.lightAttack;
            } else if (heavyAttackIcon != '') {
                this.setIcon(activityType.lightAttack, heavyAttackIcon);
                !device.mobile ? this.setIcon(activityType.lightAttack, heavyAttackIcon) : this.touchManager.setTouchPadSkillSprite(heavyAttackIcon);
                heavyAttackIcon = '';
            }
        }

        // Ammo
        if (patch.ammo.current) {
            //@TODO: Refactor or Remove
            var count = state.ammo.current;
            dom.ammo.current.innerHTML = count;
            dom.ammo.current.style.color = count > 0 ? 'white' : 'red';
        }
        if (patch.ammo.remaining) {
            //@TODO: Refactor or Remove
            var _count = state.ammo.remaining;
            dom.ammo.remaining.innerHTML = _count == Number.MAX_VALUE ? '&#8734;' : _count;
            dom.ammo.remaining.style.color = _count != 0 ? 'white' : 'red';
        }
        if (patch.ammo.displayCurrent) {
            //@TODO: Refactor or Remove
            dom.ammo.currentClip.style.opacity = state.ammo.displayCurrent ? 1.0 : 0.0;
        }
        if (patch.ammo.displayRemaining) {
            //@TODO: Refactor or Remove
            dom.ammo.remaining.style.opacity = state.ammo.displayRemaining ? 1.0 : 0.0;
            dom.ammo.reloadButton.style.opacity = state.ammo.displayRemaining ? 1.0 : 0.0;
        }

        // Scopes //@TODO: Refactor or Remove
        for (var _i38 = 0; _i38 < patch.scopes.length; _i38++) {
            var patchS = patch.scopes[_i38];
            var domS = dom.scopes[_i38];
            var _x5 = state.scopes[_i38];

            if (patchS.visible) {
                if (_x5.visible) {
                    domS.div.classList.remove('ui-hidden');
                } else {
                    domS.div.classList.add('ui-hidden');
                }
            }
            if (patchS.equipped) {
                if (_x5.equipped) {
                    domS.div.classList.add('ui-zoom-active');
                    domS.div.classList.remove('ui-zoom-inactive');
                } else {
                    domS.div.classList.remove('ui-zoom-active');
                    domS.div.classList.add('ui-zoom-inactive');
                }
            }
            if (patchS.selectable) {
                domS.div.style.pointerEvents = _x5.selectable ? 'auto' : 'none';
            }
        }

        // Loot //@TODO: Refactor or Remove
        for (var _i39 = 0; _i39 < patch.loot.length; _i39++) {
            var patchL = patch.loot[_i39];
            var domL = dom.loot[_i39];
            var _x6 = state.loot[_i39];

            if (!patchL || !domL || !_x6) {
                continue;
            }

            if (patchL.count || patchL.maximum) {
                domL.count.innerHTML = _x6.count;
                domL.div.style.opacity = GameObjectDefs[domL.lootType].special && _x6.count == 0 ? 0.0 : _x6.count > 0 ? 1.0 : 0.25;
                domL.div.style.color = _x6.count == _x6.maximum ? '#ff9900' : '#ffffff';
            }
            if (patchL.width) {
                var scale = 1.0 + _x6.width * 0.33;
                var transformStr = 'scale(' + scale + ', ' + scale + ')';
                domL.image.style.transform = transformStr;
                if (domL.overlay) {
                    domL.overlay.style.transform = transformStr;
                }
            }
            if (patchL.selectable) {
                domL.div.style.pointerEvents = _x6.selectable ? 'auto' : 'none';
            }
        }

        // Gear @TODO: Remove
        for (var _i40 = 0; _i40 < patch.gear.length; _i40++) {
            var patchG = patch.gear[_i40];
            var domG = dom.gear[_i40];
            var _x7 = state.gear[_i40];

            if (patchG.item) {
                var _itemDef2 = _x7.item ? GameObjectDefs[_x7.item] : null;
                var itemLevel = _itemDef2 ? _itemDef2.level : 0;
                domG.div.style.display = _itemDef2 ? 'block' : 'none';
                domG.level.innerHTML = this.localization.translate('game-level-' + itemLevel);
                domG.level.style.color = itemLevel >= 3 ? '#ff9900' : '#ffffff';
                domG.image.src = helpers.getSvgFromGameType(_x7.item);
            }
            if (patchG.selectable) {
                domG.div.style.pointerEvents = _x7.selectable ? 'auto' : 'none';
            }
            if (patchG.width) {
                var _scale = 1.0 + _x7.width * 0.33;
                var _transform = 'scale(' + _scale + ', ' + _scale + ')';
                var _itemDef3 = GameObjectDefs[_x7.item];
                if (_itemDef3 && _itemDef3.lootImg.rot !== undefined) {
                    _transform += ' rotate(' + _itemDef3.lootImg.rot + 'rad)';
                }
                domG.image.style.transform = _transform;
            }
        }

        // Perks @TODO: Remove
        for (var _i41 = 0; _i41 < patch.perks.length; _i41++) {
            var _patchG = patch.perks[_i41];
            var _domG = dom.perks[_i41];
            var _x8 = state.perks[_i41];

            if (_patchG.type) {
                var perkDef = GameObjectDefs[_x8.type];
                _domG.perkType = _x8.type;
                _domG.divTitle.innerHTML = this.localization.translate('game-' + _x8.type);
                _domG.divDesc.innerHTML = this.localization.translate('game-' + _x8.type + '-desc');
                _domG.div.style.display = _x8.type ? 'block' : 'none';
                _domG.image.src = _x8.type ? helpers.getSvgFromGameType(_x8.type) : '';
            }
            if (_patchG.droppable) {
                if (_x8.droppable) {
                    _domG.div.classList.add('ui-outline-hover');
                    _domG.div.classList.remove('ui-perk-no-drop');
                } else {
                    _domG.div.classList.remove('ui-outline-hover');
                    _domG.div.classList.add('ui-perk-no-drop');
                }
            }
            if (_patchG.pulse) {
                if (_x8.pulse) {
                    _domG.div.classList.add('ui-perk-pulse');
                } else {
                    _domG.div.classList.remove('ui-perk-pulse');
                }
            }
            if (_patchG.width) {
                var _scale2 = 1.0 + _x8.width * 0.33;
                _domG.image.style.transform = 'scale(' + _scale2 + ', ' + _scale2 + ')';
            }
        }
    },

    displayPickupMessage: function displayPickupMessage(type) {

        if (type === PickupMsgType.Full) {
            $("#ui-full-inventory").show().delay(3000).fadeOut();
        } else {
            var p = this.newState.pickupMessage;
            p.message = this.getPickupMessageText(type);
            p.ticker = 0.0;
            p.duration = 3.0;
        }
    },

    displayPickupMessageMobile: function displayPickupMessageMobile(item) {
        var p = this.newState.pickupMessageMobile;
        p.message = item.name + " picked up";
        p.ticker = 0.0;
        p.duration = 3.0;
    },

    displayKillMessage: function displayKillMessage(text, count) {
        var p = this.newState.killMessage;
        p.text = text;
        p.count = count;
        p.ticker = 0.0;
        p.duration = 7.0;
    },

    hideKillMessage: function hideKillMessage() {
        this.newState.killMessage.ticker = math.max(this.newState.killMessage.ticker, this.newState.killMessage.duration - 0.2);
    },

    updateHealthValues: function updateHealthValues(currentHP, totalHP) {
        var div = domElemById('ui-health-numbers');
        var data = {
            div: div,
            current: div.getElementsByClassName('ui-health-current')[0],
            total: div.getElementsByClassName('ui-health-total')[0]
        };

        data.current.innerHTML = Math.round(currentHP);
        data.total.innerHTML = Math.round(totalHP);
    },

    resetLevel: function resetLevel() {
        var btnAttack = domElemById('ui-button-stat-0');
        btnAttack.classList.remove("disabled");

        var btnVitality = domElemById('ui-button-stat-1');
        btnVitality.classList.remove("disabled");

        var btnAgility = domElemById('ui-button-stat-2');
        btnAgility.classList.remove("disabled");
        this.setPlayerXP(0);
    },


    setPowerStats: function setPowerStats(newPowerStat) {
        var currentAtkPoints = domElemById('current-atk-points');
        currentAtkPoints.innerHTML = newPowerStat + 1;

        var attackLevel = domElemById('player-attack-level');
        var attackLvl = this.localization.translate('game-player-attack-level');
        attackLevel.innerHTML = this.getLevelTxt(attackLvl, newPowerStat + 1);

        var attackLevelDesc = domElemById('player-attack-level-desc');
        var attackLvlDesc = this.localization.translate('game-player-attack-level-desc');
        attackLevelDesc.innerHTML = this.getLevelTxt(attackLvlDesc, newPowerStat * Levels.power);

        if (newPowerStat >= Levels.maxStatPoints) {
            var btnAttack = domElemById('ui-button-stat-0');
            btnAttack.classList.add("disabled");
        } else {
            var currentNextPoints = domElemById('next-atk-points');
            currentNextPoints.innerHTML = newPowerStat + 2;
        }
    },

    setVitalityStats: function setVitalityStats(newVitalityStat) {
        var currentAtkPoints = domElemById('current-vit-points');
        currentAtkPoints.innerHTML = newVitalityStat + 1;

        var vitalityLevel = domElemById('player-vitality-level');
        var attackLvl = this.localization.translate('game-player-vitality-level');
        vitalityLevel.innerHTML = this.getLevelTxt(attackLvl, newVitalityStat + 1);

        var vitalityLevelDesc = domElemById('player-vitality-level-desc');
        var attackLvlDesc = this.localization.translate('game-player-vitality-level-desc');
        vitalityLevelDesc.innerHTML = this.getLevelTxt(attackLvlDesc, newVitalityStat * Levels.vitality);

        if (newVitalityStat >= Levels.maxStatPoints) {
            var btnAttack = domElemById('ui-button-stat-1');
            btnAttack.classList.add("disabled");
        } else {
            var currentNextPoints = domElemById('next-vit-points');
            currentNextPoints.innerHTML = newVitalityStat + 2;
        }
    },

    setAgilityStats: function setAgilityStats(newAgilityStat) {
        var currentAtkPoints = domElemById('current-agl-points');
        currentAtkPoints.innerHTML = newAgilityStat + 1;

        var agilityLevel = domElemById('player-agility-level');
        var attackLvl = this.localization.translate('game-player-agility-level');
        agilityLevel.innerHTML = this.getLevelTxt(attackLvl, newAgilityStat + 1);

        var agilityLevelDesc = domElemById('player-agility-level-desc');
        var attackLvlDesc = this.localization.translate('game-player-agility-level-desc');
        agilityLevelDesc.innerHTML = this.getLevelTxt(attackLvlDesc, newAgilityStat * Levels.agility);

        if (newAgilityStat >= Levels.maxStatPoints) {
            var btnAttack = domElemById('ui-button-stat-2');
            btnAttack.classList.add("disabled");
        } else {
            var currentNextPoints = domElemById('next-agl-points');
            currentNextPoints.innerHTML = newAgilityStat + 2;
        }
    },

    setStatsPoints: function setStatsPoints(statsPoints) {
        var div = domElemById('stats-points');
        div.innerHTML = statsPoints;

        var statsButtonsContainer = domElemById('ui-stats-buttons-container');
        var levelContainer = domElemById('ui-level-stats-container');
        var statsButtonsAnimationContainer = $('.ui-stat-button-animation');

        if (statsPoints <= 0) {
            statsButtonsContainer.classList.add("disabled");
            statsButtonsContainer.classList.remove("slide-in-bottom");
            statsButtonsContainer.classList.add("slide-out-bottom");

            setTimeout(function () {
                levelContainer.style.display = "none";
            }, 1500);
        } else {
            statsButtonsContainer.classList.remove("disabled");
            statsButtonsContainer.classList.remove("slide-out-bottom");
            statsButtonsContainer.classList.add("slide-in-bottom");
            statsButtonsAnimationContainer.show().delay(1500).fadeOut();

            levelContainer.style.display = "block";
        }
    },

    setLevel: function setLevel(level, xp) {
        var div = domElemById('level-number');
        div.innerHTML = level;

        var levelDiv = domElemById('ui-player-level-txt');
        //let levelDivMiniMap = domElemById('player-stat-level');

        var levelTxt = this.localization.translate('game-player-level');
        levelDiv.innerHTML = level;
        //levelDivMiniMap.innerHTML = this.getLevelTxt(levelTxt, level);

        /*  let divPlayerLevel = domElemById('ui-player-level');
         divPlayerLevel.innerHTML = level; */

        var maxLevel = (0, _keys2.default)(Levels.levels).length;

        if (level >= maxLevel) {
            var levelButton = domElemById('level-up-button');
            levelButton.style.display = "none";
        }

        if (level > 1) {

            if (level < maxLevel) {
                this.setPlayerXP(100);
                var that = this;
                setTimeout(function () {
                    that.setPlayerXP(0);
                }, 1000);

                setTimeout(function () {
                    that.setPlayerXP(xp);
                }, 2000);
            } else {
                this.setPlayerXP(100);
            }
        }
    },

    setPlayerXP: function setPlayerXP(xp) {
        var barXP = domElemById('ui-experience-bar-inner-2');
        var barXPPreview = domElemById('ui-experience-bar-inner-1');

        if (xp > 0) {
            barXP.classList.add('bar-width-transition');
            barXPPreview.style.width = xp + "%";
            setTimeout(function () {
                barXP.style.width = xp + "%";
            }, 300);
        } else {
            //Reset bar
            barXP.classList.remove('bar-width-transition');
            barXPPreview.style.width = xp + "%";
            barXP.style.width = xp + "%";
        }

        /*
        Xp using multiple sections
        let xpPerBar = 100/6;
         let barNumber =Math.floor(xp/xpPerBar);
         let barId = 1;
         for (let i = 0; i < barNumber; i++) {
             let div = domElemById(`ui-experience-bar-inner-${barId}`);
             div.style.width = (100+"%");
             barId++;
         }
          if(barNumber < 6 && xp % xpPerBar) {
             let div = domElemById(`ui-experience-bar-inner-${barId}`);
             div.style.width = ((xp % xpPerBar) * 100/ xpPerBar +"%");
             
         }*/
    },

    /**
     * 
     * @param {string} slotId 
     * @returns 
     */
    getSlotItemHTML: function getSlotItemHTML(slotId) {
        return '\n        <div id="ui-pickup-' + slotId + '" class="ui-pickup-item ui-mid-container-items">\n            <div id=\'ui-pickup-icon-group-' + slotId + '\' class=\'ui-pickup-icon-group ui-mid-container-icons\'>\n                <div id=\'ui-pickup-icon-container-' + slotId + '\' class=\'ui-pickup-icon-container\' data=\'' + slotId + '\'>\n                    <div id=\'ui-pickup-icon-' + slotId + '\' class=\'ui-pickup-icon ui-mid-container-icons-inner\'></div>\n                    <div id=\'ui-pickup-counter-' + slotId + '\' class="ui-pickup-counter ui-mid-container-icons-counter"></div>\n                </div>\n            </div>\n            <div id=\'ui-pickup-key-' + slotId + '\' class=\'ui-mid-container-keys\'></div>\n        </div>\n    ';
    },

    createSlotsItems: function createSlotsItems() {
        var _this3 = this;

        var addItemAction = function addItemAction(action, type, data, div) {
            var itemAction = {
                action: action,
                type: type,
                data: data,
                div: div,
                actionQueued: false,
                actionTime: 0
            };
            _this3.itemActions.push(itemAction);
            return itemAction;
        };

        this.dom.slotsInventoryContainer.innerHTML = '';
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = (0, _getIterator3.default)(SlotButtonsActions), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var slot = _step3.value;

                var slotsHTML = this.getSlotItemHTML(slot);
                this.dom.slotsInventoryContainer.innerHTML = this.dom.slotsInventoryContainer.innerHTML + slotsHTML;
                var div = domElemById('ui-pickup-icon-container-' + slot);
                this.dom.slotButtons.push({
                    slot: slot,
                    div: div
                });

                var itemAction = addItemAction('use', 'selectedSlot', slot, div);
                this.addEventListeners(itemAction);
                this.updateSlotPickUpBind(slot);
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
    },
    createEffectsContainer: function createEffectsContainer() {

        var len = StatusEffects.length;

        var effectsContainer = $('#ui-status-effects');

        effectsContainer.html('');
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = (0, _getIterator3.default)(StatusEffects), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var effect = _step4.value;

                if (effect.visibleInHud) {

                    var html = '\n                <div id=\'ui-status-' + effect.id + '\' class="ui-status-effect">\n                    <div id=\'ui-status-icon-' + effect.id + '\' class=\'ui-status-icon\'>\n                    </div>\n                    <div id=\'ui-status-effect-cooldown-' + effect.id + '\' class=\'ui-status-effect-cooldown\'>\n                        \n                        <div id=\'ui-cooldown-visual\' class=\'ui-cooldown-visual\'></div>\n                        <div id=\'ui-cooldown-counter\'\n                            class=\'ui-cooldown-counter ui-mid-container-icons-counter font-outline-black\'></div>\n                    </div>\n                </div>';

                    effectsContainer.append(html);

                    var div = domElemById('ui-status-icon-' + effect.id);
                    //div.style.display = 'none';


                    var imagePath = 'img/gui/status_effects/' + effect.icon;

                    div.style.backgroundImage = 'url("' + imagePath + '")';
                    // div.style.display = 'none';
                }
            }
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
    },
    updateEffectsContainer: function updateEffectsContainer(player) {
        var len = StatusEffects.length;
        var effectDisableHud = false;
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
            for (var _iterator5 = (0, _getIterator3.default)(StatusEffects), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var effect = _step5.value;

                var effectApplied = effect.name in player.m_localData && player.m_localData[effect.name] > 0 && player.m_netData.effects.includes(effect.id);
                if (effect.visibleInHud) {
                    var div = domElemById('ui-status-' + effect.id);
                    if (effectApplied) {
                        var effectData = StatusEffect.getEffectData(effect.id);

                        this.setCooldown(activityType.effect, effectData.time || effectData.duration, player.m_localData[effect.name], effect.id);
                        div.style.display = "block";
                    } else {
                        div.style.display = "none";
                    }
                }

                if (effectApplied && effect.disableHUD) {
                    effectDisableHud = true;
                }
            }
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

        return effectDisableHud;

        /* for (let i = 0; i < this.dom.slotButtons.length; i++) {
           //const slot = SlotButtonsActions[i];
           const slotButton = this.dom.slotButtons[i];
           const slotContainer = domElemById(`ui-pickup-${slotButton.slot}`);
            if (this.slotsInventory && this.slotsInventory[i]) {
               
               if (effectDisableHud) {
                   slotContainer.classList.add(`ui-item-overlay`);
               } else {
                   slotContainer.classList.remove(`ui-item-overlay`);
               }
            } else {
               slotContainer.classList.remove(`ui-item-overlay`);
           }
        } */
    },


    updateSlotItem: function updateSlotItem(slot, key) {
        var imagePath = helpers.getSvgFromGameType(slot.item);
        var total = slot.total;
        this.setIcon(activityType.slots, imagePath, key);
        var div = domElemById('ui-pickup-counter-' + key);
        div.innerHTML = slot.total;

        if (total === 0) {
            div.innerHTML = '';
        }
    },

    /**
     * Update html content related with backpack slots
     * @param {Array} slotsContent Backpack slots content
     */
    updateSlotItems: function updateSlotItems(slots) {

        for (var i = 0; i < this.dom.slotButtons.length; i++) {
            //const slot = SlotButtonsActions[i];
            var slotButton = this.dom.slotButtons[i];
            var slotContainer = domElemById('ui-pickup-' + slotButton.slot);

            if (slots && slots[i]) {
                slotContainer.style.display = 'block';
                this.updateSlotItem(slots[i], slotButton.slot);
                slotContainer.setAttribute('data-id', slots[i].item);
            } else {
                slotContainer.setAttribute('data-id', "");
                slotContainer.style.display = 'none';
            }
        }
    },

    /**
     * Update html content related with backpack slots
     * @param {Array} slotsContent Backpack slots content
     */
    updateSlotItemTemp: function updateSlotItemTemp(slotId) {
        var slotContainer = domElemById('ui-pickup-' + slotId);
        // slotContainer.style.display = 'none';
        this.setIcon(activityType.slots, "", slotId);
        var div = domElemById('ui-pickup-counter-' + slotId);
        div.innerHTML = '';
    },

    /**
     * Update html content related with icons
     * @param {int} activity Activity type number 
     * @param {string} imagePath Url related to the icon
     * @param {int} selector Optional param related with skill o slot position 
     */

    setIcon: function setIcon(activity, imagePath) {
        var selector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var skill1Name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        var div = null;
        //Select a specific div according to the activity param
        switch (activity) {
            case activityType.skill:
                div = !device.mobile ? domElemById('ui-skill-icon-' + selector) : domElemById('ui-skill-icon-mobile-' + selector);
                div = div.getElementsByClassName('ui-mid-container-icons-inner')[0];
                imagePath = helpers.getSkillFromImgType(imagePath);
                this.updateMiniMapSkillInfo(selector, skill1Name, imagePath);
                break;
            case activityType.offHand:
                div = domElemById('ui-light-attack-icon');
                imagePath = helpers.getSvgFromGameType(imagePath);
                break;
            case activityType.lightAttack:
                div = domElemById('ui-light-attack-icon');
                imagePath = helpers.getSkillFromImgType(imagePath);
                break;
            case activityType.activeItem:
                div = domElemById('ui-light-attack-icon');
                imagePath = helpers.getSvgFromGameType(imagePath);
                break;
            case activityType.slots:
                div = domElemById('ui-pickup-icon-' + selector);
                if (imagePath) div.setAttribute('data', true);else div.setAttribute('data', false);
                break;
        }
        //Set image
        div.style.backgroundImage = 'url("' + imagePath + '")';
    },

    /**
     * Update mini map skill icon, name and description
     * @param {int} selector  Param related with skill o slot position 
     * @param {string} imagePath Url related to the icon
     * @param {string} name Skill name
     */

    updateMiniMapSkillInfo: function updateMiniMapSkillInfo(selector, name, imagePath) {

        var skillContainer = domElemById('ui-skill-' + selector);
        var mapInfoDiv = domElemById('ui-map-info-skill-' + selector);
        if (name) {
            skillContainer.style.display = 'block';
            mapInfoDiv.style.display = 'block';

            var mapInfoSkillIcon = domElemById('ui-map-info-skill-' + selector + '-icon');
            mapInfoSkillIcon.style.backgroundImage = 'url("' + imagePath + '")';

            var skillDivName = domElemById('ui-map-info-name-skill-' + selector);
            var skillDivDescription = domElemById('ui-map-info-desc-skill-' + selector);

            var id = name.toLowerCase().replace(/\s/g, "");
            var skillName = this.localization.translate('game-hud-' + id);
            var skillDesc = this.localization.translate('game-hud-' + id + '-description');

            skillDivName.innerHTML = skillName;
            skillDivDescription.innerHTML = skillDesc;

            skillContainer.setAttribute('data-id', id);
        } else {
            skillContainer.style.display = 'none';
            mapInfoDiv.style.display = 'none';
        }
    },

    getBackgroundCircle: function getBackgroundCircle(percCompleted) {
        var stepSize = 360 / 100;
        var increment = void 0;
        var background = "";

        if (percCompleted >= 50) {
            var newVal = percCompleted - 50;
            increment = -90 + stepSize * newVal;
            background = 'linear-gradient(' + increment + 'deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(270deg, #ebebeb 50%, transparent 50%, transparent)';
        } else {
            //linear-gradient(90deg, #ebebeb 50%, transparent 50%, transparent), linear-gradient(' + increment +'deg, #66b8ff 50%, #ebebeb 50%, #ebebeb)
            increment = 90 + stepSize * percCompleted;

            background = 'linear-gradient(90deg, transparent 50%, transparent 50%, transparent), linear-gradient(' + increment + 'deg, #ebebeb 50%, transparent 50%, transparent)';
        }
        return background;
        // $('.progress-circle.progress-1 span').text(value);
    },

    /**
     * Update html content related with cooldowns graphics
     * @param {int} activity Activity type number
     * @param {int} totalCooldown Total cooldown time 
     * @param {int} currentTime Cooldown updated every dt
     * @param {int} skillNumber Optional param related with the selected id
     */
    setCooldown: function setCooldown(activity, totalCooldown, currentTime) {
        var skillNumber = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

        var div = null;
        var circular = false;
        var percentaje = null;
        //Select a specific div according to the activity param
        switch (activity) {
            case activityType.skill:
                circular = true;
                div = !device.mobile ? domElemById('ui-skill-' + skillNumber) : $('#ui-skill-mobile-' + skillNumber);
                break;
            case activityType.dash:
                div = domElemById('ui-dash');
                break;
            case activityType.offHand:
                div = !device.mobile ? domElemById('ui-off-hand-cooldown') : $('#ui-off-hand-mobile-cooldown');
                break;
            case activityType.heavyAttack:
                circular = true;
                div = domElemById('ui-heavy-attack-cooldown');
                break;
            case activityType.lightAttack:
                circular = true;
                div = domElemById('ui-heavy-attack-cooldown');
                break;
            case activityType.effect:
                circular = false;
                percentaje = currentTime;
                div = domElemById('ui-status-' + skillNumber);
                break;
        }
        //Select div that corresponds to a visual and counter of the cooldown
        if (!device.mobile) {
            var x = {};

            var width = percentaje || (currentTime / totalCooldown * 100).toFixed(2);

            if (percentaje) {
                currentTime = currentTime * totalCooldown / 100;
            }

            if (circular) {
                x = {
                    visual: div.getElementsByClassName('progress-circle')[0],
                    counter: div.getElementsByClassName('ui-cooldown-counter')[0]
                };

                var percCompleted = parseFloat(currentTime.toFixed(2)) * 100 / totalCooldown;

                if (percCompleted >= 50) {
                    x.visual.style.clipPath = "inset(0px 0px 0px 0px)";
                } else {

                    x.visual.style.clipPath = "inset(0px 0px 0px 50%)";
                }

                var backgroundCircle = this.getBackgroundCircle(percCompleted);
                x.visual.style.backgroundImage = backgroundCircle;
            } else {
                x = {
                    visual: div.getElementsByClassName('ui-cooldown-visual')[0],
                    counter: div.getElementsByClassName('ui-cooldown-counter')[0]
                };
                //Set the width to the html content
                x.visual.style.width = width + "%";
            }

            // Set the current width according to the times 

            //Set the current cooldown time, if the current time is close to 0 hide the counter
            if (currentTime > 0.0) {
                x.counter.innerHTML = currentTime.toFixed(1);
                x.visual.style.display = "block";
            } else {
                x.counter.innerHTML = "";
                x.visual.style.display = "none";

                if (!circular) {
                    x.visual.style.width = "100%";
                }
            }

            //x.counter.style.color= "black";
            //Temporal content
            /* if(width<45){
                x.counter.style.color= "violet";
            }else{
                x.counter.style.color= "black";
            } */
        } else {
            switch (activity) {
                case activityType.skill:
                    if (!this.mobileCooldownStart) {
                        this.mobileSkillCooldown.start(div, currentTime, totalCooldown);
                        this.mobileCooldownStart = true;
                    }
                    this.mobileSkillCooldown.update(currentTime, this.camera);
                    if (!(currentTime > 0.0)) {
                        this.mobileSkillCooldown.stop();
                        this.mobileSkillCooldown.update(currentTime, this.camera);
                        this.mobileCooldownStart = false;
                    }
                    break;
                case activityType.offHand:
                    if (!this.mobileCooldownStart) {
                        this.mobileSkillCooldown.start(div, currentTime, totalCooldown);
                        this.mobileCooldownStart = true;
                    }
                    this.mobileSkillCooldown.update(currentTime, this.camera);
                    if (!(currentTime > 0.0)) {
                        this.mobileSkillCooldown.stop();
                        this.mobileSkillCooldown.update(currentTime, this.camera);
                        this.mobileCooldownStart = false;
                    }
                    break;
                default:
                    break;
            }
        }
    },

    setPlayerStats: function setPlayerStats(powerStat, speedStat, vitalityStat) {
        var div = domElemById('ui-level-stats-container');
        var x = {
            powerStat: div.getElementsByClassName('powerStat')[0],
            speedStat: div.getElementsByClassName('speedStat')[0],
            vitalityStat: div.getElementsByClassName('vitalityStat')[0]
        };

        x.powerStat.innerHTML = powerStat;
        x.speedStat.innerHTML = speedStat;
        x.vitalityStat.innerHTML = vitalityStat;
    },

    addRareLootMessage: function addRareLootMessage(lootType, clearQueue) {
        if (clearQueue) {
            this.newState.rareLootMessage.ticker = this.newState.rareLootMessage.duration;
            this.rareLootMessageQueue = [];
        }
        this.rareLootMessageQueue.push(lootType);
    },

    removeRareLootMessage: function removeRareLootMessage(lootType) {
        var idx = this.rareLootMessageQueue.indexOf(lootType);
        if (idx >= 0) {
            this.rareLootMessageQueue.splice(idx, 1);
        }
        if (this.newState.rareLootMessage.lootType == lootType) {
            this.newState.rareLootMessage.ticker = this.newState.rareLootMessage.duration;
        }
    },

    getRareLootMessageText: function getRareLootMessageText(perk) {
        var perkDef = GameObjectDefs[perk];
        if (perkDef) {
            var perkName = this.localization.translate('game-' + perk);
            return 'Acquired perk: ' + perkName;
        }
        return '';
    },

    addKillFeedMessage: function addKillFeedMessage(text, color) {
        var killFeed = this.newState.killFeed;
        var oldest = killFeed[killFeed.length - 1];
        oldest.text = text;
        //oldest.color = color;
        oldest.ticker = 0.0;
        killFeed.sort(function (a, b) {
            return a.ticker - b.ticker;
        });
    },

    getKillFeedText: function getKillFeedText(targetName, killerName, sourceType, damageType, downed) {

        switch (damageType) {
            case DamageType.Player:
                {
                    var killTxt = this.localization.translate(downed ? 'game-knocked-out' : 'game-killed');
                    var withTxt = this.localization.translate('game-with');
                    var damageName = this.localization.translate('game-' + sourceType);
                    return killerName + ' ' + killTxt + ' ' + targetName + ' ' + withTxt + ' ' + damageName;
                }
            case DamageType.Bleeding:
                {
                    var _killTxt = this.localization.translate(killerName ? 'game-finally-killed' : 'game-finally-bled-out');
                    return killerName ? killerName + ' ' + _killTxt + ' ' + targetName : targetName + ' ' + _killTxt;
                }
            case DamageType.Gas:
                {
                    var killName = void 0;
                    var _killTxt2 = void 0;
                    if (downed) {
                        killName = this.localization.translate('game-the-red-zone');
                        _killTxt2 = this.localization.translate('game-knocked-out');
                    } else {
                        _killTxt2 = this.localization.translate(killerName ? 'game-finally-killed' : 'game-died-outside');
                    }
                    return killName ? killName + ' ' + _killTxt2 + ' ' + targetName : targetName + ' ' + _killTxt2;
                }
            case DamageType.Airdrop:
                {
                    var mapObj = MapObjectDefs[sourceType];
                    var _killName = this.localization.translate('game-the-air-drop');
                    var _killTxt3 = void 0;
                    if (downed) {
                        _killTxt3 = this.localization.translate('game-knocked-out');
                    } else if (mapObj && !mapObj.airdropCrate) {
                        _killTxt3 = this.localization.translate('game-killed');
                    } else {
                        _killTxt3 = this.localization.translate('game-crushed');
                    }
                    return _killName + ' ' + _killTxt3 + ' ' + targetName;
                }
            case DamageType.Airstrike:
                {
                    var _killTxt4 = this.localization.translate(downed ? 'game-knocked-out' : 'game-killed');
                    if (killerName) {
                        var _withTxt = this.localization.translate('game-with');
                        var airstrikeTxt = this.localization.translate('game-an-air-strike');
                        return killerName + ' ' + _killTxt4 + ' ' + targetName + ' ' + _withTxt + ' ' + airstrikeTxt;
                    } else {
                        var _airstrikeTxt = this.localization.translate('game-the-air-strike');
                        return _airstrikeTxt + ' ' + _killTxt4 + ' ' + targetName;
                    }
                }
            case DamageType.Weather:
                {
                    var _killTxt5 = this.localization.translate(downed ? 'game-knocked-out' : 'game-killed');
                    var _damageName = this.localization.translate('game-weather');
                    return ' ' + _damageName + ' ' + _killTxt5 + ' ' + targetName;
                }
            case DamageType.Npc:
                {
                    var _killTxt6 = this.localization.translate(downed ? 'game-knocked-out' : 'game-killed');
                    var _damageName2 = this.localization.translate('game-' + sourceType);
                    return ' ' + _damageName2 + ' ' + _killTxt6 + ' ' + targetName;
                }
            case DamageType.Burning:
                {
                    var _killTxt7 = this.localization.translate(downed ? 'game-knocked-out' : 'game-killed');
                    var _damageName3 = this.localization.translate('game-burning');
                    return ' ' + _damageName3 + ' ' + _killTxt7 + ' ' + targetName;
                }
            case DamageType.Phoenix:
                {
                    var _killTxt8 = this.localization.translate(downed ? 'game-knocked-out' : 'game-killed');
                    var _damageName4 = this.localization.translate('game-phoenix');
                    return ' ' + _damageName4 + ' ' + _killTxt8 + ' ' + targetName;
                }
            default:
                return '';
        }
    },

    /**
     * Update Text Skill Keys
     */
    updateSkillBinds: function updateSkillBinds() {
        var totalSize = Skills.count;
        for (var i = 1; i <= totalSize; i++) {
            var skill = domElemById('ui-skill-key-' + i);
            var interactionkey = this.getSkillKey(i);
            skill.innerHTML = interactionkey;
        }
    },

    /**
     * Update Text Emote Keys
     */
    updateEmoteBind: function updateEmoteBind() {
        var bind = null;
        var emote = domElemById('ui-emote-key');
        bind = this.inputBinds.getBind(GameInput.EmoteMenu);
        emote.innerHTML = bind ? bind.toString() : '<Unbound>';
    },

    /**
     * Update Text Pick up slots Keys
     */
    updateSlotPickUpBind: function updateSlotPickUpBind(slot) {
        var skill = domElemById('ui-pickup-key-' + slot);
        var interactionkey = this.getPickUpKey(slot);
        skill.innerHTML = interactionkey;
    },

    updateSlotPickUpBinds: function updateSlotPickUpBinds() {
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = (0, _getIterator3.default)(SlotButtonsActions), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var slot = _step6.value;

                this.updateSlotPickUpBind(slot);
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
    },

    getKillFeedColor: function getKillFeedColor(activeTeamId, targetTeamId, killerTeamId, factionMode) {
        if (factionMode) {
            return '#efeeee';
        } else {
            return activeTeamId == targetTeamId ? '#d1777c' : activeTeamId == killerTeamId ? '#00bfff' : '#efeeee';
        }
    },

    getRoleKillFeedColor: function getRoleKillFeedColor(role, teamId, playerBarn) {
        var roleDef = GameObjectDefs[role];
        return roleDef && roleDef.killFeed && roleDef.killFeed.color ? roleDef.killFeed.color : helpers.colorToHexString(playerBarn.getTeamColor(teamId));
    },

    getRoleTranslation: function getRoleTranslation(role, teamId) {
        var roleTxt = 'game-' + role;
        if (role == 'leader') {
            roleTxt = teamId == 1 ? 'game-red-leader' : 'game-blue-leader';
        }
        return this.localization.translate(roleTxt);
    },

    getRoleAnnouncementText: function getRoleAnnouncementText(role, teamId) {
        var promotedTxt = this.localization.translate('game-youve-been-promoted-to');
        var roleTxt = this.getRoleTranslation(role, teamId);
        return promotedTxt + ' ' + roleTxt + '!';
    },

    getRoleAssignedKillFeedText: function getRoleAssignedKillFeedText(role, teamId, playerName) {
        var roleTxt = this.getRoleTranslation(role, teamId);
        var promotionTxt = this.localization.translate('game-promoted-to');
        return playerName + ' ' + promotionTxt + ' ' + roleTxt + '!';
    },

    getRoleKilledKillFeedText: function getRoleKilledKillFeedText(role, teamId, killerName) {
        var roleTxt = this.getRoleTranslation(role, teamId);
        if (killerName) {
            var killTxt = this.localization.translate('game-killed');
            return killerName + ' ' + killTxt + ' ' + roleTxt + '!';
        } else {
            var _killTxt9 = this.localization.translate('game-is-dead');
            return roleTxt + ' ' + _killTxt9 + '!';
        }
    },

    getKillText: function getKillText(killerName, targetName, completeKill, downed, killed, suicide, sourceType, damageType, spectating) {
        var knockedOut = downed && !killed;
        var youTxt = spectating ? killerName : this.localization.translate('game-you').toUpperCase();
        var killKey = knockedOut ? 'game-knocked-out' : completeKill ? 'game-killed' : 'game-finally-killed';
        var killTxt = this.localization.translate(killKey);
        var targetTxt = suicide ? spectating ? this.localization.translate('game-themselves') : this.localization.translate('game-yourself').toUpperCase() : targetName;
        var damageTxt = this.localization.translate(damageType == GameConfig.DamageType.Airstrike ? 'game-an-air-strike' : 'game-' + sourceType);
        var withTxt = this.localization.translate('game-with');
        if (damageTxt && (completeKill || knockedOut)) {
            return youTxt + ' ' + killTxt + ' ' + targetTxt + ' ' + withTxt + ' ' + damageTxt;
        } else {
            return youTxt + ' ' + killTxt + ' ' + targetTxt;
        }
    },

    getKillCountText: function getKillCountText(killCount) {
        var killTxt = this.localization.translate(killCount != 1 ? 'game-kills' : 'game-kill');
        return killCount + ' ' + killTxt;
    },

    getDownedText: function getDownedText(killerName, targetName, sourceType, damageType, spectating) {
        var youTxt = spectating ? targetName : this.localization.translate('game-you').toUpperCase();
        var killerTxt = killerName;
        if (!killerTxt) {
            if (damageType == GameConfig.DamageType.Gas) {
                killerTxt = this.localization.translate('game-the-red-zone');
            } else if (damageType == GameConfig.DamageType.Airdrop) {
                killerTxt = this.localization.translate('game-the-air-drop');
            } else if (damageType == GameConfig.DamageType.Airstrike) {
                killerTxt = this.localization.translate('game-the-air-strike');
            }
        }
        var damageTxt = this.localization.translate('game-' + sourceType);
        if (killerName && damageType == GameConfig.DamageType.Airstrike) {
            damageTxt = this.localization.translate('game-an-air-strike');
        }
        var withTxt = this.localization.translate('game-with');
        if (damageTxt) {
            return killerTxt + ' knocked ' + youTxt + ' out ' + withTxt + ' ' + damageTxt;
        } else {
            return killerTxt + ' knocked ' + youTxt + ' out';
        }
    },

    getPickupMessageText: function getPickupMessageText(type) {
        var _kTypeMap;

        var kTypeMap = (_kTypeMap = {}, (0, _defineProperty3.default)(_kTypeMap, PickupMsgType.Full, 'game-not-enough-space'), (0, _defineProperty3.default)(_kTypeMap, PickupMsgType.AlreadyOwned, 'game-item-already-owned'), (0, _defineProperty3.default)(_kTypeMap, PickupMsgType.AlreadyEquipped, 'game-item-already-equipped'), (0, _defineProperty3.default)(_kTypeMap, PickupMsgType.BetterItemEquipped, 'game-better-item-equipped'), (0, _defineProperty3.default)(_kTypeMap, PickupMsgType.GunCannotFire, 'game-gun-cannot-fire'), _kTypeMap);
        var key = kTypeMap[type] || kTypeMap[PickupMsgType.Full];
        return this.localization.translate(key);
    },

    getInteractionText: function getInteractionText(type, object, player) {
        switch (type) {
            case InteractionType.None:
                return '';
            case InteractionType.Cancel:
                return this.localization.translate('game-cancel');
            case InteractionType.Revive:
                if (object && player && object == player && player.hasPerk('self_revive')) {
                    return this.localization.translate('game-revive-self');
                } else {
                    return this.localization.translate('game-revive-teammate');
                }
            case InteractionType.Object:
                {
                    var x = object.getInteraction();
                    var actTxt = this.localization.translate(x.action);
                    var objTxt = this.localization.translate(x.object);
                    return actTxt + ' ' + objTxt;
                }
            case InteractionType.Loot:
                {
                    var txt = this.localization.translate('game-' + object.type) || object.type;
                    if (object.count > 1) {
                        txt += ' (x' + object.count + ')';
                    }
                    return txt;
                }
            default:
                return '';
        }
    },

    getLevelTxt: function getLevelTxt(txt, level) {

        var includeExpresion = txt.includes('{');
        if (includeExpresion) {
            var endIndex = txt.search('{');
            while (endIndex != -1) {
                var startIndex = 0;
                var txtcopy = txt.slice(startIndex, endIndex);
                var endIndexSearch = txt.search('}');
                startIndex = endIndexSearch + 1;
                txt = txtcopy + level + txt.slice(startIndex);
                endIndex = txt.search('{');
            }
        }

        return txt;
    },

    getInteractionEffect: function getInteractionEffect(type, object) {
        if (type == InteractionType.Loot) {
            var color = "#D7D7D7";
            var weaponDef = GameObjectDefs[object.type];
            var txt = this.localization.translate('game-' + object.type + '-effects');
            var includeExpresion = txt.includes('{');
            if (includeExpresion) {
                var endIndex = txt.search('{');

                var _loop2 = function _loop2() {
                    var startIndex = 0;
                    var txtcopy = txt.slice(startIndex, endIndex);
                    var endIndexSearch = txt.search('}');
                    startIndex = endIndexSearch + 1;
                    var searchword = txt.slice(endIndex + 1, endIndexSearch);
                    var defValue = weaponDef[searchword];
                    if (searchword === "boost") {
                        defValue = defValue * 100;
                    } else if (!defValue) {

                        var effect = StatusEffects.find(function (o) {
                            return o.name === searchword;
                        });
                        defValue = "<img src=img/gui/status_effects/" + effect.icon + " ></img>";
                        color = effect.color || color;
                    }
                    txt = txtcopy + defValue + txt.slice(startIndex);
                    endIndex = txt.search('{');
                };

                while (endIndex != -1) {
                    _loop2();
                }
            }

            var effectData = {
                textColor: color,
                txt: txt
            };
            return effectData;
        }
        return '';
    },

    getInteractionStat: function getInteractionStat(type, object) {
        if (type == InteractionType.Loot) {
            var weaponDef = GameObjectDefs[object.type];
            var txt = this.localization.translate('game-' + object.type + '-stats');
            var includeExpresion = txt.includes('{');
            if (includeExpresion) {
                var endIndex = txt.search('{');
                while (endIndex != -1) {
                    var startIndex = 0;
                    var txtcopy = txt.slice(startIndex, endIndex);
                    var endIndexSearch = txt.search('}');
                    startIndex = endIndexSearch + 1;
                    var _searchword = txt.slice(endIndex + 1, endIndexSearch);
                    var _defValue = weaponDef[_searchword];
                    if (weaponDef.type === "throwable") {
                        var bulletDef = GameObjectDefs[weaponDef.bulletType ? weaponDef.bulletType : weaponDef.explosionType];
                        _defValue = bulletDef[_searchword];
                    }
                    txt = txtcopy + _defValue + txt.slice(startIndex);
                    endIndex = txt.search('{');
                }
            }
            return txt;
        }
        return '';
    },

    getInteractionWeaponType: function getInteractionWeaponType(type, object) {
        if (type == InteractionType.Loot) {
            var weaponDef = GameObjectDefs[object.type];
            var txt = this.localization.translate('game-' + object.type + '-type');
            var includeExpresion = txt.includes('{');
            if (includeExpresion) {
                var endIndex = txt.search('{');
                while (endIndex != -1) {
                    var startIndex = 0;
                    var txtcopy = txt.slice(startIndex, endIndex);
                    var endIndexSearch = txt.search('}');
                    startIndex = endIndexSearch + 1;
                    var _searchword2 = txt.slice(endIndex + 1, endIndexSearch);
                    var _defValue2 = weaponDef[_searchword2];
                    /* if(weaponDef.type==="throwable"){
                        let bulletDef = GameObjectDefs[weaponDef.bulletType ? weaponDef.bulletType:weaponDef.explosionType];
                        defValue = bulletDef[searchword];
                    } */
                    txt = txtcopy + _defValue2 + txt.slice(startIndex);
                    endIndex = txt.search('{');
                }
            }
            return txt;
        }
        return '';
    },

    getInteractionDamageType: function getInteractionDamageType(type, object) {
        if (type == InteractionType.Loot) {
            var weaponDef = GameObjectDefs[object.type];
            var txt = this.localization.translate('game-' + object.type + '-damage-type');
            var includeExpresion = txt.includes('{');
            if (includeExpresion) {
                var endIndex = txt.search('{');
                while (endIndex != -1) {
                    var startIndex = 0;
                    var txtcopy = txt.slice(startIndex, endIndex);
                    var endIndexSearch = txt.search('}');
                    startIndex = endIndexSearch + 1;
                    var _searchword3 = txt.slice(endIndex + 1, endIndexSearch);
                    var _defValue3 = weaponDef[_searchword3];
                    /* if(weaponDef.type==="throwable"){
                        let bulletDef = GameObjectDefs[weaponDef.bulletType ? weaponDef.bulletType:weaponDef.explosionType];
                        defValue = bulletDef[searchword];
                    } */
                    txt = txtcopy + _defValue3 + txt.slice(startIndex);
                    endIndex = txt.search('{');
                }
            }
            return txt;
        }
        return '';
    },

    getInteractionRarity: function getInteractionRarity(type, object) {
        var rarityData = {
            rarityText: '',
            rarityClass: ''
        };
        if (type == InteractionType.Loot) {
            var weaponDef = GameObjectDefs[object.type];

            if (weaponDef.type === 'gun' || weaponDef.type === 'melee') {
                var txt = this.localization.translate('game-rarity-' + weaponDef.rarity);
                var includeExpresion = txt.includes('{');
                if (includeExpresion) {
                    var endIndex = txt.search('{');
                    while (endIndex != -1) {
                        var startIndex = 0;
                        var txtcopy = txt.slice(startIndex, endIndex);
                        var endIndexSearch = txt.search('}');
                        startIndex = endIndexSearch + 1;
                        var _searchword4 = txt.slice(endIndex + 1, endIndexSearch);
                        var _defValue4 = weaponDef[_searchword4];
                        /* if(weaponDef.type==="throwable"){
                            let bulletDef = GameObjectDefs[weaponDef.bulletType ? weaponDef.bulletType:weaponDef.explosionType];
                            defValue = bulletDef[searchword];
                        } */
                        txt = txtcopy + _defValue4 + txt.slice(startIndex);
                        endIndex = txt.search('{');
                    }
                }
                rarityData.rarityText = txt;
                rarityData.rarityClass = weaponDef.rarity;
                return rarityData;
            }
        }
        return '';
    },

    isFullInventory: function isFullInventory(type, loot) {
        if (type == InteractionType.Loot) {
            var weaponDef = GameObjectDefs[loot.type];

            if (!weaponDef.offHand && (weaponDef.type === 'gun' || weaponDef.type === 'melee')) {
                return false;
            } else {

                //Set current slot variable 
                var isFull = true;

                for (var key in this.slotsInventory) {
                    var slot = this.slotsInventory[key];

                    if (slot['item'] == loot.type) {
                        if (!(slot['total'] >= this.getSlotSize(loot.type))) {
                            isFull = false;
                        }
                    } else if (slot['item'] == '') {
                        isFull = false;
                    }
                }

                return isFull;
            }
        }
        return false;
    },

    getSlotSize: function getSlotSize(item) {
        return GameObjectDefs[item].slotMax || 1;
    },


    getInteractionKey: function getInteractionKey(type) {
        var bind = null;

        switch (type) {
            case InteractionType.Cancel:
                bind = this.inputBinds.getBind(GameInput.Cancel);
                break;
            case InteractionType.Loot:
                bind = this.inputBinds.getBind(GameInput.Loot) || this.inputBinds.getBind(GameInput.Interact);
                break;
            case InteractionType.Object:
                bind = this.inputBinds.getBind(GameInput.Use) || this.inputBinds.getBind(GameInput.Interact);
                break;
            case InteractionType.Revive:
                bind = this.inputBinds.getBind(GameInput.Revive) || this.inputBinds.getBind(GameInput.Interact);
                break;
            case InteractionType.None: // Fall-through
            default:
                bind = this.inputBinds.getBind(GameInput.Use);
                break;
        }
        return bind ? bind.toString() : '<Unbound>';
    },

    getWeaponDefinitionBaseDamage: function getWeaponDefinitionBaseDamage(type, object) {
        if (type == InteractionType.Loot) {
            return GameObjectDefs[object.type].baseDamage;
        }
        return null;
    },

    /**
     * Get the current text of skils key bindings
     * @param {number} skill Skill ID to get text
     * @returns {string} Will return a string with the key binding text if exist
     */
    getSkillKey: function getSkillKey(skill) {
        var bind = null;

        switch (skill) {
            case Skills.Skill_1:
                bind = this.inputBinds.getBind(GameInput.Skill_1);
                break;
            case Skills.Skill_2:
                bind = this.inputBinds.getBind(GameInput.Skill_2);
                break;
            case Skills.Skill_3:
                bind = this.inputBinds.getBind(GameInput.Skill_3);
                break;
            case Skills.Dash:
                bind = this.inputBinds.getBind(GameInput.Dash);
                break;
        }
        return bind ? bind.toString() : '<Unbound>';
    },

    /**
     * Get the current text of slots key bindings
     * @param {number} slot Slot ID to get text 
     * @returns {string} Will return a string with the key binding text if exist 
     */
    getPickUpKey: function getPickUpKey(slot) {
        var inputBind = SlotsInputBindings[slot];
        var bind = inputBind ? this.inputBinds.getBind(inputBind) : null;
        return bind ? bind.toString() : '<Unbound>';
    }
};

function loadStaticDomImages() {
    // Fetch dom images here instead of index.html to speed up page responsiveness
    var setLootImage = function setLootImage(id, img) {
        var elem = domElemById(id);
        elem.getElementsByClassName('ui-loot-image')[0].src = img;
    };

    /*setLootImage('ui-loot-bandage', 'img/loot/loot-medical-bandage.svg');
    setLootImage('ui-loot-healthkit', 'img/loot/loot-medical-healthkit.svg');
    setLootImage('ui-loot-soda', 'img/loot/loot-medical-soda.svg');
    setLootImage('ui-loot-chocolateBox', 'img/loot/loot-medical-chocolateBox.svg');
    setLootImage('ui-loot-bottle', 'img/loot/loot-luck-bottle.svg');
    setLootImage('ui-loot-flask', 'img/loot/loot-medical-flask-01.svg');
    setLootImage('ui-loot-painkiller', 'img/loot/loot-medical-pill.svg');
    setLootImage('ui-loot-9mm', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-12gauge', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-762mm', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-556mm', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-50AE', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-308sub', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-flare', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-45acp', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-loot-40mm', 'img/loot/loot-ammo-box.svg');
    setLootImage('ui-luck-actual', 'img/rainbow_charge.png');
    setLootImage('ui-wet', 'img/wet_status.png');
    setLootImage('ui-contact', 'img/contact_status.png');
    //setLootImage('ui-burning', 'img/burning_status.png');
    setLootImage('ui-loot-gunchilada', 'img/loot/loot-gunchilada.svg');
    setLootImage('ui-loot-pulseBox', 'img/loot/loot-pulseBox.svg');
    setLootImage('ui-loot-watermelon', 'img/loot/loot-watermelon.svg');
    setLootImage('ui-loot-nitroLace', 'img/loot/loot-nitroLace.svg');
     domElemById('mag-glass-white').src = 'img/gui/mag-glass.svg';
    domElemById('ui-minimize-img').src = 'img/gui/minimize.svg';*/
}

module.exports = {
    m_Ui2Manager: m_Ui2Manager,
    loadStaticDomImages: loadStaticDomImages
};
