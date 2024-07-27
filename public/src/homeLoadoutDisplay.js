"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
// @ts-ignore
var loadouts = require("./loadouts.js");
var Player = require("./player.js");
// @ts-ignore
var GameObjectDefs = require("./gameObjectDefs.js");
var EditUsernameBubble = require("./editUsernameBubble.js");

var HomeLoadoutDisplay = function () {

    /**
     * @param {import('./account')} account 
     * @param {import('./config')} config 
     * @param {import('./resources').ResourceManager} resources
     * @param {import('./localization')} localization 
     **/
    function HomeLoadoutDisplay(account, config, resources, localization) {
        (0, _classCallCheck3.default)(this, HomeLoadoutDisplay);

        this.resources = resources;
        this.config = config;
        this.account = account;
        this.localization = localization;
        this.spineData = null;
        this.pixi = null;
        this.loadout = loadouts.defaultLoadout();
        this.loadoutIds = loadouts.defaultLoadout();
        this.items = [];
        this.selectedSkinIndex = 0;
        account.addEventListener('loadout', this.updateLoadout.bind(this));
        account.addEventListener('items', this.updateItems.bind(this));
        /** @type {import('./player').Player} */
        this.player = null;
        this.userArmors = [];
    }

    (0, _createClass3.default)(HomeLoadoutDisplay, [{
        key: 'init',
        value: function init() {
            /** @type{HTMLElement} */
            var usernameContainer = document.querySelector('#home-username-bubble-container');
            this.usernameBubble = new EditUsernameBubble(usernameContainer, this.localization, this.account);
        }
    }, {
        key: 'buildLoadout',
        value: function buildLoadout() {
            var armor = this.loadout.armor.type;
            var helmet = this.loadout.helmet.type;
            var baseSkin = this.loadout.avatar.skin;
            var hair = this.loadout.avatar.hair;
            //this.selectedSkinIndex = this.userArmors.findIndex(item => item.type === armor);
            var baseSkins = baseSkin ? GameObjectDefs[baseSkin].skins : {};
            var hairSkins = hair ? GameObjectDefs[hair].skins : {};
            var armorSkins = armor ? GameObjectDefs[armor].skins : {};
            var helmetSkins = helmet ? GameObjectDefs[helmet].skins : {};
            var skins = (0, _assign2.default)({}, baseSkins, hairSkins, armorSkins, helmetSkins);
            if (!this.player) {
                this.player = new Player.Player();
                this.player.setSpine(this.spineData, skins);
                this.player.bodyContainer.x = this.pixi.screen.width / 2;
                this.player.bodyContainer.y = this.pixi.screen.height / 2;

                this.player.spineObj.position.set(-2, 154);
                this.player.spineObj.scale.set(8.9);

                this.pixi.stage.addChild(this.player.bodyContainer);
            } else {
                this.player.changeSkin(skins);
            }
        }
    }, {
        key: 'setSkin',
        value: function setSkin(armor) {
            //const armor = armor.type;
            /*const baseSkin = this.loadout.avatar.skin;
            const hair = this.loadout.avatar.hair;
            const helmet = this.loadout.helmet.type;
            const baseSkins = baseSkin ? GameObjectDefs[baseSkin].skins : {};
            const hairSkins = hair ? GameObjectDefs[hair].skins : {};
            const armorSkins = armor ? GameObjectDefs[armor.type].skins : {};
            const helmetSkins = helmet ? GameObjectDefs[helmet.type].skins : {};
            const skins = Object.assign({}, baseSkins, hairSkins, armorSkins, helmetSkins);
            this.player.changeSkin(skins);
             this.account.setLoadout(
                Object.assign({}, this.loadout, {
                    armor: {
                        type: armor.type,
                        level: armor.level
                    }
                }),
                Object.assign({}, this.loadoutIds, {
                    armor: armor.id
                }));*/
        }
    }, {
        key: 'setSpineData',
        value: function setSpineData(spineData) {
            this.spineData = spineData;
        }
    }, {
        key: 'setPixiApp',
        value: function setPixiApp(pixi) {
            this.pixi = pixi;
        }
    }, {
        key: 'updateLoadout',
        value: function updateLoadout(loadout) {
            if (this.account.loadout) {
                this.loadout = this.account.loadout;
                this.loadoutIds = this.account.loadoutIds;
            }
            this.buildLoadout();
        }
    }, {
        key: 'updateItems',
        value: function updateItems(items) {
            this.items = items;
            this.buildLoadout();
        }
    }]);
    return HomeLoadoutDisplay;
}();

module.exports = HomeLoadoutDisplay;
