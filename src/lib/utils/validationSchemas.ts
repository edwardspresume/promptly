import { z } from 'zod';

// Define maximum lengths for prompt and tag names
const MAX_PROMPT_TITLE_LENGTH = 50;
const MAX_PROMPT_TEXT_LENGTH = 500;
const MAX_TAG_NAME_LENGTH = 50;

// Validation schema for Prompt
export const PromptValidationSchema = z.object({
    id: z.number().nonnegative(),

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

// Validation schema for Tag
export const TagValidationSchema = z.object({
    id: z.number().nonnegative(),

    // Ensures nonempty strings, not exceeding max length, and removes leading/trailing white spaces
    name: z
        .string()
        .nonempty('Name is required')
        .max(
            MAX_TAG_NAME_LENGTH,
            `Name should not exceed ${MAX_TAG_NAME_LENGTH} characters`
        )
        .transform((str) => str.trim()),

    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});
