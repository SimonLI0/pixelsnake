# 🐍 Pixel Snake — Game Boy Edition

A classic Snake game with authentic **Game Boy pixel art style**, playable in any modern browser.

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
 │ │                      │ │
 │ │   ▶ Start Game       │ │
 │ │   🏆 Leaderboard     │ │
 │ │   ⚙ Settings         │ │
 │ └──────────────────────┘ │
 │     ▲                    │
 │   ◀ ● ▶      (B) (A)    │
 │     ▼                    │
 │      SELECT  START       │
 └──────────────────────────┘
```

## How to Play

### Controls

| Input | Action |
|-------|--------|
| **D-pad / Arrow Keys / WASD** | Move the snake |
| **Swipe** (touch screen) | Change direction |
| **A Button / Space** | Boost speed |
| **B Button / Esc** | Pause |
| **START / Enter** | Start / Restart / Resume |
| **SELECT** | Open menu |

### Rules

1. Guide the snake to eat food (red dots) to grow and score points
2. Avoid hitting the walls or your own body — that's **Game Over**!
3. The longer the snake, the higher the challenge
4. Your score is automatically submitted to the **World Leaderboard** 🏆

### Settings (⚙)

- **Screen Size** — Small / Medium / Large / XL
- **Game Speed** — Slow / Normal / Fast / Hell 🔥
- **Volume** — Adjust beep sound effects
- **Language** — 中文 / English (auto-detected from system)

## Features

- 🎨 Authentic Game Boy green palette & pixel aesthetics
- 📱 Fully responsive — works on desktop, mobile, and tablets
- 🕹️ On-screen Game Boy D-pad + A/B/START/SELECT buttons for touch devices
- 🏆 World Leaderboard with device fingerprint identification
- 🌐 Bilingual (Chinese / English) with auto system language detection
- 🔊 Retro square-wave sound effects (Web Audio API)
- 📲 WeChat in-app browser compatible

## Tech Stack

- Pure HTML / CSS / JavaScript (no frameworks, no bundler)
- `var` + IIFE module pattern (no ES modules)
- Web Audio API for sound
- Canvas 2D rendering
- Node.js + Express + better-sqlite3 (leaderboard backend)

## Project Structure

```
src/
├── index.html              # Main page with Game Boy shell layout
├── css/
│   ├── style.css           # All styles (responsive, GB controls, overlays)
│   └── gameboy.css         # Additional GB styling
└── js/
    ├── game.js             # Main game controller (state machine)
    ├── snake.js            # Snake entity
    ├── food.js             # Food spawner
    ├── renderer.js         # Canvas rendering
    ├── controls.js         # Keyboard + D-pad + touch input
    ├── leaderboard.js      # Device fingerprint & API client
    └── utils/
        ├── constants.js    # Game config (speed, colors, grid)
        ├── helpers.js      # Utility functions
        └── i18n.js         # Internationalization module
```

## License

MIT
