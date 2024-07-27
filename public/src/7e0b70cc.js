"use strict";


var SkillsEnum = require("./skillsEnum.js");
/**Default loot container scale 1.4
 * Default loot sprite scale 1.0
 * Params scale:1.4
 *        innerScale: 1.0
 */
var OffHands = {
    'gravity_orb': {
        id: 'gravity_orb',
        name: 'Gravity Orb',
        type: 'melee',
        offHand: true,
        slotMax: 3,
        icon: 'icon_gravity_orb.img',
        effects: 'Pushes surrounding enemies away when activated.',
        slot: 'weapons/offhand/orb/gravity',
        spineAsset: 'weapons/offhand/orb/gravity',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-gravity-orb.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff
        },
        damageTimes: [0.25],
        //Skills
        skills: {
            skill_1: {
                id: 'skill_1',
                name: "Force Push",
                isOffHand: true,
                cooldownTime: 0.0,

                useSpeedPenalty: -4.0,
                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 10.0,
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
                        idle: 'offhand/gravity_orb',
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
                    }
                },

                telegraph: {
                    type: 'circular'
                },

                //Animation data
                damageTimes: [0.25],
                animation: 'attack/orb/skill_01'
            }
        }
    },

    'wyvern_heart': {
        id: 'wyvern_heart',
        name: 'Wyvern Heart',
        type: 'melee',
        offHand: true,
        slotMax: 3,
        icon: 'icon_wyverns_heart.img',
        effects: 'Burn nearby players when activated.',
        slot: 'weapons/offhand/orb/wyverns_heart',
        spineAsset: 'weapons/offhand/orb/wyverns_heart',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-wyverns-heart.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff
        },
        damageTimes: [0.25],
        //Skills
        skills: {
            skill_1: {
                id: 'skill_1',
                name: "Scorch",
                isOffHand: true,
                cooldownTime: 10.0,

                useSpeedPenalty: -4.0,
                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 10.0,
                    duration: 1.1,
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
                        idle: 'offhand/wyverns_heart',
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
                    }
                },

                telegraph: {
                    type: 'circular'
                },

                //Animation data
                damageTimes: [0.25],
                animation: 'attack/orb/skill_01'
            }
        }
    },

    'frost_core': {
        id: 'frost_core',
        name: 'Frost Core',
        type: 'melee',
        offHand: true,
        slotMax: 3,
        icon: 'icon_frost_core.img',
        effects: 'Burn nearby players when activated.',
        slot: 'weapons/offhand/orb/frost_core',
        spineAsset: 'weapons/offhand/orb/frost_core',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-frost-core.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff
        },
        damageTimes: [0.25],
        //Skills
        skills: {
            skill_1: {
                id: 'skill_1',
                name: "Frost Nova",
                isOffHand: true,
                cooldownTime: 10.0,

                useSpeedPenalty: -4.0,
                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 10.0,
                    duration: 1.1,
                    effects: [{
                        name: 'm_chillEffect',
                        chance: 1,
                        params: {
                            speedPercentage: 50,
                            time: 5
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'offhand/frost_core',
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
                    }
                },

                telegraph: {
                    type: 'circular'
                },

                //Animation data
                damageTimes: [0.25],
                animation: 'attack/orb/skill_01'
            }
        }
    },

    'light_flare': {
        id: 'light_flare',
        name: 'Light_Flare',
        type: 'melee',
        offHand: true,
        slotMax: 3,
        icon: 'icon_light_flare.img',
        effects: 'Burn nearby players when activated.',
        slot: 'weapons/offhand/orb/light_flare',
        spineAsset: 'weapons/offhand/orb/light_flare',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-light-flare.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff
        },
        damageTimes: [0.25],
        //Skills
        skills: {
            skill_1: {
                id: 'skill_1',
                name: "Blinding Flash",
                isOffHand: true,
                cooldownTime: 10.0,

                useSpeedPenalty: -4.0,
                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 10.0,
                    duration: 1.1,
                    effects: [{
                        name: 'm_blindEffect',
                        chance: 1,
                        params: {
                            points: 10,
                            time: 5
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'offhand/light_flare',
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
                    }
                },

                telegraph: {
                    type: 'circular'
                },

                //Animation data
                damageTimes: [0.25],
                animation: 'attack/orb/skill_01'
            }
        }
    },

    'unstable_electrode': {
        id: 'unstable_electrode',
        name: 'Unstable Electrode',
        type: 'melee',
        offHand: true,
        slotMax: 3,
        icon: 'icon_unstable_electrode.img',
        effects: 'Burn nearby players when activated.',
        slot: 'weapons/offhand/orb/unstable_battery',
        spineAsset: 'weapons/offhand/orb/unstable_battery',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-unstable-electrode.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff
        },
        damageTimes: [0.25],
        //Skills
        skills: {
            skill_1: {
                id: 'skill_1',
                name: "Electric Surge",
                isOffHand: true,
                cooldownTime: 10.0,

                useSpeedPenalty: -4.0,
                behaviourId: SkillsEnum.ApplyEffectToNearbyEnemies,

                behaviourParams: {
                    rad: 10.0,
                    duration: 1.1,
                    effects: [{
                        name: 'm_shockEffect',
                        chance: 1,
                        params: {
                            damagePercentage: 25,
                            time: 5
                        }
                    }],

                    //Visuals
                    spine: {
                        enabled: true,
                        spineType: 'fx',
                        skin: 'default',
                        scale: 1,
                        idle: 'offhand/unstable_battery',
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
                    }
                },

                telegraph: {
                    type: 'circular'
                },

                //Animation data
                damageTimes: [0.25],
                animation: 'attack/orb/skill_01'
            }
        }
    },

    'shield': {
        id: 'shield',
        name: 'Shield',
        type: 'melee',
        offHand: true,
        icon: 'loot-emerald-shield.img',
        effects: 'Blocks all incoming damage for x seconds',
        slot: 'weapons/offhand/shields/emerald_knight',
        spineAsset: 'weapons/offhand/shields/emerald_knight',
        sound: {
            pickup: 'frag_pickup_01',
            swing: 'knife_swing_01',
            deploy: 'frag_pickup_01',
            playerHit: 'crowbar_hit_01'
        },
        lootImg: {
            sprite: 'loot-emerald-shield.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff
        },
        skills: {
            skill_1: {
                id: 'skill_1',
                name: "Shield's Up",
                cancelable: true,
                activeWithStatusEffect: true,
                isOffHand: true,
                cooldownTime: 8,
                useSpeedPenalty: -4,
                behaviourId: SkillsEnum.ApplyStatusEffect,
                behaviourParams: {
                    //Status effect
                    statusEffectName: 'm_shieldEffect',
                    statusEffectParams: {
                        duration: 2
                    }
                },

                damageTimes: [0.25],
                animation: null,
                animDuration: 0.1,
                ignoreIsAttacking: true,
                walkAnimation: 'attack/shield/run',
                idleAnimation: 'attack/shield/idle'
            }
        }
    }
};

module.exports = OffHands;
