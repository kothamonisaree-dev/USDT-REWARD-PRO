import React, { useState, useEffect } from 'react';
import { LoanData } from '../types';
import { ShieldCheck, AlertTriangle, Printer, Download, MessageCircle, Send, CheckCircle2, Lock, Clock, Building2 } from 'lucide-react';

interface OfficialLoanNoticeProps {
  loan: LoanData;
}

export const OfficialLoanNotice: React.FC<OfficialLoanNoticeProps> = ({ loan }) => {
  const [overdueFormatted, setOverdueFormatted] = useState<string>('');

  // Live timer calculating overdue duration every second
  useEffect(() => {
    const updateOverdueTimer = () => {
      const dueTime = new Date(loan.dueDate).getTime();
      const nowTime = new Date().getTime();
      const diffMs = Math.max(0, nowTime - dueTime);

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setOverdueFormatted(`${days} Days : ${hours} Hours : ${minutes} Mins : ${seconds} Secs`);
    };

    updateOverdueTimer();
    const interval = setInterval(updateOverdueTimer, 1000);
    return () => clearInterval(interval);
  }, [loan.dueDate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('Generating official PDF Loan Repayment Notice document...');
  };

  return (
    <div className="my-8 max-w-4xl mx-auto space-y-6">
      
      {/* Top Actions Bar (Print / PDF) */}
      <div className="flex items-center justify-between bg-[#0D121F] border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-[#F4C542]" />
          <span>Verified Document • Accounting Vault #ACCT-2026</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#F4C542]" /> Print Notice
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1.5 rounded-xl btn-gold-gradient text-xs font-bold text-black flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {/* Main Bank Notice Document Container */}
      <div id="printable-notice" className="bg-[#0B1220] border-2 border-red-500/40 rounded-[22px] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-100">
        
        {/* Company Seal Watermark Background */}
        <div className="absolute right-6 bottom-6 opacity-5 pointer-events-none select-none">
          <Building2 className="w-96 h-96 text-[#F4C542]" />
        </div>

        {/* Page Header */}
        <div className="border-b-2 border-[#F4C542]/30 pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B8860B] via-[#F4C542] to-[#FFD700] p-0.5 shadow-lg shadow-[#F4C542]/20">
              <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center font-black text-xl text-[#F4C542]">
                ₮
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                Official Loan Repayment Notice
              </h1>
              <p className="text-xs text-[#F4C542] font-semibold tracking-wider uppercase mt-0.5">
                USDT Reward Pro - Accounting Department
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-mono text-xs font-bold uppercase tracking-widest self-start sm:self-auto animate-pulse">
            <AlertTriangle className="w-4 h-4" /> STATUS: OVERDUE
          </div>
        </div>

        {/* Notice Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#050811] border border-slate-800 font-mono text-xs mb-6">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Customer Name</span>
            <strong className="text-slate-100">{loan.borrowerName}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Username</span>
            <strong className="text-[#F4C542]">@{loan.username}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Loan ID</span>
            <strong className="text-slate-100">{loan.id}</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Loan Amount</span>
            <strong className="text-emerald-400">${loan.amount.toFixed(2)} USD</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Loan Date</span>
            <span className="text-slate-300">{loan.loanDate}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Loan Plan</span>
            <span className="text-slate-300">{loan.termDays} Days ({loan.interestRate}%)</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Due Deadline</span>
            <span className="text-red-400 font-bold">{loan.dueDate}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Current Status</span>
            <span className="text-red-400 font-extrabold uppercase">OVERDUE</span>
          </div>
        </div>

        {/* Live Overdue Duration Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-black border border-red-500/50 my-6 text-center">
          <div className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
            <Clock className="w-4 h-4" /> Live Overdue Duration Counter
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono tracking-wider my-1">
            {overdueFormatted}
          </div>
          <span className="text-[11px] text-slate-400">
            Calculated in real-time immediately after repayment deadline expiration.
          </span>
        </div>

        {/* Main Notice Letter Text */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-slate-800 pt-6">
          <p>
            Dear Valued Customer,
          </p>
          <p>
            According to our official accounting records, your registered account (<strong className="text-[#F4C542]">@{loan.username}</strong>) received a financial loan of <strong className="text-emerald-400">${loan.amount.toFixed(2)} USD</strong> from USDT Reward Pro under the <strong className="text-slate-100">{loan.termDays} Days</strong> plan with a fixed interest rate of <strong className="text-slate-100">{loan.interestRate}%</strong>.
          </p>
          <p>
            Your repayment deadline officially expired on <strong className="text-red-400 font-mono">{loan.dueDate}</strong>.
          </p>
          <p>
            As of now, your repayment is overdue by: <strong className="text-red-400 font-mono">{overdueFormatted}</strong>.
          </p>
          <p>
            Our records indicate that the outstanding loan balance has not yet been settled. We kindly request that you contact our Customer Service Department immediately to resolve this matter.
          </p>
          <p>
            If repayment or official communication is not received within the required timeframe, your account may be subject to the standard procedures described in our Terms and Conditions and applicable credit policies.
          </p>
          <p>
            Thank you for your prompt attention.
          </p>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <p className="font-extrabold text-slate-100 text-sm">Dashiell</p>
              <p className="text-xs text-[#F4C542]">Accounting Manager</p>
              <p className="text-[11px] text-slate-400">USDT Reward Pro</p>
            </div>

            {/* Simulated Stamp / Seal */}
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-red-500/60 p-1 flex items-center justify-center text-center transform -rotate-12 opacity-80">
              <div className="text-[9px] font-black uppercase text-red-400 leading-tight">
                ★ OFFICIAL ★<br />ACCOUNTING<br />DEPT SEAL
              </div>
            </div>
          </div>
        </div>

        {/* Outstanding Summary Card */}
        <div className="my-8 p-5 rounded-2xl bg-[#050811] border border-[#F4C542]/40 grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Loan Principal</span>
            <span className="text-base font-bold text-slate-100">${loan.amount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Accrued Interest</span>
            <span className="text-base font-bold text-[#F4C542]">+${loan.interestAmount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Total Payable</span>
            <span className="text-lg font-extrabold text-red-400">${loan.totalRepayment.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-xs font-bold uppercase">
              OVERDUE
            </span>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://t.me/USDTRewardProSupport"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
          >
            <Send className="w-4 h-4" /> Contact Customer Service via Telegram
          </a>

          <a
            href="https://wa.me/18005550199"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
          >
            <MessageCircle className="w-4 h-4" /> Contact Customer Service via WhatsApp
          </a>
        </div>

        {/* SSL Badge Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure 256-Bit SSL Encrypted Banking Portal</span>
          </div>
          <span>© 2026 USDT Reward Pro • Accounting Department</span>
        </div>

      </div>

    </div>
  );
};
