import React from 'react';
import { UserProfile, NavigationTab } from '../types';
import { ChevronRight, ShieldCheck, ShieldAlert, Shield, Clock, Crown } from 'lucide-react';

interface ProfileCardProps {
  user: UserProfile;
  onNavigate: (tab: NavigationTab) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onNavigate }) => {
  const kycStatus = user.kycStatus || 'unverified';

  return (
    <div 
      onClick={() => onNavigate('profile')}
      className="glass-gold-card p-4 sm:p-5 flex items-center justify-between cursor-pointer group transition-all duration-300 hover:border-[#F4C542]/50 hover:shadow-[0_8px_30px_rgba(244,197,66,0.15)] my-4"
    >
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* Avatar with glowing ring */}
        <div className="relative">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#B8860B] via-[#F4C542] to-[#FFD700] shadow-[0_0_12px_rgba(244,197,66,0.3)]">
            <img 
              src={user.avatar} 
              alt={user.fullName} 
              className="w-full h-full rounded-full object-cover border-2 border-[#050505]"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#0D121F] rounded-full p-1 border border-[#F4C542]/50">
            {kycStatus === 'verified' ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : kycStatus === 'pending' ? (
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            ) : kycStatus === 'rejected' ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-slate-400" />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-[#F4C542] transition-colors">
              {user.fullName}
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F4C542] to-[#FFD700] text-black shadow-sm">
              <Crown className="w-3 h-3 fill-black" /> VIP {user.vipLevel}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400 font-mono">
            <span>ID: <strong className="text-slate-200">{user.id}</strong></span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            {kycStatus === 'verified' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified
              </span>
            ) : kycStatus === 'pending' ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> KYC Pending
              </span>
            ) : kycStatus === 'rejected' ? (
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> KYC Rejected
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Unverified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Arrow */}
      <div className="w-9 h-9 rounded-xl bg-[#080D18] border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#F4C542] group-hover:border-[#F4C542]/40 group-hover:translate-x-1 transition-all">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
};
