"use strict";


var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require("./057e3e87.js");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("./54eaf174.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require("./6813580a.js");

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require("./64a8dc27.js");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require("./0e566746.js");
var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var FirebaseManager = require("./FirebaseManager.js");

//
// Helpers
//
function step(cur, target, rate) {
    var delta = target - cur;
    var step = delta * rate;
    return Math.abs(step) < 0.01 ? delta : step;
}

function createLayerMask() {
    var mask = new PIXI.Graphics();
    mask.position.set(0.0, 0.0);
    mask.scale.set(1.0, 1.0);
    mask.__zOrd = 0;
    mask.__zIdx = 0;
    return mask;
}

function drawRect(gfx, x, y, w, h) {
    gfx.moveTo(x, y);
    gfx.lineTo(x, y + h);
    gfx.lineTo(x + w, y + h);
    gfx.lineTo(x + w, y);
    gfx.lineTo(x, y);
    gfx.closePath();
}

//
// RenderGroup
//

var RenderGroup = function (_PIXI$Container) {
    (0, _inherits3.default)(RenderGroup, _PIXI$Container);

    function RenderGroup(debugName) {
        (0, _classCallCheck3.default)(this, RenderGroup);

        var _this = (0, _possibleConstructorReturn3.default)(this, (RenderGroup.__proto__ || (0, _getPrototypeOf2.default)(RenderGroup)).call(this));

        _this.debugName = debugName || '';
        _this.dirty = true;
        return _this;
    }

    (0, _createClass3.default)(RenderGroup, [{
        key: 'addSortedChild',
        value: function addSortedChild(child) {
            (0, _get3.default)(RenderGroup.prototype.__proto__ || (0, _getPrototypeOf2.default)(RenderGroup.prototype), 'addChild', this).call(this, child);
            this.dirty = true;
        }
    }, {
        key: 'checkSort',
        value: function checkSort() {
            if (this.dirty) {
                this.children.sort(function (a, b) {
                    return a.__zOrd == b.__zOrd ? a.__zIdx - b.__zIdx : a.__zOrd - b.__zOrd;
                });
                this.dirty = false;
                return true;
            }
            return false;
        }
    }]);
    return RenderGroup;
}(PIXI.Container);

//
// Renderer
//


function m_Renderer(game, canvasMode) {
    this.game = game;
    this.canvasMode = canvasMode;

    this.zIdx = 0;
    this.layer = 0;
    this.layerAlpha = 0.0;
    this.groundAlpha = 0.0;
    this.underground = false;

    this.layers = [];
    for (var i = 0; i < 4; i++) {
        this.layers.push(new RenderGroup('layer_' + i));
    }

    this.ground = new PIXI.Graphics();
    this.ground.alpha = 0.0;

    this.layerMask = createLayerMask();
    this.debugLayerMask = null;

    this.layerMaskDirty = true;
    this.layerMaskActive = false;
}

m_Renderer.prototype = {
    m_free: function m_free() {
        if (this.layerMask.parent) {
            this.layerMask.parent.removeChild(this.layerMark);
        }
        this.layerMask.destroy(true);
    },

    addPIXIObj: function addPIXIObj(obj, layer, zOrd, zIdx) {
        if (!obj.transform) {
            var err = new Error();
            var str = (0, _stringify2.default)({
                type: 'addChild',
                stack: err.stack,
                id: FirebaseManager.instanceId,
                browser: navigator.userAgent,
                playing: this.game.playing,
                gameOver: this.game.gameOver,
                spectating: this.game.spectating,
                time: this.game.playingTicker,
                mode: this.game.teamMode,
                video: this.game.adManager.isPlayingVideo,
                layer: layer,
                zOrd: zOrd,
                zIdx: zIdx
            });
            FirebaseManager.logError(str);
        }

        if (obj.__layerIdx === undefined) {
            obj.__layerIdx = -1;
            obj.__zOrd = -1;
            obj.__zIdx = -1;
        }

        var layerIdx = layer;
        var onStairs = layer & 0x2;
        // Hack to render large/high objects (trees, smokes) on
        // a separate layer that isn't masked off by the bunkers.
        if (onStairs) {
            layerIdx = zOrd >= 100 ? 3 : 2;
        }

        if (obj.parent == this.layers[layerIdx] && obj.__zOrd == zOrd && (zIdx === undefined || obj.__zIdx == zIdx)) {
            return;
        }

        obj.__layerIdx = layerIdx;
        obj.__zOrd = zOrd;
        obj.__zIdx = zIdx !== undefined ? zIdx : this.zIdx++;

        this.layers[layerIdx].addSortedChild(obj);
    },

    setActiveLayer: function setActiveLayer(layer) {
        this.layer = layer;
    },

    setUnderground: function setUnderground(underground) {
        this.underground = underground;
    },

    resize: function resize(map, camera) {
        var undergroundColor = map.mapLoaded ? map.getMapDef().biome.colors.underground : 0x1b0d03;

        this.ground.clear();
        this.ground.beginFill(undergroundColor);
        this.ground.drawRect(0, 0, camera.screenWidth, camera.screenHeight);
        this.ground.endFill();

        this.layerMaskDirty = true;
    },

    redrawLayerMask: function redrawLayerMask(camera, map) {
        var mask = this.layerMask;
        if (this.canvasMode) {
            mask.clear();
            if (this.layerMaskActive) {
                mask.beginFill(0xffffff, 1.0);
                mask.drawRect(0.0, 0.0, camera.screenWidth, camera.screenHeight);
                var structures = map.m_structurePool.m_getPool();
                for (var i = 0; i < structures.length; i++) {
                    var structure = structures[i];
                    if (!structure.active) {
                        continue;
                    }
                    for (var j = 0; j < structure.mask.length; j++) {
                        var m = structure.mask[j];
                        var e = v2.mul(v2.sub(m.max, m.min), 0.5);
                        var c = v2.add(m.min, e);
                        var ll = camera.pointToScreen(v2.sub(c, e));
                        var tr = camera.pointToScreen(v2.add(c, e));
                        mask.drawRect(ll.x, ll.y, tr.x - ll.x, tr.y - ll.y);
                    }
                }
                mask.endFill();
            }
        } else {
            // Redraw mask
            if (this.layerMaskDirty) {
                this.layerMaskDirty = false;
                mask.clear();
                mask.beginFill(0xffffff, 1.0);
                drawRect(mask, 0.0, 0.0, 1024.0, 1024.0);
                var _structures = map.m_structurePool.m_getPool();
                for (var _i = 0; _i < _structures.length; _i++) {
                    var _structure = _structures[_i];
                    if (!_structure.active) {
                        continue;
                    }
                    for (var _j = 0; _j < _structure.mask.length; _j++) {
                        var _m = _structure.mask[_j];
                        var _e = v2.mul(v2.sub(_m.max, _m.min), 0.5);
                        var _c = v2.add(_m.min, _e);

                        var x = _c.x - _e.x;
                        var y = _c.y - _e.y;
                        var w = _e.x * 2.0;
                        var h = _e.y * 2.0;

                        drawRect(mask, x, y, w, h);
                        mask.addHole();
                    }
                }
                mask.endFill();
            }
            // Position layer mask
            var p0 = camera.pointToScreen(v2.create(0.0, 0.0));
            var p1 = camera.pointToScreen(v2.create(1.0, 0.0));
            var s = camera.scaleToScreen(1.0);
            mask.position.set(p0.x, p0.y);
            mask.scale.set(s, -s);
        }
    },

    redrawDebugLayerMask: function redrawDebugLayerMask(camera, map) {
        var mask = this.debugLayerMask;
        mask.clear();
        mask.beginFill(0xff00ff, 1.0);
        var structures = map.m_structurePool.m_getPool();
        for (var i = 0; i < structures.length; i++) {
            var structure = structures[i];
            if (!structure.active) {
                continue;
            }
            for (var j = 0; j < structure.mask.length; j++) {
                var m = structure.mask[j];
                var e = v2.mul(v2.sub(m.max, m.min), 0.5);
                var c = v2.add(m.min, e);

                var x = c.x - e.x;
                var y = c.y - e.y;
                var w = e.x * 2.0;
                var h = e.y * 2.0;

                drawRect(mask, x, y, w, h);
            }
        }
        mask.endFill();
        var p0 = camera.pointToScreen(v2.create(0.0, 0.0));
        var p1 = camera.pointToScreen(v2.create(1.0, 0.0));
        var s = camera.scaleToScreen(1.0);
        mask.position.set(p0.x, p0.y);
        mask.scale.set(s, -s);
    },

    m_update: function m_update(dt, camera, map, debug) {
        // Adjust layer alpha
        var alphaTarget = this.layer > 0 ? 1.0 : 0.0;
        this.layerAlpha += step(this.layerAlpha, alphaTarget, dt * 12.0);
        var groundTarget = this.layer == 1 && this.underground ? 1.0 : 0.0;
        this.groundAlpha += step(this.groundAlpha, groundTarget, dt * 12.0);

        this.layers[0].alpha = 1.0;
        this.layers[1].alpha = this.layerAlpha;
        this.layers[2].alpha = 1.0;
        this.layers[3].alpha = 1.0;
        this.ground.alpha = this.groundAlpha;

        this.layers[0].visible = this.groundAlpha < 1.0;
        this.layers[1].visible = this.layerAlpha > 0.0;
        this.ground.visible = this.groundAlpha > 0.0;

        // Set stairs mask
        this.redrawLayerMask(camera, map);

        var maskActive = this.layer == 0;
        if (maskActive && !this.layerMaskActive) {
            this.layers[2].mask = this.layerMask;
            this.layers[2].addChild(this.layerMask);
            this.layerMaskActive = true;
        } else if (!maskActive && this.layerMaskActive) {
            this.layers[2].mask = null;
            this.layers[2].removeChild(this.layerMask);
            this.layerMaskActive = false;
        }

        // Sort layers
        var sortCount = 0;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].checkSort()) {
                sortCount++;
            }
        }
    }
};

module.exports = {
    RenderGroup: RenderGroup,
    m_Renderer: m_Renderer
};
