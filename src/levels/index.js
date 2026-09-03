"use strict";
/* levels/index.js - single registry of every level descriptor. New levels
 * register here so GameScene can look them up by id without growing a
 * hard-coded switch. */

const LEVELS = {
  "1-1": LEVEL1_1,
  "1-1U": LEVEL1_1U,
  "1-2": LEVEL1_2,
  "1-3": LEVEL1_3,
  "1-4": LEVEL1_4
};

function levelById(id) {
  return LEVELS[id] || LEVELS["1-1"];
}