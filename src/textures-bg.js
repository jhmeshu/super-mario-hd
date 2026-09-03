"use strict";
/* textures-bg.js - extra scenery painters for themed backgrounds.
 * Loaded after textures.js; wraps TEX.genAll to register the additional
 * keys without modifying the base factory. */

function drawMountains(ctx, w, h) {
  const range = (pts, color) => {
    ctx.beginPath();
    ctx.moveTo(0, h);
    pts.forEach((pt) => ctx.lineTo(pt[0], pt[1]));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  range([[0, 150], [90, 70], [170, 140], [260, 50], [360, 150], [450, 95], [540, 160], [650, 45], [760, 150], [850, 100], [950, 165], [1040, 60], [1130, 140], [1200, 150]], "#93a7c9");
  range([[0, 220], [110, 130], [230, 205], [340, 115], [470, 215], [580, 155], [700, 225], [820, 120], [930, 210], [1050, 145], [1140, 215], [1200, 220]], "#6f87b0");
  [[110, 130], [340, 115], [820, 120], [1050, 145]].forEach((p) => {
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.lineTo(p[0] - 15, p[1] + 24);
    ctx.lineTo(p[0] - 6, p[1] + 16);
    ctx.lineTo(p[0], p[1] + 22);
    ctx.lineTo(p[0] + 7, p[1] + 15);
    ctx.lineTo(p[0] + 15, p[1] + 24);
    ctx.closePath();
    ctx.fillStyle = "#eef4fb";
    ctx.fill();
  });
}

function drawPines(ctx, w, h) {
  const pine = (x, ht, color) => {
    ctx.fillStyle = "#5a4632";
    ctx.fillRect(x - 4, h - 12, 8, 12);
    ctx.beginPath();
    ctx.moveTo(x, h - ht);
    ctx.lineTo(x - ht * 0.42, h - 10);
    ctx.lineTo(x + ht * 0.42, h - 10);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  const shroom = (x, r) => {
    ctx.fillStyle = "#8f83b8";
    ctx.fillRect(x - r * 0.28, h - r * 0.9, r * 0.56, r * 0.9);
    ell(ctx, x, h - r * 0.9, r, r * 0.72);
    ctx.fillStyle = "#a99ed2";
    ctx.fill();
  };
  pine(90, 118, "#24523a");
  pine(240, 128, "#24523a");
  pine(420, 115, "#24523a");
  pine(600, 125, "#24523a");
  pine(760, 112, "#24523a");
  pine(980, 122, "#24523a");
  pine(1120, 116, "#24523a");
  shroom(330, 46);
  shroom(1030, 38);
  pine(30, 92, "#2e6b46");
  pine(160, 84, "#2e6b46");
  pine(280, 96, "#2e6b46");
  pine(500, 88, "#2e6b46");
  pine(640, 94, "#2e6b46");
  pine(800, 86, "#2e6b46");
  pine(900, 97, "#2e6b46");
  pine(1080, 90, "#2e6b46");
}

/* extend the base factory with the themed scenery keys */
const _baseGenAll = TEX.genAll;
TEX.genAll = function (scene) {
  _baseGenAll(scene);
  texCanvas(scene, "mountain-tile", 1200, 320, (ctx) => drawMountains(ctx, 1200, 320));
  texCanvas(scene, "pine-tile", 1200, 140, (ctx) => drawPines(ctx, 1200, 140));
    scene.textures.remove("cloud-tile");
    texCanvas(scene, "cloud-tile", 960, 400, (ctx) => drawRichClouds(ctx, 960, 400));
    texCanvas(scene, "cloud-far-tile", 960, 300, (ctx) => drawFarClouds(ctx, 960, 300));
    texCanvas(scene, "bird-1", 28, 16, (ctx) => drawBird(ctx, 28, 16, 0));
    texCanvas(scene, "bird-2", 28, 16, (ctx) => drawBird(ctx, 28, 16, 1));
    texCanvas(scene, "cavern-far-tile", 1200, 360, (ctx) => drawCavernFar(ctx, 1200, 360));
    texCanvas(scene, "cavern-mid-tile", 1200, 260, (ctx) => drawStalactites(ctx, 1200, 260));
    texCanvas(scene, "lava-tile", 256, 64, (ctx) => drawLava(ctx, 256, 64));
};

/* tiny flapping bird silhouette, two wing frames, faces left */
function drawBird(ctx, w, h, frame) {
  const C = "#232833";
  ell(ctx, 14, 10, 7, 3.5); ctx.fillStyle = C; ctx.fill();
  fillEll(ctx, C, 8, 8, 3.2, 3.2);
  ctx.beginPath(); ctx.moveTo(5.5, 7.5); ctx.lineTo(1, 6.8); ctx.lineTo(5.5, 9.5); ctx.closePath(); ctx.fillStyle = C; ctx.fill();
  ctx.beginPath(); ctx.moveTo(20, 9); ctx.lineTo(27, 5.5); ctx.lineTo(27, 12); ctx.closePath(); ctx.fillStyle = C; ctx.fill();
  fillEll(ctx, "#ffffff", 7.2, 7, 0.9, 0.9);
  ctx.beginPath();
  if (frame === 0) { ctx.moveTo(12, 9); ctx.lineTo(16, 1); ctx.lineTo(21, 8); }
  else { ctx.moveTo(12, 10); ctx.lineTo(17, 15); ctx.lineTo(22, 11); }
  ctx.closePath(); ctx.fillStyle = C; ctx.fill();
}
