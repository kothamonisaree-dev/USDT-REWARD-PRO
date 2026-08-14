import { 
  UserProfile, 
  WalletState, 
  InvestmentPlan, 
  CryptoTicker, 
  TransactionItem, 
  NotificationItem, 
  LoanData, 
  BonusTask,
  ManagedUser
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'USR-8829401',
  username: 'alexmorgan',
  fullName: 'Alex Morgan',
  email: 'alex.m@usdtpro.com',
  phone: '+1 (555) 389-2041',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  vipLevel: 1,
  kycStatus: 'unverified',
  is2FAEnabled: false,
  role: 'user',
  joinedDate: '2025-11-12',
  referralCode: 'USDT-VIP-8829'
};

export const initialWalletState: WalletState = {
  usdtBalance: 12850.50,
  usdBalance: 12850.50,
  btcBalance: 0.1425,
  ethBalance: 2.1840,
  totalDeposit: 45200.00,
  totalWithdraw: 28500.00,
  totalProfit: 8240.50,
  activeInvestmentAmount: 0.00,
  walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
};

export const investmentPlans: InvestmentPlan[] = [
  {
    id: 'plan-90s',
    durationSeconds: 90,
    title: '90 Seconds High Yield',
    profitPercentage: 20,
    minInvestment: 50,
    maxInvestment: 50000,
    description: 'Fast 90-second automated execution with guaranteed 20% fixed yield.'
  },
  {
    id: 'plan-180s',
    durationSeconds: 180,
    title: '180 Seconds VIP Yield',
    profitPercentage: 30,
    minInvestment: 1000,
    maxInvestment: 50000,
    description: '180-second strategy engineered for $1,000+ stakes with 30% yield.'
  },
  {
    id: 'plan-300s',
    durationSeconds: 300,
    title: '300 Seconds Ultra PRO Yield',
    profitPercentage: 50,
    minInvestment: 50,
    maxInvestment: 50000,
    description: '5-minute premium cycle delivering maximum 50% fixed yield return.'
  }
];

export const initialCryptoTickers: CryptoTicker[] = [
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    price: 94820.40,
    change24h: 3.42,
    high24h: 96100.00,
    low24h: 92400.00,
    volume24h: 38920140,
    icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    sparkline: [92400, 93100, 92800, 93800, 94200, 93900, 94820]
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    price: 3340.80,
    change24h: 4.15,
    high24h: 3410.00,
    low24h: 3190.00,
    volume24h: 18940200,
    icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    sparkline: [3190, 3220, 3250, 3280, 3310, 3300, 3340]
  },
  {
    symbol: 'USDTUSD',
    name: 'Tether USD',
    price: 1.0002,
    change24h: 0.01,
    high24h: 1.0005,
    low24h: 0.9998,
    volume24h: 89400200,
    icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png',
    sparkline: [1.0001, 1.0002, 1.0000, 1.0003, 1.0001, 1.0002]
  },
  {
    symbol: 'BNBUSDT',
    name: 'BNB',
    price: 685.20,
    change24h: -1.12,
    high24h: 702.00,
    low24h: 678.00,
    volume24h: 5420100,
    icon: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    sparkline: [702, 698, 690, 688, 682, 685]
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
    price: 188.45,
    change24h: 7.84,
    high24h: 194.00,
    low24h: 172.50,
    volume24h: 12408900,
    icon: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    sparkline: [172.5, 178, 181, 184, 182, 188.45]
  },
  {
    symbol: 'XRPUSDT',
    name: 'XRP',
    price: 2.38,
    change24h: 5.62,
    high24h: 2.45,
    low24h: 2.21,
    volume24h: 9812000,
    icon: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    sparkline: [2.21, 2.26, 2.30, 2.32, 2.35, 2.38]
  },
  {
    symbol: 'ADAUSDT',
    name: 'Cardano',
    price: 0.884,
    change24h: -0.85,
    high24h: 0.912,
    low24h: 0.865,
    volume24h: 3120400,
    icon: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    sparkline: [0.912, 0.900, 0.890, 0.880, 0.884]
  },
  {
    symbol: 'DOGEUSDT',
    name: 'Dogecoin',
    price: 0.284,
    change24h: 12.40,
    high24h: 0.310,
    low24h: 0.245,
    volume24h: 15402000,
    icon: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    sparkline: [0.245, 0.260, 0.270, 0.278, 0.284]
  }
];

export const initialTransactions: TransactionItem[] = [];

export const initialNotifications: NotificationItem[] = [];

export const initialLoanNoticeData: LoanData = {
  id: 'L-99482',
  amount: 2500.00,
  termDays: 14,
  interestRate: 3.2,
  interestAmount: 80.00,
  totalRepayment: 2580.00,
  loanDate: '2026-07-20 10:15:00',
  dueDate: '2026-08-03 10:15:00', // Past date to trigger overdue countdown!
  status: 'overdue',
  borrowerName: 'Alex Morgan',
  username: 'alexmorgan',
  phone: '+1 (555) 389-2041'
};

export const bonusTasksList: BonusTask[] = [
  {
    id: 'task-d1',
    title: 'Day 1 Activity Task',
    day: 1,
    rewardAmount: 16.25,
    status: 'available',
    description: 'Complete Task 1 to unlock Day 1 promotional bonus reward.'
  },
  {
    id: 'task-d2',
    title: 'Day 2 Trading Milestone',
    day: 2,
    rewardAmount: 37.75,
    status: 'locked',
    description: 'Unlocks after completing Day 1 task submission.'
  },
  {
    id: 'task-d3',
    title: 'Day 3 Level Up Bonus',
    day: 3,
    rewardAmount: 62.35,
    status: 'locked',
    description: 'Unlocks after completing Day 2 task submission.'
  }
];

export const initialUsersList: ManagedUser[] = [
  {
    id: 'ADM-000580',
    username: 'emukhan580',
    fullName: 'EMU KHAN (Super Admin)',
    email: 'emukhan580@admin.com',
    phone: '+1 (555) 580-2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    vipLevel: 5,
    kycStatus: 'verified',
    accountStatus: 'active',
    role: 'admin',
    usdtBalance: 500000.00,
    totalDeposit: 1000000.00,
    totalWithdraw: 500000.00,
    joinedDate: '2025-01-01',
    referralCode: 'ADMIN-EMUKHAN',
    tradesCount: 580
  },
  {
    id: 'SUB-100201',
    username: 'subadmin_ops',
    fullName: 'Sub Admin Inspector',
    email: 'subadmin@usdtpro.com',
    phone: '+1 (555) 782-9901',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    vipLevel: 4,
    kycStatus: 'verified',
    accountStatus: 'active',
    role: 'sub_admin',
    usdtBalance: 50000.00,
    totalDeposit: 100000.00,
    totalWithdraw: 20000.00,
    joinedDate: '2025-05-10',
    referralCode: 'SUBADMIN-01',
    tradesCount: 120
  },
  {
    id: 'USR-8829401',
    username: 'alexmorgan',
    fullName: 'Alex Morgan',
    email: 'alex.m@usdtpro.com',
    phone: '+1 (555) 389-2041',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    vipLevel: 3,
    kycStatus: 'verified',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 12850.50,
    totalDeposit: 45200.00,
    totalWithdraw: 28500.00,
    joinedDate: '2025-11-12',
    referralCode: 'USDT-VIP-8829',
    tradesCount: 42
  },
  {
    id: 'USR-9012384',
    username: 'elena_r',
    fullName: 'Elena Rostova',
    email: 'elena.r@globaltrader.io',
    phone: '+44 7911 123456',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    vipLevel: 5,
    kycStatus: 'verified',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 84500.00,
    totalDeposit: 150000.00,
    totalWithdraw: 95000.00,
    joinedDate: '2025-08-01',
    referralCode: 'ELENA-VIP5',
    tradesCount: 189
  },
  {
    id: 'USR-7734109',
    username: 'david_chen',
    fullName: 'David Chen',
    email: 'd.chen@cryptoasia.com',
    phone: '+852 9123 4567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    vipLevel: 1,
    kycStatus: 'pending',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 1200.00,
    totalDeposit: 3000.00,
    totalWithdraw: 1800.00,
    joinedDate: '2026-01-15',
    referralCode: 'CHEN-USDT',
    tradesCount: 8
  },
  {
    id: 'USR-6629104',
    username: 'rahul_s',
    fullName: 'Rahul Sharma',
    email: 'rahul.s@techfin.in',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    vipLevel: 0,
    kycStatus: 'unverified',
    accountStatus: 'suspended',
    role: 'user',
    usdtBalance: 150.00,
    totalDeposit: 500.00,
    totalWithdraw: 0.00,
    joinedDate: '2026-02-01',
    referralCode: 'RAHUL-90',
    tradesCount: 3
  }
];
