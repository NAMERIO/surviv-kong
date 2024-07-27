"use strict";


var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _freeze = require("./d10cbd81.js");

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

//@ts-ignore
var v2 = require("./v2.js");
var Key = (0, _freeze2.default)({
    Backspace: 8,
    Enter: 13,
    Shift: 16,
    Control: 17,
    Alt: 18,
    Escape: 27,
    Space: 32,
    Left: 37,
    Up: 38,
    Right: 39,
    Down: 40,
    Zero: 48,
    One: 49,
    Two: 50,
    Three: 51,
    Four: 52,
    Five: 53,
    Six: 54,
    Seven: 55,
    Eight: 56,
    Nine: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    L: 76,
    M: 77,
    N: 78,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    V: 86,
    W: 87,
    X: 88,
    Windows: 91,
    ContextMenu: 93,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    Plus: 187,
    Minus: 189,
    FwdSlash: 191,
    Tilde: 192
});

var MouseButton = (0, _freeze2.default)({
    Left: 0,
    Middle: 1,
    Right: 2,
    Thumb1: 3,
    Thumb2: 4
});

var MouseWheel = (0, _freeze2.default)({
    None: 0,
    Up: 1,
    Down: 2
});

var InputType = {
    None: 0,
    Key: 1,
    MouseButton: 2,
    MouseWheel: 3
};

// Based off of https://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
var KeyNames = ['', // [0]
'', // [1]
'', // [2]
'Cancel', // [3]
'', // [4]
'', // [5]
'Help', // [6]
'', // [7]
'Backspace', // [8]
'Tab', // [9]
'', // [10]
'', // [11]
'Clear', // [12]
'Enter', // [13]
'Enter', // [14]
'', // [15]
'Shift', // [16]
'Control', // [17]
'Alt', // [18]
'Pause', // [19]
'Capslock', // [20]
'Kana', // [21]
'Eisu', // [22]
'Junja', // [23]
'Final', // [24]
'Hanja', // [25]
'', // [26]
'ESC', // [27]
'Convert', // [28]
'Nonconvert', // [29]
'Accept', // [30]
'Modechange', // [31]
'Space', // [32]
'Page Up', // [33]
'Page Down', // [34]
'End', // [35]
'Home', // [36]
'←', // [37]
'↑', // [38]
'→', // [39]
'↓', // [40]
'Select', // [41]
'Print', // [42]
'Execute', // [43]
'Printscreen', // [44]
'Insert', // [45]
'Delete', // [46]
'', // [47]
'0', // [48]
'1', // [49]
'2', // [50]
'3', // [51]
'4', // [52]
'5', // [53]
'6', // [54]
'7', // [55]
'8', // [56]
'9', // [57]
':', // [58]
';', // [59]
'<', // [60]
'=', // [61]
'>', // [62]
'?', // [63]
'@', // [64]
'A', // [65]
'B', // [66]
'C', // [67]
'D', // [68]
'E', // [69]
'F', // [70]
'G', // [71]
'H', // [72]
'I', // [73]
'J', // [74]
'K', // [75]
'L', // [76]
'M', // [77]
'N', // [78]
'O', // [79]
'P', // [80]
'Q', // [81]
'R', // [82]
'S', // [83]
'T', // [84]
'U', // [85]
'V', // [86]
'W', // [87]
'X', // [88]
'Y', // [89]
'Z', // [90]
'Windows Key', // [91] Windows Key (Windows) or Command Key (Mac)
'', // [92]
'Context Menu', // [93]
'', // [94]
'Sleep', // [95]
'Numpad 0', // [96]
'Numpad 1', // [97]
'Numpad 2', // [98]
'Numpad 3', // [99]
'Numpad 4', // [100]
'Numpad 5', // [101]
'Numpad 6', // [102]
'Numpad 7', // [103]
'Numpad 8', // [104]
'Numpad 9', // [105]
'*', // [106]
'+', // [107]
'Separator', // [108]
'-', // [109]
'.', // [110]
'/', // [111]
'F1', // [112]
'F2', // [113]
'F3', // [114]
'F4', // [115]
'F5', // [116]
'F6', // [117]
'F7', // [118]
'F8', // [119]
'F9', // [120]
'F10', // [121]
'F11', // [122]
'F12', // [123]
'F13', // [124]
'F14', // [125]
'F15', // [126]
'F16', // [127]
'F17', // [128]
'F18', // [129]
'F19', // [130]
'F20', // [131]
'F21', // [132]
'F22', // [133]
'F23', // [134]
'F24', // [135]
'', // [136]
'', // [137]
'', // [138]
'', // [139]
'', // [140]
'', // [141]
'', // [142]
'', // [143]
'Num Lock', // [144]
'Scroll Lock', // [145]
'WIN_OEM_FJ_JISHO', // [146]
'WIN_OEM_FJ_MASSHOU', // [147]
'WIN_OEM_FJ_TOUROKU', // [148]
'WIN_OEM_FJ_LOYA', // [149]
'WIN_OEM_FJ_ROYA', // [150]
'', // [151]
'', // [152]
'', // [153]
'', // [154]
'', // [155]
'', // [156]
'', // [157]
'', // [158]
'', // [159]
'Circumflex', // [160]
'!', // [161]
'"', // [162]
'#', // [163]
'$', // [164]
'%', // [165]
'&', // [166]
'_', // [167]
'(', // [168]
')', // [169]
'*', // [170]
'+', // [171]
'|', // [172]
'Hyphen Minus', // [173]
'{', // [174]
'}', // [175]
'~', // [176]
'', // [177]
'', // [178]
'', // [179]
'', // [180]
'Volume Mute', // [181]
'Volume Down', // [182]
'Volume Up', // [183]
'', // [184]
'', // [185]
';', // [186]
'=', // [187]
',', // [188]
'-', // [189]
'.', // [190]
'/', // [191]
'Backquote', // [192]
'', // [193]
'', // [194]
'', // [195]
'', // [196]
'', // [197]
'', // [198]
'', // [199]
'', // [200]
'', // [201]
'', // [202]
'', // [203]
'', // [204]
'', // [205]
'', // [206]
'', // [207]
'', // [208]
'', // [209]
'', // [210]
'', // [211]
'', // [212]
'', // [213]
'', // [214]
'', // [215]
'', // [216]
'', // [217]
'', // [218]
'[', // [219]
'\\', // [220]
']', // [221]
'\'', // [222]
'', // [223]
'Meta', // [224]
'ALTGR', // [225]
'', // [226]
'WIN_ICO_HELP', // [227]
'WIN_ICO_00', // [228]
'', // [229]
'WIN_ICO_CLEAR', // [230]
'', // [231]
'', // [232]
'WIN_OEM_RESET', // [233]
'WIN_OEM_JUMP', // [234]
'WIN_OEM_PA1', // [235]
'WIN_OEM_PA2', // [236]
'WIN_OEM_PA3', // [237]
'WIN_OEM_WSCTRL', // [238]
'WIN_OEM_CUSEL', // [239]
'WIN_OEM_ATTN', // [240]
'WIN_OEM_FINISH', // [241]
'WIN_OEM_COPY', // [242]
'WIN_OEM_AUTO', // [243]
'WIN_OEM_ENLW', // [244]
'WIN_OEM_BACKTAB', // [245]
'ATTN', // [246]
'CRSEL', // [247]
'EXSEL', // [248]
'EREOF', // [249]
'PLAY', // [250]
'ZOOM', // [251]
'', // [252]
'PA1', // [253]
'WIN_OEM_CLEAR', // [254]
'' // [255]
];

var MouseButtonNames = ['LMB', // [0]
'Middle Mouse', // [1]
'RMB', // [2]
'Thumb Mouse 1', // [3]
'Thumb Mouse 2'];

var MouseWheelNames = ['', // [0]
'Mouse Wheel Up', // [1]
'Mouse Wheel Down' // [2]
];

var InputValue = function () {
    function InputValue(type, code) {
        (0, _classCallCheck3.default)(this, InputValue);

        this.type = type;
        this.code = code;
    }

    (0, _createClass3.default)(InputValue, [{
        key: 'equals',
        value: function equals(inputValue) {
            return this.type == inputValue.type && this.code == inputValue.code;
        }
    }, {
        key: 'toString',
        value: function toString() {
            if (this.type == InputType.None) {
                return '';
            } else if (this.type == InputType.Key) {
                return KeyNames[this.code] || 'Key ' + this.code;
            } else if (this.type == InputType.MouseButton) {
                return MouseButtonNames[this.code] || 'Mouse ' + this.code;
            } else {
                return MouseWheelNames[this.code] || 'Mouse Wheel ' + this.code;
            }
        }
    }]);
    return InputValue;
}();

//
// Touch
//


var TouchEvent = (0, _freeze2.default)({
    Move: 0,
    Start: 1,
    End: 2,
    Cancel: 3
});

function Touch() {
    this.id = 0;
    this.pos = { x: 0.0, y: 0.0 };
    this.posOld = { x: 0.0, y: 0.0 };
    this.posDown = { x: 0.0, y: 0.0 };
    this.startTime = 0.0;
    this.lastUpdateTime = 0.0;
    this.isNew = true;
    this.isDead = false;
    // For internal use:
    this.osId = 0;
}

/**
 * 
 * @param {HTMLElement} touchElem
 * @param {import('./bugbattle')} bugBattle
 */
function m_InputHandler(touchElem, bugBattle) {
    this.touchElem = touchElem;
    this.bugBattle = bugBattle;
    this.keys = {};
    this.keysOld = {};

    this.m_mousePos = v2.create(0.0, 0.0);
    this.mouseButtons = {};
    this.mouseButtonsOld = {};
    this.mouseWheelState = 0;

    this.touches = [];
    this.touchIdCounter = 0;

    this.lostFocus = false;
    this.captureNextInputCb = null;

    window.addEventListener('focus', this.onWindowFocus.bind(this), false);
    window.addEventListener('blur', this.onWindowFocus.bind(this), false);
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    window.addEventListener('wheel', this.onMouseWheel.bind(this), { capture: false, passive: true });

    window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    window.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    window.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    window.addEventListener('touchcancel', this.onTouchCancel.bind(this), false);

    this.touchElem.addEventListener('touchstart', function (e) {
        e.preventDefault();
    }, false);

    // @TODO: Detect when the window loses focus
}

m_InputHandler.prototype = {
    m_free: function m_free() {
        this.touches = [];
        this.touchIdCounter = 0;
    },

    onWindowFocus: function onWindowFocus() {
        this.keys = {};
        this.keysOld = {};
        this.mouseButtons = {};
        this.mouseButtonsOld = {};
        this.mouseWheelState = 0;
        this.touches.length = 0;
        this.lostFocus = true;
    },

    // Call at the end of every frame
    flush: function flush() {
        this.keysOld = (0, _assign2.default)({}, this.keys);
        this.mouseButtonsOld = (0, _assign2.default)({}, this.mouseButtons);
        this.mouseWheelState = 0;
        // Update the isNew flags and clear out dead touches
        for (var i = 0; i < this.touches.length; i++) {
            this.touches[i].posOld.x = this.touches[i].pos.x;
            this.touches[i].posOld.y = this.touches[i].pos.y;
            this.touches[i].isNew = false;
            if (this.touches[i].isDead) {
                this.touches.splice(i, 1);
                --i;
            }
        }
        this.lostFocus = false;
    },

    captureNextInput: function captureNextInput(cb) {
        this.captureNextInputCb = cb;
    },

    checkCaptureInput: function checkCaptureInput(event, inputType, inputCode) {
        if (this.captureNextInputCb && this.captureNextInputCb(event, new InputValue(inputType, inputCode))) {
            this.captureNextInputCb = null;
            return true;
        }
        return false;
    },

    // InputValue
    isInputValuePressed: function isInputValuePressed(inputValue) {
        switch (inputValue.type) {
            case InputType.Key:
                return this.m_keyPressed(inputValue.code);
            case InputType.MouseButton:
                return this.m_mousePressed(inputValue.code);
            case InputType.MouseWheel:
                return this.m_mouseWheel() == inputValue.code;
            default:
                return false;
        }
    },

    isInputValueReleased: function isInputValueReleased(inputValue) {
        switch (inputValue.type) {
            case InputType.Key:
                return this.m_keyReleased(inputValue.code);
            case InputType.MouseButton:
                return this.m_mouseReleased(inputValue.code);
            case InputType.MouseWheel:
                return this.m_mouseWheel() == inputValue.code;
            default:
                return false;
        }
    },

    isInputValueDown: function isInputValueDown(inputValue) {
        switch (inputValue.type) {
            case InputType.Key:
                return this.m_keyDown(inputValue.code);
            case InputType.MouseButton:
                return this.m_mouseDown(inputValue.code);
            case InputType.MouseWheel:
                return this.m_mouseWheel() == inputValue.code;
            default:
                return false;
        }
    },

    // Keyboard
    onKeyDown: function onKeyDown(event) {
        var keyCode = event.keyCode;

        // Prevent tab behavior
        if (keyCode == 9) {
            event.preventDefault();
        }

        if (this.checkCaptureInput(event, InputType.Key, keyCode)) {
            return;
        }

        this.keys[keyCode] = true;
    },

    onKeyUp: function onKeyUp(event) {
        this.keys[event.keyCode] = false;
    },

    m_keyDown: function m_keyDown(key) {
        return !!this.keys[key];
    },

    m_keyPressed: function m_keyPressed(key) {
        if (this.bugBattle.isOpened()) {
            return false;
        }
        return !this.keysOld[key] && !!this.keys[key];
    },

    m_keyReleased: function m_keyReleased(key) {
        if (this.bugBattle.isOpened()) {
            return false;
        }
        return !!this.keysOld[key] && !this.keys[key];
    },

    // Mouse
    onMouseMove: function onMouseMove(event) {
        this.m_mousePos.x = event.clientX;
        this.m_mousePos.y = event.clientY;
    },

    onMouseDown: function onMouseDown(event) {
        var button = 0;
        if ('which' in event) {
            button = event.which - 1;
        } else {
            button = event.button;
        }

        if (this.checkCaptureInput(event, InputType.MouseButton, button)) {
            return;
        }

        this.mouseButtons[button] = true;
    },

    onMouseUp: function onMouseUp(event) {
        var button = 0;
        if ('which' in event) {
            button = event.which - 1;
        } else {
            button = event.button;
        }
        this.mouseButtons[button] = false;

        // Disable the default action for these buttons;
        // most mice have them bound to "back" / "forward" page navigation
        if (button == 3 || button == 4) {
            event.preventDefault();
        }
    },

    onMouseWheel: function onMouseWheel(event) {
        var wheel = event.deltaY < 0 ? MouseWheel.Up : MouseWheel.Down;

        if (this.checkCaptureInput(event, InputType.MouseWheel, wheel)) {
            return;
        }

        this.mouseWheelState = wheel;
    },

    m_mouseDown: function m_mouseDown(button) {
        return !!this.mouseButtons[button];
    },

    m_mousePressed: function m_mousePressed(button) {
        return !this.mouseButtonsOld[button] && !!this.mouseButtons[button];
    },

    m_mouseReleased: function m_mouseReleased(button) {
        return !!this.mouseButtonsOld[button] && !this.mouseButtons[button];
    },

    m_mouseWheel: function m_mouseWheel() {
        return this.mouseWheelState;
    },

    // Touch
    onTouchShared: function onTouchShared(event, type) {
        if (event.target != this.touchElem && type == TouchEvent.Start) {
            return;
        }

        if (event.target == this.touchElem && event.cancelable && type != TouchEvent.Cancel) {
            event.preventDefault();
        }

        var time = event.timeStamp || performance.now();

        for (var i = 0; i < event.changedTouches.length; i++) {
            var osTouch = event.changedTouches[i];
            var osId = osTouch.identifier;
            var x = osTouch.clientX;
            var y = osTouch.clientY;

            // See if we're already tracking this touch
            var t = null;
            for (var j = 0; j < this.touches.length; j++) {
                if (this.touches[j].osId == osId && !this.touches[j].isDead) {
                    t = this.touches[j];
                    break;
                }
            }

            // Handle starting and stopping touches
            if (type == TouchEvent.Start && !t) {
                t = new Touch();
                this.touches.push(t);

                ++this.touchIdCounter;
                t.id = this.touchIdCounter;
                t.osId = osId;
                t.posOld.x = x;
                t.posOld.y = y;
                t.posDown.x = x;
                t.posDown.y = y;
                t.startTime = time;
                t.isNew = true;
                t.isDead = false;
            }
            if ((type == TouchEvent.End || type == TouchEvent.Cancel) && t) {
                t.isDead = true;
            }

            // Do general state update
            if (t) {
                t.pos.x = x;
                t.pos.y = y;
                t.lastUpdateTime = time;
            }
        }
    },

    onTouchMove: function onTouchMove(event) {
        this.onTouchShared(event, TouchEvent.Move);
    },

    onTouchStart: function onTouchStart(event) {
        this.onTouchShared(event, TouchEvent.Start);
    },

    onTouchEnd: function onTouchEnd(event) {
        this.onTouchShared(event, TouchEvent.End);
    },

    onTouchCancel: function onTouchCancel(event) {
        this.onTouchShared(event, TouchEvent.Cancel);
    },

    getTouchById: function getTouchById(id) {
        for (var i = 0; i < this.touches.length; i++) {
            if (this.touches[i].id == id) {
                return this.touches[i];
            }
        }
        return null;
    }
};

module.exports = {
    m_InputHandler: m_InputHandler,
    InputType: InputType,
    InputValue: InputValue,
    Key: Key,
    MouseButton: MouseButton,
    MouseWheel: MouseWheel,
    Touch: Touch
};
