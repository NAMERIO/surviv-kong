"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _set = require("./ed9971da.js");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require("./2f756df0.js");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

var $ = require("./8ee62bea.js");
var device = require("./device.js");
var FirebaseManager = require("./FirebaseManager.js");
var helpers = require("./helpers.js");
var webview = require("./webview.js");

/**
 * @typedef {Window & globalThis & { tyche: any }} ExtendedWindow
 */

//
// Constants
//
var kAdRectRefreshTime = 30;
var kAdLeaderRefreshTime = 60;

var kAppRatePromptGames = 10;

// Freestar ad units
var slotIdToPlacement = {
    'urvivio_300x250_start': 'urvivio_300x250_start',
    'urvivio_728x90_start': 'urvivio_728x90_start',
    'urvivio_300x250_over': 'urvivio_300x250_over',
    'urvivio_mobile_over': 'urvivio_mobile_over',
    'urvivio_300x600_loadout': 'urvivio_300x600_loadout',
    'urvivio_300x250_bottom_left': 'urvivio_300x250_bottom_left',
    'urvivio_300x250_bottom_right': 'urvivio_300x250_bottom_right',
    'urvivio_728x90_spectate': 'urvivio_728x90_spectate'
};

/**
 * @description Playwire Ads units
 **/
var PW_UNITS = [{
    selectorId: 'home_bl_med_rect_btf',
    type: 'med_rect_btf',
    page: 'home'
}, {
    selectorId: 'home_br_med_rect_btf',
    type: 'med_rect_btf',
    page: 'home'
}, {
    selectorId: 'home_bc_leaderboard_btf',
    type: 'leaderboard_btf',
    page: 'home'
}, {
    selectorId: 'results_bc_leaderboard_btf',
    type: 'leaderboard_btf',
    page: 'results'
}, {
    selectorId: 'spectate_tp_leaderboard_atf',
    type: 'leaderboard_atf',
    page: 'spectate'
}];

// Freestar video ad units
var videoSlotIdToPlacement = {
    'spectate': 'primis-incontent-desktop'
};

var PW_BOLD_VIDEO_ADS = {
    'spectate': 'bha_spectate_video_ad'
};

//
// Native ad units
//
var kBannerAdIds = {
    android: '/421469808/surviv.io_320x50_inapp',
    //android: '/421469808/surviv.io_300x250_inapp',
    //android: '/421469808/surviv.io_smartbanner_inapp',
    ios: '/421469808/surviv.io_320x50_inapp'
};
var kInterstitialAdIds = {
    android: '/421469808/surviv.io_interstitial',
    ios: '/421469808/surviv.io_interstitial'
};

var kUseTestAdIds = false;
if (kUseTestAdIds) {
    // Google test ad units
    kBannerAdIds = {
        android: '/6499/example/banner',
        ios: '/6499/example/banner'
    };
    kInterstitialAdIds = {
        android: '/6499/example/interstitial',
        ios: '/6499/example/interstitial'
    };
}
var interstitialTestUserIds = [];
var interstitialTestMode = false;

// Load a script from given `url`
var loadScript = function loadScript( /** @type {string} */url) {
    return new _promise2.default(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.async = true;

        script.addEventListener('load', function () {
            // The script is loaded completely
            resolve(true);
        });

        document.head.appendChild(script);
    });
};

var AdManager = function () {
    /**
     * 
     * @param {import('./config')} config 
     * @param {import('./analytics-service')} analytics 
     */
    function AdManager(config, analytics) {
        (0, _classCallCheck3.default)(this, AdManager);

        this.config = config;

        this.adRectRefresh = kAdRectRefreshTime;
        this.adLeaderRefresh = kAdLeaderRefreshTime;

        this.videoAdsEnabled = false;
        this.loggedAdblock = false;
        this.isPlayingVideo = false;
        this.videoPlayerLoaded = false;
        this.webviewVideoAdPrepared = false;
        this.cordovaPluginInitialised = false;
        this.webviewStaticAdPrepared = false;

        this.prerollGamesPlayed = 0;
        this.totalGamesPlayed = 0;
        this.kongregateAdsShow = 0;
        this.kongregateAdsCycle = 1;
        this.kongragateAdsInit = false;
        this.Tapdaq = false;

        this.onAdCompleteFn = null;

        this.bannerVisible = false;
        this.bannerRefreshTime = 0;

        this.interstitialTimerReady = false;

        this.isOutOfGame = true;

        this.initializedSlots = [];
        /** @type {string[]} */
        this.initializedPwUnitsIds = [];

        this.analytics = analytics;
        this.tutorialStarted = helpers.getCookie('ftue-step') > 0 && helpers.getCookie('ftue-step') <= 8 ? true : false;

        this.isElectron = /surviviosteam/i.test(navigator.userAgent);
        this.currentUserVip = false;
        /** @type {Set<()=>void>} */
        this.tycheSubscribers = new _set2.default();
        this.initPlaywire();
    }

    (0, _createClass3.default)(AdManager, [{
        key: 'initPlaywire',
        value: function initPlaywire() {
            var _this = this;

            // @ts-ignore
            var loadTyche = !window.tyche;
            // @ts-ignore
            window.tyche = {
                mode: 'tyche',
                // the following is a test config - do NOT use in production; you will be sent your own config file
                config: "https://web.archive.org/web/20211102160635/https://config.playwire.com/1024483/v2/websites/73268/banner.json",
                // sets passiveMode to active
                passiveMode: true,
                // this event listener notifies once the API is ready to be used and calls the `init() function`
                onReady: function onReady() {
                    _this.tycheSubscribers.forEach(function (subscriber) {
                        subscriber();
                    });
                    _this.tycheSubscribers.clear();
                    _this.initGoogletagListeners();
                }
            };

            if (loadTyche) {
                this.loadPlaywireTyche();
            }
        }
    }, {
        key: 'initGoogletagListeners',
        value: function initGoogletagListeners() {
            var _this2 = this;

            if (window.googletag) {
                window.googletag.pubads().addEventListener('slotRenderEnded', function (event) {
                    var slot = event.slot;
                    if (slot && slot.getSlotElementId()) {
                        var slotContainer = document.getElementById(slot.getSlotElementId());
                        if (slotContainer.parentNode) {
                            var matchingAd = PW_UNITS.find(function (unit) {
                                return unit.selectorId === slotContainer.parentNode.id;
                            });
                            if (matchingAd) {
                                _this2.analytics.adStart(matchingAd.selectorId, false, matchingAd.page, 'Banner', 'Playwire');
                            }
                        }
                    }
                });
            }
        }
    }, {
        key: 'loadPlaywireTyche',
        value: function loadPlaywireTyche() {
            loadScript('//web.archive.org/web/20211102160635/https://cdn.intergient.com/pageos/pageos.js');
        }
    }, {
        key: 'init',
        value: function init() {
            var _this3 = this;

            var webviewVideo2 = device.webview && device.version >= '1.0.9';

            //let isElectron = /electron/i.test(navigator.userAgent);
            if (device.mobile && !device.webview || webviewVideo2) {
                this.videoAdsEnabled = true;

                if (webviewVideo2 && this.Tapdaq == false) {
                    var battleResultAd = document.getElementById('survivio_mobile_over');
                    if (battleResultAd) {
                        battleResultAd.style.display = 'none';
                    }
                    this.Tapdaq = window.cordova.require("cordova-plugin-tapdaq.Tapdaq");
                    var config = {
                        ios: {
                            appId: "5e18bbe7f3377419db25a7ec",
                            clientKey: "62125d81-9b09-4d39-8a50-3f45fb55507c"
                        },
                        android: {
                            appId: "5e18bc12f3377419db25a7ed",
                            clientKey: "62125d81-9b09-4d39-8a50-3f45fb55507c"
                        }
                    };

                    var opts = {
                        didInitialise: function () {
                            this.Tapdaq.setConsent(this.Tapdaq.Status.TRUE);
                            this.Tapdaq.setAgeRestrictedUser(this.Tapdaq.Status.FALSE);
                            this.cordovaPluginInitialised = true;
                            if (this.isOutOfGame) {
                                this.showBannerAd(true);
                            }
                        }.bind(this),
                        didFailToInitialise: function (error) {
                            console.log(error);
                        }.bind(this)
                    };
                    this.Tapdaq.init(config, opts);
                }
            }

            this.prerollGamesPlayed = this.config.get('prerollGamesPlayed') || 0;
            this.totalGamesPlayed = this.config.get('gamesPlayed') || 0;

            if (helpers.getParameterByName('test_preroll')) {
                $('#btn-help, #btn-help-mobile').click(function () {
                    if (_this3.shouldDisplayVideoAd()) {
                        _this3.displayVideoAd();
                    }
                });
            }
            this.analytics.hideBannerAd = this.hideBannerAd.bind(this);
            setTimeout(this.showHomePageAds.bind(this), 0);
            setTimeout(function () {
                _this3.interstitialTimerReady = true;
            }, 120000);
        }
    }, {
        key: 'setPlayerID',
        value: function setPlayerID(userId) {
            this.currentUserId = userId;
        }
    }, {
        key: 'setPlayerVip',
        value: function setPlayerVip(vip) {
            this.currentUserVip = vip;
        }
    }, {
        key: 'onGameStart',
        value: function onGameStart() {
            this.prerollGamesPlayed++;
            this.totalGamesPlayed++;

            if (this.videoAdsEnabled) {
                this.prepareVideoAd();
            }

            this.hideBannerAd();
            this.hideSpectateAds();
            this.hideOverPageAds();
            this.hideHomeAds();
        }
    }, {
        key: 'onGameComplete',
        value: function onGameComplete(onAdCompleteFn) {
            var _this4 = this;

            this.config.set('prerollGamesPlayed', this.prerollGamesPlayed);
            this.config.set('totalGamesPlayed', this.totalGamesPlayed);

            if (!this.loggedAdblock) {
                FirebaseManager.storeGeneric('adblock1', window.adsBlocked);
                this.loggedAdblock = true;
            }

            // Prompt for app rating
            var promptRating = device.webview && device.version > '1.0.0' && this.config.get('promptAppRate') && this.totalGamesPlayed % kAppRatePromptGames == 0;
            if (promptRating) {
                webview.promptAppRate(function (choice) {
                    switch (choice) {
                        case 1:
                            // 'No'
                            _this4.config.set('promptAppRate', false);
                            break;
                        case 2:
                            // 'Later'
                            break;
                        case 3:
                            // 'Yes'
                            _this4.config.set('promptAppRate', false);
                            break;
                        default:
                            break;
                    }
                });
            }

            if (device.webview && device.version >= '1.0.9') {
                this.showBannerAd(true);
            }

            if (this.shouldDisplayVideoAd() && !promptRating) {
                this.displayVideoAd(onAdCompleteFn);
            } else {
                onAdCompleteFn();
            }
        }
    }, {
        key: 'shouldDisplayVideoAd',
        value: function shouldDisplayVideoAd() {
            if (this.interstitialTestMode) {
                if (this.currentUserId) {
                    if (this.interstitialTestUserIds.indexOf(this.currentUserId) !== -1) {
                        return true;
                    }
                }
                return false;
            }
            if (this.currentUserVip) {
                return false;
            }
            return this.videoAdsEnabled && this.interstitialTimerReady;
        }
    }, {
        key: 'setUserSubjectToGDPR',
        value: function setUserSubjectToGDPR(countryCode) {
            var euCountryCodes = ['GB', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
            if (euCountryCodes.includes(countryCode)) {
                this.Tapdaq.setUserSubjectToGDPR(this.Tapdaq.Status.TRUE);
            } else {
                this.Tapdaq.setUserSubjectToGDPR(this.Tapdaq.Status.FALSE);
            }
        }
    }, {
        key: 'prepareVideoAd',
        value: function prepareVideoAd() {
            if (device.webview && device.version >= '1.0.9' && !this.webviewVideoAdPrepared) {
                this.setUserSubjectToGDPR(this.analytics.countryCode);
                var loadOpts = {
                    didLoad: function (response) {
                        this.webviewVideoAdPrepared = true;
                    }.bind(this),
                    didFailToLoad: function didFailToLoad(error, response) {
                        console.log("load static interstitial fail:");
                        console.log(error);
                    }
                };
                this.Tapdaq.loadVideo("survivio_app_key_interstitial", loadOpts);
            }
        }
    }, {
        key: 'showVideoRewardAd',
        value: function showVideoRewardAd(cb) {

            //accountManager.updateXPRewardPass(passManager, true);
            if (device.webview && device.version >= '1.0.9' && !this.webviewVideoAdPrepared) {
                this.setUserSubjectToGDPR(this.analytics.countryCode);
                var loadOpts = {
                    didLoad: function (response) {
                        var showOpts = {
                            willDisplay: function (response) {
                                this.analytics.adStart('survivio_app_key_rv_home_xpboost', true, 'Home', 'Rewarded Video', 'Tapdaq');
                                this.isPlayingVideo = true;
                            }.bind(this),
                            didDisplay: function didDisplay(response) {},
                            didFailToDisplay: function didFailToDisplay(error, response) {},
                            didClick: function didClick(response) {},
                            didValidateReward: function didValidateReward(response) {
                                console.log("The user received a reward! ID: " + response.reward.eventId + ", Tag: " + response.reward.placementTag + ", Name: " + response.reward.name + ", Value: " + response.reward.value + ", isValid: " + response.reward.isValid + " Custom JSON: " + response.reward.customJson);
                                cb();
                            },
                            didClose: function (response) {
                                this.isPlayingVideo = false;
                            }.bind(this)
                        };
                        var scope = this;
                        this.Tapdaq.isRewardedVideoReady("survivio_app_key_rv_home_xpboost", function (ready) {
                            if (ready) {
                                scope.Tapdaq.showRewardedVideo("survivio_app_key_rv_home_xpboost", showOpts);
                            }
                        });
                    }.bind(this),
                    didFailToLoad: function didFailToLoad(error, response) {
                        console.log("load static reward fail:");
                        console.log(error);
                    }
                };
                this.Tapdaq.loadRewardedVideo("survivio_app_key_rv_home_xpboost", loadOpts); // CHANGE FOR VIDEO REWARDS TAGS
            }
        }
    }, {
        key: 'displayVideoAd',
        value: function displayVideoAd(onAdCompleteFn) {
            this.prerollGamesPlayed = 0;
            this.config.set('prerollGamesPlayed', 0);

            if (device.webview) {
                this.displayVideoAdWebview(onAdCompleteFn);
            } else {
                this.displayVideoAdBrowser(onAdCompleteFn);
            }
        }
    }, {
        key: 'displayVideoAdWebview',
        value: function displayVideoAdWebview(onAdCompleteFn) {
            if (this.webviewVideoAdPrepared) {
                if (device.version >= '1.0.9') {
                    if (this.webviewVideoAdPrepared) {
                        var showOpts = {
                            willDisplay: function (response) {
                                this.analytics.adStart('survivio_app_key_interstitial', false, 'Battle Results', 'Interstitial', 'Tapdaq');
                                this.webviewVideoAdPrepared = false;
                                this.isPlayingVideo = true;
                                this.interstitialTimerReady = false;
                            }.bind(this),
                            didClose: function (response) {
                                var _this5 = this;

                                setTimeout(function () {
                                    _this5.interstitialTimerReady = true;
                                }, 60000);
                                this.isPlayingVideo = false;
                                onAdCompleteFn();
                            }.bind(this)
                        };
                        this.Tapdaq.isVideoReady("survivio_app_key_interstitial", function (ready) {
                            if (ready) {
                                this.Tapdaq.showVideo("survivio_app_key_interstitial", showOpts);
                            } else {
                                this.webviewVideoAdPrepared = false;
                            }
                        }.bind(this));
                    }
                }
            } else {
                onAdCompleteFn();
            }
        }
    }, {
        key: 'displayVideoAdBrowser',
        value: function displayVideoAdBrowser(onAdCompleteFn) {
            this.prerollGamesPlayed = 0;
            this.config.set('prerollGamesPlayed', 0);

            $('#preroll-wrapper').css({
                'display': 'block',
                'opacity': 1.0
            });

            var fullscreen = window.innerWidth <= 960.0 || window.innerHeight <= 540.0;

            if (fullscreen) {
                $('#preroll').css({
                    'transform': 'none'
                });
            }

            if (!this.videoPlayerLoaded) {
                var that = this;
                var _fullscreen = _fullscreen;
                window.aiptag.cmd.player = window.aiptag.cmd.player || [];
                window.aiptag.cmd.player.push(function () {
                    window.adplayer = new window.aipPlayer({
                        AD_WIDTH: 960,
                        AD_HEIGHT: 540,
                        AD_FULLSCREEN: _fullscreen,
                        AD_CENTERPLAYER: false,
                        LOADING_TEXT: 'loading advertisement',
                        PREROLL_ELEM: function PREROLL_ELEM() {
                            return document.getElementById('preroll');
                        },
                        AIP_COMPLETE: function () {
                            var _this6 = this;

                            /*******************
                             ***** WARNING *****
                             *******************
                            Please do not remove the PREROLL_ELEM
                            from the page, it will be hidden automaticly.
                            If you do want to remove it use the AIP_REMOVE callback.
                            */
                            $('#preroll-wrapper').css({
                                'display': 'none',
                                'opacity': 0.0
                            });
                            this.isPlayingVideo = false;
                            setTimeout(function () {
                                _this6.interstitialTimerReady = true;
                            }, 60000);
                            onAdCompleteFn();
                        }.bind(this),
                        AIP_REMOVE: function AIP_REMOVE() {}
                    });
                }.bind(this));
                this.analytics.adStart('survivio_app_key_interstitial', false, 'Battle Results', 'Interstitial', 'Freestar');
                this.videoPlayerLoaded = true;
            }

            if (typeof window.adplayer !== 'undefined') {
                window.aiptag.cmd.player.push(function () {
                    window.adplayer.startPreRoll();
                });
                this.interstitialTimerReady = false;
                this.isPlayingVideo = true;
            }
        }
    }, {
        key: 'setAppActive',
        value: function setAppActive(active) {
            this.isOutOfGame = active;
            if (this.bannerVisible) {
                this.hideBannerAd();
            }
        }
    }, {
        key: 'showBannerAdApp',
        value: function showBannerAdApp(checkFlag) {
            if (!this.currentUserVip) {
                if (checkFlag) {
                    if (this.isOutOfGame) {
                        this.Tapdaq.showBanner("survivio_app_key_320x50_bottom", this.Tapdaq.BannerPosition.Bottom);
                        this.bannerVisible = true;
                    }
                } else {
                    this.Tapdaq.showBanner("survivio_app_key_320x50_bottom", this.Tapdaq.BannerPosition.Bottom);
                    this.bannerVisible = true;
                }
            }
        }
    }, {
        key: 'showBannerAd',
        value: function showBannerAd(checkflag) {
            if (device.webview && device.version >= '1.0.9') {
                if (!this.bannerVisible && !this.tutorialStarted) {
                    this.Tapdaq.isBannerReady("survivio_app_key_320x50_bottom", function (ready) {
                        if (ready) {
                            this.showBannerAdApp(checkflag);
                        } else {
                            var loadOpts = {
                                didLoad: function (response) {
                                    this.showBannerAd(checkflag);
                                    if (!this.tapdaqBannerFirstLoad) {
                                        this.analytics.adStart('survivio_app_key_320x50_bottom', false, 'Home', 'Banner', 'Tapdaq');
                                        this.tapdaqBannerFirstLoad = true;
                                    }
                                }.bind(this),
                                didFailToLoad: function didFailToLoad(error, response) {
                                    console.log("load banner bottom fail:");
                                    console.log(error);
                                },
                                didRefresh: function (response) {
                                    this.analytics.adStart('survivio_app_key_320x50_bottom', false, 'tapdaq', 'Banner', 'Tapdaq');
                                }.bind(this)
                            };
                            this.Tapdaq.loadBanner("survivio_app_key_320x50_bottom", this.Tapdaq.BannerSize.Standard, loadOpts);
                        }
                    }.bind(this));
                }
            }
        }
    }, {
        key: 'hideBannerAd',
        value: function hideBannerAd() {
            if (device.webview && device.version >= '1.0.9') {
                this.Tapdaq.hideBanner("survivio_app_key_320x50_bottom");
                this.bannerVisible = false;
            }
        }
    }, {
        key: 'hideAllAds',
        value: function hideAllAds() {
            this.hideSpectateAds();
            this.hideOverPageAds();
            this.hideHomeAds();
        }
    }, {
        key: 'showHomePageAds',
        value: function showHomePageAds() {
            this.hideAllAds();
            if (this.isOutOfGame && !this.currentUserVip) {
                /** @type {NodeListOf<HTMLDivElement>} */
                var containers = document.querySelectorAll('.home-ad-unit');
                containers.forEach(function (el) {
                    return el.hidden = false;
                });
                var units = PW_UNITS.filter(function (unit) {
                    return unit.page === 'home';
                });
                /*if (device.webview && device.version >= '1.0.8') {
                    this.showBannerAd(true);
                }*/
                this.displayPlaywireAds(units);
            }
        }
    }, {
        key: 'hideHomeAds',
        value: function hideHomeAds() {
            // const units = PW_UNITS.filter((unit) => unit.page === 'home');
            this.removePlaywireAds(['all']);
            /** @type {NodeListOf<HTMLDivElement>} */
            var containers = document.querySelectorAll('.home-ad-unit');
            containers.forEach(function (el) {
                return el.hidden = true;
            });
        }
    }, {
        key: 'removeAllPlaywireAds',
        value: function removeAllPlaywireAds() {
            this.removePlaywireAds(['all']);
        }
    }, {
        key: 'showOverPageAds',
        value: function showOverPageAds() {
            if (!this.currentUserVip) {
                document.getElementById('ui-stats-ad-container-desktop').hidden = false;
                var units = PW_UNITS.filter(function (unit) {
                    return unit.page === 'results';
                });
                this.displayPlaywireAds(units);
            }
        }
    }, {
        key: 'hideOverPageAds',
        value: function hideOverPageAds() {
            this.removeAllPlaywireAds();
            document.getElementById('ui-stats-ad-container-desktop').hidden = true;
        }

        /**
         * 
         * @param {string[]} ids 
         */

    }, {
        key: 'showPlaywireAdsById',
        value: function showPlaywireAdsById(ids) {
            var units = PW_UNITS.filter(function (unit) {
                return ids.includes(unit.selectorId);
            });
            this.displayPlaywireAds(units);
        }

        /**
         * @param {{selectorId: string, type: string }[]} units
         */

    }, {
        key: 'displayPlaywireAds',
        value: function displayPlaywireAds(units) {
            var _this7 = this;

            var win = /** @type {ExtendedWindow} */window;
            var callback = function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                    var pwUnits;
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    /** @type {string[]} */
                                    //const currentUnits =  window.tyche.getUnits();
                                    /** @type {{selectorId: string, type: string }[]} */
                                    pwUnits = [];

                                    units.forEach(function (unit) {
                                        if (!_this7.initializedPwUnitsIds.includes(unit.selectorId)) {
                                            pwUnits.push(unit);
                                            _this7.initializedPwUnitsIds.push(unit.selectorId);
                                        }
                                    });

                                    if (!(pwUnits.length > 0)) {
                                        _context.next = 15;
                                        break;
                                    }

                                    _context.prev = 3;
                                    _context.next = 6;
                                    return win.tyche.addUnits(pwUnits);

                                case 6:
                                    win.tyche.displayUnits();
                                    _context.next = 13;
                                    break;

                                case 9:
                                    _context.prev = 9;
                                    _context.t0 = _context['catch'](3);

                                    win.tyche.displayUnits();
                                    console.error(_context.t0);

                                case 13:
                                    _context.next = 16;
                                    break;

                                case 15:
                                    win.tyche.displayUnits();

                                case 16:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this7, [[3, 9]]);
                }));

                return function callback() {
                    return _ref.apply(this, arguments);
                };
            }();

            if (win.tyche && win.tyche.addUnits) {
                callback();
                return;
            }

            this.tycheSubscribers.add(callback);
        }

        /**
         * @param {string[]} units
         */

    }, {
        key: 'removePlaywireAds',
        value: function removePlaywireAds(units) {
            var _this8 = this;

            var win = /** @type {ExtendedWindow} */window;
            var callback = function callback() {
                win.tyche.destroyUnits(units[0] === 'all' ? 'all' : units);

                //All ads are being removed. In case not all ads need to be removed, this logic should be updated.
                _this8.initializedPwUnitsIds.forEach(function (id) {
                    _this8.analytics.adEnd(id);
                });

                _this8.initializedPwUnitsIds = units[0] === 'all' ? [] : _this8.initializedPwUnitsIds = _this8.initializedPwUnitsIds.filter(function (id) {
                    return !units.includes(id);
                });
            };

            if (win.tyche && win.tyche.destroyUnits) {
                callback();
                return;
            }

            this.tycheSubscribers.add(callback);
        }
    }, {
        key: 'showFreestarAds',
        value: function showFreestarAds(slotIds, forceRefresh) {
            if (this.isElectron) {
                //Center UI to fill empty space of ads in home page
                $('#start-row-top').addClass('center-start-row');
                return;
            }
            if (window.freestar && slotIds && slotIds.length > 0) {
                var placementsToInit = [];
                var slotsToForceRefresh = [];

                for (var i = 0; i < slotIds.length; i++) {
                    var slotId = slotIds[i];

                    if (!this.initializedSlots.includes(slotId)) {
                        // set up slot placement for initialization
                        var placement = this.getFreestarSlotPlacement(slotId);
                        if (placement) {
                            placementsToInit.push(placement);
                        } else {
                            console.log("AdManager.showFreestarAds, placement for slot " + slotId + " not found.");
                        }

                        this.initializedSlots.push(slotId);
                    } else if (forceRefresh) {
                        // set up slot placement for refresh
                        slotsToForceRefresh.push(slotId);
                    }
                }

                // initialize ads
                if (placementsToInit.length > 0 && !this.currentUserVip) {
                    try {
                        window.freestar.newAdSlots(placementsToInit);
                        console.log("AdManager.showFreestarAds, initializing ad slots", placementsToInit);
                    } catch (e) {
                        // Ad blockers will cause this error: "Uncaught TypeError: window.freestar.newAdSlots is not a function"
                        // However, sometimes we might be attempting to load before Freestar is ready, 
                        // so add it to Freestar config and let Freestar load it instead.
                        window.freestar.config = window.freestar.config || {};
                        window.freestar.config.enabled_slots = window.freestar.config.enabled_slots || [];
                        for (var _i = 0; _i < placementsToInit.length; _i++) {
                            window.freestar.config.enabled_slots.push(placementsToInit[_i]);
                        }
                        console.log("AdManager.showFreestarAds, deferring ad slots", placementsToInit);
                    }
                }

                // force refresh ads
                if (slotsToForceRefresh.length > 0 && !this.currentUserVip) {
                    try {
                        window.freestar.freestarReloadAdSlot(slotsToForceRefresh);
                        console.log("AdManager.showFreestarAds: refreshing " + slotsToForceRefresh);
                    } catch (e) {
                        // Ad blockers will cause this error: "Uncaught TypeError: window.freestar.freestarReloadAdSlot is not a function"
                        console.log("AdManager.showFreestarAds, unable to refresh " + slotsToForceRefresh + ", " + e);
                    }
                }
            }
        }
    }, {
        key: 'getFreestarSlotPlacement',
        value: function getFreestarSlotPlacement(slotId) {
            var result = null;

            if (slotId && slotIdToPlacement[slotId]) {
                var placement = slotIdToPlacement[slotId];
                result = { placementName: placement, slotId: slotId };
            }

            return result;
        }
    }, {
        key: 'showFreestarVideoAd',
        value: function showFreestarVideoAd(videoAdName, account) {
            if (account && account.profile && account.profile.id && !this.currentUserVip) {
                if (account.profile.id % 10 == 0) {
                    if (window.freestar && videoAdName && videoSlotIdToPlacement[videoAdName]) {
                        window.freestar.queue.push(function () {
                            window.freestar.newVideo(videoSlotIdToPlacement[videoAdName]);
                        });
                    }
                }
            }
        }
    }, {
        key: 'showSpectateAds',
        value: function showSpectateAds() {
            document.getElementById('ui-spectate-ad-container-desktop').hidden = false;
            var units = PW_UNITS.filter(function (unit) {
                return unit.page === 'spectate';
            });
            this.displayPlaywireAds(units);
            this.showSpectateVideoAd();
        }
    }, {
        key: 'hideSpectateAds',
        value: function hideSpectateAds() {
            this.removeAllPlaywireAds();
            this.hideSpectateVideoAd();
            document.getElementById('ui-spectate-ad-container-desktop').hidden = true;
        }

        //https://support.playwire.com/how-to-set-up-video-with-the-video-api

    }, {
        key: 'showSpectateVideoAd',
        value: function showSpectateVideoAd() {
            if (this.currentUserVip) {
                return;
            }
            document.getElementById('ui-spectate-video-ad-container-desktop').hidden = false;
            this.loadSpectateBoltVideoAd('spectate_video_ad');
            this.showPlaywireVideoAd(PW_BOLD_VIDEO_ADS.spectate);
        }
    }, {
        key: 'hideSpectateVideoAd',
        value: function hideSpectateVideoAd() {
            this.removePlaywireVideoAd(PW_BOLD_VIDEO_ADS.spectate);
            document.getElementById('ui-spectate-video-ad-container-desktop').hidden = true;
        }

        /**
         * @param {string} id
         * @description https://support.playwire.com/how-to-set-up-video-with-the-video-api
         */

    }, {
        key: 'showPlaywireVideoAd',
        value: function showPlaywireVideoAd(id) {
            var timer = window.setInterval(checkForBolt, 100);
            function checkForBolt() {
                console.log('%cChecking for Bolt object', 'background: yellow;');
                if (typeof window.Bolt !== 'undefined') {
                    // clear interval timer
                    window.clearInterval(timer);
                    console.log('%cBolt Player Object Ready', 'background: green;');
                    // render the player with data-id of 'myPlayer'
                    window.Bolt.renderPlayer(id);
                    // window.Bolt.showPlayer(id);
                    // window.Bolt.playMedia(id);
                    console.log('%cBolt Player Rendered', 'background: green;');
                }
            }
        }

        /**
         * @param {string} containerId
         */

    }, {
        key: 'loadSpectateBoltVideoAd',
        value: function loadSpectateBoltVideoAd(containerId) {
            var container = document.getElementById(containerId);
            if (container.querySelector('#spectate_video_ad_js')) {
                return;
            }
            var script = document.createElement('script');
            script.src = '//web.archive.org/web/20211102160635/https://cdn.playwire.com/bolt/js/zeus/embed.js';
            script.type = 'text/javascript';
            script.id = 'spectate_video_ad_js';
            script.setAttribute('data-config', "https://web.archive.org/web/20211102160635/https://config.playwire.com/1024483/v2/pre_content.json");
            script.setAttribute('data-height', '100%');
            script.setAttribute('data-width', '100%');
            script.setAttribute('data-autoload', 'true');
            script.setAttribute('data-id', 'bha_spectate_video_ad');
            container.appendChild(script);
        }

        /**
         * @param {string} id
         * @description https://developers.playwire.com/bolt-api-documentation/#remove-video 
         */

    }, {
        key: 'removePlaywireVideoAd',
        value: function removePlaywireVideoAd(id) {
            var playerEl = document.getElementById(id);
            if (typeof window.Bolt !== 'undefined' && window.Bolt.hidePlayer && playerEl && window.Bolt.getPlayer(id)) {
                window.Bolt.removeVideo(id, true);
            }
        }
    }, {
        key: 'deleteFreestarVideoAds',
        value: function deleteFreestarVideoAds() {
            if (window.freestar && window.freestar.deleteVideo) {
                window.freestar.deleteVideo();
            }
        }
    }]);
    return AdManager;
}();

module.exports = {
    AdManager: AdManager
};
