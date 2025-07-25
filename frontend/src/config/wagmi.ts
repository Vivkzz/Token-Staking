import { createConfig, http } from 'wagmi'
import { localhost, sepolia } from 'wagmi/chains'
import { metaMask, injected } from 'wagmi/connectors'

const hardhatLocal = {
    ...localhost,
    id: 31337,
    name: 'Hardhat Local',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['http://127.0.0.1:8545'],
        },
    },
} as const

export const config = createConfig({
    chains: [hardhatLocal, sepolia],
    connectors: [
        metaMask(),
        injected(),
    ],
    transports: {
        [hardhatLocal.id]: http(),
        [sepolia.id]: http(),
    },
})

// Contract addresses
export const CONTRACTS = {
    MyToken: '0x720af75B7297250d9A69FA5E31a39EAcE140b4df' as `0x${string}`,
    StakingContract: '0xf44990c190cC37913010C9b19b939EA0D134cE4a' as `0x${string}`
}