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

