"use strict";


var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var math = require("./10899aea.js");

//
// Ambience
//

var Ambience = function () {
    function Ambience() {
        var _this = this;

        (0, _classCallCheck3.default)(this, Ambience);

        this.introMusic = true;
        this.soundUpdateThrottle = 0.0;

        this.tracks = [];
        this.trackToIdx = {};

        var addTrack = function addTrack(name, sound, channel, immediateMode) {
            _this.tracks.push({
                name: name,
                sound: sound,
                channel: channel,
                immediateMode: immediateMode,
                inst: null,
                instSound: '',
                fitler: '',
                weight: 0.0,
                volume: 0.0
            });
            _this.trackToIdx[name] = _this.tracks.length - 1;
        };

        // Added in order of weight from least to greatest
        addTrack('music', 'menu_music', 'music', false);
        addTrack('wind', 'ambient_wind_01', 'ambient', false);
        addTrack('river', 'ambient_stream_01', 'ambient', false);
        addTrack('waves', 'ambient_waves_01', 'ambient', false);
        addTrack('interior_0', '', 'ambient', true);
        addTrack('interior_1', '', 'ambient', true);

        this.initTime = Date.now();
    }

    (0, _createClass3.default)(Ambience, [{
        key: 'getTrack',
        value: function getTrack(name) {
            return this.tracks[this.trackToIdx[name]];
        }
    }, {
        key: 'onGameStart',
        value: function onGameStart() {
            this.introMusic = false;

            for (var i = 0; i < this.tracks.length; i++) {
                this.tracks[i].weight = 0.0;
            }
            this.getTrack('wind').weight = 1.0;

            this.soundUpdateThrottle = 0.0;
        }
    }, {
        key: 'onGameComplete',
        value: function onGameComplete(audioManager) {
            for (var i = 0; i < this.tracks.length; i++) {
                var track = this.tracks[i];
                if (track.immediateMode) {
                    track.weight = 0.0;
                }
            }
            // Also stop the river track when on the main-menu; it's a little
            // unpleasant to listen to at full volume while idling
            this.getTrack('river').weight = 0.0;
        }
    }, {
        key: 'update',
        value: function update(dt, audioManager, inGame) {
            var updateVolume = false;
            this.soundUpdateThrottle -= dt;
            if (this.soundUpdateThrottle <= 0.0) {
                this.soundUpdateThrottle = 0.2;
                updateVolume = true;
            }

            var totalVolume = 0.0;
            for (var i = this.tracks.length - 1; i >= 0; i--) {
                var track = this.tracks[i];

                // Start sound if it's loaded
                if (!track.inst && track.sound && audioManager.isSoundLoaded(track.sound, track.channel)) {
                    console.log('Start track', track.sound, track.channel);
                    track.inst = audioManager.playSound(track.sound, {
                        channel: track.channel,
                        startSilent: true,
                        loop: track.channel == 'ambient',
                        forceStart: true,
                        filter: track.filter,
                        forceFilter: true
                    });
                    track.instSound = track.sound;

                    if (i == 0) {
                        console.log('Play delay', Date.now() - this.initTime);
                    }
                }

                // Update sound volume
                if (track.inst && updateVolume) {
                    // Compute volume based on weight
                    var volume = track.weight * (1.0 - totalVolume);
                    totalVolume += volume;
                    track.volume = volume;

                    var defVolume = audioManager.getSoundDefVolume(track.sound, track.channel);
                    audioManager.setVolume(track.inst, volume * defVolume, track.channel);
                }

                // Stop sound if it's no longer set and audible, or
                // of the track name has changed
                if (track.inst && (!track.sound && math.eqAbs(audioManager.getVolume(track.inst), 0.0) || track.sound && track.sound != track.instSound)) {
                    console.log('Stop track', track.name, track.channel);
                    audioManager.stopSound(track.inst);
                    track.inst = null;
                    track.instSound = '';
                }

                // Reset immediate-mode sounds
                if (track.immediateMode) {
                    track.sound = '';
                    track.weight = 0.0;
                }
            }

            if (this.introMusic) {
                // Fade in the music track
                var music = this.getTrack('music');
                if (music.inst) {
                    music.weight = math.min(music.weight + dt, 1.0);
                }

                // Fade in wind after the music finishes playing
                var wind = this.getTrack('wind');
                if (music.inst && !audioManager.isSoundPlaying(music.inst)) {
                    wind.weight = math.min(wind.weight + dt, 1.0);
                }
            }
        }
    }]);
    return Ambience;
}();

module.exports = Ambience;
