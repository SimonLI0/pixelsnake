# 🐍 Pixel Snake — Game Boy Edition

A classic Snake game with authentic **Game Boy pixel art style**, featuring **dual game modes**, a **world leaderboard**, **skin system**, and **haptic feedback**, playable in any modern browser.

![Game Boy Style](https://img.shields.io/badge/Style-Game%20Boy-9BBC0F?style=flat-square&labelColor=0F380F)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-306230?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-中文%20%7C%20English-8BAC0F?style=flat-square)

## 🎮 Play Now

**👉 [https://simonli0.github.io/pixelsnake/](https://simonli0.github.io/pixelsnake/)**

## Screenshots

```
 ┌──────────────────────────┐
 │  DOT MATRIX WITH STEREO  │
 │ ┌──────────────────────┐ │
 │ │   🐍 PIXEL SNAKE     │ │
 │ │   👤 Player  🏅 Best │ │
 │ │                      │ │
 │ │  🏆 Standard  ❓     │ │
 │ │  🎮 Wild      ❓     │ │
 │ │  🏆 Leaderboard      │ │
 │ │  ⚙ Settings          │ │
 │ └──────────────────────┘ │
 │      SELECT  START       │
 │     ▲                    │
 │   ◀ ● ▶      (B) (A)    │
 │     ▼                    │
 └──────────────────────────┘
```

## Game Modes

### 🏆 Standard Mode
- **Fixed** speed (Normal) & map size (320×320)
- All players compete under identical conditions
- Walls are deadly — hitting them ends the game
- Scores count toward the **World Leaderboard**
- Designed for **fair competition**

### 🎮 Wild Mode
- **Customize** speed (Slow / Normal / Fast / Hell) and map size freely
- **No walls** — the snake wraps around to the other side!
- Scores tracked on a **separate** leaderboard
- Pure fun, no pressure

> Tap the **❓** icon next to each mode button for a quick description.

## How to Play

### Controls

| Input | Action |
|-------|--------|
| **D-pad / Arrow Keys / WASD** | Move the snake |
| **Swipe** (touch screen) | Change direction |
| **A Button / Hold Space** | Boost speed (hold) |
| **B Button / Esc** | Pause / Resume |
| **START / Enter** | Start / Restart / Resume |
| **SELECT** | Open menu |

### Rules

1. Guide the snake to eat food (red dots) to grow and score points (+10 each)
2. **Standard Mode**: Avoid walls and your own body — that's **Game Over**!
3. **Wild Mode**: No walls! The snake wraps around, but self-collision is still fatal
4. The longer the snake, the higher the challenge
5. Your score is automatically submitted to the **World Leaderboard** 🏆
6. The home screen shows your **best score** and **world rank** in a stats bubble

### Settings (⚙)

- **Screen Size** — Small / Medium / Large / XL *(Wild mode only)*
- **Game Speed** — Slow / Normal / Fast / Hell 🔥 *(Wild mode only)*
- **Volume** — Adjust retro beep sound effects
- **Language** — 中文 / English (auto-detected from system)
- **Skin** — 5 built-in themes (Classic / Neon / Retro NES / Dark / Ocean)
- **Vibration** — Haptic feedback on/off *(Android only, auto-hidden on unsupported devices)*

## Features

- 🎨 **Skin system** — 5 built-in themes with sprite-sheet rendering (snake head/body/tail/food), customizable via palette or external PNG
- 🏆 **Dual game modes** — Standard (walls, fair) & Wild (wrap-around, free) with separate leaderboards
- 📳 **Haptic feedback** — Vibration on eat / game over / new record / wall wrap (Android)
- 📱 Fully responsive — works on desktop, mobile, and tablets
- 🕹️ On-screen Game Boy D-pad + A/B/START/SELECT buttons for touch devices
- 🏆 World Leaderboard with device fingerprint identification
- 📊 Stats bubble on home screen (best score + world rank)
- 🌐 Bilingual (Chinese / English) with auto system language detection
- 🔊 Retro square-wave sound effects (Web Audio API)
- 📲 WeChat in-app browser compatible
- 🎯 Input mode tracking (keyboard vs. touch) for future fairness features

## Tech Stack

- Pure HTML / CSS / JavaScript (no frameworks, no bundler)
- `var` + IIFE module pattern (no ES modules)
- Web Audio API for sound
- Vibration API for haptic feedback
- Canvas 2D rendering with sprite sheets
- Node.js + Express + better-sqlite3 (leaderboard backend)
- Docker + nginx reverse proxy with Let's Encrypt SSL

## Project Structure

```
src/
├── index.html              # Main page with Game Boy shell layout
├── css/
│   ├── style.css           # All styles (responsive, GB controls, overlays)
│   └── gameboy.css         # Additional GB styling
├── assets/
│   └── skins/
│       └── SKIN_GUIDE.md   # Custom skin template guide (112×48 PNG)
└── js/
    ├── game.js             # Main game controller (state machine, dual modes)
    ├── snake.js            # Snake entity (wall wrap in wild mode)
    ├── food.js             # Food spawner
    ├── renderer.js         # Canvas 2D rendering with sprite sheet support
    ├── controls.js         # Keyboard + D-pad + touch input + input mode tracking
    ├── leaderboard.js      # Device fingerprint & leaderboard API client
    └── utils/
        ├── constants.js    # Game config (speed, colors, grid, mode defaults)
        ├── helpers.js      # Utility functions
        ├── i18n.js         # Internationalization (zh/en, auto-detect)
        ├── spritesheet.js  # Skin system (palette → sprite sheet generation)
        └── vibration.js    # Haptic feedback (Vibration API wrapper)
```

## Custom Skins

See [`assets/skins/SKIN_GUIDE.md`](assets/skins/SKIN_GUIDE.md) for how to create custom skins:

- **Code method**: Add a color palette to the `SKINS` object in `spritesheet.js`
- **PNG method**: Create a 112×48 sprite sheet (7×3 grid, 16×16 cells) and load via `SpriteSheet.loadCustom(url)`

## License

MIT
