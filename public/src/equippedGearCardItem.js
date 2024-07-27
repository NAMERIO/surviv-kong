"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require("./35dbdceb.js"),
    getPerkText = _require.getPerkText,
    getUniqueGearPerks = _require.getUniqueGearPerks;

// @ts-check


var EquippedGearCardItem = function () {
    /**
     * 
     * @param {string} gearType 
     * @param {import('./../localization')} localization 
     * @param {HTMLElement} parent 
     */
    function EquippedGearCardItem(gearType, localization, parent) {
        (0, _classCallCheck3.default)(this, EquippedGearCardItem);

        this.localization = localization;
        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#equip_gear_card_item');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type{HTMLElement} */node.querySelector('.equip-gear-box');
        this.mount();
        parent.appendChild(node);
        this.gear = null;
        this.gearType = gearType;
    }

    (0, _createClass3.default)(EquippedGearCardItem, [{
        key: 'mount',
        value: function mount() {
            this.image = this.card.querySelector('img');
            this.perkList = this.card.querySelector('.perk-list');
            /** @type {HTMLDivElement}*/
            this.borderColor = this.card.querySelector('.img-box-wrapper');
        }

        /**
         * @param {{ userItem?: any, definition?: any }} gear
         */

    }, {
        key: 'updateGearCard',
        value: function updateGearCard(gear) {
            var _this = this;

            this.borderColor.dataset.border = 'border-' + gear.definition.rarity;
            this.borderColor.classList.add(gear.definition.rarity);
            this.image.src = gear.definition.images.sm;
            var perks = getUniqueGearPerks(gear);
            var perkList = perks.map(function (perk) {
                var perksList = '<span class="font-edit text-gray h7 uppercase">' + getPerkText(_this.localization, perk) + '</span>';
                return '<span class="perk-list flex flex-col mb-2">' + perksList + '</span>';
            });
            this.perkList.innerHTML = perkList.join('');
        }

        /**
          * @param {{ userItem?: any, definition?: any }} gear
          */

    }, {
        key: 'update',
        value: function update(gear) {
            this.borderColor.classList.remove(this.borderColor.dataset.border);

            if (!gear || !gear.definition || !gear.userItem) {
                this.borderColor.dataset.border = 'border-gray';
                this.image.src = 'img/gui/loadout-tab-' + this.gearType + '.png';
                this.perkList.innerHTML = '<span class="self-center font-edit text-gray-9 h7 uppercase">' + this.localization.translate('not-gear-equipped').replace('[gear]', this.localization.translate('gear-title-' + this.gearType)) + '</span>';
                this.image.dataset.filter = 'filter-gray-0';
                this.image.classList.add(this.image.dataset.filter);
            } else {
                this.image.classList.remove(this.image.dataset.filter);
                this.updateGearCard(gear);
            }
            this.borderColor.classList.add(this.borderColor.dataset.border);
            this.gear = gear;
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }]);
    return EquippedGearCardItem;
}();

module.exports = EquippedGearCardItem;
