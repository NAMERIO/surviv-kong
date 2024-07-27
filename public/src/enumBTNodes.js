"use strict";


var EnumNodes = {
    //Base nodes
    BTRepeater: 1,
    BTSequencer: 2,
    BTSelector: 3,
    BTParallelComplete: 4,
    BTRepeaterFailure: 5,
    //Not implmented:
    //BTParallel: 6,
    //BTFallback: 7,

    //Behaviour nodes
    BTWait: 8,
    BTRoam: 9,
    BTSearchPlayer: 10,
    BTReturnToSpawner: 11,

    BTChaseTarget: 12,
    BTAttackMelee: 13,
    BTAttackRange: 14
};

module.exports = EnumNodes;
