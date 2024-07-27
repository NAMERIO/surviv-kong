"use strict";


var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var GameInput = GameConfig.Input;
var EmoteSlot = GameConfig.EmoteSlot;
var GameObject = require("./gameObject.js");
var mapHelpers = require("./mapHelpers.js");
var math = require("./math.js");
var net = require("./net.js");
var util = require("./util.js");
var v2 = require("./v2.js");

var device = require("./device.js");
var helpers = require("./helpers.js");
var proxy = require("./proxy.js");

var Airdrop = require("./airdrop.js");
var Bullet = require("./bullet.js");
var Camera = require("./camera.js");
var DeadBody = require("./deadBody.js");
var DebugLines = require("./debugLines.js");
var Decal = require("./decal.js");
var Editor = require("./editor.js");
var Emote = require("./emote.js");
var Explosion = require("./explosion.js");
var FirebaseManager = require("./FirebaseManager.js");
var Flare = require("./flare.js");
var Gas = require("./gas.js");
var Input = require("./input.js");
var Loot = require("./loot.js");
var Map = require("./map.js");
var ObjectPool = require("./objectPool.js");
var Particles = require("./particles.js");
var Plane = require("./plane.js");
var Player = require("./player.js");
var Projectile = require("./projectile.js");
var Renderer = require("./renderer.js");
var Shot = require("./shot.js");
var Smoke = require("./smoke.js");
var Structure = require("./structure.js");
var Touch = require("./touch.js");
var Ui = require("./ui.js");
var Ui2 = require("./ui2.js");
var TrapManager = require("./trapManager.js");

var BulletDefs = require("./bulletDefs.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var RoleDefs = require("./roleDefs.js");
var collider = require("./collider.js");

//Tracking quest from map
var updateQuestMarkersTime = 1.5; //Seconds before try to update beacons
var radioUpdateTrackingQuest = 32; //Distance the player walk before update beacons
var offsetAreaBeacon = 20; //This offset is the max distance that the beacon can appear from the mision location
var numberBeacons = 1; //Beacons per quest

/**
 * 
 * @param {import("./pixi.js")} pixi
 * @param {*} audioManager 
 * @param {*} localization 
 * @param {*} config 
 * @param {*} input 
 * @param {*} inputBinds 
 * @param {*} inputBindUi 
 * @param {*} adManager 
 * @param {*} ambience 
 * @param {*} resourceManager 
 * @param {*} onJoin 
 * @param {*} onQuit 
 * @param {*} analytics 
 * @param {*} pass 
 * @param {*} opponentMenu 
 * @param {*} account 
 * @param {*} spineObjManager 
 * @param {*} weaponSelector 
 * @param {import('./bugbattle')} bugBattle 
 */
function m_Game(pixi, audioManager, localization, config, input, inputBinds, inputBindUi, adManager, ambience, resourceManager, onJoin, onQuit, analytics, pass, opponentMenu, account, spineObjManager, weaponSelector, bugBattle) {
    this.initialized = false;
    this.teamMode = 0;

    // Callbacks
    this.onJoin = onJoin;
    this.onQuit = onQuit;
    this.pixi = pixi;
    this.m_audioManager = audioManager;
    this.m_ambience = ambience;
    this.localization = localization;
    this.config = config;
    this.m_input = input;
    this.m_inputBinds = inputBinds;
    this.m_inputBindUi = inputBindUi;
    this.adManager = adManager;
    this.resourceManager = resourceManager;
    this.victoryMusic = null;
    this.analytics = analytics;
    this.opponentMenu = opponentMenu;
    /** @type {import('./account')} */
    this.account = account;
    this.pass = pass;
    this.SpineObjManager = spineObjManager;
    /** @type {import('./weapon-selection')} */
    this.weaponSelector = weaponSelector;
    this.gameAreaWrapper = $('#game-area-wrapper');

    // Connection status
    /** @type {WebSocket} */
    this.ws = null;
    this.connecting = false;
    this.connected = false;
    /** @type {import('./bugbattle')} */
    this.bugBattle = bugBattle;
    /** @type {import('./player').Player} */
    this.m_activePlayer = null;
    /** @type {import('./player').m_PlayerBarn} */
    this.m_playerBarn = null;
    /** @type {import('./ui').m_UiManager} */
    this.m_uiManager = null;
}

m_Game.prototype = {

    m_tryJoinGame: function m_tryJoinGame(url, matchPriv, loadoutPriv, loadoutStats, questPriv, hasGoldenBP, onConnectFail, battleTag, isUnlinked) {
        var _this = this;

        if (this.connecting || this.connected || this.initialized || this.weaponSelector.active) {
            return;
        }

        // @HACK
        if (this.ws) {
            this.ws.onerror = function () {};
            this.ws.onopen = function () {};
            this.ws.onmessage = function () {};
            this.ws.onclose = function () {};
            this.ws.close();
            this.ws = null;
        }

        this.connecting = true;
        this.connected = false;

        try {
            this.ws = new WebSocket(url);
            this.ws.binaryType = 'arraybuffer';

            this.ws.onerror = function (err) {
                console.error(err);
                if (_this.ws) {
                    _this.ws.close();
                }
            };

            this.ws.onopen = function () {
                var name = battleTag;
                var autoMelee = _this.config.get('autoMelee');
                var aimAssist = _this.config.get('aimAssist');
                var profile = _this.config.get('profile');
                var progressNotificationActive = _this.config.get('progressNotificationActive');
                var joinMessage = new net.JoinMsg();
                joinMessage.protocol = GameConfig.protocolVersion;
                joinMessage.matchPriv = matchPriv;
                joinMessage.loadoutPriv = loadoutPriv;
                joinMessage.loadoutStats = loadoutStats;
                joinMessage.hasGoldenBP = hasGoldenBP;
                joinMessage.kpg = profile && profile.kpg ? profile.kpg : '0.0';
                joinMessage.questPriv = questPriv;
                joinMessage.name = name;
                joinMessage.isUnlinked = isUnlinked;
                joinMessage.autoMelee = autoMelee;
                joinMessage.aimAssist = aimAssist;
                joinMessage.progressNotificationActive = progressNotificationActive;
                joinMessage.useTouch = device.touch;
                joinMessage.isMobile = device.mobile || window.mobile;
                joinMessage.proxy = !/.*surviv\.io$/.test(window.location.hostname);
                joinMessage.otherProxy = !proxy.m_authLocation();
                joinMessage.bot = false;
                joinMessage.curWeapType = ''; //this.weaponSelector.weaponDefId;
                joinMessage.WeaponSelectionTicker = _this.weaponSelector.waitTime;
                _this.m_sendMessage(net.Msg.Join, joinMessage, 18 * 1024);
                _this.bugBattle.startGameData();
                _this.bugBattle.logEvent('Join game', {
                    loadout: _this.account.loadout,
                    loadoutIds: _this.account.loadoutIds
                });
            };

            this.ws.onmessage = function (e) {
                var msgStream = new net.MsgStream(e.data);
                while (true) {
                    var type = msgStream.deserializeMsgType();
                    if (type == net.Msg.None) {
                        break;
                    }
                    _this.m_onMessage(type, msgStream.getStream());
                }
            };

            this.ws.onclose = function () {
                var displayingStats = _this.m_uiManager && _this.m_uiManager.displayingStats;

                var connecting = _this.connecting;
                var connected = _this.connected;
                _this.connecting = false;
                _this.connected = false;
                if (connecting) {
                    onConnectFail();
                } else if (connected && !_this.gameOver && !displayingStats) {
                    _this.weaponSelector.hide();
                    var errMsg = _this.disconnectMsg || 'index-host-closed';
                    _this.onQuit(errMsg);
                }
            };
        } catch (err) {
            console.error(err);
            this.weaponSelector.hide();
            this.connecting = false;
            this.connected = false;
            onConnectFail();
        }
    },

    m_init: function m_init() {
        var _TypeToPool;

        this.canvasMode = this.pixi.renderer.type == PIXI.RENDERER_TYPE.CANVAS;

        // Anti-cheat
        this.m_mangle = false;
        this.m_frame = 0;
        this.m_cheatDetected = false;
        this.m_cheatSentLoadoutMsg = false;

        // Modules
        this.m_touch = new Touch.m_Touch(this.m_input, this.config);
        this.m_camera = new Camera.m_Camera();
        this.m_renderer = new Renderer.m_Renderer(this, this.canvasMode);
        this.m_particleBarn = new Particles.m_ParticleBarn(this.m_renderer);
        this.m_decalBarn = new Decal.m_DecalBarn();
        this.m_map = new Map.m_Map(this.m_decalBarn, this.resourceManager.spineData, this.SpineObjManager);
        this.m_playerBarn = new Player.m_PlayerBarn(this.resourceManager.spineData, this.SpineObjManager);
        this.m_bulletBarn = new Bullet.m_BulletBarn(this.resourceManager.spineData.projectiles);
        this.m_flareBarn = new Flare.m_FlareBarn();
        this.m_projectileBarn = new Projectile.m_ProjectileBarn();
        this.m_explosionBarn = new Explosion.m_ExplosionBarn(this.resourceManager.spineData.projectiles);
        this.m_planeBarn = new Plane.m_PlaneBarn(this.m_audioManager);
        this.m_airdropBarn = new Airdrop.m_AirdropBarn();
        this.m_smokeBarn = new Smoke.m_SmokeBarn();
        this.m_deadBodyBarn = new DeadBody.m_DeadBodyBarn();
        this.m_lootBarn = new Loot.m_LootBarn();
        this.m_gas = new Gas.m_Gas(this.canvasMode);
        this.m_ui2Manager = new Ui2.m_Ui2Manager(this.localization, this.m_inputBinds);
        this.m_uiManager = new Ui.m_UiManager(this, this.m_audioManager, this.m_particleBarn, this.m_planeBarn, this.localization, this.canvasMode, this.m_touch, this.m_inputBinds, this.m_inputBindUi, this.adManager, this.opponentMenu, this.analytics, this.account, this.m_ui2Manager);
        this.m_emoteManager = new Emote.m_EmoteManager(this.m_audioManager, this.m_uiManager, this.m_playerBarn, this.m_camera, this.m_map);
        this.m_shotBarn = new Shot.m_ShotBarn(this.m_particleBarn, this.m_audioManager, this.m_uiManager);

        this.m_TrapManager = new TrapManager(this.m_playerBarn, true, { PIXI: PIXI,
            ctx: {
                audioManager: this.m_audioManager,
                renderer: this.m_renderer,
                particleBarn: this.m_particleBarn,
                map: this.m_map,
                smokeBarn: this.m_smokeBarn,
                decalBarn: this.m_decalBarn
            },
            SpineObjManager: this.SpineObjManager
        });

        // Register types
        var TypeToPool = (_TypeToPool = {}, (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Player, this.m_playerBarn.m_playerPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Obstacle, this.m_map.m_obstaclePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Loot, this.m_lootBarn.m_lootPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.DeadBody, this.m_deadBodyBarn.m_deadBodyPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Building, this.m_map.m_buildingPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Structure, this.m_map.m_structurePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Decal, this.m_decalBarn.m_decalPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Projectile, this.m_projectileBarn.m_projectilePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Smoke, this.m_smokeBarn.m_smokePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Airdrop, this.m_airdropBarn.m_airdropPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Npc, this.m_map.m_npcPool), _TypeToPool);

        this.m_objectCreator = new ObjectPool.Creator();
        for (var type in TypeToPool) {
            if (TypeToPool.hasOwnProperty(type)) {
                this.m_objectCreator.registerType(type, TypeToPool[type]);
            }
        }

        // Render ordering
        this.debugDisplay = new PIXI.Graphics();

        var pixiContainers = [this.m_map.display.ground, this.m_renderer.layers[0], this.m_renderer.ground, this.m_renderer.layers[1], this.m_renderer.layers[2], this.m_renderer.layers[3], this.m_map.display.overlay, this.m_map.display.flash, this.debugDisplay, this.m_gas.gasRenderer.display, this.m_touch.container, this.m_emoteManager.container, this.m_uiManager.container, this.m_uiManager.m_pieTimer.container,
        //this.m_ui2Manager.mobileSkillCooldown.container,
        this.m_emoteManager.indContainer];

        for (var i = 0; i < pixiContainers.length; i++) {
            var container = pixiContainers[i];
            if (container) {
                container.interactiveChildren = false;
                this.pixi.stage.addChild(container);
            }
        }

        // Local vars
        this.disconnectMsg = '';

        this.playing = false;
        this.gameOver = false;
        this.spectating = false;
        this.inputMsgTimeout = 0.0;
        this.prevInputMsg = new net.InputMsg();
        this.playingTicker = 0.0;
        this.updateRecvCount = 0;

        this.updatePass = false;
        this.updatePassDelay = 0.0;

        this.m_localId = 0;
        this.m_activeId = 0;
        /** @type {import('./player').Player} */
        this.m_activePlayer = null;
        this.m_validateAlpha = false;

        this.m_targetZoom = 1.0;
        this.debugZoom = 1.0;
        this.useDebugZoom = false;

        // Latency determination
        this.seq = 0;
        this.seqInFlight = false;
        this.seqSendTime = 0.0;
        this.pings = [];
        this.debugPingTime = 0.0;

        // Process config
        this.m_camera.setShakeEnabled(this.config.get('screenShake'));
        this.m_playerBarn.anonPlayerNames = this.config.get('anonPlayerNames');
        this.m_playerBarn.progressNotificationActive = this.config.get('progressNotificationActive');
        this.m_playerBarn.activePlayerSkin = this.config.get('character_skin') || 0;

        //Tracking quest from map
        this.lastPlayerPos = { x: -1, y: -1 };
        this.updateQuestMarkers = true;
        this.bigMapActive = false;
        this.m_uiManager.loadQuestsOnMap();
        this.initialized = true;
    },

    m_free: function m_free() {
        if (this.ws) {
            this.ws.onmessage = function () {};
            this.ws.close();
            this.ws = null;
        }
        this.connecting = false;
        this.connected = false;

        if (this.initialized) {
            this.initialized = false;

            this.updatePass = false;
            this.updatePassDelay = 0.0;

            // Reverse order from init
            this.m_emoteManager.m_free();
            this.m_ui2Manager.m_free();
            this.m_uiManager.m_free();
            this.m_gas.free();
            this.m_airdropBarn.m_free();
            this.m_planeBarn.m_free();
            this.m_map.m_free();
            this.m_particleBarn.m_free();
            this.m_renderer.m_free();
            this.m_input.m_free();

            this.SpineObjManager.cleanObjs();

            // Stop all sounds
            this.m_audioManager.stopAll();

            while (this.pixi.stage.children.length > 0) {
                var c = this.pixi.stage.children[0];
                this.pixi.stage.removeChild(c);
                c.destroy({
                    children: true
                });
            }
        }
    },

    m_warnPageReload: function m_warnPageReload() {
        return this.initialized && this.playing && !this.spectating && !this.m_uiManager.displayingStats;
    },

    m_update: function m_update(dt) {
        var _this2 = this;

        var smokeParticles = this.m_smokeBarn.particles;
        var obstacles = this.m_map.m_obstaclePool.m_getPool();
        var npcs = this.m_map.m_npcPool.m_getPool();
        var cheatDetected = 0;
        this.m_mangle = true;
        // End anti-cheat hacking

        var debug = {};
        debug.render = debug.render || {};

        if (this.playing) {
            this.playingTicker += dt;
        }

        if (this.updateQuestMarkers) {
            this.updateQuestMarkers = false;

            setTimeout(function () {
                _this2.updateQuestMarkersMap(false);
            }, updateQuestMarkersTime * 1000);
        }

        this.weaponSelector.m_update(dt);
        if (this.weaponSelector.elapsed < 0.0 && this.weaponSelector.active) {
            this.weaponSelector.hide();
        }

        if (this.weaponSelector.elapsed < 0.0 && !this.weaponSelector.active) {
            this.weaponSelector.elapsed = 0;
            var weaponMsg = new net.WeaponMsg();
            weaponMsg.curWeapType = this.weaponSelector.weaponDefId;
            weaponMsg.invulnTicker = this.weaponSelector.elapsed;

            if (!this.bugBattle.hasCurrentGameData('initialWeaponSelected')) {
                this.bugBattle.logEvent('Weapon selected', {
                    weapon: weaponMsg.curWeapType
                });
                this.bugBattle.setCurrentGameData('initialWeaponSelected', weaponMsg.curWeapType);
            }
            this.m_sendMessage(net.Msg.WeaponSelection, weaponMsg, 128);
        }

        this.gameAreaWrapper.css({
            display: this.weaponSelector.active ? 'none' : 'block',
            opacity: this.weaponSelector.active ? 0 : 1
        });
        this.gameAreaWrapper.css({
            display: this.opponentMenu.active ? 'none' : 'block'
        });

        this.m_playerBarn.m_update(dt, this.m_activeId, this.teamMode, this.m_renderer, this.m_particleBarn, this.m_camera, this.m_map, this.m_inputBinds, this.m_audioManager, this.m_ui2Manager, this.m_emoteManager.wheelKeyTriggered, this.m_uiManager.displayingStats, this.spectating, this.pass, this.localization);

        this.m_TrapManager.update(dt);

        this.updateAmbience();

        //Check camera position
        var deadZonePlayerIntersection = this.m_activePlayer.checkCamera(this.m_camera.pos);
        if (!deadZonePlayerIntersection || this.m_activePlayer.cameraMovementTicker > 0.0) {

            if (this.m_activePlayer.cameraMovementTicker > 0.0) {

                //Movement smoth
                if (this.m_activePlayer.applySmooth) {
                    var cameraT = math.clamp(this.m_activePlayer.cameraMovementTicker, 0.0, 1.0); //interpolation time value
                    var t = math.lerp(cameraT, 1.0, dt * GameConfig.camera.cameraAccelaration);

                    if (deadZonePlayerIntersection) {
                        t = math.lerp(cameraT, 1.0, dt * GameConfig.camera.cameraAccelaration * 2.0);
                    }

                    //lerp
                    this.m_camera.pos = math.v2lerp(t, this.m_camera.pos, this.m_activePlayer.pos); //interpolation between current camera pos and new camera pos
                } else {
                    this.m_activePlayer.cameraMovementTicker = 0;
                    this.m_camera.pos = v2.copy(this.m_activePlayer.playerCameraPos);
                }
            } else {
                this.m_camera.pos = v2.copy(this.m_activePlayer.pos);
            }

            // this.m_camera.applyShake();
        }

        if (this.m_activePlayer.cameraPositionDirty) {
            this.m_camera.pos = v2.copy(this.m_activePlayer.pos);
            this.m_activePlayer.cameraPositionDirty = false;
        }

        // Zoom
        var zoom = this.m_activePlayer.m_getZoom();

        var minDim = math.min(this.m_camera.screenWidth, this.m_camera.screenHeight);
        var maxDim = math.max(this.m_camera.screenWidth, this.m_camera.screenHeight);
        var aspect = 16.0 / 9.0;
        var maxScreenDim = math.max(minDim * aspect, maxDim);
        this.m_camera.m_targetZoom = maxScreenDim * 0.5 / (zoom * this.m_camera.ppu);

        /*let zoomLerpIn = this.m_activePlayer.zoomFast ? 3.0 : 2.0;
        let zoomLerpOut = this.m_activePlayer.zoomFast ? 3.0 : 1.4;*/

        var zoomLerpIn = this.m_activePlayer.m_localData.m_zoomInSpeed || 3.0;
        var zoomLerpOut = this.m_activePlayer.m_localData.m_zoomOutSpeed || 3.0;

        var zoomLerp = this.m_camera.m_targetZoom > this.m_camera.m_zoom ? zoomLerpIn : zoomLerpOut;
        this.m_camera.m_zoom = math.lerp(dt * zoomLerp, this.m_camera.m_zoom, this.m_camera.m_targetZoom);

        this.m_audioManager.cameraPos = v2.copy(this.m_camera.pos);

        if (this.m_input.m_keyPressed(Input.Key.Escape)) {
            this.m_uiManager.toggleEscMenu();
        }

        // Large Map
        if (this.m_inputBinds.isBindPressed(GameInput.ToggleMap) || this.m_input.m_keyPressed(Input.Key.G) && !this.m_inputBinds.isKeyBound(Input.Key.G)) {
            this.m_uiManager.displayMapLarge(false);
        }

        // Minimap
        if (this.m_inputBinds.isBindPressed(GameInput.CycleUIMode)) {
            this.m_uiManager.cycleVisibilityMode();
        }

        // Hide UI
        if (this.m_inputBinds.isBindPressed(GameInput.HideUI) || this.m_input.m_keyPressed(Input.Key.Escape) && !this.m_uiManager.hudVisible) {
            this.m_uiManager.cycleHud();
        }

        // Update facing direction
        var playerPos = this.m_activePlayer.pos;
        var mousePos = this.m_camera.m_screenToPoint(this.m_input.m_mousePos);
        var toMousePos = v2.sub(mousePos, playerPos);
        var toMouseLen = v2.length(toMousePos);
        var toMouseDir = toMouseLen > 0.00001 ? v2.div(toMousePos, toMouseLen) : v2.create(1.0, 0.0);

        if (this.m_emoteManager.wheelDisplayed) {
            toMouseLen = this.prevInputMsg.toMouseLen;
            toMouseDir = this.prevInputMsg.toMouseDir;
        }

        // Input
        var inputMsg = new net.InputMsg();

        inputMsg.seq = this.seq;

        if (!this.spectating && !this.bugBattle.isOpened()) {
            if (device.touch) {
                var touchPlayerMovement = this.m_touch.getTouchMovement(this.m_camera, this.config.get('regularAnalogs'));
                var touchAimMovement = this.m_touch.getAimMovement(this.m_activePlayer, this.m_camera, this.config.get('regularAnalogs'));
                var aimDir = v2.copy(touchAimMovement.aimMovement.toAimDir);

                // If we're moving and not aiming/shooting,
                // use the movement direction as our aim direction
                this.m_touch.turnDirTicker -= dt;
                if (this.m_touch.moveDetected && !touchAimMovement.touched) {
                    // Keep looking in the old aimDir while waiting for the ticker
                    var touchDir = v2.normalizeSafe(touchPlayerMovement.toMoveDir, v2.create(1.0, 0.0));
                    var modifiedAimDir = this.m_touch.turnDirTicker < 0.0 ? touchDir : touchAimMovement.aimMovement.toAimDir;
                    this.m_touch.setAimDir(modifiedAimDir);
                    aimDir = modifiedAimDir;
                }

                var aimLen = touchAimMovement.aimMovement.toAimLen;
                var toTouchLenAdjusted = math.clamp(aimLen / this.m_touch.padPosRange, 0.0, 1.0) * GameConfig.player.throwableMaxMouseDist;

                if (touchAimMovement.touched) {
                    this.m_touch.turnDirTicker = this.m_touch.turnDirCooldown;
                    this.lastAimDirLen = toTouchLenAdjusted;
                    inputMsg.lightAttackHold = true;
                } else {
                    var aimLenThreshold = GameConfig.player.throwableMaxMouseDist * 0.9;
                    inputMsg.lightAttackStart = this.lastAimDirLen > aimLenThreshold;
                    this.lastAimDirLen = 0;
                    inputMsg.lightAttackHold = false;
                }

                if (this.m_touch.moveDetected) {
                    inputMsg.touchMoveDir = v2.normalizeSafe(touchPlayerMovement.toMoveDir, v2.create(1.0, 0.0));
                    inputMsg.touchMoveLen = Math.round(math.clamp(touchPlayerMovement.toMoveLen, 0.0, 1.0) * GameConfig.player.maxTouchMoveLength);
                    this.lastTouchMoveLen = inputMsg.touchMoveLen;
                    this.lastTouchMoveDir = inputMsg.touchMoveDir;
                } else {
                    var dashMoveLenThreshold = GameConfig.player.maxTouchMoveLength * 0.9;
                    // Was moving and released on next tick
                    if (this.lastTouchMoveLen > dashMoveLenThreshold) {
                        inputMsg.addInput(GameInput.Dash);
                        inputMsg.touchMoveDir = this.lastTouchMoveDir;
                    }
                    this.lastTouchMoveLen = 0;
                    inputMsg.touchMoveLen = 0;
                }
                inputMsg.touchMoveActive = true;

                inputMsg.toMouseLen = toTouchLenAdjusted;
                inputMsg.toMouseDir = aimDir;
            } else {
                // Only use arrow keys if they are unbound
                inputMsg.moveLeft = this.m_inputBinds.isBindDown(GameInput.MoveLeft) || this.m_input.m_keyDown(Input.Key.Left) && !this.m_inputBinds.isKeyBound(Input.Key.Left);
                inputMsg.moveRight = this.m_inputBinds.isBindDown(GameInput.MoveRight) || this.m_input.m_keyDown(Input.Key.Right) && !this.m_inputBinds.isKeyBound(Input.Key.Right);
                inputMsg.moveUp = this.m_inputBinds.isBindDown(GameInput.MoveUp) || this.m_input.m_keyDown(Input.Key.Up) && !this.m_inputBinds.isKeyBound(Input.Key.Up);
                inputMsg.moveDown = this.m_inputBinds.isBindDown(GameInput.MoveDown) || this.m_input.m_keyDown(Input.Key.Down) && !this.m_inputBinds.isKeyBound(Input.Key.Down);

                inputMsg.toMouseDir = v2.copy(toMouseDir);
                inputMsg.toMouseLen = toMouseLen;

                inputMsg.lightAttackStart = this.m_inputBinds.isBindReleased(GameInput.LightAttack); /*||
                                                                                                     this.m_touch.m_shotDetected;*/
                inputMsg.lightAttackHold = this.m_inputBinds.isBindDown(GameInput.LightAttack); /* ||
                                                                                                this.m_touch.m_shotDetected;*/
            }

            inputMsg.touchMoveDir = v2.normalizeSafe(inputMsg.touchMoveDir, v2.create(1.0, 0.0));
            inputMsg.touchMoveLen = math.clamp(inputMsg.touchMoveLen, 0, 255);
            inputMsg.toMouseDir = v2.normalizeSafe(inputMsg.toMouseDir, v2.create(1.0, 0.0));
            inputMsg.toMouseLen = math.clamp(inputMsg.toMouseLen, 0.0, net.Constants.MouseMaxDist);

            //TODO add mobile support
            inputMsg.offHandAbilityStart = this.m_inputBinds.isBindPressed(GameInput.OffHandAbility) /* ||
                                                                                                     this.m_touch.m_shotDetected*/;
            inputMsg.offHandAbilityHold = this.m_inputBinds.isBindDown(GameInput.OffHandAbility) /*||
                                                                                                 this.m_touch.m_shotDetected*/;

            if (this.m_inputBinds.isBindPressed(GameInput.Skill_1)) {
                inputMsg.selectedSkill = GameConfig.SelectedSkill.Skill_1;
            }

            if (this.m_inputBinds.isBindPressed(GameInput.Skill_2)) {
                inputMsg.selectedSkill = GameConfig.SelectedSkill.Skill_2;
            }

            if (this.m_inputBinds.isBindPressed(GameInput.Skill_3)) {
                inputMsg.selectedSkill = GameConfig.SelectedSkill.Skill_3;
            }

            if (this.m_inputBinds.isBindPressed(GameInput.Dash)) {
                //@TODO: Add dash action    
            }

            inputMsg.portrait = this.m_camera.screenWidth < this.m_camera.screenHeight;

            // Handle inputs
            var checkInputs = [GameInput.Reload, GameInput.Revive, GameInput.Use, GameInput.Loot, GameInput.Cancel,
            /*GameInput.EquipPrimary, @TODO: Remove
            GameInput.EquipSecondary,
            GameInput.EquipThrowable,
            GameInput.EquipMelee,
            GameInput.EquipNextWeap,*/
            GameInput.EquipPrevWeap, GameInput.EquipLastWeap, GameInput.EquipOtherGun, GameInput.EquipPrevScope, GameInput.EquipNextScope, GameInput.StowWeapons];
            for (var i = 0; i < checkInputs.length; i++) {
                var input = checkInputs[i];
                if (this.m_inputBinds.isBindPressed(input)) {
                    inputMsg.addInput(input);
                }
            }

            // Handle Interact
            //
            // Interact should not activate Revive, Use, or Loot if those
            // inputs are bound separately.
            if (this.m_inputBinds.isBindPressed(GameInput.Interact)) {
                var interactBinds = [GameInput.Revive, GameInput.Use, GameInput.Loot];
                var inputs = [];
                for (var _i = 0; _i < interactBinds.length; _i++) {
                    var b = interactBinds[_i];
                    if (!this.m_inputBinds.getBind(b)) {
                        inputs.push(b);
                    }
                }
                if (inputs.length == interactBinds.length) {
                    inputMsg.addInput(GameInput.Interact);
                } else {
                    for (var _i2 = 0; _i2 < inputs.length; _i2++) {
                        inputMsg.addInput(inputs[_i2]);
                    }
                }
            }

            // Swap weapon slots
            if (this.m_inputBinds.isBindPressed(GameInput.SwapWeapSlots) || this.m_uiManager.swapWeapSlots) {
                inputMsg.addInput(GameInput.SwapWeapSlots);
                this.m_activePlayer.gunSwitchCooldown = 0.0;
            }

            // Handle touch inputs
            if (this.m_uiManager.reloadTouched) {
                inputMsg.addInput(GameInput.Reload);
            }
            if (this.m_uiManager.interactionTouched) {
                inputMsg.addInput(GameInput.Interact);
                inputMsg.addInput(GameInput.Cancel);
            }

            // Process 'use' actions trigger from the ui
            for (var _i3 = 0; _i3 < this.m_ui2Manager.uiEvents.length; _i3++) {
                var e = this.m_ui2Manager.uiEvents[_i3];
                if (e.action != 'use') {
                    continue;
                }

                if (e.type == 'weapon') {
                    var weapIdxToInput = {
                        0: GameInput.EquipPrimary,
                        1: GameInput.EquipSecondary,
                        2: GameInput.EquipMelee,
                        3: GameInput.EquipThrowable
                    };
                    var _input = weapIdxToInput[e.data];
                    if (_input) {
                        inputMsg.addInput(_input);
                    }
                } else {
                    if (e.type == "playerStats") {
                        inputMsg.updateStat = e.data;
                    } else if (e.type === 'selectedSkill') {
                        inputMsg.selectedSkill = e.data;
                    } else if (e.type === 'selectedSlot') {
                        inputMsg.useItem = e.data;
                    } else if (e.type === 'offHand') {
                        inputMsg.offHandAbilityStart = true;
                    }
                }
            }

            //Level btn

            if (this.m_inputBinds.isBindPressed(GameInput.LevelUp)) {
                inputMsg.updateStat = 'levelUp';
            } else if (this.m_inputBinds.isBindPressed(GameInput.LevelReset)) {
                inputMsg.updateStat = 'levelReset';
                this.m_ui2Manager.resetLevel();
            }

            if (this.m_inputBinds.isBindPressed(GameInput.RemoveStorm)) {
                inputMsg.removeStorm = 'removeStorm';
                // console.log("Remove Storm");
            }

            // Item use binds @TODO: Refactor slot bottoms
            if (this.m_inputBinds.isBindPressed(GameInput.Bag01)) {
                inputMsg.useItem = GameConfig.Slots.slot1; //'bandage';
            } else if (this.m_inputBinds.isBindPressed(GameInput.Bag02)) {
                inputMsg.useItem = GameConfig.Slots.slot2; //'healthkit';
            } else if (this.m_inputBinds.isBindPressed(GameInput.Bag03)) {
                inputMsg.useItem = GameConfig.Slots.slot3; //'soda';
            } else if (this.m_inputBinds.isBindPressed(GameInput.Bag04)) {
                inputMsg.useItem = GameConfig.Slots.slot4; //'painkiller';
            } else if (this.m_inputBinds.isBindPressed(GameInput.Bag05)) {
                inputMsg.useItem = GameConfig.Slots.slot5; //'healthkit';
            } else if (this.m_inputBinds.isBindPressed(GameInput.Bag06)) {
                inputMsg.useItem = GameConfig.Slots.slot6; //'soda';
            } else if (this.m_inputBinds.isBindPressed(GameInput.Bag07)) {
                inputMsg.useItem = GameConfig.Slots.slot7; //'painkiller';
            }

            // Process 'drop' actions triggered from the ui
            var playDropSound = false;
            for (var _i4 = 0; _i4 < this.m_ui2Manager.uiEvents.length; _i4++) {
                var _e = this.m_ui2Manager.uiEvents[_i4];
                if (_e.action != 'drop') {
                    continue;
                }

                var dropMsg = new net.DropItemMsg();
                if (_e.type == 'weapon') {
                    // Currently DropItemMsg requires both
                    // item and weapIdx to be set for weapons; it
                    // should likely be refactored to only accept
                    // weapIdx and a bool dropWeapon
                    var weapons = this.m_activePlayer.m_localData.m_weapons;
                    dropMsg.item = weapons[_e.data].type;
                    dropMsg.weapIdx = _e.data;
                } else if (_e.type == 'perk') {
                    var perks = this.m_activePlayer.m_netData.m_perks;
                    var perk = perks.length > _e.data ? perks[_e.data] : null;
                    if (perk && perk.droppable) {
                        dropMsg.item = perk.type;
                    }
                } else if (_e.type == 'playerStats') {
                    console.log("type player stats");
                } else {
                    var dropItem = '';
                    if (_e.data == 'helmet') {
                        dropItem = this.m_activePlayer.m_netData.m_helmet;
                    } else if (_e.data == 'chest') {
                        dropItem = this.m_activePlayer.m_netData.m_chest;
                    }if (_e.data == 'neck') {
                        dropItem = this.m_activePlayer.m_netData.m_neck;
                    } else {
                        dropItem = _e.data;
                    }
                    dropMsg.item = dropItem;
                }
                if (dropMsg.item != '') {
                    this.m_sendMessage(net.Msg.DropItem, dropMsg, 128);

                    if (dropMsg.item != 'fists' || dropMsg.item.indexOf('gloves') === -1) {
                        playDropSound = true;
                    }
                }
            }
            if (playDropSound) {
                this.m_audioManager.playSound('loot_drop_01', {
                    channel: 'ui'
                });
            }

            // Process class selection
            if (this.m_uiManager.roleSelected) {
                var roleMsg = new net.PerkModeRoleSelectMsg();
                roleMsg.role = this.m_uiManager.roleSelected;
                this.m_sendMessage(net.Msg.PerkModeRoleSelect, roleMsg, 128);

                this.config.set('perkModeRole', roleMsg.role);
            }
        }

        var specBegin = this.m_uiManager.specBegin;
        var specId = this.m_uiManager.specId;
        var specNext = this.m_uiManager.specNext || this.spectating && this.m_input.m_keyPressed(Input.Key.Right);
        var specPrev = this.m_uiManager.specPrev || this.spectating && this.m_input.m_keyPressed(Input.Key.Left);
        var specForce = this.m_input.m_keyPressed(Input.Key.Right) || this.m_input.m_keyPressed(Input.Key.Left);
        if (specBegin || this.spectating && specNext || specPrev) {
            var specMsg = new net.SpectateMsg();
            specMsg.specBegin = specBegin;
            specMsg.specId = specId;
            specMsg.specNext = specNext;
            specMsg.specPrev = specPrev;
            specMsg.specForce = specForce;
            this.m_sendMessage(net.Msg.Spectate, specMsg, 128);
        }

        this.m_uiManager.specBegin = false;
        this.m_uiManager.specNext = false;
        this.m_uiManager.specPrev = false;
        this.m_uiManager.reloadTouched = false;
        this.m_uiManager.interactionTouched = false;
        this.m_uiManager.swapWeapSlots = false;
        this.m_uiManager.roleSelected = '';

        // Only send a InputMsg if the new data has changed from the previously
        // sent data. For the look direction, we need to determine if the
        // angle difference is large enough.
        var diff = false;
        for (var k in inputMsg) {
            if (!inputMsg.hasOwnProperty(k)) {
                continue;
            }
            if (k == 'inputs') {
                diff = inputMsg[k].length > 0;
            } else if (k == 'toMouseDir' || k == 'touchMoveDir') {
                var dot = math.clamp(v2.dot(inputMsg[k], this.prevInputMsg[k]), -1.0, 1.0);
                var ang = math.rad2deg(Math.acos(dot));
                diff = ang > 0.1;
            } else if (k == 'toMouseLen') {
                diff = Math.abs(this.prevInputMsg[k] - inputMsg[k]) > 0.5;
            } else if (k == 'lightAttackStart') {
                // Always send when lightAttackStart is true, or changed
                diff = inputMsg[k] || inputMsg[k] != this.prevInputMsg[k];
            } else if (k == 'offHandAbilityStart') {
                diff = inputMsg[k] || inputMsg[k] != this.prevInputMsg[k];
            } else if (k == 'skill_1_Start') {
                diff = inputMsg[k] || inputMsg[k] != this.prevInputMsg[k];
            } else if (k == 'skill_2_Start') {
                diff = inputMsg[k] || inputMsg[k] != this.prevInputMsg[k];
            } else if (k == 'skill_3_Start') {
                diff = inputMsg[k] || inputMsg[k] != this.prevInputMsg[k];
            } else if (this.prevInputMsg[k] != inputMsg[k]) {
                diff = true;
            }
            if (diff) {
                break;
            }
        }
        this.inputMsgTimeout -= dt;
        if (diff || this.inputMsgTimeout < 0.0) {
            if (!this.seqInFlight) {
                this.seq = (this.seq + 1) % 256;
                this.seqSendTime = Date.now();
                this.seqInFlight = true;
                inputMsg.seq = this.seq;
            }
            //console.log('sent', 1.0 - this.inputMsgTimeout, Date.now());
            this.bugBattle.setCurrentGameData('currentInput', inputMsg);
            this.m_sendMessage(net.Msg.Input, inputMsg, 128);
            this.inputMsgTimeout = 1.0;
            this.prevInputMsg = inputMsg;
        }

        // Clear cached data
        this.m_ui2Manager.flushInput();

        // Module updates
        this.m_map.m_update(dt, this.m_activePlayer, this.m_playerBarn, this.m_particleBarn, this.m_audioManager, this.m_ambience, this.m_renderer, this.m_camera, smokeParticles, debug);
        this.m_lootBarn.m_update(dt, this.m_activePlayer, this.m_map, this.m_audioManager, this.m_camera, debug);
        this.m_bulletBarn.m_update(dt, this.m_playerBarn, this.m_map, this.m_camera, this.m_activePlayer, this.m_renderer, this.m_particleBarn, this.m_audioManager);
        this.m_flareBarn.m_update(dt, this.m_playerBarn, this.m_map, this.m_camera, this.m_activePlayer, this.m_renderer, this.m_particleBarn, this.m_audioManager);
        this.m_projectileBarn.m_update(dt, this.m_particleBarn, this.m_audioManager, this.m_activePlayer, this.m_map, this.m_renderer, this.m_camera);
        this.m_explosionBarn.m_update(dt, this.m_map, this.m_playerBarn, this.m_camera, this.m_particleBarn, this.m_audioManager, debug);
        this.m_airdropBarn.m_update(dt, this.m_activePlayer, this.m_camera, this.m_map, this.m_particleBarn, this.m_renderer, this.m_audioManager);
        this.m_planeBarn.m_update(dt, this.m_camera, this.m_activePlayer, this.m_map, this.m_renderer);
        this.m_smokeBarn.m_update(dt, this.m_camera, this.m_activePlayer, this.m_map, this.m_renderer);
        this.m_shotBarn.m_update(dt, this.m_activeId, this.m_playerBarn, this.m_particleBarn, this.m_audioManager);
        this.m_particleBarn.m_update(dt, this.m_camera, debug);
        this.m_deadBodyBarn.m_update(dt, this.m_playerBarn, this.m_activePlayer, this.m_map, this.m_camera, this.m_renderer);
        this.m_decalBarn.m_update(dt, this.m_camera, this.m_renderer, debug);
        this.m_uiManager.m_update(dt, this.m_activePlayer, this.m_map, this.m_gas, this.m_lootBarn, this.m_playerBarn, this.m_camera, this.teamMode, this.m_map.factionMode);
        this.m_ui2Manager.m_update(dt, this.m_activePlayer, this.spectating, this.m_playerBarn, this.m_lootBarn, this.m_map, this.m_inputBinds, this.m_touch, this.m_camera);
        this.m_emoteManager.m_update(dt, this.m_localId, this.m_activePlayer, this.teamMode, this.m_deadBodyBarn, this.m_map, this.m_renderer, this.m_input, this.m_inputBinds, this.spectating);
        this.m_touch.update(dt, this.m_activePlayer, this.m_map, this.m_camera, this.m_renderer);
        this.m_renderer.m_update(dt, this.m_camera, this.m_map, debug);

        // Begin anti-cheat
        if (!this.m_cheatSentLoadoutMsg && this.m_map.m_cheatRanDetection && this.m_map.m_cheatDetected) {
            this.m_cheatSentLoadoutMsg = true;
            var p = new net.LoadoutMsg();
            p.emotes = [];
            for (var _i5 = 0; _i5 < this.m_emoteManager.emoteLoadout.length; _i5++) {
                p.emotes.push(this.m_emoteManager.emoteLoadout[_i5]);
            }
            this.m_emoteManager.hasCustomEmotes();
            this.m_sendMessage(net.Msg.Loadout, p, 128);
        }
        // End anti-cheat

        // Send ping/emote messages
        for (var _i6 = 0; _i6 < this.m_emoteManager.newPings.length; _i6++) {
            var _e2 = this.m_emoteManager.newPings[_i6];
            var _p = new net.EmoteMsg();
            _p.type = _e2.type;
            _p.pos = _e2.pos;
            _p.isPing = true;
            this.m_sendMessage(net.Msg.Emote, _p, 128);
        }
        this.m_emoteManager.newPings = [];

        for (var _i7 = 0; _i7 < this.m_emoteManager.newEmotes.length; _i7++) {
            var _e3 = this.m_emoteManager.newEmotes[_i7];
            var _p2 = new net.EmoteMsg();
            _p2.type = _e3.type;
            _p2.pos = _e3.pos;
            _p2.isPing = false;
            this.m_sendMessage(net.Msg.Emote, _p2, 128);
        }
        this.m_emoteManager.newEmotes = [];

        // Render
        this.m_render(dt, debug);

        // Verify the integrity of smoke alphas as a crude anti-cheat
        this.m_frame++;
        if (this.m_frame % 30 == 0) {
            var detectCheatAlphaFn = mapHelpers.m_validateSpriteAlpha;
            // Verify smoke particle alpha integrity
            for (var _i8 = 0; _i8 < smokeParticles.length; _i8++) {
                var _p3 = smokeParticles[_i8];
                if (_p3.active && !_p3.fade && detectCheatAlphaFn(_p3, mapHelpers.m_kMinSmokeAlpha)) {
                    cheatDetected++;
                }
            }
            // Verify obstacle alpha integrity
            for (var _i9 = 0; _i9 < obstacles.length; _i9++) {
                var _p4 = obstacles[_i9];
                if (_p4.active && !_p4.dead && detectCheatAlphaFn(_p4, mapHelpers.m_kMinObstacleAlpha)) {
                    cheatDetected++;
                }
            }

            // Verify npcs alpha integrity
            for (var _i10 = 0; _i10 < npcs.length; _i10++) {
                var _p5 = npcs[_i10];
                if (_p5.active && !_p5.dead && detectCheatAlphaFn(_p5, mapHelpers.m_kMinNpcAlpha)) {
                    cheatDetected++;
                }
            }

            if (cheatDetected) {
                this.m_cheatDetected = true;
            }
            if (cheatDetected && this.m_validateAlpha) {
                helpers.m_cheatDetected(this);
            }
        }
    },

    m_render: function m_render(dt, debug) {
        var grassColor = this.m_map.mapLoaded ? this.m_map.getMapDef().biome.colors.grass : 0x80af49;

        this.pixi.renderer.backgroundColor = grassColor;

        // Module rendering
        this.m_playerBarn.render(this.m_camera, debug);
        this.m_bulletBarn.render(this.m_camera, debug);
        this.debugDisplay.clear(); //TODO change position before debug
        this.m_TrapManager.render(this.m_camera, this.m_activePlayer, debug, DebugLines);
        this.m_flareBarn.render(this.m_camera);
        this.m_decalBarn.render(this.m_camera, debug, this.m_activePlayer.layer);
        this.m_map.render(this.m_camera);
        this.m_gas.render(this.m_camera);
        this.m_uiManager.render(this.m_activePlayer.pos, this.m_gas, this.m_camera, this.m_map, this.m_planeBarn, debug);
        this.m_emoteManager.render(this.m_camera);
        this.m_explosionBarn.render(this.m_camera);

        DebugLines.flush();
    },

    updateQuestMarkersMap: function updateQuestMarkersMap(forceUpdate) {
        var player = this.m_playerBarn.m_getPlayerById(this.m_localId);
        if (player) {
            var questsCompleted = player.questsCompleted;
            var playerPos = player.pos;
            var playerPosFloor = { x: Math.floor(playerPos.x), y: Math.floor(playerPos.y) };
            var diffenceX = Math.abs(playerPosFloor.x - this.lastPlayerPos.x);
            var diffenceY = Math.abs(playerPosFloor.y - this.lastPlayerPos.y);
            if (this.lastPlayerPos && (diffenceX > radioUpdateTrackingQuest || diffenceY > radioUpdateTrackingQuest) && this.bigMapActive || forceUpdate) {
                this.m_uiManager.createQuestMarkers(this.pass.getQuestLocations(this.m_map, playerPos, numberBeacons, questsCompleted, this.m_playerBarn, this.m_playerBarn.m_getPlayerInfo(this.m_localId).teamId, this.m_localId), offsetAreaBeacon);
                this.lastPlayerPos = playerPosFloor;
            }
            this.updateQuestMarkers = true;
        }
    },

    updateAmbience: function updateAmbience() {
        var pos = this.m_activePlayer.pos;

        // Calculate ambient track weights
        var waveWeight = 0.0;
        var riverWeight = 0.0;
        var windWeight = 1.0;
        if (this.m_map.isInOcean(pos)) {
            waveWeight = 1.0;
            riverWeight = 0.0;
            windWeight = 0.0;
        } else {
            // Wave weight
            var kMaxDistToShore = 50.0;
            var distToShore = this.m_map.distanceToShore(pos);
            waveWeight = math.delerp(distToShore, kMaxDistToShore, 0.0);

            // River weight
            var kMaxDistToRiver = 30.0;
            riverWeight = 0.0;
            for (var i = 0; i < this.m_map.terrain.rivers.length; i++) {
                var river = this.m_map.terrain.rivers[i];
                var t = river.spline.getClosestTtoPoint(pos);
                var riverPos = river.spline.getPos(t);
                var dist = v2.length(v2.sub(riverPos, pos));
                var width = river.waterWidth + 2.0;
                var volume = math.delerp(dist, kMaxDistToRiver + width, width);
                // Reduce volume on smaller rivers
                var volumeMult = math.clamp(river.waterWidth / 8.0, 0.25, 1.0);
                riverWeight = math.max(volume * volumeMult, riverWeight);
            }

            // Don't play the river sound underground
            if (this.m_activePlayer.layer == 1) {
                riverWeight = 0.0;
            }

            // Wind weight
            windWeight = 1.0;
        }

        this.m_ambience.getTrack('wind').weight = windWeight;
        this.m_ambience.getTrack('river').weight = riverWeight;
        this.m_ambience.getTrack('waves').weight = waveWeight;

        if (this.m_map.infernoMode) {
            this.m_ambience.getTrack('waves').sound = 'ambient_lava_01';
            this.m_ambience.getTrack('river').sound = 'ambient_lava_01';
        } else {
            this.m_ambience.getTrack('waves').sound = 'ambient_waves_01';
            this.m_ambience.getTrack('river').sound = 'ambient_stream_01';
        }
    },

    m_resize: function m_resize() {
        this.m_camera.screenWidth = device.screenWidth;
        this.m_camera.screenHeight = device.screenHeight;

        this.m_map.resize(this.pixi.renderer, this.canvasMode);
        this.m_gas.resize();
        this.m_uiManager.resize(this.m_map, this.m_camera);
        this.m_touch.resize();
        this.m_renderer.resize(this.m_map, this.m_camera);
    },

    m_processGameUpdate: function m_processGameUpdate(msg) {
        var firstUpdate = this.m_activeId == 0;
        var ctx = {
            audioManager: this.m_audioManager,
            renderer: this.m_renderer,
            particleBarn: this.m_particleBarn,
            map: this.m_map,
            smokeBarn: this.m_smokeBarn,
            decalBarn: this.m_decalBarn
        };

        // Update active playerId
        if (msg.activePlayerIdDirty) {
            this.m_activeId = msg.activePlayerId;
        }

        // Update player infos
        for (var i = 0; i < msg.playerInfos.length; i++) {
            this.m_playerBarn.m_setPlayerInfo(msg.playerInfos[i]);
        }

        // Delete player infos
        for (var _i11 = 0; _i11 < msg.deletedPlayerIds.length; _i11++) {
            var playerId = msg.deletedPlayerIds[_i11];
            this.m_playerBarn.m_deletePlayerInfo(playerId);
        }

        if (msg.playerInfos.length > 0 || msg.deletedPlayerIds.length > 0) {
            this.m_playerBarn.m_recomputeTeamData();
        }

        // Update player status
        if (msg.playerStatusDirty) {
            var teamId = this.m_playerBarn.m_getPlayerInfo(this.m_activeId).teamId;
            this.m_playerBarn.m_updatePlayerStatus(teamId, msg.playerStatus, this.m_map.factionMode);
        }

        // Update group status
        if (msg.groupStatusDirty) {
            var groupId = this.m_playerBarn.m_getPlayerInfo(this.m_activeId).groupId;
            this.m_playerBarn.m_updateGroupStatus(groupId, msg.groupStatus);
        }

        // Delete objects
        for (var _i12 = 0; _i12 < msg.delObjIds.length; _i12++) {
            var id = msg.delObjIds[_i12];
            this.m_objectCreator.deleteObj(msg.delObjIds[_i12]);
        }

        // Update full objects
        for (var _i13 = 0; _i13 < msg.fullObjects.length; _i13++) {
            var obj = msg.fullObjects[_i13];
            this.m_objectCreator.updateObjFull(obj.__type, obj.__id, obj, ctx);
        }

        // Update partial objects
        for (var _i14 = 0; _i14 < msg.partObjects.length; _i14++) {
            var _obj = msg.partObjects[_i14];
            this.m_objectCreator.updateObjPart(_obj.__id, _obj, ctx);
        }

        // Update active player
        this.spectating = this.m_activeId != this.m_localId;
        this.m_activePlayer = this.m_playerBarn.m_getPlayerById(this.m_activeId);
        //this.m_activePlayer.setSpine(this.resourceManager.getSpineData('spineboy'));
        this.m_activePlayer.m_setLocalData(msg.activePlayerData, this.m_playerBarn);
        if (msg.activePlayerData.weapsDirty) {
            this.m_uiManager.weapsDirty = true;
        }

        if (this.spectating && !this.m_uiManager.displayingStats) {
            this.m_uiManager.setSpectateTarget(this.m_activeId, this.m_localId, this.teamMode, this.m_playerBarn, this.account);
            this.m_touch.hideAll();
        }

        this.bugBattle.setCurrentGameData('activePlayerWeaponState', this.m_activePlayer.m_netData.m_curWeapState);
        this.bugBattle.setCurrentGameData('activePlayerStats', {
            powerStat: this.m_activePlayer.m_netData.m_powerStat,
            speedStat: this.m_activePlayer.m_netData.m_speedStat,
            vitalityStat: this.m_activePlayer.m_netData.m_vitalityStat,
            statsPoints: this.m_activePlayer.m_netData.m_statsPoints,
            playerXP: this.m_activePlayer.m_netData.m_playerXP,
            level: this.m_activePlayer.m_netData.m_level
        });
        this.bugBattle.setCurrentGameData('activePlayerStatus', {
            pos: this.m_activePlayer.pos,
            layer: this.m_activePlayer.layer,
            health: this.m_activePlayer.healthNormalizedOld,
            dir: this.m_activePlayer.dir
        });

        this.bugBattle.setCurrentGameData('activePlayerStatusEffects', this.m_activePlayer.effects);
        this.bugBattle.setCurrentGameData('activePlayerBoons', this.m_activePlayer.m_localData.boons);
        this.bugBattle.setCurrentGameData('activePlayerInventory', this.m_activePlayer.m_localData.m_slotsInventory);
        this.bugBattle.setCurrentGameData('activePlayerQuests', {
            quests: this.m_activePlayer.localQuestInfo
        });
        this.m_activePlayer.layer = this.m_activePlayer.m_netData.m_layer;
        this.m_renderer.setActiveLayer(this.m_activePlayer.layer);
        this.m_audioManager.activeLayer = this.m_activePlayer.layer;
        var underground = this.m_activePlayer.isUnderground(this.m_map);
        this.m_renderer.setUnderground(underground);
        this.m_audioManager.underground = underground;
        // Gas data
        if (msg.gasDirty) {
            this.m_gas.setFullState(msg.gasT, msg.gasData, this.m_map, this.m_uiManager);
        }
        if (msg.gasTDirty) {
            this.m_gas.setProgress(msg.gasT);
        }
        this.bugBattle.setCurrentGameData('stormTimer', this.m_uiManager.gasTimerStr);
        // Create bullets
        for (var _i15 = 0; _i15 < msg.bullets.length; _i15++) {
            var b = msg.bullets[_i15];

            var bulletDef = BulletDefs[b.bulletType];

            var bullet = this.m_bulletBarn.getBullet(b.id);
            var isNew = !bullet || bullet && !bullet.alive && bullet.collided;
            if (!bulletDef.updateFromServer || isNew && b.active) {
                Bullet.createBullet(b, this.m_bulletBarn, this.m_flareBarn, this.m_playerBarn, this.m_renderer, this.m_particleBarn);
                // Create shot effects
                /*if (b.shotFx) {
                    this.m_shotBarn.addShot(b);
                }*/
            } else {
                Bullet.m_updateDataBullet(this.m_bulletBarn, b);
            }
        }

        //Create traps
        var trapsLength = msg.traps.length;
        for (var _i16 = 0; _i16 < trapsLength; _i16++) {
            var trap = msg.traps[_i16];
            var params = {
                teamId: trap.teamId,
                ownerId: trap.ownerId,
                ownerType: trap.ownerType,
                position: trap.position,
                layer: trap.layer
            };
            var modifiedParams = {
                hitbox: trap.hitbox
            };
            this.m_TrapManager.createTrap(trap.definitionId, params, modifiedParams);
        }

        //Traps explosions
        trapsLength = msg.removedTraps.length;
        for (var _i17 = 0; _i17 < trapsLength; _i17++) {
            var _trap = msg.removedTraps[_i17];
            this.m_TrapManager.exploteTraps(_trap.definitionId, _trap.ownerId);
        }

        // Create explosions
        for (var _i18 = 0; _i18 < msg.explosions.length; _i18++) {
            var e = msg.explosions[_i18];
            this.m_explosionBarn.addExplosion(this.m_renderer, e.type, e.pos, e.layer);
        }

        // Create emotes and pings
        for (var _i19 = 0; _i19 < msg.emotes.length; _i19++) {
            var _e4 = msg.emotes[_i19];
            if (_e4.isPing) {
                this.m_emoteManager.addPing(_e4, this.m_map.factionMode);
            } else {
                this.m_emoteManager.addEmote(_e4);
            }
        }

        // Update planes
        //  this.m_planeBarn.m_updatePlanes(msg.planes, this.m_map);

        // Create airstrike zones
        for (var _i20 = 0; _i20 < msg.airstrikeZones.length; _i20++) {
            this.m_planeBarn.m_createAirstrikeZone(msg.airstrikeZones[_i20]);
        }

        // Update map indicators
        this.m_uiManager.m_updateMapIndicators(msg.mapIndicators);

        // Update kill leader
        if (msg.killLeaderDirty) {
            var leaderNameText = helpers.htmlEscape(this.m_playerBarn.getPlayerName(msg.killLeaderId, this.m_activeId, true));
            this.m_uiManager.updateKillLeader(msg.killLeaderId, leaderNameText, msg.killLeaderKills, this.m_map.getMapDef().gameMode);
        }

        this.updateRecvCount++;

        // Latency determination
        if (msg.ack == this.seq && this.seqInFlight) {
            this.seqInFlight = false;
            var time = new Date().getTime();
            var elapsed = time - this.seqSendTime;
            this.analytics.pings.push(elapsed);
            this.bugBattle.setCurrentGameData('currentPing', elapsed + ' ms');
        }
    },

    // Socket functions
    m_onMessage: function m_onMessage(type, stream) {
        switch (type) {
            case net.Msg.Joined:
                {
                    var msg = new net.JoinedMsg();
                    msg.deserialize(stream);

                    this.onJoin();

                    this.teamMode = msg.teamMode;
                    this.m_localId = msg.playerId;
                    this.m_validateAlpha = true;

                    this.m_emoteManager.updateEmoteWheel(msg.emotes);
                    this.weaponSelector.updateWeapons(msg.weapons);
                    this.bugBattle.logEvent('Joined game', { teamMode: this.teamMode, playerId: msg.playerId });
                    this.bugBattle.setCurrentGameData('initialWeaponOptions', msg.weapons);
                    this.weaponSelector.show();

                    if (!device.mobile) {
                        this.m_uiManager.ajustNotificationTeamMode(this.teamMode);
                    }
                    if (!msg.started) {
                        this.m_uiManager.setWaitingForPlayers(true);
                    }
                    this.m_uiManager.removeAds();

                    if (this.victoryMusic) {
                        this.victoryMusic.stop();
                        this.victoryMusic = null;
                    }

                    // Play a sound if the user in another windows or tab
                    if (!document.hasFocus()) {
                        this.m_audioManager.playSound('notification_start_01', {
                            channel: 'ui'
                        });
                    }

                    // Update cheat detection
                    if (helpers.m_detectCheatWindowVars() || helpers.m_detectCheatScripts()) {
                        this.m_cheatDetected = true;
                    }

                    break;
                }
            case net.Msg.Map:
                {
                    var _msg = new net.MapMsg();
                    _msg.deserialize(stream);
                    this.m_map.loadMap(_msg, this.m_camera, this.canvasMode, this.m_particleBarn);
                    this.resourceManager.loadMapAssets(this.m_map.mapName);
                    this.m_map.renderMap(this.pixi.renderer, this.canvasMode);

                    this.m_playerBarn.onMapLoad(this.m_map);
                    this.m_bulletBarn.onMapLoad(this.m_map);
                    this.m_particleBarn.onMapLoad(this.m_map);
                    this.m_uiManager.onMapLoad(this.m_map, this.m_camera);
                    this.analytics.playStarts(_msg.mapName);

                    if (this.m_map.perkMode) {
                        var role = this.config.get('perkModeRole');
                        this.m_uiManager.setRoleMenuOptions(role, this.m_map.getMapDef().gameMode.perkModeRoles);
                        this.m_uiManager.setRoleMenuActive(true);
                    } else {
                        this.m_uiManager.setRoleMenuActive(false);
                    }
                    break;
                }
            case net.Msg.Update:
                {
                    var _msg2 = new net.UpdateMsg();
                    _msg2.deserialize(stream, this.m_objectCreator);
                    this.playing = true;
                    this.m_processGameUpdate(_msg2);
                    break;
                }
            case net.Msg.Kill:
                {
                    var _msg3 = new net.KillMsg();
                    _msg3.deserialize(stream);

                    var sourceType = _msg3.itemSourceType || _msg3.mapSourceType;
                    var activeTeamId = this.m_playerBarn.m_getPlayerInfo(this.m_activeId).teamId;
                    var useKillerInfoInFeed = _msg3.downed && !_msg3.killed || _msg3.damageType == GameConfig.DamageType.Gas || _msg3.damageType == GameConfig.DamageType.Bleeding || _msg3.damageType == GameConfig.DamageType.Airdrop;

                    var targetInfo = this.m_playerBarn.m_getPlayerInfo(_msg3.targetId);
                    var killerInfo = this.m_playerBarn.m_getPlayerInfo(_msg3.killCreditId);
                    var killfeedKillerInfo = useKillerInfoInFeed ? killerInfo : this.m_playerBarn.m_getPlayerInfo(_msg3.killerId);

                    var targetName = this.m_playerBarn.getPlayerName(targetInfo.playerId, this.m_activeId, true);
                    var killerName = this.m_playerBarn.getPlayerName(killerInfo.playerId, this.m_activeId, true);
                    var killfeedKillerName = this.m_playerBarn.getPlayerName(killfeedKillerInfo.playerId, this.m_activeId, true);
                    targetName = helpers.htmlEscape(targetName);
                    killerName = helpers.htmlEscape(killerName);
                    killfeedKillerName = helpers.htmlEscape(killfeedKillerName);

                    // Display the kill / downed notification for the active player
                    if (_msg3.killCreditId == this.m_activeId) {
                        var completeKill = _msg3.killerId == this.m_activeId;
                        var suicide = _msg3.killerId == _msg3.targetId || _msg3.killCreditId == _msg3.targetId;
                        this.bugBattle.logEvent('Kill', { targetName: targetName, killed: _msg3.killed, sourceType: sourceType, damageType: _msg3.damageType });

                        var _killText = this.m_ui2Manager.getKillText(killerName, targetName, completeKill, _msg3.downed, _msg3.killed, suicide, sourceType, _msg3.damageType, this.spectating);
                        var killCountText = _msg3.killed && !suicide ? this.m_ui2Manager.getKillCountText(_msg3.killerKills) : '';
                        this.m_ui2Manager.displayKillMessage(_killText, killCountText);
                    } else if (_msg3.targetId == this.m_activeId && _msg3.downed && !_msg3.killed) {
                        var downedText = this.m_ui2Manager.getDownedText(killerName, targetName, sourceType, _msg3.damageType, this.spectating);
                        this.m_ui2Manager.displayKillMessage(downedText, '');
                    }

                    // Update local kill counter
                    if (_msg3.killCreditId == this.m_localId && _msg3.killed) {
                        this.bugBattle.setCurrentGameData('activePlayerKills', _msg3.killerKills);
                        this.m_uiManager.setLocalKills(_msg3.killerKills);
                    }

                    // Add killfeed entry for this kill

                    var killText = this.m_ui2Manager.getKillFeedText(targetName, !killfeedKillerInfo.teamId ? '' : killfeedKillerName, sourceType, _msg3.damageType, _msg3.downed && !_msg3.killed);
                    var killColor = this.m_ui2Manager.getKillFeedColor(activeTeamId, targetInfo.teamId, killerInfo.teamId, this.m_map.factionMode);
                    this.m_ui2Manager.addKillFeedMessage(killText, killColor);

                    if (_msg3.killed) {
                        this.m_playerBarn.killPlayer(_msg3.targetId);

                        if (this.m_activeId === _msg3.targetId) {
                            this.bugBattle.logEvent('Active player killed', { killerName: killerName, targetName: targetName, sourceType: sourceType, damageType: _msg3.damageType });
                        }

                        this.m_playerBarn.addDeathEffect(_msg3.targetId, _msg3.killerId, sourceType, this.m_audioManager, this.m_particleBarn);
                    }

                    // Bullets often don't play hit sounds on the frame that a player dies
                    if (_msg3.type == GameConfig.DamageType.Player) {
                        this.m_bulletBarn.createBulletHit(this.m_playerBarn, _msg3.targetId, this.m_audioManager);
                    }

                    break;
                }
            case net.Msg.RoleAnnouncement:
                {
                    var _msg4 = new net.RoleAnnouncementMsg();
                    _msg4.deserialize(stream);

                    var roleDef = RoleDefs[_msg4.role];
                    if (!roleDef) {
                        break;
                    }

                    var playerInfo = this.m_playerBarn.m_getPlayerInfo(_msg4.playerId);
                    var nameText = helpers.htmlEscape(this.m_playerBarn.getPlayerName(_msg4.playerId, this.m_activeId, true));

                    if (_msg4.assigned) {
                        if (roleDef.sound && roleDef.sound.assign) {
                            if (_msg4.role == 'kill_leader' && this.m_map.getMapDef().gameMode.spookyKillSounds) {
                                // Halloween map has special logic for the kill leader sounds
                                this.m_audioManager.playGroup('kill_leader_assigned', {
                                    channel: 'ui'
                                });
                            } else {
                                // The intent here is to not play the role-specific assignment
                                // sounds in perkMode unless you're the player selecting a role.
                                if (_msg4.role == 'kill_leader' || !this.m_map.perkMode || this.m_localId == _msg4.playerId) {
                                    this.m_audioManager.playSound(roleDef.sound.assign, {
                                        channel: 'ui'
                                    });
                                }
                            }
                        }

                        if (this.m_map.perkMode && this.m_localId == _msg4.playerId) {
                            this.m_uiManager.setRoleMenuActive(false);
                        }

                        if (roleDef.killFeed && roleDef.killFeed.assign) {
                            // In addition to playing a sound, display a notification
                            // on the killfeed
                            var _killText2 = this.m_ui2Manager.getRoleAssignedKillFeedText(_msg4.role, playerInfo.teamId, nameText);
                            var _killColor = this.m_ui2Manager.getRoleKillFeedColor(_msg4.role, playerInfo.teamId, this.m_playerBarn);
                            this.m_ui2Manager.addKillFeedMessage(_killText2, _killColor);
                        }

                        // Show an announcement if you've been assigned a role
                        if (roleDef.announce && this.m_localId == _msg4.playerId) {
                            var assignText = this.m_ui2Manager.getRoleAnnouncementText(_msg4.role, playerInfo.teamId);
                            this.m_uiManager.displayAnnouncement(assignText.toUpperCase());
                        }
                    } else if (_msg4.killed) {
                        if (roleDef.killFeed && roleDef.killFeed.dead) {
                            var _killerName = helpers.htmlEscape(this.m_playerBarn.getPlayerName(_msg4.killerId, this.m_activeId, true));
                            if (_msg4.playerId == _msg4.killerId) {
                                _killerName = '';
                            }
                            var _killText3 = this.m_ui2Manager.getRoleKilledKillFeedText(_msg4.role, playerInfo.teamId, _killerName);
                            var _killColor2 = this.m_ui2Manager.getRoleKillFeedColor(_msg4.role, playerInfo.teamId, this.m_playerBarn);
                            this.m_ui2Manager.addKillFeedMessage(_killText3, _killColor2);
                        }

                        if (roleDef.sound && roleDef.sound.dead) {
                            if (this.m_map.getMapDef().gameMode.spookyKillSounds) {
                                this.m_audioManager.playGroup("kill_leader_dead", {
                                    channel: 'ui'
                                });
                            } else {
                                this.m_audioManager.playSound(roleDef.sound.dead, {
                                    channel: 'ui'
                                });
                            }
                        }
                    }

                    break;
                }
            case net.Msg.PlayerStats:
                {
                    var _msg5 = new net.PlayerStatsMsg();
                    _msg5.deserialize(stream);

                    this.m_uiManager.setLocalStats(_msg5.playerStats);
                    this.m_uiManager.showTeamAd(_msg5.playerStats, _msg5.playerGearStats, this.m_ui2Manager);
                    break;
                }
            case net.Msg.GamePlayerStats:
                {
                    var _msg6 = new net.GamePlayerStatsMsg();
                    _msg6.deserialize(stream);
                    this.m_uiManager.showTeamAd(_msg6.playerStats, _msg6.playerGearStats, this.m_ui2Manager, _msg6.isTeamAlive, this.m_playerBarn);
                    break;
                }
            case net.Msg.Stats:
                {
                    var _msg7 = new net.StatsMsg();
                    _msg7.deserialize(stream);
                    helpers.m_exec('g', _msg7.data, this);
                    break;
                }
            case net.Msg.GameOver:
                {
                    var _msg8 = new net.GameOverMsg();
                    _msg8.deserialize(stream);
                    var player = this.m_playerBarn.m_getPlayerById(this.m_localId);
                    player.gameOver();

                    this.gameOver = _msg8.gameOver;

                    var localTeamId = this.m_playerBarn.m_getPlayerInfo(this.m_localId).teamId;

                    var gameOverResult = void 0;
                    switch (this.gameOver) {
                        case 0:
                            gameOverResult = 'gameover lose';
                            break;
                        case 1:
                            gameOverResult = 'gameover win';
                            break;
                        default:
                            gameOverResult = 'gameover draw';
                    }
                    var playerLoadout = this.m_playerBarn.m_playerInfo[this.m_localId].loadout;
                    this.analytics.playEnds(_msg8, gameOverResult, playerLoadout);
                    this.bugBattle.logEvent('Game over', { gameOverResult: gameOverResult });
                    // Set local stats based on final results.
                    // This is necessary because the last person on a team to die
                    // will not receive a PlayerStats message, they will only receive
                    // the GameOver message.
                    for (var i = 0; i < _msg8.playerStats.length; i++) {
                        var stats = _msg8.playerStats[i];
                        if (stats.playerId == this.m_localId) {
                            this.m_uiManager.setLocalStats(stats);
                            break;
                        }
                    }

                    this.m_uiManager.showStats(_msg8.playerStats, _msg8.playerGearStats, _msg8.teamId, _msg8.teamRank, _msg8.winningTeamId, _msg8.gameOver, _msg8.isTeamAlive, localTeamId, this.teamMode, this.spectating, this.m_playerBarn, this.m_audioManager, this.m_map, this.m_ui2Manager);

                    if (localTeamId == _msg8.winningTeamId) {
                        this.victoryMusic = this.m_audioManager.playSound('victory_music', {
                            channel: 'music',
                            delay: 1300.0,
                            forceStart: true
                        });
                    }

                    this.m_touch.hideAll();
                    break;
                }
            case net.Msg.Pickup:
                {
                    var _msg9 = new net.PickupMsg();
                    _msg9.deserialize(stream);
                    if (_msg9.type == net.PickupMsgType.Success && _msg9.item) {
                        this.m_activePlayer.playItemPickupSound(_msg9.item, this.m_audioManager);

                        var itemDef = GameObjectDefs[_msg9.item];
                        if (itemDef && itemDef.type == 'xp') {
                            this.m_ui2Manager.addRareLootMessage(_msg9.item, true);
                        }
                        if (device.mobile) {
                            this.m_ui2Manager.displayPickupMessageMobile(itemDef);
                        }
                    } else {
                        this.m_ui2Manager.displayPickupMessage(_msg9.type);
                    }
                    break;
                }
            case net.Msg.UpdatePass:
                {
                    var _msg10 = new net.UpdatePassMsg();
                    _msg10.deserialize(stream);

                    this.updatePass = true;
                    this.updatePassDelay = 0.0;
                    break;
                }
            case net.Msg.AliveCounts:
                {
                    var _msg11 = new net.AliveCountsMsg();
                    _msg11.deserialize(stream);

                    if (_msg11.teamAliveCounts.length == 1) {
                        this.m_uiManager.updatePlayersAlive(_msg11.teamAliveCounts[0]);
                        this.bugBattle.setCurrentGameData('aliveCount', _msg11.teamAliveCounts[0]);
                    } else if (_msg11.teamAliveCounts.length >= 2) {
                        this.m_uiManager.updatePlayersAliveRed(_msg11.teamAliveCounts[0]);
                        this.m_uiManager.updatePlayersAliveBlue(_msg11.teamAliveCounts[1]);
                    }

                    break;
                }
            case net.Msg.Disconnect:
                {
                    var _msg12 = new net.DisconnectMsg();
                    _msg12.deserialize(stream);
                    var _playerLoadout = this.m_playerBarn.m_playerInfo[this.m_localId].loadout;
                    this.analytics.playEnds(false, 'gameover disconnect', _playerLoadout);
                    this.bugBattle.logEvent('Game over disconnect', {
                        loadout: _playerLoadout
                    });
                    this.disconnectMsg = _msg12.reason;
                    break;
                }
            case net.Msg.BattleResults:
                {
                    var _msg13 = new net.GameBattleResults();
                    _msg13.deserialize(stream);

                    this.m_uiManager.updateBattleResultStats(_msg13.playerStats, _msg13.playerGearStats, _msg13.gameOver, _msg13.isTeamAlive, this.m_playerBarn);
                    break;
                }
            default:
                break;
        }
    },

    m_sendMessage: function m_sendMessage(type, data, maxLen) {
        var bufSz = maxLen || 128;
        var msgStream = new net.MsgStream(new ArrayBuffer(bufSz));
        msgStream.serializeMsg(type, data);
        this.m_sendMessageImpl(msgStream);
    },

    m_sendMessageImpl: function m_sendMessageImpl(msgStream) {
        // Separate function call so m_sendMessage can be optimized;
        // v8 won't optimize functions containing a try/catch
        if (this.ws && this.ws.readyState == this.ws.OPEN) {
            try {
                this.ws.send(msgStream.getBuffer());
            } catch (e) {
                FirebaseManager.storeGeneric('error', 'sendMessageException');
                this.ws.close();
            }
        }
    }

};

module.exports = {
    m_Game: m_Game
};

