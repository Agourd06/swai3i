import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(4, 'Password must be at least 6 characters')
        .min(1, 'Password is required'),
});

export type LoginValidationType = z.infer<typeof loginSchema>; 