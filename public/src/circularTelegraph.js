"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require("./dd761423.js"),
    createSprite = _require.createSprite;

var CircularTelegraph = function () {
    function CircularTelegraph(config, container, radius, offset) {
        (0, _classCallCheck3.default)(this, CircularTelegraph);

        this.type = 1;
        this.config = config;
        this.container = container;
        this.diameter = radius * 2;
        this.offset = offset;
        this.init();
    }

    (0, _createClass3.default)(CircularTelegraph, [{
        key: "init",
        value: function init() {
            var _this = this;

            this.sprites = [];

            this.config.sprites.forEach(function (spriteConfig) {
                var sprite = createSprite({ image: spriteConfig.sprite, textureScale: spriteConfig.textureScale || 1 });
                _this.container.addChild(sprite);
                _this.sprites.push(sprite);
            });
        }
    }, {
        key: "show",
        value: function show() {
            this.sprites.forEach(function (sprite) {
                return sprite.visible = true;
            });
        }
    }, {
        key: "hide",
        value: function hide() {
            this.sprites.forEach(function (sprite) {
                return sprite.visible = false;
            });
        }
    }, {
        key: "update",
        value: function update(dt) {
            var _this2 = this;

            this.sprites.forEach(function (sprite) {
                sprite.width = sprite.height = _this2.diameter;

                if (_this2.offset) {
                    sprite.position.set(_this2.offset.x, _this2.offset.y);
                }
            });
        }
    }]);
    return CircularTelegraph;
}();

module.exports = CircularTelegraph;
