/**
 * PERFORMANCE MONITORING
 * Tracks and logs key performance metrics using modern browser APIs
 * 
 * This script:
 * 1. Monitors Core Web Vitals (LCP, FID, CLS)
 * 2. Logs resource loading times
 * 3. Tracks navigation timing
 * 4. Reports long tasks
 * 
 * WHY PERFORMANCE MONITORING?
 * - Identifies bottlenecks and slow resources
 * - Validates optimization efforts
 * - Provides real user monitoring (RUM) data
 * - Helps maintain fast page loads
 * 
 * PRIVACY:
 * - Data only logged to console (not sent to servers)
 * - No personal information collected
 * - Fully client-side processing
 * 
 * USAGE:
 * - Load this script at the end of <body> with async attribute
 * - Open DevTools Console to see performance metrics
 * - Use data to identify optimization opportunities
 */

(function() {
    'use strict';
    
    /**
     * CHECK FOR PERFORMANCE API SUPPORT
     * PerformanceObserver API not available in all browsers
     * Gracefully degrade if not supported
     */
    if (!window.PerformanceObserver) {
        console.log('Performance monitoring not supported in this browser');
        return;
    }
    
    /**
     * LARGEST CONTENTFUL PAINT (LCP)
     * Measures loading performance - when the largest content element becomes visible
     * 
     * Good LCP: < 2.5 seconds
     * Needs improvement: 2.5 - 4 seconds
     * Poor: > 4 seconds
     * 
     * LCP candidates: images, video, block-level text elements
     */
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            console.log('📊 Largest Contentful Paint:', {
                time: `${lastEntry.renderTime || lastEntry.loadTime}ms`,
                element: lastEntry.element,
                size: lastEntry.size
            });
        });
        
        lcpObserver.observe({ 
            entryTypes: ['largest-contentful-paint'],
            buffered: true 
        });
    } catch (error) {
        console.warn('LCP monitoring failed:', error);
    }
    
    /**
     * FIRST INPUT DELAY (FID)
     * Measures interactivity - time from user's first interaction to browser response
     * 
     * Good FID: < 100ms
     * Needs improvement: 100 - 300ms
     * Poor: > 300ms
     * 
     * Interactions: clicks, taps, key presses
     */
    try {
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                console.log('📊 First Input Delay:', {
                    delay: `${entry.processingStart - entry.startTime}ms`,
                    type: entry.name,
                    duration: `${entry.duration}ms`
                });
            });
        });
        
        fidObserver.observe({ 
            entryTypes: ['first-input'],
            buffered: true 
        });
    } catch (error) {
        console.warn('FID monitoring failed:', error);
    }
    
    /**
     * CUMULATIVE LAYOUT SHIFT (CLS)
     * Measures visual stability - sum of all unexpected layout shifts
     * 
     * Good CLS: < 0.1
     * Needs improvement: 0.1 - 0.25
     * Poor: > 0.25
     * 
     * Causes: images without dimensions, dynamic content, web fonts
     */
    try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                }
            }
            console.log('📊 Cumulative Layout Shift:', clsScore.toFixed(3));
        });
        
        clsObserver.observe({ 
            entryTypes: ['layout-shift'],
            buffered: true 
        });
    } catch (error) {
        console.warn('CLS monitoring failed:', error);
    }
    
    /**
     * RESOURCE LOADING TIMES
     * Tracks how long each resource (CSS, JS, images, fonts) takes to load
     * Helps identify slow resources that need optimization
     */
    try {
        const resourceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                // Only log resources that took significant time (>100ms)
                if (entry.duration > 100) {
                    console.log('📦 Slow Resource:', {
                        name: entry.name.split('/').pop(), // Just filename
                        type: entry.initiatorType,
                        duration: `${Math.round(entry.duration)}ms`,
                        size: entry.transferSize ? `${Math.round(entry.transferSize / 1024)}KB` : 'cached'
                    });
                }
            });
        });
        
        resourceObserver.observe({ 
            entryTypes: ['resource'],
            buffered: true 
        });
    } catch (error) {
        console.warn('Resource monitoring failed:', error);
    }
    
    /**
     * NAVIGATION TIMING
     * Comprehensive timing for page load stages
     * Logged when page load completes
     */
    window.addEventListener('load', function() {
        // Give browser time to settle
        setTimeout(function() {
            try {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('📈 Navigation Timing:', {
                        'DNS Lookup': `${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`,
                        'Connection': `${Math.round(perfData.connectEnd - perfData.connectStart)}ms`,
                        'Request': `${Math.round(perfData.responseStart - perfData.requestStart)}ms`,
                        'Response': `${Math.round(perfData.responseEnd - perfData.responseStart)}ms`,
                        'DOM Processing': `${Math.round(perfData.domComplete - perfData.domInteractive)}ms`,
                        'Total Load Time': `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`
                    });
                }
            } catch (error) {
                console.warn('Navigation timing failed:', error);
            }
        }, 0);
    });
    
    /**
     * LONG TASKS DETECTION
     * Identifies JavaScript execution that blocks the main thread
     * Long tasks (>50ms) can cause janky interactions
     * 
     * Note: Requires 'longtask' permission in some browsers
     */
    try {
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.warn('⚠️ Long Task Detected:', {
                    duration: `${Math.round(entry.duration)}ms`,
                    startTime: `${Math.round(entry.startTime)}ms`
                });
            }
        });
        
        longTaskObserver.observe({ 
            entryTypes: ['longtask']
        });
    } catch (error) {
        // longtask not supported in all browsers - silently ignore
    }
    
})();
