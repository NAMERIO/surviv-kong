"use strict";


var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createjs = require("./createJS.js");
var v2 = require("./v2.js");
var math = require("./10899aea.js");
var util = require("./util.js");
var SoundDefs = require("./soundDefs.js");

var kAudioManagerMinAllowedVolume = 0.003;
var kDiffLayerMult = 0.5;

function AudioManager(options) {
    this.mute = false;
    this.masterVolume = 1.0;
    this.soundVolume = 1.0;
    this.musicVolume = 1.0;

    this.baseVolume = 0.5;

    this.sounds = {};
    this.loadedFiles = {};
    this.preloadedSounds = false;

    this.cameraPos = v2.create(0.0, 0.0);
    this.activeLayer = 0;
    this.underground = false;

    this.soundInstances = [];

    createjs.Sound.volume = 0.5;
    createjs.Sound.on('fileload', this.loadHandler, this);
}

AudioManager.prototype = {
    preloadSounds: function preloadSounds() {
        if (this.preloadedSounds) {
            return;
        }
        this.preloadedSounds = true;

        // Ideally sounds should only be defined once
        var soundNames = {};
        var soundGroups = (0, _keys2.default)(SoundDefs.Sounds);
        for (var i = 0; i < soundGroups.length; i++) {
            var soundGroup = soundGroups[i];
            var soundList = SoundDefs.Sounds[soundGroup];
            var soundListKeys = (0, _keys2.default)(soundList);
            for (var j = 0; j < soundListKeys.length; j++) {
                var soundName = soundListKeys[j];
                if (soundNames[soundName] !== undefined) {
                    console.log('Sound ' + soundName + ' defined multiple times!');
                }
                soundNames[soundName] = true;
            }
        }

        var loadList = [];

        var channelKeys = (0, _keys2.default)(SoundDefs.Channels);
        for (var _i = 0; _i < channelKeys.length; _i++) {
            var channelKey = channelKeys[_i];
            var channel = SoundDefs.Channels[channelKey];

            var sounds = SoundDefs.Sounds[channel.list];
            var soundKeys = (0, _keys2.default)(sounds);
            for (var _j = 0; _j < soundKeys.length; _j++) {
                var key = soundKeys[_j];
                var sound = sounds[key];

                if (sound.preload !== undefined && !sound.preload) {
                    continue;
                }

                var options = {};
                options.canCoalesce = sound.canCoalesce;
                options.channels = sound.maxInstances;
                options.volume = sound.volume;

                loadList.push({
                    name: key,
                    channel: channelKey,
                    path: sound.path,
                    options: options,
                    priority: sound.loadPriority || 0
                });
            }
        }

        loadList.sort(function (a, b) {
            return b.priority - a.priority;
        });

        for (var _i2 = 0; _i2 < loadList.length; _i2++) {
            var _sound = loadList[_i2];
            this.loadSound(_sound);
        }

        var reverbs = SoundDefs.Reverbs;
        var reverbKeys = (0, _keys2.default)(reverbs);
        for (var _i3 = 0; _i3 < reverbKeys.length; _i3++) {
            var _key = reverbKeys[_i3];
            var reverb = reverbs[_key];
            createjs.Sound.registerReverb(reverb.path, _key, reverb);
        }
    },

    loadSound: function loadSound(sound) {
        var name = sound.name + sound.channel;
        if (!this.sounds[name]) {
            createjs.Sound.registerSound(sound.path, name, sound.options || {});

            this.sounds[name] = {
                path: sound.path,
                name: sound.name,
                channel: sound.channel
            };
        }
    },

    loadHandler: function loadHandler(path) {
        this.loadedFiles[path] = true;
    },

    m_update: function m_update(dt) {
        // Clear out finished sounds from stored instances
        for (var i = this.soundInstances.length - 1; i >= 0; i--) {
            var inst = this.soundInstances[i];
            if (inst.instance.playState == 'playFinished' || inst.instance.playState == 'playInterrupted' || inst.instance.playState == 'playFailed') {
                this.soundInstances.splice(i, 1);
            }
        }

        // Update reverb, simply based on the current terrain layer
        var layerVolumeMap = [0.0, 1.0, 1.0 / 3.0, 2.0 / 3.0];
        var reverbVolume = this.underground ? layerVolumeMap[this.activeLayer] : 0.0;
        createjs.Sound.setReverbs({ 'cathedral': reverbVolume });

        // Update the audio backend
        createjs.Sound.update(dt);
    },

    playSound: function playSound(sound) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!sound || sound == 'none') {
            return null;
        }
        options.channel = options.channel || 'activePlayer';
        options.startSilent = options.startSilent || false;
        options.forceStart = options.forceStart || false;
        options.loop = options.loop || false;
        options.soundPos = options.soundPos || null;
        options.fallOff = options.fallOff || 0.0;
        options.filter = options.filter || '';
        options.delay = options.delay || 0.0;
        options.ignoreMinAllowable = options.ignoreMinAllowable || false;
        options.rangeMult = options.rangeMult || 1.0;
        options.offset = options.offset || 0.0;
        options.ambient = options.channel == 'ambient' || options.channel == 'music';
        options.detune = options.detune || 0.0;
        options.volumeScale = options.volumeScale || 1.0;

        var instance = null;
        var a = SoundDefs.Channels[options.channel];
        if (a && (!this.mute || options.forceStart)) {
            var baseVolume = 1.0 * this.baseVolume * this.getTypeVolume(a.type) * options.volumeScale;
            var diffLayer = options.layer !== undefined && !util.sameAudioLayer(options.layer, this.activeLayer);
            var filter = options.filter ? diffLayer || options.forceFilter ? options.filter : 'reverb' : 'none';
            if (options.channel != 'activePlayer' && options.soundPos) {
                var diff = v2.sub(this.cameraPos, options.soundPos);
                var dist = v2.length(diff);
                var range = a.maxRange * options.rangeMult;
                if (math.eqAbs(range, 0.0)) {
                    range = 1.0;
                }
                var distNormal = math.clamp(Math.abs(dist / range), 0, 1);
                var scaledVolume = Math.pow(1.0 - distNormal, 1.0 + options.fallOff * 2.0);
                var clipVolume = a.volume * scaledVolume * baseVolume;
                clipVolume = diffLayer ? clipVolume * kDiffLayerMult : clipVolume;

                // Play if this sound is above the accepted vol threshold
                if (clipVolume > kAudioManagerMinAllowedVolume || options.ignoreMinAllowable) {
                    var stereoNorm = math.clamp(diff.x / range * -1.0, -1.0, 1.0);
                    instance = createjs.Sound.play(sound + options.channel, {
                        filter: filter,
                        loop: options.loop ? -1 : 0,
                        volume: options.startSilent ? 0.0 : clipVolume,
                        pan: stereoNorm,
                        delay: options.delay,
                        offset: options.offset,
                        ambient: options.ambient,
                        detune: options.detune
                    });
                }
            } else {
                var _clipVolume = a.volume * baseVolume;
                _clipVolume = diffLayer ? _clipVolume * kDiffLayerMult : _clipVolume;
                instance = createjs.Sound.play(sound + options.channel, {
                    filter: filter,
                    loop: options.loop ? -1.0 : 0.0,
                    volume: options.startSilent ? 0.0 : _clipVolume,
                    delay: options.delay,
                    offset: options.offset,
                    ambient: options.ambient,
                    detune: options.detune
                });
            }
            if (instance) {
                // Add looped sounds and music to stored sounds
                if (options.loop || options.channel == 'music') {
                    var type = options.channel == 'music' ? 'music' : 'sound';
                    this.soundInstances.push({ instance: instance, type: type });
                }
            }
        }
        return instance;
    },

    playGroup: function playGroup(group) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var _group = SoundDefs.Groups[group];
        if (_group) {
            var sounds = _group.sounds;
            var soundIdx = Math.floor(util.random(0, sounds.length));
            options.channel = _group.channel;
            var instance = this.playSound(sounds[soundIdx], options);
            return instance;
        } else {
            return null;
        }
    },

    updateSound: function updateSound(instance, channel, soundPos) {
        var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

        options.fallOff = options.fallOff || 0.0;
        options.rangeMult = options.rangeMult || 1.0;
        options.ignoreMinAllowable = options.ignoreMinAllowable || false;
        options.volumeScale = options.volumeScale || 1.0;

        var a = SoundDefs.Channels[channel];
        if (instance && a) {
            var baseVolume = 1.0 * this.baseVolume * this.getTypeVolume(a.type) * options.volumeScale;
            var diff = v2.sub(this.cameraPos, soundPos);
            var dist = v2.length(diff);
            var range = a.maxRange * options.rangeMult;
            if (math.eqAbs(range, 0.0)) {
                range = 1.0;
            }
            var distNormal = math.clamp(Math.abs(dist / range), 0, 1);
            var scaledVolume = Math.pow(1.0 - distNormal, 1.0 + options.fallOff * 2.0);
            var clipVolume = a.volume * scaledVolume * baseVolume;
            var diffLayer = options.layer !== undefined && !util.sameAudioLayer(options.layer, this.activeLayer);
            clipVolume = diffLayer ? clipVolume * kDiffLayerMult : clipVolume;
            if (clipVolume > kAudioManagerMinAllowedVolume || options.ignoreMinAllowable) {
                var stereoNorm = math.clamp(diff.x / range * -1.0, -1.0, 1.0);
                instance.volume = clipVolume;
                instance.pan = stereoNorm;
            }
        }
    },

    setMasterVolume: function setMasterVolume(volume) {
        volume = math.clamp(volume, 0.0, 1.0);
        createjs.Sound.volume = volume;
    },

    _setInstanceTypeVolume: function _setInstanceTypeVolume(type, volume) {
        volume = math.clamp(volume, 0.0, 1.0);
        var typeVolume = this.getTypeVolume(type);
        var scaledVolume = typeVolume > 0.0001 ? volume / typeVolume : 0.0;
        for (var i = 0; i < this.soundInstances.length; i++) {
            var inst = this.soundInstances[i];
            if (inst.type == type) {
                inst.instance.volume *= scaledVolume;
            }
        }
    },

    setSoundVolume: function setSoundVolume(volume) {
        this._setInstanceTypeVolume('sound', volume);
        this.soundVolume = volume;
    },

    setMusicVolume: function setMusicVolume(volume) {
        this._setInstanceTypeVolume('music', volume);
        this.musicVolume = volume;
    },

    setVolume: function setVolume(instance, volume, type) {
        if (instance) {
            type = type || 'sound';
            var typeVolume = this.getTypeVolume(type);
            instance.volume = volume * typeVolume;
        }
    },

    getVolume: function getVolume(instance) {
        return instance ? instance.volume : 0.0;
    },

    setMute: function setMute(mute) {
        this.mute = mute;
        createjs.Sound.setMute(this.mute);
        return this.mute;
    },

    muteToggle: function muteToggle() {
        return this.setMute(!this.mute);
    },

    setDelay: function setDelay(instance, duration) {
        if (instance) {
            instance.delay = duration;
        }
    },

    stopSound: function stopSound(instance) {
        if (instance) {
            instance.stop();
        }
    },

    stopAll: function stopAll() {
        createjs.Sound.stop();
    },

    allLoaded: function allLoaded() {
        var keys = (0, _keys2.default)(this.sounds);
        for (var i = 0; i < keys.length; i++) {
            var sound = this.sounds[keys[i]];
            if (!this.isSoundLoaded(sound.name, sound.channel)) {
                return false;
            }
        }
        return true;
    },

    isSoundLoaded: function isSoundLoaded(soundName, key) {
        var sound = this.sounds[soundName + key];
        return sound && this.loadedFiles[sound.path];
    },

    isSoundPlaying: function isSoundPlaying(inst) {
        return inst ? inst.playState == createjs.Sound.PLAY_SUCCEEDED : false;
    },

    getSoundDefVolume: function getSoundDefVolume(sound, channel) {
        var soundDef = SoundDefs.Sounds[channel][sound];
        var channelDef = SoundDefs.Channels[channel];
        return soundDef && channelDef ? soundDef.volume * channelDef.volume : 1.0;
    },

    getTypeVolume: function getTypeVolume(type) {
        switch (type) {
            case 'music':
                {
                    return this.musicVolume;
                }
            case 'sound': /* Fall-through */
            default:
                return this.soundVolume;
        }
    }
};

module.exports = AudioManager;
