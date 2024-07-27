"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    mapId: 3,

    desc: {
        name: '50v50',
        icon: 'img/gui/star.svg',
        buttonCss: 'btn-mode-faction',
        buttonText: 'index-play-mode-50v50'
    },

    assets: {
        audio: [{ name: 'lt_assigned_01', channel: 'ui' }, { name: 'medic_assigned_01', channel: 'ui' }, { name: 'marksman_assigned_01', channel: 'ui' }, { name: 'recon_assigned_01', channel: 'ui' }, { name: 'grenadier_assigned_01', channel: 'ui' }, { name: 'bugler_assigned_01', channel: 'ui' }, { name: 'last_man_assigned_01', channel: 'ui' }, { name: 'ping_leader_01', channel: 'ui' }, { name: 'bugle_01', channel: 'activePlayer' }, { name: 'bugle_02', channel: 'activePlayer' }, { name: 'bugle_03', channel: 'activePlayer' }, { name: 'bugle_01', channel: 'otherPlayers' }, { name: 'bugle_02', channel: 'otherPlayers' }, { name: 'bugle_03', channel: 'otherPlayers' }],

        atlases: ['gradient', 'loadout', 'shared', 'faction']
    },

    biome: {
        colors: {
            background: 0x051624,
            water: 0x071b36,
            waterRipple: 0xb3f0ff,
            beach: 0x8e5632,
            riverbank: 0x653313,
            grass: 0x4e6128,
            underground: 0x1b0d03,
            playerSubmerge: 0x123049,
            playerGhillie: 0x4c6024
        }
    },

    gameMode: {
        maxPlayers: 100,
        factionMode: true,
        factions: 2
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
