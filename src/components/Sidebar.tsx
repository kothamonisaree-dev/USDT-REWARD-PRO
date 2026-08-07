import React from 'react';
import { NavigationTab, UserRole } from '../types';
import { 
  Home, TrendingUp, Zap, Wallet, User, Gift, LandPlot, Headphones, 
  ShieldCheck, Share2, Settings, ShieldAlert, X, AlertTriangle, ChevronRight, Crown 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  userRole: UserRole;
  unreadNotifications: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  userRole,
  unreadNotifications
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'trading', label: 'Live Trading Engine', icon: TrendingUp },
    { id: 'invest', label: 'Investment Packages', icon: Zap },
    { id: 'wallet', label: 'Luxury Wallet', icon: Wallet },
    { id: 'profile', label: 'User Profile & Identity', icon: User },
    { id: 'bonus', label: 'Bonus Reward Center', icon: Gift },
    { id: 'loan', label: 'Crypto Loan System', icon: LandPlot },
    { id: 'loan-notice', label: 'Official Loan Notice', icon: AlertTriangle, badge: 'OVERDUE' },
    { id: 'support', label: '24/7 Customer Care', icon: Headphones },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
    { id: 'referral', label: 'Referral & Commission', icon: Share2 },
    { id: 'settings', label: 'Preferences & Language', icon: Settings },
    { id: 'admin', label: 'Admin Control Suite', icon: ShieldAlert, highlight: true }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex animate-in fade-in duration-200">
      
      {/* Sidebar Drawer Container */}
      <div className="w-80 max-w-[85vw] h-full bg-[#0B1220] border-r border-[#F4C542]/30 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl relative">
        
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#B8860B] to-[#FFD700] p-0.5 shadow-md flex items-center justify-center font-bold text-black">
                ₮
              </div>
              <span className="font-extrabold text-sm tracking-wider text-slate-100">
                USDT REWARD <span className="text-gold-gradient">PRO</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Banner */}
          <div 
            onClick={() => {
              onNavigate('profile');
              onClose();
            }}
            className="my-4 p-3 rounded-xl bg-[#080D18] border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-[#F4C542]/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-[#F4C542] overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs text-slate-100">Alex Morgan</span>
                <Crown className="w-3 h-3 text-[#F4C542]" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">ID: USR-8829401</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 my-2">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as NavigationTab);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-[#F4C542] text-black font-bold shadow-lg shadow-[#F4C542]/20'
                      : item.highlight
                      ? 'bg-amber-500/10 border border-amber-500/30 text-[#F4C542] hover:bg-amber-500/20'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-extrabold bg-red-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono">
          <div>USDT REWARD PRO v3.5.0</div>
          <div className="text-[10px]">© 2026 Instant Yield Exchange</div>
        </div>

      </div>

      {/* Click backdrop to close */}
      <div className="flex-1" onClick={onClose} />

    </div>
  );
};
