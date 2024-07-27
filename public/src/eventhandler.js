"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var api = require("./api.js");
var device = require("./device.js");

// Bundle 'events.js' with the app
//set deafualt english as event lang
var EnJs = require("./seasonalEvents.js");

//
// Helpers
//
function downloadFile(file, onComplete) {
    var opts = {
        url: api.resolveUrl(file),
        type: 'GET'
    };

    $.ajax(opts).done(function (data) {
        onComplete(null, data);
    }).fail(function (err) {
        onComplete(err);
    });
}

var Locales = {
    'da': 'Dansk',
    'de': 'Deutsch',
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'pl': 'Polski',
    'pt': 'Português',
    'ru': 'Русский',
    'sv': 'Svenska',
    'vi': 'Tiếng Việt',
    'tr': 'Türkçe',
    'ja': '日本語',
    'ko': '한국어',
    'th': 'ภาษาไทย',
    'zh-cn': '中文简体',
    'zh-tw': '中文繁體'
};

function Eventshandler() {
    this.acceptedLocales = (0, _keys2.default)(Locales);
    this.translations = {};
    this.events = [];
    this.translations['en'] = EnJs;
    this.lastSeen;
    this.locale = 'en';
    this.currentDate;
    this.localizator;
}

Eventshandler.prototype = {

    //It reads the events file
    setEventLanguage: function setEventLanguage(locale) {
        var _this = this;

        var newLocale = this.acceptedLocales.indexOf(locale) != -1 ? locale : 'en';
        if (this.translations[locale] === undefined) {
            downloadFile('../../../data/events/events.json', function (err, data) {
                if (err) {
                    console.error('Failed loading event data for locale ' + locale);
                    return;
                }
                _this.translations[locale] = data;
                _this.setEventLanguage(locale);
            });
        } else {
            this.locale = newLocale;
        }
        this.setValidModals();
    },

    setLocalization: function setLocalization(json) {
        this.localizator = json;
    },

    // this fuction iterates through the whole events.json file and filters the events by priority and device at the end sort the events by priority
    setValidModals: function setValidModals() {
        var length = this.translations[this.locale].events.length;
        var today = new Date();
        var dateVal = Date.now();
        if (!device.mobile) {
            for (var i = 0; i < length; i++) {
                var startDate = this.translations[this.locale].events[i].startDate;
                var endDate = this.translations[this.locale].events[i].endDate;
                if ((this.translations[this.locale].events[i].SKU === "web" || this.translations[this.locale].events[i].SKU === "all") && this.translations[this.locale].events[i].isActive === true && startDate < dateVal && dateVal <= endDate) {
                    this.events.push(this.translations[this.locale].events[i]);
                }
            }
        } else {
            for (var _i = 0; _i < length; _i++) {
                var _startDate = this.translations[this.locale].events[_i].startDate;
                var _endDate = this.translations[this.locale].events[_i].endDate;
                if ((this.translations[this.locale].events[_i].SKU === "mobile" || this.translations[this.locale].events[_i].SKU === "all") && this.translations[this.locale].events[_i].isActive === true && _startDate < dateVal && dateVal <= _endDate) {
                    this.events.push(this.translations[this.locale].events[_i]);
                }
            }
        }

        //let's sort the events by priority
        this.events.sort(function (event1, event2) {
            return event1.priority > event2.priority ? 1 : -1;
        });
    },

    getLastSeen: function getLastSeen() {
        return this.lastSeen;
    },

    /**
    * @param lastSeenId the last seen event along with the cookie expiration date(it expires every 24 hours)
    * 
    * The function receives the cookie value and activates the functions for sorting and displaying event modals 
    */
    checkModals: function checkModals(lastSeenId) {
        if (lastSeenId === null || lastSeenId === undefined || lastSeenId === '') {

            this.translations[this.locale].events[0].id;
            this.updateModal(0);
            /*this.currentDate = new Date();
            this.currentDate.setDate(this.currentDate.getDate() + 1);*/
        } else {
            /*let complexCookie = lastSeenId.split(',expireDate=');
            this.lastSeen = complexCookie[0];
            this.currentDate = complexCookie[1];*/
            this.lastSeen = lastSeenId;
            this.checkForNextModals();
        }
    },

    getCurrentDate: function getCurrentDate() {
        return this.currentDate;
    },

    //checks if the event list has a next element
    checkForNextModals: function checkForNextModals() {
        var length = this.events.length;
        var lastEventIndex = 0;
        for (var i = 0; i < length; i++) {
            if (this.lastSeen === this.events[i].id) {
                lastEventIndex = i;
                break;
            }
        }
        this.updateModal(lastEventIndex + 1);
    },

    //Function for updating the modal
    updateModal: function updateModal(index) {
        if (index < this.events.length) {
            var localizedTItle = $('#modal-header');
            var modalText = $('#modal-text');
            var modalBtn = $('#modal-btn');
            var imgBig = $('#modal-img-1');
            var imgSmall = $('#modal-img-2');

            localizedTItle.html(this.localizator[this.events[index].name] + (this.events[index].name2 ? '<br>' + this.localizator[this.events[index].name2] : ''));
            modalText.text(this.localizator[this.events[index].description]);
            modalBtn.text(this.localizator[this.events[index].buttontxt]);
            imgBig.attr('src', this.events[index].featureImg);
            imgSmall.attr('src', this.events[index].paragraphImage);
            this.lastSeen = this.events[index].id;
            $('#event-modal').show();
        } else {
            $('#event-modal').hide();
        }
    }

};

module.exports = Eventshandler;
