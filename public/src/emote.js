"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var GameConfig = require("./gameConfig.js");
var GameInput = GameConfig.Input;
var EmoteSlot = GameConfig.EmoteSlot;
var PIXI = require("./pixi.js");
var coldet = require("./coldet.js");
var v2 = require("./v2.js");
var math = require("./math.js");
var util = require("./util.js");
var device = require("./device.js");
var helpers = require("./helpers.js");
var Particles = require("./particles.js");
var Input = require("./input.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var EmoteDefs = require("./emoteDefs.js");
var PingDefs = require("./pingDefs.js");

var kEmoteTimeout = 10.0;
var kAirdropIdx = 4;
var kAirstrikeIdx = 5;

// Anti-cheat
var m_bytesToString = function m_bytesToString(bytes) {
    return bytes.map(function (x) {
        return String.fromCharCode(x);
    }).join('');
};
var m_menu = m_bytesToString([109, 101, 110, 117]); // menu
var m_init = m_bytesToString([105, 110, 105, 116]); // init
var m_cheat = m_bytesToString([99, 104, 101, 97, 116]); // cheat

function getImgUrlFromSelector(data) {
    if (data.displayCloseIcon) {
        return 'img/gui/emotes-pings-close.png';
    } else {
        return helpers.getSvgFromGameType(data.ping || data.emote);
    }
}

function vectorToDegreeAngle(vector) {
    var angle = Math.atan2(vector.y, vector.x) * 180 / Math.PI;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
}

// https://stackoverflow.com/questions/11406189/determine-if-angle-lies-between-2-other-angles
function isAngleBetween(target, angle1, angle2) {
    // check if it passes through zero
    // if (angle1 <= angle2) {
    //     return target >= angle1 && target <= angle2;
    // }
    // else {
    //     return target >= angle1 || target <= angle2;
    // }
    if (angle1 <= angle2) {
        if (angle2 - angle1 <= 180) {
            return angle1 <= target && target <= angle2;
        } else {
            return angle2 <= target || target <= angle1;
        }
    } else {
        if (angle1 - angle2 <= 180) {
            return angle2 <= target && target <= angle1;
        } else {
            return angle1 <= target || target <= angle2;
        }
    }
}

function m_EmoteManager(audioManager, uiManager, playerBarn, camera, map) {
    var _this = this;

    this.audioManager = audioManager;
    this.uiManager = uiManager;

    this.gameElem = $('#ui-game');

    this.disable = false;

    this.m_activePlayer = null;
    this.playerBarn = playerBarn;
    this.camera = camera;
    this.map = map;
    this.worldPos = v2.create(0.0, 0.0);
    this.zIdxNext = 0;

    this.emoteSelector = {
        ping: '',
        emote: ''
    };

    // Client ping/emote throttle
    this.emoteSoftTicker = 0.0;
    this.emoteHardTicker = 0.0;
    this.emoteCounter = 0;
    this.emoteWheelsGreyed = false;
    this.teamEmotesGreyed = false;
    this.wheelKeyTriggered = false;
    this.emoteTimeoutTicker = 0.0;

    // Track team pings and emote inputs separately
    this.m_pingKeyTriggered = false;
    this.pingKeyDown = false;
    this.pingMouseTriggered = false;
    this.wheelDisplayed = false;

    this.emoteMouseTriggered = false;

    this.emoteScreenPos = v2.create(0.0, 0.0);

    this.triggerPing = function () {
        if (!_this.m_activePlayer) {
            return;
        }
        var worldPos = void 0;
        // Determine if this is going to be a team ping or an emote
        if (_this.emoteSelector.ping && !_this.emoteWheelsGreyed) {
            var pingData = PingDefs[_this.emoteSelector.ping];
            if (pingData && pingData.pingMap) {
                // Where on the world do we ping?
                worldPos = _this.uiManager.getWorldPosFromMapPos(_this.bigmapPingPos || _this.emoteScreenPos, _this.map, _this.camera);
                if (!worldPos) {
                    worldPos = _this.camera.m_screenToPoint(_this.emoteScreenPos);
                }
                worldPos.x = math.clamp(worldPos.x, 0, _this.map.width);
                worldPos.y = math.clamp(worldPos.y, 0, _this.map.height);
                // Send the ping to the server
                _this.sendPing({
                    type: _this.emoteSelector.ping,
                    pos: worldPos
                });
            }
        } else if (_this.emoteSelector.emote && !_this.emoteWheelsGreyed) {
            worldPos = _this.m_activePlayer.pos;
            // Send the emote to the server
            _this.sendEmote({
                type: _this.emoteSelector.emote,
                pos: worldPos
            });
            _this.uiManager.displayMapLarge(true);
        }
        _this.inputReset();
        _this.m_pingKeyTriggered = _this.pingKeyDown;
    };

    this.triggerEmote = function () {
        if (!_this.m_activePlayer) {
            return;
        }
        var worldPos = void 0;
        if (_this.emoteSelector.emote && !_this.emoteWheelsGreyed) {
            worldPos = _this.m_activePlayer.pos;
            // Send the emote to the server
            _this.sendEmote({
                type: _this.emoteSelector.emote,
                pos: worldPos
            });
        }
        _this.inputReset();
    };

    // Touch listeners
    this.emoteTouchedPos = null;
    this.bigmapPingPos = null;

    this.onTouchStart = function (event) {
        if (_this.wheelDisplayed) {
            event.stopPropagation();
            _this.inputReset();
        }
    };

    if (device.touch) {
        // Add pointer-events to all emotes
        this.emoteElems = $('.ui-emote');
        this.emoteElems.css('pointer-events', 'auto');

        // Open the ping wheel
        this.bigmapCollision = $('#big-map-collision');
        this.bigmapCollision.on('touchend', function (event) {
            event.stopPropagation();
            _this.bigmapPingPos = {
                x: event.originalEvent.changedTouches[0].pageX,
                y: event.originalEvent.changedTouches[0].pageY
            };
            _this.emoteScreenPos = v2.create(_this.camera.screenWidth / 2, _this.camera.screenHeight / 2);
            _this.pingMouseTriggered = true;
        });

        var startTime = 0;
        // Emote button
        this.emoteButtonElem = $('#ui-emote-button');
        this.emoteButtonElem.css('pointer-events', 'auto');
        this.emoteButtonElem.on('touchstart touchend', function (event) {
            event.stopPropagation();
            if (event.type == 'touchstart') {
                _this.inputReset();
                startTime = new Date().getTime();
                if (device.tablet && device.screenWidth > 1024) {
                    _this.emoteScreenPos = v2.create(_this.camera.screenWidth - 140, _this.camera.screenHeight / 3 - 150);
                } else {
                    $('.ui-emote-image-large').addClass('ui-emote-image-small ui-emote-image-sm');
                    _this.emoteScreenPos = v2.create(_this.emoteButtonElem.position().left + 15, _this.emoteButtonElem.position().top + 25);
                }
                _this.emoteMouseTriggered = true;
                $('.ui-emote').addClass('ui-emote-small');
            } else {
                var duration = new Date().getTime() - startTime;
                if (duration > 100) {
                    //Dragging emote
                    if (context.emoteWheelsGreyed) {
                        _this.inputReset();
                    } else {
                        context.emoteTouchedPos = {
                            x: event.originalEvent.changedTouches[0].pageX,
                            y: event.originalEvent.changedTouches[0].pageY
                        };
                    }
                } else {
                    _this.inputReset();
                    $('.ui-emote').removeClass('ui-emote-small');
                    $('.ui-emote-image-large').removeClass('ui-emote-image-small ui-emote-image-sm');
                    _this.emoteScreenPos = v2.create(_this.camera.screenWidth / 2, _this.camera.screenHeight / 2);
                    _this.emoteMouseTriggered = true;
                }
            }
        });

        // Listen for an emote wheel touch
        this.emoteElems.on('touchstart', function (event) {
            event.stopPropagation();
            _this.emoteTouchedPos = {
                x: event.originalEvent.changedTouches[0].pageX,
                y: event.originalEvent.changedTouches[0].pageY
            };
        });

        // Dragging Emote button     
        var context = this;
        this.emoteButtonDragElem = $('#ui-emote-button-drag');
        this.emoteButtonDragElem.css('pointer-events', 'auto');
        this.emoteButtonDragElem.on('touchstart touchend', function (event) {
            event.stopPropagation();
            _this.emoteScreenPos = v2.create(_this.camera.screenWidth / 2, _this.camera.screenHeight / 2);
            _this.emoteMouseTriggered = true;

            if (event.type === 'touchend') {
                if (context.emoteWheelsGreyed) {
                    _this.inputReset();
                } else {
                    context.emoteTouchedPos = {
                        x: event.originalEvent.changedTouches[0].pageX,
                        y: event.originalEvent.changedTouches[0].pageY
                    };
                }
            }
        });

        // Reset wheel
        $(document).on('touchstart', this.onTouchStart);
    }

    this.emoteWheels = $('#ui-emotes, #ui-team-pings');
    this.teamEmotes = $('.ui-emote-left');

    // Emotes
    this.emoteWheel = $('#ui-emotes');
    // Set ping wheel specific data
    this.emoteWheelData = {
        'middle': {
            parent: $('#ui-emote-middle'),
            vA: v2.create(-1.0, 1.0),
            vC: v2.create(1.0, 1.0),
            ping: '',
            emote: '',
            displayCloseIcon: true,
            rarity: ''
        },
        'top': {
            parent: $('#ui-emote-top'),
            vA: v2.create(-1.0, 1.0),
            vC: v2.create(1.0, 1.0),
            ping: '',
            emote: '',
            emoteSlot: EmoteSlot.Top,
            rarity: ''
        },
        'right': {
            parent: $('#ui-emote-right'),
            vA: v2.create(1.0, 1.0),
            vC: v2.create(1.0, -1.0),
            ping: '',
            emote: '',
            emoteSlot: EmoteSlot.Right,
            rarity: ''
        },
        'bottom': {
            parent: $('#ui-emote-bottom'),
            vA: v2.create(1.0, -1.0),
            vC: v2.create(-1.0, -1.0),
            ping: '',
            emote: '',
            emoteSlot: EmoteSlot.Bottom,
            rarity: ''
        },
        'left': {
            parent: $('#ui-emote-left'),
            vA: v2.create(-1.0, -1.0),
            vC: v2.create(-1.0, 1.0),
            ping: '',
            emote: '',
            emoteSlot: EmoteSlot.Left,
            rarity: ''
        }
    };

    // Team pings
    this.teamPingWheel = $('#ui-team-pings');
    // Set ping wheel specific data
    var teamPingData = {
        'middle': {
            parent: $('#ui-team-ping-middle'),
            vA: v2.create(-1.0, 1.0),
            vC: v2.create(1.0, 1.0),
            ping: '',
            emote: '',
            displayCloseIcon: true
        },
        'top': {
            parent: $('#ui-team-ping-top'),
            vA: v2.create(-1.0, 1.0),
            vC: v2.create(1.0, 1.0),
            ping: 'ping_danger',
            emote: ''
        },
        'right': {
            parent: $('#ui-team-ping-right'),
            vA: v2.create(1.0, 1.0),
            vC: v2.create(1.0, -1.0),
            ping: 'ping_coming',
            emote: ''
        },
        'bottom': {
            parent: $('#ui-team-ping-bottom'),
            vA: v2.create(1.0, -1.0),
            vC: v2.create(-1.0, -1.0),
            ping: 'ping_loot',
            emote: ''
        },
        'left': {
            parent: $('#ui-team-ping-left'),
            vA: v2.create(-1.0, -1.0),
            vC: v2.create(-1.0, 1.0),
            ping: '',
            emote: 'emote_heal'
        }
    };

    this.teamPingSelectors = [];
    // Populate the ping selectors
    for (var key in teamPingData) {
        if (!teamPingData.hasOwnProperty(key)) {
            continue;
        }

        var pingData = teamPingData[key];
        var constData = pingData.ping ? PingDefs[pingData.ping] : EmoteDefs[pingData.emote];
        var angleA = vectorToDegreeAngle(pingData.vA);
        var angleC = vectorToDegreeAngle(pingData.vC);

        this.teamPingSelectors.push({
            parent: pingData.parent,
            angleA: angleA,
            angleC: angleC,
            highlight: pingData.parent.find('.ui-emote-hl'),
            highlightDisplayed: false,
            ping: pingData.ping,
            emote: pingData.emote,
            ammoEmote: pingData.ammoEmote,
            displayCloseIcon: pingData.displayCloseIcon
        });
    }

    this.displayedSelectors = this.teamPingSelectors;

    this.baseScale = 1.0;
    this.container = new PIXI.Container();
    this.container.scale.set(this.baseScale, this.baseScale);

    this.pingContainer = new PIXI.Container();
    this.container.addChild(this.pingContainer);

    this.indContainer = new PIXI.Container();

    var createIndicator = function createIndicator(i) {
        var indTint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFFFFFF;

        var pingContainer = new PIXI.Container();
        var indContainer = new PIXI.Container();
        var tint = GameConfig.groupColors[i] || indTint;

        var borderScale = 0.4;
        var pingBorder = PIXI.Sprite.fromImage('ping-border.img');
        pingBorder.scale.set(borderScale, borderScale);
        pingBorder.anchor.set(0.5, 0.5);
        pingBorder.tint = tint;
        pingBorder.alpha = 0.0;
        pingBorder.visible = true;
        pingContainer.addChild(pingBorder);

        var pingScale = 0.4;
        var pingSprite = PIXI.Sprite.fromImage('ping-team-danger.img');
        pingSprite.scale.set(pingScale, pingScale);
        pingSprite.anchor.set(0.5, 0.5);
        pingSprite.tint = tint;
        pingSprite.alpha = 0.0;
        pingSprite.visible = true;
        pingContainer.addChild(pingSprite);

        var indInnerScale = 0.5;
        var indSpriteInner = PIXI.Sprite.fromImage('ping-team-danger.img');
        indSpriteInner.scale.set(indInnerScale, indInnerScale);
        indSpriteInner.anchor.set(0.5, 0.5);
        indSpriteInner.tint = tint;
        indSpriteInner.alpha = 0.0;
        indSpriteInner.visible = true;
        indContainer.addChild(indSpriteInner);

        var indOuterScale = 0.5;
        var indSpriteOuter = PIXI.Sprite.fromImage('ping-indicator.img');
        indSpriteOuter.scale.set(indOuterScale, indOuterScale);
        indSpriteOuter.anchor.set(0.5, 0.0);
        indSpriteOuter.alpha = 0.0;
        indSpriteOuter.visible = true;
        indContainer.addChild(indSpriteOuter);

        return {
            elem: $('#ui-team-indicators').find('.ui-indicator-ping' + ('[data-id=' + i + ']')),
            borderElem: $('#ui-team-indicators').find('.ui-indicator-ping-border' + ('[data-id=' + i + ']')),
            pingContainer: pingContainer,
            indContainer: indContainer,
            borderSprite: {
                sprite: pingBorder,
                baseScale: borderScale
            },
            pingSprite: {
                sprite: pingSprite,
                baseScale: pingScale
            },
            indSpriteOuter: {
                sprite: indSpriteOuter,
                baseScale: indOuterScale,
                baseTint: indSpriteOuter.tint
            },
            indSpriteInner: {
                sprite: indSpriteInner,
                baseScale: indInnerScale,
                baseTint: indSpriteInner.tint
            },
            displayed: false,
            fadeIn: 0.0,
            life: 0.0,
            fadeOut: 0.0,
            pos: v2.create(0.0, 0.0)
        };
    };

    this.pingIndicators = [];
    // Populate ping indicators
    for (var i = 0; i < 4; i++) {
        var indicator = createIndicator(i);

        this.pingContainer.addChild(indicator.pingContainer);
        this.indContainer.addChild(indicator.indContainer);

        this.pingIndicators.push({
            'ping': indicator
        });
    }

    this.airdropIndicator = createIndicator(kAirdropIdx, PingDefs['ping_airdrop'].tint);

    this.pingContainer.addChild(this.airdropIndicator.pingContainer);
    this.indContainer.addChild(this.airdropIndicator.indContainer);

    this.pingIndicators.push({
        'ping': this.airdropIndicator
    });

    this.airstrikeIndicator = createIndicator(kAirstrikeIdx, PingDefs['ping_airstrike'].tint);

    this.pingContainer.addChild(this.airstrikeIndicator.pingContainer);
    this.indContainer.addChild(this.airstrikeIndicator.indContainer);

    this.pingIndicators.push({
        'ping': this.airstrikeIndicator
    });

    this.emoteLifeIn = 0.75;
    this.emoteLife = 1.0;
    this.emoteLifeOut = 0.1;

    this.pingFadeIn = 0.5;
    this.pingLife = 4.25;
    this.pingFadeOut = 0.1;

    this.wedgeOpacityReset = device.touch ? 1.0 : 0.75;
    this.teamEmoteOpacityReset = 0.2;

    this.emotes = [];
    this.newPings = [];
    this.newEmotes = [];

    // Fake anti-cheat properties
    this.emoteLoadout = [];
    this.unlockTypes = {};
    this.socialUnlocked = false;
}

m_EmoteManager.prototype = {
    m_free: function m_free() {
        // Mobile
        if (device.touch) {
            $(document).off('touchstart', this.onTouchStart);
            this.emoteButtonElem.off('touchstart');
            this.emoteButtonDragElem.off('touchstart touchend');
            this.emoteElems.off('touchstart');
            this.bigmapCollision.off('touchend');
        }

        this.m_init();
    },

    m_init: function m_init() {
        this.emoteWheelsGreyed = false;
        this.emoteWheels.css('opacity', 1.0);
        this.teamEmotesGreyed = false;
        this.teamEmotes.css('opacity', 1.0);
        this.disable = false;

        this.inputReset();
    },

    inputReset: function inputReset() {
        this.pingMouseTriggered = false;
        this.m_pingKeyTriggered = false;
        this.emoteMouseTriggered = false;
        this.wheelDisplayed = false;
        this.displayWheel(this.teamPingWheel, false);
        this.displayWheel(this.emoteWheel, false);
        this.emoteTouchedPos = null;
        this.bigmapPingPos = null;
        this.emoteTimeoutTicker = 0.0;

        for (var i = 0; i < this.displayedSelectors.length; i++) {
            var s = this.displayedSelectors[i];
            var emoteData = EmoteDefs[s.emote];
            var teamOnly = emoteData && emoteData.teamOnly;
            if (this.teamEmotesGreyed && teamOnly) {
                s.parent.css('opacity', this.teamEmoteOpacityReset);
            } else {
                s.parent.css('opacity', this.wedgeOpacityReset);
            }
            s.highlight.css('display', 'none');
            s.highlightDisplayed = false;
        }
    },

    sendPing: function sendPing(ping) {
        var e = {};
        e.type = ping.type;
        e.pos = ping.pos;
        this.newPings.push(e);
        this.incrementEmote();
    },

    addPing: function addPing(ping, factionMode) {
        // Given the ping position, create an indicator on the map and make a sound
        if (!this.m_activePlayer) {
            return;
        }

        var pingData = PingDefs[ping.type];
        if (!pingData) {
            return;
        }

        this.uiManager.createPing(ping.type, ping.pos, ping.playerId, this.m_activePlayer.__id, this.playerBarn, factionMode);

        var indicator = null;
        var pingSound = pingData.sound;
        if (ping.type == 'ping_airdrop') {
            indicator = this.pingIndicators[kAirdropIdx]['ping'];
        } else if (ping.type == 'ping_airstrike') {
            indicator = this.pingIndicators[kAirstrikeIdx]['ping'];
        } else {
            var playerInfo = this.playerBarn.m_getPlayerInfo(ping.playerId);
            if (playerInfo) {
                var activeGroupId = this.playerBarn.m_getPlayerInfo(this.m_activePlayer.__id).groupId;
                // A person in our group created this ping,
                // use the appropriate indicator
                var groupId = playerInfo.groupId;
                if (activeGroupId == groupId) {
                    var group = this.playerBarn.getGroupInfo(groupId);
                    var groupIdx = group.playerIds.indexOf(ping.playerId);
                    if (groupIdx !== -1) {
                        indicator = this.pingIndicators[groupIdx]['ping'];
                    }
                }
            }
            var playerStatus = this.playerBarn.m_getPlayerStatus(ping.playerId);
            if (playerStatus && playerStatus.role == 'leader') {
                pingSound = pingData.soundLeader;
            }
        }

        // If we're too far from an air strike ping in non-faction mode, reduce the ping sound
        if (!factionMode && ping.type == 'ping_airstrike') {
            this.audioManager.playSound(pingSound, {
                channel: "ui",
                fallOff: 1.0,
                soundPos: ping.pos,
                rangeMult: 20.0
            });
        } else {
            // Pings always play at full volume
            this.audioManager.playSound(pingSound, {
                channel: "ui"
            });
        }

        if (indicator) {
            indicator.pos = ping.pos;
            indicator.pingSprite.sprite.texture = PIXI.Texture.fromImage(pingData.texture);
            indicator.indSpriteInner.sprite.texture = PIXI.Texture.fromImage(pingData.texture);
            indicator.indSpriteInner.sprite.tint = pingData.mapEvent ? pingData.tint : indicator.indSpriteInner.baseTint;
            indicator.indSpriteOuter.sprite.tint = pingData.mapEvent ? pingData.tint : indicator.indSpriteOuter.baseTint;
            indicator.fadeIn = this.pingFadeIn;
            indicator.life = this.pingLife;
            indicator.fadeOut = this.pingFadeOut;
            indicator.mapEvent = pingData.mapEvent;
            indicator.worldDisplay = pingData.worldDisplay;
        }
    },

    sendEmote: function sendEmote(emote) {
        var e = {};
        e.type = emote.type;
        e.pos = emote.pos;
        this.newEmotes.push(e);
        this.incrementEmote();
    },

    addEmote: function addEmote(emote) {
        var emoteData = EmoteDefs[emote.type];
        if (!emoteData) {
            return;
        }

        // Turn off any other emotes for this player
        var e = null;
        for (var i = 0; i < this.emotes.length; i++) {
            if (!this.emotes[i].alive && !e) {
                e = this.emotes[i];
            } else if (this.emotes[i].alive && this.emotes[i].playerId == emote.playerId) {
                this.emotes[i].alive = false;
            }
        }
        if (!e) {
            e = {};
            e.alive = false;
            e.pos = v2.create(0.0, 0.0);
            e.container = new PIXI.Container();
            e.circleOuter = new PIXI.Sprite.fromImage('emote-circle-outer.img');
            e.circleOuter.anchor.set(0.5, 0.5);
            e.baseScale = 0.55;
            e.circleOuter.scale.set(e.baseScale * 0.8, e.baseScale * 0.8);
            e.circleOuter.tint = 0x000000;
            e.circleOuter.visible = true;

            e.container.addChild(e.circleOuter);

            e.sprite = new PIXI.Sprite();
            e.sprite.anchor.set(0.5, 0.5);
            e.container.addChild(e.sprite);

            var baseTexture = [];
            var sprites = ['fabulorn1.img', 'fabulorn2.img', 'fabulorn3.img', 'fabulorn4.img', 'fabulorn5.img', 'fabulorn6.img', 'fabulorn7.img', 'fabulorn8.img'];
            for (var _i = 0; _i < sprites.length; _i++) {
                var texture = PIXI.Texture.from(sprites[_i]);
                baseTexture.push(texture);
            }
            e.spriteAnimated = new PIXI.extras.AnimatedSprite(baseTexture);
            e.spriteAnimated.visible = false;

            e.container.addChild(e.spriteAnimated);

            e.sprite.scale.set(e.baseScale, e.baseScale);

            e.posOffset = v2.create(0.0, 4.0);
            e.container.scale.set(1.0, 1.0);
            e.container.visible = false;

            this.emotes.push(e);
        }

        e.alive = true;
        e.isNew = true;
        e.type = emote.type;
        e.playerId = emote.playerId;
        e.pos = v2.create(0.0, 0.0);
        e.lifeIn = this.emoteLifeIn;
        e.life = this.emoteLife;
        e.lifeOut = this.emoteLifeOut;
        e.zIdx = this.zIdxNext++;
        e.sprite.texture = PIXI.Texture.fromImage(emoteData.texture);
        e.container.visible = false;
        e.baseScale = 0.55;
        e.sound = emoteData.sound;
        e.channel = emoteData.channel;

        //Sprite


        if (emoteData.isAnimated) {
            var _baseTexture = [];
            for (var _i2 = 0; _i2 < emoteData.sprites.length; _i2++) {
                var _texture = PIXI.Texture.from(emoteData.sprites[_i2]);
                _baseTexture.push(_texture);
            }

            e.spriteAnimated.textures = _baseTexture;

            e.spriteAnimated.anchor.set(0.5, 0.5);
            e.spriteAnimated.scale.set(emoteData.animationScale, emoteData.animationScale);
            e.spriteAnimated.animationSpeed = emoteData.animationSpeed;

            e.spriteAnimated.position.set(0, 0);
            e.spriteAnimated.play();

            e.spriteAnimated.visible = true;
            e.sprite.visible = false;
        } else {
            e.spriteAnimated.visible = false;
            e.sprite.visible = true;
        }

        // Rotate if it's loot and rotation defined
        if (emote.type == 'emote_loot') {
            var lootDef = GameObjectDefs[emote.itemType];
            if (lootDef && lootDef.lootImg) {
                e.sprite.texture = PIXI.Texture.fromImage(lootDef.lootImg.sprite);
                // Colorize if defined
                var ammo = GameObjectDefs[lootDef.ammo];
                if (ammo) {
                    e.circleOuter.tint = ammo.lootImg.tintDark;
                } else {
                    e.circleOuter.tint = 0x000000;
                }
                // Rotate if defined
                if (lootDef.lootImg.rot) {
                    e.sprite.rotation = lootDef.lootImg.rot;
                } else {
                    e.sprite.rotation = 0;
                }
                // Mirror if defined
                if (lootDef.lootImg.mirror) {
                    e.sprite.scale.set(e.baseScale * -1.0, e.baseScale);
                } else {
                    e.sprite.scale.set(e.baseScale, e.baseScale);
                }

                // This 'emote_loot' type is primarily used in potato mode,
                // and we'd like to highlight the new weapon that is acquired.
                //
                // The player plays a deploy sound when equipping new
                // weapons, except gun_switch_01 is played instead for guns
                // if the player is not under a full switch penalty. To work
                // around that, we'll play the proper gun deploy sound here as
                // the emote sound. Similarly, playing melee or throwable deploy
                // sounds here would lead to an echo as they are always played
                // as a part of that player equip logic.
                if (lootDef.sound && lootDef.sound.deploy) {
                    if (lootDef.type == 'gun') {
                        e.sound = lootDef.sound.deploy;
                        e.channel = 'activePlayer';
                    } else {
                        e.sound = '';
                    }
                }
            }
        } else {
            // Reset anything set by a loot emote
            e.circleOuter.tint = 0x000000;
            e.sprite.rotation = 0;
            var scale = emoteData.spriteScale || e.baseScale;
            e.sprite.scale.set(scale, scale);
        }
    },

    incrementEmote: function incrementEmote() {
        this.emoteCounter++;
        if (this.emoteCounter >= GameConfig.player.emoteThreshold) {
            this.emoteHardTicker = this.emoteHardTicker > 0.0 ? this.emoteHardTicker : GameConfig.player.emoteHardCooldown * 1.5;
        }
    },

    m_update: function m_update(dt, localId, player, teamMode, deadBodyBarn, map, renderer, input, inputBinds, spectating) {
        var playerBarn = this.playerBarn;
        var camera = this.camera;
        var mousePos = v2.create(input.m_mousePos.x, input.m_mousePos.y);

        if (input.lostFocus) {
            this.inputReset();
        }

        if (inputBinds.isBindPressed(GameInput.TeamPingMenu)) {
            if (!this.pingKeyDown && !spectating) {
                this.pingKeyDown = true;
                this.m_pingKeyTriggered = true;
            }
        }

        if (inputBinds.isBindReleased(GameInput.TeamPingMenu)) {
            if (this.pingKeyDown) {
                this.pingKeyDown = false;
                this.m_pingKeyTriggered = this.wheelDisplayed;
            }
        }

        if (inputBinds.isBindPressed(GameInput.TeamPingSingle)) {
            if (!this.pingMouseTriggered && !this.emoteMouseTriggered) {
                this.emoteScreenPos = v2.copy(mousePos);
                this.pingMouseTriggered = true;
            }
        }

        if (inputBinds.isBindReleased(GameInput.TeamPingSingle)) {
            if (this.pingMouseTriggered) {
                this.triggerPing();
            }
        }

        if (inputBinds.isBindPressed(GameInput.EmoteMenu)) {
            if (!this.pingMouseTriggered && !this.emoteMouseTriggered && this.pingKeyDown) {
                this.emoteScreenPos = v2.copy(mousePos);
                this.pingMouseTriggered = true;
            }

            if (!this.pingMouseTriggered) {
                this.emoteScreenPos = v2.copy(mousePos);
                this.emoteMouseTriggered = true;
            }
        }

        if (inputBinds.isBindReleased(GameInput.EmoteMenu)) {
            if (this.m_pingKeyTriggered && this.pingMouseTriggered) {
                this.triggerPing();
            }

            if (this.emoteMouseTriggered) {
                this.triggerEmote();
            }
        }

        // Update local emote wheels
        this.m_activePlayer = player;

        var localAlive = localId == player.__id && !player.m_netData.m_dead;
        if (!localAlive && !this.disable) {
            this.m_free();
            this.disable = true;
        }

        var perkModeDisable = map.perkMode && !player.m_netData.m_role;

        if (!this.disable && !perkModeDisable) {
            this.wheelKeyTriggered = this.m_pingKeyTriggered || this.emoteMouseTriggered;

            // Manage emote throttle
            this.emoteSoftTicker -= dt;
            if (this.emoteCounter >= GameConfig.player.emoteThreshold && this.emoteHardTicker > 0.0) {
                this.emoteHardTicker -= dt;
                if (this.emoteHardTicker < 0.0) {
                    this.emoteCounter = 0;
                }
            } else if (this.emoteSoftTicker < 0.0 && this.emoteCounter > 0) {
                this.emoteCounter--;
                this.emoteSoftTicker = GameConfig.player.emoteSoftCooldown * 1.5;
            }

            if ((this.pingMouseTriggered || this.emoteMouseTriggered) && !this.wheelDisplayed) {
                this.parentDisplayed = this.pingMouseTriggered ? this.teamPingWheel : this.emoteWheel;
                this.parentDisplayed.css({
                    display: 'block',
                    left: this.emoteScreenPos.x,
                    top: this.emoteScreenPos.y
                });
                this.displayWheel(this.parentDisplayed, true);
                this.wheelDisplayed = true;
                this.displayedSelectors = this.pingMouseTriggered ? this.teamPingSelectors : this.emoteWheelSelectors;
                this.worldPos = camera.m_screenToPoint(this.emoteScreenPos);
            }

            if (this.wheelDisplayed) {
                // Update emote timeout
                this.emoteTimeoutTicker += dt;

                if (this.emoteTimeoutTicker > kEmoteTimeout) {
                    this.inputReset();
                } else {
                    // Grey out all wheels if we're on cooldown
                    if (this.emoteHardTicker > 0.0 && !this.emoteWheelsGreyed) {
                        this.emoteWheels.css('opacity', 0.5);
                        this.emoteWheelsGreyed = true;
                    } else if (this.emoteHardTicker <= 0.0 && this.emoteWheelsGreyed) {
                        this.emoteWheels.css('opacity', 1.0);
                        this.emoteWheelsGreyed = false;
                    }

                    // Grey out team emotes in solo
                    if (!this.teamEmotesGreyed && teamMode == 1) {
                        this.teamEmotes.css('opacity', this.teamEmoteOpacityReset);
                        this.teamEmotesGreyed = true;
                    }

                    var selector = null;
                    var ping = '';

                    if (device.touch) {
                        mousePos = this.emoteTouchedPos;
                    }

                    if (mousePos) {
                        var vB = v2.sub(mousePos, this.emoteScreenPos);
                        vB.y *= -1;

                        var distToCenter = v2.length(vB);
                        // Arbitrary length to highlight a wedge
                        var angleB = vectorToDegreeAngle(vB);
                        var distMinLength = 35;

                        var equippedWeapon = player.m_localData.m_weapons[player.m_localData.m_curWeapIdx];
                        var weapDef = GameObjectDefs[equippedWeapon.type];
                        var ammoType = '';
                        if (weapDef && weapDef.ammo) {
                            ammoType = weapDef.ammo;
                        }

                        for (var i = 0; i < this.displayedSelectors.length; i++) {
                            var s = this.displayedSelectors[i];

                            if (s.ammoEmote) {
                                var AmmoTypeToEmote = {
                                    '9mm': 'emote_ammo9mm',
                                    '12gauge': 'emote_ammo12gauge',
                                    '762mm': 'emote_ammo762mm',
                                    '556mm': 'emote_ammo556mm',
                                    '50AE': 'emote_ammo50ae',
                                    '308sub': 'emote_ammo308sub',
                                    'flare': 'emote_ammoflare',
                                    '45acp': 'emote_ammo45acp'
                                };

                                var oldEmote = s.emote;
                                s.emote = AmmoTypeToEmote[ammoType] || 'emote_ammo';
                                s.texture = EmoteDefs[s.emote].texture;

                                if (oldEmote != s.emote) {
                                    // Change the image background to our chosen emotes
                                    var imageElem = s.parent.find('.ui-emote-image');
                                    var imgUrl = getImgUrlFromSelector(s);
                                    imageElem.css('background-image', 'url(' + imgUrl + ')');
                                }
                            }

                            var highlight = s.ping || s.emote;
                            var emoteData = EmoteDefs[s.emote];
                            var teamOnly = emoteData && emoteData.teamOnly;

                            var disableInSolo = teamOnly && teamMode == 1;
                            if (distToCenter <= distMinLength && !highlight && this.emoteHardTicker <= 0.0 && !disableInSolo) {
                                selector = s;
                                continue;
                            } else if (isAngleBetween(angleB, s.angleC, s.angleA) && distToCenter > distMinLength && highlight && this.emoteHardTicker <= 0.0 && !disableInSolo) {
                                selector = s;
                                continue;
                            } else if (s.highlightDisplayed) {
                                s.parent.css('opacity', this.wedgeOpacityReset);
                                s.highlight.css('display', 'none');
                                s.highlightDisplayed = false;
                            }
                        }
                    }

                    if (selector) {
                        this.emoteSelector = selector;
                        if (!selector.highlightDisplayed) {
                            selector.parent.css('opacity', 1.0);
                            selector.highlight.css('display', 'block');
                            selector.highlightDisplayed = true;
                        }
                        if (device.touch && this.emoteTouchedPos) {
                            this.pingMouseTriggered ? this.triggerPing() : this.triggerEmote();
                        }
                    }
                }
            }
        }

        // Update emotes (player positioned)
        for (var _i3 = 0; _i3 < this.emotes.length; _i3++) {
            var e = this.emotes[_i3];
            if (!e.alive) {
                continue;
            }

            var hasTarget = false;
            var targetPos = v2.create(0.0, 0.0);
            var targetLayer = 0;

            var targetPlayer = playerBarn.m_getPlayerById(e.playerId);
            if (targetPlayer && !targetPlayer.m_netData.m_dead) {
                targetPos = v2.copy(targetPlayer.pos);
                targetLayer = targetPlayer.layer;
                hasTarget = true;
            }

            if (!hasTarget) {
                var body = deadBodyBarn.getDeadBodyById(e.playerId);
                if (body) {
                    targetPos = v2.copy(body.pos);
                    targetLayer = body.layer;
                    hasTarget = true;
                }
            }

            if (!hasTarget) {
                e.alive = false;
                continue;
            }

            if (e.isNew) {
                // Emotes have falloff
                var _emoteData = EmoteDefs[e.type];
                this.audioManager.playSound(e.sound, {
                    channel: e.channel,
                    soundPos: targetPos,
                    layer: targetLayer
                });
            }
            e.isNew = false;

            e.pos = targetPos;

            if (e.lifeIn > 0) {
                e.lifeIn -= dt;
            } else if (e.life > 0) {
                e.life -= dt;
            } else if (e.lifeOut > 0) {
                e.lifeOut -= dt;
            }

            // Always add to the top layer if visible
            var layer = util.sameLayer(targetLayer, this.m_activePlayer.layer) ? 3 : targetLayer;
            renderer.addPIXIObj(e.container, layer, 50000, e.zIdx);

            e.alive = e.alive && e.lifeOut > 0.0;
        }

        var camExtents = v2.create(camera.screenWidth * 0.5 / camera.z(), camera.screenHeight * 0.5 / camera.z());
        var camAabb = {
            min: v2.sub(camera.pos, camExtents),
            max: v2.add(camera.pos, camExtents)
        };

        // Update indicators and pings (world positioned)
        var groupId = playerBarn.m_getPlayerInfo(player.__id).groupId;
        var groupInfo = playerBarn.getGroupInfo(groupId);
        var groupPlayerCount = groupInfo.playerIds.length;

        for (var _i4 = 0; _i4 < this.pingIndicators.length; _i4++) {
            var indicator = this.pingIndicators[_i4]['ping'];
            var playerId = groupInfo.playerIds[_i4];
            var pingContainer = indicator.pingContainer;
            var indContainer = indicator.indContainer;
            if (playerId == undefined && !indicator.mapEvent) {
                pingContainer.visible = false;
                indContainer.visible = false;
                indicator.displayed = false;
                continue;
            }
            var playerInfo = playerBarn.m_getPlayerInfo(playerId);
            var isActivePlayer = playerId == this.m_activePlayer.__id;
            var playerStatus = playerBarn.m_getPlayerStatus(playerId);
            var borderSprite = indicator.borderSprite.sprite;
            var pingSprite = indicator.pingSprite.sprite;
            var indSpriteOuter = indicator.indSpriteOuter.sprite;
            var indSpriteInner = indicator.indSpriteInner.sprite;
            var hideIndicator = true;
            indicator.fadeIn -= dt;
            indicator.life -= dt;
            indicator.fadeOut -= indicator.life > 0 ? 0 : dt;

            if (indicator.fadeOut > 0.0) {

                var indicatorPos = indicator.pos;
                var dir = v2.normalizeSafe(v2.sub(indicatorPos, camera.pos), v2.create(1.0, 0.0));
                var edge = coldet.intersectRayAabb(camera.pos, dir, camAabb.min, camAabb.max);
                var rot = Math.atan2(dir.y, -dir.x) + Math.PI * 0.5;
                var screenEdge = camera.pointToScreen(edge);
                var onscreen = coldet.testCircleAabb(indicatorPos, GameConfig.player.radius, camAabb.min, camAabb.max);

                var borderScale = camera.pixels(indicator.borderSprite.baseScale);
                var pingScale = camera.pixels(indicator.pingSprite.baseScale);

                borderSprite.scale.set(borderScale, borderScale);
                pingSprite.scale.set(pingScale, pingScale);

                if (playerStatus && playerStatus.dead) {
                    continue;
                }

                var off = 64;
                hideIndicator = indicator.fadeOut < 0.0;
                var leftConstrain = onscreen ? camera.pointToScreen(indicatorPos).x : math.clamp(screenEdge.x, off, camera.screenWidth - off);
                var topConstrain = onscreen ? camera.pointToScreen(indicatorPos).y : math.clamp(screenEdge.y, off, camera.screenHeight - off);

                var left = camera.pointToScreen(indicatorPos).x;
                var top = camera.pointToScreen(indicatorPos).y;

                pingSprite.position.x = left;
                pingSprite.position.y = top;
                borderSprite.position.x = left;
                borderSprite.position.y = top;

                indSpriteOuter.position.x = leftConstrain;
                indSpriteOuter.position.y = topConstrain;
                indSpriteOuter.rotation = rot;

                indSpriteInner.position.x = leftConstrain;
                indSpriteInner.position.y = topConstrain;

                // Update ping border pulse
                var pulseAlpha = borderSprite.alpha <= 0.0 ? 1.0 : borderSprite.alpha - dt;
                borderSprite.alpha = pulseAlpha;
                var pulseScale = camera.pixels(indicator.borderSprite.baseScale * (2.0 - pulseAlpha));
                borderSprite.scale.set(pulseScale, pulseScale);

                indSpriteInner.alpha = onscreen ? 0.0 : pulseAlpha;

                // Update ping fade-in
                if (indicator.fadeIn > 0.0) {
                    var elemOpacity = 1.0 - indicator.fadeIn / this.pingFadeIn;
                    pingContainer.alpha = 1.0;
                    indContainer.alpha = 1.0;
                    pingSprite.alpha = 1.0;
                    indSpriteOuter.alpha = onscreen ? 0.0 : elemOpacity;
                } else {
                    indSpriteOuter.alpha = onscreen ? 0.0 : 1.0;
                }

                // Update ping fade-out
                if (indicator.life < 0.0) {
                    var _elemOpacity = indicator.fadeOut / this.pingFadeOut;
                    pingContainer.alpha = _elemOpacity;
                    indContainer.alpha = _elemOpacity;
                }

                if (!indicator.displayed) {
                    pingContainer.visible = indicator.worldDisplay;
                    // Don't show our own edge of screen indicators
                    indContainer.visible = !isActivePlayer || indicator.mapEvent;
                    indicator.displayed = true;
                }
            }
            if (hideIndicator && indicator.displayed) {
                pingContainer.visible = false;
                indContainer.visible = false;
                indicator.displayed = false;
            }
        }
    },

    displayWheel: function displayWheel(parent, display) {
        parent.css('display', display ? 'block' : 'none');
    },

    updateEmoteWheel: function updateEmoteWheel(emoteLoadout) {
        this.emoteLoadout = emoteLoadout;

        // Map emotes to selector names
        var emotes = {
            'top': emoteLoadout[EmoteSlot.Top],
            'right': emoteLoadout[EmoteSlot.Right],
            'bottom': emoteLoadout[EmoteSlot.Bottom],
            'left': emoteLoadout[EmoteSlot.Left]
        };

        for (var key in emotes) {
            if (!emotes.hasOwnProperty(key)) {
                continue;
            }

            var emoteType = emotes[key];
            var emoteData = EmoteDefs[emoteType];
            if (emoteData && this.emoteWheelData[key]) {
                this.emoteWheelData[key].emote = emoteType;
                this.emoteWheelData[key].rarity = emoteData.rarity;
            }
        }

        this.emoteWheelSelectors = [];
        // Populate the ping selectors
        for (var _key in this.emoteWheelData) {
            if (!this.emoteWheelData.hasOwnProperty(_key)) {
                continue;
            }

            var ewData = this.emoteWheelData[_key];
            var _emoteData2 = EmoteDefs[ewData.emote];
            var angleA = vectorToDegreeAngle(ewData.vA);
            var angleC = vectorToDegreeAngle(ewData.vC);
            ewData.parent.find('.ui-emote-hl').attr('data-rarity', this.emoteWheelData[_key].rarity);
            this.emoteWheelSelectors.push((0, _assign2.default)({
                angleA: angleA,
                angleC: angleC,
                highlight: ewData.parent.find('.ui-emote-hl'),
                highlightDisplayed: false
            }, ewData));

            // Change the image background to our chosen emotes
            var imageElem = ewData.parent.find('.ui-emote-image');
            var imgUrl = getImgUrlFromSelector(ewData);
            imageElem.css('background-image', 'url(' + imgUrl + ')');
        }
    },

    render: function render(camera) {
        for (var i = 0; i < this.emotes.length; i++) {
            var e = this.emotes[i];
            e.container.visible = e.alive;
            if (!e.alive) {
                continue;
            }
            var scale = 0.0;
            if (e.lifeIn > 0.0) {
                var normLifeIn = 1.0 - e.lifeIn / this.emoteLifeIn;
                scale = math.easeOutElastic(normLifeIn);
            } else if (e.life > 0.0) {
                scale = 1.0;
            } else if (e.lifeOut > 0.0) {
                var normLifeOut = e.lifeOut / this.emoteLifeOut;
                scale = normLifeOut;
            }

            var pos = v2.add(e.pos, v2.mul(e.posOffset, 1.0 / math.clamp(camera.m_zoom, 0.75, 1.0)));
            var screenPos = camera.pointToScreen(pos);
            var screenScale = scale * e.baseScale * math.clamp(camera.m_zoom, 0.9, 1.75);

            e.container.position.set(screenPos.x, screenPos.y);
            e.container.scale.set(screenScale, screenScale);
        }
    }
};

module.exports = {
    m_EmoteManager: m_EmoteManager
};
