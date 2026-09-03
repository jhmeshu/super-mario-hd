"use strict";
/* Level1_2.js - World 1-2 surface. Coin arc → goomba trio → brick pillars →
 * pit with mid-air coin reward → ? block ceiling → ambush stairs → flagpyramid.
 * Teaches pit-jumping; ~230 cols. */

function buildLevel1_2() {
  const COLS = 230, ROWS = 16, GROUND_ROW = 14;
  const grid = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill("."));
  const put = (c, r, ch) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) grid[r][c] = ch; };
  const stairsUp = (c, n) => { for (let i = 0; i < n; i++) for (let r = GROUND_ROW - 1 - i; r < GROUND_ROW; r++) put(c + i, r, "X"); };
  const stairsDown = (c, n) => { for (let i = 0; i < n; i++) for (let r = GROUND_ROW - n + i; r < GROUND_ROW; r++) put(c + i, r, "X"); };
  const pipe = (c, h) => put(c, GROUND_ROW - h, "P");
  const goomba = (c) => put(c, GROUND_ROW - 1, "G");

  /* pit cols (no ground) */
  const pits = new Set([60, 61, 105, 106, 107, 175, 176]);
  for (let c = 0; c < COLS; c++) {
    if (!pits.has(c)) { put(c, GROUND_ROW, "X"); put(c, GROUND_ROW + 1, "X"); }
  }

  /* entry coin arc */
  for (let i = 0; i < 12; i++) put(8 + i, 9, "o");
  put(12, 10, "o"); put(13, 11, "o");

  /* goomba trio */
  goomba(22); goomba(23); goomba(24);

  /* brick pillar cluster 4-tile tallest */
  for (let i = 0; i < 4; i++) for (let r = 10; r < 14; r++) put(30 + i, r, "B");
  for (let i = 0; i < 3; i++) for (let r = 11; r < 14; r++) put(34 + i, r, "B");
  for (let i = 0; i < 2; i++) for (let r = 12; r < 14; r++) put(37 + i, r, "B");
  put(31, 8, "?"); put(31, 9, "m");

  /* mid-air coin over first pit */
  put(58, 9, "o"); put(59, 9, "o"); put(62, 9, "o"); put(63, 9, "o");

  /* ? block ceiling row */
  ["?", "?", "?", "?"].forEach((ch, i) => put(70 + i, 7, ch));
  put(71, 7, "m");

  /* goomba on platform over second pit */
  goomba(108);

  /* ambush stairs */
  stairsDown(118, 4);
  goomba(120); goomba(121);

  /* pipe pyramid */
  pipe(140, 2); pipe(145, 3); pipe(151, 4);
  put(150, 7, "o"); put(151, 7, "o"); put(152, 7, "o");
  goomba(148);

  /* final stretch — flag pyramid */
  goomba(185); goomba(187);
  stairsUp(195, 8);

  /* flagpole + castle */
  put(208, GROUND_ROW - 1, "F");
  put(214, GROUND_ROW - 1, "C");

  return {
    rows: grid.map((row) => row.join("")),
    cols: COLS,
    rowsCount: ROWS,
    groundRow: GROUND_ROW,
    name: "1-2",
    worldLabel: "1-2",
    time: LEVEL_TIME,
    theme: "overworld",
    decor: { bushes: [4, 26, 50, 80, 115, 160, 190] },
    next: "1-3"
  };
}
const LEVEL1_2 = buildLevel1_2();