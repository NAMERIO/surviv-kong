"use strict";


var util = require("./util.js");
var BehaviourEnum = require("./behaviourEnum.js");

var _require = require("./cb7a977d.js"),
    WeaponAttackType = _require.WeaponAttackType;

function defineBullet(baseType, params) {
    return util.mergeDeep({}, BaseDefs[baseType], { baseType: baseType }, params);
}

var BaseDefs = {
    'bullet_mp5': {
        type: 'bullet',
        damage: 40.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 20.0,
        speed: 20.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7,
        worldImg: {
            sprite: 'part-fire-01.img',
            scale: 0.5,
            tint: 0xFFFFFF,
            sprites: ['part-fire-01.img', 'part-fire-02.img', 'part-fire-03.img']
        }
    },
    'bullet_ak47': {
        type: 'bullet',
        damage: 13.5,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 200.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_water': {
        type: 'bullet',
        damage: 5.5,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 200.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'water',
        tracerWidth: 0.1,
        tracerLength: 2.5,
        onHit: 'explosion_water_balloon'
    },
    'bullet_scar': {
        type: 'bullet',
        damage: 15.0,
        obstacleDamage: 1.0,
        falloff: 0.85,
        distance: 175.0,
        speed: 108.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_an94': {
        type: 'bullet',
        damage: 17.5,
        obstacleDamage: 1.0,
        falloff: 0.94,
        distance: 300.0,
        speed: 110.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_groza': {
        type: 'bullet',
        damage: 12.5,
        obstacleDamage: 1.0,
        falloff: 0.85,
        distance: 175.0,
        speed: 104.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_grozas': {
        type: 'bullet',
        damage: 13.0,
        obstacleDamage: 1.0,
        falloff: 0.87,
        distance: 185.0,
        speed: 106.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_model94': {
        type: 'bullet',
        damage: 44.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        distance: 175.0,
        speed: 156.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '45acp',
        tracerWidth: 0.12,
        tracerLength: 1.0
    },
    'bullet_blr': {
        type: 'bullet',
        damage: 56.0,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 400.0,
        speed: 160.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.14,
        tracerLength: 1.0
    },
    'bullet_mosin': {
        type: 'bullet',
        damage: 72.0,
        obstacleDamage: 1.5,
        falloff: 0.95,
        distance: 500.0,
        speed: 178.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.16,
        tracerLength: 1.0
    },
    'bullet_sv98': {
        type: 'bullet',
        damage: 80.0,
        obstacleDamage: 1.5,
        falloff: 0.96,
        distance: 520.0,
        speed: 182.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.2,
        tracerLength: 1.0
    },
    'bullet_awc': {
        type: 'bullet',
        damage: 180.0,
        obstacleDamage: 1.5,
        falloff: 0.94,
        distance: 300.0,
        speed: 136.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '308sub',
        tracerWidth: 0.2,
        tracerLength: 1.0
    },
    'bullet_scarssr': {
        type: 'bullet',
        damage: 60.0,
        obstacleDamage: 1.5,
        falloff: 0.85,
        distance: 200.0,
        speed: 108.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '308sub',
        tracerWidth: 0.14,
        tracerLength: 1.0
    },
    'bullet_m39': {
        type: 'bullet',
        damage: 27.0,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 400.0,
        speed: 125.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_svd': {
        type: 'bullet',
        damage: 36.0,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 425.0,
        speed: 127.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_garand': {
        type: 'bullet',
        damage: 35.0,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 400.0,
        speed: 130.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.12,
        tracerLength: 0.9
    },
    'bullet_buckshot': {
        type: 'bullet',
        damage: 12.5,
        obstacleDamage: 1.0,
        falloff: 0.3,
        speed: 66.0,
        distance: 27.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '12gauge',
        tracerWidth: 0.1,
        tracerLength: 0.8
    },
    'bullet_flechette': {
        type: 'bullet',
        damage: 8.75,
        obstacleDamage: 1.0,
        falloff: 0.85,
        speed: 88.0,
        distance: 45.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '12gauge',
        tracerWidth: 0.075,
        tracerLength: 0.5
    },
    'bullet_frag': {
        type: 'bullet',
        damage: 12.0,
        obstacleDamage: 1.0,
        falloff: 0.3,
        speed: 72.0,
        distance: 24.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'frag',
        tracerWidth: 0.1,
        tracerLength: 0.5,
        onHit: 'explosion_usas'
    },
    'bullet_slug': {
        type: 'bullet',
        damage: 77.0,
        obstacleDamage: 1.0,
        falloff: 0.85,
        speed: 118.0,
        distance: 60.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '12gauge',
        tracerWidth: 0.2,
        tracerLength: 0.4
    },
    'bullet_birdshot': {
        type: 'bullet',
        damage: 4.0,
        obstacleDamage: 1.0,
        falloff: 0.25,
        speed: 66.0,
        distance: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '12gauge',
        tracerWidth: 0.1,
        tracerLength: 0.1
    },
    'bullet_m9': {
        type: 'bullet',
        damage: 12.0,
        obstacleDamage: 1.0,
        falloff: 0.7,
        speed: 85.0,
        distance: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_m9_cursed': {
        type: 'bullet',
        damage: 12.0,
        obstacleDamage: 1.0,
        falloff: 0.7,
        speed: 85.0,
        distance: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm_cursed',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_m93r': {
        type: 'bullet',
        damage: 12.0,
        obstacleDamage: 1.0,
        falloff: 0.7,
        speed: 85.0,
        distance: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_p30l': {
        type: 'bullet',
        damage: 21.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        speed: 94.0,
        distance: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.12,
        tracerLength: 0.8
    },
    'bullet_ot38': {
        type: 'bullet',
        damage: 26.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        speed: 112.0,
        distance: 125.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.09,
        tracerLength: 0.8
    },
    'bullet_ots38': {
        type: 'bullet',
        damage: 32.0,
        obstacleDamage: 1.0,
        falloff: 0.77,
        speed: 115.0,
        distance: 135.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.8
    },
    'bullet_colt45': {
        type: 'bullet',
        damage: 29.0,
        obstacleDamage: 1.0,
        falloff: 0.7,
        speed: 106.0,
        distance: 110.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '45acp',
        tracerWidth: 0.09,
        tracerLength: 0.8
    },
    'bullet_m1911': {
        type: 'bullet',
        damage: 14.0,
        obstacleDamage: 1.0,
        falloff: 0.7,
        speed: 80.0,
        distance: 88.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '45acp',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_m1a1': {
        type: 'bullet',
        damage: 13.0,
        obstacleDamage: 1.0,
        falloff: 0.8,
        distance: 88.0,
        speed: 80.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '45acp',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_mkg45': {
        type: 'bullet',
        damage: 28.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        distance: 145.0,
        speed: 126.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '45acp',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_deagle': {
        type: 'bullet',
        damage: 35.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        speed: 115.0,
        distance: 120.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '50AE',
        tracerWidth: 0.12,
        tracerLength: 0.8
    },
    'bullet_lasr': {
        type: 'bullet',
        damage: 42.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        speed: 115.0,
        distance: 240.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'laser',
        tracerWidth: 0.12,
        tracerLength: 0.8
    },

    'bullet_rainbow': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 0.0,
        falloff: 0.75,
        speed: 90.0,
        distance: 1.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'rainbowTrail',
        tracerWidth: 0.5,
        tracerLength: 1.5,
        skipCollision: true
    },

    'bullet_mac10': {
        type: 'bullet',
        damage: 9.25,
        obstacleDamage: 1.0,
        falloff: 0.6,
        distance: 10.0,
        speed: 1.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 10.0
    },
    'bullet_ump9': {
        type: 'bullet',
        damage: 15.0,
        obstacleDamage: 1.0,
        falloff: 0.75,
        distance: 100.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_vector': {
        type: 'bullet',
        damage: 7.5,
        obstacleDamage: 1.0,
        falloff: 0.6,
        distance: 46.0,
        speed: 88.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_vector45': {
        type: 'bullet',
        damage: 9.5,
        obstacleDamage: 1.0,
        falloff: 0.6,
        distance: 45.0,
        speed: 82.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '45acp',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_scorpion': {
        type: 'bullet',
        damage: 10.75,
        obstacleDamage: 1.0,
        falloff: 0.77,
        distance: 120.0,
        speed: 90.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_vss': {
        type: 'bullet',
        damage: 22.0,
        obstacleDamage: 1.0,
        falloff: 0.8,
        distance: 125.0,
        speed: 95.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.8
    },
    'bullet_dp28': {
        type: 'bullet',
        damage: 14.0,
        obstacleDamage: 1.5,
        falloff: 0.9,
        distance: 225.0,
        speed: 110.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_bar': {
        type: 'bullet',
        damage: 17.5,
        obstacleDamage: 1.75,
        falloff: 0.9,
        distance: 275.0,
        speed: 114.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_pkp': {
        type: 'bullet',
        damage: 18.0,
        obstacleDamage: 2.0,
        falloff: 0.9,
        distance: 200.0,
        speed: 120.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_pkm': {
        type: 'bullet',
        damage: 15.0,
        obstacleDamage: 2.0,
        falloff: 0.9,
        distance: 200.0,
        speed: 130.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_glock': {
        type: 'bullet',
        damage: 9.0,
        obstacleDamage: 1.0,
        falloff: 0.5,
        speed: 70.0,
        distance: 44.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.1,
        tracerLength: 0.7
    },
    'bullet_famas': {
        type: 'bullet',
        damage: 17.0,
        obstacleDamage: 1.0,
        falloff: 0.8,
        distance: 150.0,
        speed: 110.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_hk416': {
        type: 'bullet',
        damage: 11.0,
        obstacleDamage: 1.0,
        falloff: 0.85,
        distance: 175.0,
        speed: 105.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_m4a1': {
        type: 'bullet',
        damage: 14.0,
        obstacleDamage: 1.0,
        falloff: 0.82,
        distance: 165.0,
        speed: 98.0,
        variance: 0.0,
        shrapnel: false,
        suppressed: true,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_mk12': {
        type: 'bullet',
        damage: 22.5,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 400.0,
        speed: 1.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_l86': {
        type: 'bullet',
        damage: 26.5,
        obstacleDamage: 1.0,
        falloff: 0.9,
        distance: 425.0,
        speed: 134.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_m249': {
        type: 'bullet',
        damage: 14.0,
        obstacleDamage: 1.75,
        falloff: 0.9,
        distance: 220.0,
        speed: 125.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_qbb97': {
        type: 'bullet',
        damage: 14.0,
        obstacleDamage: 1.5,
        falloff: 0.9,
        distance: 200.0,
        speed: 118.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'bullet_scout': {
        type: 'bullet',
        damage: 56.0,
        obstacleDamage: 1.0,
        falloff: 0.92,
        distance: 450.0,
        speed: 164.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '556mm',
        tracerWidth: 0.14,
        tracerLength: 0.95
    },
    'bullet_flare': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 1.0,
        falloff: 10.0,
        distance: 16.0,
        speed: 4.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'flare',
        tracerWidth: 0.3,
        tracerLength: 1.2,
        flareColor: 0xff5400,
        addFlare: true,
        maxFlareScale: 2.0,
        skipCollision: true
    },
    'bullet_potato': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        distance: 1.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'invis',
        tracerWidth: 0.0,
        tracerLength: 1.2,
        skipCollision: true
    },

    'bullet_m9A17': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 1.0,
        falloff: 0.0,
        distance: 1.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'invis',
        tracerWidth: 0.0,
        tracerLength: 0.9,
        skipCollision: true
    },

    'bullet_bugle': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        distance: 1.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'invis',
        tracerWidth: 0.0,
        tracerLength: 1.2,
        skipCollision: true
    },
    'bullet_heart': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        distance: 1.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'heart',
        tracerWidth: 0.0,
        tracerLength: 1.2,
        skipCollision: true
    },
    'bullet_m79': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        distance: 1.0,
        speed: 100.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'frag',
        tracerWidth: 0.0,
        tracerLength: 1.2,
        skipCollision: true
    },
    'shrapnel_barrel': {
        type: 'bullet',
        damage: 2.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        speed: 20.0,
        distance: 8.0,
        variance: 1.5,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.125,
        tracerLength: 0.6
    },
    'shrapnel_stove': {
        type: 'bullet',
        damage: 5.0,
        obstacleDamage: 2.5,
        falloff: 1.0,
        speed: 30.0,
        distance: 24.0,
        variance: 1.5,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.125,
        tracerLength: 0.6
    },
    'shrapnel_frag': {
        type: 'bullet',
        damage: 20.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        speed: 20.0,
        distance: 8.0,
        variance: 1.5,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.125,
        tracerLength: 0.6
    },
    'shrapnel_strobe': {
        type: 'bullet',
        damage: 3.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        speed: 20.0,
        distance: 3.0,
        variance: 1.5,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.1,
        tracerLength: 0.3
    },
    'shrapnel_usas': {
        type: 'bullet',
        damage: 5.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        speed: 20.0,
        distance: 5.0,
        variance: 1.2,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.1,
        tracerLength: 0.5
    },
    'shrapnel_mirv_mini': {
        type: 'bullet',
        damage: 6.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        speed: 20.0,
        distance: 5.0,
        variance: 1.3,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.1,
        tracerLength: 0.5
    },
    'shrapnel_bomb_iron': {
        type: 'bullet',
        damage: 10.0,
        obstacleDamage: 1.0,
        falloff: 1.0,
        speed: 24.0,
        distance: 12.0,
        variance: 1.5,
        shrapnel: true,
        tracerColor: 'shrapnel',
        tracerWidth: 0.125,
        tracerLength: 0.6
    },
    'bullet_m134': {
        type: 'bullet',
        damage: 10.0,
        obstacleDamage: 5.0,
        falloff: 0.5,
        distance: 200.0,
        speed: 130.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '762mm',
        tracerWidth: 0.1,
        tracerLength: 0.9
    },
    'shrapnel_skitternade': {
        type: 'bullet',
        damage: 0.0,
        obstacleDamage: 0.0,
        falloff: 1.0,
        speed: 20.0,
        distance: 8.0,
        variance: 1.5,
        shrapnel: true,
        tracerColor: 'skitternade',
        tracerWidth: 0.125,
        tracerLength: 0.6
    },

    // ------------ Weapon projectiles ------------
    // @Note: for bullet behaviours help in attributes, you can see the default attributes in bullet-behaviour-defaults.js
    'staff_projectile_light': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 15.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.0,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/light',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },
    'staff_projectile_heavy': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 7.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 15.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_heavy.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.2,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/heavy',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    }, 'staff_projectile_heavy_1': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 0.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 15.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_heavy.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.2,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/heavy_01',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },
    'staff_projectile_heavy_2': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 20.0,
        obstacleDamage: 2,
        falloff: 0,
        distance: 15.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        behaviour: {
            id: BehaviourEnum.RectangularHitboxSized,
            width: 0.75
        },
        worldImg: {
            sprite: 'staff_heavy.img',
            scale: 1.0,
            tint: 0x4c9141
        },
        textureAnchor: {
            x: 0.2,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/heavy_02',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: -5.0,
                y: 0.0
            }
        }
    },
    'staff_projectile_heavy_3': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 40.0,
        obstacleDamage: 2.5,
        falloff: 0,
        distance: 15.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        behaviour: {
            id: BehaviourEnum.RectangularHitboxSized,
            width: 0.75
        },
        worldImg: {
            sprite: 'staff_heavy.img',
            scale: 1.0,
            tint: 0x2231d
        },
        textureAnchor: {
            x: 0.2,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/heavy_03',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: -5.0,
                y: 0.0
            }
        }
    },
    /*'staff_projectile_skill_1': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: -3.0,
        obstacleDamage: 5.0,
        falloff: 0,
        distance: 20.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'test_staffProjectileTrail',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        updateFromServer: true,//The server will send in every update the position to client
        worldImg: {
            sprite: 'staff_skill_1.img',
            scale: 1.0,
            tint: 0xFFFFFF,
        },
        textureAnchor: {
            x: 0.0,
            y: 0.5
        },
        behaviour:
        {
            id: BehaviourEnum.SinusoidalBehaviour
        },
        spineDisabled: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/skill_01',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },*/
    'staff_test_projectile_skill_1': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 17.0,
        obstacleDamage: 5.0,
        falloff: 0,
        distance: 20.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'test_staffProjectileTrail',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        behaviour: {
            id: BehaviourEnum.RectangularHitboxSized,
            width: 1
        },
        worldImg: {
            sprite: 'staff_skill_1.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.0,
            y: 0.5
        }, /* 
           spineDisabled: {
             enabled: true,
             skin: 'default',
             scale: 1,
             idle: 'Staff/skill_01',
             fizzle: 'Staff/fizzle',
             pivot: {
                 x: 10.5,
                 y: 0.0
             }
           } */
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/skill_01',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: -5.0,
                y: 0.0
            }
        }
    },
    'staff_projectile_skill_2': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: -5.0,
        obstacleDamage: 1.0,
        falloff: 0,
        distance: 15.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_skill_2.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: -0.15,
            y: 0.65
        },
        behaviour: {
            id: BehaviourEnum.SpreadShotBehaviour
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/skill_02',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },
    'staff_projectile_skill_3': {
        type: 'bullet',
        damage: -3.0,
        obstacleDamage: 5.0,
        falloff: 0,
        distance: 20.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'test_staffProjectileTrail',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        updateFromServer: true, //The server will send in every update the position to client
        worldImg: {
            sprite: 'staff_skill_1.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.0,
            y: 0.5
        },
        behaviour: {
            id: BehaviourEnum.SinusoidalBehaviour
        },
        spineDisabled: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Staff/skill_01',
            fizzle: 'Staff/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }

    },
    'bow_projectile_light': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 8.0,
        obstacleDamage: 2,
        falloff: 0,
        distance: 30.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        worldImg: {
            sprite: 'spirit_warrior_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.5,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'bow/light_idle'
        }
    },
    'bow_projectile_heavy': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 8, //This is min damage, max damage and times are in main-hand-weaps.js
        obstacleDamage: 2.5,
        falloff: 0,
        distance: 45.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        worldImg: {
            sprite: 'spirit_warrior_heavy.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.5,
            y: 0.5
        },
        behaviour: {
            id: BehaviourEnum.VariableDamage
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'bow/heavy_idle'
        }
    },
    'bow_projectile_skill_3': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 30.0,
        obstacleDamage: 3.0,
        falloff: 0,
        distance: 55.0,
        speed: 35.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        worldImg: {
            sprite: 'spirit_warrior_piercing.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 1.0,
            y: 0.5
        },
        behaviour: {
            id: BehaviourEnum.RectangularHitboxSized,
            width: 0.5,
            /*hitBox: {//TODO collider rectangular
                x: 0.7,
                y: 2.4
            }*/
            notDestroyOnCollision: true
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'bow/piercing_idle',
            pivot: {
                x: -10,
                y: 0
            }
        }
    },
    'wand_projectile_light': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 7.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.0,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'wand/light',
            fizzle: 'wand/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },
    'wand_projectile_heavy': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: 7.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 7.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_heavy.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.2,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'wand/heavy',
            fizzle: 'wand/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },
    'wand_projectile_skill_1': {
        type: 'bullet',
        attackType: WeaponAttackType.Magic,
        damage: -3,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 10.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_skill_2.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: -0.15,
            y: 0.65
        },
        behaviour: {
            id: BehaviourEnum.SpreadShotBehaviour,
            angle: 45
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'wand/heavy',
            fizzle: 'wand/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        }
    },
    'bullet_sword': {
        type: 'bullet',
        attackType: WeaponAttackType.Slashing,
        damage: 30,
        obstacleDamage: 20,
        falloff: 10.0,
        distance: 16.0,
        speed: 15.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: 'flare',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'sundering-strike.img',
            scale: 2.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.3,
            //x: -0.5,//TODO change when collider is rectangular
            y: 0.5
        },
        behaviour: {
            id: BehaviourEnum.RectangularHitboxSized,
            width: 1.8
            /*hitBox: {//TODO collider rectangular
                x: 0.7,
                y: 2.4
            }*/
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

        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'Sword/skill_03',
            fizzle: 'Sword/fizzle',
            fizzleDuration: 666,
            fizzlePivot: {
                x: 0.0,
                y: 0.0
            },
            pivot: {
                x: -13.5,
                y: 0.0
            }
        }
    },

    'dagger_projectile_skill_2': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: -2.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 15.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        worldImg: {
            sprite: 'staff_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.0,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'dagger/viper_strike',
            fizzle: 'dagger/fizzle',
            pivot: {
                x: 10.5,
                y: 0.0
            }
        },
        //Status effects
        effects: [{
            name: 'm_poisonEffect',
            chance: 1,
            params: {
                damage: 0.015,
                time: 5
            }
        }]
    },

    // ------------ Throwable projectiles ------------
    'shuriken_projectile': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 7.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 25.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        throwPhysics: {
            spinVel: 5.0 * Math.PI
        },
        worldImg: {
            sprite: 'proj-shuriken.img',
            scale: 0.2,
            tint: 0xFFFFFF
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'shuriken/idle',
            fizzle: 'shuriken/fizzle'
        }
    },

    // ------------ Npc Projectiles ------------
    'ghost_elf_projectile_1': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 8.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 30.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        worldImg: {
            sprite: 'spirit_warrior_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.5,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'ghost_elf/arrow_armor_01'
        }
    },
    'ghost_elf_projectile_2': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 8.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 30.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        worldImg: {
            sprite: 'spirit_warrior_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.5,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'ghost_elf/arrow_armor_02'
        }
    },
    'ghost_elf_projectile_3': {
        type: 'bullet',
        attackType: WeaponAttackType.Piercing,
        damage: 8.0,
        obstacleDamage: 1.5,
        falloff: 0,
        distance: 30.0,
        speed: 25.0,
        variance: 0.0,
        shrapnel: false,
        tracerColor: '9mm',
        tracerWidth: 0.0,
        tracerLength: 0.0,
        fadeOutOnMaxDist: true,
        worldImg: {
            sprite: 'spirit_warrior_light.img',
            scale: 1.0,
            tint: 0xFFFFFF
        },
        textureAnchor: {
            x: 0.5,
            y: 0.5
        },
        spine: {
            enabled: true,
            skin: 'default',
            scale: 1,
            idle: 'ghost_elf/arrow_armor_03'
        }
    }
};

var overpressureSpeedBonus = 1.25;
var overpressureRangeBonus = 1.25;

var BonusDefs = {
    'bullet_mp5_bonus': defineBullet('bullet_mp5', {
        speed: 85.0 * overpressureSpeedBonus,
        distance: 100.0 * overpressureRangeBonus
    }),
    'bullet_m9_bonus': defineBullet('bullet_m9', {
        speed: 85.0 * overpressureSpeedBonus,
        distance: 100.0 * overpressureRangeBonus
    }),
    'bullet_mac10_bonus': defineBullet('bullet_mac10', {
        speed: 75.0 * overpressureSpeedBonus,
        distance: 50.0 * overpressureRangeBonus
    }),
    'bullet_ump9_bonus': defineBullet('bullet_ump9', {
        speed: 100.0 * overpressureSpeedBonus,
        distance: 100.0 * overpressureRangeBonus
    }),
    'bullet_vector_bonus': defineBullet('bullet_vector', {
        speed: 88.0 * overpressureSpeedBonus,
        distance: 46.0 * overpressureRangeBonus
    }),
    'bullet_glock_bonus': defineBullet('bullet_glock', {
        speed: 70.0 * overpressureSpeedBonus,
        distance: 44.0 * overpressureRangeBonus
    }),
    'bullet_m93r_bonus': defineBullet('bullet_m93r', {
        speed: 85.0 * overpressureSpeedBonus,
        distance: 100.0 * overpressureRangeBonus
    }),
    'bullet_scorpion_bonus': defineBullet('bullet_scorpion', {
        speed: 90.0 * overpressureSpeedBonus,
        distance: 120.0 * overpressureRangeBonus,
        tracerColor: '9mm_suppressed_bonus'
    }),
    'bullet_vss_bonus': defineBullet('bullet_vss', {
        speed: 95.0 * overpressureSpeedBonus,
        distance: 125.0 * overpressureRangeBonus,
        tracerColor: '9mm_suppressed_bonus'
    }),
    'bullet_p30l_bonus': defineBullet('bullet_p30l', {
        speed: 94.0 * overpressureSpeedBonus,
        distance: 100.0 * overpressureRangeBonus
    })
};

var kBulletDefs = util.mergeDeep({}, BaseDefs, BonusDefs);
module.exports = kBulletDefs;
