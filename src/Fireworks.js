"use strict";
/* Fireworks.js - celebratory sky bursts above the castle on course clear. */

function ensureSparkTexture(scene) {
  if (!scene.textures.exists("spark")) {
    texCanvas(scene, "spark", 14, 14, (ctx) => {
      const g = ctx.createRadialGradient(7, 7, 0.5, 7, 7, 7);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.45, "#ffffff");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 14, 14);
    });
  }
}

class Fireworks {
  constructor(scene, cx, topY) {
    this.scene = scene;
    this.cx = cx;
    this.topY = topY;
    this.colors = [0xffd23e, 0xff5a4e, 0x63e2ff, 0xff8ad8, 0x9dff6b];
    this.timer = null;
  }
  start() {
    ensureSparkTexture(this.scene);
    let i = 0;
    this.timer = this.scene.time.addEvent({
      delay: 420,
      repeat: 6,
      callback: () => {
        this.launch(Phaser.Math.Between(-170, 170), Phaser.Math.Between(120, 320), this.colors[i % this.colors.length]);
        i++;
      }
    });
  }
  stop() {
    if (this.timer) this.timer.remove(false);
  }
  launch(dx, peakY, color) {
    const sx = this.cx + Phaser.Math.Between(-140, 140);
    const rocket = this.scene.add.image(sx, this.topY + 40, "spark").setDepth(DEPTH.fx).setScale(0.9);
    this.scene.tweens.add({
      targets: rocket,
      x: sx + dx,
      y: peakY,
      duration: 380,
      ease: "Sine.easeOut",
      onComplete: () => { rocket.destroy(); this.burst(sx + dx, peakY, color); }
    });
  }
  burst(x, y, color) {
    SFX.play("firework");
    const flash = this.scene.add.image(x, y, "spark").setDepth(DEPTH.fx).setScale(3.2).setTint(color).setAlpha(0.95);
    this.scene.tweens.add({ targets: flash, scale: 6, alpha: 0, duration: 260, ease: "Quad.easeOut", onComplete: () => flash.destroy() });
    for (let k = 0; k < 18; k++) {
      const ang = (Math.PI * 2 * k) / 18 + Math.random() * 0.2;
      const spd = Phaser.Math.Between(130, 230);
      const p = this.scene.add.image(x, y, "spark").setDepth(DEPTH.fx).setTint(color).setScale(Phaser.Math.FloatBetween(0.7, 1.2));
      this.scene.tweens.add({
        targets: p,
        x: x + Math.cos(ang) * spd * 0.9,
        y: y + Math.sin(ang) * spd * 0.55 + 26,
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(520, 780),
        ease: "Cubic.easeOut",
        onComplete: () => p.destroy()
      });
    }
  }
}
