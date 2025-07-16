import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle } from 'lucide-react';

const GameTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Reset timer for next round
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsWarning(timeLeft <= 10);
  }, [timeLeft]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <svg width="50" height="50" className="transform -rotate-90">
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="rgb(75, 85, 99)"
            strokeWidth="3"
          />
          <motion.circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke={isWarning ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"}
            strokeWidth="3"
            strokeLinecap="round"
            style={{
              strokeDasharray,
              strokeDashoffset
            }}
            animate={{
              strokeDashoffset,
              stroke: isWarning ? "rgb(239, 68, 68)" : "rgb(34, 197, 94)"
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${isWarning ? 'text-red-400' : 'text-green-400'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
      
      <div className="text-sm">
        <div className={`flex items-center space-x-1 ${isWarning ? 'text-red-400' : 'text-green-400'}`}>
          {isWarning ? <AlertTriangle size={16} /> : <Clock size={16} />}
          <span>Time Left</span>
        </div>
        <div className="text-xs text-gray-400">
          {isWarning ? 'Hurry up!' : 'Solve the puzzle'}
        </div>
      </div>
    </div>
  );
};

export default GameTimer;