"use strict";


// These are used by client/src/js/loadout-menu.js to sort the emotes
var EmoteCategories = {
    Locked: 0,
    Faces: 1,
    Food: 2,
    Animals: 3,
    Logos: 4,
    Other: 5,
    Flags: 6,
    Default: 99
};

var EmoteDefs = {

    //Emotes BHA
    'emote_chimpion': {
        type: 'emote',
        name: 'Chimpion',
        rarity: 'epic',
        texture: 'emote_chimpion.img',
        images: {
            sm: '../img/emotes/emote_chimpion.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Animals,
        isAnimated: true,
        animationSpeed: 0.2,
        animationScale: 0.5,
        sprites: ['emote-chimpion01.img', 'emote-chimpion02.img', 'emote-chimpion03.img', 'emote-chimpion04.img', 'emote-chimpion05.img', 'emote-chimpion06.img', 'emote-chimpion07.img', 'emote-chimpion08.img', 'emote-chimpion09.img', 'emote-chimpion10.img', 'emote-chimpion11.img', 'emote-chimpion12.img', 'emote-chimpion13.img', 'emote-chimpion14.img', 'emote-chimpion15.img', 'emote-chimpion01.img', 'emote-chimpion02.img', 'emote-chimpion03.img', 'emote-chimpion04.img', 'emote-chimpion05.img', 'emote-chimpion06.img', 'emote-chimpion07.img', 'emote-chimpion08.img', 'emote-chimpion09.img', 'emote-chimpion10.img', 'emote-chimpion11.img', 'emote-chimpion12.img', 'emote-chimpion13.img', 'emote-chimpion14.img', 'emote-chimpion15.img']
    },
    'emote_pooface': {
        type: 'emote',
        name: 'Poo Face',
        rarity: 'epic',
        texture: 'emote_pooface.img',
        images: {
            sm: '/img/emotes/emote_pooface.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_broken_heart': {
        type: 'emote',
        name: 'Broken Heart',
        rarity: 'rare',
        texture: 'emote_broken_heart.img',
        images: {
            sm: '../img/emotes/emote_broken_heart.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },

    'emote_picassoface': {
        type: 'emote',
        name: 'Picasso Face',
        rarity: 'rare',
        texture: 'emote_picassoface.img',
        images: {
            sm: '/img/emotes/emote_picassoface.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_rip': {
        type: 'emote',
        name: 'RIP',
        rarity: 'epic',
        texture: 'emote_rip.img',
        images: {
            sm: '/img/emotes/emote_rip.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        isAnimated: true,
        animationSpeed: 0.2,
        animationScale: 0.5,
        sprites: ['emote-rip-01.img', 'emote-rip-02.img', 'emote-rip-03.img', 'emote-rip-04.img', 'emote-rip-05.img', 'emote-rip-06.img', 'emote-rip-07.img', 'emote-rip-08.img', 'emote-rip-09.img', 'emote-rip-10.img', 'emote-rip-11.img', 'emote-rip-12.img', 'emote-rip-13.img', 'emote-rip-14.img', 'emote-rip-14.img', 'emote-rip-14.img', 'emote-rip-14.img', 'emote-rip-14.img', 'emote-rip-14.img', 'emote-rip-14.img']
    },
    'emote_ok': {
        type: 'emote',
        name: 'Ok',
        rarity: 'common',
        texture: 'emote_ok.img',
        images: {
            sm: '/img/emotes/emote_ok.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_rainbow': {
        type: 'emote',
        name: 'Rainbow',
        rarity: 'rare',
        texture: 'emote_rainbow.img',
        images: {
            sm: '/img/emotes/emote_rainbow.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_pay_respects': {
        type: 'emote',
        name: 'Pay Respects',
        rarity: 'epic',
        texture: 'emote_pay_respects.img',
        images: {
            sm: '/img/emotes/emote_pay_respects.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        isAnimated: true,
        animationSpeed: 0.2,
        animationScale: 0.5,
        sprites: ['emote-pay-respects-01.img', 'emote-pay-respects-02.img', 'emote-pay-respects-03.img', 'emote-pay-respects-04.img', 'emote-pay-respects-05.img', 'emote-pay-respects-06.img', 'emote-pay-respects-07.img', 'emote-pay-respects-08.img', 'emote-pay-respects-09.img', 'emote-pay-respects-10.img', 'emote-pay-respects-11.img', 'emote-pay-respects-12.img', 'emote-pay-respects-13.img', 'emote-pay-respects-14.img', 'emote-pay-respects-15.img', 'emote-pay-respects-16.img', 'emote-pay-respects-16.img', 'emote-pay-respects-16.img', 'emote-pay-respects-16.img', 'emote-pay-respects-16.img']
    },
    'emote_pwn': {
        type: 'emote',
        name: 'Pwn',
        rarity: 'common',
        texture: 'emote_pwn.img',
        images: {
            sm: '/img/emotes/emote_pwn.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_nutz': {
        type: 'emote',
        name: 'Nutz',
        rarity: 'rare',
        texture: 'emote_nutz.img',
        images: {
            sm: '/img/emotes/emote_nutz.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_shur': {
        type: 'emote',
        name: 'Shur',
        rarity: 'common',
        texture: 'emote_shur_an.img',
        images: {
            sm: '/img/emotes/emote_shur_an.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        isAnimated: true,
        animationSpeed: 0.14,
        animationScale: 0.5,
        sprites: ['shur1.img', 'shur2.img', 'shur3.img', 'shur4.img', 'shur5.img', 'shur6.img', 'shur7.img', 'shur8.img', 'shur9.img', 'shur10.img', 'shur11.img', 'shur12.img']
    },
    'emote_too_close': {
        type: 'emote',
        name: 'Too Close',
        rarity: 'common',
        texture: 'emote_too_close.img',
        images: {
            sm: '/img/emotes/emote_too_close.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces,
        isAnimated: true,
        animationSpeed: 0.2,
        animationScale: 0.5,
        sprites: ['emote-too-close01.img', 'emote-too-close01.img', 'emote-too-close02.img', 'emote-too-close03.img', 'emote-too-close04.img', 'emote-too-close05.img', 'emote-too-close06.img', 'emote-too-close07.img', 'emote-too-close08.img', 'emote-too-close09.img', 'emote-too-close10.img', 'emote-too-close11.img', 'emote-too-close12.img', 'emote-too-close13.img', 'emote-too-close14.img', 'emote-too-close15.img', 'emote-too-close16.img', 'emote-too-close16.img', 'emote-too-close16.img', 'emote-too-close16.img']
    },
    'emote_fabulorn': {
        type: 'emote',
        name: 'Fabulorn',
        rarity: 'legendary',
        texture: 'emote_fabulorn.img',
        images: {
            sm: '/img/emotes/emote_fabulorn.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        isAnimated: true,
        animationSpeed: 0.1,
        animationScale: 0.5,
        sprites: ['fabulorn1.img', 'fabulorn2.img', 'fabulorn3.img', 'fabulorn4.img', 'fabulorn5.img', 'fabulorn6.img', 'fabulorn7.img', 'fabulorn8.img']
    },
    'emote_mr_sockey': {
        type: 'emote',
        name: 'Mr Sockey',
        rarity: 'epic',
        texture: 'emote_mr_sockey.img',
        images: {
            sm: '/img/emotes/emote_mr_sockey.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces,
        isAnimated: true,
        animationSpeed: 0.2,
        animationScale: 0.5,
        sprites: ['emote-mr-sockey01.img', 'emote-mr-sockey02.img', 'emote-mr-sockey03.img', 'emote-mr-sockey04.img', 'emote-mr-sockey05.img', 'emote-mr-sockey06.img', 'emote-mr-sockey07.img', 'emote-mr-sockey08.img', 'emote-mr-sockey09.img', 'emote-mr-sockey10.img', 'emote-mr-sockey01.img', 'emote-mr-sockey02.img', 'emote-mr-sockey03.img', 'emote-mr-sockey04.img', 'emote-mr-sockey05.img', 'emote-mr-sockey06.img', 'emote-mr-sockey07.img', 'emote-mr-sockey08.img', 'emote-mr-sockey09.img', 'emote-mr-sockey10.img']
    },
    'emote_its_ok': {
        type: 'emote',
        name: 'its ok',
        rarity: 'common',
        texture: 'emote_its_ok.img',
        images: {
            sm: '/img/emotes/emote_its_ok.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_friend_ghost': {
        type: 'emote',
        name: 'Friend Ghost',
        rarity: 'rare',
        texture: 'emote_friend_ghost.img',
        images: {
            sm: '/img/emotes/emote_friend_ghost.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        isAnimated: true,
        animationSpeed: 0.2,
        animationScale: 0.5,
        sprites: ['emote-friend-ghost01.img', 'emote-friend-ghost01.img', 'emote-friend-ghost01.img', 'emote-friend-ghost01.img', 'emote-friend-ghost02.img', 'emote-friend-ghost03.img', 'emote-friend-ghost04.img', 'emote-friend-ghost05.img', 'emote-friend-ghost06.img', 'emote-friend-ghost07.img', 'emote-friend-ghost08.img', 'emote-friend-ghost09.img', 'emote-friend-ghost10.img', 'emote-friend-ghost11.img', 'emote-friend-ghost12.img', 'emote-friend-ghost13.img', 'emote-friend-ghost14.img', 'emote-friend-ghost14.img', 'emote-friend-ghost14.img', 'emote-friend-ghost14.img']
    },
    'emote_gogo': {
        type: 'emote',
        name: 'Gogo',
        rarity: 'common',
        texture: 'emote_gogo.img',
        images: {
            sm: '/img/emotes/emote_gogo.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_hi5': {
        type: 'emote',
        name: 'Hi5',
        rarity: 'common',
        texture: 'emote_hi5.img',
        images: {
            sm: '/img/emotes/emote_hi5.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_angry_blob': {
        type: 'emote',
        name: 'Angry Blob',
        rarity: 'rare',
        texture: 'emote_angry_blob.img',
        images: {
            sm: '/img/emotes/emote_angry_blob.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_oof': {
        type: 'emote',
        name: 'Oof',
        rarity: 'common',
        texture: 'emote_oof.img',
        images: {
            sm: '/img/emotes/emote_oof.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_nooblet': {
        type: 'emote',
        name: 'Nooblet',
        rarity: 'rare',
        texture: 'emote_nooblet.img',
        images: {
            sm: '/img/emotes/emote_nooblet.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_wait': {
        type: 'emote',
        name: 'Wait',
        rarity: 'common',
        texture: 'emote_wait.img',
        images: {
            sm: '/img/emotes/emote_wait.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_to_be_or_not': {
        type: 'emote',
        name: 'To Be Or Not?',
        rarity: 'epic',
        texture: 'emote_to_be_or_not.img',
        images: {
            sm: '/img/emotes/emote_to_be_or_not.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_taunty': {
        type: 'emote',
        name: 'Taunty',
        rarity: 'rare',
        texture: 'emote_taunty.img',
        images: {
            sm: '/img/emotes/emote_taunty.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_glasses': {
        type: 'emote',
        name: 'Glasses',
        rarity: 'rare',
        texture: 'emote_glasses.img',
        images: {
            sm: '/img/emotes/emote_glasses.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_starstruck': {
        type: 'emote',
        name: 'Starstruck',
        rarity: 'rare',
        texture: 'emote_starstruck.img',
        images: {
            sm: '/img/emotes/emote_starstruck.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by DotDot'
    },
    'emote_pills': {
        type: 'emote',
        name: 'Pills',
        rarity: 'epic',
        texture: 'emote_pills.img',
        images: {
            sm: '/img/emotes/emote_pills.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_deadface': {
        type: 'emote',
        name: 'Dead Face',
        rarity: 'rare',
        texture: 'emote_dead_face.img',
        images: {
            sm: '/img/emotes/emote_dead_face.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by Creeperslayr SaveTurtles'
    },
    'emote_flushed': {
        type: 'emote',
        name: 'Flushed',
        rarity: 'rare',
        texture: 'emote_flushed.img',
        images: {
            sm: '/img/emotes/emote_flushed.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by Lil Fish'
    },
    'emote_neutral': {
        type: 'emote',
        name: 'Easy',
        rarity: 'rare',
        texture: 'emote_neutral.img',
        images: {
            sm: '/img/emotes/emote_neutral.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_easy': {
        type: 'emote',
        name: 'Easy',
        rarity: 'common',
        texture: 'emote_easy.img',
        images: {
            sm: '/img/emotes/emote_easy.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_fowl_play': {
        type: 'emote',
        name: 'Easy',
        rarity: 'legendary',
        texture: 'emote_fowl_play.img',
        images: {
            sm: '/img/emotes/emote_fowl_play.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_clown': {
        type: 'emote',
        name: 'Easy',
        rarity: 'rare',
        texture: 'emote_clown.img',
        images: {
            sm: '/img/emotes/emote_clown.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_tongue_out': {
        type: 'emote',
        name: 'Easy',
        rarity: 'common',
        texture: 'emote_tongue_out.img',
        images: {
            sm: '/img/emotes/emote_tongue_out.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_test': {
        type: 'emote',
        name: 'Easy',
        rarity: 'common',
        texture: 'emote-test.img',
        images: {
            sm: '/img/emotes/emote-test.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },

    'emote_happy': {
        type: 'emote',
        name: 'Thonk',
        rarity: 'common',
        texture: 'emote_happy.img',
        images: {
            sm: '../img/ui/emotes/emote_happy.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },

    'emote_sad': {
        type: 'emote',
        name: 'Thonk',
        rarity: 'common',
        texture: 'emote_sad.img',
        images: {
            sm: '../img/ui/emotes/emote_sad.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },

    'emote_like': {
        type: 'emote',
        name: 'Thonk',
        rarity: 'common',
        texture: 'emote_like.img',
        images: {
            sm: '../img/ui/emotes/emote_like.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },

    'emote_dislike': {
        type: 'emote',
        name: 'Thonk',
        rarity: 'common',
        texture: 'emote_dislike.img',
        images: {
            sm: '../img/ui/emotes/emote_dislike.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },

    //Emotes Surviv
    'emote_heal': {
        type: 'emote',
        spriteScale: 1,
        texture: '../img/gui/ping-team-heal.png',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo': {
        type: 'emote',
        texture: 'ammo-box.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo9mm': {
        type: 'emote',
        texture: 'ammo-9mm.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo12gauge': {
        type: 'emote',
        texture: 'ammo-12gauge.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo762mm': {
        type: 'emote',
        texture: 'ammo-762mm.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo556mm': {
        type: 'emote',
        texture: 'ammo-556mm.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo50ae': {
        type: 'emote',
        texture: 'ammo-50AE.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo308sub': {
        type: 'emote',
        texture: 'ammo-308sub.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammoflare': {
        type: 'emote',
        texture: 'ammo-flare.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_ammo45acp': {
        type: 'emote',
        texture: 'ammo-45acp.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: true,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_loot': {
        type: 'emote',
        texture: '',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_trick_nothing': {
        type: 'emote',
        texture: 'face-imp-trick.img',
        sound: 'trick_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_trick_size': {
        type: 'emote',
        texture: 'face-imp-trick.img',
        sound: 'trick_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_trick_m9': {
        type: 'emote',
        texture: 'face-imp-trick.img',
        sound: 'trick_03',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_trick_chatty': {
        type: 'emote',
        texture: 'face-imp-trick.img',
        sound: 'trick_02',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_trick_drain': {
        type: 'emote',
        texture: 'face-imp-trick.img',
        sound: 'trick_02',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_treat_9mm': {
        type: 'emote',
        texture: 'face-angel-treat.img',
        sound: 'treat_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_treat_12g': {
        type: 'emote',
        texture: 'face-angel-treat.img',
        sound: 'treat_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_treat_556': {
        type: 'emote',
        texture: 'face-angel-treat.img',
        sound: 'treat_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_treat_762': {
        type: 'emote',
        texture: 'face-angel-treat.img',
        sound: 'treat_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_treat_super': {
        type: 'emote',
        texture: 'face-angel-treat.img',
        sound: 'treat_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Locked
    },
    'emote_bugle_inspiration_red': {
        type: 'emote',
        texture: 'bugle-inspiration-red.img',
        sound: 'emote_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Other
    },
    'emote_bugle_final_red': {
        type: 'emote',
        texture: 'bugle-final-red.img',
        sound: 'emote_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Other
    },
    'emote_bugle_inspiration_blue': {
        type: 'emote',
        texture: 'bugle-inspiration-blue.img',
        sound: 'emote_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Other
    },
    'emote_bugle_final_blue': {
        type: 'emote',
        texture: 'bugle-final-blue.img',
        sound: 'emote_01',
        channel: 'ui',
        noCustom: true,
        category: EmoteCategories.Other
    },

    'emote_thumbsup': {
        type: 'emote',
        name: 'Thumbs Up',
        rarity: 'common',
        texture: 'thumbs-up.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_sadface': {
        type: 'emote',
        name: 'Sad Face',
        rarity: 'common',
        texture: 'face-sad.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_happyface': {
        type: 'emote',
        name: 'Happy Face',
        rarity: 'common',
        texture: 'face-happy.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_surviv': {
        type: 'emote',
        name: 'Surviv Logo',
        rarity: 'common',
        texture: 'surviv.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_gg': {
        type: 'emote',
        name: 'GG',
        rarity: 0,
        texture: 'gg.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_question': {
        type: 'emote',
        name: 'Question Mark',
        rarity: 0,
        texture: 'question.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_tombstone': {
        type: 'emote',
        name: 'Tombstone',
        rarity: 0,
        texture: 'tombstone.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_joyface': {
        type: 'emote',
        name: 'Joyful Face',
        rarity: 0,
        texture: 'face-joy.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_sobface': {
        type: 'emote',
        name: 'Sobbing Face',
        rarity: 0,
        texture: 'face-sob.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_thinkingface': {
        type: 'emote',
        name: 'Thonk',
        rarity: 'common',
        texture: 'face-thinking.img',
        images: {
            sm: '/img/emotes/face-thinking.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_flagus': {
        type: 'emote',
        name: 'Flag United States',
        rarity: 'common',
        texture: 'flag-united-states-of-america.img',
        images: {
            sm: '/img/emotes/flag-united-states-of-america.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagthailand': {
        type: 'emote',
        name: 'Flag Thailand',
        rarity: 'common',
        texture: 'flag-thailand.img',
        images: {
            sm: '/img/emotes/flag-thailand.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaggermany': {
        type: 'emote',
        name: 'Flag Germany',
        rarity: 'common',
        texture: 'flag-germany.img',
        images: {
            sm: '/img/emotes/flag-germany.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagfrance': {
        type: 'emote',
        name: 'Flag France',
        rarity: 'common',
        texture: 'flag-france.img',
        images: {
            sm: '/img/emotes/flag-france.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagsouthkorea': {
        type: 'emote',
        name: 'Flag South Korea',
        rarity: 0,
        texture: 'flag-south-korea.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagbrazil': {
        type: 'emote',
        name: 'Flag Brazil',
        rarity: 0,
        texture: 'flag-brazil.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagcanada': {
        type: 'emote',
        name: 'Flag Canada',
        rarity: 0,
        texture: 'flag-canada.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagspain': {
        type: 'emote',
        name: 'Flag Spain',
        rarity: 0,
        texture: 'flag-spain.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagrussia': {
        type: 'emote',
        name: 'Flag Russia',
        rarity: 0,
        texture: 'flag-russia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagmexico': {
        type: 'emote',
        name: 'Flag Mexico',
        rarity: 0,
        texture: 'flag-mexico.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagpoland': {
        type: 'emote',
        name: 'Flag Poland',
        rarity: 0,
        texture: 'flag-republic-of-poland.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaguk': {
        type: 'emote',
        name: 'Flag United Kingdom',
        rarity: 0,
        texture: 'flag-united-kingdom.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagcolombia': {
        type: 'emote',
        name: 'Flag Colombia',
        rarity: 0,
        texture: 'flag-colombia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagukraine': {
        type: 'emote',
        name: 'Flag Ukraine',
        rarity: 0,
        texture: 'flag-ukraine.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagturkey': {
        type: 'emote',
        name: 'Flag Turkey',
        rarity: 0,
        texture: 'flag-turkey.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagphilippines': {
        type: 'emote',
        name: 'Flag Philippines',
        rarity: 0,
        texture: 'flag-philippines.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagczechia': {
        type: 'emote',
        name: 'Flag Czechia',
        rarity: 0,
        texture: 'flag-czech-republic.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagperu': {
        type: 'emote',
        name: 'Flag Peru',
        rarity: 0,
        texture: 'flag-peru.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagaustria': {
        type: 'emote',
        name: 'Flag Austria',
        rarity: 0,
        texture: 'flag-austria.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagargentina': {
        type: 'emote',
        name: 'Flag Argentina',
        rarity: 0,
        texture: 'flag-argentina.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagjapan': {
        type: 'emote',
        name: 'Flag Japan',
        rarity: 0,
        texture: 'flag-japan.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagvenezuela': {
        type: 'emote',
        name: 'Flag Venezuela',
        rarity: 0,
        texture: 'flag-venezuela.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagvietnam': {
        type: 'emote',
        name: 'Flag Vietnam',
        rarity: 0,
        texture: 'flag-vietnam.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagswitzerland': {
        type: 'emote',
        name: 'Flag Switzerland',
        rarity: 0,
        texture: 'flag-switzerland.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagnetherlands': {
        type: 'emote',
        name: 'Flag Netherlands',
        rarity: 0,
        texture: 'flag-netherlands.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagchina': {
        type: 'emote',
        name: 'Flag China',
        rarity: 0,
        texture: 'flag-china.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagtaiwan': {
        type: 'emote',
        name: 'Flag Taiwan',
        rarity: 0,
        texture: 'flag-taiwan.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagchile': {
        type: 'emote',
        name: 'Flag Chile',
        rarity: 0,
        texture: 'flag-chile.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagaustralia': {
        type: 'emote',
        name: 'Flag Australia',
        rarity: 0,
        texture: 'flag-australia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagdenmark': {
        type: 'emote',
        name: 'Flag Denmark',
        rarity: 0,
        texture: 'flag-denmark.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagitaly': {
        type: 'emote',
        name: 'Flag Italy',
        rarity: 0,
        texture: 'flag-italy.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagsweden': {
        type: 'emote',
        name: 'Flag Sweden',
        rarity: 0,
        texture: 'flag-sweden.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagecuador': {
        type: 'emote',
        name: 'Flag Ecuador',
        rarity: 0,
        texture: 'flag-ecuador.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagslovakia': {
        type: 'emote',
        name: 'Flag Slovakia',
        rarity: 0,
        texture: 'flag-slovakia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaghungary': {
        type: 'emote',
        name: 'Flag Hungary',
        rarity: 0,
        texture: 'flag-hungary.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagromania': {
        type: 'emote',
        name: 'Flag Romania',
        rarity: 0,
        texture: 'flag-romania.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaghongkong': {
        type: 'emote',
        name: 'Flag Hong Kong',
        rarity: 0,
        texture: 'flag-hong-kong.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagindonesia': {
        type: 'emote',
        name: 'Flag Indonesia',
        rarity: 0,
        texture: 'flag-indonesia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagfinland': {
        type: 'emote',
        name: 'Flag Finland',
        rarity: 0,
        texture: 'flag-finland.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagnorway': {
        type: 'emote',
        name: 'Flag Norway',
        rarity: 0,
        texture: 'flag-norway.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_heart': {
        type: 'emote',
        name: 'Heart',
        rarity: 0,
        texture: 'heart.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_sleepy': {
        type: 'emote',
        name: 'Zzz',
        rarity: 0,
        texture: 'sleepy.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_flex': {
        type: 'emote',
        name: 'Flex',
        rarity: 0,
        texture: 'flex.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_angryface': {
        type: 'emote',
        name: 'Angry Face',
        rarity: 0,
        texture: 'face-angry.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_upsidedownface': {
        type: 'emote',
        name: 'Upside Down Face',
        rarity: 0,
        texture: 'face-upsidedown.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_teabag': {
        type: 'emote',
        name: 'Teabag',
        rarity: 0,
        texture: 'teabag.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_alienface': {
        type: 'emote',
        name: 'Alien Face',
        rarity: 0,
        texture: 'face-alien.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_flagbelarus': {
        type: 'emote',
        name: 'Flag Belarus',
        rarity: 0,
        texture: 'flag-belarus.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagbelgium': {
        type: 'emote',
        name: 'Flag Belgium',
        rarity: 0,
        texture: 'flag-belgium.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagkazakhstan': {
        type: 'emote',
        name: 'Flag Kazakhstan',
        rarity: 0,
        texture: 'flag-kazakhstan.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_egg': {
        type: 'emote',
        name: 'Egg',
        rarity: 0,
        texture: 'egg.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_police': {
        type: 'emote',
        name: 'Police Insignia',
        rarity: 0,
        texture: 'police.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_dabface': {
        type: 'emote',
        name: 'Dab Face',
        rarity: 0,
        texture: 'face-dab.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_flagmalaysia': {
        type: 'emote',
        name: 'Flag Malaysia',
        rarity: 0,
        texture: 'flag-malaysia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagnewzealand': {
        type: 'emote',
        name: 'Flag New Zealand',
        rarity: 0,
        texture: 'flag-new-zealand.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_logosurviv': {
        type: 'emote',
        name: 'PARMA',
        rarity: 0,
        texture: 'logo-surviv.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_logoegg': {
        type: 'emote',
        name: 'The Egg',
        rarity: 0,
        texture: 'logo-egg.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_logoswine': {
        type: 'emote',
        name: 'The Swine',
        rarity: 0,
        texture: 'logo-swine.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_logohydra': {
        type: 'emote',
        name: 'The Hydra',
        rarity: 0,
        texture: 'logo-hydra.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_logostorm': {
        type: 'emote',
        name: 'The Storm',
        rarity: 0,
        texture: 'logo-storm.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_flaghonduras': {
        type: 'emote',
        name: 'Flag Honduras',
        rarity: 0,
        texture: 'flag-honduras.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_logocaduceus': {
        type: 'emote',
        name: 'The Caduceus',
        rarity: 0,
        texture: 'logo-caduceus.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_impface': {
        type: 'emote',
        name: 'Imp Face',
        rarity: 0,
        texture: 'face-imp.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_monocleface': {
        type: 'emote',
        name: 'Monocole Face',
        rarity: 0,
        texture: 'face-monocle.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_sunglassface': {
        type: 'emote',
        name: 'Sunglasses Face',
        rarity: 0,
        texture: 'face-sunglass.img',
        images: {
            sm: '/img/emotes/face-sunglass.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_headshotface': {
        type: 'emote',
        name: 'Headshot!',
        rarity: 0,
        texture: 'face-headshot.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_potato': {
        type: 'emote',
        name: 'Potato',
        rarity: 0,
        texture: 'potato.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_leek': {
        type: 'emote',
        name: 'Leek',
        rarity: 0,
        texture: 'leek.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_eggplant': {
        type: 'emote',
        name: 'Eggplant',
        rarity: 0,
        texture: 'eggplant.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_baguette': {
        type: 'emote',
        name: 'Baguette',
        rarity: 0,
        texture: 'baguette.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_chick': {
        type: 'emote',
        name: 'Chick',
        rarity: 0,
        texture: 'chick.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_flagbolivia': {
        type: 'emote',
        name: 'Flag Bolivia',
        rarity: 0,
        texture: 'flag-bolivia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagcroatia': {
        type: 'emote',
        name: 'Flag Croatia',
        rarity: 0,
        texture: 'flag-croatia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagindia': {
        type: 'emote',
        name: 'Flag India',
        rarity: 0,
        texture: 'flag-india.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagisrael': {
        type: 'emote',
        name: 'Flag Israel',
        rarity: 0,
        texture: 'flag-israel.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaggeorgia': {
        type: 'emote',
        name: 'Flag Georgia',
        rarity: 0,
        texture: 'flag-georgia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaggreece': {
        type: 'emote',
        name: 'Flag Greece',
        rarity: 0,
        texture: 'flag-greece.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagguatemala': {
        type: 'emote',
        name: 'Flag Guatemala',
        rarity: 0,
        texture: 'flag-guatemala.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagportugal': {
        type: 'emote',
        name: 'Flag Portugal',
        rarity: 0,
        texture: 'flag-portugal.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagserbia': {
        type: 'emote',
        name: 'Flag Serbia',
        rarity: 0,
        texture: 'flag-serbia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagsingapore': {
        type: 'emote',
        name: 'Flag Singapore',
        rarity: 0,
        texture: 'flag-singapore.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagtrinidad': {
        type: 'emote',
        name: 'Flag Trinidad and Tobago',
        rarity: 0,
        texture: 'flag-trinidad-and-tobago.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaguruguay': {
        type: 'emote',
        name: 'Flag Uruguay',
        rarity: 0,
        texture: 'flag-uruguay.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_logoconch': {
        type: 'emote',
        name: 'The Conch',
        rarity: 0,
        texture: 'logo-conch.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_pineapple': {
        type: 'emote',
        name: 'Pineapple',
        rarity: 0,
        texture: 'pineapple.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_coconut': {
        type: 'emote',
        name: 'Coconut',
        rarity: 0,
        texture: 'coconut.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_crab': {
        type: 'emote',
        name: 'Crab',
        rarity: 0,
        texture: 'crab.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Animals
    },
    'emote_whale': {
        type: 'emote',
        name: 'Whale',
        rarity: 0,
        texture: 'whale.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Animals
    },
    'emote_logometeor': {
        type: 'emote',
        name: 'The Meteor',
        rarity: 0,
        texture: 'logo-meteor.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_salt': {
        type: 'emote',
        name: 'Salt Shaker',
        rarity: 0,
        texture: 'salt.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_disappointface': {
        type: 'emote',
        name: 'Disappointed Face',
        rarity: 0,
        texture: 'face-disappoint.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_logocrossing': {
        type: 'emote',
        name: 'The Crossing',
        rarity: 0,
        texture: 'logo-crossing.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_fish': {
        type: 'emote',
        name: 'Fish',
        rarity: 0,
        texture: 'fish.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Animals
    },
    'emote_campfire': {
        type: 'emote',
        name: 'Campfire',
        rarity: 0,
        texture: 'campfire.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_chickendinner': {
        type: 'emote',
        name: 'Chicken Dinner',
        rarity: 0,
        texture: 'chicken-dinner.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_cattle': {
        type: 'emote',
        name: 'Cattle Skull',
        rarity: 0,
        texture: 'cattle.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Animals
    },
    'emote_icecream': {
        type: 'emote',
        name: 'Ice Cream',
        rarity: 0,
        texture: 'ice-cream.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_cupcake': {
        type: 'emote',
        name: 'Cupcake',
        rarity: 0,
        texture: 'cupcake.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_donut': {
        type: 'emote',
        name: 'Donut',
        rarity: 0,
        texture: 'donut.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_logohatchet': {
        type: 'emote',
        name: 'The Hatchet',
        rarity: 0,
        texture: 'logo-hatchet.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_acorn': {
        type: 'emote',
        name: 'Acorn',
        rarity: 0,
        texture: 'acorn.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_trunk': {
        type: 'emote',
        name: 'Tree Trunk',
        rarity: 0,
        texture: 'trunk.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_forest': {
        type: 'emote',
        name: 'Forest',
        rarity: 0,
        texture: 'forest.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_pumpkin': {
        type: 'emote',
        name: 'Pumpkin',
        rarity: 0,
        texture: 'pumpkin.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_candycorn': {
        type: 'emote',
        name: 'Candy Corn',
        rarity: 0,
        texture: 'candy-corn.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_pilgrimhat': {
        type: 'emote',
        name: 'Pilgrim',
        rarity: 0,
        texture: 'pilgrim-hat.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_turkeyanimal': {
        type: 'emote',
        name: 'Turkey',
        rarity: 0,
        texture: 'turkey-animal.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Animals
    },
    'emote_heartface': {
        type: 'emote',
        name: 'Heart Face',
        rarity: 0,
        texture: 'face-heart.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_logochrysanthemum': {
        type: 'emote',
        name: 'The Chrysanthemum',
        rarity: 0,
        texture: 'logo-chrysanthemum.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_santahat': {
        type: 'emote',
        name: 'Santa Hat',
        rarity: 0,
        texture: 'santa-hat.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_snowman': {
        type: 'emote',
        name: 'Snowman',
        rarity: 0,
        texture: 'snowman.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_snowflake': {
        type: 'emote',
        name: 'Snowflake',
        rarity: 0,
        texture: 'snowflake.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_flagmorocco': {
        type: 'emote',
        name: 'Flag Morocco',
        rarity: 0,
        texture: 'flag-morocco.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagestonia': {
        type: 'emote',
        name: 'Flag Estonia',
        rarity: 0,
        texture: 'flag-estonia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagalgeria': {
        type: 'emote',
        name: 'Flag Algeria',
        rarity: 0,
        texture: 'flag-algeria.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagegypt': {
        type: 'emote',
        name: 'Flag Egypt',
        rarity: 0,
        texture: 'flag-egypt.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagazerbaijan': {
        type: 'emote',
        name: 'Flag Azerbaijan',
        rarity: 0,
        texture: 'flag-azerbaijan.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagalbania': {
        type: 'emote',
        name: 'Flag Albania',
        rarity: 0,
        texture: 'flag-albania.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaglithuania': {
        type: 'emote',
        name: 'Flag Lithuania',
        rarity: 0,
        texture: 'flag-lithuania.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaglatvia': {
        type: 'emote',
        name: 'Flag Latvia',
        rarity: 0,
        texture: 'flag-latvia.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flaguae': {
        type: 'emote',
        name: 'Flag United Arab Emirates',
        rarity: 0,
        texture: 'flag-united-arab-emirates.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_flagdominicanrepublic': {
        type: 'emote',
        name: 'Flag Dominican Republic',
        rarity: 0,
        texture: 'flag-dominican-republic.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Flags
    },
    'emote_logocloud': {
        type: 'emote',
        name: 'The Cloud',
        rarity: 0,
        texture: 'logo-cloud.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_ghost_base': {
        type: 'emote',
        name: 'Ghost',
        rarity: 3,
        texture: 'ghost-base.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_bandagedface': {
        type: 'emote',
        name: 'Bandaged Face',
        rarity: 1,
        texture: 'face-bandaged.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_logotwins': {
        type: 'emote',
        name: 'The Twins',
        rarity: 0,
        texture: 'logo-twins.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_shockface': {
        type: 'emote',
        name: 'Shock & Awe',
        rarity: 'common',
        texture: 'face-shock.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces
    },
    'emote_skull': {
        type: 'emote',
        name: 'To Be Or Not?',
        rarity: 3,
        texture: 'emote-skull.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_trollface': {
        type: 'emote',
        name: 'Trollface',
        rarity: 4,
        texture: 'emote-trollface.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_greedy': {
        type: 'emote',
        name: 'Greedy',
        rarity: 1,
        texture: 'emote-greedy.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by Mxstyc'
    },
    'emote_lies': {
        type: 'emote',
        name: 'Lies',
        rarity: 2,
        texture: 'emote-lies.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by badname'
    },
    'emote_sweaty': {
        type: 'emote',
        name: 'Sweaty',
        rarity: 2,
        texture: 'emote-sweaty.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by badname'
    },
    'emote_panned': {
        type: 'emote',
        name: 'Panned',
        rarity: 3,
        texture: 'emote-panned.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by Downtime'
    },
    'emote_happyghost': {
        type: 'emote',
        name: 'Happy Ghost',
        rarity: 4,
        texture: 'emote-happyghost.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by Henry Boy'
    },
    'emote_shroomcloud': {
        type: 'emote',
        name: 'Shroomcloud',
        rarity: 4,
        texture: 'emote-shroomcloud.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: ''
    },
    'emote_boffy': {
        type: 'emote',
        name: 'Boffy',
        rarity: 'rare',
        texture: 'boffy.img',
        images: {
            sm: '/img/emotes/boffy.svg'
        },
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other,
        lore: 'Created by DotDot'
    },
    'emote_relief': {
        type: 'emote',
        name: 'Relief',
        rarity: 2,
        texture: 'relief.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_eye': {
        type: 'emote',
        name: 'Eye',
        rarity: 1,
        texture: 'emote-eye.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Logos
    },
    'emote_frustration': {
        type: 'emote',
        name: 'Frustration',
        rarity: 2,
        texture: 'emote-frustration.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces,
        lore: 'Created by Roamer'
    },
    'emote_qq': {
        type: 'emote',
        name: 'QQ',
        rarity: 1,
        texture: 'emote-qq.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Other
    },
    'emote_sushi_roll': {
        type: 'emote',
        name: 'Sushi Roll',
        rarity: 5,
        texture: 'emote-sushi-roll.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Food
    },
    'emote_puke': {
        type: 'emote',
        name: 'Puke',
        rarity: 3,
        texture: 'emote-puke.img',
        sound: 'emote_01',
        channel: 'ui',
        teamOnly: false,
        category: EmoteCategories.Faces,
        lore: 'Created by badname'
    }
};

module.exports = EmoteDefs;
