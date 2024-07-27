"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _BindDefs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var $ = require("./jquery.js");
var base64 = require("./ca1f6916.js");
// @ts-ignore
var bitbuffer = require("./bitBuffer.js");
// @ts-ignore
var crc = require("./crc.js");
// @ts-ignore
var GameConfig = require("./gameConfig.js");
var GameInput = GameConfig.Input;
var Input = require("./input.js");
var InputType = Input.InputType;
var InputValue = Input.InputValue;
var Key = Input.Key;
var MouseButton = Input.MouseButton;
var MouseWheel = Input.MouseWheel; //@TODO: Delete

var kBindVersion = 1;

function def(name, defaultValue) {
    return { name: name, defaultValue: defaultValue };
}

function inputKey(key) {
    return new InputValue(InputType.Key, key);
}
function mouseButton(button) {
    return new InputValue(InputType.MouseButton, button);
}
function mouseWheel(wheel) {
    return new InputValue(InputType.MouseWheel, wheel);
}

var BindDefs = (_BindDefs = {}, (0, _defineProperty3.default)(_BindDefs, GameInput.MoveLeft, def('Move Left', inputKey(Key.A))), (0, _defineProperty3.default)(_BindDefs, GameInput.MoveRight, def('Move Right', inputKey(Key.D))), (0, _defineProperty3.default)(_BindDefs, GameInput.MoveUp, def('Move Up', inputKey(Key.W))), (0, _defineProperty3.default)(_BindDefs, GameInput.MoveDown, def('Move Down', inputKey(Key.S))), (0, _defineProperty3.default)(_BindDefs, GameInput.LightAttack, def('Light Attack', mouseButton(MouseButton.Left))), (0, _defineProperty3.default)(_BindDefs, GameInput.Skill_1, def('Skill 1', inputKey(Key.Q))), (0, _defineProperty3.default)(_BindDefs, GameInput.Skill_2, def('Skill 2', inputKey(Key.E))), (0, _defineProperty3.default)(_BindDefs, GameInput.Skill_3, def('Skill 3', inputKey(Key.R))), (0, _defineProperty3.default)(_BindDefs, GameInput.Cancel, def('Cancel', inputKey(Key.X))), (0, _defineProperty3.default)(_BindDefs, GameInput.Interact, def('Interact', inputKey(Key.F))), (0, _defineProperty3.default)(_BindDefs, GameInput.Revive, def('Revive', null)), (0, _defineProperty3.default)(_BindDefs, GameInput.ToggleMap, def('Toggle Map', inputKey(Key.M))), (0, _defineProperty3.default)(_BindDefs, GameInput.EmoteMenu, def('Emote Menu', mouseButton(MouseButton.Right))), (0, _defineProperty3.default)(_BindDefs, GameInput.TeamPingMenu, def('Team Ping Menu (Hold)', inputKey(Key.C))), (0, _defineProperty3.default)(_BindDefs, GameInput.Fullscreen, def('Full Screen', inputKey(Key.L))), (0, _defineProperty3.default)(_BindDefs, GameInput.HideUI, def('Hide UI', null)), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag01, def('Slot 1', inputKey(Key.One))), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag02, def('Slot 2', inputKey(Key.Two))), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag03, def('Slot 3', inputKey(Key.Three))), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag04, def('Slot 4', inputKey(Key.Four))), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag05, def('Slot 5', inputKey(Key.Five))), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag06, def('Slot 6', inputKey(Key.Six))), (0, _defineProperty3.default)(_BindDefs, GameInput.Bag07, def('Slot 7', inputKey(Key.Seven))), _BindDefs);

//
// InputBinds
//

var InputBinds = function () {
    /**
     * 
     * @param {*} input 
     * @param {*} config 
     * @param {import('./bugbattle')} bugBattle 
     */
    function InputBinds(input, config, bugBattle) {
        (0, _classCallCheck3.default)(this, InputBinds);

        this.input = input;
        this.config = config;
        this.binds = [];
        this.boundKeys = {};
        this.menuHovered = false;
        this.bugBattle = bugBattle;

        this.loadBinds();
    }

    (0, _createClass3.default)(InputBinds, [{
        key: 'toArray',
        value: function toArray() {
            var buf = new ArrayBuffer(this.binds.length * 2 + 1);
            var stream = new bitbuffer.BitStream(buf);

            stream.writeUint8(kBindVersion);
            for (var i = 0; i < this.binds.length; i++) {
                var bind = this.binds[i];
                var type = bind ? bind.type : 0;
                var code = bind ? bind.code : 0;
                stream.writeBits(type & 0x3, 2);
                stream.writeUint8(code & 0xFF);
            }

            // Append crc
            var data = new Uint8Array(buf, 0, stream.byteIndex);
            var checksum = crc.crc16(data);
            var ret = new Uint8Array(data.length + 2);
            ret.set(data);
            ret[ret.length - 2] = checksum >> 8 & 0xFF;
            ret[ret.length - 1] = checksum & 0xFF;

            return ret;
        }
    }, {
        key: 'fromArray',
        value: function fromArray(buf) {
            var data = new Uint8Array(buf);
            if (!data || data.length < 3) {
                return false;
            }

            // Check crc
            var dataCrc = data[data.length - 2] << 8 | data[data.length - 1];
            data = data.slice(0, data.length - 2);
            var calcCrc = crc.crc16(data);
            if (calcCrc != dataCrc) {
                return false;
            }

            var arrayBuf = new ArrayBuffer(data.length);
            var view = new Uint8Array(arrayBuf);
            for (var i = 0; i < data.length; i++) {
                view[i] = data[i];
            }

            var stream = new bitbuffer.BitStream(arrayBuf);
            var version = stream.readUint8();

            this.clearAllBinds();

            var idx = 0;
            while (stream.length - stream.index >= 10) {
                var bind = idx++;
                var type = stream.readBits(2);
                var code = stream.readUint8();

                if (bind >= 0 && bind < GameInput.Count && type != InputType.None) {
                    this.setBind(bind, type != 0 ? new InputValue(type, code) : null);
                }
            }

            if (version < kBindVersion) {
                this.upgradeBinds(version);
                this.saveBinds();
            }

            return true;
        }
    }, {
        key: 'toBase64',
        value: function toBase64() {
            return base64.fromByteArray(this.toArray());
        }
    }, {
        key: 'fromBase64',
        value: function fromBase64(str) {
            var loaded = false;
            try {
                loaded = this.fromArray(base64.toByteArray(str));
            } catch (e) {
                // Ignore
                console.log('Error', e);
            }
            return loaded;
        }
    }, {
        key: 'saveBinds',
        value: function saveBinds() {
            this.refreshBinds = !this.refreshBinds;
            this.config.set('binds', this.toBase64());
        }
    }, {
        key: 'loadBinds',
        value: function loadBinds() {
            var loaded = this.fromBase64(this.config.get('binds') || '');
            if (!loaded) {
                this.loadDefaultBinds();
                this.saveBinds();
            }
        }
    }, {
        key: 'upgradeBinds',
        value: function upgradeBinds(version) {
            var newBinds = [];

            // @TODO: Add version check here, ie:
            // if (version == 1) {
            //     newBinds = [];
            //         GameInput.UseAbility0
            //     ];
            // }

            // Set default inputs for the new binds, as long as those
            // defaults haven't already been used.
            for (var i = 0; i < newBinds.length; i++) {
                var bind = newBinds[i];
                var input = BindDefs[bind].defaultValue;
                var alreadyBound = false;
                for (var j = 0; j < this.binds.length; j++) {
                    if (this.binds[j] && this.binds[j].equals(input)) {
                        alreadyBound = true;
                        break;
                    }
                }
                if (!alreadyBound) {
                    this.setBind(bind, input);
                }
            }
        }
    }, {
        key: 'clearAllBinds',
        value: function clearAllBinds() {
            for (var i = 0; i < GameInput.Count; i++) {
                this.binds[i] = null;
            }
            this.boundKeys = {};
        }
    }, {
        key: 'setBind',
        value: function setBind(bind, inputValue) {
            // Clear any existing bind for this input
            if (inputValue) {
                for (var i = 0; i < this.binds.length; i++) {
                    if (this.binds[i] && this.binds[i].equals(inputValue)) {
                        this.binds[i] = null;
                    }
                }
            }

            var curBind = this.binds[bind];
            if (curBind && curBind.type == InputType.Key) {
                this.boundKeys[curBind.code] = null;
            }

            this.binds[bind] = inputValue;

            if (inputValue && inputValue.type == InputType.Key) {
                this.boundKeys[inputValue.code] = true;
            }
        }
    }, {
        key: 'getBind',
        value: function getBind(bind) {
            return this.binds[bind];
        }
    }, {
        key: 'preventMenuBind',
        value: function preventMenuBind(b) {
            return b && this.menuHovered && (b.type == 2 || b.type == 3);
        }
    }, {
        key: 'isKeyBound',
        value: function isKeyBound(key) {
            return this.boundKeys[key];
        }
    }, {
        key: 'isBindPressed',
        value: function isBindPressed(bind) {
            if (this.bugBattle.isOpened()) {
                return false;
            }
            var b = this.binds[bind];
            if (this.preventMenuBind(b)) {
                return false;
            }
            return b && this.input.isInputValuePressed(b);
        }
    }, {
        key: 'isBindReleased',
        value: function isBindReleased(bind) {
            if (this.bugBattle.isOpened()) {
                return false;
            }
            var b = this.binds[bind];
            if (this.preventMenuBind(b)) {
                return false;
            }
            return b && this.input.isInputValueReleased(b);
        }
    }, {
        key: 'isBindDown',
        value: function isBindDown(bind) {
            if (this.bugBattle.isOpened()) {
                return false;
            }
            var b = this.binds[bind];
            if (this.preventMenuBind(b)) {
                return false;
            }
            return b && this.input.isInputValueDown(b);
        }
    }, {
        key: 'loadDefaultBinds',
        value: function loadDefaultBinds() {
            this.clearAllBinds();

            var defKeys = (0, _keys2.default)(BindDefs);
            for (var i = 0; i < defKeys.length; i++) {
                var key = defKeys[i];
                var _def = BindDefs[key];
                this.setBind(parseInt(key), _def.defaultValue);
            }
        }
    }]);
    return InputBinds;
}();

//
// InputBindUi
//


var InputBindUi = function () {
    function InputBindUi(input, inputBinds) {
        var _this = this;

        (0, _classCallCheck3.default)(this, InputBindUi);

        this.input = input;
        this.inputBinds = inputBinds;

        $('.js-btn-keybind-restore').on('click', function () {
            _this.inputBinds.loadDefaultBinds();
            _this.inputBinds.saveBinds();
            _this.refresh();
        });
    }

    (0, _createClass3.default)(InputBindUi, [{
        key: 'cancelBind',
        value: function cancelBind() {
            this.input.captureNextInput(null);
        }
    }, {
        key: 'refresh',
        value: function refresh() {
            var _this2 = this;

            var defKeys = (0, _keys2.default)(BindDefs);
            var binds = this.inputBinds.binds;

            var container = $('.js-keybind-list');
            container.empty();

            var _loop = function _loop(i) {
                var key = defKeys[i];
                var bindDef = BindDefs[key];
                var bind = binds[key];

                var btn = $('<button/>', {
                    class: 'keybind-btn keybind-btn-text',
                    text: bindDef.name
                });
                var val = $('<div/>', {
                    class: 'keybind-hotkey-btn hotkey-box',
                    text: bind ? bind.toString() : ''
                });

                btn.on('click', function (event) {
                    var targetElem = $(event.target);
                    targetElem.addClass('btn-keybind-desc-selected');

                    _this2.input.captureNextInput(function (event, inputValue) {
                        event.preventDefault();
                        event.stopPropagation();

                        var disallowKeys = [Key.Control, Key.Shift, Key.Alt, Key.Windows, Key.ContextMenu, Key.F1, Key.F2, Key.F3, Key.F4, Key.F5, Key.F6, Key.F7, Key.F8, Key.F9, Key.F10, Key.F11, Key.F12];
                        if (inputValue.type == InputType.Key && disallowKeys.indexOf(inputValue.code) != -1) {
                            return false;
                        }

                        targetElem.removeClass('btn-keybind-desc-selected');

                        if (!inputValue.equals(inputKey(Key.Escape))) {
                            var bindValue = inputValue;
                            if (inputValue.equals(inputKey(Key.Backspace))) {
                                bindValue = null;
                            }

                            // @TODO: Validate bind
                            _this2.inputBinds.setBind(parseInt(key), bindValue);
                            // @TODO: Only save if the user accepts?
                            _this2.inputBinds.saveBinds();
                            _this2.refresh();
                        }

                        return true;
                    });
                });

                container.append($('<div/>', { class: 'ui-keybind-container' }).append(btn).append(val));
            };

            for (var i = 0; i < defKeys.length; i++) {
                _loop(i);
            }

            $('#keybind-link').html(this.inputBinds.toBase64());
        }
    }]);
    return InputBindUi;
}();

module.exports = {
    InputBinds: InputBinds,
    InputBindUi: InputBindUi
};
