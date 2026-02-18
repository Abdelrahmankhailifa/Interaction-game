'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SceneRenderer from './SceneRenderer';
import CatchHearts from './MiniGames/CatchHearts';
import SimplePuzzle from './MiniGames/SimplePuzzle';
import MatchPairs from './MiniGames/MatchPairs';
import GiftScreen from './GiftScreen';
import { SCENE_TYPES, GAME_TYPES } from '../utils/constants';
import { audioHelper } from '../utils/audioHelper';

/**
 * StoryEngine - Main orchestrator component
 * Manages story state, scene navigation, and win tracking
 */
export default function StoryEngine() {
  const [storyData, setStoryData] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [currentScene, setCurrentScene] = useState(null);
  const [wins, setWins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState(null); // For mini-game state

  // Load story data
  useEffect(() => {
    const loadStory = async () => {
      try {
        const response = await fetch('/story/story.json');
        const data = await response.json();
        setStoryData(data);
        setCurrentSceneId(data.startSceneId);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load story:', error);
        setIsLoading(false);
      }
    };

    loadStory();
  }, []);

  // Update current scene when sceneId changes
  useEffect(() => {
    if (storyData && currentSceneId) {
      const scene = storyData.scenes[currentSceneId];
      if (scene) {
        setCurrentScene(scene);
        
        // Preload audio if available
        if (scene.audio) {
          audioHelper.preload(scene.audio);
        }
      }
    }
  }, [storyData, currentSceneId]);

  // Handle scene navigation
  const navigateToScene = (sceneId) => {
    if (!storyData || !sceneId) return;

    // Stop current audio
    audioHelper.stop();

    // Check if this scene awards a win
    const scene = storyData.scenes[sceneId];
    if (scene && scene.awardsWin) {
      setWins((prev) => prev + 1);
    }

    setCurrentSceneId(sceneId);
    setGameState(null);
  };

  // Handle choice selection
  const handleChoice = (nextSceneId) => {
    navigateToScene(nextSceneId);
  };

  // Handle mini-game completion
  const handleGameComplete = (won) => {
    if (!currentScene) return;

    const nextSceneId = won ? currentScene.winSceneId : currentScene.loseSceneId;
    navigateToScene(nextSceneId);
  };

  // Handle gift check
  const handleGiftCheck = () => {
    if (!storyData) return;

    const requiredWins = storyData.requiredWins || 2;
    if (wins >= requiredWins) {
      navigateToScene('gift_unlocked');
    } else {
      navigateToScene('gift_locked');
    }
  };

  // Gift check screen component
  const GiftCheckScreen = ({ onCheck }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onCheck();
      }, 1000);
      return () => clearTimeout(timer);
    }, [onCheck]);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-tweety-yellow to-tweety-pink">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl text-white font-bold"
        >
          Checking...
        </motion.div>
      </div>
    );
  };

  // Render based on scene type
  const renderScene = () => {
    if (!currentScene) return null;

    switch (currentScene.type) {
      case SCENE_TYPES.STORY:
        return (
          <SceneRenderer
            scene={currentScene}
            onChoice={handleChoice}
            wins={wins}
            requiredWins={storyData?.requiredWins || 2}
          />
        );

      case SCENE_TYPES.MINIGAME:
        return renderMiniGame();

      case SCENE_TYPES.GIFT:
        if (currentScene.id === 'gift_check') {
          return <GiftCheckScreen onCheck={handleGiftCheck} />;
        }
        return (
          <GiftScreen
            scene={currentScene}
            wins={wins}
            requiredWins={storyData?.requiredWins || 2}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p>Unknown scene type: {currentScene.type}</p>
          </div>
        );
    }
  };

  // Render appropriate mini-game
  const renderMiniGame = () => {
    if (!currentScene) return null;

    const { gameType } = currentScene;

    switch (gameType) {
      case GAME_TYPES.CATCH_HEARTS:
        return (
          <CatchHearts
            scene={currentScene}
            onComplete={handleGameComplete}
          />
        );

      case GAME_TYPES.SIMPLE_PUZZLE:
        return (
          <SimplePuzzle
            scene={currentScene}
            onComplete={handleGameComplete}
          />
        );

      case GAME_TYPES.MATCH_PAIRS:
        return (
          <MatchPairs
            scene={currentScene}
            onComplete={handleGameComplete}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p>Unknown game type: {gameType}</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-tweety-yellow to-tweety-pink">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSceneId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {renderScene()}
      </motion.div>
    </AnimatePresence>
  );
}

