"use strict";


var _TrapDefaults;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * trap-behaviour-defaults.js
 * This file has the default attributes for the trap behaviours
 * Change attribute here ONLY if you want to change the defaults
 * For a specific tweaking please modify in the bullet definition or trap-defs.js 
 */

var BehaviourEnum = require("./trapsBehaviourEnum.js");

//These default attributes are used only if there are no attributes defined in trap-defs.js

var TrapDefaults = (_TrapDefaults = {}, _defineProperty(_TrapDefaults, BehaviourEnum.baseTrap, {
    //This behaviour expects an array with status effects to apply
    effects: [{
        name: 'm_inmobilizePlayer',
        chance: 1
    }]
}), _defineProperty(_TrapDefaults, BehaviourEnum.DamageOverTime, {
    //This behaviour expects a damage and frecuency that will do to enemies
    //Optionally can apply status effects like the base trap effects
    damage: 10,
    frecuency: 1

    /*effects: [
        {
            name: 'm_inmobilizePlayer',
            chance: 1,
        }
    ]*/
}), _TrapDefaults);

module.exports = TrapDefaults;
