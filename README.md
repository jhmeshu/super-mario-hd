# Super Mario HD

An HD 2D side-scrolling platformer built with Phaser 3, recreating the mechanics of Super
Mario Bros. World 1-1 with crisp procedurally drawn vector graphics (zero asset files).

## Run it

- Easiest: double-click **index.html**. Phaser is bundled locally in lib/, so it works offline.
- Or serve it: `npm start` then open http://localhost:8080 (or `python3 -m http.server 8080`).

## Controls

| Action | Keys |
|---|---|
| Move | Arrow keys or A / D |
| Jump | Space / W / Z (hold for a higher jump) |
| Dash | Shift or X |
| Restart level | R |
| Mute sound | M |

## Mechanics

- Acceleration movement with skid-free deceleration, variable jump height, coyote time and jump buffering.
- Question blocks bump from below, release a coin or mushroom once, then become used blocks.
- Bricks bounce when Small Mario headbutts them and shatter into spinning fragments when Super Mario does it.
- Goombas patrol leftward, turn at walls, flatten when stomped, and get launched if the block under them is bumped.
- The mushroom rises out of its block and walks; collecting it turns Small Mario into Super Mario; taking damage shrinks him instead of killing.
- Camera: horizontal dead-zone follow with smoothing; it never scrolls backward, and the player cannot leave the left edge of the screen.
- Parallax depth: clouds drift at 0.1x and hazed hills sit far back at 0.3x; gameplay stays a crisp 1.0x foreground with soft contact shadows grounding every character.
- HUD: score, coins (100 coins grant an extra life), WORLD 1-1, time counting down from 348 (zero = death), lives.
- Flagpole ending: grab the pole, slide down, auto-walk into the castle door for the time bonus, COURSE CLEAR.

## Project structure

```
index.html            page shell + script order
lib/phaser.min.js     Phaser 3.80.1 (local copy)
src/config.js         every tuning constant
src/sfx.js            WebAudio synthesized sound effects
src/textures.js       procedural HD texture factory
src/Blocks.js         QuestionBlock + BrickBlock
src/PowerUp.js        Coin, CoinPopup, Mushroom
src/Player.js         Mario movement/jump/states
src/Enemy.js          Goomba AI
src/levels/Level1_1.js programmatic World 1-1 tilemap
src/BootScene.js      texture generation + title screen
src/GameScene.js      gameplay scene, camera, HUD, collisions
src/main.js           Phaser.Game bootstrap
```

## Tuning notes vs docs/game.md

docs/game.md lists gravity 1200 / jump -650. Those literals give a ~176px (2.75 tile) jump apex,
which cannot reach the classic 4-tile-high block rows, so they were retuned to gravity 1400 /
jump -920 (~4.7 tile apex). Move speed 300, dash speed 500 and stomp bounce behavior follow the doc.
All values live in src/config.js for easy tweaking.

## Swapping in real art later

Every texture is created in src/textures.js under stable keys (mario-small-idle, goomba-1,
tile-question, pipe-top, castle, ...). To use PNG sprite sheets, register identically named
texture keys there; no gameplay code needs to change.
