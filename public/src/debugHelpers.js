"use strict";


var collider = require("./collider.js");
var mapHelpers = require("./mapHelpers.js");
var v2 = require("./v2.js");
var DebugLines = require("./debugLines.js");

var MapObjectDefs = require("./mapObjectDefs.js");

function renderMapBuildingBounds(mapObj) {
    var def = MapObjectDefs[mapObj.type];
    var boundScale = def.type == 'building' || def.type == 'structure' ? 1.15 : 1.0;
    var bounds = [collider.transform(mapHelpers.getBoundingCollider(mapObj.type), mapObj.pos, mapObj.rot, mapObj.scale * boundScale)];
    if (def.bridgeLandBounds !== undefined) {
        for (var i = 0; i < def.bridgeLandBounds.length; i++) {
            bounds.push(collider.transform(def.bridgeLandBounds[i], mapObj.pos, mapObj.rot, mapObj.scale));
        }
    }
    for (var _i = 0; _i < bounds.length; _i++) {
        DebugLines.addCollider(bounds[_i], 0xffffff, 0.0);
    }
}

function renderMapObstacleBounds(mapObj) {
    var def = MapObjectDefs[mapObj.type];
    var boundScale = def.type == 'building' || def.type == 'structure' ? 1.1 : 1.0;
    var bounds = [collider.transform(mapHelpers.getBoundingCollider(mapObj.type), mapObj.pos, mapObj.rot, mapObj.scale * boundScale)];
    if (def.mapObstacleBounds !== undefined) {
        bounds = [];
        for (var i = 0; i < def.mapObstacleBounds.length; i++) {
            bounds.push(collider.transform(def.mapObstacleBounds[i], mapObj.pos, mapObj.rot, mapObj.scale));
        }
    }
    for (var _i2 = 0; _i2 < bounds.length; _i2++) {
        DebugLines.addCollider(bounds[_i2], 0x0000ff, 0.1);
    }
}

function renderWaterEdge(mapObj) {
    var def = MapObjectDefs[mapObj.type];
    if (def.terrain.waterEdge !== undefined) {
        var waterEdge = def.terrain.waterEdge;
        var bounds = collider.transform(mapHelpers.getBoundingCollider(mapObj.type), mapObj.pos, mapObj.rot, mapObj.scale * 1.15);
        var center = v2.add(bounds.min, v2.mul(v2.sub(bounds.max, bounds.min), 0.5));
        var dir = v2.rotate(waterEdge.dir, mapObj.rot);

        var renderRay = function renderRay(center, dir, len) {
            if (len < 0.0) {
                dir = v2.neg(dir);
            }
            DebugLines.addRay(center, dir, Math.abs(len), 0xffffff, 0.0);
        };
        renderRay(center, dir, waterEdge.distMin);
        renderRay(v2.add(center, v2.mul(v2.perp(dir), 0.5)), dir, waterEdge.distMax);
    }
}

function renderBridge(mapObj) {
    var def = MapObjectDefs[mapObj.type];
    if (def.terrain.bridge !== undefined) {
        var bridgeLandBounds = def.bridgeLandBounds || [];
        for (var i = 0; i < bridgeLandBounds.length; i++) {
            var col = collider.transform(bridgeLandBounds[i], mapObj.pos, mapObj.rot, mapObj.scale);
            DebugLines.addCollider(col, 0xff7700, 0.0);
        }
        var bridgeWaterBounds = def.bridgeWaterBounds || [];
        for (var _i3 = 0; _i3 < bridgeWaterBounds.length; _i3++) {
            var _col = collider.transform(bridgeWaterBounds[_i3], mapObj.pos, mapObj.rot, mapObj.scale);
            DebugLines.addCollider(_col, 0x0077ff, 0.0);
        }

        var dims = mapHelpers.getBridgeDims(mapObj.type);
        var dir = v2.rotate(v2.create(1.0, 0.0), mapObj.rot);
        DebugLines.addRay(mapObj.pos, dir, dims.length * 0.5, 0xff0000, 0.0);
        DebugLines.addRay(mapObj.pos, v2.perp(dir), dims.width * 0.5, 0x00ff00, 0.0);

        var bridgeOverlapCol = mapHelpers.getBridgeOverlapCollider(mapObj.type, mapObj.pos, mapObj.rot, mapObj.scale);
        DebugLines.addCollider(bridgeOverlapCol, 0x7700ff, 0.0);
    }
}

function renderSpline(spline, segments) {
    segments = Math.floor(segments);
    for (var i = 0; i < segments; i++) {
        var p0 = spline.getPos(i / segments);
        var p1 = spline.getPos((i + 1) / segments);
        DebugLines.addLine(p0, p1, 0x00ff00, 0.0);
    }
}

module.exports = {
    renderMapBuildingBounds: renderMapBuildingBounds,
    renderMapObstacleBounds: renderMapObstacleBounds,
    renderWaterEdge: renderWaterEdge,
    renderBridge: renderBridge,
    renderSpline: renderSpline
};
