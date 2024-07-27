"use strict";


var _CharacterSkinsToArmo;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Slots = {
    None: 0,
    slot1: 1,
    slot2: 2,
    slot3: 3,
    slot4: 4,
    slot5: 5,
    slot6: 6,
    slot7: 7,
    count: 7
};

var CharacterSkins = {
    knight: 0,
    wizard: 1,
    barbarian: 2,
    archer: 3,
    supreme_knight: 4,
    woodelf: 5,
    fairy_princess: 6,
    dwarf: 7,
    raid: 8,
    paladin: 9,
    east_march_knight: 10,
    sorcerer: 11,
    bard_elf: 12,
    witchy: 13
};

module.exports = {
    protocolVersion: 0,
    clientVersion: '0.0.2',

    //
    // Types
    //
    // @TODO: Refactor back into more generic UseItem and EquipItem types
    Input: {
        MoveLeft: 0,
        MoveRight: 1,
        MoveUp: 2,
        MoveDown: 3,
        LightAttack: 4,
        OffHandAbility: 5,
        Skill_1: 6,
        Skill_2: 7,
        Skill_3: 8,
        Reload: 9,
        Cancel: 10,
        Interact: 11,
        Dash: 12,
        Revive: 13,
        Use: 14,
        Loot: 15,
        Bag01: 17,
        Bag02: 18,
        Bag03: 19,
        Bag04: 20,
        Bag05: 21,
        Bag06: 22,
        Bag07: 23,
        EquipSmokeGrenade: 24, //Not used
        EquipFragGrenade: 25, //Not used
        EquipPrevWeap: 26, //Not used
        EquipLastWeap: 27, //Not used
        EquipOtherGun: 28, //Not used
        EquipPrevScope: 29,
        EquipNextScope: 30,
        UseBandage: 31, //Not used
        UseHealthKit: 32, //Not used
        UseSoda: 33, //Not used
        UsePainkiller: 34,
        StowWeapons: 35, //Not used
        SwapWeapSlots: 36, //Not used
        ToggleMap: 37,
        CycleUIMode: 38,
        EmoteMenu: 39,
        TeamPingMenu: 40,
        Fullscreen: 41,
        HideUI: 41,
        TeamPingSingle: 43,
        UseEventItem: 44,
        LevelUp: 45,
        LevelReset: 46,
        RemoveStorm: 47,
        // Total number of inputs
        Count: 47
    },

    EmoteSlot: {
        Top: 0,
        Right: 1,
        Bottom: 2,
        Left: 3,
        Win: 4,
        Death: 5,
        Count: 6
    },

    WeaponSlot: {
        Primary: 0,
        OffHand: 1,
        Count: 2
    },

    WeaponType: ['gun', 'gun', 'melee', 'throwable'],

    Slots: Slots,

    SlotsByIndex: [Slots.slot1, Slots.slot2, Slots.slot3, Slots.slot4, Slots.slot5, Slots.slot6, Slots.slot7],

    SlotSize: {
        0: [10],
        1: [10],
        2: [10],
        3: [10]
    },

    DamageType: {
        Player: 0,
        Bleeding: 1,
        Gas: 2,
        Npc: 3,
        Burning: 4,
        Poison: 5,
        DownState: 6,
        World: 7,
        Freeze: 8
        /*TODO remove if not used anymore
        Phoenix: 10,
        Weather: 6,
        Airdrop: 3,
        Airstrike: 4,*/
    },

    Action: {
        None: 0,
        Reload: 1,
        ReloadAlt: 2,
        UseItem: 3,
        Revive: 4
        // @NOTE: Must increase serialization bits for x.netFullState.actionType
        // to use numbers beyond 7
    },

    AttackTypes: {
        none: 0,
        lightAttack: 1,
        heavyAttack: 2,
        skill_1: 3,
        skill_2: 4,
        skill_3: 5
        //More than 7 need to update net
    },

    AttackTypesToStr: {
        0: 'none',
        1: 'lightAttack',
        2: 'heavyAttack',
        3: 'skill_1',
        4: 'skill_2',
        5: 'skill_3'
        //More than 7 need to update net
    },

    Anim: {
        None: 0,
        Melee: 1,
        Cook: 2,
        Throw: 3,
        CrawlForward: 4,
        CrawlBackward: 5,
        Revive: 6,
        ChangePose: 7,
        OffHand: 8,
        Dash: 9,
        RangeAttack: 10,
        DeployTrap: 11,
        StatusEffect: 12
        // @NOTE: Must increase serialization bits for x.netFullState.animType
        // to use numbers beyond 7
    },

    GasMode: {
        Inactive: 0,
        Waiting: 1,
        Moving: 2
    },

    Plane: {
        Airdrop: 0,
        Airstrike: 1
    },

    HasteType: {
        None: 0,
        Windwalk: 1,
        Takedown: 2,
        Inspire: 3
        // @NOTE: Must increase serialization bits for x.netFullstate.hasteType
        // fo use numbers beyond 7
    },

    //
    // Vars
    //
    map: {
        // Distance between grid lines on the client
        gridSize: 72.0,
        // Average distance from edge of map to shore line
        // and variation from that distance
        shoreVariation: 3.0,
        // Grass path is inset from maximum shore inset
        grassVariation: 2.0,
        waterPointsDensity: 2.0, //This value will be multiplied by river width
        oceanPoints: 1000, //ocean point per side (left-right-up-down)
        grassPoints: 14000 //ocean point per side (left-right-up-down)
    },

    player: {
        radius: 1.0,
        colliderWidth: 1.6,
        colliderHeight: 1.6,
        movementColliderWidth: 0.65,
        movementColliderHeight: 0.4,
        movementColliderOffsetX: 0,
        movementColliderOffsetY: -1,
        meleeWidthDefault: 4,
        meleeHeightDefault: 2,
        playerInteractionRad: { x: 1.0, y: 1.0 },
        // Radius with longest weapon and largest backpack equipped
        maxVisualRadius: 3.75,
        maxInteractionRad: 3.5,
        health: 100.0,
        maxHealth: 100,
        reviveHealth: 24.0,
        boostBreakpoints: [1.0, 1.0, 1.5, 0.5],
        baseSwitchDelay: 0.25,
        freeSwitchCooldown: 1.0,
        downStateDamageTickRate: 1.0,
        reviveDuration: 8.0,
        reviveRange: 5.0,
        crawlTime: 0.75,
        emoteSoftCooldown: 2.0,
        emoteHardCooldown: 6.0,
        emoteThreshold: 6,
        throwableMaxMouseDist: 18.0,
        cookTime: 0.1,
        throwTime: 0.333,
        meleeHeight: 0.25,
        touchLootRadMult: 1.4,
        medicHealRange: 8.0,
        medicReviveRange: 6.0,
        dashCooldownTime: 2.0,
        dashCharges: 1.0,
        dashDurationTime: 0.15,
        dashDistance: 7,
        maxTouchMoveLength: 255,
        framesUntilStopMoving: 4,
        defaulInventorySlotsSize: 4
    },

    npc: {
        framesUntilStopMoving: 4
    },

    camera: {
        cameraDeadZoneColliderWidth: 0,
        cameraDeadZoneColliderHeight: 0,
        cameraPlayerColliderWidth: 0,
        cameraPlayerColliderHeight: 0,
        cameraMoveDuration: 1.5, //1.5
        cameraAccelaration: 6.5, //4.0
        cameraViewRad: 5,
        cameraZoomSpeedDefault: 3.0
    },

    defaultEmoteLoadout: ['emote_happy', 'emote_sad', 'emote_like', 'emote_dislike', '', ''],

    airdrop: {
        actionOffset: 0.0,
        fallTime: 8.0,
        crushDamage: 100.0,
        planeVel: 48.0,
        planeRad: 150.0,
        soundRangeMult: 2.5,
        soundRangeDelta: 0.25,
        soundRangeMax: 92.0,
        fallOff: 0.0
    },

    airstrike: {
        actionOffset: 0.0,
        bombJitter: 4.0,
        bombOffset: 2.0,
        bombVel: 3.0,
        bombCount: 20,
        planeVel: 350.0,
        planeRad: 120.0,
        soundRangeMult: 18.0,
        soundRangeDelta: 18.0,
        soundRangeMax: 48.0,
        fallOff: 1.25
    },

    groupColors: [0xFFD261, 0xFC7069, 0x00FF6A, 0x66B6FF],

    teamColors: [0xcc0000, 0x007eff],

    bullet: {
        maxReflect: 3,
        reflectDistDecay: 1.5,
        height: 0.25
    },

    projectile: {
        maxHeight: 5.0
    },

    structureLayerCount: 2,

    tracerColors: {
        '9mm': {
            regular: 0xFEE2C6,
            saturated: 0xffd9b3,
            chambered: 0xff7f00,
            alphaRate: 0.92,
            alphaMin: 0.14
        },
        '9mm_suppressed_bonus': {
            regular: 0xFEE2C6,
            saturated: 0xffd9b3,
            chambered: 0xff7f00,
            alphaRate: 0.96,
            alphaMin: 0.28
        },
        '9mm_cursed': {
            regular: 0x130900,
            saturated: 0x130900,
            chambered: 0x130900,
            alphaRate: 0.92,
            alphaMin: 0.14
        },
        '762mm': {
            regular: 0xC5D6FE,
            saturated: 0xabc4ff,
            chambered: 0x004cff,
            alphaRate: 0.94,
            alphaMin: 0.2
        },
        '12gauge': {
            regular: 0xFEDCDC,
            saturated: 0xFEDCDC,
            chambered: 0xff0000
        },

        'laser': {
            regular: 0xff0000,
            saturated: 0xff0000,
            chambered: 0xff0000
        },

        'water': {
            regular: 0x3771fa,
            saturated: 0x3771fa,
            chambered: 0x3771fa
        },

        '556mm': {
            regular: 0xa9ff92,
            saturated: 0xa9ff92,
            chambered: 0x36ff00,
            alphaRate: 0.92,
            alphaMin: 0.14
        },
        '50AE': {
            regular: 0xfff088,
            saturated: 0xfff088,
            chambered: 0xffdf00
        },
        '308sub': {
            regular: 0x252b00,
            saturated: 0x465000,
            chambered: 0x131600,
            alphaRate: 0.92,
            alphaMin: 0.07
        },
        'flare': {
            regular: 0xe2e2e2,
            saturated: 0xe2e2e2,
            chambered: 0xc4c4c4
        },
        '45acp': {
            regular: 0xecbeff,
            saturated: 0xe7acff,
            chambered: 0xb500ff
        },
        'shrapnel': {
            regular: 0x333333,
            saturated: 0x333333
        },
        'frag': {
            regular: 0xcb0000,
            saturated: 0xcb0000
        },
        'invis': {
            regular: 0x000000,
            saturated: 0x000000,
            chambered: 0x000000
        },
        'heart': {
            regular: 0xFEE2C6,
            saturated: 0xffd9b3,
            chambered: 0xff7f00,
            alphaRate: 0.92,
            alphaMin: 0.14
        },
        'blackTrail': {
            regular: 0x000000,
            saturated: 0x000000,
            chambered: 0x000000,
            alphaRate: 0.92,
            alphaMin: 0.14
        },
        'rainbowTrail': {
            regular: 0xffffff,
            saturated: 0xffffff,
            chambered: 0xffffff,
            alphaRate: 0.92,
            alphaMin: 0.14
        },
        'skitternade': {
            regular: 0x9BFF99,
            saturated: 0x9BFF99,
            chambered: 0x9BFF99
        },
        'antiFire': {
            regular: 0x9BFF99,
            saturated: 0x9BFF99,
            chambered: 0x9BFF99
        },
        'test_staffProjectileTrail': {
            regular: 0xc23dff,
            saturated: 0xc23dff,
            chambered: 0xc23dff
        }
    },

    scopeZoomRadius: {
        desktop: {
            '0xscope': 10, //blind effect scope
            '1xscope': 24,
            '2xscope': 36,
            '4xscope': 48,
            '8xscope': 68,
            '15xscope': 104
        },
        mobile: {
            '1xscope': 32,
            '2xscope': 40,
            '4xscope': 48,
            '8xscope': 64,
            '15xscope': 88
        }
    },

    bagSizes: {
        '9mm': [120, 240, 330, 420],
        '762mm': [90, 180, 240, 300],
        '556mm': [90, 180, 240, 300],
        '12gauge': [15, 30, 60, 90],
        '50AE': [49, 98, 147, 196],
        '308sub': [10, 20, 40, 80],
        'flare': [2, 4, 6, 8],
        '40mm': [10, 20, 30, 40],
        '45acp': [90, 180, 240, 300],
        'mine': [3, 6, 9, 12],
        'frag': [3, 6, 9, 12],
        'heart_frag': [3, 6, 9, 12],
        'smoke': [3, 6, 9, 12],
        'strobe': [2, 3, 4, 5],
        'mirv': [2, 4, 6, 8],
        'snowball': [10, 20, 30, 40],
        'water_balloon': [10, 20, 30, 40],
        'skitternade': [10, 20, 30, 40],
        'antiFire': [10, 20, 30, 40],
        'potato': [10, 20, 30, 40],
        'hppotionsmall': [5, 10, 15, 30],
        'hppotionmedium': [5, 10, 15, 30],
        'hppotionlarge': [5, 10, 15, 30],
        'healthkit': [1, 2, 3, 4],
        'soda': [2, 5, 10, 15],
        'stats': [2, 5, 10, 15],
        'chocolateBox': [2, 5, 10, 15],
        'bottle': [2, 5, 10, 15],
        'gunchilada': [2, 5, 10, 15],
        'watermelon': [2, 5, 10, 15],
        'nitroLace': [2, 5, 10, 15],
        'flask': [2, 5, 10, 15],
        'pulseBox': [2, 5, 10, 15],
        'brawnpotion': [1, 2, 3, 4],
        'exppotionsmall': [1, 2, 3, 4],
        'exppotionmedium': [1, 2, 3, 4],
        'exppotionlarge': [1, 2, 3, 4],
        '1xscope': [1, 1, 1, 1],
        '2xscope': [1, 1, 1, 1],
        '4xscope': [1, 1, 1, 1],
        '8xscope': [1, 1, 1, 1],
        '15xscope': [1, 1, 1, 1],
        'rainbow_ammo': [1, 1, 1, 1]
    },

    lootRadius: {
        'outfit': 1.0,
        'melee': 1.25,
        'gun': 1.25,
        'throwable': 1.0,
        'ammo': 1.2,
        'heal': 1.0,
        'boost': 1.0,
        'power': 1.0,
        'exp': 1.0,
        'backpack': 1.0,
        'helmet': 1.0,
        'chest': 1.0,
        'neck': 1.0,
        'scope': 1.0,
        'perk': 1.25,
        'xp': 1.0
    },

    features: {
        inGameNotificationActive: true
    },

    PlayerStats: {
        Power: 1.0,
        Vitality: 10,
        Speed: 1.0,
        HealedPoints: 25,
        Actions: ["playerStatsDecreasePower", "playerStatsIncreasePower", "playerStatsDecreaseVitality", "playerStatsIncreaseVitality", "playerStatsDecreaseSpeed", "playerStatsIncreaseSpeed"]

    },
    CharacterSkins: CharacterSkins,
    CharacterSkinsToArmorId: (_CharacterSkinsToArmo = {}, _defineProperty(_CharacterSkinsToArmo, CharacterSkins.knight, 'armor_emeralknight'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.wizard, 'armor_whitewizard'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.barbarian, 'armor_emeralknight'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.archer, 'armor_spiritwarrior'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.supreme_knight, 'armor_supremeknight'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.woodelf, 'armor_woodelf'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.fairy_princess, 'armor_fairyprincess'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.dwarf, 'armor_dwarf'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.raid, 'armor_raid'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.paladin, 'armor_paladin'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.east_march_knight, 'armor_eastmarchknight'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.sorcerer, 'armor_sorcerer'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.bard_elf, 'armor_bardelf'), _defineProperty(_CharacterSkinsToArmo, CharacterSkins.witchy, 'armor_witchy'), _CharacterSkinsToArmo),
    SkinSlots: {
        BaseSkin: 0,
        Helmet: 1,
        Body: 2,
        OffHand: 3,
        MainHand: 4
    },
    SelectedSkill: {
        None: 0,
        Skill_1: 1,
        Skill_2: 2,
        Skill_3: 3,
        Throwable: 4,
        Consumable: 5,
        OffHand: 6
    },
    GameSettings: {
        Storm: true,
        RandomSpawn: true,
        StormTestCircles: false
    }
};
