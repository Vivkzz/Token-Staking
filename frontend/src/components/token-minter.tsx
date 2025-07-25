'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { MyTokenABI } from '@/config/contracts'
import { CONTRACTS } from '@/config/wagmi'
import { Coins, Gift, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export function TokenMinter() {
  const { address, isConnected } = useAccount()
  const [mintAmount, setMintAmount] = useState('1000')
  const [isExpanded, setIsExpanded] = useState(false)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Check if user is the owner (can mint tokens)
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.MyToken,
    abi: MyTokenABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const isTransacting = isPending || isConfirming

  const handleFaucet = async () => {
    try {
      await writeContract({
        address: CONTRACTS.MyToken,
        abi: MyTokenABI,
        functionName: 'faucet',
      })
      
      toast.success('Faucet transaction sent!')
      
      // Refetch balance after transaction
      setTimeout(() => {
        refetchBalance()
      }, 2000)
    } catch (error: any) {
      toast.error(`Faucet failed: ${error.shortMessage || error.message}`)
    }
  }

  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return '0.00'
    return parseFloat(formatEther(balance)).toFixed(4)
  }

  if (!isConnected) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
            <Gift className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Get Test Tokens</h3>
            <p className="text-sm text-slate-400">Connect wallet to get MTK tokens from the faucet</p>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-slate-400 text-sm">Connect your wallet to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
            <Gift className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Get Test Tokens</h3>
            <p className="text-sm text-slate-400">
              Current balance: {formatBalance(tokenBalance)} MTK
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleFaucet}
        disabled={isTransacting}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
      >
        {isTransacting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Coins className="w-5 h-5" />
        )}
        {isTransacting ? 'Getting Tokens...' : 'Get 1,000 MTK from Faucet'}
      </button>

      {/* Instructions */}
      <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-3 mt-4">
        <h4 className="text-sm font-medium text-slate-300 mb-2">How to get test tokens:</h4>
        <ul className="text-xs text-slate-400 space-y-1">
          <li>• Connect your wallet to the Sepolia testnet.</li>
          <li>• Click the "Get 1,000 MTK from Faucet" button.</li>
          <li>• Confirm the transaction in your wallet.</li>
          <li>• These are test tokens with no real value.</li>
        </ul>
      </div>

      {/* Transaction Status */}
      {hash && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-400">
            {isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isConfirming ? 'Transaction confirming...' : 'Tokens received successfully!'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}