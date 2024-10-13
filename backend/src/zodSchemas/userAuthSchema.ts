import { z } from 'zod';

export const userLoginSchema = z.object({
    username: z.string(),
    password: z.string().min(8),
});

export const jwtPayloadSchema = z.object({
    id: z.string(),
    email: z.string().email(),
  });