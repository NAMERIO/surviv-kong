"use strict";


/**Default loot container scale 1.4
 * Default loot sprite scale 1.0
 * Params scale:1.4
 *        innerScale: 1.0
 */

var ThrowableDefs = {
    'bomb': {
        id: 'bomb',
        name: 'Bomb',
        type: 'throwable',
        slotMax: 3,
        quality: 0,
        explosionType: 'explosion_bomb',
        cookable: true,
        explodeOnImpact: false,
        playerCollision: false,
        fuseTime: 1,
        aimDistance: 0.0,
        rad: 0.5, //Collision radius, explosion radius is in explosions.js
        stats: 'Damage: {damage}',
        throwPhysics: {
            playerVelMult: 0.6,
            velZ: 5.0,
            speed: 10.0,
            spinVel: 8.0 * Math.PI,
            spinDrag: 1.0
        },
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        lootImg: {
            sprite: 'loot-bomb-01.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img', //'loot-circle-outer-01.img',
            borderTint: 0xffffff,
            innerScale: 0.7
        },
        worldImg: {
            sprite: 'proj-bomb.img',
            scale: 0.10,
            tint: 0xFFFFFF
        },
        handImg: {
            equip: {
                right: {
                    sprite: 'loot-throwable-bomb.img',
                    pos: { x: 4.2, y: 4.2 },
                    scale: 0.14
                },
                left: {
                    sprite: 'none'
                }
            },
            cook: {
                right: {
                    sprite: 'proj-frag-nopin-01.img',
                    pos: { x: 4.2, y: 4.2 },
                    scale: 0.14
                },
                left: {
                    sprite: 'proj-frag-pin-part.img',
                    pos: { x: 4.2, y: 4.2 },
                    scale: 0.14
                }
            },
            throwing: {
                right: {
                    sprite: 'none'
                },
                left: {
                    sprite: 'none'
                }
            }
        },
        useThrowParticles: true,
        sound: {
            pullPin: 'frag_pin_01',
            throwing: 'frag_throw_01',
            pickup: 'frag_pickup_01',
            deploy: 'frag_deploy_01'
        },
        spine: {
            equip: {
                skin: 'weapons/offhand/bomb/black'
            },
            throwing: {
                skin: null
            }
        },
        telegraph: {
            type: 'circular'
        }
    },
    'shuriken': {
        id: 'shuriken',
        name: 'Shuriken',
        type: 'throwable',
        slotMax: 10,
        quality: 0,
        bulletType: 'shuriken_projectile',
        stats: 'Damage: {damage}',
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        lootImg: {
            sprite: 'loot-shuriken-01.img',
            tint: 0xffffff,
            border: 'hexagon-frame-border.img', //'loot-circle-outer-01.img',
            borderTint: 0xffffff,
            innerScale: 0.65
        },
        handImg: {
            equip: {
                right: {
                    sprite: 'proj-frag-pin-01.img',
                    pos: { x: 4.2, y: 4.2 },
                    scale: 0.14
                },
                left: {
                    sprite: 'none'
                }
            },
            cook: {
                right: {
                    sprite: 'proj-frag-nopin-01.img',
                    pos: { x: 4.2, y: 4.2 },
                    scale: 0.14
                },
                left: {
                    sprite: 'proj-frag-pin-part.img',
                    pos: { x: 4.2, y: 4.2 },
                    scale: 0.14
                }
            },
            throwing: {
                right: {
                    sprite: 'none'
                },
                left: {
                    sprite: 'none'
                }
            }
        },
        useThrowParticles: true,
        sound: {
            pullPin: 'frag_pin_01',
            throwing: 'frag_throw_01',
            pickup: 'frag_pickup_01',
            deploy: 'frag_deploy_01'
        },
        spine: {
            equip: {
                skin: 'weapons/offhand/shuriken/ninja'
            },
            throwing: {
                skin: null
            }
        },
        telegraph: {
            type: 'arrow'
        }
    },
    'spark': {
        id: 'spark',
        name: 'Spark',
        type: 'throwable',
        quality: 0,
        stats: 'Damage: {damage}',
        explosionType: 'explosion_spark',
        inventoryOrder: 1,
        slotMax: 20,
        cookable: true,
        explodeOnImpact: false,
        playerCollision: false,
        fuseTime: 9999.0,
        aimDistance: 0.0,
        rad: 2.0, //Collision radius, explosion radius is in explosions.js
        buildTime: 0.0,
        noFriction: true,
        damageCollision: true,
        throwPhysics: {
            playerVelMult: 0.0,
            velZ: 0.0,
            speed: 10.0,
            spinVel: 0.0 * Math.PI,
            spinDrag: 0.0
        },
        speed: {
            equip: 0.0,
            attack: 0.0
        },
        lootImg: {
            sprite: 'loot-trail-orb.img',
            tint: 0x00FF00,
            border: 'loot-circle-outer-01.img',
            borderTint: 0x000000,
            scale: 0.2
        },
        worldImg: {
            sprite: 'loot-trail-orb.img',
            scale: 1.4,
            tint: 0xFFFFFF
        },
        spine: {
            equip: {
                skin: 'weapons/offhand/bomb/black'
            },
            throwing: {
                skin: null
            }
        },
        sound: {
            pullPin: 'frag_pin_01',
            throwing: 'frag_throw_01',
            pickup: 'frag_pickup_01',
            deploy: 'frag_deploy_01'
        }
    }
};

module.exports = ThrowableDefs;
