'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tweety from '../Tweety';

/**
 * CatchHearts - Mini-game where player catches falling hearts
 */
export default function CatchHearts({ scene, onComplete }) {
  const [hearts, setHearts] = useState([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const targetCaught = 15;

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(30);
    setCaught(0);
    setMissed(0);
    setHearts([]);
    setGameOver(false);
  };

  // Spawn hearts
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * (window.innerWidth - 100),
          speed: 2 + Math.random() * 3,
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Move hearts down
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setHearts((prev) =>
        prev
          .map((heart) => ({
            ...heart,
            y: (heart.y || 0) + heart.speed,
          }))
          .filter((heart) => {
            if (heart.y > window.innerHeight) {
              setMissed((m) => m + 1);
              return false;
            }
            return true;
          })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  // Check win condition
  useEffect(() => {
    if (gameOver) {
      const won = caught >= targetCaught;
      setTimeout(() => {
        onComplete(won);
      }, 2000);
    }
  }, [gameOver, caught, targetCaught, onComplete]);

  // Catch heart
  const catchHeart = (heartId) => {
    setHearts((prev) => prev.filter((h) => h.id !== heartId));
    setCaught((prev) => prev + 1);
  };

  const backgroundStyle = scene.backgroundImage
    ? {
        backgroundImage: `url(${scene.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(to bottom, #87CEEB, #FFB3D9)',
      };

  if (!gameStarted) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4"
        style={backgroundStyle}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 rounded-3xl p-8 max-w-2xl text-center shadow-2xl"
        >
          <Tweety
            animationPath={scene.lottieAnimation}
            className="w-48 h-48 mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {scene.text || 'Catch the Hearts!'}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Click on the falling hearts to catch them!<br />
            Catch {targetCaught} hearts to win!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="bg-gradient-to-r from-tweety-yellow to-tweety-pink text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg"
          >
            Start Game!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg">
          <span className="text-2xl font-bold text-tweety-yellow">
            ❤️ {caught}/{targetCaught}
          </span>
        </div>
        <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg">
          <span className="text-2xl font-bold text-tweety-sky-blue">
            ⏱️ {timeLeft}s
          </span>
        </div>
      </div>

      {/* Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: heart.y || 0 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => catchHeart(heart.id)}
            className="absolute cursor-pointer z-10"
            style={{
              left: `${heart.x}px`,
              top: `${heart.y || 0}px`,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          >
            <span className="text-5xl animate-bounce">💕</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Game Over Screen */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md text-center shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-4">
              {caught >= targetCaught ? '🎉 You Won! 🎉' : '😢 Try Again!'}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              You caught {caught} hearts!
            </p>
            <p className="text-lg text-gray-500">
              {caught >= targetCaught
                ? 'Great job!'
                : `You need ${targetCaught} hearts to win.`}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

