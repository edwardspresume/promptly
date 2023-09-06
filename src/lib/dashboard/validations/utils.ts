import type { ZodString } from 'zod';

/**
 * Create a refined schema for text fields that should not be empty or contain only spaces.
 * @param {z.ZodString} schema - The Zod schema object.
 * @param {string} fieldName - The name of the field.
 * @param {number} minLength - The minimum length the field can have.
 * @param {number} maxLength - The maximum length the field can have.
 * @returns {z.ZodString} - The refined Zod schema.
 */

export function createNonEmptyTextSchema(
	schema: ZodString,
	fieldName: string,
	minLength: number,
	maxLength: number
) {
	return schema
		.min(minLength, `${fieldName} should have at least ${minLength} characters`)
		.max(maxLength, `${fieldName} should not exceed ${maxLength} characters`)
		.refine((str: string) => str.trim().length > 0, {
			message: `${fieldName} cannot be only empty spaces`
		})
		.transform((str: string) => str.trim());
}
