"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@ts-check

var ModalTemplate = require("./modalTemplate.js");

var ModalWarningError = function () {
    function ModalWarningError(account, localization, isError, errorText, buttons) {
        (0, _classCallCheck3.default)(this, ModalWarningError);

        this.account = account;
        this.mount(localization, isError, errorText, buttons);
    }

    (0, _createClass3.default)(ModalWarningError, [{
        key: 'mount',
        value: function mount(localization, isError, errorText, buttonsData) {
            //----------------- Prepare title -----------------
            var title = isError ? localization.translate('modal-title-error') : localization.translate('modal-title-warning');

            //----------------- Prepare content -----------------
            var content = {
                html: this.prepareContent(localization, errorText),
                maxWidth: 630
            };

            //----------------- Prepare buttons -----------------
            var buttons = this.prepareButtons(buttonsData);

            var parent = document.querySelector('#warning-error-modal');
            this.modal = new ModalTemplate(parent, localization, title, content, buttons, false);
        }
    }, {
        key: 'prepareContent',
        value: function prepareContent(localization, errorText) {
            /** @type{HTMLTemplateElement} */
            var template = document.querySelector('#warning-error-content-container');
            var node = template.content.cloneNode(true);
            /** @type{HTMLElement} */
            var textElement = /** @type{HTMLElement} */node.querySelector('.warning-error-text');

            //Error/Warning Text
            var htmlText = localization.translate(errorText) || errorText;
            textElement.innerHTML = htmlText;

            return textElement;
        }
    }, {
        key: 'prepareButtons',
        value: function prepareButtons(buttonsData) {
            if (buttonsData.left && buttonsData.right) {
                return {
                    left: {
                        text: buttonsData.left.text || 'modal-warning-error-yes',
                        action: buttonsData.left.action
                    },
                    right: {
                        text: buttonsData.right.text || 'modal-warning-error-no',
                        action: buttonsData.right.action
                    }
                };
            }

            if (buttonsData.left) {
                return {
                    left: {
                        text: buttonsData.left.text || 'modal-warning-error-ok',
                        action: buttonsData.left.action
                    }
                };
            }

            if (buttonsData.right) {
                return {
                    right: {
                        text: buttonsData.right.text || 'modal-warning-error-ok',
                        action: buttonsData.right.action
                    }
                };
            }

            if (buttonsData) {
                return {
                    left: {
                        text: buttonsData.text || 'modal-warning-error-ok',
                        action: buttonsData.action
                    }
                };
            }
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
    return ModalWarningError;
}();

module.exports = ModalWarningError;
