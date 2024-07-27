"use strict";


/**
 * statusEffect.js
 * This file contains the basic function to create, update and the destroy the various status effects of the game
 */

var math = require("./math.js");
var GameObject = require("./gameObject.js");
var StatusEffects = require("./statusEffects.js");

//Import status effects
var ShieldEffect = require("./shieldEffect.js");
var ShockEffect = require("./shockEffect.js");
var ChillEffect = require("./chillEffect.js");
var BlindEffect = require("./blindEffect.js");
var BleedEffect = require("./bleedEffect.js");
var PoisonEffect = require("./poisonEffect.js");
var BurningEffect = require("./burningEffect.js");
var PowerStatEffect = require("./powerStatEffect.js");
var InvisibleEffect = require("./invisibleEffect.js");
var MovePlayerEffect = require("./movePlayerEffect.js");
var InmobilizePlayer = require("./inmobilizePlayer.js");
var ChargeHeavyAttack = require("./chargeHeavyAttack.js");

var _require = require("./cb7a977d.js"),
    getAttackTypeLogStr = _require.getAttackTypeLogStr;

/**
 * Checks the net data sent by the server and updates the effect status
 * @param {string} id Id of the effect to check 
 * @param {player} player Player object to apply the effect to 
 * @param {boolean} active Specifies is the effect is still active
 * @param {boolean} runningOnClient Indicates if the effect is running on the client or the server
 * @param {Object} particleBarn Reference to particle manager (Optional only required for the client) 
 */


function checkEffect(id, player, active, runningOnClient, particleBarn, audioManager) {
    var effect = getPlayerEffect(id, player);

    // Checks if the effect needs to be created
    if (active && !effect) {
        // Get the effect data
        var effectData = null;
        var length = StatusEffects.length;
        for (var i = 0; i < length; i++) {
            if (StatusEffects[i].id == id) {
                effectData = StatusEffects[i];
                break;
            }
        }

        if (effectData) {
            effect = addEffect(effectData.name, player, runningOnClient, particleBarn, audioManager);
        }
    } else {
        //Checks if the effect needs to be destroyed
        if (!active && effect) {
            stopEffectById(id, player);
            effect = null;
        }
    }
    if (effect) {
        // Updates the effect
        effect.update(player);
    }
}

/**
 * Adds a new effect to a player
 * @param {string} name Name of the effect to add 
 * @param {import('./../../server/src/player').Player} player Player object to apply the effect to 
 * @param {boolean} runningOnClient Indicates if the effect is running on the client or the server
 * @param {Object} particleBarn Reference to particle manager (Optional only required for the client) 
 * @param {Object} params Parameters necessary to execute effect (Optional only if the effect needs extra parameters) 
 */
function addEffect(name, player) {
    var runningOnClient = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var particleBarn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var audioManager = arguments[5];

    if (player.__type !== GameObject.Type.Player && player.__type !== GameObject.Type.Npc) return;

    var effect = getPlayerEffectByName(name, player);
    if (effect) {
        effect.reset(player, params);
    } else {
        effect = createEffect(name, runningOnClient, params);

        if (!runningOnClient && player.__type === GameObject.Type.Player) {
            var type = effect.type;
            var timeResistance = player.getStatusEffectResistance(type);

            if (timeResistance > 0.0) {
                var initialDuration = effect.effectData.time;
                var reducedTicker = initialDuration * (1 - timeResistance / 100);
                reducedTicker = math.max(0, reducedTicker);
                effect.effectData.time = reducedTicker;

                //Log effect, resistance and duration to debug (Gear system)
                //console.table([{ 'Status Effect': getAttackTypeLogStr(type, true), 'Initial Duration': initialDuration, Resistance: `${timeResistance}% (-${initialDuration* (timeResistance / 100)} sec)`, 'Total Duration': `${reducedTicker} sec`}]);

                if (reducedTicker <= 0.0) {
                    //Log effect, resistance and duration to debug (Gear system)
                    /*console.log(`Skipped effect: ${getAttackTypeLogStr(type, true)}, resistance: 100%, duration: ${initialDuration} seconds -> 0 seconds`);//*/
                    effect = null;
                }
            }
        }

        if (effect) {
            effect.start(player, particleBarn, audioManager);
            player.effects.push(effect);
        }
    }
    return effect;
}

/**
 * Updates the status of an effect
 * @param {player} player Reference to the player with the effect
 * @param {effect} effect Reference to the effect to update
 * @param {float} dt Delta time since the last call to update
 * @param {array} damageList List to the damage calls in case it is needed (Optional)
 */
function updateEffect(player, effect, dt, damageList) {
    if (!effect.isRunningClient) {
        if (effect.ticker > 0) {
            effect.ticker -= dt;
            effect.update(player, dt, damageList);
            if (effect.ticker <= 0) {
                stopEffectById(effect.id, player);
            }
        }
    }
}

/**
 * Stops an effect
 * @param {string} name Name of the effect to stop 
 * @param {player} player Reference to the player that has the effect
 */
function stopEffect(name, player) {
    var effect = getPlayerEffectByName(name, player);
    if (effect) {
        effect.stop(player);
        player.effects.splice(player.effects.indexOf(effect), 1);
    }
}

/**
 * Stops an effect by Id
 * @param {string} id Id of the effect to stop 
 * @param {player} player Reference to the player that has the effect
 */
function stopEffectById(id, player) {
    var effect = getPlayerEffect(id, player);
    if (effect) {
        effect.stop(player);
        player.effects.splice(player.effects.indexOf(effect), 1);
    }
}

/**
 * Stops all the effects running on a player
 * @param {player} player Reference to the player to stop all the effects 
 */
function stopAllEffects(player) {
    var length = player.effects.length;
    for (var i = 0; i < length; i++) {
        player.effects[i].stop(player);
    }
    player.effects = [];
}

/**
 * Gets a specific effect from a player
 * @param {string} id Id of the effect to get 
 * @param {player} player Reference to the player to get the string from
 * @returns {effect} Reference of the effect in the player if found, null otherwise
 */
function getPlayerEffect(id, player) {
    var length = player.effects.length;
    for (var i = 0; i < length; i++) {
        if (player.effects[i].id == id) {
            return player.effects[i];
        }
    }
    return null;
}
/**
 * Gets a specific effect from a player by name
 * @param {string} name name of the effect to get 
 * @param {player} player Reference to the player to get the string from
 * @returns {effect} Reference of the effect in the player if found, null otherwise
 */
function getPlayerEffectByName(name, player) {
    if (player.__type !== GameObject.Type.Player && player.__type !== GameObject.Type.Npc) return null;
    var res = null;
    var length = player.effects.length;
    for (var i = 0; i < length; i++) {
        if (player.effects[i].name == name) {
            res = player.effects[i];
            break;
        }
    }
    return res;
}

/**
 * Creates a new effect
 * @param {string} name Name of the effect to create 
 * @param {boolean} runningOnClient Indicates if the effect will run on the client or server 
 * @param {Object} params Parameters necessary to execute effect
 */
function createEffect(name, runningOnClient) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var effect = null;
    switch (name) {
        case "m_burningEffect":
            effect = new BurningEffect.burningEffect(runningOnClient, params);
            break;
        case "m_movePlayerEffect":
            effect = new MovePlayerEffect.MovePlayerEffect(runningOnClient, params);
            break;
        case "m_powerStatEffect":
            effect = new PowerStatEffect.PowerStatEffect(runningOnClient, params);
            break;
        case "m_chargeHeavyAttack":
            effect = new ChargeHeavyAttack.ChargeHeavyAttack(runningOnClient, params);
            break;
        case "m_inmobilizePlayer":
            effect = new InmobilizePlayer.InmobilizePlayer(runningOnClient, params);
            break;
        case "m_shockEffect":
            effect = new ShockEffect.shockEffect(runningOnClient, params);
            break;
        case "m_chillEffect":
            effect = new ChillEffect.chillEffect(runningOnClient, params);
            break;
        case "m_blindEffect":
            effect = new BlindEffect.blindEffect(runningOnClient, params);
            break;
        case "m_shieldEffect":
            effect = new ShieldEffect(runningOnClient, params);
            break;
        case "m_invisibleEffect":
            effect = new InvisibleEffect(runningOnClient, params);
            break;
        case "m_poisonEffect":
            effect = new PoisonEffect(runningOnClient, params);
            break;
        case "m_bleedEffect":
            effect = new BleedEffect(runningOnClient, params);
            break;
        default:
            console.error('No status effect found with name: ' + name);
            break;
    }
    return effect;
}

/**
 * Gets the effect data by id
 * @param {number} id Id of the effect to get 
 * @returns {object} Effect data
 */
function getEffectData(id) {
    var effect = null;
    // Look in the effects json for the effect data
    var length = StatusEffects.length;
    for (var i = 0; i < length; i++) {
        if (StatusEffects[i].id == id) {
            effect = StatusEffects[i];
            break;
        }
    }
    return effect;
}

/**
 * Will do a random with the chance given to to apply the effect or not
 * @param {string} name Name of the effect to add 
 * @param {player} player Player object to apply the effect to 
 * @param {float} chance Chance of the effect to be applied, number between 0 and 1
 * @param {Object} params Parameters necessary to execute effect (Optional only if the effect needs extra parameters) 
 * @param {boolean} runningOnClient Indicates if the effect is running on the client or the server
 * @param {Object} particleBarn Reference to particle manager (Optional only required for the client)
 */
function tryApplyEffectWithChance(name, player, chance) {
    var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var runningOnClient = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var particleBarn = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

    chance = math.clamp(chance, 0, 1);
    var chancePercentaje = chance * 100;
    var resRandom = Math.floor(Math.random() * Math.floor(101));

    if (resRandom <= chancePercentaje) addEffect(name, player, runningOnClient, particleBarn, params);
}

function cleanStatusOnAction(player) {
    var length = player.effects.length;
    for (var i = 0; i < length; i++) {
        if (player.effects[i].stopOnActionDone) {
            player.effects[i].stop();
        }
    }
    player.effects = player.effects.filter(function (effect) {
        return !effect.stopOnActionDone;
    });
}

//Client only
function hideEffectsParticles(player) {
    var length = player.effects.length;
    for (var i = 0; i < length; i++) {
        if (player.effects[i] && player.effects[i].emitter) player.effects[i].emitter.alpha = 0;
    }
}

//Client only
function showEffectsParticles(player) {
    var length = player.effects.length;
    for (var i = 0; i < length; i++) {
        if (player.effects[i] && player.effects[i].emitter) player.effects[i].emitter.alpha = 1;
    }
}

module.exports = {
    addEffect: addEffect,
    stopEffect: stopEffect,
    checkEffect: checkEffect,
    updateEffect: updateEffect,
    getEffectData: getEffectData,
    stopAllEffects: stopAllEffects,
    getPlayerEffect: getPlayerEffect,
    cleanStatusOnAction: cleanStatusOnAction,
    hideEffectsParticles: hideEffectsParticles,
    showEffectsParticles: showEffectsParticles,
    getPlayerEffectByName: getPlayerEffectByName,
    tryApplyEffectWithChance: tryApplyEffectWithChance
};
