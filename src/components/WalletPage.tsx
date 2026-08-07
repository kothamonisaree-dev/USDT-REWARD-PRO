import React, { useState } from 'react';
import { WalletState, TransactionItem } from '../types';
import { ArrowDownLeft, ArrowUpRight, Copy, Check, QrCode, Search, Filter, ShieldCheck, Lock, ExternalLink, RefreshCw } from 'lucide-react';

interface WalletPageProps {
  wallet: WalletState;
  transactions: TransactionItem[];
  onDepositSubmit: (amount: number, asset: string) => void;
  onWithdrawSubmit: (amount: number, asset: string, address: string) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  wallet,
  transactions,
  onDepositSubmit,
  onWithdrawSubmit
}) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer' | 'history'>('deposit');

  // Deposit form state
  const [depositNetwork, setDepositNetwork] = useState<string>('USDT (TRC20)');
  const [depositAmount, setDepositAmount] = useState<string>('100');
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Withdraw form state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawPassword, setWithdrawPassword] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Filter & Search for history
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.walletAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleDepositConfirm = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < 50) {
      alert('Minimum Deposit amount is $50 USD');
      return;
    }
    onDepositSubmit(amt, depositNetwork);
    setDepositSuccess(true);
    setTimeout(() => setDepositSuccess(false), 3000);
  };

  const handleWithdrawConfirm = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt < 50) {
      setWithdrawError('Minimum Withdrawal is $50 USD');
      return;
    }
    if (amt > wallet.usdtBalance) {
      setWithdrawError(`Insufficient USDT Balance ($${wallet.usdtBalance.toFixed(2)} available)`);
      return;
    }
    if (!withdrawAddress || withdrawAddress.length < 10) {
      setWithdrawError('Please enter a valid destination TRC20/ERC20 wallet address');
      return;
    }
    if (!withdrawPassword || withdrawPassword.length < 4) {
      setWithdrawError('Trading Password required (min 4 characters)');
      return;
    }

    setWithdrawError('');
    onWithdrawSubmit(amt, depositNetwork, withdrawAddress);
    setWithdrawSuccess(true);
    setWithdrawAddress('');
    setWithdrawPassword('');
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = historyFilter === 'all' || tx.type === historyFilter || tx.status === historyFilter;
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tx.txHash && tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="my-6 space-y-6">
      
      {/* Wallet Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'deposit', label: 'Deposit Crypto (Min $50)', icon: ArrowDownLeft },
          { id: 'withdraw', label: 'Withdraw Crypto', icon: ArrowUpRight },
          { id: 'transfer', label: 'Internal Transfer', icon: ExternalLink },
          { id: 'history', label: 'Transaction History', icon: Filter }
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#F4C542] text-black shadow-lg shadow-[#F4C542]/20'
                  : 'bg-[#080D18] text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <IconComp className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* DEPOSIT SECTION */}
      {activeTab === 'deposit' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 glass-gold-card p-6 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-[#F4C542]" /> Deposit Funds to Wallet
            </h3>
            <p className="text-xs text-slate-400">
              Send USDT directly to your unique vault address. Minimum deposit is $50.00 USDT.
            </p>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Asset & Network</label>
              <select
                value={depositNetwork}
                onChange={(e) => setDepositNetwork(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              >
                <option value="USDT (TRC20)">USDT - TRC20 (Tron Network - Low Fee)</option>
                <option value="USDT (ERC20)">USDT - ERC20 (Ethereum Network)</option>
                <option value="BTC">BTC - Bitcoin Native</option>
                <option value="ETH">ETH - Ethereum Native</option>
              </select>
            </div>

            {/* Deposit Amount input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deposit Amount (USD)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Minimum $50 USD"
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              />
              <span className="text-[11px] text-[#F4C542] mt-1 block">Minimum deposit required: $50.00</span>
            </div>

            {/* Deposit Address Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Deposit Address</label>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#080D18] border border-[#F4C542]/30">
                <span className="font-mono text-xs text-slate-200 truncate flex-1">{wallet.walletAddress}</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg btn-gold-gradient text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAddr ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>

            {depositSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                ✅ Deposit Request Submitted! Your account balance will update automatically upon network confirmation.
              </div>
            )}

            <button
              onClick={handleDepositConfirm}
              className="w-full py-3.5 btn-gold-gradient text-sm font-bold text-black"
            >
              Confirm Deposit ($50 Minimum)
            </button>
          </div>

          {/* QR Code graphic box */}
          <div className="md:col-span-5 glass-gold-card p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542] mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-100">Scan QR Code</h4>
            <p className="text-xs text-slate-400 mt-1 mb-4">Scan with your exchange or mobile wallet app</p>

            <div className="p-4 bg-white rounded-2xl border-4 border-[#F4C542]/40 shadow-xl my-2">
              {/* Simulated QR Pattern */}
              <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                <div className="w-full h-full border-4 border-dashed border-[#F4C542] flex items-center justify-center text-[#F4C542] font-mono text-xs font-bold">
                  USDT-TRC20
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-3 font-mono">
              Auto Confirmations: <strong>1 Block</strong>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW SECTION */}
      {activeTab === 'withdraw' && (
        <div className="glass-gold-card p-6 max-w-2xl mx-auto space-y-4">
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-blue-400" /> Withdraw Crypto Funds
          </h3>

          <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 text-xs font-mono flex justify-between">
            <span className="text-slate-400">Available USDT Balance:</span>
            <span className="font-bold text-emerald-400">${wallet.usdtBalance.toFixed(2)} USDT</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Withdrawal Amount (USD)</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Minimum $50 USD"
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Wallet Address</label>
            <input
              type="text"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              placeholder="Enter destination TRC20 / ERC20 address"
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#F4C542]" /> Trading Password
            </label>
            <input
              type="password"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
            />
          </div>

          {withdrawError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              ⚠️ {withdrawError}
            </div>
          )}

          {withdrawSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              ✅ Withdrawal Request Submitted! Funds dispatched to destination network.
            </div>
          )}

          <button
            onClick={handleWithdrawConfirm}
            className="w-full py-3.5 btn-gold-outline text-sm font-bold text-[#F4C542]"
          >
            Submit Withdrawal Request
          </button>
        </div>
      )}

      {/* INTERNAL TRANSFER */}
      {activeTab === 'transfer' && (
        <div className="glass-gold-card p-6 max-w-xl mx-auto space-y-4 text-center">
          <ExternalLink className="w-10 h-10 text-[#F4C542] mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-100">Internal Peer-to-Peer Transfer</h3>
          <p className="text-xs text-slate-400">
            Transfer USDT instantly to any USDT REWARD PRO user by entering their Customer ID. Zero fees.
          </p>
          <input
            type="text"
            placeholder="Recipient User ID (e.g., USR-992014)"
            className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono text-center"
          />
          <input
            type="number"
            placeholder="Transfer Amount (USDT)"
            className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono text-center"
          />
          <button className="w-full py-3 btn-gold-gradient text-xs font-bold text-black">
            Send Instant Transfer
          </button>
        </div>
      )}

      {/* TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="glass-gold-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-extrabold text-slate-100">Complete Transaction Records</h3>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Tx ID, Hash, Asset..."
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <select
                value={historyFilter}
                onChange={(e) => setHistoryFilter(e.target.value)}
                className="bg-[#080D18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdraw">Withdrawals</option>
                <option value="profit">Profits</option>
                <option value="bonus">Bonuses</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#080D18]/80">
                  <th className="p-3">Tx ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No matching transaction records found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-bold text-slate-200">{tx.id}</td>
                      <td className="p-3 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'deposit' || tx.type === 'profit' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-100">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="p-3 text-slate-300">{tx.asset}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-400 text-[11px]">{tx.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
