"use strict";


function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gameConfig = require("./gameConfig.js");

var _require = require("./cb7a977d.js"),
    WeaponAttackType = _require.WeaponAttackType,
    StatusEffectAttackType = _require.StatusEffectAttackType;

var Common = {
    'armor_puritychain': {
        type: 'armor',
        name: 'Purity Chain',
        id: 'armor_puritychain',
        images: {
            sm: 'img/gear/armors/armor_puritychain.png',
            md: 'img/gear/armors/armor_puritychain.png'
        },
        rarity: 'common',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/emerald_knight'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 3,
            requiredEssence: 800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }]
    },
    'armor_eastmarch': {
        type: 'armor',
        name: 'Eastmarch Armor',
        id: 'armor_eastmarch',
        images: {
            sm: 'img/gear/armors/armor_eastmarch.png',
            md: 'img/gear/armors/armor_eastmarch.png'
        },
        rarity: 'common',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/east_march_knight'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 3,
            requiredEssence: 800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }]
    },
    'armor_woodelfcloak': {
        type: 'armor',
        name: 'Wood Elf Cloak',
        id: 'armor_woodelfcloak',
        images: {
            sm: 'img/gear/armors/armor_woodelfcloak.png',
            md: 'img/gear/armors/armor_woodelfcloak.png'
        },
        rarity: 'common',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/woodelf'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 3,
            requiredEssence: 800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }]
    },
    'armor_whitewizardcloth': {
        type: 'armor',
        name: 'White Wizard Cloth',
        id: 'armor_whitewizardcloth',
        images: {
            sm: 'img/gear/armors/armor_whitewizardcloth.png',
            md: 'img/gear/armors/armor_whitewizardcloth.png'
        },
        rarity: 'common',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/white_wizard'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 3,
            requiredEssence: 800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }]
    }
};

var Rare = {
    'armor_nordicmail': {
        type: 'armor',
        name: 'Nordic Mail',
        id: 'armor_nordicmail',
        images: {
            smd: 'img/gear/armors/armor_nordicmail.png',
            sm: 'img/gear/armors/armor_nordicmail.png',
            md: 'img/gear/armors/armor_nordicmail.png'
        },
        rarity: 'rare',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/dwarf'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'boon',
                boon: 'boon_elvishmetal'
            }]
        }, {
            level: 3,
            requiredEssence: 750,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 4,
            requiredEssence: 1850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3200,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'armor_adventurertunic': {
        type: 'armor',
        name: 'Adventurer\'s Tunic',
        id: 'armor_adventurertunic',
        images: {
            sm: 'img/gear/armors/armor_adventurertunic.png',
            md: 'img/gear/armors/armor_adventurertunic.png'
        },
        rarity: 'rare',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/bard_elf'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 2,
            requiredEssence: 150,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 3,
            requiredEssence: 850,
            perks: [{
                type: 'boon',
                boon: 'boon_agoodstart'
            }]
        }, {
            level: 4,
            requiredEssence: 1800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3250,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }]
    },
    'armor_spiritwalker': {
        type: 'armor',
        name: 'Spiritwalker',
        id: 'armor_spiritwalker',
        images: {
            sm: 'img/gear/armors/armor_spiritwalker.png',
            md: 'img/gear/armors/armor_spiritwalker.png'
        },
        rarity: 'rare',
        style: 'leather',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/spirit_warrior'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 3,
            requiredEssence: 750,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Magic
                }
            }]
        }, {
            level: 4,
            requiredEssence: 1850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3200,
            perks: [{
                type: 'boon',
                boon: 'boon_extrapouch'
            }]
        }]
    },
    'armor_zodiacrobes': {
        type: 'armor',
        name: 'Zodiac Robes',
        id: 'armor_zodiacrobes',
        images: {
            sm: 'img/gear/armors/armor_zodiacrobes.png',
            md: 'img/gear/armors/armor_zodiacrobes.png'
        },
        rarity: 'rare',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/sorcerer'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 250,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 3,
            requiredEssence: 800,
            perks: [{
                type: 'boon',
                boon: 'boon_healerskit'
            }]
        }, {
            level: 4,
            requiredEssence: 1800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Bleed
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3150,
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

var Epic = {
    'armor_astarothward': {
        type: 'armor',
        name: 'Astaroth\'s Ward',
        id: 'armor_astarothward',
        images: {
            sm: 'img/gear/armors/armor_astarothward.png',
            md: 'img/gear/armors/armor_astarothward.png'
        },
        rarity: 'epic',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/raid'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 250,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 3,
            requiredEssence: 750,
            perks: [{
                type: 'boon',
                boon: 'boon_agoodstart'
            }]
        }, {
            level: 4,
            requiredEssence: 1750,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 10,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3200,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 6,
            requiredEssence: 5000,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 30,
                    type: StatusEffectAttackType.Ignite
                }
            }]
        }, {
            level: 7,
            requiredEssence: 7150,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'armor_paladinward': {
        type: 'armor',
        name: 'Paladin Ward',
        id: 'armor_paladinward',
        images: {
            sm: 'img/gear/armors/armor_paladinward.png',
            md: 'img/gear/armors/armor_paladinward.png'
        },
        rarity: 'epic',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/paladin'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
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
            requiredEssence: 750,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 4,
            requiredEssence: 1750,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3200,
            perks: [{
                type: 'boon',
                boon: 'boon_elvishmetal'
            }]
        }, {
            level: 6,
            requiredEssence: 5000,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 30,
                    type: StatusEffectAttackType.Blind
                }
            }]
        }, {
            level: 7,
            requiredEssence: 7250,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'armor_supremacy': {
        type: 'armor',
        name: 'Supremacy Armor',
        id: 'armor_supremacy',
        images: {
            sm: 'img/gear/armors/armor_supremacy.png',
            md: 'img/gear/armors/armor_supremacy.png'
        },
        rarity: 'epic',
        style: 'heavy',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/supreme_knight'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 250,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 3,
            requiredEssence: 850,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }, {
            level: 4,
            requiredEssence: 1800,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3150,
            perks: [{
                type: 'boon',
                boon: 'boon_extrapouch'
            }]
        }, {
            level: 6,
            requiredEssence: 4950,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Chill
                }
            }]
        }, {
            level: 7,
            requiredEssence: 7250,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Piercing
                }
            }]
        }]
    },
    'armor_armorofinsight': {
        type: 'armor',
        name: 'Armor of Insight',
        id: 'armor_armorofinsight',
        images: {
            sm: 'img/gear/armors/armor_armorofinsight.png',
            md: 'img/gear/armors/armor_armorofinsight.png'
        },
        rarity: 'epic',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/fairy_princess'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 3,
            requiredEssence: 850,
            perks: [{
                type: 'boon',
                boon: 'boon_extrapouch'
            }]
        }, {
            level: 4,
            requiredEssence: 1850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3200,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 6,
            requiredEssence: 4950,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Shock
                }
            }]
        }, {
            level: 7,
            requiredEssence: 7250,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }]
    },
    'armor_catsrobe': {
        type: 'armor',
        name: 'Cat\'s Robe',
        id: 'armor_catsrobe',
        images: {
            sm: 'img/gear/armors/armor_catsrobe.png',
            md: 'img/gear/armors/armor_catsrobe.png'
        },
        rarity: 'epic',
        style: 'cloth',
        skins: _defineProperty({}, gameConfig.SkinSlots.Body, 'armor_body/witchy'),
        levels: [{
            level: 1,
            requiredEssence: 0,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 2,
            requiredEssence: 200,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 15,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 3,
            requiredEssence: 850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 20,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 4,
            requiredEssence: 1850,
            perks: [{
                type: 'resistance',
                params: {
                    resistance: 25,
                    type: StatusEffectAttackType.Poison
                }
            }]
        }, {
            level: 5,
            requiredEssence: 3150,
            perks: [{
                type: 'protection',
                params: {
                    protection: 1,
                    type: WeaponAttackType.Slashing
                }
            }]
        }, {
            level: 6,
            requiredEssence: 4950,
            perks: [{
                type: 'boon',
                boon: 'boon_healerskit'
            }]
        }, {
            level: 7,
            requiredEssence: 7200,
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
