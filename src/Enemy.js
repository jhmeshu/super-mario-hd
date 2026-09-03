"use strict";
/* Enemy.js - Goomba: patrols left, turns at walls, flattens when stomped,
 * flips and falls away when the block under it is bumped. */

class Goomba extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "goomba-1");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.enemies);
    this.dir = -1;
    this.speed = GOOMBA_SPEED;
    this.state2 = "walk"; /* walk | flat | flipped */
    this.animT = Math.random() * 160;
    this.body.setSize(44, 38);
    this.body.setOffset(6, 10);
    this.setVelocityX(-this.speed);
    this.shadow = scene.add.image(x, y, "shadow").setDepth(DEPTH.shadow).setDisplaySize(54, 11);
  }
  setDir(d) { this.dir = d; }
  update(dt) {
    if (this.state2 !== "walk") return;
    const b = this.body;
    if (b.blocked.left) this.dir = 1;
    else if (b.blocked.right) this.dir = -1;
    b.setVelocityX(this.dir * this.speed);
    this.animT += dt;
    this.setTexture(Math.floor(this.animT / 160) % 2 === 0 ? "goomba-1" : "goomba-2");
    if (this.shadow) this.shadow.setPosition(this.x, b.bottom - 2);
  }
  stomp() {
    if (this.state2 !== "walk") return;
    this.state2 = "flat";
    this.setTexture("goomba-flat");
    if (this.shadow) this.shadow.destroy();
    this.body.enable = false;
    this.scene.time.delayedCall(420, () => this.destroy());
  }
  flipDie() {
    if (this.state2 !== "walk") return;
    this.state2 = "flipped";
    if (this.shadow) this.shadow.destroy();
    this.setFlipY(true);
    this.body.checkCollision.none = true;
    this.body.setAngularVelocity(260);
    this.body.setVelocity(-40 * this.dir, -380);
    SFX.play("kick");
  }
}
