import { useEffect, useRef, useState, useCallback } from 'react';

interface AudioConfig {
  src: string;
  loop: {
    start: number;
    end: number;
  };
}

export const useAdvancedAudioPlayer = (audioConfig?: AudioConfig, isEnabled: boolean = true, shouldAutoPlay: boolean = false) => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [hasAutoPlayTriggered, setHasAutoPlayTriggered] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  // Fade audio in or out
  const fadeAudio = useCallback((audio: HTMLAudioElement, direction: 'in' | 'out', duration: number = 1000): Promise<void> => {
    return new Promise((resolve) => {
      const startVolume = direction === 'in' ? 0 : audio.volume;
      const endVolume = direction === 'in' ? 0.6 : 0;
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = (endVolume - startVolume) / steps;
      let currentStep = 0;

      if (direction === 'in') {
        audio.volume = 0;
      }

      const fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = startVolume + (volumeStep * currentStep);
        audio.volume = Math.max(0, Math.min(0.6, newVolume));

        if (currentStep >= steps) {
          audio.volume = endVolume;
          clearInterval(fadeInterval);
          resolve();
        }
      }, stepDuration);
    });
  }, []);

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

  // Start audio playback with fade-in
  const startAudio = useCallback(async (audio: HTMLAudioElement, config: AudioConfig) => {
    try {
      audio.currentTime = config.loop.start;
      await audio.play();
      await fadeAudio(audio, 'in', 800);
      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to start audio:', error);
      setIsPlaying(false);
    }
  }, [fadeAudio]);

  // Stop audio playback with fade-out
  const stopAudio = useCallback(async (audio: HTMLAudioElement) => {
    try {
      await fadeAudio(audio, 'out', 600);
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.warn('Failed to stop audio:', error);
      audio.pause();
    }
  }, [fadeAudio]);

  // Handle smooth transition between audio tracks
  const transitionToNewAudio = useCallback(async (newConfig: AudioConfig) => {
    if (currentAudioRef.current && currentAudioSrc === newConfig.src) {
      return; // Same audio, no need to transition
    }

    setIsTransitioning(true);
    setIsLoading(true);

    try {
      // Prepare new audio
      const newAudio = createAudioElement(newConfig.src);
      
      // Wait for new audio to be ready with multiple event listeners for better reliability
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn(`Audio load timeout for: ${newConfig.src}`);
          reject(new Error('Audio load timeout'));
        }, 15000); // Increased timeout to 15 seconds
        
        let resolved = false;
        
        const resolveOnce = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            resolve();
          }
        };
        
        // Multiple events to catch when audio is ready
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
        
        // Force load the audio
        newAudio.load();
      });

      nextAudioRef.current = newAudio;

      // If there's current audio playing, fade it out
      if (currentAudioRef.current && isPlaying) {
        await stopAudio(currentAudioRef.current);
      }

      // Switch to new audio
      currentAudioRef.current = newAudio;
      setCurrentAudioSrc(newConfig.src);
      setIsLoading(false);

      // Start new audio if should be playing
      if (hasUserInteracted && shouldAutoPlay) {
        await startAudio(newAudio, newConfig);
      }

      setIsTransitioning(false);
    } catch (error) {
      console.error('Failed to transition to new audio:', error);
      // Don't let the error stop the app, just log it and continue
      setIsLoading(false);
      setIsTransitioning(false);
      
      // If we failed to load new audio but have current audio, keep it playing
      if (currentAudioRef.current && !isPlaying && hasUserInteracted && shouldAutoPlay) {
        try {
          await startAudio(currentAudioRef.current, { src: currentAudioSrc!, loop: newConfig.loop });
        } catch (fallbackError) {
          console.warn('Fallback audio start failed:', fallbackError);
        }
      }
    }
  }, [currentAudioSrc, createAudioElement, stopAudio, startAudio, isPlaying, hasUserInteracted, shouldAutoPlay]);

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
    if (currentAudioRef.current && audioConfig && !isLoading && hasUserInteracted && !isTransitioning) {
      await startAudio(currentAudioRef.current, audioConfig);
    }
  }, [audioConfig, isLoading, hasUserInteracted, isTransitioning, startAudio]);

  // Pause function
  const pause = useCallback(async () => {
    if (currentAudioRef.current && !isTransitioning) {
      await stopAudio(currentAudioRef.current);
      setIsPlaying(false);
    }
  }, [isTransitioning, stopAudio]);

  // Toggle function
  const toggle = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      return;
    }
    
    if (isPlaying && !isTransitioning) {
      pause();
    } else if (!isTransitioning) {
      play();
    }
  }, [isPlaying, hasUserInteracted, isTransitioning, play, pause]);

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
