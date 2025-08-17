import { db } from "@/db";
import { orgMembers, orgs, users, projects } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export const getOrgsByClerkId = async (clerkId: string) => {
  const rows = await db
    .select({
      id: orgs.id,
      name: orgs.name,
      slug: orgs.slug,
      role: orgMembers.role,
      createdAt: orgs.createdAt,
    })
    .from(orgMembers)
    .innerJoin(orgs, eq(orgMembers.orgId, orgs.id))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId))
    .where(eq(users.clerkId, clerkId))
    .orderBy(desc(orgs.createdAt));

  return rows;
};

export const createOrg = async (data: { name: string; slug: string; createdBy: string }) => {
  const newOrg = await db
    .insert(orgs)
    .values({
      name: data.name,
      slug: data.slug,
    })
    .returning();

  return newOrg;
};

export const getOrgBySlug = async (slug: string, clerkId: string) => {
  const orgResult = await db
    .select({
      id: orgs.id,
      name: orgs.name,
      slug: orgs.slug,
      createdAt: orgs.createdAt,
      userRole: orgMembers.role,
    })
    .from(orgs)
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId)) // Fixed: need to join users table
    .where(
      and(
        eq(orgs.slug, slug),
        eq(users.clerkId, clerkId) // Fixed: should filter by users.clerkId
      )
    )
    .limit(1);

  if (!orgResult || orgResult.length === 0) {
    return null;
  }

  const org = orgResult[0];

  // Get member count
  const memberCountResult = await db
    .select({ count: count() })
    .from(orgMembers)
    .where(eq(orgMembers.orgId, org.id));

  // Get project count
  const projectCountResult = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.orgId, org.id));

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    createdAt: org.createdAt,
    role: org.userRole,
    memberCount: memberCountResult[0]?.count || 0,
    projectCount: projectCountResult[0]?.count || 0,
  };
};

export const getOrgMembersBySlug = async (slug: string, clerkId: string) => {
  // First verify user is member of organization
  const userMembership = await db
    .select({ orgId: orgs.id })
    .from(orgs)
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId)) // Fixed: need to join users table
    .where(
      and(
        eq(orgs.slug, slug),
        eq(users.clerkId, clerkId) // Fixed: should filter by users.clerkId
      )
    )
    .limit(1);

  if (!userMembership || userMembership.length === 0) {
    return null;
  }

  // Get all members of the organization
  const members = await db
    .select({
      id: orgMembers.id,
      userId: users.clerkId,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      imageUrl: users.imageUrl,
      role: orgMembers.role,
      joinedAt: orgMembers.createdAt, // Fixed: renamed from createdAt to joinedAt for clarity
    })
    .from(orgMembers)
    .innerJoin(users, eq(orgMembers.userId, users.clerkId))
    .innerJoin(orgs, eq(orgMembers.orgId, orgs.id))
    .where(eq(orgs.slug, slug))
    .orderBy(desc(orgMembers.createdAt));

  return members;
};

export const getOrgProjectsBySlug = async (slug: string, clerkId: string) => {
  // First verify user is member of organization
  const userMembership = await db
    .select({ orgId: orgs.id })
    .from(orgs)
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId)) // Fixed: need to join users table
    .where(
      and(
        eq(orgs.slug, slug),
        eq(users.clerkId, clerkId) // Fixed: should filter by users.clerkId
      )
    )
    .limit(1);

  if (!userMembership || userMembership.length === 0) {
    return null;
  }

  const orgId = userMembership[0].orgId;

  // Get all projects for the organization
  const orgProjects = await db
    .select({
      id: projects.id,
      orgId: projects.orgId, // Added orgId to response
      name: projects.name,
      domain: projects.domain,
      embedKey: projects.embedKey,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.orgId, orgId))
    .orderBy(desc(projects.createdAt));

  return orgProjects;
};