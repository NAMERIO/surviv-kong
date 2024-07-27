"use strict";


var $ = require("./8ee62bea.js");
var cookieconsent = require("./cookieconsent.js");
var FirebaseManager = require("./FirebaseManager.js");
var MenuModal = require("./menuModal.js");

function showCookieConsent(config) {
    var p = null;
    var message = "This website uses ad monetization services of AdinPlay BV and uses cookies to personalize ads, ad serving, analytics and verification. " + "By clicking 'Got it!' you confirm that you consent to setting cookies and processing your personal data for all the listed purposes. " + 'If you are under the age of consent in your jurisdiction for data processing purposes, or if you wish to deny consent, click "Learn more".';
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#3c404d",
                "text": "#d6d6d6"
            },
            "button": {
                "background": "#8bed4f"
            }
        },
        "theme": "classic",
        "position": "bottom-left",
        "content": {
            "message": message,
            "dismiss": "Got it!",
            "deny": "Decline",
            "link": "Learn more.",
            "href": "/privacy"
        },
        "revokable": false,
        "animateRevokable": false,
        // Set to false to only show in relevant countries
        'law': {
            'regionalLaw': false
        },
        "location": false,
        onStatusChange: function onStatusChange(status) {
            var type = this.options.type;
            var didConsent = this.hasConsented();
            var consent = config.get('cookiesConsented');
            config.set('cookiesConsented', didConsent);
            FirebaseManager.storeGeneric('cookiesConsented', didConsent);
            if (consent != didConsent) {
                window.location.reload(false);
            }
        }
    }, function (popup) {
        p = popup;
    }, function (err) {
        console.error(err);
    });

    $('#btn-cookie-opt-out').click(function (e) {
        if (p) {
            p.setStatus('deny');
            var consent = config.get('cookiesConsented');
            if (consent) {
                config.set('cookiesConsented', false);
                FirebaseManager.storeGeneric('cookiesConsented', false);
                window.location.reload(false);
            }
        }
    });

    $('.btn-cookies-close').click(function (e) {
        if (p) {
            p.setStatus('allow');
            var consent = config.get('cookiesConsented');
            if (!consent) {
                config.set('cookiesConsented', true);
                FirebaseManager.storeGeneric('cookiesConsented', true);
                window.location.reload(false);
            }
        }
    });

    // Cookie setting modal
    var modalSettings = new MenuModal($('#modal-cookie-settings'));
    modalSettings.onShow(function () {
        // @TODO: Does this need to fade back in when the modal is hidden?
        $('#modal-hamburger').fadeOut(200);
    });
    $('.btn-cookie-settings').css('display', 'inline-block');
    $('.btn-cookie-settings').click(function (e) {
        if (p) {
            if (p.getStatus() == undefined && $(this).hasClass('cc-link')) {
                p.setStatus('dismiss');
                p.close();
            }
            modalSettings.show();
        }
        return false;
    });
}

module.exports = {
    showCookieConsent: showCookieConsent
};
