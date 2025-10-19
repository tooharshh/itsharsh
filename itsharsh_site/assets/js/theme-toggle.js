/**
 * THEME TOGGLE FUNCTIONALITY
 * Handles light/dark mode switching with localStorage persistence
 * 
 * This script manages the theme toggle button and ensures:
 * 1. User's preference persists across page loads
 * 2. Icons (sun/moon) switch smoothly with animations
 * 3. Theme applies to both <body> and <html> elements for comprehensive coverage
 * 4. Graceful error handling if localStorage is unavailable (e.g., private browsing)
 * 
 * ANTI-FOUC STRATEGY:
 * This script runs at the end of <body> and syncs with the <head> script
 * that applies theme before page render to prevent Flash of Unstyled Content
 */

(function() {
    'use strict';
    
    /**
     * DOM ELEMENT REFERENCES
     * Cache all required DOM elements for performance
     * If any element is missing, script exits gracefully without breaking the page
     */
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const body = document.body;
    const html = document.documentElement;
    
    // Exit gracefully if required elements don't exist
    if (!themeToggle || !sunIcon || !moonIcon) {
        console.warn('Theme toggle elements not found. Theme switching disabled.');
        return;
    }
    
    /**
     * GET SAVED THEME WITH ERROR HANDLING
     * Attempts to retrieve saved theme from localStorage
     * Falls back to 'light' if localStorage is unavailable or throws error
     * 
     * Why try-catch?
     * - Private browsing modes often block localStorage
     * - Some browsers allow users to disable storage
     * - Prevents entire site from breaking if storage fails
     */
    function getSavedTheme() {
        try {
            return localStorage.getItem('theme') || 'light';
        } catch (error) {
            console.warn('localStorage unavailable, using default light theme:', error);
            return 'light';
        }
    }
    
    /**
     * SAVE THEME TO LOCALSTORAGE
     * Persists user's theme choice for future visits
     * Wrapped in try-catch for same reasons as getSavedTheme
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Could not save theme preference:', error);
            // Site continues to work, just won't remember preference on next visit
        }
    }
    
    /**
     * APPLY THEME TO DOM
     * Updates classes and icon visibility based on theme
     * 
     * Why both body and html?
     * - Some CSS rules target body.dark-mode
     * - Others target html.dark-mode (for cascading to all elements)
     * - Ensures complete theme coverage across all components
     */
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        
        // Toggle dark-mode class on both elements
        body.classList.toggle('dark-mode', isDark);
        html.classList.toggle('dark-mode', isDark);
        
        // Switch icon visibility with smooth animations (handled by CSS)
        sunIcon.classList.toggle('hidden', isDark);
        moonIcon.classList.toggle('hidden', !isDark);
    }
    
    /**
     * INITIALIZE THEME ON PAGE LOAD
     * Retrieves saved theme and applies it
     * This syncs with the <head> script that prevents FOUC
     */
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    
    /**
     * THEME TOGGLE EVENT LISTENER
     * Handles click events on the toggle button
     * 
     * Flow:
     * 1. User clicks button
     * 2. Determine new theme (toggle between light/dark)
     * 3. Apply theme to DOM
     * 4. Save preference to localStorage
     * 
     * The CSS transitions defined in main.scss provide smooth animations
     */
    themeToggle.addEventListener('click', function() {
        // Get current theme from body class
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        
        // Toggle to opposite theme
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        applyTheme(newTheme);
        
        // Save preference
        saveTheme(newTheme);
    });
    
    /**
     * KEYBOARD ACCESSIBILITY
     * Theme toggle button already has aria-label in HTML
     * Button element provides native keyboard support (Space/Enter to activate)
     * Focus styles are defined in main.scss for :focus-visible
     */
    
})();
