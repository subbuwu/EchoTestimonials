import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface SyncUserData {
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  email: string | null;
}

export async function syncUserToDb(data: SyncUserData) {
  // Email is required in schema, so we need to ensure it's not null
  if (!data.email) {
    throw new Error(`Email is required for user ${data.clerkId}`);
  }

  // TypeScript now knows email is string (not null) after the check
  const email: string = data.email;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, data.clerkId))
    .limit(1);

  if (existingUser.length > 0) {
    const [updated] = await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
        email: email,
      })
      .where(eq(users.clerkId, data.clerkId))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(users)
    .values({
      clerkId: data.clerkId,
      firstName: data.firstName,
      lastName: data.lastName,
      imageUrl: data.imageUrl,
      email: email,
    })
    .returning();

  return created;
}

export async function deleteUserFromDb(clerkId: string) {
  const [deleted] = await db
    .delete(users)
    .where(eq(users.clerkId, clerkId))
    .returning();
  return deleted;
}
