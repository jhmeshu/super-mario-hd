"use strict";
/* Player.js - Mario: acceleration movement, variable-height jump with
 * coyote time and input buffering, dash, grow/shrink states, stomp bounce,
 * and the classic death arc. */

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "mario-small-idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.player);
    this.keys = scene.input.keyboard.addKeys({
      left: "LEFT", right: "RIGHT", a: "A", d: "D",
      down: "DOWN",
      up: "UP", w: "W", space: "SPACE", z: "Z", shift: "SHIFT", x: "X"
    });
    this.small = true;
    this.dead = false;
    this.controlsEnabled = true;
    this.forceRight = false;
    this.invulnUntil = 0;
    this.coyoteUntil = 0;
    this.jumpBufferUntil = 0;
    this.cutReady = false;
    this.jumpLatched = false;
    this.runClock = 0;
    this.pose = "idle";
    this._applySize();
    this.shadow = scene.add.image(x, y, "shadow").setDepth(DEPTH.shadow).setDisplaySize(52, 12);
    this.setMaxVelocity(PHYS.dash + 40, PHYS.maxFall);
  }
  _applySize() {
    const h = this.small ? 44 : 60;
    this.body.setSize(34, h);
    this.body.setOffset(7, 64 - h);
    if (this.shadow) this.shadow.setDisplaySize(this.small ? 52 : 60, 12);
  }
  _down(list) { return list.some((k) => k.isDown); }
  _jumpKeys() { return [this.keys.space, this.keys.up, this.keys.w, this.keys.z]; }
  _justJump() { return this._jumpKeys().some((k) => Phaser.Input.Keyboard.JustDown(k)); }
  update(dt) {
    if (this.dead) { this.body.setAccelerationX(0); return; }
    const b = this.body;
    const now = this.scene.time.now;
    const onGround = b.blocked.down;
    if (onGround) this.coyoteUntil = now + PHYS.coyoteMs;
    let ax = 0;
    if (this.controlsEnabled) {
      if (this._down([this.keys.left, this.keys.a])) ax = -1;
      else if (this._down([this.keys.right, this.keys.d])) ax = 1;
    }
    if (this.forceRight) ax = 1;
    const dashing = this.controlsEnabled && this._down([this.keys.shift, this.keys.x]);
    const cap = dashing ? PHYS.dash : PHYS.move;
    if (ax !== 0) {
      b.setAccelerationX(ax * (onGround ? PHYS.accelGround : PHYS.accelAir));
      this.setDragX(0);
      this.setFlipX(ax < 0 && !this.forceRight);
    } else {
      b.setAccelerationX(0);
      this.setDragX(onGround ? PHYS.dragGround : PHYS.dragAir);
    }
    const vx = b.velocity.x;
    if (Math.abs(vx) > cap) b.setVelocityX(vx - (vx - cap * Math.sign(vx)) * 0.12);
    if (this.controlsEnabled && this._justJump()) this.jumpBufferUntil = now + PHYS.jumpBufferMs;
    const jh = this._down(this._jumpKeys());
    if (!this.jumpLatched && this.jumpBufferUntil > now && this.coyoteUntil > now) {
      b.setVelocityY(PHYS.jump);
      this.jumpBufferUntil = 0;
      this.coyoteUntil = 0;
      this.cutReady = true;
      this.jumpLatched = true;
      SFX.play("jump");
    }
    if (!jh) this.jumpLatched = false;
    if (this.cutReady && !jh && b.velocity.y < 0) {
      b.setVelocityY(b.velocity.y * 0.45);
      this.cutReady = false;
    }
    if (b.velocity.y >= 0) this.cutReady = false;
    if (this.shadow) {
      this.shadow.setPosition(this.x, b.bottom - 2);
      const sa = onGround && !this.dead ? 0.75 : 0;
      this.shadow.alpha += (sa - this.shadow.alpha) * Math.min(1, dt * 0.02);
      this.shadow.setVisible(this.shadow.alpha > 0.02);
    }
    let pose = "idle";
    if (!onGround) pose = "jump";
    else if (Math.abs(b.velocity.x) > 24) {
      this.runClock += dt * Math.abs(b.velocity.x) / 35;
      const seq = ["run1", "run2", "run3", "run2"];
      pose = seq[Math.floor(this.runClock) % 4];
    } else this.runClock = 0;
    if (pose !== this.pose) {
      this.pose = pose;
      this.setTexture("mario-" + (this.small ? "small" : "super") + "-" + pose);
    }
  }
  stompBounce() {
    const held = this._down(this._jumpKeys());
    this.body.setVelocityY(held ? PHYS.jump * 0.95 : PHYS.bounce);
    this.cutReady = held;
    this.jumpLatched = held;
  }
  powerUp(now) {
    this.small = false;
    this._applySize();
    this.setTexture("mario-super-" + this.pose);
    this.invulnUntil = now + 600;
    this.scene.tweens.add({ targets: this, alpha: { from: 0.4, to: 1 }, duration: 90, yoyo: true, repeat: 5, onComplete: () => this.setAlpha(1) });
  }
  damage(now) {
    if (this.dead || now < this.invulnUntil) return;
    if (this.small) { this.die(false); return; }
    this.small = true;
    this._applySize();
    this.setTexture("mario-small-" + this.pose);
    this.invulnUntil = now + 2000;
    SFX.play("shrink");
    this.scene.tweens.add({ targets: this, alpha: { from: 1, to: 0.25 }, duration: 110, yoyo: true, repeat: 9, onComplete: () => this.setAlpha(1) });
  }
  die(fromPit) {
    if (this.dead) return;
    this.dead = true;
    this.controlsEnabled = false;
    this.forceRight = false;
    const b = this.body;
    b.setAccelerationX(0);
    b.checkCollision.none = true;
    this.setAlpha(1);
    if (fromPit) b.setVelocity(0, 200);
    else { b.setVelocity(0, -640); this.setFlipY(true); }
    if (this.shadow) this.shadow.setVisible(false);
    SFX.play("death");
    this.scene.time.delayedCall(2600, () => this.scene.handlePlayerDeath());
  }
}
