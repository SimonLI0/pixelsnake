var Controls = (function() {
    var snake = null;
    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartTime = 0;

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

        // Touch support: listen on document for full-screen swipe area
        // Only process swipes when game is playing (overlays handle their own taps)
        document.addEventListener('touchstart', function(e) {
            // Don't intercept touches on buttons/inputs inside overlays
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' ||
                e.target.tagName === 'SELECT' || e.target.tagName === 'LABEL' ||
                e.target.tagName === 'A') return;
            var t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            touchStartTime = Date.now();
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', function(e) {
            // Prevent pull-to-refresh and scroll in WeChat/Safari
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchend', function(e) {
            if (!snake) return;
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' ||
                e.target.tagName === 'SELECT' || e.target.tagName === 'LABEL' ||
                e.target.tagName === 'A') return;
            var t = e.changedTouches[0];
            var dx = t.clientX - touchStartX;
            var dy = t.clientY - touchStartY;
            var elapsed = Date.now() - touchStartTime;
            // Ignore taps (too short distance) or very slow drags (>800ms)
            if ((Math.abs(dx) < 15 && Math.abs(dy) < 15) || elapsed > 800) return;
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