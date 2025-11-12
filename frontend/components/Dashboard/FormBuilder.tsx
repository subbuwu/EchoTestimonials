'use client';
import { useState, useEffect } from 'react';
import { FormConfig, FormField, FieldType } from '@/types/FormConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Save,
  X,
} from 'lucide-react';

interface FormBuilderProps {
  initialConfig: FormConfig | null;
  onSave: (config: FormConfig) => Promise<void>;
  onPreview: (config: FormConfig) => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'rating', label: 'Rating (Stars)' },
  { value: 'url', label: 'URL' },
  { value: 'select', label: 'Select (Dropdown)' },
  { value: 'checkbox', label: 'Checkbox' },
];

interface SortableFieldItemProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}

function SortableFieldItem({ field, onUpdate, onRemove }: SortableFieldItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [localOptions, setLocalOptions] = useState<string[]>(field.options || []);

  useEffect(() => {
    setLocalOptions(field.options || []);
  }, [field.options]);

  const addOption = () => {
    const newOptions = [...localOptions, ''];
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions.filter(opt => opt.trim() !== '') });
  };

  const removeOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-eerie border border-muted/30 rounded-lg p-4 space-y-3 ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing pt-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Field Label</Label>
              <Input
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="Field Label"
              />
            </div>
            <div>
              <Label>Field Type</Label>
              <select
                value={field.type}
                onChange={(e) => {
                  const updates: Partial<FormField> = { type: e.target.value as FieldType };
                  if (e.target.value === 'select') {
                    updates.options = ['Option 1', 'Option 2'];
                    setLocalOptions(['Option 1', 'Option 2']);
                  } else {
                    updates.options = undefined;
                    setLocalOptions([]);
                  }
                  onUpdate(updates);
                }}
                className="w-full bg-raisin border border-muted/30 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Placeholder</Label>
            <Input
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="Enter placeholder text"
            />
          </div>

          {field.type === 'select' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="flex items-center gap-1 h-7"
                >
                  <Plus className="h-3 w-3" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {localOptions.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-3 bg-raisin rounded-lg border border-muted/30 text-center">
                    No options added. Click &quot;Add Option&quot; to add options.
                  </div>
                ) : (
                  localOptions.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(optIndex)}
                        className="text-destructive hover:text-destructive h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="w-4 h-4 rounded border-muted/30"
              />
              <span className="text-sm text-foreground">Required</span>
            </label>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function FormBuilder({ initialConfig, onSave, onPreview }: FormBuilderProps) {
  const [config, setConfig] = useState<FormConfig>(
    initialConfig || {
      fields: [
        { id: 'name', type: 'text', label: 'Your Name', required: true, order: 1 },
        { id: 'email', type: 'email', label: 'Your Email', required: false, order: 2 },
        { id: 'testimonial', type: 'textarea', label: 'Your Testimonial', required: true, order: 3 },
      ],
      title: 'Share Your Experience',
      description: 'We would love to hear from you!',
      submitButtonText: 'Submit Testimonial',
      successMessage: 'Thank you! Your testimonial has been submitted.',
    }
  );
  const [saving, setSaving] = useState(false);

  // Initialize sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter value',
      required: false,
      order: config.fields.length + 1,
    };
    setConfig({
      ...config,
      fields: [...config.fields, newField],
    });
  };

  // Check for required fields for proper submission
  const hasNameField = config.fields.some(f => f.id === 'name' || (f.type === 'text' && f.required));
  const hasTextareaField = config.fields.some(f => f.type === 'textarea' && f.required);
  const hasRequiredFields = hasNameField && hasTextareaField;

  const removeField = (fieldId: string) => {
    const newFields = config.fields
      .filter((f) => f.id !== fieldId)
      .map((f, idx) => ({ ...f, order: idx + 1 }));
    setConfig({
      ...config,
      fields: newFields,
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setConfig({
      ...config,
      fields: config.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = config.fields.findIndex((f) => f.id === active.id);
      const newIndex = config.fields.findIndex((f) => f.id === over.id);

      const newFields = arrayMove(config.fields, oldIndex, newIndex);
      // Update order numbers
      const reorderedFields = newFields.map((f, idx) => ({
        ...f,
        order: idx + 1,
      }));

      setConfig({
        ...config,
        fields: reorderedFields,
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(config);
    } catch (error) {
      console.error('Failed to save form config:', error);
      alert('Failed to save form configuration');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    onPreview(config);
  };

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <div className="bg-raisin border border-muted/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Form Settings</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={config.title || ''}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="Share Your Experience"
            />
          </div>
          <div>
            <Label htmlFor="form-description">Description</Label>
            <Textarea
              id="form-description"
              value={config.description || ''}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="We would love to hear from you!"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="submit-text">Submit Button Text</Label>
              <Input
                id="submit-text"
                value={config.submitButtonText || ''}
                onChange={(e) => setConfig({ ...config, submitButtonText: e.target.value })}
                placeholder="Submit Testimonial"
              />
            </div>
            <div>
              <Label htmlFor="success-message">Success Message</Label>
              <Input
                id="success-message"
                value={config.successMessage || ''}
                onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
                placeholder="Thank you for your testimonial!"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-raisin border border-muted/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Form Fields</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Drag and drop to reorder fields. Add and configure fields for your testimonial form. At least one required text field (for name) and one required textarea (for testimonial) are recommended.
            </p>
          </div>
          <Button onClick={addField} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>

        {!hasRequiredFields && (
          <div className="mb-4 p-3 bg-blue/10 border border-blue/30 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-blue mt-0.5">💡</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">Form Validation Tip</p>
                <p className="text-xs text-muted-foreground">
                  For best results, include at least one <strong>required text field</strong> (for customer name) and one <strong>required textarea field</strong> (for the testimonial content). The form will automatically map these fields during submission.
                </p>
              </div>
            </div>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={config.fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {config.fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onRemove={() => removeField(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button onClick={handlePreview} variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Form'}
        </Button>
      </div>
    </div>
  );
}
