import React, { useState } from 'react';
import { LoanData, NavigationTab, UserProfile } from '../types';
import { 
  LandPlot, ShieldCheck, AlertCircle, Upload, CheckCircle2, 
  ArrowRight, FileText, Camera, Sparkles, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoanSystemProps {
  activeLoan?: LoanData;
  user?: UserProfile;
  onNavigate: (tab: NavigationTab) => void;
  onRequestLoanSubmit: (amount: number, termDays: number, applicationData?: any) => void;
}

export const LoanSystem: React.FC<LoanSystemProps> = ({ 
  activeLoan, 
  user,
  onNavigate, 
  onRequestLoanSubmit 
}) => {
  // Loan Amount
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  
  // Tenure Options
  const tenureOptions = [
    { days: 3, rate: 2.3 },
    { days: 5, rate: 4.7 },
    { days: 7, rate: 5.2 },
    { days: 14, rate: 7.0 }
  ];
  const [selectedDays, setSelectedDays] = useState<number>(3);

  // Form Fields (Empty by default as requested)
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [permanentAddress, setPermanentAddress] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('Passport');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Calculations
  const currentTenure = tenureOptions.find(t => t.days === selectedDays) || tenureOptions[0];
  const interestFees = (loanAmount * currentTenure.rate) / 100;
  const repaymentAmount = loanAmount + interestFees;
  
  // Calculate Due Date based on current date + selected days
  const calculateDueDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };
  const dueDateStr = calculateDueDate(selectedDays);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim() || !email.trim()) {
      alert('Please fill in all required contact information.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      // Trigger Celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.4 }
      });

      onRequestLoanSubmit(loanAmount, selectedDays, {
        fullName,
        mobileNumber,
        email,
        permanentAddress,
        zipCode,
        documentType,
        documentFileName: documentFile?.name || 'passport_scan.pdf',
        photoFileName: photoFile?.name || 'selfie_verification.jpg'
      });
    }, 1000);
  };

  return (
    <div className="my-4 space-y-6 max-w-6xl mx-auto selection:bg-[#22c55e] selection:text-black">
      
      {/* TOP HEADER SECTION WITH BADGE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Instant Loan — USDT Vault</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#22c55e] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INSTANT LIQUIDITY</span>
          </span>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SYSTEM LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LOAN CALCULATOR & KEY METRICS */}
        <div className="lg:col-span-5 bg-[#0a0f12] border border-slate-800/90 rounded-[24px] p-6 space-y-6 shadow-2xl">
          
          {/* Slider Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-200">
                Loan Amount
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-[#22c55e]">
                ${loanAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Range Slider */}
            <div className="relative pt-1">
              <input
                type="range"
                min="100"
                max="11500"
                step="50"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-2">
                <span>Range $100 – $11,500 USDT</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[500, 1000, 2500, 5000, 10000, 11500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all ${
                    loanAmount === amt
                      ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/50'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ${amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Loan Tenure Selector Cards */}
          <div className="grid grid-cols-4 gap-2">
            {tenureOptions.map((t) => {
              const isSelected = selectedDays === t.days;
              return (
                <button
                  key={t.days}
                  type="button"
                  onClick={() => setSelectedDays(t.days)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all text-center ${
                    isSelected
                      ? 'border-2 border-[#22c55e] bg-[#22c55e]/10 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                      : 'border border-slate-800 bg-[#0d1417] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-black">{t.days} Days</span>
                  <span className={`text-[11px] font-extrabold mt-0.5 ${isSelected ? 'text-[#22c55e]' : 'text-slate-400'}`}>
                    {t.rate}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* 4-Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Box 1: Interest / Fees */}
            <div className="p-4 rounded-2xl bg-[#0e1619] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block">
                INTEREST / FEES
              </span>
              <span className="text-lg font-black font-mono text-white">
                ${interestFees.toFixed(2)}
              </span>
            </div>

            {/* Box 2: Repayment Amount */}
            <div className="p-4 rounded-2xl bg-[#0e1619] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block">
                REPAYMENT AMOUNT
              </span>
              <span className="text-lg font-black font-mono text-white">
                ${repaymentAmount.toFixed(2)}
              </span>
            </div>

            {/* Box 3: Due Date */}
            <div className="p-4 rounded-2xl bg-[#0e1619] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block">
                DUE DATE
              </span>
              <span className="text-lg font-black font-mono text-white">
                {dueDateStr}
              </span>
            </div>

            {/* Box 4: Approved Amount */}
            <div className="p-4 rounded-2xl bg-[#0e1619] border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 block">
                APPROVED AMOUNT
              </span>
              <span className="text-lg font-black font-mono text-white">
                ${loanAmount.toFixed(2)}
              </span>
            </div>

          </div>

          {/* Footer Note */}
          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
            Institutional crypto credit facility. Instant liquidity is credited directly to your USDT Vault upon approval.
          </p>

        </div>

        {/* RIGHT COLUMN: APPLICATION FORM */}
        <div className="lg:col-span-7 bg-[#0a0f12] border border-slate-800/90 rounded-[24px] p-6 sm:p-7 space-y-5 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Loan Application</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Zero-Collateral Instant Review</span>
          </div>

          {submittedSuccess && (
            <div className="p-4 rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] text-xs font-bold space-y-1 animate-in fade-in">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Application Submitted Successfully!</span>
              </div>
              <p className="text-slate-300 font-medium">
                Your loan application for <strong>${loanAmount.toFixed(2)} USDT ({selectedDays} Days)</strong> has been recorded. Review status will update shortly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitApplication} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full legal name"
                required
                className="w-full bg-[#0d1417] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-[#22c55e] focus:outline-none transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
                className="w-full bg-[#0d1417] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-[#22c55e] focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full bg-[#0d1417] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-[#22c55e] focus:outline-none transition-all"
              />
            </div>

            {/* Permanent Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Permanent Address
              </label>
              <input
                type="text"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder="Enter complete residential address"
                className="w-full bg-[#0d1417] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-[#22c55e] focus:outline-none transition-all"
              />
            </div>

            {/* ZIP Code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                ZIP Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="ZIP / Postal Code"
                className="w-full bg-[#0d1417] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-[#22c55e] focus:outline-none transition-all font-mono"
              />
            </div>

            {/* Document Type Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Document Type
              </label>
              <div className="relative">
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full bg-[#0d1417] border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 focus:border-[#22c55e] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Passport">Passport</option>
                  <option value="National ID Card">National ID Card</option>
                  <option value="Driver License">Driver's License</option>
                  <option value="Tax Residence Certificate">Tax Residence Certificate</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Document Upload
              </label>
              <div className="flex items-center gap-3 bg-[#0d1417] border border-slate-800 rounded-xl p-2.5">
                <label className="cursor-pointer px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-extrabold transition-all shrink-0">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleDocumentChange}
                    accept="image/*,.pdf"
                  />
                </label>
                <span className="text-xs text-slate-400 truncate">
                  {documentFile ? documentFile.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Optional Photo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Optional Photo
              </label>
              <div className="flex items-center gap-3 bg-[#0d1417] border border-slate-800 rounded-xl p-2.5">
                <label className="cursor-pointer px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-extrabold transition-all shrink-0">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoChange}
                    accept="image/*"
                  />
                </label>
                <span className="text-xs text-slate-400 truncate">
                  {photoFile ? photoFile.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] active:scale-[0.99] text-black text-sm font-black transition-all shadow-xl shadow-[#22c55e]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Loan Application...</span>
                ) : (
                  <span>Submit Loan Application</span>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};
