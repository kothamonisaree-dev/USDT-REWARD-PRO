import React, { useState } from 'react';
import { LoanData, NavigationTab } from '../types';
import { LandPlot, ShieldCheck, AlertCircle, Upload, CreditCard, UserCheck, Phone, CheckCircle2, ArrowRight } from 'lucide-react';

interface LoanSystemProps {
  activeLoan: LoanData;
  onNavigate: (tab: NavigationTab) => void;
  onRequestLoanSubmit: (amount: number, termDays: number) => void;
}

export const LoanSystem: React.FC<LoanSystemProps> = ({ activeLoan, onNavigate, onRequestLoanSubmit }) => {
  const [loanAmount, setLoanAmount] = useState<string>('1000');
  const [selectedTerm, setSelectedTerm] = useState<number>(14);

  // Requirement checkboxes demo
  const [passportUploaded, setPassportUploaded] = useState(true);
  const [bankCardAdded, setBankCardAdded] = useState(true);
  const [faceVerified, setFaceVerified] = useState(true);
  const [phoneInput, setPhoneInput] = useState('+1 (555) 389-2041');
  const [submitted, setSubmitted] = useState(false);

  const termPlans = [
    { days: 7, rate: 2.0 },
    { days: 14, rate: 3.2 },
    { days: 21, rate: 4.3 },
    { days: 28, rate: 5.2 }
  ];

  const currentRate = termPlans.find(t => t.days === selectedTerm)?.rate || 3.2;
  const numAmount = parseFloat(loanAmount) || 1000;
  const calculatedInterest = (numAmount * currentRate) / 100;
  const totalRepayment = numAmount + calculatedInterest;

  const handleSubmitLoan = () => {
    if (numAmount < 100 || numAmount > 50000) {
      alert('Loan amount must be between $100 and $50,000 USD');
      return;
    }
    onRequestLoanSubmit(numAmount, selectedTerm);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="my-6 space-y-6">
      
      {/* Banner if loan is overdue */}
      {activeLoan.status === 'overdue' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/30 to-black border-2 border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-red-400">Notice: Active Loan Overdue</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Loan #{activeLoan.id} (${activeLoan.amount.toFixed(2)}) is currently marked OVERDUE.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('loan-notice')}
            className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shrink-0 flex items-center gap-1"
          >
            View Official Overdue Notice <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Loan Request Calculator */}
      <div className="glass-gold-card p-6 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <LandPlot className="w-6 h-6 text-[#F4C542]" /> Instant Crypto Credit & Loan System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Apply for zero-collateral instant liquidity from $100 up to $50,000 USD.
          </p>
        </div>

        {/* Loan Plans Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-[#080D18]">
                <th className="p-3">Loan Term</th>
                <th className="p-3">Interest Rate</th>
                <th className="p-3">Example ($1,000 Loan)</th>
                <th className="p-3">Total Repayment</th>
                <th className="p-3 text-right">Select Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {termPlans.map(plan => (
                <tr key={plan.days} className="hover:bg-slate-800/30">
                  <td className="p-3 font-bold text-slate-100">{plan.days} Days</td>
                  <td className="p-3 text-[#F4C542] font-bold">{plan.rate}%</td>
                  <td className="p-3 text-slate-300">Interest: ${(1000 * plan.rate / 100).toFixed(2)}</td>
                  <td className="p-3 font-bold text-emerald-400">${(1000 + (1000 * plan.rate / 100)).toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedTerm(plan.days)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedTerm === plan.days
                          ? 'bg-[#F4C542] text-black shadow-md'
                          : 'bg-[#080D18] text-slate-300 border border-slate-700'
                      }`}
                    >
                      {selectedTerm === plan.days ? 'Selected' : 'Choose'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loan Amount Input & Repayment Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Requested Loan Amount ($100 – $50,000 USD)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              />
            </div>

            {/* Verification Steps checklist */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-300 block mb-1">Application Requirements:</span>
              <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><Upload className="w-3.5 h-3.5 text-[#F4C542]" /> Upload NID or Passport</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><CreditCard className="w-3.5 h-3.5 text-[#F4C542]" /> Linked Bank Card</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Linked</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300"><UserCheck className="w-3.5 h-3.5 text-[#F4C542]" /> Face Biometric Check</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passed</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-300"><Phone className="w-3.5 h-3.5 text-[#F4C542]" /> Phone Verification</span>
                  <span className="font-mono text-slate-200">{phoneInput}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repayment Summary */}
          <div className="p-5 rounded-2xl bg-[#080D18] border border-[#F4C542]/30 flex flex-col justify-between space-y-4 font-mono text-xs">
            <h4 className="font-extrabold text-sm text-[#F4C542] uppercase tracking-wider">Loan Repayment Summary</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Selected Term:</span>
                <span className="text-slate-100 font-bold">{selectedTerm} Days</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Interest Rate:</span>
                <span className="text-[#F4C542] font-bold">{currentRate}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Accrued Interest:</span>
                <span className="text-[#F4C542] font-bold">+${calculatedInterest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-slate-100">Total Payable Amount:</span>
                <span className="text-emerald-400">${totalRepayment.toFixed(2)} USD</span>
              </div>
            </div>

            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
                ✅ Loan Application Submitted! Estimated Review Time: 5–30 minutes.
              </div>
            )}

            <button
              onClick={handleSubmitLoan}
              className="w-full py-3.5 btn-gold-gradient text-sm font-bold text-black"
            >
              Submit Loan Application Now
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
