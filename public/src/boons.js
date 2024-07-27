"use strict";


var Boons = {
    'boon_extrapouch': {
        name: 'boon_extrapouch',
        type: 'boon',
        params: {
            stack: 3
        }
    },
    'boon_elvishmetal': {
        name: 'boon_elvishmetal',
        type: 'boon',
        worldImg: {
            sprite: 'part-pulse-circle-02.img',
            scale: 1.0,
            tint: 0xdf1a20,
            auraScale: 1.0
        },
        spine: {
            enabled: true,
            spineType: 'fx',
            skin: 'default',
            scale: 1.4,
            idle: 'armor_fx/elvish_metal',
            pivot: {
                x: 0.0,
                y: 0.0
            }
        }
    },
    'boon_agoodstart': {
        name: 'A Good Start',
        type: 'boon',
        params: {
            stack: 3,
            chance: 5
        }
    },
    'boon_healerskit': {
        name: 'Healer\'s Kit',
        type: 'boon',
        params: {
            item: 'hppotionlarge',
            total: 1,
            stack: 3
        }
    }
};

module.exports = Boons;
