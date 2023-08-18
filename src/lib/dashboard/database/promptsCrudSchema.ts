import { createInsertSchema } from 'drizzle-zod';
import { prompts } from './schema';

// Define Max and Min Lengths for Prompt Title and Text
export const MAX_PROMPT_TITLE_LENGTH = 200;
export const MIN_PROMPT_TEXT_LENGTH = 3;
export const MAX_PROMPT_TEXT_LENGTH = 4500;

export const promptsCrudSchema = createInsertSchema(prompts, {
    userId: (schema) => schema.userId.optional(),

    title: (schema) =>
        schema.title
            .nonempty('Title is required')
            .max(
                MAX_PROMPT_TITLE_LENGTH,
                `Title should not exceed ${MAX_PROMPT_TITLE_LENGTH} characters`
            )
            .transform((str) => str.trim()),

    text: (schema) =>
        schema.text
            .min(
                MIN_PROMPT_TEXT_LENGTH,
                ` Text should have at least ${MIN_PROMPT_TEXT_LENGTH} characters`
            )
            .max(
                MAX_PROMPT_TEXT_LENGTH,
                `Text should not exceed ${MAX_PROMPT_TEXT_LENGTH} characters`
            )
            .transform((str) => str.trim()),
});
