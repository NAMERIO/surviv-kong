"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _slicedToArray2 = require("./9bc388c8.js");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("./160ad6a9.js");

var _entries2 = _interopRequireDefault(_entries);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var Action = GameConfig.Action;
var Anim = GameConfig.Anim;
var GameInput = GameConfig.Input;
var HasteType = GameConfig.HasteType;
var Role = GameConfig.Role;
var net = require("./net.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var math = require("./math.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var animData = require("./animData.js");
var collisionHelpers = require("./collisionHelpers.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");
var FirebaseManager = require("./FirebaseManager.js");
var helpers = require("./helpers.js");
var ObjectPool = require("./objectPool.js");
var shot = require("./shot.js");
var InGameNotification = require("./inGameNotification.js");

var AnimationController = require("./player-animation-controller.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var MapObjectDefs = require("./mapObjectDefs.js");
var StatusEffects = require("./statusEffects.js");

// Effects
var StatusEffect = require("./statusEffect.js");

var WeaponManager = require("./weaponManager.js");
var SkillTelegraph = require("./skillTelegraph.js");
var GameObject = require("./gameObject.js");
var GearPerksController = require("./gearPerksController.js");

var _require = require("./gameConfig.js"),
    CharacterSkins = _require.CharacterSkins;

var _require2 = require("./animationData.js"),
    EnumPlayerAnimType = _require2.EnumPlayerAnimType;

var loadouts = require("./loadouts.js");

var Pose = animData.Pose;
var Bones = animData.Bones;

//Health bar options
var kHideHealthBarTime = 5;
var kHealthBarColor = 0xd10000;
var kHealthBarSize = v2.create(45, 3);
var kHealthBarBackgroundColor = 0x000000;
var kHealthBarDefaultOffset = v2.create(0, 2);

//Hurt effect flash
var kRepeatHurtColors = 2;
var kFlashHurtDuration1 = 0.15;
var kFlashHurtDuration2 = 0.1;
var kFlashHurtColor1 = 0x5c5c5c;
var kFlashHurtColor2 = 0xffffff;

var CharacterSkinsOld = {
    /*
    BaseSkin: 0,
    Helmet: 1,
    Body: 2,
    OffHand: 3,
    MainHand: 4 */
    0: ['skins/hero_skin_01_female', 'armor_helmet/emerald_knight', 'armor_body/emerald_knight', '', //'weapons/offhand/shields/emerald_knight',
    '' //'weapons/mainhand/melee/swords/emerald_sword'
    ],
    1: ['skins/hero_skin_01_female', 'armor_helmet/white_wizard', 'armor_body/white_wizard', '' //'weapons/mainhand/range/staffs/white_wizard_staff'
    ],
    2: ['skins/hero_skin_01_female', 'armor_helmet/copper', 'armor_body/copper', '', '' //'weapons/mainhand/melee/axes/cooper'
    ],
    3: ['skins/hero_skin_01_female', 'armor_helmet/spirit_warrior', 'armor_body/spirit_warrior', '', '' //'weapons/mainhand/range/bows/spirit_warrior_bow'
    ],
    4: ['skins/hero_skin_01_female', 'armor_helmet/supreme_knight', 'armor_body/supreme_knight', '', ''],
    5: ['skins/hero_skin_01_female', 'armor_helmet/woodelf', 'armor_body/woodelf', '', ''],
    6: ['skins/hero_skin_01_female', 'armor_helmet/fairy_princess', 'armor_body/fairy_princess', '', ''],
    7: ['skins/hero_skin_01_male', 'armor_helmet/dwarf', 'armor_body/dwarf', '', ''],
    8: ['skins/hero_skin_01_male', 'armor_helmet/raid', 'armor_body/raid', '', ''],
    9: ['skins/hero_skin_01_female', 'armor_helmet/paladin', 'armor_body/paladin', '', ''],
    10: ['skins/hero_skin_01_male', 'armor_helmet/east_march_knight', 'armor_body/east_march_knight', '', ''],
    11: ['skins/hero_skin_01_female', 'armor_helmet/sorcerer', 'armor_body/sorcerer', '', ''],
    12: ['skins/hero_skin_01_male', 'armor_helmet/bard_elf', 'armor_body/bard_elf', '', ''],
    13: ['skins/hero_skin_01_female', 'armor_helmet/witchy', 'armor_body/witchy', '', ''],
    14: [//leave this option always at the end
    'skins/hero_skin_01_male', 'hair/male/daper', '', '', '' //'weapons/mainhand/range/bows/spirit_warrior_bow'
    ]
};

var kSubmergeMaskScaleFactor = 0.1;

var DesktopZoomSteps = [];
var MobileZoomSteps = [];
// Initialize Desktop and Mobile ZoomStep arrays
var scopeKeys = (0, _keys2.default)(GameConfig.scopeZoomRadius.mobile);
for (var i = 0; i < scopeKeys.length; i++) {
    var key = scopeKeys[i];
    DesktopZoomSteps.push(GameConfig.scopeZoomRadius.desktop[key]);
    MobileZoomSteps.push(GameConfig.scopeZoomRadius.mobile[key]);
}
if (false) {}

//
// Helpers
//
function perksEqual(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (var _i = 0; _i < a.length; _i++) {
        if (a[_i].type != b[_i].type) {
            return false;
        }
    }
    return true;
}

function createPlayerNameText() {
    var nameStyle = {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: device.pixelRatio > 1.0 ? 30.0 : 22.0,
        align: 'center',
        fill: 0x00ffff,
        stroke: 0x000000,
        strokeThickness: 0,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 1,
        dropShadowAngle: Math.PI / 3,
        dropShadowDistance: 1
    };
    var nameText = new PIXI.Text('', nameStyle);
    nameText.anchor.set(0.5, 0.5);
    nameText.scale.set(0.5, 0.5);
    nameText.position.set(0.0, 30.0);
    nameText.visible = false;
    return nameText;
}

// @TODO: Change to allocSprite so they can be easily freed
function createSprite() {
    var sprite = new PIXI.Sprite();
    sprite.texture = PIXI.Texture.EMPTY;
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(1.0, 1.0);
    sprite.tint = 0xffffff;
    sprite.visible = false;
    return sprite;
}

/* Method to compared if arrays are equal taken from an answer: https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript?page=1&tab=votes#tab-top*/
// I modified this version a little bit
function compareArray(array1, array2) {
    // if the other array is a falsy value, return
    if (!array2) return false;

    // compare lengths - can save a lot of time 
    if (array1.length != array2.length) return false;

    for (var i = 0, l = array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!compareArray(array1[i], array2[i])) return false;
        } else if ((0, _stringify2.default)(array1[i]) != (0, _stringify2.default)(array2[i])) {
            //Change this to compare objects
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

//
// GunSprites
//

var GunSprites = function () {
    function GunSprites() {
        (0, _classCallCheck3.default)(this, GunSprites);

        this.gunBarrel = createSprite();
        this.gunMag = createSprite();
        this.gunBall = createSprite();

        this.container = new PIXI.Container();
        this.container.addChild(this.gunBarrel);
        this.container.addChild(this.gunMag);
        this.container.addChild(this.gunBall);
        this.container.rotation = Math.PI * 0.5;
        this.container.visible = false;
        this.maxScaleShoot = 0.0;

        this.magTop = false;
    }

    (0, _createClass3.default)(GunSprites, [{
        key: 'setVisible',
        value: function setVisible(vis) {
            this.container.visible = vis;
        }
    }, {
        key: 'setType',
        value: function setType(type, bodyScale, playerInfo, isLoaded) {
            var gunDef = GameObjectDefs[type];
            var imgDef = gunDef.worldImg;
            if (!isLoaded) {
                this.gunBarrel.texture = PIXI.Texture.fromImage(imgDef.sprite);
            } else {
                this.gunBarrel.texture = PIXI.Texture.fromImage(imgDef.onLoadComplete);
            }
            this.gunBarrel.anchor.set(0.5, 1.0);
            this.gunBarrel.position.set(0.0, 0.0);
            this.gunBarrel.scale.set(imgDef.scale.x * 0.5 / bodyScale, imgDef.scale.y * 0.5 / bodyScale);

            this.gunBarrel.tint = imgDef.tint;
            this.gunBarrel.visible = true;
            if (!isLoaded) {
                if (imgDef.magImg) {
                    var magDef = imgDef.magImg;
                    this.gunMag.texture = PIXI.Texture.fromImage(magDef.sprite);
                    this.gunMag.anchor.set(0.5, 0.5);
                    this.gunMag.position.set(magDef.pos.x / bodyScale, magDef.pos.y / bodyScale);
                    this.gunMag.scale.set(0.25 / bodyScale, 0.25 / bodyScale);
                    this.gunMag.tint = 0xffffff;
                    this.gunMag.visible = true;

                    if (magDef.top) {
                        this.container.addChild(this.gunMag);
                    } else {
                        this.container.addChildAt(this.gunMag, 0);
                    }
                } else {
                    this.gunMag.visible = false;
                }
            }

            this.magTop = imgDef.magImg && imgDef.magImg.top;

            if (imgDef.loadingBullet) {
                var ballDef = imgDef.loadingBullet;
                this.gunBall.texture = PIXI.Texture.fromImage(ballDef.sprite);
                this.gunBall.anchor.set(0.5, 0.5);
                this.gunBall.position.set(ballDef.pos.x / bodyScale, ballDef.pos.y / bodyScale);
                this.gunBall.scale.set(0 / bodyScale, 0 / bodyScale);
                this.gunBall.tint = 0xffffff;
                this.gunBall.visible = true;

                this.maxScaleShoot = imgDef.loadingBullet.maxScale;

                if (ballDef.top) {
                    this.container.addChild(this.gunBall);
                } else {
                    this.container.addChildAt(this.gunBall, 0);
                }
            } else {
                this.gunBall.visible = false;
            }

            var handOffset = gunDef.isDual ? v2.create(-5.95, 0.0) : v2.create(-4.25, -1.75);
            if (imgDef.gunOffset) {
                handOffset.x += imgDef.gunOffset.x;
                handOffset.y += imgDef.gunOffset.y;
            }
            this.container.position.set(handOffset.x, handOffset.y);
        }
    }]);
    return GunSprites;
}();

//
// Player
//


function Player() {
    this.avatarSkin = '';
    this.armorType = '';
    this.armorLevel = 1;
    this.hairSkin = '';
    this.spineObj = null;
    this.spineFxObj = null;
    this.currentSkins = [];
    //TODO delete sprites not needed in bitheroes (most of them)
    this.bodySprite = createSprite();
    this.chestSprite = createSprite();
    this.neckSprite = createSprite();
    this.accessorySprite = createSprite();
    this.flakSprite = createSprite();
    this.steelskinSprite = createSprite();
    this.helmetSprite = createSprite();
    this.visorSprite = createSprite();
    this.backpackSprite = createSprite();
    this.handLSprite = createSprite();
    this.handRSprite = createSprite();
    this.footLSprite = createSprite();
    this.footRSprite = createSprite();
    this.hipSprite = createSprite();
    /*this.gunLSprites = new GunSprites();
    this.gunRSprites = new GunSprites();*/
    this.objectLSprite = createSprite();
    this.objectRSprite = createSprite();
    this.meleeSprite = createSprite();
    this.bodySubmergeSprite = createSprite();
    this.handLSubmergeSprite = createSprite();
    this.handRSubmergeSprite = createSprite();
    this.footLSubmergeSprite = createSprite();
    this.footRSubmergeSprite = createSprite();
    this.bodyEffectSprite = createSprite();
    this.patchSprite = createSprite();
    this.slimeSprite = createSprite();
    this.aimSprite = createSprite();
    this.phoenixSprite = createSprite();
    this.pyroSprite = createSprite();

    /*this.bodySprite.addChild(this.bodySubmergeSprite);
    this.handLSprite.addChild(this.handLSubmergeSprite);
    this.handRSprite.addChild(this.handRSubmergeSprite);
    this.footLSprite.addChild(this.footLSubmergeSprite);
    this.footRSprite.addChild(this.footRSubmergeSprite);
     this.handLContainer = new PIXI.Container();
    this.handLContainer.addChild(this.gunLSprites.container);
    this.handLContainer.addChild(this.handLSprite);
    this.handLContainer.addChild(this.objectLSprite);
    this.auraMaxRad = 0.0;
     this.handRContainer = new PIXI.Container();
    this.handRContainer.addChild(this.gunRSprites.container);
    this.handRContainer.addChild(this.meleeSprite);
    this.handRContainer.addChild(this.handRSprite);
    this.handRContainer.addChild(this.objectRSprite);
    this.soundLoadingInstance = null;
     this.footLContainer = new PIXI.Container();
    this.footLContainer.addChild(this.footLSprite);
     this.footRContainer = new PIXI.Container();
    this.footRContainer.addChild(this.footRSprite);*/

    this.bodyContainer = new PIXI.Container();

    /*this.bodyContainer.addChild(this.footLContainer);
    this.bodyContainer.addChild(this.footRContainer);
    this.bodyContainer.addChild(this.backpackSprite);
    this.bodyContainer.addChild(this.bodySprite);
    this.bodyContainer.addChild(this.chestSprite);
    this.bodyContainer.addChild(this.flakSprite);
    this.bodyContainer.addChild(this.steelskinSprite);
    this.bodyContainer.addChild(this.hipSprite);
    this.bodyContainer.addChild(this.bodyEffectSprite);
    this.bodyContainer.addChild(this.handLContainer);
    this.bodyContainer.addChild(this.handRContainer);
    this.bodyContainer.addChild(this.visorSprite);
    this.bodyContainer.addChild(this.accessorySprite);
    this.bodyContainer.addChild(this.patchSprite);
    this.bodyContainer.addChild(this.helmetSprite);
    this.bodyContainer.addChild(this.slimeSprite);
    this.bodyContainer.addChild(this.aimSprite);
    this.bodyContainer.addChild(this.phoenixSprite);
    this.bodyContainer.addChild(this.pyroSprite);*/

    this.skillTelegraph = new SkillTelegraph(this);
    this.container = new PIXI.Container();
    this.container.addChild(this.skillTelegraph.container);
    this.container.addChild(this.bodyContainer);

    this.spriteContainer = new PIXI.Container();
    this.SpineObjManager = null;

    // Name text
    this.nameText = createPlayerNameText();
    this.container.addChild(this.nameText);

    //TODO delete if not needed in BHA -> Healing circle for the aoe_heal perk
    this.auraContainer = new PIXI.Container();
    this.auraCircle = createSprite();
    this.auraContainer.addChild(this.auraCircle);

    //Blind effect
    this.blindContainer = new PIXI.Container();
    this.blindImage = createSprite();
    this.blindContainer.addChild(this.blindImage);

    this.initSubmergeSprites();

    // Anim
    this.bones = [];
    this.anim = {
        type: Anim.None,
        data: {},
        seq: -1.0,
        ticker: 0.0,
        bones: []
    };

    var boneCount = (0, _keys2.default)(Bones).length;
    for (var _i2 = 0; _i2 < boneCount; _i2++) {
        this.bones.push(new Pose());
        this.anim.bones.push({
            weight: 0.0,
            pose: new Pose()
        });
    }

    this.perks = [];
    // Maintain a list of just the perk types as a hasPerk() optimization
    this.perkTypes = [];
    this.perksDirty = false;

    this.surface = null;
    this.wasInWater = false;
    this.weapTypeOld = '';
    this.visualsDirty = false;
    this.stepDistance = 0.0;
    this.zoomFast = false;
    this.playedDryFire = false;
    this.playerOffHandAttack = false;
    this.lastSwapIdx = -1;
    this.hasteSeq = -1;
    this.cycleSoundInstance = null;
    this.actionSoundInstance = null;
    this.useItemEmitter = null;
    this.hasteEmitter = null;
    this.passiveHealEmitter = null;
    this.frenemyEmitter = null;
    this.passiveFreezeEmitter = null;
    this.playerHeatEmitter = null;
    this.poppyHealEmitter = null;
    this.hailEmitter = null;
    this.playerHeatTimer = 0.0;
    this.chocolateBoxEmiter = 0.0;
    this.savedByLuckEmiter = 0.0;
    this.teleportCameraTicker = 0.0;
    this.bottleEmiter = 0.0;
    this.wetEmiter = null;

    this.effects = [];
    this.zoomSpeed = { zoomIn: null, zoomOut: null };

    this.loadedSprite = false;
    this.gunchiladaTimeEmiter = 0.0;
    this.watermelonTimeEmiter = 0.0;
    this.sugarRushEmiter = 0.0;
    this.playSoundSugarRush = true;
    this.specialSoundsInstance = null;

    this.downed = false;
    this.wasDowned = false;
    this.bleedTicker = 0.0;
    this.submersion = 0.0;
    this.gunRecoilL = 0.0;
    this.gunRecoilR = 0.0;
    this.fireDelay = 0.0;
    this.biteTicker = 0.0;
    this.biteTickerSound = 0.0;

    this.throwableState = 'equip';
    this.throwableStatePrev = this.throwableState;
    this.lastThrowablePickupSfxTicker = 0.0;

    this.isNearDoorError = false;
    this.doorErrorTicker = 0.0;
    this.noCeilingRevealTicker = 0.0;
    this.frozenTicker = 0.0;
    this.updateFrozenImage = true;
    this.questsInfoChanged = false;
    this.questsProgressChanging = false;
    this.localQuestInfo = [];
    this.inGameNotification = null;
    this.questsCompleted = [false, false];
    this.triggerNotification = null;
    this.progressNotificationActive = false;
    this.playTeleportTicker = 0.0;
    this.playTeleportSound = false;
    this.isDashing = false;
    this.invisible = false;

    this.viewAabb = {
        min: v2.create(0.0, 0.0),
        max: v2.create(0.0, 0.0)
    };
    this.auraViewFade = 0.0;
    this.auraPulseTicker = 0.0;
    this.auraorbDir = 1.0;

    this.renderLayer = 0;
    this.renderZOrd = 18;
    this.renderZIdx = 0;

    // Anti-cheat
    this.m_mangle = 0;
    this.m_mangle1 = 0;

    this.action = {};
    this.lastActionType = Action.None;
    this.m_netData = {};
    this.m_localData = {};

    this.rad = GameConfig.player.radius;
    this.bodyRad = this.rad;
    this.pos = v2.create(0.0, 0.0);
    this.posOld = v2.create(0.0, 0.0);
    this.dir = v2.create(1.0, 0.0);
    this.dirOld = v2.create(1.0, 0.0);
    this.layer = 0;
    this.meleeRect = new PIXI.Graphics();

    this.directions = {};
    this.oldDirections = {};
    this.wasMoving = false;
    this.attacking = false;
    this.attackingOld = false;
    this.isMoving = false;
    this.framesStopped = 0;
    this.stoppedMoving = false;
    this.timeSinceMoving = 0;
    this.timeSinceWasMoving = 0;
    this.lastScaleX = 1;
    this.oldCursorDirectionName = null;

    // Controlled by the loadout-display
    this.isLoadoutAvatar = false;
    this.playActionStartSfx = true;
    this.cameraPositionDirty = false;

    this.playerHitbox = collider.createAabbExtents(v2.create(0.0, 0.0), v2.create(GameConfig.player.colliderWidth, GameConfig.player.colliderHeight));

    this.movementHitbox = collider.createAabbExtents(v2.create(GameConfig.player.movementColliderOffsetX, GameConfig.player.movementColliderOffsetY), v2.create(GameConfig.player.movementColliderWidth, GameConfig.player.movementColliderHeight));

    this.collider = collider.transform(this.playerHitbox, this.pos, 0, 1);

    this.playerCameraDeadZoneHitbox = collider.createAabbExtents(v2.create(0.0, 0.0), v2.create(GameConfig.camera.cameraDeadZoneColliderWidth, GameConfig.camera.cameraDeadZoneColliderHeight));

    this.cameraDeadZoneCollider = collider.transform(this.playerCameraDeadZoneHitbox, this.pos, 0, 1);

    this.playerCameraHitbox = collider.createAabbExtents(v2.create(0.0, 0.0), v2.create(GameConfig.camera.cameraPlayerColliderWidth, GameConfig.camera.cameraPlayerColliderHeight));

    this.playerCameraCollider = collider.transform(this.playerCameraHitbox, this.pos, 0, 1);

    this.cameraMovementTicker = 0.0;
    this.playerCameraPos = this.pos;
    this.applySmooth = false;

    this.movementCollider = collider.transform(this.movementHitbox, this.pos, 0, 1);

    //Heath bar
    this.timeToHideHPBar = 0;
    this.healthNormalizedOld = 1;
    this.HpBarGFX = new PIXI.Graphics();
    this.healthBarOffset = kHealthBarDefaultOffset;

    //Flash hurt
    this.flashHurtTime = 0;
    this.currentHurtColor = 0;
    this.repeatedHurtFlash = 0;

    //DeathEffect 

    var baseTexture = [];
    var sprites = ['part-black-hole-01.img', 'part-black-hole-02.img', 'part-black-hole-03.img', 'part-black-hole-04.img', 'part-black-hole-05.img', 'part-black-hole-06.img', 'part-black-hole-07.img', 'part-black-hole-08.img', 'part-black-hole-09.img'];
    for (var _i3 = 0; _i3 < sprites.length; _i3++) {
        var texture = PIXI.Texture.from(sprites[_i3]);
        baseTexture.push(texture);
    }

    this.deathEffectSprite = new PIXI.extras.AnimatedSprite(baseTexture);
    this.deathEffectSprite.visible = false;
    this.baseSkinApplied = false;

    this.WeaponManager = new WeaponManager(true, this);
    /** @type{import('./../../../shared/gear-perks-controller')} */
    this.gearPerksController = new GearPerksController(this, true);
    this.WeaponManager.PIXI = PIXI;
    this.selectedSkill = GameConfig.SelectedSkill.None;
    this.selectedSkillOld = this.selectedSkill;
    this.level = 1;
    this.oldLevel = 1;
    this.lastMoveDirection = null;

    this.AnimationController = new AnimationController(this);
}

Player.prototype = {
    setSpine: function setSpine(spineData, skins) {
        this.spineObj = new PIXI.spine.Spine(spineData['hero']);
        this.spineFxObj = new PIXI.spine.Spine(spineData['hero_fx']);
        //window.player = this;
        this.setSpineTransform(this.spineObj, { x: 1.4, y: 1.4 }, { x: 0.5, y: 24 }, { x: 0.5, y: 0.5 });
        this.setSpineTransform(this.spineFxObj, { x: 1.4, y: 1.4 }, { x: 0.5, y: 10 }, { x: 0.5, y: 0.5 });
        this.bodyContainer.addChild(this.spineObj);
        this.container.addChild(this.spineFxObj);
        this.changeSkin(skins);
        this.spineObj.state.setAnimation(0, 'idle_side', true);
        this.baseSkinApplied = true;
    },

    setSpineTransform: function setSpineTransform(spine, scale, position, pivot) {
        spine.scale.set(scale.x, scale.y);
        spine.position.set(position.x, position.y);
        spine.pivot.set(pivot.x, pivot.y);
    },

    playSpineFX: function playSpineFX(animationName) {
        var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var timeScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        this.spineFxObj.visible = true;
        this.spineFxObj.state.timeScale = timeScale;
        this.spineFxObj.state.setAnimation(0, animationName, loop);
    },

    updateCharacterSkin: function updateCharacterSkin(skinValue, key) {
        var skins = null;
        skins = CharacterSkins[skinValue];
        skins[GameConfig.SkinSlots.MainHand] = "";
        skins[GameConfig.SkinSlots.OffHand] = "";
        this.changeSkin(skins, key);
    },

    changeSkin: function changeSkin(skins, key) {
        if (!(0, _entries2.default)(skins).length) return;else if (!skins[GameConfig.SkinSlots.BaseSkin]) return;

        this.currentSkins = skins;
        var skeleton = this.spineObj.skeleton;
        var newSkin = new PIXI.spine.core.Skin(skins[GameConfig.SkinSlots.BaseSkin]);

        (0, _entries2.default)(skins).forEach(function (_ref) {
            var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
                slot = _ref2[0],
                skinName = _ref2[1];

            if (skinName) {
                newSkin.addSkin(skeleton.data.findSkin(skinName));
            }
        });

        skeleton.setSkin(null);
        skeleton.setSkin(newSkin);
        skeleton.setSlotsToSetupPose();

        if (!key) {
            this.spineObj.state.apply(skeleton);
        }
    },

    changeSkinSlot: function changeSkinSlot(slot, skin) {
        this.currentSkins[slot] = skin;
        this.changeSkin(this.currentSkins);
    },


    changeHair: function changeHair() {
        //this.changeSlotAttachmentRegion('hero_hair', `hair/${this.hairSkin}`, direction);

        var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'side';
    },

    //TODO delete if not needed and changeSkinSlot can be used
    changeSlotAttachmentRegion: function changeSlotAttachmentRegion(slotName, skinName) {
        var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

        var slotIndex = this.spineObj.spineData.findSlot(slotName).index;
        var slot = this.spineObj.skeleton.slots[slotIndex];
        //const skin = this.spineObj.spineData.findSkin('default');
        var attachmentSkin = this.spineObj.spineData.findSkin(skinName);

        var skinAttachmentName = direction ? slotName + '_' + direction : slotName;
        var existingAttachment = attachmentSkin.getAttachment(slotIndex, skinAttachmentName);

        //const existingAttachment = skin.getAttachment(slotIndex, attachmentName);
        var region = existingAttachment.region;

        if (slot.attachment === null) {
            slot.setAttachment(existingAttachment);
        }

        var attachment = slot.getAttachment();
        slot.hackRegion = region;
        slot.hackAttachment = attachment;

        // @TODO:gfallas Check how to use spine.hackTextureBySlotIndex as this is the same copied logic using the region instead of the texture + region size
        if (slot.currentSprite && slot.currentSprite.region != region) {
            this.spineObj.setSpriteRegion(attachment, slot.currentSprite, region);
            slot.currentSprite.region = region;
        } else if (slot.currentMesh && slot.currentMesh.region != region) {
            this.spineObj.setMeshRegion(attachment, slot.currentMesh, region);
        }
        return true;
    },

    removeSlotAttachment: function removeSlotAttachment(slotName) {
        var slot = this.spineObj.skeleton.findSlot(slotName);
        slot.attachment = null;
    },

    m_init: function m_init() {
        this.isNew = false;
        this.wasInsideObstacle = false;
        this.insideObstacleType = '';
        this.lastInsideObstacleTime = 0.0;
        this.lastSwapIdx = -1;
        this.hasteSeq = -1;
        this.actionSoundInstance = null;
        this.inGameNotification = null;

        this.action = {
            type: Action.None,
            seq: -1,
            seqOld: -1,
            item: '',
            skin: '',
            targetId: 0,
            time: 0.0,
            duration: 0.0,
            throttleCount: 0,
            throttleTicker: 0.0
        };

        this.m_netData = {
            m_pos: v2.create(0.0, 0.0),
            m_dir: v2.create(1.0, 0.0),
            m_healthNormalized: 1,
            m_outfit: '',
            m_backpack: '',
            m_helmet: '',
            m_chest: '',
            m_neck: '',
            m_curWeapType: '',
            m_curOffHandType: '',
            m_curWeapState: {},
            m_chargedDash: 0,
            m_dashCooldown: 0,
            m_dashing: 0,
            m_layer: 0,
            m_dead: false,
            m_downed: false,
            m_animType: 0,
            m_animSeq: 0,
            m_actionType: 0,
            m_actionSeq: 0,
            m_wearingPan: false,
            m_wearingLasrSwrd: false,
            m_passiveHeal: false,
            m_isTarget: false,
            m_frozen: false,
            m_frozenOri: 0,
            m_freezeLevel: 0.0,
            m_frenemy: false,
            m_hasteType: 0,
            m_hasteSeq: 0,
            m_freezeActive: false,
            m_flaskEffect: false,
            m_chocolateBoxEffect: false,
            m_luckyEffect: false,
            m_wetEffect: false,
            m_infectedEffect: false,
            m_nitroLaceEffect: false,
            m_playerTransparent: false,
            m_savedByLuckEffect: false,
            m_gunchiladaEffect: false,
            m_watermelonEffect: false,
            m_biteEffect: false,

            //Temp player stats
            m_powerStat: 0,
            m_speedStat: 0,
            m_vitalityStat: 0,

            m_statsPoints: 0,
            m_playerXP: 0,
            m_level: 0,

            m_sugarRush: false,
            m_playSoundSugarRush: false,
            m_loadingBlaster: 0.0,
            m_windDir: 0,
            m_hailDamageEffect: false,
            m_playerIndoors: false,
            m_gunLoaded: false,
            m_actionItem: '',
            m_scale: 1.0,
            m_role: '',
            m_questsInfo: [],
            m_perks: [],
            m_hitState: 0,
            m_avatarSkin: '',
            m_hairSkin: '',
            m_armorType: '',
            m_armorLevel: 1,
            m_helmetType: '',
            m_helmetLevel: 1
        };

        //Add status effects
        this.m_netData.effects = [];

        this.m_localData = {
            m_maxHealth: GameConfig.player.health,
            m_health: GameConfig.player.maxHealth,
            m_zoom: 0.0,
            m_boost: 0.0,
            m_scope: '',
            m_curWeapIdx: 0,
            m_inventory: {},
            m_slotsInventory: {},
            m_weapons: [],
            m_spectatorCount: 0,
            m_luck: 0.0,
            m_wet: 0.0,
            m_contact: 0.0,
            m_burning: 0.0,
            m_nitroLace: 0.0,
            m_boons: []
        };
    },

    m_free: function m_free() {
        this.container.visible = false;
        this.auraContainer.visible = false;
        this.HpBarGFX.visible = false;
        this.timeToHideHpBar = 0;

        if (this.useItemEmitter) {
            this.useItemEmitter.stop();
            this.useItemEmitter = null;
        }
        if (this.hasteEmitter) {
            this.hasteEmitter.stop();
            this.hasteEmitter = null;
        }
        if (this.passiveHealEmitter) {
            this.passiveHealEmitter.stop();
            this.passiveHealEmitter = null;
        }
        if (this.passiveFreezeEmitter) {
            this.passiveFreezeEmitter.stop();
            this.passiveFreezeEmitter = null;
        }
        if (this.playerHeatEmitter) {
            this.playerHeatEmitter = null;
        }
        if (this.chocolateBoxEmiter) {
            this.chocolateBoxEmiter.stop();
            this.chocolateBoxEmiter = null;
        }

        if (this.savedByLuckEmiter) {
            this.savedByLuckEmiter.stop();
            this.savedByLuckEmiter = null;
        }

        if (this.bottleEmiter) {
            this.bottleEmiter.stop();
            this.bottleEmiter = null;
        }

        if (this.wetEmiter) {
            this.wetEmiter.stop();
            this.wetEmiter = null;
        }

        // Stop all effects
        StatusEffect.stopAllEffects(this);
        this.gearPerksController.stop();

        if (this.gunchiladaTimeEmiter) {
            this.gunchiladaTimeEmiter.stop();
            this.gunchiladaTimeEmiter = null;
        }

        if (this.watermelonTimeEmiter) {
            this.watermelonTimeEmiter.stop();
            this.watermelonTimeEmiter = null;
        }

        if (this.poppyHealEmitter) {
            this.poppyHealEmitter.stop();
            this.poppyHealEmitter = null;
        }

        if (this.hailEmitter) {
            this.hailEmitter.stop();
            this.hailEmitter = null;
        }

        if (this.sugarRushEmiter) {
            this.sugarRushEmiter.stop();
            this.sugarRushEmiter = null;
        }
    },

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        var _this = this;

        this.m_netData.m_pos = v2.copy(data.m_pos);
        this.m_netData.m_dir = v2.copy(data.m_dir);
        this.m_netData.m_healthNormalized = data.m_healthNormalized;

        if (fullUpdate) {
            this.m_netData.m_outfit = data.m_outfit;
            this.m_netData.m_backpack = data.m_backpack;
            this.m_netData.m_helmet = data.m_helmet;
            this.m_netData.m_chest = data.m_chest;
            this.m_netData.m_neck = data.m_neck;
            this.m_netData.m_curWeapType = data.m_curWeapType;
            this.m_netData.m_curOffHandType = data.m_curOffHandType;
            this.m_netData.m_curWeapState = {
                weapCooldowns: data.m_weapCooldowns,
                offHandCooldowns: data.m_offHandCooldowns,
                currentMainWeapon: data.m_currentMainWeap,
                currentOffHand: data.m_currentOffHand,
                isAttacking: data.m_isAttacking,
                currentAttackIsOffHand: data.m_currentAttackIsOffHand,
                currentAttack: GameConfig.AttackTypesToStr[data.m_currentAttack],
                isChargingAttack: data.m_isChargingAttack,
                selectedSkill: data.m_selectedSkill,
                selectedSlot: data.m_selectedSlot,
                selectedSlotItem: data.m_selectedSlotItem
            };
            this.m_netData.m_obstacleCollision = data.m_obstacleCollision;
            this.m_netData.m_chargedDash = data.m_chargedDash;
            this.m_netData.m_dashCooldown = data.m_dashCooldown;
            this.m_netData.m_dashing = data.m_dashing;
            this.m_netData.m_layer = data.m_layer;
            this.m_netData.m_dead = data.m_dead;
            this.m_netData.m_downed = data.m_downed;
            this.m_netData.m_disconnected = data.m_disconnected;
            this.m_netData.m_animType = data.m_animType;
            this.m_netData.m_hitState = data.m_hitState;
            this.m_netData.m_animSeq = data.m_animSeq;
            this.m_netData.m_actionType = data.m_actionType;
            this.m_netData.m_actionSeq = data.m_actionSeq;
            this.m_netData.m_wearingPan = data.m_wearingPan;
            this.m_netData.m_wearingLasrSwrd = data.m_wearingLasrSwrd;
            this.m_netData.m_passiveHeal = data.m_passiveHeal;
            this.m_netData.m_isTarget = data.m_isTarget;
            this.m_netData.m_frozen = data.m_frozen;
            this.m_netData.m_frozenOri = data.m_frozenOri;
            this.m_netData.m_freezeLevel = data.m_freezeLevel;
            this.m_netData.m_frenemy = data.m_frenemy;
            this.m_netData.m_hasteType = data.m_hasteType;
            this.m_netData.m_hasteSeq = data.m_hasteSeq;
            this.m_netData.m_freezeActive = data.m_freezeActive;
            this.m_netData.m_flaskEffect = data.m_flaskEffect;
            this.m_netData.m_chocolateBoxEffect = data.m_chocolateBoxEffect;
            this.m_netData.m_luckyEffect = data.m_luckyEffect;
            this.m_netData.m_wetEffect = data.m_wetEffect;
            this.m_netData.m_infectedEffect = data.m_infectedEffect;
            this.m_netData.m_avatarSkin = data.m_avatarSkin;
            this.m_netData.m_hairSkin = data.m_hairSkin;
            this.m_netData.m_armorType = data.m_armorType;
            this.m_netData.m_armorLevel = data.m_armorLevel;
            this.m_netData.m_helmetType = data.m_helmetType;
            this.m_netData.m_helmetLevel = data.m_helmetLevel;

            //Update weapon manager
            this.WeaponManager.m_update(this.m_netData.m_curWeapState);

            //Add status effects
            this.m_netData.effects = data.effects;

            this.m_netData.m_nitroLaceEffect = data.m_nitroLaceEffect;
            this.m_netData.m_playerTransparent = data.m_playerTransparent;
            this.m_netData.m_savedByLuckEffect = data.m_savedByLuckEffect;
            this.m_netData.m_gunchiladaEffect = data.m_gunchiladaEffect;
            this.m_netData.m_watermelonEffect = data.m_watermelonEffect;
            this.m_netData.m_biteEffect = data.m_biteEffect;
            this.m_netData.m_sugarRush = data.m_sugarRush;
            this.m_netData.m_healByItemEffect = data.m_healByItemEffect;
            //this.m_netData.m_movedByOrbEffect = data.m_movedByOrbEffect;//TODO get with status effects

            //Temp player stats
            this.m_netData.m_powerStat = data.m_powerStat, this.m_netData.m_speedStat = data.m_speedStat, this.m_netData.m_vitalityStat = data.m_vitalityStat, this.m_netData.m_statsPoints = data.m_statsPoints, this.m_netData.m_playerXP = data.m_playerXP, this.m_netData.m_level = data.m_level, this.m_netData.m_playSoundSugarRush = data.m_playSoundSugarRush;
            this.m_netData.m_loadingBlaster = data.m_loadingBlaster;
            this.m_netData.m_windDir = data.m_windDir;
            this.m_netData.m_hailDamageEffect = data.m_hailDamageEffect;
            this.m_netData.m_playerIndoors = data.m_playerIndoors;
            this.m_netData.m_gunLoaded = data.m_gunLoaded;
            this.m_netData.m_isLarge = data.m_isLarge;
            this.m_netData.m_isSmall = data.m_isSmall;
            this.m_netData.m_windwalk = data.m_windwalk;
            this.m_netData.m_actionItem = data.m_actionItem;
            this.m_netData.m_scale = data.m_scale;
            this.m_netData.m_role = data.m_role;
            if (GameConfig.features.inGameNotificationActive && this.progressNotificationActive) {
                this.m_netData.m_questsInfo = data.m_questsInfo;

                //If quests changed update them locally to show in game notification
                if (!compareArray(this.localQuestInfo, this.m_netData.m_questsInfo)) {
                    this.localQuestInfo = this.m_netData.m_questsInfo;
                    clearTimeout(this.triggerNotification);
                    this.questsInfoChanged = false;
                    this.questsProgressChanging = true;
                } else {
                    if (this.questsProgressChanging) {
                        this.questsProgressChanging = false;
                        this.triggerNotification = setTimeout(function () {
                            _this.questsInfoChanged = true;
                        }, 1500);
                    }
                }
            }

            if (isNew || !perksEqual(this.m_netData.m_perks, data.m_perks)) {
                this.perksDirty = true;
            }
            this.m_netData.m_perks = data.m_perks;

            if (data.m_animSeq != this.anim.seq) {
                this.playAnimation(data.m_animType, data.m_animSeq, data.m_animDefinitionId);
            }

            this.lastActionType = this.action.type;
            this.action.type = data.m_actionType;
            this.action.seq = data.m_actionSeq;
            this.action.item = data.m_actionItem;

            this.visualsDirty = true;
        }

        if (isNew) {
            this.isNew = true;

            this.healthNormalizedOld = data.m_healthNormalized;
            this.renderLayer = this.m_netData.m_layer;
            this.renderZOrd = 18;
            this.renderZIdx = this.__id;
        }
    },

    m_setLocalData: function m_setLocalData(data, playerBarn) {
        var scopeOld = this.m_localData.m_scope;

        this.m_localData.boons = data.boons;

        if (data.healthDirty) {
            this.m_localData.m_maxHealth = data.maxHealth;
            this.m_localData.m_health = data.health;
        }

        if (data.boostDirty) {
            this.m_localData.m_boost = data.boost;
        }

        if (data.luckDirty) {
            this.m_localData.m_luck = data.luck;
        }

        if (data.wetDirty) {
            this.m_localData.m_wet = data.wetPorcentage;
        }

        if (data.zoomDirty) {

            this.zoomFast = false;
            this.m_localData.m_zoom = data.zoom;
            this.m_localData.m_zoomInSpeed = data.zoomInSpeed;
            this.m_localData.m_zoomOutSpeed = data.zoomOutSpeed;
        }

        /*let length = this.effects.length;
        for (let i = 0; i < length; i++)
        {
            let effect = this.effects[i];
            if (data[effect.id + "dirty"])
            {
                this.m_localData[effect.id] = data[effect.id + "percentage"];
            }
        }*/
        var length = data.effects.length;
        if (length > 0) {
            for (var _i4 = 0; _i4 < length; _i4++) {
                var effect = StatusEffect.getEffectData(data.effects[_i4].id);
                if (effect) {
                    this.m_localData[effect.name] = data.effects[_i4].percentage;
                }
            }
        }

        this.gearPerksController.updateClientBoons(this.m_localData.boons);

        if (data.nitroLaceDirty) {
            this.m_localData.m_nitroLace = data.nitroLacePorcentage;
        }

        if (data.actionDirty) {
            this.action.time = data.action.time;
            this.action.duration = data.action.duration;
            this.action.targetId = data.action.targetId;
        }
        this.m_localData.inventoryDirty = data.inventoryDirty;

        if (data.inventoryDirty) {
            this.m_localData.m_scope = data.scope;
            this.m_localData.m_inventory = {};

            for (var item in GameConfig.bagSizes) {
                if (GameConfig.bagSizes.hasOwnProperty(item)) {
                    this.m_localData.m_inventory[item] = data.inventory[item];
                }
            }

            this.m_localData.m_slotsInventory = data.slotsInventory;

            /*for (let i = 0; i < data.slotsInventorySize; i++) {
                this.m_localData.m_slotsInventory[i] = {
                    item: data.slotsInventory[i]['item'],
                    total: data.slotsInventory[i]['total']
                };
            }*/
        }

        if (data.weapsDirty) {
            this.m_localData.m_curWeapIdx = data.curWeapIdx;
            this.m_localData.m_weapons = [];
            for (var _i5 = 0; _i5 < GameConfig.WeaponSlot.Count; _i5++) {
                var w = {};
                w.type = data.weapons[_i5].type;
                w.ammo = data.weapons[_i5].ammo;
                this.m_localData.m_weapons.push(w);
            }
        }

        if (data.spectatorCountDirty) {
            this.m_localData.m_spectatorCount = data.spectatorCount;
        }

        if (data.cameraPositionDirty) {
            this.cameraPositionDirty = data.cameraPositionDirty;
        }

        // Zoom more quickly when changing scopes
        if (this.m_localData.m_scope != scopeOld) {
            this.zoomFast = true;
        }
    },

    m_getZoom: function m_getZoom() {
        var zoom = this.m_localData.m_zoom;

        if (device.mobile) {
            var stepIdx = DesktopZoomSteps.indexOf(zoom);
            if (stepIdx !== -1) {
                zoom = MobileZoomSteps[stepIdx];
            }
        }
        return zoom;
    },

    m_getHelmetLevel: function m_getHelmetLevel() {
        return this.m_netData.m_helmet ? GameObjectDefs[this.m_netData.m_helmet].level : 0;
    },

    m_getChestLevel: function m_getChestLevel() {
        return this.m_netData.m_chest ? GameObjectDefs[this.m_netData.m_chest].level : 0;
    },

    m_getNeckLevel: function m_getNeckLevel() {
        return this.m_netData.m_neck ? GameObjectDefs[this.m_netData.m_neck].level : 0;
    },

    m_getBagLevel: function m_getBagLevel() {
        return GameObjectDefs[this.m_netData.m_backpack].level;
    },

    m_equippedWeaponType: function m_equippedWeaponType() {
        return this.m_netData.m_curWeapType !== '' ? GameObjectDefs[this.m_netData.m_curWeapType].type : null;
    },

    m_hasWeaponInSlot: function m_hasWeaponInSlot(idx) {
        return this.m_localData.m_weapons[idx].type !== '';
    },

    /**
     * Calculates melee collider
     * @returns Object collider with pos, rad, angle, min max and points
     */
    getMeleeCollider: function getMeleeCollider() {
        var attackDef = this.WeaponManager.currentAttack && !this.WeaponManager.currentAttack.isOffHand ? this.WeaponManager.currentAttack.attackDef : this.WeaponManager.mainWeaponDef.attacks.lightAttack;

        var angle = void 0;

        var dir = this.WeaponManager.currentAttack && this.WeaponManager.currentAttack.direction ? this.WeaponManager.currentAttack.direction : this.dir;

        if (!attackDef.directionInverted) angle = math.rad2degFromDirection(dir.y, dir.x);else angle = math.rad2degFromDirection(dir.y, dir.x);

        var meleeDirection = this.getAngleDirection(angle);

        var offset = attackDef.offset;
        var colliderAngle = 90; //up
        if (!attackDef.freeDirection) {
            switch (meleeDirection) {
                case "left":
                    colliderAngle = 180;
                    if (attackDef.offset_left) offset = attackDef.offset_left;
                    break;
                case "right":
                    colliderAngle = 0;
                    if (attackDef.offset_right) offset = attackDef.offset_right;
                    break;
                case "down":
                    colliderAngle = 270;
                    if (attackDef.offset_down) offset = attackDef.offset_down;
                    break;
                default:
                    break;
            }
        } else {
            colliderAngle = angle;
        }

        if (!offset) return null;

        var off = v2.add(offset, v2.mul(v2.create(1.0, 0.0), this.m_netData.m_scale - 1.0));

        var rot = colliderAngle * Math.PI / 180; //rad
        var pos = v2.add(this.pos, v2.rotate(off, rot));

        /*v2.add(
            this.pos, v2.rotate(off, colliderAngle)
        );*/
        var rad = attackDef.rad;

        var meleeWidth = GameConfig.player.meleeWidthDefault;
        var meleeHeight = GameConfig.player.meleeHeightDefault;
        if (attackDef.width) {
            meleeWidth = attackDef.width;
        }

        if (attackDef.height) {
            meleeHeight = attackDef.height;
        }

        if (!attackDef.freeDirection) {
            if (meleeDirection == "up" || meleeDirection == "down") {
                var tempWidth = meleeWidth;
                meleeWidth = meleeHeight;
                meleeHeight = tempWidth;
            }
        }

        var meleeHitbox = collider.createAabbExtents(v2.create(0.0, 0.0), v2.create(meleeWidth, meleeHeight));

        var rotAngle = attackDef.freeDirection ? colliderAngle : 0;
        var meleeCollider = collider.transform(meleeHitbox, pos, rotAngle, 1, true);

        meleeCollider.pos = pos;
        meleeCollider.rad = rad;
        meleeCollider.angle = colliderAngle;

        return meleeCollider;
    },

    getPanSegment: function getPanSegment() {
        var panSurface = this.m_netData.m_wearingPan ? 'unequipped' : 'equipped';
        return GameObjectDefs['pan'].reflectSurface[panSurface];
    },

    //TODO Clean all of lasr swrd
    //TODO Clean all of pan
    changeLasrSwrdPose: function changeLasrSwrdPose() {
        this.playAnimation(Anim.ChangePose, this.anim.seq);
    },

    getLasrSwrdReflectArea: function getLasrSwrdReflectArea() {
        var meleeDef = GameObjectDefs[this.m_netData.m_curWeapType];
        var ang = Math.atan2(this.dir.y, this.dir.x);
        var off = v2.add(meleeDef.reflectArea.offset, v2.mul(v2.create(1.0, 0.0), this.m_netData.m_scale - 1.0));
        var pos = v2.add(this.pos, v2.rotate(off, ang));
        var rad = meleeDef.reflectArea.rad;
        return collider.createCircle(pos, rad, 0.0);
    },

    canInteract: function canInteract(map) {
        return !this.m_netData.m_dead && (!map.perkMode || this.m_netData.m_role);
    },

    blindEffect: function blindEffect(isActive) {
        if (isActive) {
            var sprite = 'blind-effect-screen.img';
            this.blindImage.texture = PIXI.Texture.fromImage(sprite);
            this.blindImage.anchor.set(0.5, 0.5);
            this.blindImage.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            //this.blindImage.scale.set(window.innerWidth / this.blindImage.texture.width,window.innerHeight / this.blindImage.texture.height);

            this.blindImage.scale.set(0.4, 0.4);

            this.blindImage.alpha = 0.0;
            this.blindImage.visible = true;
        }
    },


    m_updatePerks: function m_updatePerks(isActivePlayer, isSpectating, ui2Manager) {
        var _this2 = this;

        for (var _i6 = 0; _i6 < this.perks.length; _i6++) {
            this.perks[_i6].isNew = false;
        }

        if (this.perksDirty) {
            if (isActivePlayer && !isSpectating) {
                var _loop = function _loop(_i7) {
                    var perk = _this2.m_netData.m_perks[_i7];
                    if (_this2.perks.findIndex(function (x) {
                        return x.type == perk.type;
                    }) === -1) {
                        ui2Manager.addRareLootMessage(perk.type);
                    }
                };

                // Create Ui notifications for newly added perks
                for (var _i7 = 0; _i7 < this.m_netData.m_perks.length; _i7++) {
                    _loop(_i7);
                }

                // Remove active Ui messages for perks we no longer have

                var _loop2 = function _loop2(_i8) {
                    var perk = _this2.perks[_i8];
                    if (_this2.m_netData.m_perks.findIndex(function (x) {
                        return x.type == perk.type;
                    }) === -1) {
                        ui2Manager.removeRareLootMessage(perk.type);
                    }
                };

                for (var _i8 = 0; _i8 < this.perks.length; _i8++) {
                    _loop2(_i8);
                }
            }

            // Update the internal perk list and calculate an 'isNew' property;
            // this is used by the Ui to animate the perk icon.
            var perks = [];

            var _loop3 = function _loop3(_i9) {
                var perk = _this2.m_netData.m_perks[_i9];
                var isNew = _this2.perks.findIndex(function (x) {
                    return x.type == perk.type;
                }) === -1;
                perks.push({
                    type: perk.type,
                    droppable: perk.droppable,
                    isNew: isNew && !_this2.isNew
                });
            };

            for (var _i9 = 0; _i9 < this.m_netData.m_perks.length; _i9++) {
                _loop3(_i9);
            }
            this.perks = perks;

            this.perkTypes = [];
            for (var _i10 = 0; _i10 < this.m_netData.m_perks.length; _i10++) {
                this.perkTypes.push(this.m_netData.m_perks[_i10].type);
            }

            this.perksDirty = false;
        }
    },

    hasPerk: function hasPerk(type) {
        return this.perkTypes.indexOf(type) !== -1;
    },

    /**
     * This method check if player is inside camera dead zone, if player is outside calculate the new camera position
     * @param cameraPos current camera position
     *  */
    checkCamera: function checkCamera(cameraPos) {
        var res = collider.intersectcameraDeadZoneCollider(this.playerCameraCollider, this.cameraDeadZoneCollider);

        if (!res) {
            //if is outside
            if (cameraPos.x > 0) {
                //if camera initialized

                if (this.cameraMovementTicker <= 0.0) {
                    //if camera is not moving

                    this.cameraMovementTicker = 1.0;

                    //if player using dash
                    if (this.m_netData.m_dashing > 0) {
                        //Camera movement duration
                        this.cameraMovementTicker = GameConfig.camera.cameraMoveDuration;
                        this.applySmooth = true;
                    } else {
                        //Distance that player has moved
                        var differenceX = Math.abs(this.pos.x - this.posOld.x);
                        var differenceY = Math.abs(this.pos.y - this.posOld.y);

                        if (differenceX > 1 || differenceY > 1) {
                            //if distance needs smooth camera movement
                            this.applySmooth = true;
                        } else {
                            this.applySmooth = false;
                        }

                        //Player dir
                        var dirX = 1;
                        var dirY = 1;
                        if (this.pos.x < this.posOld.x) {
                            dirX = -1;
                        }

                        if (this.pos.y < this.posOld.y) {
                            dirY = -1;
                        }

                        differenceX *= dirX;
                        differenceY *= dirY;

                        var newPos = v2.create(cameraPos.x + differenceX, cameraPos.y + differenceY);
                        this.playerCameraPos = newPos;
                    }
                }
            }
        }

        return res;
    },


    gameOver: function gameOver() {
        this.isGameOver = true;
    },

    m_update: function m_update(dt, playerBarn, map, audioManager, particleBarn, inputBinds, camera, renderer, ui2Manager, activeId, preventInput, displayingStats, isSpectating, pass, localization, progressNotificationActive) {

        var curWeapDef = GameObjectDefs[this.m_netData.m_curWeapType];
        var isActivePlayer = this.__id == activeId;
        var activePlayer = playerBarn.m_getPlayerById(activeId);

        //Flash <color> when damaged
        if (this.spineObj) {
            if (this.currentHurtColor != 0) {
                this.flashHurtTime -= dt;
                if (this.flashHurtTime <= 0) {
                    if (this.currentHurtColor == 1) {
                        this.repeatedHurtFlash += 1;
                        if (this.repeatedHurtFlash < kRepeatHurtColors) {
                            this.currentHurtColor = 2;
                            this.flashHurtTime = kFlashHurtDuration2;
                        } else {
                            this.currentHurtColor = 0;
                            this.repeatedHurtFlash = 0;
                        }
                    } else {
                        if (this.repeatedHurtFlash <= kRepeatHurtColors) {
                            this.currentHurtColor = 1;
                            this.flashHurtTime = kFlashHurtDuration1;
                        }
                    }
                }

                if (this.currentHurtColor == 1) this.spineObj.tint = kFlashHurtColor1;else this.spineObj.tint = kFlashHurtColor2;
            } else if (this.spineObj.tint != 0xffffff) this.spineObj.tint = 0xffffff;
        }

        //If vida < 25%, Heartbeat
        if (this.healthNormalizedOld < 0.25 && !audioManager.isSoundPlaying(this.heartbeat) && isActivePlayer && this.healthNormalizedOld > 0 && !this.isGameOver) {
            this.heartbeat = audioManager.playSound('sfx_player_heartbeat', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                loop: true,
                muffled: true });
        } else if (this.healthNormalizedOld > 0.25 || this.healthNormalizedOld <= 0 || this.isGameOver) {
            audioManager.stopSound(this.heartbeat);
            this.heartbeat = null;
        }

        this.wasMoving = this.isMoving;
        this.progressNotificationActive = progressNotificationActive;
        this.posOld = v2.copy(this.pos);
        this.dirOld = v2.copy(this.dir);
        this.oldDirections = (0, _assign2.default)(this.oldDirections, this.directions);
        this.pos = v2.copy(this.m_netData.m_pos);
        this.dir = v2.copy(this.m_netData.m_dir);
        this.layer = this.m_netData.m_layer;
        this.downed = this.m_netData.m_downed;
        this.rad = this.m_netData.m_scale * GameConfig.player.radius;

        this.oldLevel = this.level;
        this.level = this.m_netData.m_level;

        if (!this.baseSkinApplied && playerBarn.spineData && this.m_netData.m_avatarSkin) {
            var skinDef = this.m_netData.m_avatarSkin ? GameObjectDefs[this.m_netData.m_avatarSkin] : {};
            var hairDef = this.m_netData.m_hairSkin ? GameObjectDefs[this.m_netData.m_hairSkin] : {};
            var armorDef = this.m_netData.m_armorType ? GameObjectDefs[this.m_netData.m_armorType] : {};
            var helmetDef = this.m_netData.m_helmetType ? GameObjectDefs[this.m_netData.m_helmetType] : {};
            var skins = (0, _assign2.default)({}, skinDef.skins, hairDef.skins, armorDef.skins, helmetDef.skins);
            this.setSpine(playerBarn.spineData, skins);
        }

        if (!this.WeaponManager.initialized) this.WeaponManager.init(this, map, renderer, playerBarn, particleBarn, audioManager);

        if (!this.AnimationController.initialized) {
            this.AnimationController.init(inputBinds, audioManager, isActivePlayer);
        }

        var stepDistance = v2.length(v2.sub(this.posOld, this.pos));

        this.framesStopped = stepDistance === 0 ? this.framesStopped + 1 : 0;
        this.isMoving = !(this.framesStopped > GameConfig.player.framesUntilStopMoving);

        var isDashing = this.m_netData.m_dashing > 0;
        var animateDash = isDashing;
        if (this.WeaponManager.currentAttack && this.WeaponManager.currentAttack.attackDef.dash && isDashing && this.isAttacking()) {
            var attackDef = this.WeaponManager.currentAttack.attackDef;
            animateDash = attackDef && attackDef.dash.animate ? true : false;
        }

        this.WeaponManager.update(dt, this.dir);

        this.attackingOld = this.attacking;
        this.attacking = this.isAttacking();

        this.isDashing = this.m_netData.m_dashing > 0;
        this.collider = collider.transform(this.playerHitbox, this.pos, 0, 1);

        this.cameraDeadZoneCollider = collider.transform(this.playerCameraDeadZoneHitbox, camera.pos, 0, 1);

        this.movementCollider = collider.transform(this.movementHitbox, this.pos, 0, 1);

        this.playerCameraCollider = collider.transform(this.playerCameraHitbox, this.pos, 0, 1);

        // Ease radius transitions
        if (!math.eqAbs(this.rad, this.bodyRad)) {
            var bodyRadDist = this.rad - this.bodyRad;
            var bodyRadStep = Math.abs(bodyRadDist) > 0.0001 ? bodyRadDist * dt * 6.0 : bodyRadDist;
            if (this.isNew) {
                bodyRadStep = bodyRadDist;
            }
            this.bodyRad += bodyRadStep;
            this.visualsDirty = true;
        }

        this.selectedSkill = this.WeaponManager.selectedSkill;

        // Calculate an aabb that fits the camera view
        if (isActivePlayer) {

            var visible = StatusEffect.getPlayerEffect(8, this);

            if (this.blindImage.alpha < 1.0 && visible || this.blindImage.alpha > 0.0 && !visible) {

                this.blindImage.alpha = math.lerp(dt * 5.0, this.blindImage.alpha, visible ? 1.0 : 0.0);
            }

            // Refactor to use a callback 
            if (this.WeaponManager.hasSelectedSkill() && this.WeaponManager.selectedSkillDef && (this.selectedSkillOld !== this.WeaponManager.selectedSkill || this.WeaponManager.selectedWeaponDef !== this.skillTelegraph.weaponDef)) {
                this.skillTelegraph.show(this.WeaponManager.selectedWeaponDef, this.WeaponManager.selectedSkillDef, camera);

                if (this.WeaponManager.selectedSkillDef.zoomInSpeed) {
                    //   this.zoomSpeed.zoomIn = this.WeaponManager.selectedSkillDef.zoomInSpeed;
                }

                if (this.WeaponManager.selectedSkillDef.zoomOutSpeed) {
                    // this.zoomSpeed.zoomOut = this.WeaponManager.selectedSkillDef.zoomInSpeed;
                }
            } else if (this.selectedSkill === GameConfig.SelectedSkill.None || !this.WeaponManager.selectedSkillDef) {
                this.skillTelegraph.hide();
                //   this.zoomSpeed.zoomIn = null;
                //  this.zoomSpeed.zoomOut = null;
            }

            this.skillTelegraph.update(dt, this.dir, camera);
            this.gearPerksController.update(dt);

            var viewEdge = camera.m_screenToPoint(v2.create(camera.screenWidth, 0.0));
            var viewExtent = v2.sub(viewEdge, camera.pos);
            this.viewAabb.min = v2.sub(camera.pos, viewExtent);
            this.viewAabb.max = v2.add(camera.pos, viewExtent);
        }

        this.selectedSkillOld = this.WeaponManager.selectedSkill;

        // Should happen early in the frame so the rest of the update will have
        // accurate hasPerk() calls
        this.m_updatePerks(isActivePlayer, isSpectating, ui2Manager);

        var weapTypeDirty = this.weapTypeOld != this.m_netData.m_curWeapType;
        this.weapTypeOld = this.m_netData.m_curWeapType;

        this.lastThrowablePickupSfxTicker -= dt;
        this.noCeilingRevealTicker -= dt;

        // Update nameText
        var activeGroupId = playerBarn.m_getPlayerInfo(activeId).groupId;
        var playerInfo = playerBarn.m_getPlayerInfo(this.__id);
        var inSameGroup = playerInfo.groupId == activeGroupId;
        this.nameText.text = playerInfo.name;
        this.nameText.visible = !isActivePlayer && inSameGroup;

        // Locate nearby obstacles that may play interaction effects
        var insideObstacle = null;
        var doorErrorObstacle = null;
        var obstacles = map.m_obstaclePool.m_getPool();
        for (var j = 0; j < obstacles.length; j++) {
            var o = obstacles[j];
            if (!o.active || o.dead || o.layer != this.m_netData.m_layer) {
                continue;
            }
            if (o.isBush) {
                var rad = this.rad * 0.25;
                //collider.intersectCircle(o.collider, this.pos, rad)
                if (collider.intersect(o.collider, this.collider)) {
                    insideObstacle = o;
                }
            }

            //Temp player stats update
            //  ui2Manager.setPlayerStats(this.m_netData.m_powerStat,this.m_netData.m_speedStat,this.m_netData.m_vitalityStat);


            //Not needed laser sword
            if (this.m_netData.m_movedByOrbEffect) {
                var rad2 = this.bodyRad + 1.5;
                //DebugLines.addCircle(this.pos, rad2, 0xff8c8c, 0.0);
                var obsDef = MapObjectDefs[o.type];
                if (collider.intersectCircle(o.collider, this.pos, rad2)) {
                    audioManager.playGroup(obsDef.sound.punch, {
                        channel: 'hits',
                        soundPos: this.pos,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                }
            } else if (o.isDoor) {
                var _rad = this.rad + 0.25;
                var toDoor = v2.sub(o.pos, this.pos);
                var doorDir = v2.rotate(v2.create(1.0, 0.0), o.rot);
                // let res = collider.intersectCircle(o.collider, this.pos, rad);
                var res = collider.intersect(o.collider, this.collider);
                if (res && (o.door.locked || o.door.openOneWay && v2.dot(toDoor, doorDir) < 0.0)) {
                    doorErrorObstacle = o;
                }
            }
        }

        // Enter/exit bush effects
        var isInside = insideObstacle != null;
        if (isInside) {
            this.insideObstacleType = insideObstacle.type;
        }
        this.lastInsideObstacleTime -= dt;
        if (this.wasInsideObstacle != isInside && this.lastInsideObstacleTime < 0.0 && !this.isNew) {
            var obstacleDef = MapObjectDefs[this.insideObstacleType];

            this.lastInsideObstacleTime = 0.2;
            audioManager.playSound(obstacleDef.sound.enter, {
                channel: "sfx",
                soundPos: this.pos,
                falloff: 1.0,
                layer: this.layer,
                filter: 'muffled'
            });

            var moveDir = v2.normalizeSafe(v2.sub(this.posOld, this.pos), v2.create(1.0, 0.0));
            var partDir = isInside ? 1.0 : -1.0;
            var numParticles = Math.floor(util.random(3, 5));
            for (var k = 0; k < numParticles; k++) {
                var vel = v2.mul(v2.rotate(v2.mul(moveDir, partDir), (Math.random() - 0.5) * Math.PI / 1.5), util.random(6, 8));
                particleBarn.addParticle(obstacleDef.hitParticle, this.layer, this.pos, vel);
            }
        }
        this.wasInsideObstacle = isInside;

        // Play a sound effect when touching a one-way door from the wrong side
        var wasNearDoorError = this.isNearDoorError;
        this.isNearDoorError = doorErrorObstacle != null;
        this.doorErrorTicker -= dt;
        if (this.isNearDoorError && !wasNearDoorError && this.doorErrorTicker <= 0.0) {
            this.doorErrorTicker = 0.5;

            var doorDef = MapObjectDefs[doorErrorObstacle.type];
            var doorSfx = doorDef.door.sound.error;
            audioManager.playSound(doorSfx, {
                channel: "sfx",
                soundPos: this.pos,
                falloff: 1.0,
                layer: this.layer,
                filter: 'muffled'
            });
        }

        this.surface = map.getGroundSurface(this.pos, this.layer);

        //SOUND

        var inWater = this.surface.type == 'water';

        // Water submersion
        if (!map.snowMode) {
            this.updateSubmersion(dt, map);
        } else {
            // Frozen
            this.updateFrozenState(dt);
        }

        // Play a footstep if we've moved enough
        if (!this.m_netData.m_dead) {
            var kPlayerStepInterval = 4.0;
            var kPlayerRippleInterval = 5.0;

            this.stepDistance += v2.length(v2.sub(this.posOld, this.pos));
            if ((this.stepDistance > kPlayerRippleInterval && inWater || inWater && !this.wasInWater) && !map.snowMode && !this.m_netData.m_movedByOrbEffect) {
                this.stepDistance = 0.0;

                if (map.infernoMode && this.m_netData.m_playerIndoors) {
                    particleBarn.addRippleParticle(this.pos, this.layer, 0xb3f0ff);
                } else {

                    particleBarn.addRippleParticle(this.pos, this.layer, this.surface.data.rippleColor);
                }

                if (map.infernoMode && !this.m_netData.m_playerIndoors) {
                    audioManager.playGroup("footstep_lava", {
                        soundPos: this.pos,
                        fallOff: 3.0,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                } else {
                    audioManager.playGroup("footstep_water", {
                        soundPos: this.pos,
                        fallOff: 3.0,
                        layer: this.layer,
                        filter: 'muffled'
                    });
                }
            } else if (this.stepDistance > kPlayerStepInterval && !inWater && !this.m_netData.m_movedByOrbEffect) {
                this.stepDistance = 0.0;
                //console.log(this.surface.type);
                //console.log(this.surface);

                audioManager.playGroup("footstep_" + this.surface.type, {
                    soundPos: this.pos,
                    fallOff: 3.0,
                    layer: this.layer,
                    filter: 'muffled'
                });

                audioManager.playGroup("footstep_" + this.surface, {
                    soundPos: this.pos,
                    fallOff: 3.0,
                    layer: this.layer,
                    filter: 'muffled'
                });
            }
            this.wasInWater = inWater;
        }

        //Heat effect
        if (this.m_netData.m_flaskEffect && !this.playerHeatEmitter && !this.m_netData.m_dead) {
            this.playerHeatEmitter = particleBarn.addHeatParticle(this.pos, this.layer);
        } else if (this.playerHeatEmitter && !this.playerHeatEmitter.active) {
            this.playerHeatEmitter = null;
        }
        if (this.playerHeatEmitter && this.playerHeatEmitter.active) {
            this.playerHeatEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.playerHeatEmitter.layer = this.renderLayer;
            this.playerHeatEmitter.zOrd = this.renderZOrd + 1;
        }

        // Take bleeding damage
        this.bleedTicker -= dt;
        var bleeding = !this.m_netData.m_dead && (this.m_netData.m_downed && this.action.type == Action.None || this.hasPerk('trick_drain'));
        if (bleeding && this.bleedTicker < 0.0) {
            this.bleedTicker = this.hasPerk('trick_drain') ? GameConfig.player.bleedTickRate * 3.0 : GameConfig.player.bleedTickRate;
            var _vel = v2.rotate(v2.mul(this.dir, -1.0), (Math.random() - 0.5) * Math.PI / 3.0);
            _vel.y *= -1.0;
            particleBarn.addParticle('bloodSplat', this.renderLayer, v2.create(0.0, 0.0), v2.mul(_vel, camera.ppu), 1.0, Math.random() * Math.PI * 2.0, this.container, this.renderZOrd + 1);
            if (!displayingStats) {
                audioManager.playSound('player_bullet_hit_02', {
                    channel: 'hits',
                    soundPos: this.pos,
                    fallOff: 3.0,
                    layer: this.layer,
                    filter: 'muffled'
                });
            }
        }

        this.biteTicker -= dt;

        var playerBitten = !this.m_netData.m_dead && this.m_netData.m_biteEffect;
        if (playerBitten && this.biteTicker < 0.0) {

            //  this.biteTicker = GameConfig.player.bleedTickRate * 3.0 ;
            var _vel2 = v2.rotate(v2.mul(this.dir, -1.0), (Math.random() - 0.5) * Math.PI / 3.0);
            _vel2.y *= -1.0;
            particleBarn.addParticle('bite', this.renderLayer, v2.create(0.0, 0.0), v2.mul(_vel2, camera.ppu), 1.0, Math.random() * Math.PI * 2.0, this.container, this.renderZOrd + 1);
        }

        this.biteTickerSound -= dt;

        if (playerBitten && this.biteTickerSound < 0.0) {

            this.biteTickerSound = GameConfig.player.bleedTickRate * 0.5;

            audioManager.playSound('skitter_bite_01', {
                channel: 'hits',
                soundPos: this.pos,
                fallOff: 3.0,
                layer: this.layer,
                filter: 'muffled'
            });
        }

        // Only play swaps for local players.
        //
        // @TODO: There's a bug where you can hear switch sounds when other
        //        players come into view. Need to check isNew for other players.
        this.gunSwitchCooldown -= dt;
        this.fireDelay -= dt;
        if (isActivePlayer && this.m_netData.m_curWeapType !== '' && (weapTypeDirty || this.lastSwapIdx != this.m_localData.m_curWeapIdx)) {
            var lastWeapIdx = this.lastSwapIdx;
            this.lastSwapIdx = this.m_localData.m_curWeapIdx;
            if (audioManager.isSoundPlaying(this.soundLoadingInstance)) {
                audioManager.stopSound(this.soundLoadingInstance);
                this.soundLoadingInstance = null;
            }
            var itemDef = GameObjectDefs[this.m_netData.m_curWeapType];
            // @TODO: Gun and melee/throwable should use the same logic
            if (itemDef.type == 'melee' || itemDef.type == 'throwable') {
                // @HACK: Equipping a throwable currently plays
                // the same SFX as picking up a throwable, leading
                // to an echo effect
                if (itemDef.type != 'throwable' || this.lastThrowablePickupSfxTicker <= 0.0) {
                    // Fixes issue with melee equip sounds being offset in the loadoutMenu
                    var soundPos = this.isLoadoutAvatar ? camera.pos : this.pos;
                    audioManager.playSound(itemDef.sound.deploy, {
                        channel: "sfx",
                        soundPos: soundPos,
                        fallOff: 3.0
                    });
                }
            } else if (itemDef.type == 'gun') {
                var switchSound = 'gun_switch_01';
                var deployFull = false;
                // Check if we're using 2 guns in the same group
                if ((lastWeapIdx == 0 || lastWeapIdx == 1) && (this.lastSwapIdx == 0 || this.lastSwapIdx == 1) && this.fireDelay > 0.0) {
                    var lastWeapDef = GameObjectDefs[this.m_localData.m_weapons[lastWeapIdx].type];
                    if (itemDef && lastWeapDef && itemDef.deployGroup !== undefined && lastWeapDef.deployGroup !== undefined && itemDef.deployGroup == lastWeapDef.deployGroup) {
                        deployFull = true;
                    }
                }

                if (this.gunSwitchCooldown > 0.0 || deployFull) {
                    switchSound = itemDef.sound.deploy;
                } else {
                    this.gunSwitchCooldown = GameConfig.player.freeSwitchCooldown;
                }

                audioManager.stopSound(this.cycleSoundInstance);
                this.cycleSoundInstance = audioManager.playSound(switchSound, {
                    channel: "activePlayer"
                });
                this.fireDelay = 0.0;
            }
        }
        if (!audioManager.isSoundPlaying(this.cycleSoundInstance)) {
            this.cycleSoundInstance = null;
        }

        // Action effect
        if (this.action.seq != this.action.seqOld && !this.isNew) {
            // Throttle effects for other players if they repeatedly cancel and
            // start new actions
            var playEffect = true;
            if (!isActivePlayer && this.action.type != Action.None) {
                this.action.throttleTicker = 0.5;
                if (this.action.throttleCount < 5) {
                    this.action.throttleCount++;
                } else {
                    playEffect = false;
                }
            }
            if (playEffect) {
                this.playActionStartEffect(isActivePlayer, particleBarn, audioManager);
            }
        }
        this.action.seqOld = this.action.seq;
        this.updateActionEffect(isActivePlayer, playerInfo, particleBarn, audioManager);

        this.action.throttleTicker -= dt;
        if (this.action.throttleTicker < 0.0 && this.action.throttleCount > 0) {
            this.action.throttleCount--;
            this.action.throttleTicker = 0.25;
        }

        // Haste effect
        if (this.m_netData.m_hasteType && this.m_netData.m_hasteSeq != this.hasteSeq) {
            var _hasteEffects;

            var hasteEffects = (_hasteEffects = {}, (0, _defineProperty3.default)(_hasteEffects, HasteType.None, { particle: '', sound: '' }), (0, _defineProperty3.default)(_hasteEffects, HasteType.Windwalk, { particle: 'windwalk', sound: 'ability_stim_01' }), (0, _defineProperty3.default)(_hasteEffects, HasteType.Takedown, { particle: 'takedown', sound: 'ability_stim_01' }), (0, _defineProperty3.default)(_hasteEffects, HasteType.Inspire, { particle: 'inspire', sound: 'ability_stim_01' }), _hasteEffects);

            var fx = hasteEffects[this.m_netData.m_hasteType];

            if (!this.isNew) {
                audioManager.playSound(fx.sound, {
                    channel: 'sfx',
                    soundPos: this.pos,
                    fallOff: 1.0,
                    layer: this.layer,
                    filter: 'muffled'
                });
            }

            if (this.hasteEmitter) {
                this.hasteEmitter.stop();
            }
            this.hasteEmitter = particleBarn.addEmitter(fx.particle, {
                pos: this.pos,
                layer: this.layer
            });
            this.hasteSeq = this.m_netData.m_hasteSeq;
        } else if (!this.m_netData.m_hasteType && this.hasteEmitter) {
            this.hasteEmitter.stop();
            this.hasteEmitter = null;
        }
        if (this.hasteEmitter) {
            this.hasteEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.hasteEmitter.layer = this.renderLayer;
            this.hasteEmitter.zOrd = this.renderZOrd + 1;
        }

        // Freeze emiter effect
        if (this.m_netData.m_freezeActive && !this.passiveFreezeEmitter) {
            this.passiveFreezeEmitter = particleBarn.addEmitter('freeze', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_freezeActive && this.passiveFreezeEmitter) {
            this.passiveFreezeEmitter.stop();
            this.passiveFreezeEmitter = null;
        }
        if (this.passiveFreezeEmitter) {
            this.passiveFreezeEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.passiveFreezeEmitter.layer = this.renderLayer;
            this.passiveFreezeEmitter.zOrd = this.renderZOrd + 1;
        }

        // Passive heal effect
        if (this.m_netData.m_passiveHeal && !this.passiveHealEmitter) {
            this.passiveHealEmitter = particleBarn.addEmitter('heal_basic', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_passiveHeal && this.passiveHealEmitter) {
            this.passiveHealEmitter.stop();
            this.passiveHealEmitter = null;
        }
        if (this.passiveHealEmitter) {
            this.passiveHealEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.passiveHealEmitter.layer = this.renderLayer;
            this.passiveHealEmitter.zOrd = this.renderZOrd + 1;
        }

        // Frenemy effect
        if (this.m_netData.m_frenemy && !this.frenemyEmitter && !this.m_netData.m_dead) {
            this.frenemyEmitter = particleBarn.addEmitter('frenemy', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_frenemy && this.frenemyEmitter) {
            this.frenemyEmitter.stop();
            this.frenemyEmitter = null;
        }
        if (this.frenemyEmitter) {
            this.frenemyEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.frenemyEmitter.layer = this.renderLayer;
            this.frenemyEmitter.zOrd = this.renderZOrd + 1;
        }

        // Chocolate Box effect
        if (this.m_netData.m_chocolateBoxEffect && !this.chocolateBoxEmiter) {
            this.chocolateBoxEmiter = particleBarn.addEmitter('chocolateBox', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_chocolateBoxEffect && this.chocolateBwdoxEmiter) {
            this.chocolateBoxEmiter.stop();
            this.chocolateBoxEmiter = null;
        }
        if (this.chocolateBoxEmiter) {
            this.chocolateBoxEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.chocolateBoxEmiter.layer = this.renderLayer;
            this.chocolateBoxEmiter.zOrd = this.renderZOrd + 1;
        }

        // saved by teleport SFX effect
        if (this.playTeleportSound) {
            this.playTeleportTicker += dt;
            if (this.playTeleportTicker >= 0.5) {
                audioManager.playSound('teleport_sound', {
                    channel: 'sfx',
                    soundPos: this.pos,
                    layer: this.layer,
                    filter: 'muffled'
                });
                this.playTeleportTicker = 0.0;
                this.playTeleportSound = false;
            }
        }

        if (this.teleportCameraTicker > 0.0) {
            this.teleportCameraTicker -= dt;
        }

        if (this.cameraMovementTicker > 0.0) {
            this.cameraMovementTicker -= dt;
        }

        //Saved by teleport VFX
        if (this.m_netData.m_savedByLuckEffect && !this.savedByLuckEmiter) {
            if (this.hasPerk('leprechaun')) {
                this.playTeleportSound = true;
                this.savedByLuckEmiter = particleBarn.addEmitter('teleport', {
                    pos: this.pos,
                    layer: this.layer
                });
                this.teleportCameraTicker = 2.0;
            } else {
                audioManager.playSound('lucky_sound', {
                    channel: 'sfx',
                    soundPos: this.pos,
                    layer: this.layer,
                    filter: 'muffled'
                });
                this.savedByLuckEmiter = particleBarn.addEmitter('clover', {
                    pos: this.pos,
                    layer: this.layer
                });
            }
        } else if (!this.m_netData.m_savedByLuckEffect && this.savedByLuckEmiter) {
            this.savedByLuckEmiter.stop();
            this.savedByLuckEmiter = null;
        }
        if (this.savedByLuckEmiter) {
            this.savedByLuckEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.savedByLuckEmiter.layer = this.renderLayer;
            this.savedByLuckEmiter.zOrd = this.renderZOrd + 1;
        }

        // lucky effect TEST
        if (this.m_netData.m_luckyEffect && !this.bottleEmiter) {
            this.bottleEmiter = particleBarn.addEmitter('lucky', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_luckyEffect && this.bottleEmiter) {
            this.bottleEmiter.stop();
            this.bottleEmiter = null;
        }
        if (this.bottleEmiter) {
            this.bottleEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.bottleEmiter.layer = this.renderLayer;
            this.bottleEmiter.zOrd = this.renderZOrd + 1;
        }

        //Gunchilada effect
        if (this.m_netData.m_gunchiladaEffect && !this.gunchiladaTimeEmiter) {
            this.gunchiladaTimeEmiter = particleBarn.addEmitter('gunchiladaParticles', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_gunchiladaEffect && this.gunchiladaTimeEmiter) {
            this.gunchiladaTimeEmiter.stop();
            this.gunchiladaTimeEmiter = null;
        }
        if (this.gunchiladaTimeEmiter) {
            this.gunchiladaTimeEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.gunchiladaTimeEmiter.layer = this.renderLayer;
            this.gunchiladaTimeEmiter.zOrd = this.renderZOrd + 1;
        }

        //Watermelon effect
        if (this.m_netData.m_watermelonEffect && !this.watermelonTimeEmiter) {
            this.watermelonTimeEmiter = particleBarn.addEmitter('watermelonParticles', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_watermelonEffect && this.watermelonTimeEmiter) {
            this.watermelonTimeEmiter.stop();
            this.watermelonTimeEmiter = null;
        }
        if (this.watermelonTimeEmiter) {
            this.watermelonTimeEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.watermelonTimeEmiter.layer = this.renderLayer;
            this.watermelonTimeEmiter.zOrd = this.renderZOrd + 1;
        }

        if (this.m_netData.m_wetEffect && !this.wetEmiter) {
            this.wetEmiter = particleBarn.addEmitter('wet', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_wetEffect && this.wetEmiter) {
            this.wetEmiter.stop();
            this.wetEmiter = null;
        }
        if (this.wetEmiter) {
            this.wetEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.wetEmiter.layer = this.renderLayer;
            this.wetEmiter.zOrd = this.renderZOrd + 1;
        }

        // Check the effects received from the server
        var length = this.m_netData.effects.length;
        var activeEffects = [];
        for (var _i11 = 0; _i11 < length; _i11++) {
            var effect = this.m_netData.effects[_i11];
            activeEffects.push(effect);
            StatusEffect.checkEffect(effect, this, true, true, particleBarn, audioManager);
        }
        // Look for effects that didn't came from the server to stop them
        length = this.effects.length;
        for (var _i12 = 0; _i12 < length; _i12++) {
            var playerEffect = this.effects[_i12];
            if (playerEffect && activeEffects.indexOf(playerEffect.id) == -1) {
                StatusEffect.checkEffect(playerEffect.id, this, false, true, particleBarn, audioManager);
            }
        }

        //Transparent
        if (this.m_netData.m_infectedEffect && this.m_netData.m_playerTransparent) {
            this.bodyContainer.alpha = 0.2;
        } else {
            this.bodyContainer.alpha = 1;
        }

        //passive poppy heal effect
        if (this.m_netData.m_healByItemEffect && !this.poppyHealEmitter) {
            this.poppyHealEmitter = particleBarn.addEmitter('heal_basic', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_healByItemEffect && this.poppyHealEmitter) {
            this.poppyHealEmitter.stop();
            this.poppyHealEmitter = null;
        }
        if (this.poppyHealEmitter) {
            this.poppyHealEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.poppyHealEmitter.layer = this.renderLayer;
            this.poppyHealEmitter.zOrd = this.renderZOrd + 1;
        }

        //passive hail damage effect
        if (this.m_netData.m_hailDamageEffect && !this.hailEmitter) {
            this.specialSoundsInstance = audioManager.playSound('hail_damage_01', {
                channel: isActivePlayer ? 'activePlayer' : 'otherPlayers',
                soundPos: this.pos,
                layer: this.layer,
                filter: 'muffled'
            });
            this.hailEmitter = particleBarn.addEmitter('hail', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_hailDamageEffect && this.hailEmitter) {
            this.hailEmitter.stop();
            this.hailEmitter = null;
            audioManager.stopSound(this.specialSoundsInstance);
            this.specialSoundsInstance = null;
        }
        if (this.hailEmitter) {
            this.hailEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.hailEmitter.layer = this.renderLayer;
            this.hailEmitter.zOrd = this.renderZOrd + 1;
        }

        //Sugar Rush effect
        if (this.m_netData.m_sugarRush && !this.sugarRushEmiter) {
            this.sugarRushEmiter = particleBarn.addEmitter('sugarRush', {
                pos: this.pos,
                layer: this.layer
            });
        } else if (!this.m_netData.m_sugarRush && this.sugarRushEmiter) {
            this.sugarRushEmiter.stop();
            this.sugarRushEmiter = null;
        }
        if (this.sugarRushEmiter) {
            this.sugarRushEmiter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.sugarRushEmiter.layer = this.renderLayer;
            this.sugarRushEmiter.zOrd = this.renderZOrd + 1;
        }

        //Sugar Rush SFX
        if (this.m_netData.m_playSoundSugarRush) {
            if (this.playSoundSugarRush) {
                this.playSoundSugarRush = false;
                audioManager.playSound('sugar_rush_01', {
                    channel: 'sfx',
                    soundPos: this.pos,
                    layer: this.layer,
                    filter: 'muffled'
                });
            }
        } else {
            this.playSoundSugarRush = true;
        }

        if (isActivePlayer && !isSpectating) {
            var curWeapIdx = this.m_localData.m_curWeapIdx;
            var curWeap = this.m_localData.m_weapons[curWeapIdx];
            var _itemDef = GameObjectDefs[curWeap.type];

            // Play dry fire sound when empty
            // @TODO: Should this sound be played for other players?
            if (!this.playedDryFire && this.m_equippedWeaponType() == 'gun' && (inputBinds.isBindPressed(GameInput.LightAttack) || inputBinds.isBindDown(GameInput.LightAttack) && _itemDef.fireMode == 'auto') && this.action.type == Action.None && !preventInput && !_itemDef.ammoInfinite) {
                var ammoLeft = this.m_localData.m_inventory[_itemDef.ammo] || 0;
                var currentClip = 20; //curWeap.ammo;
                if (ammoLeft == 0 && currentClip == 0) {
                    audioManager.playSound(_itemDef.sound.empty);
                    this.playedDryFire = true;
                }
            }
            if (!inputBinds.isBindDown(GameInput.LightAttack)) {
                this.playedDryFire = false;
            }
            /*
                        if (!this.playerOffHandAttack &&
                            this.m_equippedWeaponType() == 'gun' &&
                            (inputBinds.isBindPressed(GameInput.OffHandAttack) ||
                                (inputBinds.isBindDown(GameInput.OffHandAttack) && itemDef.fireMode == 'auto')) &&
                            this.action.type == Action.None &&
                            !preventInput &&
                            !itemDef.ammoInfinite) {
                            let ammoLeft = this.m_localData.m_inventory[itemDef.ammo] || 0;
                            let currentClip = 20; //curWeap.ammo;
                            if (ammoLeft == 0 && currentClip == 0) {
                                audioManager.playSound(itemDef.sound.empty);
                                this.playedDryFire = true;
                            }
                        }*/

            if (!inputBinds.isBindDown(GameInput.OffHandAttack)) {
                this.playerOffHandAttack = false;
            }

            //Show quest progress notification
            if (GameConfig.features.inGameNotificationActive && this.progressNotificationActive) {
                if (this.questsInfoChanged && !this.m_netData.m_dead) {
                    this.questsInfoChanged = false;
                    if (!this.inGameNotification) {
                        this.inGameNotification = new InGameNotification(pass, localization);
                    }
                    this.questsInfoChanged = this.inGameNotification.updateInGame(dt, this.localQuestInfo);
                    this.questsCompleted = this.inGameNotification.getQuestsCompleted();
                }
            }
        }

        // Decay gun recoil
        this.gunRecoilL = math.max(0.0, this.gunRecoilL - this.gunRecoilL * dt * 5.0 - dt);
        this.gunRecoilR = math.max(0.0, this.gunRecoilR - this.gunRecoilR * dt * 5.0 - dt);

        if (0 == Anim.None) {
            //TODO check with animation controller if there active animation
            this.throwableState = 'equip';
        }

        // Compute blended bone positions //TODO delete
        /*let idlePose = this.selectIdlePose();
        let idlePoseData = animData.IdlePoses[idlePose];
        for (let i = 0; i < this.bones.length; i++) {
            let boneIdx = i;
             let idleBonePose = idlePoseData[boneIdx] || Pose.identity;
            let animBone = this.anim.bones[boneIdx];
            if (animBone.weight > 0.0) {
                this.bones[i].copy(
                    Pose.lerp(animBone.weight, idleBonePose, animBone.pose)
                );
            } else {
                this.bones[i].copy(idleBonePose);
            }
        }*/

        //Update if damaged to show health bar and flash
        //Need to be before updateVisuals()
        if (this.timeToHideHpBar > 0) this.timeToHideHpBar -= dt;
        var differenceHealth = Math.abs(this.healthNormalizedOld - this.m_netData.m_healthNormalized);
        if (differenceHealth >= 0.01) {
            if (!isActivePlayer) this.timeToHideHpBar = kHideHealthBarTime;

            if (this.m_netData.m_healthNormalized < this.healthNormalizedOld && (this.wasDowned == this.downed || !this.wasDowned)) {
                audioManager.playSound('sfx_player_hit', {
                    channel: 'activePlayer',
                    soundPos: this.pos,
                    layer: this.layer,
                    muffled: true });

                this.flashHurtTime = kFlashHurtDuration1;
                this.currentHurtColor = 1;
            }

            this.healthNormalizedOld = this.m_netData.m_healthNormalized;
        }

        if (!this.SpineObjManager) this.SpineObjManager = playerBarn.SpineObjManager;

        // Update sprite components
        if (this.throwableStatePrev != this.throwableState) {
            this.visualsDirty = true;
        }
        this.throwableStatePrev = this.throwableState;

        if (this.visualsDirty) {
            this.m_updateVisuals(playerBarn, map);
        }
        this.visualsDirty = false;

        this.m_updateAura(dt, isActivePlayer, activePlayer);

        // @NOTE: There's an off-by-one frame issue for effects spawned earlier
        // in this frame that reference renderLayer / zOrd / zIdx. This issue is
        // prevalent for other effects that reference the player outside of
        // update, like shot shell particle creation.
        this.m_updateRenderLayer(isActivePlayer, activePlayer, map);

        //Update player animations
        this.AnimationController.update(dt, animateDash);

        //Do player invisible, will hide the hp bar and particles effects for other players
        if (this.invisible) {
            var _playerInfo = playerBarn.m_getPlayerInfo(this.__id);
            var activePlayerInfo = playerBarn.m_getPlayerInfo(activePlayer.__id);
            if (_playerInfo.teamId === activePlayerInfo.teamId) this.container.alpha = 0.3;else {
                this.HpBarGFX.alpha = 0;
                this.container.alpha = 0;
                StatusEffect.hideEffectsParticles(this);
            }
        } else if (this.container.alpha < 1 && !this.invisible) {
            this.HpBarGFX.alpha = 1;
            this.container.alpha = 1;
            StatusEffect.showEffectsParticles(this);
        }

        if (curWeapDef && this.m_netData.m_loadingBlaster > 0.0 && curWeapDef.fireMode == 'blaster' && !audioManager.isSoundPlaying(this.soundLoadingInstance) && !this.m_netData.m_gunLoaded) {
            this.soundLoadingInstance = audioManager.playSound(curWeapDef.sound.reload, {
                channel: isActivePlayer ? 'activePlayer' : 'otherPlayers',
                soundPos: this.pos,
                layer: this.layer,
                delay: 30,
                volumeScale: 0.75
            });
        } else if (curWeapDef && this.m_netData.m_loadingBlaster == 0.0 && curWeapDef.fireMode == 'blaster' && audioManager.isSoundPlaying(this.soundLoadingInstance) && !this.m_netData.m_gunLoaded) {
            audioManager.stopSound(this.soundLoadingInstance);
        }

        if (curWeapDef && curWeapDef.fireMode == "blaster") {
            this.gunRSprites.gunMag.height = this.m_netData.m_loadingBlaster * curWeapDef.worldImg.magImg.max_height_adj;
            this.gunRSprites.gunMag.y = this.gunRSprites.gunMag.height / 2 + curWeapDef.worldImg.magImg.pos.y;
            var scaleShoot = this.m_netData.m_loadingBlaster * this.gunRSprites.maxScaleShoot;
            var bodyScale = this.bodyRad / GameConfig.player.radius;
            this.gunRSprites.gunBall.alpha = Math.random();
            if (this.m_netData.m_gunLoaded) {
                this.gunRSprites.setType(this.m_netData.m_curWeapType, this.bodyRad / GameConfig.player.radius, playerInfo, this.m_netData.m_gunLoaded);
                this.gunRSprites.setVisible(true);
                this.loadedSprite = true;
            }

            this.gunRSprites.gunBall.scale.set(scaleShoot / bodyScale, scaleShoot / bodyScale);
        }

        if (this.level > this.oldLevel) {
            this.playSpineFX('level_up');

            if (isActivePlayer) {
                audioManager.playSound('sfx_player_level_up', {
                    channel: 'activePlayer',
                    soundPos: this.pos,
                    layer: this.layer,
                    muffled: true });
            }
        }

        renderer.addPIXIObj(this.auraContainer, this.renderLayer, this.renderZOrd - 1, this.renderZIdx);
        // Special visibility rules for the aura since it doesn't clip well with
        // the bunker mask system
        var auraLayerMatch = activePlayer.layer & 0x2 || (activePlayer.layer & 0x1) == 1 || (this.layer & 0x1) == 0;
        this.auraContainer.visible = !this.m_netData.m_dead && auraLayerMatch;
        this.blindContainer.visible = !this.m_netData.m_dead;

        renderer.addPIXIObj(this.container, this.renderLayer, this.renderZOrd - 1, this.renderZIdx);

        renderer.addPIXIObj(this.blindContainer, this.renderLayer, this.renderZOrd, this.renderZIdx);

        renderer.addPIXIObj(this.spriteContainer, this.renderLayer, this.renderZOrd, this.renderZIdx);

        //Health bar
        if (this.HpBarGFX) {
            renderer.addPIXIObj(this.HpBarGFX, this.renderLayer, this.renderZOrd, this.renderZIdx);
        }

        this.isNew = false;
    },

    m_render: function m_render(camera, debug) {
        var screenPos = camera.pointToScreen(this.pos);
        var screenScale = camera.pixels(1.0);
        this.container.position.set(screenPos.x, screenPos.y);
        this.container.scale.set(screenScale, screenScale);
        this.container.visible = !this.m_netData.m_dead;

        this.auraContainer.position.set(screenPos.x, screenPos.y);
        this.auraContainer.scale.set(screenScale, screenScale);

        this.auraContainer.visible = true;

        this.blindContainer.position.set(screenPos.x, screenPos.y);
        this.blindContainer.scale.set(screenScale, screenScale);

        this.blindContainer.visible = true;

        if (this.WeaponManager.currentAttack && this.WeaponManager.currentAttack.render) {
            this.WeaponManager.currentAttack.render(camera, debug, DebugLines);
        }

        for (var _i13 = 0, length = this.effects.length; _i13 < length; _i13++) {
            var playerEffect = this.effects[_i13];
            if (playerEffect && playerEffect.render) {
                playerEffect.render(camera);
            }
        }

        this.gearPerksController.render(camera, debug, DebugLines);

        // --- Render health bar ---
        if (this.HpBarGFX) {
            this.HpBarGFX.clear();
            this.HpBarGFX.visible = !this.m_netData.m_dead;
        }
        if (this.HpBarGFX && this.timeToHideHpBar > 0 && !this.m_netData.dead) {
            var healthBarPos = v2.add(this.pos, this.healthBarOffset);
            healthBarPos = camera.pointToScreen(healthBarPos);
            var healthBarSize = collider.createAabbExtents(healthBarPos, kHealthBarSize);
            //Background healthbar
            this.HpBarGFX.lineStyle(1, kHealthBarBackgroundColor, 1.0);
            this.HpBarGFX.beginFill(kHealthBarBackgroundColor, 1);
            this.HpBarGFX.drawRect(healthBarSize.min.x, healthBarSize.min.y, healthBarSize.max.x - healthBarSize.min.x, healthBarSize.max.y - healthBarSize.min.y);
            //Max health (border)
            this.HpBarGFX.lineStyle(1, kHealthBarColor, 1.0);
            this.HpBarGFX.beginFill(kHealthBarColor, 0);
            this.HpBarGFX.drawRect(healthBarSize.min.x, healthBarSize.min.y, healthBarSize.max.x - healthBarSize.min.x, healthBarSize.max.y - healthBarSize.min.y);
            //Current health (filled)
            var newX = kHealthBarSize.x * this.m_netData.m_healthNormalized;
            var offsetX = kHealthBarSize.x - newX;
            v2.set(healthBarPos, v2.create(healthBarPos.x - offsetX, healthBarPos.y));
            var currentSize = v2.create(newX, kHealthBarSize.y);
            var currentHealthBar = collider.createAabbExtents(healthBarPos, currentSize);
            this.HpBarGFX.beginFill(kHealthBarColor, 1);
            this.HpBarGFX.drawRect(currentHealthBar.min.x, currentHealthBar.min.y, currentHealthBar.max.x - currentHealthBar.min.x, currentHealthBar.max.y - currentHealthBar.min.y);
            this.HpBarGFX.endFill();
        }
    },

    m_updateRenderLayer: function m_updateRenderLayer(isActivePlayer, activePlayer, map) {
        // Give the player a larger stairs collision radius.
        // This is a hack to reduce popping when emerging from below,
        // and to fix sorting issues with decals and loot when near
        // the bottom and top of stairs
        var visualCol = collider.createCircle(this.pos, GameConfig.player.maxVisualRadius);
        var onMask = false;
        var onStairs = false;
        var occluded = false;
        var structures = map.m_structurePool.m_getPool();
        for (var j = 0; j < structures.length; j++) {
            var structure = structures[j];
            if (!structure.active) {
                continue;
            }
            for (var k = 0; k < structure.stairs.length; k++) {
                var stairs = structure.stairs[k];
                var col = collider.intersect(stairs.collision, visualCol);
                if (col) {
                    onStairs = true;

                    var stairTop = v2.add(stairs.center, v2.mul(stairs.downDir, -2.5));
                    var dir = v2.sub(stairTop, this.pos);
                    var dist = v2.length(dir);
                    dir = dist > 0.0001 ? v2.div(dir, dist) : v2.create(1.0, 0.0);
                    var occ = collisionHelpers.intersectSegmentDist(map.m_obstaclePool.m_getPool(), this.pos, dir, dist, 0.5, this.layer, false);
                    occluded = occ < dist;
                }
                // Disable ceiling reveals if we're near certain types
                // of stairs. This lets the player enter cellars from an
                // exterior entrance without peeking inside the building
                // when passing through the exterior walls via the stairs.
                if (isActivePlayer && stairs.noCeilingReveal && col && this.layer != 0) {
                    this.noCeilingRevealTicker = 0.25;
                }
            }
            for (var _k = 0; _k < structure.mask.length; _k++) {
                if (collider.intersect(structure.mask[_k], visualCol)) {
                    onMask = true;
                    break;
                }
            }
        }
        var renderLayer = this.layer;
        var renderZOrd = 18;
        if (onStairs && (renderLayer & 0x1 && (activePlayer.layer & 0x1 || !occluded) || activePlayer.layer & 0x2 && !onMask)) {
            renderLayer |= 0x2;
        }
        if (onStairs && (renderLayer & 0x1) == (activePlayer.layer & 0x1) && (!onMask || activePlayer.layer == 0)) {
            renderLayer |= 0x2;
            renderZOrd += 100;
        }
        var renderZIdx = this.__id + (!this.m_netData.m_downed ? 4 * 65536 : 0) + (isActivePlayer ? 65536 : 0);

        this.renderLayer = renderLayer;
        this.renderZOrd = renderZOrd;
        this.renderZIdx = renderZIdx;
    },

    m_updateVisuals: function m_updateVisuals(playerBarn, map) {

        var outfitDef = GameObjectDefs[this.m_netData.m_outfit];
        var outfitImg = outfitDef.skinImg;
        var bodyScale = this.bodyRad / GameConfig.player.radius;

        // @TODO update sprite logic with spine
        this.bodySprite.texture = PIXI.Texture.fromImage(outfitImg.baseSprite);
        this.bodySprite.tint = outfitDef.ghillie ? map.getMapDef().biome.colors.playerGhillie : outfitImg.baseTint;
        this.bodySprite.scale.set(0.25, 0.25);
        this.bodySprite.visible = false;

        var skinDef = this.m_netData.m_avatarSkin ? GameObjectDefs[this.m_netData.m_avatarSkin] : {};
        var hairDef = this.m_netData.m_hairSkin ? GameObjectDefs[this.m_netData.m_hairSkin] : {};
        var armorDef = this.m_netData.m_armorType ? GameObjectDefs[this.m_netData.m_armorType] : {};
        var helmetDef = this.m_netData.m_helmetType ? GameObjectDefs[this.m_netData.m_helmetType] : {};
        var skins = (0, _assign2.default)({}, skinDef.skins, hairDef.skins, armorDef.skins, helmetDef.skins);
        this.changeSkin(skins);

        // Frozen
        if (this.m_netData.m_frozen && this.updateFrozenImage) {
            var kFrozenSprites = map.getMapDef().biome.frozenSprites || [];
            if (kFrozenSprites.length > 0) {
                var sprite = kFrozenSprites[Math.floor(Math.random() * kFrozenSprites.length)];
                var rot = math.oriToRad(this.m_netData.m_frozenOri) + Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.25;
                this.bodyEffectSprite.texture = PIXI.Texture.fromImage(sprite);
                this.bodyEffectSprite.rotation = rot;
                this.bodyEffectSprite.tint = 0xffffff;
                this.bodyEffectSprite.scale.set(0.25, 0.25);
            }
            this.updateFrozenImage = false;
        }
        var playerInfo = playerBarn.m_getPlayerInfo(this.__id);

        // Contact patch
        if (map.contactMode && this.m_netData.m_infectedEffect) {
            this.slimeSprite.texture = PIXI.Texture.fromImage('slime.img');
            this.slimeSprite.visible = true;
            this.slimeSprite.scale.set(0.5, 0.5);
            this.slimeSprite.tint = 0x9bff99;
        } else {
            this.slimeSprite.visible = false;
        }

        // cannon aim 
        if (map.contactMode && this.m_netData.m_isTarget) {
            this.aimSprite.texture = PIXI.Texture.fromImage('map-target.img');
            this.aimSprite.visible = true;
            this.aimSprite.scale.set(0.5, 0.5);
            this.aimSprite.tint = 0xffffff;
        } else {
            this.aimSprite.visible = false;
        }

        if (map.factionMode && !outfitDef.ghillie) {
            var teamId = playerInfo.teamId;
            var kTeamSprites = ['player-patch-01.img', 'player-patch-02.img'];
            var teamIdx = (teamId - 1) % kTeamSprites.length;
            var _sprite = kTeamSprites[teamIdx];
            var tint = GameConfig.teamColors[teamIdx];
            var ori = 3;
            var _rot = math.oriToRad(ori) + Math.PI * 0.5;
            this.patchSprite.texture = PIXI.Texture.fromImage(_sprite);
            this.patchSprite.rotation = _rot;
            this.patchSprite.tint = tint;
            this.patchSprite.scale.set(0.25, 0.25);
            this.patchSprite.visible = true;
        } else {
            this.patchSprite.visible = false;
        }

        // Hands
        var setHandSprite = function setHandSprite(sprite, img, tint, flip) {
            sprite.texture = PIXI.Texture.fromImage(img);
            if (tint === false) {
                sprite.rotation = Math.PI * 0.5;
                sprite.tint = 0xffffff;
                var spriteScale = GameObjectDefs[playerInfo.loadout.melee].scale;
                if (spriteScale) {
                    sprite.scale.set(spriteScale.x, spriteScale.y);
                } else {
                    sprite.scale.set(0.175, 0.175);
                }
            } else {
                sprite.rotation = Math.PI * 0.5;
                sprite.tint = tint;
                sprite.scale.set(0.175, 0.175);
            }
            if (flip) {
                sprite.scale.x = sprite.scale.x * -1;
            }
            sprite.visible = false;
        };
        var handTint = outfitDef.ghillie ? map.getMapDef().biome.colors.playerGhillie : outfitImg.handTint;
        var handSprites = GameObjectDefs[playerInfo.loadout.melee].handSprites;
        var flip = GameObjectDefs[playerInfo.loadout.melee].flip;
        if (handSprites) {
            setHandSprite(this.handLSprite, handSprites.spriteL, false);
            setHandSprite(this.handRSprite, handSprites.spriteR, false, flip);
        } else {
            setHandSprite(this.handLSprite, outfitImg.handSprite, handTint);
            setHandSprite(this.handRSprite, outfitImg.handSprite, handTint);
        }

        if (outfitDef.accessory) {
            this.accessorySprite.texture = PIXI.Texture.fromImage(outfitDef.accessory.sprite);
            this.accessorySprite.tint = 0xffffff;
            this.accessorySprite.scale.set(0.27, 0.27);
            this.accessorySprite.anchor.set(0.7, 0.5);
            if (outfitDef.accessory.anchor) {
                this.accessorySprite.anchor.set(outfitDef.accessory.anchor.x, outfitDef.accessory.anchor.y);
            }
            if (outfitDef.accessory.scale) {
                this.accessorySprite.scale.set(outfitDef.accessory.scale, outfitDef.accessory.scale);
            }
            this.accessorySprite.visible = true;
        } else {
            this.accessorySprite.visible = false;
        }

        // Feet
        var setFootSprite = function setFootSprite(sprite, tint, downed) {
            sprite.texture = PIXI.Texture.fromImage('player-feet-01.img');
            sprite.scale.set(0.45, 0.45);
            sprite.rotation = Math.PI * 0.5;
            sprite.tint = tint;
            sprite.visible = downed;
        };
        var footTint = outfitDef.ghillie ? map.getMapDef().biome.colors.playerGhillie : outfitImg.footTint;
        setFootSprite(this.footLSprite, footTint, this.downed);
        setFootSprite(this.footRSprite, footTint, this.downed);

        // Flak Jacket
        if (this.hasPerk('flak_jacket') && !outfitDef.ghillie) {
            this.flakSprite.texture = PIXI.Texture.fromImage('player-armor-base-01.img');
            this.flakSprite.scale.set(0.215, 0.215);
            this.flakSprite.tint = 0x380606;
            this.flakSprite.alpha = 0.7;
            this.flakSprite.visible = true;
        } else {
            this.flakSprite.visible = false;
        }

        // Chest
        if (this.m_netData.m_chest != '' && !outfitDef.ghillie) {
            var chestDef = GameObjectDefs[this.m_netData.m_chest];
            var chestSkin = chestDef.skinImg;
            this.chestSprite.texture = PIXI.Texture.fromImage(chestSkin.baseSprite);
            this.chestSprite.scale.set(0.25, 0.25);
            this.chestSprite.tint = chestSkin.baseTint;
            this.chestSprite.visible = true;
        } else {
            this.chestSprite.visible = false;
        }

        // Neck
        /*if (this.m_netData.m_neck != '' && !outfitDef.ghillie) {
            const neckDef = GameObjectDefs[this.m_netData.m_neck];
            const neckSkin = neckDef.skinImg;
            this.neckSprite.texture = PIXI.Texture.fromImage(neckSkin.baseSprite);
            this.neckSprite.scale.set(0.25, 0.25);
            this.neckSprite.tint = neckSkin.baseTint;
            this.neckSprite.visible = true;
        } else {
            this.neckSprite.visible = false;
        }*/

        // Steelskin
        if (this.hasPerk('steelskin') && !outfitDef.ghillie) {
            this.steelskinSprite.texture = PIXI.Texture.fromImage('loot-melee-pan-black.img');
            this.steelskinSprite.scale.set(0.4, 0.4);
            this.steelskinSprite.anchor.set(0.575, 0.5);
            this.steelskinSprite.tint = 0xFFFFFF;
            this.steelskinSprite.visible = true;
        } else {
            this.steelskinSprite.visible = false;
        }

        if (this.hasPerk('phoenix')) {
            this.phoenixSprite.texture = PIXI.Texture.fromImage('loot-phoenix-perk.img');
            this.phoenixSprite.scale.set(0.3, 0.3);
            this.phoenixSprite.anchor.set(0.575, 0.5);
            this.phoenixSprite.position.set(-4.0, 0.0);
            this.phoenixSprite.tint = 0xFFFFFF;
            this.phoenixSprite.visible = true;
        } else {
            this.phoenixSprite.visible = false;
        }

        /* new pyro img
        if (this.hasPerk('pyro')) {
            this.pyroSprite.texture = PIXI.Texture.fromImage('loot-pyro-perk.img');
            this.pyroSprite.scale.set(0.25, 0.25);
            this.pyroSprite.anchor.set(0.5, 0.5);
            this.pyroSprite.position.set(-4.0, -1.0);
            this.pyroSprite.tint = 0xFFFFFF;
            this.pyroSprite.visible = true;
        } else {
            this.pyroSprite.visible = false;
        }*/

        if (this.hasPerk('pyro')) {
            this.pyroSprite.texture = PIXI.Texture.fromImage('loot-pyro-perk.img');
            this.pyroSprite.scale.set(0.3, 0.3);
            this.pyroSprite.anchor.set(0.575, 0.5);
            this.pyroSprite.position.set(-5.0, 0.0);
            this.pyroSprite.tint = 0xFFFFFF;
            this.pyroSprite.visible = true;
        } else {
            this.pyroSprite.visible = false;
        }

        // Helmet
        if (this.m_netData.m_helmet != '' && !outfitDef.ghillie) {
            var _helmetDef = GameObjectDefs[this.m_netData.m_helmet];
            var helmetSkin = _helmetDef.skinImg;
            var helmetOffset = 3.33 * (this.downed ? 1.0 : -1.0);
            this.helmetSprite.texture = PIXI.Texture.fromImage(helmetSkin.baseSprite);
            this.helmetSprite.position.set(helmetOffset, 0.0);

            if (helmetSkin.spriteScale) {
                this.helmetSprite.scale.set(helmetSkin.spriteScale, helmetSkin.spriteScale);
            } else {
                this.helmetSprite.scale.set(0.15, 0.15);
            }

            var helmetTint = helmetSkin.baseTint;
            if (map.factionMode) {
                var _teamId = playerInfo.teamId;
                helmetTint = _teamId == 1 ? helmetSkin.baseTintRed : helmetSkin.baseTintBlue;
            }
            this.helmetSprite.tint = helmetTint;
            this.helmetSprite.visible = true;
        } else {
            this.helmetSprite.visible = false;
        }

        // Backpack
        var setPackSprite = function setPackSprite(sprite, img, tint) {
            sprite.texture = PIXI.Texture.fromImage(img);
            sprite.tint = tint;
        };
        var bagLevel = this.m_getBagLevel();
        if (bagLevel > 0 && !outfitDef.ghillie && !this.downed) {
            var backpackDef = GameObjectDefs[this.m_netData.m_backpack];
            var kBagOffsets = [10.25, 11.5, 12.75];
            var _bagLevel = this.m_getBagLevel();
            var bagOffset = kBagOffsets[math.min(_bagLevel - 1, kBagOffsets.length - 1)];
            var scale = (0.4 + _bagLevel * 0.03) * 0.5;

            this.backpackSprite.texture = PIXI.Texture.fromImage('player-circle-base-01.img');
            this.backpackSprite.position.set(-bagOffset, 0.0);
            this.backpackSprite.scale.set(scale, scale);
            this.backpackSprite.tint = outfitImg.backpackTint;
            this.backpackSprite.visible = false;
            setPackSprite(this.backpackSprite, outfitImg.backpackSprite, outfitImg.backpackTint);
        } else {
            this.backpackSprite.visible = false;
        }

        // Hip
        if (this.m_netData.m_wearingPan) {
            var imgDef = GameObjectDefs['pan'].hipImg;
            this.hipSprite.texture = PIXI.Texture.fromImage(imgDef.sprite);
            this.hipSprite.position.set(imgDef.pos.x, imgDef.pos.y);
            this.hipSprite.scale.set(imgDef.scale.x, imgDef.scale.y);
            this.hipSprite.rotation = imgDef.rot;
            this.hipSprite.tint = imgDef.tint;
            this.hipSprite.visible = true;
        } else {
            this.hipSprite.visible = false;
        }

        this.changeSkinSlot(GameConfig.SkinSlots.MainHand, this.WeaponManager.mainWeaponDef.spineAsset);

        if (this.downed != this.wasDowned) {
            this.wasDowned = this.downed;

            if (!this.downed) this.playSpineFX('squads/heal');
        }

        var offhandSkin = '';

        if (this.WeaponManager.hasThrowableSelected()) {
            var def = this.WeaponManager.getSelectedItemDef();
            var spineSkin = def.spine ? def.spine[this.throwableState] : null;
            offhandSkin = spineSkin && spineSkin.skin ? spineSkin.skin : '';
        } else if (this.WeaponManager.currentOffHand) {
            offhandSkin = this.WeaponManager.offHandDef.slot;
        } else if (this.WeaponManager.mainWeaponDef.offHandSpineAsset) offhandSkin = this.WeaponManager.mainWeaponDef.offHandSpineAsset;

        this.changeSkinSlot(GameConfig.SkinSlots.OffHand, offhandSkin);

        //Stop animation if was reviving
        if (this.lastActionType === Action.Revive && this.action.type != Action.Revive) {
            this.AnimationController.stopAnimation(0, EnumPlayerAnimType.Revive);
        }
        // Hide weapons when reviving or downed
        /*if (this.downed || this.currentAnim() == Anim.Revive) {//TODO check current anim with animationController
            this.gunLSprites.setVisible(false);
            this.gunRSprites.setVisible(false);
            this.meleeSprite.visible = false;
            this.objectLSprite.visible = false;
            this.objectRSprite.visible = false;
        }*/
        // Hide additional gear when downed
        if (this.downed) {
            this.backpackSprite.visible = false;
        }

        // Role specific visuals
        if ((this.action.type == Action.UseItem || this.action.type == Action.Revive) && !this.m_netData.m_dead && (!this.m_netData.m_downed || this.hasPerk('self_revive')) && this.hasPerk('aoe_heal')) {
            var actionItemDef = GameObjectDefs[this.action.item];
            // Assume if there's no item defined, it's a revive circle
            var _sprite2 = actionItemDef && actionItemDef.aura ? actionItemDef.aura.sprite : 'part-aura-circle-01.img';
            var _tint = actionItemDef && actionItemDef.aura ? actionItemDef.aura.tint : 0xff00ff;
            var auraScale = 0.125;
            var auraRad = actionItemDef ? GameConfig.player.medicHealRange : GameConfig.player.medicReviveRange;
            auraRad *= auraScale;
            this.auraCircle.texture = PIXI.Texture.fromImage(_sprite2);
            this.auraCircle.scale.set(auraRad, auraRad);
            this.auraCircle.tint = _tint;
            this.auraCircle.visible = true;
        } else {
            this.auraPulseTicker = 0.0;
            this.auraorbDir = 1.0;
            this.auraCircle.visible = false;
        }
        // Class visors
        if (map.perkMode && this.m_netData.m_role != '' && this.m_netData.m_helmet != '' && !outfitDef.ghillie) {
            var roleDef = GameObjectDefs[this.m_netData.m_role];
            var visorSkin = roleDef.visorImg;
            if (visorSkin) {
                var _helmetOffset = 3.33 * (this.downed ? 1.0 : -1.0);
                this.visorSprite.texture = PIXI.Texture.fromImage(visorSkin.baseSprite);
                this.visorSprite.position.set(_helmetOffset, 0.0);
            }

            if (visorSkin.spriteScale) {
                this.visorSprite.scale.set(visorSkin.spriteScale, visorSkin.spriteScale);
            } else {
                this.visorSprite.scale.set(0.15, 0.15);
            }

            this.visorSprite.visible = true;
        } else {
            this.visorSprite.visible = false;
        }
    },

    m_updateAura: function m_updateAura(dt, isActivePlayer, activePlayer) {
        // Fade in/out when entering/exiting the screen edge of the active player.
        // This fixes popping caused by the player being culled before the aura
        // is off screen.
        var inView = true;
        if (!isActivePlayer) {
            inView = coldet.testCircleAabb(this.pos, this.rad, activePlayer.viewAabb.min, activePlayer.viewAabb.max);
        }
        this.auraViewFade = math.lerp(dt * 6.0, this.auraViewFade, inView ? 1.0 : 0.0);

        // Pulse healing circle
        if (this.auraCircle.visible) {
            var pulseSpeed = 1.5;
            var pulseScaleDelta = 0.75;
            this.auraCircle.visible = false;

            this.auraPulseTicker = math.clamp(this.auraPulseTicker + dt * this.auraorbDir * pulseSpeed, 0.0, 1.0);
            var pulseAlpha = math.easeOutExpo(this.auraPulseTicker) * pulseScaleDelta + (1.0 - pulseScaleDelta);
            if (this.auraPulseTicker >= 1.0 || this.auraPulseTicker <= 0.0) {
                this.auraorbDir *= -1.0;
            }

            this.auraCircle.alpha = pulseAlpha * this.auraViewFade;
        }
    },

    playActionStartEffect: function playActionStartEffect(isActivePlayer, particleBarn, audioManager) {
        // Play action sound
        var actionSound = null;
        switch (this.action.type) {
            case Action.Reload: /* Fall-through */
            case Action.ReloadAlt:
                {
                    var actionItemDef = GameObjectDefs[this.action.item];
                    if (actionItemDef) {
                        actionSound = {
                            sound: this.action.type == Action.ReloadAlt ? actionItemDef.sound.reloadAlt : actionItemDef.sound.reload,
                            channel: isActivePlayer ? 'activePlayer' : 'otherPlayers'
                        };
                    }
                    break;
                }
            case Action.UseItem:
                {
                    var _actionItemDef = GameObjectDefs[this.action.item];
                    if (_actionItemDef) {
                        actionSound = {
                            sound: _actionItemDef.sound.use,
                            channel: isActivePlayer ? 'activePlayer' : 'otherPlayers'
                        };
                    }
                    break;
                }
            default:
                break;
        }

        audioManager.stopSound(this.actionSoundInstance);

        if (actionSound && this.playActionStartSfx) {
            this.actionSoundInstance = audioManager.playSound(actionSound.sound, {
                channel: actionSound.channel,
                soundPos: this.pos,
                fallOff: 2.0,
                layer: this.layer,
                filter: 'muffled'
            });
        }

        // Create a casing shell if reloading certain types of weapons
        if (this.action.type == Action.Reload || this.action.type == Action.ReloadAlt) {
            var _actionItemDef2 = GameObjectDefs[this.action.item];
            if (_actionItemDef2 && _actionItemDef2.caseTiming == 'reload') {
                for (var _i14 = 0; _i14 < _actionItemDef2.maxReload; _i14++) {
                    var shellDir = _i14 % 2 == 0 ? -1 : 1;
                    var shellAngle = Math.PI + Math.PI / 4 * shellDir;
                    var shellSpeedMult = _actionItemDef2.maxReload <= 2 ? 1.0 : math.lerp(Math.random(), 0.8, 1.2);
                    shot.createCasingParticle(this.action.item, shellAngle, shellSpeedMult, this.pos, this.dir, this.renderLayer, this.renderZOrd + 1, particleBarn, null);
                }
            }
        }
    },

    updateActionEffect: function updateActionEffect(isActivePlayer, playerInfo, particleBarn, audioManager) {
        // Determine if we should have an emitter
        var emitterType = '';
        var emitterProps = {};

        switch (this.action.type) {
            case Action.UseItem:
                {
                    var actionItemDef = GameObjectDefs[this.action.item];
                    var loadout = playerInfo.loadout;

                    if (actionItemDef.emitter) {
                        emitterType = actionItemDef.emitter;
                    } else if (actionItemDef.type == 'heal') {
                        audioManager.playSound('sfx_item_potion_drink_loop', {
                            channel: 'activePlayer',
                            soundPos: this.pos,
                            layer: this.layer,
                            loop: true,
                            muffled: true });
                        emitterType = GameObjectDefs[loadout.heal].emitter;
                    } else if (actionItemDef.type == 'boost') {
                        emitterType = GameObjectDefs[loadout.boost].emitter;
                    }

                    if (this.hasPerk('aoe_heal')) {
                        emitterProps.scale = 1.5;
                        emitterProps.radius = GameConfig.player.medicHealRange / emitterProps.scale;
                        emitterProps.rateMult = 0.25;
                    }
                    break;
                }
            case Action.Revive:
                {
                    if (this.m_netData.m_downed) {
                        emitterType = 'hp_potion';
                    }
                    break;
                }
            default:
                break;
        }

        // Add emitter
        if (emitterType && (!this.useItemEmitter || this.useItemEmitter.type != emitterType)) {
            if (this.useItemEmitter) {
                this.useItemEmitter.stop();
            }

            emitterProps.pos = this.pos;
            emitterProps.layer = this.layer;
            this.useItemEmitter = particleBarn.addEmitter(emitterType, emitterProps);
        }

        // Update existing emitter
        if (this.useItemEmitter) {
            this.useItemEmitter.pos = v2.add(this.pos, v2.create(0.0, 0.1));
            this.useItemEmitter.layer = this.renderLayer;
            this.useItemEmitter.zOrd = this.renderZOrd + 1;
        }

        // Stop emitter
        if (this.useItemEmitter && !emitterType) {
            this.useItemEmitter.stop();
            this.useItemEmitter = null;
        }

        // Update action sound effect position
        if (!audioManager.isSoundPlaying(this.actionSoundInstance)) {
            this.actionSoundInstance = null;
        }
        if (this.actionSoundInstance && !isActivePlayer) {
            audioManager.updateSound(this.actionSoundInstance, 'otherPlayers', this.pos, {
                layer: this.layer,
                fallOff: 2.0,
                filter: 'muffled'
            });
        }
    },

    playItemPickupSound: function playItemPickupSound(item, audioManager) {
        var itemDef = GameObjectDefs[item];
        if (itemDef.type == 'heal' || itemDef.type == 'power' || itemDef.type == 'exp') {

            //if(isActivePlayer){
            audioManager.playSound('sfx_player_item_picked_potion', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                muffled: true });
            //};

            // @HACK: The throwable equip sound is the same as the
            // pickup sound, leading to an echo.
            if (itemDef.type == 'throwable') {
                this.lastThrowablePickupSfxTicker = 0.3;
            }
        }
        if (itemDef.type == 'throwable') {
            audioManager.playSound('sfx_player_item_picked_throwable', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                muffled: true });
        }

        if (itemDef.weapType == 'sword_type' || itemDef.weapType == 'axe_type') {
            audioManager.playSound('sfx_player_weapon_pickup_slashing', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                muffled: true });
        }

        if (itemDef.weapType == 'dagger_type' || itemDef.weapType == 'bow_type') {
            audioManager.playSound('sfx_player_weapon_pickup_piercing', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                muffled: true });
        }

        if (itemDef.weapType == 'staff_type' || itemDef.weapType == 'wand_type') {
            audioManager.playSound('sfx_player_weapon_pickup_magic', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                muffled: true });
        }

        if (itemDef.offHand) {
            audioManager.playSound('sfx_player_item_picked_charm', {
                channel: 'activePlayer',
                soundPos: this.pos,
                layer: this.layer,
                muffled: true });
        }
    },

    //
    // Animation
    //
    selectIdlePose: function selectIdlePose() {
        //TODO delete this is not longer used (animations are in player-animation-controller.js)
        var curWeapDef = GameObjectDefs[this.m_netData.m_curWeapType];

        var idlePose = 'fists';
        if (this.downed) {
            idlePose = 'downed';
        } else if (curWeapDef.anim && curWeapDef.anim.idlePose) {
            idlePose = curWeapDef.anim.idlePose;
        } else if (curWeapDef.type == 'gun') {
            if (curWeapDef.pistol) {
                idlePose = curWeapDef.isDual ? 'dualPistol' : 'pistol';
            } else if (curWeapDef.isBullpup) {
                idlePose = 'bullpup';
            } else if (curWeapDef.isLauncher) {
                idlePose = 'launcher';
            } else if (curWeapDef.isFire) {
                idlePose = 'fire';
            } else {
                idlePose = curWeapDef.isDual ? 'dualRifle' : 'rifle';
            }
        } else if (curWeapDef.type == 'throwable') {
            idlePose = 'throwable';
        } else {
            idlePose = 'fists';
        }
        return animData.IdlePoses[idlePose] ? idlePose : 'fists';
    },

    isAttacking: function isAttacking() {
        return this.WeaponManager.isAttacking && !this.WeaponManager.ignoreIsAttacking();
    },

    selectAnim: function selectAnim(type) {
        var definitionId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        //TODO delete this, but before check if it is used somewhere, animations should use player-animation-controller.js
        var animData = function animData(type) {
            var tryMirror = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
            var definition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            var mirror = tryMirror ? Math.random() < 0.5 : false;
            return { type: type, mirror: mirror, speed: speed, definition: definition };
        };

        // Pick the actual anim to play based on the given type
        switch (type) {
            case Anim.None:
                return animData('none', false);
            case Anim.Cook:
                return animData('cook', false);
            case Anim.Throw:
                return animData('throw', false, 1, {
                    animDuration: GameConfig.player.throwTime
                });
            case Anim.Revive:
                return animData('revive', false);
            case Anim.CrawlForward:
                return animData('crawl_forward', true);
            case Anim.CrawlBackward:
                return animData('crawl_backward', true);
            case Anim.Melee:
            case Anim.RangeAttack:
            case Anim.OffHand:
            case Anim.DeployTrap:
                {
                    if (this.WeaponManager.currentAttack) {
                        var attackDef = this.WeaponManager.currentAttack.attackDef;
                        //let anims = weapDef.anim.attackAnims.anim;
                        //let animIdx = Math.floor(Math.random() * anims.length);
                        var animName = attackDef.animation;
                        return animData(animName || 'none', false, attackDef.animationSpeed || 1, attackDef);
                    } else {
                        return animData('none', false);
                    }
                }
            case Anim.StatusEffect:
                if (definitionId) {
                    var definition = null;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = (0, _getIterator3.default)(StatusEffects), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var statusEffect = _step.value;

                            if (statusEffect.id == definitionId) {
                                definition = statusEffect;
                                break;
                            }
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

                    if (definition) return animData(definition.animation, false, definition.animationSpeed || 1, definition);
                }
                return animData('none', false);
            case Anim.ChangePose:
                {
                    var weapDef = GameObjectDefs[this.m_netData.m_curWeapType];
                    if (!weapDef.anim || !weapDef.anim.poseAnims) {
                        return animData('none', true);
                    }

                    var anims = weapDef.anim.poseAnims;
                    var animIdx = Math.floor(Math.random() * anims.length);
                    var _animName = anims[animIdx];
                    return animData(_animName, false);
                }
            default:
                return animData('none', false);
        }
    },

    getAngleDirection: function getAngleDirection(angle) {
        var sideMode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (angle > 45 && angle < 135) {
            return 'up';
        }

        if (angle > 225 && angle < 315) {
            return 'down';
        }

        if (sideMode) {
            return 'side';
        }

        if (angle > 135 && angle < 225) {
            return 'left';
        }

        return 'right';
    },

    playAnimation: function playAnimation(type, seq) {
        var definitionId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        this.AnimationController.playActionAnimation(type, definitionId, false);
    },

    //
    // Anim effect functions
    //
    animPlaySound: function animPlaySound(animCtx, args) {
        var itemDef = GameObjectDefs[this.m_netData.m_curWeapType];
        var sound = itemDef.sound[args.sound];
        if (sound) {
            animCtx.audioManager.playSound(sound, {
                channel: 'sfx',
                soundPos: this.pos,
                fallOff: 3.0,
                layer: this.layer,
                filter: 'muffled'
            });
        }
    },

    animSetThrowableState: function animSetThrowableState(animCtx, args) {
        this.throwableState = args.state;
    },

    animThrowableParticles: function animThrowableParticles(animCtx, args) {
        var itemDef = GameObjectDefs[this.m_netData.m_curWeapType];

        if (itemDef.useThrowParticles) {
            // Pin
            var pinOff = v2.rotate(v2.create(0.75, 0.75), Math.atan2(this.dir.y, this.dir.x));
            animCtx.particleBarn.addParticle('fragPin', this.renderLayer, v2.add(this.pos, pinOff), v2.mul(v2.rotate(this.dir, Math.PI * 0.5), 4.5), 1.0, Math.random() * Math.PI * 2.0, null, this.renderZOrd + 1);

            // Lever
            var leverOff = v2.rotate(v2.create(0.75, -0.75), Math.atan2(this.dir.y, this.dir.x));
            animCtx.particleBarn.addParticle('fragLever', this.renderLayer, v2.add(this.pos, leverOff), v2.mul(v2.rotate(this.dir, -Math.PI * 0.25), 3.5), 1.0, Math.random() * Math.PI * 2.0, null, this.renderZOrd + 1);
        }
    },

    animMeleeCollision: function animMeleeCollision(animCtx, args) {
        var meleeDef = GameObjectDefs[this.m_netData.m_curWeapType];
        if (!meleeDef || meleeDef.type != 'melee') {
            return;
        }

        var meleeCol = this.getMeleeCollider();
        var meleeDist = meleeCol.rad + v2.length(v2.sub(this.pos, meleeCol.pos));
        //meleeCol.rad + v2.length(v2.sub(this.pos, meleeCol.pos));
        var hits = [];

        // Obstacles
        var obstacles = animCtx.map.m_obstaclePool.m_getPool();
        for (var _i15 = 0; _i15 < obstacles.length; _i15++) {
            var o = obstacles[_i15];
            if (!o.active || o.dead || o.isSkin || o.height < GameConfig.player.meleeHeight || !util.sameLayer(o.layer, this.layer & 0x1)) {
                continue;
            }

            /* let res = collider.intersectCircle(
                 o.collider, meleeCol.pos, meleeCol.rad
             );
             let res = collider.intersectPlayer(
                 meleeCol, o.collider
             );*/

            var res = collider.intersectPlayer(meleeCol, o.collider);

            //  let intersection = coldet.intersectRotatedRectangle(meleeCol, o.collider);
            // Certain melee weapons should perform a more expensive wall check
            // to not hit obstacles behind walls.
            if (meleeDef.cleave || meleeDef.wallCheck) {
                var meleeDir = v2.normalizeSafe(v2.sub(o.pos, this.pos), v2.create(1.0, 0.0));
                var wallCheck = collisionHelpers.intersectSegment(animCtx.map.m_obstaclePool.m_getPool(), this.pos, meleeDir, meleeDist, 1.0, this.layer, false);
                if (wallCheck && wallCheck.id !== o.__id && res) {

                    var xObjectDist = Math.pow(o.pos.x - meleeCol.pos.x, 2);
                    var yObjectDist = Math.pow(o.pos.y - meleeCol.pos.y, 2);
                    var objestDist = Math.sqrt(xObjectDist + yObjectDist);

                    if (wallCheck.dist < objestDist) {
                        res = null;
                    }
                }
            }
            if (res) {
                var swordMark = meleeDef.name == 'Lasr Swrd';
                if (swordMark && !(o.type.includes('tree') || o.type.includes('bush') || o.type.includes('wall') || o.type.includes('window') || o.type.includes('door'))) {
                    o.addBurnMark(this.pos);
                }
                var def = MapObjectDefs[o.type];
                var closestPt = v2.add(meleeCol.pos, v2.mul(v2.neg(res.dir), meleeCol.rad - res.pen));
                var vel = v2.rotate(v2.mul(res.dir, 7.5), (Math.random() - 0.5) * Math.PI / 3.0);
                if (!swordMark) {
                    hits.push({
                        pen: res.pen,
                        prio: 1,
                        pos: closestPt,
                        vel: vel,
                        layer: this.renderLayer,
                        zOrd: this.renderZOrd,
                        particle: def.hitParticle,
                        sound: def.sound.punch,
                        soundFn: 'playGroup'
                    });
                } else {
                    hits.push({
                        pen: res.pen,
                        prio: 1,
                        pos: closestPt,
                        vel: vel,
                        layer: this.renderLayer,
                        zOrd: this.renderZOrd,
                        particle: def.hitParticle,
                        sound: 'lasr_hit',
                        soundFn: 'playGroup'
                    });
                }
            }
        }

        // NPCS
        var npcs = animCtx.map.m_npcPool.m_getPool();
        for (var _i16 = 0; _i16 < npcs.length; _i16++) {
            var _o = npcs[_i16];
            if (!_o.active || _o.dead || _o.isSkin || _o.height < GameConfig.player.meleeHeight || !util.sameLayer(_o.layer, this.layer & 0x1)) {
                continue;
            }
            /* let res = collider.intersectCircle(
                 o.collider, meleeCol.pos, meleeCol.rad
             );*/

            var _res = collider.intersectPlayer(meleeCol, _o.collider);
            // Certain melee weapons should perform a more expensive wall check
            // to not hit obstacles behind walls.
            if (meleeDef.cleave || meleeDef.wallCheck) {
                var _meleeDir = v2.normalizeSafe(v2.sub(_o.pos, this.pos), v2.create(1.0, 0.0));
                var _wallCheck = collisionHelpers.intersectSegment(animCtx.map.m_npcPool.m_getPool(), this.pos, _meleeDir, meleeDist, 1.0, this.layer, false);
                if (_wallCheck && _wallCheck.id !== _o.__id) {
                    _res = null;
                }
            }
            if (_res) {
                var _def = MapObjectDefs[_o.type];
                var _closestPt = v2.add(meleeCol.pos, v2.mul(v2.neg(_res.dir), meleeCol.rad - _res.pen));
                var _vel3 = v2.rotate(v2.mul(_res.dir, 7.5), (Math.random() - 0.5) * Math.PI / 3.0);

                hits.push({
                    pen: _res.pen,
                    prio: 1,
                    pos: _closestPt,
                    vel: _vel3,
                    layer: this.renderLayer,
                    zOrd: this.renderZOrd,
                    particle: _def.hitParticle,
                    sound: _def.sound.punch,
                    soundFn: 'playGroup'
                });
            }
        }

        // Players
        var ourTeamId = animCtx.playerBarn.m_getPlayerInfo(this.__id).teamId;
        var players = animCtx.playerBarn.m_playerPool.m_getPool();
        for (var _i17 = 0; _i17 < players.length; _i17++) {
            var playerCol = players[_i17];
            if (!playerCol.active || playerCol.__id == this.__id || playerCol.m_netData.m_dead || !util.sameLayer(playerCol.layer, this.layer)) {
                continue;
            }

            var _meleeDir2 = v2.normalizeSafe(v2.sub(playerCol.pos, this.pos), v2.create(1.0, 0.0));
            /* let col = collider.intersectCircle(
                 playerCol.collider,
                 meleeCol.pos,
                 meleeCol.rad
             );*/

            var col = collider.intersectPlayer(meleeCol, playerCol.collider);
            if (col && math.eqAbs(meleeDist, collisionHelpers.intersectSegmentDist(animCtx.map.m_obstaclePool.m_getPool(), this.pos, _meleeDir2, meleeDist, GameConfig.player.meleeHeight, this.layer, false)) || col && math.eqAbs(meleeDist, collisionHelpers.intersectSegmentDist(animCtx.map.m_npcPool.m_getPool(), this.pos, _meleeDir2, meleeDist, GameConfig.player.meleeHeight, this.layer, false))) {
                var teamId = animCtx.playerBarn.m_getPlayerInfo(playerCol.__id).teamId;
                var _vel4 = v2.rotate(_meleeDir2, (Math.random() - 0.5) * Math.PI / 3.0);
                var hitSound = meleeDef.sound[args.playerHit] || meleeDef.sound.playerHit;
                hits.push({
                    playerCol: playerCol,
                    pen: col.pen,
                    prio: teamId == ourTeamId ? 2 : 0,
                    pos: v2.copy(playerCol.pos),
                    vel: _vel4,
                    layer: playerCol.renderLayer,
                    zOrd: playerCol.renderZOrd,
                    particle: 'bloodSplat',
                    sound: hitSound,
                    soundFn: 'playSound'
                });
            }
        }

        hits.sort(function (a, b) {
            if (a.prio == b.prio) {
                return b.pen - a.pen;
            } else {
                return a.prio - b.prio;
            }
        });

        var hitCount = hits.length;
        if (!meleeDef.cleave) {
            hitCount = math.min(hitCount, 1);
        }
        for (var _i18 = 0; _i18 < hitCount; _i18++) {
            var hit = hits[_i18];

            if (hit.playerCol && hit.particle === 'bloodSplat') {
                hit.playerCol.playSpineFX('hit');
            } else {
                animCtx.particleBarn.addParticle(hit.particle, hit.layer, hit.pos, hit.vel, 1.0, Math.random() * Math.PI * 2.0, null, hit.zOrd + 1);
            }

            animCtx.audioManager[hit.soundFn](hit.sound, {
                channel: 'hits',
                soundPos: hit.pos,
                layer: this.layer,
                filter: 'muffled'
            });
        }
    },

    initSubmergeSprites: function initSubmergeSprites() {
        var initSprite = function initSprite(sprite, img) {
            sprite.texture = PIXI.Texture.fromImage(img);
            sprite.anchor.set(0.5, 0.5);
            sprite.tint = 0xFFFFFF;
            sprite.alpha = 0.0;
            sprite.visible = false;
        };

        initSprite(this.bodySubmergeSprite, 'player-wading-01.img');
        initSprite(this.handLSubmergeSprite, 'player-hands-01.img');
        initSprite(this.handRSubmergeSprite, 'player-hands-01.img');
        initSprite(this.footLSubmergeSprite, 'player-feet-01.img');
        initSprite(this.footRSubmergeSprite, 'player-feet-01.img');

        // kSubmergeMaskScaleFactor reduces the number of verts generated
        // by PIXI.Graphics; we scale it back up to the world size remains
        // the same
        var mask = new PIXI.Graphics();
        mask.beginFill(0xff0000, 0.5);
        mask.drawCircle(0, 0, 38.0 * 2.0 * kSubmergeMaskScaleFactor);
        mask.position.set(0, 0);
        this.bodySubmergeSprite.addChild(mask);
        this.bodySubmergeSprite.mask = mask;
        this.bodySubmergeSprite.scale.set(0.5, 0.5);
    },

    updateSubmersion: function updateSubmersion(dt, map) {
        var inWater = this.surface.type == 'water';

        // Compute submersion
        var submersionAmount = 0.0;
        if (inWater) {
            var river = this.surface.data.river;
            var inRiver = river && !map.isInOcean(this.pos);
            var dist = inRiver ? river.distanceToShore(this.pos) : map.distanceToShore(this.pos);
            var maxDist = inRiver ? 12.0 : 16.0;
            submersionAmount = math.remap(dist, 0.0, maxDist, 0.6, 1.0);
        }
        this.submersion = math.lerp(dt * 4.0, this.submersion, submersionAmount);

        // Update sprites
        var submersionAlpha = this.submersion * 0.8;
        var submersionScale = (0.9 - this.submersion * 0.4) * 2.0;
        var maskScale = 1.0 / (submersionScale * kSubmergeMaskScaleFactor);

        this.bodySubmergeSprite.scale.set(submersionScale, submersionScale);
        this.bodySubmergeSprite.mask.scale.set(maskScale, maskScale);
        this.bodySubmergeSprite.alpha = submersionAlpha;
        this.bodySubmergeSprite.visible = submersionAlpha > 0.001;
        if (inWater) {

            if (map.infernoMode && this.m_netData.m_playerIndoors) {
                this.bodySubmergeSprite.tint = 0x3282ab;
            } else {
                this.bodySubmergeSprite.tint = this.surface.data.waterColor;
            }
        }

        var limbs = [this.handLSubmergeSprite, this.handRSubmergeSprite, this.footLSubmergeSprite, this.footRSubmergeSprite];
        for (var _i19 = 0; _i19 < limbs.length; _i19++) {
            var limb = limbs[_i19];
            limb.alpha = this.downed ? submersionAlpha : 0.0;
            limb.visible = limb.alpha > 0.001;
            if (inWater) {
                limb.tint = this.surface.data.waterColor;
            }
        }
    },

    updateFrozenState: function updateFrozenState(dt) {
        var kFadeDuration = 0.25;
        if (this.m_netData.m_frozen) {
            this.frozenTicker = kFadeDuration;
        } else {
            this.frozenTicker -= dt;
            this.updateFrozenImage = true;
        }
        this.bodyEffectSprite.alpha = this.m_netData.m_frozen ? 1.0 : math.remap(this.frozenTicker, 0.0, kFadeDuration, 0.0, 1.0);
        this.bodyEffectSprite.visible = this.frozenTicker > 0.0;
    },

    addRecoil: function addRecoil(amount, leftHand, rightHand) {
        if (leftHand) {
            this.gunRecoilL += amount;
        }
        if (rightHand) {
            this.gunRecoilR += amount;
        }
    },

    isUnderground: function isUnderground(map) {
        if (this.layer != 1) {
            return false;
        }

        var structures = map.m_structurePool.m_getPool();
        for (var _i20 = 0; _i20 < structures.length; _i20++) {
            var s = structures[_i20];
            if (s.layers.length < 2) {
                continue;
            }
            var layer = s.layers[1];
            if (collider.intersectPlayer(this.collider, layer.collision)) {
                return layer.underground;
            }
        }
        return true;
    },

    isTouch: function isTouch() {
        return device.touch;
    }
};

//
// PlayerBarn
//
function m_PlayerBarn(spineData, spineObjManager) {
    //temporal
    this.m_playerPool = new ObjectPool.Pool(Player);
    this.m_playerInfo = {};
    this.playerIds = [];
    this.teamInfo = {};
    this.groupInfo = {};
    this.playerStatus = {};
    this.anonPlayerNames = false;
    this.progressNotificationActive = false;
    this.activePlayerSkin = 0;
    this.spineData = spineData;
    this.SpineObjManager = spineObjManager;
}

m_PlayerBarn.prototype = {
    onMapLoad: function onMapLoad(map) {},

    m_update: function m_update(dt, activeId, teamMode, renderer, particleBarn, camera, map, inputBinds, audioManager, ui2Manager, preventInput, displayingStats, isSpectating, pass, localization) {
        // Update players
        var players = this.m_playerPool.m_getPool();
        for (var _i21 = 0; _i21 < players.length; _i21++) {
            var p = players[_i21];
            if (!p.active) {
                continue;
            }

            p.m_update(dt, this, map, audioManager, particleBarn, inputBinds, camera, renderer, ui2Manager, activeId, preventInput, displayingStats, isSpectating, pass, localization, this.progressNotificationActive);
        }

        //
        // Update player status data
        //
        // @HACK: Set the local player data; the server will only
        // send status updates when not in solo-mode. We may also
        // have not yet received an update for ourselves yet, but
        // we always expect the local data to be available.
        var activeInfo = this.m_getPlayerInfo(activeId);
        var activePlayer = this.m_getPlayerById(activeId);
        this.m_setPlayerStatus(activeId, {
            pos: v2.copy(activePlayer.m_netData.m_pos),
            health: activePlayer.m_localData.m_healthNormalized,
            disconnected: false,
            dead: activePlayer.m_netData.m_dead,
            downed: activePlayer.m_netData.m_downed,
            role: activePlayer.m_netData.m_role,
            visible: true
        });

        var statusUpdateRate = net.getPlayerStatusUpdateRate(map.factionMode);
        var keys = (0, _keys2.default)(this.playerStatus);
        for (var _i22 = 0; _i22 < keys.length; _i22++) {
            var status = this.playerStatus[keys[_i22]];
            var playerId = status.playerId;
            var playerInfo = this.m_getPlayerInfo(playerId);

            var player = this.m_getPlayerById(playerId);
            if (player) {
                // Update data with latest position if on screen
                //status.pos = v2.copy(player.m_netData.m_pos);
                status.posDelta = v2.length(v2.sub(player.m_netData.m_pos, status.pos));
                status.posTarget = v2.copy(player.m_netData.m_pos);
                status.posInterp = math.clamp(status.posInterp + dt * 0.2, dt / statusUpdateRate, 1.0);
                status.dead = player.m_netData.m_dead;
                status.downed = player.m_netData.m_downed;
            } else {
                status.posInterp = dt / statusUpdateRate;
            }

            // Interpolate position
            var move = v2.sub(status.posTarget, status.pos);
            var moveLen = v2.length(move);
            var moveDir = moveLen > 0.0001 ? v2.div(move, moveLen) : v2.create(1.0, 0.0);
            var moveAmt = math.min(moveLen, status.posDelta * status.posInterp);
            status.pos = v2.add(status.pos, v2.mul(moveDir, moveAmt));

            status.timeSinceVisible += dt;
            status.timeSinceUpdate += dt;

            var fade = status.dead && (playerInfo.teamId == activeInfo.teamId || status.role == 'leader') ? 0.6 : 0.0;
            status.minimapAlpha = math.smoothstep(status.timeSinceVisible, 0.0, 0.1) * math.lerp(math.smoothstep(status.timeSinceUpdate, 2.0, 2.5), 1.0, fade);
            // @HACK: Fix issue in non-faction mode when spectating and swapping
            // between teams. We don't want the old player indicators to fade out
            // after moving to the new team
            if (!map.factionMode && playerInfo.teamId != activeInfo.teamId) {
                status.minimapAlpha = 0.0;
            }
            status.minimapVisible = status.minimapAlpha > 0.01;
        }
    },

    render: function render(camera, debug) {
        var players = this.m_playerPool.m_getPool();
        for (var _i23 = 0; _i23 < players.length; _i23++) {
            var p = players[_i23];
            if (!p.active) {
                continue;
            }
            p.m_render(camera, debug);
        }
    },

    m_getPlayerById: function m_getPlayerById(id) {
        var pool = this.m_playerPool.m_getPool();
        for (var _i24 = 0; _i24 < pool.length; _i24++) {
            var p = pool[_i24];
            if (p.active && p.__id === id) {
                return p;
            }
        }
        return null;
    },

    m_setPlayerInfo: function m_setPlayerInfo(info) {
        this.m_playerInfo[info.playerId] = {
            playerId: info.playerId,
            teamId: info.teamId,
            groupId: info.groupId,
            name: info.name,
            nameTruncated: helpers.truncateString(info.name || '', 'bold 16px arial', 180),
            anonName: 'Player' + (info.playerId - 2750),
            loadout: util.cloneDeep(info.loadout),
            userId: info.userId,
            isUnlinked: info.isUnlinked
        };
        this.playerIds.push(info.playerId);
        this.playerIds.sort(function (a, b) {
            return a - b;
        });
    },

    m_deletePlayerInfo: function m_deletePlayerInfo(id) {
        var idx = this.playerIds.indexOf(id);
        if (idx !== -1) {
            this.playerIds.splice(idx, 1);
        }
        delete this.m_playerInfo[id];
        delete this.playerStatus[id];
    },

    m_getPlayerInfo: function m_getPlayerInfo(id) {
        return this.m_playerInfo[id] || {
            playerId: 0,
            group: 0,
            teamId: 0,
            name: '',
            nameTruncated: '',
            anonName: '',
            loadout: {},
            level: ''
        };
    },

    m_recomputeTeamData: function m_recomputeTeamData() {
        this.teamInfo = {};
        this.groupInfo = {};

        var keys = (0, _keys2.default)(this.m_playerInfo);
        for (var _i25 = 0; _i25 < keys.length; _i25++) {
            var playerInfo = this.m_playerInfo[keys[_i25]];
            var playerId = playerInfo.playerId;

            var teamId = playerInfo.teamId;
            this.teamInfo[teamId] = this.teamInfo[teamId] || {
                teamId: teamId,
                playerIds: []
            };
            this.teamInfo[teamId].playerIds.push(playerId);

            var groupId = playerInfo.groupId;
            this.groupInfo[groupId] = this.groupInfo[groupId] || {
                groupId: groupId,
                playerIds: []
            };
            this.groupInfo[groupId].playerIds.push(playerId);
        }

        var teams = (0, _keys2.default)(this.teamInfo);
        for (var _i26 = 0; _i26 < teams.length; _i26++) {
            var teamInfo = this.teamInfo[teams[_i26]];
            teamInfo.playerIds.sort(function (a, b) {
                return a - b;
            });
        }

        var groups = (0, _keys2.default)(this.groupInfo);
        for (var _i27 = 0; _i27 < groups.length; _i27++) {
            var groupInfo = this.groupInfo[groups[_i27]];
            groupInfo.playerIds.sort(function (a, b) {
                return a - b;
            });
        }
    },

    getTeamInfo: function getTeamInfo(teamId) {
        return this.teamInfo[teamId];
    },

    getGroupInfo: function getGroupInfo(groupId) {
        return this.groupInfo[groupId];
    },

    m_updatePlayerStatus: function m_updatePlayerStatus(teamId, playerStatus, factionMode) {
        // In factionMode, playerStatus refers to all playerIds in the game.
        // In all other modes, playerStatus refers to only playerIds in our team.
        var team = this.getTeamInfo(teamId);
        var playerIds = factionMode ? this.playerIds : team.playerIds;
        if (playerIds.length != playerStatus.players.length) {
            FirebaseManager.logError('PlayerIds and playerStatus.players out of sync.' + ' OurLen: ' + playerIds.length + ' MsgLen: ' + playerStatus.players.length + ' FactionMode: ' + factionMode);
            return;
        }
        for (var _i28 = 0; _i28 < playerIds.length; _i28++) {
            var playerId = playerIds[_i28];
            var status = playerStatus.players[_i28];
            if (status.hasData) {
                this.m_setPlayerStatus(playerId, status);
            }
        }
    },

    m_setPlayerStatus: function m_setPlayerStatus(playerId, newStatus) {
        var status = this.playerStatus[playerId] || {
            playerId: playerId,
            pos: v2.copy(newStatus.pos),
            posTarget: v2.copy(newStatus.pos),
            posDelta: v2.create(0.0, 0.0),
            health: 1.0, //Normalized health
            posInterp: 0.0,
            visible: false,
            dead: false,
            downed: false,
            disconnected: false,
            role: '',
            timeSinceUpdate: 0.0,
            timeSinceVisible: 0.0,
            minimapAlpha: 0.0,
            minimapVisible: false
        };

        var wasVisible = status.visible;
        if (!status.minimapVisible) {
            status.pos = v2.copy(newStatus.pos);

            if (!status.visible && newStatus.visible) {
                status.timeSinceVisible = 0.0;
            }
        }
        status.visible = newStatus.visible;
        if (status.visible) {
            status.timeSinceUpdate = 0.0;
        }

        status.posTarget = v2.copy(newStatus.pos);
        status.posDelta = v2.length(v2.sub(newStatus.pos, status.pos));
        status.dead = newStatus.dead;
        status.downed = newStatus.downed;
        status.role = newStatus.role;
        if (newStatus.health !== undefined) {
            status.health = newStatus.health;
        }
        if (newStatus.disconnected !== undefined) {
            status.disconnected = newStatus.disconnected;
        }

        this.playerStatus[playerId] = status;
    },

    m_getPlayerStatus: function m_getPlayerStatus(playerId) {
        return this.playerStatus[playerId];
    },

    m_updateGroupStatus: function m_updateGroupStatus(groupId, groupStatus) {
        var info = this.getGroupInfo(groupId);
        if (info.playerIds.length != groupStatus.players.length) {
            FirebaseManager.logError('PlayerIds and groupStatus.players out of sync');
            return;
        }
        for (var _i29 = 0; _i29 < info.playerIds.length; _i29++) {
            var playerId = info.playerIds[_i29];
            var playerStatus = groupStatus.players[_i29];

            // Stash groupStatus values into playerStatus
            var status = this.m_getPlayerStatus(playerId);
            if (status) {
                status.health = playerStatus.health;
                status.disconnected = playerStatus.disconnected;
            }
        }
    },

    getGroupColor: function getGroupColor(playerId) {
        var playerInfo = this.m_getPlayerInfo(playerId);
        var group = this.getGroupInfo(playerInfo.groupId);
        var groupIdx = group ? group.playerIds.indexOf(playerId) : 0;
        return groupIdx >= 0 && groupIdx < GameConfig.groupColors.length ? GameConfig.groupColors[groupIdx] : 0xFFFFFF;
    },

    getTeamColor: function getTeamColor(teamId) {
        var teamIdx = teamId - 1;
        return teamIdx >= 0 && teamIdx < GameConfig.teamColors.length ? GameConfig.teamColors[teamIdx] : 0xFFFFFF;
    },

    getPlayerName: function getPlayerName(playerId, activePlayerId, truncateForKillfeed) {
        var info = this.m_getPlayerInfo(playerId);
        if (!info) {
            return '';
        }

        var name = info.name;

        if (truncateForKillfeed) {
            name = info.nameTruncated;
        }

        if (this.anonPlayerNames) {
            var activeInfo = this.m_getPlayerInfo(activePlayerId);
            // Anonymize player name if they aren't in the active player's group
            if (activeInfo.groupId != info.groupId) {
                name = info.anonName;
            }
        }

        return name;
    },

    killPlayer: function killPlayer(targetId) {
        var target = this.m_getPlayerById(targetId);
        if (!target) return;

        if (target.WeaponManager.currentAttack && target.WeaponManager.currentAttack.finishAttack) {
            target.WeaponManager.currentAttack.finishAttack();
        }

        if (target.HpBarGFX) {
            target.HpBarGFX.clear();
        }
    },


    addDeathEffect: function addDeathEffect(targetId, killerId, sourceType, audioManager, particleBarn) {
        var target = this.m_getPlayerById(targetId);
        var killer = this.m_getPlayerById(killerId);
        var targetInfo = this.m_getPlayerInfo(targetId);
        if (target) {
            audioManager.playSound('sfx_player_death', {
                channel: 'activePlayer',
                soundPos: target.pos,
                layer: target.layer,
                muffled: true });
        }

        if (target && killer && killer.hasPerk('turkey_shoot')) {
            // Assume it's a turkey death
            audioManager.playGroup('cluck', {
                soundPos: target.pos,
                layer: target.layer,
                muffled: true
            });
            audioManager.playSound('feather_01', {
                channel: 'sfx',
                soundPos: target.pos,
                layer: target.layer,
                muffled: true
            });
            var numParticles = Math.floor(util.random(30, 35));
            for (var _i30 = 0; _i30 < numParticles; _i30++) {
                var vel = v2.mul(v2.randomUnit(), util.random(5, 15));
                var particle = 'turkeyFeathersDeath';
                particleBarn.addParticle(particle, target.layer, target.pos, vel);
            }
        } else if (target && killer && killer.hasPerk('cupid')) {

            var _numParticles = Math.floor(util.random(30, 35));
            for (var _i31 = 0; _i31 < _numParticles; _i31++) {
                var _vel5 = v2.mul(v2.randomUnit(), util.random(5, 15));
                var _particle = 'cupidDeath';
                particleBarn.addParticle(_particle, target.layer, target.pos, _vel5);
            }
        } else if (target && targetInfo && targetInfo.loadout && targetInfo.loadout.deathEffect && targetInfo.loadout.deathEffect !== 'regularDeath') {

            var deathEffectSelected = GameObjectDefs[targetInfo.loadout.deathEffect];
            if (deathEffectSelected.isParticle) {
                var minParticules = deathEffectSelected.minParticules ? deathEffectSelected.minParticules : 30;
                var maxParticules = deathEffectSelected.maxParticules ? deathEffectSelected.maxParticules : 35;
                var _numParticles2 = Math.floor(util.random(minParticules, maxParticules));
                for (var _i32 = 0; _i32 < _numParticles2; _i32++) {
                    var _vel6 = v2.mul(v2.randomUnit(), util.random(5, 15));
                    var _particle2 = targetInfo.loadout.deathEffect;
                    particleBarn.addParticle(_particle2, target.layer, target.pos, _vel6);
                }
            } else if (target && target.deathEffectSprite && !target.deathEffectSprite.visible) {

                var baseTexture = [];
                for (var _i33 = 0; _i33 < deathEffectSelected.sprites.length; _i33++) {
                    var texture = PIXI.Texture.from(deathEffectSelected.sprites[_i33]);
                    baseTexture.push(texture);
                }
                target.deathEffectSprite.textures = baseTexture;

                target.spriteContainer.position.set(target.container.position.x, target.container.position.y);
                target.spriteContainer.addChild(target.deathEffectSprite);

                target.deathEffectSprite.anchor.set(0.5, 0.5);
                target.deathEffectSprite.scale.set(deathEffectSelected.animationScale, deathEffectSelected.animationScale);
                target.deathEffectSprite.animationSpeed = deathEffectSelected.animationSpeed;
                target.deathEffectSprite.loop = false;

                target.deathEffectSprite.position.set(0, 0);
                target.deathEffectSprite.visible = true;
                target.deathEffectSprite.play();

                target.deathEffectSprite.onComplete = function () {
                    target.deathEffectSprite.visible = false;
                };
            }
        }
    }
};

module.exports = {
    m_PlayerBarn: m_PlayerBarn,
    Player: Player
};
