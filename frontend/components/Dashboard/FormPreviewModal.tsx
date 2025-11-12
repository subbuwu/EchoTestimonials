'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormConfig, FormField } from '@/types/FormConfig';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface FormPreviewModalProps {
  open: boolean;
  onClose: () => void;
  config: FormConfig;
}

export function FormPreviewModal({ open, onClose, config }: FormPreviewModalProps) {
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});

  const renderField = (field: FormField) => {
    const rawValue = formData[field.id];


    switch (field.type) {
      case 'textarea': {
        const value = typeof rawValue === 'string' ? rawValue : typeof rawValue === 'number' ? String(rawValue) : typeof rawValue === 'boolean' ? String(rawValue) : '';
        return (
          <textarea
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            rows={6}
            className="w-full px-4 py-3 bg-eerie border border-muted/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        );
      }

      case 'rating': {
        const ratingValue = typeof rawValue === 'number' ? rawValue : typeof rawValue === 'string' ? parseInt(rawValue, 10) || 0 : 0;
        return (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setFormData({ ...formData, [field.id]: num })}
                className={`p-2 rounded-lg transition-colors ${
                  ratingValue >= num
                    ? 'bg-flavescent text-eerie'
                    : 'bg-eerie border border-muted/30 text-muted-foreground hover:bg-onyx'
                }`}
              >
                <Star className={`h-5 w-5 ${ratingValue >= num ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        );
      }

      case 'select': {
        const value = typeof rawValue === 'string' ? rawValue : typeof rawValue === 'number' ? String(rawValue) : typeof rawValue === 'boolean' ? String(rawValue) : '';
        return (
          <select
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
            className="w-full px-4 py-3 bg-eerie border border-muted/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }

      case 'checkbox': {
        const checked = typeof rawValue === 'boolean' ? rawValue : false;
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id={field.id}
              checked={checked}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
              required={field.required}
              className="w-5 h-5 rounded border-muted/30 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-foreground">{field.placeholder || 'I agree'}</span>
          </label>
        );
      }

      default: {
        const value = typeof rawValue === 'string' ? rawValue : typeof rawValue === 'number' ? String(rawValue) : typeof rawValue === 'boolean' ? String(rawValue) : '';
        return (
          <input
            type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
            id={field.id}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-4 py-3 bg-eerie border border-muted/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      }
    }
  };

  const sortedFields = [...config.fields].sort((a, b) => a.order - b.order);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Form Preview</DialogTitle>
        </DialogHeader>
        <div className="bg-raisin border border-muted/30 rounded-xl p-6">
          {config.title && (
            <h2 className="text-2xl font-bold text-foreground mb-2">{config.title}</h2>
          )}
          {config.description && (
            <p className="text-muted-foreground mb-6">{config.description}</p>
          )}

          <form className="space-y-6">
            {sortedFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                  {field.required && <span className="text-pink ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            <button
              type="button"
              className="w-full bg-flavescent text-eerie font-semibold py-3 px-6 rounded-lg hover:bg-flavescent/90 transition-colors"
            >
              {config.submitButtonText || 'Submit Testimonial'}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

