import { createProject, getProjectById } from '@/controllers/projects.controller';
import { getAuth, requireAuth } from '@clerk/express';
import { Router, Request } from 'express';

const router = Router();

function getClerkId(req: Request): string {
  const auth = getAuth(req);
  if (!auth.userId) {
    throw new Error('User not authenticated');
  }
  return auth.userId;
}

router.post('/', requireAuth(), async (req, res) => {
  try {
    const { name, domain, orgId } = req.body;
    
    if (!name || !orgId) {
      return res.status(400).json({ error: 'Name and orgId are required' });
    }

    const project = await createProject({ name, domain, orgId });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.get('/:id', requireAuth(), async (req, res) => {
  try {
    const clerkId = getClerkId(req);
    const { id } = req.params;
    const project = await getProjectById(id, clerkId);
    
    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or you don\'t have access to it' 
      });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

export default router;
