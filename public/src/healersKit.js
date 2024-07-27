"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// @ts-check

var HealersKit = function () {

    /**
     * @param {import('../../server/src/player').Player} player
     * @param {boolean} isRunningOnClient
     * @param {any} def
     * @param {any} params
     */
    function HealersKit(player, isRunningOnClient, def, params) {
        _classCallCheck(this, HealersKit);

        this.id = 2;
        this.player = player;
        this.isRunningOnClient = isRunningOnClient;
        this.def = def;
        this.params = params;
    }

    _createClass(HealersKit, [{
        key: 'start',
        value: function start() {
            if (this.isRunningOnClient) {
                return;
            }
            //@TODO: remove duplicated code, receive item and total from params, don't add this boon to the net
            var item = 'hppotionlarge'; // this.params.item;
            var slotId = -1;
            for (var i = 0; i < this.player.slotsInventorySize; i++) {
                var slot = this.player.slotsInventory[i];
                if (slot.item === item) {
                    if (!(slot.total >= this.player.getSlotSize(item))) {
                        slotId = i;
                    }
                } else if (slot.item === '' && slotId === -1) {
                    slotId = i;
                    break;
                }
            }

            if (slotId === -1) {
                return;
            }

            this.player.slotsInventory[slotId] = {
                item: item,
                total: this.player.slotsInventory[slotId].total + 1
            };
            this.inventoryDirty = true;
        }
    }, {
        key: 'update',
        value: function update() {}
    }, {
        key: 'updateData',
        value: function updateData() {}
    }, {
        key: 'stop',
        value: function stop() {}
    }, {
        key: 'render',
        value: function render() {}
    }]);

    return HealersKit;
}();

module.exports = HealersKit;
