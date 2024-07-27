"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require("./9bc388c8.js");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("./160ad6a9.js");

var _entries2 = _interopRequireDefault(_entries);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var device = require("./device.js");
var GameConfig = require("./989ad62a.js");
var EmoteSlot = GameConfig.EmoteSlot;
var loadouts = require("./loadouts.js");
var Emote = require("./emote.js");
var crosshair = require("./crosshair.js");
var helpers = require("./helper.js");
var MenuModal = require("./menuModal.js");
var util = require("./util.js");
var colorpicker = require("./colorPicker.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var LootBoxesDefs = require("./lootBoxes.js");
var Rarities = require("./rarities.js");
var ArmoryGearMenu = require("./armoryGearMenu.js");

var _require = require("./loadouts.js"),
    LoadoutTypes = _require.LoadoutTypes;

var EditUsernameBubble = require("./editUsernameBubble.js");
var ModalRecycle = require("./modalRecycle.js");

var kMeleeLockedItems = {
    'fists': 0
};

var kSeasonsPassesOrder = {
    'pass_survivr5': 5,
    'pass_survivr4': 4,
    'pass_survivr3': 3,
    'pass_survivr2': 2,
    'pass_survivr1': 1
};

//
// Helpers
//
function emoteSlotToDomElem(emoteSlot) {
    var _EmoteSlotToDomId;

    var EmoteSlotToDomId = (_EmoteSlotToDomId = {}, (0, _defineProperty3.default)(_EmoteSlotToDomId, EmoteSlot.Top, 'customize-emote-top'), (0, _defineProperty3.default)(_EmoteSlotToDomId, EmoteSlot.Right, 'customize-emote-right'), (0, _defineProperty3.default)(_EmoteSlotToDomId, EmoteSlot.Bottom, 'customize-emote-bottom'), (0, _defineProperty3.default)(_EmoteSlotToDomId, EmoteSlot.Left, 'customize-emote-left'), (0, _defineProperty3.default)(_EmoteSlotToDomId, EmoteSlot.Win, 'customize-emote-win'), (0, _defineProperty3.default)(_EmoteSlotToDomId, EmoteSlot.Death, 'customize-emote-death'), _EmoteSlotToDomId);
    var domId = EmoteSlotToDomId[emoteSlot] || EmoteSlotToDomId[EmoteSlot.Top];
    return $('#' + domId);
}

function itemSort(sortFn) {
    return function (a, b) {
        // Always put stock items at the front of the list;
        // if not stock, sort by the given sort routine
        var rarityA = GameObjectDefs[a.type].rarity || 0;
        var rarityB = GameObjectDefs[b.type].rarity || 0;
        if (rarityA == 0 && rarityB == 0) {
            return sortAlphabetical(a, b);
        } else if (rarityA == 0) {
            return -1;
        } else if (rarityB == 0) {
            return 1;
        } else {
            return sortFn(a, b);
        }
    };
}

function sortAcquired(a, b) {
    if (b.timeAcquired == a.timeAcquired) {
        return sortSubcat(a, b);
    } else {
        return b.timeAcquired - a.timeAcquired;
    }
}

function sortAlphabetical(a, b) {
    var defA = GameObjectDefs[a.type];
    var defB = GameObjectDefs[b.type];
    if (defA.name < defB.name) {
        return -1;
    } else if (defA.name > defB.name) {
        return 1;
    } else {
        return 0;
    }
}

function sortRarity(a, b) {
    var rarityA = GameObjectDefs[a.type].rarity || 0;
    var rarityB = GameObjectDefs[b.type].rarity || 0;
    if (rarityA == rarityB) {
        return sortAlphabetical(a, b);
    } else {
        return rarityB - rarityA;
    }
}

function sortSubcat(a, b) {
    var defA = GameObjectDefs[a.type];
    var defB = GameObjectDefs[b.type];
    if (!defA.category || !defB.category || defA.category == defB.category) {
        return sortAlphabetical(a, b);
    } else {
        return defA.category - defB.category;
    }
}

function sortSeason(a, b) {
    var aSeasonOrder = kSeasonsPassesOrder[a.source];
    var bSeasonOrder = kSeasonsPassesOrder[b.source];

    if (aSeasonOrder !== undefined && bSeasonOrder !== undefined) {
        return bSeasonOrder === aSeasonOrder ? b.timeAcquired - a.timeAcquired : bSeasonOrder - aSeasonOrder;
    }

    if (aSeasonOrder !== undefined && bSeasonOrder === undefined) {
        return -1;
    }
    if (bSeasonOrder !== undefined && aSeasonOrder === undefined) {
        return 1;
    }

    if (a.timeAcquired == b.timeAcquired) {
        return sortAlphabetical(a, b);
    } else {
        return b.timeAcquired - a.timeAcquired;
    }
}

function sortPrice(a, b) {
    if (a.price == b.price) {
        return sortAlphabetical(a, b);
    } else {
        return a.price - b.price;
    }
}

var sortTypes = {
    'newest': itemSort(sortAcquired),
    'alpha': itemSort(sortAlphabetical),
    'rarity': itemSort(sortRarity),
    'subcat': itemSort(sortSubcat),
    'season': itemSort(sortSeason),
    'price': itemSort(sortPrice)
};

var LoadoutCategoryTypes = {
    avatar: 'avatar',
    helmet: 'helmet',
    armor: 'armor',
    ring: 'ring',
    weapon: 'weapon',
    emote: 'emote'
};

var LoadoutCategoryTypesIndex = {
    avatar: 0,
    helmet: 1,
    armor: 2,
    ring: 3,
    weapon: 4,
    emote: 5
};

var gearType = {
    0: 'skinColor',
    1: 'hair',
    2: 'body',
    3: 'bodyfull',
    4: 'helmet'
};

var GenderImages = {
    male: 'img/gui/male-symbol.png',
    female: 'img/gui/female-symbol.png'
};

var Genders = ['male', 'female'];

var getCategoryTabHTML = function getCategoryTabHTML(category, _ref, text) {
    var loadoutType = _ref.loadoutType,
        tabImgSrc = _ref.tabImgSrc;

    return '\n        <div class="modal-customize-cat window-tab gap-1" data-idx="' + loadoutType + '" id="' + category + '-tab">\n            <span class="modal-customize-cat-image window-tab_icon" style="background-image: url(' + tabImgSrc + ')"></span>\n            <span class="modal-customize-cat-name edit-base-button-text window-tab_name">\n                ' + text + '\n            </span>\n            <span class="account-alert account-alert-cat"></span>\n        </div>\n    ';
};

//
// LoadoutMenu
//

var LoadoutMenu = function () {
    /**
     * 
     * @param {import('./account')} account 
     * @param {import('./localization')} localization 
     * @param {import('./resources').ResourceManager} resources 
     * @param {import('./ads')} adManager 
     * @param {import('./config')} config 
     */
    function LoadoutMenu(account, localization, resources, adManager, config) {
        var _this = this;

        (0, _classCallCheck3.default)(this, LoadoutMenu);

        this.resources = resources;
        this.account = account;
        this.localization = localization;
        this.adManager = adManager;

        /** @type{import('./loadout-display').LoadoutDisplay} */
        this.loadoutDisplay = null;
        this.config = config;
        this.active = false;
        this.initialized = false;

        this.loadout = loadouts.defaultLoadout();
        this.loadoutIds = loadouts.defaultLoadoutIds();
        this.items = [];
        this.events = {};
        this.armoryGearMenu = new ArmoryGearMenu(this.account, this.localization, this.resources, this);
        this.localPendingConfirm = [];
        this.localConfirmed = [];
        this.confirmingItems = false;
        //this.sellingItem = false;
        this.itemSold = false;
        this.equipLastItem = false;

        this.localAckItems = [];

        this.categories = (0, _entries2.default)(LoadoutCategoryTypesIndex).map(function (_ref2) {
            var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                key = _ref3[0],
                loadoutType = _ref3[1];

            return {
                loadoutType: loadoutType,
                gameType: key,
                tabImgSrc: 'img/gui/loadout-tab-' + key + '.png'
            };
        });

        this.selectedItem = {
            prevSlot: null,
            img: '',
            type: '',
            id: '0'
        };
        this.emotesLoaded = false;

        this.selectedCatIdx = null;
        this.selectedCatItems = [];
        this.equippedItems = [];
        this.defaultItem = null;
        this.defaultIdx = 0;
        this.changeForDefault = false;

        this.modalCustomize = $('#modal-customize');
        this.modalCustomizeList = $('#modal-customize-list');
        this.playerArmoryContainer = $('#player-armory-container');
        this.modalCustomizeButtons = $('#modal-customize-buttons');
        this.speechBubble = $('#armory-speech-bubble');
        this.modalCustomizeListBoost = $('#modal-customize-list-boost');
        this.modalCustomizeEditContainer = $('#modal-customize-edit-container');
        this.emoteContainer = $('#emote-container');
        this.emoteRecycleBtn = $('#emote-recycle_btn');
        this.emoteRecycleEssense = $('#emote-recycle_essence');
        this.emoteList = $('#emote-grid');

        this.modal = new MenuModal(this.modalCustomize);
        this.modal.onShow(function () {
            _this.onShow();
        });
        this.modal.onHide(function () {
            _this.onHide();
        });
        this.modal.modalCloseListener = null;

        this.confirmAll = false;
        var displayBlockingElem = function displayBlockingElem() {
            $('#modal-screen-block').fadeIn(200);
        };
        $('#modal-opt-confirm-all').on('click touchend', function (e) {
            _this.confirmAll = true;
        });
        var confirmNextNewItem = function confirmNextNewItem() {
            setTimeout(function () {
                if (_this.confirmAll) {
                    _this.clearConfirmItemModal();
                    _this.confirmAll = false;
                }
                _this.confirmNextItem();
            }, 100);
        };
        this.confirmItemModal = new MenuModal($('#modal-item-confirm'));
        this.confirmItemModal.onShow(displayBlockingElem);
        this.confirmItemModal.onHide(confirmNextNewItem);

        account.addEventListener('request', this.onRequest.bind(this));
        account.addEventListener('loadout', this.onLoadout.bind(this));
        account.addEventListener('items', this.onItems.bind(this));
        account.addEventListener('recycle', this.recycleCB.bind(this));
        account.addEventListener('pass', this.onPass.bind(this));
        // Sell button        
        this.sellButtonElem = $('#button-sell-item');

        this.sellButtonConfirm = null;

        //Control vars
        this.selectedHairIdx = 0;
        this.selectedSkinIdx = 0;
        this.selectedGenderIdx = 0;

        //item vars
        this.userSkins = [];
        this.userHairSkins = [];

        $('#random-button').on('click', function () {
            _this.randomSkin();
        });

        this.emoteRecycleBtn.on('click', function () {
            _this.onRecycle();
        });

        $('#save-button').on('click', function () {
            _this.saveAvatar();
        });

        /** @type{(string: tab, gearType: string) => void} */
        this.goToForge = null;
    }

    (0, _createClass3.default)(LoadoutMenu, [{
        key: 'setSpineData',
        value: function setSpineData(spineData) {
            this.spineData = spineData;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;

            if (this.initialized) {
                return;
            }

            var categoriesTabsHTML = this.categories.map(function (category) {
                return getCategoryTabHTML(category.gameType, category, _this2.localization.translate('loadout-title-' + category.gameType));
            });
            var categoriesTabsContainer = $('#modal-customize-header');
            categoriesTabsContainer.append(categoriesTabsHTML.join(''));
            this.selectableCats = $('.modal-customize-cat');
            this.selectableCatImages = $('.modal-customize-cat-image');

            // Listen for cat selection
            this.selectableCats.on('mouseup', function (e) {
                var selector = $(e.currentTarget);
                var newCategoryIdx = selector.data('idx');

                if (_this2.selectedCatIdx != newCategoryIdx) {
                    _this2.selectCat(newCategoryIdx);
                }
            });

            var usernameContainerArmory = document.querySelector('#armory-speech-bubble');
            this.usernameBubbleArmory = new EditUsernameBubble(usernameContainerArmory, this.localization, this.account);

            // Listen for changes in item sorting
            /*this.itemSort = $('#modal-customize-sort');
            this.itemSort.on('change', (e) => {
                this.sortItems(e.target.value);       
            });*/

            // Listen for item header clicks to scroll to selected item
            /*this.modalCustomizeItemName.on('click', () => {
                let elements = document.getElementsByClassName('customize-list-item-selected');
                if (elements.length > 0 && !this.sellingItem && !this.itemSold) {
                    elements[0].scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
                }
                else if(this.sellingItem){
                    this.sellingItem = false;
                }else if(this.itemSold){
                    this.itemSold = false;
                }
            });*/

            // Crosshair settings
            $('#crosshair-size').on('input', function (e) {
                _this2.updateLoadoutFromDOM();
            });

            $('#crosshair-stroke').on('input', function (e) {
                _this2.updateLoadoutFromDOM();
            });

            this.container = document.getElementById('color-picker');
            this.picker = new window.CP(this.container, false, this.container);
            this.picker.self.classList.add('static');

            this.picker.on('change', function (color) {
                $('#color-picker-hex').val(color);
                // this.container.parentNode.style.backgroundColor = hexColor;

                // @NOTE: For some reason this is called on page load,
                //        before the loadout has been set
                if (_this2.loadout && _this2.loadout.crosshair) {
                    _this2.updateLoadoutFromDOM();
                }
            });

            this.colorCode = document.getElementById('color-picker-hex');

            var updateColor = function updateColor(e) {
                var value = _this2.colorCode.value;
                if (!value.length) {
                    return;
                }
                // Only accept 6 digit hex or 7 digit with a hash
                var sixDigit = value.length == 6;
                if (sixDigit) {
                    _this2.picker.set('#' + value);
                    _this2.picker.fire('change', [value]);
                    return;
                }
                var sevenDigit = value.length == 7 && value[0] == '#';
                if (sevenDigit) {
                    _this2.picker.set(value);
                    _this2.picker.fire('change', [value.slice(1)]);
                    return;
                }
            };
            this.colorCode.oncut = updateColor;
            this.colorCode.onpaste = updateColor;
            this.colorCode.onkeyup = updateColor;
            this.colorCode.oninput = updateColor;

            var self = this;
            //TODO delete all related with this sell modal, is not longer used, this was replaced with modal-recycle.js
            /*this.sellButtonElem.click(function (e) {
                this.sellConfirmModal = new MenuModal($('#modal-confirm-sell'));
                this.sellConfirmModal.show();
                if (!self.sellButtonConfirm) {
                    self.sellButtonConfirm = $('#btn-confirm-sell');
                    self.sellButtonConfirm.css('pointer-events', 'auto');
                    self.sellButtonConfirm.click(function (e2) {
                        //Sell item selected
                        self.sellingItem = true;
                        self.itemSold = true;
                        self.account.sellUserItem(self.selectedItem.type, self.selectedItem.id);
                    });
                }
            });*/

            this.initialized = true;
        }
    }, {
        key: 'show',
        value: function show() {
            this.init();
            this.modal.show();
        }
    }, {
        key: 'showEquip',
        value: function showEquip() {
            this.init();
            this.equipLastItem = true;
            this.modal.show();
        }
    }, {
        key: 'showLoadoutPageAds',
        value: function showLoadoutPageAds() {
            console.log("AdManager.showLoadoutPageAds");

            // show survivio_300x600_loadout if:
            // - not on cordova app
            // - ad container is visible
            var slotIds = [];
            if (!device.webview) {
                var adContainer = $('#survivio_300x600_loadout');
                if (adContainer && adContainer.css('display') != 'none') {
                    slotIds.push('survivio_300x600_loadout');
                }
            }
            if (!this.adManager.currentUserVip) {
                this.adManager.showFreestarAds(slotIds, false);
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.modal.hide();
        }
    }, {
        key: 'onShow',
        value: function onShow() {
            this.active = true;

            // Reset items to ack locally
            this.localAckItems = [];
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                if (item.status < loadouts.ItemStatus.Ackd) {
                    this.localAckItems.push(item);
                }
            }

            /* if (this.selectedCatIdx === null) {
                this.selectedCatIdx = LoadoutCategoryTypesIndex.avatar;
            } */
            this.selectedCatIdx = LoadoutCategoryTypesIndex.avatar;
            this.selectCat(this.selectedCatIdx, true);
            this.tryBeginConfirmingItems();
        }
    }, {
        key: 'onHide',
        value: function onHide() {
            this.armoryGearMenu.hide();

            if (this.account.loggedIn && !this.account.unlinked) {
                this.active = false;
                this.account.setLoadout(this.loadout, this.loadoutIds);
            }
            /*if (this.config.get('incentiveLoadout') || (this.account.loggedIn && !this.account.unlinked)) {
                this.active = false;
                 // Save loadout
                this.account.setLoadout(this.loadout, this.loadoutIds);
                if ((loadouts.modified(this.loadout, this.account.loadout) || loadouts.modified(this.loadoutIds, this.account.loadoutIds)) && !this.account.unlinked) {
                    this.account.setLoadout(this.loadout, this.loadoutIds);
                }
                 this.clearConfirmItemModal();
                 this.modalCustomize.css({ cursor: 'initial' });
                 $('#start-bottom-right, #start-main').fadeIn(200);
                $('#background').show();
            }*/ /*else {
                this.config.set('incentiveLoadout', true);
                this.emit('incentiveModal');
                this.modal.show();
                }*/

            this.adManager.showBannerAd(true);
        }
    }, {
        key: 'onResize',
        value: function onResize() {
            // Adjust the emote modal content on mobile
            if (device.mobile) {
                var category = this.categories[this.selectedCatIdx];
                if (category.loadoutType == 'emote') {
                    // Apply styling based on orientation
                    $('#modal-customize-list').attr('style', '');
                } else {
                    $('#modal-customize-list').attr('style', device.isLandscape ? '' : 'height: 380px');
                }
            }
        }
    }, {
        key: 'onRequest',
        value: function onRequest() {
            $('#modal-customize-loading').css('opacity', this.account.requestsInFlight > 0 ? 1.0 : 0.0);
        }
    }, {
        key: 'onLoadout',
        value: function onLoadout(loadout, loadoutIds) {
            this.loadout = loadouts.validateLoadout(loadout);
            this.loadoutIds = (0, _assign2.default)({}, loadouts.validateLoadoutIds(loadoutIds));
            this.armoryGearMenu.updateLoadout(this.loadout, this.loadoutIds);
            crosshair.setGameCrosshair(loadout.crosshair);

            if (this.active) {
                //  this.selectCat(this.selectedCatIdx);
            }
        }
    }, {
        key: 'recycleCB',
        value: function recycleCB() {
            this.wasRecycled = true;
        }
    }, {
        key: 'onItems',
        value: function onItems(items) {
            var _this3 = this;

            this.items = loadouts.getUserAvailableItems(items);

            if (this.wasRecycled) {
                this.wasRecycled = false;
                this.armoryGearMenu.updateItems(this.items);
            }

            // this.armoryGearMenu.updateItems(this.items);
            // Gather new items to be locally confirmed and ackd.
            //
            // This is a little tricky since behind the scenes we're confirming
            // all items at once when the confirmNewItem modal is displayed,
            // and we're acking all items when a category is selected.
            //
            // We don't want to erase or duplicate any locally unconfirmed
            // or unackd items if setItem() were to be called again while
            // the user is still in the confirm dialogs or on the loadout menu.
            //
            // Because of this, we'll treat the local arrays as append-only.

            var _loop = function _loop(i) {
                var item = _this3.items[i];

                if (item.status < loadouts.ItemStatus.Confirmed && item.id && !_this3.localPendingConfirm.find(function (x) {
                    return x.id == item.id;
                }) && !_this3.localConfirmed.find(function (x) {
                    return x.id == item.id;
                })) {
                    _this3.localPendingConfirm.push(item);
                }

                if (item.status < loadouts.ItemStatus.Ackd && item.id && !_this3.localAckItems.find(function (x) {
                    return x.id == item.id;
                })) {
                    _this3.localAckItems.push(item);
                }
            };

            for (var i = 0; i < this.items.length; i++) {
                _loop(i);
            }

            if (this.active) {
                this.tryBeginConfirmingItems();
                this.selectCat(this.selectedCatIdx);
            }

            if (this.emoteUpdated) {
                this.setEmoteSelectionUI();
                this.emoteUpdated = false;
            } else {
                this.setAvatarSelectionUI();
            }

            // Request the default unlock if we don't have it yet
            /*if (this.account.loggedIn && !this.account.unlinked) {
                let newAccountUnlock = 'unlock_new_account';
                if (!this.items.find(x => x.type == newAccountUnlock)) {
                    this.account.unlock(newAccountUnlock);
                }
            }*/
        }
    }, {
        key: 'onPass',
        value: function onPass(pass, resetRefresh) {
            var _this4 = this;

            // Show/hide the social media buttons based on whether we have
            // unlocked them
            var unlocks = ['facebook', 'instagram', 'youtube', 'twitter'];

            var _loop2 = function _loop2(i) {
                var unlockType = unlocks[i];
                var hasUnlock = !!pass.unlocks[unlockType];

                var el = $('.customize-social-unlock[data-lock-reason=\'' + unlockType + '\']');
                el.css({
                    display: !hasUnlock ? 'inline-block' : 'none'
                });
                el.off('click').on('click', function () {
                    _this4.account.setPassUnlock(unlockType);
                });
            };

            for (var i = 0; i < unlocks.length; i++) {
                _loop2(i);
            }
        }
    }, {
        key: 'onRecycle',
        value: function onRecycle() {
            var _this5 = this;

            var callback = function callback() {
                //this.selectedItem.itemSold = true; 
                _this5.deselectItem();
            };

            this.selectedItem.name = this.selectedItem.type;
            this.selectedItem.type = 'emote';
            this.emoteUpdated = true;
            var modalRecycle = new ModalRecycle(this.account, this.localization, this.selectedItem, this.selectedItem, callback.bind(this.selectedItem));
            modalRecycle.show();

            //this.deselectItem();
        }
    }, {
        key: 'getCategory',
        value: function getCategory(gameType) {
            for (var i = 0; i < this.categories.length; i++) {
                var category = this.categories[i];
                if (category.gameType == gameType) {
                    return category;
                }
            }
            return null;
        }
    }, {
        key: 'clearConfirmItemModal',
        value: function clearConfirmItemModal() {
            this.localPendingConfirm = [];
            this.localConfirmed = [];
            this.confirmingItems = false;
            this.confirmItemModal.hide();
        }
    }, {
        key: 'setItemsConfirmed',
        value: function setItemsConfirmed() {
            var confirmItemTypes = [];
            for (var i = 0; i < this.items.length; i++) {
                var _item = this.items[i];
                if (_item.status < loadouts.ItemStatus.Confirmed) {
                    confirmItemTypes.push(_item);
                }
            }
            if (confirmItemTypes.length > 0) {
                this.account.setItemStatus(loadouts.ItemStatus.Confirmed, confirmItemTypes);
            }
        }
    }, {
        key: 'setItemsAckd',
        value: function setItemsAckd(catIdx) {
            var category = this.categories[catIdx];

            // Ack items on the server
            var ackItemTypes = [];
            for (var i = 0; i < this.items.length; i++) {
                var _item2 = this.items[i];
                var objDef = GameObjectDefs[_item2.type];
                if (objDef && objDef.type == category.gameType && _item2.status < loadouts.ItemStatus.Ackd) {
                    ackItemTypes.push(_item2);
                }
            }
            if (ackItemTypes.length > 0) {
                this.account.setItemStatus(loadouts.ItemStatus.Ackd, ackItemTypes);
            }
        }
    }, {
        key: 'tryBeginConfirmingItems',
        value: function tryBeginConfirmingItems() {
            if (this.active && !this.confirmingItems) {
                this.confirmingItems = true;
                this.confirmNextItem();
            }
        }
    }, {
        key: 'confirmNextItem',
        value: function confirmNextItem() {
            // Confirm all pending new items in one shot upon displaying
            // the first item
            this.setItemsConfirmed();

            /*let currentNewItem = this.localPendingConfirm.shift();
            if (currentNewItem) {
                this.localConfirmed.push(currentNewItem);
                 const objDef = GameObjectDefs[currentNewItem.type];
                 let itemInfo = {
                    type: currentNewItem.type,
                    rarity: objDef.rarity || 0,
                    displayName: objDef.name,
                    category: objDef.type
                };
                 let svg = helpers.getSvgFromGameType(currentNewItem.type);
                let imageUrl = `url(${svg})`;
                let transform = helpers.getCssTransformFromGameType(
                    currentNewItem.type
                );
                 setTimeout(() => {
                    let itemModalName = `loadout-${itemInfo.displayName.replace(/ /g, '-').toLowerCase()}`;
                    $('#modal-item-confirm-name').html(this.localization.translate(itemModalName));
                    $('#modal-item-confirm-image-outer').css({ border: `6px solid ${(Rarities[itemInfo.rarity].color)}` });
                    $('#modal-item-confirm-image-inner').css({
                        'background-image': imageUrl,
                        'transform': 'rotate(0rad) scaleX(1)'
                    });
                     let itemRarity = $('<div>');
                    itemRarity.addClass('item-rarity-style');
                    itemRarity.css({ 'background-color': `${(Rarities[itemInfo.rarity].color)}` });
                    let itemRarityImage = $('<div>');
                    itemRarityImage.addClass('dark item-' + itemInfo.category);
                    itemRarity.append(itemRarityImage);
                     if ($('#modal-item-confirm-image-inner').find('.item-rarity-style').length !== 0) {
                        $('#modal-item-confirm-image-inner').find('.item-rarity-style').remove();
                    }
                     $('#modal-item-confirm-image-inner').append(itemRarity);
                     this.confirmItemModal.show();
                }, 200);
            } else {
                this.confirmingItems = false;
                // Remove the blocking elem once we're out of items
                $('#modal-screen-block').fadeOut(300);
            }*/
        }
    }, {
        key: 'lockMeleeItems',
        value: function lockMeleeItems(items) {
            var fistsIndex = items.findIndex(function (item) {
                return item.type === 'fists';
            });
            items.splice(kMeleeLockedItems['fists'], 0, items.splice(fistsIndex, 1)[0]);
        }
    }, {
        key: 'setItemListeners',
        value: function setItemListeners(loadoutType) {
            var that = this;
            // listen for ui modifications
            this.selectableSlots.on('mouseup', function () {
                if ($(this).hasClass('customize-list-item-locked')) {
                    return;
                }
                if (that.itemSelected && !$(this).hasClass('customize-list-item')) {
                    that.itemSelected = false;
                    return;
                }
                that.selectItem($(this));
                that.updateLoadoutFromDOM();
            });

            if (loadoutType == 'emote') {
                this.setEmoteDraggable(this.selectableSlots, that);

                // Only do this once, assuming the wheel is only used for emotes
                if (!this.emotesLoaded) {
                    this.setEmoteDraggable(this.droppableSlots, that);
                    this.droppableSlots.on('mouseup', function () {
                        if ($(this).hasClass('customize-list-item-locked')) {
                            return;
                        }
                        if (that.itemSelected && !$(this).hasClass('customize-list-item')) {
                            // that.itemSelected = false;
                            that.deselectItem();
                            return;
                        }
                        that.selectItem($(this));
                        that.updateLoadoutFromDOM();
                    });
                    this.droppableSlots.on('drop', function (ev) {
                        ev.originalEvent.preventDefault();
                        var parent = $(this).parent();
                        that.updateSlot(parent, that.selectedItem.img, that.selectedItem.type);
                        // that.itemSelected = false;

                        that.updateLoadoutFromDOM();
                        that.deselectItem();
                    });
                    this.droppableSlots.on('mousedown', function (ev) {
                        if (!that.itemSelected) {
                            return;
                        }
                        ev.stopPropagation();
                        var parent = $(this).parent();
                        that.updateSlot(parent, that.selectedItem.img, that.selectedItem.type);
                        that.updateLoadoutFromDOM();
                    });
                    this.droppableSlots.on('dragover', function (ev) {
                        ev.originalEvent.preventDefault();
                        var hl = $(this).parent().find('.ui-emote-hl');
                        hl.css({ display: 'block',
                            'opacity': 1.0 });
                        hl.attr('data-rarity', that.selectedItem.rarity);
                    });
                    this.droppableSlots.on('dragleave', function (ev) {
                        ev.originalEvent.preventDefault();
                        var hl = $(this).parent().find('.ui-emote-hl');
                        hl.css('opacity', 1);
                        hl.removeAttr('data-rarity');
                    });
                    this.droppableSlots.on('dragend', function (ev) {
                        ev.originalEvent.preventDefault();
                        that.deselectItem();
                    });

                    // Trash auto emotes
                    $('.ui-emote-auto-trash').click(function () {
                        var parent = $(this).parent();
                        that.updateSlot(parent, '', '');
                        that.updateLoadoutFromDOM();
                    });

                    this.emotesLoaded = true;
                }
            } else if (loadoutType == 'crosshair') {
                var crosshairHex = util.intToHex(this.loadout.crosshair.color);
                var color = [crosshairHex.slice(1)];
                this.picker.set(crosshairHex);
                $('#color-picker-hex').val(color);
                $('#crosshair-size').val(this.loadout.crosshair.size);
                $('#crosshair-stroke').val(this.loadout.crosshair.stroke);
            }
        }
    }, {
        key: 'updateLoadoutFromDOM',
        value: function updateLoadoutFromDOM() {
            var loadoutType = this.categories[this.selectedCatIdx].gameType;
            if (loadoutType == 'emote') {
                for (var i = 0; i < EmoteSlot.Count; i++) {
                    var domElem = emoteSlotToDomElem(i);
                    var slotIdx = domElem.data('idx');
                    var slotItem = this.equippedItems[slotIdx];

                    if (slotItem && slotItem.type) {
                        this.loadout.emotes[i] = slotItem.type;
                        this.loadoutIds.emotes[i] = slotItem.id;
                    } else {
                        this.loadout.emotes[i] = '';
                    }
                }
            } else if (loadoutType == 'crosshair') {
                var size = parseFloat($('#crosshair-size').val());
                var color = $('#color-picker-hex').val();
                var stroke = parseFloat($('#crosshair-stroke').val());

                this.loadout.crosshair = {
                    type: this.selectedItem.type,
                    color: util.hexToInt(color),
                    size: Number(size.toFixed(2)),
                    stroke: Number(stroke.toFixed(2))
                };
            } else {
                this.loadout[loadoutType] = this.selectedItem.type;
                this.loadoutIds[loadoutType] = this.selectedItem.id;
            }

            this.loadout = loadouts.validateLoadout(this.loadout);

            if (this.loadoutDisplay && this.loadoutDisplay.initialized) {
                this.loadoutDisplay.setLoadout(this.loadout);
            }

            if (this.selectedItem.loadoutType == 'crosshair') {
                this.setSelectedCrosshair();
            }
        }
    }, {
        key: 'selectCat',
        value: function selectCat(catIdx, force) {
            if (this.selectedCatIdx === catIdx && !force || this.categories.length === 0) {
                return;
            }
            this.selectedCatIdx = catIdx;
            var category = this.categories[this.selectedCatIdx];

            if (!category) {
                return;
            }

            switch (category.gameType) {
                case LoadoutCategoryTypes.avatar:
                    this.modalCustomizeEditContainer.html('');
                    this.modalCustomizeButtons.show();
                    this.speechBubble.show();
                    this.modalCustomizeList.show();
                    this.playerArmoryContainer.show();
                    this.emoteContainer.hide();
                    this.modalCustomizeEditContainer.show();
                    this.armoryGearMenu.hide();
                    this.setAvatarSelectionUI();
                    break;
                case LoadoutCategoryTypes.armor:
                case LoadoutCategoryTypes.ring:
                case LoadoutCategoryTypes.helmet:
                    this.modalCustomizeEditContainer.hide();
                    this.modalCustomizeButtons.hide();
                    this.speechBubble.hide();
                    this.modalCustomizeList.hide();
                    this.playerArmoryContainer.hide();
                    this.armoryGearMenu.update(category.gameType);
                    this.armoryGearMenu.show();
                    this.emoteContainer.hide();
                    break;
                case LoadoutCategoryTypes.emote:
                    this.armoryGearMenu.hide();
                    this.modalCustomizeEditContainer.show();
                    this.modalCustomizeEditContainer.html('');
                    this.modalCustomizeButtons.hide();
                    this.speechBubble.hide();
                    this.modalCustomizeList.hide();
                    this.playerArmoryContainer.hide();
                    this.emoteContainer.show();
                    this.setEmoteSelectionUI();
                    break;
                default:
                    this.armoryGearMenu.hide();
                    this.modalCustomizeEditContainer.show();
                    this.modalCustomizeEditContainer.html('');
                    this.modalCustomizeButtons.hide();
                    this.speechBubble.hide();
                    this.modalCustomizeList.hide();
                    this.playerArmoryContainer.hide();
                    this.emoteContainer.hide();
                    this.modalCustomizeEditContainer.html('<div class="coming-soon-container"><span class="h1 font-edit font-outline-black-4">COMING SOON</span></div>');
                    break;
            }

            if (this.selectableCats) {
                this.selectableCats.removeClass('selected');
            }
            var selector = $('.modal-customize-cat[data-idx=\'' + this.selectedCatIdx + '\']');
            selector.addClass('selected');
        }
    }, {
        key: 'randomSkin',
        value: function randomSkin() {
            if (this.account.requestsInFlight > 0 || this.items.length == 0) {
                return;
            }
            this.selectedGenderIdx = Math.floor(Math.random() * Genders.length);
            this.selectedSkinIdx = Math.floor(Math.random() * this.userSkins.length);
            this.selectedHairIdx = Math.floor(Math.random() * this.userHairSkins.length);
            this.updateSkin();
        }
    }, {
        key: 'saveAvatar',
        value: function saveAvatar() {
            var skin = this.userSkins[this.selectedSkinIdx].type;
            var hair = this.userHairSkins[this.selectedHairIdx].type;

            this.account.setLoadout((0, _assign2.default)({}, this.loadout, {
                avatar: {
                    skin: skin,
                    hair: hair
                }
            }), this.account.loadoutIds);
        }
    }, {
        key: 'updateUserSkins',
        value: function updateUserSkins(gender) {
            this.userSkins = this.items.filter(function (item) {
                var def = GameObjectDefs[item.type];
                return def && def.type === LoadoutTypes.skin && def.gender === gender;
            });
        }
    }, {
        key: 'updateSkin',
        value: function updateSkin() {
            var gender = Genders[this.selectedGenderIdx];
            var genderImage = GenderImages[gender];
            var skin = this.userSkins[this.selectedSkinIdx];
            var skinDef = GameObjectDefs[skin.type];

            if (skinDef.gender !== gender) {
                this.updateUserSkins(gender);
                skinDef = GameObjectDefs[skinDef[gender]];
            }
            var hair = this.userHairSkins[this.selectedHairIdx];
            var hairDef = GameObjectDefs[hair.type];
            var hairIconSrc = 'img/hairs/' + hairDef.icon;

            $('#genderBackground').css({ 'background-image': 'url(' + genderImage + ')' });
            $('#skinColorBackground').css({ 'background-color': '' + skinDef.color });
            //$('#hairStyleBackground').css({ 'background-image': `url(${hairIconSrc})` });

            $('#hairStyleBackground').html(this.selectedHairIdx + 1);

            var baseSkins = skinDef ? skinDef.skins : {};
            var hairSkins = hairDef ? hairDef.skins : {};
            var skins = (0, _assign2.default)({}, baseSkins, hairSkins);
            this.loadoutDisplay.player.changeSkin(skins);
        }
    }, {
        key: 'setAvatarSelectionUI',
        value: function setAvatarSelectionUI() {
            var _this6 = this;

            var skinDef = GameObjectDefs[this.loadout.avatar.skin];
            this.updateUserSkins(skinDef.gender);
            this.userHairSkins = this.items.filter(function (item) {
                return GameObjectDefs[item.type] && GameObjectDefs[item.type].type === LoadoutTypes.hair;
            });

            this.modalCustomizeEditContainer.empty();

            var botonGroup = $('<div/>', {
                'class': 'modal-customize-edit-group'
            }).appendTo(this.modalCustomizeEditContainer);

            $('<div/>', {
                'class': 'modal-customize-edit-name font-edit h7 font-outline-black',
                'text': 'gender'
            }).appendTo(botonGroup);

            var editGroup = $('<div/>', {
                'class': 'modal-customize-edit-buttons'
            }).appendTo(botonGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-prev-button arrow-btn-left '
            }).appendTo(editGroup).on('click', function () {
                if (_this6.selectedGenderIdx > 0) {
                    _this6.selectedGenderIdx--;
                } else {
                    _this6.selectedGenderIdx = Genders.length - 1;
                }

                _this6.updateSkin();
            });

            this.selectedGenderIdx = Genders.indexOf(skinDef.gender);
            var gender = Genders[this.selectedGenderIdx];
            var genderImage = GenderImages[gender];

            var boxContainer = $('<div/>', {
                'class': 'modal-customize-edit-box border-box-base-s'
            });

            $('<div/>', {
                'class': 'modal-customize-edit-display',
                'id': 'genderBackground'
            }).css({ 'background-image': 'url(' + genderImage + ')' }).appendTo(boxContainer);

            boxContainer.appendTo(editGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-prev-button arrow-btn-right '
            }).appendTo(editGroup).on('click', function () {
                if (_this6.selectedGenderIdx < Genders.length - 1) {
                    _this6.selectedGenderIdx++;
                } else {
                    _this6.selectedGenderIdx = 0;
                }
                _this6.updateSkin();
            });

            //Skin Color

            botonGroup = $('<div/>', {
                'class': 'modal-customize-edit-group'
            }).appendTo(this.modalCustomizeEditContainer);

            $('<div/>', {
                'class': 'modal-customize-edit-name font-edit h7 font-outline-black',
                'text': 'skin'
            }).appendTo(botonGroup);

            editGroup = $('<div/>', {
                'class': 'modal-customize-edit-buttons'
            }).appendTo(botonGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-prev-button arrow-btn-left '
            }).appendTo(editGroup).on('click', function () {

                if (_this6.selectedSkinIdx > 0) {
                    _this6.selectedSkinIdx--;
                } else {
                    _this6.selectedSkinIdx = _this6.userSkins.length - 1;
                }
                _this6.updateSkin();
            });

            boxContainer = $('<div/>', {
                'class': 'modal-customize-edit-box border-box-base-s'
            });

            var skinColor = skinDef ? skinDef.color : '';
            $('<div/>', {
                'class': 'modal-customize-edit-display',
                'id': 'skinColorBackground'
            }).css({ 'background-color': '' + skinColor }).appendTo(boxContainer);

            boxContainer.appendTo(editGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-prev-button arrow-btn-right '
            }).appendTo(editGroup).click(function () {

                if (_this6.selectedSkinIdx < _this6.userSkins.length - 1) {
                    _this6.selectedSkinIdx++;
                } else {
                    _this6.selectedSkinIdx = 0;
                }
                _this6.updateSkin();
            });

            //Hair Style

            botonGroup = $('<div/>', {
                'class': 'modal-customize-edit-group'
            }).appendTo(this.modalCustomizeEditContainer);

            $('<div/>', {
                'class': 'modal-customize-edit-name font-edit h7 font-outline-black',
                'text': 'hair style'
            }).appendTo(botonGroup);

            editGroup = $('<div/>', {
                'class': 'modal-customize-edit-buttons'
            }).appendTo(botonGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-prev-button arrow-btn-left '
            }).appendTo(editGroup).click(function () {

                if (_this6.selectedHairIdx > 0) {
                    _this6.selectedHairIdx--;
                } else {
                    _this6.selectedHairIdx = _this6.userHairSkins.length - 1;
                }
                _this6.updateSkin();
            });
            this.selectedHairIdx = this.userHairSkins.findIndex(function (hairSkin) {
                return hairSkin.type === _this6.loadout.avatar.hair;
            });

            if (this.userHairSkins[this.selectedHairIdx]) {

                var image = this.userHairSkins[this.selectedHairIdx].type;
                image = helpers.getSvgFromGameType(image);

                boxContainer = $('<div/>', {
                    'class': 'modal-customize-edit-box border-box-base-s'
                });

                $('<div/>', {
                    'class': 'modal-customize-edit-display flex items-center justify-center font-edit h5',
                    'text': this.selectedHairIdx + 1,
                    'id': 'hairStyleBackground'
                }).appendTo(boxContainer);
                //.css({ 'background-image': `url(${image})` }).appendTo(boxContainer);

                boxContainer.appendTo(editGroup);

                $('<div/>', {
                    'class': 'modal-customize-edit-prev-button arrow-btn-right '
                }).appendTo(editGroup).on('click', function () {

                    if (_this6.selectedHairIdx < _this6.userHairSkins.length - 1) {
                        _this6.selectedHairIdx++;
                    } else {
                        _this6.selectedHairIdx = 0;
                    }
                    _this6.updateSkin();
                });
            } else {
                boxContainer = $('<div/>', {
                    'class': 'modal-customize-edit-box border-box-base-s'
                });

                $('<div/>', {
                    'class': 'modal-customize-edit-display flex items-center justify-center font-edit h5',
                    'text': 1,
                    'id': 'hairStyleBackground'
                }).appendTo(boxContainer);
                //.css({ 'background-image': `url(${image})` }).appendTo(boxContainer);

                boxContainer.appendTo(editGroup);

                $('<div/>', {
                    'class': 'modal-customize-edit-prev-button arrow-btn-right '
                }).appendTo(editGroup).on('click', function () {
                    _this6.updateSkin();
                });
            }

            //Hair Color
            botonGroup = $('<div/>', {
                'class': 'modal-customize-edit-group'
            }).appendTo(this.modalCustomizeEditContainer);

            $('<div/>', {
                'class': 'modal-customize-edit-name font-edit h7 font-outline-black',
                'text': 'hair color'
            }).appendTo(botonGroup);

            editGroup = $('<div/>', {
                'class': 'modal-customize-edit-buttons'
            }).appendTo(botonGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-prev-button arrow-btn-left disabled'
            }).appendTo(editGroup).click(function () {});

            boxContainer = $('<div/>', {
                'class': 'modal-customize-edit-box border-box-base-s'
            });

            $('<div/>', {
                'class': 'modal-customize-edit-display'
            }).appendTo(boxContainer);

            boxContainer.appendTo(editGroup);

            $('<div/>', {
                'class': 'modal-customize-edit-next-button arrow-btn-right disabled'
            }).appendTo(editGroup).click(function () {});
        }
    }, {
        key: 'setEmoteSelectionUI',
        value: function setEmoteSelectionUI() {
            this.emoteList.empty();
            this.emotesUnlocked = this.items.filter(function (item) {
                return GameObjectDefs[item.type] && GameObjectDefs[item.type].type === LoadoutTypes.emote;
            });

            if (this.emotesUnlocked.length === 0) {
                //this.emotesUnlocked = this.equippedItems;
            }

            for (var i = 0; i < this.emotesUnlocked.length; i++) {
                this.equippedItems.push({});
                var emote = this.emotesUnlocked[i].type;
                var emoteId = /* this.loadoutIds.emotes[i] ? this.loadoutIds.emotes[i] : */'0';
                var emoteDef = GameObjectDefs[emote];

                if (emoteDef) {

                    var itemInfo = {
                        loadoutType: 'emote',
                        type: this.emotesUnlocked[i].type,
                        rarity: emoteDef.rarity || 0,
                        displayName: emoteDef.name,
                        displayLore: emoteDef.lore,
                        subcat: emoteDef.category,
                        images: {
                            sm: emoteDef.images.sm
                        },
                        id: i
                    };
                    this.selectedCatItems.push(itemInfo);

                    var svg = helpers.getSvgFromGameType(emote);
                    var html = '<div class="customize-list-item customize-list-item-unlocked customize-list-item-selected border-box-base-m border-box-' + emoteDef.rarity + '-m  border-box-base-' + i + '" data-idx=' + i + ' style="">\n                <div class="customize-item-image" draggable="true">\n                        <span class="customize-item-image" data-img="url(' + svg + ')" draggable="true" style="background-image: url(&quot;' + svg + '&quot;);"></span>\n                        \n                        </div>\n                </div>';
                    this.emoteList.append(html);
                }
            }

            for (var _i = 0; _i < this.loadout.emotes.length; _i++) {
                //  this.equippedItems.push({});
                var _emote = this.loadout.emotes[_i];
                var _emoteId = this.loadoutIds.emotes[_i] ? this.loadoutIds.emotes[_i] : '0';
                var _emoteDef = GameObjectDefs[_emote];

                if (_emoteDef) {
                    var _svg = helpers.getSvgFromGameType(_emote);
                    var imgCss = 'url(' + _svg + ')';
                    var domElem = emoteSlotToDomElem(_i);
                    // domElem.find(('.ui-emote-hl')).attr('data-rarity', emoteDef.rarity);
                    domElem.find('.ui-emote-hl').addClass(_emoteDef.rarity);
                    this.updateSlotData(domElem, imgCss, _emote, _emoteId);
                }
            }

            this.selectableSlots = $('.customize-list-item');
            this.droppableSlots = $('.customize-col');
            this.highlightedSlots = this.droppableSlots.siblings('.ui-emote-hl');
            this.highlightOpacityMin = 0.4;
            this.itemSelected = false;

            this.setItemListeners("emote");

            // Select loadout item
            this.deselectItem();

            /* $('<div/>', {
                'class': 'modal-customize-edit-name font-edit h7 font-outline-black',
                'text': 'gender'
            }).appendTo(this.emoteContainer);
             armory-gears-grid-container */
            //const emotesDef = GameObjectDefs[this.loadout.avatar.skin];

        }
    }, {
        key: 'setCategoryAlerts',
        value: function setCategoryAlerts() {
            var _this7 = this;

            var _loop3 = function _loop3(i) {
                var category = _this7.categories[i];
                var unackdItems = _this7.localAckItems.filter(function (x) {
                    var gameTypeDef = GameObjectDefs[x.type];
                    return gameTypeDef && gameTypeDef.type == category.gameType;
                });
                $('.modal-customize-cat[data-idx=\'' + i + '\']').find('.account-alert-cat').css('display', unackdItems.length > 0 ? 'block' : 'none');
            };

            // Display alerts on each category that has new items
            for (var i = 0; i < this.categories.length; i++) {
                _loop3(i);
            }
        }
    }, {
        key: 'setEmoteDraggable',
        value: function setEmoteDraggable(selector, that) {
            selector.on('dragstart', function (ev) {
                if ($(this).hasClass('customize-list-item-locked')) {
                    return;
                }
                that.selectItem($(this), false);
                if (device.browser != 'edge') {
                    // Set dragged image
                    var imgDiv = document.createElement('img');
                    imgDiv.src = that.selectedItem.img ? that.selectedItem.img.replace('url(', '').replace(')', '').replace(/\'/gi, '') : '';
                    ev.originalEvent.dataTransfer.setDragImage(imgDiv, 64, 64);
                }
            });
        }
    }, {
        key: 'setSelectedCrosshair',
        value: function setSelectedCrosshair() {
            var crosshairDef = this.loadout.crosshair;
            $('#customize-crosshair-selected').find('.customize-item-image').css({
                'background-image': crosshair.getCursorURL(crosshairDef)
            });
            crosshair.setElemCrosshair($('#customize-crosshair-selected'), crosshairDef);
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(event, callback) {
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
        }

        // @TODO: Add a 'once' option

    }, {
        key: 'removeEventListener',
        value: function removeEventListener(event, callback) {
            var listeners = this.events[event] || [];
            for (var i = listeners.length - 1; i >= 0; i--) {
                if (listeners[i] == callback) {
                    listeners.splice(i, 1);
                }
            }
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var listenersCopy = (this.events[event] || []).slice(0);

            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            for (var i = 0; i < listenersCopy.length; i++) {
                listenersCopy[i].apply(listenersCopy, data);
            }
        }
    }, {
        key: 'updateSlotData',
        value: function updateSlotData(parent, img, type, id) {
            var image = parent.find('.customize-emote-slot');
            image.css('background-image', img ? img : 'none');
            image.data('img', img ? img : 'none');
            var box = parent.find('.ui-emote-hl');
            var emoteDef = GameObjectDefs[type];
            var slotIdx = parent.data('idx');
            if (emoteDef) {
                var itemInfo = {
                    loadoutType: 'emote',
                    type: type,
                    rarity: emoteDef.rarity || 0,
                    displayName: emoteDef.name,
                    displayLore: emoteDef.lore,
                    subcat: emoteDef.category,
                    id: id,
                    images: {
                        sm: emoteDef.images.sm
                    }
                };
                box.removeAttr('data-rarity');
                box.removeClass('common epic legendary rare');
                box.addClass(emoteDef.rarity);
                this.equippedItems[slotIdx] = itemInfo;
            } else {
                this.equippedItems[slotIdx] = {};
            }
        }
    }, {
        key: 'selectItem',
        value: function selectItem(selector) {
            var _this8 = this;

            var deselect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var isListItem = selector.hasClass('customize-list-item');
            var parent = isListItem ? selector : selector.parent();
            var image = parent.find('.customize-item-image');
            var selectorIdx = parent.data('idx');
            //let selectorIdx = this.equippedItems;
            var selectedItem = void 0;
            // selectedItem = this.selectedCatItems[selectorIdx];
            if (parent.data('slot')) {
                selectedItem = this.equippedItems[selectorIdx];
            } else {
                selectedItem = this.selectedCatItems[selectorIdx];
            }
            var obj = this.items.find(function (o) {
                return o.type === selectedItem.type;
            });
            if (obj) {
                selectedItem.id = obj.id;
            }

            if (!this.itemSold) {
                if (selectorIdx == this.defaultIdx) {
                    this.changeForDefault = false;
                } else {
                    this.changeForDefault = true;
                }
            } else {
                if (this.changeForDefault) {
                    selectedItem = this.defaultItem;
                } else {
                    if (parent.data('slot')) {
                        selectedItem = this.equippedItems[0];
                    } else {
                        selectedItem = this.selectedCatItems[0];
                    }
                }
            }

            if (!selectedItem) {
                this.itemSelected = false;
                this.selectedItem = {
                    prevSlot: null,
                    img: '',
                    type: '',
                    id: '0'
                };
                return;
            }

            // Deselect this emote if it's already selected
            if (selectedItem.id == this.selectedItem.id && selectedItem.type == this.selectedItem.type && selectedItem.loadoutType == 'emote' && this.selectedItem.loadoutType == 'emote' && deselect) {
                this.deselectItem();
                return;
            }

            this.itemSelected = true;

            var lootBoxSource = LootBoxesDefs[selectedItem.displaySource];
            if (lootBoxSource) {
                selectedItem.displaySource = lootBoxSource.name;
            }

            var selectedItemImg = image.data('img');
            if (!selectedItemImg) {
                selectedItemImg = image.find('span').data('img');
            }

            this.selectedItem = {
                prevSlot: isListItem ? null : parent,
                img: selectedItemImg,
                type: selectedItem.type,
                rarity: selectedItem.rarity,
                displayName: selectedItem.displayName || '',
                images: selectedItem.images,
                displaySource: selectedItem.displaySource || 'Unknown',
                source: selectedItem.source || '',
                displayLore: selectedItem.displayLore || '',
                displayDescription: selectedItem.displayDescription || '',
                loadoutType: selectedItem.loadoutType,
                subcat: selectedItem.subcat,
                price: selectedItem.price,
                id: selectedItem.id,
                stats: selectedItem.stats
            };

            if (this.selectedItem) {
                var priceList = GameObjectDefs['prices_1'];
                var priceObj = priceList.rarities.find(function (o) {
                    return o.rarity === selectedItem.rarity;
                });
                if (this.selectedItem.id && priceObj.price) {
                    this.selectedItem.price = priceObj.price;
                    this.emoteRecycleBtn.css('display', 'flex');
                    this.emoteRecycleEssense.html(priceObj.price);
                } else {
                    this.emoteRecycleBtn.css('display', 'none');
                }
            }

            // Change the display texts
            /* if(this.selectedItem.displayName) {
                let stringKey = `loadout-${this.selectedItem.displayName.replace(/ /g, '-').toLowerCase()}`;
                let itemName = this.localization.translate(stringKey);
                this.modalCustomizeItemName.html(itemName);
            }
            //Display item stats
            if(this.selectedItem.stats) {
                $('.item-stats-container').css('display','block');
                this.modalCustomizeItemMakr.html(this.selectedItem.stats.makr ? ' '+ this.selectedItem.stats.makr : ' Not defined');
                this.modalCustomizeItemKills.html(this.selectedItem.stats.kills ? ' '+ helpers.getAbbreviatedNumber3Digits(this.selectedItem.stats.kills) : ' 0');
                this.modalCustomizeItemLevels.html(this.selectedItem.stats.levels ? ' '+ helpers.getAbbreviatedNumber3Digits(this.selectedItem.stats.levels) : ' 0');
                this.modalCustomizeItemWins.html(this.selectedItem.stats.wins ? ' '+ helpers.getAbbreviatedNumber3Digits(this.selectedItem.stats.wins) : ' 0');
            }
            else{
                $('.item-stats-container').css('display','none');
                this.modalCustomizeItemMakr.html(' Not defined');
                this.modalCustomizeItemKills.html(' 0');
                this.modalCustomizeItemLevels.html(' 0');
                this.modalCustomizeItemWins.html(' 0');
            } */
            //let source = this.localization.translate(`loadout-${selectedItem.displaySource}`) ||
            //this.localization.translate(`${selectedItem.displaySource}`) ||
            //this.selectedItem.displaySource;
            //let sourceTxt = `${this.localization.translate('loadout-acquired')}: ${source}`;
            //this.modalCustomizeItemSource.html(sourceTxt);
            //this.modalCustomizeItemPrice.html(this.selectedItem.price+" GP");

            /*  if(this.itemSelected && this.selectedItem.rarity > 0 && !this.account.unlinked){            
                 this.modalCustomizeItemSellInfo.css("display","");                        
             }
             else{
                 this.modalCustomizeItemSellInfo.css("display", "none");                        
             }
            */

            // Use the 2nd line on emotes to display the subcategory
            var emoteSubcatNames = {
                0: 'Locked',
                1: 'Faces',
                2: 'Food',
                3: 'Animals',
                4: 'Logos',
                5: 'Other',
                6: 'Flags',
                99: 'Default'
            };
            var localizedLore = selectedItem.loadoutType == 'emote' ? this.localization.translate('loadout-category') + ': ' + emoteSubcatNames[selectedItem.subcat] : this.selectedItem.displayLore;
            if (localizedLore && selectedItem.loadoutType != 'emote') {
                localizedLore = this.localization.translate('loadout-' + localizedLore.replace(/ /g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').toLowerCase());
            }
            localizedLore = localizedLore ? localizedLore : this.selectedItem.displayLore;

            var localizedDescription = '';
            if (selectedItem.loadoutType != 'emote') {
                localizedDescription = this.selectedItem.displayDescription;
                if (localizedDescription && selectedItem.loadoutType != 'emote') {
                    localizedDescription = this.localization.translate('loadout-' + localizedDescription.replace(/ /g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').toLowerCase());
                }
                localizedDescription = localizedDescription ? localizedDescription : this.selectedItem.displayDescription;
            }

            var itemDescription = localizedDescription ? localizedLore + '<br/>' + localizedDescription : localizedLore;
            //this.modalCustomizeItemLore.html(localizedLore);

            var rarityNames = ['stock', // 0
            'common', // 1
            'rare', // 2
            'epic', // 3
            'mythic', // 4
            'legend' // 5
            ];
            /*  let localizedRarity = this.localization.translate(
                 `loadout-${Rarities[this.selectedItem.rarity].name}`
             );
             this.modalCustomizeItemRarity.html(localizedRarity);
             this.modalCustomizeItemRarity.css({
                 'color': (Rarities[this.selectedItem.rarity].color)
             });
            */
            // Highlight all emote slots
            /*  if (this.selectedItem.loadoutType == 'emote') {
                 this.highlightedSlots.css({
                     display: 'block',
                     opacity: this.highlightOpacityMin
                 });
             } */

            // Highlight clicked item
            this.selectableSlots.removeClass('customize-list-item-selected');
            this.selectableSlots.removeAttr('style');
            if (isListItem) {
                selector.addClass('customize-list-item-selected');
                this.customizeListItemSelected = $('.customize-list-item-selected');
                //  this.customizeListItemSelected.css({border: `5px solid ${(Rarities[this.selectedItem.rarity].color)}`});
            } else {
                var hl = parent.find('.ui-emote-hl');
                hl.css('opacity', 1.0);
            }

            if (this.selectedItem.loadoutType == 'crosshair') {
                var objDef = GameObjectDefs[this.selectedItem.type];
                if (objDef && objDef.type == 'crosshair' && objDef.cursor) {
                    $('#modal-content-right-crosshair').css('display', 'none');
                } else {
                    $('#modal-content-right-crosshair').css('display', 'block');
                    this.picker.exit();
                    this.picker.enter();
                }
            }

            // Mark item as ackd
            var itemIdx = this.localAckItems.findIndex(function (x) {
                return x.id == _this8.selectedItem.id;
            });
            if (itemIdx !== -1) {
                selector.find('.account-alert').removeClass('account-alert account-alert-cat');
                this.localAckItems.splice(itemIdx, 1);
                //this.setCategoryAlerts();
            }
            if (this.itemSold) {
                // Save loadout
                this.updateLoadoutFromDOM();
                if (loadouts.modified(this.loadout, this.account.loadout) || loadouts.modified(this.loadoutIds, this.account.loadoutIds)) {
                    this.account.setLoadout(this.loadout, this.loadoutIds);
                }
            }
        }
    }, {
        key: 'updateSlot',
        value: function updateSlot(parent, img, type) {
            var prevParent = this.selectedItem.prevSlot;
            var id = this.selectedItem.id ? this.selectedItem.id : '0';
            this.selectedItem = {};
            if (prevParent) {
                var image = parent.find('.customize-item-image');
                var slotIdx = parent.data('idx');
                var slotItem = this.equippedItems[slotIdx];
                var slotItemType = '';
                if (slotItem.type) {
                    slotItemType = slotItem.type;
                }
                this.updateSlot(prevParent, image.data('img'), slotItemType);
            }

            this.updateSlotData(parent, img, type, id);
        }
    }, {
        key: 'deselectItem',
        value: function deselectItem() {
            this.itemSelected = false;
            this.selectedItem = {};
            this.selectableSlots.removeClass('customize-list-item-selected');
            this.selectableSlots.removeAttr('style');
            this.emoteRecycleBtn.hide();
            /* this.highlightedSlots.css({
                display: 'none',
                opacity: 0.0
            }); */

            //Don't show sell info
            //this.modalCustomizeItemSellInfo.css("display", "none");                    

            // Change the display texts
            //this.modalCustomizeItemName.html('');
            //this.modalCustomizeItemSource.html('');
            //this.modalCustomizeItemLore.html('');
            //this.modalCustomizeItemRarity.html('');
            //this.modalCustomizeItemPrice.html('');
        }
    }]);
    return LoadoutMenu;
}();

/*
//Constructor

//this.modalCustomizeItemRarity = $('#modal-customize-item-rarity');
        //this.modalCustomizeItemName = $('#modal-customize-item-name');
        //this.modalCustomizeItemLore = $('#modal-customize-item-lore');
        //this.modalCustomizeItemSource = $('#modal-customize-item-source');
        //this.modalCustomizeItemPrice = $('#modal-customize-item-price-value');     
        //this.modalCustomizeItemSellInfo = $('#modal-customize-item-sell-container');    
        //this.modalCustomizeUnlocks = $('#modal-customize-unlocks');  
        //this.modalCustomizeItemNameBoost = $('#modal-customize-item-name-boost');
        //Item stats
        this.modalCustomizeItemMakr = $('#loadout-item-makr');
        this.modalCustomizeItemKills = $('#loadout-item-kills');
        this.modalCustomizeItemLevels = $('#loadout-item-levels');
        this.modalCustomizeItemWins = $('#loadout-item-wins');


        selectItem(selector, deselect = true) {
            /*let isListItem = selector.hasClass('customize-list-item');
            let parent = isListItem ? selector : selector.parent();
            let image = parent.find('.customize-item-image');
            let selectorIdx = parent.data('idx');
            let selectedItem;
            if (parent.data('slot')) {
                selectedItem = this.equippedItems[selectorIdx];
            } else {
                selectedItem = this.selectedCatItems[selectorIdx];
            }
        
            if(!this.itemSold){
                if(selectorIdx == this.defaultIdx){
                    this.changeForDefault = false;
                }else{
                    this.changeForDefault = true;
                }
            }else{
                if(this.changeForDefault){
                    selectedItem = this.defaultItem;
                }
                else{
                    if (parent.data('slot')) {
                        selectedItem = this.equippedItems[0];
                    } else {
                        selectedItem = this.selectedCatItems[0];
                    }
                }
            }
        
            if (!selectedItem) {
                this.itemSelected = false;
                this.selectedItem = {
                    prevSlot: null,
                    img: '',
                    type: '',
                    id: '0'
                };
                return;
            }
        
            // Deselect this emote if it's already selected
            if (selectedItem.id == this.selectedItem.id &&
                selectedItem.type == this.selectedItem.type &&
                selectedItem.loadoutType == 'emote' &&
                this.selectedItem.loadoutType == 'emote' &&
                deselect) {
                this.deselectItem();
                return;
            }
        
            this.itemSelected = true;
        
            let lootBoxSource = LootBoxesDefs[selectedItem.displaySource];
            if(lootBoxSource){
                selectedItem.displaySource = lootBoxSource.name;
            }
        
            let selectedItemImg = image.data('img');
            if (!selectedItemImg) {
                selectedItemImg = image.find('span').data('img');
            }
            
            this.selectedItem = {
                prevSlot: isListItem ? null : parent,
                img: selectedItemImg,
                type: selectedItem.type,
                rarity: selectedItem.rarity,
                displayName: selectedItem.displayName || '',
                displaySource: selectedItem.displaySource || 'Unknown',
                source: selectedItem.source || '',
                displayLore: selectedItem.displayLore || '',
                displayDescription: selectedItem.displayDescription || '',
                loadoutType: selectedItem.loadoutType,
                subcat: selectedItem.subcat,
                price: selectedItem.price,
                id: selectedItem.id,
                stats: selectedItem.stats
            };
            
            // Change the display texts
            if(this.selectedItem.displayName) {
                let stringKey = `loadout-${this.selectedItem.displayName.replace(/ /g, '-').toLowerCase()}`;
                let itemName = this.localization.translate(stringKey);
                this.modalCustomizeItemName.html(itemName);
            }
            //Display item stats
            if(this.selectedItem.stats) {
                $('.item-stats-container').css('display','block');
                this.modalCustomizeItemMakr.html(this.selectedItem.stats.makr ? ' '+ this.selectedItem.stats.makr : ' Not defined');
                this.modalCustomizeItemKills.html(this.selectedItem.stats.kills ? ' '+ helpers.getAbbreviatedNumber3Digits(this.selectedItem.stats.kills) : ' 0');
                this.modalCustomizeItemLevels.html(this.selectedItem.stats.levels ? ' '+ helpers.getAbbreviatedNumber3Digits(this.selectedItem.stats.levels) : ' 0');
                this.modalCustomizeItemWins.html(this.selectedItem.stats.wins ? ' '+ helpers.getAbbreviatedNumber3Digits(this.selectedItem.stats.wins) : ' 0');
            }
            else{
                $('.item-stats-container').css('display','none');
                this.modalCustomizeItemMakr.html(' Not defined');
                this.modalCustomizeItemKills.html(' 0');
                this.modalCustomizeItemLevels.html(' 0');
                this.modalCustomizeItemWins.html(' 0');
            }
            //let source = this.localization.translate(`loadout-${selectedItem.displaySource}`) ||
                //this.localization.translate(`${selectedItem.displaySource}`) ||
                //this.selectedItem.displaySource;
            //let sourceTxt = `${this.localization.translate('loadout-acquired')}: ${source}`;
            //this.modalCustomizeItemSource.html(sourceTxt);
            //this.modalCustomizeItemPrice.html(this.selectedItem.price+" GP");
        
            if(this.itemSelected && this.selectedItem.rarity > 0 && !this.account.unlinked){            
                this.modalCustomizeItemSellInfo.css("display","");                        
            }
            else{
                this.modalCustomizeItemSellInfo.css("display", "none");                        
            }
        
        
            // Use the 2nd line on emotes to display the subcategory
            const emoteSubcatNames = {
                0 : 'Locked',
                1 : 'Faces',
                2 : 'Food',
                3 : 'Animals',
                4 : 'Logos',
                5 : 'Other',
                6 : 'Flags',
                99: 'Default'
            };
            let localizedLore = selectedItem.loadoutType == 'emote' ?
                this.localization.translate('loadout-category') + ': ' +
                emoteSubcatNames[selectedItem.subcat] :
                this.selectedItem.displayLore;
            if(localizedLore && selectedItem.loadoutType != 'emote') {
                localizedLore = this.localization.translate('loadout-' + localizedLore.replace(/ /g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').toLowerCase());
            }
            localizedLore = localizedLore ? localizedLore : this.selectedItem.displayLore;
        
           let localizedDescription = '';
            if (selectedItem.loadoutType != 'emote') {
                localizedDescription = this.selectedItem.displayDescription;
                if(localizedDescription && selectedItem.loadoutType != 'emote') {
                    localizedDescription = this.localization.translate('loadout-' + localizedDescription.replace(/ /g, '-').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').toLowerCase());
                }
                localizedDescription = localizedDescription ? localizedDescription : this.selectedItem.displayDescription;
            }
        
            let itemDescription =  localizedDescription ? (localizedLore + '<br/>' + localizedDescription) : localizedLore;
            //this.modalCustomizeItemLore.html(localizedLore);
        
            const rarityNames = [
                'stock',        // 0
                'common',       // 1
                'rare',         // 2
                'epic',         // 3
                'mythic',       // 4
                'legend'        // 5
            ];
            let localizedRarity = this.localization.translate(
                `loadout-${Rarities[this.selectedItem.rarity].name}`
            );
            this.modalCustomizeItemRarity.html(localizedRarity);
            this.modalCustomizeItemRarity.css({
                'color': (Rarities[this.selectedItem.rarity].color)
            });
        
            // Highlight all emote slots
            if (this.selectedItem.loadoutType == 'emote') {
                this.highlightedSlots.css({
                    display: 'block',
                    opacity: this.highlightOpacityMin
                });
            }
        
            // Highlight clicked item
            this.selectableSlots.removeClass('customize-list-item-selected');        
            this.selectableSlots.removeAttr( 'style' );
            if (isListItem) {
                selector.addClass('customize-list-item-selected');
                this.customizeListItemSelected = $('.customize-list-item-selected');
              //  this.customizeListItemSelected.css({border: `5px solid ${(Rarities[this.selectedItem.rarity].color)}`});
                
            } else {
                let hl = parent.find('.ui-emote-hl');
                hl.css('opacity', 1.0);
            }
        
            if (this.selectedItem.loadoutType == 'crosshair') {
                let objDef = GameObjectDefs[this.selectedItem.type];
                if (objDef && objDef.type == 'crosshair' && objDef.cursor) {
                    $('#modal-content-right-crosshair').css('display', 'none');
                } else {
                    $('#modal-content-right-crosshair').css('display', 'block');
                    this.picker.exit();
                    this.picker.enter();
                }
            }
        
            // Mark item as ackd
            let itemIdx = this.localAckItems.findIndex(x => (x.id == this.selectedItem.id));
            if (itemIdx !== -1) {
                selector.find('.account-alert').removeClass('account-alert account-alert-cat');
                this.localAckItems.splice(itemIdx, 1);
                this.setCategoryAlerts();
            }
            if(this.itemSold){
                // Save loadout
                this.updateLoadoutFromDOM();
                if (loadouts.modified(this.loadout, this.account.loadout) || loadouts.modified(this.loadoutIds, this.account.loadoutIds)) {
                    this.account.setLoadout(this.loadout, this.loadoutIds);
                }
            }
        }
        
        updateSlot(parent, img, type) {
            let prevParent = this.selectedItem.prevSlot;
            let id = this.selectedItem.id ? this.selectedItem.id : '0';
            this.selectedItem = {};
            if (prevParent) {
                let image = parent.find('.customize-item-image');
                let slotIdx = parent.data('idx');
                let slotItem = this.equippedItems[slotIdx];
                let slotItemType = '';
                if (slotItem.type) {
                    slotItemType = slotItem.type;
                }
                this.updateSlot(
                    prevParent,
                    image.data('img'),
                    slotItemType
                );
            }
        
            //this.updateSlotData(parent, img, type, id);
            
        }
        
        deselectItem() {
            this.itemSelected = false;
            //this.selectedItem = {};
            this.selectableSlots.removeClass('customize-list-item-selected');        
            this.selectableSlots.removeAttr( 'style' );
            this.highlightedSlots.css({
                display: 'none',
                opacity: 0.0
            });
        
            //Don't show sell info
            //this.modalCustomizeItemSellInfo.css("display", "none");                    
        
            // Change the display texts
            //this.modalCustomizeItemName.html('');
            //this.modalCustomizeItemSource.html('');
            //this.modalCustomizeItemLore.html('');
            //this.modalCustomizeItemRarity.html('');
            //this.modalCustomizeItemPrice.html('');
        }
        
        updateSlotData(parent, img, type, id) {
            let image = parent.find('.customize-emote-slot');
            image.css('background-image', img ? img : 'none');
            image.data('img', img ? img : 'none');
        
            const emoteDef = GameObjectDefs[type];
            let slotIdx = parent.data('idx');
            if (emoteDef) {
                let itemInfo = {
                    loadoutType: 'emote',
                    type: type,
                    rarity: emoteDef.rarity || 0,
                    displayName: emoteDef.name,
                    displayLore: emoteDef.lore,
                    subcat: emoteDef.category,
                    id: id
                };
                this.equippedItems[slotIdx] = itemInfo;
            } else {
                this.equippedItems[slotIdx] = {};
            }
        }
        
        ///web.archive.org/web/20211102160635/https://start
        select category ->
        
        let loadoutItems = [];
        
                
        
                if(category.gameType === 'heal_effect') {
                    loadoutItems = this.items.filter((x) => {
                        const gameTypeDef = GameObjectDefs[x.type];
                        return gameTypeDef && (gameTypeDef.type == 'heal_effect' || gameTypeDef.type == 'boost_effect');
                    });
                   $('#modal-customize-body').addClass('heal-tab');
                } else {
                    loadoutItems = this.items.filter((x) => {
                        const gameTypeDef = GameObjectDefs[x.type];
                        return gameTypeDef && gameTypeDef.type == category.gameType;
                    });
                    $('#modal-customize-body').removeClass('heal-tab');
        
                }
        
                loadoutItems = this.items.filter((x) => {
                    const gameTypeDef = GameObjectDefs[x.type];
                    return gameTypeDef && gameTypeDef.type == category.gameType;
                });
        
                // Sort items based on currently selected sort
                let displaySubcatSort = category.loadoutType == 'emote' || category.loadoutType == 'player_icon';
                $('#customize-sort-subcat').css(
                    'display', displaySubcatSort ? 'block' : 'none'
                );
                let sortType = 'newest';//this.itemSort.val();
                if (!displaySubcatSort && sortType == 'subcat') {
                    sortType = 'newest';
                    this.itemSort.val(sortType);
                }
        
                loadoutItems.sort(sortTypes[sortType]);
        
                // Always lock default fists 
                if (category.loadoutType === 'melee') {
                    this.lockMeleeItems(loadoutItems);
                }
                
                let displayEmoteWheel = category.loadoutType == 'emote';
                let displayCrosshairAdjust = category.loadoutType == 'crosshair';
                let draggable = category.loadoutType == 'emote';
        
                if (this.loadoutDisplay) {
                    this.loadoutDisplay.setView(category.loadoutType);
                } 
        
                //selector code
        
                let localizedTitle = this.localization.translate(
                    `loadout-title-${category.loadoutType}`
                ).toUpperCase();
                $('#modal-customize-cat-title').html(localizedTitle);
        
                $('#modal-content-right-crosshair').css(
                    'display', category.loadoutType == 'crosshair' ? 'block' : 'none'
                );
                $('#modal-content-right-emote').css(
                    'display', category.loadoutType == 'emote' ? 'block' : 'none'
                );
                $('#customize-emote-parent').css('display', displayEmoteWheel ? 'block' : 'none');
                $('#customize-crosshair-parent').css('display', displayCrosshairAdjust ? 'block' : 'none');
        
                //this.modalCustomizeItemName.html('');
                //this.modalCustomizeItemSource.html('');
                //this.modalCustomizeItemLore.html('');
                //this.modalCustomizeItemRarity.html('');
        
                let getItemSourceName = (source) => {
                    const sourceDef = GameObjectDefs[source];
                    return sourceDef && sourceDef.name ? sourceDef.name : source;
                };
        
                // Reset selectedCatItems
                this.selectedCatItems = [];
                let loadoutItemDiv = '';
        
                let listItems = $('<div/>');
                let listItemsBoost = $('<div/>');
                for (let i = 0; i < loadoutItems.length; i++) {
                    let item = loadoutItems[i];
                    const objDef = GameObjectDefs[item.type];
                    let itemId = item.id ? item.id : 0;
                    let priceList = GameObjectDefs['prices_1'];
                    let priceObj = priceList.rarities.find(o => o.rarity === objDef.rarity);
                    
                    let itemCategory = objDef.type == 'boost_effect' ? 'boost' : category.loadoutType;
        
                    let itemInfo = {
                        loadoutType: itemCategory,
                        type: item.type,
                        rarity: objDef.rarity || 0,
                        displayName: objDef.name,
                        displaySource: getItemSourceName(item.source),
                        source: item.source,
                        displayLore: objDef.lore,
                        displayDescription: objDef.description,
                        timeAcquired: item.timeAcquired,
                        price: priceObj.price,
                        idx: i,
                        subcat: objDef.category,
                        outerDiv: null,
                        id: itemId,
                        stats: item.stats
                    };
        
                    // Create div for emote customization list
                    let outerDiv = $('<div/>', {
                        class: 'customize-list-item customize-list-item-unlocked',
                        'data-idx': i
                    });
        
                    let svg = helpers.getSvgFromGameType(item.type);
                    let transform = helpers.getCssTransformFromGameType(item.type);
                    let innerDiv = '';
        
                    if(transform != 'rotate(0rad) scaleX(1)') 
                    {
                        innerDiv = $('<div/>', {
                            class: 'customize-item-image',
                            css: {
                                transform: 'rotate(0rad) scaleX(1)',
                                border: `2.86534px solid ${(Rarities[itemInfo.rarity].color)}`,
                                'background-color': `${(Rarities[itemInfo.rarity].backgroundColor)}`
                                
                            },
                            draggable: draggable
                        });
        
                        let innerDivSpan =  $('<span/>', {
                            class: 'customize-item-image',
                            css: {
                                'background-image': `url(${svg})`,
                                transform: transform,
                                'background-size': ''
                                
                            },
                            'data-img': `url(${svg})`,
                            draggable: draggable
                        });
        
        
                        innerDiv.append(innerDivSpan);
        
        
                    }
                    else {
                        innerDiv = $('<div/>', {
                            class: 'customize-item-image',
                            css: {
                                'background-image': `url(${svg})`,
                                transform: 'rotate(0rad) scaleX(1)',
                                'background-size': '',
                                border: `2.86534px solid ${(Rarities[itemInfo.rarity].color)}`,
                                'background-color': `${(Rarities[itemInfo.rarity].backgroundColor)}`
                                
                            },
                            'data-img': `url(${svg})`,
                            draggable: draggable
                        });
                    }
        
                    outerDiv.append(innerDiv);
        
                    //Item rarity icon
        
                    let itemRarity = $('<div>');
                    itemRarity.addClass('item-rarity-style');
                    itemRarity.css({'background-color': `${(Rarities[itemInfo.rarity].color)}`});
                    let itemRarityImage = $('<div>');
                    itemRarityImage.addClass('dark item-'+ category.loadoutType);
                    itemRarity.append(itemRarityImage);
        
                    innerDiv.append(itemRarity);
        
                    // Notification pulse
                    let ackItem = this.localAckItems.findIndex(x => (item.id && x.id == item.id)) !== -1;
                    if (ackItem) {
                        let alertDiv = $('<div/>', {
                            class: 'account-alert account-alert-cat',
                            css: {
                                display: 'block'
                            }
                        });
                        outerDiv.append(alertDiv);
                    }
        
                    // Crosshair specific styling
                    if (category.gameType == 'crosshair') {
                        // Change the pointer in this slot
                        let crosshairDef = {
                            type: itemInfo.type,
                            color: 0xffffff,
                            size: 1.0,
                            stroke: 0.0
                        };
                        crosshair.setElemCrosshair(outerDiv, crosshairDef);
                    }
        
                    listItems.append(outerDiv);
        
                    if (itemInfo.loadoutType === 'boost') {
                        listItemsBoost.append(outerDiv);
                    } else {
                        listItems.append(outerDiv);
                    }
                    
        
                    // Add the itemInfo to the currently selected items array
                    itemInfo.outerDiv = outerDiv;
                    this.selectedCatItems.push(itemInfo);
        
                    // Check if this is the equipped loadout item
                    if (!loadoutItemDiv) {
                        if (category.loadoutType == 'crosshair' &&
                            itemInfo.type == this.loadout.crosshair.type) {
                            loadoutItemDiv = itemInfo.outerDiv;
                        } else if (category.loadoutType != 'emote' &&
                                   itemInfo.type == this.loadout[category.loadoutType] &&
                                   itemInfo.id == this.loadoutIds[category.loadoutType]) {
                            loadoutItemDiv = itemInfo.outerDiv;
                        } else if (category.loadoutType == 'emote') {
                            // Do nothing for an emote?
                        }
                    }
                }
        
                // Set itemInfo for equipped emotes
                if (category.loadoutType == 'emote') {
                    if(this.sellingItem ){
                        this.sellingItem = false;
                    }else if(this.itemSold){
                        this.itemSold = false;
                    }
                    this.equippedItems = [];
                    for (let i = 0; i < this.loadout.emotes.length; i++) {
                        this.equippedItems.push({});
                        let emote = this.loadout.emotes[i];
                        let emoteId = this.loadoutIds.emotes[i] ? this.loadoutIds.emotes[i] : '0';
                        const emoteDef = GameObjectDefs[emote];
        
                        if (emoteDef) {
                            let svg = helpers.getSvgFromGameType(emote);
                            let imgCss = `url(${svg})`;
                            let domElem = emoteSlotToDomElem(i);
                            this.updateSlotData(domElem, imgCss, emote, emoteId);
                        }
                    }
                }
        
                // Jquery elems
                this.selectableSlots = $('.customize-list-item');
                this.droppableSlots = $('.customize-col');
                this.highlightedSlots = this.droppableSlots.siblings('.ui-emote-hl');
                this.highlightOpacityMin = 0.4;
                this.itemSelected = false;
        
                this.setItemListeners(category.loadoutType);
                this.setCategoryAlerts();
        
                // Select loadout item
                this.deselectItem();
                if (loadoutItemDiv != '') {
                    let isListItem = loadoutItemDiv.hasClass('customize-list-item');
                    let parent = isListItem ? loadoutItemDiv : loadoutItemDiv.parent();
                    this.defaultIdx = parent.data('idx');
                    this.selectItem(loadoutItemDiv);
                    if (category.loadoutType == 'crosshair') {
                        this.setSelectedCrosshair();
                    }
                    // Scroll to this div
                    //this.modalCustomizeItemName.click();
                }
        
                // Disable crosshair elements on Edge
                let edgeDetected = device.browser == 'edge';
                if (edgeDetected) {
                    if (category.loadoutType == 'crosshair') {
                        let disableElem = (parentElem, disableElem) => {
                            let height = parentElem.height() +
                            parseInt(parentElem.css('padding-top')) +
                            parseInt(parentElem.css('padding-bottom'));
                            disableElem.css('height', height);
                        };
                        disableElem($('#modal-customize-body'), $('#modal-content-left').find('.modal-disabled'));
                        disableElem($('#modal-content-right-crosshair'), $('#modal-content-right-crosshair').find('.modal-disabled'));
                        $('.modal-disabled').css('display', 'block');
                    } else {
                        $('.modal-disabled').css('display', 'none');
                    }
                }
                
                this.defaultItem = this.selectedItem;
                this.onResize();
        //end
        
        sortItems(sort) {
            this.selectedCatItems.sort(sortTypes[sort]);
            const category = this.categories[this.selectedCatIdx];*
            // Always lock default fists 
            if (category.loadoutType === 'melee') {
                this.lockMeleeItems(this.selectedCatItems);
            }
        
            let listChildren = $('<div/>');
            for (let i = 0; i < this.selectedCatItems.length; i++) {
                let itemInfo = this.selectedCatItems[i];
                itemInfo.outerDiv.data('idx', i);
                listChildren.append(itemInfo.outerDiv);
            }
        
            this.modalCustomizeList.html('');
            this.modalCustomizeList.append(listChildren);
        
            this.selectableSlots.off('mouseup');
            this.setItemListeners(category.loadoutType);
        }
*/


module.exports = LoadoutMenu;
