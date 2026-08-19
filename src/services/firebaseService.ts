import { db, auth } from '../firebase';
import { 
  collection, doc, setDoc, getDoc, getDocs, updateDoc, 
  deleteDoc, query, orderBy, limit, serverTimestamp 
} from 'firebase/firestore';
import { ManagedUser, TransactionItem, KycRequestData, LoanData } from '../types';

export const firebaseService = {
  // 1. USER OPERATIONS
  async saveUser(user: Partial<ManagedUser> & { id: string }): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] Save user error:', err);
    }
  },

  async getUser(userId: string): Promise<ManagedUser | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as ManagedUser;
      }
      return null;
    } catch (err) {
      console.warn('[Firebase] Get user error:', err);
      return null;
    }
  },

  async getAllUsers(): Promise<ManagedUser[]> {
    try {
      const usersCol = collection(db, 'users');
      const snap = await getDocs(usersCol);
      const list: ManagedUser[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as ManagedUser);
      });
      return list;
    } catch (err) {
      console.warn('[Firebase] Get all users error:', err);
      return [];
    }
  },

  // 2. TRANSACTION LOGS
  async saveTransaction(tx: TransactionItem): Promise<void> {
    try {
      const txRef = doc(db, 'transactions', tx.id);
      await setDoc(txRef, {
        ...tx,
        syncedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] Save transaction error:', err);
    }
  },

  async getAllTransactions(): Promise<TransactionItem[]> {
    try {
      const txCol = collection(db, 'transactions');
      const snap = await getDocs(txCol);
      const list: TransactionItem[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as TransactionItem);
      });
      return list;
    } catch (err) {
      console.warn('[Firebase] Get all transactions error:', err);
      return [];
    }
  },

  // 3. KYC SUBMISSIONS
  async saveKyc(kyc: KycRequestData): Promise<void> {
    try {
      const kycRef = doc(db, 'kyc', kyc.id);
      await setDoc(kycRef, {
        ...kyc,
        syncedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] Save KYC error:', err);
    }
  },

  // 4. LOAN DATA
  async saveLoan(loan: LoanData): Promise<void> {
    try {
      const loanRef = doc(db, 'loans', loan.id);
      await setDoc(loanRef, {
        ...loan,
        syncedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] Save loan error:', err);
    }
  },

  // 5. GLOBAL SETTINGS & WALLETS
  async saveSetting(key: string, value: any): Promise<void> {
    try {
      const settingRef = doc(db, 'settings', key);
      const strVal = typeof value === 'string' ? value : JSON.stringify(value);
      await setDoc(settingRef, {
        key,
        value: strVal,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firebase] Save setting error:', err);
    }
  },

  async getSetting(key: string): Promise<any | null> {
    try {
      const settingRef = doc(db, 'settings', key);
      const snap = await getDoc(settingRef);
      if (snap.exists()) {
        const data = snap.data();
        try {
          return JSON.parse(data.value);
        } catch {
          return data.value;
        }
      }
      return null;
    } catch (err) {
      console.warn('[Firebase] Get setting error:', err);
      return null;
    }
  }
};
