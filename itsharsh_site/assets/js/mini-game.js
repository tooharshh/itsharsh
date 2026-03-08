(function () {
    'use strict';

    const STORAGE_HIGH_SCORE = 'mini_game_high_score';
    const STORAGE_QUALITY = 'mini_game_quality_tier';
    const STORAGE_DIFFICULTY = 'mini_game_difficulty';

    const VALID_DIFFICULTIES = {
        normal: true,
        medium: true,
        high: true,
        godmode: true
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function detectTier() {
        const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const memory = Number(navigator.deviceMemory || 0);
        const cores = Number(navigator.hardwareConcurrency || 0);

        if (reducedMotion || (memory > 0 && memory <= 2) || (cores > 0 && cores <= 4)) {
            return 'low';
        }

        if ((memory > 0 && memory <= 4) || (cores > 0 && cores <= 8)) {
            return 'medium';
        }

        return 'high';
    }

    function getTierConfig(tier) {
        if (tier === 'low') {
            return {
                fpsCap: 30,
                renderScale: 0.75,
                baseHazardCount: 1,
                playerSpeed: 140,
                baseHazardSpeedMin: 45,
                baseHazardSpeedMax: 75,
                baseScoreRate: 8,
                hazardCap: 4
            };
        }

        if (tier === 'medium') {
            return {
                fpsCap: 45,
                renderScale: 0.9,
                baseHazardCount: 2,
                playerSpeed: 160,
                baseHazardSpeedMin: 55,
                baseHazardSpeedMax: 95,
                baseScoreRate: 10,
                hazardCap: 6
            };
        }

        return {
            fpsCap: 60,
            renderScale: 1,
            baseHazardCount: 3,
            playerSpeed: 175,
            baseHazardSpeedMin: 65,
            baseHazardSpeedMax: 115,
            baseScoreRate: 12,
            hazardCap: 8
        };
    }

    function getDifficultyConfig(difficulty) {
        if (difficulty === 'medium') {
            return {
                hazardCount: 2,
                hazardSpeedMultiplier: 1.15,
                scoreMultiplier: 1.12,
                playerSpeedMultiplier: 0.98
            };
        }

        if (difficulty === 'high') {
            return {
                hazardCount: 3,
                hazardSpeedMultiplier: 1.32,
                scoreMultiplier: 1.3,
                playerSpeedMultiplier: 0.95
            };
        }

        if (difficulty === 'godmode') {
            return {
                hazardCount: 4,
                hazardSpeedMultiplier: 1.52,
                scoreMultiplier: 1.55,
                playerSpeedMultiplier: 0.92
            };
        }

        return {
            hazardCount: 1,
            hazardSpeedMultiplier: 1,
            scoreMultiplier: 1,
            playerSpeedMultiplier: 1
        };
    }

    function buildGameConfig(perfConfig, difficulty) {
        const difficultyConfig = getDifficultyConfig(difficulty);
        return {
            fpsCap: perfConfig.fpsCap,
            renderScale: perfConfig.renderScale,
            hazardCount: difficultyConfig.hazardCount,
            playerSpeed: perfConfig.playerSpeed * difficultyConfig.playerSpeedMultiplier,
            hazardSpeedMin: perfConfig.baseHazardSpeedMin * difficultyConfig.hazardSpeedMultiplier,
            hazardSpeedMax: perfConfig.baseHazardSpeedMax * difficultyConfig.hazardSpeedMultiplier,
            scoreRate: perfConfig.baseScoreRate * difficultyConfig.scoreMultiplier
        };
    }

    function readStoredHighScore() {
        try {
            return Number(localStorage.getItem(STORAGE_HIGH_SCORE) || 0);
        } catch (error) {
            return 0;
        }
    }

    function writeStoredHighScore(score) {
        try {
            localStorage.setItem(STORAGE_HIGH_SCORE, String(score));
        } catch (error) {
            // Ignore storage failures in private mode.
        }
    }

    function writeStoredTier(tier) {
        try {
            localStorage.setItem(STORAGE_QUALITY, tier);
        } catch (error) {
            // Ignore storage failures in private mode.
        }
    }

    function readStoredDifficulty() {
        try {
            const value = localStorage.getItem(STORAGE_DIFFICULTY) || 'normal';
            return VALID_DIFFICULTIES[value] ? value : 'normal';
        } catch (error) {
            return 'normal';
        }
    }

    function writeStoredDifficulty(difficulty) {
        try {
            localStorage.setItem(STORAGE_DIFFICULTY, difficulty);
        } catch (error) {
            // Ignore storage failures in private mode.
        }
    }

    function randomInRange(min, max) {
        return min + Math.random() * (max - min);
    }

    function randomHazard(width, height, config) {
        return {
            x: randomInRange(20, width - 20),
            y: randomInRange(20, height - 20),
            radius: 7,
            vx: (Math.random() < 0.5 ? -1 : 1) * randomInRange(config.hazardSpeedMin, config.hazardSpeedMax),
            vy: (Math.random() < 0.5 ? -1 : 1) * randomInRange(config.hazardSpeedMin, config.hazardSpeedMax)
        };
    }

    function collidesCircleRect(circle, rect) {
        const nearestX = clamp(circle.x, rect.x, rect.x + rect.width);
        const nearestY = clamp(circle.y, rect.y, rect.y + rect.height);
        const dx = circle.x - nearestX;
        const dy = circle.y - nearestY;
        return dx * dx + dy * dy <= circle.radius * circle.radius;
    }

    function collidesRectRect(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    function mount(options) {
        const canvas = document.getElementById(options.canvasId);
        const scoreEl = document.getElementById(options.scoreId);
        const highScoreEl = document.getElementById(options.highScoreId);
        const qualityEl = document.getElementById(options.qualityId);
        const statusEl = document.getElementById(options.statusId);
        const difficultySelectEl = document.getElementById(options.difficultySelectId);
        const startBtn = document.getElementById(options.startBtnId);
        const pauseBtn = document.getElementById(options.pauseBtnId);
        const restartBtn = document.getElementById(options.restartBtnId);

        if (!canvas || !scoreEl || !highScoreEl || !qualityEl || !difficultySelectEl || !statusEl || !startBtn || !pauseBtn || !restartBtn) {
            throw new Error('Mini game mount elements missing');
        }

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) {
            throw new Error('Canvas context unavailable');
        }

        const baseWidth = 320;
        const baseHeight = 200;
        let tier = detectTier();
        let difficulty = readStoredDifficulty();
        let perfConfig = getTierConfig(tier);
        let config = buildGameConfig(perfConfig, difficulty);
        let frameInterval = 1000 / config.fpsCap;
        let isRunning = false;
        let isMounted = true;
        let gameState = 'idle';
        let rafId = 0;
        let lastTime = 0;
        let accumulator = 0;
        let score = 0;
        let highScore = readStoredHighScore();
        let pointers = { active: false, x: 0, y: 0 };
        let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };

        const world = {
            width: baseWidth,
            height: baseHeight,
            player: { x: 24, y: 24, width: 13, height: 13 },
            coin: { x: 130, y: 100, width: 9, height: 9 },
            hazards: []
        };

        function applyCanvasScale() {
            const dpr = window.devicePixelRatio || 1;
            const internalScale = config.renderScale * Math.min(dpr, 2);
            canvas.width = Math.floor(baseWidth * internalScale);
            canvas.height = Math.floor(baseHeight * internalScale);
            canvas.style.width = baseWidth + 'px';
            canvas.style.height = baseHeight + 'px';
            ctx.setTransform(internalScale, 0, 0, internalScale, 0, 0);
            ctx.imageSmoothingEnabled = false;
        }

        function resetWorld() {
            world.player.x = 24;
            world.player.y = 24;
            world.coin.x = randomInRange(18, world.width - 18);
            world.coin.y = randomInRange(18, world.height - 18);
            world.hazards = [];

            for (let i = 0; i < config.hazardCount; i += 1) {
                world.hazards.push(randomHazard(world.width, world.height, config));
            }

            score = 0;
            updateStats();
            statusEl.textContent = 'collect dots. avoid dashes.';
        }

        function updateStats() {
            scoreEl.textContent = 'score: ' + Math.floor(score);
            highScoreEl.textContent = 'high: ' + Math.floor(highScore);
            qualityEl.textContent = 'perf: ' + tier;
        }

        function handleInput(dt) {
            const speed = config.playerSpeed * dt;

            if (keys.ArrowLeft) {
                world.player.x -= speed;
            }
            if (keys.ArrowRight) {
                world.player.x += speed;
            }
            if (keys.ArrowUp) {
                world.player.y -= speed;
            }
            if (keys.ArrowDown) {
                world.player.y += speed;
            }

            if (pointers.active) {
                world.player.x += (pointers.x - (world.player.x + world.player.width / 2)) * clamp(dt * 10, 0, 1);
                world.player.y += (pointers.y - (world.player.y + world.player.height / 2)) * clamp(dt * 10, 0, 1);
            }

            world.player.x = clamp(world.player.x, 0, world.width - world.player.width);
            world.player.y = clamp(world.player.y, 0, world.height - world.player.height);
        }

        function updateHazards(dt) {
            for (let i = 0; i < world.hazards.length; i += 1) {
                const h = world.hazards[i];
                h.x += h.vx * dt;
                h.y += h.vy * dt;

                if (h.x < h.radius || h.x > world.width - h.radius) {
                    h.vx *= -1;
                    h.x = clamp(h.x, h.radius, world.width - h.radius);
                }

                if (h.y < h.radius || h.y > world.height - h.radius) {
                    h.vy *= -1;
                    h.y = clamp(h.y, h.radius, world.height - h.radius);
                }
            }
        }

        function checkCollisions() {
            if (collidesRectRect(world.player, world.coin)) {
                score += 14;
                world.coin.x = randomInRange(10, world.width - 10);
                world.coin.y = randomInRange(10, world.height - 10);
            }

            for (let i = 0; i < world.hazards.length; i += 1) {
                if (collidesCircleRect(world.hazards[i], world.player)) {
                    endRound();
                    return;
                }
            }
        }

        function endRound() {
            isRunning = false;
            gameState = 'gameover';
            statusEl.textContent = 'game over. restart?';
            if (score > highScore) {
                highScore = Math.floor(score);
                writeStoredHighScore(highScore);
                statusEl.textContent = 'new high score.';
            }
            updateStats();
        }

        function update(dt) {
            if (!isRunning) {
                return;
            }

            handleInput(dt);
            updateHazards(dt);
            checkCollisions();
            score += config.scoreRate * dt;
            updateStats();
        }

        function drawGrid() {
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#2c3136';
            ctx.globalAlpha = 0.18;
            for (let x = 0; x <= world.width; x += 16) {
                ctx.beginPath();
                ctx.moveTo(x + 0.5, 0);
                ctx.lineTo(x + 0.5, world.height);
                ctx.stroke();
            }
            for (let y = 0; y <= world.height; y += 16) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(world.width, y + 0.5);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        function render() {
            const style = getComputedStyle(document.documentElement);
            const bgColor = style.getPropertyValue('--bg-color').trim() || '#fffafa';
            const textColor = style.getPropertyValue('--text-color').trim() || '#212427';
            const secondaryColor = style.getPropertyValue('--text-secondary').trim() || '#586069';

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, world.width, world.height);
            drawGrid();

            ctx.fillStyle = textColor;
            ctx.fillRect(world.player.x, world.player.y, world.player.width, world.player.height);

            ctx.strokeStyle = textColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(world.coin.x, world.coin.y, world.coin.width / 2, 0, Math.PI * 2);
            ctx.stroke();

            for (let i = 0; i < world.hazards.length; i += 1) {
                const h = world.hazards[i];
                ctx.beginPath();
                ctx.moveTo(h.x - h.radius, h.y - h.radius);
                ctx.lineTo(h.x + h.radius, h.y + h.radius);
                ctx.moveTo(h.x + h.radius, h.y - h.radius);
                ctx.lineTo(h.x - h.radius, h.y + h.radius);
                ctx.stroke();
            }

            if (gameState === 'gameover') {
                const bannerHeight = 36;
                const bannerY = Math.floor((world.height - bannerHeight) / 2);

                ctx.fillStyle = bgColor;
                ctx.fillRect(0, bannerY, world.width, bannerHeight);

                ctx.strokeStyle = textColor;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(0, bannerY + 0.5);
                ctx.lineTo(world.width, bannerY + 0.5);
                ctx.moveTo(0, bannerY + bannerHeight - 0.5);
                ctx.lineTo(world.width, bannerY + bannerHeight - 0.5);
                ctx.stroke();

                ctx.fillStyle = secondaryColor;
                ctx.font = '700 24px "Space Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = textColor;
                ctx.fillText('you lost :(', world.width / 2, bannerY + bannerHeight / 2 + 1);
            }
        }

        function tick(now) {
            if (!isMounted) {
                return;
            }

            if (!lastTime) {
                lastTime = now;
            }

            const delta = Math.min(now - lastTime, 100);
            lastTime = now;
            accumulator += delta;

            while (accumulator >= frameInterval) {
                update(frameInterval / 1000);
                accumulator -= frameInterval;
            }

            render();
            rafId = window.requestAnimationFrame(tick);
        }

        function normalizePointer(event) {
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * (world.width / rect.width);
            const y = (event.clientY - rect.top) * (world.height / rect.height);
            pointers.x = clamp(x, 0, world.width);
            pointers.y = clamp(y, 0, world.height);
        }

        function onPointerDown(event) {
            pointers.active = true;
            normalizePointer(event);
        }

        function onPointerMove(event) {
            if (!pointers.active) {
                return;
            }
            normalizePointer(event);
        }

        function onPointerUp() {
            pointers.active = false;
        }

        function onKeyDown(event) {
            if (Object.prototype.hasOwnProperty.call(keys, event.key)) {
                keys[event.key] = true;
                event.preventDefault();
            }
        }

        function onKeyUp(event) {
            if (Object.prototype.hasOwnProperty.call(keys, event.key)) {
                keys[event.key] = false;
                event.preventDefault();
            }
        }

        function start() {
            isRunning = true;
            gameState = 'running';
            statusEl.textContent = 'running.';
            canvas.focus();
        }

        function pause() {
            isRunning = false;
            if (gameState !== 'gameover') {
                gameState = 'paused';
            }
            statusEl.textContent = 'paused.';
        }

        function resume() {
            render();
        }

        function restart() {
            resetWorld();
            gameState = 'running';
            start();
        }

        function recalcTier() {
            const detected = detectTier();
            if (detected !== tier) {
                tier = detected;
                perfConfig = getTierConfig(tier);
                config = buildGameConfig(perfConfig, difficulty);
                frameInterval = 1000 / config.fpsCap;
                writeStoredTier(tier);
                applyCanvasScale();
                resetWorld();
            }
            updateStats();
        }

        function applyDifficulty(nextDifficulty) {
            if (!VALID_DIFFICULTIES[nextDifficulty]) {
                return;
            }

            difficulty = nextDifficulty;
            perfConfig = getTierConfig(tier);
            config = buildGameConfig(perfConfig, difficulty);
            frameInterval = 1000 / config.fpsCap;
            writeStoredDifficulty(difficulty);
            difficultySelectEl.value = difficulty;
            resetWorld();

            if (isRunning) {
                statusEl.textContent = 'difficulty updated. keep going.';
            } else {
                statusEl.textContent = 'difficulty updated. press start.';
            }

            updateStats();
        }

        startBtn.addEventListener('click', start);
        pauseBtn.addEventListener('click', pause);
        restartBtn.addEventListener('click', restart);
        difficultySelectEl.addEventListener('change', function (event) {
            applyDifficulty(event.target.value);
        });

        canvas.addEventListener('keydown', onKeyDown);
        canvas.addEventListener('keyup', onKeyUp);
        canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
        canvas.addEventListener('pointermove', onPointerMove, { passive: true });
        canvas.addEventListener('pointerup', onPointerUp, { passive: true });
        canvas.addEventListener('pointerleave', onPointerUp, { passive: true });

        window.addEventListener('resize', recalcTier, { passive: true });

        applyCanvasScale();
        writeStoredTier(tier);
        difficultySelectEl.value = difficulty;
        writeStoredDifficulty(difficulty);
        resetWorld();
        updateStats();
        rafId = window.requestAnimationFrame(tick);

        return {
            pause: pause,
            resume: resume,
            start: start,
            restart: restart,
            destroy: function () {
                isMounted = false;
                window.cancelAnimationFrame(rafId);
            }
        };
    }

    window.MiniCornerGame = {
        mount: mount
    };
})();
