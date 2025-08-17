import { createOrg, getOrgsByClerkId, getOrgBySlug, getOrgMembersBySlug, getOrgProjectsBySlug } from "@/controllers/orgs.controller";
import { db } from "@/db";
import { orgMembers } from "@/db/schema";
import { createOrgSchema } from "@/types/orgs";
import { getAuth, requireAuth } from "@clerk/express";
import { Router } from "express";

const router = Router();

// Get all organizations for the authenticated user
router.get("/", requireAuth(), async (req, res) => {
    try {
        const auth = getAuth(req);   
        const clerkId = auth.userId;
        const orgs = await getOrgsByClerkId(clerkId!);

        res.json(orgs);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ error: "Failed to fetch organizations" });
    }
});

// Create a new organization
router.post("/create", requireAuth(), async (req, res) => {
    try {
        const auth = getAuth(req);
        const clerkId = auth.userId;

        const result = createOrgSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ 
                error: "Validation failed", 
                details: result.error.flatten() 
            });
        }

        const { name, slug } = result.data;

        // Create the organization in the db
        const org = await createOrg({ name, slug, createdBy: clerkId! });
        
        // Add org member for current user as admin
        await db.insert(orgMembers).values({ 
            orgId: org[0].id, 
            userId: clerkId!, 
            role: "admin" 
        });

        res.status(201).json(org[0]);
    } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ error: "Failed to create organization" });
    }
});

// Get organization details by slug
router.get("/:slug", requireAuth(), async (req, res) => {
    try {
        const auth = getAuth(req);
        const clerkId = auth.userId;
        const { slug } = req.params;

        const org = await getOrgBySlug(slug, clerkId!);
        
        if (!org) {
            return res.status(404).json({ 
                error: "Organization not found or you don't have access to it" 
            });
        }

        res.json(org);
    } catch (error) {
        console.error("Error fetching organization:", error);
        res.status(500).json({ error: "Failed to fetch organization" });
    }
});

// Get organization members by slug
router.get("/:slug/members", requireAuth(), async (req, res) => {
    try {
        const auth = getAuth(req);
        const clerkId = auth.userId;
        const { slug } = req.params;

        const members = await getOrgMembersBySlug(slug, clerkId!);
        
        if (!members) {
            return res.status(404).json({ 
                error: "Organization not found or you don't have access to it" 
            });
        }

        res.json(members);
    } catch (error) {
        console.error("Error fetching organization members:", error);
        res.status(500).json({ error: "Failed to fetch organization members" });
    }
});

// Get organization projects by slug
router.get("/:slug/projects", requireAuth(), async (req, res) => {
    try {
        const auth = getAuth(req);
        const clerkId = auth.userId;
        const { slug } = req.params;

        const projects = await getOrgProjectsBySlug(slug, clerkId!);
        
        if (!projects) {
            return res.status(404).json({ 
                error: "Organization not found or you don't have access to it" 
            });
        }

        res.json(projects);
    } catch (error) {
        console.error("Error fetching organization projects:", error);
        res.status(500).json({ error: "Failed to fetch organization projects" });
    }
});

export default router;