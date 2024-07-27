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
    mapId: 17,

    desc: {
        name: 'Contact',
        icon: 'img/loot/loot-contact.svg',
        buttonCss: 'btn-mode-contact',
        buttonText: 'index-play-mode-contact'
    },

    assets: {
        audio: [{ name: 'club_music_01', channel: 'ambient' }, { name: 'club_music_02', channel: 'ambient' }, { name: 'ambient_steam_01', channel: 'ambient' }],

        atlases: ['gradient', 'loadout', 'shared', 'main', 'contact']
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0x7F5FFF,
            waterRipple: 0xb3f0ff,
            beach: 0x6774A1,
            riverbank: 0x4D5B8B,
            grass: 0x2D385D,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4,
            playerGhillie: 0x83af50
        },
        //#FFFFFF river walk

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
        contactMode: true
    }

};

module.exports = mapDef;
