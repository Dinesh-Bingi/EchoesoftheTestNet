import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Play, Skull, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useWallet } from '../contexts/WalletContext';

interface GameLobbyProps {
  onStartGame: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame }) => {
  const { players, isHost, createRoom, joinRoom, startGame } = useGame();
  const { address } = useWallet();
  const [roomCode, setRoomCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateRoom = async () => {
    if (!address) return;
    await createRoom();
  };

  const handleJoinRoom = async () => {
    if (!address || !roomCode) return;
    await joinRoom(roomCode);
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
            animate={{ 
              textShadow: [
                '0 0 10px #00ff41',
                '0 0 20px #00ff41',
                '0 0 10px #00ff41'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-bold text-green-400 mb-2"
          >
            <Skull className="inline-block mr-2" size={40} />
            ECHOES
          </motion.div>
          <div className="text-lg text-purple-300">OF THE TESTNET</div>
          <div className="text-sm text-gray-400 mt-2">
            Escape the haunted smart contract
          </div>
        </div>

        {!address ? (
          <div className="text-center">
            <div className="text-yellow-400 mb-4">
              <Zap className="inline-block mr-2" size={20} />
              Connect your wallet to begin
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center text-green-400 mb-2">
                <Users className="mr-2" size={20} />
                Players ({players.length}/4) {players.length === 1 ? '• Solo Mode' : ''}
              </div>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {player.address.slice(0, 6)}...{player.address.slice(-4)}
                    </span>
                    <span className="text-purple-400">
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
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Create Haunted Room
                </button>
                
                <button
                  onClick={() => setShowJoinForm(!showJoinForm)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
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
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
                    />
                    <button
                      onClick={handleJoinRoom}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
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
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Play className="mr-2" size={20} />
                BEGIN THE NIGHTMARE
              </motion.button>
            )}

            {!isHost && players.length >= 1 && (
              <div className="text-center text-yellow-400">
                Waiting for host to start the game...
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500 text-center">
          <div className="mb-2">⚠️ WARNING ⚠️</div>
          <div>
            Play solo or with friends (1-4 players).
            <br />
            Your actions will be recorded on the Monad Testnet.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLobby;