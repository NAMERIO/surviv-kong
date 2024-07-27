"use strict";


var _set = require("./ed9971da.js");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var GearCardItem = function () {
    /**
     * 
     * @param {{ userItem?: any, definition?: any }} gear 
     * @param {Element} parent 
     * @param {string} type
     */
    function GearCardItem(gear, parent, type) {
        (0, _classCallCheck3.default)(this, GearCardItem);

        this.type = type;
        this.gear = gear;
        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#gear_card_item');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type {Element} */node.querySelector('.gear-card-item');
        this.card.dataset.borderClass = 'outline-gear-card-item';
        this.mount();
        /** @type{Set<(card: GearCardItem) => void>} */
        this.subscribers = new _set2.default();
        parent.appendChild(node);
    }

    /**
     * 
     * @param {(card: GearCardItem) => void} subs 
     */


    (0, _createClass3.default)(GearCardItem, [{
        key: 'onClick',
        value: function onClick(subs) {
            this.subscribers.add(subs);
        }
    }, {
        key: 'select',
        value: function select() {
            this.card.classList.add(this.card.dataset.borderClass);
        }
    }, {
        key: 'deselect',
        value: function deselect() {
            this.card.classList.remove(this.card.dataset.borderClass);
        }
    }, {
        key: 'triggerSelect',
        value: function triggerSelect() {
            this.clickCallback();
        }
    }, {
        key: 'mount',
        value: function mount() {
            var _this = this;

            this.clickCallback = function () {
                _this.subscribers.forEach(function (subs) {
                    return subs(_this);
                });
            };
            /** @type{HTMLDivElement} */
            this.imgContainer = this.card.querySelector('.img-box-wrapper');
            this.image = this.card.querySelector('img');
            /** @type{HTMLSpanElement} */
            this.name = this.card.querySelector('.gear-level');
            this.card.addEventListener('click', this.clickCallback);
            this.update(this.gear);
        }
    }, {
        key: 'update',


        /**
         * @param {{ userItem?: any; definition?: any; }} gear
         */
        value: function update(gear) {
            this.gear = gear;
            this.name.classList.remove(this.name.dataset.colorClass);
            this.imgContainer.classList.remove(this.imgContainer.dataset.colorClass);
            this.image.classList.remove('no-item-equipped');
            if (!this.gear.definition) {
                this.image.classList.add('filter-gray-scale-1');
                this.image.src = 'img/gui/loadout-tab-' + this.type + '.png';
                this.name.innerText = 'No ' + this.type;
                this.name.dataset.colorClass = 'text-gray-3';
                this.imgContainer.dataset.colorClass = 'border-gray-4';
                this.image.classList.add('no-item-equipped');
                this.name.hidden = true;
            } else {
                this.image.classList.remove('filter-gray-scale-1');
                this.card.querySelector('img').src = this.gear.definition.images.md;
                this.name.innerText = 'LEVEL ' + (this.unlocked ? this.gear.userItem.level : 1);
                this.name.dataset.colorClass = 'text-' + this.gear.definition.rarity;
                this.imgContainer.dataset.colorClass = 'border-' + this.gear.definition.rarity;
                this.image.classList.remove('filter-gray-1');
                this.name.hidden = false;
                if (!this.unlocked) {
                    this.image.classList.add('filter-gray-1');
                }
            }
            this.name.classList.add(this.name.dataset.colorClass);
            this.imgContainer.classList.add(this.imgContainer.dataset.colorClass);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.subscribers = null;
            this.card.removeEventListener('click', this.clickCallback);
            this.card.remove();
        }
    }, {
        key: 'unlocked',
        get: function get() {
            return !!this.gear.userItem;
        }
    }]);
    return GearCardItem;
}();

module.exports = GearCardItem;
