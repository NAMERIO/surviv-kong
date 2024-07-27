"use strict";


var _Traps;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * trap-defs.js
 * Contain the definition for the traps with the necessary parameters
 */

var collider = require("./collider.js");
var TrapsEnum = require("./trapsEnum.js");
var BehaviourEnum = require("./trapsBehaviourEnum.js");

//To see the defaults and more information of the attributes use trap-behaviour-defaults.js
//The attributes defined here will take priority over the defaults

var Traps = (_Traps = {}, _defineProperty(_Traps, TrapsEnum.InmobilizePlayer, {
    id: TrapsEnum.InmobilizePlayer,
    timeToDisappear: 20,
    showOnTopOfObstacles: true,
    hitbox: {
        type: collider.Type.Aabb,
        x: 2.0,
        y: 2.0
    },

    behaviourId: BehaviourEnum.baseTrap,
    behaviourParams: {
        removeEffects: ['m_invisibleEffect'],
        effects: [{
            name: 'm_inmobilizePlayer',
            chance: 1
        }]
    },

    //Visuals
    worldImg: {
        sprite: 'loot-trap-potion.img',
        tint: 0xffffff,
        scale: 1.0
    }
}), _defineProperty(_Traps, TrapsEnum.StaticEnergyRing, {
    id: TrapsEnum.StaticEnergyRing,
    timeToDisappear: 6,
    showOnTopOfObstacles: false,
    hitbox: {
        type: collider.Type.Circle,
        rad: 4.0
    },
    behaviourId: BehaviourEnum.DamageOverTime,
    behaviourParams: {
        damage: 5,
        frecuency: 0.5
    },

    //Visuals
    worldImg: {
        sprite: 'loot-circle-outer-01.img',
        tint: 0xff2f00,
        innerScale: 0.65
    },
    spine: {
        enabled: true,
        spineType: 'fx',
        startAnim: 'weapons/wand/teleport_ring_appear',
        idleAnim: 'weapons/wand/teleport_ring',
        finishAnim: 'weapons/wand/teleport_ring_disappear',
        loop: false,
        scale: 1.5,
        pivot: {
            x: 0.0,
            y: 0.0
        }
    }
}), _defineProperty(_Traps, TrapsEnum.FrostOrb, {
    id: TrapsEnum.FrostOrb,
    timeToDisappear: 10,
    showOnTopOfObstacles: false,
    hitbox: {
        type: collider.Type.Circle,
        rad: 4.0
    },
    behaviourId: BehaviourEnum.DamageOverTime,
    behaviourParams: {
        damage: 0,
        frecuency: 0.5,
        explosionType: 'explosion_spark',

        effects: [{
            name: 'm_chillEffect',
            chance: 1
        }]
    },

    //Visuals
    worldImg: {
        sprite: 'loot-circle-outer-01.img',
        tint: 0xff2f00,
        innerScale: 0.65
    },
    spine: {
        enabled: true,
        spineType: 'fx',
        startAnim: 'weapons/staff/frost_orb_appear',
        idleAnim: 'weapons/staff/frost_orb_idle',
        finishAnim: 'weapons/staff/frost_orb_dissapear',
        explosionAnim: 'weapons/staff/frost_orb_blast',
        loop: false,
        scale: 1.5,
        pivot: {
            x: 0.0,
            y: 0.0
        }
    }
}), _Traps);

module.exports = Traps;
