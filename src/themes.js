"use strict";
/* themes.js - background environment definitions.
 * Each theme: sky gradient colors + ordered parallax layers
 * (texture key, screen y, scroll factor, draw depth, optional tint).
 * Layer heights are read from the generated textures at runtime.
 * underground / castle / sky carry their spec palettes and are ready
 * for their texture sets when those levels are built.
 */

const THEMES = {

  overworld: {
    name: "overworld-grassland",
    sky: [0x63a4ff, 0xb7dcff],
    sunsetSky: [0xff9a5c, 0xffd27f], /* golden-hour variant, flip when needed */
    layers: [
      { key: "cloud-far-tile", y: 12, factor: 0.08, depth: DEPTH.farClouds },
      { key: "mountain-tile", y: 586, factor: 0.12, depth: DEPTH.mountains },
      { key: "cloud-tile",    y: 24,  factor: 0.15, depth: DEPTH.clouds },
      { key: "hill-tile",     y: 556, factor: 0.40, depth: DEPTH.hills, tint: 0xcfe3f5 },
      { key: "pine-tile",     y: 756, factor: 0.48, depth: DEPTH.pines }
    ]
  },

  underground: {
    name: "underground-cavern",
    sky: [0x1a1030, 0x2d1b4e],
    layers: [
      { key: "cavern-far-tile", y: 500, factor: 0.2, depth: DEPTH.mountains },
      { key: "cavern-mid-tile", y: 520, factor: 0.5, depth: DEPTH.hills }
    ]
  },

  castle: {
    name: "bowsers-lava-castle",
    sky: [0x2a0a0a, 0x571010],
    layers: [
      { key: "castle-far-tile", y: 480, factor: 0.2, depth: DEPTH.mountains },
      { key: "castle-mid-tile", y: 500, factor: 0.6, depth: DEPTH.hills }
    ],
    pendingTextures: true
  },

  sky: {
    name: "sky-fortress-airship",
    sky: [0x2a63c8, 0x8fc3ff],
    layers: [
      { key: "skybank-tile", y: 60,  factor: 0.15, depth: DEPTH.clouds },
      { key: "airship-tile", y: 480, factor: 0.5, depth: DEPTH.hills }
    ],
    pendingTextures: true
  }
};
