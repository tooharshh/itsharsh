/**
 * Hamburger Menu Toggle
 * Handles mobile/tablet menu open/close functionality
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const hamburgerToggle = document.getElementById('hamburger-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const body = document.body;

        if (!hamburgerToggle || !mobileMenu) {
            return; // Elements not found, exit gracefully
        }

        // Toggle menu on hamburger click
        hamburgerToggle.addEventListener('click', function () {
            const isOpen = mobileMenu.classList.contains('active');

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking on a navigation link
        const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnHamburger = hamburgerToggle.contains(event.target);

            if (!isClickInsideMenu && !isClickOnHamburger && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
                hamburgerToggle.focus(); // Return focus to hamburger button
            }
        });

        function openMenu() {
            mobileMenu.classList.add('active');
            hamburgerToggle.classList.add('active');
            hamburgerToggle.setAttribute('aria-expanded', 'true');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        }

        function closeMenu() {
            mobileMenu.classList.remove('active');
            hamburgerToggle.classList.remove('active');
            hamburgerToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = ''; // Restore scrolling
        }
    }
})();
