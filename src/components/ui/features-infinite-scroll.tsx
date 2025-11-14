import { useState, useMemo } from 'react';
import { bautraegerUserJourneyData, dienstleisterUserJourneyData } from '../../user-journey-data';
import { Role } from '../../timeline-entry';
import { TimelineTabs } from './timeline-tabs';

export const FeaturesInfiniteScroll = () => {
  const [activeRole, setActiveRole] = useState<Role>("bauträger");

  // Filter features based on active role (don't combine)
  const features = useMemo(() => {
    return activeRole === "bauträger" ? bautraegerUserJourneyData : dienstleisterUserJourneyData;
  }, [activeRole]);

  // Extract images from features
  const images = useMemo(() => features.map(feature => feature.image), [features]);

  // Duplicate images for seamless infinite loop (2x is enough for smooth loop)
  const duplicatedImages = useMemo(() => {
    return [...images, ...images];
  }, [images]);

  // Calculate animation duration - 20s like in the example for smooth rotation
  const animationDuration = 20;

  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right ${animationDuration}s linear infinite !important;
          will-change: transform;
          display: flex;
          flex-direction: row;
          width: max-content;
          position: relative;
        }
        
        .infinite-scroll.paused {
          animation-play-state: paused;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        
        .scroll-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
        }

        .image-item {
          transition: filter 0.3s ease, box-shadow 0.3s ease;
          flex-shrink: 0;
        }

        .image-item:hover {
          filter: brightness(1.1);
          box-shadow: 0 0 30px rgba(249, 199, 79, 0.7) !important;
        }
        
        .image-item:hover img {
          transform: scale(1.05);
        }
        
        .image-item img {
          transition: transform 0.3s ease;
        }
      `}</style>
      
      <div className="w-full relative overflow-hidden flex flex-col items-center justify-center py-12 md:py-16 lg:py-20">
        {/* Background gradient - matching site theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#5f7683]/20 via-[#51646f]/30 to-[#2f3c43]/40 z-0" />
        
        {/* Tab System */}
        <div className="relative z-20 mb-6 md:mb-8 lg:mb-12 w-full flex justify-center px-4">
          <TimelineTabs activeRole={activeRole} onRoleChange={setActiveRole} />
        </div>
        
        {/* Scrolling images container */}
        <div className="scroll-wrapper relative z-10 w-full flex items-center justify-center">
          <div className="scroll-container w-full max-w-6xl">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedImages.map((image, index) => {
                const featureIndex = index % images.length;
                const feature = features[featureIndex];
                return (
                  <div
                    key={index}
                    className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(249,199,79,0.5)] relative group"
                  >
                    <img
                      src={image}
                      alt={feature?.title || `Feature ${featureIndex + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Glassmorphism overlay with title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white text-sm md:text-base font-semibold mb-1">
                        {feature?.title || feature?.step}
                      </h3>
                      <p className="text-white/80 text-xs md:text-sm line-clamp-2">
                        {feature?.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#2f3c43]/40 to-transparent z-20" />
      </div>
    </>
  );
};

