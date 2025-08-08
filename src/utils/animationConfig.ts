// Mobile-optimized animation configurations
export const getAnimationConfig = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const reducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    return {
      duration: 0.01,
      delay: 0,
      ease: "linear" as const,
      type: "tween" as const,
    };
  }

  if (isMobile) {
    return {
      duration: 0.3,
      delay: 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      type: "tween" as const,
    };
  }

  return {
    duration: 0.6,
    delay: 0.2,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  };
};

export const getScrollAnimationConfig = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const reducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    return {
      duration: 0,
      ease: "linear" as const,
    };
  }

  return {
    duration: isMobile ? 0.2 : 0.4,
    ease: "easeOut" as const,
  };
};

export const getTransformConfig = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  return {
    // Reduce transform distances on mobile for better performance
    parallaxDistance: isMobile ? 20 : 60,
    scaleRange: isMobile ? [0.98, 1] : [0.95, 1],
    translateRange: isMobile ? 15 : 30,
  };
};

// Common mobile-optimized motion values
export const motionConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  
  // Hardware-accelerated transforms
  transform: {
    translateZ: 0,
    willChange: 'transform, opacity',
  },
  
  // Optimized easing curves for mobile
  easing: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    bouncy: [0.68, -0.55, 0.265, 1.55],
    sharp: [0.4, 0, 0.2, 1],
  },
} as const;

// Viewport-based animation configurations
export const getViewportConfig = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  return {
    once: true,
    margin: isMobile ? "0px 0px -50px 0px" : "0px 0px -100px 0px",
    amount: isMobile ? 0.3 : 0.5,
  };
};
