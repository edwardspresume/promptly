import { z } from 'zod';

// Define maximum lengths for tag names
export const MAX_TAG_NAME_LENGTH = 200;

export const TagValidationSchema = z.object({
    id: z
        .number()
        .nonnegative('Invalid input: id must be a non-negative number'),

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
