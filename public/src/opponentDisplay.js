"use strict";


var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./8b1dfb45.js");
var collider = require("./collider.js");
var GameConfig = require("./989ad62a.js");
var GameObject = require("./8649e148.js");
var loadouts = require("./loadouts.js");
var math = require("./10899aea.js");
var v2 = require("./v2.js");
var util = require("./util.js");
var device = require("./device.js");

var Camera = require("./camera.js");
var DebugLines = require("./debugLines.js");
var Decal = require("./decal.js");
var FirebaseManager = require("./FirebaseManager.js");
var Map = require("./map.js");
var ObjectPool = require("./objectPool.js");
var Particles = require("./particles.js");
var Player = require("./player.js");
var Renderer = require("./renderer.js");
var Smoke = require("./smoke.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var StatusEffects = require("./statusEffects.js");

//
// Game
//
function OpponentDisplay(pixi, audioManager, config, inputBinds, account) {
    this.active = false;
    this.initialized = false;

    this.pixi = pixi;
    this.m_audioManager = audioManager;
    this.config = config;
    this.m_inputBinds = inputBinds;
    this.currentLoadout = null;
    this.sceneLenght = 0;
}

OpponentDisplay.prototype = {
    m_init: function m_init() {
        var _TypeToPool;

        this.canvasMode = this.pixi.renderer.type == PIXI.RENDERER_TYPE.CANVAS;

        this.m_camera = new Camera.m_Camera();
        this.m_renderer = new Renderer.m_Renderer(this, this.canvasMode);
        this.m_particleBarn = new Particles.m_ParticleBarn(this.m_renderer);
        this.m_decalBarn = new Decal.m_DecalBarn();
        this.m_map = new Map.m_Map(this.m_decalBarn);
        this.m_playerBarn = new Player.m_PlayerBarn();
        this.m_smokeBarn = new Smoke.m_SmokeBarn();

        // Register types
        var TypeToPool = (_TypeToPool = {}, (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Player, this.m_playerBarn.m_playerPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Obstacle, this.m_map.m_obstaclePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Building, this.m_map.m_buildingPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Structure, this.m_map.m_structurePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Decal, this.m_decalBarn.m_decalPool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Smoke, this.m_smokeBarn.m_smokePool), (0, _defineProperty3.default)(_TypeToPool, GameObject.Type.Npc, this.m_map.m_npcPool), _TypeToPool);

        this.m_objectCreator = new ObjectPool.Creator();
        for (var type in TypeToPool) {
            if (TypeToPool.hasOwnProperty(type)) {
                this.m_objectCreator.registerType(type, TypeToPool[type]);
            }
        }

        // Render ordering
        this.debugDisplay = new PIXI.Graphics();

        var pixiContainers = [this.m_map.display.ground, this.m_renderer.layers[0], this.m_renderer.ground, this.m_renderer.layers[1], this.m_renderer.layers[2], this.m_renderer.layers[3], this.debugDisplay];

        this.sceneLenght = pixiContainers.length;

        for (var i = 0; i < pixiContainers.length; i++) {
            var container = pixiContainers[i];
            if (container) {
                container.interactiveChildren = false;
                this.pixi.stage.addChild(container);
            }
        }

        this.loadout = loadouts.defaultLoadout();
        this.setLoadout(this.loadout);

        this.view = 'outfit';
        this.viewOld = this.view;

        this.cameraOffset = v2.create(0.0, 0.0);
        this.m_targetZoom = 1.0;
        this.debugZoom = 1.0;
        this.useDebugZoom = false;

        this.outfitOld = this.loadout.outfit;

        var mapMsg = {};
        mapMsg.grassInset = 18;
        mapMsg.groundPatches = [];
        mapMsg.height = 720;
        mapMsg.mapName = 'main';
        mapMsg.objects = [];
        mapMsg.places = [];
        mapMsg.rivers = [];
        mapMsg.seed = 218051654;
        mapMsg.shoreInset = 48;
        mapMsg.width = 720;

        this.m_map.loadMap(mapMsg, this.m_camera, this.canvasMode, this.m_particleBarn);

        this.m_activeId = 98;
        this.m_activePlayer = this.m_playerBarn.m_getPlayerById(this.m_activeId);
        var activePlayerData = {};
        activePlayerData.boost = 100;
        activePlayerData.boostDirty = true;
        activePlayerData.hasAction = false;
        activePlayerData.health = 100;
        activePlayerData.inventoryDirty = false;
        activePlayerData.scopedIn = false;
        activePlayerData.spectatorCountDirty = false;
        activePlayerData.cameraPositionDirty = false;
        activePlayerData.weapsDirty = true;
        activePlayerData.curWeapIdx = 1;
        activePlayerData.weapons = [{ type: '', ammo: 0 }, { type: 'scar', ammo: 10 }, { type: 'bayonet_rugged', ammo: 0 }, { type: '', ammo: 0 }];
        this.m_activePlayer.m_setLocalData(activePlayerData, this.m_playerBarn);
        this.m_activePlayer.layer = this.m_activePlayer.m_netData.m_layer;
        this.m_activePlayer.isLoadoutAvatar = true;
        this.m_renderer.setActiveLayer(this.m_activePlayer.layer);
        this.m_audioManager.activeLayer = this.m_activePlayer.layer;

        // Idle anim ticker
        this.animIdleTicker = 3.0;
        this.animSeq = 0;
        this.actionSeq = 0;

        this.hide();
        if (this.currentLoadout) {
            this.setLoadout(this.currentLoadout, true);
        }

        this.initialized = true;

        this.m_resize();
    },

    m_free: function m_free() {
        this.initialized = false;
    },

    setLoadout: function setLoadout(loadout, skipEffects) {
        this.loadout = loadouts.validateLoadout(loadout);

        this.updateCharDisplay();
        if (skipEffects) {
            this.outfitOld = this.loadout.outfit;
        }

        if (this.m_activePlayer) {
            this.m_activePlayer.playActionStartSfx = true;
        }
        this.animIdleTicker = 0.0;
    },

    setView: function setView(view) {
        this.viewOld = this.view;
        this.view = view;
    },

    updateCharDisplay: function updateCharDisplay() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var type = 1;
        var id = 98;
        var ctx = {
            audioManager: this.m_audioManager,
            renderer: this.m_renderer,
            particleBarn: this.m_particleBarn,
            map: this.m_map,
            smokeBarn: this.m_smokeBarn,
            decalBarn: this.m_decalBarn
        };

        // HACK: clear the player particle emitter and reset the anim counter
        if (this.m_activePlayer && this.m_activePlayer.useItemEmitter) {
            this.m_activePlayer.useItemEmitter.stop();
            this.m_activePlayer.useItemEmitter = null;
            this.animIdleTicker = 0.0;
        }

        var obj = {};
        obj.m_outfit = this.loadout.outfit;
        obj.m_backpack = 'backpack02';
        obj.m_helmet = '';
        obj.m_chest = 'chest03';
        obj.m_curWeapType = this.loadout.melee;
        obj.m_layer = 0;
        obj.m_dead = false;
        obj.m_downed = false;
        obj.m_animType = options.animType || 0;
        obj.m_animSeq = options.animSeq || 0;
        obj.m_actionSeq = options.actionSeq || 0;
        obj.m_actionType = options.actionType || 0;
        obj.m_actionItem = options.actionItem || '';
        obj.m_wearingPan = false;
        obj.m_passiveHeal = false;
        obj.m_frozen = false;
        obj.m_frozenOri = 0;
        obj.m_freezeLevel = 0.0;
        obj.m_frenemy = false;
        obj.m_hasteType = 0;
        obj.m_hasteSeq = 0;
        obj.m_scale = 1.0;
        obj.m_freezeActive = false;
        obj.m_flaskEffect = false;
        obj.m_chocolateBoxEffect = false;
        obj.m_luckyEffect = false;
        obj.m_wetEffect = false;

        obj.effects = [];

        obj.m_savedByLuckEffect = 0.0;
        obj.m_loadingBlaster = 0;
        obj.m_gunLoaded = false;
        obj.m_role = '';
        obj.m_perks = [];
        obj.m_perksDirty = false;
        obj.m_pos = v2.create(50.0, 50.0);
        obj.m_dir = v2.create(0.0, -1.0);

        this.m_objectCreator.updateObjFull(1, 98, obj, ctx);

        if (options.deadEffect) {
            var deathEffectSelected = GameObjectDefs[this.loadout.deadEffect];
            if (deathEffectSelected.isParticle) {
                var numParticles = Math.floor(util.random(30, 35));
                for (var i = 0; i < numParticles; i++) {
                    var vel = v2.mul(v2.randomUnit(), util.random(5, 15));
                    var particle = this.loadout.deathEffect;
                    this.m_particleBarn.addParticle(particle, this.m_activePlayer.layer, this.m_activePlayer.pos, vel);
                }
            } else {
                var baseTexture = [];
                for (var _i = 0; _i < deathEffectSelected.sprites.length; _i++) {
                    var texture = PIXI.Texture.from(deathEffectSelected.sprites[_i]);
                    baseTexture.push(texture);
                }

                this.sprite = new PIXI.extras.AnimatedSprite(baseTexture);
                this.sprite.anchor.set(0.5, 0.5);
                this.sprite.scale.set(deathEffectSelected.animationScale, deathEffectSelected.animationScale);
                this.sprite.animationSpeed = deathEffectSelected.animationSpeed;
                this.sprite.visible = true;
                this.sprite.play();
            }
        }

        var playerInfo = {
            playerId: id,
            teamId: 0,
            groupId: 0,
            name: '',
            loadout: {
                outfit: this.loadout.outfit,
                heal: this.loadout.heal,
                boost: this.loadout.boost,
                deathEffect: this.loadout.deathEffect,
                melee: this.loadout.melee,
                armor: this.loadout.armor,
                helmet: this.loadout.helmet,
                ring: this.loadout.ring
            },
            userId: '',
            isUnlinked: ''
        };
        this.m_playerBarn.m_setPlayerInfo(playerInfo);
    },

    getCameraTargetZoom: function getCameraTargetZoom() {
        var modal = document.getElementById('modal-content-left2');
        var modalBound = modal.getBoundingClientRect();
        var heightPct = modalBound.height / this.m_camera.screenHeight * 0.2;
        return heightPct * this.m_camera.screenHeight * 0.5 / this.m_camera.ppu;
    },

    getCameraLoadoutOffset: function getCameraLoadoutOffset() {
        var zoomPrev = this.m_camera.m_zoom;

        var targetZoom = this.getCameraTargetZoom();
        this.m_camera.m_zoom = targetZoom;

        var modal = document.getElementById('modal-content-left2');
        var modalBound = modal.getBoundingClientRect();
        var modalAabb = collider.createAabb(this.m_camera.m_screenToPoint(v2.create(modalBound.left, modalBound.top + modalBound.height)), this.m_camera.m_screenToPoint(v2.create(modalBound.left + modalBound.width, modalBound.top)));
        var modalExt = v2.mul(v2.sub(modalAabb.max, modalAabb.min), 0.5);
        var modalPos = v2.add(modalAabb.min, modalExt);

        var screenAabb = collider.createAabb(this.m_camera.m_screenToPoint(v2.create(0.0, this.m_camera.screenHeight)), this.m_camera.m_screenToPoint(v2.create(this.m_camera.screenWidth, 0.0)));
        var screenExt = v2.mul(v2.sub(screenAabb.max, screenAabb.min), 0.5);
        var screenPos = v2.add(screenAabb.min, screenExt);

        var modalOffset = v2.sub(modalPos, screenPos);
        var viewWidth = screenExt.x - modalOffset.x - modalExt.x;

        var offsetX = math.clamp(viewWidth * 0.5, 2.5, 6.0);
        var offsetY = 0.33;
        var offset = v2.create(modalOffset.x + modalExt.x + offsetX, modalOffset.y + offsetY);

        this.m_camera.m_zoom = zoomPrev;
        return offset;
    },

    show: function show() {
        if (this.active) {
            return;
        }

        for (var i = 0; i < this.sceneLenght; i++) {
            var index = this.pixi.stage.children.length - 1 - i;
            var c = this.pixi.stage.children[index];
            c.visible = true;
        }

        if (this.currentLoadout) {
            this.setLoadout(this.currentLoadout, true);
        }

        this.active = true;
        this.m_resize();
    },

    hide: function hide() {
        if (!this.active) {
            return;
        }

        for (var i = 0; i < this.sceneLenght; i++) {
            var index = this.pixi.stage.children.length - 1 - i;
            var c = this.pixi.stage.children[index];
            c.visible = false;
        }

        this.active = false;
        this.m_camera.m_zoom = 2.0;
    },

    m_update: function m_update(dt, hasFocus) {
        var debug = {};
        debug.render = debug.render || {};

        if (this.sprite) {}
        // this.pixi.renderer.addPIXIObj(this.sprite, this.m_activePlayer.layer, 19, 0);


        // Camera
        this.m_camera.pos = v2.sub(this.m_activePlayer.pos, this.cameraOffset);

        this.m_camera.m_zoom = math.lerp(dt * 5.0, this.m_camera.m_zoom, this.m_camera.m_targetZoom);

        // DebugLines.addAabb(modalAabb.min, modalAabb.max, 0xff0000, 0.0);
        // DebugLines.addCircle(this.m_activePlayer.pos, 1.5, 0xff0000, 0.0);

        this.m_audioManager.cameraPos = v2.copy(this.m_camera.pos);

        // Throw out an idle anim once in a while
        if (hasFocus) {
            if (this.view != this.viewOld && (this.view == 'heal' || this.view == 'boost')) {
                this.animIdleTicker = 0.0;
            }
            this.viewOld = this.view;

            this.animIdleTicker -= dt;
            if (this.animIdleTicker < 0.0) {
                if (this.view == 'heal') {
                    this.actionSeq = (this.actionSeq + 1) % 8;
                    var options = {
                        actionType: GameConfig.Action.UseItem,
                        actionItem: 'bandage',
                        actionSeq: this.actionSeq
                    };
                    this.updateCharDisplay(options);
                    this.animIdleTicker = 2.0 + Math.random();
                } else if (this.view == 'boost') {
                    this.actionSeq = (this.actionSeq + 1) % 8;
                    var _options = {
                        actionType: GameConfig.Action.UseItem,
                        actionItem: 'soda',
                        actionSeq: this.actionSeq
                    };
                    this.updateCharDisplay(_options);
                    this.animIdleTicker = 2.0 + Math.random();
                } else if (this.view == 'deathEffect' && this.loadout.deathEffect !== 'regularDeath') {
                    var _options2 = {
                        deadEffect: true
                    };
                    this.updateCharDisplay(_options2);
                    this.animIdleTicker = 2.0 + Math.random();
                } else if (this.view != 'emote' && this.view != 'crosshair') {
                    this.animSeq = (this.animSeq + 1) % 8;
                    var _options3 = {
                        animType: GameConfig.Anim.Melee,
                        animSeq: this.animSeq
                    };
                    this.updateCharDisplay(_options3);
                    this.animIdleTicker = 1.5 + Math.random();
                }
            }
        }

        // Play a sound when changing oufits
        var outfitDirty = this.loadout.outfit != this.outfitOld;
        this.outfitOld = this.loadout.outfit;
        if (hasFocus && outfitDirty) {
            var itemDef = GameObjectDefs[this.loadout.outfit];
            if (itemDef) {
                this.m_audioManager.playSound(itemDef.sound.pickup, {
                    channel: 'ui'
                });
            }
        }

        this.m_playerBarn.m_update(dt, this.m_activeId, this.teamMode, this.m_renderer, this.m_particleBarn, this.m_camera, this.m_map, this.m_inputBinds, this.m_audioManager, false, false, false);
        this.m_smokeBarn.m_update(dt, this.m_camera, this.m_activePlayer, this.m_map, this.m_renderer);
        this.m_particleBarn.m_update(dt, this.m_camera, debug);
        this.m_decalBarn.m_update(dt, this.m_camera, this.m_renderer, debug);
        this.m_renderer.m_update(dt, this.m_camera, this.m_map, debug);

        this.m_activePlayer.playActionStartSfx = false;

        // Render
        this.m_render(dt, debug);
    },

    m_render: function m_render(dt, debug) {
        var grassColor = this.m_map.mapLoaded ? this.m_map.getMapDef().biome.colors.grass : 0x80af49;

        this.pixi.renderer.backgroundColor = grassColor;

        // Module rendering
        this.m_playerBarn.render(this.m_camera, debug);
        this.m_map.render(this.m_camera);

        DebugLines.flush();
    },

    m_resize: function m_resize() {
        if (this.initialized) {
            this.m_camera.screenWidth = device.screenWidth;
            this.m_camera.screenHeight = device.screenHeight;

            this.m_map.resize(this.pixi.renderer, this.canvasMode);
            this.m_renderer.resize(this.m_map, this.m_camera);

            // @NOTE: recalculating getCameraLoadoutOffset every frame,
            // rather than only on resize, has an effect of reducing the
            // zoom motion a bit when switching into the loadout view.
            // Might be worth considering if that effect is desired.
            this.m_camera.m_targetZoom = this.getCameraTargetZoom();
            this.cameraOffset = this.getCameraLoadoutOffset();
        }
    },

    setCurrentLoadout: function setCurrentLoadout(loadout) {
        this.currentLoadout = loadout;
    }
};

module.exports = {
    OpponentDisplay: OpponentDisplay
};
