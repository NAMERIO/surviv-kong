"use strict";


var SpriteAnimDefs = {

    'fusion_motherShip': {
        sprites: ['map-spaceship-fusion-01.img', 'map-spaceship-fusion-02.img', 'map-spaceship-fusion-03.img', 'map-spaceship-fusion-04.img'],
        loop: true,
        speed: 7,
        play: true
    },

    'base_motherShip': {
        sprites: ['map-spaceship-01.img'],
        loop: false,
        speed: 10,
        play: false
    },

    'load_motherShip': {
        sprites: ['map-loading-blast-01.img', 'map-loading-blast-02.img', 'map-loading-blast-03.img', 'map-loading-blast-04.img', 'map-loading-blast-05.img', 'map-loading-blast-06.img', 'map-loading-blast-07.img', 'map-loading-blast-08.img', 'map-loading-blast-09.img', 'map-loading-blast-10.img', 'map-loading-blast-11.img'],
        loop: false,
        speed: 30,
        play: true
    },

    'skitter_base': {
        sprites: ['skitter-walking-1.img', 'skitter-walking-2.img', 'skitter-walking-3.img', 'skitter-walking-4.img'],
        loop: true,
        speed: 30,
        play: true
    },

    'empty_sprite': {
        sprites: [],
        loop: false,
        speed: 0,
        play: false
    }
};

module.exports = SpriteAnimDefs;
