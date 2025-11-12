"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserToDb = syncUserToDb;
exports.deleteUserFromDb = deleteUserFromDb;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function syncUserToDb(data) {
    // Email is required in schema, so we need to ensure it's not null
    if (!data.email) {
        throw new Error(`Email is required for user ${data.clerkId}`);
    }
    // TypeScript now knows email is string (not null) after the check
    const email = data.email;
    const existingUser = await db_1.db
        .select()
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, data.clerkId))
        .limit(1);
    if (existingUser.length > 0) {
        const [updated] = await db_1.db
            .update(schema_1.users)
            .set({
            firstName: data.firstName,
            lastName: data.lastName,
            imageUrl: data.imageUrl,
            email: email,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, data.clerkId))
            .returning();
        return updated;
    }
    const [created] = await db_1.db
        .insert(schema_1.users)
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
async function deleteUserFromDb(clerkId) {
    const [deleted] = await db_1.db
        .delete(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId))
        .returning();
    return deleted;
}
