import React from 'react';
import { NavigationTab, UserRole, UserProfile } from '../types';
import { 
  Home, TrendingUp, Zap, Wallet, User, Gift, LandPlot, Headphones, 
  ShieldCheck, Share2, Settings, ShieldAlert, X, AlertTriangle, ChevronRight, Crown, LogOut,
  Users, CheckSquare, FileCheck, Megaphone, Landmark, Shield
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  userRole: UserRole;
  user?: UserProfile;
  unreadNotifications: number;
  onLogout?: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: any;
  badge?: string;
  highlight?: boolean;
  isAdminOnly?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
  userRole,
  user,
  unreadNotifications,
  onLogout
}) => {
  if (!isOpen) return null;

  const isAdminRole = userRole === 'admin' || userRole === 'sub_admin';

  const adminNavItems: NavItem[] = [
    { id: 'admin', label: 'Admin Control Suite', icon: ShieldAlert, highlight: true },
    { id: 'admin', label: 'User Management Directory', icon: Users, badge: 'USERS' },
    { id: 'admin', label: 'Deposit & Withdraw Approvals', icon: CheckSquare, badge: 'APPROVALS' },
    { id: 'admin', label: 'KYC Document Verification', icon: FileCheck, badge: 'KYC' },
    { id: 'admin', label: 'Global Broadcast Alerts', icon: Megaphone },
    { id: 'admin', label: 'System Vault & Liquidity', icon: Landmark }
  ];

  const baseNavItems: NavItem[] = [
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
    { id: 'settings', label: 'Preferences & Language', icon: Settings }
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
              onNavigate(isAdminRole ? 'admin' : 'profile');
              onClose();
            }}
            className={`my-4 p-3 rounded-xl bg-[#080D18] border ${
              isAdminRole ? 'border-[#F4C542]/60 shadow-[0_0_15px_rgba(244,197,66,0.15)]' : 'border-slate-800'
            } flex items-center gap-3 cursor-pointer hover:border-[#F4C542] transition-colors`}
          >
            <div className="w-10 h-10 rounded-full border border-[#F4C542] overflow-hidden shrink-0 bg-slate-900 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#F4C542]" />
              )}
            </div>
            <div className="flex-1 truncate">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-xs text-slate-100 truncate">
                  {user?.fullName || (isAdminRole ? 'Super Admin' : 'Alex Morgan')}
                </span>
                {isAdminRole ? (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-gradient-to-r from-[#F4C542] to-[#FFD700] text-black uppercase tracking-wider shrink-0">
                    {userRole === 'admin' ? 'SUPER ADMIN' : 'SUB ADMIN'}
                  </span>
                ) : (
                  <Crown className="w-3.5 h-3.5 text-[#F4C542] shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                ID: {user?.id || 'USR-8829401'} {user?.username ? `• @${user.username}` : ''}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#F4C542]" />
          </div>

          {/* ADMIN CONTROL PANEL SECTION (If Admin/Sub-Admin) */}
          {isAdminRole && (
            <div className="mb-4 p-2.5 rounded-2xl bg-amber-500/10 border border-[#F4C542]/40 space-y-1">
              <div className="px-2 py-1 flex items-center justify-between border-b border-[#F4C542]/20 mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F4C542] flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin Capabilities
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F4C542] text-black">
                  ACTIVE
                </span>
              </div>

              {adminNavItems.map((item, idx) => {
                const IconComp = item.icon;
                const isActive = activeTab === 'admin' && idx === 0;
                return (
                  <button
                    key={`admin-${idx}`}
                    onClick={() => {
                      onNavigate('admin');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-[#F4C542] text-black shadow-md shadow-[#F4C542]/20'
                        : 'text-[#F4C542] hover:bg-[#F4C542]/15 hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-black/40 text-[#F4C542] border border-[#F4C542]/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Navigation Links */}
          <div>
            <nav className="space-y-1">
              {baseNavItems.map(item => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl font-medium text-xs transition-all ${
                      isActive
                        ? 'bg-[#F4C542] text-black font-bold shadow-lg shadow-[#F4C542]/20'
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

        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          {onLogout && (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold text-xs transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out Account</span>
            </button>
          )}

          <div className="text-[11px] text-slate-500 text-center font-mono">
            <div>USDT REWARD PRO v3.5.0</div>
            <div className="text-[10px]">© 2026 Instant Yield Exchange</div>
          </div>
        </div>

      </div>

      {/* Click backdrop to close */}
      <div className="flex-1" onClick={onClose} />

    </div>
  );
};

