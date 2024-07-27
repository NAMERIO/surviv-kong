"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _set = require("./ed9971da.js");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var GearCardItem = require("./gearCardItem.js");
var GearDefs = require("./4ead53e6.js");

var _require = require("./35dbdceb.js"),
    getUniqueGearPerks = _require.getUniqueGearPerks;

var WindowModal = require("./windowModal.js");
var gear = require("./gearDefs.js");

/**
 * 
 * @param {import('./localization')} localization 
 * @param {*} perk 
 */
var getPerkText = function getPerkText(localization, perk) {
    if (perk.type === 'boon') {
        return localization.translate("gear-" + perk.boon + "-perk");
    }

    if (perk.type === 'protection') {
        var _perkText = localization.translate("gear-" + perk.type + "-perk");
        var attack = localization.translate("attack-type-" + perk.params.type);
        return _perkText.replace('[damage]', perk.params.protection).replace('[attack]', attack);
    }

    var perkText = localization.translate("gear-" + perk.type + "-perk");
    var statusEffect = localization.translate("status_effect-type-" + perk.params.type);
    return perkText.replace('[resistance]', perk.params.resistance).replace('[effect]', statusEffect);
};

var EquippedGearCard = function () {
    /**
     * @param {HTMLElement} parent
     */
    function EquippedGearCard(parent, localization) {
        (0, _classCallCheck3.default)(this, EquippedGearCard);

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#equipped_gear_card');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type{HTMLElement} */node.querySelector('.equipped_gear_card');
        this.mount();
        parent.appendChild(node);
        this.localization = localization;
    }

    (0, _createClass3.default)(EquippedGearCard, [{
        key: "mount",
        value: function mount() {
            this.image = this.card.querySelector('img');
            /** @type{HTMLSpanElement} */
            this.name = this.card.querySelector('.equipped_gear_card-name');
            /** @type{HTMLSpanElement} */
            this.rarity = this.card.querySelector('.equipped_gear_card-rarity');
        }
    }, {
        key: "destroy",
        value: function destroy() {}

        /**
         * 
         * @param {{ userItem: any, definition: any}} gear 
         * @param {string} type
         */

    }, {
        key: "update",
        value: function update(gear, type) {
            this.gear = gear;
            this.type = type;

            this.card.classList.remove(this.card.dataset.borderClass);
            this.rarity.classList.remove(this.rarity.dataset.bgClass);
            if (!gear || !gear.userItem) {
                this.rarity.dataset.visibility = 'hidden';
                this.image.classList.add('filter-gray-scale-1');
                this.image.src = "img/gui/loadout-tab-" + this.type + ".png";
                this.name.innerText = this.localization.translate('not-gear-equipped').replace('[gear]', this.localization.translate("gear-title-" + this.type));
                this.card.dataset.borderClass = 'border-gray';
            } else {
                this.rarity.dataset.visibility = 'visible';
                this.image.classList.remove('filter-gray-scale-1');
                this.image.src = this.gear.definition.images.md;
                this.name.innerText = this.gear.definition.name;
                this.rarity.innerText = this.gear.definition.rarity + ' ' + this.type;
                this.card.dataset.borderClass = "border-" + this.gear.definition.rarity;
                this.rarity.dataset.bgClass = "bg-" + this.gear.definition.rarity;
            }
            this.card.classList.add(this.card.dataset.borderClass);
            this.rarity.classList.add(this.rarity.dataset.bgClass);
        }
    }]);
    return EquippedGearCard;
}();

var ForgeGearPerksCard = function () {

    /**
     * @param {HTMLElement} parent
     * @param {import("./localization")} localization
     * @param {import("./account")} account
     */
    function ForgeGearPerksCard(parent, localization, account) {
        (0, _classCallCheck3.default)(this, ForgeGearPerksCard);

        this.account = account;
        this.localization = localization;
        /** @type {Set<(ForgeGearPerksCard) => void>} */
        this.subscribers = new _set2.default();
        /** {{userItem?: any, definition?: any}} */
        this.gear = null;

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#forge_gear_perks_card');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type{HTMLElement} */node.querySelector('.forge_gear_perks_card');
        this.mount();
        parent.appendChild(node);
    }

    (0, _createClass3.default)(ForgeGearPerksCard, [{
        key: "mount",
        value: function mount() {
            var _this = this;

            this.onUpgradeCallback = function () {
                _this.subscribers.forEach(function (subs) {
                    return subs(_this);
                });
            };
            /** @type {HTMLButtonElement} */
            this.upgradeBtn = this.card.querySelector('#upgrade_btn');
            this.upgradeBtn.addEventListener('click', this.onUpgradeCallback);
            /** @type {HTMLDivElement} */
            this.notGearContainer = this.card.querySelector('#not-gear-equipped');
            /** @type {HTMLDivElement} */
            this.perksContainer = this.card.querySelector('#perks-container');
            /** @type {HTMLDivElement} */
            this.nextPerksContainer = this.card.querySelector('#next-perks-container');
            /** @type {HTMLDivElement} */
            this.currentPerks = this.card.querySelector('#current-perks');
            /** @type {HTMLDivElement} */
            this.nextPerks = this.card.querySelector('#next-perks');
            this.account.addEventListener('request', this.updateUpgradeBtn.bind(this));
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (this.upgradeBtn) {
                this.upgradeBtn.removeEventListener('click', this.onUpgradeCallback);
            }
        }
    }, {
        key: "onUpgrade",
        value: function onUpgrade(subs) {
            this.subscribers.add(subs);
        }

        /**
         * @param {{ definition: { levels: any[]; }; userItem: { level: number; id: number }; }} gear
         */

    }, {
        key: "getNextPerks",
        value: function getNextPerks(gear) {
            var _this2 = this;

            this.gear = gear;
            var levels = gear.definition.levels.filter(function (level) {
                return level.level > gear.userItem.level;
            });

            var perksElements = levels.map(function (level) {
                var isNextUpgrade = level.level === gear.userItem.level + 1;
                var perks = level.perks.map(function (perk) {
                    var perkContainerClass = isNextUpgrade ? 'bg-current-perk' : '';
                    var levelClass = isNextUpgrade ? 'active-perk' : 'disabled';
                    var perkColor = isNextUpgrade ? 'active-perk' : 'disabled';
                    return "\n                    <div class=\"flex flex-row items-start p-2 " + perkContainerClass + "\">\n                        <span class=\"" + levelClass + " text-white font-edit font-outline-black h8\">LVL " + level.level + "</span>\n                        <span class=\"" + perkColor + " text-white font-edit font-outline-black uppercase\">" + getPerkText(_this2.localization, perk) + "</span>\n                    </div>";
                });

                return perks.join('');
            });

            return perksElements.join('');
        }
    }, {
        key: "getCurrentPerks",
        value: function getCurrentPerks(gear) {
            var _this3 = this;

            var perks = getUniqueGearPerks(gear);
            var perksElements = perks.map(function (perk) {
                return "<span class=\"font-edit perks-text uppercase\">" + getPerkText(_this3.localization, perk) + "</span>";
            });
            return perksElements.join('');
        }
    }, {
        key: "updateUpgradeBtn",
        value: function updateUpgradeBtn() {
            var gear = this.gear;
            if (!gear || !gear.definition || !gear.userItem) {
                return;
            }
            var maxLevel = gear.userItem.level === gear.definition.levels.length;
            this.nextPerksContainer.hidden = maxLevel;
            this.upgradeBtn.hidden = maxLevel;
            if (!maxLevel) {
                this.nextPerks.innerHTML = this.getNextPerks(gear);
                var requiredEssence = gear.definition.levels[gear.userItem.level].requiredEssence;
                var canUpgrade = this.account.profile.totalEssence >= requiredEssence;
                this.upgradeBtn.querySelector('.essence').innerHTML = requiredEssence;
                this.upgradeBtn.disabled = !canUpgrade;
            }
        }
    }, {
        key: "update",
        value: function update(gear, gearType) {
            this.card.classList.remove(this.card.dataset.border);
            this.gear = gear;
            if (!gear || !gear.definition) {
                this.card.dataset.border = 'border-gray-1';
                this.notGearContainer.querySelector('span').innerText = this.localization.translate('equip-gear-to-upgrade').replace('[gear]', this.localization.translate("gear-title-" + gearType));
                this.notGearContainer.hidden = false;
                this.upgradeBtn.hidden = true;
                this.perksContainer.hidden = true;
            } else {
                this.updateUpgradeBtn();
                this.card.dataset.border = "border-" + gear.definition.rarity;
                this.currentPerks.innerHTML = this.getCurrentPerks(gear);
                this.perksContainer.hidden = false;
                this.notGearContainer.hidden = true;
            }

            this.card.classList.add(this.card.dataset.border);
        }
    }]);
    return ForgeGearPerksCard;
}();

var GearForge = function () {

    /**
     * @param {import("./localization")} localization
     * @param {import("./account")} account
     */
    function GearForge(localization, account) {
        (0, _classCallCheck3.default)(this, GearForge);

        this.localization = localization;
        this.account = account;

        /** @type {HTMLDivElement} */
        this.selectedTab = null;
        /** @type {HTMLDivElement} */
        this.upgradeSection = null;
        /** @type {HTMLDivElement} */
        this.craftSection = null;

        /** @type{string} */
        this.gearType = 'armor';
        this.initialized = false;
        /** @type {GearCardItem} */
        this.selectedGearCard = null;
        /** @type {GearCardItem[]} */
        this.gearCardItems = [];
        this.mount();
        this.init();
    }

    (0, _createClass3.default)(GearForge, [{
        key: "mount",
        value: function mount() {
            var _this4 = this;

            var container = document.querySelector('#forge-section');
            this.upgradeSection = container.querySelector('#upgrade_container');
            this.craftSection = container.querySelector('#craft_container');
            this.equippedGearCard = new EquippedGearCard(this.upgradeSection, this.localization);
            this.equippedGearPerksCard = new ForgeGearPerksCard(this.upgradeSection, this.localization, this.account);
            this.equippedGearCard.update(null, 'armor');
            this.equippedGearPerksCard.update(null, 'armor');
            this.account.addEventListener('items', this.initCards.bind(this));
            this.account.addEventListener('loadout', this.updateCards.bind(this));
            this.equippedGearPerksCard.onUpgrade(function (item) {
                return _this4.upgrade(item);
            });
            this.forgeModal = new WindowModal(document.querySelector('#forge-section'));
        }

        /**
         * 
         * @param {ForgeGearPerksCard} gearItem 
         */

    }, {
        key: "upgrade",
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(gearItem) {
                var gear, updatedGear, loadout;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!this.account.unlinked) {
                                    _context.next = 3;
                                    break;
                                }

                                this.account.emit('incentiveModal');
                                return _context.abrupt("return");

                            case 3:
                                if (!this.upgrading) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt("return");

                            case 5:
                                this.upgrading = true;
                                gear = gearItem.gear.userItem;
                                _context.next = 9;
                                return this.account.upgradeItem(gear.id);

                            case 9:
                                updatedGear = {
                                    userItem: this.account.items.find(function (item) {
                                        return item.id === gear.id;
                                    }),
                                    definition: gearItem.gear.definition
                                };
                                loadout = this.account.loadout;

                                this.account.setLoadout((0, _assign2.default)({}, loadout, (0, _defineProperty3.default)({}, gearItem.gear.definition.type, {
                                    type: gearItem.gear.definition.id,
                                    level: updatedGear.userItem.level
                                })), this.account.loadoutIds);
                                gearItem.update(updatedGear);
                                this.selectedGearCard.update(updatedGear);
                                this.upgrading = false;
                                //const updatedGear = getGearItems(this.account.items, t).find((gear) => gear.userItem.id === this.gear.userItem.id);
                                //this.update(updatedGear, this.gearType);

                            case 15:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function upgrade(_x) {
                return _ref.apply(this, arguments);
            }

            return upgrade;
        }()
    }, {
        key: "initCards",
        value: function initCards() {
            var _this5 = this;

            if (this.gearCardItems.length > 0) {
                return;
            }
            var cardsContainer = this.upgradeSection.querySelector('#cards_container');
            this.gearCardItems = ['armor', 'helmet', 'ring'].map(function (type) {
                var userItem = _this5.account.items.find(function (item) {
                    return item.id === _this5.account.loadoutIds[type];
                });
                var definition = userItem ? GearDefs[userItem.type] : null;
                return new GearCardItem({ userItem: userItem, definition: definition }, cardsContainer, type);
            });

            this.gearCardItems.forEach(function (cardItem) {
                cardItem.onClick(function (card) {
                    return _this5.selectGearCard(card);
                });
            });
        }
    }, {
        key: "updateCards",
        value: function updateCards() {
            var _this6 = this;

            if (this.gearCardItems.length === 0) {
                return;
            }

            this.gearCardItems.forEach(function (cardItem) {
                var type = cardItem.type;
                var userItem = _this6.account.items.find(function (item) {
                    return item.id === _this6.account.loadoutIds[type];
                });
                var definition = userItem ? GearDefs[userItem.type] : null;
                cardItem.update({ userItem: userItem, definition: definition });
            });
        }
        /**
         * 
         * @param {GearCardItem} card 
         */

    }, {
        key: "selectGearCard",
        value: function selectGearCard(card) {
            if (this.selectedGearCard) {
                this.selectedGearCard.deselect();
            }
            this.selectedGearCard = card;
            this.selectedGearCard.select();
            this.equippedGearCard.update(card.gear, card.type);
            this.equippedGearPerksCard.update(card.gear, card.type);
        }
    }, {
        key: "init",
        value: function init(initialTab, gearType) {
            var _this7 = this;

            /** @type{NodeListOf<HTMLDivElement>} */
            this.sectionTabs = document.querySelectorAll('#forge-section .window-tab');
            var tabName = initialTab ? initialTab : 'upgrade';
            if (gearType) {
                this.gearType = gearType;
            } else {
                this.gearType = 'armor';
            }
            this.sectionTabs.forEach(function (tab) {
                tab.onclick = function () {
                    if (tab !== _this7.selectedTab) _this7.selectTab(tab);
                };

                if (tab.dataset.tab === tabName) {
                    _this7.selectTab(tab);
                }
            });
        }
    }, {
        key: "selectTab",
        value: function selectTab(tab) {
            if (tab !== this.selectedTab) {
                if (this.selectedTab) {
                    this.selectedTab.classList.remove('selected');
                }
                this.selectedTab = tab;
                this.selectedTab.classList.add('selected');
            }
            this.selectedTab = tab;
            switch (this.selectedTab.dataset.tab) {
                case 'upgrade':
                    this.showUpgradeSection();
                    break;
                case 'craft':
                    this.showCraftSection();
                    break;
                default:
                    break;
            }
        }
    }, {
        key: "showUpgradeSection",
        value: function showUpgradeSection() {
            this.upgradeSection.hidden = false;
            this.craftSection.hidden = true;
            this.updateGearUpgrade();
        }
    }, {
        key: "showCraftSection",
        value: function showCraftSection() {
            this.craftSection.hidden = false;
            this.upgradeSection.hidden = true;
        }
    }, {
        key: "updateGearUpgrade",
        value: function updateGearUpgrade() {
            var _this8 = this;

            var cardToSelect = this.gearCardItems.find(function (cardItem) {
                return cardItem.type === _this8.gearType;
            });
            if (cardToSelect) {
                cardToSelect.triggerSelect();
            }
        }
    }, {
        key: "show",
        value: function show(tabName, gearType) {
            this.init(tabName, gearType);
            this.forgeModal.show();
            this.active = true;
        }
    }, {
        key: "hide",
        value: function hide() {
            this.forgeModal.hide();
            this.active = false;
        }
    }]);
    return GearForge;
}();

module.exports = GearForge;
