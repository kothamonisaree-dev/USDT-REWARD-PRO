import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wprdiyfbsgjbsdsnbbsj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_wNfdot_4jsCyf7iKEGr_wA_A0yGzk7G';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface UserRecord {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  vipLevel: number;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'banned';
  role: 'user' | 'admin' | 'sub_admin';
  usdtBalance: number;
  totalDeposit: number;
  totalWithdraw: number;
  totalProfit: number;
  joinedDate: string;
  referralCode: string;
  tradesCount: number;
  is2FAEnabled: boolean;
  createdAt: string;
}

export interface KycRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  docType: string;
  docNumber: string;
  fullName: string;
  frontDocUrl?: string | null;
  backDocUrl?: string | null;
  selfieDocUrl?: string | null;
  submittedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string | null;
  createdAt: string;
}

export interface TransactionRecord {
  id: string;
  userId?: string | null;
  type: string;
  amount: number;
  asset: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string | null;
  date: string;
  note?: string | null;
  proofImage?: string | null;
  senderAddress?: string | null;
  createdAt: string;
}

export interface LoanRecord {
  id: string;
  userId?: string | null;
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
  nidPassportUrl?: string | null;
  bankCardMasked?: string | null;
  phone?: string;
  createdAt: string;
}

// Initial In-Memory / Resilient Seed Store
const usersMap = new Map<string, UserRecord>();
const kycMap = new Map<string, KycRecord>();
const txMap = new Map<string, TransactionRecord>();
const loansMap = new Map<string, LoanRecord>();
const settingsMap = new Map<string, string>();

const DATA_FILE = path.join(process.cwd(), 'data_store.json');

function saveToDisk() {
  try {
    const payload = {
      users: Array.from(usersMap.values()),
      kyc: Array.from(kycMap.values()),
      transactions: Array.from(txMap.values()),
      loans: Array.from(loansMap.values()),
      settings: Object.fromEntries(settingsMap.entries()),
      savedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Storage] Disk save note:', err);
  }
}

function loadFromDisk() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.users)) {
        parsed.users.forEach((u: UserRecord) => usersMap.set(u.id, u));
      }
      if (Array.isArray(parsed.kyc)) {
        parsed.kyc.forEach((k: KycRecord) => kycMap.set(k.id, k));
      }
      if (Array.isArray(parsed.transactions)) {
        parsed.transactions.forEach((t: TransactionRecord) => txMap.set(t.id, t));
      }
      if (Array.isArray(parsed.loans)) {
        parsed.loans.forEach((l: LoanRecord) => loansMap.set(l.id, l));
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        Object.entries(parsed.settings).forEach(([k, v]) => settingsMap.set(k, String(v)));
      }
    }
  } catch (err) {
    console.warn('[Storage] Disk load note:', err);
  }
}

// Seed all verified platform users matching the exact database snapshot
const defaultAdmin: UserRecord = {
  id: 'USR-8829401',
  username: 'emukhan580',
  password: 'Imran2015@!@!',
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
  totalProfit: 20430.50,
  joinedDate: '2024-01-10',
  referralCode: 'USDT-VIP-0001',
  tradesCount: 142,
  is2FAEnabled: true,
  createdAt: '2024-01-10T08:00:00.000Z'
};

const userTomas: UserRecord = {
  id: 'USR-5278770',
  username: 'romeroapolinar',
  password: 'user1234',
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
  totalProfit: 0.00,
  joinedDate: '2026-08-18',
  referralCode: 'REF-527877',
  tradesCount: 12,
  is2FAEnabled: false,
  createdAt: '2026-08-18T10:00:00.000Z'
};

const userAlexkahn: UserRecord = {
  id: 'USR-6592361',
  username: 'alexkahn',
  password: 'user1234',
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
  totalProfit: 0.00,
  joinedDate: '2026-08-18',
  referralCode: 'REF-659236',
  tradesCount: 8,
  is2FAEnabled: false,
  createdAt: '2026-08-18T10:15:00.000Z'
};

const userSophia: UserRecord = {
  id: 'USR-7002417',
  username: 'sophia',
  password: 'user1234',
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
  totalProfit: 0.00,
  joinedDate: '2026-08-18',
  referralCode: 'REF-700241',
  tradesCount: 45,
  is2FAEnabled: false,
  createdAt: '2026-08-18T10:30:00.000Z'
};

const user3804544: UserRecord = {
  id: 'USR-3804544',
  username: 'candelario',
  password: 'user1234',
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
  totalProfit: 0.00,
  joinedDate: '2026-08-21',
  referralCode: 'REF-3804544',
  tradesCount: 0,
  is2FAEnabled: false,
  createdAt: '2026-08-21T12:00:00.000Z'
};

const user4516057: UserRecord = {
  id: 'USR-4516057',
  username: 'edgte',
  password: 'user1234',
  fullName: 'edgte',
  email: 'tumki12@gmail.com',
  phone: '01472553248',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=edgte',
  vipLevel: 1,
  kycStatus: 'unverified',
  accountStatus: 'active',
  role: 'user',
  usdtBalance: 0.00,
  totalDeposit: 0.00,
  totalWithdraw: 0.00,
  totalProfit: 0.00,
  joinedDate: '2026-08-21',
  referralCode: '1',
  tradesCount: 0,
  is2FAEnabled: false,
  createdAt: '2026-08-21T12:30:00.000Z'
};

const defaultUser: UserRecord = {
  id: 'USR-1029384',
  username: 'alex.m',
  password: 'user1234',
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
  totalWithdraw: 0,
  totalProfit: 0,
  joinedDate: '2025-11-12',
  referralCode: 'USDT-VIP-8829',
  tradesCount: 0,
  is2FAEnabled: false,
  createdAt: '2025-11-12T09:00:00.000Z'
};

// First load any persisted data
loadFromDisk();

// Ensure all snapshot accounts exist in map
const snapshotUsers = [userTomas, userAlexkahn, userSophia, user3804544, defaultAdmin, defaultUser];
snapshotUsers.forEach(u => {
  if (!usersMap.has(u.id)) {
    usersMap.set(u.id, u);
  } else {
    // Preserve existing while ensuring accurate balance
    const cur = usersMap.get(u.id)!;
    usersMap.set(u.id, { ...u, ...cur, usdtBalance: cur.usdtBalance ?? u.usdtBalance });
  }
});
saveToDisk();

export const StorageEngine = {
  // --- USERS ---
  async getAllUsers(): Promise<UserRecord[]> {
    loadFromDisk();
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((u: any) => {
          // Only add from Supabase if user does not exist in local store
          if (!usersMap.has(u.id)) {
            const userObj: UserRecord = {
              id: u.id,
              username: u.username,
              password: u.password,
              fullName: u.full_name || u.fullName || u.username,
              email: u.email,
              phone: u.phone,
              avatar: u.avatar,
              vipLevel: Number(u.vip_level || u.vipLevel || 1),
              kycStatus: u.kyc_status || u.kycStatus || 'unverified',
              accountStatus: u.account_status || u.accountStatus || 'active',
              role: u.role || 'user',
              usdtBalance: Number(u.usdt_balance ?? u.usdtBalance ?? 0),
              totalDeposit: Number(u.total_deposit ?? u.totalDeposit ?? 0),
              totalWithdraw: Number(u.total_withdraw ?? u.totalWithdraw ?? 0),
              totalProfit: Number(u.total_profit ?? u.totalProfit ?? 0),
              joinedDate: u.joined_date || u.joinedDate || new Date().toISOString().split('T')[0],
              referralCode: u.referral_code || u.referralCode || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
              tradesCount: Number(u.trades_count || u.tradesCount || 0),
              is2FAEnabled: Boolean(u.is_2fa_enabled ?? u.is2FAEnabled ?? false),
              createdAt: u.created_at || u.createdAt || new Date().toISOString()
            };
            usersMap.set(userObj.id, userObj);
          }
        });
      }
    } catch (e) {
      console.warn('[Supabase Sync] Note: Using local fast cache for users', e);
    }
    return Array.from(usersMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getUserById(id: string): Promise<UserRecord | null> {
    const cached = usersMap.get(id);
    if (cached) return cached;
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).limit(1);
      if (!error && data && data.length > 0) {
        const u = data[0];
        const userObj: UserRecord = {
          id: u.id,
          username: u.username,
          password: u.password,
          fullName: u.full_name || u.fullName || u.username,
          email: u.email,
          phone: u.phone,
          avatar: u.avatar,
          vipLevel: Number(u.vip_level || u.vipLevel || 1),
          kycStatus: u.kyc_status || u.kycStatus || 'unverified',
          accountStatus: u.account_status || u.accountStatus || 'active',
          role: u.role || 'user',
          usdtBalance: Number(u.usdt_balance ?? u.usdtBalance ?? 0),
          totalDeposit: Number(u.total_deposit ?? u.totalDeposit ?? 0),
          totalWithdraw: Number(u.total_withdraw ?? u.totalWithdraw ?? 0),
          totalProfit: Number(u.total_profit ?? u.totalProfit ?? 0),
          joinedDate: u.joined_date || u.joinedDate || new Date().toISOString().split('T')[0],
          referralCode: u.referral_code || u.referralCode || '',
          tradesCount: Number(u.trades_count || u.tradesCount || 0),
          is2FAEnabled: Boolean(u.is_2fa_enabled ?? u.is2FAEnabled ?? false),
          createdAt: u.created_at || u.createdAt || new Date().toISOString()
        };
        usersMap.set(userObj.id, userObj);
        return userObj;
      }
    } catch {
      // ignore
    }
    return null;
  },

  async findUserByUsernameOrEmail(identifier: string): Promise<UserRecord | null> {
    const clean = identifier.trim().toLowerCase();
    const allUsers = await this.getAllUsers();
    return allUsers.find(
      u => (u.username && u.username.toLowerCase() === clean) || 
           (u.email && u.email.toLowerCase() === clean) || 
           (u.id && u.id.toLowerCase() === clean) ||
           (u.id && u.id.toLowerCase().replace('usr-', '') === clean.replace('usr-', ''))
    ) || null;
  },

  async saveUser(user: UserRecord): Promise<UserRecord> {
    usersMap.set(user.id, user);
    saveToDisk();
    try {
      // Try pushing to Supabase
      await supabase.from('users').upsert({
        id: user.id,
        username: user.username,
        password: user.password,
        full_name: user.fullName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        vip_level: user.vipLevel,
        kyc_status: user.kycStatus,
        account_status: user.accountStatus,
        role: user.role,
        usdt_balance: user.usdtBalance,
        total_deposit: user.totalDeposit,
        total_withdraw: user.totalWithdraw,
        total_profit: user.totalProfit,
        joined_date: user.joinedDate,
        referral_code: user.referralCode,
        trades_count: user.tradesCount,
        is_2fa_enabled: user.is2FAEnabled
      });
    } catch (e) {
      console.warn('[Supabase Sync] Note: Stored locally in disk/memory cache');
    }
    return user;
  },

  async updateUser(id: string, updates: Partial<UserRecord>): Promise<UserRecord | null> {
    const existing = await this.getUserById(id);
    if (!existing) return null;
    const updated: UserRecord = {
      ...existing,
      ...updates
    };
    usersMap.set(id, updated);
    saveToDisk();
    try {
      const sbUpdates: any = {};
      if (updates.fullName !== undefined) sbUpdates.full_name = updates.fullName;
      if (updates.password !== undefined) sbUpdates.password = updates.password;
      if (updates.phone !== undefined) sbUpdates.phone = updates.phone;
      if (updates.avatar !== undefined) sbUpdates.avatar = updates.avatar;
      if (updates.vipLevel !== undefined) sbUpdates.vip_level = updates.vipLevel;
      if (updates.kycStatus !== undefined) sbUpdates.kyc_status = updates.kycStatus;
      if (updates.accountStatus !== undefined) sbUpdates.account_status = updates.accountStatus;
      if (updates.role !== undefined) sbUpdates.role = updates.role;
      if (updates.usdtBalance !== undefined) sbUpdates.usdt_balance = updates.usdtBalance;
      if (updates.totalDeposit !== undefined) sbUpdates.total_deposit = updates.totalDeposit;
      if (updates.totalWithdraw !== undefined) sbUpdates.total_withdraw = updates.totalWithdraw;
      if (updates.totalProfit !== undefined) sbUpdates.total_profit = updates.totalProfit;
      if (updates.tradesCount !== undefined) sbUpdates.trades_count = updates.tradesCount;
      if (updates.is2FAEnabled !== undefined) sbUpdates.is_2fa_enabled = updates.is2FAEnabled;

      if (Object.keys(sbUpdates).length > 0) {
        await supabase.from('users').update(sbUpdates).eq('id', id);
      }
    } catch {
      // ignore
    }
    return updated;
  },

  // --- TRANSACTIONS ---
  async getAllTransactions(): Promise<TransactionRecord[]> {
    loadFromDisk();
    try {
      const { data, error } = await supabase.from('transactions').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((t: any) => {
          const rec: TransactionRecord = {
            id: t.id,
            userId: t.user_id || t.userId,
            type: t.type,
            amount: Number(t.amount || 0),
            asset: t.asset || 'USDT',
            status: t.status || 'completed',
            txHash: t.tx_hash || t.txHash,
            date: t.date,
            note: t.note,
            proofImage: t.proof_image || t.proofImage || null,
            senderAddress: t.sender_address || t.senderAddress || null,
            createdAt: t.created_at || t.createdAt || new Date().toISOString()
          };
          txMap.set(rec.id, rec);
        });
      }
    } catch {
      // ignore
    }
    return Array.from(txMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async saveTransaction(tx: TransactionRecord): Promise<TransactionRecord> {
    txMap.set(tx.id, tx);
    saveToDisk();
    try {
      await supabase.from('transactions').upsert({
        id: tx.id,
        user_id: tx.userId,
        type: tx.type,
        amount: tx.amount,
        asset: tx.asset,
        status: tx.status,
        tx_hash: tx.txHash,
        date: tx.date,
        note: tx.note,
        proof_image: tx.proofImage,
        sender_address: tx.senderAddress
      });
    } catch {
      // ignore
    }
    return tx;
  },

  async updateTransaction(id: string, updates: Partial<TransactionRecord>): Promise<TransactionRecord | null> {
    const existing = txMap.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    txMap.set(id, updated);
    saveToDisk();
    try {
      const sbUpdates: any = {};
      if (updates.status) sbUpdates.status = updates.status;
      if (updates.note) sbUpdates.note = updates.note;
      await supabase.from('transactions').update(sbUpdates).eq('id', id);
    } catch {
      // ignore
    }
    return updated;
  },

  // --- KYC REQUESTS ---
  async getAllKyc(): Promise<KycRecord[]> {
    loadFromDisk();
    try {
      const { data, error } = await supabase.from('kyc_requests').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((k: any) => {
          const rec: KycRecord = {
            id: k.id,
            userId: k.user_id || k.userId,
            userName: k.user_name || k.userName,
            userEmail: k.user_email || k.userEmail,
            docType: k.doc_type || k.docType,
            docNumber: k.doc_number || k.docNumber,
            fullName: k.full_name || k.fullName,
            frontDocUrl: k.front_doc_url || k.frontDocUrl,
            backDocUrl: k.back_doc_url || k.backDocUrl,
            selfieDocUrl: k.selfie_doc_url || k.selfieDocUrl,
            submittedAt: k.submitted_at || k.submittedAt,
            status: k.status || 'pending',
            rejectionReason: k.rejection_reason || k.rejectionReason,
            createdAt: k.created_at || k.createdAt || new Date().toISOString()
          };
          kycMap.set(rec.id, rec);
        });
      }
    } catch {
      // ignore
    }
    return Array.from(kycMap.values()).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },

  async saveKyc(kyc: KycRecord): Promise<KycRecord> {
    kycMap.set(kyc.id, kyc);
    saveToDisk();
    try {
      await supabase.from('kyc_requests').upsert({
        id: kyc.id,
        user_id: kyc.userId,
        user_name: kyc.userName,
        user_email: kyc.userEmail,
        doc_type: kyc.docType,
        doc_number: kyc.docNumber,
        full_name: kyc.fullName,
        front_doc_url: kyc.frontDocUrl,
        back_doc_url: kyc.backDocUrl,
        selfie_doc_url: kyc.selfieDocUrl,
        submitted_at: kyc.submittedAt,
        status: kyc.status
      });
    } catch {
      // ignore
    }
    return kyc;
  },

  async updateKyc(id: string, updates: Partial<KycRecord>): Promise<KycRecord | null> {
    const existing = kycMap.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    kycMap.set(id, updated);
    saveToDisk();
    try {
      const sbUpdates: any = {};
      if (updates.status) sbUpdates.status = updates.status;
      if (updates.rejectionReason !== undefined) sbUpdates.rejection_reason = updates.rejectionReason;
      await supabase.from('kyc_requests').update(sbUpdates).eq('id', id);
    } catch {
      // ignore
    }
    return updated;
  },

  // --- LOANS ---
  async getAllLoans(): Promise<LoanRecord[]> {
    loadFromDisk();
    try {
      const { data, error } = await supabase.from('loans').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((l: any) => {
          const rec: LoanRecord = {
            id: l.id,
            userId: l.user_id || l.userId,
            amount: Number(l.amount || 0),
            termDays: Number(l.term_days || l.termDays || 14),
            interestRate: Number(l.interest_rate || l.interestRate || 3.2),
            interestAmount: Number(l.interest_amount || l.interestAmount || 0),
            totalRepayment: Number(l.total_repayment || l.totalRepayment || 0),
            loanDate: l.loan_date || l.loanDate,
            dueDate: l.due_date || l.dueDate,
            status: l.status || 'active',
            borrowerName: l.borrower_name || l.borrowerName,
            username: l.username,
            nidPassportUrl: l.nid_passport_url || l.nidPassportUrl,
            bankCardMasked: l.bank_card_masked || l.bankCardMasked,
            phone: l.phone,
            createdAt: l.created_at || l.createdAt || new Date().toISOString()
          };
          loansMap.set(rec.id, rec);
        });
      }
    } catch {
      // ignore
    }
    return Array.from(loansMap.values()).sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime());
  },

  async saveLoan(loan: LoanRecord): Promise<LoanRecord> {
    loansMap.set(loan.id, loan);
    saveToDisk();
    try {
      await supabase.from('loans').upsert({
        id: loan.id,
        user_id: loan.userId,
        amount: loan.amount,
        term_days: loan.termDays,
        interest_rate: loan.interestRate,
        interest_amount: loan.interestAmount,
        total_repayment: loan.totalRepayment,
        loan_date: loan.loanDate,
        due_date: loan.dueDate,
        status: loan.status,
        borrower_name: loan.borrowerName,
        username: loan.username,
        nid_passport_url: loan.nidPassportUrl,
        bank_card_masked: loan.bankCardMasked,
        phone: loan.phone
      });
    } catch {
      // ignore
    }
    return loan;
  },

  // --- SETTINGS ---
  async getSettings(): Promise<Record<string, any>> {
    loadFromDisk();
    const res: Record<string, any> = {};
    settingsMap.forEach((v, k) => {
      try {
        res[k] = JSON.parse(v);
      } catch {
        res[k] = v;
      }
    });
    return res;
  },

  async saveSetting(key: string, value: any): Promise<void> {
    const strVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
    settingsMap.set(key, strVal);
    saveToDisk();
  }
};
