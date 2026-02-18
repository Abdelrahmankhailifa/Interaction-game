'use client';

/**
 * CinematicSceneExample - Example usage of CinematicScene component
 * 
 * This is a demo component showing how to integrate CinematicScene
 * into your application. You can use this as a reference.
 */

import { useState } from 'react';
import CinematicScene from './CinematicScene';

export default function CinematicSceneExample() {
  const [currentSceneId, setCurrentSceneId] = useState('demo_scene_1');

  // Demo scene data
  const scenes = {
    demo_scene_1: {
      id: 'demo_scene_1',
      type: 'cinematic',
      title: "Tweety's Magical Garden",
      
      backgroundGradient: 'linear-gradient(135deg, #FFD54F 0%, #FFB3D9 50%, #87CEEB 100%)',
      backgroundZoom: true,
      parallaxEnabled: true,
      
      character: {
        lottieAnimation: '/assets/lottie/tweety-welcome.json',
      },
      
      characterPosition: {
        x: '50%',
        y: '45%',
      },
      
      dialogue: [
        {
          character: 'Tweety',
          text: "Welcome to my magical garden! 🌸✨\n\nIt's so beautiful here, don't you think?",
          duration: 4000,
          autoAdvance: true,
        },
        {
          character: 'Tweety',
          text: "I've been waiting for you! There's something special I want to show you...",
          duration: 3500,
          autoAdvance: true,
        },
        {
          character: 'Tweety',
          text: 'But first, let\'s play a little game! Are you ready?',
          duration: 3000,
          autoAdvance: false,
        },
      ],
      
      choices: [
        {
          text: "Yes! Let's play!",
          nextSceneId: 'demo_scene_minigame',
        },
        {
          text: 'Tell me more about this place first',
          nextSceneId: 'demo_scene_2',
        },
      ],
    },
    
    demo_scene_2: {
      id: 'demo_scene_2',
      type: 'cinematic',
      title: 'Exploring the Garden',
      
      backgroundGradient: 'linear-gradient(135deg, #87CEEB 0%, #FFD54F 50%, #FFB3D9 100%)',
      
      character: {
        lottieAnimation: '/assets/lottie/tweety-curious.json',
      },
      
      dialogue: [
        {
          character: 'Tweety',
          text: 'This garden is full of magical flowers that bloom all year round! 🌺',
          duration: 4000,
          autoAdvance: true,
        },
        {
          character: 'Tweety',
          text: 'Each flower has its own story. Would you like to hear one?',
          duration: 3500,
          autoAdvance: false,
        },
      ],
      
      choices: [
        {
          text: 'Yes, tell me a story!',
          nextSceneId: 'demo_scene_1',
        },
        {
          text: 'Go back',
          nextSceneId: 'demo_scene_1',
        },
      ],
    },
    
    demo_scene_minigame: {
      id: 'demo_scene_minigame',
      type: 'cinematic',
      title: 'Mini-Game Time!',
      
      backgroundGradient: 'linear-gradient(135deg, #FFB3D9 0%, #FFD54F 50%, #87CEEB 100%)',
      
      miniGame: {
        title: 'Catch the Falling Stars',
        description: 'Click the stars as they fall!',
        instructions: 'Click the button to score points. Reach 10 points to win!',
        buttonText: '⭐ Click Me! ⭐',
        targetScore: 10,
        duration: 30,
      },
    },
  };

  const handleChoice = (nextSceneId) => {
    console.log('Navigating to:', nextSceneId);
    setCurrentSceneId(nextSceneId);
  };

  const handleMiniGameComplete = (result) => {
    console.log('Mini-game completed:', result);
    // Navigate based on result
    if (result.won) {
      setCurrentSceneId('demo_scene_1');
    } else {
      setCurrentSceneId('demo_scene_1');
    }
  };

  const currentScene = scenes[currentSceneId];

  if (!currentScene) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tweety-yellow via-tweety-pink to-tweety-sky-blue flex items-center justify-center">
        <p className="text-2xl text-white">Scene not found!</p>
      </div>
    );
  }

  return (
    <CinematicScene
      scene={currentScene}
      onChoice={handleChoice}
      onMiniGameComplete={handleMiniGameComplete}
    />
  );
}

