"use strict";


var GameConfig = require("./gameConfig.js");
var v2 = require("./v2.js");

// @NOTE: Entries defined as single-element arrays, like fixedSpawns: [{ }],
// are done this way so that util.mergeDeep(...) will function as expected
// when used by derivative maps.
//
// Arrays are not mergeable, so the derived map will always redefine all
// elements if that property is set.

var mapDef = {
    mapId: 0,

    desc: {
        name: 'Normal',
        icon: 'img/gui/emote.svg',
        buttonCss: '',
        buttonText: 'index-play-mode-surviv-main'
    },

    assets: {
        audio: [{ name: 'club_music_01', channel: 'ambient' }, { name: 'club_music_02', channel: 'ambient' }, { name: 'ambient_steam_01', channel: 'ambient' }],

        atlases: ['gradient', 'loadout', 'shared', 'main']
    },

    biome: {
        colors: {
            background: 0x020e18,
            water: 0x003571,
            beach: 0x684836,
            riverbank: 0x443d3a,
            grass: 0x4d5a68,
            underground: 0x1b0d03,
            playerSubmerge: 0x123049,
            playerGhillie: 0x4b5866
        },

        // Global tint adjustment applied to all objects
        valueAdjust: 1.0,

        sound: {
            riverShore: 'sand'
        },

        particles: {
            camera: ''
        },

        tracerColors: {},

        airdrop: {
            planeImg: 'map-plane-01.img',
            planeSound: 'plane_01',
            airdropImg: 'map-chute-01.img'
        }
    },

    // @TODO: This should be hidden from the client. All relevant data should be
    // sent in the JoinedMsg or MapMsg instead.
    gameMode: {
        maxPlayers: 80,
        killLeaderEnabled: true
    }

};

module.exports = mapDef;
