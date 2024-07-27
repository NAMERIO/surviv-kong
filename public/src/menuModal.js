"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");

//
// MenuModal
//

var MenuModal = function () {
    function MenuModal(selector) {
        var _this = this;

        (0, _classCallCheck3.default)(this, MenuModal);

        this.selector = selector;
        this.checkSelector = true;
        this.skipFade = false;
        this.visible = false;

        this.onShowFn = function () {};
        this.onHideFn = function () {};

        selector.find('.close').click(function (e) {
            _this.hide();
        });

        this.modalCloseListener = function (e) {
            //console.log('modalCloseListener', e.target);
            if ($(e.target).closest('.modal-close').length == 0 && ($(e.target).is(selector) || !_this.checkSelector)) {
                e.stopPropagation();
                _this.hide();
            }
        };
    }

    (0, _createClass3.default)(MenuModal, [{
        key: 'onShow',
        value: function onShow(fn) {
            this.onShowFn = fn;
        }
    }, {
        key: 'onHide',
        value: function onHide(fn) {
            this.onHideFn = fn;
        }
    }, {
        key: 'isVisible',
        value: function isVisible() {
            return this.visible;
        }
    }, {
        key: 'show',
        value: function show(isModal) {
            if (!this.visible) {
                this.visible = true;

                this.selector.finish();
                this.selector.css('display', 'block');

                this.onShowFn();

                if (!isModal) {
                    $(document).on('click touchend', this.modalCloseListener);
                }
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (this.visible) {
                this.visible = false;

                if (this.skipFade) {
                    this.selector.css('display', 'none');
                } else {
                    this.selector.fadeOut(200);
                }

                this.onHideFn();

                $(document).off('click touchend', this.modalCloseListener);
            }
        }
    }]);
    return MenuModal;
}();

module.exports = MenuModal;
