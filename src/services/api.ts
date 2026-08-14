import { ManagedUser, TransactionItem, KycRequestData, LoanData } from '../types';

export const api = {
  // 1. REGISTER USER IN CLOUD SQL
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
      return { success: true, user: data.user };
    } catch (err: any) {
      console.warn('[API] Cloud SQL register fallback warning:', err);
      return { success: false, error: err.message };
    }
  },

  // 2. LOGIN USER FROM CLOUD SQL
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
      return { success: true, user: data.user };
    } catch (err: any) {
      console.warn('[API] Cloud SQL login fallback warning:', err);
      return { success: false, error: err.message };
    }
  },

  // 3. FETCH ALL USERS FROM CLOUD SQL
  async fetchUsers(): Promise<ManagedUser[]> {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (response.ok && data.users) {
        return data.users;
      }
      return [];
    } catch (err) {
      console.warn('[API] Failed to fetch users from Cloud SQL:', err);
      return [];
    }
  },

  // 3.1 FETCH SINGLE USER BY ID FROM CLOUD SQL
  async fetchUserById(userId: string): Promise<ManagedUser | null> {
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      if (response.ok && data.user) {
        return data.user;
      }
      return null;
    } catch (err) {
      console.warn('[API] Failed to fetch user by id from Cloud SQL:', err);
      return null;
    }
  },

  // 4. UPDATE USER IN CLOUD SQL
  async updateUser(userId: string, updates: Partial<ManagedUser>): Promise<boolean> {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to update user in Cloud SQL:', err);
      return false;
    }
  },

  // 5. TRANSACTIONS
  async fetchTransactions(): Promise<TransactionItem[]> {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (response.ok && data.transactions) {
        return data.transactions;
      }
      return [];
    } catch (err) {
      console.warn('[API] Failed to fetch transactions from Cloud SQL:', err);
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
        return data.transaction;
      }
      return null;
    } catch (err) {
      console.warn('[API] Failed to save transaction in Cloud SQL:', err);
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
      console.warn('[API] Failed to update transaction in Cloud SQL:', err);
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
      console.warn('[API] Failed to fetch KYC requests from Cloud SQL:', err);
      return [];
    }
  },

  async submitKyc(kycData: KycRequestData): Promise<boolean> {
    try {
      const response = await fetch('/api/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kycData),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to submit KYC to Cloud SQL:', err);
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
      console.warn('[API] Failed to update KYC in Cloud SQL:', err);
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
      console.warn('[API] Failed to fetch loans from Cloud SQL:', err);
      return [];
    }
  },

  async createLoan(loan: Partial<LoanData>): Promise<boolean> {
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loan),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to save loan in Cloud SQL:', err);
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
      console.warn('[API] Failed to fetch settings from Cloud SQL:', err);
      return {};
    }
  },

  async saveSetting(key: string, value: any): Promise<boolean> {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      return response.ok;
    } catch (err) {
      console.warn('[API] Failed to save setting in Cloud SQL:', err);
      return false;
    }
  }
};
