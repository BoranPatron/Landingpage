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
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

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
  };

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

        // Direkte DOM-Updates mit Browser-spezifischen Prefixes für Safari, Chrome und Firefox
        // Performance: Batch DOM-Updates mit transform3d für Hardware-Beschleunigung
        const transform = `translate3d(${x}px, ${y}px, 0)`;
        nodeElement.style.transform = transform;
        nodeElement.style.webkitTransform = transform;
        (nodeElement.style as any).MozTransform = transform; // Firefox prefix
        nodeElement.style.opacity = String(opacity);
        // Mobile Performance: Vermeide Layout-Shifts mit will-change nur wenn nötig
        if (isMobile && autoRotate) {
          nodeElement.style.willChange = "transform, opacity";
        } else if (!autoRotate) {
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
      className="w-full min-h-[600px] md:min-h-[700px] lg:min-h-[900px] flex flex-col items-center justify-center bg-transparent overflow-hidden relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-6xl flex items-center justify-center py-12 md:py-16 lg:py-20 min-h-[600px] md:min-h-[700px] lg:min-h-[900px]">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            WebkitPerspective: "1000px",
            perspective: "1000px",
            transform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
            WebkitTransform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
            MozTransform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
            willChange: autoRotate ? "transform" : "auto",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[#f9c74f] via-[#d4af3a] to-[#51646f] animate-pulse flex items-center justify-center z-10 shadow-xl shadow-[#f9c74f]/50" style={{ 
            willChange: autoRotate ? "transform" : "auto",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
            // iOS Safari border-radius Fix für zentrale Kreis
            WebkitBorderRadius: "50%",
            borderRadius: "50%",
            MozBorderRadius: "50%",
            // iOS Safari Hardware-Beschleunigung
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
            // iOS Safari Clip-Path Fix
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
                  WebkitTransform: "translateZ(0)",
                  transform: "translateZ(0)",
                }}></div>
                <div
                  className="absolute w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border border-[#f9c74f]/20 animate-ping opacity-50"
                  style={{ 
                    animationDelay: "0.5s",
                    WebkitBorderRadius: "50%",
                    borderRadius: "50%",
                    MozBorderRadius: "50%",
                    WebkitTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                  }}
                ></div>
              </>
            )}
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg" style={{
              WebkitBorderRadius: "50%",
              borderRadius: "50%",
              MozBorderRadius: "50%",
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
              WebkitClipPath: "inset(0 round 50%)",
              clipPath: "inset(0 round 50%)",
              overflow: "hidden",
            }}></div>
          </div>

          <div className="absolute w-[400px] h-[400px] md:w-[550px] md:h-[550px] lg:w-[700px] lg:h-[700px] rounded-full border border-[#f9c74f]/20 shadow-inner" style={{
            WebkitBorderRadius: "50%",
            borderRadius: "50%",
            MozBorderRadius: "50%",
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle: React.CSSProperties = {
              // Browser-spezifische Prefixes für Safari, Chrome und Firefox
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              WebkitTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              MozTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
              // iOS Safari Hardware-Beschleunigung Fix
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              WebkitPerspective: "1000px",
              perspective: "1000px",
              // iOS Safari Rendering Fix - zwingt Hardware-Beschleunigung
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
              // will-change nur temporär während Animation (wird von requestAnimationFrame gehandhabt)
              willChange: autoRotate ? "transform, opacity" : "auto",
              contain: "layout style paint",
            };

            return (
              <div
                key={item.id}
                ref={(el) => (nodeRefs.current[item.id] = el)}
                className={`absolute cursor-pointer ${isMobile ? "transition-transform duration-300 ease-out" : "transition-transform duration-500 ease-out"}`}
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                 {/* Energy Glow Effect - responsive sizing */}
                 <div
                   className={`absolute rounded-full -inset-1 ${
                     isPulsing ? "animate-pulse duration-1000" : ""
                   }`}
                   style={{
                     background: `radial-gradient(circle, rgba(249,199,79,0.3) 0%, rgba(249,199,79,0) 70%)`,
                     width: `${item.energy * glowSize.multiplier + glowSize.base}px`,
                     height: `${item.energy * glowSize.multiplier + glowSize.base}px`,
                     left: `-${(item.energy * glowSize.multiplier) / 2}px`,
                     top: `-${(item.energy * glowSize.multiplier) / 2}px`,
                     // iOS Safari border-radius Fix für Glow
                     WebkitBorderRadius: "50%",
                     borderRadius: "50%",
                     MozBorderRadius: "50%",
                     // iOS Safari Hardware-Beschleunigung
                     WebkitTransform: "translateZ(0)",
                     transform: "translateZ(0)",
                     WebkitBackfaceVisibility: "hidden",
                     backfaceVisibility: "hidden",
                   }}
                 ></div>

                 <div
                   className={`
                   w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center
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
                 `}
                 style={{
                   // iOS Safari border-radius Fix - explizite WebKit-Prefixes
                   WebkitBorderRadius: "50%",
                   borderRadius: "50%",
                   MozBorderRadius: "50%",
                   // iOS Safari Hardware-Beschleunigung - zwingt GPU-Rendering
                   WebkitTransform: "translateZ(0)",
                   transform: "translateZ(0)",
                   // iOS Safari Rendering Fix - verhindert eckige Frames
                   WebkitBackfaceVisibility: "hidden",
                   backfaceVisibility: "hidden",
                   // iOS Safari Clip-Path Fix für runde Elemente
                   WebkitClipPath: "inset(0 round 50%)",
                   clipPath: "inset(0 round 50%)",
                   // iOS Safari Overflow Fix
                   overflow: "hidden",
                 }}
                 >
                   <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                 </div>

                 <div
                   className={`
                   absolute top-16 md:top-20 lg:top-24 whitespace-nowrap
                   text-xs md:text-sm lg:text-base font-semibold tracking-wider
                  transition-opacity duration-300 ease-out
                  ${isExpanded ? "text-[#f9c74f] scale-125 drop-shadow-lg" : "text-white/80 drop-shadow-md"}
                `}
                  style={{
                    textShadow: isExpanded 
                      ? "0 0 8px rgba(249,199,79,0.8), 0 0 16px rgba(249,199,79,0.4)" 
                      : "0 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(249,199,79,0.3)",
                    // iOS Safari Text-Rendering Fix
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                    fontSmoothing: "antialiased",
                    // iOS Safari Text-Darstellung Fix - zwingt Text-Rendering
                    WebkitTextRendering: "optimizeLegibility",
                    textRendering: "optimizeLegibility",
                    // iOS Safari Transform Fix für Text - Hardware-Beschleunigung
                    WebkitTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                    // iOS Safari Will-Render Fix - verhindert fehlenden Text
                    WebkitWillChange: "transform, opacity",
                    willChange: "transform, opacity",
                    // iOS Safari Display Fix
                    display: "block",
                    WebkitTextStroke: "0.5px transparent",
                  }}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-[4.5rem] md:top-20 lg:top-24 left-1/2 -translate-x-1/2 w-[85vw] max-w-md md:max-w-lg lg:max-w-xl bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible z-50">
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

