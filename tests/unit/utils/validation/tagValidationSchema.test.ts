import { describe, expect, it } from 'vitest';

import {
    MAX_TAG_NAME_LENGTH,
    TagValidationSchema,
} from '$utils/validation/tagValidationSchema';

/**
 * Generates an object representing a valid tag.
 *
 * @param overrides - An object to override default properties.
 * @return A tag object.
 */
function createValidTagData(overrides = {}) {
    return {
        id: 1,
        name: 'Test Tag',
        createdAt: '2023-07-21T14:15:22Z',
        updatedAt: '2023-07-21T14:15:22Z',
        ...overrides,
    };
}

describe('TagValidationSchema', () => {
    it('should successfully validate a valid tag without throwing an error', () => {
        const validTagData = createValidTagData();

        expect(() => TagValidationSchema.parse(validTagData)).not.toThrow();
    });

    it('should throw an error if id is negative', () => {
        const invalidTagData = createValidTagData({ id: -1 });

        expect(() => TagValidationSchema.parse(invalidTagData)).toThrow(
            'Invalid input: id must be a non-negative number'
        );
    });

    it('should throw an error if name is empty', () => {
        const invalidTagData = createValidTagData({ name: '' });

        expect(() => TagValidationSchema.parse(invalidTagData)).toThrow(
            'Name is required'
        );
    });

    it('should throw an error if name is too long', () => {
        const invalidTagData = createValidTagData({
            name: 'a'.repeat(MAX_TAG_NAME_LENGTH + 1),
        });

        expect(() => TagValidationSchema.parse(invalidTagData)).toThrow(
            `Name should not exceed ${MAX_TAG_NAME_LENGTH} characters`
        );
    });
});
