'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createTestimonial } from '@/services/testimonialsServices';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, X, Star } from 'lucide-react';
import { CustomField } from '@/types/Testimonials';

interface CreateTestimonialModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
}

export function CreateTestimonialModal({ open, setOpen, projectId }: CreateTestimonialModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState<string>('');
  const [testimonial, setTestimonial] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { key: '', label: '', type: 'text', value: '' },
    ]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index: number, field: Partial<CustomField>) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], ...field };
    setCustomFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !testimonial.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      
      // Convert custom fields to object
      const customFieldsObj: Record<string, { label: string; type: string; value: string }> = {};
      customFields.forEach((field) => {
        if (field.key && field.label) {
          customFieldsObj[field.key] = {
            label: field.label,
            type: field.type,
            value: field.value,
          };
        }
      });

      await createTestimonial(
        {
          projectId,
          name: name.trim(),
          email: email.trim() || undefined,
          company: company.trim() || undefined,
          role: role.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          rating: rating || undefined,
          testimonial: testimonial.trim(),
          customFields: Object.keys(customFieldsObj).length > 0 ? customFieldsObj : undefined,
          isPublished,
        },
        undefined,
        token || undefined
      );

      // Invalidate testimonials query
      await queryClient.invalidateQueries({ queryKey: ['testimonials', projectId] });

      // Reset form and close
      setName('');
      setEmail('');
      setCompany('');
      setRole('');
      setImageUrl('');
      setRating('');
      setTestimonial('');
      setIsPublished(false);
      setCustomFields([]);
      setOpen(false);
    } catch (error) {
      console.error('Failed to create testimonial:', error);
      alert('Failed to create testimonial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Testimonial</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="CEO"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Profile Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(rating === String(num) ? '' : String(num))}
                  className={`p-2 rounded-lg transition-colors ${
                    rating === String(num)
                      ? 'bg-flavescent text-eerie'
                      : 'bg-eerie border border-muted/30 text-muted-foreground hover:bg-onyx'
                  }`}
                >
                  <Star
                    className={`h-5 w-5 ${rating === String(num) ? 'fill-current' : ''}`}
                  />
                </button>
              ))}
              {rating && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} out of 5
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="testimonial">Testimonial *</Label>
            <Textarea
              id="testimonial"
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Write the testimonial here..."
              rows={6}
              required
              className="resize-none"
            />
          </div>

          {/* Custom Fields */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Custom Fields</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomField}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Field
              </Button>
            </div>
            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-start p-3 bg-eerie rounded-lg border border-muted/30">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Field Key (e.g., location)"
                      value={field.key}
                      onChange={(e) =>
                        updateCustomField(index, { key: e.target.value.toLowerCase().replace(/\s+/g, '_') })
                      }
                    />
                    <Input
                      placeholder="Field Label (e.g., Location)"
                      value={field.label}
                      onChange={(e) => updateCustomField(index, { label: e.target.value })}
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateCustomField(index, { type: e.target.value as CustomField['type'] })
                      }
                      className="bg-raisin border border-muted/30 rounded-lg px-3 py-2 text-foreground text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="url">URL</option>
                      <option value="email">Email</option>
                      <option value="date">Date</option>
                    </select>
                    <Input
                      placeholder="Value"
                      value={field.value}
                      onChange={(e) => updateCustomField(index, { value: e.target.value })}
                      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomField(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {customFields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No custom fields added. Click &quot;Add Field&quot; to add flexible fields.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded border-muted/30"
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Publish immediately
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !testimonial.trim()}>
              {isLoading ? 'Creating...' : 'Create Testimonial'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

