"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    mapId: 4,

    desc: {
        name: 'Potato',
        icon: 'img/loot/loot-throwable-potato.svg',
        buttonCss: 'btn-mode-potato',
        buttonText: 'index-play-mode-potato'
    },

    assets: {
        audio: [{ name: 'pumpkin_break_01', channel: 'sfx' }, { name: 'potato_01', channel: 'sfx' }, { name: 'potato_02', channel: 'sfx' }, { name: 'potato_pickup_01', channel: 'ui' }, { name: 'club_music_01', channel: 'ambient' }, { name: 'club_music_02', channel: 'ambient' }, { name: 'ambient_steam_01', channel: 'ambient' }, { name: 'log_11', channel: 'sfx' }, { name: 'log_12', channel: 'sfx' }],

        atlases: ['gradient', 'loadout', 'shared', 'potato', 'main']
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0x3282ab,
            waterRipple: 0xb3f0ff,
            beach: 0xcdb35b,
            riverbank: 0x905e24,
            grass: 0x80af49,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4
        },

        particles: {
            camera: 'falling_potato'
        },

        frozenSprites: ['player-mash-01.img', 'player-mash-02.img', 'player-mash-03.img']
    },

    gameMode: {
        maxPlayers: 80,
        potatoMode: true
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
