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
exports.getOrgProjectsBySlug = exports.getOrgMembersBySlug = exports.getOrgBySlug = exports.createOrg = exports.getOrgsByClerkId = void 0;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getOrgsByClerkId = (clerkId) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db_1.db
        .select({
        id: schema_1.orgs.id,
        name: schema_1.orgs.name,
        slug: schema_1.orgs.slug,
        role: schema_1.orgMembers.role,
        createdAt: schema_1.orgs.createdAt,
    })
        .from(schema_1.orgMembers)
        .innerJoin(schema_1.orgs, (0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.orgs.id))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId))
        .where((0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.orgs.createdAt));
    // Get member and project counts for each org
    const orgsWithCounts = yield Promise.all(rows.map((org) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const [memberCountResult, projectCountResult] = yield Promise.all([
            db_1.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema_1.orgMembers)
                .where((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, org.id)),
            db_1.db
                .select({ count: (0, drizzle_orm_1.count)() })
                .from(schema_1.projects)
                .where((0, drizzle_orm_1.eq)(schema_1.projects.orgId, org.id)),
        ]);
        return Object.assign(Object.assign({}, org), { memberCount: ((_a = memberCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0, projectCount: ((_b = projectCountResult[0]) === null || _b === void 0 ? void 0 : _b.count) || 0 });
    })));
    return orgsWithCounts;
});
exports.getOrgsByClerkId = getOrgsByClerkId;
const createOrg = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrg = yield db_1.db
        .insert(schema_1.orgs)
        .values({
        name: data.name,
        slug: data.slug,
    })
        .returning();
    return newOrg;
});
exports.createOrg = createOrg;
const getOrgBySlug = (slug, clerkId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const orgResult = yield db_1.db
        .select({
        id: schema_1.orgs.id,
        name: schema_1.orgs.name,
        slug: schema_1.orgs.slug,
        createdAt: schema_1.orgs.createdAt,
        userRole: schema_1.orgMembers.role,
    })
        .from(schema_1.orgs)
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId)) // Fixed: need to join users table
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgs.slug, slug), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId) // Fixed: should filter by users.clerkId
    ))
        .limit(1);
    if (!orgResult || orgResult.length === 0) {
        return null;
    }
    const org = orgResult[0];
    // Get member count
    const memberCountResult = yield db_1.db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(schema_1.orgMembers)
        .where((0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, org.id));
    // Get project count
    const projectCountResult = yield db_1.db
        .select({ count: (0, drizzle_orm_1.count)() })
        .from(schema_1.projects)
        .where((0, drizzle_orm_1.eq)(schema_1.projects.orgId, org.id));
    return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        createdAt: org.createdAt,
        role: org.userRole,
        memberCount: ((_a = memberCountResult[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
        projectCount: ((_b = projectCountResult[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
    };
});
exports.getOrgBySlug = getOrgBySlug;
const getOrgMembersBySlug = (slug, clerkId) => __awaiter(void 0, void 0, void 0, function* () {
    // First verify user is member of organization
    const userMembership = yield db_1.db
        .select({ orgId: schema_1.orgs.id })
        .from(schema_1.orgs)
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId)) // Fixed: need to join users table
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgs.slug, slug), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId) // Fixed: should filter by users.clerkId
    ))
        .limit(1);
    if (!userMembership || userMembership.length === 0) {
        return null;
    }
    // Get all members of the organization
    const members = yield db_1.db
        .select({
        id: schema_1.orgMembers.id,
        userId: schema_1.users.clerkId,
        email: schema_1.users.email,
        firstName: schema_1.users.firstName,
        lastName: schema_1.users.lastName,
        imageUrl: schema_1.users.imageUrl,
        role: schema_1.orgMembers.role,
        joinedAt: schema_1.orgMembers.createdAt, // Fixed: renamed from createdAt to joinedAt for clarity
    })
        .from(schema_1.orgMembers)
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId))
        .innerJoin(schema_1.orgs, (0, drizzle_orm_1.eq)(schema_1.orgMembers.orgId, schema_1.orgs.id))
        .where((0, drizzle_orm_1.eq)(schema_1.orgs.slug, slug))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.orgMembers.createdAt));
    return members;
});
exports.getOrgMembersBySlug = getOrgMembersBySlug;
const getOrgProjectsBySlug = (slug, clerkId) => __awaiter(void 0, void 0, void 0, function* () {
    // First verify user is member of organization
    const userMembership = yield db_1.db
        .select({ orgId: schema_1.orgs.id })
        .from(schema_1.orgs)
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId)) // Fixed: need to join users table
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.orgs.slug, slug), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId) // Fixed: should filter by users.clerkId
    ))
        .limit(1);
    if (!userMembership || userMembership.length === 0) {
        return null;
    }
    const orgId = userMembership[0].orgId;
    // Get all projects for the organization
    const orgProjects = yield db_1.db
        .select({
        id: schema_1.projects.id,
        orgId: schema_1.projects.orgId, // Added orgId to response
        name: schema_1.projects.name,
        domain: schema_1.projects.domain,
        embedKey: schema_1.projects.embedKey,
        createdAt: schema_1.projects.createdAt,
    })
        .from(schema_1.projects)
        .where((0, drizzle_orm_1.eq)(schema_1.projects.orgId, orgId))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.projects.createdAt));
    return orgProjects;
});
exports.getOrgProjectsBySlug = getOrgProjectsBySlug;
