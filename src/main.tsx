import React from "react";
import ReactDOM from "react-dom/client";
import { Timeline } from "./components/ui/timeline";
import RadialOrbitalTimeline from "./components/ui/radial-orbit";
import { FlowButton } from "./components/ui/flow-button";
import { ProfileCard } from "./components/ui/profile-card";
import PricingSection5 from "./components/ui/pricing-section";
import { FloatingNav } from "./components/ui/floating-nav";
import FAQs from "./components/ui/faqs";
import { radialOrbitData } from "./radial-orbit-data";
import { Home, Users, Clock, DollarSign, Info, HelpCircle } from "lucide-react";

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

function initRadialOrbit() {
  try {
    const rootElement = document.getElementById("radial-orbit-root");
    
    if (!rootElement) {
      console.warn("RadialOrbit root element not found");
      return;
    }
    
    // iOS Safari manchmal Probleme mit StrictMode - optional machen
    const useStrictMode = true;
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      console.log("RadialOrbit root element found, initializing component...");
      const root = ReactDOM.createRoot(rootElement);
      const content = <RadialOrbitalTimeline timelineData={radialOrbitData} />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
      console.log("RadialOrbit component rendered");
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      console.log("RadialOrbit: Using ReactDOM.render fallback");
      const content = <RadialOrbitalTimeline timelineData={radialOrbitData} />;
      ReactDOM.render(
        useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content,
        rootElement
      );
    } else {
      console.warn("RadialOrbit: ReactDOM not available");
    }
  } catch (error) {
    console.error("Error initializing RadialOrbit:", error);
  }
}

function initFlowButton() {
  try {
    const rootElement = document.getElementById("hero-flow-button-root");
    if (!rootElement) return;
    
    const useStrictMode = true;
    const handleClick = () => {
      const targetElement = document.getElementById("contact") || document.querySelector("#faq");
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    };
    
    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootElement);
      const content = <FlowButton text="Loslegen" onClick={handleClick} />;
      root.render(useStrictMode ? <React.StrictMode>{content}</React.StrictMode> : content);
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      const content = <FlowButton text="Loslegen" onClick={handleClick} />;
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
        name: "Zukunft",
        link: "#hero",
        icon: <Home className="h-4 w-4" />,
      },
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

// Execute when DOM is ready - mit iOS Safari Optimierungen
function initializeAllComponents() {
  // React/ReactDOM sind im Bundle eingebettet, sollten direkt verfügbar sein
  // Aber für iOS Safari: zusätzliche Wartezeit und Checks
  try {
    // Prüfe ob DOM-Elemente verfügbar sind
    const hasElements = 
      document.getElementById("timeline-root") ||
      document.getElementById("radial-orbit-root") ||
      document.getElementById("hero-flow-button-root");
    
    if (!hasElements && (document.readyState === 'loading' || !document.body)) {
      // Warte auf DOM
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          console.log("Initializing React components after DOMContentLoaded...");
          initTimeline();
          initRadialOrbit();
          initFlowButton();
          initProfileCard();
          initPricingSection();
          initFloatingNav();
          initFAQs();
        }, 100); // Verzögerung für iOS Safari DOM-Bereitschaft
      });
    } else {
      // Kurze Verzögerung für iOS Safari - sicherstellen dass DOM vollständig bereit ist
      setTimeout(() => {
        console.log("Initializing React components...");
        initTimeline();
        initRadialOrbit();
        initFlowButton();
        initProfileCard();
        initPricingSection();
        initFloatingNav();
        initFAQs();
      }, 100); // Verzögerung für iOS Safari
    }
  } catch (error) {
    console.error("Error in initializeAllComponents:", error);
    // Retry nach kurzer Wartezeit
    setTimeout(initializeAllComponents, 200);
  }
}

// Starte Initialisierung - warte auf vollständiges Laden des Bundles
// iOS Safari manchmal verzögertes Laden
if (document.readyState === 'complete' || (document.readyState !== 'loading' && document.body)) {
  // Sofort initialisieren wenn bereits geladen
  initializeAllComponents();
} else {
  // Warte auf DOMContentLoaded oder window.load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllComponents);
  }
  // Zusätzlicher Fallback für iOS Safari
  window.addEventListener('load', () => {
    setTimeout(initializeAllComponents, 50);
  });
}

