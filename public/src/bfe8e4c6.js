"use strict";


var _BoonNameToId;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//@ts-check
var Boons = require("./boons.js");
var HealersKit = require("./healersKit.js");
var ElvishMetalBoon = require("./elvishMetalBoon.js");
var ExtraPouchBoon = require("./extraPouchBoon.js");
var AGoodStart = require("./aGoodStart.js");

var BoonNames = {
    ElvishMetal: 'boon_elvishmetal',
    ExtraPouch: 'boon_extrapouch',
    AGoodStart: 'boon_agoodstart',
    HealersKit: 'boon_healerskit'
};

var BoonIdToName = {
    0: BoonNames.ElvishMetal,
    1: BoonNames.ExtraPouch,
    2: BoonNames.HealersKit,
    3: BoonNames.AGoodStart
};

var BoonNameToId = (_BoonNameToId = {}, _defineProperty(_BoonNameToId, BoonNames.ElvishMetal, 0), _defineProperty(_BoonNameToId, BoonNames.ExtraPouch, 1), _defineProperty(_BoonNameToId, BoonNames.HealersKit, 2), _defineProperty(_BoonNameToId, BoonNames.AGoodStart, 3), _BoonNameToId);

function createBoon(name, player, runningOnClient, params) {
    var boon = null;

    switch (name) {
        case BoonNames.ExtraPouch:
            boon = new ExtraPouchBoon(player, runningOnClient);
            break;
        case BoonNames.ElvishMetal:
            boon = new ElvishMetalBoon(player, runningOnClient, Boons[BoonNames.ElvishMetal], params);
            break;
        case BoonNames.HealersKit:
            boon = new HealersKit(player, runningOnClient, Boons[BoonNames.HealersKit], params);
            break;
        case BoonNames.AGoodStart:
            boon = new AGoodStart(player, runningOnClient, Boons[BoonNames.AGoodStart], params);
            break;
        default:
            console.error("No boon found with name: " + name);
            break;
    }
    return boon;
}

function createBoonById(id, player, runningOnClient, params) {
    return createBoon(BoonIdToName[id], player, runningOnClient, params);
}

module.exports = {
    createBoon: createBoon,
    createBoonById: createBoonById,
    BoonNames: BoonNames,
    BoonIdToName: BoonIdToName,
    BoonNameToId: BoonNameToId
};
