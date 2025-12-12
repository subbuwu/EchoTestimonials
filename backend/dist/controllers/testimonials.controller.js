"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestimonial = createTestimonial;
exports.createTestimonialSubmission = createTestimonialSubmission;
exports.getTestimonialsByProjectId = getTestimonialsByProjectId;
exports.getTestimonialByEmbedKey = getTestimonialByEmbedKey;
exports.getTestimonialById = getTestimonialById;
exports.updateTestimonial = updateTestimonial;
exports.deleteTestimonial = deleteTestimonial;
exports.getSubmissionById = getSubmissionById;
exports.updateSubmission = updateSubmission;
exports.deleteSubmission = deleteSubmission;
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
    // Create a NEW submission record (not updating the form testimonial)
    const [created] = await db_1.db
        .insert(schema_1.testimonialSubmissions)
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
async function getTestimonialsByProjectId(projectId, clerkId) {
    // Verify user has access to the project's org and get testimonial forms
    const forms = await db_1.db
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
    // Get all submissions for these testimonial forms
    const formIds = forms.map(f => f.id);
    const submissions = formIds.length > 0 ? await db_1.db
        .select({
        id: schema_1.testimonialSubmissions.id,
        testimonialId: schema_1.testimonialSubmissions.testimonialId,
        projectId: schema_1.testimonialSubmissions.projectId,
        name: schema_1.testimonialSubmissions.name,
        email: schema_1.testimonialSubmissions.email,
        company: schema_1.testimonialSubmissions.company,
        role: schema_1.testimonialSubmissions.role,
        imageUrl: schema_1.testimonialSubmissions.imageUrl,
        rating: schema_1.testimonialSubmissions.rating,
        testimonial: schema_1.testimonialSubmissions.testimonial,
        customFields: schema_1.testimonialSubmissions.customFields,
        isPublished: schema_1.testimonialSubmissions.isPublished,
        createdAt: schema_1.testimonialSubmissions.createdAt,
        updatedAt: schema_1.testimonialSubmissions.updatedAt,
    })
        .from(schema_1.testimonialSubmissions)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.testimonialSubmissions.projectId, projectId), (0, drizzle_orm_1.inArray)(schema_1.testimonialSubmissions.testimonialId, formIds)))
        .orderBy((0, drizzle_orm_1.desc)(schema_1.testimonialSubmissions.createdAt)) : [];
    // Group submissions by testimonial form ID
    const submissionsByFormId = new Map();
    submissions.forEach(sub => {
        if (!submissionsByFormId.has(sub.testimonialId)) {
            submissionsByFormId.set(sub.testimonialId, []);
        }
        submissionsByFormId.get(sub.testimonialId).push(sub);
    });
    // Combine forms with their submissions
    // Return both the form and all its submissions as separate items
    const result = [];
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
// Get submission by ID (with access check)
async function getSubmissionById(id, clerkId) {
    var _a;
    const result = await db_1.db
        .select({
        id: schema_1.testimonialSubmissions.id,
        testimonialId: schema_1.testimonialSubmissions.testimonialId,
        projectId: schema_1.testimonialSubmissions.projectId,
        name: schema_1.testimonialSubmissions.name,
        email: schema_1.testimonialSubmissions.email,
        company: schema_1.testimonialSubmissions.company,
        role: schema_1.testimonialSubmissions.role,
        imageUrl: schema_1.testimonialSubmissions.imageUrl,
        rating: schema_1.testimonialSubmissions.rating,
        testimonial: schema_1.testimonialSubmissions.testimonial,
        customFields: schema_1.testimonialSubmissions.customFields,
        isPublished: schema_1.testimonialSubmissions.isPublished,
        createdAt: schema_1.testimonialSubmissions.createdAt,
        updatedAt: schema_1.testimonialSubmissions.updatedAt,
    })
        .from(schema_1.testimonialSubmissions)
        .innerJoin(schema_1.projects, (0, drizzle_orm_1.eq)(schema_1.testimonialSubmissions.projectId, schema_1.projects.id))
        .innerJoin(schema_1.orgs, (0, drizzle_orm_1.eq)(schema_1.projects.orgId, schema_1.orgs.id))
        .innerJoin(schema_1.orgMembers, (0, drizzle_orm_1.eq)(schema_1.orgs.id, schema_1.orgMembers.orgId))
        .innerJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.orgMembers.userId, schema_1.users.clerkId))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.testimonialSubmissions.id, id), (0, drizzle_orm_1.eq)(schema_1.users.clerkId, clerkId)))
        .limit(1);
    if (!result || result.length === 0) {
        return null;
    }
    const sub = result[0];
    // Get the parent form to include embedKey and formConfig
    const form = await db_1.db
        .select({
        embedKey: schema_1.testimonials.embedKey,
        formConfig: schema_1.testimonials.formConfig,
    })
        .from(schema_1.testimonials)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.id, sub.testimonialId))
        .limit(1);
    if (!((_a = form[0]) === null || _a === void 0 ? void 0 : _a.embedKey)) {
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
async function updateSubmission(id, clerkId, data) {
    var _a;
    // First verify access
    const existing = await getSubmissionById(id, clerkId);
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
    const [updated] = await db_1.db
        .update(schema_1.testimonialSubmissions)
        .set(updateData)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonialSubmissions.id, id))
        .returning();
    // Get parent form data
    const form = await db_1.db
        .select({
        embedKey: schema_1.testimonials.embedKey,
        formConfig: schema_1.testimonials.formConfig,
    })
        .from(schema_1.testimonials)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonials.id, updated.testimonialId))
        .limit(1);
    if (!((_a = form[0]) === null || _a === void 0 ? void 0 : _a.embedKey)) {
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
async function deleteSubmission(id, clerkId) {
    // First verify access
    const existing = await getSubmissionById(id, clerkId);
    if (!existing) {
        return null;
    }
    await db_1.db
        .delete(schema_1.testimonialSubmissions)
        .where((0, drizzle_orm_1.eq)(schema_1.testimonialSubmissions.id, id));
    // Return a similar structure to deleteTestimonial for consistency
    return { id };
}
