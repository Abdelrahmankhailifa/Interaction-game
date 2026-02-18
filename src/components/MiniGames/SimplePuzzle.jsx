'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tweety from '../Tweety';

/**
 * SimplePuzzle - Drag and drop puzzle mini-game
 */
export default function SimplePuzzle({ scene, onComplete }) {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Initialize puzzle (3x3 grid)
  const initializePuzzle = () => {
    const totalPieces = 9;
    const shuffled = Array.from({ length: totalPieces }, (_, i) => ({
      id: i,
      correctPosition: i,
      currentPosition: i,
      image: `/assets/img/puzzle/piece-${i}.jpg`, // Placeholder path
    }));

    // Shuffle pieces
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setPieces(shuffled);
    setGameStarted(true);
    setGameWon(false);
    setTimeLeft(60);
  };

  // Check if puzzle is solved
  useEffect(() => {
    if (gameStarted && pieces.length > 0) {
      const solved = pieces.every(
        (piece) => piece.currentPosition === piece.correctPosition
      );
      if (solved) {
        setGameWon(true);
        setTimeout(() => {
          onComplete(true);
        }, 1500);
      }
    }
  }, [pieces, gameStarted, onComplete]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameWon(true);
          setTimeout(() => {
            onComplete(false);
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameWon, onComplete]);

  // Handle piece click
  const handlePieceClick = (piece) => {
    if (gameWon) return;

    if (!selectedPiece) {
      setSelectedPiece(piece);
    } else {
      // Swap pieces
      if (selectedPiece.id !== piece.id) {
        setPieces((prev) =>
          prev.map((p) => {
            if (p.id === selectedPiece.id) {
              return { ...p, currentPosition: piece.currentPosition };
            }
            if (p.id === piece.id) {
              return { ...p, currentPosition: selectedPiece.currentPosition };
            }
            return p;
          })
        );
      }
      setSelectedPiece(null);
    }
  };

  const backgroundStyle = scene.backgroundImage
    ? {
        backgroundImage: `url(${scene.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(to bottom, #FFD54F, #FFB3D9)',
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
            {scene.text || 'Solve the Puzzle!'}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Click on pieces to swap them and solve the puzzle!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initializePuzzle}
            className="bg-gradient-to-r from-tweety-yellow to-tweety-pink text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg"
          >
            Start Puzzle!
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
      {/* Timer */}
      <div className="absolute top-4 right-4 bg-white/90 rounded-full px-6 py-3 shadow-lg z-20">
        <span className="text-2xl font-bold text-tweety-sky-blue">
          ⏱️ {timeLeft}s
        </span>
      </div>

      {/* Puzzle Grid */}
      <div className="bg-white/95 rounded-3xl p-8 shadow-2xl max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Solve the Puzzle!
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {pieces.map((piece) => {
            const isSelected = selectedPiece?.id === piece.id;
            const isCorrect = piece.currentPosition === piece.correctPosition;

            return (
              <motion.div
                key={piece.id}
                onClick={() => handlePieceClick(piece)}
                className={`
                  aspect-square border-4 rounded-lg cursor-pointer flex items-center justify-center text-4xl
                  ${isSelected ? 'border-tweety-yellow shadow-lg scale-105' : 'border-gray-300'}
                  ${isCorrect ? 'bg-green-100' : 'bg-gray-100'}
                  hover:scale-105 transition-transform
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Placeholder: Show piece number or image */}
                <span className="text-3xl font-bold text-gray-600">
                  {piece.correctPosition + 1}
                </span>
                {/* TODO: Replace with actual image when available
                <img
                  src={piece.image}
                  alt={`Piece ${piece.id}`}
                  className="w-full h-full object-cover rounded"
                />
                */}
              </motion.div>
            );
          })}
        </div>

        {/* Instructions */}
        <p className="text-center mt-6 text-gray-600">
          {selectedPiece
            ? 'Click another piece to swap'
            : 'Click a piece to select it'}
        </p>
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
            <h2 className="text-4xl font-bold mb-4">
              {pieces.every((p) => p.currentPosition === p.correctPosition)
                ? '🎉 Puzzle Solved! 🎉'
                : '⏰ Time\'s Up!'}
            </h2>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

