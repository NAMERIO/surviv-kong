"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var api = require("./api.js");
var device = require("./device.js");
var helpers = require("./helpers.js");
var MenuModal = require("./menuModal.js");
var proxy = require("./proxy.js");
var webview = require("./webview.js");
var uuidv4 = require("./8581e282.js");
var ModalWarningError = require("./modalWarningError.js");

// @ts-ignore
var loadouts = require("./loadouts.js");
var WindowModal = require("./windowModal.js");
var ModalLoginIncentive = require("./modalLoginIncentive.js");

//
// ProfileUi
//

var ProfileUi = function () {
    /**
     * 
     * @param {import('./account')} account 
     * @param {import('./localization')} localization 
     * @param {import('./loadout-menu')} loadoutMenu 
     * @param {*} homeLoadout 
     * @param {*} errorModal 
     * @param {*} errorBanModal 
     * @param {*} config 
     * @param {*} pass 
     * @param {*} adService 
     * @param {import('./gear-forge')} forge
     */
    function ProfileUi(account, localization, loadoutMenu, homeLoadout, errorModal, errorBanModal, config, pass, adService, forge) {
        var _this = this;

        (0, _classCallCheck3.default)(this, ProfileUi);

        this.account = account;
        this.localization = localization;
        this.loadoutMenu = loadoutMenu;
        this.homeLoadout = homeLoadout;
        this.errorModal = errorModal;
        this.errorBanModal = errorBanModal;
        this.config = config;
        this.pass = pass;
        this.adService = adService;
        this.forge = forge;
        this.setNameModal = null;
        this.resetStatsModal = null;
        this.deleteAccountModal = null;
        this.userSettingsModal = null;
        this.loginOptionsModal = null;
        this.createAccountModal = null;
        this.incentiveOkaModal = null;
        this.essenceUpdate = null;
        this.goldUpdate = null;
        this.prestigeUpdated = null;

        account.addEventListener('error', this.onError.bind(this));
        account.addEventListener('banError', this.onBanError.bind(this));
        account.addEventListener('login', this.onLogin.bind(this));
        account.addEventListener('loadout', this.onLoadoutUpdated.bind(this));
        account.addEventListener('items', this.onItemsUpdated.bind(this));
        account.addEventListener('prestige', this.updatePrestige.bind(this));
        account.addEventListener('request', this.render.bind(this));
        account.addEventListener('profileLoaded', this.render.bind(this));
        account.addEventListener('showLoginModal', function () {
            _this.showLoginMenu({
                modal: true,
                loginFlow: true
            });
        });
        account.addEventListener('confirmRegister', this.showRegisterConfirmPrompt.bind(this));
        account.addEventListener('incentiveModal', this.showIncentiveModal.bind(this));
        account.addEventListener('logout', this.showLoginLogout.bind(this));

        this.initUi();
        this.render();
    }

    (0, _createClass3.default)(ProfileUi, [{
        key: 'initUi',
        value: function initUi() {
            var _this2 = this;

            //Sections declaration
            var seasonPass = new WindowModal(document.querySelector('#season-pass'));
            var homeMenu = $('#home-section');
            var questsMenu = $('#quests-section');
            var armoryMenu = $('#armory-section');
            var showMenu = new WindowModal(document.querySelector('#shop-section'));

            //Buttons declarationsaddEssence
            var buttonsContainer = $('#start-menu-buttons');
            buttonsContainer.children().first().addClass('selected');
            var seasonButton = $('#season-pass-button');
            var homeButton = $('#home-button');
            var shopButton = $('#shop-button');
            var questButton = $('#quests-button');
            var equipmentButton = $('#equipment-button');

            var goldPlus = $('#gold-plus');
            var essencePlus = $('#essence-plus');

            var forgeButton = $('#forge-button');
            /**TEST BUTTONS */

            //code for testing location.hostname.indexOf('test') != -1 || location.hostname.indexOf('dev') != -1 || location.hostname.indexOf('localhost') != -1
            if (location.hostname.indexOf('test') != -1 || location.hostname.indexOf('dev') != -1 || location.hostname.indexOf('localhost') != -1) {
                $("<button class='test-button' id='test-add-essence-button'> ADD <img src='../img/gui/essence-icon.png'> 25k ESSENCE <div class='modal-customize-loading' id='test-add-essence-button-loading'></div> </button>").appendTo("#start-top-right .currency-container");
                $("<button class='test-button' id='test-add-gold-button'> ADD <img src='../img/gui/gold-icon.png'> 25k GOLD <div class='modal-customize-loading' id='test-add-gold-button-loading'></div> </button>").appendTo("#start-top-right .currency-container");
                $("<button class='test-button' id='test-add-xp-button'> ADD <img src='../img/quests/exp-icon.png'> 20 EXP </button>").appendTo("#start-top-right .currency-container");
                $("<button class='test-button' id='test-unlink-account'> UNLINK ACCOUNT </button>").appendTo("#start-top-right .currency-container");

                /* $('.btn-get-gp').click(() => {
                    this.account.getGP();
                    return false;
                });
                 $('.btn-add-xp').click(() => {
                    this.account.addXP();
                    return false;
                });
                 $('.btn-google-unlink').click(() => {
                    this.account.unlinkGoogleId();
                    return false;
                });
                 $('.btn-expire-market-items').on('click', () => {
                    this.account.expireMarketItems();
                    return false;
                });
                 $('.btn-test-notification').on('click', () => {
                    this.account.sendTestNotification();
                    return false;
                });
                 $('.btn-cancel-test-notification').on('click', () => {
                    this.account.cancelTestNotification();
                    return false;
                }); */

                var addEssenceButton = $('#test-add-essence-button');
                var addGoldButton = $('#test-add-gold-button');
                var addXPButton = $('#test-add-xp-button');
                var unlinkAccount = $('#test-unlink-account');
                addEssenceButton.on('click', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    addEssenceButton.addClass('loading disabled');
                                    _context.next = 3;
                                    return _this2.account.addEssence();

                                case 3:
                                    addEssenceButton.removeClass('loading disabled');

                                case 4:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this2);
                })));
                addGoldButton.on('click', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                    return _regenerator2.default.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    addGoldButton.addClass('loading disabled');
                                    _context2.next = 3;
                                    return _this2.account.addGold();

                                case 3:
                                    addGoldButton.removeClass('loading disabled');

                                case 4:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this2);
                })));
                addXPButton.on('click', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    addXPButton.addClass('loading disabled');
                                    _context3.next = 3;
                                    return _this2.account.addXP();

                                case 3:
                                    addXPButton.removeClass('loading disabled');

                                case 4:
                                case 'end':
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this2);
                })));
                unlinkAccount.on('click', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    unlinkAccount.addClass('loading disabled');
                                    _context4.next = 3;
                                    return _this2.account.unlinkGoogleId();

                                case 3:
                                    unlinkAccount.removeClass('loading disabled');

                                case 4:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, _this2);
                })));
            }

            /** */

            var that = this;

            //Season pass display
            seasonButton.on('click touchend', function () {
                buttonsContainer.children().removeClass("selected");
                this.classList.add('selected');
                homeMenu.css('display', 'none');
                seasonPass.show();
                questsMenu.css('display', 'none');
                armoryMenu.css('display', 'none');
                showMenu.hide();
                that.loadoutMenu.onHide();
                that.loadoutMenu.hide();
                that.forge.hide();

                that.pass.questsShown = false;
                that.pass.passShown = true;
            });

            //Home Display
            homeButton.on('click touchend', function () {
                buttonsContainer.children().removeClass("selected");
                this.classList.add('selected');
                homeMenu.css('display', 'block');
                seasonPass.hide();
                questsMenu.css('display', 'none');
                armoryMenu.css('display', 'none');
                showMenu.hide();
                that.homeLoadout.buildLoadout();
                that.loadoutMenu.onHide();
                that.loadoutMenu.hide();
                that.forge.hide();

                that.pass.questsShown = false;
                that.pass.passShown = false;
            });
            // Botones de Plus
            goldPlus.on('click', function () {
                buttonsContainer.children().removeClass("selected");
                shopButton.addClass('selected');
                homeMenu.css('display', 'none');
                seasonPass.hide();
                questsMenu.css('display', 'none');
                armoryMenu.css('display', 'none');
                showMenu.show();
                that.loadoutMenu.onHide();
                that.loadoutMenu.hide();
                that.forge.hide();

                that.pass.questsShown = false;
                that.pass.passShown = false;
            });

            essencePlus.on('click', function () {
                buttonsContainer.children().removeClass("selected");
                questButton.addClass('selected');
                homeMenu.css('display', 'none');
                seasonPass.hide();
                questsMenu.css('display', 'block');
                armoryMenu.css('display', 'none');
                showMenu.hide();
                that.loadoutMenu.onHide();
                that.loadoutMenu.hide();
                that.forge.hide();

                that.pass.questsShown = true;
                that.pass.passShown = false;
            });

            //Shop Display
            shopButton.on('click touchend', function () {
                buttonsContainer.children().removeClass("selected");
                this.classList.add('selected');
                homeMenu.css('display', 'none');
                seasonPass.hide();
                questsMenu.css('display', 'none');
                armoryMenu.css('display', 'none');
                showMenu.show();
                that.loadoutMenu.onHide();
                that.loadoutMenu.hide();
                that.forge.hide();

                that.pass.questsShown = false;
                that.pass.passShown = false;
            });

            //Quests Display
            questButton.on('click touchend', function () {
                buttonsContainer.children().removeClass("selected");
                this.classList.add('selected');
                homeMenu.css('display', 'none');
                seasonPass.hide();
                questsMenu.css('display', 'block');
                armoryMenu.css('display', 'none');
                showMenu.hide();
                that.loadoutMenu.onHide();
                that.loadoutMenu.hide();
                that.forge.hide();

                that.pass.questsShown = true;
                that.pass.passShown = false;
            });

            equipmentButton.on('click touchend', function () {
                buttonsContainer.children().removeClass("selected");
                this.classList.add('selected');
                homeMenu.css('display', 'none');
                seasonPass.hide();
                questsMenu.css('display', 'none');
                armoryMenu.css('display', 'block');
                showMenu.hide();
                that.forge.hide();

                that.pass.questsShown = false;
                that.pass.passShown = false;
            });

            this.goToForge = function (tabName, gearType) {
                buttonsContainer.children().removeClass("selected");
                forgeButton.addClass('selected');
                homeMenu.css('display', 'none');
                seasonPass.hide();
                questsMenu.css('display', 'none');
                armoryMenu.css('display', 'none');
                showMenu.hide();
                _this2.loadoutMenu.onHide();
                _this2.loadoutMenu.hide();
                _this2.forge.show(tabName, gearType);

                that.pass.questsShown = false;
                that.pass.passShown = false;
            };
            forgeButton.on('click touchend', function () {
                return _this2.goToForge();
            });

            //
            // Modals
            //

            // Set username
            var clearNamePrompt = function clearNamePrompt() {
                $('#modal-body-warning').css('display', 'none');
                $('#modal-account-name-input').val('');
            };
            this.setNameModal = new MenuModal($('#modal-account-name-change'));
            this.setNameModal.onShow(function () {
                clearNamePrompt();
                $('#modal-account-name-input').trigger('click');
            });
            this.setNameModal.onHide(clearNamePrompt);

            $('#modal-account-name-change .close').click(function (e) {
                $('#modal-battle-tag-time-warning').css('display', 'block');
            });

            $('#modal-account-name-finish').on('click', function () {
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(e) {
                    var name, regExp, _ref6, success, error, ERROR_CODE_TO_LOCALIZATION, message, text;

                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    e.stopPropagation();
                                    name = $('#modal-account-name-input').val();
                                    regExp = new RegExp(/^[A-Za-z0-9\]\[\ñ\Ñ]+$/);

                                    if (!regExp.test(name)) {
                                        _context5.next = 13;
                                        break;
                                    }

                                    _context5.next = 6;
                                    return _this2.account.setUsername(name);

                                case 6:
                                    _ref6 = _context5.sent;
                                    success = _ref6.success;
                                    error = _ref6.error;

                                    if (success || !error) {
                                        _this2.setNameModal.hide();
                                    }
                                    if (error) {
                                        ERROR_CODE_TO_LOCALIZATION = {
                                            'failed': 'Failed setting username.',
                                            'invalid': 'Invalid username.',
                                            'taken': 'Name already taken!',
                                            'change_time_not_expired': 'Username has already been set recently.'
                                        };
                                        message = ERROR_CODE_TO_LOCALIZATION[error] || ERROR_CODE_TO_LOCALIZATION['failed'];


                                        $('#modal-body-warning').hide();
                                        $('#modal-battle-tag-time-warning').css('display', 'none');
                                        $('#modal-body-warning').html(message);
                                        $('#modal-body-warning').fadeIn();
                                    }
                                    _context5.next = 18;
                                    break;

                                case 13:
                                    text = '/// No special character is allowed except "[" and "]" ///';


                                    $('#modal-body-warning').hide();
                                    $('#modal-battle-tag-time-warning').css('display', 'none');
                                    $('#modal-body-warning').html(text);
                                    $('#modal-body-warning').fadeIn();

                                case 18:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, _this2);
                }));

                return function (_x) {
                    return _ref5.apply(this, arguments);
                };
            }());
            $('#modal-account-name-input').on('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    $('#modal-account-name-finish').trigger('click');
                }
            });

            // Reset stats
            this.resetStatsModal = new MenuModal($('#modal-account-reset-stats'));
            this.resetStatsModal.onShow(function () {
                $('#modal-account-reset-stats-input').val('');
                _this2.modalMobileAccount.hide();
            });
            $('#modal-account-reset-stats-finish').click(function (e) {
                e.stopPropagation();
                var val = $('#modal-account-reset-stats-input').val();
                if (val == 'RESET STATS') {
                    _this2.account.resetStats();
                    _this2.resetStatsModal.hide();
                }
            });
            $('#modal-account-reset-stats-input').on('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    $('#modal-account-reset-stats-finish').trigger('click');
                }
            });

            // Delete account
            this.deleteAccountModal = new MenuModal($('#modal-account-delete'));
            this.deleteAccountModal.onShow(function () {
                $('#modal-account-delete-input').val('');
                _this2.modalMobileAccount.hide();
            });
            $('#modal-account-delete-finish').click(function (e) {
                e.stopPropagation();
                var val = $('#modal-account-delete-input').val();
                if (val == 'DELETE') {
                    _this2.account.deleteAccount();
                    _this2.deleteAccountModal.hide();
                }
            });
            $('#modal-account-delete-input').on('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    $('#modal-account-delete-finish').trigger('click');
                }
            });

            // User settings
            this.userSettingsModal = new MenuModal($('.account-buttons-settings'));
            this.userSettingsModal.checkSelector = false;
            this.userSettingsModal.skipFade = true;
            this.userSettingsModal.onShow(function () {
                $('.account-details-top').css('display', 'none');
                if (device.mobile) {
                    $('#modal-mobile-account-btn').addClass('btn-darkened');
                }
            });
            this.userSettingsModal.onHide(function () {
                $('.account-details-top').css('display', 'block');
                if (device.mobile) {
                    $('#modal-mobile-setting-tab').css('display', 'none');
                    $('#modal-mobile-account-btn').removeClass('btn-darkened');
                }
            });

            //Change between account and settings tabs on mobile menu
            $('#modal-mobile-account-btn').on('click', function () {
                if (_this2.account.loggedIn && !_this2.account.unlinked) {
                    $('#modal-mobile-account-tab').css('display', 'block');
                    $('#modal-mobile-account-btn').addClass('btn-darkened');
                    $('#modal-mobile-setting-tab').css('display', 'none');
                    $('#modal-mobile-setting-btn').removeClass('btn-darkened');
                } else {
                    $('#account-login-options-mobile').css('display', 'block');
                    $('#modal-mobile-account-btn').addClass('btn-darkened');
                    $('#modal-mobile-setting-tab').css('display', 'none');
                    $('#modal-mobile-setting-btn').removeClass('btn-darkened');
                }
            });

            $('#modal-mobile-settings-btn').on('click', function () {
                if (_this2.account.loggedIn && !_this2.account.unlinked) {
                    $('#modal-mobile-account-tab').css('display', 'none');
                    $('#modal-mobile-account-btn').removeClass('btn-darkened');
                    $('#modal-mobile-setting-tab').css('display', 'block');
                    $('#modal-mobile-setting-btn').addClass('btn-darkened');
                } else {
                    $('#account-login-options-mobile').css('display', 'none');
                    $('#modal-mobile-account-btn').removeClass('btn-darkened');
                    $('#modal-mobile-setting-tab').css('display', 'block');
                    $('#modal-mobile-setting-btn').addClass('btn-darkened');
                }
            });

            // Login and link options
            this.loginOptionsModal = new MenuModal($('#account-login-options'));
            this.loginOptionsModal.checkSelector = false;
            this.loginOptionsModal.skipFade = true;
            this.loginOptionsModal.onShow(function () {
                $('.account-details-top').css('display', 'none');
            });
            this.loginOptionsModal.onHide(function () {
                $('.account-details-top').css('display', 'block');
            });

            // Login and link options mobile
            this.loginOptionsModalMobile = new MenuModal($('#account-login-options-mobile'));
            this.loginOptionsModalMobile.checkSelector = false;
            this.loginOptionsModalMobile.skipFade = true;
            this.loginOptionsModalMobile.onShow(function () {
                $('.account-details-top').css('display', 'none');
            });
            this.loginOptionsModalMobile.onHide(function () {
                $('.account-details-top').css('display', 'block');
            });

            // Create account
            this.createAccountModal = new MenuModal($('#modal-create-account'));
            this.createAccountModal.onHide(function () {
                _this2.loadoutMenu.hide();
            });

            // Mobile Accounts Modal
            this.modalMobileAccount = new MenuModal($('#modal-mobile-account'));
            this.modalMobileAccount.onShow(function () {
                _this2.adService.hideBannerAd();
                $('#start-top-right').css('display', 'none');
                $('.account-details-top').css('display', 'none');
            });
            this.modalMobileAccount.onHide(function () {
                _this2.adService.showBannerAd(true);
                $('#start-top-right').css('display', 'block');
                $('.account-details-top').css('display', 'block');
                _this2.userSettingsModal.hide();
            });

            //
            // Main-menu buttons
            //

            // Leaderboard
            //TODO
            /*$('.account-leaderboard-link').click((e) => {
                window.open(api.resolveUrl('/stats'), '_blank');
                return false;
            });*/

            $('#btn-mobile-to-stats').click(this.adService.hideBannerAd);

            // My Stats
            //TODO
            /*$('.account-stats-link').click((e) => {
                this.waitOnLogin(() => {
                    if (this.account.loggedIn && !this.account.unlinked) {
                        // @TODO: Issue where where the user can click on
                        // 'My Stats' right after setting the username, but
                        // before the new profile has loaded
                         if (this.account.profile.usernameSet) {
                            let slug = this.account.profile.slug || '';
                            window.open(`/stats/${slug}`, '_blank');
                        } else {
                            // Prompt the user for a name if they don't have one;
                            // we need this to generate a slug to show their stats
                            this.setNameModal.show(true);
                        }
                    } else {
                        this.showIncentiveModal();
                    }
                });
                return false;
            });*/

            // Loadout
            $('#equipment-button, #btn-customize').click(function () {
                _this2.loadoutMenu.show();
                _this2.waitOnLogin(function () {
                    if (!_this2.account.loggedIn) {
                        _this2.showLoginMenu({
                            modal: true
                        });
                    }
                });

                return false;
            });

            // User
            $('.account-details-user').on('click', function () {
                if (_this2.userSettingsModal.isVisible() || _this2.loginOptionsModal.isVisible()) {
                    _this2.userSettingsModal.hide();
                    _this2.loginOptionsModal.hide();
                } else {
                    _this2.waitOnLogin(function () {
                        if (device.mobile) {
                            _this2.modalMobileAccount.show();
                        }
                        if (_this2.account.loggedIn && !_this2.account.unlinked) {
                            _this2.loginOptionsModal.hide();
                            _this2.userSettingsModal.show();
                        } else {
                            $('#account-player-name').css('display', 'block');
                            $('#account-login').css('display', 'none');

                            _this2.showLoginMenu({
                                modal: false,
                                link: true,
                                addQuery: true
                            });
                        }
                    });
                }
                return false;
            });

            // Link account
            $('.btn-account-link').on('click', function () {
                _this2.userSettingsModal.hide();
                _this2.showLoginMenu({
                    modal: true,
                    link: true
                });
                return false;
            });

            // Reset stats
            $('.btn-account-reset-stats').click(function () {
                _this2.userSettingsModal.hide();
                _this2.resetStatsModal.show();
                return false;
            });

            // Delete account
            $('.btn-account-delete').click(function () {
                _this2.userSettingsModal.hide();
                _this2.deleteAccountModal.show();
                return false;
            });

            // Log out
            $('.btn-account-logout').click(function () {
                _this2.account.logout();
                return false;
            });

            // Locked pass
            $('#btn-pass-locked').click(function () {
                _this2.showLoginMenu({
                    modal: true
                });
                return false;
            });
        }
    }, {
        key: 'onError',
        value: function onError(type, data) {
            var typeText = {
                'server_error': 'Operation failed, please try again later.',
                'facebook_account_in_use': 'Failed linking Facebook account.<br/>Account already in use!',
                'google_account_in_use': 'Failed linking Google account.<br/>Account already in use!',
                'twitch_account_in_use': 'Failed linking Twitch account.<br/>Account already in use!',
                'discord_account_in_use': 'Failed linking Discord account.<br/>Account already in use!',
                'apple_account_in_use': 'Failed linking Apple account.<br/>Account already in use!',
                'account_banned': 'Account banned: ' + data,
                'login_failed': 'Login failed.',
                'unlinked_account_error': 'Unlinked account error',
                'prestige_error': 'Not enough points'
            };
            var text = typeText[type];
            if (text) {
                this.errorModal.selector.find('.modal-body-text').html(text);
                this.errorModal.show();
                this.errorModal.onHide(function () {
                    document.cookie = 'link-account-error=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
                });
            }
        }
    }, {
        key: 'onBanError',
        value: function onBanError(type, data) {
            this.errorBanModal.show();
            this.errorBanModal.onHide(function () {
                document.cookie = 'link-account-error=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
            });
        }
    }, {
        key: 'onLogin',
        value: function onLogin() {
            this.createAccountModal.hide();
            this.loginOptionsModalMobile.hide();
            this.loginOptionsModal.hide();

            if (device.webview && device.version < '1.1.0') {
                $('#open-store-button > a').hide();
                $('#open-store-button > div').hide();
            } else {
                $('#open-store-button > a').show();
                $('#open-store-button > div').show();
            }

            if (this.account.unlinked) {
                $('.index-offer-time-left-text').hide();
                $('.iap-lto-time-left-text').hide();
            } else {
                $('.index-offer-time-left-text').show();
                $('.iap-lto-time-left-text').show();
            }

            if (this.account.loggedIn && !this.account.unlinked) {
                $('#player-name-input-solo').removeAttr("disabled");
            }

            //Add linked account icons
            if (this.account.profile.linkedFacebook) {
                $('#linked-account-icons').append('<div class=\'facebook-social-icon\'></div>');
            }

            if (this.account.profile.linkedGoogle) {
                $('#linked-account-icons').append('<div class=\'google-social-icon\'></div>');
            }

            if (this.account.profile.linkedTwitch) {
                $('#linked-account-icons').append('<div class=\'twitch-social-icon\'></div>');
            }

            if (this.account.profile.linkedDiscord) {
                $('#linked-account-icons').append('<div class=\'discord-social-icon\'></div>');
            }

            if (this.account.profile.linkedApple) {
                $('#linked-account-icons').append('<div class=\'apple-social-icon\'></div>');
            }

            // Nag to enter username
            if (!this.account.profile.usernameSet && !this.account.unlinked) {
                this.setNameModal.show(true);
            }
        }
    }, {
        key: 'onLoadoutUpdated',
        value: function onLoadoutUpdated(loadout) {}
    }, {
        key: 'onItemsUpdated',
        value: function onItemsUpdated(items) {
            this.updateEssence();
            var unconfirmedItemCount = 0;
            var unackedItemCount = 0;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.status < loadouts.ItemStatus.Confirmed) {
                    unconfirmedItemCount++;
                }
                if (item.status < loadouts.ItemStatus.Ackd) {
                    unackedItemCount++;
                }
            }

            var unconfirmed = items.filter(function (x) {
                return x.status < loadouts.ItemStatus.Confirmed;
            });
            var unackd = items.filter(function (x) {
                return x.status < loadouts.ItemStatus.Ackd;
            });
            var displayAlert = unconfirmedItemCount > 0 || unackedItemCount > 0;
            $('.account-loadout-link #loadout-alert-main').css({
                'display': displayAlert ? 'block' : 'none'
            });
            // if (unconfirmedItemCount > 0) {
            //     $('#loadout-alert-main').addClass('account-alert-orange');
            // } else {
            //     $('#loadout-alert-main').removeClass('account-alert-orange');
            // }
        }
    }, {
        key: 'waitOnLogin',
        value: function waitOnLogin(cb) {
            var _this3 = this;

            if (this.account.loggingIn && !this.account.loggedIn) {
                var runOnce = function runOnce() {
                    cb();
                    _this3.account.removeEventListener('requestsComplete', runOnce);
                };
                this.account.addEventListener('requestsComplete', runOnce);
            } else {
                cb();
            }
        }
    }, {
        key: 'showLoginLogout',
        value: function showLoginLogout() {
            /*  this.showLoginMenu({
                 modal: false,
                 loginFlow: false
             });
            */

            var playerId = uuidv4();
            var n1 = Math.floor(Math.random() * 10) + '';
            var n2 = Math.floor(Math.random() * 10) + '';
            this.config.set('BHAIdUnlinked', playerId.replace('-', n1).replace('-', n2));
            location.reload();
        }
    }, {
        key: 'showLoginMenu',
        value: function showLoginMenu(opts) {
            var _this4 = this;

            opts = (0, _assign2.default)({
                modal: false,
                link: false,
                showLinkAccount: false,
                addQuery: false,
                loginFlow: false
            }, opts);

            var modal = opts.modal ? this.createAccountModal : device.mobile ? this.loginOptionsModalMobile : this.loginOptionsModal;

            this.createLoginOptions(modal.selector, opts.link, this.account, this.localization, opts.showLinkAccount, opts.addQuery, opts.loginFlow ? modal : false);

            modal.show();
            if (opts.loginFlow) {
                modal.onHide(function () {
                    var playerId = uuidv4();
                    var n1 = Math.floor(Math.random() * 10) + '';
                    var n2 = Math.floor(Math.random() * 10) + '';
                    _this4.config.set('BHAIdUnlinked', playerId.replace('-', n1).replace('-', n2));
                    location.reload();
                });
            } else if (opts.showLinkAccount || opts.link && this.account.unlinked) {
                modal.onHide(function () {
                    $('#account-player-name').css('display', 'none');
                    $('#account-login').css('display', 'block');
                });
            } else {
                modal.onHide(function () {});
            }
        }
    }, {
        key: 'showIncentiveModal',
        value: function showIncentiveModal() {
            var modalLoginIncentive = new ModalLoginIncentive(this.localization, this);
            modalLoginIncentive.show();
        }
    }, {
        key: 'showRegisterConfirmPrompt',
        value: function showRegisterConfirmPrompt() {
            var _this5 = this;

            this.creatingAccount = false;
            var warningButtonsData = {
                left: {
                    action: function action() {
                        _this5.creatingAccount = true;
                        _this5.account.ajaxRequest('/api/user/register_bha_new_user', function (err, res) {
                            _this5.config.set('BHAIdUnlinked', null);
                            document.cookie = 'register-data=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
                            _this5.creatingAccount = true;
                            location.reload();
                        });
                    }
                },
                right: true //Do nothing because is already done in "onHide" modal method
            };

            var testModal = new ModalWarningError(this, this.localization, false, 'modal-text-no-account-linked', warningButtonsData);
            testModal.onHide(function () {
                if (_this5.creatingAccount) return;
                document.cookie = 'register-data=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
                var accountCreated = _this5.config.get('BHAIdUnlinked');
                if (!accountCreated) {
                    _this5.showLoginMenu({
                        modal: true,
                        loginFlow: true
                    });
                } else {
                    location.reload();
                }
            });
            testModal.show();
        }
    }, {
        key: 'updateCurrency',
        value: function updateCurrency() {
            this.updateGold();
            this.updateEssence();
        }
    }, {
        key: 'updateEssence',
        value: function updateEssence() {
            var actualCurrency = $('#essence-total').text();
            var newCurrency = this.account.profile.totalEssence;

            if ($('#essence-total').text().trim().length > 0) {
                // @ts-ignore
                actualCurrency = parseInt(actualCurrency);

                if (actualCurrency > newCurrency && !this.essenceUpdate) {
                    // @ts-ignore
                    var timePerGP = 1000 / (actualCurrency - newCurrency);
                    var reduceGP = Math.ceil(14 / timePerGP);

                    var profileContext = this;

                    var doUpdate = function doUpdate() {
                        $('#essence-total').each(function () {
                            if (actualCurrency > newCurrency) {
                                // @ts-ignore
                                // @ts-ignore
                                actualCurrency -= reduceGP;

                                if (actualCurrency <= newCurrency) {
                                    $(this).html(newCurrency);
                                    profileContext.essenceUpdate = null;
                                } else {
                                    $(this).html(actualCurrency);
                                }
                            }
                        });
                    };
                    this.essenceUpdate = doUpdate;
                    setInterval(doUpdate, 10);
                } else if (actualCurrency < newCurrency && !this.essenceUpdate) {
                    // @ts-ignore
                    var _timePerGP = 1000 / (newCurrency - actualCurrency);
                    var _reduceGP = Math.ceil(10 / _timePerGP);
                    var _profileContext = this;

                    var _doUpdate = function _doUpdate() {
                        $('#essence-total').each(function () {
                            if (actualCurrency < newCurrency) {
                                actualCurrency += _reduceGP;

                                if (actualCurrency >= newCurrency) {
                                    $(this).html(newCurrency);
                                    _profileContext.essenceUpdate = null;
                                } else {
                                    $(this).html(actualCurrency);
                                }
                            }
                        });
                    };
                    this.essenceUpdate = _doUpdate;
                    setInterval(_doUpdate, 10);
                }
            } else {
                $('#essence-total').html(newCurrency);
            }
        }
    }, {
        key: 'updateGold',
        value: function updateGold() {
            var actualCurrency = $('#gold-total').text();
            var newCurrency = this.account.profile.gpTotal;

            if ($('#gold-total').text().trim().length > 0) {
                // @ts-ignore
                actualCurrency = parseInt(actualCurrency);

                if (actualCurrency > newCurrency && !this.goldUpdate) {
                    // @ts-ignore
                    var timePerGP = 1000 / (actualCurrency - newCurrency);
                    var reduceGP = Math.ceil(14 / timePerGP);

                    var profileContext = this;

                    var doUpdate = function doUpdate() {
                        $('#gold-total').each(function () {
                            if (actualCurrency > newCurrency) {
                                // @ts-ignore
                                actualCurrency -= reduceGP;

                                if (actualCurrency <= newCurrency) {
                                    $(this).html(newCurrency);
                                    profileContext.goldUpdate = null;
                                } else {
                                    $(this).html(actualCurrency);
                                }
                            }
                        });
                    };
                    this.goldUpdate = doUpdate;
                    setInterval(doUpdate, 10);
                } else if (actualCurrency < newCurrency && !this.goldUpdate) {
                    // @ts-ignore
                    var _timePerGP2 = 1000 / (newCurrency - actualCurrency);
                    var _reduceGP2 = Math.ceil(10 / _timePerGP2);
                    var _profileContext2 = this;

                    var _doUpdate2 = function _doUpdate2() {
                        $('#gold-total').each(function () {
                            if (actualCurrency < newCurrency) {
                                actualCurrency += _reduceGP2;

                                if (actualCurrency >= newCurrency) {
                                    $(this).html(newCurrency);
                                    _profileContext2.goldUpdate = null;
                                } else {
                                    $(this).html(actualCurrency);
                                }
                            }
                        });
                    };
                    this.goldUpdate = _doUpdate2;
                    setInterval(_doUpdate2, 10);
                }
            } else {
                $('#gold-total').html(newCurrency);
            }
        }
    }, {
        key: 'updatePrestige',
        value: function updatePrestige(newPrestige) {

            var oldPrestige = parseInt(this.account.profile.prestige);
            newPrestige = parseInt(newPrestige);
            var that = this;
            this.account.profile.prestige = newPrestige;
            this.account.analytics.current_prestige_points = newPrestige;

            if (oldPrestige != newPrestige) {

                var difference = 1;
                var prestigeDifference = newPrestige - oldPrestige;
                if (oldPrestige > newPrestige) {
                    difference = -1;
                    prestigeDifference = oldPrestige - newPrestige;
                }

                if (oldPrestige != newPrestige) {

                    this.prestigeUpdated = true;

                    var doUpdate = function doUpdate() {
                        $('#user-prestige').each(function () {
                            if (oldPrestige < newPrestige && difference == 1 || newPrestige < oldPrestige && difference == -1) {

                                oldPrestige = oldPrestige + difference;
                                // @ts-ignore
                                $(this).html(oldPrestige);
                            } else {
                                that.prestigeUpdated = false;
                                $(this).html(newPrestige);
                                clearInterval(x);
                            }
                        });
                    };
                    var x = setInterval(doUpdate, 10);

                    $('#user-new-prestige').addClass('prestige-text-pulse');
                    $('#user-new-prestige').html(difference == 1 ? '+' + prestigeDifference : '-' + prestigeDifference);
                    $('#user-new-prestige').css('display', 'block');

                    setTimeout(function () {
                        $('#user-new-prestige').removeClass('prestige-text-pulse');
                        $('#user-new-prestige').css('display', 'none');
                    }, 1500);
                } else {
                    $('#user-new-prestige').css('display', 'none');
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            // Loading icon
            var loading = this.account.requestsInFlight > 0;
            $('.account-loading').css('opacity', loading ? 1.0 : 0.0);

            // User name text
            var usernameText = helpers.htmlEscape(this.account.profile.showSlug || '');
            if (!this.account.loggedIn) {
                usernameText = this.account.loggingIn ? this.localization.translate('index-logging-in') + '...' : this.localization.translate('index-log-in-desc');
            }
            $('#account-name').html(usernameText);
            $('#account-player-name').html(usernameText);
            $('#account-player-name').css('display', this.account.loggedIn && !this.account.unlinked ? 'block' : 'none');
            $('#account-login').css('display', this.account.loggedIn && !this.account.unlinked ? 'none' : 'block');

            /*if(!this.prestigeUpdated) {
                $('#user-prestige').html(this.account.profile.prestige);
            }*/

            // Change username
            var nameChangeEnabled = this.account.profile.usernameChangeTime <= 0;
            if (!nameChangeEnabled) {
                $('.btn-account-change-name').addClass('btn-account-disabled');
            } else {
                $('.btn-account-change-name').removeClass('btn-account-disabled');
            }

            var profile = this.account.profile;

            if (loading || (0, _keys2.default)(profile).length === 0) {
                return;
            }

            //Show icons for linked account


            this.updateCurrency();

            /*if (this.config.get('incentiveGame1') === true) {
                this.showIncentiveModal();
                this.config.set('incentiveGame1', false);
            }*/

            //TEST BUTTON
            var unlinkAccount = $('#test-unlink-account');
            if (this.account.unlinked) unlinkAccount.css('display', 'none');else unlinkAccount.css('display', 'block');
        }

        //
        // Helpers
        //

    }, {
        key: 'createLoginOptions',
        value: function createLoginOptions(parentElem, linkAccount, account, localization, showLinkAccount, addQuery, modalElement) {
            var _this6 = this;

            var contentsElem = parentElem.find('.login-options-content');
            contentsElem.empty();
            if (linkAccount && !account.unlinked) {
                contentsElem.append($('<div/>', {
                    class: 'account-login-desc'
                }).append($('<p/>', {
                    html: localization.translate('index-link-account-to')
                })));
            }
            var buttonParentElem = $('<div/>', {
                class: 'account-buttons'
            });
            contentsElem.append(buttonParentElem);

            var query = '';
            if (addQuery) {
                query = '?unlinked=true';
            }

            var addLoginOption = function addLoginOption(method, linked, onClick) {
                if (!proxy.loginSupported(method)) {
                    return;
                }

                var el = $('<div/>', {
                    class: 'menu-option btn-standard button-' + method
                });
                el.append($('<span/>', {
                    class: 'login-button-name'
                }).append($('<span/>', {
                    html: localization.translate('index-' + method)
                })));

                if (linkAccount && linked) {
                    el.addClass('btn-login-linked');
                    el.find('span.login-button-name').html('<div class="btn-login-linked"></div>');
                } else {
                    el.click(function (e) {
                        onClick();
                    });
                }

                buttonParentElem.append(el);
            };

            // Define the available login methods
            addLoginOption('facebook', account.profile.linkedFacebook, function () {
                if (modalElement) {
                    modalElement.onHide(function () {});
                }
                if (device.webview && device.version > '1.0.0') {
                    account.loginWithAccessToken('/api/user/auth/facebook/token', webview.facebookLogin, function (x) {
                        return x.authResponse.accessToken;
                    }, query);
                } else {
                    window.location.href = '/api/user/auth/facebook' + query;
                }
            });

            addLoginOption('google', account.profile.linkedGoogle, function () {
                if (modalElement) {
                    modalElement.onHide(function () {});
                }
                if (device.webview && device.version > '1.0.0') {
                    account.loginWithAccessToken('/api/user/auth/google/token', webview.googleLogin, function (x) {
                        return x.accessToken;
                    }, query);
                } else {
                    window.location.href = '/api/user/auth/google' + query;
                }
            });

            addLoginOption('twitch', account.profile.linkedTwitch, function () {
                if (modalElement) {
                    modalElement.onHide(function () {});
                }
                _this6.adService.hideBannerAd();
                window.location.href = '/api/user/auth/twitch' + query;
            });

            addLoginOption('discord', account.profile.linkedDiscord, function () {
                if (modalElement) {
                    modalElement.onHide(function () {});
                }
                _this6.adService.hideBannerAd();
                window.location.href = '/api/user/auth/discord' + query;
            });

            /*addLoginOption('apple', account.profile.linkedApple, () => {
                if (modalElement) { modalElement.onHide(() => { }); }
                this.adService.hideBannerAd();
                window.location.href = '/api/user/auth/apple' + query;
            });*/

            if (showLinkAccount) {
                buttonParentElem.append($('<div/>', {
                    class: 'btn-account-link btn-account-turq menu-option btn-darken btn-standard',
                    html: localization.translate('index-link-account')
                }));

                $('.btn-account-link').on('click', function () {
                    buttonParentElem.empty();
                    _this6.showLoginMenu({
                        modal: false,
                        link: true,
                        addQuery: true
                    });
                    return false;
                });
            }
        }
    }]);
    return ProfileUi;
}();

module.exports = ProfileUi;
