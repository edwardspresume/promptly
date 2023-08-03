import { z } from 'zod';

export const EmailAuthSchema = z.object({
    email: z
        .string()
        .email()
        .transform((email) => email.trim()),
});
