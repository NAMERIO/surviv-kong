"use strict";


var EventsDef = {
    'stim-1': {
        name: 'Stim 1',
        type: 'event',
        xpBonus: 0.25,
        time: 30 * 60 * 1000,
        delay: 2 * 24 * 60 * 60 * 1000,
        rescheduled: false
    },
    'stim-2': {
        name: 'Stim 2',
        type: 'event',
        xpBonus: 0.25,
        time: 30 * 60 * 1000,
        delay: 4 * 24 * 60 * 60 * 1000,
        rescheduled: true

    },
    'stim-3': {
        name: 'Stim 3',
        type: 'event',
        xpBonus: 0.25,
        time: 30 * 60 * 1000,
        delay: 7 * 24 * 60 * 60 * 1000,
        rescheduled: true
    }
};

module.exports = EventsDef;
