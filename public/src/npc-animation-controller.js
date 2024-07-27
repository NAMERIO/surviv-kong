"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require("./998a712f.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * npc-animation-controller.js
 * Controls the animations of the npc spineObj. Animations: idle, walking, attacking
 */

var AnimObjects = require("./animObjects.js");
var Enums = require("./enumNpcAnimations.js");
var defStatusEffects = require("./statusEffects.js");

var EnumNpcAnimations = Enums.EnumNpcAnimations;

// ---------- Helpers ---------- 
/**
* Get the name of the movement direction of the npc
* @param {Class} npc Class of npc
* @returns direction name
*/
function getMovementDirection(npc) {
    var diffX = Math.abs(npc.pos.x - npc.posOld.x);
    var diffY = Math.abs(npc.pos.y - npc.posOld.y);

    if (diffX > diffY) {
        if (npc.pos.x < npc.posOld.x) return 'left';

        if (npc.pos.x > npc.posOld.x) return 'right';
    } else {
        if (npc.pos.y > npc.posOld.y) return 'up';

        if (npc.pos.y < npc.posOld.y) return 'down';
    }

    return false;
}

/**
 * Gets the animation object necessary to play an action animation
 * @param {Number} animationType Type from EnumPlayerAnimType (animations-data.js)
 * @param {Class} npc Class of npc
 * @param {Number} definitionId Id of the definition where is the animation object definition
 * @param {Object} npcDef Definition of the npc
 */
function getAnimationObj(animationType, npc, definitionId, npcDef) {
    switch (animationType) {
        case EnumNpcAnimations.Attack:
            {
                if (!npc.attackDefs) return null;

                var attackDef = npc.attackDefs[definitionId];
                if (!attackDef || !attackDef.animObj) return null;

                return attackDef.animObj;
            }
        case EnumNpcAnimations.Hurt:
            if (!npcDef) return null;

            return npcDef.hurtAnimObj || null;
        case EnumNpcAnimations.Death:
            if (!npcDef) return null;

            return npcDef.deathAnimObj || null;
        case EnumNpcAnimations.Trap:
            {
                var statusEffect = defStatusEffects.find(function (st) {
                    return st.id === definitionId;
                });
                if (!statusEffect) return null;

                var animObj = statusEffect.npcAnimationObj;
                if (!animObj) return null;

                return animObj;
            }
        default:
            return null;
    }
}

var NpcAnimationController = function () {
    function NpcAnimationController(npc) {
        (0, _classCallCheck3.default)(this, NpcAnimationController);

        this.npc = npc;
        this.audioManager = null;
        this.npcSpineObj = null;
        this.npcDef = null;

        this.walkingSpeed = 1;
        //Tracks usage: //TODO tracks not used for now
        // 0: Walking and Idle
        // 1: Actions (Attacks)
        // 2: Attack charge
        this.animationsTracks = [{}, {}, {}]; //Has the active animations by track

        this.animDirection = 'right';
        this.lastDirection = 'right';
        this.updateDirectionWhileAnimating = true;

        this.initialized = false;
    }

    /**
     * Initializate AnimationController class
     * @param {Class} audioManager Control the audio of the game
     * @param {Boolean} isActivePlayer Is current player (local player)
     */


    (0, _createClass3.default)(NpcAnimationController, [{
        key: 'init',
        value: function init(audioManager) {
            this.initialized = true;

            this.audioManager = audioManager;

            this.npcSpineObj = this.npc.spineObj;
            this.npcspineFxObj = this.npc.spineFxObj;
            if (this.npcSpineObj) this.setSpineListeners();
        }
    }, {
        key: 'setSpineListeners',
        value: function setSpineListeners() {
            var _this = this;

            this.npcSpineObj.state.addListener({
                event: function event(entry, _event) {
                    if (_event.data.name === 'shot') {
                        _this.updateDirectionWhileAnimating = false;
                    }
                }
            });
        }

        /**
         * Starts playing a new animation
         * @param {Number} animationType Type from EnumNpcAnimations
         * @param {Object} animationObj Object with the necessary attributes to play the animation
         * @param {Number} definitionId Id of definition where is the animation obj, Optional: used if needed to change direction in mid animation
         * @param {Float} startTime Will start animation from this time, Optional: used when need to change direction in mid animation
         * @param {Object} soundInstance Sound animation instance to stop the sound when the animation stops, Optional: used when need to change direction in mid animation
         */

    }, {
        key: 'playAnimation',
        value: function playAnimation(animationType, animationObj) {
            var definitionId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var _this2 = this;

            var startTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
            var soundInstance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

            var currentAnimation = this.animationsTracks[animationObj.track];
            if (!this.npcSpineObj || currentAnimation.name === animationObj.animName && currentAnimation.direction === this.animDirection || animationObj.seqId && currentAnimation.animationObj && currentAnimation.animationObj.seqId === animationObj.seqId) return;

            if (this.updateDirectionWhileAnimating || animationObj.track != 0) this.changeSpineSideDirection();

            if (animationObj.fixedDirection) this.updateDirectionWhileAnimating = false;

            //Play animation        
            var direction = this.animDirection != 'left' && this.animDirection != 'right' ? this.animDirection : 'side';
            var animation = animationObj.notUseDirection ? animationObj.animName : animationObj.animName + '_' + direction;
            var trackEntry = this.npcSpineObj.state.setAnimation(animationObj.track, animation, animationObj.loop);

            //Add listeners to the added/updated track
            if (!animationObj.loop) {
                trackEntry.trackTime = startTime;
                //Complete listener (animation without loop)
                //To check when animation with loop finish it will check the animDuration in the update()
                this.npcSpineObj.state.tracks[animationObj.track].listener = {
                    complete: function complete(entry) {
                        _this2.stopAnimation(animationObj.track);

                        if (animationObj.nextAnimations && animationObj.nextAnimations.length > 0) {
                            var nextAnim = [].concat((0, _toConsumableArray3.default)(animationObj.nextAnimations)); //Copy array to not modify definition
                            var animObj = nextAnim.shift();
                            if (nextAnim && nextAnim.length > 0) animObj.nextAnimations = nextAnim;

                            if (!animObj.fixedDirection && !animObj.onStopUpdateDirection) _this2.updateDirectionWhileAnimating = true;

                            _this2.playAnimation(animationType, animObj, definitionId);
                        } else {
                            if (animationObj.fixedDirection || animationObj.onStopUpdateDirection) _this2.updateDirectionWhileAnimating = true;
                        }
                    }
                };
            }

            //Update current animation tracks
            this.animationsTracks[animationObj.track] = new activeTrack(startTime, animationType, animationObj, trackEntry, this.animDirection);

            //Optional attributes
            if (definitionId) this.animationsTracks[animationObj.track].definitionId = definitionId;

            if (soundInstance) {
                this.animationsTracks[animationObj.track].soundPlayed = true;
                this.animationsTracks[animationObj.track].soundInstance = soundInstance;
            }
        }

        /**
         * Will play an animation that has an specific action, will search the definition to get the animation based on the action
         * @param {Number} animationType Type from EnumNpcAnimations
         * @param {Number} definitionId Id of the definition where is the animation object definition
         * @param {Float} startTime Will start animation from this time, Optional: used when need to change direction in mid animation
         * @param {Object} soundInstance Sound animation instance to stop the sound when the animation stops, Optional: used when need to change direction in mid animation
         */

    }, {
        key: 'playActionAnimation',
        value: function playActionAnimation(animationType, definitionId) {
            var startTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var soundInstance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

            if (animationType === EnumNpcAnimations.Idle) {
                return;
            }

            var animationObj = getAnimationObj(animationType, this.npc, definitionId, this.npcDef);

            if (!animationObj) {
                console.error('Npc animation obj for type: ', animationType, ' not found');
                return;
            }
            this.stopAnimation(0);

            this.playAnimation(animationType, animationObj, definitionId, startTime, soundInstance);
        }

        /**
         * Stops the specified animation
         */

    }, {
        key: 'stopAnimation',
        value: function stopAnimation(track) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var mixTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.1;

            var animation = this.animationsTracks[track];

            if (type && type != animation.type) return;

            if (animation.type === EnumNpcAnimations.Attack) this.npc.resetAttackValues();

            if (animation && animation.active) {
                animation.active = false;
                if (animation.soundInstance && (animation.animationObj.sound.stopSoundWithAnim || animation.animationObj.sound.loop)) this.stopSound(animation.soundInstance);
                this.npcSpineObj.state.tracks[track].listeners = [];
                this.npcSpineObj.state.setEmptyAnimation(track, mixTime);
                this.animationsTracks[track] = {};
            }
        }

        /**
         * Updates the active animations
         * @param {Float} dt delta time since last update
         */

    }, {
        key: 'update',
        value: function update(dt) {
            if (this.updateDirectionWhileAnimating) {
                this.updateDirection();
                this.changeSpineSideDirection();
            }

            //Track 0 animations
            var animationType = EnumNpcAnimations.Idle;
            if (this.npc.isMoving) animationType = EnumNpcAnimations.Walking;

            //Play Idle, Walking if there is not other type playing in track 0
            if (!this.animationsTracks[0].type || this.animationsTracks[0].type === EnumNpcAnimations.Idle || this.animationsTracks[0].type === EnumNpcAnimations.Walking) this.playAnimation(animationType, AnimObjects[animationType]);

            //Update active animations
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.animationsTracks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var track = _step.value;

                    if (!track || !track.active) continue;

                    //Check for sound effects
                    if (track.animationObj.sound && track.animationObj.sound.name && track.animationObj.sound.start != undefined && track.animationObj.sound.start <= track.time && track.animationObj.sound.start >= track.lastTime && !track.soundPlayed) {

                        track.soundPlayed = true;
                        track.soundInstance = this.playSound(track.animationObj.sound.name, track.animationObj.sound.loop);
                    }

                    track.lastTime = track.time;
                    track.time += dt;

                    //Check for finish time on loop animations
                    if (track.animationObj.loop && track.finishTime) {
                        if (track.time >= track.finishTime) {
                            this.stopAnimation(track.track);

                            if (track.animationObj.nextAnimations && track.animationObj.nextAnimations.length > 0) {
                                var nextAnim = [].concat((0, _toConsumableArray3.default)(track.animationObj.nextAnimations)); //Copy array to not modify definition
                                var animObj = nextAnim.shift();
                                if (nextAnim && nextAnim.length > 0) animObj.nextAnimations = nextAnim;

                                if (!animObj.fixedDirection && !animObj.onStopUpdateDirection) this.updateDirectionWhileAnimating = true;

                                this.playAnimation(track.type, animObj, track.definitionId);
                            } else {
                                if (track.animationObj.fixedDirection || track.animationObj.onStopUpdateDirection) this.updateDirectionWhileAnimating = true;
                            }
                            continue;
                        }
                    }

                    //Change direction while animating
                    if (track.type !== EnumNpcAnimations.Idle && track.type !== EnumNpcAnimations.Walking && track.definitionId && this.updateDirectionWhileAnimating && (this.npc.wasMoving != this.npc.isMoving || this.lastDirection != this.animDirection)) {

                        this.playActionAnimation(track.type, track.definitionId, track.time, track.soundInstance);
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
         * Get direction of the movement and save it in this.animDirection
         */

    }, {
        key: 'updateDirection',
        value: function updateDirection() {
            this.lastDirection = this.animDirection;
            if (!this.npc.isAttacking) {
                //Movement direction
                var movementDirection = getMovementDirection(this.npc);
                this.animDirection = movementDirection ? movementDirection : this.lastDirection;
            } else {
                //Attack direction
                var attackDirection = this.npc.animDirection != undefined ? Enums.EnumDirToName[this.npc.animDirection] : null;
                this.animDirection = attackDirection ? attackDirection : this.lastDirection;
                this.npc.animDirection = undefined;
            }
        }

        /**
         * Update side direction with this.animDirection
         */

    }, {
        key: 'changeSpineSideDirection',
        value: function changeSpineSideDirection() {
            if (this.npc.bodyContainer && this.npc.bodyContainer.scale.x < 0 && this.animDirection === 'right' || this.npc.bodyContainer.scale.x > 0 && this.animDirection === 'left') {
                this.npc.bodyContainer.scale.x *= -1;
                return true;
            }
            return false;
        }

        /**
         * Plays the sound a sound in the sfx channel
         * @param {String} animationSoundName Name of the sound to play
         * @param {Boolean} loop Loop sound or not
         */

    }, {
        key: 'playSound',
        value: function playSound(animationSoundName) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (animationSoundName) {
                return this.audioManager.playSound(animationSoundName, {
                    channel: 'monsters',
                    soundPos: this.npc.pos,
                    fallOff: 1.7,
                    layer: this.npc.layer,
                    filter: 'muffled',
                    loop: loop
                });
            }
        }

        /**
         * Will stop a sound instace, active in the audioManager
         * @param {*} instance 
         */

    }, {
        key: 'stopSound',
        value: function stopSound(instance) {
            this.audioManager.stopSound(instance);
        }
    }, {
        key: 'playSpineFX',
        value: function playSpineFX(animationName) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var timeScale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

            if (!this.npcspineFxObj) return;
            this.npcspineFxObj.visible = true;
            this.npcspineFxObj.state.timeScale = timeScale;
            this.npcspineFxObj.state.setAnimation(0, animationName, loop);
        }

        /**
         * Set animations mixes for transitions
         * TODO not used yet, check if this will be needed
         */

    }, {
        key: 'mixAnimations',
        value: function mixAnimations() {
            //TODO if not needed delete
            //TODO modify to work with the tracks
            this.spineObj.stateData.setMix('walk_side', 'idle_side', 0.2);
            this.spineObj.stateData.setMix('walk_side', 'walk_down', 0.2);
            this.spineObj.stateData.setMix('walk_down', 'walk_side', 0.2);
            this.spineObj.stateData.setMix('walk_up', 'walk_side', 0.2);
            this.spineObj.stateData.setMix('walk_side', 'walk_up', 0.2);
            this.spineObj.stateData.setMix('idle_side', 'walk_side', 0.1);
            this.spineObj.stateData.setMix('idle_side', 'attack_melee_light_side', 0.1);
            this.spineObj.stateData.setMix('idle_side', 'attack_melee_light_up', 0.1);
            this.spineObj.stateData.setMix('idle_side', 'attack_melee_light_down', 0.1);
        }
    }]);
    return NpcAnimationController;
}();

/**
 * activeTrack
 * Class that have the data of the active track/animation
 */


var activeTrack = function activeTrack(startTime, animationType, animationObj, trackEntry, direction) {
    (0, _classCallCheck3.default)(this, activeTrack);

    this.active = true;
    this.time = startTime;
    this.type = animationType;
    this.lastTime = startTime;
    this.direction = direction;
    this.trackEntry = trackEntry;
    this.track = animationObj.track;
    this.animationObj = animationObj;
    this.name = animationObj.animName;
    this.finishTime = animationObj.animDuration;
};

module.exports = NpcAnimationController;
