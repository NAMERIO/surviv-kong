"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PIXI = require("./8b1dfb45.js");

var spineObjManager = function () {
    function spineObjManager(spineData) {
        (0, _classCallCheck3.default)(this, spineObjManager);

        this.spineObjs = [];
        this.spineObjsFx = [];
        this.spineObjsProjectiles = [];
        this.activeSpineObjs = 0;
        this.spineData = spineData;
    }

    /**
     * Return an instance of spine to play a trap animation
     * @param {String} type Spine data type ('hero', 'fx', 'projectile')
     * @returns Spine instance
     */


    (0, _createClass3.default)(spineObjManager, [{
        key: 'getSpine',
        value: function getSpine(type) {
            //TODO add if there are max instances of activeSpineObjs use static sprite if needed (for bullets) 
            //     or do not create spine for the needed animation, to avoid bad performance
            switch (type) {
                case 'hero':
                    this.activeSpineObjs++;

                    if (this.spineObjs.length > 0) return this.spineObjs.pop();

                    return new PIXI.spine.Spine(this.spineData);
                case 'fx':
                    this.activeSpineObjs++;

                    if (this.spineObjsFx.length > 0) return this.spineObjsFx.pop();

                    return new PIXI.spine.Spine(this.spineData.hero_fx);
                case 'projectile':
                    this.activeSpineObjs++;

                    if (this.spineObjsProjectiles.length > 0) return this.spineObjsProjectiles.pop();

                    return new PIXI.spine.Spine(this.spineData.projectiles);
            }
        }

        /**
         * Set the skin and position to the spine
         * @param {Class} behaviour Behaviour that needs the spine
         * @param {String} spineType Spine data type ('hero', 'fx', 'projectile')
         * @returns Spine instance
         */

    }, {
        key: 'setSpine',
        value: function setSpine(behavior, spineType) {
            if (!behavior.spineDef) return false;

            var spine = behavior.spine;
            if (!spine) spine = this.getSpine(spineType);

            if (!spine || spine && !spine.skeleton) return false;

            spine.skeleton.setSkin(null);
            spine.skeleton.setSkinByName(behavior.spineDef.skin || 'default');

            if (behavior.spineDef.pivot) {
                var _behavior$spineDef$pi = behavior.spineDef.pivot,
                    x = _behavior$spineDef$pi.x,
                    y = _behavior$spineDef$pi.y;

                spine.position.set(x, y);
            }

            return spine;
        }

        /**
         * Returns spine instance created to this.spineObjs to be reused if needed again
         * @param {*} spine Spine instance
         * @param {String} type Spine data type ('hero', 'fx', 'projectile')
         */

    }, {
        key: 'freeSpine',
        value: function freeSpine(spine, type) {
            if (!spine || !type) return;
            this.cleanAnimation(spine);
            switch (type) {
                case 'hero':
                    this.spineObjs.push(spine);
                    break;
                case 'fx':
                    this.spineObjsFx.push(spine);
                    break;
                case 'projectile':
                    this.spineObjsProjectiles.push(spine);
                    break;
            }

            this.activeSpineObjs--;
        }

        /**
         * 
         * @param {*} spine Spine instance
         * @param {String} animationName Path of the spine animation
         * @param {function} cbOnComplete Optional callback called when the animation finish
         * @param {Boolean} loop True if animation wants to be looped, Warning: If true, cbOnComplete will not be called unless the animations is forced to end
         * @param {Number} track Track of the animation
         */

    }, {
        key: 'playAnimation',
        value: function playAnimation(spine, animationName) {
            var cbOnComplete = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            var loop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
            var track = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

            if (!spine) return;

            //@HACK Reset spine to be sure that the animation will play
            this.cleanAnimation(spine);

            if (cbOnComplete) {
                spine.state.addListener({
                    complete: function complete(entry) {
                        cbOnComplete();
                    }
                });
            }

            spine.state.setAnimation(track, animationName, loop);
        }
    }, {
        key: 'render',
        value: function render(camera) {}
        //TODO render some active spine objs so can show independent fx if necessary


        /**
         * Stop animation from spine obj
         */

    }, {
        key: 'cleanAnimation',
        value: function cleanAnimation(spine) {
            if (!spine) return;

            if (spine.skeleton) spine.skeleton.setToSetupPose();
            spine.state.listeners = [];
            spine.state.tracks = [];
            spine.state.setEmptyAnimation(0, 1);
            spine.lastTime = null;
        }

        /**
         * Check number on active spine objs and returns if there is available
         * @returns If spine instance can be used
         */

    }, {
        key: 'canUseSpine',
        value: function canUseSpine() {
            //TODO return if can use spine based on max intances
            return true;
        }
    }, {
        key: 'cleanObjs',
        value: function cleanObjs() {
            this.spineObjs = [];
            this.spineObjsFx = [];
            this.spineObjsProjectiles = [];
            this.activeSpineObjs = 0;
        }
    }]);
    return spineObjManager;
}();

module.exports = spineObjManager;
