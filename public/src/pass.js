"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var $ = require("./8ee62bea.js");
var helpers = require("./helpers.js");
// @ts-ignore
var math = require("./10899aea.js");
// @ts-ignore
var passUtil = require("./passUtil.js");

// @ts-ignore
var GameObjectDefs = require("./gameObjectDefs.js");
// @ts-ignore
var PassDefs = require("./passDefs.js");
// @ts-ignore
var QuestDefs = require("./questDefs.js").kQuestDefs;
// @ts-ignore
var CurrencyDefs = require("./currencyDefs.js");
// @ts-ignore
var Rarities = require("./rarities.js");
var device = require("./device.js");

var MenuModal = require("./menuModal.js");
var RewardsModal = require("./modal-quest-rewards.js");
var survivLoading = require("./survivLoading.js");
var TimerDisplay = require("./timerDisplay.js");
var SideNotification = require("./sideNotification.js");
var ModalBuyGoldPass = require("./modalBuyGoldPass.js");
var ModalSeasonRewards = require("./modalSeasonRewards.js");

//
// Helpers
//

function humanizeTime(time) {
    var minutesFloor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var hours = Math.floor(Math.ceil(time / 60) / 60);
    var minutes = minutesFloor ? Math.floor(time / 60) % 60 : Math.ceil(time / 60) % 60;
    // @ts-ignore
    var seconds = Math.floor(time) % 60;
    var timeText = '';
    if (hours > 0) {
        timeText += hours + 'h ';
    }
    timeText += minutes + 'm';
    return timeText;
}

//
// Pass
//

var Pass = function () {
    /**
     * 
     * @param {import('./account')} account 
     * @param {import('./loadout-menu')} loadoutMenu 
     * @param {import('./localization')} localization 
     * @param {import('./iap')} iap 
     * @param {import('./ads').AdManager} adManager
     */
    function Pass(account, loadoutMenu, localization, iap, adManager) {
        (0, _classCallCheck3.default)(this, Pass);

        this.adManager = adManager;
        this.account = account;
        this.loadoutMenu = loadoutMenu;
        this.localization = localization;
        this.iap = iap;
        this.events = {};

        this.pass = {
            data: {
                type: 'pass_BHA0'
            },
            currentXp: 0,
            currentLevel: 1,
            levelXp: 0,
            ticker: 0.0,
            animSteps: [],
            elems: {}
        };
        this.quests = [];
        this.fixedQuest = null;

        this.loaded = false;
        this.lockDisplayed = false;
        this.needToUpdatePass = false;
        this.updatePassTicker = 0.0;
        this.questsShown = false;
        this.passShown = false;
        this.doNotUpdatePass = false;
        this.updatePassScrollOnPass = false;

        this.updatedXpBoost = true;

        this.stimfieldTimer = null;
        this.QuestsTimer = null;
        this.ModalQuestsTimer = null;
        this.SideNotification = null;
        this.ModalBuyGoldPass = null;

        this.init();
    }

    (0, _createClass3.default)(Pass, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.loadPlaceholders();
            this.loadAllPassItems();
            this.account.addEventListener('request', this.onRequest.bind(this));
            this.account.addEventListener('pass', this.onPass.bind(this));
            this.account.addEventListener('startSpinReward', this.startSpinReward.bind(this));
            this.account.addEventListener('showDiscount', this.showDiscount.bind(this));
            this.account.addEventListener('stimevents', this.checkStimfieldEvents.bind(this));
            this.account.addEventListener('showPremiunModal', this.showPremiumModal.bind(this));

            this.passPremiumModal = new MenuModal($('#modal-pass-premium'));
            this.passXPModal = new MenuModal($('#modal-reward-xp'));
            this.modalReplaceQuests = new MenuModal($('#modal-replace-quests'));

            this.instantRefreshModal = new MenuModal($('#modal-instant-refresh'));
            this.instantRefreshVideoModal = new MenuModal($('#modal-instant-refresh-video'));

            var updateQuests = function updateQuests() {
                _this.account.getPass(null);_this.QuestsTimer.updateTime(passUtil.getTimeWhenQuestsRefresh());
            };
            this.QuestsTimer = new TimerDisplay(this.localization, document.querySelector('#quests-timer-container'), 'new-quests-in', passUtil.getTimeWhenQuestsRefresh(), updateQuests.bind(this), 'quests');

            var that = this;

            //Scroll dragging season pass
            this.scrollPos = { left: 0, y: 0 };
            var containerElement = document.querySelector('.season-pass-container-rows');
            containerElement.addEventListener('mousedown', function (e) {
                // @ts-ignore
                containerElement.style.cursor = 'grabbing';

                // @ts-ignore
                that.pos = {
                    left: containerElement.scrollLeft,
                    // @ts-ignore
                    x: e.clientX
                };

                document.addEventListener('mouseup', resetSeasonScroll);
                containerElement.addEventListener('mousemove', moveSeasonScroll);
            });

            var moveSeasonScroll = function moveSeasonScroll(e) {
                // @ts-ignore
                var movedValue = e.clientX - that.pos.x;

                // @ts-ignore
                containerElement.scrollLeft = that.pos.left - movedValue;
            };
            var resetSeasonScroll = function resetSeasonScroll() {
                document.removeEventListener('mouseup', resetSeasonScroll);
                containerElement.removeEventListener('mousemove', moveSeasonScroll);
                // @ts-ignore
                containerElement.style.cursor = 'grab';
            };

            //Scroll with arrow buttons
            document.querySelector('#season-pass-next').addEventListener('click', function () {
                var scrollAmount = 0;
                var slideTimer = setInterval(function () {
                    containerElement.scrollLeft += 10;
                    scrollAmount += 10;
                    if (scrollAmount >= 180) {
                        window.clearInterval(slideTimer);
                    }
                }, 15);
            });
            document.querySelector('#season-pass-prev').addEventListener('click', function () {
                var scrollAmount = 0;
                var slideTimer = setInterval(function () {
                    containerElement.scrollLeft -= 10;
                    scrollAmount += 10;
                    if (scrollAmount >= 180) {
                        window.clearInterval(slideTimer);
                    }
                }, 15);
            });

            //Update season progress bar
            $('.close-corner, #season-pass-button').on('click', function () {
                that.updateProgressBar(true);
            });
        }
    }, {
        key: 'onPass',
        value: function onPass(pass, quests, fixedQuest, resetRefresh) {
            var _this2 = this;

            //TODO clean this function and this class in general, a lot of code is not used anymore

            var refreshOffset = 5 * 1000;
            // Update quests
            var newQuests = [];
            var questsCompleted = [];
            var questAnimCount = 0;

            if (fixedQuest.isNew) {
                this.SideNotification = new SideNotification(document.querySelector('#side-notification-outer-container'), this.localization, 'new-quests-available');
            }

            // Update fixed quest
            var fixedQuestElem = $('#quests-section').find('.fixed-quest');
            var tmpFixedQuest = {
                data: fixedQuest,
                start: 0,
                current: 0,
                ticker: 0.0,
                delay: 0.5,
                playCompleteAnim: false,
                progressAnimFinished: false,
                completeAnimFinished: false,
                shouldRequestRefresh: resetRefresh,
                refreshSet: false,
                refreshEnabled: false,
                timer: {
                    enabled: false,
                    str: ''
                }
            };

            tmpFixedQuest.elems = {
                main: fixedQuestElem,
                title: fixedQuestElem.find('.quest-title'),
                counter: fixedQuestElem.find('.quest-progress-counter'),
                barFill: fixedQuestElem.find('.quest-progress-bar-inner')
            };

            if (this.fixedQuest) {
                tmpFixedQuest.start = this.fixedQuest.current;
                tmpFixedQuest.current = this.fixedQuest.current;

                if (!this.fixedQuest.data.complete && tmpFixedQuest.data.complete) {
                    tmpFixedQuest.playCompleteAnim = true;
                }
            }

            tmpFixedQuest.data.progress = math.min(tmpFixedQuest.data.progress, tmpFixedQuest.data.target);

            var pctFixed = tmpFixedQuest.current / tmpFixedQuest.data.target * 100;
            tmpFixedQuest.elems.barFill.css({ '--progress': pctFixed + '%' });

            var titleKey = '' + tmpFixedQuest.data.type;
            var title = this.localization.translate(titleKey) || tmpFixedQuest.data.type;
            tmpFixedQuest.elems.title.html(title);
            tmpFixedQuest.elems.counter.html('&nbsp;(' + pctFixed + '%)');

            tmpFixedQuest.elems.main.css('display', 'flex');

            if (tmpFixedQuest.data.progress >= tmpFixedQuest.data.target && !tmpFixedQuest.data.complete) {
                var questDefTmp = QuestDefs[tmpFixedQuest.data.type];
                questsCompleted.push({ isQuest: true, questId: tmpFixedQuest.data.type, xpReward: questDefTmp.xp, essenceReward: questDefTmp.essence });
            }

            this.fixedQuest = tmpFixedQuest;

            // Update quest refresh status

            var _loop = function _loop(i) {
                var questData = quests[i];

                var quest = {
                    data: questData,
                    start: 0,
                    current: 0,
                    ticker: 0.0,
                    delay: questAnimCount * 0.5,
                    playCompleteAnim: false,
                    progressAnimFinished: false,
                    completeAnimFinished: false,
                    shouldRequestRefresh: resetRefresh,
                    refreshTime: Date.now() + questData.timeToRefresh + refreshOffset,
                    refreshSet: false,
                    refreshEnabled: false,
                    timer: {
                        enabled: false,
                        str: ''
                    }
                };

                var curQuest = _this2.quests.find(function (x) {
                    return x.data.idx == quest.data.idx && x.data.type == quest.data.type;
                });
                if (curQuest) {
                    quest.start = curQuest.current;
                    quest.current = curQuest.current;

                    if (!curQuest.data.complete && quest.data.complete) {
                        quest.playCompleteAnim = true;
                    }
                }

                quest.data.progress = math.min(quest.data.progress, quest.data.target);

                if (quest.data.progress > quest.current) {
                    questAnimCount++;
                }

                var questElem = $('#quest-' + quest.data.idx);
                quest.elems = {
                    main: questElem,
                    xp: questElem.find('.quest-reward-xp'),
                    essence: questElem.find('.quest-reward-essence'),
                    title: questElem.find('.quest-name'),
                    counter: questElem.find('.quest-progress-counter'),
                    difficulty: questElem.find('.quest-difficulty-text'),
                    barFill: questElem.find('.quest-progress-bar-inner'),
                    loading: questElem.find('.quest-loading-spinner'),
                    img: questElem.find('.quest-icon'),
                    completedImg: questElem.find('.quest-completed-icon')
                };

                // Initialize quest UI
                var questDef = QuestDefs[quest.data.type];
                var titleKey = '' + quest.data.type;
                var title = _this2.localization.translate(titleKey) || quest.data.type;
                var pct = quest.current / quest.data.target * 100;

                /*if(pass.xp_rewards !== false && pass.xp_reward_timestamp != null){
                    var countDownDate = this.getCountDownXpRewards(pass);
                     // Get today's date and time
                    var now = new Date().getTime();
                     // Find the distance between now and the count down date
                    var distanceXPTimer = countDownDate - now;
                    
                    if(distanceXPTimer<0 && quest.data.xpReward){
                        quest.data.xpReward -= quest.data.arg.xp * 0.5; //If needed to change update on server too to give correct value of xp
                    }
                }*/

                quest.elems.main.css('display', 'flex');
                quest.elems.title.html(title);
                quest.elems.xp.html('' + (quest.data.args.xp ? quest.data.args.xp : questDef.xpMin));
                if (quest.data.args.essence) quest.elems.essence.html('' + quest.data.args.essence);else quest.elems.essence.css('display', 'none');
                quest.elems.barFill.css({ '--progress': pct + '%' });
                quest.elems.loading.css('display', 'none');

                // Humanize time for timed quests
                var targetText = quest.data.target;
                if (questDef.timed) {
                    targetText = humanizeTime(targetText);
                }
                if (quest.current !== quest.data.target && !quest.data.complete) {
                    quest.elems.counter.html('(' + quest.current + '/' + targetText + ')');
                    quest.elems.counter.removeClass('completed');
                    quest.elems.barFill.removeClass('completed');
                    quest.elems.essence.parent().removeClass('completed');
                    quest.elems.xp.parent().removeClass('completed');
                    quest.elems.completedImg.css({ display: 'none' });
                } else {
                    quest.elems.counter.html(_this2.localization.translate('completed'));
                    quest.elems.counter.addClass('completed');
                    quest.elems.barFill.addClass('completed');
                    quest.elems.essence.parent().addClass('completed');
                    quest.elems.xp.parent().addClass('completed');
                    quest.elems.completedImg.css({ display: 'block' });
                }

                //Difficulty
                var percentage = (quest.data.target - questDef.targetMin) / (questDef.targetMax - questDef.targetMin);
                var difficultyLocalization = 'difficulty-easy';
                var iconImg = '../img/quests/icon-quest-easy.png';
                if (percentage > 0.4 && percentage <= 0.7) {
                    difficultyLocalization = 'difficulty-medium';
                } else if (percentage > 0.7) {
                    difficultyLocalization = 'difficulty-hard';
                }
                quest.elems.difficulty.html('&nbsp' + _this2.localization.translate(difficultyLocalization));

                // Show an icon if one is defined
                //quest.elems.img.css({'background-image': `url(${questDef.img || '../img/quests/icon-quest-easy.png'})`}); @TODO: set quest icons
                quest.elems.img.css({ 'background-image': 'url(' + (iconImg || '../img/quests/icon-quest-easy.png') + ')' });

                if (quest.data.progress >= quest.data.target && !quest.data.complete) questsCompleted.push({ isQuest: true, questId: quest.data.type, xpReward: quest.data.args.xp ? quest.data.args.xp : questDef.xpMin, essenceReward: quest.data.args.essence });

                newQuests.push(quest);
            };

            for (var i = 0; i < quests.length; i++) {
                _loop(i);
            }

            this.quests = newQuests;

            //Show season rewards new levels;
            if (pass.newGP || pass.newItems) {
                //this.doNotUpdatePass = true;
                var modalRewards = new ModalSeasonRewards(this.account, this.localization, this.loadoutMenu.armoryGearMenu, pass.lvlUpItems, pass.gpChange, pass.level);
                modalRewards.show();
            }

            // Update the pass
            this.updatePassScrollOnPass = true;
            var passDef = PassDefs[pass.type];

            this.pass.priceBasic = passDef.buyOptions['basic'].price;
            this.pass.priceAllLevels = passDef.buyOptions['vip'].price;

            this.pass.data = pass;
            this.pass.animSteps = [];
            this.pass.currentXp = Math.round(this.pass.currentXp);
            this.pass.levelXp = passUtil.getPassLevelXp(pass.type, this.pass.currentLevel);
            this.pass.premium = pass.premium || false;
            this.pass.vip = pass.vip || false;
            localStorage.setItem('premium', this.pass.premium);
            this.pass.xp_rewards = pass.xp_rewards || false;
            this.pass.xp_reward_timestamp = pass.xp_reward_timestamp || null;

            if (!this.loaded) {
                var _levelXp = passUtil.getPassLevelXp(pass.type, pass.level);
                this.pass.totalLevels = passDef.items.length - 1;
                this.pass.finalLevel = passDef.items[this.pass.totalLevels].level;
                this.pass.currentXp = 0;
                this.pass.currentLevel = pass.level > this.pass.finalLevel ? this.pass.finalLevel : pass.level;
                this.pass.levelXp = _levelXp;
                this.pass.ticker = 0.0;
                this.pass.startDate = passDef.startDate;
                this.pass.endDate = passDef.endDate;
                this.pass.premium = pass.premium;
                this.pass.xp_rewards = pass.xp_rewards;
                this.pass.xp_reward_timestamp = pass.xp_reward_timestamp;
                this.pass.type = pass.type;
            }

            if (!this.ModalBuyGoldPass) this.ModalBuyGoldPass = new ModalBuyGoldPass(this.account, this.localization, pass.type, this.pass.priceBasic, this.pass.priceAllLevels);

            if (questsCompleted) {
                if (questsCompleted.length > 1) RewardsModal.show(questsCompleted, 'quests-complete', this.pass.currentLevel < this.pass.finalLevel); //Se llama el Reward Model
                else RewardsModal.show(questsCompleted, 'quest-complete', this.pass.currentLevel < this.pass.finalLevel);
            }

            this.pass.discountLevel = null;
            //TODO do discount
            /*if (!this.pass.premium && pass.discount_level) {
                this.pass.discountLevel = pass.discount_level;
                this.pass.discountTime = pass.discount_time;
                let discount = passDef.discountLevels[pass.discount_level].discount / 100;
                this.pass.priceBasic = this.pass.priceBasic - (this.pass.priceBasic * discount);
                $('#modal-pass-price-basic').html(this.pass.priceBasic);
                $('.pass-premium-buy-btn .percent-box').show();
                $('.pass-premium-buy-btn .percent-box').html(passDef.discountLevels[pass.discount_level].discount + '% OFF');
            }*/

            var level = this.pass.currentLevel;
            var xp = this.pass.currentXp;

            // Animate level-ups
            if (this.loaded) {
                while (level < pass.level) {
                    var _levelXp2 = passUtil.getPassLevelXp(pass.type, level);
                    this.pass.animSteps.push({
                        startXp: xp,
                        targetXp: _levelXp2,
                        levelXp: _levelXp2,
                        targetLevel: level + 1
                    });
                    level++;
                    xp = 0;
                }

                var delay = questAnimCount > 0 ? 2.0 : 0.0;
                this.pass.ticker = -delay;
            }
            // Animate leftover xp
            var levelXp = passUtil.getPassLevelXp(pass.type, level);
            this.pass.animSteps.push({
                startXp: xp,
                targetXp: pass.xp,
                levelXp: levelXp,
                targetLevel: level
            });

            $('#season-loading-spinner').css('display', 'none');

            // Set progress
            var pct = this.pass.currentXp / this.pass.levelXp * 100;
            /*if(pct>100){
                $('#season-progress-bar-fill').css({ width: `100%` });
            }
            else{
                $('#season-progress-bar-fill').css({ width: `${pct}%` });
            }*/

            var firstLevelWidth = 71; //px bar for the first level
            var barLevelWidth = void 0;
            if (this.pass.currentLevel === 1) {
                barLevelWidth = firstLevelWidth;
            } else {
                barLevelWidth = ($('.season-pass-progress-outer').width() - firstLevelWidth) / this.pass.totalLevels;
            }

            var currentLevel = void 0;
            var fillBar = $('#season-progress-bar-fill');
            if (this.pass.currentLevel === 1) {
                currentLevel = 0;
            } else {
                var currentLevelCss = this.pass.currentLevel - 2;
                currentLevel = firstLevelWidth + barLevelWidth * currentLevelCss;

                //This will offset the inner progress of the xp received in the season pass so it match with the icons of the levels numbers
                if (currentLevelCss > 0) {
                    var baseBorderWidth = 4; //px
                    fillBar.css({ '--border-width': baseBorderWidth * currentLevelCss + 'px' });
                }
            }

            var leftPX = barLevelWidth * pct / 100;

            fillBar.css({ '--progress': currentLevel + leftPX + 'px' });

            this.updateXPTimerAndUI(this);
            if (this.pass.endDate) {
                // @ts-ignore
                document.querySelector('#season-timer-container').style.display = 'flex';
                this.startPassTimer(this.pass.startDate, this.pass.endDate, '#season-timer-container');
            } else
                // @ts-ignore
                document.querySelector('#season-timer-container').style.display = 'none';

            $('#season-buy-btn').off('click');
            if (!this.pass.premium) {
                $('#season-buy-btn').on('click', function () {
                    _this2.showPremiumModal();
                });
            }

            $('#pass-buy-btn-spectate').off('click');
            if (!this.pass.premium) {
                $('#pass-buy-btn-spectate').on('click', function () {
                    _this2.showPremiumModal(true);
                });
            }

            $('#pass-xp-buy-btn').off('click');
            $('#pass-xp-buy-btn').on('click', function () {
                if (device.webview == true) {
                    if (_this2.pass) {
                        survivLoading.showSurvivLoading();
                        var distance = _this2.account.getXPRewardDistance(_this2.pass.xp_reward_timestamp);
                        console.log("Pass Xp:" + _this2.pass.currentXp);
                        if (distance < 0 || _this2.pass.xp_rewards == false) {
                            _this2.account.displayVideoAd(_this2);
                        } else {
                            survivLoading.hideSurvivLoading();
                            console.log("REWARD ALREADY USED");
                        }
                    }
                } else {
                    if (device.os == 'ios') {
                        window.open('itms-apps://itunes.apple.com/app/id1401727934');
                    } else if (device.os == 'android') {
                        window.open('market://details?id=io.surviv.surviv_io_mobile');
                    } else {
                        window.open('market://details?id=io.surviv.surviv_io_mobile');
                    }
                }
            });

            $('#pass-xp-store-btn').off('click');
            $('#pass-xp-store-btn').on('click', function () {
                if (device.os == 'ios') {
                    window.open('itms-apps://itunes.apple.com/app/id1401727934');
                } else if (device.os == 'android') {
                    window.open('market://details?id=io.surviv.surviv_io_mobile');
                }
            });

            //@TODO: REMOVE SURVIV
            /*if (this.pass.premium && !$('#pass-buy-btn').hasClass('premium')) { 
                $('#pass-buy-btn').addClass('premium');
                $('#pass-buy-btn').empty();
                 let goldPassText = $('<div>');
                let bonusText = $('<div>');
                 goldPassText.addClass('pass-gold-pass-text');
                bonusText.addClass('pass-bonus-text');
                 goldPassText.html('Gold Pass:');
                bonusText.html('Bonus +100% XP');
                 goldPassText.appendTo('#pass-buy-btn');
                bonusText.appendTo('#pass-buy-btn');
            }*/

            if (this.pass.vip) {
                var xpMult = passDef.buyOptions['vip'].extraXP * 100;
                $('#season-buy-btn').addClass('btn-disabled gold');
                var newHtml = '<div class=\'season-btn-text\'>+' + xpMult + '% XP</div>\n                            <div class=\'season-btn-text\'>&nbsp;' + this.localization.translate('vip-pass-bonus') + '</div>';
                $('#season-buy-btn').html(newHtml);
            } else if (this.pass.premium) {
                var _xpMult = passDef.buyOptions['basic'].extraXP * 100;
                $('#season-buy-btn').addClass('btn-disabled gold');

                var _newHtml = '<div class=\'season-btn-text\'>+' + _xpMult + '% XP</div>\n                            <div class=\'season-btn-text\'>&nbsp;' + this.localization.translate('gold-pass-bonus') + '</div>';
                $('#season-buy-btn').html(_newHtml);
            }

            if (this.pass.premium) {
                if (!$('.account-details-block').hasClass('gold-button')) {
                    if ($('.account-details-block').hasClass('blue-button2')) $('.account-details-block').removeClass('blue-button2');
                    $('.account-details-block').addClass('gold-button');
                }

                $('.login-box').addClass('login-box-premium');
                $('.login-box').removeClass('login-box');
            }

            //Hide ads if vip battlepass
            if (this.pass.vip) {
                document.getElementById('home_bl_med_rect_btf').classList.add('hide-ad');
                document.getElementById('home_br_med_rect_btf').classList.add('hide-ad');
                document.getElementById('home_bc_leaderboard_btf').classList.add('hide-ad');
                document.getElementById('results_bc_leaderboard_btf').classList.add('hide-ad');
                document.getElementById('spectate_tp_leaderboard_atf').classList.add('hide-ad');

                //Video ad
                document.getElementById('ui-spectate-video-ad-container-desktop').classList.add('hide-ad');
                document.getElementById('ui-spectate-ad-container-desktop').classList.add('hide-add');
                this.adManager.hideSpectateVideoAd();

                //Center UI to fill empty space of ads in home page
                //$('#start-row-top').addClass('center-start-row');
            }

            this.loaded = true;
        }

        // @ts-ignore

    }, {
        key: 'showPremiumModal',
        value: function showPremiumModal() {
            var isFromSpectate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!this.ModalBuyGoldPass) return;

            this.account.analytics.navActionsEvent('Season', 'GBP Purchase Info (Button)', 'Entered GBP Popup', '');
            this.ModalBuyGoldPass.show();

            /*this.passPremiumModal.show();
            $('#modal-pass-buy-all-btn').off('click');
            $('#modal-pass-buy-basic-btn').off('click');
            $('#modal-pass-buy-all-btn').on('click', () => {
                if (this.account.loggedIn && !this.account.unlinked && (this.pass.priceAllLevels > this.account.profile.gpTotal)) {
                    this.iap.showContextualOffer(isFromSpectate ? null : (this.pass.priceAllLevels - this.account.profile.gpTotal), {window: 'GBP'});
                } else if (this.account.loggedIn && !this.account.unlinked) {
                    this.account.buyUserPass('vip');
                    this.passPremiumModal.hide();
                } else {
                    this.emit('incentiveModal');
                }
            });
            $('#modal-pass-buy-basic-btn').on('click', () => {
                if (this.account.loggedIn && !this.account.unlinked && this.pass.priceBasic > this.account.profile.gpTotal) {
                    this.iap.showContextualOffer(isFromSpectate ? null : (this.pass.priceBasic - this.account.profile.gpTotal), {window: 'GBP'});
                } else if (this.account.loggedIn && !this.account.unlinked) {
                    this.account.buyUserPass('basic');
                    this.passPremiumModal.hide();
                } else {
                    this.emit('incentiveModal');
                }
            });
             if (this.pass.discountLevel) {
                this.showModalDiscountExtra();
            }*/
        }
    }, {
        key: 'startPassTimer',
        value: function startPassTimer(startDate, endDate, timerContainer) {
            this.seasonTimer = new TimerDisplay(this.localization, document.querySelector(timerContainer), 'season-available-in', endDate, null, 'season', startDate);
        }
    }, {
        key: 'startEventTimer',
        value: function startEventTimer(date, timerContainer, cb) {
            // Set the date we're counting down to
            var countDownDate = new Date(date).getTime();

            var that = this;

            // Update the count down every 1 second
            this.stimfieldTimer = setInterval(function () {
                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                var minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
                var seconds = Math.floor(distance % (1000 * 60) / 1000);

                // @ts-ignore
                hours = hours < 10 ? '0' + hours : hours;
                // @ts-ignore
                minutes = minutes < 10 ? '0' + minutes : minutes;
                // @ts-ignore
                seconds = seconds < 10 ? '0' + seconds : seconds;

                $(timerContainer).text(hours + ":" + minutes + ":" + seconds);

                // If the count down is finished, write some text
                if (distance < 0) {
                    if (that.stimfieldTimer) clearInterval(that.stimfieldTimer);
                    $(timerContainer).text("00:00:00");
                    setTimeout(function () {
                        if (cb) cb();
                    }, 2000);
                }
            }, 1000);
        }
    }, {
        key: 'updateXPTimerAndUI',
        value: function updateXPTimerAndUI(context) {
            if (device.mobile) {
                $('.pass-xp-box-timer').css('display', 'none');
                $('#pass-xp-buy-btn').css('display', 'block');
                if (device.webview == true) {
                    // $('#pass-loading').css('display', 'none');
                    survivLoading.hideSurvivLoading();
                    if (this.pass !== undefined && this.pass.xp_rewards !== false && this.pass.xp_reward_timestamp != null) {
                        //$('#pass-loading').css('display', 'none');
                        var countDownDate = this.getCountDownXpRewards(this.pass);
                        if (this.pass.xp_rewards) this.updatedXpBoost = false;

                        // Update the count down every 1 second
                        var x = setInterval(function () {

                            // Get today's date and time
                            var now = new Date().getTime();

                            // Find the distance between now and the count down date
                            var distanceXPTimer = countDownDate - now;

                            // Time calculations for days, hours, minutes and seconds
                            var minutes = Math.floor(distanceXPTimer % (1000 * 60 * 60) / (1000 * 60));
                            var seconds = Math.floor(distanceXPTimer % (1000 * 60) / 1000);

                            $('.pass-xp-btn-text').text(minutes + "m " + seconds + "s ");

                            // If the count down is finished, write some text
                            if (distanceXPTimer < 0) {
                                clearInterval(x);
                                $('.pass-xp-btn-text').text(context.localization.translate('pass-unlock-video-reward')); //"GET +50% XP");
                                //$('.pass-xp-btn-text').text('Get 15mins of +50% XP');//"GET +50% XP");
                                if (!this.updatedXpBoost) {
                                    this.updatedXpBoost = true;
                                    context.account.getPass();
                                }
                            }
                        }, 1000);
                    }
                } else {
                    $('#pass-xp-box-timer').css('display', 'none');
                    $('.pass-xp-btn-text').text(this.localization.translate('pass-button-app-reward'));
                    if (this.pass !== undefined && this.pass.xp_rewards !== false && this.pass.xp_reward_timestamp != null) {
                        //$('#pass-loading').css('display', 'none');
                        var countDownDate2 = this.getCountDownXpRewards(this.pass);
                        if (this.pass.xp_rewards) this.updatedXpBoost = false;

                        // Update the count down every 1 second
                        var y = setInterval(function () {

                            // Get today's date and time
                            var now = new Date().getTime();

                            // Find the distance between now and the count down date
                            var distanceXPTimer = countDownDate2 - now;

                            // If the count down is finished, write some text
                            if (distanceXPTimer < 0) {
                                clearInterval(y);
                                if (!this.updatedXpBoost) {
                                    this.updatedXpBoost = true;
                                    context.account.getPass();
                                }
                            }
                        }, 1000);
                    }
                }
            } else {
                $('#pass-xp-buy-btn').css('display', 'none');
                $('#pass-xp-box-timer').css('display', 'block');
                //$('.pass-xp-box-timer').text("Play on iOS or Android for XP Boost");   
                //$('.pass-xp-box-timer').text(this.localization.translate('pass-store-video-reward'));
                //pass-unlock-video-reward
                if (this.pass !== undefined && this.pass.xp_rewards !== false && this.pass.xp_reward_timestamp != null) {
                    //$('#pass-loading').css('display', 'none');
                    var countDownDate3 = this.getCountDownXpRewards(this.pass);
                    if (this.pass.xp_rewards) this.updatedXpBoost = false;

                    // Update the count down every 1 second
                    var z = setInterval(function () {

                        // Get today's date and time
                        var now = new Date().getTime();

                        // Find the distance between now and the count down date
                        var distanceXPTimer = countDownDate3 - now;

                        // If the count down is finished, write some text
                        if (distanceXPTimer < 0) {
                            clearInterval(z);
                            if (!this.updatedXpBoost) {
                                this.updatedXpBoost = true;
                                context.account.getPass();
                            }
                        }
                    }, 1000);
                }
            }
        }
    }, {
        key: 'getCountDownXpRewards',
        value: function getCountDownXpRewards(pass) {
            var rewardDate = pass.xp_reward_timestamp;
            var d1 = new Date(rewardDate);
            var endDate = new Date(d1);
            endDate.setMinutes(d1.getMinutes() + 15);

            // Set the date we're counting down to
            return new Date(endDate).getTime();
        }
    }, {
        key: 'onRequest',
        value: function onRequest(account) {
            $('#pass-loading').css('display', account.loggingIn ? 'block' : 'none');

            if (this.ModalBuyGoldPass) this.ModalBuyGoldPass.updatePrices(this.pass.priceBasic, this.pass.priceAllLevels);
        }
    }, {
        key: 'scheduleUpdatePass',
        value: function scheduleUpdatePass(delay) {
            this.needToUpdatePass = true;
            this.updatePassTicker = delay;
        }
    }, {
        key: 'setQuestRefreshEnabled',
        value: function setQuestRefreshEnabled() {
            var _this3 = this;

            var replaceBtn = $('#quests-section').find('.quest-replace-btn ');
            var currency = replaceBtn.find('.quest-button-currency');
            var replacePrice = this.account.questReplacePrice || 0;
            currency.html(replacePrice != 0 ? replacePrice : this.localization.translate('error-loading'));

            if (replacePrice > 0 && this.account.profile.gpTotal >= replacePrice) {
                replaceBtn.off('click');
                replaceBtn.removeClass('btn-disabled');

                replaceBtn.on('click', function () {
                    _this3.showModalReplaceQuests(replaceBtn);
                });
            } else {
                replaceBtn.addClass('btn-disabled');
            }
        }
    }, {
        key: 'showModalReplaceQuests',
        value: function showModalReplaceQuests(replaceBtnElement) {
            var _this4 = this;

            var timerContainerElement = document.querySelector('#modal-replace-timer-container');
            var modalElement = $('#modal-replace-quests');
            var priceElement = modalElement.find('.modal-replace-price');
            var confirmReplaceBtn = modalElement.find('.modal-replace-confirm');
            priceElement.html(this.account.questReplacePrice ? this.account.questReplacePrice : this.localization.translate('error-loading'));

            if (!this.ModalQuestsTimer) this.ModalQuestsTimer = new TimerDisplay(this.localization, timerContainerElement, null, passUtil.getTimeWhenQuestsRefresh());else this.ModalQuestsTimer.updateTime(passUtil.getTimeWhenQuestsRefresh());

            confirmReplaceBtn.off('click');
            confirmReplaceBtn.on('click', function () {
                replaceBtnElement.addClass('btn-disabled');
                for (var i = 0; i < _this4.quests.length; i++) {
                    _this4.quests[i].elems.loading.css('display', 'block');
                    _this4.account.analytics.challengeProgress('Replace', _this4.quests[i].data);
                }
                _this4.account.replaceQuests();
            });

            this.modalReplaceQuests.show();
        }
    }, {
        key: 'animatePassLevelUp',
        value: function animatePassLevelUp() {
            // @ts-ignore
            var that = this;
            this.updateProgressBar();
            /*$( ".season-pass-progress-checkpoint" ).each(function( index ) {
                if ($( this ).text() == (that.pass.currentLevel)) {
                    $( this ).addClass('passed');
                }
            });*/
        }
    }, {
        key: 'animateQuestComplete',
        value: function animateQuestComplete(quest) {
            this.account.analytics.challengeProgress('complete', quest.data);
            quest.elems.barFill.queue(function (el) {
                //quest.elems.main.addClass('pass-bg-pulse');
                quest.elems.xp.addClass('pass-text-pulse');
                quest.elems.refresh.css({ opacity: 0.25 }, 250);
                quest.elems.refresh.removeClass('btn-disabled');
                quest.elems.refresh.animate({ opacity: 0.0 }, 250);
                quest.elems.counter.animate({ opacity: 0.0 }, 250);
                quest.elems.desc.html('QUEST COMPLETE!');
                $(el).dequeue();
            }).delay(1000).queue(function (el) {
                quest.elems.main.animate({ opacity: 0.0 }, 750);
                $(el).dequeue();
            });
        }
    }, {
        key: 'update',
        value: function update(dt) {
            this.updatePassTicker -= dt;
            if (this.needToUpdatePass && this.updatePassTicker < 0.0) {
                this.needToUpdatePass = false;
                this.account.getPass(false);
            }

            // Refresh status
            this.setQuestRefreshEnabled();

            if (this.SideNotification) this.SideNotification.update(dt);

            // Update quests
            if (this.questsShown) this.updateQuests(dt);

            // Update pass
            if (this.passShown) // && !this.doNotUpdatePass)
                this.updatePass(dt);
        }
    }, {
        key: 'updateQuests',
        value: function updateQuests(dt) {
            var xpAnimDuration = 1.0;

            if (this.fixedQuest) {
                //Update fixed quest progress
                this.fixedQuest.ticker += dt;

                // Update quest progress
                if (!this.fixedQuest.progressAnimFinished) {
                    var t = math.clamp((this.fixedQuest.ticker - this.fixedQuest.delay) / xpAnimDuration, 0.0, 1.0);
                    this.fixedQuest.current = math.lerp(math.easeOutExpo(t), this.fixedQuest.start, this.fixedQuest.data.progress);

                    var pctComplete = this.fixedQuest.current / this.fixedQuest.data.target * 100;

                    // Humanize time for timed quests
                    var questDef = QuestDefs[this.fixedQuest.data.type];
                    var currentText = Math.round(this.fixedQuest.current);
                    var _targetText = Math.round(this.fixedQuest.data.target);
                    if (questDef.timed) {
                        // @ts-ignore
                        currentText = humanizeTime(currentText, true);
                        // @ts-ignore
                        _targetText = humanizeTime(_targetText);
                    }
                    this.fixedQuest.elems.counter.html('&nbsp;(' + Math.floor(pctComplete) + '%)');
                    this.fixedQuest.elems.barFill.css({ '--progress': pctComplete + '%' });

                    if (t >= 1.0) {
                        this.fixedQuest.progressAnimFinished = true;
                    }
                }
            }

            for (var i = 0; i < this.quests.length; i++) {
                var _quest = this.quests[i];

                _quest.ticker += dt;

                // Update quest progress
                if (!_quest.progressAnimFinished) {
                    var _t = math.clamp((_quest.ticker - _quest.delay) / xpAnimDuration, 0.0, 1.0);
                    _quest.current = math.lerp(math.easeOutExpo(_t), _quest.start, _quest.data.progress);

                    var _pctComplete = _quest.current / _quest.data.target * 100;

                    // Humanize time for timed quests
                    var _questDef = QuestDefs[_quest.data.type];
                    var _currentText = Math.round(_quest.current);
                    var _targetText2 = Math.round(_quest.data.target);
                    if (_questDef.timed) {
                        // @ts-ignore
                        _currentText = humanizeTime(_currentText, true);
                        // @ts-ignore
                        _targetText2 = humanizeTime(_targetText2);
                    }

                    if (_quest.current !== _quest.data.target && !_quest.data.complete) {
                        _quest.elems.counter.html('(' + _currentText + '/' + _targetText2 + ')');
                        _quest.elems.counter.removeClass('completed');
                        _quest.elems.barFill.removeClass('completed');
                        _quest.elems.essence.parent().removeClass('completed');
                        _quest.elems.xp.parent().removeClass('completed');
                    } else {
                        _quest.elems.counter.html(this.localization.translate('completed'));
                        _quest.elems.counter.addClass('completed');
                        _quest.elems.barFill.addClass('completed');
                        _quest.elems.essence.parent().addClass('completed');
                        _quest.elems.xp.parent().addClass('completed');
                        _quest.elems.completedImg.css({ display: 'block' });
                    }

                    _quest.elems.barFill.css({ '--progress': _pctComplete + '%' });

                    if (_t >= 1.0) {
                        _quest.progressAnimFinished = true;
                    }
                }

                // Play complete animation
                /*if (quest.playCompleteAnim &&
                    !quest.completeAnimFinished &&
                    quest.ticker - quest.delay > xpAnimDuration + 0.25) {
                    this.animateQuestComplete(quest);
                    quest.completeAnimFinished = true;
                    this.updateProgressBar();
                     /// update teams menu as well
                    let questDef = QuestDefs[quest.data.type];
                    let descKey = `${quest.data.type}`;
                    let desc = this.localization.translate(descKey) ||
                    quest.data.type;
                    $('#xp-team-mission-text').html(desc);
                    $('#xp-team-mission-text').attr('data-l10n',descKey);
                    $('#xp-team-mission-value').html(`+ ${quest.data.xpReward ? quest.data.xpReward : questDef.xp} XP`);
                    $('#xp-team-mission-text').css('opacity', 1);
                    $('#xp-team-mission-value').css('opacity', 1);
                }*/

                // Request a new quest if the old one is complete
                // and has finished animating
                var completeAnimFinished = !_quest.playCompleteAnim || _quest.completeAnimFinished && _quest.ticker - _quest.delay > xpAnimDuration + 0.25 + 3.0;
                /*if (quest.data.complete &&
                    completeAnimFinished &&
                    quest.refreshEnabled &&
                    quest.shouldRequestRefresh &&
                    !quest.data.args.ftue) {
                    quest.shouldRequestRefresh = false;
                    this.account.refreshQuest(quest.data.idx);
                }*/
                if (_quest.data.complete && completeAnimFinished && _quest.data.args.ftue && !_quest.data.args.refreshed) {
                    _quest.data.args.refreshed = true;
                    this.account.getPass(true);
                }
            }
        }
    }, {
        key: 'updatePass',
        value: function updatePass(dt) {
            this.pass.ticker += dt;
            if (this.updatePassScrollOnPass) {
                this.updatePassScrollOnPass = false;
                this.updateProgressBar(true);
            }

            if (this.pass.animSteps.length > 0 && this.pass.ticker >= 0.0 && this.pass.currentLevel <= this.pass.finalLevel) {
                var animStep = this.pass.animSteps[0];

                var kBarFillTime = 1.5;
                var kBarLevelUpTime = 1.5;
                var t = math.clamp(this.pass.ticker / kBarFillTime, 0.0, 1.0);

                this.pass.currentXp = math.lerp(math.easeOutExpo(t), animStep.startXp, animStep.targetXp);
                this.pass.levelXp = animStep.levelXp;
                var pct = this.pass.currentXp / animStep.levelXp * 100;

                /*if(this.pass.currentXp> this.pass.levelXp){
                    $('#pass-progress-xp-current').html(this.pass.levelXp);
                }else{
                    $('#pass-progress-xp-current').html(Math.round(this.pass.currentXp));
                }
                
                $('#pass-progress-xp-target').html(this.pass.levelXp);*/

                var fillBar = $('#season-progress-bar-fill');
                var firstLevelWidth = 71; //px bar for the first level
                var barLevelWidth = void 0;
                if (this.pass.currentLevel === 1) {
                    barLevelWidth = firstLevelWidth;
                } else {
                    barLevelWidth = ($('.season-pass-progress-outer').width() - firstLevelWidth) / this.pass.totalLevels;
                }
                var currentWidth = void 0;
                if (this.pass.currentLevel === 1) {
                    currentWidth = 0;
                } else {
                    var currentLevelCss = this.pass.currentLevel - 2;
                    currentWidth = firstLevelWidth + barLevelWidth * currentLevelCss;

                    //This will offset the inner progress of the xp received in the season pass so it match with the icons of the levels numbers
                    if (currentLevelCss > 0) {
                        var baseBorderWidth = 4; //px
                        fillBar.css({ '--border-width': baseBorderWidth * currentLevelCss + 'px' });
                    }
                }

                var leftPX = barLevelWidth * pct / 100;
                fillBar.css({ '--progress': currentWidth + leftPX + 'px' });

                if (t >= 1.0) {
                    if (animStep.targetLevel > this.pass.currentLevel) {
                        this.pass.currentLevel = animStep.targetLevel;
                        this.animatePassLevelUp();
                    }

                    this.pass.animSteps.shift();
                    this.pass.ticker -= kBarFillTime + kBarLevelUpTime;
                }
            }

            // Update lock
            /*if (!this.account.loggingIn &&
                !this.account.loggedIn &&
                !this.lockDisplayed) {
                $('#pass-block').css('z-index', '1');
                $('#pass-loading').css('display', 'none');
                $('#pass-locked').css('display', 'block');
                 this.lockDisplayed = true;
            } */

            if (this.account.loggedIn) {
                //Settings
                $('.quest-progress-notification-active').css('display', 'block');
                $('.spin-overview').css('display', 'block');
            }
            $('.currency-overview').css('display', 'flex');
        }
    }, {
        key: 'onResize',
        value: function onResize() {}
        // Adjust the pass content on mobile


        // @ts-ignore

    }, {
        key: 'getCurrentQuests',
        value: function getCurrentQuests(quests) {
            this.account.getPass(false);
            return this.quests;
        }
    }, {
        key: 'updateProgressBar',
        value: function updateProgressBar() {
            var scrollOverAllLevels = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var that = this;

            /*$('.season-pass-container-rows').animate({
                scrollLeft: "=0"
            }, 0);*/
            // @ts-ignore
            $(".season-pass-item").each(function (index) {
                var value = $(this).attr('data-value');
                // @ts-ignore
                if (!$(this).attr('data-premium') && value > 0 && value <= that.pass.currentLevel) $(this).children('img').css({ opacity: 1 });

                if (that.pass.premium && $(this).attr('data-premium')) {
                    $(this).children('.pass-lock-container').remove();

                    // @ts-ignore
                    if (value > 0 && value <= that.pass.currentLevel) $(this).children('img').css({ opacity: 1 });
                }
            });

            if (scrollOverAllLevels) {
                var currentPosition = 0;
                $(".season-pass-progress-checkpoint").each(function (index) {
                    // @ts-ignore
                    if ($(this).text() <= that.pass.currentLevel && !$(this).hasClass('passed')) {
                        $(this).addClass('passed');

                        if (index > 1 && index < 5) {
                            currentPosition += 95;
                        } else if (index >= 4 && index < 29) {
                            currentPosition += 130;
                        }
                    }
                });
                $('.season-pass-container-rows').animate({
                    scrollLeft: '+=' + currentPosition + 'px'
                }, 500);
            } else {
                $(".season-pass-progress-checkpoint").each(function (index) {
                    // @ts-ignore
                    if ($(this).text() == that.pass.currentLevel) {
                        $(this).addClass('passed');
                        if (index > 1 && index < 5) {
                            $('.season-pass-container-rows').animate({
                                scrollLeft: "+=95px"
                            }, 500);
                        } else if (index >= 4 && index < 29) {
                            $('.season-pass-container-rows').animate({
                                scrollLeft: "+=130px"
                            }, 500);
                        }
                    }
                });
            }
        }
    }, {
        key: 'loadPlaceholders',
        value: function loadPlaceholders() {
            // Hardcoded pass name
            var passType = 'pass_BHA0';

            var passName = this.localization.translate(passType).toUpperCase();
            $('#season-name').attr('data-l10n', passType);
            $('#season-name').html(passName);
        }
    }, {
        key: 'loadAllPassItems',
        value: function loadAllPassItems() {
            var pool = GameObjectDefs[this.pass.data.type].items;

            //TODO replace this with templates for each season item
            for (var i = 0; i < pool.length; i++) {
                var itemType = pool[i].item;
                var img = $('<div>');
                var rarity = 0;
                var svg = '';
                var imageUrl = '';
                var imageUrlRarity = '';

                if (itemType == 'empty_slot') {
                    rarity = 0;
                    imageUrlRarity = 'url(../img/pass/item-background-neutral.png)';
                } else {
                    rarity = helpers.getRarityFromGameType(itemType);
                    svg = helpers.getSvgFromGameType(itemType);
                    imageUrl = 'url(' + svg + ')';
                }

                img.addClass('season-pass-item');
                if (rarity != undefined) {
                    //img.css({border: `4.5px solid ${(Rarities[rarity].color)}`});
                    imageUrlRarity = 'url(' + Rarities[rarity].seasonBackground + ')';
                    //img.css({'background-color': `${(Rarities[rarity].backgroundColor)}`});
                }

                if (GameObjectDefs[itemType] && GameObjectDefs[itemType].type == 'melee') {
                    img.css({ 'background-size': '92%' });
                }

                //Item rarity icon
                var itemRarity = $('<div>');
                itemRarity.addClass('item-rarity-style');
                //let itemRarityImage = $('<div>');
                var itemIconType = '';
                if (itemType !== 'empty_slot') {
                    itemIconType = GameObjectDefs[itemType] ? GameObjectDefs[itemType].type : itemType;
                }

                //itemRarityImage.addClass('dark item-'+ itemIconType );
                //itemRarity.append(itemRarityImage);

                img.attr('data-value', pool[i].level);
                if (itemIconType == 'gold') {
                    // @ts-ignore
                    rarity = 'common';
                    //itemRarity.css({'background': ' linear-gradient(132.5deg, rgba(241, 242, 158, 0.81) 5.59%, rgba(228, 232, 75, 0.845393) 14.44%, rgba(244, 244, 209, 0.836292) 18.37%, rgba(198, 171, 78, 0.862221) 30.98%, rgba(217, 218, 157, 0.888115) 43.57%, rgba(206, 210, 0, 0.9) 49.35%, rgba(239, 239, 165, 0.9) 67.63%, rgba(196, 189, 59, 0.9) 70.5%, rgba(167, 165, 77, 0.856018) 81.7%, rgba(244, 244, 209, 0.836292) 86.72%, rgba(203, 184, 20, 0.9) 98.68%), radial-gradient(64.2% 64.2% at 28.13% 35.8%, #ECF013 0%, #AEB110 100%)'});
                    img.addClass('golden');

                    img.append("<div class= 'item-gold'> <div class= 'gold-container'><div class= 'gold-amount'><div>" + pool[i].amount + "</div></div> </div></div> ");

                    imageUrlRarity = 'url(' + Rarities[rarity].seasonBackground + ')';
                    img.css({ 'background-image': imageUrlRarity });
                } else if (itemType !== 'empty_slot') {
                    itemRarity.addClass('item-rarity-style-border');
                    itemRarity.css({ 'background-color': '' + Rarities[rarity].color });
                    img.css({ 'background-image': imageUrl + ',' + imageUrlRarity });
                    //img.append(itemRarity);             
                } else {
                    img.addClass('pass-empty-slot');
                    img.attr('data-value', -1);
                }

                //Icon completed
                var url = rarity ? Rarities[rarity].seasonCheck : '../img/pass/check-neutral.png';
                var completed = $('<img>');
                completed.attr('src', url);

                completed.appendTo(img);
                img.appendTo('.season-pass-free-row');
            }

            //Premium Items
            for (var _i = 0; _i < pool.length; _i++) {
                var _itemType = pool[_i].itemPremium || pool[_i].item;
                var _img = $('<div>');
                var _rarity = 0;
                var _svg = '';
                var _imageUrl = '';
                var _imageUrlRarity = '';

                if (_itemType == 'empty_slot') {
                    _rarity = 0;
                } else {
                    _rarity = helpers.getRarityFromGameType(_itemType);
                    _svg = helpers.getSvgFromGameType(_itemType);
                    _imageUrl = 'url(' + _svg + ')';

                    var lockContainer = $('<div>');
                    var lock = $('<div>');
                    lockContainer.addClass('pass-lock-container');
                    lockContainer.append(lock);
                    lock.addClass('pass-lock');
                    //lock.css({'background-color': `${(Rarities[rarity].color)}`});
                    _img.append(lockContainer);

                    //img.css({border: `4.5px solid ${(Rarities[rarity].color)}`});
                    //img.css({'background-color': `${(Rarities[rarity].backgroundColor)}`});
                    _imageUrlRarity = 'url(' + Rarities[_rarity].seasonBackground + ')';
                }

                _img.addClass('season-pass-item');

                if (GameObjectDefs[_itemType] && GameObjectDefs[_itemType].type == 'melee') {
                    _img.css({ 'background-size': '92%' });
                }

                //Icon completed
                var _url = _rarity ? Rarities[_rarity].seasonCheck : '../img/pass/check-neutral.png';
                var _completed = $('<img>');
                _completed.attr('src', _url);

                //Item rarity icon

                var _itemRarity = $('<div>');
                _itemRarity.addClass('item-rarity-style');
                var itemRarityImage = $('<div>');
                var _itemIconType = '';
                if (_itemType !== 'empty_slot') {
                    _itemIconType = GameObjectDefs[_itemType] ? GameObjectDefs[_itemType].type : _itemType;
                }

                itemRarityImage.addClass('dark item-' + _itemIconType);
                _itemRarity.append(itemRarityImage);

                _img.attr('data-value', pool[_i].level);
                // @ts-ignore
                _img.attr('data-premium', true);
                if (_itemIconType == 'gold') {
                    //itemRarity.css({'background': ' linear-gradient(132.5deg, rgba(241, 242, 158, 0.81) 5.59%, rgba(228, 232, 75, 0.845393) 14.44%, rgba(244, 244, 209, 0.836292) 18.37%, rgba(198, 171, 78, 0.862221) 30.98%, rgba(217, 218, 157, 0.888115) 43.57%, rgba(206, 210, 0, 0.9) 49.35%, rgba(239, 239, 165, 0.9) 67.63%, rgba(196, 189, 59, 0.9) 70.5%, rgba(167, 165, 77, 0.856018) 81.7%, rgba(244, 244, 209, 0.836292) 86.72%, rgba(203, 184, 20, 0.9) 98.68%), radial-gradient(64.2% 64.2% at 28.13% 35.8%, #ECF013 0%, #AEB110 100%)'});
                    _img.addClass('golden');

                    _img.append("<div class= 'item-gold'> <div class= 'gold-container'></div> </div>");
                } else if (_itemType !== 'empty_slot') {
                    _itemRarity.addClass('item-rarity-style-border');
                    _itemRarity.css({ 'background-color': '' + Rarities[_rarity].color });
                    _img.css({ 'background-image': _imageUrl + ',' + _imageUrlRarity });
                    //img.append(itemRarity);
                } else {
                    _img.addClass('pass-empty-slot');
                    _img.attr('data-value', -1);
                    _img.css({ 'background-size': '60%' });
                }

                _completed.appendTo(_img);
                _img.appendTo('.season-pass-premiun-row');
            }

            //$('.season-progress').width($('.season-pass-free-row').get(0).scrollWidth);

            for (var _i2 = 0; _i2 < pool.length; _i2++) {
                var number = $('<div>');
                number.addClass('season-pass-progress-checkpoint');
                // @ts-ignore
                number.html(_i2 + 2);
                number.appendTo('.season-progress-levels');
            }
        }
    }, {
        key: 'startSpinReward',
        value: function startSpinReward() {
            $('#modal-pass-reward').css('display', 'flex');
            setTimeout(function () {
                $('#modal-pass-reward').css('animation-name', 'pass-fade-out');
            }, 5000);
            setTimeout(function () {
                $('#modal-pass-reward').css('display', 'none');
            }, 5200);
        }
    }, {
        key: 'showDiscount',
        value: function showDiscount(level) {
            var _this5 = this;

            $('#modal-bonus-level').css('display', 'block');
            $('#modal-bonus-level .bonus-level').html(level);
            $('#modal-bonus-level strong').html('Level ' + level);
            $('#pass-buy-btn-discount').on('click', function () {
                $('#modal-bonus-level').css('display', 'none');
                _this5.showPremiumModal();
            });
        }
    }, {
        key: 'showModalDiscountExtra',
        value: function showModalDiscountExtra() {
            /*$('#modal-pass-premium .modal-discount-text').css('display', 'flex');
            $('#modal-pass-premium .modal-pass-box-timer').css('display', 'flex');
            let discount = PassDefs[this.pass.type].discountLevels[this.pass.discountLevel].discount;
            $('#modal-discount-number').html(discount);
             this.startPassTimer(this.pass.discountTime, ' #modal-pass-premium .modal-pass-box-timer #modal-pass-box-timer-numbers');*/
        }
    }, {
        key: 'checkStimfieldEvents',
        value: function checkStimfieldEvents(events) {
            var _this6 = this;

            if (events && events.length > 0) {
                var _loop2 = function _loop2(event) {
                    var activeEvent = event;
                    var eventDef = GameObjectDefs[activeEvent.event_type];
                    var createdTime = new Date(activeEvent.created_time);
                    var timerTime = createdTime.getTime() + eventDef.delay + eventDef.time;
                    var activeTime = timerTime - Date.now();
                    var that = _this6;

                    if (activeTime > 0 || activeEvent.is_active) {
                        var xpBoost = eventDef.xpBonus * 100;
                        //Show stimfield home UI
                        $('#pass-block').addClass('stimfield-bonus');
                        $('.pass-stimfield-container').css({ 'display': 'flex', 'transition': '0.5s linear all' });
                        // @ts-ignore
                        $('.pass-stimfield-text span').html(xpBoost);
                        if (!device.mobile) $('#free-gp-offer').css({ 'height': '135px', 'padding-top': '1px', 'margin-top': '50px', 'transition': '0.5s linear all' });

                        var cacheId = '' + createdTime.getTime() + event.event_type;
                        var cachedStimfield = localStorage.getItem('stimfield');
                        minutes = Math.floor(activeTime % (1000 * 60 * 60) / (1000 * 60));

                        if (minutes > 1 && cachedStimfield !== cacheId) {
                            localStorage.setItem('stimfield', cacheId);

                            //Prepare modal stimfield active
                            var modalStimfieldActive = new MenuModal($('#modal-stimfield-notification'));
                            var text = _this6.localization.translate('modal-stimfied-active-text-1') + ' +' + xpBoost + '% ' + _this6.localization.translate('modal-stimfied-active-text-2') + ' ';
                            if (minutes === 1) text += _this6.localization.translate('game-minute') + '.';else if (minutes < 1) text = 'Less than a minute remaining for the stimfield XP boost';else text += minutes + ' ' + _this6.localization.translate('game-minutes') + '.';

                            $('#modal-stimfield-active-text').text(text);

                            //Show modal stimfield active
                            modalStimfieldActive.show();
                        }

                        if (_this6.stimfieldTimer) clearInterval(_this6.stimfieldTimer);

                        if (activeTime > 0) {
                            //Start home stimfield UI timer
                            _this6.startEventTimer(timerTime, '.pass-stimfield-timer', function () {
                                $('.pass-stimfield-container').css({ 'display': 'none', 'transition': '0.5s linear all' });
                                $('#pass-block').removeClass('stimfield-bonus');
                                $('#free-gp-offer').removeAttr('style');
                                that.account.getPass();
                            });
                        } else {
                            setTimeout(function () {
                                $('.pass-stimfield-container').css({ 'display': 'none', 'transition': '0.5s linear all' });
                                $('#pass-block').removeClass('stimfield-bonus');
                                $('#free-gp-offer').removeAttr('style');
                                that.account.getPass();
                            }, 3000);
                        }

                        return 'break';
                    }
                };

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = (0, _getIterator3.default)(events), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var event = _step.value;
                        var minutes;

                        var _ret2 = _loop2(event);

                        if (_ret2 === 'break') break;
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
        key: 'getQuestLocations',
        value: function getQuestLocations(map, playerPos, numberBeacons, questsCompleted, playerBarn, teamId, playerID) {
            var locations = [];
            var getObstaclesMapLocation = function getObstaclesMapLocation(type, index) {
                if (questsCompleted[index]) locations.push([]);else locations.push(map.locationsQuestObstacles(type, playerPos, numberBeacons));
            };
            var getBuildingMapLocation = function getBuildingMapLocation(building, index) {
                if (questsCompleted[index]) locations.push([]);else locations.push(map.locationsQuestBuilding(building, playerPos, numberBeacons));
            };
            var getPlayerMapLocation = function getPlayerMapLocation(index) {
                if (questsCompleted[index]) locations.push([]);else {
                    var numberPlayers = playerBarn ? playerBarn.playerIds.length : 0;
                    var tempLocations = [];
                    for (var i = 0; i < numberPlayers; i++) {
                        var idPlayerAct = playerBarn.playerIds[i];
                        if (playerID != idPlayerAct) {
                            var playerStatus = playerBarn.m_getPlayerById(idPlayerAct);
                            if (playerStatus && teamId != playerBarn.m_playerInfo[idPlayerAct].teamId && !playerStatus.dead) {
                                //Verify if player is on the same team and alive
                                if (tempLocations.length < numberBeacons) tempLocations.push(playerStatus.pos);else {
                                    tempLocations = caculateNearestPlayer(tempLocations, playerPos, playerStatus.pos);
                                }
                            }
                        }
                    }
                    locations.push(tempLocations);
                }
            };

            var caculateNearestPlayer = function caculateNearestPlayer(tempLocations, playerPos, playerActPos) {
                var index = -1;
                var lastTotal = void 0;
                var xNew = Math.pow(playerActPos.x - playerPos.x, 2);
                var yNew = Math.pow(playerActPos.y - playerPos.y, 2);
                var totalNew = Math.sqrt(xNew + yNew);
                for (var k = 0; k < tempLocations.length; k++) {
                    var posActual = tempLocations[k];
                    var xActual = Math.pow(posActual.x - playerPos.x, 2);
                    var yActual = Math.pow(posActual.y - playerPos.y, 2);

                    var totalActual = Math.sqrt(xActual + yActual);
                    if (totalNew < totalActual) {
                        if (index >= 0) {
                            if (totalActual > lastTotal) {
                                index = k;
                                lastTotal = totalActual;
                            }
                        } else {
                            index = k;
                            lastTotal = totalActual;
                        }
                    }
                }
                if (index >= 0) {
                    tempLocations[index] = playerActPos;
                }
                return locations;
            };

            for (var i = 0; i < this.quests.length; i++) {
                var type = this.quests[i].data.type;
                switch (type) {
                    case 'quest_damage_melee':
                    case 'quest_kills': /* Fall-through */
                    case 'quest_kills_hard':
                        {
                            getPlayerMapLocation(i);
                            break;
                        }
                    case 'quest_damage_9mm':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_damage_762mm':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_damage_556mm':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_damage_12gauge':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_damage_grenade':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_heal':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_boost':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_crates':
                        {
                            getObstaclesMapLocation('crate', i);
                            break;
                        }
                    case 'quest_toilets':
                        {
                            getObstaclesMapLocation('toilet', i);
                            break;
                        }
                    case 'quest_furniture':
                        {
                            getObstaclesMapLocation('furniture', i);
                            break;
                        }
                    case 'quest_barrels':
                        {
                            getObstaclesMapLocation('barrel', i);
                            break;
                        }
                    case 'quest_lockers':
                        {
                            getObstaclesMapLocation('locker', i);
                            break;
                        }
                    case 'quest_pots':
                        {
                            getObstaclesMapLocation('pot', i);
                            break;
                        }
                    case 'quest_vending':
                        {
                            getObstaclesMapLocation('vending', i);
                            break;
                        }
                    case 'quest_club_kills':
                        {
                            getBuildingMapLocation('club_01', i);
                            break;
                        }
                    default:
                        {
                            locations.push([]);
                            break;
                        }
                }
            }
            return locations;
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var listenersCopy = (this.events[event] || []).slice(0);

            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            for (var i = 0; i < listenersCopy.length; i++) {
                listenersCopy[i].apply(listenersCopy, data);
            }
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(event, callback) {
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
        }
    }]);
    return Pass;
}();

module.exports = Pass;

