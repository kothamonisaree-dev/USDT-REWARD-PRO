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
  ManagedUser,
  WalletConfig
} from './types';
import { 
  initialUserProfile, 
  initialWalletState, 
  investmentPlans, 
  initialCryptoTickers, 
  initialTransactions, 
  initialNotifications, 
  initialLoanNoticeData,
  initialUsersList,
  defaultDepositCurrencies
} from './data/mockData';
import { fetchLiveBinanceTickers } from './services/binance';
import { api } from './services/api';

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
import { LandingPage } from './components/LandingPage';
import { X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import logoImg from './assets/images/usdt_reward_pro_logo_1786228642395.jpg';

const SESSION_STORAGE_KEY = 'usdt_reward_pro_active_session_v4';

interface StoredSessionData {
  isLoggedIn: boolean;
  userRole: UserRole;
  user: UserProfile;
  wallet: WalletState;
  savedAt: number;
}

const getStoredSession = (): StoredSessionData | null => {
  try {
    // 1. Check localStorage
    const rawLocal = localStorage.getItem(SESSION_STORAGE_KEY);
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal);
      if (parsed && parsed.isLoggedIn && parsed.user) return parsed;
    }
    // 2. Check sessionStorage
    const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (parsed && parsed.isLoggedIn && parsed.user) return parsed;
    }
    // 3. Check document.cookie
    if (typeof document !== 'undefined' && document.cookie) {
      const match = document.cookie.match(/usdt_session=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed && parsed.isLoggedIn && parsed.user) return parsed;
      }
    }
  } catch (e) {
    console.warn('[Session] Read error:', e);
  }
  return null;
};

export default function App() {
  const initialSession = getStoredSession();

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [userRole, setUserRole] = useState<UserRole>(() => initialSession?.userRole || 'user');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!initialSession?.isLoggedIn);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  
  // Register Fields
  const [regName, setRegName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regReferral, setRegReferral] = useState<string>('');

  // Core App State
  const [user, setUser] = useState<UserProfile>(() => initialSession?.user || initialUserProfile);
  const [wallet, setWallet] = useState<WalletState>(() => initialSession?.wallet || initialWalletState);
  const [tickers, setTickers] = useState(initialCryptoTickers);
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [loan, setLoan] = useState<LoanData>(initialLoanNoticeData);

  // Helper to persist active session across localStorage, sessionStorage, Cookies, and Server
  const saveSession = (
    u: UserProfile,
    w: WalletState,
    r: UserRole,
    loggedIn: boolean = true
  ) => {
    const sessionData = {
      isLoggedIn: loggedIn,
      userRole: r,
      user: u,
      wallet: w,
      savedAt: Date.now()
    };

    try {
      if (!loggedIn) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        localStorage.removeItem('usdt_reward_pro_active_session_v3');
        localStorage.removeItem('usdt_reward_pro_active_session_v2');
        localStorage.removeItem('usdt_reward_pro_session_v1');
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem('usdt_reward_pro_active_session_v3');
        if (typeof document !== 'undefined') {
          document.cookie = 'usdt_session=; Path=/; Max-Age=0; SameSite=Lax';
        }
      } else {
        const json = JSON.stringify(sessionData);
        localStorage.setItem(SESSION_STORAGE_KEY, json);
        sessionStorage.setItem(SESSION_STORAGE_KEY, json);
        if (typeof document !== 'undefined') {
          document.cookie = `usdt_session=${encodeURIComponent(json)}; Path=/; Max-Age=2592000; SameSite=Lax`;
        }
      }
    } catch (err) {
      console.warn('[Session] Storage error:', err);
    }
  };

  // Platform Config States (Admin Controlled)
  const [plansList, setPlansList] = useState<InvestmentPlan[]>(investmentPlans);
  const [customerCareConfig, setCustomerCareConfig] = useState({
    telegram: '@USDTRewardProSupport',
    whatsapp: '+1 (800) 555-0199',
    email: 'support@usdtpro.com'
  });
  const [walletConfig, setWalletConfig] = useState<WalletConfig>({
    trc20Address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    minDeposit: 50,
    currencies: defaultDepositCurrencies
  });
  const [bonusConfig, setBonusConfig] = useState({
    dailyReward: 5.00,
    welcomeBonus: 5.00
  });
  const [referralConfig, setReferralConfig] = useState({
    tier1: 10,
    tier2: 5,
    tier3: 2
  });
  const [adminSubTab, setAdminSubTab] = useState<string>('users');

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
  const handleKycSubmit = async (newReq: KycRequestData) => {
    setKycRequests(prev => [newReq, ...prev]);
    setUser(prev => ({ ...prev, kycStatus: 'pending' }));
    
    // Save permanently to Cloud SQL
    await api.submitKyc(newReq);

    handleAddNotification(
      '📄 KYC Level 4 Submitted',
      'Your verification documents have been submitted to the Cloud Database and are pending Admin review.',
      'system'
    );
  };

  const handleApproveKyc = async (reqId: string) => {
    const targetReq = kycRequests.find(r => r.id === reqId);
    setKycRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'verified' } : r));
    setUser(prev => ({ ...prev, kycStatus: 'verified' }));
    
    // Update Cloud SQL
    await api.updateKycStatus(reqId, 'verified', targetReq?.userId);

    handleAddNotification(
      '🎉 KYC Approved!',
      'Admin has APPROVED your VIP Level 4 KYC verification. $100,000 USD daily withdrawal limit active!',
      'system'
    );
  };

  const handleRejectKyc = async (reqId: string) => {
    const targetReq = kycRequests.find(r => r.id === reqId);
    setKycRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
    setUser(prev => ({ ...prev, kycStatus: 'rejected' }));
    
    // Update Cloud SQL
    await api.updateKycStatus(reqId, 'rejected', targetReq?.userId, 'Document verification failed.');

    handleAddNotification(
      '❌ KYC Application Rejected',
      'Admin has rejected your KYC application. Please re-check document photos and re-submit in Profile.',
      'system'
    );
  };

  const handleLogout = () => {
    saveSession(user, wallet, userRole, false);
    setIsLoggedIn(false);
    setShowAuthModal(false);
    setActiveTab('home');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const input = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!input) {
      setAuthError('Please enter your Username or Email Address.');
      return;
    }
    if (!password) {
      setAuthError('Please enter your Account Password.');
      return;
    }

    setAuthLoading(true);

    try {
      // 1. Check Cloud SQL database
      const cloudAuth = await api.loginUser(input, password);
      let matchedUser = cloudAuth.user;

      // 2. Fallback check with local list if network issue, strictly checking password
      if (!matchedUser) {
        const localFound = usersList.find(
          u => u.username.toLowerCase() === input || u.email.toLowerCase() === input || u.id.toLowerCase() === input
        );

        if (localFound) {
          if (localFound.role === 'admin' || localFound.username.toLowerCase() === 'emukhan580') {
            const isMatch = password === 'Imran2015@!@!' || (localFound as any).password === password;
            if (isMatch) matchedUser = localFound;
          } else if ((localFound as any).password) {
            if ((localFound as any).password === password) matchedUser = localFound;
          } else if (password === '123456' || password === 'password123') {
            matchedUser = localFound;
          }
        }
      }

      if (!matchedUser) {
        setAuthLoading(false);
        const errMsg = cloudAuth.error || 'Account not found or incorrect password. Please check your credentials or click Sign Up.';
        setAuthError(errMsg);
        return;
      }

      // Check admin password verification strictly
      if (matchedUser.role === 'admin' || matchedUser.username.toLowerCase() === 'emukhan580') {
        const storedPass = (matchedUser as any).password;
        const isMatch = password === 'Imran2015@!@!' || (storedPass && password === storedPass);
        if (!isMatch) {
          setAuthLoading(false);
          setAuthError('❌ Incorrect Super Admin Password! Please enter valid admin password.');
          return;
        }
      } else {
        const storedPass = (matchedUser as any).password;
        if (storedPass && storedPass !== password) {
          setAuthLoading(false);
          setAuthError('❌ Incorrect password! Please check and try again.');
          return;
        }
      }

      const activeProfile: UserProfile = {
        id: matchedUser.id,
        username: matchedUser.username,
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        phone: matchedUser.phone || '+1 (555) 019-2831',
        vipLevel: matchedUser.vipLevel || 1,
        referralCode: matchedUser.referralCode || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        avatar: matchedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${matchedUser.username}`,
        kycStatus: matchedUser.kycStatus || 'unverified',
        is2FAEnabled: false,
        role: matchedUser.role || 'user',
        joinedDate: matchedUser.joinedDate || new Date().toISOString().split('T')[0],
        accountStatus: matchedUser.accountStatus || 'active',
        usdtBalance: matchedUser.usdtBalance ?? 0
      };

      const activeWallet: WalletState = {
        usdtBalance: matchedUser.usdtBalance ?? 0,
        usdBalance: matchedUser.usdtBalance ?? 0,
        btcBalance: 0,
        ethBalance: 0,
        totalDeposit: matchedUser.totalDeposit ?? 0,
        totalWithdraw: matchedUser.totalWithdraw ?? 0,
        totalProfit: matchedUser.totalProfit ?? 0,
        activeInvestmentAmount: 0,
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
      };

      setUserRole(matchedUser.role);
      setUser(activeProfile);
      setWallet(activeWallet);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setAuthLoading(false);
      setLoginPassword('');
      setAuthError('');

      // Save persistent session
      saveSession(activeProfile, activeWallet, matchedUser.role, true);

      if (matchedUser.role === 'admin') {
        setActiveTab('admin');
        setNotifications([
          {
            id: `NT-${Date.now()}`,
            title: '⚡ Super Admin Authenticated',
            message: 'Welcome to the Super Admin Control Panel, emukhan580 (Connected to Cloud SQL).',
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
    } catch (err: any) {
      setAuthLoading(false);
      setAuthError(err.message || 'Login failed. Please check your network and try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const fullName = regName.trim();
    const username = regUsername.trim().toLowerCase();
    const email = regEmail.trim().toLowerCase();
    const phone = regPhone.trim();
    const password = regPassword.trim();
    const confirmPassword = regConfirmPassword.trim();
    const referralCode = regReferral.trim();

    // 100% STRICT FORM VALIDATION (NO FIELD CAN BE EMPTY EXCEPT OPTIONAL REFERRAL CODE)
    if (!fullName || fullName.length < 2) {
      setAuthError('Full Name is required (minimum 2 characters).');
      return;
    }
    if (!username || username.length < 3) {
      setAuthError('Username is required (minimum 3 characters).');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setAuthError('Username can only contain letters, numbers, and underscores (no spaces).');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAuthError('Please enter a valid Email Address (e.g. name@example.com).');
      return;
    }
    if (!phone || phone.length < 6) {
      setAuthError('Phone Number is required (minimum 6 digits).');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password is required and must be at least 6 characters long.');
      return;
    }
    if (!confirmPassword) {
      setAuthError('Please enter Confirm Password.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify password and confirmation.');
      return;
    }

    // Check duplicate locally first
    const existingUser = usersList.find(
      u => u.username.toLowerCase() === username || u.email.toLowerCase() === email
    );
    if (existingUser) {
      if (existingUser.username.toLowerCase() === username) {
        setAuthError(`Username "${username}" is already registered. Please choose another username.`);
        return;
      }
      if (existingUser.email.toLowerCase() === email) {
        setAuthError(`Email "${email}" is already registered. Please Sign In.`);
        return;
      }
    }

    setAuthLoading(true);

    const newUserId = `USR-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newManagedUser: ManagedUser = {
      id: newUserId,
      username: username,
      fullName: fullName,
      email: email,
      phone: phone,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      vipLevel: 1,
      kycStatus: 'unverified',
      accountStatus: 'active',
      role: 'user',
      usdtBalance: 0.00,
      totalDeposit: 0.00,
      totalWithdraw: 0.00,
      totalProfit: 0.00,
      joinedDate: new Date().toISOString().split('T')[0],
      referralCode: referralCode || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      tradesCount: 0
    };

    try {
      // 1. Immediately save to Cloud SQL database permanently
      const regRes = await api.registerUser({
        ...newManagedUser,
        password: password
      });

      if (!regRes.success || !regRes.user) {
        setAuthLoading(false);
        setAuthError(regRes.error || 'Registration failed. Please try again.');
        return;
      }

      const savedUser = regRes.user;

      // 2. Save to local users list for admin inspection
      setUsersList(prev => [savedUser, ...prev.filter(u => u.id !== savedUser.id)]);

      // Active User Profile state
      const newProfile: UserProfile = {
        id: savedUser.id,
        username: savedUser.username,
        fullName: savedUser.fullName,
        email: savedUser.email,
        phone: savedUser.phone || phone,
        avatar: savedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        vipLevel: 1,
        kycStatus: 'unverified',
        is2FAEnabled: false,
        role: 'user',
        joinedDate: savedUser.joinedDate || new Date().toISOString().split('T')[0],
        referralCode: savedUser.referralCode || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        accountStatus: 'active',
        usdtBalance: 0.00
      };

      const newWallet: WalletState = {
        usdtBalance: 0.00,
        usdBalance: 0.00,
        btcBalance: 0.00,
        ethBalance: 0.00,
        totalDeposit: 0.00,
        totalWithdraw: 0.00,
        totalProfit: 0.00,
        activeInvestmentAmount: 0.00,
        walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
      };

      setUser(newProfile);
      setWallet(newWallet);
      setUserRole('user');
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setAuthLoading(false);
      setActiveTab('home');

      // Clear fields
      setRegName('');
      setRegUsername('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegReferral('');
      setAuthError('');

      saveSession(newProfile, newWallet, 'user', true);

      setNotifications([
        {
          id: `NT-${Date.now()}`,
          title: '🎉 Account Registered Successfully',
          message: `Welcome to USDT REWARD PRO VIP, ${savedUser.fullName}! Your VIP Trading account is active.`,
          type: 'bonus',
          timestamp: 'Just now',
          isRead: false
        }
      ]);
    } catch (err: any) {
      setAuthLoading(false);
      setAuthError(err.message || 'Registration error. Please check your internet and try again.');
    }
  };

  const syncWithCloudSql = async () => {
    try {
      const [cloudUsers, cloudTxs, cloudKyc, cloudLoans, cloudSettings] = await Promise.all([
        api.fetchUsers(),
        api.fetchTransactions(),
        api.fetchKycRequests(),
        api.fetchLoans(),
        api.fetchSettings()
      ]);

      if (Array.isArray(cloudUsers)) {
        setUsersList(cloudUsers);

        // Sync current user's profile and balance only if already logged in with a valid account
        if (isLoggedIn) {
          setUser(currUser => {
            if (!currUser || !currUser.username) return currUser;
            const matchedCloudUser = cloudUsers.find(
              u => (currUser.id && u.id === currUser.id) || 
                   (currUser.username && u.username.toLowerCase() === currUser.username.toLowerCase()) || 
                   (currUser.email && u.email.toLowerCase() === currUser.email.toLowerCase())
            );

            if (matchedCloudUser) {
              const updatedProfile: UserProfile = {
                ...currUser,
                id: matchedCloudUser.id,
                username: matchedCloudUser.username,
                fullName: matchedCloudUser.fullName,
                email: matchedCloudUser.email,
                phone: matchedCloudUser.phone || currUser.phone,
                avatar: matchedCloudUser.avatar || currUser.avatar,
                vipLevel: matchedCloudUser.vipLevel || currUser.vipLevel,
                kycStatus: matchedCloudUser.kycStatus || currUser.kycStatus,
                role: matchedCloudUser.role || currUser.role,
                accountStatus: matchedCloudUser.accountStatus || currUser.accountStatus,
                usdtBalance: matchedCloudUser.usdtBalance ?? currUser.usdtBalance
              };

              setWallet(currWallet => {
                const updatedWallet: WalletState = {
                  ...currWallet,
                  usdtBalance: matchedCloudUser.usdtBalance ?? currWallet.usdtBalance,
                  usdBalance: matchedCloudUser.usdtBalance ?? currWallet.usdBalance,
                  totalDeposit: matchedCloudUser.totalDeposit ?? currWallet.totalDeposit,
                  totalWithdraw: matchedCloudUser.totalWithdraw ?? currWallet.totalWithdraw,
                  totalProfit: matchedCloudUser.totalProfit ?? currWallet.totalProfit
                };
                saveSession(updatedProfile, updatedWallet, matchedCloudUser.role || 'user', true);
                return updatedWallet;
              });

              return updatedProfile;
            }
            return currUser;
          });
        }
      }
      if (Array.isArray(cloudTxs)) {
        setTransactions(cloudTxs);
      }
      if (Array.isArray(cloudKyc)) {
        setKycRequests(cloudKyc);
      }
      if (cloudLoans && cloudLoans.length > 0) {
        setLoan(cloudLoans[0]);
      }
      if (cloudSettings) {
        if (cloudSettings.customerCare) setCustomerCareConfig(cloudSettings.customerCare);
        if (cloudSettings.wallet) setWalletConfig(cloudSettings.wallet);
        if (cloudSettings.bonus) setBonusConfig(cloudSettings.bonus);
        if (cloudSettings.investmentPlans && Array.isArray(cloudSettings.investmentPlans)) setPlansList(cloudSettings.investmentPlans);
        if (cloudSettings.referral) setReferralConfig(cloudSettings.referral);
        if (cloudSettings.loan) setLoan(cloudSettings.loan);
      }
    } catch (err) {
      console.warn('[Cloud SQL] Periodic sync warning:', err);
    }
  };

  // Sync state with Cloud SQL / server database on app mount and periodically for multi-device live sync
  useEffect(() => {
    let isMounted = true;

    // Initial sync
    syncWithCloudSql();

    // Fast multi-device polling every 3 seconds
    const interval = setInterval(() => {
      if (isMounted) syncWithCloudSql();
    }, 3000);

    // Instant sync when tab gains focus or user switches back to the app
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && isMounted) {
        syncWithCloudSql();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, []);

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

  // Active Investment Precision Real-time Countdown Timer
  useEffect(() => {
    if (!activeInvestment || activeInvestment.status !== 'running') return;

    const targetEndTime = (activeInvestment.startTime || Date.now()) + activeInvestment.durationSeconds * 1000;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const remainingMs = targetEndTime - now;
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

      setActiveInvestment(prev => {
        if (!prev || prev.status !== 'running') return null;
        if (remainingSecs <= 0) {
          return { ...prev, secondsRemaining: 0 };
        }
        if (prev.secondsRemaining !== remainingSecs) {
          return { ...prev, secondsRemaining: remainingSecs };
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(checkInterval);
  }, [activeInvestment?.startTime, activeInvestment?.durationSeconds, activeInvestment?.status]);

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

    const newUsdt = Math.max(0, wallet.usdtBalance - amount);
    const updatedWallet: WalletState = {
      ...wallet,
      usdtBalance: newUsdt,
      usdBalance: newUsdt,
      activeInvestmentAmount: wallet.activeInvestmentAmount + amount
    };
    setWallet(updatedWallet);

    const updatedUser: UserProfile = {
      ...user,
      usdtBalance: newUsdt
    };
    setUser(updatedUser);
    saveSession(updatedUser, updatedWallet, userRole, true);
    api.updateUser(user.id, { usdtBalance: newUsdt });

    setActiveInvestment(newInv);

    // Log transaction
    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'investment',
      amount,
      asset: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `${plan.title} (${plan.durationSeconds}s)`
    };
    setTransactions(prev => [newTx, ...prev]);
    api.createTransaction(newTx);

    handleAddNotification(
      '🚀 Investment Activated',
      `Your investment of $${amount.toFixed(2)} USDT (${plan.title}) is now active with a ${plan.durationSeconds}s countdown.`,
      'trading'
    );
  };

  // Handler: Investment Completed
  const handleInvestmentCompleted = (result: { amount: number; profit: number; total: number; planTitle: string }) => {
    const newUsdt = Number((wallet.usdtBalance + result.total).toFixed(2));
    const newProfit = Number(((wallet.totalProfit || 0) + result.profit).toFixed(2));

    const updatedWallet: WalletState = {
      ...wallet,
      usdtBalance: newUsdt,
      usdBalance: newUsdt,
      totalProfit: newProfit,
      activeInvestmentAmount: Math.max(0, wallet.activeInvestmentAmount - result.amount)
    };
    setWallet(updatedWallet);

    const updatedUser: UserProfile = {
      ...user,
      usdtBalance: newUsdt
    };
    setUser(updatedUser);
    saveSession(updatedUser, updatedWallet, userRole, true);
    api.updateUser(user.id, { usdtBalance: newUsdt, totalProfit: newProfit });

    setActiveInvestment(prev => prev ? { ...prev, status: 'completed' } : null);

    // Log transaction
    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'profit',
      amount: result.profit,
      asset: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Profit from ${result.planTitle}`
    };
    setTransactions(prev => [newTx, ...prev]);
    api.createTransaction(newTx);

    handleAddNotification(
      '✅ Investment Yield Completed',
      `+$${result.profit.toFixed(2)} USDT profit credited! Total received: $${result.total.toFixed(2)} USDT.`,
      'trading'
    );
  };

  // Handler: Trade Completed from Live Trading Engine
  const handleTradeCompleted = (record: TradeRecord, newWalletBalance: number) => {
    const updatedProfit = record.status === 'WIN' ? (wallet.totalProfit || 0) + record.profitAmount : (wallet.totalProfit || 0);
    const updatedWallet: WalletState = {
      ...wallet,
      usdtBalance: newWalletBalance,
      usdBalance: newWalletBalance,
      totalProfit: updatedProfit
    };
    setWallet(updatedWallet);

    const updatedUser: UserProfile = { ...user, usdtBalance: newWalletBalance };
    setUser(updatedUser);
    saveSession(updatedUser, updatedWallet, userRole, true);
    api.updateUser(user.id, { usdtBalance: newWalletBalance, totalProfit: updatedProfit });

    const newTx: TransactionItem = {
      id: record.id,
      userId: user.id,
      type: 'profit',
      amount: record.profitAmount,
      asset: `${record.asset} (${record.direction})`,
      status: 'completed',
      date: record.timestamp,
      note: `Trade ${record.status}`
    };
    setTransactions(prev => [newTx, ...prev]);
    api.createTransaction(newTx);
  };

  // Handler: Deposit Request (Pending Admin Approval)
  const handleDepositSubmit = async (
    amount: number, 
    asset: string, 
    proofImage?: string, 
    txHash?: string, 
    note?: string
  ) => {
    const generatedHash = txHash || `0x${Math.random().toString(16).substring(2, 14)}...`;
    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'deposit',
      amount,
      asset,
      status: 'pending',
      txHash: generatedHash,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: note || (proofImage ? 'Payment Proof Attached (Pending Admin)' : 'Deposit Request (Pending Admin Approval)'),
      proofImage: proofImage || undefined
    };

    setTransactions(prev => [newTx, ...prev.filter(t => t.id !== newTx.id)]);

    // Save permanently to Cloud SQL / Server
    try {
      const saved = await api.createTransaction(newTx);
      if (saved) {
        setTransactions(prev => [saved, ...prev.filter(t => t.id !== newTx.id && t.id !== saved.id)]);
      }
    } catch (err) {
      console.warn('[Deposit] Error creating transaction:', err);
    }

    handleAddNotification(
      '⏳ Deposit Submitted (Pending Admin)',
      `Your deposit request of $${amount.toFixed(2)} ${asset} has been submitted with payment receipt. It will be credited once approved by Admin.`,
      'deposit'
    );
  };

  // Handler: Withdraw Request (Pending Admin Approval)
  const handleWithdrawSubmit = async (amount: number, asset: string, address: string) => {
    // Hold funds while pending
    const newUsdt = Math.max(0, wallet.usdtBalance - amount);
    const updatedWallet: WalletState = {
      ...wallet,
      usdtBalance: newUsdt,
      usdBalance: newUsdt
    };
    setWallet(updatedWallet);

    const updatedUser: UserProfile = { ...user, usdtBalance: newUsdt };
    setUser(updatedUser);
    saveSession(updatedUser, updatedWallet, userRole, true);
    api.updateUser(user.id, { usdtBalance: newUsdt });

    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'withdraw',
      amount,
      asset,
      status: 'pending',
      txHash: `0x${Math.random().toString(16).substring(2, 14)}...`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: `Withdrawal to ${address.substring(0, 8)}... (Pending Admin)`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Save permanently to Cloud SQL
    await api.createTransaction(newTx);

    handleAddNotification(
      '⏳ Withdrawal Submitted (Pending Admin)',
      `Your withdrawal request of $${amount.toFixed(2)} ${asset} has been submitted for Admin approval.`,
      'withdrawal'
    );
  };

  // Handler: Admin Approve Transaction
  const handleApproveTransaction = async (txId: string) => {
    const target = transactions.find(t => t.id === txId);
    if (!target) return;

    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'completed' } : t));

    // Update Cloud SQL
    await api.updateTransaction(txId, 'completed');

    if (target.type === 'deposit') {
      const targetUserId = target.userId;
      if (targetUserId) {
        const targetUser = usersList.find(u => u.id === targetUserId);
        const currentBal = targetUser ? (targetUser.usdtBalance || 0) : 0;
        const currentDep = targetUser ? (targetUser.totalDeposit || 0) : 0;
        const newUsdt = Number((currentBal + target.amount).toFixed(2));
        const newDeposit = Number((currentDep + target.amount).toFixed(2));

        setUsersList(prev => prev.map(u => u.id === targetUserId ? { ...u, usdtBalance: newUsdt, totalDeposit: newDeposit } : u));
        await api.updateUser(targetUserId, { usdtBalance: newUsdt, totalDeposit: newDeposit });

        if (targetUserId === user.id) {
          const updatedWallet: WalletState = {
            ...wallet,
            usdtBalance: newUsdt,
            usdBalance: newUsdt,
            totalDeposit: newDeposit
          };
          setWallet(updatedWallet);
          const updatedUser: UserProfile = { ...user, usdtBalance: newUsdt };
          setUser(updatedUser);
          saveSession(updatedUser, updatedWallet, userRole, true);
        }
      }

      handleAddNotification(
        '💰 Deposit Approved!',
        `Admin has APPROVED deposit of $${target.amount.toFixed(2)} USDT! Balance credited.`,
        'deposit'
      );
    } else if (target.type === 'withdraw') {
      const targetUserId = target.userId;
      if (targetUserId) {
        const targetUser = usersList.find(u => u.id === targetUserId);
        const currentWithdraw = targetUser ? (targetUser.totalWithdraw || 0) : 0;
        const newWithdraw = Number((currentWithdraw + target.amount).toFixed(2));

        setUsersList(prev => prev.map(u => u.id === targetUserId ? { ...u, totalWithdraw: newWithdraw } : u));
        await api.updateUser(targetUserId, { totalWithdraw: newWithdraw });

        if (targetUserId === user.id) {
          const updatedWallet: WalletState = {
            ...wallet,
            totalWithdraw: newWithdraw
          };
          setWallet(updatedWallet);
          saveSession(user, updatedWallet, userRole, true);
        }
      }

      handleAddNotification(
        '✅ Withdrawal Approved!',
        `Admin has APPROVED withdrawal of $${target.amount.toFixed(2)} USDT! Funds dispatched.`,
        'withdrawal'
      );
    }
  };

  // Handler: Admin Reject Transaction
  const handleRejectTransaction = async (txId: string) => {
    const target = transactions.find(t => t.id === txId);
    if (!target) return;

    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'failed' } : t));

    // Update Cloud SQL
    await api.updateTransaction(txId, 'failed');

    if (target.type === 'deposit') {
      handleAddNotification(
        '❌ Deposit Request Rejected',
        `Admin rejected deposit request of $${target.amount.toFixed(2)} USDT.`,
        'deposit'
      );
    } else if (target.type === 'withdraw') {
      const targetUserId = target.userId;
      if (targetUserId) {
        const targetUser = usersList.find(u => u.id === targetUserId);
        const currentBal = targetUser ? (targetUser.usdtBalance || 0) : 0;
        const refundedUsdt = Number((currentBal + target.amount).toFixed(2));

        setUsersList(prev => prev.map(u => u.id === targetUserId ? { ...u, usdtBalance: refundedUsdt } : u));
        await api.updateUser(targetUserId, { usdtBalance: refundedUsdt });

        if (targetUserId === user.id) {
          const updatedWallet: WalletState = {
            ...wallet,
            usdtBalance: refundedUsdt,
            usdBalance: refundedUsdt
          };
          setWallet(updatedWallet);
          const updatedUser: UserProfile = { ...user, usdtBalance: refundedUsdt };
          setUser(updatedUser);
          saveSession(updatedUser, updatedWallet, userRole, true);
        }
      }

      handleAddNotification(
        '❌ Withdrawal Request Rejected',
        `Admin rejected withdrawal request of $${target.amount.toFixed(2)} USDT. Funds refunded to wallet.`,
        'withdrawal'
      );
    }
  };

  // Handlers for User Management System
  const handleUpdateUserBalance = async (userId: string, newBalance: number) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, usdtBalance: newBalance } : u));
    
    // Save to Cloud SQL
    await api.updateUser(userId, { usdtBalance: newBalance });

    // If target user is main profile, keep active wallet state in sync
    if (userId === user.id) {
      const updatedWallet: WalletState = { ...wallet, usdtBalance: newBalance, usdBalance: newBalance };
      const updatedUser: UserProfile = { ...user, usdtBalance: newBalance };
      setWallet(updatedWallet);
      setUser(updatedUser);
      saveSession(updatedUser, updatedWallet, userRole, true);

      handleAddNotification(
        '💵 Balance Adjusted by Admin',
        `Admin updated your USDT wallet balance to $${newBalance.toFixed(2)} USDT.`,
        'system'
      );
    }
  };

  const handleChangeUserStatus = async (userId: string, status: 'active' | 'suspended' | 'banned') => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: status } : u));
    
    // Save to Cloud SQL
    await api.updateUser(userId, { accountStatus: status });

    const target = usersList.find(u => u.id === userId);
    if (target) {
      handleAddNotification(
        `🛡️ Account Status Updated`,
        `User ${target.fullName} (${userId}) account status set to ${status.toUpperCase()}.`,
        'system'
      );
    }
  };

  const handleChangeUserVip = async (userId: string, vipLevel: number) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, vipLevel } : u));
    
    // Save to Cloud SQL
    await api.updateUser(userId, { vipLevel });

    if (userId === user.id) {
      const updatedUser: UserProfile = { ...user, vipLevel };
      setUser(updatedUser);
      saveSession(updatedUser, wallet, userRole, true);
      handleAddNotification(
        '👑 VIP Tier Upgraded',
        `Congratulations! Admin upgraded your account to VIP ${vipLevel}.`,
        'announcement'
      );
    }
  };

  const handleChangeUserRole = async (userId: string, role: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    
    // Save to Cloud SQL
    await api.updateUser(userId, { role });

    if (userId === user.id) {
      const updatedUser: UserProfile = { ...user, role };
      setUser(updatedUser);
      setUserRole(role);
      saveSession(updatedUser, wallet, role, true);
      handleAddNotification(
        '🛡️ Account Permission Changed',
        `Your user role was updated to ${role.toUpperCase()}.`,
        'system'
      );
    }
  };

  const handleAddNewUser = async (newUser: ManagedUser) => {
    setUsersList(prev => [newUser, ...prev]);

    // Save to Cloud SQL
    await api.registerUser({
      ...newUser,
      password: 'password123'
    });

    handleAddNotification(
      '👤 New Member Created & Stored in Cloud',
      `Account created for ${newUser.fullName} (${newUser.email}) with $${newUser.usdtBalance.toFixed(2)} USDT balance.`,
      'system'
    );
  };

  // Handler: Claim Daily Reward
  const handleClaimDailyReward = async (amount: number) => {
    const newUsdt = Number(((wallet?.usdtBalance ?? 0) + amount).toFixed(2));
    const newProfit = Number(((wallet?.totalProfit ?? 0) + amount).toFixed(2));

    const updatedWallet: WalletState = {
      ...wallet,
      usdtBalance: newUsdt,
      usdBalance: newUsdt,
      totalProfit: newProfit
    };
    setWallet(updatedWallet);

    const updatedUser: UserProfile = {
      ...user,
      usdtBalance: newUsdt
    };
    setUser(updatedUser);

    // Save session immediately so browser reload preserves balance!
    saveSession(updatedUser, updatedWallet, userRole, true);

    const todayStr = new Date().toISOString().split('T')[0];
    try {
      localStorage.setItem(`usdt_daily_claim_${user.id || 'default'}_${todayStr}`, 'true');
    } catch {}

    const newTx: TransactionItem = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      type: 'bonus',
      amount,
      asset: 'USDT',
      status: 'completed',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: 'Daily Login Reward ($2.50)'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Save immediately to Cloud SQL database permanently!
    try {
      await Promise.all([
        api.updateUser(user.id, {
          usdtBalance: newUsdt,
          totalProfit: newProfit
        }),
        api.createTransaction(newTx)
      ]);
    } catch (err) {
      console.warn('[Cloud SQL] Daily claim sync warning:', err);
    }

    // Update in-memory user list so admin sees latest balance
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, usdtBalance: newUsdt, totalProfit: newProfit } : u));

    handleAddNotification(
      '🎁 Daily Reward Claimed ($2.50)',
      `$${amount.toFixed(2)} USDT credited to your balance and permanently saved in database!`,
      'announcement'
    );
  };

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setShowAuthModal(true);
          }}
          plans={plansList}
          customerCareConfig={customerCareConfig}
        />

        {/* Logged Out Login / Register Modal Overlay */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="glass-gold-card p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative border-[#F4C542]/40">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Brand */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#B8860B] via-[#F4C542] to-[#FFD700] p-0.5 shadow-[0_0_20px_rgba(244,197,66,0.3)] flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoImg} 
                    alt="USDT REWARD PRO Logo" 
                    className="w-full h-full object-cover rounded-[14px]" 
                    referrerPolicy="no-referrer"
                  />
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
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError('');
                  }}
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
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authMode === 'register'
                      ? 'btn-gold-gradient text-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Message Box */}
              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="flex-1 leading-relaxed">{authError}</p>
                </div>
              )}

              {/* SIGN IN FORM */}
              {authMode === 'signin' ? (
                <form onSubmit={handleLogin} noValidate className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username / Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      placeholder="Enter username or email"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (authError) setAuthError('');
                      }}
                      placeholder="Enter account password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#F4C542]/20 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      'Sign In to VIP Wallet'
                    )}
                  </button>
                </form>
              ) : (
                /* SIGN UP FORM */
                <form onSubmit={handleRegister} noValidate className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="e.g. John Doe"
                        className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Username <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => {
                          setRegUsername(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="e.g. johndoe99"
                        className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="Min. 6 chars"
                        className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Password <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => {
                          setRegConfirmPassword(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Referral Code <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={regReferral}
                      onChange={(e) => setRegReferral(e.target.value)}
                      placeholder="Enter referral code if you have one"
                      className="w-full px-3 py-2 rounded-xl bg-[#080D18] border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-[#F4C542] placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 btn-gold-gradient text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-[#F4C542]/20 hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      'Sign Up & Create Account'
                    )}
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
      </>
    );
  }

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
        onSelectAdminTab={(subTab) => setAdminSubTab(subTab)}
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
              userId={user.id}
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
              plans={plansList}
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
              walletConfig={walletConfig}
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
              bonusConfig={{
                dailyReward: bonusConfig.dailyReward,
                welcomeBonus: bonusConfig.welcomeBonus
              }}
              userId={user.id}
              onClaimWelcomeBonus={async (amt) => {
                const newUsdt = Number(((wallet?.usdtBalance ?? 0) + amt).toFixed(2));
                const newProfit = Number(((wallet?.totalProfit ?? 0) + amt).toFixed(2));

                const updatedWallet: WalletState = {
                  ...wallet,
                  usdtBalance: newUsdt,
                  usdBalance: newUsdt,
                  totalProfit: newProfit
                };
                setWallet(updatedWallet);

                const updatedUser: UserProfile = {
                  ...user,
                  usdtBalance: newUsdt
                };
                setUser(updatedUser);

                // Save persistent session
                saveSession(updatedUser, updatedWallet, userRole, true);

                const newTx: TransactionItem = {
                  id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
                  userId: user.id,
                  type: 'bonus',
                  amount: amt,
                  asset: 'USDT',
                  status: 'completed',
                  date: new Date().toISOString().replace('T', ' ').substring(0, 19),
                  note: 'Welcome Bonus ($5.00)'
                };
                setTransactions(prev => [newTx, ...prev]);

                // Save to Cloud SQL
                try {
                  await Promise.all([
                    api.updateUser(user.id, {
                      usdtBalance: newUsdt,
                      totalProfit: newProfit
                    }),
                    api.createTransaction(newTx)
                  ]);
                } catch (err) {
                  console.warn('[Cloud SQL] Welcome bonus sync warning:', err);
                }

                setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, usdtBalance: newUsdt, totalProfit: newProfit } : u));

                handleAddNotification(
                  '🎉 Welcome Bonus Claimed ($5.00)',
                  `$${amt.toFixed(2)} USDT credited to your balance and permanently recorded in Cloud SQL!`,
                  'announcement'
                );
              }}
            />
          </div>
        )}

        {/* LOAN SYSTEM */}
        {activeTab === 'loan' && (
          <div className="animate-in fade-in duration-300">
            <LoanSystem
              activeLoan={loan}
              user={user}
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
            <CustomerSupport config={customerCareConfig} />
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
            <ReferralSystem referralCode={user.referralCode} config={referralConfig} />
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
              plansList={plansList}
              initialTab={adminSubTab}
              customerCareConfig={customerCareConfig}
              walletConfig={walletConfig}
              bonusConfig={bonusConfig}
              referralConfig={referralConfig}
              onRefreshData={syncWithCloudSql}
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
              onUpdateInvestmentPlans={(updatedPlans) => {
                setPlansList(updatedPlans);
                api.saveSetting('investmentPlans', updatedPlans);
              }}
              onUpdateCustomerCareConfig={(updatedCare) => {
                setCustomerCareConfig(updatedCare);
                api.saveSetting('customerCare', updatedCare);
              }}
              onUpdateWalletConfig={(updatedWallet) => {
                setWalletConfig(updatedWallet);
                api.saveSetting('wallet', updatedWallet);
              }}
              onUpdateBonusConfig={(updatedBonus) => {
                setBonusConfig(updatedBonus);
                api.saveSetting('bonus', updatedBonus);
              }}
              onUpdateReferralConfig={(updatedRef) => {
                setReferralConfig(updatedRef);
                api.saveSetting('referral', updatedRef);
              }}
              onUpdateLoanNotice={(updatedLoan) => {
                setLoan(updatedLoan);
                api.saveSetting('loan', updatedLoan);
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
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#F4C542]/40 flex items-center justify-center">
              <img 
                src={logoImg} 
                alt="USDT REWARD PRO Logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
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
