import React, { useState } from 'react';
import { UserProfile, KycRequestData } from '../types';
import { ShieldCheck, Shield, Lock, CheckCircle2, Award, KeyRound, Eye, EyeOff, X, Check, Upload, FileText, Camera, ShieldAlert, ArrowRight, Image as ImageIcon, Clock } from 'lucide-react';

interface SecurityAuthProps {
  user: UserProfile;
  onLogout?: () => void;
  onKycSubmit?: (req: KycRequestData) => void;
}

export const SecurityAuth: React.FC<SecurityAuthProps> = ({ user, onKycSubmit }) => {
  const [is2FA, setIs2FA] = useState(user.is2FAEnabled);
  const [biometrics, setBiometrics] = useState(true);

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // KYC Modal State
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycStep, setKycStep] = useState<1 | 2 | 3>(1);
  const [docType, setDocType] = useState<'nid' | 'passport' | 'license'>('nid');
  const [fullName, setFullName] = useState(user.fullName || user.username || '');
  const [docNumber, setDocNumber] = useState('');
  const [frontDoc, setFrontDoc] = useState<string | null>(null);
  const [backDoc, setBackDoc] = useState<string | null>(null);
  const [selfieDoc, setSelfieDoc] = useState<string | null>(null);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword) {
      setPasswordError('Please enter your old password.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    // Success
    setPasswordSuccess('Password changed successfully!');
    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('');
      setShowPasswordModal(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'front' | 'back' | 'selfie') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'front') setFrontDoc(reader.result as string);
        if (field === 'back') setBackDoc(reader.result as string);
        if (field === 'selfie') setSelfieDoc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingKyc(true);
    setTimeout(() => {
      setIsSubmittingKyc(false);
      setShowKycModal(false);

      const newReq: KycRequestData = {
        id: 'KYC-' + Math.floor(100000 + Math.random() * 900000),
        userId: user.id || 'USR-8829401',
        userName: user.fullName || user.username || 'Alex Morgan',
        userEmail: user.email || 'alex.m@usdtpro.com',
        docType,
        docNumber: docNumber || 'NID-59201928401',
        fullName: fullName || user.fullName,
        frontDocUrl: frontDoc || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        backDocUrl: backDoc || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
        selfieDocUrl: selfieDoc || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        status: 'pending'
      };

      if (onKycSubmit) {
        onKycSubmit(newReq);
      }
    }, 1200);
  };

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

        <div className="flex items-center gap-3 flex-wrap">
          {user.kycStatus === 'verified' ? (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> KYC Verified Level 4
            </div>
          ) : user.kycStatus === 'pending' ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> KYC Pending
            </div>
          ) : user.kycStatus === 'rejected' ? (
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> KYC Rejected
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-bold text-xs flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> KYC Unverified
            </div>
          )}

          <button
            onClick={() => {
              setPasswordError('');
              setPasswordSuccess('');
              setShowPasswordModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl btn-gold-outline text-xs font-bold flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-transform"
          >
            <KeyRound className="w-4 h-4 text-[#F4C542]" /> Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D121F] border border-[#F4C542]/40 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F4C542]/15 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542]">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Change Account Password</h3>
                  <p className="text-[11px] text-slate-400">Update your security key for VIP Wallet</p>
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" /> {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              {/* Old Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Old Password</label>
                <div className="relative">
                  <input
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#F4C542]/20"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D121F] border border-[#F4C542]/40 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F4C542]/15 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">VIP Level 4 KYC Verification</h3>
                  <p className="text-[11px] text-slate-400">Unlock $100,000 USD Daily Withdrawal Limits</p>
                </div>
              </div>

              <button
                onClick={() => setShowKycModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`h-1.5 rounded-full transition-all ${kycStep >= 1 ? 'bg-[#F4C542]' : 'bg-slate-800'}`} />
              <div className={`h-1.5 rounded-full transition-all ${kycStep >= 2 ? 'bg-[#F4C542]' : 'bg-slate-800'}`} />
              <div className={`h-1.5 rounded-full transition-all ${kycStep >= 3 ? 'bg-[#F4C542]' : 'bg-slate-800'}`} />
            </div>

            <div className="flex justify-between text-[11px] font-bold text-slate-400 px-0.5">
              <span className={kycStep === 1 ? 'text-[#F4C542]' : ''}>1. Doc Details</span>
              <span className={kycStep === 2 ? 'text-[#F4C542]' : ''}>2. ID Upload</span>
              <span className={kycStep === 3 ? 'text-[#F4C542]' : ''}>3. Face Check</span>
            </div>

            {/* STEP 1: Document Details */}
            {kycStep === 1 && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name (as per ID)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDocType('nid')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                        docType === 'nid'
                          ? 'bg-[#F4C542]/15 border-[#F4C542] text-[#F4C542]'
                          : 'bg-[#080D18] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>National ID</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDocType('passport')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                        docType === 'passport'
                          ? 'bg-[#F4C542]/15 border-[#F4C542] text-[#F4C542]'
                          : 'bg-[#080D18] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Passport</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDocType('license')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                        docType === 'license'
                          ? 'bg-[#F4C542]/15 border-[#F4C542] text-[#F4C542]'
                          : 'bg-[#080D18] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>Driver License</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {docType === 'nid' ? 'NID Card Number' : docType === 'passport' ? 'Passport Number' : 'Driver License Number'}
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="e.g. 59201928401"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setKycStep(2)}
                    disabled={!fullName || !docNumber}
                    className="w-full py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>Next: Upload Photos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Document Photos */}
            {kycStep === 2 && (
              <div className="space-y-4 pt-1">
                <p className="text-xs text-slate-400">
                  Please upload clear, non-blurry photos of the front and back of your {docType.toUpperCase()}.
                </p>

                {/* Front Side */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Document Front Side</label>
                  <label className="border-2 border-dashed border-slate-800 hover:border-[#F4C542]/50 bg-[#080D18] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative min-h-[110px]">
                    {frontDoc ? (
                      <div className="relative w-full h-24 flex items-center justify-center">
                        <img src={frontDoc} alt="Front ID" className="max-h-full object-contain rounded-lg" />
                        <span className="absolute bottom-1 right-1 bg-emerald-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded">Uploaded ✓</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <Upload className="w-6 h-6 text-[#F4C542] mx-auto" />
                        <span className="text-xs font-semibold text-slate-300 block">Click to upload Front ID</span>
                        <span className="text-[10px] text-slate-500 block">JPG, PNG, WEBP (Max 10MB)</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'front')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Back Side */}
                {docType !== 'passport' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Document Back Side</label>
                    <label className="border-2 border-dashed border-slate-800 hover:border-[#F4C542]/50 bg-[#080D18] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative min-h-[110px]">
                      {backDoc ? (
                        <div className="relative w-full h-24 flex items-center justify-center">
                          <img src={backDoc} alt="Back ID" className="max-h-full object-contain rounded-lg" />
                          <span className="absolute bottom-1 right-1 bg-emerald-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded">Uploaded ✓</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <Upload className="w-6 h-6 text-[#F4C542] mx-auto" />
                          <span className="text-xs font-semibold text-slate-300 block">Click to upload Back ID</span>
                          <span className="text-[10px] text-slate-500 block">JPG, PNG, WEBP (Max 10MB)</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'back')}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setKycStep(1)}
                    className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setKycStep(3)}
                    disabled={!frontDoc}
                    className="flex-1 py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>Next: Facial Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Selfie / Face Verification */}
            {kycStep === 3 && (
              <form onSubmit={handleKycSubmit} className="space-y-4 pt-1">
                <p className="text-xs text-slate-400">
                  Please hold your document next to your face or capture a clear live selfie for AI liveness check.
                </p>

                <div>
                  <label className="border-2 border-dashed border-[#F4C542]/40 bg-[#080D18] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors relative min-h-[140px]">
                    {selfieDoc ? (
                      <div className="relative w-full h-32 flex items-center justify-center">
                        <img src={selfieDoc} alt="Selfie" className="max-h-full object-contain rounded-xl border border-emerald-500" />
                        <span className="absolute bottom-1 right-1 bg-emerald-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded">Selfie Captured ✓</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Camera className="w-8 h-8 text-[#F4C542] mx-auto animate-pulse" />
                        <span className="text-xs font-extrabold text-slate-200 block">Capture Selfie / Hold ID Photo</span>
                        <span className="text-[10px] text-slate-400 block">Ensure good lighting and full face visibility</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileUpload(e, 'selfie')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>By submitting, you certify that all uploaded documents are authentic and belong to you. Fake documents will result in account suspension.</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setKycStep(2)}
                    className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingKyc}
                    className="flex-1 py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#F4C542]/20 flex items-center justify-center gap-2"
                  >
                    {isSubmittingKyc ? (
                      <span>Verifying Documents...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Level 4 KYC</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

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

          {user.kycStatus === 'verified' ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> VIP Level 4 Approved by Admin (Full $100,000 USD Limit Active)
            </div>
          ) : user.kycStatus === 'pending' ? (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" /> 
              <div>
                <div className="font-extrabold text-amber-300">⏳ KYC Pending Admin Approval</div>
                <div className="text-[11px] text-amber-400/80 font-normal">Your documents are under review by Admin. Approval will reflect shortly.</div>
              </div>
            </div>
          ) : user.kycStatus === 'rejected' ? (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <div className="font-extrabold text-red-400">❌ KYC Application Rejected</div>
                <div className="text-[11px] text-red-300/80 font-normal">Please click below to re-submit clear photos of your official ID documents.</div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Identity not verified. Complete KYC to increase daily limits & verify account authenticity.</span>
            </div>
          )}

          <button
            onClick={() => {
              setKycStep(1);
              setShowKycModal(true);
            }}
            className="w-full py-2.5 btn-gold-outline text-xs font-bold text-[#F4C542] hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>
              {user.kycStatus === 'verified'
                ? 'View Approved KYC Details'
                : user.kycStatus === 'pending'
                ? 'Update / View Submitted KYC'
                : user.kycStatus === 'rejected'
                ? 'Re-submit Level 4 KYC Documents'
                : 'Upgrade to VIP Level 4 KYC'}
            </span>
          </button>
        </div>

      </div>

    </div>
  );
};
