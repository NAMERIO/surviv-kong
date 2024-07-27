"use strict";


var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require("./f05b4d6a.js");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("./7400a140.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("./8f1e0713.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _fists, _slash, _meleeTwoHanded, _meleeLasrSwrd, _meleeKatana, _meleeNaginata, _machete, _rifle, _dualRifle, _bullpup, _launcher, _pistol, _dualPistol, _throwable, _downed, _frame16, _frame17, _frame18, _frame28, _frame29, _frame30, _frame31, _frame32, _frame33, _frame34, _frame35, _frame36, _frame37, _frame38, _frame39, _frame40, _frame41, _frame42, _frame43, _frame44, _frame45, _frame46, _frame47, _frame48, _frame49, _frame50, _frame51, _frame52, _frame63, _frame64, _frame65, _frame66, _frame67, _frame68, _frame69, _frame70, _frame71, _frame72, _frame73, _frame74, _frame75, _frame76, _frame77, _frame78, _frame79, _frame80, _frame81;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameConfig = require("./gameConfig.js");
var Anim = GameConfig.Anim;
var assert = require("./0e566746.js");
var math = require("./math.js");
var v2 = require("./v2.js");

var GameObjectDefs = require("./gameObjectDefs.js");
var StatusEffects = require("./statusEffects.js");

//
// Helpers
//

var Pose = function () {
    function Pose(pivot, rot, pos) {
        (0, _classCallCheck3.default)(this, Pose);

        this.pivot = v2.copy(pivot || v2.create(0.0, 0.0));
        this.rot = 0.0;
        this.pos = v2.copy(pos || v2.create(0.0, 0.0));
    }

    (0, _createClass3.default)(Pose, [{
        key: 'copy',
        value: function copy(pose) {
            v2.set(this.pivot, pose.pivot);
            this.rot = pose.rot;
            v2.set(this.pos, pose.pos);
        }
    }, {
        key: 'rotate',
        value: function rotate(angle) {
            this.rot = angle;
            return this;
        }
    }, {
        key: 'offset',
        value: function offset(pos) {
            this.pos = v2.copy(pos);
            return this;
        }
    }]);
    return Pose;
}();

Pose.identity = new Pose(v2.create(0.0, 0.0));

Pose.lerp = function (t, a, b) {
    var ret = new Pose();
    ret.pos = v2.lerp(t, a.pos, b.pos);
    ret.rot = math.lerp(t, a.rot, b.rot);
    ret.pivot = v2.lerp(t, a.pivot, b.pivot);
    return ret;
};

function frame(time, bones) {
    return { time: time, bones: bones };
}

function effect(timeObj, fn, args) {
    var time = typeof timeObj === 'number' ? timeObj : timeObj.end - (timeObj.end - timeObj.start) / 2;
    return { time: time, fn: fn, args: args };
}

//
// Bones
//
var Bones = {
    HandL: 0,
    HandR: 1,
    FootL: 2,
    FootR: 3
};
// Animation mirroring relies on bones coming in pairs
// on opposite sides of the body.
assert((0, _keys2.default)(Bones).length % 2 == 0);

//
// IdlePoses
//
var IdlePoses = {
    'fists': (_fists = {}, (0, _defineProperty3.default)(_fists, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_fists, Bones.HandR, new Pose(v2.create(14.0, 12.25))), _fists),
    'slash': (_slash = {}, (0, _defineProperty3.default)(_slash, Bones.HandL, new Pose(v2.create(18.0, -8.25))), (0, _defineProperty3.default)(_slash, Bones.HandR, new Pose(v2.create(6.0, 20.25))), _slash),
    'meleeTwoHanded': (_meleeTwoHanded = {}, (0, _defineProperty3.default)(_meleeTwoHanded, Bones.HandL, new Pose(v2.create(10.5, -14.25))), (0, _defineProperty3.default)(_meleeTwoHanded, Bones.HandR, new Pose(v2.create(18.0, 6.25))), _meleeTwoHanded),
    'meleeLasrSwrd': (_meleeLasrSwrd = {}, (0, _defineProperty3.default)(_meleeLasrSwrd, Bones.HandL, new Pose(v2.create(10.5, 0.0))), (0, _defineProperty3.default)(_meleeLasrSwrd, Bones.HandR, new Pose(v2.create(18.0, 0.5))), _meleeLasrSwrd),
    'meleeKatana': (_meleeKatana = {}, (0, _defineProperty3.default)(_meleeKatana, Bones.HandL, new Pose(v2.create(8.5, 13.25))), (0, _defineProperty3.default)(_meleeKatana, Bones.HandR, new Pose(v2.create(-3.0, 17.75))), _meleeKatana),
    'meleeNaginata': (_meleeNaginata = {}, (0, _defineProperty3.default)(_meleeNaginata, Bones.HandL, new Pose(v2.create(19.0, -7.25))), (0, _defineProperty3.default)(_meleeNaginata, Bones.HandR, new Pose(v2.create(8.5, 24.25))), _meleeNaginata),
    'machete': (_machete = {}, (0, _defineProperty3.default)(_machete, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_machete, Bones.HandR, new Pose(v2.create(1.0, 17.75))), _machete),

    'rifle': (_rifle = {}, (0, _defineProperty3.default)(_rifle, Bones.HandL, new Pose(v2.create(28.0, 5.25))), (0, _defineProperty3.default)(_rifle, Bones.HandR, new Pose(v2.create(14.0, 1.75))), _rifle),
    'dualRifle': (_dualRifle = {}, (0, _defineProperty3.default)(_dualRifle, Bones.HandL, new Pose(v2.create(5.75, -16.0))), (0, _defineProperty3.default)(_dualRifle, Bones.HandR, new Pose(v2.create(5.75, 16.0))), _dualRifle),

    'bullpup': (_bullpup = {}, (0, _defineProperty3.default)(_bullpup, Bones.HandL, new Pose(v2.create(28.0, 5.25))), (0, _defineProperty3.default)(_bullpup, Bones.HandR, new Pose(v2.create(24.0, 1.75))), _bullpup),
    'launcher': (_launcher = {}, (0, _defineProperty3.default)(_launcher, Bones.HandL, new Pose(v2.create(20.0, 10.0))), (0, _defineProperty3.default)(_launcher, Bones.HandR, new Pose(v2.create(2.0, 22.0))), _launcher),
    'pistol': (_pistol = {}, (0, _defineProperty3.default)(_pistol, Bones.HandL, new Pose(v2.create(14.0, 1.75))), (0, _defineProperty3.default)(_pistol, Bones.HandR, new Pose(v2.create(14.0, 1.75))), _pistol),
    'dualPistol': (_dualPistol = {}, (0, _defineProperty3.default)(_dualPistol, Bones.HandL, new Pose(v2.create(15.75, -8.75))), (0, _defineProperty3.default)(_dualPistol, Bones.HandR, new Pose(v2.create(15.75, 8.75))), _dualPistol),
    'throwable': (_throwable = {}, (0, _defineProperty3.default)(_throwable, Bones.HandL, new Pose(v2.create(15.75, -9.625))), (0, _defineProperty3.default)(_throwable, Bones.HandR, new Pose(v2.create(15.75, 9.625))), _throwable),
    'downed': (_downed = {}, (0, _defineProperty3.default)(_downed, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_downed, Bones.HandR, new Pose(v2.create(14.0, 12.25))), (0, _defineProperty3.default)(_downed, Bones.FootL, new Pose(v2.create(-15.75, -9.0))), (0, _defineProperty3.default)(_downed, Bones.FootR, new Pose(v2.create(-15.75, 9.0))), _downed)
};

//
// Animations
//
var fistsDef = GameObjectDefs['fists'].attack;
var hookDef = GameObjectDefs['hook'].attack;
var axeDef = GameObjectDefs['woodaxe'].attack;
var hammerDef = GameObjectDefs['stonehammer'].attack;
var lasrSwrdDef = GameObjectDefs['lasr_swrd'].attack;
var swordDef = GameObjectDefs['sword_emerald'];
var orbDef = GameObjectDefs['gravity_orb'];
var naginataDef = GameObjectDefs['naginata'].attack;
var panDef = GameObjectDefs['pan'].attack;
var sawDef = GameObjectDefs['saw'].attack;
var trappedEffect = StatusEffects.find(function (effect) {
    return effect.id === 5;
});

var Animations = {
    'none': {
        keyframes: [],
        effects: []
    },

    // Melee anims
    'fists': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)))), frame(fistsDef.damageTimes[0], (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(29.75, 1.75)))), frame(fistsDef.cooldownTime, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(fistsDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'cut': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)))), frame(fistsDef.damageTimes[0] * 0.25, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)).rotate(-Math.PI * 0.35))), frame(fistsDef.damageTimes[0] * 1.25, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)).rotate(Math.PI * 0.35))), frame(fistsDef.cooldownTime, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(fistsDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'cutReverse': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(1.0, 17.75)))), frame(fistsDef.damageTimes[0] * 0.4, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(Math.PI * 0.3))), frame(fistsDef.damageTimes[0] * 1.4, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(-Math.PI * 0.5))), frame(fistsDef.cooldownTime, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(1.0, 17.75))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(fistsDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'thrust': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)))), frame(fistsDef.damageTimes[0] * 0.4, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(5.0, 12.25)).rotate(Math.PI * 0.1))), frame(fistsDef.damageTimes[0] * 1.4, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(-Math.PI * 0.0))), frame(fistsDef.cooldownTime, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(fistsDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'slash': {
        keyframes: [frame(0.0, (_frame16 = {}, (0, _defineProperty3.default)(_frame16, Bones.HandL, new Pose(v2.create(18.0, -8.25))), (0, _defineProperty3.default)(_frame16, Bones.HandR, new Pose(v2.create(6.0, 20.25))), _frame16)), frame(fistsDef.damageTimes[0], (_frame17 = {}, (0, _defineProperty3.default)(_frame17, Bones.HandL, new Pose(v2.create(6.0, -22.25))), (0, _defineProperty3.default)(_frame17, Bones.HandR, new Pose(v2.create(6.0, 20.25)).rotate(-Math.PI * 0.6)), _frame17)), frame(fistsDef.cooldownTime, (_frame18 = {}, (0, _defineProperty3.default)(_frame18, Bones.HandL, new Pose(v2.create(18.0, -8.25))), (0, _defineProperty3.default)(_frame18, Bones.HandR, new Pose(v2.create(6.0, 20.25)).rotate(0.0)), _frame18))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(fistsDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'hook': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)))), frame(hookDef.damageTimes[0] * 0.25, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)).rotate(Math.PI * 0.1))), frame(hookDef.damageTimes[0], (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(24.0, 1.75)))), frame(hookDef.damageTimes[0] + 0.05, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)).rotate(Math.PI * -0.3))), frame(hookDef.damageTimes[0] + 0.1, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(hookDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'pan': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25)))), frame(0.15, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(22.0, -8.25)).rotate(-Math.PI * 0.2))), frame(0.25, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(28.0, -8.25)).rotate(Math.PI * 0.5))), frame(0.55, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 12.25))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(panDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'axeSwing': {
        keyframes: [frame(0.0, (_frame28 = {}, (0, _defineProperty3.default)(_frame28, Bones.HandL, new Pose(v2.create(10.5, -14.25))), (0, _defineProperty3.default)(_frame28, Bones.HandR, new Pose(v2.create(18.0, 6.25))), _frame28)), frame(axeDef.damageTimes[0] * 0.4, (_frame29 = {}, (0, _defineProperty3.default)(_frame29, Bones.HandL, new Pose(v2.create(9.0, -14.25)).rotate(Math.PI * 0.4)), (0, _defineProperty3.default)(_frame29, Bones.HandR, new Pose(v2.create(18.0, 6.25)).rotate(Math.PI * 0.4)), _frame29)), frame(axeDef.damageTimes[0], (_frame30 = {}, (0, _defineProperty3.default)(_frame30, Bones.HandL, new Pose(v2.create(9.0, -14.25)).rotate(-Math.PI * 0.4)), (0, _defineProperty3.default)(_frame30, Bones.HandR, new Pose(v2.create(18.0, 6.25)).rotate(-Math.PI * 0.4)), _frame30)), frame(axeDef.cooldownTime, (_frame31 = {}, (0, _defineProperty3.default)(_frame31, Bones.HandL, new Pose(v2.create(10.5, -14.25))), (0, _defineProperty3.default)(_frame31, Bones.HandR, new Pose(v2.create(18.0, 6.25))), _frame31))],
        effects: [effect(axeDef.damageTimes[0], 'animPlaySound', { sound: 'swing' }), effect(axeDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'hammerSwing': {
        keyframes: [frame(0.0, (_frame32 = {}, (0, _defineProperty3.default)(_frame32, Bones.HandL, new Pose(v2.create(10.5, -14.25))), (0, _defineProperty3.default)(_frame32, Bones.HandR, new Pose(v2.create(18.0, 6.25))), _frame32)), frame(hammerDef.damageTimes[0] * 0.4, (_frame33 = {}, (0, _defineProperty3.default)(_frame33, Bones.HandL, new Pose(v2.create(9.0, -14.25)).rotate(Math.PI * 0.4)), (0, _defineProperty3.default)(_frame33, Bones.HandR, new Pose(v2.create(18.0, 6.25)).rotate(Math.PI * 0.4)), _frame33)), frame(hammerDef.damageTimes[0], (_frame34 = {}, (0, _defineProperty3.default)(_frame34, Bones.HandL, new Pose(v2.create(9.0, -14.25)).rotate(-Math.PI * 0.4)), (0, _defineProperty3.default)(_frame34, Bones.HandR, new Pose(v2.create(18.0, 6.25)).rotate(-Math.PI * 0.4)), _frame34)), frame(hammerDef.cooldownTime, (_frame35 = {}, (0, _defineProperty3.default)(_frame35, Bones.HandL, new Pose(v2.create(10.5, -14.25))), (0, _defineProperty3.default)(_frame35, Bones.HandR, new Pose(v2.create(18.0, 6.25))), _frame35))],
        effects: [effect(hammerDef.damageTimes[0], 'animPlaySound', { sound: 'swing' }), effect(hammerDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'lasrSwrdSwing': {
        keyframes: [frame(0.0, (_frame36 = {}, (0, _defineProperty3.default)(_frame36, Bones.HandL, new Pose(v2.create(8.5, 13.25))), (0, _defineProperty3.default)(_frame36, Bones.HandR, new Pose(v2.create(16.0, 17.75))), _frame36)), frame(lasrSwrdDef.damageTimes[0] * 0.3, (_frame37 = {}, (0, _defineProperty3.default)(_frame37, Bones.HandL, new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2)), (0, _defineProperty3.default)(_frame37, Bones.HandR, new Pose(v2.create(16.0, 17.75)).rotate(Math.PI * 0.2)), _frame37)), frame(lasrSwrdDef.damageTimes[0] * 0.9, (_frame38 = {}, (0, _defineProperty3.default)(_frame38, Bones.HandL, new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 0.6)), (0, _defineProperty3.default)(_frame38, Bones.HandR, new Pose(v2.create(16.0, 17.75)).rotate(-Math.PI * 0.6)), _frame38)), frame(lasrSwrdDef.cooldownTime, (_frame39 = {}, (0, _defineProperty3.default)(_frame39, Bones.HandL, new Pose(v2.create(10.5, 0.0))), (0, _defineProperty3.default)(_frame39, Bones.HandR, new Pose(v2.create(18.0, 0.5))), _frame39))],
        effects: [effect(lasrSwrdDef.damageTimes[0], 'animPlaySound', { sound: 'swing' }), effect(lasrSwrdDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'lasrSwrd_pose_1': {
        keyframes: [frame(0.0, (_frame40 = {}, (0, _defineProperty3.default)(_frame40, Bones.HandL, new Pose(v2.create(10.5, 0.0)).rotate(Math.PI * 0.3)), (0, _defineProperty3.default)(_frame40, Bones.HandR, new Pose(v2.create(18.0, 0.5)).rotate(Math.PI * 0.3)), _frame40)), frame(lasrSwrdDef.poseTime * 0.5, (_frame41 = {}, (0, _defineProperty3.default)(_frame41, Bones.HandL, new Pose(v2.create(10.5, 0.0)).rotate(-Math.PI * 0.2)), (0, _defineProperty3.default)(_frame41, Bones.HandR, new Pose(v2.create(18.0, 0.5)).rotate(-Math.PI * 0.2)), _frame41)), frame(lasrSwrdDef.poseTime, (_frame42 = {}, (0, _defineProperty3.default)(_frame42, Bones.HandL, new Pose(v2.create(10.5, 0.0))), (0, _defineProperty3.default)(_frame42, Bones.HandR, new Pose(v2.create(18.0, 0.5))), _frame42))],
        effects: []
    },
    'lasrSwrd_pose_2': {
        keyframes: [frame(0.0, (_frame43 = {}, (0, _defineProperty3.default)(_frame43, Bones.HandL, new Pose(v2.create(10.5, 0.0)).rotate(-Math.PI * 0.2)), (0, _defineProperty3.default)(_frame43, Bones.HandR, new Pose(v2.create(18.0, 0.5)).rotate(-Math.PI * 0.2)), _frame43)), frame(lasrSwrdDef.poseTime * 0.5, (_frame44 = {}, (0, _defineProperty3.default)(_frame44, Bones.HandL, new Pose(v2.create(10.5, 0.0)).rotate(Math.PI * 0.2)), (0, _defineProperty3.default)(_frame44, Bones.HandR, new Pose(v2.create(18.0, 0.5)).rotate(Math.PI * 0.2)), _frame44)), frame(lasrSwrdDef.poseTime, (_frame45 = {}, (0, _defineProperty3.default)(_frame45, Bones.HandL, new Pose(v2.create(10.5, 0.0))), (0, _defineProperty3.default)(_frame45, Bones.HandR, new Pose(v2.create(18.0, 0.5))), _frame45))],
        effects: []
    },
    'lasrSwrd_pose_3': {
        keyframes: [frame(0.0, (_frame46 = {}, (0, _defineProperty3.default)(_frame46, Bones.HandL, new Pose(v2.create(10.5, 0.0)).rotate(Math.PI * 0.1)), (0, _defineProperty3.default)(_frame46, Bones.HandR, new Pose(v2.create(18.0, 0.5)).rotate(Math.PI * 0.1)), _frame46)), frame(lasrSwrdDef.poseTime * 0.5, (_frame47 = {}, (0, _defineProperty3.default)(_frame47, Bones.HandL, new Pose(v2.create(10.5, 0.0)).rotate(-Math.PI * 0.3)), (0, _defineProperty3.default)(_frame47, Bones.HandR, new Pose(v2.create(18.0, 0.5)).rotate(-Math.PI * 0.3)), _frame47)), frame(lasrSwrdDef.poseTime, (_frame48 = {}, (0, _defineProperty3.default)(_frame48, Bones.HandL, new Pose(v2.create(10.5, 0.0))), (0, _defineProperty3.default)(_frame48, Bones.HandR, new Pose(v2.create(18.0, 0.5))), _frame48))],
        effects: []
    }, /*
       'attack/sword/light': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(swordDef.attacks.lightAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(swordDef.attacks.lightAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(swordDef.attacks.lightAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(swordDef.attacks.lightAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(swordDef.attacks.lightAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/sword/heavy': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(swordDef.attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/sword/skill_01': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(swordDef.attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/sword/skill_02': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(swordDef.attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/sword/skill_03': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(swordDef.attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(swordDef.attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(swordDef.attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/axe/light': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['axe'].attacks.lightAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['axe'].attacks.lightAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['axe'].attacks.lightAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['axe'].attacks.lightAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['axe'].attacks.lightAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/axe/heavy': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/axe/skill_01': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/axe/skill_02': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/axe/skill_03': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['axe'].attacks.heavyAttack.duration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['axe'].attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/staff/light': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['staff'].attacks.lightAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['staff'].attacks.lightAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['staff'].attacks.lightAttack.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['staff'].attacks.lightAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['staff'].attacks.lightAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/staff/heavy': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['staff'].attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['staff'].attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['staff'].attacks.heavyAttack.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['staff'].attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['staff'].attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/staff/skill_01': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['staff'].attacks.skill_1.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['staff'].attacks.skill_1.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['staff'].attacks.skill_1.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['staff'].attacks.skill_1.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['staff'].attacks.skill_1.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/staff/skill_02': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['staff'].attacks.skill_2.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['staff'].attacks.skill_2.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['staff'].attacks.skill_2.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['staff'].attacks.skill_2.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['staff'].attacks.skill_2.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/staff/skill_03': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['staff'].attacks.skill_3.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['staff'].attacks.skill_3.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['staff'].attacks.skill_3.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['staff'].attacks.skill_3.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['staff'].attacks.skill_3.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/bow/light': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['bow'].attacks.lightAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['bow'].attacks.lightAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['bow'].attacks.lightAttack.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['bow'].attacks.lightAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['bow'].attacks.lightAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/bow/heavy': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['bow'].attacks.heavyAttack.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['bow'].attacks.heavyAttack.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['bow'].attacks.heavyAttack.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['bow'].attacks.heavyAttack.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['bow'].attacks.heavyAttack.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/bow/skill_01': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['bow'].attacks.skill_1.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['bow'].attacks.skill_1.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['bow'].attacks.skill_1.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['bow'].attacks.skill_1.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
         ]
       },
       'attack/bow/skill_02': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['bow'].attacks.skill_2.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['bow'].attacks.skill_2.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['bow'].attacks.skill_2.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['staff'].attacks.skill_2.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['staff'].attacks.skill_2.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/bow/skill_03': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(GameObjectDefs['bow'].attacks.skill_3.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(GameObjectDefs['bow'].attacks.skill_3.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(GameObjectDefs['bow'].attacks.skill_3.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(GameObjectDefs['bow'].attacks.skill_3.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
             effect(GameObjectDefs['bow'].attacks.skill_3.damageTimes[0], 'animMeleeCollision', {})
         ]
       },
       'attack/bow/trapped': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(trappedEffect.animDuration * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(trappedEffect.animDuration * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(trappedEffect.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(0, 'animPlaySound', { sound: 'swing' }),
             //effect(trappedEffect.animDuration, 'animMeleeCollision', {})
         ]
       },
       'attack/orb/skill_01': {
         keyframes: [
             frame(0.0, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             }),
             frame(orbDef.skills.skill_1.damageTimes[0] * 0.3, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(Math.PI * 0.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(Math.PI * 0.2)
             }),
             frame(orbDef.skills.skill_1.damageTimes[0] * 0.9, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)).rotate(-Math.PI * 1.2),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75)).rotate(-Math.PI * 1.2)
             }),
             frame(orbDef.skills.skill_1.animDuration, {
                 [Bones.HandL]: new Pose(v2.create(8.5, 13.25)),
                 [Bones.HandR]: new Pose(v2.create(-3.0, 17.75))
             })
         ],
         effects: [
             effect(orbDef.skills.skill_1.damageTimes[0], 'animPlaySound', { sound: 'swing' }),
         ]
       },*/
    'naginataSwing': {
        keyframes: [frame(0.0, (_frame49 = {}, (0, _defineProperty3.default)(_frame49, Bones.HandL, new Pose(v2.create(19.0, -7.25))), (0, _defineProperty3.default)(_frame49, Bones.HandR, new Pose(v2.create(8.5, 24.25))), _frame49)), frame(naginataDef.damageTimes[0] * 0.3, (_frame50 = {}, (0, _defineProperty3.default)(_frame50, Bones.HandL, new Pose(v2.create(19.0, -7.25)).rotate(Math.PI * 0.3)), (0, _defineProperty3.default)(_frame50, Bones.HandR, new Pose(v2.create(8.5, 24.25)).rotate(Math.PI * 0.3)), _frame50)), frame(naginataDef.damageTimes[0] * 0.9, (_frame51 = {}, (0, _defineProperty3.default)(_frame51, Bones.HandL, new Pose(v2.create(19.0, -7.25)).rotate(-Math.PI * 0.85)), (0, _defineProperty3.default)(_frame51, Bones.HandR, new Pose(v2.create(8.5, 24.25)).rotate(-Math.PI * 0.85)), _frame51)), frame(naginataDef.cooldownTime, (_frame52 = {}, (0, _defineProperty3.default)(_frame52, Bones.HandL, new Pose(v2.create(19.0, -7.25))), (0, _defineProperty3.default)(_frame52, Bones.HandR, new Pose(v2.create(8.5, 24.25))), _frame52))],
        effects: [effect(axeDef.damageTimes[0], 'animPlaySound', { sound: 'swing' }), effect(axeDef.damageTimes[0], 'animMeleeCollision', {})]
    },
    'sawSwing': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(1.0, 17.75)))), frame(sawDef.damageTimes[0] * 0.4, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(Math.PI * 0.3))), frame(sawDef.damageTimes[0], (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(-Math.PI * 0.3))), frame(sawDef.damageTimes[1] - 0.1, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 17.75)).rotate(-Math.PI * 0.25))), frame(sawDef.damageTimes[1] * 0.6, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(-36.0, 7.75)).rotate(-Math.PI * 0.25))), frame(sawDef.damageTimes[1] + 0.2, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(1.0, 17.75))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(0.4, 'animPlaySound', { sound: 'swing' }), effect(sawDef.damageTimes[0], 'animMeleeCollision', {}), effect(sawDef.damageTimes[1], 'animMeleeCollision', { playerHit: 'playerHit2' })]
    },
    'cutReverseShort': {
        keyframes: [frame(0.0, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(1.0, 17.75)))), frame(sawDef.damageTimes[0] * 0.4, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(Math.PI * 0.3))), frame(sawDef.damageTimes[0], (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(25.0, 6.25)).rotate(-Math.PI * 0.3))), frame(fistsDef.cooldownTime, (0, _defineProperty3.default)({}, Bones.HandR, new Pose(v2.create(14.0, 17.75))))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'swing' }), effect(fistsDef.damageTimes[0], '', {})]
    },

    // Action anims
    'cook': {
        keyframes: [frame(0.0, (_frame63 = {}, (0, _defineProperty3.default)(_frame63, Bones.HandL, new Pose(v2.create(15.75, -9.625))), (0, _defineProperty3.default)(_frame63, Bones.HandR, new Pose(v2.create(15.75, 9.625))), _frame63)), frame(0.1, (_frame64 = {}, (0, _defineProperty3.default)(_frame64, Bones.HandL, new Pose(v2.create(14.0, -1.75))), (0, _defineProperty3.default)(_frame64, Bones.HandR, new Pose(v2.create(14.0, 1.75))), _frame64)), frame(0.3, (_frame65 = {}, (0, _defineProperty3.default)(_frame65, Bones.HandL, new Pose(v2.create(14.0, -1.75))), (0, _defineProperty3.default)(_frame65, Bones.HandR, new Pose(v2.create(14.0, 1.75))), _frame65)), frame(0.4, (_frame66 = {}, (0, _defineProperty3.default)(_frame66, Bones.HandL, new Pose(v2.create(22.75, -1.75))), (0, _defineProperty3.default)(_frame66, Bones.HandR, new Pose(v2.create(1.75, 14.0))), _frame66)), frame(99999.0, (_frame67 = {}, (0, _defineProperty3.default)(_frame67, Bones.HandL, new Pose(v2.create(22.75, -1.75))), (0, _defineProperty3.default)(_frame67, Bones.HandR, new Pose(v2.create(1.75, 14.0))), _frame67))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'pullPin' }), effect(0.1, 'animSetThrowableState', { state: 'cook' })]
    },
    'throw': {
        keyframes: [frame(0.0, (_frame68 = {}, (0, _defineProperty3.default)(_frame68, Bones.HandL, new Pose(v2.create(22.75, -1.75))), (0, _defineProperty3.default)(_frame68, Bones.HandR, new Pose(v2.create(1.75, 14.175))), _frame68)), frame(0.15, (_frame69 = {}, (0, _defineProperty3.default)(_frame69, Bones.HandL, new Pose(v2.create(5.25, -15.75))), (0, _defineProperty3.default)(_frame69, Bones.HandR, new Pose(v2.create(29.75, 1.75))), _frame69)), frame(0.15 + GameConfig.player.throwTime, (_frame70 = {}, (0, _defineProperty3.default)(_frame70, Bones.HandL, new Pose(v2.create(15.75, -9.625))), (0, _defineProperty3.default)(_frame70, Bones.HandR, new Pose(v2.create(15.75, 9.625))), _frame70))],
        effects: [effect(0.0, 'animPlaySound', { sound: 'throwing' }), effect(0.0, 'animSetThrowableState', { state: 'throwing' }), effect(0.0, 'animThrowableParticles', {})]
    },
    'crawl_forward': {
        keyframes: [frame(0.0, (_frame71 = {}, (0, _defineProperty3.default)(_frame71, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_frame71, Bones.FootL, new Pose(v2.create(-15.75, -9.0))), _frame71)), frame(GameConfig.player.crawlTime * 0.33, (_frame72 = {}, (0, _defineProperty3.default)(_frame72, Bones.HandL, new Pose(v2.create(19.25, -10.5))), (0, _defineProperty3.default)(_frame72, Bones.FootL, new Pose(v2.create(-20.25, -9.0))), _frame72)), frame(GameConfig.player.crawlTime * 0.66, (_frame73 = {}, (0, _defineProperty3.default)(_frame73, Bones.HandL, new Pose(v2.create(5.25, -15.75))), (0, _defineProperty3.default)(_frame73, Bones.FootL, new Pose(v2.create(-11.25, -9.0))), _frame73)), frame(GameConfig.player.crawlTime * 1.0, (_frame74 = {}, (0, _defineProperty3.default)(_frame74, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_frame74, Bones.FootL, new Pose(v2.create(-15.75, -9.0))), _frame74))],
        effects: []
    },
    'crawl_backward': {
        keyframes: [frame(0.0, (_frame75 = {}, (0, _defineProperty3.default)(_frame75, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_frame75, Bones.FootL, new Pose(v2.create(-15.75, -9.0))), _frame75)), frame(GameConfig.player.crawlTime * 0.33, (_frame76 = {}, (0, _defineProperty3.default)(_frame76, Bones.HandL, new Pose(v2.create(5.25, -15.75))), (0, _defineProperty3.default)(_frame76, Bones.FootL, new Pose(v2.create(-11.25, -9.0))), _frame76)), frame(GameConfig.player.crawlTime * 0.66, (_frame77 = {}, (0, _defineProperty3.default)(_frame77, Bones.HandL, new Pose(v2.create(19.25, -10.5))), (0, _defineProperty3.default)(_frame77, Bones.FootL, new Pose(v2.create(-20.25, -9.0))), _frame77)), frame(GameConfig.player.crawlTime * 1.0, (_frame78 = {}, (0, _defineProperty3.default)(_frame78, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_frame78, Bones.FootL, new Pose(v2.create(-15.75, -9.0))), _frame78))],
        effects: []
    },
    'revive': {
        keyframes: [frame(0.0, (_frame79 = {}, (0, _defineProperty3.default)(_frame79, Bones.HandL, new Pose(v2.create(14.0, -12.25))), (0, _defineProperty3.default)(_frame79, Bones.HandR, new Pose(v2.create(14.0, 12.25))), _frame79)), frame(0.2, (_frame80 = {}, (0, _defineProperty3.default)(_frame80, Bones.HandL, new Pose(v2.create(24.5, -8.75))), (0, _defineProperty3.default)(_frame80, Bones.HandR, new Pose(v2.create(5.25, 21.0))), _frame80)), frame(0.2 + GameConfig.player.reviveDuration, (_frame81 = {}, (0, _defineProperty3.default)(_frame81, Bones.HandL, new Pose(v2.create(24.5, -8.75))), (0, _defineProperty3.default)(_frame81, Bones.HandR, new Pose(v2.create(5.25, 21.0))), _frame81))],
        effects: []
    }
};

module.exports = {
    Pose: Pose,
    Bones: Bones,
    IdlePoses: IdlePoses,
    Animations: Animations
};
