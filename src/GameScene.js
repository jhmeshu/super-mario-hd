"use strict";
/* GameScene.js - builds World 1-1 from the programmatic tilemap and runs
 * all physics interactions, HUD, countdown timer, dead-zone camera with
 * no-backscroll clamp, parallax layers, and the course-clear sequence. */

class GameScene extends Phaser.Scene {
  constructor() { super("GameScene"); }
  init(data) {
    if (!(data && data.fromBonus)) this.registry.set("timeLeft", null);
  }

  create() {
    const L = LEVEL1_1;
    const reg = this.registry;
    const groundTop = L.groundRow * TILE;
    this.levelDone = false;
    this.worldWidth = L.cols * TILE;
    this.camMax = 0;
    this.castleDoorX = 0;

    this.physics.world.setBounds(0, 0, this.worldWidth, GAME_H + 240);

    /* sky + parallax layers */
    const sky = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.sky);
    this.theme = THEMES.overworld;
    sky.fillGradientStyle(this.theme.sky[0], this.theme.sky[0], this.theme.sky[1], this.theme.sky[1]);
    sky.fillRect(0, 0, GAME_W, GAME_H);
    this.bgDefs = this.theme.layers;
    this.bgLayers = this.bgDefs.map((def) => {
      const th = this.textures.get(def.key).getSourceImage().height;
      const ts = this.add.tileSprite(0, def.y, GAME_W, th, def.key).setOrigin(0, 0).setScrollFactor(0).setDepth(def.depth);
      if (def.tint) ts.setTint(def.tint);
      return ts;
    });
    L.decor.bushes.forEach((c) => this.add.image(c * TILE + 128, groundTop, "bush").setOrigin(0.5, 1).setDepth(DEPTH.decor));

    /* groups */
    this.solids = this.physics.add.staticGroup();
    this.coinsG = this.physics.add.staticGroup();
    this.enemies = this.add.group();
    this.powerups = this.add.group();
    this.fragments = this.physics.add.group();

    /* player is built before tiles so the flag zone can bind its overlap */
    const fromBonus = this.scene.settings.data && this.scene.settings.data.fromBonus;
    const spawnCol = fromBonus ? BONUS_RETURN_X_COL : 2;
    this.player = new Player(this, spawnCol * TILE + 16, groundTop);
    if (fromBonus) this.player.invulnUntil = this.time.now + 1000;

    /* build every cell of the map */
    for (let r = 0; r < L.rows.length; r++) {
      const row = L.rows[r];
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        const cx = c * TILE + 32, cy = r * TILE + 32;
        if (ch === "X") {
          this.solids.create(cx, cy, "tile-ground");
        } else if (ch === "B") {
          this.solids.add(new BrickBlock(this, cx, cy));
        } else if (ch === "?") {
          this.solids.add(new QuestionBlock(this, cx, cy, "coin"));
        } else if (ch === "m") {
          this.solids.add(new QuestionBlock(this, cx, cy, "mushroom"));
        } else if (ch === "o") {
          this.coinsG.add(new Coin(this, cx, cy));
        } else if (ch === "G") {
          this.enemies.add(new Goomba(this, cx, (r + 1) * TILE));
        } else if (ch === "P") {
          this.buildPipe(c, r, L.warpPipe && L.warpPipe.col === c ? L.warpPipe : null);
        } else if (ch === "F") {
          this.buildFlag(c, r);
        } else if (ch === "C") {
          this.castleDoorX = c * TILE + 224;
          this.add.image(c * TILE, (r + 1) * TILE, "castle").setOrigin(0, 1).setDepth(DEPTH.decor - 1);
        }
      }
    }

    /* solid world geometry draws above every background layer */
    this.solids.getChildren().forEach((s) => s.setDepth(DEPTH.tiles));

    /* physics */
    this.physics.add.collider(this.player, this.solids, (pl, blk) => this.onPlayerSolid(pl, blk));
    this.physics.add.collider(this.enemies, this.solids);
    this.physics.add.collider(this.enemies, this.enemies, (a, b) => {
      if (a.state2 !== "walk" || b.state2 !== "walk") return;
      if (a.x < b.x) { a.setDir(-1); b.setDir(1); } else { a.setDir(1); b.setDir(-1); }
    });
    this.physics.add.collider(this.player, this.enemies, (pl, en) => this.onPlayerEnemy(pl, en));
    this.physics.add.collider(this.powerups, this.solids);
    this.physics.add.overlap(this.player, this.coinsG, (pl, cn) => this.collectCoin(cn));
    this.physics.add.overlap(this.player, this.powerups, (pl, pu) => this.collectPowerup(pu));

    this.buildHUD();

    /* countdown timer */
    this.timeLeft = L.time;
    this.hudTime.setText(pad(this.timeLeft, 3));
    this.time.addEvent({ delay: TIME_TICK_MS, loop: true, callback: () => {
      if (this.levelDone || this.player.dead) return;
      this.timeLeft--;
      this.hudTime.setText(pad(Math.max(0, this.timeLeft), 3));
      if (this.timeLeft <= 0) this.player.die(false);
    } });

    /* global keys */
    this.input.keyboard.addCapture("SPACE,UP,DOWN,LEFT,RIGHT,SHIFT,R,M,W,A,D,Z,X");
    this.downKey = this.input.keyboard.addKey("DOWN");
    this.input.keyboard.on("keydown-R", () => { if (!this.levelDone) this.scene.restart(); });
    this.input.keyboard.on("keydown-M", () => {
      SFX.muted = !SFX.muted;
      this.showToast(SFX.muted ? "MUTED" : "SOUND ON");
    });

    this.cameras.main.setBounds(0, 0, this.worldWidth, GAME_H);
    this.cameras.main.fadeIn(280, 0, 0, 0);
  }

  buildPipe(c, topRow, warp) {
    const px = c * TILE;
    this.solids.create(px + 64, topRow * TILE + 32, "pipe-top");
    if (warp) this.warpCap = { x: px + 64, y: topRow * TILE };
    for (let r = topRow + 1; r < LEVEL1_1.groundRow; r++) {
      this.solids.create(px + 64, r * TILE + 32, "pipe-body");
    }
  }

  buildFlag(c, r) {
    const px = c * TILE + 32;
    const baseY = (r + 1) * TILE;
    this.solids.create(px, r * TILE + 32, "tile-used");
    this.add.image(px, baseY, "pole").setOrigin(0.5, 1).setDepth(DEPTH.decor);
    this.flagTopY = baseY - 640 + 26;
    this.flagBottomY = baseY - 44;
    this.flagImg = this.add.image(px - 4, this.flagTopY, "flag").setOrigin(1, 0.5).setDepth(DEPTH.decor + 1);
    this.flagZone = this.add.zone(px, baseY - 320, 56, 620);
    this.physics.add.existing(this.flagZone, true);
    this.physics.add.overlap(this.player, this.flagZone, () => this.hitFlag());
  }

  hitFlag() {
    if (this.levelDone || this.player.dead) return;
    this.levelDone = true;
    SFX.play("flag");
    this.fireworks = new Fireworks(this, this.castleDoorX, 430);
    this.fireworks.start();
    const p = this.player;
    p.controlsEnabled = false;
    p.forceRight = false;
    p.body.setVelocityX(0);
    p.setX(this.flagZone.x - 36);
    this.tweens.add({ targets: this.flagImg, y: this.flagBottomY, duration: 800, ease: "Sine.easeIn" });
    const gt = LEVEL1_1.groundRow * TILE;
    this.tweens.add({
      targets: p, y: gt, duration: 650, ease: "Sine.easeIn",
      onComplete: () => { p.forceRight = true; p.body.setVelocityX(170); }
    });
    this.addScore(this.timeLeft * 50, this.flagZone.x, this.flagTopY + 40);
    this.time.delayedCall(1400, () => {
      this.add.text(GAME_W / 2, 300, "COURSE CLEAR!", { fontFamily: COLORS.hudFont, fontSize: "96px", color: "#ffffff", stroke: "#16324f", strokeThickness: 14 }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTH.hud);
    });
    this.time.delayedCall(5200, () => {
      this.registry.set("clear", true);
      this.scene.start("BootScene");
    });
  }

  onPlayerSolid(pl, blk) {
    if (!blk.isBlock || this.levelDone || pl.dead) return;
    if (!pl.body.blocked.up) return;
    const now = this.time.now;
    if (now - (blk._lastBump || 0) < 220) return;
    blk._lastBump = now;
    blk.bump(pl);
  }

  onPlayerEnemy(pl, en) {
    if (en.state2 !== "walk" || pl.dead || this.levelDone) return;
    if (pl.body.touching.down && en.body.touching.up && pl.body.velocity.y >= -20) {
      en.stomp();
      SFX.play("stomp");
      pl.stompBounce();
      this.addScore(STOMP_SCORE, en.x, en.y - 50);
    } else {
      pl.damage(this.time.now);
    }
  }

  spawnBlockContent(block) {
    this.bumpEnemiesOn(block);
    if (block.content === "mushroom") {
      const m = new Mushroom(this, block.x, block.y + 16);
      this.powerups.add(m);
      m.emerge();
    } else {
      new CoinPopup(this, block.x, block.y - 24);
      SFX.play("coin");
      this.addCoins(1);
      this.addScore(COIN_SCORE, block.x, block.y - 52);
    }
  }

  bumpEnemiesOn(block) {
    this.enemies.getChildren().forEach((e) => {
      if (e.state2 !== "walk") return;
      if (!e.body.blocked.down) return;
      if (Math.abs(e.x - block.x) < 54 && Math.abs(e.y - (block.y - 32)) < 12) {
        e.flipDie();
        this.addScore(STOMP_SCORE, e.x, e.y - 50);
      }
    });
  }

  shatterBrick(brick) {
    SFX.play("break");
    this.bumpEnemiesOn(brick);
    this.addScore(50, brick.x, brick.y - 44);
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

  collectCoin(cn) {
    if (!cn.active) return;
    const cx = cn.x, cy = cn.y;
    cn.destroy();
    SFX.play("coin");
    this.addCoins(1);
    this.addScore(COIN_SCORE, cx, cy - 30);
  }

  collectPowerup(pu) {
    if (!pu.active || pu.emerging) return;
    const px = pu.x, py = pu.y;
    pu.destroy();
    this.addScore(POWERUP_SCORE, px, py - 60);
    if (this.player.small) this.player.powerUp(this.time.now);
    SFX.play("power");
  }

  addScore(n, x, y) {
    this.registry.set("score", this.registry.get("score") + n);
    this.hudScore.setText(pad(this.registry.get("score"), 6));
    if (x !== undefined) {
      const t = this.add.text(x, y, "+" + n, { fontFamily: COLORS.hudFont, fontSize: "26px", color: "#ffffff", stroke: COLORS.hudStroke, strokeThickness: 6 }).setOrigin(0.5).setDepth(DEPTH.fx);
      this.tweens.add({ targets: t, y: y - 48, alpha: 0, duration: 750, onComplete: () => t.destroy() });
    }
  }

  addCoins(n) {
    let coins = this.registry.get("coins") + n;
    let lives = this.registry.get("lives");
    while (coins >= 100) { coins -= 100; lives++; SFX.play("power"); this.showToast("1 UP!"); }
    this.registry.set("coins", coins);
    this.registry.set("lives", lives);
    this.hudCoins.setText("x" + pad(coins, 2));
    this.hudLives.setText("x" + pad(lives, 2));
  }

  showToast(msg) {
    const t = this.add.text(GAME_W / 2, 180, msg, { fontFamily: COLORS.hudFont, fontSize: "48px", color: "#ffe066", stroke: COLORS.hudStroke, strokeThickness: 10 }).setOrigin(0.5).setScrollFactor(0).setDepth(DEPTH.hud);
    this.tweens.add({ targets: t, alpha: 0, y: 120, delay: 500, duration: 500, onComplete: () => t.destroy() });
  }

  buildHUD() {
    const label = (x, str) => this.add.text(x, 26, str, { fontFamily: COLORS.hudFont, fontSize: "30px", color: COLORS.hudColor, stroke: COLORS.hudStroke, strokeThickness: 8 }).setScrollFactor(0).setDepth(DEPTH.hud);
    const value = (x, str) => this.add.text(x, 68, str, { fontFamily: COLORS.hudFont, fontSize: "34px", color: COLORS.hudColor, stroke: COLORS.hudStroke, strokeThickness: 8 }).setScrollFactor(0).setDepth(DEPTH.hud);
    label(48, "MARIO");
    this.hudScore = value(48, pad(this.registry.get("score"), 6));
    this.add.image(545, 86, "coin-0").setScale(0.8).setScrollFactor(0).setDepth(DEPTH.hud);
    this.hudCoins = value(572, "x" + pad(this.registry.get("coins"), 2));
    label(880, "WORLD");
    value(880, "1-1");
    label(1180, "TIME");
    this.hudTime = value(1180, "348");
    label(1480, "LIVES");
    this.hudLives = value(1480, "x" + pad(this.registry.get("lives"), 2));
  }

  update(time, delta) {
    const cam = this.cameras.main;
    const p = this.player;
    p.update(delta);
    this.enemies.getChildren().forEach((e) => e.update(delta));
    this.powerups.getChildren().forEach((u) => u.update(delta));

    /* camera: dead-zone follow, smoothing, never scrolls backward */
    const dzL = cam.scrollX + GAME_W * 0.42;
    const dzR = cam.scrollX + GAME_W * 0.60;
    let target = cam.scrollX;
    if (p.x < dzL) target = p.x - GAME_W * 0.42;
    else if (p.x > dzR) target = p.x - GAME_W * 0.60;
    target = Phaser.Math.Clamp(target, this.camMax, this.worldWidth - GAME_W);
    if (target > cam.scrollX) {
      const smooth = 1 - Math.pow(0.001, delta / 1000);
      cam.scrollX += (target - cam.scrollX) * smooth;
      if (cam.scrollX > this.camMax) this.camMax = cam.scrollX;
    } else if (target < this.camMax) {
      cam.scrollX = this.camMax;
    }

    /* parallax */
    this.bgLayers.forEach((ts, i) => { ts.tilePositionX = cam.scrollX * this.bgDefs[i].factor; });

    /* keep the player inside the left screen edge */
    const minX = cam.scrollX + 24;
    if (p.x < minX) { p.setX(minX); if (p.body.velocity.x < 0) p.body.setVelocityX(0); }

    /* pit death + cleanup below the world */
    if (!p.dead && p.y > GAME_H + 130) p.die(true);
    this.enemies.getChildren().forEach((e) => { if (e.y > GAME_H + 200) e.destroy(); });
    this.powerups.getChildren().forEach((u) => { if (u.y > GAME_H + 200) u.destroy(); });

    /* warp pipe: stand on pipe #2 cap and press Down */
    if (!this.levelDone && !p.dead && this.warpCap && p.body.blocked.down &&
        Phaser.Input.Keyboard.JustDown(this.downKey) &&
        Math.abs(p.x - this.warpCap.x) < 44 && Math.abs(p.body.bottom - this.warpCap.y) < 6) {
      this.enterBonus();
    }

    /* course clear: stop at the castle door and step inside */
    if (this.levelDone && p.forceRight && this.castleDoorX && p.x >= this.castleDoorX) {
      p.forceRight = false;
      p.body.setVelocityX(0);
      this.tweens.add({ targets: p, alpha: 0, duration: 500 });
    }
  }

  enterBonus() {
    if (this.levelDone || this.player.dead) return;
    SFX.play("pause");
    this.registry.set("timeLeft", this.timeLeft);
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.time.delayedCall(300, () => this.scene.start("BonusScene"));
  }

  handlePlayerDeath() {
    const lives = this.registry.get("lives") - 1;
    this.registry.set("lives", Math.max(0, lives));
    if (lives > 0) {
      this.scene.restart();
    } else {
      this.registry.set("gameOver", true);
      this.scene.start("BootScene");
    }
  }
}
