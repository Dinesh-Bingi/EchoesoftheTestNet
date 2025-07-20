import { useState, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { paymentService } from '../services/PaymentService';

export const useBlockchain = () => {
  const { address, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock smart contract address for Monad Testnet
  const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4d35F4e4dF50aB6';

  const recordSequence = useCallback(async (sequence: number[]) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const rewardAmount = 25; // $25 USD per puzzle
      const description = `Echoes of the Testnet - Puzzle Solved (Round ${sequence.join('')})`;
      
      console.log('💰 SENDING REAL USD REWARD:', {
        player: address,
        sequence: sequence,
        rewardAmount: `$${rewardAmount} USD`,
        timestamp: Date.now()
      });

      // Try multiple payment methods automatically
      const result = await paymentService.sendOptimalPayment(
        address,
        '', // Email can be added later
        rewardAmount,
        description
      );

      if (result.success) {
        return {
          success: true,
          transactionHash: result.transactionId,
          rewardAmount: rewardAmount,
          method: result.method,
          message: `$${rewardAmount} USD sent via ${result.method}!`
        };
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  const mintEscapeNFT = useCallback(async () => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock NFT minting
      const mockTransactionHash = '0x' + Math.random().toString(16).substr(2, 64);
      const mockTokenId = Math.floor(Math.random() * 10000);
      
      console.log('Minting Loopbreaker NFT on Monad Testnet:', {
        player: address,
        tokenId: mockTokenId,
        timestamp: Date.now(),
        transactionHash: mockTransactionHash
      });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        transactionHash: mockTransactionHash,
        tokenId: mockTokenId,
        nftUrl: `https://monad-testnet.com/nft/${mockTokenId}`
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  const getPlayerHistory = useCallback(async (playerAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock fetching player history from blockchain
      const mockHistory = {
        totalRounds: Math.floor(Math.random() * 10) + 1,
        successfulEscapes: Math.floor(Math.random() * 5),
        lastPlayed: Date.now() - Math.random() * 86400000, // Random time in last 24h
        bestTime: Math.floor(Math.random() * 25) + 5 // 5-30 seconds
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      return mockHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendReward = useCallback(async (recipientAddress: string, amountUSD: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const description = `Echoes of the Testnet - Game Reward`;
      
      console.log('💸 Sending game reward:', {
        recipient: recipientAddress,
        amount: `$${amountUSD} USD`,
        timestamp: Date.now()
      });

      // Send real USD reward
      const result = await paymentService.sendOptimalPayment(
        recipientAddress,
        '', // Email optional
        amountUSD,
        description
      );

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    recordSequence,
    mintEscapeNFT,
    getPlayerHistory,
    sendReward,
    isLoading,
    error,
    contractAddress: CONTRACT_ADDRESS
  };
};