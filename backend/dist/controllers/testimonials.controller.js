"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestimonial = createTestimonial;
exports.createTestimonialSubmission = createTestimonialSubmission;
exports.getTestimonialsByProjectId = getTestimonialsByProjectId;
exports.getTestimonialByEmbedKey = getTestimonialByEmbedKey;
exports.getTestimonialById = getTestimonialById;
exports.updateTestimonial = updateTestimonial;
exports.deleteTestimonial = deleteTestimonial;
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const utils_1 = require("@/utils");
async function createTestimonial(data, formConfig) {
    const [created] = await db_1.db
        .insert(schema_1.testimonials)
        .values({
        projectId: data.projectId,
        embedKey: (0, utils_1.generateTestimonialEmbedKey)(),
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
async function createTestimonialSubmission(embedKey, data) {
    // Find testimonial by embedKey to get the form and project
    const testimonialResult = await db_1.db
        .select({
        id: schema_1.testimonials.id,
        projectId: schema_1.testimonials.projectId,
    })
        .from(schema_1.testimonials)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.embedKey, embedKey))
        .limit(1);
    if (!testimonialResult || testimonialResult.length === 0) {
        throw new Error('Invalid embed key');
    }
    const testimonialId = testimonialResult[0].id;
    const projectId = testimonialResult[0].projectId;
    // Create a new testimonial submission (this is a submission, not updating the form testimonial)
    // We'll store it as a separate entry or update the existing one
    // For now, let's update the existing testimonial with submission data
    const [updated] = await db_1.db
        .update(schema_1.testimonials)
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
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.id, testimonialId))
        .returning();
    return {
        ...updated,
        customFields: updated.customFields ? JSON.parse(updated.customFields) : null,
        isPublished: updated.isPublished === 'true',
    };
}
async function getTestimonialsByProjectId(projectId, clerkId) {
    // Verify user has access to the project's org
    const result = await db_1.db
        .select({
        id: schema_1.testimonials.id,
        projectId: schema_1.testimonials.projectId,
        embedKey: schema_1.testimonials.embedKey,
        formConfig: schema_1.testimonials.formConfig,
        name: schema_1.testimonials.name,
        email: schema_1.testimonials.email,
        company: schema_1.testimonials.company,
        role: schema_1.testimonials.role,
        imageUrl: schema_1.testimonials.imageUrl,
        rating: schema_1.testimonials.rating,
        testimonial: schema_1.testimonials.testimonial,
        customFields: schema_1.testimonials.customFields,
        isPublished: schema_1.testimonials.isPublished,
        createdAt: schema_1.testimonials.createdAt,
        updatedAt: schema_1.testimonials.updatedAt,
    })
        .from(schema_1.testimonials)
        .innerJoin(schema_1.projects, (0, drizzle_orm_1.eq)(schema_1.testimonials.projectId, schema_1.projects.id))
        .innerJoin(schema_1.orgs, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.orgs.id))
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.testimonials.projectId, projectId), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.testimonials.createdAt));
    return result.map((t) => ({
        ...t,
        formConfig: t.formConfig ? JSON.parse(t.formConfig) : null,
        customFields: t.customFields ? JSON.parse(t.customFields) : null,
        isPublished: t.isPublished === 'true',
    }));
}
// Get testimonial by embedKey (public) - for form display
async function getTestimonialByEmbedKey(embedKey) {
    const result = await db_1.db
        .select({
        id: schema_1.testimonials.id,
        projectId: schema_1.testimonials.projectId,
        embedKey: schema_1.testimonials.embedKey,
        formConfig: schema_1.testimonials.formConfig,
        name: schema_1.testimonials.name,
        email: schema_1.testimonials.email,
        company: schema_1.testimonials.company,
        role: schema_1.testimonials.role,
        imageUrl: schema_1.testimonials.imageUrl,
        rating: schema_1.testimonials.rating,
        testimonial: schema_1.testimonials.testimonial,
        customFields: schema_1.testimonials.customFields,
        isPublished: schema_1.testimonials.isPublished,
        createdAt: schema_1.testimonials.createdAt,
    })
        .from(schema_1.testimonials)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.embedKey, embedKey))
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
async function getTestimonialById(id, clerkId) {
    const result = await db_1.db
        .select({
        id: schema_1.testimonials.id,
        projectId: schema_1.testimonials.projectId,
        embedKey: schema_1.testimonials.embedKey,
        formConfig: schema_1.testimonials.formConfig,
        name: schema_1.testimonials.name,
        email: schema_1.testimonials.email,
        company: schema_1.testimonials.company,
        role: schema_1.testimonials.role,
        imageUrl: schema_1.testimonials.imageUrl,
        rating: schema_1.testimonials.rating,
        testimonial: schema_1.testimonials.testimonial,
        customFields: schema_1.testimonials.customFields,
        isPublished: schema_1.testimonials.isPublished,
        createdAt: schema_1.testimonials.createdAt,
        updatedAt: schema_1.testimonials.updatedAt,
    })
        .from(schema_1.testimonials)
        .innerJoin(schema_1.projects, (0, drizzle_orm_1.eq)(schema_1.testimonials.projectId, schema_1.projects.id))
        .innerJoin(schema_1.orgs, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.orgs.id))
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.testimonials.id, id), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId)))
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
async function updateTestimonial(id, clerkId, data, formConfig) {
    // First verify access
    const existing = await getTestimonialById(id, clerkId);
    if (!existing) {
        return null;
    }
    const updateData = {
        updatedAt: new Date(),
    };
    if (data.name !== undefined)
        updateData.name = data.name;
    if (data.email !== undefined)
        updateData.email = data.email || null;
    if (data.company !== undefined)
        updateData.company = data.company || null;
    if (data.role !== undefined)
        updateData.role = data.role || null;
    if (data.imageUrl !== undefined)
        updateData.imageUrl = data.imageUrl || null;
    if (data.rating !== undefined)
        updateData.rating = data.rating || null;
    if (data.testimonial !== undefined)
        updateData.testimonial = data.testimonial;
    if (data.customFields !== undefined)
        updateData.customFields = data.customFields ? JSON.stringify(data.customFields) : null;
    if (data.isPublished !== undefined)
        updateData.isPublished = data.isPublished ? 'true' : 'false';
    if (formConfig !== undefined)
        updateData.formConfig = formConfig ? JSON.stringify(formConfig) : null;
    const [updated] = await db_1.db
        .update(schema_1.testimonials)
        .set(updateData)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.id, id))
        .returning();
    return {
        ...updated,
        formConfig: updated.formConfig ? JSON.parse(updated.formConfig) : null,
        customFields: updated.customFields ? JSON.parse(updated.customFields) : null,
        isPublished: updated.isPublished === 'true',
    };
}
async function deleteTestimonial(id, clerkId) {
    // First verify access
    const existing = await getTestimonialById(id, clerkId);
    if (!existing) {
        return null;
    }
    const [deleted] = await db_1.db
        .delete(schema_1.testimonials)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.id, id))
        .returning();
    return deleted;
}
