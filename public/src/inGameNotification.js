"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./jquery.js");
var helpers = require("./helpers.js");
var math = require("./math.js");

var QuestDefs = require("./questDefs.js").kQuestDefs;
var CurrQuestsProgress = require("./currQuestsProgress.js");

function humanizeTime(time) {
    var minutesFloor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var hours = Math.floor(Math.ceil(time / 60) / 60);
    var minutes = minutesFloor ? Math.floor(time / 60) % 60 : Math.ceil(time / 60) % 60;
    var seconds = Math.floor(time) % 60;
    var timeText = '';
    if (hours > 0) {
        timeText += hours + 'h ';
    }
    timeText += minutes + 'm';
    return timeText;
}

function humanizeTimeValue(time) {
    var minutesFloor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var hours = Math.floor(Math.ceil(time / 60) / 60);
    var minutes = minutesFloor ? Math.floor(time / 60) % 60 : Math.ceil(time / 60) % 60;
    var seconds = Math.floor(time) % 60;
    var timeRes = 0;
    if (hours > 0) {
        timeRes += hours;
    }
    timeRes += minutes;
    return timeRes;
}

//
// Quest Notification
//

var QuestNotification = function () {
    function QuestNotification(pass, localization) {
        (0, _classCallCheck3.default)(this, QuestNotification);

        this.questsNotification = null;
        this.localization = localization;
        this.pass = pass;
        this.currentQuests = new CurrQuestsProgress();
        this.questCompleted = [false, false, false];
        this.animationFinished = [true, true, true];
    }

    (0, _createClass3.default)(QuestNotification, [{
        key: 'animateQuestCompleteInGame',
        value: function animateQuestCompleteInGame(questNotification, index) {
            var _this = this;

            questNotification.elems.barFill.queue(function (el) {
                // questNotification.elems.main.addClass('pass-bg-pulse');
                questNotification.elems.counter.animate({ opacity: 0.0 }, 250);
                questNotification.elems.desc.html('COMPLETED!');
                $(el).dequeue();
            }).delay(1500).queue(function (el) {
                questNotification.elems.main.animate({ opacity: 0.0 }, 750);
                $(el).dequeue();
            }).queue(function (el) {
                //   questNotification.elems.main.removeClass('pass-bg-pulse');
                questNotification.elems.counter.css({ opacity: 1.0 });
                _this.animationFinished[index] = true;
                $(el).dequeue();
            });
        }
    }, {
        key: 'getQuestsCompleted',
        value: function getQuestsCompleted() {
            return this.questCompleted;
        }
    }, {
        key: 'getCurrentQuests',
        value: function getCurrentQuests() {
            return this.questsNotification;
        }
    }, {
        key: 'updateInGame',
        value: function updateInGame(dt, questsInfo) {
            var _this2 = this;

            if (this.questsNotification == null) {
                this.questsNotification = this.pass.getCurrentQuests();
                $('#ui-quest-notification').css({ opacity: 0.0 });
            } else {
                this.questsNotification = this.currentQuests.updateQuests(questsInfo, this.questsNotification);
            }

            var questElemInGame = $('#ui-quest-notification');

            var isAQuestLeft = false;
            // Update questsNotification
            var questsLength = this.questsNotification.length;

            var _loop = function _loop(i) {
                if (!_this2.questCompleted[i]) {
                    var questNotification = _this2.questsNotification[i];
                    questNotification.elems = {
                        main: questElemInGame,
                        info: questElemInGame.find('.ui-quest-info'),
                        desc: questElemInGame.find('#ui-quest-desc'),
                        cur: questElemInGame.find('.ui-quest-counter-current'),
                        target: questElemInGame.find('.ui-quest-counter-target'),
                        counter: questElemInGame.find('#ui-quest-progress'),
                        barFill: questElemInGame.find('.ui-quest-bar-fill')
                    };

                    questNotification.current = Math.floor(questNotification.current);

                    // Humanize time for timed quests 
                    // Progress of the quest
                    var questDef = QuestDefs[questNotification.data.type];
                    var progressValue = questNotification.data.progress;
                    if (questDef.timed) {
                        progressValue = humanizeTimeValue(progressValue, true);
                    }
                    //Current                        
                    var currentValue = Math.round(questNotification.current);
                    if (questDef.timed) {
                        currentValue = humanizeTimeValue(currentValue, true);
                    }

                    var otherQuestIndex = (i + 1) % questsLength;
                    if (progressValue > currentValue && _this2.animationFinished[otherQuestIndex]) {
                        if (!questNotification.elems.barFill.is(':animated')) {
                            questNotification.elems.main.animate({ opacity: 1.0 }, 550);
                            var pctStart = questNotification.current / questNotification.data.target * 100;
                            questNotification.elems.barFill.css({ width: pctStart + '%' });

                            //Target of the quest 
                            var _questDef = QuestDefs[questNotification.data.type];
                            var targetText = questNotification.data.target;
                            var beforeUpdateText = Math.round(questNotification.current);
                            if (_questDef.timed) {
                                targetText = humanizeTime(targetText);
                                beforeUpdateText = humanizeTime(beforeUpdateText);
                            }
                            questNotification.elems.target.html(targetText);
                            questNotification.elems.cur.html(beforeUpdateText);
                        }

                        //Name of the quest
                        var desc = _this2.localization.translate('' + questNotification.data.type) || questNotification.data.type;
                        questNotification.elems.desc.html(desc);

                        questNotification.ticker += dt;

                        if (questNotification.data.progress >= questNotification.data.target) {
                            questNotification.data.progress = questNotification.data.target;
                            _this2.questCompleted[i] = true;
                        }

                        // Update questNotification progress
                        var xpAnimDuration = 1.0;

                        questNotification.current = Math.floor(questNotification.data.progress);

                        var pctComplete = questNotification.current / questNotification.data.target * 100;

                        // Humanize time for timed quests                       
                        var currentText = Math.round(questNotification.current);
                        if (questDef.timed) {
                            currentText = humanizeTime(currentText, true);
                        }

                        var context = _this2;

                        var pctCom = 100 - pctComplete;
                        $('#quest-track-' + i).css({ 'clip-path': 'inset(0 ' + pctCom + '% 0 0' });

                        questNotification.current = questNotification.data.progress;
                        _this2.animationFinished[i] = false;
                        //Animate progress in notification
                        setTimeout(function () {
                            questNotification.elems.cur.html(currentText);
                            questNotification.elems.barFill.animate({ width: pctComplete + '%' }, 550).delay(1500).queue(function (el) {
                                if (_this2.questCompleted[i]) {
                                    // Play complete animation
                                    $('#tracking-quest-img-' + i).attr('src', 'img/gui/marker-map-quest-check.svg');
                                    setTimeout(function () {
                                        _this2.animateQuestCompleteInGame(questNotification, i);
                                        questNotification.completeAnimFinished = true;
                                    }, 550);
                                } else {
                                    questNotification.elems.main.animate({ opacity: 0.0 }, 550).queue(function (ele) {
                                        context.animationFinished[i] = true;
                                        $(ele).dequeue();
                                    });
                                }
                                $(el).dequeue();
                            });
                        }, 560); //End of timeOut block
                    }
                    if (!_this2.animationFinished[i]) {
                        isAQuestLeft = true;
                    }
                }
            };

            for (var i = 0; i < questsLength; i++) {
                _loop(i);
            }
            return isAQuestLeft;
        }
    }, {
        key: 'resetClientProgress',
        value: function resetClientProgress() {
            this.currentQuests.resetClientProgress();
            this.questsNotification = null;
        }
    }]);
    return QuestNotification;
}();

module.exports = QuestNotification;
