import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAdvancedAudioPlayer } from '../hooks/useAdvancedAudioPlayer';

interface AudioConfig {
  src: string;
  loop: {
    start: number;
    end: number;
  };
}

interface MinimalAudioPlayerProps {
  audioConfig?: AudioConfig;
  slideTitle?: string;
  isEnabled?: boolean;
  hasUserInteracted?: boolean;
  shouldAutoPlay?: boolean;
}

export const MinimalAudioPlayer: React.FC<MinimalAudioPlayerProps> = ({ 
  audioConfig, 
  slideTitle,
  isEnabled = true,
  hasUserInteracted = false,
  shouldAutoPlay = false
}) => {
  const { isPlaying, isLoading, isTransitioning, toggle, canPlay } = useAdvancedAudioPlayer(
    audioConfig, 
    isEnabled, 
    shouldAutoPlay, 
    hasUserInteracted
  );

  if (!audioConfig) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -20 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.215, 0.61, 0.355, 1] 
      }}
      className="fixed top-6 left-6 z-50 group"
    >
      {/* Main Player Container */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Background Blur */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full shadow-lg" />
        
        {/* Play/Pause Button */}
        <motion.button
          onClick={toggle}
          disabled={!canPlay || isLoading || isTransitioning}
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-300 overflow-hidden
            ${canPlay && !isLoading && !isTransitioning
              ? 'bg-charcoal/80 hover:bg-charcoal text-white shadow-lg hover:shadow-xl' 
              : 'bg-gray-400/50 text-gray-300 cursor-not-allowed'
            }
          `}
          whileTap={{ scale: 0.95 }}
          whileHover={{ 
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)" 
          }}
        >
          <AnimatePresence mode="wait">
            {isLoading || isTransitioning ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.2 }
                }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <div className="w-1.5 h-4 bg-black/60 rounded-sm mr-1" />
                <div className="w-1.5 h-4 bg-black/60 rounded-sm" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.5, x: -1 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Playing Indicator */}
        <AnimatePresence>
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -inset-1 rounded-full border-2 border-white/20"
            >
              <motion.div
                className="absolute -inset-0.5 rounded-full border border-white/40"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Expandable Info Panel */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -10, width: 0 }}
          whileHover={{ opacity: 1, x: 0, width: "auto" }}
          transition={{ 
            duration: 0.3,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="absolute left-14 top-0 h-12 flex items-center pointer-events-none group-hover:pointer-events-auto"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <p className="text-xs font-medium text-charcoal">
              {slideTitle || 'Reproduciendo música'}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isTransitioning ? 'bg-orange-500' : 
                isPlaying ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <span className="text-xs text-gray-600">
                {isTransitioning ? 'Cambiando...' : 
                 isPlaying ? 'Reproduciendo' : 'Pausado'}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Sound Waves Animation */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center space-x-0.5"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-gray-400 rounded-full"
                animate={{
                  height: [4, 12, 4],
                }}
                transition={{
                  duration: 0.8 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
