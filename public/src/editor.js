"use strict";


var _typeof2 = require("./1b207f64.js");

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");
var Input = require("./input.js");

//
// Editor
//
function Editor(config) {
    this.config = config;
    this.config.addModifiedListener(this.onConfigModified.bind(this));

    this.enabled = false;
    this.wasEnabled = false;
    this.zoom = GameConfig.scopeZoomRadius.desktop['1xscope'];
    this.loadNewMap = false;
    this.mapSeed = 0;
    this.printLootStats = false;

    this.setEnabled(false);
}

Editor.prototype = {
    m_free: function m_free() {},

    onConfigModified: function onConfigModified(key) {
        this.refreshUi();
    },

    setEnabled: function setEnabled(e) {
        this.enabled = e;
        this.refreshUi();
    },

    newMap: function newMap(seed) {
        this.loadNewMap = true;
        this.mapSeed = Math.max(seed, 1);
    },

    refreshUi: function refreshUi() {
        var _this = this;

        var e = this.enabled;

        $('#ui-editor').css('display', e ? 'block' : 'none');
        $('#ui-leaderboard-wrapper,#ui-right-center').css('display', !e ? 'block' : 'none');

        this.uiPos = $('<div/>');
        this.uiZoom = $('<div/>');

        var createButton = function createButton(text, fn) {
            var btn = $('<div/>', {
                class: 'btn-game-menu btn-darken',
                css: {
                    'height': '30px',
                    'line-height': '28px'
                },
                html: text
            });
            btn.on('click', function (e) {
                e.stopPropagation();
                fn();
            });
            return btn;
        };

        this.uiMapSeed = $('<div/>');
        var mapBtns = $('<div/>', {
            css: { 'display': 'flex' }
        });
        mapBtns.append(createButton('<', function () {
            _this.newMap(_this.mapSeed - 1);
        }));
        mapBtns.append($('<span/>', { css: { 'width': '12px' } }));
        mapBtns.append(createButton('>', function () {
            _this.newMap(_this.mapSeed + 1);
        }));
        mapBtns.append($('<span/>', { css: { 'width': '12px' } }));
        mapBtns.append(createButton('?', function () {
            _this.newMap(util.randomInt(1, 1 << 30));
        }));

        var lootSummaryBtn = $('<div/>', {
            css: { 'display': 'flex' }
        });
        lootSummaryBtn.append(createButton('Loot summary', function () {
            _this.printLootStats = true;
        }));

        var createCheckbox = function createCheckbox(name, key) {
            var check = $('<input/>', {
                type: 'checkbox',
                value: 'value',
                checked: _this.config.get(key)
            });
            check.on('click', function (e) {
                e.stopPropagation();

                var val = check.prop('checked');
                _this.config.set(key, val);
            });
            return check;
        };

        var createObjectUi = function createObjectUi(obj, objKey) {
            var parent = $('<ul/>', { class: 'ui-editor-list' });
            if (objKey.split('.').length == 1) {
                parent.css('padding', '0px');
            }

            var keys = (0, _keys2.default)(obj);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var val = obj[key];
                var newKey = objKey + '.' + key;

                var elem = $('<li/>', { class: 'ui-editor-list' });
                if ((typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) == 'object') {
                    elem.html('' + key);
                    elem.append(createObjectUi(val, newKey));
                } else if (typeof val == 'boolean') {
                    var check = createCheckbox(key, newKey);
                    var label = $('<div/>', {
                        css: { 'display': 'inline-block' },
                        html: key
                    });
                    elem.append(check);
                    elem.append(label);
                }
                parent.append(elem);
            }

            return parent;
        };

        var editorConfig = this.config.get('debug');
        var uiConfig = $('<div/>');
        uiConfig.append(createObjectUi(editorConfig, 'debug'));

        // Ui
        var list = $('<div/>');
        list.append($('<li/>').append(this.uiPos));
        list.append($('<li/>').append(this.uiZoom));
        list.append($('<li/>').append($('<hr/>')));
        list.append($('<li/>').append(this.uiMapSeed));
        list.append($('<li/>').append(mapBtns));
        list.append($('<li/>').append(lootSummaryBtn));
        list.append($('<li/>').append($('<hr/>')));
        list.append($('<li/>').append(uiConfig));

        $('#ui-editor-info-list').html(list);
    },

    m_update: function m_update(dt, input, player, map) {
        // Camera zoom
        if (input.m_keyPressed(Input.Key.Plus)) {
            this.zoom -= 8.0;
        }
        if (input.m_keyPressed(Input.Key.Minus)) {
            this.zoom += 8.0;
        }
        if (input.m_keyPressed(Input.Key.Zero)) {
            this.zoom = player.m_getZoom();
        }
        this.zoom = math.clamp(this.zoom, 1.0, 255.0);

        // Ui
        var posX = player.pos.x.toFixed(2);
        var posY = player.pos.y.toFixed(2);
        this.uiPos.html('Pos:  ' + posX + ', ' + posY);
        this.uiZoom.html('Zoom: ' + this.zoom);
        this.uiMapSeed.html('Map seed: ' + map.seed);

        if (!this.loadNewMap) {
            this.mapSeed = map.seed;
        }
    },

    renderCamera: function renderCamera(camera) {},

    postSerialization: function postSerialization() {
        this.loadNewMap = false;
        this.printLootStats = false;
    }
};

module.exports = Editor;
