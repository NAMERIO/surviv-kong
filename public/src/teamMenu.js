"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var GameConfig = require("./989ad62a.js");
var math = require("./10899aea.js");
var net = require("./net.js");
var util = require("./util.js");
var api = require("./api.js");
var device = require("./device.js");
var helpers = require("./helpers.js");

var MapDefs = require("./mapDefs.js");
var generalUseDefs = require("./generalUseDefs.js");
var GameObjectDefs = require("./gameObjectDefs.js");

function errorTypeToString(type, localization) {
    var kTypeMap = {
        'join_full': localization.translate('index-team-is-full'),
        'join_not_found': localization.translate('index-failed-joining-team'),
        'create_failed': localization.translate('index-failed-creating-team'),
        'join_failed': localization.translate('index-failed-joining-team'),
        'join_game_failed': localization.translate('index-failed-joining-game'),
        'lost_conn': localization.translate('index-lost-connection'),
        'find_game_error': localization.translate('index-failed-finding-game'),
        'find_game_full': localization.translate('index-failed-finding-game'),
        'find_game_invalid_protocol': localization.translate('index-invalid-protocol'),
        'kicked': localization.translate('index-team-kicked'),
        'team_bigger_than_mode': localization.translate('index-team-bigger-than-duo')
    };
    return kTypeMap[type] || kTypeMap['lost_conn'];
}

var kKeepAliveTimeout = 45.0;

//
// TeamMenu
//

var TeamMenu = function () {
    function TeamMenu(config, pingTest, siteInfo, localization, audioManager, joinGameCb, leaveCb, analytics, account, adManager) {
        var _this = this;

        (0, _classCallCheck3.default)(this, TeamMenu);

        // Jquery elems
        this.playBtn = $('#btn-start-team');
        this.serverWarning = $('#server-warning');
        this.teamOptions = $('#btn-team-queue-mode-1, #btn-team-queue-mode-2, #btn-team-fill-auto, #btn-team-fill-none');
        this.serverSelect = $('#server-select-main');
        this.queueMode1 = $('#btn-team-queue-mode-1');
        this.queueMode2 = $('#btn-team-queue-mode-2');
        this.fillAuto = $('#btn-team-fill-auto');
        this.fillValue = $('#fill-value');
        //this.fillNone = $('#btn-team-fill-none');
        this.teamMenu = $('#team-menu-options');
        this.btnChangeMode = device.mobile ? $('#index-mode-select-container-team') : $('#btn-change-mode-team');
        this.btnChangeType = device.mobile ? $('#index-type-select-container-team') : $('#btn-change-type-team');
        this.btnChangeModeSelection = this.teamMenu.find('.btn-change-mode-selection');
        this.btnChangeTypeSelection = this.teamMenu.find('.btn-change-type-selection');
        this.modeOptions = this.btnChangeMode.find('#index-mode-select-team');
        this.typeOptions = this.btnChangeType.find('#index-type-select-team');

        // Module state
        this.config = config;
        this.pingTest = pingTest;
        this.siteInfo = siteInfo;
        this.localization = localization;
        this.audioManager = audioManager;
        this.joinGameCb = joinGameCb;
        this.leaveCb = leaveCb;
        this.account = account;
        this.adManager = adManager;

        this.active = false;
        this.joined = false;
        this.create = false;
        this.joiningGame = false;
        this.ws = null;
        this.keepAliveTimeout = 0.0;
        this.analytics = analytics;

        // Ui state
        this.playerData = {};
        this.roomData = {};
        this.players = [];
        this.prevPlayerCount = 0;
        this.localPlayerId = 0;
        this.isLeader = true;
        this.editingName = false;
        this.displayedInvalidProtocolModal = false;
        this.gameModesAvailable = null;
        this.gameModeSelected = this.config.get('gameModeSelected');
        this.lastModeCss = '';
        this.factionSelected = false;

        // Listen for ui modifications
        this.serverSelect.change(function () {
            // Run a ping test when the region changes
            var region = _this.serverSelect.find(":selected").val();
            _this.pingTest.start([region]);

            _this.setRoomProperty('region', region);
        });

        this.queueMode1.click(function () {
            _this.setRoomProperty('gameModeIdx', 1);
        });
        this.queueMode2.click(function () {
            _this.setRoomProperty('gameModeIdx', 2);
        });

        this.fillAuto.click(function () {
            if (_this.fillValue.text() == ' OFF') {
                _this.setRoomProperty('autoFill', true);
                $('#boost-warning').css('display', 'block');
                _this.fillValue.text(' ON');
            } else {
                _this.setRoomProperty('autoFill', false);
                $('#boost-warning').css('display', 'none');
                _this.fillValue.text(' OFF');
            }
        });
        /*this.fillNone.click(() => {
            this.setRoomProperty('autoFill', false);
            $('#boost-warning').css('display', 'none');
        });*/

        this.playBtn.on('click', function () {
            _this.tryStartGame();
        });

        if (!device.mobile) {
            $(document).on('click', function (e) {
                if (_this.isLeader) {
                    if (_this.btnChangeModeSelection.is(':visible')) {
                        _this.btnChangeModeSelection.css('display', 'none');
                        _this.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
                        _this.btnChangeMode.find('.btn-divider').removeAttr('style');
                    }
                    if (_this.btnChangeTypeSelection.is(':visible')) {
                        _this.btnChangeTypeSelection.css('display', 'none');
                        _this.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                        _this.btnChangeType.find('.btn-divider').removeAttr('style');
                    }
                }
            });
            var that = this;
            this.btnChangeMode.on('click', function (e) {
                if (_this.isLeader) {
                    e.stopPropagation();
                    _this.btnChangeTypeSelection.css('display', 'none');
                    _this.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                    _this.btnChangeType.find('.btn-divider').removeAttr('style');
                    if (_this.btnChangeModeSelection.is(':visible')) {
                        _this.btnChangeModeSelection.css('display', 'none');
                        _this.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
                        _this.btnChangeMode.find('.btn-divider').removeAttr('style');
                    } else {
                        if (_this.factionSelected) {
                            _this.btnChangeMode.css('display', 'none');
                            setTimeout(function () {
                                that.btnChangeMode.removeAttr('style');
                            }, 10);
                        }
                        _this.btnChangeModeSelection.css('display', 'block');
                        _this.btnChangeMode.find('.index-dropdown-arrow').css('display', 'none');
                        _this.btnChangeMode.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                    }

                    $('#start-overlay').on('click', function (e) {
                        _this.btnChangeModeSelection.css('display', 'none');
                    });
                }
            });
            this.btnChangeType.on('click', function (e) {
                if (_this.isLeader) {
                    e.stopPropagation();
                    _this.btnChangeModeSelection.css('display', 'none');
                    _this.btnChangeMode.find('.btn-divider').removeAttr('style');
                    if (_this.btnChangeTypeSelection.is(':visible')) {
                        _this.btnChangeTypeSelection.css('display', 'none');
                        _this.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');
                        _this.btnChangeType.find('.btn-divider').removeAttr('style');
                    } else {
                        _this.btnChangeTypeSelection.css('display', 'block');
                        _this.btnChangeType.find('.index-dropdown-arrow').css('display', 'none');
                        _this.btnChangeType.find('.btn-divider').css('border-bottom', 'solid 27px #FFFFFF');
                    }

                    $('#start-overlay').on('click', function (e) {
                        _this.btnChangeTypeSelection.css('display', 'none');
                    });
                }
            });

            this.btnChangeModeSelection.on('click', '.option-change-mode', function (e) {
                if (_this.isLeader) {
                    var btnId = parseInt($(e.target).attr('id'));
                    if (_this.gameModesAvailable[btnId].modes[0].type >= _this.prevPlayerCount) {
                        _this.gameModeSelected[0] = btnId;
                        _this.gameModeSelected[1] = 0;
                        _this.updatePlayBtns();
                    } else {
                        // Error text
                        var errorTxt = errorTypeToString('team_bigger_than_mode', _this.localization);
                        _this.serverWarning.css('opacity', 1.0);
                        _this.serverWarning.html(errorTxt);
                    }
                }
            });

            this.btnChangeTypeSelection.on('click', '.option-change-type', function (e) {
                if (_this.isLeader) {
                    var btnId = parseInt($(e.target).attr('id'));
                    if (_this.gameModesAvailable[_this.gameModeSelected[0]].modes[btnId].type >= _this.prevPlayerCount) {
                        _this.gameModeSelected[1] = btnId;
                        _this.updatePlayBtns();
                    } else {
                        // Error text
                        var errorTxt = errorTypeToString('team_bigger_than_mode', _this.localization);
                        _this.serverWarning.css('opacity', 1.0);
                        _this.serverWarning.html(errorTxt);
                    }
                }
            });
        } else {
            this.modeOptions.change(function () {
                var seletedValue = _this.modeOptions.find(":selected").val();
                _this.gameModeSelected[0] = seletedValue;
                _this.gameModeSelected[1] = 0;
                _this.updatePlayBtns(false);
            });

            this.typeOptions.change(function (e) {
                var seletedValue = _this.typeOptions.find(":selected").val();
                _this.gameModeSelected[1] = seletedValue;
                _this.updatePlayBtns(false, false);
            });
        }

        // Copy invite link
        $('#team-copy-url, #team-desc-text').click(function (e) {
            var copyToast = $('<div/>', {
                class: 'copy-toast',
                html: 'Copied!'
            });
            $('#start-menu-wrapper').append(copyToast);
            copyToast.css({
                left: e.pageX - parseInt(copyToast.css('width')) / 2,
                top: $('#team-copy-url').offset().top
            });
            copyToast.animate({
                top: "-=20",
                opacity: 1.0
            }, {
                queue: false,
                duration: 300,
                complete: function complete() {
                    $(this).fadeOut(250, function () {
                        $(this).remove();
                    });
                }
            });

            var url = $('#team-url').html();
            helpers.copyTextToClipboard(url);
        });

        // Hide invite link
        this.hideUrl = false;
        $('#team-hide-url').click(function (e) {
            var el = e.currentTarget;
            _this.hideUrl = !_this.hideUrl;
            if (_this.hideUrl && _this.isLeader) {
                _this.account.setDiscordRP(4, _this.roomData.gameModeIdx, _this.players.length, _this.roomData.maxPlayers);
            } else if (_this.isLeader) {
                var teamURL = window.location.origin + '/' + _this.roomData.roomUrl;
                _this.account.setDiscordRP(3, _this.roomData.gameModeIdx, _this.players.length, _this.roomData.maxPlayers, teamURL);
            }
            if (_this.hideUrl) {
                $('#team-hide-url').css('background-color', '#cc0000');
                $('#team-hide-url').css('box-shadow', '0px 6.9px 0px #8d0000');
            } else {
                $('#team-hide-url').css('background-color', '#555555');
                $('#team-hide-url').css('box-shadow', '0px 6.20636px 0px #3E3E3E');
            }
            $('#team-desc-text, #team-code-text').css({
                'opacity': _this.hideUrl ? 0.0 : 1.0
            });
            $(el).css({
                'background-image': _this.hideUrl ? 'url(../img/gui/hide.svg)' : 'url(../img/gui/eye.svg)'
            });
        });
    }

    (0, _createClass3.default)(TeamMenu, [{
        key: 'hideEvent',
        value: function hideEvent() {
            var el = $('#team-hide-url');
            this.hideUrl = false;
            $('#team-hide-url').css('background-color', '#555555');
            $('#team-hide-url').css('box-shadow', '0px 6.20636px 0px #3E3E3E');
            $('#team-desc-text, #team-code-text').css({
                'opacity': 1.0
            });
            $(el).css({
                'background-image': 'url(../img/gui/eye.svg)'
            });
        }
    }, {
        key: 'getPlayerById',
        value: function getPlayerById(playerId) {
            return this.players.find(function (x) {
                return x.playerId == playerId;
            });
        }
    }, {
        key: 'update',
        value: function update(dt) {
            if (this.joined) {
                if ($('#xp-team-mission-text').css("opacity") == 1) {
                    $('#xp-team-mission-text').css('opacity', 0);
                    $('#xp-team-mission-value').css('opacity', 0);
                }
                this.keepAliveTimeout -= dt;
                if (this.keepAliveTimeout < 0.0) {
                    this.keepAliveTimeout = kKeepAliveTimeout;
                    this.sendMessage('keepAlive', {});
                }
            }
        }
    }, {
        key: 'updatePlayBtns',
        value: function updatePlayBtns() {
            var updateAvailableModes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
            var updateAvailablesTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (!this.gameModesAvailable || !this.gameModeSelected) {
                this.gameModesAvailable = this.siteInfo.getAvailableTeamModes();
                updateAvailableModes = true;updateAvailablesTypes = true;
                if (!this.gameModeSelected) {
                    this.gameModeSelected = [0, 0, this.gameModesAvailable[0].modes[0].id];
                    this.config.set('gameModeSelected', this.gameModeSelected);
                }
            }

            var mapIndex = this.roomData.gameModeSelected[0];
            var typeIndex = this.roomData.gameModeSelected[1]; //Solo, duo, squad
            var modes = this.gameModesAvailable[mapIndex].modes;

            //Update selected mode
            var selectedMode = device.mobile ? this.btnChangeMode : this.btnChangeMode.find('#index-play-mode-selected-team');
            var selectedMap = this.gameModesAvailable[mapIndex].map;
            var mapDefSelected = (MapDefs[selectedMap] || MapDefs['main']).desc;
            /*selectedMode.css({
                'background-image': `url(${mapDefSelected.icon})`
            });*/

            if (!device.mobile) {
                selectedMode.attr('data-l10n', mapDefSelected.buttonText);
                selectedMode.html(this.localization.translate(mapDefSelected.buttonText));
            } else {
                this.modeOptions.val(mapIndex);
            }

            if (selectedMap == 'faction') {
                this.btnChangeMode.removeClass('btn-custom-mode-no-indent-no-animation');
                this.btnChangeMode.addClass('btn-custom-mode-no-indent');

                this.btnChangeModeSelection.removeClass('btn-custom-mode-no-indent-no-animation');
                this.btnChangeModeSelection.addClass('btn-custom-mode-no-indent');

                this.factionSelected = true;
            } else {
                if (this.lastModeCss == 'btn-mode-faction') {
                    this.btnChangeMode.addClass('btn-custom-mode-no-indent-no-animation');
                    this.btnChangeMode.removeClass('btn-custom-mode-no-indent');

                    this.btnChangeModeSelection.addClass('btn-custom-mode-no-indent-no-animation');
                    this.btnChangeModeSelection.removeClass('btn-custom-mode-no-indent');

                    this.factionSelected = false;
                }
            }

            if (this.lastClass == 'removeLast') {
                var lastClass = this.btnChangeMode.attr('class').split(' ').pop();
                if (lastClass != 'btn-custom-mode-no-indent-no-animation' && lastClass != 'btn-custom-mode-no-indent') {
                    this.btnChangeMode.removeClass(lastClass);
                    this.btnChangeModeSelection.removeClass(lastClass);
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
            var selectedType = device.mobile ? this.btnChangeType : this.btnChangeType.find('#index-play-type-selected-team');
            var selectedTypeId = modes[typeIndex].type;
            var selectedTypeData = 'index-play-type-' + selectedTypeId;
            if (selectedTypeId == 1) {
                selectedType.css({
                    'background-image': 'url(img/gui/loadout-player-icon.svg)'
                });
            } else {
                selectedType.css({
                    'background-image': 'url(img/gui/type-' + selectedTypeId + '.svg)'
                });
            }

            if (!device.mobile) {
                var _selectedTypeData = 'index-play-type-' + selectedTypeId;
                selectedType.attr('data-l10n', _selectedTypeData);
                selectedType.html(this.localization.translate(_selectedTypeData));
            } else {
                this.typeOptions.val(typeIndex);
            }

            //Update selected mode id to start game
            this.gameModeSelected[2] = parseInt(modes[typeIndex].id);
            this.setRoomProperty('gameModeIdx', this.gameModeSelected[2]);
            this.setRoomProperty('gameModeSelected', this.gameModeSelected);

            if (this.isLeader && !device.mobile) {
                var modeSelection = this.teamMenu.find('#btn-change-mode-selection-team div');
                modeSelection.html('');
                var typeSelection = this.teamMenu.find('#btn-change-type-selection-team div');
                typeSelection.html('');

                this.btnChangeMode.find('.index-dropdown-arrow').css('display', 'block');
                this.btnChangeType.find('.index-dropdown-arrow').css('display', 'block');

                //Update list of modes available
                for (var i = 0; i < this.gameModesAvailable.length; i++) {
                    var mode = $('<div>');
                    var modeId = this.gameModesAvailable[i].map;
                    var mapDef = (MapDefs[modeId] || MapDefs['main']).desc;

                    mode.attr('class', 'option-change-mode btn-darken menu-option right-play-btn btn-custom-mode-no-indent-no-animation');
                    mode.attr('data-l10n', mapDef.buttonText);
                    mode.attr('id', i);
                    mode.html(this.localization.translate(mapDef.buttonText));
                    mode.css({
                        'background-image': 'url(' + mapDef.icon + ')'
                    });
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
                //modeSelection.append('<div class="btn-divider"></div>');


                //Update list of types available of the selected mode
                for (var _i = 0; _i < modes.length; _i++) {
                    var type = $('<div>');
                    var typeId = modes[_i].type;
                    var playData = 'index-play-type-' + typeId;

                    type.attr('class', 'option-change-type btn-darken menu-option right-play-btn');
                    type.attr('data-l10n', playData);
                    type.attr('id', _i);
                    type.html(this.localization.translate(playData));
                    if (typeId == 1) {
                        type.css({
                            'background-image': 'url(img/gui/loadout-player-icon.svg)'
                        });
                    } else {
                        type.css({
                            'background-image': 'url(img/gui/type-' + typeId + '.svg)'
                        });
                    }

                    if (typeId == selectedTypeId) type.addClass('btn-darkened');else type.removeClass('btn-darkened');

                    typeSelection.append(type);
                }
                //typeSelection.append('<div class="btn-divider"></div>');
            } else {
                //If the player is not the leader or is in mobile
                this.btnChangeMode.find('.index-dropdown-arrow').css('display', 'none');
                this.btnChangeType.find('.index-dropdown-arrow').css('display', 'none');

                if (device.mobile) {
                    //Mobile
                    if (this.isLeader) {
                        //If user is leader let change the mode/type
                        this.modeOptions.removeAttr('disabled');
                        this.typeOptions.removeAttr('disabled');
                    }

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
            }
        }
    }, {
        key: 'connect',
        value: function connect(create, roomUrl, battleTag) {
            var _this2 = this;

            if (this.active && roomUrl === this.roomData.roomUrl) {
                return;
            }

            var roomHost = api.resolveRoomHost();
            var proto = 'ws:/';
            var url = proto + roomHost + '/team_v2';

            this.active = true;
            this.joined = false;
            this.create = create;
            this.joiningGame = false;
            this.editingName = false;
            // Load properties from config

            //create object for loadout display
            var playerLoadout = {
                melee: this.account.loadout.melee,
                outfit: this.account.loadout.outfit
            };
            this.playerData = {
                name: battleTag,
                isMobile: device.mobile,
                loadout: playerLoadout
            };
            this.roomData = {
                roomUrl: roomUrl,
                region: this.config.get('region'),
                gameModeIdx: this.config.get('gameModeIdx'),
                autoFill: this.config.get('teamAutoFill'),
                findingGame: false,
                lastError: '',
                gameModeSelected: this.gameModeSelected
            };
            this.displayedInvalidProtocolModal = false;

            this.refreshUi();

            if (this.ws) {
                this.ws.onclose = function () {};
                this.ws.close();
                this.ws = null;
            }

            try {
                this.ws = new WebSocket(url);

                this.ws.onerror = function (err) {
                    if (_this2.ws) {
                        _this2.ws.close();
                    }
                };

                this.ws.onclose = function () {
                    var errMsg = '';
                    if (!_this2.joiningGame) {
                        if (_this2.joined) {
                            errMsg = 'lost_conn';
                        } else if (_this2.create) {
                            errMsg = 'create_failed';
                        } else {
                            errMsg = 'join_failed';
                        }
                    }
                    _this2.leave(errMsg);
                };

                this.ws.onopen = function () {
                    if (_this2.create) {
                        _this2.sendMessage('create', {
                            roomData: _this2.roomData,
                            playerData: _this2.playerData
                        });
                    } else {
                        _this2.sendMessage('join', {
                            roomUrl: _this2.roomData.roomUrl,
                            playerData: _this2.playerData
                        });
                    }
                };

                this.ws.onmessage = function (e) {
                    if (_this2.active) {
                        var msg = JSON.parse(e.data);
                        _this2.onMessage(msg.type, msg.data);
                    }
                };
            } catch (err) {
                this.leave(this.create ? 'create_failed' : 'join_failed');
            }
        }
    }, {
        key: 'leave',
        value: function leave(errType) {
            if (this.active) {
                if (this.ws) {
                    this.ws.close();
                }

                this.ws = null;
                this.active = false;
                this.joined = false;
                this.joiningGame = false;
                this.refreshUi();

                // Save state to config for the menu
                this.config.set('gameModeSelected', this.roomData.gameModeSelected);
                this.config.set('gameModeIdx', this.roomData.gameModeIdx);
                this.config.set('teamAutoFill', this.roomData.autoFill);
                if (this.isLeader) {
                    this.config.set('region', this.roomData.region);
                }

                this.hideEvent();

                var errTxt = '';
                if (errType && errType != '') {
                    errTxt = errorTypeToString(errType, this.localization);
                }
                this.leaveCb(errTxt);
            }
        }
    }, {
        key: 'onGameComplete',
        value: function onGameComplete() {
            // @TODO: Display error messages received from the game
            if (this.active) {
                this.joiningGame = false;
                this.sendMessage('gameComplete');
            }
        }
    }, {
        key: 'onMessage',
        value: function onMessage(type, data) {
            switch (type) {
                case 'state':
                    {
                        this.joined = true;

                        var ourRoomData = this.roomData;
                        this.roomData = data.room;
                        this.players = data.players;
                        this.localPlayerId = data.localPlayerId;
                        this.isLeader = this.getPlayerById(this.localPlayerId).isLeader;

                        if (this.gameModeSelected != data.room.gameModeSelected) {
                            this.gameModeSelected = data.room.gameModeSelected;
                            this.updatePlayBtns(false, false);
                        }

                        // Override room properties with local values if we're
                        // the leader; otherwise, the server may override a
                        // recent change.
                        //
                        // A better solution here would be just a sequence
                        // number and we can ignore updates that don't include our
                        // most recent change request.
                        if (this.isLeader) {
                            this.roomData.region = ourRoomData.region;
                            this.roomData.autoFill = ourRoomData.autoFill;
                            // @NOTE: Don't override gameModeIdx; the server may have
                            // rejected our change due to player constraints
                        }

                        this.refreshUi();
                        break;
                    }
                case 'joinGame':
                    {
                        this.joiningGame = true;
                        this.joinGameCb(data);
                        break;
                    }
                case 'keepAlive':
                    {
                        break;
                    }
                case 'kicked':
                    {
                        this.leave('kicked');
                        break;
                    }
                case 'error':
                    {
                        this.leave(data.type);
                        break;
                    }
                default:
                    break;
            }
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage(type, data) {
            if (!this.ws) {
                return;
            }
            if (this.ws.readyState === this.ws.OPEN) {
                var msg = (0, _stringify2.default)({ type: type, data: data });
                this.ws.send(msg);
            } else {
                this.ws.close();
            }
        }
    }, {
        key: 'setRoomProperty',
        value: function setRoomProperty(prop, val) {
            if (this.isLeader && this.roomData[prop] != val) {
                this.roomData[prop] = val;
                this.sendMessage('setRoomProps', this.roomData);
            }
        }
    }, {
        key: 'buildLoadout',
        value: function buildLoadout(bodyCont, backpackCont, leftHandCont, rightHandCont, accesoryCont, container, memberLoadout) {
            var body = bodyCont;
            var leftHand = leftHandCont;
            var rightHand = rightHandCont;
            var backpack = backpackCont;
            var accessory = accesoryCont;
            accessory.empty();
            leftHand.empty();
            rightHand.empty();

            rightHand.removeClass('skin');
            leftHand.removeClass('skin');
            leftHand.css({ 'background-image': 'none' });
            rightHand.css({ 'background-image': 'none' });

            var outfit = memberLoadout.outfit;
            var outfitDef = GameObjectDefs[outfit];
            var svg = helpers.getOutfitSvg(outfit);

            var melee = memberLoadout.melee;
            var meleeDef = GameObjectDefs[melee];
            var meleeSvg = void 0;
            if (meleeDef.handSprites) {
                meleeSvg = helpers.getMeleeSvg(melee);
            }

            var bodyImg = svg.body;
            var bodyTint = outfitDef.skinImg.baseTint;
            var colBody = util.intToRgb(bodyTint);
            var imageUrl = 'url(' + bodyImg + ')';

            if (bodyTint) {
                body.load(bodyImg, function () {
                    body.find('svg').attr('viewBox', '0 0 140 140');
                    if (body.find('stop').length > 0) {
                        body.find('stop').each(function () {
                            if ($(this).css('stop-color') === 'rgb(255, 255, 255)') {
                                $(this).css('stop-color', 'rgb(' + colBody.r + ', ' + colBody.g + ', ' + colBody.b + ')');
                            }
                        });
                    } else {
                        body.find('ellipse').css('fill', 'rgb(' + colBody.r + ', ' + colBody.g + ', ' + colBody.b + ')');
                    }
                });
            } else {
                body.css({ 'background-image': imageUrl });
            }

            bodyImg = svg.hands;
            bodyTint = outfitDef.skinImg.handTint;
            var colHands = util.intToRgb(bodyTint);
            imageUrl = 'url(' + bodyImg + ')';

            if (meleeDef.handSprites) {

                rightHand.addClass('skin');
                leftHand.addClass('skin');
                leftHand.css({ 'background-image': 'url(' + meleeSvg.spriteL + ')' });
                rightHand.css({ 'background-image': 'url(' + meleeSvg.spriteR + ')' });

                if (meleeDef.flip) {
                    rightHand.css({ 'transform': 'scaleX(-1)' });
                }
            } else if (bodyTint) {
                leftHand.load(bodyImg, function () {
                    leftHand.find('svg').attr('viewBox', '0 0 80 80');
                    leftHand.find('ellipse').css('fill', 'rgb(' + colHands.r + ', ' + colHands.g + ', ' + colHands.b + ')');
                });

                rightHand.load(bodyImg, function () {
                    rightHand.find('svg').attr('viewBox', '0 0 80 80');
                    rightHand.find('ellipse').css('fill', 'rgb(' + colHands.r + ', ' + colHands.g + ', ' + colHands.b + ')');
                });
            } else {
                leftHand.css({ 'background-image': imageUrl });

                rightHand.css({ 'background-image': imageUrl });
            }

            bodyImg = svg.backpack;
            bodyTint = outfitDef.skinImg.backpackTint;
            var colBackpack = util.intToRgb(bodyTint);
            imageUrl = 'url(' + bodyImg + ')';

            if (bodyTint) {
                backpack.load(bodyImg, function () {
                    backpack.find('svg').attr('viewBox', '0 0 150 150');
                    if (backpack.find('stop').length > 0) {
                        backpack.find('stop').each(function () {
                            if ($(this).css('stop-color') === 'rgb(255, 255, 255)') {
                                $(this).css('stop-color', 'rgb(' + colBackpack.r + ', ' + colBackpack.g + ', ' + colBackpack.b + ')');
                            }
                        });
                    } else {
                        backpack.find('ellipse').css('fill', 'rgb(' + colBackpack.r + ', ' + colBackpack.g + ', ' + colBackpack.b + ')');
                    }
                });
            } else {
                backpack.css({ 'background-image': imageUrl });
            }

            if (outfitDef.accessory) {
                bodyImg = svg.accessory;
                var accessoryImg = $('<img>');
                accessoryImg.attr('src', bodyImg);
                if (outfitDef.accessory.topUI) {
                    accessoryImg.css('top', outfitDef.accessory.topUI + '%');
                }
                if (outfitDef.accessory.scaleUI) {
                    accessoryImg.css('transform', 'translate(-50%, -50%) rotate(-90deg) scale(' + outfitDef.accessory.scaleUI + ')');
                }
                accessoryImg.appendTo(accessory);
            }

            container.append(backpack);
            container.append(body);
            container.append(leftHand);
            container.append(rightHand);
            container.append(accessory);
        }
    }, {
        key: 'tryStartGame',
        value: function tryStartGame() {
            var _this3 = this;

            if (this.isLeader && !this.roomData.findingGame) {
                var version = GameConfig.protocolVersion;
                var region = this.roomData.region;
                var paramRegion = helpers.getParameterByName('region');
                if (paramRegion !== undefined && paramRegion.length > 0) {
                    region = paramRegion;
                }
                var zones = this.pingTest.getZones(region);
                var paramZone = helpers.getParameterByName('zone');
                if (paramZone !== undefined && paramZone.length > 0) {
                    zones = [paramZone];
                }

                var matchArgs = {
                    version: version,
                    region: region,
                    zones: zones
                };
                this.analytics.gameModeId = this.roomData.gameModeIdx;
                this.sendMessage('playGame', matchArgs);

                // @TODO: Potential issue here; a stale state update
                // can override findingGame
                this.roomData.findingGame = true;
                this.refreshUi();
                var that = this;

                //DRP has a 5s cooldown, so it is necessary to wait a bit
                setTimeout(function () {
                    that.account.setDiscordRP(2, _this3.roomData.gameModeIdx);
                }, 6000);
            }
        }

        // Ui display

    }, {
        key: 'refreshUi',
        value: function refreshUi() {
            var _this4 = this;

            var setButtonState = function setButtonState(el, selected, enabled) {
                el.removeClass('btn-darken btn-disabled btn-opaque btn-darkened');
                if (enabled) {
                    el.addClass('btn-darken');
                } else {
                    el.addClass('btn-disabled');
                    if (!selected) {
                        el.addClass('btn-opaque');
                    }
                }
                if (selected) {
                    el.addClass('btn-darkened');
                }
                el.prop('disabled', !enabled);
            };

            var setButtonState2 = function setButtonState2(el, selected, enabled) {
                el.prop('disabled', !enabled);
            };

            if (device.mobile) {
                $('#team-menu').removeClass('menu-column menu-block');
                $('#team-menu').addClass('modal team-menu-modal');
                $('#ad-block-right').css('display', 'none');
            }

            $('#team-menu').css('display', this.active ? 'block' : 'none');
            $('#season-pass').css('opacity', this.active ? '0.0' : '1.0');
            $('#season-pass').css('pointer-events', this.active ? 'none' : 'auto');
            $('#left-column').css('opacity', this.active ? '0.0' : '1.0');
            $('#home-section').css('opacity', this.active ? '0.0' : '1.0');
            $('#equipment-button').css('pointer-events', this.active ? 'none' : 'all');
            $('#btn-pass-locked').css('display', this.active ? 'none' : 'block');
            $('#main-play-btns').css('display', this.active ? 'none' : 'block');

            /** hide for bug on macOS */
            // $('.pass-premium-buy-btn').css('display', this.active ? 'none' : 'block');

            if (device.mobile) {
                if (this.active) {
                    $('.ad-block-leaderboard-bottom').addClass('hide-on-team');
                    $('.ad-block-left-bottom').addClass('hide-on-team');
                    $('.ad-block-med-rect').addClass('hide-on-team');
                    this.adManager.hideBannerAd();
                } else {
                    $('.ad-block-leaderboard-bottom').removeClass('hide-on-team');
                    $('.ad-block-left-bottom').removeClass('hide-on-team');
                    $('.ad-block-med-rect').removeClass('hide-on-team');
                    if (!this.account.pass.vip) {
                        this.adManager.showBannerAd();
                    }
                }
            } else {
                if (this.active) {
                    $('.ad-block-leaderboard-bottom').addClass('team-menu-central-ad');
                } else {
                    $('.ad-block-leaderboard-bottom').removeClass('team-menu-central-ad');
                }
            }

            // Error text
            var hasError = this.roomData.lastError != '';
            var errorTxt = errorTypeToString(this.roomData.lastError, this.localization);
            this.serverWarning.css('opacity', hasError ? 1.0 : 0.0);
            this.serverWarning.html(errorTxt);

            if (this.roomData.lastError == 'find_game_invalid_protocol' && !this.displayedInvalidProtocolModal) {
                $('#modal-refresh').fadeIn(200);
                this.displayedInvalidProtocolModal = true;
            }

            // Show/hide team connecting/contents
            if (this.active) {
                $('#team-menu-joining-text').css('display', this.create ? 'none' : 'block');
                $('#team-menu-creating-text').css('display', this.create ? 'block' : 'none');
                $('#team-menu-connecting').css('display', this.joined ? 'none' : 'block');
                $('#team-menu-contents').css('display', this.joined ? 'block' : 'none');
                $('#btn-team-leave').css('display', this.joined ? 'block' : 'none');
            }

            if (this.joined) {
                // Regions
                var regionPops = this.siteInfo.info.pops || {};
                var regions = (0, _keys2.default)(regionPops);
                for (var i = 0; i < regions.length; i++) {
                    var region = regions[i];
                    var count = regionPops[region];
                    var sel = $('#team-server-opts').children('option[value="' + region + '"]');
                    sel.html(sel.attr('data-label') + ' [' + count + ']');
                }

                this.serverSelect.find('option').each(function (idx, elem) {
                    elem.selected = elem.value == _this4.roomData.region;
                });

                //Modes btns
                setButtonState(this.btnChangeMode, true, this.isLeader);
                setButtonState(this.btnChangeType, true, this.isLeader);

                // Duo/Squad
                /*setButtonState(
                    this.queueMode1,
                    this.roomData.gameModeIdx == 1,
                    this.isLeader && this.roomData.enabledGameModeIdxs.indexOf(1) !== -1
                );
                setButtonState(
                    this.queueMode2,
                    this.roomData.gameModeIdx == 2,
                    this.isLeader && this.roomData.enabledGameModeIdxs.indexOf(2) !== -1
                );*/

                // Fill mode
                setButtonState2(this.fillAuto, this.roomData.autoFill, this.isLeader);
                //setButtonState(this.fillNone, !this.roomData.autoFill, this.isLeader);

                //
                this.serverSelect.prop('disabled', !this.isLeader);

                // Invite link
                if (this.roomData.roomUrl) {
                    var roomUrl = window.location.origin + '/' + this.roomData.roomUrl;
                    var roomCode = this.roomData.roomUrl.substring(1);

                    if (device.webview) {
                        $('#team-url').html(roomUrl);
                        $('#team-code').html(roomCode);
                        //$('#team-url').html(roomCode);
                    } else {
                        $('#team-url').html(roomUrl);
                        $('#team-code').html(roomCode);
                    }

                    if (window.history) {
                        window.history.replaceState('', '', this.roomData.roomUrl);
                    }
                }

                // Play button
                this.playBtn.html(this.roomData.findingGame || this.joiningGame ? '<div class="ui-spinner"></div>' : this.localization.translate(this.playBtn.data('l10n')) //this.playBtn.attr('data-label')
                );

                // Custom mode styling for the play button
                if (!this.gameModesAvailable || !this.gameModeSelected) {
                    this.gameModesAvailable = this.siteInfo.getAvailableTeamModes();
                    if (!this.gameModeSelected) {
                        this.gameModeSelected = [0, 0, this.gameModesAvailable[0].modes[0].id];
                        this.config.set('gameModeSelected', this.gameModeSelected);
                    }
                    this.updatePlayBtns();
                } else {
                    this.updatePlayBtns(false, false);
                }

                var playersInGame = false;
                for (var _i4 = 0; _i4 < this.players.length; _i4++) {
                    playersInGame |= this.players[_i4].inGame;
                }

                var waitReason = $('#msg-wait-reason');

                if (this.isLeader) {
                    waitReason.html(this.localization.translate('index-game-in-progress') + '<span> ...</span>');
                    var showWaitMessage = playersInGame && !this.joiningGame;
                    waitReason.css('display', showWaitMessage ? 'block' : 'none');
                    this.playBtn.css('display', showWaitMessage ? 'none' : 'block');
                } else {
                    if (this.roomData.findingGame || this.joiningGame) {
                        waitReason.html('<div class="ui-spinner" style="margin-right:16px"></div>' + this.localization.translate('index-joining-game') + '<span> ...</span>');
                    } else if (playersInGame) {
                        waitReason.html(this.localization.translate('index-game-in-progress') + '<span> ...</span>');
                    } else {
                        waitReason.html(this.localization.translate('index-waiting-for-leader') + '<span> ...</span>');
                    }
                    waitReason.css('display', 'block');
                    this.playBtn.css('display', 'none');
                }

                // Player properties
                var teamMembers = $('#team-menu-member-list');
                var boostIdicator = $('#team-boost');
                var boostBar = $('#xp-boost-bar');
                boostBar.css('width', 0 + '%');
                var xpMultipliers = generalUseDefs['squad_boost'].xpMult;
                teamMembers.empty();
                for (var _i5 = 0; _i5 < this.roomData.maxPlayers; _i5++) {
                    var playerStatus = {
                        name: '',
                        playerId: 0,
                        isLeader: false,
                        inGame: false,
                        loadout: null,
                        self: false
                    };
                    if (_i5 < this.players.length) {
                        var player = this.players[_i5];
                        playerStatus = {
                            name: player.name,
                            playerId: player.playerId,
                            isLeader: player.isLeader,
                            inGame: player.inGame,
                            loadout: player.loadout,
                            self: player.playerId == this.localPlayerId
                        };
                    }

                    var member = $('<div/>', {
                        'class': 'team-menu-member'
                    });

                    // Left-side icon
                    var iconClass = '';
                    if (playerStatus.isLeader) {
                        iconClass = ' icon-leader';
                    } else if (this.isLeader && playerStatus.playerId != 0) {
                        iconClass = ' icon-kick';
                    }
                    member.append($('<div/>', {
                        'class': 'icon' + iconClass,
                        'data-playerid': playerStatus.playerId
                    }));

                    // Name
                    var nameClass = 'name-text';
                    if (playerStatus.self) {
                        nameClass += ' name-self';
                        if (playerStatus.isLeader && !playerStatus.inGame) {
                            var teamURL = window.location.origin + '/' + this.roomData.roomUrl;
                            this.account.setDiscordRP(3, this.roomData.gameModeIdx, this.players.length, this.roomData.maxPlayers, teamURL);
                        } else if (!playerStatus.inGame) {
                            this.account.setDiscordRP(4, this.roomData.gameModeIdx, this.players.length, this.roomData.maxPlayers);
                        }
                    }
                    if (playerStatus.inGame) {
                        nameClass += ' name-in-game';
                    }
                    //let playerName = playerStatus.name.length == 0 ? 'INVITE SQUADMATE' : playerStatus.name;
                    var nameDiv = $('<div/>', {
                        'class': 'name menu-option ' + nameClass,
                        'html': helpers.htmlEscape(playerStatus.name)
                    });

                    var xpDiv = $('<div/>', {
                        'class': 'member-boost-value',
                        'html': helpers.htmlEscape('+' + xpMultipliers[_i5] + '% XP')
                    });

                    var namePlaceHolder = $('<div/>', {
                        'class': 'member-name-placeholder',
                        'html': helpers.htmlEscape('INVITE SQUADMATE')
                    });

                    //Loadout display for each player
                    var mainLoadoutDiv = $("<div id='animated-loadout' class='animated-loadout team-loadout'></div>");
                    var loadoutDiv = $("<div class='character-container'></div></div>");
                    var backpackDiv = $("<div class='character-backpack'></div>");
                    var bodyDiv = $("<div class='character-body'></div>");
                    var leftHandDiv = $("<div class='character-left-hand'></div>");
                    var rightHandDiv = $("<div class='character-right-hand'></div>");
                    var accesoryDiv = $("<div class='character-accessory'></div>");

                    // Right-side icon
                    member.append($('<div/>', {
                        'class': 'icon ' + (playerStatus.inGame ? 'icon-in-game' : '')
                    }));
                    if (playerStatus.name.length == 0) {
                        member.append(namePlaceHolder);
                        member.append(xpDiv);
                    } else {
                        this.buildLoadout(bodyDiv, backpackDiv, leftHandDiv, rightHandDiv, accesoryDiv, loadoutDiv, playerStatus.loadout);
                        mainLoadoutDiv.append(loadoutDiv);
                        member.append(mainLoadoutDiv);
                        boostIdicator.text(xpMultipliers[_i5] + '%');
                        boostBar.css('width', xpMultipliers[_i5] * 2 + '%');
                    }

                    member.append(nameDiv);

                    teamMembers.append(member);
                }

                $('.icon-kick', teamMembers).click(function (e) {
                    var playerId = $(e.currentTarget).attr('data-playerid');
                    _this4.sendMessage('kick', { playerId: playerId });
                });

                // Play a sound if player count has increased
                var localPlayer = this.players.find(function (x) {
                    return x.playerId == _this4.localPlayerId;
                });
                var playJoinSound = localPlayer && !localPlayer.inGame;
                if (!document.hasFocus() && this.prevPlayerCount < this.players.length && this.players.length > 1 && playJoinSound) {
                    this.audioManager.playSound('notification_join_01', {
                        channel: "ui"
                    });
                }
                this.prevPlayerCount = this.players.length;
            }
        }
    }]);
    return TeamMenu;
}();

module.exports = TeamMenu;
