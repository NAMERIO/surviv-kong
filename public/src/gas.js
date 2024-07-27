"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var GasMode = GameConfig.GasMode;
var math = require("./math.js");
var v2 = require("./v2.js");
var helpers = require("./helpers.js");

var kOverdraw = 100 * 1000;
var kSegments = 512;
//  Also, PIXI takes 8ms to gen this poly on the first frame,
//  which we could get back if we used a PIXI.Mesh object.

var GasRenderer = function () {
    function GasRenderer(canvasMode, gasColor) {
        (0, _classCallCheck3.default)(this, GasRenderer);

        this.gasColorDOMString = '';
        this.display = null;
        this.canvas = null;
        if (canvasMode) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.display = new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas));
            this.gasColorDOMString = helpers.colorToDOMString(gasColor, 0.6);
        } else {
            this.display = new PIXI.Graphics();

            // Generate a giant planar mesh with a tiny circular hole in
            // the center to act as the gas overlay
            var ctx = this.display;
            ctx.clear();
            ctx.beginFill(gasColor, 0.6);
            ctx.moveTo(-kOverdraw, -kOverdraw);
            ctx.lineTo(kOverdraw, -kOverdraw);
            ctx.lineTo(kOverdraw, kOverdraw);
            ctx.lineTo(-kOverdraw, kOverdraw);
            ctx.closePath();
            ctx.moveTo(0, 1);
            for (var i = 1; i < kSegments; i++) {
                var theta = i / kSegments;
                var s = Math.sin(2 * Math.PI * theta);
                var c = Math.cos(2 * Math.PI * theta);
                ctx.lineTo(s, c);
            }
            ctx.closePath();
            ctx.addHole();
        }
        this.display.visible = false;
    }

    (0, _createClass3.default)(GasRenderer, [{
        key: 'free',
        value: function free() {
            this.display.destroy(true);
        }
    }, {
        key: 'resize',
        value: function resize() {
            if (this.canvas != null) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.display.texture.update();
            }
        }
    }, {
        key: 'render',
        value: function render(gasPos, gasRad, active) {
            if (this.canvas != null) {
                var canvas = this.canvas;
                var ctx = canvas.getContext('2d');
                ctx.clearRect(0.0, 0.0, canvas.width, canvas.height);
                ctx.beginPath();
                ctx.fillStyle = this.gasColorDOMString;
                ctx.rect(0.0, 0.0, canvas.width, canvas.height);
                ctx.arc(gasPos.x, gasPos.y, gasRad, 0, Math.PI * 2.0, true);
                ctx.fill();
            } else {
                var center = v2.copy(gasPos);
                // Once the hole gets small enough, just fill the entire
                // screen with some random part of the geometry
                var rad = gasRad;
                if (rad < 0.1) {
                    rad = 1.0;
                    center.x += 0.5 * kOverdraw;
                }
                var _ctx = this.display;
                _ctx.position.set(center.x, center.y);
                _ctx.scale.set(rad, rad);
            }
            this.display.visible = active;
        }
    }]);
    return GasRenderer;
}();

var GasSafeZoneRenderer = function () {
    function GasSafeZoneRenderer() {
        (0, _classCallCheck3.default)(this, GasSafeZoneRenderer);

        this.display = new PIXI.Container();
        this.circleGfx = new PIXI.Graphics();
        this.lineGfx = new PIXI.Graphics();
        this.display.addChild(this.circleGfx);
        this.display.addChild(this.lineGfx);
        this.circleGfx.visible = false;
        this.lineGfx.visible = false;

        this.safePos = v2.create(0.0, 0.0);
        this.safeRad = 0.0;
        this.playerPos = v2.create(0.0, 0.0);
    }

    (0, _createClass3.default)(GasSafeZoneRenderer, [{
        key: 'render',
        value: function render(safePos, safeRad, playerPos, drawCircle, drawLine) {
            // Render a circle showing the safe zone, and a line pointing from
            // the player to the center. Only update geometry if relevant data
            // has changed.

            this.circleGfx.visible = drawCircle;
            this.lineGfx.visible = drawLine;
            if (!drawCircle && !drawLine) {
                return;
            }

            var kEps = 0.0001;
            var safePosChanged = !v2.eq(this.safePos, safePos, kEps);
            var safeRadChanged = Math.abs(this.safeRad - safeRad) > kEps;
            var playerPosChanged = !v2.eq(this.playerPos, playerPos, kEps);
            if (safePosChanged) {
                this.safePos.x = safePos.x;
                this.safePos.y = safePos.y;
            }
            if (safeRadChanged) {
                this.safeRad = safeRad;
            }
            if (playerPosChanged) {
                this.playerPos.x = playerPos.x;
                this.playerPos.y = playerPos.y;
            }

            // Update circle?
            if (safePosChanged) {
                this.circleGfx.position.set(this.safePos.x, this.safePos.y);
            }
            if (safeRadChanged) {
                this.circleGfx.clear();
                this.circleGfx.lineStyle(1.5, 0xFFFFFF);
                this.circleGfx.drawCircle(0.0, 0.0, safeRad);
            }

            // Update line?
            if (safePosChanged || safeRadChanged || playerPosChanged) {
                var isSafe = v2.length(v2.sub(playerPos, safePos)) < safeRad;
                var alpha = isSafe ? 0.5 : 1.0;
                this.lineGfx.clear();
                this.lineGfx.lineStyle(2, 0x00FF00, alpha);
                this.lineGfx.moveTo(playerPos.x, playerPos.y);
                this.lineGfx.lineTo(safePos.x, safePos.y);
            }
        }
    }]);
    return GasSafeZoneRenderer;
}();

var m_Gas = function () {
    function m_Gas(canvasMode) {
        (0, _classCallCheck3.default)(this, m_Gas);

        var startRad = (Math.sqrt(2.0) + 0.01) * 1024;

        this.mode = GasMode.Inactive;
        this.circleT = 0.0;
        this.duration = 0.0;
        this.circleOld = { pos: v2.create(0.0, 0.0), rad: startRad };
        this.circleNew = { pos: v2.create(0.0, 0.0), rad: startRad };
        this.gasRenderer = new GasRenderer(canvasMode, 0xff0000);
    }

    (0, _createClass3.default)(m_Gas, [{
        key: 'free',
        value: function free() {
            this.gasRenderer.free();
        }
    }, {
        key: 'resize',
        value: function resize() {
            this.gasRenderer.resize();
        }
    }, {
        key: 'isActive',
        value: function isActive() {
            return this.mode != GasMode.Inactive;
        }
    }, {
        key: 'getCircle',
        value: function getCircle() {
            var t = this.mode == GasMode.Moving ? this.circleT : 0.0;
            return {
                pos: v2.lerp(t, this.circleOld.pos, this.circleNew.pos),
                rad: math.lerp(t, this.circleOld.rad, this.circleNew.rad)
            };
        }
    }, {
        key: 'setProgress',
        value: function setProgress(circleT) {
            this.circleT = circleT;
        }
    }, {
        key: 'setFullState',
        value: function setFullState(circleT, data, map, ui) {
            // Update Ui
            if (data.mode != this.mode) {
                var timeLeft = Math.ceil(data.duration * (1.0 - circleT));
                ui.setWaitingForPlayers(false);
                ui.displayGasAnnouncement(data.mode, timeLeft);
            }

            // Update state
            this.mode = data.mode;
            this.duration = data.duration;
            this.circleT = circleT;

            // Update circles
            this.circleOld.pos = v2.copy(data.posOld);
            this.circleOld.rad = data.radOld;
            this.circleNew.pos = v2.copy(data.posNew);
            this.circleNew.rad = data.radNew;
        }
    }, {
        key: 'render',
        value: function render(camera) {
            var circle = this.getCircle();
            var pos = camera.pointToScreen(circle.pos);
            var rad = camera.scaleToScreen(circle.rad);
            this.gasRenderer.render(pos, rad, this.isActive());
        }
    }]);
    return m_Gas;
}();

module.exports = {
    GasRenderer: GasRenderer,
    GasSafeZoneRenderer: GasSafeZoneRenderer,
    m_Gas: m_Gas
};
