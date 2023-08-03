import { beforeEach, describe, expect, it } from 'vitest';

import { get } from 'svelte/store';

import defaultPrompts from '$dashboardData/defaultPrompts';
import { createPromptsStore } from '$dashboardStores/promptsStore';
import type { PromptStore } from '$dashboardTypes';
import { LocalStorageKeys } from '$dashboardUtils/localStorage';
import { compareStrings } from '$dashboardUtils/sortItems';

describe('Prompts Store Functionality', () => {
    let promptsStore: PromptStore;

    beforeEach(() => {
        promptsStore = createPromptsStore(LocalStorageKeys.PROMPTS);
    });

    it('Initializes with default prompts if local storage is empty', () => {
        const { allPrompts } = promptsStore;
        expect(get(allPrompts)).toEqual(defaultPrompts);
    });

    it('Creates a new prompt', () => {
        const { allPrompts, createPrompt } = promptsStore;

        const newPromptName = 'newPrompt';

        createPrompt({
            title: newPromptName,
            isFavorited: true,
            tagIds: [1],
        });

        expect(get(allPrompts)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: newPromptName,
                }),
            ])
        );
    });

    it('Updates a prompt', () => {
        const { allPrompts, updatePrompt } = promptsStore;

        const newPromptName = 'updatedPrompt';
        updatePrompt(1, { title: newPromptName });

        expect(get(allPrompts)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: 1,
                    title: newPromptName,
                }),
            ])
        );
    });

    it('Deletes a prompt', () => {
        const { allPrompts, deletePrompt } = promptsStore;

        deletePrompt(1);

        expect(get(allPrompts)).not.toContainEqual(
            expect.objectContaining({ id: 1 })
        );
    });

    it('Deletes all prompts', () => {
        const { allPrompts, deleteAllPrompts } = promptsStore;

        deleteAllPrompts();

        expect(get(allPrompts)).toEqual([]);
    });

    it('Sets and clears a text filter', () => {
        const { setTextFilter, filteredPrompts, allPrompts } = promptsStore;

        setTextFilter('Exploring Mars');

        expect(get(filteredPrompts)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: 'Exploring Mars',
                }),
            ])
        );

        setTextFilter('');
        expect(get(filteredPrompts)).toEqual(get(allPrompts));
    });

    it('Returns the correct total prompt count', () => {
        const { totalPromptCount, allPrompts, createPrompt } = promptsStore;

        expect(get(totalPromptCount)).toBe(get(allPrompts).length);

        createPrompt({ title: 'newPrompt' });

        expect(get(totalPromptCount)).toBe(get(allPrompts).length);
    });

    it('Correctly sets sorting preference and reorders prompts', () => {
        const { setSortingPreference, filteredPrompts } = promptsStore;

        // Test ascending order
        setSortingPreference('title:ascending');
        const sortedByTitleAsc = [...get(filteredPrompts)].sort((a, b) =>
            compareStrings(a.title, b.title)
        );
        expect(get(filteredPrompts)).toEqual(sortedByTitleAsc);

        // Test descending order
        setSortingPreference('title:descending');
        const sortedByTitleDesc = [...get(filteredPrompts)].sort((a, b) =>
            compareStrings(b.title, a.title)
        );
        expect(get(filteredPrompts)).toEqual(sortedByTitleDesc);

        // Test default order
        setSortingPreference('default:default');
        expect(get(filteredPrompts)).toEqual(get(promptsStore.allPrompts));
    });
});
