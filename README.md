StakeVault - Decentralized Staking dApp
A full-stack decentralized staking application built on Ethereum that allows users to stake and unstake ERC20 tokens through a modern web interface.

Show Image

🌟 Features
ERC20 Token (MyToken): Custom token with minting capabilities
Staking Contract: Secure staking/unstaking with event emission
Modern Frontend: Built with Next.js 14, TypeScript, and Tailwind CSS
Web3 Integration: Seamless wallet connection using wagmi v2 and viem
Real-time Updates: Live balance updates and transaction status
Responsive Design: Works perfectly on desktop and mobile devices
Security First: ReentrancyGuard protection and input validation

🏗️ Architecture
Smart Contracts
MyToken.sol: ERC20 token with additional minting functionality
StakingContract.sol: Main staking logic with stake/unstake functions
Frontend Stack
Next.js 14: React framework with App Router
TypeScript: Type safety and better developer experience
wagmi v2: React hooks for Ethereum
viem: TypeScript interface for Ethereum
Tailwind CSS: Utility-first CSS framework
Lucide React: Beautiful icons

🚀 Quick Start
Prerequisites
Node.js 18+ and npm
MetaMask browser extension
Git
1. Clone and Setup Backend
bash
# Clone the repository
git clone <repo-url>
cd staking-dapp

# Install dependencies
npm install

# Create environment file
cp .env.example .env
Add your private key to .env:

env
PRIVATE_KEY=your_metamask_private_key_here
2. Deploy Smart Contracts
bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local Hardhat node (keep running in separate terminal)
npx hardhat node

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost
3. Setup Frontend
bash
# Navigate to frontend directory
cd staking-frontend

# Install frontend dependencies
npm install

# Update contract addresses (run from frontend directory)
node ../update-addresses.js

# Start development server
npm run dev
4. Configure MetaMask
Add Hardhat Local Network:
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Import Hardhat test accounts:
Use one of the private keys from the Hardhat node output
Import account in MetaMask
📱 Usage Guide
1. Connect Wallet
Click "Connect Wallet" in the top right
Select MetaMask and approve connection
Ensure you're on the Hardhat Local network
2. Get Test Tokens
The deployer account has initial tokens. You can:

Use the deployer account directly, or
Modify the deploy script to mint tokens to your test account
3. Approve Token Spending
Before staking, you need to approve the staking contract
Click "Approve Token Spending" button
Confirm the transaction in MetaMask
4. Stake Tokens
Enter the amount you want to stake
Click "Stake Tokens"
Confirm transaction in MetaMask
View updated balances
5. Unstake Tokens
Switch to "Unstake" tab
Enter amount to unstake
Click "Unstake Tokens"
Tokens return to your wallet immediately
🧪 Testing
Smart Contract Tests
bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
npx hardhat test --gas-reporter

# Generate coverage report
npx hardhat coverage
Test Coverage Includes:
✅ Token minting and transfers
✅ Staking functionality
✅ Unstaking functionality
✅ Event emission
✅ Error conditions
✅ Edge cases
✅ Multiple user scenarios
📁 Project Structure
staking-dapp/
├── contracts/                 # Smart contracts
│   ├── MyToken.sol
│   └── StakingContract.sol
├── test/                      # Contract tests
│   └── StakingContract.test.js
├── scripts/                   # Deployment scripts
│   └── deploy.js
├── staking-frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # React components
│   │   └── config/           # Web3 configuration
│   └── public/
├── hardhat.config.js         # Hardhat configuration
└── package.json
🔧 Configuration
Environment Variables
env
# Backend (.env)
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://rpc.sepolia.org
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend (if needed)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
Network Configuration
The app is configured for:

Hardhat Local (Chain ID: 31337) - Development
Sepolia (Chain ID: 11155111) - Testnet



