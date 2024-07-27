"use strict";


var DeathEffects = {
    'regularDeath': {
        name: 'Standard Death',
        type: 'deathEffect',
        isParticle: true,
        lootImg: {
            sprite: 'loot-deathEffect-icon.img'
        },
        worldImg: {
            sprite: 'loot-deathEffect-icon.img'
        },
        rarity: 0
    },
    'turkeyFeathersDeath': {
        name: 'Turkey Feathers',
        type: 'deathEffect',
        particle: 'turkeyFeathersDeath',
        isParticle: true,
        lootImg: {
            sprite: 'loot-perk-turkey_shoot.img'
        },
        worldImg: {
            sprite: 'loot-perk-turkey_shoot.img'
        },
        rarity: 3
    },
    'cupidDeath': {
        name: 'Cupid Hearts',
        type: 'deathEffect',
        particle: 'cupidDeath',
        isParticle: true,
        lootImg: {
            sprite: 'loot-perk-cupid.img'
        },
        worldImg: {
            sprite: 'loot-perk-cupid.img'
        },
        rarity: 3
    },
    'blackHoleDeath': {
        name: 'Black Hole',
        type: 'deathEffect',
        particle: 'blackHoleDeath',
        sprites: ['part-black-hole-09.img', 'part-black-hole-08.img', 'part-black-hole-07.img', 'part-black-hole-06.img', 'part-black-hole-05.img', 'part-black-hole-04.img', 'part-black-hole-03.img', 'part-black-hole-02.img', 'part-black-hole-01.img'],
        isParticle: false,
        animationSpeed: 0.15,
        animationScale: 1.2,
        lootImg: {
            sprite: 'loot-black-hole.img'
        },
        worldImg: {
            sprite: 'loot-black-hole.img'
        },
        rarity: 4
    },
    'bloodExplosionDeath': {
        name: 'Blood Explosion',
        type: 'deathEffect',
        particle: 'bloodExplosionDeath',
        sprites: ['part-blood-explosion-01.img', 'part-blood-explosion-02.img', 'part-blood-explosion-03.img', 'part-blood-explosion-04.img', 'part-blood-explosion-05.img', 'part-blood-explosion-06.img', 'part-blood-explosion-07.img', 'part-blood-explosion-08.img', 'part-blood-explosion-09.img', 'part-blood-explosion-10.img'],
        isParticle: false,
        animationSpeed: 0.25,
        animationScale: 0.7,
        lootImg: {
            sprite: 'loot-blood-explosion.img'
        },
        worldImg: {
            sprite: 'loot-blood-explosion.img'
        },
        rarity: 5
    },
    'magicSparkDeath': {
        name: 'Magic Sparks',
        type: 'deathEffect',
        particle: 'magicSparkDeath',
        isParticle: true,
        lootImg: {
            sprite: 'loot-magic-spark.img'
        },
        worldImg: {
            sprite: 'loot-magic-spark.img'
        },
        rarity: 5
    },
    'toonBlastDeath': {
        name: 'Toon Blast',
        type: 'deathEffect',
        particle: 'explosiveDeath',
        sprites: ['death-explosive-1.img', 'death-explosive-2.img', 'death-explosive-3.img', 'death-explosive-4.img', 'death-explosive-5.img', 'death-explosive-6.img', 'death-explosive-7.img', 'death-explosive-8.img'],
        isParticle: false,
        animationSpeed: 0.2,
        animationScale: 1.3,
        lootImg: {
            sprite: 'loot-explosive-death.img'
        },
        worldImg: {
            sprite: 'loot-explosive-death.img'
        },
        rarity: 2
    },
    'billionaireDeath': {
        name: 'Billionaire',
        type: 'deathEffect',
        particle: 'billionaireDeath',
        isParticle: true,
        lootImg: {
            sprite: 'loot-billionaire-death.img'
        },
        worldImg: {
            sprite: 'loot-billionaire-death.img'
        },
        rarity: 5
    },
    'sparklyDeath': {
        name: 'Mr Sparkles',
        type: 'deathEffect',
        particle: 'sparklyDeath',
        isParticle: true,
        minParticules: 45,
        maxParticules: 55,
        lootImg: {
            sprite: 'loot-sparkly-death.img'
        },
        worldImg: {
            sprite: 'loot-sparkly-death.img'
        },
        rarity: 5
    },
    'confettiDeath': {
        name: 'Confetti',
        type: 'deathEffect',
        particle: 'confettiDeath',
        isParticle: true,
        minParticules: 150,
        maxParticules: 150,
        lootImg: {
            sprite: 'loot-confetti-death.img'
        },
        worldImg: {
            sprite: 'loot-confetti-death.img'
        },
        rarity: 5
    },
    'potatoBlastDeath': {
        name: 'Potato Blast',
        type: 'deathEffect',
        particle: 'potatoBlastDeath',
        isParticle: true,
        minParticules: 45,
        maxParticules: 55,
        lootImg: {
            sprite: 'loot-potato-blast-death.img'
        },
        worldImg: {
            sprite: 'loot-potato-blast-death.img'
        },
        rarity: 4
    }
};

module.exports = DeathEffects;
