# 🎮 Echoes of the Testnet

A spooky multiplayer web game where players are trapped in a haunted smart contract and must escape by solving puzzles while avoiding their ghostly past selves.

## 🎯 Game Concept

Players find themselves trapped in a haunted smart contract where their previous actions become ghost echoes that replay on screen. Each round, you must navigate through the game area while avoiding collision with your past selves (displayed as transparent ghosts). To escape the time-loop, players must solve puzzles by inputting correct sequences of actions, which are then recorded on the Monad Testnet blockchain.

## ✨ Key Features

- **Multiplayer Gameplay**: Real-time multiplayer with up to 4 players per room
- **Ghost Echo System**: Your past movements replay as transparent ghosts
- **Blockchain Integration**: Actions are recorded on Monad Testnet
- **Puzzle Solving**: Escape by solving sequence-based puzzles
- **NFT Rewards**: Mint "Loopbreaker NFT" after successful escapes
- **Spooky Atmosphere**: Horror-themed UI with glitch effects and atmospheric design
- **30-Second Rounds**: Fast-paced gameplay with time pressure

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Multiplayer**: Multisynq for decentralized real-time synchronization
- **Blockchain**: Monad Testnet (Chain ID: 10143) with Ethers.js
- **State Management**: React Context API
- **Animations**: Framer Motion + Custom CSS animations
- **Payment Systems**: Stripe, PayPal, Bank Transfers, USDC/USDT

## 🎮 How to Play

1. **Connect Wallet**: Connect your MetaMask or compatible wallet
2. **Create/Join Room**: Either create a new haunted room or join an existing one
3. **Navigate**: Use WASD or arrow keys to move your character
4. **Avoid Ghosts**: Don't collide with your past selves (purple transparent ghosts)
5. **Solve Puzzles**: Input the correct 4-digit sequence to escape
6. **Escape**: Successfully solving puzzles advances you to the next round
7. **Mint NFT**: After escaping, mint your "Loopbreaker NFT" as proof of victory

## 🚀 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

For production deployment, you'll need to set up:

```env
# Multisynq Real-time Multiplayer
VITE_MULTISYNQ_API_KEY=your_multisynq_api_key_here

# Monad Testnet Blockchain
VITE_MONAD_RPC_URL=https://monad-testnet-rpc.com
VITE_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b8D4d35F4e4dF50aB6

# Payment Systems
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_client_id
```

## 🎨 Game Mechanics

### Movement System
- **WASD/Arrow Keys**: Move your character
- **Collision Detection**: Touching ghosts resets your position
- **Smooth Animations**: Fluid movement with spring physics

### Ghost Echo System
- **Past Actions Replay**: Your previous round movements become ghosts
- **Transparent Visualization**: Ghosts appear as semi-transparent purple entities
- **Collision Consequences**: Touching ghosts triggers screen glitch and position reset

### Puzzle System
- **4-Digit Sequences**: Each round requires solving a unique numerical puzzle
- **Blockchain Recording**: Successful sequences are recorded on Monad Testnet
- **Progressive Difficulty**: Puzzles become more challenging with each round

### Blockchain Integration
- **Monad Testnet Integration**: All actions recorded on high-performance blockchain
- **Real-time Sync**: Multisynq enables serverless multiplayer coordination
- **On-chain Verification**: Puzzle solutions verified on Monad blockchain
- **NFT Rewards**: Mint "Loopbreaker NFTs" for successful escapes
- **Fast & Cheap**: Monad's EVM-compatible, low-cost transactions

## 🎯 Scoring System

- **Movement Points**: Points for successful navigation
- **Puzzle Solving**: Major points for completing sequences
- **Speed Bonus**: Extra points for faster completion
- **Ghost Avoidance**: Bonus for minimal collisions

## 🏆 NFT Rewards

Successfully escaping the haunted contract allows you to mint a "Loopbreaker NFT" featuring:
- **Unique Artwork**: Procedurally generated spooky themes
- **Metadata**: Records your escape time and round number
- **Rarity Traits**: Different attributes based on performance
- **On-Chain Proof**: Verifiable achievement on Monad Testnet

## 🎨 Visual Design

- **Color Palette**: Dark themes with neon green (#00ff41) and purple accents
- **Glitch Effects**: Screen distortions and chromatic aberration
- **Atmospheric Elements**: Floating particles and scan lines
- **Responsive Design**: Optimized for desktop and mobile
- **Horror Aesthetics**: Inspired by retro-futuristic horror games

## 🔒 Security Features

- **Wallet Integration**: Secure MetaMask connection
- **Blockchain Verification**: All actions verified on-chain
- **Anti-Cheat**: Server-side validation of game state
- **Privacy**: No personal data collection beyond wallet address

## 🌐 Deployment

The game is designed to be deployed on:
- **Vercel**: For frontend hosting
- **Monad Testnet**: For blockchain interactions (Chain ID: 10143)
- **Multisynq**: For decentralized multiplayer synchronization
- **IPFS**: For NFT metadata storage

## 📱 Mobile Support

- **Touch Controls**: Swipe gestures for movement
- **Responsive Layout**: Optimized for mobile screens
- **Web3 Mobile**: Compatible with mobile wallet apps

## 🎭 Easter Eggs

- **Hidden Sequences**: Secret puzzle solutions for bonus points
- **Glitch Messages**: Hidden text appears during screen distortions
- **Blockchain References**: Subtle nods to Web3 culture
- **Developer Messages**: Hidden console logs for curious players
- **Multisynq Magic**: Real-time ghost synchronization across players

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - Feel free to use this code for your own spooky blockchain games!

## 🏆 Mission 6 Compliance

✅ **Open Source**: MIT License, full source available
✅ **Novel Multisynq Use**: Real-time ghost echo synchronization across players
✅ **Monad Testnet Integration**: All puzzle solutions recorded on-chain
✅ **Creative & Silly**: Spooky blockchain horror theme with ghost mechanics
✅ **Real-time Multiplayer**: Serverless coordination via Multisynq
✅ **EVM Compatible**: Smart contracts on Monad Testnet

## Open This Link and Play To get Rewards
https://echoesoftestnet.netlify.app/

---

*Enter if you dare... but remember, in the haunted blockchain, your past never truly dies.* 👻⛓️
