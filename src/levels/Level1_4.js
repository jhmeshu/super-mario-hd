"use strict";
/* Level1_4.js - World 1-4 sky fortress. Sky-themed, floating brick islands
 * over cloud voids; bridges span gaps; vertical staircase ascent; final
 * dash gauntlet to the flagpyramid and fortress castle.
 *
 * Uses THEMES.sky (existing). No new cell types — pits/gaps handled by
 * simply omitting ground rows under the floating islands. */

function buildLevel1_4() {
  const COLS = 290, ROWS = 16, GROUND_ROW = 14;
  const grid = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill("."));
  const put = (c, r, ch) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) grid[r][c] = ch; };
  const stairsUp = (c, n) => { for (let i = 0; i < n; i++) for (let r = GROUND_ROW - 1 - i; r < GROUND_ROW; r++) put(c + i, r, "X"); };
  const goomba = (c, r) => put(c, r !== undefined ? r : GROUND_ROW - 1, "G");
  const island = (c, span) => { for (let i = 0; i < span; i++) put(c + i, GROUND_ROW, "X"); };

  /* entry island — small 4-tile */
  island(2, 4);
  goomba(4);

  /* bridge to island 2 */
  for (let c = 6; c <= 9; c++) put(c, GROUND_ROW, "X");
  island(10, 3);
  goomba(12);

  /* mid-air ? block across wide gap */
  island(14, 4);
  put(22, 11, "?");
  put(24, 11, "?"); put(25, 11, "?");
  put(26, 11, "?"); put(27, 11, "o");

  /* vertical floating tower */
  island(36, 5); goomba(38);
  for (let i = 0; i < 3; i++) island(48 + i * 0, 4); // (placeholder; replaced below)
  /* stair climb: alternating left/right */
  put(48, GROUND_ROW - 4, "X"); put(48, GROUND_ROW - 3, "X"); put(48, GROUND_ROW - 2, "X"); put(48, GROUND_ROW - 1, "X");
  put(52, GROUND_ROW - 5, "X"); put(52, GROUND_ROW - 4, "X"); put(52, GROUND_ROW - 3, "X"); put(52, GROUND_ROW - 2, "X"); put(52, GROUND_ROW - 1, "X");
  put(56, GROUND_ROW - 6, "X"); put(56, GROUND_ROW - 5, "X"); put(56, GROUND_ROW - 4, "X"); put(56, GROUND_ROW - 3, "X"); put(56, GROUND_ROW - 2, "X"); put(56, GROUND_ROW - 1, "X");
  put(60, GROUND_ROW - 5, "X"); put(60, GROUND_ROW - 4, "X"); put(60, GROUND_ROW - 3, "X"); put(60, GROUND_ROW - 2, "X"); put(60, GROUND_ROW - 1, "X");
  put(64, GROUND_ROW - 4, "X"); put(64, GROUND_ROW - 3, "X"); put(64, GROUND_ROW - 2, "X"); put(64, GROUND_ROW - 1, "X");
  put(67, GROUND_ROW - 1, "X");
  put(68, GROUND_ROW - 1, "X");
  goomba(56, 9); goomba(60, 10);

  /* power-up block at top */
  put(56, 7, "m");

  /* longer bridge section */
  for (let c = 76; c <= 110; c++) put(c, GROUND_ROW, "X");
  goomba(82); goomba(85); goomba(88); goomba(91); goomba(94);

  /* dash gauntlet: long bridge with 5 goombas */
  for (let c = 116; c <= 150; c++) put(c, GROUND_ROW, "X");
  goomba(122); goomba(126); goomba(130); goomba(134); goomba(138);

  /* bridge gap to fortress island */
  for (let c = 155; c <= 158; c++) put(c, GROUND_ROW, "X");
  island(160, 6);
  goomba(162);

  /* fortress approach stair path */
  for (let c = 170; c <= 200; c++) put(c, GROUND_ROW, "X");
  stairsUp(195, 5);
  put(198, 9, "?"); put(199, 9, "m");

  /* flagpole on top of stair-exit */
  put(215, GROUND_ROW - 1, "F");

  /* fortress-style castle (reuses 'C') */
  put(225, GROUND_ROW - 1, "C");

  return {
    rows: grid.map((row) => row.join("")),
    cols: COLS,
    rowsCount: ROWS,
    groundRow: GROUND_ROW,
    name: "1-4",
    worldLabel: "1-4",
    time: LEVEL_TIME,
    theme: "sky",
    decor: { bushes: [] },
    /* No next → flagpole triggers COURSE CLEAR */
    isFinal: true
  };
}
const LEVEL1_4 = buildLevel1_4();