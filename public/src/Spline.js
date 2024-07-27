"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require("./0e566746.js");
var math = require("./math.js");
var v2 = require("./v2.js");

function getControlPoints(t, points, looped) {
    var count = points.length;
    var i = void 0,
        i0 = void 0,
        i1 = void 0,
        i2 = void 0,
        i3 = void 0;
    if (looped) {
        // Assume that with looped rails, points 0 and count are the same
        t = math.fmod(t, 1.0);
        i = ~~(t * (count - 1));
        i1 = i;
        i2 = (i1 + 1) % (count - 1);
        i0 = i1 > 0 ? i1 - 1 : count - 2;
        i3 = (i2 + 1) % (count - 1);
    } else {
        t = math.clamp(t, 0.0, 1.0);
        i = ~~(t * (count - 1));
        i1 = i == count - 1 ? i - 1 : i;
        i2 = i1 + 1;
        i0 = i1 > 0 ? i1 - 1 : i1;
        i3 = i2 < count - 1 ? i2 + 1 : i2;
    }
    return {
        pt: t * (count - 1) - i1,
        p0: points[i0],
        p1: points[i1],
        p2: points[i2],
        p3: points[i3]
    };
}

// Taken from https://www.mvps.org/directx/articles/catmull/
function catmullRom(t, p0, p1, p2, p3) {
    return 0.5 * (2.0 * p1 + t * (-p0 + p2) + t * t * (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) + t * t * t * (-p0 + 3.0 * p1 - 3.0 * p2 + p3));
}

function catmullRomDerivative(t, p0, p1, p2, p3) {
    return 0.5 * (-p0 + p2 + 2.0 * t * (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) + 3.0 * t * t * (-p0 + 3.0 * p1 - 3.0 * p2 + p3));
}

//
// Spline
//

var Spline = function () {
    function Spline(points, looped) {
        _classCallCheck(this, Spline);

        assert(points.length > 1);

        // @TODO: Add support for arbitrary float data
        this.points = [];
        this.arcLens = [];
        this.totalArcLen = 0.0;
        this.looped = looped;

        for (var i = 0; i < points.length; i++) {
            this.points.push(v2.copy(points[i]));
        }

        var arcLenSamples = points.length * 4;
        var cur = this.points[0];
        for (var _i = 0; _i <= arcLenSamples; _i++) {
            var t = _i / arcLenSamples;
            var next = this.getPos(t);
            var arcLenPrev = _i == 0 ? 0.0 : this.arcLens[_i - 1];
            this.arcLens[_i] = arcLenPrev + v2.length(v2.sub(next, cur));
            cur = v2.copy(next);
        }
        this.totalArcLen = this.arcLens[this.arcLens.length - 1];
    }

    _createClass(Spline, [{
        key: 'getPos',
        value: function getPos(t) {
            var _getControlPoints = getControlPoints(t, this.points, this.looped),
                pt = _getControlPoints.pt,
                p0 = _getControlPoints.p0,
                p1 = _getControlPoints.p1,
                p2 = _getControlPoints.p2,
                p3 = _getControlPoints.p3;

            return v2.create(catmullRom(pt, p0.x, p1.x, p2.x, p3.x), catmullRom(pt, p0.y, p1.y, p2.y, p3.y));
        }
    }, {
        key: 'getTangent',
        value: function getTangent(t) {
            var _getControlPoints2 = getControlPoints(t, this.points, this.looped),
                pt = _getControlPoints2.pt,
                p0 = _getControlPoints2.p0,
                p1 = _getControlPoints2.p1,
                p2 = _getControlPoints2.p2,
                p3 = _getControlPoints2.p3;

            return v2.create(catmullRomDerivative(pt, p0.x, p1.x, p2.x, p3.x), catmullRomDerivative(pt, p0.y, p1.y, p2.y, p3.y));
        }
    }, {
        key: 'getNormal',
        value: function getNormal(t) {
            var tangent = this.getTangent(t);
            return v2.perp(v2.normalizeSafe(tangent, v2.create(1.0, 0.0)));
        }
    }, {
        key: 'getClosestTtoPoint',
        value: function getClosestTtoPoint(pos) {
            // Find closest segment to pos
            var closestDistSq = Number.MAX_VALUE;
            var closestSegIdx = 0;
            for (var i = 0; i < this.points.length - 1; i++) {
                var distSq = math.distToSegmentSq(pos, this.points[i], this.points[i + 1]);
                if (distSq < closestDistSq) {
                    closestDistSq = distSq;
                    closestSegIdx = i;
                }
            }
            var idx0 = closestSegIdx;
            var idx1 = idx0 + 1;
            var s0 = this.points[idx0];
            var s1 = this.points[idx1];
            var seg = v2.sub(s1, s0);
            var t = math.clamp(v2.dot(v2.sub(pos, s0), seg) / v2.dot(seg, seg), 0.0, 1.0);
            var len = this.points.length - 1;
            var tMin = math.clamp((idx0 + t - 0.1) / len, 0.0, 1.0);
            var tMax = math.clamp((idx0 + t + 0.1) / len, 0.0, 1.0);

            // Refine closest point by testing near the closest segment point
            var nearestT = (idx0 + t) / len;
            var nearestDistSq = Number.MAX_VALUE;
            var kIter = 8;
            for (var _i2 = 0; _i2 <= kIter; _i2++) {
                var testT = math.lerp(_i2 / kIter, tMin, tMax);
                var testPos = this.getPos(testT);
                var testDistSq = v2.lengthSqr(v2.sub(testPos, pos));
                if (testDistSq < nearestDistSq) {
                    nearestT = testT;
                    nearestDistSq = testDistSq;
                }
            }

            // Refine by offsetting along the spline tangent
            var tangent = this.getTangent(nearestT);
            var tanLen = v2.length(tangent);
            if (tanLen > 0.0) {
                var nearest = this.getPos(nearestT);
                var offset = v2.dot(tangent, v2.sub(pos, nearest)) / tanLen;
                var offsetT = nearestT + offset / (tanLen * len);
                if (v2.lengthSqr(v2.sub(pos, this.getPos(offsetT))) < v2.lengthSqr(v2.sub(pos, nearest))) {
                    nearestT = offsetT;
                }
            }

            return nearestT;
        }
    }, {
        key: 'getTfromArcLen',
        value: function getTfromArcLen(arcLen) {
            arcLen = math.clamp(arcLen, 0.0, this.totalArcLen);

            var idx = 0;
            while (arcLen > this.arcLens[idx]) {
                idx++;
            }

            if (idx == 0) {
                return 0.0;
            } else {
                var arcT = math.delerp(arcLen, this.arcLens[idx - 1], this.arcLens[idx]);
                var arcCount = this.arcLens.length - 1;
                var t0 = (idx - 1) / arcCount;
                var t1 = idx / arcCount;
                return math.lerp(arcT, t0, t1);
            }
        }
    }, {
        key: 'getArcLen',
        value: function getArcLen(t) {
            t = math.clamp(t, 0.0, 1.0);
            var arcCount = this.arcLens.length - 1;
            var idx0 = Math.floor(t * arcCount);
            var idx1 = idx0 < arcCount - 1 ? idx0 + 1 : idx0;
            var arcT = math.fmod(t, 1.0 / arcCount) / (1.0 / arcCount);
            return math.lerp(arcT, this.arcLens[idx0], this.arcLens[idx1]);
        }
    }]);

    return Spline;
}();

module.exports = Spline;
