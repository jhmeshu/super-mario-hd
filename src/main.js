"use strict";
/* main.js - Phaser game bootstrap (1920x1080, FIT scaling, arcade physics). */

window.addEventListener("load", () => {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    width: GAME_W,
    height: GAME_H,
    backgroundColor: "#63a4ff",
    antialias: true,
    physics: { default: "arcade", arcade: { gravity: { y: PHYS.gravity }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    audio: { noAudio: true },
    scene: [BootScene, GameScene, UndergroundScene]
  });
});
