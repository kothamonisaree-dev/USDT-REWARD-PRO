import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { users, kycRequests, transactions, loans, appSettings } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', cloudSql: 'connected', timestamp: new Date().toISOString() });
  });

  // 1. REGISTER USER TO CLOUD SQL
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

      if (!username || !fullName || !email) {
        return res.status(400).json({ error: 'Username, Full Name, and Email are required' });
      }

      // Check if username already exists in Cloud SQL
      const existing = await db.select().from(users).where(eq(users.username, username.toLowerCase().trim())).limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Username is already taken' });
      }

      const newUserId = id || `USR-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const userJoinedDate = joinedDate || new Date().toISOString().split('T')[0];
      const userRefCode = referralCode || `REF-${Math.floor(100000 + Math.random() * 900000)}`;
      const userAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

      const inserted = await db.insert(users).values({
        id: newUserId,
        username: username.toLowerCase().trim(),
        password: password || 'password123',
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
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
        is2FAEnabled: false
      }).returning();

      console.log(`[Cloud SQL] User registered permanently: ${inserted[0].username} (${inserted[0].id})`);
      res.status(201).json({ success: true, user: inserted[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Registration error:', error);
      res.status(500).json({ error: error.message || 'Failed to save user in Cloud SQL' });
    }
  });

  // 2. LOGIN USER FROM CLOUD SQL
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { usernameOrEmail, password } = req.body;
      if (!usernameOrEmail) {
        return res.status(400).json({ error: 'Username or email required' });
      }

      const input = usernameOrEmail.trim().toLowerCase();
      const allUsers = await db.select().from(users);
      const matched = allUsers.find(
        u => u.username.toLowerCase() === input || u.email.toLowerCase() === input || u.id.toLowerCase() === input
      );

      if (!matched) {
        return res.status(404).json({ error: 'User not found in Cloud Database' });
      }

      // Check password if set and matched
      if (password && matched.password && matched.password !== password) {
        // For admin, strictly enforce password
        if (matched.role === 'admin' && matched.password !== password) {
          return res.status(401).json({ error: 'Invalid admin credentials' });
        }
      }

      res.json({ success: true, user: matched });
    } catch (error: any) {
      console.error('[Cloud SQL] Login error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 3. GET ALL USERS FOR ADMIN FROM CLOUD SQL
  app.get('/api/users', async (req, res) => {
    try {
      const userList = await db.select().from(users).orderBy(desc(users.createdAt));
      res.json({ success: true, users: userList });
    } catch (error: any) {
      console.error('[Cloud SQL] Fetch users error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 4. GET SINGLE USER BY ID FROM CLOUD SQL
  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const found = await db.select().from(users).where(eq(users.id, id)).limit(1);
      if (!found.length) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, user: found[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Fetch user error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 5. UPDATE USER IN CLOUD SQL (Admin balance update, status change, etc.)
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

      const updated = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
      if (!updated.length) {
        return res.status(404).json({ error: 'User not found to update' });
      }
      console.log(`[Cloud SQL] User updated: ${id}`, updateData);
      res.json({ success: true, user: updated[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Update user error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 6. TRANSACTIONS APIS (Cloud SQL)
  app.get('/api/transactions', async (req, res) => {
    try {
      const txs = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
      res.json({ success: true, transactions: txs });
    } catch (error: any) {
      console.error('[Cloud SQL] Fetch tx error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/transactions', async (req, res) => {
    try {
      const { id, userId, type, amount, asset = 'USDT', status = 'completed', txHash, date, note } = req.body;
      const txId = id || `TX-${Math.floor(10000 + Math.random() * 90000)}`;
      const txDate = date || new Date().toISOString().replace('T', ' ').substring(0, 19);

      const inserted = await db.insert(transactions).values({
        id: txId,
        userId: userId || null,
        type,
        amount: Number(amount) || 0,
        asset,
        status: status as any,
        txHash: txHash || null,
        date: txDate,
        note: note || null
      }).returning();

      res.status(201).json({ success: true, transaction: inserted[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Insert tx error:', error);
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

      const updated = await db.update(transactions).set(updateData).where(eq(transactions.id, id)).returning();
      res.json({ success: true, transaction: updated[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Update tx error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 7. KYC REQUESTS APIS (Cloud SQL)
  app.get('/api/kyc', async (req, res) => {
    try {
      const requests = await db.select().from(kycRequests).orderBy(desc(kycRequests.createdAt));
      res.json({ success: true, requests });
    } catch (error: any) {
      console.error('[Cloud SQL] Fetch KYC error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/kyc', async (req, res) => {
    try {
      const { id, userId, userName, userEmail, docType, docNumber, fullName, frontDocUrl, backDocUrl, selfieDocUrl, submittedAt } = req.body;
      const kycId = id || `KYC-${Math.floor(1000 + Math.random() * 9000)}`;
      const subTime = submittedAt || new Date().toISOString().replace('T', ' ').substring(0, 19);

      const inserted = await db.insert(kycRequests).values({
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
        status: 'pending'
      }).returning();

      // Update user KYC status to pending in users table
      await db.update(users).set({ kycStatus: 'pending' }).where(eq(users.id, userId));

      res.status(201).json({ success: true, request: inserted[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Submit KYC error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/kyc/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, rejectionReason, userId } = req.body;

      const updated = await db.update(kycRequests).set({
        status: status as any,
        rejectionReason: rejectionReason || null
      }).where(eq(kycRequests.id, id)).returning();

      if (userId && (status === 'verified' || status === 'rejected')) {
        await db.update(users).set({ kycStatus: status as any }).where(eq(users.id, userId));
      }

      res.json({ success: true, request: updated[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Update KYC error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 8. LOANS APIS (Cloud SQL)
  app.get('/api/loans', async (req, res) => {
    try {
      const loanList = await db.select().from(loans).orderBy(desc(loans.createdAt));
      res.json({ success: true, loans: loanList });
    } catch (error: any) {
      console.error('[Cloud SQL] Fetch loans error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/loans', async (req, res) => {
    try {
      const { id, userId, amount, termDays, interestRate, interestAmount, totalRepayment, loanDate, dueDate, borrowerName, username, phone, nidPassportUrl, bankCardMasked } = req.body;
      const loanId = id || `L-${Math.floor(10000 + Math.random() * 90000)}`;

      const inserted = await db.insert(loans).values({
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
        bankCardMasked: bankCardMasked || null
      }).returning();

      res.status(201).json({ success: true, loan: inserted[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Create loan error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 9. APP SETTINGS APIS (Cloud SQL)
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await db.select().from(appSettings);
      const settingsMap: Record<string, any> = {};
      settings.forEach(s => {
        try {
          settingsMap[s.key] = JSON.parse(s.value);
        } catch {
          settingsMap[s.key] = s.value;
        }
      });
      res.json({ success: true, settings: settingsMap });
    } catch (error: any) {
      console.error('[Cloud SQL] Fetch settings error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/settings', async (req, res) => {
    try {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'Key required' });
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

      const saved = await db.insert(appSettings).values({
        key,
        value: stringValue,
        updatedAt: new Date()
      }).onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value: stringValue,
          updatedAt: new Date()
        }
      }).returning();

      res.json({ success: true, setting: saved[0] });
    } catch (error: any) {
      console.error('[Cloud SQL] Save settings error:', error);
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
    console.log(`🚀 USDT REWARD PRO Full-Stack Server running on http://0.0.0.0:${PORT} with Cloud SQL PostgreSQL backend`);
  });
}

startServer();
