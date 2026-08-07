import React, { useState, useEffect } from 'react';
import { Menu, Bell, X, ArrowRight, Clock, LogOut } from 'lucide-react';
import { NotificationItem, UserRole } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (tab: any) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  notifications,
  onMarkNotificationsRead,
  userRole,
  onRoleChange,
  onNavigate,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [laTime, setLaTime] = useState<string>('');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        month: 'short',
        day: 'numeric'
      };
      setLaTime(new Intl.DateTimeFormat('en-US', options).format(now) + ' (LA, USA)');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-[#F4C542]/20 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Hamburger Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2.5 rounded-xl bg-[#0D121F] border border-[#F4C542]/30 text-[#F4C542] hover:bg-[#F4C542]/10 transition-all active:scale-95"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Role selector dropdown badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D121F] border border-[#F4C542]/20 text-xs">
            <span className="text-slate-400">Role:</span>
            <select
              value={userRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-[#F4C542] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="user" className="bg-[#0D121F] text-slate-200">User Dashboard</option>
              <option value="admin" className="bg-[#0D121F] text-slate-200">Admin Panel</option>
            </select>
          </div>
        </div>

        {/* Center: Premium Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B8860B] via-[#F4C542] to-[#FFD700] p-0.5 shadow-[0_0_15px_rgba(244,197,66,0.4)] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center">
              <span className="text-[#F4C542] font-extrabold text-lg leading-none">₮</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-slate-100 group-hover:text-[#F4C542] transition-colors">
                USDT REWARD <span className="text-gold-gradient">PRO</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-[#F4C542] to-[#FFD700] text-black uppercase tracking-widest shadow-sm">
                VIP
              </span>
            </div>
            <span className="text-[10px] text-slate-400 tracking-wider font-medium hidden xs:inline-block">
              INSTANT CRYPTO YIELD PLATFORM
            </span>
          </div>
        </div>

        {/* Right: Time & Notification Bell */}
        <div className="flex items-center gap-3">
          
          {/* LA Time display on desktop */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-[#0D121F] px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-[#F4C542]" />
            <span className="font-mono text-[11px]">{laTime}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (unreadCount > 0) onMarkNotificationsRead();
              }}
              className="p-2.5 rounded-xl bg-[#0D121F] border border-[#F4C542]/30 text-[#F4C542] hover:bg-[#F4C542]/10 transition-all relative active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-lg shadow-red-500/50">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Modal */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0D121F] border border-[#F4C542]/40 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080D18]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#F4C542]" />
                    <h3 className="font-bold text-sm text-slate-100">Notifications</h3>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-2">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl transition-colors ${
                          !item.isRead ? 'bg-[#F4C542]/5 border-l-2 border-[#F4C542]' : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                          <span className="text-[10px] text-slate-500 shrink-0">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-slate-800 bg-[#080D18] text-center">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigate('loan-notice');
                    }}
                    className="text-xs text-[#F4C542] hover:underline flex items-center justify-center gap-1 w-full py-1"
                  >
                    Check Loan Overdue Notice <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
