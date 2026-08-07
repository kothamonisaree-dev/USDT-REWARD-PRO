import React, { useState } from 'react';
import { WalletState } from '../types';
import { Eye, EyeOff, RefreshCw, Copy, Check, ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

interface BalanceCardProps {
  wallet: WalletState;
  onDeposit: () => void;
  onWithdraw: () => void;
  onRefresh: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  wallet,
  onDeposit,
  onWithdraw,
  onRefresh
}) => {
  const [hideBalance, setHideBalance] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const mask = (val: number | string) => (hideBalance ? '••••••••' : val);

  return (
    <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0F172A] via-[#0D121F] to-[#050505] border border-[#F4C542]/30 p-6 shadow-2xl shadow-[#F4C542]/5 transition-all duration-300 my-6">
      
      {/* Decorative Gold Glow Circles */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F4C542]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Title & Controls */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542]">
            <Wallet className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#F4C542]">
            LUXURY WALLET BALANCE
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Hide/Show Toggle */}
          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="p-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-300 hover:text-[#F4C542] hover:border-[#F4C542]/40 transition-colors"
            title={hideBalance ? "Show Balance" : "Hide Balance"}
          >
            {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Refresh Balance */}
          <button
            onClick={handleRefreshClick}
            className="p-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-300 hover:text-[#F4C542] hover:border-[#F4C542]/40 transition-colors"
            title="Refresh Wallet Balance"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#F4C542]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Balance Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 my-2">
        
        {/* Left 8 columns: Total Balance & USD/USDT split */}
        <div className="md:col-span-8 space-y-3">
          <div className="text-xs text-slate-400 font-medium">Total Account Valuation</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-gold-gradient tracking-tight font-mono">
              ${hideBalance ? '••••••••' : wallet.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-slate-400">USD Equivalent</span>
          </div>

          {/* USD & USDT Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#080D18]/90 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">USDT Holdings</div>
              <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                {mask(`${wallet.usdtBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT`)}
              </div>
            </div>
            <div className="bg-[#080D18]/90 border border-slate-800/80 rounded-xl p-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">USD Fiat Value</div>
              <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">
                {mask(`$${wallet.usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`)}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 columns: Wallet Graphic & Address Copy */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#080D18]/80 border border-[#F4C542]/20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F4C542] to-[#FFD700] p-0.5 shadow-lg shadow-[#F4C542]/20 mb-2">
            <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center text-[#F4C542]">
              <span className="text-xl font-bold">₮</span>
            </div>
          </div>

          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            TRC20 Wallet Address
          </span>

          <div className="flex items-center gap-2 mt-1 w-full justify-center">
            <span className="text-xs font-mono text-slate-300 truncate max-w-[130px]">
              {wallet.walletAddress}
            </span>
            <button
              onClick={handleCopyAddress}
              className="p-1.5 rounded-lg bg-[#0F172A] border border-slate-700 text-[#F4C542] hover:bg-[#F4C542]/20 transition-all text-xs flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          {copied && <span className="text-[10px] text-emerald-400 font-medium mt-1">Address Copied!</span>}
        </div>

      </div>

      {/* Buttons Bar */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800/80 relative z-10">
        <button
          onClick={onDeposit}
          className="btn-gold-gradient py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold active:scale-98"
        >
          <ArrowDownLeft className="w-4 h-4" /> Deposit (Min $50)
        </button>

        <button
          onClick={onWithdraw}
          className="btn-gold-outline py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold active:scale-98 rounded-xl"
        >
          <ArrowUpRight className="w-4 h-4" /> Withdraw
        </button>
      </div>

    </div>
  );
};
