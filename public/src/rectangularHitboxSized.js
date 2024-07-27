"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * rectangularHitboxSized.js
 * This controls a bullet without special behaviour but with a rectangular hitbox with specific size
 * NOTE WAS NOT IMPLEMENTED HAS A RECTANGLE BUT AS A LINE WITH THE BULLET WIDTH TO SCAN THE COLLISONS
 */

//Imports
var v2 = require("./v2.js");
var util = require("./util.js");
var math = require("./math.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var GameObject = require("./gameObject.js");
var GameConfig = require("./gameConfig.js");
var BehaviourEnum = require("./behaviourEnum.js");
var MapObjectDefs = require("./mapObjectDefs.js");

var kCollisionDistance = 1.0;
var kTimesToKillBullet = 50;

var RectangularHitboxSized = function () {
    /**
     * Constructor
     * @param {bulletBarn} bulletManager Class that manages all the bullets active
     * @param {Number} id Id of bullet in bulletBarn
     * @param {Object} params Object with all the necessary parameters to create/control the bullet
     */
    function RectangularHitboxSized(bulletManager, id, params) {
        var behaviourId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        _classCallCheck(this, RectangularHitboxSized);

        this.id = id;
        this.behaviourId = BehaviourEnum.RectangularHitboxSized;
        this.BulletManager = bulletManager;
        this.isRunningOnClient = this.BulletManager.isRunningOnClient;

        if (this.isRunningOnClient) {
            // ------------ Client side ------------
            this.active = false;
            this.container = new params.PIXI.Container();
            this.container.pivot.set(14.5, 0.0);
            this.bulletTrail = params.PIXI.Sprite.fromImage('player-bullet-trail-02.img');
            this.bulletTrail.anchor.set(0.5, 0.5);
            this.container.addChild(this.bulletTrail);

            this.reset(id, params); //Set value for the first time
        } else {
            // ------------ Server side ------------
            this.reset(id, params); //Set value for the first time
        }
    }

    /**
     * Clean values of bullet to reuse the class instance
     * @param {Number} id Id of bullet in bulletBarn
     * @param {Object} params Object with all the necessary parameters to create/control the bullet
     */


    _createClass(RectangularHitboxSized, [{
        key: 'reset',
        value: function reset(id, params) {
            //Common attributes between client and server
            this.BulletManager.addDefaultAttributes(this, id, params);

            this.notDestroyOnCollision = !!params.bulletDef.behaviour.notDestroyOnCollision;
            this.hitIds = {};

            this.hitBox = v2.create(1, this.behaviour.width);
            //this.hitBox = this.behaviour.hitBox;TODO use this to do collider rectangular
            this.dirAngle = math.rad2degFromDirection(this.dir.y, this.dir.x);

            this.aabb = collider.createAabbExtents(v2.create(0, 0), this.hitBox);

            this.aabbCollider = collider.transformProjectile(this.aabb, this.pos, this.dirAngle, 1);

            if (this.isRunningOnClient) {
                // ------------ Client side ------------
                this.spineDef = null;
                this.lastState = false;
                var playerInfo = params.playerBarn.m_getPlayerInfo(params.playerId);
                this.container.visible = false;
                this.container.alpha = 1;

                while (this.container.children.length > 0) {
                    this.container.removeChildAt(0);
                }

                //Get sprite
                this.hasSprite = false;
                var useSpine = params.bulletDef.spine && params.bulletDef.spine.enabled && this.BulletManager.canUseSpine();
                var useSprite = params.bulletDef.worldImg;

                if (useSpine) {
                    this.hasSprite = true;
                    this.setSpine(params.bulletDef.spine);
                    this.container.addChild(this.spine);
                    this.imgScale = params.bulletDef.spine.scale || 1;
                } else if (useSprite) {
                    this.hasSprite = true;

                    var imgDef = params.bulletDef.worldImg;
                    var imgDef2 = imgDef.sprite;
                    if (imgDef.sprites) {
                        imgDef2 = imgDef.sprites[util.randomInt(0, imgDef.sprites.length - 1)];
                    }

                    // Setup sprite
                    this.sprite = new params.PIXI.Sprite();

                    this.sprite.anchor.set(0.5, 0.5);

                    if (params.bulletDef.textureAnchor) {
                        this.sprite.anchor.set(params.bulletDef.textureAnchor.x, params.bulletDef.textureAnchor.y);
                    }
                    this.sprite.texture = params.PIXI.Texture.fromImage(imgDef2);
                    this.sprite.tint = imgDef.tint;
                    this.sprite.alpha = 1;
                    this.imgScale = imgDef.scale || 1;
                    this.container.addChild(this.sprite);

                    if (params.bulletDef.throwPhysics) {
                        this.hasThrowPhysics = true;
                        this.spin = 0.0;
                        this.spinVel = params.bulletDef.throwPhysics.spinVel;
                    } else this.hasThrowPhysics = false;
                }

                this.m_active = true;
                this.collided = false;
                this.maxDistanceReached = false;
                this.scale = 1.0;
                this.m_pos = v2.copy(params.pos);
                this.distance = params.distance * params.variance + params.distAdj;
                this.whizHeard = false;
                this.teamId = playerInfo.teamId;
                this.timesSinceLastData = 0;

                var angleRadians = Math.atan2(this.dir.x, this.dir.y);
                this.container.rotation = angleRadians - Math.PI / 2.0;

                this.layer = this.layer;
                var player = params.playerBarn.m_getPlayerById(this.playerId);
                if (player && player.layer & 0x2) {
                    this.layer |= 0x2;
                }

                // Set default scale.x to standard working length of 0.8
                var tracerWidth = params.bulletDef.tracerWidth;
                if (params.bullet.trailSmall) {
                    tracerWidth *= 0.5;
                }
                if (params.bullet.trailThick) {
                    tracerWidth *= 2.0;
                }
                this.bulletTrail.scale.set(0.8, tracerWidth);
                this.tracerLength = params.bulletDef.tracerLength;
                this.suppressed = !!params.bulletDef.suppressed;

                // Use saturated color if the player is on a bright surface
                var tracerColors = this.BulletManager.tracerColors[params.bulletDef.tracerColor];
                var tracerTint = tracerColors.regular;
                if (params.bullet.trailSaturated) {
                    tracerTint = tracerColors.chambered || tracerColors.saturated;
                } else if (player && player.surface && player.surface.data && player.surface.data.isBright) {
                    tracerTint = tracerColors.saturated;
                }
                this.bulletTrail.tint = tracerTint;
                this.tracerAlphaRate = tracerColors.alphaRate;
                this.tracerAlphaMin = tracerColors.alphaMin;
                this.bulletTrail.alpha = 1.0;
                if (this.reflectCount > 0) {
                    this.bulletTrail.alpha *= 0.5;
                }

                this.container.visible = true;

                params.renderer.addPIXIObj(this.container, this.layer, 20);
            } else {
                // ------------ Server side ------------
                // Add random jitter to the bullet distance. This makes spray patterns
                // for low spread, high rate-of-fire guns like the vector look better.
                //
                // Don't apply the jitter on shotguns as they have inherent jitter
                // due to how the player computes the shot start position.
                var distAdjIdxMax = 16;
                var distAdjIdx = params.bulletType != 'bullet_shotgun' && params.bulletType != 'bullet_frag' ? util.randomInt(0, distAdjIdxMax) : distAdjIdxMax / 2;
                var distAdj = math.remap(distAdjIdx, 0, distAdjIdxMax, -1.0, 1.0);
                var desiredDistance = params.distance * params.variance + distAdj;

                this.serialized = false;
                this.sentToClient = false;
                this.timeInactive = 0.0;
                this.sourceType = params.sourceType;
                this.damageType = params.damageType;
                this.maxDistance = params.maxDistance;
                this.damageMult = params.damageMult;
                this.shotFx = params.shotFx;
                this.shotOffhand = params.shotOffhand;
                this.shotAlt = params.shotAlt;
                this.splinter = params.splinter;
                this.trailSaturated = params.trailSaturated;
                this.trailSmall = params.trailSmall;
                this.trailThick = params.trailThick;
                this.varianceT = params.varianceT;
                this.distAdjIdx = distAdjIdx;
                this.distance = math.min(desiredDistance, params.maxDistance);
                this.clipDistance = desiredDistance > params.maxDistance;
                this.endPos = v2.add(params.pos, v2.mul(this.dir, this.distance));
                this.clientEndPos = v2.copy(this.endPos);
                this.moveT = 0.0;
                this.damage = params.bulletDef.damage * this.damageMult;
                this.onHitFx = params.bulletDef.onHit || params.onHitFx;
                this.isFlare = params.bulletType == 'bullet_flare'; //TODO delete if not needed
                this.isBugle = params.bulletType == 'bullet_bugle'; //TODO delete if not needed
                this.skipCollision = !!params.bulletDef.skipCollision;
                this.isShrapnel = params.bulletDef.shrapnel;
                this.distanceTraveled = 0;
                this.attackDef = params.attackDef;
                this.callback = params.callback;
            }

            this.start();
            return this;
        }
    }, {
        key: 'setSpine',
        value: function setSpine(spineDef) {
            this.spineDef = spineDef;
            var spine = this.spine || this.BulletManager.getSpine();

            spine.skeleton.setSkin(null);
            spine.skeleton.setSkinByName(this.spineDef.skin || 'default');

            if (spineDef.pivot) {
                var _spineDef$pivot = spineDef.pivot,
                    x = _spineDef$pivot.x,
                    y = _spineDef$pivot.y;

                spine.position.set(x, y);
            }

            this.spine = spine;
        }
    }, {
        key: 'setAnimation',
        value: function setAnimation(animationName) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var track = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            //@HACK Reset spine to be sure that the animation will play
            this.spine.skeleton.setToSetupPose();
            this.spine.state.listeners = [];
            this.spine.state.tracks = [];
            this.spine.state.setEmptyAnimation(0, 1);
            this.spine.lastTime = null;

            this.spine.state.setAnimation(track, animationName, loop);
        }
    }, {
        key: 'stopAnimation',
        value: function stopAnimation() {
            this.stoppedAnimation = true;
            this.spine.state.clearTrack(0);
        }

        /**
         * Start bullet
         */

    }, {
        key: 'start',
        value: function start() {
            if (this.isRunningOnClient) {
                // ------------ Client side ------------
                if (this.spine && this.spineDef) {
                    this.setAnimation(this.spineDef.idle, true);
                }
            } else {
                // ------------ Server side ------------
                // Pre-compute all potential colliding obstacles
                if (this.isNew) {
                    this.isNew = false;

                    // Clamp end pos to the map boundaries if the bullet
                    // has an onHit effect
                    if (this.hasOnHitFx) {
                        var res = coldet.intersectSegmentAabb2(this.aabbCollider.min, this.aabbCollider.max, this.BulletManager.map.bounds.map.min, this.BulletManager.map.bounds.map.max);
                        if (res) {
                            var dist = v2.length(v2.sub(res.point, this.startPos));
                            this.endPos = res.point;
                            this.clientEndPos = res.point;
                            this.distance = dist;
                            this.maxDistance = dist;
                            this.clipDistance = true;
                        }
                    }

                    // Store furthest possible travel distance to
                    // an indestructible obstacle for the client.
                    var maxDistance = this.distance;
                    this.clientEndPos = v2.add(this.startPos, v2.mul(this.dir, maxDistance));
                }
            }
        }

        /**
         * Updates the current attack behaviour
         * @param {float} dt Delta time since the last call to update
         */

    }, {
        key: 'update',
        value: function update(dt) {
            if (this.active) {
                //Common attributes between client and server
                var posOld = v2.copy(this.pos);

                if (this.isRunningOnClient) {
                    // ------------ Client side ------------
                    if (this.hasThrowPhysics) {
                        this.spin += this.spinVel * dt;
                    }

                    //Movement
                    var distLeft = null;
                    var distTravel = null;
                    if (this.updateFromServer) {
                        v2.set(this.pos, this.m_pos);
                        distLeft = this.distance - v2.length(v2.sub(this.startPos, this.pos));
                        distTravel = math.min(distLeft, v2.length(v2.sub(this.pos, posOld)));
                    } else {
                        distLeft = this.distance - v2.length(v2.sub(this.startPos, this.pos));
                        distTravel = math.min(distLeft, dt * this.speed);
                        this.pos = v2.add(this.pos, v2.mul(this.dir, distTravel));
                    }

                    if (distTravel <= 0) {
                        this.timesSinceLastData += 1;
                        if (this.timesSinceLastData > kTimesToKillBullet) {
                            this.maxDistanceReached = true;
                            return;
                        }
                    }

                    // Whiz sounds
                    if (!this.BulletManager.activePlayer.m_netData.m_dead && util.sameAudioLayer(this.BulletManager.activePlayer.layer, this.layer)) {
                        var distToCamera = v2.length(v2.sub(this.BulletManager.camera.pos, this.pos));
                        // Check to see if we're close enough to start hearing this
                        if (distToCamera < 7.5 && !this.whizHeard && this.playerId != this.BulletManager.activePlayer.__id) {
                            // Make a whizz sound
                            this.BulletManager.audioManager.playGroup('bullet_whiz', {
                                soundPos: this.pos,
                                fallOff: 4.0
                            });
                            this.whizHeard = true;
                        }
                    }

                    // Trail alpha
                    if (this.tracerAlphaRate && this.suppressed) {
                        var rate = this.tracerAlphaRate;
                        this.bulletTrail.alpha = math.max(this.tracerAlphaMin, this.bulletTrail.alpha * rate);
                    }

                    var hit = this.checkCollissions(posOld);

                    // Determine if the bullet should change layer if it
                    // begins intersecting stairs
                    //
                    // @TODO: Bug with nearby bunker masks interacting with
                    // bullets that are placed on the stairs layer
                    if (!(this.layer & 0x2)) {
                        var structures = this.BulletManager.map.m_structurePool.m_getPool();
                        var newLayer = this.layer;
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
                                if (!stair.lootOnly && collider.intersectSegment(stair.collision, this.pos, posOld)) {
                                    insideStairs = true;
                                    break;
                                }
                            }
                            var maskLength = structure.mask.length;
                            for (var _k = 0; _k < maskLength; _k++) {
                                if (collider.intersectSegment(structure.mask[_k], this.pos, posOld)) {
                                    insideMask = true;
                                    break;
                                }
                            }
                            if (insideStairs && !insideMask) {
                                newLayer |= 0x2;
                            }
                        }
                        if (newLayer != this.layer) {
                            this.layer = newLayer;
                            this.BulletManager.renderer.addPIXIObj(this.container, this.layer, 20);
                        }
                    }

                    if (hit || !this.m_active) {
                        this.collided = true;
                    } else if (math.eqAbs(distLeft, distTravel)) {
                        this.maxDistanceReached = true;
                    }

                    this.isNew = false;
                } else {
                    // ------------ Server side ------------
                    // Move
                    var _distLeft = this.distance - v2.length(v2.sub(this.startPos, this.pos));
                    var moveDist = math.min(_distLeft, dt * this.speed);
                    this.distanceTraveled += moveDist;

                    v2.set(this.pos, v2.add(this.pos, v2.mul(this.dir, moveDist)));

                    v2.set(this.pos, this.BulletManager.map.clampToMapBounds(this.pos));

                    var oldT = this.moveT;
                    this.moveT = v2.length(v2.sub(this.pos, this.startPos)) / this.distance;

                    var reflected = this.checkCollissions(posOld, oldT);

                    if (!this.active && this.callback) {
                        this.callback(this.pos);
                        this.callback = null;
                    }

                    //Check if bullet has reached the maximun distance
                    if (math.eqAbs(moveDist, 0.0) || this.moveT >= 1.0) {
                        this.active = false;

                        this.stopBullet();

                        // Explosive rounds peter out
                        if (this.onHitFx == 'explosion_rounds') {
                            //TODO delete
                            this.onHitFx = '';
                        }
                    }

                    // Create an onHit explosion, if defined
                    if (!this.active && !reflected && this.onHitFx) {
                        // Use a different explosion type for shotgun explosive rounds
                        if (this.onHitFx == 'explosion_rounds' && (this.bulletType == 'bullet_buckshot' || this.bulletType == 'bullet_flechette' || this.bulletType == 'bullet_birdshot')) {
                            this.onHitFx = 'explosion_rounds_sg';
                        }

                        var pos = this.BulletManager.map.clampToMapBounds(this.pos);
                        this.BulletManager.explosionBarn.createExplosion(this.playerId, this.onHitFx, this.sourceType, this.damageType, pos, this.layer);
                    }
                }
            }
        }

        /**
         * Check if the bullet has collided with an obstacle in the map
         * @param {float} posOld Position of the bullet in the last update
         * @param {float} oldT Distance traveled in last update, normalized between 0 and 1
         * @returns {Boolean} Return if the bullet was reflected on server and if the bullet hit on client
         */

    }, {
        key: 'checkCollissions',
        value: function checkCollissions(posOld, oldT) {
            var _this = this;

            this.aabbCollider = collider.transformProjectile(this.aabb, this.pos, this.dirAngle, 1);

            if (this.isRunningOnClient) {
                // ------------ Client side collision ------------
                var hit = false;

                // Gather colliding obstacles and players
                var colObjs = [];

                // Obstacles
                var shooterInfo = this.BulletManager.playerBarn.m_getPlayerInfo(this.playerId);
                var obstacles = this.BulletManager.map.m_obstaclePool.m_getPool();
                for (var j = 0; j < obstacles.length; j++) {
                    var obstacle = obstacles[j];
                    if (!obstacle.active || obstacle.dead || !util.sameLayer(obstacle.layer, this.layer) || obstacle.height < GameConfig.bullet.height || this.reflectCount > 0 && obstacle.__id == this.reflectObjId) {
                        continue;
                    }

                    if (!this.hitIds[obstacle.__id]) {
                        if (this.m_active) {
                            var res = collider.intersectSegment(obstacle.collider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);
                            if (res && shooterInfo.teamId != obstacle.teamId) {
                                colObjs.push({
                                    type: 'obstacle',
                                    obstacleType: obstacle.type,
                                    collidable: obstacle.collidable,
                                    point: res.point,
                                    normal: res.normal
                                });
                                this.hitIds[obstacle.__id] = true;
                            }
                        } else {
                            var _res = collider.intersectSegment(obstacle.collider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);

                            if (_res && shooterInfo.teamId != obstacle.teamId) {
                                var distance = v2.length(v2.sub(this.pos, _res.point));
                                if (distance <= kCollisionDistance) {
                                    colObjs.push({
                                        type: 'obstacle',
                                        obstacleType: obstacle.type,
                                        collidable: obstacle.collidable,
                                        point: _res.point,
                                        normal: _res.normal
                                    });
                                    this.hitIds[obstacle.__id] = true;
                                }
                            }
                        }
                    }
                }

                /// Npcs
                var npcs = this.BulletManager.map.m_npcPool.m_getPool();
                for (var _j = 0; _j < npcs.length; _j++) {
                    var npc = npcs[_j];
                    if (!npc.active || npc.dead || !util.sameLayer(npc.layer, this.layer) || npc.height < GameConfig.bullet.height || this.reflectCount > 0 && npc.__id == this.reflectObjId) {
                        continue;
                    }

                    if (!npc.collider) continue;

                    if (this.m_active) {
                        var _res2 = collider.intersectSegment(npc.collider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);
                        if (_res2 && shooterInfo.teamId != npc.teamId) {
                            colObjs.push({
                                type: 'npc',
                                obstacleType: npc.type,
                                collidable: npc.collidable,
                                point: _res2.point,
                                normal: _res2.normal
                            });
                            this.hitIds[npc.__id] = true;
                        }
                    } else {
                        var _res3 = collider.intersectSegment(npc.collider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);

                        if (_res3 && shooterInfo.teamId != npc.teamId) {
                            var _distance = v2.length(v2.sub(this.pos, _res3.point));
                            if (_distance <= kCollisionDistance) {
                                colObjs.push({
                                    type: 'npc',
                                    obstacleType: npc.type,
                                    collidable: npc.collidable,
                                    point: _res3.point,
                                    normal: _res3.normal
                                });
                                this.hitIds[npc.__id] = true;
                            }
                        }
                    }
                }

                // Players
                for (var _j2 = 0; _j2 < this.BulletManager.players.length; _j2++) {
                    var player = this.BulletManager.players[_j2];

                    // @TODO: Bullets killing the player won't display
                    //        proper hit effects
                    if (!player.active || player.m_netData.m_dead || !util.sameLayer(player.m_netData.m_layer, this.layer) && !(player.m_netData.m_layer & 0x2)) {
                        continue;
                    }
                    if (player.__id == this.playerId && !this.damageSelf) {
                        continue;
                    }

                    if (!this.hitIds[player.__id]) {
                        if (!this.updateFromServer) {
                            var _res4 = coldet.intersectSegmentAabb(this.aabbCollider.pts[0], this.aabbCollider.pts[1], player.collider.min, player.collider.max);

                            if (_res4) {
                                colObjs.push({
                                    type: 'player',
                                    player: player,
                                    point: _res4.point,
                                    normal: _res4.normal,
                                    layer: player.layer,
                                    collidable: true
                                });
                                this.hitIds[player.__id] = true;
                            }
                        } else if (!this.m_active) {
                            var _res5 = coldet.intersectSegmentAabb(this.aabbCollider.pts[0], this.aabbCollider.pts[1], player.collider.min, player.collider.max);

                            if (_res5) {
                                var _distance2 = v2.length(v2.sub(this.pos, _res5.point));
                                if (_distance2 <= kCollisionDistance) {
                                    colObjs.push({
                                        type: 'player',
                                        player: player,
                                        point: _res5.point,
                                        normal: _res5.normal,
                                        layer: player.layer,
                                        collidable: true
                                    });
                                    this.hitIds[player.__id] = true;
                                }
                            }
                        }
                    }

                    //Destroy bullet on melee attack
                    if (player.WeaponManager.currentAttack && (player.WeaponManager.mainWeaponDef.type == 'melee' || player.WeaponManager.currentAttack.attackDef.type == 'melee') && player.anim.damageTimes) {
                        var damageTimes = player.anim.damageTimes;
                        for (var k = 0; k < damageTimes.length; k++) {
                            var damageTime = damageTimes[k];

                            if (!damageTime.active) {
                                continue;
                            }

                            var meleeAttackCollider = player.getMeleeCollider();
                            var intersection = coldet.intersectSegmentAabb(this.aabbCollider.pts[0], this.aabbCollider.pts[1], meleeAttackCollider.min, meleeAttackCollider.max);

                            if (!intersection) {
                                continue;
                            }

                            this.active = false;
                            this.collided = true;

                            colObjs.push({
                                type: 'melee',
                                point: v2.add(intersection.point, v2.mul(intersection.normal, 0.1)),
                                normal: intersection.normal,
                                layer: player.layer,
                                collidable: true
                            });

                            break;
                        }
                    }
                }

                // Collision hit response
                var shooterDead = false;
                var shooter = this.BulletManager.playerBarn.m_getPlayerById(this.playerId);
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
                    return a.dist - _this.dist;
                });
                checkObjs = colObjs;

                for (var _j4 = 0; _j4 < checkObjs.length; _j4++) {
                    var _col = checkObjs[_j4];

                    if (_col.type == 'obstacle') {
                        var mapDef = MapObjectDefs[_col.obstacleType];
                        this.BulletManager.playHitFx(mapDef.hitParticle, mapDef.sound.bullet, _col.point, _col.normal, this.layer, this.BulletManager.particleBarn, this.BulletManager.audioManager);
                        // Continue travelling if non-collidable
                        hit = _col.collidable;
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
                            var p = v2.sub(_col.point, _player.pos);
                            p.y *= -1.0;
                            this.BulletManager.particleBarn.addParticle('bloodSplat', _player.layer, v2.mul(p, this.BulletManager.camera.ppu), v2.create(0.0, 0.0), 1.0, 1.0, _player.container);
                            this.BulletManager.audioManager.playGroup('player_bullet_hit', {
                                soundPos: _player.pos,
                                fallOff: 1.0,
                                layer: _player.layer,
                                filter: 'muffled'
                            });
                        }
                        hit = _col.collidable;
                    } else if (_col.type == 'npc') hit = true;

                    if (hit && !this.notDestroyOnCollision) {
                        this.pos = _col.point;
                        break;
                    }
                }

                if (this.notDestroyOnCollision) hit = false;
                return hit;
            } else {
                // ------------ Server side collision ------------
                var reflected = false;

                //Obstacle collision
                var nearbyObjs = this.BulletManager.grid.intersectLineSegment(this.aabbCollider.pts[0], this.aabbCollider.pts[1]);
                var colIds = [];
                for (var _j5 = 0; _j5 < nearbyObjs.length; _j5++) {
                    var o = nearbyObjs[_j5];

                    var exploProjectile = o.__type === GameObject.Type.Projectile && o.damageCollision;

                    if (!exploProjectile && (o.__type != GameObject.Type.Obstacle && o.__type != GameObject.Type.Npc || o.dead || o.height < GameConfig.bullet.height || !util.sameLayer(o.layer, this.layer)) || this.hitIds[o.__id]) {
                        continue;
                    }

                    var _res6 = collider.intersectSegment(o.collider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);

                    var _shooterInfo = this.BulletManager.playerBarn.getPlayerById(this.playerId);
                    var playerTeamId = 999;
                    if (_shooterInfo) {
                        playerTeamId = _shooterInfo.teamId;
                    }
                    if (_res6 && playerTeamId != o.teamId) {
                        colIds.push({
                            id: o.__id,
                            pos: _res6.point,
                            nrm: _res6.normal
                        });
                        this.hitIds[o.__id] = true;
                    }
                }
                if (colIds && colIds.length > 0) {
                    // Sort colliding objects by distance
                    for (var _j6 = 0; _j6 < colIds.length; _j6++) {
                        var _col2 = colIds[_j6];
                        _col2.dist = v2.length(v2.sub(_col2.pos, posOld));
                    }
                    colIds.sort(function (a, b) {
                        return a.dist - b.dist;
                    });

                    var colIdx = 0;
                    while (this.active && colIdx < colIds.length) {
                        var _col3 = colIds[colIdx];
                        colIdx++;

                        var obj = this.BulletManager.objectReg.idToObj[_col3.id];
                        if (!obj || obj.dead || obj.__id == this.reflectObjId) {
                            continue;
                        }
                        if (obj.collidable && false) {
                            //Reflect logic (if needed in the future)
                            if (this.BulletManager.tryReflectBullet(this, obj.__id, _col3.pos, _col3.nrm)) {
                                reflected = true;
                            }
                        }

                        if ((obj.collidable || obj.__type === GameObject.Type.Npc) && !obj.dead && !this.notDestroyOnCollision && (!obj.isWall || obj.isWall && obj.attackCollidable)) {
                            this.active = false;
                        }

                        var isObstacle = obj.__type === GameObject.Type.Obstacle;

                        this.BulletManager.dealDamage(this, obj, obj.__id, this.playerId, this.damageType, this.sourceType, this.dir, this.damage, this.isShrapnel, isObstacle, this.bulletType);
                    }
                }

                // Player collision
                var nearbyObjIds = this.BulletManager.grid.intersectAabb_ObjIds(this.aabbCollider);
                for (var _j7 = 0; _j7 < nearbyObjIds.length; _j7++) {
                    var objId = nearbyObjIds[_j7];
                    var type = this.BulletManager.grid.idToType[objId];
                    if (type != GameObject.Type.Player) {
                        continue;
                    }

                    var _p = this.BulletManager.grid.idToObj[objId];
                    if (_p.dead || _p.__id == this.playerId && !this.damageSelf || _p.layer != this.layer && _p.layer < 2) {
                        continue;
                    }

                    //Destroy bullet on melee damage times
                    if (!_p.bot && _p.isMeleeAttacking) {
                        //TODO create a way to check special cases like this
                        var _damageTimes = _p.currentAnimation.damageTimes;
                        if (_damageTimes) {
                            for (var _k2 = 0; _k2 < _damageTimes.length; _k2++) {
                                var _damageTime = _damageTimes[_k2];

                                if (!_damageTime.active) {
                                    continue;
                                }

                                var _meleeAttackCollider = _p.WeaponManager.getMeleeAttackCollider();
                                if (!_meleeAttackCollider) continue;
                                var _intersection = collider.intersectSegment(_meleeAttackCollider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);
                                /*const intersection = collider.intersectRotatedAabb(//TODO use this for rectangle collision
                                    this.aabbCollider, meleeAttackCollider
                                );*/

                                if (!_intersection) {
                                    continue;
                                }

                                this.active = false;
                                break;
                            }
                        }
                    }

                    if (!this.active || this.hitIds[_p.__id]) continue;

                    // Collision with player body
                    var _res7 = collider.intersectSegment(_p.collider, this.aabbCollider.pts[0], this.aabbCollider.pts[1]);
                    /*let res = collider.intersectRotatedAabb(//TODO use this for rectangle collision
                        this.aabbCollider, p.collider
                    );*/

                    // Damage
                    if (_res7) {
                        this.BulletManager.dealDamage(this, _p, _p.__id, this.playerId, this.damageType, this.sourceType, v2.copy(this.dir), this.damage, this.isShrapnel);

                        if (!this.notDestroyOnCollision) {
                            this.active = false;
                            break;
                        } else this.hitIds[_p.__id] = true;
                    }

                    // AjustAim
                    if (!_res7) {
                        var distToPlayer = v2.length(v2.sub(_p.pos, this.pos));
                        var bulletOwner = this.BulletManager.grid.idToObj[this.playerId];
                        if (bulletOwner && bulletOwner.teamId != _p.teamId && distToPlayer < 1.5) {
                            bulletOwner.setTargetAjust(_p.pos);
                        }
                    }
                }

                if (this.notDestroyOnCollision) reflected = false;
                return reflected;
            }
        }

        /**
         * Changes bullet state to deactivated
         */

    }, {
        key: 'stopBullet',
        value: function stopBullet() {
            if (this.BulletManager.isRunningOnClient) this.collided = true;else {
                this.active = false;

                if (this.callback) {
                    console.log("Bullet base callback");
                    this.callback(this.pos);
                }
            }
        }
    }, {
        key: 'playLastState',
        value: function playLastState(callback) {
            var _this2 = this;

            this.lastState = true;

            if (this.spineDef) {
                if (this.spineDef.fizzlePivot) {
                    var _spineDef$fizzlePivot = this.spineDef.fizzlePivot,
                        x = _spineDef$fizzlePivot.x,
                        y = _spineDef$fizzlePivot.y;

                    this.spine.position.set(x, y);
                }
                this.setAnimation(this.spineDef.fizzle);
                setTimeout(function () {
                    callback(_this2);
                }, this.spineDef.fizzleDuration || 250);
            } else callback(this);

            /*@TODO: Use animation events, currently not working, the event is triggered before the animation completes*/
            /*this.spine.state.addListener({ 
                complete: entry => {
                        console.log(entry.isComplete(), entry);
                        //this.spine.timeScale = 0;
                        console.log('animation completed');
                        callback(this);
                    }
            });*/
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.BulletManager.freeSpine(this.spine);
            this.spine = null;
        }
    }]);

    return RectangularHitboxSized;
}();

module.exports = RectangularHitboxSized;
