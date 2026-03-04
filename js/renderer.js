var Renderer = (function() {
    function Renderer(ctx) {
        this.ctx = ctx;
    }

    Renderer.prototype.clear = function() {
        var ctx = this.ctx;
        var canvas = ctx.canvas;
        // Background
        ctx.fillStyle = COLORS.BACKGROUND;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = COLORS.GRID_LINE;
        ctx.lineWidth = 0.5;
        for (var x = 0; x <= canvas.width; x += GRID_SIZE) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (var y = 0; y <= canvas.height; y += GRID_SIZE) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    };

    Renderer.prototype.drawSnake = function(snake) {
        var ctx = this.ctx;
        var gs = GRID_SIZE;
        var body = snake.body;

        // Use sprite sheet if available
        if (typeof SpriteSheet !== 'undefined' && SpriteSheet.isReady()) {
            for (var i = 0; i < body.length; i++) {
                var seg = body[i];
                var px = seg.x * gs;
                var py = seg.y * gs;
                var sprite = SpriteSheet.getSegmentSprite(body, i, snake.direction);
                SpriteSheet.draw(ctx, sprite, px, py, gs);
            }
            return;
        }

        // Fallback: original rectangle rendering
        for (var i = 0; i < body.length; i++) {
            var seg = body[i];
            var px = seg.x * gs;
            var py = seg.y * gs;

            if (i === 0) {
                // Head - darker, with eyes
                ctx.fillStyle = COLORS.SNAKE_HEAD;
                ctx.fillRect(px + 1, py + 1, gs - 2, gs - 2);
                // Eyes
                ctx.fillStyle = COLORS.BACKGROUND;
                var ex1, ey1, ex2, ey2;
                if (snake.direction.x === 1)       { ex1 = px+10; ey1 = py+3; ex2 = px+10; ey2 = py+9; }
                else if (snake.direction.x === -1)  { ex1 = px+3;  ey1 = py+3; ex2 = px+3;  ey2 = py+9; }
                else if (snake.direction.y === -1)  { ex1 = px+3;  ey1 = py+3; ex2 = px+9;  ey2 = py+3; }
                else                                { ex1 = px+3;  ey1 = py+10;ex2 = px+9;  ey2 = py+10;}
                ctx.fillRect(ex1, ey1, 3, 3);
                ctx.fillRect(ex2, ey2, 3, 3);
            } else {
                // Body
                ctx.fillStyle = COLORS.SNAKE_BODY;
                ctx.fillRect(px + 1, py + 1, gs - 2, gs - 2);
            }
        }
    };

    Renderer.prototype.drawFood = function(food) {
        var ctx = this.ctx;
        var gs = GRID_SIZE;
        var px = food.position.x * gs;
        var py = food.position.y * gs;

        // Use sprite sheet if available
        if (typeof SpriteSheet !== 'undefined' && SpriteSheet.isReady()) {
            SpriteSheet.draw(ctx, 'food', px, py, gs);
            return;
        }

        // Fallback: original apple rendering
        ctx.fillStyle = COLORS.FOOD;
        ctx.beginPath();
        ctx.arc(px + gs/2, py + gs/2 + 1, gs/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px + gs/2, py + 2);
        ctx.lineTo(px + gs/2 + 2, py - 1);
        ctx.stroke();
    };

    Renderer.prototype.drawScore = function(score) {
        var ctx = this.ctx;
        ctx.fillStyle = COLORS.TEXT;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('SCORE: ' + score, 8, 18);
    };

    Renderer.prototype.drawGameOver = function(score) {
        var ctx = this.ctx;
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', w/2, h/2 - 30);

        ctx.font = '16px monospace';
        ctx.fillText('Score: ' + score, w/2, h/2 + 10);
        ctx.fillText('Press ENTER to restart', w/2, h/2 + 60);
    };

    Renderer.prototype.drawGameOverWithRank = function(score, rank, isPersonalBest) {
        var ctx = this.ctx;
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', w/2, h/2 - 50);

        ctx.font = '16px monospace';
        ctx.fillText('Score: ' + score, w/2, h/2 - 15);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('🏆 World Rank #' + rank, w/2, h/2 + 15);

        if (isPersonalBest) {
            ctx.fillStyle = '#00FF88';
            ctx.font = 'bold 14px monospace';
            ctx.fillText('🎉 NEW PERSONAL BEST!', w/2, h/2 + 40);
        }

        ctx.fillStyle = '#aaa';
        ctx.font = '13px monospace';
        ctx.fillText('Press ENTER to restart', w/2, h/2 + 68);
    };

    return Renderer;
})();