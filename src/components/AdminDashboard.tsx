import React, { useState } from 'react';
import { UserRole, WalletState, LoanData } from '../types';
import { ShieldCheck, Users, Wallet, DollarSign, AlertTriangle, Send, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  currentRole: UserRole;
  wallet: WalletState;
  loan: LoanData;
  onUpdateWalletBalance: (newBalance: number) => void;
  onSendGlobalBroadcast: (title: string, msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentRole,
  wallet,
  loan,
  onUpdateWalletBalance,
  onSendGlobalBroadcast
}) => {
  const [balanceInput, setBalanceInput] = useState(wallet.usdtBalance.toString());
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSaveBalance = () => {
    const num = parseFloat(balanceInput);
    if (!isNaN(num)) {
      onUpdateWalletBalance(num);
      alert(`User wallet balance successfully updated to $${num.toFixed(2)} USDT`);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;
    onSendGlobalBroadcast(broadcastTitle, broadcastMessage);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="my-6 space-y-6 max-w-5xl mx-auto">
      
      {/* Admin Panel Header */}
      <div className="glass-gold-card p-6 border-2 border-[#F4C542]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Role-Based Control Panel
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">
            ⚡ Super Admin Management Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage user balances, override loan statuses, review KYC, and broadcast real-time system alerts.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-[#F4C542] text-black font-extrabold text-xs uppercase tracking-widest">
          Active Role: {currentRole}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* User Balance Override */}
        <div className="glass-gold-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#F4C542]" /> Adjust Target User Wallet Balance
          </h3>
          <p className="text-xs text-slate-400">
            Target User: <strong className="text-slate-200">Alex Morgan (USR-8829401)</strong>
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New USDT Balance</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="flex-1 bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
              />
              <button
                onClick={handleSaveBalance}
                className="px-4 py-2.5 btn-gold-gradient text-xs font-bold text-black shrink-0"
              >
                Update Balance
              </button>
            </div>
          </div>
        </div>

        {/* Global Broadcast Notification Sender */}
        <div className="glass-gold-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#F4C542]" /> Broadcast Push System Message
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <input
              type="text"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="Notification Title (e.g., 🚀 Deposit Bonus Live)"
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100"
            />
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              rows={2}
              placeholder="Notification body text..."
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100"
            />

            {broadcastSent && (
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                ✅ Broadcast notification dispatched to user notification drawer!
              </div>
            )}

            <button type="submit" className="w-full py-2.5 btn-gold-outline text-xs font-bold text-[#F4C542]">
              Send Global Announcement
            </button>
          </form>
        </div>

      </div>

      {/* Loan Overdue Management Table */}
      <div className="glass-gold-card p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" /> Active System Loans & Overdue Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-[#080D18]">
                <th className="p-3">Loan ID</th>
                <th className="p-3">Borrower</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Deadline</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              <tr className="hover:bg-slate-800/30">
                <td className="p-3 font-bold text-slate-200">{loan.id}</td>
                <td className="p-3 text-slate-300">{loan.borrowerName} (@{loan.username})</td>
                <td className="p-3 font-bold text-slate-100">${loan.amount.toFixed(2)}</td>
                <td className="p-3 text-red-400">{loan.dueDate}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400">
                    {loan.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold">
                    Mark Repaid
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
