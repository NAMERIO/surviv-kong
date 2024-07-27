"use strict";


var ConsumablesDefs = {
    'healthkit': {
        name: 'Med Kit',
        type: 'heal',
        useTime: 6.0,
        heal: 100.0,
        maxHeal: 100.0,
        lootImg: {
            sprite: 'loot-medical-healthkit.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'healthkit_pickup_01',
            use: 'healthkit_use_01'
        },
        emitter: 'heal',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0xff0000
        }
    },
    'soda': {
        name: 'Soda',
        type: 'boost',
        useTime: 3.0,
        boost: 25.0,
        lootImg: {
            sprite: 'loot-medical-soda.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'soda_pickup_01',
            use: 'soda_use_01'
        },
        emitter: 'boost',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },
    'stats': {
        name: 'Stats',
        type: 'boost',
        useTime: 0.0,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-medical-soda.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'soda_pickup_01',
            use: 'soda_use_01'
        },
        emitter: 'boost',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },

    'flask': {
        name: 'Flask',
        type: 'boost',
        useTime: 3.0,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-medical-flask-01.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'soda_pickup_01',
            use: 'soda_use_01'
        },
        emitter: 'boost',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },

    'chocolateBox': {
        name: 'Chocolate Box',
        type: 'boost',
        useTime: 3.0,
        boost: 25.0,
        lootImg: {
            sprite: 'loot-medical-chocolateBox.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'chocolateBox_pickup_01',
            use: 'chocolateBox_use_01'
        },
        emitter: 'boost',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },

    'bottle': {
        name: 'Bottle',
        type: 'boost',
        useTime: 3.0,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-luck-bottle.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'soda_pickup_01',
            use: 'soda_use_01'
        },
        emitter: 'boost',
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },
    'gunchilada': {
        name: 'Gunchilada',
        type: 'boost',
        useTime: 2.0,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-gunchilada.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'gunchilada_pickup_01',
            use: 'gunchilada_use_01'
        },
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },

    'watermelon': {
        name: 'Popsicle',
        type: 'boost',
        useTime: 2.0,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-watermelon.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'watermelon_pickup_01',
            use: 'gunchilada_use_01'
        },
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },

    'nitroLace': {
        name: 'Nitro Lace',
        type: 'boost',
        useTime: 2.0,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-nitroLace.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'watermelon_pickup_01',
            use: 'nitro_use_01'
        },
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    },

    'pulseBox': {
        name: 'Pulse Box',
        type: 'boost',
        useTime: 0.2,
        boost: 0.0,
        lootImg: {
            sprite: 'loot-pulseBox.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'soda_pickup_01',
            use: 'pulseBox_use_01'
        },
        aura: {
            sprite: 'part-aura-circle-01.img',
            tint: 0x199500
        }
    }
};

module.exports = ConsumablesDefs;
