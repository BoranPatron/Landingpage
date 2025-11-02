import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// Icons are passed via props from main.tsx

export interface FloatingNavProps {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}

// Section name mapping - entspricht den Nav-Item Namen für Highlighting
const sectionNames: { [key: string]: string } = {
  "#hero": "Zukunft",
  "#personas": "Rollen",
  "#timeline": "Prozess",
  "#pricing": "Preise",
  "#about": "Über uns",
  "#faq": "FAQ",
};

export const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const [activeSectionName, setActiveSectionName] = useState<string>("Zukunft");

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sections = ["hero", "personas", "timeline", "pricing", "about", "faq"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const sectionLink = `#${sectionId}`;
          const sectionName = sectionNames[sectionLink] || sectionId;
          setActiveSectionName(sectionName);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Set initial active section
    const checkInitialSection = () => {
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            const sectionLink = `#${sectionId}`;
            const sectionName = sectionNames[sectionLink] || sectionId;
            setActiveSectionName(sectionName);
            break;
          }
        }
      }
    };

    // Check after a short delay to ensure DOM is ready
    setTimeout(checkInitialSection, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Navbar bleibt immer sichtbar - keine Scroll-Hide-Logik

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href;
    if (targetId === '#' || !targetId) return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const isActiveSection = (link: string) => {
    const sectionName = sectionNames[link] || link.replace("#", "");
    return activeSectionName === sectionName;
  };

  return (
    <motion.div
      initial={{
        opacity: 1,
        y: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.2,
      }}
        className={cn(
          "flex max-w-7xl fixed top-10 left-4 right-4 sm:inset-x-0 sm:mx-auto border border-white/20 rounded-full bg-[#51646f]/20 backdrop-blur-lg shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08),0_0_20px_rgba(81,100,111,0.2)] z-[5000] px-2 sm:px-5 py-2 sm:py-2.5 items-center justify-between gap-1 sm:gap-3 overflow-hidden",
          className
        )}
        style={{
          boxShadow: '0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08), 0 0 30px rgba(81,100,111,0.25), 0 0 60px rgba(249,199,79,0.15)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, "#hero")}
          aria-label="Zur Startseite - BuildWise"
          className="flex items-center pr-2 sm:pr-6 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <img 
            src="/favicon.png" 
            alt="BuildWise Logo - Bauträger Plattform Schweiz" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            loading="lazy"
            onError={(e) => {
              // Fallback to logo.png if favicon.png doesn't exist
              const target = e.target as HTMLImageElement;
              if (target.src !== window.location.origin + "/logo.png") {
                target.src = "/logo.png";
              }
            }}
          />
        </a>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-4 flex-1 justify-center min-w-0 overflow-x-auto scrollbar-hide" aria-label="Hauptnavigation">
          {navItems.map((navItem: any, idx: number) => {
            const isActive = isActiveSection(navItem.link);
            return (
              <a
                key={`link=${idx}`}
                href={navItem.link}
                onClick={(e) => handleLinkClick(e, navItem.link)}
                aria-label={`Navigation zu ${navItem.name} Sektion`}
                className={cn(
                  "relative items-center flex gap-1 sm:gap-2 text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex-shrink-0 whitespace-nowrap",
                  isActive
                    ? "text-[#f9c74f] font-bold bg-[#f9c74f]/10 border border-[#f9c74f]/30"
                    : "text-[#f7fafc] hover:text-[#f9c74f] hover:bg-white/10"
                )}
                style={{
                  textShadow: isActive ? '0 0 10px rgba(249,199,79,0.5)' : 'none',
                }}
              >
                {navItem.icon && (
                  <span className="block sm:hidden flex-shrink-0">
                    {React.cloneElement(navItem.icon as React.ReactElement, { className: "h-4 w-4 sm:h-5 sm:w-5" })}
                  </span>
                )}
                <span className="hidden sm:block text-base">{navItem.name}</span>
              </a>
            );
          })}
        </nav>

      </motion.div>
  );
};

