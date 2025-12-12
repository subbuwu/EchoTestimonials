import { db } from '@/db';
import { testimonials, testimonialSubmissions, projects, orgs, orgMembers, users } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
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

  // Create a NEW submission record (not updating the form testimonial)
  const [created] = await db
    .insert(testimonialSubmissions)
    .values({
      testimonialId,
      projectId,
      name: data.name,
      email: data.email || null,
      company: data.company || null,
      role: data.role || null,
      imageUrl: data.imageUrl || null,
      rating: data.rating || null,
      testimonial: data.testimonial,
      customFields: data.customFields ? JSON.stringify(data.customFields) : null,
      isPublished: 'false', // Public submissions are drafts by default
    })
    .returning();

  return {
    ...created,
    customFields: created.customFields ? JSON.parse(created.customFields) : null,
    isPublished: created.isPublished === 'true',
  };
}

export async function getTestimonialsByProjectId(projectId: string, clerkId: string) {
  // Verify user has access to the project's org and get testimonial forms
  const forms = await db
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

  // Get all submissions for these testimonial forms
  const formIds = forms.map(f => f.id);
  const submissions = formIds.length > 0 ? await db
    .select({
      id: testimonialSubmissions.id,
      testimonialId: testimonialSubmissions.testimonialId,
      projectId: testimonialSubmissions.projectId,
      name: testimonialSubmissions.name,
      email: testimonialSubmissions.email,
      company: testimonialSubmissions.company,
      role: testimonialSubmissions.role,
      imageUrl: testimonialSubmissions.imageUrl,
      rating: testimonialSubmissions.rating,
      testimonial: testimonialSubmissions.testimonial,
      customFields: testimonialSubmissions.customFields,
      isPublished: testimonialSubmissions.isPublished,
      createdAt: testimonialSubmissions.createdAt,
      updatedAt: testimonialSubmissions.updatedAt,
    })
    .from(testimonialSubmissions)
    .where(and(
      eq(testimonialSubmissions.projectId, projectId),
      inArray(testimonialSubmissions.testimonialId, formIds)
    ))
    .orderBy(desc(testimonialSubmissions.createdAt)) : [];

  // Group submissions by testimonial form ID
  const submissionsByFormId = new Map<string, typeof submissions>();
  submissions.forEach(sub => {
    if (!submissionsByFormId.has(sub.testimonialId)) {
      submissionsByFormId.set(sub.testimonialId, []);
    }
    submissionsByFormId.get(sub.testimonialId)!.push(sub);
  });

  // Combine forms with their submissions
  // Return both the form and all its submissions as separate items
  const result: any[] = [];
  
  // Create a set of form IDs that have actual submissions in the submissions table
  const formsWithSubmissions = new Set(submissions.map(s => s.testimonialId));
  
  forms.forEach(form => {
    // Check if this form has actual submissions in the submissions table
    const hasSubmissionsInTable = formsWithSubmissions.has(form.id);
    
    // Check if this form has submission data (not just default/placeholder values)
    const hasSubmissionData = form.name && 
                              form.name !== 'Untitled Testimonial' && 
                              form.name.trim() !== '' &&
                              form.testimonial && 
                              form.testimonial.trim() !== '';
    
    // Add the form itself (as a template/configuration)
    result.push({
      ...form,
      formConfig: form.formConfig ? JSON.parse(form.formConfig) : null,
      customFields: form.customFields ? JSON.parse(form.customFields) : null,
      isPublished: form.isPublished === 'true',
      isForm: true, // Flag to identify this is a form, not a submission
    });
    
    // If this form has submission data AND has other submissions pointing to it,
    // also include the form's data as a submission entry
    // This handles the case where old code stored submission data in the form record
    if (hasSubmissionData && hasSubmissionsInTable) {
      result.push({
        ...form,
        formConfig: form.formConfig ? JSON.parse(form.formConfig) : null,
        customFields: form.customFields ? JSON.parse(form.customFields) : null,
        isPublished: form.isPublished === 'true',
        isForm: false, // Also treat as a submission
        testimonialFormId: form.id, // Self-reference to the form
      });
    }

    // Add all submissions for this form
    const formSubmissions = submissionsByFormId.get(form.id) || [];
    formSubmissions.forEach(sub => {
      result.push({
        ...sub,
        embedKey: form.embedKey, // Include embedKey from parent form
        formConfig: form.formConfig ? JSON.parse(form.formConfig) : null, // Include form config
        customFields: sub.customFields ? JSON.parse(sub.customFields) : null,
        isPublished: sub.isPublished === 'true',
        isForm: false, // Flag to identify this is a submission
        testimonialFormId: form.id, // Reference to parent form
      });
    });
  });

  return result;
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

// Get submission by ID (with access check)
export async function getSubmissionById(id: string, clerkId: string) {
  const result = await db
    .select({
      id: testimonialSubmissions.id,
      testimonialId: testimonialSubmissions.testimonialId,
      projectId: testimonialSubmissions.projectId,
      name: testimonialSubmissions.name,
      email: testimonialSubmissions.email,
      company: testimonialSubmissions.company,
      role: testimonialSubmissions.role,
      imageUrl: testimonialSubmissions.imageUrl,
      rating: testimonialSubmissions.rating,
      testimonial: testimonialSubmissions.testimonial,
      customFields: testimonialSubmissions.customFields,
      isPublished: testimonialSubmissions.isPublished,
      createdAt: testimonialSubmissions.createdAt,
      updatedAt: testimonialSubmissions.updatedAt,
    })
    .from(testimonialSubmissions)
    .innerJoin(projects, eq(testimonialSubmissions.projectId, projects.id))
    .innerJoin(orgs, eq(projects.orgId, orgs.id))
    .innerJoin(orgMembers, eq(orgs.id, orgMembers.orgId))
    .innerJoin(users, eq(orgMembers.userId, users.clerkId))
    .where(and(eq(testimonialSubmissions.id, id), eq(users.clerkId, clerkId)))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  const sub = result[0];
  // Get the parent form to include embedKey and formConfig
  const form = await db
    .select({
      embedKey: testimonials.embedKey,
      formConfig: testimonials.formConfig,
    })
    .from(testimonials)
    .where(eq(testimonials.id, sub.testimonialId))
    .limit(1);

  if (!form[0]?.embedKey) {
    return null;
  }

  return {
    ...sub,
    embedKey: form[0].embedKey,
    formConfig: form[0].formConfig ? JSON.parse(form[0].formConfig) : null,
    customFields: sub.customFields ? JSON.parse(sub.customFields) : null,
    isPublished: sub.isPublished === 'true',
    isForm: false,
    testimonialFormId: sub.testimonialId,
  };
}

// Update submission (for publish/unpublish and other updates)
export async function updateSubmission(id: string, clerkId: string, data: Partial<Omit<CreateTestimonialData, 'projectId'>>) {
  // First verify access
  const existing = await getSubmissionById(id, clerkId);
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

  const [updated] = await db
    .update(testimonialSubmissions)
    .set(updateData)
    .where(eq(testimonialSubmissions.id, id))
    .returning();

  // Get parent form data
  const form = await db
    .select({
      embedKey: testimonials.embedKey,
      formConfig: testimonials.formConfig,
    })
    .from(testimonials)
    .where(eq(testimonials.id, updated.testimonialId))
    .limit(1);

  if (!form[0]?.embedKey) {
    return null;
  }

  return {
    ...updated,
    embedKey: form[0].embedKey,
    formConfig: form[0].formConfig ? JSON.parse(form[0].formConfig) : null,
    customFields: updated.customFields ? JSON.parse(updated.customFields) : null,
    isPublished: updated.isPublished === 'true',
    isForm: false,
    testimonialFormId: updated.testimonialId,
  };
}

// Delete submission
export async function deleteSubmission(id: string, clerkId: string) {
  // First verify access
  const existing = await getSubmissionById(id, clerkId);
  if (!existing) {
    return null;
  }

  await db
    .delete(testimonialSubmissions)
    .where(eq(testimonialSubmissions.id, id));

  // Return a similar structure to deleteTestimonial for consistency
  return { id };
}
