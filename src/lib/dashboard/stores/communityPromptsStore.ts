import { derived, writable } from 'svelte/store';

import type { CommunityPromptSchema } from '$databaseDir/schema';

import { sortItems } from '$dashboardUtils/sortItems';

/**
 * Store for managing the tags filter for displaying community prompts.
 */
export const communityPromptTagsFilter = writable<string[]>([]);

/**
 * Store for managing the text filter for displaying community prompts.
 */
export const communityPromptTextFilter = writable<string>('');

/**
 * Store for managing the sorting order for displaying community prompts.
 */
export const communityPromptSortOrder = writable<string>('');

/**
 * Store to manage all community prompts.
 */
export const communityPromptsStore = writable<CommunityPromptSchema[]>([]);

/**
 * Derived store to calculate the total count of community prompts.
 */
export const communityPromptTotalCount = derived(
	communityPromptsStore,
	($communityPromptsStore) => $communityPromptsStore.length
);

/**
 * Derived store to manage filtered and sorted prompts based on user preferences.
 *
 * @param {Array} prompts - List of all prompts.
 * @param {Array<string>} tagsFilter - List of tags to filter prompts by.
 * @param {string} textFilter - Text to filter prompts by.
 * @param {string} sortOption - Sorting option to apply on filtered prompts.
 * @returns {CommunityPromptSchema[]} Filtered and sorted prompts.
 */
export const filteredCommunityPromptsStore = derived(
	[
		communityPromptsStore,
		communityPromptTagsFilter,
		communityPromptTextFilter,
		communityPromptSortOrder
	],
	([prompts, tagsFilter, textFilter, sortOption]) => {
		const normalizedFilterText = textFilter.toLowerCase();

		// Apply the text filter to the prompts
		const filteredPrompts = prompts.filter((prompt) => {
			const matchesTags = tagsFilter.every(
				(filterTag) => prompt.tagPromptLink?.some((promptTag) => promptTag.tag.name === filterTag)
			);

			const matchesText = prompt.title.toLowerCase().includes(normalizedFilterText);

			return matchesTags && matchesText;
		});

		// Apply the sorting option to the filtered prompts
		return sortItems(filteredPrompts, sortOption);
	}
);
