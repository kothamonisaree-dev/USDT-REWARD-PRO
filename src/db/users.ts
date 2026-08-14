import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(id: string, email: string, username?: string, fullName?: string) {
  try {
    const result = await db.insert(users)
      .values({
        id,
        email,
        username: username || email.split('@')[0] || id,
        fullName: fullName || 'User',
        joinedDate: new Date().toISOString().split('T')[0],
        referralCode: `REF-${Math.floor(100000 + Math.random() * 900000)}`
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Failed to get or create user:", error);
    throw new Error("Database operation failed", { cause: error });
  }
}
