"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * sinusoidalBullet.js
 * This controls a bullet without special behaviour
 */

//Imports
var v2 = require("./v2.js");
var util = require("./util.js");
var math = require("./math.js");
var collider = require("./collider.js");
var GameObject = require("./gameObject.js");
var GameConfig = require("./gameConfig.js");
var BehaviourEnum = require("./behaviourEnum.js");
var BehaviourMethods = require("./projectile-behaviours-methods.js");

var SinusoidalBullet = function () {
    /**
     * Constructor
     * @param {bulletBarn} bulletManager Class that manages all the bullets active
     * @param {Number} id Id of bullet in bulletBarn
     * @param {Object} params Object with all the necessary parameters to control the bullet
     */
    function SinusoidalBullet(bulletManager, id, params) {
        _classCallCheck(this, SinusoidalBullet);

        this.id = id;
        this.behaviourId = BehaviourEnum.SinusoidalBullet;
        this.BulletManager = bulletManager;
        this.isRunningOnClient = bulletManager.isRunningOnClient;

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


    _createClass(SinusoidalBullet, [{
        key: 'reset',
        value: function reset(id, params) {
            //Common attributes between client and server
            this.BulletManager.addDefaultAttributes(this, id, params);

            if (this.isRunningOnClient) {
                // ------------ Client side ------------
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
                this.skipCollision = !!params.bulletDef.skipCollision;
                this.isShrapnel = params.bulletDef.shrapnel;
                this.numberOfBullet = params.behaviourParams.bulletAttackCount;
                this.distanceTraveled = 0;
                this.callback = params.callback;
            }

            this.start();
            return this;
        }

        /**
         * Start bullet
         */

    }, {
        key: 'start',
        value: function start() {
            this.isNew = false;
            if (this.isRunningOnClient) {
                // ------------ Client side ------------
                if (this.spine && this.spineDef) {
                    this.setAnimation(this.spineDef.idle, true);
                }
                //
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
                if (this.isRunningOnClient) {
                    // ------------ Client side ------------
                    this.BulletManager.defaultUpdate(dt, this);
                } else {
                    // ------------ Server side ------------
                    // Move
                    var posOld = v2.copy(this.pos);
                    var distLeft = this.distance - v2.length(v2.sub(this.startPos, this.pos));
                    var moveDist = math.min(distLeft, dt * this.speed);
                    this.distanceTraveled += moveDist;

                    v2.set(this.pos, v2.add(this.pos, v2.mul(this.dir, moveDist)));

                    v2.set(this.pos, this.BulletManager.map.clampToMapBounds(this.pos));

                    //Add projectile behaviour
                    var newPos = BehaviourMethods.addSinusoidalMovement(this, dt);
                    v2.set(this.pos, newPos);

                    var oldT = this.moveT;
                    this.moveT = v2.length(v2.sub(this.pos, this.startPos)) / this.distance;

                    var reflected = this.checkCollissions(posOld, oldT);
                    reflected = this.BulletManager.checkDefaultCollisions(this, posOld, oldT);

                    //Check if bullet has reached the maximun distance
                    if (math.eqAbs(moveDist, 0.0) || this.moveT >= 1.0) {
                        // this.active = false;
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
         * @returns {Boolean} Return if the bullet was reflected
         */

    }, {
        key: 'checkCollissions',
        value: function checkCollissions(posOld, oldT) {
            var reflected = false;
            var nearbyObjs = this.BulletManager.grid.intersectLineSegment(posOld, this.pos);

            //Obstacle collision
            var colIds = [];
            for (var j = 0; j < nearbyObjs.length; j++) {
                var o = nearbyObjs[j];

                var exploProjectile = o.__type === GameObject.Type.Projectile && o.damageCollision;

                if (!exploProjectile && (o.__type != GameObject.Type.Obstacle && o.__type != GameObject.Type.Npc || o.dead || o.height < GameConfig.bullet.height || !util.sameLayer(o.layer, this.layer))) {
                    continue;
                }

                var res = collider.intersectSegment(o.collider, posOld, this.pos);

                var shooterInfo = this.BulletManager.playerBarn.getPlayerById(this.playerId);
                var playerTeamId = 999;
                if (shooterInfo) {
                    playerTeamId = shooterInfo.teamId;
                }
                if (res && playerTeamId != o.teamId) {
                    colIds.push({
                        id: o.__id,
                        pos: res.point,
                        nrm: res.normal
                    });
                }
            }
            if (colIds && colIds.length > 0) {
                // Sort colliding objects by distance
                for (var _j = 0; _j < colIds.length; _j++) {
                    var col = colIds[_j];
                    col.dist = v2.length(v2.sub(col.pos, posOld));
                }
                colIds.sort(function (a, b) {
                    return a.dist - b.dist;
                });

                var colIdx = 0;
                while (this.active && colIdx < colIds.length) {
                    var _col = colIds[colIdx];
                    colIdx++;

                    var obj = this.BulletManager.objectReg.idToObj[_col.id];
                    if (!obj || obj.dead || obj.__id == this.reflectObjId) {
                        continue;
                    }

                    if (obj.collidable && false) {
                        //Reflect logic (if needed in the future)
                        if (this.BulletManager.tryReflectBullet(this, obj.__id, _col.pos, _col.nrm)) {
                            reflected = true;
                        }
                    }

                    if ((obj.collidable || obj.__type === GameObject.Type.Npc) && !obj.dead && (!obj.isWall || obj.isWall && obj.attackCollidable)) {
                        this.stopBullet();
                    }

                    var isObstacle = obj.__type === GameObject.Type.Obstacle;

                    this.BulletManager.dealDamage(this, obj, obj.__id, this.playerId, this.damageType, this.sourceType, this.dir, this.damage, this.isShrapnel, isObstacle, this.bulletType);
                }
            }

            return reflected;
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
                    this.callback(this.pos);
                }
            }
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
    }, {
        key: 'playLastState',
        value: function playLastState(callback) {
            var _this = this;

            this.lastState = true;
            if (this.spineDef) this.setAnimation(this.spineDef.fizzle);

            setTimeout(function () {
                callback(_this);
            }, 250);

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

    return SinusoidalBullet;
}();

module.exports = SinusoidalBullet;
