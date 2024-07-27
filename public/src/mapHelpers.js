"use strict";


var assert = require("./0e566746.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var math = require("./math.js");
var v2 = require("./v2.js");

var MapObjectDefs = require("./mapObjectDefs.js");

// Anti-cheat vars
var m_kMinSmokeAlpha = 0.8;
var m_kMinObstacleAlpha = 0.9;
var m_kMinNpcAlpha = 0.2;
// Memoize computed object colliders
var cachedColliders = {};
function computeBoundingCollider(type) {
    var def = MapObjectDefs[type];
    if (def.type == 'structure') {
        var aabbs = [];
        for (var i = 0; i < def.layers.length; i++) {
            var obj = def.layers[i];
            var rot = math.oriToRad(obj.ori);
            var col = collider.transform(mapHelpers.getBoundingCollider(obj.type), obj.pos, rot, 1.0);
            aabbs.push(collider.toAabb(col));
        }
        for (var _i = 0; _i < def.stairs.length; _i++) {
            aabbs.push(def.stairs[_i].collision);
        }
        var aabb = coldet.boundingAabb(aabbs);
        // Expand structure aabb a small amount. This fixes an issue where
        // moving loot scanning for nearby structures may exit a stairwell
        // and no longer detect the nearby structure, thereby not switching
        // layers back to the ground layer.
        var margin = v2.create(1.0, 1.0);
        aabb.min = v2.sub(aabb.min, margin);
        aabb.max = v2.add(aabb.max, margin);
        return collider.createAabb(aabb.min, aabb.max);
    } else if (def.type == 'building') {
        var _aabbs = [];
        for (var _i2 = 0; _i2 < def.floor.surfaces.length; _i2++) {
            var collisions = def.floor.surfaces[_i2].collision;
            for (var j = 0; j < collisions.length; j++) {
                _aabbs.push(collisions[j]);
            }
        }
        for (var _i3 = 0; _i3 < def.ceiling.zoomRegions.length; _i3++) {
            var region = def.ceiling.zoomRegions[_i3];
            if (region.zoomIn) {
                _aabbs.push(region.zoomIn);
            }
            if (region.zoomOut) {
                _aabbs.push(region.zoomOut);
            }
        }
        // Map objects
        for (var _i4 = 0; _i4 < def.mapObjects.length; _i4++) {
            var mapObj = def.mapObjects[_i4];
            var mt = mapObj.type;
            if (typeof mt === 'function') {
                mt = mt();
            }
            if (mt != '') {
                var _rot = math.oriToRad(mapObj.ori);
                var _col = collider.transform(mapHelpers.getBoundingCollider(mt), mapObj.pos, _rot, mapObj.scale);
                _aabbs.push(collider.toAabb(_col));
            }
        }
        var _aabb = coldet.boundingAabb(_aabbs);
        return collider.createAabb(_aabb.min, _aabb.max);
    } else if (def.type == 'decal') {
        return collider.toAabb(def.collision);
    } else if (def.type == 'loot_spawner') {
        return collider.createCircle(v2.create(0.0, 0.0), 3.0);
    } else {
        assert(def.collision);
        return def.collision;
    }
}

//
// MapHelpers
//
var mapHelpers = {
    getBoundingCollider: function getBoundingCollider(type) {
        if (cachedColliders[type]) {
            return cachedColliders[type];
        } else {
            var col = computeBoundingCollider(type);
            cachedColliders[type] = col;
            return col;
        }
    },

    getBridgeDims: function getBridgeDims(type) {
        var col = mapHelpers.getBoundingCollider(type);
        var aabb = collider.toAabb(col);
        var e = v2.mul(v2.sub(aabb.max, aabb.min), 0.5);
        var c = v2.add(aabb.min, e);
        var x = e.x > e.y;
        var dir = v2.create(x ? 1.0 : 0.0, x ? 0.0 : 1.0);
        var length = v2.dot(dir, e) * 2.0;
        var width = v2.dot(v2.perp(dir), e) * 2.0;
        return { length: length, width: width };
    },

    getBridgeOverlapCollider: function getBridgeOverlapCollider(type, pos, rot, scale) {
        // Returns an expanded collider perpendicular to the bridge.
        // This determines how closely bridges can spawn to one another on a river.
        var def = MapObjectDefs[type];
        var dims = mapHelpers.getBridgeDims(type);
        var dir = v2.create(1.0, 0.0);
        var ext = v2.add(v2.mul(dir, dims.length * 1.5), v2.mul(v2.perp(dir), dims.width * def.terrain.bridge.nearbyWidthMult));
        var col = collider.createAabbExtents(v2.create(0.0, 0.0), v2.mul(ext, 0.5));
        return collider.transform(col, pos, rot, scale);
    },

    // Alpha modification detection
    m_kMinSmokeAlpha: m_kMinSmokeAlpha,
    m_kMinObstacleAlpha: m_kMinObstacleAlpha,
    m_kMinNpcAlpha: m_kMinNpcAlpha,
    m_validateSpriteAlpha: function m_validateSpriteAlpha(p, x) {
        return p.sprite && p.sprite.visible && p.sprite.alpha < x;
    }
};

module.exports = mapHelpers;
