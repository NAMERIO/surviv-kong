"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var $ = require("./8ee62bea.js");
// @ts-ignore
var GameConfig = require("./989ad62a.js");
var helpers = require("./helpers.js");
var MenuModal = require("./menuModal.js");
// @ts-ignore
var GameObjectDefs = require("./gameObjectDefs.js");
var Player = require("./player.js");
var PieTimer = require("./pieTimer.js");

var WeaponSelector = function () {

    /**
     * 
     * @param {import('./account')} account 
     * @param {*} weaponsList 
     * @param {*} defaultWeapon 
     * @param {*} config 
     * @param {*} localization 
     * @param {*} waitTime 
     */
    function WeaponSelector(account, weaponsList, defaultWeapon, config, localization, waitTime) {
        var _this = this;

        (0, _classCallCheck3.default)(this, WeaponSelector);

        this.pixi = null;
        this.spineData = null;
        this.weaponsList = weaponsList;
        this.account = account;
        this.localization = localization;
        this.player = null;
        this.defaultWeapon = defaultWeapon;
        this.waitTime = waitTime;
        this.config = config;
        this.active = false;
        this.elapsed = 0;
        this.weapons = [];
        this.weaponDefId = null;

        this.displayCounter = 0;
        this.displayCounterDelay = 1;
        this.displayCounterFlag = true;

        //Modal
        this.modalSelect = $('#modal-weapon-selection');
        this.modalSelectList = $('#modal-weapon-selection-container');

        this.m_pieTimer = new PieTimer.m_PieTimer();

        this.modal = new MenuModal(this.modalSelect);
        this.modal.onShow(function () {
            _this.onShow();
        });
        this.modal.onHide(function () {
            _this.onHide();
        });
        this.modal.modalCloseListener = null;

        $('#btn-start-battle').click(function () {
            _this.hide();
        });
    }

    (0, _createClass3.default)(WeaponSelector, [{
        key: 'init',
        value: function init() {
            //this.weapons = this.randomStartWeapons();
            this.initPlayer();
            this.addSelectWeapon();
            this.setDefaultWeapon();
            this.m_pieTimer.stop();
            this.m_pieTimer.setPosition(410, 20);
            this.m_pieTimer.start('', this.waitTime, this.waitTime, true);
            this.pixi.stage.addChild(this.m_pieTimer.container);
        }
    }, {
        key: 'updateWeapons',
        value: function updateWeapons(weapons) {
            this.weapons = weapons;
        }
    }, {
        key: 'initPlayer',
        value: function initPlayer() {
            var armor = this.account.loadout.armor.type;
            var helmet = this.account.loadout.helmet.type;
            var baseSkin = this.account.loadout.avatar.skin;
            var hair = this.account.loadout.avatar.hair;
            var baseSkins = baseSkin ? GameObjectDefs[baseSkin].skins : {};
            var hairSkins = hair ? GameObjectDefs[hair].skins : {};
            var armorSkins = armor ? GameObjectDefs[armor].skins : {};
            var helmetSkins = helmet ? GameObjectDefs[helmet].skins : {};
            var skins = (0, _assign2.default)({}, baseSkins, hairSkins, armorSkins, helmetSkins);

            if (!this.player) {
                this.player = new Player.Player();
                this.player.setSpine(this.spineData, skins);
                var playerLeftMargin = 113;
                var playerTopMargin = -110;
                this.player.bodyContainer.x = playerLeftMargin;
                this.player.bodyContainer.y = this.pixi.screen.height / 2 + playerTopMargin;
                this.player.spineObj.position.set(0, 0);
                this.player.spineObj.scale.set(4.0);
                this.pixi.stage.addChild(this.player.bodyContainer);
            } else {
                this.player.changeSkin(skins);
            }
        }
    }, {
        key: 'setDefaultWeapon',
        value: function setDefaultWeapon() {
            $('#weapon-' + this.defaultWeapon).addClass('selected');
            this.setWeapon(GameObjectDefs[this.weapons[this.defaultWeapon]]);
        }
    }, {
        key: 'setWeapon',
        value: function setWeapon(weaponDef) {
            this.weaponDefId = weaponDef.id;
            this.player.changeSkinSlot(GameConfig.SkinSlots.MainHand, weaponDef.spineAsset);
        }
    }, {
        key: 'addSelectWeapon',
        value: function addSelectWeapon() {
            var _this2 = this;

            //Add Cicle 
            this.modalSelectList.html('');
            var totalStars = 5;
            var fillStar = 'img/gui/difficulty-star-fill.svg';
            var emptyStar = 'img/gui/difficulty-star-empty.svg';
            var lastSelectedWeapon = this.defaultWeapon;

            var _loop = function _loop(i) {
                var weaponDef = GameObjectDefs[_this2.weapons[i]];
                var weapTypeDef = GameObjectDefs[weaponDef.weapType];
                var weapon = $('<div/>', {
                    'class': 'weapon frame-weapon-selection',
                    'id': 'weapon-' + i
                }).appendTo(_this2.modalSelectList).click(function () {
                    _this2.setWeapon(weaponDef);
                    $('#weapon-' + lastSelectedWeapon).removeClass('selected');
                    lastSelectedWeapon = i;
                    $('#weapon-' + lastSelectedWeapon).addClass('selected');
                });

                //Weapon Name
                $('<span/>', {
                    'class': 'weapon-name h13 text-white',
                    'text': _this2.localization.translate('game-' + weaponDef.id)
                }).appendTo(weapon);

                //Playstyle weapon description
                $('<div/>', { //Add translate -> Change placeholder text
                    'class': 'playstyle-weapon-description h15 text-white',
                    'text': weapTypeDef.weaponType + ' - ' + weapTypeDef.damageType
                }).appendTo(weapon);

                //weapon Image
                $('<div/>', {
                    'class': 'weapon-image'
                }).css('background-image', 'url(' + helpers.getSvgFromGameType(weaponDef.id) + ')').appendTo(weapon);

                var difficultyGroup = $('<div/>', {
                    'class': 'difficulty-group'
                }).appendTo(weapon);

                //Difficulty Label
                $('<span/>', {
                    'class': 'difficulty-label h15 text-white',
                    'text': _this2.localization.translate('game-hud-playstyle')
                }).appendTo(difficultyGroup);

                //Stars count
                var stars = $('<span/>', {
                    'class': 'difficulty-level'
                    //'text': `${weapTypeDef.difficulty}/5` //Add Stars
                }).appendTo(difficultyGroup);

                var difficultyStars = weapTypeDef.difficulty;

                for (var star = 0; star < difficultyStars; star++) {
                    $('<div/>', {
                        'class': 'difficulty-star'
                    }).css('background-image', 'url(' + fillStar + ')').appendTo(stars);
                }

                var remainingStars = totalStars - difficultyStars;
                for (var _star = 0; _star < remainingStars; _star++) {
                    $('<div/>', {
                        'class': 'difficulty-star'
                    }).css('background-image', 'url(' + emptyStar + ')').appendTo(stars);
                }

                //Playstyle weapon description
                $('<div/>', { //Add translate -> Change placeholder text
                    'class': 'playstyle-description h15 text-white',
                    'text': weapTypeDef.playStyleDescription
                }).appendTo(weapon);

                var skillGroup = $('<div/>', {
                    'class': 'basic-skill-group'
                }).appendTo(weapon);

                var skillImageContainer = $('<div/>', {
                    'class': 'skill-header-container flex justify-left items-center'
                }).appendTo(skillGroup);

                $('<div/>', {
                    'class': 'skill-image'
                }).css('background', 'url(' + helpers.getSkillFromImgType(weaponDef.attacks.skill_1.icon) + ')').appendTo(skillImageContainer);

                //Basic Skill Label
                var basicSkillLabel = $('<span/>', {
                    'class': 'basic-skill-label h13 text-white',
                    'text': _this2.localization.translate('game-hud-basic-skill')
                }).appendTo(skillImageContainer);

                //Skill Name
                var skillName = weaponDef.attacks.skill_1.name.toLowerCase().replace(/\s/g, "");
                $('<div/>', {
                    'class': 'skill-name h14 text-white',
                    'text': _this2.localization.translate('game-hud-' + skillName) || weaponDef.attacks.skill_1.name
                }).appendTo(basicSkillLabel);

                var skillDesciptionContainer = $('<div/>', {
                    'class': 'skill-description-container flex justify-center items-center'
                }).appendTo(skillGroup);

                //Skill Description
                $('<div/>', {
                    'class': 'skill-description h15 text-white',
                    'text': _this2.localization.translate('game-hud-' + skillName + '-description') || weapTypeDef[skillName] //Add Translation
                }).appendTo(skillDesciptionContainer);
            };

            for (var i = 0; i < this.weapons.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: 'setSpineData',
        value: function setSpineData(spineData) {
            this.spineData = spineData;
        }
    }, {
        key: 'setPixiContainer',
        value: function setPixiContainer(pixi) {
            this.pixi = pixi;
        }
    }, {
        key: 'displayScreen',
        value: function displayScreen() {
            this.modalSelect.show(); //fadeIn(1200, "linear");
        }
    }, {
        key: 'm_update',
        value: function m_update(dt) {
            if (this.active) {
                this.elapsed -= dt;
                this.m_pieTimer.update(dt, null);
                this.displayCounter += dt;
                if (this.displayCounter >= this.displayCounterDelay && this.displayCounterFlag) {
                    this.displayScreen();
                    this.displayCounterFlag = false;
                }
            } else {
                this.m_pieTimer.stop();
            }
        }
    }, {
        key: 'show',
        value: function show() {
            //$('#home-container').fadeOut(1000, "linear");
            //this.modalSelect.fadeIn(2000, "linear");
            this.displayCounter = 0;
            this.displayCounterFlag = true;
            this.elapsed = this.waitTime;
            this.active = true;
            this.init();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.modalSelect.fadeOut(1000, "linear");
            //$('#home-container').fadeIn(200);
            this.active = false;
            this.elapsed = -1;
        }
    }, {
        key: 'onHide',
        value: function onHide() {
            this.modalSelect.fadeOut(1000, "linear");
            //$('#home-container').fadeIn(200);
            this.active = false;
            this.elapsed = -1;
        }
    }, {
        key: 'onShow',
        value: function onShow() {
            //$('#home-container').fadeOut(1000, "linear");
            //this.modalSelect.fadeIn(2000, "linear");
            this.displayCounter = 0;
            this.displayCounterFlag = true;
            this.elapsed = this.waitTime;
            this.active = true;
            this.init();
        }
    }, {
        key: 'randomStartWeapons',
        value: function randomStartWeapons() {
            var list = [];
            var element = null;
            while (list.length != 3) {
                var randomNumber = Math.floor(Math.random() * this.weaponsList.length);
                element = this.weaponsList[randomNumber];
                if (!list.includes(element)) {
                    list.push(element);
                }
            }
            return list;
        }
    }]);
    return WeaponSelector;
}();

module.exports = WeaponSelector;
