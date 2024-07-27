"use strict";


var _require = require("./cb7a977d.js"),
    StatusEffectAttackType = _require.StatusEffectAttackType;

var Common = {
    'ring_lonelywhisper': {
        type: 'ring',
        name: 'Lonely Whisper',
        id: 'ring_lonelywhisper',
        rarity: 'common',
        images: {
            sm: 'img/gear/rings/ring_lonelywhisper_sm.png',
            md: 'img/gear/rings/ring_lonelywhisper_md.png'
        },
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'boon',
                boon: 'boon_healerskit'
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }]
    },
    'ring_crystalheart': {
        type: 'ring',
        name: 'Crystal Heart',
        id: 'ring_crystalheart',
        rarity: 'common',
        images: {
            sm: 'img/gear/rings/ring_crystalheart_sm.png',
            md: 'img/gear/rings/ring_crystalheart_md.png'
        },
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'boon',
                boon: 'boon_elvishmetal'
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }]
    }
};

var Rare = {
    'ring_pureloop': {
        type: 'ring',
        name: 'Pure Loop',
        id: 'ring_pureloop',
        rarity: 'rare',
        images: {
            sm: 'img/gear/rings/ring_pureloop_sm.png',
            md: 'img/gear/rings/ring_pureloop_md.png'
        },
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'boon',
                boon: 'boon_extrapouch'
            }]
        }, {
            level: 2,
            requiredEssence: 150,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 4,
            requiredEssence: 850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1600,
            perks: [{
                type: 'boon',
                boon: 'boon_healerskit'
            }]
        }]
    },
    'ring_earneststar': {
        type: 'ring',
        name: 'Earnest Star',
        id: 'ring_earneststar',
        rarity: 'rare',
        images: {
            sm: 'img/gear/rings/ring_earneststar_sm.png',
            md: 'img/gear/rings/ring_earneststar_md.png'
        },
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'boon',
                boon: 'boon_agoodstart'
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 4,
            requiredEssence: 850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1650,
            perks: [{
                type: 'boon',
                boon: 'boon_agoodstart'
            }]
        }]
    }
};

var Epic = {
    'ring_lustrousspark': {
        type: 'ring',
        name: 'Lustrous Spark',
        id: 'ring_lustrousspark',
        rarity: 'epic',
        images: {
            sm: 'img/gear/rings/ring_lustrousspark_sm.png',
            md: 'img/gear/rings/ring_lustrousspark_md.png'
        },
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'boon',
                boon: 'boon_elvishmetal'
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 3,
            requiredEssence: 450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 4,
            requiredEssence: 850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1600,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 6,
            requiredEssence: 2550,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3550,
            perks: [{
                type: 'boon',
                boon: 'boon_healerskit'
            }]
        }]
    }
};

var Legendary = {
    'ring_exaltedswirl': {
        type: 'ring',
        name: 'Exalted Swirl',
        id: 'ring_exaltedswirl',
        rarity: 'legendary',
        images: {
            sm: 'img/gear/rings/ring_exaltedswirl_sm.png',
            md: 'img/gear/rings/ring_exaltedswirl_md.png'
        },
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'boon',
                boon: 'boon_extrapouch'
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 3,
            requiredEssence: 450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 4,
            requiredEssence: 900,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1550,
            perks: [{
                type: 'boon',
                boon: 'boon_healerskit'
            }]
        }, {
            level: 6,
            requiredEssence: 2450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3600,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 8,
            requiredEssence: 4950,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 9,
            requiredEssence: 6400,
            perks: [{
                type: 'boon',
                boon: 'boon_extrapouch'
            }]
        }]
    }
};

module.exports = Object.assign({}, Common, Rare, Epic, Legendary);
