'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterLayer from './CharacterLayer';
import Choices from './Choices';
import MiniGamePlaceholder from './MiniGamePlaceholder';
import { audioHelper } from '../utils/audioHelper';

/**
 * CinematicScene - 2D layered cinematic interactive story scene
 * Features:
 * - Full-screen layered rendering (background, character, foreground)
 * - Parallax effects and subtle animations
 * - Dialogue system with character name
 * - Choice branching
 * - Mini-game integration
 * - Voice-over support
 * - Cinematic transitions
 */
export default function CinematicScene({
  scene,
  onChoice,
  onMiniGameComplete,
  className = '',
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const sceneRef = useRef(null);
  const dialogueRef = useRef(null);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const offsetX = (e.clientX - centerX) / rect.width;
      const offsetY = (e.clientY - centerY) / rect.height;
      
      setParallaxOffset({
        x: offsetX * 20, // Max 20px parallax
        y: offsetY * 20,
      });
    };

    if (scene?.parallaxEnabled !== false) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [scene]);

  // Handle dialogue progression
  useEffect(() => {
    if (!scene) return;

    const dialogues = scene.dialogue || [];
    if (dialogues.length === 0) {
      // If no dialogue array, check for mini-game or legacy text
      if (scene.miniGame) {
        // Mini-game scene - don't show choices
        setShowChoices(false);
      } else if (scene.text) {
        // Legacy text format - show choices
        setShowChoices(true);
      }
      return;
    }

    setCurrentDialogueIndex(0);
    // Don't show choices initially if there's dialogue
    setShowChoices(false);

    // Play first dialogue audio
    if (dialogues[0]?.audio) {
      audioHelper.play(dialogues[0].audio);
    } else if (scene.audio && dialogues.length === 1) {
      audioHelper.play(scene.audio);
    }
  }, [scene]);

  // Auto-advance dialogue
  useEffect(() => {
    if (!scene?.dialogue || scene.dialogue.length === 0) {
      // If no dialogue and has mini-game, show mini-game
      if (scene.miniGame) {
        setShowChoices(false);
      } else {
        setShowChoices(true);
      }
      return;
    }

    const currentDialogue = scene.dialogue[currentDialogueIndex];
    if (!currentDialogue) {
      // Dialogue finished - show mini-game if exists, otherwise show choices
      if (scene.miniGame) {
        setShowChoices(false);
      } else {
        setShowChoices(true);
      }
      return;
    }

    // Play audio for current dialogue
    if (currentDialogue.audio) {
      audioHelper.play(currentDialogue.audio);
    }

    // Auto-advance after delay (or wait for click)
    const autoAdvance = currentDialogue.autoAdvance !== false;
    const delay = currentDialogue.duration || 3000;

    if (autoAdvance && currentDialogueIndex < scene.dialogue.length - 1) {
      const timer = setTimeout(() => {
        setCurrentDialogueIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (currentDialogueIndex === scene.dialogue.length - 1) {
      // Last dialogue - show mini-game if exists, otherwise show choices
      if (scene.miniGame) {
        setShowChoices(false);
      } else {
        setShowChoices(true);
      }
    }
  }, [scene, currentDialogueIndex]);

  // Handle scene audio
  useEffect(() => {
    if (scene?.audio && (!scene.dialogue || scene.dialogue.length === 0)) {
      audioHelper.play(scene.audio, scene.audioLoop || false);
    }

    return () => {
      if (scene?.audio) {
        audioHelper.stop();
      }
    };
  }, [scene]);

  // Handle dialogue click to advance
  const handleDialogueClick = () => {
    if (!scene?.dialogue) return;

    if (currentDialogueIndex < scene.dialogue.length - 1) {
      setCurrentDialogueIndex((prev) => prev + 1);
    } else {
      // Dialogue finished - show mini-game if exists, otherwise show choices
      if (scene.miniGame) {
        setShowChoices(false);
      } else {
        setShowChoices(true);
      }
    }
  };

  // Handle choice selection
  const handleChoice = (nextSceneId) => {
    setIsTransitioning(true);
    audioHelper.stop();
    
    setTimeout(() => {
      onChoice(nextSceneId);
      setIsTransitioning(false);
    }, 500);
  };

  // Handle mini-game completion
  const handleMiniGameComplete = (result) => {
    if (onMiniGameComplete) {
      onMiniGameComplete(result);
    }
  };

  if (!scene) {
    return <div className="min-h-screen bg-gradient-to-br from-tweety-yellow via-tweety-pink to-tweety-sky-blue" />;
  }

  const currentDialogue = scene.dialogue?.[currentDialogueIndex];
  const dialogueText = currentDialogue?.text || scene.text || '';
  const characterName = currentDialogue?.character || scene.characterName || 'Tweety';

  // Determine if mini-game should be shown
  // Mini-game shows when scene has miniGame and:
  // - No dialogue exists, OR
  // - Dialogue is finished (all dialogues shown and not showing choices)
  const hasDialogue = scene.dialogue && scene.dialogue.length > 0;
  const dialogueFinished = hasDialogue && currentDialogueIndex >= scene.dialogue.length;
  const showMiniGame = scene.miniGame && (!hasDialogue || (dialogueFinished && !showChoices));

  return (
    <div
      ref={sceneRef}
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      {/* Scene Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>

      {/* Background Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          x: parallaxOffset.x * 0.3, // Slowest parallax for background
          y: parallaxOffset.y * 0.3,
        }}
        animate={{
          scale: scene.backgroundZoom ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {scene.backgroundImage ? (
          <img
            src={scene.backgroundImage}
            alt="Scene background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: scene.backgroundGradient ||
                'linear-gradient(135deg, #FFD54F 0%, #FFB3D9 50%, #87CEEB 100%)',
            }}
          />
        )}
        
        {/* Background overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </motion.div>

      {/* Foreground Props Layer */}
      {scene.foregroundProps && scene.foregroundProps.length > 0 && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {scene.foregroundProps.map((prop, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{
                ...prop.position,
                x: parallaxOffset.x * (prop.parallaxSpeed || 0.8),
                y: parallaxOffset.y * (prop.parallaxSpeed || 0.8),
              }}
              animate={prop.animation || {}}
              transition={prop.transition || { duration: 2, repeat: Infinity }}
            >
              {prop.image && (
                <img
                  src={prop.image}
                  alt={prop.alt || 'Foreground prop'}
                  className={prop.className || ''}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Character Layer */}
      {scene.character && !showMiniGame && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={{
            x: parallaxOffset.x * 0.5, // Medium parallax for character
            y: parallaxOffset.y * 0.5,
          }}
        >
          <CharacterLayer
            character={scene.character}
            animation={scene.characterAnimation}
            position={scene.characterPosition}
          />
        </motion.div>
      )}

      {/* Mini-Game Layer */}
      {showMiniGame && (
        <div className="absolute inset-0 z-30">
          <MiniGamePlaceholder
            miniGame={scene.miniGame}
            onComplete={handleMiniGameComplete}
          />
        </div>
      )}

      {/* Dialogue Box */}
      {!showMiniGame && dialogueText && (
        <motion.div
          ref={dialogueRef}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-0 left-0 right-0 z-40 p-4 md:p-8"
          onClick={handleDialogueClick}
        >
          <motion.div
            className="bg-black/80 backdrop-blur-md rounded-3xl p-6 md:p-8 max-w-4xl mx-auto border-2 border-tweety-yellow/50 shadow-2xl cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Character Name */}
            {characterName && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-tweety-yellow font-bold text-lg md:text-xl mb-2"
              >
                {characterName}
              </motion.div>
            )}

            {/* Dialogue Text */}
            <motion.p
              key={currentDialogueIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-white text-lg md:text-2xl leading-relaxed whitespace-pre-line"
            >
              {dialogueText}
            </motion.p>

            {/* Click to continue indicator */}
            {currentDialogueIndex < (scene.dialogue?.length || 1) - 1 && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-tweety-yellow text-right mt-4 text-sm"
              >
                Click to continue...
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Choices */}
      {showChoices && scene.choices && scene.choices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 z-40 p-4 md:p-8"
        >
          <div className="max-w-4xl mx-auto">
            <Choices choices={scene.choices} onChoice={handleChoice} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

