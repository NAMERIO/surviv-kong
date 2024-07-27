"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * trapManager.js
 * Create, update and control all the traps in the current game
 */

var assert = require("./0e566746.js");
var v2 = require("./v2.js");
var util = require("./util.js");
var collider = require("./collider.js");
var GameObject = require("./gameObject.js");
var TrapsBehaviourEnum = require("./trapsBehaviourEnum.js");
var StatusEffect = require("./statusEffect.js");
var TrapDefs = require("./trap-defs.js");
var BehaviourDefaults = require("./trap-behaviour-defaults.js");

//Import behaviours
var BaseTrap = require("./baseTrap.js");
var DamageOverTime = require("./damageOverTime.js");

var TrapManager = function () {
    function TrapManager(playerBarn, isRunningOnClient) {
        var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var explosionBarn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

        _classCallCheck(this, TrapManager);

        this.playerBarn = playerBarn;
        this.isRunningOnClient = isRunningOnClient;
        this.explosionBarn = explosionBarn;

        if (this.isRunningOnClient) {
            this.ctx = params.ctx;
            this.PIXI = params.PIXI;
            this.SpineObjManager = params.SpineObjManager;
        }

        this.nextId = 0; //The id will increment and should not repeat in a game

        this.trapsPool = [];
        this.newTraps = [];
        this.trapsExplosion = [];
        this.removedTraps = [];
    }

    /**
     * Create a new trap based on the behaviour
     * @param {Number} trapDefinitionId id of the trap in trap-defs.js
     * @param {Object} params Params to create the trap: position and layer, optional: ownerId and ownerType (for player or npc)
     * @param {Object} modifiedTrapBehaviourParams Optional, Modified or extra params to overwrite the behaviour params
     */


    _createClass(TrapManager, [{
        key: 'createTrap',
        value: function createTrap(trapDefinitionId, params) {
            var modifiedTrapBehaviourParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var trapDefinition = Object.assign({}, TrapDefs[trapDefinitionId]); //Copy object to prevent modification of def
            assert(trapDefinition.behaviourId, 'Behaviour Id not found for trap id:' + trapDefinitionId);

            var defaultTrapParam = Object.assign({}, BehaviourDefaults[trapDefinitionId]); //Copy to not modify defaults
            trapDefinition.behaviourParams = Object.assign(defaultTrapParam, trapDefinition.behaviourParams); //Add defaults to definition

            if (modifiedTrapBehaviourParams) Object.assign(trapDefinition.behaviourParams, modifiedTrapBehaviourParams); //Add and replace attributes if there are modified trap behaviour params

            params = Object.assign({
                source: 'world',
                teamId: 0,
                ownerId: null,
                ownerType: null,
                position: v2.create(0.0, 0.0),
                layer: 0
            }, params);

            switch (trapDefinition.behaviourId) {
                case TrapsBehaviourEnum.baseTrap:
                    this.trapsPool.push(new BaseTrap(this.nextId, trapDefinition, this, params));
                    break;
                case TrapsBehaviourEnum.DamageOverTime:
                    this.trapsPool.push(new DamageOverTime(this.nextId, trapDefinition, this, params, this.explosionBarn));
                    break;
                default:
                    console.error('Behaviour not found for trap id: ' + trapDefinitionId);
                    return;
            }
            this.nextId += 1;
        }

        /**
         * Update active traps
         * @param {float} dt Delta time since last update
         */

    }, {
        key: 'update',
        value: function update(dt) {
            var removeTraps = [];

            for (var i = 0; i < this.trapsPool.length; i++) {
                var trap = this.trapsPool[i];

                if (this.isRunningOnClient || trap.serialized) {
                    //Do not update until the trap is sent to the client
                    trap.timeActive += dt;
                    trap.update(dt);
                }

                if (trap.explosion) {

                    if (!this.isRunningOnClient) {
                        //Create explotion on server side
                        trap.explote();
                        removeTraps.push(i);
                    } else if (!trap.doNotRemoveTrap) {
                        //Remove trap after animation
                        removeTraps.push(i);
                    }
                } else if ((trap.timeToDisappear && trap.timeActive >= trap.timeToDisappear || !trap.active) && (this.isRunningOnClient || trap.serialized) && !trap.doNotRemoveTrap) {
                    if (!trap.playEndAnimation || trap.playEndAnimation && trap.playEndAnimation()) {
                        removeTraps.push(i);
                    }
                }
            }

            //Remove traps
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = removeTraps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var index = _step.value;

                    if (this.trapsPool[index]) {
                        this.trapsPool[index].clear();
                        this.trapsPool.splice(index, 1);
                    }
                }
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
        }

        /**
         * Search by id and remove the trap from the game
         * @param {Number} id Id assigned to trap when was created
         */

    }, {
        key: 'removeTrapById',
        value: function removeTrapById(id) {
            var length = this.trapsPool.length;

            for (var i = 0; i < length; i++) {
                if (this.trapsPool[i].id === id) {
                    this.trapsPool[i].clear();
                    this.trapsPool.splice(i, 1);
                    break;
                }
            }
        }

        /**
        * Search all the traps with the ownerId and remove them from the game
        * @param {Numbre} ownerId Id of the player or npc in the current game
        */

    }, {
        key: 'removeTrapByOwner',
        value: function removeTrapByOwner(ownerId) {
            var length = this.trapsPool.length;

            for (var i = 0; i < length; i++) {
                if (this.trapsPool[i].ownerId === ownerId) {
                    this.trapsPool[i].clear();
                    this.trapsPool.splice(i, 1);
                }
            }
        }

        /**
         * Search all the traps with the trap definition id and remove them from the game
         * @param {Numbre} trapId Id of the trap type
         */

    }, {
        key: 'exploteTraps',
        value: function exploteTraps(trapId, trapOwner) {

            var length = this.trapsPool.length;
            for (var i = 0; i < length; i++) {
                if (this.trapsPool[i].definition.id === trapId && this.trapsPool[i].ownerId === trapOwner) {
                    this.trapsPool[i].playExplosionAnimation();
                }
            }
        }

        // ------------------- Client side -------------------
        /**
         * Checks if there are collision on the client with the trap collider
         * @param {Object} trapCollider Collider of the trap could be aabb with mix and max or a circle with radius
         * @param {Class} trap Class of the trap behaviour that has all the attributes and functions
         * @returns {Boolean} Returns if a collision with the trap is detected
         */

    }, {
        key: 'checkCollisionsWithTrapClient',
        value: function checkCollisionsWithTrapClient(trapCollider, trap) {
            var collisionDetected = false;

            // Players
            var players = this.playerBarn.m_playerPool.m_getPool();
            var playersLength = players.length;
            for (var j = 0; j < playersLength; j++) {
                var player = players[j];

                if (!player.active || player.m_netData.m_dead || !util.sameLayer(player.m_netData.m_layer, trap.layer) && !(player.m_netData.m_layer & 0x2)) {
                    continue;
                }

                var teamId = this.playerBarn.m_getPlayerInfo(player.__id).teamId;
                if (trap.ownerType == GameObject.Type.Player && (teamId == trap.teamId || player.__id === trap.ownerId)) {
                    continue;
                }

                var res = collider.intersectAabb(trapCollider, player.movementCollider.min, player.movementCollider.max);

                if (res) {
                    trap.applyTrapEffect(player);
                    collisionDetected = true;
                }
            }

            /// Npcs
            var npcs = this.ctx.map.m_npcPool.m_getPool();
            var npcsLength = npcs.length;
            for (var _j = 0; _j < npcsLength; _j++) {
                var npc = npcs[_j];

                if (npc.dead || !util.sameLayer(npc.layer, trap.layer)) {
                    continue;
                }

                if (trap.ownerType == GameObject.Type.Npc && npc.__id === trap.ownerId) {
                    continue;
                }

                var npcCollider = npc.movementCollider;
                if (npcCollider) {
                    var _res = collider.intersectAabb(trapCollider, npcCollider.min, npcCollider.max);

                    if (_res) {
                        trap.applyTrapEffect(npc);
                        collisionDetected = true;
                    }
                }
            }
            return collisionDetected;
        }

        /**
         * Adds the pixi container and sprites for the trap (client side)
         * @param {Class} trap Class of the trap behaviour to add the necessary pixi container and sprites
         * @param {Object} definition Definition of the current trap
         */

    }, {
        key: 'addTrapSprites',
        value: function addTrapSprites(trap, definition) {
            if (!this.SpineObjManager) console.error('Spine Obj Manager is null');
            var useSpine = definition.spine && definition.spine.enabled && this.SpineObjManager && this.SpineObjManager.canUseSpine();
            var useSprite = definition.worldImg;
            var containerCreated = false;

            if (useSpine && definition.spine.spineType) {
                trap.container = new this.PIXI.Container();
                //trap.container.pivot.set(14.5, 0.0);
                trap.spine = this.SpineObjManager.setSpine(trap, definition.spine.spineType);
                if (!trap.spine) return;
                trap.container.addChild(trap.spine);
                trap.imgScale = definition.spine.scale != undefined ? definition.spine.scale : 1;

                containerCreated = true;
                trap.hasSprite = true;
                trap.hasSpine = true;
            } else if (useSprite) {
                trap.container = new this.PIXI.Sprite();
                trap.container.anchor.set(0.5, 0.5);

                trap.sprite = new this.PIXI.Sprite();
                trap.sprite.anchor.set(0.5, 0.5);
                trap.container.addChild(trap.sprite);

                trap.imgScale = definition.worldImg.scale * 1.0 || 1.4;

                var innerScale = definition.worldImg.innerScale || 1.0;
                trap.sprite.scale.set(innerScale, innerScale);
                trap.sprite.texture = this.PIXI.Texture.fromImage(definition.worldImg.sprite);
                trap.sprite.tint = definition.worldImg.tint || 0xffffff;

                trap.container.texture = definition.worldImg.border ? this.PIXI.Texture.fromImage(definition.worldImg.border) : this.PIXI.Texture.EMPTY;

                if (!definition.worldImg.noTint) {
                    if (definition.worldImg.borderTint) {
                        trap.container.tint = definition.worldImg.borderTint;
                    } else {
                        trap.container.tint = 0xffffff;
                    }
                }

                trap.container.visible = true;

                containerCreated = true;
                trap.hasSprite = true;
            }

            if (containerCreated) {
                do {
                    if (this.ctx.renderer) {
                        var showTopOfObstacles = trap.definition.showOnTopOfObstacles;
                        this.ctx.renderer.addPIXIObj(trap.container, trap.layer, showTopOfObstacles ? 20 : 11);
                    }
                } while (!this.ctx.renderer);
            }
        }

        /**
         * Updates the sprites of the trap (Client side)
         * @param {Class} camera 
         * @param {Class} player Current player
         * @param {*} debug 
         * @param {Class} DebugLines Add debug lines
         */

    }, {
        key: 'render',
        value: function render(camera, player, debug, DebugLines) {
            var trapsLength = this.trapsPool.length;

            for (var i = 0; i < trapsLength; i++) {
                var trap = this.trapsPool[i];
                if (!trap.active || trap.doNotUpdate || !trap.container) continue;

                var screenPos = camera.pointToScreen(trap.position);
                var screenScale = camera.pixels(trap.imgScale);

                trap.container.position.set(screenPos.x, screenPos.y);
                trap.container.scale.set(screenScale, screenScale);
            }
        }
    }]);

    return TrapManager;
}();

module.exports = TrapManager;

