import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function syncUserToDb({
  clerkId,
  firstName,
  lastName,
  imageUrl,
  email,
}: {
  clerkId: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  email: string;
}) {
  const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId));

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const newUser = await db.insert(users).values({
    clerkId,
    firstName,
    lastName,
    imageUrl,
    email,
  }).returning();

  return newUser[0];
}
