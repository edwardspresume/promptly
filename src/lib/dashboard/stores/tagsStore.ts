import { derived, get, writable } from 'svelte/store';

import type { TagSchema } from '$databaseDir/schema';

import { sortItems } from '$dashboardUtils/sortItems';

/**
 * Store for managing the text filter for displaying tags.
 */
export const tagTextFilter = writable<string>('');

/**
 * Store for managing the sorting preference for displaying tags.
 */
export const tagSortingPreference = writable<string>('');

/**
 * Store to manage all tags.
 */
export const allTagsStore = writable<TagSchema[]>([]);

/**
 * Derived store to calculate the total count of tags.
 */
export const totalTagsCountStore = derived(allTagsStore, ($allTagsStore) => $allTagsStore.length);

/**
 * Derived store to manage filtered and sorted tags based on user preferences.
 *
 * @param {Array} tags - List of all tags.
 * @param {string} textFilter - Text to filter tags by.
 * @param {string} sortOption - Sorting option to apply on filtered tags.
 * @returns {Array<TagSchema>} Filtered and sorted tags.
 */
export const filteredTagsStore = derived(
	[allTagsStore, tagTextFilter, tagSortingPreference],
	([tags, textFilter, sortOption]) => {
		const normalizedFilterText = textFilter.toLowerCase();

		// Apply the text filter to the tags
		const filteredTags = tags.filter((tag) =>
			tag.name.toLowerCase().includes(normalizedFilterText)
		);

		// Apply the sorting option to the filtered tags
		return sortItems(filteredTags, sortOption);
	}
);

/**
 * Checks if a tag with a specific name exists in the list.
 * @param {string} tagName Name of the tag to check
 * @returns {boolean} true if tag exists, false otherwise
 */
export const doesTagExist = (tagName: string) => {
	const normalizedName = tagName.trim().toLowerCase();

	const currentTags = get(allTagsStore);

	return currentTags.some((tag) => tag.name.toLowerCase() === normalizedName);
};
