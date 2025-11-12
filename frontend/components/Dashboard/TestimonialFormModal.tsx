'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createTestimonial, updateTestimonial } from '@/services/testimonialsServices';
import { useQueryClient } from '@tanstack/react-query';
import { FormBuilder } from './FormBuilder';
import { FormConfig } from '@/types/FormConfig';
import { Testimonial } from '@/types/Testimonials';
import { FormPreviewModal } from './FormPreviewModal';

interface TestimonialFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
  testimonial?: Testimonial; // If provided, we're editing
}

export function TestimonialFormModal({ 
  open, 
  setOpen, 
  projectId,
  testimonial 
}: TestimonialFormModalProps) {
  const defaultConfig: FormConfig = {
    fields: [
      { id: 'name', type: 'text', label: 'Your Name', required: true, order: 1, placeholder: 'John Doe' },
      { id: 'email', type: 'email', label: 'Your Email', required: false, order: 2, placeholder: 'john.doe@example.com' },
      { id: 'company', type: 'text', label: 'Company', required: false, order: 3, placeholder: 'Acme Corp' },
      { id: 'role', type: 'text', label: 'Your Role', required: false, order: 4, placeholder: 'Software Engineer' },
      { id: 'rating', type: 'rating', label: 'Rating', required: false, order: 5 },
      { id: 'testimonial', type: 'textarea', label: 'Your Testimonial', required: true, order: 6, placeholder: 'Write your testimonial here...' },
    ],
    title: 'Share Your Experience',
    description: 'We would love to hear from you!',
    submitButtonText: 'Submit Testimonial',
    successMessage: 'Thank you! Your testimonial has been submitted successfully.',
  };

  const [formConfig, setFormConfig] = useState<FormConfig | null>(
    testimonial?.formConfig || defaultConfig
  );
  const [showPreview, setShowPreview] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      if (testimonial?.formConfig) {
        setFormConfig(testimonial.formConfig);
      } else if (!testimonial) {
        setFormConfig(defaultConfig);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonial, open]);

  const handleSave = async (config: FormConfig) => {
    if (!config) return;
    try {
      const token = await getToken();
      
      if (testimonial) {
        // Update existing testimonial
        await updateTestimonial(
          testimonial.id,
          {},
          config,
          token!
        );
        queryClient.invalidateQueries({ queryKey: ['testimonial', testimonial.id] });
      } else {
        // Create new testimonial
        await createTestimonial(
          { projectId },
          config,
          token!
        );
      }

      queryClient.invalidateQueries({ queryKey: ['testimonials', projectId] });
      setOpen(false);
    } catch (error) {
      console.error('Failed to save testimonial form:', error);
      alert('Failed to save form. Please try again.');
    }
  };

  const handlePreview = (config: FormConfig) => {
    setFormConfig(config);
    setShowPreview(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {testimonial ? 'Edit Testimonial Form' : 'Create Testimonial Form'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <FormBuilder
              initialConfig={formConfig}
              onSave={handleSave}
              onPreview={handlePreview}
            />
          </div>
        </DialogContent>
      </Dialog>

      {showPreview && formConfig && (
        <FormPreviewModal
          open={showPreview}
          onClose={() => setShowPreview(false)}
          config={formConfig}
        />
      )}
    </>
  );
}

