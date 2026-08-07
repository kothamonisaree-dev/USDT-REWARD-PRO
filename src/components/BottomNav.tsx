import React from 'react';
import { NavigationTab } from '../types';
import { Home, TrendingUp, Zap, Wallet, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'invest', label: 'Invest', icon: Zap },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-lg border-t border-[#F4C542]/20 px-3 py-2 sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id as NavigationTab)}
              className="relative flex flex-col items-center justify-center py-1 px-3 text-center active:scale-95 transition-transform"
            >
              {/* Active Glow Indicator */}
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 rounded-full bg-gradient-to-r from-[#F4C542] to-[#FFD700] shadow-[0_0_10px_#F4C542]" />
              )}

              <div className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'text-[#F4C542] bg-[#F4C542]/10 scale-110' : 'text-slate-400'
              }`}>
                <IconComp className="w-5 h-5" />
              </div>

              <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${
                isActive ? 'text-[#F4C542]' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
