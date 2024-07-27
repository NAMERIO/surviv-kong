"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./woodsBaseDef.js");

var mapDef = {
    assets: {
        audio: [{ name: 'vault_change_02', channel: 'sfx' }, { name: 'footstep_08', channel: 'sfx' }, { name: 'footstep_09', channel: 'sfx' }, { name: 'helmet03_forest_pickup_01', channel: 'ui' }, { name: 'ability_stim_01', channel: 'sfx' }, { name: 'leader_dead_01', channel: 'ui' }, { name: 'snowball_01', channel: 'sfx' }, { name: 'snowball_02', channel: 'sfx' }, { name: 'snowball_pickup_01', channel: 'ui' }],

        atlases: ['gradient', 'loadout', 'shared', 'woods',
        // @TODO: Remove unnecessary assets from the snow atlas
        'snow']
    },

    biome: {
        colors: {
            background: 0x093639,
            water: 0x0c4d51,
            waterRipple: 0xb3f0ff,
            beach: 0xcdb35b,
            riverbank: 0x905e24,
            grass: 0xbdbdbd,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4
        },

        particles: {
            camera: 'falling_snow_slow'
        },

        tracerColors: {
            '762mm': {
                regular: 0x96a1e6,
                saturated: 0xabc4ff,
                alphaRate: 0.96,
                alphaMin: 0.4
            }
        }
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
