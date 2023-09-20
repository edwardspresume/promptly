import { derived, get, writable } from 'svelte/store';

import type { TagSchema } from '$databaseDir/schema';

import { sortItems } from '$dashboardUtils/sortItems';
import { sanitizeContentOnClient } from '$globalUtils';

/**
 * Store for managing the text filter for displaying tags.
 */
export const userTagTextFilter = writable<string>('');

/**
 * Store for managing the sorting preference for displaying tags.
 */
export const userTagSortingPreference = writable<string>('');

/**
 * Store to manage all tags.
 */
export const userTagsStore = writable<TagSchema[]>([]);

/**
 * Derived store to calculate the total count of tags.
 */
export const userTagsTotalCountStore = derived(
	userTagsStore,
	($allTagsStore) => $allTagsStore.length
);

/**
 * Derived store to manage filtered and sorted tags based on user preferences.
 *
 * @param {Array} tags - List of all tags.
 * @param {string} textFilter - Text to filter tags by.
 * @param {string} sortOption - Sorting option to apply on filtered tags.
 * @returns {Array<TagSchema>} Filtered and sorted tags.
 */
export const filteredUserTagsStore = derived(
	[userTagsStore, userTagTextFilter, userTagSortingPreference],
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
	const sanitizedTagName = sanitizeContentOnClient(tagName);

	const normalizedName = sanitizedTagName.trim().toLowerCase();

	const currentTags = get(userTagsStore);

	return currentTags.some((tag) => tag.name.toLowerCase() === normalizedName);
};
