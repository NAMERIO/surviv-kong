"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {

    mapId: 9,

    desc: {
        name: 'Valentine',
        icon: 'img/loot/loot-medical-chocolateBox.svg',
        buttonCss: 'btn-mode-valentine'
    },

    assets: {
        audio: [],

        atlases: ['gradient', 'loadout', 'shared', 'main', 'valentine']
    },

    biome: {
        sound: {
            riverShore: 'stone'
        },

        particles: {
            camera: 'falling_leaf_spring'
        }
    },

    gameMode: {
        damageReduction: 70,
        valentineMode: true
    },

    gameConfig: {
        planes: {
            timings: [{ circleIdx: 1, wait: 10.0, options: { type: GameConfig.Plane.Airdrop } }, { circleIdx: 3, wait: 2.0, options: { type: GameConfig.Plane.Airdrop } }],
            crates: [{ type: 'airdrop_crate_02', weight: 1.0 }]
        }
    },

    lootTable: {
        'tier_medical': [{ type: 'bandage', count: 5, weight: 16.0 }, { type: 'healthkit', count: 1, weight: 5.0 }, { type: 'chocolateBox', count: 1, weight: 15.0 }, { type: 'painkiller', count: 1, weight: 6.0 }],
        'tier_vending_soda': [{ type: 'chocolateBox', count: 1, weight: 2 }, { type: 'tier_ammo', count: 1, weight: 1 }],
        'tier_airdrop_rare': [{ type: 'heart_cannon', count: 1, weight: 1.0 }],
        'tier_throwables': [{ type: 'frag', count: 2, weight: 1.0 }, { type: 'smoke', count: 1, weight: 1.0 }, { type: 'mirv', count: 2, weight: 0.05 }, { type: 'heart_frag', count: 2, weight: 1.5 }],
        'tier_perks': [{ type: 'firepower', count: 1, weight: 1.0 }, { type: 'windwalk', count: 1, weight: 0.25 }, { type: 'endless_ammo', count: 1, weight: 1.0 }, { type: 'steelskin', count: 1, weight: 0.5 }, { type: 'splinter', count: 1, weight: 0.25 }, { type: 'small_arms', count: 1, weight: 0.25 }, { type: 'takedown', count: 1, weight: 1.0 }, { type: 'field_medic', count: 1, weight: 0.5 }, { type: 'tree_climbing', count: 1, weight: 1.0 }, { type: 'scavenger', count: 1, weight: 1.0 }, { type: 'chambered', count: 1, weight: 0.5 }, { type: 'martyrdom', count: 1, weight: 0.1 }, { type: 'self_revive', count: 1, weight: 0.5 }, { type: 'bonus_9mm', count: 1, weight: 0.5 }, { type: 'explosive_rounds', count: 1, weight: 0.25 }, { type: 'cupid', count: 1, weight: 1.0 }]
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
