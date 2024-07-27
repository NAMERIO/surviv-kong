"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require("./2f756df0.js");

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var helpers = require("./helpers.js");
var device = require("./device.js");

var templates = {
    battleResult: require("./8f36c71c.js")
};

var kDistanceBetweenPlayerStats = 0.12298387096;
var kOrderAnimationDuration = 500; //ms

//
// MainView
//

var BattleResult = function () {
    function BattleResult() {
        (0, _classCallCheck3.default)(this, BattleResult);

        this.playerStats;
        this.lastPlayerStats = [];
        this.loading = false;
        this.error = false;
        this.data = {};
        this.isTeamAlive = 0;
    }

    (0, _createClass3.default)(BattleResult, [{
        key: 'load',
        value: function load(playerStats, isTeamAlive) {
            this.loading = true;
            this.error = false;
            this.playerStats = playerStats;
            this.lastPlayerStats = playerStats;
            this.lastScrollPos = 0;
            this.isTeamAlive = isTeamAlive;

            if (device.mobile && device.screenWidth < 1024) {
                $('#ui-mobile-kills-container').addClass('force-hide');
                $('#ui-mobile-kill-leader-wrapper').css('top', '170px');
                $('#ui-killfeed').css('top', '200px');
            }

            this.render();
        }
    }, {
        key: 'update',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(newPlayerStats, isTeamAlive, isBRVisible) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.playerStats = newPlayerStats;
                                this.isTeamAlive = isTeamAlive;

                                _context.next = 4;
                                return this.render(true, isBRVisible);

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function update(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return update;
        }()
    }, {
        key: 'render',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(isUpdate) {
                var _this = this;

                var isBRVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var newStatsPositions, content, _content;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!isUpdate) {
                                    _context2.next = 14;
                                    break;
                                }

                                if (!((0, _stringify2.default)(this.lastPlayerStats) != (0, _stringify2.default)(this.playerStats))) {
                                    _context2.next = 12;
                                    break;
                                }

                                newStatsPositions = this.getStatsPositions();

                                this.lastScrollPos = $(".ui-stats-table-content").scrollTop();

                                if (!isBRVisible) {
                                    _context2.next = 9;
                                    break;
                                }

                                _context2.next = 7;
                                return this.animateOrder(newStatsPositions).then(function () {
                                    var content = null;
                                    content = templates.battleResult({ players: _this.playerStats, isTeamAlive: _this.isTeamAlive });

                                    if (content) {
                                        $("#ui-stats-info-box").html(content);
                                        $(".ui-stats-table-content").animate({ scrollTop: _this.lastScrollPos }, 0);
                                        _this.lastPlayerStats = _this.playerStats;
                                    }
                                });

                            case 7:
                                _context2.next = 12;
                                break;

                            case 9:
                                content = null;

                                content = templates.battleResult({ players: this.playerStats, isTeamAlive: this.isTeamAlive });

                                if (content) {
                                    $("#ui-stats-info-box").html(content);
                                    $(".ui-stats-table-content").animate({ scrollTop: this.lastScrollPos }, 0);
                                    this.lastPlayerStats = this.playerStats;
                                }

                            case 12:
                                _context2.next = 17;
                                break;

                            case 14:
                                _content = '';


                                _content = templates.battleResult({ players: this.playerStats, isTeamAlive: this.isTeamAlive });

                                $('#ui-stats-info-box').append(_content);

                            case 17:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function render(_x5) {
                return _ref2.apply(this, arguments);
            }

            return render;
        }()
    }, {
        key: 'getStatsPositions',
        value: function getStatsPositions() {
            //let elementWithStats = $('.ui-stats-table-content');
            var statsPositions = [];

            var newStLength = this.playerStats.length;
            var lastStLength = this.lastPlayerStats.length;
            var maxIndex = Math.max(newStLength, lastStLength);

            //Get scale to calculate the positions correctly
            var adaptScale = false;
            var divScale = this.getCurrentScale();
            var spaceBetweenStats = 0;
            var scrollPosition = $(".ui-stats-table-content").scrollTop() * divScale;
            if (divScale && divScale != 1.0 && lastStLength) {
                adaptScale = true;

                var marginPositionTop = 0;
                marginPositionTop = $('#ui-id-' + this.lastPlayerStats[0].playerId).css('margin-bottom');
                marginPositionTop = parseInt(marginPositionTop ? marginPositionTop.split('p')[0] : 0);
                spaceBetweenStats = marginPositionTop;

                var heightPositionTop = $('#ui-id-' + this.lastPlayerStats[0].playerId).height();
                heightPositionTop = parseInt(heightPositionTop ? heightPositionTop : 0) * divScale;
                spaceBetweenStats += heightPositionTop;

                //Add scales from #ui-stats-info-box
                //Only way I find it to work, all the ways I tried to make it work dynamically failed
                //TODO delete this to use (position / divScale), testing it work ok, and doing necesary changes
                if (divScale == 0.55) {
                    divScale += 0.275;
                } else if (divScale == 0.8) {
                    divScale -= 0.55;
                }
            }

            for (var i = 0; i < maxIndex; i++) {
                if (i < newStLength && i < lastStLength) {
                    var idPlayer = 'ui-id-' + this.playerStats[i].playerId;
                    var lastPosition = $('#' + idPlayer).position() ? $('#' + idPlayer).position().top + scrollPosition : null;
                    var width = $('#' + idPlayer).width();
                    var height = spaceBetweenStats ? spaceBetweenStats : $('#' + idPlayer).height();
                    var position = $('#ui-id-' + this.lastPlayerStats[i].playerId).position() ? $('#ui-id-' + this.lastPlayerStats[i].playerId).position().top + scrollPosition : null;
                    //Adapt to scale
                    if (adaptScale) {
                        //TODO fix this with (position / divScale), testing it work ok, and doing necesary changes
                        position += position * divScale;
                        lastPosition += lastPosition * divScale;
                    }

                    statsPositions.push({ id: idPlayer, position: position, lastPosition: lastPosition, width: width, height: height });
                } else if (i < newStLength) {
                    var _idPlayer = 'ui-id-' + this.playerStats[i].playerId;
                    var _lastPosition = $('#' + _idPlayer).position() ? $('#' + _idPlayer).position().top + scrollPosition : null;
                    var _width = $('#' + _idPlayer).width();
                    var _height = spaceBetweenStats ? spaceBetweenStats : $('#' + _idPlayer).height();
                    //Adapt to scale
                    if (adaptScale) {
                        //TODO fix this with (position / divScale), testing it work ok, and doing necesary changes
                        _lastPosition += _lastPosition * divScale;
                    }

                    statsPositions.push({ id: _idPlayer, position: null, lastPosition: _lastPosition, width: _width, height: _height });
                }
            }
            return statsPositions;
        }
    }, {
        key: 'animateOrder',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(positions) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                return _context3.abrupt('return', new _promise2.default(function (resolve, reject) {
                                    var distancePos = 0;
                                    if (positions.length > 1) {
                                        distancePos = positions[0].height;
                                    }

                                    var lastPosition = 0;

                                    //Prepare stats to animate
                                    var _iteratorNormalCompletion = true;
                                    var _didIteratorError = false;
                                    var _iteratorError = undefined;

                                    try {
                                        for (var _iterator = (0, _getIterator3.default)(positions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                            var position = _step.value;

                                            var lastPos = position.lastPosition;
                                            if (lastPos != null) {
                                                //lastPos = lastPos ? (lastPos) : lastPos;
                                                $('#' + position.id).css({ 'position': 'absolute',
                                                    'width': '' + position.width,
                                                    'margin-top': lastPos });
                                            }
                                        }
                                        //Animate stats to new positions
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

                                    var _iteratorNormalCompletion2 = true;
                                    var _didIteratorError2 = false;
                                    var _iteratorError2 = undefined;

                                    try {
                                        for (var _iterator2 = (0, _getIterator3.default)(positions), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                            var _position = _step2.value;

                                            var newPos = _position.position;
                                            var lastPos = _position.lastPosition;
                                            if (lastPos != null) {
                                                if (newPos != null && newPos != lastPos) {
                                                    //newPos = newPos ? (newPos) : newPos;
                                                    $('#' + _position.id).animate({ 'margin-top': newPos }, kOrderAnimationDuration);
                                                } else if (newPos != lastPos) {
                                                    var newPosition = lastPos + lastPos * kDistanceBetweenPlayerStats + distancePos + distancePos * kDistanceBetweenPlayerStats;
                                                    $('#' + _position.id).css({ 'position': 'absolute', 'width': '' + _position.width });
                                                    $('#' + _position.id).animate({ 'margin-top': newPosition }, kOrderAnimationDuration);
                                                }
                                            }
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

                                    setTimeout(function () {
                                        resolve();
                                    }, kOrderAnimationDuration + 200);
                                }));

                            case 1:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function animateOrder(_x6) {
                return _ref3.apply(this, arguments);
            }

            return animateOrder;
        }()
    }, {
        key: 'getCurrentScale',
        value: function getCurrentScale() {
            var divScale = 1.0;
            var divTransform = $('#ui-stats-info-box').css('transform');

            if (divTransform && divTransform != 'none') {
                var divValues = divTransform.split('(')[1];
                divValues = divValues.split(')')[0];
                divValues = divValues.split(',');
                var a = divValues[0];
                var b = divValues[1];
                divScale = Math.sqrt(a * a + b * b);
            }
            return divScale;
        }
    }]);
    return BattleResult;
}();

module.exports = BattleResult;
