"use strict";


var _set = require("./ed9971da.js");

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var BugBattleService = function () {
    function BugBattleService() {
        (0, _classCallCheck3.default)(this, BugBattleService);

        this.subscribers = new _set2.default();
        this.Gleap = null;
        this.currentGameData = {};
        this.currentCountGame = 0;
        this.init();
    }

    (0, _createClass3.default)(BugBattleService, [{
        key: 'init',
        value: function init() {
            var _this = this;

            // Wait for Gleap to be loaded.
            // @ts-ignore
            window.onGleapLoaded = function (Gleap) {
                _this.Gleap = Gleap;
                _this.subscribers.forEach(function (subscriber) {
                    subscriber();
                    _this.subscribers.delete(subscriber);
                });

                _this.identify();
                //this.Gleap.setCustomerEmail('hero@bitheroesarena.com');
                if (false) {}
            };
        }
    }, {
        key: 'setupForDev',
        value: function setupForDev() {
            this.Gleap.enableCrashDetector(false, false);
        }
    }, {
        key: 'identify',
        value: function identify() {
            var _this2 = this;

            var callback = function callback() {
                _this2.Gleap.identify('BHA', {
                    name: 'BHA',
                    email: 'hero@bitheroesarena.io'
                });
            };
            if (this.Gleap) {
                callback();
                return;
            }
            this.subscribers.add(callback);
        }

        /**
         * 
         * @param {string} eventName 
         * @param {Object} [data] 
         */

    }, {
        key: 'logEvent',
        value: function logEvent(eventName, data) {
            var _this3 = this;

            var callback = function callback() {
                _this3.Gleap.logEvent(eventName, data);
            };
            if (this.Gleap) {
                callback();
                return;
            }
            this.subscribers.add(callback);
        }

        /**
         * 
         * @param {Object} data 
         * @returns 
         */

    }, {
        key: 'attachCustomData',
        value: function attachCustomData(data) {
            var _this4 = this;

            var callback = function callback() {
                _this4.Gleap.attachCustomData(data);
            };
            if (this.Gleap) {
                callback();
                return;
            }
            this.subscribers.add(callback);
        }

        /**
         * @param {string} key
         * @param {Object} data
         */

    }, {
        key: 'setCustomData',
        value: function setCustomData(key, data) {
            var _this5 = this;

            var callback = function callback() {
                _this5.Gleap.setCustomData(key, data);
            };
            if (this.Gleap) {
                callback();
                return;
            }
            this.subscribers.add(callback);
        }

        /**
         * 
         * @param {string} key 
         * @param {any} data 
         */

    }, {
        key: 'setCurrentGameData',
        value: function setCurrentGameData(key, data) {
            this.currentGameData[key] = data;
            this.currentGameData['elapsed'] = Date.now() - this.currentGameData.startTime;
            this.setCustomData('currentGame', this.currentGameData);
        }
    }, {
        key: 'startGameData',
        value: function startGameData() {
            this.currentCountGame += 1;
            this.currentGameData = {
                gamesCount: this.currentCountGame,
                startTime: Date.now(),
                elapsed: 0
            };
            this.setCustomData('currentGame', this.currentGameData);
        }
    }, {
        key: 'hasCurrentGameData',
        value: function hasCurrentGameData(key) {
            return !!this.currentGameData[key];
        }
    }, {
        key: 'isOpened',
        value: function isOpened() {
            return this.Gleap ? this.Gleap.isOpened() : false;
        }
    }]);
    return BugBattleService;
}();

module.exports = BugBattleService;
