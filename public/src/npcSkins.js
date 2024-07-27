"use strict";


var _skins;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EnumNpcs = require("./enumNPCs.js");

var skins = (_skins = {}, _defineProperty(_skins, 'monster_' + EnumNpcs.esSkeleto, {
    0: ['sword_armor_01', '', '', '', ''],
    1: ['sword_armor_02', '', '', '', ''],
    2: ['sword_armor_03', '', '', '', '']
}), _defineProperty(_skins, 'monster_' + EnumNpcs.orc, {
    0: ['orc_axe_armor_01', '', '', '', ''],
    1: ['orc_axe_armor_02', '', '', '', ''],
    2: ['orc_axe_armor_03', '', '', '', '']
}), _defineProperty(_skins, 'monster_' + EnumNpcs.ghost_elf, {
    0: ['ghost_elf_armor_01', '', '', '', ''],
    1: ['ghost_elf_armor_02', '', '', '', ''],
    2: ['ghost_elf_armor_03', '', '', '', '']
}), _skins);

module.exports = skins;
