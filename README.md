# 🐍 Pixel Snake — Game Boy Edition

A classic Snake game with authentic **Game Boy pixel art style**, featuring **dual game modes** and a **world leaderboard**, playable in any modern browser.

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
 │     ▲                    │
 │   ◀ ● ▶      (B) (A)    │
 │     ▼                    │
 │      SELECT  START       │
 └──────────────────────────┘
```

## Game Modes

### 🏆 Standard Mode
- **Fixed** speed (Normal) & map size (320×320)
- All players compete under identical conditions
- Scores count toward the **World Leaderboard**
- Designed for **fair competition**

### 🎮 Wild Mode
- **Customize** speed (Slow / Normal / Fast / Hell) and map size freely
- No restrictions — play however you like
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
2. Avoid hitting the walls or your own body — that's **Game Over**!
3. The longer the snake, the higher the challenge
4. Your score is automatically submitted to the **World Leaderboard** 🏆
5. The home screen shows your **best score** and **world rank** in a stats bubble

### Settings (⚙)

- **Screen Size** — Small / Medium / Large / XL *(Wild mode only)*
- **Game Speed** — Slow / Normal / Fast / Hell 🔥 *(Wild mode only)*
- **Volume** — Adjust retro beep sound effects
- **Language** — 中文 / English (auto-detected from system)

## Features

- 🎨 Authentic Game Boy green palette & pixel aesthetics
- 🏆 **Dual game modes** — Standard (fair) & Wild (free) with separate leaderboards
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
- Canvas 2D rendering
- Node.js + Express + better-sqlite3 (leaderboard backend)
- Docker + nginx reverse proxy with Let's Encrypt SSL

## Project Structure

```
src/
├── index.html              # Main page with Game Boy shell layout
├── css/
│   ├── style.css           # All styles (responsive, GB controls, overlays)
│   └── gameboy.css         # Additional GB styling
└── js/
    ├── game.js             # Main game controller (state machine, dual modes)
    ├── snake.js            # Snake entity
    ├── food.js             # Food spawner
    ├── renderer.js         # Canvas 2D rendering
    ├── controls.js         # Keyboard + D-pad + touch input + input mode tracking
    ├── leaderboard.js      # Device fingerprint & leaderboard API client
    └── utils/
        ├── constants.js    # Game config (speed, colors, grid, mode defaults)
        ├── helpers.js      # Utility functions
        └── i18n.js         # Internationalization (zh/en, auto-detect)
```

## License

MIT
