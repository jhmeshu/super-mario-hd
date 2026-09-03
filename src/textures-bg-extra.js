"use strict";
/* textures-bg-extra.js - remaining themed painters (clouds, cavern, lava).
   Loaded after textures-bg.js; functions resolve globally at genAll time. */

function drawRichClouds(ctx, w, h) {
  const puff = (cx, cy, s) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillEll(ctx, "#dbeafe", 0, 14, 66, 20); [[0, 0, 36], [38, -6, 27], [-38, -4, 25], [14, -22, 24], [-16, -20, 22]].forEach((c) => fillEll(ctx, "#ffffff", c[0], c[1], c[2], c[2] * 0.92)); ctx.restore(); };
  puff(110, 80, 1.05); puff(330, 50, 0.7); puff(520, 120, 0.95);
  puff(700, 45, 0.8); puff(850, 150, 0.65); puff(240, 190, 0.55);
}

function drawFarClouds(ctx, w, h) {
  const puff = (cx, cy, s) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.globalAlpha = 0.85; fillEll(ctx, "#e4eefc", 0, 12, 58, 17); [[0, 0, 30], [32, -5, 23], [-32, -3, 21], [12, -18, 20]].forEach((c) => fillEll(ctx, "#f8fbff", c[0], c[1], c[2], c[2] * 0.92)); ctx.restore(); };
  puff(140, 70, 0.6); puff(420, 40, 0.5); puff(660, 110, 0.65); puff(880, 55, 0.55);
}

function drawCavernFar(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#241538"); g.addColorStop(1, "#170d28");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const line = (pts, col, lw) => { ctx.beginPath(); pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }); ctx.lineWidth = lw; ctx.strokeStyle = col; ctx.stroke(); };
  line([[0, 90], [150, 60], [300, 110], [450, 70], [600, 120], [780, 80], [950, 130], [1200, 95]], "#120a20", 5);
  line([[0, 210], [200, 180], [400, 230], [650, 190], [900, 240], [1200, 200]], "#100818", 5);
  line([[220, 140], [260, 120], [310, 150], [350, 125]], "rgba(62,230,193,0.8)", 2);
  line([[700, 160], [740, 135], [800, 165]], "rgba(87,255,154,0.75)", 2);
  line([[1000, 120], [1040, 100], [1090, 130], [1120, 105]], "rgba(62,230,193,0.7)", 2);
  [[265, 128], [352, 132], [762, 148], [1058, 118]].forEach((p) => fillEll(ctx, "#b7ffe9", p[0], p[1], 2.5, 4));
}

function drawStalactites(ctx, w, h) {
  const stal = (x, len, col) => { ctx.beginPath(); ctx.moveTo(x - 18, 0); ctx.lineTo(x, len); ctx.lineTo(x + 18, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  stal(60, 120, "#2b1846"); stal(180, 180, "#2b1846"); stal(320, 90, "#2b1846"); stal(470, 200, "#2b1846");
  stal(620, 140, "#2b1846"); stal(760, 95, "#2b1846"); stal(910, 175, "#2b1846"); stal(1060, 110, "#2b1846");
  stal(120, 70, "#1c0f33"); stal(260, 140, "#1c0f33"); stal(400, 55, "#1c0f33"); stal(550, 160, "#1c0f33");
  stal(700, 100, "#1c0f33"); stal(850, 150, "#1c0f33"); stal(990, 65, "#1c0f33"); stal(1150, 185, "#1c0f33");
  fillRR(ctx, "#123f24", 500, 150, 34, 110, 10);
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(70,224,124,0.9)";
  rr(ctx, 500, 150, 34, 110, 10); ctx.stroke();
  ctx.fillStyle = "rgba(70,224,124,0.8)"; ctx.fillRect(508, 158, 6, 94);
}

