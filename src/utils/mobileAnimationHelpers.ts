// Mobile-optimized animation configurations
export const mobileAnimationConfig = {
  // Basic transition for mobile
  mobile: {
    duration: 0.4,
    ease: "easeOut" as const,
    type: "tween" as const,
  },
  
  // Desktop transition
  desktop: {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    type: "tween" as const,
  },
  
  // Reduced motion
  reduced: {
    duration: 0.01,
    ease: "linear" as const,
    type: "tween" as const,
  }
};

// Mobile-optimized viewport settings
export const mobileViewportSettings = {
  mobile: {
    once: true,
    margin: "0px 0px -20px 0px",
    amount: 0.1,
  },
  desktop: {
    once: true,
    margin: "0px 0px -50px 0px",
    amount: 0.2,
  }
};

// Optimized transform values for mobile
export const getOptimizedTransformValue = (
  value: number, 
  isMobile: boolean, 
  reducedMotion: boolean
): number => {
  if (reducedMotion) return 0;
  if (isMobile) return value * 0.3;
  return value;
};

// Mobile-safe will-change optimization
export const getWillChangeStyle = (isMobile: boolean): string => {
  return isMobile ? 'auto' : 'transform';
};

// Mobile-optimized animation style
export const getMobileAnimationStyle = (isMobile: boolean) => ({
  backfaceVisibility: 'hidden' as const,
  perspective: isMobile ? 'none' : 1000,
  willChange: getWillChangeStyle(isMobile),
});

// Get mobile-optimized initial animation values
export const getMobileInitialValues = (isMobile: boolean, desktopValue: number) => ({
  y: isMobile ? desktopValue * 0.5 : desktopValue,
  opacity: 0,
});

// Enhanced mobile transition helper
export const getMobileTransition = (
  baseConfig: { duration: number; delay?: number },
  isMobile: boolean,
  reducedMotion: boolean
) => {
  if (reducedMotion) {
    return {
      ...mobileAnimationConfig.reduced,
      delay: 0,
    };
  }
  
  if (isMobile) {
    return {
      ...mobileAnimationConfig.mobile,
      duration: baseConfig.duration * 0.7,
      delay: (baseConfig.delay || 0) * 0.5,
    };
  }
  
  return {
    ...mobileAnimationConfig.desktop,
    duration: baseConfig.duration,
    delay: baseConfig.delay || 0,
  };
};
