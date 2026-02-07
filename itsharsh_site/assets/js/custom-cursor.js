const initCursor = () => {
    const cursor = document.getElementById('custom-cursor');

    if (cursor) {
        document.body.classList.add('has-custom-cursor');

        // Variables for smoothing
        let mouseX = -100;
        let mouseY = -100;
        let cursorX = -100;
        let cursorY = -100;
        let isVisible = false;

        // Hide initially to prevent jump
        cursor.style.opacity = '0';

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                cursorX = mouseX;
                cursorY = mouseY;
                cursor.style.opacity = '1';
            }
        });

        // Smooth animation loop
        const lerp = (start, end, factor) => {
            return start + (end - start) * factor;
        };

        const updateCursor = () => {
            if (isVisible) {
                // 0.15 factor for "very little" lag
                cursorX = lerp(cursorX, mouseX, 0.15);
                cursorY = lerp(cursorY, mouseY, 0.15);
                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
            }
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'LABEL', 'BLOCKQUOTE', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SPAN'];
            const isInteractive = target.closest('a') || target.closest('button');

            if (textTags.includes(target.tagName) && !isInteractive) {
                cursor.classList.add('is-text');
            } else {
                cursor.classList.remove('is-text');
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}
