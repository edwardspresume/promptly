import { z } from 'zod';

// Define Max and Min Lengths for Prompt Title and Text
export const MAX_PROMPT_TITLE_LENGTH = 200;
export const MIN_PROMPT_TEXT_LENGTH = 3;
export const MAX_PROMPT_TEXT_LENGTH = 4500;

export const PromptValidationSchema = z.object({
    id: z
        .number()
        .nonnegative('Invalid input: id must be a non-negative number'),

    // Ensures nonempty strings, not exceeding max length, and removes leading/trailing white spaces
    title: z
        .string()
        .nonempty('Title is required')
        .max(
            MAX_PROMPT_TITLE_LENGTH,
            `Title should not exceed ${MAX_PROMPT_TITLE_LENGTH} characters`
        )
        .transform((str) => str.trim()),

    // Ensures nonempty strings, within length bounds, and removes leading/trailing white spaces
    text: z
        .string()
        .min(
            MIN_PROMPT_TEXT_LENGTH,
            ` Text should have at least ${MIN_PROMPT_TEXT_LENGTH} characters`
        )
        .max(
            MAX_PROMPT_TEXT_LENGTH,
            `Text should not exceed ${MAX_PROMPT_TEXT_LENGTH} characters`
        )
        .transform((str) => str.trim()),

    isFavorited: z.boolean(),
    tagIds: z.array(z.number()),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
