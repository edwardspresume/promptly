import { createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { promptsTable } from '$databaseDir/schema';

import { createNonEmptyTextSchema } from './utils';

// Define Max and Min Lengths for Prompt Title and Text
export const MIN_PROMPT_TITLE_LENGTH = 1;
export const MAX_PROMPT_TITLE_LENGTH = 200;

export const MIN_PROMPT_DESCRIPTION_LENGTH = 3;
export const MAX_PROMPT_DESCRIPTION_LENGTH = 4500;

export const PromptsValidationSchema = createInsertSchema(promptsTable, {
	profileId: (schema) => schema.profileId.optional(),

	title: (schema) =>
		createNonEmptyTextSchema(
			schema.title,
			'Title',
			MIN_PROMPT_TITLE_LENGTH,
			MAX_PROMPT_TITLE_LENGTH
		),

	description: (schema) =>
		createNonEmptyTextSchema(
			schema.description,
			'Description',
			MIN_PROMPT_DESCRIPTION_LENGTH,
			MAX_PROMPT_DESCRIPTION_LENGTH
		)
});

export type PromptFormData = z.infer<typeof PromptsValidationSchema>;
