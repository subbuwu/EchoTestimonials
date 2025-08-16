import { z } from "zod";

export const createUserSchema = z.object({
  clerkId: z.string().min(1, "clerkId is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().optional(),
  email: z.string().email("Invalid email"),
});
  

export type CreateUserInput = z.infer<typeof createUserSchema>;
