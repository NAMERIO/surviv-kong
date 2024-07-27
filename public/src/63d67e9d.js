"use strict";


var util = require("./util.js");

function defineSkin(baseType, params) {
    return util.mergeDeep({}, BaseDefs[baseType], { baseType: baseType }, params);
}

var BaseDefs = {
    'outfitBase': {
        name: 'Basic Outfit',
        type: 'outfit',
        skinImg: {
            baseTint: 0xf8c574,
            baseSprite: 'player-base-01.img',
            handTint: 0xf8c574,
            handSprite: 'player-hands-01.img',
            footTint: 0xf8c574,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x816537,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0xffffff,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        sound: {
            pickup: 'clothes_pickup_01'
        }
    }
};

var SkinDefs = {
    // Regular outfits
    'outfitBase': defineSkin('outfitBase', {
        noDropOnDeath: true,
        name: 'Basic Outfit',
        rarity: 0,
        lore: 'Pure and simple.',
        lootImg: {
            sprite: 'loot-shirt-outfitBase.img',
            tint: 0xFFFFFF
        }
    }),

    'outfitDemo': defineSkin('outfitBase', {
        noDrop: true,
        rarity: 0,
        name: 'Demo',
        skinImg: {
            baseTint: 0xc76a67,
            baseSprite: 'player-base-02.img',
            handTint: 0xb5504d,
            handSprite: 'player-hands-02.img',
            footTint: 0xb5504d,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x9e3734,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDemo.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitTank': defineSkin('outfitBase', {
        noDrop: true,
        rarity: 0,
        name: 'Tank',
        skinImg: {
            baseTint: 0xeab963,
            baseSprite: 'player-base-02.img',
            handTint: 0xd8a44b,
            handSprite: 'player-hands-02.img',
            footTint: 0xd8a44b,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xbf8b2f,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitTank.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitMedic': defineSkin('outfitBase', {
        noDrop: true,
        rarity: 0,
        name: 'Medic',
        skinImg: {
            baseTint: 0xdc79dc,
            baseSprite: 'player-base-02.img',
            handTint: 0xc454c4,
            handSprite: 'player-hands-02.img',
            footTint: 0xc454c4,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xa937a9,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitMedic.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitScout': defineSkin('outfitBase', {
        noDrop: true,
        rarity: 0,
        name: 'Scout',
        skinImg: {
            baseTint: 0xacd563,
            baseSprite: 'player-base-02.img',
            handTint: 0x96c24a,
            handSprite: 'player-hands-02.img',
            footTint: 0x96c24a,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x83b034,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitScout.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitSniper': defineSkin('outfitBase', {
        noDrop: true,
        rarity: 0,
        name: 'Sniper',
        skinImg: {
            baseTint: 0x8dcedb,
            baseSprite: 'player-base-02.img',
            handTint: 0x70bac9,
            handSprite: 'player-hands-02.img',
            footTint: 0x70bac9,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x52a3b4,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitSniper.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitAssault': defineSkin('outfitBase', {
        noDrop: true,
        rarity: 0,
        name: 'Assault',
        skinImg: {
            baseTint: 0xdacf59,
            baseSprite: 'player-base-02.img',
            handTint: 0xc6bb40,
            handSprite: 'player-hands-02.img',
            footTint: 0xc6bb40,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xa69c28,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitAssault.img',
            tint: 0xFFFFFF
        }
    }),

    'outfitWhiteDay': defineSkin('outfitBase', {
        name: 'Marshmallow Suit',
        rarity: 0,
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitWhiteDay.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-white.img',
            footTint: 0xc6bb40,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xffffff,
            backpackSprite: 'player-circle-base-03.img'
        },
        lootImg: {
            sprite: 'loot-shirt-whiteDay.img',
            tint: 0xFFFFFF
        }
    }),

    'outfitTurkey': defineSkin('outfitBase', {
        name: 'Fowl Facade',
        noDropOnDeath: true,
        skinImg: {
            baseTint: 0xf0cebb,
            baseSprite: 'player-base-outfitTurkey.img',
            handTint: 0xa51300,
            handSprite: 'player-hands-02.img',
            footTint: 0xa51300,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xa85526,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitTurkey.img',
            tint: 0xf0cebb
        },
        rarity: 4,
        lore: 'M1100 not included.'
    }),

    'outfitWinter': defineSkin('outfitBase', {
        name: 'Winter Onesie',
        noDropOnDeath: true,
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitWinter.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-winter.img',
            footTint: 0x3F99BF,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x3F99BF,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitWinter.img',
            tint: 0xffffff
        },
        rarity: 3,
        lore: 'Sleep well.'
    }),

    'outfitGeometric': defineSkin('outfitBase', {
        name: 'Geometric',
        noDropOnDeath: true,
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitGeometric.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-geometric.img',
            footTint: 0x085050,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x085050,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitGeometric.img',
            tint: 0xffffff
        },
        rarity: 3,
        lore: 'What a square.'
    }),

    'outfitMilitary': defineSkin('outfitBase', {
        name: 'Military',
        noDropOnDeath: true,
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitMilitary.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-military.img',
            footTint: 0x4A5B42,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x4A5B42,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitMilitary.img',
            tint: 0xffffff
        },
        rarity: 3,
        lore: 'Hide now.'
    }),

    'outfitDev': defineSkin('outfitBase', {
        name: "Developer Swag",
        noDropOnDeath: true,
        skinImg: {
            baseTint: 0x348628,
            baseSprite: 'player-base-outfitDC.img',
            handTint: 0x69da22,
            handSprite: 'player-hands-02.img',
            footTint: 0x69da22,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x2c4b09,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDev.img',
            tint: 0xFFFFFF
        },
        rarity: 5,
        lore: 'Two-time limited edition print.'
    }),
    'outfitMod': defineSkin('outfitBase', {
        name: "Discord Moderatr",
        noDropOnDeath: true,
        skinImg: {
            baseTint: 0x3393db,
            baseSprite: 'player-base-outfitDC.img',
            handTint: 0x93c7ee,
            handSprite: 'player-hands-02.img',
            footTint: 0x93c7ee,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x175686,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitMod.img',
            tint: 0xFFFFFF
        },
        rarity: 3,
        lore: 'For those who wield the power of the pan.'
    }),
    'outfitWheat': defineSkin('outfitBase', {
        name: 'Splintered Wheat',
        rarity: 0,
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-outfitWheat.img',
            handTint: 0xf0dd92,
            handSprite: 'player-hands-01.img',
            footTint: 0xf0dd92,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xcba81d,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitWheat.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitNoir': defineSkin('outfitBase', {
        name: 'Neo Noir',
        skinImg: {
            baseTint: 0x1b1b1b,
            baseSprite: 'player-base-02.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-02.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x777777,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x1b1b1b
        }
    }),
    'outfitRedLeaderAged': defineSkin('outfitBase', {
        name: 'Weathered Red',
        skinImg: {
            baseTint: 0x9a1818,
            baseSprite: 'player-base-02.img',
            handTint: 0xff0000,
            handSprite: 'player-hands-02.img',
            footTint: 0xff0000,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x530c0c,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x9a1818
        }
    }),
    'outfitBlueLeaderAged': defineSkin('outfitBase', {
        name: 'Stifled Blue',
        skinImg: {
            baseTint: 0x173e99,
            baseSprite: 'player-base-02.img',
            handTint: 0x004eff,
            handSprite: 'player-hands-02.img',
            footTint: 0x004eff,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x0c204c,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x173e99
        }
    }),
    'outfitRedLeader': defineSkin('outfitBase', {
        name: 'Red Leader',
        noDrop: true,
        skinImg: {
            baseTint: 0x9b0000,
            baseSprite: 'player-base-02.img',
            handTint: 0xff0000,
            handSprite: 'player-hands-02.img',
            footTint: 0xff0000,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x530000,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x840000
        }
    }),
    'outfitBlueLeader': defineSkin('outfitBase', {
        name: 'Blue Leader',
        noDrop: true,
        skinImg: {
            baseTint: 0x002f9b,
            baseSprite: 'player-base-02.img',
            handTint: 0x004eff,
            handSprite: 'player-hands-02.img',
            footTint: 0x004eff,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x00174c,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x0033a7
        }
    }),
    'outfitSpetsnaz': defineSkin('outfitBase', {
        name: 'Siberian Assault',
        rarity: 0,
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-outfitSpetsnaz.img',
            handTint: 0xe4e4e4,
            handSprite: 'player-hands-01.img',
            footTint: 0xe4e4e4,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xd2d2d2,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitSpetsnaz.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitWoodsCloak': defineSkin('outfitBase', {
        name: 'Greencloak',
        skinImg: {
            baseTint: 0x2aff00,
            baseSprite: 'player-base-02.img',
            handTint: 0xfeffaa,
            handSprite: 'player-hands-02.img',
            footTint: 0xfeffaa,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xee9347,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x2aff00
        }
    }),
    'outfitElf': defineSkin('outfitBase', {
        name: "Tallow's Little Helper",
        skinImg: {
            baseTint: 0xc40000,
            baseSprite: 'player-base-01.img',
            handTint: 0x16b900,
            handSprite: 'player-hands-01.img',
            footTint: 0x16b900,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x059300,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x16b900
        }
    }),
    'outfitImperial': defineSkin('outfitBase', {
        name: 'Imperial Seal',
        skinImg: {
            baseTint: 0xbc002d,
            baseSprite: 'player-base-01.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-01.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xc0a73f,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0xbc002d
        }
    }),
    'outfitLumber': defineSkin('outfitBase', {
        name: "Woodcutter's Wrap",
        rarity: 1,
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-outfitLumber.img',
            handTint: 0x7e0308,
            handSprite: 'player-hands-02.img',
            footTint: 0x7e0308,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x4a1313,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitLumber.img',
            tint: 0xffffff
        }
    }),
    'outfitVerde': defineSkin('outfitBase', {
        name: 'Poncho Verde',
        skinImg: {
            baseTint: 0x1b400c,
            baseSprite: 'player-base-02.img',
            handTint: 0xb5c58b,
            handSprite: 'player-hands-02.img',
            footTint: 0xb5c58b,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xab7c29,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x1b400c
        }
    }),
    'outfitPineapple': defineSkin('outfitBase', {
        name: 'Valiant Pineapple',
        skinImg: {
            baseTint: 0x990000,
            baseSprite: 'player-base-02.img',
            handTint: 0x4c1111,
            handSprite: 'player-hands-02.img',
            footTint: 0x4c1111,
            footSprite: 'player-feet-02.img',
            backpackTint: 0xffcc00,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x990000
        }
    }),
    'outfitTarkhany': defineSkin('outfitBase', {
        name: 'Tarkhany Regal',
        skinImg: {
            baseTint: 0x4b2e83,
            baseSprite: 'player-base-02.img',
            handTint: 0xffb400,
            handSprite: 'player-hands-02.img',
            footTint: 0xffb400,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x472060,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x4b2e83
        }
    }),
    'outfitWaterElem': defineSkin('outfitBase', {
        name: 'Water Elemental',
        skinImg: {
            baseTint: 0x6cffe9,
            baseSprite: 'player-base-02.img',
            handTint: 0xf4005c,
            handSprite: 'player-hands-02.img',
            footTint: 0xf4005c,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x007f84,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x6cffe9
        }
    }),
    'outfitHeaven': defineSkin('outfitBase', {
        name: "Celestial Garb",
        rarity: 0,
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-outfitHeaven.img',
            handTint: 0xd2004f,
            handSprite: 'player-hands-02.img',
            footTint: 0xd2004f,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x008e97,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitHeaven.img',
            tint: 0xffffff
        }
    }),
    'outfitMeteor': defineSkin('outfitBase', {
        name: 'Falling Star',
        skinImg: {
            baseTint: 0x950000,
            baseSprite: 'player-base-02.img',
            handTint: 0xff7800,
            handSprite: 'player-hands-02.img',
            footTint: 0xff7800,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x48231e,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x950000
        }
    }),
    'outfitIslander': defineSkin('outfitBase', {
        name: 'Island Time',
        skinImg: {
            baseTint: 0xffc600,
            baseSprite: 'player-base-01.img',
            handTint: 0x024600,
            handSprite: 'player-hands-01.img',
            footTint: 0x024600,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x449700,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0xffc600
        }
    }),
    'outfitAqua': defineSkin('outfitBase', {
        name: 'Aquatic Avenger',
        skinImg: {
            baseTint: 0x00baa2,
            baseSprite: 'player-base-01.img',
            handTint: 0x00ffde,
            handSprite: 'player-hands-01.img',
            footTint: 0x00ffde,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x08302c,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x00baa2
        }
    }),
    'outfitCoral': defineSkin('outfitBase', {
        name: 'Coral Guise',
        skinImg: {
            baseTint: 0xff5f67,
            baseSprite: 'player-base-01.img',
            handTint: 0xff898f,
            handSprite: 'player-hands-01.img',
            footTint: 0xff898f,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xffecca,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0xff5f67
        }
    }),
    'outfitKhaki': defineSkin('outfitBase', {
        name: 'The Initiative',
        rarity: 1,
        skinImg: {
            baseTint: 0xc3ae85,
            baseSprite: 'player-base-02.img',
            handTint: 0x8f8064,
            handSprite: 'player-hands-02.img',
            footTint: 0x8f8064,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x40392c,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0xc3ae85
        }
    }),
    'outfitParma': defineSkin('outfitBase', {
        name: 'PARMA Jumpsuit',
        noDropOnDeath: true,
        rarity: 1,
        lore: 'Next generation inversion.',
        skinImg: {
            baseTint: 0x857659,
            baseSprite: 'player-base-01.img',
            handTint: 0xc3ae85,
            handSprite: 'player-hands-01.img',
            footTint: 0xc3ae85,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x40392c,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitParma.img',
            tint: 0xffffff
        }
    }),
    'outfitParmaPrestige': defineSkin('outfitBase', {
        name: 'The Core Jumpsuit',
        noDropOnDeath: true,
        rarity: 3,
        lore: 'Special issue for staffers at Bunker 1.',
        skinImg: {
            baseTint: 0xe3c081,
            baseSprite: 'player-base-outfitParmaPrestige.img',
            handTint: 0xa9936b,
            handSprite: 'player-hands-02.img',
            footTint: 0xa9936b,
            footSprite: 'player-feet-02.img',
            backpackTint: 0x655231,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitParmaPrestige.img',
            tint: 0xffffff
        }
    }),
    'outfitCasanova': defineSkin('outfitBase', {
        name: 'Casanova Silks',
        skinImg: {
            baseTint: 0x42080c,
            baseSprite: 'player-base-01.img',
            handTint: 0x740007,
            handSprite: 'player-hands-01.img',
            footTint: 0x740007,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x101010,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x42080c
        }
    }),
    'outfitPrisoner': defineSkin('outfitBase', {
        name: 'The New Black',
        skinImg: {
            baseTint: 0xff5c22,
            baseSprite: 'player-base-01.img',
            handTint: 0xfc7523,
            handSprite: 'player-hands-01.img',
            footTint: 0xfc7523,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xffae00,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0xff5c22
        }
    }),
    'outfitJester': defineSkin('outfitBase', {
        name: "Jester's Folly",
        skinImg: {
            baseTint: 0x770078,
            baseSprite: 'player-base-01.img',
            handTint: 0x4b004c,
            handSprite: 'player-hands-01.img',
            footTint: 0x4b004c,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x0e4c00,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x770078
        }
    }),
    'outfitWoodland': defineSkin('outfitBase', {
        name: 'Woodland Combat',
        rarity: 1,
        lore: 'Common component of PARMA survival caches.',
        skinImg: {
            baseTint: 0x2b332a,
            baseSprite: 'player-base-01.img',
            handTint: 0x5a6c52,
            handSprite: 'player-hands-01.img',
            footTint: 0x5a6c52,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x4d2600,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitWoodland.img',
            tint: 0xffffff
        }
    }),
    'outfitRoyalFortune': defineSkin('outfitBase', {
        name: 'Royal Fortune',
        rarity: 3,
        skinImg: {
            baseTint: 0x7f2723,
            baseSprite: 'player-base-01.img',
            handTint: 0xe8c22a,
            handSprite: 'player-hands-01.img',
            footTint: 0xe8c22a,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x984f00,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitRoyalFortune.img',
            tint: 0xffffff
        }
    }),
    'outfitKeyLime': defineSkin('outfitBase', {
        name: 'Key Lime',
        rarity: 1,
        lore: 'Not for eating.',
        skinImg: {
            baseTint: 0xc7ff3f,
            baseSprite: 'player-base-01.img',
            handTint: 0xeeff5d,
            handSprite: 'player-hands-01.img',
            footTint: 0xeeff5d,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xbc8737,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitKeyLime.img',
            tint: 0xffffff
        }
    }),
    'outfitCobaltShell': defineSkin('outfitBase', {
        name: 'Cobalt Shell',
        rarity: 1,
        lore: 'It means bluish.',
        skinImg: {
            baseTint: 0x002b57,
            baseSprite: 'player-base-01.img',
            handTint: 0x295e7c,
            handSprite: 'player-hands-01.img',
            footTint: 0x295e7c,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x004a95,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitCobaltShell.img',
            tint: 0xffffff
        }
    }),
    'outfitCarbonFiber': defineSkin('outfitBase', {
        name: 'Carbon Fiber',
        noDropOnDeath: true,
        rarity: 2,
        lore: 'Military-grade, fine spun filament.',
        skinImg: {
            baseTint: 0x212121,
            baseSprite: 'player-base-01.img',
            handTint: 0x1c1c1c,
            handSprite: 'player-hands-01.img',
            footTint: 0x1c1c1c,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x363636,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitCarbonFiber.img',
            tint: 0xffffff
        }
    }),
    'outfitDarkGloves': defineSkin('outfitBase', {
        name: 'The Professional',
        noDropOnDeath: true,
        rarity: 1,
        lore: 'True survivrs wear the dark gloves.',
        skinImg: {
            baseTint: 0xf8c574,
            baseSprite: 'player-base-01.img',
            handTint: 0xbe7800,
            handSprite: 'player-hands-01.img',
            footTint: 0xbe7800,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xa36700,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDarkGloves.img',
            tint: 0xffffff
        }
    }),
    'outfitDarkShirt': defineSkin('outfitBase', {
        name: 'The Semi-Pro',
        noDropOnDeath: true,
        rarity: 0,
        lore: 'Some survivrs wear the dark shirt.',
        skinImg: {
            baseTint: 0xbe7800,
            baseSprite: 'player-base-01.img',
            handTint: 0xf8c574,
            handSprite: 'player-hands-01.img',
            footTint: 0xf8c574,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xe7ae53,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDarkShirt.img',
            tint: 0xffffff
        }
    }),
    'outfitGhillie': defineSkin('outfitBase', {
        name: 'Ghillie Suit',
        ghillie: true,
        skinImg: {
            baseTint: 0x83af50,
            baseSprite: 'player-base-01.img',
            handTint: 0x83af50,
            handSprite: 'player-hands-01.img',
            footTint: 0x83af50,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x663300,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-01.img',
            tint: 0x83af50
        }
    }),
    'outfitDesertCamo': defineSkin('outfitBase', {
        name: 'Desert Camo',
        rarity: 1,
        skinImg: {
            baseTint: 0xd19b4e,
            baseSprite: 'player-base-01.img',
            handTint: 0xaa6d16,
            handSprite: 'player-hands-01.img',
            footTint: 0xaa6d16,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xffcb82,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDesertCamo.img',
            tint: 0xffffff
        }
    }),
    'outfitCamo': defineSkin('outfitBase', {
        name: 'Forest Camo',
        rarity: 1,
        lore: 'Be one with the trees.',
        skinImg: {
            baseTint: 0x999966,
            baseSprite: 'player-base-01.img',
            handTint: 0x848457,
            handSprite: 'player-hands-01.img',
            footTint: 0x848457,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x666633,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitCamo.img',
            tint: 0xffffff
        }
    }),
    'outfitRed': defineSkin('outfitBase', {
        name: 'Target Practice',
        noDropOnDeath: true,
        rarity: 2,
        lore: "On the plus side, they won't see you bleed.",
        skinImg: {
            baseTint: 0xff0000,
            baseSprite: 'player-base-01.img',
            handTint: 0xd40000,
            handSprite: 'player-hands-01.img',
            footTint: 0xd40000,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xb70000,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitRed.img',
            tint: 0xffffff
        }
    }),
    'outfitWhite': defineSkin('outfitBase', {
        name: 'Arctic Avenger',
        noDropOnDeath: true,
        rarity: 1,
        lore: 'No business like snow business.',
        skinImg: {
            baseTint: 0xe3e3e3,
            baseSprite: 'player-base-01.img',
            handTint: 0xeeeeee,
            handSprite: 'player-hands-01.img',
            footTint: 0xeeeeee,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xdcdcdc,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitWhite.img',
            tint: 0xffffff
        }
    }),
    'outfitSunset': defineSkin('outfitBase', {
        name: 'Sunset',
        noDropOnDeath: true,
        rarity: 2,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitSunset.img',
            handTint: 0xBE89AB,
            handSprite: 'player-hands-01.img',
            footTint: 0xBE89AB,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x628AC9,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitSunset.img',
            tint: 0xffffff
        }
    }),
    'outfitDeepPurple': defineSkin('outfitBase', {
        name: 'Deep Purple',
        noDropOnDeath: true,
        rarity: 1,
        lore: '',
        skinImg: {
            baseTint: 0xe3e3e3,
            baseSprite: 'player-base-outfitDeepPurple.img',
            handTint: 0x907B9E,
            handSprite: 'player-hands-01.img',
            footTint: 0x907B9E,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x907B9E,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDeepPurple.img',
            tint: 0xffffff
        }
    }),
    'outfitSplotchfest': defineSkin('outfitBase', {
        name: 'Splotchfest',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitSplotchfest.img',
            handTint: 0x63A73C,
            handSprite: 'player-hands-01.img',
            footTint: 0x63A73C,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x63A73C,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitSplotchfest.img',
            tint: 0xffffff
        }
    }),
    'outfitClaymore': defineSkin('outfitBase', {
        name: 'Clay More',
        noDropOnDeath: true,
        rarity: 1,
        lore: '',
        skinImg: {
            baseTint: 0xe3e3e3,
            baseSprite: 'player-base-outfitClayMore.img',
            handTint: 0xA8502A,
            handSprite: 'player-hands-01.img',
            footTint: 0xA8502A,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xEE8781,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitClayMore.img',
            tint: 0xffffff
        }
    }),
    'outfitChromesis': defineSkin('outfitBase', {
        name: 'Chromesis',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitChromesis.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-chrome.img',
            footTint: 0x959595,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x959595,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitChromesis.img',
            tint: 0xffffff
        },
        accessory: {
            sprite: 'outfit-chrome-accessory.img',
            topUI: 55
        }
    }),
    'outfitFragtastic': defineSkin('outfitBase', {
        name: 'Fragtastic',
        noDropOnDeath: true,
        rarity: 1,
        lore: 'Created by Hatsune Blake',
        skinImg: {
            baseTint: 0x62591E,
            handTint: 0x80752B,
            footTint: 0x80752B,
            backpackTint: 0x909090
        },
        lootImg: {
            sprite: 'loot-shirt-outfitFragtastic.img',
            tint: 0xffffff
        }
    }),
    'outfitRusticSands': defineSkin('outfitBase', {
        name: 'Rustic Sands',
        noDropOnDeath: true,
        rarity: 1,
        lore: 'Created by FrankzeeTank',
        skinImg: {
            baseTint: 0xFADA78,
            handTint: 0x714216,
            footTint: 0x714216,
            backpackTint: 0x7B2817
        },
        lootImg: {
            sprite: 'loot-shirt-outfitRusticSands.img',
            tint: 0xffffff
        }
    }),
    'outfitWaves': defineSkin('outfitBase', {
        name: 'Waves',
        noDropOnDeath: true,
        rarity: 2,
        lore: 'Created by Fonpard',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitWaves.img',
            handTint: 0x3C7598,
            footTint: 0x3C7598,
            backpackTint: 0x153445
        },
        lootImg: {
            sprite: 'loot-shirt-outfitWaves.img',
            tint: 0xffffff
        }
    }),
    'outfitUrbanCamo': defineSkin('outfitBase', {
        name: 'Urban Camo',
        noDropOnDeath: true,
        rarity: 2,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitUrbanCamo.img',
            handTint: 0x2B405C,
            footTint: 0x2B405C,
            backpackTint: 0xA5B2CA
        },
        lootImg: {
            sprite: 'loot-shirt-outfitUrbanCamo.img',
            tint: 0xffffff
        }
    }),
    'outfitNeonEyesore': defineSkin('outfitBase', {
        name: 'Neon Eyesore',
        noDropOnDeath: true,
        rarity: 3,
        lore: 'Created by Savage_Wuhan (Jerrie123)',
        description: 'For your eyes only',
        skinImg: {
            baseTint: 0x74FCFD,
            handTint: 0x75FA4C,
            footTint: 0x75FA4C,
            backpackTint: 0xFFFE55
        },
        lootImg: {
            sprite: 'loot-shirt-outfitNeonEyesore.img',
            tint: 0xffffff
        }
    }),
    'outfitGiraffe': defineSkin('outfitBase', {
        name: 'Giraffe',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitGiraffe.img',
            handTint: 0xF1B644,
            footTint: 0xF1B644,
            backpackTint: 0xF1B644,
            backpackSprite: 'player-circle-base-02.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitGiraffe.img',
            tint: 0xffffff
        }
    }),
    'outfitCow': defineSkin('outfitBase', {
        name: 'Cow',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitCow.img',
            handTint: 0xffffff,
            footTint: 0xffffff,
            backpackTint: 0xffffff
        },
        lootImg: {
            sprite: 'loot-shirt-outfitCow.img',
            tint: 0xffffff
        }
    }),
    'outfitMojo': defineSkin('outfitBase', {
        name: 'Mojo',
        noDropOnDeath: true,
        rarity: 4,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitMojo.img',
            handTint: 0xE6C70D,
            footTint: 0xE6C70D,
            backpackTint: 0x000000
        },
        lootImg: {
            sprite: 'loot-shirt-outfitMojo.img',
            tint: 0xffffff
        }
    }),
    'outfitZebra': defineSkin('outfitBase', {
        name: 'Zebra',
        noDropOnDeath: true,
        rarity: 4,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitZebra.img',
            handTint: 0xffffff,
            footTint: 0xffffff,
            backpackTint: 0xffffff
        },
        lootImg: {
            sprite: 'loot-shirt-outfitZebra.img',
            tint: 0xffffff
        }
    }),
    'outfitAstronaut': defineSkin('outfitBase', {
        name: 'Astronaut',
        noDropOnDeath: true,
        rarity: 4,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitAstronaut.img',
            handTint: 0xffffff,
            footTint: 0xffffff,
            backpackTint: 0xFF9600
        },
        lootImg: {
            sprite: 'loot-shirt-outfitAstronaut.img',
            tint: 0xffffff
        },
        accessory: {
            sprite: 'player-accessory-outfitAstronaut.img',
            scale: 0.27,
            scaleUI: 0.38
        }
    }),
    'outfitDiamondy': defineSkin('outfitBase', {
        name: 'Diamondy',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xBFE8FF,
            handTint: 0xF8C137,
            footTint: 0xF8C137,
            backpackTint: 0xF8C137
        },
        lootImg: {
            sprite: 'loot-shirt-outfitDiamondy.img',
            tint: 0xffffff
        },
        accessory: {
            sprite: 'player-accessory-outfitDiamondy.img',
            anchor: {
                x: 0.6,
                y: 0.5
            },
            topUI: 55
        }
    }),
    'outfitMecha': defineSkin('outfitBase', {
        name: 'Mecha',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xEDEDED,
            handTint: 0xffffff,
            handSprite: 'player-hands-outfitMecha.img',
            footTint: 0x5B7EDA,
            backpackTint: 0x5B7EDA
        },
        lootImg: {
            sprite: 'loot-shirt-outfitMecha.img',
            tint: 0xffffff
        },
        accessory: {
            sprite: 'player-accessory-outfitMecha.img',
            anchor: {
                x: 0.6,
                y: 0.5
            },
            topUI: 55

        }
    }),
    'outfitFireball': defineSkin('outfitBase', {
        name: 'Fireball',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xBB2B10,
            handTint: 0xffffff,
            handSprite: 'player-hands-outfitFireball.img',
            footTint: 0xD03215,
            backpackTint: 0xD03215
        },
        lootImg: {
            sprite: 'loot-shirt-outfitFireball.img',
            tint: 0xffffff
        },
        accessory: {
            sprite: 'player-accessory-outfitFireball.img',
            anchor: {
                x: 0.6,
                y: 0.5
            },
            topUI: 55
        }
    }),

    // Obstacle outfits
    'outfitBarrel': defineSkin('outfitBase', {
        name: 'Barrel Costume',
        obstacleType: 'barrel_01',
        baseScale: 0.8,
        lootImg: {
            tint: 0x393939
        }
    }),
    'outfitWoodBarrel': defineSkin('outfitBase', {
        name: 'Wood Barrel Costume',
        obstacleType: 'barrel_02',
        baseScale: 1.0,
        lootImg: {
            tint: 0xab6f22
        }
    }),
    'outfitStone': defineSkin('outfitBase', {
        name: 'Stone Costume',
        obstacleType: 'stone_01',
        baseScale: 0.9,
        lootImg: {
            tint: 0x717171
        }
    }),
    'outfitTree': defineSkin('outfitBase', {
        name: 'Tree Costume',
        obstacleType: 'tree_07',
        baseScale: 1.0,
        lootImg: {
            tint: 0x462d12
        }
    }),
    'outfitTreeSpooky': defineSkin('outfitBase', {
        name: 'Spooky Tree Costume',
        obstacleType: 'tree_05',
        baseScale: 1.0,
        lootImg: {
            tint: 0x1b1917
        }
    }),
    'outfitStump': defineSkin('outfitBase', {
        name: 'Stump Costume',
        obstacleType: 'tree_09',
        baseScale: 1.0,
        lootImg: {
            tint: 0x834400
        }
    }),
    'outfitBush': defineSkin('outfitBase', {
        name: 'Bush Costume',
        obstacleType: 'bush_01b',
        baseScale: 1.0,
        lootImg: {
            tint: 0x3b5b1f
        }
    }),
    'outfitLeafPile': defineSkin('outfitBase', {
        name: 'Leaf Pile Costume',
        obstacleType: 'bush_06b',
        baseScale: 1.0,
        lootImg: {
            tint: 0xff4d00
        }
    }),
    'outfitCrate': defineSkin('outfitBase', {
        name: 'Crate Costume',
        obstacleType: 'crate_01',
        baseScale: 1.0,
        lootImg: {
            tint: 0x663300
        }
    }),
    'outfitTable': defineSkin('outfitBase', {
        name: 'Table Costume',
        obstacleType: 'table_01',
        baseScale: 1.0,
        lootImg: {
            tint: 0x663300
        }
    }),
    'outfitSoviet': defineSkin('outfitBase', {
        name: 'Soviet Costume',
        obstacleType: 'crate_02',
        baseScale: 1.0,
        lootImg: {
            tint: 0x663300
        }
    }),
    'outfitAirdrop': defineSkin('outfitBase', {
        name: 'Air Drop Costume',
        obstacleType: 'crate_10',
        baseScale: 1.0,
        lootImg: {
            tint: 0x646464
        }
    }),
    'outfitOven': defineSkin('outfitBase', {
        name: 'Oven Costume',
        obstacleType: 'oven_01',
        baseScale: 1.0,
        lootImg: {
            tint: 0xe3e3e3
        }
    }),
    'outfitRefrigerator': defineSkin('outfitBase', {
        name: 'Fridge Costume',
        obstacleType: 'refrigerator_01b',
        baseScale: 1.0,
        lootImg: {
            tint: 0x76000b
        }
    }),
    'outfitVending': defineSkin('outfitBase', {
        name: 'Vending Costume',
        obstacleType: 'vending_01',
        baseScale: 1.0,
        lootImg: {
            tint: 0x002aad
        }
    }),
    'outfitPumpkin': defineSkin('outfitBase', {
        name: 'Pumpkin Costume',
        obstacleType: 'pumpkin_01',
        baseScale: 1.0,
        lootImg: {
            tint: 0xf27503
        }
    }),
    'outfitWoodpile': defineSkin('outfitBase', {
        name: 'Woodpile Costume',
        obstacleType: 'woodpile_01',
        baseScale: 1.0,
        lootImg: {
            tint: 0x904800
        }
    }),
    'outfitToilet': defineSkin('outfitBase', {
        name: 'Toilet Costume',
        obstacleType: 'toilet_02',
        baseScale: 1.0,
        lootImg: {
            tint: 0xFFFFFF
        }
    }),

    'outfitBushRiver': defineSkin('outfitBase', {
        name: 'River Bush Costume',
        obstacleType: 'bush_04',
        baseScale: 1.0,
        lootImg: {
            tint: 0x517b2a
        }
    }),
    'outfitCrab': defineSkin('outfitBase', {
        name: 'Crab Pot Costume',
        obstacleType: 'crate_20',
        baseScale: 1.0,
        lootImg: {
            tint: 0xfd3018
        }
    }),
    'outfitStumpAxe': defineSkin('outfitBase', {
        name: 'Stump Axe Costume',
        obstacleType: 'tree_02h',
        baseScale: 1.0,
        lootImg: {
            tint: 0xa9621d
        }
    }),
    'outfitSpeedo': defineSkin('outfitBase', {
        noDrop: false,
        rarity: 1,
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitSpeedo.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-speedo.img',
            footTint: 0x959595,
            footSprite: 'player-feet-01.img',
            backpackTint: 0x959595,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-speedo.img',
            tint: 0xFFFFFF
        }
    }),
    'outfitBlueLava': defineSkin('outfitBase', {
        name: 'BlueLava',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitBlueLava.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-outfitBlueLava.img',
            footTint: 0xffffff,
            backpackTint: 0xffffff,
            backpackSprite: 'player-circle-base-outfitBlueLava.img'
        },
        lootImg: {
            sprite: 'loot-shirt-outfitBlueLava.img',
            tint: 0xffffff
        }
    }),
    'outfitInfernoCamo': defineSkin('outfitBase', {
        name: 'Inferno Camo',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitInferno.img',
            handTint: 0xE85F0A,
            footTint: 0xE85F0A,
            backpackTint: 0xE85F0A
        },
        lootImg: {
            sprite: 'loot-shirt-outfitInferno.img',
            tint: 0xffffff
        }
    }),
    'outfitSpeedoSunburn': defineSkin('outfitBase', {
        name: 'Speedo Sunburn',
        noDropOnDeath: true,
        rarity: 2,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitSpeedoSunburn.img',
            handTint: 0xF4B4FF,
            footTint: 0xF4B4FF,
            backpackTint: 0xFE0F16
        },
        lootImg: {
            sprite: 'loot-shirt-outfitSpeedoSunburn.img',
            tint: 0xffffff
        }
    }),
    'outfitMango': defineSkin('outfitBase', {
        name: 'Mango',
        noDropOnDeath: true,
        rarity: 2,
        lore: 'Created by Calieh',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-outfitMango.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-outfitMango.img',
            footTint: 0xffffff,
            backpackTint: 0x7D663E
        },
        lootImg: {
            sprite: 'loot-shirt-outfitMango.img',
            tint: 0xffffff
        }
    }),
    'outfitParrot': defineSkin('outfitBase', {
        name: 'Parrot',
        noDropOnDeath: true,
        rarity: 1,
        lore: 'Created by Mxstyc',
        skinImg: {
            baseTint: 0x48742C,
            baseSprite: 'player-base-01.img',
            handTint: 0xEAC352,
            handSprite: 'player-hands-01.img',
            footTint: 0xEAC352,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xBC261A,
            backpackSprite: 'player-circle-base-01.img'
        },
        lootImg: {
            sprite: 'loot-shirt-parrot.img',
            tint: 0xffffff
        }
    }),
    'outfitCrusader': defineSkin('outfitBase', {
        name: 'Crusader',
        noDropOnDeath: true,
        rarity: 2,
        lore: 'Created by avika',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-crusader.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-crusader.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-crusader.img'
        },
        lootImg: {
            sprite: 'loot-crusader-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitLasrDisk': defineSkin('outfitBase', {
        name: 'Lasr Disk',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-lasr-disk.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-lasr-disk.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-lasr-disk.img'
        },
        lootImg: {
            sprite: 'loot-lasr-disk-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitBeachCamo': defineSkin('outfitBase', {
        name: 'Beach Camo',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-beach-camo.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-beach-camo.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-beach-camo.img'
        },
        lootImg: {
            sprite: 'loot-beach-camo-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitForest': defineSkin('outfitBase', {
        name: 'Forest',
        noDropOnDeath: true,
        rarity: 1,
        lore: '',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-forest.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-forest.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-forest.img'
        },
        lootImg: {
            sprite: 'loot-forest-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitGingerbread': defineSkin('outfitBase', {
        name: 'Gingerbread',
        noDropOnDeath: true,
        rarity: 3,
        lore: '',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-gingerbread.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-gingerbread.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-gingerbread.img'
        },
        lootImg: {
            sprite: 'loot-gingerbread-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitVenom': defineSkin('outfitBase', {
        name: 'Venom',
        noDropOnDeath: true,
        rarity: 2,
        lore: 'Created by CaptainPoultry',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-venom.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-venom.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-venom.img'
        },
        lootImg: {
            sprite: 'loot-venom-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitBlueMecha': defineSkin('outfitBase', {
        name: 'Blue Mecha',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-blue-mecha.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-blue-mecha.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-blue-mecha.img'
        },
        lootImg: {
            sprite: 'loot-blue-mecha-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitEventHorizon': defineSkin('outfitBase', {
        name: 'Event Horizon',
        noDropOnDeath: true,
        rarity: 4,
        lore: 'Created by Roamer',
        skinImg: {
            baseTint: 0xFFFFFF,
            baseSprite: 'player-base-event-horizon.img',
            handTint: 0xFFFFFF,
            handSprite: 'player-hands-event-horizon.img',
            footTint: 0xFFFFFF,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xFFFFFF,
            backpackSprite: 'player-back-event-horizon.img'
        },
        lootImg: {
            sprite: 'loot-event-horizon-outfit.img',
            tint: 0xffffff
        }
    }),
    'outfitGrinch': defineSkin('outfitBase', {
        name: 'Grinch',
        noDropOnDeath: true,
        rarity: 5,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-grinch.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-grinch.img',
            footTint: 0xffffff,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xC02727
        },
        lootImg: {
            sprite: 'loot-shirt-grinch.img',
            tint: 0xffffff
        }
    }),
    'outfitSnowman': defineSkin('outfitBase', {
        name: 'Snowman',
        noDropOnDeath: true,
        rarity: 4,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-snowman.img',
            handTint: 0xC02727,
            handSprite: 'player-hands-01.img',
            footTint: 0xffffff,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xC02727
        },
        lootImg: {
            sprite: 'loot-shirt-snowman.img',
            tint: 0xffffff
        }
    }),
    'outfitChritstmasTree': defineSkin('outfitBase', {
        name: 'Chritstmas Tree',
        noDropOnDeath: true,
        rarity: 4,
        lore: '',
        skinImg: {
            baseTint: 0xffffff,
            baseSprite: 'player-base-christmastree.img',
            handTint: 0xffffff,
            handSprite: 'player-hands-christmastree.img',
            footTint: 0xffffff,
            footSprite: 'player-feet-01.img',
            backpackTint: 0xC02727
        },
        lootImg: {
            sprite: 'loot-shirt-christmastree.img',
            tint: 0xffffff
        }
    })
};

var OutfitDefs = util.mergeDeep({}, BaseDefs, SkinDefs);
module.exports = OutfitDefs;
