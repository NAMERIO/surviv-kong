"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * orbitalAttack.js
 * Do a melee attack without any previous special behaviour
 */

var v2 = require("./v2.js");
var util = require("./util.js");
var collider = require("./collider.js");
var SkillsEnum = require("./skillsEnum.js");
var GameConfig = require("./gameConfig.js");
var GameObject = require("./gameObject.js");
var AnimationData = require("./animationData.js");

var Anim = AnimationData.EnumPlayerAnimType;
var AttackToNum = AnimationData.AttackIdToNumber;

var OrbitalAttack = function () {
    /**
     * Constructor
     * @param {Player} player Class of the current player
     * @param {import('./../weaponManager')} weaponManager Class that manages current weapon and attacks
     * @param {Object} attackDef Attack definition, it has the behaviour data
     * @param {Boolean} isOffHand Boolean to know if attack is executed by offhand
     */
    function OrbitalAttack(player, weaponManager, attackDef) {
        var isOffHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        _classCallCheck(this, OrbitalAttack);

        //Obligatory attack attributes
        this.id = SkillsEnum.OrbitalAttack;
        this.isActive = true;
        this.player = player;
        this.attackDef = attackDef;
        this.isOffHand = isOffHand;
        this.WeaponManager = weaponManager;
        this.timeActive = 0;
        this.timeActiveOld = 0;
        if (!this.isOffHand) this.weaponDef = this.WeaponManager.mainWeaponDef;else this.weaponDef = this.WeaponManager.offHandDef;

        //Attack behaviour attributes
        this.orbitalParams = this.attackDef.behaviourParams;
        this.damage = this.orbitalParams.damage;
        this.timeSinceLastDamage = this.orbitalParams.damageFrecuency;
        this.time = 0;

        this.dir = this.player.dir;
        this.offset = v2.mul(this.dir, this.orbitalParams.distanceFromPlayer);
        this.position = v2.add(this.player.pos, this.offset);
        this.layer = this.player.layer;

        this.hitbox = this.orbitalParams.hitbox;
        this.cancelable = this.attackDef.cancelable;

        if (this.hitbox.type == collider.Type.Aabb) {
            var colliderExtend = v2.create(this.hitbox.x, this.hitbox.y);
            this.collider = collider.createAabbExtents(this.position, colliderExtend);
        } else {
            this.collider = collider.createCircle(this.position, this.hitbox.rad);
        }

        this.start();
    }

    /**
     * Start attack
     */


    _createClass(OrbitalAttack, [{
        key: 'start',
        value: function start() {
            if (this.WeaponManager.isRunningOnClient) {
                this.spineDef = this.orbitalParams.spine;
                this.WeaponManager.addAttackVisuals(this, this.orbitalParams);

                if (this.spine && this.spineDef) this.player.SpineObjManager.playAnimation(this.spine, this.spineDef.idle, null, true);
            }
            //
        }

        /**
         * Updates the current attack behaviour
         * @param {float} dt Delta time since the last call to update
         * @param {Object} toMouseLen Has the direction of the client cursor in a vector: {x: float, y: float}, normalized from -1 to 1
         * @param {Object} params Extra params
         */

    }, {
        key: 'update',
        value: function update(dt, toMouseLen, params) {
            this.timeActiveOld = this.timeActive;
            this.timeActive += dt;

            this.dir = this.player.dir;
            this.offset = v2.mul(this.dir, this.orbitalParams.distanceFromPlayer);
            this.position = v2.add(this.player.pos, this.offset);
            this.collider.pos = this.position;
            this.timeSinceLastDamage += dt;

            if (this.WeaponManager.isRunningOnClient) {
                if (this.timeSinceLastDamage >= this.orbitalParams.damageFrecuency) {
                    this.timeSinceLastDamage = 0;
                    this.applyHitEffectWithCollisions();
                }
            }

            this.time += dt;
            if (this.time > this.orbitalParams.duration) this.finishAttack();
            return this.isActive;
        }

        /**
         * Render the attack client side
         * @param {*} camera 
         * @param {*} debug 
         * @param {*} DebugLines 
         */

    }, {
        key: 'render',
        value: function render(camera, debug, DebugLines) {
            if (!this.isActive || !this.hasSprite) return;

            if (util.sameLayer(this.layer, this.player.layer)) {
                var screenPos = camera.pointToScreen(this.collider.pos);
                var screenScale = camera.pixels(this.imgScale);

                this.container.position.set(screenPos.x, screenPos.y);
                this.container.scale.set(screenScale, screenScale);

                var angleRadians = Math.atan2(this.dir.x, this.dir.y);
                this.container.rotation = angleRadians - Math.PI / 2.0;
            }
        }

        /**
         * Changes attack state to finished
         */

    }, {
        key: 'finishAttack',
        value: function finishAttack() {
            if (this.WeaponManager.isRunningOnClient && this.spine) {
                this.freeSpine();
            }

            this.isActive = false;
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.player.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
        }

        /**
         * Check collisions and apply hit effect (client side)
         */

    }, {
        key: 'applyHitEffectWithCollisions',
        value: function applyHitEffectWithCollisions() {
            // Gather colliding obstacles and players
            var colObjs = [];

            // Obstacles
            var shooterInfo = this.WeaponManager.playerBarn.m_getPlayerInfo(this.player.__id);
            var obstacles = this.WeaponManager.map.m_obstaclePool.m_getPool();
            for (var j = 0; j < obstacles.length; j++) {
                var obstacle = obstacles[j];
                if (!obstacle.active || obstacle.dead || !util.sameLayer(obstacle.layer, this.layer) || obstacle.height < GameConfig.bullet.height) {
                    continue;
                }

                if (this.isActive) {
                    var res = collider.intersect(this.collider, obstacle.collider);
                    //TODO Calculate point and normal
                    /*if (res && shooterInfo.teamId != obstacle.teamId) {
                        colObjs.push({
                            type: 'obstacle',
                            obstacleType: obstacle.type,
                            collidable: obstacle.collidable,
                            point: res.point,
                            normal: res.normal
                        });
                    }*/
                }
            }

            /// Npcs
            var npcs = this.WeaponManager.map.m_npcPool.m_getPool();
            for (var _j = 0; _j < npcs.length; _j++) {
                var npc = npcs[_j];
                if (!npc.active || npc.dead || !util.sameLayer(npc.layer, this.layer) || npc.height < GameConfig.bullet.height) {
                    continue;
                }

                if (this.isActive) {
                    var _res = collider.intersect(this.collider, npc.collider);
                    //TODO Calculate point and normal
                    /*
                    if (res && shooterInfo.teamId != npc.teamId) {
                        colObjs.push({
                            type: 'npc',
                            obstacleType: npc.type,
                            collidable: npc.collidable,
                            point: res.point,
                            normal: res.normal
                        });
                    }*/
                }
            }

            // Players
            var players = this.WeaponManager.playerBarn.m_playerPool.m_getPool();
            for (var _j2 = 0; _j2 < players.length; _j2++) {
                var player = players[_j2];

                // @TODO: Bullets killing the player won't display
                //        proper hit effects
                if (!player.active || player.m_netData.m_dead || !util.sameLayer(player.m_netData.m_layer, this.layer) && !(player.m_netData.m_layer & 0x2)) {
                    continue;
                }
                if (player.__id == this.player.__id) {
                    continue;
                }

                if (this.isActive) {
                    var _res2 = collider.intersect(this.collider, player.collider);

                    if (_res2) {
                        colObjs.push({
                            type: 'player',
                            player: player,
                            layer: player.layer,
                            collidable: true
                        });
                    }
                }
            }

            // Collision hit response
            var shooterDead = false;
            var shooter = this.WeaponManager.playerBarn.m_getPlayerById(this.player.__id);
            if (shooter && (shooter.m_netData.m_dead || shooter.m_netData.m_downed)) {
                shooterDead = true;
            }

            var checkObjs = [];
            // Sort colliding objects by distance
            /*for (let j = 0; j < colObjs.length; j++) {
                let col = colObjs[j];
                col.dist = v2.length(v2.sub(col.point, this.collider.pos));
            }
            colObjs.sort((a, b) => {
                return a.dist - b.dist;
            });*/
            checkObjs = colObjs;

            var hit = false;
            for (var _j3 = 0; _j3 < checkObjs.length; _j3++) {
                var col = checkObjs[_j3];

                if (col.type == 'obstacle') {
                    //TODO
                    /*const mapDef = MapObjectDefs[col.obstacleType];
                    playHitFx(
                        mapDef.hitParticle,
                        mapDef.sound.bullet,
                        col.point,
                        col.normal,
                        this.layer,
                        this.WeaponManager.particleBarn,
                        this.WeaponManager.audioManager
                    );*/
                    // Continue travelling if non-collidable
                    hit = col.collidable;
                } else if (col.type == 'player') {
                    // Don't create a hit particle if the shooting
                    // player is dead; this helps avoid confusion around
                    // bullets being inactivated when a player dies.
                    if (!shooterDead) {
                        // Make a hit particle
                        //
                        // @TODO: This is all messed up, need to properly
                        // configure the PIXI stage dims to match
                        // world units
                        var _player = col.player;

                        _player.playSpineFX('hit');

                        this.WeaponManager.audioManager.playGroup('player_bullet_hit', {
                            soundPos: _player.pos,
                            fallOff: 1.0,
                            layer: _player.layer,
                            filter: 'muffled'
                        });
                    } else if (col.type == 'npc') hit = true;
                    hit = col.collidable;
                }
            }
        }
    }]);

    return OrbitalAttack;
}();

module.exports = OrbitalAttack;
