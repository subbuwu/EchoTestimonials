"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.post('/', (0, express_1.requireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, domain, orgId } = req.body;
        if (!name || !orgId) {
            return res.status(400).json({ error: 'Name and orgId are required' });
        }
        const project = yield (0, projects_controller_1.createProject)({ name, domain, orgId });
        res.status(201).json(project);
    }
    catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
}));
router.get('/:id', (0, express_1.requireAuth)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clerkId = getClerkId(req);
        const { id } = req.params;
        const project = yield (0, projects_controller_1.getProjectById)(id, clerkId);
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
}));
exports.default = router;
