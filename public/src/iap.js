"use strict";


var _values = require("./42e8eaed.js");

var _values2 = _interopRequireDefault(_values);

var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _set = require("./ed9971da.js");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

/**
 * @param {RequestInfo} url
 * @param {Object} data
 */
var postRequest = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, data) {
        var response;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fetch(url, {
                            method: 'POST',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'Content-Type': 'application/json; charset=utf-8'
                            },
                            credentials: 'same-origin',
                            body: (0, _stringify2.default)(data)
                        });

                    case 2:
                        response = _context.sent;
                        return _context.abrupt('return', response.json());

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function postRequest(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var $ = require("./8ee62bea.js");
//const roulette = require('./lib/roulette.js');
var api = require("./api.js");
//@ts-ignore
var GameObjectDefs = require("./gameObjectDefs.js");
//@ts-ignore
var IAPPacks = require("./IAPPacks.js");
//@ts-ignore
var Rarities = require("./rarities.js");
var helpers = require("./helpers.js");
var MenuModal = require("./menuModal.js");
var XPayStationWidget = require("./e97932a2.js");
var device = require("./device.js");
var survivLoading = require("./survivLoading.js");
var uuidv4 = require("./8581e282.js");
var GearCardItemSmall = require("./gearCardItemSmall.js");
var ModalSeasonRewards = require("./modalSeasonRewards.js");
//const { RouletteJs } = require('./ui/ui-utils.js');

/* Rarities
'stock',        // 0
'common',       // 1
'rare',         // 2
'epic',         // 3
'mythic',       // 4
'legend'        // 5
*/

var AVAILABLE_CHESTS = ['loot_box_01', 'loot_box_02', 'loot_box_03'];

var possibleOffers = ['none', // 0 Always leave this one empty
'small', // 1
'big' // 2
];

/**
 * 
 * @param {Node} node 
 */
var removeChildren = function removeChildren(node) {
    /** @type {ChildNode} */
    while (node.firstChild) {
        node.firstChild.remove();
    }
};

var Num2RarityText = {
    0: 'common',
    1: 'rare',
    2: 'epic',
    3: 'legendary'
};

var offersNames = { big_offer: 'Large', small_offer: 'Small' };

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
var IAPGoldPack = function () {
    /**
     * 
     * @param {HTMLElement | DocumentFragment} parent 
     * @param {any} pack
     */
    function IAPGoldPack(parent, pack) {
        (0, _classCallCheck3.default)(this, IAPGoldPack);

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#gold-pack_template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type {Element} */node.querySelector('.gold-pack');
        this.mount(pack);
        parent.appendChild(node);
        /** @type{Set<(item: IAPGoldPack, pack: any) => void>} */
        this.subscribers = new _set2.default();
    }

    /**
     * @param {(item: IAPGoldPack, pack: any) => void} sub
     */


    (0, _createClass3.default)(IAPGoldPack, [{
        key: 'onBuyClick',
        value: function onBuyClick(sub) {
            this.subscribers.add(sub);
        }
    }, {
        key: 'mount',
        value: function mount(pack) {
            var _this = this;

            /** @type {HTMLSpanElement} */
            var goldAmount = this.card.querySelector('.gold-pack_gold-amount');
            goldAmount.innerText = pack.gp;

            /** @type {HTMLButtonElement} */
            this.buyButton = this.card.querySelector('.gold-pack_buy-btn');
            this.buyButton.innerText = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(pack.cost / 100);
            this.buyButton.onclick = function () {
                _this.subscribers.forEach(function (sub) {
                    return sub(_this, pack);
                });
            };
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.subscribers.clear();
        }
    }]);
    return IAPGoldPack;
}();

var ShopRarityChest = function () {
    /**
     * 
     * @param {HTMLElement | DocumentFragment} parent 
     * @param {typeof import('./../../../data/game/game-objects/loot-boxes')['loot_box_01']} chest
     * @param {import('./localization')} localization
     */
    function ShopRarityChest(parent, chest, localization) {
        (0, _classCallCheck3.default)(this, ShopRarityChest);

        this.localization = localization;
        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#shop-rarity-chest_template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type {Element} */node.querySelector('.shop-rarity-chest');
        this.mount(chest);
        parent.appendChild(node);
        /** @type{Set<(item: ShopRarityChest, chest: any, isAd: boolean) => void>} */
        this.actionSubscribers = new _set2.default();
        /** @type{Set<(item: ShopRarityChest, chest: any) => void>} */
        this.infoSubscribers = new _set2.default();
    }

    /**
     * @param {(item: ShopRarityChest, chest: any, isAd: boolean) => void } subs
     */


    (0, _createClass3.default)(ShopRarityChest, [{
        key: 'onActionButtonClick',
        value: function onActionButtonClick(subs) {
            this.actionSubscribers.add(subs);
        }

        /**
         * @param {(item: ShopRarityChest, chest: any) => void } subs
         */

    }, {
        key: 'onInfoButtonClick',
        value: function onInfoButtonClick(subs) {
            this.infoSubscribers.add(subs);
        }

        /**
         * 
         * @param {typeof import('./../../../data/game/game-objects/loot-boxes')['loot_box_01']} chest
         */

    }, {
        key: 'mount',
        value: function mount(chest) {
            var _this2 = this;

            this.card.classList.add(chest.rarity);
            /** @type {HTMLButtonElement} */
            var watchAdButton = this.card.querySelector('.shop-rarity-chest_watch-ad-btn');
            /** @type {HTMLButtonElement} */
            var buyButton = this.card.querySelector('.shop-rarity-chest_buy-btn');
            /** @type {HTMLImageElement} */
            var img = this.card.querySelector('.shop-rarity-chest_img');
            img.src = chest.image;
            /** @type {HTMLButtonElement} */
            var infoButton = this.card.querySelector('.shop-rarity-chest_info-btn');
            infoButton.classList.add(chest.rarity);
            /** @type {HTMLSpanElement} */
            var nameLabel = this.card.querySelector('.shop-rarity-chest_name');
            nameLabel.innerText = this.localization.translate(chest.id);
            nameLabel.dataset.l10n = chest.id;

            infoButton.onclick = function () {
                _this2.infoSubscribers.forEach(function (sub) {
                    return sub(_this2, chest);
                });
            };

            if (chest.ad) {
                buyButton.hidden = true;
                watchAdButton.hidden = false;
                watchAdButton.onclick = function () {
                    _this2.actionSubscribers.forEach(function (sub) {
                        return sub(_this2, chest, true);
                    });
                };
            } else {
                watchAdButton.hidden = true;
                buyButton.hidden = false;
                buyButton.onclick = function () {
                    _this2.actionSubscribers.forEach(function (sub) {
                        return sub(_this2, chest, false);
                    });
                };
                /** @type {HTMLSpanElement} */
                var priceLabel = this.card.querySelector('.shop-rarity-chest_price');
                priceLabel.innerText = '' + chest.price;
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }]);
    return ShopRarityChest;
}();

var IAP = function () {
    /**
     * 
     * @param {import('./account')} account 
     * @param {import('./localization')} localization 
     * @param {import('./analytics-service')} analytics 
     * @param {import('./ads').AdManager} adManager 
     * @param {import('./config')} config 
     * @param {import('./audiomanager')} audioManager
     * @param {import('./armory-gear-menu')} armoryGearMenu
     */
    function IAP(account, localization, analytics, adManager, config, audioManager, armoryGearMenu) {
        (0, _classCallCheck3.default)(this, IAP);

        this.armoryGearMenu = armoryGearMenu;
        this.audioManager = audioManager;
        this.account = account;
        this.localization = localization;
        this.analytics = analytics;
        this.adManager = adManager;
        this.config = config;
        this.localInventory = {};
        this.timerStore = null;
        this.sectionTabs = null;
        /** @type {HTMLDivElement} */
        this.selectedTab = null;
        /** @type {HTMLDivElement} */
        this.currencySection = null;
        /** @type {HTMLDivElement} */
        this.chestsSection = null;
        /** @type {GearCardItemSmall[]} */
        this.currentChestItems = [];
        account.addEventListener('loadIAP', this.startTimersOnMenu.bind(this));
    }

    (0, _createClass3.default)(IAP, [{
        key: 'init',
        value: function init() {
            var _this3 = this;

            this.currencySection = document.querySelector('#shop-currency-section');
            this.chestsSection = document.querySelector('#shop-chests-section');
            /** @type{NodeListOf<HTMLDivElement>} */
            this.sectionTabs = document.querySelectorAll('#shop-section .window-tab');
            this.sectionTabs.forEach(function (tab) {
                tab.onclick = function () {
                    _this3.selectTab(tab);
                };

                if (!_this3.selectedTab && tab.dataset.tab === 'currency') {
                    _this3.selectTab(tab);
                }
            });
            this.loadLocalInventory();
            //TODO uncomment after early access
            //this.initIAPPacks();
            //TODO delete after early access
            this.currencySection.innerHTML = '<div class="coming-soon-container"><span class="h1 font-edit font-outline-black-4">COMING SOON</span></div>';

            this.initChests();
            this.buyButtonConfirmGP = null;
            this.buyButtonConfirmLTO = null;
            this.account.buyCallBack = this.buyCallBack.bind(this);
            this.contextualOfferPacks = [];
            this.contextualOffersModal = new MenuModal($('#modal-contextual-offers'));
            this.insufficientGoldModal = new MenuModal($('#insufficient-gold-modal'));

            $('.btn-offerwall').click(function () {
                if (_this3.account.profile.id) {
                    if (device.mobile) {
                        var openType = device.webview ? '_system' : '_blank';
                        var win = window.open('https://web.archive.org/web/20211102160635/https://publishers.revenueuniverse.com/wallresp/355/offers?uid=' + _this3.account.profile.id + '&sid3=' + uuidv4(), openType);
                        if (device.webview) {
                            var handleResumeEvent = function () {
                                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    _this3.analytics.navActionsEvent('Shop - Offerwall Clicked', 'Clicked', 'Offerwall', '');
                                                    _context2.next = 3;
                                                    return _this3.account.loadProfile(true);

                                                case 3:
                                                    document.removeEventListener('resume', handleResumeEvent, false);

                                                case 4:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this3);
                                }));

                                return function handleResumeEvent() {
                                    return _ref2.apply(this, arguments);
                                };
                            }();
                            document.addEventListener('resume', handleResumeEvent, false);
                        } else {
                            win.focus();
                            $(window).one('focus', function () {
                                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(e) {
                                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    _this3.analytics.navActionsEvent('Shop - Offerwall Clicked', 'Clicked', 'Offerwall', '');
                                                    _context3.next = 3;
                                                    return _this3.account.loadProfile(true);

                                                case 3:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this3);
                                }));

                                return function (_x3) {
                                    return _ref3.apply(this, arguments);
                                };
                            }());
                        }
                    } else {
                        var modalElement = $('#surviv-offerwall-modal');
                        var widthValue = window.innerWidth - 200 > 920 ? 920 : window.innerWidth - 200;
                        var heightValue = window.innerHeight - 150;
                        var borderSize = 34;
                        $('#start-main').hide();
                        if (device.mobile) {
                            heightValue = heightValue + 70;
                            widthValue = widthValue + 70;
                            borderSize = 18;
                        }
                        if (device.webview) {
                            _this3.adManager.hideBannerAd();
                        }
                        modalElement.html('<iframe src="https://web.archive.org/web/20211102160635/https://publishers.revenueuniverse.com/wallresp/355/offers?uid=' + _this3.account.profile.id + '&sid3=' + uuidv4() + '" style="border: ' + borderSize + 'px solid rgba(0, 0, 0, 0.85); border-radius: 10px;" width="' + widthValue + '" height="' + heightValue + '" scrolling="yes" frameborder="0"></iframe>');
                        modalElement.css('display', 'flex');
                        modalElement.one('click', function () {
                            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(e) {
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                survivLoading.showSurvivLoading();
                                                _this3.analytics.navActionsEvent('Shop - Offerwall Clicked', 'Clicked', 'Offerwall', '');
                                                e.stopPropagation();
                                                $('#start-main').show();
                                                if (device.webview) {
                                                    _this3.adManager.showBannerAd();
                                                }
                                                modalElement.css('display', 'none');
                                                modalElement.html('');
                                                _context4.next = 9;
                                                return _this3.account.loadProfile(true);

                                            case 9:
                                                survivLoading.hideSurvivLoading();

                                            case 10:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, _this3);
                            }));

                            return function (_x4) {
                                return _ref4.apply(this, arguments);
                            };
                        }());
                    }
                }
            });
            if (/surviviosteam/i.test(navigator.userAgent)) {
                // Remove offerwall button on Steam
                $('.btn-offerwall').remove();
            }

            //Confirm buy for lto pack
            this.ltoPackToBuy = null;
            $('.iap-lto-pack').click(function (e) {
                if (!self.account.unlinked) {
                    /*let modalElement = $('#iap-modal-confirm-buy-lto');
                    let buyConfirmModal = new MenuModal(modalElement);*/
                    var elementID = $(this).closest('div').prop('id');
                    elementID = elementID.split('-');
                    var id = elementID[3];
                    self.ltoPackToBuy = self.localInventory['lto_packs'][possibleOffers[id] + '_offer'];

                    /*modalElement.find('.iap-currency-text').html(self.ltoPackToBuy.price);
                    modalElement.find('.iap-loadout-items').css('display','block');
                    self.loadLoadoutItems(modalElement, self.ltoPackToBuy.items);*/

                    self.requestBuyBundle(self.ltoPackToBuy);
                    /*buyConfirmModal.show();
                    self.analytics.navActionsEvent('Shop - Item Bundle Clicked', (self.ltoPackToBuy.off + '%, ' + self.ltoPackToBuy.cost), self.ltoPackToBuy.description, self.ltoPackToBuy.items.toString());
                    if (!self.buyButtonConfirmLTO){
                        self.buyButtonConfirmLTO = $('#iap-btn-confirm-buy-lto');
                        self.buyButtonConfirmLTO.css('pointer-events', 'auto');
                        self.buyButtonConfirmLTO.click(function (e2) {
                            self.requestBuyBundle(self.ltoPackToBuy);
                        });
                    }*/
                }
            });

            $('.contextual-gp-pack').on('click', function (e) {
                if (!self.account.unlinked) {
                    var elementID = $(this).closest('div').prop('id');
                    elementID = elementID.split('-');
                    var id = elementID[3];

                    self.requestBuy(self.contextualOfferPacks[id]);
                }
            });
        }
    }, {
        key: 'goToTab',
        value: function goToTab(_tab) {
            var _this4 = this;

            this.sectionTabs.forEach(function (tab) {
                if (tab.dataset.tab === _tab) {
                    _this4.selectTab(tab);
                }
            });
        }
    }, {
        key: 'selectTab',
        value: function selectTab(tab) {
            if (tab === this.selectedTab) {
                return;
            }
            if (this.selectedTab) {
                this.selectedTab.classList.remove('selected');
            }
            this.selectedTab = tab;
            this.selectedTab.classList.add('selected');

            switch (this.selectedTab.dataset.tab) {
                case 'currency':
                    this.showCurrencySection();
                    break;
                case 'chests':
                    this.showChestsSection();
                    break;
                default:
                    break;
            }
        }
    }, {
        key: 'startIAPBuyPackExternalFlow',
        value: function startIAPBuyPackExternalFlow(pack) {
            if (this.account.unlinked) {
                this.account.emit('incentiveModal');
            } else {
                this.analytics.navActionsEvent('Shop - Gold Pack Clicked', this.priceToString(pack.cost), pack.description, '');
                this.config.set('beforeBuyContext', { window: 'store' }); //Set context to redirect after XSolla transaction
                this.requestIAPPurchaseToken(pack);
            }
        }
    }, {
        key: 'showCurrencySection',
        value: function showCurrencySection() {
            this.chestsSection.hidden = true;
            this.currencySection.hidden = false;
        }
    }, {
        key: 'showChestsSection',
        value: function showChestsSection() {
            this.currencySection.hidden = true;
            this.chestsSection.hidden = false;
        }
    }, {
        key: 'get_iap_by_id',
        value: function get_iap_by_id(itemID, input, isMobile) {
            var keyName = 'id';
            var objectInput = void 0;
            var foundObj = null;
            if (isMobile) {
                keyName = 'appStoreId';
                if (itemID.indexOf('google') !== -1) {
                    keyName = 'playStoreId';
                }
                objectInput = this.localInventory['gp_packs'];
            } else {
                objectInput = this.localInventory['lto_packs'];
            }
            for (var i = 0; i < 5; i++) {
                var storePack = objectInput['pack_' + (i + 1)];
                if (storePack[keyName] == itemID) {
                    foundObj = storePack;
                    break;
                }
            }
            return foundObj;
        }
    }, {
        key: 'requestSteamIAPPurchaseToken',
        value: function requestSteamIAPPurchaseToken(purchaseItem) {
            var _this5 = this;

            //We are running in electron, which equates to Steam, so use the steam wallet payment method.
            var purchase_request = {
                user: {
                    id: this.account.profile.userID
                },
                item: {
                    id: purchaseItem.id
                },
                steam_id: window.steam_id,
                mobile: device.mobile
            };
            //Get a valid IAP token from the store.
            $.ajax({
                type: 'POST',
                url: '/store/get_steam_purchase_token',
                data: (0, _stringify2.default)(purchase_request),
                contentType: 'application/json; charset=utf-8',
                timeout: 10 * 1000,
                success: function success(data) {
                    //console.log("Got a token, data is " + JSON.stringify(data));
                    if (data.storeURL) {
                        //console.log("Opening window to " + data.storeURL);
                        window.location.href = data.storeURL;
                        //window.open(data.storeURL);
                    }
                },
                error: function error(err) {
                    console.log('Got an error:' + (0, _stringify2.default)(err));
                    _this5.analytics.iapFails('na', purchaseItem.id, 'steam get token error');
                    _this5.buyCallBack(false);
                }
            });
        }
    }, {
        key: 'requestIAPPurchaseToken',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(purchaseItem) {
                var productId, data, _ref6, access_token, sandbox;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                this.analytics.iapAttempts(purchaseItem.cost, purchaseItem.id, purchaseItem.description);
                                window.localStorage.setItem('bha-attempt-' + this.account.profile.userID, (0, _stringify2.default)({ a: purchaseItem.id, b: purchaseItem.gp, c: purchaseItem.cost, d: purchaseItem.description }));

                                if (!(device.webview && window.store && device.version > '1.0.9')) {
                                    _context5.next = 8;
                                    break;
                                }

                                productId = device.os == 'ios' ? purchaseItem.appStoreId : purchaseItem.playStoreId;

                                window.store.order(productId);
                                survivLoading.showSurvivLoading();
                                _context5.next = 26;
                                break;

                            case 8:
                                if (!/surviviosteam/i.test(navigator.userAgent)) {
                                    _context5.next = 12;
                                    break;
                                }

                                this.requestSteamIAPPurchaseToken(purchaseItem);
                                _context5.next = 26;
                                break;

                            case 12:
                                data = {
                                    user: {
                                        id: this.account.profile.id
                                    },
                                    item: {
                                        id: purchaseItem.id
                                    },
                                    mobile: device.mobile
                                };
                                _context5.prev = 13;
                                _context5.next = 16;
                                return postRequest('/store/get_purchase_token', data);

                            case 16:
                                _ref6 = _context5.sent;
                                access_token = _ref6.token;
                                sandbox = _ref6.sandbox;

                                if (access_token) {
                                    XPayStationWidget.init({
                                        access_token: access_token,
                                        sandbox: sandbox,
                                        childWindow: device.mobile ? { target: '_self' } : undefined
                                    });
                                    XPayStationWidget.open();
                                } else {
                                    this.analytics.iapFails('na', purchaseItem.id, 'xsolla get token error');
                                    this.buyCallBack(false);
                                }
                                _context5.next = 26;
                                break;

                            case 22:
                                _context5.prev = 22;
                                _context5.t0 = _context5['catch'](13);

                                this.analytics.iapFails('na', purchaseItem.id, 'xsolla get token error');
                                this.buyCallBack(false);

                            case 26:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[13, 22]]);
            }));

            function requestIAPPurchaseToken(_x5) {
                return _ref5.apply(this, arguments);
            }

            return requestIAPPurchaseToken;
        }()
    }, {
        key: 'requestBuyBundle',
        value: function requestBuyBundle(bundle) {
            var _this6 = this;

            var purchase_request = {
                user: this.account.profile.userID,
                bundleId: bundle.id
            };
            survivLoading.showSurvivLoading();
            if (bundle.packs_left > 0 || this.timerStore) {
                if (this.account.profile.gpTotal >= bundle.price) {
                    ajaxRequest('store/purchase_item_bundle', purchase_request, function (err, res) {
                        if (err) {
                            console.log('Got an error:' + err);
                            _this6.buyCallBack(false);
                            survivLoading.hideSurvivLoading();
                        } else {
                            if (res.success) {
                                _this6.analytics.economyTransactionsBundle(bundle);
                                _this6.account.loadProfile(true);
                                var _iteratorNormalCompletion = true;
                                var _didIteratorError = false;
                                var _iteratorError = undefined;

                                try {
                                    for (var _iterator = (0, _getIterator3.default)(res.itemsData), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                        var item = _step.value;

                                        _this6.analytics.gearStatEvent(item.new_item_id, 'Got via Item Bundle', _this6.account.profile.username, 0, 0, 0);
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

                                _this6.updateLTOUI(bundle);
                            } else {
                                _this6.buyCallBack(false, res.error ? res.error : null, res.title ? res.title : null);
                                console.log('ERROR: Failed to buy exclusive offer');
                            }
                            survivLoading.hideSurvivLoading();
                        }
                    });
                } else {
                    this.showContextualOffer(bundle.price - this.account.profile.gpTotal, { window: 'store' });
                    survivLoading.hideSurvivLoading();
                }
            } else {
                this.buyCallBack(false, 'store-offer-already-bought', 'iap-transaction-unavailable');
                survivLoading.hideSurvivLoading();
            }
        }
    }, {
        key: 'updateLTOUI',
        value: function updateLTOUI(bundle) {
            var packs_left = bundle.packs_left - 1;
            this.localInventory['lto_packs'][bundle.type].packs_left = packs_left;
            var offerType = bundle.type.split('_')[0];
            var index = possibleOffers.indexOf(offerType);
            var ltoPackElement = $('#iap-lto-pack-' + index);

            if (packs_left < 1) {
                ltoPackElement.find('.iap-sold').css('display', 'block');
            }
        }
    }, {
        key: 'buyCallBack',
        value: function buyCallBack(successful) {
            var _this7 = this;

            var extraText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var modalElement = $('#iap-modal-successful');
            var modalFinishedTransaction = new MenuModal(modalElement);
            if (successful) {
                title ? modalElement.find('#iap-transaction-modal-title').html(this.localization.translate(title)) : modalElement.find('#iap-transaction-modal-title').html(this.localization.translate('iap-transaction-finished-title'));
                extraText ? modalElement.find('.modal-body-text').html(this.localization.translate('iap-transaction-successful') + "</br>" + (this.localization.translate(extraText) || extraText)) : modalElement.find('.modal-body-text').html(this.localization.translate('iap-transaction-successful'));
            } else {
                title ? modalElement.find('#iap-transaction-modal-title').html(this.localization.translate(title)) : modalElement.find('#iap-transaction-modal-title').html(this.localization.translate('iap-transaction-failed'));
                extraText ? modalElement.find('.modal-body-text').html(this.localization.translate('iap-transaction-error') + "</br>" + (this.localization.translate(extraText) || extraText)) : modalElement.find('.modal-body-text').html(this.localization.translate('iap-transaction-error'));
            }
            modalFinishedTransaction.show();
            modalFinishedTransaction.onHide(function () {
                if (extraText && extraText == 'store-offers-not-available') {
                    console.log('Updating offers...');
                    _this7.updateLTOs();
                }
            });
        }
    }, {
        key: 'renderProduct',
        value: function renderProduct(storeProduct, index) {
            var gpPackElement = $('#iap-gp-pack-' + index);
            var gpPackDebug = '';
            if (gpPackElement) {
                gpPackElement.find('.iap-price').html(storeProduct.price);
                gpPackDebug = gpPackDebug + (0, _stringify2.default)(storeProduct);
            }
            $('.ios-debug-iap').html(gpPackDebug);
        }
    }, {
        key: 'registerPack',
        value: function registerPack(product, index) {
            if (window.store) {
                var productId = device.os == 'ios' ? product.appStoreId : product.playStoreId;
                window.store.register({
                    id: productId,
                    type: window.store.CONSUMABLE
                });
                window.store.once(productId).loaded(function (storeProduct) {
                    if (device.os == 'ios') {
                        this.renderProduct(storeProduct, index);
                    }
                }.bind(this));
            }
        }
    }, {
        key: 'registerStorePacks',
        value: function registerStorePacks() {
            for (var i = 0; i < 4; i++) {
                var storePack = this.localInventory['gp_packs']['pack_' + (i + 1)];
                this.registerPack(storePack, i + 1);
            }
        }
    }, {
        key: 'loadLocalInventory',
        value: function loadLocalInventory() {
            this.localInventory['gp_packs'] = IAPPacks['gp_packs'];

            if (device.webview && device.version > '1.0.9' && window.store) {
                this.registerStorePacks();
                window.sandbox = false;
                window.store.validator = function (storeProduct, callback) {
                    if (window.store.getApplicationUsername()) {
                        var transaction = storeProduct.transaction;
                        var purchase_request = {
                            user: window.store.getApplicationUsername(),
                            transaction: transaction
                        };
                        $.ajax({
                            type: 'POST',
                            url: '/store/validate_transaction',
                            data: (0, _stringify2.default)(purchase_request),
                            contentType: 'application/json; charset=utf-8',
                            timeout: 10 * 1000,
                            success: function success(data) {
                                for (var i = 0, l = data.length; i < l; i++) {
                                    callback(true, { transaction: data[i] });
                                }
                            },
                            error: function error(err) {
                                survivLoading.hideSurvivLoading();
                                callback(false, err);
                            }
                        });
                    } else {
                        callback(false, {});
                    }
                }.bind(this);
                window.store.when('consumable order').approved(function (storeProduct) {
                    storeProduct.verify();
                }.bind(this));
                window.store.when('consumable order').verified(function (storeProduct) {
                    storeProduct.finish();
                    var productDef = this.get_iap_by_id(storeProduct.id, IAPPacks, true);
                    if (productDef) {
                        this.analytics.numPurchases++;
                        this.analytics.hardCurrencyBought = this.analytics.hardCurrencyBought + productDef.gp;
                        this.analytics.hardCurrencyBalance = this.analytics.hardCurrencyBalance + productDef.gp;
                        this.analytics.totalSpentInUsd = this.analytics.totalSpentInUsd + (parseInt(productDef.cost) / 100.0).toFixed(2);
                        this.analytics.iapTransactions(productDef.gp, productDef.cost, storeProduct.id, storeProduct.transaction.id, productDef.description);
                    }
                    this.account.loadProfile(true);
                    survivLoading.hideSurvivLoading();
                    this.buyCallBack(true);
                }.bind(this));
                window.store.when('consumable order').unverified(function (storeProduct) {
                    var productDef = this.get_iap_by_id(storeProduct.id, IAPPacks, true);
                    if (productDef) {
                        this.analytics.iapFails(storeProduct.transaction.id, productDef.id, 'transaction unverified');
                    }
                    survivLoading.hideSurvivLoading();
                    this.buyCallBack(false);
                }.bind(this));
                window.store.when('consumable order').cancelled(function (storeProduct) {
                    var productDef = this.get_iap_by_id(storeProduct.id, IAPPacks, true);
                    if (productDef) {
                        this.analytics.iapFails('na', productDef.id, 'transaction cancelled');
                    }
                    survivLoading.hideSurvivLoading();
                    this.buyCallBack(false);
                }.bind(this));
                window.store.when('consumable order').error(function (err) {
                    var bundleData = window.localStorage.getItem('bha-attempt-' + this.account.profile.userID);
                    if (bundleData) {
                        bundleData = JSON.parse(bundleData);
                        this.analytics.iapFails('na', bundleData.a, err.message);
                    }
                    survivLoading.hideSurvivLoading();
                    this.buyCallBack(false);
                }.bind(this));
                window.store.when('consumable order').updated(function (product) {
                    if (product && product.state == 'valid') {
                        survivLoading.hideSurvivLoading();
                        if (this.purchaseInitiatedStart) {
                            var bundleData = window.localStorage.getItem('bha-attempt-' + this.account.profile.userID);
                            this.analytics.iapFails('na', bundleData.a, 'payment error');
                            this.purchaseInitiatedStart = false;
                        }
                    }
                    if (product && product.state == 'initiated') {
                        this.purchaseInitiatedStart = true;
                    }
                }.bind(this));
                window.store.refresh();

                //Workaround for ios in app purchases issue (Not setting the store ready to true).
                if (device.os == 'ios' && window.store.ready() == false) {
                    window.store.ready(true);
                }
            }
        }
    }, {
        key: 'updateLTOs',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(openStore) {
                var _this8 = this;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                survivLoading.showSurvivLoading();
                                ajaxRequest('/api/user/get_offers', function (err, res) {
                                    if (err) {
                                        survivLoading.hideSurvivLoading();
                                        console.log(err);
                                    } else {
                                        if (res.success) {
                                            _this8.localInventory['lto_packs'] = res.offers;
                                            _this8.loadLTOPacks(res.state);

                                            if (!_this8.account.unlinked) {
                                                if (res.state) {
                                                    _this8.analytics.navActionsEvent('Home', 'Entered Shop', 'Entered Shop - Offers Requested', 'Offers Expired');
                                                } else if (openStore) {
                                                    _this8.analytics.navActionsEvent('Home', 'Entered Shop', 'Shop (Button)', '');
                                                }
                                            }
                                        } else {
                                            survivLoading.hideSurvivLoading();
                                            console.log('ERROR: Failed to retrieve or generate offers');
                                        }
                                    }
                                });

                            case 2:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function updateLTOs(_x8) {
                return _ref7.apply(this, arguments);
            }

            return updateLTOs;
        }()
    }, {
        key: 'loadLTOPacks',
        value: function loadLTOPacks(newOffers) {
            //Loads LTO packs
            var ltoPacks = this.localInventory['lto_packs'];
            for (var i = 1; i < 3; i++) {
                var ltoPackElement = $('#iap-lto-pack-' + i);
                var ltoPack = ltoPacks[possibleOffers[i] + '_offer'];
                if (ltoPack) {
                    var discount = ltoPack.discount;
                    ltoPackElement.find('.iap-loadout-items').css('display', 'block');
                    ltoPackElement.find('.iap-price').css('opacity', '1.0');
                    ltoPackElement.find('span').css('opacity', '1.0');
                    ltoPackElement.find('.iap-currency-container').removeAttr('background');
                    ltoPackElement.find('.iap-currency-text').html(ltoPack.price);
                    if (discount) {
                        ltoPackElement.find('.iap-discount').css('display', 'block');
                        ltoPackElement.find('.iap-discount').html(discount + '% OFF'); //${this.localization.translate('iap-price-off')}
                    } else ltoPackElement.find('.iap-discount').css('display', 'none');
                    if (ltoPack.packs_left < 1) {
                        ltoPackElement.find('.iap-sold').css('display', 'block');
                    }
                    this.loadLoadoutItems(ltoPackElement, ltoPack.items);
                    if (newOffers) {
                        this.analytics.navActionsEvent('Shop - Offer Loaded', ltoPack.type, ltoPack.discount + '%, ' + ltoPack.price, ltoPack.items.toString());
                    }
                } else {
                    ltoPackElement.find('.iap-currency-text').html(this.localization.translate('iap-sold-out'));
                    ltoPackElement.find('.iap-currency-container').css('background', 'none');
                    ltoPackElement.find('.iap-price').css('opacity', '0.0');
                    ltoPackElement.find('span').css('opacity', '0.0');
                    ltoPackElement.find('.iap-discount').css('display', 'none');
                    ltoPackElement.find('.iap-loadout-items').css('display', 'none');
                }
            }
            this.startOffersTimer(parseInt(ltoPacks['small_offer'].generated) + parseInt(ltoPacks['small_offer'].timeAvailable), this.localization);
            survivLoading.hideSurvivLoading();
        }
    }, {
        key: 'priceToString',
        value: function priceToString(price) {
            //TODO: This should use the pricing currency and locale from the user, and not necessarily USD
            return (price / 100).toLocaleString("en-US", { style: "currency", currency: "USD" });
        }
    }, {
        key: 'initIAPPacks',
        value: function initIAPPacks() {
            var _this9 = this;

            //Loads GP packs
            var gpPacks = this.localInventory['gp_packs'];
            var parent = new DocumentFragment();
            var iapGoldPacks = (0, _values2.default)(gpPacks).map(function (pack) {
                return new IAPGoldPack(parent, pack);
            });
            iapGoldPacks.forEach(function (iapPack) {
                iapPack.onBuyClick(function (_, pack) {
                    return _this9.startIAPBuyPackExternalFlow(pack);
                });
            });
            var packList = document.querySelector('#shop-iap-pack-list');
            packList.appendChild(parent);
        }
    }, {
        key: 'initChests',
        value: function initChests() {
            var _this10 = this;

            this.chestInfoModal = new MenuModal($('#rarity-chest-info-modal'));

            this.chestInfoModal.onHide(function () {
                _this10.currentChestItems.forEach(function (item) {
                    return item.destroy();
                });
            });
            /** @type {HTMLButtonElement} */
            var okButton = document.querySelector('#rarity-chest-info-modal_ok-btn');
            okButton.onclick = function () {
                _this10.chestInfoModal.hide();
            };
            var chestsDefs = AVAILABLE_CHESTS.map(function (id) {
                return GameObjectDefs[id];
            });
            var parent = new DocumentFragment();
            var chests = chestsDefs.map(function (chest) {
                return new ShopRarityChest(parent, chest, _this10.localization);
            });
            chests.forEach(function (chest) {
                chest.onActionButtonClick(function (chestItem, chest, isAd) {
                    return _this10.onChestActionButtonClick(chestItem, chest, isAd);
                });
                chest.onInfoButtonClick(function (chestItem, chest) {
                    return _this10.showChestInfoModal(chest);
                });
            });
            var packList = document.querySelector('#shop-chests-list');
            packList.appendChild(parent);
        }

        /**
         * 
         * @param {ShopRarityChest} chestItem 
         * @param {typeof import('./../../../data/game/game-objects/loot-boxes')['loot_box_01']} chest 
         * @param {boolean} isAd 
         * @returns 
         */

    }, {
        key: 'onChestActionButtonClick',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(chestItem, chest, isAd) {
                var _this11 = this;

                var userGp, requiredGold, goldLabel, buyButton, _ref9, id, type, items, itemModal;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                if (!this.account.unlinked) {
                                    _context7.next = 3;
                                    break;
                                }

                                this.account.emit('incentiveModal');
                                return _context7.abrupt('return');

                            case 3:
                                if (!isAd) {
                                    _context7.next = 5;
                                    break;
                                }

                                return _context7.abrupt('return', window.alert('NOT IMPLEMENTED YET'));

                            case 5:
                                userGp = this.account.profile.gpTotal;

                                if (!(userGp < chest.price)) {
                                    _context7.next = 14;
                                    break;
                                }

                                requiredGold = chest.price - userGp;

                                this.insufficientGoldModal.show();
                                /** @type{HTMLSpanElement} */
                                goldLabel = document.querySelector('#insufficient-gold-modal #insufficient-required-gold');

                                goldLabel.innerText = '' + requiredGold;

                                /** @type{HTMLButtonElement} */
                                buyButton = document.querySelector('#insufficient-gold-modal .ok-modal-btn');

                                buyButton.onclick = function () {
                                    _this11.insufficientGoldModal.hide();
                                    _this11.goToTab('currency');
                                };
                                return _context7.abrupt('return');

                            case 14:
                                _context7.prev = 14;
                                _context7.next = 17;
                                return this.account.openChest(chest);

                            case 17:
                                _ref9 = _context7.sent;
                                id = _ref9.itemId;
                                type = _ref9.item;
                                items = [{
                                    id: id,
                                    type: type,
                                    fromChest: true,
                                    level: 1
                                }];
                                //console.log('(onChestActionButtonClick)', itemType);

                                itemModal = new ModalSeasonRewards(this.account, this.localization, this.armoryGearMenu, items, null, null, {
                                    title: 'item-won',
                                    subtitle: 'from-chest-' + chest.rarity,
                                    rarity: chest.rarity,
                                    chestModal: true
                                });

                                itemModal.show();
                                _context7.next = 28;
                                break;

                            case 25:
                                _context7.prev = 25;
                                _context7.t0 = _context7['catch'](14);

                                console.error(_context7.t0);

                            case 28:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[14, 25]]);
            }));

            function onChestActionButtonClick(_x9, _x10, _x11) {
                return _ref8.apply(this, arguments);
            }

            return onChestActionButtonClick;
        }()

        /**
         * 
         * @param {typeof import('./../../../data/game/game-objects/loot-boxes')['loot_box_01']} chest
         */

    }, {
        key: 'showChestInfoModal',
        value: function showChestInfoModal(chest) {
            var _this12 = this;

            var modal = document.querySelector('#rarity-chest-info-modal');
            /** @type {HTMLDivElement} */
            var modalContent = modal.querySelector('.modal-content');
            modalContent.classList.remove(modalContent.dataset.rarity);
            modalContent.dataset.rarity = chest.rarity;
            modalContent.classList.add(modalContent.dataset.rarity);

            /** @type {HTMLDivElement} */
            var oddsInfo = modal.querySelector('#rarity-chest-info-modal_odds');
            oddsInfo.classList.remove(oddsInfo.dataset.rarity);
            oddsInfo.dataset.rarity = chest.rarity;
            oddsInfo.classList.add(oddsInfo.dataset.rarity);
            removeChildren(oddsInfo);
            var rarityOdds = chest.probabilities.filter(function (prob) {
                return prob.weight > 0.0;
            });
            rarityOdds.forEach(function (prob, index, arr) {
                var localizedText = _this12.localization.translate('chest-odds-' + Num2RarityText[prob.rarity]).replace('[prob]', '' + prob.weight * 100);
                var label = '\n            <span class="rarity-chest-info-odd-text">\n                ' + localizedText + '\n            </span>';
                oddsInfo.innerHTML += label;

                if (index < arr.length - 1) {
                    oddsInfo.innerHTML += '<span class="rarity-chest-bar ' + chest.rarity + '"></span>';
                }
            });

            var itemsContainer = modal.querySelector('#rarity-chest-info-modal_items');
            /** @type {HTMLElement} */
            var header = modal.querySelector('.modal-header h2');
            header.innerText = this.localization.translate(chest.id);
            header.dataset.l10n = chest.id;
            this.currentChestItems.forEach(function (item) {
                return item.destroy();
            });
            var itemsFragment = new DocumentFragment();
            /** @type {typeof import('./../../../data/game/game-objects/loot-pools')['common_chest']} */
            var pool = GameObjectDefs[chest.lootPool];
            this.currentChestItems = pool.items.map(function (itemId) {
                return new GearCardItemSmall(itemsFragment, GameObjectDefs[itemId]);
            });
            itemsContainer.appendChild(itemsFragment);
            this.chestInfoModal.show();
            this.startRouletteSpin(pool, 'helmet_nordicheadguard');
        }
    }, {
        key: 'startRouletteSpin',
        value: function startRouletteSpin(pool, itemType) {
            /*this.rouletter = $('#rarity-chest-info-roulette');
            const index = pool.items.findIndex(item => item === itemType);
            const fragment = new DocumentFragment();
            for (let i = 0; i < 60; i++) {
                let itemType = pool.items[Math.floor(Math.random() * pool.items.length)];
                if (i == 56) {
                    itemType = pool.items[index];
                }
                console.log('(startRouletteSpin)', itemType);
                let itemDef = GameObjectDefs[itemType];
                const item = new GearCardItemSmall(fragment, itemDef);
            }
            this.rouletter.append(fragment);
            let p = {
                itemSelector: '.gear-card-item-small',
                audioManager: this.audioManager,
                stopCallback: function () {
                    var self = this;
                    setTimeout(function () {
                        self.showRewardScreen();
                        self.audioManager.playSound('get_item_01',
                        {
                            channel: 'ui',
                            delay: 0.0,
                            forceStart: true
                        });
                    }, 1000);
                }.bind(this)
            };
             this.rouletter.roulette(p);
            this.rouletter.roulette('start');/*
             */

            /*const rouletteElement = document.querySelector('#rarity-chest-info-roulette');
            const roulette = new RouletteJs({
                stopImageNumber: 4
            });
            const rouletteFragment = new DocumentFragment();
            pool.items.map((itemId) => {
                return new GearCardItemSmall(rouletteFragment, GameObjectDefs[itemId]);
            });
            rouletteElement.appendChild(rouletteFragment);
            roulette.init(rouletteElement, '.gear-card-item-small');
            roulette.start();*/
        }
    }, {
        key: 'loadLoadoutItems',
        value: function loadLoadoutItems(parentElement, items) {
            var divItems = parentElement.find('.iap-loadout-items > div');
            divItems.html('');
            var pool = items;
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
                return a.rarity > b.rarity ? 1 : -1;
            });
            var orderPoolLength = orderPool.length;
            for (var _i = 0; _i < orderPoolLength; _i++) {
                var img = $('<div>');
                var svg = helpers.getSvgFromGameType(orderPool[_i].itemType);
                img.addClass('iap-item-img');
                var rarity = GameObjectDefs[orderPool[_i].itemType];
                if (orderPoolLength > 3) {
                    img.css({
                        border: '4px solid ' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].color,
                        'background-color': '' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].backgroundColor,
                        'background-image': 'url("../' + svg + '")'
                    });
                } else {
                    img.css({
                        border: '2px solid ' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].color,
                        'background-color': '' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].backgroundColor,
                        'background-image': 'url("../' + svg + '")'
                    });
                }

                //Item rarity icon

                var itemRarity = $('<div>');
                itemRarity.addClass('item-rarity-style');
                itemRarity.css({ 'background-color': '' + Rarities[helpers.getRarityFromGameType(orderPool[_i].itemType)].color });
                var itemRarityImage = $('<div>');
                itemRarityImage.addClass('dark item-' + rarity.type);
                itemRarity.append(itemRarityImage);
                img.append(itemRarity);

                img.appendTo(divItems);
            }
        }
    }, {
        key: 'startTimersOnMenu',
        value: function startTimersOnMenu() {
            //TODO delete or check that this works for BHA
            /*ajaxRequest('/api/user/load_previous_offers', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    if (res.success && res.offers['small_offer']) {
                        this.startOffersTimer(parseInt(res.offers['small_offer'].generated) + parseInt(res.offers['small_offer'].timeAvailable), this.localization);
                    }
                    else {
                        console.log('ERROR: Failed to retrieve or generate offers');
                    }
                }
            });*/
        }
    }, {
        key: 'startOffersTimer',
        value: function startOffersTimer(endDate, localization) {
            if (this.timerStore) {
                clearInterval(this.timerStore);
            }

            // Update the count down every 1 second
            this.timerStore = setInterval(function () {
                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = endDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
                var seconds = Math.floor(distance % (1000 * 60) / 1000);

                $('#iap-lto-time-left-number').text(": " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
                $('#index-offer-time-left').text(": " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ");

                // If the count down is finished, write some text
                if (distance < 0) {
                    clearInterval(this.timerStore);
                    $('#iap-lto-time-left-number').text(": " + localization.translate('timer-ready'));
                    $('#index-offer-time-left').text(": " + localization.translate('timer-ready'));
                }
            }, 1000);
        }
    }, {
        key: 'showContextualOffer',
        value: function showContextualOffer(minGPNeeded) {
            var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (minGPNeeded && minGPNeeded > 0) {
                this.config.set('beforeBuyContext', context); //Set context to redirect after XSolla transaction
                var modalElement = $('#modal-contextual-offers');
                var firstPackElement = $('#contextual-offer-pack-0');
                var secondPackElement = $('#contextual-offer-pack-1');

                var gpPacks = this.localInventory['gp_packs'];
                this.contextualOfferPacks = [];

                //Select the pack to complete the minGPNeeded, and the next pack
                for (var i = 1; i < 5; i++) {
                    var gpPack = gpPacks['pack_' + i];
                    if (gpPack && gpPack.gp >= minGPNeeded) {
                        this.contextualOfferPacks.push(gpPack);
                        if (i == 4 && this.contextualOfferPacks.length < 2) this.contextualOfferPacks.unshift(gpPacks['pack_' + (i - 1)]);else if (this.contextualOfferPacks.length == 2) break;
                    }
                }

                //If there are no packs selected, means that the minGPNeeded is bigger than the possible packs
                //So show the biggest packs available
                if (this.contextualOfferPacks.length == 0) {
                    this.contextualOfferPacks.push(gpPacks['pack_' + 3]);
                    this.contextualOfferPacks.push(gpPacks['pack_' + 4]);
                }

                //Prepare contextual offer modal and show it
                modalElement.find('#contexutal-offer-text').html(this.localization.translate('contextual-offer-text-1') + (' ' + minGPNeeded + ' ') + this.localization.translate('contextual-offer-text-2') + '</br>' + this.localization.translate('contextual-offer-text-3'));

                firstPackElement.find('.iap-currency-text').html(this.contextualOfferPacks[0].gp);
                firstPackElement.find('.iap-price').html(this.priceToString(this.contextualOfferPacks[0].cost));

                secondPackElement.find('.iap-currency-text').html(this.contextualOfferPacks[1].gp);
                secondPackElement.find('.iap-price').html(this.priceToString(this.contextualOfferPacks[1].cost));

                this.contextualOffersModal.show();
            } else {
                //Show old modal of not enough GP if minGPNeeded is not provided
                this.noGPModal = new MenuModal($('#modal-no-gp'));
                this.noGPModal.show();
            }
        }
    }]);
    return IAP;
}();

module.exports = IAP;
