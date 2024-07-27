"use strict";


var Traps = {
    InmobilizePlayer: 1,
    StaticEnergyRing: 2,
    FrostOrb: 3

    //Max 7 if need more than 7 need to modify net.js 'setSerializeState' so it can sent a trap id greater than 7
};

module.exports = Traps;
