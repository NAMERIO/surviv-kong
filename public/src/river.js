"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
// River
//

var River = function () {
    function River(splinePts, riverWidth, looped, otherRivers, mapBounds) {
        _classCallCheck(this, River);

        this.spline = new Spline(splinePts, looped);
        this.waterWidth = riverWidth;
        this.shoreWidth = math.clamp(riverWidth * 0.75, 4.0, 8.0);
        this.looped = looped;

        // Compute center (useful for map generation referencing looped rivers)
        this.center = v2.create(0.0, 0.0);
        for (var i = 0; i < this.spline.points.length; i++) {
            this.center = v2.add(this.center, this.spline.points[i]);
        }
        this.center = v2.div(this.center, this.spline.points.length);

        // Lake island smoothing needs the average point distance to the center island
        var avgDistToCenter = 0.0;
        for (var _i = 0; _i < this.spline.points.length; _i++) {
            var dist = v2.length(v2.sub(this.spline.points[_i], this.center));
            avgDistToCenter += dist;
        }
        avgDistToCenter /= this.spline.points.length;

        var mapExtent = v2.mul(v2.sub(mapBounds.max, mapBounds.min), 0.5);
        var mapCenter = v2.add(mapBounds.min, mapExtent);

        // Generate polygons from the spline
        this.waterPoly = [];
        this.shorePoly = [];
        this.waterWidths = [];
        this.shoreWidths = [];
        for (var _i2 = 0; _i2 < splinePts.length; _i2++) {
            var vert = splinePts[_i2];
            var norm = this.spline.getNormal(_i2 / (splinePts.length - 1));

            // If the endpoints are near the map boundary, adjust the
            // normal to be parallel to the map aabb at that point.
            // This gives the river polygon flat ends flush with the map bounds.
            var nearMapEdge = false;
            if (!this.looped && (_i2 == 0 || _i2 == splinePts.length - 1)) {
                var e = v2.sub(vert, mapCenter);
                var edgePos = v2.create(0.0, 0.0);
                var edgeNorm = v2.create(1.0, 0.0);
                if (Math.abs(e.x) > Math.abs(e.y)) {
                    edgePos = v2.create(e.x > 0.0 ? mapBounds.max.x : mapBounds.min.x, vert.y);
                    edgeNorm = v2.create(e.x > 0.0 ? 1.0 : -1.0, 0.0);
                } else {
                    edgePos = v2.create(vert.x, e.y > 0.0 ? mapBounds.max.y : mapBounds.min.y);
                    edgeNorm = v2.create(0.0, e.y > 0.0 ? 1.0 : -1.0);
                }
                if (v2.lengthSqr(v2.sub(edgePos, vert)) < 1.0) {
                    var perpNorm = v2.perp(edgeNorm);
                    if (v2.dot(norm, perpNorm) < 0.0) {
                        perpNorm = v2.neg(perpNorm);
                    }
                    norm = perpNorm;
                    nearMapEdge = true;
                }
            }

            var waterWidth = this.waterWidth;
            // Widen river near the endpoints
            if (!this.looped) {
                var len = splinePts.length;
                var end = 2.0 * (Math.max(1.0 - _i2 / len, _i2 / len) - 0.5);
                waterWidth = (1.0 + Math.pow(end, 3.0) * 1.5) * this.waterWidth;
            }
            this.waterWidths.push(waterWidth);

            // Increase shoreWidth to match that of larger nearby rivers.
            // Also determine if we terminate within another river. If so,
            // we need to constain our ending water and shore points to be
            // within that rivers polygons.
            //
            // There's a bug with clipRayToPoly when this happens at the
            // map edges; avoid that with a explicit check for now.
            var shoreWidth = this.shoreWidth;
            var boundingRiver = null;
            for (var j = 0; j < otherRivers.length; j++) {
                var river = otherRivers[j];
                var t = river.spline.getClosestTtoPoint(vert);
                var p = river.spline.getPos(t);
                var _len = v2.length(v2.sub(p, vert));
                if (_len < river.waterWidth * 2.0) {
                    shoreWidth = math.max(shoreWidth, river.shoreWidth);
                }
                if ((_i2 == 0 || _i2 == splinePts.length - 1) && _len < 1.5 && !nearMapEdge) {
                    boundingRiver = river;
                }
            }
            if (_i2 > 0) {
                shoreWidth = (this.shoreWidths[_i2 - 1] + shoreWidth) / 2.0;
            }
            this.shoreWidths.push(shoreWidth);
            shoreWidth += waterWidth;

            // Poly verts
            var clipRayToPoly = function clipRayToPoly(pt, dir, poly) {
                var end = v2.add(pt, dir);
                if (!math.pointInsidePolygon(end, poly)) {
                    var _t = math.rayPolygonIntersect(pt, dir, poly);
                    if (_t) {
                        return v2.mul(dir, _t);
                    }
                }
                return dir;
            };

            var waterPtA = void 0,
                waterPtB = void 0,
                shorePtA = void 0,
                shorePtB = void 0;

            if (this.looped) {
                var toVert = v2.sub(vert, this.center);
                var _dist = v2.length(toVert);
                toVert = _dist > 0.0001 ? v2.div(toVert, _dist) : v2.create(1.0, 0.0);

                var interiorWaterWidth = math.lerp(Math.pow(math.min(waterWidth / avgDistToCenter, 1.0), 0.5), waterWidth, (1.0 - (avgDistToCenter - waterWidth) / _dist) * _dist);
                var interiorShoreWidth = math.lerp(Math.pow(math.min(shoreWidth / avgDistToCenter, 1.0), 0.5), shoreWidth, (1.0 - (avgDistToCenter - shoreWidth) / _dist) * _dist);

                waterPtA = v2.add(vert, v2.mul(toVert, waterWidth));
                waterPtB = v2.add(vert, v2.mul(toVert, -interiorWaterWidth));
                shorePtA = v2.add(vert, v2.mul(toVert, shoreWidth));
                shorePtB = v2.add(vert, v2.mul(toVert, -interiorShoreWidth));
            } else {
                var waterRayA = v2.mul(norm, waterWidth);
                var waterRayB = v2.mul(norm, -waterWidth);
                var shoreRayA = v2.mul(norm, shoreWidth);
                var shoreRayB = v2.mul(norm, -shoreWidth);

                if (boundingRiver) {
                    waterRayA = clipRayToPoly(vert, waterRayA, boundingRiver.waterPoly);
                    waterRayB = clipRayToPoly(vert, waterRayB, boundingRiver.waterPoly);
                    shoreRayA = clipRayToPoly(vert, shoreRayA, boundingRiver.shorePoly);
                    shoreRayB = clipRayToPoly(vert, shoreRayB, boundingRiver.shorePoly);
                }

                waterPtA = v2.add(vert, waterRayA);
                waterPtB = v2.add(vert, waterRayB);
                shorePtA = v2.add(vert, shoreRayA);
                shorePtB = v2.add(vert, shoreRayB);
            }

            waterPtA = coldet.clampPosToAabb(waterPtA, mapBounds);
            waterPtB = coldet.clampPosToAabb(waterPtB, mapBounds);
            shorePtA = coldet.clampPosToAabb(shorePtA, mapBounds);
            shorePtB = coldet.clampPosToAabb(shorePtB, mapBounds);

            this.waterPoly.splice(_i2, 0, waterPtA);
            this.waterPoly.splice(this.waterPoly.length - _i2, 0, waterPtB);
            this.shorePoly.splice(_i2, 0, shorePtA);
            this.shorePoly.splice(this.shorePoly.length - _i2, 0, shorePtB);
        }

        // Compute aabb
        var aabbMin = v2.create(Number.MAX_VALUE, Number.MAX_VALUE);
        var aabbMax = v2.create(-Number.MAX_VALUE, -Number.MAX_VALUE);
        for (var _i3 = 0; _i3 < this.shorePoly.length; _i3++) {
            aabbMin = v2.minElems(aabbMin, this.shorePoly[_i3]);
            aabbMax = v2.maxElems(aabbMax, this.shorePoly[_i3]);
        }
        this.aabb = collider.createAabb(aabbMin, aabbMax, 0.0);
    }

    _createClass(River, [{
        key: 'distanceToShore',
        value: function distanceToShore(pos) {
            var t = this.spline.getClosestTtoPoint(pos);
            var dist = v2.length(v2.sub(pos, this.spline.getPos(t)));
            return math.max(this.waterWidth - dist, 0.0);
        }
    }, {
        key: 'getWaterWidth',
        value: function getWaterWidth(t) {
            var count = this.spline.points.length;
            var idx = math.clamp(Math.floor(t * count), 0, count);
            return this.waterWidths[idx];
        }
    }]);

    return River;
}();

module.exports = River;
