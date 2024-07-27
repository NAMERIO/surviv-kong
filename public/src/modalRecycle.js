"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@ts-check

var GearCardItem = require("./gearCardItem.js");

var _require = require("./35dbdceb.js"),
    getRecycleValue = _require.getRecycleValue;

var _require2 = require("./b72df1ae.js"),
    getItemValue = _require2.getItemValue;

var ModalTemplate = require("./modalTemplate.js");

var ModalRecycle = function () {
    function ModalRecycle(account, localization, itemDef, userItem) {
        var onRecycle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
        (0, _classCallCheck3.default)(this, ModalRecycle);

        this.account = account;
        this.mount(localization, itemDef, userItem, onRecycle);
    }

    (0, _createClass3.default)(ModalRecycle, [{
        key: "mount",
        value: function mount(localization, itemDef, userItem, onRecycle) {
            var _this = this;

            //Recycle value
            var recycleValue = itemDef.type !== 'emote' ? getRecycleValue(itemDef, userItem) : getItemValue(itemDef);

            //----------------- Prepare title -----------------
            var title = localization.translate('recycle');

            //----------------- Prepare content -----------------
            var content = {
                html: this.prepareContent(localization, itemDef, userItem, recycleValue)
            };

            //----------------- Prepare buttons -----------------
            var buttons = {
                left: {
                    text: 'no-keep-item'
                },
                right: {
                    text: 'yes-recycle-item',
                    action: function () {
                        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                            return _regenerator2.default.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            if (!_this.account.unlinked) {
                                                _context.next = 3;
                                                break;
                                            }

                                            _this.account.emit('incentiveModal');
                                            return _context.abrupt("return");

                                        case 3:

                                            //Unequip item before recycling
                                            if (itemDef.type !== 'emote') {
                                                _this.account.setLoadout((0, _assign2.default)({}, _this.account.loadout, (0, _defineProperty3.default)({}, itemDef.type, {
                                                    type: '',
                                                    level: 1
                                                })), (0, _assign2.default)({}, _this.account.loadoutIds, (0, _defineProperty3.default)({}, itemDef.type, '0')));
                                            } else {
                                                _this.account.setLoadout((0, _assign2.default)({}, _this.account.loadout, (0, _defineProperty3.default)({}, itemDef.type, {})), (0, _assign2.default)({}, _this.account.loadoutIds, (0, _defineProperty3.default)({}, itemDef.type, '0')));
                                            }

                                            _context.next = 6;
                                            return _this.account.recycleUserItem(itemDef.id, itemDef.type, userItem.id, recycleValue);

                                        case 6:

                                            if (onRecycle) onRecycle();

                                        case 7:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        }));

                        function action() {
                            return _ref.apply(this, arguments);
                        }

                        return action;
                    }()
                }
            };

            var parent = document.querySelector('#modal-recycle');
            this.modal = new ModalTemplate(parent, localization, title, content, buttons);
        }
    }, {
        key: "prepareContent",
        value: function prepareContent(localization, itemDef, userItem, recycleValue) {
            /** @type{HTMLTemplateElement} */
            var template = document.querySelector('#recycle-content-container');
            var node = template.content.cloneNode(true);
            /** @type{HTMLElement} */
            var container = /** @type{HTMLElement} */node.querySelector('.recycle-main-container');

            //Item card (img)
            var gearParams = {
                definition: itemDef,
                userItem: userItem
            };
            if (itemDef.type !== 'emote') {
                new GearCardItem(gearParams, container.querySelector('.recycle-card-item-container'), itemDef.type);
            } else {
                container.querySelector('.recycle-card-item-container').innerHTML = "<div class =\"border-box-base-m border-box-" + itemDef.rarity + "-m\"><div class =\"item-img-container\" style=\"background-image: url('" + itemDef.images.sm + "');\"> </div></div>";
            }

            //Text recycle modal
            var htmlText = localization.translate('recycle-confirmation') + '<br>';
            var htmlTextGet = localization.translate('youll-get');
            container.querySelector('.recycle-text').innerHTML = htmlText;
            container.querySelector('.recycle-text-get').innerHTML = htmlTextGet;
            // @ts-ignore
            container.querySelector('.recycle-value').innerHTML = recycleValue;

            return container;
        }
    }, {
        key: "show",
        value: function show() {
            this.modal.show();
        }
    }, {
        key: "hide",
        value: function hide() {
            this.modal.hide();
        }
    }, {
        key: "onShow",
        value: function onShow(fn) {
            this.modal.onShow(fn);
        }
    }, {
        key: "onHide",
        value: function onHide(fn) {
            this.modal.onHide(fn);
        }
    }]);
    return ModalRecycle;
}();

module.exports = ModalRecycle;
