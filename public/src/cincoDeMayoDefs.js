"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    mapId: 1,

    desc: {
        name: 'Cinco de Mayo',
        icon: 'img/loot/pinata_icon.svg',
        buttonCss: 'btn-mode-easter'
    },

    assets: {
        audio: [{ name: 'piano_02', channel: 'sfx' }, { name: 'log_03', channel: 'sfx' }, { name: 'log_04', channel: 'sfx' }, { name: 'piano_music_01', channel: 'ambient' }],

        atlases: ['gradient', 'loadout', 'shared', 'desert', 'cinco_de_mayo']
    },

    biome: {
        colors: {
            background: 0x6a7543,
            water: 0x8a9b4e,
            waterRipple: 0xd1e685,
            beach: 0xc9843a,
            riverbank: 0xb25e24,
            grass: 0xdfa757,
            underground: 0x3d0d03,
            playerSubmerge: 0x4e9b8f,
            playerGhillie: 0xdfa761
        },

        particles: {}
    },

    gameMode: {
        maxPlayers: 80,
        cincoMode: true
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
