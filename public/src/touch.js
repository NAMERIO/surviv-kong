"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var helpers = require("./helpers.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");

var BulletDefs = require("./bulletDefs.js");
var GameObjectDefs = require("./gameObjectDefs.js");

var kDeadZone = 2.0;

//
// Touch
//

var m_Touch = function () {
    function m_Touch(input, config) {
        var _this = this;

        (0, _classCallCheck3.default)(this, m_Touch);

        this.input = input;
        this.config = config;

        this.container = new PIXI.Container();
        this.m_lineSprites = new m_LineSprites();

        this.padScaleBase = 1.0;
        this.padScaleDown = 0.6;
        this.padScaleImage = 0.38;
        this.padScalePos = 0.15;

        this.moveDetected = false;
        this.m_shotDetected = false;
        this.m_shotDetectedOld = false;
        this.touchingAim = false;
        this.display = true;
        this.moveStyle = 'locked';
        this.aimStyle = 'locked';
        this.touchAimLine = true;
        this.sensitivityThereshold = -0.44999 * this.config.get('sensitivity') + 0.45; //Linear Function

        var createPadSprite = function createPadSprite(parent, tint, alpha, image) {
            var pad = PIXI.Sprite.fromImage(image); //?image:'pad.img');
            pad.anchor.set(0.5, 0.5);
            pad.scale.set(1.0, 1.0);
            pad.alpha = alpha;
            pad.visible = false;
            pad.tint = tint;
            parent.addChild(pad);
            return pad;
        };

        var createPad = function createPad(image) {
            return {
                touched: false,
                centerPos: v2.create(-150.0, 0.0),
                touchPos: v2.create(0.0, 0.0),
                centerSprite: createPadSprite(_this.container, 0x000000, 0.2, 'pad.img'),
                imageSprite: createPadSprite(_this.container, 0xFFFFFF, 1.0, image), //image?1.0:0.2
                touchSprite: createPadSprite(_this.container, 0x000000, 1.0, 'pad.img')
            };
        };
        this.touchPads = [createPad(''), createPad('')];

        this.playerMovement = {
            left: false,
            right: false,
            up: false,
            down: false,
            moveLen: 0
        };

        this.analogMovement = {
            toMoveDir: v2.create(1.0, 0.0),
            toMoveLen: 0.0
        };

        this.aimMovement = {
            toAimDir: v2.create(1.0, 0.0),
            toAimLen: 0.0
        };

        this.leftLockedPadCenter = v2.create(0.0, 0.0);
        this.rightLockedPadCenter = v2.create(0.0, 0.0);

        this.padPosBase = 48.0;
        this.padPosRange = 0.0;
        this.movePadDetectMult = 1.0;
        this.shotPadDetectMult = 1.075;

        this.turnDirCooldown = 0.5;
        this.turnDirTicker = 0;

        this.mobileOffsetLandscape = 25.0;
        this.mobileOffsetPortrait = 100.0;

        //126 x: 170.0  y: 100.0
        this.lockedPadOffsetLandscape = v2.create(85.0, 80.0);
        this.lockedPadOffsetPortrait = v2.create(96.0, 160.0);

        this.lockedPadOffsetYLandscapeSafari = 80.0;
        this.lockedPadOffsetYPortraitSafari = 240.0;

        var validateTouchStyle = function validateTouchStyle(style) {
            var validStyles = ['locked', 'anywhere'];
            if (validStyles.indexOf(style) === -1) {
                return 'anywhere';
            }
            return style;
        };
        var moveStyle = validateTouchStyle(config.get('touchMoveStyle'));
        var aimStyle = validateTouchStyle(config.get('touchAimStyle'));

        this.setMoveStyle(moveStyle);
        this.setAimStyle(aimStyle);
        this.setTouchAimLine(!!config.get('touchAimLine'));
        this.init();
    }

    (0, _createClass3.default)(m_Touch, [{
        key: 'setTouchPadSkillSprite',
        value: function setTouchPadSkillSprite(image) {
            this.touchPads[1].imageSprite.texture = PIXI.Texture.fromImage(image);
            this.touchPads[1].imageSprite.alpha = 1.0;
            //this.touchPads[0].centerSprite.texture
        }
    }, {
        key: 'setTouchPadDashSprite',
        value: function setTouchPadDashSprite(image) {
            this.touchPads[0].imageSprite.texture = PIXI.Texture.fromImage(image);
            this.touchPads[0].imageSprite.alpha = 1.0;
        }
    }, {
        key: 'getTouchMovement',
        value: function getTouchMovement(camera, analogValue) {
            return this.getMovement(camera, analogValue);
        }
    }, {
        key: 'getAimMovement',
        value: function getAimMovement(activePlayer, camera, analogValue) {
            var isHoldingThrowable = activePlayer.m_localData.m_curWeapIdx == GameConfig.WeaponSlot.Throwable;
            return this.getAim(isHoldingThrowable, camera, analogValue);
        }
    }, {
        key: 'setAimDir',
        value: function setAimDir(dir) {
            this.aimMovement.toAimDir = v2.copy(dir);
        }
        // 0.45 to 0.00001

    }, {
        key: 'getMovement',
        value: function getMovement(camera, isRegularAnalog) {
            var posDown = null;
            var pos = null;
            var touched = false;
            var toMoveDir = void 0;
            this.moveDetected = false;
            for (var i = 0; i < this.input.touches.length; i++) {
                var t = this.input.touches[i];
                if (!t.isDead) {
                    if (this.isLeftSideTouch(t.posDown.x, camera, isRegularAnalog)) {
                        var center = this.moveStyle == 'anywhere' ? t.posDown : this.leftLockedPadCenter;
                        var pull = v2.sub(t.pos, center);
                        var dist = v2.length(pull);
                        if (dist > kDeadZone) {
                            var toMoveLen = (dist - kDeadZone) / (this.padPosRange / this.movePadDetectMult - kDeadZone);
                            toMoveDir = toMoveLen > this.sensitivityThereshold ? v2.div(pull, toMoveLen) : this.analogMovement.toMoveDir;
                            this.analogMovement = {
                                toMoveDir: v2.create(toMoveDir.x, toMoveDir.y * -1.0),
                                toMoveLen: toMoveLen
                            };
                            this.moveDetected = true;
                        }
                        pos = this.getConstrainedPos(center, t.pos, dist);
                        posDown = center;
                        touched = true;
                        break;
                    }
                }
            }

            var pad = this.touchPads[0];
            if (isRegularAnalog === false) {
                pad = this.touchPads[1];
            }
            pad.touched = touched;
            if (touched && this.moveStyle == 'anywhere') {
                pad.centerPos = v2.copy(posDown);
            } else {
                if (isRegularAnalog === false) {
                    pad.centerPos = v2.copy(this.rightLockedPadCenter);
                } else {
                    pad.centerPos = v2.copy(this.leftLockedPadCenter);
                }
            }

            if (isRegularAnalog === false) {
                pad.touchPos.x = touched ? pos.x : this.rightLockedPadCenter.x;
                pad.touchPos.y = touched ? pos.y : this.rightLockedPadCenter.y;
            } else {
                pad.touchPos.x = touched ? pos.x : this.leftLockedPadCenter.x;
                pad.touchPos.y = touched ? pos.y : this.leftLockedPadCenter.y;
            }

            return this.analogMovement;
        }
    }, {
        key: 'getAim',
        value: function getAim(isHoldingThrowable, camera, isRegularAnalog) {
            var touched = false;
            var posDown = null;
            var pos = null;
            var toAimDir = void 0;
            for (var i = 0; i < this.input.touches.length; i++) {
                var t = this.input.touches[i];
                if (!t.isDead) {
                    if (!this.isLeftSideTouch(t.posDown.x, camera, isRegularAnalog)) {
                        var center = this.aimStyle == 'anywhere' ? t.posDown : this.rightLockedPadCenter;
                        var pull = v2.sub(t.pos, center);
                        var dist = v2.length(pull);
                        if (dist > kDeadZone) {
                            var toAimPos = v2.sub(t.pos, center);
                            var toAimLen = v2.length(toAimPos);
                            toAimDir = toAimLen > this.sensitivityThereshold ? v2.div(toAimPos, toAimLen) : this.aimMovement.toAimDir;
                            this.aimMovement = {
                                toAimDir: v2.create(toAimDir.x, toAimDir.y * -1.0),
                                toAimLen: toAimLen
                            };
                        } else {
                            this.aimMovement.toAimLen = 0.0;
                        }
                        pos = this.getConstrainedPos(center, t.pos, dist);
                        posDown = center;
                        touched = true;
                        break;
                    }
                }
            }
            // Detect if user has moved far enough from center to shoot
            this.m_shotDetectedOld = this.m_shotDetected;
            this.m_shotDetected = this.aimMovement.toAimLen > this.padPosRange / this.shotPadDetectMult && touched;
            this.touchingAim = touched;
            // Special-case throwable logic: once the player begins priming
            // the grenade, dragging back into aim circle will not release
            // it. Only lifting the finger will throw the grenade.
            if (isHoldingThrowable && this.m_shotDetectedOld && touched) {
                this.m_shotDetected = true;
            }

            var pad = this.touchPads[1];
            if (isRegularAnalog === false) {
                pad = this.touchPads[0];
            }
            pad.touched = touched;
            if (touched && this.aimStyle == 'anywhere') {
                pad.centerPos = v2.copy(posDown);
            } else {
                if (isRegularAnalog === false) {
                    pad.centerPos = v2.copy(this.leftLockedPadCenter);
                } else {
                    pad.centerPos = v2.copy(this.rightLockedPadCenter);
                }
            }
            if (isRegularAnalog === false) {
                pad.touchPos.x = touched ? pos.x : this.leftLockedPadCenter.x;
                pad.touchPos.y = touched ? pos.y : this.leftLockedPadCenter.y;
            } else {
                pad.touchPos.x = touched ? pos.x : this.rightLockedPadCenter.x;
                pad.touchPos.y = touched ? pos.y : this.rightLockedPadCenter.y;
            }

            return {
                aimMovement: this.aimMovement,
                touched: pad.touched
            };
        }
    }, {
        key: 'update',
        value: function update(dt, activePlayer, map, camera, renderer) {
            for (var i = 0; i < this.touchPads.length; i++) {
                var pad = this.touchPads[i];

                pad.centerSprite.position.x = pad.centerPos.x;
                pad.centerSprite.position.y = pad.centerPos.y;
                pad.centerSprite.scale.x = this.padScaleBase * this.padScaleDown;
                pad.centerSprite.scale.y = this.padScaleBase * this.padScaleDown;
                pad.centerSprite.visible = device.touch && this.display;

                pad.imageSprite.position.x = pad.centerPos.x;
                pad.imageSprite.position.y = pad.centerPos.y;
                pad.imageSprite.scale.x = this.padScaleBase * this.padScaleImage;
                pad.imageSprite.scale.y = this.padScaleBase * this.padScaleImage;
                pad.imageSprite.visible = device.touch && this.display;

                pad.touchSprite.position.x = pad.touchPos.x;
                pad.touchSprite.position.y = pad.touchPos.y;
                pad.touchSprite.scale.x = this.padScaleBase * this.padScalePos;
                pad.touchSprite.scale.y = this.padScaleBase * this.padScalePos;
                pad.touchSprite.visible = device.touch && this.display;
            }

            this.m_lineSprites.update(this, activePlayer, map, camera, renderer);
        }
    }, {
        key: 'isLeftSideTouch',
        value: function isLeftSideTouch(posX, camera, analogModeNormal) {
            var retValue = posX < camera.screenWidth * 0.5;
            if (analogModeNormal === false) {
                retValue = posX > camera.screenWidth * 0.5;
            }
            return retValue;
        }
    }, {
        key: 'getConstrainedPos',
        value: function getConstrainedPos(posDown, pos, dist) {
            if (dist <= this.padPosRange) {
                return pos;
            } else {
                var x = pos.x - posDown.x;
                var y = pos.y - posDown.y;
                var radians = Math.atan2(y, x);
                return v2.create(Math.cos(radians) * this.padPosRange + posDown.x, Math.sin(radians) * this.padPosRange + posDown.y);
            }
        }
    }, {
        key: 'getConstrainedPosDown',
        value: function getConstrainedPosDown(posDown, dir, dist) {
            var normalDir = v2.normalizeSafe(dir);
            return v2.add(posDown, v2.mul(normalDir, Math.max(0, dist - this.padPosRange)));
        }
    }, {
        key: 'toggleMoveStyle',
        value: function toggleMoveStyle() {
            this.setMoveStyle(this.moveStyle == 'locked' ? 'anywhere' : 'locked');
        }
    }, {
        key: 'setMoveStyle',
        value: function setMoveStyle(style) {
            this.moveStyle = style;
            this.config.set('touchMoveStyle', style);

            var elem = document.getElementById('btn-game-move-style');
            if (elem) {
                if (this.moveStyle == 'locked') {
                    elem.classList.remove('unlocked-on-icon');
                    elem.classList.add('locked-on-icon');
                } else {
                    elem.classList.remove('locked-on-icon');
                    elem.classList.add('unlocked-on-icon');
                }
            }
        }
    }, {
        key: 'toggleAimStyle',
        value: function toggleAimStyle() {
            this.setAimStyle(this.aimStyle == 'locked' ? 'anywhere' : 'locked');
        }
    }, {
        key: 'setAimStyle',
        value: function setAimStyle(style) {
            this.aimStyle = style;
            this.config.set('touchAimStyle', style);

            var elem = document.getElementById('btn-game-aim-style');
            if (this.aimStyle == 'locked') {
                elem.classList.remove('unlocked-on-icon');
                elem.classList.add('locked-on-icon');
            } else {
                elem.classList.remove('locked-on-icon');
                elem.classList.add('unlocked-on-icon');
            }
        }
    }, {
        key: 'toggleAimLine',
        value: function toggleAimLine() {
            this.setTouchAimLine(!this.touchAimLine);
        }
    }, {
        key: 'setTouchAimLine',
        value: function setTouchAimLine(isOn) {
            this.touchAimLine = isOn;
            this.config.set('touchAimLine', this.touchAimLine);

            var elem = document.getElementById('btn-game-aim-line');
            if (this.touchAimLine) {
                elem.classList.remove('aim-line-off-icon');
                elem.classList.add('aim-line-on-icon');
            } else {
                elem.classList.remove('aim-line-on-icon');
                elem.classList.add('aim-line-off-icon');
            }
        }
    }, {
        key: 'init',
        value: function init() {
            this.resize();
        }
    }, {
        key: 'resize',
        value: function resize() {
            var isLandscape = device.isLandscape;

            var lockedPadOffsetLandscape = this.lockedPadOffsetLandscape;
            var lockedPadOffsetPortrait = this.lockedPadOffsetPortrait;

            // Scale the x offsets on all tablets to bring them closer to the middle
            if (device.tablet || device.mobile && device.screenWidth > 1060) {
                lockedPadOffsetPortrait.x = lockedPadOffsetPortrait.x * 1.5;
                lockedPadOffsetPortrait.y = lockedPadOffsetPortrait.y * 1.15;
                if (device.screenWidth > 1060) {
                    lockedPadOffsetLandscape.x = lockedPadOffsetLandscape.x * 1.4;
                    lockedPadOffsetLandscape.y = lockedPadOffsetLandscape.y * 1.4;
                } else {
                    lockedPadOffsetLandscape.x = lockedPadOffsetLandscape.x * 1.1;
                    lockedPadOffsetLandscape.y = lockedPadOffsetLandscape.y * 1.1;
                }
            }

            var leftLockedPadOffsetLandscape = v2.create(lockedPadOffsetLandscape.x, lockedPadOffsetLandscape.y);
            var leftLockedPadOffsetPortrait = v2.create(lockedPadOffsetPortrait.x, lockedPadOffsetPortrait.y);
            var rightLockedPadOffsetLandscape = v2.create(device.screenWidth - lockedPadOffsetLandscape.x, lockedPadOffsetLandscape.y);
            var rightLockedPadOffsetPortrait = v2.create(device.screenWidth - lockedPadOffsetPortrait.x, lockedPadOffsetPortrait.y);

            if (device.os == 'ios') {

                // Adjust the bottom offset on iPhoneX (web app and native app)
                if (device.model == 'iphonex') {
                    leftLockedPadOffsetLandscape.x = leftLockedPadOffsetLandscape.x; //+ 19.0;
                    rightLockedPadOffsetLandscape.x = rightLockedPadOffsetLandscape.x; //- 19.0;
                    leftLockedPadOffsetLandscape.y = leftLockedPadOffsetLandscape.y * 0.9;
                    rightLockedPadOffsetLandscape.y = rightLockedPadOffsetLandscape.y * 0.9;
                }

                // Adjust the bottom offset on all Safari browsers (non-web app)
                else if (!device.webview) {
                        var lockedPadOffsetYLandscapeSafari = this.lockedPadOffsetYLandscapeSafari;
                        var lockedPadOffsetYPortraitSafari = this.lockedPadOffsetYPortraitSafari;

                        // Scale the Safari browser offsets on tablets to push them even further up
                        if (device.tablet || device.mobile && device.screenWidth > 1060) {
                            if (device.screenWidth > 1060) {
                                lockedPadOffsetYLandscapeSafari = lockedPadOffsetYLandscapeSafari * 1.3;
                                lockedPadOffsetYPortraitSafari = lockedPadOffsetYPortraitSafari * 2.0;
                            } else if (window.navigator.standalone) {
                                lockedPadOffsetYLandscapeSafari = lockedPadOffsetYLandscapeSafari * 1.3;
                                lockedPadOffsetYPortraitSafari = lockedPadOffsetYPortraitSafari * 0.8;
                            } else {
                                lockedPadOffsetYLandscapeSafari = lockedPadOffsetYLandscapeSafari * 1.0;
                                lockedPadOffsetYPortraitSafari = lockedPadOffsetYPortraitSafari * 0.8;
                            }
                        }

                        leftLockedPadOffsetLandscape.y = lockedPadOffsetYLandscapeSafari;
                        leftLockedPadOffsetPortrait.y = lockedPadOffsetYPortraitSafari;
                        rightLockedPadOffsetLandscape.y = lockedPadOffsetYLandscapeSafari;
                        rightLockedPadOffsetPortrait.y = lockedPadOffsetYPortraitSafari;
                    }

                    // Adjust the bottom offset on webview tablets
                    else if (device.tablet && device.webview) {
                            if (device.screenWidth > 1060) {
                                leftLockedPadOffsetLandscape.y = leftLockedPadOffsetLandscape.y * 1.0;
                                rightLockedPadOffsetLandscape.y = rightLockedPadOffsetLandscape.y * 1.0;
                            } else {
                                leftLockedPadOffsetLandscape.y = leftLockedPadOffsetLandscape.y * 1.1;
                                rightLockedPadOffsetLandscape.y = rightLockedPadOffsetLandscape.y * 1.1;
                            }
                        }
            }

            this.padScaleBase = isLandscape ? 1.0 : 0.8;
            this.padPosRange = this.padPosBase * this.padScaleBase;

            var leftOffset = isLandscape ? leftLockedPadOffsetLandscape : leftLockedPadOffsetPortrait;

            var rightOffset = isLandscape ? rightLockedPadOffsetLandscape : rightLockedPadOffsetPortrait;

            this.leftLockedPadCenter = v2.create(leftOffset.x, device.screenHeight - leftOffset.y);

            this.rightLockedPadCenter = v2.create(rightOffset.x, device.screenHeight - rightOffset.y);

            /* this.rightLockedPadCenter = v2.create(
                  leftOffset.x, device.screenHeight - leftOffset.y
              );
              
              this.leftLockedPadCenter = v2.create(
                  rightOffset.x, device.screenHeight - rightOffset.y
              );*/

            // Restyle every resize in case user is on desktop
            this.setMobileStyling(isLandscape);
        }
    }, {
        key: 'setMobileStyling',
        value: function setMobileStyling(isLandscape) {
            if (device.touch) {
                // Show touch options
                var touchOptions = $('#btn-touch-styles').find('.btn-game-container');
                touchOptions.css('display', 'inline-block');
                // Show emote button
                $('#ui-emote-button').css('display', 'block');
            }

            // Set on all mobile devices, or desktop if screen dimensions fit
            if (device.uiLayout == device.UiLayout.Sm && (device.tablet || device.mobile && device.screenWidth < 1060)) {
                //device.screenWidth < 1060) {
                // Style the map wrapper
                $('#ui-map-wrapper').addClass('ui-map-wrapper-mobile').removeClass('ui-map-wrapper-desktop');
                $('#ui-settings-container-mobile').css('display', 'block');
                $('#ui-settings-container-desktop').css('display', 'none');
                // Style the ammo and med wrapper
                $('#ui-right-center').addClass('ui-right-center-mobile').removeClass('ui-right-center-desktop');
                // Hide the leaderboard
                $('#ui-leaderboard-wrapper').css('display', 'none');
                // Hide desktop skill icon
                $('#ui-skill-container').css('display', 'none');
                // Hide main hand weapon
                // $('#ui-weapon-slot-id-1').css('display','none');
                // Hide off hand weapon
                // $('#ui-weapon-slot-id-2').css('display','none');
                // Hide desktop emote button
                $('#ui-bottom-left').css('display', 'none');
                // Show the map close button
                $('#big-map-close').css('display', 'block');
                // Style the in-game menu
                $('#ui-game-menu').removeClass('ui-game-menu-desktop');
                $('#btn-game-tabs').css('display', 'none');
                $('#ui-game-tab-settings').removeClass('ui-game-tab-settings-desktop');
                $('.ui-ability-key').css('display', 'none');
                if (device.model == "ipadpro") {
                    //Add class ipad pro for resolution fixes
                    $('#ui-skill-container-mobile').addClass('ipadPro');
                    $('#ui-health-counter').addClass('ipadPro');
                    $('#ui-health-container').addClass('ipadPro');
                    $('#ui-bottom-center-0').addClass('ipadPro');
                    $('#mid-container').addClass('ipadPro');
                    $('#ui-health-numbers').addClass('ipadPro');
                    //  $('#ui-weapon-offhand').addClass('ipadPro');
                    $('.ui-pickup-item').addClass('ipadPro');
                    $('#ui-experience-container').addClass('ipadPro');
                    $('#ui-lower-center').addClass('ipadPro');
                    $('#ui-emote-button').addClass('ipadPro');
                    $('#ui-settings-container-mobile').addClass('ipadPro');
                    $('#ui-level-stats-container').addClass('ipadPro');
                }
            } else {
                $('#ui-map-wrapper').removeClass('ui-map-wrapper-mobile').addClass('ui-map-wrapper-desktop');
                $('#ui-settings-container-mobile').css('display', 'none');
                $('#ui-settings-container-desktop').css('display', 'block');
                $('#ui-right-center').removeClass('ui-right-center-mobile').addClass('ui-right-center-desktop');
                $('#ui-leaderboard-wrapper').css('display', 'block');
                $('#ui-skill-container').css('display', 'flex');
                // $('#ui-weapon-slot-id-1').css('display','block');
                // $('#ui-weapon-slot-id-2').css('display','block');
                $('#ui-bottom-left').css('display', 'flex');
                //$('#big-map-close').css('display', 'none');
                $('#ui-game-menu').addClass('ui-game-menu-desktop');
                $('#btn-game-tabs').css('display', 'flex');
                $('#ui-game-tab-settings').addClass('ui-game-tab-settings-desktop');
                $('.ui-ability-key').css('display', 'block');
            }

            if (device.tablet || device.mobile && device.screenWidth > 1060) {
                //$('#ui-emote-button').css('display', 'none');
                $('#ui-map-wrapper').addClass('ui-map-wrapper-mobile').removeClass('ui-map-wrapper-desktop');
                $('#big-map-close').css('display', 'block');
                $('#big-map-close').css('left', 'calc(100vw - 220px)');
                $('#big-map-close').css('right', 'auto');
                //$('#ui-top-left').css('left', '16px');
                //$('#ui-top-left-2').css('left', '16px');
            }

            // Add styling specific to safari in browser
            if (device.os == 'ios') {
                // iPhone X+ specific
                if (device.model == 'iphonex') {
                    var gameHeight = device.isLandscape ? '99%' : '90%';
                    var topOffset = device.isLandscape ? 0 : 32;
                    $('#ui-game').css({
                        'height': gameHeight,
                        'top': topOffset
                    });
                    $('#ui-experience-container').css({ 'bottom': '-4px' });
                    $('#ui-stats-contents').css({
                        'transform': 'translate(-50%) scale(0.95)',
                        'transform-origin': 'top'
                    });
                    if (isLandscape) {
                        $('#ui-game').css({
                            'left': '50%',
                            'transform': 'translateX(-50%)',
                            'width': '100%'
                        });
                    } else {
                        $('#ui-game').css({
                            'left': '',
                            'transform': '',
                            'width': ''
                        });
                    }
                } else if (window.navigator.standalone && !device.tablet) {
                    $('#ui-game').css({
                        'height': '95%'
                    });
                } else {
                    //let gameHeight = device.isLandscape ? '87%' : '82%';
                    var marginBottom = device.isLandscape ? '8%' : '13%';
                    if (device.tablet) {
                        //gameHeight = '100%';
                        marginBottom = '0%';
                    } else if (device.webview) {
                        //gameHeight = '98%';
                        marginBottom = '2%';
                    }
                    $('#ui-medical-interactive').css({
                        'margin-bottom': marginBottom
                    });
                    $('#ui-prestige-mobile').css({
                        'margin-bottom': 'calc(' + marginBottom + ' - 3%)'
                    });

                    /*$('#ui-game').css({
                        'height': gameHeight
                    });*/

                    var gameMarginTop = device.webview && !device.tablet ? 0 : 6;

                    var gameMarginElems = $('#ui-right-center, #ui-top-center-scopes-wrapper, #ui-top-center');
                    gameMarginElems.css({
                        'margin-top': gameMarginTop
                    });
                }
            }

            // Reorder ammo for mobile
            var ammoPortrait = !device.tablet && !isLandscape;
            if (ammoPortrait) {
                $("#ui-loot-9mm").insertBefore("#ui-loot-45acp");
                $("#ui-loot-12gauge").insertBefore("#ui-loot-45acp");
                $("#ui-loot-762mm").insertBefore("#ui-loot-45acp");
                $("#ui-loot-556mm").insertBefore("#ui-loot-45acp");
                $("#ui-loot-50AE").insertBefore("#ui-loot-45acp");
                $("#ui-loot-308sub").insertBefore("#ui-loot-45acp");
                $("#ui-loot-flare").insertBefore("#ui-loot-45acp");
            } else {
                $("#ui-loot-50AE").insertBefore("#ui-loot-556mm");
                $("#ui-loot-9mm").insertBefore("#ui-loot-556mm");
                $("#ui-loot-308sub").insertBefore("#ui-loot-556mm");
                $("#ui-loot-12gauge").insertBefore("#ui-loot-556mm");
                $("#ui-loot-flare").insertBefore("#ui-loot-556mm");
                $("#ui-loot-762mm").insertBefore("#ui-loot-556mm");
                $("#ui-loot-45acp").insertBefore("#ui-loot-556mm");
            }
            if (isLandscape && window.innerHeight < 376) {
                $("#ui-loot-9mm").insertBefore("#ui-loot-45acp");
                $("#ui-loot-12gauge").insertBefore("#ui-loot-45acp");
                $("#ui-loot-762mm").insertBefore("#ui-loot-45acp");
                $("#ui-loot-556mm").insertBefore("#ui-loot-45acp");
                $("#ui-loot-50AE").insertBefore("#ui-loot-45acp");
                $("#ui-loot-308sub").insertBefore("#ui-loot-45acp");
                $("#ui-loot-flare").insertBefore("#ui-loot-45acp");
            }
        }
    }, {
        key: 'hideAll',
        value: function hideAll() {
            this.display = false;
        }
    }]);
    return m_Touch;
}();

var m_LineSprites = function () {
    function m_LineSprites() {
        (0, _classCallCheck3.default)(this, m_LineSprites);

        this.container = new PIXI.Container();
        this.container.visible = false;

        this.dots = [];
    }

    (0, _createClass3.default)(m_LineSprites, [{
        key: 'createDot',
        value: function createDot() {
            var dotSprite = new PIXI.Sprite();
            dotSprite.texture = PIXI.Texture.fromImage('dot.img');
            dotSprite.anchor.set(0.5, 0.5);
            dotSprite.position.set(0.0, 0.0);
            dotSprite.scale.set(1.0, 1.0);
            dotSprite.tint = 0xffffff;
            dotSprite.alpha = 1.0;
            dotSprite.visible = false;
            return dotSprite;
        }
    }, {
        key: 'update',
        value: function update(touch, activePlayer, map, camera, renderer) {
            var visible = device.touch && touch.touchingAim && touch.touchAimLine;

            if (visible) {
                var curWeap = activePlayer.m_netData.m_curWeapType;
                var curWeapDef = GameObjectDefs[curWeap];

                // Determine max range of the aim line
                var maxRange = 30.0;
                if (curWeapDef.type == 'gun') {
                    var bulletDist = BulletDefs[curWeapDef.bulletType].distance;
                    var barrelLen = curWeapDef.barrelLength;
                    maxRange = barrelLen + bulletDist;
                }

                // Clamp max range to be within the camera radius
                var cameraZoom = activePlayer.m_getZoom();
                var cameraRad = Math.sqrt(1.414 * cameraZoom * cameraZoom);
                maxRange = math.min(maxRange, cameraRad);

                var start = v2.copy(activePlayer.pos);
                var end = v2.add(start, v2.mul(activePlayer.dir, maxRange));

                // Compute the nearest intersecting obstacle
                var obstacles = map.m_obstaclePool.m_getPool();
                for (var i = 0; i < obstacles.length; i++) {
                    var o = obstacles[i];
                    if (!o.active || o.dead || o.height < GameConfig.bullet.height || !o.collidable || o.isWindow || !util.sameLayer(activePlayer.layer, o.layer)) {
                        continue;
                    }
                    if (curWeapDef.type == 'throwable' && o.height <= GameConfig.projectile.maxHeight) {
                        continue;
                    }
                    var res = collider.intersectSegment(o.collider, start, end);
                    if (res) {
                        var _dist = v2.length(v2.sub(res.point, start));
                        if (_dist < maxRange) {
                            maxRange = _dist;
                            end = res.point;
                        }
                    }
                }

                // Compute the nearest intersecting npc
                var npcs = map.m_npcPool.m_getPool();
                for (var _i = 0; _i < npcs.length; _i++) {
                    var _o = npcs[_i];
                    if (!_o.active || _o.dead || _o.height < GameConfig.bullet.height || !_o.collidable || !util.sameLayer(activePlayer.layer, _o.layer)) {
                        continue;
                    }
                    if (curWeapDef.type == 'throwable' && _o.height <= GameConfig.projectile.maxHeight) {
                        continue;
                    }
                    var _res = collider.intersectSegment(_o.collider, start, end);
                    if (_res) {
                        var _dist2 = v2.length(v2.sub(_res.point, start));
                        if (_dist2 < maxRange) {
                            maxRange = _dist2;
                            end = _res.point;
                        }
                    }
                }

                var kStartOffset = 3.5;
                var kIncrement = 1.5;

                // Allocate enough dots
                var dist = v2.length(v2.sub(end, start));
                var dotCount = Math.max(Math.ceil((dist - kStartOffset) / kIncrement), 0);
                while (this.dots.length < dotCount) {
                    var dot = this.createDot();
                    this.container.addChild(dot);
                    this.dots.push(dot);
                }

                // Position dots
                for (var _i2 = 0; _i2 < this.dots.length; _i2++) {
                    var _dot = this.dots[_i2];
                    var offset = kStartOffset + _i2 * kIncrement;
                    var pos = v2.add(activePlayer.pos, v2.mul(activePlayer.dir, offset));

                    var scale = 1.0 / 32.0 * 0.375;

                    _dot.position.set(pos.x, pos.y);
                    _dot.scale.set(scale, scale);
                    _dot.visible = _i2 < dotCount;
                }

                // Position dot container
                var p0 = camera.pointToScreen(v2.create(0.0, 0.0));
                var p1 = camera.pointToScreen(v2.create(1.0, 1.0));
                var s = v2.sub(p1, p0);
                this.container.position.set(p0.x, p0.y);
                this.container.scale.set(s.x, s.y);
                this.container.alpha = 0.3;

                renderer.addPIXIObj(this.container, activePlayer.layer, 19, 0);
            }

            this.container.visible = visible;
        }
    }]);
    return m_LineSprites;
}();

module.exports = {
    m_Touch: m_Touch
};
