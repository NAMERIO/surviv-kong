"use strict";


var PIXI = require("./pixi.js");
var collider = require("./collider.js");
var coldet = require("./coldet.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");

var ExplosionDefs = require("./explosionDefs.js");

var kMaxSpineObjects = 20;
//
// Explosion defs
//
var Defs = {
    'frag': {
        burst: {
            particle: 'explosionBurst',
            scale: 1.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 10,
        shakeStr: 0.2,
        shakeDur: 0.35,
        lifetime: 2.0
    },
    'smoke': {
        burst: {
            particle: 'explosionBurst',
            scale: 0.0,
            sound: {
                grass: 'explosion_smoke_01',
                water: 'explosion_smoke_01'
            }
        },
        rippleCount: 10,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 6.0
    },
    'strobe': {
        burst: {
            particle: 'explosionBurst',
            scale: 0.25,
            sound: {
                grass: 'explosion_04',
                water: 'explosion_02'
            }
        },
        rippleCount: 3,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 2.0
    },
    'barrel': {
        burst: {
            particle: 'explosionBurst',
            scale: 1.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 10,
        shakeStr: 0.2,
        shakeDur: 0.35,
        lifetime: 2.0
    },
    'usas': {
        burst: {
            particle: 'explosionUSAS',
            scale: 0.75,
            sound: {
                grass: 'explosion_03',
                water: 'explosion_02'
            }
        },
        rippleCount: 10,
        shakeStr: 0.12,
        shakeDur: 0.25,
        lifetime: 1.25
    },
    'rounds': {
        burst: {
            particle: 'explosionRounds',
            scale: 0.32,
            sound: {
                grass: 'explosion_04',
                water: 'explosion_04',
                detune: 500,
                volume: 0.5
            }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'rounds_sg': {
        burst: {
            particle: 'explosionRounds',
            scale: 0.32,
            sound: {
                grass: 'explosion_04',
                water: 'explosion_04',
                detune: 500,
                volume: 0.2
            }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'mirv': {
        burst: {
            particle: 'explosionMIRV',
            scale: 1.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 10,
        shakeStr: 0.2,
        shakeDur: 0.35,
        lifetime: 2.0
    },
    'mirv_mini': {
        burst: {
            particle: 'explosionMIRV',
            scale: 0.75,
            sound: {
                grass: 'explosion_03',
                water: 'explosion_02'
            }
        },
        rippleCount: 3,
        shakeStr: 0.1,
        shakeDur: 0.2,
        lifetime: 1.25
    },
    'martyr_nade': {
        burst: {
            particle: 'explosionBurst',
            scale: 0.75,
            sound: {
                grass: 'explosion_03',
                water: 'explosion_02'
            }
        },
        rippleCount: 3,
        shakeStr: 0.1,
        shakeDur: 0.2,
        lifetime: 1.25
    },
    'snowball': {
        burst: {
            particle: '',
            scale: 0.75,
            sound: {
                grass: 'snowball_01',
                water: 'frag_water_01'
            }
        },
        scatter: {
            particle: 'snowball_impact',
            count: 5,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'snowball_heavy': {
        burst: {
            particle: '',
            scale: 0.75,
            sound: {
                grass: 'snowball_02',
                water: 'frag_water_01'
            }
        },
        scatter: {
            particle: 'snowball_impact',
            count: 8,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'potato': {
        burst: {
            particle: '',
            scale: 0.75,
            sound: {
                grass: 'potato_01',
                water: 'frag_water_01'
            }
        },
        scatter: {
            particle: 'potato_impact',
            count: 5,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'potato_heavy': {
        burst: {
            particle: '',
            scale: 0.75,
            sound: {
                grass: 'potato_02',
                water: 'frag_water_01'
            }
        },
        scatter: {
            particle: 'potato_impact',
            count: 8,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'potato_cannonball': {
        burst: {
            particle: 'explosionPotato',
            scale: 0.75,
            sound: {
                grass: 'explosion_05',
                water: 'explosion_02'
            }
        },
        scatter: {
            particle: 'potato_impact',
            count: 8,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 10,
        shakeStr: 0.12,
        shakeDur: 0.25,
        lifetime: 1.25
    },
    'heart_cannonball': {
        burst: {
            particle: 'explosionHeart',
            scale: 0.75,
            sound: {
                grass: 'explosion_05',
                water: 'explosion_02'
            }
        },
        scatter: {
            particle: 'heart_impact',
            count: 8,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 10,
        shakeStr: 0.12,
        shakeDur: 0.25,
        lifetime: 1.25
    },
    'potato_smgshot': {
        burst: {
            particle: '',
            scale: 0.2,
            sound: {
                grass: 'potato_01',
                water: 'potato_02',
                detune: 250,
                volume: 0.5
            }
        },
        scatter: {
            particle: 'potato_smg_impact',
            count: 2,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 0.5
    },

    'fire_shot': {
        burst: {
            particle: '',
            scale: 0.2,
            sound: {
                grass: '',
                water: '',
                detune: 0,
                volume: 0.0
            }
        },
        scatter: {
            particle: 'fire_impact',
            count: 2,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 0.5
    },

    'bomb_iron': {
        burst: {
            particle: 'explosionBomb',
            scale: 2.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 12,
        shakeStr: 0.25,
        shakeDur: 0.4,
        lifetime: 2.0
    },

    'motherShip_cannon': {
        burst: {
            particle: 'explosionMotherShip',
            scale: 3.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 12,
        shakeStr: 0.25,
        shakeDur: 0.4,
        lifetime: 2.0
    },

    'thunder_explosion': {
        burst: {
            particle: 'explosionThunder',
            scale: 3.0,
            sound: {
                grass: 'thunder_01',
                water: 'thunder_01'
            }
        },
        rippleCount: 1,
        shakeStr: 3.25,
        shakeDur: 1.5,
        lifetime: 2.5
    },

    'heart_frag': {
        burst: {
            particle: 'explosionHeartBurst',
            scale: 1.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 10,
        shakeStr: 0.2,
        shakeDur: 0.35,
        lifetime: 2.0
    },
    'mine': {
        burst: {
            particle: 'explosionBurst',
            scale: 1.0,
            sound: {
                grass: 'explosion_01',
                water: 'explosion_02'
            }
        },
        rippleCount: 10,
        shakeStr: 0.2,
        shakeDur: 0.35,
        lifetime: 2.0
    },
    'water_balloon': {
        burst: {
            burst: {
                particle: '',
                scale: 0.75,
                sound: {
                    grass: 'water_balloon_deploy_01',
                    water: 'frag_water_01'
                }
            },
            particle: '',
            scale: 0.75,
            sound: {
                grass: 'water_balloon_deploy_01',
                water: 'frag_water_01'
            }
        },
        scatter: {
            particle: 'water_balloon_impact',
            count: 8,
            speed: { min: 5.0, max: 25.0 }
        },
        rippleCount: 1,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 1.0
    },
    'skitternade': {
        burst: {
            particle: 'explosionSkitternade',
            scale: 0.0,
            sound: {
                grass: 'explosion_smoke_01',
                water: 'explosion_smoke_01'
            }
        },
        rippleCount: 10,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 6.0
    },
    'antiFire': {
        burst: {
            particle: 'explosionAntiFire',
            scale: 0.0,
            sound: {
                grass: 'explosion_anti_fire_01',
                water: 'explosion_anti_fire_01'
            }
        },
        rippleCount: 10,
        shakeStr: 0.0,
        shakeDur: 0.0,
        lifetime: 6.0
    }
};

//
// PhysicsParticle
//
function PhysicsParticle() {
    this.active = false;
}

PhysicsParticle.prototype = {
    init: function init(pos, vel, layer, particle) {
        this.pos = v2.copy(pos);
        this.vel = v2.copy(vel);
        this.layer = layer;
        this.particle = particle;
        this.ticker = 0.0;
        this.colCount = 0;
        this.active = true;
    },

    update: function update(dt, map, playerBarn) {
        // Move and collide with obstacles
        var posOld = v2.copy(this.pos);
        this.pos = v2.add(this.pos, v2.mul(this.vel, dt));
        this.vel = v2.mul(this.vel, 1.0 / (1.0 + 5.0 * dt));

        // Gather colliders
        var colliders = [];

        var obstacles = map.m_obstaclePool.m_getPool();
        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i];
            if (!obstacle.active || obstacle.dead || !util.sameLayer(this.layer, obstacle.layer)) {
                continue;
            }
            colliders.push(obstacle.collider);
        }
        // npcs colliders
        var npcs = map.m_npcPool.m_getPool();
        for (var _i = 0; _i < npcs.length; _i++) {
            var npc = npcs[_i];
            if (!npc.active || npc.dead || !util.sameLayer(this.layer, npc.layer)) {
                continue;
            }
            colliders.push(npc.collider);
        }

        var players = playerBarn.m_playerPool.m_getPool();
        for (var _i2 = 0; _i2 < players.length; _i2++) {
            var player = players[_i2];
            if (!player.active || player.dead || !util.sameLayer(this.layer, player.layer)) {
                continue;
            }
            colliders.push(collider.createCircle(player.pos, player.rad, 0.0));
        }

        // Intersect with nearest collider
        var cols = [];
        for (var _i3 = 0; _i3 < colliders.length; _i3++) {
            var res = collider.intersectSegment(colliders[_i3], posOld, this.pos);
            if (res) {
                var dist = v2.length(v2.sub(res.point, posOld));
                cols.push({
                    point: res.point,
                    normal: res.normal,
                    dist: dist
                });
            }
        }
        cols.sort(function (a, b) {
            return a.dist - b.dist;
        });
        if (cols.length > 0) {
            var col = cols[0];
            var dir = v2.normalizeSafe(this.vel, v2.create(1.0, 0.0));
            var spd = v2.length(this.vel);
            var reflectDir = v2.sub(dir, v2.mul(col.normal, 2.0 * v2.dot(col.normal, dir)));
            // Hacky physics:
            // Apply friction only after the first impact; the idea is to
            // have explosions that happen near walls throw their particles
            // off of the wall at full velocity.
            var friction = this.colCount++ > 0 ? 0.35 : 1.0;
            this.pos = v2.add(col.point, v2.mul(col.normal, 0.01));
            this.vel = v2.mul(reflectDir, spd * friction);
        }

        this.particle.pos = v2.copy(this.pos);

        this.ticker += dt;
        if (this.ticker >= this.particle.life) {
            this.particle.m_free();
            this.active = false;
        }
    }
};

//
// Explosion
//

/**
 * 
 * @param {m_ExplosionBarn} explosionBarn 
 */
function Explosion(explosionBarn) {
    this.explosionBarn = explosionBarn;
    this.active = false;
}

Explosion.prototype = {
    m_init: function m_init(renderer, type, pos, layer, zOrder) {
        var explosionDef = ExplosionDefs[type];
        var expType = explosionDef.explosionEffectType;
        var def = Defs[expType];
        this.active = true;
        this.hidden = typeof explosionDef.hidden === 'boolean' && explosionDef.hidden ? true : false;
        this.done = false;
        this.type = type;
        this.pos = v2.copy(pos);
        this.layer = layer;
        this.ticker = 0.0;
        this.lifetime = def.lifetime;
        this.soundInstance = null;
        this.soundUpdateThrottle = 0.0;
        this.shootSound = false;
        this.spine = null;
        this.spineDef = null;
        this.parent = null;

        var useSpine = explosionDef.spine && explosionDef.spine.enabled && this.explosionBarn.canUseSpine();

        if (useSpine) {
            this.setSpine(explosionDef.spine);
            renderer.addPIXIObj(this.spine, layer, zOrder);
        }
    },

    setSpine: function setSpine(spineDef) {
        this.spineDef = spineDef;
        var spine = this.spine || this.explosionBarn.getSpine();
        spine.skeleton.setSkin(null);
        spine.skeleton.setSkinByName(this.spineDef.skin || 'default');

        if (!this.parent) {
            spine.position.set(this.pos.x, this.pos.y);
        } else if (this.parent && spineDef.pivot) {
            var _spineDef$pivot = spineDef.pivot,
                x = _spineDef$pivot.x,
                y = _spineDef$pivot.y;

            spine.position.set(x, y);
        }

        this.spine = spine;
        this.lifetime = spineDef.duration;
    },

    setAnimation: function setAnimation(animationName) {
        var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        this.spine.state.setAnimation(track, animationName, loop);
    },

    freeSpine: function freeSpine() {
        //this.container.removeChild(this.spine);
        this.explosionBarn.freeSpine(this.spine);
        this.spine = null;
    },

    m_free: function m_free() {
        this.active = false;

        if (this.spine) {
            this.freeSpine();
        }
    },

    m_update: function m_update(dt, explosionBarn, particleBarn, audioManager, map, camera) {
        var expType = ExplosionDefs[this.type].explosionEffectType;
        var def = Defs[expType];

        var isNew = this.ticker == 0.0;

        if (isNew) {
            // Airstrike explosions should not render if they happen indoors
            var renderVisuals = true;
            if (this.type == 'explosion_bomb_iron' || this.type == 'lightning_explosion') {
                var col = collider.createCircle(this.pos, 0.5);
                if (map.insideBuildingCeiling(col, true)) {
                    renderVisuals = false;
                }
            }

            if (renderVisuals) {
                if (this.type == 'lightning_explosion') {
                    map.display.flash.alpha = 1;
                }

                if (this.spine) {
                    this.setAnimation(this.spineDef.animation);
                } else if (def.burst.particle && !this.hidden) {
                    particleBarn.addParticle(def.burst.particle, this.layer, this.pos, v2.create(0.0, 0.0), def.burst.scale, 0.0, null);
                }

                if (def.scatter) {
                    for (var i = 0; i < def.scatter.count; i++) {
                        var particle = particleBarn.addParticle(def.scatter.particle, this.layer, this.pos, v2.create(0.0, 0.0), 1.0, 0.0, null);

                        var physPart = explosionBarn.addPhysicsParticle();
                        var vel = v2.mul(v2.randomUnit(), util.random(def.scatter.speed.min, def.scatter.speed.max));
                        physPart.init(this.pos, vel, this.layer, particle);
                    }
                }
            }

            var surface = map.getGroundSurface(this.pos, this.layer);
            var sound = surface.type == 'water' && !map.snowMode ? def.burst.sound.water : def.burst.sound.grass;
            var rangeMult = 2.0;

            var detune = 0;
            if (def.burst.sound.detune != undefined) {
                detune = def.burst.sound.detune;
            }

            var volume = 1.0;
            if (def.burst.sound.volume != undefined) {
                volume = def.burst.sound.volume;
            }

            if (this.type == "explosion_motherShip") {
                audioManager.playGroup("mothership_shoot", {
                    soundPos: this.pos,
                    fallOff: 3.0,
                    layer: this.layer,
                    filter: 'muffled'
                });
            }

            this.soundInstance = audioManager.playSound(sound, {
                channel: 'sfx',
                soundPos: this.pos,
                layer: this.layer,
                filter: 'muffled',
                rangeMult: rangeMult,
                ignoreMinAllowable: true,
                detune: detune,
                volumeScale: volume
            });

            // Create ripples if in water
            if (surface.type == 'water' && !map.snowMode) {
                for (var _i4 = 0; _i4 < def.rippleCount; _i4++) {
                    var maxRad = def.rippleCount * 0.5;
                    var ripplePos = v2.add(this.pos, v2.mul(v2.randomUnit(), util.random(0.0, maxRad)));
                    var part = particleBarn.addRippleParticle(ripplePos, this.layer, surface.data.rippleColor);
                    part.setDelay(_i4 * 0.06);
                }
            }
        }

        if (this.type == 'lightning_explosion') {
            if (map.display.flash.alpha >= 0) {
                map.display.flash.alpha -= 0.05;
            }
        }

        if (this.soundInstance && this.soundUpdateThrottle < 0.0) {
            this.soundUpdateThrottle = 0.1;
            var _volume = 1.0;
            if (def.burst.sound.volume != undefined) {
                _volume = def.burst.sound.volume;
            }
            audioManager.updateSound(this.soundInstance, 'sfx', this.pos, {
                layer: this.layer,
                filter: 'muffled',
                volumeScale: _volume
            });
        } else {
            this.soundUpdateThrottle -= dt;
        }

        this.ticker += dt;
        var shakeT = math.min(this.ticker / def.shakeDur, 1.0);
        var shakeInt = math.lerp(shakeT, def.shakeStr, 0.0);
        camera.addShake(this.pos, shakeInt);

        if (this.ticker >= this.lifetime) {
            this.active = false;
            if (this.type == 'lightning_explosion') {
                map.display.flash.alpha = 0;
            }
        }
    }
};

//
// ExplosionBarn
//
function m_ExplosionBarn(spineProjectilesData) {
    /** @type {Explosion[]} */
    this.explosions = [];
    this.physicsParticles = [];

    this.spineProjectilesData = spineProjectilesData;
    this.activeSpineObjs = 0;
    this.spineObjs = [];
}

m_ExplosionBarn.prototype = {
    addExplosion: function addExplosion(renderer, type, pos, layer) {
        var e = null;
        for (var i = 0; i < this.explosions.length; i++) {
            if (!this.explosions[i].active) {
                e = this.explosions[i];
                break;
            }
        }
        if (!e) {
            e = new Explosion(this);
            this.explosions.push(e);
        }

        e.m_init(renderer, type, pos, layer);
    },

    addPhysicsParticle: function addPhysicsParticle() {
        var p = null;
        for (var i = 0; i < this.physicsParticles.length; i++) {
            var particle = this.physicsParticles[i];
            if (!particle.active) {
                p = particle;
                break;
            }
        }
        if (!p) {
            p = new PhysicsParticle();
            this.physicsParticles.push(p);
        }
        return p;
    },

    m_update: function m_update(dt, map, playerBarn, camera, particleBarn, audioManager, debug) {
        for (var i = 0; i < this.explosions.length; i++) {
            var e = this.explosions[i];
            if (!e.active) {
                continue;
            }

            e.m_update(dt, this, particleBarn, audioManager, map, camera);

            if (!e.active) {
                e.m_free();
            }
        }

        for (var _i5 = 0; _i5 < this.physicsParticles.length; _i5++) {
            var p = this.physicsParticles[_i5];
            if (!p.active) {
                continue;
            }

            p.update(dt, map, playerBarn);
        }
    },

    render: function render(camera) {
        this.explosions.forEach(function (explosion) {
            if (!explosion.spine || !explosion.active) {
                return;
            }

            var scale = explosion.spineDef.scale;
            var screenPos = camera.pointToScreen(explosion.pos);
            var screenScale = camera.pixels(scale);

            explosion.spine.position.set(screenPos.x, screenPos.y);
            explosion.spine.scale.set(screenScale, screenScale);
        });
    },

    getSpine: function getSpine() {
        if (this.spineObjs.length > 0) {
            this.activeSpineObjs++;
            console.log('[m_ExplosionBarn]: Spine from pool');
            return this.spineObjs.pop();
        }
        if (this.canUseSpine()) {
            this.activeSpineObjs++;
            console.log('[m_ExplosionBarn]: New spine');
            var spine = new PIXI.spine.Spine(this.spineProjectilesData);
            return spine;
        }

        return null;
    },

    canUseSpine: function canUseSpine() {
        return this.activeSpineObjs < kMaxSpineObjects;
    },

    freeSpine: function freeSpine(spine) {
        console.log('[m_ExplosionBarn]: Free spine');
        this.spineObjs.push(spine);
        this.activeSpineObjs--;
    }
};

module.exports = {
    m_ExplosionBarn: m_ExplosionBarn
};
