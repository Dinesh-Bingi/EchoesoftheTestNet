import { ethers } from 'ethers';

export class MonadTestnetService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract | null = null;
  
  // Monad Testnet configuration
  private readonly MONAD_RPC = 'https://testnet-rpc.monad.xyz';
  private readonly CHAIN_ID = 10143;
  private readonly CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4d35F4e4dF50aB6';

  // Smart contract ABI for game interactions
  private readonly CONTRACT_ABI = [
    'function recordPlayerAction(address player, uint256[] memory sequence, uint256 round) external',
    'function getPlayerScore(address player) external view returns (uint256)',
    'function mintEscapeNFT(address player, uint256 round, uint256 score) external',
    'function getPlayerHistory(address player) external view returns (uint256[] memory)',
    'event PuzzleSolved(address indexed player, uint256[] sequence, uint256 round, uint256 timestamp)',
    'event NFTMinted(address indexed player, uint256 tokenId, uint256 round)'
  ];

  constructor() {
    this.provider = new ethers.JsonRpcProvider(this.MONAD_RPC);
    this.initializeContract();
  }

  private async initializeContract() {
    try {
      // Connect to Monad Testnet
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();
        
        // Switch to Monad Testnet if needed
        await this.switchToMonadTestnet();
        
        this.contract = new ethers.Contract(
          this.CONTRACT_ADDRESS,
          this.CONTRACT_ABI,
          signer
        );
        
        console.log('🔗 Connected to Monad Testnet contract');
      }
    } catch (error) {
      console.error('Failed to initialize Monad contract:', error);
    }
  }

  // Switch wallet to Monad Testnet
  async switchToMonadTestnet(): Promise<void> {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this.CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${this.CHAIN_ID.toString(16)}`,
            chainName: 'Monad Testnet',
            nativeCurrency: {
              name: 'MON',
              symbol: 'MON',
              decimals: 18,
            },
            rpcUrls: [this.MONAD_RPC],
            blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
          }],
        });
      }
    }
  }

  // Record player action on Monad blockchain
  async recordPlayerAction(playerAddress: string, sequence: number[], round: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      console.log('📝 Recording action on Monad Testnet:', {
        player: playerAddress,
        sequence,
        round
      });

      const tx = await this.contract.recordPlayerAction(
        playerAddress,
        sequence,
        round
      );

      const receipt = await tx.wait();
      
      console.log('✅ Action recorded on Monad:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Failed to record action on Monad:', error);
      throw error;
    }
  }

  // Get player score from blockchain
  async getPlayerScore(playerAddress: string): Promise<number> {
    if (!this.contract) return 0;

    try {
      const score = await this.contract.getPlayerScore(playerAddress);
      return Number(score);
    } catch (error) {
      console.error('Failed to get player score:', error);
      return 0;
    }
  }

  // Mint escape NFT on successful completion
  async mintEscapeNFT(playerAddress: string, round: number, score: number): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      console.log('🎨 Minting Escape NFT on Monad:', {
        player: playerAddress,
        round,
        score
      });

      const tx = await this.contract.mintEscapeNFT(playerAddress, round, score);
      const receipt = await tx.wait();
      
      console.log('🎉 NFT minted on Monad:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  // Get player's game history from blockchain
  async getPlayerHistory(playerAddress: string): Promise<number[]> {
    if (!this.contract) return [];

    try {
      const history = await this.contract.getPlayerHistory(playerAddress);
      return history.map((h: any) => Number(h));
    } catch (error) {
      console.error('Failed to get player history:', error);
      return [];
    }
  }

  // Listen for blockchain events
  onPuzzleSolved(callback: (player: string, sequence: number[], round: number) => void): void {
    if (!this.contract) return;

    this.contract.on('PuzzleSolved', (player, sequence, round, timestamp) => {
      callback(player, sequence.map((s: any) => Number(s)), Number(round));
    });
  }

  // Get MON testnet tokens from faucet
  async requestTestnetTokens(playerAddress: string): Promise<void> {
    try {
      console.log('🚰 Requesting MON testnet tokens for:', playerAddress);
      
      // Call Monad testnet faucet
      const response = await fetch('https://testnet-faucet.monad.xyz/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: playerAddress,
          amount: '1000000000000000000' // 1 MON
        })
      });

      if (response.ok) {
        console.log('✅ Testnet tokens requested successfully');
      }
    } catch (error) {
      console.error('Failed to request testnet tokens:', error);
    }
  }
}

export const monadService = new MonadTestnetService();