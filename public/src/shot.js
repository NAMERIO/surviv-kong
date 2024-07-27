"use strict";


var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var math = require("./math.js");
var v2 = require("./v2.js");
var util = require("./util.js");

var GameObjectDefs = require("./gameObjectDefs.js");

function createCasingParticle(weapType, casingAngle, casingSpeedMult, pos, dir, layer, zOrd, particleBarn, casingEffect) {
    var weapDef = GameObjectDefs[weapType];
    if (!weapDef) {
        return;
    }

    var shellDir = v2.rotate(dir, casingAngle);
    if (weapDef.particle.shellForward) {
        shellDir = v2.mul(dir, weapDef.particle.shellForward);
    }
    var vel = v2.mul(shellDir, 9.5 * casingSpeedMult);
    vel = v2.rotate(vel, (Math.random() - 0.5) * Math.PI / 3.0);
    var shellPos = v2.add(pos, v2.mul(dir, GameConfig.player.radius + weapDef.particle.shellOffset));
    if (weapDef.particle.shellOffsetY) {
        shellPos = v2.add(shellPos, v2.mul(shellDir, weapDef.particle.shellOffsetY));
    }
    if (weapDef.particle.shellReverse) {
        vel = v2.mul(vel, -1.0);
    }

    if (casingEffect) {
        particleBarn.addParticle('nitroLace_shot', layer, shellPos, vel, weapDef.particle.shellScale, -Math.atan2(shellDir.y, shellDir.x), null, zOrd);
    } else {

        if (weapDef.particle.customParticle) {
            particleBarn.addParticle(weapDef.particle.customParticle, layer, shellPos, vel, weapDef.particle.shellScale, -Math.atan2(shellDir.y, shellDir.x), null, zOrd);
        } else {
            particleBarn.addParticle(weapDef.ammo, layer, shellPos, vel, weapDef.particle.shellScale, -Math.atan2(shellDir.y, shellDir.x), null, zOrd);
        }
    }
}

function m_ShotBarn() {
    this.shots = [];
}

m_ShotBarn.prototype = {
    addShot: function addShot(bullet) {
        var shot = null;
        for (var i = 0; i < this.shots.length; i++) {
            if (!this.shots[i].active) {
                shot = this.shots[i];
                break;
            }
        }
        if (!shot) {
            shot = {};
            this.shots.push(shot);
        }

        var weaponType = bullet.shotSourceType;
        var weaponDef = GameObjectDefs[weaponType];

        shot.active = true;
        shot.pos = v2.copy(bullet.pos);
        shot.layer = bullet.layer;
        shot.playerId = bullet.playerId;
        shot.weaponType = weaponType;
        shot.offhand = bullet.shotOffhand;
        shot.lastShot = bullet.lastShot;
        shot.shotAlt = bullet.shotAlt;
        shot.ticker = 0.0;
        shot.pullDelay = weaponDef.pullDelay !== undefined ? weaponDef.pullDelay * 0.45 : 0.0;
        shot.splinter = bullet.splinter;
        shot.trailSaturated = bullet.trailSaturated;
    },

    m_update: function m_update(dt, activePlayerId, playerBarn, particleBarn, audioManager) {
        for (var i = 0; i < this.shots.length; i++) {
            var shot = this.shots[i];
            if (!shot.active) {
                continue;
            }

            var weaponDef = GameObjectDefs[shot.weaponType];

            // New shot
            if (shot.ticker == 0.0) {
                var player = playerBarn.m_getPlayerById(shot.playerId);

                // Play shot sound
                var shotSound = weaponDef.sound.shoot;
                if (weaponDef.sound.shootTeam) {
                    // Hack? If this weapon has a shootTeam, use that
                    var teamId = playerBarn.m_getPlayerInfo(shot.playerId).teamId;
                    if (weaponDef.sound.shootTeam[teamId]) {
                        shotSound = weaponDef.sound.shootTeam[teamId];
                    }
                }
                if (shot.lastShot && weaponDef.sound.shootLast) {
                    shotSound = weaponDef.sound.shootLast;
                }
                if (shot.shotAlt && weaponDef.sound.shootAlt) {
                    shotSound = weaponDef.sound.shootAlt;
                }

                // Prioritize bonus detune over splinter for main shot
                var detune = 0;
                if (shot.trailSaturated && !weaponDef.ignoreDetune) {
                    detune = 300;
                } else if (shot.splinter) {
                    detune = -300;
                }

                audioManager.playSound(shotSound, {
                    channel: shot.playerId == activePlayerId ? 'activePlayer' : 'otherPlayers',
                    soundPos: shot.pos,
                    layer: player ? player.layer : shot.layer,
                    filter: 'muffled',
                    fallOff: weaponDef.sound.fallOff ? weaponDef.sound.fallOff : 0.0,
                    detune: detune,
                    volumeScale: shot.splinter ? 0.75 : 1.0
                });

                if (shot.splinter) {
                    audioManager.playSound(shotSound, {
                        channel: shot.playerId == activePlayerId ? 'activePlayer' : 'otherPlayers',
                        soundPos: shot.pos,
                        layer: player ? player.layer : shot.layer,
                        filter: 'muffled',
                        fallOff: weaponDef.sound.fallOff ? weaponDef.sound.fallOff : 0.0,
                        detune: 1200,
                        delay: 30,
                        volumeScale: 0.75
                    });
                }

                if (player) {
                    // If it's our shot, play a cycling or pull sound if needed
                    // @TODO: Should this sound be played for other players too?
                    if (player.__id == activePlayerId && weaponDef.fireMode == 'single' && weaponDef.pullDelay) {
                        var ammoLeft = player.m_localData.m_weapons[player.m_localData.m_curWeapIdx].ammo;
                        var soundName = ammoLeft > 0 ? weaponDef.sound.cycle : weaponDef.sound.pull;

                        audioManager.stopSound(player.cycleSoundInstance);
                        player.cycleSoundInstance = audioManager.playSound(soundName);
                    }

                    // Hands and gun recoil
                    var leftHand = shot.offhand || !weaponDef.isDual;
                    var rightHand = !shot.offhand || !weaponDef.isDual;
                    player.addRecoil(weaponDef.worldImg.recoil, leftHand, rightHand);

                    // Add fireDelay
                    player.fireDelay = weaponDef.fireDelay;
                }
            }

            shot.ticker += dt;
            if (shot.ticker >= shot.pullDelay) {
                var _player = playerBarn.m_getPlayerById(shot.playerId);
                if (_player && !_player.m_netData.m_dead && _player.m_netData.m_curWeapType == shot.weaponType) {

                    var casingEffect = null;
                    if (_player.m_netData.m_nitroLaceEffect) {
                        casingEffect = "nitroLace";
                    }

                    if (weaponDef.caseTiming == 'shoot') {
                        if (weaponDef.particle.amount) {
                            var maxParticles = weaponDef.particle.amount;
                            for (var index = 0; index < maxParticles; index++) {
                                createCasingParticle(shot.weaponType, Math.PI / 2.0 * -1.0, 1.0, _player.m_netData.m_pos, _player.m_netData.m_dir, _player.renderLayer, _player.renderZOrd + 1, particleBarn, casingEffect);
                            }
                        } else {
                            createCasingParticle(shot.weaponType, Math.PI / 2.0 * -1.0, 1.0, _player.m_netData.m_pos, _player.m_netData.m_dir, _player.renderLayer, _player.renderZOrd + 1, particleBarn, casingEffect);
                        }
                    }
                }

                shot.active = false;
            }
        }
    }
};

module.exports = {
    createCasingParticle: createCasingParticle,
    m_ShotBarn: m_ShotBarn
};
