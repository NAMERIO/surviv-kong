"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require("./0e566746.js");
var PIXI = require("./8b1dfb45.js");
var device = require("./device.js");
var FirebaseManager = require("./FirebaseManager.js");

var MapDefs = require("./mapDefs.js");
var SoundDefs = require("./soundDefs.js");

var spritesheetDefs = {
    'low': require("./aaf70d05.js"),
    'high': require("./6e13f3b7.js")
};

var heroJSON = require("./heroJSON.js");
var heroAtlas = require("./heroAtlas.js").atlas;
var heroFXJSON = require("./heroFXJSON.js");
var heroFXAtlas = require("./heroFXAtlas.js").atlas;
var projectilesJSON = require("./projectilesJSON.js");
var projectilesAtlas = require("./projectilesAtlas.js").atlas;

//Npcs spine
var esSkeletoJSON = require("./esSkeletoJSON.js");
var esSkeletoAtlas = require("./esSkeletoAtlas.js").atlas;
var orcJSON = require("./orcJSON.js");
var orcAtlas = require("./orcAtlas.js").atlas;
var ghostElfJSON = require("./ghostElfJSON.js");
var ghostElfAtlas = require("./ghostElfAtlas.js").atlas;

//
// Helpers
//
function loadTexture(renderer, url) {
    var tex = PIXI.Texture.fromImage(url, undefined, undefined, 1.0);
    var baseTex = tex.baseTexture;

    var loadAttempts = 0;
    if (!baseTex.hasLoaded) {
        baseTex.on('loaded', function (baseTex) {
            console.log('Loaded texture', url);
            renderer.plugins.prepare.upload(baseTex);
        });

        baseTex.on('error', function (baseTex) {
            console.log('BaseTex load error, retrying', url);
            if (loadAttempts++ <= 3) {
                setTimeout(function () {
                    if (baseTex.source) {
                        baseTex.updateSourceImage('');
                        baseTex.updateSourceImage(url.substring(5, url.length));
                    }
                }, (loadAttempts - 1) * 1000);
            }
        });
    }

    return baseTex;
}

function loadSpritesheet(renderer, data) {
    var baseTex = loadTexture(renderer, 'assets/' + data.meta.image);

    var sheet = new PIXI.Spritesheet(baseTex, data);
    sheet.resolution = baseTex.resolution;
    sheet.parse(function () {});

    return sheet;
}

function selectTextureRes(renderer, config) {
    var minDim = Math.min(window.screen.width, window.screen.height);
    var maxDim = Math.max(window.screen.width, window.screen.height);
    minDim *= window.devicePixelRatio;
    maxDim *= window.devicePixelRatio;
    //let smallScreen = maxDim < 1366 && minDim < 768;

    var textureRes = 'high'; /*config.get('highResTex') ? 'high' : 'low';*/

    /*if (smallScreen ||
        (device.mobile && !device.tablet) ||
        renderer.type == PIXI.RENDERER_TYPE.CANVAS) {
        textureRes = 'low';
    }
     if (renderer.type == PIXI.RENDERER_TYPE.WEBGL) {
        let gl = renderer.gl;
        let maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTextureSize < 4096) {
            textureRes = 'low';
        }
    }*/

    console.log('TextureRes', textureRes, 'screenDims', window.screen.width, window.screen.height);

    return textureRes;
}

//
// ResourceManager
//

var ResourceManager = function () {
    function ResourceManager(renderer, audioManager, config) {
        (0, _classCallCheck3.default)(this, ResourceManager);

        this.renderer = renderer;
        this.audioManager = audioManager;
        this.config = config;

        this.textureRes = selectTextureRes(this.renderer, this.config);
        this.atlases = {};

        this.loadTicker = 0.0;
        this.loaded = false;

        this.spineData = {};
        renderer.plugins.prepare.limiter.maxItemsPerFrame = 1;
    }

    // Textures


    (0, _createClass3.default)(ResourceManager, [{
        key: 'isAtlasLoaded',
        value: function isAtlasLoaded(name) {
            return this.atlases[name] && this.atlases[name].loaded;
        }
    }, {
        key: 'atlasTexturesLoaded',
        value: function atlasTexturesLoaded(name) {
            if (!this.isAtlasLoaded(name)) {
                return false;
            }

            var atlas = this.atlases[name];
            for (var i = 0; i < atlas.spritesheets.length; i++) {
                var spritesheet = atlas.spritesheets[i];
                if (!spritesheet.baseTexture || !spritesheet.baseTexture.hasLoaded) {
                    return false;
                }
            }

            return true;
        }
    }, {
        key: 'loadAtlas',
        value: function loadAtlas(name) {
            if (this.isAtlasLoaded(name)) {
                return;
            }

            console.log('Load atlas', name);

            this.atlases[name] = this.atlases[name] || {
                loaded: false,
                spritesheets: []
            };

            var atlasDefs = spritesheetDefs[this.textureRes] || spritesheetDefs['low'];
            var atlasDef = atlasDefs[name];
            for (var i = 0; i < atlasDef.length; i++) {
                var atlas = loadSpritesheet(this.renderer, atlasDef[i]);
                this.atlases[name].spritesheets.push(atlas);
            }
            this.atlases[name].loaded = true;
        }
    }, {
        key: 'unloadAtlas',
        value: function unloadAtlas(name) {
            if (!this.isAtlasLoaded(name)) {
                return;
            }

            console.log('Unload atlas', name);

            var atlas = this.atlases[name];
            for (var i = 0; i < atlas.spritesheets.length; i++) {
                atlas.spritesheets[i].destroy(true);
            }
            atlas.loaded = false;
            atlas.spritesheets = [];
        }
    }, {
        key: 'getSpineAssets',
        value: function getSpineAssets(asset) {
            switch (asset) {
                case 'hero':
                    return { json: heroJSON, atlas: heroAtlas };
                case 'hero_fx':
                    return { json: heroFXJSON, atlas: heroFXAtlas };
                case 'projectiles':
                    return { json: projectilesJSON, atlas: projectilesAtlas };
                case 'esSkeleto':
                    return { json: esSkeletoJSON, atlas: esSkeletoAtlas };
                case 'orc':
                    return { json: orcJSON, atlas: orcAtlas };
                case 'ghostElf':
                    return { json: ghostElfJSON, atlas: ghostElfAtlas };
                default:
                    break;
            }
        }
    }, {
        key: 'loadSpineAsset',
        value: function loadSpineAsset() {
            var assetName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'hero' | 'hero_fx' | 'projectiles';
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            /*const rawSkeletonData = require(`./../spine/hero.json`);
            //var rawSkeletonData = JSON.parse("$jsondata"); //your skeleton.json file here
            const rawAtlasData = require(`${path}/${assetName}.atlas.js`).atlas;*/

            if (this.spineData[assetName] && !force) return;

            var _getSpineAssets = this.getSpineAssets(assetName),
                json = _getSpineAssets.json,
                atlas = _getSpineAssets.atlas;
            //const rawAtlasData = assetName === 'hero'? heroAtlas: heroFXAtlas;


            var spineAtlas = new PIXI.spine.core.TextureAtlas(atlas, function (line, callback) {
                // pass the image here.
                callback(PIXI.BaseTexture.fromImage(line));
            }); // specify path, image.png will be added automatically

            var spineAtlasLoader = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas);
            var spineJsonParser = new PIXI.spine.core.SkeletonJson(spineAtlasLoader);

            // in case if you want everything scaled up two times
            spineJsonParser.scale = 1.0;

            var spineData = spineJsonParser.readSkeletonData(json);

            this.spineData[assetName] = spineData;
        }
    }, {
        key: 'loadSpineAssets',
        value: function loadSpineAssets() {
            var _this = this;

            var assets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            assets.forEach(function (asset) {
                _this.loadSpineAsset(asset, true);
            });
        }
    }, {
        key: 'getSpineData',
        value: function getSpineData(name) {
            return this.spineData[name];
        }

        // Map

    }, {
        key: 'loadMapAssets',
        value: function loadMapAssets(mapName) {
            var _this2 = this;

            console.log('Load map', mapName);

            var mapDef = MapDefs[mapName];
            if (!mapDef) {
                throw new Error('Failed loading mapDef ' + this.mapName);
            }

            //
            // Textures
            //
            var atlasList = mapDef.assets.atlases;

            // Unload all atlases that aren't in the new list
            var keys = (0, _keys2.default)(this.atlases);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (atlasList.indexOf(key) === -1) {
                    this.unloadAtlas(key);
                }
            }

            // Load all new atlases
            for (var _i = 0; _i < atlasList.length; _i++) {
                var atlas = atlasList[_i];
                if (!this.isAtlasLoaded(atlas)) {
                    this.loadAtlas(atlas);
                }
            }

            //
            // Spine data of map
            //
            var spineList = mapDef.assets.spineData;
            this.loadSpineAssets(spineList);

            //
            // Audio
            //
            // PIXI spritesheets internally defer loading textures if the spritesheet
            // has more than 1000 images as a part of its internal batching process.
            //
            // Because we want images to load before audio, we'll also defer loading
            // audio in a similar fashion.
            setTimeout(function () {
                // Load shared audio
                _this2.audioManager.preloadSounds();

                // Load audio specific to the map
                var soundList = mapDef.assets.audio;
                for (var _i2 = 0; _i2 < soundList.length; _i2++) {
                    var sound = soundList[_i2];

                    // @HACK: Sometimes the channel doesn't correspond to where
                    // the sound is defined in sound-defs.js; this is the case
                    // with "players" sounds. Use an alternate method for looking
                    // up the sound def.
                    var soundsList = SoundDefs.Sounds[sound.channel];
                    if (!soundsList) {
                        var channelDef = SoundDefs.Channels[sound.channel];
                        soundsList = SoundDefs.Sounds[channelDef.list];
                    }

                    var soundDef = soundsList[sound.name];

                    var options = {
                        canCoalesce: soundDef.canCoalesce,
                        channels: soundDef.maxInstances,
                        volume: soundDef.volume
                    };

                    _this2.audioManager.loadSound({
                        name: sound.name,
                        channel: sound.channel,
                        path: soundDef.path,
                        options: options
                    });
                }
            }, 0);
        }
    }, {
        key: 'update',
        value: function update(dt) {
            // Debug
            if (!this.loaded) {
                this.loadTicker += dt;

                var loaded = !this.preloadMap;
                var keys = (0, _keys2.default)(this.atlases);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!this.atlasTexturesLoaded(key)) {
                        loaded = false;
                    }
                }
                if (!this.audioManager.allLoaded()) {
                    loaded = false;
                }

                if (loaded) {
                    console.log('Resource load complete', this.loadTicker.toFixed(2));
                    this.loaded = true;
                }
            }
        }
    }]);
    return ResourceManager;
}();

module.exports = {
    ResourceManager: ResourceManager
};
