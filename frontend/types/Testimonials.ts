import { FormConfig } from './FormConfig';

export interface Testimonial {
  id: string;
  projectId: string;
  embedKey: string;
  formConfig: FormConfig | null;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  imageUrl: string | null;
  rating: string | null;
  testimonial: string;
  customFields: Record<string, any> | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional fields for distinguishing forms from submissions
  isForm?: boolean; // true for testimonial forms, false/undefined for submissions
  testimonialFormId?: string; // ID of the parent form (for submissions only)
}

export interface CreateTestimonialRequest {
  projectId: string;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  imageUrl?: string;
  rating?: string;
  testimonial?: string;
  customFields?: Record<string, any>;
  isPublished?: boolean;
  formConfig?: FormConfig;
}

export interface CustomField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'url' | 'email' | 'date';
  value: string;
}

