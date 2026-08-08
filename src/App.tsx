import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  UserRole, 
  UserProfile, 
  WalletState, 
  ActiveInvestment, 
  InvestmentPlan, 
  TradeRecord, 
  TransactionItem, 
  NotificationItem, 
  LoanData,
  KycRequestData,
  ManagedUser
} from './types';
import { 
  initialUserProfile, 
  initialWalletState, 
  investmentPlans, 
  initialCryptoTickers, 
  initialTransactions, 
  initialNotifications, 
  initialLoanNoticeData,
  initialUsersList
} from './data/mockData';
import { fetchLiveBinanceTickers } from './services/binance';

// Components
import { Header } from './components/Header';
import { QuickActions } from './components/QuickActions';
import { ProfileCard } from './components/ProfileCard';
import { BalanceCard } from './components/BalanceCard';
import { QuickStats } from './components/QuickStats';
import { InvestmentPackages } from './components/InvestmentPackages';
import { LiveTradingEngine } from './components/LiveTradingEngine';
import { LiveMarket } from './components/LiveMarket';
import { WalletPage } from './components/WalletPage';
import { OfficialLoanNotice } from './components/OfficialLoanNotice';
import { LoanSystem } from './components/LoanSystem';
import { BonusRewardCenter } from './components/BonusRewardCenter';
import { CustomerSupport } from './components/CustomerSupport';
import { SecurityAuth } from './components/SecurityAuth';
import { ReferralSystem } from './components/ReferralSystem';
import { SettingsPage } from './components/SettingsPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [loginEmail, setLoginEmail] = useState<string>('alex.m@usdtpro.com');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  // Register Fields
  const [regName, setRegName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regReferral, setRegReferral] = useState<string>('');

  // Core App State
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [tickers, setTickers] = useState(initialCryptoTickers);
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [loan, setLoan] = useState<LoanData>(initialLoanNoticeData);

  // KYC Requests State
  const [kycRequests, setKycRequests] = useState<KycRequestData[]>([
    {
      id: 'KYC-882901',
      userId: 'USR-8829401',
      userName: 'Alex Morgan',
      userEmail: 'alex.m@usdtpro.com',
      docType: 'nid',
      docNumber: '59201928401',
      fullName: 'Alex Morgan',
      frontDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      backDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      selfieDocUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      submittedAt: '10:30 AM, Today',
      status: 'pending'
    }
  ]);

  // Active Running Investment
  const [activeInvestment, setActiveInvestment] = useState<ActiveInvestment | null>(null);

  // Users List State
  const [usersList, setUsersList] = useState<ManagedUser[]>(initialUsersList);

  // Handlers for KYC Approval/Rejection
  const handleKycSubmit = (newReq: KycRequestData) => {
    setKycRequests(prev => [newReq, ...prev]);
    setUser(prev => ({ ...prev, kycStatus: 'pending' }));
    handleAddNotification(
      '📄 KYC Level 4 Submitted',
      'Your verification documents have been submitted and are pending Admin review.',
      'system'
    );
  };

  const handleApproveKyc = (reqId: string) => {
    setKycRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'verified' } : r));
    setUser(prev => ({ ...prev, kycStatus: 'verified' }));
    handleAddNotification(
      '🎉 KYC Approved!',
      'Admin has APPROVED your VIP Level 4 KYC verification. $100,000 USD daily withdrawal limit active!',
      'system'
    );
  };

  const handleRejectKyc = (reqId: string) => {
    setKycRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
    setUser(prev => ({ ...prev, kycStatus: 'rejected' }));
    handleAddNotification(
      '❌ KYC Application Rejected',
      'Admin has rejected your KYC application. Please re-check document photos and re-submit in Profile.',
      'system'
    );
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const input = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    // Check against mock database users
    const matchedUser = usersList.find(
      u => u.username.toLowerCase() === input || u.email.toLowerCase() === input
    );

    if (matchedUser) {
      // Password validation for admin & sub_admin
      if (matchedUser.role === 'admin' || matchedUser.username === 'emukhan580') {
        if (password !== 'Imran2015@!@!') {
          alert('❌ Incorrect Admin Password! Required Super Admin password: Imran2015@!@!');
          return;
        }
      }

      setUserRole(matchedUser.role);
      setUser(prev => ({
        ...prev,
        id: matchedUser.id,
        username: matchedUser.username,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        phone: matchedUser.phone,
        vipLevel: matchedUser.vipLevel,
        referralCode: matchedUser.referralCode,
        avatar: matchedUser.avatar
      }));
      setWallet(prev => ({
        ...prev,
        usdtBalance: matchedUser.usdtBalance,
        usdBalance: matchedUser.usdtBalance,
        totalDeposit: matchedUser.totalDeposit ?? prev.totalDeposit ?? 0,
        totalWithdraw: matchedUser.totalWithdraw ?? prev.totalWithdraw ?? 0,
        totalProfit: prev.totalProfit ?? 0,
        activeInvestmentAmount: prev.activeInvestmentAmount ?? 0
      }));

      setIsLoggedIn(true);

      if (matchedUser.role === 'admin') {
        setActiveTab('admin');
        setNotifications([
          {
            id: `NT-${Date.now()}`,
            title: '⚡ Super Admin Authenticated',
            message: 'Welcome to the Super Admin Control Panel, emukhan580.',
            type: 'announcement',
            timestamp: 'Just now',
            isRead: false
          }
        ]);
      } else if (matchedUser.role === 'sub_admin') {
        setActiveTab('admin');
        setNotifications([
          {
            id: `NT-${Date.now()}`,
            title: '🛡️ Sub-Admin Authenticated',
            message: 'Welcome to the Sub-Admin Read-Only Monitoring Suite.',
            type: 'announcement',
            timestamp: 'Just now',
            isRead: false
          }
        ]);
      } else {
        setActiveTab('home');
        setNotifications([
          {
            id: `NT-${Date.now()}`,
            title: '🔐 Login Successful',
            message: `Welcome back to USDT REWARD PRO VIP account, ${matchedUser.fullName}.`,
            type: 'system',
            timestamp: 'Just now',
            isRead: false
          }
        ]);
      }
    } else {
      // Dynamic login for new or custom credentials
      const fallbackName = loginEmail.includes('@') ? loginEmail.split('@')[0] : loginEmail;
      const customUser: UserProfile = {
        id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
        username: loginEmail.toLowerCase(),
        fullName: fallbackName.toUpperCase(),
        email: loginEmail.includes('@') ? loginEmail : `${loginEmail}@usdtpro.com`,
        phone: '+1 (555) 019-2831',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginEmail}`,
        vipLevel: 1,
        kycStatus: 'unverified',
        is2FAEnabled: false,
        role: 'user',
        joinedDate: new Date().toISOString().split('T')[0],
        referralCode: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        accountStatus: 'active',
        usdtBalance: 0.00
      };

      setUser(customUser);
      setWallet({
        usdtBalance: 0.00,
        usdBalance: 0.00,
        btcBalance: 0.00,
        ethBalance: 0.00,
        totalDeposit: 0.00,
        totalWithdraw: 0.00,
        totalProfit: 0.00,
        activeInvestmentAmount: 0.00,
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
      });
      setUserRole('user');
      setIsLoggedIn(true);
      setActiveTab('home');
      setNotifications([
        {
          id: `NT-${Date.now()}`,
          title: '🔐 Login Successful',
          message: `Welcome to USDT REWARD PRO VIP account, ${customUser.fullName}.`,
          type: 'system',
          timestamp: 'Just now',
          isRead: false
        }
      ]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      alert('Passwords do not match. Please check and try again.');
      return;
    }

    const newUserId = `USR-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const formattedName = regName.trim() || 'VIP Trader';
    const generatedUsername = regUsername.trim().toLowerCase() || regName.trim().toLowerCase().replace(/\s+/g, '_') || `user_${Math.floor(1000 + Math.random() * 9000)}`;
    const emailAddr = regEmail.trim() || `${generatedUsername}@example.com`;
    const phoneNumber = regPhone.trim() || '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000);
    const refCode = regReferral.trim() || `REF-${Math.floor(100000 + Math.random() * 900000)}`;

    const newManagedUser: ManagedUser = {
      id: newUserId,
      username: generatedUsername,
      fullName: formattedName,
      email: emailAddr,
      phone: phoneNumber,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedUsername}`,
      vipLevel: 1,
      kycStatus: 'unverified',
      accountStatus: 'active',
      role: 'user',
      usdtBalance: 0.00,
      totalDeposit: 0.00,
      totalWithdraw: 0.00,
      joinedDate: new Date().toISOString().split('T')[0],
      referralCode: refCode,
      tradesCount: 0
    };

    // Save to users list for admin inspection
    setUsersList(prev => [newManagedUser, ...prev]);

    // Active User Profile state
    const newProfile: UserProfile = {
      id: newManagedUser.id,
      username: newManagedUser.username,
      fullName: newManagedUser.fullName,
      email: newManagedUser.email,
      phone: newManagedUser.phone,
      avatar: newManagedUser.avatar,
      vipLevel: 1,
      kycStatus: 'unverified',
      is2FAEnabled: false,
      role: 'user',
      joinedDate: newManagedUser.joinedDate,
      referralCode: newManagedUser.referralCode,
      accountStatus: 'active',
      usdtBalance: 0.00
    };

    setUser(newProfile);
    setWallet({
      usdtBalance: 0.00,
      usdBalance: 0.00,
      btcBalance: 0.00,
      ethBalance: 0.00,
      totalDeposit: 0.00,
      totalWithdraw: 0.00,
      totalProfit: 0.00,
      activeInvestmentAmount: 0.00,
      walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    });

    setUserRole('user');
    setIsLoggedIn(true);
    setActiveTab('home');

    // Reset register input fields
    setRegName('');
    setRegUsername('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegConfirmPassword('');
    setRegReferral('');

    setNotifications([
      {
        id: `NT-${Date.now()}`,
        title: '🎉 Account Created Successfully',
        message: `Welcome ${formattedName}! Your VIP Reward Wallet account is ready.`,
        type: 'system',
        timestamp: 'Just now',
        isRead: false
      }
    ]);
  };

  // Fetch Live Binance Tickers periodically
  useEffect(() => {
    let isMounted = true;
    const loadTickers = async () => {
      const updated = await fetchLiveBinanceTickers();
      if (isMounted && updated) {
        setTickers(updated);
      }
    };

    loadTickers();
    const interval = setInterval(loadTickers, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Active Investment Countdown Timer (1 second interval)
  useEffect(() => {
    if (!activeInvestment || activeInvestment.status !== 'running') return;

    if (activeInvestment.secondsRemaining > 0) {
      const timer = setTimeout(() => {
        setActiveInvestment(prev => prev ? { ...prev, secondsRemaining: prev.secondsRemaining - 1 } : null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeInvestment]);

  // Handler: Add Notification
  const handleAddNotification = (title: string, message: string, type: 'trading' | 'deposit' | 'withdrawal' | 'system' | 'announcement' = 'system') => {
    const newNotif: NotificationItem = {
      id: `NT-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handler: Start Investment
  const handleStartInvestment = (plan: InvestmentPlan, amount: number) => {
    const profit = (amount * plan.profitPercentage) / 100;
    const expectedReturn = amount + profit;

    const newInv: ActiveInvestment = {
      id: `INV-${Date.now()}`,
      planId: plan.id,
      planTitle: plan.title,
      amount,
      profitPercentage: plan.profitPercentage,
      expectedReturn,
      durationSeconds: plan.durationSeconds,
      secondsRemaining: plan.durationSeconds,
      startTime: Date.now(),
      status: 'running'
    };

    // Deduct amount from wallet balance instantly
    setWallet(prev => ({
      ...prev,
      usdtBalance: Math.max(0, prev.usdtBalance - amount),
      usdBalance: Math.max(0, prev.usdBalance - amount),
      activeInvestmentAmount: prev.activeInvestmentAmount + amount
    }));

    setActiveInvestment(newInv);

    // Log transaction
    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'investment',
      amount,
      asset: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `${plan.title} (${plan.durationSeconds}s)`
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '🚀 Investment Activated',
      `Your investment of $${amount.toFixed(2)} USDT (${plan.title}) is now active with a ${plan.durationSeconds}s countdown.`,
      'trading'
    );
  };

  // Handler: Investment Completed
  const handleInvestmentCompleted = (result: { amount: number; profit: number; total: number; planTitle: string }) => {
    // Add total returned amount back to wallet
    setWallet(prev => ({
      ...prev,
      usdtBalance: prev.usdtBalance + result.total,
      usdBalance: prev.usdBalance + result.total,
      totalProfit: prev.totalProfit + result.profit,
      activeInvestmentAmount: Math.max(0, prev.activeInvestmentAmount - result.amount)
    }));

    setActiveInvestment(prev => prev ? { ...prev, status: 'completed' } : null);

    // Log transaction
    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'profit',
      amount: result.profit,
      asset: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Profit from ${result.planTitle}`
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '✅ Investment Yield Completed',
      `+$${result.profit.toFixed(2)} USDT profit credited! Total received: $${result.total.toFixed(2)} USDT.`,
      'trading'
    );
  };

  // Handler: Trade Completed from Live Trading Engine
  const handleTradeCompleted = (record: TradeRecord, newWalletBalance: number) => {
    setWallet(prev => ({
      ...prev,
      usdtBalance: newWalletBalance,
      usdBalance: newWalletBalance,
      totalProfit: record.status === 'WIN' ? prev.totalProfit + record.profitAmount : prev.totalProfit
    }));

    const newTx: TransactionItem = {
      id: record.id,
      type: 'profit',
      amount: record.profitAmount,
      asset: `${record.asset} (${record.direction})`,
      status: 'completed',
      date: record.timestamp,
      note: `Trade ${record.status}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Handler: Deposit Request (Pending Admin Approval)
  const handleDepositSubmit = (amount: number, asset: string) => {
    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'deposit',
      amount,
      asset,
      status: 'pending',
      txHash: `0x${Math.random().toString(16).substring(2, 14)}...`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: 'Deposit Request (Pending Admin Approval)'
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '⏳ Deposit Submitted (Pending Admin)',
      `Your deposit request of $${amount.toFixed(2)} ${asset} has been submitted. It will be credited once approved by Admin.`,
      'deposit'
    );
  };

  // Handler: Withdraw Request (Pending Admin Approval)
  const handleWithdrawSubmit = (amount: number, asset: string, address: string) => {
    // Hold funds while pending
    setWallet(prev => ({
      ...prev,
      usdtBalance: Math.max(0, prev.usdtBalance - amount),
      usdBalance: Math.max(0, prev.usdBalance - amount)
    }));

    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'withdraw',
      amount,
      asset,
      status: 'pending',
      txHash: `0x${Math.random().toString(16).substring(2, 14)}...`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Withdrawal to ${address.substring(0, 8)}... (Pending Admin)`
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '⏳ Withdrawal Submitted (Pending Admin)',
      `Your withdrawal request of $${amount.toFixed(2)} ${asset} has been submitted for Admin approval.`,
      'withdrawal'
    );
  };

  // Handler: Admin Approve Transaction
  const handleApproveTransaction = (txId: string) => {
    const target = transactions.find(t => t.id === txId);
    if (!target) return;

    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'completed' } : t));

    if (target.type === 'deposit') {
      setWallet(prev => ({
        ...prev,
        usdtBalance: prev.usdtBalance + target.amount,
        usdBalance: prev.usdBalance + target.amount,
        totalDeposit: prev.totalDeposit + target.amount
      }));
      handleAddNotification(
        '💰 Deposit Approved!',
        `Admin has APPROVED your deposit of $${target.amount.toFixed(2)} USDT! Balance credited.`,
        'deposit'
      );
    } else if (target.type === 'withdraw') {
      setWallet(prev => ({
        ...prev,
        totalWithdraw: prev.totalWithdraw + target.amount
      }));
      handleAddNotification(
        '✅ Withdrawal Approved!',
        `Admin has APPROVED your withdrawal of $${target.amount.toFixed(2)} USDT! Funds dispatched.`,
        'withdrawal'
      );
    }
  };

  // Handler: Admin Reject Transaction
  const handleRejectTransaction = (txId: string) => {
    const target = transactions.find(t => t.id === txId);
    if (!target) return;

    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'failed' } : t));

    if (target.type === 'deposit') {
      handleAddNotification(
        '❌ Deposit Request Rejected',
        `Admin rejected your deposit request of $${target.amount.toFixed(2)} USDT.`,
        'deposit'
      );
    } else if (target.type === 'withdraw') {
      // Refund held balance
      setWallet(prev => ({
        ...prev,
        usdtBalance: prev.usdtBalance + target.amount,
        usdBalance: prev.usdBalance + target.amount
      }));
      handleAddNotification(
        '❌ Withdrawal Request Rejected',
        `Admin rejected withdrawal request of $${target.amount.toFixed(2)} USDT. Funds refunded to wallet.`,
        'withdrawal'
      );
    }
  };

  // Handlers for User Management System
  const handleUpdateUserBalance = (userId: string, newBalance: number) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, usdtBalance: newBalance } : u));
    
    // If target user is main profile (USR-8829401), keep active wallet state in sync
    if (userId === 'USR-8829401' || userId === user.id) {
      setWallet(prev => ({ ...prev, usdtBalance: newBalance, usdBalance: newBalance }));
      handleAddNotification(
        '💵 Balance Adjusted by Admin',
        `Admin updated your USDT wallet balance to $${newBalance.toFixed(2)} USDT.`,
        'system'
      );
    }
  };

  const handleChangeUserStatus = (userId: string, status: 'active' | 'suspended' | 'banned') => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: status } : u));
    
    const target = usersList.find(u => u.id === userId);
    if (target) {
      handleAddNotification(
        `🛡️ Account Status Updated`,
        `User ${target.fullName} (${userId}) account status set to ${status.toUpperCase()}.`,
        'system'
      );
    }
  };

  const handleChangeUserVip = (userId: string, vipLevel: number) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, vipLevel } : u));
    
    if (userId === 'USR-8829401' || userId === user.id) {
      setUser(prev => ({ ...prev, vipLevel }));
      handleAddNotification(
        '👑 VIP Tier Upgraded',
        `Congratulations! Admin upgraded your account to VIP ${vipLevel}.`,
        'announcement'
      );
    }
  };

  const handleChangeUserRole = (userId: string, role: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    
    if (userId === 'USR-8829401' || userId === user.id) {
      setUser(prev => ({ ...prev, role }));
      setUserRole(role);
      handleAddNotification(
        '🛡️ Account Permission Changed',
        `Your user role was updated to ${role.toUpperCase()}.`,
        'system'
      );
    }
  };

  const handleAddNewUser = (newUser: ManagedUser) => {
    setUsersList(prev => [newUser, ...prev]);
    handleAddNotification(
      '👤 New Member Created',
      `Account created for ${newUser.fullName} (${newUser.email}) with $${newUser.usdtBalance.toFixed(2)} USDT balance.`,
      'system'
    );
  };

  // Handler: Claim Daily Reward
  const handleClaimDailyReward = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      usdtBalance: prev.usdtBalance + amount,
      usdBalance: prev.usdBalance + amount
    }));

    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'bonus',
      amount,
      asset: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: 'Daily Login Reward'
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '🎁 Daily Reward Claimed',
      `You earned $${amount.toFixed(2)} USDT for today's login!`,
      'announcement'
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col justify-between selection:bg-[#F4C542]/30 selection:text-[#F4C542] pb-20 sm:pb-8">
      
      {/* Navigation Header */}
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        notifications={notifications}
        onMarkNotificationsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }}
        userRole={userRole}
        onRoleChange={setUserRole}
        onNavigate={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Sidebar Drawer Modal */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        userRole={userRole}
        user={user}
        unreadNotifications={notifications.filter(n => !n.isRead).length}
        onLogout={handleLogout}
      />

      {/* Logged Out Login / Register Modal Overlay */}
      {!isLoggedIn && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="glass-gold-card p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative border-[#F4C542]/40">
            
            {/* Header Brand */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#B8860B] via-[#F4C542] to-[#FFD700] p-0.5 shadow-[0_0_20px_rgba(244,197,66,0.3)] flex items-center justify-center">
                <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center">
                  <span className="text-[#F4C542] font-black text-2xl">₮</span>
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-100">USDT REWARD PRO</h2>
              <p className="text-xs text-slate-400">
                {authMode === 'signin' ? 'Sign in to access your VIP wallet & trading engine' : 'Create a new account to unlock yield rewards & bonuses'}
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex rounded-xl bg-[#080D18] p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'btn-gold-gradient text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'btn-gold-gradient text-black shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* SIGN IN FORM */}
            {authMode === 'signin' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Email Address</label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. emukhan580 or alex.m@usdtpro.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#F4C542]/20 hover:scale-[1.01] transition-transform"
                >
                  Sign In to VIP Wallet
                </button>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. johndoe99"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Referral Code (Optional)</label>
                  <input
                    type="text"
                    value={regReferral}
                    onChange={(e) => setRegReferral(e.target.value)}
                    placeholder="e.g. VIP888"
                    className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#F4C542]/20 hover:scale-[1.01] transition-transform"
                >
                  Sign Up & Create Account
                </button>
              </form>
            )}

            {/* Toggle Switch Footer */}
            <div className="text-center pt-2 border-t border-slate-800">
              {authMode === 'signin' ? (
                <p className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-[#F4C542] font-bold hover:underline ml-1"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-[#F4C542] font-bold hover:underline ml-1"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* HOME DASHBOARD VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick Shortcuts */}
            <QuickActions
              onNavigate={setActiveTab}
              onOpenDepositModal={() => setActiveTab('wallet')}
              onOpenWithdrawModal={() => setActiveTab('wallet')}
            />

            {/* User Profile Card */}
            <ProfileCard user={user} onNavigate={setActiveTab} />

            {/* Balance Card */}
            <BalanceCard
              wallet={wallet}
              onDeposit={() => setActiveTab('wallet')}
              onWithdraw={() => setActiveTab('wallet')}
              onRefresh={() => {
                // Refresh ticker prices
                fetchLiveBinanceTickers().then(data => {
                  if (data) setTickers(data);
                });
              }}
            />

            {/* Quick Stats & Daily Reward */}
            <QuickStats
              wallet={wallet}
              onClaimDailyReward={handleClaimDailyReward}
            />

            {/* High Yield Investment Packages */}
            <InvestmentPackages
              plans={investmentPlans}
              wallet={wallet}
              activeInvestment={activeInvestment}
              onStartInvestment={handleStartInvestment}
              onInvestmentCompleted={handleInvestmentCompleted}
            />

            {/* Live Ticker Feed */}
            <LiveMarket
              tickers={tickers}
              onSelectTicker={(symbol) => {
                setActiveTab('trading');
              }}
            />
          </div>
        )}

        {/* LIVE TRADING PAGE */}
        {activeTab === 'trading' && (
          <div className="animate-in fade-in duration-300">
            <LiveTradingEngine
              tickers={tickers}
              wallet={wallet}
              userId={user.id}
              onTradeCompleted={handleTradeCompleted}
              onAddNotification={handleAddNotification}
            />
          </div>
        )}

        {/* INVESTMENT PACKAGES PAGE */}
        {activeTab === 'invest' && (
          <div className="animate-in fade-in duration-300">
            <InvestmentPackages
              plans={investmentPlans}
              wallet={wallet}
              activeInvestment={activeInvestment}
              onStartInvestment={handleStartInvestment}
              onInvestmentCompleted={handleInvestmentCompleted}
            />
          </div>
        )}

        {/* WALLET PAGE */}
        {activeTab === 'wallet' && (
          <div className="animate-in fade-in duration-300">
            <WalletPage
              wallet={wallet}
              transactions={transactions}
              onDepositSubmit={handleDepositSubmit}
              onWithdrawSubmit={handleWithdrawSubmit}
            />
          </div>
        )}

        {/* PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-300">
            <SecurityAuth user={user} onLogout={handleLogout} onKycSubmit={handleKycSubmit} />
          </div>
        )}

        {/* BONUS REWARD CENTER */}
        {activeTab === 'bonus' && (
          <div className="animate-in fade-in duration-300">
            <BonusRewardCenter
              onClaimWelcomeBonus={(amt) => {
                handleDepositSubmit(amt, 'USDT (Welcome Bonus)');
              }}
            />
          </div>
        )}

        {/* LOAN SYSTEM */}
        {activeTab === 'loan' && (
          <div className="animate-in fade-in duration-300">
            <LoanSystem
              activeLoan={loan}
              onNavigate={setActiveTab}
              onRequestLoanSubmit={(amt, term) => {
                handleAddNotification(
                  '📄 Loan Application Submitted',
                  `Requested $${amt.toFixed(2)} USD loan for ${term} days under review.`,
                  'system'
                );
              }}
            />
          </div>
        )}

        {/* OFFICIAL LOAN REPAYMENT OVERDUE NOTICE */}
        {activeTab === 'loan-notice' && (
          <div className="animate-in fade-in duration-300">
            <OfficialLoanNotice loan={loan} />
          </div>
        )}

        {/* CUSTOMER SUPPORT */}
        {activeTab === 'support' && (
          <div className="animate-in fade-in duration-300">
            <CustomerSupport />
          </div>
        )}

        {/* SECURITY & 2FA */}
        {activeTab === 'security' && (
          <div className="animate-in fade-in duration-300">
            <SecurityAuth user={user} onLogout={handleLogout} onKycSubmit={handleKycSubmit} />
          </div>
        )}

        {/* REFERRAL PROGRAM */}
        {activeTab === 'referral' && (
          <div className="animate-in fade-in duration-300">
            <ReferralSystem referralCode={user.referralCode} />
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300">
            <SettingsPage />
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-300">
            <AdminDashboard
              currentRole={userRole}
              wallet={wallet}
              loan={loan}
              kycRequests={kycRequests}
              transactions={transactions}
              usersList={usersList}
              onUpdateWalletBalance={(newBal) => {
                setWallet(prev => ({
                  ...prev,
                  usdtBalance: newBal,
                  usdBalance: newBal
                }));
              }}
              onSendGlobalBroadcast={(title, msg) => {
                handleAddNotification(title, msg, 'announcement');
              }}
              onApproveKyc={handleApproveKyc}
              onRejectKyc={handleRejectKyc}
              onApproveTransaction={handleApproveTransaction}
              onRejectTransaction={handleRejectTransaction}
              onUpdateUserBalance={handleUpdateUserBalance}
              onChangeUserStatus={handleChangeUserStatus}
              onChangeUserVip={handleChangeUserVip}
              onChangeUserRole={handleChangeUserRole}
              onAddNewUser={handleAddNewUser}
            />
          </div>
        )}

      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 bg-[#050505] text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#F4C542] text-black font-extrabold flex items-center justify-center text-xs">
              ₮
            </div>
            <span className="font-extrabold text-slate-300">USDT REWARD PRO</span>
            <span className="text-[10px] text-slate-500">• Ultra High-Yield Exchange Platform</span>
          </div>
          <div>© 2026 USDT Reward Pro. Accounting & Trading Division. All Rights Reserved.</div>
        </div>
      </footer>

    </div>
  );
}
