"use strict";


var kExplosionDefs = {
    'explosion_bomb': {
        type: 'explosion',
        damage: 40.0,
        obstacleDamage: 1.1,
        rad: { min: 5.0, max: 6.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'frag',
        decalType: 'decal_frag_explosion',
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1.4,
            animation: 'Bomb/explosion',
            duration: 0.6667
        }
    },
    'explosion_frag': {
        type: 'explosion',
        damage: 125.0,
        obstacleDamage: 1.1,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 12,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'frag',
        decalType: 'decal_frag_explosion'
    },
    'explosion_spark': {
        type: 'explosion',
        damage: 20.0,
        obstacleDamage: 1.1,
        rad: { min: 2.0, max: 3.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'frag',
        decalType: 'decal_frag_explosion',
        invulnerableOwner: true, //Owner doesn't receive damage
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1.4,
            animation: 'Staff/trail_orb_blast',
            duration: 0.6667
        }
    },
    'explosion_staff_skill_1': {
        type: 'explosion',
        damage: 30.0,
        obstacleDamage: 1.1,
        rad: { min: 5.0, max: 6.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'frag',
        decalType: 'decal_frag_explosion',
        hidden: true,
        invulnerableOwner: true //Owner doesn't receive damage
    },
    'explosion_smoke': {
        type: 'explosion',
        damage: 0.0,
        obstacleDamage: 1.0,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'smoke',
        decalType: 'decal_smoke_explosion'
    },
    'explosion_strobe': {
        type: 'explosion',
        damage: 1.0,
        obstacleDamage: 5.0,
        rad: { min: 1.5, max: 2.5 },
        shrapnelCount: 3,
        shrapnelType: 'shrapnel_strobe',
        explosionEffectType: 'strobe',
        decalType: 'decal_smoke_explosion'
    },
    'explosion_barrel': {
        type: 'explosion',
        damage: 125.0,
        obstacleDamage: 1.0,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 12,
        shrapnelType: 'shrapnel_barrel',
        explosionEffectType: 'barrel',
        decalType: 'decal_barrel_explosion'
    },
    'explosion_stove': {
        type: 'explosion',
        damage: 125.0,
        obstacleDamage: 2.0,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 16,
        shrapnelType: 'shrapnel_stove',
        explosionEffectType: 'barrel',
        decalType: 'decal_barrel_explosion'
    },
    'explosion_usas': {
        type: 'explosion',
        damage: 42.0,
        obstacleDamage: 4.0,
        rad: { min: 3.5, max: 6.5 },
        shrapnelCount: 9,
        shrapnelType: 'shrapnel_usas',
        explosionEffectType: 'usas',
        decalType: 'decal_frag_small_explosion'
    },
    'explosion_rounds': {
        damage: 3.0,
        obstacleDamage: 15.0,
        rad: { min: 0.75, max: 1.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_usas',
        explosionEffectType: 'rounds',
        decalType: 'decal_rounds_explosion'
    },
    'explosion_rounds_sg': {
        damage: 3.0,
        obstacleDamage: 15.0,
        rad: { min: 0.75, max: 1.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_usas',
        explosionEffectType: 'rounds_sg',
        decalType: 'decal_rounds_explosion'
    },
    'explosion_mirv': {
        type: 'explosion',
        damage: 125.0,
        obstacleDamage: 1.1,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 12,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'mirv',
        decalType: 'decal_frag_explosion'
    },
    'explosion_mirv_mini': {
        type: 'explosion',
        damage: 75.0,
        obstacleDamage: 1.1,
        rad: { min: 4.0, max: 8.0 },
        shrapnelCount: 7,
        shrapnelType: 'shrapnel_mirv_mini',
        explosionEffectType: 'mirv_mini',
        decalType: 'decal_frag_small_explosion'
    },
    'explosion_martyr_nade': {
        type: 'explosion',
        damage: 80.0,
        obstacleDamage: 1.1,
        rad: { min: 4.5, max: 9.0 },
        shrapnelCount: 8,
        shrapnelType: 'shrapnel_mirv_mini',
        explosionEffectType: 'martyr_nade',
        decalType: 'decal_frag_small_explosion'
    },
    'explosion_snowball': {
        type: 'explosion',
        damage: 2.0,
        obstacleDamage: 1.0,
        rad: { min: 1.24, max: 1.25 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'snowball',
        decalType: 'decal_snowball_explosion'
    },
    'explosion_snowball_heavy': {
        type: 'explosion',
        damage: 5.0,
        obstacleDamage: 1.0,
        rad: { min: 1.24, max: 1.25 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'snowball_heavy',
        decalType: 'decal_snowball_explosion'
    },
    'explosion_potato': {
        type: 'explosion',
        damage: 2.0,
        obstacleDamage: 1.0,
        teamDamage: false,
        rad: { min: 1.24, max: 1.25 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'potato',
        decalType: 'decal_potato_explosion'
    },
    'explosion_potato_heavy': {
        type: 'explosion',
        damage: 5.0,
        obstacleDamage: 1.0,
        teamDamage: false,
        rad: { min: 1.24, max: 1.25 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'potato_heavy',
        decalType: 'decal_potato_explosion'
    },
    'explosion_potato_cannonball': {
        type: 'explosion',
        damage: 95.0,
        obstacleDamage: 1.3,
        teamDamage: false,
        rad: { min: 3.5, max: 6.5 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'potato_cannonball',
        decalType: 'decal_frag_small_explosion'
    },
    'explosion_rainbow_projectile': {
        type: 'explosion',
        damage: 1000.0,
        obstacleDamage: 1000.0,
        teamDamage: false,
        rad: { min: 1.0, max: 2.0 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'rounds',
        decalType: 'decal_rounds_explosion'
    },
    'explosion_heart_cannonball': {
        type: 'explosion',
        damage: 95.0,
        obstacleDamage: 1.3,
        teamDamage: false,
        rad: { min: 3.5, max: 6.5 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'heart_cannonball',
        decalType: 'decal_heart_explosion'
    },
    'explosion_potato_smgshot': {
        type: 'explosion',
        damage: 12.0,
        obstacleDamage: 1.25,
        teamDamage: false,
        rad: { min: 1.25, max: 1.75 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'potato_smgshot',
        decalType: ''
    },

    'explosion_fire': {
        type: 'explosion',
        damage: 4.0,
        obstacleDamage: 1.25,
        teamDamage: false,
        rad: { min: 1.25, max: 1.75 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'fire_shot',
        decalType: ''
    },

    'explosion_bomb_iron': {
        type: 'explosion',
        damage: 40.0,
        obstacleDamage: 2.0,
        rad: { min: 5.0, max: 14.0 },
        shrapnelCount: 2,
        shrapnelType: 'shrapnel_bomb_iron',
        explosionEffectType: 'bomb_iron',
        decalType: 'decal_bomb_iron_explosion'
    },

    'explosion_motherShip': {
        type: 'explosion',
        damage: 100.0,
        obstacleDamage: 100.0,
        rad: { min: 5.0, max: 18.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_bomb_iron',
        explosionEffectType: 'motherShip_cannon',
        decalType: 'decal_bomb_iron_explosion'
    },

    'lightning_explosion': {
        type: 'explosion',
        damage: 200.0,
        obstacleDamage: 150.0,
        rad: { min: 10.0, max: 20.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_bomb_iron',
        explosionEffectType: 'thunder_explosion',
        decalType: 'decal_lightning_explosion'
    },
    'explosion_heart_frag': {
        type: 'explosion',
        damage: 125.0,
        obstacleDamage: 1.1,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 12,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'heart_frag',
        decalType: 'decal_heart_explosion'
    },
    'explosion_40mm_granade': {
        type: 'explosion',
        damage: 125.0,
        obstacleDamage: 1.1,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 12,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'frag',
        decalType: 'decal_frag_explosion'
    },
    'explosion_water_balloon': {
        type: 'explosion',
        damage: 2.0,
        obstacleDamage: 1.0,
        rad: { min: 1.24, max: 1.25 },
        shrapnelCount: 0,
        shrapnelType: '',
        explosionEffectType: 'water_balloon',
        decalType: 'decal_snowball_explosion'
    },
    'explosion_skitternade': {
        /* type: 'explosion',
         damage: 0.0,
         obstacleDamage: 0.0,
         rad: { min: 5.0, max: 12.0 },
         shrapnelCount: 0,
         shrapnelType: 'shrapnel_skitternade',
         explosionEffectType: 'skitternade',
         decalType: ''*/

        type: 'explosion',
        damage: 0.0,
        obstacleDamage: 0.0,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'smoke',
        decalType: 'decal_smoke_explosion'
    },
    'explosion_antiFire': {
        type: 'explosion',
        damage: 0.0,
        obstacleDamage: 0.0,
        rad: { min: 5.0, max: 12.0 },
        shrapnelCount: 0,
        shrapnelType: 'shrapnel_frag',
        explosionEffectType: 'antiFire',
        decalType: 'decal_smoke_explosion'
    }
};

module.exports = kExplosionDefs;
