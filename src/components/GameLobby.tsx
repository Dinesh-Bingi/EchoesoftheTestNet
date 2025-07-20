import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Skull, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useWallet } from '../contexts/WalletContext';

interface GameLobbyProps {
  onStartGame: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame }) => {
  const { players, isHost, createRoom, joinRoom, startGame, gameState } = useGame();
  const { address } = useWallet();
  const [roomCode, setRoomCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateRoom = async () => {
    console.log('🎮 BUTTON CLICKED: handleCreateRoom called');
    
    try {
      await createRoom();
      console.log('✅ Room creation completed successfully');
    } catch (error) {
      console.error('❌ Error creating room:', error);
    }
  };

  const handlePlayAsGuest = async () => {
    console.log('🎮 GUEST BUTTON CLICKED: Starting guest play process');
    console.log('📊 Current state before guest play:', { players: players.length, gameState });
    
    try {
      // Missing implementation
    } catch (error) {
      console.error('❌ Error in guest play:', error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomCode);
    } catch (error) {
      console.error('❌ Error joining room:', error);
    }
  };

  const handleStartGame = () => {
    console.log('handleStartGame called with', players.length, 'players');
    if (players.length >= 1) {
      startGame(); // Update game context state
      onStartGame();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
          >
            <Skull className="inline-block mr-3 text-purple-400" size={48} />
            ECHOES
          </motion.div>
          <div className="text-xl text-gray-300 font-medium">OF THE TESTNET</div>
          <div className="text-sm text-gray-400 mt-2">
            Escape the haunted smart contract
          </div>
        </div>

        {!address ? (
          <div className="text-center">
            <div className="text-red-400 mb-4 animate-pulse">
              <div className="mb-4">
                <Zap className="inline-block mr-2 animate-bounce" size={20} />
                ⚠️ URGENT: Connect wallet for $100 rewards!
              </div>
              <div className="text-sm text-gray-400">
                💰 Your coins may be expiring - connect now to secure rewards!
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center text-blue-400 mb-3">
                <Users className="mr-2" size={20} />
                <span className="font-semibold">Players ({players.length}/4)</span>
                {players.length === 1 && <span className="ml-2 text-purple-400">• Solo Mode</span>}
              </div>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between text-sm bg-gray-700/50 rounded-lg p-3">
                    <span className="text-gray-300">
                      {player.address.slice(0, 6)}...{player.address.slice(-4)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      player.isHost ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {player.isHost ? 'HOST' : 'PLAYER'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {players.length === 0 && (
              <div className="space-y-3">
                <button
                  onClick={handleCreateRoom}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
                >
                  Create Haunted Room
                </button>
                
                <button
                  onClick={() => setShowJoinForm(!showJoinForm)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 border border-gray-600"
                >
                  Join Existing Room
                </button>

                {showJoinForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      placeholder="Enter room code..."
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      className="w-full bg-gray-800/80 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={handleJoinRoom}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Join Room
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {isHost && players.length >= 1 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
               onClick={() => {
                 console.log('Starting game with', players.length, 'players');
                 handleStartGame();
               }}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <Play className="mr-2" size={20} />
                BEGIN THE NIGHTMARE
              </motion.button>
            )}

            {!isHost && players.length >= 1 && (
              <div className="text-center text-blue-400 bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                Waiting for host to start the game...
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500 text-center">
          <div className="mb-2 text-yellow-400 font-semibold">⚠️ GAME INFO ⚠️</div>
          <div>
            Play solo or with friends (1-4 players)
            <br />
            <span className="text-green-400 font-medium">Earn $25 USD per puzzle solved!</span> • Connect wallet to receive real money
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLobby;