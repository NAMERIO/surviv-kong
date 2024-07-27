"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//ts-check

var math = require("./10899aea.js");

var kDefaultShowTime = 3;

var Notification = function () {
    function Notification(parent, localization, text) {
        var showTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        (0, _classCallCheck3.default)(this, Notification);

        this.localization = localization;
        this.textLocalized = this.localization.translate(text) || text;

        this.showTime = showTime || kDefaultShowTime;

        this.currentAnimTime = 0;
        this.currentShowTime = 0;
        this.currentPosition = -100;
        this.currentTarget = 0;

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#notification-template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.container = /** @type{HTMLElement} */node.querySelector('.side-notification-container');

        this.mount();
        parent.appendChild(node);
        this.animate = true;
    }

    (0, _createClass3.default)(Notification, [{
        key: 'mount',
        value: function mount() {
            /** @type{HTMLDivElement} */
            this.textElement = this.container.querySelector('.side-notification-text');

            this.textElement.innerText = this.textLocalized;
        }
    }, {
        key: 'update',
        value: function update(dt) {
            if (!this.animate) return;

            if (this.currentPosition != this.currentTarget) {
                if (this.currentTarget < 0) this.currentAnimTime -= dt;else this.currentAnimTime += dt;

                var t = math.clamp(this.currentAnimTime, 0.0, 1.0);
                this.currentPosition = Math.floor(math.lerp(math.easeOutExpo(t), -100, 0));

                this.container.style.left = this.currentPosition + '%';
            } else if (this.currentTarget != -100) {
                this.currentShowTime += dt;

                if (this.currentShowTime >= this.showTime) {
                    this.currentTarget = -100;
                }
            }

            if (this.currentShowTime >= this.showTime && this.currentPosition <= this.currentTarget) {
                this.animate = false;
                this.container.style.display = 'none';
            }
        }
    }]);
    return Notification;
}();

module.exports = Notification;
