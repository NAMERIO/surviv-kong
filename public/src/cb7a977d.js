"use strict";


var _WeapongAttackTypeToS, _StatusEffectAttackTy, _WeaponAttackTypeEmoj;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WeaponAttackType = {
    //Important start on 1, for assert on WeaponManager to work
    Piercing: 0,
    Slashing: 1,
    Magic: 2
};

var WeapongAttackTypeToStr = (_WeapongAttackTypeToS = {}, _defineProperty(_WeapongAttackTypeToS, WeaponAttackType.Piercing, 'piercing'), _defineProperty(_WeapongAttackTypeToS, WeaponAttackType.Slashing, 'slashing'), _defineProperty(_WeapongAttackTypeToS, WeaponAttackType.Magic, 'magic'), _WeapongAttackTypeToS);

var StatusEffectAttackType = {
    Ignite: 0,
    Shock: 1,
    Poison: 2,
    Chill: 3,
    Blind: 4,
    Bleed: 5,
    Root: 6
};

var StatusEffectAttackTypeEmoji = (_StatusEffectAttackTy = {}, _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Ignite, '🔥 Ignite'), _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Shock, '⚡ Shock'), _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Poison, '🧪 Poison'), _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Chill, '🧊 Chill'), _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Blind, '🥽 Blind'), _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Bleed, '🩸 Bleed'), _defineProperty(_StatusEffectAttackTy, StatusEffectAttackType.Root, '🛑 Root'), _StatusEffectAttackTy);

var WeaponAttackTypeEmoji = (_WeaponAttackTypeEmoj = {}, _defineProperty(_WeaponAttackTypeEmoj, WeaponAttackType.Piercing, '🏹 Piercing'), _defineProperty(_WeaponAttackTypeEmoj, WeaponAttackType.Slashing, '🔪 Slashing'), _defineProperty(_WeaponAttackTypeEmoj, WeaponAttackType.Magic, '✨ Magic'), _WeaponAttackTypeEmoj);

var getAttackTypeLogStr = function getAttackTypeLogStr(attackType, statusEffect) {
    return statusEffect ? StatusEffectAttackTypeEmoji[attackType] : WeaponAttackTypeEmoji[attackType];
};

module.exports = {
    WeaponAttackType: WeaponAttackType,
    WeapongAttackTypeToStr: WeapongAttackTypeToStr,
    StatusEffectAttackType: StatusEffectAttackType,
    getAttackTypeLogStr: getAttackTypeLogStr
};
