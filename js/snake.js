var Snake = (function() {
    function Snake() {
        this.reset();
    }

    Snake.prototype.reset = function() {
        var startX = Math.floor(gridCols() / 2);
        var startY = Math.floor(gridRows() / 2);
        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.growPending = 0;
        this.alive = true;
    };

    Snake.prototype.setDirection = function(dx, dy) {
        // prevent 180-degree reversal
        if (this.direction.x + dx === 0 && this.direction.y + dy === 0) return;
        this.nextDirection = { x: dx, y: dy };
    };

    Snake.prototype.update = function() {
        this.direction = this.nextDirection;
        var cols = gridCols();
        var rows = gridRows();
        var head = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };

        // Wall collision: wild mode wraps around, standard mode dies
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            if (GAME_MODE === 'wild') {
                head.x = (head.x + cols) % cols;
                head.y = (head.y + rows) % rows;
            } else {
                this.alive = false;
                return;
            }
        }

        // Self collision
        for (var i = 0; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                this.alive = false;
                return;
            }
        }

        this.body.unshift(head);
        if (this.growPending > 0) {
            this.growPending--;
        } else {
            this.body.pop();
        }
    };

    Snake.prototype.grow = function() {
        this.growPending++;
    };

    Snake.prototype.headPosition = function() {
        return this.body[0];
    };

    return Snake;
})();