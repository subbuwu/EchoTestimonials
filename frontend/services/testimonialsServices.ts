import { api } from '@/lib/api';
import { Testimonial, CreateTestimonialRequest } from '@/types/Testimonials';
import { FormConfig } from '@/types/FormConfig';

export const createTestimonial = async (
  data: CreateTestimonialRequest,
  formConfig?: FormConfig,
  token?: string
): Promise<Testimonial> => {
  try {
    const response = await api.post('/testimonials', { ...data, formConfig }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const getTestimonialsByProjectId = async (
  projectId: string,
  token: string
): Promise<Testimonial[]> => {
  try {
    const response = await api.get(`/testimonials/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

export const getTestimonialById = async (id: string, token: string): Promise<Testimonial> => {
  try {
    const response = await api.get(`/testimonials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (
  id: string,
  data: Partial<CreateTestimonialRequest>,
  formConfig?: FormConfig,
  token?: string
): Promise<Testimonial> => {
  try {
    const response = await api.put(`/testimonials/${id}`, { ...data, formConfig }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string, token: string): Promise<void> => {
  try {
    await api.delete(`/testimonials/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

export const toggleTestimonialPublish = async (
  id: string,
  isPublished: boolean,
  token: string
): Promise<Testimonial> => {
  try {
    const response = await api.put(`/testimonials/${id}`, { isPublished }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling testimonial publish status:', error);
    throw error;
  }
};

