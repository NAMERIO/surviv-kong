"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var PIXI = require("./8b1dfb45.js");
var device = require("./device.js");

var _require = require("./player.js"),
    Player = _require.Player;

var GameObjectDefs = require("./gameObjectDefs.js");

var PlayerCanvas = function () {
    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {import('./account')} account
     * @param {any} spineData
     */
    function PlayerCanvas(canvas, account, spineData) {
        (0, _classCallCheck3.default)(this, PlayerCanvas);

        this.spineData = spineData;
        this.canvas = canvas;
        this.account = account;
        this.mount();
    }

    (0, _createClass3.default)(PlayerCanvas, [{
        key: 'mount',
        value: function mount() {
            var _this = this;

            var resolution = window.devicePixelRatio > 1.0 ? 2.0 : 1.0;
            if (device.os == 'ios') {
                PIXI.settings.PRECISION_FRAGMENT = 'highp';
            }
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            var createPixiApplication = function createPixiApplication(forceCanvas) {
                return new PIXI.Application({
                    width: 182,
                    height: 182,
                    view: _this.canvas,
                    antialias: false,
                    resolution: resolution,
                    forceCanvas: forceCanvas,
                    transparent: true
                });
            };
            var pixiApp = null;
            try {
                pixiApp = createPixiApplication(false);
            } catch (e) {
                pixiApp = createPixiApplication(true);
            }
            this.pixiApp = pixiApp;
            this.pixiApp.renderer.plugins.interaction.destroy();
            this.pixiApp.renderer.transparent = true;
            this.initPlayer();
        }
    }, {
        key: 'initPlayer',
        value: function initPlayer() {
            this.loadout = this.account.loadout;
            var armor = this.loadout.armor.type;
            var helmet = this.loadout.helmet.type;
            var baseSkin = this.loadout.avatar.skin;
            var hair = this.loadout.avatar.hair;
            var baseSkins = baseSkin ? GameObjectDefs[baseSkin].skins : {};
            var hairSkins = hair ? GameObjectDefs[hair].skins : {};
            var armorSkins = armor ? GameObjectDefs[armor].skins : {};
            var helmetSkins = helmet ? GameObjectDefs[helmet].skins : {};
            var skins = (0, _assign2.default)({}, baseSkins, hairSkins, armorSkins, helmetSkins);

            this.player = new Player();
            this.player.setSpine(this.spineData, skins);
            this.player.bodyContainer.x = this.pixiApp.screen.width / 2;
            this.player.bodyContainer.y = this.pixiApp.screen.height / 2;
            this.player.spineObj.position.set(0, 70);
            this.player.spineObj.pivot.set(0);
            this.player.spineObj.scale.set(4);
            this.pixiApp.stage.addChild(this.player.bodyContainer);
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.canvas.hidden = true;
        }
    }, {
        key: 'show',
        value: function show() {
            this.canvas.hidden = false;
        }

        /**
         * @param {{ userItem?: any; definition?: any }} gear
         * @param {string} [gearType]
         */

    }, {
        key: 'update',
        value: function update(gear, gearType) {
            var armor = this.account.loadout.armor.type;
            var helmet = this.account.loadout.helmet.type;
            var baseSkin = this.account.loadout.avatar.skin;
            var hair = this.account.loadout.avatar.hair;
            var baseSkins = baseSkin ? GameObjectDefs[baseSkin].skins : {};
            var hairSkins = hair ? GameObjectDefs[hair].skins : {};
            var armorSkins = armor ? GameObjectDefs[armor].skins : {};
            var helmetSkins = helmet ? GameObjectDefs[helmet].skins : {};
            var gearSkins = gear ? GameObjectDefs[gear.definition.id].skins : {};
            var skins = (0, _assign2.default)({}, baseSkins, hairSkins, !gear && gearType === 'armor' ? {} : armorSkins, !gear && gearType === 'helmet' ? {} : helmetSkins, gearSkins || {});
            this.player.changeSkin(skins);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.pixiApp = null;
        }
    }]);
    return PlayerCanvas;
}();

module.exports = PlayerCanvas;
