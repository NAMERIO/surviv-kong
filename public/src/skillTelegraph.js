"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./pixi.js");
var v2 = require("./v2.js");
var collider = require("./collider.js");
var GameObjectDefs = require("./gameObjectDefs.js");
var TrapDefs = require("./trap-defs.js");
var SkillBehaviourEnum = require("./skillsEnum.js");
var TelegraphDefs = require("./telegraphDefs.js");

var ArrowTelegraph = require("./558f3cac.js");
var CircularTelegraph = require("./circularTelegraph.js");

var SkillTelegraphTypes = {
    'arrow': 0,
    'circular': 1
};

var SkillTelegraphSizes = {
    'small': 0,
    'medium': 1,
    'large': 2,
    'default': 3
};

var SkillTelegraph = function () {
    function SkillTelegraph(player) {
        (0, _classCallCheck3.default)(this, SkillTelegraph);

        this.dir = v2.create(0.0, 0.0);
        this.active = false;
        this.followDir = false;
        this.player = player;
        this.telegraphDef = null;
        this.weaponDef = null;
        this.skillDef = null;
        this.telegraph = null;
        this.container = new PIXI.Container();
    }

    (0, _createClass3.default)(SkillTelegraph, [{
        key: 'getTelegraph',
        value: function getTelegraph(def, config, camera) {
            var type = SkillTelegraphTypes[config.type];
            var distance = Math.abs(this.getScreenDistance(camera, v2.create(this.getSkillDistance(type), 0)).x);
            switch (type) {
                case SkillTelegraphTypes.arrow:
                    return new ArrowTelegraph(def, this.container, config.size, distance);
                case SkillTelegraphTypes.circular:
                    {
                        var offset = this.getScreenDistance(camera, this.getSkillStartPoint());
                        return new CircularTelegraph(def, this.container, distance, offset);
                    }
                default:
                    return undefined;
            }
        }
    }, {
        key: 'show',
        value: function show(weaponDef, skillDef, camera) {
            this.hide();
            var config = skillDef.telegraph;

            if (!config || !TelegraphDefs[config.type]) {
                return;
            }
            this.weaponDef = weaponDef;
            this.skillDef = skillDef;
            this.telegraphDef = TelegraphDefs[config.type];

            this.container.rotation = 0;
            this.calculateOffset = !config.doNotCalculateOffset;
            this.followDir = !!(config.followDir || this.telegraphDef.followDir);
            this.directionInverted = !!config.directionInverted;
            this.telegraph = this.getTelegraph(this.telegraphDef, config, camera);
            this.telegraph.show();

            window.telegraph = this;

            this.container.visible = true;
            this.active = true;
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (!this.active) {
                return;
            }

            this.container.visible = false;
            this.telegraph.hide();
            this.container.removeChildren();
            this.active = false;
            this.clear();
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.telegraph = null;
            this.telegraphDef = null;
            this.weaponDef = null;
            this.skillDef = null;
        }
    }, {
        key: 'update',
        value: function update(dt, dir, camera) {
            if (!this.active) return;

            this.dir = dir;

            if (this.telegraph.type === SkillTelegraphTypes.circular && this.followDir) {
                var offset = this.getScreenDistance(camera, this.getSkillStartPoint());
                this.telegraph.offset = offset;
            } else if (this.followDir) {
                if (!this.directionInverted) this.container.rotation = -Math.atan2(this.dir.y, this.dir.x);else this.container.rotation = -Math.atan2(-this.dir.y, -this.dir.x);
            }

            this.telegraph.update(dt, dir);
        }

        /**
         * Returns the distance for the arrow skill using the x axis as the attack follows a straight line direction
         */

    }, {
        key: 'getSkillDistance',
        value: function getSkillDistance(type) {
            var distance = 0;

            var isBullet = !!this.skillDef.bulletType;

            if (isBullet) {
                var barrelLength = type === SkillTelegraphTypes.circular ? 0 : this.weaponDef.barrelLength || 0;
                var bulletDef = GameObjectDefs[this.skillDef.bulletType];
                distance += bulletDef.distance + barrelLength;
            } else if (this.skillDef.behaviourId === SkillBehaviourEnum.DeployTrap) {
                var trapDef = this.skillDef.behaviourParams;
                var hitbox = null;
                if (trapDef.hitbox) {
                    hitbox = trapDef.hitbox;
                } else if (trapDef.trapId && TrapDefs[trapDef.trapId]) {
                    hitbox = TrapDefs[trapDef.trapId].hitbox;
                }

                if (hitbox.type === collider.Type.Aabb) {
                    if (hitbox.x > hitbox.y) distance = hitbox.x;else distance = hitbox.y;
                } else {
                    distance = hitbox.rad;
                }
            } else if (this.skillDef.behaviourId === SkillBehaviourEnum.OrbitalAttack) {
                distance = this.skillDef.behaviourParams.distanceFromPlayer;
            } else if (this.skillDef.explosionType) {
                var explosionDef = GameObjectDefs[this.skillDef.explosionType];
                return explosionDef.rad ? explosionDef.rad.max : 0;
            } else if (this.skillDef.behaviourId === SkillBehaviourEnum.ApplyEffectToNearbyEnemies) {
                var behaviourDef = this.skillDef.behaviourParams;
                distance = behaviourDef.rad;
            } else {
                if (this.skillDef.width) {
                    distance += this.skillDef.width;
                }

                if (this.skillDef.offset) {
                    distance += this.skillDef.offset.x;
                }

                if (this.skillDef.dash && !this.skillDef.dash.doNotTelegraphDash) {
                    distance += this.skillDef.dash.distance;
                }
            }

            return distance;
        }
    }, {
        key: 'getSkillStartPoint',
        value: function getSkillStartPoint() {
            if (!this.calculateOffset) {
                return v2.create(0, 0);
            }

            var weapDef = this.weaponDef;

            var dir = this.player.dir;

            //TODO: @gfallas change this magic number, check how projectile bomb pos is calculated

            if (weapDef.explosionType) {
                return v2.mul(dir, 11.5);
            }
            var gunPos = v2.mul(dir, weapDef.barrelLength);

            return gunPos;
        }

        /**
         * 
         * @param {*} camera 
         * @param {v2} distance Distance in point units
         */

    }, {
        key: 'getScreenDistance',
        value: function getScreenDistance(camera, distance) {
            var screenPos = camera.pointToScreen(this.player.pos);
            var screenPosOffset = camera.pointToScreen(v2.add(this.player.pos, distance));
            var diff = v2.sub(screenPosOffset, screenPos);
            var screenScale = camera.pixels(1.0);
            return v2.div(diff, screenScale);
        }
    }]);
    return SkillTelegraph;
}();

module.exports = SkillTelegraph;
