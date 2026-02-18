'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * MiniGamePlaceholder - Dummy mini-game component
 * Can be replaced with actual mini-game implementations
 */
export default function MiniGamePlaceholder({ miniGame, onComplete }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(miniGame?.duration || 30);
  const [isComplete, setIsComplete] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  const handleGameEnd = (won = false) => {
    setIsComplete(true);
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          won,
          score,
          timeLeft,
        });
      }
    }, 1500);
  };

  const handleClick = () => {
    if (isComplete) return;
    const newScore = score + 1;
    setScore(newScore);
    
    // Complete game after reaching target score
    if (newScore >= (miniGame?.targetScore || 10)) {
      handleGameEnd(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl"
      >
        {/* Game Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-tweety-yellow via-tweety-pink to-tweety-sky-blue mb-6"
        >
          {miniGame?.title || 'Mini-Game'}
        </motion.h2>

        {/* Game Description */}
        {miniGame?.description && (
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 mb-8"
          >
            {miniGame.description}
          </motion.p>
        )}

        {/* Timer */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="mb-6"
        >
          <div className="text-3xl font-bold text-tweety-yellow">
            Time: {timeLeft}s
          </div>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          className="mb-8"
        >
          <div className="text-4xl font-bold text-tweety-pink">
            Score: {score} / {miniGame?.targetScore || 10}
          </div>
        </motion.div>

        {/* Game Area */}
        {!isComplete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-tweety-yellow to-tweety-pink text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {miniGame?.buttonText || 'Click Me!'}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-green-500 mb-4"
          >
            {score >= (miniGame?.targetScore || 10) ? '🎉 You Won! 🎉' : 'Game Over!'}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 italic"
        >
          {miniGame?.instructions || 'This is a placeholder mini-game. Replace with your actual game implementation.'}
        </motion.p>
      </motion.div>
    </div>
  );
}

