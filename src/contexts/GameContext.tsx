import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, GameState, PlayerAction } from '../types/game';
import { useWallet } from './WalletContext';
import { useBlockchain } from '../hooks/useBlockchain';
import { multisynqService } from '../services/MultisynqService';
import { monadService } from '../services/MonadTestnetService';

interface GameContextType {
  players: Player[];
  currentRound: number;
  gameState: GameState;
  isHost: boolean;
  hasWon: boolean;
  rewardAmount: number;
  createRoom: () => Promise<void>;
  joinRoom: (roomCode: string) => Promise<void>;
  recordAction: (action: PlayerAction) => void;
  solvePuzzle: () => void;
  startGame: () => void;
  claimReward: () => Promise<void>;
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
  const { sendReward } = useBlockchain();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const [hasWon, setHasWon] = useState(false);
  const [rewardAmount] = useState(25); // $25 USD per puzzle solved

  const createRoom = async () => {
    console.log('🏠 GameContext: createRoom function called');
    console.log('📊 Current players before create:', players);
    console.log('🆔 Address from wallet:', address);
    
    // Create guest ID if no wallet connected
    const playerAddress = address || `guest-${Math.random().toString(36).substr(2, 8)}`;
    console.log('🆔 Generated player address:', playerAddress);
    
    // Create Multisynq room for real-time multiplayer
    const newRoomCode = await multisynqService.createRoom(playerAddress);
    console.log('🔑 Generated room code:', newRoomCode);
    setRoomCode(newRoomCode);
    setIsHost(true); // Guest becomes host of their own room
    console.log('👑 Set as host: true');
    
    const hostPlayer: Player = {
      id: `player-${Date.now()}`,
      address: playerAddress,
      position: { x: 100, y: 100 },
      score: 0,
      isHost: true,
      pastActions: []
    };
    
    console.log('👤 Created host player:', hostPlayer);
    console.log('🔄 Setting players state...');
    setPlayers([hostPlayer]);
    console.log('🎮 Setting game state to lobby...');
    setGameState('lobby');
    console.log('✅ GameContext: Room created successfully');
    console.log('📊 Final state:', { playersLength: 1, gameState: 'lobby', isHost: true });
  };

  const joinRoom = async (code: string) => {
    // Allow joining without wallet connection
    const playerAddress = address || `guest-${Date.now()}`;
    
    // Join Multisynq room
    await multisynqService.joinRoom(code, playerAddress);
    
    // Simulate joining room
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      address: playerAddress,
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
    const playerAddress = address || `guest-${Date.now()}`;
    
    // Sync with Multisynq for real-time multiplayer
    multisynqService.syncPlayerMovement(action.position, action);
    
    setPlayers(prev => 
      prev.map(player => 
        player.address === playerAddress || player.address.startsWith('guest-')
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
    const playerAddress = address || players.find(p => p.isHost)?.address || '';
    
    // Record on Monad Testnet blockchain
    if (address) {
      monadService.recordPlayerAction(address, [1, 2, 3, 4], currentRound);
      multisynqService.syncPuzzleSolution([1, 2, 3, 4], currentRound);
    }
    
    setPlayers(prev => 
      prev.map(player => 
        player.address === playerAddress || player.address.startsWith('guest-')
          ? { ...player, score: player.score + 1000 }
          : player
      )
    );
    
    // Check if player has won (completed 5 rounds or reached high score)
    const currentPlayer = players.find(p => p.address === playerAddress || p.address.startsWith('guest-'));
    if (currentPlayer && (currentRound >= 5 || currentPlayer.score >= 5000)) {
      setHasWon(true);
      setGameState('finished');
      return;
    }
    
    // Advance to next round
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
    }, 1000);
  };

  const claimReward = async () => {
    if (!hasWon) return;
    
    try {
      if (address) {
        // Send actual reward to connected wallet
        await sendReward(address, rewardAmount);
        
        // Mint NFT on Monad Testnet
        await monadService.mintEscapeNFT(address, currentRound, 5000);
        
        alert(`🎉 Congratulations! $${rewardAmount} USD has been sent to your wallet: ${address}`);
      } else {
        // Show message for guest players (no rewards)
        alert(`🎉 You won as a guest! Connect your wallet next time to claim $${rewardAmount} USD rewards!`);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Error claiming reward. Please try again.');
    }
  };
  const startGame = () => {
    console.log('GameContext: Starting game with', players.length, 'players');
    setGameState('playing');
    setHasWon(false);
    setCurrentRound(1);
  };
  return (
    <GameContext.Provider value={{
      players,
      currentRound,
      gameState,
      isHost,
      hasWon,
      rewardAmount,
      createRoom,
      joinRoom,
      recordAction,
      solvePuzzle,
      startGame,
      claimReward
    }}>
      {children}
    </GameContext.Provider>
  );
};