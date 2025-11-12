"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const projects_controller_1 = require("@/controllers/projects.controller");
const express_1 = require("@clerk/express");
const express_2 = require("express");
const router = (0, express_2.Router)();
function getClerkId(req) {
    const auth = (0, express_1.getAuth)(req);
    if (!auth.userId) {
        throw new Error('User not authenticated');
    }
    return auth.userId;
}
router.post('/', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const { name, domain, orgId } = req.body;
        if (!name || !orgId) {
            return res.status(400).json({ error: 'Name and orgId are required' });
        }
        const project = await (0, projects_controller_1.createProject)({ name, domain, orgId });
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});
router.get('/:id', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { id } = req.params;
        const project = await (0, projects_controller_1.getProjectById)(id, clerkId);
        if (!project) {
            return res.status(404).json({
                error: 'Project not found or you don\'t have access to it'
            });
        }
        res.json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});
exports.default = router;
