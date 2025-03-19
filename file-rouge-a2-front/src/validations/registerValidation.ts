import { z } from 'zod';
import { UserRole } from '../types/auth.types';

export const registerSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .min(1, 'Username is required'),
    email: z.string()
        .email('Invalid email address')
        .min(1, 'Email is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string()
    .regex(/^(?:\+212|0)([5-7]\d{8})$/, 'Invalid  phone number')
    .min(1, 'Phone number is required'),
    adress: z.string()
        .min(5, 'Address must be at least 5 characters')
        .min(1, 'Address is required'),
    role: z.nativeEnum(UserRole, {
        errorMap: () => ({ message: 'Please select a valid role' }),
    }),
});

export type RegisterValidationType = z.infer<typeof registerSchema>; 