import z from "zod";

export const createOrgSchema = z.object({
    name : z.string().min(4, "name is required"),
    slug : z.string().min(4, "slug is required").max(10, "slug must be at most 10 characters long"),
})
