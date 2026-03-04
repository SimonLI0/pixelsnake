// ==========================================
// Device Fingerprint & Leaderboard Client
// ==========================================
var Leaderboard = (function() {
    var API_URL = (function() {
        // Auto-detect: if on GitHub Pages, use VPS HTTPS API; if on VPS, use same host
        var host = window.location.hostname;
        if (host === 'simonli0.github.io') {
            return 'https://72-61-1-189.sslip.io';
        }
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'http://localhost:3001';
        }
        // On VPS (sslip.io domain or direct) — use same origin, nginx proxies /api/
        return '';
    })();

    var deviceId = null;
    var nickname = 'Anonymous';
    var bestScore = 0;
    var registered = false;

    // --- Device Fingerprint ---
    function generateFingerprint() {
        var components = [];

        // Screen
        components.push('s:' + screen.width + 'x' + screen.height + 'x' + screen.colorDepth);
        components.push('a:' + (screen.availWidth || 0) + 'x' + (screen.availHeight || 0));

        // Timezone
        components.push('tz:' + Intl.DateTimeFormat().resolvedOptions().timeZone);
        components.push('to:' + new Date().getTimezoneOffset());

        // Language
        components.push('l:' + (navigator.language || 'unknown'));
        components.push('ls:' + (navigator.languages ? navigator.languages.join(',') : ''));

        // Platform
        components.push('p:' + (navigator.platform || 'unknown'));

        // Hardware concurrency
        components.push('hc:' + (navigator.hardwareConcurrency || 0));

        // Device memory
        components.push('dm:' + (navigator.deviceMemory || 0));

        // Touch support
        components.push('ts:' + ('ontouchstart' in window ? 1 : 0));
        components.push('mt:' + (navigator.maxTouchPoints || 0));

        // Canvas fingerprint
        try {
            var cv = document.createElement('canvas');
            cv.width = 200; cv.height = 50;
            var c = cv.getContext('2d');
            c.textBaseline = 'alphabetic';
            c.fillStyle = '#f60';
            c.fillRect(50, 0, 100, 50);
            c.fillStyle = '#069';
            c.font = '14px Arial';
            c.fillText('PixelSnake!@#$', 2, 15);
            c.fillStyle = 'rgba(102,204,0,0.7)';
            c.font = '18px Georgia';
            c.fillText('PixelSnake!@#$', 4, 40);
            components.push('cv:' + cv.toDataURL());
        } catch(e) {
            components.push('cv:none');
        }

        // WebGL renderer
        try {
            var gl = document.createElement('canvas').getContext('webgl');
            if (gl) {
                var ext = gl.getExtension('WEBGL_debug_renderer_info');
                if (ext) {
                    components.push('gl:' + gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
                    components.push('gv:' + gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
                }
            }
        } catch(e) {
            components.push('gl:none');
        }

        // Hash the components
        var raw = components.join('|');
        return sha256(raw);
    }

    // Simple SHA-256 implementation (no dependencies)
    function sha256(str) {
        // Use Web Crypto if available
        // Fallback: simple hash for sync usage
        var hash = 0;
        var chunks = [];
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
            if (i % 8 === 7) { chunks.push(Math.abs(hash).toString(16)); hash = 0; }
        }
        if (hash !== 0) chunks.push(Math.abs(hash).toString(16));
        // Pad to 64 chars
        var result = chunks.join('');
        while (result.length < 64) result = result + '0';
        return result.substring(0, 64);
    }

    // --- API calls ---
    function apiPost(path, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', API_URL + path, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 5000;
        xhr.onload = function() {
            try { callback(null, JSON.parse(xhr.responseText)); }
            catch(e) { callback(e); }
        };
        xhr.onerror = function() { callback(new Error('Network error')); };
        xhr.ontimeout = function() { callback(new Error('Timeout')); };
        xhr.send(JSON.stringify(data));
    }

    function apiGet(path, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', API_URL + path, true);
        xhr.timeout = 5000;
        xhr.onload = function() {
            try { callback(null, JSON.parse(xhr.responseText)); }
            catch(e) { callback(e); }
        };
        xhr.onerror = function() { callback(new Error('Network error')); };
        xhr.ontimeout = function() { callback(new Error('Timeout')); };
        xhr.send();
    }

    // --- Public API ---
    function init(callback) {
        deviceId = generateFingerprint();

        // Try to load saved nickname
        try {
            var saved = localStorage.getItem('snake_nickname');
            if (saved) nickname = saved;
        } catch(e) {}

        register(callback);
    }

    function register(callback) {
        apiPost('/api/register', { device_id: deviceId, nickname: nickname }, function(err, data) {
            if (!err && data && data.player) {
                registered = true;
                nickname = data.player.nickname;
                bestScore = data.best_score || 0;
            }
            if (callback) callback(err, data);
        });
    }

    function setNickname(name, callback) {
        nickname = name.trim().substring(0, 16);
        try { localStorage.setItem('snake_nickname', nickname); } catch(e) {}
        if (deviceId) {
            register(callback);
        }
    }

    function submitScore(score, callback) {
        if (!deviceId || !registered) {
            if (callback) callback(new Error('Not registered'));
            return;
        }
        apiPost('/api/scores', {
            device_id: deviceId,
            score: score,
            speed: GAME_SPEED,
            grid_size: CANVAS_WIDTH + 'x' + CANVAS_HEIGHT,
            game_mode: GAME_MODE,
            input_mode: Controls.getInputMode()
        }, function(err, data) {
            if (!err && data) {
                if (data.best_score) bestScore = data.best_score;
            }
            if (callback) callback(err, data);
        });
    }

    function getLeaderboard(gameMode, callback) {
        var mode = gameMode || 'standard';
        apiGet('/api/leaderboard?limit=20&game_mode=' + mode, callback);
    }

    function getMyStats(callback) {
        if (!deviceId) { callback(new Error('No device id')); return; }
        apiGet('/api/stats/' + deviceId, callback);
    }

    return {
        init: init,
        setNickname: setNickname,
        submitScore: submitScore,
        getLeaderboard: getLeaderboard,
        getMyStats: getMyStats,
        getNickname: function() { return nickname; },
        getBestScore: function() { return bestScore; },
        getDeviceId: function() { return deviceId; },
        isRegistered: function() { return registered; }
    };
})();
