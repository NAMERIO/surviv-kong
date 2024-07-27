"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@ts-check

var _require = require("./net.js"),
    Constants = _require.Constants;

var TimerDisplay = function () {
    function TimerDisplay(localization, parent, title, endDate) {
        var onComplete = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
        var startDate = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
        (0, _classCallCheck3.default)(this, TimerDisplay);

        this.type = type;
        this.localization = localization;

        this.titleLocalized = title ? this.localization.translate(title) || title : '';
        this.endDate = endDate;
        this.startDate = startDate;

        this.onComplete = onComplete;

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#timer-template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.timer = /** @type{HTMLElement} */node.querySelector('.timer-container');

        this.totalTime = -1;
        this.mount();
        parent.innerHTML = '';
        parent.appendChild(node);
    }

    (0, _createClass3.default)(TimerDisplay, [{
        key: 'mount',
        value: function mount() {
            /** @type{HTMLDivElement} */
            this.title = this.timer.querySelector('.title');
            /** @type{HTMLDivElement} */
            this.currentTime = this.timer.querySelector('.time');

            this.title.innerText = this.titleLocalized;

            this.interval = setInterval(this._intervalFunction.bind(this), 1000);

            /** @type{HTMLDivElement} */
            this.progressBar = this.timer.querySelector('.timer-progress-bar');
        }

        /**
         * @param {any} newTime
         */

    }, {
        key: 'updateTime',
        value: function updateTime(newTime) {
            this.endDate = newTime;
            if (!this.interval) {
                this.totalTime = -1;
                setInterval(this._intervalFunction.bind(this), 1000);
            }
        }

        /**
         * @param {any} title
         */

    }, {
        key: 'updateTitle',
        value: function updateTitle(title) {
            this.titleLocalized = this.localization.translate(title);
            this.title.innerText = this.titleLocalized;
        }
    }, {
        key: '_intervalFunction',
        value: function _intervalFunction() {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = this.endDate - now;

            if (this.totalTime == -1) {
                this.totalTime = distance;
            }

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
            var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
            var seconds = Math.floor(distance % (1000 * 60) / 1000);

            //Brayinja Formulas
            var progress = 0;

            if (this.type == 'quests') {
                var interval = 1000 * 60 * 60 * 24;
                progress = Math.floor((interval - distance) / interval * 100);
            }

            if (this.type == 'season') {
                progress = Math.floor(Math.abs(now - this.startDate) / (this.endDate - this.startDate) * 100);
            }

            this.progressBar.style.setProperty('--progress', progress + '%');

            if (hours < 10)
                // @ts-ignore
                hours = '0' + hours;

            if (minutes < 10)
                // @ts-ignore
                minutes = '0' + minutes;

            if (seconds < 10)
                // @ts-ignore
                seconds = '0' + seconds;

            var space = this.titleLocalized != '' ? '&nbsp;' : '';

            if (days) this.currentTime.innerHTML = '' + space + days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';else this.currentTime.innerHTML = '' + space + hours + 'h ' + minutes + 'm ' + seconds + 's';

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(this.interval);
                this.interval = null;
                this.currentTime.innerHTML = space + this.localization.translate('ready-timer');
                if (this.onComplete) setTimeout(this.onComplete, 2000);
            }
        }
    }]);
    return TimerDisplay;
}();

module.exports = TimerDisplay;
