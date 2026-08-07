import React from 'react';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Headphones, LandPlot } from 'lucide-react';
import { NavigationTab } from '../types';

interface QuickActionsProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenDepositModal: () => void;
  onOpenWithdrawModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigate,
  onOpenDepositModal,
  onOpenWithdrawModal
}) => {
  const actions = [
    {
      id: 'deposit',
      title: 'Deposit',
      icon: ArrowDownLeft,
      color: 'from-amber-500/20 to-yellow-600/10 border-[#F4C542]/40 text-[#F4C542]',
      onClick: onOpenDepositModal
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: ArrowUpRight,
      color: 'from-blue-500/20 to-indigo-600/10 border-blue-500/30 text-blue-400',
      onClick: onOpenWithdrawModal
    },
    {
      id: 'trading',
      title: 'Trading',
      icon: TrendingUp,
      color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
      onClick: () => onNavigate('trading')
    },
    {
      id: 'support',
      title: 'Customer Care',
      icon: Headphones,
      color: 'from-purple-500/20 to-pink-600/10 border-purple-500/30 text-purple-400',
      onClick: () => onNavigate('support')
    },
    {
      id: 'loan',
      title: 'Loan',
      icon: LandPlot,
      color: 'from-[#F4C542]/20 to-amber-700/10 border-[#F4C542]/40 text-amber-300',
      onClick: () => onNavigate('loan')
    }
  ];

  return (
    <section className="my-6">
      <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
        {actions.map((act) => {
          const IconComponent = act.icon;
          return (
            <button
              key={act.id}
              onClick={act.onClick}
              className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-[18px] bg-gradient-to-b ${act.color} bg-[#0D121F]/80 border backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_25px_rgba(244,197,66,0.15)] active:scale-95 overflow-hidden`}
            >
              {/* Subtle hover shimmer ripple overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#080D18] border border-slate-800 flex items-center justify-center mb-2 shadow-inner group-hover:border-[#F4C542]/50 transition-colors">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>

              <span className="text-[11px] sm:text-xs font-semibold text-slate-200 tracking-wide group-hover:text-white transition-colors text-center line-clamp-1">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
