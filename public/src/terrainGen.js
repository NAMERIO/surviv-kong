"use strict";


var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var River = require("./river.js");
var Terrain = require("./terrain.js");
var util = require("./util.js");
var v2 = require("./v2.js");

function generateJaggedAabbPoints(aabb, divisionsX, divisionsY, variation, rand) {
    var ll = v2.create(aabb.min.x, aabb.min.y);
    var lr = v2.create(aabb.max.x, aabb.min.y);
    var ul = v2.create(aabb.min.x, aabb.max.y);
    var ur = v2.create(aabb.max.x, aabb.max.y);

    var distanceX = lr.x - ll.x;
    var distanceY = ul.y - ll.y;
    var spanX = distanceX / (divisionsX + 1);
    var spanY = distanceY / (divisionsY + 1);

    // Generate points in a counter-clockwise direction starting from the
    // lower left.
    var points = [];
    points.push(v2.copy(ll));
    for (var i = 1; i <= divisionsX; ++i) {
        points.push(v2.create(ll.x + spanX * i, ll.y + rand(-variation, variation)));
    }

    points.push(v2.copy(lr));
    for (var _i = 1; _i <= divisionsY; ++_i) {
        points.push(v2.create(lr.x + rand(-variation, variation), lr.y + spanY * _i));
    }

    points.push(v2.copy(ur));
    for (var _i2 = 1; _i2 <= divisionsX; ++_i2) {
        points.push(v2.create(ur.x - spanX * _i2, ur.y + rand(-variation, variation)));
    }

    points.push(v2.copy(ul));
    for (var _i3 = 1; _i3 <= divisionsY; ++_i3) {
        points.push(v2.create(ul.x + rand(-variation, variation), ul.y - spanY * _i3));
    }

    return points;
}

function generateTerrain(width, height, shoreInset, grassInset, riverDescs, seed, mapTerrain, mapTerrainPolygons) {
    // Subdivisions along one edge of the shore
    var shoreDivisions = 64.0;
    var shoreVariation = GameConfig.map.shoreVariation;
    var grassVariation = GameConfig.map.grassVariation;

    var seededRand = util.seededRand(seed);

    // First generate a shore path that separates the island from water.
    var ll = v2.create(shoreInset, shoreInset);
    var lr = v2.create(width - shoreInset, shoreInset);
    var ul = v2.create(shoreInset, height - shoreInset);
    var ur = v2.create(width - shoreInset, height - shoreInset);

    var aabbMin = v2.create(ll.x, ll.y);
    var aabbMax = v2.create(ur.x, ur.y);
    var aabb = collider.createAabb(aabbMin, aabbMax);
    var shore = generateJaggedAabbPoints(aabb, shoreDivisions, shoreDivisions, shoreVariation, seededRand);

    // Create grass path by insetting the shore path
    // The beach lies between the shore and grass.
    var center = v2.create(width * 0.5, height * 0.5);
    var grass = shore.map(function (pos) {
        var toCenter = v2.normalize(v2.sub(center, pos));
        var variation = seededRand(-grassVariation, grassVariation);
        var inset = grassInset + variation;
        return v2.add(pos, v2.mul(toCenter, inset));
    });

    // Calculate river forms from the given river splines
    var mapBounds = {
        min: v2.create(0.0, 0.0),
        max: v2.create(width, height)
    };
    var rivers = [];
    for (var i = 0; i < riverDescs.length; i++) {
        var desc = riverDescs[i];
        var river = new River(desc.points, desc.width, desc.looped, rivers, mapBounds);
        rivers.push(river);
    }

    var terrainPatches = [];
    if (mapTerrain && mapTerrain.length > 0) {

        for (var _i4 = mapTerrain.length - 1; _i4 >= 0; _i4--) {
            var terrainTemp = mapTerrain[_i4];
            for (var j = terrainTemp.patches.length - 1; j >= 0; j--) {
                var terrain = new Terrain(false, terrainTemp.type, terrainTemp.patches[j], terrainTemp);
                terrainPatches.push(terrain);
            }
        }
    }

    var terrainPatchesPolygons = [];
    if (mapTerrainPolygons && mapTerrainPolygons.length > 0) {

        for (var _i5 = mapTerrainPolygons.length - 1; _i5 >= 0; _i5--) {
            var _terrainTemp = mapTerrainPolygons[_i5];
            // terrainPatchesPolygons.push(newPatch);

            for (var _j = _terrainTemp.patches.length - 1; _j >= 0; _j--) {
                var _terrain = new Terrain(true, _terrainTemp.type, _terrainTemp.patches[_j], _terrainTemp);
                terrainPatchesPolygons.push(_terrain);
            }
        }
    }

    return { shore: shore, grass: grass, rivers: rivers, terrainPatches: terrainPatches, terrainPatchesPolygons: terrainPatchesPolygons };
}

module.exports = {
    generateJaggedAabbPoints: generateJaggedAabbPoints,
    generateTerrain: generateTerrain
};
