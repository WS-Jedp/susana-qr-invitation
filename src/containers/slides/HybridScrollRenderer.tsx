import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { useSlideStore } from '../../store/useSlideStore';
import { useSwipe } from '../../hooks/useSwipe';
import { MinimalAudioPlayer } from '../../components/MinimalAudioPlayer';
import { 
  RomanticWelcomeSlide,
  RomanticReasonSlide,
  RomanticWhyYouSlide,
  PersonalCuriousFactsSlide,
  RomanticFunFactsSlide,
  RomanticQuestionsSlide,
  CallToActionSlide,
  RomanticFinalSlide
} from './MonochromeSlides';

interface HybridScrollRendererProps {
  hasAudioPermission?: boolean;
  shouldAutoPlay?: boolean;
}

const HybridScrollRenderer: React.FC<HybridScrollRendererProps> = ({ 
  hasAudioPermission = false,
  shouldAutoPlay = false // Wait for proper user interaction through modal
}) => {
  const { slides, currentSlideIndex, loadData, isLoading, error, goToSlide } = useSlideStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slideChangeTimeoutRef = useRef<number | null>(null);

  // Detect mobile device and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const checkReducedMotion = () => setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    checkMobile();
    checkReducedMotion();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced navigation with smooth scrolling and mobile optimization
  const navigateToSlide = useCallback((targetIndex: number) => {
    if (containerRef.current && targetIndex >= 0 && targetIndex < slides.length) {
      // Clear any pending slide change timeout
      if (slideChangeTimeoutRef.current) {
        clearTimeout(slideChangeTimeoutRef.current);
        slideChangeTimeoutRef.current = null;
      }
      
      const targetY = (targetIndex / (slides.length - 1)) * (containerRef.current.scrollHeight - window.innerHeight);
      containerRef.current.scrollTo({ 
        top: targetY, 
        behavior: reducedMotion || isMobile ? 'auto' : 'smooth' 
      });
    }
  }, [slides.length, reducedMotion, isMobile]);

  // Handle scroll events manually with throttling for mobile performance and debounced slide changes
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    
    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      setScrollProgress(progress);
    });
    
    // Debounce slide changes to prevent rapid audio switching
    const newIndex = Math.round(progress * (slides.length - 1));
    if (newIndex !== currentSlideIndex && newIndex >= 0 && newIndex < slides.length) {
      // Clear existing timeout
      if (slideChangeTimeoutRef.current) {
        clearTimeout(slideChangeTimeoutRef.current);
      }
      
      // Debounce slide change by 150ms
      slideChangeTimeoutRef.current = window.setTimeout(() => {
        goToSlide(newIndex);
      }, 150);
    }
  }, [slides.length, currentSlideIndex, goToSlide]);

  // Swipe functionality for mobile navigation
  const swipeRef = useSwipe({
    onSwipeUp: () => {
      if (currentSlideIndex < slides.length - 1) {
        navigateToSlide(currentSlideIndex + 1);
      }
    },
    onSwipeDown: () => {
      if (currentSlideIndex > 0) {
        navigateToSlide(currentSlideIndex - 1);
      }
    },
  });

  useEffect(() => {
    loadData();
    
    // Cleanup timeout on unmount
    return () => {
      if (slideChangeTimeoutRef.current) {
        clearTimeout(slideChangeTimeoutRef.current);
      }
    };
  }, [loadData]);

  // Add scroll event listener with passive scrolling for mobile performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use passive listeners for better performance
    const options = { passive: true };
    container.addEventListener('scroll', handleScroll, options);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const getSlideComponent = (slide: typeof slides[0], index: number) => {
    if (!slide) return null;

    const isActive = index === currentSlideIndex;
    const props = { slide, isActive, index };

    switch (slide.id) {
      case 1:
        return <RomanticWelcomeSlide key={slide.id} {...props} />;
      case 2:
        return <RomanticReasonSlide key={slide.id} {...props} />;
      case 3:
        return <RomanticWhyYouSlide key={slide.id} {...props} />;
      case 3.5:
        return <PersonalCuriousFactsSlide key={slide.id} {...props} />;
      case 4:
        return <RomanticFunFactsSlide key={slide.id} {...props} />;
      case 5:
        return <RomanticQuestionsSlide key={slide.id} {...props} />;
      case 'cta':
        return <CallToActionSlide key={slide.id} {...props} />;
      case 'final':
        return <RomanticFinalSlide key={slide.id} {...props} />;
      default:
        return <RomanticWelcomeSlide key={slide.id} {...props} />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-pure-white">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="w-full h-full border-4 border-soft-gray border-t-accent-blue rounded-full animate-spin"></div>
          </div>
          <h2 className="premium-subtitle text-2xl text-graphite mb-2">Preparando tu invitación</h2>
          <p className="premium-text text-charcoal">Creando una experiencia única...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-pure-white">
        <div className="text-center premium-card p-8 max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-gold to-champagne rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="premium-title text-2xl text-graphite mb-4">Algo salió mal</h2>
          <p className="premium-text text-charcoal">{error}</p>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-pure-white">
        <p className="premium-text text-xl text-charcoal">No hay contenido disponible</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Audio Player - Dynamic based on current slide */}
      <MinimalAudioPlayer 
        audioConfig={slides[currentSlideIndex]?.audio}
        slideTitle={slides[currentSlideIndex]?.title}
        isEnabled={hasAudioPermission}
        hasUserInteracted={hasAudioPermission}
        shouldAutoPlay={shouldAutoPlay}
      />

      {/* Scroll Progress Indicator - Optimized for mobile */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 bg-soft-gray z-50 motion-element"
        style={{ 
          scaleX: scrollProgress,
          originX: 0,
          willChange: 'transform'
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-accent-blue to-royal-gold"></div>
      </motion.div>

      {/* Side Navigation Dots */}
      <div className="scroll-indicator hidden md:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToSlide(index)}
            className={`scroll-dot ${index === currentSlideIndex ? 'active' : ''}`}
            aria-label={`Ir a sección ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Scroll Container - Optimized for mobile performance */}
      <div
        ref={(node) => {
          containerRef.current = node;
          swipeRef.current = node;
        }}
        className="h-dvh overflow-y-auto overflow-x-hidden motion-element"
        style={{ 
          scrollSnapType: isMobile ? 'none' : 'y mandatory',
          scrollBehavior: reducedMotion ? 'auto' : 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'none'
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="h-dvh w-full motion-element"
            style={{ 
              scrollSnapAlign: isMobile ? 'none' : 'start',
              willChange: 'transform'
            }}
          >
            {getSlideComponent(slide, index)}
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default HybridScrollRenderer;
