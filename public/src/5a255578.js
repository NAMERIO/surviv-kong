"use strict";


var EffectDefs = {
    // Heals
    'heal_basic': {
        type: 'heal_effect',
        name: 'Basic Healing',
        rarity: 0,
        texture: 'part-heal-basic.img',
        emitter: 'hp_potion'
    },
    'heal_heart': {
        type: 'heal_effect',
        name: 'Healing Hearts',
        rarity: 1,
        texture: 'part-heal-heart.img',
        emitter: 'heal_heart'
    },
    'heal_moon': {
        type: 'heal_effect',
        name: 'Blood Moon',
        rarity: 2,
        texture: 'part-heal-moon.img',
        emitter: 'heal_moon'
    },
    'heal_tomoe': {
        type: 'heal_effect',
        name: 'Tomoe',
        rarity: 3,
        texture: 'part-heal-tomoe.img',
        emitter: 'heal_tomoe'
    },
    'heal_hexa': {
        type: 'heal_effect',
        name: 'Hexamend',
        rarity: 1,
        texture: 'part-heal-hexa.img',
        emitter: 'heal_hexa'
    },
    'heal_patch': {
        type: 'heal_effect',
        name: 'Patch Job',
        rarity: 3,
        texture: 'part-heal-patch.img',
        emitter: 'heal_patch'
    },
    'heal_paramedicine': {
        type: 'heal_effect',
        name: 'Paramedicine',
        rarity: 1,
        texture: 'part-heal-paramedicine.img',
        emitter: 'heal_paramedicine',
        lore: 'Created by Roamer'
    },
    'heal_lotus': {
        type: 'heal_effect',
        name: 'Lotus',
        rarity: 2,
        texture: 'part-heal-lotus.img',
        emitter: 'heal_lotus'
    },
    'heal_syringe': {
        type: 'heal_effect',
        name: 'Syringe',
        rarity: 3,
        texture: 'part-heal-syringe.img',
        emitter: 'heal_syringe'
    },
    'heal_diamond': {
        type: 'heal_effect',
        name: 'Diamond',
        rarity: 4,
        texture: 'part-heal-diamond.img',
        emitter: 'heal_diamond'
    },
    'heal_peace': {
        type: 'heal_effect',
        name: 'Peace',
        rarity: 2,
        texture: 'part-heal-peace.img',
        emitter: 'heal_peace',
        lore: 'Created by FrankzeeTank'
    },
    'heal_santa_boots': {
        type: 'heal_effect',
        name: 'Santa Boots',
        rarity: 2,
        texture: 'boost-santa-boots.img',
        emitter: 'boost_santa_boots',
        lore: ''
    },
    'heal_santa_hat': {
        type: 'heal_effect',
        name: 'Santa Hat',
        rarity: 2,
        texture: 'heal-santa-hat.img',
        emitter: 'heal_santa_hat',
        lore: ''
    },

    // Boosts
    'boost_basic': {
        type: 'boost_effect',
        name: 'Basic Boost',
        rarity: 0,
        texture: 'part-boost-basic.img',
        emitter: 'boost_basic'
    },
    'boost_star': {
        type: 'boost_effect',
        name: 'Starboost',
        rarity: 1,
        texture: 'part-boost-star.img',
        emitter: 'boost_star'
    },
    'boost_naturalize': {
        type: 'boost_effect',
        name: 'Naturalize',
        rarity: 2,
        texture: 'part-boost-naturalize.img',
        emitter: 'boost_naturalize'
    },
    'boost_shuriken': {
        type: 'boost_effect',
        name: 'Shuriken',
        rarity: 3,
        texture: 'part-boost-shuriken.img',
        emitter: 'boost_shuriken'
    },
    'boost_energel': {
        type: 'boost_effect',
        name: 'Energel',
        rarity: 2,
        texture: 'part-boost-energel.img',
        emitter: 'boost_energel'
    },
    'boost_sugar': {
        type: 'boost_effect',
        name: 'Sugar High',
        rarity: 1,
        texture: 'part-boost-sugar.img',
        emitter: 'boost_sugar',
        lore: 'Created by Incognito D00D'
    },
    'boost_gear': {
        type: 'boost_effect',
        name: 'Gear',
        rarity: 1,
        texture: 'part-boost-gear.img',
        emitter: 'boost_gear',
        lore: 'Created by Spy'
    },
    'boost_atomic': {
        type: 'boost_effect',
        name: 'Atomic',
        rarity: 2,
        texture: 'part-boost-atomic.img',
        emitter: 'boost_atomic',
        lore: ''
    },
    'boost_firestorm': {
        type: 'boost_effect',
        name: 'Firestorm',
        rarity: 3,
        texture: 'part-boost-firestorm.img',
        emitter: 'boost_firestorm',
        lore: 'Created by Roamer and lodine'
    },
    'boost_drumstick': {
        type: 'boost_effect',
        name: 'Drumstick',
        rarity: 3,
        texture: 'part-boost-drumstick.img',
        emitter: 'boost_drumstick',
        lore: ''
    },
    'boost_casing': {
        type: 'boost_effect',
        name: 'Casing',
        rarity: 2,
        texture: 'part-boost-casing.img',
        emitter: 'boost_casing',
        lore: 'Created by Legovoa'
    },
    'boost_bubble': {
        type: 'boost_effect',
        name: 'Bubble',
        rarity: 2,
        texture: 'part-boost-bubble.img',
        emitter: 'boost_bubble',
        lore: 'Created by Mxstyc'
    },
    'boost_speed': {
        type: 'boost_effect',
        name: 'Speed',
        rarity: 1,
        texture: 'part-boost-speed.img',
        emitter: 'boost_speed',
        lore: 'Created by Creeperslayr SaveTurtles'
    },
    'boost_bloodbath': {
        type: 'boost_effect',
        name: 'Bloodbath',
        rarity: 1,
        texture: 'boost-bloodbath.img',
        emitter: 'boost_bloodbath',
        lore: 'Created by Roamer'
    },
    'boost_holly_ivy': {
        type: 'boost_effect',
        name: 'Holly Ivy',
        rarity: 3,
        texture: 'boost-holly-ivy.img',
        emitter: 'boost_holly_ivy',
        lore: ''
    },
    'boost_rudolph': {
        type: 'boost_effect',
        name: 'Rudolph',
        rarity: 3,
        texture: 'boost-rudolph.img',
        emitter: 'boost_rudolph',
        lore: ''
    },
    'boost_ch_star': {
        type: 'boost_effect',
        name: 'Star',
        rarity: 2,
        texture: 'boost-star.img',
        emitter: 'boost_ch_star',
        lore: ''
    }
};

module.exports = EffectDefs;
