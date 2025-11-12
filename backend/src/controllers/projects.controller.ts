import { db } from '@/db';
import { projects, orgs, orgMembers, users } from '@/db/schema';
import { generateEmbedKey } from '@/utils';
import { eq, and } from 'drizzle-orm';

export async function createProject({ name, domain, orgId }: { name: string; domain: string; orgId: string }) {
  const project = await db
    .insert(projects)
    .values({ 
      name, 
      domain: domain.trim() || null, 
      embedKey: generateEmbedKey(), 
      orgId 
    })
    .returning();
  return project[0];
}

export async function getProjectById(id: string, clerkId: string) {
  // Get project with org info and verify user has access
  const result = await db
    .select({
      id: projects.id,
      orgId: projects.orgId,
      name: projects.name,
      domain: projects.domain,
      embedKey: projects.embedKey,
      createdAt: projects.createdAt,
      orgName: orgs.name,
      orgSlug: orgs.slug,
    })
    .from(projects)
    .innerJoin(orgs, eq(projects.orgId, orgs.id))
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId))
    .where(and(eq(projects.id, id), eq(users.clerkId, clerkId)))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  return result[0];
}