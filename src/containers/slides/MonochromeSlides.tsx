import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Slide } from '../../store/useSlideStore';
import { useSlideStore } from '../../store/useSlideStore';
import { useOptimizedAnimations } from '../../hooks/useMobileOptimization';

interface MonochromeSlideProps {
  slide: Slide;
  isActive: boolean;
  index: number;
}

// Monochrome Welcome Slide with Letter Paper Texture
export const RomanticWelcomeSlide: React.FC<MonochromeSlideProps> = ({ slide }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isMobile, getOptimizedConfig, getOptimizedTransform } = useOptimizedAnimations();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Reduced parallax distances for mobile performance
  const y1 = useTransform(scrollYProgress, [0, 1], [0, getOptimizedTransform(-60)]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, getOptimizedTransform(-30)]);

  const baseAnimConfig = { duration: 0.6 };
  const animConfig = getOptimizedConfig(baseAnimConfig);

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex items-center justify- pt-24 overflow-hidden bg-pure-white letter-paper motion-element"
      style={{ willChange: 'transform' }}
    >
      {/* Subtle Background Elements - Reduced on mobile */}
      {!isMobile && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 right-1/3 w-64 h-64 bg-black/5 rounded-full blur-3xl motion-element"
            style={{ y: y1, willChange: 'transform' }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-black/3 rounded-full blur-2xl motion-element"
            style={{ y: y2, willChange: 'transform' }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-8 h-full flex flex-col justify-center">
        {/* Header Section */}
        <motion.div
          style={{ y: y1, willChange: 'transform' }}
          className="text-center mb-12 motion-element"
        >

          {/* Title with Elegant Typography */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-deep-black mb-4 premium-title text-start">
            {slide.title.split(" ").map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className="inline-block mr-4 motion-element"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{
                  duration: animConfig.duration,
                  ease: animConfig.ease,
                  type: animConfig.type,
                  delay: wordIndex * 0.1,
                }}
              >
                {word}*
              </motion.span>
            ))}
          </h1>

          {/* Decorative Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={animConfig}
            className="h-px bg-charcoal mb-4 motion-element"
          />

          <div className='space-y-1'>
              <p className='text-md font-semibold italic text-charcoal text-start'>
                Verbo
              </p>
              <p className='text-sm font-light text-charcoal text-start'>
                Acción de abrir una puerta entre dos mundos.
              </p>
              <p className='text-sm font-light text-charcoal text-start'>
                Requiere curiosidad, respeto y una dosis de coraje.
              </p>
              <p className='text-sm font-light text-charcoal text-start'>
                Puede empezar con un hola, una sonrisa,
              </p>
              <p className='text-sm font-light text-charcoal text-start'>
                O… con un sitio web como este.
              </p>
          </div>

        </motion.div>

        {/* Quote Section */}
        <motion.div
          style={{ y: y2, willChange: 'transform' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ ...animConfig, delay: 0.2 }}
          className="p-8 md:p-12 max-w-3xl mx-auto motion-element"
        >
          <blockquote className="text-lg md:text-2xl text-charcoal leading-relaxed mb-6 font-serif italic text-start">
            Pero no siempre es fácil.
          </blockquote>

          {slide.subtext && (
            <div className="space-y-6">
              {slide.subtext.map((_, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.7 + index * 0.1,
                    ease: [0.215, 0.61, 0.355, 1]
                  }}
                  className="text-md text-dark-gray leading-relaxed premium-text text-start"
                >
                  Especialmente cuando la otra persona parece tan enfocada en sus metas que incluso las máquinas del gimnasio parecen pedirle permiso para ser usadas. <br />
(Sí, hablo de ti 🏋️‍♀️😉)
                </motion.p>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Monochrome Reason Slide with Dark Background
export const RomanticReasonSlide: React.FC<MonochromeSlideProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex items-center justify-center bg-pure-white letter-paper"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full">
        {/* Title Section */}
        <motion.div
          style={{ y: y1 }}
          className="lg:col-span-5"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold leading-tight mb-8 text-charcoal premium-title"
          >
            <motion.span
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
              className="block font-extrabold text-end"
            >
              Susana*
            </motion.span>
            <motion.span
              initial={{ y: 80, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
              className="block text-2xl md:text-4xl text-charcoal text-end italic font-medium"
            >
              Un nombre con historia
            </motion.span>
          </motion.h2>

          {/* Decorative Element */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-px bg-white mb-8"
          />
        </motion.div>

        {/* Content Card */}
        <motion.div
          style={{ y: y2 }}
          className="lg:col-span-7"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 md:p-12"
          >
            {/* Quote with Elegant Border */}
            <div className="border-l-2 border-white pl-6 mb-8">
              <blockquote className="text-xl md:text-2xl text-charcoal leading-relaxed font-serif italic">
                Susana, de origen hebreo. <br />
Significa “lirio” o “flor blanca”. <br />
Como esas personas que no necesitan alzar la voz para hacerse notar. <br />
              </blockquote>
            </div>

    
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.215, 0.61, 0.355, 1]
                    }}
                    className="flex items-start space-x-4"
                  >
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"
                      whileInView={{ scale: [0, 1.5, 1] }}
                      transition={{ duration: 0.6, delay: 0.8 * 0.2 }}
                    />
                    <p className="text-lg text-charcoal leading-relaxed premium-text">
                      No es un nombre cualquiera. <br />
                      Por eso, esta tampoco es una invitación cualquiera. <br />
                    </p>
                  </motion.div>
           
          </motion.div>
        </motion.div>
      </div>

      {/* Background Parallax Element */}
      <motion.div
        className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
        style={{ y: y1 }}
      />
    </motion.div>
  );
};

// Why You Slide with White Background and Professional Layout
export const RomanticWhyYouSlide: React.FC<MonochromeSlideProps> = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.99]);

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="relative h-dvh flex flex-col items-center justify-between bg-light-gray letter-paper"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-8 h-full flex flex-col justify-between">
        {/* Title with Professional Icon */}
        <motion.div
          style={{ y }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto mb-8 bg-charcoal rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-xl text-pure-white">💫</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-deep-black mb-4 premium-title text-start">
            <motion.span
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
              className="block"
            >
              Personas especiales, Merecen gestos especiales
            </motion.span>
          </h2>
        </motion.div>

          
          <section className='flex flex-col space-y-6 mb-16 items-end justify-end text-end'>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.15,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-md md:text-lg text-charcoal leading-relaxed premium-text">
                      Podría haber buscado tu número o soltado un comentario cualquiera en medio de una serie de sentadillas. 🤔
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.15,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <blockquote className="text-lg md:text-xl text-charcoal leading-relaxed font-serif italic font-semibold">
                      Pero no. <br />
                      Preferí hacer algo distinto.
                    </blockquote>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.15,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-md md:text-lg text-charcoal leading-relaxed premium-text">
                     No para impresionarte. Sino para que sepas que, si decidí acercarme, es porque creo que conocerte vale el intento… y el gesto.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.15,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
                whileHover={{ y: -2 }}
                className="group cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-1">
                    <p className="text-xs text-charcoal leading-relaxed premium-text">
                     (Además, hacer sitios web es más fácil que hablarle a alguien que te intimida un poco.. e interrumpirle su serie).
                    </p>
                  </div>
                </div>
              </motion.div>
          </section>

          </div>
    </motion.div>
  );
};

// Personal Curious Facts - Dark Background
export const PersonalCuriousFactsSlide: React.FC<MonochromeSlideProps> = () => {
  const ref = useRef<HTMLDivElement>(null);

  const curiousFacts = [
    {
      text: "Estoy leyendo \"Enamórate del problema, no de la solución\".",
      subtext: "",
      icon: "📚"
    },
    {
      text: "Nada como el mar, la playa, el sol y cero notificaciones.",
      subtext: "",
      icon: "🌊"
    },
    {
      text: "Café >>> té.",
      subtext: null,
      icon: "☕️"
    },
    {
      text: "Perros >>> gatos",
      subtext: "(aunque a veces me traicionan).",
      icon: "🐕"
    },
    {
      text: "Prefiero escapadas de día al campo que fiestas de noche en la ciudad.",
      subtext: "(Aunque...)",
      icon: "🌿"
    }
  ];

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex items-center justify-center bg-charcoal paper-texture overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white/5 rounded-full"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
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

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-20 h-full flex flex-col justify-center">
        {/* Title Section */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-2xl">🤓</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-pure-white mb-4 premium-title">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
              className="block"
            >
              Fun Facts
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
              className="block text-medium-gray text-2xl md:text-3xl"
            >
              sobre mí
            </motion.span>
          </h2>
        </motion.div>

        {/* Facts List */}
        <div>
          {curiousFacts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                ease: [0.215, 0.61, 0.355, 1]
              }}
              whileHover={{ x: 10, transition: { duration: 0.3 } }}
              className="group space-y-3"
            >
              <div className="flex items-start space-x-6">
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  {fact.icon}
                </motion.div>
                
                {/* Content */}
                <div className="flex-1">
                  <p className="text-md md:text-lg text-light-gray leading-relaxed group-hover:text-pure-white transition-colors duration-300 premium-text mb-2">
                    {fact.text}
                  </p>
                    {
                      fact.subtext && (
                        <span className="text-xs text-medium-gray italic leading-relaxed group-hover:text-white/70 transition-colors duration-300 premium-text">
                          {fact.subtext}
                        </span>
                      )
                    }
                </div>
              </div>

              {/* Hover Effect Line */}
              <motion.div
                className="h-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-18"
                initial={{ width: 0 }}
                whileInView={{ width: "85%" }}
                transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

// Fun Facts with Full Screen Individual Facts - Dark Background
export const RomanticFunFactsSlide: React.FC<MonochromeSlideProps> = ({ slide }) => {
  const { horizontalSlideIndex, setHorizontalSlideIndex } = useSlideStore();
  const ref = useRef<HTMLDivElement>(null);

  // Different image sets for each fun fact
  const factImageSets = [
    ["🎨", "🖌️", "🎭", "🌈", "✨", "🎪", "🎬", "📸", "🎵", "🎸"],
    ["📚", "✍️", "📝", "💭", "🧠", "💡", "📖", "📰", "📑", "📊"],
    ["🍷", "🥂", "🍾", "🥃", "☕", "🍸", "🧊", "🌟", "💫", "✨"],
    ["🌍", "✈️", "🏔️", "🌊", "🏖️", "🌅", "🗺️", "🧳", "📍", "🌎"],
    ["🎯", "🏆", "⚡", "🔥", "💪", "🚀", "⭐", "💎", "👑", "🏅"],
    ["❤️", "💝", "🌹", "💕", "💖", "🦋", "🌸", "💐", "🌺", "🌻"]
  ];

  // Real images from public folder (only for second set)
  const realImages = [
    "/susana-qr-invitation/images/fitness-1.jpg",
    "/susana-qr-invitation/images/fitness-2.jpg", 
    "/susana-qr-invitation/images/fitness-3.jpg",
    "/susana-qr-invitation/images/fitness-4.jpg",
    "/susana-qr-invitation/images/fitness-5.jpg",
    "/susana-qr-invitation/images/fitness-6.jpg",
  ];

  const getCurrentImageSet = () => {
    // Use real images for index 1 (second set), emojis for all others
    if (horizontalSlideIndex === 1) {
      return realImages;
    }
    return factImageSets[horizontalSlideIndex] || factImageSets[0];
  };

  const currentFact = slide.points?.[horizontalSlideIndex] || slide.points?.[0] || "";

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex flex-col bg-charcoal paper-texture overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-white rounded-full"
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Compact Header with Title and Navigation */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 pt-24 pb-4 px-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-pure-white">
              {slide.title}
            </h2>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm text-charcoal">🤝</span>
            </div>
          </div>
          
          {/* Compact Navigation Bar */}
          {slide.points && slide.points.length > 1 && (
            <div className="flex items-center justify-between space-x-2 px-4 py-2 ">
              <div className='flex flex-row flex-nowrap items-center justify-between'>
                <div className="flex space-x-1">
                {slide.points.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHorizontalSlideIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === horizontalSlideIndex
                        ? 'bg-white w-6'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Fact ${index + 1}`}
                  />
                ))}
              </div>
              
                <span className="text-xs text-white/70 ml-2 font-mono">
                    {horizontalSlideIndex + 1}/{slide.points.length}
                </span>
              </div>

              <div className='flex flex-row flex-nowrap items-center justify-end space-x-2'>
                <button
                    onClick={() => setHorizontalSlideIndex(
                    horizontalSlideIndex > 0 ? horizontalSlideIndex - 1 : slide.points!.length - 1
                    )}
                    className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                    aria-label="Anterior"
                >
                    ←
                </button>
                <button
                    onClick={() => setHorizontalSlideIndex(
                    horizontalSlideIndex < slide.points!.length - 1 ? horizontalSlideIndex + 1 : 0
                    )}
                    className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                    aria-label="Siguiente"
                >
                    →
                </button>
                </div>
            </div>
          )}
        </motion.div>

        {/* Compact Main Content with Swipe Gesture */}
        <motion.div
          key={horizontalSlideIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex-1 flex items-center justify-center px-8 py-4"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => {
            const threshold = 50;
            if (info.offset.x > threshold) {
              // Swipe right - go to previous fact
              setHorizontalSlideIndex(
                horizontalSlideIndex > 0 ? horizontalSlideIndex - 1 : slide.points!.length - 1
              );
            } else if (info.offset.x < -threshold) {
              // Swipe left - go to next fact
              setHorizontalSlideIndex(
                horizontalSlideIndex < slide.points!.length - 1 ? horizontalSlideIndex + 1 : 0
              );
            }
          }}
          whileDrag={{ 
            scale: 0.98,
            cursor: "grabbing"
          }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-light-gray leading-relaxed text-center select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {currentFact.split(" ").map((word, wordIndex) => (
                <motion.span
                  key={`${horizontalSlideIndex}-${wordIndex}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.2 + wordIndex * 0.05 
                  }}
                  className="inline-block mr-2"
                  whileHover={{ 
                    y: -3, 
                    color: "#ffffff",
                    transition: { duration: 0.15 } 
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>
            
            {/* Swipe Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center mt-6 text-white/10 text-sm"
            >
              <span className="flex items-center space-x-2">
                <span>←</span>
                <span>Desliza para navegar</span>
                <span>→</span>
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Compact Bottom Slider */}
        <motion.div
          key={`slider-${horizontalSlideIndex}`}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-shrink-0 pb-6 px-4 overflow-hidden"
        >
            {
              horizontalSlideIndex === 1 && (
                <h2 className='text-white/30 text-sm font-light italic text-center py-5'>
                    (Estos podríamos ser nosotros, mira lo feliz que estas)*
                </h2>
              )
            }
          <div className="relative h-12">
            {/* Compact Infinite Slider */}
            <motion.div
              className="flex space-x-3"
              animate={{ x: [0, -1200] }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
                {/* First set of images */}
              {getCurrentImageSet().map((item, index) =>  {
                const isImage = horizontalSlideIndex === 1; // Only second set uses images
                
                return (
                  <motion.div
                    key={`third-${horizontalSlideIndex}-${index}`}
                    className={`flex-shrink-0 w-12 h-12 ${
                      isImage ? 'bg-white/20' : 'bg-white/10'
                    } rounded-lg flex items-center justify-center overflow-hidden`}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: isImage ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
                      transition: { duration: 0.15 } 
                    }}
                  >
                    {isImage ? (
                      <img 
                        src={item} 
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '📸';
                        }}
                      />
                    ) : (
                      <span className="text-lg">{item}</span>
                    )}
                  </motion.div>
                );
              })}
              {/* Duplicate sets for seamless loop */}
              {getCurrentImageSet().map((item, index) =>  {
                const isImage = horizontalSlideIndex === 1; // Only second set uses images
                
                return (
                  <motion.div
                    key={`third-${horizontalSlideIndex}-${index}`}
                    className={`flex-shrink-0 w-12 h-12 ${
                      isImage ? 'bg-white/20' : 'bg-white/10'
                    } rounded-lg flex items-center justify-center overflow-hidden`}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: isImage ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
                      transition: { duration: 0.15 } 
                    }}
                  >
                    {isImage ? (
                      <img 
                        src={item} 
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '📸';
                        }}
                      />
                    ) : (
                      <span className="text-lg">{item}</span>
                    )}
                  </motion.div>
                );
              })}
              {getCurrentImageSet().map((item, index) => {
                const isImage = horizontalSlideIndex === 1; // Only second set uses images
                
                return (
                  <motion.div
                    key={`third-${horizontalSlideIndex}-${index}`}
                    className={`flex-shrink-0 w-12 h-12 ${
                      isImage ? 'bg-white/20' : 'bg-white/10'
                    } rounded-lg flex items-center justify-center overflow-hidden`}
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: isImage ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.2)",
                      transition: { duration: 0.15 } 
                    }}
                  >
                    {isImage ? (
                      <img 
                        src={item} 
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '📸';
                        }}
                      />
                    ) : (
                      <span className="text-lg">{item}</span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Compact gradient overlays */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-charcoal to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-charcoal to-transparent pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

// Questions Slide with Full Screen Individual Questions - White Background
export const RomanticQuestionsSlide: React.FC<MonochromeSlideProps> = ({ slide }) => {
  const { horizontalSlideIndex, setHorizontalSlideIndex } = useSlideStore();
  const ref = useRef<HTMLDivElement>(null);

  // Sample images for the infinite slider (you can replace with actual images)
  const sliderImages = [
    "📸", "🌟", "💫", "✨", "🎭", "🎨", "🎪", "🎬", "🎵", "🎸",
    "📚", "☕", "🌙", "⭐", "🌸", "🦋", "🎯", "🎲", "🎊", "🎈"
  ];

  const currentQuestion = slide.questions?.[horizontalSlideIndex] || slide.questions?.[0] || "";

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex flex-col bg-pure-white letter-paper overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 border border-charcoal rounded-full"
            style={{
              left: `${30 + i * 25}%`,
              top: `${25 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header Section with Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0 pt-12 pb-8 px-8 text-center"
        >
          <div className="w-12 h-12 mx-auto mb-6 bg-charcoal rounded-full flex items-center justify-center">
            <span className="text-lg text-pure-white">👀</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-black hero-text">
            {slide.title}
          </h2>
        </motion.div>

        {/* Main Question Content - Centered */}
        <motion.div
          key={horizontalSlideIndex}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -30 }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
          className="flex-1 flex items-center justify-center px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="mb-8"
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <div className="w-16 h-16 mx-auto mb-8 bg-deep-black text-pure-white rounded-full flex items-center justify-center font-bold text-xl">
                #{horizontalSlideIndex + 1}
              </div>
            </motion.div>
            
            <motion.p 
              className="text-3xl md:text-4xl lg:text-5xl text-charcoal leading-relaxed large-quote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {currentQuestion.split(" ").map((word, wordIndex) => (
                <motion.span
                  key={`${horizontalSlideIndex}-${wordIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.3 + wordIndex * 0.1 
                  }}
                  className="inline-block mr-3"
                  whileHover={{ 
                    y: -5, 
                    transition: { duration: 0.2 } 
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            {/* Question Counter */}
            {slide.questions && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-lg text-dark-gray mt-8 font-serif italic"
              >
                Pregunta {horizontalSlideIndex + 1} de {slide.questions.length}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Bottom Infinite Slider */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex-shrink-0 pb-8 px-4 overflow-hidden"
        >
          <div className="relative">
            {/* Infinite Slider Container */}
            <motion.div
              className="flex space-x-6"
              animate={{ x: [0, -1920] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* First set of images */}
              {sliderImages.map((emoji, index) => (
                <motion.div
                  key={`first-${index}`}
                  className="flex-shrink-0 w-16 h-16 bg-light-gray rounded-full flex items-center justify-center text-2xl"
                  whileHover={{ 
                    scale: 1.2, 
                    backgroundColor: "#e9ecef",
                    transition: { duration: 0.2 } 
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
              {/* Duplicate set for seamless loop */}
              {sliderImages.map((emoji, index) => (
                <motion.div
                  key={`second-${index}`}
                  className="flex-shrink-0 w-16 h-16 bg-light-gray rounded-full flex items-center justify-center text-2xl"
                  whileHover={{ 
                    scale: 1.2, 
                    backgroundColor: "#e9ecef",
                    transition: { duration: 0.2 } 
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
              {/* Third set for extra smoothness */}
              {sliderImages.map((emoji, index) => (
                <motion.div
                  key={`third-${index}`}
                  className="flex-shrink-0 w-16 h-16 bg-light-gray rounded-full flex items-center justify-center text-2xl"
                  whileHover={{ 
                    scale: 1.2, 
                    backgroundColor: "#e9ecef",
                    transition: { duration: 0.2 } 
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient overlays for fade effect */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-pure-white to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-pure-white to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Navigation Controls */}
        {slide.questions && slide.questions.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute left-6 right-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none"
          >
            <button
              onClick={() => setHorizontalSlideIndex(
                horizontalSlideIndex > 0 ? horizontalSlideIndex - 1 : slide.questions!.length - 1
              )}
              className="w-12 h-12 bg-charcoal text-pure-white rounded-full flex items-center justify-center pointer-events-auto hover:bg-deep-black transition-colors duration-300"
              aria-label="Pregunta anterior"
            >
              ←
            </button>
            <button
              onClick={() => setHorizontalSlideIndex(
                horizontalSlideIndex < slide.questions!.length - 1 ? horizontalSlideIndex + 1 : 0
              )}
              className="w-12 h-12 bg-charcoal text-pure-white rounded-full flex items-center justify-center pointer-events-auto hover:bg-deep-black transition-colors duration-300"
              aria-label="Siguiente pregunta"
            >
              →
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Call to Action Slide with Contact Information - Dark Background
export const CallToActionSlide: React.FC<MonochromeSlideProps> = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex items-center justify-center bg-light-gray letter-paper overflow-hidden"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/3 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.1, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 pt-24 text-center h-full flex flex-col justify-between p-16">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 space-y-2"
        >
          <h2 className="text-2xl italic font-serif font-semibold text-charcoal leading-relaxed text-deep-black text-start">
            Tengo muchas más preguntas
          </h2>
          <h2 className="text-xl font-serif text-deep-black text-start">
            pero solo las haré si esta propuesta logró su objetivo:
          </h2>
            <p className='text-xl font-serif text-deep-black text-center font-light mt-6 italic'>
            Que te nazca la curiosidad de conocerme también.
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8 text-end"
        >
          <div className="text-charcoal">
            <p className="text-md md:text-xl leading-relaxed mb-4">
              No soy de pedir números a desconocidos y menos si no es en persona.
            </p>
            <p className="text-md md:text-xl leading-relaxed">
              Así que te dejaré mi email más abajo.
            </p>
            <span className='text-sm italic text-dark-gray'>
              (Si, mi email, aqui prima el respeto ante todo)
            </span>
          </div>

          
        </motion.div>

        {/* Humorous disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 text-charcoal"
          >
            <p className="text-start text-base md:text-lg leading-relaxed font-serif italic">
              Si me respondes, genial. Si no… simplemente fingiré normalidad cada vez que coincidamos en el gym.
              <br />
              (O cambiaré de horario, apellido e incluso de gimnasio como todo un estratega 🤠).
            </p>
          </motion.div>
      </div>
    </motion.div>
  );
};

// Final Slide with White Background
export const RomanticFinalSlide: React.FC<MonochromeSlideProps> = ({ slide }) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className="relative h-dvh flex items-center justify-center bg-light-gray letter-paper overflow-hidden"
    >
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/3 right-1/4 w-48 h-48 bg-black/5 rounded-full blur-3xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 8, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-32 h-32 bg-black/3 rounded-full blur-2xl"
          animate={{
            y: [0, 12, 0],
            x: [0, -6, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating Dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-lg opacity-20"
            style={{
              left: `${30 + i * 25}%`,
              top: `${35 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🚀
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center h-full flex flex-col justify-center">

        {slide.quote && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="p-8 md:p-12 mb-8"
          >
            <blockquote className="text-2xl md:text-2xl text-charcoal leading-relaxed font-serif italic">
              Así que, Susana…
            </blockquote>
            <blockquote className="text-4xl md:text-7xl text-charcoal leading-relaxed font-serif italic">
              ¿Nos conocemos?
            </blockquote>
          </motion.div>
        )}

         {/* Contact Links */}
          <div className="space-y-4">
            <motion.a
              href="mailto:jedp082@gmail.com"
              className="block text-xl md:text-2xl text-white hover:text-pure-white transition-colors duration-300 font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              jedp082@gmail.com
            </motion.a>
          </div>
      </div>
    </motion.div>
  );
};
