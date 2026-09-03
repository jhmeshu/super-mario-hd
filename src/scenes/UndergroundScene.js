"use strict";
/* UndergroundScene.js - enclosed, brick-heavy underground stage.
 * Mirrors BonusScene shape (lava kill, exit pipe → surface) but driven
 * by a parameterized layout descriptor so we can ship multiple
 * underground levels without duplicating scene code. */

class UndergroundScene extends Phaser.Scene {
  constructor() { super("UndergroundScene"); }

  init(data) {
    this._levelId = (data && data.levelId) || "1-1U";
    this._returnLevel = (data && data.returnLevel) || "1-1";
    this._returnXCol = (data && data.returnXCol) || 50;
  }

  create() {
    const L = levelById(this._levelId);
    const reg = this.registry;
    this.worldWidth = L.cols * TILE;
    this.leaving = false;

    const stored = reg.get("timeLeft");
    this.timeLeft = typeof stored === "number" ? stored : (L.time || LEVEL_TIME);

    this.physics.world.setBounds(0, 0, this.worldWidth, GAME_H + 240);

    const themeKey = L.theme || "underground";
    const theme = THEMES[themeKey] || THEMES.underground;
    const sky = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.sky);
    sky.fillGradientStyle(theme.sky[0], theme.sky[0], theme.sky[1], theme.sky[1]);
    sky.fillRect(0, 0, GAME_W, GAME_H);

    this.bgDefs = theme.layers || [];
    this.bgLayers = this.bgDefs.map((def) => {
      const th = this.textures.get(def.key).getSourceImage().height;
      const ts = this.add.tileSprite(0, def.y, GAME_W, th, def.key).setOrigin(0, 0).setScrollFactor(0).setDepth(def.depth);
      if (def.tint) ts.setTint(def.tint);
      return ts;
    });

    /* vignette overlay (additive radial breathing) */
    this.vignette = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.fx - 10).setBlendMode(Phaser.BlendModes.ADD);
    this._vT = 0;

    this.solids = this.physics.add.staticGroup();
    this.coinsG = this.physics.add.staticGroup();
    this.powerups = this.add.group();
    this.fragments = this.physics.add.group();
    this.lavaZones = [];
    this.lavaSprites = [];
    this.torches = [];
    this.coinPiles = [];

    const groundTop = L.groundRow * TILE;
    const cols = L.cols, rows = L.rows.length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = L.rows[r][c];
        const cx = c * TILE + 32, cy = r * TILE + 32;
        if (ch === "X") this.solids.create(cx, cy, "brick-underground");
        else if (ch === "?") { const b = new QuestionBlock(this, cx, cy, "coin"); this.solids.add(b); }
        else if (ch === "m") { const b = new QuestionBlock(this, cx, cy, "mushroom"); this.solids.add(b); }
        else if (ch === "o") this.coinsG.add(new Coin(this, cx, cy));
        else if (ch === "G") { this.enemiesGoomba = this.enemiesGoomba || this.add.group(); this.enemiesGoomba.add(new Goomba(this, cx, groundTop)); }
        else if (ch === "P") this.solids.create(cx, cy, "pipe-underground");
        else if (ch === "T") { this.solids.create(cx, cy, "brick-underground"); this.torches.push({ x: cx, y: cy }); }
        else if (ch === "p") this.coinPiles.push({ x: cx, y: cy });
      }
    }
    this.solids.getChildren().forEach((s) => s.setDepth && s.setDepth(DEPTH.tiles));

    /* exit pipe positioned at L.exitCol */
    if (L.exitCol !== undefined) {
      this.exitCap = { x: L.exitCol * TILE + 64, y: (L.groundRow - 2) * TILE };
      this.solids.create(this.exitCap.x, (L.groundRow - 2) * TILE + 32, "pipe-underground").setDepth(DEPTH.tiles);
      this.solids.create(this.exitCap.x, (L.groundRow - 1) * TILE + 32, "pipe-underground").setDepth(DEPTH.tiles);
    }

    this.enemies = this.enemiesGoomba || this.add.group();

    /* torches: draw flame sprites above their block */
    this.torches.forEach((t) => {
      const flame = this.add.image(t.x, t.y - 12, "torch-flame").setOrigin(0.5, 1).setDepth(DEPTH.decor);
      this.tweens.add({ targets: flame, alpha: 0.55, duration: 600, yoyo: true, repeat: -1 });
    });
    this.coinPiles.forEach((p) => {
      this.add.image(p.x, p.y, "coin-pile").setOrigin(0.5, 0.5).setDepth(DEPTH.coins);
    });

    /* player + camera follow */
    this.player = new Player(this, L.spawnCol * TILE + 16, -60);
    this._player = this.player;
    this.player.invulnUntil = this.time.now + 900;

    /* collision hooks */
    this.physics.add.collider(this.player, this.solids, (pl, blk) => {
      if (blk.isBlock && !pl.dead && pl.body.blocked.up) {
        const now = this.time.now;
        if (now - (blk._lastBump || 0) >= 220) { blk._lastBump = now; blk.bump(pl); }
      }
    });
    this.physics.add.collider(this.enemies, this.solids);
    if (this.enemiesGoomba) {
      this.physics.add.collider(this.enemiesGoomba, this.enemiesGoomba, (a, b) => {
        if (a.state2 !== "walk" || b.state2 !== "walk") return;
        if (a.x < b.x) { a.setDir(-1); b.setDir(1); } else { a.setDir(1); b.setDir(-1); }
      });
      this.physics.add.collider(this.player, this.enemiesGoomba, (pl, en) => this._hitEnemy(pl, en));
    }
    this.physics.add.collider(this.powerups, this.solids);
    this.physics.add.overlap(this.player, this.coinsG, (pl, cn) => {
      if (!cn.active) return;
      const cx = cn.x, cy = cn.y;
      cn.destroy();
      SFX.play("coin");
      reg.set("coins", reg.get("coins") + 1);
      reg.set("score", reg.get("score") + COIN_SCORE);
      this.hudCoins.setText("x" + pad(reg.get("coins"), 2));
      this.hudScore.setText(pad(reg.get("score"), 6));
    });
    this.physics.add.overlap(this.player, this.powerups, (pl, pu) => {
      if (!pu.active || pu.emerging) return;
      const px = pu.x, py = pu.y;
      pu.destroy();
      reg.set("score", reg.get("score") + POWERUP_SCORE);
      if (this.player.small) this.player.powerUp(this.time.now);
      SFX.play("power");
    });
    this.lavaZones.forEach((z) => this.physics.add.overlap(this.player, z, () => this._killPlayer()));

    this._buildHUD();
    this.time.addEvent({ delay: TIME_TICK_MS, loop: true, callback: () => {
      if (this.leaving || this.player.dead) return;
      this.timeLeft--;
      this.hudTime.setText(pad(Math.max(0, this.timeLeft), 3));
      if (this.timeLeft <= 0) { reg.set("timeLeft", null); this._killPlayer(); }
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

  _buildHUD() {
    const reg = this.registry;
    const label = (x, str) => this.add.text(x, 26, str, { fontFamily: COLORS.hudFont, fontSize: "30px", color: COLORS.hudColor, stroke: COLORS.hudStroke, strokeThickness: 8 }).setScrollFactor(0).setDepth(DEPTH.hud);
    const value = (x, str) => this.add.text(x, 68, str, { fontFamily: COLORS.hudFont, fontSize: "34px", color: COLORS.hudColor, stroke: COLORS.hudStroke, strokeThickness: 8 }).setScrollFactor(0).setDepth(DEPTH.hud);
    label(48, "MARIO");
    this.hudScore = value(48, pad(reg.get("score"), 6));
    this.add.image(545, 86, "coin-0").setScale(0.8).setScrollFactor(0).setDepth(DEPTH.hud);
    this.hudCoins = value(572, "x" + pad(reg.get("coins"), 2));
    label(880, "WORLD");
    value(880, (this.scene.settings.data && this.scene.settings.data.worldLabel) || "1-1");
    label(1330, "TIME");
    this.hudTime = value(1330, pad(this.timeLeft, 3));
    label(1560, "LIVES");
    this.hudLives = value(1560, "x" + pad(reg.get("lives"), 2));
  }

  _hitEnemy(pl, en) {
    if (en.state2 !== "walk" || pl.dead || this.leaving) return;
    if (pl.body.touching.down && en.body.touching.up && pl.body.velocity.y >= -20) {
      en.stomp();
      SFX.play("stomp");
      pl.stompBounce();
      const reg = this.registry;
      reg.set("score", reg.get("score") + STOMP_SCORE);
      this.hudScore.setText(pad(reg.get("score"), 6));
    } else {
      pl.damage(this.time.now);
    }
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
    this.lavaSprites.forEach((t) => { t.tilePositionX -= delta * 0.02; });
    if (this.enemiesGoomba) this.enemiesGoomba.getChildren().forEach((e) => e.update(delta));
    this.powerups.getChildren().forEach((u) => u.update(delta));
    if (!p.dead && p.y > GAME_H + 130) this._killPlayer();

    /* breathing vignette */
    this._vT += delta;
    this.vignette.clear();
    const k = 0.10 * Math.sin(this._vT / 700) + 0.18;
    this.vignette.fillStyle(0x222233, k);
    this.vignette.fillRect(0, 0, GAME_W, GAME_H);

    if (!this.leaving && !p.dead && this.exitCap && p.body.blocked.down &&
        Phaser.Input.Keyboard.JustDown(this.downKey) &&
        Math.abs(p.x - this.exitCap.x) < 44 && Math.abs(p.body.bottom - this.exitCap.y) < 8) {
      this._returnToSurface();
    }
  }

  _returnToSurface() {
    if (this.leaving || this.player.dead) return;
    this.leaving = true;
    SFX.play("pause");
    const reg = this.registry;
    reg.set("score", reg.get("score") + 200);
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.time.delayedCall(300, () => this.scene.start("GameScene", {
      levelId: this._returnLevel,
      fromUnderground: true,
      returnXCol: this._returnXCol,
      timeBonus: 200
    }));
  }

  _killPlayer() {
    const p = this.player;
    if (p.dead || this.leaving) return;
    p.die(true);
    this.cameras.main.flash(200, 255, 80, 40);
  }

  handlePlayerDeath() {
    const reg = this.registry;
    const lives = reg.get("lives") - 1;
    reg.set("lives", Math.max(0, lives));
    if (lives > 0) this.scene.restart();
    else { reg.set("gameOver", true); this.scene.start("BootScene"); }
  }
}