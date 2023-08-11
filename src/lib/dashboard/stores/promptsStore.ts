import { derived, get, writable } from 'svelte/store';

import defaultPrompts from '$dashboardData/defaultPrompts';
import type { PromptSchema, PromptStore } from '$dashboardTypes';

import {
    LocalStorageKeys,
    loadItemsFromLocalStorage,
    updateStoreAndSaveToStorage,
} from '$dashboardUtils/localStorage';

import { createDate } from '$dashboardUtils/functions';
import { sortItems } from '$dashboardUtils/sortItems';

/**
 * This function creates a prompts store using the specified local storage key.
 * It retrieves existing prompts, provides methods for prompt manipulation, and manages filtered and sorted prompts.
 *
 * @param {LocalStorageKeys.PROMPTS} localStorageKey - the key used to retrieve and store prompts data from/in local storage
 * @returns {PromptStore} a prompt store with various utility methods
 */
export function createPromptsStore(
    localStorageKey: typeof LocalStorageKeys.PROMPTS
): PromptStore {
    const initialPrompts = loadItemsFromLocalStorage(
        localStorageKey,
        defaultPrompts
    );

    const allPrompts = writable(initialPrompts);
    const textFilter = writable<string>('');
    const tagsFilter = writable<number[]>([]);
    const sortingPreference = writable<string>('');

    /**
     * Derives the total prompt count from allPrompts
     * @returns {number} the total prompt count
     */
    const totalPromptCount = derived(allPrompts, (prompts) => prompts.length);

    /**
     * Derives filtered and sorted prompts based on filter text and sort option
     */
    const filteredPrompts = derived(
        [allPrompts, textFilter, tagsFilter, sortingPreference],
        ([prompts, filterText, tagsFilter, sortOption]) => {
            const normalizedFilterText = filterText.toLowerCase();

            const filteredPrompts = prompts.filter((prompt) => {
                const matchesTags = tagsFilter.every((tag) =>
                    prompt.tagIds.includes(tag)
                );

                const matchesText = prompt.title
                    .toLowerCase()
                    .includes(normalizedFilterText);

                return matchesTags && matchesText;
            });

            return sortItems(filteredPrompts, sortOption);
        }
    );

    /**
     * Creates a new prompt with the specified data
     * @param {Partial<PromptSchema>} prompt - the prompt to create
     */
    const createPrompt = (prompt: Partial<PromptSchema>) => {
        const prompts = get(allPrompts);
        const maxId = Math.max(...prompts.map((prompt) => prompt.id), 0);

        const newPrompt: PromptSchema = {
            id: maxId + 1,
            ...prompt,
            createdAt: createDate(),
            updatedAt: createDate(),
        } as PromptSchema;

        updateStoreAndSaveToStorage(
            allPrompts,
            (prompts) => [newPrompt, ...prompts],
            localStorageKey
        );
    };

    /**
     * Updates an existing prompt with the specified data
     * @param {number} id - the id of the prompt to update
     * @param {Partial<PromptSchema>} updatedPrompt - the updated prompt data
     */
    const updatePrompt = (id: number, updatedPrompt: Partial<PromptSchema>) => {
        updateStoreAndSaveToStorage(
            allPrompts,
            (prompts) =>
                prompts.map((prompt) =>
                    prompt.id !== id
                        ? prompt
                        : {
                              ...prompt,
                              ...updatedPrompt,
                              updatedAt: createDate(),
                          }
                ),
            localStorageKey
        );
    };

    /**
     * Deletes a prompt with the specified ID from the store
     * @param {number} id - the id of the prompt to delete
     */
    const deletePrompt = (id: number) => {
        updateStoreAndSaveToStorage(
            allPrompts,
            (items) => items.filter((item) => item.id !== id),
            localStorageKey
        );
    };

    /**
     * Deletes all prompts from the store
     */
    const deleteAllPrompts = () => {
        updateStoreAndSaveToStorage(allPrompts, () => [], localStorageKey);
    };

    /**
     * Toggles the favorite status of a prompt with the specified ID
     * @param {number} id - the id of the prompt to toggle
     */
    const toggleFavorite = (id: number) => {
        updateStoreAndSaveToStorage(
            allPrompts,
            (prompts) =>
                prompts.map((prompt) =>
                    prompt.id !== id
                        ? prompt
                        : {
                              ...prompt,
                              isFavorited: !prompt.isFavorited,
                              updatedAt: createDate(),
                          }
                ),
            localStorageKey
        );
    };

    /**
     * Sets the text filter to the specified text
     * @param {string} text - the text to set the filter to
     */
    const setTextFilter = (text: string) => textFilter.set(text);

    /**
     * Sets the tag filter to the specified tags
     * @param {number[]} tagIds - the tag IDs to set the filter to
     */
    const setTagFilter = (tagIds: number[]) => tagsFilter.set(tagIds);

    /**
     * Sets the sorting preference to the specified option
     * @param {string} option - the option to set the sorting preference to
     */
    const setSortingPreference = (option: string) =>
        sortingPreference.set(option);

    return {
        allPrompts,
        filteredPrompts,
        totalPromptCount,
        createPrompt,
        updatePrompt,
        deletePrompt,
        deleteAllPrompts,
        toggleFavorite,
        setTextFilter,
        setTagFilter,
        setSortingPreference,
    };
}

const promptsStore = createPromptsStore(LocalStorageKeys.PROMPTS);

export default promptsStore;
