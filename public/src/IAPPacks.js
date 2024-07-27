"use strict";


var IAPPacks = {
     'gp_packs': {
          'pack_1': {
               id: 't10_hard',
               appStoreId: 'com.kongregate.mobile.survivio.t10_hard',
               playStoreId: 'com.kongregate.mobile.survivio.google.t10_hard',
               steamId: 1000,
               cost: 999, //USD
               description: '3000 Gold Coins',
               gp: 3000
          },
          'pack_2': {
               id: 't25_hard',
               appStoreId: 'com.kongregate.mobile.survivio.t25_hard',
               playStoreId: 'com.kongregate.mobile.survivio.google.t25_hard',
               steamId: 2000,
               cost: 2499, //USD
               description: '8300 (800 Bonus) Gold Coins',
               gp: 8300
          },
          'pack_3': {
               id: 't40_hard',
               appStoreId: 'com.kongregate.mobile.survivio.t40_hard',
               playStoreId: 'com.kongregate.mobile.survivio.google.t40_hard',
               steamId: 3000,
               cost: 3999, //USD
               description: '16000 (2800 Bonus) Gold Coins',
               gp: 16000
          },
          'pack_4': {
               id: 't60_hard',
               appStoreId: 'com.kongregate.mobile.survivio.t60_hard',
               playStoreId: 'com.kongregate.mobile.survivio.google.t60_hard',
               steamId: 4000,
               cost: 9999, //USD
               description: '53000 (13000 Bonus) Gold Coins',
               gp: 53000
          }
     },
     'lto_packs': {
          'pack_1': {
               id: 'lto_pack_1',
               cost: 2800,
               description: 'Small Bundle 2 Items',
               steamId: 5000,
               items: ['bayonet_woodland', 'emote_picassoface'], //Max 3
               off: 10,
               round: -8
          },
          'pack_2': {
               id: 'lto_pack_2',
               cost: 1780,
               steamId: 6000,
               description: 'Large Bundle 5 Items',
               items: ['emote_trollface', 'fist_frostpunch', 'boost_shuriken', 'heal_patch', 'outfitSunset'], //Max 6
               off: 20,
               round: 4
          }
     }
};

module.exports = IAPPacks;
