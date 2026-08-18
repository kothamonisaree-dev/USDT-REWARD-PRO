import { pgTable, serial, text, timestamp, doublePrecision, integer, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Custom ID e.g. USR-8829401 or Firebase UID
  username: text('username').notNull().unique(),
  password: text('password'),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  avatar: text('avatar'),
  vipLevel: integer('vip_level').default(1).notNull(),
  kycStatus: text('kyc_status').default('unverified').notNull(), // 'unverified' | 'pending' | 'verified' | 'rejected'
  accountStatus: text('account_status').default('active').notNull(), // 'active' | 'suspended' | 'banned'
  role: text('role').default('user').notNull(), // 'user' | 'admin' | 'sub_admin'
  usdtBalance: doublePrecision('usdt_balance').default(0).notNull(),
  totalDeposit: doublePrecision('total_deposit').default(0).notNull(),
  totalWithdraw: doublePrecision('total_withdraw').default(0).notNull(),
  totalProfit: doublePrecision('total_profit').default(0).notNull(),
  joinedDate: text('joined_date').notNull(),
  referralCode: text('referral_code').notNull(),
  tradesCount: integer('trades_count').default(0).notNull(),
  is2FAEnabled: boolean('is_2fa_enabled').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const kycRequests = pgTable('kyc_requests', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  docType: text('doc_type').notNull(), // 'nid' | 'passport' | 'license'
  docNumber: text('doc_number').notNull(),
  fullName: text('full_name').notNull(),
  frontDocUrl: text('front_doc_url'),
  backDocUrl: text('back_doc_url'),
  selfieDocUrl: text('selfie_doc_url'),
  submittedAt: text('submitted_at').notNull(),
  status: text('status').default('pending').notNull(), // 'pending' | 'verified' | 'rejected'
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  type: text('type').notNull(), // 'deposit' | 'withdraw' | 'profit' | 'investment' | 'loan' | 'bonus' | 'cashback'
  amount: doublePrecision('amount').notNull(),
  asset: text('asset').default('USDT').notNull(),
  status: text('status').default('completed').notNull(), // 'completed' | 'pending' | 'failed'
  txHash: text('tx_hash'),
  date: text('date').notNull(),
  note: text('note'),
  proofImage: text('proof_image'),
  senderAddress: text('sender_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  amount: doublePrecision('amount').notNull(),
  termDays: integer('term_days').notNull(),
  interestRate: doublePrecision('interest_rate').notNull(),
  interestAmount: doublePrecision('interest_amount').notNull(),
  totalRepayment: doublePrecision('total_repayment').notNull(),
  loanDate: text('loan_date').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'repaid' | 'overdue'
  borrowerName: text('borrower_name').notNull(),
  username: text('username').notNull(),
  nidPassportUrl: text('nid_passport_url'),
  bankCardMasked: text('bank_card_masked'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const appSettings = pgTable('app_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
