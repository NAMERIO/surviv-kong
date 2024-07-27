"use strict";


var $ = require("./8ee62bea.js");
var util = require("./util.js");
var helpers = require("./helpers.js");

var CrosshairDefs = require("./crosshairDefs.js");

//
// Internal helper routines
//
function getCrosshairDims(crosshairDef) {
    var crosshairBase = {
        width: 64,
        height: 64
    };
    var width = 4.0 * Math.round(crosshairBase.width * crosshairDef.size / 4.0);
    var height = 4.0 * Math.round(crosshairBase.height * crosshairDef.size / 4.0);
    return { width: width, height: height };
}

function getBaseURL(crosshairDef) {
    var objDef = CrosshairDefs[crosshairDef.type];
    var dims = getCrosshairDims(crosshairDef);
    var color = util.rgbToHex(util.intToRgb(crosshairDef.color));
    var strokeWidth = crosshairDef.stroke;
    var svgCode = objDef.code.replace(/white/g, color);

    // console.log(crosshairDef.stroke, strokeWidth);
    svgCode = svgCode.replace(/stroke-width=".5"/g, 'stroke-width="' + strokeWidth + '"');
    svgCode = svgCode.replace(/width="64"/g, 'width="' + dims.width + '"');
    svgCode = svgCode.replace(/height="64"/g, 'height="' + dims.height + '"');
    svgCode = svgCode.replace(/#/g, '%23');
    return "url('data:image/svg+xml;utf8," + svgCode + "')";
}

function getCursorCSS(crosshairDef) {
    var dims = getCrosshairDims(crosshairDef);
    return getBaseURL(crosshairDef) + ' ' + dims.width / 2 + ' ' + dims.height / 2 + ', crosshair';
}

//
// Public interface
//
var crosshair = {
    getCursorURL: function getCursorURL(crosshairDef) {
        return getBaseURL(crosshairDef);
    },

    setElemCrosshair: function setElemCrosshair(elem, crosshairDef) {
        var cursor = 'crosshair';

        var objDef = CrosshairDefs[crosshairDef.type];
        if (objDef) {
            cursor = objDef.cursor ? objDef.cursor : getCursorCSS(crosshairDef);
        }

        elem.css({
            cursor: cursor
        });
    },

    setGameCrosshair: function setGameCrosshair(crosshairDef) {
        // Set game pointer
        crosshair.setElemCrosshair($('#game-area-wrapper'), crosshairDef);

        // Adjust UI elements to use the custom crosshair as well
        var objDef = CrosshairDefs[crosshairDef.type];
        var style = !objDef || objDef.cursor ? 'pointer' : 'inherit';
        $('.ui-zoom, .ui-medical, .ui-settings-button, .ui-weapon-switch').css({ cursor: style });
    }
};

module.exports = crosshair;
