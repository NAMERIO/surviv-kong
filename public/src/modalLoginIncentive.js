"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ts-check

var ModalTemplate = require("./modalTemplate.js");

//Info of login in constant so it can be easily changed or put in a json/js definition
var kInfoList = [{
    img: '../img/ui/images/login-incentive-save-icon.png',
    text: 'modal-login-incentive-info-1'
}, {
    img: '../img/ui/images/login-incentive-armor-icon.png',
    text: 'modal-login-incentive-info-2'
}, {
    img: '../img/ui/shop/chest-rare.png',
    text: 'modal-login-incentive-info-3'
}];

var ModalLoginIncentive = function () {
    function ModalLoginIncentive(localization, profileUI) {
        (0, _classCallCheck3.default)(this, ModalLoginIncentive);

        this.localization = localization;
        this.profileUI = profileUI;

        //----------------- Prepare title ----------------- 
        var title = localization.translate('modal-login-incentive-title');

        //----------------- Prepare content ----------------- 
        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#gold-season-info');
        var htmlContent = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(kInfoList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var infoObj = _step.value;

                var node = template.content.cloneNode(true);
                /** @type{HTMLElement} */
                var contentContainer = /** @type{HTMLElement} */node.querySelector('.season-info-column');

                if (infoObj.img) contentContainer.querySelector('.season-icon').style.backgroundImage = 'url(' + infoObj.img + ')';

                var text = localization.translate(infoObj.text) || infoObj.text;
                contentContainer.querySelector('.season-description').textContent = text;

                htmlContent.push(contentContainer);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var content = { htmlList: htmlContent };

        //----------------- Preprare buttons ----------------- 
        var buttons = this.prepareButtons();

        //----------------- Create modal ----------------- 
        var parent = document.querySelector('#modal-login-incentive');
        this.modal = new ModalTemplate(parent, localization, title, content, buttons);
    }

    (0, _createClass3.default)(ModalLoginIncentive, [{
        key: 'prepareButtons',
        value: function prepareButtons() {
            var _this = this;

            var leftBtnHtml = '<span>' + this.localization.translate('modal-login-incentive-okay-btn') + '</span>';

            var buttons = {
                left: {
                    html: leftBtnHtml,
                    cssClassList: ['green-button'],
                    action: function action() {
                        _this.profileUI.showLoginMenu({
                            modal: true,
                            link: true,
                            addQuery: true
                        });
                    }
                }
            };
            return buttons;
        }
    }, {
        key: 'show',
        value: function show() {
            this.modal.show();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.modal.hide();
        }
    }, {
        key: 'onShow',
        value: function onShow(fn) {
            this.modal.onShow(fn);
        }
    }, {
        key: 'onHide',
        value: function onHide(fn) {
            this.modal.onHide(fn);
        }
    }]);
    return ModalLoginIncentive;
}();

module.exports = ModalLoginIncentive;
