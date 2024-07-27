"use strict";


var MarketConfiDef = {
    searchCooldownBuy: 20 * 1000, //20 seconds
    searchCooldownSell: 0, //No cooldown

    maximunPriceSell: 2147483647, //Integer maximum value

    itemPostedDuration: 24 * 60 * 60 * 1000, //24 hours (1 Day) IMPORTANT if needed, change it on the DB function too
    unlockTime: 24 * 60 * 60 * 1000, //24 hours (1 Day)

    inversePostingFee: 0.90, //Is needed to change it on the DB functions too
    /*In this case (0.90) the posting fee will be 10% (1 - 0.90 = 0.10)*/
    marketFee: 0.1 // = 1 - inversePostingFee, added manually to avoid js missing float precision
};

module.exports = MarketConfiDef;
