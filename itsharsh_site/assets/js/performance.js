(function() {
    'use strict';
    
    if (!window.PerformanceObserver) {
        console.log('Performance monitoring not supported in this browser');
        return;
    }
    
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
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
    } catch (error) {
        console.warn('LCP monitoring failed:', error);
    }
    
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
        fidObserver.observe({ entryTypes: ['first-input'], buffered: true });
    } catch (error) {
        console.warn('FID monitoring failed:', error);
    }
    
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
        clsObserver.observe({ entryTypes: ['layout-shift'], buffered: true });
    } catch (error) {
        console.warn('CLS monitoring failed:', error);
    }
    
    try {
        const resourceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.duration > 100) {
                    console.log('📦 Slow Resource:', {
                        name: entry.name.split('/').pop(),
                        type: entry.initiatorType,
                        duration: `${Math.round(entry.duration)}ms`,
                        size: entry.transferSize ? `${Math.round(entry.transferSize / 1024)}KB` : 'cached'
                    });
                }
            });
        });
        resourceObserver.observe({ entryTypes: ['resource'], buffered: true });
    } catch (error) {
        console.warn('Resource monitoring failed:', error);
    }
    
    window.addEventListener('load', function() {
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
    
    try {
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.warn('⚠️ Long Task Detected:', {
                    duration: `${Math.round(entry.duration)}ms`,
                    startTime: `${Math.round(entry.startTime)}ms`
                });
            }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {}
    
})();
