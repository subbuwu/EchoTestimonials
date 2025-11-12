import { createOrg, getOrgsByClerkId, getOrgBySlug, getOrgMembersBySlug, getOrgProjectsBySlug } from '@/controllers/orgs.controller';
import { db } from '@/db';
import { orgMembers } from '@/db/schema';
import { createOrgSchema } from '@/types/orgs';
import { getAuth, requireAuth } from '@clerk/express';
import { Router, Request, Response } from 'express';

const router = Router();

function getClerkId(req: Request): string {
  const auth = getAuth(req);
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }
  return auth.userId;
}

router.get('/', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const orgs = await getOrgsByClerkId(clerkId);
    res.json(orgs);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

router.post('/', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const result = createOrgSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: result.error.flatten() 
      });
    }

    const { name, slug } = result.data;
    const org = await createOrg({ name, slug, createdBy: clerkId });
    
    await db.insert(orgMembers).values({ 
      orgId: org[0].id, 
      userId: clerkId, 
      role: 'admin' 
    });

    res.status(201).json(org[0]);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ error: 'Failed to create organization' });
  }
});

router.get('/:slug', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { slug } = req.params;
    const org = await getOrgBySlug(slug, clerkId);
    
    if (!org) {
      return res.status(404).json({ 
        error: 'Organization not found or you don\'t have access to it' 
      });
    }

    res.json(org);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

router.get('/:slug/members', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { slug } = req.params;
    const members = await getOrgMembersBySlug(slug, clerkId);
    
    if (!members) {
      return res.status(404).json({ 
        error: 'Organization not found or you don\'t have access to it' 
      });
    }

    res.json(members);
  } catch (error) {
    console.error('Error fetching organization members:', error);
    res.status(500).json({ error: 'Failed to fetch organization members' });
  }
});

router.get('/:slug/projects', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { slug } = req.params;
    const projects = await getOrgProjectsBySlug(slug, clerkId);
    
    if (!projects) {
      return res.status(404).json({ 
        error: 'Organization not found or you don\'t have access to it' 
      });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching organization projects:', error);
    res.status(500).json({ error: 'Failed to fetch organization projects' });
  }
});

export default router;