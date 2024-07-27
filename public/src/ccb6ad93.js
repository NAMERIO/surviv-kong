"use strict";


var util = require("./util.js");

function defineSkin(baseType, params) {
    return util.mergeDeep({}, BaseDefs[baseType], { baseType: baseType }, params);
}

var BaseDefs = {
    'fists': {
        name: 'Fists',
        type: 'melee',
        quality: 0,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 24.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 0.9,
            damageTimes: [0.1],
            cooldownTime: 0.25
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['fists']
        },
        sound: {
            swing: 'punch_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'punch_hit_01'
        },
        lootImg: {
            sprite: 'loot-weapon-fists.img',
            scale: 0.3,
            rad: 25.0,
            tint: 0x00ff00
        }
    },
    'knuckles': {
        name: 'Knuckles',
        type: 'melee',
        quality: 0,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 24.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        noDropOnDeath: true,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 0.9,
            damageTimes: [0.1],
            cooldownTime: 0.25
        },
        speed: {
            equip: 1.0,
            attack: 0.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['fists', 'fists']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'punch_swing_01',
            deploy: 'knuckles_deploy_01',
            playerHit: 'punch_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-knuckles-rusted.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rad: 25.0,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-knuckles-rusted.img',
            pos: { x: 0.0, y: -27.0 },
            rot: Math.PI * 0.5,
            scale: { x: 0.2, y: 0.2 },
            tint: 0xffffff
        }
    },
    'karambit': {
        name: 'Karambit',
        type: 'melee',
        quality: 0,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 24.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        noDropOnDeath: true,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 0.9,
            damageTimes: [0.1],
            cooldownTime: 0.25
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'slash',
            attackAnims: ['slash', 'fists']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'knife_deploy_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-karambit-rugged.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 2.35619
        },
        worldImg: {
            sprite: 'loot-melee-karambit-rugged.img',
            pos: { x: 15.5, y: -5.0 },
            rot: Math.PI * 0.5,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'bayonet': {
        name: 'Bayonet',
        type: 'melee',
        quality: 0,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 24.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        noDropOnDeath: true,
        attack: {
            offset: { x: 5.75, y: 0.0 },
            rad: 0.9,
            damageTimes: [0.1],
            cooldownTime: 0.25
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['cut', 'thrust']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'knife_deploy_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-bayonet-rugged.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-bayonet-rugged.img',
            pos: { x: -0.5, y: -32.5 },
            rot: 0.785,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'huntsman': {
        name: 'Huntsman',
        type: 'melee',
        quality: 0,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 24.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        noDropOnDeath: true,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 0.9,
            damageTimes: [0.1],
            cooldownTime: 0.25
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['cut', 'thrust']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'knife_deploy_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-huntsman-rugged.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-huntsman-rugged.img',
            pos: { x: 2.5, y: -35.5 },
            rot: 0.82,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'bowie': {
        name: 'Bowie',
        type: 'melee',
        quality: 0,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 24.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        noDropOnDeath: true,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 0.9,
            damageTimes: [0.1],
            cooldownTime: 0.25
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['cut', 'thrust']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'knife_deploy_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-bowie-vintage.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-bowie-vintage.img',
            pos: { x: -0.5, y: -32.5 },
            rot: 0.785,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'machete': {
        name: 'Machete',
        type: 'melee',
        quality: 1,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 33.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        attack: {
            offset: { x: 1.5, y: 0.0 },
            rad: 1.75,
            damageTimes: [0.12],
            cooldownTime: 0.3
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'machete',
            attackAnims: ['cutReverse']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'knife_deploy_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-machete-taiga.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-machete-taiga.img',
            pos: { x: -2.5, y: -48.5 },
            rot: 1.885,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'saw': {
        name: 'Saw',
        type: 'melee',
        quality: 1,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 44.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        attack: {
            offset: { x: 2.0, y: 0.0 },
            rad: 1.75,
            damageTimes: [0.1, 0.5],
            cooldownTime: 0.7
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'machete',
            attackAnims: ['sawSwing']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'knife_deploy_01',
            playerHit: 'knife_hit_01',
            playerHit2: 'saw_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-bonesaw-rusted.img',
            mirror: true,
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-bonesaw-rusted.img',
            pos: { x: -2.5, y: -48.5 },
            rot: 1.885,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'woodaxe': {
        name: 'Wood Axe',
        type: 'melee',
        quality: 0,
        armorPiercing: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 36.0,
        obstacleDamage: 1.92,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 1.0,
            damageTimes: [0.18],
            cooldownTime: 0.36
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeTwoHanded',
            attackAnims: ['axeSwing']
        },
        sound: {
            pickup: 'heavy_pickup_01',
            swing: 'heavy_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'axe_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-woodaxe.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 2.35619
        },
        worldImg: {
            sprite: 'loot-melee-woodaxe.img',
            pos: { x: -12.5, y: -16.0 },
            rot: 1.2,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff,
            leftHandOntop: true
        }
    },
    'fireaxe': {
        name: 'Fire Axe',
        type: 'melee',
        quality: 1,
        armorPiercing: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 44.0,
        obstacleDamage: 2.4,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 1.0,
            damageTimes: [0.21],
            cooldownTime: 0.42
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeTwoHanded',
            attackAnims: ['axeSwing']
        },
        sound: {
            pickup: 'heavy_pickup_01',
            swing: 'heavy_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'axe_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-fireaxe.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 2.35619
        },
        worldImg: {
            sprite: 'loot-melee-fireaxe.img',
            pos: { x: -12.5, y: -4.0 },
            rot: 1.2,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff,
            leftHandOntop: true
        }
    },
    'icePick': {
        name: 'Ice Pick',
        type: 'melee',
        quality: 1,
        armorPiercing: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 52.0,
        noPotatoSwap: true,
        obstacleDamage: 2.8,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 1.0,
            damageTimes: [0.21],
            cooldownTime: 0.42
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeTwoHanded',
            attackAnims: ['axeSwing']
        },
        sound: {
            pickup: 'heavy_pickup_01',
            swing: 'heavy_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'axe_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-icepick.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 2.35619
        },
        worldImg: {
            sprite: 'loot-melee-icepick.img',
            pos: { x: -12.5, y: -4.0 },
            rot: 1.2,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff,
            leftHandOntop: true
        }
    },
    'lasr_swrd': {
        name: 'Lasr Swrd',
        type: 'melee',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        noPotatoSwap: true,
        switchDelay: 0.25,
        damage: 60.0,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        attack: {
            offset: { x: 5.75, y: 0.0 },
            rad: 5.1,
            damageTimes: [0.3],
            cooldownTime: 0.6,
            poseTime: 0.2
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeLasrSwrd',
            attackAnims: ['lasrSwrdSwing'],
            poseAnims: ['lasrSwrd_pose_1', 'lasrSwrd_pose_2', 'lasrSwrd_pose_3']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'lasr_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'lasr_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-lasr-sword-01.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 0.0
        },
        worldImg: {
            sprite: 'lasr-sword-01.img',
            pos: { x: 110.0, y: -2.0 },
            rot: 0.0,
            scale: { x: 0.15, y: 0.15 },
            tint: 0xffffff,
            leftHandOntop: true
        },
        reflectArea: {
            offset: { x: 1.75, y: 0.0 },
            rad: 1.1
        }
    },

    'lasr_swrd_02': {
        name: 'Lasr Swrd',
        type: 'melee',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        noPotatoSwap: true,
        switchDelay: 0.25,
        damage: 60.0,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.75, y: 0.0 },
            rad: 2.1,
            damageTimes: [0.3],
            cooldownTime: 0.6,
            poseTime: 0.2
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeLasrSwrd',
            attackAnims: ['lasrSwrdSwing'],
            poseAnims: ['lasrSwrd_pose_1', 'lasrSwrd_pose_2', 'lasrSwrd_pose_3']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'lasr_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'lasr_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-lasr-sword-02.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 0.0
        },
        worldImg: {
            sprite: 'lasr-sword-02.img',
            pos: { x: 110.0, y: -2.0 },
            rot: 0.0,
            scale: { x: 0.15, y: 0.15 },
            tint: 0xffffff,
            leftHandOntop: true
        },
        reflectArea: {
            offset: { x: 1.75, y: 0.0 },
            rad: 1.1
        }
    },

    'lasr_swrd_03': {
        name: 'Lasr Swrd',
        type: 'melee',
        quality: 0,
        armorPiercing: true,
        noPotatoSwap: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 60.0,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.75, y: 0.0 },
            rad: 2.1,
            damageTimes: [0.3],
            cooldownTime: 0.6,
            poseTime: 0.2
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeLasrSwrd',
            attackAnims: ['lasrSwrdSwing'],
            poseAnims: ['lasrSwrd_pose_1', 'lasrSwrd_pose_2', 'lasrSwrd_pose_3']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'lasr_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'lasr_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-lasr-sword-03.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 0.0
        },
        worldImg: {
            sprite: 'lasr-sword-03.img',
            pos: { x: 110.0, y: -2.0 },
            rot: 0.0,
            scale: { x: 0.15, y: 0.15 },
            tint: 0xffffff,
            leftHandOntop: true
        },
        reflectArea: {
            offset: { x: 1.75, y: 0.0 },
            rad: 1.1
        }
    },

    'naginata': {
        name: 'Naginata',
        type: 'melee',
        quality: 1,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 56.0,
        obstacleDamage: 1.92,
        headshotMult: 1.0,
        attack: {
            offset: { x: 3.5, y: 0.0 },
            rad: 2.0,
            damageTimes: [0.27],
            cooldownTime: 0.54
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeNaginata',
            attackAnims: ['naginataSwing']
        },
        sound: {
            pickup: 'heavy_pickup_01',
            swing: 'heavy_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'axe_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-naginata.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 2.35619
        },
        worldImg: {
            sprite: 'loot-melee-naginata.img',
            pos: { x: 42.5, y: -3.0 },
            rot: 1.9,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff,
            leftHandOntop: true
        }
    },
    'stonehammer': {
        name: 'Stone Hammer',
        type: 'melee',
        quality: 1,
        armorPiercing: true,
        stonePiercing: true,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 60.0,
        obstacleDamage: 1.92,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.35, y: 0.0 },
            rad: 1.25,
            damageTimes: [0.25],
            cooldownTime: 0.5
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'meleeTwoHanded',
            attackAnims: ['hammerSwing']
        },
        sound: {
            pickup: 'heavy_pickup_01',
            swing: 'heavy_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'hammer_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-stonehammer.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            mirror: true,
            rot: 2.35619
        },
        worldImg: {
            sprite: 'loot-melee-stonehammer.img',
            pos: { x: -12.5, y: -4.0 },
            rot: 1.2,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff,
            leftHandOntop: true
        }
    },
    'hook': {
        name: 'Hook',
        type: 'melee',
        quality: 1,
        autoAttack: true,
        switchDelay: 0.25,
        damage: 18.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        attack: {
            offset: { x: 1.5, y: 0.0 },
            rad: 1.0,
            damageTimes: [0.075],
            cooldownTime: 0.175
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['hook']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'hook_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-hook-silver.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-hook-silver.img',
            pos: { x: 0.0, y: -27.0 },
            rot: Math.PI * 0.5,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff,
            renderOnHand: true
        }
    },
    'pan': {
        name: 'Pan',
        type: 'melee',
        quality: 1,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 60.0,
        obstacleDamage: 0.8,
        headshotMult: 1.0,
        attack: {
            offset: { x: 2.0, y: 0.0 },
            rad: 1.5,
            damageTimes: [0.15],
            cooldownTime: 0.5
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['pan']
        },
        sound: {
            pickup: 'pan_pickup_01',
            swing: 'heavy_swing_01',
            deploy: 'pan_pickup_01',
            playerHit: 'pan_hit_01',
            bullet: 'pan_bullet'
        },
        lootImg: {
            sprite: 'loot-melee-pan-black.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: -0.785
        },
        worldImg: {
            sprite: 'loot-melee-pan-black-side.img',
            pos: { x: 0.0, y: -40.0 },
            rot: 1.125,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        },
        hipImg: {
            sprite: 'loot-melee-pan-black-side.img',
            pos: { x: -17.25, y: 7.5 },
            rot: Math.PI * 0.78,
            scale: { x: 0.3, y: 0.3 },
            tint: 0xffffff
        },
        reflectSurface: {
            equipped: { p0: { x: 2.65, y: -0.125 }, p1: { x: 1.35, y: -0.74 } },
            unequipped: { p0: { x: -0.625, y: -1.2 }, p1: { x: -1.4, y: -0.25 } }
        }
    },
    'spade': {
        name: 'Spade',
        type: 'melee',
        quality: 1,
        cleave: false,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 40.0,
        obstacleDamage: 1.0,
        headshotMult: 1.0,
        noPotatoSwap: true,
        attack: {
            offset: { x: 1.75, y: 0.0 },
            rad: 1.5,
            damageTimes: [0.12],
            cooldownTime: 0.35
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['cut', 'thrust']
        },
        sound: {
            pickup: 'heavy_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'spade_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-spade-assault.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-spade-assault.img',
            pos: { x: -0.5, y: -41.5 },
            rot: 1.0,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    },
    'crowbar': {
        name: 'Crowbar',
        type: 'melee',
        quality: 1,
        cleave: false,
        autoAttack: false,
        switchDelay: 0.25,
        damage: 33.0,
        obstacleDamage: 1.4,
        headshotMult: 1.0,
        noPotatoSwap: true,
        attack: {
            offset: { x: 1.25, y: 0.0 },
            rad: 1.25,
            damageTimes: [0.12],
            cooldownTime: 0.3
        },
        speed: {
            equip: 1.0
        },
        anim: {
            idlePose: 'fists',
            attackAnims: ['cut', 'cutReverseShort']
        },
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-melee-crowbar-scout.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-02.img',
            borderTint: 0xffffff,
            scale: 0.3,
            rot: 0.785
        },
        worldImg: {
            sprite: 'loot-melee-crowbar-scout.img',
            pos: { x: -1.0, y: -10.0 },
            rot: 1.0,
            scale: { x: 0.35, y: 0.35 },
            tint: 0xffffff
        }
    }
};

var SkinDefs = {
    // Fists
    'fists': defineSkin('fists', {
        name: 'Fists',
        rarity: 0,
        lore: 'The old one-two.',
        isSkin: true
    }),

    'red_gloves': defineSkin('fists', {
        name: 'Red Gloves',
        rarity: 0, //4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-red-gloves.img'
        },
        handSprites: {
            spriteL: 'player-fists-gloves-01.img',
            spriteR: 'player-fists-gloves-02.img'
        },
        scale: {
            x: 0.185,
            y: 0.185
        },
        isSkin: true
    }),

    'feral_gloves': defineSkin('fists', {
        name: 'Feral Claws',
        rarity: 0, //4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-feral-claws.img'
        },
        handSprites: {
            spriteL: 'player-fists-feral-claws.img',
            spriteR: 'player-fists-feral-claws.img'
        },
        scale: {
            x: 0.19,
            y: 0.19
        },
        isSkin: true
    }),

    'crab_gloves': defineSkin('fists', {
        name: 'Crab Claws',
        rarity: 0, //4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-crab-tongs.img'
        },
        handSprites: {
            spriteL: 'player-fists-crab-tongs-01.img',
            spriteR: 'player-fists-crab-tongs-02.img'
        },
        scale: {
            x: 0.185,
            y: 0.185
        },
        isSkin: true
    }),

    'fist_split': defineSkin('fists', {
        name: 'Split the diff',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-SpliTheDiff.img'
        },
        handSprites: {
            spriteL: 'player-hands-SpliTheDiff.img',
            spriteR: 'player-hands-SpliTheDiff.img'
        },
        isSkin: true
    }),

    'fist_blueVelvet': defineSkin('fists', {
        name: 'Blue Velvet',
        rarity: 1,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-BlueVelvet.img'
        },
        handSprites: {
            spriteL: 'player-hands-BlueVelvet.img',
            spriteR: 'player-hands-BlueVelvet.img'
        },
        isSkin: true
    }),

    'fist_frostpunch': defineSkin('fists', {
        name: 'Frostpunch',
        rarity: 4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-FrostPunch.img'
        },
        handSprites: {
            spriteL: 'player-hands-FrostPunch.img',
            spriteR: 'player-hands-FrostPunch.img'
        },
        scale: {
            x: 0.19,
            y: 0.19
        },
        isSkin: true
    }),

    'fist_immolate': defineSkin('fists', {
        name: 'Immolate',
        rarity: 1,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-immolate.img'
        },
        handSprites: {
            spriteL: 'player-hands-immolate.img',
            spriteR: 'player-hands-immolate.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_bulletbills': defineSkin('fists', {
        name: 'Bullet Bills',
        rarity: 1,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-bulletbills.img'
        },
        handSprites: {
            spriteL: 'player-hands-bulletbills.img',
            spriteR: 'player-hands-bulletbills.img'
        },
        isSkin: true
    }),

    'fist_moss': defineSkin('fists', {
        name: 'Moss',
        rarity: 1,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-moss.img'
        },
        handSprites: {
            spriteL: 'player-hands-moss.img',
            spriteR: 'player-hands-moss.img'
        },
        isSkin: true
    }),

    'fist_blackholes': defineSkin('fists', {
        name: 'Black Holes',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-blackholes.img'
        },
        handSprites: {
            spriteL: 'player-hands-blackholes.img',
            spriteR: 'player-hands-blackholes.img'
        },
        isSkin: true,
        lore: 'Created by Shad0wy_F1gure'
    }),

    'fist_rainbowhands': defineSkin('fists', {
        name: 'Rainbow Hands',
        rarity: 3,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-rainbowhands.img'
        },
        handSprites: {
            spriteL: 'player-hands-rainbowhands.img',
            spriteR: 'player-hands-rainbowhands.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_darklets': defineSkin('fists', {
        name: 'Darklets',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-darklets.img'
        },
        handSprites: {
            spriteL: 'player-hands-darklets.img',
            spriteR: 'player-hands-darklets.img'
        },
        isSkin: true
    }),

    'fist_scifi': defineSkin('fists', {
        name: 'Scifi',
        rarity: 3,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-scifi.img'
        },
        handSprites: {
            spriteL: 'player-hands-scifi.img',
            spriteR: 'player-hands-scifi.img'
        },
        isSkin: true
    }),

    'fist_poke': defineSkin('fists', {
        name: 'Poke',
        rarity: 4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-poke.img'
        },
        handSprites: {
            spriteL: 'player-hands-poke.img',
            spriteR: 'player-hands-poke.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_paws': defineSkin('fists', {
        name: 'Paws',
        rarity: 4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-paws.img'
        },
        handSprites: {
            spriteL: 'player-hands-paws.img',
            spriteR: 'player-hands-paws.img'
        },
        isSkin: true
    }),

    'fist_dinoclaws': defineSkin('fists', {
        name: 'Dino Claws',
        rarity: 4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-dinoclaws.img'
        },
        handSprites: {
            spriteL: 'player-hands-dinoclaws.img',
            spriteR: 'player-hands-dinoclaws.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_leaf': defineSkin('fists', {
        name: 'Leaf',
        rarity: 3,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-leaf.img'
        },
        handSprites: {
            spriteL: 'player-hands-leaf-left.img',
            spriteR: 'player-hands-leaf-right.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_ranger': defineSkin('fists', {
        name: 'Ranger',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-ranger.img'
        },
        handSprites: {
            spriteL: 'player-hands-ranger.img',
            spriteR: 'player-hands-ranger.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_linedUp': defineSkin('fists', {
        name: 'Lined Up',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-linedUp.img'
        },
        handSprites: {
            spriteL: 'player-hands-linedUp.img',
            spriteR: 'player-hands-linedUp.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_lit': defineSkin('fists', {
        name: 'Lit',
        rarity: 1,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-lit.img'
        },
        handSprites: {
            spriteL: 'player-hands-lit-left.img',
            spriteR: 'player-hands-lit-right.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_gift_punch': defineSkin('fists', {
        name: 'Gift Punch',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-gift-punch-fists.img'
        },
        handSprites: {
            spriteL: 'player-fists-gift-puch.img',
            spriteR: 'player-fists-gift-puch.img'
        },
        isSkin: true,
        lore: ''
    }),

    'fist_ember': defineSkin('fists', {
        name: 'Ember',
        rarity: 1,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-ember-fists.img'
        },
        handSprites: {
            spriteL: 'player-fists-ember-l.img',
            spriteR: 'player-fists-ember-r.img'
        },
        isSkin: true,
        lore: ''
    }),

    'fist_santa': defineSkin('fists', {
        name: 'Santa Mittens',
        rarity: 2,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-santa-fists.img'
        },
        handSprites: {
            spriteL: 'player-fists-santa-l.img',
            spriteR: 'player-fists-santa-r.img'
        },
        isSkin: true,
        lore: ''
    }),

    'fist_purptog': defineSkin('fists', {
        name: 'Purptog',
        rarity: 3,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-purptog-fists.img'
        },
        handSprites: {
            spriteL: 'player-fists-purptog.img',
            spriteR: 'player-fists-purptog.img'
        },
        isSkin: true,
        lore: ''
    }),

    'fist_golden_lobster': defineSkin('fists', {
        name: 'Golden Lobster',
        rarity: 4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-golden-lobster-fists.img'
        },
        handSprites: {
            spriteL: 'player-fists-golden-lobster-l.img',
            spriteR: 'player-fists-golden-lobster-r.img'
        },
        isSkin: true,
        lore: ''
    }),

    'fist_pineFury': defineSkin('fists', {
        name: 'Pine Fury',
        rarity: 4,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-pineFury.img'
        },
        handSprites: {
            spriteL: 'player-hands-pineFury-left.img',
            spriteR: 'player-hands-pineFury-right.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_dreidel': defineSkin('fists', {
        name: 'Dreidel',
        rarity: 3,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-dreidel.img'
        },
        handSprites: {
            spriteL: 'player-hands-dreidel-left.img',
            spriteR: 'player-hands-dreidel-right.img'
        },
        flip: true,
        isSkin: true
    }),

    'fist_bePresent': defineSkin('fists', {
        name: 'Be Present',
        rarity: 3,
        noPotatoSwap: true,
        lootImg: {
            sprite: 'loot-melee-bePresent.img'
        },
        handSprites: {
            spriteL: 'player-hands-bePresent-left.img',
            spriteR: 'player-hands-bePresent-right.img'
        },
        flip: true,
        isSkin: true
    }),

    // Knuckles
    'knuckles_rusted': defineSkin('knuckles', {
        name: 'Knuckles Rusted',
        rarity: 1,
        lore: 'Rust up for the dust up.',
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-knuckles-rusted.img'
        },
        worldImg: {
            sprite: 'loot-melee-knuckles-rusted.img'
        },
        isSkin: true
    }),
    'knuckles_heroic': defineSkin('knuckles', {
        name: 'Knuckles Heroic',
        rarity: 4,
        lore: "Give 'em a hero sandwich.",
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-knuckles-heroic.img'
        },
        worldImg: {
            sprite: 'loot-melee-knuckles-heroic.img'
        },
        isSkin: true
    }),

    // Karambit
    'karambit_rugged': defineSkin('karambit', {
        name: 'Karambit Rugged',
        rarity: 3,
        noPotatoSwap: false,
        anim: {
            idlePose: 'slash',
            attackAnims: ['slash', 'fists']
        },
        lootImg: {
            sprite: 'loot-melee-karambit-rugged.img'
        },
        worldImg: {
            sprite: 'loot-melee-karambit-rugged.img'
        },
        isSkin: true
    }),
    'karambit_prismatic': defineSkin('karambit', {
        name: 'Karambit Prismatic',
        rarity: 4,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-karambit-prismatic.img'
        },
        worldImg: {
            sprite: 'loot-melee-karambit-prismatic.img'
        },
        isSkin: true
    }),
    'karambit_drowned': defineSkin('karambit', {
        name: 'Karambit Drowned',
        rarity: 4,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-karambit-drowned.img'
        },
        worldImg: {
            sprite: 'loot-melee-karambit-drowned.img'
        },
        isSkin: true
    }),

    // Bayonet
    'bayonet_rugged': defineSkin('bayonet', {
        name: 'Bayonet Rugged',
        rarity: 3,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-bayonet-rugged.img'
        },
        worldImg: {
            sprite: 'loot-melee-bayonet-rugged.img'
        },
        isSkin: true
    }),
    'bayonet_woodland': defineSkin('bayonet', {
        name: 'Bayonet Woodland',
        rarity: 5,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-bayonet-woodland.img'
        },
        worldImg: {
            sprite: 'loot-melee-bayonet-woodland.img'
        },
        isSkin: true
    }),

    // Huntsman
    'huntsman_rugged': defineSkin('huntsman', {
        name: 'Huntsman Rugged',
        rarity: 3,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-huntsman-rugged.img'
        },
        worldImg: {
            sprite: 'loot-melee-huntsman-rugged.img'
        },
        isSkin: true
    }),
    'huntsman_burnished': defineSkin('huntsman', {
        name: 'Huntsman Burnished',
        rarity: 4,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-huntsman-burnished.img'
        },
        worldImg: {
            sprite: 'loot-melee-huntsman-burnished.img'
        },
        isSkin: true
    }),

    // Bowie
    'bowie_vintage': defineSkin('bowie', {
        name: 'Bowie Vintage',
        rarity: 3,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-bowie-vintage.img'
        },
        worldImg: {
            sprite: 'loot-melee-bowie-vintage.img'
        },
        isSkin: true
    }),
    'bowie_frontier': defineSkin('bowie', {
        name: 'Bowie Frontier',
        rarity: 4,
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-bowie-frontier.img'
        },
        worldImg: {
            sprite: 'loot-melee-bowie-frontier.img'
        },
        isSkin: true
    }),

    // Machete
    'machete_taiga': defineSkin('machete', {
        name: 'UVSR Taiga',
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-machete-taiga.img'
        },
        worldImg: {
            sprite: 'loot-melee-machete-taiga.img'
        },
        isSkin: true
    }),
    'kukri_trad': defineSkin('machete', {
        name: "Tallow's Kukri",
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-kukri-trad.img'
        },
        worldImg: {
            sprite: 'loot-melee-kukri-trad.img',
            pos: { x: -0.5, y: -46.5 }
        },
        isSkin: true
    }),

    // Saw
    'bonesaw_rusted': defineSkin('saw', {
        name: 'Bonesaw Rusted',
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-bonesaw-rusted.img'
        },
        worldImg: {
            sprite: 'loot-melee-bonesaw-rusted.img'
        },
        isSkin: true
    }),

    // Woodaxe
    'woodaxe_bloody': defineSkin('woodaxe', {
        name: 'Axe Bloodstained',
        lootImg: {
            sprite: 'loot-melee-woodaxe-bloody.img'
        },
        worldImg: {
            sprite: 'loot-melee-woodaxe-bloody.img'
        },
        isSkin: true
    }),

    // Katana
    'katana_rusted': defineSkin('katana', {
        name: 'Katana Rusted',
        lootImg: {
            sprite: 'loot-melee-katana-rusted.img'
        },
        worldImg: {
            sprite: 'loot-melee-katana-rusted.img'
        },
        isSkin: true
    }),
    'katana_orchid': defineSkin('katana', {
        name: 'Katana Orchid',
        quality: 1,
        lootImg: {
            sprite: 'loot-melee-katana-orchid.img'
        },
        worldImg: {
            sprite: 'loot-melee-katana-orchid.img'
        },
        isSkin: true
    }),

    // Stonehammer
    'sledgehammer': defineSkin('stonehammer', {
        name: 'Sledgehammer',
        lootImg: {
            sprite: 'loot-melee-sledgehammer.img'
        },
        worldImg: {
            sprite: 'loot-melee-sledgehammer.img',
            pos: { x: -12.5, y: -3.5 }
        },
        isSkin: true
    }),

    // Class weapons
    'crowbar_scout': defineSkin('crowbar', {
        name: 'Scouting Crowbar',
        noPotatoSwap: false,
        isSkin: true
    }),
    'crowbar_recon': defineSkin('crowbar', {
        name: 'Crowbar Carbon',
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-crowbar-recon.img'
        },
        worldImg: {
            sprite: 'loot-melee-crowbar-recon.img'
        },
        isSkin: true
    }),
    'kukri_sniper': defineSkin('machete', {
        name: "Marksman's Recurve",
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-kukri-sniper.img'
        },
        worldImg: {
            sprite: 'loot-melee-kukri-sniper.img',
            pos: { x: -0.5, y: -46.5 }
        },
        isSkin: true
    }),
    'bonesaw_healer': defineSkin('saw', {
        name: 'The Separator',
        noPotatoSwap: false,
        lootImg: {
            sprite: 'loot-melee-bonesaw-healer.img'
        },
        worldImg: {
            sprite: 'loot-melee-bonesaw-healer.img'
        },
        isSkin: true
    }),
    'katana_demo': defineSkin('katana', {
        name: 'Hakai no Katana',
        lootImg: {
            sprite: 'loot-melee-katana-demo.img'
        },
        worldImg: {
            sprite: 'loot-melee-katana-demo.img'
        },
        isSkin: true
    }),
    'spade_assault': defineSkin('spade', {
        name: 'Trench Spade',
        noPotatoSwap: false,
        isSkin: true
    }),
    'warhammer_tank': defineSkin('stonehammer', {
        name: 'Panzerhammer',
        damage: 64.0,
        attack: {
            offset: { x: 1.5, y: 0.0 },
            rad: 1.75,
            damageTimes: [0.3],
            cooldownTime: 0.6
        },
        lootImg: {
            sprite: 'loot-melee-warhammer-tank.img'
        },
        worldImg: {
            sprite: 'loot-melee-warhammer-tank.img',
            pos: { x: -10.5, y: -3.0 }
        },
        isSkin: true
    })
};

var MeleeDefs = util.mergeDeep({}, BaseDefs, SkinDefs);
module.exports = MeleeDefs;
