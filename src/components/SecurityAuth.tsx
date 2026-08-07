import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Lock, Smartphone, KeyRound, CheckCircle2, User, Fingerprint, Award } from 'lucide-react';

interface SecurityAuthProps {
  user: UserProfile;
}

export const SecurityAuth: React.FC<SecurityAuthProps> = ({ user }) => {
  const [is2FA, setIs2FA] = useState(user.is2FAEnabled);
  const [biometrics, setBiometrics] = useState(true);
  const [kycSubmitted, setKycSubmitted] = useState(false);

  return (
    <div className="my-6 space-y-6 max-w-4xl mx-auto">
      
      {/* Profile Header */}
      <div className="glass-gold-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.fullName} className="w-16 h-16 rounded-full border-2 border-[#F4C542] object-cover" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              {user.fullName} <span className="px-2 py-0.5 rounded text-[10px] bg-gradient-to-r from-[#F4C542] to-[#FFD700] text-black font-extrabold">VIP {user.vipLevel}</span>
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-1 space-x-3">
              <span>ID: {user.id}</span>
              <span>•</span>
              <span>Email: {user.email}</span>
            </div>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Verified Level 3
        </div>
      </div>

      {/* Security & 2FA Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-gold-card p-6 space-y-4">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#F4C542]" /> Two-Factor Authentication (2FA)
          </h3>
          <p className="text-xs text-slate-400">
            Protect your wallet withdrawals and trading authorizations using Google Authenticator or SMS OTP.
          </p>

          <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Google Authenticator</span>
            <button
              onClick={() => setIs2FA(!is2FA)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                is2FA ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {is2FA ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Biometric Passkey Login</span>
            <button
              onClick={() => setBiometrics(!biometrics)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                biometrics ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {biometrics ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>

        {/* KYC Verification */}
        <div className="glass-gold-card p-6 space-y-4">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F4C542]" /> KYC Identity Verification
          </h3>
          <p className="text-xs text-slate-400">
            Verify your government ID or Passport to unlock higher daily withdrawal limits up to $100,000 USD.
          </p>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Level 2 Verified (Passport & Face Check Completed)
          </div>

          <button
            onClick={() => setKycSubmitted(true)}
            className="w-full py-2.5 btn-gold-outline text-xs font-bold text-[#F4C542]"
          >
            {kycSubmitted ? 'KYC Status: Fully Verified' : 'Upgrade to VIP Level 4 KYC'}
          </button>
        </div>

      </div>

    </div>
  );
};
