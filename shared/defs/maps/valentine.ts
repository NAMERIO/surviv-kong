import { util } from "../../utils/util";
import { Main, type PartialMapDef } from "./baseDefs";

const mapDef: PartialMapDef = {
    mapId: 5,
    desc: {
        name: "Valentine",
        icon: "img/gui/loot-weapon-double-lasr-gun.svg",
        buttonCss: "btn-mode-may",
    },
    assets: {
        audio: [],
        atlases: ["gradient", "loadout", "shared", "valentine"],
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
    gameMode: { maxPlayers: 80, sniperMode: true },
    mapGen: {
        densitySpawns: [
            {
                stone_01: 350,
                barrel_01: 76,
                silo_01: 8,
                crate_01m: 38,
                crate_02: 4,
                crate_03: 8,
                crate_03x: 1,
                bush_01m: 78,
                cache_06: 12,
                tree_01: 120,
                tree_02m: 200,
                hedgehog_01: 24,
                container_01: 5,
                container_02: 5,
                container_03: 5,
                container_04: 5,
                shack_01: 7,
                outhouse_01: 5,
                loot_tier_1: 24,
                loot_tier_beach: 4,
                crate_23: 30,
            },
        ],
        randomSpawns: [],
        spawnReplacements: [
            {
                tree_01: "tree_01m",
                teahouse_complex_01su: "teahouse_complex_01m",
            },
        ],
    },
    lootTable: {

    },
};

export const Valentine = util.mergeDeep({}, Main, mapDef);
