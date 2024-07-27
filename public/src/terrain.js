"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameConfig = require("./gameConfig.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var math = require("./math.js");
var Spline = require("./Spline.js");
var v2 = require("./v2.js");

//
// Helpers
//


//
// Terrain
//

var Terrain = function Terrain(isPolygon, type, patch, terrainTemp) {
    _classCallCheck(this, Terrain);

    this.type = type;
    this.color = patch.color || 0x00FFFFFF;
    this.obstacles = patch.obstacles || [];
    this.textureType = terrainTemp.textureType;
    this.density = patch.density || terrainTemp.density;

    if (!isPolygon) {
        var pos = { x: patch.x, y: patch.y };
        var colliderTemp = collider.createAabbExtents(v2.create(0, 0), v2.create(patch.width / 2, patch.height / 2));
        this.aabb = collider.transform(colliderTemp, pos, 0, 1.0);
    } else {
        this.points = [];

        if (patch.points) {
            patch.points = patch.points.replace(/\s*,\s*/g, ",").trim();
            var patchPoints = patch.points.split(',');
            var len = patchPoints.length;
            var offsetY = patch.offsetY || 0;
            var offsetX = patch.offsetX || 0;

            for (var i = 0; i < len; i++) {
                var patchSubPoints = patchPoints[i].split(' ');

                var xTemp = +patchSubPoints[0] + offsetX;
                var yTemp = +patchSubPoints[1] + offsetY;

                this.points.push(v2.create(xTemp, yTemp));
            }
        }

        var minY = this.points[0].y;
        var maxY = this.points[0].y;

        var minX = this.points[0].x;
        var maxX = this.points[0].x;

        for (var _i = 1, _len = this.points.length; _i < _len; _i++) {
            var _yTemp = this.points[_i].y;
            var _xTemp = this.points[_i].x;

            minY = _yTemp < minY ? _yTemp : minY;
            maxY = _yTemp > maxY ? _yTemp : maxY;

            minX = _xTemp < minX ? _xTemp : minX;
            maxX = _xTemp > maxX ? _xTemp : maxX;
        }

        this.polygonBox = {
            min: v2.create(minX, minY),
            max: v2.create(maxX, maxY)
        };
    }
};

module.exports = Terrain;
