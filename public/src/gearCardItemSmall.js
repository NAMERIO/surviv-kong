"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

var GearCardItemSmall = function () {
    /**
     * 
     * @param {HTMLElement | DocumentFragment} parent 
     * @param {typeof import('./../../../../data/game/game-objects/gear/armors')['armor_adventurertunic']} itemDef 
     */
    function GearCardItemSmall(parent, itemDef) {
        (0, _classCallCheck3.default)(this, GearCardItemSmall);

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#gear_card_item_small_template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type{HTMLElement} */node.querySelector('.gear-card-item-small');
        this.mount(itemDef);
        parent.appendChild(node);
    }

    /**
     * 
     * @param {typeof import('./../../../../data/game/game-objects/gear/armors')['armor_adventurertunic']} itemDef 
     */


    (0, _createClass3.default)(GearCardItemSmall, [{
        key: 'mount',
        value: function mount(itemDef) {
            this.card.classList.add(itemDef.rarity);
            /** @type {HTMLImageElement} */
            var image = this.card.querySelector('.gear-card-item-small_img');
            image.src = itemDef.images.sm;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.card.remove();
        }
    }]);
    return GearCardItemSmall;
}();

module.exports = GearCardItemSmall;
