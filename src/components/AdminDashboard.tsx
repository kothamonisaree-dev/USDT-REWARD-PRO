import React, { useState, useEffect } from 'react';
import { UserRole, WalletState, LoanData, KycRequestData, TransactionItem, ManagedUser, InvestmentPlan } from '../types';
import { 
  ShieldCheck, Users, Wallet, DollarSign, AlertTriangle, Send, RefreshCw, Award, CheckCircle2, 
  XCircle, Eye, FileText, Camera, Clock, X, ArrowDownLeft, ArrowUpRight, Search, Filter, Edit3, 
  Ban, UserCheck, Crown, Plus, UserPlus, Sliders, ShieldAlert, Headphones, MessageCircle, Gift, 
  TrendingUp, Landmark, Share2, Save
} from 'lucide-react';

interface AdminDashboardProps {
  currentRole: UserRole;
  wallet: WalletState;
  loan: LoanData;
  kycRequests: KycRequestData[];
  transactions: TransactionItem[];
  usersList: ManagedUser[];
  onUpdateWalletBalance: (newBalance: number) => void;
  onSendGlobalBroadcast: (title: string, msg: string) => void;
  onApproveKyc: (id: string) => void;
  onRejectKyc: (id: string) => void;
  onApproveTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
  onUpdateUserBalance: (userId: string, newBalance: number) => void;
  onChangeUserStatus: (userId: string, status: 'active' | 'suspended' | 'banned') => void;
  onChangeUserVip: (userId: string, vipLevel: number) => void;
  onChangeUserRole: (userId: string, role: UserRole) => void;
  onAddNewUser: (newUser: ManagedUser) => void;

  initialTab?: string;

  // Configuration Props & Callbacks for total admin control
  plansList?: InvestmentPlan[];
  onUpdateInvestmentPlans?: (plans: InvestmentPlan[]) => void;
  customerCareConfig?: { telegram: string; whatsapp: string; email: string };
  onUpdateCustomerCareConfig?: (config: { telegram: string; whatsapp: string; email: string }) => void;
  walletConfig?: { trc20Address: string; minDeposit: number };
  onUpdateWalletConfig?: (config: { trc20Address: string; minDeposit: number }) => void;
  bonusConfig?: { dailyReward: number; welcomeBonus: number };
  onUpdateBonusConfig?: (config: { dailyReward: number; welcomeBonus: number }) => void;
  referralConfig?: { tier1: number; tier2: number; tier3: number };
  onUpdateReferralConfig?: (config: { tier1: number; tier2: number; tier3: number }) => void;
  onUpdateLoanNotice?: (updatedLoan: LoanData) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentRole,
  wallet,
  loan,
  kycRequests,
  transactions,
  usersList,
  onUpdateWalletBalance,
  onSendGlobalBroadcast,
  onApproveKyc,
  onRejectKyc,
  onApproveTransaction,
  onRejectTransaction,
  onUpdateUserBalance,
  onChangeUserStatus,
  onChangeUserVip,
  onChangeUserRole,
  onAddNewUser,
  initialTab = 'users',
  plansList = [],
  onUpdateInvestmentPlans,
  customerCareConfig = { telegram: '@USDTRewardProSupport', whatsapp: '+1 (800) 555-0199', email: 'support@usdtpro.com' },
  onUpdateCustomerCareConfig,
  walletConfig = { trc20Address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', minDeposit: 50 },
  onUpdateWalletConfig,
  bonusConfig = { dailyReward: 5.00, welcomeBonus: 5.00 },
  onUpdateBonusConfig,
  referralConfig = { tier1: 10, tier2: 5, tier3: 2 },
  onUpdateReferralConfig,
  onUpdateLoanNotice
}) => {
  const [adminTab, setAdminTab] = useState<'users' | 'approvals' | 'kyc' | 'invest_plans' | 'deposit_wallet' | 'bonus_center' | 'loan_system' | 'loan_notice' | 'referral' | 'customer_care' | 'broadcast'>(initialTab as any || 'users');

  useEffect(() => {
    if (initialTab) {
      setAdminTab(initialTab as any);
    }
  }, [initialTab]);

  const [balanceInput, setBalanceInput] = useState(wallet.usdtBalance.toString());
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Editable local states
  const [editPlans, setEditPlans] = useState<InvestmentPlan[]>(plansList.length > 0 ? plansList : [
    { id: 'p1', title: '90s Ultra Express Yield', durationSeconds: 90, profitPercentage: 20, minInvestment: 50, maxInvestment: 10000, description: 'High frequency automated liquidity arbitrage' },
    { id: 'p2', title: '180s High Yield Staking', durationSeconds: 180, profitPercentage: 35, minInvestment: 100, maxInvestment: 25000, description: 'DeFi yield farming liquidity pool' },
    { id: 'p3', title: '300s VIP Institutional Pool', durationSeconds: 300, profitPercentage: 50, minInvestment: 500, maxInvestment: 100000, description: 'Direct algorithmic flash loan arbitrage' }
  ]);

  const [editWalletAddress, setEditWalletAddress] = useState(walletConfig.trc20Address);
  const [editMinDeposit, setEditMinDeposit] = useState(walletConfig.minDeposit.toString());

  const [editTelegram, setEditTelegram] = useState(customerCareConfig.telegram);
  const [editWhatsapp, setEditWhatsapp] = useState(customerCareConfig.whatsapp);
  const [editEmail, setEditEmail] = useState(customerCareConfig.email);

  const [editDailyBonus, setEditDailyBonus] = useState(bonusConfig.dailyReward.toString());
  const [editWelcomeBonus, setEditWelcomeBonus] = useState(bonusConfig.welcomeBonus.toString());

  const [editTier1, setEditTier1] = useState(referralConfig.tier1.toString());
  const [editTier2, setEditTier2] = useState(referralConfig.tier2.toString());
  const [editTier3, setEditTier3] = useState(referralConfig.tier3.toString());

  const [editLoan, setEditLoan] = useState<LoanData>(loan);

  // Selected KYC Modal
  const [selectedKyc, setSelectedKyc] = useState<KycRequestData | null>(null);

  // User Management States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [userVipFilter, setUserVipFilter] = useState<string>('all');

  // Modals for User Management
  const [selectedUserForInspect, setSelectedUserForInspect] = useState<ManagedUser | null>(null);
  const [editingUserBalance, setEditingUserBalance] = useState<{ user: ManagedUser; amount: string } | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Form state for adding user
  const [addForm, setAddForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    vipLevel: 1,
    usdtBalance: 1000,
    role: 'user' as UserRole
  });

  const isSubAdmin = currentRole === 'sub_admin';

  const checkSubAdminGuard = (): boolean => {
    if (isSubAdmin) {
      alert('⚠️ Sub-Admin Access Limit: You have view-only permission. Only Super Admin (emukhan580) can approve requests or alter user data.');
      return true;
    }
    return false;
  };

  const safeApproveTx = (txId: string) => {
    if (checkSubAdminGuard()) return;
    onApproveTransaction(txId);
  };

  const safeRejectTx = (txId: string) => {
    if (checkSubAdminGuard()) return;
    onRejectTransaction(txId);
  };

  const safeApproveKyc = (id: string) => {
    if (checkSubAdminGuard()) return;
    onApproveKyc(id);
  };

  const safeRejectKyc = (id: string) => {
    if (checkSubAdminGuard()) return;
    onRejectKyc(id);
  };

  const safeChangeUserStatus = (userId: string, status: 'active' | 'suspended' | 'banned') => {
    if (checkSubAdminGuard()) return;
    onChangeUserStatus(userId, status);
  };

  const safeChangeUserVip = (userId: string, vipLevel: number) => {
    if (checkSubAdminGuard()) return;
    onChangeUserVip(userId, vipLevel);
  };

  const safeChangeUserRole = (userId: string, role: UserRole) => {
    if (checkSubAdminGuard()) return;
    onChangeUserRole(userId, role);
  };

  const handleSaveBalance = () => {
    if (checkSubAdminGuard()) return;
    const num = parseFloat(balanceInput);
    if (!isNaN(num)) {
      onUpdateWalletBalance(num);
      alert(`User wallet balance successfully updated to $${num.toFixed(2)} USDT`);
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkSubAdminGuard()) return;
    if (!broadcastTitle || !broadcastMessage) return;
    onSendGlobalBroadcast(broadcastTitle, broadcastMessage);
    setBroadcastSent(true);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const pendingCount = kycRequests.filter(r => r.status === 'pending').length;

  // Filtered Users List calculation
  const filteredUsers = usersList.filter(u => {
    const query = userSearchQuery.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query) ||
      u.phone.toLowerCase().includes(query);

    const matchesStatus = userStatusFilter === 'all' || u.accountStatus === userStatusFilter;
    const matchesVip = userVipFilter === 'all' || u.vipLevel === parseInt(userVipFilter);

    return matchesSearch && matchesStatus && matchesVip;
  });

  const totalVaultFunds = usersList.reduce((acc, u) => acc + u.usdtBalance, 0);
  const activeUserCount = usersList.filter(u => u.accountStatus === 'active').length;
  const restrictedUserCount = usersList.filter(u => u.accountStatus === 'suspended' || u.accountStatus === 'banned').length;

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkSubAdminGuard()) return;
    if (!addForm.fullName || !addForm.email) return;

    const newUser: ManagedUser = {
      id: `USR-${Math.floor(1000000 + Math.random() * 9000000)}`,
      username: addForm.username || addForm.fullName.toLowerCase().replace(/\s+/g, ''),
      fullName: addForm.fullName,
      email: addForm.email,
      phone: addForm.phone || '+1 (555) 000-1122',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      vipLevel: addForm.vipLevel,
      kycStatus: 'unverified',
      accountStatus: 'active',
      role: addForm.role,
      usdtBalance: addForm.usdtBalance,
      totalDeposit: addForm.usdtBalance,
      totalWithdraw: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      referralCode: `VIP-${Math.floor(1000 + Math.random() * 9000)}`,
      tradesCount: 0
    };

    onAddNewUser(newUser);
    setShowAddUserModal(false);
    setAddForm({
      fullName: '',
      username: '',
      email: '',
      phone: '',
      vipLevel: 1,
      usdtBalance: 1000,
      role: 'user'
    });
  };

  const handleSaveUserBalance = () => {
    if (checkSubAdminGuard()) return;
    if (!editingUserBalance) return;
    const amountNum = parseFloat(editingUserBalance.amount);
    if (!isNaN(amountNum) && amountNum >= 0) {
      onUpdateUserBalance(editingUserBalance.user.id, amountNum);
      if (selectedUserForInspect && selectedUserForInspect.id === editingUserBalance.user.id) {
        setSelectedUserForInspect(prev => prev ? { ...prev, usdtBalance: amountNum } : null);
      }
      setEditingUserBalance(null);
    }
  };

  const handleSaveInvestmentPlans = () => {
    if (checkSubAdminGuard()) return;
    if (onUpdateInvestmentPlans) {
      onUpdateInvestmentPlans(editPlans);
      alert('✅ Investment Plans successfully updated across platform!');
    }
  };

  const handleSaveWalletConfig = () => {
    if (checkSubAdminGuard()) return;
    const minDep = parseFloat(editMinDeposit);
    if (isNaN(minDep) || !editWalletAddress) {
      alert('Please provide valid wallet address and minimum deposit amount.');
      return;
    }
    if (onUpdateWalletConfig) {
      onUpdateWalletConfig({ trc20Address: editWalletAddress, minDeposit: minDep });
      alert('✅ Deposit Wallet & Address configuration saved!');
    }
  };

  const handleSaveCustomerCare = () => {
    if (checkSubAdminGuard()) return;
    if (onUpdateCustomerCareConfig) {
      onUpdateCustomerCareConfig({ telegram: editTelegram, whatsapp: editWhatsapp, email: editEmail });
      alert('✅ 24/7 Customer Care channels updated!');
    }
  };

  const handleSaveBonusConfig = () => {
    if (checkSubAdminGuard()) return;
    const daily = parseFloat(editDailyBonus);
    const welcome = parseFloat(editWelcomeBonus);
    if (isNaN(daily) || isNaN(welcome)) return;
    if (onUpdateBonusConfig) {
      onUpdateBonusConfig({ dailyReward: daily, welcomeBonus: welcome });
      alert('✅ Bonus Reward Center settings saved!');
    }
  };

  const handleSaveReferralConfig = () => {
    if (checkSubAdminGuard()) return;
    const t1 = parseFloat(editTier1);
    const t2 = parseFloat(editTier2);
    const t3 = parseFloat(editTier3);
    if (isNaN(t1) || isNaN(t2) || isNaN(t3)) return;
    if (onUpdateReferralConfig) {
      onUpdateReferralConfig({ tier1: t1, tier2: t2, tier3: t3 });
      alert('✅ Referral Commission rates saved!');
    }
  };

  const handleSaveLoanNotice = () => {
    if (checkSubAdminGuard()) return;
    if (onUpdateLoanNotice) {
      onUpdateLoanNotice(editLoan);
      alert('✅ Loan System & Official Repayment Notice updated!');
    }
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
            ⚡ {isSubAdmin ? 'Sub-Admin Workspace (View Only)' : 'Super Admin Management Suite'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Full platform control suite: User management, Investment Plans, Deposit Wallet, Customer Care, Loan Notices, Bonus Rewards, and Referral Rates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Cloud SQL (PostgreSQL) Live
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#F4C542] text-black font-extrabold text-xs uppercase tracking-widest shrink-0">
            Role: {currentRole}
          </div>
        </div>
      </div>

      {/* Sub-Admin View-Only Banner Notice */}
      {isSubAdmin && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-amber-300 text-xs font-semibold gap-3">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="font-extrabold text-sm text-amber-200 uppercase tracking-wider">Sub-Admin Access Mode (View Only)</div>
              <p className="text-amber-300/80 mt-0.5">
                You can monitor live platform user metrics, deposits, loans, and withdrawal requests. Action permissions (approvals, balance edits, status changes) are restricted to Super Admin (<strong>emukhan580</strong>).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-extrabold uppercase text-[10px] border border-amber-500/40 shrink-0">
            READ ONLY
          </span>
        </div>
      )}

      {/* ADMIN SUB-MODULE NAVIGATION TABS */}
      <div className="glass-gold-card p-3 flex items-center gap-2 overflow-x-auto scrollbar-none border border-[#F4C542]/30">
        {[
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'approvals', label: 'Fund Approvals', icon: CheckCircle2 },
          { id: 'kyc', label: 'KYC Document Review', icon: Award },
          { id: 'invest_plans', label: 'Investment Plans Edit', icon: TrendingUp },
          { id: 'deposit_wallet', label: 'Deposit Wallet Edit', icon: Wallet },
          { id: 'bonus_center', label: 'Bonus Rewards Edit', icon: Gift },
          { id: 'loan_system', label: 'Loan System Edit', icon: Landmark },
          { id: 'loan_notice', label: 'Official Loan Notice Edit', icon: AlertTriangle },
          { id: 'referral', label: 'Referral Commission Edit', icon: Share2 },
          { id: 'customer_care', label: '24/7 Customer Care Edit', icon: Headphones },
          { id: 'broadcast', label: 'Broadcast Alerts', icon: Send }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-[#F4C542] text-black shadow-lg shadow-[#F4C542]/20 scale-[1.02]'
                  : 'bg-[#080D18] text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. USER DIRECTORY MODULE */}
      {adminTab === 'users' && (
        <div className="space-y-6">
          <div className="glass-gold-card p-6 space-y-5 border-2 border-[#F4C542]/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F4C542]" /> User Management & Member Directory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comprehensive control center for editing user balances, VIP levels, account statuses, and permissions.
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 btn-gold-gradient text-xs font-extrabold text-black flex items-center gap-2 rounded-xl shrink-0 hover:scale-[1.02] transition-transform shadow-lg shadow-[#F4C542]/10"
            >
              <UserPlus className="w-4 h-4" /> Add New User
            </button>
          </div>

        {/* User Management Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#080D18] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Registered Users</span>
            <span className="text-lg font-extrabold text-slate-100">{usersList.length}</span>
          </div>

          <div className="bg-[#080D18] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Users</span>
            <span className="text-lg font-extrabold text-emerald-400">{activeUserCount}</span>
          </div>

          <div className="bg-[#080D18] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Suspended / Banned</span>
            <span className="text-lg font-extrabold text-red-400">{restrictedUserCount}</span>
          </div>

          <div className="bg-[#080D18] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Vault Funds</span>
            <span className="text-lg font-extrabold text-[#F4C542]">${(totalVaultFunds ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080D18] p-3 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search user, email, ID, or phone..."
              className="w-full bg-[#0D121F] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#F4C542]"
            />
            {userSearchQuery && (
              <button onClick={() => setUserSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-[#0D121F] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-[#F4C542]" />
              <span className="text-[11px] text-slate-400 hidden sm:inline">Status:</span>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none"
              >
                <option value="all" className="bg-[#0D121F]">All Statuses</option>
                <option value="active" className="bg-[#0D121F]">Active Only</option>
                <option value="suspended" className="bg-[#0D121F]">Suspended Only</option>
                <option value="banned" className="bg-[#0D121F]">Banned Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#0D121F] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <Crown className="w-3.5 h-3.5 text-[#F4C542]" />
              <span className="text-[11px] text-slate-400 hidden sm:inline">VIP:</span>
              <select
                value={userVipFilter}
                onChange={(e) => setUserVipFilter(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none"
              >
                <option value="all" className="bg-[#0D121F]">All VIP Levels</option>
                <option value="0" className="bg-[#0D121F]">VIP 0</option>
                <option value="1" className="bg-[#0D121F]">VIP 1</option>
                <option value="2" className="bg-[#0D121F]">VIP 2</option>
                <option value="3" className="bg-[#0D121F]">VIP 3</option>
                <option value="4" className="bg-[#0D121F]">VIP 4</option>
                <option value="5" className="bg-[#0D121F]">VIP 5</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-[#080D18]">
                <th className="p-3">User Profile</th>
                <th className="p-3">Role & VIP</th>
                <th className="p-3">KYC Status</th>
                <th className="p-3">Account Status</th>
                <th className="p-3">USDT Balance</th>
                <th className="p-3">Joined Date</th>
                <th className="p-3 text-right">Admin Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic font-sans">
                    No users matching the filter criteria found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* User Profile Info */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="font-bold text-slate-100 font-sans flex items-center gap-1.5">
                            {u.fullName}
                            {u.role === 'admin' && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#F4C542]/20 border border-[#F4C542]/40 text-[#F4C542]">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {u.id} • {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* VIP Level & Role */}
                    <td className="p-3 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-[#F4C542] to-amber-600 text-black shadow-sm">
                          VIP {u.vipLevel}
                        </span>
                        
                        {/* Quick VIP Selector */}
                        <select
                          value={u.vipLevel}
                          onChange={(e) => safeChangeUserVip(u.id, parseInt(e.target.value))}
                          className="bg-[#0D121F] border border-slate-700 text-[10px] text-slate-200 rounded px-1 py-0.5 focus:outline-none"
                          title="Change VIP Tier"
                        >
                          <option value={0}>VIP 0</option>
                          <option value={1}>VIP 1</option>
                          <option value={2}>VIP 2</option>
                          <option value={3}>VIP 3</option>
                          <option value={4}>VIP 4</option>
                          <option value={5}>VIP 5</option>
                        </select>
                      </div>
                    </td>

                    {/* KYC Status */}
                    <td className="p-3 font-sans">
                      {u.kycStatus === 'verified' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : u.kycStatus === 'pending' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : u.kycStatus === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 border border-red-500/40 text-red-400 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-400 w-fit">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="p-3 font-sans">
                      {u.accountStatus === 'active' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      ) : u.accountStatus === 'suspended' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 w-fit">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      )}
                    </td>

                    {/* USDT Balance */}
                    <td className="p-3 font-mono font-extrabold text-slate-100 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>${u.usdtBalance.toFixed(2)}</span>
                        <button
                          onClick={() => setEditingUserBalance({ user: u, amount: u.usdtBalance.toString() })}
                          className="p-1 rounded text-slate-400 hover:text-[#F4C542] hover:bg-slate-800 transition-colors"
                          title="Edit USDT Balance"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="p-3 text-slate-400 font-sans text-[11px]">{u.joinedDate}</td>

                    {/* Admin Action Control Buttons */}
                    <td className="p-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Inspect Profile Button */}
                        <button
                          onClick={() => setSelectedUserForInspect(u)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Inspect User Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#F4C542]" /> Inspect
                        </button>

                        {/* Status Toggle Button (Ban/Activate) */}
                        {u.accountStatus === 'active' ? (
                          <button
                            onClick={() => safeChangeUserStatus(u.id, 'suspended')}
                            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Suspend User"
                          >
                            <Ban className="w-3 h-3" /> Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => safeChangeUserStatus(u.id, 'active')}
                            className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            title="Reactivate User"
                          >
                            <UserCheck className="w-3 h-3" /> Activate
                          </button>
                        )}

                        {/* Role Assignment Selector */}
                        {u.username === 'emukhan580' || u.role === 'admin' ? (
                          <span className="px-2 py-1 rounded text-[10px] font-extrabold bg-[#F4C542]/20 border border-[#F4C542]/40 text-[#F4C542]">
                            SUPER ADMIN
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => safeChangeUserRole(u.id, e.target.value as UserRole)}
                            className="bg-[#0D121F] border border-slate-700 text-[10px] font-bold text-slate-200 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                            title="Assign Role"
                          >
                            <option value="user">User</option>
                            <option value="sub_admin">Sub-Admin</option>
                          </select>
                        )}

                      </div>
                    </td>

                  </tr>
                )))
              }
            </tbody>
          </table>
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
        </div>
      )}

      {/* 2. FUND APPROVALS MODULE */}
      {adminTab === 'approvals' && (
        <div className="glass-gold-card p-6 space-y-4 border-2 border-emerald-500/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" /> Deposit & Withdrawal Approval Queue
            </h3>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {transactions.filter(t => (t.type === 'deposit' || t.type === 'withdraw') && t.status === 'pending').length} Pending Approval
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-[#080D18]">
                <th className="p-3">Tx ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Asset / Network</th>
                <th className="p-3">Requested At</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {transactions.filter(t => t.type === 'deposit' || t.type === 'withdraw').length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                    No deposit or withdrawal requests found.
                  </td>
                </tr>
              ) : (
                transactions.filter(t => t.type === 'deposit' || t.type === 'withdraw').map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-slate-200">{tx.id}</td>
                    <td className="p-3">
                      {tx.type === 'deposit' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-fit">
                          <ArrowDownLeft className="w-3 h-3" /> DEPOSIT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1 w-fit">
                          <ArrowUpRight className="w-3 h-3" /> WITHDRAWAL
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-extrabold text-slate-100 font-mono text-sm">
                      ${tx.amount.toFixed(2)} USDT
                    </td>
                    <td className="p-3 text-slate-300 font-sans text-xs">
                      {tx.asset}
                      {tx.note && <div className="text-[10px] text-slate-400 font-mono">{tx.note}</div>}
                    </td>
                    <td className="p-3 text-slate-400 font-sans text-[11px]">{tx.date}</td>
                    <td className="p-3">
                      {tx.status === 'completed' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> APPROVED
                        </span>
                      ) : tx.status === 'failed' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-500/20 border border-red-500/40 text-red-400 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1 w-fit animate-pulse">
                          <Clock className="w-3 h-3" /> PENDING ADMIN
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {tx.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5 font-sans">
                          <button
                            onClick={() => safeApproveTx(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-[11px] font-extrabold flex items-center gap-1 transition-all shadow-md shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve Done
                          </button>
                          <button
                            onClick={() => safeRejectTx(tx.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic font-sans">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* 3. KYC REVIEW MODULE */}
      {adminTab === 'kyc' && (
        <div className="glass-gold-card p-6 space-y-4 border-2 border-[#F4C542]/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F4C542]" /> KYC Identity Verification Approval Queue
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#F4C542]/20 border border-[#F4C542]/40 text-[#F4C542] text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {pendingCount} Pending Review
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase bg-[#080D18]">
                <th className="p-3">Req ID</th>
                <th className="p-3">User & Email</th>
                <th className="p-3">Doc Type</th>
                <th className="p-3">Doc Number</th>
                <th className="p-3">Submitted</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {kycRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500 italic">
                    No KYC verification requests found.
                  </td>
                </tr>
              ) : (
                kycRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-bold text-slate-200">{req.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-100 font-sans">{req.fullName}</div>
                      <div className="text-[10px] text-slate-400">{req.userEmail}</div>
                    </td>
                    <td className="p-3 uppercase text-amber-400 font-bold">{req.docType}</td>
                    <td className="p-3 text-slate-300 font-mono">{req.docNumber}</td>
                    <td className="p-3 text-slate-400 font-sans text-[11px]">{req.submittedAt}</td>
                    <td className="p-3">
                      {req.status === 'verified' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> APPROVED
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-500/20 border border-red-500/40 text-red-400 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1 w-fit animate-pulse">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-sans">
                        <button
                          onClick={() => setSelectedKyc(req)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#F4C542]" /> Inspect
                        </button>

                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => onApproveKyc(req.id)}
                              className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-black text-[11px] font-extrabold flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => onRejectKyc(req.id)}
                              className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {/* 4. INVESTMENT PLANS EDIT MODULE */}
      {adminTab === 'invest_plans' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F4C542]" /> Edit Investment Plans & Profit Packages
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Modify yields, durations, and investment limits for express trading pools.
              </p>
            </div>
            <button
              onClick={handleSaveInvestmentPlans}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Investment Plans
            </button>
          </div>

          <div className="space-y-4">
            {editPlans.map((plan, idx) => (
              <div key={plan.id} className="p-4 rounded-xl bg-[#080D18] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F4C542] uppercase">Plan #{idx + 1} - ID: {plan.id}</span>
                  <button
                    onClick={() => {
                      if (checkSubAdminGuard()) return;
                      setEditPlans(editPlans.filter(p => p.id !== plan.id));
                    }}
                    className="text-xs text-red-400 font-bold hover:underline"
                  >
                    Remove Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Plan Title</label>
                    <input
                      type="text"
                      value={plan.title}
                      onChange={(e) => {
                        const updated = [...editPlans];
                        updated[idx].title = e.target.value;
                        setEditPlans(updated);
                      }}
                      className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Profit Yield (%)</label>
                    <input
                      type="number"
                      value={plan.profitPercentage}
                      onChange={(e) => {
                        const updated = [...editPlans];
                        updated[idx].profitPercentage = parseFloat(e.target.value) || 0;
                        setEditPlans(updated);
                      }}
                      className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration (Seconds)</label>
                    <input
                      type="number"
                      value={plan.durationSeconds}
                      onChange={(e) => {
                        const updated = [...editPlans];
                        updated[idx].durationSeconds = parseInt(e.target.value) || 0;
                        setEditPlans(updated);
                      }}
                      className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Min Investment ($)</label>
                    <input
                      type="number"
                      value={plan.minInvestment}
                      onChange={(e) => {
                        const updated = [...editPlans];
                        updated[idx].minInvestment = parseFloat(e.target.value) || 0;
                        setEditPlans(updated);
                      }}
                      className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                if (checkSubAdminGuard()) return;
                const newPlan: InvestmentPlan = {
                  id: `p${Date.now()}`,
                  title: 'New Yield Plan',
                  durationSeconds: 120,
                  profitPercentage: 25,
                  minInvestment: 50,
                  maxInvestment: 50000,
                  description: 'Custom express trading pool'
                };
                setEditPlans([...editPlans, newPlan]);
              }}
              className="w-full py-2.5 border border-dashed border-[#F4C542]/40 rounded-xl text-xs font-bold text-[#F4C542] hover:bg-[#F4C542]/10 transition-colors"
            >
              + Add New Custom Investment Package
            </button>
          </div>
        </div>
      )}

      {/* 5. DEPOSIT WALLET TAB */}
      {adminTab === 'deposit_wallet' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#F4C542]" /> Edit Deposit Wallet & QR Configuration
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set the official platform receiving wallet address (TRC20 / ERC20) and deposit limits.
              </p>
            </div>
            <button
              onClick={handleSaveWalletConfig}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Wallet Settings
            </button>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Deposit Wallet Address (USDT TRC20)</label>
              <input
                type="text"
                value={editWalletAddress}
                onChange={(e) => setEditWalletAddress(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum Deposit Amount ($ USDT)</label>
              <input
                type="number"
                value={editMinDeposit}
                onChange={(e) => setEditMinDeposit(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:border-[#F4C542] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. BONUS REWARDS TAB */}
      {adminTab === 'bonus_center' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#F4C542]" /> Edit Bonus Reward Center Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure welcome reward amounts and daily task bonuses.
              </p>
            </div>
            <button
              onClick={handleSaveBonusConfig}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Bonus Config
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Welcome Sign-Up Bonus ($ USDT)</label>
              <input
                type="number"
                value={editWelcomeBonus}
                onChange={(e) => setEditWelcomeBonus(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-extrabold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Task Reward ($ USDT)</label>
              <input
                type="number"
                value={editDailyBonus}
                onChange={(e) => setEditDailyBonus(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-[#F4C542] font-extrabold font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. LOAN SYSTEM TAB */}
      {adminTab === 'loan_system' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#F4C542]" /> Edit Loan System & Official Overdue Notice
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Control interest rates, loan terms, and trigger/clear the user Official Repayment Notice.
              </p>
            </div>
            <button
              onClick={handleSaveLoanNotice}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Loan Settings
            </button>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="p-4 rounded-xl bg-[#080D18] border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-[#F4C542] uppercase">Active User Loan Record</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Borrower Name</label>
                  <input
                    type="text"
                    value={editLoan.borrowerName}
                    onChange={(e) => setEditLoan({ ...editLoan, borrowerName: e.target.value })}
                    className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Principal Amount ($ USDT)</label>
                  <input
                    type="number"
                    value={editLoan.principalAmount}
                    onChange={(e) => setEditLoan({ ...editLoan, principalAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Daily Interest Rate (%)</label>
                  <input
                    type="number"
                    value={editLoan.interestRate}
                    onChange={(e) => setEditLoan({ ...editLoan, interestRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0D121F] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-300">Loan Status:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (checkSubAdminGuard()) return;
                    setEditLoan({ ...editLoan, isOverdue: !editLoan.isOverdue, status: !editLoan.isOverdue ? 'overdue' : 'active' });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                    editLoan.isOverdue
                      ? 'bg-red-500 text-white'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {editLoan.isOverdue ? '🚨 OVERDUE NOTICE ACTIVE (Click to Clear)' : '✅ CLEAN / ACTIVE LOAN (Click to Set Overdue)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7.5. OFFICIAL LOAN NOTICE TAB */}
      {adminTab === 'loan_notice' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Edit Official Loan Repayment Notice
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure loan overdue warning status, borrower case details, and repayment countdown timer.
              </p>
            </div>
            <button
              onClick={handleSaveLoanNotice}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Official Notice Settings
            </button>
          </div>

          <div className="space-y-4 max-w-2xl bg-[#080D18] p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Notice Overdue Status Banner</span>
              <button
                type="button"
                onClick={() => {
                  if (checkSubAdminGuard()) return;
                  setEditLoan({ ...editLoan, isOverdue: !editLoan.isOverdue, status: !editLoan.isOverdue ? 'overdue' : 'active' });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  editLoan.isOverdue
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {editLoan.isOverdue ? '🚨 OVERDUE WARNING ACTIVE (User Sees Overdue Badge)' : '✅ NORMAL LOAN NOTICE (No Overdue Red Warning)'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Borrower Full Name</label>
                <input
                  type="text"
                  value={editLoan.borrowerName}
                  onChange={(e) => setEditLoan({ ...editLoan, borrowerName: e.target.value })}
                  className="w-full bg-[#0D121F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Borrower Username / ID</label>
                <input
                  type="text"
                  value={editLoan.username}
                  onChange={(e) => setEditLoan({ ...editLoan, username: e.target.value })}
                  className="w-full bg-[#0D121F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principal Amount ($ USDT)</label>
                <input
                  type="number"
                  value={editLoan.principalAmount}
                  onChange={(e) => setEditLoan({ ...editLoan, principalAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#0D121F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Interest Rate (%)</label>
                <input
                  type="number"
                  value={editLoan.interestRate}
                  onChange={(e) => setEditLoan({ ...editLoan, interestRate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#0D121F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Repayment Due Date</label>
                <input
                  type="text"
                  value={editLoan.dueDate}
                  onChange={(e) => setEditLoan({ ...editLoan, dueDate: e.target.value })}
                  placeholder="2026-08-01T00:00:00"
                  className="w-full bg-[#0D121F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Borrower Phone</label>
                <input
                  type="text"
                  value={editLoan.phone}
                  onChange={(e) => setEditLoan({ ...editLoan, phone: e.target.value })}
                  className="w-full bg-[#0D121F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. REFERRAL RATES TAB */}
      {adminTab === 'referral' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#F4C542]" /> Edit Referral Commission Rates
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust multi-tier affiliate referral commission percentages.
              </p>
            </div>
            <button
              onClick={handleSaveReferralConfig}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Commission Rates
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Level 1 Direct Referral (%)</label>
              <input
                type="number"
                value={editTier1}
                onChange={(e) => setEditTier1(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-[#F4C542] font-extrabold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Level 2 Secondary Referral (%)</label>
              <input
                type="number"
                value={editTier2}
                onChange={(e) => setEditTier2(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 font-extrabold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-[#F4C542] mb-1">Level 3 Network Referral (%)</label>
              <input
                type="number"
                value={editTier3}
                onChange={(e) => setEditTier3(e.target.value)}
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-extrabold font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. CUSTOMER CARE TAB */}
      {adminTab === 'customer_care' && (
        <div className="glass-gold-card p-6 space-y-6 border-2 border-[#F4C542]/40">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-[#F4C542]" /> Edit 24/7 Customer Care Handles
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Update official Telegram support handle, WhatsApp number, and support email.
              </p>
            </div>
            <button
              onClick={handleSaveCustomerCare}
              className="px-4 py-2.5 btn-gold-gradient text-black font-extrabold text-xs flex items-center gap-2 rounded-xl"
            >
              <Save className="w-4 h-4" /> Save Support Channels
            </button>
          </div>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Support Channel / Handle</label>
              <input
                type="text"
                value={editTelegram}
                onChange={(e) => setEditTelegram(e.target.value)}
                placeholder="@USDTRewardProSupport"
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-sky-400 font-bold focus:border-[#F4C542] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Customer Care Number</label>
              <input
                type="text"
                value={editWhatsapp}
                onChange={(e) => setEditWhatsapp(e.target.value)}
                placeholder="+1 (800) 555-0199"
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-bold focus:border-[#F4C542] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Support Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="support@usdtpro.com"
                className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-purple-400 font-bold focus:border-[#F4C542] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 10. BROADCAST ALERTS TAB */}
      {adminTab === 'broadcast' && (
        <div className="glass-gold-card p-6 space-y-4 max-w-xl">
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
              rows={3}
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
      )}
      {selectedKyc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D121F] border border-[#F4C542]/50 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#F4C542]/15 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-100">Review KYC Documents: {selectedKyc.fullName}</h3>
                  <p className="text-[11px] text-slate-400">Request ID: {selectedKyc.id} • Submitted: {selectedKyc.submittedAt}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedKyc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#080D18] p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Document Type:</span>
                <span className="font-bold text-amber-400 uppercase">{selectedKyc.docType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Doc Number:</span>
                <span className="font-bold text-slate-200 font-mono">{selectedKyc.docNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">User Email:</span>
                <span className="font-semibold text-slate-300">{selectedKyc.userEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Current Status:</span>
                <span className={`font-bold uppercase ${
                  selectedKyc.status === 'verified' ? 'text-emerald-400' : selectedKyc.status === 'rejected' ? 'text-red-400' : 'text-amber-300'
                }`}>
                  {selectedKyc.status}
                </span>
              </div>
            </div>

            {/* Document Image Previews */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Uploaded Verification Assets</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Front Side */}
                <div className="bg-[#080D18] border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#F4C542]" /> ID Front Image
                  </div>
                  <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800">
                    <img src={selectedKyc.frontDocUrl} alt="Front ID" className="max-h-full object-contain" />
                  </div>
                </div>

                {/* Back Side / Selfie */}
                <div className="bg-[#080D18] border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-[#F4C542]" /> Face Liveness / Selfie
                  </div>
                  <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-800">
                    <img src={selectedKyc.selfieDocUrl || selectedKyc.frontDocUrl} alt="Selfie" className="max-h-full object-contain" />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Decision Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  onRejectKyc(selectedKyc.id);
                  setSelectedKyc(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/40 text-xs font-extrabold uppercase transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject KYC
              </button>

              <button
                onClick={() => {
                  onApproveKyc(selectedKyc.id);
                  setSelectedKyc(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-extrabold uppercase shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Upgrade User
              </button>
            </div>

          </div>
        </div>
      )}

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

      {/* MODAL 1: Inspect User Details */}
      {selectedUserForInspect && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D121F] border border-[#F4C542]/50 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedUserForInspect.avatar} alt={selectedUserForInspect.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-[#F4C542]" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                    {selectedUserForInspect.fullName}
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-[#F4C542] to-amber-600 text-black">
                      VIP {selectedUserForInspect.vipLevel}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedUserForInspect.id} • @{selectedUserForInspect.username}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForInspect(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#080D18] p-3.5 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Email Address:</span>
                <span className="font-semibold text-slate-200">{selectedUserForInspect.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Phone Number:</span>
                <span className="font-semibold text-slate-200">{selectedUserForInspect.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">USDT Vault Balance:</span>
                <span className="font-extrabold text-[#F4C542] text-sm">${(selectedUserForInspect?.usdtBalance ?? 0).toFixed(2)} USDT</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Account Role:</span>
                <span className="font-bold uppercase text-slate-100">{selectedUserForInspect?.role ?? 'user'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Total Deposits:</span>
                <span className="font-bold text-emerald-400">${(selectedUserForInspect?.totalDeposit ?? 0).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Total Withdrawals:</span>
                <span className="font-bold text-blue-400">${(selectedUserForInspect?.totalWithdraw ?? 0).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Total Trades Executed:</span>
                <span className="font-bold text-slate-200">{selectedUserForInspect?.tradesCount ?? 0} Trades</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[11px]">Referral Code:</span>
                <span className="font-bold text-amber-300">{selectedUserForInspect.referralCode}</span>
              </div>
            </div>

            {/* Direct Admin Override Controls */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Direct Admin Override Controls</h4>
              
              <div className="grid grid-cols-2 gap-2 font-sans">
                <button
                  onClick={() => {
                    if (checkSubAdminGuard()) return;
                    setEditingUserBalance({ user: selectedUserForInspect, amount: selectedUserForInspect.usdtBalance.toString() });
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-[#F4C542]" /> Edit Balance
                </button>

                {selectedUserForInspect.username === 'emukhan580' ? (
                  <div className="py-2.5 px-3 rounded-xl bg-[#F4C542]/20 text-[#F4C542] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#F4C542]/40">
                    <ShieldCheck className="w-4 h-4" /> Super Admin
                  </div>
                ) : (
                  <select
                    value={selectedUserForInspect.role}
                    onChange={(e) => {
                      if (checkSubAdminGuard()) return;
                      const nextRole = e.target.value as UserRole;
                      safeChangeUserRole(selectedUserForInspect.id, nextRole);
                      setSelectedUserForInspect(prev => prev ? { ...prev, role: nextRole } : null);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-100 text-xs font-bold border border-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="user">Role: User</option>
                    <option value="sub_admin">Role: Sub-Admin</option>
                  </select>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 font-sans">
                {selectedUserForInspect.accountStatus === 'active' ? (
                  <button
                    onClick={() => {
                      if (checkSubAdminGuard()) return;
                      safeChangeUserStatus(selectedUserForInspect.id, 'suspended');
                      setSelectedUserForInspect(prev => prev ? { ...prev, accountStatus: 'suspended' } : null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Ban className="w-4 h-4" /> Suspend Account
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (checkSubAdminGuard()) return;
                      safeChangeUserStatus(selectedUserForInspect.id, 'active');
                      setSelectedUserForInspect(prev => prev ? { ...prev, accountStatus: 'active' } : null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <UserCheck className="w-4 h-4" /> Activate Account
                  </button>
                )}

                <button
                  onClick={() => {
                    if (checkSubAdminGuard()) return;
                    safeChangeUserStatus(selectedUserForInspect.id, 'banned');
                    setSelectedUserForInspect(prev => prev ? { ...prev, accountStatus: 'banned' } : null);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/40 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldAlert className="w-4 h-4" /> Ban
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Edit User USDT Balance */}
      {editingUserBalance && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D121F] border border-[#F4C542]/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F4C542]/20 border border-[#F4C542]/40 flex items-center justify-center text-[#F4C542]">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Adjust User USDT Balance</h3>
                  <p className="text-[11px] text-slate-400">{editingUserBalance.user.fullName} ({editingUserBalance.user.id})</p>
                </div>
              </div>

              <button
                onClick={() => setEditingUserBalance(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">New USDT Vault Balance</label>
                <input
                  type="number"
                  value={editingUserBalance.amount}
                  onChange={(e) => setEditingUserBalance({ ...editingUserBalance, amount: e.target.value })}
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-extrabold text-[#F4C542] font-mono focus:outline-none focus:border-[#F4C542]"
                  placeholder="0.00"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Quick Preset Increments:</span>
                <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(editingUserBalance.amount) || 0;
                      setEditingUserBalance({ ...editingUserBalance, amount: (cur + 100).toString() });
                    }}
                    className="py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-bold border border-slate-700"
                  >
                    +$100
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(editingUserBalance.amount) || 0;
                      setEditingUserBalance({ ...editingUserBalance, amount: (cur + 500).toString() });
                    }}
                    className="py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-bold border border-slate-700"
                  >
                    +$500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(editingUserBalance.amount) || 0;
                      setEditingUserBalance({ ...editingUserBalance, amount: (cur + 1000).toString() });
                    }}
                    className="py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-bold border border-slate-700"
                  >
                    +$1000
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUserBalance({ ...editingUserBalance, amount: '0' })}
                    className="py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-bold border border-red-500/40"
                  >
                    Set $0
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEditingUserBalance(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUserBalance}
                className="flex-1 py-2.5 rounded-xl btn-gold-gradient text-black text-xs font-extrabold shadow-lg shadow-[#F4C542]/10"
              >
                Confirm New Balance
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: Add New User Form */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D121F] border border-[#F4C542]/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F4C542]/15 border border-[#F4C542]/30 flex items-center justify-center text-[#F4C542]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Add New Platform Member</h3>
                  <p className="text-[11px] text-slate-400">Create user account & set initial wallet balance</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  placeholder="e.g., Marcus Vance"
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#F4C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Username</label>
                  <input
                    type="text"
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                    placeholder="marcus_v"
                    className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#F4C542]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">VIP Tier</label>
                  <select
                    value={addForm.vipLevel}
                    onChange={(e) => setAddForm({ ...addForm, vipLevel: parseInt(e.target.value) })}
                    className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#F4C542]"
                  >
                    <option value={0}>VIP 0</option>
                    <option value={1}>VIP 1</option>
                    <option value={2}>VIP 2</option>
                    <option value={3}>VIP 3</option>
                    <option value={4}>VIP 4</option>
                    <option value={5}>VIP 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="marcus@example.com"
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#F4C542]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial USDT Balance</label>
                  <input
                    type="number"
                    value={addForm.usdtBalance}
                    onChange={(e) => setAddForm({ ...addForm, usdtBalance: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 font-mono focus:outline-none focus:border-[#F4C542]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">User Role</label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm({ ...addForm, role: e.target.value as UserRole })}
                    className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-[#F4C542]"
                  >
                    <option value="user">User (Standard)</option>
                    <option value="sub_admin">Sub-Admin (Read-Only)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-gold-gradient text-black font-extrabold shadow-lg shadow-[#F4C542]/10"
                >
                  Create Member Account
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
