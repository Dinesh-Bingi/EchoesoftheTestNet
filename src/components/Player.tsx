import React from 'react';
import { motion } from 'framer-motion';
import { Position } from '../types/game';

interface PlayerProps {
  position: Position;
  isCurrentPlayer: boolean;
  playerId: string;
}

const Player: React.FC<PlayerProps> = ({ position, isCurrentPlayer, playerId }) => {
  const colors = {
    current: 'bg-green-400',
    other: 'bg-blue-400'
  };

  return (
    <motion.div
      className={`absolute w-7 h-7 rounded-full ${
        isCurrentPlayer ? colors.current : colors.other
      } shadow-lg border-2 border-white/50`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: 10
      }}
      animate={{
        left: position.x,
        top: position.y,
        boxShadow: isCurrentPlayer 
          ? ['0 0 10px #00ff41', '0 0 20px #00ff41', '0 0 10px #00ff41']
          : ['0 0 10px #3b82f6', '0 0 20px #3b82f6', '0 0 10px #3b82f6']
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      {/* Player ID indicator */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap">
        {isCurrentPlayer ? 'YOU' : `${playerId.slice(0, 4)}...`}
      </div>
    </motion.div>
  );
};

export default Player;