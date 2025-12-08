/**
 * Cookie Consent Management Utility
 * Handles storage and loading of cookie preferences according to GDPR/DSGVO
 */

export interface CookieConsent {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: number;
  }
  
  const STORAGE_KEY = 'cookieConsent';
  const CONSENT_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
  
  /**
   * Get stored cookie consent preferences
   */
  export function getCookieConsent(): CookieConsent | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      
      const consent: CookieConsent = JSON.parse(stored);
      
      // Check if consent is still valid (not older than 1 year)
      const now = Date.now();
      if (now - consent.timestamp > CONSENT_DURATION) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      return consent;
    } catch (error) {
      console.error('Error reading cookie consent:', error);
      return null;
    }
  }
  
  /**
   * Save cookie consent preferences
   */
  export function saveCookieConsent(consent: Partial<CookieConsent>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const fullConsent: CookieConsent = {
        necessary: true, // Always true
        analytics: consent.analytics ?? false,
        marketing: consent.marketing ?? false,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));
      
      // Trigger custom event for other components
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: fullConsent }));
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }
  
  /**
   * Check if user has given consent
   */
  export function hasConsent(): boolean {
    const consent = getCookieConsent();
    return consent !== null;
  }
  
  /**
   * Check if analytics consent is given
   */
  export function hasAnalyticsConsent(): boolean {
    const consent = getCookieConsent();
    return consent?.analytics === true;
  }
  
  /**
   * Check if marketing consent is given
   */
  export function hasMarketingConsent(): boolean {
    const consent = getCookieConsent();
    return consent?.marketing === true;
  }
  
  /**
   * Load Google Analytics script dynamically
   */
  export function loadGoogleAnalytics(): void {
    if (typeof window === 'undefined') return;
    
    // Check if already loaded
    if (window.dataLayer && (window as any).gtag) {
      return;
    }
    
    // Check consent
    if (!hasAnalyticsConsent() && !hasMarketingConsent()) {
      return;
    }
    
    const GA_ID = 'AW-17764876183';
    
    // Create dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_ID);
    
    // Load script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
    
    console.log('[CookieConsent] Google Analytics loaded');
  }
  
  /**
   * Remove Google Analytics (if user revokes consent)
   */
  export function removeGoogleAnalytics(): void {
    if (typeof window === 'undefined') return;
    
    // Remove script tags
    const scripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
    scripts.forEach(script => script.remove());
    
    // Clear dataLayer
    if (window.dataLayer) {
      window.dataLayer = [];
    }
    
    // Remove gtag function
    delete (window as any).gtag;
    
    // Remove cookies set by Google Analytics
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.startsWith('_ga') || cookieName.startsWith('_gid') || cookieName.startsWith('_gat')) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });
    
    console.log('[CookieConsent] Google Analytics removed');
  }
  
  /**
   * Track event (only if consent is given)
   */
  export function trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (!hasAnalyticsConsent() && !hasMarketingConsent()) {
      console.log('[CookieConsent] Event tracking skipped - no consent:', eventName);
      return;
    }
    
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', eventName, properties);
      console.log('[CookieConsent] Event tracked:', eventName, properties);
    } else {
      // Queue event if gtag is not yet loaded
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
      window.dataLayer.push(['event', eventName, properties]);
    }
  }
  
/**
 * Initialize cookie consent system
 * Should be called on page load
 */
export function initCookieConsent(): void {
  const consent = getCookieConsent();
  
  if (consent) {
    // User has already given consent, load analytics if allowed
    if (consent.analytics || consent.marketing) {
      loadGoogleAnalytics();
    }
  }
  // If no consent, don't load anything - wait for user action
  
  // Expose trackEvent globally for legacy script.js compatibility
  if (typeof window !== 'undefined') {
    (window as any).cookieConsentTrackEvent = trackEvent;
  }
}
  