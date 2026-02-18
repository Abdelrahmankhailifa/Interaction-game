'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Tweety from './Tweety';
import Choices from './Choices';
import { audioHelper } from '../utils/audioHelper';

/**
 * SceneRenderer - Displays story scenes with text, animations, and choices
 */
export default function SceneRenderer({ scene, onChoice, wins, requiredWins }) {
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Play audio when scene loads
  useEffect(() => {
    if (scene.audio) {
      audioHelper.play(scene.audio).then(() => {
        setAudioPlaying(true);
      });
    }

    return () => {
      audioHelper.stop();
      setAudioPlaying(false);
    };
  }, [scene.id, scene.audio]);

  // Handle choice selection
  const handleChoice = (nextSceneId) => {
    audioHelper.stop();
    onChoice(nextSceneId);
  };

  // Handle auto-advance if no choices
  useEffect(() => {
    if (!scene.choices || scene.choices.length === 0) {
      if (scene.nextSceneId) {
        const timer = setTimeout(() => {
          handleChoice(scene.nextSceneId);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [scene]);

  const backgroundStyle = scene.backgroundImage
    ? {
        backgroundImage: `url(${scene.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        background: 'linear-gradient(to bottom right, #FFD54F, #FFB3D9, #87CEEB)',
      };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Win counter badge */}
      {(wins !== undefined && requiredWins !== undefined) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 bg-white/90 rounded-full px-4 py-2 shadow-lg z-10"
        >
          <span className="text-tweety-yellow font-bold">
            Wins: {wins}/{requiredWins} 🏆
          </span>
        </motion.div>
      )}

      {/* Main content container */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Tweety Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center"
        >
          <Tweety
            animationPath={scene.lottieAnimation}
            className="w-full max-w-md h-auto animate-float"
          />
        </motion.div>

        {/* Story text and choices */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm"
        >
          {/* Story text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed whitespace-pre-line font-medium">
              {scene.text}
            </p>
          </motion.div>

          {/* Audio indicator */}
          {scene.audio && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 flex items-center gap-2 text-sm text-gray-600"
            >
              <span className={audioPlaying ? 'animate-pulse' : ''}>
                🔊 {audioPlaying ? 'Playing...' : 'Audio available'}
              </span>
            </motion.div>
          )}

          {/* Choices */}
          {scene.choices && scene.choices.length > 0 && (
            <Choices
              choices={scene.choices}
              onChoice={handleChoice}
            />
          )}

          {/* Auto-advance indicator */}
          {(!scene.choices || scene.choices.length === 0) && scene.nextSceneId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-4"
            >
              <p>Continuing automatically...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

