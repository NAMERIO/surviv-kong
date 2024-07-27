"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
// Helper functions
//
// Taken from https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function detectMobile() {
    var isMobile = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return isMobile || isIpad();
}

function detectTablet() {
    // https://github.com/PoeHaH/devicedetector/blob/master/devicedetector-production.js
    var isTablet = false;
    var ua = navigator.userAgent.toLowerCase();
    (function (a) {
        if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) isTablet = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    // Workaround for iOS 12 not returning iPad
    if (!isTablet) {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS && window.innerWidth >= 1023 && window.innerHeight >= 747) {
            isTablet = true;
        }
    }
    return isTablet || isIpad();
}

// Workaround for iOS 13 not returning iPad
function isIpad() {
    var ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('ipad') > -1 || ua.indexOf('macintosh') > -1 && 'ontouchend' in document;
}

function detectiOS() {
    return (/iPad|iPhone|iPod/.test(navigator.userAgent) || isIpad() && !window.MSStream
    );
}

function detectAndroid() {
    return (/Android/.test(navigator.userAgent) && !window.MSStream
    );
}

function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    return msie > 0 || trident > 0;
}

function detectEdge() {
    var ua = window.navigator.userAgent;
    var edge = ua.indexOf('Edge/');
    return edge > 0;
}

function detectiPhoneX() {
    return detectiOS() && (screen.width == 375 && screen.height == 812 || screen.height == 375 && screen.width == 812 || screen.width == 414 && screen.height == 896 || screen.height == 414 && screen.width == 896);
}

function detectIpadPro() {
    return detectiOS() && (screen.width == 1024 && screen.height == 1366 || screen.height == 1024 && screen.width == 1366);
}

function setItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        // Ignore
    }
}

function getItem(key) {
    var item = null;
    try {
        item = localStorage.getItem(key);
    } catch (e) {
        // Ignore
    }
    return item;
}

//
// Device
//

var Device = function () {
    function Device() {
        (0, _classCallCheck3.default)(this, Device);

        this.os = 'pc';
        if (detectiOS()) {
            this.os = 'ios';
        } else if (detectAndroid()) {
            this.os = 'android';
        }

        this.browser = 'unknown';
        if (detectIE()) {
            this.browser = 'ie';
        } else if (detectEdge()) {
            this.browser = 'edge';
        }

        var webviewParam = getParameterByName('webview') == 'true';
        if (webviewParam) {
            setItem('surviv_webview', 'true');
        }
        this.webview = webviewParam || getItem('surviv_webview');

        this.model = 'unknown';
        if (detectiPhoneX()) {
            this.model = 'iphonex';
        }
        if (detectIpadPro()) {
            this.model = 'ipadpro';
        }

        var versionParam = getParameterByName('version');
        if (versionParam) {
            setItem('surviv_version', versionParam);
        }
        this.version = getItem('surviv_version') || '1.0.0';

        this.mobile = detectMobile();
        this.tablet = detectTablet();
        this.touch = this.mobile || this.tablet;
        this.pixelRatio = window.devicePixelRatio;
        this.debug = false;

        this.UiLayout = {
            Lg: 0,
            Sm: 1
        };
        this.uiLayout = this.mobile ? this.UiLayout.Sm : this.UiLayout.Lg;

        this.screenWidth = 0;
        this.screenHeight = 0;
        this.isLandscape = true;

        this.onResize();
    }

    (0, _createClass3.default)(Device, [{
        key: "onResize",
        value: function onResize() {
            this.isLandscape = window.innerWidth > window.innerHeight || window.orientation == 90 || window.orientation == -90;

            this.screenWidth = window.innerWidth;
            this.screenHeight = window.innerHeight;

            // Update layout based on screen breakpoint
            var layoutDim = this.isLandscape ? this.screenWidth : this.screenHeight;
            this.uiLayout = this.mobile || layoutDim <= 850 || layoutDim <= 900 && this.pixelRatio >= 3 ? this.UiLayout.Sm : this.UiLayout.Lg;

            //TODO delete after mobile is ready
            if (this.mobile || this.tablet) {
                var mobileSplashScreenImg = document.getElementById('mobile-splash-screen').querySelector('.mobile-loading-img');
                if (this.screenWidth < this.screenHeight) {
                    mobileSplashScreenImg.classList.add('portrait');
                    mobileSplashScreenImg.style.height = this.screenHeight + 'px';
                    mobileSplashScreenImg.style.width = this.screenWidth + 'px';
                } else {
                    if (mobileSplashScreenImg.classList.contains('portrait')) mobileSplashScreenImg.classList.remove('portrait');

                    mobileSplashScreenImg.style.height = this.screenHeight + 'px';
                    mobileSplashScreenImg.style.width = this.screenWidth + 'px';
                }
            }
        }
    }]);
    return Device;
}();

// Singleton


var device = new Device();

module.exports = device;
