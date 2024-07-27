"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * baseTrap.js
 * This trap will be deployed and if detects a collision with a player will apply the status effect defined
 * After certain time, set in the definition, the trap will disappear
 */

var assert = require("./0e566746.js");
var v2 = require("./v2.js");
var collider = require("./collider.js");

var BaseTrap = function () {
    function BaseTrap(id, definition, trapManager, params) {
        _classCallCheck(this, BaseTrap);

        this.id = id;
        this.definition = definition;
        this.TrapManager = trapManager;

        this.active = true;
        this.doNotUpdate = false; //Used client side
        this.position = params.position;
        this.layer = params.layer;
        this.teamId = params.teamId;
        this.ownerId = params.ownerId;
        this.ownerType = params.ownerType;

        this.timeActive = 0;
        this.timeToDisappear = this.definition.timeToDisappear;
        this.hitbox = this.definition.hitbox;

        this.serialized = false;

        if (this.hitbox.type == collider.Type.Aabb) {
            var colliderExtend = v2.create(this.hitbox.x, this.hitbox.y);
            this.collider = collider.createAabbExtents(this.position, colliderExtend);
        } else {
            this.collider = collider.createCircle(this.position, this.hitbox.rad);
        }

        this.deploy();
    }

    /**
     * Deploy the new trap
     */


    _createClass(BaseTrap, [{
        key: 'deploy',
        value: function deploy() {
            if (this.TrapManager.isRunningOnClient) {
                this.spineDef = this.definition.spine;
                this.TrapManager.addTrapSprites(this, this.definition);

                if (this.hasSpine) {
                    this.TrapManager.SpineObjManager.playAnimation(this.spine, this.spineDef.animName, null, true);
                }
            }
        }

        /**
         * Update current trap with this class behaviour
         * @param {float} dt Delta time since last update
         */

    }, {
        key: 'update',
        value: function update(dt) {
            if (!this.active || this.doNotUpdate) return;

            var collisionDetected = void 0;
            if (this.TrapManager.isRunningOnClient) {
                collisionDetected = this.checkCollisionsWithTrapClient();
            }

            if (!this.TrapManager.isRunningOnClient && collisionDetected) {
                this.clear();
            }
        }

        /**
         * Clear the trap before is removed
         */

    }, {
        key: 'clear',
        value: function clear() {
            var animation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this.container) {
                this.container.visible = false;
                if (this.spine) this.freeSpine();
            }
            this.active = false;
        }

        /**
         * Check if there are collisions with trap collider client
         * @returns {Boolean} If collision is detected
         */

    }, {
        key: 'checkCollisionsWithTrapClient',
        value: function checkCollisionsWithTrapClient() {
            return this.TrapManager.checkCollisionsWithTrapClient(this.collider, this);
        }
    }, {
        key: 'applyTrapEffect',
        value: function applyTrapEffect(target) {
            if (this.TrapManager.isRunningOnClient) {
                //Show activation animation
                this.doNotUpdate = true;
                this.clear();
            }
        }
    }, {
        key: 'freeSpine',
        value: function freeSpine() {
            this.container.removeChild(this.spine);
            this.TrapManager.SpineObjManager.freeSpine(this.spine, this.spineDef.spineType);
            this.spine = null;
        }
    }]);

    return BaseTrap;
}();

module.exports = BaseTrap;
