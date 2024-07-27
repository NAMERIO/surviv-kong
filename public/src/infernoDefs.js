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
    mapId: 18,

    desc: {
        name: 'Inferno',
        icon: 'img/gui/inferno.svg',
        buttonCss: 'btn-mode-inferno',
        buttonText: 'index-play-mode-inferno'
    },

    assets: {
        audio: [{ name: 'club_music_01', channel: 'ambient' }, { name: 'club_music_02', channel: 'ambient' }, { name: 'ambient_steam_01', channel: 'ambient' }, { name: 'potato_01', channel: 'sfx' }, { name: 'potato_02', channel: 'sfx' }],

        atlases: ['gradient', 'loadout', 'shared', 'main', 'inferno']
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0xFE8438,
            waterRipple: 0xFE8438,
            beach: 0x534D45,
            riverbank: 0x252525,
            grass: 0x3C3C3C,
            underground: 0x1b0d03,
            playerSubmerge: 0xFFFFFF,
            playerGhillie: 0x83af50
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
        infernoMode: true
    }

};

module.exports = mapDef;
