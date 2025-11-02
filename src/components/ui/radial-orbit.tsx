"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { RadialOrbitItem } from "../../radial-orbit-data";

interface RadialOrbitalTimelineProps {
  timelineData: RadialOrbitItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  // useRef für rotationAngle verhindert Re-Renders während Animation
  const rotationAngleRef = useRef<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0); // Nur für initial render
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(350);
  const [glowSize, setGlowSize] = useState<{ base: number; multiplier: number }>({ base: 60, multiplier: 0.8 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const textRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const touchStartTimeRef = useRef<Record<number, number>>({});

  // iOS Detection
  useEffect(() => {
    const detectIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
    };
    detectIOS();
  }, []);

  // Mobile Detection und Responsive Radius/Glow-Size basierend auf Screen-Size
  useEffect(() => {
    const updateResponsiveSizes = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setRadius(200); // Mobile
        setGlowSize({ base: 52, multiplier: 0.6 });
      } else if (width < 1024) {
        setRadius(280); // Tablet
        setGlowSize({ base: 56, multiplier: 0.7 });
      } else {
        setRadius(350); // Desktop
        setGlowSize({ base: 60, multiplier: 0.8 });
      }
    };

    // Initial check
    updateResponsiveSizes();

    // Throttled resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateResponsiveSizes();
      }, 150); // Throttle to max 6-7 calls per second
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    try {
      setExpandedItems((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          if (parseInt(key) !== id) {
            newState[parseInt(key)] = false;
          }
        });
        newState[id] = !prev[id];

        if (!prev[id]) {
          setActiveNodeId(id);
          setAutoRotate(false);
          const relatedItems = getRelatedItems(id);
          const newPulseEffect: Record<number, boolean> = {};
          relatedItems.forEach((relId) => {
            newPulseEffect[relId] = true;
          });
          setPulseEffect(newPulseEffect);
          centerViewOnNode(id);
        } else {
          setActiveNodeId(null);
          setAutoRotate(true);
          setPulseEffect({});
        }

        return newState;
      });
    } catch (error) {
      console.error('Error in toggleItem:', error);
    }
  };

  // iOS Safari: Touch-Event Handler - robust gegen Fehler
  const handleTouchStart = (id: number, e: React.TouchEvent) => {
    try {
      e.stopPropagation();
      touchStartTimeRef.current[id] = Date.now();
    } catch (error) {
      console.error('Error in handleTouchStart:', error);
    }
  };

  const handleTouchEnd = (id: number, e: React.TouchEvent) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      const touchDuration = touchStartTimeRef.current[id] 
        ? Date.now() - touchStartTimeRef.current[id] 
        : 0;
      // Nur bei kurzen Touches (kein Long-Press)
      if (touchDuration < 500) {
        toggleItem(id);
      }
    } catch (error) {
      console.error('Error in handleTouchEnd:', error);
    }
  };

  // iOS Safari: Text-Rendering mit useEffect für Direct DOM-Manipulation
  useEffect(() => {
    // Setze Text direkt via DOM für iOS Safari Kompatibilität
    timelineData.forEach((item) => {
      const textElement = textRefs.current[item.id];
      if (textElement) {
        // Direkte DOM-Manipulation für iOS Safari
        textElement.textContent = item.title;
        // Fallback: innerHTML falls textContent nicht funktioniert
        if (!textElement.textContent) {
          textElement.innerHTML = item.title;
        }
      }
    });
  }, [timelineData, expandedItems]);

  // requestAnimationFrame für perfekte 60 FPS Synchronisation mit Browser-Repaints
  // expandedItems wird via ref gehandhabt um Closure-Probleme zu vermeiden
  const expandedItemsRef = useRef(expandedItems);
  useEffect(() => {
    expandedItemsRef.current = expandedItems;
  }, [expandedItems]);

  useEffect(() => {
    let shouldAnimate = false;

    const animate = (currentTime: number) => {
      if (!shouldAnimate) return;

      const deltaTime = currentTime - lastFrameTimeRef.current;
      const rotationSpeed = isMobile ? 0.15 : 0.2; // Langsamere Rotation auf Mobile (Grad pro Frame bei 60 FPS)
      
      // Angle-Increment basierend auf Frame-Time für konstante Geschwindigkeit
      const angleIncrement = (rotationSpeed * deltaTime) / 16.67; // Normalisiert auf 16.67ms (60 FPS)

      rotationAngleRef.current = (rotationAngleRef.current + angleIncrement) % 360;
      lastFrameTimeRef.current = currentTime;

      // Direkte DOM-Updates für alle Nodes (vermeidet Re-Renders)
      timelineData.forEach((item, index) => {
        const nodeElement = nodeRefs.current[item.id];
        if (!nodeElement) return;

        const angle = ((index / timelineData.length) * 360 + rotationAngleRef.current) % 360;
        const radian = (angle * Math.PI) / 180;

        // Sub-Pixel-Rounding für alle Browser (eliminiert jitter)
        const x = Math.round(radius * Math.cos(radian) + centerOffset.x);
        const y = Math.round(radius * Math.sin(radian) + centerOffset.y);
        
        // Opacity wird nur berechnet wenn nicht expanded (expanded = immer 1)
        const expandedState = expandedItemsRef.current[item.id];
        const opacity = expandedState 
          ? 1 
          : Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

        // Direkte DOM-Updates mit vollständigen WebKit-Prefixes für iOS Safari Kompatibilität
        // Performance: Batch DOM-Updates mit translate3d für Hardware-Beschleunigung
        const transform = `translate3d(${x}px, ${y}px, 0)`;
        // iOS Safari: Vollständige WebKit-Prefixes für alle Transform-Properties
        nodeElement.style.webkitTransform = transform;
        nodeElement.style.transform = transform;
        (nodeElement.style as any).MozTransform = transform; // Firefox prefix
        (nodeElement.style as any).msTransform = transform; // IE prefix
        nodeElement.style.opacity = String(opacity);
        // iOS Safari: Hardware-Beschleunigung - will-change für alle animierten Elemente
        if (autoRotate) {
          nodeElement.style.willChange = "transform, opacity";
          // iOS Safari: Layer-Hack für GPU-Rendering
          if (!nodeElement.style.webkitBackfaceVisibility) {
            nodeElement.style.webkitBackfaceVisibility = "hidden";
            nodeElement.style.backfaceVisibility = "hidden";
          }
        } else {
          nodeElement.style.willChange = "auto";
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (autoRotate && viewMode === "orbital") {
      shouldAnimate = true;
      lastFrameTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      shouldAnimate = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoRotate, viewMode, isMobile, timelineData, radius, centerOffset]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    rotationAngleRef.current = 270 - targetAngle;
    setRotationAngle(270 - targetAngle); // State für initial re-render wenn nötig
  };

  // Initial positions für ersten Render (wird dann von requestAnimationFrame übernommen)
  const nodePositions = useMemo(() => {
    return timelineData.map((_, index) => {
      const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
      const radian = (angle * Math.PI) / 180;

      // Sub-Pixel-Rounding für alle Browser
      const x = Math.round(radius * Math.cos(radian) + centerOffset.x);
      const y = Math.round(radius * Math.sin(radian) + centerOffset.y);
      const zIndex = Math.round(100 + 50 * Math.cos(radian));

      const opacity = Math.max(
        0.4,
        Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
      );

      return { x, y, angle, zIndex, opacity };
    });
  }, [timelineData.length, rotationAngle, radius, centerOffset]);

  const calculateNodePosition = (index: number) => {
    return nodePositions[index];
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: RadialOrbitItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full min-h-[600px] md:min-h-[700px] lg:min-h-[900px] flex flex-col items-center justify-center bg-transparent overflow-visible relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-6xl flex items-center justify-center py-12 md:py-16 lg:py-20 min-h-[600px] md:min-h-[700px] lg:min-h-[900px]" style={{ overflow: "visible" }}>
        {/* iOS Safari: Orbit-Container mit position absolute (NICHT fixed) für Perspective/Transform Konflikt */}
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            // iOS Safari: Position absolute statt fixed für Perspective/Transform Kompatibilität
            position: "absolute",
            // iOS Safari: Transform-Style mit WebKit-Prefix
            WebkitTransformStyle: "preserve-3d",
            transformStyle: "preserve-3d",
            // iOS Safari: Perspective mit vollständigen Prefixes
            WebkitPerspective: "1000px",
            perspective: "1000px",
            // iOS Safari: Transform mit WebKit-Prefix
            WebkitTransform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
            transform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
            MozTransform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
            // iOS Safari: Hardware-Beschleunigung
            willChange: autoRotate ? "transform" : "auto",
            WebkitWillChange: autoRotate ? "transform" : "auto",
            // iOS Safari: Backface-Visibility für alle transformierten Elemente
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            // iOS Safari: Containment für Performance
            contain: "layout style paint",
          }}
        >
          <div className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#f9c74f] via-[#d4af3a] to-[#51646f] animate-pulse flex items-center justify-center z-10 shadow-xl shadow-[#f9c74f]/50" style={{ 
            // iOS Safari: Hardware-Beschleunigung
            willChange: autoRotate ? "transform, opacity" : "auto",
            WebkitWillChange: autoRotate ? "transform, opacity" : "auto",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            // iOS Safari: Border-Radius mit WebKit-Prefix
            WebkitBorderRadius: "50%",
            borderRadius: "50%",
            MozBorderRadius: "50%",
            // iOS Safari: translate3d statt translateZ für Hardware-Beschleunigung
            WebkitTransform: "translate3d(0, 0, 0)",
            transform: "translate3d(0, 0, 0)",
            // iOS Safari: WebKit-Prefixes für Transition
            WebkitTransition: "transform 0.3s ease-out, opacity 0.3s ease-out",
            transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
            // iOS Safari: Clip-Path Fix
            WebkitClipPath: "inset(0 round 50%)",
            clipPath: "inset(0 round 50%)",
            overflow: "hidden",
          }}>
            {/* Reduziere animate-ping auf Mobile für bessere Performance */}
            {!isMobile && (
              <>
                <div className="absolute w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border border-[#f9c74f]/30 animate-ping opacity-70" style={{
                  WebkitBorderRadius: "50%",
                  borderRadius: "50%",
                  MozBorderRadius: "50%",
                  // iOS Safari: translate3d für Hardware-Beschleunigung
                  WebkitTransform: "translate3d(0, 0, 0)",
                  transform: "translate3d(0, 0, 0)",
                  // iOS Safari: Hardware-Beschleunigung
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                  pointerEvents: "none",
                }}></div>
                <div
                  className="absolute w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border border-[#f9c74f]/20 animate-ping opacity-50"
                  style={{ 
                    animationDelay: "0.5s",
                    WebkitBorderRadius: "50%",
                    borderRadius: "50%",
                    MozBorderRadius: "50%",
                    // iOS Safari: translate3d für Hardware-Beschleunigung
                    WebkitTransform: "translate3d(0, 0, 0)",
                    transform: "translate3d(0, 0, 0)",
                    // iOS Safari: Hardware-Beschleunigung
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                    pointerEvents: "none",
                  }}
                ></div>
              </>
            )}
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg" style={{
              WebkitBorderRadius: "50%",
              borderRadius: "50%",
              MozBorderRadius: "50%",
              // iOS Safari: translate3d für Hardware-Beschleunigung
              WebkitTransform: "translate3d(0, 0, 0)",
              transform: "translate3d(0, 0, 0)",
              // iOS Safari: Hardware-Beschleunigung
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              WebkitClipPath: "inset(0 round 50%)",
              clipPath: "inset(0 round 50%)",
              overflow: "hidden",
            }}></div>
          </div>

          <div className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] rounded-full border border-[#f9c74f]/20 shadow-inner" style={{
            WebkitBorderRadius: "50%",
            borderRadius: "50%",
            MozBorderRadius: "50%",
            // iOS Safari: translate3d für Hardware-Beschleunigung
            WebkitTransform: "translate3d(0, 0, 0)",
            transform: "translate3d(0, 0, 0)",
            // iOS Safari: Hardware-Beschleunigung
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            pointerEvents: "none",
          }}></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle: React.CSSProperties = {
              // iOS Safari: Vollständige WebKit-Prefixes für alle Transform-Properties
              WebkitTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              MozTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              // iOS Safari: Position relative für Stacking-Kontext
              position: "relative",
              zIndex: 0, // z-index: 0 mit position: relative erstellt neuen Stacking-Kontext
              // iOS Safari: Isolation-Kontext für korrektes border-radius Rendering
              isolation: "isolate",
              WebkitIsolation: "isolate",
              // iOS Safari: Hardware-Beschleunigung - backface-visibility mit WebKit-Prefix
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              // iOS Safari: Transform-Style mit WebKit-Prefix
              WebkitTransformStyle: "preserve-3d",
              transformStyle: "preserve-3d",
              // z-index für Layering
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
              // iOS Safari: will-change für Hardware-Beschleunigung (wird auch in DOM-Updates gesetzt)
              willChange: autoRotate ? "transform, opacity" : "auto",
              WebkitWillChange: autoRotate ? "transform, opacity" : "auto",
              // iOS Safari: Containment für Performance
              contain: "layout style paint",
            };

            return (
                <div
                  key={item.id}
                  ref={(el) => (nodeRefs.current[item.id] = el)}
                  className={`absolute cursor-pointer ${isMobile ? "transition-transform duration-300 ease-out" : "transition-transform duration-500 ease-out"}`}
                  style={nodeStyle}
                  // iOS Safari: Touch-Events statt onClick für bessere Kompatibilität
                  onTouchStart={(e) => handleTouchStart(item.id, e)}
                  onTouchEnd={(e) => handleTouchEnd(item.id, e)}
                  onClick={(e) => {
                    try {
                      e.stopPropagation();
                      // Nur bei Desktop/Maus verwenden
                      if (!('ontouchstart' in window)) {
                        toggleItem(item.id);
                      }
                    } catch (error) {
                      console.error('Error in onClick:', error);
                    }
                  }}
                >
                 {/* iOS Safari: Glow-Effekt mit pointer-events: none für Performance während Animation */}
                 <div
                   className={`absolute rounded-full ${
                     isPulsing ? "animate-pulse duration-1000" : ""
                   }`}
                   style={{
                     width: `${item.energy * glowSize.multiplier + glowSize.base}px`,
                     height: `${item.energy * glowSize.multiplier + glowSize.base}px`,
                     left: `50%`,
                     top: `50%`,
                     // iOS Safari: translate3d statt translate für Hardware-Beschleunigung
                     WebkitTransform: `translate3d(-50%, -50%, 0)`,
                     transform: `translate3d(-50%, -50%, 0)`,
                     // iOS Safari: WebKit-Prefixes für Transition
                     WebkitTransition: "transform 0.3s ease-out, opacity 0.3s ease-out",
                     transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
                     // iOS Safari: Box-Shadow für Glow
                     boxShadow: `0 0 ${item.energy * 0.8 + 20}px rgba(249,199,79,0.4), 0 0 ${item.energy * 0.6 + 15}px rgba(249,199,79,0.3), 0 0 ${item.energy * 0.4 + 10}px rgba(249,199,79,0.2)`,
                     WebkitBoxShadow: `0 0 ${item.energy * 0.8 + 20}px rgba(249,199,79,0.4), 0 0 ${item.energy * 0.6 + 15}px rgba(249,199,79,0.3), 0 0 ${item.energy * 0.4 + 10}px rgba(249,199,79,0.2)`,
                     // iOS Safari: border-radius Fix
                     WebkitBorderRadius: "50%",
                     borderRadius: "50%",
                     MozBorderRadius: "50%",
                     // iOS Safari: Isolation für border-radius
                     isolation: "isolate",
                     WebkitIsolation: "isolate",
                     position: "absolute",
                     zIndex: 0,
                     // iOS Safari: Hardware-Beschleunigung
                     WebkitBackfaceVisibility: "hidden",
                     backfaceVisibility: "hidden",
                     // iOS Safari: Clip-Path Fallback
                     WebkitClipPath: "circle(50% at 50% 50%)",
                     clipPath: "circle(50% at 50% 50%)",
                     // iOS Safari: pointer-events: none während Animation für Performance
                     pointerEvents: "none",
                   }}
                 ></div>

                 {/* iOS Safari: Item-Container mit robuster border-radius Strategie */}
                 <div
                   className={`
                   flex items-center justify-center relative
                  ${
                    isExpanded
                      ? "bg-white text-black"
                      : isRelated
                      ? "bg-[#f9c74f]/80 text-black"
                      : "bg-[#51646f]/90 backdrop-blur-sm text-white"
                  }
                  border-2 
                  ${
                    isExpanded
                      ? "border-white shadow-lg shadow-[#f9c74f]/50"
                      : isRelated
                      ? "border-[#f9c74f] animate-pulse shadow-lg shadow-[#f9c74f]/40"
                      : "border-[#f9c74f]/50 shadow-md shadow-[#f9c74f]/20"
                  }
                  transition-transform duration-300 ease-out transform
                  ${isExpanded ? "scale-150" : ""}
                   hover:scale-110
                  ${isMobile ? "w-14 h-14" : "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"}
                 `}
                 style={{
                   // iOS Safari: Stacking-Kontext Fix
                   position: "relative",
                   zIndex: 0,
                   // iOS Safari: Isolation-Kontext
                   isolation: "isolate",
                   WebkitIsolation: "isolate",
                   // iOS Safari: Border-Radius mit WebKit-Prefix
                   WebkitBorderRadius: "50%",
                   borderRadius: "50%",
                   MozBorderRadius: "50%",
                   // iOS Safari: Overflow hidden für runde Form
                   overflow: "hidden",
                   // iOS Safari: translate3d für Hardware-Beschleunigung (Layer-Hack)
                   WebkitTransform: "translate3d(0, 0, 0)",
                   transform: "translate3d(0, 0, 0)",
                   // iOS Safari: WebKit-Prefixes für Transition
                   WebkitTransition: "transform 0.3s ease-out, opacity 0.3s ease-out",
                   transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
                   // iOS Safari: Hardware-Beschleunigung - backface-visibility
                   WebkitBackfaceVisibility: "hidden",
                   backfaceVisibility: "hidden",
                   // iOS Safari: will-change für Hardware-Beschleunigung
                   willChange: "transform, opacity",
                   WebkitWillChange: "transform, opacity",
                   // iOS Safari: Clip-Path Fallback
                   WebkitClipPath: "circle(50% at 50% 50%)",
                   clipPath: "circle(50% at 50% 50%)",
                   // iOS Safari: SVG-Mask Fallback
                   mask: "radial-gradient(circle, black 50%, transparent 50%)",
                   WebkitMask: "radial-gradient(circle, black 50%, transparent 50%)",
                   // z-index für Layering
                   zIndex: 10,
                 }}
                 >
                   <Icon className={`${isMobile ? "w-5 h-5" : "w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"}`} />
                 </div>

                 {/* iOS Safari: Text-Rendering mit Direct DOM-Manipulation für maximale Kompatibilität */}
                 <div
                   ref={(el) => (textRefs.current[item.id] = el)}
                   className={`
                   absolute whitespace-nowrap
                   font-semibold tracking-wider
                  transition-opacity duration-300 ease-out
                  ${isExpanded ? "text-[#f9c74f] scale-125 drop-shadow-lg" : "text-white/80 drop-shadow-md"}
                  ${isMobile ? "top-20 text-xs" : "top-16 md:top-20 lg:top-24 text-xs md:text-sm lg:text-base"}
                `}
                  style={{
                    // iOS Safari: Text-Positionierung mit transform auf Text-Element selbst (nicht Parent)
                    left: "50%",
                    transform: "translateX(-50%) translateZ(0)",
                    WebkitTransform: "translateX(-50%) translateZ(0)",
                    top: isMobile ? "72px" : undefined, // Mobile: 72px = 4.5rem (unter 56px Item + 16px Abstand)
                    // iOS Safari: Position absolute mit expliziten Koordinaten
                    position: "absolute",
                    // iOS Safari: Isolation-Kontext für Text-Rendering
                    isolation: "isolate",
                    WebkitIsolation: "isolate",
                    textShadow: isExpanded 
                      ? "0 0 8px rgba(249,199,79,0.8), 0 0 16px rgba(249,199,79,0.4)" 
                      : isMobile
                      ? "0 2px 4px rgba(0,0,0,0.9), 0 0 6px rgba(249,199,79,0.5)" // Stärkerer Schatten für Mobile Lesbarkeit
                      : "0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(249,199,79,0.3)",
                    // iOS Safari Text-Rendering Fix - verstärkt
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                    fontSmoothing: "antialiased",
                    // iOS Safari: Text-Darstellung Fix - zwingt Text-Rendering
                    WebkitTextRendering: "optimizeLegibility",
                    textRendering: "optimizeLegibility",
                    // iOS Safari: Will-Render Fix - verhindert fehlenden Text
                    WebkitWillChange: "opacity",
                    willChange: "opacity",
                    // iOS Safari: Display Fix - zwingt Darstellung
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                    WebkitTextStroke: "0.5px transparent",
                    // iOS Safari: Neue Rendering-Ebene für Text
                    WebkitBackfaceVisibility: "visible",
                    backfaceVisibility: "visible",
                    // z-index für Text über allen anderen Elementen
                    zIndex: isExpanded ? 300 : 150,
                    // Sicherstellen dass Text nicht versteckt wird
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    // Mobile Font-Size explizit setzen
                    fontSize: isMobile ? "0.75rem" : undefined, // 12px auf Mobile für gute Lesbarkeit
                    lineHeight: "1.4",
                    // iOS Safari: Font-Weight explizit setzen
                    fontWeight: 600,
                  }}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md md:max-w-lg lg:max-w-xl bg-black/95 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible z-[9999]" style={{
                    // iOS Safari: Fixed Position für Popup
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    WebkitTransform: "translate(-50%, -50%)",
                    // iOS Safari: Maximaler z-index
                    zIndex: 9999,
                    // iOS Safari: Isolation für korrektes Rendering
                    isolation: "isolate",
                    WebkitIsolation: "isolate",
                    // iOS Safari: Backdrop-Filter mit Fallback
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                  }}>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50"></div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <Badge
                          className={`px-2 text-xs ${getStatusStyles(
                            item.status
                          )}`}
                        >
                          {item.status === "completed"
                            ? "COMPLETE"
                            : item.status === "in-progress"
                            ? "IN PROGRESS"
                            : "PENDING"}
                        </Badge>
                        <span className="text-xs font-mono text-white/50">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-base md:text-lg mt-3 mb-1">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm md:text-base text-white/80 leading-relaxed">
                      <p className="break-words whitespace-normal">{item.content}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

