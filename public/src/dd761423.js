"use strict";


var PIXI = require("./pixi.js");

function createSprite(_ref) {
    var image = _ref.image,
        rotation = _ref.rotation,
        _ref$textureScale = _ref.textureScale,
        textureScale = _ref$textureScale === undefined ? 1 : _ref$textureScale;

    var sprite = new PIXI.Sprite();
    sprite.texture = image ? PIXI.Texture.fromImage(image, undefined, PIXI.SCALE_MODES.LINEAR, textureScale) : PIXI.Texture.EMPTY;
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(1.0, 1.0);
    sprite.tint = 0xffffff;
    sprite.visible = false;
    sprite.rotation = rotation || 0;
    return sprite;
}

module.exports = {
    createSprite: createSprite
};
