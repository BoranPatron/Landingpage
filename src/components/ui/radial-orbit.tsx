"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(200);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const rotationAngleRef = useRef<number>(0);

  // Detect iOS
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    console.log('iOS detected:', isIOS);
  }, []);

  // Responsive radius
  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setRadius(140); // Kleinerer Radius für Mobile
      } else if (width < 1024) {
        setRadius(200);
      } else {
        setRadius(250);
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Calculate position - SIMPLIFIED for iOS
  const calculatePosition = useCallback((index: number, angle: number) => {
    const totalItems = timelineData.length;
    const itemAngle = (index / totalItems) * 360;
    const currentAngle = (itemAngle + angle) % 360;
    const radian = (currentAngle * Math.PI) / 180;

    // iOS Safari: Simple calculations with rounding
    const x = Math.round(radius * Math.cos(radian));
    const y = Math.round(radius * Math.sin(radian));
    
    // Z-depth for layering
    const z = Math.round(50 + 50 * Math.cos(radian));
    
    // Opacity based on position
    const opacity = 0.5 + 0.5 * ((1 + Math.sin(radian)) / 2);

    return { x, y, z, opacity: Math.max(0.4, Math.min(1, opacity)) };
  }, [timelineData.length, radius]);

  // Current positions state
  const [positions, setPositions] = useState(() => 
    timelineData.map((_, i) => calculatePosition(i, 0))
  );

  // Animation loop
  useEffect(() => {
    if (!autoRotate) return;

    let isRunning = true;
    const speed = isMobile ? 0.1 : 0.15; // Slower on mobile

    const animate = (time: number) => {
      if (!isRunning) return;

      const delta = time - lastFrameTimeRef.current;
      const increment = (speed * delta) / 16.67;
      
      rotationAngleRef.current = (rotationAngleRef.current + increment) % 360;
      lastFrameTimeRef.current = time;

      // Update positions
      const newPositions = timelineData.map((_, i) => 
        calculatePosition(i, rotationAngleRef.current)
      );
      setPositions(newPositions);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [autoRotate, isMobile, timelineData, calculatePosition]);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  }, []);

  const getRelatedItems = useCallback((itemId: number): number[] => {
    const item = timelineData.find(i => i.id === itemId);
    return item?.relatedIds || [];
  }, [timelineData]);

  const toggleItem = useCallback((id: number) => {
    setExpandedItems(prev => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[parseInt(key)] = parseInt(key) === id ? !prev[id] : false;
        return acc;
      }, {} as Record<number, boolean>);
      
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        
        const related = getRelatedItems(id);
        const pulses: Record<number, boolean> = {};
        related.forEach(relId => { pulses[relId] = true; });
        setPulseEffect(pulses);
        
        // Center on node
        const index = timelineData.findIndex(i => i.id === id);
        const targetAngle = (index / timelineData.length) * 360;
        rotationAngleRef.current = 270 - targetAngle;
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  }, [timelineData, getRelatedItems]);

  const isRelatedToActive = useCallback((itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  }, [activeNodeId, getRelatedItems]);

  const getStatusStyles = (status: RadialOrbitItem["status"]): string => {
    switch (status) {
      case "completed": return "text-white bg-black border-white";
      case "in-progress": return "text-black bg-white border-black";
      case "pending": return "text-white bg-black/40 border-white/50";
      default: return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="w-full min-h-screen flex items-center justify-center bg-transparent relative"
      style={{
        minHeight: isMobile ? "600px" : "800px",
        padding: isMobile ? "80px 20px" : "100px 40px",
      }}
    >
      {/* Orbit Container - SIMPLIFIED */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${radius * 2 + 200}px`,
          height: `${radius * 2 + 200}px`,
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        {/* Center Hub - iOS Safari: Round Fix */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full bg-gradient-to-br from-[#f9c74f] via-[#d4af3a] to-[#51646f] flex items-center justify-center shadow-xl shadow-[#f9c74f]/50"
          style={{
            width: isMobile ? "60px" : "80px",
            height: isMobile ? "60px" : "80px",
            marginLeft: isMobile ? "-30px" : "-40px",
            marginTop: isMobile ? "-30px" : "-40px",
            zIndex: 5,
            // iOS Safari: Border-Radius mit WebKit-Prefixes
            WebkitBorderRadius: "50%",
            borderRadius: "50%",
            MozBorderRadius: "50%",
            // iOS Safari: Overflow hidden für runde Form
            overflow: "hidden",
            // iOS Safari: Clip-Path Fallback
            WebkitClipPath: "circle(50% at 50% 50%)",
            clipPath: "circle(50% at 50% 50%)",
          }}
        >
          <div
            className="rounded-full bg-white/90 shadow-lg"
            style={{
              width: isMobile ? "28px" : "36px",
              height: isMobile ? "28px" : "36px",
              // iOS Safari: Border-Radius mit WebKit-Prefixes
              WebkitBorderRadius: "50%",
              borderRadius: "50%",
              MozBorderRadius: "50%",
              // iOS Safari: Overflow hidden für runde Form
              overflow: "hidden",
            }}
          />
        </div>

        {/* Orbit Ring - iOS Safari: Round Fix */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full border border-[#f9c74f]/20"
          style={{
            width: `${radius * 2}px`,
            height: `${radius * 2}px`,
            marginLeft: `-${radius}px`,
            marginTop: `-${radius}px`,
            pointerEvents: "none",
            // iOS Safari: Border-Radius mit WebKit-Prefixes
            WebkitBorderRadius: "50%",
            borderRadius: "50%",
            MozBorderRadius: "50%",
          }}
        />

        {/* Orbital Nodes */}
        {timelineData.map((item, index) => {
          const pos = positions[index];
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          // iOS Safari: Direct positioning with left/top instead of transform
          const nodeStyle: React.CSSProperties = {
            position: "absolute",
            // Center the orbit container, then offset by calculated position
            left: "50%",
            top: "50%",
            // iOS Safari: Use margin for positioning (more reliable than transform on iOS)
            marginLeft: `${pos.x - 32}px`, // 32 = half of node width (64px)
            marginTop: `${pos.y - 32}px`,  // 32 = half of node height (64px)
            zIndex: isExpanded ? 200 : pos.z,
            opacity: isExpanded ? 1 : pos.opacity,
            transition: "opacity 0.3s ease-out, margin 0.3s ease-out",
            cursor: "pointer",
          };

          return (
            <div
              key={item.id}
              style={nodeStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleItem(item.id);
              }}
            >
              {/* Glow Effect - iOS Safari: Round Fix */}
              <div
                className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                style={{
                  width: `${item.energy * 0.6 + 50}px`,
                  height: `${item.energy * 0.6 + 50}px`,
                  left: "50%",
                  top: "50%",
                  marginLeft: `${-(item.energy * 0.6 + 50) / 2}px`,
                  marginTop: `${-(item.energy * 0.6 + 50) / 2}px`,
                  background: `radial-gradient(circle, rgba(249,199,79,0.3) 0%, transparent 70%)`,
                  pointerEvents: "none",
                  zIndex: -1,
                  // iOS Safari: Border-Radius mit WebKit-Prefixes
                  WebkitBorderRadius: "50%",
                  borderRadius: "50%",
                  MozBorderRadius: "50%",
                  // iOS Safari: Clip-Path Fallback
                  WebkitClipPath: "circle(50% at 50% 50%)",
                  clipPath: "circle(50% at 50% 50%)",
                  // iOS Safari: Overflow für Glow (kann weggelassen werden, aber hilft bei Rendering)
                  overflow: "hidden",
                }}
              />

              {/* Node Circle - iOS Safari: Round Fix */}
              <div
                className={`
                  flex items-center justify-center rounded-full
                  ${isExpanded ? "bg-white text-black" : isRelated ? "bg-[#f9c74f]/80 text-black" : "bg-[#51646f]/90 text-white"}
                  border-2
                  ${isExpanded ? "border-white shadow-lg" : isRelated ? "border-[#f9c74f] animate-pulse" : "border-[#f9c74f]/50"}
                  transition-all duration-300
                  ${isExpanded ? "scale-150" : "hover:scale-110"}
                `}
                style={{
                  width: "64px",
                  height: "64px",
                  position: "relative",
                  // iOS Safari: Border-Radius mit vollständigen WebKit-Prefixes
                  WebkitBorderRadius: "50%",
                  borderRadius: "50%",
                  MozBorderRadius: "50%",
                  // iOS Safari: Overflow hidden ZWINGT runde Form
                  overflow: "hidden",
                  // iOS Safari: Isolation-Kontext für korrektes border-radius Rendering
                  isolation: "isolate",
                  // iOS Safari: Clip-Path Fallback für perfekte Rundung
                  WebkitClipPath: "circle(50% at 50% 50%)",
                  clipPath: "circle(50% at 50% 50%)",
                  // iOS Safari: SVG-Mask Fallback
                  mask: "radial-gradient(circle, black 50%, transparent 50%)",
                  WebkitMask: "radial-gradient(circle, black 50%, transparent 50%)",
                  // iOS Safari: Hardware-Beschleunigung für runde Form
                  WebkitTransform: "translate3d(0, 0, 0)",
                  transform: "translate3d(0, 0, 0)",
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <div
                className={`
                  absolute whitespace-nowrap text-center font-semibold tracking-wider
                  ${isExpanded ? "text-[#f9c74f] scale-125" : "text-white/90"}
                `}
                style={{
                  top: "72px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: isMobile ? "0.7rem" : "0.875rem",
                  textShadow: isExpanded
                    ? "0 0 8px rgba(249,199,79,0.8)"
                    : "0 2px 6px rgba(0,0,0,1), 0 0 8px rgba(249,199,79,0.6)",
                  pointerEvents: "none",
                  maxWidth: "120px",
                  lineHeight: "1.2",
                }}
              >
                {item.title}
              </div>

              {/* Expanded Card */}
              {isExpanded && (
                <div
                  className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(8px)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                >
                  <Card
                    className="w-full max-w-md bg-black/95 border-white/30 shadow-2xl"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center gap-2 mb-3">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
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
                      <CardTitle className="text-lg text-white">{item.title}</CardTitle>
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
  );
}