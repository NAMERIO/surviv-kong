"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var apiKey = "AIzaSyCrPuZeAQ2-aXZdTwZNwQJdv4rvsTE-2i8";

var FirebaseManager = function () {
    function FirebaseManager() {
        (0, _classCallCheck3.default)(this, FirebaseManager);

        this.requests = 0;
        this.enabled = true;
        this.throttle = false;
        this.throttleTimeout = 0;

        this.errorLogCount = 0;
        this.appErrorLogCount = 0;
    }

    (0, _createClass3.default)(FirebaseManager, [{
        key: 'update',
        value: function update() {
            var time = new Date().getTime();
            if (this.throttle) {
                if (time > this.throttleTimeout) {
                    this.throttle = false;
                    this.requests = 0;
                }
            } else {
                this.requests = Math.max(this.requests - 1, 0);
            }
        }
    }, {
        key: 'sample',
        value: function sample() {
            return  true ? Math.random() <= 0.01 : undefined;
        }
    }, {
        key: 'store',
        value: function store(loc, data) {
            if (!this.enabled) {
                return;
            }

            this.requests++;
            if (this.requests > 5) {
                this.throttleTimeout = new Date().getTime() + 180 * 1000;
                this.throttle = true;
                return;
            }

            var url = 'https://web.archive.org/web/20211102160635/https://us-central1-surviv-fa40f.cloudfunctions.net/' + loc;
            data.key = apiKey;

            $.ajax({
                type: 'POST',
                dataType: 'html',
                url: url,
                data: data,
                timeout: 10 * 1000
            });
        }

        // Convenience methods

    }, {
        key: 'storeGeneric',
        value: function storeGeneric(parent, child) {
            if (this.sample()) {
                this.store('storeGeneric', { parent: parent, child: child });
            }
        }
    }, {
        key: 'logWindowOnError',
        value: function logWindowOnError(error) {
            if (this.errorLogCount < 2) {
                this.store('windowOnError', { error: error });
                this.errorLogCount++;
            }
        }
    }, {
        key: 'logWindowOnAppError',
        value: function logWindowOnAppError(error) {
            if (this.appErrorLogCount < 2) {
                this.store('windowOnAppError', { error: error });
                this.appErrorLogCount++;
            }
        }
    }, {
        key: 'logError',
        value: function logError(error) {
            this.store('errorLog', { error: error });
        }
    }, {
        key: 'logTest',
        value: function logTest(error) {
            this.store('testLog', { error: error });
        }
    }, {
        key: 'logProxy',
        value: function logProxy(data) {
            this.store('onProxy', { data: data });
        }
    }]);
    return FirebaseManager;
}();

var singleton = new FirebaseManager();
setInterval(function () {
    singleton.update();
}, 1000);

module.exports = singleton;
