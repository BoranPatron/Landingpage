import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detects if the current browser is Chrome (or Chromium-based)
 * @returns true if Chrome/Chromium, false otherwise
 */
export function isChrome(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isChrome = /chrome/.test(userAgent) && /google inc/.test(navigator.vendor?.toLowerCase() || '');
  const isChromium = /chromium/.test(userAgent);
  const isEdge = /edg/.test(userAgent);
  
  // Chrome or Chromium, but not Edge (Edge uses Chromium but has different rendering)
  return (isChrome || isChromium) && !isEdge;
}

/**
 * Detects if the current browser is iOS Safari
 * @returns true if iOS Safari, false otherwise
 */
export function isIOSSafari(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|OPiOS/.test(userAgent);
  
  return isIOS && isSafari;
}

/**
 * Gets the preferred positioning method based on browser
 * @returns 'transform' for Chrome, 'margin' for iOS Safari
 */
export function getPreferredPositioningMethod(): 'transform' | 'margin' {
  if (isChrome()) {
    return 'transform';
  }
  if (isIOSSafari()) {
    return 'margin';
  }
  // Default to transform for modern browsers
  return 'transform';
}

