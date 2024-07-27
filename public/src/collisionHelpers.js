"use strict";


var collider = require("./collider.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");

//
// Internal helper routines
//
function intersectSegmentObstacle(obstacle, s0, s1, height, layer, hackStairs) {
    var o = obstacle;

    if (!o.active || o.dead || !o.collidable || o.isWindow || o.height < height || !util.sameLayer(o.layer, layer)) {
        return null;
    }

    // Ignore above-ground walls when on stairs.
    //
    // Currently there are invisible walls at the bottom and tops of stairs,
    // and this allows for proper bunker ceiling reveals when at the tops of
    // stairs. This hack could be removed if bullets are refactored to no
    // longer stop at the bottoms and tops of stairs.
    if (hackStairs && layer & 0x2 && o.layer == 0) {
        return null;
    }

    return collider.intersectSegment(o.collider, s0, s1);
}

function getIntersectSegmentEnd(obstacles, pos, dir, len, layer) {
    var dist = collisionHelpers.intersectSegmentDist(obstacles, pos, dir, len, 0.0, layer, false);
    return v2.add(pos, v2.mul(dir, dist));
}

//
// Exported routines
//
var collisionHelpers = {
    intersectSegment: function intersectSegment(obstacles, pos, dir, len, height, layer, hackStairs) {
        var end = v2.add(pos, v2.mul(dir, len));
        var cols = [];
        for (var i = 0; i < obstacles.length; i++) {
            var o = obstacles[i];
            var res = intersectSegmentObstacle(o, pos, end, height, layer, hackStairs);
            if (res) {
                var dist = v2.length(v2.sub(res.point, pos));
                cols.push({
                    id: o.__id,
                    dist: dist
                });
            }
        }
        cols.sort(function (a, b) {
            return a.dist - b.dist;
        });
        return cols.length > 0 ? cols[0] : null;
    },

    intersectSegmentDist: function intersectSegmentDist(obstacles, pos, dir, len, height, layer, hackStairs) {
        var dist = len;
        var end = v2.add(pos, v2.mul(dir, len));
        for (var i = 0; i < obstacles.length; i++) {
            var o = obstacles[i];
            var res = intersectSegmentObstacle(o, pos, end, height, layer, hackStairs);
            if (res) {
                dist = math.min(dist, v2.length(v2.sub(res.point, pos)));
            }
        }
        return dist;
    },

    scanCollider: function scanCollider(col, obstacles, pos, layer, height, scanWidth, scanDist, rayCount) {
        var toCol = collider.intersectCircle(col, pos, scanDist);
        if (!toCol) {
            return null;
        } else if (toCol.pen >= scanDist) {
            // Inside the collider
            return { dist: 0.0 };
        }

        var perp = v2.perp(toCol.dir);

        var scanStart = getIntersectSegmentEnd(obstacles, pos, v2.neg(perp), 0.5 * scanWidth, layer);
        var scanEnd = getIntersectSegmentEnd(obstacles, pos, perp, 0.5 * scanWidth, layer);
        var scanDir = v2.sub(scanEnd, scanStart);
        var scanLen = v2.length(scanDir);
        scanDir = scanLen > 0.0001 ? v2.div(scanDir, scanLen) : v2.create(1.0, 0.0);

        var rayPositions = [];
        for (var i = 0; i < rayCount; i++) {
            var t = i / math.max(rayCount - 1, 1);
            rayPositions.push(v2.add(scanStart, v2.mul(scanDir, scanLen * t)));
        }
        var rayHeight = height;

        for (var _i = 0; _i < rayPositions.length; _i++) {
            var rayPos = rayPositions[_i];

            var circleRes = collider.intersectCircle(col, rayPos, scanDist);
            if (!circleRes) {
                continue;
            }

            var rayDir = v2.neg(circleRes.dir);
            var maxDist = collisionHelpers.intersectSegmentDist(obstacles, rayPos, rayDir, scanDist, rayHeight, layer, true);
            var res = collider.intersectSegment(col, rayPos, v2.add(rayPos, v2.mul(rayDir, scanDist)));
            var dist = res ? v2.length(v2.sub(res.point, rayPos)) : 0.0;
            var rayHit = res && dist <= maxDist;

            if (device.debug) {
                var color = rayHit ? 0x00ff00 : 0xff0000;
                DebugLines.addRay(rayPos, rayDir, scanDist, color);
            }
            if (rayHit) {
                return { dist: dist };
            }
        }

        return null;
    }
};

module.exports = collisionHelpers;
