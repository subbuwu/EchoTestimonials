"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    clerkId: zod_1.z.string().min(1, "clerkId is required"),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    email: zod_1.z.string().email("Invalid email"),
});
