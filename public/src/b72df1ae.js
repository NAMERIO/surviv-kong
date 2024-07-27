"use strict";


// @ts-check
var GameObjectDefs = require("./gameObjectDefs.js");

var getItemValue = function getItemValue(objDef) {
    var priceList = GameObjectDefs['prices_1'];
    var priceObj = priceList.rarities.find(function (o) {
        return o.rarity === objDef.rarity;
    });

    return priceObj.price;
};

module.exports = {
    getItemValue: getItemValue
};
