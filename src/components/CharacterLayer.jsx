'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * CharacterLayer - Renders a 2D layered character with separate parts
 * Supports:
 * - Layered body parts (head, body, arms, eyes)
 * - Blinking animations
 * - Gesture animations
 * - Small movements and breathing effects
 * - Depth positioning for cinematic effect
 */
export default function CharacterLayer({
  character = {},
  animation = {},
  position = { x: '50%', y: '50%' },
}) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [gestureState, setGestureState] = useState('idle');

  // Default character structure if not provided
  const characterParts = character.parts || {
    head: {
      image: '/assets/char/tweety-head.png',
      offset: { x: 0, y: -80 },
      zIndex: 3,
    },
    body: {
      image: '/assets/char/tweety-body.png',
      offset: { x: 0, y: 0 },
      zIndex: 2,
    },
    leftArm: {
      image: '/assets/char/tweety-arm-left.png',
      offset: { x: -40, y: 20 },
      zIndex: 1,
    },
    rightArm: {
      image: '/assets/char/tweety-arm-right.png',
      offset: { x: 40, y: 20 },
      zIndex: 1,
    },
    eyes: {
      image: '/assets/char/tweety-eyes.png',
      offset: { x: 0, y: -60 },
      zIndex: 4,
    },
  };

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds

    return () => clearInterval(blinkInterval);
  }, []);

  // Gesture animations
  useEffect(() => {
    if (!animation.gestures) return;

    const gestureInterval = setInterval(() => {
      const gestures = animation.gestures || ['idle', 'wave', 'point'];
      const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
      setGestureState(randomGesture);
      
      // Return to idle after gesture
      setTimeout(() => setGestureState('idle'), 2000);
    }, 5000 + Math.random() * 3000);

    return () => clearInterval(gestureInterval);
  }, [animation.gestures]);

  // Get animation variants for each part
  const getPartAnimation = (partName) => {
    const baseAnimation = {
      idle: {
        y: [0, -5, 0],
        rotate: [0, 1, -1, 0],
      },
      breathing: {
        scale: [1, 1.02, 1],
      },
    };

    // Gesture-specific animations
    const gestureAnimations = {
      wave: {
        leftArm: {
          rotate: [0, 20, -20, 20, 0],
          x: [0, 10, -10, 10, 0],
        },
        rightArm: {
          rotate: [0, -20, 20, -20, 0],
          x: [0, -10, 10, -10, 0],
        },
      },
      point: {
        rightArm: {
          rotate: [0, -30],
          x: [0, 15],
        },
      },
      excited: {
        head: {
          y: [0, -10, 0],
          scale: [1, 1.1, 1],
        },
        body: {
          y: [0, -5, 0],
        },
      },
    };

    const partAnimation = { ...baseAnimation.breathing };
    
    if (gestureState !== 'idle' && gestureAnimations[gestureState]?.[partName]) {
      Object.assign(partAnimation, gestureAnimations[gestureState][partName]);
    }

    return partAnimation;
  };

  // Render a character part
  const renderPart = (partName, partConfig) => {
    if (!partConfig || !partConfig.image) return null;

    const partAnimation = getPartAnimation(partName);
    const isEyes = partName === 'eyes';

    return (
      <motion.div
        key={partName}
        className="absolute"
        style={{
          left: `calc(${position.x} + ${partConfig.offset?.x || 0}px)`,
          top: `calc(${position.y} + ${partConfig.offset?.y || 0}px)`,
          transform: 'translate(-50%, -50%)',
          zIndex: partConfig.zIndex || 1,
        }}
        animate={
          isEyes && isBlinking
            ? { scaleY: [1, 0.1, 1] }
            : partAnimation
        }
        transition={
          isEyes && isBlinking
            ? { duration: 0.15 }
            : {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <img
          src={partConfig.image}
          alt={`${partName} part`}
          className="max-w-full h-auto"
          style={{
            filter: partConfig.filter || 'none',
            opacity: partConfig.opacity || 1,
          }}
        />
      </motion.div>
    );
  };

  // Render using Lottie if provided
  if (character.lottieAnimation) {
    return (
      <motion.div
        className="absolute"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
        }}
        animate={animation.movement || {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={character.lottieAnimation}
          alt="Character animation"
          className="w-64 h-64 md:w-96 md:h-96"
        />
      </motion.div>
    );
  }

  // Render layered parts
  return (
    <div
      className="relative"
      style={{
        width: character.width || '400px',
        height: character.height || '400px',
      }}
    >
      {/* Render parts in z-index order */}
      {Object.entries(characterParts)
        .sort(([, a], [, b]) => (a.zIndex || 0) - (b.zIndex || 0))
        .map(([partName, partConfig]) => renderPart(partName, partConfig))}
    </div>
  );
}

