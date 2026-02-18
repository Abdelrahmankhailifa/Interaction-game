'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SimpleFireworks from '../components/SimpleFireworks';

export default function Home() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      router.push('/video-story');
    }, 1000); // Wait for exit animation
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 overflow-hidden flex flex-col items-center justify-center">
      {/* Fireworks Background */}
      <SimpleFireworks />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'backOut' }}
          className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-8 drop-shadow-lg"
        >
          Happy Birthday Aya! <br /> 🎉🎂🎈
        </motion.h1>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button
            onClick={handleStart}
            disabled={isStarting}
            className={`
              px-8 py-4 text-2xl font-bold text-white rounded-full 
              bg-gradient-to-r from-pink-600 to-purple-600 
              hover:from-pink-500 hover:to-purple-500 
              transform hover:scale-105 transition-all duration-300
              shadow-[0_0_20px_rgba(236,72,153,0.5)]
              ${isStarting ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}
            `}
          >
            {isStarting ? 'Starting...' : 'Start Your Gift 🎁'}
          </button>
        </motion.div>
      </div>

      {/* Overlay for Fade Out */}
      {isStarting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-black z-50 pointer-events-none"
        />
      )}
    </div>
  );
}
