import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Zap, Target, Users } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useWallet } from '../contexts/WalletContext';
import Player from './Player';
import Ghost from './Ghost';
import Puzzle from './Puzzle';
import GameTimer from './GameTimer';
import { Position, PlayerAction } from '../types/game';

interface GameBoardProps {
  onBackToLobby: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onBackToLobby }) => {
  const { players, currentRound, gameState, recordAction } = useGame();
  const { address } = useWallet();
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 100, y: 100 });
  const [ghostPositions, setGhostPositions] = useState<Position[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [showGlitch, setShowGlitch] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const GAME_AREA_WIDTH = 600;
  const GAME_AREA_HEIGHT = 400;
  const PLAYER_SIZE = 30;
  const MOVE_SPEED = 5;

  useEffect(() => {
    // Reset position at start of new round
    setPlayerPosition({ x: 100, y: 100 });
    setRoundStartTime(Date.now());
    
    // Load ghost positions from previous rounds
    const currentPlayer = players.find(p => p.address === address);
    if (currentPlayer && currentPlayer.pastActions.length > 0) {
      const lastRoundActions = currentPlayer.pastActions[currentPlayer.pastActions.length - 1];
      const ghostTrail = lastRoundActions.map(action => action.position);
      setGhostPositions(ghostTrail);
    }
  }, [currentRound, players, address]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      let newPosition = { ...playerPosition };
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          newPosition.y = Math.max(0, newPosition.y - MOVE_SPEED);
          break;
        case 'ArrowDown':
        case 's':
          newPosition.y = Math.min(GAME_AREA_HEIGHT - PLAYER_SIZE, newPosition.y + MOVE_SPEED);
          break;
        case 'ArrowLeft':
        case 'a':
          newPosition.x = Math.max(0, newPosition.x - MOVE_SPEED);
          break;
        case 'ArrowRight':
        case 'd':
          newPosition.x = Math.min(GAME_AREA_WIDTH - PLAYER_SIZE, newPosition.x + MOVE_SPEED);
          break;
      }

      if (newPosition.x !== playerPosition.x || newPosition.y !== playerPosition.y) {
        setPlayerPosition(newPosition);
        
        // Record action for blockchain
        const action: PlayerAction = {
          type: 'move',
          position: newPosition,
          timestamp: Date.now() - roundStartTime
        };
        recordAction(action);

        // Check collision with ghosts
        const collision = ghostPositions.some(ghostPos => {
          const distance = Math.sqrt(
            Math.pow(newPosition.x - ghostPos.x, 2) + 
            Math.pow(newPosition.y - ghostPos.y, 2)
          );
          return distance < PLAYER_SIZE;
        });

        if (collision) {
          triggerGlitch();
          resetPlayerPosition();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition, ghostPositions, gameState, roundStartTime]);

  const triggerGlitch = () => {
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 500);
  };

  const resetPlayerPosition = () => {
    setPlayerPosition({ x: 100, y: 100 });
    const resetAction: PlayerAction = {
      type: 'reset',
      position: { x: 100, y: 100 },
      timestamp: Date.now() - roundStartTime
    };
    recordAction(resetAction);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToLobby}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Lobby</span>
          </motion.button>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-purple-400">
              <Users size={20} />
              <span>{players.length} Players</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Target size={20} />
              <span>Round {currentRound}</span>
            </div>
            <GameTimer />
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              ref={gameAreaRef}
              className="relative bg-black/90 border-2 border-green-500/50 rounded-lg overflow-hidden"
              style={{ width: GAME_AREA_WIDTH, height: GAME_AREA_HEIGHT }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-12 grid-rows-8 h-full">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="border border-green-500/20"></div>
                  ))}
                </div>
              </div>

              {/* Ghosts */}
              <AnimatePresence>
                {ghostPositions.map((ghostPos, index) => (
                  <Ghost
                    key={`ghost-${index}`}
                    position={ghostPos}
                    delay={index * 0.1}
                  />
                ))}
              </AnimatePresence>

              {/* Player */}
              <Player
                position={playerPosition}
                isCurrentPlayer={true}
                playerId={address || ''}
              />

              {/* Other Players */}
              {players
                .filter(p => p.address !== address)
                .map(player => (
                  <Player
                    key={player.id}
                    position={player.position}
                    isCurrentPlayer={false}
                    playerId={player.address}
                  />
                ))}

              {/* Glitch Effect */}
              <AnimatePresence>
                {showGlitch && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-red-500/20 mix-blend-multiply pointer-events-none"
                  >
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Controls */}
            <div className="mt-4 text-center text-sm text-gray-400">
              Use WASD or arrow keys to move • Avoid your past echoes
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Puzzle />
            
            {/* Players List */}
            <div className="bg-black/60 border border-purple-500/30 rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold mb-3 flex items-center">
                <Users className="mr-2" size={16} />
                Players
              </h3>
              <div className="space-y-2">
                {players.map(player => (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between text-sm p-2 rounded ${
                      player.address === address 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-800/50 text-gray-300'
                    }`}
                  >
                    <span>
                      {player.address.slice(0, 6)}...{player.address.slice(-4)}
                    </span>
                    <span className="text-xs">
                      {player.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Round Info */}
            <div className="bg-black/60 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                <Zap className="mr-2" size={16} />
                Round {currentRound}
              </h3>
              <div className="text-sm text-gray-300 space-y-1">
                <div>Ghosts: {ghostPositions.length}</div>
                <div>Actions recorded: {/* Add action count */}</div>
                <div className="text-yellow-400">
                  Solve the puzzle to escape!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;