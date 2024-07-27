"use strict";


var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var v2 = require("./v2.js");
var device = require("./device.js");
var math = require("./math.js");

var GameObjectDefs = require("./gameObjectDefs.js");

//
// MapIndicatorBarn
//
function m_MapIndicatorBarn(mapSpriteBarn) {
    this.m_mapSpriteBarn = mapSpriteBarn;

    this.m_mapIndicators = [];
    this.m_idToMapIndicator = {};
}

m_MapIndicatorBarn.prototype = {
    m_updateIndicatorData: function m_updateIndicatorData(indicatorData) {
        for (var i = 0; i < indicatorData.length; i++) {
            var data = indicatorData[i];

            if (data.dead) {
                this.m_removeIndicator(data.id);
            } else {
                this.m_updateIndicator(data);
            }
        }
    },

    m_addIndicator: function m_addIndicator(data) {
        var indicator = {
            id: data.id,
            type: data.type,
            pos: v2.copy(data.pos),
            equipped: data.equipped,
            mapSprite: this.m_mapSpriteBarn.addSprite(),
            pulseSprite: this.m_mapSpriteBarn.addSprite(),
            pulseScale: 0.5,
            pulseScaleMin: 0.5,
            pulseScaleMax: 1.0,
            pulseTicker: 0.0,
            orbDir: 1.0,
            pulseSpeed: 0.3
        };
        this.m_mapIndicators.push(indicator);
        this.m_idToMapIndicator[data.id] = indicator;
        return indicator;
    },

    m_removeIndicator: function m_removeIndicator(id) {
        for (var i = 0; i < this.m_mapIndicators.length; i++) {
            var indicator = this.m_mapIndicators[i];
            if (indicator.id == id) {
                indicator.mapSprite.free();
                indicator.pulseSprite.free();

                this.m_mapIndicators.splice(i, 1);
                delete this.m_idToMapIndicator[id];
                break;
            }
        }
    },

    m_updateIndicator: function m_updateIndicator(data) {
        var indicator = this.m_idToMapIndicator[data.id];
        if (!indicator) {
            indicator = this.m_addIndicator(data);
        }

        indicator.pos = v2.copy(data.pos);
        indicator.equipped = data.equipped;

        var objDef = GameObjectDefs[indicator.type];
        var scale = 1.25 * (device.uiLayout == device.UiLayout.Sm ? 0.15 : 0.2);
        var zOrder = indicator.equipped ? 65535 * 10 : 1;

        var mapSprite = indicator.mapSprite;
        mapSprite.pos = v2.copy(indicator.pos);
        mapSprite.scale = scale;
        mapSprite.alpha = 1.0;
        mapSprite.zOrder = zOrder;
        mapSprite.visible = true;
        mapSprite.sprite.texture = PIXI.Texture.fromImage(objDef.mapIndicator.sprite);
        mapSprite.sprite.tint = objDef.mapIndicator.tint;

        if (objDef.mapIndicator.pulse) {
            var pulseSprite = indicator.pulseSprite;
            pulseSprite.pos = v2.copy(indicator.pos);
            pulseSprite.scale = 1.0;
            pulseSprite.zOrder = zOrder - 1;
            pulseSprite.visible = true;
            pulseSprite.sprite.texture = PIXI.Texture.fromImage('part-pulse-01.img');
            pulseSprite.sprite.tint = objDef.mapIndicator.pulseTint;
        }
    },

    m_updateIndicatorPulses: function m_updateIndicatorPulses(dt) {
        for (var i = 0; i < this.m_mapIndicators.length; i++) {
            var indicator = this.m_mapIndicators[i];

            indicator.pulseTicker = math.clamp(indicator.pulseTicker + dt * indicator.orbDir * indicator.pulseSpeed, indicator.pulseScaleMin, 1.0);

            // Ease up and down
            indicator.pulseScale = indicator.pulseTicker * indicator.pulseScaleMax;
            if (indicator.pulseScale >= indicator.pulseScaleMax || indicator.pulseTicker <= indicator.pulseScaleMin) {
                indicator.orbDir *= -1.0;
            }
            indicator.pulseSprite.scale = indicator.pulseScale;
            indicator.pulseSprite.visible = indicator.equipped;
        }
    }
};

module.exports = {
    m_MapIndicatorBarn: m_MapIndicatorBarn
};
