import React from "react";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export interface ProfileCardProps {
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  className?: string;
}

export function ProfileCard(props: ProfileCardProps) {
  const {
    name = "Stephan Schellworth & Janina Hankus",
    title = "Gründer & Geschäftsführer, BuildWise",
    description = "Wir sind die Gründer von BuildWise. Mit unserer Vision einer digitalen Plattform für das Baugewerbe revolutionieren wir die Art und Weise, wie Bauträger und Dienstleister zusammenarbeiten. Unsere Leidenschaft für Innovation und Qualität treibt BuildWise voran, um die Bauindustrie in der Schweiz zu modernisieren.",
    imageUrl = "/assets/aboutus.jpeg",
    linkedinUrl = "#",
    className,
  } = props;

  return (
    <div className={cn("w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {/* Overlapping Layout for all screen sizes */}
      <div className='flex relative items-center justify-center flex-wrap sm:flex-nowrap gap-4 sm:gap-0'>
        {/* Square Image - Premium responsive sizes */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className='w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] lg:w-[470px] lg:h-[470px] rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 flex items-center justify-center relative'
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          <img
            src={imageUrl}
            alt={`${name} - BuildWise Gründer & Geschäftsführer Bauträger Plattform Schweiz`}
            className='w-full h-full object-cover'
            draggable={false}
            loading="lazy"
            style={{
              filter: 'brightness(1.02) contrast(1.05)',
            }}
          />
          {/* Professional gradient overlay */}
          <div 
            className='absolute inset-0 opacity-0 hover:opacity-100 transition-all duration-700 pointer-events-none'
            style={{
              background: 'linear-gradient(135deg, rgba(249, 199, 79, 0.08) 0%, transparent 50%, rgba(81, 100, 111, 0.08) 100%)',
            }}
          ></div>
          {/* Subtle edge highlight */}
          <div 
            className='absolute inset-0 pointer-events-none'
            style={{
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
              borderRadius: 'inherit',
            }}
          ></div>
        </motion.div>
        
        {/* Premium Glassmorph Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className='rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 mt-[-24px] sm:mt-0 sm:ml-[-48px] md:ml-[-56px] lg:ml-[-80px] z-10 w-full sm:w-auto sm:max-w-[320px] md:max-w-[380px] lg:max-w-xl sm:flex-1 relative overflow-hidden'
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.06) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Premium glow effect overlay */}
          <div 
            className='absolute inset-0 opacity-0 hover:opacity-100 transition-all duration-700 pointer-events-none'
            style={{
              background: 'radial-gradient(circle at 30% 20%, rgba(249, 199, 79, 0.08) 0%, transparent 60%), linear-gradient(135deg, transparent 0%, rgba(81, 100, 111, 0.04) 100%)',
            }}
          ></div>
          
          {/* Content with professional typography */}
          <div className='relative z-10'>
            <div className='mb-6 sm:mb-7 md:mb-8'>
              <h2 
                className='text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight'
                style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                {name}
              </h2>

              <p 
                className='text-sm md:text-base font-medium leading-relaxed'
                style={{
                  color: 'rgba(255, 255, 255, 0.75)',
                  letterSpacing: '0.01em',
                }}
              >
                {title}
              </p>
            </div>

            <div className='relative mb-6 sm:mb-7 md:mb-10'>
              {/* Subtle glow effect for text field */}
              <div 
                className='absolute inset-0 rounded-lg -z-10'
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 199, 79, 0.15) 0%, rgba(249, 199, 79, 0.05) 50%, transparent 100%)',
                  filter: 'blur(16px)',
                  transform: 'scale(1.06)',
                  opacity: 0.6,
                }}
              ></div>
              <p 
                className='text-white text-sm sm:text-[15px] md:text-base leading-relaxed relative z-10'
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.7,
                  letterSpacing: '0.01em',
                }}
              >
                {description}
              </p>
            </div>

            <div className='flex space-x-4'>
              <motion.a
                href={linkedinUrl}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className='w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-full flex items-center justify-center relative group'
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                }}
                aria-label="LinkedIn"
              >
                <Linkedin 
                  className='w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 transition-all duration-300' 
                  style={{ 
                    stroke: 'currentColor', 
                    fill: 'none',
                    color: 'rgba(255, 255, 255, 0.95)',
                    strokeWidth: 2.5
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f9c74f';
                    e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(249, 199, 79, 0.5))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.filter = 'none';
                  }}
                />
                {/* Premium glow effect on hover */}
                <div 
                  className='absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10' 
                  style={{ 
                    background: 'radial-gradient(circle, rgba(249, 199, 79, 0.4) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                  }}
                ></div>
                {/* Edge highlight */}
                <div 
                  className='absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(249, 199, 79, 0.3)',
                  }}
                ></div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

