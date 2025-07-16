import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameLobby from './components/GameLobby';
import GameBoard from './components/GameBoard';
import WalletConnection from './components/WalletConnection';
import { GameProvider } from './contexts/GameContext';
import { WalletProvider } from './contexts/WalletContext';
import GlitchEffect from './components/GlitchEffect';
import './styles/animations.css';

function App() {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'connecting'>('connecting');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
      setGameState('lobby');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-8">
            <div className="text-6xl font-bold text-green-400 mb-4 glitch-text">
              ECHOES
            </div>
            <div className="text-2xl text-purple-300 mb-8">
              OF THE TESTNET
            </div>
            <div className="loading-spinner"></div>
          </div>
          <div className="text-sm text-gray-400">
            Connecting to the haunted blockchain...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <WalletProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
          <GlitchEffect />
          
          <AnimatePresence mode="wait">
            {gameState === 'lobby' && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <GameLobby onStartGame={() => setGameState('playing')} />
              </motion.div>
            )}
            
            {gameState === 'playing' && (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <GameBoard onBackToLobby={() => setGameState('lobby')} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <WalletConnection />
        </div>
      </GameProvider>
    </WalletProvider>
  );
}

export default App;