"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@ts-check

var kDefaultWidthContent = 880; //px

var ModalTemplate = function () {
    function ModalTemplate(parent, localization, title, content, buttons) {
        var closeWhenClickOutside = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
        (0, _classCallCheck3.default)(this, ModalTemplate);

        this.localization = localization;

        this.visible = false;
        this.skipFade = false;
        this.checkSelector = true;
        this.closeWhenClickOutside = closeWhenClickOutside;

        this.titleLocalized = this.localization.translate(title) || title;
        this.content = content;
        this.buttons = buttons;

        this.onShowFn = function () {};
        this.onHideFn = function () {};

        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#modal-template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.container = /** @type{HTMLElement} */node.querySelector('.modal-content');

        this.parent = parent;
        this.mount();
        parent.innerHTML = '';
        parent.appendChild(node);
    }

    (0, _createClass3.default)(ModalTemplate, [{
        key: 'mount',
        value: function mount() {
            var _this = this;

            this.parent.style.display = 'none';
            this.parent.style.opacity = '0';

            //----------------- Add title ----------------- 
            this.container.querySelector('.modal-title').innerHTML = this.titleLocalized;

            //----------------- Initialize modal content ----------------- 
            this.updateContent();

            //----------------- Initialize footer buttons ----------------- 
            this.updateButtons();

            //Event listener
            var that = this;
            this.eventListener = function (e) {
                //Check id with parent id so it doesn't affect other modals or generate bugs
                if (!e.target.closest('#' + that.parent.id)) return;

                //Right button
                if (that.buttons.right && e.target.closest('.modal-right-btn')) {
                    e.stopPropagation();
                    if (that.buttons.right.action) that.buttons.right.action();
                    if (!that.buttons.right.doNotClose) that.hide(); //Force to hide
                    return;
                }

                //Left button
                if (that.buttons.left && e.target.closest('.modal-left-btn')) {
                    e.stopPropagation();
                    if (that.buttons.left.action) that.buttons.left.action();
                    if (!that.buttons.left.doNotClose) that.hide(); //Force to hide
                    return;
                }

                //Close modal when clicked outside or in the X button
                if (e.target.closest('.close') || _this.closeWhenClickOutside && !e.target.closest('.modal-close') && (e.target.id == that.parent.id || !that.checkSelector)) {
                    e.stopPropagation();
                    that.hide();
                }
            };
        }
    }, {
        key: 'updateContent',
        value: function updateContent(content) {
            if (content) this.content = content;

            var contentElement = this.container.querySelector('.modal-main-container');
            if (this.content.css)
                // @ts-ignore
                contentElement.style = this.content.css;
            // @ts-ignore
            contentElement.style.maxWidth = (this.content.maxWidth || kDefaultWidthContent) + 'px';

            if (this.content.html) {
                contentElement.innerHTML = '';
                contentElement.append(this.content.html);
            }

            if (this.content.htmlList) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = (0, _getIterator3.default)(this.content.htmlList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var element = _step.value;

                        contentElement.append(element);
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
            }
        }
    }, {
        key: 'updateButtons',
        value: function updateButtons(buttons) {
            if (buttons) this.buttons = buttons;

            var buttonsElement = this.container.querySelector('.modal-buttons');
            if (!this.buttons)
                // @ts-ignore
                buttonsElement.style.display = 'none';else {
                var btnRightElement = buttonsElement.querySelector('.modal-right-btn');
                var btnLeftElement = buttonsElement.querySelector('.modal-left-btn');
                //Right
                if (!this.buttons.right)
                    // @ts-ignore
                    btnRightElement.style.display = 'none';else {
                    // @ts-ignore
                    btnRightElement.style.display = 'flex';
                    var btn = this.buttons.right;
                    if (btn.html) {
                        btnRightElement.innerHTML = btn.html;
                    } else if (btn.text) {
                        var text = this.localization.translate(btn.text) || btn.text;
                        btnRightElement.textContent = text;
                    }

                    if (btn.removeCssClassList && btn.removeCssClassList.length > 0) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = (0, _getIterator3.default)(btn.removeCssClassList), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var cssClass = _step2.value;

                                btnRightElement.classList.remove(cssClass);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }

                    if (btn.cssClassList && btn.cssClassList.length > 0) {
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = (0, _getIterator3.default)(btn.cssClassList), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var _cssClass = _step3.value;

                                btnRightElement.classList.add(_cssClass);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }

                    if (btn.additionalCssList && btn.additionalCssList.length > 0) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = (0, _getIterator3.default)(btn.additionalCssList), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var cssObject = _step4.value;

                                // @ts-ignore
                                btnRightElement.style.setProperty(cssObject.id, cssObject.value);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                }
                //Left
                if (!this.buttons.left)
                    // @ts-ignore
                    btnLeftElement.style.display = 'none';else {
                    // @ts-ignore
                    btnLeftElement.style.display = 'flex';
                    var _btn = this.buttons.left;
                    if (_btn.html) {
                        btnLeftElement.innerHTML = _btn.html;
                    } else if (_btn.text) {
                        var _text = this.localization.translate(_btn.text) || _btn.text;
                        btnLeftElement.textContent = _text;
                    }

                    if (_btn.removeCssClassList && _btn.removeCssClassList.length > 0) {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = (0, _getIterator3.default)(_btn.removeCssClassList), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _cssClass2 = _step5.value;

                                btnLeftElement.classList.remove(_cssClass2);
                            }
                        } catch (err) {
                            _didIteratorError5 = true;
                            _iteratorError5 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }
                            } finally {
                                if (_didIteratorError5) {
                                    throw _iteratorError5;
                                }
                            }
                        }
                    }

                    if (_btn.cssClassList && _btn.cssClassList.length > 0) {
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = (0, _getIterator3.default)(_btn.cssClassList), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var _cssClass3 = _step6.value;

                                btnLeftElement.classList.add(_cssClass3);
                            }
                        } catch (err) {
                            _didIteratorError6 = true;
                            _iteratorError6 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }
                            } finally {
                                if (_didIteratorError6) {
                                    throw _iteratorError6;
                                }
                            }
                        }
                    }

                    if (_btn.additionalCssList && _btn.additionalCssList.length > 0) {
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = (0, _getIterator3.default)(_btn.additionalCssList), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var _cssObject = _step7.value;

                                // @ts-ignore
                                btnLeftElement.style.setProperty(_cssObject.id, _cssObject.value);
                            }
                        } catch (err) {
                            _didIteratorError7 = true;
                            _iteratorError7 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion7 && _iterator7.return) {
                                    _iterator7.return();
                                }
                            } finally {
                                if (_didIteratorError7) {
                                    throw _iteratorError7;
                                }
                            }
                        }
                    }
                }
            }
        }
    }, {
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
            var _this2 = this;

            if (!this.visible) {
                this.visible = true;

                this.parent.removeEventListener('transitionend', function () {
                    _this2.parent.style.display = 'none';
                });
                this.parent.style.display = 'block';
                this.parent.style.opacity = '1';

                this.onShowFn();

                if (!isModal) {
                    document.addEventListener('click', this.eventListener);
                }
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            var _this3 = this;

            if (this.visible) {
                this.visible = false;
                if (this.skipFade) {
                    this.parent.style.display = 'none';
                } else {
                    this.parent.style.transition = '0.2s';
                    this.parent.style.opacity = '0';
                    this.parent.style.display = 'none';
                    this.parent.addEventListener('transitionend', function () {
                        _this3.parent.style.transition = 'none';
                    });
                }

                this.onHideFn();

                document.removeEventListener('click', this.eventListener);
            }
        }
    }]);
    return ModalTemplate;
}();

module.exports = ModalTemplate;
