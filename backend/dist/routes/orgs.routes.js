"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orgs_controller_1 = require("@/controllers/orgs.controller");
const db_1 = require("@/db");
const schema_1 = require("@/db/schema");
const orgs_1 = require("@/types/orgs");
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
router.get('/', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const orgs = await (0, orgs_controller_1.getOrgsByClerkId)(clerkId);
        res.json(orgs);
    }
    catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).json({ error: 'Failed to fetch organizations' });
    }
});
router.post('/', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const result = orgs_1.createOrgSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten()
            });
        }
        const { name, slug } = result.data;
        const org = await (0, orgs_controller_1.createOrg)({ name, slug, createdBy: clerkId });
        await db_1.db.insert(schema_1.orgMembers).values({
            orgId: org[0].id,
            userId: clerkId,
            role: 'admin'
        });
        res.status(201).json(org[0]);
    }
    catch (error) {
        console.error('Error creating organization:', error);
        res.status(500).json({ error: 'Failed to create organization' });
    }
});
router.get('/:slug', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { slug } = req.params;
        const org = await (0, orgs_controller_1.getOrgBySlug)(slug, clerkId);
        if (!org) {
            return res.status(404).json({
                error: 'Organization not found or you don\'t have access to it'
            });
        }
        res.json(org);
    }
    catch (error) {
        console.error('Error fetching organization:', error);
        res.status(500).json({ error: 'Failed to fetch organization' });
    }
});
router.get('/:slug/members', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { slug } = req.params;
        const members = await (0, orgs_controller_1.getOrgMembersBySlug)(slug, clerkId);
        if (!members) {
            return res.status(404).json({
                error: 'Organization not found or you don\'t have access to it'
            });
        }
        res.json(members);
    }
    catch (error) {
        console.error('Error fetching organization members:', error);
        res.status(500).json({ error: 'Failed to fetch organization members' });
    }
});
router.get('/:slug/projects', (0, express_1.requireAuth)(), async (req, res) => {
    try {
        const clerkId = getClerkId(req);
        const { slug } = req.params;
        const projects = await (0, orgs_controller_1.getOrgProjectsBySlug)(slug, clerkId);
        if (!projects) {
            return res.status(404).json({
                error: 'Organization not found or you don\'t have access to it'
            });
        }
        res.json(projects);
    }
    catch (error) {
        console.error('Error fetching organization projects:', error);
        res.status(500).json({ error: 'Failed to fetch organization projects' });
    }
});
exports.default = router;
