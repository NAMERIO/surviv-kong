"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

var kUserNameDelayTime = 7; //ONLY for show purporses is necesary to change the real value on the app.
var kUserNameDelayUnit = 'time-days'; //This is for localization, is available: time-day(s), time-hour(s) and time-month(s)

var EditUsernameBubble = function () {
    /**
     * 
     * @param {HTMLElement | DocumentFragment} parent
     * @param {import('./../localization')} localization
     * @param {import('./../account')} account
     */
    function EditUsernameBubble(parent, localization, account) {
        (0, _classCallCheck3.default)(this, EditUsernameBubble);

        this.localization = localization;
        this.account = account;
        this.username = '';
        /** @type{HTMLTemplateElement} */
        var template = document.querySelector('#edit_username_bubble-template');
        var node = template.content.cloneNode(true);
        /** @type{HTMLElement} */
        this.card = /** @type{HTMLElement} */node.querySelector('.speech-bubble-container');
        this.mount();
        parent.appendChild(node);
    }

    (0, _createClass3.default)(EditUsernameBubble, [{
        key: 'mount',
        value: function mount() {
            var _this = this;

            /** @type{HTMLDivElement} */
            this.usernameLabel = this.card.querySelector('.edit_username_bubble-username');
            /** @type{HTMLInputElement} */
            this.input = this.card.querySelector('.edit_username_bubble-input');
            /** @type{HTMLButtonElement} */
            this.editBtn = this.card.querySelector('.edit_username_bubble-edit_btn');
            this.editBtn.onclick = function () {
                return _this.setEditMode(true);
            };
            /** @type{HTMLButtonElement} */
            this.saveBtn = this.card.querySelector('.edit_username_bubble-save_btn');
            this.saveBtn.onclick = function () {
                return _this.save();
            };
            /** @type{HTMLButtonElement} */
            this.cancelBtn = this.card.querySelector('.edit_username_bubble-cancel_btn');
            this.cancelBtn.onclick = function () {
                return _this.cancel();
            };
            this.account.addEventListener('profileLoaded', this.onProfileUpdated.bind(this));
        }
    }, {
        key: 'onProfileUpdated',
        value: function onProfileUpdated() {
            var profile = this.account.profile;
            if ((0, _keys2.default)(profile).length === 0) {
                return;
            }
            var username = !profile.unlinked ? profile.username : 'BHA#' + profile.id;
            this.username = username;
            this.usernameLabel.innerText = this.username;
        }

        /**
         * 
         * @param {boolean} edit 
         */

    }, {
        key: 'setEditMode',
        value: function setEditMode(edit) {
            this.usernameLabel.hidden = edit;
            this.editBtn.hidden = edit;
            this.input.hidden = !edit;

            /** @type {HTMLDivElement} */
            var buttonsContainer = this.card.querySelector('.buttons-container');
            buttonsContainer.hidden = !edit;

            if (edit) {
                this.input.value = '';
                this.input.focus();
                this.input.select();
                if (this.account.profile.usernameChangeTime <= 0) {
                    var message = this.localization.translate('modal-change-battletag-warning') + ' ' + kUserNameDelayTime + ' ' + this.localization.translate(kUserNameDelayUnit);
                    this.showMessageBubble(message, false);
                }
            }
        }

        /**
         * 
         * @param {string} message 
         * @param {boolean} isError 
         */

    }, {
        key: 'showMessageBubble',
        value: function showMessageBubble(message, isError) {
            /** @type {HTMLDivElement} */
            var messageBubble = this.card.querySelector('.edit_username_bubble-message');
            messageBubble.classList.remove('green', 'red');
            var messageClass = isError ? 'red' : 'green';
            messageBubble.classList.add(messageClass);
            messageBubble.innerHTML = message;
            messageBubble.hidden = false;
        }
    }, {
        key: 'hideMessageBubble',
        value: function hideMessageBubble() {
            /** @type {HTMLDivElement} */
            var messageBubble = this.card.querySelector('.edit_username_bubble-message');
            messageBubble.hidden = true;
        }
    }, {
        key: 'save',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var username, regExp, _ref2, success, error, cancel, ERROR_CODE_TO_LOCALIZATION, message, _message;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                username = this.input.value;
                                regExp = new RegExp(/^[A-Za-z0-9\]\[\ñ\Ñ]+$/);

                                if (!regExp.test(username)) {
                                    _context.next = 16;
                                    break;
                                }

                                _context.next = 5;
                                return this.account.setUsername(username);

                            case 5:
                                _ref2 = _context.sent;
                                success = _ref2.success;
                                error = _ref2.error;
                                cancel = _ref2.cancel;

                                if (!cancel) {
                                    _context.next = 12;
                                    break;
                                }

                                this.cancel();
                                return _context.abrupt('return');

                            case 12:
                                if (success || !error) {
                                    this.usernameLabel.innerText = username;
                                    this.setEditMode(false);
                                }
                                if (error) {
                                    ERROR_CODE_TO_LOCALIZATION = {
                                        'failed': 'Failed setting username.',
                                        'invalid': 'Invalid username.',
                                        'taken': 'Name already taken!',
                                        'change_time_not_expired': 'Username has already been set recently.'
                                    };
                                    message = ERROR_CODE_TO_LOCALIZATION[error] || ERROR_CODE_TO_LOCALIZATION['failed'];

                                    this.showMessageBubble(message, true);
                                }
                                _context.next = 18;
                                break;

                            case 16:
                                _message = 'No special character is allowed except "[" and "]"';

                                this.showMessageBubble(_message, true);

                            case 18:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function save() {
                return _ref.apply(this, arguments);
            }

            return save;
        }()
    }, {
        key: 'cancel',
        value: function cancel() {
            this.setEditMode(false);
        }
    }]);
    return EditUsernameBubble;
}();

module.exports = EditUsernameBubble;
