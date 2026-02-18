'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Tweety from './Tweety';
import { audioHelper } from '../utils/audioHelper';

/**
 * GiftScreen - Displays the unlocked gift
 */
export default function GiftScreen({ scene, wins, requiredWins }) {
  useEffect(() => {
    if (scene.audio) {
      audioHelper.play(scene.audio);
    }

    return () => {
      audioHelper.stop();
    };
  }, [scene.audio]);

  const backgroundStyle = scene.backgroundImage
    ? {
        backgroundImage: `url(${scene.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(to bottom right, #FFD54F, #FFB3D9, #87CEEB)',
      };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-tweety-yellow rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 rounded-3xl p-8 md:p-12 max-w-4xl text-center shadow-2xl z-10"
      >
        {/* Tweety Animation */}
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
          className="mb-8"
        >
          <Tweety
            animationPath={scene.lottieAnimation}
            className="w-64 h-64 mx-auto"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tweety-yellow via-tweety-pink to-tweety-sky-blue mb-6"
        >
          🎉 Congratulations! 🎉
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl text-gray-800 mb-8 leading-relaxed"
        >
          {scene.text || 'You\'ve unlocked the special gift!'}
        </motion.p>

        {/* Gift Image */}
        {scene.giftImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <img
              src={scene.giftImage}
              alt="Gift"
              className="w-full max-w-md mx-auto rounded-2xl shadow-xl border-4 border-tweety-yellow"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Gift Caption */}
        {scene.giftCaption && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-700 font-semibold mb-6"
          >
            {scene.giftCaption}
          </motion.p>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-tweety-yellow to-tweety-pink rounded-2xl p-6 mt-8"
        >
          <p className="text-lg text-white font-bold">
            You won {wins} out of {requiredWins} mini-games! 🏆
          </p>
        </motion.div>

        {/* Placeholder gift box if no image */}
        {!scene.giftImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-tweety-yellow to-tweety-pink rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white">
              <span className="text-8xl">🎁</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

