"use strict";


var PIXI = require("./pixi.js");
var GameConfig = require("./gameConfig.js");
var GameObject = require("./gameObject.js");
var coldet = require("./coldet.js");
var collider = require("./collider.js");
var math = require("./math.js");
var util = require("./util.js");
var v2 = require("./v2.js");
var device = require("./device.js");
var DebugLines = require("./debugLines.js");

var BulletDefs = require("./bulletDefs.js");

//
// FlareBarn
//
function m_FlareBarn() {
    this.bullets = [];
}

m_FlareBarn.prototype = {
    addFlare: function addFlare(bullet, playerBarn, renderer) {
        var b = null;
        for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].alive && !this.bullets[i].collided) {
                b = this.bullets[i];
                break;
            }
        }
        if (!b) {
            b = {};
            b.alive = false;

            b.flareContainer = new PIXI.Container();
            b.flareContainer.visible = false;
            b.flare = PIXI.Sprite.fromImage('part-flare-01.img');
            b.flare.anchor.set(0.5, 0.5);
            b.flareContainer.addChild(b.flare);

            b.trailContainer = new PIXI.Container();
            b.trailContainer.visible = false;
            b.trailContainer.pivot.set(14.5, 0.0);
            b.bulletTrail = PIXI.Sprite.fromImage('player-bullet-trail-02.img');
            b.bulletTrail.anchor.set(0.5, 0.5);
            b.trailContainer.addChild(b.bulletTrail);

            this.bullets.push(b);
        }

        var bulletDef = BulletDefs[bullet.bulletType];
        var variance = 1.0 + bullet.varianceT * bulletDef.variance;
        var distAdj = math.remap(bullet.distAdjIdx, 0, 32, -1.0, 1.0);
        var distance = bulletDef.distance / Math.pow(GameConfig.bullet.reflectDistDecay, bullet.reflectCount);

        b.alive = true;
        b.isNew = true;
        b.collided = false;
        b.flareScale = 0.01;
        b.trailScale = 1.0;
        b.timeAlive = 0.0;
        b.maxTimeAlive = 2.5;
        b.startPos = v2.copy(bullet.pos);
        b.pos = v2.copy(bullet.pos);
        b.dir = v2.copy(bullet.dir);
        b.layer = bullet.layer;
        b.speed = bulletDef.speed * variance;
        b.distance = distance * variance + distAdj;

        var angleRadians = Math.atan2(b.dir.x, b.dir.y);
        b.flareContainer.rotation = angleRadians - Math.PI / 2.0;
        b.trailContainer.rotation = angleRadians - Math.PI / 2.0;

        b.layer = bullet.layer;
        var player = playerBarn.m_getPlayerById(b.playerId);
        if (player && player.layer & 0x2) {
            b.layer |= 0x2;
        }

        var tracerColorDefs = GameConfig.tracerColors[bulletDef.tracerColor];
        var tracerColor = tracerColorDefs.regular;
        if (player && player.isOnBrightSurface) {
            tracerColor = tracerColorDefs.saturated;
        }
        // Trail styling
        b.bulletTrail.scale.set(0.8, bulletDef.tracerWidth);
        b.tracerLength = bulletDef.tracerLength;
        b.bulletTrail.tint = tracerColor;
        b.tracerAlphaRate = tracerColorDefs.alphaRate;
        b.tracerAlphaMin = tracerColorDefs.alphaMin;
        b.bulletTrail.alpha = 1.0;
        // Flare styling
        b.flare.scale.set(1.0, 1.0);
        b.flare.tint = bulletDef.flareColor;
        b.flare.alpha = 0.8;
        b.maxFlareScale = bulletDef.maxFlareScale;

        b.smokeThrottle = 0.0;

        b.flareContainer.visible = true;
        b.trailContainer.visible = true;
    },

    m_update: function m_update(dt, playerBarn, map, camera, activePlayer, renderer, particleBarn, audioManager) {
        var players = playerBarn.m_playerPool.m_getPool();

        for (var i = 0; i < this.bullets.length; i++) {
            var b = this.bullets[i];

            if (b.collided) {
                b.flareScale = math.max(b.flareScale - 0.5 * dt, 0.0);
                b.flare.alpha = math.max(b.flare.alpha - dt, 0.0);

                b.trailScale = math.max(b.trailScale - 6.0 * dt, 0.0);
                b.bulletTrail.alpha = math.max(b.bulletTrail.alpha - dt, 0.0);

                b.pos = v2.add(b.pos, v2.mul(b.dir, dt * b.speed));

                if (b.flare.alpha <= 0.0) {
                    b.collided = false;
                    b.flareContainer.visible = false;
                    b.trailContainer.visible = false;
                }
            }

            if (!b.alive) {
                continue;
            }

            // Trail alpha
            if (b.tracerAlphaRate) {
                var selfBullet = activePlayer.__id == b.playerId;
                var rate = activePlayer.__id == b.playerId ? b.tracerAlphaRate : b.tracerAlphaRate * 0.9;
                b.bulletTrail.alpha = math.max(b.tracerAlphaMin, b.bulletTrail.alpha * rate);
            }

            // Grow the flare size over time
            b.timeAlive += dt;
            b.flareScale = math.easeOutExpo(b.timeAlive / b.maxTimeAlive) * b.maxFlareScale;

            // Make a smoke trail
            if (b.smokeThrottle <= 0.0) {
                // particleBarn.addParticle(
                //     'flareSmoke',
                //     b.layer,
                //     b.pos,
                //     b.dir,
                //     1.0,
                //     Math.atan2(-b.dir.y, b.dir.x)
                // );
                b.smokeThrottle = 0.05;
            } else {
                b.smokeThrottle -= dt;
            }

            var distLeft = b.distance - v2.length(v2.sub(b.startPos, b.pos));
            var distTravel = math.min(distLeft, dt * b.speed);
            var posOld = v2.copy(b.pos);
            b.pos = v2.add(b.pos, v2.mul(b.dir, distTravel));

            if (math.eqAbs(distLeft, distTravel)) {
                b.collided = true;
                b.alive = false;
            }

            var layer = 0;
            if ((util.sameLayer(layer, activePlayer.layer) || activePlayer.layer & 0x2) && (!(activePlayer.layer & 0x2) || !map.insideStructureMask(collider.createCircle(b.pos, 1.0)))) {
                layer |= 0x2;
            }
            renderer.addPIXIObj(b.trailContainer, layer, 1000, 0);
            renderer.addPIXIObj(b.flareContainer, layer, 1000, 1);

            b.isNew = false;
        }
    },

    render: function render(camera) {
        var maxTrailLength = 15.0;
        var radius = camera.pixels(1.0);

        for (var i = 0; i < this.bullets.length; i++) {
            var b = this.bullets[i];
            if (!b.alive && !b.collided) {
                continue;
            }

            var screenPos = camera.pointToScreen(b.pos);

            b.flareContainer.position.set(screenPos.x, screenPos.y);

            var screenScale = camera.pixels(1);
            b.flareContainer.scale.set(screenScale * b.flareScale, screenScale * b.flareScale);

            var dist = v2.length(v2.sub(b.pos, b.startPos));

            b.trailContainer.position.set(screenPos.x, screenPos.y);

            var trailLength = math.min(maxTrailLength * b.tracerLength, dist / 2.0);
            b.trailContainer.scale.set(screenScale * trailLength * b.trailScale, screenScale);
        }
    }
};

module.exports = {
    m_FlareBarn: m_FlareBarn
};
