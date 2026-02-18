'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tweety from '../Tweety';

/**
 * MatchPairs - Memory card matching game
 */
export default function MatchPairs({ scene, onComplete }) {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  // Card symbols/emojis for matching
  const cardSymbols = ['🐦', '💕', '⭐', '🎈', '🎁', '🌈', '✨', '🎵'];
  const totalPairs = 8;

  // Initialize cards
  const initializeGame = () => {
    const cardPairs = [];
    for (let i = 0; i < totalPairs; i++) {
      cardPairs.push(
        { id: `card-${i}-1`, symbol: cardSymbols[i], pairId: i },
        { id: `card-${i}-2`, symbol: cardSymbols[i], pairId: i }
      );
    }

    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  // Handle card flip
  const handleCardFlip = (cardId) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId) || gameWon) {
      return;
    }

    const card = cards.find((c) => c.id === cardId);
    if (matchedPairs.includes(card.pairId)) {
      return; // Already matched
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    setMoves((prev) => prev + 1);

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        // Match found!
        setMatchedPairs((prev) => [...prev, firstCard.pairId]);
        setFlippedCards([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check win condition
  useEffect(() => {
    if (gameStarted && matchedPairs.length === totalPairs) {
      setGameWon(true);
      setTimeout(() => {
        onComplete(true);
      }, 2000);
    }
  }, [matchedPairs.length, totalPairs, gameStarted, onComplete]);

  const backgroundStyle = scene.backgroundImage
    ? {
        backgroundImage: `url(${scene.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(to bottom, #FFB3D9, #87CEEB)',
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
            {scene.text || 'Match the Pairs!'}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Flip cards to find matching pairs!<br />
            Match all {totalPairs} pairs to win!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializeGame}
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
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={backgroundStyle}
    >
      {/* Game Stats */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg">
          <span className="text-2xl font-bold text-tweety-yellow">
            🎯 Matches: {matchedPairs.length}/{totalPairs}
          </span>
        </div>
        <div className="bg-white/90 rounded-full px-6 py-3 shadow-lg">
          <span className="text-2xl font-bold text-tweety-sky-blue">
            🔄 Moves: {moves}
          </span>
        </div>
      </div>

      {/* Card Grid */}
      <div className="bg-white/95 rounded-3xl p-8 shadow-2xl max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Match the Pairs!
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => {
            const isFlipped = flippedCards.includes(card.id);
            const isMatched = matchedPairs.includes(card.pairId);

            return (
              <motion.div
                key={card.id}
                onClick={() => handleCardFlip(card.id)}
                className={`
                  aspect-square rounded-xl cursor-pointer flex items-center justify-center text-5xl
                  ${isMatched ? 'bg-green-200' : isFlipped ? 'bg-tweety-yellow' : 'bg-tweety-sky-blue'}
                  border-4 ${isMatched ? 'border-green-400' : 'border-white'}
                  shadow-lg
                `}
                whileHover={{ scale: isMatched ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateY: isFlipped || isMatched ? 0 : 180,
                }}
                transition={{ duration: 0.3 }}
              >
                {isFlipped || isMatched ? (
                  <span>{card.symbol}</span>
                ) : (
                  <span className="text-4xl">❓</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Win Overlay */}
      {gameWon && (
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
            <h2 className="text-4xl font-bold mb-4">🎉 You Won! 🎉</h2>
            <p className="text-xl text-gray-600 mb-2">
              You matched all pairs!
            </p>
            <p className="text-lg text-gray-500">Moves: {moves}</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

