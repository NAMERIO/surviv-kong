"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = require("./helpers.js");
var device = require("./device.js");

var kTestUrls = [{ region: 'na', zone: 'sfo', url: 'na-sfo-p1.bitheroesarena.com' }, { region: 'na', zone: 'lax', url: 'na-lax-p1.bitheroesarena.com' }, { region: 'na', zone: 'nyc', url: 'na-nyc-p1.bitheroesarena.com' }, { region: 'na', zone: 'chi', url: 'na-chi-p1.bitheroesarena.com' }, { region: 'eu', zone: 'fra', url: 'eu-fra-p1.bitheroesarena.com' }, { region: 'as', zone: 'sgp', url: 'as-sgp-p1.bitheroesarena.com' }];

// These zones are blacklisted for mobile
if (!device.mobile) {
    kTestUrls.push({ region: 'sa', zone: 'sao', url: 'sa-sao-p1.bitheroesarena.com' });
    kTestUrls.push({ region: 'eu', zone: 'waw', url: 'eu-waw-p1.bitheroesarena.com' });
    kTestUrls.push({ region: 'as', zone: 'vnm', url: 'as-vnm-p1.bitheroesarena.com' });
    kTestUrls.push({ region: 'kr', zone: 'sel', url: 'kr-sel-p1.bitheroesarena.com' });
}

if (false) {}

//
// PingTest
//

var PingTest = function () {
    function PingTest() {
        (0, _classCallCheck3.default)(this, PingTest);

        this.ptcDataBuf = new ArrayBuffer(1);

        this.tests = kTestUrls.map(function (x) {
            return {
                region: x.region,
                zone: x.zone,
                url: x.url,
                ping: 9999,
                active: false,
                complete: false,
                ws: null,
                sendDelay: 0.0,
                sendTime: 0,
                sendCount: 0,
                recvCount: 0,
                recvCountMax: 6,
                retryCount: 0,
                retryCountMax: 1
            };
        });
        this.testsStarted = 0;
        this.testsCompleted = 0;
        this.printSummary = true;
    }

    (0, _createClass3.default)(PingTest, [{
        key: 'start',
        value: function start(regions) {
            if (!('WebSocket' in window)) {
                return;
            }

            var startCount = 0;
            for (var i = 0; i < this.tests.length; i++) {
                var test = this.tests[i];
                var start = !test.active && !test.complete && regions.indexOf(test.region) !== -1;
                if (start) {
                    test.active = true;
                    this.testsStarted++;
                    startCount++;
                }
            }

            if (startCount > 0) {
                this.printSummary = true;
            }
        }
    }, {
        key: 'update',
        value: function update(dt) {
            var _this = this;

            var completeTest = function completeTest(test) {
                test.active = false;
                test.complete = true;
                _this.testsCompleted++;
            };

            var onClose = function onClose(test) {
                if (test.ws) {
                    test.ws.close();
                    test.ws = null;
                }

                if (!test.complete) {
                    if (test.retryCount++ >= test.retryCountMax) {
                        completeTest(test);
                    }
                }
            };

            var _loop = function _loop(i) {
                var test = _this.tests[i];
                if (!test.active) {
                    return 'continue';
                }

                if (!test.ws) {
                    var proto =  false ? undefined : 'wss://';
                    var ws = new WebSocket(proto + test.url + '/ptc');
                    ws.binaryType = 'arraybuffer';
                    ws.onopen = function () {};
                    ws.onmessage = function (msg) {
                        var elapsed = (Date.now() - test.sendTime) / 1000.0;
                        test.ping = Math.min(test.ping, elapsed);
                        test.recvCount++;
                        test.sendDelay = 0.125;
                    };
                    ws.onerror = function (err) {
                        onClose(test);
                    };
                    ws.onclose = function () {
                        onClose(test);
                    };

                    test.ws = ws;
                    test.sendDelay = 0.0;
                    test.sendCount = 0;
                    test.recvCount = 0;
                }

                if (test.ws.readyState == test.ws.OPEN) {
                    test.sendDelay -= dt;
                    if (test.sendCount == test.recvCount && test.sendDelay < 0.0) {
                        test.sendTime = Date.now();
                        test.sendCount++;
                        try {
                            test.ws.send(_this.ptcDataBuf);
                        } catch (e) {
                            test.ws.close();
                        }
                    }
                    if (test.recvCount >= test.recvCountMax) {
                        completeTest(test);
                        test.ws.close();
                    }
                }
            };

            for (var i = 0; i < this.tests.length; i++) {
                var _ret = _loop(i);

                if (_ret === 'continue') continue;
            }

            if (this.printSummary && this.isComplete()) {
                var sorted = this.tests.sort(function (a, b) {
                    return a.ping - b.ping;
                });
                console.log('Ping test results');
                console.log('----------------------------------------');
                for (var i = 0; i < sorted.length; i++) {
                    var _test = sorted[i];
                    console.log('region', _test.region, 'zone  ', _test.zone, 'ping  ', _test.ping);
                }

                this.printSummary = false;
            }
        }
    }, {
        key: 'isComplete',
        value: function isComplete() {
            return this.testsCompleted == this.testsStarted && this.testsStarted > 0;
        }
    }, {
        key: 'getRegionList',
        value: function getRegionList() {
            var regions = [];
            for (var i = 0; i < kTestUrls.length; i++) {
                var r = kTestUrls[i].region;
                if (regions.indexOf(r) === -1) {
                    regions.push(r);
                }
            }
            return regions;
        }
    }, {
        key: 'getRegion',
        value: function getRegion() {
            var sorted = this.tests.sort(function (a, b) {
                return a.ping - b.ping;
            });
            return this.tests[0].region;
        }
    }, {
        key: 'getZones',
        value: function getZones(region) {
            var sorted = this.tests.sort(function (a, b) {
                return a.ping - b.ping;
            });
            var zones = [];
            for (var i = 0; i < sorted.length; i++) {
                var s = sorted[i];
                if (s.region == region) {
                    zones.push(s.zone);
                }
            }
            return zones;
        }
    }]);
    return PingTest;
}();

module.exports = PingTest;
