"use strict";


/**Default loot container scale 1.4
 * Default loot sprite scale 1.0
 * Params scale:1.4
 *        innerScale: 1.0
 */
var ConsumablesDefs = {
    'hppotionsmall': {
        name: 'Small Health Potion',
        type: 'heal',
        useTime: 1.0,
        heal: 10.0,
        maxHeal: 100.0,
        effects: 'Heals {heal} HP',
        slotMax: 10,
        lootImg: {
            sprite: 'loot-medical-hp-potion-small.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'bandage_pickup_01',
            use: 'bandage_use_01'
        },
        emitter: 'hp_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0xff0000
        }
    },
    'hppotionmedium': {
        name: 'Medium Health Potion',
        type: 'heal',
        useTime: 3.0,
        heal: 25.0,
        maxHeal: 100.0,
        effects: 'Heals {heal} HP',
        slotMax: 5,
        lootImg: {
            sprite: 'loot-medical-hp-potion.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'bandage_pickup_01',
            use: 'bandage_use_01'
        },
        emitter: 'hp_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0xff0000
        }
    },
    'hppotionlarge': {
        name: 'Large Health Potion',
        type: 'heal',
        useTime: 5.0,
        heal: 40.0,
        maxHeal: 100.0,
        effects: 'Heals {heal} HP',
        slotMax: 3,
        lootImg: {
            sprite: 'loot-medical-hp-potion-large.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'bandage_pickup_01',
            use: 'bandage_use_01'
        },
        emitter: 'hp_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0xff0000
        }
    },
    'brawnpotion': {
        name: 'Brawn Potion',
        type: 'power',
        useTime: 1.5,
        boost: 0.15, //15%
        boostDuration: 30.0,
        effects: 'Buffs attack damage by {boost}% for {boostDuration} seconds',
        slotMax: 5,
        lootImg: {
            sprite: 'loot-medical-brawn-potion.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img', //'loot-circle-outer-01.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'pills_pickup_01',
            use: 'pills_use_01'
        },
        emitter: 'brawn_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },
    'exppotionsmall': {
        name: 'Small Experience Potion',
        type: 'exp',
        useTime: 0.5,
        experience: 2.0,
        effects: 'Grants {experience} EXP',
        slotMax: 10,
        lootImg: {
            sprite: 'loot-medical-exp-potion-small.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img', //'loot-circle-outer-01.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'pills_pickup_01',
            use: 'pills_use_01'
        },
        emitter: 'xp_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },
    'exppotionmedium': {
        name: 'Medium Experience Potion',
        type: 'exp',
        useTime: 1.5,
        experience: 5.0,
        effects: 'Grants {experience} EXP',
        slotMax: 5,
        lootImg: {
            sprite: 'loot-medical-exp-potion.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img', //'loot-circle-outer-01.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'pills_pickup_01',
            use: 'pills_use_01'
        },
        emitter: 'xp_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },
    'exppotionlarge': {
        name: 'Large Experience Potion',
        type: 'exp',
        useTime: 2.5,
        experience: 10.0,
        effects: 'Grants {experience} EXP',
        slotMax: 3,
        lootImg: {
            sprite: 'loot-medical-exp-potion-large.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img', //'loot-circle-outer-01.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        sound: {
            pickup: 'pills_pickup_01',
            use: 'pills_use_01'
        },
        emitter: 'xp_potion',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    }
};

module.exports = ConsumablesDefs;
