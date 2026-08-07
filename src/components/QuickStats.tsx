import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Zap, Gift, Check } from 'lucide-react';
import { WalletState } from '../types';
import confetti from 'canvas-confetti';

interface QuickStatsProps {
  wallet: WalletState;
  onClaimDailyReward: (amount: number) => void;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ wallet, onClaimDailyReward }) => {
  const [claimedToday, setClaimedToday] = useState(false);

  const handleClaim = () => {
    if (claimedToday) return;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    setClaimedToday(true);
    onClaimDailyReward(2.50); // $2.50 daily login reward
  };

  const stats = [
    {
      label: 'Total Deposit',
      value: `$${wallet.totalDeposit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: ArrowDownLeft,
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    },
    {
      label: 'Total Withdraw',
      value: `$${wallet.totalWithdraw.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      color: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    },
    {
      label: 'Total Profit',
      value: `+$${wallet.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    },
    {
      label: 'Active Investment',
      value: `$${wallet.activeInvestmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: Zap,
      color: 'text-[#F4C542] bg-[#F4C542]/10 border-[#F4C542]/20'
    }
  ];

  return (
    <section className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Account Overview & Daily Bonus
        </h3>

        {/* Daily Reward Button */}
        <button
          onClick={handleClaim}
          disabled={claimedToday}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            claimedToday 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
              : 'btn-gold-gradient text-black animate-gold-pulse cursor-pointer'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          {claimedToday ? (
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> $2.50 Claimed Today</span>
          ) : (
            'Claim Daily Reward ($2.50)'
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="glass-gold-card p-4 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${item.color}`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-100 font-mono tracking-tight">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
