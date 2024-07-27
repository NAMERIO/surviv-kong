"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./potatoDefs.js");

var mapDef = {
    assets: {
        audio: [{ name: 'pumpkin_break_01', channel: 'sfx' }, { name: 'potato_01', channel: 'sfx' }, { name: 'potato_02', channel: 'sfx' }, { name: 'potato_pickup_01', channel: 'ui' }],

        atlases: ['gradient', 'loadout', 'shared', 'potato']
    },

    biome: {
        colors: {
            background: 0x20536E,
            water: 0x3282ab,
            waterRipple: 0xb3f0ff,
            beach: 0xf4ae48,
            riverbank: 0x8a8a8a,
            grass: 0x5c910a,
            underground: 0x1b0d03,
            playerSubmerge: 0x2b8ca4
        },

        particles: {
            camera: 'falling_leaf_potato'
        }
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
