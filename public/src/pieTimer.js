"use strict";


var PIXI = require("./pixi.js");
var math = require("./math.js");
var device = require("./device.js");

//
// Constants
//
var kLineWidth = 8.0;
var kRadius = 35.0;
var kFontWidth = 24.0;

//
// PieTimer
//
function m_PieTimer() {
    this.container = new PIXI.Container();
    this.container.visible = false;

    this.timerBackground = PIXI.Sprite.fromImage('timer-background.img');
    this.timerBackground.anchor.set(0.5, 0.5);
    this.timerBackground.scale.set(1.0, 1.0);
    this.container.addChild(this.timerBackground);

    this.gfx = new PIXI.Graphics();
    this.container.addChild(this.gfx);

    this.counterText = new PIXI.Text();
    this.counterText.anchor.set(0.5, 0.5);
    this.counterText.style = {
        fontFamily: 'Amiga Forever',
        fontWeight: 'bold',
        fontSize: 18,
        align: 'center',
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 3.0
    };
    this.container.addChild(this.counterText);

    this.labelText = new PIXI.Text();
    this.labelBg = new PIXI.Sprite.fromImage('text-M.img');
    this.labelText.anchor.set(0.5, 0.5);
    this.labelBg.anchor.set(0.5, 0.5);
    this.labelText.style = {
        fontFamily: 'Amiga Forever',
        fontWeight: '100',
        fontSize: 12,
        align: 'center',
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 3.0
    };
    //this.labelText.txtBG = labelBg;
    this.container.addChild(this.labelBg);
    this.container.addChild(this.labelText);

    this.screenScaleFactor = 1.0;
    this.mobileOffset = 0.0;

    this.active = false;
    this.label = '';
    this.elapsed = 0.0;
    this.duration = 0.0;
    this.posX = this.posY = null;
    this.spriteAnimation = false;
    this.hourGlassSprite = null;
}

m_PieTimer.prototype = {
    destroy: function destroy() {
        // Don't destroy the texture being used by timerBackground
        this.container.removeChild(this.timerBackground);
        this.timerBackground.destroy({
            children: true
        });
        this.container.destroy({
            children: true,
            texture: true
        });
    },

    setPosition: function setPosition(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    },

    start: function start(label, elapsed, duration) {
        var hourGlass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        this.active = true;
        this.label = label;
        this.elapsed = elapsed;
        this.duration = duration;
        this.spriteAnimation = hourGlass;

        if (hourGlass) {

            if (!this.hourGlassSprite) {

                var baseTexture = [];
                var sprites = ['hourglass_01.img', 'hourglass_02.img', 'hourglass_03.img', 'hourglass_04.img', 'hourglass_05.img', 'hourglass_06.img', 'hourglass_07.img', 'hourglass_08.img'];

                for (var i = 0; i < sprites.length; i++) {
                    var texture = PIXI.Texture.from(sprites[i]);
                    baseTexture.push(texture);
                }
                this.hourGlassSprite = new PIXI.extras.AnimatedSprite(baseTexture);
                this.hourGlassSprite.anchor.set(0.5, 0.5);
                this.hourGlassSprite.scale.set(1.0, 1.0);
                this.hourGlassSprite.animationSpeed = 0.14;
                this.hourGlassSprite.loop = true;
                this.container.addChild(this.hourGlassSprite);
            }
            this.hourGlassSprite.visible = true;
            this.hourGlassSprite.play();
        } else if (this.hourGlassSprite) {
            this.hourGlassSprite.visible = false;
            this.hourGlassSprite.stop();
        }
    },

    stop: function stop() {
        this.active = false;
    },

    resize: function resize(touch, screenScaleFactor) {
        this.screenScaleFactor = screenScaleFactor;

        if (device.uiLayout == device.UiLayout.Sm) {
            if (!device.tablet) {
                this.container.scale.set(0.5, 0.5);
            }
            this.mobileOffset = device.isLandscape ? touch.mobileOffsetLandscape : touch.mobileOffsetPortrait;
        } else {
            this.container.scale.set(1.0, 1.0);
            this.mobileOffset = 0.0;
        }
    },

    update: function update(dt, camera) {
        if (!this.active) {
            this.container.visible = false;
            return;
        }

        var positionX = this.posX ? this.posX : camera.screenWidth / 2.0;
        // let positionY = this.posY ? this.posY : camera.screenHeight / 3.0 * this.screenScaleFactor + this.mobileOffset;
        var positionY = this.posY ? this.posY : 20.0 * this.screenScaleFactor + this.mobileOffset;
        this.elapsed = this.posY ? math.min(this.elapsed - dt, this.duration) : math.min(this.elapsed + dt, this.duration);

        var labelWidth = 56.0 + this.label.length * kFontWidth * 0.45;
        var labelHeight = kFontWidth * 1.5;
        var labelOffset = kRadius * 2.5;
        var rectX = 0 - labelWidth / 2.0;
        var rectY = labelOffset - labelHeight / 2.0;
        this.gfx.clear();

        if (camera && !this.posX) {
            this.counterText.position.y = 0;
            this.hourGlassSprite.position.y = 70;
            this.timerBackground.visible = false;
            this.container.pivot.set(0, 0.5);
            labelOffset = camera.screenHeight / 3.0 * this.screenScaleFactor + this.mobileOffset;
            this.labelBg.position.y = labelOffset;
            this.labelBg.visible = true;
        } else {
            this.counterText.position.y = 0;
            this.hourGlassSprite.position.y = 75;
            this.hourGlassSprite.visible = true;
            this.timerBackground.visible = false;
        }

        var displayCounter = this.posY ? this.elapsed : this.duration - this.elapsed;
        this.counterText.text = math.max(0.0, displayCounter).toFixed(1);

        this.labelText.position.y = labelOffset;
        this.labelText.text = this.label;
        //   this.hourGlassSprite.position.y = labelOffset;

        this.container.position.set(positionX, positionY);
        this.container.visible = true;
    }
};

module.exports = {
    m_PieTimer: m_PieTimer
};


},[["c99e6613",1,2]]]);
//# sourceMappingURL=app.e4406638.js.map

}
/*
     FILE ARCHIVED ON 16:06:35 Nov 02, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 14:42:03 Feb 18, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 181.656
  exclusion.robots: 0.346
  exclusion.robots.policy: 0.329
  cdx.remote: 0.11
  esindex: 0.013
  LoadShardBlock: 147.122 (3)
  PetaboxLoader3.datanode: 141.046 (4)
