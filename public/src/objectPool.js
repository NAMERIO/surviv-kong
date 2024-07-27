"use strict";


var _stringify = require("./1f15ac6e.js");

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require("./0e566746.js");
var FirebaseManager = require("./FirebaseManager.js");

//
// ObjectPool
//
var kShrinkThreshhold = 128;

function ObjectPool(classFn, params) {
    assert(classFn !== undefined);

    this.creator = { type: classFn };
    this.m_pool = [];
    this.activeCount = 0;
    this.params = params;
}

ObjectPool.prototype = {
    alloc: function alloc() {
        var obj = null;
        for (var i = 0; i < this.m_pool.length; i++) {
            if (!this.m_pool[i].active) {
                obj = this.m_pool[i];
                break;
            }
        }
        if (!obj) {
            obj = new this.creator.type();
            this.m_pool.push(obj);
        }
        obj.active = true;
        obj.m_init(this.params);
        this.activeCount++;
        return obj;
    },

    free: function free(obj) {
        obj.m_free();
        obj.active = false;
        this.activeCount--;

        if (this.m_pool.length > kShrinkThreshhold && this.activeCount < this.m_pool.length / 2) {
            if (false) {}

            var compact = [];
            for (var i = 0; i < this.m_pool.length; i++) {
                if (this.m_pool[i].active) {
                    compact.push(this.m_pool[i]);
                }
            }
            this.m_pool = compact;
        }
    },

    m_getPool: function m_getPool() {
        return this.m_pool;
    }
};

//
// ObjectCreator
//
function ObjectCreator(classFn) {
    this.idToObj = {};
    this.types = {};
    this.seenCount = 0;
}

ObjectCreator.prototype = {
    registerType: function registerType(type, pool) {
        this.types[type] = pool;
    },

    getObjById: function getObjById(id) {
        return this.idToObj[id];
    },

    getTypeById: function getTypeById(id, s) {
        var obj = this.getObjById(id);
        if (!obj) {
            var err = {
                instId: FirebaseManager.instanceId,
                id: id,
                ids: (0, _keys2.default)(this.idToObj),
                stream: s._view._view
            };
            FirebaseManager.logError('getTypeById' + (0, _stringify2.default)(err));
            FirebaseManager.storeGeneric('objectPoolErr', 'getTypeById');
            return 0;
        }
        return obj.__type;
    },

    updateObjFull: function updateObjFull(type, id, data, ctx) {
        var obj = this.getObjById(id);
        var isNew = false;
        // console.log(type);
        // console.log(id);
        // console.log(data);
        // console.log(ctx);
        if (obj === undefined) {
            obj = this.types[type].alloc();
            obj.__id = id;
            obj.__type = type;
            this.idToObj[id] = obj;
            this.seenCount++;
            isNew = true;
        }
        obj.m_updateData(data, true, isNew, ctx);
        // console.log(obj);
        return obj;
    },

    updateObjPart: function updateObjPart(id, data, ctx) {
        var obj = this.getObjById(id);
        if (obj) {
            obj.m_updateData(data, false, false, ctx);
        } else {
            console.log('updateObjPart, missing object', id);
            FirebaseManager.storeGeneric('objectPoolErr', 'updateObjPart');
        }
    },

    deleteObj: function deleteObj(id) {
        var obj = this.getObjById(id);
        if (obj === undefined) {
            console.log('deleteObj, missing object', id);
            FirebaseManager.storeGeneric('objectPoolErr', 'deleteObj');
        } else {
            this.types[obj.__type].free(obj);
            delete this.idToObj[id];
        }
    }
};

module.exports = {
    Pool: ObjectPool,
    Creator: ObjectCreator
};
