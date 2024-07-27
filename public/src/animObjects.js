"use strict";


var _defineProperty2 = require("./5e8b3cfc.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _NpcAnimObjects;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EnumNpcAnim = require("./enumNpcAnimations.js").EnumNpcAnimations;

var NpcAnimObjects = (_NpcAnimObjects = {}, (0, _defineProperty3.default)(_NpcAnimObjects, EnumNpcAnim.Idle, {
    animName: 'idle',
    animDuration: 0, //Spine duration
    loop: true,
    track: 0,
    sound: ''
}), (0, _defineProperty3.default)(_NpcAnimObjects, EnumNpcAnim.Walking, {
    animName: 'walk',
    animDuration: 0, //Spine duration
    loop: true,
    track: 0,
    sound: ''
}), (0, _defineProperty3.default)(_NpcAnimObjects, EnumNpcAnim.Charge_Attack, {
    //animName: '', Anim name defined by npc
    //animDuration: 0, Anim duration defined by charge active
    loop: true,
    track: 0,
    sound: ''
}), (0, _defineProperty3.default)(_NpcAnimObjects, EnumNpcAnim.Attack, {
    //animName: '', Anim name defined by npc skill
    //animDuration: 0, Anim duration defined by npc skill
    loop: false,
    track: 0
    //sound: '' Anim sound defined by npc
}), (0, _defineProperty3.default)(_NpcAnimObjects, EnumNpcAnim.Hurt, {
    //Hurt animObj defined in npc-defs
    animName: 'Hurt',
    animDuration: 0,
    loop: false,
    track: 0,
    sound: ''
}), _NpcAnimObjects);

module.exports = NpcAnimObjects;
