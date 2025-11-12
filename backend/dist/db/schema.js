"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonials = exports.projects = exports.orgMembers = exports.orgs = exports.users = exports.roleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.roleEnum = (0, pg_core_1.pgEnum)("role", ["owner", "admin", "member"]);
exports.users = (0, pg_core_1.pgTable)("users", {
    clerkId: (0, pg_core_1.varchar)("clerk_id").primaryKey(), // Clerk ID as PK
    email: (0, pg_core_1.text)("email").notNull().unique(),
    firstName: (0, pg_core_1.text)("first_name"),
    lastName: (0, pg_core_1.text)("last_name"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.orgs = (0, pg_core_1.pgTable)("orgs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    slug: (0, pg_core_1.varchar)("slug", { length: 64 }).notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.orgMembers = (0, pg_core_1.pgTable)("org_members", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    orgId: (0, pg_core_1.uuid)("org_id").notNull().references(() => exports.orgs.id, { onDelete: "cascade" }),
    userId: (0, pg_core_1.varchar)("user_id").notNull().references(() => exports.users.clerkId, { onDelete: "cascade" }),
    role: (0, exports.roleEnum)("role").default("member").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.projects = (0, pg_core_1.pgTable)("projects", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    orgId: (0, pg_core_1.uuid)("org_id").notNull().references(() => exports.orgs.id, { onDelete: "cascade" }),
    name: (0, pg_core_1.text)("name").notNull(),
    domain: (0, pg_core_1.text)("domain"),
    embedKey: (0, pg_core_1.varchar)("embed_key", { length: 64 }).notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.testimonials = (0, pg_core_1.pgTable)("testimonials", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    projectId: (0, pg_core_1.uuid)("project_id").notNull().references(() => exports.projects.id, { onDelete: "cascade" }),
    embedKey: (0, pg_core_1.varchar)("embed_key", { length: 64 }).notNull().unique(), // Unique embed key for each testimonial form
    formConfig: (0, pg_core_1.text)("form_config"), // JSON string for form field configuration
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email"),
    company: (0, pg_core_1.text)("company"),
    role: (0, pg_core_1.text)("role"),
    imageUrl: (0, pg_core_1.text)("image_url"),
    rating: (0, pg_core_1.text)("rating"), // Can be "1" to "5" or null
    testimonial: (0, pg_core_1.text)("testimonial").notNull(), // Main testimonial text
    customFields: (0, pg_core_1.text)("custom_fields"), // JSON string for flexible fields
    isPublished: (0, pg_core_1.text)("is_published").default("false").notNull(), // "true" or "false"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
