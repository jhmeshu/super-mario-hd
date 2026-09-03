"use strict";
/* BootScene.js - generates all procedural textures, initializes the shared
 * registry and shows the animated title screen. It doubles as the hub for
 * GAME OVER and COURSE CLEAR states. */

function pad(n, w) { return String(Math.max(0, n)).padStart(w, "0"); }

class BootScene extends Phaser.Scene {
  constructor() { super("BootScene"); }
  create() {
    const reg = this.registry;
    if (reg.get("lives") === undefined) {
      reg.set("score", 0); reg.set("coins", 0); reg.set("lives", 3);
      reg.set("gameOver", false); reg.set("clear", false);
    }
    TEX.genAll(this);
    this.input.keyboard.addCapture("SPACE,ENTER,UP,DOWN,LEFT,RIGHT");

    const sky = this.add.graphics().setDepth(DEPTH.sky);
    sky.fillGradientStyle(0x63a4ff, 0x63a4ff, 0xb7dcff, 0xb7dcff);
    sky.fillRect(0, 0, GAME_W, GAME_H);

    for (let x = 0; x < GAME_W; x += TILE) this.add.image(x + 32, GAME_H - 32, "tile-ground").setDepth(DEPTH.tiles);

    /* small diorama on the ground strip */
    this.add.image(300, GAME_H - TILE, "tile-brick").setDepth(DEPTH.tiles);
    this.add.image(368, GAME_H - TILE, "tile-question").setDepth(DEPTH.tiles);
    this.add.image(436, GAME_H - TILE, "tile-used").setDepth(DEPTH.tiles);
    this.add.image(368, GAME_H - TILE - 64, "coin-0").setDepth(DEPTH.coins).setScale(1.2);
    this.add.image(700, GAME_H - TILE, "mushroom").setOrigin(0.5, 1).setDepth(DEPTH.powerups);
    this.add.image(880, GAME_H - TILE, "goomba-1").setOrigin(0.5, 1).setDepth(DEPTH.enemies);
    this.add.image(150, GAME_H - TILE, "mario-super-run2").setOrigin(0.5, 1).setDepth(DEPTH.player).setScale(2.2);

    const font = { fontFamily: COLORS.hudFont, stroke: COLORS.hudStroke };
    this.add.text(GAME_W / 2, 200, "SUPER MARIO HD", { ...font, fontSize: "120px", color: "#ffffff", strokeThickness: 14 }).setOrigin(0.5).setShadow(0, 10, "rgba(0,0,0,.35)", 20).setDepth(DEPTH.hud);
    this.add.text(GAME_W / 2, 320, "WORLD 1  -  BUILT WITH PHASER 3", { ...font, fontSize: "34px", color: "#ffe066", strokeThickness: 8 }).setOrigin(0.5).setDepth(DEPTH.hud);

    const controls = [
      "MOVE   ARROWS  or  A D",
      "JUMP   SPACE / W / Z   (hold for higher)",
      "DASH   SHIFT / X",
      "RESTART R        MUTE M"
    ].join("\n");
    this.add.text(GAME_W / 2, 470, controls, { ...font, fontSize: "30px", color: COLORS.hudColor, strokeThickness: 7, align: "center", lineSpacing: 16 }).setOrigin(0.5).setDepth(DEPTH.hud);

    if (reg.get("gameOver")) {
      this.add.text(GAME_W / 2, 615, "GAME OVER", { ...font, fontSize: "72px", color: "#ff5a4e", strokeThickness: 12 }).setOrigin(0.5).setDepth(DEPTH.hud);
    } else if (reg.get("clear")) {
      this.add.text(GAME_W / 2, 615, "COURSE CLEAR!", { ...font, fontSize: "72px", color: "#69db7c", strokeThickness: 12 }).setOrigin(0.5).setDepth(DEPTH.hud);
    }

    const stats = "SCORE " + pad(reg.get("score"), 6) + "     COINS x" + pad(reg.get("coins"), 2) + "     LIVES x" + pad(reg.get("lives"), 2);
    this.add.text(GAME_W / 2, 705, stats, { ...font, fontSize: "28px", color: "#ffffff", strokeThickness: 6 }).setOrigin(0.5).setDepth(DEPTH.hud);

    const prompt = this.add.text(GAME_W / 2, 800, "PRESS ENTER OR CLICK TO START", { ...font, fontSize: "44px", color: "#ffe066", strokeThickness: 10 }).setOrigin(0.5).setDepth(DEPTH.hud);
    this.tweens.add({ targets: prompt, alpha: 0.25, duration: 550, yoyo: true, repeat: -1 });

    this.started = false;
    const start = () => {
      if (this.started) return;
      this.started = true;
      SFX.unlock();
      SFX.play("coin");
      reg.set("gameOver", false); reg.set("clear", false);
      reg.set("score", 0); reg.set("coins", 0); reg.set("lives", 3);
      this.scene.start("GameScene");
    };
    this.input.keyboard.on("keydown-ENTER", start);
    this.input.keyboard.on("keydown-SPACE", start);
    this.input.once("pointerdown", start);
  }
}
