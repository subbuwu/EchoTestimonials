import { pgTable, varchar, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);

export const users = pgTable("users", {
  clerkId: varchar("clerk_id").primaryKey(),  // Clerk ID as PK
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orgs = pgTable("orgs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orgMembers = pgTable("org_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.clerkId, { onDelete: "cascade" }),
  role: roleEnum("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").notNull().references(() => orgs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  domain: text("domain"),
  embedKey: varchar("embed_key", { length: 64 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  embedKey: varchar("embed_key", { length: 64 }).notNull().unique(), // Unique embed key for each testimonial form
  formConfig: text("form_config"), // JSON string for form field configuration
  name: text("name").notNull(),
  email: text("email"),
  company: text("company"),
  role: text("role"),
  imageUrl: text("image_url"),
  rating: text("rating"), // Can be "1" to "5" or null
  testimonial: text("testimonial").notNull(), // Main testimonial text
  customFields: text("custom_fields"), // JSON string for flexible fields
  isPublished: text("is_published").default("false").notNull(), // "true" or "false"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});