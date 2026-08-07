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
  LoanData 
} from './types';
import { 
  initialUserProfile, 
  initialWalletState, 
  investmentPlans, 
  initialCryptoTickers, 
  initialTransactions, 
  initialNotifications, 
  initialLoanNoticeData 
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

  // Core App State
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [tickers, setTickers] = useState(initialCryptoTickers);
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [loan, setLoan] = useState<LoanData>(initialLoanNoticeData);

  // Active Running Investment
  const [activeInvestment, setActiveInvestment] = useState<ActiveInvestment | null>(null);

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

  // Handler: Deposit
  const handleDepositSubmit = (amount: number, asset: string) => {
    setWallet(prev => ({
      ...prev,
      usdtBalance: prev.usdtBalance + amount,
      usdBalance: prev.usdBalance + amount,
      totalDeposit: prev.totalDeposit + amount
    }));

    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'deposit',
      amount,
      asset,
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substring(2, 14)}...`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: 'Instant Deposit'
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '💰 Deposit Received',
      `Your deposit of $${amount.toFixed(2)} ${asset} was successfully credited.`,
      'deposit'
    );
  };

  // Handler: Withdraw
  const handleWithdrawSubmit = (amount: number, asset: string, address: string) => {
    setWallet(prev => ({
      ...prev,
      usdtBalance: Math.max(0, prev.usdtBalance - amount),
      usdBalance: Math.max(0, prev.usdBalance - amount),
      totalWithdraw: prev.totalWithdraw + amount
    }));

    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'withdraw',
      amount,
      asset,
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substring(2, 14)}...`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Withdrawal to ${address.substring(0, 8)}...`
    };
    setTransactions(prev => [newTx, ...prev]);

    handleAddNotification(
      '📤 Withdrawal Dispatched',
      `Withdrawal of $${amount.toFixed(2)} ${asset} submitted to network.`,
      'withdrawal'
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
      />

      {/* Sidebar Drawer Modal */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        userRole={userRole}
        unreadNotifications={notifications.filter(n => !n.isRead).length}
      />

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
            <SecurityAuth user={user} />
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
            <SecurityAuth user={user} />
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
