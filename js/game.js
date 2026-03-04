// ==========================================
// Main Game Controller
// ==========================================
var Game = (function() {
    var canvas, ctx, renderer;
    var snake, food;
    var gameLoop = null;
    var score = 0;
    var state = 'menu'; // menu | playing | gameover

    // --- Audio (Web Audio API for short beeps) ---
    var audioCtx = null;
    function initAudio() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        } catch(e) {
            audioCtx = null;
        }
    }
    function playBeep(freq, duration) {
        try {
            if (!audioCtx || VOLUME <= 0) return;
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(VOLUME * 0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + duration);
        } catch(e) { /* audio not available */ }
    }
    function sfxEat()   { playBeep(600, 0.08); setTimeout(function(){ playBeep(800, 0.08); }, 60); }
    function sfxDie()   { playBeep(200, 0.3); }
    function sfxStart() { playBeep(523, 0.1); setTimeout(function(){ playBeep(659, 0.1); }, 100); setTimeout(function(){ playBeep(784, 0.15); }, 200); }

    // --- UI Elements ---
    function showMenu() {
        document.getElementById('menu-screen').style.display = 'flex';
        updatePlayerInfo();
    }
    function hideMenu() { document.getElementById('menu-screen').style.display = 'none'; }
    function showSettings() { document.getElementById('settings-panel').style.display = 'flex'; }
    function hideSettings() { document.getElementById('settings-panel').style.display = 'none'; }
    function showLeaderboard() { document.getElementById('leaderboard-panel').style.display = 'flex'; }
    function hideLeaderboard() { document.getElementById('leaderboard-panel').style.display = 'none'; }
    function showNickname() { document.getElementById('nickname-panel').style.display = 'flex'; }
    function hideNickname() { document.getElementById('nickname-panel').style.display = 'none'; }

    function updatePlayerInfo() {
        var el = document.getElementById('menu-player-info');
        if (Leaderboard.isRegistered()) {
            el.innerHTML = '<span class="nick-label" id="nick-display">👤 ' + Leaderboard.getNickname() + '</span>' +
                ' | 🏅 最高: ' + Leaderboard.getBestScore();
            document.getElementById('nick-display').addEventListener('click', function() {
                hideMenu();
                document.getElementById('input-nickname').value = Leaderboard.getNickname();
                showNickname();
            });
        } else {
            el.textContent = '⏳ 连接中...';
        }
    }

    function loadLeaderboard() {
        var list = document.getElementById('leaderboard-list');
        list.innerHTML = '<div class="lb-loading">加载中...</div>';
        Leaderboard.getLeaderboard(function(err, data) {
            if (err || !data || !data.leaderboard) {
                list.innerHTML = '<div class="lb-loading">⚠ 无法加载排行榜</div>';
                return;
            }
            var html = '<table class="lb-table"><tr><th>#</th><th>玩家</th><th>最高分</th><th>场次</th></tr>';
            var board = data.leaderboard;
            for (var i = 0; i < board.length; i++) {
                var row = board[i];
                var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
                var isMe = Leaderboard.getDeviceId() && Leaderboard.getDeviceId().substring(0, 6) === row.device_short;
                html += '<tr' + (isMe ? ' class="lb-me"' : '') + '>' +
                    '<td>' + medal + '</td>' +
                    '<td>' + row.nickname + '</td>' +
                    '<td>' + row.best_score + '</td>' +
                    '<td>' + row.games_played + '</td></tr>';
            }
            html += '</table>';
            if (board.length === 0) {
                html = '<div class="lb-loading">暂无记录，快来创造第一个！</div>';
            }
            list.innerHTML = html;
        });
    }

    // --- Canvas Resize ---
    function resizeCanvas(w, h) {
        CANVAS_WIDTH = w;
        CANVAS_HEIGHT = h;
        canvas.width = w;
        canvas.height = h;
        // Update CSS size for sharp pixels
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
    }

    // --- Core Game ---
    var controlsInitialized = false;

    function startGame() {
        score = 0;
        snake = new Snake();
        food = new Food();
        food.spawn(snake.body);
        if (!controlsInitialized) {
            Controls.init(snake);
            controlsInitialized = true;
        } else {
            Controls.setSnake(snake);
        }
        hideMenu();
        hideSettings();
        state = 'playing';
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(tick, GAME_SPEED);
        initAudio();
        sfxStart();
    }

    function tick() {
        if (state !== 'playing') return;

        snake.update();

        if (!snake.alive) {
            state = 'gameover';
            clearInterval(gameLoop);
            gameLoop = null;
            sfxDie();
            // Submit score to leaderboard
            Leaderboard.submitScore(score, function(err, data) {
                if (!err && data) {
                    renderer.drawGameOverWithRank(score, data.rank, data.is_personal_best);
                }
            });
            render();
            return;
        }

        var head = snake.headPosition();
        if (food.isAt(head.x, head.y)) {
            snake.grow();
            score += 10;
            sfxEat();
            food.spawn(snake.body);
        }

        render();
    }

    function render() {
        renderer.clear();
        renderer.drawSnake(snake);
        renderer.drawFood(food);
        renderer.drawScore(score);
        if (state === 'gameover') {
            renderer.drawGameOver(score);
        }
    }

    function restart() {
        startGame();
    }

    // --- Init ---
    function init() {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        canvas.style.width = CANVAS_WIDTH + 'px';
        canvas.style.height = CANVAS_HEIGHT + 'px';
        renderer = new Renderer(ctx);

        // Draw initial background on canvas
        renderer.clear();

        // Button bindings
        document.getElementById('btn-start').addEventListener('click', startGame);
        document.getElementById('btn-settings').addEventListener('click', function() {
            hideMenu();
            showSettings();
        });
        document.getElementById('btn-back').addEventListener('click', function() {
            hideSettings();
            showMenu();
        });

        // Leaderboard buttons
        document.getElementById('btn-leaderboard').addEventListener('click', function() {
            hideMenu();
            loadLeaderboard();
            showLeaderboard();
        });
        document.getElementById('btn-lb-back').addEventListener('click', function() {
            hideLeaderboard();
            showMenu();
        });

        // Nickname buttons
        document.getElementById('btn-save-nick').addEventListener('click', function() {
            var name = document.getElementById('input-nickname').value.trim();
            if (name.length > 0) {
                Leaderboard.setNickname(name, function() {
                    hideNickname();
                    showMenu();
                });
            }
        });
        document.getElementById('btn-cancel-nick').addEventListener('click', function() {
            hideNickname();
            showMenu();
        });
        document.getElementById('input-nickname').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') document.getElementById('btn-save-nick').click();
            e.stopPropagation();
        });

        // Settings: screen size
        var sizeSelect = document.getElementById('setting-size');
        sizeSelect.addEventListener('change', function() {
            var parts = this.value.split('x');
            resizeCanvas(parseInt(parts[0]), parseInt(parts[1]));
            renderer = new Renderer(ctx);
            renderer.clear();
        });

        // Settings: speed
        var speedSelect = document.getElementById('setting-speed');
        speedSelect.addEventListener('change', function() {
            GAME_SPEED = parseInt(this.value);
        });

        // Settings: volume
        var volumeSlider = document.getElementById('setting-volume');
        var volumeLabel = document.getElementById('volume-value');
        volumeSlider.addEventListener('input', function() {
            VOLUME = parseFloat(this.value);
            volumeLabel.textContent = Math.round(VOLUME * 100) + '%';
            // Preview beep
            initAudio();
            playBeep(523, 0.08);
        });

        // Enter key to restart after game over
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (state === 'gameover') {
                    restart();
                } else if (state === 'menu') {
                    startGame();
                }
            }
        });

        showMenu();

        // Initialize leaderboard (device fingerprint + registration)
        Leaderboard.init(function(err, data) {
            updatePlayerInfo();
        });
    }

    window.onload = init;

    return { start: startGame, restart: restart };
})();