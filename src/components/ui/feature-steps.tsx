"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Role } from "../../timeline-entry";
import { TimelineTabs } from "./timeline-tabs";
import { UserJourneyFeature } from "../../user-journey-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ZoomParallax } from "./zoom-parallax";

interface FeatureStepsProps {
  bautraegerFeatures: UserJourneyFeature[];
  dienstleisterFeatures: UserJourneyFeature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
}

export function FeatureSteps({
  bautraegerFeatures,
  dienstleisterFeatures,
  className,
  title = "Features im Überblick ",
  autoPlayInterval = 3500,
}: FeatureStepsProps) {
  const [activeRole, setActiveRole] = useState<Role>("bauträger");
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const features = activeRole === "bauträger" ? bautraegerFeatures : dienstleisterFeatures;
  const featuresLength = useMemo(() => features.length, [features]);
  const activeFeature = useMemo(() => features[currentFeature], [currentFeature, features]);

  // Convert features to ZoomParallax image format
  const parallaxImages = useMemo(() => {
    const images = features.map((feature) => ({
      src: feature.image,
      alt: feature.title || feature.step,
    }));
    console.log('[FeatureSteps] Parallax images:', images);
    return images;
  }, [features]);

  // Detect screen size (Mobile < 768px, Tablet 768-1023px, Desktop >= 1024px)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      console.log('[FeatureSteps] Screen size:', { width, mobile, tablet, isDesktop: !mobile && !tablet });
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Responsive gap calculation (similar to CircularTestimonials)
  const calculateGap = (width: number) => {
    const minWidth = 640;
    const maxWidth = 1024;
    const minGap = 40;
    const maxGap = 60;
    if (width <= minWidth) return minGap;
    if (width >= maxWidth) return maxGap;
    return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
  };

  // Responsive container width calculation
  useEffect(() => {
    const handleResize = () => {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust auto-play interval for mobile/tablet
  const adjustedAutoPlayInterval = (isMobile || isTablet) ? 5000 : autoPlayInterval;

  useEffect(() => {
    // Reset to first feature when role changes
    setCurrentFeature(0);
    setProgress(0);
  }, [activeRole]);

  // Auto-play with pause on manual navigation
  useEffect(() => {
    if (isMobile || isTablet) {
      autoplayIntervalRef.current = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % featuresLength);
      }, adjustedAutoPlayInterval);
    } else {
      // Desktop: keep progress-based auto-play
      const timer = setInterval(() => {
        if (progress < 100) {
          setProgress((prev) => prev + 100 / (adjustedAutoPlayInterval / 100));
        } else {
          setCurrentFeature((prev) => (prev + 1) % featuresLength);
          setProgress(0);
        }
      }, 100);
      return () => clearInterval(timer);
    }

    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [isMobile, isTablet, featuresLength, adjustedAutoPlayInterval, progress]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [currentFeature, featuresLength]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentFeature((prev) => (prev + 1) % featuresLength);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % featuresLength);
      }, adjustedAutoPlayInterval);
    }
  }, [featuresLength, adjustedAutoPlayInterval]);

  const handlePrev = useCallback(() => {
    setCurrentFeature((prev) => (prev - 1 + featuresLength) % featuresLength);
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % featuresLength);
      }, adjustedAutoPlayInterval);
    }
  }, [featuresLength, adjustedAutoPlayInterval]);

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  // Compute transforms for each image (3D carousel effect)
  const getImageStyle = (index: number): React.CSSProperties => {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === currentFeature;
    const isLeft = (currentFeature - 1 + featuresLength) % featuresLength === index;
    const isRight = (currentFeature + 1) % featuresLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto" as const,
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto" as const,
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    if (isRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto" as const,
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }

    // Hide all other images
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none" as const,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  };

  // Framer Motion variants for content
  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Render Carousel Layout for Mobile/Tablet
  const renderCarouselLayout = () => (
    <div className="w-full max-w-4xl mx-auto">
      {/* Images Carousel */}
      <div
        ref={imageContainerRef}
        className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] mb-8 touch-pan-y"
        style={{ perspective: "1000px" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {features.map((feature, index) => (
          <img
            key={index}
            src={feature.image}
            alt={feature.step}
            className="absolute w-full h-full object-contain rounded-lg"
            style={{
              ...getImageStyle(index),
              borderRadius: "1.5rem",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            }}
            loading="lazy"
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {activeFeature.title || activeFeature.step}
              </h3>
              <motion.p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                {activeFeature.content.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.22,
                      ease: "easeInOut",
                      delay: 0.025 * i,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 md:gap-6 justify-center md:justify-end">
          <button
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all border-none"
            onClick={handlePrev}
            style={{
              backgroundColor: hoverPrev ? "#f9c74f" : "#141414",
              color: "#f1f1f7",
            }}
            onMouseEnter={() => setHoverPrev(true)}
            onMouseLeave={() => setHoverPrev(false)}
            aria-label="Previous feature"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all border-none"
            onClick={handleNext}
            style={{
              backgroundColor: hoverNext ? "#f9c74f" : "#141414",
              color: "#f1f1f7",
            }}
            onMouseEnter={() => setHoverNext(true)}
            onMouseLeave={() => setHoverNext(false)}
            aria-label="Next feature"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  );

  // Render Desktop Layout with ZoomParallax
  const renderDesktopLayout = () => {
    console.log('[FeatureSteps] renderDesktopLayout called');
    console.log('[FeatureSteps] parallaxImages:', parallaxImages);
    console.log('[FeatureSteps] features:', features);
    
    return (
      <div className="w-full">
        {/* ZoomParallax Widget - Always visible */}
        <div
          className={cn(
            "relative rounded-lg backdrop-blur-xl border-2 border-[#f9c74f]/50 shadow-[0_0_32px_rgba(249,199,79,0.2),_0_2px_2px_rgba(0,_0,_0,_0.1),_0_0_0_2px_rgba(249,199,79,0.1),_0_0_8px_rgba(249,199,79,0.15),_0_20px_80px_rgba(47,_48,_55,_0.1)]",
            "h-[600px] lg:h-[800px] w-full overflow-visible mb-8 bg-gradient-to-br from-[#51646f]/20 to-[#41535c]/20"
          )}
          style={{ minHeight: '600px' }}
        >
          {parallaxImages.length > 0 ? (
            <>
              <div className="absolute top-2 left-2 z-50 bg-black/70 text-white px-2 py-1 rounded text-xs">
                ZoomParallax Widget ({parallaxImages.length} Bilder)
              </div>
              <ZoomParallax images={parallaxImages} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <div>
                <p className="text-lg font-bold">Keine Bilder verfügbar</p>
                <p className="text-sm text-gray-400">Features: {features.length}, Images: {parallaxImages.length}</p>
              </div>
            </div>
          )}
        </div>
      
      {/* Feature List */}
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 sm:gap-6 md:gap-8 touch-manipulation cursor-pointer"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
            onClick={() => setCurrentFeature(index)}
          >
            <motion.div
              className={cn(
                "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0",
                index === currentFeature
                  ? "bg-gradient-to-br from-[#f9c74f] to-[#d4af3a] border-[#f9c74f] text-gray-900 scale-110 shadow-[0_0_20px_rgba(249,199,79,0.5)]"
                  : "bg-gradient-to-br from-[#51646f]/40 to-[#41535c]/40 backdrop-blur-xl border-[#51646f]/50 text-gray-300",
              )}
            >
              {index <= currentFeature ? (
                <span className="text-sm sm:text-base md:text-lg font-bold">✓</span>
              ) : (
                <span className="text-sm sm:text-base md:text-lg font-semibold">{index + 1}</span>
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1 sm:mb-2">
                {feature.title || feature.step}
              </h3>
              <p className="text-xs sm:text-sm md:text-lg text-gray-300 leading-relaxed">
                {feature.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    );
  };

  return (
    <div className={cn("p-4 sm:p-6 md:p-12 lg:p-16", className)}>
      <div className="max-w-[120rem] mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-white">
            {title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto px-2">
            Entdecken Sie die wichtigsten Features in wenigen Schritten – speziell zugeschnitten auf Ihre Rolle.
          </p>
        </div>
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <TimelineTabs activeRole={activeRole} onRoleChange={setActiveRole} />
        </div>
        {/* Always show Desktop Layout with ZoomParallax */}
        {renderDesktopLayout()}
      </div>
    </div>
  );
}

