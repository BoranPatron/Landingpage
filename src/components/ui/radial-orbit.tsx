"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { RadialOrbitItem } from "../../radial-orbit-data";

interface RadialOrbitalTimelineProps {
  timelineData: RadialOrbitItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const rotationAngleRef = useRef<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(350);
  const [glowSize, setGlowSize] = useState<{ base: number; multiplier: number }>({ 
    base: 60, 
    multiplier: 0.8 
  });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const touchStartTimeRef = useRef<Record<number, number>>({});
  const expandedItemsRef = useRef(expandedItems);

  // iOS Detection
  useEffect(() => {
    const detectIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
      console.log('iOS Detection:', isIOSDevice);
    };
    detectIOS();
  }, []);

  // Responsive Radius/Glow-Size
  useEffect(() => {
    const updateResponsiveSizes = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setRadius(180);
        setGlowSize({ base: 48, multiplier: 0.5 });
      } else if (width < 1024) {
        setRadius(260);
        setGlowSize({ base: 54, multiplier: 0.65 });
      } else {
        setRadius(320);
        setGlowSize({ base: 58, multiplier: 0.75 });
      }
    };

    updateResponsiveSizes();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateResponsiveSizes, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Sync expandedItems to ref
  useEffect(() => {
    expandedItemsRef.current = expandedItems;
  }, [expandedItems]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = useCallback((itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  }, [timelineData]);

  const toggleItem = useCallback((id: number) => {
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
          
          // Center view on node
          const nodeIndex = timelineData.findIndex((item) => item.id === id);
          const totalNodes = timelineData.length;
          const targetAngle = (nodeIndex / totalNodes) * 360;
          const newAngle = 270 - targetAngle;
          rotationAngleRef.current = newAngle;
          setRotationAngle(newAngle);
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
  }, [timelineData, getRelatedItems]);

  // Touch handlers for iOS
  const handleTouchStart = useCallback((id: number, e: React.TouchEvent) => {
    try {
      e.stopPropagation();
      touchStartTimeRef.current[id] = Date.now();
    } catch (error) {
      console.error('Error in handleTouchStart:', error);
    }
  }, []);

  const handleTouchEnd = useCallback((id: number, e: React.TouchEvent) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      const touchDuration = touchStartTimeRef.current[id] 
        ? Date.now() - touchStartTimeRef.current[id] 
        : 0;
      if (touchDuration < 500) {
        toggleItem(id);
      }
    } catch (error) {
      console.error('Error in handleTouchEnd:', error);
    }
  }, [toggleItem]);

  // KRITISCH: Position-Berechnung als stabile Funktion
  const calculatePosition = useCallback((index: number, currentAngle: number) => {
    const angle = ((index / timelineData.length) * 360 + currentAngle) % 360;
    const radian = (angle * Math.PI) / 180;

    // iOS Safari: Verwende Math.round für pixelgenaue Positionierung
    const x = Math.round(radius * Math.cos(radian));
    const y = Math.round(radius * Math.sin(radian));
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

    return { x, y, angle, zIndex, opacity };
  }, [timelineData.length, radius]);

  // KRITISCH: Initiale Positionen für SSR/Initial Render
  const initialPositions = useMemo(() => {
    return timelineData.map((_, index) => 
      calculatePosition(index, rotationAngle)
    );
  }, [timelineData, rotationAngle, calculatePosition]);

  // KRITISCH: State für aktuelle Positionen (wird von Animation aktualisiert)
  const [currentPositions, setCurrentPositions] = useState(initialPositions);

  // Update positions when rotation angle changes (for manual rotation)
  useEffect(() => {
    const newPositions = timelineData.map((_, index) => 
      calculatePosition(index, rotationAngle)
    );
    setCurrentPositions(newPositions);
  }, [rotationAngle, timelineData, calculatePosition]);

  // Animation Loop mit requestAnimationFrame
  useEffect(() => {
    if (!autoRotate || viewMode !== "orbital") {
      return;
    }

    let shouldAnimate = true;
    const rotationSpeed = isMobile ? 0.15 : 0.2;

    const animate = (currentTime: number) => {
      if (!shouldAnimate) return;

      const deltaTime = currentTime - lastFrameTimeRef.current;
      const angleIncrement = (rotationSpeed * deltaTime) / 16.67;

      rotationAngleRef.current = (rotationAngleRef.current + angleIncrement) % 360;
      lastFrameTimeRef.current = currentTime;

      // Update positions
      const newPositions = timelineData.map((_, index) => 
        calculatePosition(index, rotationAngleRef.current)
      );
      setCurrentPositions(newPositions);

      // iOS Safari: Direkte DOM-Updates für flüssige Animation
      timelineData.forEach((item, index) => {
        const nodeElement = nodeRefs.current[item.id];
        if (!nodeElement) return;

        const pos = newPositions[index];
        const isExpanded = expandedItemsRef.current[item.id];
        const finalOpacity = isExpanded ? 1 : pos.opacity;

        // iOS Safari: Vollständige WebKit-Prefixes
        const transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        nodeElement.style.webkitTransform = transform;
        nodeElement.style.transform = transform;
        nodeElement.style.opacity = String(finalOpacity);
        nodeElement.style.zIndex = String(isExpanded ? 200 : pos.zIndex);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      shouldAnimate = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoRotate, viewMode, isMobile, timelineData, calculatePosition]);

  const isRelatedToActive = useCallback((itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  }, [activeNodeId, getRelatedItems]);

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
      <div className="relative w-full max-w-6xl flex items-center justify-center py-12 md:py-16 lg:py-20 min-h-[600px] md:min-h-[700px] lg:min-h-[900px]">
        {/* iOS Safari: Perspective Wrapper (separiert von Transform Container) */}
        <div
          className="absolute w-full h-full flex items-center justify-center"
          style={{
            WebkitPerspective: "1000px",
            perspective: "1000px",
            WebkitPerspectiveOrigin: "center center",
            perspectiveOrigin: "center center",
          }}
        >
          {/* iOS Safari: Transform Container */}
          <div
            ref={orbitRef}
            className="absolute w-full h-full flex items-center justify-center"
            style={{
              WebkitTransformStyle: "preserve-3d",
              transformStyle: "preserve-3d",
              WebkitTransform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
              transform: `translate3d(${centerOffset.x}px, ${centerOffset.y}px, 0)`,
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              willChange: autoRotate ? "transform" : "auto",
            }}
          >
            {/* Center Hub */}
            <div 
              className="absolute rounded-full bg-gradient-to-br from-[#f9c74f] via-[#d4af3a] to-[#51646f] flex items-center justify-center z-10 shadow-xl shadow-[#f9c74f]/50"
              style={{
                width: isMobile ? "64px" : "80px",
                height: isMobile ? "64px" : "80px",
                WebkitBorderRadius: "50%",
                borderRadius: "50%",
                WebkitTransform: "translate3d(0, 0, 0)",
                transform: "translate3d(0, 0, 0)",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
              }}
            >
              {!isMobile && (
                <>
                  <div 
                    className="absolute rounded-full border border-[#f9c74f]/30 animate-ping opacity-70"
                    style={{
                      width: "112px",
                      height: "112px",
                      WebkitBorderRadius: "50%",
                      borderRadius: "50%",
                      WebkitTransform: "translate3d(0, 0, 0)",
                      transform: "translate3d(0, 0, 0)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    className="absolute rounded-full border border-[#f9c74f]/20 animate-ping opacity-50"
                    style={{
                      width: "144px",
                      height: "144px",
                      animationDelay: "0.5s",
                      WebkitBorderRadius: "50%",
                      borderRadius: "50%",
                      WebkitTransform: "translate3d(0, 0, 0)",
                      transform: "translate3d(0, 0, 0)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}
              <div 
                className="rounded-full bg-white/90 backdrop-blur-md shadow-lg"
                style={{
                  width: isMobile ? "32px" : "48px",
                  height: isMobile ? "32px" : "48px",
                  WebkitBorderRadius: "50%",
                  borderRadius: "50%",
                  WebkitTransform: "translate3d(0, 0, 0)",
                  transform: "translate3d(0, 0, 0)",
                }}
              />
            </div>

            {/* Orbit Ring */}
            <div 
              className="absolute rounded-full border border-[#f9c74f]/20 shadow-inner"
              style={{
                width: `${radius * 2}px`,
                height: `${radius * 2}px`,
                WebkitBorderRadius: "50%",
                borderRadius: "50%",
                WebkitTransform: "translate3d(0, 0, 0)",
                transform: "translate3d(0, 0, 0)",
                pointerEvents: "none",
              }}
            />

            {/* Orbital Nodes */}
            {timelineData.map((item, index) => {
              const position = currentPositions[index] || initialPositions[index];
              const isExpanded = expandedItems[item.id];
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = pulseEffect[item.id];
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  ref={(el) => (nodeRefs.current[item.id] = el)}
                  className="absolute cursor-pointer transition-all duration-300 ease-out"
                  style={{
                    // KRITISCH: Initiale Transform-Werte im Style (nicht nur via DOM)
                    WebkitTransform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
                    zIndex: isExpanded ? 200 : position.zIndex,
                    opacity: isExpanded ? 1 : position.opacity,
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                    willChange: autoRotate ? "transform, opacity" : "auto",
                  }}
                  onTouchStart={(e) => handleTouchStart(item.id, e)}
                  onTouchEnd={(e) => handleTouchEnd(item.id, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!('ontouchstart' in window)) {
                      toggleItem(item.id);
                    }
                  }}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                    style={{
                      width: `${item.energy * glowSize.multiplier + glowSize.base}px`,
                      height: `${item.energy * glowSize.multiplier + glowSize.base}px`,
                      left: "50%",
                      top: "50%",
                      WebkitTransform: "translate3d(-50%, -50%, 0)",
                      transform: "translate3d(-50%, -50%, 0)",
                      boxShadow: `0 0 ${item.energy * 0.8 + 20}px rgba(249,199,79,0.4)`,
                      WebkitBorderRadius: "50%",
                      borderRadius: "50%",
                      pointerEvents: "none",
                      zIndex: -1,
                    }}
                  />

                  {/* Node Icon Container */}
                  <div
                    className={`
                      flex items-center justify-center
                      ${isExpanded ? "bg-white text-black" : isRelated ? "bg-[#f9c74f]/80 text-black" : "bg-[#51646f]/90 text-white"}
                      border-2
                      ${isExpanded ? "border-white shadow-lg shadow-[#f9c74f]/50" : isRelated ? "border-[#f9c74f] animate-pulse" : "border-[#f9c74f]/50"}
                      transition-transform duration-300
                      ${isExpanded ? "scale-150" : "hover:scale-110"}
                    `}
                    style={{
                      width: isMobile ? "56px" : "64px",
                      height: isMobile ? "56px" : "64px",
                      WebkitBorderRadius: "50%",
                      borderRadius: "50%",
                      overflow: "hidden",
                      WebkitTransform: "translate3d(0, 0, 0)",
                      transform: "translate3d(0, 0, 0)",
                      WebkitBackfaceVisibility: "hidden",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Icon className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
                  </div>

                  {/* Node Title */}
                  <div
                    className={`
                      absolute whitespace-nowrap font-semibold tracking-wider
                      ${isExpanded ? "text-[#f9c74f] scale-125" : "text-white/90"}
                    `}
                    style={{
                      top: isMobile ? "68px" : "76px",
                      left: "50%",
                      WebkitTransform: "translateX(-50%)",
                      transform: "translateX(-50%)",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      textShadow: isExpanded 
                        ? "0 0 8px rgba(249,199,79,0.8)" 
                        : "0 2px 4px rgba(0,0,0,0.9), 0 0 6px rgba(249,199,79,0.5)",
                      WebkitFontSmoothing: "antialiased",
                      pointerEvents: "none",
                      zIndex: 100,
                    }}
                  >
                    {item.title}
                  </div>

                  {/* Expanded Card */}
                  {isExpanded && (
                    <div
                      className="fixed inset-0 flex items-center justify-center z-[9999] px-4"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      <Card 
                        className="w-full max-w-md bg-black/95 backdrop-blur-lg border-white/30 shadow-xl"
                        style={{
                          pointerEvents: "auto",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center gap-2">
                            <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                              {item.status === "completed" ? "COMPLETE" : item.status === "in-progress" ? "IN PROGRESS" : "PENDING"}
                            </Badge>
                            <span className="text-xs font-mono text-white/50">{item.date}</span>
                          </div>
                          <CardTitle className="text-lg mt-3">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-white/80">
                          <p>{item.content}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}