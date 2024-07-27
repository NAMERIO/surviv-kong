"use strict";


var LootBoxDefs = {
    'loot_box_01': {
        rarity: 'common',
        id: 'loot_box_01',
        name: 'Common Chest',
        type: 'lootBox',
        lootPool: 'common_chest',
        price: 10,
        //ad: '[AD_ID_HERE]',
        image: 'img/ui/shop/chest-common.png',
        probabilities: [{ rarity: 0, weight: 0.70 }, { rarity: 1, weight: 0.25 }, { rarity: 2, weight: 0.5 }, { rarity: 3, weight: 0.0 }]
    },
    'loot_box_02': {
        rarity: 'rare',
        id: 'loot_box_02',
        name: 'Rare Chest',
        type: 'lootBox',
        lootPool: 'rare_chest',
        price: 50,
        image: 'img/ui/shop/chest-rare.png',
        probabilities: [{ rarity: 0, weight: 0.40 }, { rarity: 1, weight: 0.50 }, { rarity: 2, weight: 0.10 }, { rarity: 3, weight: 0.0 }]
    },
    'loot_box_03': {
        rarity: 'epic',
        id: 'loot_box_03',
        name: 'Epic Chest',
        type: 'lootBox',
        lootPool: 'epic_chest',
        price: 100,
        image: 'img/ui/shop/chest-epic.png',
        probabilities: [{ rarity: 0, weight: 0.0 }, { rarity: 1, weight: 0.45 }, { rarity: 2, weight: 0.50 }, { rarity: 3, weight: 0.5 }]
    },
    'loot_box_04': {
        rarity: 'legendary',
        id: 'loot_box_04',
        name: 'Legendary Chest',
        type: 'lootBox',
        lootPool: 'legendary_chest',
        price: 150,
        image: 'img/ui/shop/chest-legendary.png',
        probabilities: [{ rarity: 0, weight: 0.0 }, { rarity: 1, weight: 0.55 }, { rarity: 2, weight: 0.35 }, { rarity: 3, weight: 0.10 }]
    }
    // ------------------------------------
    // -------- Limited loot boxes --------
    // ------------------------------------
    // IMPORTANT put limited_ at the start of the id (for analytics purporses)
    /*'limited_loot_box_pre_vacation_2020': {
        name: '2020 Holiday Crate',
        type: 'lootBox',
        lootPool: 'limited_pre_vacation_crate_2020',
        startDate: "2020-12-21T20:00:00.999Z",
        endDate: "2020-12-24T20:00:00.999Z",
        isLimited: true,
        price: 400,
        backgroundColor: '#3FAE4A',
        textColor: '#1C4F20',
        shadowColor: '#1A6922',
        img: 'limited_loot_box_pre_vacation_2020.svg',
        timer: {backgroundColor: '#AF1C24', color: '#FFFFFF'},
        probabilities: [
            { rarity: 0, weight: 0.0 },
            { rarity: 1, weight: 0.0 },
            { rarity: 2, weight: 0.0 },
            { rarity: 3, weight: 0.60 },
            { rarity: 4, weight: 0.40 },
            { rarity: 5, weight: 0.0 }
        ]
    },*/
};

module.exports = LootBoxDefs;
