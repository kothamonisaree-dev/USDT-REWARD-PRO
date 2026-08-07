export type NavigationTab = 
  | 'home' 
  | 'trading' 
  | 'invest' 
  | 'wallet' 
  | 'profile' 
  | 'bonus' 
  | 'loan' 
  | 'loan-notice' 
  | 'support' 
  | 'security' 
  | 'referral' 
  | 'settings' 
  | 'admin';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  vipLevel: number;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  is2FAEnabled: boolean;
  role: UserRole;
  joinedDate: string;
  referralCode: string;
}

export interface WalletState {
  usdtBalance: number;
  usdBalance: number;
  btcBalance: number;
  ethBalance: number;
  totalDeposit: number;
  totalWithdraw: number;
  totalProfit: number;
  activeInvestmentAmount: number;
  walletAddress: string;
}

export interface InvestmentPlan {
  id: string;
  durationSeconds: number;
  title: string;
  profitPercentage: number;
  minInvestment: number;
  maxInvestment: number;
  description: string;
}

export interface ActiveInvestment {
  id: string;
  planId: string;
  planTitle: string;
  amount: number;
  profitPercentage: number;
  expectedReturn: number;
  durationSeconds: number;
  secondsRemaining: number;
  startTime: number;
  status: 'running' | 'completed' | 'claimed';
}

export interface TradeRecord {
  id: string;
  asset: string;
  direction: 'BUY' | 'SELL';
  amount: number;
  entryPrice: number;
  exitPrice: number;
  returnPercentage: number;
  profitAmount: number;
  totalReturned: number;
  status: 'WIN' | 'LOSS';
  durationSeconds: number;
  timestamp: string; // LA Timezone format
}

export interface CryptoTicker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  icon: string;
  sparkline: number[];
}

export interface TransactionItem {
  id: string;
  type: 'deposit' | 'withdraw' | 'profit' | 'investment' | 'loan' | 'bonus' | 'cashback';
  amount: number;
  asset: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
  date: string;
  note?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'trading' | 'deposit' | 'withdrawal' | 'system' | 'announcement';
  timestamp: string;
  isRead: boolean;
}

export interface LoanData {
  id: string;
  amount: number;
  termDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  loanDate: string;
  dueDate: string;
  status: 'active' | 'repaid' | 'overdue';
  borrowerName: string;
  username: string;
  nidPassportUrl?: string;
  bankCardMasked?: string;
  phone: string;
}

export interface BonusTask {
  id: string;
  title: string;
  day: number;
  rewardAmount: number;
  status: 'available' | 'pending' | 'completed' | 'locked';
  description: string;
}
