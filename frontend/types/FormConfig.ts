export type FieldType = 'text' | 'email' | 'textarea' | 'number' | 'rating' | 'url' | 'select' | 'checkbox';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  // For select fields
  options?: string[];
  // For validation
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FormConfig {
  fields: FormField[];
  title?: string;
  description?: string;
  submitButtonText?: string;
  successMessage?: string;
}

