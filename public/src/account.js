"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require("./9bc388c8.js");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require("./2f756df0.js");

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var api = require("./api.js");
var helpers = require("./helpers.js");
var FirebaseManager = require("./FirebaseManager.js");
var loadouts = require("./loadouts.js");
var MenuModal = require("./menuModal.js");
var GameObjectDefs = require("./gameObjectDefs.js");
/*const Ads = require('./ads.js');
const AnalyticsService = require('./analytics-service.js');
const Config = require('./config.js');
const Localization = require('./localization.js');*/
var survivLoading = require("./survivLoading.js");

//
// ajaxRequest
//
function _ajaxRequest(url, data, cb) {
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

    return $.ajax(opts).done(function (res, status) {
        cb(null, res);
    }).fail(function (err) {
        cb(err);
    });
}

//
// Account
//

var Account = function () {
    function Account(config, analytics, ads, localization) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Account);

        this.config = config;

        this.events = {};
        this.requestsInFlight = 0;
        this.loggingIn = false;
        this.loggedIn = false;

        this.profile = {};
        this.loadout = loadouts.defaultLoadout();
        this.loadoutPriv = '';
        this.loadoutStats = '';
        this.items = [];
        this.quests = [];
        this.questPriv = '';
        this.pass = {};
        this.buyCallBack = function (a) {};
        this.analytics = analytics;

        this.unlinked = true;
        this.localization = localization;
        /*this.config = new Config();
        this.localization = new Localization();
        this.analytics = new AnalyticsService(this.localization);
        this.adManager = new Ads.AdManager(this.config, this.analytics);*/
        this.adManager = ads;

        //@TEMPORAL SAVE
        this.saveSkin = null;
        /* strip_from_prod_client:begin */
        // Test functions
        window.login = function () {
            _this.login();
        };
        window.deleteAccount = function () {
            _this.deleteAccount();
        };
        window.deleteItems = function () {
            _this.ajaxRequest('/api/user/delete_items', {}, function (err, res) {
                _this.loadProfile();
            });
        };
        window.unlock = function (type) {
            //console.log(`Unlocking ${type}`);
            _this.unlock(type);
        };
        window.setQuest = function (questType, idx) {
            idx = idx || 0;
            _this.ajaxRequest('/api/user/set_quest', { questType: questType, idx: idx }, function (err, res) {
                _this.getPass();
            });
        };
        window.refreshQuest = function (idx) {
            _this.refreshQuest(idx);
        };
        window.setPassUnlock = function (unlockType) {
            _this.setPassUnlock(unlockType);
        };

        /* strip_from_prod_client:end */
    }

    (0, _createClass3.default)(Account, [{
        key: 'ajaxRequest',
        value: function ajaxRequest(url, data, cb) {
            var _this2 = this;

            if (typeof data == 'function') {
                cb = data;
                data = null;
            }

            this.requestsInFlight++;
            this.emit('request', this);

            _ajaxRequest(url, data, function (err, res) {
                cb(err, res);

                _this2.requestsInFlight--;

                _this2.emit('request', _this2);
                if (_this2.requestsInFlight == 0) {
                    _this2.emit('requestsComplete');
                }
            });
        }
    }, {
        key: 'ajaxRequestAsync',
        value: function ajaxRequestAsync(url, data) {
            var _this3 = this;

            return new _promise2.default(function (resolve, reject) {
                _this3.ajaxRequest(url, data, function (err, res) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res);
                });
            });
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
        key: 'init',
        value: function init() {
            if (this.config.get('sessionCookie')) {
                this.setSessionCookies();
            }
            if (helpers.getCookie('app-data')) {
                this.unlinked = false;
                this.login(true);
            } else {
                if (helpers.getCookie('register-data')) {
                    this.emit('confirmRegister');
                } else {
                    if (!this.config.get('BHAIdUnlinked')) {
                        // this.emit('showLoginModal');
                        this.emit('logout');
                    } else {
                        this.loginUnlinked(true);
                    }
                }
            }
        }
    }, {
        key: 'setSessionCookies',
        value: function setSessionCookies() {
            this.clearSessionCookies();
            if (this.config.get('sessionCookie').indexOf('path=') !== -1) {
                document.cookie = this.config.get('sessionCookie');
            } else {
                document.cookie = this.config.get('sessionCookie') + ';path=/;';
            }

            document.cookie = 'app-data=' + Date.now() + ';path=/;';
        }
    }, {
        key: 'clearSessionCookies',
        value: function clearSessionCookies() {
            document.cookie = 'app-sid=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
            document.cookie = 'app-data=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
        }
    }, {
        key: 'loginWithAccessToken',
        value: function loginWithAccessToken(authUrl, requestTokenFn, extractTokenFn, requestQuery) {
            var _this4 = this;

            requestTokenFn(function (err, data) {
                if (err) {
                    // @TODO: Previously this cleared all old modals;
                    // test to make sure this looks okay

                    _this4.emit('error', 'login_failed');
                    return;
                }

                var token = extractTokenFn(data);
                var requestUrl = authUrl;
                if (requestQuery) {
                    requestUrl = requestUrl + requestQuery + ('&access_token=' + token);
                } else {
                    requestUrl = requestUrl + ('?access_token=' + token);
                }
                _this4.ajaxRequest(requestUrl, function (err, res) {
                    // @TODO: Previously this cleared all old modals;
                    // test to make sure this looks okay

                    if (err) {
                        _this4.emit('error', 'login_failed');
                    } else {
                        if (res.cookie) {
                            _this4.config.set('sessionCookie', res.cookie);
                            _this4.setSessionCookies();
                        }
                        if (window.cordova) {
                            window.location.reload(true);
                        } else {
                            _this4.login();
                        }
                    }
                });
            });
        }
    }, {
        key: 'login',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (start) {
                                    this.detectXsollaInvoiceParams();
                                }

                                if (helpers.getCookie('app-data')) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 3:
                                _context.next = 5;
                                return this.loadProfile();

                            case 5:
                                _context.next = 7;
                                return this.getPass(true, null, false, true);

                            case 7:
                                this.getUserCurrency(start);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function login() {
                return _ref.apply(this, arguments);
            }

            return login;
        }()
    }, {
        key: 'loginUnlinked',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.loadProfile();

                            case 2:
                                $('#player-name-input-solo').val("BHA#" + this.profile.id);
                                _context2.next = 5;
                                return this.getPass(true, null, false, true);

                            case 5:
                                this.getUserCurrency(start);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function loginUnlinked() {
                return _ref2.apply(this, arguments);
            }

            return loginUnlinked;
        }()
    }, {
        key: 'logout',
        value: function logout() {
            this.config.set('profile', null);
            this.config.set('sessionCookie', null);

            this.ajaxRequest('/api/user/logout', function (err, res) {
                window.location.reload();
            });
        }
    }, {
        key: 'loadProfileAux',
        value: function loadProfileAux(err, res, reloadgp) {
            var _this5 = this;

            var isLoggingIn = this.loggingIn;
            this.loggingIn = false;
            this.loggedIn = false;
            this.profile = {};
            this.loadout = loadouts.defaultLoadout();
            this.loadoutIds = loadouts.defaultLoadoutIds();
            this.loadoutPriv = '';
            this.loadoutStats = '';
            this.items = [];

            if (err) {
                FirebaseManager.storeGeneric('account', 'load_profile_error');
            } else if (res.banned) {
                this.emit('error', 'account_banned', res.reason);
            } else if (res.temporaryBan) {
                this.emit('banError', 'account_banned', res.reason);
            } else if (res.error_link) {
                this.config.set('BHAIdUnlinked', null);
                this.emit('error', 'unlinked_account_error');
            } else if (res.success) {
                this.loggedIn = true;
                this.profile = res.profile;
                this.loadout = res.loadout;
                this.loadoutIds = res.loadoutIds;
                this.loadoutPriv = res.loadoutPriv;
                this.loadoutStats = res.loadoutStats;
                this.items = res.items;
                this.bonusEvents = res.profile.stimEvents;
                // Store profile slug in localStorage so the stats page has access
                var configProfile = this.config.get('profile') || {};
                configProfile.slug = res.profile.slug;
                configProfile.kpg = res.profile.kpg;

                if (window.store && res.profile.id) {
                    window.store.applicationUsername = res.profile.id;
                }
                this.profile.showSlug = this.profile.slug;
                this.profile.unlinked = this.unlinked;

                if (!this.unlinked) {
                    this.profile.showSlug = this.profile.battletagDisplay != '' ? this.profile.battletagDisplay : this.profile.username;
                } else {
                    this.profile.showSlug = 'BHA#' + this.profile.id;
                }
                //this.syncForte();
                this.analytics.setPlayerData(res.profile);
                this.config.set('profile', configProfile);
                this.config.set('playerName', res.profile.username);
                this.adManager.setPlayerID(res.profile.id);

                this.profile.unlinked = this.unlinked;
                if (this.unlinked) {
                    this.profile.slugShow = 'BHA#' + this.profile.id;
                } else {
                    this.profile.slugShow = res.profile.username;
                }
                if (this.profile.offerwallGpWon) {
                    this.analytics.economyTransactions('Gold Got', parseInt(this.profile.offerwallGpWon), 0, '', 'Offerwall Completed');
                    $('#surviv-modal-offerwall-reward').show();
                    $('#offerwall-reward-won-box').html(this.profile.offerwallGpWon);
                    $('#surviv-modal-offerwall-reward').one('click', function (event) {
                        event.stopPropagation();
                        $('#surviv-modal-offerwall-reward').hide();
                    });
                }
                var linkErrorCookie = helpers.getCookie('link-account-error');
                if (linkErrorCookie) {
                    this.emit('error', linkErrorCookie);
                }

                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var prestigeDate = new Date(this.profile.prestigeChangeTime);
                if (prestigeDate < today) {}
                // this.resetPrestigePoints();


                //Show gift modal if there is a pending gift
                if (this.profile.gift && this.profile.gift.hasPendingGift) {
                    var notificationModalElement = $('#free-GBP-modal-notification');
                    var notificationFreeGiftModal = new MenuModal(notificationModalElement);

                    notificationModalElement.find('#free-GBP-amount').html(this.profile.gift.gp);
                    if (this.profile.gift.description) {
                        notificationModalElement.find('.free-GBP-modal-text-container').css('display', 'block');
                        notificationModalElement.find('#free-GBP-optional-msg').html(this.localization.translate(this.profile.gift.description));
                    } else notificationModalElement.find('.free-GBP-modal-text-container').css('display', 'none');

                    if (!this.unlinked) notificationModalElement.find('#free-GBP-unlinked-msg').css('display', 'none');else notificationModalElement.find('#free-GBP-unlinked-msg').css('display', 'block');

                    notificationFreeGiftModal.show();

                    notificationFreeGiftModal.onHide(function () {
                        _this5.ajaxRequest('/api/user/add_user_gift', function (err, res) {
                            if (res && res.success) {
                                _this5.loadProfile(true);
                            }
                            if (res && res.err) {
                                _this5.emit('error', err);
                            }
                        });
                    });
                }

                if (reloadgp) {
                    this.emit('request', this);
                }
            } else {
                this.config.set('BHAIdUnlinked', null);
            }

            if (!res || !res.success) {
                this.profile.unlinked = true;
            }

            if (!this.loggedIn) {
                this.config.set('sessionCookie', null);
            }

            if (isLoggingIn && this.loggedIn) {
                this.emit('login', this);
            }

            if (this.loggedIn && !this.unlinked) {
                this.emit('loadIAP', this);
            }

            this.emit('profileLoaded', this);
            this.emit('loadout', this.loadout, this.loadoutIds);
            this.emit('items', this.items);
            this.emit('stimevents', this.bonusEvents);

            this.setDiscordRP(1);
        }
    }, {
        key: 'setDiscordRP',
        value: function setDiscordRP(RPType, gameIdx, players, maxPlayers, teamURL) {
            //TODO implement discord rich presence
            /*if (this.profile.linkedDiscord) {
                ajaxRequest('/api/user/set_discord_RP', { RPmsj : RPType, mode : gameIdx, players:players, maxPlayers:maxPlayers, teamURL:teamURL}, (err, res) => {
                    if (res && res.err) {
                        this.emit('error', err);
                    }
                });
            }*/
        }
    }, {
        key: 'detectXsollaInvoiceParams',
        value: function detectXsollaInvoiceParams() {
            var urlString = window.location.href;
            var params = {};
            if (urlString.indexOf('/?') !== -1) {
                var urlSearch = urlString.split('/?')[1];
                var urlParams = urlSearch.split('&');

                for (var i = 0, l = urlParams.length; i < l; i++) {
                    var param = urlParams[i].split('=');
                    params[param[0]] = param[1];
                }
            }
            if (params.user_id && params.status && params.invoice_id) {
                survivLoading.showSurvivLoading();
                this.params = params;
                window.history.replaceState({}, document.title, '/');
            }
        }
    }, {
        key: 'loadProfile',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(reloadgp) {
                var _this6 = this;

                var readProfileLoginUser, _ref4, _ref5, err, res, userId, readProfileAnonymous, _ref6, _ref7, _err, _res;

                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.loggingIn = !this.loggedIn;

                                if (!helpers.getCookie('app-data')) {
                                    _context3.next = 12;
                                    break;
                                }

                                readProfileLoginUser = function readProfileLoginUser() {
                                    return new _promise2.default(function (resolve, reject) {
                                        _this6.ajaxRequest('/api/user/profile', function (err, res) {
                                            if (res && res.profile && res.profile.linked) {
                                                _this6.config.set('BHAIdUnlinked', null);
                                            }
                                            if (res && res.err) {
                                                _this6.emit('error', err);
                                            }
                                            resolve([err, res]);
                                        });
                                    });
                                };

                                _context3.next = 5;
                                return readProfileLoginUser();

                            case 5:
                                _ref4 = _context3.sent;
                                _ref5 = (0, _slicedToArray3.default)(_ref4, 2);
                                err = _ref5[0];
                                res = _ref5[1];


                                this.loadProfileAux(err, res, reloadgp);

                                _context3.next = 22;
                                break;

                            case 12:
                                userId = this.config.get('BHAIdUnlinked');

                                readProfileAnonymous = function readProfileAnonymous(userId) {
                                    return new _promise2.default(function (resolve, reject) {
                                        _this6.ajaxRequest('/api/user/profile_unlinked', { userId: userId }, function (err, res) {
                                            resolve([err, res]);
                                        });
                                    });
                                };

                                _context3.next = 16;
                                return readProfileAnonymous(userId);

                            case 16:
                                _ref6 = _context3.sent;
                                _ref7 = (0, _slicedToArray3.default)(_ref6, 2);
                                _err = _ref7[0];
                                _res = _ref7[1];

                                this.loadProfileAux(_err, _res, reloadgp);
                                if (_res && _res.error) {
                                    this.emit('error', _res.error);
                                }

                            case 22:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function loadProfile(_x3) {
                return _ref3.apply(this, arguments);
            }

            return loadProfile;
        }()
    }, {
        key: 'resetStats',
        value: function resetStats() {
            var _this7 = this;

            this.ajaxRequest('/api/user/reset_stats', function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'reset_stats_error');
                    _this7.emit('error', 'server_error');
                    return;
                }
            });
        }
    }, {
        key: 'resetPrestigePoints',
        value: function resetPrestigePoints() {
            var _this8 = this;

            this.ajaxRequest('/api/user/reset_prestige_points', function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'reset_prestige_points_error');

                    _this8.emit('error', 'server_error');
                    return;
                }
            });
        }
    }, {
        key: 'resetUserPrestige',
        value: function resetUserPrestige() {
            var _this9 = this;

            this.ajaxRequest('/api/user/reset_user_prestige', function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'reset_user_prestige_error');

                    _this9.emit('error', 'server_error');
                    return;
                }
            });
        }
    }, {
        key: 'getUserPrestige',
        value: function getUserPrestige() {
            var _this10 = this;

            this.ajaxRequest('/api/user/get_user_prestige', function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'get_prestige_error');
                    return;
                } else if (res) {
                    _this10.emit('prestige', res);
                }
            });
        }
    }, {
        key: 'deleteAccount',
        value: function deleteAccount() {
            var _this11 = this;

            this.ajaxRequest('/api/user/delete', function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'delete_error');
                    _this11.emit('error', 'server_error');
                    return;
                }

                _this11.config.set('profile', null);
                _this11.config.set('sessionCookie', null);

                window.location.reload();
            });
        }

        /**
         * 
         * @param {string} username 
         * @returns 
         */

    }, {
        key: 'setUsername',
        value: function setUsername(username) {
            var _this12 = this;

            if (this.unlinked) {
                //  this.emit('incentiveModal');
                return { cancel: true };
            }

            return new _promise2.default(function (resolve, reject) {
                _this12.ajaxRequest('/api/user/username', { username: username }, function (error, res) {
                    if (error) {
                        FirebaseManager.storeGeneric('account', 'set_username_error');
                        return resolve({ error: error });
                    }

                    if (res.result === 'success') {
                        _this12.loadProfile();
                        return resolve({ success: true });
                    }
                    return resolve({ error: res.result });
                });
            });
        }
    }, {
        key: 'setLoadout',
        value: function setLoadout(loadout, loadoutIds) {
            var _this13 = this;

            if (loadoutIds && loadout) {
                // Preemptively set the new loadout and revert if the call fails
                var loadoutPrev = this.loadout;
                var loadoutIdsPrev = this.loadoutIds;
                this.loadout = loadout;
                this.loadoutIds = loadoutIds;
                this.emit('loadout', this.loadout, this.loadoutIds);

                this.ajaxRequest('/api/user/loadout', { loadout: loadout, loadoutIds: loadoutIds }, function (err, res) {
                    if (err) {
                        FirebaseManager.storeGeneric('account', 'set_loadout_error');
                        _this13.emit('error', 'server_error');
                    }

                    if (err || !res.loadout || !res.loadoutIds) {
                        _this13.loadout = loadoutPrev;
                        _this13.loadoutIds = loadoutIdsPrev;
                    } else {
                        _this13.loadout = res.loadout;
                        _this13.loadoutIds = res.loadoutIds;
                        _this13.loadoutPriv = res.loadoutPriv;
                        _this13.loadoutStats = res.loadoutStats;
                    }
                    _this13.emit('loadout', _this13.loadout, _this13.loadoutIds);
                });
            }
        }
    }, {
        key: 'setItemStatus',
        value: function setItemStatus(status, itemTypes) {
            var _this14 = this;

            if (itemTypes.length == 0) {
                return;
            }

            // Preemptively mark the item status as modified on our local copy

            var _loop = function _loop(i) {
                var item = _this14.items.find(function (x) {
                    return itemTypes[i].id && x.id == itemTypes[i].id;
                });
                if (item) {
                    item.status = Math.max(item.status, status);
                }
            };

            for (var i = 0; i < itemTypes.length; i++) {
                _loop(i);
            }
            this.emit('items', this.items);

            var path = void 0;
            if (helpers.getCookie('app-data')) {
                path = '/api/user/set_item_status';
            } else {
                path = '/api/user/set_item_status_unlinked';
            }

            this.ajaxRequest(path, { status: status, itemTypes: itemTypes }, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'set_item_status_error');
                }

                // Assume the operation was successful.
                //
                // Re-fetching the items here can lead to inconsistent local data
                // as multiple in-flight setItemStatus responses will deliver
                // out-of-date responses
            });
        }

        /* strip_from_prod_client:begin */
        //This is not used on prod anymore, but is left here if needed to test

    }, {
        key: 'unlock',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(unlockType) {
                var res;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.next = 3;
                                return this.ajaxRequestAsync('/api/user/items/unlock', { unlockType: unlockType });

                            case 3:
                                res = _context4.sent;

                                this.items = res.items;
                                this.emit('items', this.items);
                                _context4.next = 12;
                                break;

                            case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4['catch'](0);

                                this.emit('error', 'server_error');
                                return _context4.abrupt('return');

                            case 12:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 8]]);
            }));

            function unlock(_x4) {
                return _ref8.apply(this, arguments);
            }

            return unlock;
        }()
        /* strip_from_prod_client:end */

    }, {
        key: 'upgradeItem',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(itemId) {
                var res;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                _context5.next = 3;
                                return this.ajaxRequestAsync('/api/user/items/upgrade', { itemId: itemId });

                            case 3:
                                res = _context5.sent;

                                this.items = res.items;
                                this.profile.totalEssence = res.totalEssence;
                                if (res.success) this.analytics.economyTransactions('Upgraded Item', 0, -1 * res.requiredEssence, 'Id: ' + res.id + ', Level: ' + res.level + ', Type: ' + res.type, '');
                                //this.emit('items', this.items);
                                _context5.next = 13;
                                break;

                            case 9:
                                _context5.prev = 9;
                                _context5.t0 = _context5['catch'](0);

                                this.emit('error', 'server_error');
                                return _context5.abrupt('return');

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 9]]);
            }));

            function upgradeItem(_x5) {
                return _ref9.apply(this, arguments);
            }

            return upgradeItem;
        }()
    }, {
        key: 'getPassAux',
        value: function getPassAux(err, res, tryRefreshQuests, questId) {
            this.pass = {};
            var oldQuests = this.quests;
            this.quests = [];
            this.questPriv = '';

            if (err || !res.success) {
                FirebaseManager.storeGeneric('account', 'get_pass_error');
            } else {
                this.pass = res.pass || {};
                if (tryRefreshQuests == false && (questId === 0 || questId === 1)) {
                    this.analytics.challengeProgress('assign', res.quests[questId]);
                }
                if (this.pass.newPass) {
                    this.analytics.challengeProgress('assign', res.quests[0]);
                    this.analytics.challengeProgress('assign', res.quests[1]);
                    this.analytics.challengeProgress('assign', res.quests[2]);
                }
                this.quests = res.quests || [];
                this.dailyQuest = res.dailyQuest;
                this.questReplacePrice = res.questReplacePrice;
                this.questPriv = res.questPriv || '';
                this.analytics.battlePassLevel = res && res.pass && res.pass.level ? res.pass.level : 0;
                this.adManager.setPlayerVip(this.pass.vip);
                if (this.pass.vip) {
                    this.adManager.hideBannerAd();
                    this.adManager.hideSpectateVideoAd();
                }

                this.quests.sort(function (a, b) {
                    return a.idx - b.idx;
                });
                if (oldQuests.length > 0 && this.quests.length > 0) {
                    if (oldQuests[0].type == this.quests[0].type && this.quests[0].progress > oldQuests[0].progress && this.quests[0].complete == false) {
                        this.analytics.challengeProgress('progress', this.quests[0]);
                    }
                }
                if (oldQuests.length > 1 && this.quests.length > 1) {
                    if (oldQuests[1].type == this.quests[1].type && this.quests[1].progress > oldQuests[1].progress && this.quests[1].complete == false) {
                        this.analytics.challengeProgress('progress', this.quests[1]);
                    }
                }
                if (oldQuests.length > 2 && this.quests.length > 2) {
                    if (oldQuests[2].type == this.quests[2].type && this.quests[2].progress > oldQuests[2].progress && this.quests[2].complete == false) {
                        this.analytics.challengeProgress('progress', this.quests[2]);
                    }
                }

                if (this.pass) {
                    this.emit('pass', this.pass, this.quests, this.dailyQuest, true);
                }

                if (this.pass.gbpUnlock) {
                    if (this.pass.newItems) {
                        for (var i = 0; i < this.pass.lvlUpItems.length; i++) {
                            this.pass.lvlUpItems[i].type;
                            this.analytics.economyTransactions('Item Got', 0, 0, this.pass.lvlUpItems[i].type, 'Gold Pass Unlocked', 'GBP-' + this.profile.id);
                        }
                    }
                    if (this.pass.newGP) {
                        this.analytics.economyTransactions('Gold Got', this.pass.gpChange, 0, '', 'Gold Pass Unlocked', 'GBP-' + this.profile.id);
                    }
                } else if (this.pass.newItems) {
                    var contextOffer = '';
                    for (var _i = 0; _i < this.pass.lvlUpItems.length; _i++) {
                        this.pass.lvlUpItems[_i].type;
                        if (this.pass.lvlUpItems[_i].premium) {
                            contextOffer = 'Gold Level';
                        } else {
                            contextOffer = 'Normal Level';
                        }
                        this.analytics.economyTransactions('Item Got', 0, 0, this.pass.lvlUpItems[_i].type, contextOffer);
                    }
                } else if (this.pass.newGP) {
                    this.analytics.economyTransactions('Gold Got', this.pass.gpChange, 0, '', 'Level Up');
                }

                if (this.pass.newItemsData) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = (0, _getIterator3.default)(this.pass.newItemsData), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _item = _step.value;

                            this.analytics.gearStatEvent(_item, 'Got via Season Levelup', this.profile.username, 0, 0, 0);
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

                if (this.pass.newItems || this.pass.newGP) {
                    this.loadProfile(true);
                }

                if (!this.pass.premium && this.pass.newDiscount) {
                    this.emit('showDiscount', this.pass.discount_level);
                }
            }
        }
    }, {
        key: 'getPass',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(tryRefreshQuestsp, questId, forceUpdate, teamsReset) {
                var _this15 = this;

                var path, getUserPassData, _ref11, _ref12, err, res;

                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                path = void 0;

                                if (helpers.getCookie('app-data')) {
                                    path = '/api/user/get_pass';
                                } else {
                                    path = '/api/user/get_pass_unlinked';
                                }

                                getUserPassData = function getUserPassData(url, tryRefreshQuests, update, resetTeams) {
                                    return new _promise2.default(function (resolve, reject) {
                                        _this15.ajaxRequest(url, { userId: _this15.config.get('BHAIdUnlinked'), tryRefreshQuests: tryRefreshQuests, forceUpdate: update, resetTeams: resetTeams }, function (err, res) {
                                            resolve([err, res]);
                                        });
                                    });
                                };

                                _context6.next = 5;
                                return getUserPassData(path, tryRefreshQuestsp, forceUpdate, teamsReset);

                            case 5:
                                _ref11 = _context6.sent;
                                _ref12 = (0, _slicedToArray3.default)(_ref11, 2);
                                err = _ref12[0];
                                res = _ref12[1];


                                this.getPassAux(err, res, tryRefreshQuestsp, questId);

                            case 10:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function getPass(_x6, _x7, _x8, _x9) {
                return _ref10.apply(this, arguments);
            }

            return getPass;
        }()
    }, {
        key: 'setPassUnlock',
        value: function setPassUnlock(unlockType) {
            var _this16 = this;

            this.ajaxRequest('/api/user/set_pass_unlock', { unlockType: unlockType }, function (err, res) {
                if (err || !res.success) {
                    FirebaseManager.storeGeneric('account', 'set_pass_unlock_error');
                } else {
                    _this16.getPass(false);
                }
            });
        }
    }, {
        key: 'startTutorial',
        value: function startTutorial() {
            var _this17 = this;

            this.ajaxRequest('/api/user/start_tutorial_quests', { user: this.profile.id }, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('tutorial', 'error_setting_tutorial_quests');
                } else if (res.data) {
                    _this17.getPass(false);
                }
            });
        }
    }, {
        key: 'refreshQuest',
        value: function refreshQuest(idx) {
            var _this18 = this;

            var requestPath = void 0;
            var params = { idx: idx };

            if (helpers.getCookie('app-data')) {
                requestPath = '/api/user/refresh_quest';
            } else {
                requestPath = '/api/user/refresh_quest_unlinked';
            }
            this.ajaxRequest(requestPath, params, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'refresh_quest_error');
                    return;
                }
                if (res.success) {
                    _this18.getPass(false, idx);
                } else {
                    // Give the pass UI a chance to update quests
                    if (_this18.pass) {
                        _this18.emit('pass', _this18.pass, _this18.quests, _this18.dailyQuest, false);
                    }
                }
            });
        }
    }, {
        key: 'replaceQuests',
        value: function replaceQuests() {
            var _this19 = this;

            var requestPath = void 0;
            var params = {};

            if (helpers.getCookie('app-data')) {
                requestPath = '/api/user/replace_quests';
            } else {
                requestPath = '/api/user/replace_quests_unlinked';
            }
            this.ajaxRequest(requestPath, params, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'replace_quest_error');
                    return;
                }
                if (res.success) {
                    _this19.getPass(false);
                    _this19.loadProfile(true);
                } else {
                    // Give the pass UI a chance to update quests
                    if (_this19.pass) {
                        _this19.emit('pass', _this19.pass, _this19.quests, _this19.dailyQuest, false);
                    }
                }
            });
        }

        /**
         * 
        * @param {import('./../../../data/game/game-objects/loot-boxes')['loot_box_01']} chest 
         * @returns 
         */

    }, {
        key: 'openChest',
        value: function openChest(chest) {
            var _this20 = this;

            var boxType = chest.id;
            return new _promise2.default(function (resolve, reject) {
                _this20.ajaxRequest('/api/user/open_loot_box', { boxType: boxType }, function (err, res) {
                    if (err) {
                        FirebaseManager.storeGeneric('account', 'open_loot_box_error');
                        _this20.emit('error', 'server_error');
                        return reject(err);
                    }

                    if (res.success) {
                        _this20.analytics.economyTransactions(chest.name, -1 * chest.price, 0, res.item, 'Chest');
                        _this20.analytics.gearStatEvent(res.itemId, 'Got via Chest', _this20.profile.username, 0, 0, 0);
                        _this20.loadProfile();
                        return resolve(res);
                    }

                    var errorModal = new MenuModal($('#market-modal-error'));
                    var titleElement = $('#market-modal-error-title');
                    var textElement = $('#market-modal-error-text');
                    var extraText = res.msg;

                    titleElement.html(_this20.localization.translate('iap-transaction-failed'));
                    extraText ? textElement.html(_this20.localization.translate('iap-transaction-error') + "</br>" + (_this20.localization.translate(extraText) || extraText)) : textElement.html(_this20.localization.translate('iap-transaction-error'));

                    errorModal.show();
                });
            });
        }

        //TODO if not used delete

    }, {
        key: 'openLootBox',
        value: function openLootBox(boxType) {
            var _this21 = this;

            this.ajaxRequest('/api/user/open_loot_box', { boxType: boxType }, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'open_loot_box_error');
                    _this21.emit('error', 'server_error');
                    return;
                } else {
                    if (res.success) {
                        var typeName = 'PARMA';
                        if (boxType == 'loot_box_02') {
                            typeName = 'HYDRA';
                        } else if (boxType == 'loot_box_03') {
                            typeName = 'REDACTED';
                        } else {
                            var isLimited = boxType.split('_')[0];
                            if (isLimited === 'limited') typeName = 'Limited Time';
                        }
                        var crateDef = GameObjectDefs[boxType];
                        _this21.analytics.economyTransactions(typeName, -1 * crateDef.price, 0, res.item, 'Crate');
                        _this21.analytics.gearStatEvent(res.itemId, 'Got via Crate', _this21.profile.username, 0, 0, 0);
                        _this21.loadProfile();
                        _this21.emit('startSpin', boxType, res.item);
                    } else {
                        var errorModal = new MenuModal($('#market-modal-error'));
                        var titleElement = $('#market-modal-error-title');
                        var textElement = $('#market-modal-error-text');
                        var extraText = res.msg;

                        titleElement.html(_this21.localization.translate('iap-transaction-failed'));
                        extraText ? textElement.html(_this21.localization.translate('iap-transaction-error') + "</br>" + (_this21.localization.translate(extraText) || extraText)) : textElement.html(_this21.localization.translate('iap-transaction-error'));

                        errorModal.show();
                    }
                }
            });
        }
    }, {
        key: 'recycleUserItem',
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(itemType, itemCategory, itemId, recycleValue) {
                var _this22 = this;

                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.next = 2;
                                return this.ajaxRequest('/api/user/recycle_user_item', { itemType: itemType, itemId: itemId }, function (err, res) {
                                    if (err || !res.success) {
                                        FirebaseManager.storeGeneric('account', 'sell_user_item_error');
                                        _this22.emit('error', 'server_error');
                                        return;
                                    } else {
                                        _this22.profile.totalEssence += recycleValue;
                                        _this22.analytics.economyTransactions('Item recycled', 0, recycleValue, 'Id: ' + itemType + ', Type: ' + itemCategory, '');
                                        _this22.emit('recycle');
                                        _this22.loadProfile();
                                    }
                                });

                            case 2:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function recycleUserItem(_x10, _x11, _x12, _x13) {
                return _ref13.apply(this, arguments);
            }

            return recycleUserItem;
        }()
    }, {
        key: 'getGP',
        value: function getGP() {
            var _this23 = this;

            this.ajaxRequest('/api/user/get_gp', function (err, res) {
                if (err || !res.success) {
                    return;
                } else {
                    _this23.loadProfile(true);
                }
            });
        }
    }, {
        key: 'addEssence',
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                var res;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                _context8.next = 3;
                                return this.ajaxRequestAsync('/api/user/essence/add');

                            case 3:
                                res = _context8.sent;

                                this.loadProfile(true);
                                _context8.next = 10;
                                break;

                            case 7:
                                _context8.prev = 7;
                                _context8.t0 = _context8['catch'](0);
                                return _context8.abrupt('return');

                            case 10:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 7]]);
            }));

            function addEssence() {
                return _ref14.apply(this, arguments);
            }

            return addEssence;
        }()
    }, {
        key: 'addGold',
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                var res;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.prev = 0;
                                _context9.next = 3;
                                return this.ajaxRequestAsync('/api/user/get_gp');

                            case 3:
                                res = _context9.sent;

                                this.loadProfile(true);
                                _context9.next = 10;
                                break;

                            case 7:
                                _context9.prev = 7;
                                _context9.t0 = _context9['catch'](0);
                                return _context9.abrupt('return');

                            case 10:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[0, 7]]);
            }));

            function addGold() {
                return _ref15.apply(this, arguments);
            }

            return addGold;
        }()
    }, {
        key: 'updateTargetPrestige',
        value: function updateTargetPrestige(userId, reporterId, prestige) {
            var _this24 = this;

            this.ajaxRequest('/api/user/get_prestige', { userId: userId, reporterId: reporterId, prestige: prestige }, function (err, res) {
                if (err || !res.success) {

                    if (res && res.pointsError) {
                        _this24.emit('error', 'prestige_error');
                    } else if (res && res.unlinkedError) {
                        _this24.emit('error', 'unlinked_account_error');
                    }
                    return;
                } else {
                    _this24.loadProfile(true);
                }
            });
        }
    }, {
        key: 'getUserCurrency',
        value: function getUserCurrency(start) {
            var _this25 = this;

            this.ajaxRequest('/api/user/get_user_currency_total', function (err, res) {
                if (!err && res.success) {
                    for (var i = 0; i < res.userCurrencyInfo.length; i++) {
                        if (res.userCurrencyInfo[i].asset) {
                            if (parseInt(res.userCurrencyInfo[i].gp_currency) > 0) _this25.analytics.hardCurrencyEarned = parseInt(res.userCurrencyInfo[i].gp_currency);else if (parseInt(res.userCurrencyInfo[i].essence_currency) > 0) _this25.analytics.softCurrencyEarned = parseInt(res.userCurrencyInfo[i].essence_currency);
                        } else {
                            if (parseInt(res.userCurrencyInfo[i].gp_currency) > 0) _this25.analytics.hardCurrencySpent = parseInt(res.userCurrencyInfo[i].gp_currency);else if (parseInt(res.userCurrencyInfo[i].essence_currency) > 0) _this25.analytics.softCurrencySpent = parseInt(res.userCurrencyInfo[i].essence_currency);
                        }
                    }
                    if (res.userPassMaxLevel.length > 0) {
                        _this25.analytics.playerLevel = parseInt(res.userPassMaxLevel[0].get_user_max_level);
                    }
                    if (res.userTransactionData.length > 0) {
                        var transactionData = res.userTransactionData[0];
                        _this25.analytics.numPurchases = parseInt(transactionData.purchases);
                        _this25.analytics.hardCurrencyBought = parseInt(transactionData.gp_bought);
                        _this25.analytics.hardCurrencyEarned = _this25.analytics.hardCurrencyEarned - _this25.analytics.hardCurrencyBought;
                        _this25.analytics.totalSpentInUsd = (parseInt(transactionData.usd_spent) / 100.0).toFixed(2);
                    }
                }
                if (start) {
                    if (_this25.params && _this25.params.user_id == _this25.profile.id) {
                        var bundleData = window.localStorage.getItem('bha-attempt-' + _this25.params.user_id);
                        if (bundleData) {
                            bundleData = JSON.parse(bundleData);

                            _this25.redirectAfterBuy();

                            if (_this25.params.status == 'done') {
                                _this25.analytics.iapTransactions(bundleData.b, bundleData.c, bundleData.a, _this25.params.invoice_id, bundleData.d);
                                _this25.buyCallBack(true);
                            } else {
                                _this25.analytics.iapFails(_this25.params.invoice_id, bundleData.a, 'transaction rejected');
                                _this25.buyCallBack(false);
                            }
                        }
                    } else {
                        _this25.analytics.sessionStarts();
                    }
                    survivLoading.hideSurvivLoading();
                }
                _this25.analytics.navActionsEvent('Home', 'Load Success', '', '');
            });
        }
    }, {
        key: 'redirectAfterBuy',
        value: function redirectAfterBuy() {
            var contextBeforeBuy = this.config.get('beforeBuyContext');
            if (contextBeforeBuy && contextBeforeBuy.window) {
                //"Redirect" based on the set context
                if (contextBeforeBuy.window === 'store') {
                    this.emit('openStore');
                } else if (contextBeforeBuy.window === 'crates') {
                    this.emit('openStore');
                    this.emit('openCratesModal');
                } else if (contextBeforeBuy.window === 'GBP') {
                    this.emit('showPremiunModal');
                } else if (contextBeforeBuy.window === 'market') {
                    this.emit('openStore');
                    this.emit('openMarket', contextBeforeBuy.searchParameters);
                }
                this.config.set('beforeBuyContext', null);
            }
        }
    }, {
        key: 'buyUserPass',
        value: function buyUserPass(buyOption) {
            var _this26 = this;

            if (this.unlinked) {
                this.emit('incentiveModal');
                return;
            }

            this.ajaxRequest('/api/user/buy_user_pass', { buyOption: buyOption }, function (err, res) {
                if (!err && res.success) {
                    var contextOffer = '';
                    if (res.discount) {
                        contextOffer = 'Discounted ' + res.discount + '%';
                    } else {
                        contextOffer = 'Standard';
                    }
                    var type = '';
                    if (buyOption == 'basic') {
                        type = 'GBP';
                    } else {
                        type = 'GBP VIP';
                    }
                    _this26.analytics.economyTransactions(type, parseInt(res.price), 0, '', contextOffer, 'GBP-' + _this26.profile.id);
                    _this26.loadProfile(true);
                    _this26.getPass(false, null, true);
                    _this26.emit('startSpinReward');
                }
            });
        }
    }, {
        key: 'updateXPRewardPass',
        value: function updateXPRewardPass(passManager, update) {
            var _this27 = this;

            this.ajaxRequest('/api/user/update_xp_reward', { update: update }, function (err, res) {
                if (!err && res.success) {
                    _this27.getPass();
                    if (passManager !== null) {
                        passManager.updateXPTimerAndUI(passManager);
                    }
                }
            });
        }
    }, {
        key: 'resetTeams',
        value: function resetTeams() {
            var _this28 = this;

            this.ajaxRequest('/api/user/update_xp_team', function (err, res) {
                if (!err && res.success) {
                    _this28.getPass();
                }
            });
        }
    }, {
        key: 'refreshQuestGP',
        value: function refreshQuestGP(idx) {
            var _this29 = this;

            var params = { idx: idx };

            this.ajaxRequest('/api/user/refresh_quest_gp', params, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'refresh_quest_error');
                    return;
                }
                if (res.success) {
                    _this29.profile.gpTotal -= _this29.refreshPrice;
                    _this29.getPass(false, idx);
                } else {
                    // Give the pass UI a chance to update quests
                    if (_this29.pass) {
                        _this29.emit('pass', _this29.pass, _this29.quests, _this29.dailyQuest, false);
                    }
                }
            });
        }
    }, {
        key: 'refreshQuestVideo',
        value: function refreshQuestVideo(idx) {
            var _this30 = this;

            var params = { idx: idx };

            this.ajaxRequest('/api/user/refresh_quest_video', params, function (err, res) {
                if (err) {
                    FirebaseManager.storeGeneric('account', 'refresh_quest_error');
                    return;
                }
                if (res.success) {
                    _this30.getPass(false, idx);
                } else {
                    // Give the pass UI a chance to update quests
                    if (_this30.pass) {
                        _this30.emit('pass', _this30.pass, _this30.quests, _this30.dailyQuest, false);
                    }
                }
            });
        }
    }, {
        key: 'getXPRewardDistance',
        value: function getXPRewardDistance(rewardDate) {

            if (rewardDate !== undefined && rewardDate !== null) {
                var d1 = new Date(rewardDate);
                var endDate = new Date(d1);
                endDate.setMinutes(d1.getMinutes() + 15);

                // Set the date we're counting down to
                var countDownDate = new Date(endDate).getTime();

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
                return minutes;
            }
            return -1;
        }
    }, {
        key: 'displayVideoAd',
        value: function displayVideoAd(passManager) {
            var _this31 = this;

            this.adManager.showVideoRewardAd(function () {
                _this31.updateXPRewardPass(passManager, true);
            });
        }
    }, {
        key: 'displayVideoAdQuest',
        value: function displayVideoAdQuest(idx) {
            var _this32 = this;

            this.adManager.showVideoRewardAd(function () {
                _this32.refreshQuestVideo(idx);
                survivLoading.hideSurvivLoading();
            });
        }
    }, {
        key: 'addXP',
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                var res;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.prev = 0;
                                _context10.next = 3;
                                return this.ajaxRequestAsync('/api/user/add_xp');

                            case 3:
                                res = _context10.sent;

                                this.getPass(true);
                                _context10.next = 10;
                                break;

                            case 7:
                                _context10.prev = 7;
                                _context10.t0 = _context10['catch'](0);
                                return _context10.abrupt('return');

                            case 10:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[0, 7]]);
            }));

            function addXP() {
                return _ref16.apply(this, arguments);
            }

            return addXP;
        }()
    }, {
        key: 'unlinkGoogleId',
        value: function unlinkGoogleId() {
            var _this33 = this;

            this.ajaxRequest('/api/user/unlink_social_id', function (err, res) {
                if (err || !res.success) {
                    return;
                } else {
                    _this33.clearSessionCookies();
                    window.location.reload();
                }
            });
        }
    }, {
        key: 'expireMarketItems',
        value: function expireMarketItems() {
            this.emit('expireMarketItemsTest');
        }
    }]);
    return Account;
}();

module.exports = Account;
