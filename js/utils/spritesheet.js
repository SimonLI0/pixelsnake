// ==========================================
// Sprite Sheet Skin System
// ==========================================
// One PNG (or generated canvas) = one complete skin.
// Layout: 7 columns × 3 rows, each tile 16×16 px  (total 112×48 px)
//
//   Col:  0         1          2          3          4        5        6
//   R0: head_up   head_right head_down  head_left  body_h   body_v   turn_tr
//   R1: turn_tl   turn_br    turn_bl    tail_up    tail_rt  tail_dn  tail_lt
//   R2: food      (reserved) (reserved) (reserved) (reserved)(reserved)(reserved)
//
var SpriteSheet = (function() {
    var TILE = 16; // source tile size (px)
    var COLS = 7;
    var ROWS = 3;
    var image = null;  // offscreen canvas or loaded Image
    var ready = false;
    var currentSkin = 'classic';

    // Sprite name → {col, row} on the sheet
    var MAP = {
        head_up:    { x: 0, y: 0 },
        head_right: { x: 1, y: 0 },
        head_down:  { x: 2, y: 0 },
        head_left:  { x: 3, y: 0 },
        body_h:     { x: 4, y: 0 },
        body_v:     { x: 5, y: 0 },
        turn_tr:    { x: 6, y: 0 },
        turn_tl:    { x: 0, y: 1 },
        turn_br:    { x: 1, y: 1 },
        turn_bl:    { x: 2, y: 1 },
        tail_up:    { x: 3, y: 1 },
        tail_right: { x: 4, y: 1 },
        tail_down:  { x: 5, y: 1 },
        tail_left:  { x: 6, y: 1 },
        food:       { x: 0, y: 2 }
    };

    // ─── Built-in Skin Palettes ───
    var SKINS = {
        classic: {
            bg:   '#9BBC0F', grid: '#8BAC0F',
            head: '#0F380F', body: '#306230', bodyLight: '#4A7A3A',
            eye:  '#9BBC0F', food: '#D32F2F', foodShine: '#E57373',
            stem: '#2E7D32', text: '#0F380F'
        },
        neon: {
            bg:   '#0A0A1A', grid: '#12122E',
            head: '#00FFFF', body: '#007799', bodyLight: '#00BBCC',
            eye:  '#FF0066', food: '#FF0066', foodShine: '#FF4499',
            stem: '#CC0055', text: '#00FFFF'
        },
        retro: {
            bg:   '#000000', grid: '#111111',
            head: '#FCFCFC', body: '#6888FC', bodyLight: '#9878FC',
            eye:  '#000000', food: '#D82800', foodShine: '#FC7460',
            stem: '#A01000', text: '#FCFCFC'
        },
        dark: {
            bg:   '#1A1A2E', grid: '#1E1E38',
            head: '#E8E8E8', body: '#666680', bodyLight: '#8888A0',
            eye:  '#FF4444', food: '#FF4444', foodShine: '#FF8888',
            stem: '#CC2222', text: '#E8E8E8'
        },
        ocean: {
            bg:   '#006994', grid: '#005577',
            head: '#FFD700', body: '#CC8800', bodyLight: '#FFAA00',
            eye:  '#000000', food: '#FF6B6B', foodShine: '#FF9999',
            stem: '#CC4444', text: '#FFD700'
        }
    };

    // ─── Sprite Generation ───
    // Generates a 112×48 offscreen canvas for the given palette
    function generate(palette) {
        var cv = document.createElement('canvas');
        cv.width  = COLS * TILE;
        cv.height = ROWS * TILE;
        var c = cv.getContext('2d');
        var T = TILE;
        var gap = 1;

        // Helper: offset into tile
        function ox(col) { return col * T; }
        function oy(row) { return row * T; }

        // ─── Heads (row 0, cols 0-3) ───
        var headDirs = [
            { col: 0, eyes: [[3,3,3,3],[10,3,3,3]] },  // up: eyes at top
            { col: 1, eyes: [[10,3,3,3],[10,10,3,3]] }, // right: eyes at right
            { col: 2, eyes: [[3,10,3,3],[10,10,3,3]] }, // down: eyes at bottom
            { col: 3, eyes: [[3,3,3,3],[3,10,3,3]] }    // left: eyes at left
        ];
        for (var hi = 0; hi < headDirs.length; hi++) {
            var hd = headDirs[hi];
            var hx = ox(hd.col), hy = oy(0);
            c.fillStyle = palette.head;
            c.fillRect(hx + gap, hy + gap, T - gap*2, T - gap*2);
            // Eyes
            c.fillStyle = palette.eye;
            for (var ei = 0; ei < hd.eyes.length; ei++) {
                var e = hd.eyes[ei];
                c.fillRect(hx + e[0], hy + e[1], e[2], e[3]);
            }
        }

        // ─── Body straight (row 0, cols 4-5) ───
        // body_h: horizontal — full width, gap top/bottom
        c.fillStyle = palette.body;
        c.fillRect(ox(4), oy(0) + gap, T, T - gap*2);
        // inner highlight
        c.fillStyle = palette.bodyLight;
        c.fillRect(ox(4), oy(0) + 4, T, T - 8);

        // body_v: vertical — full height, gap left/right
        c.fillStyle = palette.body;
        c.fillRect(ox(5) + gap, oy(0), T - gap*2, T);
        c.fillStyle = palette.bodyLight;
        c.fillRect(ox(5) + 4, oy(0), T - 8, T);

        // ─── Turns (row 0 col 6 + row 1 cols 0-2) ───
        // turn_tr: connects Top edge and Right edge → gap on left + bottom
        c.fillStyle = palette.body;
        c.fillRect(ox(6) + gap, oy(0), T - gap, T - gap);
        c.fillStyle = palette.bodyLight;
        c.fillRect(ox(6) + 4, oy(0), T - 4, T - 4);
        // Re-draw outer corners for clean look
        c.fillStyle = palette.body;
        c.fillRect(ox(6) + gap, oy(0), 3, T - gap);
        c.fillRect(ox(6) + gap, oy(0) + T - gap - 3, T - gap, 3);

        // turn_tl: connects Top edge and Left edge → gap on right + bottom
        c.fillStyle = palette.body;
        c.fillRect(ox(0), oy(1), T - gap, T - gap);
        c.fillStyle = palette.bodyLight;
        c.fillRect(ox(0), oy(1), T - 4, T - 4);
        c.fillStyle = palette.body;
        c.fillRect(ox(0) + T - gap - 3, oy(1), 3, T - gap);
        c.fillRect(ox(0), oy(1) + T - gap - 3, T - gap, 3);

        // turn_br: connects Bottom edge and Right edge → gap on left + top
        c.fillStyle = palette.body;
        c.fillRect(ox(1) + gap, oy(1) + gap, T - gap, T - gap);
        c.fillStyle = palette.bodyLight;
        c.fillRect(ox(1) + 4, oy(1) + 4, T - 4, T - 4);
        c.fillStyle = palette.body;
        c.fillRect(ox(1) + gap, oy(1) + gap, 3, T - gap);
        c.fillRect(ox(1) + gap, oy(1) + gap, T - gap, 3);

        // turn_bl: connects Bottom edge and Left edge → gap on right + top
        c.fillStyle = palette.body;
        c.fillRect(ox(2), oy(1) + gap, T - gap, T - gap);
        c.fillStyle = palette.bodyLight;
        c.fillRect(ox(2), oy(1) + 4, T - 4, T - 4);
        c.fillStyle = palette.body;
        c.fillRect(ox(2) + T - gap - 3, oy(1) + gap, 3, T - gap);
        c.fillRect(ox(2), oy(1) + gap, T - gap, 3);

        // ─── Tails (row 1, cols 3-6) ───
        // tail_X: the pointed end tapers away from the body connection
        // tail_up: body connects above, taper downward
        c.fillStyle = palette.body;
        c.fillRect(ox(3) + gap, oy(1), T - gap*2, T);
        // Taper: clear bottom corners
        c.clearRect(ox(3), oy(1) + T - 5, gap + 3, 5);
        c.clearRect(ox(3) + T - gap - 3, oy(1) + T - 5, gap + 3, 5);

        // tail_right: body connects right, taper leftward
        c.fillStyle = palette.body;
        c.fillRect(ox(4), oy(1) + gap, T, T - gap*2);
        c.clearRect(ox(4), oy(1), 5, gap + 3);
        c.clearRect(ox(4), oy(1) + T - gap - 3, 5, gap + 3);

        // tail_down: body connects below, taper upward
        c.fillStyle = palette.body;
        c.fillRect(ox(5) + gap, oy(1), T - gap*2, T);
        c.clearRect(ox(5), oy(1), gap + 3, 5);
        c.clearRect(ox(5) + T - gap - 3, oy(1), gap + 3, 5);

        // tail_left: body connects left, taper rightward
        c.fillStyle = palette.body;
        c.fillRect(ox(6), oy(1) + gap, T, T - gap*2);
        c.clearRect(ox(6) + T - 5, oy(1), 5, gap + 3);
        c.clearRect(ox(6) + T - 5, oy(1) + T - gap - 3, 5, gap + 3);

        // ─── Food (row 2, col 0) ───
        var fx = ox(0), fy = oy(2);
        // Apple body
        c.fillStyle = palette.food;
        c.beginPath();
        c.arc(fx + T/2, fy + T/2 + 1, T/2 - 2, 0, Math.PI * 2);
        c.fill();
        // Highlight
        c.fillStyle = palette.foodShine;
        c.fillRect(fx + 4, fy + 4, 3, 2);
        // Stem
        c.strokeStyle = palette.stem;
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(fx + T/2, fy + 3);
        c.lineTo(fx + T/2 + 2, fy);
        c.stroke();

        return cv;
    }

    // ─── Apply skin: regenerate sprites + update global COLORS ───
    function applySkin(skinName) {
        var palette = SKINS[skinName];
        if (!palette) { skinName = 'classic'; palette = SKINS.classic; }
        currentSkin = skinName;

        // Generate sprite sheet
        image = generate(palette);
        ready = true;

        // Sync the global COLORS object so score text / bg / grid stay consistent
        COLORS.BACKGROUND = palette.bg;
        COLORS.GRID_LINE  = palette.grid;
        COLORS.SNAKE_HEAD = palette.head;
        COLORS.SNAKE_BODY = palette.body;
        COLORS.FOOD       = palette.food;
        COLORS.TEXT        = palette.text;

        // Persist choice
        try { localStorage.setItem('snake_skin', skinName); } catch(e) {}
    }

    // ─── Load custom PNG skin from URL ───
    function loadCustom(url, callback) {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
            image = img;
            ready = true;
            currentSkin = 'custom';
            try { localStorage.setItem('snake_skin', 'custom'); } catch(e) {}
            try { localStorage.setItem('snake_skin_url', url); } catch(e) {}
            if (callback) callback(null);
        };
        img.onerror = function() {
            console.warn('SpriteSheet: failed to load ' + url);
            if (callback) callback(new Error('Load failed'));
        };
        img.src = url;
    }

    // ─── Core draw method ───
    // Draws one sprite from the sheet onto ctx at (dx, dy) scaled to destSize
    function draw(ctx, spriteName, dx, dy, destSize) {
        if (!ready || !MAP[spriteName]) return false;
        var pos = MAP[spriteName];
        ctx.drawImage(
            image,
            pos.x * TILE, pos.y * TILE, TILE, TILE,  // source rect
            dx, dy, destSize, destSize                 // dest rect
        );
        return true;
    }

    // ─── Helpers for Renderer ───
    // Determine the correct sprite name for a body segment
    function getSegmentSprite(body, index, direction) {
        var seg = body[index];

        // Head
        if (index === 0) {
            if (direction.y === -1) return 'head_up';
            if (direction.x === 1)  return 'head_right';
            if (direction.y === 1)  return 'head_down';
            return 'head_left';
        }

        // Tail
        if (index === body.length - 1) {
            var prev = body[index - 1];
            var dx = prev.x - seg.x;
            var dy = prev.y - seg.y;
            if (dy === -1) return 'tail_up';
            if (dx === 1)  return 'tail_right';
            if (dy === 1)  return 'tail_down';
            return 'tail_left';
        }

        // Middle segment
        var prev = body[index - 1];
        var next = body[index + 1];
        var dpx = prev.x - seg.x;
        var dpy = prev.y - seg.y;
        var dnx = next.x - seg.x;
        var dny = next.y - seg.y;

        // Straight
        if (dpy === 0 && dny === 0) return 'body_h';
        if (dpx === 0 && dnx === 0) return 'body_v';

        // Turn
        var hasRight = (dpx === 1 || dnx === 1);
        var hasLeft  = (dpx === -1 || dnx === -1);
        var hasUp    = (dpy === -1 || dny === -1);
        var hasDown  = (dpy === 1 || dny === 1);

        if (hasUp && hasRight)   return 'turn_tr';
        if (hasUp && hasLeft)    return 'turn_tl';
        if (hasDown && hasRight) return 'turn_br';
        if (hasDown && hasLeft)  return 'turn_bl';

        return 'body_h'; // fallback
    }

    // ─── Public API ───
    // Initialize on module load: apply saved skin or default
    function initSkin() {
        var saved = 'classic';
        try { saved = localStorage.getItem('snake_skin') || 'classic'; } catch(e) {}
        if (SKINS[saved]) {
            applySkin(saved);
        } else {
            applySkin('classic');
        }
    }

    // Auto-init
    initSkin();

    return {
        TILE:             TILE,
        MAP:              MAP,
        SKINS:            SKINS,
        applySkin:        applySkin,
        loadCustom:       loadCustom,
        draw:             draw,
        getSegmentSprite: getSegmentSprite,
        isReady:          function() { return ready; },
        getSkin:          function() { return currentSkin; },
        getSkinList:      function() { return Object.keys(SKINS); },
        getImage:         function() { return image; }
    };
})();
