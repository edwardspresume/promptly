import { createInsertSchema } from 'drizzle-zod';

import { promptsTable } from '$databaseDir/schema';

import { createNonEmptyTextSchema } from './utils';

// Define Max and Min Lengths for Prompt Title and Text
export const MIN_PROMPT_TITLE_LENGTH = 1;
export const MAX_PROMPT_TITLE_LENGTH = 200;

export const MIN_PROMPT_TEXT_LENGTH = 3;
export const MAX_PROMPT_TEXT_LENGTH = 4500;

export const PromptsValidationSchema = createInsertSchema(promptsTable, {
	userId: (schema) => schema.userId.optional(),

	title: (schema) =>
		createNonEmptyTextSchema(
			schema.title,
			'Title',
			MIN_PROMPT_TITLE_LENGTH,
			MAX_PROMPT_TITLE_LENGTH
		),

	text: (schema) =>
		createNonEmptyTextSchema(schema.text, 'Text', MIN_PROMPT_TEXT_LENGTH, MAX_PROMPT_TEXT_LENGTH)
});
