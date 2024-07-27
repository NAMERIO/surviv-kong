"use strict";


var _AttackIdToNumber, _PlayerAnimObjects;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EnumPlayerAnimType = {
    Idle: 0,
    //Sent in net
    Attack: 1,
    StatusEffect: 2,
    Throw: 3,

    //Only used on client
    Walking: 4,
    IdleDowned: 5,
    MovingDowned: 6,
    Charge_Attack: 7,
    Dash: 8,
    Revive: 9
};

var AttackIdToNumber = (_AttackIdToNumber = {}, _defineProperty(_AttackIdToNumber, 'lightAttack', 1), _defineProperty(_AttackIdToNumber, 'heavyAttack', 2), _defineProperty(_AttackIdToNumber, 'skill_1', 3), _defineProperty(_AttackIdToNumber, 'skill_2', 4), _defineProperty(_AttackIdToNumber, 'skill_3', 5), _AttackIdToNumber);

var AttackNumberToId = {
    1: 'lightAttack',
    2: 'heavyAttack',
    3: 'skill_1',
    4: 'skill_2',
    5: 'skill_3'
};

var PlayerAnimObjects = (_PlayerAnimObjects = {}, _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Idle, {
    animName: 'idle',
    animDuration: 0, //Spine duration
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Walking, {
    animName: 'run',
    animDuration: 0, //Spine duration
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.IdleDowned, {
    animName: 'squads/downed_idle',
    animDuration: 0, //Spine duration
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.MovingDowned, {
    animName: 'squads/downed_move',
    animDuration: 0, //Spine duration
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Revive, {
    animName: 'squads/revive_loop_side',
    animDuration: 0, //Spine duration
    notUseDirection: true,
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Dash, {
    animName: 'dash',
    //animDuration: 0, Anim duration is defined by skill
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Throw, {
    animName: 'throw',
    animDuration: 0.466, //Spine duration
    loop: false,
    track: 0,
    sound: '',
    useCursorDirection: true,
    fixedDirection: true
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Charge_Attack, {
    //animName: '', Anim name defined by weapon
    //animDuration: 0, Anim duration defined by charge active
    loop: true,
    track: 0,
    sound: ''
}), _defineProperty(_PlayerAnimObjects, EnumPlayerAnimType.Attack, {
    //animName: '', Anim name defined by weapon skill
    //animDuration: 0, Anim duration defined by weapon skill
    loop: false,
    track: 1
    //sound: '' Anim sound defined by weapon skill
}), _PlayerAnimObjects);

module.exports = {
    PlayerAnimObjects: PlayerAnimObjects,
    EnumPlayerAnimType: EnumPlayerAnimType,
    AttackIdToNumber: AttackIdToNumber,
    AttackNumberToId: AttackNumberToId
};
