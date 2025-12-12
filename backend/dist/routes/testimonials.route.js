"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testimonials_controller_1 = require("@/controllers/testimonials.controller");
const validation_1 = require("@/utils/validation");
const express_1 = require("@clerk/express");
const express_2 = require("express");
const router = (0, express_2.Router)();
function getClerkId(req) {
    const auth = (0, express_1.getAuth)(req);
    if (!auth.userId) {
        throw new Error('User not authenticated');
    }
    return auth.userId;
}
router.post('/', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const { projectId, name, email, company, role, imageUrl, rating, testimonial, customFields, isPublished, formConfig } = req.body;
        if (!projectId) {
            return res.status(400).json({ error: 'projectId is required' });
        }
        // Sanitize inputs
        const sanitizedName = name ? (0, validation_1.sanitizeText)(name) : 'Untitled Testimonial';
        const sanitizedEmail = email ? (0, validation_1.sanitizeText)(email) : undefined;
        const sanitizedCompany = company ? (0, validation_1.sanitizeText)(company) : undefined;
        const sanitizedRole = role ? (0, validation_1.sanitizeText)(role) : undefined;
        const sanitizedImageUrl = imageUrl ? (0, validation_1.sanitizeText)(imageUrl) : undefined;
        const sanitizedTestimonial = testimonial ? (0, validation_1.sanitizeText)(testimonial) : '';
        // Validate if testimonial content is provided
        if (testimonial && sanitizedTestimonial.length === 0) {
            return res.status(400).json({ error: 'Testimonial cannot be empty' });
        }
        const created = await (0, testimonials_controller_1.createTestimonial)({
            projectId,
            name: sanitizedName,
            email: sanitizedEmail,
            company: sanitizedCompany,
            role: sanitizedRole,
            imageUrl: sanitizedImageUrl,
            rating,
            testimonial: sanitizedTestimonial,
            customFields,
            isPublished: isPublished !== null && isPublished !== void 0 ? isPublished : false,
        }, formConfig);
        res.status(201).json(created);
    }
    catch (error) {
        console.error('Error creating testimonial:', error);
        res.status(500).json({ error: 'Failed to create testimonial' });
    }
});
router.get('/project/:projectId', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { projectId } = req.params;
        const testimonials = await (0, testimonials_controller_1.getTestimonialsByProjectId)(projectId, clerkId);
        res.json(testimonials);
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
});
router.get('/:id', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { id } = req.params;
        // Try to get as testimonial form first
        let result = await (0, testimonials_controller_1.getTestimonialById)(id, clerkId);
        // If not found, try as submission
        if (!result) {
            result = await (0, testimonials_controller_1.getSubmissionById)(id, clerkId);
        }
        if (!result) {
            return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching testimonial:', error);
        res.status(500).json({ error: 'Failed to fetch testimonial' });
    }
});
router.put('/:id', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { id } = req.params;
        const { name, email, company, role, imageUrl, rating, testimonial, customFields, isPublished, formConfig } = req.body;
        // Check if it's a form or submission by trying to get it first
        const existingForm = await (0, testimonials_controller_1.getTestimonialById)(id, clerkId);
        const existingSubmission = existingForm ? null : await (0, testimonials_controller_1.getSubmissionById)(id, clerkId);
        let updated;
        if (existingForm) {
            // Update testimonial form
            const sanitizedName = name ? (0, validation_1.sanitizeText)(name) : undefined;
            const sanitizedEmail = email !== undefined ? (email ? (0, validation_1.sanitizeText)(email) : undefined) : undefined;
            const sanitizedCompany = company !== undefined ? (company ? (0, validation_1.sanitizeText)(company) : undefined) : undefined;
            const sanitizedRole = role !== undefined ? (role ? (0, validation_1.sanitizeText)(role) : undefined) : undefined;
            const sanitizedImageUrl = imageUrl !== undefined ? (imageUrl ? (0, validation_1.sanitizeText)(imageUrl) : undefined) : undefined;
            const sanitizedTestimonial = testimonial ? (0, validation_1.sanitizeText)(testimonial) : undefined;
            // Validate if testimonial is being updated
            if (testimonial !== undefined && sanitizedTestimonial && sanitizedTestimonial.length === 0) {
                return res.status(400).json({ error: 'Testimonial cannot be empty' });
            }
            updated = await (0, testimonials_controller_1.updateTestimonial)(id, clerkId, {
                name: sanitizedName,
                email: sanitizedEmail,
                company: sanitizedCompany,
                role: sanitizedRole,
                imageUrl: sanitizedImageUrl,
                rating,
                testimonial: sanitizedTestimonial,
                customFields,
                isPublished,
            }, formConfig);
        }
        else if (existingSubmission) {
            // Update submission (only allow isPublished and content updates, not formConfig)
            const sanitizedName = name ? (0, validation_1.sanitizeText)(name) : undefined;
            const sanitizedEmail = email !== undefined ? (email ? (0, validation_1.sanitizeText)(email) : undefined) : undefined;
            const sanitizedCompany = company !== undefined ? (company ? (0, validation_1.sanitizeText)(company) : undefined) : undefined;
            const sanitizedRole = role !== undefined ? (role ? (0, validation_1.sanitizeText)(role) : undefined) : undefined;
            const sanitizedImageUrl = imageUrl !== undefined ? (imageUrl ? (0, validation_1.sanitizeText)(imageUrl) : undefined) : undefined;
            const sanitizedTestimonial = testimonial ? (0, validation_1.sanitizeText)(testimonial) : undefined;
            if (testimonial !== undefined && sanitizedTestimonial && sanitizedTestimonial.length === 0) {
                return res.status(400).json({ error: 'Testimonial cannot be empty' });
            }
            updated = await (0, testimonials_controller_1.updateSubmission)(id, clerkId, {
                name: sanitizedName,
                email: sanitizedEmail,
                company: sanitizedCompany,
                role: sanitizedRole,
                imageUrl: sanitizedImageUrl,
                rating,
                testimonial: sanitizedTestimonial,
                customFields,
                isPublished,
            });
        }
        else {
            return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
        }
        if (!updated) {
            return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
        }
        res.json(updated);
    }
    catch (error) {
        console.error('Error updating testimonial:', error);
        res.status(500).json({ error: 'Failed to update testimonial' });
    }
});
router.delete('/:id', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { id } = req.params;
        // Try to delete as testimonial form first
        const deletedForm = await (0, testimonials_controller_1.deleteTestimonial)(id, clerkId);
        // If not found, try as submission
        const deletedSubmission = deletedForm ? null : await (0, testimonials_controller_1.deleteSubmission)(id, clerkId);
        if (!deletedForm && !deletedSubmission) {
            return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
        }
        res.json({ message: 'Testimonial deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting testimonial:', error);
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});
// Public routes (no auth required)
router.post('/public/:embedKey', async (req, res) => {
    try {
        const { embedKey } = req.params;
        const { name, email, company, role, imageUrl, rating, testimonial, customFields } = req.body;
        // Validate submission data
        const validation = (0, validation_1.validateTestimonialSubmission)({
            name,
            email,
            company,
            role,
            imageUrl,
            rating,
            testimonial,
        });
        if (!validation.isValid) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validation.errors
            });
        }
        // Sanitize inputs
        const sanitizedName = (0, validation_1.sanitizeText)(name);
        const sanitizedEmail = email ? (0, validation_1.sanitizeText)(email) : undefined;
        const sanitizedCompany = company ? (0, validation_1.sanitizeText)(company) : undefined;
        const sanitizedRole = role ? (0, validation_1.sanitizeText)(role) : undefined;
        const sanitizedImageUrl = imageUrl ? (0, validation_1.sanitizeText)(imageUrl) : undefined;
        const sanitizedTestimonial = (0, validation_1.sanitizeText)(testimonial);
        const updated = await (0, testimonials_controller_1.createTestimonialSubmission)(embedKey, {
            name: sanitizedName,
            email: sanitizedEmail,
            company: sanitizedCompany,
            role: sanitizedRole,
            imageUrl: sanitizedImageUrl,
            rating,
            testimonial: sanitizedTestimonial,
            customFields,
        });
        res.status(200).json({
            success: true,
            message: 'Testimonial submitted successfully',
            id: updated.id
        });
    }
    catch (error) {
        console.error('Error submitting testimonial:', error);
        if (error.message === 'Invalid embed key') {
            return res.status(404).json({ error: 'Invalid embed key' });
        }
        res.status(500).json({ error: 'Failed to submit testimonial' });
    }
});
router.get('/public/:embedKey', async (req, res) => {
    try {
        const { embedKey } = req.params;
        const testimonial = await (0, testimonials_controller_1.getTestimonialByEmbedKey)(embedKey);
        if (!testimonial) {
            return res.status(404).json({ error: 'Testimonial form not found' });
        }
        res.json(testimonial);
    }
    catch (error) {
        console.error('Error fetching testimonial form:', error);
        res.status(500).json({ error: 'Failed to fetch testimonial form' });
    }
});
exports.default = router;
