"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SurvivLoading = function () {
    function SurvivLoading() {
        (0, _classCallCheck3.default)(this, SurvivLoading);

        this.loadingScren = document.getElementById('surviv-loading-screen');
    }

    (0, _createClass3.default)(SurvivLoading, [{
        key: 'showSurvivLoading',
        value: function showSurvivLoading() {
            if (this.loadingScren.classList && !this.loadingScren.classList.contains('showLoading')) {
                this.loadingScren.classList.add('showLoading');
            }
        }
    }, {
        key: 'hideSurvivLoading',
        value: function hideSurvivLoading() {
            if (this.loadingScren.classList && this.loadingScren.classList.contains('showLoading')) {
                this.loadingScren.classList.remove('showLoading');
            }
        }
    }]);
    return SurvivLoading;
}();

// Singleton


var survivLoading = new SurvivLoading();

module.exports = survivLoading;

