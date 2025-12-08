import React from "react";
import ReactDOM from "react-dom/client";
import { Timeline } from "./components/ui/timeline";
import { FlowButton } from "./components/ui/flow-button";
import { ProfileCard } from "./components/ui/profile-card";
import PricingSection5 from "./components/ui/pricing-section";
import { FloatingNav } from "./components/ui/floating-nav";
import FAQs from "./components/ui/faqs";
import InteractiveSelector from "./components/ui/interactive-selector";
import { SnowEffect } from "./components/ui/snow-effect";
import { Home, Users, Clock, DollarSign, Info, HelpCircle, Sparkles } from "lucide-react";

function initTimeline() {
  try {
    const rootElement = document.getElementById("timeline-root");
    
    if (!rootElement) return;
    
    // iOS Safari manchmal Probleme mit StrictMode - optional machen
    const useStrictMode = true; // Kann auf false gesetzt werden für iOS Safari wenn nötig
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootElement);
      const content = <Timeline />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      // Fallback für ältere React-Versionen
      const content = <Timeline />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    } else {
      console.warn("Timeline: ReactDOM not available");
    }
  } catch (error) {
    console.error("Error initializing Timeline:", error);
  }
}


function initFlowButton() {
  try {
    const rootElement = document.getElementById("hero-flow-button-root");
    if (!rootElement) return;
    
    const useStrictMode = true;
    const handleClick = () => {
      // Google Ads Conversion Event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {'send_to': 'AW-17764876183/nRzcCL_KoMgbEJf_-ZZC'});
      }
      window.open('https://build-wise.app/login', '_blank', 'noopener,noreferrer');
    };
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootElement);
      const content = <FlowButton text="Kostenlos starten" onClick={handleClick} />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      const content = <FlowButton text="Kostenlos starten" onClick={handleClick} />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    }
  } catch (error) {
    console.error("Error initializing FlowButton:", error);
  }
}

function initProfileCard() {
  try {
    const rootElement = document.getElementById("about-profile-root");
    if (!rootElement) {
      console.warn("ProfileCard root element not found");
      return;
    }
    
    const useStrictMode = true;
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      console.log("ProfileCard root element found, initializing component...");
      const root = ReactDOM.createRoot(rootElement);
      const content = <ProfileCard />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
      console.log("ProfileCard component rendered");
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      console.log("ProfileCard: Using ReactDOM.render fallback");
      const content = <ProfileCard />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    } else {
      console.warn("ProfileCard: ReactDOM not available");
    }
  } catch (error) {
    console.error("Error initializing ProfileCard:", error);
  }
}

function initPricingSection() {
  try {
    const rootElement = document.getElementById("pricing-root");
    if (!rootElement) return;
    
    const useStrictMode = true;
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootElement);
      const content = <PricingSection5 />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      const content = <PricingSection5 />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    }
  } catch (error) {
    console.error("Error initializing PricingSection:", error);
  }
}

function initFloatingNav() {
  try {
    const rootElement = document.getElementById("floating-nav-root");
    if (!rootElement) return;
    
    const useStrictMode = true;
    const navItems = [
      {
        name: "Rollen",
        link: "#personas",
        icon: <Users className="h-4 w-4" />,
      },
      {
        name: "Prozess",
        link: "#timeline",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        name: "Features",
        link: "#features",
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        name: "Preise",
        link: "#pricing",
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        name: "Über uns",
        link: "#about",
        icon: <Info className="h-4 w-4" />,
      },
      {
        name: "FAQ",
        link: "#faq",
        icon: <HelpCircle className="h-4 w-4" />,
      },
    ];
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootElement);
      const content = <FloatingNav navItems={navItems} />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      const content = <FloatingNav navItems={navItems} />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    }
  } catch (error) {
    console.error("Error initializing FloatingNav:", error);
  }
}


function initInteractiveSelector() {
  try {
    const rootElement = document.getElementById("interactive-selector-root");
    if (!rootElement) {
      console.warn("InteractiveSelector root element not found");
      return;
    }
    
    const useStrictMode = true;
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      console.log("InteractiveSelector root element found, initializing component...");
      const root = ReactDOM.createRoot(rootElement);
      const content = <InteractiveSelector />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
      console.log("InteractiveSelector component rendered");
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      console.log("InteractiveSelector: Using ReactDOM.render fallback");
      const content = <InteractiveSelector />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    } else {
      console.warn("InteractiveSelector: ReactDOM not available");
    }
  } catch (error) {
    console.error("Error initializing InteractiveSelector:", error);
  }
}

function initFAQs() {
  try {
    const rootElement = document.getElementById("faq-root");
    if (!rootElement) {
      console.warn("FAQ root element not found");
      return;
    }
    
    const useStrictMode = true;
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      console.log("FAQ root element found, initializing component...");
      const root = ReactDOM.createRoot(rootElement);
      const content = <FAQs />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
      console.log("FAQ component rendered");
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      console.log("FAQ: Using ReactDOM.render fallback");
      const content = <FAQs />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    } else {
      console.warn("FAQ: ReactDOM not available");
    }
  } catch (error) {
    console.error("Error initializing FAQs:", error);
  }
}

function initSnowEffect() {
  try {
    console.log('[SnowEffect] Initializing...');
    const rootElement = document.getElementById("snow-effect-root");
    if (!rootElement) {
      console.warn("[SnowEffect] Root element 'snow-effect-root' not found in DOM");
      return;
    }
    console.log('[SnowEffect] Root element found:', rootElement);
    
    if (typeof ReactDOM === 'undefined') {
      console.warn("[SnowEffect] ReactDOM is not available");
      return;
    }
    
    const useStrictMode = true;
    
    if (typeof ReactDOM.createRoot !== 'undefined') {
      console.log('[SnowEffect] Using ReactDOM.createRoot');
      const root = ReactDOM.createRoot(rootElement);
      const content = <SnowEffect />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
      console.log('[SnowEffect] Component rendered successfully');
    } else if (typeof ReactDOM.render !== 'undefined') {
      console.log('[SnowEffect] Using ReactDOM.render (fallback)');
      const content = <SnowEffect />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
      console.log('[SnowEffect] Component rendered successfully (fallback)');
    } else {
      console.warn("[SnowEffect] Neither ReactDOM.createRoot nor ReactDOM.render is available");
    }
  } catch (error) {
    console.error("[SnowEffect] Error initializing:", error);
    console.error("[SnowEffect] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
  }
}

// Execute when DOM is ready - Simplified without timing hacks
function initializeAllComponents() {
  try {
    console.log('[BuildWise] Initializing React components...');
    
    // Initialize FloatingNav first - critical for navigation
    console.log('[FloatingNav] Initializing...');
    initFloatingNav();
    console.log('[FloatingNav] Initialized');
    
    // Initialize other components
    initTimeline();
    initFlowButton();
    initProfileCard();
    initInteractiveSelector();
    initPricingSection();
    initFAQs();
    initSnowEffect();
    
    console.log('[BuildWise] All components initialized');
  } catch (error) {
    console.error("[BuildWise] Error initializing components:", error);
  }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAllComponents);
} else {
  // DOM is already ready
  initializeAllComponents();
}

