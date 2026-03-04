// ==========================================
// Internationalization (i18n) Module
// ==========================================
var I18n = (function() {
    // Auto-detect system language: use Chinese for zh-* locales, English otherwise
    var currentLang = (function() {
        try {
            var saved = localStorage.getItem('snake_lang');
            if (saved === 'zh' || saved === 'en') return saved;
        } catch(e) {}
        var nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        return nav.indexOf('zh') === 0 ? 'zh' : 'en';
    })();

    var translations = {
        zh: {
            // Menu
            'start-game': '▶ 开始游戏',
            'mode-standard': '🏆 标准模式',
            'mode-wild': '🎮 狂野模式',
            'info-standard': '📏 标准模式\n• 固定速度 & 地图大小\n• 所有玩家条件相同\n• 成绩计入世界排行榜\n• 为公平竞争而设计',
            'info-wild': '🎉 狂野模式\n• 自由调整速度和地图大小\n• 无边界——穿墙而过！\n• 成绩单独记录\n• 纯粹享受游戏乐趣',
            'leaderboard-btn': '🏆 世界排行',
            'settings-btn': '⚙ 设置',
            'menu-hint': 'D-pad / 键盘 / 触屏滑动控制方向',
            // Pause
            'pause-hint': '按 B 或 START 继续',
            // Nickname
            'set-nickname': '👤 设置昵称',
            'your-name': '你的名字 (最多16字)',
            'name-placeholder': 'Anonymous',
            'confirm': '✓ 确认',
            'back': '← 返回',
            // Leaderboard
            'world-leaderboard': '🏆 世界排行榜',
            'loading': '加载中...',
            'load-error': '⚠ 无法加载排行榜',
            'no-records': '暂无记录，快来创造第一个！',
            'th-player': '玩家',
            'th-best': '最高分',
            'th-games': '场次',
            // Game Over
            'play-again': '▶ 再来一局',
            'go-settings': '⚙ 设置',
            'go-home': '🏠 回到首页',
            // Settings
            'settings-title': '⚙ 设置',
            'screen-size': '屏幕尺寸',
            'game-speed': '游戏速度',
            'volume': '音量',
            'size-256': '小 (256×256)',
            'size-320': '中 (320×320)',
            'size-480': '大 (480×480)',
            'size-640': '超大 (640×640)',
            'speed-160': '慢速',
            'speed-120': '正常',
            'speed-80': '快速',
            'speed-50': '地狱',
            // Controls
            'btn-pause': '暂停',
            'btn-boost': '加速',
            // Settings — language
            'language': '语言',
            'lang-zh': '中文',
            'lang-en': 'English',
            // Settings — skin
            'skin': '🎨 皮肤',
            'skin-classic': '经典 Game Boy',
            'skin-neon': '霓虹',
            'skin-retro': '复古 NES',
            'skin-dark': '暗黑',
            'skin-ocean': '海洋',
            // Settings — vibration
            'vibration': '📳 震动反馈',
            'vibration-on': '开',
            'vibration-off': '关',
            // Stats bubble
            'stats-best': '🏅 最高分: ',
            'stats-rank': '🌍 世界排名 #',
            'stats-no-record': '还没有记录，快来挑战！',
            // Leaderboard tabs
            'lb-tab-standard': '🏆 标准',
            'lb-tab-wild': '🎮 狂野',
            // Game mode indicator
            'mode-label-standard': '[ 标准模式 ]',
            'mode-label-wild': '[ 狂野模式 ]',
            // Dynamic (game.js)
            'score-prefix': '🎯 得分: ',
            'rank-prefix': '🏆 世界排名 #',
            'personal-best': '🎉 个人新纪录！',
            'connecting': '⏳ 连接中...',
            'best-prefix': ' | 🏅 最高: '
        },
        en: {
            // Menu
            'start-game': '▶ Start Game',
            'mode-standard': '🏆 Standard',
            'mode-wild': '🎮 Wild',
            'info-standard': '📏 Standard Mode\n• Fixed speed & map size\n• Same conditions for all\n• Scores on world leaderboard\n• Designed for fair competition',
            'info-wild': '🎉 Wild Mode\n• Customize speed & map size\n• No walls — wrap around!\n• Scores tracked separately\n• Pure fun, no pressure',
            'leaderboard-btn': '🏆 Leaderboard',
            'settings-btn': '⚙ Settings',
            'menu-hint': 'D-pad / Keyboard / Swipe to move',
            // Pause
            'pause-hint': 'Press B or START to resume',
            // Nickname
            'set-nickname': '👤 Set Nickname',
            'your-name': 'Your name (max 16 chars)',
            'name-placeholder': 'Anonymous',
            'confirm': '✓ Confirm',
            'back': '← Back',
            // Leaderboard
            'world-leaderboard': '🏆 World Leaderboard',
            'loading': 'Loading...',
            'load-error': '⚠ Failed to load leaderboard',
            'no-records': 'No records yet. Be the first!',
            'th-player': 'Player',
            'th-best': 'Best',
            'th-games': 'Games',
            // Game Over
            'play-again': '▶ Play Again',
            'go-settings': '⚙ Settings',
            'go-home': '🏠 Home',
            // Settings
            'settings-title': '⚙ Settings',
            'screen-size': 'Screen Size',
            'game-speed': 'Game Speed',
            'volume': 'Volume',
            'size-256': 'Small (256×256)',
            'size-320': 'Medium (320×320)',
            'size-480': 'Large (480×480)',
            'size-640': 'XL (640×640)',
            'speed-160': 'Slow',
            'speed-120': 'Normal',
            'speed-80': 'Fast',
            'speed-50': 'Hell',
            // Controls
            'btn-pause': 'Pause',
            'btn-boost': 'Boost',
            // Settings — language
            'language': 'Language',
            'lang-zh': '中文',
            'lang-en': 'English',
            // Settings — skin
            'skin': '🎨 Skin',
            'skin-classic': 'Classic Game Boy',
            'skin-neon': 'Neon',
            'skin-retro': 'Retro NES',
            'skin-dark': 'Dark',
            'skin-ocean': 'Ocean',
            // Settings — vibration
            'vibration': '📳 Vibration',
            'vibration-on': 'ON',
            'vibration-off': 'OFF',
            // Stats bubble
            'stats-best': '🏅 Best: ',
            'stats-rank': '🌍 World Rank #',
            'stats-no-record': 'No record yet. Start playing!',
            // Leaderboard tabs
            'lb-tab-standard': '🏆 Standard',
            'lb-tab-wild': '🎮 Wild',
            // Game mode indicator
            'mode-label-standard': '[ Standard ]',
            'mode-label-wild': '[ Wild ]',
            // Dynamic (game.js)
            'score-prefix': '🎯 Score: ',
            'rank-prefix': '🏆 World Rank #',
            'personal-best': '🎉 NEW PERSONAL BEST!',
            'connecting': '⏳ Connecting...',
            'best-prefix': ' | 🏅 Best: '
        }
    };

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || key;
    }

    function getLang() { return currentLang; }

    function setLang(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        try { localStorage.setItem('snake_lang', lang); } catch(e) {}
        applyAll();
    }

    function toggle() {
        setLang(currentLang === 'zh' ? 'en' : 'zh');
    }

    // Apply translations to all elements with data-i18n attribute
    function applyAll() {
        var els = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < els.length; i++) {
            var key = els[i].getAttribute('data-i18n');
            var tag = els[i].tagName;
            if (tag === 'INPUT') {
                // For input placeholders
                var attr = els[i].getAttribute('data-i18n-attr');
                if (attr === 'placeholder') {
                    els[i].placeholder = t(key);
                }
            } else {
                els[i].textContent = t(key);
            }
        }
        // Sync language selector in settings
        var sel = document.getElementById('setting-lang');
        if (sel) sel.value = currentLang;
        // Update html lang attribute
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    }

    // Init: language already resolved at top (auto-detect + localStorage)
    // Bind settings dropdown change handler once DOM is ready
    function bindSettingsLang() {
        var sel = document.getElementById('setting-lang');
        if (sel) {
            sel.value = currentLang;
            sel.addEventListener('change', function() {
                setLang(sel.value);
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindSettingsLang);
    } else {
        bindSettingsLang();
    }

    return {
        t: t,
        getLang: getLang,
        setLang: setLang,
        toggle: toggle,
        applyAll: applyAll
    };
})();
