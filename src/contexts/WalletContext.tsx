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

  useEffect(() => {
    checkConnection();
  }, []);

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
      return;
    }
    
    if (typeof window !== 'undefined' && window.ethereum) {
      isProcessingRef.current = true;
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
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
        } else {
          console.error('Error connecting wallet:', error);
        }
      } finally {
        isProcessingRef.current = false;
      }
    } else {
      // Mock connection for development
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setAddress(mockAddress);
      setIsConnected(true);
      setChainId(1337); // Mock chain ID
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