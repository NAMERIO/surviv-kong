"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var loadouts = require("./loadouts.js");
var helpers = require("./helpers.js");
var MenuModal = require("./menuModal.js");
var Rarities = require("./rarities.js");

var GameObjectDefs = require("./gameObjectDefs.js");

var ShowItems = ['outfit', 'heal', 'boost', 'melee', 'emote', 'deathEffect'];

//
// OpponentMenu
//

var OpponentMenu = function () {
    function OpponentMenu(account, localization, adManager) {
        var _this = this;

        (0, _classCallCheck3.default)(this, OpponentMenu);

        this.account = account;
        this.localization = localization;
        this.adManager = adManager;
        this.initialized = false;
        this.opponentDisplay = null;
        this.currentLoadout = loadouts.defaultLoadout();
        this.currentGearStats = null;

        this.modalCustomize = $('#modal-opponent');
        this.modalCustomizeList = $('#modal-opponent-list');
        this.modalCustomizeItemName = $('#modal-opponent-item-name');
        this.modalCustomizeItemSource = $('#modal-opponent-item-source-value');
        this.modalCustomizeItemType = $('#modal-opponent-item-type-value');
        this.modalCustomizeItemMakr = $('#opponent-item-makr');
        this.modalCustomizeItemKills = $('#opponent-item-kills');
        this.modalCustomizeItemLevels = $('#opponent-item-levels');
        this.modalCustomizeItemWins = $('#opponent-item-wins');

        this.modalName = $('.modal-opponent-name');
        this.modalKpg = $('.modal-opponent-kills-value');
        this.modal = new MenuModal(this.modalCustomize);
        this.modal.onShow(function () {
            _this.onShow();
        });
        this.modal.onHide(function () {
            _this.onHide();
        });
    }

    (0, _createClass3.default)(OpponentMenu, [{
        key: 'init',
        value: function init() {
            if (this.initialized) {
                return;
            }

            this.initialized = true;
        }
    }, {
        key: 'show',
        value: function show(loadout, gearStats, name, kpg) {
            this.currentLoadout = loadout;
            this.currentGearStats = gearStats;
            this.name = name;
            this.kpg = kpg;
            this.init();
            this.modal.show();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.modal.hide();
        }
    }, {
        key: 'onShow',
        value: function onShow() {
            this.modalName.html(this.name);
            this.modalKpg.html(this.kpg);
            this.opponentDisplay.setCurrentLoadout(this.currentLoadout);
            this.selectCat();

            $('#ui-opponent-menu-makr-label').html(this.localization.translate('market-sort-makr') + ':');
            $('#ui-opponent-menu-kills-label').html(this.localization.translate('market-sort-kills') + ':');
            $('#ui-opponent-menu-levels-label').html(this.localization.translate('market-sort-levels') + ':');
            $('#ui-opponent-menu-wins-label').html(this.localization.translate('market-sort-wins') + ':');

            this.active = true;
        }
    }, {
        key: 'onHide',
        value: function onHide() {
            this.active = false;
        }
    }, {
        key: 'onResize',
        value: function onResize() {}
    }, {
        key: 'onRequest',
        value: function onRequest() {}
    }, {
        key: 'updateLoadoutFromDOM',
        value: function updateLoadoutFromDOM() {}
    }, {
        key: 'selectCat',
        value: function selectCat() {

            var loadoutItems = this.currentLoadout;

            var getItemSourceName = function getItemSourceName(source) {
                var sourceDef = GameObjectDefs[source];
                return sourceDef && sourceDef.name ? sourceDef.name : source;
            };

            // Reset selectedCatItems
            this.selectedCatItems = [];
            var loadoutItemDiv = '';
            var cont = 0;

            var listItems = $('<div/>');
            for (var i = 0; i < ShowItems.length; i++) {
                var item = void 0;
                var objDef = void 0;
                var totalItems = void 0;
                if (ShowItems[i] !== 'emote') {
                    totalItems = 1;
                } else {
                    totalItems = 4;
                }

                for (var j = 0; j < totalItems; j++) {
                    var itemStats = '';
                    if (ShowItems[i] !== 'emote') {
                        item = loadoutItems[ShowItems[i]];
                        objDef = GameObjectDefs[item];
                        itemStats = this.currentGearStats[ShowItems[i]];
                    } else {
                        item = loadoutItems.emotes[j];
                        objDef = GameObjectDefs[item];
                        itemStats = this.currentGearStats[ShowItems[i]][j];
                    }

                    var itemInfo = {
                        type: item,
                        rarity: objDef.rarity || 0,
                        displayName: objDef.name,
                        displaySource: getItemSourceName(item.source),
                        category: ShowItems[i],
                        displayLore: objDef.lore || '',
                        stats: itemStats
                    };

                    // Create div for emote customization list
                    var outerDiv = $('<div/>', {
                        class: 'customize-list-item customize-list-item-unlocked',
                        'data-idx': cont
                    });
                    cont++;

                    var svg = helpers.getSvgFromGameType(item);
                    var transform = helpers.getCssTransformFromGameType(item);
                    var bgSize = '';
                    var innerDiv = '';

                    if (transform != 'rotate(0rad) scaleX(1)') {
                        innerDiv = $('<div/>', {
                            class: 'customize-item-image',
                            css: {
                                transform: 'rotate(0rad) scaleX(1)',
                                border: '2.86534px solid ' + Rarities[itemInfo.rarity].color,
                                'background-color': '' + Rarities[itemInfo.rarity].backgroundColor

                            }
                        });

                        var innerDivSpan = $('<span/>', {
                            class: 'customize-item-image',
                            css: {
                                'background-image': 'url(' + svg + ')',
                                transform: transform,
                                'background-size': bgSize

                            },
                            'data-img': 'url(' + svg + ')'
                        });

                        innerDiv.append(innerDivSpan);
                    } else {
                        innerDiv = $('<div/>', {
                            class: 'customize-item-image',
                            css: {
                                'background-image': 'url(' + svg + ')',
                                transform: 'rotate(0rad) scaleX(1)',
                                'background-size': bgSize,
                                border: '2.86534px solid ' + Rarities[itemInfo.rarity].color,
                                'background-color': '' + Rarities[itemInfo.rarity].backgroundColor

                            },
                            'data-img': 'url(' + svg + ')'
                        });
                    }

                    outerDiv.append(innerDiv);

                    //Item rarity icon
                    var itemRarity = $('<div>');
                    itemRarity.addClass('item-rarity-style');
                    itemRarity.css({ 'background-color': '' + Rarities[itemInfo.rarity].color });
                    var itemRarityImage = $('<div>');
                    itemRarityImage.addClass('dark item-' + itemInfo.category);
                    itemRarity.append(itemRarityImage);

                    innerDiv.append(itemRarity);

                    listItems.append(outerDiv);

                    this.selectedCatItems.push(itemInfo);

                    if (!loadoutItemDiv) {
                        loadoutItemDiv = outerDiv;
                    }
                }
            }
            this.modalCustomizeList.html('');
            this.modalCustomizeList.append(listItems);

            this.selectableSlots = $('.customize-list-item');
            this.itemSelected = false;

            var that = this;
            this.selectableSlots.on('mouseup', function () {
                if ($(this).hasClass('customize-list-item-locked')) {
                    return;
                }
                if (that.itemSelected && !$(this).hasClass('customize-list-item')) {
                    that.itemSelected = false;
                    return;
                }
                that.selectItem($(this));
            });

            // Select loadout item
            this.deselectItem();
            if (loadoutItemDiv != '') {
                var isListItem = loadoutItemDiv.hasClass('customize-list-item');
                var parent = isListItem ? loadoutItemDiv : loadoutItemDiv.parent();
                this.defaultIdx = parent.data('idx');
                this.selectItem(loadoutItemDiv);
            }
        }
    }, {
        key: 'deselectItem',
        value: function deselectItem() {
            this.itemSelected = false;
            this.selectedItem = {};
            this.selectableSlots.removeClass('customize-list-item-selected');
            this.selectableSlots.removeAttr('style');
        }
    }, {
        key: 'selectItem',
        value: function selectItem(selector, category) {
            var isListItem = selector.hasClass('customize-list-item');
            var parent = isListItem ? selector : selector.parent();
            var image = parent.find('.customize-item-image');
            var selectorIdx = parent.data('idx');
            var selectedItem = this.selectedCatItems[selectorIdx];

            if (!selectedItem) {
                this.itemSelected = false;
                this.selectedItem = {
                    prevSlot: null,
                    img: '',
                    type: ''
                };
                return;
            }

            this.itemSelected = true;

            this.selectedItem = {
                prevSlot: isListItem ? null : parent,
                img: image.data('img'),
                type: selectedItem.type,
                rarity: selectedItem.rarity,
                displayName: selectedItem.displayName || '',
                displaySource: selectedItem.displaySource || 'Unknown',
                category: selectedItem.category || 'Unknown',
                stats: selectedItem.stats
            };

            // Change the display texts
            if (this.selectedItem.displayName) {
                var stringKey = 'loadout-' + this.selectedItem.displayName.replace(/ /g, '-').toLowerCase();
                var itemName = this.localization.translate(stringKey);
                this.modalCustomizeItemName.html(itemName);
            }
            var source = this.localization.translate('loadout-' + selectedItem.displaySource) || this.localization.translate('' + selectedItem.displaySource) || this.selectedItem.displaySource;
            var sourceTxt = '' + source;
            this.modalCustomizeItemSource.html(sourceTxt);
            this.modalCustomizeItemType.html(selectedItem.displayLore);

            if (selectedItem.stats.makr != '-1' && selectedItem.stats.kills != '-1' && selectedItem.stats.levels != '-1' && selectedItem.stats.wins != '-1') {
                $('.item-stats-container').css('display', 'block');
                this.modalCustomizeItemMakr.html(' ' + selectedItem.stats.makr);
                this.modalCustomizeItemKills.html(' ' + selectedItem.stats.kills);
                this.modalCustomizeItemLevels.html(' ' + selectedItem.stats.levels);
                this.modalCustomizeItemWins.html(' ' + selectedItem.stats.wins);
            } else {
                $('.item-stats-container').css('display', 'none');
            }

            // Highlight clicked item
            this.selectableSlots.removeClass('customize-list-item-selected');
            this.selectableSlots.removeAttr('style');
            if (isListItem) {
                selector.addClass('customize-list-item-selected');
                this.customizeListItemSelected = $('.customize-list-item-selected');
            } else {
                var hl = parent.find('.ui-emote-hl');
                hl.css('opacity', 1.0);
            }
        }
    }]);
    return OpponentMenu;
}();

module.exports = OpponentMenu;
