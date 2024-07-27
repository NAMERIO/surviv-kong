"use strict";


var util = require("./util.js");
var collider = require("./collider.js");
var TrapsEnum = require("./trapsEnum.js");
var SkillsEnum = require("./skillsEnum.js");

var _require = require("./cb7a977d.js"),
    WeaponAttackType = _require.WeaponAttackType;

/**Default loot container scale 1.4
 * Default loot sprite scale 1.0
 * Params scale:1.4
 *        innerScale: 1.0
 */


var RangeWeapons = {

    /// --- STAFFS  --- ///

    'staff_elderwood': {
        attackType: WeaponAttackType.Magic,
        id: 'staff_elderwood',
        name: 'Elderwood',
        type: 'gun',
        rarity: 'common',
        weapType: 'staff_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 7.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Orb Shot',
                bulletType: 'staff_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/light',
                    animDuration: 0.4167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Orb Shot',
                bulletType: 'staff_projectile_heavy_1', // Default bullet type
                cooldownTime: 0.25,
                shootDelay: 0.2,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,

                //Behavior params
                behaviourParams: {
                    minBulletType: 1,
                    maxBulletType: 3, //Max amount of bullets sizes 
                    bulletTypes: ['staff_projectile_heavy_1', 'staff_projectile_heavy_2', 'staff_projectile_heavy_3'],
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/heavy',
                    animDuration: 0.58,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/staff/heavy_charge',
                    runChargeAnimName: 'attack/staff/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Frost Shard',
                bulletType: 'staff_test_projectile_skill_1',
                //projType: 'fire_shot',
                cooldownTime: 6.0,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.CombineAttack,
                useSpeedPenalty: -4.0,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.FrostOrb,
                    deployOnFinishAttack: false,
                    deployTime: 0.0,
                    trapParams: {
                        explosionType: 'explosion_staff_skill_1'
                    }
                },

                //Visuals
                icon: 'Icon_Staff_Frost_Shard.img',

                animationObj: {
                    animName: 'attack/staff/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    sound: {
                        name: 'sfx_weapons_staff_frost_orb',
                        start: 0.133
                    },
                    track: 0,
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Staff_Light_Attack.img',
        heavyAttackIcon: 'Icon_Staff_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/staffs/staff_elderwood',
        lootImg: {
            sprite: 'loot-staff_elderwood.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'staff_ash': {
        attackType: WeaponAttackType.Magic,
        id: 'staff_ash',
        name: 'Ash',
        type: 'gun',
        rarity: 'rare',
        weapType: 'staff_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 10,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Orb Shot',
                bulletType: 'staff_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/light',
                    animDuration: 0.4167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Orb Shot',
                bulletType: 'staff_projectile_heavy_1', // Default bullet type
                cooldownTime: 0.25,
                shootDelay: 0.2,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,

                //Behavior params
                behaviourParams: {
                    minBulletType: 1,
                    maxBulletType: 3, //Max amount of bullets sizes 
                    bulletTypes: ['staff_projectile_heavy_1', 'staff_projectile_heavy_2', 'staff_projectile_heavy_3'],
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/heavy',
                    animDuration: 0.58,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/staff/heavy_charge',
                    runChargeAnimName: 'attack/staff/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Frost Shard',
                bulletType: 'staff_test_projectile_skill_1',
                //projType: 'fire_shot',
                cooldownTime: 6.0,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.CombineAttack,
                useSpeedPenalty: -4.0,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.FrostOrb,
                    deployOnFinishAttack: false,
                    deployTime: 0.0,
                    trapParams: {
                        explosionType: 'explosion_staff_skill_1'
                    }
                },

                //Visuals
                icon: 'Icon_Staff_Frost_Shard.img',

                animationObj: {
                    animName: 'attack/staff/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    sound: {
                        name: 'sfx_weapons_staff_frost_orb',
                        start: 0.133
                    },
                    track: 0,
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Trail of Orbs',
                cooldownTime: 10.0,
                numBullets: 8,
                shootDelay: 0,
                duration: 6,
                width: 4,
                height: 4,

                behaviourId: SkillsEnum.ThrowablesAttack,

                //Behavior params
                behaviourParams: {
                    throwableDurationDelay: 0.5,
                    throwableId: 'spark',
                    lifeTime: 15
                },

                damageTimes: [0.25],

                offset: {
                    x: 0,
                    y: 0
                },

                //Visuals
                icon: 'Icon_Staff_Trail_Of_Orbs.img',
                animationObj: {
                    animName: 'attack/staff/skill_02',
                    animDuration: 0.9167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_trail_of_orbs',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Staff_Light_Attack.img',
        heavyAttackIcon: 'Icon_Staff_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/staffs/staff_ash',
        lootImg: {
            sprite: 'loot-staff_ash.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'staff_wickedgnarl': {
        attackType: WeaponAttackType.Magic,
        id: 'staff_wickedgnarl',
        name: 'Wicked Gnarl',
        type: 'gun',
        rarity: 'epic',
        weapType: 'staff_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 13.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Orb Shot',
                bulletType: 'staff_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/light',
                    animDuration: 0.4167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Orb Shot',
                bulletType: 'staff_projectile_heavy_1', // Default bullet type
                cooldownTime: 0.25,
                shootDelay: 0.2,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,

                //Behavior params
                behaviourParams: {
                    minBulletType: 1,
                    maxBulletType: 3, //Max amount of bullets sizes 
                    bulletTypes: ['staff_projectile_heavy_1', 'staff_projectile_heavy_2', 'staff_projectile_heavy_3'],
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/heavy',
                    animDuration: 0.58,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/staff/heavy_charge',
                    runChargeAnimName: 'attack/staff/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Frost Shard',
                bulletType: 'staff_test_projectile_skill_1',
                //projType: 'fire_shot',
                cooldownTime: 6.0,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.CombineAttack,
                useSpeedPenalty: -4.0,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.FrostOrb,
                    deployOnFinishAttack: false,
                    deployTime: 0.0,
                    trapParams: {
                        explosionType: 'explosion_staff_skill_1'
                    }
                },

                //Visuals
                icon: 'Icon_Staff_Frost_Shard.img',

                animationObj: {
                    animName: 'attack/staff/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    sound: {
                        name: 'sfx_weapons_staff_frost_orb',
                        start: 0.133
                    },
                    track: 0,
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Trail of Orbs',
                cooldownTime: 10.0,
                numBullets: 8,
                shootDelay: 0,
                duration: 6,
                width: 4,
                height: 4,

                behaviourId: SkillsEnum.ThrowablesAttack,

                //Behavior params
                behaviourParams: {
                    throwableDurationDelay: 0.5,
                    throwableId: 'spark',
                    lifeTime: 15
                },

                damageTimes: [0.25],

                offset: {
                    x: 0,
                    y: 0
                },

                //Visuals
                icon: 'Icon_Staff_Trail_Of_Orbs.img',
                animationObj: {
                    animName: 'attack/staff/skill_02',
                    animDuration: 0.9167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_trail_of_orbs',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Volatile Surge',
                cooldownTime: 12.0,
                freeDirectionWhileAttacking: true,

                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 6.0,
                    duration: 1.1,
                    effects: [{
                        name: 'm_movePlayerEffect',
                        chance: 1,

                        needExtraParams: true,
                        params: {
                            speed: 8.0
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/staff/volatile_surge',
                        pivot: {
                            x: 0.0,
                            y: 0.0
                        }
                    },
                    worldImg: {
                        sprite: 'part-pulse-circle-02.img',
                        scale: 1.0,
                        tint: 0xFFFFFF,
                        auraScale: 0.1
                    },
                    exploteThrowables: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Staff_Volatile_Surge.img',
                animationObj: {
                    animName: 'attack/staff/skill_03',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_volatile_surge',
                        start: 0.133
                    },
                    useCursorDirection: true
                },

                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Staff_Light_Attack.img',
        heavyAttackIcon: 'Icon_Staff_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/staffs/staff_wickedgnarl',
        lootImg: {
            sprite: 'loot-staff_wickedgnarl.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },

    /// --- BOWS --- ///

    'bow_spiritshot': {
        attackType: WeaponAttackType.Piercing,
        id: 'bow_spiritshot',
        name: 'Spirit Shot',
        type: 'gun',
        rarity: 'common',
        weapType: 'bow_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 7.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0,
            attack: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Arrow Shot',
                bulletType: 'bow_projectile_light',
                cooldownTime: 0.5,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -8.0,

                damageTimes: [0.25],

                //Visuals
                attackStartTime: 0.4, //Anticipation
                animationObj: {
                    animName: 'attack/bow/light',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    onStopUpdateDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Charged Arrow Shot',
                bulletType: 'bow_projectile_heavy',
                cooldownTime: 0.5,
                numBullets: 1,
                holdSpeedPenalty: -8.0,
                cancelable: true,

                behaviourId: SkillsEnum.VariableDamageRange,
                useSpeedPenalty: -10.0,

                //Behavior params
                behaviourParams: {
                    minDamage: 10,
                    maxDamage: 25,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3,
                    changeZoomWhileCharging: true,
                    maxZoomRadius: 45
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.25],

                //Visuals
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/bow/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/bow/heavy_charge',
                    runChargeAnimName: 'attack/bow/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0.0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Net Trap',
                cooldownTime: 10.0,
                inmobilizeWhileExecutingSkill: true,
                useSpeedPenalty: -10.0,

                behaviourId: SkillsEnum.DeployTrap,

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.InmobilizePlayer,
                    deployOnFinishAttack: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Net_Trap.img',
                animationObj: {
                    animName: 'attack/bow/skill_01',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_trap_plant_loop',
                        start: 0.0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            }
        },

        //FXs
        icon: 'Icon_Bow_Light_Attack.img',
        heavyAttackIcon: 'Icon_Bow_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/bows/bow_spiritshot',
        lootImg: {
            sprite: 'loot-bow_spiritshot.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'bow_longbow': {
        attackType: WeaponAttackType.Piercing,
        id: 'bow_longbow',
        name: 'Longbow',
        type: 'gun',
        rarity: 'rare',
        weapType: 'bow_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 10.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0,
            attack: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Arrow Shot',
                bulletType: 'bow_projectile_light',
                cooldownTime: 0.5,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -8.0,

                damageTimes: [0.25],

                //Visuals
                attackStartTime: 0.4, //Anticipation
                animationObj: {
                    animName: 'attack/bow/light',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    onStopUpdateDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Charged Arrow Shot',
                bulletType: 'bow_projectile_heavy',
                cooldownTime: 0.5,
                numBullets: 1,
                holdSpeedPenalty: -8.0,
                cancelable: true,

                behaviourId: SkillsEnum.VariableDamageRange,
                useSpeedPenalty: -10.0,

                //Behavior params
                behaviourParams: {
                    minDamage: 10,
                    maxDamage: 25,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3,
                    changeZoomWhileCharging: true,
                    maxZoomRadius: 45
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.25],

                //Visuals
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/bow/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/bow/heavy_charge',
                    runChargeAnimName: 'attack/bow/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0.0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Net Trap',
                cooldownTime: 10.0,
                inmobilizeWhileExecutingSkill: true,
                useSpeedPenalty: -10.0,

                behaviourId: SkillsEnum.DeployTrap,

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.InmobilizePlayer,
                    deployOnFinishAttack: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Net_Trap.img',
                animationObj: {
                    animName: 'attack/bow/skill_01',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_trap_plant_loop',
                        start: 0.0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Quick Shot',
                cooldownTime: 10.0,
                useSpeedPenalty: 0.0,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                dash: {
                    preAttack: true,
                    distance: 15,
                    duration: 0.25,
                    animate: true
                },

                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_chargeHeavyAttack'
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.009],

                //Visuals
                icon: 'Icon_Bow_Quick_Shot.img',
                animationObj: {
                    animName: 'attack/bow/skill_02',
                    animDuration: 0.1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_quick_shot',
                        start: 0.0
                    }
                },
                telegraph: {
                    type: 'arrow'
                }
            }
        },

        //FXs
        icon: 'Icon_Bow_Light_Attack.img',
        heavyAttackIcon: 'Icon_Bow_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/bows/bow_longbow',
        lootImg: {
            sprite: 'loot-bow_longbow.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'bow_markflight': {
        attackType: WeaponAttackType.Piercing,
        id: 'bow_markflight',
        name: 'Markflight',
        type: 'gun',
        rarity: 'epic',
        weapType: 'bow_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 13.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0,
            attack: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Arrow Shot',
                bulletType: 'bow_projectile_light',
                cooldownTime: 0.5,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -8.0,

                damageTimes: [0.25],

                //Visuals
                attackStartTime: 0.4, //Anticipation
                animationObj: {
                    animName: 'attack/bow/light',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    onStopUpdateDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Charged Arrow Shot',
                bulletType: 'bow_projectile_heavy',
                cooldownTime: 0.5,
                numBullets: 1,
                holdSpeedPenalty: -8.0,
                cancelable: true,

                behaviourId: SkillsEnum.VariableDamageRange,
                useSpeedPenalty: -10.0,

                //Behavior params
                behaviourParams: {
                    minDamage: 10,
                    maxDamage: 25,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3,
                    changeZoomWhileCharging: true,
                    maxZoomRadius: 45
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.25],

                //Visuals
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/bow/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/bow/heavy_charge',
                    runChargeAnimName: 'attack/bow/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0.0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Net Trap',
                cooldownTime: 10.0,
                inmobilizeWhileExecutingSkill: true,
                useSpeedPenalty: -10.0,

                behaviourId: SkillsEnum.DeployTrap,

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.InmobilizePlayer,
                    deployOnFinishAttack: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Net_Trap.img',
                animationObj: {
                    animName: 'attack/bow/skill_01',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_trap_plant_loop',
                        start: 0.0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Quick Shot',
                cooldownTime: 10.0,
                useSpeedPenalty: 0.0,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                dash: {
                    preAttack: true,
                    distance: 15,
                    duration: 0.25,
                    animate: true
                },

                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_chargeHeavyAttack'
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.009],

                //Visuals
                icon: 'Icon_Bow_Quick_Shot.img',
                animationObj: {
                    animName: 'attack/bow/skill_02',
                    animDuration: 0.1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_quick_shot',
                        start: 0.0
                    }
                },
                telegraph: {
                    type: 'arrow'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Piercing Shot',
                bulletType: 'bow_projectile_skill_3',
                cooldownTime: 14.0,
                numBullets: 1,
                shootDelay: 0.0,
                holdSpeedPenalty: -8.0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -10.0,

                //Selected skill params
                zoomRadius: 55,

                zoomInSpeed: 1.0,
                zoomOutSpeed: 2.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Piercing_Shot.img',
                attackStartTime: 0.266, //Anticipation
                animationObj: {
                    animName: 'attack/bow/skill_03',
                    animDuration: 0.533,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_piercing_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow'
                }
            }
        },

        //FXs
        icon: 'Icon_Bow_Light_Attack.img',
        heavyAttackIcon: 'Icon_Bow_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/bows/bow_markflight',
        lootImg: {
            sprite: 'loot-bow_markflight.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },

    /// --- WANDS --- ///

    'wand_stardust': {
        attackType: WeaponAttackType.Magic,
        id: 'wand_stardust',
        name: 'Stardust',
        type: 'gun',
        rarity: 'common',
        weapType: 'wand_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 7.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Burst Shot',
                bulletType: 'wand_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Spell Shot',
                bulletType: 'wand_projectile_heavy',
                cooldownTime: 0.25,
                shootDelay: 0.2,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,

                //Behavior params
                behaviourParams: {
                    minBullets: 1,
                    maxBullets: 5,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/heavy',
                    animDuration: 0.58, //0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/wand/heavy_charge',
                    runChargeAnimName: 'attack/wand/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Fan of Sparks',
                bulletType: 'wand_projectile_skill_1',
                cooldownTime: 6.0,
                numBullets: 5,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Wand_Fan_Of_Sparks.img',
                animationObj: {
                    animName: 'attack/wand/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_fan_sparks',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.25,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Wand_Light_Attack.img',
        heavyAttackIcon: 'Icon_Wand_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/wands/wand_stardust',
        lootImg: {
            sprite: 'loot-wand_stardust.img',
            tint: 0xffffff,
            //border: 'hexagon-frame-border.img',
            //borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'wand_phantomite': {
        attackType: WeaponAttackType.Magic,
        id: 'wand_phantomite',
        name: 'Phantomite',
        type: 'gun',
        rarity: 'rare',
        weapType: 'wand_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 10.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Burst Shot',
                bulletType: 'wand_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Spell Shot',
                bulletType: 'wand_projectile_heavy',
                cooldownTime: 0.25,
                shootDelay: 0.2,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minBullets: 1,
                    maxBullets: 5,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/heavy',
                    animDuration: 0.58, //0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/wand/heavy_charge',
                    runChargeAnimName: 'attack/wand/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Fan of Sparks',
                bulletType: 'wand_projectile_skill_1',
                cooldownTime: 6.0,
                numBullets: 5,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Wand_Fan_Of_Sparks.img',
                animationObj: {
                    animName: 'attack/wand/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_fan_sparks',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.25,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Teleport',
                bulletType: 'staff_projectile_skill_2',
                cooldownTime: 8.0,

                behaviourId: SkillsEnum.DeployTrap,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.StaticEnergyRing,
                    deployOnFinishAttack: false,
                    deployTime: 0.416

                    //Visuals
                    /*playAnimationWhenFinished: true,
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        startTime: 0.29,
                        finishTime: 0.36,
                        startAnim: 'weapons/wand/teleport',
                        finishAnim: 'weapons/wand/teleport',
                        skin: 'default',
                        scale: 1,
                        pivot: {
                            x: 13.0,
                            y: 0.0
                        }
                    },*/
                },

                dash: {
                    afterAttack: true,
                    distance: 20,
                    duration: 0.05,
                    animate: false,
                    cantMove: false
                },

                //Visuals
                icon: 'Icon_Wand_Teleport.img',
                animationObj: {
                    animName: 'attack/wand/skill_02',
                    animDuration: 0.666,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_teleport',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true,
                    seqId: "teleport_seq",
                    nextAnimations: [{
                        seqId: "teleport_seq",
                        animName: "attack/wand/skill_02_appear",
                        animDuration: 0.266,
                        loop: false,
                        track: 0,
                        sound: "",
                        fixedDirection: true
                    }]
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Wand_Light_Attack.img',
        heavyAttackIcon: 'Icon_Wand_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/wands/wand_phantomite',
        lootImg: {
            sprite: 'loot-wand_phantomite.img',
            tint: 0xffffff,
            //border: 'hexagon-frame-border.img',
            //borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'wand_aptitude': {
        attackType: WeaponAttackType.Magic,
        id: 'wand_aptitude',
        name: 'Aptitude Wand',
        type: 'gun',
        rarity: 'epic',
        weapType: 'wand_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 13.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Burst Shot',
                bulletType: 'wand_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Spell Shot',
                bulletType: 'wand_projectile_heavy',
                cooldownTime: 0.25,
                shootDelay: 0.2,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,

                //Behavior params
                behaviourParams: {
                    minBullets: 1,
                    maxBullets: 5,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/heavy',
                    animDuration: 0.58, //0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/wand/heavy_charge',
                    runChargeAnimName: 'attack/wand/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Fan of Sparks',
                bulletType: 'wand_projectile_skill_1',
                cooldownTime: 6.0,
                numBullets: 5,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Wand_Fan_Of_Sparks.img',
                animationObj: {
                    animName: 'attack/wand/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_fan_sparks',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.25,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Teleport',
                bulletType: 'staff_projectile_skill_2',
                cooldownTime: 8.0,

                behaviourId: SkillsEnum.DeployTrap,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.StaticEnergyRing,
                    deployOnFinishAttack: false,
                    deployTime: 0.416

                    //Visuals
                    /*playAnimationWhenFinished: true,
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        startTime: 0.29,
                        finishTime: 0.36,
                        startAnim: 'weapons/wand/teleport',
                        finishAnim: 'weapons/wand/teleport',
                        skin: 'default',
                        scale: 1,
                        pivot: {
                            x: 13.0,
                            y: 0.0
                        }
                    },*/
                },

                dash: {
                    afterAttack: true,
                    distance: 20,
                    duration: 0.05,
                    animate: false,
                    cantMove: false
                },

                //Visuals
                icon: 'Icon_Wand_Teleport.img',
                animationObj: {
                    animName: 'attack/wand/skill_02',
                    animDuration: 0.666,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_teleport',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true,
                    seqId: "teleport_seq",
                    nextAnimations: [{
                        seqId: "teleport_seq",
                        animName: "attack/wand/skill_02_appear",
                        animDuration: 0.266,
                        loop: false,
                        track: 0,
                        sound: "",
                        fixedDirection: true
                    }]
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Scorch',
                cooldownTime: 12.0,
                freeDirectionWhileAttacking: true,
                obstacleDamage: 1.5,

                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,
                useSpeedPenalty: -4.0,

                //Behaviour params
                behaviourParams: {
                    rad: 6.0,
                    duration: 1,
                    damage: 30,
                    effects: [{
                        name: 'm_burningEffect',
                        chance: 1,
                        params: {
                            damage: 0.015,
                            time: 5
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/wand/chilling_burst',
                        pivot: {
                            x: 0.0,
                            y: 0.0
                        }
                    }
                },

                //Visuals
                icon: 'Icon_Wand_Scorch.img',
                animationObj: {
                    animName: 'attack/wand/skill_03',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_scorch',
                        start: 0.133
                    },
                    useCursorDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            }
        },

        //FXs
        icon: 'Icon_Wand_Light_Attack.img',
        heavyAttackIcon: 'Icon_Wand_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/wands/wand_aptitude',
        lootImg: {
            sprite: 'loot-wand_aptitude.img',
            tint: 0xffffff,
            //border: 'hexagon-frame-border.img',
            //borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    }
};

var MeleeWeapons = {

    /// --- SWORDS & SHIELDS --- ///

    'sword_broadstrike': {
        attackType: WeaponAttackType.Slashing,
        id: 'sword_broadstrike',
        name: 'Broadstrike',
        type: 'melee',
        rarity: 'common',
        weapType: 'sword_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 7.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Slash',
                damage: 0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -1.0,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/light',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Slash',
                chargeDamage: true,
                width: 1.7,
                height: 2,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: -3.0,
                    maxDamage: 40.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/sword/heavy_charge',
                    runChargeAnimName: 'attack/sword/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shield Charge',
                damage: 15.0,
                width: 1,
                height: 2,
                cooldownTime: 4,

                behaviourId: SkillsEnum.DashAttackMelee,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    reflectAttacks: {
                        bulletSpeedMult: 3
                    }
                },

                dash: {
                    distance: 30,
                    duration: 1,
                    cantMove: true
                },

                //Status effects
                effects: [{ //Use effect to simulate knockback
                    name: 'm_movePlayerEffect',
                    chance: 1,
                    needExtraParams: true,
                    params: {
                        speed: 8,
                        duration: 1
                    }
                }],

                damageTimes: [{
                    start: 0,
                    end: 1
                }],

                //Visuals
                icon: 'Icon_Sword_Shield_Charge.img',
                animationObj: {
                    animName: 'attack/sword/skill_01',
                    animDuration: 1,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_shield_charge_loop',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Sword_Light_Attack.img',
        heavyAttackIcon: 'Icon_Sword_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/swords/sword_broadstrike',
        offHandSpineAsset: 'weapons/offhand/shields/shield_broadstrike',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-swordshield_broadstrike.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'sword_solitude': {
        attackType: WeaponAttackType.Slashing,
        id: 'sword_solitude',
        name: 'Solitude',
        type: 'melee',
        rarity: 'rare',
        weapType: 'sword_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 10.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Slash',
                damage: 0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -1.0,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/light',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Slash',
                chargeDamage: true,
                width: 1.7,
                height: 2,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: -3.0,
                    maxDamage: 40.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/sword/heavy_charge',
                    runChargeAnimName: 'attack/sword/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shield Charge',
                damage: 15.0,
                width: 1,
                height: 2,
                cooldownTime: 4,

                behaviourId: SkillsEnum.DashAttackMelee,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    reflectAttacks: {
                        bulletSpeedMult: 3
                    }
                },

                dash: {
                    distance: 30,
                    duration: 1,
                    cantMove: true
                },

                //Status effects
                effects: [{ //Use effect to simulate knockback
                    name: 'm_movePlayerEffect',
                    chance: 1,
                    needExtraParams: true,
                    params: {
                        speed: 8,
                        duration: 1
                    }
                }],

                damageTimes: [{
                    start: 0,
                    end: 1
                }],

                //Visuals
                icon: 'Icon_Sword_Shield_Charge.img',
                animationObj: {
                    animName: 'attack/sword/skill_01',
                    animDuration: 1,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_shield_charge_loop',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Iron Wall',
                damage: 5.0,
                width: 2,
                height: 1,
                cooldownTime: 10,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_shieldEffect',
                    reflectAttacks: true,
                    reflectedMeleeMult: 0.5,
                    statusEffectParams: {
                        duration: 3
                    }
                },

                damageTimes: [{
                    start: 0.0,
                    end: 0.45
                }],

                //Visuals
                icon: 'Icon_Sword_Iron_Wall.img',

                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Sword_Light_Attack.img',
        heavyAttackIcon: 'Icon_Sword_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/swords/sword_solitude',
        offHandSpineAsset: 'weapons/offhand/shields/shield_solitude',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-swordshield_solitude.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'sword_sunder': {
        attackType: WeaponAttackType.Slashing,
        id: 'sword_sunder',
        name: 'Sunder',
        type: 'melee',
        rarity: 'epic',
        weapType: 'sword_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 13.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Slash',
                damage: 0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 0.1,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -1.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/light',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Slash',
                chargeDamage: true,
                width: 1.7,
                height: 2,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: -3.0,
                    maxDamage: 40.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/sword/heavy_charge',
                    runChargeAnimName: 'attack/sword/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shield Charge',
                damage: 15.0,
                width: 1,
                height: 2,
                cooldownTime: 4,

                behaviourId: SkillsEnum.DashAttackMelee,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    reflectAttacks: {
                        bulletSpeedMult: 3
                    }
                },

                dash: {
                    distance: 30,
                    duration: 1,
                    cantMove: true
                },

                //Status effects
                effects: [{ //Use effect to simulate knockback
                    name: 'm_movePlayerEffect',
                    chance: 1,
                    needExtraParams: true,
                    params: {
                        speed: 8,
                        duration: 1
                    }
                }],

                damageTimes: [{
                    start: 0,
                    end: 1
                }],

                //Visuals
                icon: 'Icon_Sword_Shield_Charge.img',
                animationObj: {
                    animName: 'attack/sword/skill_01',
                    animDuration: 1,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_shield_charge_loop',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Iron Wall',
                damage: 5.0,
                width: 2,
                height: 1,
                cooldownTime: 10,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_shieldEffect',
                    reflectAttacks: true,
                    reflectedMeleeMult: 0.5,
                    statusEffectParams: {
                        duration: 3
                    }
                },

                damageTimes: [{
                    start: 0.0,
                    end: 0.45
                }],

                //Visuals
                icon: 'Icon_Sword_Iron_Wall.img',

                telegraph: {
                    type: 'circular'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Sundering Strike',
                damage: 20.0,
                gun: 'sword_gun',
                bulletType: 'bullet_sword',
                width: 2,
                height: 2,
                numBullets: 1,
                shootDelay: 0,
                cooldownTime: 9,

                behaviourId: SkillsEnum.RangeAttackSword,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 2,
                    y: 0
                },

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 1,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                damageTimes: [],

                //Visuals
                icon: 'Icon_Sword_Sundering_Strike.img',
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/sword/skill_03',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_sundering_strike',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            }
        },

        //FXs
        icon: 'Icon_Sword_Light_Attack.img',
        heavyAttackIcon: 'Icon_Sword_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/swords/sword_sunder',
        offHandSpineAsset: 'weapons/offhand/shields/shield_sunder',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-swordshield_sunder.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },

    /// --- AXES --- ///

    'axe_sever': {
        attackType: WeaponAttackType.Slashing,
        id: 'axe_sever',
        name: 'Sever',
        type: 'melee',
        rarity: 'common',
        weapType: 'axe_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.25,
        headshotMult: 1.0,
        baseDamage: 7.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Cleave',
                damage: 8.0,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.466,
                    end: 0.866
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/light',
                    animDuration: 0.866,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave',
                        start: 0.466
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Cleave',
                chargeDamage: true,
                width: 2,
                height: 3,
                cooldownTime: 0.5,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 10.0,
                    maxDamage: 50.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.4,
                    end: 0.8
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/heavy',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave_strong',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/axe/heavy_charge',
                    runChargeAnimName: 'attack/axe/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Leap',
                damage: 5.0,
                width: 2.7,
                height: 2.7,
                cooldownTime: 8,

                behaviourId: SkillsEnum.DashAttackWithAnticipation,

                //Default offset up
                offset: {
                    x: 2.5,
                    y: 0
                },

                offset_right: {
                    x: 2.5,
                    y: -1.5
                },

                offset_left: {
                    x: 2.5,
                    y: 1.5
                },

                //Behavior params
                dash: {
                    distance: 15,
                    duration: 0.234,
                    animate: false,
                    startAnimTime: 0.166,
                    cantMove: true
                },

                damageTimes: [{
                    start: 0.533,
                    end: 1.0
                }],

                //Visuals
                icon: 'Icon_Axe_Leap.img',
                animationObj: {
                    animName: 'attack/axe/skill_02',
                    animDuration: 1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_leap',
                        start: 0.3
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            }
        },

        //FXs
        icon: 'Icon_Axe_Light_Attack.img',
        heavyAttackIcon: 'Icon_Axe_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/axes/axe_sever',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-axe_sever.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true,
            scale: 1.0
            //rot: 1.0
        }
    },
    'axe_captainsedge': {
        attackType: WeaponAttackType.Slashing,
        id: 'axe_captainsedge',
        name: 'Captain\'s Edge',
        type: 'melee',
        rarity: 'rare',
        weapType: 'axe_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.25,
        headshotMult: 1.0,
        baseDamage: 10,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Cleave',
                damage: 8.0,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.466,
                    end: 0.866
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/light',
                    animDuration: 0.866,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave',
                        start: 0.466
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Cleave',
                chargeDamage: true,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 10.0,
                    maxDamage: 50.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.4,
                    end: 0.8
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/heavy',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave_strong',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/axe/heavy_charge',
                    runChargeAnimName: 'attack/axe/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Leap',
                damage: 5.0,
                width: 2.7,
                height: 2.7,
                cooldownTime: 8,

                behaviourId: SkillsEnum.DashAttackWithAnticipation,

                //Default offset up
                offset: {
                    x: 2.5,
                    y: 0
                },

                offset_right: {
                    x: 2.5,
                    y: -1.5
                },

                offset_left: {
                    x: 2.5,
                    y: 1.5
                },

                //Behavior params
                dash: {
                    distance: 15,
                    duration: 0.234,
                    animate: false,
                    startAnimTime: 0.166,
                    cantMove: true
                },

                damageTimes: [{
                    start: 0.533,
                    end: 1.0
                }],

                //Visuals
                icon: 'Icon_Axe_Leap.img',
                animationObj: {
                    animName: 'attack/axe/skill_02',
                    animDuration: 1.0,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_leap',
                        start: 0.3
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Crusher',
                damage: 0,
                width: 9,
                height: 9,
                cooldownTime: 10,

                behaviourId: SkillsEnum.CrusherAttack,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 0,
                    y: 0
                },

                //Behavior params
                pullEffect: {
                    speed: 6.0,
                    duration: 0.1, //This is per update 
                    //Is basically the frecuency in which will calculate the direction and apply the effect to the enemies, while the attack is active
                    width: 9,
                    height: 9
                },

                damageTimes: [{
                    start: 0.533,
                    end: 0.70
                }],

                //Visuals
                icon: 'Icon_Axe_Crusher.img',
                animationObj: {
                    animName: 'attack/axe/skill_01',
                    animDuration: 1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_crusher',
                        start: 0.35
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Axe_Light_Attack.img',
        heavyAttackIcon: 'Icon_Axe_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/axes/axe_captainsedge',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-axe_captainsedge.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true,
            scale: 1.0
            //rot: 1.0
        }
    },
    'axe_infamy': {
        attackType: WeaponAttackType.Slashing,
        id: 'axe_infamy',
        name: 'Infamy Axe',
        type: 'melee',
        rarity: 'epic',
        weapType: 'axe_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.25,
        headshotMult: 1.0,
        baseDamage: 13,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Cleave',
                damage: 8.0,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.466,
                    end: 0.866
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/light',
                    animDuration: 0.866,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave',
                        start: 0.466
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Cleave',
                chargeDamage: true,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 10.0,
                    maxDamage: 50.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.4,
                    end: 0.8
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/heavy',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave_strong',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/axe/heavy_charge',
                    runChargeAnimName: 'attack/axe/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Leap',
                damage: 5.0,
                width: 2.7,
                height: 2.7,
                cooldownTime: 8,

                behaviourId: SkillsEnum.DashAttackWithAnticipation,

                //Default offset up
                offset: {
                    x: 2.5,
                    y: 0
                },

                offset_right: {
                    x: 2.5,
                    y: -1.5
                },

                offset_left: {
                    x: 2.5,
                    y: 1.5
                },

                //Behavior params
                dash: {
                    distance: 15,
                    duration: 0.234,
                    animate: false,
                    startAnimTime: 0.166,
                    cantMove: true
                },

                damageTimes: [{
                    start: 0.533,
                    end: 1.0
                }],

                //Visuals
                icon: 'Icon_Axe_Leap.img',
                animationObj: {
                    animName: 'attack/axe/skill_02',
                    animDuration: 1.0,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_leap',
                        start: 0.3
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Crusher',
                damage: 0,
                width: 9,
                height: 9,
                cooldownTime: 10,

                behaviourId: SkillsEnum.CrusherAttack,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 0,
                    y: 0
                },

                //Behavior params
                pullEffect: {
                    speed: 6.0,
                    duration: 0.1, //This is per update 
                    //Is basically the frecuency in which will calculate the direction and apply the effect to the enemies, while the attack is active
                    width: 9,
                    height: 9
                },

                damageTimes: [{
                    start: 0.533,
                    end: 0.70
                }],

                //Visuals
                icon: 'Icon_Axe_Crusher.img',
                animationObj: {
                    animName: 'attack/axe/skill_01',
                    animDuration: 1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_crusher',
                        start: 0.35
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Cyclone',
                damage: 0,
                width: 5.5,
                height: 5.5,
                cooldownTime: 20,

                behaviourId: SkillsEnum.CycloneAttack,
                useSpeedPenalty: -2.5,

                offset: {
                    x: 0,
                    y: 0
                },

                //Behavior params
                cycloneParams: {
                    damageFrecuency: 0.5
                },

                damageTimes: [],

                //Visuals
                icon: 'Icon_Axe_Cyclone.img',
                animationObj: {
                    animName: 'attack/axe/skill_03',
                    animDuration: 5,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cyclone_loop',
                        start: 0.0,
                        loop: true
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Axe_Light_Attack.img',
        heavyAttackIcon: 'Icon_Axe_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/axes/axe_infamy',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-axe_infamy.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true,
            scale: 1.0
            //rot: 1.0
        }
    },

    /// --- DAGGERS --- ///

    'dagger_dirk': {
        attackType: WeaponAttackType.Piercing,
        id: 'dagger_dirk',
        name: 'Dirk',
        type: 'melee',
        rarity: 'common',
        weapType: 'dagger_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 7,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Stab',
                damage: 1.0,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,

                offset: {
                    x: 1,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Stab',
                chargeDamage: true,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -2.0,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 0.0,
                    maxDamage: 43.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/heavy',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab_strong',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/dagger/heavy_charge',
                    runChargeAnimName: 'attack/dagger/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shadow Step',
                damage: 5.0,
                width: 1.8,
                height: 1.8,
                cooldownTime: 10,
                cancelable: true,
                freeDirection: true,
                allowChargeHeavyAttack: true,
                useSpeedPenalty: 5,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                offset: {
                    x: 0,
                    y: 1.5
                },

                //Behaviour params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_invisibleEffect',
                    statusEffectParams: {
                        time: 4
                    },

                    playAnimationWhenFinished: true,
                    //Animation
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/dagger/smoke_bomb',
                        finish: 'weapons/dagger/smoke_bomb',
                        pivot: {
                            x: 15,
                            y: 0
                        }
                    }
                },

                damageTimes: [0.0],

                //Visuals
                icon: 'Icon_Dagger_Shadow_Step.img',
                animationObj: {
                    animName: 'attack/dagger/skill_01',
                    animDuration: 0.2,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_shadow_step',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Dagger_Light_Attack.img',
        heavyAttackIcon: 'Icon_Dagger_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/daggers/dagger_dirk',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-dagger_dirk.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'dagger_cutlass': {
        attackType: WeaponAttackType.Piercing,
        id: 'dagger_cutlass',
        name: 'Cutlass',
        type: 'melee',
        rarity: 'rare',
        weapType: 'dagger_type',
        quality: 0,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 10,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Stab',
                damage: 1.0,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,

                offset: {
                    x: 1,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Stab',
                chargeDamage: true,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -2.0,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 0.0,
                    maxDamage: 43.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/heavy',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab_strong',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/dagger/heavy_charge',
                    runChargeAnimName: 'attack/dagger/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shadow Step',
                damage: 5.0,
                width: 1.8,
                height: 1.8,
                cooldownTime: 10,
                cancelable: true,
                freeDirection: true,
                allowChargeHeavyAttack: true,
                useSpeedPenalty: 5,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                offset: {
                    x: 0,
                    y: 1.5
                },

                //Behaviour params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_invisibleEffect',
                    statusEffectParams: {
                        time: 4
                    },

                    playAnimationWhenFinished: true,
                    //Animation
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/dagger/smoke_bomb',
                        finish: 'weapons/dagger/smoke_bomb',
                        pivot: {
                            x: 15,
                            y: 0
                        }
                    }
                },

                damageTimes: [0.0],

                //Visuals
                icon: 'Icon_Dagger_Shadow_Step.img',
                animationObj: {
                    animName: 'attack/dagger/skill_01',
                    animDuration: 0.2,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_shadow_step',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Viper Strike',
                bulletType: 'dagger_projectile_skill_2',
                numBullets: 1,
                bulletCount: 1,
                cooldownTime: 6.0,
                shootDelay: 0.333,
                firstShootDelay: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                //Visuals
                icon: 'Icon_Dagger_Viper_Strike.img',
                animationObj: {
                    animName: 'throw',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_viper_strike',
                        start: 0.266
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Dagger_Light_Attack.img',
        heavyAttackIcon: 'Icon_Dagger_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/daggers/darger_cutlass',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-dagger_cutlass.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'dagger_gaia': {
        attackType: WeaponAttackType.Piercing,
        id: 'dagger_gaia',
        name: 'Gaia',
        type: 'gun',
        rarity: 'epic',
        weapType: 'dagger_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed

        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 13,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Stab',
                damage: 1.0,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,

                offset: {
                    x: 1,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.133,
                    end: 0.266
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Stab',
                chargeDamage: true,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -2.0,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 0.0,
                    maxDamage: 43.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.133,
                    end: 0.266
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/heavy',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab_strong',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/dagger/heavy_charge',
                    runChargeAnimName: 'attack/dagger/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shadow Step',
                damage: 5.0,
                width: 1.8,
                height: 1.8,
                cooldownTime: 10,
                cancelable: true,
                freeDirection: true,
                allowChargeHeavyAttack: true,
                useSpeedPenalty: 5,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                offset: {
                    x: 0,
                    y: 1.5
                },

                //Behaviour params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_invisibleEffect',
                    statusEffectParams: {
                        time: 4
                    },

                    playAnimationWhenFinished: true,
                    //Animation
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/dagger/smoke_bomb',
                        finish: 'weapons/dagger/smoke_bomb',
                        pivot: {
                            x: 15,
                            y: 0
                        }
                    }
                },

                damageTimes: [0.0],

                //Visuals
                icon: 'Icon_Dagger_Shadow_Step.img',
                animationObj: {
                    animName: 'attack/dagger/skill_01',
                    animDuration: 0.2,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_shadow_step',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Backstab',
                bulletType: 'dagger_projectile_skill_2',
                numBullets: 1,
                bulletCount: 1,
                cooldownTime: 6.0,
                shootDelay: 0.333,
                firstShootDelay: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                //Visuals
                icon: 'Icon_Dagger_Viper_Strike.img',
                animationObj: {
                    animName: 'throw',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_viper_strike',
                        start: 0.266
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Blade Flurry',
                damage: -5.0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 9,

                behaviourId: SkillsEnum.BladeFlurryAttack,
                useSpeedPenalty: -2.0,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behaviour params
                behaviourParams: {
                    //Animation duration (To match the damage with the animation)
                    damageFrecuency: 0.2
                },

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.15,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                damageTimes: [],

                //Visuals
                icon: 'Icon_Dagger_Blade_Flurry.img',
                animationObj: {
                    animName: 'attack/dagger/skill_03',
                    animDuration: 2, //Attack duration (because animation is in loop)
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_blade_flurry_loop',
                        start: 0,
                        loop: true
                    },
                    useCursorDirection: true,
                    fixedDirection: false
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Dagger_Light_Attack.img',
        heavyAttackIcon: 'Icon_Dagger_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/daggers/dagger_gaia',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-dagger_gaia.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    }
};

var StaffVariants = {
    'staff_elderwood_chilling': {
        attackType: WeaponAttackType.Magic,
        id: 'staff_elderwood_chilling',
        name: 'Elderwood of Chilling',
        type: 'gun',
        rarity: 'common',
        weapType: 'staff_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 7.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Chill enemies on hit.',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Orb Shot',
                bulletType: 'staff_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_chillEffect',
                    chance: 0.2,
                    params: {
                        speedPercentage: 50,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/light',
                    animDuration: 0.4167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Orb Shot',
                bulletType: 'staff_projectile_heavy_1', // Default bullet type
                cooldownTime: 0.25,
                shootDelay: 0.2,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minBulletType: 1,
                    maxBulletType: 3, //Max amount of bullets sizes 
                    bulletTypes: ['staff_projectile_heavy_1', 'staff_projectile_heavy_2', 'staff_projectile_heavy_3'],
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_chillEffect',
                    chance: 0.4,
                    params: {
                        speedPercentage: 50,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/heavy',
                    animDuration: 0.58,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/staff/heavy_charge',
                    runChargeAnimName: 'attack/staff/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Frost Shard',
                bulletType: 'staff_test_projectile_skill_1',
                //projType: 'fire_shot',
                cooldownTime: 6.0,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.CombineAttack,
                useSpeedPenalty: -4.0,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.FrostOrb,
                    deployOnFinishAttack: false,
                    deployTime: 0.0,
                    trapParams: {
                        explosionType: 'explosion_staff_skill_1'
                    }
                },

                //Visuals
                icon: 'Icon_Staff_Frost_Shard.img',

                animationObj: {
                    animName: 'attack/staff/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    sound: {
                        name: 'sfx_weapons_staff_frost_orb',
                        start: 0.133
                    },
                    track: 0,
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Staff_Light_Attack.img',
        heavyAttackIcon: 'Icon_Staff_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/staffs/staff_elderwood',
        lootImg: {
            sprite: 'loot-staff_elderwood.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'staff_ash_chilling': {
        attackType: WeaponAttackType.Magic,
        id: 'staff_ash_chilling',
        name: 'Ash of Chilling',
        type: 'gun',
        rarity: 'rare',
        weapType: 'staff_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 10,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Chill enemies on hit.',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Orb Shot',
                bulletType: 'staff_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_chillEffect',
                    chance: 0.3,
                    params: {
                        speedPercentage: 50,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/light',
                    animDuration: 0.4167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Orb Shot',
                bulletType: 'staff_projectile_heavy_1', // Default bullet type
                cooldownTime: 0.25,
                shootDelay: 0.2,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,

                //Behavior params
                behaviourParams: {
                    minBulletType: 1,
                    maxBulletType: 3, //Max amount of bullets sizes 
                    bulletTypes: ['staff_projectile_heavy_1', 'staff_projectile_heavy_2', 'staff_projectile_heavy_3'],
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_chillEffect',
                    chance: 0.6,
                    params: {
                        speedPercentage: 50,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/heavy',
                    animDuration: 0.58,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/staff/heavy_charge',
                    runChargeAnimName: 'attack/staff/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Frost Shard',
                bulletType: 'staff_test_projectile_skill_1',
                //projType: 'fire_shot',
                cooldownTime: 6.0,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.CombineAttack,
                useSpeedPenalty: -4.0,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.FrostOrb,
                    deployOnFinishAttack: false,
                    deployTime: 0.0,
                    trapParams: {
                        explosionType: 'explosion_staff_skill_1'
                    }
                },

                //Visuals
                icon: 'Icon_Staff_Frost_Shard.img',

                animationObj: {
                    animName: 'attack/staff/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    sound: {
                        name: 'sfx_weapons_staff_frost_orb',
                        start: 0.133
                    },
                    track: 0,
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Trail of Orbs',
                cooldownTime: 10.0,
                numBullets: 8,
                shootDelay: 0,
                duration: 6,
                width: 4,
                height: 4,

                behaviourId: SkillsEnum.ThrowablesAttack,

                //Behavior params
                behaviourParams: {
                    throwableDurationDelay: 0.5,
                    throwableId: 'spark',
                    lifeTime: 15
                },

                damageTimes: [0.25],

                offset: {
                    x: 0,
                    y: 0
                },

                //Visuals
                icon: 'Icon_Staff_Trail_Of_Orbs.img',
                animationObj: {
                    animName: 'attack/staff/skill_02',
                    animDuration: 0.9167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_trail_of_orbs',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Staff_Light_Attack.img',
        heavyAttackIcon: 'Icon_Staff_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/staffs/staff_ash',
        lootImg: {
            sprite: 'loot-staff_ash.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'staff_wickedgnarl_chilling': {
        attackType: WeaponAttackType.Magic,
        id: 'staff_wickedgnarl_chilling',
        name: 'Wicked Gnarl of Chilling',
        type: 'gun',
        rarity: 'epic',
        weapType: 'staff_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 13.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Chill enemies on hit.',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Orb Shot',
                bulletType: 'staff_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_chillEffect',
                    chance: 0.4,
                    params: {
                        speedPercentage: 50,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/light',
                    animDuration: 0.4167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Orb Shot',
                bulletType: 'staff_projectile_heavy_1', // Default bullet type
                cooldownTime: 0.25,
                shootDelay: 0.2,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minBulletType: 1,
                    maxBulletType: 3, //Max amount of bullets sizes 
                    bulletTypes: ['staff_projectile_heavy_1', 'staff_projectile_heavy_2', 'staff_projectile_heavy_3'],
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_chillEffect',
                    chance: 0.8,
                    params: {
                        speedPercentage: 50,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/staff/heavy',
                    animDuration: 0.58,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_orb_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/staff/heavy_charge',
                    runChargeAnimName: 'attack/staff/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Frost Shard',
                bulletType: 'staff_test_projectile_skill_1',
                //projType: 'fire_shot',
                cooldownTime: 6.0,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.CombineAttack,
                useSpeedPenalty: -4.0,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.FrostOrb,
                    deployOnFinishAttack: false,
                    deployTime: 0.0,
                    trapParams: {
                        explosionType: 'explosion_staff_skill_1'
                    }
                },

                //Visuals
                icon: 'Icon_Staff_Frost_Shard.img',

                animationObj: {
                    animName: 'attack/staff/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    sound: {
                        name: 'sfx_weapons_staff_frost_orb',
                        start: 0.133
                    },
                    track: 0,
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Trail of Orbs',
                cooldownTime: 10.0,
                numBullets: 8,
                shootDelay: 0,
                duration: 6,
                width: 4,
                height: 4,

                behaviourId: SkillsEnum.ThrowablesAttack,

                //Behavior params
                behaviourParams: {
                    throwableDurationDelay: 0.5,
                    throwableId: 'spark',
                    lifeTime: 15
                },

                damageTimes: [0.25],

                offset: {
                    x: 0,
                    y: 0
                },

                //Visuals
                icon: 'Icon_Staff_Trail_Of_Orbs.img',
                animationObj: {
                    animName: 'attack/staff/skill_02',
                    animDuration: 0.9167,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_trail_of_orbs',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Volatile Surge',
                cooldownTime: 12.0,
                freeDirectionWhileAttacking: true,

                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 6.0,
                    duration: 1.1,
                    effects: [{
                        name: 'm_movePlayerEffect',
                        chance: 1,

                        needExtraParams: true,
                        params: {
                            speed: 8.0
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/staff/volatile_surge',
                        pivot: {
                            x: 0.0,
                            y: 0.0
                        }
                    },
                    worldImg: {
                        sprite: 'part-pulse-circle-02.img',
                        scale: 1.0,
                        tint: 0xFFFFFF,
                        auraScale: 0.1
                    },
                    exploteThrowables: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Staff_Volatile_Surge.img',
                animationObj: {
                    animName: 'attack/staff/skill_03',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_staff_volatile_surge',
                        start: 0.133
                    },
                    useCursorDirection: true
                },

                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Staff_Light_Attack.img',
        heavyAttackIcon: 'Icon_Staff_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/staffs/staff_wickedgnarl',
        lootImg: {
            sprite: 'loot-staff_wickedgnarl.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    }
};

var BowVariants = {
    'bow_spiritshot_bleeding': {
        attackType: WeaponAttackType.Piercing,
        id: 'bow_spiritshot_bleeding',
        name: 'Spirit Shot of Bleeding',
        type: 'gun',
        rarity: 'common',
        weapType: 'bow_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 7.0,
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Bleed enemies on hit.',
        speed: {
            equip: 0.0,
            attack: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Arrow Shot',
                bulletType: 'bow_projectile_light',
                cooldownTime: 0.5,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -8.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.2,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                //Visuals
                attackStartTime: 0.4, //Anticipation
                animationObj: {
                    animName: 'attack/bow/light',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    onStopUpdateDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Charged Arrow Shot',
                bulletType: 'bow_projectile_heavy',
                cooldownTime: 0.5,
                numBullets: 1,
                holdSpeedPenalty: -8.0,

                behaviourId: SkillsEnum.VariableDamageRange,
                useSpeedPenalty: -10.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minDamage: 10,
                    maxDamage: 25,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3,
                    changeZoomWhileCharging: true,
                    maxZoomRadius: 45
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.4,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                //Visuals
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/bow/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/bow/heavy_charge',
                    runChargeAnimName: 'attack/bow/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0.0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Net Trap',
                cooldownTime: 10.0,
                inmobilizeWhileExecutingSkill: true,
                useSpeedPenalty: -10.0,

                behaviourId: SkillsEnum.DeployTrap,

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.InmobilizePlayer,
                    deployOnFinishAttack: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Net_Trap.img',
                animationObj: {
                    animName: 'attack/bow/skill_01',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_trap_plant_loop',
                        start: 0.0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            }
        },

        //FXs
        icon: 'Icon_Bow_Light_Attack.img',
        heavyAttackIcon: 'Icon_Bow_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/bows/bow_spiritshot',
        lootImg: {
            sprite: 'loot-bow_spiritshot.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'bow_longbow_bleeding': {
        attackType: WeaponAttackType.Piercing,
        id: 'bow_longbow_bleeding',
        name: 'Longbow of Bleeding',
        type: 'gun',
        rarity: 'rare',
        weapType: 'bow_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 10.0,
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Bleed enemies on hit.',
        speed: {
            equip: 0.0,
            attack: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Arrow Shot',
                bulletType: 'bow_projectile_light',
                cooldownTime: 0.5,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -8.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.3,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                //Visuals
                attackStartTime: 0.4, //Anticipation
                animationObj: {
                    animName: 'attack/bow/light',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    onStopUpdateDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Charged Arrow Shot',
                bulletType: 'bow_projectile_heavy',
                cooldownTime: 0.5,
                numBullets: 1,
                holdSpeedPenalty: -8.0,

                behaviourId: SkillsEnum.VariableDamageRange,
                useSpeedPenalty: -10.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minDamage: 10,
                    maxDamage: 25,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3,
                    changeZoomWhileCharging: true,
                    maxZoomRadius: 45
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.6,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                //Visuals
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/bow/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/bow/heavy_charge',
                    runChargeAnimName: 'attack/bow/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0.0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Net Trap',
                cooldownTime: 10.0,
                inmobilizeWhileExecutingSkill: true,
                useSpeedPenalty: -10.0,

                behaviourId: SkillsEnum.DeployTrap,

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.InmobilizePlayer,
                    deployOnFinishAttack: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Net_Trap.img',
                animationObj: {
                    animName: 'attack/bow/skill_01',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_trap_plant_loop',
                        start: 0.0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Quick Shot',
                cooldownTime: 10.0,
                useSpeedPenalty: 0.0,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                dash: {
                    preAttack: true,
                    distance: 15,
                    duration: 0.25,
                    animate: true
                },

                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_chargeHeavyAttack'
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.009],

                //Visuals
                icon: 'Icon_Bow_Quick_Shot.img',
                animationObj: {
                    animName: 'attack/bow/skill_02',
                    animDuration: 0.1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_quick_shot',
                        start: 0.0
                    }
                },
                telegraph: {
                    type: 'arrow'
                }
            }
        },

        //FXs
        icon: 'Icon_Bow_Light_Attack.img',
        heavyAttackIcon: 'Icon_Bow_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/bows/bow_longbow',
        lootImg: {
            sprite: 'loot-bow_longbow.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'bow_markflight_bleeding': {
        attackType: WeaponAttackType.Piercing,
        id: 'bow_markflight_bleeding',
        name: 'Markflight of Bleeding',
        type: 'gun',
        rarity: 'epic',
        weapType: 'bow_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 13.0,
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Bleed enemies on hit.',
        speed: {
            equip: 0.0,
            attack: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Arrow Shot',
                bulletType: 'bow_projectile_light',
                cooldownTime: 0.5,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -8.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.4,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                //Visuals
                attackStartTime: 0.4, //Anticipation
                animationObj: {
                    animName: 'attack/bow/light',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    onStopUpdateDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Charged Arrow Shot',
                bulletType: 'bow_projectile_heavy',
                cooldownTime: 0.5,
                numBullets: 1,
                holdSpeedPenalty: -8.0,
                cancelable: true,

                behaviourId: SkillsEnum.VariableDamageRange,
                useSpeedPenalty: -10.0,

                //Behavior params
                behaviourParams: {
                    minDamage: 10,
                    maxDamage: 25,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3,
                    changeZoomWhileCharging: true,
                    maxZoomRadius: 45
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.8,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                //Visuals
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/bow/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_arrow_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/bow/heavy_charge',
                    runChargeAnimName: 'attack/bow/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0.0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Net Trap',
                cooldownTime: 10.0,
                inmobilizeWhileExecutingSkill: true,
                useSpeedPenalty: -10.0,

                behaviourId: SkillsEnum.DeployTrap,

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.InmobilizePlayer,
                    deployOnFinishAttack: true
                },

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Net_Trap.img',
                animationObj: {
                    animName: 'attack/bow/skill_01',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_trap_plant_loop',
                        start: 0.0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Quick Shot',
                cooldownTime: 10.0,
                useSpeedPenalty: 0.0,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                dash: {
                    preAttack: true,
                    distance: 15,
                    duration: 0.25,
                    animate: true
                },

                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_chargeHeavyAttack'
                },

                zoomInSpeed: 1.0,
                zoomOutSpeed: 1.0,

                damageTimes: [0.009],

                //Visuals
                icon: 'Icon_Bow_Quick_Shot.img',
                animationObj: {
                    animName: 'attack/bow/skill_02',
                    animDuration: 0.1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_bow_quick_shot',
                        start: 0.0
                    }
                },
                telegraph: {
                    type: 'arrow'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Piercing Shot',
                bulletType: 'bow_projectile_skill_3',
                cooldownTime: 14.0,
                numBullets: 1,
                shootDelay: 0.0,
                holdSpeedPenalty: -8.0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -10.0,

                //Selected skill params
                zoomRadius: 55,

                zoomInSpeed: 1.0,
                zoomOutSpeed: 2.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Bow_Piercing_Shot.img',
                attackStartTime: 0.266, //Anticipation
                animationObj: {
                    animName: 'attack/bow/skill_03',
                    animDuration: 0.533,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapon_bow_piercing_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow'
                }
            }
        },

        //FXs
        icon: 'Icon_Bow_Light_Attack.img',
        heavyAttackIcon: 'Icon_Bow_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/bows/bow_markflight',
        lootImg: {
            sprite: 'loot-bow_markflight.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    }
};

var WandVariants = {
    'wand_stardust_burning': {
        attackType: WeaponAttackType.Magic,
        id: 'wand_stardust_burning',
        name: 'Stardust of Burning',
        type: 'gun',
        rarity: 'common',
        weapType: 'wand_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 7.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Burst Shot',
                bulletType: 'wand_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.2,
                    params: {
                        damage: 0.05,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Spell Shot',
                bulletType: 'wand_projectile_heavy',
                cooldownTime: 0.25,
                shootDelay: 0.2,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minBullets: 1,
                    maxBullets: 5,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.4,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/heavy',
                    animDuration: 0.58, //0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/wand/heavy_charge',
                    runChargeAnimName: 'attack/wand/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Fan of Sparks',
                bulletType: 'wand_projectile_skill_1',
                cooldownTime: 6.0,
                numBullets: 5,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Wand_Fan_Of_Sparks.img',
                animationObj: {
                    animName: 'attack/wand/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_fan_sparks',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.25,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Wand_Light_Attack.img',
        heavyAttackIcon: 'Icon_Wand_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/wands/wand_stardust',
        lootImg: {
            sprite: 'loot-wand_stardust.img',
            tint: 0xffffff,
            //border: 'hexagon-frame-border.img',
            //borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'wand_phantomite_burning': {
        attackType: WeaponAttackType.Magic,
        id: 'wand_phantomite_burning',
        name: 'Phantomite of Burning',
        type: 'gun',
        rarity: 'rare',
        weapType: 'wand_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 10.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Burst Shot',
                bulletType: 'wand_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.3,
                    params: {
                        damage: 0.1,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Spell Shot',
                bulletType: 'wand_projectile_heavy',
                cooldownTime: 0.25,
                shootDelay: 0.2,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minBullets: 1,
                    maxBullets: 5,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.6,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/heavy',
                    animDuration: 0.58, //0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/wand/heavy_charge',
                    runChargeAnimName: 'attack/wand/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Fan of Sparks',
                bulletType: 'wand_projectile_skill_1',
                cooldownTime: 6.0,
                numBullets: 5,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Wand_Fan_Of_Sparks.img',
                animationObj: {
                    animName: 'attack/wand/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_fan_sparks',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.25,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Teleport',
                bulletType: 'staff_projectile_skill_2',
                cooldownTime: 8.0,

                behaviourId: SkillsEnum.DeployTrap,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.StaticEnergyRing,
                    deployOnFinishAttack: false,
                    deployTime: 0.416

                    //Visuals
                    /*playAnimationWhenFinished: true,
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        startTime: 0.29,
                        finishTime: 0.36,
                        startAnim: 'weapons/wand/teleport',
                        finishAnim: 'weapons/wand/teleport',
                        skin: 'default',
                        scale: 1,
                        pivot: {
                            x: 13.0,
                            y: 0.0
                        }
                    },*/
                },

                dash: {
                    afterAttack: true,
                    distance: 20,
                    duration: 0.05,
                    animate: false,
                    cantMove: false
                },

                //Visuals
                icon: 'Icon_Wand_Teleport.img',
                animationObj: {
                    animName: 'attack/wand/skill_02',
                    animDuration: 0.666,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_teleport',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true,
                    seqId: "teleport_seq",
                    nextAnimations: [{
                        seqId: "teleport_seq",
                        animName: "attack/wand/skill_02_appear",
                        animDuration: 0.266,
                        loop: false,
                        track: 0,
                        sound: "",
                        fixedDirection: true
                    }]
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Wand_Light_Attack.img',
        heavyAttackIcon: 'Icon_Wand_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/wands/wand_phantomite',
        lootImg: {
            sprite: 'loot-wand_phantomite.img',
            tint: 0xffffff,
            //border: 'hexagon-frame-border.img',
            //borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    },
    'wand_aptitude_burning': {
        attackType: WeaponAttackType.Magic,
        id: 'wand_aptitude_burning',
        name: 'Aptitude of Burning',
        type: 'gun',
        rarity: 'epic',
        weapType: 'wand_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        switchDelay: 0.75,
        barrelLength: 2.625,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        bulletCount: 1,
        bulletType: 'staff_projectile_light',
        headshotMult: 2.0,
        size: 'med',
        baseDamage: 13.0,
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Ignite enemies on hit.',
        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Burst Shot',
                bulletType: 'wand_projectile_light',
                cooldownTime: 0.25,
                numBullets: 1,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,
                cancelable: true,

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.4,
                    params: {
                        damage: 0.15,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Spell Shot',
                bulletType: 'wand_projectile_heavy',
                cooldownTime: 0.25,
                shootDelay: 0.2,

                behaviourId: SkillsEnum.HeavyAttackStaff,
                useSpeedPenalty: -4.0,
                cancelable: true,

                //Behavior params
                behaviourParams: {
                    minBullets: 1,
                    maxBullets: 5,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [0.25],

                //Status effects
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.8,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/wand/heavy',
                    animDuration: 0.58, //0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_burst_shot_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/wand/heavy_charge',
                    runChargeAnimName: 'attack/wand/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Fan of Sparks',
                bulletType: 'wand_projectile_skill_1',
                cooldownTime: 6.0,
                numBullets: 5,
                shootDelay: 0,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                damageTimes: [0.25],

                //Visuals
                icon: 'Icon_Wand_Fan_Of_Sparks.img',
                animationObj: {
                    animName: 'attack/wand/skill_01',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_fan_sparks',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                effects: [{
                    name: 'm_burningEffect',
                    chance: 0.25,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Teleport',
                bulletType: 'staff_projectile_skill_2',
                cooldownTime: 8.0,

                behaviourId: SkillsEnum.DeployTrap,

                damageTimes: [0],

                //Behavior params
                behaviourParams: {
                    trapId: TrapsEnum.StaticEnergyRing,
                    deployOnFinishAttack: false,
                    deployTime: 0.416

                    //Visuals
                    /*playAnimationWhenFinished: true,
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        startTime: 0.29,
                        finishTime: 0.36,
                        startAnim: 'weapons/wand/teleport',
                        finishAnim: 'weapons/wand/teleport',
                        skin: 'default',
                        scale: 1,
                        pivot: {
                            x: 13.0,
                            y: 0.0
                        }
                    },*/
                },

                dash: {
                    afterAttack: true,
                    distance: 20,
                    duration: 0.05,
                    animate: false,
                    cantMove: false
                },

                //Visuals
                icon: 'Icon_Wand_Teleport.img',
                animationObj: {
                    animName: 'attack/wand/skill_02',
                    animDuration: 0.666,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_teleport',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true,
                    seqId: "teleport_seq",
                    nextAnimations: [{
                        seqId: "teleport_seq",
                        animName: "attack/wand/skill_02_appear",
                        animDuration: 0.266,
                        loop: false,
                        track: 0,
                        sound: "",
                        fixedDirection: true
                    }]
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Scorch',
                cooldownTime: 12.0,
                freeDirectionWhileAttacking: true,
                obstacleDamage: 1.5,

                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,
                useSpeedPenalty: -4.0,

                //Behaviour params
                behaviourParams: {
                    rad: 6.0,
                    duration: 1,
                    damage: 30,
                    effects: [{
                        name: 'm_burningEffect',
                        chance: 1,
                        params: {
                            damage: 0.015,
                            time: 5
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/wand/chilling_burst',
                        pivot: {
                            x: 0.0,
                            y: 0.0
                        }
                    }
                },

                //Visuals
                icon: 'Icon_Wand_Scorch.img',
                animationObj: {
                    animName: 'attack/wand/skill_03',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_wand_scorch',
                        start: 0.133
                    },
                    useCursorDirection: true
                },
                telegraph: {
                    type: 'circular',
                    doNotCalculateOffset: true
                }
            }
        },

        //FXs
        icon: 'Icon_Wand_Light_Attack.img',
        heavyAttackIcon: 'Icon_Wand_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/range/wands/wand_aptitude',
        lootImg: {
            sprite: 'loot-wand_aptitude.img',
            tint: 0xffffff,
            //border: 'hexagon-frame-border.img',
            //borderTint: 0xffffff,
            rad: 25.0
            //rot: 1.0
        },
        particle: {
            shellScale: 1.0,
            shellOffset: 0.375
        },
        sound: {
            shoot: 'mp5_01',
            reload: 'mp5_reload_01',
            pickup: 'gun_pickup_01',
            empty: 'empty_fire_01',
            deploy: 'mp5_switch_01'
        }
    }
};

var SwordVariants = {
    'sword_broadstrike_blinding': {
        attackType: WeaponAttackType.Slashing,
        id: 'sword_broadstrike_blinding',
        name: 'Broadstrike of Blinding',
        type: 'melee',
        rarity: 'common',
        weapType: 'sword_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 7.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Slash',
                damage: 0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 0.1,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -1.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 0.2,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/light',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Slash',
                chargeDamage: true,
                width: 1.7,
                height: 2,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: -3.0,
                    maxDamage: 40.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 0.4,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/sword/heavy_charge',
                    runChargeAnimName: 'attack/sword/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shield Charge',
                damage: 15.0,
                width: 1,
                height: 2,
                cooldownTime: 4,

                behaviourId: SkillsEnum.DashAttackMelee,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    reflectAttacks: {
                        bulletSpeedMult: 3
                    }
                },

                dash: {
                    distance: 30,
                    duration: 1,
                    cantMove: true
                },

                //Status effects
                effects: [{ //Use effect to simulate knockback
                    name: 'm_movePlayerEffect',
                    chance: 1,
                    needExtraParams: true,
                    params: {
                        speed: 8,
                        duration: 1
                    }
                }],

                damageTimes: [{
                    start: 0,
                    end: 1
                }],

                //Visuals
                icon: 'Icon_Sword_Shield_Charge.img',
                animationObj: {
                    animName: 'attack/sword/skill_01',
                    animDuration: 1,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_shield_charge_loop',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Sword_Light_Attack.img',
        heavyAttackIcon: 'Icon_Sword_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/swords/sword_broadstrike',
        offHandSpineAsset: 'weapons/offhand/shields/shield_broadstrike',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-swordshield_broadstrike.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'sword_solitude_blinding': {
        attackType: WeaponAttackType.Slashing,
        id: 'sword_solitude_blinding',
        name: 'Solitude of Blinding',
        type: 'melee',
        rarity: 'rare',
        weapType: 'sword_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 10.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Slash',
                damage: 0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 0.1,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -1.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 0.3,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/light',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Slash',
                chargeDamage: true,
                width: 1.7,
                height: 2,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: -3.0,
                    maxDamage: 40.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 0.6,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/sword/heavy_charge',
                    runChargeAnimName: 'attack/sword/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shield Charge',
                damage: 15.0,
                width: 1,
                height: 2,
                cooldownTime: 4,

                behaviourId: SkillsEnum.DashAttackMelee,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    reflectAttacks: {
                        bulletSpeedMult: 3
                    }
                },

                dash: {
                    distance: 30,
                    duration: 1,
                    cantMove: true
                },

                //Status effects
                effects: [{ //Use effect to simulate knockback
                    name: 'm_movePlayerEffect',
                    chance: 1,
                    needExtraParams: true,
                    params: {
                        speed: 8,
                        duration: 1
                    }
                }],

                damageTimes: [{
                    start: 0,
                    end: 1
                }],

                //Visuals
                icon: 'Icon_Sword_Shield_Charge.img',
                animationObj: {
                    animName: 'attack/sword/skill_01',
                    animDuration: 1,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_shield_charge_loop',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Iron Wall',
                damage: 5.0,
                width: 2,
                height: 1,
                cooldownTime: 10,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_shieldEffect',
                    reflectAttacks: true,
                    reflectedMeleeMult: 0.5,
                    statusEffectParams: {
                        duration: 3
                    }
                },

                damageTimes: [{
                    start: 0.0,
                    end: 0.45
                }],

                //Visuals
                icon: 'Icon_Sword_Iron_Wall.img',

                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Sword_Light_Attack.img',
        heavyAttackIcon: 'Icon_Sword_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/swords/sword_solitude',
        offHandSpineAsset: 'weapons/offhand/shields/shield_solitude',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-swordshield_solitude.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'sword_sunder_blinding': {
        attackType: WeaponAttackType.Slashing,
        id: 'sword_sunder_blinding',
        name: 'Sunder of Blinding',
        type: 'melee',
        rarity: 'epic',
        weapType: 'sword_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 13.0,
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Blind enemies on hit.',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Slash',
                damage: 0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 0.1,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -1.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 0.4,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/light',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Slash',
                chargeDamage: true,
                width: 1.7,
                height: 2,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: -3.0,
                    maxDamage: 40.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.3
                }],

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 0.8,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/sword/heavy',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_slash_strong',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/sword/heavy_charge',
                    runChargeAnimName: 'attack/sword/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shield Charge',
                damage: 15.0,
                width: 1,
                height: 2,
                cooldownTime: 4,

                behaviourId: SkillsEnum.DashAttackMelee,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    reflectAttacks: {
                        bulletSpeedMult: 3
                    }
                },

                dash: {
                    distance: 30,
                    duration: 1,
                    cantMove: true
                },

                //Status effects
                effects: [{ //Use effect to simulate knockback
                    name: 'm_movePlayerEffect',
                    chance: 1,
                    needExtraParams: true,
                    params: {
                        speed: 8,
                        duration: 1
                    }
                }],

                damageTimes: [{
                    start: 0,
                    end: 1
                }],

                //Visuals
                icon: 'Icon_Sword_Shield_Charge.img',
                animationObj: {
                    animName: 'attack/sword/skill_01',
                    animDuration: 1,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_shield_charge_loop',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Iron Wall',
                damage: 5.0,
                width: 2,
                height: 1,
                cooldownTime: 10,
                cancelable: true,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                //Behavior params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_shieldEffect',
                    reflectAttacks: true,
                    reflectedMeleeMult: 0.5,
                    statusEffectParams: {
                        duration: 3
                    }
                },

                damageTimes: [{
                    start: 0.0,
                    end: 0.45
                }],

                //Visuals
                icon: 'Icon_Sword_Iron_Wall.img',

                telegraph: {
                    type: 'circular'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Sundering Strike',
                damage: 20.0,
                gun: 'sword_gun',
                bulletType: 'bullet_sword',
                width: 2,
                height: 2,
                numBullets: 1,
                shootDelay: 0,
                cooldownTime: 9,

                behaviourId: SkillsEnum.RangeAttackSword,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 2,
                    y: 0
                },

                //Status effects
                effects: [{
                    name: 'm_blindEffect',
                    chance: 1,
                    params: {
                        "time": 5.0,
                        "points": 10
                    }
                }],

                damageTimes: [],

                //Visuals
                icon: 'Icon_Sword_Sundering_Strike.img',
                attackStartTime: 0.133, //Anticipation
                animationObj: {
                    animName: 'attack/sword/skill_03',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_sword_sundering_strike',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            }
        },

        //FXs
        icon: 'Icon_Sword_Light_Attack.img',
        heavyAttackIcon: 'Icon_Sword_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/swords/sword_sunder',
        offHandSpineAsset: 'weapons/offhand/shields/shield_sunder',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-swordshield_sunder.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    }
};

var AxeVariants = {
    'axe_sever_shocking': {
        attackType: WeaponAttackType.Slashing,
        id: 'axe_sever_shocking',
        name: 'Sever of Shocking',
        type: 'melee',
        rarity: 'common',
        weapType: 'axe_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.25,
        headshotMult: 1.0,
        baseDamage: 7.0,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Cleave',
                damage: 8.0,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.466,
                    end: 0.866
                }],

                //Status effects
                effects: [{
                    name: 'm_shockEffect',
                    chance: 0.2,
                    params: {
                        damagePercentage: 2,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/light',
                    animDuration: 0.866,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave',
                        start: 0.466
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Cleave',
                chargeDamage: true,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 10.0,
                    maxDamage: 50.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.4,
                    end: 0.8
                }],

                //Status effects
                effects: [{
                    name: 'm_shockEffect',
                    chance: 0.4,
                    params: {
                        damagePercentage: 2,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/heavy',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave_strong',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/axe/heavy_charge',
                    runChargeAnimName: 'attack/axe/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Leap',
                damage: 5.0,
                width: 2.7,
                height: 2.7,
                cooldownTime: 8,

                behaviourId: SkillsEnum.DashAttackWithAnticipation,

                //Default offset up
                offset: {
                    x: 2.5,
                    y: 0
                },

                offset_right: {
                    x: 2.5,
                    y: -1.5
                },

                offset_left: {
                    x: 2.5,
                    y: 1.5
                },

                //Behavior params
                dash: {
                    distance: 15,
                    duration: 0.234,
                    animate: false,
                    startAnimTime: 0.166,
                    cantMove: true
                },

                damageTimes: [{
                    start: 0.533,
                    end: 1.0
                }],

                //Visuals
                icon: 'Icon_Axe_Leap.img',
                animationObj: {
                    animName: 'attack/axe/skill_02',
                    animDuration: 1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_leap',
                        start: 0.3
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            }
        },

        //FXs
        icon: 'Icon_Axe_Light_Attack.img',
        heavyAttackIcon: 'Icon_Axe_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/axes/axe_sever',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-axe_sever.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true,
            scale: 1.0
            //rot: 1.0
        }
    },
    'axe_captainsedge_shocking': {
        attackType: WeaponAttackType.Slashing,
        id: 'axe_captainsedge_shocking',
        name: 'Captain\'s Edge of Shocking',
        type: 'melee',
        rarity: 'rare',
        weapType: 'axe_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.25,
        headshotMult: 1.0,
        baseDamage: 10,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Cleave',
                damage: 8.0,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.466,
                    end: 0.866
                }],

                //Status effects
                effects: [{
                    name: 'm_shockEffect',
                    chance: 0.3,
                    params: {
                        damagePercentage: 2,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/light',
                    animDuration: 0.866,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave',
                        start: 0.466
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Cleave',
                chargeDamage: true,
                width: 2,
                height: 3,
                cooldownTime: 0.5,
                cancelable: true,

                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 10.0,
                    maxDamage: 50.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.4,
                    end: 0.8
                }],

                //Status effects
                effects: [{
                    name: 'm_shockEffect',
                    chance: 0.6,
                    params: {
                        damagePercentage: 2,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/heavy',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave_strong',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/axe/heavy_charge',
                    runChargeAnimName: 'attack/axe/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Leap',
                damage: 5.0,
                width: 2.7,
                height: 2.7,
                cooldownTime: 8,

                behaviourId: SkillsEnum.DashAttackWithAnticipation,

                //Default offset up
                offset: {
                    x: 2.5,
                    y: 0
                },

                offset_right: {
                    x: 2.5,
                    y: -1.5
                },

                offset_left: {
                    x: 2.5,
                    y: 1.5
                },

                //Behavior params
                dash: {
                    distance: 15,
                    duration: 0.234,
                    animate: false,
                    startAnimTime: 0.166,
                    cantMove: true
                },

                damageTimes: [{
                    start: 0.533,
                    end: 1.0
                }],

                //Visuals
                icon: 'Icon_Axe_Leap.img',
                animationObj: {
                    animName: 'attack/axe/skill_02',
                    animDuration: 1.0,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_leap',
                        start: 0.3
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Crusher',
                damage: 0,
                width: 9,
                height: 9,
                cooldownTime: 10,

                behaviourId: SkillsEnum.CrusherAttack,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 0,
                    y: 0
                },

                //Behavior params
                pullEffect: {
                    speed: 6.0,
                    duration: 0.1, //This is per update 
                    //Is basically the frecuency in which will calculate the direction and apply the effect to the enemies, while the attack is active
                    width: 9,
                    height: 9
                },

                damageTimes: [{
                    start: 0.533,
                    end: 0.70
                }],

                //Visuals
                icon: 'Icon_Axe_Crusher.img',
                animationObj: {
                    animName: 'attack/axe/skill_01',
                    animDuration: 1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_crusher',
                        start: 0.35
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Axe_Light_Attack.img',
        heavyAttackIcon: 'Icon_Axe_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/axes/axe_captainsedge',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-axe_captainsedge.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true,
            scale: 1.0
            //rot: 1.0
        }
    },
    'axe_infamy_shocking': {
        attackType: WeaponAttackType.Slashing,
        id: 'axe_infamy_shocking',
        name: 'Infamy Axe of Shocking',
        type: 'melee',
        rarity: 'epic',
        weapType: 'axe_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.25,
        headshotMult: 1.0,
        baseDamage: 13,
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Shock enemies on hit.',
        speed: {
            equip: 0.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Cleave',
                damage: 8.0,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.NormalAttackMelee,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.466,
                    end: 0.866
                }],

                //Status effects
                effects: [{
                    name: 'm_shockEffect',
                    chance: 0.4,
                    params: {
                        damagePercentage: 1.5,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/light',
                    animDuration: 0.866,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave',
                        start: 0.466
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Cleave',
                chargeDamage: true,
                width: 2,
                height: 3,
                cooldownTime: 0.5,

                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -4.0,
                cancelable: true,

                offset: {
                    x: 2,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 10.0,
                    maxDamage: 50.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.4,
                    end: 0.8
                }],

                //Status effects
                effects: [{
                    name: 'm_shockEffect',
                    chance: 0.8,
                    params: {
                        damagePercentage: 25,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/axe/heavy',
                    animDuration: 0.8,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cleave_strong',
                        start: 0.4
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/axe/heavy_charge',
                    runChargeAnimName: 'attack/axe/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Leap',
                damage: 5.0,
                width: 2.7,
                height: 2.7,
                cooldownTime: 8,

                behaviourId: SkillsEnum.DashAttackWithAnticipation,

                //Default offset up
                offset: {
                    x: 2.5,
                    y: 0
                },

                offset_right: {
                    x: 2.5,
                    y: -1.5
                },

                offset_left: {
                    x: 2.5,
                    y: 1.5
                },

                //Behavior params
                dash: {
                    distance: 15,
                    duration: 0.234,
                    animate: false,
                    startAnimTime: 0.166,
                    cantMove: true
                },

                damageTimes: [{
                    start: 0.533,
                    end: 1.0
                }],

                //Visuals
                icon: 'Icon_Axe_Leap.img',
                animationObj: {
                    animName: 'attack/axe/skill_02',
                    animDuration: 1.0,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_leap',
                        start: 0.3
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'large'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Crusher',
                damage: 0,
                width: 9,
                height: 9,
                cooldownTime: 10,

                behaviourId: SkillsEnum.CrusherAttack,
                useSpeedPenalty: -4.0,

                offset: {
                    x: 0,
                    y: 0
                },

                //Behavior params
                pullEffect: {
                    speed: 6.0,
                    duration: 0.1, //This is per update 
                    //Is basically the frecuency in which will calculate the direction and apply the effect to the enemies, while the attack is active
                    width: 9,
                    height: 9
                },

                damageTimes: [{
                    start: 0.533,
                    end: 0.70
                }],

                //Visuals
                icon: 'Icon_Axe_Crusher.img',
                animationObj: {
                    animName: 'attack/axe/skill_01',
                    animDuration: 1,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_crusher',
                        start: 0.35
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Cyclone',
                damage: 0,
                width: 5.5,
                height: 5.5,
                cooldownTime: 20,

                behaviourId: SkillsEnum.CycloneAttack,
                useSpeedPenalty: -2.5,

                offset: {
                    x: 0,
                    y: 0
                },

                //Behavior params
                cycloneParams: {
                    damageFrecuency: 0.5
                },

                damageTimes: [],

                //Visuals
                icon: 'Icon_Axe_Cyclone.img',
                animationObj: {
                    animName: 'attack/axe/skill_03',
                    animDuration: 5,
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_axe_cyclone_loop',
                        start: 0.0,
                        loop: true
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Axe_Light_Attack.img',
        heavyAttackIcon: 'Icon_Axe_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/axes/axe_infamy',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-axe_infamy.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true,
            scale: 1.0
            //rot: 1.0
        }
    }
};

var DaggerVariants = {
    'dagger_dirk_poisoning': {
        attackType: WeaponAttackType.Piercing,
        id: 'dagger_dirk_poisoning',
        name: 'Dirk of Poisoning',
        type: 'melee',
        rarity: 'common',
        weapType: 'dagger_type',
        quality: 0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 7,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Stab',
                damage: 1.0,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,

                offset: {
                    x: 1,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Status effects
                effects: [{
                    name: 'm_poisonEffect',
                    chance: 0.2,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Stab',
                chargeDamage: true,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -2.0,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 0.0,
                    maxDamage: 43.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Status effects
                effects: [{
                    name: 'm_poisonEffect',
                    chance: 0.4,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/heavy',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab_strong',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/dagger/heavy_charge',
                    runChargeAnimName: 'attack/dagger/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shadow Step',
                damage: 5.0,
                width: 1.8,
                height: 1.8,
                cooldownTime: 10,
                cancelable: true,
                freeDirection: true,
                allowChargeHeavyAttack: true,
                useSpeedPenalty: 5,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                offset: {
                    x: 0,
                    y: 1.5
                },

                //Behaviour params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_invisibleEffect',
                    statusEffectParams: {
                        time: 4
                    },

                    playAnimationWhenFinished: true,
                    //Animation
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/dagger/smoke_bomb',
                        finish: 'weapons/dagger/smoke_bomb',
                        pivot: {
                            x: 15,
                            y: 0
                        }
                    }
                },

                damageTimes: [0.0],

                //Visuals
                icon: 'Icon_Dagger_Shadow_Step.img',
                animationObj: {
                    animName: 'attack/dagger/skill_01',
                    animDuration: 0.2,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_shadow_step',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            }
        },

        //FXs
        icon: 'Icon_Dagger_Light_Attack.img',
        heavyAttackIcon: 'Icon_Dagger_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/daggers/dagger_dirk',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-dagger_dirk.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'dagger_cutlass_poisoning': {
        attackType: WeaponAttackType.Piercing,
        id: 'dagger_cutlass_poisoning',
        name: 'Cutlass of Poisoning',
        type: 'melee',
        rarity: 'rare',
        weapType: 'dagger_type',
        quality: 0,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 10,
        stats: 'Damage: {baseDamage}',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Stab',
                damage: 1.0,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                cancelable: true,

                behaviourId: SkillsEnum.NormalAttackMelee,

                offset: {
                    x: 1,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Status effects
                effects: [{
                    name: 'm_poisonEffect',
                    chance: 0.3,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Stab',
                chargeDamage: true,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -2.0,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 0.0,
                    maxDamage: 43.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0,
                    end: 0.266
                }],

                //Status effects
                effects: [{
                    name: 'm_poisonEffect',
                    chance: 0.6,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/heavy',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab_strong',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/dagger/heavy_charge',
                    runChargeAnimName: 'attack/dagger/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shadow Step',
                damage: 5.0,
                width: 1.8,
                height: 1.8,
                cooldownTime: 10,
                cancelable: true,
                freeDirection: true,
                allowChargeHeavyAttack: true,
                useSpeedPenalty: 5,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                offset: {
                    x: 0,
                    y: 1.5
                },

                //Behaviour params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_invisibleEffect',
                    statusEffectParams: {
                        time: 4
                    },

                    playAnimationWhenFinished: true,
                    //Animation
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/dagger/smoke_bomb',
                        finish: 'weapons/dagger/smoke_bomb',
                        pivot: {
                            x: 15,
                            y: 0
                        }
                    }
                },

                damageTimes: [0.0],

                //Visuals
                icon: 'Icon_Dagger_Shadow_Step.img',
                animationObj: {
                    animName: 'attack/dagger/skill_01',
                    animDuration: 0.2,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_shadow_step',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Viper Strike',
                bulletType: 'dagger_projectile_skill_2',
                numBullets: 1,
                bulletCount: 1,
                cooldownTime: 6.0,
                shootDelay: 0.333,
                firstShootDelay: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                //Visuals
                icon: 'Icon_Dagger_Viper_Strike.img',
                animationObj: {
                    animName: 'throw',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_viper_strike',
                        start: 0.266
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Dagger_Light_Attack.img',
        heavyAttackIcon: 'Icon_Dagger_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/daggers/darger_cutlass',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-dagger_cutlass.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    },
    'dagger_gaia_poisoning': {
        attackType: WeaponAttackType.Piercing,
        id: 'dagger_gaia_poisoning',
        name: 'Gaia of Poisoning',
        type: 'gun',
        rarity: 'epic',
        weapType: 'dagger_type',
        quality: 0,
        fireMode: 'single',
        caseTiming: 'shoot',
        ammo: '9mm',
        ammoSpawnCount: 0,
        ammoInfinite: true,
        maxClip: 30,
        maxReload: 30,
        extendedClip: 40,
        extendedReload: 40,
        reloadTime: 2.0,
        fireDelay: 0.09,
        barrelLength: 0.950,
        barrelOffset: 0.0,
        recoilTime: 1.0e10,
        moveSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed
        shotSpread: 0, //This could cause odd behaviour, TODO define in each attack if needed

        armorPiercing: true,
        cleave: true,
        autoAttack: false,
        switchDelay: 0.25,
        obstacleDamage: 1.5,
        headshotMult: 1.0,
        baseDamage: 13,
        stats: 'Damage: {baseDamage}',
        effects: 'Has a chance to Poison enemies on hit.',
        speed: {
            equip: 1.0
        },

        //Attacks
        attacks: {
            lightAttack: {
                id: 'lightAttack',
                name: 'Stab',
                damage: 1.0,
                width: 1,
                height: 1,
                cooldownTime: 0.1,

                behaviourId: SkillsEnum.NormalAttackMelee,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0.0
                },

                damageTimes: [{
                    start: 0.133,
                    end: 0.266
                }],

                //Status effects
                effects: [{
                    name: 'm_poisonEffect',
                    chance: 0.4,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/light',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                }
            },
            heavyAttack: {
                id: 'heavyAttack',
                name: 'Strong Stab',
                chargeDamage: true,
                width: 1,
                height: 1,
                cooldownTime: 0.1,
                behaviourId: SkillsEnum.HeavyAttackSword,
                useSpeedPenalty: -2.0,
                cancelable: true,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behavior params
                behaviourParams: {
                    minDamage: 0.0,
                    maxDamage: 43.0,
                    minChargeTime: 0.15,
                    maxChargeTime: 3,
                    minChargeTimeTouch: 0.40,
                    maxChargeTimeTouch: 3
                },

                damageTimes: [{
                    start: 0.133,
                    end: 0.266
                }],

                //Status effects
                effects: [{
                    name: 'm_poisonEffect',
                    chance: 0.8,
                    params: {
                        damage: 0.015,
                        time: 5
                    }
                }],

                //Visuals
                animationObj: {
                    animName: 'attack/dagger/heavy',
                    animDuration: 0.266,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_stab_strong',
                        start: 0.133
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                chargeAnimationObj: {
                    chargeAnimName: 'attack/dagger/heavy_charge',
                    runChargeAnimName: 'attack/dagger/run_charge',
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_charge_up',
                        start: 0
                    }
                }
            },

            //Skills
            skill_1: {
                id: 'skill_1',
                name: 'Shadow Step',
                damage: 5.0,
                width: 1.8,
                height: 1.8,
                cooldownTime: 10,
                cancelable: true,
                freeDirection: true,
                allowChargeHeavyAttack: true,
                useSpeedPenalty: 5,

                behaviourId: SkillsEnum.ApplyStatusEffect,
                activeWithStatusEffect: true,

                offset: {
                    x: 0,
                    y: 1.5
                },

                //Behaviour params
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_invisibleEffect',
                    statusEffectParams: {
                        time: 4
                    },

                    playAnimationWhenFinished: true,
                    //Animation
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'weapons/dagger/smoke_bomb',
                        finish: 'weapons/dagger/smoke_bomb',
                        pivot: {
                            x: 15,
                            y: 0
                        }
                    }
                },

                damageTimes: [0.0],

                //Visuals
                icon: 'Icon_Dagger_Shadow_Step.img',
                animationObj: {
                    animName: 'attack/dagger/skill_01',
                    animDuration: 0.2,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_shadow_step',
                        start: 0
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'circular'
                }
            },
            skill_2: {
                id: 'skill_2',
                name: 'Viper Strike',
                bulletType: 'dagger_projectile_skill_2',
                numBullets: 1,
                bulletCount: 1,
                cooldownTime: 6.0,
                shootDelay: 0.333,
                firstShootDelay: true,

                behaviourId: SkillsEnum.NormalAttackRange,
                useSpeedPenalty: -4.0,

                //Visuals
                icon: 'Icon_Dagger_Viper_Strike.img',
                animationObj: {
                    animName: 'throw',
                    animDuration: 0.466,
                    loop: false,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_viper_strike',
                        start: 0.266
                    },
                    useCursorDirection: true,
                    fixedDirection: true
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            },
            skill_3: {
                id: 'skill_3',
                name: 'Blade Flurry',
                damage: -5.0,
                width: 1.7,
                height: 1.7,
                cooldownTime: 9,

                behaviourId: SkillsEnum.BladeFlurryAttack,
                useSpeedPenalty: -2.0,

                offset: {
                    x: 1,
                    y: 0
                },

                //Behaviour params
                behaviourParams: {
                    //Animation duration (To match the damage with the animation)
                    damageFrecuency: 0.2
                },

                //Status effects
                effects: [{
                    name: 'm_bleedEffect',
                    chance: 0.15,
                    params: {
                        damage: 0.025,
                        time: 5
                    }
                }],

                damageTimes: [],

                //Visuals
                icon: 'Icon_Dagger_Blade_Flurry.img',
                animationObj: {
                    animName: 'attack/dagger/skill_03',
                    animDuration: 2, //Attack duration (because animation is in loop)
                    loop: true,
                    track: 0,
                    sound: {
                        name: 'sfx_weapons_dagger_blade_flurry_loop',
                        start: 0,
                        loop: true
                    },
                    useCursorDirection: true,
                    fixedDirection: false
                },
                telegraph: {
                    type: 'arrow',
                    size: 'medium'
                }
            }
        },

        //FXs
        icon: 'Icon_Dagger_Light_Attack.img',
        heavyAttackIcon: 'Icon_Dagger_Heavy_Attack.img',
        spineAsset: 'weapons/mainhand/melee/daggers/dagger_gaia',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'medium_swing_01',
            deploy: 'stow_weapon_01',
            playerHit: 'knife_hit_01'
        },
        lootImg: {
            sprite: 'loot-dagger_gaia.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            rad: 25.0,
            mirror: true
            //rot: 1.0
        }
    }
};

var MainHandWeaps = util.mergeDeep({}, RangeWeapons, MeleeWeapons, StaffVariants, BowVariants, SwordVariants, AxeVariants, DaggerVariants, WandVariants);
module.exports = MainHandWeaps;
