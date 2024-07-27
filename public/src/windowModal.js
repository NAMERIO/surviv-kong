"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

var WindowModal = function () {
    /**
     * 
     * @param {HTMLElement} element 
     */
    function WindowModal(element) {
        (0, _classCallCheck3.default)(this, WindowModal);

        this.hidden = true;
        this.element = element;
        this.element.hidden = this.hidden;
        this.element.addEventListener('animationend', this.onAnimationEnd.bind(this));
    }

    (0, _createClass3.default)(WindowModal, [{
        key: 'onAnimationEnd',
        value: function onAnimationEnd() {
            if (this.hidding) {
                this.hidden = true;
                this.hidding = false;
            } else {
                this.hidden = false;
            }
            this.element.hidden = this.hidden;
        }
    }, {
        key: 'show',
        value: function show() {
            if (!this.hidden) {
                return;
            }
            this.hidding = false;
            this.hidden = false;
            this.element.hidden = false;
            //this.element.classList.remove('window-modal-on-exit');
            // this.element.classList.add('window-modal-on-enter');
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (this.hidden) {
                return;
            }
            this.hidding = true;
            this.hidden = true;
            this.element.hidden = true;
            //this.element.classList.remove('window-modal-on-enter');
            // this.element.classList.add('window-modal-on-exit');
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.element.removeEventListener('animationend', this.onAnimationEnd.bind(this));
        }
    }]);
    return WindowModal;
}();

module.exports = WindowModal;
