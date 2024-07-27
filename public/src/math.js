"use strict";


var assert = require("./0e566746.js");
var earcut = require("./earcut.js");
var v2 = require("./v2.js");

var kEpsilon = 0.000001;

var math = {
    clamp: function clamp(a, min, max) {
        // In Chrome 63 and Node 8.9, Math.min/max are significantly slower
        // than ternary (presumably since Math.min/max support infinite args)
        return a < max ? a > min ? a : min : max;
    },

    v2Clamp: function v2Clamp(vector, minV2, maxV2) {
        var minX = void 0,
            minY = void 0,
            maxX = void 0,
            maxY = void 0;
        var resX = void 0,
            resY = void 0;

        if (minV2.x > maxV2.x) {
            minX = maxV2.x;
            maxX = minV2.x;
        } else {
            minX = minV2.x;
            maxX = maxV2.x;
        }

        if (minV2.y > maxV2.y) {
            minY = maxV2.y;
            maxY = minV2.y;
        } else {
            minY = minV2.y;
            maxY = maxV2.y;
        }

        resX = vector.x < maxX ? vector.x > minX ? vector.x : minX : maxX;
        resY = vector.y < maxY ? vector.y > minY ? vector.y : minY : maxY;

        return v2.create(resX, resY);
    },

    min: function min(a, b) {
        return a < b ? a : b;
    },

    max: function max(a, b) {
        return a > b ? a : b;
    },

    lerp: function lerp(t, a, b) {
        return a * (1.0 - t) + b * t;
    },

    delerp: function delerp(t, a, b) {
        return math.clamp((t - a) / (b - a), 0.0, 1.0);
    },

    v2lerp: function v2lerp(t, a, b) {
        return v2.create(math.lerp(t, a.x, b.x), math.lerp(t, a.y, b.y));
    },

    smoothstep: function smoothstep(v, a, b) {
        var t = math.clamp((v - a) / (b - a), 0.0, 1.0);
        return t * t * (3.0 - 2.0 * t);
    },

    // Taken from: https://joshondesign.com/2013/03/01/improvedEasingEquations
    easeOutElastic: function easeOutElastic(t) {
        var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3;

        return Math.pow(2.0, -10.0 * t) * Math.sin((t - p / 4.0) * (2.0 * Math.PI) / p) + 1.0;
    },

    easeOutExpo: function easeOutExpo(t) {
        return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
    },

    easeInExpo: function easeInExpo(t) {
        return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
    },

    easeOutQuart: function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    },

    remap: function remap(v, a, b, x, y) {
        var t = math.clamp((v - a) / (b - a), 0.0, 1.0);
        return math.lerp(t, x, y);
    },

    eqAbs: function eqAbs(a, b, eps) {
        var epsilon = eps || kEpsilon;
        return Math.abs(a - b) < epsilon;
    },

    eqRel: function eqRel(a, b, eps) {
        var epsilon = eps !== undefined ? eps : kEpsilon;
        return Math.abs(a - b) <= epsilon * Math.max(Math.max(1.0, Math.abs(a)), Math.abs(b));
    },

    deg2rad: function deg2rad(deg) {
        return deg * Math.PI / 180.0;
    },

    deg2vec2: function deg2vec2(deg) {
        deg *= Math.PI / 180; //Convert to radians
        return v2.create(Math.cos(deg), Math.sin(deg));
    },

    rad2deg: function rad2deg(rad) {
        return rad * 180.0 / Math.PI;
    },

    rad2degFromDirection: function rad2degFromDirection(y, x) {
        var rad = Math.atan2(y, x);
        var angle = rad * 180 / Math.PI;

        if (angle < 0) {
            angle += 360;
        }
        return angle;
    },

    fract: function fract(n) {
        return n - Math.floor(n);
    },

    sign: function sign(n) {
        return n < 0.0 ? -1.0 : 1.0;
    },

    mod: function mod(num, n) {
        return (num % n + n) % n;
    },

    fmod: function fmod(num, n) {
        return num - Math.floor(num / n) * n;
    },

    angleDiff: function angleDiff(a, b) {
        var d = math.fmod(b - a + Math.PI, Math.PI * 2.0) - Math.PI;
        return d < -Math.PI ? d + Math.PI * 2.0 : d;
    },

    oriToRad: function oriToRad(ori) {
        return ori % 4 * 0.5 * Math.PI;
    },

    oriToAngle: function oriToAngle(ori) {
        return ori * (180 / Math.PI);
    },

    radToOri: function radToOri(rad) {
        return Math.floor(math.fmod(rad + Math.PI * 0.25, Math.PI * 2.0) / (Math.PI * 0.5));
    },

    quantize: function quantize(f, min, max, bits) {
        assert(f >= min && f <= max);
        var range = (1 << bits) - 1;
        var x = math.clamp(f, min, max);
        var t = (x - min) / (max - min);
        var a = t * range + 0.5;
        var b = a < 0.0 ? Math.ceil(a) : Math.floor(a);
        return min + b / range * (max - min);
    },

    v2Quantize: function v2Quantize(v, minX, minY, maxX, maxY, bits) {
        return v2.create(math.quantize(v.x, minX, maxX, bits), math.quantize(v.y, minY, maxY, bits));
    },

    // Ray-Line and Ray-Polygon implementations from
    // http://ahamnett.blogspot.com/2012/06/raypolygon-intersections.html
    rayLineIntersect: function rayLineIntersect(origin, direction, lineA, lineB) {
        var segment = v2.sub(lineB, lineA);
        var segmentPerp = v2.create(segment.y, -segment.x);
        var perpDotDir = v2.dot(direction, segmentPerp);

        // Parallel lines, no intersection
        if (Math.abs(perpDotDir) <= kEpsilon) return undefined;

        var d = v2.sub(lineA, origin);

        // Distance of intersection along ray
        var t = v2.dot(segmentPerp, d) / perpDotDir;

        // Distance of intersection along line
        var s = v2.dot(v2.create(direction.y, -direction.x), d) / perpDotDir;

        // If t is positive and s lies within the line it intersects; returns t
        return t >= 0.0 && s >= 0.0 && s <= 1.0 ? t : undefined;
    },

    rayPolygonIntersect: function rayPolygonIntersect(origin, direction, vertices) {
        var t = Number.MAX_VALUE;

        var intersected = false;
        for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            var distance = this.rayLineIntersect(origin, direction, vertices[j], vertices[i]);
            if (distance !== undefined) {
                if (distance < t) {
                    intersected = true;
                    t = distance;
                }
            }
        }

        // Returns closest intersection
        return intersected ? t : undefined;
    },

    // https://stackoverflow.com/questions/22521982/js-check-if-point-inside-a-polygon
    pointInsidePolygon: function pointInsidePolygon(point, poly) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var x = point.x;
        var y = point.y;
        var inside = false;
        var count = poly.length;
        for (var i = 0, j = count - 1; i < count; j = i++) {
            var xi = poly[i].x;
            var yi = poly[i].y;
            var xj = poly[j].x;
            var yj = poly[j].y;

            var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    },

    distToSegmentSq: function distToSegmentSq(p, a, b) {
        var ab = v2.sub(b, a);
        var c = v2.dot(v2.sub(p, a), ab) / v2.dot(ab, ab);
        var d = v2.add(a, v2.mul(ab, math.clamp(c, 0.0, 1.0)));
        var e = v2.sub(d, p);
        return v2.dot(e, e);
    },

    distToPolygon: function distToPolygon(p, poly) {
        var closestDistSq = Number.MAX_VALUE;
        for (var i = 0; i < poly.length; i++) {
            var a = poly[i];
            var b = i == poly.length - 1 ? poly[0] : poly[i + 1];
            var distSq = math.distToSegmentSq(p, a, b);
            if (distSq < closestDistSq) {
                closestDistSq = distSq;
            }
        }
        return Math.sqrt(closestDistSq);
    },

    polygonArea: function polygonArea(poly) {
        // Convert polygon to triangles
        var verts = [];
        for (var i = 0; i < poly.length; i++) {
            verts.push(poly[i].x);
            verts.push(poly[i].y);
        }
        var idxs = earcut(verts);

        // Compute area of triangles
        var area = 0.0;
        for (var _i = 0; _i < idxs.length; _i += 3) {
            var idx0 = idxs[_i + 0];
            var idx1 = idxs[_i + 1];
            var idx2 = idxs[_i + 2];
            var ax = verts[idx0 * 2 + 0];
            var ay = verts[idx0 * 2 + 1];
            var bx = verts[idx1 * 2 + 0];
            var by = verts[idx1 * 2 + 1];
            var cx = verts[idx2 * 2 + 0];
            var cy = verts[idx2 * 2 + 1];
            area += Math.abs((ax * by + bx * cy + cx * ay - bx * ay - cx * by - ax * cy) * 0.5);
        }
        return area;
    },

    // http://paulbourke.net/geometry/pointlineplane/javascript.txt
    lineIntersects: function lineIntersects(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Check if none of the lines are of length 0
        if (x1 === x2 && y1 === y2 || x3 === x4 && y3 === y4) {
            return false;
        }

        var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

        // Lines are parallel
        if (denominator === 0) {
            return false;
        }

        var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }

        // Return a object with the x and y coordinates of the intersection
        var x = x1 + ua * (x2 - x1);
        var y = y1 + ua * (y2 - y1);

        return { x: x, y: y };
    }
};

module.exports = math;
