import { createInsertSchema } from 'drizzle-zod';

import { profilesTable } from '$databaseDir/schema';

export const MAX_USERNAME_LENGTH = 25;
export const MAX_FULL_NAME_LENGTH = 50;

export const ProfileValidationSchema = createInsertSchema(profilesTable, {
	email: (schema) => schema.email.optional(),

	username: (schema) =>
		schema.username
			.max(MAX_USERNAME_LENGTH, `Username cannot be longer than ${MAX_USERNAME_LENGTH} characters`)
			.transform((str: string) => str.trim())
			.nullable(),

	fullName: (schema) =>
		schema.fullName
			.max(
				MAX_FULL_NAME_LENGTH,
				`Username cannot be longer than ${MAX_FULL_NAME_LENGTH} characters`
			)
			.transform((str: string) => str.trim())
			.nullable()
});
