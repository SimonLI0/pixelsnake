# 🎨 Pixel Snake — Skin Creation Guide

Create a single **112×48 pixel PNG** to reskin the entire game — just like Minecraft texture packs!

## Sprite Sheet Specification

| Property | Value |
|----------|-------|
| **Image format** | PNG (transparency supported) |
| **Tile size** | 16 × 16 pixels |
| **Grid** | 7 columns × 3 rows |
| **Total size** | 112 × 48 pixels |

## Layout Map

```
  Col:    0         1          2          3          4          5          6
       ┌─────────┬──────────┬──────────┬──────────┬─────────┬─────────┬─────────┐
  R0   │ head_up │ head_rt  │ head_dn  │ head_lt  │ body_h  │ body_v  │ turn_tr │
       ├─────────┼──────────┼──────────┼──────────┼─────────┼─────────┼─────────┤
  R1   │ turn_tl │ turn_br  │ turn_bl  │ tail_up  │ tail_rt │ tail_dn │ tail_lt │
       ├─────────┼──────────┼──────────┼──────────┼─────────┼─────────┼─────────┤
  R2   │  food   │(reserved)│(reserved)│(reserved)│(reserve)│(reserve)│(reserve)│
       └─────────┴──────────┴──────────┴──────────┴─────────┴─────────┴─────────┘
```

### Tile Descriptions

#### Row 0 — Snake Head & Body

| Tile | Position | Description |
|------|----------|-------------|
| `head_up` | (0,0) | Head facing **up** — eyes at top |
| `head_right` | (1,0) | Head facing **right** — eyes at right |
| `head_down` | (2,0) | Head facing **down** — eyes at bottom |
| `head_left` | (3,0) | Head facing **left** — eyes at left |
| `body_h` | (4,0) | **Horizontal** straight body segment |
| `body_v` | (5,0) | **Vertical** straight body segment |
| `turn_tr` | (6,0) | Turn connecting **Top ↔ Right** edges |

#### Row 1 — Turns & Tail

| Tile | Position | Description |
|------|----------|-------------|
| `turn_tl` | (0,1) | Turn connecting **Top ↔ Left** edges |
| `turn_br` | (1,1) | Turn connecting **Bottom ↔ Right** edges |
| `turn_bl` | (2,1) | Turn connecting **Bottom ↔ Left** edges |
| `tail_up` | (3,1) | Tail with body above (taper ↓) |
| `tail_right` | (4,1) | Tail with body to the right (taper ←) |
| `tail_down` | (5,1) | Tail with body below (taper ↑) |
| `tail_left` | (6,1) | Tail with body to the left (taper →) |

#### Row 2 — Food & Reserved

| Tile | Position | Description |
|------|----------|-------------|
| `food` | (0,2) | Food item (apple, dot, etc.) |
| *(reserved)* | (1-6,2) | Reserved for future items |

## How Tiles Connect

Body segments use a **1px gap** between tiles on non-connecting sides to create visual separation:

```
   body_h example:
   ┌────────────────┐
   │ 1px gap (top)  │
   │████████████████│  ← full width, connects left & right
   │ 1px gap (bot)  │
   └────────────────┘

   turn_tr example (connects top & right):
        gap on left, gap on bottom
   ┌────────────────┐
   │  ██████████████│  ← connects to top
   │  ██████████████│
   │  ██████████████│  ← connects to right
   │                │  ← gap (bottom)
   └────────────────┘
   ↑ gap (left)
```

## Creating a Skin

### Step 1 — Choose Your Tool

Recommended pixel art editors:
- **[Aseprite](https://www.aseprite.org/)** (paid, best for pixel art)
- **[Piskel](https://www.piskelapp.com/)** (free, browser-based)
- **[Photoshop](https://www.adobe.com/photoshop)** (set pencil to 1px, no anti-alias)
- **[GIMP](https://www.gimp.org/)** (free, use pencil tool)
- Any editor that supports pixel-level editing at 16×16

### Step 2 — Start from Template

1. Create a new 112×48 canvas
2. Enable grid at 16px intervals for reference
3. Draw each tile inside its designated 16×16 cell

### Step 3 — Design Tips

- **Head**: Include clear directional cues (eyes, mouth, arrow)
- **Body**: Leave 1px gap on non-connecting sides for segment visibility
- **Turns**: Must seamlessly connect two perpendicular body segments
- **Tail**: Taper the end away from the body connection
- **Food**: Make it visually distinct from the snake
- **Colors**: Consider contrast with the background color

### Step 4 — Add to Game (Code Route)

Edit `js/utils/spritesheet.js` and add your palette to the `SKINS` object:

```javascript
// Inside SKINS object:
myskin: {
    bg:   '#222222', grid: '#2a2a2a',
    head: '#FF6600', body: '#CC4400', bodyLight: '#FF8833',
    eye:  '#FFFFFF', food: '#00FF00', foodShine: '#88FF88',
    stem: '#008800', text: '#FFFFFF'
}
```

Then add the corresponding option in `index.html`:

```html
<option value="myskin" data-i18n="skin-myskin">My Skin</option>
```

### Step 5 — Load Custom PNG (Advanced)

To use a custom PNG sprite sheet, call:

```javascript
SpriteSheet.loadCustom('path/to/your-skin.png', function(err) {
    if (!err) console.log('Custom skin loaded!');
});
```

## Palette Reference (Built-in Skins)

| Skin | Background | Snake Head | Snake Body | Food | Text |
|------|-----------|------------|------------|------|------|
| Classic | `#9BBC0F` | `#0F380F` | `#306230` | `#D32F2F` | `#0F380F` |
| Neon | `#0A0A1A` | `#00FFFF` | `#007799` | `#FF0066` | `#00FFFF` |
| Retro | `#000000` | `#FCFCFC` | `#6888FC` | `#D82800` | `#FCFCFC` |
| Dark | `#1A1A2E` | `#E8E8E8` | `#666680` | `#FF4444` | `#E8E8E8` |
| Ocean | `#006994` | `#FFD700` | `#CC8800` | `#FF6B6B` | `#FFD700` |

---

*Have fun creating skins! 🎨🐍*
