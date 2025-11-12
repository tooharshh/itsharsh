(function() {
    'use strict';
    
    function calculateDuration() {
        const durationElements = document.querySelectorAll('.duration[data-start]');
        
        if (durationElements.length === 0) {
            return;
        }
        
        durationElements.forEach(function(element) {
            try {
                const startDate = element.getAttribute('data-start');
                const endDate = element.getAttribute('data-end');
                
                if (!startDate || !endDate) {
                    console.warn('Duration element missing data-start or data-end:', element);
                    return;
                }
                
                const startParts = startDate.split('-');
                if (startParts.length !== 2) {
                    console.warn('Invalid start date format (expected YYYY-MM):', startDate);
                    return;
                }
                const startYear = parseInt(startParts[0], 10);
                const startMonth = parseInt(startParts[1], 10);
                
                if (isNaN(startYear) || isNaN(startMonth) || startMonth < 1 || startMonth > 12) {
                    console.warn('Invalid start date values:', startDate);
                    return;
                }
                
                let endYear, endMonth;
                
                if (endDate === 'present') {
                    const now = new Date();
                    endYear = now.getFullYear();
                    endMonth = now.getMonth() + 1;
                } else {
                    const endParts = endDate.split('-');
                    if (endParts.length !== 2) {
                        console.warn('Invalid end date format (expected YYYY-MM or "present"):', endDate);
                        return;
                    }
                    endYear = parseInt(endParts[0], 10);
                    endMonth = parseInt(endParts[1], 10);
                    
                    if (isNaN(endYear) || isNaN(endMonth) || endMonth < 1 || endMonth > 12) {
                        console.warn('Invalid end date values:', endDate);
                        return;
                    }
                }
                
                const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
                
                if (totalMonths < 1) {
                    console.warn('Calculated duration is less than 1 month:', {
                        start: startDate,
                        end: endDate,
                        totalMonths: totalMonths
                    });
                    return;
                }
                
                let durationText = '';
                
                if (totalMonths === 1) {
                    durationText = '1 mo';
                } else if (totalMonths < 12) {
                    durationText = totalMonths + ' mos';
                } else {
                    const years = Math.floor(totalMonths / 12);
                    const remainingMonths = totalMonths % 12;
                    
                    if (remainingMonths === 0) {
                        durationText = years === 1 ? '1 yr' : years + ' yrs';
                    } else {
                        const yearText = years === 1 ? '1 yr' : years + ' yrs';
                        const monthText = remainingMonths === 1 ? '1 mo' : remainingMonths + ' mos';
                        durationText = yearText + ' ' + monthText;
                    }
                }
                
                const calcSpan = element.querySelector('.duration-calc');
                if (calcSpan) {
                    calcSpan.textContent = durationText;
                } else {
                    console.warn('duration-calc span not found within element:', element);
                }
                
            } catch (error) {
                console.error('Error calculating duration for element:', element, error);
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calculateDuration);
    } else {
        calculateDuration();
    }
    
    setInterval(calculateDuration, 24 * 60 * 60 * 1000);
    
})();
