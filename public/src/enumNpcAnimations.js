"use strict";


var EnumNpcAnimations = {
    Idle: 0,
    Walking: 1,
    Charge_Attack: 2,
    Attack: 3,
    Hurt: 4,
    Death: 5,
    Trap: 6
    //Spawn: x
};

var EnumDirToName = {
    0: 'right',
    1: 'left',
    2: 'down',
    3: 'up'
};

var EnumNameToDir = {
    'right': 0,
    'left': 1,
    'down': 2,
    'up': 3
};

module.exports = {
    EnumNpcAnimations: EnumNpcAnimations,
    EnumDirToName: EnumDirToName,
    EnumNameToDir: EnumNameToDir
};
