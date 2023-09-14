import { derived, writable } from 'svelte/store';

import type { PromptSchema } from '$databaseDir/schema';

import { sortItems } from '$dashboardUtils/sortItems';

/**
 * Store for managing the tags filter for displaying prompts.
 */
export const tagsFilter = writable<string[]>([]);

/**
 * Store for managing the text filter for displaying prompts.
 */
export const promptTextFilter = writable<string>('');

/**
 * Store for managing the sorting preference for displaying prompts.
 */
export const promptSortingPreference = writable<string>('');

/**
 * Store to manage all prompts.
 */
export const allPromptsStore = writable<PromptSchema[]>([]);

/**
 * Derived store to calculate the total count of prompts.
 */
export const totalPromptCountStore = derived(
	allPromptsStore,
	($allPromptsStore) => $allPromptsStore.length
);

/**
 * Derived store to manage filtered and sorted prompts based on user preferences.
 *
 * @param {Array} prompts - List of all prompts.
 * @param {Array<string>} tagsFilter - List of tags to filter prompts by.
 * @param {string} textFilter - Text to filter prompts by.
 * @param {string} sortOption - Sorting option to apply on filtered prompts.
 * @returns {Array<PromptSchema>} Filtered and sorted prompts.
 */
export const filteredPromptsStore = derived(
	[allPromptsStore, tagsFilter, promptTextFilter, promptSortingPreference],
	([prompts, tagsFilter, textFilter, sortOption]) => {
		const normalizedFilterText = textFilter.toLowerCase();

		// Apply the text filter to the prompts
		const filteredPrompts = prompts.filter((prompt) => {
			const matchesTags = tagsFilter.every((tag) => prompt.tagIds?.includes(tag));

			const matchesText = prompt.title.toLowerCase().includes(normalizedFilterText);

			return matchesTags && matchesText;
		});

		// Apply the sorting option to the filtered prompts
		return sortItems(filteredPrompts, sortOption);
	}
);
