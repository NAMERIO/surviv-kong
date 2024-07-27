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
    mapId: 13,

    desc: {
        name: 'May 4th',
        icon: 'img/gui/lasr-swrds-icn.svg',
        buttonCss: 'btn-mode-may-fourth',
        buttonText: 'index-play-mode-lasr-swrds'
    },

    assets: {
        audio: [{ name: 'club_music_01', channel: 'ambient' }, { name: 'club_music_02', channel: 'ambient' }, { name: 'ambient_steam_01', channel: 'ambient' }],

        atlases: ['gradient', 'loadout', 'shared', 'main', 'space']
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0xA1A7CB,
            waterRipple: 0xC0C5DD,
            beach: 0x74829B,
            riverbank: 0x414C6A,
            grass: 0x58657E,
            underground: 0x1b0d03,
            playerSubmerge: 0xC0C5DD,
            playerGhillie: 0x58657E
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
        killLeaderEnabled: true,
        mayMode: true
    }

};

module.exports = mapDef;
