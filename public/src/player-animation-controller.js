"use strict";


var _getIterator2 = require("./5fd44c02.js");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require("./998a712f.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _assign = require("./81cd031b.js");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * player-animation-controller.js
 * Controls the animations of the player spineObj. Animations: idle, walking, dashing, attacking
 */

var math = require("./math.js");
var GameConfig = require("./gameConfig.js");
var AnimationData = require("./animationData.js");
var StatusEffects = require("./statusEffects.js");

var GameInput = GameConfig.Input;
var AnimObjects = AnimationData.PlayerAnimObjects;
var EnumAttackDef = AnimationData.AttackNumberToId;
var EnumAnimTypes = AnimationData.EnumPlayerAnimType;

// ---------- Helpers ----------
/**
 * Get the name of the input direction
 * @param {Class} input Input class
 * @param {Class} player Class of player
 * @param {Boolean} isActivePlayer If is the current/local player
 * @returns direction name
 */
function getInputDirection(input, player, isActivePlayer) {
    var moveLeft = input.isBindDown(GameInput.MoveLeft) && isActivePlayer;
    var moveRight = input.isBindDown(GameInput.MoveRight) && isActivePlayer;

    if ((player.pos.x < player.posOld.x || moveLeft) && !moveRight) return 'left';

    if ((player.pos.x > player.posOld.x || moveRight) && !moveLeft) return 'right';

    if (player.pos.y > player.posOld.y) return 'up';

    if (player.pos.y < player.posOld.y) return 'down';

    return false;
}

/**
 * Gets the animation object necessary to play an action animation
 * @param {Number} animationType Type from EnumPlayerAnimType (animations-data.js)
 * @param {Class} player Class of player
 * @param {Number} definitionId Id of the definition where is the animation object definition
 * @param {Boolean} offHand If animation if from offHand (used only in Attack type)
 */
function getAnimationObj(animationType, player, definitionId) {
    var offHand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    switch (animationType) {
        case EnumAnimTypes.Attack:
            {
                var definition = EnumAttackDef[definitionId];
                if (!definition) return null;
                var skillsDef = offHand ? player.WeaponManager.offHandDef.skills : player.WeaponManager.mainWeaponDef.attacks;
                if (!skillsDef || !skillsDef[definition]) return null;
                var animationObj = skillsDef[definition].animationObj;
                return animationObj;
            }
        case EnumAnimTypes.Charge_Attack:
            {
                var _definition = EnumAttackDef[definitionId];
                if (!_definition) return null;
                var attackDef = player.WeaponManager.mainWeaponDef.attacks;
                if (!attackDef) return null;
                var _animationObj = (0, _assign2.default)({}, attackDef[_definition].chargeAnimationObj); //Copy object to not modify definition
                _animationObj.animName = player.isMoving && _animationObj.runChargeAnimName ? _animationObj.runChargeAnimName : _animationObj.chargeAnimName;
                return _animationObj;
            }
        case EnumAnimTypes.StatusEffect:
            {
                var effect = StatusEffects.find(function (status) {
                    return status.id === definitionId;
                });
                if (!effect) return null;
                return effect.animationObj;
            }
        case EnumAnimTypes.Throw:
            {
                return AnimObjects[EnumAnimTypes.Throw];
            }
        case EnumAnimTypes.Revive:
            {
                return AnimObjects[EnumAnimTypes.Revive];
            }
        default:
            return null;
    }
}

var PlayerAnimationController = function () {
    function PlayerAnimationController(player) {
        (0, _classCallCheck3.default)(this, PlayerAnimationController);

        this.player = player;
        this.inputBinds = null;
        this.audioManager = null;
        this.isActivePlayer = null;
        this.playerSpineObj = null;

        this.walkingSpeed = 1;
        //Tracks usage:  //TODO tracks not used for now
        // 0: Walking and Idle
        // 1: Actions (Attacks, Dash...)
        // 2: Attack charge
        this.animationsTracks = [{}, {}, {}]; //Has the active animations by track

        this.animDirection = 'right';
        this.lastDirection = 'right';
        this.useInputDirection = true;
        this.updateDirectionWhileAnimating = true;
        this.initialized = false;
    }

    /**
     * Initializate AnimationController class
     * @param {Class} inputBinds Current input binds
     * @param {Class} audioManager Control the audio of the game
     * @param {Boolean} isActivePlayer Is current player (local player)
     */


    (0, _createClass3.default)(PlayerAnimationController, [{
        key: 'init',
        value: function init(inputBinds, audioManager, isActivePlayer) {
            this.initialized = true;

            this.inputBinds = inputBinds;
            this.audioManager = audioManager;
            this.isActivePlayer = isActivePlayer;

            this.playerSpineObj = this.player.spineObj;
            if (this.playerSpineObj) this.setSpineListeners();
        }
    }, {
        key: 'setSpineListeners',
        value: function setSpineListeners() {
            var _this = this;

            this.playerSpineObj.state.addListener({
                event: function event(entry, _event) {
                    if (_event.data.name === 'shot') {
                        _this.updateDirectionWhileAnimating = false;
                    }
                }
            });
        }

        /**
         * Starts playing a new animation
         * @param {Number} animationType Type from EnumPlayerAnimType (animations-data.js)
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
            if (!this.playerSpineObj || currentAnimation.name === animationObj.animName && currentAnimation.direction === this.animDirection || animationObj.seqId && currentAnimation.animationObj && currentAnimation.animationObj.seqId === animationObj.seqId) return;

            //Direction changes
            if (animationObj.useCursorDirection) {
                this.useInputDirection = false;
                this.updateDirection();
            }

            if (this.updateDirectionWhileAnimating || animationObj.track != 0) this.changeSpineSideDirection();

            if (animationObj.fixedDirection) this.updateDirectionWhileAnimating = false;

            //Play animation        
            var direction = this.animDirection != 'left' && this.animDirection != 'right' ? this.animDirection : 'side';
            var animation = animationObj.notUseDirection ? animationObj.animName : animationObj.animName + '_' + direction;
            var trackEntry = this.playerSpineObj.state.setAnimation(animationObj.track, animation, animationObj.loop);

            //Add listeners to the added/updated track
            if (!animationObj.loop) {
                trackEntry.trackTime = startTime;
                //Complete listener (animation without loop)
                //To check when animation with loop finish it will check the animDuration in the update()
                this.playerSpineObj.state.tracks[animationObj.track].listener = {
                    complete: function complete(entry) {
                        _this2.stopAnimation(animationObj.track);
                        if (animationObj.useCursorDirection) _this2.useInputDirection = true;

                        if (animationObj.nextAnimations && animationObj.nextAnimations.length > 0) {
                            var nextAnim = [].concat((0, _toConsumableArray3.default)(animationObj.nextAnimations)); //Copy array to not modify definition
                            var animObj = nextAnim.shift();
                            if (nextAnim && nextAnim.length > 0) animObj.nextAnimations = nextAnim;

                            if (!animObj.fixedDirection && !animObj.onStopUpdateDirection) _this2.updateDirectionWhileAnimating = true;

                            _this2.playAnimation(animationType, animObj, definitionId);
                        } else {
                            if (animationType == EnumAnimTypes.Attack && _this2.player.WeaponManager.currentAttack && _this2.player.WeaponManager.currentAttack.finishAttack) _this2.player.WeaponManager.currentAttack.finishAttack();

                            if (animationObj.fixedDirection || animationObj.onStopUpdateDirection) _this2.updateDirectionWhileAnimating = true;
                        }
                    }
                };
            }

            //TODO add spine listeners to play the sound if necessary, if not play them by time (on update)

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
         * @param {Number} animationType Type from EnumPlayerAnimType (animations-data.js)
         * @param {Number} definitionId Id of the definition where is the animation object definition
         * @param {Float} startTime Will start animation from this time, Optional: used when need to change direction in mid animation
         * @param {Object} soundInstance Sound animation instance to stop the sound when the animation stops, Optional: used when need to change direction in mid animation
         * @param {Boolean} offHand If animation if from offHand (used only in Attack type)
         */

    }, {
        key: 'playActionAnimation',
        value: function playActionAnimation(animationType, definitionId) {
            var startTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
            var soundInstance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
            var offHand = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

            if (animationType === EnumAnimTypes.Idle) return;

            var animationObj = getAnimationObj(animationType, this.player, definitionId, offHand);

            if (!animationObj) {
                console.error('Player animation obj for type: ', animationType, ' not found');
                return;
            }

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

            if (animation && animation.active) {
                animation.active = false;
                if (animation.soundInstance && (animation.animationObj.sound.stopSoundWithAnim || animation.animationObj.sound.loop)) this.stopSound(animation.soundInstance);
                this.playerSpineObj.state.tracks[track].listeners = [];
                this.playerSpineObj.state.setEmptyAnimation(track, mixTime);
                this.animationsTracks[track] = {};
            }
        }

        /**
         * Updates the active animations
         * @param {Float} dt delta time since last update
         * @param {Boolean} animateDash
         */

    }, {
        key: 'update',
        value: function update(dt, animateDash) {

            if (this.updateDirectionWhileAnimating) {
                this.updateDirection();
                this.changeSpineSideDirection();
            }

            //Track 0 animations
            var animationType = void 0;
            if (!this.player.downed) {
                animationType = EnumAnimTypes.Idle;
                if (this.player.isMoving) animationType = EnumAnimTypes.Walking;
                if (animateDash) animationType = EnumAnimTypes.Dash;
            } else {
                animationType = EnumAnimTypes.IdleDowned;
                if (this.player.isMoving) animationType = EnumAnimTypes.MovingDowned;
            }

            //Play Idle, Walking or Dash if there is not other type playing in track 0
            if (!this.animationsTracks[0].type || this.animationsTracks[0].type === EnumAnimTypes.Idle || this.animationsTracks[0].type === EnumAnimTypes.Walking || this.animationsTracks[0].type === EnumAnimTypes.IdleDowned || this.animationsTracks[0].type === EnumAnimTypes.MovingDowned || this.animationsTracks[0].type === EnumAnimTypes.Dash) this.playAnimation(animationType, AnimObjects[animationType]);

            //Update active animations
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(this.animationsTracks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var track = _step.value;

                    if (!track || !track.active) continue;

                    track.lastTime = track.time;
                    track.time += dt;

                    //Check for sound effects
                    if (track.animationObj.sound && track.animationObj.sound.name && track.animationObj.sound.start != undefined && track.animationObj.sound.start <= track.time && track.animationObj.sound.start >= track.lastTime && !track.soundPlayed) {

                        track.soundPlayed = true;
                        track.soundInstance = this.playSound(track.animationObj.sound.name, track.animationObj.sound.loop);
                    }

                    //Check damage times of attacks
                    if (track.type === EnumAnimTypes.Attack && track.definitionId) {
                        this.checkDamageTimes(track.definitionId, track.time, track.lastTime);
                    }

                    //Check for finish time on loop animations
                    if (track.animationObj.loop && track.finishTime) {
                        if (track.time >= track.finishTime) {
                            this.stopAnimation(track.track);
                            if (track.animationObj.useCursorDirection) this.useInputDirection = true;

                            if (track.animationObj.nextAnimations && track.animationObj.nextAnimations.length > 0) {
                                var nextAnim = [].concat((0, _toConsumableArray3.default)(track.animationObj.nextAnimations)); //Copy array to not modify definition
                                var animObj = nextAnim.shift();
                                if (nextAnim && nextAnim.length > 0) animObj.nextAnimations = nextAnim;

                                if (!animObj.fixedDirection && !animObj.onStopUpdateDirection) this.updateDirectionWhileAnimating = true;

                                this.playAnimation(track.type, animObj, track.definitionId);
                            } else {
                                if (track.type == EnumAnimTypes.Attack && this.player.WeaponManager.currentAttack && this.player.WeaponManager.currentAttack.finishAttack) this.player.WeaponManager.currentAttack.finishAttack();

                                if (track.animationObj.fixedDirection || track.animationObj.onStopUpdateDirection) this.updateDirectionWhileAnimating = true;
                            }
                            continue;
                        }
                    }

                    //Change direction while animating
                    if (track.type !== EnumAnimTypes.Idle && track.type !== EnumAnimTypes.Walking && track.type !== EnumAnimTypes.Dash && track.definitionId && this.updateDirectionWhileAnimating && (this.player.wasMoving != this.player.isMoving || this.lastDirection != this.animDirection)) {

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
         * Get direction of input or cursor and save it in this.animDirection
         */

    }, {
        key: 'updateDirection',
        value: function updateDirection() {
            this.lastDirection = this.animDirection;
            if (this.useInputDirection) {
                //Input direction
                var inputDirection = getInputDirection(this.inputBinds, this.player, this.isActivePlayer);
                this.animDirection = inputDirection ? inputDirection : this.lastDirection;
            } else {
                //Cursor direction
                var angle = math.rad2degFromDirection(this.player.dir.y, this.player.dir.x);
                this.animDirection = this.player.getAngleDirection(angle);
            }
        }

        /**
         * Update side direction with this.animDirection
         */

    }, {
        key: 'changeSpineSideDirection',
        value: function changeSpineSideDirection() {
            if (this.player.bodyContainer.scale.x < 0 && this.animDirection === 'right' || this.player.bodyContainer.scale.x > 0 && this.animDirection === 'left') {
                this.player.bodyContainer.scale.x *= -1;
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
                    channel: 'weapons',
                    soundPos: this.player.pos,
                    fallOff: 1.7,
                    layer: this.player.layer,
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

        /**
         * Will check if the damage times of attack are active and check collisions
         * @param {Number} definitionId Id of the attack
         * @param {Float} time Current anmation time
         * @param {Float} lastTime Last animation time
         */

    }, {
        key: 'checkDamageTimes',
        value: function checkDamageTimes(definitionId, time, lastTime) {
            var definition = EnumAttackDef[definitionId];
            if (!definition) return;

            var skillsDef = this.player.WeaponManager.mainWeaponDef.attacks;

            if (!skillsDef || !skillsDef[definition]) return;

            var damageTimes = skillsDef[definition].damageTimes ? skillsDef[definition].damageTimes : null;

            if (!damageTimes) return;

            for (var i = 0; i < damageTimes.length; i++) {
                var damageTime = damageTimes[i];

                if (typeof damageTime === 'number') {
                    //const damagePos = damageTime / this.anim.data.definition.animDuration;
                    if (damageTime >= lastTime && damageTime < time) {
                        this.player.WeaponManager.checkMeleeCollisionClient();
                        continue;
                    }
                } else {
                    //const damageStart = damageTime.start / this.anim.data.definition.animDuration;
                    //const damageEnd = damageTime.end / this.anim.data.definition.animDuration;
                    if (time >= damageTime.start && time <= damageTime.end) {
                        this.player.WeaponManager.checkMeleeCollisionClient();
                        continue;
                    }
                }
            }
        }
    }]);
    return PlayerAnimationController;
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

module.exports = PlayerAnimationController;
