// Example schema (adjust it according to your actual setup)
import { integer, pgTable, varchar,serial } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
});
