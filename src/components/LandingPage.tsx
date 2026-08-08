import React, { useState } from 'react';
import { 
  TrendingUp, Shield, Zap, Award, DollarSign, Users, ChevronRight, 
  CheckCircle2, ArrowRight, HelpCircle, Headphones, Lock, Sparkles,
  BarChart3, Globe, Gift, Landmark, Share2, Wallet, LogIn, UserPlus
} from 'lucide-react';
import { InvestmentPlan } from '../types';
import logoImg from '../assets/images/usdt_reward_pro_logo_1786228642395.jpg';

interface LandingPageProps {
  onOpenAuth: (mode: 'signin' | 'register') => void;
  plans: InvestmentPlan[];
  customerCareConfig: {
    telegram: string;
    whatsapp: string;
    email: string;
  };
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  plans,
  customerCareConfig
}) => {
  const [calcAmount, setCalcAmount] = useState<number>(500);
  const [calcPlanIdx, setCalcPlanIdx] = useState<number>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const selectedPlan = plans[calcPlanIdx] || plans[0];
  const selectedProfitPercentage = selectedPlan?.profitPercentage ?? (selectedPlan as any)?.dailyReturn ?? 0;
  const selectedDurationDays = selectedPlan?.durationSeconds ? Math.round(selectedPlan.durationSeconds / 86400) || 1 : ((selectedPlan as any)?.durationDays ?? 30);
  const calculatedDailyReturn = selectedPlan ? (calcAmount * (selectedProfitPercentage / 100)) : 0;
  const calculatedTotalReturn = selectedPlan ? (calcAmount + (calculatedDailyReturn * selectedDurationDays)) : 0;

  const faqs = [
    {
      q: 'How does USDT Reward Pro generate daily trading profits?',
      a: 'Our proprietary AI Quantitative Trading Engine monitors arbitrage opportunities and liquidity pools across major global exchanges (Binance, OKX, Bybit). It automatically executes high-frequency trades 24/7 to secure stable daily risk-free yield.'
    },
    {
      q: 'What is the minimum deposit and withdrawal limit?',
      a: 'The minimum deposit threshold is $50 USDT (TRC20 Network). Minimum withdrawal amount is $10 USDT. All withdrawal requests are auto-processed via smart contracts within 5-15 minutes.'
    },
    {
      q: 'How do I earn bonuses and referral rewards?',
      a: 'New registered users can claim an instant Welcome Bonus. Additionally, you can claim a $2.50 Daily Login Reward and earn up to 10% Tier 1, 5% Tier 2, and 2% Tier 3 instant commissions when invited friends invest.'
    },
    {
      q: 'How secure is my fund in the platform?',
      a: 'USDT Reward Pro utilizes enterprise multi-signature cold wallets, AES-256 encrypted database vaults, 2FA Google Authenticator protection, and full SLA liquidity guarantees.'
    },
    {
      q: 'How do I get started right now?',
      a: 'Simply click "Sign Up Free", create your account in 30 seconds, deposit USDT TRC20 to your personal deposit wallet, and select an Investment Package or AI Trading bot to start receiving daily returns.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col selection:bg-[#F4C542] selection:text-black">
      
      {/* PUBLIC HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#080D18]/90 backdrop-blur-md border-b border-[#F4C542]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B8860B] via-[#F4C542] to-[#FFD700] p-0.5 shadow-[0_0_15px_rgba(244,197,66,0.3)] flex items-center justify-center overflow-hidden">
              <img 
                src={logoImg} 
                alt="USDT REWARD PRO Logo" 
                className="w-full h-full object-cover rounded-[14px]" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                USDT REWARD <span className="text-[#F4C542] bg-[#F4C542]/10 px-2 py-0.5 rounded-md border border-[#F4C542]/30 text-xs">PRO VIP</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium">AI Quantitative Yield & Staking Platform</p>
            </div>
          </div>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#how-it-works" className="hover:text-[#F4C542] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#F4C542] transition-colors">Platform Features</a>
            <a href="#plans" className="hover:text-[#F4C542] transition-colors">Investment Packages</a>
            <a href="#calculator" className="hover:text-[#F4C542] transition-colors">Yield Calculator</a>
            <a href="#faq" className="hover:text-[#F4C542] transition-colors">FAQ</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-extrabold text-slate-200 transition-all flex items-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4 text-[#F4C542]" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-5 py-2.5 rounded-xl btn-gold-gradient text-black text-xs font-black transition-all shadow-lg shadow-[#F4C542]/20 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Free</span>
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        {/* Background Ambient Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#F4C542]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F4C542]/10 border border-[#F4C542]/30 text-[#F4C542] text-xs font-extrabold">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI Quantitative High-Frequency Trading & Automated Rewards</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-100 leading-tight tracking-tight">
              Earn Daily High-Yield <span className="bg-gradient-to-r from-[#FFD700] via-[#F4C542] to-[#B8860B] bg-clip-text text-transparent">USDT Returns</span> Powered by AI
            </h1>

            {/* Subtitle / Explanation */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Welcome to <strong>USDT Reward Pro</strong> — the world’s premier institutional-grade quantitative trading platform. Deposit USDT via TRC20, activate automated trading bots, earn up to 12.5% daily yields, and withdraw funds anytime with 24/7 instant payout execution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl btn-gold-gradient text-black font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl shadow-[#F4C542]/25 hover:scale-105 transition-all"
              >
                <span>Start Earning USDT Today</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => onOpenAuth('signin')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0B1220] hover:bg-[#121A2E] border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4 text-[#F4C542]" />
                <span>Existing User Dashboard Access</span>
              </button>
            </div>

            {/* Security Guarantee Pills */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant TRC20 Withdrawals</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> $5 Instant Welcome Bonus</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Sig Cold Vault Storage</span>
            </div>

          </div>

          {/* LIVE PLATFORM METRICS COUNTER BAR */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#080D18] border border-slate-800 shadow-2xl">
            <div className="text-center p-3 border-r border-slate-800/60 last:border-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume Traded</p>
              <p className="text-xl sm:text-2xl font-black text-[#F4C542] mt-1">$48,590,200+</p>
            </div>
            <div className="text-center p-3 border-r border-slate-800/60 last:border-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Global Investors</p>
              <p className="text-xl sm:text-2xl font-black text-slate-100 mt-1">142,850 Users</p>
            </div>
            <div className="text-center p-3 border-r border-slate-800/60 last:border-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Yield Paid Out</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">$12,840,500+</p>
            </div>
            <div className="text-center p-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Quant Accuracy</p>
              <p className="text-xl sm:text-2xl font-black text-blue-400 mt-1">99.85%</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION: HOW THE SITE WORKS (SITE-ER KAJOKORITA) */}
      <section id="how-it-works" className="py-20 bg-[#080D18]/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              How <span className="text-[#F4C542]">USDT Reward Pro</span> Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Start generating passive crypto yield in 4 simple steps. No technical trading experience required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-gold-card p-6 space-y-4 relative group hover:border-[#F4C542]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542] font-black text-xl">
                01
              </div>
              <h3 className="text-base font-extrabold text-slate-100">Register Free Account</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign up in under 30 seconds with your email and password. Claim an instant welcome reward upon registration.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-gold-card p-6 space-y-4 relative group hover:border-[#F4C542]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542] font-black text-xl">
                02
              </div>
              <h3 className="text-base font-extrabold text-slate-100">Deposit USDT TRC20</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transfer minimum $50 USDT to your personal TRC20 deposit address. Funds credit automatically to your luxury wallet.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-gold-card p-6 space-y-4 relative group hover:border-[#F4C542]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542] font-black text-xl">
                03
              </div>
              <h3 className="text-base font-extrabold text-slate-100">Activate AI Staking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose an Investment Package or launch the Live AI Trading Engine to start earning daily returns up to 12.5%.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-gold-card p-6 space-y-4 relative group hover:border-[#F4C542]/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542] font-black text-xl">
                04
              </div>
              <h3 className="text-base font-extrabold text-slate-100">Instant Withdrawal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Withdraw your accumulated trading profits anytime directly to your external Trust Wallet, Binance, or OKX wallet.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: PLATFORM CORE FEATURES */}
      <section id="features" className="py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#F4C542] uppercase tracking-widest">Enterprise Ecosystem</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Why Choose <span className="text-[#F4C542]">USDT Reward Pro</span>?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Comprehensive financial features designed for high-net-worth investors and crypto yield seekers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#F4C542]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">AI Quantitative Trading Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time algorithmic trading across top-tier crypto exchanges. High-frequency execution minimizes risk while maximizing compound growth.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Bonus & Daily Rewards Center</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Claim $2.50 USD in daily check-in rewards, welcome signup gifts, and milestone achievements for maintaining active investments.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">3-Tier Affiliate Commission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn 10% on Tier 1 direct invites, 5% on Tier 2, and 2% on Tier 3. Generate steady passive income by expanding your investor team.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Luxury Crypto Loans</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access up to 80% LTV instant crypto liquidity loans backed by collateral without selling your underlying crypto holdings.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Multi-Sig & 2FA Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Protected by Google Authenticator 2FA, anti-phishing code protection, and military-grade hardware cold-storage encryption.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542]">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-100">24/7 Dedicated Customer Care</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get instant 1-on-1 support via Telegram ({customerCareConfig.telegram}) and WhatsApp ({customerCareConfig.whatsapp}) anytime.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: INVESTMENT PLANS SHOWCASE */}
      <section id="plans" className="py-20 bg-[#080D18]/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#F4C542] uppercase tracking-widest">High Yield Staking</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Active Investment Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Choose a plan suited to your budget. Payouts credit automatically to your wallet every 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => {
              const name = plan.title || (plan as any).name || `VIP Plan ${idx + 1}`;
              const tagline = (plan as any).tagline || `${plan.profitPercentage}% Daily Bot Yield`;
              const durationDays = plan.durationSeconds ? Math.round(plan.durationSeconds / 86400) || 1 : ((plan as any).durationDays ?? 30);
              const dailyReturn = plan.profitPercentage ?? (plan as any).dailyReturn ?? 0;
              const totalReturn = Math.round(dailyReturn * durationDays);
              const minDeposit = plan.minInvestment ?? (plan as any).minDeposit ?? 0;
              const maxDeposit = plan.maxInvestment ?? (plan as any).maxDeposit ?? 0;
              const riskLevel = (plan as any).riskLevel || 'Low';

              return (
                <div key={plan.id} className="glass-gold-card p-6 flex flex-col justify-between space-y-6 relative hover:scale-105 transition-all">
                  {idx === 1 && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-[#F4C542] text-black text-[10px] font-black rounded-full shadow-md uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">{tagline}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#F4C542]/10 text-[#F4C542] border border-[#F4C542]/30">
                        {durationDays} Days
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-100">{name}</h3>

                    <div className="bg-[#050505] p-4 rounded-xl border border-slate-800 text-center">
                      <span className="text-xs text-slate-400 block font-bold">Daily Return</span>
                      <span className="text-2xl font-black text-[#F4C542]">{dailyReturn}%</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Total ROI: {totalReturn}%</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Min Deposit</span>
                        <span className="font-mono font-bold text-white">${(minDeposit ?? 0).toLocaleString()} USDT</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Max Deposit</span>
                        <span className="font-mono font-bold text-white">${(maxDeposit ?? 0).toLocaleString()} USDT</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Risk Level</span>
                        <span className="font-bold text-emerald-400">{riskLevel}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAuth('register')}
                    className="w-full py-3 rounded-xl btn-gold-gradient text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Activate Package</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION: YIELD CALCULATOR */}
      <section id="calculator" className="py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Interactive Yield Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Calculate potential daily earnings and net profit before making your deposit.
            </p>
          </div>

          <div className="glass-gold-card p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Select Package */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Investment Package</label>
                <select
                  value={calcPlanIdx}
                  onChange={(e) => setCalcPlanIdx(Number(e.target.value))}
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 font-bold focus:outline-none focus:border-[#F4C542]"
                >
                  {plans.map((p, i) => {
                    const pName = p.title || (p as any).name || `VIP Plan ${i + 1}`;
                    const pDaily = p.profitPercentage ?? (p as any).dailyReturn ?? 0;
                    const pDuration = p.durationSeconds ? Math.round(p.durationSeconds / 86400) || 1 : ((p as any).durationDays ?? 30);
                    return (
                      <option key={p.id} value={i}>
                        {pName} ({pDaily}% Daily - {pDuration} Days)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Deposit Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Investment Amount ($ USDT)</label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-[#F4C542]"
                />
              </div>

            </div>

            {/* Calculated Results Card */}
            <div className="bg-[#050505] p-6 rounded-2xl border border-[#F4C542]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Daily Profit</span>
                <span className="text-xl font-black text-emerald-400 font-mono mt-1">${calculatedDailyReturn.toFixed(2)} USDT</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-x border-slate-800 pt-3 sm:pt-0">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Plan Duration</span>
                <span className="text-xl font-black text-slate-100 mt-1">{selectedDurationDays} Days</span>
              </div>
              <div className="border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Estimated Total Return</span>
                <span className="text-xl font-black text-[#F4C542] font-mono mt-1">${calculatedTotalReturn.toFixed(2)} USDT</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-8 py-3.5 rounded-xl btn-gold-gradient text-black font-extrabold text-xs shadow-xl"
              >
                Register & Start Staking ${calcAmount} USDT Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section id="faq" className="py-20 bg-[#080D18]/50 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to know about USDT Reward Pro operations and security.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#080D18] border border-slate-800 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-200 hover:text-[#F4C542]"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? 'text-[#F4C542] rotate-180' : 'text-slate-500'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-[#050505] text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#F4C542]/40 shadow-md flex items-center justify-center">
                <img 
                  src={logoImg} 
                  alt="USDT REWARD PRO Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold text-slate-100 text-sm">USDT REWARD PRO VIP</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <a href="#how-it-works" className="hover:text-slate-200">How It Works</a>
              <a href="#plans" className="hover:text-slate-200">Investment Packages</a>
              <a href="#calculator" className="hover:text-slate-200">Yield Calculator</a>
              <a href="#faq" className="hover:text-slate-200">FAQ</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl btn-gold-gradient text-black font-extrabold"
              >
                Register
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 USDT REWARD PRO VIP. All Rights Reserved. Institutional AI Yield Engine.</p>
            <div className="flex items-center gap-4">
              <span>TRC20 Network</span>
              <span>•</span>
              <span>Telegram: {customerCareConfig.telegram}</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
