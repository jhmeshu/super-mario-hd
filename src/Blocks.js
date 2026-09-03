"use strict";
/* Blocks.js - interactive level blocks.
 * QuestionBlock: bumps from below, spawns its content once, becomes used.
 * BrickBlock: bounces when Small Mario hits it, shatters when Super hits. */

class QuestionBlock extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, content) {
    super(scene, x, y, "tile-question");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setDepth(DEPTH.tiles);
    this.isBlock = true;
    this.content = content || "coin";
    this.used = false;
    this._lastBump = 0;
  }
  bump(player) {
    if (this.used) { SFX.play("bump"); return; }
    this.used = true;
    this.setTexture("tile-used");
    this.scene.tweens.add({ targets: this, y: this.y - 18, duration: 70, yoyo: true, ease: "Quad.easeOut" });
    this.scene.spawnBlockContent(this);
  }
}

class BrickBlock extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "tile-brick");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setDepth(DEPTH.tiles);
    this.isBlock = true;
    this._lastBump = 0;
  }
  bump(player) {
    if (player && !player.small) { this.scene.shatterBrick(this); return; }
    SFX.play("bump");
    this.scene.tweens.add({ targets: this, y: this.y - 14, duration: 60, yoyo: true, ease: "Quad.easeOut" });
    this.scene.bumpEnemiesOn(this);
  }
}
