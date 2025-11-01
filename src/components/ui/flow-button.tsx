import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface FlowButtonProps {
  text?: string;
  onClick?: () => void;
}

export function FlowButton({ text = "Modern Button", onClick }: FlowButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Design colors from styles.css
  const accentColor = '#f9c74f';
  const accentDark = '#d4af3a';
  const primaryColor = '#51646f';
  const darkGray = '#111827';

  return (
    <button 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      aria-label={`${text} - BuildWise Call-to-Action Button`}
      type="button"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        overflow: 'hidden',
        borderRadius: isHovered ? '18px' : '100px',
        border: `2.5px solid ${isHovered ? 'transparent' : accentColor}`,
        background: isHovered ? `linear-gradient(135deg, ${accentColor}, ${accentDark})` : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '1.375rem 3.5rem',
        fontSize: '1.25rem',
        fontWeight: 700,
        color: isHovered ? darkGray : accentColor,
        cursor: 'pointer',
        transition: 'all 600ms cubic-bezier(0.23, 1, 0.32, 1)',
        zIndex: 50,
        boxShadow: isHovered 
          ? `0 8px 24px rgba(249, 199, 79, 0.4), 0 0 20px rgba(249, 199, 79, 0.3)`
          : `0 0 10px rgba(249, 199, 79, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)`,
      }}
    >
      {/* Glow effect overlay */}
      {isHovered && (
        <span style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle, rgba(249, 199, 79, 0.3), transparent 70%)`,
          zIndex: -1,
        }}></span>
      )}

      {/* Left arrow (arr-2) */}
      <ArrowRight 
        style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          left: isHovered ? '24px' : '-25%',
          stroke: isHovered ? darkGray : accentColor,
          fill: 'none',
          strokeWidth: '3',
          zIndex: 9,
          transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: isHovered ? 'none' : 'drop-shadow(0 0 4px rgba(249, 199, 79, 0.5))',
        }}
      />

      {/* Text */}
      <span 
        style={{
          position: 'relative',
          zIndex: 1,
          transform: isHovered ? 'translateX(12px)' : 'translateX(-12px)',
          color: isHovered ? darkGray : accentColor,
          transition: 'all 800ms ease-out',
          textShadow: isHovered ? 'none' : '0 0 10px rgba(249, 199, 79, 0.5)',
          fontWeight: 700,
        }}
      >
        {text}
      </span>

      {/* Circle */}
      <span style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: isHovered ? '220px' : '16px',
        height: isHovered ? '220px' : '16px',
        background: isHovered ? '#ffffff' : accentColor,
        borderRadius: '50%',
        opacity: isHovered ? 0.2 : 0,
        transition: 'all 800ms cubic-bezier(0.19, 1, 0.22, 1)',
        zIndex: 0,
        filter: isHovered ? 'blur(20px)' : 'none',
      }}></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight 
        style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          right: isHovered ? '-25%' : '24px',
          stroke: isHovered ? darkGray : accentColor,
          fill: 'none',
          strokeWidth: '3',
          zIndex: 9,
          transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: isHovered ? 'none' : 'drop-shadow(0 0 4px rgba(249, 199, 79, 0.5))',
        }}
      />
    </button>
  );
}

