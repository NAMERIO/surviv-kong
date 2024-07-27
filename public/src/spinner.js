"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var api = require("./api.js");
var device = require("./device.js");
var roulette = require("./dab6f060.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var helpers = require("./helpers.js");
var MenuModal = require("./menuModal.js");
var lootBoxes = require("./lootBoxes.js");
var Rarities = require("./rarities.js");

var activeLimitedCrates = [{ id: 'limited_loot_box_pre_vacation_2020', replaceLootBox: 0, active: false }, { id: 'limited_loot_box_post_xmas_2020', replaceLootBox: 0, active: false }]; //Max 3 at the same time, limited by current UI because replaces the permanent crates

var permanentCrateElements = [{ btn: '#open-crate-1', contains: '#btn-contains-crate-green' }, // 0
{ btn: '#open-crate-2', contains: '#btn-contains-crate-blue' }, // 1
{ btn: '#open-crate-3', contains: '#btn-contains-crate-red' }];

function Spinner(account, localization, audioManager, profileUi, iap) {
    this.account = account;
    this.rouletter = null;
    this.rewardItem = '';
    this.loading = false;
    this.localization = localization;
    this.audioManager = audioManager;
    this.profileUi = profileUi;
    this.iap = iap;
    this.areLimitedCratesExpired = [];
    this.limitedIntevals = {};
}

Spinner.prototype = {

    init: function init() {
        var _this = this;

        var self = this;

        $('#crates-modal .close-corner').click(function () {
            $('#crates-modal').hide();
            return false;
        });

        $('.reward-btn-blue').click(function () {
            $('#reward-modal').hide();
            return false;
        });

        $(".crates-screen").click(function (e) {
            e.stopPropagation();
        });

        $('.btn-pharma-crates').click(function () {
            self.loading = false;

            $('#open-crate-1 .account-loading').css('opacity', self.loading ? 1.0 : 0.0);
            $('#open-crate-1 .buy-btn').css('opacity', !self.loading ? 1.0 : 0.0);

            $('#open-crate-2 .account-loading').css('opacity', self.loading ? 1.0 : 0.0);
            $('#open-crate-2 .buy-btn').css('opacity', !self.loading ? 1.0 : 0.0);

            $('#open-crate-3 .account-loading').css('opacity', self.loading ? 1.0 : 0.0);
            $('#open-crate-3 .buy-btn').css('opacity', !self.loading ? 1.0 : 0.0);

            if (self.areLimitedCratesExpired.length > 0 || self.areLimitedCratesActive()) self.loadCrates();

            $('#crates-modal').show();
            return false;
        });

        this.account.addEventListener('openCratesModal', function () {
            self.loading = false;

            $('#open-crate-1 .account-loading').css('opacity', self.loading ? 1.0 : 0.0);
            $('#open-crate-1 .buy-btn').css('opacity', !self.loading ? 1.0 : 0.0);

            $('#open-crate-2 .account-loading').css('opacity', self.loading ? 1.0 : 0.0);
            $('#open-crate-2 .buy-btn').css('opacity', !self.loading ? 1.0 : 0.0);

            $('#open-crate-3 .account-loading').css('opacity', self.loading ? 1.0 : 0.0);
            $('#open-crate-3 .buy-btn').css('opacity', !self.loading ? 1.0 : 0.0);

            if (self.areLimitedCratesExpired.length > 0 || self.areLimitedCratesActive()) self.loadCrates();

            $('#crates-modal').show();
        }.bind(this));

        //code for testing
        //TODO DELETE ALL RELATED WITH THIS TESTING BUTTONS
        if (location.hostname.indexOf('test') != -1 || location.hostname.indexOf('dev') != -1 || location.hostname.indexOf('localhost') != -1) {
            $("<div class='spin-overview'><a class='btn-green btn-darken menu-option btn-get-gp'>Get GP</a></div>").insertBefore("#open-store-button");
            $("<div class='spin-overview'><a class='btn-green btn-darken menu-option btn-add-xp'>Add XP</a></div>").insertBefore("#open-store-button");
            $("<div class='spin-overview'><a class='btn-green btn-darken menu-option btn-google-unlink'>Google Unlink</a></div>").insertBefore("#open-store-button");
            $("<div class='spin-overview'><a class='btn-green btn-darken menu-option btn-expire-market-items'>Expire my items</a></div>").insertBefore("#open-store-button");

            $('.btn-get-gp').click(function () {
                _this.account.getGP();
                return false;
            });

            $('.btn-add-xp').click(function () {
                _this.account.addXP();
                return false;
            });

            $('.btn-google-unlink').click(function () {
                _this.account.unlinkGoogleId();
                return false;
            });

            $('.btn-expire-market-items').on('click', function () {
                _this.account.expireMarketItems();
                return false;
            });
        }

        this.loadCrates();
        this.account.addEventListener('startSpin', this.startSpin.bind(this));
    },

    loadCrates: function loadCrates() {
        var _this2 = this;

        var lootBox1 = GameObjectDefs['loot_box_01'];
        var lootBox2 = GameObjectDefs['loot_box_02'];
        var lootBox3 = GameObjectDefs['loot_box_03'];

        var self = this;

        $('#open-crate-1').off();
        $('#open-crate-2').off();
        $('#open-crate-3').off();
        $('#btn-contains-crate-green').off();
        $('#btn-contains-crate-blue').off();
        $('#btn-contains-crate-red').off();

        while (this.areLimitedCratesExpired.length > 0) {
            var expiredCrate = this.areLimitedCratesExpired.pop();
            var btn = expiredCrate.btn;
            var contains = expiredCrate.contains;
            var timer = expiredCrate.timer;

            $(btn).removeAttr('style');
            $(btn).removeClass('market-btn-disabled');
            $(contains).removeAttr('style');
            $(timer).css('display', 'none');
        }

        $('#open-crate-1 .crate-price').text(lootBox1.price);
        $('#open-crate-2 .crate-price').text(lootBox2.price);
        $('#open-crate-3 .crate-price').text(lootBox3.price);

        $('#open-crate-1').on('click', function () {
            if (self.account.unlinked) {
                self.profileUi.showIncentiveModal();
            } else if (!self.loading && self.account.profile.gpTotal >= lootBox1.price) {
                self.loading = true;
                $('#open-crate-1 .account-loading').css('opacity', 1.0);
                $('#open-crate-1 .buy-btn').css('opacity', 0.0);
                _this2.account.openLootBox('loot_box_01');
                _this2.audioManager.playSound('open_crate_spinner_01', {
                    channel: 'ui',
                    delay: 0.0,
                    forceStart: true
                });
            } else {
                _this2.showNoGpModal(lootBox1.price - self.account.profile.gpTotal);
            }
            return false;
        });

        $('#open-crate-2').on('click', function () {
            if (self.account.unlinked) {
                self.profileUi.showIncentiveModal();
            } else if (!self.loading && self.account.profile.gpTotal >= lootBox2.price) {
                self.loading = true;
                $('#open-crate-2 .account-loading').css('opacity', 1.0);
                $('#open-crate-2 .buy-btn').css('opacity', 0.0);
                _this2.account.openLootBox('loot_box_02');
                _this2.audioManager.playSound('open_crate_spinner_01', {
                    channel: 'ui',
                    delay: 0.0,
                    forceStart: true
                });
            } else {
                _this2.showNoGpModal(lootBox2.price - self.account.profile.gpTotal);
            }
            return false;
        });

        $('#open-crate-3').on('click', function () {
            if (self.account.unlinked) {
                self.profileUi.showIncentiveModal();
            } else if (!self.loading && self.account.profile.gpTotal >= lootBox3.price) {
                self.loading = true;
                $('#open-crate-3 .account-loading').css('opacity', 1.0);
                $('#open-crate-3 .buy-btn').css('opacity', 0.0);
                _this2.account.openLootBox('loot_box_03');
                _this2.audioManager.playSound('open_crate_spinner_01', {
                    channel: 'ui',
                    delay: 0.0,
                    forceStart: true
                });
            } else {
                _this2.showNoGpModal(lootBox3.price - self.account.profile.gpTotal);
            }
            return false;
        });

        $('#btn-contains-crate-green').on('click', function () {
            _this2.loadOdds('loot_box_01');
            $('#modal-crate-contain .modal-header').css("background-color", "#37513A");
            $('#modal-crate-contain .modal-footer').css("background-color", "#37513A");
            _this2.loadCrateContainsItems('loot_box_01');
            _this2.modalCrateContains = new MenuModal($('#modal-crate-contain'));
            _this2.modalCrateContains.show();
        });

        $('#btn-contains-crate-blue').on('click', function () {
            _this2.loadOdds('loot_box_02');
            $('#modal-crate-contain .modal-header').css("background-color", "#2FC9CB");
            $('#modal-crate-contain .modal-footer').css("background-color", "#049395");
            _this2.loadCrateContainsItems('loot_box_02');
            _this2.modalCrateContains = new MenuModal($('#modal-crate-contain'));
            _this2.modalCrateContains.show();
        });

        $('#btn-contains-crate-red').on('click', function () {
            _this2.loadOdds('loot_box_03');
            $('#modal-crate-contain .modal-header').css("background-color", "#EA333D");
            $('#modal-crate-contain .modal-footer').css("background-color", "#AF1C25");
            _this2.loadCrateContainsItems('loot_box_03');
            _this2.modalCrateContains = new MenuModal($('#modal-crate-contain'));
            _this2.modalCrateContains.show();
        });

        this.initLimitedCrates();
    },


    startSpin: function startSpin(lootBox, itemType) {
        self.loading = false;
        this.rewardItem = itemType;
        $('#spin-modal').show();
        $('#crates-modal').hide();
        this.rouletter = $('div.roulette');
        var lootBoxDef = GameObjectDefs[lootBox];
        var pool = GameObjectDefs[lootBoxDef.lootPool].items;
        var index = pool.findIndex(function (item) {
            return item === itemType;
        });
        for (var i = 0; i < 60; i++) {
            var _itemType = pool[Math.floor(Math.random() * pool.length)];
            if (i == 56) {
                _itemType = pool[index];
            }

            var img = $('<img>');
            var item = GameObjectDefs[_itemType];
            var svg = helpers.getSvgFromGameType(_itemType);
            img.attr('src', svg);
            img.css({ outline: 'solid 4px ' + Rarities[item.rarity].color,
                background: '' + Rarities[item.rarity].backgroundColor });
            img.appendTo('div.roulette');

            /*let img = $('<div>');
            let item = GameObjectDefs[itemType];
            let svg = helpers.getSvgFromGameType(itemType);
            img.attr('src', svg);
            img.css({outline: `solid 1.7176px ${Rarities[item.rarity].color}`,
                    'background-color':  `${(Rarities[item.rarity].backgroundColor)}`,
                    'background-image':   'url("../' + svg +'")'});
            
            let itemRarity = $('<div>');
            itemRarity.addClass('item-rarity-style');
            itemRarity.css({'background-color': `${(Rarities[item.rarity].color)}`});
            let itemRarityImage = $('<div>');
            itemRarityImage.addClass('dark item-'+ item.type);
            itemRarity.append(itemRarityImage);
            img.append(itemRarity);
             img.appendTo('div.roulette');*/
        }

        var p = {
            audioManager: this.audioManager,
            stopCallback: function () {
                var self = this;
                setTimeout(function () {
                    self.showRewardScreen();
                    self.audioManager.playSound('get_item_01', {
                        channel: 'ui',
                        delay: 0.0,
                        forceStart: true
                    });
                }, 1000);
            }.bind(this)
        };

        this.rouletter.roulette(p);
        this.rouletter.roulette('start');
    },

    loadCrateContainsItems: function loadCrateContainsItems(crate) {
        $('div.items-crate').html('');
        var lootPool = GameObjectDefs[crate].lootPool;
        var pool = GameObjectDefs[lootPool].items;
        var orderPool = [];
        for (var i = 0; i < pool.length; i++) {
            var item = GameObjectDefs[pool[i]];
            var obj = {
                itemType: pool[i],
                rarity: item.rarity
            };
            orderPool.push(obj);
        }
        orderPool.sort(function (a, b) {
            return a.rarity < b.rarity ? 1 : -1;
        });
        for (var _i = 0; _i < orderPool.length; _i++) {
            var img = $('<div>');
            var svg = helpers.getSvgFromGameType(orderPool[_i].itemType);
            img.addClass('items-crate-contains');
            img.css({ border: '1.7176px  solid ' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].color,
                'background-color': '' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].backgroundColor,
                'background-image': 'url("../' + svg + '")' });

            //Item rarity icon

            var itemRarity = $('<div>');
            itemRarity.addClass('item-rarity-style');
            itemRarity.css({ 'background-color': '' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].color });
            var itemRarityImage = $('<div>');
            var itemIconType = GameObjectDefs[orderPool[_i].itemType] ? GameObjectDefs[orderPool[_i].itemType].type : orderPool[_i].itemType;
            itemRarityImage.addClass('dark item-' + itemIconType);
            itemRarity.append(itemRarityImage);
            img.append(itemRarity);

            img.appendTo('div.items-crate');
        }
    },

    loadOdds: function loadOdds(box) {
        $('div.info-items-odds').html('');
        var boxProbabilities = lootBoxes[box].probabilities;

        for (var i = 1; i < boxProbabilities.length; i++) {
            if (boxProbabilities[i].weight > 0.0) {
                var rarity = boxProbabilities[i].rarity;
                var itemOdd = $('<div>');
                var localizedRarity = this.localization.translate('loadout-' + Rarities[rarity].name);

                itemOdd.html(localizedRarity + ' = ' + boxProbabilities[i].weight * 100 + '%');
                itemOdd.addClass('item-odd');
                itemOdd.css({ color: '' + Rarities[rarity].color });

                itemOdd.appendTo('div.info-items-odds');
                //$(`#item-odd-${boxProbabilities[i].rarity}`).html(`= ${boxProbabilities[i].weight*100}%`);      
            }
        }
    },

    showNoGpModal: function showNoGpModal(neededGP) {
        this.iap.showContextualOffer(neededGP, { window: 'crates' });
    },

    showRewardScreen: function showRewardScreen() {
        this.account.loadProfile();
        var itemDef = GameObjectDefs[this.rewardItem];
        $('#reward-modal').show();
        $('.reward-img').empty();
        var img = $('<div>');
        var svg = helpers.getSvgFromGameType(this.rewardItem);

        img.css({ border: '1.7176px  solid ' + Rarities[itemDef.rarity].color,
            'background-color': '' + Rarities[itemDef.rarity].backgroundColor,
            'background-image': 'url("../' + svg + '")' });

        var itemRarity = $('<div>');
        itemRarity.addClass('item-rarity-style');
        itemRarity.css({ 'background-color': '' + Rarities[itemDef.rarity].color });
        var itemRarityImage = $('<div>');
        var itemIconType = GameObjectDefs[itemDef.name];
        itemRarityImage.addClass('dark item-' + itemDef.type);
        itemRarity.append(itemRarityImage);
        img.append(itemRarity);

        img.appendTo('.reward-img');
        var itemText = itemDef.name;
        $('.reward-type').text(itemText);

        $('#spin-modal').hide();
        this.rouletter.empty();
        this.rouletter.removeAttr("style");
        this.rouletter.unbind().removeData();
        this.rouletter = null;
    },

    areLimitedCratesActive: function areLimitedCratesActive() {
        var index = 0;
        var areCratesActive = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(activeLimitedCrates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var limitedCrate = _step.value;

                var crateDef = GameObjectDefs[limitedCrate.id];

                if (crateDef && crateDef.isLimited) {
                    var date2ms = new Date().getTime();
                    var startDate = new Date(crateDef.startDate).getTime();
                    var endDate = new Date(crateDef.endDate).getTime();

                    if (date2ms > startDate && date2ms < endDate && !limitedCrate.active) {
                        activeLimitedCrates[index].active = true;
                        areCratesActive = true;
                    }
                }
                index++;
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

        return areCratesActive;
    },
    initLimitedCrates: function initLimitedCrates() {
        var _this3 = this;

        var index = 0;

        var _loop = function _loop(limitedCrate) {
            var crateElements = permanentCrateElements[limitedCrate.replaceLootBox];
            var crateDef = GameObjectDefs[limitedCrate.id];

            if (crateDef && crateElements && crateDef.isLimited) {
                date2ms = new Date().getTime();

                var startDate = new Date(crateDef.startDate).getTime();
                var endDate = new Date(crateDef.endDate).getTime();

                if (date2ms > startDate && date2ms < endDate) {
                    var crateBtn = crateElements.btn;
                    var crateContainsBtn = $(crateElements.contains);

                    //Clear previous binded events
                    $(crateBtn).off();
                    crateContainsBtn.off();

                    //Bind new events
                    var _self = _this3;
                    $(crateBtn).on('click', function () {
                        if (_self.account.unlinked) {
                            _self.profileUi.showIncentiveModal();
                        } else if (!_self.loading && _self.account.profile.gpTotal >= crateDef.price) {
                            _self.loading = true;
                            $(crateBtn + '.account-loading').css('opacity', 1.0);
                            $(crateBtn + ' .buy-btn').css('opacity', 0.0);
                            _this3.account.openLootBox(limitedCrate.id);
                            _this3.audioManager.playSound('open_crate_spinner_01', {
                                channel: 'ui',
                                delay: 0.0,
                                forceStart: true
                            });
                        } else {
                            _this3.showNoGpModal(crateDef.price - _self.account.profile.gpTotal);
                        }
                        return false;
                    });

                    crateContainsBtn.on('click', function () {
                        _this3.loadOdds(limitedCrate.id);
                        $('#modal-crate-contain .modal-header, #modal-crate-contain .modal-footer').css("background-color", crateDef.backgroundColor);
                        _this3.loadCrateContainsItems(limitedCrate.id);
                        _this3.modalCrateContains = new MenuModal($('#modal-crate-contain'));
                        _this3.modalCrateContains.show();
                    });

                    // UI changes
                    $(crateBtn + ' .crate-price').text(crateDef.price);
                    $(crateBtn).css({ 'color': crateDef.textColor,
                        'border-bottom': '2px solid ' + crateDef.shadowColor,
                        'box-shadow': 'inset 0 -2px ' + crateDef.shadowColor,
                        'background': crateDef.backgroundColor });

                    crateContainsBtn.css('background-image', 'url(../img/gui/' + crateDef.img + ')');

                    var crateNumber = crateBtn.split('-').pop();
                    var timerHtml = '<div id=\'limited-crate-timer-container-' + crateNumber + '\' class=\'limited-crate-timer-container\' style=\'background: ' + crateDef.timer.backgroundColor + '\'><span id=\'limited-crate-timer-' + crateNumber + '\' style=\'color:' + crateDef.timer.color + '\'>00:00:00:00</span></div>';
                    $(timerHtml).insertAfter(crateBtn);

                    interval = setInterval(function () {
                        var now = new Date().getTime();

                        var timerLeft = endDate - now;

                        // Time calculations for days, hours, minutes and seconds
                        var days = Math.floor(timerLeft / (1000 * 60 * 60 * 24));
                        var hours = Math.floor(timerLeft % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                        var minutes = Math.floor(timerLeft % (1000 * 60 * 60) / (1000 * 60));
                        var seconds = Math.floor(timerLeft % (1000 * 60) / 1000);

                        days = days < 10 ? '0' + days : days;
                        hours = hours < 10 ? '0' + hours : hours;
                        minutes = minutes < 10 ? '0' + minutes : minutes;
                        seconds = seconds < 10 ? '0' + seconds : seconds;

                        var displayTime = days + ":" + hours + ":" + minutes + ":" + seconds;

                        $('#limited-crate-timer-' + crateNumber).text(displayTime);

                        // If the count down is finished, write some text
                        if (timerLeft < 0) {
                            if (_this3.limitedIntevals[crateNumber]) clearInterval(_this3.limitedIntevals[crateNumber]);
                            $('#limited-crate-timer-' + crateNumber).text('EXPIRED');
                            $(crateBtn).addClass('market-btn-disabled');
                            _this3.areLimitedCratesExpired.push({ btn: crateBtn, contains: crateElements.contains, timer: '#limited-crate-timer-container-' + crateNumber });
                        }
                    }, 1000);

                    _this3.limitedIntevals[crateNumber] = interval;
                    activeLimitedCrates[index].active = true;
                }
            }
            index++;
        };

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(activeLimitedCrates), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var limitedCrate = _step2.value;
                var date2ms;
                var interval;

                _loop(limitedCrate);
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
};

module.exports = Spinner;
