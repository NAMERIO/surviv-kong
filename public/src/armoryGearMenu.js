"use strict";


var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var $ = require("./8ee62bea.js");
var GearDefs = require("./gearDefs.js");

var _require = require("./loadouts.js"),
    LoadoutTypes = _require.LoadoutTypes;

var GearCardItem = require("./gearCardItem.js");
var ArmoryGearDisplayCard = require("./armoryGearDisplayCard.js");

var _require2 = require("./35dbdceb.js"),
    getGearItems = _require2.getGearItems;

var PlayerCanvas = require("./playerCanvas.js");

function itemSort(sortFn) {
    return function (a, b) {
        return sortFn(a, b);
    };
}

function sortByLevel(a, b) {
    var levelA = a.userItem ? a.userItem.level : 1;
    var levelB = b.userItem ? b.userItem.level : 1;
    if (levelA == levelB) {
        return sortRarity(a, b);
    }
    return levelA - levelB;
}

var sortTypes = {
    'newest': itemSort(sortAcquired),
    'alpha': itemSort(sortAlphabetical),
    'rarity': itemSort(sortRarity),
    'level': itemSort(sortByLevel)
};

function sortAcquired(a, b) {
    var aTimeAcquired = a.userItem ? a.userItem.timeAcquired : 1;
    var bTimeAcquired = b.userItem ? b.userItem.timeAcquired : 1;
    if (aTimeAcquired === bTimeAcquired) {
        return sortRarity(a, b);
    } else {
        return bTimeAcquired - aTimeAcquired;
    }
}

function sortAlphabetical(a, b) {
    var defA = GearDefs[a.definition.id];
    var defB = GearDefs[b.definition.id];

    if (defA.name < defB.name) {
        return -1;
    } else if (defA.name > defB.name) {
        return 1;
    }

    return 0;
}

var rarityValues = {
    'common': 0,
    'rare': 1,
    'epic': 2,
    'legendary': 3
};

function sortRarity(a, b) {
    var rarityA = rarityValues[GearDefs[a.definition.id].rarity];
    var rarityB = rarityValues[GearDefs[b.definition.id].rarity];
    if (rarityA == rarityB) {
        return sortAlphabetical(a, b);
    }
    return rarityA - rarityB;
}

var ArmoryGearMenu = function () {
    /**
     * 
     * @param {import('./account')} account 
     * @param {import('./localization')} localization 
     * @param {import('./resources').ResourceManager} resources 
     * @param {import('./loadout-menu')} loadoutMenu
     */
    function ArmoryGearMenu(account, localization, resources, loadoutMenu) {
        (0, _classCallCheck3.default)(this, ArmoryGearMenu);

        this.resources = resources;
        this.account = account;
        this.localization = localization;
        this.initialized = false;
        this.selectedArmorElement = null;
        this.selectedGear = null;
        this.loadoutMenu = loadoutMenu;
        /** @type{GearCardItem[]} */
        this.gearList = [];
        /** @type{GearCardItem} */
        this.selectedGearItem = null;
        this.selectedGearType = LoadoutTypes.armor;
        /** @type {HTMLElement} */
        this.container = document.querySelector('#armory-gear-container');
        this.sortBy = 'rarity';
        this.sortOrder = 'asc';
    }

    (0, _createClass3.default)(ArmoryGearMenu, [{
        key: 'mount',
        value: function mount() {
            this.grid = this.container.querySelector('#armory-gears-grid');
            /** @type{HTMLElement} */
            var gearCardContainer = this.container.querySelector('#armory-gear-info-container');
            this.gearCard = new ArmoryGearDisplayCard(this.localization, this.account, this.loadoutMenu.spineData, gearCardContainer, this.loadoutMenu);
            this.gearCard.onUnlock(this.onUnlock.bind(this));
            /** @type {HTMLSelectElement} */
            this.selectSortBy = this.container.querySelector('#armory-sort-by');
            /** @type {HTMLInputElement} */
            this.sortAscToggle = this.container.querySelector('#armory-sort-asc');
            this.initialized = true;
            this.selectSortBy.addEventListener('change', this.onSortByChanged.bind(this));
            this.sortAscToggle.addEventListener('change', this.onSortAscChanged.bind(this));
        }

        /**
         * @param {{ gear: { userItem?: any; definition?: any; }; }} item
         */

    }, {
        key: 'onUnlock',
        value: function onUnlock(item) {
            if (this.selectedGearItem) {
                this.selectedGearItem.update(item.gear);
                this.selectGearItem(this.selectedGearItem);
                //this.equipGearLoadout(item.gear);
            }
        }

        /** @param {Event} event */

    }, {
        key: 'onSortByChanged',
        value: function onSortByChanged(event) {
            if (this.sortBy !== event.target.value) {
                this.sortBy = event.target.value;
                this.updateGearListItems(this.selectedGearItem);
            }
        }
    }, {
        key: 'onSortAscChanged',
        value: function onSortAscChanged(event) {
            this.sortOrder = event.target.checked ? 'desc' : 'asc';
            this.updateGearListItems(this.selectedGearItem);
        }
        /**
         * @param {any[]} items
         */

    }, {
        key: 'updateItems',
        value: function updateItems(items) {
            this.items = items;
            this.update(this.selectedGearType);
        }

        /**
         * @param {any} loadout
         * @param {any} loadoutIds
         */

    }, {
        key: 'updateLoadout',
        value: function updateLoadout(loadout, loadoutIds) {
            this.loadout = loadout;
            this.loadoutIds = loadoutIds;
        }

        /**
         * @param {{ userItem?: any; definition?: any }} gear
         */

    }, {
        key: 'equipGearLoadout',
        value: function equipGearLoadout(gear) {
            var forceEquip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (this.account.unlinked) {
                this.account.emit('incentiveModal');
                return;
            }

            var loadoutGearId = this.account.loadoutIds[this.selectedGearType];
            if (!forceEquip && gear.userItem && loadoutGearId === gear.userItem.id) {
                return;
            }
            //TODO create an enum for the gear types and use it in the definitions
            //so it can be easily changed if necessary
            this.account.setLoadout((0, _assign2.default)({}, this.loadout, (0, _defineProperty3.default)({}, gear.definition.type || this.selectedGearType, {
                type: gear.definition.id,
                level: gear.userItem.level
            })), (0, _assign2.default)({}, this.loadoutIds, (0, _defineProperty3.default)({}, gear.definition.type || this.selectedGearType, gear.userItem.id)));
        }
    }, {
        key: 'unequipGearLoadout',
        value: function unequipGearLoadout() {
            if (this.account.unlinked) {
                this.account.emit('incentiveModal');
                return;
            }

            this.account.setLoadout((0, _assign2.default)({}, this.loadout, (0, _defineProperty3.default)({}, this.selectedGearType, {
                type: '',
                level: 1
            })), (0, _assign2.default)({}, this.loadoutIds, (0, _defineProperty3.default)({}, this.selectedGearType, "0")));
            this.gearCard.update(null, this.selectedGearType);
            this.gearCard.showStats();
        }

        /**
         * @param {string} gearType
         */

    }, {
        key: 'update',
        value: function update(gearType) {
            if (this.selectedGearType !== gearType) {
                this.selectedGearItem = null;
                this.selectedGear = null;
            }
            this.selectedGearType = gearType;
            if (!this.initialized) {
                this.mount();
                this.initialized = true;
            }

            this.updateGearListItems();

            if (!this.selectedGearItem) {
                this.gearCard.update(null, gearType);
                this.gearCard.showStats();
            }

            //   this.container.hidden = false;
        }

        /**
         * 
         * @param {GearCardItem} [selectedItem] 
         */

    }, {
        key: 'updateGearListItems',
        value: function updateGearListItems(selectedItem) {
            var _this = this;

            this.gearList.forEach(function (gearItem) {
                gearItem.destroy();
            });
            var gearItems = getGearItems(this.account.items, this.selectedGearType);
            var sortFn = sortTypes[this.sortBy];
            gearItems.sort(sortFn);

            if (this.sortOrder === 'desc') {
                gearItems = gearItems.reverse();
            }
            this.grid.innerHTML = '';
            this.gearList = gearItems.map(function (gear) {
                return new GearCardItem(gear, _this.grid, gear.definition.type);
            });
            this.gearList.forEach(function (gearItem) {
                gearItem.onClick(function (_gearItem) {
                    return _this.selectGearItem(_gearItem);
                });

                if (selectedItem && gearItem.gear.definition.id === selectedItem.gear.definition.id) {
                    _this.selectGearItem(gearItem, true);
                    //gearItem.triggerSelect();
                } else if (!selectedItem && gearItem.gear.userItem && gearItem.gear.userItem.id === _this.account.loadoutIds[_this.selectedGearType]) {
                    gearItem.triggerSelect();
                }
            });
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (this.container) {
                this.container.hidden = true;
            }
            this.selectedGearItem = null;
            this.selectedGear = null;
        }
    }, {
        key: 'show',
        value: function show() {
            if (this.container) {
                this.container.hidden = false;
            }
        }

        /**
         * 
         * @param {GearCardItem} gearItem 
         * @param {boolean} [skipEquip]
         * @returns 
         */

    }, {
        key: 'selectGearItem',
        value: function selectGearItem(gearItem, skipEquip) {
            if (this.selectedGearItem) {
                this.selectedGearItem.deselect();
            }

            this.selectedGearItem = gearItem;
            this.selectedGearItem.select();

            if (!skipEquip && this.selectedGear && gearItem.gear.userItem && this.selectedGear.userItem && this.selectedGear.userItem.id === gearItem.gear.userItem.id) {
                this.selectedGear = null;
                this.selectedGearItem.deselect();
                this.unequipGearLoadout();
                return;
            }

            if (!skipEquip && gearItem.gear.userItem && gearItem.gear.userItem.id !== null) {
                this.equipGearLoadout(gearItem.gear);
            }
            this.gearCard.update(gearItem.gear, this.selectedGearType);
            this.gearCard.showStats();
            this.selectedGear = gearItem.gear;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.selectSortBy) {
                this.selectSortBy.removeEventListener('change', this.onSortByChanged.bind(this));
            }
            if (this.sortAscToggle) {
                this.sortAscToggle.removeEventListener('change', this.onSortAscChanged.bind(this));
            }
        }
    }]);
    return ArmoryGearMenu;
}();

module.exports = ArmoryGearMenu;
