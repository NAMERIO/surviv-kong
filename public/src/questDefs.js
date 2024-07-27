"use strict";


var EnumQuests = {
    daily: 0,
    survivedTime: 1,

    killPlayers: 2,
    killSkeletos: 3,
    killOrcs: 4,
    killGhostElf: 5,

    destroyCrates: 6,
    destroyFurniture: 7
    //Max 31
    //Need to modify net for more than 31
};

var kQuestDefs = {
    // PVP
    'quest_survived': {
        id: EnumQuests.survivedTime,
        type: 'quest',
        category: 'pvp',
        targetMin: 10 * 60,
        targetMax: 20 * 60,
        xpMin: 10,
        xpMax: 20,
        essenceMin: 240,
        essenceMax: 480,
        timed: true,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_kill_players': {
        id: EnumQuests.killPlayers,
        type: 'quest',
        category: 'pvp',
        targetMin: 5,
        targetMax: 10,
        xpMin: 30,
        xpMax: 60,
        essenceMin: 720,
        essenceMax: 1440,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_kill_skeletos': {
        id: EnumQuests.killSkeletos,
        type: 'quest',
        category: 'pvp',
        targetMin: 20,
        targetMax: 40,
        xpMin: 14,
        xpMax: 28,
        essenceMin: 336,
        essenceMax: 672,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_kill_orcs': {
        id: EnumQuests.killOrcs,
        type: 'quest',
        category: 'pvp',
        targetMin: 10,
        targetMax: 15,
        xpMin: 24,
        xpMax: 36,
        essenceMin: 576,
        essenceMax: 864,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_kill_ghost_elf': {
        id: EnumQuests.killGhostElf,
        type: 'quest',
        category: 'pvp',
        targetMin: 10,
        targetMax: 15,
        xpMin: 21,
        xpMax: 32,
        essenceMin: 509,
        essenceMax: 768,
        img: '../img/quests/icon-quest-easy.png'
    },

    // Destruction
    'quest_crates': {
        id: EnumQuests.destroyCrates,
        type: 'quest',
        category: 'destruction',
        target: 25,
        targetMin: 12,
        targetMax: 30,
        xpMin: 8,
        xpMax: 20,
        essenceMin: 192,
        essenceMax: 480,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_furniture': {
        id: EnumQuests.destroyFurniture,
        type: 'quest',
        category: 'destruction',
        target: 10,
        targetMin: 80,
        targetMax: 120,
        xpMin: 13,
        xpMax: 20,
        essenceMin: 317,
        essenceMax: 480,
        img: '../img/quests/icon-quest-easy.png'
    },

    // Damage
    /*'quest_damage_grenade': {
        type: 'quest',
        category: 'damage',
        target: 100,
        targetMin: 50,
        targetMax: 250,
        xpMin: 125,
        xpMax: 250,
        essenceMin: 125,
        essenceMax: 250,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_damage_melee': {
        type: 'quest',
        category: 'damage',
        target: 150,
        targetMin: 50,
        targetMax: 250,
        xpMin: 125,
        xpMax: 250,
        essenceMin: 125,
        essenceMax: 250,
        img: '../img/quests/icon-quest-easy.png'
    },*/

    // Item use
    /*'quest_heal': {
        type: 'quest',
        category: 'item',
        target: 10,
        targetMin: 10,
        targetMax: 25,
        xpMin: 125,
        xpMax: 250,
        essenceMin: 125,
        essenceMax: 250,
        img: '../img/quests/icon-quest-easy.png'
    },
    'quest_boost': {
        type: 'quest',
        category: 'item',
        target: 10,
        targetMin: 3,
        targetMax: 10,
        xpMin: 125,
        xpMax: 250,
        essenceMin: 125,
        essenceMax: 250,
        img: '../img/quests/icon-quest-easy.png'
    },*/

    //Not in the quest pool (deactivated)
    /*'quest_top_solo': {
        type: 'quest',
        category: 'top',
        target: 2,
        xp: 30
    },
    'quest_top_squad': {
        type: 'quest',
        category: 'top',
        target: 2,
        xp: 30
    },'quest_kills_hard': {
        type: 'quest',
        category: 'pvp',
        target: 10,
        xp: 40
    },
    'quest_damage': {
        type: 'quest',
        category: 'pvp',
        target: 750,
        xp: 30
    },
    'quest_damage_hard': {
        type: 'quest',
        category: 'pvp',
        target: 1500,
        xp: 40
    },'quest_airdrop': {
        type: 'quest',
        category: 'item',
        target: 1,
        xp: 30
    },
    'quest_club_kills': {
        type: 'quest',
        category: 'location',
        target: 2,
        xp: 40
    }*/

    //Fixed daily quest
    'quest_daily': {
        id: EnumQuests.daily,
        type: 'quest',
        banFromPool: true,
        category: 'daily',
        xp: 30,
        essence: 100
    }
};

module.exports = { kQuestDefs: kQuestDefs, EnumQuests: EnumQuests };
