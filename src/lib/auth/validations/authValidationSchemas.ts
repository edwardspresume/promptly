import { z } from 'zod';

export const EmailAuthValidationSchema = z.object({
	email: z
		.string()
		.email()
		.transform((email) => email.trim()),

	formType: z.string()
});

export const OAuthProviderValidationSchema = z.object({
	provider: z.enum(['Google', 'Discord', 'Github'])
});
