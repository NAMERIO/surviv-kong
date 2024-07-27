"use strict";


/* global AppRate,facebookConnectPlugin,NativeStorage */

function facebookLogin(cb) {
    facebookConnectPlugin.login(['public_profile'], function (userData) {
        cb(null, userData);
    }, function (err) {
        cb(err);
    });
}

function googleLogin(cb) {
    window.plugins.googleplus.login({}, function (data) {
        cb(null, data);
    }, function (err) {
        cb(err);
    });
}

function getSystemMemoryInfo(cb) {
    window.chrome.system.memory.getInfo(cb);
}

function promptAppRate(cb) {
    AppRate.preferences = {
        useLanguage: 'en',
        displayAppName: 'bitheroesarena.com',
        usesUntilPrompt: 1,
        promptAgainForEachNewVersion: true,
        inAppReview: true,
        storeAppURL: {
            ios: '1401727934',
            android: 'market://details?id=io.surviv.surviv_io_mobile'
            // windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
            // blackberry: 'appworld://content/[App Id]/',
            // windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
        },
        customLocale: {
            title: 'Enjoying surviv.io?',
            message: "Thanks for playing! It would be a huge help if you rated us. We appreciate your support!",
            cancelButtonLabel: 'No Thanks',
            laterButtonLabel: 'Remind Me Later',
            rateButtonLabel: 'Rate surviv.io'
            // noButtonLabel: 'No thanks',
            // yesButtonLabel: 'Yes!',
            // appRatePromptTitle: 'Do you like playing surviv.io?',
            // feedbackPromptTitle: 'Mind giving us some feedback?',
        },
        callbacks: {
            handleNegativeFeedback: function handleNegativeFeedback() {
                window.open('mailto:admin@surviv.io', '_system');
            },
            onRateDialogShow: function onRateDialogShow(callback) {
                //callback(1); // cause immediate click on 'Rate Now' button
            },
            onButtonClicked: function onButtonClicked(buttonIndex) {
                cb(buttonIndex);
            }
        }
    };
    AppRate.preferences.simpleMode = true;
    AppRate.promptForRating();
}

function hasNativeStorage() {
    return window.NativeStorage !== undefined;
}

function storageGetItem(key, cb) {
    NativeStorage.getItem(key, function (data) {
        cb(null, data);
    }, function (err) {
        cb(err);
    });
}

function storageSetItem(key, value, cb) {
    NativeStorage.setItem(key, value, function (data) {
        cb(null, data);
    }, function (err) {
        cb(err);
    });
}

module.exports = {
    facebookLogin: facebookLogin,
    getSystemMemoryInfo: getSystemMemoryInfo,
    googleLogin: googleLogin,
    promptAppRate: promptAppRate,
    hasNativeStorage: hasNativeStorage,
    storageGetItem: storageGetItem,
    storageSetItem: storageSetItem
};
