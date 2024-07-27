"use strict";


var _ProjectileBehaviours;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * bullet-behaviour-defaults.js
 * This file has the default attributes for the projectile behaviours
 * Change attribute here ONLY if you want to change the defaults
 * For a specific attack tweaking please modify in the bullet definition or main-hand-weaps.js 
 */

var BehaviourEnum = require("./behaviourEnum.js");

var ProjectileBehaviours = (_ProjectileBehaviours = {}, _defineProperty(_ProjectileBehaviours, BehaviourEnum.SinusoidalBehaviour, {
    id: BehaviourEnum.SinusoidalBehaviour,
    name: 'Sinusoidal',
    amplitude: 20.0, //This modifies how long the sinusoidal arc is
    frecuency: 1.0 //Less value means more frecuency
}), _defineProperty(_ProjectileBehaviours, BehaviourEnum.SpreadShotBehaviour, {
    id: BehaviourEnum.SpreadShotBehaviour,
    name: 'Spread shot',
    angle: 360
    //Uses the 'numBullets' attribute in main-hand-weaps.js 
    //to distribute the projectiles evenly around the projectile spawn point
    //Based on an area defined by the angle attribute default is set to 360
}), _defineProperty(_ProjectileBehaviours, BehaviourEnum.RectangularHitboxSized, {
    id: BehaviourEnum.RectangularHitboxSized,
    name: 'Rectangular hitbox sized',
    rectangularHitbox: true,
    width: 1.0
    /*hitBox: {//TODO
        x: 1.0,
        y: 1.0
    }*/
}), _defineProperty(_ProjectileBehaviours, BehaviourEnum.VariableDamage, {
    id: BehaviourEnum.VariableDamage,
    name: 'Variable damage based on hold time'
    //The next attributes need to be added in the main-hand-weaps.js
    //Inside the corresponding attack under the object 'behaviourParams'
    /*
    behaviourParams: {
        minDamage: <Number>,
        maxDamage: <Number>,
        minChargeTime: <Number>,
        maxChargeTime: <Number>,
        //Optional:
        changeZoomWhileCharging: <Boolean>,
        maxZoomRadius: <Number>,
    }
    */
}), _defineProperty(_ProjectileBehaviours, BehaviourEnum.ArcTrajectory, {
    id: BehaviourEnum.ArcTrajectory,
    name: 'Arc trajectory',

    //If the attack shoot more than one bullet it alternate the curve direction
    alternateProjectileCurves: true,

    //Defines the curve size, bigger value means the curve arc will be bigger
    middlePointPull: 10
}), _ProjectileBehaviours);

module.exports = ProjectileBehaviours;
