import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';

const WalletConnection: React.FC = () => {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <AnimatePresence>
        {!isConnected ? (
          <motion.button
            key="connect"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connect}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Wallet size={20} />
            <span>Connect Wallet</span>
          </motion.button>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-black/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-semibold">Connected</span>
              </div>
              <button
                onClick={disconnect}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <ExternalLink size={16} />
              </button>
            </div>
            
            <div className="text-white text-sm mb-2">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={copyAddress}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-xs transition-colors flex items-center justify-center space-x-1"
              >
                {copied ? (
                  <>
                    <CheckCircle size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletConnection;