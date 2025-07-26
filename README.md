# StakeVault - Decentralized Staking dApp

A simple decentralized staking application built on Ethereum that allows users to stake and unstake MTK tokens. The project includes smart contracts, comprehensive tests, and a modern React frontend.

## Features

- **Token Faucet**: Get test MTK tokens for free
- **Stake Tokens**: Lock your MTK tokens in the staking contract
- **Unstake Tokens**: Withdraw your staked tokens anytime
- **Real-time Balance Updates**: View your token and staking balances
- **Modern UI**: Clean, responsive interface with dark theme
- **Multi-Network Support**: Works on Sepolia testnet and local Hardhat network

## Project Structure

```
├── contracts/              # Smart contracts
│   ├── MyToken.sol         # ERC20 token with faucet functionality
│   └── Staking.sol         # Staking contract
├── frontend/               # Next.js React frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── config/        # Contract ABIs and configuration
├── scripts/               # Deployment scripts
├── test/                  # Contract tests
└── deployments.json      # Deployed contract addresses
```

## Tech Stack

### Smart Contracts
- **Solidity** ^0.8.20
- **Hardhat** - Development environment
- **OpenZeppelin** - Security-audited contract libraries
- **Ethers.js** - Ethereum library

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icons

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd staking-dapp
```

### 2. Install Dependencies

```bash
# Install contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# For testnet deployment (optional)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 4. Compile Smart Contracts

```bash
npx hardhat compile
```

### 5. Run Tests

```bash
npx hardhat test
```

### 6. Deploy Contracts (Local)

```bash
# Start local Hardhat network
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 7. Start Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🌐 Deployed Contracts (Sepolia Testnet)

The contracts are already deployed on Sepolia testnet:

- **MyToken (MTK)**: `0x720af75B7297250d9A69FA5E31a39EAcE140b4df`
- **Staking Contract**: `0xf44990c190cC37913010C9b19b939EA0D134cE4a`

## How to Use

### 1. Connect Your Wallet
- Click "Connect Wallet" and select MetaMask
- Make sure you're on Sepolia testnet or local network

### 2. Get Test Tokens
- Visit the "Get Faucet" page
- Click "Get 1,000 MTK from Faucet"
- Confirm the transaction in MetaMask

### 3. Approve Token Spending
- On the main page, click "Approve Token Spending"
- This allows the staking contract to transfer your tokens

### 4. Stake Tokens
- Enter the amount you want to stake
- Click "Stake Tokens"
- Confirm the transaction

### 5. Unstake Tokens
- Switch to the "Unstake" tab
- Enter the amount to unstake
- Click "Unstake Tokens"

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run specific test file
npx hardhat test test/Staking.js
```

### Test Coverage
- ✅ Token minting and burning
- ✅ Staking functionality
- ✅ Unstaking functionality
- ✅ Access control
- ✅ Error handling
- ✅ Edge cases

## Development Commands

```bash
# Compile contracts
npx hardhat compile

# Clean artifacts
npx hardhat clean

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# Verify contracts on Etherscan
npx hardhat verify CONTRACT_ADDRESS --network sepolia

# Start frontend development server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

## Smart Contract Details

### MyToken.sol
- **Type**: ERC20 token with additional features
- **Name**: MyToken (MYT)
- **Features**: 
  - Standard ERC20 functionality
  - Public faucet function (1,000 tokens per call)
  - Owner-controlled minting
  - Token burning capability

### Staking.sol
- **Type**: Token staking contract
- **Features**:
  - Stake any amount of MTK tokens
  - Unstake anytime without penalties
  - View staked balances
  - Reentrancy protection
  - Gas-efficient operations

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **OpenZeppelin Libraries**: Battle-tested security
- **Custom Errors**: Gas-efficient error handling
- **Input Validation**: Comprehensive checks on all inputs
- **Access Control**: Owner-only functions where appropriate

## Deployment Networks

### Local Development
- **Network**: Hardhat Local
- **Chain ID**: 31337
- **RPC**: http://127.0.0.1:8545

### Testnet (Sepolia)
- **Network**: Sepolia
- **Chain ID**: 11155111
- **RPC**: Configure in wagmi.ts

## Frontend Features

- **Responsive Design**: Works on all device sizes
- **Dark Theme**: Modern dark UI with gradients
- **Real-time Updates**: Automatic balance refreshing
- **Transaction Feedback**: Toast notifications and status
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth loading indicators

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

**1. MetaMask Connection Issues**
- Make sure you're on the correct network (Sepolia or Localhost)
- Try refreshing the page and reconnecting

**2. Transaction Failures**
- Ensure you have enough ETH for gas fees
- Check if you've approved token spending
- Verify you have sufficient token balance

**3. Balance Not Updating**
- Refresh the page after transactions
- Wait for transaction confirmation
- Check transaction status on Etherscan

**4. Local Network Issues**
- Make sure Hardhat node is running (`npx hardhat node`)
- Check if contracts are deployed locally
- Verify network configuration in MetaMask

### Need Help?

- Check the [Hardhat documentation](https://hardhat.org/docs)
- Review [Wagmi documentation](https://wagmi.sh/)
- Open an issue in this repository

**Built with ❤️ by Vivek**

*Happy Staking! 🚀*