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
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { createOrganization } from '@/services/orgsServices';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface CreateOrganizationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateOrganizationModal({ open, setOpen }: CreateOrganizationModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const org = await createOrganization(
        {
          name: name.trim(),
          slug: slug.trim(),
        },
        token!
      );

      // Invalidate orgs query
      queryClient.invalidateQueries({ queryKey: ['orgs'] });

      // Reset form and close
      setName('');
      setSlug('');
      setOpen(false);

      // Navigate to the new org
      router.push(`/dashboard/orgs/${org.slug}`);
    } catch (error) {
      console.error('Failed to create organization:', error);
      alert('Failed to create organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                name="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Acme Inc."
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="org-slug">Slug</Label>
              <Input
                id="org-slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="acme-inc"
                required
                pattern="[a-z0-9-]+"
                title="Slug must contain only lowercase letters, numbers, and hyphens"
              />
              <p className="text-xs text-muted-foreground">
                A unique identifier for your organization (e.g., acme-inc). Only lowercase letters, numbers, and hyphens are allowed.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !slug.trim()}>
              {isLoading ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

