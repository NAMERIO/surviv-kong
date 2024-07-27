"use strict";


/**
 * This enum has all the possible attacks/skills that the player can do
 */
var attacks = {
    //Important start on 1, for assert on WeaponManager to work
    NormalAttackRange: 1,
    NormalAttackMelee: 2,
    HeavyAttackStaff: 3,
    HeavyAttackSword: 4,
    DashAttackMelee: 5,
    ApplyEffectToNearbyEnemies: 6,
    CrusherAttack: 7,
    CycloneAttack: 8,
    DashAttackWithAnticipation: 9,
    VariableDamageRange: 10,
    ApplyStatusEffect: 11,
    DeployTrap: 12,
    OrbitalAttack: 13,
    BladeFlurryAttack: 14,

    RangeAttackSword: 15, //TODO change to do it with normal range attack
    CombineAttack: 16,
    ThrowablesAttack: 17
};

module.exports = attacks;
