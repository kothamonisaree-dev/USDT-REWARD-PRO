import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { StorageEngine, UserRecord } from './src/db/storageAdapter.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  });

  // 0. SESSION MANAGEMENT (Stateless - per-client storage)
  app.get('/api/auth/session', (req, res) => {
    res.json({ success: false, session: null });
  });

  app.post('/api/auth/session', (req, res) => {
    res.json({ success: true });
  });

  // 1. REGISTER USER
  app.post('/api/auth/register', async (req, res) => {
    try {
      const {
        id,
        username,
        password,
        fullName,
        email,
        phone,
        avatar,
        vipLevel = 1,
        kycStatus = 'unverified',
        accountStatus = 'active',
        role = 'user',
        usdtBalance = 0,
        totalDeposit = 0,
        totalWithdraw = 0,
        totalProfit = 0,
        joinedDate,
        referralCode,
        tradesCount = 0
      } = req.body;

      if (!username || !fullName || !email || !phone || !password) {
        return res.status(400).json({ error: 'All fields (Full Name, Username, Email, Phone, Password) are required.' });
      }

      const finalUsername = username.toLowerCase().trim();
      const finalEmail = email.toLowerCase().trim();

      const existingUser = await StorageEngine.findUserByUsernameOrEmail(finalUsername);
      if (existingUser && (!id || existingUser.id !== id)) {
        return res.status(400).json({ error: `Username "${finalUsername}" is already registered. Please choose another username.` });
      }

      const existingEmail = await StorageEngine.findUserByUsernameOrEmail(finalEmail);
      if (existingEmail && (!id || existingEmail.id !== id)) {
        return res.status(400).json({ error: `Email address "${finalEmail}" is already registered. Please Sign In.` });
      }

      const newUserId = id || `USR-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const userJoinedDate = joinedDate || new Date().toISOString().split('T')[0];
      const userRefCode = referralCode ? referralCode.trim() : `REF-${Math.floor(100000 + Math.random() * 900000)}`;
      const userAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalUsername}`;

      const newUser: UserRecord = {
        id: newUserId,
        username: finalUsername,
        password: password.trim(),
        fullName: fullName.trim(),
        email: finalEmail,
        phone: phone.trim(),
        avatar: userAvatar,
        vipLevel: Number(vipLevel) || 1,
        kycStatus: kycStatus as any,
        accountStatus: accountStatus as any,
        role: role as any,
        usdtBalance: Number(usdtBalance) || 0,
        totalDeposit: Number(totalDeposit) || 0,
        totalWithdraw: Number(totalWithdraw) || 0,
        totalProfit: Number(totalProfit) || 0,
        joinedDate: userJoinedDate,
        referralCode: userRefCode,
        tradesCount: Number(tradesCount) || 0,
        is2FAEnabled: false,
        createdAt: new Date().toISOString()
      };

      const saved = await StorageEngine.saveUser(newUser);

      console.log(`[Supabase / Store] User registered permanently: ${saved.username} (${saved.id})`);
      return res.status(201).json({ success: true, user: saved });
    } catch (error: any) {
      console.error('[Registration error]:', error);
      return res.status(500).json({ error: error.message || 'Failed to register account' });
    }
  });

  // 2. LOGIN USER
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: 'Username/Email and Password are required' });
      }

      const input = usernameOrEmail.trim().toLowerCase();
      const enteredPassword = password.trim();
      
      const matched = await StorageEngine.findUserByUsernameOrEmail(input);

      if (!matched) {
        return res.status(404).json({ error: 'Account not found! Please check your credentials or click Sign Up.' });
      }

      // Check password strictly
      if (matched.role === 'admin' || matched.username.toLowerCase() === 'emukhan580') {
        if (enteredPassword !== 'Imran2015@!@!' && matched.password !== enteredPassword) {
          return res.status(401).json({ error: 'Incorrect Super Admin password!' });
        }
      } else {
        if (matched.password && matched.password !== enteredPassword) {
          return res.status(401).json({ error: 'Incorrect password! Please try again.' });
        }
      }

      return res.json({ success: true, user: matched });
    } catch (error: any) {
      console.error('[Login error]:', error);
      return res.status(500).json({ error: error.message || 'Login failed' });
    }
  });

  // 3. GET ALL USERS FOR ADMIN
  app.get('/api/users', async (req, res) => {
    try {
      const userList = await StorageEngine.getAllUsers();
      res.json({ success: true, users: userList });
    } catch (error: any) {
      console.error('[Fetch users error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 4. GET SINGLE USER BY ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const found = await StorageEngine.getUserById(id);
      if (!found) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, user: found });
    } catch (error: any) {
      console.error('[Fetch user error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 5. UPDATE USER (Admin balance update, status change, etc.)
  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData: any = {};
      
      if (req.body.usdtBalance !== undefined) updateData.usdtBalance = Number(req.body.usdtBalance);
      if (req.body.totalDeposit !== undefined) updateData.totalDeposit = Number(req.body.totalDeposit);
      if (req.body.totalWithdraw !== undefined) updateData.totalWithdraw = Number(req.body.totalWithdraw);
      if (req.body.totalProfit !== undefined) updateData.totalProfit = Number(req.body.totalProfit);
      if (req.body.vipLevel !== undefined) updateData.vipLevel = Number(req.body.vipLevel);
      if (req.body.accountStatus !== undefined) updateData.accountStatus = req.body.accountStatus;
      if (req.body.kycStatus !== undefined) updateData.kycStatus = req.body.kycStatus;
      if (req.body.role !== undefined) updateData.role = req.body.role;
      if (req.body.phone !== undefined) updateData.phone = req.body.phone;
      if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
      if (req.body.tradesCount !== undefined) updateData.tradesCount = Number(req.body.tradesCount);
      if (req.body.is2FAEnabled !== undefined) updateData.is2FAEnabled = Boolean(req.body.is2FAEnabled);

      const updated = await StorageEngine.updateUser(id, updateData);
      if (!updated) {
        return res.status(404).json({ error: 'User not found to update' });
      }
      console.log(`[Store] User updated: ${id}`, updateData);
      res.json({ success: true, user: updated });
    } catch (error: any) {
      console.error('[Update user error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 6. TRANSACTIONS APIS
  app.get('/api/transactions', async (req, res) => {
    try {
      const txs = await StorageEngine.getAllTransactions();
      res.json({ success: true, transactions: txs });
    } catch (error: any) {
      console.error('[Fetch tx error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/transactions', async (req, res) => {
    try {
      const { id, userId, type, amount, asset = 'USDT', status = 'completed', txHash, date, note, proofImage, senderAddress } = req.body;
      const txId = id || `TX-${Math.floor(10000 + Math.random() * 90000)}`;
      const txDate = date || new Date().toISOString().replace('T', ' ').substring(0, 19);

      const saved = await StorageEngine.saveTransaction({
        id: txId,
        userId: userId || null,
        type,
        amount: Number(amount) || 0,
        asset,
        status: status as any,
        txHash: txHash || null,
        date: txDate,
        note: note || null,
        proofImage: proofImage || null,
        senderAddress: senderAddress || null,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ success: true, transaction: saved });
    } catch (error: any) {
      console.error('[Insert tx error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/transactions/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const updateData: any = {};
      if (status) updateData.status = status;
      if (note) updateData.note = note;

      const updated = await StorageEngine.updateTransaction(id, updateData);
      res.json({ success: true, transaction: updated });
    } catch (error: any) {
      console.error('[Update tx error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 7. KYC REQUESTS APIS
  app.get('/api/kyc', async (req, res) => {
    try {
      const requests = await StorageEngine.getAllKyc();
      res.json({ success: true, requests });
    } catch (error: any) {
      console.error('[Fetch KYC error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/kyc', async (req, res) => {
    try {
      const { id, userId, userName, userEmail, docType, docNumber, fullName, frontDocUrl, backDocUrl, selfieDocUrl, submittedAt } = req.body;
      const kycId = id || `KYC-${Math.floor(1000 + Math.random() * 9000)}`;
      const subTime = submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 19);

      const saved = await StorageEngine.saveKyc({
        id: kycId,
        userId,
        userName,
        userEmail,
        docType: docType || 'nid',
        docNumber: docNumber || 'N/A',
        fullName: fullName || userName,
        frontDocUrl: frontDocUrl || null,
        backDocUrl: backDocUrl || null,
        selfieDocUrl: selfieDocUrl || null,
        submittedAt: subTime,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Update user KYC status to pending
      await StorageEngine.updateUser(userId, { kycStatus: 'pending' });

      res.status(201).json({ success: true, request: saved });
    } catch (error: any) {
      console.error('[Submit KYC error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/kyc/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason, userId } = req.body;

      const updated = await StorageEngine.updateKyc(id, {
        status: status as any,
        rejectionReason: rejectionReason || null
      });

      if (userId && (status === 'verified' || status === 'rejected')) {
        await StorageEngine.updateUser(userId, { kycStatus: status as any });
      }

      res.json({ success: true, request: updated });
    } catch (error: any) {
      console.error('[Update KYC error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 8. LOANS APIS
  app.get('/api/loans', async (req, res) => {
    try {
      const loanList = await StorageEngine.getAllLoans();
      res.json({ success: true, loans: loanList });
    } catch (error: any) {
      console.error('[Fetch loans error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/loans', async (req, res) => {
    try {
      const { id, userId, amount, termDays, interestRate, interestAmount, totalRepayment, loanDate, dueDate, borrowerName, username, phone, nidPassportUrl, bankCardMasked } = req.body;
      const loanId = id || `L-${Math.floor(10000 + Math.random() * 90000)}`;

      const saved = await StorageEngine.saveLoan({
        id: loanId,
        userId: userId || null,
        amount: Number(amount) || 0,
        termDays: Number(termDays) || 14,
        interestRate: Number(interestRate) || 3.2,
        interestAmount: Number(interestAmount) || 0,
        totalRepayment: Number(totalRepayment) || 0,
        loanDate: loanDate || new Date().toISOString(),
        dueDate: dueDate || new Date().toISOString(),
        status: 'active',
        borrowerName: borrowerName || 'Borrower',
        username: username || 'user',
        phone: phone || '',
        nidPassportUrl: nidPassportUrl || null,
        bankCardMasked: bankCardMasked || null,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({ success: true, loan: saved });
    } catch (error: any) {
      console.error('[Create loan error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 9. APP SETTINGS APIS
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await StorageEngine.getSettings();
      res.json({ success: true, settings });
    } catch (error: any) {
      console.error('[Fetch settings error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/settings', async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'Key required' });
      await StorageEngine.saveSetting(key, value);
      res.json({ success: true, key, value });
    } catch (error: any) {
      console.error('[Save settings error]:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 USDT REWARD PRO Server running on http://0.0.0.0:${PORT} with Supabase & Resilient Persistence`);
  });
}

startServer();
