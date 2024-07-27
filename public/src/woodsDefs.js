"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {
    mapId: 2,

    desc: {
        name: 'Woods',
        icon: 'img/gui/player-king-woods.svg',
        buttonCss: 'btn-mode-woods',
        buttonText: 'index-play-mode-woods'
    },

    assets: {
        audio: [{ name: 'vault_change_02', channel: 'sfx' },
        // { name: 'footstep_08', channel: 'sfx' },
        // { name: 'footstep_09', channel: 'sfx' },
        // TODO: Figure out a better long term solution for eye bunker
        { name: 'log_01', channel: 'sfx' }, { name: 'log_02', channel: 'sfx' }, { name: 'helmet03_forest_pickup_01', channel: 'ui' }, { name: 'ability_stim_01', channel: 'sfx' }, { name: 'leader_dead_01', channel: 'ui' }],

        atlases: ['gradient', 'loadout', 'shared', 'woods']
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0x3282ab,
            waterRipple: 0xb3f0ff,
            beach: 0xefb35b,
            riverbank: 0x77360b,
            grass: 0x8e832a,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4
        },

        particles: {
            camera: 'falling_leaf'
        }
    },

    gameMode: {
        maxPlayers: 80,
        woodsMode: true
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
