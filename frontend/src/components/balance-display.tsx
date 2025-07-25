'use client'

import { useAccount, useReadContract } from 'wagmi'
import { MyTokenABI, StakingContractABI } from '@/config/contracts'
import { CONTRACTS } from '@/config/wagmi'
import { formatEther } from 'viem'
import { Coins, Wallet, TrendingUp, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BalanceDisplay() {
  const { address, isConnected } = useAccount()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Token balance
  const { data: tokenBalance, isLoading: isTokenLoading } = useReadContract({
    address: CONTRACTS.MyToken,
    abi: MyTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Staked balance
  const { data: stakedBalance, isLoading: isStakedLoading } = useReadContract({
    address: CONTRACTS.StakingContract,
    abi: StakingContractABI,
    functionName: 'getTokenBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Total staked in contract
  const { data: totalStaked, isLoading: isTotalLoading } = useReadContract({
    address: CONTRACTS.StakingContract,
    abi: StakingContractABI,
    functionName: 'getContractBalance',
    query: {
      enabled: !!address,
    },
  })

  // Token allowance
  const { data: allowance } = useReadContract({
    address: CONTRACTS.MyToken,
    abi: MyTokenABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.StakingContract] : undefined,
    query: {
      enabled: !!address,
    },
  })

  if (!isMounted || !isConnected) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="w-16 h-4 bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="w-24 h-8 bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="w-20 h-4 bg-slate-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    )
  }

  const formatBalance = (balance: bigint | undefined, decimals = 18) => {
    if (!balance) return '0.00'
    return parseFloat(formatEther(balance)).toFixed(4)
  }

  const isApproved = allowance && allowance > 0n

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Token Balance */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-xs text-slate-400 font-medium">AVAILABLE</div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {isTokenLoading ? (
            <div className="w-20 h-8 bg-slate-700 rounded animate-pulse"></div>
          ) : (
            `${formatBalance(tokenBalance)} MTK`
          )}
        </div>
        <div className="text-sm text-slate-400">Token Balance</div>
      </div>

      {/* Staked Balance */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-xs text-slate-400 font-medium">STAKED</div>
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {isStakedLoading ? (
            <div className="w-20 h-8 bg-slate-700 rounded animate-pulse"></div>
          ) : (
            `${formatBalance(stakedBalance)} MTK`
          )}
        </div>
        <div className="text-sm text-slate-400">Your Stake</div>
      </div>

      {/* Total Staked */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-xs text-slate-400 font-medium">TOTAL</div>
        </div>
        <div className="text-2xl font-bold text.white mb-1">
          {isTotalLoading ? (
            <div className="w-20 h-8 bg-slate-700 rounded animate-pulse"></div>
          ) : (
            `${formatBalance(totalStaked)} MTK`
          )}
        </div>
        <div className="text-sm text-slate-400">Total Staked</div>
      </div>

      {/* Approval Status */}
      {isConnected && (
        <div className="md:col-span-3 mt-4">
          <div className={`flex items-center gap-2 text-sm ${
            isApproved ? 'text-green-400' : 'text-yellow-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isApproved ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
            {isApproved 
              ? 'Contract approved for token transfers' 
              : 'Contract needs approval to transfer tokens'
            }
          </div>
        </div>
      )}
    </div>
  )
}