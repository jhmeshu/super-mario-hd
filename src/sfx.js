"use strict";
/* sfx.js - zero-asset sound effects synthesized live with WebAudio.
 * AudioContext is created on first user gesture (autoplay policy). */
const SFX = {
  ctx: null,
  muted: false,
  unlock() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    } catch (e) { /* audio unavailable - game still runs */ }
  },
  tone(f0, f1, dur, type, vol, delay) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + (delay || 0);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(Math.max(1, f0), t0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
    g.gain.setValueAtTime(vol || 0.12, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  },
  noise(dur, vol, delay) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + (delay || 0);
    const n = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.value = vol || 0.15;
    src.connect(g);
    g.connect(this.ctx.destination);
    src.start(t0);
  },
  play(name) {
    if (!this.ctx || this.muted) return;
    switch (name) {
      case "jump": this.tone(200, 540, 0.16, "square", 0.10); break;
      case "coin": this.tone(988, 988, 0.07, "square", 0.10);
                   this.tone(1319, 1319, 0.28, "square", 0.10, 0.07); break;
      case "stomp": this.noise(0.12, 0.18); this.tone(220, 90, 0.12, "triangle", 0.14); break;
      case "bump": this.tone(120, 80, 0.09, "square", 0.14); break;
      case "break": this.noise(0.25, 0.22); this.tone(300, 100, 0.20, "sawtooth", 0.08); break;
      case "firework": this.noise(0.18, 0.2); this.tone(600, 90, 0.35, "triangle", 0.12); break;
      case "sprout": this.tone(180, 760, 0.45, "sine", 0.12); break;
      case "power": [392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, f, 0.09, "square", 0.10, i * 0.06)); break;
      case "shrink": this.tone(700, 180, 0.30, "sine", 0.12); break;
      case "death": [660, 494, 392, 330, 262].forEach((f, i) => this.tone(f, f, 0.16, "square", 0.11, i * 0.13)); break;
      case "flag": [262, 330, 392, 523, 659, 784].forEach((f, i) => this.tone(f, f, 0.14, "square", 0.10, i * 0.09)); break;
      case "kick": this.tone(160, 60, 0.14, "square", 0.14); break;
    }
  }
};
