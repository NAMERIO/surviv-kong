"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var collider = require("./collider.js");
var math = require("./math.js");
var v2 = require("./v2.js");
var PIXI = require("./pixi.js");

var kShapes = {
    Line: 0,
    Ray: 1,
    Circle: 2,
    Aabb: 3
};

var DebugLines = function () {
    function DebugLines() {
        (0, _classCallCheck3.default)(this, DebugLines);

        this.shapes = [];
    }

    (0, _createClass3.default)(DebugLines, [{
        key: 'addLine',
        value: function addLine(start, end, color, fill) {
            var thickness = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            this.shapes.push({
                type: kShapes.Line,
                start: v2.copy(start),
                end: v2.copy(end),
                color: color,
                fill: fill,
                lineThickness: thickness,
                angle: null,
                playerPos: null,
                meleeRect: null
            });
        }
    }, {
        key: 'addRay',
        value: function addRay(pos, dir, len, color, fill) {
            this.shapes.push({
                type: kShapes.Ray,
                pos: v2.copy(pos),
                dir: v2.copy(dir),
                len: len,
                color: color,
                fill: fill,
                angle: null,
                playerPos: null,
                meleeRect: null
            });
        }
    }, {
        key: 'addCircle',
        value: function addCircle(pos, rad, color, fill) {
            this.shapes.push({
                type: kShapes.Circle,
                pos: v2.copy(pos),
                rad: rad,
                color: color,
                fill: fill,
                angle: null,
                playerPos: null,
                meleeRect: null
            });
        }
    }, {
        key: 'addAabb',
        value: function addAabb(min, max, color, fill) {
            this.shapes.push({
                type: kShapes.Aabb,
                min: v2.copy(min),
                max: v2.copy(max),
                color: color,
                fill: fill,
                angle: null,
                playerPos: null,
                meleeRect: null
            });
        }
    }, {
        key: 'addAabbAngle',
        value: function addAabbAngle(min, max, color, fill, angle, playerPos, meleeRect) {
            this.shapes.push({
                type: kShapes.Aabb,
                min: v2.copy(min),
                max: v2.copy(max),
                color: color,
                fill: fill,
                angle: angle,
                playerPos: playerPos,
                meleeRect: meleeRect
            });
        }
    }, {
        key: 'addCollider',
        value: function addCollider(col, color, fill) {
            if (col.type == collider.Type.Aabb) {
                this.addAabb(col.min, col.max, color, fill);
            } else {
                this.addCircle(col.pos, col.rad, color, fill);
            }
        }
    }, {
        key: 'render',
        value: function render(camera, gfx) {}
    }, {
        key: 'flush',
        value: function flush() {
            this.shapes = [];
        }
    }]);
    return DebugLines;
}();

var debugLines = new DebugLines();

// Export a singleton
module.exports = debugLines;
