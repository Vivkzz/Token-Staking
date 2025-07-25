'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, maxUint256 } from 'viem'
import { MyTokenABI, StakingContractABI } from '@/config/contracts'
import { CONTRACTS } from '@/config/wagmi'
import { Lock, Unlock, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function StakingInterface() {
  const { address, isConnected } = useAccount()
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Read contract data
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: CONTRACTS.MyToken,
    abi: MyTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: stakedBalance, refetch: refetchStakedBalance } = useReadContract({
    address: CONTRACTS.StakingContract,
    abi: StakingContractABI,
    functionName: 'getTokenBalance',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MyToken,
    abi: MyTokenABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.StakingContract] : undefined,
    query: { enabled: !!address },
  })

  const isApproved = allowance && allowance > 0n
  const isTransacting = isPending || isConfirming

  // Helper!!!
  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return '0.00'
    return parseFloat(formatEther(balance)).toFixed(4)
  }

  const handleMaxStake = () => {
    if (tokenBalance) {
      setStakeAmount(formatEther(tokenBalance))
    }
  }

  const handleMaxUnstake = () => {
    if (stakedBalance) {
      setUnstakeAmount(formatEther(stakedBalance))
    }
  }

  // Contract interactions
  const handleApprove = async () => {
    try {
      await writeContract({
        address: CONTRACTS.MyToken,
        abi: MyTokenABI,
        functionName: 'approve',
        args: [CONTRACTS.StakingContract, maxUint256],
      })
      toast.success('Approval transaction sent!')
      
      // Refetch allowance after transaction (mighty need to hit refresh)
      setTimeout(() => {
        refetchAllowance()
      }, 2000)
    } catch (error: any) {
      toast.error(`Approval failed: ${error.shortMessage || error.message}`)
    }
  }

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error('Please enter a valid stake amount')
      return
    }

    try {
      const amount = parseEther(stakeAmount)
      await writeContract({
        address: CONTRACTS.StakingContract,
        abi: StakingContractABI,
        functionName: 'stake',
        args: [amount],
      })
      
      toast.success('Stake transaction sent!')
      setStakeAmount('')
      
      // Refetch balances after transaction
      setTimeout(() => {
        refetchTokenBalance()
        refetchStakedBalance()
      }, 2000)
    } catch (error: any) {
      toast.error(`Staking failed: ${error.shortMessage || error.message}`)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast.error('Please enter a valid unstake amount')
      return
    }

    try {
      const amount = parseEther(unstakeAmount)
      await writeContract({
        address: CONTRACTS.StakingContract,
        abi: StakingContractABI,
        functionName: 'unstake',
        args: [amount],
      })
      
      toast.success('Unstake transaction sent!')
      setUnstakeAmount('')
      
      // Refetch balances after transaction
      setTimeout(() => {
        refetchTokenBalance()
        refetchStakedBalance()
      }, 2000)
    } catch (error: any) {
      toast.error(`Unstaking failed: ${error.shortMessage || error.message}`)
    }
  }

  if (!isMounted || !isConnected) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-slate-400">Connect your wallet to start staking tokens</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
      {/* Tab Navigation */}
      <div className="flex bg-slate-900/50 rounded-lg p-1 mb-8">
        <button
          onClick={() => setActiveTab('stake')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'stake'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Lock size={18} />
          Stake
        </button>
        <button
          onClick={() => setActiveTab('unstake')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'unstake'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Unlock size={18} />
          Unstake
        </button>
      </div>

      {/* Stake Tab */}
      {activeTab === 'stake' && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Amount to Stake</label>
              <div className="text-sm text-slate-400">
                Balance: {formatBalance(tokenBalance)} MTK
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-4 text-white text-lg font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                disabled={isTransacting}
              />
              <button
                onClick={handleMaxStake}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded text-blue-400 text-sm font-medium transition-all duration-200"
                disabled={isTransacting}
              >
                MAX
              </button>
            </div>
          </div>

          {!isApproved ? (
            <button
              onClick={handleApprove}
              disabled={isTransacting}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isTransacting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {isTransacting ? 'Approving...' : 'Approve Token Spending'}
            </button>
          ) : (
            <button
              onClick={handleStake}
              disabled={isTransacting || !stakeAmount || parseFloat(stakeAmount) <= 0}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isTransacting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              {isTransacting ? 'Staking...' : 'Stake Tokens'}
            </button>
          )}

          {/* Stake Info */}
          <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Staking Info</span>
            </div>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Tokens are locked in the staking contract</li>
              <li>• You can unstake anytime without penalties</li>
              <li>• Refresh the page to update balances</li>
            </ul>
          </div>
        </div>  
      )}

      {/* Unstake Tab */}
      {activeTab === 'unstake' && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300">Amount to Unstake</label>
              <div className="text-sm text-slate-400">
                Staked: {formatBalance(stakedBalance)} MTK
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-4 text-white text-lg font-semibold placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                disabled={isTransacting}
              />
              <button
                onClick={handleMaxUnstake}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded text-purple-400 text-sm font-medium transition-all duration-200"
                disabled={isTransacting}
              >
                MAX
              </button>
            </div>
          </div>

          <button
            onClick={handleUnstake}
            disabled={isTransacting || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || !stakedBalance || stakedBalance === 0n}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {isTransacting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
            {isTransacting ? 'Unstaking...' : 'Unstake Tokens'}
          </button>

          {/* Unstake Info */}
          <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-300">Unstaking Info</span>
            </div>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Tokens are returned to your wallet immediately</li>
              <li>• No unstaking fees or lock periods</li>
              <li>• You can unstake partial amounts</li>
            </ul>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {hash && (
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400">
            {isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isConfirming ? 'Transaction confirming...' : 'Transaction confirmed!'}
            </span>
          </div>
          <a
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 underline mt-1 block"
          >
            View on Etherscan →
          </a>
        </div>
      )}
    </div>
  )}