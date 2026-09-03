"use strict";
/* PowerUp.js - collectibles: floating Coin, popped CoinPopup, Mushroom. */

class CoinPopup extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "coin-0");
    scene.add.existing(this);
    this.setDepth(DEPTH.fx);
    this._f = 0;
    this._ev = scene.time.addEvent({ delay: 70, loop: true, callback: () => {
      this._f = (this._f + 1) % 4;
      this.setTexture("coin-" + this._f);
    } });
    this.once("destroy", () => { if (this._ev) this._ev.remove(false); });
    scene.tweens.add({ targets: this, y: y - 116, duration: 330, ease: "Cubic.easeOut" });
    scene.tweens.add({ targets: this, y: y - 70, duration: 250, delay: 330, ease: "Cubic.easeIn", onComplete: () => this.destroy() });
  }
}

class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "coin-0");
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setDepth(DEPTH.coins);
    this.body.setSize(28, 40);
    this._f = 0;
    this._ev = scene.time.addEvent({ delay: 110, loop: true, callback: () => {
      this._f = (this._f + 1) % 4;
      this.setTexture("coin-" + this._f);
    } });
    this.once("destroy", () => { if (this._ev) this._ev.remove(false); });
  }
}

class Mushroom extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "mushroom");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(DEPTH.decor); /* behind blocks while sprouting */
    this.emerging = true;
    this.body.enable = false;
    this.body.setSize(40, 42);
    this.body.setOffset(4, 6);
    this.shadow = scene.add.image(x, y, "shadow").setDepth(DEPTH.shadow).setDisplaySize(46, 10).setVisible(false);
    this.once("destroy", () => { if (this.shadow) this.shadow.destroy(); });
  }
  emerge() {
    SFX.play("sprout");
    this.scene.tweens.add({
      targets: this, y: this.y - TILE, duration: 550, ease: "Linear",
      onComplete: () => {
        this.emerging = false;
        this.shadow.setVisible(true);
        this.setDepth(DEPTH.powerups);
        this.body.enable = true;
        this.setVelocityX(MUSHROOM_SPEED);
      }
    });
  }
  update(dt) {
    if (this.emerging || !this.body.enable) return;
    this.shadow.setPosition(this.x, this.body.bottom - 2);
    if (this.body.blocked.left) this.setVelocityX(MUSHROOM_SPEED);
    else if (this.body.blocked.right) this.setVelocityX(-MUSHROOM_SPEED);
  }
}
