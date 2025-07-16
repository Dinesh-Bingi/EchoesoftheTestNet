import React from 'react';
import { motion } from 'framer-motion';
import { Position } from '../types/game';

interface GhostProps {
  position: Position;
  delay?: number;
}

const Ghost: React.FC<GhostProps> = ({ position, delay = 0 }) => {
  return (
    <motion.div
      className="absolute w-7 h-7 rounded-full bg-purple-400/40 border-2 border-purple-300/60"
      style={{
        left: position.x,
        top: position.y,
        zIndex: 5
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        scale: [0.8, 1.2, 0.8],
        boxShadow: [
          '0 0 10px rgba(168, 85, 247, 0.4)',
          '0 0 20px rgba(168, 85, 247, 0.6)',
          '0 0 10px rgba(168, 85, 247, 0.4)'
        ]
      }}
      transition={{
        delay,
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Ghost particles */}
      <div className="absolute inset-0 rounded-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-300/60 rounded-full"
            style={{
              left: Math.random() * 20 + 'px',
              top: Math.random() * 20 + 'px'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [-10, -20, -30]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3 + delay
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Ghost;