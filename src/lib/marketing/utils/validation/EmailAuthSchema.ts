import { z } from 'zod';

export const EmailAuthSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email()
        .transform((email) => email.trim()),
});
