"use strict";


var kPassDefs = {
    'pass_BHA0': {
        type: 'pass',
        startDate: 1634756400000,
        endDate: null, //Do not show timer
        buyOptions: {
            'basic': {
                price: 4000,
                extraXP: 0
            },
            'vip': {
                price: 7500,
                extraXP: 1
            }
        },
        discountLevels: {
            /*'10':{
                discount: 10
            },*/
        },
        xp: [20, 31, 39, 47, 55, 70, 86, 101, 117],
        items: [{
            level: 2,
            item: 'armor_nordicmail',
            itemPremium: 'helmet_astarothgaze'
        }, {
            level: 3,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 30
        }, {
            level: 4,
            item: 'helmet_steadfastvisor',
            itemPremium: 'armor_adventurertunic'
        }, {
            level: 5,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 70
        }, {
            level: 6,
            item: 'ring_earneststar',
            itemPremium: 'armor_astarothward'
        }, {
            level: 7,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 110
        }, {
            level: 8,
            item: 'armor_puritychain',
            itemPremium: 'helmet_zodiachood'
        }, {
            level: 9,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 150
        }, {
            level: 10,
            item: 'helmet_paladinhelm',
            itemPremium: 'ring_exaltedswirl'
        }]
    },
    'pass_BHA1': {
        type: 'pass',
        startDate: 1636484400000,
        endDate: 1641322800000,
        buyOptions: {
            'basic': {
                price: 4000,
                extraXP: 0
            },
            'vip': {
                price: 7500,
                extraXP: 1
            }
        },
        discountLevels: {
            /*'10':{
                discount: 10
            },*/
        },
        xp: [20, 31, 39, 47, 55, 70, 86, 101, 117, 133, 148, 164, 179, 195, 211, 226, 242, 257, 273],
        items: [{
            level: 2,
            item: 'armor_nordicmail',
            itemPremium: 'helmet_astarothgaze'
        }, {
            level: 3,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 30
        }, {
            level: 4,
            item: 'emote_too_close',
            itemPremium: 'emote_clown'
        }, {
            level: 5,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 70
        }, {
            level: 6,
            item: 'emote_angry_blob',
            itemPremium: 'emote_to_be_or_not'
        }, {
            level: 7,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 110
        }, {
            level: 8,
            item: 'helmet_steadfastvisor',
            itemPremium: 'armor_adventurertunic'
        }, {
            level: 9,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 150
        }, {
            level: 10,
            item: 'emote_pills',
            itemPremium: 'emote_fabulorn'
        }, {
            level: 11,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 190
        }, {
            level: 12,
            item: 'emote_hi5',
            itemPremium: 'emote_broken_heart',
            amount: 150
        }, {
            level: 13,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 230
        }, {
            level: 14,
            item: 'ring_earneststar',
            itemPremium: 'armor_astarothward',
            amount: 0
        }, {
            level: 15,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 270
        }, {
            level: 16,
            item: 'armor_puritychain',
            itemPremium: 'helmet_zodiachood',
            amount: 0
        }, {
            level: 17,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 310
        }, {
            level: 18,
            item: 'emote_neutral',
            itemPremium: 'emote_mr_sockey',
            amount: 0
        }, {
            level: 19,
            item: 'gold',
            itemPremium: 'empty_slot',
            amount: 350
        }, {
            level: 20,
            item: 'helmet_paladinhelm',
            itemPremium: 'ring_exaltedswirl',
            amount: 0
        }]
    }
};

module.exports = kPassDefs;
