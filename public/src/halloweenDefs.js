"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    mapId: 6,

    desc: {
        name: 'Halloween',
        icon: 'img/gui/pumpkin-play.svg',
        buttonCss: 'btn-mode-halloween'
    },

    assets: {
        audio: [{ name: 'log_01', channel: 'sfx' }, { name: 'log_02', channel: 'sfx' }, { name: 'pumpkin_break_01', channel: 'sfx' }, { name: 'vault_change_02', channel: 'sfx' }, { name: 'kill_leader_assigned_01', channel: 'ui' }, { name: 'kill_leader_assigned_02', channel: 'ui' }, { name: 'kill_leader_dead_01', channel: 'ui' }, { name: 'kill_leader_dead_02', channel: 'ui' }, { name: 'trick_01', channel: 'ui' }, { name: 'trick_02', channel: 'ui' }, { name: 'trick_03', channel: 'ui' }, { name: 'treat_01', channel: 'ui' }, { name: 'xp_pickup_01', channel: 'ui' }, { name: 'xp_pickup_02', channel: 'ui' }, { name: 'xp_drop_01', channel: 'sfx' }, { name: 'xp_drop_02', channel: 'sfx' }],

        atlases: ['gradient', 'loadout', 'shared', 'halloween']
    },

    biome: {
        colors: {
            background: 0x170000,
            water: 0x280000,
            waterRipple: 0x100101,
            beach: 0x64410e,
            riverbank: 0x3c1b05,
            grass: 0x212404,
            underground: 0x120801,
            playerSubmerge: 0x140000
        },
        particles: {
            camera: 'falling_leaf_halloween'
        },
        valueAdjust: 0.3
    },

    gameMode: {
        maxPlayers: 80,
        killLeaderEnabled: true,
        spookyKillSounds: true
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
