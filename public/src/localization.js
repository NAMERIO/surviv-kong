"use strict";


var _regenerator = require("./68823093.js");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("./91c4117e.js");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = require("./8ee62bea.js");
var api = require("./api.js");
var device = require("./device.js");

// Bundle 'en.js' with the app
var EnJs = require("./english.js");

//
// Helpers
//
function downloadFile(file, onComplete) {
    var opts = {
        url: api.resolveUrl(file),
        type: 'GET'
    };

    return $.ajax(opts).done(function (data) {
        onComplete(null, data);
    }).fail(function (err) {
        onComplete(err);
    });
}

//
// Localization functions
//
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

function Localization() {
    this.acceptedLocales = (0, _keys2.default)(Locales);
    this.translations = {};
    this.translations['en'] = EnJs;

    this.locale = 'en';
}

Localization.prototype = {
    detectLocale: function detectLocale() {
        return 'en';
        /*Commented for early access TODO uncomment after
        let detectedLocale =
            (navigator.language || navigator.userLanguage).toLowerCase();
        const languageWildcards = [
            'pt', 'de', 'es', 'fr', 'ko', 'ru', 'en'
        ];
        for (let i = 0; i < languageWildcards.length; i++) {
            if (detectedLocale.indexOf(languageWildcards[i]) != -1) {
                detectedLocale = languageWildcards[i];
                break;
            }
        }
        for (let i = 0; i < this.acceptedLocales.length; i++) {
            if (detectedLocale.indexOf(this.acceptedLocales[i]) != -1) {
                return this.acceptedLocales[i];
            }
        }
        return 'en';*/
    },

    setLocale: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(locale) {
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            this.locale = 'en';
                            this.localizeIndex();
                            /*Commented for early access TODO uncomment after
                            let newLocale = this.acceptedLocales.indexOf(locale) != -1 ? locale : 'en';
                            if (newLocale != this.locale) {
                                if (this.translations[locale] === undefined) {
                                    await downloadFile(`/l10n/${locale}.json`, (err, data) => {
                                        if (err) {
                                            console.error(`Failed loading translation data for locale ${locale}`);
                                            return;
                                        }
                                        this.translations[locale] = data;
                                        this.setLocale(locale);
                                    });
                                } else {
                                    this.locale = newLocale;
                                    this.localizeIndex();
                                }
                            }*/

                        case 2:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function setLocale(_x) {
            return _ref.apply(this, arguments);
        }

        return setLocale;
    }(),

    getLocale: function getLocale() {
        return this.locale;
    },

    /**
     * 
     * @param {string} key 
     * @returns {string}
     */
    translate: function translate(key) {
        //Commented for early access TODO uncomment after
        /*return this.translations[this.locale][key] ||
            this.translations['en'][key] || '';*/

        return this.translateEn(key);
    },

    translateEn: function translateEn(key) {
        return this.translations['en'][key] || '';
    },

    getLocalizedJson: function getLocalizedJson() {
        return this.translations[this.locale];
    },

    localizeIndex: function localizeIndex() {
        var _this = this;

        // Go through index and replace data-l10n tagged elements
        var localizedElements = $('*[data-l10n]');
        localizedElements.each(function (idx, el) {
            var el$ = $(el);
            var datal10n = el$.attr('data-l10n');
            // Append '-touch' for touch controls
            if (el$.hasClass('help-control') && device.touch) {
                datal10n += '-touch';
            }
            var localizedText = _this.translate(datal10n);
            if (localizedText) {
                if (el$.attr('label')) {
                    el$.attr('label', localizedText);
                } else {
                    el$.html(localizedText);
                    if (el$.attr('data-label')) {
                        el$.attr('data-label', localizedText);
                    }
                }
            }
        });
    },

    populateLanguageSelect: function populateLanguageSelect() {
        var el = $('.language-select');
        el.empty();

        var locales = (0, _keys2.default)(Locales);
        for (var i = 0; i < locales.length; i++) {
            var locale = locales[i];
            var name = Locales[locale];

            //if added for early access TODO delete after
            if (locale != 'en') continue;

            el.append($('<option>', {
                value: locale,
                text: name
            }));
        }
    }
};

module.exports = Localization;
