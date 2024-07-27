"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    assets: {
        audio: [],

        atlases: ['gradient', 'loadout', 'shared', 'main', 'valentine']
    },

    desc: {
        name: 'Awesome Blossoms',
        icon: 'img/loot/loot-blossom-icon.svg',
        buttonCss: 'btn-mode-blossoms'
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0x3282ab,
            waterRipple: 0xb3f0ff,
            beach: 0xf4ae48,
            riverbank: 0x8a8a8a,
            grass: 0x5c910a,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4,
            playerGhillie: 0x41630a
        },

        sound: {
            riverShore: 'stone'
        },

        particles: {
            camera: 'falling_leaf_spring'
        }
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
