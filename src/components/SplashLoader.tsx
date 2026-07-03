import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SplashLoaderProps {
  onFinish: () => void;
  key?: string;
}

export default function SplashLoader({ onFinish }: SplashLoaderProps) {
  useEffect(() => {
    // Auto finish after minor delay
    const timeout = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => {
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: 'blur(12px)',
        transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-slate-300/30 backdrop-blur-[10px] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center p-6 max-w-md w-full text-center">
        
        {/* Central Complex Rotating Rings Space */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-10">
          
          {/* A glowing soft blood-red blurred backdrop circle right behind/around the car */}
          <div className="absolute inset-[15%] rounded-full bg-red-950/5 border border-red-950/10 blur-[6px] pointer-events-none" />

          {/* Inner Rotating Dashed Circle (Slow Anticlockwise) - Blood Red style */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-[15%] rounded-full border border-dashed border-red-900/40 blur-[0.2px]"
          />

          {/* Core Spinner Ring - Minimal (Blood Red) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            className="absolute inset-[8%] rounded-full border border-transparent border-t-red-700/80 blur-[0.2px]"
          />

          {/* Outer Segmented Blood Red Orbital Ring with soft blur */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 blur-[0.5px]">
            <motion.circle
              cx="112"
              cy="112"
              r="95"
              fill="transparent"
              stroke="#8B0000"
              strokeWidth="2"
              strokeDasharray="40 140"
              className="opacity-80"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
              style={{ transformOrigin: '112px 112px' }}
            />
          </svg>

          {/* Outer Orbited Blood Red Dot for styling with glow */}
          <svg className="absolute inset-0 w-full h-full rotate-45">
            <motion.circle
              cx="112"
              cy="112"
              r="102"
              fill="transparent"
              stroke="#8B0000"
              strokeWidth="4"
              strokeDasharray="1 300"
              strokeLinecap="round"
              className="opacity-90 drop-shadow-[0_0_6px_rgba(153,0,0,0.6)]"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              style={{ transformOrigin: '112px 112px' }}
            />
          </svg>

          {/* Center Space: Sleek aerodynamic luxury supercar silhouette with fully customized spinning alloy wheels */}
          <div className="absolute flex items-center justify-center w-full h-full">
            <motion.div
              animate={{ 
                y: [0, -0.7, 0.4, -0.6, 0.5, -0.3, 0],
                x: [0, 0.3, -0.3, 0.4, -0.4, 0.2, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.12, 
                ease: "linear" 
              }}
              className="relative flex items-center justify-center select-none"
            >
              {/* Custom High-Fidelity Logo */}
              <img 
                src="https://files.catbox.moe/2638nu.png"
                alt="Logo"
                className="w-32 h-16 object-contain drop-shadow-[0_0_12px_rgba(153,0,0,0.35)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>

        {/* Clean Minimalist Text Area with Blood Red loading text and dots */}
        <div className="flex items-center justify-center gap-0.5 select-none text-[#8B0000]">
          <span className="text-sm font-black tracking-[0.6em] uppercase text-center pl-1">
            LOADING
          </span>
          <span className="inline-flex gap-1 items-center justify-start text-lg">
            <motion.span animate={{ opacity: [0.15, 1, 0.15] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="font-extrabold pb-1">.</motion.span>
            <motion.span animate={{ opacity: [0.15, 1, 0.15] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.35 }} className="font-extrabold pb-1">.</motion.span>
            <motion.span animate={{ opacity: [0.15, 1, 0.15] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.7 }} className="font-extrabold pb-1">.</motion.span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
