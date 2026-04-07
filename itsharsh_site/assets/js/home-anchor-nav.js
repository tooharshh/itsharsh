(function () {
    'use strict';

    function mountHomeAnchorNav() {
        var nav = document.querySelector('.home-anchor-nav');
        var header = document.querySelector('.site-header');

        if (!nav || !header) {
            return;
        }

        var ticking = false;

        function updateVisibility() {
            var threshold = header.offsetTop + header.offsetHeight;
            var shouldShow = window.scrollY > threshold;
            nav.classList.toggle('is-visible', shouldShow);
        }

        function onScroll() {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(function () {
                updateVisibility();
                ticking = false;
            });
        }

        updateVisibility();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateVisibility, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountHomeAnchorNav);
    } else {
        mountHomeAnchorNav();
    }
})();
