"use strict";


var $ = require("./8ee62bea.js");
var device = require("./device.js");
var helpers = require("./helpers.js");
var FirebaseManager = require("./FirebaseManager.js");
var MenuModal = require("./menuModal.js");
var proxy = require("./proxy.js");
var Ads = require("./ads.js");
var Config = require("./config.js");

var adManager;

function createToast(text, container, parent, event) {
    var copyToast = $('<div/>', {
        class: 'copy-toast',
        html: text
    });
    container.append(copyToast);
    copyToast.css({
        left: event.pageX - parseInt(copyToast.css('width')) / 2,
        top: parent.offset().top
    });
    copyToast.animate({
        top: "-=25",
        opacity: 1.0
    }, {
        queue: false,
        duration: 300,
        complete: function complete() {
            $(this).fadeOut(250, function () {
                $(this).remove();
            });
        }
    });
}

function setupModals(inputBinds, inputBindUi, adService) {
    adManager = adService;

    // Reveal the help text
    $("#btn-help, #btn-help-mobile").click(function () {
        var modalHowToPlay = new MenuModal($('#modal-how-to-play'));
        modalHowToPlay.show();

        FirebaseManager.storeGeneric('info', 'help');

        return false;
    });

    var teamMobileLink = $('#team-mobile-link');
    var teamMobileLinkDesc = $('#team-mobile-link-desc');
    var teamMobileLinkWarning = $('#team-mobile-link-warning');
    var teamMobileLinkInput = $('#team-link-input');
    var leftMenu = $('#left-column');
    var mainPlayBtns = $('#main-play-btns');
    var passBlock = $('#btn-pass-locked');
    /*let socialButton = $('#btn-social');
    
    //Display Social
    socialButton.on('click',function(){
        $('#social-share-block-wrapper').toggleClass('show');
    });*/
    //$("#start-menu-buttons").children().removeClass("selected");

    // Team mobile link
    $("#btn-join-team").click(function () {
        if (device.mobile) {
            $('#team-mobile-link').removeClass('menu-column menu-block');
            $('#team-mobile-link').addClass('modal team-menu-modal');
            $('#ad-block-right').css('display', 'none');
        }
        $('#server-warning').css('display', 'none');
        teamMobileLinkInput.val('');
        teamMobileLink.css('display', 'block');
        teamMobileLinkDesc.css('display', 'block');
        teamMobileLinkWarning.css('display', 'none');
        mainPlayBtns.css('display', 'none');
        leftMenu.css('opacity', '0.0');
        passBlock.css('display', 'none');
        $('#home-section').css('display', 'none');
        return false;
    });

    $("#close-team-join").click(function () {
        teamMobileLink.css('display', 'none');
        teamMobileLinkInput.val('');
        mainPlayBtns.css('display', 'block');
        leftMenu.css('opacity', '1.0');
        passBlock.css('display', 'block');
        $('#ad-block-right').css('display', 'block');
        $('#home-section').css('display', 'block');
        return false;
    });

    // Auto submit link or code on enter
    $("#team-link-input").on('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            $("#btn-team-mobile-link-join").trigger('click');
            $(this).blur();
        }
    });

    // Blur name input on enter
    $("#player-name-input-solo").on('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) {
            $(this).blur();
        }
    });

    // Scroll to name input on mobile
    if (device.mobile && device.os != 'ios') {
        $('#player-name-input-solo').on('focus', function () {
            if (device.isLandscape) {
                var height = device.screenHeight;
                var offset = height <= 282 ? 18 : 36;
                document.body.scrollTop = $(this).offset().top - offset;
            }
        });
        $('#player-name-input-solo').on('blur', function () {
            document.body.scrollTop = 0;
        });
    }

    //
    // Modals
    //
    var startBottomRight = $('#start-bottom-right');
    var startTopLeft = $('#start-top-left');

    // Keybind Modal
    var modalKeybind = new MenuModal($('#ui-modal-keybind'));
    modalKeybind.onShow(function () {
        startBottomRight.fadeOut(200);
        // Reset the share section
        $('#ui-modal-keybind-share').css('display', 'none');
        $('#keybind-warning').css('display', 'none');
        $('#keybind-code-input').html('');

        inputBindUi.refresh();
    });
    modalKeybind.onHide(function () {
        startBottomRight.fadeIn(200);
        inputBindUi.cancelBind();
    });
    document.querySelector('#btn-keybind-menu').onclick = function () {
        modalKeybind.show();
        return false;
    };

    // Share button
    $('.js-btn-keybind-share').click(function () {
        // Toggle the share screen
        if ($('#ui-modal-keybind-share').css('display') == 'block') {
            $('#ui-modal-keybind-share').css('display', 'none');
        } else {
            $('#ui-modal-keybind-share').css('display', 'block');
        }
    });
    // Copy keybind code
    $('#keybind-link, #keybind-copy').click(function (e) {
        createToast('Copied!', modalKeybind.selector, $('#keybind-link'), e);

        var code = $('#keybind-link').html();
        helpers.copyTextToClipboard(code);
    });
    // Apply keybind code
    $('#btn-keybind-code-load').on('click', function (e) {

        var code = $('#keybind-code-input').val();
        $('#keybind-code-input').val('');

        var success = inputBinds.fromBase64(code);
        $('#keybind-warning').css('display', success ? 'none' : 'block');
        if (success) {
            createToast('Loaded!', modalKeybind.selector, $('#btn-keybind-code-load'), e);
            inputBinds.saveBinds();
        }
        inputBindUi.refresh();
    });

    // Settings Modal
    var modalSettings = new MenuModal($('#modal-settings'));
    var socialButtonsModal = new MenuModal($('#modal-social-buttons'));
    /* modalSettings.onShow(() => {        
         startBottomRight.fadeOut(200);
          if(device.mobile && adManager){adManager.hideBannerAd();}
     });
     modalSettings.onHide(() => {                
         if(device.mobile && adManager){adManager.showBannerAd(true);}
         startBottomRight.fadeIn(200);  
     });*/
    var settingsButton = document.getElementById('settings-button');
    settingsButton.onclick = function () {
        modalSettings.show();
    };

    var socialModalBtn = document.getElementById('btn-social');
    socialModalBtn.onclick = function () {
        socialButtonsModal.show();
    };

    $('.modal-settings-text').click(function (e) {
        var checkbox = $(this).siblings('input:checkbox');
        checkbox.prop('checked', !checkbox.is(':checked'));
        checkbox.trigger('change');
    });

    // Hamburger Modal
    var modalHamburger = new MenuModal($('#modal-hamburger'));
    modalHamburger.onShow(function () {
        startTopLeft.fadeOut(200);
        if (device.webview && adManager && device.version >= '1.0.9') {
            adManager.hideBannerAd();
        }
    });
    modalHamburger.onHide(function () {
        startTopLeft.fadeIn(200);
        if (device.webview && adManager && device.version >= '1.0.9') {
            adManager.showBannerAd(true);
        }
    });
    $('#btn-hamburger').click(function () {
        modalHamburger.show();
        return false;
    });

    $('.modal-body-text').click(function () {
        var checkbox = $(this).siblings('input:checkbox');
        checkbox.prop('checked', !checkbox.is(':checked'));
        checkbox.trigger('change');
    });

    $('#force-refresh').click(function () {
        window.location.href = '/?t=' + Date.now();
    });

    // Notification modals for various error conditions
    var notificationModal = new MenuModal($('#modal-notification'));
    var getNotificationText = function getNotificationText() {
        if (!('WebSocket' in window)) {
            return 'WebSockets are required to play.<br><br>Please use the <a href="https://web.archive.org/web/20211102160635/https://www.google.com/chrome/browser/desktop/index.html" target="_blank">Chrome browser</a> for a better playing experience!';
        }
        if (!proxy.m_authLocation()) {
            return 'Please use the <a href="https://web.archive.org/web/20211102160635/https://bitheroesarena.io" target="_blank">Official bitheroesarena.io site</a> for a better playing experience!';
        }
        if (device.browser == 'ie') {
            return 'Please use the <a href="https://web.archive.org/web/20211102160635/https://www.google.com/chrome/browser/desktop/index.html" target="_blank">Chrome browser</a> for a better playing experience!' + '<br><br>¡Usa el <a href="https://web.archive.org/web/20211102160635/https://www.google.com/chrome/browser/desktop/index.html" target="_blank">navegador Chrome</a> para una mejor experiencia de juego!' + '<br><br><a href="https://web.archive.org/web/20211102160635/https://www.google.com/chrome/browser/desktop/index.html" target="_blank">구글 크롬</a> 브라우저로이 게임을 즐겨보세요.';
        }
    };
    var notification = getNotificationText();
    if (notification) {
        notificationModal.selector.find('.modal-body-text').html(notification);
        notificationModal.show();
    }

    helpers.m_tryBreakMaliciousProxies();

    // Display adblock plea
    if (window.adsBlocked) {
        var blocked = document.getElementById('main-med-rect-blocked');
        if (blocked) {
            blocked.style.display = 'block';
        }
        var ad1 = document.getElementById('survivio_300x250_main');
        if (ad1) {
            ad1.style.display = 'none';
        }
        var ad2 = document.getElementById('survivio_300x250_start'); // surviv-io_300x250;
        if (ad2) {
            ad2.style.display = 'none';
        }
    }

    // Re-check AIP consent
    if (window.aiptag) {
        window.aiptag.gdprConsent = window.cookiesConsented;
        window.aiptag.consented = window.cookiesConsented;
    }
}

function onResize() {
    // Add styling specific to safari in browser
    if (device.os == 'ios') {
        // iPhone X+ specific
        if (device.model == 'iphonex') {
            if (device.isLandscape) {
                $('.main-volume-slider').css('width', '90%');
            } else {
                $('.main-volume-slider').css('width', '');
            }
        } else if (!window.navigator.standalone) {
            if (!device.isLandscape) {
                $('#modal-customize .modal-content').css({
                    'transform': 'translate(-50%, -50%) scale(0.45)',
                    'top': '38%'
                });
            } else {
                $('#start-main-center').attr('style', '');
                $('#modal-customize .modal-content').attr('style', '');
            }
        }
    }

    if (device.tablet) {
        // Temporarily remove the youtube links
        $('#featured-youtuber').remove();
        $('.btn-youtube').remove();
    }

    if (device.touch) {
        // Remove full screen option from main menu
        $('.btn-start-fullscreen').css('display', 'none');
    } else {
        $('.btn-start-fullscreen').css('display', 'block');
    }

    // Set keybind button styling
    $('.btn-keybind').css('display', device.mobile ? 'none' : 'inline-block');
}

function applyWebviewStyling(isTablet) {
    // For webviews, we only want to display the team code, not the url.
    // We'll reuse the copy-url element to display the code.

    /*$('#invite-link-text').attr('data-l10n', 'index-invite-code');
    $('#team-code-text').css('display', 'none');
    $('#invite-code-text').css('display', 'none');
    $('#team-hide-url').css('display', 'none');*/
    $('#xp-team-text').css('width', '524px');

    $('.btn-download-ios').css('display', 'none');
    $('.btn-download-android').css('display', 'none');
    $('#mobile-download-app').css('display', 'none');
    $('#version-proxies-links').css('display', 'none');

    // Make more room for the bottom ad on phones
    if (!isTablet) {
        $('#btn-help').css('display', 'none');
        $('#news-block, #season-pass').css({
            'height': 186
        });
        /*$('#team-menu').css({
            'height': 186,
            'padding': 10
        });*/
    }
}

function applyMobileBrowserStyling(isTablet) {
    //$('#team-hide-url').css('display', 'none');
    if (isTablet) {
        $('#version-proxies-links').addClass('version-proxies-links-tablet');
    }
    if (device.os == 'android') {
        $('.btn-download-android').css('display', 'block');
        $('.btn-download-ios').css('display', 'none');
    } else if (device.os == 'ios') {
        $('.btn-download-ios').css('display', 'block');
        $('.btn-download-android').css('display', 'none');
    }
    $('#mobile-download-app').css('display', 'block');
}

function applySteamStyling() {
    // remove app download buttons on Steam
    $('.btn-download-ios').css('display', 'none');
    $('.btn-download-android').css('display', 'none');
    $('#mobile-download-app').css('display', 'none');

    // anchor version number and proxy sites link to bottom left
    $('#version-proxies-links').addClass('version-proxies-links-steam');
}

module.exports = {
    setupModals: setupModals,
    onResize: onResize,
    applyWebviewStyling: applyWebviewStyling,
    applyMobileBrowserStyling: applyMobileBrowserStyling,
    applySteamStyling: applySteamStyling
};
