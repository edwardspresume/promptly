import { z } from 'zod';

export const AuthEmailSchema = z.object({
	email: z
		.string()
		.email()
		.transform((email) => email.trim())
});
