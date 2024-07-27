"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MaxBoonsByName;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GearDefs = require("./gearDefs.js");

var _require = require("./bfe8e4c6.js"),
    createBoon = _require.createBoon,
    BoonNames = _require.BoonNames,
    createBoonById = _require.createBoonById,
    BoonIdToName = _require.BoonIdToName,
    BoonNameToId = _require.BoonNameToId;

var _require2 = require("./cb7a977d.js"),
    getAttackTypeLogStr = _require2.getAttackTypeLogStr;

var MainHandWeaps = require("./mainHandWeaps.js");

var _require3 = require("./math.js"),
    clamp = _require3.clamp;

var MaxBoonsByName = (_MaxBoonsByName = {}, _defineProperty(_MaxBoonsByName, BoonNames.ExtraPouch, 3), _defineProperty(_MaxBoonsByName, BoonNames.ElvishMetal, 1), _defineProperty(_MaxBoonsByName, BoonNames.HealersKit, 1), _defineProperty(_MaxBoonsByName, BoonNames.AGoodStart, 3), _MaxBoonsByName);

/**
 * 
 * @param {any[]} arr 
 * @param {number} amount 
 * @returns 
 */
function getRandom(arr, amount) {
    var result = new Array(amount);
    var len = arr.length;
    var taken = new Array(len);
    if (amount > len) throw new RangeError("getRandom: more elements taken than available");
    while (amount--) {
        var x = Math.floor(Math.random() * len);
        result[amount] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

var GearPerksController = function () {

    /**
     * 
     * @param {import('./player').Player} player 
     */
    function GearPerksController(player, isRunningOnClient) {
        _classCallCheck(this, GearPerksController);

        this.player = player;
        this.protectionPerks = [];
        this.resistancePerks = [];
        this.boons = [];
        this.armorDef = null;
        this.loadout = null;
        this.armor = null;
        this.helmet = null;
        this.ring = null;
        this.isRunningOnClient = isRunningOnClient;
        this.boonsCountByName = {};
        this.clientsBoons = new Map();
        this.selectionWeapons = [];
    }

    _createClass(GearPerksController, [{
        key: 'init',
        value: function init(loadout) {
            this.loadout = loadout;
            this.armor = loadout.armor;
            this.helmet = loadout.helmet;
            this.ring = loadout.ring;
            this.protectionPerks = [];
            this.resistancePerks = [];
            this.boons = [];
            //console.log(`[GearPerksController].init Player ${this.player.__id}, loadout`, this.loadout);

            var armorDef = this.armor ? GearDefs[this.armor.type] : null;
            if (armorDef) {
                this.initGearItemPerks(this.armor, armorDef);
            }
            var helmetDef = this.helmet ? GearDefs[this.helmet.type] : null;
            if (helmetDef) {
                this.initGearItemPerks(this.helmet, helmetDef);
            }
            var ringDef = this.ring ? GearDefs[this.ring.type] : null;
            if (ringDef) {
                this.initGearItemPerks(this.ring, ringDef);
            }

            //console.log(`[GearPerksController].init Player ${this.player.__id}`);
            //console.log(`Perks`);
            //console.log('Loadout', this.loadout);
            /*console.table([...this.protectionPerks, ...this.resistancePerks].map((perk) => {
                return Object.assign({}, perk, Object.assign({}, perk.params, {
                        type: getAttackTypeLogStr(perk.params.type, perk.type === 'resistance')
                    })
                );
            }));*/

            //console.table(this.boons.map(boon => ({ active: boon.active, boon: BoonIdToName[boon.id]})));
        }
    }, {
        key: 'initGearItemPerks',
        value: function initGearItemPerks(gear, gearDef) {
            var _this = this;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = gearDef.levels[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var level = _step.value;

                    if (gear.level < level.level) {
                        break;
                    }
                    var protectionPerks = level.perks.filter(function (_ref) {
                        var type = _ref.type;
                        return type === 'protection';
                    });
                    var resistancePerks = level.perks.filter(function (_ref2) {
                        var type = _ref2.type;
                        return type === 'resistance';
                    });
                    var boons = level.perks.filter(function (_ref3) {
                        var type = _ref3.type;
                        return type === 'boon';
                    });
                    this.protectionPerks = [].concat(_toConsumableArray(this.protectionPerks), _toConsumableArray(protectionPerks));
                    this.resistancePerks = [].concat(_toConsumableArray(this.resistancePerks), _toConsumableArray(resistancePerks));
                    boons.forEach(function (boonData) {
                        return _this.addBoon(boonData);
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'addBoon',
        value: function addBoon(boonData) {
            var count = this.boonsCountByName[boonData.boon] || 0;
            this.boonsCountByName[boonData.boon] = count;

            if (count >= MaxBoonsByName[boonData.boon]) {
                return;
            }

            var boonInstance = createBoon(boonData.boon, this.player, this.isRunningOnClient);

            if (!boonInstance) {
                return;
            }
            this.boonsCountByName[boonData.boon] = count + 1;
            this.boons.push(boonInstance);
            //console.log(`[GearPerksController].addBoon Player ${this.player.__id}`, boonData);
        }
    }, {
        key: 'initBoons',
        value: function initBoons() {
            this.boons.forEach(function (boon) {
                return boon.start();
            });
        }

        /**
         * 
         * @param {number} attackType 
         * @returns {number}
         */

    }, {
        key: 'getAttackTypeDamageProtection',
        value: function getAttackTypeDamageProtection(attackType) {
            var perks = this.protectionPerks.filter(function (_ref4) {
                var type = _ref4.params.type;
                return type === attackType;
            });
            var damageProtectionTotal = perks.reduce(function (total, _ref5) {
                var protection = _ref5.params.protection;
                return total + protection;
            }, 0);
            return damageProtectionTotal;
        }

        /**
         * 
         * @param {number} effectAttackType 
         * @returns {number}
         */

    }, {
        key: 'getStatusEffectResistance',
        value: function getStatusEffectResistance(effectAttackType) {
            var perks = this.resistancePerks.filter(function (_ref6) {
                var type = _ref6.params.type;
                return type === effectAttackType;
            });
            var percentageProtection = perks.reduce(function (total, _ref7) {
                var resistance = _ref7.params.resistance;
                return total + resistance;
            }, 0);
            return percentageProtection;
        }
    }, {
        key: 'getBoon',
        value: function getBoon(boonType) {
            return this.boons.filter(function (_ref8) {
                var type = _ref8.type;
                return type === boonType;
            });
        }
    }, {
        key: 'getBoons',
        value: function getBoons() {
            return this.boons;
        }
    }, {
        key: 'update',
        value: function update(dt) {
            if (this.isRunningOnClient && this.player.SpineObjManager) {
                this.clientsBoons.forEach(function (boon) {
                    return boon.update(dt);
                });
            } else {
                this.boons.forEach(function (boon) {
                    return boon.update(dt);
                });
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.clientsBoons.forEach(function (boon) {
                return boon.stop();
            });
        }
    }, {
        key: 'render',
        value: function render(camera, debug, debugLines) {
            this.clientsBoons.forEach(function (boon) {
                return boon.render(camera, debug, debugLines);
            });
        }
    }, {
        key: 'updateClientBoons',
        value: function updateClientBoons(boonsData) {
            var _this2 = this;

            boonsData.forEach(function (boonData, index) {
                var existingBoon = _this2.clientsBoons.get(index);

                if (existingBoon) {
                    existingBoon.updateData(boonData);
                    return;
                }

                var newBoon = createBoonById(boonData.id, _this2.player, _this2.isRunningOnClient, {});

                if (newBoon) {
                    _this2.clientsBoons.set(index, newBoon);
                }
            });
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }, {
        key: 'getSelectionWeapons',
        value: function getSelectionWeapons() {
            //@TODO: Move this to another file
            var rarities = ['common', 'rare', 'epic'];
            //@TODO: Add this flag to the weapon definition
            var commonWeapons = ['staff_elderwood', 'sword_broadstrike', 'dagger_dirk', 'bow_spiritshot', 'axe_sever', 'wand_stardust'];
            var rarityIndex = 0;
            var initialRarity = rarities[rarityIndex];
            var allWeapons = Object.entries(MainHandWeaps).map(function (_ref9) {
                var _ref10 = _slicedToArray(_ref9, 2),
                    _ = _ref10[0],
                    def = _ref10[1];

                return def;
            });
            var weapons = allWeapons.filter(function (weapon) {
                return weapon.rarity === initialRarity && (initialRarity === 'common' && commonWeapons.includes(weapon.id) || initialRarity !== 'common');
            });
            var availableWeapons = getRandom(weapons, 3);
            var nextRarityChance = this.boons.filter(function (boon) {
                return boon.id === BoonNameToId[BoonNames.AGoodStart];
            }).reduce(function (sum, boon) {
                return boon.chance + sum;
            }, 0);

            if (nextRarityChance === 0) {
                return availableWeapons.map(function (weapon) {
                    return weapon.id;
                });
            }
            var chance = clamp(nextRarityChance, 0, 1);
            var chancePercentaje = chance * 100;
            var randomChance = Math.floor(Math.random() * Math.floor(101));
            var selectionWeapons = [].concat(_toConsumableArray(availableWeapons));
            //console.log({chancePercentaje, randomChance }); 
            if (randomChance <= chancePercentaje) {
                var _availableWeapons = _slicedToArray(availableWeapons, 2),
                    first = _availableWeapons[0],
                    second = _availableWeapons[1];

                var nextRarityIndex = Math.min(rarities.length - 1, rarityIndex + 1);
                var nextRarityWeapons = allWeapons.filter(function (weapon) {
                    return weapon.rarity === rarities[nextRarityIndex];
                });

                var _getRandom = getRandom(nextRarityWeapons, 1),
                    _getRandom2 = _slicedToArray(_getRandom, 1),
                    third = _getRandom2[0];

                selectionWeapons = [first, second, third];
            }
            var weaponsIds = selectionWeapons.map(function (weapon) {
                return weapon.id;
            });
            //console.log(weaponsIds);
            return weaponsIds;
        }
    }, {
        key: 'setSelectionWeapons',
        value: function setSelectionWeapons(weapons) {
            this.selectionWeapons = weapons;
        }
    }]);

    return GearPerksController;
}();

module.exports = GearPerksController;
