import { describe, expect, it } from 'vitest';

import {
    MAX_PROMPT_TEXT_LENGTH,
    MAX_PROMPT_TITLE_LENGTH,
    MIN_PROMPT_TEXT_LENGTH,
    PromptValidationSchema,
} from '$utils/validation/promptValidationSchema';

/**
 * Generates an object representing a valid prompt.
 *
 * @param overrides - An object to override default properties.
 * @return A prompt object.
 */
function createValidPromptData(overrides = {}) {
    return {
        id: 1,
        title: 'Test Prompt',
        text: 'This is a test prompt for testing purposes',
        isFavorited: false,
        tagIds: [1, 2, 3],
        createdAt: '2023-07-21T14:15:22Z',
        updatedAt: '2023-07-21T14:15:22Z',
        ...overrides,
    };
}

describe('PromptValidationSchema', () => {
    it('should successfully validate a valid prompt without throwing an error', () => {
        const validPromptData = createValidPromptData();

        expect(() =>
            PromptValidationSchema.parse(validPromptData)
        ).not.toThrow();
    });

    it('should throw an error if id is negative', () => {
        const invalidPromptData = createValidPromptData({ id: -1 });

        expect(() => PromptValidationSchema.parse(invalidPromptData)).toThrow(
            'Invalid input: id must be a non-negative number'
        );
    });

    it('should throw an error if title is empty', () => {
        const invalidPromptData = createValidPromptData({ title: '' });

        expect(() => PromptValidationSchema.parse(invalidPromptData)).toThrow(
            'Title is required'
        );
    });

    it('should throw an error if title is too long', () => {
        const invalidPromptData = createValidPromptData({
            title: 'a'.repeat(MAX_PROMPT_TITLE_LENGTH + 1),
        });

        expect(() => PromptValidationSchema.parse(invalidPromptData)).toThrow(
            `Title should not exceed ${MAX_PROMPT_TITLE_LENGTH} characters`
        );
    });

    it('should throw an error if text is too short', () => {
        const invalidPromptData = createValidPromptData({ text: 'ab' });

        expect(() => PromptValidationSchema.parse(invalidPromptData)).toThrow(
            `Text should have at least ${MIN_PROMPT_TEXT_LENGTH} characters`
        );
    });

    it('should throw an error if text is too long', () => {
        const invalidPromptData = createValidPromptData({
            text: 'a'.repeat(MAX_PROMPT_TEXT_LENGTH + 1),
        });

        expect(() => PromptValidationSchema.parse(invalidPromptData)).toThrow(
            `Text should not exceed ${MAX_PROMPT_TEXT_LENGTH} characters`
        );
    });

    it('should throw an error if tagIds is not an array', () => {
        const invalidPromptData = createValidPromptData({ tagIds: '1' });

        expect(() => PromptValidationSchema.parse(invalidPromptData)).toThrow(
            'Expected array, received string'
        );
    });
});
