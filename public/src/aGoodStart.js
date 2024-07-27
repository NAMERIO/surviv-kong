"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//@ts-check

var MIN_CHANCE = 0.05;

var AGoodStart = function () {
    /**
     * @param {import('../../server/src/player').Player} player
     * @param {boolean} isRunningOnClient
     * @param {any} def
     * @param {any} params
     */
    function AGoodStart(player, isRunningOnClient, def, params) {
        _classCallCheck(this, AGoodStart);

        this.id = 3;
        this.player = player;
        this.isRunningOnClient = isRunningOnClient;
        this.def = def;
        this.params = params;
        this.chance = MIN_CHANCE;
    }

    _createClass(AGoodStart, [{
        key: "start",
        value: function start() {
            if (this.isRunningOnClient) {
                return;
            }
        }
    }, {
        key: "update",
        value: function update() {}
    }, {
        key: "updateData",
        value: function updateData() {}
    }, {
        key: "stop",
        value: function stop() {}
    }, {
        key: "render",
        value: function render() {}
    }]);

    return AGoodStart;
}();

module.exports = AGoodStart;
