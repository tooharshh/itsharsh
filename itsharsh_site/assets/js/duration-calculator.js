/**
 * EXPERIENCE DURATION CALCULATOR
 * Automatically calculates and displays time spans for work experience
 * 
 * This script:
 * 1. Finds all elements with duration data attributes (data-start, data-end)
 * 2. Calculates the time difference in years and months
 * 3. Formats the output in LinkedIn-style format (e.g., "1 yr 3 mos", "6 mos")
 * 4. Handles ongoing positions with "present" as end date
 * 5. Updates daily for positions that are still active
 * 
 * DATA ATTRIBUTES EXPECTED:
 * - data-start: Start date in YYYY-MM format (e.g., "2025-04")
 * - data-end: End date in YYYY-MM format or "present" for current positions
 * 
 * USAGE IN HTML:
 * <p class="duration" data-start="2025-04" data-end="present">
 *   Apr 2025 - Present · <span class="duration-calc"></span>
 * </p>
 */

(function() {
    'use strict';
    
    /**
     * CALCULATE AND UPDATE DURATIONS
     * Main function that processes all duration elements on the page
     * 
     * Error handling:
     * - Validates date format before parsing
     * - Handles missing elements gracefully
     * - Logs warnings for debugging but doesn't break the page
     */
    function calculateDuration() {
        // Find all elements with duration data
        const durationElements = document.querySelectorAll('.duration[data-start]');
        
        // Exit if no duration elements found (not an error, just means we're on a different page)
        if (durationElements.length === 0) {
            return;
        }
        
        /**
         * PROCESS EACH DURATION ELEMENT
         * Iterates through all experience items and calculates their durations
         */
        durationElements.forEach(function(element) {
            try {
                // Extract date attributes
                const startDate = element.getAttribute('data-start');
                const endDate = element.getAttribute('data-end');
                
                // Validate required attributes exist
                if (!startDate || !endDate) {
                    console.warn('Duration element missing data-start or data-end:', element);
                    return;
                }
                
                // Parse start date
                const startParts = startDate.split('-');
                if (startParts.length !== 2) {
                    console.warn('Invalid start date format (expected YYYY-MM):', startDate);
                    return;
                }
                const startYear = parseInt(startParts[0], 10);
                const startMonth = parseInt(startParts[1], 10);
                
                // Validate start date values
                if (isNaN(startYear) || isNaN(startMonth) || startMonth < 1 || startMonth > 12) {
                    console.warn('Invalid start date values:', startDate);
                    return;
                }
                
                /**
                 * PARSE END DATE
                 * Handle two cases:
                 * 1. "present" - use current date
                 * 2. "YYYY-MM" - use specified date
                 */
                let endYear, endMonth;
                
                if (endDate === 'present') {
                    // Use current date for ongoing positions
                    const now = new Date();
                    endYear = now.getFullYear();
                    endMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
                } else {
                    // Parse specified end date
                    const endParts = endDate.split('-');
                    if (endParts.length !== 2) {
                        console.warn('Invalid end date format (expected YYYY-MM or "present"):', endDate);
                        return;
                    }
                    endYear = parseInt(endParts[0], 10);
                    endMonth = parseInt(endParts[1], 10);
                    
                    // Validate end date values
                    if (isNaN(endYear) || isNaN(endMonth) || endMonth < 1 || endMonth > 12) {
                        console.warn('Invalid end date values:', endDate);
                        return;
                    }
                }
                
                /**
                 * CALCULATE TOTAL MONTHS
                 * Formula: (yearDiff × 12) + monthDiff + 1
                 * The +1 includes both the start and end months
                 * 
                 * Example: Jan 2025 to Mar 2025
                 * = (2025 - 2025) × 12 + (3 - 1) + 1
                 * = 0 + 2 + 1 = 3 months (Jan, Feb, Mar)
                 */
                const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
                
                // Validate result is positive
                if (totalMonths < 1) {
                    console.warn('Calculated duration is less than 1 month:', {
                        start: startDate,
                        end: endDate,
                        totalMonths: totalMonths
                    });
                    return;
                }
                
                /**
                 * FORMAT DURATION TEXT
                 * LinkedIn-style formatting:
                 * - "1 mo" for single month
                 * - "X mos" for multiple months < 12
                 * - "1 yr" for exactly 12 months
                 * - "X yrs" for multiple years with no remaining months
                 * - "X yr Y mo" or "X yrs Y mos" for combination
                 */
                let durationText = '';
                
                if (totalMonths === 1) {
                    // Single month
                    durationText = '1 mo';
                } else if (totalMonths < 12) {
                    // Multiple months, less than a year
                    durationText = totalMonths + ' mos';
                } else {
                    // One or more years
                    const years = Math.floor(totalMonths / 12);
                    const remainingMonths = totalMonths % 12;
                    
                    if (remainingMonths === 0) {
                        // Exactly X years
                        durationText = years === 1 ? '1 yr' : years + ' yrs';
                    } else {
                        // X years and Y months
                        const yearText = years === 1 ? '1 yr' : years + ' yrs';
                        const monthText = remainingMonths === 1 ? '1 mo' : remainingMonths + ' mos';
                        durationText = yearText + ' ' + monthText;
                    }
                }
                
                /**
                 * UPDATE DOM WITH CALCULATED DURATION
                 * Finds the .duration-calc span within the element and updates its text
                 */
                const calcSpan = element.querySelector('.duration-calc');
                if (calcSpan) {
                    calcSpan.textContent = durationText;
                } else {
                    console.warn('duration-calc span not found within element:', element);
                }
                
            } catch (error) {
                // Catch any unexpected errors to prevent breaking the page
                console.error('Error calculating duration for element:', element, error);
            }
        });
    }
    
    /**
     * INITIALIZE ON DOM READY
     * Wait for DOM to be fully loaded before calculating durations
     * This ensures all HTML elements exist before we try to manipulate them
     */
    if (document.readyState === 'loading') {
        // DOM is still loading, wait for it
        document.addEventListener('DOMContentLoaded', calculateDuration);
    } else {
        // DOM is already loaded (script loaded late or dynamically), run immediately
        calculateDuration();
    }
    
    /**
     * AUTO-UPDATE FOR ONGOING POSITIONS
     * Recalculate durations every 24 hours for positions marked as "present"
     * This ensures the duration stays accurate without requiring manual updates
     * 
     * Why 24 hours?
     * - Month changes happen at day boundaries
     * - No need for more frequent updates (excessive CPU usage)
     * - 24 hours = 24 × 60 × 60 × 1000 milliseconds
     * 
     * Performance impact: Negligible (runs once per day in background)
     */
    setInterval(calculateDuration, 24 * 60 * 60 * 1000);
    
})();
