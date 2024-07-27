"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ts-check

var ModalRecycle = require("./modalRecycle.js");
var ModalTemplate = require("./modalTemplate.js");

var RaritiesDefs = require("./rarities.js");
var GameObjectDefs = require("./gameObjectDefs.js");

var getPerkText = function getPerkText(localization, perk) {
    if (perk.type === 'boon') {
        return localization.translate("rewards-" + perk.boon + "-perk");
    }

    if (perk.type === 'protection') {
        var _perkText = localization.translate("rewards-" + perk.type + "-perk");
        var attack = localization.translate("attack-type-" + perk.params.type);
        return _perkText.replace('[attack]', attack);
    }

    var perkText = localization.translate("rewards-" + perk.type + "-perk");
    var statusEffect = localization.translate("status_effect-type-" + perk.params.type);
    return perkText.replace('[effect]', statusEffect);
};

var getPerkId = function getPerkId(perk) {
    if (perk.type === 'boon') return perk.type + perk.boon;else return perk.type + perk.params.type;
};

var ModalSeasonRewards = function () {
    /**
     * 
     * @param {import('./../account')} account 
     * @param {import('./../localization')} localization 
     * @param {import('./../armory-gear-menu')} armoryGearMenu 
     * @param {any[]} items 
     * @param {*} gold 
     * @param {*} level 
     */
    function ModalSeasonRewards(account, localization, armoryGearMenu, items, gold, level) {
        var opts = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
        (0, _classCallCheck3.default)(this, ModalSeasonRewards);

        this.account = account;
        this.localization = localization;
        this.armoryGearMenu = armoryGearMenu;
        this.currentIndex = 0;
        this.opts = (0, _assign2.default)({}, opts);
        this.mount(items, gold, level);
    }

    (0, _createClass3.default)(ModalSeasonRewards, [{
        key: "mount",
        value: function mount(items, gold, level) {
            //----------------- Prepare title -----------------
            var title = items.length > 1 ? this.localization.translate('season-pass-rewards') : this.localization.translate('season-pass-reward');

            if (this.opts.title) {
                title = this.localization.translate(this.opts.title);
            }
            //----------------- Prepare main content -----------------
            this.containerElement = document.querySelector('#season-reward-modal-container').content.cloneNode(true);
            this.itemContainerElement = this.containerElement.querySelector('.reward-container');
            this.prevBtnElement = this.containerElement.querySelector('.season-left-arrow');
            this.nextBtnElement = this.containerElement.querySelector('.season-right-arrow');

            //Top counter of rewards items
            this.itemCounterIndicator = document.createElement('div');
            this.itemCounterIndicator.classList.add('season-reward-counter-container');

            /*if(items.length > 1){
                this.prevBtnElement.addEventListener('click', this.showPrevItem.bind(this));
                this.nextBtnElement.addEventListener('click', this.showNextItem.bind(this));
            }
            else{
                this.prevBtnElement.style.display = 'none';
                this.nextBtnElement.style.display = 'none';
                this.itemCounterIndicator.style.display = 'none';
            }*/

            this.itemCounterIndicator.style.display = 'none';
            this.prevBtnElement.style.display = 'none';
            this.nextBtnElement.style.display = 'none';

            //----------------- Prepare content items -----------------
            this.rewardsItems = [];

            var i = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(items), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    var itemDef = GameObjectDefs[item.type];
                    var itemTemplate = document.querySelector('#reward-item');
                    var itemElement = itemTemplate.content.cloneNode(true);

                    //Main item content
                    var htmlElement = this.prepareRewardItemElement(itemDef, itemElement);
                    var levelElement = null;
                    if (this.opts.subtitle) {
                        //Season level (appears on top)
                        levelElement = document.createElement('div');
                        levelElement.innerText = this.localization.translate(this.opts.subtitle);
                        levelElement.classList.add('rarity-text-fill', 'chest-rarity-text-fill-subtitle', this.opts.rarity);
                    } else {
                        //Season level (appears on top)
                        levelElement = document.createElement('div');
                        levelElement.innerHTML = (this.localization.translate('level') || 'Level') + ' ' + item.sourceRef;
                        levelElement.classList.add('reward-lvl');
                    }

                    //Prepare items buttons
                    var buttons = {
                        left: {
                            text: 'recycle',
                            doNotClose: true,
                            removeCssClassList: ['btn-check'],
                            action: this.recycleGear.bind(this)
                        },
                        right: {
                            text: 'game-equip',
                            removeCssClassList: ['btn-check', 'btn-disabled'],
                            action: this.equipGear.bind(this)
                        }
                    };

                    //Top counter of rewards items
                    var counter = document.createElement('div');
                    counter.classList.add('season-reward-counter');
                    counter.setAttribute('idx', i);
                    this.itemCounterIndicator.appendChild(counter);
                    i += 1;

                    var userItem = {
                        id: item.id,
                        level: item.level
                    };

                    this.rewardsItems.push({ htmlContent: [levelElement, htmlElement], buttons: buttons,
                        itemDef: itemDef, userItem: userItem, equipped: false, recycled: false });
                }

                //Gold item element
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (gold > 0) {
                var buttons = {
                    right: {
                        text: 'got-it',
                        removeCssClassList: ['btn-check'],
                        doNotClose: true,
                        action: this.showNextItem.bind(this)
                    }
                };

                var levelElement = document.createElement('div');
                levelElement.innerHTML = (this.localization.translate('level') || 'Level') + ' ' + level;
                levelElement.classList.add('reward-lvl');

                //Top counter of rewards items
                var counter = document.createElement('div');
                counter.classList.add('season-reward-counter');
                counter.setAttribute('idx', i);
                this.itemCounterIndicator.appendChild(counter);

                this.rewardsItems.push({ htmlContent: [levelElement, this.prepareGoldItemElement(gold)], buttons: buttons });
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this.rewardsItems[this.currentIndex].htmlContent), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var element = _step2.value;

                    this.itemContainerElement.append(element);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.updateItemCounter();

            //----------------- Create modal ----------------- 
            var content = {
                htmlList: [this.itemCounterIndicator, this.containerElement],
                maxWidth: 1100,
                css: 'margin-top: 50px'
            };
            var parent = document.querySelector('#modal-season-rewards');
            this.modal = new ModalTemplate(parent, this.localization, title, content, this.rewardsItems[this.currentIndex].buttons);
            this.onHide(this.showNextItem.bind(this));
        }
    }, {
        key: "prepareGoldItemElement",
        value: function prepareGoldItemElement(totalGold) {
            var itemTemplate = document.querySelector('#reward-gold');
            var itemElement = itemTemplate.content.cloneNode(true);
            var containerElem = itemElement.querySelector('.reward-gold-container');

            var goldAmountElement = containerElem.querySelector('.reward-gold-text');

            goldAmountElement.innerHTML = totalGold;

            return itemElement;
        }
    }, {
        key: "prepareRewardItemElement",
        value: function prepareRewardItemElement(item, itemElement) {
            var infoContainerElem = itemElement.querySelector('.reward-info-container');
            var imageContainerElem = itemElement.querySelector('.reward-image-container');

            var rarity = RaritiesDefs[item.rarity];

            //Prepare item img element
            var nameElement = imageContainerElem.querySelector('.reward-item-name');
            var imageElement = imageContainerElem.querySelector('.reward-item-image');
            var rarityElement = imageContainerElem.querySelector('.reward-item-rarity-text');

            var nameText = this.localization.translate(item.id) || item.name;
            var rarityText = this.localization.translate("game-rarity-" + rarity.name) || rarity.name;

            nameElement.innerHTML = nameText;
            imageElement.src = item.images.md || item.images.sm;
            rarityElement.innerHTML = rarityText;
            imageContainerElem.style = "background: url(" + rarity.rewardBackground + ");";

            if (item.type !== 'emote') {
                //Prepare info element
                infoContainerElem.style.display = 'flex';
                var titleInfoElement = infoContainerElem.querySelector('.reward-info-text');
                var lvlElement = infoContainerElem.querySelector('.reward-lvl-text');
                var perkListElement = infoContainerElem.querySelector('.reward-perks-list');

                var maxLevel = item.levels.slice(-1)[0].level;

                titleInfoElement.innerHTML = this.localization.translate('max-perks-at');
                lvlElement.innerHTML = this.localization.translate('lvl') + ' ' + maxLevel;
                this.preparePerksElement(item.levels, rarity, perkListElement);
            } else {
                infoContainerElem.style.display = 'none';
            }

            //Return item reward html
            return itemElement;
        }
    }, {
        key: "preparePerksElement",
        value: function preparePerksElement(perks, rarity, perksListElement) {
            var perkTemplate = document.querySelector('#item-perk-element');

            var addedPerks = {};
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(perks), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var level = _step3.value;

                    var levelPerks = level.perks;
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = (0, _getIterator3.default)(levelPerks), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var perk = _step4.value;

                            var objId = getPerkId(perk);

                            if (addedPerks[objId]) {
                                var addedPerk = addedPerks[objId];
                                if (addedPerk.perkType === 'boon') continue;else if (addedPerk.perkType === 'protection') {
                                    addedPerk.value += perk.params.protection;
                                    addedPerk.perkValueElement.innerHTML = '-' + addedPerk.value;
                                } else {
                                    addedPerk.value += perk.params.resistance;
                                    addedPerk.perkValueElement.innerHTML = addedPerk.value + '%';
                                }
                            } else {
                                var perkElement = perkTemplate.content.cloneNode(true);

                                var perkTextElement = perkElement.querySelector('.item-perk-name-text');
                                var perkValueElement = perkElement.querySelector('.item-perk-value');
                                var perkValueBoxElement = perkElement.querySelector('.item-perk-value-container');

                                var value = null;
                                if (perk.type === 'boon') perkValueElement.style = 'content: url(../img/gui/perk-icon.svg)';else if (perk.type === 'protection') {
                                    value = perk.params.protection;
                                    perkValueElement.innerHTML = '-' + value;
                                } else {
                                    value = perk.params.resistance;
                                    perkValueElement.innerHTML = value + '%';
                                }

                                perkValueBoxElement.style = "background: url(" + rarity.perkBackground + ");";

                                perkTextElement.innerHTML = getPerkText(this.localization, perk);

                                addedPerks[objId] = { value: value, perkType: perk.type, perkValueElement: perkValueElement };

                                perksListElement.append(perkElement);
                            }
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: "equipGear",
        value: function equipGear() {
            var currentItem = this.rewardsItems[this.currentIndex];
            if (currentItem.equipped || currentItem.recycled) return;

            //Special case emotes
            if (currentItem.itemDef.type === 'emote') {
                this.hide();

                // Go to armory tab
                document.querySelector('#equipment-button').click();
                return;
            }

            //Update current item status and buttons
            this.rewardsItems[this.currentIndex].equipped = true;
            this.rewardsItems[this.currentIndex].buttons.right.cssClassList = ['btn-check'];
            this.modal.updateButtons(this.rewardsItems[this.currentIndex].buttons);

            //Update other items status and buttons
            var length = this.rewardsItems.length;
            for (var i = 0; i < length; i++) {
                if (i == this.currentIndex) continue;

                var item = this.rewardsItems[i];
                if (item.itemDef && item.itemDef.type === currentItem.itemDef.type) {
                    this.rewardsItems[i].equipped = false;
                    this.rewardsItems[i].buttons.right.cssClassList = null;
                }
            }

            //Equip modal current gear
            var gearParams = {
                userItem: currentItem.userItem,
                definition: currentItem.itemDef
            };
            this.armoryGearMenu.equipGearLoadout(gearParams, true);
        }
    }, {
        key: "recycleGear",
        value: function recycleGear() {
            var _this = this;

            var currentItem = this.rewardsItems[this.currentIndex];
            if (currentItem.recycled) return;

            //Update current item status and buttons if recycled
            var recycleCallBack = function recycleCallBack() {
                _this.rewardsItems[_this.currentIndex].recycled = true;
                _this.rewardsItems[_this.currentIndex].equipped = false;
                _this.rewardsItems[_this.currentIndex].buttons.left.cssClassList = ['btn-check'];
                _this.rewardsItems[_this.currentIndex].buttons.right.cssClassList = ['btn-disabled'];
                //this.modal.updateButtons(this.rewardsItems[this.currentIndex].buttons);
                _this.hide();
            };

            //Recycle item
            var modalRecycle = new ModalRecycle(this.account, this.localization, currentItem.itemDef, currentItem.userItem, recycleCallBack.bind(this));
            modalRecycle.show();
        }
    }, {
        key: "showNextItem",
        value: function showNextItem() {
            if (this.opts.chestModal) {
                return this.hide();
            }

            if (this.currentIndex >= this.rewardsItems.length - 1) {
                return this.hide();
            }

            var levelElement = this.itemContainerElement.removeChild(this.itemContainerElement.querySelector('.reward-lvl'));
            var itemElement = this.itemContainerElement.removeChild(this.itemContainerElement.querySelector('.reward-item-container') || this.itemContainerElement.querySelector('.reward-gold-container'));
            this.rewardsItems[this.currentIndex].htmlContent = [levelElement, itemElement];
            //Old update for showing items in circular "carrousel"
            /*this.currentIndex = (this.currentIndex + 1) % this.rewardsItems.length;*/

            this.currentIndex = this.currentIndex + 1; //Fix for new flow (show items one by one)

            this.updateItem();
            this.modal.mount(); //This is necessary to add the close/buttons eventlisteners again (because hide() remove them)
            this.show();
        }
    }, {
        key: "showPrevItem",
        value: function showPrevItem() {
            if (this.opts.chestModal) {
                return this.hide();
            }
            var levelElement = this.itemContainerElement.removeChild(this.itemContainerElement.querySelector('.reward-lvl'));
            var itemElement = this.itemContainerElement.removeChild(this.itemContainerElement.querySelector('.reward-item-container') || this.itemContainerElement.querySelector('.reward-gold-container'));
            this.rewardsItems[this.currentIndex].htmlContent = [levelElement, itemElement];

            this.currentIndex = (this.currentIndex ? this.currentIndex : this.rewardsItems.length) - 1;
            this.updateItem();
        }
    }, {
        key: "updateItem",
        value: function updateItem() {
            //Update item content
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(this.rewardsItems[this.currentIndex].htmlContent), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var element = _step5.value;

                    this.itemContainerElement.append(element);
                }

                //Update buttons
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.modal.updateButtons(this.rewardsItems[this.currentIndex].buttons);

            //this.updateItemCounter();
        }
    }, {
        key: "updateItemCounter",
        value: function updateItemCounter() {
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = (0, _getIterator3.default)(this.itemCounterIndicator.children), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var child = _step6.value;

                    if (child.getAttribute('idx') == this.currentIndex) {
                        child.classList.add('filled');
                    } else {
                        child.classList.remove('filled');
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
    }, {
        key: "show",
        value: function show() {
            this.modal.show();
        }
    }, {
        key: "hide",
        value: function hide() {
            this.modal.hide();
        }
    }, {
        key: "onShow",
        value: function onShow(fn) {
            this.modal.onShow(fn);
        }
    }, {
        key: "onHide",
        value: function onHide(fn) {
            this.modal.onHide(fn);
        }
    }]);
    return ModalSeasonRewards;
}();

module.exports = ModalSeasonRewards;
