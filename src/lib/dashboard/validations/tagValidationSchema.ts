import { createInsertSchema } from 'drizzle-zod';

import { tagsTable } from '$databaseDir/schema';

import { createNonEmptyTextSchema } from './utils';

// Define maximum lengths for tag names
export const MIN_TAG_NAME_LENGTH = 1;
export const MAX_TAG_NAME_LENGTH = 200;

export const TagValidationSchema = createInsertSchema(tagsTable, {
	profileId: (schema) => schema.profileId.optional(),

	name: (schema) =>
		createNonEmptyTextSchema(schema.name, 'Name', MIN_TAG_NAME_LENGTH, MAX_TAG_NAME_LENGTH)
});
