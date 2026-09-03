"use strict";
/* BonusScene.js - underground lava vault reached by pressing DOWN on pipe #2.
 * Coin-rich room over deadly lava pools; exit pipe warps back to World 1-1. */

/* global lava painter lives here so TEX.genAll can register lava-tile */
function drawLava(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#ff8c1a"); g.addColorStop(1, "#c22d05");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.beginPath(); ctx.moveTo(0, h);
  for (let x = 0; x <= w; x += 16) { ctx.lineTo(x, 9 + Math.sin((x / 64) * Math.PI * 2) * 4); }
  ctx.lineTo(w, 0); ctx.lineTo(0, 0); ctx.closePath();
  ctx.fillStyle = "#ffd23e"; ctx.fill();
  ctx.strokeStyle = "#8a1e03"; ctx.lineWidth = 2;
  [[30, 34], [110, 46], [190, 30], [70, 52]].forEach((p) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + 14, p[1] - 3); ctx.stroke(); });
  [[40, 28], [120, 42], [200, 24], [90, 50]].forEach((p) => fillEll(ctx, "#ffe066", p[0], p[1], 2, 2));
}

class BonusScene extends Phaser.Scene {
  constructor() { super("BonusScene"); }

  create() {
    const reg = this.registry;
    const COLS = 32, GROUND_ROW = 14;
    const groundTop = GROUND_ROW * TILE;
    this.leaving = false;
    this.worldWidth = COLS * TILE;

    const stored = reg.get("timeLeft");
    this.timeLeft = typeof stored === "number" ? stored : 300;

    this.physics.world.setBounds(0, 0, this.worldWidth, GAME_H + 240);

    const sky = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.sky);
    sky.fillGradientStyle(THEMES.underground.sky[0], THEMES.underground.sky[0], THEMES.underground.sky[1], THEMES.underground.sky[1]);
    sky.fillRect(0, 0, GAME_W, GAME_H);
    this.bgDefs = THEMES.underground.layers;
    this.bgLayers = this.bgDefs.map((def) => {
      const th = this.textures.get(def.key).getSourceImage().height;
      const ts = this.add.tileSprite(0, def.y, GAME_W, th, def.key).setOrigin(0, 0).setScrollFactor(0).setDepth(def.depth);
      if (def.tint) ts.setTint(def.tint);
      return ts;
    });

    this.solids = this.physics.add.staticGroup();
    this.coinsG = this.physics.add.staticGroup();
    this.powerups = this.add.group();
    this.fragments = this.physics.add.group();
    const ground = (c, r) => this.solids.create(c * TILE + 32, r * TILE + 32, "tile-ground").setDepth(DEPTH.tiles);
    const brick = (c, r, content) => { const b = content ? new QuestionBlock(this, c * TILE + 32, r * TILE + 32, content) : new BrickBlock(this, c * TILE + 32, r * TILE + 32); b.setDepth(DEPTH.tiles); this.solids.add(b); };
    const coin = (c, r) => this.coinsG.add(new Coin(this, c * TILE + 32, r * TILE + 32));

    for (let r = 0; r < 16; r++) { ground(0, r); ground(COLS - 1, r); }
    const gaps = [[8, 11], [19, 21]];
    for (let c = 1; c < COLS - 1; c++) {
      if (!gaps.some((g) => c >= g[0] && c <= g[1])) { ground(c, GROUND_ROW); ground(c, GROUND_ROW + 1); }
    }

    this.lava = [];
    this.lavaZones = [];
    gaps.forEach((g) => {
      const w = (g[1] - g[0] + 1) * TILE;
      const x = g[0] * TILE;
      this.lava.push(this.add.tileSprite(x, groundTop + 10, w, 54, "lava-tile").setOrigin(0, 0).setDepth(DEPTH.tiles - 1));
      const z = this.add.zone(x + w / 2, groundTop + 34, w - 24, 44);
      this.physics.add.existing(z, true);
      this.lavaZones.push(z);
    });

    [[4, 10], [5, 10], [7, 10], [8, 10]].forEach((p) => brick(p[0], p[1]));
    brick(6, 10, "mushroom");
    for (let c = 12; c <= 16; c++) brick(c, 7);
    [[17, 10], [19, 10], [20, 10], [21, 10]].forEach((p) => brick(p[0], p[1]));
    brick(18, 10, "coin");
    brick(25, 8);
    [[13, 6], [14, 6], [15, 6], [4, 9], [5, 9], [7, 9], [8, 9], [17, 9], [18, 9], [19, 9], [20, 9], [21, 9], [2, 12], [3, 12], [9, 9], [10, 9], [26, 12], [27, 12], [9, 13], [10, 13], [19, 13], [20, 13], [21, 13]].forEach((p) => coin(p[0], p[1]));

    this.exitCap = { x: 28 * TILE + 64, y: 12 * TILE };
    this.solids.create(this.exitCap.x, 12 * TILE + 32, "pipe-top").setDepth(DEPTH.tiles);
    this.solids.create(this.exitCap.x, 13 * TILE + 32, "pipe-body").setDepth(DEPTH.tiles);

    this.player = new Player(this, 2 * TILE + 16, -60);
    this.player.invulnUntil = this.time.now + 900;

    this.physics.add.collider(this.player, this.solids, (pl, blk) => {
      if (blk.isBlock && !pl.dead && pl.body.blocked.up) {
        const now = this.time.now;
        if (now - (blk._lastBump || 0) >= 220) { blk._lastBump = now; blk.bump(pl); }
      }
    });
    this.physics.add.collider(this.powerups, this.solids);
    this.physics.add.overlap(this.player, this.coinsG, (pl, cn) => {
      if (!cn.active) return;
      cn.destroy();
      SFX.play("coin");
      reg.set("coins", reg.get("coins") + 1);
      reg.set("score", reg.get("score") + COIN_SCORE);
      this.hudCoins.setText("x" + pad(reg.get("coins"), 2));
      this.hudScore.setText(pad(reg.get("score"), 6));
    });
    this.physics.add.overlap(this.player, this.powerups, (pl, pu) => {
      if (!pu.active || pu.emerging) return;
      pu.destroy();
      reg.set("score", reg.get("score") + POWERUP_SCORE);
      if (this.player.small) this.player.powerUp(this.time.now);
      SFX.play("power");
    });
    this.lavaZones.forEach((z) => this.physics.add.overlap(this.player, z, () => this.killPlayer()));

    const label = (x, str) => this.add.text(x, 26, str, { fontFamily: COLORS.hudFont, fontSize: "30px", color: COLORS.hudColor, stroke: COLORS.hudStroke, strokeThickness: 8 }).setScrollFactor(0).setDepth(DEPTH.hud);
    const value = (x, str) => this.add.text(x, 68, str, { fontFamily: COLORS.hudFont, fontSize: "34px", color: COLORS.hudColor, stroke: COLORS.hudStroke, strokeThickness: 8 }).setScrollFactor(0).setDepth(DEPTH.hud);
    label(48, "MARIO");
    this.hudScore = value(48, pad(reg.get("score"), 6));
    this.add.image(545, 86, "coin-0").setScale(0.8).setScrollFactor(0).setDepth(DEPTH.hud);
    this.hudCoins = value(572, "x" + pad(reg.get("coins"), 2));
    label(880, "UNDERGROUND");
    label(1330, "TIME");
    this.hudTime = value(1330, pad(this.timeLeft, 3));
    label(1560, "LIVES");
    this.hudLives = value(1560, "x" + pad(reg.get("lives"), 2));

    this.time.addEvent({ delay: TIME_TICK_MS, loop: true, callback: () => {
      if (this.leaving || this.player.dead) return;
      this.timeLeft--;
      this.hudTime.setText(pad(Math.max(0, this.timeLeft), 3));
      if (this.timeLeft <= 0) { reg.set("timeLeft", null); this.killPlayer(); }
    } });

    this.input.keyboard.addCapture("SPACE,UP,DOWN,LEFT,RIGHT,SHIFT,R,M,W,A,D,Z,X");
    this.downKey = this.input.keyboard.addKey("DOWN");
    this.input.keyboard.on("keydown-R", () => { if (!this.leaving) this.scene.restart(); });
    this.input.keyboard.on("keydown-M", () => { SFX.muted = !SFX.muted; });

    this.cameras.main.setBounds(0, 0, this.worldWidth, GAME_H);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(240, 300);
    this.cameras.main.fadeIn(280, 0, 0, 0);
  }

  spawnBlockContent(block) {
    if (block.content === "mushroom") {
      const m = new Mushroom(this, block.x, block.y + 16);
      this.powerups.add(m);
      m.emerge();
    } else {
      new CoinPopup(this, block.x, block.y - 24);
      SFX.play("coin");
      const reg = this.registry;
      reg.set("coins", reg.get("coins") + 1);
      reg.set("score", reg.get("score") + COIN_SCORE);
      this.hudCoins.setText("x" + pad(reg.get("coins"), 2));
      this.hudScore.setText(pad(reg.get("score"), 6));
    }
  }

  shatterBrick(brick) {
    SFX.play("break");
    const bx = brick.x, by = brick.y;
    this.solids.remove(brick);
    brick.destroy();
    [[-150, -430], [150, -430], [-95, -270], [95, -270]].forEach((v) => {
      const f = this.fragments.create(bx, by, "fragment");
      f.setVelocity(v[0], v[1]);
      f.setAngularVelocity((Math.random() < 0.5 ? -1 : 1) * 380);
      f.setDepth(DEPTH.fx);
      this.time.delayedCall(1500, () => f.destroy());
    });
  }

  update(time, delta) {
    const cam = this.cameras.main;
    const p = this.player;
    p.update(delta);
    this.bgLayers.forEach((ts, i) => { ts.tilePositionX = cam.scrollX * this.bgDefs[i].factor; });
    this.lava.forEach((t) => { t.tilePositionX -= delta * 0.02; });
    this.powerups.getChildren().forEach((u) => u.update(delta));
    if (!p.dead && p.y > GAME_H + 130) this.killPlayer();
    if (!this.leaving && !p.dead && p.body.blocked.down &&
        Phaser.Input.Keyboard.JustDown(this.downKey) &&
        Math.abs(p.x - this.exitCap.x) < 44 && Math.abs(p.body.bottom - this.exitCap.y) < 8) {
      this.leaving = true;
      SFX.play("pause");
      cam.fadeOut(280, 0, 0, 0);
      this.time.delayedCall(300, () => this.scene.start("GameScene", { fromBonus: true }));
    }
  }

  killPlayer() {
    const p = this.player;
    if (p.dead || this.leaving) return;
    p.die(false);
    this.cameras.main.flash(200, 255, 80, 40);
  }

  handlePlayerDeath() {
    const lives = this.registry.get("lives") - 1;
    this.registry.set("lives", Math.max(0, lives));
    if (lives > 0) this.scene.restart();
    else { this.registry.set("gameOver", true); this.scene.start("BootScene"); }
  }
}
