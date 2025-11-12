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
exports.createProject = createProject;
exports.getProjectById = getProjectById;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const utils_1 = require("@/utils");
const drizzle_orm_1 = require("drizzle-orm");
function createProject(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, domain, orgId }) {
        const project = yield db_1.db
            .insert(schema_1.projects)
            .values({
            name,
            domain: domain.trim() || null,
            embedKey: (0, utils_1.generateEmbedKey)(),
            orgId
        })
            .returning();
        return project[0];
    });
}
function getProjectById(id, clerkId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get project with org info and verify user has access
        const result = yield db_1.db
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
    });
}
