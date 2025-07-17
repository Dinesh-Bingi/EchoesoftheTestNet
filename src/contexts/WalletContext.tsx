import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  chainId: number | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const isProcessingRef = useRef(false);

  const checkConnection = async () => {
    if (isProcessingRef.current) {
      return;
    }
    
    if (typeof window !== 'undefined' && window.ethereum) {
      isProcessingRef.current = true;
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainId, 16));
        }
      } catch (error) {
        // Handle user rejection gracefully (error code 4001)
        if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
          console.log('Wallet connection request rejected by user');
        } else if (error && typeof error === 'object' && 'code' in error && error.code === -32002) {
          console.warn('Wallet is already processing a request. Please wait.');
        } else {
          console.error('Error checking wallet connection:', error);
        }
      } finally {
        isProcessingRef.current = false;
      }
    }
  };

  const connect = async () => {
    if (isProcessingRef.current) {
      console.log('Wallet connection already in progress, please wait...');
      return;
    }
    
    if (typeof window !== 'undefined' && window.ethereum) {
      isProcessingRef.current = true;
      console.log('Attempting to connect wallet...');
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          console.log('Wallet connected successfully:', accounts[0]);
          setAddress(accounts[0]);
          setIsConnected(true);
          
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(parseInt(chainId, 16));
          console.log('Connected to chain ID:', parseInt(chainId, 16));
        }
      } catch (error) {
        // Handle user rejection gracefully (error code 4001) and already processing (error code -32002)
        if (error && typeof error === 'object' && 'code' in error && error.code === 4001) {
          console.log('Wallet connection request rejected by user');
        } else if (error && typeof error === 'object' && 'code' in error && error.code === -32002) {
          console.warn('Wallet is already processing a request. Please wait.');
        } else {
          console.error('Error connecting wallet:', error);
          alert('Failed to connect wallet. Please try again.');
        }
      } finally {
        isProcessingRef.current = false;
      }
    } else {
      alert('No wallet detected. Please install MetaMask or another Web3 wallet.');
      console.error('No ethereum provider found');
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
  };

  return (
    <WalletContext.Provider value={{
      address,
      isConnected,
      connect,
      disconnect,
      chainId
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}