import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioPermissionModalProps {
  isOpen: boolean;
  onStart: () => void;
}

export const AudioPermissionModal: React.FC<AudioPermissionModalProps> = ({ 
  isOpen, 
  onStart 
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    
    // Create and activate audio context immediately to ensure autoplay works
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
      }
    } catch (error) {
      console.warn('Could not initialize audio context:', error);
    }
    
    // Small delay for better UX, then trigger the callback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onStart();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] bg-charcoal flex items-center justify-center"
        style={{ backdropFilter: 'blur(0px)' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border border-white rounded-full"
              style={{
                left: `${10 + (i % 3) * 30}%`,
                top: `${15 + Math.floor(i / 3) * 35}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-8 text-center">
          {/* Audio Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              type: "spring",
              stiffness: 100 
            }}
            className="w-24 h-24 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <motion.span 
              className="text-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎧
            </motion.span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            ¿Lista para algo distinto?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-light-gray mb-8 font-serif italic"
          >
            Antes de entrar, hazte un favor: <br />

ponte tus audífonos.
          </motion.p>

          {/* Instructions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="space-y-4 mb-12"
          >
            <div className="flex items-center justify-center space-x-4 text-medium-gray">
              <p className="text-lg">Esto se vive mejor con buen sonido y sin distracciones.</p>
            </div>
            
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.button
              onClick={handleStart}
              disabled={isStarting}
              className={`
                relative px-12 py-4 bg-white text-charcoal rounded-full text-xl font-semibold
                hover:bg-light-gray transition-all duration-300 shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isStarting ? 'scale-95' : 'hover:scale-105'}
              `}
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <AnimatePresence mode="wait">
                {isStarting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center space-x-3"
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center space-x-3"
                  >
                    <span>Estoy lista</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Musical Notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, -15, 0],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            >
              {['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
