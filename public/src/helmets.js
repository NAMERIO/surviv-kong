"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gameConfig = require("./gameConfig.js");

var _require = require("./cb7a977d.js"),
    WeaponAttackType = _require.WeaponAttackType,
    StatusEffectAttackType = _require.StatusEffectAttackType;

var Common = {
    'helmet_steadfastvisor': {
        type: 'helmet',
        name: 'Steadfast Visor',
        id: 'helmet_steadfastvisor',
        images: {
            sm: 'img/gear/helmets/helmet_steadfastvisor_sm.png',
            md: 'img/gear/helmets/helmet_steadfastvisor_md.png'
        },
        rarity: 'common',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/emerald_knight'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
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
            requiredEssence: 400,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'helmet_eastmarchhelm': {
        type: 'helmet',
        name: 'Eastmarch Helm',
        id: 'helmet_eastmarchhelm',
        images: {
            sm: 'img/gear/helmets/helmet_eastmarchhelm_sm.png',
            md: 'img/gear/helmets/helmet_eastmarchhelm_md.png'
        },
        rarity: 'common',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/east_march_knight'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }]
    },
    'helmet_woodelfhood': {
        type: 'helmet',
        name: 'Wood Elf Hood',
        id: 'helmet_woodelfhood',
        images: {
            sm: 'img/gear/helmets/helmet_woodelfhood_sm.png',
            md: 'img/gear/helmets/helmet_woodelfhood_md.png'
        },
        rarity: 'common',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/woodelf'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }]
    },
    'helmet_whitemagehat': {
        type: 'helmet',
        name: 'White Mage Hat',
        id: 'helmet_whitemagehat',
        images: {
            sm: 'img/gear/helmets/helmet_whitemagehat_sm.png',
            md: 'img/gear/helmets/helmet_whitemagehat_md.png'
        },
        rarity: 'common',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/white_wizard'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 3,
            requiredEssence: 400,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }]
    }
};

var Rare = {
    'helmet_nordicheadguard': {
        type: 'helmet',
        name: 'Nordic Headguard',
        id: 'helmet_nordicheadguard',
        images: {
            sm: 'img/gear/helmets/helmet_nordicheadguard_sm.png',
            md: 'img/gear/helmets/helmet_nordicheadguard_md.png'
        },
        rarity: 'rare',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/dwarf'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
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
            requiredEssence: 350,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 4,
            requiredEssence: 950,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1600,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }]
    },
    'helmet_roguedaring': {
        type: 'helmet',
        name: 'Rogue\'s Daring',
        id: 'helmet_roguedaring',
        images: {
            sm: 'img/gear/helmets/helmet_roguedaring_sm.png',
            md: 'img/gear/helmets/helmet_roguedaring_md.png'
        },
        rarity: 'rare',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/bard_elf'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 2,
            requiredEssence: 50,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 3,
            requiredEssence: 450,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 4,
            requiredEssence: 900,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1650,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }]
    },
    'helmet_honshuwarrior': {
        type: 'helmet',
        name: 'Honshu Warrior Mask',
        id: 'helmet_honshuwarrior',
        images: {
            sm: 'img/gear/helmets/helmet_honshuwarrior_sm.png',
            md: 'img/gear/helmets/helmet_honshuwarrior_md.png'
        },
        rarity: 'rare',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/spirit_warrior'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 3,
            requiredEssence: 350,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 4,
            requiredEssence: 950,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1600,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }]
    },
    'helmet_zodiachood': {
        type: 'helmet',
        name: 'Zodiac Hood',
        id: 'helmet_zodiachood',
        images: {
            sm: 'img/gear/helmets/helmet_zodiachood_sm.png',
            md: 'img/gear/helmets/helmet_zodiachood_md.png'
        },
        rarity: 'rare',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/sorcerer'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 2,
            requiredEssence: 150,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 3,
            requiredEssence: 350,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
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
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }]
    }
};

var Epic = {
    'helmet_astarothgaze': {
        type: 'helmet',
        name: 'Raid',
        id: 'helmet_astarothgaze',
        images: {
            sm: 'img/gear/helmets/helmet_astarothgaze_sm.png',
            md: 'img/gear/helmets/helmet_astarothgaze_md.png'
        },
        rarity: 'epic',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/raid'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 2,
            requiredEssence: 150,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 3,
            requiredEssence: 350,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 4,
            requiredEssence: 950,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1600,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 6,
            requiredEssence: 2500,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3550,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'helmet_paladinhelm': {
        type: 'helmet',
        name: 'Paladin Helm',
        id: 'helmet_paladinhelm',
        images: {
            sm: 'img/gear/helmets/helmet_paladinhelm_sm.png',
            md: 'img/gear/helmets/helmet_paladinhelm_md.png'
        },
        rarity: 'epic',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/paladin'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 2,
            requiredEssence: 150,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 3,
            requiredEssence: 350,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 4,
            requiredEssence: 950,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1600,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 6,
            requiredEssence: 2500,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3650,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'helmet_wingeddominance': {
        type: 'helmet',
        name: 'Winged Dominance',
        id: 'helmet_wingeddominance',
        images: {
            sm: 'img/gear/helmets/helmet_wingeddominance_sm.png',
            md: 'img/gear/helmets/helmet_wingeddominance_md.png'
        },
        rarity: 'epic',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/supreme_knight'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 2,
            requiredEssence: 150,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 3,
            requiredEssence: 350,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 4,
            requiredEssence: 900,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1550,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 6,
            requiredEssence: 2450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3600,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'helmet_headpieceofvision': {
        type: 'helmet',
        name: 'Headpiece of Vision',
        id: 'helmet_headpieceofvision',
        images: {
            sm: 'img/gear/helmets/helmet_headpieceofvision_sm.png',
            md: 'img/gear/helmets/helmet_headpieceofvision_md.png'
        },
        rarity: 'epic',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/fairy_princess'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 2,
            requiredEssence: 100,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 3,
            requiredEssence: 450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 4,
            requiredEssence: 850,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
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
            requiredEssence: 2450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3650,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }]
    },
    'helmet_witchshade': {
        type: 'helmet',
        name: 'Witch Shade',
        id: 'helmet_witchshade',
        images: {
            sm: 'img/gear/helmets/helmet_witchshade_sm.png',
            md: 'img/gear/helmets/helmet_witchshade_md.png'
        },
        rarity: 'epic',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Helmet, 'armor_helmet/witchy'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
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
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 4,
            requiredEssence: 850,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 5,
            requiredEssence: 1550,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 6,
            requiredEssence: 2450,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 7,
            requiredEssence: 3600,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }]
    }
};

module.exports = Object.assign({}, Common, Rare, Epic);
