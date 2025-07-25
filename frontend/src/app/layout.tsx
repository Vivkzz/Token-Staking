import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { WalletConnector } from '@/components/wallet-connector'
import { Zap } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Staking dApp',
  description: 'A decentralized staking application built on Ethereum',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen bg-black">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 z-0" />
            <header className="relative z-30 bg-black/50 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-white">StakeVault</h1>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href="/mint" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Get Faucet
                    </Link>
                    <WalletConnector />
                  </div>
                </div>
              </div>
            </header>
            <main className="relative z-20">
              {children}
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #475569',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}