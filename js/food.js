var Food = (function() {
    function Food() {
        this.position = { x: 0, y: 0 };
    }

    Food.prototype.spawn = function(snakeBody) {
        var cols = gridCols();
        var rows = gridRows();
        var valid = false;
        while (!valid) {
            this.position.x = getRandomInt(0, cols);
            this.position.y = getRandomInt(0, rows);
            valid = true;
            if (snakeBody) {
                for (var i = 0; i < snakeBody.length; i++) {
                    if (snakeBody[i].x === this.position.x && snakeBody[i].y === this.position.y) {
                        valid = false;
                        break;
                    }
                }
            }
        }
    };

    Food.prototype.isAt = function(x, y) {
        return this.position.x === x && this.position.y === y;
    };

    return Food;
})();