var Controls = (function() {
    var snake = null;
    var touchStartX = 0;
    var touchStartY = 0;

    function init(snakeRef) {
        snake = snakeRef;

        document.addEventListener('keydown', function(e) {
            if (!snake) return;
            switch(e.key) {
                case 'ArrowUp':    case 'w': case 'W': snake.setDirection(0, -1); e.preventDefault(); break;
                case 'ArrowDown':  case 's': case 'S': snake.setDirection(0,  1); e.preventDefault(); break;
                case 'ArrowLeft':  case 'a': case 'A': snake.setDirection(-1, 0); e.preventDefault(); break;
                case 'ArrowRight': case 'd': case 'D': snake.setDirection(1,  0); e.preventDefault(); break;
            }
        });

        // Touch support for mobile
        var canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('touchstart', function(e) {
            var t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            e.preventDefault();
        }, { passive: false });

        canvas.addEventListener('touchend', function(e) {
            if (!snake) return;
            var t = e.changedTouches[0];
            var dx = t.clientX - touchStartX;
            var dy = t.clientY - touchStartY;
            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                snake.setDirection(dx > 0 ? 1 : -1, 0);
            } else {
                snake.setDirection(0, dy > 0 ? 1 : -1);
            }
            e.preventDefault();
        }, { passive: false });
    }

    return { init: init, setSnake: function(s) { snake = s; } };
})();