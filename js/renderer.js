var Renderer = (function() {
    function Renderer(ctx) {
        this.ctx = ctx;
    }

    Renderer.prototype.clear = function() {
        var ctx = this.ctx;
        var canvas = ctx.canvas;
        // Game Boy green background
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
        for (var i = 0; i < snake.body.length; i++) {
            var seg = snake.body[i];
            var px = seg.x * GRID_SIZE;
            var py = seg.y * GRID_SIZE;

            if (i === 0) {
                // Head - darker, with eyes
                ctx.fillStyle = COLORS.SNAKE_HEAD;
                ctx.fillRect(px + 1, py + 1, GRID_SIZE - 2, GRID_SIZE - 2);
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
                ctx.fillRect(px + 1, py + 1, GRID_SIZE - 2, GRID_SIZE - 2);
            }
        }
    };

    Renderer.prototype.drawFood = function(food) {
        var ctx = this.ctx;
        var px = food.position.x * GRID_SIZE;
        var py = food.position.y * GRID_SIZE;
        ctx.fillStyle = COLORS.FOOD;
        // Apple shape
        ctx.beginPath();
        ctx.arc(px + GRID_SIZE/2, py + GRID_SIZE/2 + 1, GRID_SIZE/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Stem
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px + GRID_SIZE/2, py + 2);
        ctx.lineTo(px + GRID_SIZE/2 + 2, py - 1);
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
        ctx.fillText('GAME OVER', w/2, h/2 - 20);

        ctx.font = '16px monospace';
        ctx.fillText('Score: ' + score, w/2, h/2 + 15);
        ctx.fillText('Press ENTER to restart', w/2, h/2 + 50);
    };

    return Renderer;
})();