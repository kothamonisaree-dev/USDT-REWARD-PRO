import { 
  UserProfile, 
  WalletState, 
  InvestmentPlan, 
  CryptoTicker, 
  TransactionItem, 
  NotificationItem, 
  LoanData, 
  BonusTask,
  ManagedUser,
  DepositCurrencyWallet
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'USR-0000000',
  username: '',
  fullName: 'VIP Trader',
  email: '',
  phone: '',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VIPTrader',
  vipLevel: 1,
  kycStatus: 'unverified',
  is2FAEnabled: false,
  role: 'user',
  joinedDate: new Date().toISOString().split('T')[0],
  referralCode: 'USDT-VIP'
};

export const initialWalletState: WalletState = {
  usdtBalance: 0.00,
  usdBalance: 0.00,
  btcBalance: 0.0000,
  ethBalance: 0.0000,
  totalDeposit: 0.00,
  totalWithdraw: 0.00,
  totalProfit: 0.00,
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
    minInvestment: 2500,
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
    id: 'USR-5278770',
    username: 'romeroapolinar',
    fullName: 'Tomás Pedro Romero Apolinar',
    email: 'romeroapolinar0960@gmail.com',
    phone: '+52 55 1234 5678',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    vipLevel: 1,
    kycStatus: 'unverified',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 117.22,
    totalDeposit: 117.22,
    totalWithdraw: 0.00,
    joinedDate: '2026-08-18',
    referralCode: 'REF-527877',
    tradesCount: 12
  },
  {
    id: 'USR-6592361',
    username: 'alexkahn',
    fullName: 'alexkahn',
    email: 'alex580@gmail.com',
    phone: '+1 (555) 659-2361',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    vipLevel: 1,
    kycStatus: 'unverified',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 102.50,
    totalDeposit: 102.50,
    totalWithdraw: 0.00,
    joinedDate: '2026-08-18',
    referralCode: 'REF-659236',
    tradesCount: 8
  },
  {
    id: 'USR-7002417',
    username: 'sophia',
    fullName: 'Sophia',
    email: 'sophia007@gmail.com',
    phone: '+44 7911 700241',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    vipLevel: 1,
    kycStatus: 'unverified',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 18199.29,
    totalDeposit: 20000.00,
    totalWithdraw: 1800.71,
    joinedDate: '2026-08-18',
    referralCode: 'REF-700241',
    tradesCount: 45
  },
  {
    id: 'USR-8829401',
    username: 'emukhan580',
    fullName: 'Super Administrator',
    email: 'admin@usdtpro.com',
    phone: '+1 (555) 019-2831',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    vipLevel: 5,
    kycStatus: 'verified',
    accountStatus: 'active',
    role: 'admin',
    usdtBalance: 125430.50,
    totalDeposit: 150000.00,
    totalWithdraw: 45000.00,
    joinedDate: '2024-01-10',
    referralCode: 'USDT-VIP-0001',
    tradesCount: 142
  },
  {
    id: 'USR-3804544',
    username: 'candelario',
    fullName: 'Candelario Méndez Guzmán',
    email: 'candelariomendez@gmail.com',
    phone: '+1 (555) 380-4544',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    vipLevel: 1,
    kycStatus: 'unverified',
    accountStatus: 'active',
    role: 'user',
    usdtBalance: 0.00,
    totalDeposit: 0.00,
    totalWithdraw: 0.00,
    joinedDate: '2026-08-21',
    referralCode: 'REF-3804544',
    tradesCount: 0
  },
  {
    id: 'USR-1029384',
    username: 'alex.m',
    fullName: 'Alex Morgan',
    email: 'alex.m@usdtpro.com',
    phone: '+1 (555) 389-2041',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    vipLevel: 1,
    kycStatus: 'unverified',
    accountStatus: 'suspended',
    role: 'user',
    usdtBalance: 1000.00,
    totalDeposit: 1000.00,
    totalWithdraw: 0.00,
    joinedDate: '2025-11-12',
    referralCode: 'USDT-VIP-8829',
    tradesCount: 0
  }
];

export const defaultDepositCurrencies: DepositCurrencyWallet[] = [
  {
    id: 'usdt-trc20',
    symbol: 'USDT',
    name: 'Tether USD (TRC20)',
    network: 'TRC20 (Tron Network - Low Fee)',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    minDeposit: 50,
    qrCodeUrl: '',
    isActive: true
  },
  {
    id: 'usdt-erc20',
    symbol: 'USDT',
    name: 'Tether USD (ERC20)',
    network: 'ERC20 (Ethereum Network)',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    minDeposit: 100,
    qrCodeUrl: '',
    isActive: true
  },
  {
    id: 'btc-native',
    symbol: 'BTC',
    name: 'Bitcoin Native',
    network: 'Bitcoin Native (BTC)',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minDeposit: 100,
    qrCodeUrl: '',
    isActive: true
  },
  {
    id: 'eth-native',
    symbol: 'ETH',
    name: 'Ethereum Native',
    network: 'Ethereum Native (ERC20)',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    minDeposit: 100,
    qrCodeUrl: '',
    isActive: true
  }
];
