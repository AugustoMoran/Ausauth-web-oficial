import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró en esta sesión
    const hasSeenSplash = sessionStorage.getItem('ausauth_splash_seen');
    if (hasSeenSplash) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setIsExiting(true);
      sessionStorage.setItem('ausauth_splash_seen', 'true');
      setTimeout(onComplete, 1200); // Wait for transition
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Partículas azules
  const particles = Array.from({ length: 30 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Sistema de partículas */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-400/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: [null, -150],
              scale: [0, Math.random() * 1.5 + 0.5, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
            style={{
              width: Math.random() * 5 + 2 + 'px',
              height: Math.random() * 5 + 2 + 'px',
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isExiting ? { 
          scale: 0.05, 
          opacity: 0,
          y: -500, // Hacia el navbar
          filter: "blur(10px)"
        } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "circIn" }}
      >
        {/* Glow dinámico */}
        <motion.div
          className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* LOGO con enfoque gradual y rotación 3D */}
        <motion.div
          initial={{ filter: "blur(40px)", scale: 0.3, rotateY: -45 }}
          animate={{ filter: "blur(0px)", scale: 1, rotateY: 10 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src="/logooficial.png"
            alt="Ausauth Logo"
            className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-[0_0_50px_rgba(139,92,246,0.5)]"
          />
          
          {/* Línea de escaneo */}
          <motion.div
            className="absolute top-0 left-[-10%] w-[120%] h-[2px] bg-gradient-to-r from-transparent via-primary-300 to-transparent z-20 shadow-[0_0_20px_#8b5cf6]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Texto Cinematic */}
        <div className="mt-12 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-[0.2em] uppercase italic"
          >
            AUSAUTH<span className="text-primary-400">.DEV</span>
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1.8, duration: 1.5 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-primary-400 to-transparent mx-auto mt-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="text-primary-400 font-light tracking-[0.6em] text-xs md:text-sm uppercase mt-6 opacity-70"
          >
            Software Architecture & Design
          </motion.p>
        </div>
      </motion.div>

      {/* Barra de progreso inferior */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-white/10 overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-primary-400 shadow-[0_0_15px_#8b5cf6]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4.5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
