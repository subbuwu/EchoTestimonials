import { db } from '@/db';
import { testimonials, projects, orgs, orgMembers, users } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateTestimonialEmbedKey } from '@/utils';

interface CreateTestimonialData {
  projectId: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  imageUrl?: string;
  rating?: string;
  testimonial: string;
  customFields?: Record<string, any>;
  isPublished?: boolean;
}

export async function createTestimonial(data: CreateTestimonialData, formConfig?: any) {
  const [created] = await db
    .insert(testimonials)
    .values({
      projectId: data.projectId,
      embedKey: generateTestimonialEmbedKey(),
      formConfig: formConfig ? JSON.stringify(formConfig) : null,
      name: data.name,
      email: data.email || null,
      company: data.company || null,
      role: data.role || null,
      imageUrl: data.imageUrl || null,
      rating: data.rating || null,
      testimonial: data.testimonial,
      customFields: data.customFields ? JSON.stringify(data.customFields) : null,
      isPublished: data.isPublished ? 'true' : 'false',
    })
    .returning();

  return {
    ...created,
    formConfig: created.formConfig ? JSON.parse(created.formConfig) : null,
    customFields: created.customFields ? JSON.parse(created.customFields) : null,
    isPublished: created.isPublished === 'true',
  };
}

// Public function to create testimonial submission (no auth check, but validates embedKey)
export async function createTestimonialSubmission(embedKey: string, data: Omit<CreateTestimonialData, 'projectId'>) {
  // Find testimonial by embedKey to get the form and project
  const testimonialResult = await db
    .select({
      id: testimonials.id,
      projectId: testimonials.projectId,
    })
    .from(testimonials)
    .where(eq(testimonials.embedKey, embedKey))
    .limit(1);

  if (!testimonialResult || testimonialResult.length === 0) {
    throw new Error('Invalid embed key');
  }

  const testimonialId = testimonialResult[0].id;
  const projectId = testimonialResult[0].projectId;

  // Create a new testimonial submission (this is a submission, not updating the form testimonial)
  // We'll store it as a separate entry or update the existing one
  // For now, let's update the existing testimonial with submission data
  const [updated] = await db
    .update(testimonials)
    .set({
      name: data.name,
      email: data.email || null,
      company: data.company || null,
      role: data.role || null,
      imageUrl: data.imageUrl || null,
      rating: data.rating || null,
      testimonial: data.testimonial,
      customFields: data.customFields ? JSON.stringify(data.customFields) : null,
      isPublished: 'false', // Public submissions are drafts by default
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, testimonialId))
    .returning();

  return {
    ...updated,
    customFields: updated.customFields ? JSON.parse(updated.customFields) : null,
    isPublished: updated.isPublished === 'true',
  };
}

export async function getTestimonialsByProjectId(projectId: string, clerkId: string) {
  // Verify user has access to the project's org
  const result = await db
    .select({
      id: testimonials.id,
      projectId: testimonials.projectId,
      embedKey: testimonials.embedKey,
      formConfig: testimonials.formConfig,
      name: testimonials.name,
      email: testimonials.email,
      company: testimonials.company,
      role: testimonials.role,
      imageUrl: testimonials.imageUrl,
      rating: testimonials.rating,
      testimonial: testimonials.testimonial,
      customFields: testimonials.customFields,
      isPublished: testimonials.isPublished,
      createdAt: testimonials.createdAt,
      updatedAt: testimonials.updatedAt,
    })
    .from(testimonials)
    .innerJoin(projects, eq(testimonials.projectId, projects.id))
    .innerJoin(orgs, eq(projects.orgId, orgs.id))
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId))
    .where(and(eq(testimonials.projectId, projectId), eq(users.clerkId, clerkId)))
    .orderBy(desc(testimonials.createdAt));

  return result.map((t) => ({
    ...t,
    formConfig: t.formConfig ? JSON.parse(t.formConfig) : null,
    customFields: t.customFields ? JSON.parse(t.customFields) : null,
    isPublished: t.isPublished === 'true',
  }));
}

// Get testimonial by embedKey (public) - for form display
export async function getTestimonialByEmbedKey(embedKey: string) {
  const result = await db
    .select({
      id: testimonials.id,
      projectId: testimonials.projectId,
      embedKey: testimonials.embedKey,
      formConfig: testimonials.formConfig,
      name: testimonials.name,
      email: testimonials.email,
      company: testimonials.company,
      role: testimonials.role,
      imageUrl: testimonials.imageUrl,
      rating: testimonials.rating,
      testimonial: testimonials.testimonial,
      customFields: testimonials.customFields,
      isPublished: testimonials.isPublished,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.embedKey, embedKey))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  const t = result[0];
  return {
    ...t,
    formConfig: t.formConfig ? JSON.parse(t.formConfig) : null,
    customFields: t.customFields ? JSON.parse(t.customFields) : null,
    isPublished: t.isPublished === 'true',
  };
}

export async function getTestimonialById(id: string, clerkId: string) {
  const result = await db
    .select({
      id: testimonials.id,
      projectId: testimonials.projectId,
      embedKey: testimonials.embedKey,
      formConfig: testimonials.formConfig,
      name: testimonials.name,
      email: testimonials.email,
      company: testimonials.company,
      role: testimonials.role,
      imageUrl: testimonials.imageUrl,
      rating: testimonials.rating,
      testimonial: testimonials.testimonial,
      customFields: testimonials.customFields,
      isPublished: testimonials.isPublished,
      createdAt: testimonials.createdAt,
      updatedAt: testimonials.updatedAt,
    })
    .from(testimonials)
    .innerJoin(projects, eq(testimonials.projectId, projects.id))
    .innerJoin(orgs, eq(projects.orgId, orgs.id))
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId))
    .where(and(eq(testimonials.id, id), eq(users.clerkId, clerkId)))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  const t = result[0];
  return {
    ...t,
    formConfig: t.formConfig ? JSON.parse(t.formConfig) : null,
    customFields: t.customFields ? JSON.parse(t.customFields) : null,
    isPublished: t.isPublished === 'true',
  };
}

export async function updateTestimonial(id: string, clerkId: string, data: Partial<CreateTestimonialData>, formConfig?: any) {
  // First verify access
  const existing = await getTestimonialById(id, clerkId);
  if (!existing) {
    return null;
  }

  const updateData: any = {
    updatedAt: new Date(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email || null;
  if (data.company !== undefined) updateData.company = data.company || null;
  if (data.role !== undefined) updateData.role = data.role || null;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
  if (data.rating !== undefined) updateData.rating = data.rating || null;
  if (data.testimonial !== undefined) updateData.testimonial = data.testimonial;
  if (data.customFields !== undefined) updateData.customFields = data.customFields ? JSON.stringify(data.customFields) : null;
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished ? 'true' : 'false';
  if (formConfig !== undefined) updateData.formConfig = formConfig ? JSON.stringify(formConfig) : null;

  const [updated] = await db
    .update(testimonials)
    .set(updateData)
    .where(eq(testimonials.id, id))
    .returning();

  return {
    ...updated,
    formConfig: updated.formConfig ? JSON.parse(updated.formConfig) : null,
    customFields: updated.customFields ? JSON.parse(updated.customFields) : null,
    isPublished: updated.isPublished === 'true',
  };
}

export async function deleteTestimonial(id: string, clerkId: string) {
  // First verify access
  const existing = await getTestimonialById(id, clerkId);
  if (!existing) {
    return null;
  }

  const [deleted] = await db
    .delete(testimonials)
    .where(eq(testimonials.id, id))
    .returning();

  return deleted;
}
