"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var $ = require("./jquery.js");
var PIXI = require("./pixi.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var GameInput = GameConfig.Input;
var Action = GameConfig.Action;
var GasMode = GameConfig.GasMode;
var net = require("./net.js");
var v2 = require("./v2.js");
var math = require("./math.js");
var util = require("./util.js");
var device = require("./device.js");
var FirebaseManager = require("./FirebaseManager.js");

var _require = require("./gas.js"),
    GasRenderer = _require.GasRenderer,
    GasSafeZoneRenderer = _require.GasSafeZoneRenderer;

var helpers = require("./helpers.js");
var InputBinds = require("./inputBinds.js");
var MapIndicator = require("./mapIndicator.js");
var MapSprite = require("./mapSprite.js");
var Particles = require("./particles.js");
var PieTimer = require("./pieTimer.js");
var shot = require("./shot.js");
var BattleResult = require("./battleResult.js");
var GearDefs = require("./gearDefs.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var PingDefs = require("./pingDefs.js");
var RoleDefs = require("./roleDefs.js");
var QuestDefs = require("./questDefs.js").kQuestDefs;

var _require2 = require("./35dbdceb.js"),
    getGearItems = _require2.getGearItems;

var _require3 = require("./35dbdceb.js"),
    getUniqueGearPerks = _require3.getUniqueGearPerks,
    getPerkText = _require3.getPerkText;

function humanizeTime(time) {
    var hours = Math.floor(time / (60 * 60));
    var minutes = Math.floor(time / 60) % 60;
    var seconds = Math.floor(time) % 60;
    var timeText = '';
    if (hours > 0) {
        timeText += hours + 'h ';
    }
    if (hours > 0 || minutes > 0) {
        timeText += minutes + 'm ';
    }
    timeText += seconds + 's';
    return timeText;
}

//
// m_UiManager
//
/**
 * 
 * @param {*} game 
 * @param {*} audioManager 
 * @param {*} particleBarn 
 * @param {*} planeBarn 
 * @param {*} localization 
 * @param {*} canvasMode 
 * @param {*} touch 
 * @param {*} inputBinds 
 * @param {*} inputBindUi 
 * @param {import('./ads').AdManager} adManager 
 * @param {*} opponentMenu 
 * @param {*} analytics 
 * @param {*} account 
 * @param {*} ui2Manager 
 */
function m_UiManager(game, audioManager, particleBarn, planeBarn, localization, canvasMode, touch, inputBinds, inputBindUi, adManager, opponentMenu, analytics, account, ui2Manager) {
    var _this = this;

    var that = this;

    this.game = game;
    this.quests = this.game.pass.getCurrentQuests();
    this.particleBarn = particleBarn;
    this.localization = localization;
    this.touch = touch;
    this.inputBinds = inputBinds;
    this.inputBindUi = inputBindUi;
    this.adManager = adManager;
    this.m_pieTimer = new PieTimer.m_PieTimer();
    this.playerId = null;
    this.battleResult = new BattleResult();
    this.opponentMenu = opponentMenu;
    this.analytics = analytics;
    this.account = account;
    this.ui2Manager = ui2Manager;

    this.gameElem = $('#ui-game');

    this.statsMain = $('#ui-stats');
    this.statsElem = $('#ui-stats-bg');
    this.statsContentsContainer = $('#ui-stats-contents');
    this.statsContents = $('#ui-stats-contents-inner');
    this.statsHeader = $('#ui-stats-header');
    this.statsInfoBox = $('#ui-stats-info-box');
    this.statsOptions = $('#ui-stats-options');
    this.statsAds = document.querySelectorAll('.ui-stats-ad-container');
    this.escMenuElem = $('#ui-game-menu');
    this.escMenuDisplayed = false;

    this.roleMenuElemWrapper = $('#ui-role-menu-wrapper');
    this.roleMenuElem = $('#ui-role-menu');
    this.roleMenuFooterEnterElem = $('#ui-role-footer-enter');
    this.roleMenuFooterHtml = '';
    this.roleMenuActive = false;
    this.roleMenuDisplayed = false;
    this.roleMenuTicker = 0.0;
    this.roleDisplayed = '';
    this.roleSelected = '';

    this.roleMenuConfirm = $('#ui-role-footer-enter');
    this.roleMenuConfirm.on('click', function (event) {
        event.stopPropagation();
        that.roleSelected = that.roleDisplayed;
        that.setRoleMenuActive(false);
    });
    this.roleMenuInst = null;

    this.topLeft = device.mobile ? $('#ui-top-left-2') : $('#ui-top-left');

    this.waitingForPlayers = true;
    this.waitingText = $('#ui-waiting-text');

    this.spectating = false;
    this.prevSpectatorCount = 0;
    this.spectatorCount = 0;
    this.spectatorCounterDisplayed = false;
    this.spectatePrestigeUpdated = [];
    this.spectatorCounterContainer = $('#ui-spec-counter');
    this.spectatorCounter = $('#ui-spec-counter-number');
    this.spectateMode = $('.ui-spectate-mode');
    this.spectatedPlayerText = device.mobile ? $('#ui-spectate-text-mobile') : $('#ui-spectate-text');
    this.prestigeSpectate = device.mobile ? $('#ui-spectate-prestige-mobile') : $('#ui-spectate-prestige');
    this.btnEndorseOption = device.mobile ? $('#btn-endorse-option-mobile') : $('#btn-endorse-option');
    this.btnReportOption = device.mobile ? $('#btn-report-option-mobile') : $('#btn-report-option');
    this.btnEndorseOptionPoints = $('.btn-endorse-option-points');
    this.btnReportOptionPoints = $('.btn-report-option-points');
    this.btnReportConfirmation = $('#btn-confirm-report');
    this.confirmationReportModal = $('#modal-report-confirmation');
    this.spectatedPlayerName = '';
    this.spectatedPlayerId = 0;
    this.spectateModeStats = $('#ui-spectate-stats');
    this.spectateModeStatsData = $('#ui-spectate-stats-data');
    this.spectateOptionsWrapper = $('#ui-spectate-options-wrapper');
    this.specId = 0;
    this.scrollingOnBattleResults = false;

    this.rightCenter = $('#ui-right-center');

    this.leaderboardAlive = $('#ui-leaderboard-alive');
    this.playersAlive = $('.js-ui-players-alive');
    this.leaderboardAliveFaction = $('#ui-leaderboard-alive-faction');
    this.playersAliveRed = $('.js-ui-players-alive-red');
    this.playersAliveBlue = $('.js-ui-players-alive-blue');
    this.playersAliveRedCounter = 0;
    this.playersAliveBlueCounter = 0;
    this.playerKills = $('.js-ui-player-kills');
    this.announcement = $('#ui-announcement');
    this.playerDisconnectedAnnouncement = $('#ui-announcement-2');

    this.killLeaderName = device.mobile ? $('#ui-mobile-kill-leader-name') : $('#ui-kill-leader-name');
    this.killLeaderCount = device.mobile ? $('#ui-mobile-kill-leader-count') : $('#ui-kill-leader-count');

    this.mapContainer = $('#ui-map-container');
    this.mapContainerBottom = 205;
    this.mapInfo = $('#ui-map-info');
    this.mapInfoBottom = 218;

    this.gasState = {};
    this.gasIcon = $('#ui-gas-icon');
    this.gasTimer = device.mobile ? $('#ui-gas-timer-mobile') : $('#ui-gas-timer');
    this.gasTimerStr = '';
    this.mapMinimizeButton = $('#ui-map-minimize');
    this.menuDisplayButton = $('#ui-menu-display');

    this.bottomCenterRight = $('#ui-bottom-center-right');

    $('#ui-map-wrapper').css('display', 'block');
    $('#ui-team').css('display', 'block');

    this.actionSeq = -1;

    this.displayMapDirty = false;
    this.displayMapClear = false;
    this.updateGearMapInfo = true;

    $('.ui-map-expand').on('mousedown', function (event) {
        event.stopPropagation();
    });
    $('.ui-map-expand').on('click', function (event) {
        if (device.touch) {
            if (!_this.bigmapDisplayed) {
                _this.displayMapLarge();
            }
        } else if (device.uiLayout == device.UiLayout.Lg) {
            _this.displayMapLarge(_this.bigmapDisplayed);
        }
    });
    $('#ui-map-minimize').on('mousedown', function (event) {
        event.stopPropagation();
    });
    $('#ui-map-minimize').on('click', function (event) {
        event.stopPropagation();
        _this.toggleMiniMap();
    });

    $('#ui-menu-display').on('click', function (event) {
        event.stopPropagation();
        _this.toggleEscMenu();
    });

    $('#modal-report-confirmation .close-corner, #btn-cancel-report, #btn-confirm-report').click(function () {
        $('#modal-report-confirmation').hide();
        return false;
    });

    this.bigmap = $('#big-map');
    this.bigmapCollision = $('#big-map-collision');

    this.moveStyleButton = $('#btn-game-move-style');
    this.moveStyleButton.on('touchstart', function () {
        touch.toggleMoveStyle();
    });

    this.aimStyleButton = $('#btn-game-aim-style');
    this.aimStyleButton.on('touchstart', function () {
        touch.toggleAimStyle();
    });

    this.aimLineButton = $('#btn-game-aim-line');
    this.aimLineButton.on('touchstart', function () {
        touch.toggleAimLine();
    });

    this.onTouchScreen = function (event) {
        // Tapping outside the esc menu will close it
        if (event.target.id == 'cvs') {
            _this.toggleEscMenu(true);
        }
    };
    $(document).on('touchstart', this.onTouchScreen);

    this.bigmapClose = $('#big-map-close');
    this.bigmapClose.on('touchend', function (event) {
        event.stopPropagation();
        _this.displayMapLarge(true);
    });
    this.bigmapClose.on('mousedown', function (event) {
        event.stopPropagation();
    });
    this.bigmapClose.on('click', function (event) {
        event.stopPropagation();
        _this.displayMapLarge(true);
        if (!device.mobile) {
            $('#ui-map-expand-desktop').css('display', 'block');
        }
    });

    // In-game menu
    this.gameTabs = $('.ui-game-tab');
    this.gameTabBtns = $('.btn-game-tab-select');
    this.gameKeybindBtns = $('.btn-keybind-desc');
    this.currentGameTab = 'settings';

    this.gameTabBtns.on('click', function (e) {
        _this.setCurrentGameTab($(e.target).data('tab'));
    });
    this.setCurrentGameTab(this.currentGameTab);

    this.fullScreenButton = $('#btn-game-fullscreen');
    this.fullScreenButton.on('mousedown', function (e) {
        e.stopPropagation();
    });
    this.fullScreenButton.on('click', function () {
        helpers.toggleFullScreen();
        _this.toggleEscMenu();
    });
    // Display full screen
    {
        var showFullScreen = device.os == 'ios' ? 'none' : 'block';
        if (device.webview || device.touch) {
            showFullScreen = 'none';
        }
        $('#btn-game-fullscreen').css('display', showFullScreen);
    }

    this.resumeButton = $('.btn-game-resume');
    this.resumeButton.on('mousedown', function (e) {
        e.stopPropagation();
    });
    this.resumeButton.on('click', function () {
        _this.toggleEscMenu();
    });
    if (device.touch) {
        this.resumeButton.css('display', 'none');
    }

    $('#btn-spectate-quit').on('click', function () {
        _this.quitGame();
    });
    $('#btn-game-quit').on('mousedown', function (e) {
        e.stopPropagation();
    });
    $('#btn-game-quit').on('click', function () {
        _this.game.updatePass = true;
        _this.game.updatePassDelay = 1.0;

        _this.quitGame();
    });

    this.specStatsButton = $('#btn-spectate-view-stats');
    this.specStatsButton.on('click', function () {
        _this.unHideStats();
        //this.toggleLocalStats();
    });

    this.specBegin = false;
    this.specNext = false;
    this.specPrev = false;

    this.specNextButton = $('#btn-spectate-next-player');
    this.specNextButton.on('click', function () {
        _this.specNext = true;
    });

    this.specPrevButton = $('#btn-spectate-prev-player');
    this.specPrevButton.on('click', function () {
        _this.specPrev = true;
    });

    // Touch specific buttons //@TODO: Refactor Mobile
    this.interactionElems = !device.mobile ? $('#ui-interaction-press, #ui-interaction') : $('#ui-interaction-press-mobile, #ui-interaction');
    this.interactionTouched = false;
    this.interactionElems.css('pointer-events', 'auto');
    this.interactionElems.on('touchstart', function (event) {
        event.stopPropagation();
        _this.interactionTouched = true;
    });

    this.reloadElems = $('#ui-current-clip, #ui-remaining-ammo, #ui-reload-button-container');
    this.reloadTouched = false;
    this.reloadElems.css('pointer-events', 'auto');
    this.reloadElems.on('touchstart', function (event) {
        event.stopPropagation();
        _this.reloadTouched = true;
    });

    // Faction flair display
    this.flairElems = $('.ui-health-flair');
    this.flairId = 0;

    // Health bar values
    this.healthRed = new Color(255, 0, 0);
    this.healthDarkpink = new Color(255, 45, 45);
    this.healthLightpink = new Color(255, 112, 112);
    this.healthWhite = new Color(255, 255, 255);
    this.healthGrey = new Color(179, 179, 179);

    // Store minimap hidden
    this.minimapDisplayed = true;

    // Store UI visiblity mode
    this.visibilityMode = 0;
    this.hudVisible = true;

    this.gasRenderer = new GasRenderer(canvasMode, 0x000000);
    this.gasSafeZoneRenderer = new GasSafeZoneRenderer();

    this.sentAdStatus = false;
    this.frame = 0;

    // Weapon drag and drop
    this.weapsDirty = false;

    var pushAction = function pushAction(itemAction) {
        that.ui2Manager.uiEvents.push({
            action: itemAction.action,
            type: itemAction.type,
            data: itemAction.data
        });
    };
    //Item drag and drop
    this.itemDraggedDiv = null;
    this.itemDragging = false;
    this.itemDropped = false;
    this.itemTooltip = false;
    this.resetItemSlotStyling = function () {
        if (that.itemDraggedDiv) {
            that.itemDraggedDiv.css({
                left: '',
                top: ''
            });
            $('#ui-game').css({
                'pointer-events': ''
            });
        }

        if (that.itemDraggedDiv.hasClass('ui-weapon-dragged')) {
            that.itemDraggedDiv.removeClass('ui-weapon-dragged');
        }

        that.itemDraggedDiv = null;
        that.itemDragging = false;
        that.itemDropped = false;
    };

    if (!device.touch) {
        $('#ui-skill-1, #ui-skill-2, #ui-skill-3 ').on('mousemove', function (ev) {});

        var _localization = this.localization;

        $("#ui-skill-1, #ui-skill-2, #ui-skill-3 ").on('mouseenter', function () {

            var id = $(this).attr('data-id');

            if (typeof id !== 'undefined' && id !== false) {
                var skillName = _localization.translate('game-hud-' + id);
                var skillDesc = _localization.translate('game-hud-' + id + '-description');
                var skillTooltip = $('#ui-skill-tooltip');
                var itemTooltip = $('#ui-item-tooltip');
                var skillTooltipName = $('#ui-skill-tooltip-name');
                var skillTooltipDesc = $('#ui-skill-tooltip-desc');

                skillTooltipName.html(skillName);
                skillTooltipDesc.html(skillDesc);

                skillTooltip.css({
                    top: $(this).offset().top - skillTooltip.outerHeight() - 10 + 'px',
                    left: $(this).offset().left - (skillTooltip.outerWidth() - $(this).outerWidth()) / 2 + 'px'
                });

                skillTooltip.show();
            }
        });

        $("#ui-skill-1, #ui-skill-2, #ui-skill-3 ").on('mouseleave', function () {
            $('#ui-skill-tooltip').hide();
        });

        $(".ui-pickup-item").on('mouseenter', function () {

            var id = $(this).attr('data-id');

            if (id && typeof id !== 'undefined') {
                var itemName = _localization.translate('game-' + id);
                var itemDesc = ui2Manager.getInteractionEffect(2, { type: id });
                var itemStats = ui2Manager.getInteractionStat(2, { type: id });
                var itemTooltip = $('#ui-item-tooltip');
                var itemTooltipName = $('#ui-item-tooltip-name');
                var itemTooltipDesc = $('#ui-item-tooltip-desc');
                var itemTooltipStat = $('#ui-item-tooltip-stats');

                itemTooltipName.html(itemName);
                itemTooltipDesc.html(itemDesc.txt);
                itemTooltipStat.html(itemStats);

                itemTooltip.css({
                    top: $(this).offset().top - (itemTooltip.outerHeight() - $(this).outerHeight()) / 2 + 'px',
                    left: $(this).offset().left - itemTooltip.outerWidth() - 15 + 'px'
                });

                itemTooltip.show();
            }
        });
        $(".ui-pickup-item").on('mouseleave', function () {
            $('#ui-item-tooltip').hide();
        });

        $('#ui-pickup-icon-container-1, #ui-pickup-icon-container-2, #ui-pickup-icon-container-3, #ui-pickup-icon-container-4, #ui-pickup-icon-container-5, #ui-pickup-icon-container-6, #ui-pickup-icon-container-7 ').on('mousedown', function (ev) {
            if (ev.button == 0) {
                ev.stopPropagation();
                //if(!$(this).parent().parent().hasClass('selected')){
                that.itemDraggedDiv = $(this);
                //}
            }
        });

        $('#ui-game').on('mousemove', function (ev) {
            // Change styling of non-swappable slots
            /*if(that.itemDraggedDiv.parent().parent().hasClass('selected')){
                that.itemDraggedDiv = null;
            }*/
            if (that.itemDragging) {
                var positions = { 'ui-pickup-icon-container-1': 5,
                    'ui-pickup-icon-container-2': 80,
                    'ui-pickup-icon-container-3': 155,
                    'ui-pickup-icon-container-4': 230,
                    'ui-pickup-icon-container-5': 305,
                    'ui-pickup-icon-container-6': 380,
                    'ui-pickup-icon-container-7': 455 };
                var offset = positions[that.itemDraggedDiv.attr('id')];
                var top = that.itemDraggedDiv.parent().offset().top;
                var left = that.itemDraggedDiv.parent().offset().left;
                that.itemDraggedDiv.css({
                    left: ev.pageX - left,
                    top: ev.pageY - top - 10
                });
                that.itemDraggedDiv.addClass('ui-weapon-dragged');
            } else if (that.itemDraggedDiv) {
                $('#ui-game').css({
                    'pointer-events': 'initial'
                });
                that.itemDragging = true;
            }
        });

        $('#ui-game, #ui-slots-inventory-container').on('mouseup', function (ev) {

            if (ev.button == 0 && that.itemDraggedDiv != null) {
                ev.stopPropagation();
                if ($(this).attr('id') != 'ui-slots-inventory-container') {
                    var itemAction = {
                        action: 'drop',
                        type: 'loot',
                        data: that.itemDraggedDiv.attr('data').toString() || null
                    };
                    var imgDiv = that.itemDraggedDiv.find('.ui-pickup-icon');
                    if (imgDiv.attr('data')) {
                        pushAction(itemAction); //Drop item
                        that.itemDropped = true;
                    }

                    ui2Manager.updateSlotItemTemp(itemAction.data);
                }
                that.resetItemSlotStyling();
            }
        });
    } else {
        //TODO touch
        $('#ui-pickup-icon-container-1, #ui-pickup-icon-container-2, #ui-pickup-icon-container-3, #ui-pickup-icon-container-4, #ui-pickup-icon-container-5, #ui-pickup-icon-container-6, #ui-pickup-icon-container-7').on('touchstart', function (ev) {
            if (ev.changedTouches.length > 0) {
                ev.stopPropagation();
                //if(!$(this).parent().parent().hasClass('selected')){
                that.itemDraggedDiv = $(this).firstC;
                //}
            }
        });

        $('#ui-game').on('touchmove', function (ev) {
            // Change styling of non-swappable slots
            /*if(that.itemDraggedDiv.parent().parent().hasClass('selected')){
                that.itemDraggedDiv = null;
            }*/
            if (that.itemDragging) {
                that.itemDraggedDiv.css({
                    left: ev.touches[0].pageX - 10,
                    top: ev.touches[0].pageY //- 870,
                });
                that.itemDraggedDiv.addClass('ui-weapon-dragged');
            } else if (that.itemDraggedDiv) {
                $('#ui-game').css({
                    'pointer-events': 'initial'
                });
                that.itemDragging = true;
            }
        });

        $('#ui-game, #ui-slots-inventory-container').on('touchend', function (ev) {
            ev.stopPropagation();
            if (that.itemDraggedDiv != null) {
                if (that.itemDragging) {
                    var itemAction = {
                        action: 'drop',
                        type: 'loot',
                        data: that.itemDraggedDiv.attr('data').toString() || null
                    };
                    var imgDiv = that.itemDraggedDiv.find('.ui-pickup-icon');
                    if (imgDiv.attr('data')) {
                        pushAction(itemAction); //Drop item
                        that.itemDropped = true;
                    }

                    /* const slotButton = this.dom.slotButtons[i];
                        const slotContainer = domElemById(`ui-pickup-${slotButton.slot}`);
                         if (slots[i]) {
                            slotContainer.style.display = 'block';
                            this.updateSlotItem(slots[i], slotButton.slot);
                        } else {
                            slotContainer.style.display = 'none';
                        } */
                }
                that.resetItemSlotStyling();
            }
        });
    }

    this.mapSpriteBarn = new MapSprite.MapSpriteBarn();
    this.m_mapIndicatorBarn = new MapIndicator.m_MapIndicatorBarn(this.mapSpriteBarn);
    this.playerMapSprites = [];
    this.playerPingSprites = {};

    // Pixi
    this.container = new PIXI.Container();
    this.container.mask = new PIXI.Graphics();

    this.display = {
        gas: this.gasRenderer.display,
        gasSafeZone: this.gasSafeZoneRenderer.display,
        airstrikeZones: planeBarn.airstrikeZoneContainer,
        mapSprites: this.mapSpriteBarn.container,
        teammates: new PIXI.Container(),
        player: new PIXI.Container(),
        border: new PIXI.Graphics()
    };

    this.mapSprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.mapSprite.anchor = new PIXI.Point(0.5, 0.5);

    this.container.addChild(this.mapSprite);
    this.container.addChild(this.display.gas);
    this.container.addChild(this.display.gasSafeZone);
    this.container.addChild(this.display.airstrikeZones);
    this.container.addChild(this.display.mapSprites);
    this.container.addChild(this.display.teammates);
    this.container.addChild(this.display.player);
    this.container.addChild(this.display.border);

    // Map values
    this.bigmapDisplayed = false;
    this.screenScaleFactor = 1.0;

    var minimapMargin = this.getMinimapMargin();
    var minimapSize = this.getMinimapSize();
    this.minimapPos = v2.create(minimapMargin + minimapSize / 2, game.m_camera.screenHeight - minimapSize / 2 - minimapMargin);
    this.minimapPos.y = 133.125;

    this.dead = false;

    // Audio
    this.audioManager = audioManager;
    this.muteButton = $('#ui-mute-ingame');
    this.muteButtonImage = this.muteButton.find('img');
    this.muteOffImg = 'audio-off.img';
    this.muteOnImg = 'audio-on.img';

    var muteAudio = this.audioManager.mute;
    this.muteButtonImage.attr('src', muteAudio ? this.muteOffImg : this.muteOnImg);
    this.muteButton.on('mousedown', function (event) {
        event.stopPropagation();
    });
    this.muteButton.on('click', function (event) {
        var muteAudio = _this.audioManager.muteToggle();
        _this.muteButtonImage.attr('src', muteAudio ? _this.muteOffImg : _this.muteOnImg);
        muteAudio = null;
    });

    this.displayingStats = false;

    this.teamMemberHealthBarWidth = parseInt($('.ui-team-member-health').find('.ui-bar-inner').css('width'));
    this.teamMemberHeight = 48;
    this.groupPlayerCount = 0;

    this.teamSelectors = [];
    for (var i = 0; i < 4; i++) {
        var parent = this.topLeft;
        var slotIdx = i;

        this.teamSelectors.push({
            teamNameHtml: '',
            groupId: $(parent).find('[data-id=' + slotIdx + ']'),
            groupIdDisplayed: false,
            teamName: $(parent).find('[data-id=' + slotIdx + ']').find('.ui-team-member-name'),
            teamIcon: $(parent).find('[data-id=' + slotIdx + ']').find('.ui-team-member-icon'),
            teamStatus: $(parent).find('[data-id=' + slotIdx + ']').find('.ui-team-member-status'),
            teamHealthPreview: $(parent).find('[data-id=' + slotIdx + ']').find('.ui-health-preview'),
            teamHealthInner: $(parent).find('[data-id=' + slotIdx + ']').find('.ui-health-actual'),
            teamColor: $(parent).find('[data-id=' + slotIdx + ']').find('.ui-team-member-color'),
            playerId: 0,
            prevHealth: 0,
            prevStatus: {
                disconnected: false,
                dead: false,
                downed: false,
                role: ''
            },
            indicators: {
                'main': {
                    elem: $('#ui-team-indicators').find('.ui-indicator-main' + ('[data-id=' + slotIdx + ']')),
                    displayed: false
                }
            }
        });
    }

    this.displayOldMapSprites = false;
    this.questMarkers = [];

    this.m_init();
}

m_UiManager.prototype = {
    m_free: function m_free() {
        this.gasRenderer.free();

        this.clearUI();

        this.roleMenuConfirm.off('click');
        $('.ui-role-option').off('click');
        $('.ui-map-expand').off('mousedown');
        $('.ui-map-expand').off('click');
        $('#ui-map-minimize').off('mousedown');
        $('#ui-map-minimize').off('click');
        $('#ui-menu-display').off('click');
        this.moveStyleButton.off('touchstart');
        this.aimStyleButton.off('touchstart');
        this.aimLineButton.off('touchstart');
        $(document).off('touchstart', this.onTouchScreen);
        this.bigmapClose.off('touchend');
        this.bigmapClose.off('mousedown');
        this.bigmapClose.off('click');
        this.gameTabBtns.off('click');
        this.fullScreenButton.off('mousedown');
        this.fullScreenButton.off('click');
        this.resumeButton.off('mousedown');
        this.resumeButton.off('click');
        $('#btn-spectate-quit').off('click');
        $('#btn-game-quit').off('mousedown');
        $('#btn-game-quit').off('click');
        this.specStatsButton.off('click');
        this.specNextButton.off('click');
        this.specPrevButton.off('click');
        this.interactionElems.off('touchstart');
        this.reloadElems.off('touchstart');
        $('#ui-game').off('mousemove');
        $('#ui-game').off('mouseup');
        this.muteButton.off('mousedown');
        this.muteButton.off('click');

        // Reset team member health bar widths
        $('.ui-team-member-health').find('.ui-bar-inner').css('width', this.teamMemberHealthBarWidth);

        $('#ui-center').off('mouseenter mouseleave');
        this.inputBinds.menuHovered = false;

        if (!this.hudVisible) {
            this.cycleHud();
        }

        this.m_pieTimer.destroy();
        this.clearStatsElems();
        this.setRoleMenuActive(false);

        this.m_init();
    },

    m_init: function m_init() {
        $('.js-ui-map-hidden').css('display', 'block');
        $('.js-ui-map-hidden-bottom').css('display', 'flex');
        if (device.mobile && device.screenWidth <= 1024) {
            $('.js-ui-map-hidden-mobile').css('display', 'flex');
        }
        $('#ui-map-counter-default').css('display', 'inline-block');
        $('#ui-map-counter-faction').css('display', 'none');
        this.flairElems.css('display', 'none');
        this.clearStatsElems();
        this.setSpectating(false);
        this.updateSpectatorCountDisplay(true);
        this.dead = false;

        // Reset team selector colors
        for (var i = 0; i < this.teamSelectors.length; i++) {
            var teamSelector = this.teamSelectors[i];
            teamSelector.teamColor.removeAttr('style');
        }
    },

    onMapLoad: function onMapLoad(map, camera) {
        this.resize(map, camera);

        var displayLeader = map.getMapDef().gameMode.killLeaderEnabled;
        $('#ui-kill-leader-container').css('display', displayLeader ? 'block' : 'none');
        if (!device.mobile || device.screenWidth > 1060) {
            //$('#ui-killfeed-wrapper').css('top', displayLeader ? '60px' : '12px');
        }
        $('#ui-loot-flask').css('display', map.snowMode ? 'block' : 'none');
        $('#ui-loot-chocolateBox').css('display', map.valentineMode ? 'block' : 'none');
        $('#ui-loot-soda').css('display', !map.valentineMode ? 'block' : 'none');
        $('#ui-loot-bottle').css('display', map.saintPatrickMode ? 'block' : 'none');
        $('#ui-loot-gunchilada').css('display', map.cincoMode ? 'block' : 'none');
        $('#ui-loot-pulseBox').css('display', map.mayMode ? 'block' : 'none');
        $('#ui-loot-watermelon').css('display', map.beachMode ? 'block' : 'none');
        $('#ui-loot-nitroLace').css('display', map.infernoMode ? 'block' : 'none');

        if (map.cincoMode || map.mayMode || map.beachMode || map.saintPatrickMode || map.snowMode || map.valentineMode || map.infernoMode) {
            $('#ui-loot-event-item').css('display', 'none');
        } else {
            $('#ui-loot-event-item').css('display', 'block');
        }
    },

    m_update: function m_update(dt, player, map, gas, lootBarn, playerBarn, camera, teamMode, factionMode) {
        var localPlayer = player;

        this.weapsDirty = false;

        if (!this.teamMode || this.teamMode != teamMode) this.teamMode = teamMode;

        this.m_mapIndicatorBarn.m_updateIndicatorPulses(dt);

        // Gas timer display
        var timeLeft = math.max(Math.floor(gas.duration * (1.0 - gas.circleT)), 0);
        var gasState = {
            mode: gas.mode,
            time: timeLeft
        };
        if (this.gasState.mode != gasState.mode || this.gasState.time != gasState.time) {
            this.gasState = gasState;

            var gasMoving = this.gasState.mode == GasMode.Moving;
            this.mapInfo.removeClass('icon-pulse');
            this.gasIcon.removeClass('gas-icon');
            this.gasIcon.removeClass('danger-icon');

            if (gasMoving) {
                this.mapInfo.addClass('icon-pulse');
            }
            this.gasIcon.addClass(gasMoving ? 'danger-icon' : 'gas-icon');

            var minutes = Math.floor(this.gasState.time / 60.0);
            var seconds = this.gasState.time % 60;
            var strSeconds = ('0' + seconds).slice(-2);
            this.gasTimerStr = minutes + ':' + strSeconds;
            this.gasTimer.html(this.gasTimerStr);
        }

        // Spectator count display
        this.spectatorCount = player.m_localData.m_spectatorCount;
        this.updateSpectatorCountDisplay(false);

        if (player.m_netData.m_dead && !this.dead) {
            this.dead = true;
            this.m_pieTimer.stop();
        }

        if (this.updateGearMapInfo) {
            this.updateGearInfo(player, playerBarn);
        }

        this.playerDisconnectedAnnouncement.css('display', this.spectating && player.m_netData.m_disconnected ? 'block' : 'none');

        // Action pie timer
        if (this.actionSeq != player.action.seq) {
            this.actionSeq = player.action.seq;

            this.m_pieTimer.stop();

            if (player.action.type != Action.None && !this.displayingStats) {
                var desc = '';
                var actionTxt1 = "";
                var actionTxt2 = "";

                switch (player.action.type) {
                    case Action.Reload: /* Fall-through */
                    case Action.ReloadAlt:
                        {
                            var actionItemDef = GameObjectDefs[player.action.item];
                            if (actionItemDef) {
                                actionTxt1 = this.localization.translate('game-reloading');
                            }
                            break;
                        }
                    case Action.UseItem:
                        {
                            var _actionItemDef = GameObjectDefs[player.action.item];
                            if (_actionItemDef) {
                                actionTxt1 = this.localization.translate('game-using');
                                actionTxt2 = this.localization.translate('game-' + player.action.item);
                            }
                            break;
                        }
                    case Action.Revive:
                        {
                            var targetName = playerBarn.m_getPlayerInfo(player.action.targetId).name;
                            actionTxt1 = this.localization.translate('game-reviving');
                            actionTxt2 = localPlayer.downed ? '' : targetName;
                            break;
                        }
                    default:
                        break;
                }

                if (actionTxt1 != '' || actionTxt2 != '') {
                    // Change subject/verb/object order
                    if (this.localization.translate('word-order') == 'svo') {
                        desc += actionTxt1 ? actionTxt1 : '';
                        desc += actionTxt2 ? ' ' + actionTxt2 : '';
                    } else if (this.localization.translate('word-order') == 'sov') {
                        desc += actionTxt2 ? actionTxt2 + ' ' : '';
                        desc += actionTxt1 ? ' ' + actionTxt1 : '';
                    }

                    this.m_pieTimer.start(desc, player.action.time, player.action.duration, true);
                }
            }
        }

        if (!this.bigmapDisplayed) {
            this.mapSprite.x = this.minimapPos.x + this.mapSprite.width / 2 - player.pos.x / map.width * this.mapSprite.width;
            this.mapSprite.y = this.minimapPos.y - this.mapSprite.height / 2 + player.pos.y / map.height * this.mapSprite.height;
        }

        var camExtents = v2.create(camera.screenWidth * 0.5 / camera.z(), camera.screenHeight * 0.5 / camera.z());
        var camAabb = {
            min: v2.sub(camera.pos, camExtents),
            max: v2.add(camera.pos, camExtents)
        };

        // Update team UI elements
        var groupId = playerBarn.m_getPlayerInfo(player.__id).groupId;
        var groupInfo = playerBarn.getGroupInfo(groupId);

        if (!groupInfo) {
            var err = {
                playerId: player.__id,
                groupId: groupId,
                spectating: this.spectating,
                playing: this.game.playingTicker,
                groupInfo: playerBarn.groupInfo
            };
            FirebaseManager.logError('badTeamInfo_1: ' + (0, _stringify2.default)(err));
        }

        var layoutSm = device.uiLayout == device.UiLayout.Sm;

        var groupPlayerCount = groupInfo.playerIds.length;
        for (var i = 0; i < groupPlayerCount; i++) {
            var teamElems = this.teamSelectors[i];
            var playerId = groupInfo.playerIds[i];
            var playerInfo = playerBarn.m_getPlayerInfo(playerId);
            var isLocalPlayer = playerId == localPlayer.__id;
            var playerStatus = playerBarn.m_getPlayerStatus(playerId);
            if (isLocalPlayer && !this.playerId) {
                this.playerId = playerId;
            }
            if (!playerStatus || (isLocalPlayer || this.playerId == playerId) && device.mobile) {
                continue;
            }

            if (teamMode > 1) {
                if (!teamElems.groupIdDisplayed) {
                    teamElems.groupId.css('display', 'block');
                    teamElems.groupIdDisplayed = true;
                }

                // Team UI
                this.updateTeam(i, helpers.htmlEscape(playerInfo.name), playerStatus.health, {
                    disconnected: playerStatus.disconnected,
                    dead: playerStatus.dead,
                    downed: playerStatus.downed,
                    role: playerStatus.role
                }, playerInfo.playerId, playerInfo.teamId, playerBarn);

                // Team indicators
                for (var key in teamElems.indicators) {
                    if (!teamElems.indicators.hasOwnProperty(key)) {
                        continue;
                    }

                    var indicator = teamElems.indicators[key];
                    var elem = indicator.elem;
                    var hideIndicator = true;

                    if ((!isLocalPlayer || indicator.displayAll) && !factionMode) {
                        var playerPos = playerStatus.pos;
                        var dir = v2.normalizeSafe(v2.sub(playerPos, camera.pos), v2.create(1.0, 0.0));
                        var edge = coldet.intersectRayAabb(camera.pos, dir, camAabb.min, camAabb.max);
                        var rot = Math.atan2(dir.y, -dir.x) + Math.PI * 0.5;
                        var screenEdge = camera.pointToScreen(edge);
                        var onscreen = coldet.testCircleAabb(playerPos, GameConfig.player.radius, camAabb.min, camAabb.max);

                        if (!playerStatus.dead && !onscreen) {
                            var off = 32;
                            var transform = 'translate(-50%, -50%) rotate(' + rot + 'rad)';
                            if (layoutSm) {
                                off = 16;
                                transform += ' scale(0.5)';
                            }
                            hideIndicator = false;
                            var heightAdjust = device.model == 'iphonex' && device.webview ? 20 : 0;
                            elem.css({
                                left: math.clamp(screenEdge.x, off, camera.screenWidth - off),
                                top: math.clamp(screenEdge.y, off, camera.screenHeight - off - heightAdjust),
                                transform: transform
                            });
                            if (!indicator.displayed) {
                                elem.css('display', 'block');
                                indicator.displayed = true;
                            }
                        }
                    }
                    if (hideIndicator && indicator.displayed) {
                        elem.css('display', 'none');
                        indicator.displayed = false;
                    }
                }
            }
        }

        // Hide unused elements
        for (var _i = groupPlayerCount; _i < this.teamSelectors.length; _i++) {
            var _teamElems = this.teamSelectors[_i];
            for (var _key in _teamElems.indicators) {
                if (!_teamElems.indicators.hasOwnProperty(_key)) {
                    continue;
                }

                var _indicator = _teamElems.indicators[_key];
                if (_indicator.displayed) {
                    _indicator.elem.css('display', 'none');
                    _indicator.displayed = false;
                }
            }
            if (_teamElems.groupIdDisplayed) {
                _teamElems.groupId.css('display', 'none');
                _teamElems.groupIdDisplayed = false;
            }
        }

        // Faction specific rendering
        if (map.factionMode) {
            var localPlayerInfo = playerBarn.m_getPlayerInfo(localPlayer.__id);
            if (this.flairId != localPlayerInfo.teamId) {
                this.flairId = localPlayerInfo.teamId;
                // Assume red or blue for now
                var flairColor = this.flairId == 1 ? 'red' : 'blue';
                this.flairElems.css({
                    'display': 'block',
                    'background-image': 'url(../img/gui/player-patch-' + flairColor + '.svg)'
                });
            }
        }

        // Set the spectate options height if player count changed
        if (teamMode > 1 && this.groupPlayerCount != groupPlayerCount && device.uiLayout == device.UiLayout.Lg) {
            this.groupPlayerCount = groupPlayerCount;
            this.spectateOptionsWrapper.css({
                top: this.groupPlayerCount * this.teamMemberHeight + 134.0
            });
        } else if (teamMode == 1) {
            this.spectateOptionsWrapper.css({
                /*top: 85.0*/
                'display': 'none'
            });
        }

        this.updatePlayerMapSprites(dt, player, playerBarn, map);
        this.mapSpriteBarn.update(dt, this, map);
        this.m_pieTimer.update(dt, camera);

        // Update role selection menu
        if (this.roleMenuActive) {
            this.roleMenuTicker -= dt;

            var _seconds = Math.ceil(this.roleMenuTicker);
            var html = this.localization.translate('game-enter-game') + (' (' + _seconds + ')');
            if (html != this.roleMenuFooterHtml) {
                this.roleMenuFooterEnterElem.html(html);
                this.roleMenuFooterHtml = html;
            }

            if (!this.roleMenuInst && this.audioManager.isSoundLoaded('ambient_lab_01', 'ambient')) {
                this.roleMenuInst = this.audioManager.playSound('ambient_lab_01', {
                    channel: 'ambient'
                });
            }

            if (this.roleMenuTicker <= 0.0) {
                this.roleSelected = this.roleDisplayed;
                this.setRoleMenuActive(false);
            }
        }

        this.trySendAdStatus();
    },

    updatePlayerMapSprites: function updatePlayerMapSprites(dt, activePlayer, playerBarn, map) {
        var _this2 = this;

        var activePlayerInfo = playerBarn.m_getPlayerInfo(activePlayer.__id);
        var group = playerBarn.getGroupInfo(activePlayerInfo.groupId);
        var team = playerBarn.getTeamInfo(activePlayerInfo.teamId);

        var spriteIdx = 0;
        var addSprite = function addSprite(pos, scale, alpha, visible, zOrder, texture, tint) {
            if (spriteIdx >= _this2.playerMapSprites.length) {
                var s = _this2.mapSpriteBarn.addSprite();
                _this2.playerMapSprites.push(s);
            }

            var mapSprite = _this2.playerMapSprites[spriteIdx++];
            mapSprite.pos = v2.copy(pos);
            mapSprite.scale = scale;
            mapSprite.alpha = alpha;
            mapSprite.visible = visible;
            mapSprite.zOrder = zOrder;
            mapSprite.sprite.texture = PIXI.Texture.fromImage(texture);
            mapSprite.sprite.tint = tint;
        };

        var keys = (0, _keys2.default)(playerBarn.playerStatus);
        for (var i = 0; i < keys.length; i++) {
            var playerStatus = playerBarn.playerStatus[keys[i]];
            var playerId = playerStatus.playerId;
            var playerInfo = playerBarn.m_getPlayerInfo(playerId);
            var sameGroup = playerInfo.groupId == activePlayerInfo.groupId;
            var zOrder = 65535 + playerId * 2;
            if (playerId == activePlayerInfo.playerId) {
                zOrder += 65535 * 2;
            }

            var roleDef = RoleDefs[playerStatus.role];

            var customMapIcon = roleDef && roleDef.mapIcon;
            if (customMapIcon) {
                zOrder += 65535;
            }

            // Add the inner dot sprite
            {
                var texture = '../img/gui/player-map-inner.png';
                if (customMapIcon) {
                    texture = roleDef.mapIcon.alive;
                }
                if (playerStatus.dead) {
                    texture = '../img/gui/death-icon.png';
                    if (customMapIcon) {
                        texture = roleDef.mapIcon.dead;
                    }
                } else if (playerStatus.downed) {
                    texture = sameGroup ? 'player-map-inner.png' : 'player-map-downed.img';
                }

                var tint = sameGroup ? playerBarn.getGroupColor(playerId) : playerBarn.getTeamColor(playerInfo.teamId);
                if (map.factionMode && customMapIcon) {
                    tint = playerBarn.getTeamColor(playerInfo.teamId);
                }

                var dotScale = device.uiLayout == device.UiLayout.Sm ? 0.95 : 1;
                var scale = dotScale;

                // @TODO: bake the role scale into the map icon image
                if (sameGroup) {
                    if (playerStatus.dead) {
                        scale = dotScale * 0.6;
                    } else if (customMapIcon) {
                        scale = dotScale * 1.0;
                    } else {
                        scale = dotScale * 1.0;
                    }
                } else {
                    if (playerStatus.dead || playerStatus.downed || customMapIcon) {
                        scale = dotScale * 1.0;
                    } else {
                        scale = dotScale * 1.0;
                    }
                }

                addSprite(playerStatus.pos, scale, playerStatus.minimapAlpha, playerStatus.minimapVisible, zOrder, texture, tint);
            }

            // Add an outer sprite if this player is in our group
            if (sameGroup) {
                /*let texture = 'player-map-outer.img';
                let scale = device.uiLayout == device.UiLayout.Sm ? 0.25 : 0.3;
                let visible = playerStatus.minimapVisible && !customMapIcon;
                 addSprite(
                    playerStatus.pos,
                    scale,
                    playerStatus.minimapAlpha,
                    visible,
                    zOrder - 1,
                    texture,
                    0xFFFFFF
                );*/
            }
        }

        // Hide any sprites that weren't used
        for (var _i2 = this.playerMapSprites.length - 1; _i2 >= spriteIdx; _i2--) {
            this.playerMapSprites[_i2].visible = false;
        }
    },

    getMinimapMargin: function getMinimapMargin() {
        //return device.uiLayout == device.UiLayout.Sm ? 500 : 40;
        return device.uiLayout == device.UiLayout.Sm ? 4 : 12;
    },

    getMinimapSize: function getMinimapSize() {
        return device.uiLayout == device.UiLayout.Sm ? 192 : 256;
    },

    getMinimapBorderWidth: function getMinimapBorderWidth() {
        return device.uiLayout == device.UiLayout.Sm ? 1 : 4;
    },

    createPing: function createPing(pingType, pos, playerId, activePlayerId, playerBarn, factionMode) {
        var _this3 = this;

        var pingDef = PingDefs[pingType];
        if (!pingDef) {
            return;
        }

        var createPingSprite = function createPingSprite(scale, tint) {
            var s = _this3.mapSpriteBarn.addSprite();
            s.pos = v2.copy(pos);
            s.scale = scale;
            s.lifetime = pingDef.mapLife;
            s.pulse = false;
            s.zOrder = 100;

            s.sprite.texture = PIXI.Texture.fromImage(pingDef.mapTexture);
            s.sprite.tint = tint;

            return s;
        };

        var createPulseSprite = function createPulseSprite(tint) {
            var s = _this3.mapSpriteBarn.addSprite();
            s.pos = v2.copy(pos);
            s.scale = 0.0;
            s.lifetime = pingDef.pingLife;
            s.pulse = true;
            s.zOrder = 99;

            s.sprite.texture = PIXI.Texture.fromImage('ping-map-pulse.img');
            s.sprite.tint = tint;

            return s;
        };

        if (pingDef.mapEvent) {
            // Map-event pings free themselves after they are finished;
            // there's no limit to the number that an occur simultaneously.
            var scale = (device.uiLayout == device.UiLayout.Sm ? 0.15 : 0.2) * 1.5;
            var pingSprite = createPingSprite(scale, pingDef.tint);
            pingSprite.release();

            var pulseSprite = createPulseSprite(pingDef.tint);
            pulseSprite.release();
        } else {
            //
            // Player pings
            //

            // Figure out which tint to use by determining if this player
            // is in our group; if they are use their group color.
            // Otherwise, use their team color.
            // Faction leaders get a special color.
            var tint = 0xffffff;
            var activePlayerInfo = playerBarn.m_getPlayerInfo(activePlayerId);
            var playerInfo = playerBarn.m_getPlayerInfo(playerId);
            var playerStatus = playerBarn.m_getPlayerStatus(playerId);
            if (activePlayerInfo && playerInfo && playerStatus) {
                if (playerStatus.role == 'leader') {
                    // Use a special color if they are a faction leader
                    tint = 0x00ff00;
                } else if (activePlayerInfo.groupId == playerInfo.groupId) {
                    // Use group color
                    tint = playerBarn.getGroupColor(playerId);
                } else {
                    // Use the team color
                    tint = playerBarn.getTeamColor(playerInfo.teamId);
                }
            }

            // Store ping sprites per-player so we can cancel the most recent
            if (!this.playerPingSprites[playerId]) {
                this.playerPingSprites[playerId] = [];
            }

            // Free the most recently created ping sprites
            var pingSprites = this.playerPingSprites[playerId];
            for (var i = 0; i < pingSprites.length; i++) {
                pingSprites[i].free();
            }

            // Create new ping sprites for this player
            var _scale = device.uiLayout == device.UiLayout.Sm ? 0.25 : 0.3;
            var _pingSprite = createPingSprite(_scale, tint);
            var _pulseSprite = createPulseSprite(tint);
            pingSprites.push(_pingSprite);
            pingSprites.push(_pulseSprite);
        }
    },

    createQuestMarkers: function createQuestMarkers(questLocations, offsetAreaBeacons) {
        var _this4 = this;

        var pingDef = PingDefs['ping_danger'];
        if (!pingDef) {
            setTimeout(function () {
                _this4.createQuestMarkers(questLocations);
            }, 500);
            return;
        }

        this.freeOldQuestMarkers();

        var createPingSprite = function createPingSprite(pos, scale, questNumber) {
            var s = _this4.mapSpriteBarn.addSprite();
            s.pos = v2.copy(pos);
            s.scale = scale;
            s.pulse = false;
            s.zOrder = 100;

            s.sprite.texture = PIXI.Texture.fromImage('marker-map-quest-' + questNumber + '.img');

            return s;
        };

        var createZoneSprite = function createZoneSprite(pos, scale, tint) {
            var s = _this4.mapSpriteBarn.addSprite();
            s.pos = v2.copy(pos);
            s.scale = scale;
            s.pulse = false;
            s.zOrder = 99;

            s.sprite.tint = '0x' + tint;
            s.sprite.texture = PIXI.Texture.fromImage('marker-map-zone.img');

            return s;
        };

        var questColors = ['02FFE1', 'ac00fd', 'ff0000'];
        var scale = device.uiLayout == device.UiLayout.Sm ? 0.08 : 0.15;
        var scaleZone = device.uiLayout == device.UiLayout.Sm ? 0.6 : 0.7;

        if (questLocations) {
            for (var i = 0; i < questLocations.length; i++) {
                var locations = questLocations[i];
                var questNumber = i + 1;
                for (var k = 0; k < locations.length; k++) {
                    var randOffsetx = Math.floor(Math.random() * (offsetAreaBeacons - -offsetAreaBeacons)) + -offsetAreaBeacons;
                    var randOffsety = Math.floor(Math.random() * (offsetAreaBeacons - -offsetAreaBeacons)) + -offsetAreaBeacons;
                    var markerSprite = createPingSprite({ x: locations[k].x + randOffsetx, y: locations[k].y + randOffsety }, scale, questNumber);
                    var zoneSprite = createZoneSprite({ x: locations[k].x + randOffsetx, y: locations[k].y + randOffsety }, scaleZone, questColors[i]);
                    this.questMarkers.push(markerSprite);
                    this.questMarkers.push(zoneSprite);
                }
            }
        }
    },

    freeOldQuestMarkers: function freeOldQuestMarkers() {
        for (var i = 0; i < this.questMarkers.length; i++) {
            this.questMarkers[i].free();
        }
    },

    loadQuestsOnMap: function loadQuestsOnMap() {
        if (this.game.m_activePlayer && this.game.m_activePlayer.inGameNotification) this.quests = this.game.m_activePlayer.inGameNotification.getCurrentQuests();

        var currentQuestsDiv = $('#ui-current-quests');
        if (device.mobile && !(device.screenWidth > 1024)) {
            currentQuestsDiv = $('#ui-current-quests-mobile');
        }
        var questColors = ['E7E7E7', 'E7E7E7', 'E7E7E7'];

        currentQuestsDiv.html('');
        for (var i = 0; i < this.quests.length; i++) {
            var desc = this.localization.translate('' + this.quests[i].data.type);
            var questNumber = i + 1;
            var pctComplete = 100 - this.quests[i].current / this.quests[i].data.target * 100;
            var questDef = QuestDefs[this.quests[i].data.type];
            var currentText = Math.round(this.quests[i].current);
            var targetText = Math.round(this.quests[i].data.target);

            if (questDef.timed) {
                targetText = util.humanizeTime(targetText);
                currentText = util.humanizeTime(currentText);
            }

            if (pctComplete > 0) {
                currentQuestsDiv.append('<div class=\'ui-current-quest-container white-box\'>\n                                            <div class=\'tracking-quest-info\'><img id=\'tracking-quest-img-' + i + '\' src=\'img/gui/marker-map-quest-' + questNumber + '.svg\'></img><div class=\'tracking-quest-text h17 font-outline-black\' id=\'tracking-quest-text-' + i + '\'>' + desc + '(' + currentText + '/' + targetText + ')</div></div>\n                                            <div class=\'behind-container\'><div id=\'quest-track-' + i + '\' class=\'progress-bar\'></div></div>\n            </div>');
                $('#quest-track-' + i).css({ 'clip-path': 'inset(0 ' + pctComplete + '%                             0 0)' });

                /* let relFontsize = $(`#tracking-quest-text-${i}`).width()*0.035;
                $(`#tracking-quest-text-${i}`).css({'font-size': `${relFontsize}px`});  */
            } else {
                var textDesc = desc + '(' + currentText + '/' + targetText + ')';
                if (this.quests[i].current == this.quests[i].data.target) {
                    textDesc = this.localization.translate('quest-complete');
                }
                currentQuestsDiv.append('<div class=\'ui-current-quest-container white-box\'>\n                                            <div class=\'tracking-quest-info\'><img id=\'tracking-quest-img-' + i + '\' src=\'img/gui/marker-map-quest-check.svg\'></img><div class=\'tracking-quest-text h17 font-outline-black\' id=\'tracking-quest-text-' + i + '\'>' + textDesc + '</div></div>\n                                            <div class=\'behind-container\'><div id=\'quest-track-' + i + '\' class=\'progress-bar\'></div></div>\n                                        </div>');
                $('#quest-track-' + i).css({ 'clip-path': 'inset(0 0 0 0)' });

                /*  let relFontsize = $(`#tracking-quest-text-${i}`).width()*0.035;
                 $(`#tracking-quest-text-${i}`).css({'font-size': `${relFontsize}px`});  */
            }

            if (questDef.icon) {
                $('#tracking-quest-img-' + i).after($('<img src=\'' + questDef.icon + '\'>'));
            }
        }

        /*  var divs = document.getElementsByClassName("tracking-quest-text");
         for(var i = 0; i < divs.length; i++) {
             var relFontsize = divs[i].parentElement.offsetWidth*0.05;
             divs[i].style.fontSize = relFontsize+'px';
         } */
    },

    createMovingObjectsMarkers: function createMovingObjectsMarkers(questLocations, offsetAreaBeacons) {
        var _this5 = this;

        var pingDef = PingDefs['ping_danger'];
        if (!pingDef) {
            setTimeout(function () {
                _this5.createQuestMarkers(questLocations);
            }, 500);
            return;
        }

        for (var i = 0; i < this.questMarkers.length; i++) {
            this.questMarkers[i].free();
        }

        var createPingSprite = function createPingSprite(pos, scale, questNumber) {
            var s = _this5.mapSpriteBarn.addSprite();
            s.pos = v2.copy(pos);
            s.scale = scale;
            s.pulse = false;
            s.zOrder = 100;

            s.sprite.texture = PIXI.Texture.fromImage('marker-map-quest-' + questNumber + '.img');

            return s;
        };

        var createZoneSprite = function createZoneSprite(pos, scale, tint) {
            var s = _this5.mapSpriteBarn.addSprite();
            s.pos = v2.copy(pos);
            s.scale = scale;
            s.pulse = false;
            s.zOrder = 99;

            s.sprite.tint = '0x' + tint;
            s.sprite.texture = PIXI.Texture.fromImage('marker-map-zone.img');

            return s;
        };

        var questColors = ['02FFE1', 'ac00fd', 'ff0000'];
        var scale = device.uiLayout == device.UiLayout.Sm ? 0.08 : 0.15;
        var scaleZone = device.uiLayout == device.UiLayout.Sm ? 0.6 : 0.7;

        if (questLocations) {
            for (var _i3 = 0; _i3 < questLocations.length; _i3++) {
                var locations = questLocations[_i3];
                var questNumber = _i3 + 1;
                for (var k = 0; k < locations.length; k++) {
                    var randOffsetx = Math.floor(Math.random() * (offsetAreaBeacons - -offsetAreaBeacons)) + -offsetAreaBeacons;
                    var randOffsety = Math.floor(Math.random() * (offsetAreaBeacons - -offsetAreaBeacons)) + -offsetAreaBeacons;
                    var markerSprite = createPingSprite({ x: locations[k].x + randOffsetx, y: locations[k].y + randOffsety }, scale, questNumber);
                    var zoneSprite = createZoneSprite({ x: locations[k].x + randOffsetx, y: locations[k].y + randOffsety }, scaleZone, questColors[_i3]);
                    this.questMarkers.push(markerSprite);
                    this.questMarkers.push(zoneSprite);
                }
            }
        }
    },

    updateMapSprite: function updateMapSprite(mapSprite, sprite, spriteVisible, dt) {
        if (mapSprite.displayed) {
            if (mapSprite.life != undefined) {
                mapSprite.life -= dt;
                mapSprite.displayed = mapSprite.life > 0.0;
                // Quickfades
                if (mapSprite.maxLife - mapSprite.life < 0.1) {
                    sprite.alpha = (mapSprite.maxLife - mapSprite.life) / 0.1;
                } else if (mapSprite.life < 0.5) {
                    sprite.alpha = math.max(mapSprite.life / 0.5, 0.0);
                } else {
                    sprite.alpha = 1.0;
                }
            }
            if (mapSprite.pulse && mapSprite.displayed) {
                mapSprite.scale = mapSprite.scale + dt / 2.5;
                sprite.scale.set(mapSprite.scale, mapSprite.scale);
            }
            sprite.visible = spriteVisible && sprite.alpha > 0.0;
        }
    },

    updateGearInfo: function updateGearInfo(player, playerBarn) {
        var _this6 = this;

        var currentPerks = [];
        var playerId = player.__id;
        if (this.spectating) {
            playerId = this.spectatedPlayerId;
        }

        var playerInfo = playerBarn.m_getPlayerInfo(playerId);
        var armorDef = playerInfo.loadout.armor.type ? GameObjectDefs[playerInfo.loadout.armor.type] : {};
        var helmetDef = playerInfo.loadout.helmet.type ? GameObjectDefs[playerInfo.loadout.helmet.type] : {};
        var ringDef = playerInfo.loadout.ring.type ? GameObjectDefs[playerInfo.loadout.ring.type] : {};

        var equippedArmor = {
            definition: armorDef,
            userItem: { level: playerInfo.loadout.armor.level }
        };
        var equippedhelmet = {
            definition: helmetDef,
            userItem: { level: playerInfo.loadout.helmet.level }
        };

        var ringItem = this.account.items.find(function (item) {
            return item.id === _this6.account.loadoutIds['ring'];
        });

        var equippedring = {
            definition: ringDef,
            userItem: { level: playerInfo.loadout.ring.level }
        };
        currentPerks.push(equippedArmor);
        currentPerks.push(equippedring);
        currentPerks.push(equippedhelmet);

        var perkListHtml = "";
        var gearContainerImgs = $('#ui-map-info-container-gear-list-img');

        gearContainerImgs.empty();
        for (var i = 0; i < currentPerks.length; i++) {
            if (currentPerks[i].definition && (0, _keys2.default)(currentPerks[i].definition).length > 0) {
                var perks = getUniqueGearPerks(currentPerks[i]);

                gearContainerImgs.append('<div class="border-box-base-s border-box-' + currentPerks[i].definition.rarity + '-s"> <div id=\'ui-map-info-container-gear-img-' + (i + 1) + '\' class="img">  </div></div>');

                $('#ui-map-info-container-gear-img-' + (i + 1)).css({
                    'background-image': 'url(' + currentPerks[i].definition.images.sm + ')'
                });

                var perkList = perks.map(function (perk) {
                    var perksList = '<span class="font-edit text-gray-6 uppercase">' + getPerkText(_this6.localization, perk) + '</span>';
                    perkListHtml += '<span class="perk-list flex flex-col mb-2">' + perksList + '</span>';
                    return '<span class="perk-list flex flex-col mb-2">' + perksList + '</span>';
                });
            } else {
                gearContainerImgs.append('<div id=\'ui-map-info-container-gear-img-' + (i + 1) + '\' class="border-solid border-2"></div>');
            }
        }
        $('#ui-map-info-container-gear-perk-list').html(perkListHtml);
        this.updateGearMapInfo = false;
    },

    m_updateMapIndicators: function m_updateMapIndicators(data) {
        this.m_mapIndicatorBarn.m_updateIndicatorData(data);
    },

    getMapPosFromWorldPos: function getMapPosFromWorldPos(worldPos, map) {
        // let mapSpritePos = this.mapSprite;
        var xPos = this.mapSprite.x - this.mapSprite.width / 2 + worldPos.x / map.width * this.mapSprite.width;
        var yPos = this.mapSprite.y + this.mapSprite.height / 2 - worldPos.y / map.height * this.mapSprite.height;
        return v2.create(xPos, yPos);
    },

    getWorldPosFromMapPos: function getWorldPosFromMapPos(screenPos, map, camera) {
        var insideMap = false;
        var screenWidth = device.screenWidth;
        if (this.bigmapDisplayed) {
            var xBuffer = (camera.screenWidth - this.mapSprite.width) / 2;
            var xBufferRight = 0;
            var aspectRatio = device.screenWidth / device.screenHeight;
            var yBuffer = (camera.screenHeight - this.mapSprite.height) / 2;
            if (device.uiLayout == device.UiLayout.Sm && !device.isLandscape) {
                yBuffer = 0;
            }

            if (!device.mobile) {
                if (aspectRatio < 1.4) {
                    xBuffer = 0;
                    xBufferRight = camera.screenWidth - this.mapSprite.width;
                } else if (aspectRatio < 1.8) {
                    xBuffer = (camera.screenWidth - this.mapSprite.width) / 2 - 70;
                    xBufferRight = (camera.screenWidth - this.mapSprite.width) / 2 + 70;
                } else {
                    xBuffer = (camera.screenWidth - this.mapSprite.width) / 2;
                }
            } else if (device.mobile) {
                if (aspectRatio < 1.4) {
                    xBuffer = (camera.screenWidth - this.mapSprite.width) / 2 - 100;
                    xBufferRight = (camera.screenWidth - this.mapSprite.width) / 2 + 100;
                } else if (aspectRatio < 1.8) {
                    xBuffer = (camera.screenWidth - this.mapSprite.width) / 2 - 60;
                    xBufferRight = (camera.screenWidth - this.mapSprite.width) / 2 + 60;
                } else if (aspectRatio < 2.2) {
                    xBuffer = (camera.screenWidth - this.mapSprite.width) / 2 - 20;
                    xBufferRight = (camera.screenWidth - this.mapSprite.width) / 2 + 20;
                } else {
                    xBuffer = (camera.screenWidth - this.mapSprite.width) / 2;
                }
            } else {
                xBuffer = (camera.screenWidth - this.mapSprite.width) / 2;
            }

            if (xBufferRight) {
                insideMap = screenPos.x > xBuffer && screenPos.x < camera.screenWidth - xBufferRight && screenPos.y > yBuffer && screenPos.y < camera.screenHeight - yBuffer;
            } else {
                insideMap = screenPos.x > xBuffer && screenPos.x < camera.screenWidth - xBuffer && screenPos.y > yBuffer && screenPos.y < camera.screenHeight - yBuffer;
            }
        } else if (this.minimapDisplayed) {
            var thisMinimapSize = this.getMinimapSize();
            var thisMinimapMargin = this.getMinimapMargin();
            var minimapSize = thisMinimapSize * this.screenScaleFactor;
            var halfSize = (minimapSize + thisMinimapMargin) * 0.5;
            insideMap = screenPos.x > this.minimapPos.x - halfSize && screenPos.x < this.minimapPos.x + halfSize && screenPos.y > this.minimapPos.y - halfSize && screenPos.y < this.minimapPos.y + halfSize;
        }
        if (insideMap) {
            var mapOrigin = v2.create(this.mapSprite.x - this.mapSprite.width / 2, this.mapSprite.y + this.mapSprite.height / 2);
            var xWorldPos = (screenPos.x - mapOrigin.x) / this.mapSprite.width * map.width;
            var yWorldPos = (mapOrigin.y - screenPos.y) / this.mapSprite.height * map.height;
            return v2.create(xWorldPos, yWorldPos);
        } else {
            return false;
        }
    },

    hideAll: function hideAll() {
        this.gameElem.css('display', 'none');
    },

    showAll: function showAll() {
        this.gameElem.css('display', 'block');
    },

    removeAds: function removeAds() {
        if (device.webview && device.version >= '1.0.8') {
            this.adManager.hideBannerAd();
        }
    },

    trySendAdStatus: function trySendAdStatus() {
        this.frame++;
        // Fake ad block detector
        if (this.frame % 180 == 0 && !this.sentAdStatus && (window.aiptagPreroll || window.freestarPreroll || this.game.m_cheatDetected)) {
            this.sentAdStatus = true;

            var adStatusMsg = new net.AdStatusMsg();
            adStatusMsg.blocked = window.adsBlocked;
            adStatusMsg.prerollLoaded = window.preroll !== undefined;
            adStatusMsg.prerollFreestar = !!window.freestarPreroll;
            adStatusMsg.prerollAIP = !!window.aiptagPreroll;
            this.game.m_sendMessage(net.Msg.AdStatus, adStatusMsg);
        }
    },

    setLocalKills: function setLocalKills(kills) {
        this.playerKills.html(kills);
    },

    clearUI: function clearUI() {
        this.m_pieTimer.stop();
        this.curAction = {
            type: Action.None
        };
        this.displayMapLarge(true);
        this.displayMiniMap();
        this.clearStatsElems();
        this.clearTeamUI();
        this.toggleEscMenu(true);
        this.toggleLocalStats(true);
        this.visibilityMode = 0;
        this.spectatorCount = 0;
        this.setLocalKills(0);
    },

    beginSpectating: function beginSpectating() {
        this.specBegin = true;
    },

    hideStats: function hideStats() {
        this.statsMain.css('display', 'none');
        this.statsElem.stop().css({
            'display': 'none',
            opacity: 0.0
        });
        this.statsContents.stop().hide();
    },

    unHideStats: function unHideStats() {
        this.spectatedPlayerId = -1;
        this.setSpectating(false);
        this.displayingStats = true;
        this.statsMain.css('display', 'block');
        this.statsElem.stop().css({
            'display': 'block',
            opacity: 1.0
        });
        this.statsContents.stop().show();

        //Hide spectate ads if desktop
        if (!device.mobile) {
            this.adManager.hideSpectateAds();
            this.adManager.showOverPageAds();
        }
    },

    teamModeToString: function teamModeToString(teamMode) {
        var l10nMap = {
            'unknown': 'game-rank',
            1: 'game-solo-rank',
            2: 'game-duo-rank',
            4: 'game-squad-rank'
        };
        var val = l10nMap[teamMode] || l10nMap['unknown'];
        return this.localization.translate(val);
    },

    getTitleVictoryText: function getTitleVictoryText(spectatingAnotherTeam, gameMode) {
        if (spectatingAnotherTeam) {
            return this.spectatedPlayerName + ' ' + this.localization.translate('game-won-the-game');
        } else {
            var chickenTxt = 'game-chicken';
            if (gameMode.turkeyMode) {
                chickenTxt = 'game-turkey';
            }
            return this.localization.translate(chickenTxt);
        }
    },

    getTitleDefeatText: function getTitleDefeatText(teamMode, spectatingAnotherTeam) {
        if (spectatingAnotherTeam) {
            // @TODO: Use "Team eliminated" when spectating a team?
            var name = this.spectatedPlayerName;
            var died = this.localization.translate('game-player-died');
            return name + ' ' + died + '.';
        } else {
            if (teamMode > 1) {
                return this.localization.translate('game-team-eliminated');
            } else {
                var you = this.localization.translate('game-You');
                var _died = this.localization.translate('game-you-died');
                return you + ' ' + _died + '.';
            }
        }
    },

    getOverviewElems: function getOverviewElems(teamMode, teamRank, teamKills, factionMode) {
        if (factionMode) {
            var redTeamTxt = this.localization.translate('game-red-team');
            var blueTeamTxt = this.localization.translate('game-blue-team');
            return '<div class="ui-stats-header-right ui-stats-header-red-team">' + '<span class="ui-stats-header-stat">' + redTeamTxt + ' ' + '</span>' + '<span class="ui-stats-header-value">' + this.playersAliveRedCounter + '</span>' + '</div>' + '<div class="ui-stats-header-left ui-stats-header-blue-team">' + '<span class="ui-stats-header-stat">' + blueTeamTxt + ' ' + '</span>' + '<span class="ui-stats-header-value">' + this.playersAliveBlueCounter + '</span>' + '</div>';
        } else if (teamMode == 1) {
            var teamStr = this.teamModeToString(teamMode);
            return '<div>' + '<span class="ui-stats-header-stat">' + teamStr + ' ' + '</span>' + '<span class="ui-stats-header-value">#' + teamRank + '</span>' + '</div>';
        } else {
            var _teamStr = this.teamModeToString(teamMode);
            var teamKillTxt = this.localization.translate('game-team-kills');
            return '<div class="ui-stats-header-right">' + '<span class="ui-stats-header-stat">' + _teamStr + ' ' + '</span>' + '<span class="ui-stats-header-value">#' + teamRank + '</span>' + '</div>' + '<div class="ui-stats-header-left">' + '<span class="ui-stats-header-stat">' + teamKillTxt + ' ' + '</span>' + '<span class="ui-stats-header-value">' + teamKills + '</span>' + '</div>';
        }
    },

    quitGame: function quitGame() {
        var _this7 = this;

        this.game.gameOver = true;
        var context = this;

        this.spectatePrestigeUpdated = [];

        //FTUE validation
        var currentStep = helpers.getCookie('ftue-step');
        if (currentStep == 8 || currentStep == 9) {
            this.analytics.tutorialStepEnds('playing step ' + 10, 10, false);
            helpers.writeCookie("ftue-step", 10, 'Fri, 5 Oct 2050 14:28:00 GMT');
            this.adManager.tutorialStarted = false;
        }

        setTimeout(function () {
            context.game.pass.updateProgressBar();
        }, 1000);

        var onAdComplete = function onAdComplete() {
            _this7.game.onQuit();
        };
        this.adManager.onGameComplete(onAdComplete);
    },

    showStats: function showStats(playerStats, gearStats, teamId, teamRank, winningTeamId, gameOver, isTeamAlive, localTeamId, teamMode, spectating, playerBarn, audioManager, map, ui2Manager) {
        var _this8 = this;

        // If we're spectating a team that's not our own, and the game isn't over yet,
        // don't display the stats screen again.
        if (spectating && teamId != localTeamId && !gameOver) {
            return;
        }

        this.toggleEscMenu(true);
        this.displayingStats = true;
        this.m_pieTimer.stop();
        this.displayMapLarge(true);
        this.clearStatsElems();
        this.setSpectating(false, teamMode);
        this.removeAds();

        this.statsMain.css('display', 'block');
        // Reset styling set in showTeamAd
        this.statsContentsContainer.css({ top: '' });
        this.statsInfoBox.css({ height: '' });

        var victory = localTeamId == winningTeamId;
        var statsDelay = victory ? 1750 : 2500;
        this.showOverPageAds(statsDelay, ui2Manager);

        //
        // Create the stats screen header
        //
        var titleText = this.localization.translate('game-battle-result');

        var header = $('<div/>', {
            class: 'ui-stats-header-title h4 font-outline-black',
            html: titleText
        });
        this.statsHeader.html(header);

        var orderedPlayerStats = this.orderPlayerStats(playerStats, gearStats, playerBarn, gameOver);

        this.battleResult.load(orderedPlayerStats, isTeamAlive);

        for (var i = 0; i < orderedPlayerStats.length; i++) {
            var playerId = orderedPlayerStats[i].playerId;
            var loadout = orderedPlayerStats[i].loadout;
            var _gearStats = orderedPlayerStats[i].gearStats;
            var name = orderedPlayerStats[i].name;
            var kpg = orderedPlayerStats[i].kpg;
            $('#ui-stats-spec-id-' + playerId).click({ playerId: playerId, loadout: loadout, gearStats: _gearStats, name: name, kpg: kpg }, this.showOpponentDisplay.bind(this));
            if (!gameOver && orderedPlayerStats[i].rank === "?" && (isTeamAlive === 0 || orderedPlayerStats[i].isMyTeam === 1)) {
                $('#ui-spectate-id-' + playerId).click({ playerId: playerId }, this.setPlayerSpecId.bind(this));
            }
        }

        //ftue modal
        var ftueContainer = $('<div/>', {
            'class': 'find-killer-container purple-button'
        });

        var ftuemodal = $('<div/>', {
            'class': 'ftue-results-modal'
        }).append($('<span/>', {
            class: 'ftue-results-text',
            'html': this.localization.translate('ftue-inst-9')
        }));
        ftuemodal.append($('<div/>', {
            class: 'arrow-down'
        }));

        var currentStep = helpers.getCookie('ftue-step');

        // Stats options
        var findKillerButton = $('<a/>', {
            'class': 'ui-stats-find-killer menu-option game-battle-result-btn-darkened',
            'html': '<div><div class = "ui-stats-find-killer-text font-edit h6 font-outline-black ">' + this.localization.translate('battle-results-find-killer') + '</div></div>'
        });

        ftueContainer.append(ftuemodal);
        ftueContainer.append(findKillerButton);

        this.statsOptions.append(ftueContainer);

        if (currentStep == 8) {
            ftuemodal.css('display', 'flex');
        } else {
            ftuemodal.css('display', 'none');
        }

        findKillerButton.on('click', function () {

            if (currentStep == 8) {
                ftuemodal.css('display', 'none');
                currentStep = parseInt(currentStep) + 1;
                _this8.analytics.tutorialStepEnds('playing step ' + currentStep, currentStep, false);
                helpers.writeCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
                _this8.adManager.tutorialStarted = false;
            }
            _this8.scrollToKiller();
        });

        var restartButton = $('<a/>', {
            'class': 'ui-stats-restart font-edit h6 font-outline-black base-button green-button btn-darken menu-option',
            'html': this.localization.translate('game-play-again')
        });
        restartButton.on('click', function () {
            _this8.quitGame();
        });
        this.statsOptions.append(restartButton);

        restartButton.css({
            'left': device.mobile ? -40 : 130
        });
        findKillerButton.css({
            'left': device.mobile ? -40 : -130
        });

        var elemIdx = 0;
        var elemFadeTime = 500;
        var elemDelay = 250 / math.max(1, playerStats.length);
        var baseDelay = 750 / math.max(1, playerStats.length);

        this.statsInfoBox.children().each(function (idx, elem) {
            var e = $(elem);
            e.css('opacity', 0.0);
            e.delay(statsDelay + baseDelay + (elemIdx + idx) * elemDelay).animate({ opacity: 1.0 }, 1 * elemFadeTime, function () {
                e.children().each(function (idx2, elem2) {
                    var e2 = $(elem2);
                    e2.delay(idx2 * elemDelay).animate({
                        opacity: 1.0
                    }, 1 * elemFadeTime);
                });
            });
            e.children().each(function (idx2, elem2) {
                var e2 = $(elem2);
                e2.css('opacity', 0.0);
                elemIdx++;
            });
            elemIdx++;
        });

        this.statsOptions.children().each(function (idx, elem) {
            var e = $(elem);
            e.hide();
            var delay = statsDelay + baseDelay + (elemIdx + idx) * elemDelay + 500;
            e.delay(delay).fadeIn(1 * elemFadeTime);
            elemIdx++;
        });

        this.statsElem.stop();
        this.statsElem.css('display', 'block');
        this.statsElem.delay(statsDelay).animate({
            opacity: 1.0
        }, 1000);

        this.statsContents.stop();
        this.statsContents.css('display', 'block');
        this.statsContents.delay(statsDelay).animate({
            opacity: 1.0
        }, 1000).delay(100).queue(function (el) {
            _this8.scrollToPlayerName();

            $(el).dequeue();
        });
    },

    updateBattleResultStats: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(playerStats, gearStats, gameOver, isTeamAlive, playerBarn) {
            var _this9 = this;

            var orderedPlayerStats;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            orderedPlayerStats = this.orderPlayerStats(playerStats, gearStats, playerBarn, gameOver);

                            //Wait until UI is updated to bind btns

                            this.battleResult.update(orderedPlayerStats, isTeamAlive, true).then(function () {
                                for (var i = 0; i < orderedPlayerStats.length; i++) {
                                    var playerId = orderedPlayerStats[i].playerId;
                                    var loadout = orderedPlayerStats[i].loadout;
                                    var _gearStats2 = orderedPlayerStats[i].gearStats;
                                    var name = orderedPlayerStats[i].name;
                                    var kpg = orderedPlayerStats[i].kpg;
                                    $('#ui-stats-spec-id-' + playerId).click({ playerId: playerId, loadout: loadout, gearStats: _gearStats2, name: name, kpg: kpg }, _this9.showOpponentDisplay.bind(_this9));
                                    if (!gameOver && orderedPlayerStats[i].rank === "?" && (isTeamAlive === 0 || orderedPlayerStats[i].isMyTeam === 1)) {
                                        $('#ui-spectate-id-' + playerId).click({ playerId: playerId }, _this9.setPlayerSpecId.bind(_this9));
                                    }
                                }
                            });

                        case 2:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function updateBattleResultStats(_x, _x2, _x3, _x4, _x5) {
            return _ref.apply(this, arguments);
        }

        return updateBattleResultStats;
    }(),

    orderPlayerStats: function orderPlayerStats(playerStats, gearStats, playerBarn, gameOver) {
        var deadPlayerStats = [];
        var alivePlayerStats = [];

        var disableFindKillerButton = true;

        var _loop = function _loop(i) {
            var stats = playerStats[i];
            var playerInfo = playerBarn.m_getPlayerInfo(stats.playerId);
            var timeText = humanizeTime(stats.timeAlive);
            var rank = void 0;
            if (stats.rank === 255 && gameOver) {
                rank = 1;
            } else if (stats.rank === 255) {
                rank = '?';
            } else {
                rank = stats.rank;
            }
            var playerStat = {
                rank: rank,
                name: playerInfo.name,
                kills: stats.kills,
                damageDealt: stats.damageDealt,
                damageTaken: stats.damageTaken,
                timeAlive: timeText,
                isMyStats: stats.isMyStats,
                isMyKiller: stats.isMyKiller,
                isMyTeam: stats.isMyTeam,
                hasGoldenBP: stats.hasGoldenBP,
                kpg: stats.kpg,
                playerId: stats.playerId,
                loadout: playerInfo.loadout,
                gearStats: gearStats.find(function (obj) {
                    return obj.playerId === stats.playerId;
                }).loadout
            };

            if (stats.isMyKiller && !stats.isMyStats) {
                disableFindKillerButton = false;
            }
            if (stats.rank === 255) {
                alivePlayerStats.push(playerStat);
            } else {
                deadPlayerStats.push(playerStat);
            }
        };

        for (var i = 0; i < playerStats.length; i++) {
            _loop(i);
        }

        if (disableFindKillerButton) {
            $('.find-killer-container').addClass('btn-disabled');
        }

        deadPlayerStats.sort(function (a, b) {
            return a.rank > b.rank ? 1 : -1;
        });
        alivePlayerStats.sort(function (a, b) {
            return a.kills < b.kills ? 1 : -1;
        });
        return alivePlayerStats.concat(deadPlayerStats);
    },

    showOpponentDisplay: function showOpponentDisplay(event) {
        this.opponentMenu.show(event.data.loadout, event.data.gearStats, event.data.name, event.data.kpg);
    },

    setPlayerSpecId: function setPlayerSpecId(event) {
        this.specId = event.data.playerId;
        this.specBegin = true;
        this.displayingStats = false;

        var currentStep = helpers.getCookie('ftue-step');
        if (currentStep == 9) {
            currentStep = parseInt(currentStep) + 1;
            this.analytics.tutorialStepEnds('final step ' + currentStep, currentStep, false);
            helpers.writeCookie("ftue-step", currentStep, 'Fri, 5 Oct 2050 14:28:00 GMT');
        }

        //Show spectate ads if desktop
        if (!device.mobile && !this.adManager.currentUserVip) {
            this.adManager.hideOverPageAds();
            this.adManager.showSpectateAds();
        }
    },

    clearStatsElems: function clearStatsElems() {
        this.statsHeader.empty();
        this.statsInfoBox.empty();
        this.statsOptions.empty();
        this.statsAds.forEach(function (el) {
            return el.hidden = true;
        });
        this.statsContents.stop();
        this.statsContents.css({
            display: 'none',
            opacity: 0.0
        });
        this.statsElem.stop();
        this.statsElem.css({
            display: 'none',
            opacity: 0.0
        });
        this.statsMain.css('display', 'none');
    },

    showTeamAd: function showTeamAd(playerStats, gearStats, ui2Manager, isTeamAlive, playerBarn) {
        var _this10 = this;

        this.toggleEscMenu(true);
        this.displayingStats = true;
        this.displayMapLarge(true);
        this.clearStatsElems();
        this.statsMain.css('display', 'block');

        var statsDelay = 2500;
        this.showOverPageAds(statsDelay, ui2Manager);

        //
        // Create the stats screen header
        //
        var titleText = this.localization.translate('game-battle-result');

        var header = $('<div/>', {
            class: 'ui-stats-header-title h4 font-outline-black',
            html: titleText
        });
        this.statsHeader.html(header);

        var orderedPlayerStats = void 0;
        var deadPlayerStats = [];
        var alivePlayerStats = [];
        var disableFindKillerButton = true;

        var _loop2 = function _loop2(i) {
            var stats = playerStats[i];
            var playerInfo = playerBarn.m_getPlayerInfo(stats.playerId);

            if (stats.isMyStats) {
                _this10.setLocalStats(stats);
            }

            var timeText = humanizeTime(stats.timeAlive);
            var rank = void 0;
            if (stats.rank === 255) {
                rank = '?';
            } else {
                rank = stats.rank;
            }
            var playerStat = {
                rank: rank,
                name: playerInfo.name,
                kills: stats.kills,
                damageDealt: stats.damageDealt,
                damageTaken: stats.damageTaken,
                timeAlive: timeText,
                isMyStats: stats.isMyStats,
                isMyKiller: stats.isMyKiller,
                hasGoldenBP: stats.hasGoldenBP,
                isMyTeam: stats.isMyTeam,
                kpg: stats.kpg,
                playerId: stats.playerId,
                loadout: playerInfo.loadout,
                gearStats: gearStats.find(function (obj) {
                    return obj.playerId === stats.playerId;
                }).loadout
            };

            if (stats.isMyKiller && !stats.isMyStats) {
                disableFindKillerButton = false;
            }

            if (stats.rank === 255) {
                alivePlayerStats.push(playerStat);
            } else {
                deadPlayerStats.push(playerStat);
            }
        };

        for (var i = 0; i < playerStats.length; i++) {
            _loop2(i);
        }

        deadPlayerStats.sort(function (a, b) {
            return a.rank > b.rank ? 1 : -1;
        });
        alivePlayerStats.sort(function (a, b) {
            return a.kills < b.kills ? 1 : -1;
        });
        orderedPlayerStats = alivePlayerStats.concat(deadPlayerStats);

        this.battleResult.load(orderedPlayerStats, isTeamAlive);

        for (var i = 0; i < orderedPlayerStats.length; i++) {
            var playerId = orderedPlayerStats[i].playerId;
            var loadout = orderedPlayerStats[i].loadout;
            var _gearStats3 = orderedPlayerStats[i].gearStats;
            var name = orderedPlayerStats[i].name;
            var kpg = orderedPlayerStats[i].kpg;
            $('#ui-stats-spec-id-' + playerId).click({ playerId: playerId, loadout: loadout, gearStats: _gearStats3, name: name, kpg: kpg }, this.showOpponentDisplay.bind(this));
            if (orderedPlayerStats[i].rank === "?" && (isTeamAlive === 0 || orderedPlayerStats[i].isMyTeam === 1)) $('#ui-spectate-id-' + playerId).click({ playerId: playerId }, this.setPlayerSpecId.bind(this));
        }

        // Stats options
        var findKillerButton = $('<a/>', {
            'class': 'ui-stats-find-killer h6 font-outline-black menu-option font-edit base-button purple-button ',
            'html': this.localization.translate('battle-results-find-killer')
        });
        findKillerButton.on('click', function () {
            _this10.scrollToKiller();
        });
        this.statsOptions.append(findKillerButton);

        if (disableFindKillerButton) {
            $('.find-killer-container').addClass('btn-disabled');
        }

        var restartButton = $('<a/>', {
            'class': 'ui-stats-restart font-edit h6 font-outline-black base-button green-button btn-darken menu-option',
            'html': this.localization.translate('game-play-again')
        });
        restartButton.on('click', function () {
            _this10.quitGame();
        });
        this.statsOptions.append(restartButton);

        restartButton.css({
            'left': device.mobile ? -40 : 130
        });

        findKillerButton.css({
            'left': device.mobile ? -40 : -130
        });

        var elemIdx = 0;
        var elemFadeTime = 500;
        var elemDelay = 250 / math.max(1, playerStats.length);
        var baseDelay = 750 / math.max(1, playerStats.length);

        this.statsInfoBox.children().each(function (idx, elem) {
            var e = $(elem);
            e.css('opacity', 0.0);
            e.delay(statsDelay + baseDelay + (elemIdx + idx) * elemDelay).animate({ opacity: 1.0 }, 1 * elemFadeTime, function () {
                e.children().each(function (idx2, elem2) {
                    var e2 = $(elem2);
                    e2.delay(idx2 * elemDelay).animate({
                        opacity: 1.0
                    }, 1 * elemFadeTime);
                });
            });
            e.children().each(function (idx2, elem2) {
                var e2 = $(elem2);
                e2.css('opacity', 0.0);
                elemIdx++;
            });
            elemIdx++;
        });

        this.statsOptions.children().each(function (idx, elem) {
            var e = $(elem);
            e.hide();
            var delay = statsDelay + baseDelay + (elemIdx + idx) * elemDelay + 500;
            e.delay(delay).fadeIn(1 * elemFadeTime);
            elemIdx++;
        });

        this.statsElem.stop();
        this.statsElem.css('display', 'block');
        this.statsElem.delay(statsDelay).animate({
            opacity: 1.0
        }, 1000);

        this.statsContents.stop();
        this.statsContents.css('display', 'block');
        this.statsContents.delay(statsDelay).animate({
            opacity: 1.0
        }, 1000).delay(100).queue(function (el) {
            _this10.scrollToPlayerName();
            $(el).dequeue();
        });
    },

    scrollToPlayerName: function scrollToPlayerName() {
        var _this11 = this;

        this.scrollingOnBattleResults = true;
        //Scroll to the player battletag (center on window)
        var firstPlayerStats = $('.first-player-stats');
        var userStats = $('.ui-stats-current');
        var statsTable = $('.ui-stats-table-content');

        if (statsTable) {
            var divScale = this.battleResult.getCurrentScale();

            var firstPlayerTop = firstPlayerStats && firstPlayerStats.offset() ? firstPlayerStats.offset().top : 0;
            var userStatsTop = userStats && userStats.offset() ? userStats.offset().top : 0;
            var statsTableHeight = statsTable.height();

            var scrollToValue = (userStatsTop - firstPlayerTop) / (divScale ? divScale : 1) - statsTableHeight / 2;

            statsTable.animate({ scrollTop: scrollToValue }, 1000).queue(function (el) {
                _this11.scrollingOnBattleResults = false;
                $('.ui-stats-find-killer').removeClass('game-battle-result-btn-darkened');
                $(el).dequeue();
            });
        }
    },
    scrollToKiller: function scrollToKiller() {
        var _this12 = this;

        //Scroll to the player battletag (center on window)
        var firstPlayerStats = $('.first-player-stats');
        var killerStats = $('.ui-stats-player-spectate-red');
        var statsTable = $('.ui-stats-table-content');
        $('#ui-stats-options .ftue-results-modal').css('display', 'none');
        var currentStep = helpers.getCookie('ftue-step');

        if (statsTable && !this.scrollingOnBattleResults) {
            //ftue modal
            if (currentStep == 9) {
                this.analytics.tutorialStepEnds('playing step ' + currentStep, currentStep, false);
                $('.ftue-spectate .ftue-results-text').text(this.localization.translate('ftue-inst-10'));
                $('.ftue-spectate').css('display', 'flex');
            }
            this.scrollingOnBattleResults = true;
            $('.ui-stats-find-killer').addClass('game-battle-result-btn-darkened');
            var divScale = this.battleResult.getCurrentScale();

            var firstPlayerTop = firstPlayerStats && firstPlayerStats.offset() ? firstPlayerStats.offset().top : 0;
            var killerStatsTop = killerStats && killerStats.offset() ? killerStats.offset().top : 0;
            var statsTableHeight = statsTable.height();

            var scrollToValue = (killerStatsTop - firstPlayerTop) / (divScale ? divScale : 1) - statsTableHeight / 2;
            statsTable.animate({ scrollTop: scrollToValue }, 600);

            setTimeout(function () {
                _this12.scrollingOnBattleResults = false;
                $('.ui-stats-find-killer').removeClass('game-battle-result-btn-darkened');
                $("#ui-full-inventory").show().delay(3000).fadeOut();

                var spectateKillerAnimation = 'blink-bg';
                if (killerStats.hasClass("gold-pass")) {
                    spectateKillerAnimation = 'blink-bg-gold';
                }
                $('.ui-stats-player-spectate-killer').addClass(spectateKillerAnimation);

                setTimeout(function () {
                    $('.ui-stats-player-spectate-killer').removeClass(spectateKillerAnimation);
                }, 5000);
            }, 700);
        }
    },


    showOverPageAds: function showOverPageAds(statsDelay, ui2Manager) {
        var _this13 = this;

        //console.log("AdManager.showOverPageAds");
        var delay = Math.max(statsDelay - 150, 0);
        if (window.adsBlocked) {
            delay += 500;
        }

        //let slotIds = [];
        //let forceRefresh = false;
        /*if (!this.adManager.currentUserVip) {
            if (!device.webview) {
                if (device.mobile) {
                    slotIds.push('survivio_mobile_over');
                } else {
                    slotIds.push('results_bc_leaderboard_btf');
                    slotIds.push('spectate_tp_leaderboard_atf');
                    forceRefresh = true;
                }
            }
            //@TODO: ask playwire/kong about refreshing ads forceRefresh 
            this.adManager.showOverPageAds(slotIds);
            //this.adManager.showFreestarAds(slotIds, forceRefresh);
            if (device.webview && device.version > '1.0.8') {
                this.adManager.showBannerAd();
            }   
        }*/

        this.adManager.hideSpectateAds();
        setTimeout(function () {
            //console.log("AdManager.showOverPageAds, timeout over, displaying...");

            _this13.adManager.showOverPageAds();

            /* if (device.webview && device.version == '1.0.8') {
                 this.adManager.showBannerAd();
             } else if (window.adsBlocked) {
                 let adTag = device.mobile ?
                     $('#survivio_mobile_over') :
                     $('#results_bc_leaderboard_btf');
                  adTag.html('');
                 let $plea = $('.ui-stats-adblock').clone();
                 $plea.css('display','block');
                 adTag.html($plea);
             }*/

            ui2Manager.hideKillMessage();
        }, delay);
    },

    setSpectateTarget: function setSpectateTarget(targetId, localId, teamMode, playerBarn) {

        if (targetId != this.spectatedPlayerId) {
            this.setSpectating(true, teamMode);

            var playerInfo = playerBarn.m_getPlayerInfo(this.playerId);
            this.btnReportOptionPoints.html(this.account.profile.reportPoints);
            this.btnEndorseOptionPoints.html(this.account.profile.endorsePoints);

            var targetInfo = playerBarn.m_getPlayerInfo(targetId);

            if (this.account.profile.reportPoints <= 0) {
                this.btnReportOption.addClass('disabled');
            }

            if (this.account.profile.endorsePoints <= 0) {
                this.btnEndorseOption.addClass('disabled');
            }

            this.btnReportConfirmation.prop("onclick", null).off('click');
            this.btnEndorseOption.prop("onclick", null).off('click');

            //Check if player and target are logged and if player hasn't updated target in the same battle
            if (playerInfo && playerInfo.userId > 0 && targetInfo && targetInfo.userId > 0 && this.spectatePrestigeUpdated.indexOf(targetInfo.userId) <= -1 && !targetInfo.isUnlinked && !playerInfo.isUnlinked) {

                // this.prestigeSpectate.css('display', 'flex');
                var that = this;

                this.btnReportOption.on('click', function (event) {
                    event.preventDefault();
                    that.confirmationReportModal.show();
                });

                this.btnReportConfirmation.on('click', function (event) {
                    event.preventDefault();

                    //Update Report button

                    var newReportPoints = that.account.profile.reportPoints - 1;
                    that.btnReportOptionPoints.html(newReportPoints);

                    if (newReportPoints <= 0) {
                        that.btnReportOption.addClass('disabled');
                    }

                    that.updateTargetPrestige(targetInfo.userId, playerInfo.userId, -1);
                    //that.confirmationReportModal.hide();
                    $('#modal-report-confirmation').hide();
                });

                this.btnEndorseOption.on('click', function (event) {
                    event.preventDefault();

                    //Update Endorse button

                    var newEndorsePoints = that.account.profile.endorsePoints - 1;
                    that.btnReportOptionPoints.html(newEndorsePoints);

                    if (newEndorsePoints <= 0) {
                        that.btnEndorseOption.addClass('disabled');
                    }

                    that.updateTargetPrestige(targetInfo.userId, playerInfo.userId, 1);
                });
            } else {
                //Hide prestige if user or target is not logged.
                this.prestigeSpectate.css('display', 'none');
            }

            var name = playerBarn.getPlayerName(targetId, localId, false);

            this.spectatedPlayerId = targetId;
            this.spectatedPlayerName = helpers.htmlEscape(name);
            if (!device.mobile) {
                $('#spectate-player').html(this.spectatedPlayerName);
            } else {
                $('#spectate-player-mobile').html(this.spectatedPlayerName);
            }

            this.actionSeq = -1;
            this.m_pieTimer.stop();
        }
    },

    updateTargetPrestige: function updateTargetPrestige(userId, reporterId, prestige) {
        this.account.updateTargetPrestige(userId, reporterId, prestige);
        this.prestigeSpectate.css('display', 'none');
        this.spectatePrestigeUpdated.push(userId);
        if (prestige > 0) this.analytics.economyTransactions('Endorse', 0, 0, prestige + ' Endorses', 'Spectate', '', userId);else if (prestige < 0) this.analytics.economyTransactions('Report', 0, 0, prestige + ' Reports', 'Spectate', '', userId);
    },

    setSpectating: function setSpectating(spectating, teamMode) {
        if (this.spectating == spectating) {
            return;
        }

        if (!device.mobile) {
            $('#ui-equipped-ammo-wrapper').css('display', 'none');
        }

        this.spectating = spectating;
        if (this.spectating) {
            this.updateGearMapInfo = true;

            this.spectateMode.css('display', 'block');
            this.spectatedPlayerText.css('display', 'block');
            if (device.mobile) $('#ui-prestige-mobile').css('display', 'block');else $('#ui-prestige-mobile').css('display', 'none');
            $('.ui-zoom').removeClass('ui-zoom-hover');

            var hideSpec = teamMode == 1;
            this.specPrevButton.css('display', hideSpec ? 'none' : 'block');
            this.specNextButton.css('display', hideSpec ? 'none' : 'block');

            $('.ui-pickup-item, .ui-pickup-icon').css('pointer-events', 'none');
            $('.ui-skill-container, .ui-skill-group, .ui-skill-icon').css('pointer-events', 'none');
            $('.ui-stat-button').css('pointer-events', 'none');

            $('#ui-team').addClass('ui-team-spectate');

            this.hideStats();
        } else {
            this.spectateMode.css('display', 'none');
            this.spectatedPlayerText.css('display', 'none');
            $('#ui-prestige-mobile').css('display', 'none');
            $('.ui-zoom').addClass('ui-zoom-hover');
            //this.prestigeSpectate.css('display', 'flex');
            this.confirmationReportModal.hide();
            $('.ui-pickup-item, .ui-pickup-icon').css('pointer-events', 'all');
            $('.ui-skill-container, .ui-skill-group, .ui-skill-icon').css('pointer-events', 'all');
            $('.ui-stat-button').css('pointer-events', 'all');
        }
    },

    setLocalStats: function setLocalStats(stats) {
        var kDisplayStats = {
            'kills': this.localization.translate('game-kills'),
            'damageDealt': this.localization.translate('game-damage-dealt'),
            'damageTaken': this.localization.translate('game-damage-taken'),
            'timeAlive': this.localization.translate('game-survived')
        };

        this.spectateModeStatsData.empty();
        for (var k in kDisplayStats) {
            if (!kDisplayStats.hasOwnProperty(k)) {
                continue;
            }

            var text = kDisplayStats[k];
            var stat = k == 'timeAlive' ? humanizeTime(stats[k]) : stats[k];
            var html = '<tr>' + '<td class="ui-spectate-stats-category">' + text + '</td>' + '<td class="ui-spectate-stats-value">' + stat + '</td></tr>';
            this.spectateModeStatsData.append(html);
        }
    },

    toggleLocalStats: function toggleLocalStats() {
        var hide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var display = this.spectateModeStats.css('display') == 'none' && !hide;
        this.spectateModeStats.css('display', display ? 'inline-block' : 'none');
        this.specStatsButton.html(display ? this.localization.translate('game-hide-match-stats') : this.localization.translate('game-view-match-stats'));
    },

    updatePlayersAlive: function updatePlayersAlive(alive) {
        this.playersAlive.html(alive);

        this.leaderboardAlive.css('display', 'flex');
        this.leaderboardAliveFaction.css('display', 'none');
    },

    updatePlayersAliveRed: function updatePlayersAliveRed(alive) {
        this.playersAliveRed.html(alive);
        this.playersAliveRedCounter = alive;

        this.leaderboardAlive.css('display', 'none');
        this.leaderboardAliveFaction.css('display', 'block');

        $('#ui-map-counter-default').css('display', 'none');
        $('#ui-map-counter-faction').css('display', 'inline-block');
    },

    updatePlayersAliveBlue: function updatePlayersAliveBlue(alive) {
        this.playersAliveBlue.html(alive);
        this.playersAliveBlueCounter = alive;

        this.leaderboardAlive.css('display', 'none');
        this.leaderboardAliveFaction.css('display', 'block');

        $('#ui-map-counter-default').css('display', 'none');
        $('#ui-map-counter-faction').css('display', 'inline-block');
    },

    updateKillLeader: function updateKillLeader(playerId, playerName, kills, gameMode) {
        var valid = playerId != 0;
        var waitTxt = gameMode && gameMode.sniperMode ? this.localization.translate('game-waiting-for-hunted') : this.localization.translate('game-waiting-for-new-leader');
        waitTxt = device.mobile ? '' : waitTxt;
        this.killLeaderName.html(valid ? playerName : waitTxt);
        this.killLeaderCount.html(valid ? kills : 0);
    },

    displayMapLarge: function displayMapLarge(clear) {
        if (!clear) {
            this.bigmapDisplayed = !this.bigmapDisplayed;
        } else {
            this.bigmapDisplayed = false;
        }
        if (this.bigmapDisplayed) {
            this.container.alpha = 1;
        } else {
            this.container.alpha = this.minimapDisplayed ? 1 : 0;
        }
        var mapHidden = device.uiLayout == device.UiLayout.Sm ? '.js-ui-mobile-map-hidden' : 'js-ui-desktop-map-hidden';
        mapHidden += ', .js-ui-map-hidden';
        var displaySelector = this.visibilityMode == 2 ? $('.js-ui-hud-show') : $(mapHidden);

        $('#ui-map-expand-desktop').css('display', 'none');

        displaySelector.css('display', this.bigmapDisplayed ? 'none' : 'block');
        $('.js-ui-map-hidden-bottom').css('display', this.bigmapDisplayed ? 'none' : 'flex');
        if (device.mobile && device.screenWidth <= 1024) {
            $('.js-ui-map-hidden-mobile').css('display', this.bigmapDisplayed ? 'none' : 'flex');
        }

        $('.js-ui-map-show').css('display', this.bigmapDisplayed ? 'block' : 'none');
        if (this.quests.length > 0) {
            // $('.js-ui-map-show-quests').css('display', this.bigmapDisplayed ? 'block' : 'none');
            $('#ui-quest-tracking').css('display', this.bigmapDisplayed ? 'block' : 'none');
        }

        $('#ui-map-info-container').css('display', this.bigmapDisplayed ? 'inline-flex' : 'none');

        if (this.bigmapDisplayed) {
            $(".ui-leaderboard-container").appendTo("#ui-map-info-container-left");
            $("#ui-team").appendTo("#ui-map-info-container-left");
            $("#ui-quest-tracking").appendTo("#ui-map-info-container-left");
            $("#ui-killfeed").appendTo("#ui-map-info-container-left");
            this.game.bigMapActive = true;
            this.game.updateQuestMarkersMap(true);
            this.loadQuestsOnMap();
        } else {
            $(".ui-leaderboard-container").appendTo("#ui-leaderboard-wrapper");
            // $("#ui-team").appendTo("#ui-top-left");
            $("#ui-team").prependTo("#ui-top-left");
            $("#ui-quest-tracking").appendTo("#ui-leaderboard-wrapper");
            $("#ui-killfeed").appendTo("#ui-killfeed-wrapper");

            this.game.bigMapActive = false;
            this.freeOldQuestMarkers();
        }

        // This need to be here still?
        this.updateSpectatorCountDisplay(true);
        this.redraw(this.game.m_camera);
    },

    updateSpectatorCountDisplay: function updateSpectatorCountDisplay(dirty) {
        var displayCounter = !this.bigmapDisplayed && this.spectatorCount > 0;
        dirty = dirty || this.spectatorCount > 0 && !this.spectatorCounterDisplayed || this.spectatorCount == 0 && this.spectatorCounterDisplayed;

        if (this.spectatorCount != this.prevSpectatorCount) {
            this.spectatorCounter.html(this.spectatorCount);
            this.prevSpectatorCount = this.spectatorCount;
        }
        if (dirty) {
            this.spectatorCounterContainer.css('display', displayCounter ? 'block' : 'none');
            this.spectatorCounterDisplayed = displayCounter;
        }
    },

    toggleMiniMap: function toggleMiniMap() {
        if (this.minimapDisplayed) {
            this.hideMiniMap();
        } else {
            this.displayMiniMap();
        }
    },

    cycleVisibilityMode: function cycleVisibilityMode() {
        if (this.bigmapDisplayed) {
            return;
        }
        switch (this.visibilityMode) {
            case 0:
                this.hideMiniMap();
                this.visibilityMode = 1;
                break;
            case 1:
                this.displayMiniMap();
                this.visibilityMode = 0;
                break;
        }
    },

    cycleHud: function cycleHud() {
        if (this.gameElem.css('display') == 'none') {
            this.gameElem.css('display', 'block');
            this.displayMiniMap();
            this.hudVisible = true;
        } else {
            this.gameElem.css('display', 'none');
            this.hideMiniMap();
            this.hudVisible = false;
        }
    },

    hideMiniMap: function hideMiniMap() {
        if (this.bigmapDisplayed) {
            return;
        }
        this.minimapDisplayed = false;
        this.container.alpha = 0;
        this.mapInfo.css('bottom', 0);
        this.spectatorCounterContainer.css({
            'bottom': 6,
            'left': 98
        });
    },

    displayMiniMap: function displayMiniMap() {
        if (this.bigmapDisplayed) {
            return;
        }
        var layoutSm = device.uiLayout == device.UiLayout.Sm;
        this.minimapDisplayed = true;
        this.container.alpha = 1;
        //this.mapInfo.css('bottom', this.mapInfoBottom);
        this.spectatorCounterContainer.css({
            'bottom': layoutSm ? 0 : 218,
            'left': layoutSm ? 0 : 6
        });
    },

    displayAnnouncement: function displayAnnouncement(message) {
        var _this14 = this;

        if (message) {
            this.announcement.html(message);
            this.announcement.fadeIn(400, function () {
                setTimeout(function () {
                    _this14.announcement.fadeOut(800);
                }, 3000);
            });
        }
    },

    displayGasAnnouncement: function displayGasAnnouncement(type, timeLeft) {
        var message = '';
        switch (type) {
            case GasMode.Waiting:
                {
                    message = this.localization.translate('game-storm-advances');
                    var minutes = Math.floor(timeLeft / 60);
                    var seconds = timeLeft - minutes * 60;
                    message += minutes > 1 ? " " + minutes + " " + this.localization.translate('game-minutes') : "";
                    message += minutes == 1 ? " " + minutes + " " + this.localization.translate('game-minute') : "";
                    message += seconds > 0 ? " " + Math.floor(seconds) + " " + this.localization.translate('game-seconds') : "";
                    break;
                }
            case GasMode.Moving:
                {
                    message = this.localization.translate('game-storm-advancing');
                    break;
                }
            default:
                break;
        }
        this.displayAnnouncement(message);
    },

    setWaitingForPlayers: function setWaitingForPlayers(waiting) {
        this.waitingForPlayers = waiting;
        this.waitingText.css('display', waiting ? 'block' : 'none');
    },

    render: function render(playerPos, gas, camera, map, planeBarn, debug) {
        // Gas
        var circle = gas.getCircle();
        var gasPos = this.getMapPosFromWorldPos(circle.pos, map);
        var gasEdge = this.getMapPosFromWorldPos(v2.add(circle.pos, v2.create(circle.rad, 0.0)), map);
        var gasRad = v2.length(v2.sub(gasEdge, gasPos));
        this.gasRenderer.render(gasPos, gasRad, gas.isActive());

        // Gas safe zone
        var circleSafe = gas.circleNew;
        var safePos = this.getMapPosFromWorldPos(circleSafe.pos, map);
        var safeEdge = this.getMapPosFromWorldPos(v2.add(circleSafe.pos, v2.create(circleSafe.rad, 0.0)), map);
        var safeRad = v2.length(v2.sub(safeEdge, safePos));
        var playerMapPos = this.getMapPosFromWorldPos(playerPos, map);
        var drawCircle = gas.isActive();
        var drawLine = gas.isActive() && !this.bigmapDisplayed;
        this.gasSafeZoneRenderer.render(safePos, safeRad, playerMapPos, drawCircle, drawLine);

        planeBarn.renderAirstrikeZones(this, map, debug);
    },

    updateHealthBar: function updateHealthBar(innerWidth, selectorInner, selectorPreview, selectorDepleted, status) {
        var healthBarWidth = innerWidth;
        var uiHealth = healthBarWidth * status.health;
        uiHealth = status.dead ? 0 : math.max(uiHealth, 1);

        selectorInner.css('width', uiHealth);
        if (uiHealth > 0 && selectorDepleted) {
            selectorDepleted.css('width', uiHealth);
        }

        var val = status.health;

        if (val > 0.25 && !status.downed) {
            /*selectorInner.css({
                background: "linear-gradient(180deg, #D4002C 0%, #9F0020 73.96%, #6F0017 100%);"
            });*/
            selectorInner.removeClass('health-bar-pulse');
        } else {
            selectorInner.addClass('health-bar-pulse');
        }

        //Update preview health (originally a white bar)
        setTimeout(function () {
            selectorPreview.css('width', uiHealth);
        }, 300);
    },

    ajustNotificationTeamMode: function ajustNotificationTeamMode(teamId) {
        //This is not needed now the notification doesn't interfere with the team list of squad/duo
        //TODO delete if not needed for another ajustement in BHA
        /*if(teamId==1){
            $('#ui-quest-notification').removeClass('ui-quest-notification-duo ui-quest-notification-squad');
        }else if(teamId==2){
            $('#ui-quest-notification').removeClass('ui-quest-notification-squad').addClass('ui-quest-notification-duo ');
        }else if(teamId>=4){
            $('#ui-quest-notification').removeClass('ui-quest-notification-duo ').addClass('ui-quest-notification-squad');
        }*/
    },

    updateTeam: function updateTeam(slotIdx, name, health, status, playerId, teamId, playerBarn) {
        var groupId = this.teamSelectors[slotIdx].groupId;
        var teamName = this.teamSelectors[slotIdx].teamName;
        var prevHealth = this.teamSelectors[slotIdx].prevHealth;
        var prevStatus = this.teamSelectors[slotIdx].prevStatus;
        var statusChange = status.dead != prevStatus.dead || status.disconnected != prevStatus.disconnected || status.downed != prevStatus.downed || status.role != prevStatus.role;

        if (this.teamSelectors[slotIdx].playerId != playerId || health != prevHealth || statusChange) {
            var teamIcon = this.teamSelectors[slotIdx].teamIcon;
            var teamStatus = this.teamSelectors[slotIdx].teamStatus;
            var teamHealthInner = this.teamSelectors[slotIdx].teamHealthInner;
            var teamHealthPreview = this.teamSelectors[slotIdx].teamHealthPreview;

            this.teamSelectors[slotIdx].playerId = playerId;
            this.teamSelectors[slotIdx].teamNameHtml = name;
            teamName.html(name);

            this.updateHealthBar(this.teamMemberHealthBarWidth, teamHealthInner, teamHealthPreview, null, {
                health: health,
                dead: status.dead,
                downed: status.downed
            });

            if (statusChange) {
                teamStatus.attr('class', 'ui-team-member-status');
                if (status.disconnected) {
                    teamStatus.addClass('ui-team-member-status-disconnected');
                } else if (status.dead) {
                    teamStatus.addClass('ui-team-member-status-dead');
                } else if (status.downed) {
                    teamStatus.addClass('ui-team-member-status-downed').addClass('icon-pulse');
                }
                teamName.css('opacity', status.disconnected || status.dead ? 0.3 : 1.0);
            }

            groupId.css('display', 'block');
            this.teamSelectors[slotIdx].prevStatus = status;
            this.teamSelectors[slotIdx].prevHealth = health;
        }
    },

    clearTeamUI: function clearTeamUI() {
        $('.ui-team-member').css('display', 'none');
        $('.ui-team-indicator').css('display', 'none');
        $('.ui-team-member-name').removeAttr('style');
        $('.ui-team-member-status').removeAttr('style');
        $('.ui-team-member-status').removeClass('ui-team-member-status-downed ui-team-member-status-dead ui-team-member-status-disconnected icon-pulse');
        this.teamSelectors = [];
    },

    resize: function resize(map, camera) {
        this.screenScaleFactor = device.uiLayout == device.UiLayout.Sm && !device.tablet ? 0.5626 : math.min(1, math.clamp(camera.screenWidth / 1280, 0.75, 1) * math.clamp(camera.screenHeight / 1024, 0.75, 1));
        this.m_pieTimer.resize(this.touch, this.screenScaleFactor);

        this.gasRenderer.resize();

        this.mapSprite.texture = map.getMapTexture();

        var roleMenuScale = math.min(1, math.min(camera.screenWidth / 1200, camera.screenHeight / 900));

        this.roleMenuElem.css('transform', 'translateX(-50%) translateY(-50%) scale(' + roleMenuScale + ')');

        this.redraw(camera);
    },

    redraw: function redraw(camera) {
        var screenWidth = camera.screenWidth;
        var screenHeight = camera.screenHeight;

        var thisMinimapMargin = this.getMinimapMargin();
        var thisMinimapMarginXAdjust = 0;
        var thisMinimapMarginYAdjust = 0;
        // Squeeze in thisMinimapMarginXAdjust on iPhoneX+
        /*if (device.model == 'iphonex') {
            if (device.isLandscape) {
                thisMinimapMarginXAdjust += 28;
            } else {
                thisMinimapMarginYAdjust += 32;
            }
        }*/

        var thisMinimapSize = this.getMinimapSize();
        var thisMinimapBorderWidth = this.getMinimapBorderWidth();
        var layoutSm = device.uiLayout == device.UiLayout.Sm;

        this.display.border.clear();
        this.container.mask.clear();

        if (this.bigmapDisplayed) {
            var smallestDim = math.min(screenWidth, screenHeight);
            var mapScale = 0.30;
            if (screenWidth <= 1280 || screenHeight <= 780) {
                mapScale = 0.37;
            }

            var minimapSizeDim = smallestDim == screenHeight ? smallestDim - smallestDim * mapScale : smallestDim;
            this.mapSprite.width = minimapSizeDim;
            this.mapSprite.height = minimapSizeDim;
            var aspectRatio = device.screenWidth / device.screenHeight;
            if (!device.mobile) {
                this.mapSprite.x = screenWidth / 2;
                /*  if(aspectRatio<1.4){
                    // this.mapSprite.x = this.mapSprite.width / 2;
                    this.mapSprite.x = screenWidth/ 2;
                 }
                 else if(aspectRatio<1.8){
                     this.mapSprite.x =  screenWidth / 2 - 70;
                 }
                 else {
                     this.mapSprite.x = screenWidth / 2;
                 } */
            } else if (device.mobile) {
                if (aspectRatio < 1.4) {
                    this.mapSprite.x = screenWidth / 2 - 100;
                } else if (aspectRatio < 1.8) {
                    this.mapSprite.x = screenWidth / 2 - 60;
                } else if (aspectRatio < 2.2) {
                    this.mapSprite.x = screenWidth / 2 - 20;
                } else {
                    this.mapSprite.x = screenWidth / 2;
                }
            } else {
                this.mapSprite.x = screenWidth / 2;
            }

            $("#ui-map-info-container-center").css({ 'min-width': this.mapSprite.width + "px" });
            $("#map-container").css({
                'width': this.mapSprite.width,
                'height': this.mapSprite.height

            });
            $("#ui-map-info-container").css({ 'padding-top': 71 + "px" });

            //this.mapSprite.y = screenHeight / 2;
            this.mapSprite.y = this.mapSprite.height / 2 + 71;
            this.mapSprite.alpha = 1.0;

            this.container.mask.beginFill(0xffffff, 1);
            this.container.mask.drawRect(this.mapSprite.x - this.mapSprite.width / 2, this.mapSprite.y - this.mapSprite.height / 2, this.mapSprite.width, this.mapSprite.height);
            this.container.mask.endFill();

            if (device.touch) {
                this.bigmapCollision.css({
                    'width': screenHeight,
                    'height': screenWidth,
                    'left': this.mapSprite.x - thisMinimapMarginXAdjust
                });
            }
        } else {
            var minimapScale = 1600 * this.screenScaleFactor / 1.2;
            var minimapSize = thisMinimapSize * this.screenScaleFactor;

            this.mapSprite.width = minimapScale;
            this.mapSprite.height = minimapScale;
            this.mapSprite.alpha = 0.8;

            // Start with a fall back
            var scaleCss = { 'zoom': this.screenScaleFactor };
            if (document.body) {
                if ('WebkitTransform' in document.body.style) {
                    scaleCss = { '-webkit-transform': 'scale(' + this.screenScaleFactor + ')' };
                } else if ('transform' in document.body.style) {
                    scaleCss = { 'transform': 'scale(' + this.screenScaleFactor + ')' };
                }
            }
            this.mapContainer.css(scaleCss);
            if (device.mobile && device.screenWidth < 1060) {
                $("#ui-bottom-center-right").css({ left: 190 * this.screenScaleFactor });
                //$("#ui-bottom-center-0").css({left: 190 * this.screenScaleFactor});
                $("#ui-bottom-center-left").css({ left: 190 * this.screenScaleFactor + 218 });
                $('#ui-top-center-scopes-wrapper').css(scaleCss);
            }
            //this.mapContainer.css('top', this.mapContainerBottom * this.screenScaleFactor); @TODO: Delete

            /*let minimapPosY = minimapSize / 2 + thisMinimapMargin; layoutSm ? @TODO:Refactor
                minimapSize / 2 + thisMinimapMargin :
                minimapSize / 2 + thisMinimapMargin ;//screenHeight - minimapSize / 2 - thisMinimapMargin */
            this.minimapPos.x = thisMinimapMargin + minimapSize / 2 + thisMinimapMarginXAdjust;
            this.minimapPos.y = minimapSize / 2 + thisMinimapMargin; //minimapPosY + thisMinimapMarginYAdjust;

            this.display.border.lineStyle(thisMinimapBorderWidth, 0x000000);
            this.display.border.beginFill(0x000000, 0);

            var minimapAnchorY = thisMinimapMargin + thisMinimapBorderWidth / 2; /*layoutSm ? @TODO:Refactor
                                                                                 thisMinimapMargin + thisMinimapBorderWidth / 2 :
                                                                                 thisMinimapMargin + thisMinimapBorderWidth / 2;//screenHeight - minimapSize - thisMinimapMargin + thisMinimapBorderWidth / 2;*/
            this.display.border.drawRect(thisMinimapMargin + thisMinimapBorderWidth / 2 + thisMinimapMarginXAdjust, minimapAnchorY + thisMinimapMarginYAdjust, minimapSize - thisMinimapBorderWidth, minimapSize - thisMinimapBorderWidth);
            this.display.border.endFill();

            var minimapMaskAnchorY = thisMinimapMargin; /*layoutSm ? @TODO:Refactor
                                                        thisMinimapMargin :
                                                        thisMinimapMargin;//screenHeight - minimapSize - thisMinimapMargin;*/
            this.container.mask.beginFill(0xffffff, 1);
            this.container.mask.drawRect(thisMinimapMargin + thisMinimapMarginXAdjust, minimapMaskAnchorY - 0.5 + thisMinimapMarginYAdjust, minimapSize, minimapSize);
            this.container.mask.endFill();
        }
    },

    toggleEscMenu: function toggleEscMenu() {
        var _this15 = this;

        var clear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (this.displayingStats) {
            return;
        }
        if (this.escMenuDisplayed || clear) {
            this.escMenuDisplayed = false;
            this.escMenuElem.css('display', 'none');
            this.setCurrentGameTab('settings');
            $('#ui-center').off('mouseenter mouseleave');
            this.inputBinds.menuHovered = false;

            if (this.roleMenuActive) {
                this.displayRoleMenu();
            }
        } else {
            if (this.bigmapDisplayed) {
                this.displayMapLarge(true);
            } else {
                if (this.visibilityMode == 2) {
                    this.cycleVisibilityMode();
                }
                this.escMenuDisplayed = true;
                this.escMenuElem.css('display', 'block');

                $('#ui-center').hover(function () {
                    _this15.inputBinds.menuHovered = true;
                }, function () {
                    _this15.inputBinds.menuHovered = false;
                });
                this.inputBinds.menuHovered = false;

                if (this.roleMenuActive) {
                    this.hideRoleMenu();
                }
            }
        }
    },

    setCurrentGameTab: function setCurrentGameTab(tab) {
        this.currentGameTab = tab;
        this.gameTabs.css('display', 'none');
        this.gameTabBtns.removeClass('btn-game-menu-selected');
        $('#ui-game-tab-' + this.currentGameTab).css('display', 'block');
        $('#btn-game-' + this.currentGameTab).addClass('btn-game-menu-selected');

        if (this.currentGameTab == 'keybinds') {
            this.inputBindUi.refresh();
            $('#ui-game-menu').addClass('keybinds');
        } else {
            $('#ui-game-menu').removeClass('keybinds');
            this.inputBindUi.cancelBind();
        }
    },

    setRoleMenuActive: function setRoleMenuActive(active) {
        this.roleMenuActive = active;

        if (this.roleMenuActive) {
            this.roleMenuTicker =  false ? undefined : 20.0;
            this.displayRoleMenu();
        } else {
            if (this.roleMenuInst) {
                this.audioManager.stopSound(this.roleMenuInst);
                this.roleMenuInst = null;
            }

            this.hideRoleMenu();
        }
    },

    displayRoleMenu: function displayRoleMenu() {
        this.roleMenuElemWrapper.css('display', 'block');
    },

    hideRoleMenu: function hideRoleMenu() {
        this.roleMenuElemWrapper.css('display', 'none');
    },

    setRoleMenuOptions: function setRoleMenuOptions(role, roles) {
        var _this16 = this;

        $('#ui-role-header').html('');

        for (var i = 0; i < roles.length; i++) {
            var _role = roles[i];
            var roleDef = GameObjectDefs[_role];
            var roleOption = $('<div/>', {
                class: 'ui-role-option',
                'data-role': _role
            });
            roleOption.css({
                'background-image': 'url(\'' + roleDef.guiImg + '\')'
            });
            $('#ui-role-header').append(roleOption);
        }

        $('.ui-role-option').on('click', function (event) {
            event.stopPropagation();
            var el = $(event.currentTarget);
            _this16.setRoleMenuInfo(el.data('role'));
        });

        var selectedRole = roles[0];
        if (roles.indexOf(role) !== -1) {
            selectedRole = role;
        }
        this.setRoleMenuInfo(selectedRole);
    },

    setRoleMenuInfo: function setRoleMenuInfo(role) {
        var roleDef = GameObjectDefs[role];
        $('.ui-role-option').css({
            'background-size': 132,
            'opacity': 0.5
        });
        $('#ui-role-header').find('[data-role=' + role + ']').css({
            'background-size': 164,
            'opacity': 1.0
        });

        var roleBodyLeft = $('<div/>', {
            class: 'ui-role-body-left'
        });
        var roleBodyName = $('<div/>', {
            class: 'ui-role-body-name'
        });
        var roleBodyImg = $('<div/>', {
            class: 'ui-role-body-image'
        });

        var roleName = this.localization.translate('game-' + role);
        roleBodyName.html(roleName);
        roleBodyImg.css({
            'background-image': 'url(\'' + roleDef.guiImg + '\')'
        });
        var borderColor = roleDef.color ? helpers.colorToHexString(roleDef.color) : 'default';
        this.roleMenuElem.css('border-color', borderColor);

        roleBodyLeft.append(roleBodyName).append(roleBodyImg);

        var roleBodyRight = $('<div/>', {
            class: 'ui-role-body-right'
        });
        var rolePerks = roleDef.perks;
        for (var i = 0; i < rolePerks.length; i++) {
            var perk = rolePerks[i];
            var perkElem = $('<div/>', {
                class: 'ui-role-body-perk'
            });
            var perkElemImg = $('<div/>', {
                class: 'ui-role-body-perk-image-wrapper'
            }).append($('<div/>', {
                class: 'ui-role-body-perk-image-icon'
            }));
            var perkElemName = $('<div/>', {
                class: 'ui-role-body-perk-name'
            });

            var perkImg = helpers.getSvgFromGameType(perk);
            perkElemImg.find('.ui-role-body-perk-image-icon').css({
                'background-image': 'url(\'' + perkImg + '\')'
            });
            var perkName = this.localization.translate('game-' + perk);
            perkElemName.html(perkName);
            perkElem.append(perkElemImg).append(perkElemName);
            roleBodyRight.append(perkElem);
        }

        $('#ui-role-body').html('').append(roleBodyLeft).append(roleBodyRight);

        this.roleDisplayed = role;
    }
};

function Interpolate(start, end, steps, count) {
    var s = start,
        e = end,
        f = s + (e - s) / steps * count;
    return Math.floor(f);
}

function Color(_r, _g, _b) {
    var r, g, b;
    var setColors = function setColors(_r, _g, _b) {
        r = _r;
        g = _g;
        b = _b;
    };

    setColors(_r, _g, _b);
    this.getColors = function () {
        var colors = {
            r: r,
            g: g,
            b: b
        };
        return colors;
    };
}

module.exports = {
    m_UiManager: m_UiManager
};
