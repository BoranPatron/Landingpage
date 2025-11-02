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
  const rootElement = document.getElementById("timeline-root");
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <Timeline />
      </React.StrictMode>
    );
  }
}

function initRadialOrbit() {
  const rootElement = document.getElementById("radial-orbit-root");
  
  if (rootElement) {
    console.log("RadialOrbit root element found, initializing component...");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <RadialOrbitalTimeline timelineData={radialOrbitData} />
      </React.StrictMode>
    );
    console.log("RadialOrbit component rendered");
  } else {
    console.warn("RadialOrbit root element not found");
  }
}

function initFlowButton() {
  const rootElement = document.getElementById("hero-flow-button-root");
  
  if (rootElement) {
    const handleClick = () => {
      const targetElement = document.getElementById("contact") || document.querySelector("#faq");
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    };

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <FlowButton text="Loslegen" onClick={handleClick} />
      </React.StrictMode>
    );
  }
}

function initProfileCard() {
  const rootElement = document.getElementById("about-profile-root");
  
  if (rootElement) {
    console.log("ProfileCard root element found, initializing component...");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ProfileCard />
      </React.StrictMode>
    );
    console.log("ProfileCard component rendered");
  } else {
    console.warn("ProfileCard root element not found");
  }
}

function initPricingSection() {
  const rootElement = document.getElementById("pricing-root");
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <PricingSection5 />
      </React.StrictMode>
    );
  }
}

function initFloatingNav() {
  const rootElement = document.getElementById("floating-nav-root");
  
  if (rootElement) {
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

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <FloatingNav navItems={navItems} />
      </React.StrictMode>
    );
  }
}

function initFAQs() {
  const rootElement = document.getElementById("faq-root");
  
  if (rootElement) {
    console.log("FAQ root element found, initializing component...");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <FAQs />
      </React.StrictMode>
    );
    console.log("FAQ component rendered");
  } else {
    console.warn("FAQ root element not found");
  }
}

// Execute when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
    initRadialOrbit();
    initFlowButton();
    initProfileCard();
    initPricingSection();
    initFloatingNav();
    initFAQs();
  });
} else {
  initTimeline();
  initRadialOrbit();
  initFlowButton();
  initProfileCard();
  initPricingSection();
  initFloatingNav();
  initFAQs();
}

