import React, { useState } from 'react';
import { Share2, Copy, Check, Users, DollarSign, Network } from 'lucide-react';

interface ReferralSystemProps {
  referralCode: string;
  config?: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({ referralCode, config }) => {
  const t1 = config?.tier1 ?? 10;
  const t2 = config?.tier2 ?? 5;
  const t3 = config?.tier3 ?? 2;

  const [copied, setCopied] = useState(false);
  const refLink = `https://usdtrewardpro.com/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-gold-card p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider">
            <Share2 className="w-4 h-4" /> Affiliate Commission Program
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">
            Invite Friends & Earn Commission
          </h2>
        </div>
      </div>

      {/* Referral Link Box */}
      <div className="glass-gold-card p-6 space-y-3">
        <label className="block text-xs font-semibold text-slate-300">Your Exclusive Referral Link</label>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#080D18] border border-[#F4C542]/40">
          <span className="font-mono text-xs text-slate-200 truncate flex-1">{refLink}</span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 btn-gold-gradient text-xs font-bold text-black flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-gold-card p-5 text-center">
          <Users className="w-6 h-6 text-[#F4C542] mx-auto mb-1" />
          <span className="text-xs text-slate-400 block">Invited Friends</span>
          <span className="text-xl font-extrabold text-slate-100 font-mono">14 Active</span>
        </div>

        <div className="glass-gold-card p-5 text-center">
          <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
          <span className="text-xs text-slate-400 block">Total Commission Earned</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono">$342.50 USDT</span>
        </div>

        <div className="glass-gold-card p-5 text-center">
          <Network className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <span className="text-xs text-slate-400 block">Commission Tiers</span>
          <span className="text-xs font-bold text-slate-200 font-mono">Level 1 ({t1}%) • L2 ({t2}%) • L3 ({t3}%)</span>
        </div>
      </div>

      {/* Referral Tree breakdown */}
      <div className="glass-gold-card p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-100">Referral Commission Tree Structure</h3>
        <div className="divide-y divide-slate-800 text-xs font-mono">
          <div className="py-2.5 flex justify-between">
            <span>Tier 1 (Direct Referrals):</span>
            <span className="font-bold text-[#F4C542]">{t1}% of trading yield fee</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span>Tier 2 (Secondary Referrals):</span>
            <span className="font-bold text-slate-300">{t2}% of trading yield fee</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span>Tier 3 (Extended Network):</span>
            <span className="font-bold text-slate-400">{t3}% of trading yield fee</span>
          </div>
        </div>
      </div>

    </div>
  );
};
