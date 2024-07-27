"use strict";


var collider = require("./collider.js");
var EnumNpcs = require("./enumNPCs.js");

var npcSpawnersDefs = {
    'skeleto_7x7': {
        id: 'skeleto_7x7',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.esSkeleto,
        minNumberNpcs: 1,
        maxNumberNpcs: 2,
        respawnFrecuency: 15,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 10, //If there is no players inside spawner area

        area: {
            x: 7,
            y: 7
        },
        detectionArea: {
            checkFrecuency: 1.5,
            type: collider.Type.Aabb,
            hitbox: {
                x: 15,
                y: 15
            }
        }
    },
    'skeleto_5x5': {
        id: 'skeleto_5x5',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.esSkeleto,
        minNumberNpcs: 1,
        maxNumberNpcs: 1,
        respawnFrecuency: 15,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 10, //If there is no players inside spawner area

        area: {
            x: 5,
            y: 5
        },
        detectionArea: {
            checkFrecuency: 1.2,
            type: collider.Type.Aabb,
            hitbox: {
                x: 12,
                y: 12
            }
        }
    },
    'skeleto_3x3': {
        id: 'skeleto_3x3',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.esSkeleto,
        minNumberNpcs: 1,
        maxNumberNpcs: 1,
        respawnFrecuency: 15,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 10, //If there is no players inside spawner area

        area: {
            x: 3,
            y: 3
        },
        detectionArea: {
            checkFrecuency: 1,
            type: collider.Type.Aabb,
            hitbox: {
                x: 8,
                y: 8
            }
        }
    },
    'skeleto_3x3_dungeon': {
        id: 'skeleto_3x3_dungeon',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.esSkeleto,
        minNumberNpcs: 2,
        maxNumberNpcs: 2,
        respawnFrecuency: 15,
        forceNpcLevel: 2,
        respawnWhenNpcsAreDead: true,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 15, //If there is no players inside spawner area

        area: {
            x: 2,
            y: 2
        },
        detectionArea: {
            checkFrecuency: 1,
            type: collider.Type.Aabb,
            hitbox: {
                x: 8,
                y: 8
            }
        }
    },

    'orc_3x3': {
        id: 'orc_3x3',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.orc,
        minNumberNpcs: 1,
        maxNumberNpcs: 1,
        respawnFrecuency: 25,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 10, //If there is no players inside spawner area

        area: {
            x: 3,
            y: 3
        },
        detectionArea: {
            checkFrecuency: 1,
            type: collider.Type.Aabb,
            hitbox: {
                x: 8,
                y: 8
            }
        }
    },

    'orc_7x7_dungeon': {
        id: 'orc_7x7_dungeon',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.orc,
        minNumberNpcs: 2,
        maxNumberNpcs: 3,
        respawnFrecuency: 25,
        forceNpcLevel: 2,
        respawnWhenNpcsAreDead: true,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 15, //If there is no players inside spawner area

        area: {
            x: 7,
            y: 7
        },
        detectionArea: {
            checkFrecuency: 1,
            type: collider.Type.Aabb,
            hitbox: {
                x: 9,
                y: 9
            }
        }
    },

    'ghost_elf_5x5': {
        id: 'ghost_elf_5x5',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.ghost_elf,
        minNumberNpcs: 1,
        maxNumberNpcs: 1,
        respawnFrecuency: 25,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 15, //If there is no players inside spawner area

        area: {
            x: 5,
            y: 5
        },
        detectionArea: {
            checkFrecuency: 2,
            type: collider.Type.Aabb,
            hitbox: {
                x: 15,
                y: 15
            }
        }
    },

    'ghost_elf_5x5_dungeon': {
        id: 'ghost_elf_5x5_dungeon',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.ghost_elf,
        minNumberNpcs: 1,
        maxNumberNpcs: 1,
        respawnFrecuency: 25,
        forceNpcLevel: 2,
        respawnWhenNpcsAreDead: true,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 15, //If there is no players inside spawner area

        area: {
            x: 5,
            y: 5
        },
        detectionArea: {
            checkFrecuency: 2,
            type: collider.Type.Aabb,
            hitbox: {
                x: 15,
                y: 15
            }
        }
    },

    'test_spawner': {
        id: 'test_spawner',
        type: 'spawner',
        npcType: 'monster_' + EnumNpcs.esSkeleto,
        minNumberNpcs: 20,
        maxNumberNpcs: 30,
        respawnFrecuency: 5,
        //Npc will despawn alone, for now timeToDespawn is not being used
        timeToDespawn: 15, //If there is no players inside spawner area

        area: {
            x: 15,
            y: 15
        },
        detectionArea: {
            checkFrecuency: 2.5,
            type: collider.Type.Aabb,
            hitbox: {
                x: 20,
                y: 20
            }
        }
    }
};

module.exports = npcSpawnersDefs;
