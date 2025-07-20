import { loadStripe, Stripe } from '@stripe/stripe-js';

// Payment service for handling real USD transfers
export class PaymentService {
  private stripe: Stripe | null = null;
  
  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    // Initialize Stripe with publishable key
    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');
  }

  // Stripe USD Transfer
  async sendStripePayment(recipientEmail: string, amountUSD: number, description: string) {
    try {
      console.log('🏦 Processing Stripe payment:', {
        recipient: recipientEmail,
        amount: `$${amountUSD} USD`,
        description
      });

      // Create payment intent
      const response = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountUSD * 100, // Convert to cents
          currency: 'usd',
          recipient_email: recipientEmail,
          description
        })
      });

      const { client_secret } = await response.json();

      if (this.stripe) {
        const result = await this.stripe.confirmCardPayment(client_secret);
        
        if (result.error) {
          throw new Error(result.error.message);
        }

        return {
          success: true,
          transactionId: result.paymentIntent?.id,
          amount: amountUSD,
          method: 'Stripe',
          timestamp: Date.now()
        };
      }
    } catch (error) {
      console.error('Stripe payment failed:', error);
      throw error;
    }
  }

  // PayPal USD Transfer
  async sendPayPalPayment(recipientEmail: string, amountUSD: number, description: string) {
    try {
      console.log('💰 Processing PayPal payment:', {
        recipient: recipientEmail,
        amount: `$${amountUSD} USD`,
        description
      });

      const response = await fetch('/api/paypal/send-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_email: recipientEmail,
          amount: amountUSD.toString(),
          currency: 'USD',
          note: description
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          transactionId: result.payout_batch_id,
          amount: amountUSD,
          method: 'PayPal',
          timestamp: Date.now()
        };
      } else {
        throw new Error(result.error || 'PayPal payment failed');
      }
    } catch (error) {
      console.error('PayPal payment failed:', error);
      throw error;
    }
  }

  // Bank Transfer (ACH)
  async sendBankTransfer(recipientAccount: string, routingNumber: string, amountUSD: number, description: string) {
    try {
      console.log('🏛️ Processing bank transfer:', {
        recipient: `***${recipientAccount.slice(-4)}`,
        routing: routingNumber,
        amount: `$${amountUSD} USD`,
        description
      });

      const response = await fetch('/api/bank/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_account: recipientAccount,
          routing_number: routingNumber,
          amount: amountUSD,
          description
        })
      });

      const result = await response.json();

      if (result.success) {
        return {
          success: true,
          transactionId: result.transfer_id,
          amount: amountUSD,
          method: 'Bank Transfer',
          timestamp: Date.now(),
          estimatedArrival: '1-3 business days'
        };
      } else {
        throw new Error(result.error || 'Bank transfer failed');
      }
    } catch (error) {
      console.error('Bank transfer failed:', error);
      throw error;
    }
  }

  // USDC Stablecoin Transfer
  async sendUSDCPayment(recipientWallet: string, amountUSD: number, description: string) {
    try {
      console.log('🪙 Processing USDC transfer:', {
        recipient: `${recipientWallet.slice(0, 6)}...${recipientWallet.slice(-4)}`,
        amount: `${amountUSD} USDC`,
        description
      });

      // Connect to Ethereum/Polygon network
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // USDC contract address (Polygon mainnet)
        const USDC_CONTRACT = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
        const USDC_ABI = [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ];

        const usdcContract = new ethers.Contract(USDC_CONTRACT, USDC_ABI, signer);
        
        // Convert USD to USDC (6 decimals)
        const amountInWei = ethers.utils.parseUnits(amountUSD.toString(), 6);
        
        // Send USDC
        const tx = await usdcContract.transfer(recipientWallet, amountInWei);
        const receipt = await tx.wait();

        return {
          success: true,
          transactionId: receipt.transactionHash,
          amount: amountUSD,
          method: 'USDC',
          timestamp: Date.now(),
          blockNumber: receipt.blockNumber
        };
      } else {
        throw new Error('Web3 provider not available');
      }
    } catch (error) {
      console.error('USDC transfer failed:', error);
      throw error;
    }
  }

  // USDT Stablecoin Transfer
  async sendUSDTPayment(recipientWallet: string, amountUSD: number, description: string) {
    try {
      console.log('💵 Processing USDT transfer:', {
        recipient: `${recipientWallet.slice(0, 6)}...${recipientWallet.slice(-4)}`,
        amount: `${amountUSD} USDT`,
        description
      });

      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // USDT contract address (Ethereum mainnet)
        const USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
        const USDT_ABI = [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ];

        const usdtContract = new ethers.Contract(USDT_CONTRACT, USDT_ABI, signer);
        
        // Convert USD to USDT (6 decimals)
        const amountInWei = ethers.utils.parseUnits(amountUSD.toString(), 6);
        
        // Send USDT
        const tx = await usdtContract.transfer(recipientWallet, amountInWei);
        const receipt = await tx.wait();

        return {
          success: true,
          transactionId: receipt.transactionHash,
          amount: amountUSD,
          method: 'USDT',
          timestamp: Date.now(),
          blockNumber: receipt.blockNumber
        };
      } else {
        throw new Error('Web3 provider not available');
      }
    } catch (error) {
      console.error('USDT transfer failed:', error);
      throw error;
    }
  }

  // Auto-select best payment method
  async sendOptimalPayment(recipientWallet: string, recipientEmail: string, amountUSD: number, description: string) {
    const methods = [
      { name: 'USDC', priority: 1 },
      { name: 'USDT', priority: 2 },
      { name: 'PayPal', priority: 3 },
      { name: 'Stripe', priority: 4 }
    ];

    for (const method of methods) {
      try {
        switch (method.name) {
          case 'USDC':
            return await this.sendUSDCPayment(recipientWallet, amountUSD, description);
          case 'USDT':
            return await this.sendUSDTPayment(recipientWallet, amountUSD, description);
          case 'PayPal':
            if (recipientEmail) {
              return await this.sendPayPalPayment(recipientEmail, amountUSD, description);
            }
            break;
          case 'Stripe':
            if (recipientEmail) {
              return await this.sendStripePayment(recipientEmail, amountUSD, description);
            }
            break;
        }
      } catch (error) {
        console.warn(`${method.name} payment failed, trying next method:`, error);
        continue;
      }
    }

    throw new Error('All payment methods failed');
  }
}

export const paymentService = new PaymentService();