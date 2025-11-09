import { util } from "../../utils/util";
import { Main, type PartialMapDef } from "./baseDefs";

const mapDef: PartialMapDef = {
    mapId: 5,
    desc: {
        name: "Valentine",
        icon: "img/gui/loot-medical-chocolateBox.svg",
        buttonCss: "btn-mode-valentine",
    },
    assets: {
        audio: [],
        atlases: ["gradient", "loadout", "shared", "valentine", "main"],
    },
    biome: {
        colors: {
            background: 2118510,
            water: 3310251,
            waterRipple: 9892086,
            beach: 13480795,
            riverbank: 9461284,
            grass: 8433481,
            underground: 1772803,
            playerSubmerge: 12633565,
            playerGhillie: 2118510,
        },
        particles: {},
    },
    mapGen: {
        densitySpawns: [
            {
                // tree_13: 400,
                // stone_01: 350,
                // barrel_01: 76,
                // silo_01: 8,
                // crate_01: 38,
                // crate_02: 4,
                // crate_03: 8,
                // bush_01: 78,
                // cache_06: 12,
                // tree_01: 320,
                // hedgehog_01: 24,
                // container_01: 5,
                // container_02: 5,
                // container_03: 5,
                // container_04: 5,
                // shack_01: 7,
                // outhouse_01: 5,
                // loot_tier_1: 24,
                // loot_tier_beach: 4,
                candy_store_01: 20,
            },
        ],
    },
};

export const Valentine = util.mergeDeep({}, Main, mapDef);
