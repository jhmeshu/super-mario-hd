"use strict";
/* textures.js - procedural HD texture factory.
 * Every sprite/tile is drawn at runtime with Canvas2D in a clean vector
 * style matching the reference art. To swap in real PNG assets later,
 * replace TEX.genAll() with a loader registering identically named keys. */

function texCanvas(scene, key, w, h, draw) {
  if (scene.textures.exists(key)) return scene.textures.get(key);
  const tex = scene.textures.createCanvas(key, w, h);
  const ctx = tex.getContext();
  ctx.save();
  draw(ctx, w, h);
  ctx.restore();
  tex.refresh();
  return tex;
}
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function fillRR(ctx, color, x, y, w, h, r) { rr(ctx, x, y, w, h, r); ctx.fillStyle = color; ctx.fill(); }
function ell(ctx, cx, cy, rx, ry) { ctx.beginPath(); ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); ctx.closePath(); }
function fillEll(ctx, color, cx, cy, rx, ry) { ell(ctx, cx, cy, rx, ry); ctx.fillStyle = color; ctx.fill(); }
function limb(ctx, x1, y1, x2, y2, w, color) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.lineWidth = w; ctx.lineCap = "round"; ctx.strokeStyle = color; ctx.stroke();
}

/* Mario drawn facing right in a 48x64 design space; small scales by 0.76 */
function dy0(small) { return small ? 12 : 0; }
function drawMario(ctx, pose, small) {
  if (small) { const s = 0.76; ctx.translate((48 - 48 * s) / 2, 64 - 64 * s); ctx.scale(s, s); }
  const RED = "#e5342b", DRED = "#b32014", BLU = "#2f5fd0", DBLU = "#20418f";
  const SKIN = "#ffc88a", SHOE = "#7c3a1d", HAIR = "#5a2d0e", WHT = "#ffffff";
  const EYE = "#1b2f6e", YEL = "#ffd23e";
  let P;
  switch (pose) {
    case "run1": P = [10, 58, 36, 58, 43, 33, 5, 46]; break;
    case "run2": P = [19, 60, 29, 60, 42, 39, 6, 42]; break;
    case "run3": P = [13, 61, 34, 56, 37, 31, 9, 47]; break;
    case "jump": P = [32, 53, 11, 62, 43, 21, 6, 45]; break;
    default: P = [16, 62, 30, 62, 41, 44, 7, 44];
  }
  const d = dy0(small);
  limb(ctx, 28, 44 + d, P[2], P[3] - 6, 11, DBLU);
  fillEll(ctx, SHOE, P[2], P[3] - 4, 9.5, 5.5);
  limb(ctx, 21, 44 + d, P[0], P[1] - 6, 12, BLU);
  fillEll(ctx, SHOE, P[0] + 2, P[1] - 3, 10, 6);
  limb(ctx, 34, 33 + d, P[6], P[7], 9, DRED);
  fillEll(ctx, WHT, P[6], P[7], 5, 5);
  fillRR(ctx, RED, 14, 26 + d, 20, 12, 5);
  fillRR(ctx, BLU, 13, 32 + d, 22, small ? 15 : 19, 6);
  fillRR(ctx, BLU, 16, 25 + d, 5, 9, 2);
  fillRR(ctx, BLU, 27, 25 + d, 5, 9, 2);
  fillEll(ctx, YEL, 18.5, 35 + d, 2.2, 2.2);
  fillEll(ctx, YEL, 29.5, 35 + d, 2.2, 2.2);
  limb(ctx, 15, 33 + d, P[4], P[5], 9, RED);
  fillEll(ctx, WHT, P[4], P[5], 5.5, 5.5);
  fillRR(ctx, HAIR, 9, 11 + d, 8, 15, 3);
  fillRR(ctx, SKIN, 11, 9 + d, 26, 21, 8);
  fillEll(ctx, SKIN, 13, 22 + d, 3.6, 4.6);
  fillEll(ctx, SKIN, 37, 21 + d, 5.6, 4.6);
  fillRR(ctx, HAIR, 27, 24 + d, 12, 5, 2.5);
  fillEll(ctx, WHT, 30.5, 17 + d, 3, 4.2);
  fillEll(ctx, EYE, 31.4, 17.6 + d, 1.7, 2.6);
  ctx.beginPath();
  ctx.moveTo(10, 14 + d);
  ctx.quadraticCurveTo(11, 2 + d, 25, 2 + d);
  ctx.quadraticCurveTo(38, 2 + d, 39, 13 + d);
  ctx.closePath();
  ctx.fillStyle = RED; ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = DRED; ctx.stroke();
  fillRR(ctx, RED, 27, 10 + d, 19, 6, 3);
  ctx.lineWidth = 1.5; ctx.strokeStyle = DRED;
  rr(ctx, 27, 10 + d, 19, 6, 3); ctx.stroke();
  fillEll(ctx, WHT, 25, 8 + d, 4.6, 4.6);
  ctx.fillStyle = RED;
  ctx.font = "900 8px Arial Black, Arial, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("M", 25, 9 + d);
}
function drawQuestion(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#ffcf33"); g.addColorStop(1, "#e8930c");
  fillRR(ctx, g, 2, 2, 60, 60, 9);
  ctx.lineWidth = 3; ctx.strokeStyle = "#8a5200";
  rr(ctx, 2, 2, 60, 60, 9); ctx.stroke();
  fillRR(ctx, "rgba(255,255,255,.35)", 9, 7, 46, 6, 3);
  [[11, 11], [53, 11], [11, 53], [53, 53]].forEach((p) => fillEll(ctx, "#8a5200", p[0], p[1], 3, 3));
  ctx.font = "900 40px Arial Black, Arial, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = "#a35f00"; ctx.fillText("?", 33.5, 37.5);
  ctx.fillStyle = "#ffffff"; ctx.fillText("?", 31, 34.5);
}
function drawUsed(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#b06a33"); g.addColorStop(1, "#8a4c1e");
  fillRR(ctx, g, 2, 2, 60, 60, 7);
  ctx.lineWidth = 3; ctx.strokeStyle = "#5f3210";
  rr(ctx, 2, 2, 60, 60, 7); ctx.stroke();
  fillRR(ctx, "rgba(255,255,255,.15)", 8, 7, 48, 5, 3);
  [[11, 11], [53, 11], [11, 53], [53, 53]].forEach((p) => fillEll(ctx, "#5f3210", p[0], p[1], 3, 3));
}
function drawBrick(ctx) {
  ctx.fillStyle = "#c1502e"; ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 21.3); ctx.lineTo(64, 21.3);
  ctx.moveTo(0, 42.6); ctx.lineTo(64, 42.6);
  ctx.moveTo(32, 0); ctx.lineTo(32, 21.3);
  ctx.moveTo(16, 21.3); ctx.lineTo(16, 42.6);
  ctx.moveTo(48, 21.3); ctx.lineTo(48, 42.6);
  ctx.moveTo(32, 42.6); ctx.lineTo(32, 64);
  ctx.stroke();
  ctx.strokeStyle = "#5f2410"; ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, 61, 61);
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.beginPath(); ctx.moveTo(3, 3); ctx.lineTo(61, 3); ctx.stroke();
}
function drawGround(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#c8834e"); g.addColorStop(1, "#a05a30");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "#8a4a26";
  [[10, 34], [30, 44], [50, 30], [20, 55], [46, 54], [57, 44]].forEach((p) => { ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = "#3fae4a";
  ctx.fillRect(0, 0, 64, 16);
  [6, 18, 30, 42, 54].forEach((x) => { ctx.beginPath(); ctx.arc(x, 16, 6.5, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = "#8ee063"; ctx.fillRect(0, 2, 64, 4);
  ctx.fillStyle = "#2e8738"; ctx.fillRect(0, 13.5, 64, 3);
  ctx.strokeStyle = "#14401b"; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(1.2, 64); ctx.lineTo(1.2, 1.2); ctx.lineTo(62.8, 1.2); ctx.lineTo(62.8, 64);
  ctx.stroke();
}
function pipeBase(ctx, x, w) {
  ctx.fillStyle = "#3cb818"; ctx.fillRect(x, 0, w, 64);
  ctx.fillStyle = "#a5e63c"; ctx.fillRect(x + w * 0.10, 0, w * 0.16, 64);
  ctx.fillStyle = "#1e7a0e"; ctx.fillRect(x + w * 0.74, 0, w * 0.16, 64);
  ctx.strokeStyle = "#0d4d08"; ctx.lineWidth = 4;
  ctx.strokeRect(x + 2, -4, w - 4, 72);
}
function drawPipeBody(ctx) { pipeBase(ctx, 14, 100); }
function drawPipeTop(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#4fd42a"); g.addColorStop(1, "#2fa010");
  rr(ctx, 4, 4, 120, 56, 10); ctx.fillStyle = g; ctx.fill();
  ctx.save();
  rr(ctx, 4, 4, 120, 56, 10); ctx.clip();
  ctx.fillStyle = "#a5e63c"; ctx.fillRect(16, 4, 18, 56);
  ctx.fillStyle = "#1e7a0e"; ctx.fillRect(92, 4, 20, 56);
  ctx.restore();
  ctx.lineWidth = 4; ctx.strokeStyle = "#0d4d08";
  rr(ctx, 4, 4, 120, 56, 10); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(10, 8, 108, 5);
}
function drawCloudTile(ctx, w, h) {
  const cloud = (cx, cy, s) => {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
    fillEll(ctx, "#dbeafe", 0, 14, 66, 20);
    [[0, 0, 36], [38, -6, 27], [-38, -4, 25], [14, -22, 24], [-16, -20, 22]].forEach((c) => fillEll(ctx, "#ffffff", c[0], c[1], c[2], c[2] * 0.92));
    ctx.restore();
  };
  cloud(150, 90, 1.0); cloud(450, 55, 0.75); cloud(760, 120, 1.1);
}
function drawHillTile(ctx, w, h) {
  const hill = (cx, r) => {
    ctx.beginPath(); ctx.arc(cx, h, r, Math.PI, 0); ctx.closePath();
    const g = ctx.createLinearGradient(cx, h - r, cx, h);
    g.addColorStop(0, "#43c05a"); g.addColorStop(1, "#2b8f3f");
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = "#1e6b2c"; ctx.stroke();
    ctx.fillStyle = "#1e6b2c";
    ctx.beginPath(); ctx.arc(cx - r * 0.32, h - r * 0.42, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx - r * 0.32 + 22, h - r * 0.42, 6, 0, Math.PI * 2); ctx.fill();
  };
  hill(170, 215); hill(520, 150); hill(800, 190);
}
function drawBush(ctx, w, h) {
  const bump = (cx, r) => {
    ctx.beginPath(); ctx.arc(cx, h, r, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = "#37b24d"; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = "#1e6b2c"; ctx.stroke();
  };
  bump(52, 34); bump(122, 44); bump(198, 36);
  ctx.fillStyle = "#63cf73";
  ctx.beginPath(); ctx.arc(112, h - 34, 10, Math.PI, 0); ctx.closePath(); ctx.fill();
}
function drawGoomba(ctx, pose) {
  const CAP = "#a55528", CDK = "#7c3a14", FACE = "#f6cf94", FOOT = "#5c2e12", WHT = "#ffffff";
  if (pose === "flat") {
    fillEll(ctx, CAP, 28, 38, 25, 9);
    ctx.lineWidth = 3; ctx.strokeStyle = CDK;
    ell(ctx, 28, 38, 25, 9); ctx.stroke();
    fillRR(ctx, FACE, 12, 40, 32, 6, 3);
    return;
  }
  const spread = pose === "walk2" ? 5 : -5;
  fillEll(ctx, FOOT, 16 + spread, 42, 10.5, 6);
  fillEll(ctx, FOOT, 40 - spread, 42, 10.5, 6);
  ell(ctx, 28, 25, 23.5, 19.5); ctx.fillStyle = CAP; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = CDK; ctx.stroke();
  ctx.globalAlpha = 0.55; fillEll(ctx, "#d98a52", 19, 15, 11, 6); ctx.globalAlpha = 1;
  fillEll(ctx, FACE, 28, 33, 17, 9);
  fillEll(ctx, WHT, 20, 24, 5.5, 7);
  fillEll(ctx, WHT, 36, 24, 5.5, 7);
  fillEll(ctx, "#111111", 21.5, 26, 2.4, 3.4);
  fillEll(ctx, "#111111", 34.5, 26, 2.4, 3.4);
  ctx.beginPath(); ctx.moveTo(13, 15); ctx.lineTo(26, 20);
  ctx.lineWidth = 4; ctx.strokeStyle = "#111111"; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(43, 15); ctx.lineTo(30, 20); ctx.stroke();
}
function drawCoin(ctx, frame) {
  const widths = [36, 24, 9, 24];
  const rx = widths[frame] / 2, cy = 24;
  fillEll(ctx, "#f5b201", 20, cy, rx, 20);
  ctx.lineWidth = 2.5; ctx.strokeStyle = "#a86e00";
  ell(ctx, 20, cy, rx, 20); ctx.stroke();
  if (frame !== 2) {
    fillEll(ctx, "#ffd84d", 20, cy, rx * 0.62, 14.4);
    fillRR(ctx, "#d99a00", 20 - widths[frame] * 0.09, cy - 9, Math.max(3, widths[frame] * 0.18), 18, Math.max(1.5, widths[frame] * 0.09));
  } else {
    fillRR(ctx, "#ffd84d", 18.5, cy - 14.4, 3, 28.8, 1.5);
  }
}
function brickPattern(ctx, x, y, w, h) {
  ctx.strokeStyle = "#9aa0ae"; ctx.lineWidth = 2;
  let row = 0;
  for (let yy = y; yy < y + h; yy += 24, row++) {
    ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
    for (let xx = x + ((row % 2) ? 24 : 48); xx < x + w; xx += 48) {
      ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, Math.min(yy + 24, y + h)); ctx.stroke();
    }
  }
}
function drawCastle(ctx, w, h) {
  const OUT = "#565b66";
  ctx.fillStyle = "#ccd0da"; ctx.fillRect(0, 160, 448, 224);
  brickPattern(ctx, 0, 160, 448, 224);
  let i = 0;
  for (i = 0; i < 7; i++) { ctx.fillStyle = "#ccd0da"; ctx.fillRect(i * 68 + 4, 132, 40, 28); }
  ctx.fillStyle = "#bcc1cd"; ctx.fillRect(0, 88, 96, 296); brickPattern(ctx, 0, 88, 96, 296);
  ctx.fillStyle = "#bcc1cd"; ctx.fillRect(352, 88, 96, 296); brickPattern(ctx, 352, 88, 96, 296);
  for (i = 0; i < 2; i++) { ctx.fillStyle = "#bcc1cd"; ctx.fillRect(i * 56 + 4, 60, 36, 28); ctx.fillRect(356 + i * 56, 60, 36, 28); }
  ctx.fillStyle = "#d6dae4"; ctx.fillRect(160, 32, 128, 352); brickPattern(ctx, 160, 32, 128, 352);
  for (i = 0; i < 3; i++) { ctx.fillStyle = "#d6dae4"; ctx.fillRect(i * 46 + 164, 4, 34, 28); }
  ctx.strokeStyle = OUT; ctx.lineWidth = 4;
  ctx.strokeRect(2, 162, 444, 220);
  ctx.strokeRect(2, 90, 92, 294);
  ctx.strokeRect(354, 90, 92, 294);
  ctx.strokeRect(162, 34, 124, 350);
  ctx.fillStyle = "#15181e";
  ctx.beginPath();
  ctx.moveTo(192, 384); ctx.lineTo(192, 340); ctx.arc(224, 340, 32, Math.PI, 0); ctx.lineTo(256, 384);
  ctx.closePath(); ctx.fill();
  [[40, 130], [388, 130], [214, 120]].forEach((v) => {
    ctx.beginPath();
    ctx.moveTo(v[0], v[1] + 30); ctx.lineTo(v[0], v[1] + 10); ctx.arc(v[0] + 10, v[1] + 10, 10, Math.PI, 0); ctx.lineTo(v[0] + 20, v[1] + 30);
    ctx.closePath(); ctx.fill();
  });
}
function starPath(ctx, cx, cy, R, r, n) {
  ctx.beginPath();
  for (let k = 0; k < n * 2; k++) {
    const a = -Math.PI / 2 + k * Math.PI / n;
    const rad = k % 2 ? r : R;
    if (k === 0) ctx.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    else ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
}
function drawFlag(ctx) {
  ctx.beginPath();
  ctx.moveTo(54, 3); ctx.lineTo(4, 22); ctx.lineTo(54, 41);
  ctx.closePath();
  ctx.fillStyle = "#3cb818"; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = "#0d4d08"; ctx.stroke();
  starPath(ctx, 36, 22, 10, 4.2, 5);
  ctx.fillStyle = "#ffffff"; ctx.fill();
}
function drawPole(ctx) {
  fillRR(ctx, "#3cb818", 5, 16, 6, 624, 3);
  fillEll(ctx, "#4fd42a", 8, 10, 8.5, 8.5);
  ctx.lineWidth = 3; ctx.strokeStyle = "#0d4d08";
  ell(ctx, 8, 10, 8.5, 8.5); ctx.stroke();
}
function drawFragment(ctx) {
  ctx.fillStyle = "#c1502e"; ctx.fillRect(0, 0, 28, 22);
  ctx.strokeStyle = "#7c2d12"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 11); ctx.lineTo(28, 11); ctx.stroke();
  ctx.strokeStyle = "#5f2410"; ctx.strokeRect(1.5, 1.5, 25, 19);
}
function drawBrickUnderground(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#7a3a1a"); g.addColorStop(1, "#4a1f0a");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = "#2a1108"; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 21.3); ctx.lineTo(64, 21.3);
  ctx.moveTo(0, 42.6); ctx.lineTo(64, 42.6);
  ctx.moveTo(32, 0); ctx.lineTo(32, 21.3);
  ctx.moveTo(16, 21.3); ctx.lineTo(16, 42.6);
  ctx.moveTo(48, 21.3); ctx.lineTo(48, 42.6);
  ctx.moveTo(32, 42.6); ctx.lineTo(32, 64);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.beginPath(); ctx.moveTo(3, 3); ctx.lineTo(61, 3); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.06)";
  ctx.fillRect(0, 0, 64, 5);
}
function drawPipeUnderground(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#3a8a44"); g.addColorStop(1, "#1d4a23");
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = "#5fb86a"; ctx.fillRect(8, 0, 18, 64);
  ctx.fillStyle = "#1d4a23"; ctx.fillRect(96, 0, 24, 64);
  ctx.strokeStyle = "#0d2a14"; ctx.lineWidth = 4;
  ctx.strokeRect(2, -4, 124, 72);
}
function drawTorch(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#ffcf33"); g.addColorStop(1, "#e5342b");
  fillEll(ctx, "#ffe066", 16, 12, 12, 14);
  fillEll(ctx, "#ff8a1a", 16, 8, 8, 10);
  fillEll(ctx, "#ffffff", 14, 6, 3, 4);
  ctx.fillStyle = "#3a2614"; ctx.fillRect(12, 28, 8, 28);
  ctx.strokeStyle = "#1a0e08"; ctx.lineWidth = 2;
  ctx.strokeRect(12, 28, 8, 28);
}
function drawCoinPile(ctx) {
  const coin = (cx, cy, r) => {
    fillEll(ctx, "#f5b201", cx, cy, r, r * 0.9);
    ctx.strokeStyle = "#a86e00"; ctx.lineWidth = 1.5;
    ell(ctx, cx, cy, r, r * 0.9); ctx.stroke();
    fillEll(ctx, "#ffd84d", cx, cy, r * 0.5, r * 0.45);
  };
  coin(16, 26, 10); coin(38, 28, 11); coin(54, 22, 9);
  coin(28, 18, 8); coin(46, 14, 7);
}
function drawMushroom(ctx) {
  fillEll(ctx, "#e5342b", 24, 20, 21.5, 15.5);
  ctx.lineWidth = 3; ctx.strokeStyle = "#9c130b";
  ell(ctx, 24, 20, 21.5, 15.5); ctx.stroke();
  fillEll(ctx, "#ffffff", 12, 13, 5.5, 4.8);
  fillEll(ctx, "#ffffff", 27, 8.5, 6, 5);
  fillEll(ctx, "#ffffff", 38, 17, 4.5, 4);
  fillRR(ctx, "#ffe9c4", 12, 27, 24, 17, 6);
  ctx.lineWidth = 2.5; ctx.strokeStyle = "#d8b078";
  rr(ctx, 12, 27, 24, 17, 6); ctx.stroke();
  fillEll(ctx, "#333333", 18.5, 34, 2.2, 4);
  fillEll(ctx, "#333333", 29.5, 34, 2.2, 4);
}
const TEX = {
  genAll(scene) {
    ["small", "super"].forEach((size) => {
      ["idle", "run1", "run2", "run3", "jump"].forEach((pose) => {
        texCanvas(scene, "mario-" + size + "-" + pose, 48, 64, (ctx) => drawMario(ctx, pose, size === "small"));
      });
    });
    texCanvas(scene, "goomba-1", 56, 48, (ctx) => drawGoomba(ctx, "walk1"));
    texCanvas(scene, "goomba-2", 56, 48, (ctx) => drawGoomba(ctx, "walk2"));
    texCanvas(scene, "goomba-flat", 56, 48, (ctx) => drawGoomba(ctx, "flat"));
    texCanvas(scene, "mushroom", 48, 48, drawMushroom);
    for (let c = 0; c < 4; c++) texCanvas(scene, "coin-" + c, 40, 48, (ctx) => drawCoin(ctx, c));
    texCanvas(scene, "tile-ground", TILE, TILE, drawGround);
    texCanvas(scene, "tile-brick", TILE, TILE, drawBrick);
    texCanvas(scene, "tile-question", TILE, TILE, drawQuestion);
    texCanvas(scene, "tile-used", TILE, TILE, drawUsed);
    texCanvas(scene, "pipe-top", 128, TILE, drawPipeTop);
    texCanvas(scene, "pipe-body", 128, TILE, drawPipeBody);
    texCanvas(scene, "fragment", 28, 22, drawFragment);
    texCanvas(scene, "pole", 16, 640, drawPole);
    texCanvas(scene, "flag", 56, 44, drawFlag);
    texCanvas(scene, "castle", 448, 384, drawCastle);
    texCanvas(scene, "bush", 256, 64, drawBush);
    texCanvas(scene, "shadow", 96, 26, drawShadow);
    texCanvas(scene, "brick-underground", TILE, TILE, drawBrickUnderground);
    texCanvas(scene, "pipe-underground", 128, TILE, drawPipeUnderground);
    texCanvas(scene, "torch-flame", 32, 64, drawTorch);
    texCanvas(scene, "coin-pile", 64, 32, drawCoinPile);
    texCanvas(scene, "cloud-tile", 960, 400, drawCloudTile);
    texCanvas(scene, "hill-tile", 960, 420, drawHillTile);
  }
};

/* soft contact shadow blob, squashed radial gradient */
function drawShadow(ctx, w, h) {
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.scale(1, 0.3);
  const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 46);
  g.addColorStop(0, "rgba(15,25,35,0.5)");
  g.addColorStop(1, "rgba(15,25,35,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
