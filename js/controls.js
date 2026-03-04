var Controls = (function() {
    var snake = null;
    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartTime = 0;

    // D-pad repeat: press-and-hold fires direction repeatedly
    var dpadRepeatTimer = null;
    var DPAD_REPEAT_DELAY = 180; // ms before repeat starts
    var DPAD_REPEAT_RATE = 80;   // ms between repeats

    function fireDirection(dx, dy) {
        if (snake) snake.setDirection(dx, dy);
    }

    function startDpadRepeat(dx, dy) {
        fireDirection(dx, dy);
        clearDpadRepeat();
        dpadRepeatTimer = setTimeout(function repeat() {
            fireDirection(dx, dy);
            dpadRepeatTimer = setTimeout(repeat, DPAD_REPEAT_RATE);
        }, DPAD_REPEAT_DELAY);
    }

    function clearDpadRepeat() {
        if (dpadRepeatTimer) {
            clearTimeout(dpadRepeatTimer);
            dpadRepeatTimer = null;
        }
    }

    function setupDpadButton(id, dx, dy) {
        var btn = document.getElementById(id);
        if (!btn) return;

        // Touch events (primary for mobile)
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.add('active');
            startDpadRepeat(dx, dy);
        }, { passive: false });

        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            btn.classList.remove('active');
            clearDpadRepeat();
        }, { passive: false });

        btn.addEventListener('touchcancel', function(e) {
            btn.classList.remove('active');
            clearDpadRepeat();
        });

        // Mouse events (for desktop testing)
        btn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            btn.classList.add('active');
            startDpadRepeat(dx, dy);
        });

        btn.addEventListener('mouseup', function(e) {
            btn.classList.remove('active');
            clearDpadRepeat();
        });

        btn.addEventListener('mouseleave', function(e) {
            btn.classList.remove('active');
            clearDpadRepeat();
        });
    }

    function init(snakeRef) {
        snake = snakeRef;

        // Keyboard controls
        document.addEventListener('keydown', function(e) {
            if (!snake) return;
            switch(e.key) {
                case 'ArrowUp':    case 'w': case 'W': snake.setDirection(0, -1); e.preventDefault(); break;
                case 'ArrowDown':  case 's': case 'S': snake.setDirection(0,  1); e.preventDefault(); break;
                case 'ArrowLeft':  case 'a': case 'A': snake.setDirection(-1, 0); e.preventDefault(); break;
                case 'ArrowRight': case 'd': case 'D': snake.setDirection(1,  0); e.preventDefault(); break;
            }
        });

        // D-pad buttons
        setupDpadButton('dpad-up',    0, -1);
        setupDpadButton('dpad-down',  0,  1);
        setupDpadButton('dpad-left', -1,  0);
        setupDpadButton('dpad-right', 1,  0);

        // Touch swipe support (backup, works on canvas/body area)
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' ||
                e.target.tagName === 'SELECT' || e.target.tagName === 'LABEL' ||
                e.target.tagName === 'A' || e.target.closest('.gb-controls') ||
                e.target.closest('.ss-container')) return;
            var t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            touchStartTime = Date.now();
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', function(e) {
            // Prevent pull-to-refresh and scroll in WeChat/Safari
            if (!e.target.closest('.overlay')) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', function(e) {
            if (!snake) return;
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' ||
                e.target.tagName === 'SELECT' || e.target.tagName === 'LABEL' ||
                e.target.tagName === 'A' || e.target.closest('.gb-controls') ||
                e.target.closest('.ss-container')) return;
            var t = e.changedTouches[0];
            var dx = t.clientX - touchStartX;
            var dy = t.clientY - touchStartY;
            var elapsed = Date.now() - touchStartTime;
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