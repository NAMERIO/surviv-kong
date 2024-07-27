"use strict";


var _values = require("./42e8eaed.js");

var _values2 = _interopRequireDefault(_values);

var _parseInt = require("./cefda370.js");

var _parseInt2 = _interopRequireDefault(_parseInt);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require("./9bc388c8.js");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("./160ad6a9.js");

var _entries2 = _interopRequireDefault(_entries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var GearDefs = require("./gearDefs.js");
var recycleData = require("./recycleData.js");

/**
 * 
 * @param {import('./../localization')} localization 
 * @param {*} perk 
 */
var getPerkText = function getPerkText(localization, perk) {
    if (perk.type === 'boon') {
        return localization.translate('gear-' + perk.boon + '-perk');
    }

    if (perk.type === 'protection') {
        var _perkText = localization.translate('gear-' + perk.type + '-perk');
        var attack = localization.translate('attack-type-' + perk.params.type);
        return _perkText.replace('[damage]', perk.params.protection).replace('[attack]', attack);
    }

    var perkText = localization.translate('gear-' + perk.type + '-perk');
    var statusEffect = localization.translate('status_effect-type-' + perk.params.type);
    return perkText.replace('[resistance]', perk.params.resistance).replace('[effect]', statusEffect);
};

var getGearItems = function getGearItems( /** @type {any[]} */items, /** @type {string} */gearType) {
    //Filter obtained items and gear definitions for current type (tab on armory)
    var userGearItems = items.filter(function (item) {
        return GearDefs[item.type] && GearDefs[item.type].type === gearType;
    });
    var gearDefs = (0, _entries2.default)(GearDefs).filter(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            key = _ref2[0],
            def = _ref2[1];

        return def.type === gearType;
    });

    var resGear = [];
    //Add to return variable all and obtained/unloked items and all definitions of not obtained items (to show locked)
    gearDefs.map(function (_ref3) {
        var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
            key = _ref4[0],
            definition = _ref4[1];

        var userItems = userGearItems.filter(function (_ref5) {
            var type = _ref5.type;
            return type === key;
        });

        if (!userItems || userItems.length < 1) {
            resGear.push({
                userItem: null,
                definition: definition
            });
        } else {
            //Add all obtained items of current type even if they are repeated
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(userItems), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var userItem = _step.value;

                    resGear.push({
                        userItem: userItem,
                        definition: definition
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
    });

    return resGear;
};

var getUniqueGearPerks = function getUniqueGearPerks(gear) {
    var perks = {};
    var levels = gear.definition.levels.filter(function ( /** @type {{ level: number; }} */level) {
        return gear.userItem.level >= level.level;
    });

    levels.forEach(function (level) {
        level.perks.forEach(function (perk) {
            if (perk.type === 'boon') {
                if (!perks[perk.boon]) {
                    perks[perk.boon] = (0, _assign2.default)({}, perk);
                }
            } else {
                var type = perk.type;
                var key = perk.type + '_' + perk.params.type;
                var existingPerk = perks[key];

                if (existingPerk) {
                    existingPerk.params[type] += (0, _parseInt2.default)(perk.params[type]);
                } else {
                    perks[key] = (0, _assign2.default)({}, perk, { params: (0, _assign2.default)({}, perk.params) });
                }
            }
        });
    });

    return (0, _values2.default)(perks);
};

var getRecycleValue = function getRecycleValue(gearDef, userItem) {
    var reqEssence = gearDef.levels[userItem.level - 1].requiredEssence;
    var recycleValue = reqEssence > 0 ? reqEssence * recycleData.fraction : recycleData.baseRecycleValue * recycleData.fraction;
    return Math.round(recycleValue);
};

module.exports = {
    getGearItems: getGearItems,
    getPerkText: getPerkText,
    getRecycleValue: getRecycleValue,
    getUniqueGearPerks: getUniqueGearPerks
};
