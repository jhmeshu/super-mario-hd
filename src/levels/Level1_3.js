"use strict";
/* Level1_3.js - World 1-3 surface, dominated by pipes.
 * Two-way pipe convention:
 *   "P" = plain pipe (decorative)
 *   "U" = up-pipe (press Up to enter; descends player to a different col
 *        on this stage via the U-target map)
 *   "D" = down-pipe (visual; just decorative, since 1-3 stays surface)
 * For simplicity, up-pipes teleport the player horizontally across the
 * level as a fast-travel between two cols; same scene, no fade.
 */

function buildLevel1_3() {
  const COLS = 260, ROWS = 16, GROUND_ROW = 14;
  const grid = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill("."));
  const put = (c, r, ch) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) grid[r][c] = ch; };
  const stairsUp = (c, n) => { for (let i = 0; i < n; i++) for (let r = GROUND_ROW - 1 - i; r < GROUND_ROW; r++) put(c + i, r, "X"); };
  const goomba = (c) => put(c, GROUND_ROW - 1, "G");

  const pits = new Set([150, 151, 152, 158, 159, 160, 166, 167, 168]);
  for (let c = 0; c < COLS; c++) {
    if (!pits.has(c)) { put(c, GROUND_ROW, "X"); put(c, GROUND_ROW + 1, "X"); }
  }

  /* entry wide platform + coin row overhead */
  for (let c = 4; c <= 10; c++) put(c, 11, "X");
  for (let c = 4; c <= 10; c++) put(c, 10, "o");

  /* up-pipe #1 leads to dead-end coin room */
  put(20, GROUND_ROW - 2, "U"); put(21, GROUND_ROW - 1, "B");

  /* down-pipe decorative */
  put(28, GROUND_ROW - 3, "D");

  /* pipe pyramid: 5 pipes of varying heights */
  put(45, GROUND_ROW - 2, "P");
  put(52, GROUND_ROW - 3, "P");
  put(59, GROUND_ROW - 4, "P");
  put(66, GROUND_ROW - 5, "P");
  put(73, GROUND_ROW - 6, "P");
  put(72, 5, "?"); put(72, 6, "m");
  put(72, 7, "o"); put(73, 7, "o");

  /* koopa-shaped goomba patrol: 4 spaced exactly 3 cols apart */
  goomba(88); goomba(91); goomba(94); goomba(97);

  /* brick ceiling section */
  for (let c = 105; c <= 116; c++) put(c, 7, "B");
  put(108, 7, "?"); put(111, 7, "?");

  /* triple-pit gauntlet (3 pits in a row, coin trails over them) */
  put(148, 9, "o"); put(149, 9, "o");
  put(156, 9, "o"); put(157, 9, "o");
  put(164, 9, "o"); put(165, 9, "o");
  put(170, 12, "o"); put(171, 12, "o");

  /* up-pipe #2 leads to mid-air power-up shortcut */
  put(182, GROUND_ROW - 2, "U");

  /* up-pipe #3 = exit hint (decorative) */
  put(192, GROUND_ROW - 3, "P");

  /* final ascent */
  goomba(205);
  stairsUp(210, 10);
  put(214, 8, "?"); put(214, 8, "m");
  put(218, 8, "?");

  put(225, GROUND_ROW - 1, "F");
  put(232, GROUND_ROW - 1, "C");

  return {
    rows: grid.map((row) => row.join("")),
    cols: COLS,
    rowsCount: ROWS,
    groundRow: GROUND_ROW,
    name: "1-3",
    worldLabel: "1-3",
    time: LEVEL_TIME,
    theme: "overworld",
    decor: { bushes: [4, 35, 75, 102, 130, 175, 200] },
    upPipes: [
      { col: 20, destCol: 35 },
      { col: 182, destCol: 195 }
    ],
    next: "1-4"
  };
}
const LEVEL1_3 = buildLevel1_3();