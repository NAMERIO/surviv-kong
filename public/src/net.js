"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require("./0e566746.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var GameConfig = require("./gameConfig.js");
var GameObject = require("./gameObject.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var MapObjectDefs = require("./mapObjectDefs.js");
var StatusEffects = require("./statusEffects.js");

var StatusEffect = require("./statusEffect.js");

// Cache to remove the system call on access
var DEV_MODE = "production" === 'dev';

//
// Extend BitStream
//
var bb = require("./bitBuffer.js");

var _require = require("./0e566746.js"),
    throws = _require.throws;

bb.BitStream.prototype.writeBytes = function (src, offset, length) {
    assert(this._index % 8 == 0);
    var data = new Uint8Array(src._view._view.buffer, offset, length);
    this._view._view.set(data, this._index / 8);
    this._index += length * 8;
};

bb.BitStream.prototype.writeString = bb.BitStream.prototype.writeASCIIString;
bb.BitStream.prototype.readString = bb.BitStream.prototype.readASCIIString;

bb.BitStream.prototype.writeFloat = function (f, min, max, bits) {
    assert(bits > 0 && bits < 31);
    assert(f >= min && f <= max);
    var range = (1 << bits) - 1;
    var x = math.clamp(f, min, max);
    var t = (x - min) / (max - min);
    var v = t * range + 0.5;
    this.writeBits(v, bits);
};

bb.BitStream.prototype.readFloat = function (min, max, bits) {
    assert(bits > 0 && bits < 31);
    var range = (1 << bits) - 1;
    var x = this.readBits(bits);
    var t = x / range;
    var v = min + t * (max - min);
    return v;
};

bb.BitStream.prototype.writeVec = function (v, minX, minY, maxX, maxY, bits) {
    this.writeFloat(v.x, minX, maxX, bits);
    this.writeFloat(v.y, minY, maxY, bits);
};

bb.BitStream.prototype.readVec = function (minX, minY, maxX, maxY, bits) {
    return v2.create(this.readFloat(minX, maxX, bits), this.readFloat(minY, maxY, bits));
};

var kUnitEps = 1.0001;
bb.BitStream.prototype.writeUnitVec = function (v, bits) {
    this.writeVec(v, -kUnitEps, -kUnitEps, kUnitEps, kUnitEps, bits);
};

bb.BitStream.prototype.readUnitVec = function (bits) {
    return this.readVec(-kUnitEps, -kUnitEps, kUnitEps, kUnitEps, bits);
};

bb.BitStream.prototype.writeVec32 = function (v) {
    this.writeFloat32(v.x);
    this.writeFloat32(v.y);
};

bb.BitStream.prototype.readVec32 = function () {
    return v2.create(this.readFloat32(), this.readFloat32());
};

bb.BitStream.prototype.writeAlignToNextByte = function () {
    var pad = 8 - this.index % 8;
    if (pad < 8) {
        this.writeBits(0, pad);
    }
};

bb.BitStream.prototype.readAlignToNextByte = function () {
    var pad = 8 - this.index % 8;
    if (pad < 8) {
        this.readBits(pad);
    }
};

//
// Map type strings to integers for more efficient serialization.
//

var ConfigTypeMap = function () {
    function ConfigTypeMap(typeBits) {
        _classCallCheck(this, ConfigTypeMap);

        this._typeToId = {};
        this._idToType = {};
        this.nextId = 0;
        this.maxId = Math.pow(2, typeBits);

        this.addType('');
    }

    _createClass(ConfigTypeMap, [{
        key: 'addType',
        value: function addType(type) {
            assert(this._typeToId[type] === undefined, 'Type ' + type + ' has already been defined!');
            assert(this.nextId < this.maxId);
            this._typeToId[type] = this.nextId;
            this._idToType[this.nextId] = type;
            this.nextId++;
        }
    }, {
        key: 'typeToId',
        value: function typeToId(type) {
            var id = this._typeToId[type];
            assert(id !== undefined, 'Invalid type ' + type);
            return id;
        }
    }, {
        key: 'idToType',
        value: function idToType(id) {
            var type = this._idToType[id];
            if (type === undefined) {
                console.error('Invalid id given to idToType', id, 'max', Object.keys(this._idToType).length);
            }
            return type;
        }
    }]);

    return ConfigTypeMap;
}();

//
//
//


function createTypeSerialization(type, typeList, bitsPerType) {
    var typeMap = new ConfigTypeMap(bitsPerType);

    var types = Object.keys(typeList);
    assert(types.length <= typeMap.maxId, type + ' contains ' + types.length + ' types, max ' + typeMap.maxId);
    for (var i = 0; i < types.length; i++) {
        typeMap.addType(types[i]);
    }

    if (DEV_MODE) {
        console.log('Used ' + typeMap.nextId + ' / ' + typeMap.maxId + ' ' + type + ' types');
    }

    // Create serialization functions
    bb.BitStream.prototype['write' + type + 'Type'] = function (v) {
        this.writeBits(typeMap.typeToId(v), bitsPerType);
    };
    bb.BitStream.prototype['read' + type + 'Type'] = function () {
        return typeMap.idToType(this.readBits(bitsPerType));
    };

    return typeMap;
}
createTypeSerialization('Game', GameObjectDefs, 10);
createTypeSerialization('Map', MapObjectDefs, 12);

//
// MsgStream
//

var MsgStream = function () {
    function MsgStream(buf) {
        _classCallCheck(this, MsgStream);

        var arrayBuf = buf instanceof ArrayBuffer ? buf : null;
        if (arrayBuf == null) {
            arrayBuf = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        }
        this.valid = arrayBuf != null;
        if (this.valid) {
            this.arrayBuf = arrayBuf;
            this.stream = new bb.BitStream(arrayBuf);
        } else {
            console.log('Invalid buf type', typeof buf === 'undefined' ? 'undefined' : _typeof(buf));
            if (typeof buf == 'string') {
                console.log('String contents: ' + buf.substring(0, 1024));
            }
        }
    }

    _createClass(MsgStream, [{
        key: 'getBuffer',
        value: function getBuffer() {
            return new Uint8Array(this.arrayBuf, 0, this.stream.byteIndex);
        }
    }, {
        key: 'getStream',
        value: function getStream() {
            return this.stream;
        }
    }, {
        key: 'serializeMsg',
        value: function serializeMsg(type, msg) {
            assert(this.stream.index % 8 == 0);
            this.stream.writeUint8(type);
            msg.serialize(this.stream);
            assert(this.stream.index % 8 == 0);
        }
    }, {
        key: 'serializeMsgStream',
        value: function serializeMsgStream(type, stream) {
            assert(this.stream.index % 8 == 0 && stream.index % 8 == 0);
            this.stream.writeUint8(type);
            this.stream.writeBytes(stream, 0, stream.index / 8);
        }
    }, {
        key: 'deserializeMsgType',
        value: function deserializeMsgType() {
            if (this.stream.length - this.stream.byteIndex * 8 >= 1) {
                return this.stream.readUint8();
            } else {
                return Msg.None;
            }
        }
    }]);

    return MsgStream;
}();

//
// Game state serialization
//


var Constants = {
    MapNameMaxLen: 24,
    PlayerNameMaxLen: 16,
    MouseMaxDist: 64.0,
    SmokeMaxRad: 10.0,
    ActionMaxDuration: 12,
    AirstrikeZoneMaxRad: 256.0,
    AirstrikeZoneMaxDuration: 60.0,
    PlayerMinScale: 0.75,
    PlayerMaxScale: 2.0,
    MapObjectMinScale: 0.125,
    MapObjectMaxScale: 2.5,
    MaxPerks: 8,
    MaxMapIndicators: 16,
    PlayerMaxChargeTime: 20.0,
    PlayerMinChargeTime: 0.0,
    PlayerHitMinTime: 0.0,
    PlayerHitMaxTime: 2.0,
    PlayerDashMinTime: 0.0,
    PlayerDashMaxTime: 4.0,
    BulletMinScale: 0.125,
    BulletMaxScale: 10.0
};

function getPlayerStatusUpdateRate(factionMode) {
    return factionMode ? 0.5 : 0.25;
}

// "Grid" data types
var ObjectSerializeFns = {};

function setSerializeFns(type, serializedFullSize, serializePart, serializeFull, deserializePart, deserializeFull) {
    ObjectSerializeFns[type] = {
        serializedFullSize: serializedFullSize,
        serializePart: serializePart,
        serializeFull: serializeFull,
        deserializePart: deserializePart,
        deserializeFull: deserializeFull
    };
}

setSerializeFns(GameObject.Type.Player, 217, //74, @TODO: Add type codes to custom skin //TODO clean and optimize to reduce max msg size under 70 if possible


function serializePart(s, x) {},

/**
* 
* @param {*} s 
* @param {import('./../server/src/player').Player} x 
*/
function serializeFull(s, x) {
    //console.log('setSerializeFns  GameObject.Type.Player', x.netFullState)
}, function deserializePart(s, x) {
    x.m_pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.m_dir = s.readUnitVec(8);
    x.m_healthNormalized = s.readFloat(0.0, 1.0, 8);
}, function deserializeFull(s, x) {

    x.m_outfit = s.readGameType();
    x.m_backpack = s.readGameType();
    x.m_helmet = s.readGameType();
    x.m_chest = s.readGameType();
    x.m_curWeapType = s.readGameType();
    x.m_curOffHandType = s.readGameType();
    x.m_layer = s.readBits(2);
    x.m_dead = s.readBoolean();
    x.m_downed = s.readBoolean();
    x.m_disconnected = s.readBoolean();
    x.m_animType = s.readBits(4);
    x.m_animSeq = s.readBits(3);
    x.m_animDefinitionId = s.readBits(3);
    x.m_actionType = s.readBits(3);
    x.m_actionSeq = s.readBits(3);
    x.m_hitState = s.readFloat(Constants.PlayerHitMinTime, Constants.PlayerHitMaxTime, 8);
    x.m_wearingPan = s.readBoolean();
    x.m_playerIndoors = s.readBoolean();
    x.m_gunLoaded = s.readBoolean();
    x.m_passiveHeal = s.readBoolean();
    x.m_healByItemEffect = s.readBoolean();
    x.m_avatarSkin = s.readString();
    x.m_hairSkin = s.readString();
    x.m_armorType = s.readString();
    x.m_armorLevel = s.readBits(3);
    x.m_helmetType = s.readString();
    x.m_helmetLevel = s.readBits(3);
    /*x.m_skinToSet = [];
    let skinToSetLength = s.readBits(4);
    for(let i = 0; i<skinToSetLength;i++){
        x.m_skinToSet.push(s.readString());
    }*/
    x.m_selectedSkill = s.readBits(3);
    x.m_selectedSlot = s.readBits(3);
    x.m_selectedSlotItem = s.readString();
    x.m_obstacleCollision = s.readBoolean();

    //Attack data
    //Main weapon cooldowns
    x.m_weapCooldowns = [];
    var weapCooldownLength = s.readBits(3);
    for (var i = 0; i < weapCooldownLength; i++) {
        x.m_weapCooldowns.push(s.readBits(3));
    }

    //Off hand weapon cooldowns
    x.m_offHandCooldowns = [];
    var offHandCooldownLength = s.readBits(3);
    for (var _i = 0; _i < offHandCooldownLength; _i++) {
        x.m_offHandCooldowns.push(s.readBits(3));
    }

    x.m_currentMainWeap = s.readString();
    x.m_currentOffHand = s.readString();

    x.m_isAttacking = s.readBoolean();
    x.m_currentAttackIsOffHand = s.readBoolean();
    x.m_currentAttack = s.readBits(3);
    x.m_isChargingAttack = s.readBoolean();

    //Temp player stats 

    x.m_powerStat = s.readUint16();
    x.m_speedStat = s.readUint16();
    x.m_vitalityStat = s.readUint16();

    x.m_statsPoints = s.readUint16();
    x.m_playerXP = s.readUint16();
    x.m_level = s.readUint16();

    //Dash data
    x.m_chargedDash = s.readBits(4);
    x.m_dashCooldown = s.readBits(4);
    x.m_dashing = s.readFloat(Constants.PlayerDashMinTime, Constants.PlayerDashMaxTime, 8);

    //??????
    x.m_hasteType = 0;
    x.m_hasteSeq = -1;
    var hasHaste = s.readBoolean();
    if (hasHaste) {
        x.m_hasteType = s.readBits(3);
        x.m_hasteSeq = s.readBits(3);
    }
    var hasActionItem = s.readBoolean();
    x.m_actionItem = hasActionItem ? s.readGameType() : '';
    var hasScale = s.readBoolean();
    x.m_scale = hasScale ? s.readFloat(Constants.PlayerMinScale, Constants.PlayerMaxScale, 8) : 1.0;
    var hasRole = s.readBoolean();
    x.m_role = hasRole ? s.readGameType() : '';
    x.m_perks = [];
    var hasPerks = s.readBoolean();
    if (hasPerks) {
        var perkCount = s.readBits(3);
        for (var _i2 = 0; _i2 < perkCount; _i2++) {
            var type = s.readGameType();
            var droppable = s.readBoolean();
            x.m_perks.push({ type: type, droppable: droppable });
        }
    }

    x.m_wearingLasrSwrd = false;
    x.m_isTarget = false;
    x.m_infectedEffect = false;

    x.m_nitroLaceEffect = false;
    x.m_biteEffect = false;
    x.m_frozen = false;
    x.m_frozenOri = 0;
    x.m_freezeLevel = 0;
    x.m_freezeActive = false;
    x.m_flaskEffect = false;
    x.m_frenemy = false;
    x.m_chocolateBoxEffect = false;
    x.m_luckyEffect = false;
    x.m_savedByLuckEffect = false;
    x.m_loadingBlaster = 0;
    x.m_wetEffect = false;
    x.m_watermelonEffect = false;
    x.m_gunchiladaEffect = false;
    x.m_sugarRush = false;
    x.m_playSoundSugarRush = false;
    x.m_windDir = 0;
    x.m_hailDamageEffect = false;

    //Add status effects
    x.effects = [];
    var length = s.readBits(4);
    for (var _i3 = 0; _i3 < length; _i3++) {
        x.effects.push(s.readBits(5));
    }

    var mapSwitch = s.readBits(4);
    switch (mapSwitch) {
        case 1:
            x.m_wearingLasrSwrd = s.readBoolean();
            break;
        case 3:
            x.m_frozen = s.readBoolean();
            x.m_frozenOri = s.readBits(2);
            x.m_freezeLevel = s.readFloat(0.0, 5.0, 8);
            x.m_freezeActive = s.readBoolean();
            x.m_flaskEffect = s.readBoolean();
            break;
        case 4:
            x.m_frenemy = s.readBoolean();
            x.m_chocolateBoxEffect = s.readBoolean();
            break;
        case 5:
            x.m_luckyEffect = s.readBoolean();
            x.m_savedByLuckEffect = s.readBoolean();
            x.m_loadingBlaster = s.readFloat(0.0, 1.0, 7);
            break;
        case 6:
            x.m_wetEffect = s.readBoolean();
            x.m_watermelonEffect = s.readBoolean();
            break;
        case 7:
            x.m_gunchiladaEffect = s.readBoolean();
            break;
        case 8:
            x.m_sugarRush = s.readBoolean();
            x.m_playSoundSugarRush = s.readBoolean();
            break;
        case 9:
            x.m_windDir = s.readBits(2);
            x.m_hailDamageEffect = s.readBoolean();
            break;
        case 10:
            x.m_nitroLaceEffect = s.readBoolean();
            break;
    }

    if (GameConfig.features.inGameNotificationActive) {
        //Quests info
        x.m_questsInfo = [];

        var questsCount = s.readBits(2);
        for (var _i4 = 0; _i4 < questsCount; _i4++) {
            var questType = s.readBits(5);
            x.m_questsInfo.push({ type: questType, progress: s.readBits(11) });
        }
    }
    s.readAlignToNextByte();
});

setSerializeFns(GameObject.Type.Obstacle, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.ori = s.readBits(2);
    x.scale = s.readFloat(Constants.MapObjectMinScale, Constants.MapObjectMaxScale, 8);
    s.readBits(6); // Padding
}, function deserializeFull(s, x) {
    x.healthT = s.readFloat(0.0, 1.0, 8);
    x.type = s.readMapType();
    x.obstacleType = s.readString();
    x.layer = s.readBits(2);
    x.dead = s.readBoolean();
    x.isDoor = s.readBoolean();
    x.teamId = s.readUint8();
    if (x.isDoor) {
        x.door = {};
        x.door.open = s.readBoolean();
        x.door.canUse = s.readBoolean();
        x.door.locked = s.readBoolean();
        x.door.seq = s.readBits(5);
    }
    x.isButton = s.readBoolean();
    if (x.isButton) {
        x.button = {};
        x.button.onOff = s.readBoolean();
        x.button.canUse = s.readBoolean();
        x.button.seq = s.readBits(6);
    }
    x.isPuzzlePiece = s.readBoolean();
    if (x.isPuzzlePiece) {
        x.parentBuildingId = s.readUint16();
    }
    x.isSkin = s.readBoolean();
    if (x.isSkin) {
        x.skinPlayerId = s.readUint16();
    }
    s.readBits(5); // Padding
});

setSerializeFns(GameObject.Type.Npc, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.type = s.readBits(4); //Id
    x.healthNormalized = s.readFloat(0.0, 1.0, 8);
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.scale = s.readFloat(Constants.MapObjectMinScale, Constants.MapObjectMaxScale, 8);
    x.isAttacking = s.readBoolean();

    x.reproduceAnimation = s.readBoolean();
    x.animId = s.readBits(3);
    x.animDefId = s.readBits(3);
    x.animDirection = s.readBits(2);

    //Check effects
    x.effects = [];
    var effectsOffset = 0;
    var length = s.readBits(4);
    for (var i = 0; i < length; i++) {
        var effect = {};
        effect.id = s.readBits(5);
        //effect.percentage = s.readFloat(0.0, 100.0, 8);
        effectsOffset += 5;
        x.effects.push(effect);
    }

    /*let debugLines = s.readBoolean();
    effectsOffset += 1;*/

    if (effectsOffset) {
        //Align to next byte dynamic
        effectsOffset += 50;
        var bitsOffset = effectsOffset % 8;
        if (bitsOffset) s.readBits(8 - bitsOffset); // Padding    
    } else s.readBits(6); // Padding
}, function deserializeFull(s, x) {
    x.layer = s.readBits(2);
    x.level = s.readBits(3);
    x.dead = s.readBoolean();
    //x.teamId = s.readUint8();
    s.readBits(2); // Padding
});

setSerializeFns(GameObject.Type.Building, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.ceilingDead = s.readBoolean();
    x.occupied = s.readBoolean();
    x.ceilingDamaged = s.readBoolean();
    x.hasPuzzle = s.readBoolean();
    if (x.hasPuzzle) {
        x.puzzleSolved = s.readBoolean();
        x.puzzleErrSeq = s.readBits(7);
    }
    s.readBits(4); // Padding
}, function deserializeFull(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.type = s.readMapType();
    x.ori = s.readBits(2);
    x.layer = s.readBits(2);
});

setSerializeFns(GameObject.Type.Structure, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {}, function deserializeFull(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.type = s.readMapType();
    x.ori = s.readBits(2);
    x.interiorSoundEnabled = s.readBoolean();
    x.interiorSoundAlt = s.readBoolean();
    x.layerObjIds = [];
    for (var i = 0; i < GameConfig.structureLayerCount; i++) {
        var objId = s.readUint16();
        x.layerObjIds.push(objId);
    }
});

setSerializeFns(GameObject.Type.LootSpawner, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.type = s.readMapType();
    x.layer = s.readBits(2);
    s.readBits(2); // Padding
}, function deserializeFull(s, x) {});

setSerializeFns(GameObject.Type.Loot, 5, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
}, function deserializeFull(s, x) {
    x.type = s.readGameType();
    x.count = s.readUint8();
    x.layer = s.readBits(2);
    x.isOld = s.readBoolean();
    x.isPreloadedGun = s.readBoolean();
    x.hasOwner = s.readBoolean();
    if (x.hasOwner) {
        x.ownerId = s.readUint16();
    }
    s.readBits(1); // Padding
});

setSerializeFns(GameObject.Type.DeadBody, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
}, function deserializeFull(s, x) {
    x.layer = s.readUint8();
    x.playerId = s.readUint16();
});

setSerializeFns(GameObject.Type.Decal, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {}, function deserializeFull(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.scale = s.readFloat(Constants.MapObjectMinScale, Constants.MapObjectMaxScale, 8);
    x.type = s.readMapType();
    x.ori = s.readBits(2);
    x.layer = s.readBits(2);
    x.goreKills = s.readUint8();
});

setSerializeFns(GameObject.Type.Projectile, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.posZ = s.readFloat(0.0, GameConfig.projectile.maxHeight, 10);
    x.dir = s.readUnitVec(7);
    x.bombArmed = s.readBoolean();
    s.readBits(7); // Padding
}, function deserializeFull(s, x) {
    x.type = s.readGameType();
    x.layer = s.readBits(2);
    s.readBits(4); // Padding
});

setSerializeFns(GameObject.Type.Smoke, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.type = s.readString();
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.rad = s.readFloat(0.0, Constants.SmokeMaxRad, 8);
}, function deserializeFull(s, x) {
    x.type = s.readString();
    x.layer = s.readBits(2);
    x.interior = s.readBits(6);
});

setSerializeFns(GameObject.Type.Airdrop, 0, function serializePart(s, x) {}, function serializeFull(s, x) {}, function deserializePart(s, x) {
    x.fallT = s.readFloat(0.0, 1.0, 7);
    x.landed = s.readBoolean();
}, function deserializeFull(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
});

function deserializeActivePlayer(s, x) {
    x.healthDirty = s.readBoolean();
    if (x.healthDirty) {
        x.maxHealth = s.readUint16();
        x.health = s.readFloat(0.0, x.maxHealth, 16);
    }
    x.boostDirty = s.readBoolean();
    if (x.boostDirty) {
        x.boost = s.readFloat(0.0, 100.0, 8);
    }
    x.luckDirty = false;
    x.wetDirty = false;
    x.nitroLaceDirty = false;
    x.offHandCooldownDirty = false;
    x.luck = 0;
    x.wetPorcentage = 0;
    x.contactPorcentage = 0;
    x.nitroLacePorcentage = 0;

    //Check effects
    x.effects = [];
    var length = s.readBits(4);
    for (var i = 0; i < length; i++) {
        var effect = {};
        effect.id = s.readBits(5);
        effect.percentage = s.readFloat(0.0, 100.0, 8);
        x.effects.push(effect);
    }

    //Check boons
    x.boons = [];
    var boonsLength = s.readBits(4);
    for (var _i5 = 0; _i5 < boonsLength; _i5++) {
        x.boons.push({
            id: s.readBits(5),
            active: s.readBoolean()
        });
    }

    var mapSwitch = s.readBits(3);
    x.offHandCooldown = 0;
    switch (mapSwitch) {
        case 1:
            x.luckDirty = s.readBoolean();
            if (x.luckDirty) {
                x.luck = s.readFloat(0.0, 100.0, 8);
            }
            break;
        case 2:
            x.wetDirty = s.readBoolean();
            if (x.wetDirty) {
                x.wetPorcentage = s.readFloat(0.0, 100.0, 8);
            }
            break;
        case 4:
            x.nitroLaceDirty = s.readBoolean();
            if (x.nitroLaceDirty) {
                x.nitroLacePorcentage = s.readFloat(0.0, 100.0, 8);
            }
            break;
    }

    x.offHandCooldownDirty = s.readBoolean();
    if (x.offHandCooldownDirty) {
        x.offHandCooldown = s.readBits(4);
    }

    x.zoomDirty = s.readBoolean();
    if (x.zoomDirty) {
        x.zoom = s.readUint8();
        x.zoomInSpeed = s.readFloat(0.0, 10, 8);
        x.zoomOutSpeed = s.readFloat(0.0, 10, 8);
    }

    x.actionDirty = s.readBoolean();
    if (x.actionDirty) {
        x.action = {};
        x.action.time = s.readFloat(0.0, Constants.ActionMaxDuration, 8);
        x.action.duration = s.readFloat(0.0, Constants.ActionMaxDuration, 8);
        x.action.targetId = s.readUint16();
    }
    x.inventoryDirty = s.readBoolean();
    if (x.inventoryDirty) {
        x.scope = s.readGameType();
        x.inventory = {};
        x.slotsInventory = {};
        var keys = Object.keys(GameConfig.bagSizes);
        for (var _i6 = 0; _i6 < keys.length; _i6++) {
            var item = keys[_i6];
            var itemCount = 0;
            var hasItem = s.readBoolean();
            if (hasItem) {
                itemCount = s.readBits(9);
            }
            x.inventory[item] = itemCount;
        }
        var slotsInventorySize = s.readBits(3);
        for (var _i7 = 0; _i7 < slotsInventorySize; _i7++) {
            x.slotsInventory[_i7] = {
                item: s.readString(),
                total: s.readBits(5)
            };
        }
    }
    x.weapsDirty = s.readBoolean();
    if (x.weapsDirty) {
        x.curWeapIdx = s.readBits(2);
        x.weapons = [];
        for (var _i8 = 0; _i8 < GameConfig.WeaponSlot.Count; _i8++) {
            var w = {};
            w.type = s.readGameType();
            w.ammo = s.readUint8();
            x.weapons.push(w);
        }
    }
    x.spectatorCountDirty = s.readBoolean();
    if (x.spectatorCountDirty) {
        x.spectatorCount = s.readUint8();
    }
    x.cameraPositionDirty = s.readBoolean();
    s.readAlignToNextByte();
}

function deserializePlayerStatus(s, x) {
    x.players = [];
    var count = s.readUint8();
    for (var i = 0; i < count; i++) {
        var p = {};
        p.hasData = s.readBoolean();
        if (p.hasData) {
            p.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 11);
            p.visible = s.readBoolean();
            p.dead = s.readBoolean();
            p.downed = s.readBoolean();
            p.role = '';
            var hasRole = s.readBoolean();
            if (hasRole) {
                p.role = s.readGameType();
            }
        }
        x.players.push(p);
    }
    s.readAlignToNextByte();
}

function deserializeGroupStatus(s, x) {
    x.players = [];
    var count = s.readUint8();
    for (var i = 0; i < count; i++) {
        var p = {};
        p.health = s.readFloat(0.0, 1, 8);
        p.disconnected = s.readBoolean();
        x.players.push(p);
    }
    s.readAlignToNextByte();
}

function deserializePlayerInfo(s, x) {
    x.playerId = s.readUint16();
    x.teamId = s.readUint8();
    x.groupId = s.readUint8();
    x.name = s.readString();
    x.loadout = {};
    x.loadout.armor = {};
    x.loadout.helmet = {};
    x.loadout.ring = {};
    x.loadout.outfit = s.readGameType();
    x.loadout.heal = s.readGameType();
    x.loadout.boost = s.readGameType();
    x.loadout.melee = s.readGameType();
    x.loadout.deathEffect = s.readGameType();
    x.loadout.armor.type = s.readString();
    x.loadout.armor.level = s.readBits(3);
    x.loadout.helmet.type = s.readString();
    x.loadout.helmet.level = s.readBits(3);
    x.loadout.ring.type = s.readString();
    x.loadout.ring.level = s.readBits(3);
    x.loadout.emotes = [];
    for (var i = 0; i < GameConfig.EmoteSlot.Count; i++) {
        var t = s.readGameType();
        x.loadout.emotes.push(t);
    }
    x.userId = s.readUint32();
    x.isUnlinked = s.readBoolean();
    s.readAlignToNextByte();
}

function deserializeGearStats(s, x) {
    x.playerId = s.readUint16();
    x.loadout = {};
    x.loadout.outfit = {};
    x.loadout.outfit.makr = s.readString(Constants.PlayerNameMaxLen);
    x.loadout.outfit.kills = s.readString();
    x.loadout.outfit.levels = s.readString();
    x.loadout.outfit.wins = s.readString();
    x.loadout.heal = {};
    x.loadout.heal.makr = s.readString(Constants.PlayerNameMaxLen);
    x.loadout.heal.kills = s.readString();
    x.loadout.heal.levels = s.readString();
    x.loadout.heal.wins = s.readString();
    x.loadout.boost = {};
    x.loadout.boost.makr = s.readString(Constants.PlayerNameMaxLen);
    x.loadout.boost.kills = s.readString();
    x.loadout.boost.levels = s.readString();
    x.loadout.boost.wins = s.readString();
    x.loadout.melee = {};
    x.loadout.melee.makr = s.readString(Constants.PlayerNameMaxLen);
    x.loadout.melee.kills = s.readString();
    x.loadout.melee.levels = s.readString();
    x.loadout.melee.wins = s.readString();
    x.loadout.deathEffect = {};
    x.loadout.deathEffect.makr = s.readString(Constants.PlayerNameMaxLen);
    x.loadout.deathEffect.kills = s.readString();
    x.loadout.deathEffect.levels = s.readString();
    x.loadout.deathEffect.wins = s.readString();

    x.loadout.emote = [];
    for (var i = 0; i < GameConfig.EmoteSlot.Count; i++) {
        var makr = s.readString(Constants.PlayerNameMaxLen);
        var kills = s.readString();
        var levels = s.readString();
        var wins = s.readString();
        x.loadout.emote.push({ makr: makr, kills: kills, levels: levels, wins: wins });
    }
    s.readAlignToNextByte();
}

function deserializeGasData(s, x) {
    x.mode = s.readUint8();
    x.duration = s.readBits(8);
    x.posOld = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.posNew = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.radOld = s.readFloat(0.0, 2048.0, 16);
    x.radNew = s.readFloat(0.0, 2048.0, 16);
}

function deserializeMapRiver(s, x) {
    x.width = s.readBits(8);
    x.looped = s.readUint8();
    x.points = [];
    var count = s.readUint8();
    for (var i = 0; i < count; i++) {
        var pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
        x.points.push(pos);
    }
}

function deserializeMapPlace(s, x) {
    x.name = s.readString();
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
}

function deserializeMapGroundPatch(s, x) {
    x.min = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.max = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.color = s.readUint32();
    x.roughness = s.readFloat32();
    x.offsetDist = s.readFloat32();
    x.order = s.readBits(7);
    x.useAsMapShape = s.readBoolean();
}

function deserializeMapObj(s, x) {
    x.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
    x.scale = s.readFloat(Constants.MapObjectMinScale, Constants.MapObjectMaxScale, 8);
    x.type = s.readMapType();
    x.ori = s.readBits(2);
    x.obstacleType = s.readString();
    s.readBits(2); // Padding
}

//
// Message types
//
var Msg = {
    None: 0,
    Join: 1,
    Disconnect: 2,
    Input: 3,
    Edit: 4,
    Joined: 5,
    Update: 6,
    Kill: 7,
    GameOver: 8,
    Pickup: 9,
    Map: 10,
    Spectate: 11,
    DropItem: 12,
    Emote: 13,
    PlayerStats: 14,
    AdStatus: 15,
    Loadout: 16,
    RoleAnnouncement: 17,
    Stats: 18,
    UpdatePass: 19,
    AliveCounts: 20,
    PerkModeRoleSelect: 21,
    GamePlayerStats: 22,
    BattleResults: 23,
    WeaponSelection: 24
};

var JoinMsg = function () {
    function JoinMsg() {
        _classCallCheck(this, JoinMsg);

        this.protocol = 0;
        this.matchPriv = '';
        this.loadoutPriv = '';
        this.loadoutStats = '';
        this.hasGoldenBP = false;
        this.questPriv = '';
        this.name = '';
        this.isUnlinked = false;
        this.useTouch = false;
        this.isMobile = false;
        this.proxy = false;
        this.otherProxy = false;
        this.bot = false;
        this.autoMelee = false;
        this.aimAssist = false;
        this.kpg = '0.0';
        this.progressNotificationActive = false;
        this.avatarSkin = '';
        this.hairSkin = '';
        this.armorType = '';
        this.armorLevel = 1;
        //this.skinToSet = [];

        this.curWeapType = '';
        this.WeaponSelectionTicker = 0;
    }

    _createClass(JoinMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeUint32(this.protocol);
            s.writeString(this.matchPriv);
            s.writeString(this.loadoutPriv);
            s.writeString(this.loadoutStats);
            s.writeBoolean(this.hasGoldenBP);
            s.writeString(this.questPriv);
            s.writeString(this.name, Constants.PlayerNameMaxLen);
            s.writeBoolean(this.isUnlinked);
            s.writeBoolean(this.useTouch);
            s.writeBoolean(this.isMobile);
            s.writeBoolean(this.proxy);
            s.writeBoolean(this.otherProxy);
            s.writeBoolean(this.bot);
            s.writeBoolean(this.autoMelee);
            s.writeBoolean(this.aimAssist);
            s.writeString(this.kpg);
            s.writeBoolean(this.progressNotificationActive);
            // @TODO: Remove after loadout logic is done
            s.writeString(this.avatarSkin);
            s.writeString(this.hairSkin);
            s.writeString(this.armorType);
            s.writeBits(this.armorLevel, 3);
            /*let skinToSet = this.skinToSet;
            let skinToSetLength = skinToSet.length;
            s.writeBits(skinToSetLength,4);
            for(let i = 0;i<skinToSetLength;i++){
                s.writeString(skinToSet[i]);
            }*/
            s.writeString(this.curWeapType);
            s.writeFloat32(this.WeaponSelectionTicker);
            s.writeAlignToNextByte();
        }
    }]);

    return JoinMsg;
}();

var DisconnectMsg = function () {
    function DisconnectMsg() {
        _classCallCheck(this, DisconnectMsg);

        this.reason = '';
    }

    _createClass(DisconnectMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.reason = s.readString();
        }
    }]);

    return DisconnectMsg;
}();

var WeaponMsg = function () {
    function WeaponMsg() {
        _classCallCheck(this, WeaponMsg);

        this.invulnTicker = 0;
        this.curWeapType = '';
    }

    _createClass(WeaponMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeString(this.curWeapType);
            s.writeFloat32(this.invulnTicker);
            s.writeAlignToNextByte();
        }
    }, {
        key: 'deserialize',
        value: function deserialize(s) {
            this.curWeapType = s.readString();
            this.invulnTicker = s.readFloat32();
            s.readAlignToNextByte();
        }
    }]);

    return WeaponMsg;
}();

var InputMsg = function () {
    function InputMsg() {
        _classCallCheck(this, InputMsg);

        this.seq = 0;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.lightAttackStart = false;
        this.lightAttackHold = false;
        this.offHandAbilityStart = false;
        this.offHandAbilityHold = false;
        this.selectedSkill = GameConfig.SelectedSkill.None;
        this.portrait = false;
        this.touchMoveActive = false;
        this.touchMoveDir = v2.create(1.0, 0.0);
        this.touchMoveLen = 255;
        this.toMouseDir = v2.create(1.0, 0.0);
        this.toMouseLen = 0.0;
        this.inputs = [];
        this.useItem = 0;
        this.updateStat = '';
        this.removeStorm = '';
    }

    _createClass(InputMsg, [{
        key: 'addInput',
        value: function addInput(input) {
            if (this.inputs.length < 7 && this.inputs.indexOf(input) === -1) {
                this.inputs.push(input);
            }
        }
    }, {
        key: 'serialize',
        value: function serialize(s) {
            s.writeUint8(this.seq);
            s.writeBoolean(this.moveLeft);
            s.writeBoolean(this.moveRight);
            s.writeBoolean(this.moveUp);
            s.writeBoolean(this.moveDown);
            s.writeBoolean(this.lightAttackStart);
            s.writeBoolean(this.lightAttackHold);
            s.writeBoolean(this.offHandAbilityStart);
            s.writeBoolean(this.offHandAbilityHold);
            s.writeBits(this.selectedSkill, 3);
            s.writeBoolean(this.portrait);
            s.writeBoolean(this.touchMoveActive);
            if (this.touchMoveActive) {
                s.writeUnitVec(this.touchMoveDir, 8);
                s.writeUint8(this.touchMoveLen);
            }
            s.writeUnitVec(this.toMouseDir, 10);
            s.writeFloat(this.toMouseLen, 0.0, Constants.MouseMaxDist, 8);
            s.writeBits(this.inputs.length, 4);
            for (var i = 0; i < this.inputs.length; i++) {
                s.writeUint8(this.inputs[i]);
            }
            s.writeBits(this.useItem, 3); //s.writeGameType(this.useItem);
            s.writeString(this.updateStat);
            s.writeString(this.removeStorm);
            // s.writeBits(0, 6); // Padding
            s.writeAlignToNextByte();
        }
    }]);

    return InputMsg;
}();

var EditMsg = function EditMsg() {
    _classCallCheck(this, EditMsg);
};

var DropItemMsg = function () {
    function DropItemMsg() {
        _classCallCheck(this, DropItemMsg);

        this.item = '';
        this.weapIdx = 0;
    }

    _createClass(DropItemMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeString(this.item);
            s.writeUint8(this.weapIdx);
            s.writeAlignToNextByte(); //(0, 6); // Padding
        }
    }]);

    return DropItemMsg;
}();

var PerkModeRoleSelectMsg = function () {
    function PerkModeRoleSelectMsg() {
        _classCallCheck(this, PerkModeRoleSelectMsg);

        this.role = '';
    }

    _createClass(PerkModeRoleSelectMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeGameType(this.role);
            s.writeBits(0, 6); // Padding
        }
    }]);

    return PerkModeRoleSelectMsg;
}();

var EmoteMsg = function () {
    function EmoteMsg() {
        _classCallCheck(this, EmoteMsg);

        this.pos = v2.create(0.0, 0.0);
        this.type = '';
        this.isPing = false;
    }

    _createClass(EmoteMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeVec(this.pos, 0.0, 0.0, 1024.0, 1024.0, 16);
            s.writeGameType(this.type);
            s.writeBoolean(this.isPing);
            s.writeBits(0, 5); // Padding
        }
    }]);

    return EmoteMsg;
}();

var JoinedMsg = function () {
    function JoinedMsg() {
        _classCallCheck(this, JoinedMsg);

        // @TODO: Replace teamMode with the full gameData struct
        this.teamMode = 0;
        this.playerId = 0;
        this.started = false;
        this.emotes = [];
        this.weaponCount = 3;
        this.weapons = [];
    }

    _createClass(JoinedMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.teamMode = s.readUint8();
            this.playerId = s.readUint16();
            this.started = s.readBoolean();
            var emoteCount = s.readUint8();
            for (var i = 0; i < emoteCount; i++) {
                var x = s.readGameType();
                this.emotes.push(x);
            }
            var weaponCount = s.readUint8();
            for (var _i9 = 0; _i9 < weaponCount; _i9++) {
                this.weapons.push(s.readString());
            }
            s.readAlignToNextByte();
        }
    }]);

    return JoinedMsg;
}();

var MapMsg = function () {
    function MapMsg() {
        _classCallCheck(this, MapMsg);

        this.mapName = '';
        this.seed = 0;
        this.width = 0;
        this.height = 0;
        this.shoreInset = 0;
        this.grassInset = 0;
        this.rivers = [];
        this.places = [];
        this.objects = [];
        this.groundPatches = [];
    }

    _createClass(MapMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.mapName = s.readString(Constants.MapNameMaxLen);
            this.seed = s.readUint32();
            this.width = s.readUint16();
            this.height = s.readUint16();
            this.shoreInset = s.readUint16();
            this.grassInset = s.readUint16();
            // Rivers
            {
                var count = s.readUint8();
                for (var i = 0; i < count; i++) {
                    var river = {};
                    deserializeMapRiver(s, river);
                    this.rivers.push(river);
                }
            }
            // Places
            {
                var _count = s.readUint8();
                for (var _i10 = 0; _i10 < _count; _i10++) {
                    var place = {};
                    deserializeMapPlace(s, place);
                    this.places.push(place);
                }
            }
            // Objects
            {
                var _count2 = s.readUint16();
                for (var _i11 = 0; _i11 < _count2; _i11++) {
                    var obj = {};
                    deserializeMapObj(s, obj);
                    this.objects.push(obj);
                }
            }
            // GroundPatches
            {
                var _count3 = s.readUint8();
                for (var _i12 = 0; _i12 < _count3; _i12++) {
                    var patch = {};
                    deserializeMapGroundPatch(s, patch);
                    this.groundPatches.push(patch);
                }
            }
        }
    }]);

    return MapMsg;
}();

//
// Update extended data
//


var UpdateExtFlags = {
    DeletedObjects: 1 << 0,
    FullObjects: 1 << 1,
    ActivePlayerId: 1 << 2,
    Gas: 1 << 3,
    GasCircle: 1 << 4,
    PlayerInfos: 1 << 5,
    DeletePlayerIds: 1 << 6,
    PlayerStatus: 1 << 7,
    GroupStatus: 1 << 8,
    Bullets: 1 << 9,
    Traps: 1 << 10,
    Explosions: 1 << 11,
    Emotes: 1 << 12,
    Planes: 1 << 13,
    AirstrikeZones: 1 << 14,
    MapIndicators: 1 << 15,
    KillLeader: 1 << 16,
    RemovedTraps: 1 << 17
    // Max of (1 << 15); ExtFlags is a Uint16
};

var UpdateMsg = function () {
    function UpdateMsg() {
        _classCallCheck(this, UpdateMsg);

        this.serializedObjectCache = null;
        this.objectReg = null;
        this.clientPlayer = null;
        this.activePlayer = null;
        this.grid = null;
        this.playerBarn = null;
        this.bulletBarn = null;
        this.gas = null;
        this.map = null;

        this.delObjIds = [];
        this.fullObjects = [];
        this.partObjects = [];
        this.activePlayerId = 0;
        this.activePlayerIdDirty = false;
        this.activePlayerData = {};
        this.aliveCounts = [];
        this.aliveDirty = false;
        this.gasData = {};
        this.gasDirty = false;
        this.gasT = 0.0;
        this.gasTDirty = false;
        this.playerInfos = [];
        this.deletedPlayerIds = [];
        this.playerStatus = {};
        this.playerStatusDirty = false;
        this.groupStatus = {};
        this.groupStatusDirty = false;
        this.bullets = [];
        this.traps = [];
        this.removedTraps = [];
        this.explosions = [];
        this.emotes = [];
        this.planes = [];
        this.airstrikeZones = [];
        this.mapIndicators = [];
        this.killLeaderId = 0;
        this.killLeaderKills = 0;
        this.killLeaderDirty = false;
        this.offHandCooldownDirty = false;
        this.ack = 0;
    }

    _createClass(UpdateMsg, [{
        key: 'deserialize',
        value: function deserialize(s, objectCreator) {
            // Parse extended data flags
            var extFlags = s.readUint32();

            // Deleted game object ids
            var delCount = 0;
            if ((extFlags & UpdateExtFlags.DeletedObjects) != 0) {
                delCount = s.readUint16();
                for (var i = 0; i < delCount; i++) {
                    this.delObjIds.push(s.readUint16());
                }
            }

            // Full game objects
            var fullCount = 0;
            if ((extFlags & UpdateExtFlags.FullObjects) != 0) {
                fullCount = s.readUint16();
                for (var _i13 = 0; _i13 < fullCount; _i13++) {
                    var obj = {};
                    obj.__type = s.readUint8();
                    obj.__id = s.readUint16();

                    ObjectSerializeFns[obj.__type].deserializePart(s, obj);
                    ObjectSerializeFns[obj.__type].deserializeFull(s, obj);

                    this.fullObjects.push(obj);
                }
            }

            // Partial game objects
            {
                var count = s.readUint16();
                for (var _i14 = 0; _i14 < count; _i14++) {
                    var _obj = {};
                    _obj.__id = s.readUint16();
                    var type = objectCreator.getTypeById(_obj.__id, s);
                    if (!type) {
                        console.error('Type for object not found: ', type, ' objId: ', _obj.__id);
                        continue;
                    }
                    ObjectSerializeFns[type].deserializePart(s, _obj);

                    this.partObjects.push(_obj);
                }
            }

            // Active playerId
            if ((extFlags & UpdateExtFlags.ActivePlayerId) != 0) {
                this.activePlayerId = s.readUint16();
                this.activePlayerIdDirty = true;
            }

            // Active player state
            {
                var x = {};
                deserializeActivePlayer(s, x);
                this.activePlayerData = x;
            }

            // Gas data
            if ((extFlags & UpdateExtFlags.Gas) != 0) {
                var _x = {};
                deserializeGasData(s, _x);
                this.gasData = _x;
                this.gasDirty = true;
            }

            // Gas progress
            if ((extFlags & UpdateExtFlags.GasCircle) != 0) {
                this.gasT = s.readFloat(0.0, 1.0, 16);
                this.gasTDirty = true;
            }

            // PlayerInfos
            if ((extFlags & UpdateExtFlags.PlayerInfos) != 0) {
                var _count4 = s.readUint8();
                for (var _i15 = 0; _i15 < _count4; _i15++) {
                    var _x2 = {};
                    deserializePlayerInfo(s, _x2);
                    this.playerInfos.push(_x2);
                }
            }

            // DeletedPlayerIds
            if ((extFlags & UpdateExtFlags.DeletePlayerIds) != 0) {
                var _count5 = s.readUint8();
                for (var _i16 = 0; _i16 < _count5; _i16++) {
                    var playerId = s.readUint16();
                    this.deletedPlayerIds.push(playerId);
                }
            }

            // PlayerStatus
            if ((extFlags & UpdateExtFlags.PlayerStatus) != 0) {
                var _x3 = {};
                deserializePlayerStatus(s, _x3);
                this.playerStatus = _x3;
                this.playerStatusDirty = true;
            }

            // GroupStatus
            if ((extFlags & UpdateExtFlags.GroupStatus) != 0) {
                var _x4 = {};
                deserializeGroupStatus(s, _x4);
                this.groupStatus = _x4;
                this.groupStatusDirty = true;
            }

            //TODOFabian clean what is not needed for bullets (and if necessary for other things)
            // Bullets
            if ((extFlags & UpdateExtFlags.Bullets) != 0) {
                var _count6 = s.readUint8();
                for (var _i17 = 0; _i17 < _count6; _i17++) {
                    var _x5 = {};
                    _x5.playerId = s.readUint16();
                    _x5.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
                    _x5.dir = s.readUnitVec(8);
                    _x5.bulletType = s.readGameType();
                    _x5.layer = s.readBits(2);
                    _x5.varianceT = s.readFloat(0.0, 1.0, 4);
                    _x5.hasScale = s.readBoolean();
                    if (_x5.hasScale) {
                        _x5.scale = s.readFloat(Constants.BulletMinScale, Constants.BulletMaxScale, 8);
                    }
                    _x5.distAdjIdx = s.readBits(4);
                    _x5.clipDistance = s.readBoolean();
                    if (_x5.clipDistance) {
                        _x5.distance = s.readFloat(0.0, 1024.0, 16);
                    }
                    _x5.shotFx = s.readBoolean();
                    if (_x5.shotFx) {
                        _x5.shotSourceType = s.readGameType();
                        _x5.shotOffhand = s.readBoolean();
                        _x5.lastShot = s.readBoolean();
                    }
                    _x5.reflectCount = 0;
                    _x5.reflectObjId = 0;
                    var hasReflectObjId = s.readBoolean();
                    if (hasReflectObjId) {
                        _x5.reflectCount = s.readBits(2);
                        _x5.reflectObjId = s.readUint16();
                    }
                    _x5.hasSpecialFx = s.readBoolean();
                    if (_x5.hasSpecialFx) {
                        _x5.shotAlt = s.readBoolean();
                        _x5.splinter = s.readBoolean();
                        _x5.trailSaturated = s.readBoolean();
                        _x5.trailSmall = s.readBoolean();
                        _x5.trailThick = s.readBoolean();
                    }
                    _x5.active = s.readBoolean();
                    _x5.id = s.readUint8();
                    _x5.distanceTraveled = s.readBits(2);
                    this.bullets.push(_x5);
                }
                s.readAlignToNextByte();
            }

            //Traps
            if ((extFlags & UpdateExtFlags.Traps) != 0) {
                var _count7 = s.readUint8();
                for (var _i18 = 0; _i18 < _count7; _i18++) {
                    var _x6 = {};
                    _x6.definitionId = s.readBits(3);
                    var hasOwner = s.readBoolean();
                    if (hasOwner) {
                        _x6.teamId = s.readBits(4);
                        _x6.ownerId = s.readUint16();
                        _x6.ownerType = s.readBits(4);
                    } else {
                        _x6.ownerId = null;
                        _x6.ownerType = null;
                    }

                    var isAabb = s.readBoolean();
                    if (isAabb) _x6.hitbox = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);else {
                        _x6.hitbox = {};
                        _x6.hitbox.rad = s.readBits(16);
                    }

                    _x6.position = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
                    _x6.layer = s.readBits(2);
                    s.readAlignToNextByte();
                    this.traps.push(_x6);
                }
            }

            //Removed Traps
            if ((extFlags & UpdateExtFlags.RemovedTraps) != 0) {
                var _count8 = s.readUint8();
                for (var _i19 = 0; _i19 < _count8; _i19++) {
                    var _x7 = {};
                    _x7.definitionId = s.readBits(3);
                    _x7.ownerId = s.readUint16();
                    s.readAlignToNextByte();
                    this.removedTraps.push(_x7);
                }
            }

            // Explosions
            if ((extFlags & UpdateExtFlags.Explosions) != 0) {
                var _count9 = s.readUint8();
                for (var _i20 = 0; _i20 < _count9; _i20++) {
                    var _x8 = {};
                    _x8.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
                    _x8.type = s.readGameType();
                    _x8.layer = s.readBits(2);
                    s.readAlignToNextByte();
                    this.explosions.push(_x8);
                }
            }

            // Emotes
            if ((extFlags & UpdateExtFlags.Emotes) != 0) {
                var _count10 = s.readUint8();
                for (var _i21 = 0; _i21 < _count10; _i21++) {
                    var _x9 = {};
                    _x9.playerId = s.readUint16();
                    _x9.type = s.readGameType();
                    _x9.itemType = s.readGameType();
                    _x9.isPing = s.readBoolean();
                    if (_x9.isPing) {
                        _x9.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
                    }
                    s.readBits(3); // Padding
                    this.emotes.push(_x9);
                }
            }

            // Planes
            if ((extFlags & UpdateExtFlags.Planes) != 0) {
                var _count11 = s.readUint8();
                for (var _i22 = 0; _i22 < _count11; _i22++) {
                    var _x10 = {};
                    _x10.id = s.readUint8();
                    var pos = s.readVec(0.0, 0.0, 2048.0, 2048.0, 10);
                    _x10.pos = v2.create(pos.x - 512.0, pos.y - 512.0);
                    _x10.planeDir = s.readUnitVec(8);
                    _x10.actionComplete = s.readBoolean();
                    _x10.action = s.readBits(3);
                    this.planes.push(_x10);
                }
            }

            // AirstrikeZones
            if ((extFlags & UpdateExtFlags.AirstrikeZones) != 0) {
                var _count12 = s.readUint8();
                for (var _i23 = 0; _i23 < _count12; _i23++) {
                    var _x11 = {};
                    _x11.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 12);
                    _x11.rad = s.readFloat(0.0, Constants.AirstrikeZoneMaxRad, 8);
                    _x11.duration = s.readFloat(0.0, Constants.AirstrikeZoneMaxDuration, 8);
                    this.airstrikeZones.push(_x11);
                }
            }

            // Map indicators
            if ((extFlags & UpdateExtFlags.MapIndicators) != 0) {
                var _count13 = s.readUint8();
                for (var _i24 = 0; _i24 < _count13; _i24++) {
                    var _x12 = {};
                    _x12.id = s.readBits(4);
                    _x12.dead = s.readBoolean();
                    _x12.equipped = s.readBoolean();
                    _x12.type = s.readGameType();
                    _x12.pos = s.readVec(0.0, 0.0, 1024.0, 1024.0, 16);
                    this.mapIndicators.push(_x12);
                }
                s.readAlignToNextByte();
            }

            // Kill leader
            if ((extFlags & UpdateExtFlags.KillLeader) != 0) {
                this.killLeaderId = s.readUint16();
                this.killLeaderKills = s.readUint8();
                this.killLeaderDirty = true;
            }

            // Ack
            this.ack = s.readUint8();
        }
    }]);

    return UpdateMsg;
}();

var KillMsg = function () {
    function KillMsg() {
        _classCallCheck(this, KillMsg);

        this.itemSourceType = '';
        this.mapSourceType = '';
        this.damageType = 0;
        this.targetId = 0;
        this.killerId = 0;
        this.killCreditId = 0;
        this.killerKills = 0;
        this.downed = false;
        this.killed = false;
    }

    _createClass(KillMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.damageType = s.readUint8();
            this.itemSourceType = s.readGameType();
            this.mapSourceType = s.readMapType();
            this.targetId = s.readUint16();
            this.killerId = s.readUint16();
            this.killCreditId = s.readUint16();
            this.killerKills = s.readUint8();
            this.downed = s.readBoolean();
            this.killed = s.readBoolean();
            s.readAlignToNextByte();
        }
    }]);

    return KillMsg;
}();

var PlayerStatsMsg = function () {
    function PlayerStatsMsg() {
        _classCallCheck(this, PlayerStatsMsg);

        this.playerId = 0;
        this.playerStats = {};
    }

    _createClass(PlayerStatsMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            var x = {};
            x.playerId = s.readUint16();
            x.timeAlive = s.readUint16();
            x.kills = s.readUint8();
            x.dead = s.readUint8();
            x.damageDealt = s.readUint16();
            x.damageTaken = s.readUint16();
            x.isMyStats = s.readUint8();
            x.isMyKiller = s.readUint8();
            x.isMyTeam = s.readUint8();
            x.kpg = s.readString();
            x.rank = s.readUint8();
            x.hasGoldenBP = s.readUint8();
            this.playerStats = x;
        }
    }]);

    return PlayerStatsMsg;
}();

var GamePlayerStatsMsg = function () {
    function GamePlayerStatsMsg() {
        _classCallCheck(this, GamePlayerStatsMsg);

        this.isTeamAlive = 0;
        this.playerStats = [];
        this.playerGearStats = [];
    }

    _createClass(GamePlayerStatsMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.isTeamAlive = s.readUint8();
            var count = s.readUint8();
            for (var i = 0; i < count; i++) {
                var x = new PlayerStatsMsg();
                x.deserialize(s);
                this.playerStats.push(x.playerStats);
            }

            var countStats = s.readUint8();
            for (var _i25 = 0; _i25 < countStats; _i25++) {
                var stats = {};
                deserializeGearStats(s, stats);
                this.playerGearStats.push(stats);
            }
        }
    }]);

    return GamePlayerStatsMsg;
}();

var GameBattleResults = function () {
    function GameBattleResults() {
        _classCallCheck(this, GameBattleResults);

        this.gameOver = false;
        this.isTeamAlive = 0;
        this.playerStats = [];
        this.playerGearStats = [];
    }

    _createClass(GameBattleResults, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.gameOver = s.readUint8();
            this.isTeamAlive = s.readUint8();
            var count = s.readUint8();
            for (var i = 0; i < count; i++) {
                var x = new PlayerStatsMsg();
                x.deserialize(s);
                this.playerStats.push(x.playerStats);
            }

            var countStats = s.readUint8();
            for (var _i26 = 0; _i26 < countStats; _i26++) {
                var stats = {};
                deserializeGearStats(s, stats);
                this.playerGearStats.push(stats);
            }
        }
    }]);

    return GameBattleResults;
}();

var GameOverMsg = function () {
    function GameOverMsg() {
        _classCallCheck(this, GameOverMsg);

        this.teamId = 0;
        this.teamRank = 0;
        this.gameOver = false;
        this.winningTeamId = 0;
        this.isTeamAlive = 0;
        this.playerStats = [];
        this.playerGearStats = [];
    }

    _createClass(GameOverMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.teamId = s.readUint8();
            this.teamRank = s.readUint8();
            this.gameOver = s.readUint8();
            this.winningTeamId = s.readUint8();
            this.isTeamAlive = s.readUint8();
            var count = s.readUint8();
            for (var i = 0; i < count; i++) {
                var x = new PlayerStatsMsg();
                x.deserialize(s);
                this.playerStats.push(x.playerStats);
            }

            var countStats = s.readUint8();
            for (var _i27 = 0; _i27 < countStats; _i27++) {
                var stats = {};
                deserializeGearStats(s, stats);
                this.playerGearStats.push(stats);
            }
        }
    }]);

    return GameOverMsg;
}();

var PickupMsgType = {
    Full: 0,
    AlreadyOwned: 1,
    AlreadyEquipped: 2,
    BetterItemEquipped: 3,
    Success: 4,
    GunCannotFire: 5
};

var PickupMsg = function () {
    function PickupMsg() {
        _classCallCheck(this, PickupMsg);

        this.type = 0;
        this.item = '';
        this.count = 0;
    }

    _createClass(PickupMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.type = s.readUint8();
            this.item = s.readGameType();
            this.count = s.readUint8();
            s.readBits(6); // Padding
        }
    }]);

    return PickupMsg;
}();

var SpectateMsg = function () {
    function SpectateMsg() {
        _classCallCheck(this, SpectateMsg);

        this.specBegin = false;
        this.specId = 0;
        this.specNext = false;
        this.specPrev = false;
        this.specForce = false;
    }

    _createClass(SpectateMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeBoolean(this.specBegin);
            s.writeUint16(this.specId);
            s.writeBoolean(this.specNext);
            s.writeBoolean(this.specPrev);
            s.writeBoolean(this.specForce);
            s.writeBits(0, 4); // Padding
        }
    }]);

    return SpectateMsg;
}();

var RoleAnnouncementMsg = function () {
    function RoleAnnouncementMsg() {
        _classCallCheck(this, RoleAnnouncementMsg);

        this.playerId = 0;
        this.killerId = 0;
        this.role = '';
        this.assigned = false;
        this.killed = false;
    }

    _createClass(RoleAnnouncementMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            this.playerId = s.readUint16();
            this.killerId = s.readUint16();
            this.role = s.readGameType();
            this.assigned = s.readBoolean();
            this.killed = s.readBoolean();
            s.readAlignToNextByte();
        }
    }]);

    return RoleAnnouncementMsg;
}();

// @NOTE: Fake anti-cheat message


var AdStatusMsg = function () {
    function AdStatusMsg() {
        _classCallCheck(this, AdStatusMsg);

        this.blocked = false;
        this.prerollLoaded = false;
        this.prerollFreestar = false;
        this.prerollAIP = false;
    }

    _createClass(AdStatusMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeBoolean(this.blocked);
            s.writeBoolean(this.prerollLoaded);
            s.writeBoolean(this.prerollFreestar);
            s.writeBoolean(this.prerollAIP);
            s.writeBits(0, 4); // Padding
        }
    }]);

    return AdStatusMsg;
}();

// @NOTE: Fake anti-cheat message


var LoadoutMsg = function () {
    function LoadoutMsg() {
        _classCallCheck(this, LoadoutMsg);

        this.emotes = [];
        this.custom = false;
    }

    _createClass(LoadoutMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            for (var i = 0; i < GameConfig.EmoteSlot.Count; i++) {
                s.writeGameType(this.emotes[i]);
            }
            s.writeUint8(this.custom);
            s.writeAlignToNextByte();
        }
    }]);

    return LoadoutMsg;
}();

// @NOTE: Fake anti-cheat message


var StatsMsg = function () {
    function StatsMsg() {
        _classCallCheck(this, StatsMsg);

        this.data = '';
    }

    _createClass(StatsMsg, [{
        key: 'serialize',
        value: function serialize(s) {
            s.writeString(this.data);
        }
    }, {
        key: 'deserialize',
        value: function deserialize(s) {
            this.data = s.readString();
        }
    }]);

    return StatsMsg;
}();

var AliveCountsMsg = function () {
    function AliveCountsMsg() {
        _classCallCheck(this, AliveCountsMsg);

        this.teamAliveCounts = [];
    }

    _createClass(AliveCountsMsg, [{
        key: 'deserialize',
        value: function deserialize(s) {
            var count = s.readUint8();
            for (var i = 0; i < count; i++) {
                var alive = s.readUint8();
                this.teamAliveCounts.push(alive);
            }
        }
    }]);

    return AliveCountsMsg;
}();

var UpdatePassMsg = function () {
    function UpdatePassMsg() {
        _classCallCheck(this, UpdatePassMsg);
    }

    _createClass(UpdatePassMsg, [{
        key: 'serialize',
        value: function serialize(s) {}
    }, {
        key: 'deserialize',
        value: function deserialize(s) {}
    }]);

    return UpdatePassMsg;
}();

module.exports = {
    BitStream: bb.BitStream,
    Constants: Constants,

    getPlayerStatusUpdateRate: getPlayerStatusUpdateRate,

    MsgStream: MsgStream,

    Msg: Msg,
    JoinMsg: JoinMsg,
    DisconnectMsg: DisconnectMsg,
    InputMsg: InputMsg,
    EditMsg: EditMsg,
    DropItemMsg: DropItemMsg,
    JoinedMsg: JoinedMsg,
    UpdateMsg: UpdateMsg,
    MapMsg: MapMsg,
    KillMsg: KillMsg,
    PlayerStatsMsg: PlayerStatsMsg,
    GamePlayerStatsMsg: GamePlayerStatsMsg,
    GameBattleResults: GameBattleResults,
    GameOverMsg: GameOverMsg,
    PickupMsgType: PickupMsgType,
    PickupMsg: PickupMsg,
    SpectateMsg: SpectateMsg,
    PerkModeRoleSelectMsg: PerkModeRoleSelectMsg,
    EmoteMsg: EmoteMsg,
    RoleAnnouncementMsg: RoleAnnouncementMsg,
    AdStatusMsg: AdStatusMsg,
    LoadoutMsg: LoadoutMsg,
    StatsMsg: StatsMsg,
    UpdatePassMsg: UpdatePassMsg,
    AliveCountsMsg: AliveCountsMsg,
    WeaponMsg: WeaponMsg
};
