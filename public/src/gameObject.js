"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require("./0e566746.js");

var ObjectType = {
    Invalid: 0,
    Player: 1,
    Obstacle: 2,
    Loot: 3,
    LootSpawner: 4,
    DeadBody: 5,
    Building: 6,
    Structure: 7,
    Decal: 8,
    Projectile: 9,
    Smoke: 10,
    Airdrop: 11,
    Npc: 12,
    Trap: 13, //TODO make traps use this object system 
    Skitternade: 14
};

var MAX_ID = 65535;

var ObjectRegistrar = function () {
    function ObjectRegistrar() {
        _classCallCheck(this, ObjectRegistrar);

        this.objects = [];
        this.idToObj = [];
        for (var i = 0; i < MAX_ID; i++) {
            this.idToObj[i] = null;
        }
        this.idToType = new Uint8Array(MAX_ID);
        this.dirtyPart = new Uint8Array(MAX_ID);
        this.dirtyFull = new Uint8Array(MAX_ID);

        this.idNext = 1;
        this.freeLists = {};

        // @TODO: Pre-allocate some ids for each type of dynamic object.
        // There is a potential situation where one dynamic object type,
        // such as loot, could grab all available ids into their free
        // list and starve other dynamic types.
    }

    _createClass(ObjectRegistrar, [{
        key: 'allocId',
        value: function allocId(type) {
            var id = 1;
            if (this.idNext < MAX_ID) {
                id = this.idNext++;
            } else {
                var freeList = this.freeLists[type] || [];
                if (freeList.length > 0) {
                    id = freeList.shift();
                } else {
                    assert(false);
                }
            }
            return id;
        }
    }, {
        key: 'freeId',
        value: function freeId(type, id) {
            this.freeLists[type] = this.freeLists[type] || [];
            this.freeLists[type].push(id);
        }
    }, {
        key: 'register',
        value: function register(obj, type) {
            var id = this.allocId(type);
            obj.__id = id;
            obj.__type = type;
            obj.__arrayIdx = this.objects.length;
            this.objects[obj.__arrayIdx] = obj;
            this.idToObj[id] = obj;
            this.idToType[id] = type;
            this.dirtyPart[id] = 1;
            this.dirtyFull[id] = 1;
        }
    }, {
        key: 'unregister',
        value: function unregister(obj) {
            assert(obj.__id > 0);

            var lastObj = this.objects.pop();
            if (obj !== lastObj) {
                this.objects[obj.__arrayIdx] = lastObj;
                lastObj.__arrayIdx = obj.__arrayIdx;
            }
            this.idToObj[obj.__id] = null;

            this.freeId(obj.__type, obj.__id);

            this.idToType[obj.__id] = 0;
            this.dirtyPart[obj.__id] = 0;
            this.dirtyFull[obj.__id] = 0;

            obj.__id = 0;
            obj.__type = 0;
        }
    }]);

    return ObjectRegistrar;
}();

module.exports = {
    MAX_ID: MAX_ID,
    Type: ObjectType,
    Registrar: ObjectRegistrar
};
