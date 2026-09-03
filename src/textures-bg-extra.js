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

function drawSkybank(ctx, w, h) {
  const puff = (cx, cy, s) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillEll(ctx, "#ffffff", 0, 14, 70, 22); [[0, 0, 38], [42, -8, 28], [-42, -4, 26], [16, -24, 26], [-18, -22, 24]].forEach((c) => fillEll(ctx, "#f4faff", c[0], c[1], c[2], c[2] * 0.95)); ctx.restore(); };
  puff(120, 80, 1.1); puff(380, 50, 0.8); puff(640, 110, 1.0); puff(900, 70, 0.85);
  ctx.fillStyle = "rgba(255,255,255,.7)";
  [[200, 160], [520, 170], [820, 175]].forEach((p) => fillEll(ctx, "rgba(255,255,255,.7)", p[0], p[1], 30, 8));
}

function drawAirship(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(255,255,255,1)");
  ctx.fillStyle = g; ctx.fillRect(0, h * 0.4, w, h * 0.6);
  const puff = (cx, cy, s) => { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); fillEll(ctx, "#ffffff", 0, 14, 80, 24); [[0, 0, 42], [46, -8, 32], [-46, -4, 30], [18, -28, 30], [-20, -26, 28]].forEach((c) => fillEll(ctx, "#eef6ff", c[0], c[1], c[2], c[2] * 0.95)); ctx.restore(); };
  puff(140, 200, 1.4); puff(440, 220, 1.2); puff(760, 210, 1.5); puff(1060, 230, 1.1);
}

function drawCastleFar(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#3a1414"); g.addColorStop(1, "#1c0606");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(180,40,30,.25)";
  for (let x = 0; x < w; x += 32) ctx.fillRect(x, h - 80, 20, 80);
  ctx.fillStyle = "rgba(255,180,40,.15)";
  for (let x = 80; x < w; x += 64) ctx.fillRect(x, h - 120, 24, 120);
}

function drawCastleMid(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#5a1818"); g.addColorStop(1, "#2a0a0a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const block = (x, y) => { ctx.fillStyle = "#3a1010"; ctx.fillRect(x, y, 24, 24); ctx.strokeStyle = "#1a0606"; ctx.lineWidth = 2; ctx.strokeRect(x, y, 24, 24); };
  for (let x = 0; x < w; x += 28) for (let y = 0; y < h; y += 28) block(x, y);
  ctx.fillStyle = "rgba(255,140,40,.4)";
  for (let x = 56; x < w; x += 120) { ctx.fillRect(x, h * 0.4, 16, 60); ctx.fillRect(x + 8, h * 0.4 - 8, 18, 12); }
}

