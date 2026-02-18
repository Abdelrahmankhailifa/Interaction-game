'use client';

import { motion } from 'framer-motion';

/**
 * Choices - Renders interactive choice buttons
 */
export default function Choices({ choices, onChoice }) {
  const handleClick = (nextSceneId) => {
    onChoice(nextSceneId);
  };

  return (
    <div className="space-y-4 mt-6">
      {choices.map((choice, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick(choice.nextSceneId)}
          className="w-full bg-gradient-to-r from-tweety-yellow to-tweety-pink text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg md:text-xl border-2 border-white/50 hover:border-white"
        >
          {choice.text}
        </motion.button>
      ))}
    </div>
  );
}

