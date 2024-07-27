"use strict";


var coldet = require("./coldet.js");
var math = require("./math.js");
var v2 = require("./v2.js");

//
// collider
//
var collider = {
    Type: {
        Circle: 0,
        Aabb: 1
    },

    createCircle: function createCircle(pos, rad, height) {
        return {
            type: collider.Type.Circle,
            pos: v2.copy(pos),
            rad: rad,
            height: height !== undefined ? height : 0.0
        };
    },

    createAabb: function createAabb(min, max, height) {
        return {
            type: collider.Type.Aabb,
            min: v2.copy(min),
            max: v2.copy(max),
            height: height !== undefined ? height : 0.0
        };
    },

    createAabbExtents: function createAabbExtents(pos, extent, height) {
        var min = v2.sub(pos, extent);
        var max = v2.add(pos, extent);
        return collider.createAabb(min, max, height);
    },

    createBounding: function createBounding(colliders) {
        if (colliders.length == 1) {
            return collider.copy(colliders[0]);
        } else {
            var aabbs = [];
            var maxHeight = 0.0;
            for (var i = 0; i < colliders.length; i++) {
                var col = colliders[i];
                aabbs.push(collider.toAabb(col));
                maxHeight = math.max(maxHeight, col.height);
            }
            var bound = coldet.boundingAabb(aabbs);
            return collider.createAabb(bound.min, bound.max, maxHeight);
        }
    },

    toAabb: function toAabb(c) {
        if (c.type == collider.Type.Aabb) {
            return collider.createAabb(c.min, c.max, c.height);
        } else {
            var aabb = coldet.circleToAabb(c.pos, c.rad);
            return collider.createAabb(aabb.min, aabb.max, c.height);
        }
    },

    copy: function copy(c) {
        return c.type == collider.Type.Circle ? collider.createCircle(c.pos, c.rad, c.height) : collider.createAabb(c.min, c.max, c.height);
    },

    transform: function transform(col, pos, rot, scale) {
        var isMelee = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        if (col.type == collider.Type.Aabb) {
            var e = v2.mul(v2.sub(col.max, col.min), 0.5);
            var c = v2.add(col.min, e);
            var pts = [v2.create(c.x - e.x, c.y - e.y), v2.create(c.x - e.x, c.y + e.y), v2.create(c.x + e.x, c.y - e.y), v2.create(c.x + e.x, c.y + e.y)];
            var min = v2.create(Number.MAX_VALUE, Number.MAX_VALUE);
            var max = v2.create(-Number.MAX_VALUE, -Number.MAX_VALUE);
            for (var i = 0; i < pts.length; i++) {
                var angle = isMelee ? 0 : rot;
                var p = v2.add(v2.rotate(v2.mul(pts[i], scale), angle), pos);
                min.x = math.min(min.x, p.x);
                min.y = math.min(min.y, p.y);
                max.x = math.max(max.x, p.x);
                max.y = math.max(max.y, p.y);

                if (isMelee) {
                    pts[i] = this.rotatePoint(p, pos, rot);
                }
            }

            if (!isMelee) {
                pts[0] = v2.create(min.x, min.y);
                pts[1] = v2.create(min.x, max.y);
                pts[2] = v2.create(max.x, min.y);
                pts[3] = v2.create(max.x, max.y);
            }

            //Rectangle points
            var colliderTransform = collider.createAabb(min, max, col.height);
            colliderTransform.pts = pts;
            return colliderTransform;
        } else {
            return collider.createCircle(v2.add(v2.rotate(v2.mul(col.pos, scale), rot), pos), col.rad * scale, col.height);
        }
    },

    getPoints: function getPoints(aabb) {
        var pts = [];
        var min = aabb.min;
        var max = aabb.max;
        pts[0] = v2.create(min.x, min.y);
        pts[1] = v2.create(min.x, max.y);
        pts[2] = v2.create(max.x, min.y);
        pts[3] = v2.create(max.x, max.y);

        return pts;
    },

    rotatePoint: function rotatePoint(p, pos, angle) {
        var ang = angle * (Math.PI / 180);

        var pointsDx2 = v2.sub(p, pos);

        var dx2 = pointsDx2.x * Math.cos(ang) - pointsDx2.y * Math.sin(ang);
        var dy2 = pointsDx2.x * Math.sin(ang) + pointsDx2.y * Math.cos(ang);

        var newPoints = v2.add(v2.create(dx2, dy2), pos);

        return newPoints;
    },

    transformProjectile: function transformProjectile(col, pos, angle, scale) {
        //TODO created to rotate rectangular hitbox on proyectiles, not used yet
        //Intended to be used by shared/bullets/rectangularHitboxSized.js
        var rot = angle * (Math.PI / 180);
        if (col.type == collider.Type.Aabb) {
            var e = v2.mul(v2.sub(col.max, col.min), 0.5);
            var c = v2.add(col.min, e);
            var pts = [v2.create(c.x - e.x, c.y - e.y), v2.create(c.x - e.x, c.y + e.y), v2.create(c.x + e.x, c.y - e.y), v2.create(c.x + e.x, c.y + e.y)];
            var min = v2.create(Number.MAX_VALUE, Number.MAX_VALUE);
            var max = v2.create(-Number.MAX_VALUE, -Number.MAX_VALUE);
            for (var i = 0; i < pts.length; i++) {
                var p = v2.add(v2.mul(pts[i], scale), pos);
                p = this.rotatePoint(p, pos, angle);

                min.x = math.min(min.x, p.x);
                min.y = math.min(min.y, p.y);
                max.x = math.max(max.x, p.x);
                max.y = math.max(max.y, p.y);

                pts[i] = p;
            }

            var colliderTransform = collider.createAabb(min, max, col.height);
            colliderTransform.pts = pts;
            return colliderTransform;
        } else {
            return collider.createCircle(v2.add(v2.rotate(v2.mul(col.pos, scale), rot), pos), col.rad * scale, col.height);
        }
    },

    // @TODO: Ensure consistent pen dirs (ie towards 2nd arg)
    intersectCircle: function intersectCircle(col, pos, rad) {
        if (col.type == collider.Type.Aabb) {
            return coldet.intersectAabbCircle(col.min, col.max, pos, rad, false);
        } else {
            return coldet.intersectCircleCircle(col.pos, col.rad, pos, rad);
        }
    },

    intersectAabb: function intersectAabb(col, min, max) {
        if (col.type == collider.Type.Aabb) {
            return coldet.intersectAabbAabb(col.min, col.max, min, max);
        } else {
            // @TODO: pen dir is reversed
            return coldet.intersectAabbCircle(min, max, col.pos, col.rad, false);
        }
    },

    intersectAabbPlayer: function intersectAabbPlayer(col, min, max) {
        if (col.type == collider.Type.Aabb) {
            // console.log("CALL collision rect player");
            return coldet.intersectAabbRectangle(col.min, col.max, min, max);
        } else {
            // @TODO: pen dir is reversed
            //   console.log("CALL2 collision rect player");
            return coldet.intersect(min, max, col.pos, col.rad);
        }
    },

    intersectSegment: function intersectSegment(col, a, b) {
        if (col.type == collider.Type.Aabb) {
            return coldet.intersectSegmentAabb(a, b, col.min, col.max);
        } else {
            return coldet.intersectSegmentCircle(a, b, col.pos, col.rad);
        }
    },

    intersect: function intersect(colA, colB) {
        if (colB.type == collider.Type.Aabb) {
            return collider.intersectAabb(colA, colB.min, colB.max);
        } else {
            return collider.intersectCircle(colA, colB.pos, colB.rad);
        }
    },

    intersectPlayer: function intersectPlayer(colA, colB) {
        //player obj
        if (colB.type == collider.Type.Aabb) {
            return coldet.intersectAabbRectangle(colA.min, colA.max, colB.min, colB.max);
        } else {
            return coldet.intersectAabbCircle(colA.min, colA.max, colB.pos, colB.rad, true);
        }
    },

    intersectcameraDeadZoneCollider: function intersectcameraDeadZoneCollider(colA, colB) {
        //player obj
        return coldet.intersectRectangleBorder(colA.min, colA.max, colB.min, colB.max);
    },

    intersectRotatedAabb: function intersectRotatedAabb(colA, colB) {
        //player obj
        if (colB.type == collider.Type.Aabb) {
            return coldet.intersectRotatedRectangle(colA.pts, colB.pts);
        } else {
            // return null;
            return coldet.intersectMeleeCircle(colA, colB);
        }
    }
};

module.exports = collider;
