// BuildWise Configuration
window.BUILDWISE_CONFIG = {
    // API Base URL - wird zur Laufzeit gesetzt
    API_BASE: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : 'https://buildwise-api.onrender.com',
    
    // Frontend URL für Demo-Weiterleitung
    FRONTEND_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:5173'
        : 'https://frontend.buildwise.ch',
    
    // Feature Flags
    FEATURES: {
        BETA_SIGNUP: true,
        CONTACT_FORM: true,
        ANALYTICS: false,
        DEMO_MODE: true
    },
    
    // UI Configuration
    UI: {
        ANIMATION_DURATION: 300,
        SCROLL_OFFSET: 80
    },
    
    // Demo Configuration
    DEMO: {
        AUTO_LOGIN_DELAY: 1000,
        NOTIFICATION_DURATION: 5000,
        ROLES: {
            BAUTRAEGER: {
                name: 'Bauträger',
                description: 'Projektmanagement & Dienstleister-Matching',
                credentials: {
                    email: 'demo.bautraeger@buildwise.ch',
                    password: 'demo123'
                }
            },
            DIENSTLEISTER: {
                name: 'Dienstleister', 
                description: 'Auftragsmanagement & Angebotserstellung',
                credentials: {
                    email: 'demo.dienstleister@buildwise.ch',
                    password: 'demo123'
                }
            }
        }
    }
};

// Globale Variablen für Rückwärtskompatibilität
window.BUILDWISE_API_BASE = window.BUILDWISE_CONFIG.API_BASE;
window.BUILDWISE_FRONTEND_URL = window.BUILDWISE_CONFIG.FRONTEND_URL;


