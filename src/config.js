"use strict";
/* config.js - global tuning constants.
 * docs/game.md lists gravity 1200 / jump -650. Those literals give a ~176px
 * (2.75 tile) jump apex that cannot reach classic 4-tile-high block rows,
 * so gravity/jump were retuned for a ~4.7-tile playable arc. Every gameplay
 * number lives here. */

const GAME_W = 1920;
const GAME_H = 1080;
const TILE = 64;
const PHYS = {
  gravity: 1400,
  move: 300,
  dash: 500,
  jump: -920,
  bounce: -520,
  maxFall: 1000,
  accelGround: 2400,
  accelAir: 1500,
  dragGround: 2600,
  dragAir: 120,
  coyoteMs: 100,
  jumpBufferMs: 130
};
const GOOMBA_SPEED = 80;
const MUSHROOM_SPEED = 110;
const LEVEL_TIME = 400;
const TIME_TICK_MS = 400;
const PARALLAX = { clouds: 0.1, hills: 0.3, cloudY: 24, hillY: 556 };
const STOMP_SCORE = 100;
const COIN_SCORE = 200;
const POWERUP_SCORE = 1000;

const SKY_BIRDS = { flocks: 6, min: 3, max: 5, factor: 0.3, speedMin: 16, speedMax: 30, yMin: 120, yMax: 380 };
const BONUS_RETURN_X_COL = 72;
const DEPTH = { sky: 0, farClouds: 3, mountains: 4, clouds: 5, birds: 7, hills: 10, pines: 12, decor: 15, tiles: 20, coins: 25, powerups: 30, enemies: 35, player: 40, shadow: 22, fx: 60, hud: 100 };
const COLORS = { hudFont: "Arial Black, Arial, sans-serif", hudColor: "#ffffff", hudStroke: "#1a2233" };
