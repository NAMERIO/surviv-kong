"use strict";


var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var helpers = require("./helpers.js");
var AnalyticsService = require("./analyticsService.js");
// Disable logging in production
if ( true && !helpers.getParameterByName('debug')) {
    console.log = function () {};
}

var $ = require("./8ee62bea.js");
var PIXI = require("./8b1dfb45.js");
PIXI.utils.skipHello();

require("./deb4ca7e.js");

var GameConfig = require("./989ad62a.js");
var math = require("./10899aea.js");
var net = require("./net.js");
var MapDefs = require("./mapDefs.js");
var GeneralDefs = require("./generalUseDefs.js");
var Account = require("./account.js");
var Ads = require("./ads.js");
var api = require("./api.js");
var Ambience = require("./ambience.js");
var AudioManager = require("./audioManager.js");
var Config = require("./config.js");
var device = require("./device.js");
var FirebaseManager = require("./FirebaseManager.js");
var Game = require("./game.js");
var Input = require("./input.js");
var InputBinds = require("./inputBinds.js");
var LoadoutDisplay = require("./loadoutDisplay.js");
var HomeLoadoutDisplay = require("./homeLoadoutDisplay.js");
var LoadoutMenu = require("./loadoutMenu.js");
var Localization = require("./localization.js");
var Eventhandler = require("./eventhandler.js");
var menu = require("./menu.js");
var MenuModal = require("./menuModal.js");
var Pass = require("./pass.js");
var PingTest = require("./pingTest.js");
var ProfileUi = require("./profileUi.js");
var proxy = require("./proxy.js");
var resources = require("./resources.js");
var SiteInfo = require("./siteInfo.js");
var TeamMenu = require("./teamMenu.js");
var Ui2 = require("./ui2.js");
var webview = require("./webview.js");
var Spinner = require("./spinner.js");
var IAP = require("./iap.js");
var Market = require("./market.js");
var OpponentMenu = require("./opponentMenu.js");
var OpponentDisplay = require("./opponentDisplay.js");
var SpineObjManager = require("./spineObjManager.js");
var WeaponSelector = require("./weaponSelector.js");
var GearForge = require("./gearForge.js");
var RewardsModal = require("./modal-quest-rewards.js");
var BugBattleService = require("./bugBattleService.js");
window.addEventListener("error", function (e) {
    console.log("Error occurred: " + e.error.message);
    return false;
});

window.addEventListener('unhandledrejection', function (e) {
    console.log("Error occurred: " + e.reason.message);
});

var SliderVolumeControl = function () {

    /**
    * 
    * @param {NodeList} elements 
    * @param {(volume: number) => void} setVolumeFn
    * @param {(volume: number) => void} saveConfigFn
    */
    function SliderVolumeControl(elements, setVolumeFn, saveConfigFn) {
        var _this = this;

        (0, _classCallCheck3.default)(this, SliderVolumeControl);

        this.elements = elements;
        this.setVolumeFn = setVolumeFn;
        this.saveConfigFn = saveConfigFn;
        var initialVolume = parseFloat(elements[0].value) / 100.0;
        this.setSliderCss(initialVolume);

        this.elements.forEach(function (element) {
            element.oninput = function (e) {
                var percentage = parseFloat(e.target.value);
                var volume = percentage / 100.0;
                _this.setSliderCss(volume);
                _this.setVolumeFn(volume);
                _this.saveConfigFn(volume);
            };
        });
    }

    (0, _createClass3.default)(SliderVolumeControl, [{
        key: 'setSliderCss',
        value: function setSliderCss(percentage) {

            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].style.setProperty('--slider-progress', '' + percentage);
            }
        }

        /**
         * 
         * @param {number} val 
         */

    }, {
        key: 'setVolume',
        value: function setVolume(val) {
            var volume = typeof val !== 'number' || isNaN(val) ? 0 : val;

            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].value = '' + volume * 100.0;
            }

            this.setSliderCss(val);
            this.setVolumeFn(volume);
        }
    }]);
    return SliderVolumeControl;
}();
//
// App
//


function m_App() {
    var _this2 = this;

    //TODO delete after mobile is ready
    if (device.mobile || device.tablet) {
        document.getElementById('mobile-splash-screen').classList.add('showSplashScreen');
        return;
    }

    /** @type {import('./bugbattle')}} */
    this.bugBattle = new BugBattleService();
    // DOM Elements
    this.nameInput = $('#player-name-input-solo');
    this.serverSelect = device.mobile ? $('#server-select-main-mobile') : $('#server-select-main');
    this.btnStartBattle = $('#btn-play-game');
    this.btnChangeMode = device.mobile ? $('#index-mode-select-container') : $('#btn-change-mode');
    this.btnChangeType = device.mobile ? $('#index-type-select-container') : $('#btn-change-type');
    this.btnChangeModeSelection = $('#btn-change-mode-selection');
    this.btnChangeTypeSelection = $('#btn-change-type-selection');
    this.modeOptions = this.btnChangeMode.find('#index-mode-select');
    this.typeOptions = this.btnChangeType.find('#index-type-select');
    /** @type {HTMLButtonElement} */
    this.muteBtn = document.querySelector('#btn-sound-toggle');
    this.aimLineBtn = $('#btn-game-aim-line');
    /** @type {SliderVolumeControl} */
    this.masterVolumeControl = null;
    /** @type {SliderVolumeControl} */
    this.sfxVolumeControl = null;
    /** @type {SliderVolumeControl} */
    this.musicVolumeControl = null;
    /** @type {HTMLInputElement} */
    this.masterVolumeSlider = document.querySelectorAll('.sl-master-volume');
    /** @type {HTMLInputElement} */
    this.sfxVolumeSlider = document.querySelectorAll('.sl-sound-volume');
    /** @type {HTMLInputElement} */
    this.musicVolumeSlider = document.querySelectorAll('.sl-music-volume');
    this.serverWarning = $('#server-warning');
    this.languageSelect = $('.language-select');
    this.startMenuWrapper = $('#start-menu-wrapper');
    this.gameAreaWrapper = $('#game-area-wrapper');
    this.playButtons = $('.play-button-container');
    this.playLoading = $('.play-loading-outer');
    this.modalBtn = $('#modal-btn');
    this.leftHandedCheck = $('#activateDpad');
    this.sensitivitySLider = $('#sensitivity-slider');
    this.autoMeleeCheck = $('#autoMelee');
    this.aimAssistCheck = $('#aimAssist');
    this.progressNotificationActiveCheck = $('#progressNotificationActive');
    this.playerOptions = $('#player-options');
    this.btnSupport = $('#btn-support');

    // Modals
    this.errorModal = new MenuModal($('#modal-notification'));
    this.errorBanModal = new MenuModal($('#modal-temporal-ban'));
    this.refreshModal = new MenuModal($('#modal-refresh'));
    this.eventsModal = $('#event-modal');
    this.supportModal = new MenuModal($('#modal-support'));

    // Modules
    this.config = new Config();

    this.localization = new Localization();
    this.analytics = new AnalyticsService(this.localization);
    this.eventhandler = new Eventhandler();
    this.adManager = new Ads.AdManager(this.config, this.analytics);
    this.account = new Account(this.config, this.analytics, this.adManager, this.localization);
    this.gearForge = new GearForge(this.localization, this.account);
    this.loadoutMenu = new LoadoutMenu(this.account, this.localization, this.resourceManager, this.adManager, this.config);
    this.opponentMenu = new OpponentMenu(this.account, this.localization, this.adManager);

    this.pingTest = new PingTest();
    this.siteInfo = new SiteInfo(this.config, this.localization, this);
    this.audioManager = new AudioManager();
    this.ambience = new Ambience();
    this.teamMenu = new TeamMenu(this.config, this.pingTest, this.siteInfo, this.localization, this.audioManager, this.onTeamMenuJoinGame.bind(this), this.onTeamMenuLeave.bind(this), this.analytics, this.account, this.adManager);

    this.homeLoadout = new HomeLoadoutDisplay(this.account, this.config, this.resourceManager, this.localization);

    this.iap = new IAP(this.account, this.localization, this.analytics, this.adManager, this.config, this.audioManager, this.loadoutMenu.armoryGearMenu);

    /// clean up local storage variable
    localStorage.setItem('premium', false);
    this.pass = new Pass(this.account, this.loadoutMenu, this.localization, this.iap, this.adManager);

    //Weapons Selector List
    var weaponList = ['staff_elderwood', 'sword_broadstrike', 'dagger_dirk', 'bow_spiritshot', 'axe_sever', 'wand_stardust'];
    //let weaponList = ['staff_wickedgnarl','sword_sunder','dagger_gaia','bow_markflight','axe_infamy','wand_aptitude'];
    //let weaponList = ['staff_wickedgnarl','dagger_gaia','wand_aptitude'];
    var defaultWeaponID = 0; //0 to length of the weaponList-1
    var waitingTime = 20;
    this.weaponSelector = new WeaponSelector(this.account, weaponList, defaultWeaponID, this.config, this.localization, waitingTime);

    this.profileUi = new ProfileUi(this.account, this.localization, this.loadoutMenu, this.homeLoadout, this.errorModal, this.errorBanModal, this.config, this.pass, this.adManager, this.gearForge);

    this.loadoutMenu.goToForge = this.profileUi.goToForge;

    this.market = new Market(this.account, this.localization, this.analytics, this.iap);
    this.spinner = new Spinner(this.account, this.localization, this.audioManager, this.profileUi, this.iap);

    RewardsModal.init(this.account, this.localization);

    this.pixi = null;
    this.littlepixi = null;
    this.weaponPixi = null;
    this.resourceManager = null;
    this.input = null;
    this.inputBinds = null;
    this.inputBindUi = null;
    this.game = null;
    this.loadoutDisplay = null;
    this.opponentDisplay = null;
    this.SpineObjManager = null;

    // State
    this.domContentLoaded = false;
    this.configLoaded = false;
    this.initialized = false;
    this.active = false;

    this.sessionId = helpers.random64();
    this.contextListener = function (e) {
        e.preventDefault();
    };
    this.errorMessage = '';

    this.quickPlayPendingModeIdx = -1;
    this.findGameAttempts = 0;
    this.findGameTime = 0;
    this.gameModeSelected = [0, 0, 0];
    this.gameModesAvailable = [{
        "map": "bitheroes_main",
        "modes": [{ "type": 1, "id": 0 }, { "type": 2, "id": 1 }, { "type": 4, "id": 2 }]
    }];
    this.lastModeCss = '';
    this.factionSelected = false;

    this.pauseTime = 0;
    this.wasPlayingVideo = false;
    this.checkedPingTest = false;
    this.hasFocus = true;

    var onLoadComplete = function onLoadComplete() {
        _this2.config.load(function () {
            _this2.configLoaded = true;
            _this2.m_tryLoad();
            $("body").removeClass("loading-localization");
        });
    };
    if (device.webview && device.version > '1.0.0') {
        this.loadWebviewDeps(onLoadComplete);
    } else {
        this.loadBrowserDeps(onLoadComplete);
    }
}

m_App.prototype = {

    loadBrowserDeps: function loadBrowserDeps(onLoadCompleteCb) {
        onLoadCompleteCb();
    },

    loadWebviewDeps: function loadWebviewDeps(onLoadCompleteCb) {
        var _this3 = this;

        // 'deviceready' is fired when cordova.js finishes loading
        document.addEventListener('deviceready', function () {
            document.addEventListener('pause', function () {
                _this3.onPause();
            });
            document.addEventListener('resume', function () {
                _this3.onResume();
            });

            onLoadCompleteCb();
        }, false);
        // Load cordova.js
        // @TODO: Display spinner until this is loaded?
        (function (d, s, id) {
            if (device.version < '1.1.0') {
                window.location.replace('/version-update.html');
            } else {
                var scriptRoot = 'cordova/' + device.version;
                var scriptSrc = scriptRoot + '/' + device.os + '/cordova.js';

                var js,
                    fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.onload = function () {
                    // remote script has loaded
                };
                js.src = scriptSrc;
                fjs.parentNode.insertBefore(js, fjs);
            }
        })(document, 'script', 'cordova-js');
    },

    // Callbacks
    m_tryLoad: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var _this4 = this;

            var language, currentStep, isInTeam, that, toggleMuteAudio, settingConfigCheckboxes, currentNewsDate, currentNewsTimeStamp, lastNewsTimeStamp, domCanvas, rendererRes, createPixiApplication, littlepixi, weaponPixi, pixi, onJoin, onQuit;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(!this.domContentLoaded || !this.configLoaded || this.initialized)) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return');

                        case 2:
                            this.initialized = true;

                            // Reset AutoFill; this may help prevent confusion
                            // with new players who accidentally disable it.
                            this.config.teamAutoFill = true;

                            if (device.webview) {
                                menu.applyWebviewStyling(device.tablet);
                            } else if (device.mobile) {
                                menu.applyMobileBrowserStyling(device.tablet);
                            } else if (/surviviosteam/i.test(navigator.userAgent)) {
                                menu.applySteamStyling();
                            }

                            language = this.config.get('language') || this.localization.detectLocale();

                            this.config.set('language', language);
                            _context.next = 9;
                            return this.localization.setLocale(language);

                        case 9:
                            this.localization.populateLanguageSelect();
                            //this.setCookie("events-cookie", '', 'Fri, 5 Oct 2050 14:28:00 GMT');

                            if (helpers.getCookie('app-data') || this.config.get('BHAIdUnlinked') || this.config.get('sessionCookie')) {
                                this.eventhandler.setValidModals();
                                this.eventhandler.setLocalization(this.localization.getLocalizedJson());
                                this.eventhandler.checkModals(this.readCookie("events-cookie"));
                            }

                            this.startPingTest();
                            this.siteInfo.load();

                            this.localization.localizeIndex();
                            this.account.init();
                            this.adManager.init();
                            this.spinner.init();
                            this.homeLoadout.init();
                            this.iap.init();
                            this.market.init();

                            /* FTUE */ //@TODO: Uncomment code ftue ready
                            currentStep = this.readCookie('ftue-step');
                            isInTeam = window.location.hash;

                            if (currentStep && currentStep < GeneralDefs.ftue_steps.steps.length && !isInTeam) {
                                this.playStep(currentStep);
                                this.analytics.tutorialStepEnds('last step ' + currentStep, currentStep, false);
                            } else if (!currentStep && !isInTeam) {
                                $('#modal-ftue').css('display', 'block');
                                this.adManager.tutorialStarted = true;
                                this.adManager.hideBannerAd();
                            } else {
                                $('#modal-ftue').css('display', 'none');
                            }

                            if (helpers.getCookie('app-data')) {
                                $('.note-ftue').css('display', 'none');
                            } else {
                                $('.note-ftue').css('display', 'block');
                            }

                            // Input
                            this.nameInput.maxLength = net.Constants.PlayerNameMaxLen;
                            this.btnStartBattle.on('click', function () {
                                currentStep = _this4.readCookie('ftue-step'); // @TODO: Uncomment code ftue ready
                                if (currentStep == 0 || currentStep == 5) {
                                    currentStep = parseInt(currentStep) + 1;
                                    _this4.setCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
                                    $('#modal-ftue').css('display', 'block');
                                    _this4.playStep(currentStep);
                                } else if (currentStep == 8) {
                                    currentStep = parseInt(currentStep) + 1;
                                    _this4.setCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
                                    _this4.analytics.tutorialStepEnds('Tutorial Ended step', currentStep, false);
                                    _this4.account.loadProfile(); //TODO ideal only get the equipped loadout stats (to get most recent stats)
                                    _this4.tryQuickStartGame(_this4.gameModeSelected[2]);
                                } else {
                                    _this4.account.loadProfile(); //TODO ideal only get the equipped loadout stats (to get most recent stats)
                                    _this4.tryQuickStartGame(_this4.gameModeSelected[2]);
                                }
                            });

                            if (!device.mobile) {
                                $(document).on('click', function (e) {
                                    if (_this4.btnChangeModeSelection.is(':visible')) {
                                        _this4.btnChangeModeSelection.css('display', 'none');
                                        _this4.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
                                        _this4.btnChangeMode.find('.btn-divider').removeAttr('style');
                                    }
                                    if (_this4.btnChangeTypeSelection.is(':visible')) {
                                        _this4.btnChangeTypeSelection.css('display', 'none');
                                        _this4.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                                        _this4.btnChangeType.find('.btn-divider').removeAttr('style');
                                    }
                                });
                                that = this;

                                this.btnChangeMode.on('click', function (e) {
                                    e.stopPropagation();
                                    _this4.btnChangeTypeSelection.css('display', 'none');
                                    _this4.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                                    _this4.btnChangeType.find('.btn-divider').removeAttr('style');
                                    if (_this4.btnChangeModeSelection.is(':visible')) {
                                        _this4.btnChangeModeSelection.css('display', 'none');
                                        _this4.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
                                        _this4.btnChangeMode.find('.btn-divider').removeAttr('style');
                                    } else {
                                        if (_this4.factionSelected) {
                                            _this4.btnChangeMode.css('display', 'none');
                                            setTimeout(function () {
                                                that.btnChangeMode.removeAttr('style');
                                            }, 10);
                                        }
                                        _this4.btnChangeModeSelection.css('display', 'block');
                                        _this4.btnChangeMode.find('.index-dropdown-arrow').css('display', 'none');
                                        _this4.btnChangeMode.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                                    }

                                    $('#start-overlay').on('click', function (e) {
                                        _this4.btnChangeModeSelection.css('display', 'none');
                                    });
                                });
                                this.btnChangeType.on('click', function (e) {
                                    e.stopPropagation();
                                    _this4.btnChangeModeSelection.css('display', 'none');
                                    _this4.btnChangeMode.find('.btn-divider').removeAttr('style');
                                    if (_this4.btnChangeTypeSelection.is(':visible')) {
                                        _this4.btnChangeTypeSelection.css('display', 'none');
                                        _this4.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                                        _this4.btnChangeType.find('.btn-divider').removeAttr('style');
                                    } else {
                                        _this4.btnChangeTypeSelection.css('display', 'block');
                                        _this4.btnChangeType.find('.index-dropdown-arrow').css('display', 'none');
                                        _this4.btnChangeType.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                                    }

                                    $('#start-overlay').on('click', function (e) {
                                        _this4.btnChangeTypeSelection.css('display', 'none');
                                    });
                                });

                                this.btnChangeModeSelection.on('click', '.option-change-mode', function (e) {
                                    var btnId = parseInt($(e.target).attr('id'));
                                    _this4.gameModeSelected[0] = btnId;
                                    _this4.gameModeSelected[1] = 0;
                                    if (!device.mobile) {
                                        _this4.updatePlayBtns();
                                    }
                                });

                                this.btnChangeTypeSelection.on('click', '.option-change-type', function (e) {
                                    var btnId = parseInt($(e.target).attr('id'));
                                    _this4.gameModeSelected[1] = btnId;
                                    if (!device.mobile) {
                                        _this4.updatePlayBtns();
                                    }
                                });
                            } else {
                                this.modeOptions.change(function () {
                                    var seletedValue = _this4.modeOptions.find(":selected").val();
                                    _this4.gameModeSelected[0] = seletedValue;
                                    _this4.gameModeSelected[1] = 0;
                                    _this4.updatePlayBtns(false, true);
                                });

                                this.typeOptions.change(function (e) {
                                    var seletedValue = _this4.typeOptions.find(":selected").val();
                                    _this4.gameModeSelected[1] = seletedValue;
                                    _this4.updatePlayBtns(false, false);
                                });
                            }

                            this.serverSelect.change(function () {
                                var selectedRegion = _this4.serverSelect.find(":selected");
                                var region = selectedRegion.val();
                                if (region) _this4.config.set('region', region);

                                var localizedRegion = _this4.localization.translate(selectedRegion.attr('data-l10n'));
                                var localizedRegionTitle = _this4.localization.translate('index-region');

                                _this4.serverSelect.find("option:first").text(localizedRegionTitle + ' | ' + localizedRegion);
                                _this4.serverSelect.find("option:first").prop('selected', true);
                            });

                            this.modalBtn.on('click', function () {
                                _this4.setCookie("events-cookie", _this4.eventhandler.getLastSeen(), 'Fri, 5 Oct 2050 14:28:00 GMT');
                                _this4.eventsModal.fadeOut(200, function () {
                                    $(this).hide();
                                });
                            });

                            // Settings
                            this.nameInput.on('blur', function (e) {
                                _this4.setConfigFromDOM();
                            });

                            this.playerOptions.on('click', function (e) {
                                if (_this4.account.loggedIn && _this4.account.unlinked) {
                                    _this4.profileUi.showIncentiveModal();
                                }
                            });

                            this.btnSupport.on('click', function (e) {
                                _this4.supportModal.show(true);
                            });

                            $('#modal-support #modal-no-gp-more').on('click', function (e) {
                                _this4.supportModal.hide();
                                window.open('https://web.archive.org/web/20211102160635/https://survivio.zendesk.com/hc/en-us/sections/360009119191-FAQ', '_blank');
                            });

                            $('#modal-support .close-corner').on('click', function (e) {
                                _this4.supportModal.hide();
                            });

                            toggleMuteAudio = function toggleMuteAudio(muted) {
                                var toggleSoundIcon = _this4.muteBtn.querySelector('.sound-icon');
                                if (!muted) {
                                    toggleSoundIcon.classList.remove('off');
                                } else {
                                    toggleSoundIcon.classList.add('off');
                                }
                            };

                            toggleMuteAudio(!!this.config.get('muteAudio'));
                            this.muteBtn.onclick = function () {
                                _this4.config.set('muteAudio', !_this4.config.get('muteAudio'));
                            };

                            this.masterVolumeControl = new SliderVolumeControl(this.masterVolumeSlider, function (volume) {
                                return _this4.audioManager.setMasterVolume(volume);
                            }, function (volume) {
                                _this4.config.set('masterVolume', volume);
                            });

                            this.sfxVolumeControl = new SliderVolumeControl(this.sfxVolumeSlider, function (volume) {
                                return _this4.audioManager.setSoundVolume(volume);
                            }, function (volume) {
                                _this4.config.set('soundVolume', volume);
                            });

                            this.musicVolumeControl = new SliderVolumeControl(this.musicVolumeSlider, function (volume) {
                                return _this4.audioManager.setMusicVolume(volume);
                            }, function (volume) {
                                _this4.config.set('musicVolume', volume);
                            });

                            this.sensitivitySLider.on('input', function (e) {
                                var sensitivityValue = $(e.target).val() / 100;
                                _this4.config.set('sensitivity', sensitivityValue);
                            });

                            this.leftHandedCheck.on('change', function (e) {
                                var checkedValue = $(e.target).prop('checked');
                                if (checkedValue === true) {
                                    _this4.config.set('regularAnalogs', false);
                                } else {
                                    _this4.config.set('regularAnalogs', true);
                                }
                            });

                            this.autoMeleeCheck.on('change', function (e) {
                                var checkedValue = $(e.target).prop('checked');
                                if (checkedValue === true) {
                                    _this4.config.set('autoMelee', false);
                                } else {
                                    _this4.config.set('autoMelee', true);
                                }
                            });

                            this.aimAssistCheck.on('change', function (e) {
                                var checkedValue = $(e.target).prop('checked');
                                if (checkedValue === true) {
                                    _this4.config.set('aimAssist', false);
                                } else {
                                    _this4.config.set('aimAssist', true);
                                }
                            });

                            //In game notification
                            this.progressNotificationActiveCheck.on('change', function (e) {
                                var checkedValue = $(e.target).prop('checked');
                                if (checkedValue === true) {
                                    _this4.config.set('progressNotificationActive', false);
                                } else {
                                    _this4.config.set('progressNotificationActive', true);
                                }
                            });

                            /** @type{HTMLInputElement[]} */
                            settingConfigCheckboxes = document.querySelectorAll('.setting-config-checkbox');


                            settingConfigCheckboxes.forEach(function (checkbox) {
                                checkbox.checked = !!_this4.config.get(checkbox.id);

                                checkbox.onchange = function (e) {
                                    var checked = e.target.checked;
                                    _this4.config.set(e.target.id, checked);
                                };
                            });
                            document.querySelectorAll('.btn-fullscreen-toggle').forEach(function (button) {
                                button.addEventListener('click', function () {
                                    helpers.toggleFullScreen();
                                });
                            });

                            // Listen for changes in language select
                            this.languageSelect.on('change', function (e) {
                                var value = e.target.value;
                                if (value) {
                                    _this4.config.set('language', value);
                                }
                            });

                            // Team buttons
                            $('#btn-create-team').on('click', function () {
                                _this4.tryJoinTeam(true);
                            });

                            $('#btn-team-mobile-link-join').on('click', function () {
                                var roomUrl = $('#team-link-input').val().trim();
                                var hashIdx = roomUrl.indexOf('#');
                                if (hashIdx >= 0) {
                                    roomUrl = roomUrl.slice(hashIdx + 1);
                                }
                                if (roomUrl.length > 0) {
                                    $('#team-mobile-link').css('display', 'none');
                                    _this4.tryJoinTeam(false, roomUrl);
                                } else {
                                    $('#team-mobile-link-desc').css('display', 'none');
                                    $('#team-mobile-link-warning').css('display', 'none').fadeIn(100);
                                }
                            });

                            $('#btn-team-leave, #close-team-menu').on('click', function () {
                                if (window.history) {
                                    window.history.replaceState('', '', '/');
                                }
                                _this4.account.setDiscordRP(1);
                                _this4.account.resetTeams();
                                // Control flow is very hacky; we need to cancel
                                // an in-progress join upon clicking leave, so do
                                // that now.
                                if (_this4.game) {
                                    _this4.game.m_free();
                                }

                                _this4.teamMenu.leave();
                            });

                            //ftue interactions
                            $('.ftue-close, #ftue-yes').on('click', function () {
                                _this4.analytics.tutorialStepEnds('YES', 1, false);
                                helpers.writeCookie("ftue-step", 12, 'Fri, 5 Oct 2050 14:28:00 GMT');
                                $('#modal-ftue').fadeOut(200);
                                _this4.profileUi.showIncentiveModal();
                                /* this.profileUi.showLoginMenu({
                                    modal: true,
                                    loginFlow: true
                                }); */
                            });

                            $('#ftue-no').on('click', function () {
                                _this4.analytics.tutorialStepEnds('NO', 1, false);
                                _this4.adManager.tutorialStarted = true;
                                _this4.adManager.hideBannerAd();
                                _this4.startTutorial();
                                /*  this.profileUi.showLoginMenu({
                                     modal: true,
                                     loginFlow: true
                                 }); */
                            });

                            $('.ftue-next').on('click', function () {
                                var currentStep = _this4.readCookie('ftue-step');
                                var step = GeneralDefs.ftue_steps.steps[currentStep];
                                if (step.close) {
                                    $('#modal-ftue').css('display', 'none');
                                } else if (step.autoStartBattle) {
                                    $('#modal-ftue').css('display', 'none');
                                    _this4.tryQuickStartGame(_this4.gameModeSelected[2]);
                                } else {
                                    currentStep = parseInt(currentStep) + 1;

                                    if (currentStep == 6) {
                                        _this4.profileUi.showIncentiveModal();
                                        $('.ftue-modal-content').css('display', 'none');
                                        $('#modal-ftue').css('display', 'none');
                                        return;
                                    }

                                    _this4.setCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
                                    _this4.playStep(currentStep);
                                }
                            });

                            // News toggle listener
                            currentNewsDate = $('#news-current').data('date');
                            currentNewsTimeStamp = new Date(currentNewsDate).getTime();

                            $('#btn-news').on('click', function () {
                                var modalNews = new MenuModal($('#modal-news'));

                                _this4.config.set('lastNewsTimestamp', currentNewsTimeStamp);
                                $('.news-toggle').find('.account-alert').css('display', 'none');
                                modalNews.show();
                            });

                            // Alert if there's unread news
                            lastNewsTimeStamp = this.config.get('lastNewsTimestamp');

                            if (currentNewsTimeStamp > lastNewsTimeStamp) {
                                $('.news-toggle').find('.account-alert').css('display', 'block');
                            }

                            this.setDOMFromConfig();
                            this.setAppActive(true);

                            if (window.freestar) {
                                window.freestar.queue.push(function () {
                                    // This listener will be called when a creative iframe load event fires.
                                    //var targetSlot = ...;
                                    window.googletag.pubads().addEventListener('slotOnload', function (event) {
                                        var slot = event.slot;
                                        if (slot && slot.getSlotElementId()) {
                                            switch (slot.getSlotElementId()) {
                                                case 'survivio_300x600_loadout':
                                                    _this4.analytics.adStart(slot.getSlotElementId(), false, 'Loadout', 'Banner', 'Freestar');
                                                    break;
                                                case 'spectate_tp_leaderboard_atf':
                                                    _this4.analytics.adStart(slot.getSlotElementId(), false, 'Spectate', 'Banner', 'Freestar');
                                                    break;
                                                case 'survivio_mobile_over':
                                                case 'results_bc_leaderboard_btf':
                                                    _this4.analytics.adStart(slot.getSlotElementId(), false, 'Battle Results', 'Banner', 'Freestar');
                                                    break;
                                                default:
                                                    _this4.analytics.adStart(slot.getSlotElementId(), false, 'Home', 'Banner', 'Freestar');
                                                    break;
                                            }
                                        }
                                    });
                                });
                            }

                            /*const bgCanvas = document.getElementById('background-canvas');
                            const resolution = window.devicePixelRatio > 1.0 ? 2.0 : 1.0;
                            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
                            const createPixiApp = (forceCanvas) => {
                                return new PIXI.Application({
                                    width: window.innerWidth,
                                    height: window.outerHeight,
                                    view: bgCanvas,
                                    antialias: false,
                                    resolution,
                                    forceCanvas,
                                    transparent: true
                                });
                            };
                            let bgPixi = null;
                            try {
                                bgPixi = createPixiApp(false);
                            } catch (e) {
                                bgPixi = createPixiApp(true);
                            }
                            this.bgPixi = bgPixi;
                            this.bgPixi.renderer.plugins.interaction.destroy();
                            this.bgPixi.renderer.transparent = true;
                             PIXI.loader
                                .add('bg', 'img/spine/ui/bha_landing_page.json')
                                .load((a, resources) => {
                                    const bg = new PIXI.spine.Spine(resources.bg.spineData);
                                    bg.state.setAnimation(0, 'animation', true);
                                    window.bg = bg;
                                    bgPixi.stage.addChild(bg);
                                });
                            */
                            // Init PIXI; this is slow, takes ~250ms
                            domCanvas = document.getElementById('small-cvs');
                            rendererRes = window.devicePixelRatio > 1.0 ? 2.0 : 1.0;

                            if (device.os == 'ios') {
                                PIXI.settings.PRECISION_FRAGMENT = 'highp';
                            }
                            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

                            createPixiApplication = function createPixiApplication(forceCanvas) {
                                return new PIXI.Application({
                                    width: 400,
                                    height: 400,
                                    view: domCanvas,
                                    antialias: false,
                                    resolution: rendererRes,
                                    forceCanvas: forceCanvas,
                                    transparent: true
                                });
                            };

                            littlepixi = null;

                            try {
                                littlepixi = createPixiApplication(false);
                            } catch (e) {
                                littlepixi = createPixiApplication(true);
                            }
                            this.littlepixi = littlepixi;
                            this.littlepixi.renderer.plugins.interaction.destroy();
                            this.littlepixi.renderer.transparent = true;

                            //Weapon Selection Spine Boy
                            domCanvas = document.getElementById('modal-weapon-canvas');

                            if (device.os == 'ios') {
                                PIXI.settings.PRECISION_FRAGMENT = 'highp';
                            }
                            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
                            createPixiApplication = function createPixiApplication(forceCanvas) {
                                return new PIXI.Application({
                                    //width: 60,
                                    //height: 60,
                                    width: 1920,
                                    height: 1080,
                                    view: domCanvas,
                                    antialias: false,
                                    resolution: rendererRes,
                                    forceCanvas: forceCanvas,
                                    transparent: true
                                });
                            };
                            weaponPixi = null;

                            try {
                                weaponPixi = createPixiApplication(false);
                            } catch (e) {
                                weaponPixi = createPixiApplication(true);
                            }
                            this.weaponPixi = weaponPixi;
                            this.weaponPixi.renderer.plugins.interaction.destroy();
                            this.weaponPixi.renderer.transparent = true;

                            // Init PIXI; this is slow, takes ~250ms
                            //Game Pixi
                            domCanvas = document.getElementById('cvs');
                            if (device.os == 'ios') {
                                PIXI.settings.PRECISION_FRAGMENT = 'highp';
                            }
                            createPixiApplication = function createPixiApplication(forceCanvas) {
                                return new PIXI.Application({
                                    width: window.innerWidth,
                                    height: window.innerHeight,
                                    view: domCanvas,
                                    antialias: false,
                                    resolution: rendererRes,
                                    forceCanvas: forceCanvas
                                });
                            };
                            pixi = null;

                            try {
                                pixi = createPixiApplication(false);
                            } catch (e) {
                                pixi = createPixiApplication(true);
                            }
                            this.pixi = pixi;
                            this.pixi.renderer.plugins.interaction.destroy();
                            this.pixi.ticker.add(this.update, this);
                            this.pixi.renderer.backgroundColor = 0x709645;

                            this.resourceManager = new resources.ResourceManager(this.pixi.renderer, this.audioManager, this.config);
                            this.resourceManager.loadMapAssets('main');
                            this.resourceManager.loadSpineAssets(['hero', 'hero_fx', 'projectiles']);

                            this.SpineObjManager = new SpineObjManager(this.resourceManager.spineData);

                            this.homeLoadout.setSpineData(this.resourceManager.spineData);
                            this.homeLoadout.setPixiApp(this.littlepixi);
                            this.homeLoadout.buildLoadout();

                            this.weaponSelector.setPixiContainer(this.weaponPixi);
                            this.weaponSelector.setSpineData(this.resourceManager.spineData);
                            this.loadoutMenu.setSpineData(this.resourceManager.spineData);

                            this.input = new Input.m_InputHandler(document.getElementById('game-touch-area'), this.bugBattle);
                            this.inputBinds = new InputBinds.InputBinds(this.input, this.config, this.bugBattle);
                            this.inputBindUi = new InputBinds.InputBindUi(this.input, this.inputBinds);

                            onJoin = function onJoin() {
                                _this4.opponentDisplay.m_free();
                                _this4.game.m_init();
                                _this4.onResize();
                                _this4.findGameAttempts = 0;
                                _this4.ambience.onGameStart();
                                _this4.adManager.onGameStart();

                                if (_this4.config.get('incentiveGame1') === undefined) {
                                    _this4.config.set('incentiveGame1', true);
                                }
                            };

                            onQuit = function onQuit(errMsg) {
                                _this4.weaponSelector.hide();

                                //Show kills counter on mobile
                                if (device.mobile && device.screenWidth < 1024) {
                                    $('#ui-mobile-kills-container').removeClass('force-hide');
                                    $('#ui-mobile-kill-leader-wrapper').removeAttr('style');
                                    $('#ui-killfeed').removeAttr('style');
                                }

                                var currentStep = _this4.readCookie('ftue-step');
                                if (currentStep == 4) {
                                    $('#modal-ftue').css('display', 'block');
                                    currentStep = parseInt(currentStep) + 1;
                                    _this4.setCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
                                    _this4.playStep(currentStep);
                                }

                                // open gbp
                                if (currentStep == 7) {
                                    currentStep = parseInt(currentStep) + 1;
                                    _this4.setCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
                                    _this4.analytics.tutorialStepEnds('playing step ' + currentStep, currentStep, false);
                                    if (!_this4.account.pass.premium) {
                                        _this4.pass.showPremiumModal();
                                    }
                                }

                                if (_this4.game.updatePass) {
                                    _this4.pass.scheduleUpdatePass(_this4.game.updatePassDelay);
                                }
                                if (_this4.game.m_playerBarn && _this4.game.m_playerBarn.m_playerInfo && _this4.game.m_playerBarn.m_playerInfo[_this4.game.m_localId]) {
                                    var playerLoadout = _this4.game.m_playerBarn.m_playerInfo[_this4.game.m_localId].loadout;
                                    _this4.analytics.playEnds(false, 'gameover close', playerLoadout);
                                }
                                _this4.siteInfo.updateCyclingMode(function () {
                                    if (device.mobile) {
                                        _this4.gameModeSelected[0] = 0;
                                        _this4.gameModeSelected[1] = 0;
                                    }
                                });
                                _this4.game.m_free();
                                _this4.errorMessage = _this4.localization.translate(errMsg || '');
                                _this4.teamMenu.onGameComplete();
                                _this4.ambience.onGameComplete(_this4.audioManager);
                                _this4.setAppActive(true);
                                _this4.lastClass = 'removeLast';
                                _this4.setPlayLockout(false);
                                _this4.adManager.showHomePageAds();
                                if (!_this4.teamMenu.joined) {
                                    //console.log('Not In team');
                                    _this4.account.setDiscordRP(1);
                                }

                                if (errMsg == 'index-invalid-protocol') {
                                    _this4.showInvalidProtocolModal();
                                }
                                _this4.account.loadProfile(); //TODO It would be ideal to only to get the items (to get the updated gear stats)

                                _this4.pass.getCurrentQuests();

                                if (!_this4.account.unlinked) {
                                    _this4.account.getUserPrestige();
                                }
                            };

                            this.game = new Game.m_Game(this.pixi, this.audioManager, this.localization, this.config, this.input, this.inputBinds, this.inputBindUi, this.adManager, this.ambience, this.resourceManager, onJoin, onQuit, this.analytics, this.pass, this.opponentMenu, this.account, this.SpineObjManager, this.weaponSelector, this.bugBattle);

                            this.loadoutDisplay = new LoadoutDisplay.LoadoutDisplay(this.audioManager, this.config, this.inputBinds, this.account, this.resourceManager.spineData);
                            this.loadoutMenu.loadoutDisplay = this.loadoutDisplay;

                            this.opponentDisplay = new OpponentDisplay.OpponentDisplay(this.pixi, this.audioManager, this.config, this.inputBinds, this.account);
                            this.opponentMenu.opponentDisplay = this.opponentDisplay;

                            this.onResize();
                            this.tryJoinTeam(false);

                            menu.setupModals(this.inputBinds, this.inputBindUi, this.adManager);

                            this.waitOnAccountLogin(function () {

                                _this4.bugBattle.logEvent('User profile loaded', _this4.account.profile);
                                _this4.bugBattle.setCustomData('profile', _this4.account.profile);
                                //Show shop btn
                                $('#open-store-button').css({
                                    'display': 'block',
                                    'pointer-events': 'auto'
                                });

                                //Load and show notifications for sold or expired items
                                if (!_this4.account.unlinked) _this4.market.getMarketNotification();
                            });

                            this.onConfigModified();
                            // Set this at the end of onLoad so that modules can modify the
                            // config without onConfigModified being activated.
                            // In particular, we don't want to reload the page if the
                            // highResTex setting is modified during load.
                            this.config.addModifiedListener(this.onConfigModified.bind(this));

                            Ui2.loadStaticDomImages();

                        case 118:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function m_tryLoad() {
            return _ref.apply(this, arguments);
        }

        return m_tryLoad;
    }(),

    onUnload: function onUnload() {
        this.teamMenu.leave();
    },

    onResize: function onResize() {
        device.onResize();
        //TODO delete after mobile is ready
        if (device.mobile || device.tablet) return;

        var width = $(window).width();
        var height = $(window).height();
        var screenCoeficient = height / width; //0.44
        if (screenCoeficient < 0.46) {
            screenCoeficient = screenCoeficient + 0.36;

            // $('.ftue-image-container').css('transform', 'scale(' + screenCoeficient + ')');
        } else {
            screenCoeficient = screenCoeficient + 0.44;
            //  $('.ftue-image-container').css('transform', 'scale(' + screenCoeficient + ')');
        }
        var topBattleBtn = $('#btn-play-game').offset().top - 85 + 'px';
        // $('.ftue-tooltip').css('top', topBattleBtn);


        var offsetBtn = $('#btn-play-game').position();
        var widthBtn = $('#btn-play-game')[0].getBoundingClientRect().width;

        if (width < 1366) {
            $('.ftue-tooltip').css({ left: -(offsetBtn.left - widthBtn + 70) });
        } else {
            $('.ftue-tooltip').css({ left: -(offsetBtn.left - widthBtn / 2) });
        }

        menu.onResize();
        this.loadoutMenu.onResize();

        if (this.pixi) {
            this.pixi.renderer.resize(device.screenWidth, device.screenHeight);
        }

        if (this.game && this.game.initialized) {
            this.game.m_resize();
        }

        if (this.loadoutDisplay && this.loadoutDisplay.initialized) {
            this.loadoutDisplay.m_resize();
        }

        this.refreshUi();
    },

    onPause: function onPause() {
        if (device.webview) {
            this.pauseTime = Date.now();
            // @HACK: fix bug where audio won't stop when backgrounded on Android
            this.audioManager.setMute(true);

            // Fixes crash on iOS when backgrounding
            // OpenGL calls are disallowed while the application is backgrounded
            if (device.os == 'ios' && this.pixi) {
                this.pixi.ticker.remove(this.pixi.render, this.pixi);
            }
        }
    },

    onResume: function onResume() {
        if (device.webview) {
            // Reload if the app is paused for longer than 30 seconds
            if (this.game && this.game.playing && Date.now() - this.pauseTime > 30 * 1000) {
                window.location.reload(true);
            } else {
                this.audioManager.setMute(this.config.get('muteAudio'));
            }

            if (device.os == 'ios' && this.pixi) {
                this.pixi.ticker.add(this.pixi.render, this.pixi, PIXI.UPDATE_PRIORITY.LOW);
            }
        }
    },

    startPingTest: function startPingTest() {
        var regions = this.config.get('regionSelected') ? [this.config.get('region')] : this.pingTest.getRegionList();
        this.pingTest.start(regions);
    },

    setAppActive: function setAppActive(active) {
        this.active = active;
        this.adManager.setAppActive(active);
        this.quickPlayPendingModeIdx = -1;
        this.btnStartBattle.html(this.localization.translate(this.btnStartBattle.data('l10n')));
        this.refreshUi();

        // Certain systems, like the account, can throw errors
        // while the user is already in a game.
        // Seeing these errors when returning to the menu would be
        // confusing, so we'll hide the modal instead.
        if (active) {
            this.errorModal.hide();
            this.errorBanModal.hide();
        }
    },

    readCookie: function readCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    //Creates or sets the value of a given cookie
    setCookie: function setCookie(cookieName, value, expDate) {
        document.cookie = cookieName + "=" + value + ";expires=" + expDate + "; path=/";
    },

    startTutorial: function startTutorial() {
        $('#modal-ftue').css('display', 'block');
        //this.account.startTutorial();

        this.setCookie("ftue-step", 0, 'Fri, 5 Oct 2050 14:28:00 GMT');
        this.playStep(0);
    },

    playStep: function playStep(step) {
        var currentStep = GeneralDefs.ftue_steps.steps[step];
        if (step == 0) {
            $('.ftue-content').css('display', 'none');
            $('#ftue-steps').css('display', 'block');
        }

        if (currentStep) {
            this.analytics.tutorialStepEnds('playing step ' + step, step, false);
            if (currentStep.showModal) {
                $('.ftue-image-container').css('display', 'none');
                $('.ftue-modal-content').css('display', 'block');
                $('.ftue-tooltip').css('display', 'none');
                $('.ftue-next').css('display', currentStep.showNext ? 'flex' : 'none');

                $('#modal-ftue').css('background', currentStep.modalBg);
                $('.ftue-content').css('display', 'none');
                $('#ftue-steps').css('display', 'block');
            } else {
                $('.ftue-modal-content').css('display', 'none');
                $('.ftue-content').css('display', 'none');
                $('#ftue-steps').css('display', 'block');
                $('.ftue-image-container').css('display', 'block');
                if (currentStep.enableTooltip) {
                    $('.ftue-tooltip').css('display', 'block');

                    // $('.ftue-tooltip').css('left', currentStep.left);
                    // $('.ftue-tooltip').css('top', (device.mobile && !device.tablet) ? parseFloat(currentStep.top) - 16 + '%' : currentStep.top);
                    $('.arrow-up').css('display', currentStep.topArrow ? 'block' : 'none');
                    $('.arrow-down').css('display', currentStep.downArrow ? 'block' : 'none');
                    $('.arrow-left').css('display', currentStep.leftArrow ? 'block' : 'none');
                    $('.arrow-right').css('display', currentStep.rightArrow ? 'block' : 'none');
                    $('.ftue-tooltip').css('background-image', 'url(\'' + currentStep.image + '\')');
                    $('.arrow-down').css('border-top', '36px solid ' + currentStep.tooltipColor);
                    $('.arrow-up').css('border-bottom', '36px solid ' + currentStep.tooltipColor);
                    $('.arrow-left').css('border-right', '36px solid ' + currentStep.tooltipColor);
                    $('.arrow-right').css('border-left', '36px solid ' + currentStep.tooltipColor);
                    $('.tip-desc').html(this.localization.translate(currentStep.tooltipText));
                    $('.tip-desc-title').text(this.localization.translate(currentStep.title));
                    $('.advice-text').css('display', 'none');
                    $('.ftue-image').css('display', 'none');
                    $('.animated-loadout').addClass('ftue-window');
                } else {
                    $('.ftue-tooltip').css('display', 'none');
                    $('.advice-text').css('display', 'flex');
                    $('.ftue-image').css('display', 'block');
                    $('.advice-text').text(this.localization.translate(currentStep.tooltipText));
                    $('.ftue-desc').text(this.localization.translate(currentStep.title));
                    $('.animated-loadout').removeClass('ftue-window');

                    if (device.mobile && currentStep.mobileImg) {
                        $('.ftue-image').attr("src", currentStep.mobileImg);
                        $('.advice-text').text(this.localization.translate(currentStep.mobileText));
                    } else {
                        $('.ftue-image').attr("src", currentStep.image);
                    }
                }
                $('#modal-ftue').css('background', currentStep.modalBg);
                $('#modal-ftue').css('display', 'block');
                $('.ftue-next').css('display', currentStep.showNext ? 'flex' : 'none');
                $('.ftue-desc').css('display', currentStep.showTitle ? 'flex' : 'none');
            }

            if (currentStep.showNext && currentStep.nextText) {
                $('.ftue-next span').text(this.localization.translate(currentStep.nextText));
            } else {
                $('.ftue-next span').text(this.localization.translate('ftue-next'));
            }

            if (currentStep.enablePlayBtn) {
                /* $('.btn-team-option').addClass('ftue-btn-disable');
                $('#btn-change-type,#index-type-select-container').addClass('ftue-btn-disable');
                $('#btn-change-mode, #index-mode-select-container').addClass('ftue-btn-disable'); */
                $('#modal-ftue').css('pointer-events', 'none');
                $('.btn-team-option').addClass('button-disabled ');
                $('#btn-change-type,#index-type-select-container').addClass('button-disabled');
                $('#btn-change-mode, #index-mode-select-container').addClass('button-disabled');
                $('#btn-change-type,#index-type-select-container').attr('disabled', 'disabled');
                $('#btn-change-mode, #index-mode-select-container').attr('disabled', 'disabled');
            } else {
                /* $('.btn-team-option').removeClass('ftue-btn-disable');
                $('#btn-change-type, #index-type-select-container').removeClass('ftue-btn-disable');
                $('#btn-change-mode, #index-mode-select-container').removeClass('ftue-btn-disable'); */
                $('.btn-team-option').removeClass('button-disabled');
                $('#btn-change-type, #index-type-select-container').removeClass('button-disabled');
                $('#btn-change-mode, #index-mode-select-container').removeClass('button-disabled');
                $('#btn-change-type, #index-type-select-container').removeAttr("disabled");
                $('#btn-change-mode, #index-mode-select-container').removeAttr("disabled");
                $('#modal-ftue').css('pointer-events', 'all');
            }
        }
    },

    setPlayLockout: function setPlayLockout(lock) {
        var _this5 = this;

        var delay = lock ? 0 : 1000;
        this.playButtons.stop().delay(delay).animate({ opacity: lock ? 0.5 : 1.0 }, 250);
        this.playLoading.stop().delay(delay).animate({ opacity: lock ? 1.0 : 0.0 }, {
            duration: 250,
            start: function start() {
                _this5.playLoading.css({
                    'pointer-events': lock ? 'initial' : 'none'
                });
            },
            done: function done() {
                _this5.analytics.loadingEnds();
            }
        });
    },

    onTeamMenuJoinGame: function onTeamMenuJoinGame(data) {
        var _this6 = this;

        this.waitOnAccount(function () {
            _this6.joinGame(data);
        });
    },

    onTeamMenuLeave: function onTeamMenuLeave(errTxt) {
        if (errTxt && errTxt != '') {
            if (window.history) {
                window.history.replaceState('', '', '/');
            }
        }
        this.errorMessage = errTxt;
        this.setDOMFromConfig();
        this.refreshUi();
    },

    // Config
    setConfigFromDOM: function setConfigFromDOM() {
        var region = this.serverSelect.find(":selected").val();
        if (region) this.config.set('region', region);
    },

    setDOMFromConfig: function setDOMFromConfig() {
        var _this7 = this;

        this.serverSelect.find('option').each(function (idx, el) {
            el.selected = el.value == _this7.config.get('region');

            //Show correct region
            if (el.selected) {
                var selectedRegion = _this7.serverSelect.find(":selected");
                var localizedRegion = _this7.localization.translate(selectedRegion.attr('data-l10n'));
                var localizedRegionTitle = _this7.localization.translate('index-region');

                _this7.serverSelect.find("option:first").text(localizedRegionTitle + ' | ' + localizedRegion);
                _this7.serverSelect.find("option:first").prop('selected', true);
            }
        });

        this.languageSelect.val(this.config.get('language'));
    },

    onConfigModified: function onConfigModified(key) {
        // Mute
        var muteAudio = this.config.get('muteAudio');
        if (muteAudio != this.audioManager.mute) {
            var toggleSoundIcon = this.muteBtn.querySelector('.sound-icon');
            toggleSoundIcon.classList.remove('off');
            if (muteAudio) {
                toggleSoundIcon.classList.add('off');
            }
            this.audioManager.setMute(muteAudio);
        }

        var masterVolume = /** @type{number}*/this.config.get('masterVolume');
        this.masterVolumeControl.setVolume(masterVolume);
        var soundVolume = /** @type{number}*/this.config.get('soundVolume');
        this.sfxVolumeControl.setVolume(soundVolume);
        var musicVolume = /** @type{number}*/this.config.get('musicVolume');
        this.musicVolumeControl.setVolume(musicVolume);

        if (key == 'language') {
            var language = this.config.get('language');
            this.localization.setLocale(language);
        }

        if (key == 'region') {
            this.config.set('regionSelected', true);
            this.startPingTest();
        }

        // Resolution
        if (key == 'highResTex') {
            location.reload();
        }
    },

    // Ui
    refreshUi: function refreshUi() {
        // Active

        this.startMenuWrapper.css('display', this.active ? 'flex' : 'none');
        this.gameAreaWrapper.css({
            display: this.active ? 'none' : 'block',
            opacity: this.active ? 0 : 1
        });
        this.gameAreaWrapper.css({
            display: this.opponentMenu.active ? 'none' : 'block'
        });

        if (this.active) {
            $('body').removeClass('user-select-none');
            document.removeEventListener('contextmenu', this.contextListener);
        } else {
            $('body').addClass('user-select-none');
            $('#start-main').stop(true);
            document.addEventListener('contextmenu', this.contextListener);
        }

        // Hide the ad if on mobile, oriented portrait, and viewing create team
        $('#ad-block-right').css('display', !device.isLandscape && this.teamMenu.active ? 'none' : 'block');

        // Warning
        var hasError = this.active && this.errorMessage != '';
        this.serverWarning.css({
            display: 'block',
            opacity: hasError ? 1 : 0
        });
        this.serverWarning.html(this.errorMessage);

        if (!device.mobile) {
            //Update btns available and selected modes/types to play
            this.updatePlayBtns();
        }
    },

    waitOnAccount: function waitOnAccount(cb) {
        var _this8 = this;

        if (this.account.requestsInFlight == 0) {
            cb();
        } else {
            // Wait some maximum amount of time for pending account requests
            var waitStart = Date.now();
            var timeout = setTimeout(function () {
                runOnce();
                FirebaseManager.storeGeneric('account', 'wait_timeout');
            }, 2500);
            var runOnce = function runOnce() {
                cb();
                clearTimeout(timeout);
                _this8.account.removeEventListener('requestsComplete', runOnce);
            };
            this.account.addEventListener('requestsComplete', runOnce);
        }
    },

    waitOnAccountLogin: function waitOnAccountLogin(cb) {
        var _this9 = this;

        if (this.account.requestsInFlight == 0 && this.account.profile) {
            cb();
        } else {
            // Wait some maximum amount of time for pending account requests
            var waitStart = Date.now();
            var timeout = setTimeout(function () {
                runOnce();
                FirebaseManager.storeGeneric('account', 'wait_timeout');
            }, 5500);
            var runOnce = function runOnce() {
                cb();
                clearTimeout(timeout);
                _this9.account.removeEventListener('login', runOnce);
            };
            this.account.addEventListener('login', runOnce);
        }
    },

    tryJoinTeam: function tryJoinTeam(create, url) {
        var _this10 = this;

        if (!this.active || this.quickPlayPendingModeIdx !== -1) {
            return;
        }

        // Join team if the url contains a team address
        var roomUrl = url || window.location.hash.slice(1);
        if (create || roomUrl != '') {
            // The main menu and squad menus have separate
            // DOM elements for input, such as player name and
            // selected region. We will stash the menu values
            // into the config so the team menu can read them.

            this.waitOnAccountLogin(function () {
                _this10.setConfigFromDOM();
                var name = 'Player';
                var isUnlinked = false;
                if (_this10.account.loggedIn && _this10.account.unlinked) {
                    name = "BHA#" + _this10.account.profile.id;
                    isUnlinked = true;
                }

                _this10.teamMenu.connect(create, roomUrl, isUnlinked ? name || 'Player' : _this10.account.profile.battletagDisplay || 'Player');
                _this10.refreshUi();
            });
        }
    },

    // Game
    tryQuickStartGame: function tryQuickStartGame(gameModeIdx) {
        var _this11 = this;

        if (this.quickPlayPendingModeIdx !== -1) {
            return;
        }

        // Update UI to display a spinner on the play button
        this.errorMessage = '';
        this.quickPlayPendingModeIdx = gameModeIdx;
        this.btnStartBattle.html('<div class="ui-spinner"></div>');
        this.setConfigFromDOM();
        this.refreshUi();

        // Wait some amount of time if we've recently attempted to
        // find a game to prevent spamming the server
        var delay = 0;
        if (this.findGameAttempts > 0 && Date.now() - this.findGameTime < 30 * 1000) {
            delay = Math.min(this.findGameAttempts * 2.5 * 1000, 7.5 * 1000);
        } else {
            this.findGameAttempts = 0;
        }
        this.findGameTime = Date.now();
        this.findGameAttempts++;

        var version = GameConfig.protocolVersion;
        var region = this.config.get('region');
        var paramRegion = helpers.getParameterByName('region');
        if (paramRegion !== undefined && paramRegion.length > 0) {
            region = paramRegion;
        }
        var zones = this.pingTest.getZones(region);
        var paramZone = helpers.getParameterByName('zone');
        if (paramZone !== undefined && paramZone.length > 0) {
            zones = [paramZone];
        }
        var playerCount = 1;
        var autoFill = true;

        var matchArgs = {
            version: version,
            region: region,
            zones: zones,
            playerCount: playerCount,
            autoFill: autoFill,
            gameModeIdx: gameModeIdx,
            isMobile: device.mobile
        };

        var tryQuickStartGameImpl = function tryQuickStartGameImpl() {
            _this11.waitOnAccount(function () {
                _this11.findGame(matchArgs, function (err, matchData) {
                    if (err) {
                        _this11.onJoinGameError(err);
                        return;
                    }
                    _this11.joinGame(matchData);
                    _this11.account.setDiscordRP(2, gameModeIdx);
                    //this.account.deleteDiscordRP();
                });
                if (_this11.account && _this11.account.pass) {
                    if (_this11.account.pass.xp_rewards) {
                        var distance = _this11.account.getXPRewardDistance(_this11.account.pass.xp_reward_timestamp);
                        console.log("Pass Xp:" + _this11.pass.currentXp);
                        if (distance < 0) {
                            _this11.account.updateXPRewardPass(null, false, _this11.pass);
                        }
                    }

                    if (_this11.account.pass.team_members > 0) {
                        _this11.account.resetTeams();
                    }
                }
            });
        };
        if (delay == 0) {
            // We can improve findGame responsiveness by ~30 ms by skipping
            // the 0ms setTimeout
            tryQuickStartGameImpl();
        } else {
            setTimeout(function () {
                tryQuickStartGameImpl();
            }, delay);
        }
    },

    findGame: function findGame(matchArgs, cb) {
        var findGameImpl = function findGameImpl(iter, maxAttempts) {
            if (iter >= maxAttempts) {
                cb('full');
                return;
            }

            var retry = function retry() {
                setTimeout(function () {
                    findGameImpl(iter + 1, maxAttempts);
                }, 500);
            };
            //matchArgs.region = 'dev3';// used only on test environments to avoid matchmaking with prod
            $.ajax({
                type: 'POST',
                url: api.resolveUrl('/api/find_game'),
                data: (0, _stringify2.default)(matchArgs),
                contentType: 'application/json; charset=utf-8',
                timeout: 10 * 1000,
                success: function success(data) {
                    if (data && data.err && data.err != 'full') {
                        cb(data.err);
                        return;
                    }

                    var matchData = data && data.res ? data.res[0] : null;
                    if (matchData && matchData.hosts && matchData.addrs) {
                        cb(null, matchData);
                    } else {
                        retry();
                    }
                },
                error: function error(err) {
                    retry();
                }
            });
        };
        findGameImpl(0, 2);
    },

    joinGame: function joinGame(matchData) {
        var _this12 = this;

        // Game may not be loaded yet, try again later
        if (!this.game) {
            setTimeout(function () {
                _this12.joinGame(matchData);
            }, 250);
            return;
        }

        this.analytics.loadingStarts = new Date();
        this.analytics.gameId = matchData.gameId + '';
        var useHttps = "production" === 'production';
        var proto = useHttps ? 'wss:' : 'ws:';
        var hosts = (useHttps ? matchData.hosts : matchData.addrs) || [];

        var urls = [];
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];

            // Modify the host if we're connecting on a proxy site
            if (true) {
                var proxyDef = proxy.getProxyDef();
                if (proxyDef) {
                    host = host.replace('surviv.io', proxyDef.proxy);
                }
            }

            urls.push(proto + '//' + host + '/play?gameId=' + matchData.gameId);
        }

        var joinGameImpl = function joinGameImpl(urls, matchData) {
            // No more urls left to try, the join failed
            var url = urls.shift();
            if (!url) {
                _this12.onJoinGameError('join_game_failed');
                return;
            }

            console.log('Joining', url, matchData.zone);

            var onFailure = function onFailure() {
                joinGameImpl(urls, matchData);
            };
            var isUnlinked = _this12.account.loggedIn && _this12.account.unlinked;
            var username = _this12.account.profile.usernameSet ? _this12.account.profile.username : 'BHA#' + _this12.account.profile.id;

            _this12.game.m_tryJoinGame(url, matchData.data, _this12.account.loadoutPriv, _this12.account.loadoutStats, _this12.account.questPriv, _this12.account.pass.premium, onFailure, username, isUnlinked);
        };
        joinGameImpl(urls, matchData);
    },

    onJoinGameError: function onJoinGameError(err) {
        var errMap = {
            'full': this.localization.translate('index-failed-finding-game'),
            'invalid_protocol': this.localization.translate('index-invalid-protocol'),
            'join_game_failed': this.localization.translate('index-failed-joining-game')
        };

        if (err == 'invalid_protocol') {
            this.showInvalidProtocolModal();
        }

        this.errorMessage = errMap[err] || errMap['full'];
        this.quickPlayPendingModeIdx = -1;
        this.teamMenu.leave('join_game_failed');
        this.btnStartBattle.html(this.localization.translate(this.btnStartBattle.data('l10n')));
        this.weaponSelector.hide();
        this.refreshUi();
    },

    showInvalidProtocolModal: function showInvalidProtocolModal() {
        this.refreshModal.show(true);
    },

    updatePlayBtns: function updatePlayBtns() {
        var updateAvailableModes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var updateAvailablesTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var mapIndex = this.gameModeSelected[0];
        var typeIndex = this.gameModeSelected[1]; //Solo, duo, squad
        var modes = this.gameModesAvailable[mapIndex].modes;

        //Update selected mode
        var selectedMode = device.mobile ? this.btnChangeMode : this.btnChangeMode.find('#index-play-mode-selected');
        var selectedMap = this.gameModesAvailable[mapIndex].map;
        var mapDefSelected = (MapDefs[selectedMap] || MapDefs['main']).desc;
        /*selectedMode.css({
            'background-image': `url(${mapDefSelected.icon})`
        });*/

        if (!device.mobile) {
            selectedMode.attr('data-l10n', mapDefSelected.buttonText);
            selectedMode.html(this.localization.translate(mapDefSelected.buttonText));
        }

        if (selectedMap == 'faction') {
            this.btnChangeMode.removeClass('btn-custom-mode-no-indent-no-animation');
            this.btnChangeMode.addClass('btn-custom-mode-no-indent');

            this.btnChangeModeSelection.removeClass('btn-custom-mode-no-indent-no-animation');
            this.btnChangeModeSelection.addClass('btn-custom-mode-no-indent');

            this.factionSelected = true;
        } else {
            if (this.lastModeCss == 'btn-mode-faction') {
                this.btnChangeMode.removeClass('btn-custom-mode-no-indent');
                this.btnChangeMode.addClass('btn-custom-mode-no-indent-no-animation');

                this.btnChangeModeSelection.removeClass('btn-custom-mode-no-indent');
                this.btnChangeModeSelection.addClass('btn-custom-mode-no-indent-no-animation');

                this.factionSelected = false;
            }
        }
        this.lastClass = null;
        if (this.lastClass == 'removeLast') {
            var lastClass = this.btnChangeMode.attr('class').split(' ').pop();
            if (lastClass != 'btn-custom-mode-no-indent-no-animation' && lastClass != 'btn-custom-mode-no-indent') {
                this.btnChangeMode.removeClass(lastClass);
                this.btnChangeModeSelection.removeClass(lastClass);
            } else {
                lastClass = this.btnChangeMode.attr('class').split(' ').slice(-2)[0];
                if (lastClass != 'btn-custom-mode-no-indent-no-animation' && lastClass != 'btn-custom-mode-no-indent') {
                    this.btnChangeMode.removeClass(lastClass);
                    this.btnChangeModeSelection.removeClass(lastClass);
                }
            }
            this.lastClass = null;
        } else {
            this.btnChangeMode.removeClass(this.lastModeCss);
            this.btnChangeModeSelection.removeClass(this.lastModeCss);
        }

        this.btnChangeMode.addClass(mapDefSelected.buttonCss);
        this.btnChangeModeSelection.addClass(mapDefSelected.buttonCss);
        this.lastModeCss = mapDefSelected.buttonCss;

        //Update selected type
        var selectedType = device.mobile ? this.btnChangeType : this.btnChangeType.find('#index-play-type-selected');
        var selectedTypeId = modes[typeIndex].type;
        /*if (selectedTypeId == 1) {
            selectedType.css({
                'background-image': `url(img/gui/loadout-player-icon.svg)`
            });
        } else {
            selectedType.css({
                'background-image': `url(img/gui/type-${selectedTypeId}.svg)`
            });
        }*/
        if (!device.mobile) {
            var selectedTypeData = 'index-play-type-' + selectedTypeId;
            selectedType.attr('data-l10n', selectedTypeData);
            selectedType.html(this.localization.translate(selectedTypeData));
        }

        //Update selected mode id to start game
        this.gameModeSelected[2] = modes[typeIndex].id;

        if (!device.mobile) {
            var modeSelection = $('#btn-change-mode-selection div');
            modeSelection.html('');
            var typeSelection = $('#btn-change-type-selection div');
            typeSelection.html('');

            //Update list of modes available
            for (var i = 0; i < this.gameModesAvailable.length; i++) {
                var mode = $('<div>');
                var modeId = this.gameModesAvailable[i].map;
                var mapDef = (MapDefs[modeId] || MapDefs['main']).desc;

                mode.attr('class', 'option-change-mode px-6 base-button blue-button text-white text-outline-black h5 font-edit');
                mode.attr('data-l10n', mapDef.buttonText);
                mode.attr('id', i);
                mode.html(this.localization.translate(mapDef.buttonText));
                /*mode.css({
                    'background-image': `url(${mapDef.icon})`
                });*/
                mode.addClass(mapDefSelected.buttonCss);

                if (mapDef.name == mapDefSelected.name) {
                    mode.addClass('btn-darkened');
                }

                if (selectedMap == 'faction') {
                    mode.removeClass('btn-custom-mode-no-indent-no-animation');
                    mode.addClass('btn-custom-mode-no-indent');
                }

                modeSelection.append(mode);
            }
            // modeSelection.append('<div class="btn-divider"></div>');


            //Update list of types available of the selected mode
            for (var _i = 0; _i < modes.length; _i++) {
                var type = $('<div>');
                var typeId = modes[_i].type;
                var playData = 'index-play-type-' + typeId;

                type.attr('class', 'option-change-type px-6 base-button blue-button text-white text-outline-black h5 font-edit');
                type.attr('data-l10n', playData);
                type.attr('id', _i);
                type.html(this.localization.translate(playData));
                /*if (typeId == 1) {
                    type.css({
                        'background-image': `url(img/gui/loadout-player-icon.svg)`
                    });
                } else {
                    type.css({
                        'background-image': `url(img/gui/type-${typeId}.svg)`
                    });
                }*/

                if (typeId == selectedTypeId) type.addClass('btn-darkened');else type.removeClass('btn-darkened');

                typeSelection.append(type);
            }
            // typeSelection.append('<div class="btn-divider"></div>');
        } else {
            //Mobile
            if (updateAvailableModes) {
                this.modeOptions.html('');
                //Update list of modes available
                for (var _i2 = 0; _i2 < this.gameModesAvailable.length; _i2++) {

                    var _mode = $('<option>');
                    var _modeId = this.gameModesAvailable[_i2].map;
                    var _mapDef = (MapDefs[_modeId] || MapDefs['main']).desc;

                    //mode.attr('data-l10n', mapDef.buttonText);
                    _mode.attr('value', _i2);
                    _mode.text(this.localization.translate(_mapDef.buttonText));

                    this.modeOptions.append(_mode);
                }
            }

            if (updateAvailablesTypes) {
                this.typeOptions.html('');
                //Update list of types available of the selected mode
                for (var _i3 = 0; _i3 < modes.length; _i3++) {
                    var _type = $('<option>');
                    var _typeId = modes[_i3].type;
                    var _playData = 'index-play-type-' + _typeId;

                    //type.attr('data-l10n', playData);
                    _type.attr('value', _i3);
                    _type.text(this.localization.translate(_playData));

                    this.typeOptions.append(_type);
                }
            }
        }
    },

    update: function update() {
        var dt = math.clamp(this.pixi.ticker.elapsedMS / 1000.0, 1.0 / 1000.0, 1.0 / 8.0);

        this.pingTest.update(dt);
        if (!this.checkedPingTest && this.pingTest.isComplete()) {
            if (!this.config.get('regionSelected')) {
                var region = this.pingTest.getRegion();
                if (region) {
                    this.config.set('region', region);
                    this.setDOMFromConfig();
                }
            }
            this.checkedPingTest = true;
        }
        /*this.weaponSelector.m_update(dt);
        if((this.weaponSelector.elapsed < 0.0)&&this.weaponSelector.active){
            this.tryQuickStartGame(this.gameModeSelected[2]);
        }*/
        this.resourceManager.update(dt);
        this.audioManager.m_update(dt);
        this.ambience.update(dt, this.audioManager, !this.active);
        this.teamMenu.update(dt);

        // Disable audio if playing a video
        if (this.wasPlayingVideo != this.adManager.isPlayingVideo) {
            var volume = this.adManager.isPlayingVideo ? 0.0 : this.config.get('masterVolume');
            this.audioManager.setMasterVolume(volume);
        }
        this.wasPlayingVideo = this.adManager.isPlayingVideo;

        // Game update
        if (this.game && this.game.initialized && this.game.playing) {
            if (this.active) {
                this.setAppActive(false);
                this.setPlayLockout(true);
            }
            this.game.m_update(dt);
        }

        // LoadoutDisplay update
        if (this.active && this.loadoutDisplay && this.game && !this.game.initialized) {
            if (this.loadoutMenu.active) {
                if (!this.loadoutDisplay.initialized) {
                    this.loadoutDisplay.m_init();
                }
                this.loadoutDisplay.show();
                this.loadoutDisplay.m_update(dt, this.hasFocus);
            } else {
                this.loadoutDisplay.hide();
            }
        }

        if (!this.active && this.loadoutMenu.active) {
            this.loadoutMenu.hide();
        }

        // OpponentDisplay update
        if (this.opponentDisplay && this.game) {
            if (this.opponentMenu.active) {
                if (!this.opponentDisplay.initialized) {
                    this.opponentDisplay.m_init();
                }
                this.opponentDisplay.show();
                this.refreshUi();
                this.opponentDisplay.m_update(dt, this.hasFocus);
            } else {
                if (this.opponentDisplay.active) {
                    this.refreshUi();
                }
                this.opponentDisplay.hide();
            }
        }

        // Pass update
        if (this.active && this.pass) {
            this.pass.update(dt);
        }

        if (this.input) {
            this.input.flush();
        }
    }
};

//
// Kick events before loading the app
//
// @TODO: This could happen later in app.m_tryLoad()
(function preAppLoad() {
    // Append bundled css
    // HACK: Load everything up for now

    // Required to get webpack to process this dep
    //If device is mobile change css
    var menuCssTmp = require("./menuCssTmp.js");
    var gameCssTmp = require("./gameCssTmp.js");

    if (device.mobile && device.screenWidth >= 1024) {
        gameCssTmp = require("./40698162.js");
        menuCssTmp = require("./fc8e50ad.js");
    }
    if (device.model == "ipadpro" || device.mobile && device.screenWidth <= 1024) {
        gameCssTmp = require("./7b004068.js");
    }
    if (device.mobile && device.screenWidth < 1024) {
        menuCssTmp = require("./a01ce6cc.js");
    }

    function loadCss(elem) {
        var node = document.createElement('style');
        node.innerHTML = elem.toString();
        document.body.appendChild(node);
    }
    loadCss(menuCssTmp);
    loadCss(gameCssTmp);
})();

//
// Create app
//
var app = new m_App();

//
// Set event handlers
//
function onPageLoad() {
    app.domContentLoaded = true;
    app.m_tryLoad();
}
document.addEventListener('DOMContentLoaded', onPageLoad);
// Handle older browsers that don't support DOMContentLoaded; may only be IE8 and older?
window.addEventListener('load', onPageLoad);
window.addEventListener('unload', function (e) {
    app.onUnload();
});

// Facebook OAUTH redirects will append #_=_ to the url; remove that now
// Taken from https://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url
if (window.location.hash == '#_=_') {
    // for older browsers, leaves a # behind
    window.location.hash = '';
    // Cleans up the #
    history.pushState('', document.title, window.location.pathname);
}

window.addEventListener('resize', function () {
    app.onResize();
});
window.addEventListener('orientationchange', function () {
    app.onResize();
});

window.addEventListener('hashchange', function () {
    app.tryJoinTeam(false);
});
window.addEventListener('beforeunload', function (e) {
    if (app.game && app.game.m_warnPageReload() && !device.webview) {
        // In new browsers, dialogText is overridden by a generic string
        var dialogText = 'Do you want to reload the game?';
        e.returnValue = dialogText;
        return dialogText;
    }
});
window.addEventListener('onfocus', function () {
    app.hasFocus = true;
});
window.addEventListener('onblur', function () {
    app.hasFocus = false;
});

var reportedErrors = [];
window.onerror = function (msg, url, lineNo, columnNo, error) {
    msg = msg || 'undefined_error_msg';
    var stacktrace = error ? error.stack : '';

    // Break a malicious iOS app and other extensions
    var m_breakApp = msg.indexOf("').innerText") != -1 || stacktrace.indexOf('cdn.rawgit.com') != -1 || stacktrace.indexOf('chrome-extension://') != -1;
    if (m_breakApp) {
        helpers.m_cheatDetected();
        return;
    }

    var errObj = {
        msg: msg,
        id: app.sessionId,
        url: url,
        line: lineNo,
        column: columnNo,
        stacktrace: stacktrace,
        browser: navigator.userAgent,
        protocol: GameConfig.protocolVersion
    };
    var errStr = (0, _stringify2.default)(errObj);

    // Don't report the same error multiple times
    if (reportedErrors.indexOf(errStr) !== -1) {
        return;
    }
    reportedErrors.push(errStr);

    if (/tpc.googlesyndication.com/.test(errStr) || msg == 'Script error.') {
        // Ignore these errors
    } else if (/surviv\.io\/js\/.*\.js/.test(errStr)) {
        // Log errors originating from our js files separately
        //
        // Store these common errors separately until a cause can be found
        if (errObj.msg.indexOf("TypeError: null is not an object (evaluating 'e.transform._parentID=-1')") !== -1) {
            FirebaseManager.logError(errStr);
        } else {
            FirebaseManager.logWindowOnAppError(errStr);
        }
    } else {
        FirebaseManager.logWindowOnError(errStr);
    }
};
