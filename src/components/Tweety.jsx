'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

/**
 * Tweety - Displays Lottie animations with Tweety character
 */
export default function Tweety({ animationPath, className = '' }) {
  const lottieRef = useRef(null);

  useEffect(() => {
    // Auto-play animation when component mounts
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, [animationPath]);

  // Try to load animation
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (animationPath) {
      setIsLoading(true);
      fetch(animationPath)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Animation not found');
        })
        .then((data) => {
          // Validate animation data structure
          if (data && data.layers && Array.isArray(data.layers)) {
            setAnimationData(data);
            setError(false);
          } else {
            throw new Error('Invalid animation data structure');
          }
        })
        .catch((err) => {
          console.warn('Failed to load Lottie animation:', err);
          setError(true);
          setAnimationData(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setError(true);
    }
  }, [animationPath]);

  // Show fallback if error, no path, or still loading
  if (error || !animationPath || isLoading || !animationData) {
    // Fallback: Simple animated Tweety placeholder
    return (
      <div className={`${className} flex items-center justify-center`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-64 h-64 bg-tweety-yellow rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
        >
          <span className="text-6xl">🐦</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="w-full h-full"
      />
    </div>
  );
}

