import { useState, useEffect } from 'react';

interface MobileOptimizationConfig {
  isMobile: boolean;
  reducedMotion: boolean;
  isLowPerformance: boolean;
}

export const useMobileOptimization = (): MobileOptimizationConfig => {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const checkReducedMotion = () => {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    const checkPerformance = () => {
      // Check for low-performance indicators
      const isLowEnd = (
        navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2
      ) || (
        // @ts-expect-error - Check for older devices
        navigator.deviceMemory && navigator.deviceMemory <= 2
      );
      setIsLowPerformance(isLowEnd);
    };

    checkMobile();
    checkReducedMotion();
    checkPerformance();

    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    mediaQuery.addEventListener('change', checkMobile);
    motionQuery.addEventListener('change', checkReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', checkMobile);
      motionQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  return { isMobile, reducedMotion, isLowPerformance };
};

export const useOptimizedAnimations = () => {
  const { isMobile, reducedMotion, isLowPerformance } = useMobileOptimization();

  const getOptimizedConfig = (baseConfig: { duration: number }) => {
    if (reducedMotion) {
      return {
        duration: 0.01,
        ease: "linear" as const,
        type: "tween" as const,
      };
    }

    if (isMobile || isLowPerformance) {
      return {
        duration: baseConfig.duration * 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        type: "tween" as const,
      };
    }

    return {
      duration: baseConfig.duration,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      type: "tween" as const,
    };
  };

  const getOptimizedTransform = (distance: number) => {
    if (reducedMotion) return 0;
    if (isMobile || isLowPerformance) return distance * 0.5;
    return distance;
  };

  return {
    isMobile,
    reducedMotion,
    isLowPerformance,
    getOptimizedConfig,
    getOptimizedTransform,
  };
};
