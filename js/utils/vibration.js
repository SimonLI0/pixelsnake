// ==========================================
// Vibration API wrapper — haptic feedback
// ==========================================
var Vibration = (function() {
    'use strict';

    var enabled = true;
    var supported = !!(navigator && navigator.vibrate);

    // Restore saved preference
    try {
        var saved = localStorage.getItem('vibrationEnabled');
        if (saved === 'false') enabled = false;
    } catch(e) {}

    function _vibrate(pattern) {
        if (!enabled || !supported) return;
        try { navigator.vibrate(pattern); } catch(e) {}
    }

    return {
        /** Eat food — short pulse */
        eatFood: function() { _vibrate(30); },

        /** Game over — long buzz */
        gameOver: function() { _vibrate(200); },

        /** New personal best — double pulse */
        newRecord: function() { _vibrate([50, 50, 50]); },

        /** Wrap around wall (wild mode) — light tap */
        wrapAround: function() { _vibrate(15); },

        /** Toggle */
        setEnabled: function(val) {
            enabled = !!val;
            try { localStorage.setItem('vibrationEnabled', enabled); } catch(e) {}
        },
        isEnabled: function() { return enabled; },
        isSupported: function() { return supported; }
    };
})();
