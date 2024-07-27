"use strict";


var PingDefs = {
    'ping_danger': {
        type: 'ping',
        texture: '../img/gui/ping-team-danger.png',
        mapTexture: '../img/gui/ping-team-map-danger.png',
        sound: 'ping_danger_01',
        soundLeader: 'ping_leader_01',
        pingMap: true,
        pingLife: 4.0,
        mapLife: 4.0,
        mapEvent: false,
        worldDisplay: true
    },
    'ping_coming': {
        type: 'ping',
        texture: '../img/gui/ping-team-re-group.png',
        mapTexture: '../img/gui/ping-team-map-gather.png',
        sound: 'ping_coming_01',
        soundLeader: 'ping_leader_01',
        pingMap: true,
        pingLife: 4.0,
        mapLife: 300.0,
        mapEvent: false,
        worldDisplay: true
    },
    'ping_loot': {
        type: 'ping',
        texture: '../img/gui/ping-team-loot.png',
        mapTexture: '../img/gui/ping-team-map-loot.png',
        sound: 'ping_loot_01',
        soundLeader: 'ping_leader_01',
        pingMap: true,
        pingLife: 4.0,
        mapLife: 4.0,
        mapEvent: false,
        worldDisplay: true
    },
    'ping_airdrop': {
        type: 'ping',
        texture: 'ping-team-airdrop.img',
        mapTexture: 'ping-map-airdrop.img',
        sound: 'ping_airdrop_01',
        pingMap: true,
        pingLife: 4.0,
        mapLife: 10.0,
        mapEvent: true,
        worldDisplay: false,
        tint: 0xff6600
    },
    'ping_airstrike': {
        type: 'ping',
        texture: 'ping-team-airstrike.img',
        mapTexture: 'ping-map-airstrike.img',
        sound: 'ping_airstrike_01',
        pingMap: true,
        pingLife: 2.0,
        mapLife: 2.0,
        mapEvent: true,
        worldDisplay: true,
        tint: 0xeaff00
    },
    'ping_woodsking': {
        type: 'ping',
        texture: 'player-king-woods.img',
        mapTexture: 'ping-map-woods-king.img',
        sound: 'helmet03_forest_pickup_01',
        pingMap: true,
        pingLife: 4.0,
        mapLife: 10.0,
        mapEvent: true,
        worldDisplay: false,
        tint: 0x12ff00
    },
    'ping_unlock': {
        type: 'ping',
        texture: 'ping-team-unlock.img',
        mapTexture: 'ping-map-unlock.img',
        sound: 'ping_unlock_01',
        pingMap: true,
        pingLife: 4.0,
        mapLife: 10.0,
        mapEvent: true,
        worldDisplay: false,
        tint: 0x00d8ff
    },

    'pinata_01': {
        type: 'ping',
        texture: 'player-king-woods.img',
        mapTexture: 'ping-map-woods-king.img',
        sound: 'helmet03_forest_pickup_01',
        pingMap: true,
        mapIndicator: {
            sprite: 'minimap-pinata.img',
            tint: 0xffffff,
            pulse: true,
            pulseTint: 0x00ff00
        }
    },

    'motherShip': {
        type: 'ping',
        texture: 'player-king-woods.img',
        mapTexture: 'ping-map-woods-king.img',
        sound: 'helmet03_forest_pickup_01',
        pingMap: true,
        mapIndicator: {
            sprite: 'ping-map-motherShip.img',
            tint: 0xffffff,
            pulse: true,
            pulseTint: 0x00ff00
        }
    },

    'skitter': {
        type: 'ping',
        texture: 'player-king-woods.img',
        mapTexture: 'ping-map-woods-king.img',
        sound: 'helmet03_forest_pickup_01',
        pingMap: true,
        mapIndicator: {
            sprite: 'minimap-pinata.img',
            tint: 0xffffff,
            pulse: true,
            pulseTint: 0x00ff00
        }
    }
};

module.exports = PingDefs;
