'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function WalletConnector() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [showConnectors, setShowConnectors] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleConnect = (connector: any) => {
    connect(
      { connector },
      {
        onSuccess: () => {
          toast.success('Wallet connected successfully!')
          setShowConnectors(false)
        },
        onError: (error) => {
          toast.error(`Failed to connect: ${error.message}`)
        },
      }
    )
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isMounted) {
    return null
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        {/* Network Badge */}
        <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
          {chain?.name || 'Unknown Network'}
        </div>
        
        {/* Address Display */}
        <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 font-mono text-sm">
          {formatAddress(address!)}
        </div>
        
        {/* Disconnect Button */}
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={16} />
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Wallet size={20} />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
        <ChevronDown size={16} className={`transition-transform ${showConnectors ? 'rotate-180' : ''}`} />
      </button>

      {/* Connector Dropdown */}
      {showConnectors && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="text-sm text-slate-400 px-3 py-2 font-medium">Choose Wallet</div>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700 rounded-md text-left text-slate-200 hover:text-white transition-colors disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Wallet size={16} />
                </div>
                <div>
                  <div className="font-medium">{connector.name}</div>
                  <div className="text-xs text-slate-400">
                    {connector.name === 'MetaMask' ? 'Browser Extension' : 'Injected Wallet'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {showConnectors && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowConnectors(false)}
        />
      )}
    </div>
  )
}