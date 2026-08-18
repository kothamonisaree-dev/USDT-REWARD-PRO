import React, { useState, useRef } from 'react';
import { WalletState, TransactionItem, WalletConfig, DepositCurrencyWallet } from '../types';
import { defaultDepositCurrencies } from '../data/mockData';
import { 
  ArrowDownLeft, ArrowUpRight, Copy, Check, QrCode, Search, Filter, ShieldCheck, 
  Lock, ExternalLink, RefreshCw, Coins, Camera, UploadCloud, Image as ImageIcon, 
  Trash2, Eye, X, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';

interface WalletPageProps {
  wallet: WalletState;
  transactions: TransactionItem[];
  onDepositSubmit: (amount: number, asset: string, proofImage?: string, txHash?: string, note?: string) => void;
  onWithdrawSubmit: (amount: number, asset: string, address: string) => void;
  walletConfig?: WalletConfig;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  wallet,
  transactions,
  onDepositSubmit,
  onWithdrawSubmit,
  walletConfig
}) => {
  const currencies: DepositCurrencyWallet[] = (walletConfig?.currencies && walletConfig.currencies.length > 0)
    ? walletConfig.currencies.filter(c => c.isActive !== false)
    : defaultDepositCurrencies.filter(c => c.isActive !== false);

  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>(currencies[0]?.id || 'usdt-trc20');

  const selectedCurrency = currencies.find(c => c.id === selectedCurrencyId) || currencies[0] || {
    id: 'usdt-trc20',
    symbol: 'USDT',
    name: 'Tether USD (TRC20)',
    network: 'TRC20 (Tron Network - Low Fee)',
    address: walletConfig?.trc20Address || wallet.walletAddress,
    minDeposit: walletConfig?.minDeposit || 50,
    qrCodeUrl: walletConfig?.qrCodeUrl,
    isActive: true
  };

  const displayAddress = selectedCurrency.address || walletConfig?.trc20Address || wallet.walletAddress;
  const minDepositVal = selectedCurrency.minDeposit || walletConfig?.minDeposit || 50;
  const activeQrCodeUrl = selectedCurrency.qrCodeUrl || (selectedCurrency.id === 'usdt-trc20' ? walletConfig?.qrCodeUrl : '') || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(displayAddress)}`;

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer' | 'history'>('deposit');

  // Deposit form state
  const [depositAmount, setDepositAmount] = useState<string>('100');
  const [depositProofImage, setDepositProofImage] = useState<string | null>(null);
  const [depositTxHash, setDepositTxHash] = useState<string>('');
  const [depositNote, setDepositNote] = useState<string>('');
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewProofModal, setPreviewProofModal] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Withdraw form state
  const [withdrawAsset, setWithdrawAsset] = useState<string>('USDT (TRC20)');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('100');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawPassword, setWithdrawPassword] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Filter & Search for history
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCopy = () => {
    navigator.clipboard.writeText(displayAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image screenshot (PNG, JPG, JPEG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please upload a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setDepositProofImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handlePasteTxHash = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDepositTxHash(text.trim());
      }
    } catch {
      // ignore
    }
  };

  const handleDepositConfirm = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt < minDepositVal) {
      alert(`Minimum deposit required for ${selectedCurrency.symbol} (${selectedCurrency.network}) is $${minDepositVal.toFixed(2)} USD.`);
      return;
    }

    onDepositSubmit(
      amt, 
      `${selectedCurrency.symbol} (${selectedCurrency.network})`,
      depositProofImage || undefined,
      depositTxHash.trim() || undefined,
      depositNote.trim() || undefined
    );

    setDepositSuccess(true);
    // Reset proof states after submitting
    setDepositProofImage(null);
    setDepositTxHash('');
    setDepositNote('');
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => setDepositSuccess(false), 5000);
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
    onWithdrawSubmit(amt, withdrawAsset, withdrawAddress);
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
          { id: 'deposit', label: `Deposit Crypto (Min $${minDepositVal})`, icon: ArrowDownLeft },
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
          <div className="md:col-span-7 glass-gold-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                  <ArrowDownLeft className="w-5 h-5 text-[#F4C542]" /> Deposit Funds to Vault
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your cryptocurrency and network to get the official platform receiving address.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#F4C542]/10 border border-[#F4C542]/30 text-[#F4C542] text-xs font-bold font-mono">
                {selectedCurrency.symbol}
              </span>
            </div>

            {/* Quick Currency Selector Pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Choose Deposit Currency & Network</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currencies.map(curr => {
                  const isSelected = curr.id === selectedCurrency.id;
                  return (
                    <button
                      key={curr.id}
                      type="button"
                      onClick={() => setSelectedCurrencyId(curr.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col transition-all ${
                        isSelected
                          ? 'bg-[#F4C542]/15 border-[#F4C542] text-white shadow-md shadow-[#F4C542]/10'
                          : 'bg-[#080D18] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-[#F4C542]">{curr.symbol}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#F4C542]" />}
                      </div>
                      <span className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                        {curr.network.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropdown Select Option */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Asset & Network</label>
              <select
                value={selectedCurrency.id}
                onChange={(e) => setSelectedCurrencyId(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              >
                {currencies.map(curr => (
                  <option key={curr.id} value={curr.id}>
                    {curr.symbol} - {curr.network}
                  </option>
                ))}
              </select>
            </div>

            {/* Deposit Amount input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Deposit Amount (USD / USDT)</label>
                <span className="text-[11px] text-[#F4C542] font-semibold">Min: ${minDepositVal.toFixed(2)} USD</span>
              </div>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder={`Minimum $${minDepositVal.toFixed(2)} USD`}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              />
            </div>

            {/* Deposit Address Box */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Official {selectedCurrency.symbol} Deposit Address ({selectedCurrency.network.split(' ')[0]})
                </label>
                <span className="text-[10px] text-slate-400">TRC20 / Direct Vault</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#080D18] border border-[#F4C542]/30">
                <span className="font-mono text-xs text-slate-200 truncate flex-1">{displayAddress}</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg btn-gold-gradient text-xs font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAddr ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>

            {/* PAYMENT PROOF (SCREENSHOT UPLOAD & TX HASH) SECTION - EXACTLY ABOVE CONFIRM BUTTON */}
            <div className="p-4 rounded-2xl bg-[#080D18]/90 border-2 border-[#F4C542]/40 space-y-3.5 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#F4C542]" /> 
                  <span>Upload Payment Proof / Screenshot</span>
                  <span className="text-[#F4C542] text-[10px] px-1.5 py-0.5 rounded bg-[#F4C542]/15 border border-[#F4C542]/30 font-mono">Proof Receipt</span>
                </label>
                <span className="text-[10px] text-slate-400">JPG, PNG, WEBP (Max 8MB)</span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="deposit-proof-upload"
              />

              {!depositProofImage ? (
                /* Drag and drop / Click upload zone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-[#F4C542] bg-[#F4C542]/10 scale-[0.99]'
                      : 'border-slate-700 hover:border-[#F4C542]/60 hover:bg-slate-900/60 bg-[#0A101D]'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-[#F4C542]/15 border border-[#F4C542]/40 flex items-center justify-center text-[#F4C542] shadow-md shadow-[#F4C542]/10">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Click to upload or drag & drop payment screenshot
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Attach transfer receipt screenshot from Binance, Trust Wallet, OKX, etc.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-[#F4C542] border border-[#F4C542]/30 flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" /> Browse Screenshot / Slip
                  </button>
                </div>
              ) : (
                /* Uploaded Image Preview Box */
                <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Payment Screenshot Attached</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewProofModal(depositProofImage)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-colors border border-slate-700"
                        title="View Full Size Screenshot"
                      >
                        <Eye className="w-3 h-3 text-[#F4C542]" /> Zoom View
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDepositProofImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-bold flex items-center gap-1 transition-colors border border-red-500/30"
                        title="Remove Attachment"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black/60 max-h-40 flex items-center justify-center">
                    <img
                      src={depositProofImage}
                      alt="Deposit Proof"
                      className="max-h-36 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setPreviewProofModal(depositProofImage)}
                    />
                  </div>
                </div>
              )}

              {/* Transaction ID / Hash (TxID) field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Transaction ID / Tx Hash (TxID) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteTxHash}
                    className="text-[10px] text-[#F4C542] hover:underline font-bold flex items-center gap-0.5"
                  >
                    <Copy className="w-2.5 h-2.5" /> Paste from clipboard
                  </button>
                </div>
                <input
                  type="text"
                  value={depositTxHash}
                  onChange={(e) => setDepositTxHash(e.target.value)}
                  placeholder="e.g., 0x9b3a... or 64-character TRC20/BEP20 Hash"
                  className="w-full bg-[#050912] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
                />
              </div>

              {/* Sender Wallet / Note (Optional) */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Sender Wallet Address or Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="e.g., Sent from Binance TRC20 / Trust Wallet"
                  className="w-full bg-[#050912] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#F4C542]/10 border border-[#F4C542]/20 text-[11px] text-[#F4C542]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Uploading your payment screenshot allows the verification system & Admin to approve and credit your vault balance within 5–15 minutes.
                </span>
              </div>
            </div>

            {depositSuccess && (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
                <span>⏳</span>
                <span>Deposit Request for {depositAmount} USD ({selectedCurrency.symbol}) submitted with proof! Pending Admin Approval.</span>
              </div>
            )}

            <button
              onClick={handleDepositConfirm}
              className="w-full py-3.5 btn-gold-gradient text-sm font-bold text-black shadow-lg shadow-[#F4C542]/20 hover:scale-[1.01] transition-transform"
            >
              Confirm {selectedCurrency.symbol} Deposit (${minDepositVal.toFixed(0)} Minimum)
            </button>
          </div>

          {/* QR Code graphic box */}
          <div className="md:col-span-5 glass-gold-card p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#F4C542]/10 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542] mb-2">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-100">{selectedCurrency.symbol} Deposit QR</h4>
            <p className="text-xs text-slate-400 mt-0.5 mb-3">
              Network: <span className="text-[#F4C542] font-semibold">{selectedCurrency.network}</span>
            </p>

            <div className="p-3 bg-white rounded-2xl border-4 border-[#F4C542]/50 shadow-2xl my-2 flex items-center justify-center">
              <img
                src={activeQrCodeUrl}
                alt={`${selectedCurrency.symbol} Deposit QR`}
                className="w-44 h-44 object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-[11px] font-mono text-slate-300 mt-2 break-all max-w-[240px] truncate">
              {displayAddress}
            </div>

            <div className="text-[11px] text-slate-400 mt-3 font-mono">
              Auto Confirmations: <strong>1 Block</strong> • Minimum: <strong>${minDepositVal.toFixed(0)} USD</strong>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Withdrawal Asset</label>
            <select
              value={withdrawAsset}
              onChange={(e) => setWithdrawAsset(e.target.value)}
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
            >
              {currencies.map(curr => (
                <option key={curr.id} value={`${curr.symbol} (${curr.network})`}>
                  {curr.symbol} - {curr.network}
                </option>
              ))}
            </select>
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
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
              <span>⏳</span>
              <span>Withdrawal Request Submitted! Pending Admin Approval. Your funds will be dispatched upon Admin approval.</span>
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
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#080D18]/80">
                  <th className="p-3">Tx ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Proof Slip</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No matching transaction records found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-800/20">
                      <td className="p-3 font-bold text-slate-200">
                        <div>{tx.id}</div>
                        {tx.txHash && <div className="text-[10px] text-slate-400 truncate max-w-[120px] font-mono">{tx.txHash}</div>}
                      </td>
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
                        {tx.proofImage ? (
                          <button
                            onClick={() => setPreviewProofModal(tx.proofImage!)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#F4C542]/10 border border-[#F4C542]/30 text-[#F4C542] text-[10px] font-bold hover:bg-[#F4C542]/20 transition-colors"
                            title="View Payment Screenshot"
                          >
                            <img src={tx.proofImage} alt="Proof" className="w-4 h-4 rounded object-cover" />
                            <span>View Slip</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : tx.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
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

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {previewProofModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#080D18] border border-[#F4C542]/50 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <Camera className="w-4 h-4 text-[#F4C542]" /> Payment Proof Screenshot Preview
              </div>
              <button
                onClick={() => setPreviewProofModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-black/80 rounded-xl p-2">
              <img
                src={previewProofModal}
                alt="Payment Proof Full"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewProofModal(null)}
                className="px-4 py-2 btn-gold-gradient text-xs font-bold text-black"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
