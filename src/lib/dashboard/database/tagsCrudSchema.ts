import { createInsertSchema } from 'drizzle-zod';
import { tags } from './schema';

// Define maximum lengths for tag names
export const MAX_TAG_NAME_LENGTH = 3;

export const tagsCrudSchema = createInsertSchema(tags, {
    name: (schema) =>
        schema.name
            .nonempty('Name is required')
            .max(
                MAX_TAG_NAME_LENGTH,
                `Name should not exceed ${MAX_TAG_NAME_LENGTH} characters`
            )
            .transform((str) => str.trim()),
});
