import {
  createTestimonial,
  createTestimonialSubmission,
  getTestimonialsByProjectId,
  getTestimonialById,
  getTestimonialByEmbedKey,
  updateTestimonial,
  deleteTestimonial,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
} from '@/controllers/testimonials.controller';
import { validateTestimonialSubmission, sanitizeText } from '@/utils/validation';
import { getAuth, requireAuth } from '@clerk/express';
import { Router, Request } from 'express';

const router = Router();

function getClerkId(req: Request): string {
  const auth = getAuth(req);
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }
  return auth.userId;
}

router.post('/', requireAuth(), async (req, res) => {
  try {
    const { projectId, name, email, company, role, imageUrl, rating, testimonial, customFields, isPublished, formConfig } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // Sanitize inputs
    const sanitizedName = name ? sanitizeText(name) : 'Untitled Testimonial';
    const sanitizedEmail = email ? sanitizeText(email) : undefined;
    const sanitizedCompany = company ? sanitizeText(company) : undefined;
    const sanitizedRole = role ? sanitizeText(role) : undefined;
    const sanitizedImageUrl = imageUrl ? sanitizeText(imageUrl) : undefined;
    const sanitizedTestimonial = testimonial ? sanitizeText(testimonial) : '';

    // Validate if testimonial content is provided
    if (testimonial && sanitizedTestimonial.length === 0) {
      return res.status(400).json({ error: 'Testimonial cannot be empty' });
    }

    const created = await createTestimonial({
      projectId,
      name: sanitizedName,
      email: sanitizedEmail,
      company: sanitizedCompany,
      role: sanitizedRole,
      imageUrl: sanitizedImageUrl,
      rating,
      testimonial: sanitizedTestimonial,
      customFields,
      isPublished: isPublished ?? false,
    }, formConfig);

    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.get('/project/:projectId', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { projectId } = req.params;
    const testimonials = await getTestimonialsByProjectId(projectId, clerkId);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.get('/:id', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { id } = req.params;
    
    // Try to get as testimonial form first
    let result = await getTestimonialById(id, clerkId);
    
    // If not found, try as submission
    if (!result) {
      result = await getSubmissionById(id, clerkId);
    }

    if (!result) {
      return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

router.put('/:id', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { id } = req.params;
    const { name, email, company, role, imageUrl, rating, testimonial, customFields, isPublished, formConfig } = req.body;

    // Check if it's a form or submission by trying to get it first
    const existingForm = await getTestimonialById(id, clerkId);
    const existingSubmission = existingForm ? null : await getSubmissionById(id, clerkId);

    let updated;

    if (existingForm) {
      // Update testimonial form
      const sanitizedName = name ? sanitizeText(name) : undefined;
      const sanitizedEmail = email !== undefined ? (email ? sanitizeText(email) : undefined) : undefined;
      const sanitizedCompany = company !== undefined ? (company ? sanitizeText(company) : undefined) : undefined;
      const sanitizedRole = role !== undefined ? (role ? sanitizeText(role) : undefined) : undefined;
      const sanitizedImageUrl = imageUrl !== undefined ? (imageUrl ? sanitizeText(imageUrl) : undefined) : undefined;
      const sanitizedTestimonial = testimonial ? sanitizeText(testimonial) : undefined;

      // Validate if testimonial is being updated
      if (testimonial !== undefined && sanitizedTestimonial && sanitizedTestimonial.length === 0) {
        return res.status(400).json({ error: 'Testimonial cannot be empty' });
      }

      updated = await updateTestimonial(id, clerkId, {
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
    } else if (existingSubmission) {
      // Update submission (only allow isPublished and content updates, not formConfig)
      const sanitizedName = name ? sanitizeText(name) : undefined;
      const sanitizedEmail = email !== undefined ? (email ? sanitizeText(email) : undefined) : undefined;
      const sanitizedCompany = company !== undefined ? (company ? sanitizeText(company) : undefined) : undefined;
      const sanitizedRole = role !== undefined ? (role ? sanitizeText(role) : undefined) : undefined;
      const sanitizedImageUrl = imageUrl !== undefined ? (imageUrl ? sanitizeText(imageUrl) : undefined) : undefined;
      const sanitizedTestimonial = testimonial ? sanitizeText(testimonial) : undefined;

      if (testimonial !== undefined && sanitizedTestimonial && sanitizedTestimonial.length === 0) {
        return res.status(400).json({ error: 'Testimonial cannot be empty' });
      }

      updated = await updateSubmission(id, clerkId, {
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
    } else {
      return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
    }

    if (!updated) {
      return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

router.delete('/:id', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { id } = req.params;
    
    // Try to delete as testimonial form first
    const deletedForm = await deleteTestimonial(id, clerkId);
    
    // If not found, try as submission
    const deletedSubmission = deletedForm ? null : await deleteSubmission(id, clerkId);

    if (!deletedForm && !deletedSubmission) {
      return res.status(404).json({ error: 'Testimonial not found or you don\'t have access to it' });
    }

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
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
    const validation = validateTestimonialSubmission({
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
    const sanitizedName = sanitizeText(name!);
    const sanitizedEmail = email ? sanitizeText(email) : undefined;
    const sanitizedCompany = company ? sanitizeText(company) : undefined;
    const sanitizedRole = role ? sanitizeText(role) : undefined;
    const sanitizedImageUrl = imageUrl ? sanitizeText(imageUrl) : undefined;
    const sanitizedTestimonial = sanitizeText(testimonial!);

    const updated = await createTestimonialSubmission(embedKey, {
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
  } catch (error: any) {
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
    const testimonial = await getTestimonialByEmbedKey(embedKey);

    if (!testimonial) {
      return res.status(404).json({ error: 'Testimonial form not found' });
    }

    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial form:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial form' });
  }
});

export default router;

