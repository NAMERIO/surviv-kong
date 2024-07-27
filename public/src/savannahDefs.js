"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    mapId: 5,

    desc: {
        name: 'Savannah',
        icon: 'img/gui/player-the-hunted.svg',
        buttonCss: 'btn-mode-savannah',
        buttonText: 'index-play-mode-savannah'
    },

    assets: {
        audio: [],

        atlases: ['gradient', 'loadout', 'shared', 'savannah']
    },

    biome: {
        colors: {
            background: 0x1c5b5f,
            water: 0x41a4aa,
            waterRipple: 0x96f0f6,
            beach: 0xcb7132,
            riverbank: 0xb25e24,
            grass: 0xb4b02e,
            underground: 0x3d0d03,
            playerSubmerge: 0x4e9b8f,
            playerGhillie: 0xb0ac2b
        },

        particles: {}
    },

    gameMode: {
        maxPlayers: 80,
        sniperMode: true
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
