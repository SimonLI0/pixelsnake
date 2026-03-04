// ==========================================
// Main Game Controller
// ==========================================
var Game = (function() {
    var canvas, ctx, renderer;
    var snake, food;
    var gameLoop = null;
    var score = 0;
    var state = 'menu'; // menu | playing | paused | gameover

    // --- Boost (A button) ---
    var normalSpeed = GAME_SPEED;
    var boostActive = false;
    var BOOST_FACTOR = 0.4; // 40% of normal interval = much faster

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
    function showGameOver(score, rank, isPersonalBest) {
        document.getElementById('gameover-score').textContent = I18n.t('score-prefix') + score +
            '  ' + I18n.t(GAME_MODE === 'standard' ? 'mode-label-standard' : 'mode-label-wild');
        var rankEl = document.getElementById('gameover-rank');
        var bestEl = document.getElementById('gameover-best');
        if (rank) {
            rankEl.textContent = I18n.t('rank-prefix') + rank;
        } else {
            rankEl.textContent = '';
        }
        if (isPersonalBest) {
            bestEl.textContent = I18n.t('personal-best');
        } else {
            bestEl.textContent = '';
        }
        document.getElementById('gameover-panel').style.display = 'flex';
    }
    function hideGameOver() { document.getElementById('gameover-panel').style.display = 'none'; }

    function updatePlayerInfo() {
        var el = document.getElementById('menu-player-info');
        if (Leaderboard.isRegistered()) {
            el.innerHTML = '<span class="nick-label" id="nick-display">👤 ' + Leaderboard.getNickname() + '</span>';
            document.getElementById('nick-display').addEventListener('click', function() {
                hideMenu();
                document.getElementById('input-nickname').value = Leaderboard.getNickname();
                showNickname();
            });
            // Update stats bubble
            updateStatsBubble();
        } else {
            el.textContent = I18n.t('connecting');
        }
    }

    function updateStatsBubble() {
        var bubble = document.getElementById('menu-stats-bubble');
        if (!bubble) return;
        Leaderboard.getMyStats(function(err, data) {
            if (err || !data || !data.stats || !data.stats.best_score) {
                bubble.style.display = 'none';
                return;
            }
            var s = data.stats;
            bubble.innerHTML =
                '<span class="stats-line stats-score">' + I18n.t('stats-best') + s.best_score + '</span>' +
                '<span class="stats-line stats-rank">' + I18n.t('stats-rank') + s.rank + '</span>';
            bubble.style.display = 'block';
        });
    }

    function loadLeaderboard(gameMode) {
        var mode = gameMode || 'standard';
        var list = document.getElementById('leaderboard-list');
        list.innerHTML = '<div class="lb-loading">' + I18n.t('loading') + '</div>';
        Leaderboard.getLeaderboard(mode, function(err, data) {
            if (err || !data || !data.leaderboard) {
                list.innerHTML = '<div class="lb-loading">' + I18n.t('load-error') + '</div>';
                return;
            }
            var html = '<table class="lb-table"><tr><th>#</th><th>' + I18n.t('th-player') + '</th><th>' + I18n.t('th-best') + '</th><th>' + I18n.t('th-games') + '</th></tr>';
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
                html = '<div class="lb-loading">' + I18n.t('no-records') + '</div>';
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

    // --- Mobile auto-sizing ---
    function detectBestSize() {
        // On mobile, pick a canvas size that fits the viewport
        var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
                       (window.innerWidth <= 640 && 'ontouchstart' in window);
        if (!isMobile) return;

        // Available space: viewport minus gameboy shell + controls overhead
        var shellPad = 60; // shell padding + bezel
        var controlsHeight = 160; // d-pad + select/start area
        var availW = window.innerWidth - shellPad;
        var availH = window.innerHeight - shellPad - controlsHeight;
        var avail = Math.min(availW, availH);

        var bestSize = 256;
        if (avail >= 640) bestSize = 640;
        else if (avail >= 480) bestSize = 480;
        else if (avail >= 320) bestSize = 320;
        else bestSize = 256;

        resizeCanvas(bestSize, bestSize);
        if (renderer) {
            renderer = new Renderer(ctx);
            renderer.clear();
        }

        // Update size selector to match
        var sizeSelect = document.getElementById('setting-size');
        if (sizeSelect) sizeSelect.value = bestSize + 'x' + bestSize;
    }

    // --- Fit game to screen (CSS scaling) ---
    function fitToScreen() {
        var shell = document.querySelector('.gameboy-shell');
        if (!shell) return;
        // Reset transform first
        shell.style.transform = '';
        shell.style.transformOrigin = 'center center';

        var shellRect = shell.getBoundingClientRect();
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        // Only scale down, never up
        var scaleX = vw / shellRect.width;
        var scaleY = vh / shellRect.height;
        var scale = Math.min(scaleX, scaleY, 1);
        if (scale < 0.98) {
            shell.style.transform = 'scale(' + scale.toFixed(3) + ')';
        }
    }

    // --- Core Game ---
    var controlsInitialized = false;

    // --- Mode selection ---
    function startStandard() {
        GAME_MODE = 'standard';
        // Force standard parameters
        GAME_SPEED = STANDARD_SPEED;
        normalSpeed = STANDARD_SPEED;
        resizeCanvas(STANDARD_CANVAS, STANDARD_CANVAS);
        renderer = new Renderer(ctx);
        setTimeout(fitToScreen, 50);
        startGame();
    }

    function startWild() {
        GAME_MODE = 'wild';
        // Use whatever the player set in settings
        normalSpeed = GAME_SPEED;
        startGame();
    }

    function updateSettingsVisibility() {
        var wildRows = document.querySelectorAll('.wild-only-setting');
        for (var i = 0; i < wildRows.length; i++) {
            // Always show wild-only settings in settings panel —
            // but add a note they only apply in wild mode
            // We just keep them visible but labeled
        }
    }

    function startGame() {
        score = 0;
        normalSpeed = GAME_SPEED;
        boostActive = false;
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
        hideGameOver();
        hidePause();
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
            render();
            showGameOver(score, null, false);
            Leaderboard.submitScore(score, function(err, data) {
                if (!err && data) {
                    showGameOver(score, data.rank, data.is_personal_best);
                }
            });
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

    // --- Pause ---
    function showPause() { document.getElementById('pause-overlay').style.display = 'flex'; }
    function hidePause() { document.getElementById('pause-overlay').style.display = 'none'; }

    function togglePause() {
        if (state === 'playing') {
            state = 'paused';
            if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
            showPause();
        } else if (state === 'paused') {
            state = 'playing';
            hidePause();
            if (!gameLoop) {
                var speed = boostActive ? Math.round(normalSpeed * BOOST_FACTOR) : normalSpeed;
                gameLoop = setInterval(tick, speed);
            }
        }
    }

    // --- Boost (A button hold) ---
    function startBoost() {
        if (state !== 'playing' || boostActive) return;
        boostActive = true;
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(tick, Math.round(normalSpeed * BOOST_FACTOR));
    }

    function stopBoost() {
        if (!boostActive) return;
        boostActive = false;
        if (state === 'playing') {
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(tick, normalSpeed);
        }
    }

    function render() {
        renderer.clear();
        renderer.drawSnake(snake);
        renderer.drawFood(food);
        renderer.drawScore(score);
        // Game over overlay is now HTML-based, no canvas drawing needed
    }

    function restart() {
        hideGameOver();
        if (GAME_MODE === 'standard') {
            startStandard();
        } else {
            startWild();
        }
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

        // Auto-detect best canvas size for mobile
        detectBestSize();

        // Draw initial background on canvas
        renderer.clear();

        // Fit to screen on load and resize/orientation change
        setTimeout(fitToScreen, 50);
        window.addEventListener('resize', function() {
            setTimeout(fitToScreen, 100);
        });
        window.addEventListener('orientationchange', function() {
            setTimeout(fitToScreen, 300);
        });

        // WeChat / iOS: resume audio context on first user gesture
        var resumeAudio = function() {
            initAudio();
            document.removeEventListener('touchstart', resumeAudio);
            document.removeEventListener('click', resumeAudio);
        };
        document.addEventListener('touchstart', resumeAudio, { passive: true });
        document.addEventListener('click', resumeAudio);

        // Button bindings
        document.getElementById('btn-standard').addEventListener('click', startStandard);
        document.getElementById('btn-wild').addEventListener('click', startWild);
        document.getElementById('btn-settings').addEventListener('click', function() {
            hideMenu();
            showSettings();
        });
        document.getElementById('btn-back').addEventListener('click', function() {
            hideSettings();
            if (state === 'paused') {
                togglePause(); // resume game
            } else {
                showMenu();
            }
        });

        // Leaderboard buttons & tabs
        var lbTabMode = 'standard';
        document.getElementById('btn-leaderboard').addEventListener('click', function() {
            hideMenu();
            lbTabMode = 'standard';
            updateLbTabs();
            loadLeaderboard('standard');
            showLeaderboard();
        });
        document.getElementById('btn-lb-back').addEventListener('click', function() {
            hideLeaderboard();
            showMenu();
        });
        // No tab HTML needed — we add inline tab buttons dynamically
        // (handled below in leaderboard panel)

        // Game Over buttons
        document.getElementById('btn-restart').addEventListener('click', function() {
            restart();
        });
        document.getElementById('btn-go-settings').addEventListener('click', function() {
            hideGameOver();
            showSettings();
        });
        document.getElementById('btn-go-home').addEventListener('click', function() {
            hideGameOver();
            showMenu();
        });

        // Game Boy buttons: A (boost), B (pause), START, SELECT
        function setupHoldButton(id, onDown, onUp) {
            var btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault(); e.stopPropagation();
                btn.classList.add('active');
                if (onDown) onDown();
            }, { passive: false });
            btn.addEventListener('touchend', function(e) {
                e.preventDefault(); e.stopPropagation();
                btn.classList.remove('active');
                if (onUp) onUp();
            }, { passive: false });
            btn.addEventListener('touchcancel', function() {
                btn.classList.remove('active');
                if (onUp) onUp();
            });
            btn.addEventListener('mousedown', function(e) {
                e.preventDefault();
                btn.classList.add('active');
                if (onDown) onDown();
            });
            btn.addEventListener('mouseup', function() {
                btn.classList.remove('active');
                if (onUp) onUp();
            });
            btn.addEventListener('mouseleave', function() {
                btn.classList.remove('active');
                if (onUp) onUp();
            });
        }

        // A = boost (hold to accelerate)
        setupHoldButton('btn-A', startBoost, stopBoost);

        // B = pause/resume
        setupHoldButton('btn-B', function() {
            if (state === 'playing' || state === 'paused') {
                togglePause();
            }
        }, null);

        // START = start standard / restart / resume
        setupHoldButton('btn-START', function() {
            if (state === 'menu') {
                startStandard();
            } else if (state === 'gameover') {
                restart();
            } else if (state === 'paused') {
                togglePause();
            }
        }, null);

        // SELECT = go to menu / settings
        setupHoldButton('btn-SELECT', function() {
            if (state === 'playing') {
                // Pause first, then show menu
                state = 'paused';
                if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
                hidePause();
                showMenu();
            } else if (state === 'paused') {
                hidePause();
                showMenu();
            } else if (state === 'gameover') {
                hideGameOver();
                showMenu();
            }
        }, null);

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
            setTimeout(fitToScreen, 50);
        });

        // Settings: speed
        var speedSelect = document.getElementById('setting-speed');
        speedSelect.addEventListener('change', function() {
            GAME_SPEED = parseInt(this.value);
            normalSpeed = GAME_SPEED;
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

        // Enter key to restart after game over, Space to pause
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                if (state === 'gameover') {
                    restart();
                } else if (state === 'menu') {
                    startStandard();
                } else if (state === 'paused') {
                    togglePause();
                }
            }
            if (e.key === ' ' || e.key === 'Escape') {
                if (state === 'playing' || state === 'paused') {
                    togglePause();
                    e.preventDefault();
                }
            }
        });

        // Mode info popups
        var infoPopup = document.getElementById('mode-info-popup');
        var infoText = document.getElementById('mode-info-text');
        var infoClose = document.getElementById('mode-info-close');

        function showModeInfo(key) {
            var text = I18n.t(key).replace(/\\n/g, '\n');
            infoText.textContent = '';
            var lines = text.split('\n');
            for (var li = 0; li < lines.length; li++) {
                if (li > 0) infoText.appendChild(document.createElement('br'));
                infoText.appendChild(document.createTextNode(lines[li]));
            }
            infoPopup.style.display = 'block';
        }

        document.getElementById('info-standard').addEventListener('click', function() {
            showModeInfo('info-standard');
        });
        document.getElementById('info-wild').addEventListener('click', function() {
            showModeInfo('info-wild');
        });
        infoClose.addEventListener('click', function() {
            infoPopup.style.display = 'none';
        });
        infoPopup.addEventListener('click', function(e) {
            if (e.target === infoPopup) infoPopup.style.display = 'none';
        });

        // Leaderboard tab switching (inject tab buttons into leaderboard panel)
        var lbPanel = document.getElementById('leaderboard-panel');
        var lbTitle = lbPanel.querySelector('.settings-title');
        var tabRow = document.createElement('div');
        tabRow.className = 'lb-tab-row';
        tabRow.innerHTML = '<button class="lb-tab active" data-mode="standard">' + I18n.t('lb-tab-standard') + '</button>' +
            '<button class="lb-tab" data-mode="wild">' + I18n.t('lb-tab-wild') + '</button>';
        lbTitle.insertAdjacentElement('afterend', tabRow);

        function updateLbTabs() {
            var tabs = tabRow.querySelectorAll('.lb-tab');
            for (var ti = 0; ti < tabs.length; ti++) {
                tabs[ti].classList.toggle('active', tabs[ti].getAttribute('data-mode') === lbTabMode);
            }
            // Update tab text for i18n
            tabs[0].textContent = I18n.t('lb-tab-standard');
            tabs[1].textContent = I18n.t('lb-tab-wild');
        }

        tabRow.addEventListener('click', function(e) {
            var btn = e.target.closest('.lb-tab');
            if (!btn) return;
            lbTabMode = btn.getAttribute('data-mode');
            updateLbTabs();
            loadLeaderboard(lbTabMode);
        });

        showMenu();

        // Apply i18n translations
        I18n.applyAll();

        // Initialize leaderboard (device fingerprint + registration)
        Leaderboard.init(function(err, data) {
            updatePlayerInfo();
        });
    }

    // When returning from menu while paused, resume
    function resumeFromMenu() {
        hideMenu();
        hideSettings();
        if (state === 'paused' && snake && snake.alive) {
            togglePause();
        }
    }

    window.onload = init;

    return {
        start: startGame,
        startStandard: startStandard,
        startWild: startWild,
        restart: restart,
        getState: function() { return state; },
        resumeFromMenu: resumeFromMenu
    };
})();