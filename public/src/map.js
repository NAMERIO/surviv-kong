"use strict";


var PIXI = require("./pixi.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var mapHelpers = require("./mapHelpers.js");
var Spline = require("./Spline.js");
var TerrainGen = require("./terrainGen.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var ObjectPool = require("./objectPool.js");
var Particles = require("./particles.js");
var device = require("./device.js");
var helpers = require("./helpers.js");
var net = require("./net.js");
var math = require("./math.js");
var GameConfig = require("./gameConfig.js");
var Building = require("./building.js");
var DebugLines = require("./debugLines.js");
var DebugHelpers = require("./debugHelpers.js");
var Obstacle = require("./obstacle.js");
var Structure = require("./structure.js");
var Npc = require("./npc.js");

var MapDefs = require("./mapDefs.js");
var MapObjectDefs = require("./mapObjectDefs.js");

//
// Drawing
//
function drawLine(canvas, pt0, pt1) {
    canvas.moveTo(pt0.x, pt0.y);
    canvas.lineTo(pt1.x, pt1.y);
}

function tracePath(canvas, path) {
    var point = path[0];
    canvas.moveTo(point.x, point.y);
    for (var i = 1; i < path.length; ++i) {
        point = path[i];
        canvas.lineTo(point.x, point.y);
    }
    canvas.closePath();
}

function traceGroundPatch(canvas, patch, seed) {
    var width = patch.max.x - patch.min.x;
    var height = patch.max.y - patch.min.y;

    var offset = patch.offsetDist ? math.max(patch.offsetDist, 0.001) : 0.001;
    var roughness = patch.roughness || 0.05;
    var divisionsX = Math.round(width * roughness / offset);
    var divisionsY = Math.round(height * roughness / offset);

    var seededRand = util.seededRand(seed);
    var points = TerrainGen.generateJaggedAabbPoints(patch, divisionsX, divisionsY, offset, seededRand);

    tracePath(canvas, points);
}

function traceTerrainPatch(canvas, patch) {
    var width = patch.width;
    var height = patch.height;

    var posX = patch.x;
    var posY = patch.y;

    canvas.drawRect(posX, posY, width, height);
}

function renderRiverDebug(river, playerPos) {
    var drawPoly = function drawPoly(poly, color) {
        for (var i = 0; i < poly.length; i++) {
            var a = poly[i];
            var b = i < poly.length - 1 ? poly[i + 1] : poly[0];
            DebugLines.addLine(a, b, color, 0.0);
        }
    };

    drawPoly(river.waterPoly, 0xffff00);
    drawPoly(river.shorePoly, 0xff00ff);

    var splinePts = river.spline.points;
    for (var i = 0; i < splinePts.length; i++) {
        DebugLines.addCircle(splinePts[i], 1.0, 0x00ff00, 0.0);
        if (i < splinePts.length - 1) {
            DebugLines.addLine(splinePts[i], splinePts[i + 1], 0xffff00, 0.0);
        }
    }

    var spline = river.spline;
    var t = spline.getClosestTtoPoint(playerPos);
    var closestPos = spline.getPos(t);
    var closestTangent = v2.normalizeSafe(spline.getTangent(t), v2.create(1.0, 0.0));
    var closestNormal = v2.perp(closestTangent);
    var arcLen = spline.getArcLen(t);
    var arcT = spline.getTfromArcLen(arcLen);
    var arcPos = spline.getPos(arcT);

    DebugHelpers.renderSpline(spline, spline.totalArcLen * 0.5);
    DebugLines.addCircle(arcPos, 0.9, 0xff00ff, 0.0);
    DebugLines.addCircle(closestPos, 1.0, 0xff0000, 0.0);
    DebugLines.addLine(closestPos, playerPos, 0x00ff00, 0.0);
    DebugLines.addLine(closestPos, v2.add(closestPos, closestTangent), 0xff0000, 0.0);
    DebugLines.addLine(closestPos, v2.add(closestPos, closestNormal), 0x00ffff, 0.0);
    DebugLines.addAabb(river.aabb.min, river.aabb.max, 0xffffff, 0.0);
}

//
// Map
//
function m_Map(decalBarn, spineData, spineObjManager) {
    this.decalBarn = decalBarn;

    this.m_mangle = false;
    this.m_mangle1 = false;

    this.display = {
        ground: new PIXI.Graphics(),
        overlay: new PIXI.Graphics(),
        flash: new PIXI.Graphics()
    };

    this.mapName = '';
    this.mapDef = {};
    this.factionMode = false;
    this.perkMode = false;
    this.turkeyMode = false;
    this.snowMode = false;
    this.valentineMode = false;
    this.saintPatrickMode = false;
    this.cincoMode = false;
    this.rainMode = false;
    this.mayMode = false;
    this.beachMode = false;
    this.contactMode = false;
    this.infernoMode = false;
    this.windDir = 0;
    this.transitionTicks = 0.0;
    this.nextAnimation = null;

    this.seed = 0;
    this.width = 0;
    this.height = 0;

    this.terrain = {};
    this.mapData = {
        places: [],
        objects: [],
        groundPatches: []
    };
    this.mapLoaded = false;
    this.mapTexture = null;

    this.m_obstaclePool = new ObjectPool.Pool(Obstacle);
    this.m_buildingPool = new ObjectPool.Pool(Building);
    this.m_structurePool = new ObjectPool.Pool(Structure);
    this.m_npcPool = new ObjectPool.Pool(Npc, { spineData: spineData, spineObjManager: spineObjManager });

    this.deadObstacleIds = [];
    this.deadCeilingIds = [];
    this.solvedPuzzleIds = [];
    this.lootDropSfxIds = [];

    this.terrain = null;
    this.cameraEmitter = null;

    // Anti-cheat
    this.m_cheatDetectFrame = 0;
    this.m_cheatRanDetection = false;
    this.m_cheatDetected = false;
}

m_Map.prototype = {
    m_free: function m_free() {
        // Buildings need to stop sound emitters
        var buildings = this.m_buildingPool.m_getPool();
        for (var i = 0; i < buildings.length; i++) {
            buildings[i].m_free();
        }

        if (this.mapTexture) {
            this.mapTexture.destroy(true);
        }
        this.display.ground.destroy({ children: true });

        if (this.cameraEmitter) {
            this.cameraEmitter.stop();
        }
        this.cameraEmitter = null;
    },

    resize: function resize(pixiRenderer, canvasMode) {
        this.renderMap(pixiRenderer, canvasMode);
    },

    loadMap: function loadMap(mapMsg, camera, canvasMode, particleBarn) {
        this.mapName = mapMsg.mapName;
        // Clone the source mapDef
        var mapDef = MapDefs[this.mapName];
        if (!mapDef) {
            throw new Error('Failed loading mapDef ' + this.mapName);
        }
        this.mapDef = util.cloneDeep(mapDef);
        this.factionMode = !!this.mapDef.gameMode.factionMode;
        this.perkMode = !!this.mapDef.gameMode.perkMode;
        this.turkeyMode = !!this.mapDef.gameMode.turkeyMode;
        this.snowMode = !!this.mapDef.gameMode.snowMode;
        this.valentineMode = !!this.mapDef.gameMode.valentineMode;
        this.saintPatrickMode = !!this.mapDef.gameMode.saintPatrickMode;
        this.cincoMode = !!this.mapDef.gameMode.cincoMode;
        this.mayMode = !!this.mapDef.gameMode.mayMode;
        this.beachMode = !!this.mapDef.gameMode.beachMode;
        this.rainMode = !!this.mapDef.gameMode.rainMode;
        this.contactMode = !!this.mapDef.gameMode.contactMode;
        this.infernoMode = !!this.mapDef.gameMode.infernoMode;

        this.seed = mapMsg.seed;
        this.width = mapMsg.width;
        this.height = mapMsg.height;

        var mapTerrain = mapDef.biome.terrain && mapDef.biome.terrain.terrainRects ? mapDef.biome.terrain.terrainRects : [];
        var mapTerrainPolygons = mapDef.biome.terrain && mapDef.biome.terrain.terrainPolygons ? mapDef.biome.terrain.terrainPolygons : [];

        this.terrain = TerrainGen.generateTerrain(this.width, this.height, mapMsg.shoreInset, mapMsg.grassInset, mapMsg.rivers, this.seed, mapTerrain, mapTerrainPolygons);

        this.mapData = {
            places: mapMsg.places,
            objects: mapMsg.objects,
            groundPatches: mapMsg.groundPatches
        };
        this.mapLoaded = true;

        /* 
            -1.0, -1.0 from right
            0.0, -1.0 from up
            1.0, -1.0 from left
            0.0, 1.0 from down 
        */
        var cameraEmitterType = this.mapDef.biome.particles.camera;
        if (cameraEmitterType) {
            var dir = v2.normalize(v2.create(-1.0, -1.0));
            this.cameraEmitter = particleBarn.addEmitter(cameraEmitterType, {
                pos: v2.create(0.0, 0.0),
                dir: dir,
                layer: 99999
            });
        }

        // Cache the terrain graphics
        this.display.ground.clear();
        this.display.overlay.clear();
        this.display.flash.clear();
        this.renderTerrain(this.display.ground, 2.0 / camera.ppu, canvasMode, false);
        this.display.overlay.beginFill(0x000000);
        this.display.overlay.drawRect(0.0, 0.0, window.innerWidth, window.innerHeight);
        this.display.overlay.endFill();
        this.display.overlay.alpha = 0.2;

        this.display.flash.beginFill(0xffffff);
        this.display.flash.drawRect(0.0, 0.0, window.innerWidth, window.innerHeight);
        this.display.flash.endFill();
        this.display.flash.alpha = 0.0;

        //this.display.overlay.scale.set(2.0 / camera.ppu, 2.0 / camera.ppu);
        if (!this.rainMode) {
            this.display.overlay.alpha = 0;
            this.display.flash.alpha = 0;
        }
    },

    caculateNearestObject: function caculateNearestObject(locations, playerPos, objectPos) {
        var index = -1;
        var lastTotal = void 0;
        var xNew = Math.pow(objectPos.x - playerPos.x, 2);
        var yNew = Math.pow(objectPos.y - playerPos.y, 2);
        var totalNew = Math.sqrt(xNew + yNew);
        for (var k = 0; k < locations.length; k++) {
            var posActual = locations[k];
            var xActual = Math.pow(posActual.x - playerPos.x, 2);
            var yActual = Math.pow(posActual.y - playerPos.y, 2);

            var totalActual = Math.sqrt(xActual + yActual);
            if (totalNew < totalActual) {
                if (index >= 0) {
                    if (totalActual > lastTotal) {
                        index = k;
                        lastTotal = totalActual;
                    }
                } else {
                    index = k;
                    lastTotal = totalActual;
                }
            }
        }
        if (index >= 0) {
            locations[index] = objectPos;
        }
        return locations;
    },

    locationsQuestObstacles: function locationsQuestObstacles(obstacleType, playerPos, numberBeacons) {
        var locations = [];
        var objects = this.m_obstaclePool.m_getPool();
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            if (object.obstacleType == obstacleType) {
                if (locations.length < numberBeacons) locations.push(object.pos);else {
                    locations = this.caculateNearestObject(locations, playerPos, object.pos);
                }
            }
        }
        return locations;
    },

    locationsQuestBuilding: function locationsQuestBuilding(buildingType, playerPos, numberBeacons) {
        var buildings = this.m_buildingPool.m_getPool();
        var locations = [];
        for (var i = 0; i < buildings.length; i++) {
            var object = buildings[i];
            if (object.type == buildingType) {
                if (locations.length < numberBeacons) locations.push(object.pos);else {
                    locations = this.caculateNearestObject(locations, playerPos, object.pos);
                }
            }
        }
        return locations;
    },

    getMapDef: function getMapDef() {
        if (!this.mapLoaded) {
            throw new Error('Map not loaded!');
        }
        return this.mapDef;
    },

    getMapTexture: function getMapTexture() {
        return this.mapTexture;
    },

    m_update: function m_update(dt, activePlayer, playerBarn, particleBarn, audioManager, ambience, renderer, camera, smokeParticles, debug) {
        this.m_mangle = true;
        this.m_mangle1 = true;

        if (this.display.overlay.width != window.innerWidth || this.display.overlay.height != window.innerHeight) {
            this.display.overlay.width = window.innerWidth;
            this.display.overlay.height = window.innerHeight;

            this.display.flash.width = window.innerWidth;
            this.display.flash.height = window.innerHeight;
        }

        var rainDir = activePlayer.m_netData.m_windDir;
        if (rainDir != this.windDir && this.rainMode) {
            var dir = null;
            if (rainDir == 0) {
                this.windDir = rainDir;
                dir = v2.normalize(v2.create(-1.0, -1.0));
                this.nextAnimation = 'falling_rain_fast';
            }
            if (rainDir == 1) {
                this.windDir = rainDir;
                dir = v2.normalize(v2.create(0.0, -1.0));
                this.nextAnimation = 'falling_rain_fast_02';
            }
            if (rainDir == 2) {
                this.windDir = rainDir;
                dir = v2.normalize(v2.create(1.0, -1.0));
                this.nextAnimation = 'falling_rain_fast_03';
            }
            if (rainDir == 3) {
                this.windDir = rainDir;
                dir = v2.normalize(v2.create(0.0, 1.0));
                this.nextAnimation = 'falling_rain_fast_02';
            }
            this.cameraEmitter.dir = dir;
            this.cameraEmitter.type = 'falling_leaf';
            this.transitionTicks = 3.0;
        }

        if (this.rainMode) {
            if (this.transitionTicks > 0) {
                this.transitionTicks -= dt;
            } else if (this.nextAnimation) {
                this.cameraEmitter.type = this.nextAnimation;
            }
        }

        if (this.rainMode) {
            if (activePlayer.m_netData.m_playerIndoors && this.display.overlay.alpha >= 0.0) {
                this.display.overlay.alpha -= 0.05;
            }

            if (!activePlayer.m_netData.m_playerIndoors && this.display.overlay.alpha <= 0.2) {
                this.display.overlay.alpha += 0.05;
            }
            if (activePlayer.m_netData.m_playerIndoors && this.cameraEmitter.type != 'falling_leaf') {
                this.cameraEmitter.type = 'falling_leaf';
            } else if (this.cameraEmitter.type == 'falling_leaf' && !activePlayer.m_netData.m_playerIndoors && this.transitionTicks <= 0) {
                var _dir = null;
                if (rainDir == 0) {
                    this.windDir = rainDir;
                    _dir = v2.normalize(v2.create(-1.0, -1.0));
                    this.cameraEmitter.type = 'falling_rain_fast';
                }
                if (rainDir == 1) {
                    this.windDir = rainDir;
                    _dir = v2.normalize(v2.create(0.0, -1.0));
                    this.cameraEmitter.type = 'falling_rain_fast_02';
                }
                if (rainDir == 2) {
                    this.windDir = rainDir;
                    _dir = v2.normalize(v2.create(1.0, -1.0));
                    this.cameraEmitter.type = 'falling_rain_fast_03';
                }
                if (rainDir == 3) {
                    this.windDir = rainDir;
                    _dir = v2.normalize(v2.create(0.0, 1.0));
                    this.cameraEmitter.type = 'falling_rain_fast_02';
                }
                this.cameraEmitter.dir = _dir;
            }
        }

        var obstacles = this.m_obstaclePool.m_getPool();
        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (!obstacle.active) {
                continue;
            }
            obstacle.m_update(dt, this, playerBarn, particleBarn, audioManager, activePlayer, renderer);
            obstacle.render(camera, debug, activePlayer.layer);
        }

        var npcs = this.m_npcPool.m_getPool();
        for (var _i = 0; _i < npcs.length; _i++) {
            var npc = npcs[_i];
            if (!npc.active) {
                continue;
            }
            npc.m_update(dt, this, playerBarn, particleBarn, audioManager, activePlayer, renderer);
            npc.render(camera, debug, activePlayer.layer);
        }

        var buildings = this.m_buildingPool.m_getPool();
        for (var _i2 = 0; _i2 < buildings.length; _i2++) {
            var building = buildings[_i2];
            if (!building.active) {
                continue;
            }
            building.m_update(dt, this, particleBarn, audioManager, ambience, activePlayer, renderer, camera);
            building.render(camera, debug, activePlayer.layer);
        }

        var structures = this.m_structurePool.m_getPool();
        for (var _i3 = 0; _i3 < structures.length; _i3++) {
            var structure = structures[_i3];
            if (!structure.active) {
                continue;
            }
            structure.update(dt, this, activePlayer, ambience);
            structure.render(camera, debug, activePlayer.layer);
        }

        if (this.cameraEmitter) {
            this.cameraEmitter.pos = v2.copy(camera.pos);
            this.cameraEmitter.enabled = true;

            // Adjust radius and spawn rate based on zoom
            var maxRadius = 120.0;
            var camRadius = activePlayer.m_getZoom() * 2.5;
            this.cameraEmitter.radius = math.min(camRadius, maxRadius);

            var emitterDef = Particles.EmitterDefs['falling_leaf'];
            var radius = this.cameraEmitter.radius;
            var ratio = radius * radius / (maxRadius * maxRadius);
            this.cameraEmitter.rateMult = 1.0 / ratio;

            var alphaTarget = activePlayer.layer == 0 ? 1.0 : 0.0;
            this.cameraEmitter.alpha = math.lerp(dt * 6.0, this.cameraEmitter.alpha, alphaTarget);
        }

        this.m_cheatDetectFrame++;
        if (this.m_cheatDetectFrame % 180 == 0) {
            this.m_cheatRanDetection = true;
            var cheatDetected = 0;
            var detectCheatAlphaFn = mapHelpers.m_validateSpriteAlpha;
            // Verify smoke particle alpha integrity
            for (var _i4 = 0; _i4 < smokeParticles.length; _i4++) {
                var p = smokeParticles[_i4];
                if (p.active && !p.fade && detectCheatAlphaFn(p, mapHelpers.m_kMinSmokeAlpha)) {
                    cheatDetected++;
                }
            }
            // Verify obstacle alpha integrity
            for (var _i5 = 0; _i5 < obstacles.length; _i5++) {
                var _p = obstacles[_i5];
                if (_p.active && !_p.dead && detectCheatAlphaFn(_p, mapHelpers.m_kMinObstacleAlpha)) {
                    cheatDetected++;
                }
            }

            // Verify npcs alpha integrity
            for (var _i6 = 0; _i6 < npcs.length; _i6++) {
                var _p2 = npcs[_i6];
                if (_p2.active && !_p2.dead && detectCheatAlphaFn(_p2, mapHelpers.m_kMinNpcAlpha)) {
                    cheatDetected++;
                }
            }
            if (cheatDetected) {
                this.m_cheatDetected = true;
            }
        }
    },

    renderTerrain: function renderTerrain(groundGfx, gridThickness, canvasMode, mapRender) {
        var width = this.width,
            height = this.height,
            terrain = this.terrain;


        var ll = { x: 0.0, y: 0.0 };
        var lr = { x: width, y: 0.0 };
        var ul = { x: 0.0, y: height };
        var ur = { x: width, y: height };
        var mapWidth = lr.x - ul.x;
        var mapHeight = lr.y - ul.y;
        var mapColors = this.mapDef.biome.colors;
        var groundPatches = this.mapData.groundPatches;
        var terrainTexture = this.mapDef.biome.waterTexture;

        var customMap = this.mapDef.biome && this.mapDef.biome.customMap;

        var waterDecorationColors = [0x387AA2, 0x183F57];
        var waterDecorationSize = [{ w: 0.1, h: 0.1 }, { w: 0.2, h: 0.1 }, { w: 0.1, h: 0.2 }, { w: 0.2, h: 0.2 }];

        // Map exterior
        // Currently the grass is not rendered and is instead just the background
        // clear color showing through. Because of this, we need to explicitly
        // render squares of the background color outside of the map bounds.
        var margin = 120.0;

        groundGfx.beginFill(mapColors.background);
        groundGfx.drawRect(-margin, -margin, width + margin * 2.0, margin);
        groundGfx.drawRect(-margin, height, width + margin * 2.0, margin);
        groundGfx.drawRect(-margin, -margin, margin, height + margin * 2.0);
        groundGfx.drawRect(width, -margin, margin, height + margin * 2.0);
        groundGfx.endFill();

        // Island
        groundGfx.beginFill(mapColors.beach);
        tracePath(groundGfx, terrain.shore);
        tracePath(groundGfx, terrain.grass);

        groundGfx.addHole();
        groundGfx.endFill();

        // As mentioned above, don't explicitly render a grass polygon;
        // there's a hole left where the grass should be, with the background
        // clear color set to the grass color.
        //
        // ... except we have to for canvas mode!
        if (canvasMode) {
            groundGfx.beginFill(mapColors.grass);
            tracePath(groundGfx, terrain.grass);
            groundGfx.endFill();
        }

        // Order 0 ground patches
        for (var i = 0; i < groundPatches.length; i++) {
            var patch = groundPatches[i];
            if (patch.order == 0 && (!mapRender || patch.useAsMapShape)) {
                groundGfx.beginFill(patch.color);
                traceGroundPatch(groundGfx, patch, this.seed);
                groundGfx.endFill();
            }
        }

        // River shore
        groundGfx.beginFill(mapColors.riverbank);
        // groundGfx.lineStyle(2, 0xff0000);
        for (var _i7 = 0; _i7 < terrain.rivers.length; _i7++) {
            tracePath(groundGfx, terrain.rivers[_i7].shorePoly);
        }

        groundGfx.endFill();

        // River water
        groundGfx.beginFill(mapColors.water);

        var waterSplinePoints = [];
        for (var _i8 = 0; _i8 < terrain.rivers.length; _i8++) {
            tracePath(groundGfx, terrain.rivers[_i8].waterPoly);

            if (terrainTexture) {
                var waterRiverPoints = this.generateWaterPoints(terrain.rivers[_i8].spline.points, terrain.rivers[_i8].waterWidth + 10, terrain.rivers[_i8].waterWidth * GameConfig.map.waterPointsDensity, terrain.rivers[_i8].waterPoly);
                waterSplinePoints = waterSplinePoints.concat(waterRiverPoints);
            }
        }
        groundGfx.endFill();

        if (terrainTexture) {

            for (var _i9 = 0; _i9 < waterSplinePoints.length; _i9++) {

                var randomColor = waterDecorationColors[util.randomInt(0, waterDecorationColors.length - 1)];
                var decorationSize = waterDecorationSize[util.randomInt(0, waterDecorationSize.length - 1)];

                groundGfx.beginFill(randomColor);
                groundGfx.drawRect(waterSplinePoints[_i9].x, waterSplinePoints[_i9].y, decorationSize.w, decorationSize.h);
                groundGfx.endFill();
            }
        }

        groundGfx.beginFill(0xff0000);
        groundGfx.drawRect(0, 0, 2.0, 2.0);
        groundGfx.endFill();

        // Water
        groundGfx.beginFill(mapColors.water);
        groundGfx.moveTo(ul.x, ul.y);
        //waterLines.lineTo(ur.x, ur.y);
        groundGfx.lineTo(ur.x, ur.y);
        groundGfx.lineTo(lr.x, lr.y);
        groundGfx.lineTo(ll.x, ll.y);
        tracePath(groundGfx, terrain.shore);
        groundGfx.addHole();
        groundGfx.closePath();
        groundGfx.endFill();

        if (terrainTexture) {
            var waterPoints = this.generateOceanPoints(GameConfig.map.oceanPoints);

            for (var _i10 = 0; _i10 < waterPoints.length; _i10++) {
                var _randomColor = waterDecorationColors[util.randomInt(0, waterDecorationColors.length - 1)];
                var _decorationSize = waterDecorationSize[util.randomInt(0, waterDecorationSize.length - 1)];

                groundGfx.beginFill(_randomColor);
                groundGfx.drawRect(waterPoints[_i10].x, waterPoints[_i10].y, _decorationSize.w, _decorationSize.h);
                groundGfx.endFill();
            }
        }

        if (customMap) {
            var terrainGrassPatches = terrain.terrainPatches;
            for (var _i11 = terrainGrassPatches.length - 1; _i11 >= 0; _i11--) {
                var _patch = terrainGrassPatches[_i11];
                if (_patch) {
                    groundGfx.beginFill(_patch.color);
                    //traceTerrainPatch(groundGfx,patch);
                    traceGroundPatch(groundGfx, _patch.aabb, this.seed);
                    //traceGroundPatch(groundGfx, patch, this.seed);
                    groundGfx.endFill();
                }
            }

            var mapTerrainPolygons = terrain.terrainPatchesPolygons;
            for (var _i12 = mapTerrainPolygons.length - 1; _i12 >= 0; _i12--) {
                var _patch2 = mapTerrainPolygons[_i12];

                if (_patch2) {
                    groundGfx.beginFill(_patch2.color);
                    tracePath(groundGfx, _patch2.points);
                    groundGfx.endFill();

                    if (_patch2.textureType && _patch2.textureType == "grass") {
                        var terrainTextureDensity = _patch2.density || GameConfig.map.grassPoints;

                        var grassRandomPoints = this.generateGrassPoints(terrainTextureDensity, _patch2.polygonBox, _patch2.points);
                        var grassPointsCount = Math.floor(grassRandomPoints.length / 2);
                        for (var _i13 = 0; _i13 < grassPointsCount; _i13++) {
                            var position = 0.1;
                            var size = 0.1;

                            //  let point = util.randomPointInAabb();
                            groundGfx.beginFill(0x1B6B58);
                            groundGfx.drawRect(grassRandomPoints[_i13].x, grassRandomPoints[_i13].y, size, size);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x1B6B58);
                            groundGfx.drawRect(grassRandomPoints[_i13].x, grassRandomPoints[_i13].y - position, size, size);
                            groundGfx.endFill();

                            position += size;
                            groundGfx.beginFill(0x195B53);
                            groundGfx.drawRect(grassRandomPoints[_i13].x, grassRandomPoints[_i13].y - position, size, size);
                            groundGfx.endFill();

                            position += size;
                            groundGfx.beginFill(0x042C24);
                            groundGfx.drawRect(grassRandomPoints[_i13].x, grassRandomPoints[_i13].y - position, size, size);
                            groundGfx.endFill();

                            position -= size;
                            groundGfx.beginFill(0x021D17);
                            groundGfx.drawRect(grassRandomPoints[_i13].x + size, grassRandomPoints[_i13].y - position, size, size);
                            groundGfx.endFill();

                            position -= size;
                            groundGfx.beginFill(0x021D17);
                            groundGfx.drawRect(grassRandomPoints[_i13].x + size * 2, grassRandomPoints[_i13].y - position, size, size);
                            groundGfx.endFill();
                        }

                        for (var j = grassPointsCount + 1; j < grassRandomPoints.length; j++) {
                            var _position = 0.1;
                            var _size = 0.1;

                            groundGfx.beginFill(0x063129);
                            groundGfx.drawRect(grassRandomPoints[j].x, grassRandomPoints[j].y, _size, _size);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x042C24);
                            groundGfx.drawRect(grassRandomPoints[j].x, grassRandomPoints[j].y - _position, _size, _size);
                            groundGfx.endFill();

                            _position += _size;
                            groundGfx.beginFill(0x032826);
                            groundGfx.drawRect(grassRandomPoints[j].x, grassRandomPoints[j].y - _position, _size, _size);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x021D17);
                            groundGfx.drawRect(grassRandomPoints[j].x + _size, grassRandomPoints[j].y - _position, _size, _size);
                            groundGfx.endFill();

                            _position -= _size;
                            groundGfx.beginFill(0x021D17);
                            groundGfx.drawRect(grassRandomPoints[j].x + _size * 2, grassRandomPoints[j].y - _position, _size, _size);
                            groundGfx.endFill();
                        }
                    } else if (_patch2.textureType && _patch2.textureType == "artic") {

                        var _terrainTextureDensity = _patch2.density || GameConfig.map.grassPoints;

                        var _grassRandomPoints = this.generateGrassPoints(_terrainTextureDensity, _patch2.polygonBox, _patch2.points);
                        var _grassPointsCount = Math.floor(_grassRandomPoints.length / 2);

                        for (var _i14 = 0; _i14 < _grassPointsCount; _i14++) {
                            var _position2 = 0.1;
                            var _size2 = 0.1;

                            //  let point = util.randomPointInAabb();
                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x, _grassRandomPoints[_i14].y, _size2, _size2);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x96A2D9);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x + _position2, _grassRandomPoints[_i14].y, _size2, _size2);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x + _position2, _grassRandomPoints[_i14].y + _position2, _size2, _size2);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x + _position2 * 2, _grassRandomPoints[_i14].y + _position2, _size2, _size2);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x + _position2 * 3, _grassRandomPoints[_i14].y + _position2, _size2, _size2);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x + _position2 * 4, _grassRandomPoints[_i14].y, _size2, _size2);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_i14].x + _position2 * 5, _grassRandomPoints[_i14].y, _size2, _size2);
                            groundGfx.endFill();
                        }

                        for (var _j = _grassPointsCount + 1; _j < _grassRandomPoints.length; _j++) {
                            var _position3 = 0.1;
                            var _size3 = 0.1;

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_j].x, _grassRandomPoints[_j].y, _size3, _size3);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_j].x + _position3, _grassRandomPoints[_j].y, _size3, _size3);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x96A2D9);
                            groundGfx.drawRect(_grassRandomPoints[_j].x + _position3 * 2, _grassRandomPoints[_j].y, _size3, _size3);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x96A2D9);
                            groundGfx.drawRect(_grassRandomPoints[_j].x + _position3 * 3, _grassRandomPoints[_j].y, _size3, _size3);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_j].x + _position3 * 3, _grassRandomPoints[_j].y + _position3, _size3, _size3);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_j].x + _position3 * 4, _grassRandomPoints[_j].y + _position3, _size3, _size3);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x6976B5);
                            groundGfx.drawRect(_grassRandomPoints[_j].x + _position3 * 5, _grassRandomPoints[_j].y, _size3, _size3);
                            groundGfx.endFill();
                        }
                    } else if (_patch2.textureType && _patch2.textureType == "desert") {

                        var _terrainTextureDensity2 = _patch2.density || GameConfig.map.grassPoints;

                        var _grassRandomPoints2 = this.generateGrassPoints(_terrainTextureDensity2, _patch2.polygonBox, _patch2.points);
                        var _grassPointsCount2 = Math.floor(_grassRandomPoints2.length / 2);

                        for (var _i15 = 0; _i15 < _grassPointsCount2; _i15++) {
                            var _position4 = 0.1;
                            var _size4 = 0.1;

                            //  let point = util.randomPointInAabb();
                            groundGfx.beginFill(0x9E7662);
                            groundGfx.drawRect(_grassRandomPoints2[_i15].x, _grassRandomPoints2[_i15].y, _size4 * 2, _size4);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x9E7662);
                            groundGfx.drawRect(_grassRandomPoints2[_i15].x + _position4 * 2, _grassRandomPoints2[_i15].y - _position4, _size4 * 2, _size4);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x7A5440);
                            groundGfx.drawRect(_grassRandomPoints2[_i15].x + _position4 * 3, _grassRandomPoints2[_i15].y, _size4 * 2, _size4);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x9E7662);
                            groundGfx.drawRect(_grassRandomPoints2[_i15].x + _position4 * 5, _grassRandomPoints2[_i15].y, _size4, _size4);
                            groundGfx.endFill();
                        }

                        for (var _j2 = _grassPointsCount2 + 1; _j2 < _grassRandomPoints2.length; _j2++) {
                            var _position5 = 0.1;
                            var _size5 = 0.1;

                            groundGfx.beginFill(0x9E7662);
                            groundGfx.drawRect(_grassRandomPoints2[_j2].x, _grassRandomPoints2[_j2].y, _size5, _size5);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x9E7662);
                            groundGfx.drawRect(_grassRandomPoints2[_j2].x + _position5, _grassRandomPoints2[_j2].y + _position5, _size5 * 2, _size5);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x9E7662);
                            groundGfx.drawRect(_grassRandomPoints2[_j2].x + _position5 * 4, _grassRandomPoints2[_j2].y, _size5 * 2, _size5);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x7A5440);
                            groundGfx.drawRect(_grassRandomPoints2[_j2].x + _position5 * 2, _grassRandomPoints2[_j2].y - _position5, _size5 * 2, _size5);
                            groundGfx.endFill();
                        }
                    } else if (_patch2.textureType && _patch2.textureType == "rocks") {

                        var _terrainTextureDensity3 = _patch2.density || GameConfig.map.grassPoints;

                        var _grassRandomPoints3 = this.generateGrassPoints(_terrainTextureDensity3, _patch2.polygonBox, _patch2.points);
                        var _grassPointsCount3 = Math.floor(_grassRandomPoints3.length / 2);

                        for (var _i16 = 0; _i16 < _grassPointsCount3; _i16++) {
                            var _position6 = 0.1;
                            var _size6 = 0.1;

                            //  let point = util.randomPointInAabb();
                            groundGfx.beginFill(0xADABA5);
                            groundGfx.drawRect(_grassRandomPoints3[_i16].x, _grassRandomPoints3[_i16].y, _size6 * 3, _size6);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x605F5C);
                            groundGfx.drawRect(_grassRandomPoints3[_i16].x, _grassRandomPoints3[_i16].y - _position6, _size6, _size6);
                            groundGfx.endFill();

                            groundGfx.beginFill(0xADABA5);
                            groundGfx.drawRect(_grassRandomPoints3[_i16].x + _position6, _grassRandomPoints3[_i16].y - _position6, _size6 * 3, _size6);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x605F5C);
                            groundGfx.drawRect(_grassRandomPoints3[_i16].x + _position6, _grassRandomPoints3[_i16].y - _position6 * 2, _size6 * 3, _size6);
                            groundGfx.endFill();
                        }

                        for (var _j3 = _grassPointsCount3 + 1; _j3 < _grassRandomPoints3.length; _j3++) {
                            var _position7 = 0.1;
                            var _size7 = 0.1;

                            //  let point = util.randomPointInAabb();
                            groundGfx.beginFill(0xADABA5);
                            groundGfx.drawRect(_grassRandomPoints3[_j3].x + _position7, _grassRandomPoints3[_j3].y, _size7 * 3, _size7);
                            groundGfx.endFill();

                            groundGfx.beginFill(0xADABA5);
                            groundGfx.drawRect(_grassRandomPoints3[_j3].x, _grassRandomPoints3[_j3].y - _position7, _size7 * 4, _size7);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x605F5C);
                            groundGfx.drawRect(_grassRandomPoints3[_j3].x + _position7 * 4, _grassRandomPoints3[_j3].y - _position7, _size7, _size7);
                            groundGfx.endFill();

                            groundGfx.beginFill(0xADABA5);
                            groundGfx.drawRect(_grassRandomPoints3[_j3].x, _grassRandomPoints3[_j3].y - _position7 * 2, _size7 * 3, _size7);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x605F5C);
                            groundGfx.drawRect(_grassRandomPoints3[_j3].x + _position7 * 3, _grassRandomPoints3[_j3].y - _position7 * 2, _size7, _size7);
                            groundGfx.endFill();

                            groundGfx.beginFill(0x605F5C);
                            groundGfx.drawRect(_grassRandomPoints3[_j3].x, _grassRandomPoints3[_j3].y - _position7 * 3, _size7 * 3, _size7);
                            groundGfx.endFill();
                        }
                    }

                    /*  else if(patch.textureType && patch.textureType == "desert") {
                          let terrainTextureDensity = patch.density || GameConfig.map.grassPoints;     
                          let grassRandomPoints = this.generateGrassPoints(terrainTextureDensity, patch.polygonBox, patch.points);
                         let grassPointsCount = Math.floor(grassRandomPoints.length/2);
                          for (let i = 0; i < grassPointsCount; i++) {
                             let position = 0.1;
                             let size = 0.1;
                                 
                         //  let point = util.randomPointInAabb();
                             groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y, size, size);
                             groundGfx.endFill();
                                          groundGfx.beginFill(0x96A2D9);
                             groundGfx.drawRect(grassRandomPoints[i].x + position, grassRandomPoints[i].y, size, size);
                             groundGfx.endFill();
                                          groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[i].x + position, grassRandomPoints[i].y + position, size, size);
                             groundGfx.endFill();
                                          groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[i].x + (position * 2), grassRandomPoints[i].y + position, size, size);
                             groundGfx.endFill();
                                          groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[i].x + (position * 3), grassRandomPoints[i].y + position, size, size);
                             groundGfx.endFill();
                                          groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[i].x + (position * 4), grassRandomPoints[i].y, size, size);
                             groundGfx.endFill();
                              groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[i].x + (position * 5), grassRandomPoints[i].y, size, size);
                             groundGfx.endFill();
                         }
                          for (let j = grassPointsCount + 1 ; j < grassRandomPoints.length; j++) {
                             let position = 0.1;
                             let size = 0.1;
                                 
                             groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[j].x, grassRandomPoints[j].y, size, size);
                             groundGfx.endFill();
                                          groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[j].x + position, grassRandomPoints[j].y, size, size);
                             groundGfx.endFill();                
                                 
                             groundGfx.beginFill(0x96A2D9);
                             groundGfx.drawRect(grassRandomPoints[j].x + (position * 2), grassRandomPoints[j].y, size, size);
                             groundGfx.endFill();
                                              groundGfx.beginFill(0x96A2D9);
                             groundGfx.drawRect(grassRandomPoints[j].x + (position * 3), grassRandomPoints[j].y, size, size);
                             groundGfx.endFill();
                                              groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[j].x + (position * 3), grassRandomPoints[j].y + position, size, size);
                             groundGfx.endFill();
                                              groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[j].x + (position * 4), grassRandomPoints[j].y + position, size, size);
                             groundGfx.endFill();
                              groundGfx.beginFill(0x6976B5);
                             groundGfx.drawRect(grassRandomPoints[j].x + (position * 5), grassRandomPoints[j].y, size, size);
                             groundGfx.endFill();   
                         }
                         
                     } */
                }
            }
        }

        /* if (terrainTexture) {
            let grassRandomPoints = this.generateGrassPoints(GameConfig.map.grassPoints);
            let grassPointsCount = grassRandomPoints.length /2;
             for (let i = 0; i < grassPointsCount; i++) {
                let position = 0.1;
                let size = 0.1;
                    
            //  let point = util.randomPointInAabb();
                groundGfx.beginFill(0x1B6B58);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y, size, size);
                groundGfx.endFill();
                 groundGfx.beginFill(0x1B6B58);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 position += size;
                groundGfx.beginFill(0x195B53);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 position += size;
                groundGfx.beginFill(0x042C24);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 position -= size;
                groundGfx.beginFill(0x021D17);
                groundGfx.drawRect(grassRandomPoints[i].x + size, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 position -= size;
                groundGfx.beginFill(0x021D17);
                groundGfx.drawRect(grassRandomPoints[i].x + (size * 2), grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
            }
              grassPointsCount = grassRandomPoints.length;
            for (let i = grassRandomPoints.length /2 ; i < grassPointsCount; i++) {
                let position = 0.1;
                let size = 0.1;
                    
            //  let point = util.randomPointInAabb();
                groundGfx.beginFill(0x063129);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y, size, size);
                groundGfx.endFill();
                 groundGfx.beginFill(0x042C24);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 position += size;
                groundGfx.beginFill(0x032826);
                groundGfx.drawRect(grassRandomPoints[i].x, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 groundGfx.beginFill(0x021D17);
                groundGfx.drawRect(grassRandomPoints[i].x + size, grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
                 position -= size;
                groundGfx.beginFill(0x021D17);
                groundGfx.drawRect(grassRandomPoints[i].x + (size * 2), grassRandomPoints[i].y - position, size, size);
                groundGfx.endFill();
            }
        } */

        // Grid
        var gridGfx = groundGfx;
        gridGfx.lineStyle(gridThickness, 0x000000, 0.15);
        for (var x = 0; x <= width; x += GameConfig.map.gridSize) {
            var pt0 = { x: x, y: 0.0 };
            var pt1 = { x: x, y: height };
            drawLine(gridGfx, pt0, pt1);
        }
        for (var y = 0; y <= height; y += GameConfig.map.gridSize) {
            var _pt = { x: 0.0, y: y };
            var _pt2 = { x: width, y: y };
            drawLine(gridGfx, _pt, _pt2);
        }
        gridGfx.lineStyle(gridThickness, 0x000000, 0.0);

        // Order 1 ground patches
        for (var _i17 = 0; _i17 < groundPatches.length; _i17++) {
            var _patch3 = groundPatches[_i17];
            if (_patch3.order == 1 && (!mapRender || _patch3.useAsMapShape)) {
                groundGfx.beginFill(_patch3.color);
                traceGroundPatch(groundGfx, _patch3, this.seed);
                groundGfx.endFill();
            }
        }
    },

    /**
     * Generate water spawn point for decoration
     * @param waterSplinePoints list of spline points
     * @param rad range to locate decoration
     */
    generateWaterPoints: function generateWaterPoints(waterSplinePoints, rad, count, waterPoly) {

        var randomPoints = [];

        for (var i = 0; i < waterSplinePoints.length; i++) {

            var pointsCount = 0;
            var pointsTries = 0;
            var maxTries = count * 2;
            while (pointsCount < count && pointsTries < maxTries) {

                var alpha = 2 * Math.PI * Math.random();
                var r = rad * Math.sqrt(Math.random());
                var x = r * Math.cos(alpha) + waterSplinePoints[i].x;
                var y = r * Math.sin(alpha) + waterSplinePoints[i].y;
                var pos = v2.create(x, y);

                if (math.pointInsidePolygon(pos, waterPoly)) {
                    randomPoints.push(pos);
                    pointsCount++;
                }
                pointsTries++;
            }
        }

        return randomPoints;
    },

    /**
    * Generate ocean spawn point for decoration
    */
    generateOceanPoints: function generateOceanPoints(oceanPoints) {

        var randomPoints = [];

        //Down 
        for (var i = 0; i < oceanPoints; i++) {

            var x = util.randomInt(0, 720);
            var y = util.randomInt(0, 50);
            var pos = v2.create(x, y);

            if (this.isInOcean(pos)) {
                randomPoints.push(pos);
            }
        }

        //Up
        for (var _i18 = 0; _i18 < oceanPoints; _i18++) {

            var _x = util.randomInt(0, 720);
            var _y = util.randomInt(670, 720);
            var _pos = v2.create(_x, _y);

            if (this.isInOcean(_pos)) {
                randomPoints.push(_pos);
            }
        }

        //Left
        for (var _i19 = 0; _i19 < oceanPoints; _i19++) {

            var _x2 = util.randomInt(0, 50);
            var _y2 = util.randomInt(50, 670);
            var _pos2 = v2.create(_x2, _y2);

            if (this.isInOcean(_pos2)) {
                randomPoints.push(_pos2);
            }
        }

        //Right
        for (var _i20 = 0; _i20 < oceanPoints; _i20++) {

            var _x3 = util.randomInt(670, 720);
            var _y3 = util.randomInt(50, 670);
            var _pos3 = v2.create(_x3, _y3);

            if (this.isInOcean(_pos3)) {
                randomPoints.push(_pos3);
            }
        }

        return randomPoints;
    },


    /**
    * Generate ocean spawn point for decoration
    */
    generateGrassPoints: function generateGrassPoints(grassPoints, grassAabb, terrainPoly) {

        var randomPoints = [];

        var pointsCount = 0;
        var pointsTries = 0;
        var maxTries = grassPoints * 2;
        while (pointsCount < grassPoints && pointsTries < maxTries) {

            var point = util.randomPointInAabb(grassAabb);

            if (math.pointInsidePolygon(point, terrainPoly)) {
                randomPoints.push(point);
                pointsCount++;
            }
            pointsTries++;
        }

        return randomPoints;
    },
    insideRiver: function insideRiver(pos) {
        var riverIdx = -1;
        for (var i = 0; i < this.terrain.rivers.length; i++) {
            var river = this.terrain.rivers[i];
            var aabb = river.aabb;
            if (coldet.testPointAabb(pos, aabb.min, aabb.max) && math.pointInsidePolygon(pos, river.waterPoly)) {
                riverIdx = i;
                break;
            }
        }
        return riverIdx;
    },


    render: function render(camera) {
        // Terrain
        // Fairly robust way to get translation and scale from the camera ...
        var p0 = camera.pointToScreen(v2.create(0.0, 0.0));
        var p1 = camera.pointToScreen(v2.create(1.0, 1.0));
        var s = v2.sub(p1, p0);
        // Translate and scale the map polygons to move the with camera
        this.display.ground.position.set(p0.x, p0.y);
        this.display.ground.scale.set(s.x, s.y);
    },

    getMinimapRender: function getMinimapRender(obj) {

        var def = MapObjectDefs[obj.type];
        var zIdx = def.type == 'building' ? 750 + (def.zIdx || 0) : def.img.zIdx || 0;
        var shapes = [];
        if (def.map.shapes !== undefined) {
            shapes = def.map.shapes;
        } else {
            var col = null;
            if (def.type == 'obstacle' || def.type == 'npc') {
                col = def.collision;
            } else if (def.ceiling.zoomRegions.length > 0 && def.ceiling.zoomRegions[0].zoomIn) {
                col = def.ceiling.zoomRegions[0].zoomIn;
            } else {
                col = mapHelpers.getBoundingCollider(obj.type);
            }
            if (col) {
                shapes.push({
                    collider: collider.copy(col),
                    scale: def.map.scale || 1.0,
                    color: def.map.color
                });
            }
        }
        return { obj: obj, zIdx: zIdx, shapes: shapes };
    },

    renderMap: function renderMap(renderer, canvasMode) {
        if (!this.mapLoaded) {
            return;
        }

        var mapRender = new PIXI.Container();
        var txtRender = new PIXI.Container();

        var mapColors = this.mapDef.biome.colors;
        var places = this.mapData.places;
        var objects = this.mapData.objects;

        var screenScale = device.screenHeight;
        if (device.mobile) {
            if (!device.isLandscape) {
                screenScale = device.screenWidth;
            }
            screenScale *= math.min(device.pixelRatio, 2.0);
        }
        var scale = this.height / screenScale;

        // Background


        var background = new PIXI.Graphics();
        background.beginFill(mapColors.grass);
        background.drawRect(0.0, 0.0, this.width, this.height);
        background.endFill();

        this.renderTerrain(background, scale, canvasMode, true);

        // Border for extra spiffiness
        var ll = { x: 0.0, y: 0.0 };
        var lr = { x: this.width, y: 0.0 };
        var ul = { x: 0.0, y: this.height };
        var ur = { x: this.width, y: this.height };

        background.lineStyle(2.0 * scale, 0x000000, 1.0);
        drawLine(background, ll, ul);
        drawLine(background, ul, ur);
        drawLine(background, ur, lr);
        drawLine(background, lr, ll);
        background.position.y = this.height;
        background.scale.y = -1.0;

        mapRender.addChild(background);

        // Render minimap objects, sorted by zIdx
        var minimapRenders = [];
        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            minimapRenders.push(this.getMinimapRender(obj));
        }

        minimapRenders.sort(function (a, b) {
            return a.zIdx - b.zIdx;
        });

        var gfx = new PIXI.Graphics();
        for (var _i21 = 0; _i21 < minimapRenders.length; _i21++) {
            var render = minimapRenders[_i21];
            var _obj = render.obj;

            for (var j = 0; j < render.shapes.length; j++) {
                var shape = render.shapes[j];
                var col = collider.transform(shape.collider, _obj.pos, math.oriToRad(_obj.ori || 0), _obj.scale || 1);
                var _scale = shape.scale !== undefined ? shape.scale : 1.0;

                gfx.beginFill(shape.color, 1.0);
                switch (col.type) {
                    case collider.Type.Circle:
                        {
                            gfx.drawCircle(col.pos.x, this.height - col.pos.y, col.rad * _scale);
                            break;
                        }
                    case collider.Type.Aabb:
                        {
                            var e = v2.mul(v2.sub(col.max, col.min), 0.5);
                            var c = v2.add(col.min, e);
                            e = v2.mul(e, _scale);
                            gfx.drawRect(c.x - e.x, this.height - c.y - e.y, e.x * 2.0, e.y * 2.0);
                            break;
                        }
                    default:
                        break;
                }
                gfx.endFill();
            }
        }
        mapRender.addChild(gfx);

        // Place names
        var nameContainer = new PIXI.Container();
        for (var _i22 = 0; _i22 < places.length; _i22++) {
            var place = places[_i22];
            var style = new PIXI.TextStyle({
                fontFamily: 'Amiga Forever',
                fontSize: device.mobile ? 14.0 : 16.0,
                fontWeight: 'bold',
                fill: ['#ffffff'], // gradient
                stroke: '#000000',
                strokeThickness: 1.0,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 1.0,
                dropShadowAngle: Math.PI / 3.0,
                dropShadowDistance: 1.0,
                wordWrap: false,
                align: 'center'
            });
            var richText = new PIXI.Text(place.name, style);
            richText.anchor.set(0.5, 0.5);
            richText.x = place.pos.x * this.height / scale;
            richText.y = place.pos.y * this.height / scale;
            richText.alpha = 0.75;
            nameContainer.addChild(richText);
        }
        txtRender.addChild(nameContainer);

        // Generate and/or update the texture
        if (!this.mapTexture) {
            this.mapTexture = PIXI.RenderTexture.create(screenScale, screenScale, PIXI.SCALE_MODES.LINEAR, 1.0);
        } else {
            this.mapTexture.resize(screenScale, screenScale);
        }

        mapRender.scale = new PIXI.Point(screenScale / this.height, screenScale / this.height);
        renderer.render(mapRender, this.mapTexture, true);
        renderer.render(txtRender, this.mapTexture, false);
        mapRender.destroy({ children: true, texture: true, baseTexture: true });
        txtRender.destroy({ children: true, texture: true, baseTexture: true });
    },

    getGroundSurface: function getGroundSurface(pos, layer) {
        var _this = this;

        var groundSurface = function groundSurface(type, data) {
            data = data || {};
            if (type == 'water') {
                var mapColors = _this.getMapDef().biome.colors;
                data.waterColor = data.waterColor !== undefined ? data.waterColor : mapColors.water;
                data.rippleColor = data.rippleColor !== undefined ? data.rippleColor : mapColors.waterRipple;
            }
            return { type: type, data: data };
        };

        // Check decals
        var decals = this.decalBarn.m_decalPool.m_getPool();
        for (var i = 0; i < decals.length; i++) {
            var decal = decals[i];
            if (!decal.active || !decal.surface) {
                continue;
            }

            if (util.sameLayer(decal.layer, layer) && collider.intersectCircle(decal.collider, pos, 0.0001)) {
                return groundSurface(decal.surface.type, decal.surface.data);
            }
        }

        // Check buildings
        var surface = null;
        var zIdx = 0;
        var onStairs = layer & 0x2;
        var buildings = this.m_buildingPool.m_getPool();
        for (var _i23 = 0; _i23 < buildings.length; _i23++) {
            var building = buildings[_i23];
            if (!building.active || building.zIdx < zIdx) {
                continue;
            }
            // Prioritize layer0 building surfaces when on stairs
            if (building.layer != layer && !onStairs || building.layer == 1 && onStairs) {
                continue;
            }
            for (var j = 0; j < building.surfaces.length; j++) {
                var s = building.surfaces[j];
                for (var k = 0; k < s.colliders.length; k++) {
                    var res = collider.intersectCircle(s.colliders[k], pos, 0.0001);
                    if (res) {
                        zIdx = building.zIdx;
                        surface = s;
                        break;
                    }
                }
            }
        }
        if (surface) {
            return groundSurface(surface.type, surface.data);
        }

        var terrainGrassPatches = this.terrain.terrainPatches;
        var terrainGrassPatchesPolygons = this.terrain.terrainPatchesPolygons;

        for (var _i24 = 0; _i24 < terrainGrassPatches.length; _i24++) {
            var terrainPatch = terrainGrassPatches[_i24];
            if (coldet.testPointAabb(pos, terrainPatch.aabb.min, terrainPatch.aabb.max)) {
                return terrainPatch.type;
            }
        }

        for (var _i25 = 0; _i25 < terrainGrassPatchesPolygons.length; _i25++) {
            var _terrainPatch = terrainGrassPatchesPolygons[_i25];
            if (_terrainPatch && math.pointInsidePolygon(pos, _terrainPatch.points)) {
                return _terrainPatch.type;
            }
        }

        // Check rivers
        var onRiverShore = false;
        if (layer != 1) {
            var rivers = this.terrain.rivers;
            for (var _i26 = 0; _i26 < rivers.length; _i26++) {
                var river = rivers[_i26];
                if (coldet.testPointAabb(pos, river.aabb.min, river.aabb.max) && math.pointInsidePolygon(pos, river.shorePoly)) {
                    onRiverShore = true;
                    if (math.pointInsidePolygon(pos, river.waterPoly)) {
                        return groundSurface('water', { river: river });
                    }
                }
            }
        }

        // Check terrain
        if (math.pointInsidePolygon(pos, this.terrain.grass)) {
            // Use a stone step sound if we're in the main-spring def
            return groundSurface(onRiverShore ? this.mapDef.biome.sound.riverShore : 'grass');
        } else if (math.pointInsidePolygon(pos, this.terrain.shore)) {
            return groundSurface('sand');
        } else {
            return groundSurface('water');
        }
    },

    isInOcean: function isInOcean(pos) {
        return !math.pointInsidePolygon(pos, this.terrain.shore);
    },

    distanceToShore: function distanceToShore(pos) {
        return math.distToPolygon(pos, this.terrain.shore);
    },

    insideStructureStairs: function insideStructureStairs(collision) {
        var structures = this.m_structurePool.m_getPool();
        for (var i = 0; i < structures.length; i++) {
            var structure = structures[i];
            if (!structure.active) {
                continue;
            }
            if (structure.insideStairs(collision)) {
                return true;
            }
        }
        return false;
    },

    getBuildingById: function getBuildingById(objId) {
        var buildings = this.m_buildingPool.m_getPool();
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (building.active && building.__id == objId) {
                return building;
            }
        }
        return null;
    },

    insideStructureMask: function insideStructureMask(collision) {
        var structures = this.m_structurePool.m_getPool();
        for (var i = 0; i < structures.length; i++) {
            var structure = structures[i];
            if (!structure.active) {
                continue;
            }
            if (structure.insideMask(collision)) {
                return true;
            }
        }
        return false;
    },

    insideBuildingCeiling: function insideBuildingCeiling(collision, checkVisible) {
        var buildings = this.m_buildingPool.m_getPool();
        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (!building.active) {
                continue;
            }
            if (checkVisible && (building.ceiling.visionTicker <= 0.0 || building.ceilingDead)) {
                continue;
            }
            if (building.isInsideCeiling(collision)) {
                return true;
            }
        }
        return false;
    }
};

module.exports = {
    m_Map: m_Map
};
