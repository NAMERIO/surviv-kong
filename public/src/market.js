"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var api = require("./api.js");
var device = require("./device.js");
var helpers = require("./helpers.js");
var MenuModal = require("./menuModal.js");
var survivLoading = require("./survivLoading.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var Rarities = require("./rarities.js");
var MarketConfig = require("./marketConfig.js");

//
// ajaxRequest
//
function ajaxRequest(url, data, cb) {
    if (typeof data == 'function') {
        cb = data;
        data = null;
    }

    var opts = {
        url: api.resolveUrl(url),
        type: 'POST',
        timeout: 10 * 1000,
        headers: {
            // Set a header to guard against CSRF attacks.
            //
            // JQuery does this automatically, however we'll add it here explicitly
            // so the intent is clear incase of refactoring in the future.
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    if (data) {
        opts.contentType = 'application/json; charset=utf-8';
        opts.data = (0, _stringify2.default)(data);
    }

    $.ajax(opts).done(function (res, status) {
        cb(null, res);
    }).fail(function (err) {
        cb(err);
    });
}
// ----------------------- Helpers & other functions -----------------------
function caretToEndOfText(element) {
    element.focus();
    document.execCommand('selectAll', false, null);
    document.getSelection().collapseToEnd();
}

function getTimeLeftOfItem(postedTime, boughtTime) {
    if (postedTime && boughtTime) {
        var expireTime = postedTime + MarketConfig.itemPostedDuration;
        var distance = expireTime - boughtTime;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
        var seconds = Math.floor(distance % (1000 * 60) / 1000);

        days = days < 10 ? '0' + days : days;
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        var result = days + ":" + hours + ":" + minutes + ":" + seconds;
        return result;
    } else return '';
}

function getTimeLeft(finishDate) {
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = finishDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
    var seconds = Math.floor(distance % (1000 * 60) / 1000);

    days = days < 10 ? '0' + days : days;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var displayTime = days + ":" + hours + ":" + minutes + ":" + seconds;

    return displayTime;
}

function itemSort(sortFn, isHighLow) {
    if (isHighLow) {
        return function (a, b) {
            return sortFn(b, a);
        };
    } else {
        return function (a, b) {
            return sortFn(a, b);
        };
    }
}

function sortAlphabetical(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    } else {
        return 0;
    }
}

function sortPrice(a, b) {
    if (a.price == b.price) {
        return sortAlphabetical(a, b);
    } else {
        return a.price - b.price;
    }
}

function sortMakr(a, b) {
    if (a.makr < b.makr) {
        return -1;
    } else if (a.makr > b.makr) {
        return 1;
    } else {
        return 0;
    }
}

function sortKills(a, b) {
    if (a.kills == b.kills) {
        return sortAlphabetical(a, b);
    } else {
        return a.kills - b.kills;
    }
}

function sortLevels(a, b) {
    if (a.levels == b.levels) {
        return sortAlphabetical(a, b);
    } else {
        return a.levels - b.levels;
    }
}

function sortWins(a, b) {
    if (a.wins == b.wins) {
        return sortAlphabetical(a, b);
    } else {
        return a.wins - b.wins;
    }
}

var sortTypes = {
    'item': itemSort(sortAlphabetical),
    'price': itemSort(sortPrice),
    'makr': itemSort(sortMakr),
    'kills': itemSort(sortKills),
    'levels': itemSort(sortLevels),
    'wins': itemSort(sortWins)
};

var sortTypesHighLow = {
    'item': itemSort(sortAlphabetical, true),
    'price': itemSort(sortPrice, true),
    'makr': itemSort(sortMakr, true),
    'kills': itemSort(sortKills, true),
    'levels': itemSort(sortLevels, true),
    'wins': itemSort(sortWins, true)
};

function updateTypeFilterUI(localization, listItems, selectedItem, id, lastId) {
    var localizedName = null;
    var localizationId = null;
    var selectedElement = selectedItem.find('#market-type-selected');

    if (id === 'all') {
        localizationId = 'market-all';
        selectedElement.removeAttr('style'); //Remove img
        selectedElement.removeClass('right-market-btn-img'); //Remove padding for img
    } else {
        var idLocalization = id.split('_')[0];
        localizationId = 'market-type-' + idLocalization;
    }

    localizedName = localization.translate(localizationId);

    //Change selected name
    selectedElement.attr('data-l10n', localizationId);
    selectedElement.html(localizedName);

    if (id !== 'all') {
        var img = id.split('_')[0];
        if (img === 'deathEffect') selectedElement.css('background-image', 'url(img/emotes/tombstone.svg)');else selectedElement.css('background-image', 'url(img/gui/loadout-' + img + '.svg)');

        if (lastId === 'all') //Add padding for img
            selectedElement.addClass('right-market-btn-img');
    }

    //Mark selected filter on list
    if (!lastId) {
        //If first time (loading default values) remove class from all the items on list
        listItems.find('div').removeClass('btn-darkened');
        selectedElement.removeClass('right-market-btn-img'); //Remove padding for img
        selectedElement.addClass('right-market-btn-img');
    } else listItems.find('#' + lastId).removeClass('btn-darkened');
    listItems.find('#' + id).addClass('btn-darkened');
}

function updateImgSelect(id, lastId) {
    var selectedElement = $('#market-type-select');
    if (id === 'all') {
        selectedElement.removeAttr('style'); //Remove img
        selectedElement.removeClass('market-mobile-filter-select-img'); //Remove padding for img
    } else {
        var img = id.split('_')[0];
        if (img === 'deathEffect') selectedElement.css('background-image', 'url(img/emotes/tombstone.svg)');else selectedElement.css('background-image', 'url(img/gui/loadout-' + img + '.svg)');

        if (!lastId || lastId === 'all') {
            //Add padding for img
            selectedElement.addClass('market-mobile-filter-select-img'); //Remove padding for img
        }
    }
}

function updateRarityFilterUI(localization, listItems, selectedItem, id, lastId) {
    var localizedName = null;
    var localizationId = null;
    var selectedElement = selectedItem.find('#market-rarity-selected');

    changeFilterRarityColor(id);

    if (id === 'all') {
        localizationId = 'market-all';
    } else localizationId = 'loadout-' + Rarities[id].name;

    localizedName = localization.translate(localizationId);

    //Change selected name
    selectedElement.attr('data-l10n', localizationId);
    selectedElement.html(localizedName);

    //Mark selected filter on list
    if (!lastId) //If first time (loading default values) remove class from all the items on list
        listItems.find('div').removeClass('btn-darkened');else listItems.find('#' + lastId).removeClass('btn-darkened');
    listItems.find('#' + id).addClass('btn-darkened');
}

function changeFilterRarityColor(id) {
    if (id === 'all') {
        if (!device.mobile) $('#market-change-rarity').removeAttr('style'); //Remove rarity color
        else $('#market-rarity-select-container').removeAttr('style'); //Remove rarity color
    }

    if (id !== 'all') {
        if (!device.mobile) $('#market-change-rarity').css('background-color', Rarities[id].color);else $('#market-rarity-select-container').css('background-color', Rarities[id].color);
    }
}

function updateSortFilterUI(localization, listItems, selectedItem, id, lastId) {
    var localizedName = null;
    var localizationId = null;
    var selectedElement = selectedItem.find('#market-sort-selected');

    localizationId = 'market-sort-' + id;
    localizedName = localization.translate(localizationId);

    //Change selected name
    selectedElement.attr('data-l10n', localizationId);
    selectedElement.html(localizedName);

    //Mark selected filter on list
    if (!lastId) //If first time (loading default values) remove class from all the items on list
        listItems.find('div').removeClass('btn-darkened');else listItems.find('#' + lastId).removeClass('btn-darkened');
    listItems.find('#' + id).addClass('btn-darkened');
}

function updateModeFilterUI(localization, listItems, selectedItem, id, lastId) {
    var localizedName = null;
    var localizationId = null;
    var selectedElement = selectedItem.find('#market-mode-selected');

    localizationId = 'market-mode-' + id;
    localizedName = localization.translate(localizationId);

    //Change selected name
    selectedElement.attr('data-l10n', localizationId);
    selectedElement.html(localizedName);

    //Mark selected filter on list
    if (!lastId) //If first time (loading default values) remove class from all the items on list
        listItems.find('div').removeClass('btn-darkened');else listItems.find('#' + lastId).removeClass('btn-darkened');
    listItems.find('#' + id).addClass('btn-darkened');
}

// ----------------------- Market code -----------------------
function Market(account, localization, analytics, iap) {
    this.account = account;
    this.localization = localization;
    this.analytics = analytics;
    this.iap = iap;

    //Local Data
    this.localUserItemsToSell = [];
    this.localSortedItems = [];
    this.itemDataToSell = { id: 0, price: 0, type: '', rarity: 0, item: '' };
    this.itemDataToBuy = { id: 0, price: 0, itemId: 0, timePosted: 0 };
    this.timersToClear = [];
    this.unlockTime = null;
    this.unlockTimer = null;

    //Market notifications
    this.marketNotifications = [];
    this.needToUpdateNotificationState = false;
    this.marketModalNotification = new MenuModal($('#market-modal-notification'));

    //Flags
    this.isOnBuyTab = true;
    this.isSearchOnCooldown = false;
    this.defaultTabSearch = false;

    //List of items
    this.marketItemsList = $('#market-items-list');

    //Filters
    this.searchFilters = { type: 'outfit', rarity: '5', sort: 'price', mode: 'highlow' }; //Default values
    this.lastSearchFilters = { type: 'outfit', rarity: '5', sort: 'price', mode: 'highlow' }; //Default values

    //Type filter
    this.btnChangeType = device.mobile ? $('#market-type-select-container') : $('#market-change-type');
    this.btnChangeTypeSelection = $('#market-change-type-selection');
    this.typeOptions = this.btnChangeType.find('#market-type-select');

    //Rarity filter
    this.btnChangeRarity = device.mobile ? $('#market-rarity-select-container') : $('#market-change-rarity');
    this.btnChangeRaritySelection = $('#market-change-rarity-selection');
    this.rarityOptions = this.btnChangeRarity.find('#market-rarity-select');

    //Sort by
    this.btnChangeSort = device.mobile ? $('#market-sort-select-container') : $('#market-change-sort');
    this.btnChangeSortSelection = $('#market-change-sort-selection');
    this.sortOptions = this.btnChangeSort.find('#market-sort-select');

    //Mode
    this.btnChangeMode = device.mobile ? $('#market-mode-select-container') : $('#market-change-mode');
    this.btnChangeModeSelection = $('#market-change-mode-selection');
    this.modeOptions = this.btnChangeMode.find('#market-mode-select');

    //Error modal
    this.errorModal = new MenuModal($('#market-modal-error'));
}

Market.prototype = {
    init: function init() {
        var _this = this;

        //Init store tabs
        $("#tab-market-buy").on('click', function () {
            if (!_this.account.unlinked) {
                _this.showBuyTab();
            } else {
                _this.analytics.navActionsEvent('Market Buy', 'Login popup showed', 'Enter Buy - Anonymous User', '');
            }
        });

        $("#tab-market-sell").on('click', function () {
            if (!_this.account.unlinked) {
                _this.showSellTab();
            } else {
                _this.analytics.navActionsEvent('Market Sell', 'Login popup showed', 'Enter Sell - Anonymous User', '');
            }
        });

        $("#tab-shop").on('click', function () {
            if (!_this.account.unlinked) {
                _this.showIAPTab();
            }
        });

        //Init market filters
        this.initMarketDropdownFilters();

        //Init market search buttons
        $('#market-btn-search-items').on('click', function () {
            if (!_this.account.unlinked) {
                _this.searchItems();
            }
        });

        //Init market input GP to sell
        var inputItemPrice = $('#market-input-price');
        inputItemPrice.on("input", function () {
            var itemPrice = inputItemPrice.text().match(/[0-9]*/);
            inputItemPrice.text(itemPrice);
            caretToEndOfText(inputItemPrice); //Put cursor at the end of string after replacing it

            if (itemPrice >= Rarities[_this.itemDataToSell.rarity].marketPrice && itemPrice % 1 == 0 && itemPrice < MarketConfig.maximunPriceSell) {
                $('#market-modal-confirm-sell-item').removeClass('market-btn-disabled');
                $('#market-modal-btn-sell').html(_this.localization.translate('market-sell-item'));
                $('#market-modal-btn-sell').removeAttr('style');
            } else {
                $('#market-modal-confirm-sell-item').addClass('market-btn-disabled');
                $('#market-modal-btn-sell').css('color', 'red');
                if (itemPrice < Rarities[_this.itemDataToSell.rarity].marketPrice || itemPrice % 1 != 0) $('#market-modal-btn-sell').html(_this.localization.translate('market-modal-min-price') + ' ' + Rarities[_this.itemDataToSell.rarity].marketPrice);else $('#market-modal-btn-sell').html(_this.localization.translate('market-modal-max-price'));
            }
        });

        //Init placeholder text on sell modal
        $('#market-input-price').attr('placeholder', this.localization.translate('market-input-price-placeholder'));

        //Init btn to sell item (modal)
        $('#market-modal-confirm-sell-item').on('click', function () {
            var itemPrice = $('#market-input-price').text();
            _this.itemDataToSell.price = itemPrice;
            var result = 'Price: ' + _this.itemDataToSell.price + ', Time left: 00:24:00:00';
            _this.analytics.navActionsEvent('Market Sell', result, 'Confirm Listing', _this.itemDataToSell.id);
            _this.addItemToMarket();
        });

        //Init btn to buy item (modal)
        $('#market-modal-confirm-buy-item').on('click', function () {
            var result = 'Price: ' + _this.itemDataToBuy.price + ', Time left: ' + getTimeLeft(_this.itemDataToBuy.timePosted + MarketConfig.itemPostedDuration);
            _this.analytics.navActionsEvent('Market Buy', result, 'Confirm Buy', _this.itemDataToBuy.itemId);
            _this.buyMarketItem();
        });

        //Init notifications behaviour
        var confirmNextNewNotification = function confirmNextNewNotification() {
            setTimeout(function () {
                /*if(this.confirmAll){
                    this.clearConfirmItemModal();
                    this.confirmAll=false;
                }*/
                _this.showNextNotification();
            }, 100);
        };
        this.marketModalNotification.onHide(confirmNextNewNotification);

        this.account.addEventListener('openMarket', this.openMarketBuyWithSearchParams.bind(this));
        this.account.addEventListener('expireMarketItemsTest', this.expireMyItems.bind(this));
    },

    openMarketBuyWithSearchParams: function openMarketBuyWithSearchParams(searchParameters) {
        //Set search parameters
        this.lastSearchFilters = searchParameters;
        this.searchFilters = searchParameters;

        //Show buy tab with set parameters
        this.showBuyTab(false);
    },

    loadMarketAvailableItems: function loadMarketAvailableItems() {
        var _this2 = this;

        survivLoading.showSurvivLoading();
        var data = {
            userId: this.account.profile.userID,
            type: this.searchFilters.type,
            rarity: this.searchFilters.rarity
        };

        ajaxRequest('/api/user/market/get_market_available_items', data, function (err, res) {
            if (err) {
                console.log("Error trying get market items");
                _this2.showError();
                _this2.showNoItemAvailable();
            } else if (res && res.success) {
                _this2.localSortedItems = res.items; //This receive the items already filtered
                _this2.searchItemsWithFilters(true);
            } else {
                _this2.showNoItemAvailable();
            }
        });
    },

    loadUserAvailableItemsToSell: function loadUserAvailableItemsToSell() {
        var _this3 = this;

        survivLoading.showSurvivLoading();
        var data = {
            userId: this.account.profile.userID
        };

        ajaxRequest('/api/user/market/get_items_to_sell', function (err, res) {
            if (err) {
                console.log("Error trying get sell items");
                _this3.showError();
                _this3.showNoItemAvailable();
            } else if (res && res.success) {
                _this3.localUserItemsToSell = res.items;
                _this3.searchItemsWithFilters();
            } else {
                _this3.showNoItemAvailable();
            }
        });
    },

    searchItemsWithFilters: function searchItemsWithFilters() {
        var areItemsJustReceived = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var flagShowItems = false;
        if (this.isOnBuyTab) {
            //Get items to buy with selected filters
            if (!areItemsJustReceived) {
                this.loadMarketAvailableItems(); //Get lastest market items filtered
            } else {
                //Sort user filtered items
                this.sortLocalItems();
                flagShowItems = true;
            }
        } else {
            //Filter user items to sell
            this.localSortedItems = [];

            //Filter user items
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.localUserItemsToSell), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    if ((this.searchFilters.type === 'all' || this.searchFilters.type === item.type) && (this.searchFilters.rarity === 'all' || this.searchFilters.rarity == item.rarity)) this.localSortedItems.push(item);
                }

                //Sort user filtered items
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

            this.sortLocalItems();
            flagShowItems = true;
        }

        if (flagShowItems) {
            this.lastSearchFilters = (0, _assign2.default)({}, this.searchFilters);
            this.showItemsOnUI();
        }
    },

    sortLocalItems: function sortLocalItems() {
        if (this.searchFilters.mode === 'highlow') this.localSortedItems.sort(sortTypesHighLow[this.searchFilters.sort]);else this.localSortedItems.sort(sortTypes[this.searchFilters.sort]);
    },

    addItemToMarket: function addItemToMarket() {
        var _this4 = this;

        survivLoading.showSurvivLoading();
        var itemData = {
            id: this.itemDataToSell.id,
            userId: this.account.profile.userID,
            price: this.itemDataToSell.price,
            type: this.itemDataToSell.type,
            rarity: this.itemDataToSell.rarity
        };
        var itemId = this.itemDataToSell.item;
        $('#market-input-price').text(''); //Clean input
        if (itemData.price >= Rarities[itemData.rarity].marketPrice && itemData.price % 1 == 0 && itemData.price < MarketConfig.maximunPriceSell) {
            ajaxRequest('/api/user/market/add_item_to_market', itemData, function (err, res) {
                if (err) {
                    console.log("Error trying to add item to market");
                    _this4.showError();
                    survivLoading.hideSurvivLoading();
                } else if (res && res.success) {
                    _this4.analytics.economyTransactions("Market Post", 0, 0, itemId, itemData.price, res.id);
                    survivLoading.hideSurvivLoading();
                    _this4.account.loadProfile();
                    _this4.loadUserAvailableItemsToSell();
                } else {
                    var errorLocalizationId = res.error ? res.error : '';
                    _this4.showError(errorLocalizationId);
                    survivLoading.hideSurvivLoading();
                }
            });
        } else {
            this.showError();
            survivLoading.hideSurvivLoading();
        }

        this.itemDataToSell = { id: 0, price: 0, type: '', rarity: 0, item: '' };
    },

    buyMarketItem: function buyMarketItem() {
        var _this5 = this;

        survivLoading.showSurvivLoading();

        var itemData = {
            marketId: this.itemDataToBuy.id,
            userId: this.account.profile.userID
        };

        if (this.itemDataToBuy.price !== 0 && this.itemDataToBuy.price <= this.account.profile.gpTotal) {
            ajaxRequest('/api/user/market/buy_market_item', itemData, function (err, res) {
                if (err) {
                    console.log("Error trying to buy item from market");
                    _this5.showError();
                    survivLoading.hideSurvivLoading();
                } else if (res && res.success) {
                    if (res.data && res.data.sold) {
                        _this5.marketNotifications = (0, _assign2.default)([], [res.data]);
                        _this5.needToUpdateNotificationState = true;
                        _this5.showNextNotification([res.data]);
                        _this5.account.loadProfile(true);
                    } else {
                        _this5.showError();
                    }

                    survivLoading.hideSurvivLoading();
                    _this5.loadMarketAvailableItems();
                } else {
                    var errorLocalizationId = res.error;
                    _this5.showError(errorLocalizationId);
                    survivLoading.hideSurvivLoading();
                    _this5.loadMarketAvailableItems();
                }
            });
        } else {
            var neededGP = this.itemDataToBuy.price - this.account.profile.gpTotal;
            if (neededGP && neededGP > 0) {
                this.iap.showContextualOffer(neededGP, { window: 'market', searchParameters: this.searchFilters });
            } else {
                this.showError('market-error-buy-gp');
            }
            survivLoading.hideSurvivLoading();
        }

        this.itemDataToBuy = { id: 0, price: 0, itemId: 0, timePosted: 0 };
    },

    searchItems: function searchItems() {
        var _this6 = this;

        if (!this.isSearchOnCooldown) {
            this.isSearchOnCooldown = true;
            survivLoading.showSurvivLoading();
            this.searchItemsWithFilters();

            var coolDown = this.isOnBuyTab ? MarketConfig.searchCooldownBuy : MarketConfig.searchCooldownSell;
            if (coolDown) {
                $('#market-btn-search-items').addClass('market-btn-disabled');
                $('#market-search-cooldown-timer').text(coolDown / 1000 + "s");
                var endDate = new Date().getTime() + coolDown;
                var searchCooldownInterval = setInterval(function () {
                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = endDate - now;
                    var seconds = Math.floor(distance % (1000 * 60) / 1000);

                    $('#market-search-cooldown-timer').text(seconds + "s");

                    // If the count down is finished, write some text
                    if (distance < 0) {
                        clearInterval(searchCooldownInterval);
                        $('.market-cooldown-timer-text').css('display', 'none');
                        $('#market-btn-search-items').removeClass('market-btn-disabled');
                        _this6.isSearchOnCooldown = false;
                    }
                }, 1000);

                $('.market-cooldown-timer-text').css('display', 'block');
            } else {
                this.isSearchOnCooldown = false;
            }
        }
    },

    getMarketNotification: function getMarketNotification() {
        var _this7 = this;

        var data = {
            userId: this.account.profile.userID
        };
        ajaxRequest('/api/user/market/get_market_notifications', data, function (err, res) {
            if (err) {
                console.log("Error trying to get market notifications");
                //this.showError();
            } else if (res && res.success) {
                _this7.marketNotifications = (0, _assign2.default)([], res.notificationsList);
                _this7.needToUpdateNotificationState = true;
                _this7.showNextNotification(res.notificationsList, true);
            }
        });
    },

    updateNotificationState: function updateNotificationState(notificationList, isPageLoad) {
        var data = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(notificationList), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var notification = _step2.value;

                data.push({ id: notification.id, isSeller: notification.seller_notification ? '1' : '0' });
                if (notification.seller_notification) {
                    if (notification.sold) {
                        this.analytics.economyTransactions("Market Sell", parseInt(notification.price * MarketConfig.inversePostingFee), 0, notification.item, getTimeLeftOfItem(notification.time_posted, notification.time_bought), notification.id, false, !isPageLoad);
                    } else {
                        this.analytics.economyTransactions("Market Return", 0, 0, notification.item, notification.price, notification.id);
                    }
                } else {
                    this.analytics.economyTransactions("Market Buy", parseInt('-' + notification.price), 0, notification.item, getTimeLeftOfItem(notification.time_posted, notification.time_bought), notification.id, false, !isPageLoad);
                }
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

        ajaxRequest('/api/user/market/confirm_market_notifications', data, function (err, res) {});
    },

    isMarketLocked: function isMarketLocked() {
        if (!this.unlockTime) {
            this.unlockTime = new Date(this.account.profile.userCreated).getTime() + MarketConfig.unlockTime;
        }
        var timeDistance = this.unlockTime - new Date().getTime();

        if (timeDistance > 0) {
            return true;
        }
        return false;
    },

    sendNavSearchEvent: function sendNavSearchEvent() {
        var countNotExpiredItems = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var rarity = this.searchFilters.rarity === 'all' ? this.searchFilters.rarity : Rarities[this.searchFilters.rarity].name;
        var currentFilters = 'type: ' + this.searchFilters.type + ', rarity: ' + rarity + ', sort: ' + this.searchFilters.sort + ', mode: ' + this.searchFilters.mode;
        var result = 'Filters: {' + currentFilters + '}, Items returned: ' + countNotExpiredItems;

        if (this.defaultTabSearch) {
            if (this.isOnBuyTab) this.analytics.navActionsEvent('Market Buy', result, 'Enter Buy', '');else this.analytics.navActionsEvent('Market Sell', result, 'Enter Sell', '');
            this.defaultTabSearch = false;
        } else {
            if (this.isOnBuyTab) this.analytics.navActionsEvent('Market Buy', result, 'Search', '');else this.analytics.navActionsEvent('Market Sell', result, 'Search', '');
        }
    },

    //Test function
    expireMyItems: function expireMyItems() {
        var data = {
            userId: this.account.profile.userID
        };
        ajaxRequest('/api/user/market/test_expire_my_items', data, function (err, res) {});
    },
    //*/

    // -------------------------------- UI related functions --------------------------------
    showBuyTab: function showBuyTab() {
        var resetFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        if (this.unlockTimer) {
            this.clearTimer(this.unlockTimer);
        }

        this.isOnBuyTab = true;
        if (!this.isMarketLocked()) {
            this.defaultTabSearch = true;
            if (resetFilters) {
                this.searchFilters = { type: 'outfit', rarity: '5', sort: 'price', mode: 'highlow' }; //Default values
                this.lastSearchFilters = { type: 'outfit', rarity: '5', sort: 'price', mode: 'highlow' }; //Default values
            }
            this.loadDefaultFiltersToUI();

            this.loadMarketAvailableItems();

            this.marketItemsList.html('');
            $('#market-btn-search-items').html(this.localization.translate('market-search-market'));
            $('.market-container').css('display', 'flex');
            $('.market-locked-container').css('display', 'none');
        } else {
            this.showLockedMarket();
        }

        $('.iap-container').css('display', 'none');
        $('#tab-shop').removeClass('store-tab-selected');
        $('#tab-market-buy').addClass('store-tab-selected');
        $('#tab-market-sell').removeClass('store-tab-selected');
    },

    showSellTab: function showSellTab() {
        if (this.unlockTimer) {
            this.clearTimer(this.unlockTimer);
        }

        this.isOnBuyTab = false;
        if (!this.isMarketLocked()) {
            this.defaultTabSearch = true;
            this.searchFilters = { type: 'outfit', rarity: '5', sort: 'price', mode: 'highlow' }; //Default values
            this.lastSearchFilters = { type: 'outfit', rarity: '5', sort: 'price', mode: 'highlow' }; //Default values
            this.loadDefaultFiltersToUI();

            this.loadUserAvailableItemsToSell();

            this.marketItemsList.html('');
            $('#market-btn-search-items').html(this.localization.translate('market-search-loadout'));
            $('.market-container').css('display', 'flex');

            $('.market-locked-container').css('display', 'none');
        } else {
            this.showLockedMarket();
        }

        $('.iap-container').css('display', 'none');
        $('#tab-shop').removeClass('store-tab-selected');
        $('#tab-market-buy').removeClass('store-tab-selected');
        $('#tab-market-sell').addClass('store-tab-selected');
    },

    showLockedMarket: function showLockedMarket() {
        var _this8 = this;

        $('.market-container').css('display', 'none');
        $('.market-locked-container').css('display', 'flex');

        var timeLeftToUnlock = 'Locked Time Left: ' + getTimeLeft(this.unlockTime);
        if (this.isOnBuyTab) this.analytics.navActionsEvent('Market Buy', timeLeftToUnlock, 'Enter Buy - Market Locked', '');else this.analytics.navActionsEvent('Market sell', timeLeftToUnlock, 'Enter Sell - Market Locked', '');

        this.unlockTimer = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = _this8.unlockTime - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
            var seconds = Math.floor(distance % (1000 * 60) / 1000);

            days = days < 10 ? '0' + days : days;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            var displayTime = days + ":" + hours + ":" + minutes + ":" + seconds;

            $('#market-unlocks-timer').text(displayTime);

            // If the count down is finished, write some text
            if (distance < 0) {
                _this8.clearTimer(_this8);
                $('#market-unlocks-timer').text(_this8.localization.translate('market-unlocked'));
            }
        }, 1000);
    },


    showIAPTab: function showIAPTab() {
        $('.market-container').css('display', 'none');
        $('.market-locked-container').css('display', 'none');
        $('.iap-container').css('display', 'flex');
        $('#tab-shop').addClass('store-tab-selected');
        $('#tab-market-buy').removeClass('store-tab-selected');
        $('#tab-market-sell').removeClass('store-tab-selected');
    },

    loadDefaultFiltersToUI: function loadDefaultFiltersToUI() {
        if (!device.mobile) {
            updateTypeFilterUI(this.localization, this.btnChangeTypeSelection, this.btnChangeType, this.searchFilters.type);
            updateSortFilterUI(this.localization, this.btnChangeSortSelection, this.btnChangeSort, this.searchFilters.sort);
            updateModeFilterUI(this.localization, this.btnChangeModeSelection, this.btnChangeMode, this.searchFilters.mode);
            updateRarityFilterUI(this.localization, this.btnChangeRaritySelection, this.btnChangeRarity, this.searchFilters.rarity);
        } else {
            changeFilterRarityColor(this.searchFilters.rarity);
            updateImgSelect(this.searchFilters.type);

            $('#market-type-select').val(this.searchFilters.type).change();
            $('#market-rarity-select').val(this.searchFilters.rarity).change();
            $('#market-sort-select').val(this.searchFilters.sort).change();
            $('#market-mode-select').val(this.searchFilters.mode).change();
        }
    },

    initMarketDropdownFilters: function initMarketDropdownFilters() {
        var _this9 = this;

        if (!device.mobile) {
            //Desktop init
            $(document).on('click', function (e) {
                _this9.hideAllDropDowns();
            });

            $('.iap-screen').on('click', function (e) {
                _this9.hideAllDropDowns();
            });

            //Type filter init
            this.btnChangeType.on('click', function (e) {
                e.stopPropagation();
                _this9.hideAllDropDowns('type');
                if (_this9.btnChangeTypeSelection.is(':visible')) {
                    _this9.btnChangeTypeSelection.css('display', 'none');
                    _this9.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                    _this9.btnChangeType.find('.btn-divider').removeAttr('style');
                } else {
                    _this9.btnChangeTypeSelection.css('display', 'block');
                    _this9.btnChangeType.find('.index-dropdown-arrow').css('display', 'none');
                    _this9.btnChangeType.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                }
            });

            this.btnChangeTypeSelection.on('click', '.right-market-btn', function (e) {
                var btnId = $(e.target).attr('id');
                if (!device.mobile) {
                    _this9.updateTypeFilter(btnId);
                }
            });

            //Rarity filter init
            this.btnChangeRarity.on('click', function (e) {
                e.stopPropagation();
                _this9.hideAllDropDowns('rarity');
                if (_this9.btnChangeRaritySelection.is(':visible')) {
                    _this9.btnChangeRaritySelection.css('display', 'none');
                    _this9.btnChangeRarity.find('.index-dropdown-arrow').css('display', 'block');
                    _this9.btnChangeRarity.find('.btn-divider').removeAttr('style');
                } else {
                    _this9.btnChangeRaritySelection.css('display', 'block');
                    _this9.btnChangeRarity.find('.index-dropdown-arrow').css('display', 'none');
                    _this9.btnChangeRarity.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                }
            });

            this.btnChangeRaritySelection.on('click', '.right-market-btn', function (e) {
                var btnId = $(e.target).attr('id');
                if (!device.mobile) {
                    _this9.updateRarityFilter(btnId);
                }
            });

            //Sort by filter init
            this.btnChangeSort.on('click', function (e) {
                e.stopPropagation();
                _this9.hideAllDropDowns('sort');
                if (_this9.btnChangeSortSelection.is(':visible')) {
                    _this9.btnChangeSortSelection.css('display', 'none');
                    _this9.btnChangeSort.find('.index-dropdown-arrow').css('display', 'block');
                    _this9.btnChangeSort.find('.btn-divider').removeAttr('style');
                } else {
                    _this9.btnChangeSortSelection.css('display', 'block');
                    _this9.btnChangeSort.find('.index-dropdown-arrow').css('display', 'none');
                    _this9.btnChangeSort.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                }
            });

            this.btnChangeSortSelection.on('click', '.right-market-btn', function (e) {
                var btnId = $(e.target).attr('id');
                if (!device.mobile) {
                    _this9.updateSortFilter(btnId);
                }
            });

            //Mode filter init
            this.btnChangeMode.on('click', function (e) {
                e.stopPropagation();
                _this9.hideAllDropDowns('mode');
                if (_this9.btnChangeModeSelection.is(':visible')) {
                    _this9.btnChangeModeSelection.css('display', 'none');
                    _this9.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
                    _this9.btnChangeMode.find('.btn-divider').removeAttr('style');
                } else {
                    _this9.btnChangeModeSelection.css('display', 'block');
                    _this9.btnChangeMode.find('.index-dropdown-arrow').css('display', 'none');
                    _this9.btnChangeMode.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                }
            });

            this.btnChangeModeSelection.on('click', '.right-market-btn', function (e) {
                var btnId = $(e.target).attr('id');
                if (!device.mobile) {
                    _this9.updateModeFilter(btnId);
                }
            });
        } else {
            //Mobile init
            //Type filter init
            this.typeOptions.change(function (e) {
                var seletedValue = _this9.typeOptions.find(":selected").val();
                _this9.updateTypeFilter(seletedValue);
            });

            //Rarity filter init
            this.rarityOptions.change(function (e) {
                var seletedValue = _this9.rarityOptions.find(":selected").val();
                _this9.updateRarityFilter(seletedValue);
            });

            //Sort filter init
            this.sortOptions.change(function (e) {
                var seletedValue = _this9.sortOptions.find(":selected").val();
                _this9.updateSortFilter(seletedValue);
            });

            //Mode filter init
            this.modeOptions.change(function (e) {
                var seletedValue = _this9.modeOptions.find(":selected").val();
                _this9.updateModeFilter(seletedValue);
            });
        }
    },

    hideAllDropDowns: function hideAllDropDowns() {
        var notHide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (notHide != 'type') {
            this.btnChangeTypeSelection.css('display', 'none');
            this.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
            this.btnChangeType.find('.btn-divider').removeAttr('style');
        }

        if (notHide != 'rarity') {
            this.btnChangeRaritySelection.css('display', 'none');
            this.btnChangeRarity.find('.index-dropdown-arrow').css('display', 'block');
            this.btnChangeRarity.find('.btn-divider').removeAttr('style');
        }

        if (notHide != 'sort') {
            this.btnChangeSortSelection.css('display', 'none');
            this.btnChangeSort.find('.index-dropdown-arrow').css('display', 'block');
            this.btnChangeSort.find('.btn-divider').removeAttr('style');
        }

        if (notHide != 'mode') {
            this.btnChangeModeSelection.css('display', 'none');
            this.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
            this.btnChangeMode.find('.btn-divider').removeAttr('style');
        }
    },

    updateTypeFilter: function updateTypeFilter(newValue) {
        if (!device.mobile) {
            updateTypeFilterUI(this.localization, this.btnChangeTypeSelection, this.btnChangeType, newValue, this.searchFilters.type);
        } else {
            updateImgSelect(newValue, this.searchFilters.type);
        }
        this.searchFilters.type = newValue;
    },

    updateRarityFilter: function updateRarityFilter(newValue) {
        if (!device.mobile) {
            updateRarityFilterUI(this.localization, this.btnChangeRaritySelection, this.btnChangeRarity, newValue, this.searchFilters.rarity);
        } else {
            changeFilterRarityColor(newValue);
        }
        this.searchFilters.rarity = newValue;
    },

    updateSortFilter: function updateSortFilter(newValue) {
        if (!device.mobile) {
            updateSortFilterUI(this.localization, this.btnChangeSortSelection, this.btnChangeSort, newValue, this.searchFilters.sort);
        }
        this.searchFilters.sort = newValue;
    },

    updateModeFilter: function updateModeFilter(newValue) {
        if (!device.mobile) {
            updateModeFilterUI(this.localization, this.btnChangeModeSelection, this.btnChangeMode, newValue, this.searchFilters.mode);
        }
        this.searchFilters.mode = newValue;
    },

    showNoItemAvailable: function showNoItemAvailable() {
        this.sendNavSearchEvent();
        var txtNoItems = 'No Items Available';
        if (this.isOnBuyTab) txtNoItems = this.localization.translate('market-no-items-available-buy');else txtNoItems = this.localization.translate('market-no-items-available-sell');

        $('#market-no-items-text').html(txtNoItems);

        $('#market-no-items-available').css('display', 'block');
        this.marketItemsList.css('display', 'none');

        survivLoading.hideSurvivLoading();
    },
    clearTimer: function clearTimer(idx) {
        var timer = this.timersToClear.splice(idx, 1)[0];
        clearInterval(timer);
    },
    clearAllTimers: function clearAllTimers() {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = (0, _getIterator3.default)(this.timersToClear), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var timer = _step3.value;

                clearInterval(timer);
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

        this.timersToClear = [];
    },


    showItemsOnUI: function showItemsOnUI() {
        var _this10 = this;

        this.clearAllTimers();
        $('#market-no-items-available').css('display', 'none');
        this.marketItemsList.css('display', 'block');
        this.marketItemsList.html('');
        var itemContent = '';
        var idx = 0;
        var countNotExpiredItems = 0;

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = (0, _getIterator3.default)(this.localSortedItems), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var item = _step4.value;

                var addItem = true;
                if (this.isOnBuyTab) {
                    var endDate = item.timePosted + MarketConfig.itemPostedDuration;
                    var dateNow = new Date().getTime();
                    var distanceItem = endDate - dateNow;

                    if (distanceItem <= 0) addItem = false;
                }

                if (addItem) {
                    countNotExpiredItems++;
                    // Get localized name
                    var itemName = '';
                    if (item.name) {
                        var stringKey = 'loadout-' + item.name.replace(/ /g, '-').toLowerCase();
                        itemName = this.localization.translate(stringKey);
                    } else {
                        var _stringKey = 'loadout-' + GameObjectDefs[item.item].name.replace(/ /g, '-').toLowerCase();
                        itemName = this.localization.translate(_stringKey);
                    }

                    //Get localized btn string
                    var btnAction = '';
                    if (this.isOnBuyTab) btnAction = this.localization.translate('market-buy-for');else {
                        if (item.timePosted) btnAction = this.localization.translate('market-sell-progress');else btnAction = this.localization.translate('market-sell-item');
                    }

                    var rarityColor = Rarities[item.rarity].color;

                    //Html code for one item of list
                    itemContent = '';
                    itemContent += '<div id=\'market-item-' + idx + '\' class=\'market-list-item-container\'>';
                    itemContent += '<div class=\'market-item-img\' style=\'background-image: url(' + helpers.getSvgFromGameType(item.item) + ');  border: 2.86534px solid ' + rarityColor + '; background-color: ' + Rarities[item.rarity].backgroundColor + ';\'>';
                    itemContent += '<div class=\'item-rarity-style\' style=\'background-color: ' + rarityColor + ';\'>';
                    itemContent += '<div class=\'dark item-' + item.type + '\'></div>';
                    itemContent += '</div>';
                    itemContent += '</div>';
                    itemContent += '<div class=\'market-item-info-container\'>';
                    itemContent += '<span class=\'market-item-title\'>' + itemName + '</span>';
                    itemContent += '<div class=\'market-item-stats-container\'>';
                    itemContent += '<span class=\'market-item-stats-text\'>' + this.localization.translate('market-sort-makr') + ': <p>' + item.makr + '</p></span></br>';
                    itemContent += '<div class=\'market-stats-second-line-container\'>';
                    itemContent += '<span class=\'market-item-stats-text\'>' + this.localization.translate('market-sort-kills') + ': <p>' + helpers.getAbbreviatedNumber3Digits(item.kills) + '</p></span>';
                    itemContent += '<span class=\'market-item-stats-text\'>' + this.localization.translate('market-sort-levels') + ': <p>' + helpers.getAbbreviatedNumber3Digits(item.levels) + '</p></span>';
                    itemContent += '<span class=\'market-item-stats-text\'>' + this.localization.translate('market-sort-wins') + ': <p>' + helpers.getAbbreviatedNumber3Digits(item.wins) + '</p></span>';
                    itemContent += '</div>';
                    itemContent += '</div>';
                    itemContent += '</div>';
                    itemContent += '<div class=\'market-item-action-container\'>';
                    if (item.timePosted) {
                        itemContent += '<div class=\'market-item-action-timer\'>';
                        itemContent += '<span id=\'market-expire-in-text-' + idx + '\'>' + this.localization.translate('market-timer-expires-in') + '</span>';
                        itemContent += '<span id=\'market-item-timer-' + idx + '\' class=\'market-bold-text\'></span>';
                        itemContent += '</div>';
                    }
                    itemContent += '<div id=\'market-item-btn-' + idx + '\' class=\'market-item-action-btn btn-darken ' + (!this.isOnBuyTab && item.timePosted ? 'market-btn-hide' : '') + '\' ' + (!this.isOnBuyTab && item.timePosted ? "style ='font-size: 18px !important;'" : '') + '>' + btnAction;
                    if (this.isOnBuyTab) {
                        itemContent += '<div class=\'market-btn-price-container\'>';
                        itemContent += '<div class=\'market-btn-price-text\'>' + helpers.getAbbreviatedNumber3Digits(item.price) + '</div>';
                        itemContent += '</div>';
                    }
                    itemContent += '</div>';
                    itemContent += '</div>';
                    itemContent += '</div>';
                    this.marketItemsList.append(itemContent);

                    if (this.isOnBuyTab) $('#market-item-btn-' + idx).on('click', { itemData: item, itemName: itemName }, this.purchaseItem.bind(this));else {
                        if (!item.timePosted) $('#market-item-btn-' + idx).on('click', { itemData: item, itemName: itemName }, this.showSellModal.bind(this));
                    }

                    if (item.timePosted) {
                        (function () {
                            var endDateTimer = item.timePosted + MarketConfig.itemPostedDuration;
                            var timerIdx = idx;
                            var self = _this10;
                            var timer = setInterval(function () {
                                // Get today's date and time
                                var now = new Date().getTime();

                                // Find the distance between now and the count down date
                                var distance = endDateTimer - now;

                                // Time calculations for days, hours, minutes and seconds
                                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                                var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
                                var seconds = Math.floor(distance % (1000 * 60) / 1000);

                                days = days < 10 ? '0' + days : days;
                                hours = hours < 10 ? '0' + hours : hours;
                                minutes = minutes < 10 ? '0' + minutes : minutes;
                                seconds = seconds < 10 ? '0' + seconds : seconds;

                                $('#market-item-timer-' + timerIdx).text(": " + days + ":" + hours + ":" + minutes + ":" + seconds);

                                // If the count down is finished, write some text
                                if (distance < 0) {
                                    _this10.clearTimer(timerIdx);
                                    $('#market-item-timer-' + timerIdx).text(_this10.localization.translate('market-timer-expired'));
                                    $('#market-expire-in-text-' + timerIdx).css('display', 'none');
                                    if (self.isOnBuyTab) $('#market-item-btn-' + timerIdx).addClass('market-btn-disabled');else {
                                        $('#market-item-btn-' + timerIdx).removeClass('market-btn-disabled');
                                        $('#market-item-btn-' + timerIdx).removeAttr('style');
                                    }
                                }
                            }, 1000);

                            _this10.timersToClear[timerIdx] = timer;
                        })();
                    }

                    idx++;
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

        if (idx === 0) this.showNoItemAvailable();else this.sendNavSearchEvent(countNotExpiredItems);
        survivLoading.hideSurvivLoading();
    },

    showSellModal: function showSellModal(event) {
        var item = event.data.itemData;
        var loadoutIds = this.account.loadoutIds;
        var isItemEquipped = false;
        var type = item.type.split('_')[0] === 'emote' ? 'emotes' : item.type.split('_')[0];

        var equippedId = loadoutIds[type];

        if (type === 'emotes') isItemEquipped = equippedId.includes(item.id);else isItemEquipped = equippedId == item.id;

        //if(!isItemEquipped){
        var sellModalElement = $('#market-modal-sell-item');
        var sellModal = new MenuModal(sellModalElement);
        var rarityColor = Rarities[item.rarity].color;

        $('#market-input-price').text(''); //Clean input
        $('#market-modal-confirm-sell-item').addClass('market-btn-disabled'); //Disable until minimum price

        this.itemDataToSell = { id: item.id, price: 0, type: item.type, rarity: item.rarity, item: item.item };

        sellModalElement.find('#market-item-sell-img').css({ 'background-image': 'url(' + helpers.getSvgFromGameType(item.item) + ')',
            'border': '2.86534px solid ' + rarityColor,
            'background-color': Rarities[item.rarity].backgroundColor });
        sellModalElement.find('#market-item-sell-type').css('background-color', rarityColor).html('<div class=\'dark item-' + item.type + '\'></div>');
        sellModalElement.find('#market-item-name').html(event.data.itemName);
        sellModalElement.find('#market-item-makr').html(this.localization.translate('market-sort-makr') + ': ' + item.makr);
        sellModalElement.find('#market-item-kills').html(this.localization.translate('market-sort-kills') + ': ' + item.kills);
        sellModalElement.find('#market-item-levels').html(this.localization.translate('market-sort-levels') + ': ' + item.levels);
        sellModalElement.find('#market-item-wins').html(this.localization.translate('market-sort-wins') + ': ' + item.wins);
        $('#market-modal-btn-sell').html(this.localization.translate('market-modal-min-price') + ' ' + Rarities[item.rarity].marketPrice);

        sellModal.show();

        var result = 'Price: 0, Time left: 00:24:00:00';
        this.analytics.navActionsEvent('Market Sell', result, 'Sell Item', item.id);
        /*}
        else{
            this.showError('market-error-item-equipped');
        }*/
    },

    purchaseItem: function purchaseItem(event) {
        var buyModalElement = $('#market-modal-buy-item');
        var buyModal = new MenuModal(buyModalElement);
        var item = event.data.itemData;
        var rarityColor = Rarities[item.rarity].color;

        this.itemDataToBuy = { id: item.id, price: item.price, itemId: item.itemId, timePosted: item.timePosted };

        buyModalElement.find('#market-item-sell-img').css({ 'background-image': 'url(' + helpers.getSvgFromGameType(item.item) + ')',
            'border': '2.86534px solid ' + rarityColor,
            'background-color': Rarities[item.rarity].backgroundColor });
        buyModalElement.find('#market-item-sell-type').css('background-color', rarityColor).html('<div class=\'dark item-' + item.type + '\'></div>');
        buyModalElement.find('#market-item-name').html(event.data.itemName);
        buyModalElement.find('#market-item-makr').html(this.localization.translate('market-sort-makr') + ': ' + item.makr);
        buyModalElement.find('#market-item-kills').html(this.localization.translate('market-sort-kills') + ': ' + item.kills);
        buyModalElement.find('#market-item-levels').html(this.localization.translate('market-sort-levels') + ': ' + item.levels);
        buyModalElement.find('#market-item-wins').html(this.localization.translate('market-sort-wins') + ': ' + item.wins);
        buyModalElement.find('#market-buy-price').html(item.price);

        buyModal.show();

        var result = 'Price: ' + item.price + ', Time left: ' + getTimeLeft(item.timePosted + MarketConfig.itemPostedDuration);
        this.analytics.navActionsEvent('Market Buy', result, 'Buy Item', item.itemId);
    },

    showNextNotification: function showNextNotification(notificationList) {
        var isPageLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (notificationList && this.needToUpdateNotificationState) {
            this.updateNotificationState(notificationList, isPageLoad);
            this.needToUpdateNotificationState = false;
        }
        var currentNotification = this.marketNotifications.shift();
        var notificationModalElement = $('#market-modal-notification');

        if (currentNotification) {
            var rarityColor = Rarities[currentNotification.rarity].color;
            var stringKey = 'loadout-' + GameObjectDefs[currentNotification.item].name.replace(/ /g, '-').toLowerCase();
            var itemName = this.localization.translate(stringKey);

            notificationModalElement.find('#market-item-sell-img').css({ 'background-image': 'url(' + helpers.getSvgFromGameType(currentNotification.item) + ')',
                'border': '2.86534px solid ' + rarityColor,
                'background-color': Rarities[currentNotification.rarity].backgroundColor });
            notificationModalElement.find('#market-item-sell-type').css('background-color', rarityColor).html('<div class=\'dark item-' + currentNotification.type + '\'></div>');
            notificationModalElement.find('#market-item-name').html(itemName);
            notificationModalElement.find('#market-item-makr').html(this.localization.translate('market-sort-makr') + ': ' + currentNotification.makr);
            notificationModalElement.find('#market-item-kills').html(this.localization.translate('market-sort-kills') + ': ' + currentNotification.kills);
            notificationModalElement.find('#market-item-levels').html(this.localization.translate('market-sort-levels') + ': ' + currentNotification.levels);
            notificationModalElement.find('#market-item-wins').html(this.localization.translate('market-sort-wins') + ': ' + currentNotification.wins);
            notificationModalElement.find('#market-buy-price').html(currentNotification.price);

            if (currentNotification.seller_notification) {
                notificationModalElement.find('#market-modal-notification-btn-text').html(this.localization.translate('market-modal-btn-got-it'));
                if (currentNotification.sold) {
                    notificationModalElement.find('#market-modal-notification-text-container').css('display', 'none');
                    notificationModalElement.find('#market-modal-price-element').css('display', 'block');
                    notificationModalElement.find('#market-modal-notification-title-text').html(this.localization.translate('market-modal-successfull-sell'));
                    notificationModalElement.find('#market-buy-price').html(parseInt(currentNotification.price * MarketConfig.inversePostingFee));
                } else {
                    notificationModalElement.find('#market-modal-notification-text-container').css('display', 'block');
                    notificationModalElement.find('#market-modal-price-element').css('display', 'none');
                    notificationModalElement.find('#market-modal-notification-title-text').html(this.localization.translate('market-modal-expired'));
                    notificationModalElement.find('#market-modal-notification-text').html(this.localization.translate('market-modal-expired-text'));
                }
            } else {
                notificationModalElement.find('#market-modal-notification-btn-text').html(this.localization.translate('market-modal-btn-great'));
                notificationModalElement.find('#market-modal-notification-text-container').css('display', 'block');
                notificationModalElement.find('#market-modal-price-element').css('display', 'none');
                notificationModalElement.find('#market-modal-notification-title-text').html(this.localization.translate('market-modal-successfull-buy'));
                notificationModalElement.find('#market-modal-notification-text').html(this.localization.translate('market-modal-sell-text'));
            }

            this.marketModalNotification.show();
        }
    },


    showError: function showError() {
        var extraText = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var titleElement = $('#market-modal-error-title');
        var textElement = $('#market-modal-error-text');

        title ? titleElement.html(this.localization.translate(title) || title) : titleElement.html(this.localization.translate('iap-transaction-failed'));
        extraText ? textElement.html(this.localization.translate('iap-transaction-error') + "</br>" + (this.localization.translate(extraText) || extraText)) : textElement.html(this.localization.translate('iap-transaction-error'));

        this.errorModal.show();
    }
};

module.exports = Market;
