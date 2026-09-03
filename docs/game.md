# 🍄 Classic HD 2D Platformer Game Specification & Prompt Guide

This document provides a complete technical specification, visual references, and AI prompts designed to build a high-definition 2D side-scrolling platformer with classic stage mechanics.

---

## 📸 1. Visual Direction & Style References

### 🗺️ World 1-1: Overworld Grassland Stage
![World 1-1 HD Screenshot](watermarked_img_7176683748019080705.jpg)
* **Visual Target:** Bright, vibrant colors, rich green hills, soft atmospheric depth, polished block textures, clean crisp lighting while maintaining classic grid alignment.*

---

### 🎨 Character & Tile Sprite Sheet Concept
![Sprite Sheet Assets](watermarked_img_9882665083163846878.jpg)
* **Asset Requirements:** 2D HD vector-like sprites (PNG format with transparent background), high frame-rate animation sequences for running, jumping, squatting, and power-up transformations.*

---

### 🌋 World 1-2: Underground & Lava Castle Stage
![World 1-2 Underground Stage](watermarked_img_12976932715031978725.jpg)
* **Visual Target:** Deep blues, dark stone textures, glowing ambient lava reflections, dynamic lighting around question blocks and fire hazards.*

---

## ⚙️ 2. Core Game Architecture Specifications

```json
{
  "game_engine": "Phaser 3 / PixiJS / Unity 2D",
  "resolution": {
    "viewport_width": 1920,
    "viewport_height": 1080,
    "target_fps": 60,
    "tile_size": 64
  },
  "physics": {
    "gravity_y": 1200,
    "player_move_speed": 300,
    "player_dash_speed": 500,
    "jump_velocity": -650,
    "bounce_velocity": -400
  }
}
```

---

## 🕹️ 3. Stage 1-1 Map Design (Tilemap Matrix Schema)

Use the grid key below to construct Stage 1-1 using Tiled or programmatic array builders:

* `.` = Empty Air
* `B` = Brick Block (Breakable when Super)
* `?` = Question Block (Contains Coin/Power-up)
* `P` = Green Warp Pipe
* `G` = Goomba Enemy Spawn point
* `X` = Solid Ground Block
* `F` = End-Level Flagpole

```text
Row 00 | . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
Row 01 | . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
Row 02 | . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
Row 03 | . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . F
Row 04 | . . . . . . . . ? B ? B ? . . . . . . . . . . . . . . . . . . . . . . F
Row 05 | . . . . . . . . . . . . . . . . . . . . . . . . P . . . . . . . . . . F
Row 06 | . . . . G . . . . . . . . . G . . . P . . . . . P . . . . . . G . . . F
Row 07 | X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X X
```

---

## 🤖 4. Master AI Coding Prompt (Copy & Paste for AI Builders)

> **Prompt for Cursor / ChatGPT / Claude:**
> 
> "I am building an HD 2D side-scrolling platformer game in JavaScript (Phaser 3) based on classic Super Mario 1-1 mechanics.
> 
> ### Key Specifications:
> 1. **Physics & Movement:** Implement tight platformer controls with acceleration, deceleration, variable jump height (higher jump when button is held), ground collision detection, and enemy stomping physics.
> 2. **Block Mechanics:**
>    - `Question Block`: Spawns a moving coin or mushroom on collision from underneath, then switches to an empty block state.
>    - `Brick Block`: Bounces slightly when Small Mario hits it; breaks into particle fragments if Super Mario hits it.
> 3. **Enemy Mechanics:** Goomba walks left continuously, turns around upon hitting walls/pipes, damages Mario on side contact, and flattens/dies when stomped on top.
> 4. **Camera:** Smooth horizontal tracking camera with dead-zone boundaries that prevents moving backwards past the screen width.
> 5. **Visual Style:** High definition 2D layout utilizing tilemaps at 64x64 grid size with Parallax background scrolling (Clouds: 0.2x speed, Hills: 0.5x speed, Foreground: 1.0x speed).
> 
> Please generate modular code structure containing `BootScene.js`, `GameScene.js`, `Player.js`, and `Enemy.js`."
