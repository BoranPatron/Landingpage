import React, { useState, useEffect } from "react";
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
  "#hero": "Zukunft",
  "#personas": "Rollen",
  "#timeline": "Prozess",
  "#pricing": "Preise",
  "#about": "Über uns",
  "#faq": "FAQ",
};

export const FloatingNav = ({ navItems, className }: FloatingNavProps) => {
  const [activeSectionName, setActiveSectionName] = useState<string>("Zukunft");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // iOS Safari: Ensure body overflow-y is set correctly and component is mounted
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
    
    // iOS Safari: Mark as mounted after short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // iOS Safari: Ensure navbar container is clickable after render
  useEffect(() => {
    if (!isMounted) return;
    
    // Wait a bit for React to render the navbar
    const timer = setTimeout(() => {
      const navbarContainer = document.querySelector('.floating-navbar-container');
      if (navbarContainer) {
        // Force repaint to ensure navbar is clickable on iOS Safari
        const container = navbarContainer as HTMLElement;
        container.style.display = 'flex';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
        container.style.zIndex = '9999';
        
        // iOS Safari: Force hardware acceleration
        container.style.transform = 'translateZ(0)';
        container.style.webkitTransform = 'translateZ(0)';
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted]);

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

    setTimeout(checkInitialSection, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>, 
    href: string
  ) => {
    // iOS Safari: Prevent default and stop propagation
    e.preventDefault();
    e.stopPropagation();
    
    const targetId = href;
    if (targetId === '#' || !targetId) return;
    
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  // iOS Safari: Enhanced touch handler with fallback
  const handleTouchStart = (
    e: React.TouchEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // iOS Safari: Allow touch events to propagate but ensure they're handled
    e.stopPropagation();
  };

  // iOS Safari: Enhanced click handler with fallback
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    handleLinkClick(e, href);
    // iOS Safari: Ensure click event doesn't bubble to parent
    e.stopPropagation();
    return false;
  };

  const isActiveSection = (link: string) => {
    const sectionName = sectionNames[link] || link.replace("#", "");
    return activeSectionName === sectionName;
  };

  // iOS Safari: Don't render until mounted to ensure DOM is ready
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "floating-navbar-container",
        "flex items-center justify-between",
        "fixed top-6 left-4 right-4",
        "sm:top-10 sm:left-auto sm:right-auto sm:inset-x-0 sm:mx-auto",
        "max-w-7xl",
        "px-3 py-2.5 sm:px-5 sm:py-3",
        "rounded-full",
        "gap-2 sm:gap-4",
        className
      )}
      style={{
        // iOS Safari: EXTREM HOHER z-index für absolute Priorität
        zIndex: 999999,
        position: 'fixed',
        
        // iOS Safari: Stacking Context - KEINE Isolation, konkurriert global
        // isolation: 'isolate', // ENTFERNT - verhindert globale z-index Konkurrenz
        
        // iOS Safari: Backdrop und Background - WIRD VERSCHOBEN zu ::before Pseudo-Element
        background: 'rgba(81, 100, 111, 0.75)',
        // Backdrop-Filter wird in separatem Layer gerendert (siehe CSS)
        
        // iOS Safari: Border
        border: '1px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '9999px',
        
        // iOS Safari: Shadow
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25), 0 0 40px rgba(81, 100, 111, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        
        // iOS Safari: Clickability - MAXIMALE Priorität
        pointerEvents: 'auto',
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        
        // iOS Safari: Hardware acceleration
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
        
        // iOS Safari: Visibility
        display: 'flex',
        visibility: 'visible',
        opacity: 1,
        
        // iOS Safari: Containment EXPLICITLY DISABLED
        contain: 'none',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        onClick={(e) => handleClick(e, "#hero")}
        onTouchStart={(e) => handleTouchStart(e, "#hero")}
        onTouchEnd={(e) => handleLinkClick(e, "#hero")}
        onTouchCancel={(e) => e.stopPropagation()}
        aria-label="Zur Startseite - BuildWise"
        className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
        style={{
          WebkitTapHighlightColor: 'rgba(249, 199, 79, 0.3)',
          touchAction: 'manipulation',
          pointerEvents: 'auto',
          cursor: 'pointer',
          padding: '0.25rem 0.5rem',
          minWidth: 'fit-content',
        }}
      >
        <img 
          src="/favicon.png" 
          alt="BuildWise Logo" 
          className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
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
        className="flex items-center gap-1 sm:gap-3 flex-1 justify-center min-w-0" 
        aria-label="Hauptnavigation"
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {navItems.map((navItem: any, idx: number) => {
          const isActive = isActiveSection(navItem.link);
          return (
            <a
              key={`nav-link-${idx}`}
              href={navItem.link}
              onClick={(e) => handleClick(e, navItem.link)}
              onTouchStart={(e) => handleTouchStart(e, navItem.link)}
              onTouchEnd={(e) => handleLinkClick(e, navItem.link)}
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
                isActive
                  ? "text-[#f9c74f] font-bold"
                  : "text-white/90 hover:text-[#f9c74f]"
              )}
              style={{
                // iOS Safari: Active State
                background: isActive ? 'rgba(249, 199, 79, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(249, 199, 79, 0.4)' : '1px solid transparent',
                textShadow: isActive ? '0 0 10px rgba(249, 199, 79, 0.6)' : 'none',
                
                // iOS Safari: Touch
                WebkitTapHighlightColor: 'rgba(249, 199, 79, 0.3)',
                touchAction: 'manipulation',
                pointerEvents: 'auto',
                cursor: 'pointer',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                
                // iOS Safari: Min touch target
                minHeight: '44px',
                minWidth: 'fit-content',
                
                // iOS Safari: Hover effect
                ...(isActive ? {} : {
                  ':hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                })
              }}
            >
              {/* Icon - nur auf Mobile */}
              {navItem.icon && (
                <span className="block sm:hidden flex-shrink-0">
                  {React.cloneElement(navItem.icon as React.ReactElement, { 
                    className: "h-4 w-4",
                    style: {
                      color: isActive ? '#f9c74f' : 'white',
                    }
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