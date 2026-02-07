(function () {
    'use strict';

    // Sidebar theme toggle (desktop)
    const sidebarThemeToggle = document.getElementById('sidebar-theme-toggle');
    const sidebarSunIcon = document.getElementById('sidebar-sun-icon');
    const sidebarMoonIcon = document.getElementById('sidebar-moon-icon');

    // Mobile theme toggle (floating button)
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const mobileSunIcon = document.getElementById('mobile-sun-icon');
    const mobileMoonIcon = document.getElementById('mobile-moon-icon');

    const body = document.body;
    const html = document.documentElement;

    function getSavedTheme() {
        try {
            return localStorage.getItem('theme') || 'light';
        } catch (error) {
            console.warn('localStorage unavailable, using default light theme:', error);
            return 'light';
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
        }
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        body.classList.toggle('dark-mode', isDark);
        html.classList.toggle('dark-mode', isDark);

        // Update sidebar icons if they exist
        if (sidebarSunIcon && sidebarMoonIcon) {
            sidebarSunIcon.classList.toggle('hidden', isDark);
            sidebarMoonIcon.classList.toggle('hidden', !isDark);
        }

        // Update mobile icons if they exist
        if (mobileSunIcon && mobileMoonIcon) {
            mobileSunIcon.classList.toggle('hidden', isDark);
            mobileMoonIcon.classList.toggle('hidden', !isDark);
        }
    }

    function toggleTheme() {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);
    }

    // Apply saved theme on load
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    // Add event listeners to both toggles
    if (sidebarThemeToggle) {
        sidebarThemeToggle.addEventListener('click', toggleTheme);
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }

})();
