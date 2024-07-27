"use strict";


var kUnlockDefs = {
    'unlocks_bha_default': {
        type: 'unlocks',
        name: 'bha-default',
        unlocks: ['skin_femalelilu', 'skin_maledaper', 'skin_femalelilu_17', 'skin_maledaper_17', 'skin_femalelilu_19', 'skin_maledaper_19', 'hair_femalelilu', 'hair_maledaper',
        /* 'emote_happyface',
        'emote_thumbsup',
        'emote_surviv',
        'emote_sadface', */
        /* 'emote_rip',
        'emote_ok',
        'emote_rainbow',
        'emote_pay_respects',
        'emote_shur',
        'emote_fabulorn',
        'emote_its_ok',
        'emote_oof',
        'emote_sunglassface',
        'emote_deadface',
        'emote_flushed',
        'emote_easy', */

        'emote_happy', 'emote_sad', 'emote_like', 'emote_dislike']
    },
    'unlock_default': {
        type: 'unlock',
        name: 'standard-issue',
        unlocks: [
        // TEST
        // 'outfitParma',
        // 'outfitCarbonFiber',
        // 'outfitDarkGloves',
        // 'outfitRed',
        // 'outfitWhite',
        // 'outfitParmaPrestige',

        // 'knuckles_rusted',
        // 'knuckles_heroic',

        // 'emote_ghost_base',
        // 'emote_ghost_red',
        // 'emote_ghost_blue',
        // 'emote_bandagedface',
        // 'emote_picassoface',
        // 'emote_pooface',
        // 'emote_ok',
        // 'emote_rainbow',

        // 'heal_heart',
        // 'heal_moon',
        // 'heal_tomoe',
        // 'boost_star',
        // 'boost_naturalize',
        // 'boost_shuriken',

        /*season 4 test
         'blackHoleDeath',
        'bloodExplosionDeath',
        'magicSparkDeath',
        'outfitBlueLava',
        'outfitInfernoCamo',
        'fist_leaf',
        'emote_its_ok',
        'outfitSpeedoSunburn',
        'outfitMango',
        'fist_linedUp',
        'fist_ranger',
        'emote_boffy',
        'emote_relief',
        'emote_eye',
        'outfitParrot',
        'fist_lit',
        'boost_firestorm',
        'boost_drumstick',
        'boost_casing',
        'boost_bubble',
        'boost_speed',
        'heal_peace',*/

        /*
         'outfitTurkey',
        'outfitParmaPrestige',
        'outfitParma',
        'outfitDarkGloves',
        'outfitRed',
        'outfitWhite',
        'outfitCarbonFiber',
        'outfitChromesis',
        'outfitSplotchfest',
        'outfitSunset',
        'outfitDeepPurple',
        'outfitClaymore',
        'outfitFireball',
        'outfitMecha',
        'outfitDiamondy',
        'outfitAstronaut',
        'outfitZebra',
        'outfitMojo',
        'outfitCow',
        'outfitGiraffe',
        'outfitUrbanCamo',
        'outfitWaves',
        'outfitRusticSands',
        'outfitFragtastic',
        'outfitInfernoCamo',
        'outfitNeonEyesore',
        'outfitSpeedoSunburn',
        'outfitMango',
        'outfitParrot',
        'outfitDemo',
        'outfitTank',
        'outfitMedic',
        'outfitSniper',
        'outfitAssault',
        'outfitWhiteDay',
        'outfitScout',
        
         'outfitCamo',
        'outfitRoyalFortune',
        'outfitCobaltShell',
        'outfitDesertCamo',
        'outfitDev',
        'outfitGeometric',
         'outfitHeaven',
        'outfitKeyLime',
        'outfitLumber',
        'outfitMilitary',
        'outfitMod',
        'outfitSpetsnaz',
        'outfitWheat',
        'outfitWoodland',
        'outfitSpeedo',
        'outfitWinter',
        'explosiveDeath',
        'billionaireDeath',
        'confettiDeath',
        'sparklyDeath',*/

        'outfitBase', //@TODO: REMOVE SURVIV

        'fists', 'red_gloves', 'feral_gloves', 'crab_gloves', 'regularDeath', 'regularTrail', 'rainbowTrail', 'blackTrail', 'regularFlash', 'superFlash', 'heal_basic', 'boost_basic', 'crosshair_default', 'crosshair_001', 'crosshair_005', 'crosshair_007', 'crosshair_086', 'crosshair_027', 'crosshair_080', 'crosshair_098', 'crosshair_101', 'crosshair_158', 'crosshair_094', 'crosshair_118', 'crosshair_136', 'crosshair_160', 'crosshair_176', 'emote_thumbsup', 'emote_sadface', 'emote_happyface', 'emote_surviv', 'emote_gg', 'emote_question', 'emote_tombstone', 'emote_joyface', 'emote_sobface', 'emote_thinkingface', 'emote_flagus', 'emote_flagthailand', 'emote_flaggermany', 'emote_flagfrance', 'emote_flagsouthkorea', 'emote_flagbrazil', 'emote_flagcanada', 'emote_flagspain', 'emote_flagrussia', 'emote_flagmexico', 'emote_flagpoland', 'emote_flaguk', 'emote_flagcolombia', 'emote_flagukraine', 'emote_flagturkey', 'emote_flagphilippines', 'emote_flagczechia', 'emote_flagperu', 'emote_flagaustria', 'emote_flagargentina', 'emote_flagjapan', 'emote_flagvenezuela', 'emote_flagvietnam', 'emote_flagswitzerland', 'emote_flagnetherlands', 'emote_flagchina', 'emote_flagtaiwan', 'emote_flagchile', 'emote_flagaustralia', 'emote_flagdenmark', 'emote_flagitaly', 'emote_flagsweden', 'emote_flagecuador', 'emote_flagslovakia', 'emote_flaghungary', 'emote_flagromania', 'emote_flaghongkong', 'emote_flagindonesia', 'emote_flagfinland', 'emote_flagnorway', 'emote_heart', 'emote_sleepy', 'emote_flex', 'emote_angryface', 'emote_upsidedownface', 'emote_teabag', 'emote_alienface', 'emote_flagbelarus', 'emote_flagbelgium', 'emote_flagkazakhstan', 'emote_egg', 'emote_police', 'emote_dabface', 'emote_flagmalaysia', 'emote_flagnewzealand', 'emote_logosurviv', 'emote_logoegg', 'emote_logoswine', 'emote_logohydra', 'emote_logostorm', 'emote_flaghonduras', 'emote_logocaduceus', 'emote_impface', 'emote_monocleface', 'emote_sunglassface', 'emote_headshotface', 'emote_potato', 'emote_leek', 'emote_eggplant', 'emote_baguette', 'emote_chick', 'emote_flagbolivia', 'emote_flagcroatia', 'emote_flagindia', 'emote_flagisrael', 'emote_flaggeorgia', 'emote_flaggreece', 'emote_flagguatemala', 'emote_flagportugal', 'emote_flagserbia', 'emote_flagsingapore', 'emote_flagtrinidad', 'emote_flaguruguay', 'emote_logoconch', 'emote_pineapple', 'emote_coconut', 'emote_crab', 'emote_whale', 'emote_logometeor', 'emote_salt', 'emote_disappointface', 'emote_logocrossing', 'emote_fish', 'emote_campfire', 'emote_chickendinner', 'emote_cattle', 'emote_icecream', 'emote_cupcake', 'emote_donut', 'emote_logohatchet', 'emote_acorn', 'emote_trunk', 'emote_forest', 'emote_pumpkin', 'emote_candycorn', 'emote_pilgrimhat', 'emote_turkeyanimal', 'emote_heartface', 'emote_logochrysanthemum', 'emote_santahat', 'emote_snowman', 'emote_snowflake', 'emote_flagmorocco', 'emote_flagestonia', 'emote_flagalgeria', 'emote_flagegypt', 'emote_flagazerbaijan', 'emote_flagalbania', 'emote_flaglithuania', 'emote_flaglatvia', 'emote_flaguae', 'emote_flagdominicanrepublic', 'emote_logocloud', 'emote_logotwins',

        //TEST BHA
        //Skin Colors
        'skin_01', 'skin_17', 'skin_19',
        //Hair
        'daper_hair', 'lilu_hair']
    },
    'unlock_new_account': {
        type: 'unlock',
        name: 'new-account',
        free: true,
        unlocks: ['outfitDarkShirt']
    },
    'unlock_test_armor_puritychain': {
        type: 'unlock',
        name: 'unlock_test_armor_puritychain',
        free: true,
        unlocks: ['armor_puritychain']
    },
    'unlock_test_armor_eastmarch': {
        type: 'unlock',
        name: 'unlock_test_armor_eastmarch',
        free: true,
        unlocks: ['armor_eastmarch']
    },
    'unlock_test_armor_woodelfcloak': {
        type: 'unlock',
        name: 'unlock_test_armor_woodelfcloak',
        free: true,
        unlocks: ['armor_woodelfcloak']
    },
    'unlock_test_armor_whitewizardcloth': {
        type: 'unlock',
        name: 'unlock_test_armor_whitewizardcloth',
        free: true,
        unlocks: ['armor_whitewizardcloth']
    },
    'unlock_test_armor_nordicmail': {
        type: 'unlock',
        name: 'unlock_test_armor_nordicmail',
        free: true,
        unlocks: ['armor_nordicmail']
    },
    'unlock_test_armor_adventurertunic': {
        type: 'unlock',
        name: 'unlock_test_armor_adventurertunic',
        free: true,
        unlocks: ['armor_adventurertunic']
    },
    'unlock_test_armor_spiritwalker': {
        type: 'unlock',
        name: 'unlock_test_armor_spiritwalker',
        free: true,
        unlocks: ['armor_spiritwalker']
    },
    'unlock_test_armor_zodiacrobes': {
        type: 'unlock',
        name: 'unlock_test_armor_zodiacrobes',
        free: true,
        unlocks: ['armor_zodiacrobes']
    },
    'unlock_test_armor_astarothward': {
        type: 'unlock',
        name: 'unlock_test_armor_astarothward',
        free: true,
        unlocks: ['armor_astarothward']
    },
    'unlock_test_armor_paladinward': {
        type: 'unlock',
        name: 'unlock_test_armor_paladinward',
        free: true,
        unlocks: ['armor_paladinward']
    },
    'unlock_test_armor_supremacy': {
        type: 'unlock',
        name: 'unlock_test_armor_supremacy',
        free: true,
        unlocks: ['armor_supremacy']
    },
    'unlock_test_armor_armorofinsight': {
        type: 'unlock',
        name: 'unlock_test_armor_armorofinsight',
        free: true,
        unlocks: ['armor_armorofinsight']
    },
    'unlock_test_armor_catsrobe': {
        type: 'unlock',
        name: 'unlock_test_armor_catsrobe',
        free: true,
        unlocks: ['armor_catsrobe']
    },
    'unlock_test_helmet_steadfastvisor': {
        type: 'unlock',
        name: 'unlock_test_helmet_steadfastvisor',
        free: true,
        unlocks: ['helmet_steadfastvisor']
    },
    'unlock_test_helmet_eastmarchhelm': {
        type: 'unlock',
        name: 'unlock_test_helmet_eastmarchhelm',
        free: true,
        unlocks: ['helmet_eastmarchhelm']
    },
    'unlock_test_helmet_woodelfhood': {
        type: 'unlock',
        name: 'unlock_test_helmet_woodelfhood',
        free: true,
        unlocks: ['helmet_woodelfhood']
    },
    'unlock_test_helmet_whitemagehat': {
        type: 'unlock',
        name: 'unlock_test_helmet_whitemagehat',
        free: true,
        unlocks: ['helmet_whitemagehat']
    },
    'unlock_test_helmet_nordicheadguard': {
        type: 'unlock',
        name: 'unlock_test_helmet_nordicheadguard',
        free: true,
        unlocks: ['helmet_nordicheadguard']
    },
    'unlock_test_helmet_roguedaring': {
        type: 'unlock',
        name: 'unlock_test_helmet_roguedaring',
        free: true,
        unlocks: ['helmet_roguedaring']
    },
    'unlock_test_helmet_honshuwarrior': {
        type: 'unlock',
        name: 'unlock_test_helmet_honshuwarrior',
        free: true,
        unlocks: ['helmet_honshuwarrior']
    },
    'unlock_test_helmet_zodiachood': {
        type: 'unlock',
        name: 'unlock_test_helmet_zodiachood',
        free: true,
        unlocks: ['helmet_zodiachood']
    },
    'unlock_test_helmet_astarothgaze': {
        type: 'unlock',
        name: 'unlock_test_helmet_astarothgaze',
        free: true,
        unlocks: ['helmet_astarothgaze']
    },
    'unlock_test_helmet_paladinhelm': {
        type: 'unlock',
        name: 'unlock_test_helmet_paladinhelm',
        free: true,
        unlocks: ['helmet_paladinhelm']
    },
    'unlock_test_helmet_wingeddominance': {
        type: 'unlock',
        name: 'unlock_test_helmet_wingeddominance',
        free: true,
        unlocks: ['helmet_wingeddominance']
    },
    'unlock_test_helmet_headpieceofvision': {
        type: 'unlock',
        name: 'unlock_test_helmet_headpieceofvision',
        free: true,
        unlocks: ['helmet_headpieceofvision']
    },
    'unlock_test_helmet_witchshade': {
        type: 'unlock',
        name: 'unlock_test_helmet_witchshade',
        free: true,
        unlocks: ['helmet_witchshade']
    },
    'unlock_test_ring_lonelywhisper': {
        type: 'unlock',
        name: 'unlock_test_ring_lonelywhisper',
        free: true,
        unlocks: ['ring_lonelywhisper']
    },
    'unlock_test_ring_crystalheart': {
        type: 'unlock',
        name: 'unlock_test_ring_crystalheart',
        free: true,
        unlocks: ['ring_crystalheart']
    },
    'unlock_test_ring_pureloop': {
        type: 'unlock',
        name: 'unlock_test_ring_pureloop',
        free: true,
        unlocks: ['ring_pureloop']
    },
    'unlock_test_ring_earneststar': {
        type: 'unlock',
        name: 'unlock_test_ring_earneststar',
        free: true,
        unlocks: ['ring_earneststar']
    },
    'unlock_test_ring_lustrousspark': {
        type: 'unlock',
        name: 'unlock_test_ring_lustrousspark',
        free: true,
        unlocks: ['ring_lustrousspark']
    },
    'unlock_test_ring_exaltedswirl': {
        type: 'unlock',
        name: 'unlock_test_ring_exaltedswirl',
        free: true,
        unlocks: ['ring_exaltedswirl']
    }

    // 'unlock_instagram': {
    //     type: 'unlock',
    //     name: 'instagram-follow',
    //     free: true,
    //     unlocks: [
    //         'outfitParma'
    //     ]
    // },
    // 'unlock_youtube': {
    //     type: 'unlock',
    //     name: 'youtube-subscribe',
    //     free: true,
    //     unlocks: [
    //         'knuckles_rusted'
    //     ]
    // },
    // 'unlock_twitter': {
    //     type: 'unlock',
    //     name: 'twitter-follow',
    //     free: true,
    //     unlocks: [
    //         'heal_02',
    //         'boost_02'
    //     ]
    // },
    // 'unlock_bundle': {
    //     type: 'unlock',
    //     name: 'ltm-bundle',
    //     free: true,
    //     unlocks: [
    //         'karambit_prismatic',
    //         'unlock_instagram',
    //         'unlock_facebook',
    //         'katana_orchid'
    //     ]
    // },
};

module.exports = kUnlockDefs;
