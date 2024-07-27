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

//TODO replace modal MenuModal (insufficientGoldModal) so it doesn't use jQuery
var $ = require("./8ee62bea.js");
var MenuModal = require("./menuModal.js");

//Info of pass in constant so it can be easily changed or put in a json/js definition
var kInfoList = [{
    img: '../img/pass/gold-pass.png',
    text: 'info-gold-season-1'
}, {
    img: '../img/pass/icon-no-ads.png',
    text: 'info-gold-season-2'
}, {
    img: '../img/pass/icon-double-xp.png',
    text: 'info-gold-season-3'
}];

var ModalBuyGoldPass = function () {
    function ModalBuyGoldPass(account, localization, seasonType, priceBasic, priceVIP) {
        (0, _classCallCheck3.default)(this, ModalBuyGoldPass);

        this.account = account;
        this.localization = localization;

        //----------------- Prepare title ----------------- 
        var title = localization.translate('get-gold-pass');
        //Replace add current season to title
        var includeExpresion = title.includes('{');
        if (includeExpresion) {
            var endIndex = title.search('{');
            if (endIndex != -1) {
                var startIndex = 0;
                var txtcopy = title.slice(startIndex, endIndex);
                var endIndexSearch = title.search('}');
                startIndex = endIndexSearch + 1;

                title = txtcopy + localization.translate(seasonType) + title.slice(startIndex);
            }
        }

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
        this.insufficientGoldModal = new MenuModal($('#insufficient-gold-modal'));
        var buttons = this.prepareButtons(priceBasic, priceVIP);

        //----------------- Create modal ----------------- 
        var parent = document.querySelector('#modal-buy-season');
        this.modal = new ModalTemplate(parent, localization, title, content, buttons);
    }

    (0, _createClass3.default)(ModalBuyGoldPass, [{
        key: 'prepareButtons',
        value: function prepareButtons(priceBasic, priceVIP) {
            var _this = this;

            var leftBtnHtml = '<span>' + this.localization.translate('gold-vip') + '</span>\n                            <img src="../img/gui/gold-icon.png">\n                            <span>' + priceVIP + '</span>';
            var rightBtnHtml = '<span>' + this.localization.translate('buy-gold-pass') + '</span>\n                            <img src="../img/gui/gold-icon.png">\n                            <span>' + priceBasic + '</span>';

            var enableLeft = priceVIP <= this.account.profile.gpTotal;
            var enableRight = priceBasic <= this.account.profile.gpTotal;

            var leftCss = ['orange-button'];
            var leftCssRemove = [];
            var rightCss = [];
            var rightCssRemove = [];
            var actionRight = null;
            var actionLeft = null;

            if (enableLeft) {
                leftCssRemove.push('btn-disabled');
                actionLeft = function actionLeft() {
                    if (_this.account.unlinked) _this.account.emit('incentiveModal');
                    if (priceVIP <= _this.account.profile.gpTotal) //Double check
                        _this.account.buyUserPass('vip');else _this.showInsufficientGoldModal(priceVIP);
                };
            } else {
                actionLeft = function actionLeft() {
                    if (_this.account.unlinked) _this.account.emit('incentiveModal');else _this.showInsufficientGoldModal(priceVIP);
                };
            }
            //leftCss.push('btn-disabled');

            if (enableRight) {
                rightCssRemove.push('btn-disabled');
                actionRight = function actionRight() {
                    if (_this.account.unlinked) _this.account.emit('incentiveModal');else if (priceBasic <= _this.account.profile.gpTotal) //Double check
                        _this.account.buyUserPass('basic');else _this.showInsufficientGoldModal(priceBasic);
                };
            } else {
                actionRight = function actionRight() {
                    if (_this.account.unlinked) _this.account.emit('incentiveModal');else {
                        _this.showInsufficientGoldModal(priceBasic);
                    }
                };
            }
            //rightCss.push('btn-disabled');

            var buttons = {
                left: {
                    html: leftBtnHtml,
                    cssClassList: leftCss,
                    removeCssClassList: leftCssRemove,
                    action: actionLeft
                },
                right: {
                    html: rightBtnHtml,
                    cssClassList: rightCss,
                    removeCssClassList: rightCssRemove,
                    action: actionRight
                }
            };
            return buttons;
        }
    }, {
        key: 'showInsufficientGoldModal',
        value: function showInsufficientGoldModal(price) {
            var _this2 = this;

            var requiredGold = price - this.account.profile.gpTotal;
            this.insufficientGoldModal.show();
            /** @type{HTMLSpanElement} */
            var goldLabel = document.querySelector('#insufficient-gold-modal #insufficient-required-gold');
            goldLabel.innerText = '' + requiredGold;

            /** @type{HTMLButtonElement} */
            var buyButton = document.querySelector('#insufficient-gold-modal .ok-modal-btn');
            buyButton.onclick = function () {
                _this2.insufficientGoldModal.hide();
                document.querySelector('#shop-button').click();
            };
        }
    }, {
        key: 'updatePrices',
        value: function updatePrices(priceBasic, priceVIP) {
            var buttons = this.prepareButtons(priceBasic, priceVIP);
            this.modal.updateButtons(buttons);
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
    return ModalBuyGoldPass;
}();

module.exports = ModalBuyGoldPass;
