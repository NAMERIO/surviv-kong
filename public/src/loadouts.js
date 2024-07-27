"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// @ts-check
var GameConfig = require("./gameConfig.js");
var deepEqual = require("./deepEqual.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var math = require("./math.js");

var LoadoutTypes = {
    outfit: 'outfit',
    melee: 'melee',
    heal_effect: 'heal_effect',
    boost_effect: 'boost_effect',
    emote: 'emote',
    deathEffect: 'deathEffect',
    unlock: 'unlock',
    skin: 'skin',
    hair: 'hair',
    armor: 'armor',
    helmet: 'helmet',
    ring: 'ring'
};

var DefaultCrosshair = {
    type: '',
    color: 0xffffff,
    size: 1.0,
    stroke: 0.0
};

var getRandomDefaultAvatar = function getRandomDefaultAvatar() {
    var hairs = ['hair_femalelilu', 'hair_maledaper'];
    var skins = ['skin_femalelilu', 'skin_maledaper'];

    return {
        hair: hairs[Math.floor(Math.random() * hairs.length)],
        skin: skins[Math.floor(Math.random() * skins.length)]
    };
};

var DefaultArmor = {
    type: '',
    level: 1
};

var ItemStatus = {
    New: 0,
    Confirmed: 1,
    Ackd: 2
};

//
// loadouts
//
var loadouts = {
    ItemStatus: ItemStatus,
    validateLoadout: function validateLoadout(userLoadout) {
        var getGameType = function getGameType(type, gameType, defaultValue) {
            var def = GameObjectDefs[gameType];
            return def && def.type == type ? gameType : defaultValue;
        };
        var getColor = function getColor(color, defaultValue) {
            var val = parseInt(color);
            return Number.isNaN(val) ? defaultValue : val;
        };
        var getFloat = function getFloat(flt, defaultValue) {
            var val = parseFloat(flt);
            return Number.isNaN(val) ? defaultValue : val;
        };

        var getGear = function getGear( /** @type {{ type: string | number; level: string; }} */gear, gearType) {
            var def = GameObjectDefs[gear.type];

            if (def && def.type === gearType) {
                return {
                    type: gear.type,
                    level: math.clamp(parseInt(gear.level), 1, def.levels.length)
                };
            }
            return DefaultArmor;
        };

        var getEmotes = function getEmotes(loadout) {
            var emotes = [];
            var defaultEmotes = GameConfig.defaultEmoteLoadout.slice();

            for (var i = 0; i < GameConfig.EmoteSlot.Count; i++) {
                var inputEmote = i < loadout.emotes.length ? loadout.emotes[i] : '';
                var emote = getGameType('emote', inputEmote, defaultEmotes[i]);
                emotes.push(emote);
            }
            return emotes;
        };

        var defaultAvatar = getRandomDefaultAvatar();

        var mergedLoadout = Object.assign({}, {
            crosshair: DefaultCrosshair,
            emotes: [],
            avatar: defaultAvatar,
            armor: DefaultArmor,
            helmet: DefaultArmor,
            ring: DefaultArmor
        }, userLoadout);

        var validatedLoadout = {
            outfit: getGameType(LoadoutTypes.outfit, mergedLoadout.outfit, 'outfitBase'),
            melee: getGameType(LoadoutTypes.melee, mergedLoadout.melee, 'fists'),
            heal: getGameType(LoadoutTypes.heal_effect, mergedLoadout.heal, 'heal_basic'),
            boost: getGameType(LoadoutTypes.boost_effect, mergedLoadout.boost, 'boost_basic'),
            player_icon: getGameType(LoadoutTypes.emote, mergedLoadout.player_icon, ''),
            crosshair: {
                type: getGameType(LoadoutTypes.crosshair, mergedLoadout.crosshair.type, 'crosshair_default'),
                color: getColor(mergedLoadout.crosshair.color, 0xffffff),
                size: getFloat(mergedLoadout.crosshair.size, 1.0).toFixed(2),
                stroke: getFloat(mergedLoadout.crosshair.stroke, 0.0).toFixed(2)
            },
            deathEffect: getGameType(LoadoutTypes.deathEffect, mergedLoadout.deathEffect, 'regularDeath'),
            emotes: getEmotes(mergedLoadout),
            avatar: {
                skin: getGameType(LoadoutTypes.skin, mergedLoadout.avatar.skin, defaultAvatar.skin),
                hair: getGameType(LoadoutTypes.hair, mergedLoadout.avatar.hair, defaultAvatar.hair)
            },
            armor: getGear(mergedLoadout.armor, LoadoutTypes.armor),
            helmet: getGear(mergedLoadout.helmet, LoadoutTypes.helmet),
            ring: getGear(mergedLoadout.ring, LoadoutTypes.ring)
        };

        return validatedLoadout;
    },

    validateWithAvailableItems: function validateWithAvailableItems(userLoadout, userItems) {
        var checkTypeExists = function checkTypeExists(type, items) {
            return type && items.findIndex(function (x) {
                return x.type == type;
            }) !== -1 ? type : '';
        };

        var loadout = Object.assign({}, {
            crosshair: {},
            emotes: [],
            armor: {},
            helmet: {},
            ring: {},
            avatar: {}
        }, userLoadout);

        loadout.outfit = checkTypeExists(loadout.outfit, userItems);
        loadout.melee = checkTypeExists(loadout.melee, userItems);
        loadout.heal = checkTypeExists(loadout.heal, userItems);
        loadout.boost = checkTypeExists(loadout.boost, userItems);
        loadout.player_icon = checkTypeExists(loadout.player_icon, userItems);
        loadout.crosshair.type = checkTypeExists(loadout.crosshair.type, userItems);
        loadout.armor.type = checkTypeExists(loadout.armor.type, userItems);
        loadout.helmet.type = checkTypeExists(loadout.helmet.type, userItems);
        loadout.ring.type = checkTypeExists(loadout.ring.type, userItems);
        loadout.deathEffect = checkTypeExists(loadout.deathEffect, userItems);

        //console.log('loadout',loadout);

        for (var i = 0; i < loadout.emotes.length; i++) {
            loadout.emotes[i] = checkTypeExists(loadout.emotes[i], userItems);
        }

        return loadouts.validateLoadout(loadout);
    },

    validateGearLoadouts: function validateGearLoadouts(loadout, loadoutIds, userItems) {
        var keys = ['helmet', 'armor', 'ring'];

        var loadoutCopy = Object.assign({}, loadout);

        keys.forEach(function (key) {
            var loadoutId = loadoutIds[key];
            var userItem = loadoutId !== '0' ? userItems.find(function (item) {
                return item.id === loadoutId;
            }) : null;

            if (userItem) {
                var def = GameObjectDefs[userItem.type];

                if (!def || def.type !== key) {
                    return;
                }

                loadoutCopy[key] = {
                    level: math.clamp(parseInt(userItem.level), 1, def.levels.length),
                    type: userItem.type
                };
            }
        });

        return loadoutCopy;
    },

    validateLoadoutIds: function validateLoadoutIds(loadoutIds) {
        var keys = ['outfit', 'melee', 'heal', 'boost', 'emotes', 'deathEffect', 'armor', 'helmet', 'ring'];

        var getEmotesIds = function getEmotesIds(ids) {
            var emotes = [];
            for (var i = 0; i < GameConfig.EmoteSlot.Count; i++) {
                var emoteId = ids.emotes && ids.emotes[i] ? ids.emotes[i] : "0";
                emotes.push(emoteId);
            }
            return emotes;
        };

        if (loadoutIds) {
            return keys.reduce(function (loadout, key) {
                var keyValue = key === 'emotes' ? getEmotesIds(loadout) : loadout[key] ? loadout[key] : "0";
                return Object.assign({}, loadout, _defineProperty({}, key, keyValue));
            }, loadoutIds);
        }
        return this.defaultLoadoutIds();
    },

    defaultLoadoutStats: function defaultLoadoutStats() {
        var defaultStats = { makr: 'No stats', kills: '-1', levels: '-1', wins: '-1' };
        var loadout = { heal: defaultStats, boost: defaultStats, melee: defaultStats, outfit: defaultStats, deathEffect: defaultStats, emote: [] };

        for (var i = 0; i < 6; i++) {
            loadout.emote.push(defaultStats);
        }

        return loadout;
    },

    defaultLoadout: function defaultLoadout() {
        return loadouts.validateLoadout({});
    },

    defaultLoadoutIds: function defaultLoadoutIds() {
        var loadout = {
            outfit: "0",
            melee: "0",
            heal: "0",
            boost: "0",
            emotes: [],
            deathEffect: "0",
            armor: "0",
            helmet: "0",
            ring: "0"
        };

        for (var i = 0; i < GameConfig.EmoteSlot.Count; i++) {
            loadout.emotes.push("0");
        }

        return loadout;
    },

    modified: function modified(a, b) {
        return !deepEqual(a, b);
    },

    getUserAvailableItems: function getUserAvailableItems(userItems) {
        var items = [];

        // Add default items
        var unlockDefaultType = 'unlocks_bha_default';
        var unlockDefaultDef = GameObjectDefs[unlockDefaultType];

        for (var i = 0; i < unlockDefaultDef.unlocks.length; i++) {
            var unlock = unlockDefaultDef.unlocks[i];
            items.push({
                type: unlock,
                source: unlockDefaultType,
                timeAcquired: 0,
                ackd: loadouts.ItemStatus.Ackd
            });
        }

        // Add user items
        for (var _i = 0; _i < userItems.length; _i++) {
            items.push(userItems[_i]);
        }

        return items;
        //return userItems;
    },

    isValidStatus: function isValidStatus(status) {
        return Object.values(ItemStatus).indexOf(status) !== -1;
    },

    LoadoutTypes: LoadoutTypes
};

module.exports = loadouts;
