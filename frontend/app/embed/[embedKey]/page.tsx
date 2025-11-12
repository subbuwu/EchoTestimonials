'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormConfig, FormField } from '@/types/FormConfig';
import { api } from '@/lib/api';
import { Star, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function EmbedTestimonialPage() {
  const { embedKey } = useParams<{ embedKey: string }>();
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (embedKey) {
      fetchFormConfig();
    }

  }, [embedKey]);

  const fetchFormConfig = async () => {
    try {
      const response = await api.get(`/testimonials/public/${embedKey}`);
      const testimonial = response.data;
      const config = testimonial.formConfig;
      
      // If no config exists, use default
      if (!config || !config.fields || config.fields.length === 0) {
        setFormConfig({
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
        });
      } else {
        setFormConfig(config);
      }
    } catch (err: unknown) {
      console.error('Error fetching form config:', err);
      if ((err as { response?: { status?: number } })?.response?.status === 404) {
        setError('This testimonial form could not be found. Please check your link and try again.');
      } else {
        setError('Failed to load form. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formConfig) return false;
    
    const errors: Record<string, string> = {};
    let hasNameField = false;
    let hasTestimonialField = false;

    // Check all required fields
    formConfig.fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors[field.id] = `${field.label} is required`;
        }
        
        // Track if we have name and testimonial fields
        if (field.type === 'text' && field.required && !hasNameField) {
          hasNameField = true;
        }
        if (field.type === 'textarea' && field.required && !hasTestimonialField) {
          hasTestimonialField = true;
        }
      }
    });

    // Validate that we have at least a name and testimonial
    if (!hasNameField) {
      const nameField = formConfig.fields.find(f => f.id === 'name') || 
                       formConfig.fields.find(f => f.type === 'text' && f.required) ||
                       formConfig.fields.find(f => f.type === 'text');
      if (nameField && !formData[nameField.id]) {
        errors[nameField.id] = 'Please provide your name';
      }
    }

    if (!hasTestimonialField) {
      const testimonialField = formConfig.fields.find(f => f.id === 'testimonial') ||
                              formConfig.fields.find(f => f.type === 'textarea');
      if (testimonialField && !formData[testimonialField.id]) {
        errors[testimonialField.id] = 'Please provide your testimonial';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    setSubmitting(true);

    try {
      // Find name field - prefer field with id 'name', otherwise first required text field
      let nameValue = '';
      const nameFieldValue = formData.name;
      if (nameFieldValue && typeof nameFieldValue === 'string') {
        nameValue = nameFieldValue;
      }
      if (!nameValue) {
        const nameField = formConfig!.fields.find(f => f.id === 'name') || 
                         formConfig!.fields.find(f => f.type === 'text' && f.required) ||
                         formConfig!.fields.find(f => f.type === 'text');
        if (nameField) {
          const fieldValue = formData[nameField.id];
          if (fieldValue && typeof fieldValue === 'string') {
            nameValue = fieldValue;
          }
        }
      }

      // Find testimonial field - prefer field with id 'testimonial', otherwise first textarea
      let testimonialValue = '';
      const testimonialFieldValue = formData.testimonial;
      if (testimonialFieldValue && typeof testimonialFieldValue === 'string') {
        testimonialValue = testimonialFieldValue;
      }
      if (!testimonialValue) {
        const testimonialField = formConfig!.fields.find(f => f.id === 'testimonial') ||
                                formConfig!.fields.find(f => f.type === 'textarea');
        if (testimonialField) {
          const fieldValue = formData[testimonialField.id];
          if (fieldValue && typeof fieldValue === 'string') {
            testimonialValue = fieldValue;
          }
        }
      }

      // Final validation
      if (!nameValue || !testimonialValue) {
        setError('Please provide both your name and testimonial.');
        setSubmitting(false);
        return;
      }

      const testimonialData: Record<string, string | Record<string, unknown>> = {
        name: nameValue,
        testimonial: testimonialValue,
      };

      // Extract standard fields if they exist in form data
      if (formData.email && typeof formData.email === 'string') testimonialData.email = formData.email.trim();
      if (formData.company && typeof formData.company === 'string') testimonialData.company = formData.company.trim();
      if (formData.role && typeof formData.role === 'string') testimonialData.role = formData.role.trim();
      if (formData.imageUrl && typeof formData.imageUrl === 'string') testimonialData.imageUrl = formData.imageUrl.trim();
      if (formData.rating) testimonialData.rating = String(formData.rating);

      // Extract all other fields as custom fields
      const standardFieldIds = ['name', 'email', 'company', 'role', 'imageUrl', 'rating', 'testimonial'];
      const customFields: Record<string, { label: string; type: string; value: string | number | boolean }> = {};
      
      formConfig!.fields.forEach((field) => {
        if (!standardFieldIds.includes(field.id) && formData[field.id]) {
          customFields[field.id] = {
            label: field.label,
            type: field.type,
            value: formData[field.id],
          };
        }
      });

      if (Object.keys(customFields).length > 0) {
        testimonialData.customFields = customFields;
      }

      await api.post(`/testimonials/public/${embedKey}`, testimonialData);
      setSuccess(true);
      setFormData({});
    } catch (err: unknown) {
      console.error('Submission error:', err);
      const errorMessage = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to submit testimonial. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const rawValue = formData[field.id];
    const value = typeof rawValue === 'string' ? rawValue : typeof rawValue === 'number' ? String(rawValue) : typeof rawValue === 'boolean' ? String(rawValue) : '';
    const hasError = !!fieldErrors[field.id];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => {
              setFormData({ ...formData, [field.id]: e.target.value });
              if (fieldErrors[field.id]) {
                setFieldErrors({ ...fieldErrors, [field.id]: '' });
              }
            }}
            placeholder={field.placeholder}
            required={field.required}
            rows={6}
            className={`w-full px-4 py-3 text-black bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
              hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
        );

      case 'rating':
        const ratingValue = typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? parseInt(rawValue, 10) || 0 : 0;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, [field.id]: num });
                  if (fieldErrors[field.id]) {
                    setFieldErrors({ ...fieldErrors, [field.id]: '' });
                  }
                }}
                className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                  ratingValue >= num
                    ? 'bg-yellow-400 text-gray-900 shadow-md'
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                <Star className={`h-6 w-6 ${ratingValue >= num ? 'fill-current' : ''}`} />
              </button>
            ))}
            {ratingValue > 0 && (
              <span className="text-sm text-gray-600 ml-2">
                {ratingValue} out of 5
              </span>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => {
              setFormData({ ...formData, [field.id]: e.target.value });
              if (fieldErrors[field.id]) {
                setFieldErrors({ ...fieldErrors, [field.id]: '' });
              }
            }}
            required={field.required}
            className={`w-full px-4 py-3 text-black bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => {
                setFormData({ ...formData, [field.id]: e.target.checked });
                if (fieldErrors[field.id]) {
                  setFieldErrors({ ...fieldErrors, [field.id]: '' });
                }
              }}
              required={field.required}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 text-black focus:ring-blue-500"
            />
            <span className="text-gray-700">{field.placeholder || 'I agree'}</span>
          </label>
        );

      default:
        return (
          <input
            type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
            id={field.id}
            value={value}
            onChange={(e) => {
              setFormData({ ...formData, [field.id]: e.target.value });
              if (fieldErrors[field.id]) {
                setFieldErrors({ ...fieldErrors, [field.id]: '' });
              }
            }}
            placeholder={field.placeholder}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            pattern={field.validation?.pattern}
            className={`w-full px-4 py-3 text-black bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error && !formConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Please check your link and try again.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            {formConfig?.successMessage || 'Your testimonial has been submitted successfully.'}
          </p>
          <p className="text-sm text-gray-500">
            We appreciate you taking the time to share your experience with us.
          </p>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return null;
  }

  const sortedFields = [...formConfig.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-10">
          {formConfig?.title && (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{formConfig.title}</h1>
          )}
          {formConfig?.description && (
            <p className="text-gray-600 mb-8 text-lg">{formConfig.description}</p>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium mb-1">Submission Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {sortedFields.map((field) => {
              const hasError = !!fieldErrors[field.id];
              return (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="block text-sm font-semibold text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {hasError && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {fieldErrors[field.id]}
                    </p>
                  )}
                </div>
              );
            })}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  formConfig?.submitButtonText || 'Submit Testimonial'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
