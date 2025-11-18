import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface FloatingNavProps {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}

// Section name mapping
const sectionNames: { [key: string]: string } = {
  "#personas": "Rollen",
  "#timeline": "Prozess",
  "#features": "Features",
  "#pricing": "Preise",
  "#about": "Über uns",
  "#faq": "FAQ",
};

export const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const [activeSectionName, setActiveSectionName] = useState<string>("Rollen");
  const isManualNavigation = useRef(false);

  // iOS Safari: Ensure body overflow-y is set correctly on mount
  useEffect(() => {
    // Ensure body has overflow-y: auto for iOS Safari
    const body = document.body;
    const html = document.documentElement;
    if (body && body.style.overflowY !== 'auto') {
      body.style.overflowY = 'auto';
    }
    if (html && html.style.overflowY !== 'auto') {
      html.style.overflowY = 'auto';
    }
  }, []);

  // Track active section with IntersectionObserver
  useEffect(() => {
    const sections = ["personas", "timeline", "features", "pricing", "about", "faq"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Finde alle intersecting Sections und wähle die oberste (nächste zum oberen Rand)
      const intersectingSections: Array<{ id: string; top: number }> = [];
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const rect = (entry.target as HTMLElement).getBoundingClientRect();
          intersectingSections.push({
            id: sectionId,
            top: rect.top
          });
        }
      });
      
      // Wenn Sections intersecting sind, wähle die oberste
      // IGNORIERE wenn manuelle Navigation aktiv ist
      if (intersectingSections.length > 0 && !isManualNavigation.current) {
        // Sortiere nach top-Wert (niedrigster = am nächsten zum oberen Rand)
        intersectingSections.sort((a, b) => a.top - b.top);
        const topSection = intersectingSections[0];
        const sectionLink = `#${topSection.id}`;
        const sectionName = sectionNames[sectionLink] || topSection.id;
        setActiveSectionName(sectionName);
      }
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

    setTimeout(checkInitialSection, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Scroll-Listener: Nach dem Scrollen die aktivste Section finden
  useEffect(() => {
    const sections = ["personas", "timeline", "features", "pricing", "about", "faq"];
    
    const handleScroll = () => {
      // Finde die Section, die am nächsten zum oberen Rand ist (innerhalb eines bestimmten Bereichs)
      const viewportTop = window.scrollY + 100; // Offset für Navbar
      let closestSection: { id: string; distance: number } | null = null;
      
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          const distance = Math.abs(elementTop - viewportTop);
          
          // Berücksichtige nur Sections, die im Viewport sind oder knapp darüber
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (!closestSection || distance < closestSection.distance) {
              closestSection = { id: sectionId, distance };
            }
          }
        }
      });
      
      // Wenn eine Section gefunden wurde, setze sie als aktiv
      // IGNORIERE wenn manuelle Navigation aktiv ist
      if (closestSection && !isManualNavigation.current) {
        const sectionLink = `#${closestSection.id}`;
        const sectionName = sectionNames[sectionLink] || closestSection.id;
        setActiveSectionName(sectionName);
      }
    };
    
    // Throttle scroll events für bessere Performance
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const throttledHandleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 100);
    };
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Initial check nach kurzer Verzögerung
    setTimeout(handleScroll, 150);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  // iOS Safari 18: Navigation handler WITHOUT preventDefault for native click support
  const handleNavigation = (href: string) => {
    const targetId = href;
    if (targetId === '#' || !targetId) return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      // Setze Flag für manuelle Navigation
      isManualNavigation.current = true;
      
      // Direkt activeSectionName setzen basierend auf href BEVOR scrollt
      const sectionName = sectionNames[href] || href.replace("#", "");
      setActiveSectionName(sectionName);
      
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Nach dem Scroll-Ende nochmal sicherstellen, dass der richtige Zustand gesetzt ist
      // und dann das Flag wieder zurücksetzen
      const checkAfterScroll = () => {
        const currentTop = window.scrollY;
        const targetTop = offsetTop;
        const distance = Math.abs(currentTop - targetTop);
        
        if (distance < 50) {
          // Wir sind nah genug am Ziel, setze den aktiven Zustand
          setActiveSectionName(sectionName);
          // Warte noch kurz bevor wir das Flag zurücksetzen
          setTimeout(() => {
            isManualNavigation.current = false;
          }, 200);
        } else {
          // Noch nicht angekommen, prüfe nochmal nach kurzer Zeit
          setTimeout(checkAfterScroll, 100);
        }
      };
      
      // Warte bis das smooth scroll abgeschlossen ist
      setTimeout(checkAfterScroll, 100);
      setTimeout(checkAfterScroll, 500);
      setTimeout(() => {
        checkAfterScroll();
        // Sicherheitshalber: Reset Flag nach 2 Sekunden
        setTimeout(() => {
          isManualNavigation.current = false;
        }, 200);
      }, 1500);
    }
  };

  // iOS Safari 18: onClick handler - NO preventDefault to allow native click events
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // iOS Safari: Allow native click event - NO preventDefault
    handleNavigation(href);
    // Stop propagation to prevent double-handling
    e.stopPropagation();
  };

  // iOS Safari 18: onTouchEnd handler - preventDefault ONLY here for touch devices
  const handleTouchEnd = (
    e: React.TouchEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // iOS Safari: Only preventDefault on touch devices to convert touch to click
    if ('ontouchstart' in window) {
      e.preventDefault();
      handleNavigation(href);
    }
    e.stopPropagation();
  };

  const isActiveSection = (link: string) => {
    const sectionName = sectionNames[link] || link.replace("#", "");
    return activeSectionName === sectionName;
  };

  // Simplified render without complex inline styles
  return (
    <div
      className={cn(
        "floating-navbar-container",
        "flex items-center justify-between",
        "max-w-7xl",
        "rounded-full",
        "bg-white/10 backdrop-blur-md",
        "border border-white/20",
        "shadow-lg shadow-black/20",
        "px-4 py-2",
        className
      )}
    >
      {/* Logo */}
      <a
        href="#hero"
        onClick={(e) => handleClick(e, "#hero")}
        onTouchEnd={(e) => handleTouchEnd(e, "#hero")}
        onTouchCancel={(e) => e.stopPropagation()}
        aria-label="Zur Startseite - BuildWise"
        className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity px-2 py-1 cursor-pointer"
      >
        <img 
          src="/favicon.png" 
          alt="BuildWise Logo" 
          className="h-8 w-8 sm:h-10 sm:w-10 object-contain block max-w-full h-auto"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== window.location.origin + "/logo.png") {
              target.src = "/logo.png";
            }
          }}
        />
      </a>

      {/* Navigation Items */}
      <nav 
        className="flex items-center gap-1 sm:gap-3 flex-1 justify-center min-w-0 overflow-x-auto" 
        aria-label="Hauptnavigation"
      >
        {navItems.map((navItem: any, idx: number) => {
          const isActive = isActiveSection(navItem.link);
          return (
            <a
              key={`nav-link-${idx}`}
              href={navItem.link}
              onClick={(e) => handleClick(e, navItem.link)}
              onTouchEnd={(e) => handleTouchEnd(e, navItem.link)}
              onTouchCancel={(e) => e.stopPropagation()}
              aria-label={`Navigation zu ${navItem.name}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                "relative flex items-center",
                "gap-1 sm:gap-2",
                "px-2.5 py-1.5 sm:px-3.5 sm:py-2",
                "rounded-full",
                "text-sm sm:text-base",
                "font-medium",
                "transition-all duration-300",
                "flex-shrink-0",
                "whitespace-nowrap",
                "cursor-pointer",
                "min-h-[44px]",
                isActive
                  ? "text-[#f9c74f] font-bold bg-[#f9c74f]/15 border border-[#f9c74f]/40"
                  : "text-white/90 hover:text-[#f9c74f] hover:bg-white/10 border border-transparent"
              )}
            >
              {/* Icon - nur auf Mobile */}
              {navItem.icon && (
                <span className="block sm:hidden flex-shrink-0">
                  {React.cloneElement(navItem.icon as React.ReactElement, { 
                    className: cn("h-4 w-4", isActive ? "text-[#f9c74f]" : "text-white")
                  })}
                </span>
              )}
              {/* Text - nur auf Desktop */}
              <span className="hidden sm:block">{navItem.name}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
};