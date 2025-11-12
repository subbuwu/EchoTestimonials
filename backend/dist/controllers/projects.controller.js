"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
exports.getProjectById = getProjectById;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const utils_1 = require("@/utils");
const drizzle_orm_1 = require("drizzle-orm");
async function createProject({ name, domain, orgId }) {
    const project = await db_1.db
        .insert(schema_1.projects)
        .values({
        name,
        domain: domain.trim() || null,
        embedKey: (0, utils_1.generateEmbedKey)(),
        orgId
    })
        .returning();
    return project[0];
}
async function getProjectById(id, clerkId) {
    // Get project with org info and verify user has access
    const result = await db_1.db
        .select({
        id: schema_1.projects.id,
        orgId: schema_1.projects.orgId,
        name: schema_1.projects.name,
        domain: schema_1.projects.domain,
        embedKey: schema_1.projects.embedKey,
        createdAt: schema_1.projects.createdAt,
        orgName: schema_1.orgs.name,
        orgSlug: schema_1.orgs.slug,
    })
        .from(schema_1.projects)
        .innerJoin(schema_1.orgs, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.orgs.id))
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.projects.id, id), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId)))
        .limit(1);
    if (!result || result.length === 0) {
        return null;
    }
    return result[0];
}
