import { z } from 'zod';

export const userLoginSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
});

// Zod schema for validating JWT payload
export const jwtPayloadSchema = z.object({
    id: z.string(),
    email: z.string().email(),
  });