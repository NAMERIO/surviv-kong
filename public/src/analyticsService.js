"use strict";


var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _toConsumableArray2 = require("./998a712f.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uuidv4 = require("./8581e282.js");
var UaParser = require("./9e80df5c.js");
var device = require("./device.js");
var GameConfig = require("./989ad62a.js");
var $ = require("./8ee62bea.js");
var GameObjectDefs = require("./gameObjectDefs.js");

var devEndPoint = "https://web.archive.org/web/20211102160635/https://analytics.kongregate.io/tonic/bit-heroes-arena/dev";
var prodEndPoint = "https://web.archive.org/web/20211102160635/https://analytics.kongregate.io/tonic/bit-heroes-arena/live";

var androidBundleId = 'io.bit-heroes-arena.bit-heroes-arena_io_mobile';
var iosBundleId = 'io.bit-heroes-arena.bit-heroes-arena-io-mobile';
var webBundleId = 'io.bit-heroes-arena.web';

var AnalyticsService = function () {
    function AnalyticsService(localization) {
        (0, _classCallCheck3.default)(this, AnalyticsService);

        //fields that not apply right now
        this.tutorialCompleted = false;

        //current fields that apply
        this.uaParser = new UaParser();
        this.localization = localization;
        this.sessionStartDate;
        this.playEventStarts = false;
        this.loadingStarts = false;
        this.gameId = "";
        this.mapName = "";
        this.pings = [];
        this.isPlaying = false;
        this.startUpSeconds = 10;
        this.startUpInterval;
        this.playerLevel = 0;
        this.hardCurrencySpent = 0;
        this.hardCurrencyEarned = 0;
        this.hardCurrencyBalance = 0;
        this.hardCurrencyBought = 0;
        this.softCurrencySpent = 0;
        this.softCurrencyEarned = 0;
        this.softCurrencyBalance = 0;
        this.softCurrencyBought = 0;
        this.totalSpentInUsd = 0;
        this.numPurchases = 0;

        this.itemPrices = [50, 50, 120, 300, 750, 3000];
        this.playerId = "";
        this.battleTag = "";
        this.current_prestige_points = "";
        this.daily_reports_left = "";
        this.daily_endorses_left = "";
        this.loginSource = "guest";
        this.sessionId = this.getOrGenerateSessionId();
        this.firstPlayTime = new Date();
        this.gameModeId = 0;
        this.browser = this.uaParser.getBrowser().name;
        this.battlePassLevel = 0;
        this.numPvpWon = 0;
        this.numPvpPlayed = 0;
        this.countryCode = "";
        this.clientVersion = GameConfig.clientVersion;
        this.deviceType = this.uaParser.getDevice().type ? this.uaParser.getDevice().type : "";
        this.clientOsType = this.uaParser.getOS().name;
        this.clientOsVersion = this.uaParser.getOS().version;
        this.platform = this.getPlatform();
        this.bundleId = device.mobile ? this.clientOsType === 'Android' ? androidBundleId : iosBundleId : webBundleId;
        this.getUserCountryCode();
    }

    (0, _createClass3.default)(AnalyticsService, [{
        key: 'getOrGenerateSessionId',
        value: function getOrGenerateSessionId() {
            var sessionKey = 'surviv-' + this.playerId;
            var sessionId = window.sessionStorage.getItem(sessionKey);
            if (sessionId) {
                return sessionId;
            } else {
                sessionId = uuidv4();
                window.sessionStorage.setItem(sessionKey, sessionId);
                return sessionId;
            }
        }
    }, {
        key: 'getPlatform',
        value: function getPlatform() {
            if (/surviviosteam/i.test(navigator.userAgent)) {
                // if we're running in electron, it means we're on Steam
                return "steam";
            } else if (device.webview) {
                return "mobile app";
            } else if (device.mobile) {
                return "mobile web";
            } else {
                return "desktop web";
            }
        }
    }, {
        key: 'getUserCountryCode',
        value: function getUserCountryCode() {
            var _this = this;

            var countryCodeKey = 'surviv-country';
            var countryCodeValue = window.localStorage.getItem(countryCodeKey);
            if (countryCodeValue) {
                this.countryCode = countryCodeValue;
            } else {
                $.get("https://web.archive.org/web/20211102160635/https://geolocation-db.com/json/0f761a30-fe14-11e9-b59f-e53803842572", function (response) {
                    _this.countryCode = response.country_code;
                    if (_this.countryCode) {
                        window.localStorage.setItem(countryCodeKey, _this.countryCode);
                    }
                }, "json");
            }
        }
    }, {
        key: 'setPlayerData',
        value: function setPlayerData(profile) {
            this.playerId = profile.id;
            this.firstPlayTime = new Date(profile.userCreated);
            this.numPvpWon = profile.wins ? profile.wins : 0;
            this.numPvpPlayed = profile.games ? profile.games : 0;
            this.current_prestige_points = profile.prestige ? profile.prestige : 0;
            this.daily_reports_left = profile.reportPoints ? profile.reportPoints : 0;
            this.daily_endorses_left = profile.endorsePoints ? profile.endorsePoints : 0;
            if (profile.gpTotal) {
                this.hardCurrencyBalance = profile.gpTotal;
            }
            if (profile.totalEssence) {
                this.softCurrencyBalance = profile.totalEssence;
            }
            if (profile.slug) {
                this.battleTag = profile.slug;
            } else {
                this.battleTag = 'BHA#' + profile.id;
            }
            if (profile.linkedFacebook) {
                this.loginSource = 'facebook';
            } else if (profile.linkedGoogle) {
                this.loginSource = 'google';
            } else if (profile.linkedTwitch) {
                this.loginSource = 'twitch';
            } else if (profile.linkedDiscord) {
                this.loginSource = 'discord';
            } else if (profile.linkedApple) {
                this.loginSource = 'apple';
            }
        }
    }, {
        key: 'sessionStarts',
        value: function sessionStarts() {
            this.sessionStartDate = new Date();
            var isFromBackground = false;
            var payload = this.getEventPayload();
            payload.is_from_background = isFromBackground;
            this.sendEvent('session_starts', payload);
        }
    }, {
        key: 'sessionEnds',
        value: function sessionEnds() {
            var sessionLengthSeconds = (new Date() - this.sessionStartDate) / 1000;
            var payload = this.getEventPayload();
            payload.session_length_seconds = sessionLengthSeconds;
            payload.session_end_time = new Date().toISOString();
            this.sendEvent('session_ends', payload);
        }
    }, {
        key: 'getOrGenerateIapId',
        value: function getOrGenerateIapId(attempt, packId) {
            var iapIdKey = this.playerId + '-' + packId;
            if (attempt) {
                var iapIdValue = uuidv4();
                window.sessionStorage.setItem(iapIdKey, iapIdValue);
                return iapIdValue;
            } else {
                var _iapIdValue = window.sessionStorage.getItem(iapIdKey);
                if (_iapIdValue) {
                    return _iapIdValue;
                } else {
                    return this.getOrGenerateIapId(true, packId);
                }
            }
        }
    }, {
        key: 'iapAttempts',
        value: function iapAttempts(cost, packId, description) {
            var iapId = this.getOrGenerateIapId(true, packId);
            var type = description;
            var contextOfOffer = "Storefront";
            var usdCost = (cost / 100.0).toFixed(2);
            var productId = packId;
            var payload = this.getEventPayload();
            payload.iap_id = iapId;
            payload.type = type;
            payload.usd_cost = usdCost;
            payload.product_id = productId;
            payload.context_of_offer = contextOfOffer;
            this.sendEvent('iap_attempts', payload);
        }
    }, {
        key: 'iapTransactions',
        value: function iapTransactions(gp, cost, packId, receipt, description) {
            var iapId = this.getOrGenerateIapId(false, packId);
            var hardCurrencyChange = gp;
            var type = description; //Gold and Cards Pack
            var usdCost = (cost / 100.0).toFixed(2);
            var productId = packId;
            var contextOfOffer = "Storefront";
            var receiptId = receipt;
            this.numPurchases = this.numPurchases++;
            var payload = this.getEventPayload();
            payload.iap_id = iapId;
            payload.hard_currency_change = hardCurrencyChange;
            payload.type = type;
            payload.usd_cost = usdCost;
            payload.product_id = productId;
            payload.context_of_offer = contextOfOffer;
            payload.receipt_id = receiptId;
            this.sendEvent('iap_transactions', payload);
        }
    }, {
        key: 'iapFails',
        value: function iapFails(receipt, packId, error) {
            var iapId = this.getOrGenerateIapId(false, packId);
            var receiptId = receipt;
            var productId = packId;
            var payload = this.getEventPayload();
            payload.iap_id = iapId;
            payload.product_id = productId;
            payload.fail_reason = error;
            payload.receipt_id = receiptId;
            this.sendEvent('iap_fails', payload);
        }
    }, {
        key: 'adStart',
        value: function adStart(adTag, optional, contextOfOffer, adType, adNetwork) {
            if (contextOfOffer == 'tapdaq') {
                contextOfOffer = this.isOutOfGame ? 'Home' : 'Battle Results';
            }
            var payload = this.getEventPayload();
            payload.ad_type = adType;
            payload.is_optional = optional;
            payload.context_of_offer = contextOfOffer;
            payload.ad_tag = adTag;
            payload.ad_network = adNetwork;
            this.sendEvent('ad_start', payload);
        }
    }, {
        key: 'adEnd',
        value: function adEnd(type) {
            var reward = "";
            var adType = type;
            var contextOfOffer = "";
            var payload = this.getEventPayload();
            payload.reward = reward;
            payload.ad_type = adType;
            payload.context_of_offer = contextOfOffer;
            payload.ad_tag = '';
            payload.ad_network = '';
            this.sendEvent('ad_end', payload);
        }
    }, {
        key: 'tutorialStepEnds',
        value: function tutorialStepEnds(pDescription) {
            var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
            var finalStep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var tutorialType = "FTUE";
            var description = pDescription;
            var stepNumber = step;
            var isFinal = finalStep;
            var payload = this.getEventPayload();
            payload.tutorial_type = tutorialType;
            payload.description = description;
            payload.step_number = stepNumber;
            payload.is_final = isFinal;
            this.sendEvent('tutorial_step_ends', payload);
        }
    }, {
        key: 'economyTransactions',
        value: function economyTransactions(type, hardCurrencyChange, softCurrencyChange, resourcesSummary, contextOfOffer) {
            var offerId = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
            var prestigeTargetId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
            var updateHardCurrencyBalance = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
            var updateSoftCurrencyBalance = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;

            //Hard currency
            if (hardCurrencyChange < 0) {
                this.hardCurrencySpent = this.hardCurrencySpent - hardCurrencyChange;
                if (updateHardCurrencyBalance) this.hardCurrencyBalance = this.hardCurrencyBalance + hardCurrencyChange;
            } else {
                this.hardCurrencyEarned = this.hardCurrencyEarned + hardCurrencyChange;
                if (updateHardCurrencyBalance) this.hardCurrencyBalance = this.hardCurrencyBalance + hardCurrencyChange;
            }

            //Soft currency
            if (softCurrencyChange < 0) {
                this.softCurrencySpent = this.softCurrencySpent - softCurrencyChange;
                if (updateSoftCurrencyBalance) this.softCurrencyBalance = this.softCurrencyBalance + softCurrencyChange;
            } else {
                this.softCurrencyEarned = this.softCurrencyEarned + softCurrencyChange;
                if (updateSoftCurrencyBalance) this.softCurrencyBalance = this.softCurrencyBalance + softCurrencyChange;
            }

            var payload = this.getEventPayload();
            if (prestigeTargetId) {
                payload.prestige_target_user = prestigeTargetId;
            }
            payload.type = type;
            payload.resources_summary = resourcesSummary;
            payload.hard_currency_change = hardCurrencyChange;
            payload.soft_currency_change = softCurrencyChange;
            payload.context_of_offer = contextOfOffer;
            if (offerId) {
                payload.offer_id = offerId;
            } else {
                payload.offer_id = uuidv4();
            }
            this.sendEvent('economy_transactions', payload);
        }
    }, {
        key: 'economyTransactionsBundle',
        value: function economyTransactionsBundle(bundlePack) {
            var transactionId = uuidv4();
            var bundleType = 'Small Offer ';
            if (bundlePack.type == 'big_offer') {
                bundleType = 'Big Offer ';
            }
            bundleType = bundleType + bundlePack.items.length + ' Discounted ' + bundlePack.discount + '%';
            this.economyTransactions('Shop Offer Bought', 0, 0, '', bundleType, transactionId);
            for (var i = 0, l = bundlePack.items.length; i < l; i++) {
                var itemDef = GameObjectDefs[bundlePack.items[i]];
                var itemPrice = this.itemPrices[itemDef.rarity];
                itemPrice = itemPrice - itemPrice * (bundlePack.discount / 100);
                itemPrice = itemPrice * -1;
                this.economyTransactions('Item Got', parseFloat(itemPrice.toFixed(2)), 0, bundlePack.items[i], bundleType, transactionId);
            }
        }
    }, {
        key: 'loadingEnds',
        value: function loadingEnds() {
            if (this.loadingStarts === false) {
                return;
            }
            var timeMs = new Date() - this.loadingStarts;
            this.loadingStarts = false;
            var loadingType = "match start";
            var payload = this.getEventPayload();
            payload.load_time_ms = timeMs;
            payload.loading_type = loadingType;
            this.sendEvent('loading_ends', payload);
        }
    }, {
        key: 'playStarts',
        value: function playStarts(mapName) {
            var mode = void 0;
            switch (this.gameModeId) {
                case 1:
                    mode = 'duo';
                    break;
                case 2:
                    mode = 'squad';
                    break;
                default:
                    mode = 'solo';
            }
            this.mapName = mapName;
            this.playEventStarts = new Date();
            var payload = this.getEventPayload();
            payload.play_id = this.gameId;
            payload.queue = mode;
            payload.map_name = this.mapName;
            payload.mode_name = this.mapName;
            this.sendEvent('play_starts', payload);
            this.isPlaying = true;
            this.startUpInterval = setInterval(this.startUpEvent.bind(this), 9999);
        }
    }, {
        key: 'getHashItemId',
        value: function getHashItemId(itemName) {
            var hash = 0,
                len = itemName.length;
            for (var i = 0; i < len; i++) {
                hash = (hash << 5) - hash + itemName.charCodeAt(i);
                hash |= 0;
            }
            return hash;
        }
    }, {
        key: 'playEnds',
        value: function playEnds(matchInfo, endType, playerLoadout) {
            if (this.playEventStarts === false) {
                return;
            }
            var mode = void 0;
            switch (this.gameModeId) {
                case 1:
                    mode = 'duo';
                    break;
                case 2:
                    mode = 'squad';
                    break;
                default:
                    mode = 'solo';
            }
            var loadout = [];
            var leaderboardChange = 0;
            var killsGot = 0;
            var matchLength = 0;
            if (matchInfo === false) {
                matchLength = new Date() - this.playEventStarts;
            } else {
                for (var i = 0; i < matchInfo.playerStats.length; i++) {
                    if (matchInfo.playerStats[i].isMyStats == 1) {
                        killsGot = matchInfo.playerStats[i].kills;
                        leaderboardChange = matchInfo.teamRank;
                        matchLength = matchInfo.playerStats[i].timeAlive * 1000;
                    }
                }
            }
            if (playerLoadout) {
                loadout.push(this.getHashItemId(playerLoadout.heal));
                loadout.push(this.getHashItemId(playerLoadout.boost));
                loadout.push(this.getHashItemId(playerLoadout.melee));
            }
            if (endType === "gameover win") {
                this.numPvpWon++;
            }
            this.numPvpPlayed++;
            this.playEventStarts = false;
            var payload = this.getEventPayload();
            payload.play_id = this.gameId;
            payload.queue = mode;
            payload.map_name = this.mapName;
            payload.mode_name = this.mapName;
            payload.kills_got = killsGot;
            payload.player_loadout = playerLoadout;
            payload.leaderboard_change = leaderboardChange;
            payload.length_ms = matchLength;
            payload.end_type = endType;
            this.sendEvent('play_ends', payload);
            if (this.startUpInterval) {
                this.isPlaying = false;
                this.startUpSeconds = 10;
                clearInterval(this.startUpInterval);
            }
        }
    }, {
        key: 'navActionsEvent',
        value: function navActionsEvent(origin, result, navElement, subNavElement) {
            var payload = this.getEventPayload();
            payload.origin = origin;
            payload.nav_element_name = navElement;
            payload.sub_nav_element_name = subNavElement;
            payload.result = result;
            this.sendEvent('nav_actions', payload);
        }
    }, {
        key: 'startUpEvent',
        value: function startUpEvent() {
            if (this.isPlaying) {
                var pings = [].concat((0, _toConsumableArray3.default)(this.pings));
                var maxLatency = Math.max.apply(Math, (0, _toConsumableArray3.default)(pings));
                var avgLatency = pings.reduce(function (a, b) {
                    return a + b;
                }, 0) / pings.length;
                var jitterArray = [];
                for (var i = 0; i < pings.length - 1; i++) {
                    jitterArray.push(Math.abs(Math.floor(pings[i] - pings[i + 1])));
                }
                jitterArray.sort(function (a, b) {
                    return a - b;
                });
                var midJitter = jitterArray[Math.floor(jitterArray.length * 0.5)];
                var n5Jitter = jitterArray[Math.floor(jitterArray.length * 0.95)];
                var n9Jitter = jitterArray[Math.floor(jitterArray.length * 0.99)];
                var payload = this.getEventPayload();
                payload.startups = 'start_up_' + this.startUpSeconds + 's';
                payload.max_latency = maxLatency;
                payload.avg_latency = avgLatency;
                payload.play_id = this.gameId;
                payload.median_jitter = midJitter;
                payload.ninetyfifth_jitter = n5Jitter;
                payload.ninetyninth_jitter = n9Jitter;
                this.sendEvent('performance', payload);
                this.startUpSeconds = this.startUpSeconds + 10;
                //Hide spectate ad (desktop)
                document.getElementById('ui-spectate-ad-container-desktop').hidden = true;
                document.getElementById('ui-spectate-video-ad-container-desktop').hidden = true;
                if (this.hideBannerAd) {
                    this.hideBannerAd();
                }
                if (this.startUpSeconds > 30) {
                    this.isPlaying = false;
                    clearInterval(this.startUpInterval);
                    this.startUpInterval = false;
                    this.startUpSeconds = 10;
                }
            }
        }
    }, {
        key: 'challengeProgress',
        value: function challengeProgress(type, challengeInfo) {
            var challengeId = this.getHashItemId(challengeInfo.type);
            var challengeAssigned = new Date(challengeInfo.timeAcquired).toISOString();
            var challengeDescription = this.localization.translateEn(challengeInfo.type);
            var xpReward = GameObjectDefs[challengeInfo.type].xp;
            var payload = this.getEventPayload();
            payload.challenge_id = challengeId;
            payload.challenge_stage = type;
            payload.challenge_assigned = challengeAssigned;
            payload.challenge_type = challengeInfo.type;
            payload.challenge_description = challengeDescription;
            payload.challenge_progress = challengeInfo.progress;
            payload.challenge_req = challengeInfo.target;
            payload.xp_reward = challengeInfo.args.xp;
            payload.essence_rewards = challengeInfo.args.essence;
            this.sendEvent('challenges', payload);
        }
    }, {
        key: 'gearStatEvent',
        value: function gearStatEvent(item, context, makr, levels, kills, wins) {
            var payload = this.getEventPayload();
            payload.item = item;
            payload.context = context;
            payload.makr_id = makr;
            payload.levels = levels;
            payload.kills = kills;
            payload.wins = wins;
            this.sendEvent('gear_stat_events', payload);
        }
    }, {
        key: 'getEventPayload',
        value: function getEventPayload() {
            var payload = {
                device_event_id: uuidv4(),
                browser: this.browser,
                player_id: this.playerId,
                event_time: new Date().toISOString(),
                device_type: this.deviceType,
                client_os_type: this.clientOsType,
                client_os_version: this.clientOsVersion,
                country_code: this.countryCode,
                session_id: this.sessionId,
                platform: this.platform,
                battle_pass_level: this.battlePassLevel,
                num_pvp_played: this.numPvpPlayed,
                num_pvp_won: this.numPvpWon,
                bundle_id: this.bundleId,
                login_source: this.loginSource,
                battletag: this.battleTag,

                current_prestige_points: this.current_prestige_points,
                daily_reports_left: this.daily_reports_left,
                daily_endorses_left: this.daily_endorses_left,

                tutorial_completed: false,
                hard_currency_balance: this.hardCurrencyBalance,
                hard_currency_bought: this.hardCurrencyBought,
                hard_currency_spent: this.hardCurrencySpent,
                hard_currency_earned: this.hardCurrencyEarned,
                soft_currency_balance: this.softCurrencyBalance,
                soft_currency_bought: this.softCurrencyBought,
                soft_currency_spent: this.softCurrencySpent,
                soft_currency_earned: this.softCurrencyEarned,
                player_level: this.playerLevel,
                total_spent_in_usd: this.totalSpentInUsd,
                num_purchases: this.numPurchases,

                client_version: this.clientVersion,
                dev_client_version: this.clientVersion,
                first_play_time: this.firstPlayTime.toISOString(),
                days_retained: (new Date().getTime() - this.firstPlayTime.getTime()) / (1000 * 3600 * 24)
            };
            return payload;
        }
    }, {
        key: 'sendEvent',
        value: function sendEvent(name, payload) {
            /*console.log('Send event');
            console.log(payload);*/
            var data = {
                events: [{
                    event_type: name,
                    payload: payload
                }]
            };
            var opts = {
                url:  true ? prodEndPoint : undefined,
                type: 'POST',
                timeout: 10 * 1000,
                headers: {
                    'X-Api-Key': 'vi1rrPEGmo8L6GKBHNPaBar1XvQOoblb3Q018HO0'
                },
                contentType: 'application/json; charset=utf-8',
                data: (0, _stringify2.default)(data)
            };
            $.ajax(opts).done(function (res, status) {
                console.log(name + " event sent successfully");
            }).fail(function (err) {
                console.log(name + " event not sent");
            });
        }
    }]);
    return AnalyticsService;
}();

module.exports = AnalyticsService;
