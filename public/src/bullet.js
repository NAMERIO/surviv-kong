"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * bullet.js
 * This updates all the active bullets client side
 */

var PIXI = require("./pixi.js");
var assert = require("./0e566746.js");
var v2 = require("./v2.js");
var math = require("./math.js");
var util = require("./util.js");
var coldet = require("./coldet.js");
var DebugLines = require("./debugLines.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var MapObjectDefs = require("./mapObjectDefs.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var BulletDefs = require("./bulletDefs.js");
var BehaviourEnum = require("./behaviourEnum.js");
var NpcDefinitions = require("./npcDefinitions.js");
var BulletBehaviourDefaults = require("./bullet-behaviour-defaults.js");

//Import behaviours
var BaseBullet = require("./baseBullet.js");
var SpreadShot = require("./spreadShot.js");
var ArcTrajectory = require("./arcTrajectory.js");
var SinusoidalBullet = require("./sinusoidalBullet.js");
var RectangularHitboxSized = require("./rectangularHitboxSized.js");

var kMaxSpineObjects = 80;
var kTimesToKillBullet = 20;
var kCollisionDistance = 1.0;
var kFadeOutVelocity = 1;

//
// Helpers
//
function transformSegment(p0, p1, pos, dir) {
    var ang = Math.atan2(dir.y, dir.x);
    return {
        p0: v2.add(pos, v2.rotate(p0, ang)),
        p1: v2.add(pos, v2.rotate(p1, ang))
    };
}

function createBullet(bullet, bulletBarn, flareBarn, playerBarn, renderer, particleBarn) {
    var bulletDef = BulletDefs[bullet.bulletType];
    if (bulletDef.addFlare) {
        flareBarn.addFlare(bullet, playerBarn, renderer);
    } else {
        bulletBarn.addBullet(bullet, playerBarn, renderer, particleBarn);
    }
}

function m_updateDataBullet(bulletBarn, bullet) {
    bulletBarn.m_updateData(bullet);
}

function playHitFx(particleName, soundName, pos, dir, layer, particleBarn, audioManager) {
    var numParticles = Math.floor(util.random(1, 2));
    var vel = v2.mul(dir, 9.5);
    //if particle name is....
    if (particleName) {
        for (var k = 0; k < numParticles; k++) {
            vel = v2.rotate(vel, (Math.random() - 0.5) * Math.PI / 3.0);
            particleBarn.addParticle(particleName, layer, pos, vel);
        }
    }
    audioManager.playGroup(soundName, {
        channel: 'hits',
        soundPos: pos,
        layer: layer,
        filter: 'muffled'
    });
}

//
// BulletBarn
//
function m_BulletBarn(spineProjectilesData) {
    this.bullets = {};
    this.localBullets = [];
    this.isRunningOnClient = true;

    this.playerBarn = null;
    this.map = null;
    this.camera = null;
    this.activePlayer = null;
    this.renderer = null;
    this.particleBarn = null;
    this.audioManager = null;
    this.players = null;
    this.playHitFx = null;
    this.spineProjectilesData = spineProjectilesData;
    this.tracerColors = {};
    this.activeSpineObjs = 0;
    this.spineObjs = [];
}

m_BulletBarn.prototype = {
    onMapLoad: function onMapLoad(map) {
        this.tracerColors = util.mergeDeep({}, GameConfig.tracerColors, map.getMapDef().biome.tracerColors);
    },

    getBullet: function getBullet(id) {
        return this.bullets[id];
    },

    getSpine: function getSpine() {
        if (this.spineObjs.length > 0) {
            this.activeSpineObjs++;
            return this.spineObjs.pop();
        }
        if (this.canUseSpine()) {
            this.activeSpineObjs++;
            var spine = new PIXI.spine.Spine(this.spineProjectilesData);
            return spine;
        }

        return null;
    },

    canUseSpine: function canUseSpine() {
        return this.activeSpineObjs < kMaxSpineObjects;
    },

    freeSpine: function freeSpine(spine) {
        this.spineObjs.push(spine);
        this.activeSpineObjs--;
    },


    addBullet: function addBullet(bullet, playerBarn, renderer, particleBarn) {
        var b = null;
        var bulletDef = BulletDefs[bullet.bulletType];

        if (bulletDef.updateFromServer && (!this.bullets[bullet.id] || this.bullets[bullet.id] && !this.bullets[bullet.id].active)) {
            this.bullets[bullet.id] = this.createBulletClass(bullet.id, bullet, playerBarn, renderer, this.bullets[bullet.id]);
        } else if (!bulletDef.updateFromServer) {
            for (var i = 0; i < this.localBullets.length; i++) {
                if (!this.localBullets[i].active && this.localBullets[i].collided) {
                    this.localBullets[i] = this.createBulletClass(bullet.id, bullet, playerBarn, renderer, this.localBullets[i]);
                    return;
                }
            }
        }

        if (!b) {
            if (bulletDef.updateFromServer) this.bullets[bullet.id] = this.createBulletClass(bullet.id, bullet, playerBarn, renderer); //b;
            else this.localBullets.push(this.createBulletClass(bullet.id, bullet, playerBarn, renderer));
        }
    },

    createBulletClass: function createBulletClass(id, bullet, playerBarn, renderer) {
        var existingClass = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        var bulletDef = BulletDefs[bullet.bulletType];

        var variance = 1.0 + bullet.varianceT * bulletDef.variance;
        var distAdj = math.remap(bullet.distAdjIdx, 0, 16, -1.0, 1.0);
        var distance = bulletDef.distance / Math.pow(GameConfig.bullet.reflectDistDecay, bullet.reflectCount);
        if (bullet.clipDistance) {
            distance = bullet.distance;
        }

        var params = {
            bullet: bullet,
            playerBarn: playerBarn,
            renderer: renderer,
            bulletDef: bulletDef,
            PIXI: PIXI,
            pos: bullet.pos,
            dir: bullet.dir,
            distAdj: distAdj,
            variance: variance,
            distance: distance,
            layer: bullet.layer,
            playerId: bullet.playerId,
            bulletType: bullet.bulletType,
            reflectCount: bullet.reflectCount,
            reflectObjId: bullet.reflectObjId,
            scale: bullet.scale
        };
        //Create new bullet based on behaviour
        if (!bulletDef.behaviour) {
            if (existingClass && existingClass.behaviourId == BehaviourEnum.BaseBullet) return existingClass.reset(id, params);else return new BaseBullet(this, id, params);
        } else {
            //Create class with special behaviour
            assert(bulletDef.behaviour.id, 'No special behaviour id found on bullet definition, source: ' + bullet.bulletType);
            var defaultBehaviourDef = BulletBehaviourDefaults[bulletDef.behaviour.id];
            assert(defaultBehaviourDef, 'Default definition not exists for bullet behaviour id: ' + bulletDef.behaviour.id);

            bulletDef.behaviour = (0, _assign2.default)(defaultBehaviourDef, bulletDef.behaviour); //Replace attributes of behaviour if needed

            if (existingClass && existingClass.behaviourId == bulletDef.behaviour.id) return existingClass.reset(id, params);else {
                switch (bulletDef.behaviour.id) {
                    case BehaviourEnum.SinusoidalBehaviour:
                        return new SinusoidalBullet(this, id, params);
                    case BehaviourEnum.SpreadShotBehaviour:
                        return new SpreadShot(this, id, params);
                    case BehaviourEnum.RectangularHitboxSized:
                        return new RectangularHitboxSized(this, id, params);
                    case BehaviourEnum.VariableDamage:
                        return new BaseBullet(this, id, params);
                    case BehaviourEnum.ArcTrajectory:
                        return new ArcTrajectory(this, id, params);
                    default:
                        console.error('No bullet behavior defined for id: ' + bulletDef.behaviour.id);
                        return;
                }
            }
        }
    },

    m_updateData: function m_updateData(bullet) {
        if (this.bullets[bullet.id]) {
            this.bullets[bullet.id].m_pos = v2.copy(bullet.pos);
            this.bullets[bullet.id].m_active = bullet.active;
        }
    },

    m_update: function m_update(dt, playerBarn, map, camera, activePlayer, renderer, particleBarn, audioManager) {
        this.players = playerBarn.m_playerPool.m_getPool();

        var bulletKeys = (0, _keys2.default)(this.bullets);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(bulletKeys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var i = _step.value;

                var b = this.bullets[i];

                this.updateBullet(dt, b, playerBarn, map, camera, activePlayer, renderer, particleBarn, audioManager);
            }

            //Update local bullet
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

        var bulletLength = this.localBullets.length;
        for (var _i = 0; _i < bulletLength; _i++) {
            var b = this.localBullets[_i];

            this.updateBullet(dt, b, playerBarn, map, camera, activePlayer, renderer, particleBarn, audioManager);
        }
    },

    updateBullet: function updateBullet(dt, b, playerBarn, map, camera, activePlayer, renderer, particleBarn, audioManager) {

        if (!this.playerBarn) this.playerBarn = playerBarn;
        if (!this.map) this.map = map;
        if (!this.camera) this.camera = camera;
        if (!this.activePlayer) this.activePlayer = activePlayer;
        if (!this.renderer) this.renderer = renderer;
        if (!this.particleBarn) this.particleBarn = particleBarn;
        if (!this.audioManager) this.audioManager = audioManager;
        if (!this.playHitFx) this.playHitFx = playHitFx;

        var active = true;

        if ((b.collided || b.maxDistanceReached) && b.active) {
            active = false;
            b.spin = 0;
            if (b.spine && !b.stoppedAnimation) b.stopAnimation();

            if (b.spine && b.spineDef && b.spineDef.fizzle) {
                if (b.maxDistanceReached && b.fadeOutOnMaxDist && !b.lastState) {
                    b.container.alpha = math.max(b.container.alpha - kFadeOutVelocity * dt, 0.0);
                    if (b.container.alpha <= 0.0) {
                        b.scale = 0;
                        b.container.visible = false;
                        b.freeSpine();
                        b.lastState = true;
                        b.collided = true;
                        b.active = false;
                    }
                } else if (!b.lastState) {
                    var onAnimationComplete = function onAnimationComplete() {
                        b.scale = 0;
                        b.container.visible = false;
                        b.freeSpine();
                        b.collided = true;
                        b.active = false;
                    };
                    b.playLastState(onAnimationComplete);
                }
            } else if (b.hasSprite) {
                if (b.maxDistanceReached && b.fadeOutOnMaxDist) {
                    b.container.alpha = math.max(b.container.alpha - kFadeOutVelocity * dt, 0.0);
                    if (b.container.alpha <= 0.0) {
                        b.scale = 0;
                        b.container.visible = false;
                        b.collided = true;
                        b.active = false;
                    }
                } else {
                    b.scale = 0;
                    b.container.visible = false;
                    b.collided = true;
                    b.active = false;
                }
            } else {
                b.scale = math.max(b.scale - 6.0 * dt, 0.0);
                if (b.scale <= 0.0) {
                    b.container.visible = false;
                    b.collided = true;
                    b.active = false;
                }
            }
        }

        if (!b.active || !active) {
            return;
        }
        //Update bullet depending on behaviour (class)
        b.update(dt);
    },


    /**
     * Add default attributes to bullet behaviour
     * @param {Class} behaviour Bullet behaviour to add attributes
     * @param {Number} id Id of bullet in bulletBarn
     * @param {Object} params Object with all the necessary parameters to create/control the bullet
     */
    addDefaultAttributes: function addDefaultAttributes(behaviour, id, params) {
        //Common attributes between client and server
        behaviour.id = id;
        behaviour.active = true;
        behaviour.isNew = true;

        behaviour.layer = params.layer;
        behaviour.pos = v2.copy(params.pos);
        behaviour.dir = v2.copy(params.dir);
        behaviour.playerId = params.playerId;
        behaviour.startPos = v2.copy(params.pos);
        behaviour.bulletType = params.bulletType;
        behaviour.reflectCount = params.reflectCount;
        behaviour.reflectObjId = params.reflectObjId;
        behaviour.speed = params.bulletDef.speed * params.variance;
        behaviour.behaviour = params.bulletDef.behaviour;
        behaviour.updateFromServer = !!params.bulletDef.updateFromServer;
        behaviour.fadeOutOnMaxDist = !!params.bulletDef.fadeOutOnMaxDist;
        behaviour.stoppedAnimation = false;
    },
    defaultUpdate: function defaultUpdate(dt, b) {
        if (b.hasThrowPhysics) {
            b.spin += b.spinVel * dt;
        }

        //Movement
        var posOld = v2.copy(b.pos);
        var distLeft = null;
        var distTravel = null;
        if (b.updateFromServer) {
            v2.set(b.pos, b.m_pos);
            distLeft = b.distance - v2.length(v2.sub(b.startPos, b.pos));
            distTravel = math.min(distLeft, v2.length(v2.sub(b.pos, posOld)));
        } else {
            distLeft = b.distance - v2.length(v2.sub(b.startPos, b.pos));
            distTravel = math.min(distLeft, dt * b.speed);
            b.pos = v2.add(b.pos, v2.mul(b.dir, distTravel));
        }

        if (distTravel <= 0) {
            b.timesSinceLastData += 1;
            if (b.timesSinceLastData > kTimesToKillBullet) {
                b.maxDistanceReached = true;
                return;
            }
        } else {
            b.timesSinceLastData = 0;
        }

        // Whiz sounds
        if (!this.activePlayer.m_netData.m_dead && util.sameAudioLayer(this.activePlayer.layer, b.layer)) {
            var distToCamera = v2.length(v2.sub(this.camera.pos, b.pos));
            // Check to see if we're close enough to start hearing this
            if (distToCamera < 7.5 && !b.whizHeard && b.playerId != this.activePlayer.__id) {
                // Make a whizz sound
                this.audioManager.playGroup('bullet_whiz', {
                    soundPos: b.pos,
                    fallOff: 4.0
                });
                b.whizHeard = true;
            }
        }

        // Trail alpha
        if (b.tracerAlphaRate && b.suppressed) {
            var rate = b.tracerAlphaRate;
            b.bulletTrail.alpha = math.max(b.tracerAlphaMin, b.bulletTrail.alpha * rate);
        }

        var hit = this.checkDefaultCollisions(b, posOld);

        // Determine if the bullet should change layer if it
        // begins intersecting stairs
        //
        // @TODO: Bug with nearby bunker masks interacting with
        // bullets that are placed on the stairs layer
        if (!(b.layer & 0x2)) {
            var structures = this.map.m_structurePool.m_getPool();
            var newLayer = b.layer;
            var structuresLength = structures.length;
            for (var j = 0; j < structuresLength; j++) {
                var structure = structures[j];
                if (!structure.active) {
                    continue;
                }
                var insideStairs = false;
                var insideMask = false;
                var stairsLength = structure.stairs.length;
                for (var k = 0; k < stairsLength; k++) {
                    var stair = structure.stairs[k];
                    if (!stair.lootOnly && collider.intersectSegment(stair.collision, b.pos, posOld)) {
                        insideStairs = true;
                        break;
                    }
                }
                var maskLength = structure.mask.length;
                for (var _k = 0; _k < maskLength; _k++) {
                    if (collider.intersectSegment(structure.mask[_k], b.pos, posOld)) {
                        insideMask = true;
                        break;
                    }
                }
                if (insideStairs && !insideMask) {
                    newLayer |= 0x2;
                }
            }
            if (newLayer != b.layer) {
                b.layer = newLayer;
                this.renderer.addPIXIObj(b.container, b.layer, 20);
            }
        }

        if (hit || !b.m_active) {
            b.collided = true;
        } else if (math.eqAbs(distLeft, distTravel)) {
            b.maxDistanceReached = true;
        }

        b.isNew = false;
    },


    checkDefaultCollisions: function checkDefaultCollisions(b, posOld) {
        // Gather colliding obstacles and players
        var colObjs = [];

        // Obstacles
        var shooterInfo = this.playerBarn.m_getPlayerInfo(b.playerId);
        var obstacles = this.map.m_obstaclePool.m_getPool();
        for (var j = 0; j < obstacles.length; j++) {
            var obstacle = obstacles[j];
            if (!obstacle.active || obstacle.dead || !util.sameLayer(obstacle.layer, b.layer) || obstacle.height < GameConfig.bullet.height || b.reflectCount > 0 && obstacle.__id == b.reflectObjId) {
                continue;
            }

            if (b.m_active) {
                var res = collider.intersectSegment(obstacle.collider, posOld, b.pos);
                if (res && (shooterInfo.teamId != obstacle.teamId || shooterInfo.playerId === 0)) {
                    colObjs.push({
                        type: 'obstacle',
                        obstacleType: obstacle.type,
                        collidable: obstacle.collidable,
                        attackCollidable: !obstacle.isWall || obstacle.attackCollidable,
                        point: res.point,
                        normal: res.normal
                    });
                }
            } else {
                var _res = collider.intersectSegment(obstacle.collider, posOld, obstacle.pos);

                if (_res && (shooterInfo.teamId != obstacle.teamId || shooterInfo.playerId === 0)) {
                    var distance = v2.length(v2.sub(b.pos, _res.point));
                    if (distance <= kCollisionDistance) {
                        colObjs.push({
                            type: 'obstacle',
                            obstacleType: obstacle.type,
                            collidable: obstacle.collidable,
                            attackCollidable: !obstacle.isWall || obstacle.attackCollidable,
                            point: _res.point,
                            normal: _res.normal
                        });
                    }
                }
            }
        }

        /// Npcs
        var npcs = this.map.m_npcPool.m_getPool();
        for (var _j = 0; _j < npcs.length; _j++) {
            var npc = npcs[_j];
            if (!npc.active || npc.dead || !util.sameLayer(npc.layer, b.layer) || npc.height < GameConfig.bullet.height || b.reflectCount > 0 && npc.__id == b.reflectObjId) {
                continue;
            }
            if (npc.__id == b.playerId && !b.damageSelf) {
                continue;
            }

            if (b.m_active) {

                if (!npc.collider) {
                    continue;
                }

                var _res2 = collider.intersectSegment(npc.collider, posOld, b.pos);
                if (_res2 && (shooterInfo.teamId != npc.teamId || shooterInfo.playerId === 0)) {
                    colObjs.push({
                        type: 'npc',
                        point: _res2.point,
                        normal: _res2.normal,
                        obstacleType: npc.type,
                        collidable: npc.collidable
                    });
                }
            } else {
                var _res3 = collider.intersectSegment(npc.collider, posOld, npc.pos);

                if (_res3 && (shooterInfo.teamId != npc.teamId || shooterInfo.playerId === 0)) {
                    var _distance = v2.length(v2.sub(b.pos, _res3.point));
                    if (_distance <= kCollisionDistance) {
                        colObjs.push({
                            type: 'npc',
                            point: _res3.point,
                            normal: _res3.normal,
                            obstacleType: npc.type,
                            collidable: npc.collidable
                        });
                    }
                }
            }
        }

        // Players
        for (var _j2 = 0; _j2 < this.players.length; _j2++) {
            var player = this.players[_j2];

            // @TODO: Bullets killing the player won't display
            //        proper hit effects
            if (!player.active || player.m_netData.m_dead || !util.sameLayer(player.m_netData.m_layer, b.layer) && !(player.m_netData.m_layer & 0x2)) {
                continue;
            }
            if (player.__id == b.playerId && !b.damageSelf) {
                continue;
            }

            if (!b.updateFromServer) {
                var _res4 = coldet.intersectSegmentAabb(posOld, b.pos, player.collider.min, player.collider.max);

                if (_res4) {
                    colObjs.push({
                        type: 'player',
                        player: player,
                        point: _res4.point,
                        normal: _res4.normal,
                        layer: player.layer,
                        collidable: true
                    });
                }
            } else if (!b.m_active) {
                var _res5 = coldet.intersectSegmentAabb(posOld, player.pos, player.collider.min, player.collider.max);

                if (_res5) {
                    var _distance2 = v2.length(v2.sub(b.pos, _res5.point));
                    if (_distance2 <= kCollisionDistance) {
                        colObjs.push({
                            type: 'player',
                            player: player,
                            point: _res5.point,
                            normal: _res5.normal,
                            layer: player.layer,
                            collidable: true
                        });
                    }
                }
            }

            if (player.WeaponManager.currentAttack && (player.WeaponManager.mainWeaponDef.type == 'melee' || player.WeaponManager.currentAttack.attackDef.type == 'melee') && player.WeaponManager.currentAttack.attackDef.offset) {
                var isInDamageTime = player.WeaponManager.areInDamageTime;
                if (isInDamageTime) {
                    var meleeAttackCollider = player.getMeleeCollider();
                    var intersection = coldet.intersectSegmentAabb(posOld, b.pos, meleeAttackCollider.min, meleeAttackCollider.max);

                    if (intersection) {
                        colObjs.push({
                            type: 'melee',
                            point: v2.add(intersection.point, v2.mul(intersection.normal, 0.1)),
                            normal: intersection.normal,
                            layer: player.layer,
                            collidable: true
                        });

                        b.collided = true;

                        if (b.spine) {
                            b.freeSpine();
                        }
                    }
                }
            }
        }

        // Collision hit response
        var shooterDead = false;
        var shooter = this.playerBarn.m_getPlayerById(b.playerId);
        if (shooter && (shooter.m_netData.m_dead || shooter.m_netData.m_downed)) {
            shooterDead = true;
        }

        var checkObjs = [];
        // Sort colliding objects by distance`
        for (var _j3 = 0; _j3 < colObjs.length; _j3++) {
            var col = colObjs[_j3];
            col.dist = v2.length(v2.sub(col.point, posOld));
        }
        colObjs.sort(function (a, b) {
            return a.dist - b.dist;
        });
        checkObjs = colObjs;

        var hit = false;
        for (var _j4 = 0; _j4 < checkObjs.length; _j4++) {
            var _col = checkObjs[_j4];

            if (_col.type == 'obstacle') {
                var mapDef = MapObjectDefs[_col.obstacleType];

                if (mapDef.hitParticle && _col.attackCollidable) {
                    playHitFx(mapDef.hitParticle, mapDef.sound.bullet, _col.point, _col.normal, b.layer, this.particleBarn, this.audioManager);
                }
                // Continue travelling if non-collidable
                hit = _col.collidable && _col.attackCollidable;
            } else if (_col.type == 'player') {
                // Don't create a hit particle if the shooting
                // player is dead; this helps avoid confusion around
                // bullets being inactivated when a player dies.
                if (!shooterDead) {
                    // Make a hit particle
                    //
                    // @TODO: This is all messed up, need to properly
                    // configure the PIXI stage dims to match
                    // world units
                    var _player = _col.player;

                    _player.playSpineFX('hit');

                    /*let p = v2.sub(col.point, player.pos);
                    p.y *= -1.0;
                    this.particleBarn.addParticle(
                        'bloodSplat',
                        player.layer,
                        v2.mul(p, this.camera.ppu),
                        v2.create(0.0, 0.0),
                        1.0,
                        1.0,
                        player.container
                    );*/
                    this.audioManager.playGroup('player_bullet_hit', {
                        soundPos: _player.pos,
                        fallOff: 1.0,
                        layer: _player.layer,
                        filter: 'muffled'
                    });
                }
                hit = _col.collidable;
            } else if (_col.type == 'npc') {
                var npcDef = NpcDefinitions[_col.obstacleType];
                //TODO check why sometimes npcDef is undefined
                if (npcDef) {
                    playHitFx(npcDef.hitParticle, npcDef.sound.bullet, _col.point, _col.normal, b.layer, this.particleBarn, this.audioManager);
                }
                hit = true;
            }

            if (hit) {
                b.pos = _col.point;
                break;
            }
        }
        return hit;
    },

    createBulletHit: function createBulletHit(playerBarn, targetId, audioManager) {
        var player = playerBarn.m_getPlayerById(targetId);
        if (player) {
            audioManager.playGroup('player_bullet_hit', {
                soundPos: player.pos,
                fallOff: 1.0,
                layer: player.layer,
                filter: 'muffled'
            });
        }
    },

    render: function render(camera, debug) {
        var bulletKeys = (0, _keys2.default)(this.bullets);
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = (0, _getIterator3.default)(bulletKeys), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var i = _step2.value;

                var b = this.bullets[i];
                this.updateRender(b, camera, debug);
            }
            //Update local bullet
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        var length = this.localBullets.length;
        for (var _i2 = 0; _i2 < length; _i2++) {
            var b = this.localBullets[_i2];
            this.updateRender(b, camera, debug);
        }
    },

    updateRender: function updateRender(b, camera, debug) {
        var maxTrailLength = 15.0;
        if (!b.active && (b.collided || b.scale <= 0 || b.maxDistanceReached)) {
            b.container.visible = false;
            return;
        }

        if (b.hasSprite) {
            var screenPos = camera.pointToScreen(b.pos);

            b.container.position.set(screenPos.x, screenPos.y);

            var screenScale = camera.pixels(b.imgScale);
            b.container.scale.set(screenScale, screenScale);
            if (b.hasThrowPhysics) b.sprite.rotation = b.spin;
        } else {
            var dist = v2.length(v2.sub(b.pos, b.startPos));
            var _screenPos = camera.pointToScreen(b.pos);

            b.container.position.set(_screenPos.x, _screenPos.y);

            var _screenScale = camera.pixels(1);
            var trailLength = math.min(maxTrailLength * b.tracerLength, dist / 2.0);
            b.container.scale.set(_screenScale * trailLength * b.scale, _screenScale);
        }
    }
};

module.exports = {
    m_BulletBarn: m_BulletBarn,
    createBullet: createBullet,
    m_updateDataBullet: m_updateDataBullet,
    playHitFx: playHitFx
};
