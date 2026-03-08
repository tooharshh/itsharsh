(function () {
    'use strict';

    const root = document.getElementById('floating-game-widget');
    if (!root) {
        return;
    }

    const launcher = document.getElementById('floating-game-launcher');
    const panel = document.getElementById('floating-game-panel');
    const closeBtn = document.getElementById('floating-game-close');

    if (!launcher || !panel || !closeBtn) {
        return;
    }

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const state = {
        gameLoaded: false,
        gameLoadingPromise: null,
        gameInstance: null,
        lastFocused: null,
        isOpen: false
    };

    function loadGameScript() {
        if (state.gameLoaded) {
            return Promise.resolve();
        }

        if (state.gameLoadingPromise) {
            return state.gameLoadingPromise;
        }

        const scriptPath = root.getAttribute('data-game-script');
        if (!scriptPath) {
            return Promise.reject(new Error('Game script path missing'));
        }

        state.gameLoadingPromise = new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            script.src = scriptPath;
            script.async = true;
            script.onload = function () {
                state.gameLoaded = true;
                resolve();
            };
            script.onerror = function () {
                reject(new Error('Failed to load mini game script'));
            };
            document.body.appendChild(script);
        });

        return state.gameLoadingPromise;
    }

    function mountGameIfNeeded() {
        if (state.gameInstance) {
            return;
        }

        if (!window.MiniCornerGame || typeof window.MiniCornerGame.mount !== 'function') {
            throw new Error('Mini game runtime unavailable');
        }

        state.gameInstance = window.MiniCornerGame.mount({
            canvasId: 'floating-game-canvas',
            scoreId: 'floating-game-score',
            highScoreId: 'floating-game-high-score',
            qualityId: 'floating-game-quality',
            difficultySelectId: 'floating-game-difficulty',
            statusId: 'floating-game-status',
            startBtnId: 'floating-game-start',
            pauseBtnId: 'floating-game-pause',
            restartBtnId: 'floating-game-restart'
        });
    }

    function getFocusableElements() {
        return panel.querySelectorAll(focusableSelector);
    }

    function trapFocus(event) {
        if (!state.isOpen || event.key !== 'Tab') {
            return;
        }

        const focusables = getFocusableElements();
        if (!focusables.length) {
            return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function handleKeydown(event) {
        if (!state.isOpen) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closePanel();
            return;
        }

        trapFocus(event);
    }

    function openPanel() {
        if (state.isOpen) {
            return;
        }

        state.lastFocused = document.activeElement;
        panel.hidden = false;
        launcher.setAttribute('aria-expanded', 'true');
        root.classList.add('game-open');
        state.isOpen = true;

        loadGameScript()
            .then(function () {
                mountGameIfNeeded();
                if (state.gameInstance && typeof state.gameInstance.resume === 'function') {
                    state.gameInstance.resume();
                }
            })
            .catch(function () {
                const status = document.getElementById('floating-game-status');
                if (status) {
                    status.textContent = 'game unavailable. try reload.';
                }
            });

        const firstFocusable = getFocusableElements()[0];
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    function closePanel() {
        if (!state.isOpen) {
            return;
        }

        panel.hidden = true;
        launcher.setAttribute('aria-expanded', 'false');
        root.classList.remove('game-open');
        state.isOpen = false;

        if (state.gameInstance && typeof state.gameInstance.pause === 'function') {
            state.gameInstance.pause();
        }

        if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
            state.lastFocused.focus();
        } else {
            launcher.focus();
        }
    }

    launcher.addEventListener('click', function () {
        if (state.isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    });

    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', handleKeydown);

    document.addEventListener('visibilitychange', function () {
        if (!state.gameInstance) {
            return;
        }

        if (document.hidden && typeof state.gameInstance.pause === 'function') {
            state.gameInstance.pause();
        } else if (!document.hidden && state.isOpen && typeof state.gameInstance.resume === 'function') {
            state.gameInstance.resume();
        }
    });
})();
