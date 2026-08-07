import React, { useState, useEffect } from 'react';
import { InvestmentPlan, ActiveInvestment, WalletState } from '../types';
import { Zap, Clock, ShieldCheck, CheckCircle2, Lock, Flame, ArrowRight, X, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InvestmentPackagesProps {
  plans: InvestmentPlan[];
  wallet: WalletState;
  activeInvestment: ActiveInvestment | null;
  onStartInvestment: (plan: InvestmentPlan, amount: number) => void;
  onInvestmentCompleted: (result: { amount: number; profit: number; total: number; planTitle: string }) => void;
}

export const InvestmentPackages: React.FC<InvestmentPackagesProps> = ({
  plans,
  wallet,
  activeInvestment,
  onStartInvestment,
  onInvestmentCompleted
}) => {
  // Modal state
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amountInput, setAmountInput] = useState<string>('100');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Processing state step: 'idle' | 'checking_balance' | 'verifying_password' | 'processing' | 'success'
  const [modalStep, setModalStep] = useState<'idle' | 'checking_balance' | 'verifying_password' | 'processing' | 'success'>('idle');

  // Profit Popup state
  const [showProfitPopup, setShowProfitPopup] = useState<{
    investment: number;
    profit: number;
    total: number;
    planTitle: string;
  } | null>(null);

  // Sound / Celebration trigger on completion
  useEffect(() => {
    if (activeInvestment && activeInvestment.secondsRemaining === 0 && activeInvestment.status === 'running') {
      const profit = (activeInvestment.amount * activeInvestment.profitPercentage) / 100;
      const total = activeInvestment.amount + profit;

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 }
      });

      setShowProfitPopup({
        investment: activeInvestment.amount,
        profit,
        total,
        planTitle: activeInvestment.planTitle
      });

      onInvestmentCompleted({
        amount: activeInvestment.amount,
        profit,
        total,
        planTitle: activeInvestment.planTitle
      });
    }
  }, [activeInvestment, onInvestmentCompleted]);

  const handleOpenModal = (plan: InvestmentPlan) => {
    if (activeInvestment && activeInvestment.status === 'running') {
      alert('An investment is already active! Please wait for the countdown to complete.');
      return;
    }
    setSelectedPlan(plan);
    setAmountInput(plan.minInvestment.toString());
    setPasswordInput('');
    setErrorMsg('');
    setModalStep('idle');
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setModalStep('idle');
    setErrorMsg('');
  };

  const handleConfirmInvestment = () => {
    if (!selectedPlan) return;
    const amountNum = parseFloat(amountInput);

    // Rules validation
    if (isNaN(amountNum) || amountNum < selectedPlan.minInvestment) {
      setErrorMsg(`Minimum investment for ${selectedPlan.durationSeconds}s is $${selectedPlan.minInvestment}`);
      return;
    }
    if (amountNum > selectedPlan.maxInvestment) {
      setErrorMsg(`Maximum investment limit is $${selectedPlan.maxInvestment.toLocaleString()}`);
      return;
    }
    if (amountNum > wallet.usdtBalance) {
      setErrorMsg(`Insufficient USDT balance ($${wallet.usdtBalance.toFixed(2)} available)`);
      return;
    }
    if (!passwordInput || passwordInput.length < 4) {
      setErrorMsg('Trading Password is required (min 4 characters)');
      return;
    }

    setErrorMsg('');
    setModalStep('checking_balance');

    // Simulate verification pipeline
    setTimeout(() => {
      setModalStep('verifying_password');
      setTimeout(() => {
        setModalStep('processing');
        setTimeout(() => {
          setModalStep('success');
        }, 800);
      }, 800);
    }, 800);
  };

  const handleModalContinue = () => {
    if (selectedPlan) {
      const amountNum = parseFloat(amountInput);
      onStartInvestment(selectedPlan, amountNum);
    }
    handleCloseModal();
  };

  return (
    <section id="investment-section" className="my-10 relative">
      
      {/* Header Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4C542]/10 border border-[#F4C542]/30 text-[#F4C542] text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" /> High-Yield Vaults
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          Premium Investment Plans
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Choose your preferred investment duration and earn fixed returns after the countdown completes.
        </p>
      </div>

      {/* Three Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isCurrentActive = activeInvestment?.planId === plan.id && activeInvestment.status === 'running';
          const isAnyRunning = activeInvestment?.status === 'running';

          const estProfit = (parseFloat(amountInput || '100') * plan.profitPercentage) / 100;
          const estReturn = parseFloat(amountInput || '100') + estProfit;

          return (
            <div
              key={plan.id}
              className={`glass-gold-card p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${
                isCurrentActive ? 'border-2 border-[#F4C542] shadow-[0_0_30px_rgba(244,197,66,0.3)] bg-[#0D121F]' : ''
              }`}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-[#080D18] border border-[#F4C542]/40 text-[#F4C542]">
                <Clock className="w-3 h-3" /> {plan.durationSeconds} Seconds
              </div>

              <div>
                {/* Premium Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B8860B] to-[#F4C542] p-0.5 shadow-lg shadow-[#F4C542]/20 mb-4">
                  <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center text-[#F4C542]">
                    <Flame className="w-6 h-6 animate-bounce" />
                  </div>
                </div>

                <h3 className="font-extrabold text-lg text-slate-100">{plan.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{plan.description}</p>

                {/* Circular Profit Indicator */}
                <div className="my-6 p-4 rounded-2xl bg-[#080D18]/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
                      Guaranteed Profit
                    </span>
                    <span className="text-3xl font-extrabold text-gold-gradient font-mono">
                      +{plan.profitPercentage}%
                    </span>
                  </div>

                  {/* Circular visual ring */}
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="28" cy="28" r="22" stroke="rgba(244,197,66,0.15)" strokeWidth="4" fill="none" />
                      <circle 
                        cx="28" cy="28" r="22" 
                        stroke="#F4C542" 
                        strokeWidth="4" 
                        fill="none" 
                        strokeDasharray="138" 
                        strokeDashoffset={138 - (138 * plan.profitPercentage) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-extrabold text-[#F4C542]">
                      {plan.profitPercentage}%
                    </span>
                  </div>
                </div>

                {/* Amount Limits */}
                <div className="space-y-2 text-xs text-slate-300 font-mono mb-6">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Min Investment:</span>
                    <span className="font-bold text-[#F4C542]">${plan.minInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Max Investment:</span>
                    <span className="font-bold text-slate-200">${plan.maxInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Button or Circular Live Countdown Timer */}
              {isCurrentActive ? (
                <div className="p-4 rounded-2xl bg-[#080D18] border border-[#F4C542]/50 text-center flex flex-col items-center">
                  <span className="text-[11px] font-bold text-[#F4C542] uppercase tracking-wider mb-2 animate-pulse">
                    Investment Active
                  </span>
                  
                  {/* Live Circular Countdown Timer */}
                  <div className="relative w-24 h-24 flex items-center justify-center my-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(244,197,66,0.15)" strokeWidth="6" fill="none" />
                      <circle 
                        cx="48" cy="48" r="40" 
                        stroke="#F4C542" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeDasharray="251" 
                        strokeDashoffset={251 - (251 * activeInvestment.secondsRemaining) / activeInvestment.durationSeconds}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-white font-mono">
                        {activeInvestment.secondsRemaining}
                      </span>
                      <span className="text-[9px] text-slate-400 uppercase">Sec Left</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-1">
                    Staked: <strong className="text-slate-200">${activeInvestment.amount}</strong> → Expected: <strong className="text-emerald-400">${activeInvestment.expectedReturn}</strong>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenModal(plan)}
                  disabled={isAnyRunning}
                  className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    isAnyRunning 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'btn-gold-gradient active:scale-98'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-black" /> Start Investment
                </button>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal: Confirm Investment */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-gold-card max-w-md w-full p-6 relative overflow-hidden shadow-2xl">
            
            {/* Modal Close */}
            <button 
              onClick={handleCloseModal} 
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Secure Investment Confirmation
            </div>
            <h3 className="text-xl font-extrabold text-slate-100">
              Confirm Investment
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {selectedPlan.title} ({selectedPlan.profitPercentage}% Profit in {selectedPlan.durationSeconds}s)
            </p>

            {/* Steps feedback */}
            {modalStep !== 'idle' && modalStep !== 'success' ? (
              <div className="my-8 text-center py-8 space-y-4">
                <div className="w-12 h-12 border-4 border-[#F4C542]/30 border-t-[#F4C542] rounded-full animate-spin mx-auto" />
                <div className="text-sm font-bold text-[#F4C542] capitalize animate-pulse">
                  {modalStep.replace('_', ' ')}...
                </div>
              </div>
            ) : modalStep === 'success' ? (
              <div className="my-6 text-center py-4 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-emerald-400">Investment Successful</h4>
                <p className="text-xs text-slate-300">
                  Your investment has been activated successfully. The countdown timer is now running.
                </p>
                <button
                  onClick={handleModalContinue}
                  className="w-full py-3 btn-gold-gradient text-sm font-bold mt-4"
                >
                  Continue →
                </button>
              </div>
            ) : (
              <div className="space-y-4 my-5">
                
                {/* Investment Amount input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Investment Amount (USD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder={`Min $${selectedPlan.minInvestment}`}
                      className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
                    />
                    <span className="absolute right-3 top-3 text-xs font-bold text-[#F4C542]">USDT</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>Min: ${selectedPlan.minInvestment} | Max: ${selectedPlan.maxInvestment.toLocaleString()}</span>
                    <span>Available: ${wallet.usdtBalance.toFixed(2)}</span>
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#F4C542]" /> Trading Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter trading password"
                    className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
                  />
                </div>

                {/* Expected Return Calculation */}
                <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Profit Rate:</span>
                    <span className="font-bold text-emerald-400">+{selectedPlan.profitPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Profit:</span>
                    <span className="font-bold text-emerald-400">
                      +${((parseFloat(amountInput || '0') * selectedPlan.profitPercentage) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-200 font-bold">Total Estimated Return:</span>
                    <span className="font-extrabold text-[#F4C542] text-sm">
                      ${(parseFloat(amountInput || '0') + (parseFloat(amountInput || '0') * selectedPlan.profitPercentage) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleCloseModal}
                    className="py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInvestment}
                    className="py-3 px-4 btn-gold-gradient text-xs font-bold text-black"
                  >
                    Confirm Investment
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Profit Reward Popup at Top-Middle */}
      {showProfitPopup && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 animate-in fade-in slide-in-from-top-6 duration-300">
          <div className="glass-gold-card p-6 border-2 border-emerald-400/80 shadow-[0_10px_50px_rgba(16,185,129,0.3)] bg-[#0B1424] text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-extrabold text-emerald-400 flex items-center justify-center gap-1">
              ✔ Trade Completed
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">{showProfitPopup.planTitle}</p>

            <div className="my-4 p-3 rounded-xl bg-[#050505]/80 border border-slate-800 font-mono space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Investment:</span>
                <span className="text-slate-200">${showProfitPopup.investment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Profit Earned:</span>
                <span className="text-emerald-400 font-bold">+${showProfitPopup.profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-slate-800 font-bold">
                <span className="text-slate-200">Total Received:</span>
                <span className="text-[#F4C542]">${showProfitPopup.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowProfitPopup(null)}
                className="py-2.5 px-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold"
              >
                Later
              </button>
              <button
                onClick={() => {
                  setShowProfitPopup(null);
                  document.getElementById('investment-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="py-2.5 px-3 btn-gold-gradient text-xs font-bold text-black"
              >
                Trade Again
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
