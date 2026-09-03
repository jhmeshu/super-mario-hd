"use strict";
/* Level1_1U.js - underground bonus off the 3rd pipe in World 1-1.
 * ~30 cols of enclosed brick cavern; coin row, 3 goombas, ? block chain,
 * choice junction, coin-pile dead-end, exit pipe teleports player back
 * to 1-1 with a +200 time bonus. */

function buildLevel1_1U() {
  const COLS = 30, ROWS = 16, GROUND_ROW = 14;
  const grid = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill("."));
  const put = (c, r, ch) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) grid[r][c] = ch; };
  const brick = (c, r) => put(c, r, "X");
  const question = (c, r, ch) => put(c, r, ch || "?");
  const coin = (c, r) => put(c, r, "o");

  /* ceiling + floor + side walls */
  for (let c = 0; c < COLS; c++) {
    put(c, 2, "X"); put(c, 3, "X");
    put(c, GROUND_ROW, "X"); put(c, GROUND_ROW + 1, "X");
  }

  /* entry platform: solid brick ceiling opens up to a landing pad */
  for (let c = 4; c < COLS - 1; c++) put(c, 6, "X");
  for (let c = 4; c < COLS - 1; c++) put(c, 7, "X");

  /* coin row overhead */
  for (let c = 4; c <= 11; c++) coin(c, 5);

  /* open cavern: ceiling high, 3 ? blocks, mushroom spawns in */
  question(13, 10);
  question(14, 10, "m");
  question(15, 10);
  brick(16, 10);

  /* left dead-end with coin pile */
  for (let c = 5; c <= 7; c++) brick(c, 11);
  put(6, 11, "p");

  /* goomba trio on the corridor */
  put(18, 13, "G");
  put(21, 13, "G");

  /* right dead-end with coin pile */
  for (let c = 24; c <= 26; c++) brick(c, 11);
  put(25, 11, "p");

  /* torch placements (decorative; still solid brick beneath) */
  put(4, 11, "T"); put(11, 11, "T"); put(20, 11, "T"); put(28, 11, "T");

  return {
    rows: grid.map((row) => row.join("")),
    cols: COLS,
    rowsCount: ROWS,
    groundRow: GROUND_ROW,
    name: "1-1U",
    worldLabel: "1-1",
    time: LEVEL_TIME,
    theme: "underground",
    spawnCol: 4,
    exitCol: COLS - 2
  };
}
const LEVEL1_1U = buildLevel1_1U();