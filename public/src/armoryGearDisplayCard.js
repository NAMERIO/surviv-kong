"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require("./998a712f.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require("./ed9971da.js");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var _require = require("./35dbdceb.js"),
    getGearItems = _require.getGearItems,
    getPerkText = _require.getPerkText,
    getUniqueGearPerks = _require.getUniqueGearPerks,
    getRecycleValue = _require.getRecycleValue;
// @ts-ignore


var GearDefs = require("./gearDefs.js");
var PlayerCanvas = require("./playerCanvas.js");
var EquippedGearCardItem = require("./equippedGearCardItem.js");
var ModalRecycle = require("./modalRecycle.js");

var ArmoryGearDisplayCard = function () {
    /**
     * 
     * @param {import('./../localization')} localization
     * @param {import('./../account')} account
     * @param {any} spineData
     * @param {HTMLElement} parent
     * @param {import('./../loadout-menu')} loadoutMenu
     */
    function ArmoryGearDisplayCard(localization, account, spineData, parent, loadoutMenu) {
        (0, _classCallCheck3.default)(this, ArmoryGearDisplayCard);

        this.spineData = spineData;
        this.account = account;
        this.localization = localization;
        /** @type {{userItem?: any, definition?: any }} */
        this.gear = null;
        /** @type{HTMLButtonElement} */
        this.selectedTabButton = null;
        this.loadoutMenu = loadoutMenu;
        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#armory_gear_card');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type{HTMLElement} */node.querySelector('.loadout-armor-info-box');
        this.mount();
        parent.appendChild(node);
        this.account.addEventListener('loadout', this.updateEquippedItems.bind(this));
    }

    (0, _createClass3.default)(ArmoryGearDisplayCard, [{
        key: 'mount',
        value: function mount() {
            var _this = this;

            /** @type{HTMLDivElement} */
            this.gearDisplayPane = this.card.querySelector('#armory_gear_card-display_pane');
            /** @type{HTMLDivElement} */
            this.equippedGearPane = this.card.querySelector('#armory_gear_card-equipped_gear');
            /** @type{HTMLElement} */
            this.name = this.card.querySelector('#armory_gear_card-name');
            /** @type{HTMLElement} */
            this.rarityLabel = this.card.querySelector('#armory_gear_card-rarity');
            /** @type{HTMLElement} */
            this.notEquippedLabel = this.card.querySelector('#armory_gear_card-not_equipped');
            /** @type{HTMLImageElement} */
            this.img = this.card.querySelector('#armory_gear_card-img');
            /** @type{HTMLButtonElement} */
            this.statsButton = this.card.querySelector('#armory_gear_card-stats_btn');
            /** @type{HTMLButtonElement} */
            this.historyButton = this.card.querySelector('#armory_gear_card-history_btn');
            /** @type{HTMLButtonElement} */
            this.equippedGearButton = this.card.querySelector('#armory_gear_card-gear_btn');
            /** @type{HTMLButtonElement} */
            this.upgradeButton = this.card.querySelector('#armory_gear_card-upgrade_btn');
            /** @type{HTMLButtonElement} */
            this.recycleButton = this.card.querySelector('#armory_gear_card-recycle_btn');
            /* strip_from_prod_client:begin */
            //Unlock button left to test but removed on prod
            /** @type{HTMLButtonElement} */
            this.unlockButton = this.card.querySelector('#armory_gear_card-unlock_btn');
            this.unlockButtonClickCallback = function () {
                return _this.unlock();
            };
            this.unlockButton.addEventListener('click', this.unlockButtonClickCallback);
            /* strip_from_prod_client:end */
            this.shopButton = this.card.querySelector('#armory_gear_card-shop_btn');
            var canvas = this.card.querySelector('canvas');
            this.playerCanvas = new PlayerCanvas(canvas, this.account, this.spineData);
            this.statsButtonClickCallback = function () {
                return _this.showStats();
            };
            this.historyButtonClickCallback = function () {
                return _this.showHistory();
            };
            this.gearButtonClickCallback = function () {
                return _this.showEquippedGear();
            };
            this.upgradeButtonClickCallback = function () {
                return _this.upgrade();
            };
            this.recycleButtonClickCallback = function () {
                return _this.recycle();
            };
            this.statsButton.addEventListener('click', this.statsButtonClickCallback);
            this.historyButton.addEventListener('click', this.historyButtonClickCallback);
            this.equippedGearButton.addEventListener('click', this.gearButtonClickCallback);
            this.upgradeButton.addEventListener('click', this.upgradeButtonClickCallback);
            this.recycleButton.addEventListener('click', this.recycleButtonClickCallback);
            /** @type{HTMLSpanElement} */
            this.essenceLabel = this.card.querySelector('#armory_gear_card-upgrade_essence');
            /** @type{HTMLSpanElement} */
            this.recycleEssenceLabel = this.card.querySelector('#armory_gear_card-recycle_essence');
            /** @type{HTMLDivElement} */
            this.imgContainer = this.card.querySelector('.loadout-armor-info-pane-img-container');
            /** @type{HTMLDivElement} */
            this.upgradeBtnContainer = this.card.querySelector('#armory_gear_card-upgrade_btn_container');
            /** @type{HTMLDivElement} */
            var equipGearContainer = this.equippedGearPane.querySelector('.equipped-gear-container');
            this.equippedArmorItem = new EquippedGearCardItem('armor', this.localization, equipGearContainer);
            this.equippedRingItem = new EquippedGearCardItem('ring', this.localization, equipGearContainer);
            this.equippedHelmetItem = new EquippedGearCardItem('helmet', this.localization, equipGearContainer);
            /** @type{HTMLDivElement} */
            this.statsContainer = this.card.querySelector('.loadout-armor-info-pane');
            /** @type {Set<(item: ArmoryGearDisplayCard) => void>} */
            this.unlockSubscribers = new _set2.default();
            this.account.addEventListener('request', this.updateActionsButtons.bind(this));
        }
    }, {
        key: 'unlocked',
        value: function unlocked() {
            return !!this.gear && !!this.gear.userItem;
        }

        /**
         * 
         * @param {(item: ArmoryGearDisplayCard) => void} subs 
         */

    }, {
        key: 'onUnlock',
        value: function onUnlock(subs) {
            this.unlockSubscribers.add(subs);
        }
    }, {
        key: 'updateHistoryPane',
        value: function updateHistoryPane() {
            this.statsContainer.innerHTML = '<div class="font-edit h6 text-gray my-14"> COMING SOON</div>';
        }

        /**
         * @param {{ userItem?: any; definition?: any; } | undefined } gear
         */

    }, {
        key: 'updateStatsPaneInfo',
        value: function updateStatsPaneInfo(gear) {
            var _this2 = this;

            var unequipped = !gear;

            if (unequipped) {
                this.statsContainer.innerHTML = '<span class="not-equipped self-center justify-self-center font-edit text-gray uppercase py-12 m-auto text-center mx-12 h6 font-edit">' + this.localization.translate('click-gear-to-equip').replace('[gear]', this.localization.translate('gear-title-' + this.gearType)) + '</span>';
            } else {

                var getLockedLevelPerks = function getLockedLevelPerks(gear) {
                    var perks = [];
                    var levels = gear.definition.levels.filter(function (level) {
                        return gear.userItem && level.level > gear.userItem.level || !gear.userItem;
                    });

                    levels.forEach(function (level) {
                        perks = [].concat((0, _toConsumableArray3.default)(perks), (0, _toConsumableArray3.default)(level.perks));
                    });

                    return perks;
                };
                var unlockedPerks = gear.userItem ? getUniqueGearPerks(gear) : [];
                var lockedPerks = getLockedLevelPerks(gear);

                var getPerkItem = function getPerkItem(perk, unlocked) {
                    var icon = unlocked ? 'unlocked' : 'locked';
                    var textColor = unlocked ? 'text-gray' : 'text-gray-9';
                    return '\n                <span class="flex flex-row items-center mb-2">\n                    <img class="mr-2 h-6" src="img/gui/' + icon + '-gear-perk.svg">\n                    <span class="font-edit h8 ' + textColor + ' uppercase text-left">' + getPerkText(_this2.localization, perk) + '</span>\n                </span>';
                };
                var unlockedPerksItems = unlockedPerks.map(function (perk) {
                    return getPerkItem(perk, true);
                });
                var lockedPerksItems = lockedPerks.map(function (perk) {
                    return getPerkItem(perk, false);
                });
                var items = [].concat((0, _toConsumableArray3.default)(unlockedPerksItems), (0, _toConsumableArray3.default)(lockedPerksItems));
                this.statsContainer.innerHTML = items.join('');
            }
        }
    }, {
        key: 'updateActionsButtons',
        value: function updateActionsButtons() {
            this.updateActionButtons(this.gear);
        }

        /**
         * @param {{ userItem?: any; definition?: any }} gear
         */

    }, {
        key: 'updateActionButtons',
        value: function updateActionButtons(gear) {
            this.recycleButton.hidden = true;
            if (!gear) {
                this.upgradeBtnContainer.hidden = true;
                this.shopButton.hidden = true;
                /* strip_from_prod_client:begin */
                //Unlock button left to test but removed on prod
                this.unlockButton.hidden = true;
                /* strip_from_prod_client:end */
                return;
            }

            var unlocked = !!gear.userItem;
            this.upgradeBtnContainer.hidden = !unlocked;
            this.recycleButton.hidden = !unlocked;
            this.shopButton.hidden = unlocked;
            /* strip_from_prod_client:begin */
            //Unlock button left to test but removed on prod
            if (false) {}else this.unlockButton.hidden = true;
            /* strip_from_prod_client:end */

            if (gear.userItem) {
                var maxLevel = gear.userItem.level === gear.definition.levels.length;
                this.upgradeBtnContainer.hidden = maxLevel;

                if (!maxLevel) {
                    var requiredEssence = gear.definition.levels[gear.userItem.level].requiredEssence;
                    //this.upgradeButton.disabled = this.account.profile.totalEssence < requiredEssence;
                    this.essenceLabel.innerText = requiredEssence;
                }

                var recycleValue = getRecycleValue(gear.definition, gear.userItem);
                //@ts-ignore
                this.recycleEssenceLabel.innerText = recycleValue;
            }
        }

        /**
         * @param {{ userItem?: any; definition?: any;}}  gear
         * @param {string} gearType
         */

    }, {
        key: 'update',
        value: function update(gear, gearType) {
            this.gearType = gearType;
            var unequipped = !gear;
            this.rarityLabel.hidden = unequipped;
            this.imgContainer.classList.remove(this.imgContainer.dataset.border);
            this.equippedGearPane.classList.remove(this.imgContainer.dataset.border);
            this.rarityLabel.classList.remove(this.rarityLabel.dataset.bg);
            this.statsButton.classList.remove(this.statsButton.dataset.bg);
            this.historyButton.classList.remove(this.historyButton.dataset.bg);
            this.img.classList.remove(this.img.dataset.filter);

            if (this.gearType === 'armor' || this.gearType === 'helmet') {
                this.img.hidden = true;
                this.playerCanvas.show();
                this.playerCanvas.update(gear);
            } else {
                this.img.hidden = false;
                this.playerCanvas.hide();
            }

            this.gear = gear;

            var gearNameLabel = unequipped ? this.localization.translate('not-gear-equipped').replace('[gear]', this.localization.translate('gear-title-' + gearType)) : gear.definition.name;
            this.name.textContent = gearNameLabel;

            if (this.gear) {
                this.imgContainer.dataset.border = 'box-' + gear.definition.rarity;
                this.rarityLabel.dataset.bg = 'bg-' + gear.definition.rarity;
                this.statsButton.dataset.bg = 'bg-' + gear.definition.rarity;
                this.historyButton.dataset.bg = 'bg-' + gear.definition.rarity;
                this.rarityLabel.textContent = gear.definition.rarity;
                this.img.src = gear.definition.images.md;
            }

            if (unequipped) {
                this.img.dataset.filter = 'grayscale';
                this.imgContainer.dataset.border = 'border-gray-4';
                this.statsButton.dataset.bg = 'border-gray-4';
                this.historyButton.dataset.bg = 'border-gray-4';
                this.img.src = 'img/gui/gear_' + gearType + '_icon_md.png';
            }

            if (this.gear && this.gear.userItem) {
                this.img.dataset.filter = 'filter-none';
            }

            if (this.gear && !this.gear.userItem) {
                this.img.dataset.filter = 'grayscale';
                this.img.hidden = false;
                this.playerCanvas.hide();
            }
            this.img.classList.add(this.img.dataset.filter);
            this.imgContainer.classList.add(this.imgContainer.dataset.border);
            this.rarityLabel.classList.add(this.rarityLabel.dataset.bg);
            this.statsButton.classList.add(this.statsButton.dataset.bg);
            this.historyButton.classList.add(this.historyButton.dataset.bg);
            this.updateActionButtons(gear);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.statsButton.removeEventListener('click', this.statsButtonClickCallback);
            this.historyButton.removeEventListener('click', this.historyButtonClickCallback);
            this.equippedGearButton.removeEventListener('click', this.gearButtonClickCallback);
            this.upgradeButton.removeEventListener('click', this.upgradeButtonClickCallback);
            this.recycleButton.removeEventListener('click', this.recycleButtonClickCallback);
            /* strip_from_prod_client:begin */
            //Unlock button left to test but removed on prod
            this.unlockButton.removeEventListener('click', this.unlockButtonClickCallback);
            /* strip_from_prod_client:end */
        }

        /**
         * @param {HTMLButtonElement} button
         */

    }, {
        key: 'selectTabButton',
        value: function selectTabButton(button) {
            if (this.selectedTabButton) {
                this.selectedTabButton.classList.remove('selected');
            }
            this.selectedTabButton = button;
            this.selectedTabButton.classList.add('selected');
        }
    }, {
        key: 'showHistory',
        value: function showHistory() {
            this.toggleShowEquippedGear(false);
            this.toggleShowStats(true);
            this.selectTabButton(this.historyButton);
            this.updateHistoryPane();
        }
    }, {
        key: 'showStats',
        value: function showStats() {
            this.toggleShowEquippedGear(false);
            this.toggleShowStats(true);
            this.selectTabButton(this.statsButton);
            this.updateStatsPaneInfo(this.gear);
        }
    }, {
        key: 'showEquippedGear',
        value: function showEquippedGear() {
            this.selectTabButton(this.equippedGearButton);
            this.toggleShowStats(false);
            this.toggleShowEquippedGear(true);
            this.updateEquippedGear();
        }
    }, {
        key: 'updateEquippedItems',
        value: function updateEquippedItems() {
            this.updateEquippedGear();

            if (this.gear && this.gear.userItem && (this.gearType === 'armor' || this.gearType === 'helmet')) {
                this.playerCanvas.update(this.gear);
            }
        }

        /**
         * @param {boolean} show
         */

    }, {
        key: 'toggleShowEquippedGear',
        value: function toggleShowEquippedGear(show) {
            this.equippedGearPane.hidden = !show;
        }

        /**
         * @param {boolean} show
         */

    }, {
        key: 'toggleShowStats',
        value: function toggleShowStats(show) {
            this.gearDisplayPane.hidden = !show;
            this.statsContainer.hidden = !show;
        }
    }, {
        key: 'updateEquippedGear',
        value: function updateEquippedGear() {
            var _this3 = this;

            var armorItem = this.account.items.find(function (item) {
                return item.id === _this3.account.loadoutIds['armor'];
            });
            var equippedArmor = {
                userItem: armorItem,
                definition: armorItem ? GearDefs[armorItem.type] : null
            };
            var helmetItem = this.account.items.find(function (item) {
                return item.id === _this3.account.loadoutIds['helmet'];
            });
            var equippedhelmet = {
                userItem: helmetItem,
                definition: helmetItem ? GearDefs[helmetItem.type] : null
            };
            var ringItem = this.account.items.find(function (item) {
                return item.id === _this3.account.loadoutIds['ring'];
            });
            var equippedring = {
                userItem: ringItem,
                definition: ringItem ? GearDefs[ringItem.type] : null
            };
            this.equippedArmorItem.update(equippedArmor);
            this.equippedRingItem.update(equippedring);
            this.equippedHelmetItem.update(equippedhelmet);
        }
    }, {
        key: 'upgrade',
        value: function upgrade() {
            this.loadoutMenu.goToForge('upgrade', this.gear.definition.type);
        }
    }, {
        key: 'recycle',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _this4 = this;

                var callback, modalRecycle;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                callback = function callback() {
                                    _this4.update(null, _this4.gearType);
                                    _this4.showStats();
                                };

                                modalRecycle = new ModalRecycle(this.account, this.localization, this.gear.definition, this.gear.userItem, callback.bind(this));

                                modalRecycle.show();

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function recycle() {
                return _ref.apply(this, arguments);
            }

            return recycle;
        }()

        /* strip_from_prod_client:begin */

    }, {
        key: 'unlock',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var _this5 = this;

                var updatedGear;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.account.unlock('unlock_test_' + this.gear.definition.id);

                            case 2:
                                updatedGear = getGearItems(this.account.items, this.gearType).find(function (gear) {
                                    return gear.definition.id === _this5.gear.definition.id;
                                });

                                this.update(updatedGear, this.gearType);
                                this.unlockSubscribers.forEach(function (subs) {
                                    return subs(_this5);
                                });

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function unlock() {
                return _ref2.apply(this, arguments);
            }

            return unlock;
        }()
        /* strip_from_prod_client:end */

    }]);
    return ArmoryGearDisplayCard;
}();

module.exports = ArmoryGearDisplayCard;
