import { db } from '../db';
import { sql } from 'drizzle-orm';

export const checkDBConnection = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('Database connection successful !!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};
