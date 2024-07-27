"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gameConfig = require("./gameConfig.js");

module.exports = {
    'skin_femalelilu': {
        id: 'skin_femalelilu',
        type: 'skin',
        gender: 'female',
        male: 'skin_maledaper',
        color: '#ffb56b',
        skins: _defineProperty({}, gameConfig.SkinSlots.BaseSkin, 'skins/hero_skin_01_female')
    },
    'skin_maledaper': {
        id: 'hair_maledaper',
        type: 'skin',
        gender: 'male',
        female: 'skin_femalelilu',
        color: '#ffb56b',
        skins: _defineProperty({}, gameConfig.SkinSlots.BaseSkin, 'skins/hero_skin_01_male')
    },
    'skin_femalelilu_17': {
        id: 'skin_femalelilu_17',
        type: 'skin',
        gender: 'female',
        male: 'skin_maledaper_17',
        color: '#62ff02',
        skins: _defineProperty({}, gameConfig.SkinSlots.BaseSkin, 'skins/hero_skin_17_female')
    },
    'skin_maledaper_17': {
        id: 'skin_maledaper_17',
        type: 'skin',
        gender: 'male',
        female: 'skin_femalelilu_17',
        color: '#62ff02',
        skins: _defineProperty({}, gameConfig.SkinSlots.BaseSkin, 'skins/hero_skin_17_male')
    },
    'skin_femalelilu_19': {
        id: 'skin_femalelilu_19',
        type: 'skin',
        gender: 'female',
        male: 'skin_maledaper_19',
        color: '#04edff',
        skins: _defineProperty({}, gameConfig.SkinSlots.BaseSkin, 'skins/hero_skin_19_female')
    },
    'skin_maledaper_19': {
        id: 'skin_maledaper_19',
        type: 'skin',
        gender: 'male',
        color: '#04edff',
        female: 'skin_femalelilu_19',
        skins: _defineProperty({}, gameConfig.SkinSlots.BaseSkin, 'skins/hero_skin_19_male')
    },
    'hair_femalelilu': {
        id: 'hair_femalelilu',
        id_numeric: 1,
        type: 'hair',
        gender: 'female',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'hair/female/lilu'),
        icon: 'hair-lilu.svg'
    },
    'hair_maledaper': {
        id: 'hair_maledaper',
        id_numeric: 2,
        type: 'hair',
        gender: 'male',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'hair/male/daper'),
        icon: 'hair-daper.svg'
    }
};
