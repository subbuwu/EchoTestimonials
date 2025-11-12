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
import { useCreateProject } from '@/hooks/useProject';
import { useQueryClient } from '@tanstack/react-query';


interface CreateProjectModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orgId: string;
  orgSlug?: string;
}

export function CreateProjectModal({ open, setOpen, orgId, orgSlug }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const createProject = useCreateProject();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    try {
      await createProject.mutateAsync({
        name: name.trim(),
        domain: domain.trim() || '',
        orgId,
      });
      
      // Invalidate org projects query
      queryClient.invalidateQueries({ queryKey: ['org-projects', orgSlug] });
      
      // Reset form and close
      setName('');
      setDomain('');
      setOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="domain">Domain (Optional)</Label>
              <Input
                id="domain"
                name="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="https://example.com"
              />
              <p className="text-xs text-muted-foreground">
                The domain where testimonials will be displayed (e.g., https://acme.com/project-name)
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                You can also embed testimonials on your website. The embed code will be available once the project is created.
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending || !name.trim()}>
              {createProject.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
