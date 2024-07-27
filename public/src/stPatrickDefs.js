"use strict";


var GameConfig = require("./gameConfig.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var baseDef = require("./baseDef.js");

var mapDef = {

    mapId: 10,

    desc: {
        name: 'Saint Patrick',
        icon: 'img/loot/loot_st_patrick_button_icon.svg',
        buttonCss: 'btn-mode-stPatrick'
    },

    assets: {
        audio: [],

        atlases: ['gradient', 'loadout', 'shared', 'main', 'st_patrick']
    },

    biome: {

        colors: {
            background: 0x093639,
            water: 0x7FCCA2,
            waterRipple: 0x7FDBB7,
            riverbank: 0x75AD2D,
            grass: 0x2F5737,
            playerSubmerge: 0x7FDBB7,
            beach: 0x49C163
        },

        sound: {
            riverShore: 'stone'
        },

        particles: {}
    },

    gameMode: {
        damageReduction: 70,
        saintPatrickMode: true
    }

};

module.exports = util.mergeDeep({}, baseDef, mapDef);
