"use strict";


var _NpcDefinitions;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var v2 = require("./v2.js");
var EnumBTNodes = require("./enumBTNodes.js");
var EnumNpcs = require("./enumNPCs.js");
var collider = require("./collider.js");

var _require = require("./cb7a977d.js"),
    WeaponAttackType = _require.WeaponAttackType;

//
// Helpers
//


function tierLoot(tier, min, max, props) {
    props = props || {};
    return { tier: tier, min: min, max: max, props: props };
}

var NpcDefinitions = (_NpcDefinitions = {}, _defineProperty(_NpcDefinitions, 'monster_' + EnumNpcs.esSkeleto, {
    id: 'monster_' + EnumNpcs.esSkeleto,
    netId: EnumNpcs.esSkeleto,
    collidable: false,
    timeToDespawnWhenNotSeen: 5,

    //Colliders
    height: 2,
    damageCollider: {
        x: 1,
        y: 1.5
    },
    movementCollider: {
        x: 0.6,
        y: 0.4
    },
    movementColliderOffSet: {
        x: 0,
        y: -1.2
    },
    aggroArea: {
        type: collider.Type.Aabb,
        x: 9,
        y: 9
    },

    //Level based stats
    levels: [{
        exp: 2,
        health: 40,
        baseSpeed: 5,
        baseDamage: 7,
        obstacleMult: 0.5,
        probabilityToStagger: 0.5,
        loot: [tierLoot('tier_skeleto_1', 0.6, 1.6)]
    }, {
        exp: 3,
        health: 60,
        baseSpeed: 5.5,
        baseDamage: 12,
        obstacleMult: 0.6,
        probabilityToStagger: 0.45,
        loot: [tierLoot('tier_skeleto_2', 0.7, 1.7)]
    }, {
        exp: 4,
        health: 80,
        baseSpeed: 6,
        baseDamage: 18,
        obstacleMult: 0.7,
        probabilityToStagger: 0.4,
        loot: [tierLoot('tier_skeleto_3', 0.9, 1.9)]
    }],
    //If levels do not have the attribute monster will use defaults:
    defaultExp: 1,
    defaultDamageObstacleMult: 0.5,
    defaultInmuneToStaggerTime: 3.5,
    defaultProbabilityToStagger: 0.5,
    defaultLoot: [tierLoot('tier_skeleto_1', 0.5, 1.5)],

    spawnLootParams: {
        offset: v2.create(0.0, -1.0),
        speedMult: 1.0
    },

    //Attacks
    attacks: {
        //Level base damage will be added to attack damage
        1: {
            id: 1,
            type: 'melee',
            damage: 0,
            attackType: WeaponAttackType.Slashing,
            totalDuration: 2, //Match animation time

            hitbox: {
                x: 1.8,
                y: 2
            },
            offset: {
                x: 1.5,
                y: 0
            },
            damageTimes: [{
                start: 0.8,
                finish: 0.933
            }],

            //Visuals
            animObj: {
                animName: 'sword/light_attack',
                animDuration: 2, //Spine duration
                loop: false,
                track: 0,
                sound: {
                    name: 'sfx_monsters_skeleton_attack',
                    start: 0.8
                }
            }
        }
    },

    //FX
    healthBarOffset: v2.create(0, 2),
    spineData: 'esSkeleto',
    hitParticle: '',
    //explodeParticle: 'skitterBlood',
    npcStepInterval: 2, //For step sound
    hurtAnimObj: {
        animName: 'hurt',
        animDuration: 0.266, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_skeleton_hurt',
            start: 0
        }
    },
    spawnAnimObj: {
        animName: 'spawn',
        animDuration: 0.8, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_spawn'
        }
    },
    deathAnimObj: {
        notUseDirection: true,
        animName: 'death',
        animDuration: 1.065, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_skeleton_death',
            start: 0
        }
    },
    sound: {
        bullet: 'skitter_hit',
        punch: 'skitter_hit',
        explode: 'skitter_destroy_01',
        enter: 'none'
    },

    //AI behaviour 
    //TODO maybe create new definition file only for behaviour trees (?), so the npc base def can be more manageable
    behaviourTree: {
        root: {
            type: EnumBTNodes.BTRepeater,
            child: {
                type: EnumBTNodes.BTSequencer,
                children: [{
                    //Roam and search player
                    type: EnumBTNodes.BTParallelComplete,
                    children: [{
                        //Leaf
                        type: EnumBTNodes.BTRoam
                    }, {
                        //Leaf
                        type: EnumBTNodes.BTSearchPlayer,
                        params: {
                            frecuency: 0.5
                        }
                    }]
                }, {
                    //Wait and search player
                    type: EnumBTNodes.BTParallelComplete,
                    children: [{
                        //Leaf
                        type: EnumBTNodes.BTWait,
                        params: {
                            randomWait: true,
                            minTime: 1.5,
                            maxTime: 4
                        }
                    }, {
                        //Leaf
                        type: EnumBTNodes.BTSearchPlayer,
                        params: {
                            frecuency: 0.8
                        }
                    }]
                }, {
                    type: EnumBTNodes.BTSelector,
                    children: [{
                        //Chase and attack player when is in range
                        type: EnumBTNodes.BTRepeaterFailure,
                        child: {
                            type: EnumBTNodes.BTSequencer,
                            children: [{
                                //Leaf
                                type: EnumBTNodes.BTChaseTarget,
                                params: {
                                    approachDistance: 3, //To execute next action
                                    disengageTime: 4, //When player is outside aggro
                                    disengageDistance: 25
                                }
                            }, {
                                //Leaf
                                type: EnumBTNodes.BTAttackMelee,
                                params: {
                                    attackId: 1
                                }
                            }]
                        }
                    }, {
                        //Return to spawner and search player
                        type: EnumBTNodes.BTParallelComplete,
                        children: [{
                            //Leaf
                            type: EnumBTNodes.BTReturnToSpawner
                        }, {
                            //Leaf
                            type: EnumBTNodes.BTSearchPlayer,
                            params: {
                                frecuency: 0.6
                            }
                        }]
                    }]
                }]
            }
        }
    }
}), _defineProperty(_NpcDefinitions, 'monster_' + EnumNpcs.orc, {
    id: 'monster_' + EnumNpcs.orc,
    netId: EnumNpcs.orc,
    collidable: false,
    timeToDespawnWhenNotSeen: 5,

    //Colliders
    height: 2,
    damageCollider: {
        x: 1.5,
        y: 1.5
    },
    movementCollider: {
        x: 0.7,
        y: 0.4
    },
    movementColliderOffSet: {
        x: 0,
        y: -1.2
    },
    aggroArea: {
        type: collider.Type.Aabb,
        x: 9,
        y: 9
    },

    //Level based stats
    levels: [{
        exp: 5,
        health: 100,
        baseSpeed: 4,
        baseDamage: 20,
        obstacleMult: 0.5,
        probabilityToStagger: 0.45,
        loot: [tierLoot('tier_orc_1', 0.7, 1.7)]
    }, {
        exp: 6,
        health: 120,
        baseSpeed: 4.5,
        baseDamage: 26,
        obstacleMult: 0.6,
        probabilityToStagger: 0.35,
        loot: [tierLoot('tier_orc_2', 0.85, 1.85)]
    }, {
        exp: 7,
        health: 140,
        baseSpeed: 5,
        baseDamage: 32,
        obstacleMult: 0.7,
        probabilityToStagger: 0.25,
        loot: [tierLoot('tier_orc_3', 0.95, 1.95)]
    }],
    //If levels do not have the attribute monster will use defaults:
    defaultExp: 5,
    defaultDamageObstacleMult: 0.5,
    defaultInmuneToStaggerTime: 5,
    defaultProbabilityToStagger: 0.5,
    defaultLoot: [tierLoot('tier_orc_1', 0.75, 1.5)],

    spawnLootParams: {
        offset: v2.create(0.0, -1.0),
        speedMult: 1.0
    },

    //Attacks
    attacks: {
        //Level base damage will be added to attack damage
        1: {
            id: 1,
            type: 'melee',
            damage: 0,
            attackType: WeaponAttackType.Slashing,
            totalDuration: 2, //Match animation time

            hitbox: {
                x: 1.8,
                y: 2
            },
            offset: {
                x: 1.5,
                y: 0
            },
            damageTimes: [{
                start: 0.8,
                finish: 0.93
            }],

            //Visuals
            animObj: {
                animName: 'axe/light_attack',
                animDuration: 2, //Spine duration
                loop: false,
                track: 0,
                sound: {
                    name: 'sfx_monsters_orc_attack',
                    start: 0.8
                }
            }
        }
    },

    //FX
    healthBarOffset: v2.create(0, 2),
    spineData: 'orc',
    hitParticle: '',
    //explodeParticle: 'skitterBlood',
    hurtAnimObj: {
        animName: 'hurt',
        animDuration: 0.4, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_orc_hurt',
            start: 0
        }
    },
    spawnAnimObj: {
        animName: 'spawn',
        animDuration: 1, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_spawn'
        }
    },
    deathAnimObj: {
        notUseDirection: true,
        animName: 'death_side',
        animDuration: 0.6, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_orc_death',
            start: 0
        }
    },
    sound: {
        bullet: 'skitter_hit',
        punch: 'skitter_hit',
        explode: 'skitter_destroy_01',
        enter: 'none'
    },

    //AI behaviour 
    //TODO maybe create new definition file only for behaviour trees (?), so the npc base def can be more manageable
    behaviourTree: {
        root: {
            type: EnumBTNodes.BTRepeater,
            child: {
                type: EnumBTNodes.BTSequencer,
                children: [{
                    //Roam and search player
                    type: EnumBTNodes.BTParallelComplete,
                    children: [{
                        //Leaf
                        type: EnumBTNodes.BTRoam
                    }, {
                        //Leaf
                        type: EnumBTNodes.BTSearchPlayer,
                        params: {
                            frecuency: 0.5
                        }
                    }]
                }, {
                    //Wait and search player
                    type: EnumBTNodes.BTParallelComplete,
                    children: [{
                        //Leaf
                        type: EnumBTNodes.BTWait,
                        params: {
                            randomWait: true,
                            minTime: 1.5,
                            maxTime: 4
                        }
                    }, {
                        //Leaf
                        type: EnumBTNodes.BTSearchPlayer,
                        params: {
                            frecuency: 0.8
                        }
                    }]
                }, {
                    type: EnumBTNodes.BTSelector,
                    children: [{
                        //Chase and attack player when is in range
                        type: EnumBTNodes.BTRepeaterFailure,
                        child: {
                            type: EnumBTNodes.BTSequencer,
                            children: [{
                                //Leaf
                                type: EnumBTNodes.BTChaseTarget,
                                params: {
                                    approachDistance: 3, //To execute next action
                                    disengageTime: 4, //When player is outside aggro
                                    disengageDistance: 25
                                }
                            }, {
                                //Leaf
                                type: EnumBTNodes.BTAttackMelee,
                                params: {
                                    attackId: 1
                                }
                            }]
                        }
                    }, {
                        //Return to spawner and search player
                        type: EnumBTNodes.BTParallelComplete,
                        children: [{
                            //Leaf
                            type: EnumBTNodes.BTReturnToSpawner
                        }, {
                            //Leaf
                            type: EnumBTNodes.BTSearchPlayer,
                            params: {
                                frecuency: 0.6
                            }
                        }]
                    }]
                }]
            }
        }
    }
}), _defineProperty(_NpcDefinitions, 'monster_' + EnumNpcs.ghost_elf, {
    id: 'monster_' + EnumNpcs.ghost_elf,
    netId: EnumNpcs.ghost_elf,
    collidable: false,
    timeToDespawnWhenNotSeen: 5,

    //Colliders
    height: 2,
    damageCollider: {
        x: 1.1,
        y: 1.9
    },
    movementCollider: {
        x: 0.6,
        y: 0.5
    },
    movementColliderOffSet: {
        x: 0,
        y: -1.2
    },
    aggroArea: {
        type: collider.Type.Aabb,
        x: 15,
        y: 15
    },

    //Level based stats
    levels: [{
        exp: 3,
        health: 60,
        baseSpeed: 4,
        baseDamage: 2,
        obstacleMult: 0.5,
        probabilityToStagger: 0.5,
        loot: [tierLoot('tier_ghost_1', 0.7, 1.7)]
    }, {
        exp: 4,
        health: 80,
        baseSpeed: 4.5,
        baseDamage: 10,
        obstacleMult: 0.6,
        probabilityToStagger: 0.45,
        loot: [tierLoot('tier_ghost_2', 0.8, 1.8)]
    }, {
        exp: 5,
        health: 100,
        baseSpeed: 5,
        baseDamage: 18,
        obstacleMult: 0.7,
        probabilityToStagger: 0.4,
        loot: [tierLoot('tier_ghost_3', 0.9, 1.9)]
    }],
    //If levels do not have the attribute monster will use defaults:
    defaultExp: 3,
    defaultDamageObstacleMult: 0.5,
    defaultInmuneToStaggerTime: 3.5,
    defaultProbabilityToStagger: 0.5,
    defaultLoot: [tierLoot('tier_ghost_1', 0.5, 1.5)],

    spawnLootParams: {
        offset: v2.create(0.0, -1.0),
        speedMult: 1.0
    },

    //Attacks
    attacks: {
        //Level base damage will be added to attack damage
        1: {
            id: 1,
            type: 'range',
            damage: 0,
            jitter: 0,
            moveSpread: 0,
            shotSpread: 0,
            bulletCount: 1,
            barrelOffset: 0,
            barrelLength: 0.9,

            shootTime: 0.8,
            totalDuration: 2, //Match animation time

            //Bullet has attack type (Piercing, Slashing, Magic)
            bulletType: 'ghost_elf_projectile_1',
            bulletLevelBased: ['ghost_elf_projectile_1', 'ghost_elf_projectile_2', 'ghost_elf_projectile_3'],

            //Visuals
            animObj: {
                animName: 'light_attack',
                animDuration: 2, //Spine duration
                loop: false,
                track: 0,
                sound: {
                    name: 'sfx_monsters_ghostelf_attack',
                    start: 0.8
                }
            }
        }
    },

    //FX
    healthBarOffset: v2.create(0, 2.5),
    spineData: 'ghostElf',
    spinePivot: { x: 0.5, y: -6 },
    hitParticle: '',
    //explodeParticle: 'skitterBlood',
    hurtAnimObj: {
        animName: 'hurt',
        animDuration: 0.266, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_ghostelf_hurt',
            start: 0
        }
    },
    spawnAnimObj: {
        animName: 'spawn',
        animDuration: 0.8, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_spawn'
        }
    },
    deathAnimObj: {
        notUseDirection: true,
        animName: 'death',
        animDuration: 0.466, //Spine duration
        loop: false,
        track: 0,
        sound: {
            name: 'sfx_monsters_ghostelf_death',
            start: 0
        }
    },
    sound: {
        bullet: 'skitter_hit',
        punch: 'skitter_hit',
        explode: 'skitter_destroy_01',
        enter: 'none'
    },

    //AI behaviour 
    //TODO maybe create new definition file only for behaviour trees (?), so the npc base def can be more manageable
    behaviourTree: {
        root: {
            type: EnumBTNodes.BTRepeater,
            child: {
                type: EnumBTNodes.BTSequencer,
                children: [{
                    //Roam and search player
                    type: EnumBTNodes.BTParallelComplete,
                    children: [{
                        //Leaf
                        type: EnumBTNodes.BTRoam
                    }, {
                        //Leaf
                        type: EnumBTNodes.BTSearchPlayer,
                        params: {
                            frecuency: 1
                        }
                    }]
                }, {
                    //Wait and search player
                    type: EnumBTNodes.BTParallelComplete,
                    children: [{
                        //Leaf
                        type: EnumBTNodes.BTWait,
                        params: {
                            randomWait: true,
                            minTime: 1.5,
                            maxTime: 4
                        }
                    }, {
                        //Leaf
                        type: EnumBTNodes.BTSearchPlayer,
                        params: {
                            frecuency: 1.2
                        }
                    }]
                }, {
                    type: EnumBTNodes.BTSelector,
                    children: [{
                        //Chase and attack player when is in range
                        type: EnumBTNodes.BTRepeaterFailure,
                        child: {
                            type: EnumBTNodes.BTSequencer,
                            children: [{
                                //Leaf
                                type: EnumBTNodes.BTChaseTarget,
                                params: {
                                    approachDistance: 13, //To execute next action
                                    disengageTime: 5, //When player is outside aggro
                                    disengageDistance: 40,
                                    checkObstacles: true //Check obstacles between npc and player, if there are do not attack
                                }
                            }, {
                                //Leaf
                                type: EnumBTNodes.BTAttackRange,
                                params: {
                                    attackId: 1
                                }
                            }]
                        }
                    }, {
                        //Return to spawner and search player
                        type: EnumBTNodes.BTParallelComplete,
                        children: [{
                            //Leaf
                            type: EnumBTNodes.BTReturnToSpawner
                        }, {
                            //Leaf
                            type: EnumBTNodes.BTSearchPlayer,
                            params: {
                                frecuency: 1
                            }
                        }]
                    }]
                }]
            }
        }
    }
}), _NpcDefinitions);

module.exports = NpcDefinitions;
