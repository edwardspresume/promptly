import { tagsTable } from '$databaseDir/schema';
import { createInsertSchema } from 'drizzle-zod';

// Define maximum lengths for tag names
export const MAX_TAG_NAME_LENGTH = 200;

export const TagValidationSchema = createInsertSchema(tagsTable, {
	userId: (schema) => schema.userId.optional(),

	name: (schema) =>
		schema.name
			.nonempty('Name is required')
			.max(MAX_TAG_NAME_LENGTH, `Name should not exceed ${MAX_TAG_NAME_LENGTH} characters`)
			.transform((str) => str.trim())
});
