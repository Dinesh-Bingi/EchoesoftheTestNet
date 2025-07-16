import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Check, X, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useBlockchain } from '../hooks/useBlockchain';

const Puzzle: React.FC = () => {
  const { currentRound, solvePuzzle } = useGame();
  const { recordSequence } = useBlockchain();
  const [sequence, setSequence] = useState<number[]>([]);
  const [targetSequence, setTargetSequence] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Generate target sequence based on round
  useEffect(() => {
    const generateSequence = (round: number) => {
      const base = [1, 2, 3, 4];
      const variations = [
        [1, 3, 2, 4],
        [2, 1, 4, 3],
        [3, 4, 1, 2],
        [4, 2, 3, 1],
        [1, 4, 3, 2]
      ];
      return variations[round % variations.length];
    };

    setTargetSequence(generateSequence(currentRound));
    setSequence([]);
    setIsCorrect(null);
  }, [currentRound]);

  const addToSequence = (num: number) => {
    if (sequence.length < 4) {
      const newSequence = [...sequence, num];
      setSequence(newSequence);
      
      if (newSequence.length === 4) {
        checkSequence(newSequence);
      }
    }
  };

  const checkSequence = async (seq: number[]) => {
    const correct = JSON.stringify(seq) === JSON.stringify(targetSequence);
    setIsCorrect(correct);
    
    if (correct) {
      // Record successful sequence on blockchain
      await recordSequence(seq);
      setTimeout(() => {
        solvePuzzle();
      }, 1000);
    } else {
      // Reset after wrong answer
      setTimeout(() => {
        setSequence([]);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const clearSequence = () => {
    setSequence([]);
    setIsCorrect(null);
  };

  const getHint = () => {
    const hints = [
      "The pattern follows the Fibonacci sequence modulo 4",
      "Think about blockchain block numbers...",
      "Each ghost represents a failed attempt",
      "The answer lies in the smart contract's memory",
      "Mirror the movements, reverse the time"
    ];
    return hints[currentRound % hints.length];
  };

  return (
    <div className="bg-black/60 border border-yellow-500/30 rounded-lg p-4">
      <h3 className="text-yellow-400 font-semibold mb-3 flex items-center">
        <Brain className="mr-2" size={16} />
        Escape Sequence
      </h3>
      
      <div className="space-y-4">
        {/* Sequence Display */}
        <div className="flex space-x-2">
          {[0, 1, 2, 3].map(index => (
            <div
              key={index}
              className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-bold ${
                sequence[index] 
                  ? 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-gray-800/50 border-gray-600 text-gray-500'
              }`}
            >
              {sequence[index] || '?'}
            </div>
          ))}
        </div>

        {/* Input Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(num => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToSequence(num)}
              disabled={sequence.length >= 4}
              className={`p-3 rounded-lg font-semibold transition-colors ${
                sequence.includes(num)
                  ? 'bg-green-600/50 text-green-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {num}
            </motion.button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          <button
            onClick={clearSequence}
            className="flex-1 bg-red-600/50 hover:bg-red-600/70 text-red-400 py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex-1 bg-purple-600/50 hover:bg-purple-600/70 text-purple-400 py-2 rounded-lg transition-colors"
          >
            Hint
          </button>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3 text-sm text-purple-300"
            >
              💡 {getHint()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${
                isCorrect
                  ? 'bg-green-600/20 border border-green-500/50 text-green-400'
                  : 'bg-red-600/20 border border-red-500/50 text-red-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <Check size={20} />
                  <span>Sequence recorded on-chain!</span>
                </>
              ) : (
                <>
                  <X size={20} />
                  <span>Wrong sequence. Try again...</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Round Info */}
        <div className="text-xs text-gray-400 text-center">
          Round {currentRound} • {4 - sequence.length} digits remaining
        </div>
      </div>
    </div>
  );
};

export default Puzzle;