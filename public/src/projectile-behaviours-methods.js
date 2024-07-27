"use strict";


/**
 * projectile-behaviours-methods.js
 * Contains all the special behaviour to apply the projectiles
 */

var v2 = require("./v2.js");
var assert = require("./0e566746.js");
var math = require("./math.js");

var getSinusoidalDirection = function getSinusoidalDirection(dir) {
    //TODO rename and get the direction in 90 degree more precise in diagonals
    var dirX = dir.x >= 0 ? 1 - dir.x : -1 - dir.x;
    var dirY = dir.y >= 0 ? 1 - dir.y : -1 - dir.y;

    //This is to ajust the sinuidal direction on diagonals
    dirX = Math.abs(dirY) <= 0.5 ? -dirX : dirX;
    dirY = Math.abs(dirY) > 0.5 ? -dirY : dirY;

    dirX = Math.abs(dirX) >= 0.40 && Math.abs(dirX) <= 0.60 ? dirX * 2 : dirX;
    dirY = Math.abs(dirY) >= 0.40 && Math.abs(dirY) <= 0.60 ? dirY * 2 : dirY;

    return { x: dirX, y: dirY };
};

var behaviours = {
    /**
     * Calculate the offset to do a sine wave movement, need to be called in each update
     * @param {Object} b Object of the bullet, to get the position, direction and behaviour attributes
     * @param {float} dt Delta time since the last call to update
     * @returns {Object} Vector with x and y of the calculated position
     */
    addSinusoidalMovement: function addSinusoidalMovement(b, dt) {
        var pos = v2.copy(b.pos);

        var sineWavePosition = dt * (b.behaviour.amplitude * Math.sin(b.distanceTraveled * b.behaviour.frecuency));
        var complementDir = getSinusoidalDirection(b.dir);
        if (b.numberOfBullet % 2 != 0) v2.set(pos, v2.add(pos, v2.mul(complementDir, sineWavePosition)));else v2.set(pos, v2.add(pos, v2.mul(complementDir, -sineWavePosition)));

        return pos;
    },


    /**
     * Caculate the direction of the projectile
     * @param {Object} dir Direction of the player cursor, vector with x and y
     * @param {Number} numberOfBullet Number of the actual bullet to calculate angle
     * @param {Number} totalBullets Total bullets that will shoot in the current attack
     * @returns {Object} Will return vector with x and y, with the new direction
     */
    addCicularSpread: function addCicularSpread(dir, numberOfBullet) {
        var totalBullets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
        var degrees = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 360;

        assert(typeof totalBullets == 'number', '"numBullets" in attack def need to be a number for the circular spread behaviour to work');
        if (totalBullets == 1) return dir;

        var angle = degrees / (totalBullets - 1); //Get area of attack angle

        //Center area of attack with the desired direction
        var halfAngle = degrees / 2;
        //halfAngle *= (Math.PI / 180);//Convert to radians
        var angleRadians = math.rad2degFromDirection(dir.y, dir.x);
        angleRadians -= halfAngle;

        //Get current bullet exact direction inside area
        var currentBulletAngleDirection = numberOfBullet * angle;

        var result = angleRadians + currentBulletAngleDirection;

        return math.deg2vec2(result);
    },


    /**
     * Create a curve in the movement of the projectile with the bezier formula
     * @param {Object} b Object of the bullet, to get moveT (normalized distance traveled between 0 - 1),
     *                   startPos, endPos and bezierCurveMiddlePoint
     * @returns {Vector2} New position of the bullet
     */
    addArcMovement: function addArcMovement(b) {
        //Caculate new position using the bezier curve formula
        var t = b.moveT;
        var tm = 1 - b.moveT;
        var tt = b.moveT * b.moveT;

        var secondPointMul = 2 * tm * t;
        var newPos = v2.add(v2.mul(b.startPos, Math.pow(tm, 2)), v2.mul(b.bezierCurveMiddlePoint, secondPointMul));
        newPos = v2.add(newPos, v2.mul(b.endPos, tt));

        return newPos;
    },


    /**
     * Calculate the middle point for the bezier curve (used in addArcMovement function)
     * @param {Object} b Object of the bullet, to get the startPos, endPos and behaviour.middlePointPull
     * @returns {Vector2} Middle point for bezier curve formula (addArcMovement function)
     */
    getMiddlePointForBezierCurve: function getMiddlePointForBezierCurve(b) {
        var curveHeightWithDir = void 0;
        if (b.numberOfBullet % 2 != 0 && b.behaviour.alternateProjectileCurves) curveHeightWithDir = v2.mul(getSinusoidalDirection(b.dir), b.behaviour.middlePointPull);else curveHeightWithDir = v2.mul(getSinusoidalDirection(b.dir), -b.behaviour.middlePointPull);

        var middlePoint = v2.div(v2.add(b.startPos, b.endPos), 2);

        var bezierCurveMiddlePoint = v2.add(middlePoint, curveHeightWithDir);

        return bezierCurveMiddlePoint;
    }
};

module.exports = behaviours;
