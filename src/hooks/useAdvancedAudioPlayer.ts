import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioConfig {
  src: string;
  loop: {
    start: number;
    end: number;
  };
}

export const useAdvancedAudioPlayer = (audioConfig?: AudioConfig, isEnabled: boolean = true, shouldAutoPlay: boolean = false, externalHasUserInteracted: boolean = false) => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(externalHasUserInteracted);
  const [hasAutoPlayTriggered, setHasAutoPlayTriggered] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  // Sync external hasUserInteracted state
  useEffect(() => {
    if (externalHasUserInteracted && !hasUserInteracted) {
      setHasUserInteracted(true);
    }
  }, [externalHasUserInteracted, hasUserInteracted]);

  // Professional fade audio in or out with smooth easing curves
  const fadeAudio = useCallback((audio: HTMLAudioElement, direction: 'in' | 'out', duration: number = 1000, targetVolume: number = 0.6): Promise<void> => {
    return new Promise((resolve) => {
      const startVolume = direction === 'in' ? 0 : audio.volume;
      const endVolume = direction === 'in' ? targetVolume : 0;
      const startTime = performance.now();
      
      if (direction === 'in') {
        audio.volume = 0;
      }

      // Use easeInOutCubic for professional smooth transitions
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const fadeStep = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        const newVolume = startVolume + (endVolume - startVolume) * easedProgress;
        audio.volume = Math.max(0, Math.min(targetVolume, newVolume));

        if (progress >= 1) {
          audio.volume = endVolume;
          resolve();
        } else {
          requestAnimationFrame(fadeStep);
        }
      };

      requestAnimationFrame(fadeStep);
    });
  }, []);

  // Cross-fade between two audio tracks for seamless transitions
  const crossFade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement, config: AudioConfig, duration: number = 1500): Promise<void> => {
    return new Promise((resolve) => {
      // Prepare the new audio
      const prepareAndCrossFade = async () => {
        toAudio.currentTime = config.loop.start;
        toAudio.volume = 0;
        
        try {
          await toAudio.play();
        } catch (error) {
          console.warn('Cross-fade: Failed to start new audio:', error);
          // Fall back to regular transition
          await fadeAudio(fromAudio, 'out', duration / 2);
          resolve();
          return;
        }

        const startTime = performance.now();
        const fromStartVolume = fromAudio.volume;
        const toTargetVolume = 0.6;

        // Use a smooth S-curve for cross-fading
        const smoothStep = (t: number): number => {
          return t * t * (3 - 2 * t);
        };

        const crossFadeStep = () => {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = smoothStep(progress);
          
          // Fade out the old audio
          const fromVolume = fromStartVolume * (1 - easedProgress);
          fromAudio.volume = Math.max(0, fromVolume);
          
          // Fade in the new audio
          const toVolume = toTargetVolume * easedProgress;
          toAudio.volume = Math.min(toTargetVolume, toVolume);

          if (progress >= 1) {
            fromAudio.pause();
            fromAudio.currentTime = 0;
            toAudio.volume = toTargetVolume;
            resolve();
          } else {
            requestAnimationFrame(crossFadeStep);
          }
        };

        requestAnimationFrame(crossFadeStep);
      };

      prepareAndCrossFade();
    });
  }, [fadeAudio]);

  // Create and prepare audio element
  const createAudioElement = useCallback((src: string): HTMLAudioElement => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 0;
    audio.crossOrigin = 'anonymous';
    
    // Set additional properties for better loading
    audio.muted = false; // Ensure not muted
    
    // Set source after configuration
    audio.src = src;
    
    return audio;
  }, []);

  // Start audio playback with professional fade-in
  const startAudio = useCallback(async (audio: HTMLAudioElement, config: AudioConfig) => {
    try {
      audio.currentTime = config.loop.start;
      
      // For mobile compatibility: try to play immediately
      try {
        await audio.play();
      } catch (playError) {
        // If autoplay fails on mobile, it's usually because we need a fresh user interaction
        console.warn('Initial play failed, likely due to mobile autoplay restrictions:', playError);
        
        // Try to resume audio context if it exists
        try {
          const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
              await audioContext.resume();
              // Try playing again after resuming context
              await audio.play();
            }
          }
        } catch (contextError) {
          console.warn('Audio context resume failed:', contextError);
          throw playError; // Re-throw original play error
        }
      }
      
      // Use longer, more professional fade-in (1.2 seconds)
      await fadeAudio(audio, 'in', 1200);
      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to start audio:', error);
      setIsPlaying(false);
    }
  }, [fadeAudio]);

  // Stop audio playback with professional fade-out
  const stopAudio = useCallback(async (audio: HTMLAudioElement) => {
    try {
      // Use longer, more professional fade-out (1 second)
      await fadeAudio(audio, 'out', 1000);
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn('Failed to stop audio:', error);
      audio.pause();
    }
  }, [fadeAudio]);

  // Handle smooth transition between audio tracks with professional cross-fading
  const transitionToNewAudio = useCallback(async (newConfig: AudioConfig) => {
    if (currentAudioRef.current && currentAudioSrc === newConfig.src) {
      return; // Same audio, no need to transition
    }

    setIsTransitioning(true);
    setIsLoading(true);

    // Capture the current playing state before any transitions
    const wasPlaying = isPlaying;
    const currentAudio = currentAudioRef.current;

    try {
      // Create new audio element for the new track
      const newAudio = createAudioElement(newConfig.src);
      
      // Wait for new audio to be ready with multiple event listeners for better reliability
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn(`Audio load timeout for: ${newConfig.src}`);
          reject(new Error('Audio load timeout'));
        }, 15000);
        
        let resolved = false;
        
        const resolveOnce = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve();
          }
        };
        
        newAudio.addEventListener('canplaythrough', resolveOnce, { once: true });
        newAudio.addEventListener('canplay', resolveOnce, { once: true });
        newAudio.addEventListener('loadeddata', resolveOnce, { once: true });
        
        newAudio.addEventListener('error', (error) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            console.error('Audio load error:', error);
            reject(new Error('Audio load failed'));
          }
        }, { once: true });
        
        newAudio.load();
      });

      // Update references before starting transition
      nextAudioRef.current = newAudio;
      currentAudioRef.current = newAudio;
      setCurrentAudioSrc(newConfig.src);
      setIsLoading(false);

      // If there was current audio playing, use cross-fade for smooth transition
      if (currentAudio && wasPlaying && hasUserInteracted) {
        await crossFade(currentAudio, newAudio, newConfig, 1800); // 1.8 second cross-fade
        setIsPlaying(true);
      } else if (hasUserInteracted && (shouldAutoPlay || wasPlaying)) {
        // If no current audio or not playing, just start new audio with fade-in
        await startAudio(newAudio, newConfig);
      }

      setIsTransitioning(false);
    } catch (error) {
      console.error('Failed to transition to new audio:', error);
      // Don't let the error stop the app, just log it and continue
      setIsLoading(false);
      setIsTransitioning(false);
      
      // If we failed to load new audio but have current audio, keep it playing using captured state
      if (currentAudio && wasPlaying && hasUserInteracted && shouldAutoPlay) {
        try {
          await startAudio(currentAudio, { src: currentAudioSrc!, loop: newConfig.loop });
        } catch (fallbackError) {
          console.warn('Fallback audio start failed:', fallbackError);
        }
      }
    }
  }, [currentAudioSrc, createAudioElement, crossFade, startAudio, isPlaying, hasUserInteracted, shouldAutoPlay]);

  // Initialize or change audio when config changes with debouncing
  useEffect(() => {
    if (audioConfig?.src && isEnabled) {
      // Clear any pending transition
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      // Debounce rapid audio changes (e.g., when scrolling quickly through slides)
      debounceTimeoutRef.current = window.setTimeout(() => {
        console.log('Transitioning to audio:', audioConfig.src);
        transitionToNewAudio(audioConfig);
      }, 200); // 200ms debounce
    }
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [audioConfig?.src, isEnabled, transitionToNewAudio, audioConfig]);

  // Handle loop timing for current audio
  useEffect(() => {
    if (currentAudioRef.current && audioConfig && isPlaying && !isTransitioning) {
      const audio = currentAudioRef.current;
      
      const checkTime = () => {
        if (audio.currentTime >= audioConfig.loop.end) {
          audio.currentTime = audioConfig.loop.start;
        }
        setCurrentTime(audio.currentTime);
      };

      intervalRef.current = setInterval(checkTime, 100);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [audioConfig, isPlaying, isTransitioning]);

  // Force immediate autoplay when shouldAutoPlay becomes true
  useEffect(() => {
    if (shouldAutoPlay && audioConfig && !isLoading && isEnabled && !hasAutoPlayTriggered && !isTransitioning) {
      setHasAutoPlayTriggered(true);
      setHasUserInteracted(true);
      
      const timer = setTimeout(async () => {
        if (currentAudioRef.current) {
          await startAudio(currentAudioRef.current, audioConfig);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoPlay, audioConfig, isLoading, isEnabled, hasAutoPlayTriggered, isTransitioning, startAudio]);

  // Play function
  const play = useCallback(async () => {
    console.log('Play function called', { 
      hasAudio: !!currentAudioRef.current, 
      hasConfig: !!audioConfig, 
      isLoading, 
      hasUserInteracted, 
      isTransitioning 
    });
    
    if (currentAudioRef.current && audioConfig && !isLoading && hasUserInteracted && !isTransitioning) {
      try {
        await startAudio(currentAudioRef.current, audioConfig);
      } catch (error) {
        console.warn('Play function failed:', error);
      }
    } else {
      console.warn('Play function conditions not met');
    }
  }, [audioConfig, isLoading, hasUserInteracted, isTransitioning, startAudio]);

  // Pause function
  const pause = useCallback(async () => {
    console.log('Pause function called', { 
      hasAudio: !!currentAudioRef.current, 
      isTransitioning 
    });
    
    if (currentAudioRef.current && !isTransitioning) {
      try {
        await stopAudio(currentAudioRef.current);
        setIsPlaying(false);
      } catch (error) {
        console.warn('Pause function failed:', error);
        // Fallback: try to pause directly
        currentAudioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      console.warn('Pause function conditions not met');
    }
  }, [isTransitioning, stopAudio]);

  // Toggle function
  const toggle = useCallback(async () => {
    console.log('Toggle audio playback', { isPlaying, hasUserInteracted, isTransitioning, canPlay: !!audioConfig });
    
    // If user hasn't interacted yet, set the flag and start playing
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      // Start playing after setting user interaction
      if (currentAudioRef.current && audioConfig && !isLoading && !isTransitioning) {
        try {
          await startAudio(currentAudioRef.current, audioConfig);
        } catch (error) {
          console.warn('Failed to start audio on first interaction:', error);
        }
      }
      return;
    }
    
    // Normal toggle behavior for subsequent clicks
    if (isPlaying && !isTransitioning) {
      try {
        await pause();
      } catch (error) {
        console.warn('Failed to pause audio:', error);
      }
    } else if (!isTransitioning && !isLoading) {
      try {
        await play();
      } catch (error) {
        console.warn('Failed to play audio:', error);
      }
    }
  }, [isPlaying, hasUserInteracted, isTransitioning, isLoading, audioConfig, currentAudioRef, startAudio, play, pause]);

  // Cleanup on unmount
  useEffect(() => {
    const currentAudio = currentAudioRef.current;
    const nextAudio = nextAudioRef.current;
    const interval = intervalRef.current;
    const fadeInterval = fadeIntervalRef.current;
    const transitionTimeout = transitionTimeoutRef.current;
    const debounceTimeout = debounceTimeoutRef.current;

    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
      if (nextAudio) {
        nextAudio.pause();
      }
      if (interval) {
        clearInterval(interval);
      }
      if (fadeInterval) {
        clearInterval(fadeInterval);
      }
      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
      }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);

  return {
    isPlaying,
    isLoading,
    isTransitioning,
    currentTime,
    hasUserInteracted,
    play,
    pause,
    toggle,
    canPlay: !!audioConfig && !isLoading && isEnabled
  };
};
