// Test script to debug cookie consent banner
console.log('[Test] Cookie consent test script loaded');

// Check if CookieConsent object exists
setTimeout(() => {
    if (typeof window.CookieConsent === 'undefined') {
        console.error('[Test] CookieConsent object not found!');
    } else {
        console.log('[Test] CookieConsent object found:', window.CookieConsent);
        
        // Check if banner exists
        const banner = document.querySelector('.cookie-consent-banner');
        if (banner) {
            console.log('[Test] Banner element found in DOM:', banner);
            console.log('[Test] Banner styles:', window.getComputedStyle(banner));
            console.log('[Test] Banner visible:', banner.offsetParent !== null);
        } else {
            console.error('[Test] Banner element NOT found in DOM');
        }
        
        // Check localStorage
        const consent = localStorage.getItem('synoriya_cookie_consent');
        console.log('[Test] Consent in localStorage:', consent);
    }
}, 2000);
