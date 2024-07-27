"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameConfig = require("./gameConfig.js");

var ExtraPouchBoon = function () {
    function ExtraPouchBoon(player, isRunningOnClient) {
        _classCallCheck(this, ExtraPouchBoon);

        this.id = 1;
        this.name = 'boon_extrapouch';
        this.isRunningOnClient = isRunningOnClient;
        this.player = player;
        this.active = false;
        this.slotIndex = -1;
    }

    _createClass(ExtraPouchBoon, [{
        key: 'start',
        value: function start() {
            if (this.isRunningOnClient) {
                return;
            }

            this.active = true;
            this.slotIndex = this.player.slotsInventorySize;
            this.player.slotsInventorySize = this.player.slotsInventorySize + 1;

            this.player.slotsInventory[this.slotIndex] = {
                item: '',
                total: 0
            };
            this.player.inventoryDirty = true;

            //console.log('[ExtraPouchBoon] slotsInventory', this.player.slotsInventory);
        }
    }, {
        key: 'update',
        value: function update() {}
    }, {
        key: 'updateData',
        value: function updateData() {}
    }, {
        key: 'stop',
        value: function stop() {
            if (this.isRunningOnClient) {
                return;
            }
            this.player.slotsInventorySize = this.player.slotsInventorySize - 1;
            delete this.player.slotsInventory[this.slotIndex];
        }
    }, {
        key: 'render',
        value: function render() {}
    }]);

    return ExtraPouchBoon;
}();

module.exports = ExtraPouchBoon;
