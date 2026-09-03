"use strict";
/* Level1_1.js - World 1-1 layout (160 cols), built programmatically.
 * Legend: X solid, B brick, ? question(coin), m question(mushroom),
 * P pipe top (two tiles wide, extends to ground), G goomba, o coin,
 * F flagpole base, C castle anchor. warpPipe marks the DOWN-entry pipe. */

function buildLevel1_1() {
  const COLS = 160, ROWS = 16, GROUND_ROW = 14;
  const grid = [];
  for (let r = 0; r < ROWS; r++) grid.push(new Array(COLS).fill("."));
  const put = (c, r, ch) => { if (c >= 0 && c < COLS && r >= 0 && r < ROWS) grid[r][c] = ch; };
  const stairsUp = (c, n) => { for (let i = 0; i < n; i++) for (let r = GROUND_ROW - 1 - i; r < GROUND_ROW; r++) put(c + i, r, "X"); };
  const stairsDown = (c, n) => { for (let i = 0; i < n; i++) for (let r = GROUND_ROW - n + i; r < GROUND_ROW; r++) put(c + i, r, "X"); };
  const pipe = (c, h) => put(c, GROUND_ROW - h, "P");
  const goomba = (c) => put(c, GROUND_ROW - 1, "G");

  const pits = new Set([69, 70, 131, 132]);
  for (let c = 0; c < COLS; c++) {
    if (!pits.has(c)) { put(c, GROUND_ROW, "X"); put(c, GROUND_ROW + 1, "X"); }
  }

  put(18, 10, "?");
  goomba(21);
  ["?", "B", "m", "B", "?"].forEach((ch, i) => put(24 + i, 10, ch));
  ["B", "?", "B"].forEach((ch, i) => put(30 + i, 6, ch));
  pipe(36, 2); pipe(42, 3); pipe(50, 4);
  put(49, 8, "o"); put(50, 8, "o"); put(51, 8, "o"); put(50, 7, "o");
  goomba(40); goomba(47); goomba(48);
  ["B", "B", "m", "B"].forEach((ch, i) => put(56 + i, 10, ch));
  ["B", "B", "?", "B"].forEach((ch, i) => put(58 + i, 6, ch));
  goomba(62); goomba(64);
  goomba(74); goomba(76); goomba(81);
  put(79, 10, "?");
  ["B", "?", "B"].forEach((ch, i) => put(83 + i, 10, ch));
  put(84, 7, "o");
  stairsUp(88, 4);
  stairsDown(92, 4);
  stairsUp(97, 8);

  /* extended stretch */
  put(108, 10, "?");
  pipe(112, 3);
  goomba(110); goomba(118); goomba(120);
  put(115, 8, "o"); put(116, 8, "o"); put(117, 8, "o");
  ["B", "?", "B", "B", "?"].forEach((ch, i) => put(122 + i, 10, ch));
  put(129, 8, "B");
  ["B", "B", "B", "B", "B"].forEach((ch, i) => put(134 + i, 6, ch));
  put(135, 5, "o"); put(136, 5, "o"); put(137, 5, "o");
  goomba(135); goomba(137);

  put(146, GROUND_ROW - 1, "F");
  put(150, GROUND_ROW - 1, "C");

  return {
    rows: grid.map((row) => row.join("")),
    cols: COLS,
    rowsCount: ROWS,
    groundRow: GROUND_ROW,
    name: "1-1",
    time: LEVEL_TIME,
    decor: { bushes: [8, 19, 52, 78, 105, 136] },
    warpPipe: { col: 42, scene: "BonusScene", returnXCol: 72 },
    warpPipes: [
      { col: 50, scene: "UndergroundScene", returnXCol: 50, levelId: "1-1U" }
    ],
    next: "1-2"
  };
}
const LEVEL1_1 = buildLevel1_1();
