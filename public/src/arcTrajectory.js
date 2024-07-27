"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * arcTrajectory.js
 * This controls a bullet that have an arc trajectory
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

var ArcTrajectory = function () {
    /**
     * Constructor
     * @param {bulletBarn} bulletManager Class that manages all the bullets active
     * @param {Number} id Id of bullet in bulletBarn
     * @param {Object} params Object with all the necessary parameters to control the bullet
     */
    function ArcTrajectory(bulletManager, id, params) {
        _classCallCheck(this, ArcTrajectory);

        this.id = id;
        this.behaviourId = BehaviourEnum.ArcTrajectory;
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


    _createClass(ArcTrajectory, [{
        key: 'reset',
        value: function reset(id, params) {
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
                if (params.bulletDef.worldImg) {
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
                    this.sprite.alpha = 1.0;
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
                this.callback = params.callback;

                this.posLine = v2.copy(params.pos);

                //Calculate the middle point to draw the arc
                this.bezierCurveMiddlePoint = BehaviourMethods.getMiddlePointForBezierCurve(this);
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

                    //v2.set(this.pos, v2.add(this.pos, v2.mul(this.dir, moveDist)));
                    v2.set(this.posLine, v2.add(this.posLine, v2.mul(this.dir, moveDist)));

                    //Add projectile behaviour
                    var newPos = BehaviourMethods.addArcMovement(this);
                    v2.set(this.pos, newPos);

                    v2.set(this.pos, this.BulletManager.map.clampToMapBounds(this.pos));

                    var oldT = this.moveT;
                    this.moveT = v2.length(v2.sub(this.posLine, this.startPos)) / this.distance;

                    var reflected = this.checkCollissions(posOld, oldT);
                    reflected = this.BulletManager.checkDefaultCollisions(this, posOld, oldT);

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
                        this.active = false;
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
                    console.log("Bullet base callback");
                    this.callback(this.pos);
                }
            }
        }
    }]);

    return ArcTrajectory;
}();

module.exports = ArcTrajectory;
