import { z } from 'zod';

// Define maximum lengths for prompt title and text
const MAX_PROMPT_TITLE_LENGTH = 200;
const MAX_PROMPT_TEXT_LENGTH = 4500;

const PromptValidationSchema = z.object({
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
        .nonempty('Text is required')
        .min(3, ' Text should have at least 3 characters')
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

export default PromptValidationSchema;
