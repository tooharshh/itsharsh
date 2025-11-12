(function() {
    'use strict';
    
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const body = document.body;
    const html = document.documentElement;
    
    if (!themeToggle || !sunIcon || !moonIcon) {
        console.warn('Theme toggle elements not found. Theme switching disabled.');
        return;
    }
    
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
        sunIcon.classList.toggle('hidden', isDark);
        moonIcon.classList.toggle('hidden', !isDark);
    }
    
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        saveTheme(newTheme);
    });
    
})();
