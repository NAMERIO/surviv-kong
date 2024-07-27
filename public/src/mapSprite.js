"use strict";


var _getPrototypeOf = require("./057e3e87.js");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("./54eaf174.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("./64a8dc27.js");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./pixi.js");
var math = require("./math.js");
var v2 = require("./v2.js");

var SortableSprite = function (_PIXI$Sprite) {
    (0, _inherits3.default)(SortableSprite, _PIXI$Sprite);

    function SortableSprite(texture) {
        (0, _classCallCheck3.default)(this, SortableSprite);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SortableSprite.__proto__ || (0, _getPrototypeOf2.default)(SortableSprite)).call(this, texture));

        _this.__zOrder = -1;
        return _this;
    }

    return SortableSprite;
}(PIXI.Sprite);

//
// MapSprite
//


function MapSprite() {
    this.active = false;
    this.retained = true;

    this.sprite = new SortableSprite();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(1.0, 1.0);
    this.sprite.visible = false;

    this.pos = v2.create(0.0, 0.0);
    this.scale = 1.0;
    this.alpha = 1.0;
    this.visible = true;
    this.pulse = false;
    this.lifetime = 0.0;
    this.ticker = 0.0;
    this.zOrder = 0;
}

MapSprite.prototype = {
    init: function init() {
        this.active = true;
        this.retained = true;

        this.pos = v2.create(0.0, 0.0);
        this.scale = 1.0;
        this.alpha = 1.0;
        this.pulse = false;
        this.visible = true;
        this.lifetime = Number.MAX_VALUE;
        this.ticker = 0.0;
        this.zOrder = 0;
    },

    free: function free() {
        this.active = false;
        this.sprite.visible = false;
    },

    release: function release() {
        this.retained = false;
    }
};

//
// MapSpriteBarn
//
function MapSpriteBarn() {
    this.container = new PIXI.Container();
    this.mapSprites = [];
}

MapSpriteBarn.prototype = {
    m_free: function m_free() {
        for (var i = 0; i < this.mapSprites.length; i++) {
            var sprite = this.mapSprites[i].sprite;
            if (sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
            sprite.destroy({ children: true });
        }
    },

    addSprite: function addSprite() {
        var mapSprite = null;
        for (var i = 0; i < this.mapSprites.length; i++) {
            if (!this.mapSprites[i].active) {
                mapSprite = this.mapSprites[i];
                break;
            }
        }
        if (!mapSprite) {
            mapSprite = new MapSprite();
            this.mapSprites.push(mapSprite);
            this.container.addChild(mapSprite.sprite);
        }

        mapSprite.init();

        return mapSprite;
    },

    update: function update(dt, uiManager, map) {
        var doSort = false;

        for (var i = 0; i < this.mapSprites.length; i++) {
            var m = this.mapSprites[i];
            if (!m.active) {
                continue;
            }

            if (m.zOrder != m.sprite.__zOrder) {
                m.sprite.__zOrder = m.zOrder;
                doSort = true;
            }

            m.ticker += dt;
            if (m.pulse) {
                m.scale += dt / 2.5;
            }

            var pos = uiManager.getMapPosFromWorldPos(m.pos, map);
            var scale = m.scale;
            var fade = math.smoothstep(m.ticker, 0.0, 0.1) * (1.0 - math.smoothstep(m.ticker, m.lifetime - 0.5, m.lifetime));

            m.sprite.position.set(pos.x, pos.y);
            m.sprite.scale.set(scale, scale);
            m.sprite.alpha = m.alpha * fade;
            m.sprite.visible = m.visible && m.sprite.alpha > 0.0001;

            if (m.ticker >= m.lifetime && !m.retained) {
                m.free();
            }
        }

        if (doSort) {
            this.container.children.sort(function (a, b) {
                return a.__zOrder - b.__zOrder;
            });
        }
    }
};

module.exports = {
    MapSpriteBarn: MapSpriteBarn
};
