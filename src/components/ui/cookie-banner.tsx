import React, { useState, useEffect } from 'react';
import { X, Settings, Check, Info } from 'lucide-react';
import { 
  getCookieConsent, 
  saveCookieConsent, 
  loadGoogleAnalytics, 
  removeGoogleAnalytics,
  type CookieConsent 
} from '../../lib/cookie-consent';

interface CookieBannerProps {
  onConsentChange?: (consent: CookieConsent) => void;
}

export function CookieBanner({ onConsentChange }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent already exists
    const existingConsent = getCookieConsent();
    
    if (!existingConsent) {
      // Show banner if no consent exists
      setIsVisible(true);
    } else {
      // User has already given consent, don't show banner
      setIsVisible(false);
    }
    
    // Listen for openCookieSettings event (from footer link)
    const handleOpenSettings = () => {
      const consent = getCookieConsent();
      if (consent) {
        setPreferences({
          necessary: true,
          analytics: consent.analytics,
          marketing: consent.marketing,
        });
      }
      setShowDetails(true);
      setIsVisible(true);
    };
    
    window.addEventListener('openCookieSettings', handleOpenSettings);
    
    return () => {
      window.removeEventListener('openCookieSettings', handleOpenSettings);
    };
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    
    saveCookieConsent(consent);
    loadGoogleAnalytics();
    setIsVisible(false);
    onConsentChange?.(consent);
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    
    saveCookieConsent(consent);
    removeGoogleAnalytics();
    setIsVisible(false);
    onConsentChange?.(consent);
  };

  const handleSavePreferences = () => {
    saveCookieConsent(preferences);
    
    if (preferences.analytics || preferences.marketing) {
      loadGoogleAnalytics();
    } else {
      removeGoogleAnalytics();
    }
    
    setIsVisible(false);
    setShowDetails(false);
    onConsentChange?.(preferences as CookieConsent);
  };

  const handleOpenSettings = () => {
    const existingConsent = getCookieConsent();
    if (existingConsent) {
      setPreferences({
        necessary: true,
        analytics: existingConsent.analytics,
        marketing: existingConsent.marketing,
      });
    }
    setShowDetails(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setShowDetails(false);
  };

  if (!isVisible && !showDetails) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      {isVisible && !showDetails && (
        <div 
          className="cookie-banner fixed bottom-0 left-0 right-0 z-[10000] p-4 md:p-6"
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-modal="false"
        >
          <div 
            className="glass-card glow-border rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 40px rgba(249, 199, 79, 0.2)',
            }}
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex-1">
                <h3 
                  id="cookie-banner-title"
                  className="text-xl md:text-2xl font-bold mb-3"
                  style={{ color: '#f7fafc' }}
                >
                  🍪 Cookie-Einstellungen
                </h3>
                <p className="text-sm md:text-base mb-4" style={{ color: 'rgba(230, 235, 239, 0.9)' }}>
                  Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung zu bieten. 
                  Einige sind notwendig für die Funktionalität der Website, andere helfen uns, 
                  diese Website und die Nutzererfahrung zu verbessern (Analyse-Cookies) oder 
                  Ihnen relevante Werbung anzuzeigen (Marketing-Cookies).
                </p>
                <p className="text-xs md:text-sm mb-4" style={{ color: 'rgba(230, 235, 239, 0.7)' }}>
                  Sie können Ihre Einwilligung jederzeit widerrufen. Weitere Informationen finden Sie in unserer{' '}
                  <a 
                    href="/datenschutz.html#cookies" 
                    className="underline hover:no-underline transition-all"
                    style={{ color: '#f9c74f' }}
                  >
                    Datenschutzerklärung
                  </a>.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:flex-col md:min-w-[200px]">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #f9c74f 0%, #f4a825 100%)',
                    color: '#1f2937',
                    boxShadow: '0 4px 16px rgba(249, 199, 79, 0.4), 0 0 20px rgba(249, 199, 79, 0.2)',
                  }}
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#f7fafc',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  Nur notwendige
                </button>
                <button
                  onClick={handleOpenSettings}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#f7fafc',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Einstellungen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Settings Modal */}
      {showDetails && (
        <div 
          className="cookie-settings-overlay fixed inset-0 z-[10001] flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
          role="dialog"
          aria-labelledby="cookie-settings-title"
          aria-modal="true"
        >
          <div 
            className="cookie-settings-modal glass-card glow-border rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 40px rgba(249, 199, 79, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 
                id="cookie-settings-title"
                className="text-2xl md:text-3xl font-bold"
                style={{ color: '#f7fafc' }}
              >
                Cookie-Einstellungen
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg transition-all hover:bg-white/10"
                aria-label="Schließen"
                style={{ color: '#f7fafc' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm md:text-base mb-6" style={{ color: 'rgba(230, 235, 239, 0.9)' }}>
              Wählen Sie aus, welche Cookies Sie zulassen möchten. Notwendige Cookies sind für 
              die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
            </p>

            {/* Necessary Cookies */}
            <div 
              className="cookie-category mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5" style={{ color: '#10b981' }} />
                  <h3 className="text-lg font-semibold" style={{ color: '#f7fafc' }}>
                    Notwendige Cookies
                  </h3>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                  }}
                >
                  Immer aktiv
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: 'rgba(230, 235, 239, 0.8)' }}>
                Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
              </p>
              <div className="text-xs mt-2" style={{ color: 'rgba(230, 235, 239, 0.6)' }}>
                <strong>Verwendet für:</strong> Session-Verwaltung, Sicherheit, Grundfunktionalität
              </div>
            </div>

            {/* Analytics Cookies */}
            <div 
              className="cookie-category mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${preferences.analytics ? 'rgba(249, 199, 79, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5" style={{ color: '#f9c74f' }} />
                  <h3 className="text-lg font-semibold" style={{ color: '#f7fafc' }}>
                    Analytische Cookies
                  </h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div 
                    className="w-11 h-6 rounded-full transition-colors duration-200 peer"
                    style={{
                      background: preferences.analytics ? '#f9c74f' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: preferences.analytics 
                        ? '0 0 20px rgba(249, 199, 79, 0.4)' 
                        : 'none',
                    }}
                  >
                    <div 
                      className="w-5 h-5 bg-white rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                      style={{
                        transform: preferences.analytics ? 'translateX(20px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                </label>
              </div>
              <p className="text-sm mb-2" style={{ color: 'rgba(230, 235, 239, 0.8)' }}>
                Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                indem sie Informationen anonym sammeln und melden.
              </p>
              <div className="text-xs mt-2" style={{ color: 'rgba(230, 235, 239, 0.6)' }}>
                <strong>Verwendet für:</strong> Google Analytics, Seitenaufrufe, Nutzungsstatistiken
              </div>
            </div>

            {/* Marketing Cookies */}
            <div 
              className="cookie-category mb-6 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${preferences.marketing ? 'rgba(249, 199, 79, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5" style={{ color: '#f9c74f' }} />
                  <h3 className="text-lg font-semibold" style={{ color: '#f7fafc' }}>
                    Marketing-Cookies
                  </h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div 
                    className="w-11 h-6 rounded-full transition-colors duration-200 peer"
                    style={{
                      background: preferences.marketing ? '#f9c74f' : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: preferences.marketing 
                        ? '0 0 20px rgba(249, 199, 79, 0.4)' 
                        : 'none',
                    }}
                  >
                    <div 
                      className="w-5 h-5 bg-white rounded-full transition-transform duration-200 mt-0.5 ml-0.5"
                      style={{
                        transform: preferences.marketing ? 'translateX(20px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                </label>
              </div>
              <p className="text-sm mb-2" style={{ color: 'rgba(230, 235, 239, 0.8)' }}>
                Diese Cookies werden verwendet, um Ihnen relevante Werbung und Marketinginhalte anzuzeigen.
              </p>
              <div className="text-xs mt-2" style={{ color: 'rgba(230, 235, 239, 0.6)' }}>
                <strong>Verwendet für:</strong> Google Ads Conversion Tracking, Remarketing
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #f9c74f 0%, #f4a825 100%)',
                  color: '#1f2937',
                  boxShadow: '0 4px 16px rgba(249, 199, 79, 0.4), 0 0 20px rgba(249, 199, 79, 0.2)',
                }}
              >
                Einstellungen speichern
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#f7fafc',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
