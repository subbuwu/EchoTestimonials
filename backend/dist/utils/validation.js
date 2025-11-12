"use strict";
// Validation utilities for input sanitization and validation
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validateUrl = validateUrl;
exports.validateTextField = validateTextField;
exports.validateRating = validateRating;
exports.sanitizeText = sanitizeText;
exports.validateTestimonialSubmission = validateTestimonialSubmission;
// Email validation
function validateEmail(email) {
    if (!email) {
        return { isValid: true }; // Email is optional
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }
    if (email.length > 255) {
        return { isValid: false, error: 'Email must be less than 255 characters' };
    }
    return { isValid: true };
}
// URL validation
function validateUrl(url) {
    if (!url) {
        return { isValid: true }; // URL is optional
    }
    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return { isValid: false, error: 'URL must use http or https protocol' };
        }
    }
    catch {
        return { isValid: false, error: 'Invalid URL format' };
    }
    if (url.length > 2048) {
        return { isValid: false, error: 'URL must be less than 2048 characters' };
    }
    return { isValid: true };
}
// Text field validation
function validateTextField(value, fieldName, maxLength = 1000, required = false) {
    if (!value || value.trim().length === 0) {
        if (required) {
            return { isValid: false, error: `${fieldName} is required` };
        }
        return { isValid: true };
    }
    if (value.length > maxLength) {
        return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
    }
    return { isValid: true };
}
// Rating validation
function validateRating(rating) {
    if (!rating) {
        return { isValid: true }; // Rating is optional
    }
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return { isValid: false, error: 'Rating must be between 1 and 5' };
    }
    return { isValid: true };
}
// Sanitize text input (basic XSS prevention)
function sanitizeText(text) {
    if (!text)
        return '';
    return text
        .trim()
        .replace(/[<>]/g, ''); // Remove potential HTML tags
}
// Validate testimonial submission data
function validateTestimonialSubmission(data) {
    const errors = [];
    // Name is required
    const nameValidation = validateTextField(data.name, 'Name', 255, true);
    if (!nameValidation.isValid) {
        errors.push(nameValidation.error);
    }
    // Testimonial is required
    const testimonialValidation = validateTextField(data.testimonial, 'Testimonial', 5000, true);
    if (!testimonialValidation.isValid) {
        errors.push(testimonialValidation.error);
    }
    // Email validation
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
    }
    // Company validation
    const companyValidation = validateTextField(data.company, 'Company', 255, false);
    if (!companyValidation.isValid) {
        errors.push(companyValidation.error);
    }
    // Role validation
    const roleValidation = validateTextField(data.role, 'Role', 255, false);
    if (!roleValidation.isValid) {
        errors.push(roleValidation.error);
    }
    // Image URL validation
    const imageUrlValidation = validateUrl(data.imageUrl);
    if (!imageUrlValidation.isValid) {
        errors.push(imageUrlValidation.error);
    }
    // Rating validation
    const ratingValidation = validateRating(data.rating);
    if (!ratingValidation.isValid) {
        errors.push(ratingValidation.error);
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
