'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LayoutDashboard, FileText, DollarSign, Calendar, FolderOpen, KanbanSquare, MapPin, MessageSquare, Users, X } from 'lucide-react';
import { TimelineTabs } from './timeline-tabs';
import { Role } from '../../timeline-entry';
import { bautraegerUserJourneyData, dienstleisterUserJourneyData, UserJourneyFeature } from '../../user-journey-data';

interface FeatureOption {
  title: string;
  description: string;
  content: string; // Full content from user-journey-data
  image: string;
  icon: React.ReactElement;
}

const InteractiveSelector = () => {
  const [activeRole, setActiveRole] = useState<Role>("bauträger");
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<FeatureOption | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Initialize with all options visible immediately for fallback
  const [animatedOptions, setAnimatedOptions] = useState<number[]>(() => {
    return Array.from({ length: 7 }, (_, i) => i);
  });

  // Icon mapping function
  const getIconForFeature = (step: string, title: string): React.ReactElement => {
    const stepLower = step.toLowerCase();
    const titleLower = title.toLowerCase();
    
    if (stepLower.includes('dashboard') || titleLower.includes('dashboard')) {
      return <LayoutDashboard size={24} className="text-white" />;
    } else if (stepLower.includes('ausschreibung') || titleLower.includes('ausschreibung')) {
      return <FileText size={24} className="text-white" />;
    } else if (stepLower.includes('finanz') || titleLower.includes('finanz')) {
      return <DollarSign size={24} className="text-white" />;
    } else if (stepLower.includes('termin') || stepLower.includes('kalender') || titleLower.includes('termin') || titleLower.includes('kalender')) {
      return <Calendar size={24} className="text-white" />;
    } else if (stepLower.includes('benachrichtigung') || titleLower.includes('informiert')) {
      return <MessageSquare size={24} className="text-white" />;
    } else if (stepLower.includes('dokument') || titleLower.includes('dokument')) {
      return <FolderOpen size={24} className="text-white" />;
    } else if (stepLower.includes('aufgabe') || titleLower.includes('aufgabe')) {
      return <KanbanSquare size={24} className="text-white" />;
    } else if (stepLower.includes('geo') || stepLower.includes('suche') || titleLower.includes('geo') || titleLower.includes('suche')) {
      return <MapPin size={24} className="text-white" />;
    } else if (stepLower.includes('ressource') || titleLower.includes('ressource') || titleLower.includes('kapazität')) {
      return <Users size={24} className="text-white" />;
    }
    return <LayoutDashboard size={24} className="text-white" />; // Default icon
  };

  // Generate options dynamically based on activeRole
  const options: FeatureOption[] = useMemo(() => {
    const features = activeRole === "bauträger" ? bautraegerUserJourneyData : dienstleisterUserJourneyData;
    return features.map((feature: UserJourneyFeature) => ({
      title: feature.title,
      description: feature.content.substring(0, 80) + (feature.content.length > 80 ? '...' : ''), // Short description
      content: feature.content, // Full content
      image: feature.image,
      icon: getIconForFeature(feature.step, feature.title)
    }));
  }, [activeRole]);

  // Reset activeIndex when role changes
  useEffect(() => {
    setActiveIndex(0);
    setAnimatedOptions(Array.from({ length: options.length }, (_, i) => i));
  }, [activeRole, options.length]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      console.log('[InteractiveSelector] Option clicked:', index, options[index].title);
    }
  };

  const handleImageExpand = (option: FeatureOption, index?: number) => {
    const imageIndex = index !== undefined ? index : options.findIndex(opt => opt.image === option.image);
    setExpandedImage(option);
    setCurrentImageIndex(imageIndex >= 0 ? imageIndex : 0);
    console.log('[InteractiveSelector] Image expanded:', option.title, 'Index:', imageIndex);
  };

  const handleCloseModal = () => {
    setExpandedImage(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (options.length === 0) return;
    const nextIndex = (currentImageIndex + 1) % options.length;
    setCurrentImageIndex(nextIndex);
    setExpandedImage(options[nextIndex]);
  };

  const handlePrevImage = () => {
    if (options.length === 0) return;
    const prevIndex = (currentImageIndex - 1 + options.length) % options.length;
    setCurrentImageIndex(prevIndex);
    setExpandedImage(options[prevIndex]);
  };

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
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }
  };

  // Handle keyboard navigation (ESC, Arrow keys)
  useEffect(() => {
    if (!expandedImage) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedImage, currentImageIndex, options.length]);

  useEffect(() => {
    console.log('[InteractiveSelector] Component mounted');
    console.log('[InteractiveSelector] Options count:', options.length);
    console.log('[InteractiveSelector] Initial animatedOptions:', animatedOptions);
    
    // Optional: Add staggered animation if desired (currently disabled for instant visibility)
    // Uncomment below to enable staggered animation
    /*
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => {
          const updated = [...prev, i];
          console.log('[InteractiveSelector] Animation step:', i, 'Updated array:', updated);
          return updated;
        });
      }, 50 * i); // Faster animation (50ms instead of 180ms)
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
    */
  }, []);

  console.log('[InteractiveSelector] Rendering with activeIndex:', activeIndex);
  console.log('[InteractiveSelector] Animated options:', animatedOptions);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[700px] bg-transparent font-sans text-white py-12 md:py-20 w-full"> 
      {/* Header Section */}
      <div className="w-full max-w-2xl px-6 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg opacity-0 animate-[fadeInFromTop_0.8s_ease-in-out_0.3s_forwards]">
          Was BuildWise bietet
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 font-medium max-w-xl mx-auto opacity-0 animate-[fadeInFromTop_0.8s_ease-in-out_0.6s_forwards]">
          Entdecken Sie die wichtigsten Features für Ihre Bauprojekte – alles an einem Ort.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="w-full max-w-[900px] px-4 mb-6 flex justify-center">
        <TimelineTabs activeRole={activeRole} onRoleChange={setActiveRole} />
      </div>

      {/* Options Container */}
      <div className="options flex w-full max-w-[900px] min-w-[320px] md:min-w-[600px] h-[300px] md:h-[400px] mx-0 items-stretch overflow-visible relative px-4">
        {options.map((option, index) => (
          <div
            key={index}
            className={`
              option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'active' : ''}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backfaceVisibility: 'hidden',
              // Always visible - no opacity animation needed
              opacity: 1,
              transform: 'translateX(0)',
              minWidth: '60px',
              minHeight: '100px',
              margin: 0,
              borderRadius: '0.75rem',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: activeIndex === index ? 'rgba(249, 199, 79, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              backgroundColor: '#18181b',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(249, 199, 79, 0.2), 0 0 40px rgba(249, 199, 79, 0.1)' 
                : '0 10px 30px rgba(0, 0, 0, 0.30)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
              willChange: 'flex-grow, box-shadow, background-size, background-position',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => {
              handleOptionClick(index);
              handleImageExpand(option, index);
            }}
          >
            
            {/* Glassmorphism overlay */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                background: activeIndex === index 
                  ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                  : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
                backdropFilter: 'blur(2px)',
              }}
            ></div>

            {/* Shadow effect */}
            <div 
              className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? '0' : '-40px',
                height: '120px',
                boxShadow: activeIndex === index 
                  ? 'inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000' 
                  : 'inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000'
              }}
            ></div>
            
            {/* Label with icon and info */}
            <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-2 pointer-events-none px-4 gap-3 w-full">
              <div 
                className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full backdrop-blur-xl flex-shrink-0 flex-grow-0 transition-all duration-200 border-2"
                style={{
                  backgroundColor: activeIndex === index 
                    ? 'rgba(249, 199, 79, 0.2)' 
                    : 'rgba(32, 32, 32, 0.85)',
                  borderColor: activeIndex === index 
                    ? '#f9c74f' 
                    : '#444',
                  boxShadow: activeIndex === index
                    ? '0 0 20px rgba(249, 199, 79, 0.5), 0 1px 4px rgba(0,0,0,0.18)'
                    : '0 1px 4px rgba(0,0,0,0.18)',
                }}
              >
                {option.icon}
              </div>
              <div className="info text-white whitespace-pre relative">
                <div 
                  className="main font-bold text-lg transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                    color: activeIndex === index ? '#f9c74f' : '#fff',
                    textShadow: activeIndex === index ? '0 0 10px rgba(249, 199, 79, 0.5)' : 'none',
                  }}
                >
                  {option.title}
                </div>
                <div 
                  className="sub text-base text-gray-300 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Image Expansion Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-7xl w-full max-h-[90vh] bg-gradient-to-br from-[#51646f]/95 to-[#2f3c43]/95 backdrop-blur-xl rounded-2xl border-2 border-[#f9c74f]/30 shadow-[0_0_60px_rgba(249,199,79,0.15)] overflow-hidden flex flex-col animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-30 bg-[#f9c74f]/90 hover:bg-[#f9c74f] text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200 backdrop-blur-sm border-2 border-[#f9c74f]"
              aria-label="Schließen"
            >
              <X size={24} />
            </button>

            {/* Navigation Arrows */}
            {options.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-[#f9c74f]/90 hover:bg-[#f9c74f] text-gray-900 rounded-full p-3 shadow-lg transition-all duration-200 backdrop-blur-sm border-2 border-[#f9c74f] hidden md:flex items-center justify-center"
                  aria-label="Vorheriges Bild"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-[#f9c74f]/90 hover:bg-[#f9c74f] text-gray-900 rounded-full p-3 shadow-lg transition-all duration-200 backdrop-blur-sm border-2 border-[#f9c74f] hidden md:flex items-center justify-center"
                  aria-label="Nächstes Bild"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}

            {/* Image Container */}
            <div className="flex-1 overflow-auto p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#f9c74f] mb-4">
                  {expandedImage.title}
                </h2>
                <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-6">
                  {expandedImage.content}
                </p>
                {options.length > 1 && (
                  <div className="text-sm text-gray-400 mb-4">
                    {currentImageIndex + 1} / {options.length}
                  </div>
                )}
              </div>
              
              <div className="relative w-full bg-black/30 rounded-xl overflow-hidden border border-[#f9c74f]/30">
                <img
                  src={expandedImage.image}
                  alt={expandedImage.title}
                  className="w-full h-auto object-contain max-h-[60vh]"
                  style={{ display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom animations via Tailwind - no style jsx needed */}
      <style>{`
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveSelector;

