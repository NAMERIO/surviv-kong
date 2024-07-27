"use strict";


var coldet = require("./coldet.js");
var collider = require("./collider.js");
var mapHelpers = require("./mapHelpers.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var debugHelpers = require("./debugHelpers.js");
var DebugLines = require("./debugLines.js");

var MapObjectDefs = require("./mapObjectDefs.js");

//
// Structure
//
function Structure() {}

Structure.prototype = {
    m_init: function m_init() {
        this.soundTransitionT = 0.0;
    },

    m_free: function m_free() {},

    m_updateData: function m_updateData(data, fullUpdate, isNew, ctx) {
        if (fullUpdate) {
            this.type = data.type;
            this.layer = 0;
            this.pos = v2.copy(data.pos);
            this.rot = math.oriToRad(data.ori);
            this.scale = 1.0;
            this.interiorSoundAlt = data.interiorSoundAlt;
            this.interiorSoundEnabled = data.interiorSoundEnabled;

            if (isNew) {
                this.soundTransitionT = this.interiorSoundAlt ? 1.0 : 0.0;
                this.soundEnabledT = this.interiorSoundEnabled ? 1.0 : 0.0;
            }

            this.aabb = collider.transform(mapHelpers.getBoundingCollider(this.type), this.pos, this.rot, this.scale);

            var def = MapObjectDefs[this.type];

            this.layers = [];
            for (var i = 0; i < def.layers.length; i++) {
                var layer = def.layers[i];

                var objId = data.layerObjIds[i];

                var inheritOri = layer.inheritOri !== undefined ? layer.inheritOri : true;
                var underground = layer.underground !== undefined ? layer.underground : i == 1;

                var pos = v2.add(this.pos, layer.pos);
                var rot = math.oriToRad(inheritOri ? data.ori + layer.ori : layer.ori);
                var scale = 1.0;
                var collision = collider.transform(mapHelpers.getBoundingCollider(layer.type), pos, rot, scale);
                this.layers.push({ objId: objId, collision: collision, underground: underground });
            }

            this.stairs = [];
            for (var _i = 0; _i < def.stairs.length; _i++) {
                var stairsDef = def.stairs[_i];
                var stairsCol = collider.transform(stairsDef.collision, this.pos, this.rot, this.scale);
                var downDir = v2.rotate(stairsDef.downDir, this.rot);
                var childAabbs = coldet.splitAabb(stairsCol, downDir);
                this.stairs.push({
                    collision: stairsCol,
                    center: v2.add(stairsCol.min, v2.mul(v2.sub(stairsCol.max, stairsCol.min), 0.5)),
                    downDir: downDir,
                    downAabb: collider.createAabb(childAabbs[0].min, childAabbs[0].max),
                    upAabb: collider.createAabb(childAabbs[1].min, childAabbs[1].max),
                    noCeilingReveal: !!stairsDef.noCeilingReveal,
                    lootOnly: !!stairsDef.lootOnly
                });
            }

            this.mask = [];
            for (var _i2 = 0; _i2 < def.mask.length; _i2++) {
                this.mask.push(collider.transform(def.mask[_i2], this.pos, this.rot, this.scale));
            }

            ctx.renderer.layerMaskDirty = true;
        }
    },

    update: function update(dt, map, activePlayer, ambience) {
        var def = MapObjectDefs[this.type];
        if (def.interiorSound) {
            this.updateInteriorSounds(dt, map, activePlayer, ambience);
        }
    },

    updateInteriorSounds: function updateInteriorSounds(dt, map, activePlayer, ambience) {
        var def = MapObjectDefs[this.type];

        var playerCol = collider.createCircle(activePlayer.pos, 0.001);
        var buildings = map.m_buildingPool.m_getPool();
        var building0 = this.layers.length > 0 ? map.getBuildingById(this.layers[0].objId) : null;
        var building1 = this.layers.length > 1 ? map.getBuildingById(this.layers[1].objId) : null;

        var maxDist = def.interiorSound.outsideMaxDist !== undefined ? def.interiorSound.outsideMaxDist : 10.0;
        var outsideVol = def.interiorSound.outsideVolume !== undefined ? def.interiorSound.outsideVolume : 0.0;
        var undergroundVol = def.interiorSound.undergroundVolume !== undefined ? def.interiorSound.undergroundVolume : 1.0;

        // Compute weights for the normal (weight0) and filtered (weight1) tracks
        var weight0 = 0.0;
        var weight1 = 0.0;
        if (activePlayer.layer != 1) {
            if (building0) {
                // Play the filtered sound when we can't see inside the building,
                // and reduce the volume based on distance from the building.
                var dist = building0.getDistanceToBuilding(activePlayer.pos, maxDist);
                var weight = math.remap(dist, maxDist, 0.0, 0.0, 1.0);
                var onStairs = activePlayer.layer & 0x2;
                var visionT = building0.ceiling.fadeAlpha;
                weight0 = weight * (1.0 - visionT);
                weight1 = weight * visionT * (onStairs ? undergroundVol : outsideVol);
            }
        } else {
            // Immediately play the filtered track at  full weight when
            // going underground; the filter and reverb effects delay the sound
            // slightly which ends up sounding okay without a crossfade.
            if (building1) {
                var _dist = building1.getDistanceToBuilding(activePlayer.pos, maxDist);
                var _weight = math.remap(_dist, maxDist, 0.0, 0.0, 1.0);

                weight0 = 0.0;
                weight1 = _weight * undergroundVol;
            }
        }

        // Transition between sound and soundAlt tracks
        var transitionTime = def.interiorSound.transitionTime !== undefined ? def.interiorSound.transitionTime : 1.0;
        if (this.interiorSoundAlt) {
            this.soundTransitionT = math.clamp(this.soundTransitionT + dt / transitionTime, 0.0, 1.0);
        }
        var transitionWeight = 2.0 * Math.abs(this.soundTransitionT - 0.5);

        // Fade out the track after it's disabled
        if (!this.interiorSoundEnabled) {
            this.soundEnabledT = math.clamp(this.soundEnabledT - dt * 0.5, 0.0, 1.0);
        }

        // Choose the actual track based on the state of the transition
        var sound = this.soundTransitionT > 0.5 ? def.interiorSound.soundAlt : def.interiorSound.sound;

        // Set the track data
        var track0 = ambience.getTrack('interior_0');
        track0.sound = sound;
        track0.filter = '';
        track0.weight = sound ? weight0 * transitionWeight * this.soundEnabledT : 0.0;

        var track1 = ambience.getTrack('interior_1');
        track1.sound = sound;
        track1.filter = def.interiorSound.filter;
        track1.weight = sound ? weight1 * transitionWeight * this.soundEnabledT : 0.0;
    },

    render: function render(camera, debug, layer) {},

    insideStairs: function insideStairs(collision) {
        for (var i = 0; i < this.stairs.length; i++) {
            if (collider.intersect(this.stairs[i].collision, collision)) {
                return true;
            }
        }
        return false;
    },

    insideMask: function insideMask(collision) {
        for (var i = 0; i < this.mask.length; i++) {
            if (collider.intersect(this.mask[i], collision)) {
                return true;
            }
        }
        return false;
    }
};

module.exports = Structure;
