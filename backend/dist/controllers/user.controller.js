"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUserToDb = syncUserToDb;
exports.deleteUserFromDb = deleteUserFromDb;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
function syncUserToDb(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Email is required in schema, so we need to ensure it's not null
        if (!data.email) {
            throw new Error(`Email is required for user ${data.clerkId}`);
        }
        // TypeScript now knows email is string (not null) after the check
        const email = data.email;
        const existingUser = yield db_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, data.clerkId))
            .limit(1);
        if (existingUser.length > 0) {
            const [updated] = yield db_1.db
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
        const [created] = yield db_1.db
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
    });
}
function deleteUserFromDb(clerkId) {
    return __awaiter(this, void 0, void 0, function* () {
        const [deleted] = yield db_1.db
            .delete(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId))
            .returning();
        return deleted;
    });
}
