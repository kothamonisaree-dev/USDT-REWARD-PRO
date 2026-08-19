import { ManagedUser, TransactionItem, KycRequestData, LoanData, UserProfile, WalletState, UserRole } from '../types';
import { firebaseService } from './firebaseService';

export interface AppSession {
  isLoggedIn: boolean;
  user: UserProfile;
  wallet: WalletState;
  role: UserRole;
  savedAt: number;
}

export const api = {
  // 0. SESSION PRESERVATION (Sync with backend on reload)
  async fetchCurrentSession(): Promise<AppSession | null> {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (response.ok && data.success && data.session) {
        return data.session;
      }
      return null;
    } catch (err) {
      console.warn('[API] Session fetch warning:', err);
      return null;
    }
  },

  async saveSessionToServer(sessionData: { isLoggedIn: boolean; user?: any; wallet?: any; role?: string }): Promise<void> {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      // Also sync user profile to Firebase Firestore if present
      if (sessionData.user?.id) {
        firebaseService.saveUser(sessionData.user).catch(() => {});
      }
    } catch (err) {
      console.warn('[API] Session save warning:', err);
    }
  },

  // 1. REGISTER USER IN CLOUD SQL & FIREBASE
  async registerUser(userData: Partial<ManagedUser> & { password?: string }): Promise<{ success: boolean; user?: ManagedUser; error?: string }> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      if (data.user) {
        firebaseService.saveUser(data.user).catch(() => {});
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      console.warn('[API] Register fallback warning:', err);
      return { success: false, error: err.message };
    }
  },

  // 2. LOGIN USER FROM CLOUD SQL & FIREBASE
  async loginUser(usernameOrEmail: string, password?: string): Promise<{ success: boolean; user?: ManagedUser; error?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      if (data.user) {
        firebaseService.saveUser(data.user).catch(() => {});
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      console.warn('[API] Login fallback warning:', err);
      return { success: false, error: err.message };
    }
  },

  // 3. FETCH ALL USERS FROM CLOUD SQL / FIREBASE
  async fetchUsers(): Promise<ManagedUser[]> {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (response.ok && data.users && data.users.length > 0) {
        return data.users;
      }
      // Firestore fallback
      const firestoreUsers = await firebaseService.getAllUsers();
      if (firestoreUsers.length > 0) {
        return firestoreUsers;
      }
      return [];
    } catch (err) {
      console.warn('[API] Failed to fetch users:', err);
      return [];
    }
  },

  // 3.1 FETCH SINGLE USER BY ID
  async fetchUserById(userId: string): Promise<ManagedUser | null> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (response.ok && data.user) {
        return data.user;
      }
      return await firebaseService.getUser(userId);
    } catch (err) {
      console.warn('[API] Failed to fetch user by id:', err);
      return null;
    }
  },

  // 4. UPDATE USER IN CLOUD SQL & FIREBASE
  async updateUser(userId: string, updates: Partial<ManagedUser>): Promise<boolean> {
    try {
      // Sync to Firebase
      firebaseService.saveUser({ id: userId, ...updates }).catch(() => {});
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to update user:', err);
      return false;
    }
  },

  // 5. TRANSACTIONS
  async fetchTransactions(): Promise<TransactionItem[]> {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (response.ok && data.transactions && data.transactions.length > 0) {
        return data.transactions;
      }
      return await firebaseService.getAllTransactions();
    } catch (err) {
      console.warn('[API] Failed to fetch transactions:', err);
      return [];
    }
  },

  async createTransaction(tx: Partial<TransactionItem>): Promise<TransactionItem | null> {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      const data = await response.json();
      if (response.ok && data.transaction) {
        firebaseService.saveTransaction(data.transaction).catch(() => {});
        return data.transaction;
      }
      if (tx.id) {
        firebaseService.saveTransaction(tx as TransactionItem).catch(() => {});
      }
      return (tx as TransactionItem) || null;
    } catch (err) {
      console.warn('[API] Failed to save transaction:', err);
      return null;
    }
  },

  async updateTransaction(txId: string, status: string, note?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/transactions/${txId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to update transaction:', err);
      return false;
    }
  },

  // 6. KYC REQUESTS
  async fetchKycRequests(): Promise<KycRequestData[]> {
    try {
      const response = await fetch('/api/kyc');
      const data = await response.json();
      if (response.ok && data.requests) {
        return data.requests;
      }
      return [];
    } catch (err) {
      console.warn('[API] Failed to fetch KYC requests:', err);
      return [];
    }
  },

  async submitKyc(kycData: KycRequestData): Promise<boolean> {
    try {
      firebaseService.saveKyc(kycData).catch(() => {});
      const response = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kycData),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to submit KYC:', err);
      return false;
    }
  },

  async updateKycStatus(kycId: string, status: 'verified' | 'rejected', userId?: string, rejectionReason?: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/kyc/${kycId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, userId, rejectionReason }),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to update KYC:', err);
      return false;
    }
  },

  // 7. LOANS
  async fetchLoans(): Promise<LoanData[]> {
    try {
      const response = await fetch('/api/loans');
      const data = await response.json();
      if (response.ok && data.loans) {
        return data.loans;
      }
      return [];
    } catch (err) {
      console.warn('[API] Failed to fetch loans:', err);
      return [];
    }
  },

  async createLoan(loan: Partial<LoanData>): Promise<boolean> {
    try {
      if (loan.id) {
        firebaseService.saveLoan(loan as LoanData).catch(() => {});
      }
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loan),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to save loan:', err);
      return false;
    }
  },

  // 8. SETTINGS
  async fetchSettings(): Promise<Record<string, any>> {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (response.ok && data.settings) {
        return data.settings;
      }
      return {};
    } catch (err) {
      console.warn('[API] Failed to fetch settings:', err);
      return {};
    }
  },

  async saveSetting(key: string, value: any): Promise<boolean> {
    try {
      firebaseService.saveSetting(key, value).catch(() => {});
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to save setting:', err);
      return false;
    }
  }
};
