"use strict";


var Sounds = {
    //TODO clean surviv sounds not used, and delete audio files
    "hits": {
        "stone_bullet_hit_01": {
            path: "audio/hits/stone_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "wood_bullet_hit_01": {
            path: "audio/hits/wood_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "wood_bullet_hit_02": {
            path: "audio/hits/wood_bullet_hit_02.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "wood_bullet_hit_03": {
            path: "audio/hits/wood_bullet_hit_03.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "wood_bullet_hit_04": {
            path: "audio/hits/wood_bullet_hit_04.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "bush_bullet_hit_01": {
            path: "audio/hits/bush_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "metal_bullet_hit_01": {
            path: "audio/hits/metal_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "metal_bullet_hit_02": {
            path: "audio/hits/metal_bullet_hit_02.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "metal_bullet_hit_03": {
            path: "audio/hits/metal_bullet_hit_03.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "metal_bullet_hit_04": {
            path: "audio/hits/metal_bullet_hit_04.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 6
        },
        "pan_bullet_hit_01": {
            path: "audio/hits/pan_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 6
        },
        "brick_bullet_hit_01": {
            path: "audio/hits/brick_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "punch_hit_01": {
            path: "audio/hits/punch_hit_01.mp3",
            volume: 1.0
        },
        "knife_hit_01": {
            path: "audio/hits/knife_hit_01.mp3",
            volume: 1.0
        },
        "lasr_hit_01": {
            path: "audio/hits/lasr_hit_01.mp3",
            volume: 1.0
        },
        "pan_hit_01": {
            path: "audio/hits/pan_hit_01.mp3",
            volume: 1.0
        },
        "axe_hit_01": {
            path: "audio/hits/axe_hit_01.mp3",
            volume: 1.0
        },
        "hook_hit_01": {
            path: "audio/hits/hook_hit_01.mp3",
            volume: 1.0
        },
        "saw_hit_01": {
            path: "audio/hits/saw_hit_01.mp3",
            volume: 2.5
        },
        "crowbar_hit_01": {
            path: "audio/hits/crowbar_hit_01.mp3",
            volume: 1.0
        },
        "spade_hit_01": {
            path: "audio/hits/spade_hit_01.mp3",
            volume: 1.0
        },
        "hammer_hit_01": {
            path: "audio/hits/hammer_hit_01.mp3",
            volume: 1.0
        },
        "metal_punch_hit_01": {
            path: "audio/hits/metal_punch_hit_01.mp3",
            volume: 1.0
        },
        "metal_punch_hit_02": {
            path: "audio/hits/metal_punch_hit_02.mp3",
            volume: 1.0
        },
        "player_bullet_hit_01": {
            path: "audio/hits/player_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "player_bullet_hit_02": {
            path: "audio/hits/player_bullet_hit_02.mp3",
            volume: 1.0,
            canCoalesce: true
        },
        "skitter_bite_01": {
            path: "audio/hits/skitter_bite_01.mp3",
            volume: 2.0,
            canCoalesce: true
        },
        "skitter_hit_01": {
            path: "audio/hits/skitter_hit_01.mp3",
            volume: 3.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "plastic_bullet_hit_01": {
            path: "audio/hits/plastic_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "toilet_bullet_hit_01": {
            path: "audio/hits/toilet_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "toilet_bullet_hit_02": {
            path: "audio/hits/toilet_bullet_hit_02.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "glass_bullet_hit_01": {
            path: "audio/hits/glass_bullet_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "concrete_hit_01": {
            path: "audio/hits/concrete_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "frag_grass_01": {
            path: "audio/hits/frag_grass_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "frag_sand_01": {
            path: "audio/hits/frag_sand_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "frag_water_01": {
            path: "audio/hits/frag_water_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },

        "thunder_static_01": {
            path: "audio/hits/thunder_static_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },

        "cloth_hit_01": {
            path: "audio/hits/cloth_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "cloth_hit_02": {
            path: "audio/hits/cloth_hit_02.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "organic_hit_01": {
            path: "audio/hits/organic_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "piano_hit_01": {
            path: "audio/hits/piano_hit_01.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "piano_hit_02": {
            path: "audio/hits/piano_hit_02.mp3",
            volume: 1.0,
            canCoalesce: true,
            maxInstances: 3
        },
        "egg_hit_01": {
            path: "audio/hits/egg_hit_01.mp3",
            canCoalesce: true,
            volume: 1.0
        },
        "pinata_hit_01": {
            path: "audio/hits/pinata_hit_01.mp3",
            canCoalesce: true,
            volume: 1.0
        }
    },
    "sfx": {
        "sfx_obstacle_hit_wood": {
            path: "audio/sfx/sfx_obstacle_hit_wood.mp3",
            volume: 1.0
        },
        "sfx_obstacle_hit_stone": {
            path: "audio/sfx/sfx_obstacle_hit_stone.mp3",
            volume: 1.0
        },
        "sfx_obstacle_hit_metal": {
            path: "audio/sfx/sfx_obstacle_hit_metal.mp3",
            volume: 1.0
        },
        "sfx_obstacle_hit_leaf": {
            path: "audio/sfx/sfx_obstacle_hit_leaf.mp3",
            volume: 1.0
        },
        "sfx_obstacle_destroyed_wood": {
            path: "audio/sfx/sfx_obstacle_destroyed_wood.mp3",
            volume: 1.0
        },
        "sfx_obstacle_destroyed_metal": {
            path: "audio/sfx/sfx_obstacle_destroyed_metal.mp3",
            volume: 1.0
        },
        "sfx_obstacle_destroyed_stone": {
            path: "audio/sfx/sfx_obstacle_destroyed_stone.mp3",
            volume: 1.0
        },
        "sfx_obstacle_destroyed_leaf": {
            path: "audio/sfx/sfx_obstacle_destroyed_leaf.mp3",
            volume: 1.0
        },
        "crate_break_02": {
            path: "audio/sfx/crate_break_02.mp3",
            volume: 1.0
        },
        "skitter_destroy_01": {
            path: "audio/sfx/skitter_destroy_01.mp3",
            volume: 1.0
        },
        "metal_crate_break_01": {
            path: "audio/sfx/metal_crate_break_01.mp3",
            volume: 1.0
        },
        "tree_break_01": {
            path: "audio/sfx/tree_break_01.mp3",
            volume: 1.0
        },
        "bush_break_01": {
            path: "audio/sfx/bush_break_01.mp3",
            volume: 1.0
        },
        "bush_enter_01": {
            path: "audio/sfx/bush_enter_01.mp3",
            volume: 1.0,
            canCoalesce: true
        },
        "bush_enter_02": {
            path: "audio/sfx/bush_enter_02.mp3",
            volume: 1.0,
            canCoalesce: true
        },
        "barrel_break_01": {
            path: "audio/sfx/barrel_break_01.mp3",
            volume: 1.0
        },
        "barrel_break_02": {
            path: "audio/sfx/barrel_break_02.mp3",
            volume: 1.0
        },
        "stone_break_01": {
            path: "audio/sfx/stone_break_01.mp3",
            volume: 1.0
        },
        "wall_break_01": {
            path: "audio/sfx/wall_break_01.mp3",
            volume: 1.0
        },
        "ceiling_break_01": {
            path: "audio/sfx/ceiling_break_01.mp3",
            volume: 1.0
        },
        "ceiling_break_02": {
            path: "audio/sfx/ceiling_break_02.mp3",
            volume: 1.0
        },
        "toilet_break_01": {
            path: "audio/sfx/toilet_break_01.mp3",
            volume: 1.0
        },
        "toilet_break_02": {
            path: "audio/sfx/toilet_break_02.mp3",
            volume: 1.0
        },
        "vending_break_01": {
            path: "audio/sfx/vending_break_01.mp3",
            volume: 1.0
        },
        "window_break_01": {
            path: "audio/sfx/window_break_01.mp3",
            volume: 1.0
        },
        "window_break_02": {
            path: "audio/sfx/window_break_02.mp3",
            volume: 1.0
        },
        "drawers_break_01": {
            path: "audio/sfx/drawers_break_01.mp3",
            volume: 1.0
        },
        "oven_break_01": {
            path: "audio/sfx/oven_break_01.mp3",
            volume: 1.0
        },
        "deposit_box_break_01": {
            path: "audio/sfx/deposit_box_break_01.mp3",
            volume: 1.0
        },
        "cloth_break_01": {
            path: "audio/sfx/cloth_break_01.mp3",
            volume: 1.0
        },
        "screen_break_01": {
            path: "audio/sfx/screen_break_01.mp3",
            volume: 1.0
        },
        "pumpkin_break_01": {
            path: "audio/sfx/pumpkin_break_01.mp3",
            volume: 1.0,
            preload: false
        },
        "pinata_break_01": {
            path: "audio/sfx/pinata_break_01.mp3",
            volume: 1.0
        },
        "ceramic_break_01": {
            path: "audio/sfx/ceramic_break_01.mp3",
            volume: 1.0
        },
        "egg_break_01": {
            path: "audio/sfx/egg_break_01.mp3",
            volume: 1.0
        },
        "footstep_metal_01": {
            path: "audio/sfx/footstep_metal_01.mp3",
            volume: 1.0
        },
        "footstep_metal_02": {
            path: "audio/sfx/footstep_metal_02.mp3",
            volume: 1.0
        },
        "footstep_metal_03": {
            path: "audio/sfx/footstep_metal_03.mp3",
            volume: 1.0
        },
        "footstep_metal_04": {
            path: "audio/sfx/footstep_metal_04.mp3",
            volume: 1.0
        },
        "footstep_metal_05": {
            path: "audio/sfx/footstep_metal_05.mp3",
            volume: 1.0
        },
        "footstep_wood_01": {
            path: "audio/sfx/footstep_wood_01.mp3",
            volume: 1.0
        },
        "footstep_wood_02": {
            path: "audio/sfx/footstep_wood_02.mp3",
            volume: 1.0
        },
        "footstep_wood_03": {
            path: "audio/sfx/footstep_wood_03.mp3",
            volume: 1.0
        },
        "footstep_sand_01": {
            path: "audio/sfx/footstep_sand_01.mp3",
            volume: 1.0
        },
        "footstep_sand_02": {
            path: "audio/sfx/footstep_sand_02.mp3",
            volume: 1.0
        },
        "footstep_water_01": {
            path: "audio/sfx/footstep_water_01.mp3",
            volume: 1.0
        },
        "footstep_lava_01": {
            path: "audio/sfx/footstep_lava_01.mp3",
            volume: 1.0
        },
        "footstep_water_02": {
            path: "audio/sfx/footstep_water_02.mp3",
            volume: 1.0
        },
        "footstep_tile_01": {
            path: "audio/sfx/footstep_tile_01.mp3",
            volume: 1.0
        },
        "footstep_tile_02": {
            path: "audio/sfx/footstep_tile_02.mp3",
            volume: 1.0
        },
        "footstep_asphalt_01": {
            path: "audio/sfx/footstep_asphalt_01.mp3",
            volume: 1.0
        },
        "footstep_asphalt_02": {
            path: "audio/sfx/footstep_asphalt_02.mp3",
            volume: 1.0
        },
        "footstep_brick_01": {
            path: "audio/sfx/footstep_brick_01.mp3",
            volume: 1.0
        },
        "footstep_stone_01": {
            path: "audio/sfx/footstep_stone_01.mp3",
            volume: 0.8
        },
        "footstep_carpet_01": {
            path: "audio/sfx/footstep_carpet_01.mp3",
            volume: 1.0
        },
        "footstep_skitter_01": {
            path: "audio/sfx/footstep_skitter_01.mp3",
            volume: 1.0
        },
        "mothership_shoot_01": {
            path: "audio/sfx/mothership_shoot_01.mp3",
            volume: 1.0
        },
        "punch_swing_01": {
            path: "audio/sfx/punch_swing_01.mp3",
            volume: 1.0
        },
        "knife_swing_01": {
            path: "audio/sfx/knife_swing_01.mp3",
            volume: 1.0
        },
        "lasr_swing_01": {
            path: "audio/sfx/lasr_swing_01.mp3",
            volume: 1.0
        },
        "bullet_whiz_01": {
            path: "audio/sfx/bullet_whiz_01.mp3",
            volume: 1.0
        },
        "bullet_whiz_02": {
            path: "audio/sfx/bullet_whiz_02.mp3",
            volume: 1.0
        },
        "bullet_whiz_03": {
            path: "audio/sfx/bullet_whiz_03.mp3",
            volume: 1.0
        },
        "frag_throw_01": {
            path: "audio/sfx/frag_throw_01.mp3",
            volume: 1.0
        },
        "water_balloon_throw_01": {
            path: "audio/sfx/water_balloon_throw_01.mp3",
            volume: 1.0
        },
        "water_balloon_deploy_01": {
            path: "audio/sfx/water_hit_01.mp3",
            volume: 1.0
        },
        "frag_pin_01": {
            path: "audio/sfx/frag_pin_01.mp3",
            volume: 1.0
        },
        "frag_deploy_01": {
            path: "audio/ui/frag_pickup_01.mp3",
            volume: 1.0
        },
        "frag_water_01": {
            path: "audio/hits/frag_water_01.mp3",
            volume: 1.0
        },
        "strobe_click_01": {
            path: "audio/sfx/strobe_click_01.mp3",
            volume: 1.0
        },
        "explosion_01": {
            path: "audio/sfx/explosion_01.mp3",
            volume: 1.0
        },
        "explosion_02": {
            path: "audio/sfx/explosion_02.mp3",
            volume: 1.0
        },
        "explosion_03": {
            path: "audio/sfx/explosion_03.mp3",
            volume: 1.0
        },
        "explosion_04": {
            path: "audio/sfx/explosion_04.mp3",
            volume: 1.0,
            maxInstances: 4
        },
        "explosion_05": {
            path: "audio/sfx/explosion_05.mp3",
            volume: 1.0
        },
        "thunder_01": {
            path: "audio/sfx/thunder_01.mp3",
            volume: 1.0
        },
        "lucky_sound": {
            path: "audio/sfx/lucky_effect_01.mp3",
            volume: 1.0
        },

        "teleport_sound": {
            path: "audio/sfx/teleport_sound_01.mp3",
            volume: 1.0
        },
        "explosion_smoke_01": {
            path: "audio/sfx/explosion_smoke_01.mp3",
            volume: 1.0
        },
        "explosion_anti_fire_01": {
            path: "audio/sfx/explosion_anti_fire_01.mp3",
            volume: 1.0
        },
        "snowball_01": {
            path: "audio/sfx/snowball_01.mp3",
            volume: 1.0,
            preload: false
        },
        "snowball_02": {
            path: "audio/sfx/snowball_02.mp3",
            volume: 1.0,
            preload: false
        },
        "potato_01": {
            path: "audio/sfx/potato_01.mp3",
            volume: 1.0,
            preload: false
        },
        "potato_02": {
            path: "audio/sfx/potato_02.mp3",
            volume: 1.0,
            preload: false
        },
        "stow_weapon_01": {
            path: "audio/ui/stow_weapon_01.mp3",
            volume: 1.0
        },
        "knife_deploy_01": {
            path: "audio/ui/knife_deploy_01.mp3",
            volume: 1.0
        },
        "pan_pickup_01": {
            path: "audio/ui/pan_pickup_01.mp3",
            volume: 1.0
        },
        "knuckles_deploy_01": {
            path: "audio/ui/knuckles_deploy_01.mp3",
            volume: 1.0
        },
        "door_open_01": {
            path: "audio/sfx/door_open_01.mp3",
            volume: 1.0
        },
        "door_close_01": {
            path: "audio/sfx/door_close_01.mp3",
            volume: 1.0
        },
        "door_open_02": {
            path: "audio/sfx/door_open_02.mp3",
            volume: 1.0
        },
        "door_close_02": {
            path: "audio/sfx/door_close_02.mp3",
            volume: 1.0
        },
        "door_open_03": {
            path: "audio/sfx/door_open_03.mp3",
            volume: 1.0
        },
        "door_close_03": {
            path: "audio/sfx/door_close_03.mp3",
            volume: 1.0
        },
        "door_open_04": {
            path: "audio/sfx/door_open_04.mp3",
            volume: 0.8
        },
        "door_error_01": {
            path: "audio/sfx/door_error_01.mp3",
            volume: 1.0
        },
        "vault_change_01": {
            path: "audio/sfx/vault_change_01.mp3",
            volume: 1.0
        },
        "vault_change_02": {
            path: "audio/sfx/vault_change_02.mp3",
            volume: 1.0,
            preload: false
        },
        "vault_change_03": {
            path: "audio/sfx/vault_change_03.mp3",
            volume: 1.0,
            preload: false
        },
        "cell_control_01": {
            path: "audio/sfx/cell_control_01.mp3",
            volume: 1.0
        },
        "cell_control_02": {
            path: "audio/sfx/cell_control_02.mp3",
            volume: 1.0
        },
        "plane_01": {
            path: "audio/sfx/plane_01.mp3",
            volume: 1.0
        },
        "plane_02": {
            path: "audio/sfx/plane_02.mp3",
            volume: 1.0,
            preload: false
        },
        "fighter_01": {
            path: "audio/sfx/fighter_01.mp3",
            volume: 1.0
        },
        "airdrop_chute_01": {
            path: "audio/sfx/airdrop_chute_01.mp3",
            volume: 1.0
        },
        "airdrop_fall_01": {
            path: "audio/sfx/airdrop_fall_01.mp3",
            volume: 1.0
        },
        "airdrop_crash_01": {
            path: "audio/sfx/airdrop_crash_01.mp3",
            volume: 1.0
        },
        "airdrop_crash_02": {
            path: "audio/sfx/airdrop_crash_02.mp3",
            volume: 1.0
        },
        "airdrop_open_01": {
            path: "audio/sfx/airdrop_open_01.mp3",
            volume: 1.0
        },
        "airdrop_open_02": {
            path: "audio/sfx/airdrop_open_02.mp3",
            volume: 1.0
        },
        "button_press_01": {
            path: "audio/sfx/button_press_01.mp3",
            volume: 1.0,
            maxInstances: 3
        },
        "watering_01": {
            path: "audio/sfx/watering_01.mp3",
            volume: 1.0,
            maxInstances: 3,
            preload: false
        },
        "piano_02": {
            path: "audio/sfx/piano_02.mp3",
            volume: 1.0,
            preload: false
        },
        "footstep_08": {
            path: "audio/sfx/footstep_08.mp3",
            volume: 1.0,
            preload: false
        },
        "footstep_09": {
            path: "audio/sfx/footstep_09.mp3",
            volume: 1.0,
            preload: false
        },
        "howl_01": {
            path: "audio/sfx/howl_01.mp3",
            volume: 1.0,
            preload: false
        },
        "wheel_control_01": {
            path: "audio/sfx/wheel_control_01.mp3",
            volume: 1.0,
            preload: false
        },
        "log_01": {
            path: "audio/sfx/log_01.mp3",
            volume: 1.0,
            preload: false
        },
        "log_02": {
            path: "audio/sfx/log_02.mp3",
            volume: 1.0,
            preload: false
        },
        "log_03": {
            path: "audio/sfx/log_03.mp3",
            volume: 1.0,
            preload: false
        },
        "log_04": {
            path: "audio/sfx/log_04.mp3",
            volume: 1.0,
            preload: false
        },
        "log_05": {
            path: "audio/sfx/log_05.mp3",
            volume: 1.0,
            preload: false
        },
        "log_06": {
            path: "audio/sfx/log_06.mp3",
            volume: 1.0,
            preload: false
        },
        "log_11": {
            path: "audio/sfx/log_11.mp3",
            volume: 4.0,
            preload: false
        },
        "log_12": {
            path: "audio/sfx/log_12.mp3",
            volume: 4.0,
            preload: false
        },
        "log_13": {
            path: "audio/sfx/log_13.mp3",
            volume: 2.0,
            preload: false
        },
        "log_14": {
            path: "audio/sfx/log_14.mp3",
            volume: 2.0,
            preload: false
        },
        "ability_stim_01": {
            path: "audio/sfx/ability_stim_01.mp3",
            volume: 4.0
        },
        "xp_drop_01": {
            path: "audio/sfx/xp_drop_01.mp3",
            volume: 1.25,
            preload: false
        },
        "xp_drop_02": {
            path: "audio/sfx/xp_drop_02.mp3",
            volume: 1.25,
            preload: false
        },
        "cluck_01": {
            path: "audio/sfx/cluck_01.mp3",
            volume: 1.0,
            preload: false
        },
        "cluck_02": {
            path: "audio/sfx/cluck_02.mp3",
            volume: 1.0,
            preload: false
        },
        "feather_01": {
            path: "audio/sfx/feather_01.mp3",
            volume: 1.0,
            preload: false
        },
        "sugar_rush_01": {
            path: "audio/sfx/sugar_rush_01.mp3",
            volume: 1.0,
            maxInstances: 1
        },

        "wet_sound_01": {
            path: "audio/sfx/water_hit_01.mp3",
            volume: 1.0,
            maxInstances: 1
        }
    },
    //--- WEAPONS SFX --- //
    "weapons": {
        //Placeholder sfx sounds
        "medium_swing_01": {
            path: "audio/weapons/medium_swing_01.mp3",
            volume: 1.0
        },
        "heavy_swing_01": {
            path: "audio/weapons/heavy_swing_01.mp3",
            volume: 1.0
        },
        "charge_01": {
            path: "audio/weapons/charge_01.mp3",
            volume: 0.5
        },
        "ground_strike_01": {
            path: "audio/weapons/ground_strike_01.mp3",
            volume: 1.0
        },
        "arrow_01": {
            path: "audio/weapons/arrow_01.mp3",
            volume: 1.0
        },
        "heavy_arrow_01": {
            path: "audio/weapons/heavy_arrow_01.mp3",
            volume: 1.0
        },
        "magic_attack_01": {
            path: "audio/weapons/magic_attack_01.mp3",
            volume: 0.4
        },
        "magic_loop_01": {
            path: "audio/weapons/magic_loop_01.mp3",
            volume: 0.2
        },
        //Final SFX
        "sfx_weapons_charge_up": {
            path: "audio/weapons/sfx_weapon_charge_up.mp3",
            volume: 1.0
        },
        "sfx_player_weapon_pickup_magic": {
            path: "audio/player/sfx_player_weapon_pickup_magic.mp3",
            volume: 1.0
        },
        "sfx_player_weapon_pickup_piercing": {
            path: "audio/player/sfx_player_weapon_pickup_piercing.mp3",
            volume: 1.0
        },
        "sfx_player_weapon_pickup_slashing": {
            path: "audio/player/sfx_player_weapon_pickup_slashing.mp3",
            volume: 1.0
        },
        //AXE SFX
        "sfx_weapons_axe_cleave": {
            path: "audio/weapons/axe/sfx_weapon_axe_cleave.mp3",
            volume: 1.0
        },
        "sfx_weapons_axe_cleave_strong": {
            path: "audio/weapons/axe/sfx_weapon_axe_cleave_strong.mp3",
            volume: 1.0
        },
        "sfx_weapons_axe_crusher": {
            path: "audio/weapons/axe/sfx_weapon_axe_crusher.mp3",
            volume: 1.0
        },
        "sfx_weapons_axe_jump": {
            path: "audio/weapons/axe/sfx_weapon_axe_jump.mp3",
            volume: 1.0
        },
        "sfx_weapons_axe_leap": {
            path: "audio/weapons/axe/sfx_weapon_axe_leap.mp3",
            volume: 1.0
        },
        "sfx_weapons_axe_cyclone_loop": {
            path: "audio/weapons/axe/sfx_weapon_axe_cyclone_loop.mp3",
            volume: 1.0
        },
        //BOW SFX
        "sfx_weapon_bow_arrow_land": {
            path: "audio/weapons/bow/sfx_weapon_bow_arrow_land.mp3",
            volume: 1.0
        },
        "sfx_weapon_bow_arrow_shot_strong": {
            path: "audio/weapons/bow/sfx_weapon_bow_arrow_shot_strong.mp3",
            volume: 1.0
        },
        "sfx_weapon_bow_arrow_shot": {
            path: "audio/weapons/bow/sfx_weapon_bow_arrow_shot.mp3",
            volume: 1.0
        },
        "sfx_weapon_bow_draw_arrow": {
            path: "audio/weapons/bow/sfx_weapon_bow_draw_arrow.mp3",
            volume: 1.0
        },
        "sfx_weapon_bow_piercing_shot": {
            path: "audio/weapons/bow/sfx_weapon_bow_piercing_shot.mp3",
            volume: 1.0
        },
        "sfx_weapons_bow_quick_shot": {
            path: "audio/weapons/bow/sfx_weapon_bow_quick_shot.mp3",
            volume: 1.0
        },
        "sfx_weapons_bow_trap_plant_loop": {
            path: "audio/weapons/bow/sfx_weapon_bow_trap_plant_loop.mp3",
            volume: 1.0
        },
        "sfx_weapons_bow_trap_triggered": {
            path: "audio/weapons/bow/sfx_weapon_bow_trap_triggered.mp3",
            volume: 1.0
        },
        //DAGGER SFX
        "sfx_weapons_dagger_stab": {
            path: "audio/weapons/dagger/sfx_weapon_dagger_stab.mp3",
            volume: 1.0
        },
        "sfx_weapons_dagger_stab_strong": {
            path: "audio/weapons/dagger/sfx_weapon_dagger_stab_strong.mp3",
            volume: 1.0
        },
        "sfx_weapons_dagger_shadow_step": {
            path: "audio/weapons/dagger/sfx_weapon_dagger_shadow_step.mp3",
            volume: 1.0
        },
        "sfx_weapons_dagger_viper_strike": {
            path: "audio/weapons/dagger/sfx_weapon_dagger_viper_strike.mp3",
            volume: 1.0
        },
        "sfx_weapons_dagger_blade_flurry_loop": {
            path: "audio/weapons/dagger/sfx_weapon_dagger_blade_flurry_loop.mp3",
            volume: 1.0
        },
        //STAFF SFX
        "sfx_weapons_staff_orb_shot": {
            path: "audio/weapons/staff/sfx_weapon_staff_orb_shot.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_orb_shot_strong": {
            path: "audio/weapons/staff/sfx_weapon_staff_orb_shot_strong.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_orb_shot_explosion": {
            path: "audio/weapons/staff/sfx_weapon_staff_orb_shot_explosion.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_orb_shot_strong_explosion": {
            path: "audio/weapons/staff/sfx_weapon_staff_orb_shot_strong_explosion.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_frost_orb": {
            path: "audio/weapons/staff/sfx_weapon_staff_frost_orb.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_frost_orb_explosion": {
            path: "audio/weapons/staff/sfx_weapon_staff_frost_orb_explosion.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_trail_of_orbs": {
            path: "audio/weapons/staff/sfx_weapon_staff_trail_of_orbs.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_trail_of_orbs_explosion": {
            path: "audio/weapons/staff/sfx_weapon_staff_trail_of_orbs_explosion.mp3",
            volume: 1.0
        },
        "sfx_weapons_staff_volatile_surge": {
            path: "audio/weapons/staff/sfx_weapon_staff_volatile_surge.mp3",
            volume: 1.0
        },
        //SWORD SFX
        "sfx_weapons_sword_slash": {
            path: "audio/weapons/sword/sfx_weapon_sword_slash.mp3",
            volume: 1.0
        },
        "sfx_weapons_sword_slash_strong": {
            path: "audio/weapons/sword/sfx_weapon_sword_slash_strong.mp3",
            volume: 1.0
        },
        "sfx_weapons_sword_iron_wall": {
            path: "audio/weapons/sword/sfx_weapon_sword_iron_wall.mp3",
            volume: 1.0
        },
        "sfx_weapons_sword_shield_charge_loop": {
            path: "audio/weapons/sword/sfx_weapon_sword_shield_charge_loop.mp3",
            volume: 1.0
        },
        "sfx_weapons_sword_sundering_strike": {
            path: "audio/weapons/sword/sfx_weapon_sword_sundering_strike.mp3",
            volume: 1.0
        },
        "sfx_weapons_sword_sundering_strike_explosion": {
            path: "audio/weapons/sword/sfx_weapon_sword_sundering_strike_explosion.mp3",
            volume: 1.0
        },
        //WAND SFX
        "sfx_weapons_wand_burst_shot": {
            path: "audio/weapons/wand/sfx_weapon_wand_burst_shot.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_burst_shot_strong": {
            path: "audio/weapons/wand/sfx_weapon_wand_burst_shot_strong.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_burst_shot_strong_loop": {
            path: "audio/weapons/wand/sfx_weapon_wand_burst_shot_strong_loop.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_burst_shot_explosion": {
            path: "audio/weapons/wand/sfx_weapon_wand_burst_shot_explosion.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_fan_sparks": {
            path: "audio/weapons/wand/sfx_weapon_wand_fan_sparks.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_teleport": {
            path: "audio/weapons/wand/sfx_weapon_wand_teleport.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_teleport_sigil_loop": {
            path: "audio/weapons/wand/sfx_weapon_wand_teleport_sigil_loop.mp3",
            volume: 1.0
        },
        "sfx_weapons_wand_scorch": {
            path: "audio/weapons/wand/sfx_weapon_wand_scorch.mp3",
            volume: 1.0
        }
    },
    //--- MONSTERS SFX --- //
    "monsters": {
        "sfx_monsters_spawn": {
            path: "audio/monsters/sfx_monster_spawn.mp3",
            volume: 1.0
        },
        // GHOST ELF
        "sfx_monsters_ghostelf_attack": {
            path: "audio/monsters/ghostelf/sfx_monster_ghostelf_attack.mp3",
            volume: 1.0
        },
        "sfx_monsters_ghostelf_death": {
            path: "audio/monsters/ghostelf/sfx_monster_ghostelf_death.mp3",
            volume: 1.0
        },
        "sfx_monsters_ghostelf_grunt": {
            path: "audio/monsters/ghostelf/sfx_monster_ghostelf_grunt.mp3",
            volume: 1.0
        },
        "sfx_monsters_ghostelf_hurt": {
            path: "audio/monsters/ghostelf/sfx_monster_ghostelf_hurt.mp3",
            volume: 1.0
        },
        "sfx_monsters_ghostelf_walking_loop": {
            path: "audio/monsters/ghostelf/sfx_monster_ghostelf_walking_loop.mp3",
            volume: 1.0
        },
        // ORC
        "sfx_monsters_orc_attack_anticipation": {
            path: "audio/monsters/orc/sfx_monster_orc_attack_anticipation.mp3",
            volume: 1.0
        },
        "sfx_monsters_orc_attack": {
            path: "audio/monsters/orc/sfx_monster_orc_attack.mp3",
            volume: 1.0
        },
        "sfx_monsters_orc_death": {
            path: "audio/monsters/orc/sfx_monster_orc_death.mp3",
            volume: 1.0
        },
        "sfx_monsters_orc_grunt": {
            path: "audio/monsters/orc/sfx_monster_orc_grunt.mp3",
            volume: 1.0
        },
        "sfx_monsters_orc_hurt": {
            path: "audio/monsters/orc/sfx_monster_orc_hurt.mp3",
            volume: 1.0
        },
        "sfx_monsters_orc_walking_loop": {
            path: "audio/monsters/orc/sfx_monster_orc_walking_loop.mp3",
            volume: 1.0
        },
        // SKELETON
        "sfx_monsters_skeleton_attack_anticipation": {
            path: "audio/monsters/skeleton/sfx_monster_skeleton_attack_anticipation.mp3",
            volume: 1.0
        },
        "sfx_monsters_skeleton_attack": {
            path: "audio/monsters/skeleton/sfx_monster_skeleton_attack.mp3",
            volume: 1.0
        },
        "sfx_monsters_skeleton_death": {
            path: "audio/monsters/skeleton/sfx_monster_skeleton_death.mp3",
            volume: 1.0
        },
        "sfx_monsters_skeleton_grunt": {
            path: "audio/monsters/skeleton/sfx_monster_skeleton_grunt.mp3",
            volume: 1.0
        },
        "sfx_monsters_skeleton_hurt": {
            path: "audio/monsters/skeleton/sfx_monster_skeleton_hurt.mp3",
            volume: 1.0
        },
        "sfx_monsters_skeleton_walking_loop": {
            path: "audio/monsters/skeleton/sfx_monster_skeleton_walking_loop.mp3",
            volume: 1.0
        }
    },
    //--- AMBIENT SFX --- //
    "ambient": {
        "ambient_wind_01": {
            path: "audio/ambient/ambient_wind_01.mp3",
            volume: 1.0,
            loadPriority: 1
        },
        "ambient_waves_01": {
            path: "audio/ambient/ambient_waves_01.mp3",
            volume: 1.0,
            loadPriority: 1
        },
        "ambient_lava_01": {
            path: "audio/ambient/ambient_lava_01.mp3",
            volume: 1.0,
            loadPriority: 1
        },
        "ambient_stream_01": {
            path: "audio/ambient/ambient_stream_01.mp3",
            volume: 1.0,
            loadPriority: 1
        },
        "piano_music_01": {
            path: "audio/ambient/piano_music_01.mp3",
            volume: 1.0,
            preload: false
        },
        "ambient_wind_02": {
            path: "audio/ambient/ambient_wind_02.mp3",
            volume: 1.0,
            preload: false
        },
        "ambient_steam_01": {
            path: "audio/ambient/ambient_steam_01.mp3",
            volume: 1.0,
            preload: false
        },
        "club_music_01": {
            path: "audio/ambient/club_music_01.mp3",
            volume: 1.0,
            preload: false
        },
        "club_music_02": {
            path: "audio/ambient/club_music_02.mp3",
            volume: 1.0,
            preload: false
        },
        "ambient_lab_01": {
            path: "audio/ambient/ambient_lab_01.mp3",
            volume: 0.2,
            preload: false
        }
    },
    //--- UI SFX --- //
    "ui": {
        "ammo_pickup_01": {
            path: "audio/ui/ammo_pickup_01.mp3",
            volume: 1.0
        },
        "clothes_pickup_01": {
            path: "audio/ui/clothes_pickup_01.mp3",
            volume: 1.0
        },
        "bells_01": {
            path: "audio/sfx/plane_02.mp3",
            volume: 1.0,
            preload: false
        },
        "helmet_pickup_01": {
            path: "audio/ui/helmet_pickup_01.mp3",
            volume: 1.0
        },
        "chest_pickup_01": {
            path: "audio/ui/chest_pickup_01.mp3",
            volume: 1.0
        },
        "gun_pickup_01": {
            path: "audio/ui/gun_pickup_01.mp3",
            volume: 1.0
        },
        "scope_pickup_01": {
            path: "audio/ui/scope_pickup_01.mp3",
            volume: 1.0
        },
        "pack_pickup_01": {
            path: "audio/ui/pack_pickup_01.mp3",
            volume: 1.0
        },
        "soda_pickup_01": {
            path: "audio/ui/soda_pickup_01.mp3",
            volume: 1.0
        },
        "pills_pickup_01": {
            path: "audio/ui/pills_pickup_01.mp3",
            volume: 1.0
        },
        "bandage_pickup_01": {
            path: "audio/ui/bandage_pickup_01.mp3",
            volume: 1.0
        },
        "healthkit_pickup_01": {
            path: "audio/ui/healthkit_pickup_01.mp3",
            volume: 1.0
        },
        "frag_pickup_01": {
            path: "audio/ui/frag_pickup_01.mp3",
            volume: 1.0
        },
        "snowball_pickup_01": {
            path: "audio/ui/snowball_pickup_01.mp3",
            volume: 1.0,
            preload: false
        },
        "potato_pickup_01": {
            path: "audio/ui/potato_pickup_01.mp3",
            volume: 1.0,
            preload: false
        },
        "heavy_pickup_01": {
            path: "audio/ui/heavy_pickup_01.mp3",
            volume: 1.0
        },
        "pan_pickup_01": {
            path: "audio/ui/pan_pickup_01.mp3",
            volume: 1.0
        },
        "perk_pickup_01": {
            path: "audio/ui/perk_pickup_01.mp3",
            volume: 1.0
        },
        "xp_pickup_01": {
            path: "audio/ui/xp_pickup_01.mp3",
            volume: 1.5,
            preload: false
        },
        "xp_pickup_02": {
            path: "audio/ui/xp_pickup_02.mp3",
            volume: 1.5,
            preload: false
        },
        "chocolateBox_pickup_01": {
            path: "audio/ui/chocolateBox_pickup_01.mp3",
            volume: 1.0
        },
        "gunchilada_pickup_01": {
            path: "audio/ui/gunchilada_pickup_01.mp3",
            volume: 1.0
        },
        "watermelon_pickup_01": {
            path: "audio/ui/gunchilada_pickup_01.mp3",
            volume: 1.0
        },
        "ping_danger_01": {
            path: "audio/ui/ping_danger_01.mp3",
            volume: 1.0
        },
        "ping_coming_01": {
            path: "audio/ui/ping_coming_01.mp3",
            volume: 1.0
        },
        "ping_loot_01": {
            path: "audio/ui/ping_loot_01.mp3",
            volume: 1.0
        },
        "ping_leader_01": {
            path: "audio/ui/ping_leader_01.mp3",
            volume: 1.0,
            preload: false
        },
        "ping_airdrop_01": {
            path: "audio/ui/ping_airdrop_01.mp3",
            volume: 1.0
        },
        "ping_airstrike_01": {
            path: "audio/ui/ping_airstrike_01.mp3",
            volume: 1.0
        },
        "ping_unlock_01": {
            path: "audio/ui/ping_unlock_01.mp3",
            volume: 1.0,
            preload: false
        },
        "emote_01": {
            path: "audio/ui/emote_01.mp3",
            volume: 1.0
        },
        "trick_01": {
            path: "audio/ui/trick_01.mp3",
            volume: 1.5,
            preload: false
        },
        "trick_02": {
            path: "audio/ui/trick_02.mp3",
            volume: 1.5,
            preload: false
        },
        "trick_03": {
            path: "audio/ui/trick_03.mp3",
            volume: 1.5,
            preload: false
        },
        "treat_01": {
            path: "audio/ui/treat_01.mp3",
            volume: 1.0,
            preload: false
        },
        "loot_drop_01": {
            path: "audio/ui/loot_drop_01.mp3",
            volume: 1.0
        },
        "notification_start_01": {
            path: "audio/ui/notification_start_01.mp3",
            volume: 1.0
        },
        "notification_join_01": {
            path: "audio/ui/notification_join_01.mp3",
            volume: 1.0
        },
        "leader_assigned_01": {
            path: "audio/ui/leader_assigned_01.mp3",
            volume: 1.0,
            maxInstances: 1
        },
        "leader_dead_01": {
            path: "audio/ui/leader_dead_01.mp3",
            volume: 1.75,
            maxInstances: 1
        },
        "lt_assigned_01": {
            path: "audio/ui/lt_assigned_01.mp3",
            volume: 1.0,
            preload: false,
            maxInstances: 1
        },
        "medic_assigned_01": {
            path: "audio/ui/medic_assigned_01.mp3",
            volume: 2.0,
            preload: false,
            maxInstances: 1
        },
        "marksman_assigned_01": {
            path: "audio/ui/marksman_assigned_01.mp3",
            volume: 2.0,
            preload: false,
            maxInstances: 1
        },
        "recon_assigned_01": {
            path: "audio/ui/recon_assigned_01.mp3",
            volume: 1.5,
            preload: false,
            maxInstances: 1
        },
        "grenadier_assigned_01": {
            path: "audio/ui/grenadier_assigned_01.mp3",
            volume: 2.5,
            preload: false,
            maxInstances: 1
        },
        "bugler_assigned_01": {
            path: "audio/ui/bugler_assigned_01.mp3",
            volume: 2.5,
            preload: false,
            maxInstances: 1
        },
        "last_man_assigned_01": {
            path: "audio/ui/last_man_assigned_01.mp3",
            volume: 1.75,
            preload: false,
            maxInstances: 1
        },
        "helmet03_forest_pickup_01": {
            path: "audio/ui/helmet03_forest_pickup_01.mp3",
            volume: 1.0,
            maxInstances: 1,
            preload: false
        },
        "kill_leader_assigned_01": {
            path: "audio/ui/kill_leader_assigned_01.mp3",
            volume: 1.5,
            maxInstances: 1,
            preload: false
        },
        "kill_leader_assigned_02": {
            path: "audio/ui/kill_leader_assigned_02.mp3",
            volume: 1.5,
            maxInstances: 1,
            preload: false
        },
        "kill_leader_dead_01": {
            path: "audio/ui/kill_leader_dead_01.mp3",
            volume: 1.5,
            maxInstances: 1,
            preload: false
        },
        "kill_leader_dead_02": {
            path: "audio/ui/kill_leader_dead_02.mp3",
            volume: 1.5,
            maxInstances: 1,
            preload: false
        },
        "spawn_01": {
            path: "audio/ui/spawn_01.mp3",
            volume: 3.0,
            preload: false
        },
        "spin_01": {
            path: "audio/ui/spin_01.mp3",
            volume: 2.0,
            loadPriority: 2
        },
        "get_item_01": {
            path: "audio/ui/get_item_01.mp3",
            volume: 2.0,
            loadPriority: 2
        },
        "open_crate_spinner_01": {
            path: "audio/ui/open_crate_spinner_01.mp3",
            volume: 2.0,
            loadPriority: 2
        }
    },
    "music": {
        "menu_music": {
            path: "audio/ambient/bgm_main_menu.mp3",
            volume: 0.2,
            loadPriority: 2
        },
        "victory_music": {
            path: "audio/ambient/bgm_victory.mp3",
            volume: 0.2,
            loadPriority: 2
        }
    },
    "players": {
        //BHA player sounds
        "sfx_player_hit": {
            path: "audio/player/sfx_player_hit.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_damaged": {
            path: "audio/player/sfx_player_damaged.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_death": {
            path: "audio/player/sfx_player_death.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_level_up": {
            path: "audio/player/sfx_player_level_up.mp3", //Previamente llamado FANFARE
            volume: 0.8,
            loadPriority: 2
        },

        "sfx_player_heartbeat": {
            path: "audio/player/sfx_player_heartbeat.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_item_picked_potion": {
            path: "audio/player/sfx_player_item_picked_potion.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_item_picked_throwable": {
            path: "audio/player/sfx_player_item_picked_throwable.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_item_picked_charm": {
            path: "audio/player/sfx_player_item_picked_charm.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_item_dropped": {
            path: "audio/player/sfx_player_item_dropped.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_item_dropped_legendary": {
            path: "audio/player/sfx_player_item_dropped_legendary.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_weapon_pickup_slashing": {
            path: "audio/player/sfx_player_weapon_pickup_slashing.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_weapon_pickup_magic": {
            path: "audio/player/sfx_player_weapon_pickup_magic.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_weapon_pickup_piercing": {
            path: "audio/player/sfx_player_weapon_pickup_piercing.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_ignited_loop": {
            path: "audio/player/sfx_player_ignited_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_chilled_loop": {
            path: "audio/player/sfx_player_chilled_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_shocked_loop": {
            path: "audio/player/sfx_player_shocked_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_poisoned_loop": {
            path: "audio/player/sfx_player_poisoned_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_blinded_loop": {
            path: "audio/player/sfx_player_blinded_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_player_bleeding_loop": {
            path: "audio/player/sfx_player_bleeding_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_item_gravity_orb_skill": {
            path: "audio/player/sfx_item_gravity_orb_skill.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_item_light_flare_skill": {
            path: "audio/player/sfx_item_light_flare_skill.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_item_frost_core_skill": {
            path: "audio/player/sfx_item_frost_core_skill.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_item_wyvern_heart_skill": {
            path: "audio/player/sfx_item_wyvern_heart_skill.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_item_unstable_electrode_skill": {
            path: "audio/player/sfx_item_unstable_electrode_skill.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        "sfx_item_potion_drink_loop": {
            path: "audio/player/sfx_item_potion_drink_loop.mp3",
            volume: 1.0,
            loadPriority: 2
        },

        //FOOTSTEPS

        "sfx_player_walk_grass_loop": {
            path: "audio/player/footsteps/sfx_player_walk_grass_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_sand_loop": {
            path: "audio/player/footsteps/sfx_player_walk_sand_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_snow_loop": {
            path: "audio/player/footsteps/sfx_player_walk_snow_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_stone_loop": {
            path: "audio/player/footsteps/sfx_player_walk_stone_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_stone_underground_loop": {
            path: "audio/player/footsteps/sfx_player_walk_stone_underground_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_cobblestone_loop": {
            path: "audio/player/footsteps/sfx_player_walk_cobblestone_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_gravel_loop": {
            path: "audio/player/footsteps/sfx_player_walk_gravel_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_dirt_loop": {
            path: "audio/player/footsteps/sfx_player_walk_dirt_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_ice_loop": {
            path: "audio/player/footsteps/sfx_player_walk_ice_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_lava_loop": {
            path: "audio/player/footsteps/sfx_player_walk_lava_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_wood_loop": {
            path: "audio/player/footsteps/sfx_player_walk_wood_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        "sfx_player_walk_water_loop": {
            path: "audio/player/footsteps/sfx_player_walk_water_loop.mp3",
            volume: 0.2,
            loadPriority: 2
        },

        //ESTABA DESDE ANTES

        "blocked_01": {
            path: "audio/weapons/blocked_01.mp3",
            volume: 1.0
        }
    }
};

var Groups = {
    "footstep_arcticTerrain": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_snow_loop"]
    },
    "footstep_arcticBeach": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_snow_loop"]
    },
    "footstep_desertTerrain": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_sand_loop"]
    },
    "footstep_desertBeach": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_sand_loop"]
    },
    "footstep_forestTerrain": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_grass_loop"]
    },
    "footstep_forestRiversides": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_grass_loop"]
    },
    "footstep_forestBeach": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_grass_loop"]
    },
    "footstep_grass": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_grass_loop"]
    },

    "footstep_cobblestone": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_cobblestone_loop"]
    },
    "footstep_shack": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_wood_loop"]
    },

    "footstep_sand": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_sand_loop"]
    },
    "footstep_water": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_water_loop"]
    },
    "footstep_lava": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_lava_loop"]
    },
    "footstep_tile": {
        channel: "activePlayer",
        sounds: ["footstep_tile_01", "footstep_tile_02"]
    },
    "footstep_asphalt": {
        channel: "activePlayer",
        sounds: ["footstep_asphalt_01", "footstep_asphalt_02"]
    },
    "footstep_brick": {
        channel: "activePlayer",
        sounds: ["footstep_brick_01"]
    },
    "footstep_bunker": {
        channel: "activePlayer",
        sounds: ["footstep_metal_04", "footstep_metal_05"]
    },
    "footstep_stone": {
        channel: "activePlayer",
        sounds: ["sfx_player_walk_stone_loop"]
    },
    "footstep_carpet": {
        channel: "activePlayer",
        sounds: ["footstep_carpet_01"]
    },
    "footstep_skitter": {
        channel: "activePlayer",
        sounds: ["footstep_skitter_01"]
    },
    "mothership_shoot": {
        channel: "sfx",
        sounds: ["mothership_shoot_01"]
    },
    "mothership_mov": {
        channel: "sfx",
        sounds: ["mothership_mov_01"]
    },
    "player_bullet_hit": {
        channel: "hits",
        sounds: ["player_bullet_hit_01"]
    },
    "metal_punch": {
        channel: "hits",
        sounds: ["metal_punch_hit_01", "metal_punch_hit_02"]
    },
    "cloth_punch": {
        channel: "hits",
        sounds: ["cloth_hit_01"]
    },
    "cloth_bullet": {
        channel: "hits",
        sounds: ["cloth_hit_02"]
    },
    "organic_hit": {
        channel: "hits",
        sounds: ["organic_hit_01"]
    },
    "pinata_hit": {
        channel: "hits",
        sounds: ["pinata_hit_01"]
    },

    "lasr_hit": {
        channel: "hits",
        sounds: ["lasr_hit_01"]
    },
    "piano_hit": {
        channel: "hits",
        sounds: ["piano_hit_01", "piano_hit_02"]
    },
    "wall_bullet": {
        channel: "hits",
        sounds: ["metal_bullet_hit_01"]
    },
    "wall_wood_bullet": {
        channel: "hits",
        sounds: ["wood_bullet_hit_02"]
    },
    "wall_brick_bullet": {
        channel: "hits",
        sounds: ["brick_bullet_hit_01"]
    },
    "stone_bullet": {
        channel: "hits",
        sounds: ["stone_bullet_hit_01"]
    },
    "barrel_bullet": {
        channel: "hits",
        sounds: ["metal_bullet_hit_03"]
    },
    "pan_bullet": {
        channel: "hits",
        sounds: ["pan_bullet_hit_01"]
    },
    "silo_bullet": {
        channel: "hits",
        sounds: ["metal_bullet_hit_04"]
    },
    "toilet_porc_bullet": {
        channel: "hits",
        sounds: ["toilet_bullet_hit_01"]
    },
    "toilet_metal_bullet": {
        channel: "hits",
        sounds: ["toilet_bullet_hit_02"]
    },
    "skitter_hit": {
        channel: "hits",
        sounds: ["skitter_hit_01"]
    },
    "glass_bullet": {
        channel: "hits",
        sounds: ["glass_bullet_hit_01"]
    },
    "cobalt_bullet": {
        channel: "hits",
        sounds: ["metal_bullet_hit_02"]
    },
    "concrete_hit": {
        channel: "hits",
        sounds: ["concrete_hit_01"]
    },
    "wood_prop_bullet": {
        channel: "hits",
        sounds: ["wood_bullet_hit_03"]
    },
    "wood_crate_bullet": {
        channel: "hits",
        sounds: ["wood_bullet_hit_04"]
    },
    "ammo_crate_bullet": {
        channel: "hits",
        sounds: ["plastic_bullet_hit_01"]
    },
    "bush_bullet": {
        channel: "hits",
        sounds: ["bush_bullet_hit_01"]
    },
    "tree_bullet": {
        channel: "hits",
        sounds: ["wood_bullet_hit_01"]
    },
    "player_bullet_grunt": {
        channel: "hits",
        sounds: ["player_bullet_hit_02"]
    },
    "bullet_whiz": {
        channel: "sfx",
        sounds: ["bullet_whiz_01", "bullet_whiz_02", "bullet_whiz_03"]
    },
    "frag_grass": {
        channel: "hits",
        sounds: ["frag_grass_01"]
    },
    "frag_sand": {
        channel: "hits",
        sounds: ["frag_sand_01"]
    },
    "frag_water": {
        channel: "hits",
        sounds: ["frag_water_01"]
    },
    "static_01": {
        channel: "hits",
        sounds: ["thunder_static_01"]
    },
    "kill_leader_assigned": {
        channel: "ui",
        sounds: ["kill_leader_assigned_01", "kill_leader_assigned_02"]
    },
    "kill_leader_dead": {
        channel: "ui",
        sounds: ["kill_leader_dead_01", "kill_leader_dead_02"]
    },
    "cluck": {
        channel: "sfx",
        sounds: ["cluck_01", "cluck_02"]
    }
};

var Channels = {
    "activePlayer": {
        volume: 1,
        maxRange: 48.0,
        list: "players",
        type: "sound"
    },
    "otherPlayers": {
        volume: 0.5,
        maxRange: 48.0,
        list: "players",
        type: "sound"
    },
    "hits": {
        volume: 0.4,
        maxRange: 48.0,
        list: "hits",
        type: "sound"
    },
    "sfx": {
        volume: 1.0,
        maxRange: 48.0,
        list: "sfx",
        type: "sound"
    },
    "monsters": {
        volume: 1.0,
        maxRange: 48.0,
        list: "monsters",
        type: "sound"
    },
    "weapons": {
        volume: 1.0,
        maxRange: 48.0,
        list: "weapons",
        type: "sound"
    },
    "ambient": {
        volume: 1.0,
        maxRange: 1.0,
        list: "ambient",
        type: "sound"
    },
    "ui": {
        volume: 0.75,
        maxRange: 48.0,
        list: "ui",
        type: "sound"
    },
    "music": {
        volume: 1.0,
        maxRange: 1.0,
        list: "music",
        type: "music"
    }
};

var Reverbs = {
    "cathedral": {
        path: "audio/reverb/cathedral_01.mp3",
        volume: 0.7,
        stereoSpread: 0.004
    },
    "cave": {
        path: "audio/reverb/cave_mono_01.mp3",
        volume: 0.7,
        echoVolume: 0.5,
        echoDelay: 0.25,
        echoLowPass: 800,
        stereoSpread: 0.004
    }
};

module.exports = {
    Sounds: Sounds,
    Groups: Groups,
    Channels: Channels,
    Reverbs: Reverbs
};
