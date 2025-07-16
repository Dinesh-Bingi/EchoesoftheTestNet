import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, GameState, PlayerAction } from '../types/game';
import { useWallet } from './WalletContext';

interface GameContextType {
  players: Player[];
  currentRound: number;
  gameState: GameState;
  isHost: boolean;
  createRoom: () => Promise<void>;
  joinRoom: (roomCode: string) => Promise<void>;
  recordAction: (action: PlayerAction) => void;
  solvePuzzle: () => void;
  startGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useWallet();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState<string>('');

  const createRoom = async () => {
    if (!address) return;
    
    const newRoomCode = Math.random().toString(36).substr(2, 6).toUpperCase();
    setRoomCode(newRoomCode);
    setIsHost(true);
    
    const hostPlayer: Player = {
      id: `player-${Date.now()}`,
      address,
      position: { x: 100, y: 100 },
      score: 0,
      isHost: true,
      pastActions: []
    };
    
    setPlayers([hostPlayer]);
    setGameState('lobby');
  };

  const joinRoom = async (code: string) => {
    if (!address) return;
    
    // Simulate joining room
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      address,
      position: { x: 150, y: 150 },
      score: 0,
      isHost: false,
      pastActions: []
    };
    
    setPlayers(prev => [...prev, newPlayer]);
    setRoomCode(code);
    setGameState('lobby');
  };

  const recordAction = (action: PlayerAction) => {
    setPlayers(prev => 
      prev.map(player => 
        player.address === address
          ? {
              ...player,
              position: action.position,
              pastActions: [
                ...player.pastActions.slice(0, currentRound - 1),
                [
                  ...(player.pastActions[currentRound - 1] || []),
                  action
                ]
              ]
            }
          : player
      )
    );
  };

  const solvePuzzle = () => {
    setPlayers(prev => 
      prev.map(player => 
        player.address === address
          ? { ...player, score: player.score + 100 }
          : player
      )
    );
    
    // Advance to next round
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
    }, 1000);
  };

  const startGame = () => {
    console.log('GameContext: Starting game with', players.length, 'players');
    setGameState('playing');
  };
  return (
    <GameContext.Provider value={{
      players,
      currentRound,
      gameState,
      isHost,
      createRoom,
      joinRoom,
      recordAction,
      solvePuzzle,
      startGame
    }}>
      {children}
    </GameContext.Provider>
  );
};