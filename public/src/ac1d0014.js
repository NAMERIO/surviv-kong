"use strict";


var WeaponTypeInfo = {

    axe_type: {
        id: 'axe_type',
        difficulty: 1,
        playStyleDescription: "A raw aggressor that excels at keeping enemies close, pummeling them at point blank range.",
        crusher: "Plunge your axe to the ground, pulling all surrounding enemies closer to you.",
        leap: "Jump through the air, slamming the ground where you land.",
        cyclone: "Spin your axe continually while moving, attacking in an area around you.",
        weaponType: "Axe",
        damageType: "Slashing"

    },

    sword_type: {
        id: 'sword_type',
        difficulty: 2,
        playStyleDescription: "An all-rounder that uses distance to outlast opponents and punish those that get too close.",
        ironwall: "Summon a protective shield that reflects projectiles and damage.",
        estocade: "Lunge forward in a straight line, damaging enemies in your path.",
        sunderingstrike: "Create 3 large waves of cutting air that slowly move forward, dealing damage.",
        weaponType: "Sword & Shield",
        damageType: "Slashing"
    },

    staff_type: {
        id: 'staff_type',
        difficulty: 4,
        playStyleDescription: "A magical weapon that uses AoE effects and splash damage to control the battle from afar.",
        frostorb: "Shoot an exploding orb that leaves a patch of chilling ice.",
        trailoforbs: "Trail of Orbs",
        volatilesurge: "Volatile Surge",
        weaponType: "Staff",
        damageType: "Magic"
    },

    bow_type: {
        id: 'bow_type',
        difficulty: 3,
        playStyleDescription: "A glass cannon that uses precision and good timing to snipe far away opponents",
        nettrap: "Lay a trap below you that temporarily roots any foe who steps on it.",
        quickshot: "Dash forward while empowering your next arrow shot to its maximum.",
        piercingshot: "Fire a highly damaging arrow that can pass through almost any obstacle.",
        weaponType: "Bow",
        damageType: "Piercing"
    },

    dagger_type: {
        id: 'dagger_type',
        difficulty: 5,
        playStyleDescription: "A nimble attacker that uses stealth to deal quick bursts of damage before retreating back to safety",
        shadowstep: "Temporarily become invisible until you strike a foe.",
        backstab: "Poison a close enemy, then quickly dash in the opposite direction.",
        bladeflurry: "Execute multiple stabs in quick succession with a chance to bleed.",
        weaponType: "Dagger",
        damageType: "Piercing"
    },

    wand_type: {
        id: 'wand_type',
        difficulty: 2,
        playStyleDescription: "A quick combatant that uses explosive, short ranged attacks to deal constant damage.",
        fanoffireballs: "Shoot 5 short range projectiles in a cone that ignite opponents.",
        teleport: "Summon a damaging ring of energy around you, then teleport to a place nearby.",
        chillingburst: "Cast a wave of frost around you that damages and chills opponents.",
        weaponType: "Wand",
        damageType: "Magic"
    }

};

module.exports = WeaponTypeInfo;
