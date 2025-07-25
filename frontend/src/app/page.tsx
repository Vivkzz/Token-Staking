import { BalanceDisplay } from '@/components/balance-display'
import { StakingInterface } from '@/components/staking-interface'

export default function Home() {
  return (
    <main className="pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Balances */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Your Balances</h3>
              <p className="text-slate-400">Overview of your token balances and staking position</p>
            </div>
            <BalanceDisplay />
          </div>

          {/* Right Column - Staking Interface */}
          <div className="lg:col-span-1">
            {/* Staking Interface */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Staking</h3>
              <p className="text-slate-400">Stake or unstake your MTK tokens</p>
            </div>
            <StakingInterface />
          </div>
        </div>
      </div>
    </main>
  )
}